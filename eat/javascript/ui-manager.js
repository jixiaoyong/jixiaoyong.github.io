// =================================================================================================
// UIManager Class - UI 管理核心类
// =================================================================================================

class UIManager {
  constructor() {
    this.elements = {
      groupListManage: document.getElementById("groupListManage"),
      historyList: document.getElementById("historyList"),
      groupModal: document.getElementById("groupModal"),
      modalTitle: document.getElementById("modalTitle"),
      groupForm: document.getElementById("groupForm"),
      groupNameInput: document.getElementById("groupName"),
      itemsContainer: document.getElementById("itemsContainer"),
      importFile: document.getElementById("importFile"),
    };

    this.currentTab = "groups";
    this.formValidator = new FormValidator();
  }

  // 切换标签页
  switchTab(tabName, tabBtn) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    if (tabBtn) tabBtn.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}Tab`).classList.add("active");

    this.currentTab = tabName;
  }

  // 渲染组合列表
  renderGroupList(groups, currentGroupId) {
    this.elements.groupListManage.innerHTML = "";

    if (groups.length === 0) {
      this.elements.groupListManage.innerHTML = `
        <div class="empty-state">
          <p>暂无组合，点击"新建组合"开始创建</p>
        </div>
      `;
      return;
    }

    groups.forEach((group) => {
      const groupCard = this.createGroupCard(group, currentGroupId);
      this.elements.groupListManage.appendChild(groupCard);
    });
  }

  // 创建组合卡片
  createGroupCard(group, currentGroupId) {
    const groupCard = document.createElement("div");
    groupCard.className = `group-card ${
      group.id === currentGroupId ? "active" : ""
    }`;
    groupCard.dataset.groupId = group.id;

    groupCard.innerHTML = `
      <div class="group-header">
        <div class="group-info">
          <div class="group-name">${Utils.escapeHtml(group.name)}</div>
          <div class="group-meta">
            <span class="item-count">${group.items.length} 个选项</span>
            ${
              group.id === currentGroupId
                ? '<span class="current-badge">当前</span>'
                : ""
            }
          </div>
        </div>
        <div class="group-actions">
          <button class="btn btn-secondary btn-sm edit-btn" title="编辑组合">
            编辑
          </button>
          <button class="btn btn-success btn-sm duplicate-btn" title="复制组合">
            复制
          </button>
          ${
            group.id !== "default"
              ? `<button class="btn btn-danger btn-sm delete-btn" title="删除组合">
              删除
            </button>`
              : ""
          }
        </div>
      </div>
      <div class="item-list">
        ${group.items
          .map(
            (item) => `
          <div class="item-item">
            <div class="item-info">
              <h4>${Utils.escapeHtml(item.title)}</h4>
              <p>${Utils.escapeHtml(item.description)}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    return groupCard;
  }

  // 渲染历史记录
  renderHistoryList(history) {
    this.elements.historyList.innerHTML = "";

    if (history.length === 0) {
      this.elements.historyList.innerHTML = `
        <div class="empty-state">
          <p>暂无抽取历史</p>
        </div>
      `;
      return;
    }

    history.forEach((record) => {
      const historyItem = this.createHistoryItem(record);
      if (historyItem) {
        this.elements.historyList.appendChild(historyItem);
      }
    });
  }

  // 创建历史记录项
  createHistoryItem(record) {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";

    // 兼容两种数据结构
    let title, description, group, timestamp;

    if (record.item && record.item.title) {
      // data-manager.js 的结构：{ id, item: { title, description }, group, timestamp }
      title = record.item.title;
      description = record.item.description;
      group = record.group;
      timestamp = record.timestamp;
    } else if (record.title) {
      // script.js 的结构：{ title, description, group, time, randomSeed }
      title = record.title;
      description = record.description;
      group = record.group;
      timestamp = record.time;
    } else {
      // 无效数据，跳过
      console.warn("无效的历史记录数据：", record);
      return null;
    }

    const time = new Date(timestamp);
    const timeStr = time.toLocaleString("zh-CN");
    const timeAgo = Utils.getTimeAgo(time);

    historyItem.innerHTML = `
      <div class="history-header">
        <div class="history-title">${Utils.escapeHtml(title)}</div>
        <div class="history-time">
          <div class="time-ago">${timeAgo}</div>
          <div class="time-full">${timeStr}</div>
        </div>
      </div>
      <div class="history-group">组合：${Utils.escapeHtml(group)}</div>
      <div class="history-description">${Utils.escapeHtml(description)}</div>
    `;

    return historyItem;
  }

  // 显示模态框
  showModal(title, group = null) {
    this.elements.modalTitle.textContent = title;
    this.elements.groupNameInput.value = group ? group.name : "";
    this.elements.itemsContainer.innerHTML = "";

    if (group && group.items && group.items.length > 0) {
      group.items.forEach((item) => this.addItemForm(item));
    } else {
      this.addItemForm();
    }

    this.elements.groupModal.style.display = "flex";
    this.elements.groupNameInput.focus();
  }

  // 关闭模态框
  closeModal() {
    this.elements.groupModal.style.display = "none";
    this.elements.groupForm.reset();
  }

  // 添加选项表单
  addItemForm(item = null) {
    const itemForm = document.createElement("div");
    itemForm.className = "item-form";
    itemForm.innerHTML = `
      <div class="item-inputs">
        <input type="text" class="item-title" placeholder="选项标题" 
               value="${item ? Utils.escapeHtml(item.title) : ""}" required>
        <input type="text" class="item-description" placeholder="选项描述（可选）" 
               value="${item ? Utils.escapeHtml(item.description) : ""}">
      </div>
      <button type="button" class="btn btn-danger btn-sm remove-item-btn" title="删除选项">
        删除
      </button>
    `;

    this.elements.itemsContainer.appendChild(itemForm);
    this.bindItemFormEvents(itemForm);
  }

  // 绑定选项表单事件
  bindItemFormEvents(itemForm) {
    const titleInput = itemForm.querySelector(".item-title");
    const descInput = itemForm.querySelector(".item-description");

    [titleInput, descInput].forEach((input) => {
      input.addEventListener("input", () => {
        this.formValidator.validateItemForm(itemForm);
      });
    });
  }

  // 从表单获取组合数据
  getGroupDataFromForm() {
    const groupName = this.elements.groupNameInput.value.trim();
    const items = [];
    const itemForms =
      this.elements.itemsContainer.querySelectorAll(".item-form");

    for (let i = 0; i < itemForms.length; i++) {
      const form = itemForms[i];
      const titleInput = form.querySelector(".item-title");
      const descInput = form.querySelector(".item-description");

      const title = titleInput.value.trim();
      const description = descInput.value.trim();

      if (title) {
        items.push({
          id: Utils.generateId("item"),
          title,
          description: description || "",
        });
      }
    }

    if (!this.formValidator.validateGroupForm(groupName, items)) {
      const firstError = this.formValidator.getFirstError();
      if (firstError) {
        toastManager.error(firstError);
      }
      return null;
    }

    return { name: groupName, items };
  }

  // 保存组合回调（由 App 类实现）
  onSaveGroup(formData) {
    // 这个方法会被 App 类重写
  }
}
