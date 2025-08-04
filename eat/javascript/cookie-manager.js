// =================================================================================================
// CookieManager Class - 处理本地 Cookie 存储
// =================================================================================================

class CookieManager {
  constructor() {
    this.cookieName = "eatAppData";
    this.expireDays = 365; // Cookie 过期时间（天）
  }

  // 设置 Cookie
  setCookie(name, value, days = this.expireDays) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieValue =
      encodeURIComponent(JSON.stringify(value)) +
      (days ? `; expires=${expires.toUTCString()}` : "") +
      "; path=/";
    document.cookie = `${name}=${cookieValue}`;
  }

  // 获取 Cookie
  getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(
            decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
          );
        } catch (e) {
          console.warn("Cookie 解析失败：", e);
          return null;
        }
      }
    }
    return null;
  }

  // 删除 Cookie
  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // 保存应用数据到 Cookie
  saveAppData(data) {
    try {
      this.setCookie(this.cookieName, data);
      return true;
    } catch (error) {
      console.error("保存 Cookie 失败：", error);
      return false;
    }
  }

  // 从 Cookie 加载应用数据
  loadAppData() {
    try {
      return this.getCookie(this.cookieName);
    } catch (error) {
      console.error("加载 Cookie 失败：", error);
      return null;
    }
  }

  // 清除所有 Cookie 数据
  clearAllData() {
    this.deleteCookie(this.cookieName);
  }

  // 检查 Cookie 是否可用
  isCookieEnabled() {
    try {
      this.setCookie("test", "test", 1);
      const result = this.getCookie("test");
      this.deleteCookie("test");
      return result === "test";
    } catch (error) {
      return false;
    }
  }

  // 获取 Cookie 大小（字节）
  getCookieSize() {
    const cookie = document.cookie;
    return cookie ? new Blob([cookie]).size : 0;
  }

  // 检查 Cookie 大小是否超限（4KB 限制）
  isCookieSizeValid() {
    return this.getCookieSize() < 4096;
  }
}
