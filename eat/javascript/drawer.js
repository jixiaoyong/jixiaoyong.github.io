// =================================================================================================
// drawer.js - 菜单管理单页抽屉控制器 (ESM Module)
// =================================================================================================

import { store } from './store.js';
import { getChips, setChips } from './input-panel.js';
import { toast, generateId } from './utils.js';

let domElements = {};
let currentEditingMenuId = null; 

export function initDrawer(elements) {
  domElements = elements;
  
  bindEvents();
  renderMenuList();
}

function bindEvents() {
  const {
    drawerOverlay,
    closeDrawerBtn,
    showCreateMenuBtn,
    backToMenuListBtn,
    saveMenuBtn,
    deleteMenuBtn,
    drawerHandle
  } = domElements;

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  if (drawerHandle) {
    drawerHandle.addEventListener('click', closeDrawer);
  }

  if (showCreateMenuBtn) {
    showCreateMenuBtn.addEventListener('click', () => {
      showEditView(null);
    });
  }

  if (backToMenuListBtn) {
    backToMenuListBtn.addEventListener('click', () => {
      showListView();
    });
  }

  if (saveMenuBtn) {
    saveMenuBtn.addEventListener('click', handleSaveMenu);
  }

  if (deleteMenuBtn) {
    deleteMenuBtn.addEventListener('click', handleDeleteMenu);
  }

  window.addEventListener('menusUpdated', () => {
    renderMenuList();
  });
}

export function openDrawer() {
  const { drawerContainer, drawerOverlay } = domElements;
  if (!drawerContainer) return;
  
  drawerContainer.classList.add('open');
  if (drawerOverlay) drawerOverlay.style.display = 'block';
  showListView();
}

export function closeDrawer() {
  const { drawerContainer, drawerOverlay } = domElements;
  if (!drawerContainer) return;
  
  drawerContainer.classList.remove('open');
  setTimeout(() => {
    if (!drawerContainer.classList.contains('open') && drawerOverlay) {
      drawerOverlay.style.display = 'none';
    }
  }, 300);
}

function showListView() {
  const { menuListView, menuEditView } = domElements;
  if (menuListView && menuEditView) {
    menuListView.style.display = 'block';
    menuEditView.style.display = 'none';
  }
  currentEditingMenuId = null;
}

function showEditView(menuId) {
  const { menuListView, menuEditView, editViewTitle, menuNameInput, deleteMenuBtn } = domElements;
  if (!menuListView || !menuEditView) return;

  menuListView.style.display = 'none';
  menuEditView.style.display = 'block';
  currentEditingMenuId = menuId;

  if (menuId) {
    const menu = store.getMenus().find(m => m.id === menuId);
    if (!menu) return;

    if (editViewTitle) editViewTitle.textContent = "编辑菜单";
    if (menuNameInput) {
      menuNameInput.value = menu.name;
      menuNameInput.disabled = menu.isSystem;
    }
    
    setChips(menu.items);

    if (deleteMenuBtn) {
      deleteMenuBtn.style.display = menu.isSystem ? 'none' : 'block';
    }
  } else {
    if (editViewTitle) editViewTitle.textContent = "➕ 新建自定义菜单";
    if (menuNameInput) {
      menuNameInput.value = '';
      menuNameInput.disabled = false;
    }
    
    setChips([]);
    
    if (deleteMenuBtn) {
      deleteMenuBtn.style.display = 'none';
    }
  }
}

export function renderMenuList() {
  const { menuCardList } = domElements;
  if (!menuCardList) return;

  menuCardList.innerHTML = '';
  
  const menus = store.getMenus();
  const activeMenu = store.getActiveMenu();

  menus.forEach(menu => {
    const card = document.createElement('div');
    const isActive = activeMenu && activeMenu.id === menu.id;
    card.className = `menu-card ${isActive ? 'active' : ''}`;
    
    const previewText = menu.items.slice(0, 3).join('、') + (menu.items.length > 3 ? '...' : '');
    
    card.innerHTML = `
      <div class="menu-card-info">
        <div class="menu-card-name">
          ${menu.name}
          ${menu.isSystem ? '<span class="badge-system">内置</span>' : ''}
        </div>
        <div class="menu-card-preview">
          共 ${menu.items.length} 个菜品：${previewText || '暂无'}
        </div>
      </div>
      <button class="btn-card-edit" title="编辑菜品" data-id="${menu.id}">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </button>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-card-edit')) return;
      
      const changed = store.setActiveMenu(menu.id);
      if (changed) {
        toast(`已切换至当前抽签菜单：${menu.name}`, "success");
        closeDrawer();
      }
    });

    const editBtn = card.querySelector('.btn-card-edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showEditView(menu.id);
    });

    menuCardList.appendChild(card);
  });
}

function handleSaveMenu() {
  const { menuNameInput } = domElements;
  const name = menuNameInput ? menuNameInput.value.trim() : '';
  const items = getChips();

  if (!name) {
    toast("请输入菜单名称！", "warning");
    return;
  }

  if (items.length === 0) {
    toast("菜单中至少需要包含一个菜名！", "warning");
    return;
  }

  try {
    const menuId = currentEditingMenuId || generateId('menu');
    store.saveMenu(menuId, name, items);
    
    toast("💾 菜单保存成功", "success");
    showListView(); 
  } catch (error) {
    toast(error.message || "保存失败", "danger");
  }
}

function handleDeleteMenu() {
  if (!currentEditingMenuId) return;

  const menu = store.getMenus().find(m => m.id === currentEditingMenuId);
  if (!menu) return;

  if (confirm(`确定要删除自定义菜单【${menu.name}】吗？`)) {
    try {
      store.deleteMenu(currentEditingMenuId);
      toast("🗑️ 菜单已删除", "success");
      showListView();
    } catch (error) {
      toast(error.message || "删除失败", "danger");
    }
  }
}
