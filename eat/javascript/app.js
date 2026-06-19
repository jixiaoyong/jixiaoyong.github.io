// =================================================================================================
// app.js - SPA 业务总控中心 (ESM Module)
// =================================================================================================

import { store, initStore } from './store.js';
import { initRoulette, renderCylinder, spinToResult } from './roulette.js';
import { initInputPanel, addChips } from './input-panel.js';
import { initDrawer, openDrawer, renderMenuList } from './drawer.js';
import { toast, getTimeAgo } from './utils.js';

let domElements = {};
let isSpinning = false;

// 推荐美食板块数据（用于美食探索页一键导入）
const EXPLORE_DATA = [
  {
    id: "exp_fastfood",
    title: "🍔 打工人续命快餐",
    desc: "一顿顶一天，效率极高！",
    items: ["麦当劳", "肯德基", "汉堡王", "萨莉亚", "汉堡", "华莱士", "塔斯汀"]
  },
  {
    id: "exp_hotpot",
    title: "🔥 麻辣诱惑专区",
    desc: "无辣不欢，适合今日开胃大吃。",
    items: ["四川火锅", "重庆冒菜", "麻辣烫", "串串香", "太二酸菜鱼", "干锅排骨"]
  },
  {
    id: "exp_noodles",
    title: "🍜 暖胃粉面系列",
    desc: "吸一口顺滑，热汤下肚超舒服。",
    items: ["兰州拉面", "武汉热干面", "重庆小面", "柳州螺蛳粉", "重庆酸辣粉", "鸭血粉丝汤"]
  },
  {
    id: "exp_canton",
    title: "🍱 经典粤泰清甜",
    desc: "清淡滋补，养生食堂推荐。",
    items: ["椰子鸡火锅", "隆江猪脚饭", "广式煲仔饭", "蜜汁叉烧", "白斩鸡", "潮汕牛肉火锅"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  gatherElements();

  initStore();
  initRoulette();
  initInputPanel(domElements);
  initDrawer(domElements);

  bindEvents();
  updateView();

  // 监听 Service Worker 新版本通知，提供 Toast 一键刷新
  window.addEventListener('sw-update-available', () => {
    const updateToast = toast.info("✨ 检测到新版本，点击此提示立即升级应用", 0);
    if (updateToast) {
      updateToast.style.cursor = 'pointer';
      updateToast.addEventListener('click', () => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg && reg.waiting) {
              reg.waiting.postMessage('skipWaiting');
            }
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      });
    }
  });
});

