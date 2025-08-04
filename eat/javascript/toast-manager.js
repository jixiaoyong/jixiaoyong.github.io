// =================================================================================================
// ToastManager Class - Toast通知管理类
// =================================================================================================

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  // 初始化Toast容器
  init() {
    this.container = document.createElement("div");
    this.container.id = "toast-container";
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  // 显示Toast
  show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      padding: 12px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      margin-bottom: 10px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      pointer-events: auto;
      cursor: pointer;
    `;

    // 设置背景色
    const colors = {
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    this.container.appendChild(toast);

    // 添加显示动画
    setTimeout(() => (toast.style.transform = "translateX(0)"), 10);

    // 点击关闭
    toast.addEventListener("click", () => this.hide(toast));

    // 自动移除
    setTimeout(() => this.hide(toast), duration);
  }

  // 隐藏Toast
  hide(toast) {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // 快捷方法
  success(message, duration) {
    this.show(message, "success", duration);
  }

  error(message, duration) {
    this.show(message, "error", duration);
  }

  warning(message, duration) {
    this.show(message, "warning", duration);
  }

  info(message, duration) {
    this.show(message, "info", duration);
  }
}
