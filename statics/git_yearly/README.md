# Git 年度开发轨迹可视化工具

这是一个用于统计和可视化年度 Git 提交记录的工具，支持从 GitHub 和本地仓库获取数据，并生成美观的热点图。

## 功能特性

- 📊 可视化年度 Git 提交热点图
- ☁️ 自动获取 GitHub 提交数据（通过 GraphQL API）
- 💻 扫描本地 Git 仓库提交记录
- 🎨 iOS 风格的用户界面，支持暗黑模式
- 📱 响应式设计，支持移动端和桌面端
- 🔄 支持加载状态、错误处理和重试机制

## 目录结构

```
git_yearly/
├── git_yearly_reporyt.js    # 数据获取脚本
├── report.html              # 可视化页面
├── github_token             # GitHub Token 文件（需要自行创建）
├── data/                    # 数据文件目录
│   ├── 2024.json           # 2024 年数据
│   ├── 2025.json           # 2025 年数据
│   └── ...                 # 其他年份数据
└── README.md               # 使用说明
```

## 一、使用脚本获取数据

### 1. 准备工作

#### 1.1 创建 GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称，勾选 `public_repo` 权限（如果仓库是私有的，还需要勾选相应权限）
4. 生成 Token 后，复制 Token 值
5. 在 `git_yearly` 目录下创建 `github_token` 文件，将 Token 粘贴进去：

```bash
cd git_yearly
echo "your_github_token_here" > github_token
```

#### 1.2 运行脚本

脚本支持命令行参数，无需修改代码即可配置：

```bash
cd git_yearly
node git_yearly_reporyt.js [选项]
```

**命令行参数：**

- `-p, --path <路径>`: 本地代码仓库根目录（可选，不指定则只获取 GitHub 数据）
- `-e, --email <邮箱>`: Git 提交邮箱（可选，默认从 git config 读取）
- `-y, --year <年份>`: 统计年份（可选，默认当前年份）
- `-h, --help`: 显示帮助信息

**使用示例：**

```bash
# 只获取 GitHub 数据（使用当前年份和 git 配置的邮箱）
node git_yearly_reporyt.js

# 指定年份
node git_yearly_reporyt.js --year 2024

# 指定本地仓库目录
node git_yearly_reporyt.js --path /path/to/repos

# 完整参数
node git_yearly_reporyt.js --path /path/to/repos --year 2024 --email user@example.com
```

**说明：**

- 如果不指定 `--path`，脚本只会获取 GitHub 数据，不会扫描本地仓库
- 如果不指定 `--email`，脚本会自动从 `git config user.email` 读取
- 如果不指定 `--year`，脚本会使用当前年份
- 生成的数据文件会自动保存到 `data/年份.json`，例如 `data/2025.json`

### 3. 脚本执行流程

1. **获取 GitHub 数据**：通过 GraphQL API 获取指定年份的所有提交记录
2. **扫描本地仓库**（如果指定了 `--path` 参数）：
   - 递归扫描指定目录下的所有 Git 仓库
   - 自动排除 GitHub 仓库（避免重复统计）
   - 只统计指定邮箱的提交记录
3. **生成压缩数据**：将数据压缩为紧凑的 JSON 格式
4. **保存文件**：自动创建 `data` 目录（如果不存在），并将数据保存到 `data/年份.json`

### 4. 数据格式说明

生成的数据文件格式如下：

```json
{
  "github": {
    "1": { "2": 5, "15": 3 }, // 1月2日5次提交，1月15日3次提交
    "2": { "10": 2 } // 2月10日2次提交
  },
  "other": {
    "3": { "5": 1 }, // 3月5日1次提交（来自本地仓库）
    "4": { "20": 4 } // 4月20日4次提交
  }
}
```

**格式特点：**