function gatherElements() {
  domElements = {
    // 顶部及基本框架
    currentMenuBtn: document.getElementById('currentMenuBtn'),
    activeMenuName: document.getElementById('activeMenuName'),
    quickBlacklistContainer: document.getElementById('quickBlacklistContainer'),

    // 主抽取按钮
    spinBtn: document.getElementById('spinBtn'),
    spinBtnText: document.getElementById('spinBtnText'),

    // 底部导航与子页面
    appNavButtons: document.querySelectorAll('.nav-item'),
    appViews: document.querySelectorAll('.app-view'),
    navMyFoodies: document.getElementById('navMyFoodies'),
    historyListContainer: document.getElementById('historyListContainer'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    exploreCardsContainer: document.getElementById('exploreCardsContainer'),

    // 抽屉浮层
    drawerOverlay: document.getElementById('drawerOverlay'),
    drawerContainer: document.getElementById('drawerContainer'),
    drawerHandle: document.getElementById('drawerHandle'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    menuListView: document.getElementById('menuListView'),
    menuEditView: document.getElementById('menuEditView'),
    showCreateMenuBtn: document.getElementById('showCreateMenuBtn'),
    backToMenuListBtn: document.getElementById('backToMenuListBtn'),
    saveMenuBtn: document.getElementById('saveMenuBtn'),
    deleteMenuBtn: document.getElementById('deleteMenuBtn'),
    editViewTitle: document.getElementById('editViewTitle'),
    menuNameInput: document.getElementById('menuNameInput'),
    menuCardList: document.getElementById('menuCardList'),

    // 抽屉内输入区
    textInputContainer: document.getElementById('textInputContainer'),
    rawFoodInput: document.getElementById('rawFoodInput'),
    parseInputBtn: document.getElementById('parseInputBtn'),
    chipsContainer: document.getElementById('chipsContainer'),
    chipsCount: document.getElementById('chipsCount'),

    // 抽奖结果弹窗
    prizeModal: document.getElementById('prizeModal'),
    prizeModalResult: document.getElementById('prizeModalResult'),
    prizeModalClose: document.getElementById('prizeModalClose')
  };
}

function bindEvents() {
  const {
    spinBtn,
    currentMenuBtn,
    appNavButtons,
    clearHistoryBtn,
    prizeModal,
    prizeModalClose
  } = domElements;

  // 1. 开始抽签
  if (spinBtn) {
    spinBtn.addEventListener('click', handleSpin);
  }

  // 2. 抽奖结果弹窗关闭
  if (prizeModalClose) {
    prizeModalClose.addEventListener('click', closePrizeModal);
  }
  if (prizeModal) {
    prizeModal.addEventListener('click', (e) => {
      if (e.target === prizeModal) {
        closePrizeModal();
      }
    });
  }

  // 3. 顶部菜单触发抽屉
  if (currentMenuBtn) {
    currentMenuBtn.addEventListener('click', () => {
      openDrawer();
    });
  }

  // 4. 底部多页签导航切换 (SPA)
  appNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.dataset.view;
      if (!viewId) {
        // 如果点击的是我的菜单，直接唤醒滑出式抽屉，且不破坏当前的展示页
        openDrawer();
        return;
      }

      switchView(viewId);
    });
  });

  // 5. 历史记录清空
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm("确定要清空所有抽签历史记录吗？")) {
        store.clearHistory();
        toast("历史记录已清空", "info");
      }
    });
  }

  // 监听广播
  window.addEventListener('activeMenuChanged', () => {
    updateView();
  });
  window.addEventListener('menusUpdated', () => {
    updateView();
  });
  window.addEventListener('historyUpdated', () => {
    renderHistoryView();
  });
  window.addEventListener('blacklistUpdated', () => {
    renderQuickBlacklist();
    renderCylinder(store.getFilteredPool());
  });
}

/**
 * 切换子页面
 */
