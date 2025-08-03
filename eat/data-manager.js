 // =================================================================================================
// DataManager Class - 数据管理核心类
// =================================================================================================

class DataManager {
  constructor() {
    this.cookieManager = new CookieManager();
    this.appData = {
      groups: [],
      currentGroup: "default",
      lastDrawTime: null,
      drawHistory: [],
      settings: {
        autoSave: true,
        maxHistoryItems: 50,
        defaultGroup: "default"
      }
    };
  }

  // 加载数据
  async load() {
    try {
      // 首先尝试从Cookie加载
      const cookieData = this.cookieManager.loadAppData();
      if (cookieData) {
        this.appData = { ...this.appData, ...cookieData };
        console.log('从Cookie加载数据成功');
        return;
      }

      // 如果Cookie没有数据，尝试从localStorage加载（向后兼容）
      const localData = localStorage.getItem("eatAppData");
      if (localData) {
        const local = JSON.parse(localData);
        this.appData = { ...this.appData, ...local };
        // 迁移到Cookie
        this.save();
        console.log('从localStorage迁移数据到Cookie成功');
        return;
      }

      // 如果都没有，加载默认数据
      await this.loadDefaultData();
      console.log('加载默认数据成功');
    } catch (error) {
      console.error("加载数据失败：", error);
      await this.loadDefaultData();
    }
  }

  // 加载默认数据
  async loadDefaultData() {
    try {
      const response = await fetch("data.json");
      const defaultData = await response.json();
      this.appData = { ...this.appData, ...defaultData };
    } catch (error) {
      console.warn("无法加载data.json，使用内置默认数据");
      this.appData = {
        groups: [
          {
            id: "default",
            name: "默认组合",
            items: [
              { id: "1", title: "火锅", description: "麻辣鲜香，温暖身心" },
              { id: "2", title: "烤肉", description: "滋滋作响，香气四溢" },
              { id: "3", title: "寿司", description: "新鲜美味，精致可口" },
              { id: "4", title: "披萨", description: "芝士浓郁，口感丰富" },
              { id: "5", title: "面条", description: "简单美味，快速解决" },
            ],
          },
        ],
        currentGroup: "default",
        lastDrawTime: null,
        drawHistory: [],
        settings: {
          autoSave: true,
          maxHistoryItems: 50,
          defaultGroup: "default"
        }
      };
    }
  }

  // 保存数据
  save() {
    try {
      // 限制历史记录数量
      if (this.appData.drawHistory.length > this.appData.settings.maxHistoryItems) {
        this.appData.drawHistory = this.appData.drawHistory.slice(-this.appData.settings.maxHistoryItems);
      }

      // 保存到Cookie
      if (this.cookieManager.saveAppData(this.appData)) {
        console.log('数据保存到Cookie成功');
      } else {
        // 如果Cookie保存失败，回退到localStorage
        localStorage.setItem("eatAppData", JSON.stringify(this.appData));
        console.log('数据保存到localStorage成功');
      }
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  // 获取所有数据
  getData() {
    return this.appData;
  }

  // 获取所有组合
  getGroups() {
    return this.appData.groups;
  }

  // 获取当前组合
  getCurrentGroup() {
    return this.appData.groups.find(g => g.id === this.appData.currentGroup);
  }

  // 设置当前组合
  setCurrentGroup(groupId) {
    if (this.appData.groups.find(g => g.id === groupId)) {
      this.appData.currentGroup = groupId;
      this.save();
      return true;
    }
    return false;
  }

  // 获取指定组合
  getGroupById(groupId) {
    return this.appData.groups.find(g => g.id === groupId);
  }

  // 添加组合
  addGroup(group) {
    if (!group.id || !group.name || !group.items || group.items.length === 0) {
      throw new Error('组合数据不完整');
    }
    
    // 检查ID是否重复
    if (this.appData.groups.find(g => g.id === group.id)) {
      throw new Error('组合ID已存在');
    }

    this.appData.groups.push(group);
    this.save();
    return group;
  }

  // 更新组合
  updateGroup(updatedGroup) {
    const index = this.appData.groups.findIndex(g => g.id === updatedGroup.id);
    if (index === -1) {
      throw new Error('组合不存在');
    }
    
    this.appData.groups[index] = updatedGroup;
    this.save();
    return updatedGroup;
  }

  // 删除组合
  deleteGroup(groupId) {
    if (groupId === "default") {
      throw new Error('默认组合不能删除');
    }
    
    const index = this.appData.groups.findIndex(g => g.id === groupId);
    if (index === -1) {
      throw new Error('组合不存在');
    }

    this.appData.groups.splice(index, 1);
    
    // 如果删除的是当前组合，切换到默认组合
    if (this.appData.currentGroup === groupId) {
      this.appData.currentGroup = "default";
    }
    
    this.save();
    return true;
  }

  // 复制组合
  duplicateGroup(groupId) {
    const group = this.getGroupById(groupId);
    if (!group) {
      throw new Error('组合不存在');
    }

    const newGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${group.name} (副本)`,
      items: JSON.parse(JSON.stringify(group.items)),
    };
    
    return this.addGroup(newGroup);
  }

  // 添加抽取记录
  addDrawRecord(item, groupName) {
    const record = {
      id: `draw_${Date.now()}`,
      item: item,
      group: groupName,
      timestamp: new Date().toISOString()
    };
    
    this.appData.drawHistory.unshift(record);
    this.appData.lastDrawTime = record.timestamp;
    
    // 限制历史记录数量
    if (this.appData.drawHistory.length > this.appData.settings.maxHistoryItems) {
      this.appData.drawHistory = this.appData.drawHistory.slice(0, this.appData.settings.maxHistoryItems);
    }
    
    this.save();
    return record;
  }

  // 获取抽取历史
  getHistory(limit = null) {
    if (limit) {
      return this.appData.drawHistory.slice(0, limit);
    }
    return this.appData.drawHistory;
  }

  // 清空历史记录
  clearHistory() {
    this.appData.drawHistory = [];
    this.appData.lastDrawTime = null;
    this.save();
  }

  // 更新设置
  updateSettings(settings) {
    this.appData.settings = { ...this.appData.settings, ...settings };
    this.save();
  }

  // 获取设置
  getSettings() {
    return this.appData.settings;
  }

  // 重置数据
  reset() {
    this.cookieManager.clearAllData();
    localStorage.removeItem("eatAppData");
    this.loadDefaultData();
    this.save();
  }

  // 导入数据
  import(data) {
    if (!data || !data.groups || !Array.isArray(data.groups)) {
      throw new Error('数据格式错误');
    }

    // 验证数据完整性
    for (const group of data.groups) {
      if (!group.id || !group.name || !group.items || !Array.isArray(group.items)) {
        throw new Error('组合数据格式错误');
      }
    }

    this.appData = { ...this.appData, ...data };
    this.save();
    return true;
  }

  // 导出数据
  export() {
    return JSON.stringify(this.appData, null, 2);
  }

  // 检查数据完整性
  validateData() {
    const errors = [];
    
    if (!this.appData.groups || !Array.isArray(this.appData.groups)) {
      errors.push('组合数据格式错误');
    }
    
    if (!this.appData.currentGroup) {
      errors.push('当前组合未设置');
    }
    
    if (!this.appData.groups.find(g => g.id === this.appData.currentGroup)) {
      errors.push('当前组合不存在');
    }
    
    return errors;
  }
}