- 月份和日期使用数字字符串（不补零），例如 `"1"` 表示 1 月，`"2"` 表示 2 日
- 数值表示该日期的提交次数
- `github` 字段存储 GitHub 提交数据
- `other` 字段存储本地仓库提交数据

## 二、使用 report.html 可视化数据

### 1. 基本使用

#### 方式一：使用默认数据文件

默认情况下，`report.html` 会自动读取 `data` 目录下当前年份的数据文件。例如，如果是 2025 年，会自动读取 `data/2025.json`。

```bash
# 在浏览器中打开
open report.html
# 或
xdg-open report.html  # Linux
```

**注意：** 由于浏览器安全限制，直接打开 HTML 文件可能无法访问本地文件。建议使用本地服务器（见下方）。

#### 方式二：通过 URL 参数传入自定义数据

在浏览器中打开 `report.html` 时，可以通过 URL 参数指定数据文件路径、姓名和年份：

```
report.html?url=./data/2024.json
report.html?url=./data/my_report.json&name=张三
report.html?url=./data/2024.json&name=李四&year=2024
report.html?name=王五&year=2023
report.html?json=./custom_data.json&name=赵六
```

**参数说明：**

- `url` 或 `json`：数据文件的路径（支持相对路径、绝对路径或 URL）
- `name` 或 `n`：显示在标题中的姓名（可选）
- `year` 或 `y`：指定年份（可选，默认从文件路径或当前年份推断）
- 如果不提供 `url` 参数，默认使用 `./data/当前年份.json`
- 如果提供了 `name` 参数，标题会显示为 "xxx xxxx 年的年度开发轨迹"
- 如果不提供 `name` 参数，标题会显示为 "xxxx 年度开发轨迹"

### 2. 使用自定义数据

#### 2.1 准备数据文件

确保你的数据文件符合以下格式，并保存到 `data` 目录下：

```json
{
  "github": {
    "1": { "2": 5, "15": 3 },
    "2": { "10": 2 }
  },
  "other": {
    "3": { "5": 1 },
    "4": { "20": 4 }
  }
}
```

**推荐的文件组织方式：**

```
data/
├── 2023.json
├── 2024.json
├── 2025.json
└── ...
```

#### 2.2 使用本地文件

**相对路径（推荐）：**

```
report.html?url=./data/2024.json
report.html?url=./data/my_report.json
```

**绝对路径：**

```
report.html?url=/Users/username/data/report.json
```

**注意：** 由于浏览器安全限制，直接打开 HTML 文件时，只能访问同目录或子目录的文件。如果需要访问其他目录的文件，建议使用本地服务器。

#### 2.3 使用本地服务器（推荐）

使用 Python 启动本地服务器：