function switchView(viewId) {
  const { appViews, appNavButtons } = domElements;
  
  appViews.forEach(view => {
    if (view.id === viewId) {
      view.style.display = (viewId === 'viewDraw') ? 'flex' : 'block';
    } else {
      view.style.display = 'none';
    }
  });

  appNavButtons.forEach(btn => {
    if (btn.dataset.view === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 如果切到历史或探索，触发子组件重画
  if (viewId === 'viewHistory') {
    renderHistoryView();
  } else if (viewId === 'viewExplore') {
    renderExploreView();
  }
}

/**
 * 更新抽签主界面
 */
function updateView() {
  const activeMenu = store.getActiveMenu();
  if (!activeMenu) return;

  if (domElements.activeMenuName) {
    domElements.activeMenuName.textContent = activeMenu.name;
  }

  renderQuickBlacklist();
  renderCylinder(store.getFilteredPool());
  renderMenuList();
}

/**
 * 渲染快速黑名单
 */
function renderQuickBlacklist() {
  const { quickBlacklistContainer } = domElements;
  if (!quickBlacklistContainer) return;

  quickBlacklistContainer.innerHTML = '';
  const activeMenu = store.getActiveMenu();
  
  if (!activeMenu || activeMenu.items.length === 0) {
    quickBlacklistContainer.innerHTML = `<div style="color: var(--color-text-muted); font-size: 0.8rem; margin: auto; padding: 10px;">列表为空，请在管理中添加菜名</div>`;
    return;
  }

  activeMenu.items.forEach(food => {
    const itemEl = document.createElement('div');
    const isBlocked = store.isBlacklisted(food);
    itemEl.className = `blacklist-item ${isBlocked ? 'blocked' : ''}`;
    itemEl.textContent = food;
    
    itemEl.addEventListener('click', () => {
      if (isSpinning) return;
      store.toggleBlacklist(food);
    });

    quickBlacklistContainer.appendChild(itemEl);
  });
}

/**
 * 执行抽签动作
 */
function handleSpin() {
  if (isSpinning) return;

  const pool = store.getFilteredPool();
  if (pool.length === 0) {
    toast("❌ 没有可选菜品，请点亮排除列表或添加菜名", "warning");
    return;
  }

  isSpinning = true;
  const { spinBtn, spinBtnText } = domElements;
  if (spinBtn) spinBtn.disabled = true;
  if (spinBtnText) spinBtnText.textContent = "正在抽取中...";

  const targetIndex = Math.floor(Math.random() * pool.length);

  spinToResult(targetIndex, pool, (winner) => {
    store.addHistory(winner);

    setTimeout(() => {
      showPrizeModal(winner);

      isSpinning = false;
      if (spinBtn) spinBtn.disabled = false;
      if (spinBtnText) spinBtnText.textContent = "开始抽取！";
    }, 4500); // 增加回弹缓冲体验
  });
}

/**
 * 显示抽奖结果弹窗
 */
function showPrizeModal(winner) {
  const { prizeModal, prizeModalResult } = domElements;
  if (!prizeModal || !prizeModalResult) return;

  prizeModalResult.textContent = winner;
  prizeModal.classList.add('show');
}

/**
 * 关闭抽奖结果弹窗
 */
function closePrizeModal() {
  const { prizeModal } = domElements;
  if (!prizeModal) return;

  prizeModal.classList.remove('show');
}

/**
 * 渲染历史记录列表
 */
function renderHistoryView() {
  const { historyListContainer } = domElements;
  if (!historyListContainer) return;

  historyListContainer.innerHTML = '';
  const history = store.getHistory();

  if (history.length === 0) {
    historyListContainer.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding: 40px 0; font-size: 0.95rem;">🍱 暂无抽签历史记录，去抽一次试试吧！</div>`;
    return;
  }

  history.forEach(item => {
    const card = document.createElement('div');
    card.style.background = 'var(--bg-secondary)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = 'var(--radius-md)';
    card.style.padding = '14px 18px';
    card.style.marginBottom = '12px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';

    const menu = store.getMenus().find(m => m.id === item.menuId);
    const menuName = menu ? menu.name : "未知菜单";

    card.innerHTML = `
      <div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 2px;">${item.result}</div>
        <div style="font-size: 0.75rem; color: var(--color-text-muted);">所属菜单：${menuName}</div>
      </div>
      <div style="font-size: 0.8rem; color: var(--color-text-muted);">${getTimeAgo(item.time)}</div>
    `;

    historyListContainer.appendChild(card);
  });
}

/**
 * 渲染美食大发现推荐页
 */
function renderExploreView() {
  const { exploreCardsContainer } = domElements;
  if (!exploreCardsContainer) return;

  exploreCardsContainer.innerHTML = '';

  EXPLORE_DATA.forEach(group => {
    const card = document.createElement('div');
    card.style.background = 'var(--bg-secondary)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = 'var(--radius-md)';
    card.style.padding = '18px';
    card.style.marginBottom = '16px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '10px';

    const foodLabelsHtml = group.items.map(food => {
      return `<span style="font-size: 0.8rem; background: var(--bg-tertiary); padding: 3px 10px; border-radius: var(--radius-full); border: 1px solid var(--border-color); color: var(--color-text-secondary); font-weight:500;">${food}</span>`;
    }).join('');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom: 2px;">${group.title}</h3>
          <p style="font-size:0.75rem; color:var(--color-text-muted);">${group.desc}</p>
        </div>
        <button class="btn-import-explore" data-id="${group.id}" style="font-size: 0.8rem; background: rgba(255,122,0,0.08); border: 1px solid rgba(255,122,0,0.25); color: var(--accent-color); padding: 5px 12px; border-radius: var(--radius-sm); font-weight: 600; transition: all var(--transition-fast);">
          一键导入
        </button>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
        ${foodLabelsHtml}
      </div>
    `;

    // 绑定导入动作
    const importBtn = card.querySelector('.btn-import-explore');
    importBtn.addEventListener('click', () => {
      try {
        const activeMenu = store.getActiveMenu();
        if (!activeMenu) return;

        // 合并菜品
        const newItems = [...activeMenu.items];
        let importCount = 0;
        group.items.forEach(food => {
          if (!newItems.includes(food)) {
            newItems.push(food);
            importCount++;
          }
        });

        if (importCount > 0) {
          store.saveMenu(activeMenu.id, activeMenu.name, newItems);
          toast(`📥 成功导入 ${importCount} 个菜品到【${activeMenu.name}】！`, "success");
        } else {
          toast("💡 这些推荐菜在您的菜单中全部都有啦！", "info");
        }
      } catch (err) {
        toast("导入失败", "danger");
      }
    });

    exploreCardsContainer.appendChild(card);
  });
}
