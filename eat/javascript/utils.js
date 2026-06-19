// =================================================================================================
// utils.js - 工具函数与 Toast 轻提示组件 (ESM Module)
// =================================================================================================

/**
 * 延迟函数
 * @param {number} ms 毫秒
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 随机获取数组中的元素
 * @param {Array} arr 
 * @returns {*}
 */
export const getRandomItem = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 打乱数组 (Fisher-Yates Shuffle)
 * @param {Array} array 
 * @returns {Array} 打乱后的新数组
 */
export const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/**
 * Toast 轻提示管理器
 */
class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }

    return toast;
  }

  remove(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }

  success(message, duration) { return this.show(message, 'success', duration); }
  error(message, duration) { return this.show(message, 'error', duration); }
  warning(message, duration) { return this.show(message, 'warning', duration); }
  info(message, duration) { return this.show(message, 'info', duration); }
}

const toastManager = new ToastManager();

export const toast = Object.assign(
  function(message, type, duration) {
    return toastManager.show(message, type, duration);
  },
  {
    success: (m, d) => toastManager.success(m, d),
    error: (m, d) => toastManager.error(m, d),
    warning: (m, d) => toastManager.warning(m, d),
    info: (m, d) => toastManager.info(m, d),
    show: (m, t, d) => toastManager.show(m, t, d)
  }
);

/**
 * 生成唯一标识ID
 * @param {string} prefix 前缀
 * @returns {string} 唯一ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化时间为友好可读的“多久以前”
 * @param {string|number|Date} time 
 * @returns {string}
 */
export function getTimeAgo(time) {
  const t = new Date(time).getTime();
  const now = Date.now();
  const diff = now - t;

  if (diff < 60000) return '刚刚';
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}分钟前`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}