```bash
# Python 3
cd git_yearly
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器中访问：

```
http://localhost:8000/report.html
# 或指定特定年份
http://localhost:8000/report.html?url=./data/2024.json
# 或指定姓名和年份
http://localhost:8000/report.html?name=张三&year=2024
# 完整参数
http://localhost:8000/report.html?url=./data/2024.json&name=李四&year=2024
```

或使用 Node.js 的 `http-server`：

```bash
cd git_yearly
npx http-server -p 8000
```

#### 2.4 使用远程 URL

如果数据文件托管在网络上，可以直接使用 URL：

```
report.html?url=https://example.com/data/git_report_2025.json
```

### 3. 页面功能

- **切换视图**：点击 "All"、"GitHub"、"Work/Other" 按钮切换不同的数据视图
- **交互提示**：鼠标悬停在热点图上可以查看具体日期的提交次数
- **响应式布局**：
  - 宽屏时：热点图居中显示
  - 窄屏时：热点图左对齐，支持横向滚动
- **暗黑模式**：自动跟随系统主题

### 4. 状态说明

页面支持以下状态：

- **加载中**：显示 iOS 风格的加载动画
- **加载失败**：显示错误信息，提供重试按钮
- **空数据**：当数据文件为空或格式不正确时显示提示
- **成功加载**：显示完整的热点图和交互界面

## 三、常见问题

### Q1: 脚本执行时提示 "无法读取 github_token 文件"

**解决方案：**

1. 确保 `github_token` 文件存在于脚本同目录下
2. 检查文件权限，确保可读

### Q2: GitHub API 返回错误

**可能原因：**

- Token 无效或已过期
- Token 权限不足
- 网络连接问题

**解决方案：**

1. 重新生成 GitHub Token
2. 确保 Token 有 `public_repo` 权限
3. 检查网络连接

### Q3: 本地仓库扫描不到数据

**可能原因：**

- 邮箱地址不匹配
- 仓库路径配置错误
- 仓库中没有指定年份的提交

**解决方案：**

1. 检查 `targetEmail` 配置是否正确
2. 确认 `rootPath` 路径正确
3. 使用 `git log --author="your_email" --since="2025-01-01"` 验证仓库中是否有提交记录

### Q4: report.html 无法加载数据文件

**可能原因：**

- 文件路径错误
- 跨域问题（使用 file:// 协议）
- 数据格式不正确

**解决方案：**

1. 使用本地服务器而不是直接打开文件
2. 检查数据文件格式是否正确
3. 查看浏览器控制台的错误信息

### Q5: 如何查看不同年份的数据？

**方法一：** 通过 URL 参数指定数据文件

```
report.html?url=./data/2024.json
```

**方法二：** 修改 `report.html` 中的 `targetYear` 变量（不推荐，建议使用方法一）

```javascript
const targetYear = 2024; // 修改为你想要的年份
```

同时确保 `data` 目录下有对应年份的数据文件。

## 四、在 Markdown 中嵌入热点图

### 1. 使用 iframe 嵌入（推荐）

在支持 HTML 的 Markdown 环境中（如博客、Hexo、VuePress 等），可以使用 `<iframe>` 嵌入热点图：

#### 基础嵌入

```html
<iframe
  src="https://your-domain.com/statics/git_yearly/report.html"
  width="100%"
  height="220"
  frameborder="0"
  scrolling="no"
  style="border: none; overflow: hidden;"
>
</iframe>
```

#### 带参数嵌入

```html
<!-- 指定年份 -->
<iframe
  src="https://your-domain.com/statics/git_yearly/report.html?year=2024"
  width="100%"
  height="220"
  frameborder="0"
>
</iframe>

<!-- 指定姓名和年份 -->
<iframe
  src="https://your-domain.com/statics/git_yearly/report.html?name=张三&year=2024"
  width="100%"
  height="220"
  frameborder="0"
>
</iframe>

<!-- 使用自定义数据源 -->
<iframe
  src="https://your-domain.com/statics/git_yearly/report.html?url=./data/2024.json&name=李四"
  width="100%"
  height="220"
  frameborder="0"
>
</iframe>
```

#### 响应式嵌入

> **注意：** 热点图的最小高度约为 **204px**，建议设置 `height="220"` 确保完整显示。

使用 `position: absolute` 时，**父容器必须有明确的高度**，否则 iframe 会高度为 0：

```html
<!-- ✅ 方案1：简单直接，推荐 -->
<iframe
  src="https://jixiaoyong.github.io/statics/git_yearly/report.html?year=2025"
  width="100%"
  height="220"
  frameborder="0"
  scrolling="no"
  style="border: none;"
>
</iframe>

<!-- ✅ 方案2：响应式，需要父容器有 min-height -->
<div style="position: relative; width: 100%; min-height: 220px;">
  <iframe
    src="https://jixiaoyong.github.io/statics/git_yearly/report.html?year=2025"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    scrolling="no"
  >
  </iframe>
