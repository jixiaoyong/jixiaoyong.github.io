// =================================================================================================
// 管理页面应用初始化
// =================================================================================================

class ManageApp {
  constructor() {
    this.dataManager = new DataManager();
    this.uiManager = new UIManager();
    this.eventManager = new EventManager(this);
    this.editingGroupId = null;
  }

  // 初始化应用
  async init() {
    try {
      // 加载数据
      await this.dataManager.load();
      
      // 更新所有UI
      this.updateAllUI();
      
      console.log('管理页面初始化成功');
    } catch (error) {
      console.error('管理页面初始化失败:', error);
      toastManager.error('页面初始化失败');
    }
  }

  // 更新所有UI
  updateAllUI() {
    const groups = this.dataManager.getGroups();
    const currentGroupId = this.dataManager.getData().currentGroup;
    const history = this.dataManager.getHistory();

    // 更新组合列表
    this.uiManager.renderGroupList(groups, currentGroupId);
    
    // 更新历史记录
    this.uiManager.renderHistoryList(history);
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', async () => {
  // 创建全局应用实例
  window.manageApp = new ManageApp();
  
  // 初始化应用
  await window.manageApp.init();
  
  console.log('管理页面加载完成');
});