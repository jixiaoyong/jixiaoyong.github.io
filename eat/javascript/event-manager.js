// =================================================================================================
// EventManager Class - 事件管理核心类
// =================================================================================================

class EventManager {
  constructor(app) {
    this.app = app;
    this.uiManager = app.uiManager;
    this.dataManager = app.dataManager;
    this.setupEventListeners();
  }

  // 设置所有事件监听器
  setupEventListeners() {
    this.setupTabEvents();
    this.setupGroupEvents();
    this.setupModalEvents();
    this.setupDataEvents();
    this.setupKeyboardEvents();
    this.setupPageEvents();
  }

  // 设置标签页事件
  setupTabEvents() {
    document.querySelector(".manage-tabs").addEventListener("click", (e) => {
      if (e.target.classList.contains("tab-btn")) {
        this.uiManager.switchTab(e.target.dataset.tab, e.target);
      }
    });
  }

  // 设置组合相关事件
  setupGroupEvents() {
    // 新建组合按钮
    document.querySelector(".add-group-btn").addEventListener("click", () => {
      this.showAddGroupModal();
    });

    // 组合列表事件委托
    this.uiManager.elements.groupListManage.addEventListener("click", (e) => {
      const target = e.target;
      const groupCard = target.closest(".group-card");
      if (!groupCard) return;

      const groupId = groupCard.dataset.groupId;
      const actionBtn = target.closest(".btn");

      // 如果点击的是按钮，处理按钮事件
      if (actionBtn && (actionBtn.classList.contains("edit-btn") || 
                       actionBtn.classList.contains("duplicate-btn") || 
                       actionBtn.classList.contains("delete-btn"))) {
        e.preventDefault();
        e.stopPropagation();
        
        if (actionBtn.classList.contains("edit-btn")) {
          this.editGroup(groupId);
        } else if (actionBtn.classList.contains("duplicate-btn")) {
          this.duplicateGroup(groupId);
        } else if (actionBtn.classList.contains("delete-btn")) {
          this.deleteGroup(groupId);
        }
        return;
      }

      // 如果点击的不是按钮，则切换当前组合
      this.setCurrentGroup(groupId);
    });
  }

