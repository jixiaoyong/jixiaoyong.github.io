// =================================================================================================
// Utils Class - 工具类
// =================================================================================================

class Utils {
  // HTML 转义
  static escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // 获取时间差
  static getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  }

  // 生成唯一ID
  static generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 验证数据完整性
  static validateGroup(group) {
    if (!group.id || !group.name || !group.items || !Array.isArray(group.items)) {
      return false;
    }
    return group.items.every(item => item.title && item.description);
  }

  // 深拷贝对象
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
} 