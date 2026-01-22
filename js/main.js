/**
 * JI,XIAOYONG's Website - 主脚本
 * 性能优化版本：从内联脚本拆分为外部文件，支持 defer 加载
 */

/**
 * 性能优化：节流函数
 * 限制函数执行频率，避免过度调用
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 移动端检测函数 - 简化和稳定化，使用媒体查询缓存
let isMobileDevice = null;
function isMobile() {
  if (isMobileDevice === null) {
    isMobileDevice = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
  }
  return isMobileDevice;
}

// 监听窗口大小变化，更新移动端状态
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isMobileDevice = window.innerWidth <= 768;
  }, 250);
});

// 鼠标移动光晕效果 - 优化版本
let glowElements = [];
const maxGlowElements = 3;

// 移动端禁用鼠标光晕效果以提升性能
const throttledMouseMove = throttle((e) => {
  // 移动端不执行光晕效果
  if (isMobile()) return;
  
  const container = document.querySelector(".container");
  if (!container) return;

  const { clientX, clientY } = e;
  const { left, top } = container.getBoundingClientRect();

  const x = clientX - left;
  const y = clientY - top;

  container.style.setProperty("--x", `${x}px`);
  container.style.setProperty("--y", `${y}px`);

  // 限制光晕元素数量，提升性能
  while (glowElements.length >= maxGlowElements) {
    const oldGlow = glowElements.shift();
    if (oldGlow && oldGlow.parentNode) {
      oldGlow.parentNode.removeChild(oldGlow);
    }
  }

  const glow = document.createElement("div");
  glow.className = "glow";
  glow.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
    transition: width 2s ease-out, height 2s ease-out, opacity 2s ease-out;
    opacity: 0.3;
    filter: blur(5px);
    will-change: width, height, opacity;
  `;

  container.appendChild(glow);
  glowElements.push(glow);

  requestAnimationFrame(() => {
    glow.style.width = "300px";
    glow.style.height = "300px";
    glow.style.opacity = "0";
  });

  setTimeout(() => {
    if (glow.parentNode === container) {
      container.removeChild(glow);
      const index = glowElements.indexOf(glow);
      if (index > -1) {
        glowElements.splice(index, 1);
      }
    }
  }, 2000);
}, 50);

// 只在非移动端添加鼠标移动事件
if (!isMobile()) {
  document.addEventListener("mousemove", throttledMouseMove);
}

// 卡片悬停效果 - 移动端禁用以提升性能
const card = document.querySelector(".card");
if (card && !isMobile()) {
  const throttledCardMove = throttle((e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    card.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${-x * 5}deg)`;
    card.style.boxShadow = `${-x * 20}px ${y * 20}px 30px rgba(0, 0, 0, 0.2)`;
  }, 16); // 约 60fps

  card.addEventListener("mousemove", throttledCardMove);

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    card.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.1)";
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      card.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.3)";
    }
  });
}

// Theme switching functionality
const themeToggles = document.querySelectorAll(".theme-toggle[data-theme]");
const toggleExpand = document.querySelector(".toggle-expand");
const themeContainer = document.querySelector(".theme-toggle-container");
const html = document.documentElement;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentTheme = localStorage.getItem("theme") || "system";
let autoCollapseTimer = null;

function applyTheme(theme) {
  html.removeAttribute("data-theme");

  if (theme === "system") {
    localStorage.removeItem("theme");
    const systemTheme = prefersDark.matches ? "dark" : "light";
    html.setAttribute("data-theme", systemTheme);
  } else {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  themeToggles.forEach((toggle) => {
    if (toggle.dataset.theme === theme) {
      toggle.classList.add("active");
    } else {
      toggle.classList.remove("active");
    }
  });

  currentTheme = theme;
}

const savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  currentTheme = "system";
} else {
  currentTheme = savedTheme;
}
applyTheme(currentTheme);

function expandThemeContainer() {
  themeContainer.classList.remove("collapsed");
  startAutoCollapseTimer();
}

function collapseThemeContainer() {
  themeContainer.classList.add("collapsed");
  if (autoCollapseTimer) {
    clearTimeout(autoCollapseTimer);
    autoCollapseTimer = null;
  }
}

function startAutoCollapseTimer() {
  if (autoCollapseTimer) {
    clearTimeout(autoCollapseTimer);
  }
  autoCollapseTimer = setTimeout(() => {
    collapseThemeContainer();
  }, 15000);
}

if (toggleExpand) {
  toggleExpand.addEventListener("click", (e) => {
    e.stopPropagation();
    if (themeContainer.classList.contains("collapsed")) {
      expandThemeContainer();
    } else {
      collapseThemeContainer();
    }
  });
}

if (!isMobile()) {
  let hoverTimeout = null;

  themeContainer.addEventListener("mouseenter", () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    expandThemeContainer();
  });

  themeContainer.addEventListener("mouseleave", () => {
    hoverTimeout = setTimeout(() => {
      collapseThemeContainer();
    }, 500);
  });
}

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const theme = toggle.dataset.theme;
    applyTheme(theme);
    collapseThemeContainer();
  });
});

document.addEventListener("click", (e) => {
  if (!themeContainer.contains(e.target)) {
    if (isMobile() || !themeContainer.matches(":hover")) {
      collapseThemeContainer();
    }
  }
});

prefersDark.addEventListener("change", (e) => {
  if (currentTheme === "system") {
    const systemTheme = e.matches ? "dark" : "light";
    html.setAttribute("data-theme", systemTheme);
  }
});

window.addEventListener("load", () => {
  document.body.classList.remove("loading");
});

// 性能优化：事件委托和移动端适配
document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.querySelector(".avatar");
  let avatarTimeout = null;

  let clickCount = 0;
  let clickTimer = null;
  const requiredClicks = 3;
  const clickTimeWindow = 3000;
  let isFireworkActive = false;

  function handleAvatarClick() {
    if (isFireworkActive) return;

    clickCount++;

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const avatar = document.querySelector(".avatar");
    if (avatar) {
      avatar.classList.remove("click-1", "click-2", "firework-active");

      if (clickCount === 1) {
        avatar.classList.add("click-1");
      } else if (clickCount === 2) {
        avatar.classList.add("click-2");
      } else if (clickCount >= requiredClicks) {
        isFireworkActive = true;
        avatar.classList.add("firework-active");

        clickCount = 0;
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        showMessage("芝麻开门!🥳");
        createFireworks();

        setTimeout(() => {
          isFireworkActive = false;
          avatar.classList.remove("firework-active", "click-1", "click-2");
          window.open("https://jixiaoyong.github.io/imissyou", "_blank");
        }, 3000);

        return;
      }
    }

    clickTimer = setTimeout(() => {
      clickCount = 0;
      if (avatar) {
        avatar.classList.remove("click-1", "click-2");
      }
    }, clickTimeWindow);
  }

  function showMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: 600;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 2000);
  }

  function createFireworks() {
    const avatar = document.querySelector(".avatar");
    if (!avatar) return;

    const avatarRect = avatar.getBoundingClientRect();
    const centerX = avatarRect.left + avatarRect.width / 2;
    const centerY = avatarRect.top + avatarRect.height / 2;
    const avatarSize = avatarRect.width;

    const emojis = ["🥳", "🎊", "🎈", "🍾", "🎉", "✨", "🌟", "💫"];
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    ];

    const particles = [];

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.3;
        const startDistance = avatarSize / 2 + 10;
        const endDistance = 150 + Math.random() * 200;

        const startX = Math.cos(angle) * startDistance;
        const startY = Math.sin(angle) * startDistance;
        const endX = Math.cos(angle) * endDistance;
        const endY = Math.sin(angle) * endDistance;

        particle.textContent = randomEmoji;
        particle.style.cssText = `
          position: fixed;
          left: ${centerX + startX}px;
          top: ${centerY + startY}px;
          font-size: ${1.2 + Math.random() * 1.3}rem;
          z-index: 9998;
          pointer-events: none;
          animation: fireworkFromEdge 2s ease-out forwards;
          --end-x: ${endX - startX}px;
          --end-y: ${endY - startY}px;
          filter: drop-shadow(0 0 12px ${randomColor});
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        `;

        particles.push({
          element: particle,
          angle: angle,
          startDistance: startDistance,
          endDistance: endDistance,
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
        });

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.style.animation = `sparkle 1s ease-in-out infinite`;
        }, 2000);

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            const index = particles.findIndex((p) => p.element === particle);
            if (index > -1) {
              particles.splice(index, 1);
            }
          }
        }, 4000);
      }, i * 60);
    }

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2;
        const startDistance = avatarSize / 2 + 5;
        const endDistance = 120 + Math.random() * 180;

        const startX = Math.cos(angle) * startDistance;
        const startY = Math.sin(angle) * startDistance;
        const endX = Math.cos(angle) * endDistance;
        const endY = Math.sin(angle) * endDistance;

        particle.textContent = randomEmoji;
        particle.style.cssText = `
          position: fixed;
          left: ${centerX + startX}px;
          top: ${centerY + startY}px;
          font-size: ${1 + Math.random() * 1.8}rem;
          z-index: 9998;
          pointer-events: none;
          animation: fireworkFromEdge 2.5s ease-out forwards;
          --end-x: ${endX - startX}px;
          --end-y: ${endY - startY}px;
          filter: drop-shadow(0 0 10px ${randomColor});
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        `;

        particles.push({
          element: particle,
          angle: angle,
          startDistance: startDistance,
          endDistance: endDistance,
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
        });

        document.body.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            const index = particles.findIndex((p) => p.element === particle);
            if (index > -1) {
              particles.splice(index, 1);
            }
          }
        }, 3500);
      }, 1200 + i * 80);
    }

    function updatePositions() {
      const newAvatarRect = avatar.getBoundingClientRect();
      const newCenterX = newAvatarRect.left + newAvatarRect.width / 2;
      const newCenterY = newAvatarRect.top + newAvatarRect.height / 2;

      particles.forEach((particle) => {
        if (particle.element.parentNode) {
          const newStartX = Math.cos(particle.angle) * particle.startDistance;
          const newStartY = Math.sin(particle.angle) * particle.startDistance;

          particle.element.style.left = `${newCenterX + newStartX}px`;
          particle.element.style.top = `${newCenterY + newStartY}px`;
        }
      });
    }

    const resizeHandler = throttle(updatePositions, 100);
    window.addEventListener("resize", resizeHandler);

    setTimeout(() => {
      window.removeEventListener("resize", resizeHandler);
    }, 4000);
  }

  if (avatar) {
    if (!isMobile()) {
      avatar.addEventListener("mouseenter", () => {
        avatar.style.transform = "translateX(-50%) scale(1.05) rotate(5deg)";
        avatar.style.zIndex = "10";
      });
      avatar.addEventListener("mouseleave", () => {
        avatar.style.transform = "translateX(-50%) scale(1) rotate(0deg)";
        avatar.style.zIndex = "10";
      });
    }

    if (isMobile()) {
      avatar.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          avatar.style.transform = "translateX(-50%) scale(1.05)";
          avatar.style.zIndex = "10";

          if (avatarTimeout) {
            clearTimeout(avatarTimeout);
          }

          avatarTimeout = setTimeout(() => {
            avatar.style.transform = "translateX(-50%) scale(1)";
            avatar.style.zIndex = "10";
          }, 300);
        },
        { passive: false }
      );
    }

    avatar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAvatarClick();
    });

    if (isMobile()) {
      avatar.addEventListener("touchend", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAvatarClick();
      });
    }
  }

  const navLinks = document.querySelectorAll(".nav-link");
  const navLinkTimeouts = new Map();

  navLinks.forEach((link) => {
    if (!isMobile()) {
      link.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    }

    if (isMobile()) {
      link.addEventListener("touchstart", function (e) {
        if (navLinkTimeouts.has(this)) {
          clearTimeout(navLinkTimeouts.get(this));
        }

        this.style.transform = "scale(1.02)";
        this.style.transition = "transform 0.1s ease";

        const timeout = setTimeout(() => {
          this.style.transform = "scale(1)";
          navLinkTimeouts.delete(this);
        }, 150);

        navLinkTimeouts.set(this, timeout);
      });
    }
  });

  const name = document.querySelector(".name");
  const chars = document.querySelectorAll(".char");

  if (name && !isMobile()) {
    const throttledNameMove = throttle((e) => {
      const rect = name.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      chars.forEach((char) => {
        char.style.setProperty("--mouse-x", `${x}%`);
        char.style.setProperty("--mouse-y", `${y}%`);
      });
    }, 16);

    name.addEventListener("mousemove", throttledNameMove);
    name.addEventListener("mouseleave", () => {
      chars.forEach((char) => {
        char.style.setProperty("--mouse-x", "50%");
        char.style.setProperty("--mouse-y", "50%");
      });
    });
  }

  if (name) {
    name.addEventListener("click", () => {
      name.classList.add("shake");
      setTimeout(() => {
        name.classList.remove("shake");
      }, 500);
    });
  }
});

// 更新年份显示
function updateYear() {
  const now = new Date();
  const year = now.getFullYear();
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = year;
  }
}

updateYear();

// 内存清理和页面卸载处理
window.addEventListener("beforeunload", () => {
  glowElements.forEach((glow) => {
    if (glow && glow.parentNode) {
      glow.parentNode.removeChild(glow);
    }
  });
  glowElements = [];

  document.removeEventListener("mousemove", throttledMouseMove);
});

// 图片加载优化
document.addEventListener("DOMContentLoaded", function () {
  const avatarImg = document.querySelector(".avatar img");
  if (avatarImg) {
    avatarImg.addEventListener("error", function () {
      if (this.src.includes("user_avatar.webp")) {
        this.src = "https://jixiaoyong.github.io/images/moments/20250101010014.jpeg";
      }
    });

    avatarImg.addEventListener("load", function () {
      this.classList.add("loaded");
    });

    if (avatarImg.complete && avatarImg.naturalHeight !== 0) {
      avatarImg.classList.add("loaded");
    }
  }
});