  // 设置模态框事件
  setupModalEvents() {
    // 重写 UI 管理器的保存回调
    this.uiManager.onSaveGroup = (formData) => {
      this.saveGroup(formData);
    };

    // 表单提交事件
    this.uiManager.elements.groupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = this.uiManager.getGroupDataFromForm();
      if (formData) {
        this.saveGroup(formData);
      }
    });

    // 模态框键盘事件
    this.uiManager.elements.groupModal.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        this.uiManager.closeModal();
      } else if (e.code === "Enter" && e.ctrlKey) {
        e.preventDefault();
        this.uiManager.elements.groupForm.dispatchEvent(new Event("submit"));
      }
    });

    // 模态框背景点击关闭
    this.uiManager.elements.groupModal.addEventListener("click", (e) => {
      if (e.target === this.uiManager.elements.groupModal) {
        this.uiManager.closeModal();
      }
    });

    // 关闭按钮和取消按钮
    this.uiManager.elements.groupModal.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("close-modal") ||
        e.target.classList.contains("cancel-btn")
      ) {
        this.uiManager.closeModal();
      }
    });

    // 添加选项按钮
    this.uiManager.elements.groupModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-item-btn")) {
        this.uiManager.addItemForm();
      }
    });

    // 删除选项按钮
    this.uiManager.elements.groupModal.addEventListener("click", (e) => {
      if (e.target.closest(".remove-item-btn")) {
        const itemForm = e.target.closest(".item-form");
        if (
          itemForm &&
          this.uiManager.elements.itemsContainer.children.length > 1
        ) {
          itemForm.remove();
        } else {
          toastManager.warning("至少需要保留一个选项");
        }
      }
    });
  }

  // 设置数据管理事件
  setupDataEvents() {
    // 导出数据
    document.querySelector(".export-btn").addEventListener("click", () => {
      this.exportData();
    });

    // 导入数据
    document.querySelector(".import-btn").addEventListener("click", () => {
      this.uiManager.elements.importFile.click();
    });

    this.uiManager.elements.importFile.addEventListener("change", (e) => {
      this.importData(e.target);
    });

    // 重置数据
    document.querySelector(".reset-btn").addEventListener("click", () => {
      this.resetData();
    });

    // 返回主页
    document.querySelector(".back-btn").addEventListener("click", () => {
      this.goBack();
    });
  }

  // 设置键盘事件
  setupKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      // 全局快捷键
      if (e.code === "Escape") {
        this.uiManager.closeModal();
      }

      // Ctrl+S 保存
      if (e.code === "KeyS" && e.ctrlKey) {
        e.preventDefault();
        this.dataManager.save();
        toastManager.success("数据已保存");
      }

      // Ctrl+N 新建组合
      if (e.code === "KeyN" && e.ctrlKey) {
        e.preventDefault();
        this.showAddGroupModal();
      }
    });
  }

  // 设置页面事件
  setupPageEvents() {
    // 页面关闭前保存
    window.addEventListener("beforeunload", () => {
      this.dataManager.save();
    });

    // 页面可见性变化时保存
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.dataManager.save();
      }
    });
  }

  // 显示添加组合模态框
  showAddGroupModal() {
    this.app.editingGroupId = null;
    this.uiManager.showModal("新建组合");
  }

  // 编辑组合
  editGroup(groupId) {
    const group = this.dataManager.getGroupById(groupId);
    if (group) {
      this.app.editingGroupId = groupId;
      this.uiManager.showModal("编辑组合", group);
    } else {
      toastManager.error("组合不存在");
    }
  }

  // 保存组合
  saveGroup(formData) {
    try {
      // 检查组合名称是否重复
      const existingGroups = this.dataManager.getGroups();
      const isDuplicate = existingGroups.some(group => {
        // 编辑时排除当前组合
        if (this.app.editingGroupId && group.id === this.app.editingGroupId) {
          return false;
        }
        return group.name === formData.name;
      });

      if (isDuplicate) {
        toastManager.error("组合名称已存在，请使用其他名称");
        return;
      }

      if (this.app.editingGroupId) {
        // 编辑现有组合
        const group = this.dataManager.getGroupById(this.app.editingGroupId);
        if (!group) {
          toastManager.error("组合不存在");
          return;
        }

        group.name = formData.name;
        group.items = formData.items;
        this.dataManager.updateGroup(group);
        toastManager.success("组合更新成功！");
      } else {
        // 创建新组合
        const newGroup = {
          id: Utils.generateId("group"),
          name: formData.name,
          items: formData.items,
        };
        this.dataManager.addGroup(newGroup);
        toastManager.success("组合创建成功！");
      }

      this.app.updateAllUI();
      this.uiManager.closeModal();
    } catch (error) {
      toastManager.error(error.message);
    }
  }

  // 复制组合
  duplicateGroup(groupId) {
    try {
      const newGroup = this.dataManager.duplicateGroup(groupId);
      this.app.updateAllUI();
      toastManager.success("组合复制成功！");
    } catch (error) {
      toastManager.error(error.message);
    }
  }

  // 删除组合
  deleteGroup(groupId) {
    confirmManager.show("确定要删除这个组合吗？此操作不可恢复！", () => {
      try {
        this.dataManager.deleteGroup(groupId);
        this.app.updateAllUI();
        toastManager.success("组合删除成功！");
      } catch (error) {
        toastManager.error(error.message);
      }
    });
  }

  // 设置当前组合
  setCurrentGroup(groupId) {
    if (this.dataManager.setCurrentGroup(groupId)) {
      this.app.updateAllUI();
      toastManager.info("已切换到新组合");
    } else {
      toastManager.error("切换组合失败");
    }
  }

  // 导出数据
  exportData() {
    try {
      const dataStr = this.dataManager.export();
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `eat_app_data_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
      toastManager.success("数据导出成功！");
    } catch (error) {
      toastManager.error("导出失败：" + error.message);
    }
  }

  // 导入数据
  importData(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        this.dataManager.import(importedData);
        this.app.updateAllUI();
        toastManager.success("数据导入成功！");
      } catch (error) {
        toastManager.error("导入失败：" + error.message);
      }
    };

    reader.onerror = () => {
      toastManager.error("文件读取失败");
    };

    reader.readAsText(file);
    input.value = "";
  }

  // 重置数据
  resetData() {
    confirmManager.show("确定要重置所有数据吗？此操作不可恢复！", () => {
      try {
        this.dataManager.reset();
        this.app.updateAllUI();
        toastManager.success("数据已重置！");
      } catch (error) {
        toastManager.error("重置失败：" + error.message);
      }
    });
  }

  // 返回主页
  goBack() {
    // 保存当前状态
    this.dataManager.save();

    // 检查是否在主窗口中
    if (window.opener) {
      // 如果在弹出窗口中，关闭当前窗口
      window.close();
    } else {
      // 如果在主窗口中，跳转到主页
      window.location.href = "index.html";
    }
  }
}
