/**
 * JI,XIAOYONG's Website — 经典杂志 · 暖雾/暖夜
 */

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

const html = document.documentElement;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

let currentTheme = localStorage.getItem("theme") || "system";

function resolveTheme(theme) {
  if (theme === "system") {
    return prefersDark.matches ? "dark" : "light";
  }
  return theme;
}

const AVATAR_LIGHT = "/imissyou/assets/avatar-light.webp";
const AVATAR_DARK = "/imissyou/assets/avatar-dark.webp";

function updateAvatar() {
  const img = document.getElementById("avatar-img");
  if (!img) return;
  const src = html.getAttribute("data-theme") === "dark" ? AVATAR_DARK : AVATAR_LIGHT;
  if (img.getAttribute("src") !== src) img.src = src;
}

function applyTheme(theme) {
  currentTheme = theme;
  const resolved = resolveTheme(theme);

  if (theme === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", theme);
  }

  html.setAttribute("data-theme", resolved);
  updateAvatar();

  document.querySelectorAll(".theme-toggle[data-theme]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

applyTheme(currentTheme);

prefersDark.addEventListener("change", () => {
  if (currentTheme === "system") {
    html.setAttribute("data-theme", prefersDark.matches ? "dark" : "light");
    updateAvatar();
  }
});

/* ── 主题切换 UI ── */
const themeContainer = document.querySelector(".theme-toggle-container");
const toggleExpand = document.querySelector(".toggle-expand");
let autoCollapseTimer = null;
let ignoreOutsideClick = false;

function expandThemeContainer() {
  themeContainer.classList.remove("collapsed");
  startAutoCollapseTimer();
}

function collapseThemeContainer() {
  if (themeContainer.classList.contains("collapsed")) return;
  themeContainer.classList.add("collapsed");
  if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
}

function startAutoCollapseTimer() {
  if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
  autoCollapseTimer = setTimeout(collapseThemeContainer, 12000);
}

if (toggleExpand) {
  toggleExpand.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    ignoreOutsideClick = true;
    expandThemeContainer();
    requestAnimationFrame(() => { ignoreOutsideClick = false; });
  });
}

if (themeContainer) {
  themeContainer.addEventListener("mouseenter", expandThemeContainer);
  themeContainer.addEventListener("mouseleave", collapseThemeContainer);
}

themeContainer.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.querySelectorAll(".theme-toggle[data-theme]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    applyTheme(btn.dataset.theme);
    collapseThemeContainer();
  });
});

document.addEventListener("click", () => {
  if (ignoreOutsideClick) return;
  collapseThemeContainer();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") collapseThemeContainer();
});

/* ── 鼠标光晕 ── */
const cursorGlow = document.getElementById("cursor-glow");

if (cursorGlow && finePointer.matches && !prefersReducedMotion.matches) {
  document.body.dataset.glow = "on";
  window.addEventListener("pointermove", throttle((e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  }, 16), { passive: true });
} else {
  document.body.dataset.glow = "off";
}

/* ── 头像彩蛋：连点 3 次 ── */
const avatar = document.getElementById("avatar");
let clickCount = 0;
let clickTimer = null;
let fireworkActive = false;

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function createSparkles() {
  if (fireworkActive || prefersReducedMotion.matches) return;
  fireworkActive = true;
  const rect = avatar.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ["#fb923c", "#fcd34d", "#fbbf24", "#fdba74"];

  for (let i = 0; i < 18; i++) {
    const dot = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 18;
    const dist = 40 + Math.random() * 60;
    dot.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;width:6px;height:6px;border-radius:50%;
      background:${colors[i % colors.length]};pointer-events:none;z-index:300;
      transform:translate(-50%,-50%);transition:transform 0.7s ease-out,opacity 0.7s;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
      dot.style.opacity = "0";
    });
    setTimeout(() => dot.remove(), 800);
  }

  setTimeout(() => {
    fireworkActive = false;
    window.open("https://jixiaoyong.github.io/imissyou", "_blank", "noopener");
  }, 900);
}

if (avatar) {
  avatar.addEventListener("click", () => {
    if (fireworkActive) return;
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    if (clickCount >= 3) {
      clickCount = 0;
      showToast("芝麻开门! 🥳");
      createSparkles();
      return;
    }
    clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
  });
}

/* ── 头像加载 fallback ── */
const avatarImg = document.getElementById("avatar-img");
if (avatarImg) {
  avatarImg.addEventListener("error", function () {
    const fallback = "https://jixiaoyong.github.io/images/moments/20250101010014.jpeg";
    if (this.src !== fallback) this.src = fallback;
  });
  avatarImg.addEventListener("load", function () { this.classList.add("loaded"); });
  if (avatarImg.complete && avatarImg.naturalHeight) avatarImg.classList.add("loaded");
  updateAvatar();
}

/* ── 年份 ── */
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── GitHub 贡献图（DOM 就绪即挂载，不等待图片/字体） ── */
function mountGithubContrib() {
  if (typeof GithubContrib !== "undefined") {
    GithubContrib.mount(document.getElementById("github-contrib"), {});
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountGithubContrib);
} else {
  mountGithubContrib();
}