</div>
```

### 2. 直接链接

如果 Markdown 环境不支持 iframe，可以创建链接让用户点击查看：

```markdown
[📊 查看 2025 年度开发轨迹](https://your-domain.com/statics/git_yearly/report.html)

[📊 查看张三的年度开发轨迹](https://your-domain.com/statics/git_yearly/report.html?name=张三&year=2025)
```

### 3. 在不同平台的使用方式

#### GitHub README

> **注意：** GitHub 不支持 iframe，只能使用链接方式。

```markdown
## 我的年度开发轨迹

[![Git Yearly Heatmap](https://img.shields.io/badge/📊-查看热点图-blue)](https://your-domain.com/statics/git_yearly/report.html?name=YourName)
```

#### Hexo / Hugo / VuePress 等静态博客

这些博客系统通常支持 HTML，可以直接使用 iframe：

```markdown
---
title: 我的年度总结
---

## 开发轨迹

<iframe 
  src="/statics/git_yearly/report.html?year=2025" 
  width="100%" 
  height="220" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
</iframe>

今年一共提交了 xxx 次代码...
```

#### Notion

Notion 支持嵌入网页，可以使用 `/embed` 命令：

1. 输入 `/embed`
2. 粘贴链接：`https://your-domain.com/statics/git_yearly/report.html?name=YourName`
3. 调整显示大小

#### 语雀 / 飞书文档

这些平台通常支持嵌入外部网页，查找"嵌入网页"或"iframe"功能，粘贴链接即可。

### 4. URL 参数速查表

| 参数    | 简写   | 说明                    | 示例                    |
| ------- | ------ | ----------------------- | ----------------------- |
| `url`   | `json` | 数据文件路径            | `?url=./data/2024.json` |
| `name`  | `n`    | 显示的姓名              | `?name=张三`            |
| `year`  | `y`    | 年份                    | `?year=2024`            |
| `theme` | `t`    | 主题：`light` 或 `dark` | `?theme=dark`           |

**组合示例：**

```
report.html?name=张三&year=2024
report.html?url=./data/custom.json&name=李四&year=2023
report.html?year=2025&theme=dark
```

### 5. 父页面动态切换主题

如果父页面需要动态切换主题（例如用户点击主题切换按钮），可以通过 `postMessage` 通知 iframe：

```javascript
// 父页面 JavaScript
const iframe = document.querySelector("iframe");

// 切换到深色主题
iframe.contentWindow.postMessage({ type: "theme-change", theme: "dark" }, "*");

// 切换到亮色主题
iframe.contentWindow.postMessage({ type: "theme-change", theme: "light" }, "*");
```

## 五、高级用法

### 自定义数据生成

你可以编写自己的脚本生成符合格式的数据文件：

```javascript
const fs = require("fs");
const path = require("path");

const data = {
  github: {
    1: { 2: 5, 15: 3 }, // 月份: { 日期: 提交次数 }
    2: { 10: 2 },
  },
  other: {
    3: { 5: 1 },
    4: { 20: 4 },
  },
};

// 确保 data 目录存在
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 保存到 data 目录
const year = 2025;
fs.writeFileSync(path.join(dataDir, `${year}.json`), JSON.stringify(data));
```

### 批量处理多个年份

可以使用 shell 脚本批量处理多个年份：

```bash
#!/bin/bash
for year in 2023 2024 2025; do
  node git_yearly_reporyt.js --year $year --path /path/to/repos
done
```

或者只获取 GitHub 数据（不扫描本地仓库）：

```bash
#!/bin/bash
for year in 2023 2024 2025; do
  node git_yearly_reporyt.js --year $year
done
```

## 六、技术说明

- **数据压缩**：使用月份和日期作为键，避免存储大量日期字符串，大幅减小文件大小
- **GraphQL API**：使用 GitHub 的 GraphQL API 获取提交数据，比 REST API 更高效
- **Canvas 渲染**：使用 HTML5 Canvas 绘制热点图，性能优异
- **响应式设计**：使用 Flexbox 和媒体查询实现响应式布局

## 许可证

MIT License
