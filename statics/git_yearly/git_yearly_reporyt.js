const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

// ================= 配置区 =================
// 1. 读取 Token
let githubToken = "";
try {
  githubToken = fs
    .readFileSync(path.join(__dirname, "github_token"), "utf8")
    .trim();
} catch (e) {
  console.error("❌ 无法读取 github_token 文件");
  process.exit(1);
}

// 2. 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    rootPath: null,
    targetEmail: null,
    targetYear: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--path" || args[i] === "-p") {
      config.rootPath = args[++i];
    } else if (args[i] === "--email" || args[i] === "-e") {
      config.targetEmail = args[++i];
    } else if (args[i] === "--year" || args[i] === "-y") {
      config.targetYear = args[++i];
    }
  }
  return config;
}

// 3. 从 git 配置读取邮箱
function getGitEmail() {
  try {
    return execSync("git config user.email", { stdio: "pipe" })
      .toString()
      .trim();
  } catch (e) {
    return null;
  }
}

const config = parseArgs();
const currentYear = new Date().getFullYear().toString();
const targetYear = config.targetYear || currentYear;

// 确保输出目录存在
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// 定义两个输出文件名
const publicFileName = path.join(dataDir, `${targetYear}.json`); // 公开文件
const privateFileName = path.join(dataDir, `${targetYear}.details.json`); // 详细文件

let targetEmail = config.targetEmail || getGitEmail();
if (!targetEmail) {
  console.error("❌ 无法获取邮箱地址");
  process.exit(1);
}

const rootPath = config.rootPath;
console.log(`📅 统计年份: ${targetYear} | 📧 邮箱: ${targetEmail}`);
if (rootPath) console.log(`📁 扫描目录: ${rootPath}`);

// ================= 数据结构定义 =================

// 1. 公开数据 (只包含热力图计数)
const publicData = {
  meta: { year: parseInt(targetYear), type: "summary" },
  github: {}, // { "1": {"2": 5} }
  other: {},  // { "1": {"5": 2} }
};

// 2. 详细数据 (包含仓库名、时间、Message)
const privateData = {
  meta: { year: parseInt(targetYear), type: "details" },
  repos: [], // ['repoA', 'repoB'] 仓库索引
  commits: [] // [{ d: '01-02', t: '14:30', r: 0, m: 'fix bug' }]
};

// ================= 辅助函数 =================

/**
 * 写入热力图计数 (用于 publicData)
 */
function addHeatmapCount(targetObj, dateObj, count) {
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  if (!targetObj[month]) targetObj[month] = {};
  targetObj[month][day] = (targetObj[month][day] || 0) + count;
}

/**
 * 获取或创建仓库 ID (用于 privateData 压缩)
 */
function getRepoId(repoName) {
  let idx = privateData.repos.indexOf(repoName);
  if (idx === -1) {
    idx = privateData.repos.length;
    privateData.repos.push(repoName);
  }
  return idx;
}

// ================= 核心逻辑 =================

/**
 * 1. 获取 GitHub 数据
 * (GitHub API 限制较多，通常只获取热力图计数，不获取详细 Message)
 */
async function fetchGitHub() {
  console.log("☁️ 正在获取 GitHub 数据...");
  const cleanToken = githubToken.replace(/[^\x21-\x7E]/g, "");
  const query = JSON.stringify({
    query: `{
            viewer {
                login
                contributionsCollection(from: "${targetYear}-01-01T00:00:00Z", to: "${targetYear}-12-31T23:59:59Z") {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }`,
  });

  const options = {
    hostname: "api.github.com",
    path: "/graphql",
    method: "POST",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/json",
      "User-Agent": "NodeJS-Git-Stats",
      "Content-Length": Buffer.byteLength(query),
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.data?.viewer) {
            const weeks =
              json.data.viewer.contributionsCollection.contributionCalendar
                .weeks;
            let total = 0;
            weeks.forEach((w) => {
              w.contributionDays.forEach((d) => {
                if (d.contributionCount > 0) {
                  // 只写入公开数据的 github 字段
                  addHeatmapCount(
                    publicData.github,
                    new Date(d.date),
                    d.contributionCount
                  );
                  total += d.contributionCount;
                }
              });
            });
            console.log(`✅ GitHub 数据获取成功，共 ${total} 次提交`);
            resolve(true);
          } else {
            console.error("❌ GitHub API 返回异常");
            resolve(false);
          }
        } catch (e) {
          console.error("❌ 解析 GitHub 响应失败");
          resolve(false);
        }
      });
    });
    req.on("error", () => resolve(false));
    req.write(query);
    req.end();
  });
}

