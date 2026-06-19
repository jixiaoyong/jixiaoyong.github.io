// =================================================================================================
// input-panel.js - 智能输入面板与 Chips 标签编辑器 (ESM Module)
// =================================================================================================

import { segmentText } from './trie.js';
import { toast } from './utils.js';

let chipsList = []; 
let domElements = {};

export function initInputPanel(elements) {
  domElements = elements;
  chipsList = [];
  
  bindEvents();
}

function bindEvents() {
  const { rawFoodInput, parseInputBtn } = domElements;
  if (!rawFoodInput || !parseInputBtn) return;

  parseInputBtn.addEventListener('click', () => {
    handleTextInput();
  });

  rawFoodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleTextInput();
    }
  });
}

function handleTextInput() {
  const { rawFoodInput } = domElements;
  const text = rawFoodInput.value.trim();
  
  if (!text) {
    toast("请输入菜名，我来帮您分词提取", "info");
    return;
  }

  // 运行双轨智能分词
  const foods = segmentText(text);
  
  if (foods.length > 0) {
    addChips(foods);
    rawFoodInput.value = ''; 
    toast(`🍲 成功提取出 ${foods.length} 个菜品`, "success");
  } else {
    toast("未能自动提取出具体菜名，请手动以空格隔开并提取", "warning");
  }
}

export function setChips(foods) {
  chipsList = foods ? [...foods] : [];
  renderChips();
}

export function getChips() {
  return chipsList;
}

export function addChips(foods) {
  if (!foods || foods.length === 0) return;

  let addedCount = 0;
  foods.forEach(food => {
    const trimmed = food.trim();
    if (trimmed && !chipsList.includes(trimmed)) {
      chipsList.push(trimmed);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    renderChips();
  }
}

function renderChips() {
  const { chipsContainer, chipsCount } = domElements;
  if (!chipsContainer) return;

  chipsContainer.innerHTML = '';
  
  if (chipsCount) {
    chipsCount.textContent = chipsList.length;
  }

  if (chipsList.length === 0) {
    chipsContainer.innerHTML = `<div style="color: var(--color-text-muted); font-size: 0.85rem; margin: auto; padding: 25px 0;">在上方输入菜名，点击提取添加</div>`;
    return;
  }

  chipsList.forEach((food, index) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `
      <span class="chip-text">${food}</span>
      <span class="chip-delete" title="删除" data-index="${index}">×</span>
    `;

    const chipTextEl = chip.querySelector('.chip-text');
    
    chipTextEl.addEventListener('dblclick', () => {
      chipTextEl.contentEditable = "true";
      chipTextEl.focus();
      
      const range = document.createRange();
      range.selectNodeContents(chipTextEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });

    chipTextEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        chipTextEl.blur();
      }
    });

    chipTextEl.addEventListener('blur', () => {
      chipTextEl.contentEditable = "false";
      const newValue = chipTextEl.textContent.trim();
      
      if (!newValue) {
        removeChip(index);
      } else if (newValue !== food) {
        const dupIndex = chipsList.indexOf(newValue);
        if (dupIndex > -1 && dupIndex !== index) {
          toast("此菜名已存在！", "warning");
          chipTextEl.textContent = food; 
        } else {
          chipsList[index] = newValue;
          renderChips(); 
        }
      }
    });

    const deleteBtn = chip.querySelector('.chip-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeChip(index);
    });

    chipsContainer.appendChild(chip);
  });
}

function removeChip(index) {
  chipsList.splice(index, 1);
  renderChips();
}
