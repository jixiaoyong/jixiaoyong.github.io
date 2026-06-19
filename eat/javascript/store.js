// =================================================================================================
// store.js - 数据层状态管理器 (ESM Module)
// =================================================================================================

const STORAGE_KEY = "whatToEat_v2";
const OLD_STORAGE_KEY = "eatAppData";

const state = {
  activeMenuId: "menu_default",
  menus: [],
  drawHistory: [],
  blacklist: new Set() // 内存黑名单，会话级有效
};

const DEFAULT_MENUS = [
  {
    id: "menu_default",
    name: "🍱 经典打工人午餐",
    isSystem: true,
    createdAt: new Date().toISOString(),
    items: ["黄焖鸡米饭", "隆江猪脚饭", "兰州拉面", "麦当劳", "肯德基", "萨莉亚", "麻辣烫", "串串香", "沙县小吃", "冒菜", "汉堡"]
  },
  {
    id: "menu_weekend",
    name: "🔥 周末大餐",
    isSystem: true,
    createdAt: new Date().toISOString(),
    items: ["海底捞火锅", "东北铁锅炖", "日式烧肉", "蒸汽海鲜", "川味烤鱼", "椰子鸡", "潮汕牛肉火锅", "西冷牛排", "烤串", "烤肉"]
  }
];

function migrateOldData() {
  const oldDataStr = localStorage.getItem(OLD_STORAGE_KEY);
  if (!oldDataStr) return null;

  try {
    const oldData = JSON.parse(oldDataStr);
    console.log("检测到旧数据，启动向下兼容迁移...");

    const newMenus = [];
    if (oldData.groups && Array.isArray(oldData.groups)) {
      oldData.groups.forEach(group => {
        const items = (group.items || []).map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.title || item.name || '';
          }
          return '';
        }).filter(Boolean);

        if (items.length > 0) {
          newMenus.push({
            id: group.id === 'default' ? 'menu_default' : `menu_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: group.name || '自定义菜单',
            isSystem: group.id === 'default',
            createdAt: new Date().toISOString(),
            items: items
          });
        }
      });
    }

    const newHistory = (oldData.drawHistory || []).map(h => {
      return {
        result: typeof h.item === 'string' ? h.item : (h.item?.title || h.result || ''),
        menuId: h.group === '默认组合' ? 'menu_default' : 'menu_unknown',
        time: h.timestamp || new Date().toISOString()
      };
    }).filter(h => h.result);

    const migrated = {
      activeMenuId: oldData.currentGroup === 'default' ? 'menu_default' : (newMenus[0]?.id || 'menu_default'),
      menus: newMenus.length > 0 ? newMenus : DEFAULT_MENUS,
      drawHistory: newHistory
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(OLD_STORAGE_KEY);
    console.log("旧数据成功迁移！");
    return migrated;
  } catch (e) {
    console.error("旧数据迁移失败：", e);
    return null;
  }
}

export function initStore() {
  let data = migrateOldData();
  
  if (!data) {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        data = JSON.parse(localData);
      } catch (e) {
        console.error("数据加载解析失败：", e);
      }
    }
  }

  if (!data || !data.menus || data.menus.length === 0) {
    data = {
      activeMenuId: "menu_default",
      menus: DEFAULT_MENUS,
      drawHistory: []
    };
    saveToStorage(data);
  }

  state.activeMenuId = data.activeMenuId;
  state.menus = data.menus;
  state.drawHistory = data.drawHistory || [];
  state.blacklist.clear();
}

function saveToStorage(customData = null) {
  const payload = customData || {
    activeMenuId: state.activeMenuId,
    menus: state.menus,
    drawHistory: state.drawHistory
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("写入 localStorage 失败:", e);
  }
}

export const store = {
  getMenus() {
    return state.menus;
  },

  getActiveMenu() {
    return state.menus.find(m => m.id === state.activeMenuId) || state.menus[0];
  },

  setActiveMenu(menuId) {
    if (state.menus.some(m => m.id === menuId)) {
      state.activeMenuId = menuId;
      state.blacklist.clear(); 
      saveToStorage();
      window.dispatchEvent(new CustomEvent('activeMenuChanged', { detail: { menuId } }));
      return true;
    }
    return false;
  },

  saveMenu(id, name, items) {
    if (!name || name.trim() === '') {
      throw new Error('菜单名称不能为空');
    }
    if (!items || items.length === 0) {
      throw new Error('菜单至少需要包含一个菜名');
    }

    const trimmedItems = items.map(i => i.trim()).filter(Boolean);
    const existingIndex = state.menus.findIndex(m => m.id === id);

    if (existingIndex > -1) {
      const targetMenu = state.menus[existingIndex];
      state.menus[existingIndex] = {
        ...targetMenu,
        name: name.trim(),
        items: trimmedItems
      };
    } else {
      const newMenu = {
        id: id || `menu_${Date.now()}`,
        name: name.trim(),
        isSystem: false,
        createdAt: new Date().toISOString(),
        items: trimmedItems
      };
      state.menus.push(newMenu);
      state.activeMenuId = newMenu.id;
    }

    state.blacklist.clear();
    saveToStorage();
    window.dispatchEvent(new CustomEvent('menusUpdated'));
  },

  deleteMenu(menuId) {
    const targetMenu = state.menus.find(m => m.id === menuId);
    if (!targetMenu) {
      throw new Error('菜单不存在');
    }
    if (targetMenu.isSystem) {
      throw new Error('系统内置默认菜单不能删除');
    }

    state.menus = state.menus.filter(m => m.id !== menuId);
    
    if (state.activeMenuId === menuId) {
      state.activeMenuId = state.menus[0]?.id || 'menu_default';
    }
    
    state.blacklist.clear();
    saveToStorage();
    window.dispatchEvent(new CustomEvent('menusUpdated'));
  },

  toggleBlacklist(item) {
    if (state.blacklist.has(item)) {
      state.blacklist.delete(item);
    } else {
      state.blacklist.add(item);
    }
    window.dispatchEvent(new CustomEvent('blacklistUpdated'));
  },

  isBlacklisted(item) {
    return state.blacklist.has(item);
  },

  getFilteredPool() {
    const active = this.getActiveMenu();
    if (!active) return [];
    return active.items.filter(item => !state.blacklist.has(item));
  },

  clearBlacklist() {
    state.blacklist.clear();
    window.dispatchEvent(new CustomEvent('blacklistUpdated'));
  },

  addHistory(result) {
    const record = {
      result,
      menuId: state.activeMenuId,
      time: new Date().toISOString()
    };
    state.drawHistory.unshift(record);
    
    if (state.drawHistory.length > 50) {
      state.drawHistory = state.drawHistory.slice(0, 50);
    }
    
    saveToStorage();
    window.dispatchEvent(new CustomEvent('historyUpdated'));
  },

  clearHistory() {
    state.drawHistory = [];
    saveToStorage();
    window.dispatchEvent(new CustomEvent('historyUpdated'));
  },

  getHistory() {
    return state.drawHistory;
  }
};