/**
 * 2. 扫描本地仓库
 * (同时填充 publicData 的 other 字段 和 privateData 的所有字段)
 */
function scanLocal(dir) {
  let localCount = 0;
  function traverse(currentDir) {
    const resolvedPath = currentDir.startsWith("~")
      ? currentDir.replace("~", process.env.HOME)
      : currentDir;
    try {
      const files = fs.readdirSync(resolvedPath);
      if (files.includes(".git")) {
        let remote = "";
        try {
          remote = execSync("git remote get-url origin", {
            cwd: resolvedPath,
            stdio: "pipe",
          }).toString();
        } catch (e) { }

        // 排除 GitHub 仓库，避免热力图数据重复
        // (注意：详细数据里你可以选择是否包含 github 的本地提交，这里默认排除以保持一致)
        if (!remote.includes("github.com")) {
          const repoName = path.basename(resolvedPath);
          const repoId = getRepoId(repoName); // 这一步会更新 privateData.repos

          // git log 获取: ISO日期 | 提交信息
          const logCmd = `git log --author="${targetEmail}" --since="${targetYear}-01-01" --until="${targetYear}-12-31" --pretty=format:"%ai|%s"`;
          try {
            const output = execSync(logCmd, { cwd: resolvedPath })
              .toString()
              .trim();
            if (output) {
              const lines = output.split("\n");
              lines.forEach((line) => {
                const [fullDateStr, msg] = line.split("|");
                // fullDateStr: "2025-05-20 14:30:00 +0800"

                const [datePart, timePart] = fullDateStr.split(" ");
                const [y, m, d] = datePart.split("-");
                const [hour, minute] = timePart.split(":");

                // --- 写入公开数据 (Public) ---
                addHeatmapCount(publicData.other, new Date(datePart), 1);

                // --- 写入详细数据 (Private) ---
                // d: MM-DD, t: HH:mm, r: repoID, m: message
                privateData.commits.push({
                  d: `${m}-${d}`,
                  t: `${hour}:${minute}`,
                  r: repoId,
                  m: msg ? msg.substring(0, 80) : "", // 截断过长消息
                });

                localCount++;
              });
              console.log(`✅ 扫描本地: ${repoName} (${lines.length})`);
            }
          } catch (e) { }
        }
        return;
      }
      for (const file of files) {
        const fullPath = path.join(resolvedPath, file);
        if (
          fs.statSync(fullPath).isDirectory() &&
          !file.startsWith(".") &&
          file !== "node_modules"
        ) {
          traverse(fullPath);
        }
      }
    } catch (e) { }
  }

  console.log(`📂 正在扫描本地目录: ${rootPath}`);
  traverse(dir);
  console.log(`✅ 本地扫描完成，共 ${localCount} 次提交`);
}

// ================= 执行入口 =================

async function main() {
  console.log(`🚀 开始执行 ${targetYear} 年度统计...`);

  // 并行或串行执行均可，这里用串行保证日志清晰
  await fetchGitHub();
  if (rootPath) scanLocal(rootPath);

  // 对详细数据按时间排序 (从早到晚 或 从晚到早 均可，这里按日期排序方便查看)
  privateData.commits.sort((a, b) => {
    if (a.d !== b.d) return a.d.localeCompare(b.d);
    return a.t.localeCompare(b.t);
  });

  // --- 输出文件 1: 公开简略版 ---
  const publicJson = JSON.stringify(publicData);
  fs.writeFileSync(publicFileName, publicJson);
  console.log(`\n💾 [公开] 简略热力图数据: ${publicFileName}`);
  console.log(`   大小: ${(publicJson.length / 1024).toFixed(2)} KB`);

  // --- 输出文件 2: 私有详细版 ---
  const privateJson = JSON.stringify(privateData);
  fs.writeFileSync(privateFileName, privateJson);
  console.log(`💾 [私有] 详细分析数据:   ${privateFileName}`);
  console.log(`   大小: ${(privateJson.length / 1024).toFixed(2)} KB`);
  console.log(`   包含 ${privateData.commits.length} 条详细提交记录`);

  console.log(`\n✨ 全部完成！`);
}

main();