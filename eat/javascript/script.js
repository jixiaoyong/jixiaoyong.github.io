// 种子随机数生成器
function seedRandom(seed) {
  let m = 0x80000000; // 2**31
  let a = 1103515245;
  let c = 12345;

  // 如果没有提供种子，使用复合随机种子
  let state = seed;
  if (!state) {
    state = generateCompositeSeed();
  }

  return function () {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// 生成复合随机种子 - 增强版
function generateCompositeSeed() {
  const currentTime = Date.now();
  const now = new Date();
  const timeOfDay = now.getTime();
  const milliseconds = now.getMilliseconds();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const userAgent = navigator.userAgent;

  // 组合多个随机元素，重点突出时间和鼠标坐标
  let compositeSeed = currentTime;

  // 添加精确的鼠标坐标信息
  compositeSeed += clickPosition.x * 100000;
  compositeSeed += clickPosition.y * 100000;

  // 添加时间信息（毫秒级精度）
  compositeSeed += timeOfDay;
  compositeSeed += milliseconds * 1000;

  // 添加屏幕尺寸信息
  compositeSeed += screenWidth * screenHeight;

  // 添加鼠标位置和时间的交叉组合
  compositeSeed += (clickPosition.x + clickPosition.y) * (currentTime % 100000);
  compositeSeed += (clickPosition.x * clickPosition.y) * (milliseconds % 1000);

  // 添加用户代理字符串的哈希
  let userAgentHash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    userAgentHash =
      ((userAgentHash << 5) - userAgentHash + userAgent.charCodeAt(i)) &
      0xffffffff;
  }
  compositeSeed += userAgentHash;

  // 添加额外的随机性：使用Math.random()作为额外的随机因子
  compositeSeed += Math.floor(Math.random() * 1000000);

  // 添加性能时间戳（如果可用）
  if (performance && performance.now) {
    compositeSeed += Math.floor(performance.now() * 1000);
  }

  // 新增：添加更多随机因素
  // 1. 添加当前页面滚动位置
  compositeSeed += window.pageYOffset * 1000;
  compositeSeed += window.pageXOffset * 1000;

  // 2. 添加当前URL的哈希值
  if (window.location.hash) {
    let urlHash = 0;
    for (let i = 0; i < window.location.hash.length; i++) {
      urlHash = ((urlHash << 5) - urlHash + window.location.hash.charCodeAt(i)) & 0xffffffff;
    }
    compositeSeed += urlHash;
  }

  // 3. 添加当前文档标题的哈希值
  let titleHash = 0;
  const title = document.title;
  for (let i = 0; i < title.length; i++) {
    titleHash = ((titleHash << 5) - titleHash + title.charCodeAt(i)) & 0xffffffff;
  }
  compositeSeed += titleHash;

  // 4. 添加当前时间戳的微秒部分（如果可用）
  if (performance && performance.now) {
    const microSeconds = Math.floor((performance.now() % 1) * 1000000);
    compositeSeed += microSeconds;
  }

  // 5. 添加内存使用情况（如果可用）
  if (performance && performance.memory) {
    compositeSeed += performance.memory.usedJSHeapSize;
    compositeSeed += performance.memory.totalJSHeapSize;
  }

  console.log("增强版复合随机种子生成：", {
    currentTime,
    clickPosition,
    timeOfDay,
    milliseconds,
    screenSize: `${screenWidth}x${screenHeight}`,
    userAgentHash,
    scrollPosition: `${window.pageYOffset},${window.pageXOffset}`,
    urlHash: window.location.hash,
    titleHash,
    microSeconds: performance && performance.now ? Math.floor((performance.now() % 1) * 1000000) : 'N/A',
    memoryUsage: performance && performance.memory ? `${performance.memory.usedJSHeapSize}/${performance.memory.totalJSHeapSize}` : 'N/A',
    finalSeed: compositeSeed,
  });

  return compositeSeed;
}

// 创建动态选项池 - 新增函数
function createDynamicItemPool(originalItems, randomSeed) {
  const seededRandom = seedRandom(randomSeed);

  // 创建原始选项的深拷贝
  let dynamicPool = JSON.parse(JSON.stringify(originalItems));

  // 计算要插入的随机选项数量（1-3个）
  const insertCount = Math.floor(seededRandom() * 3) + 1;

  console.log(`准备插入 ${insertCount} 个随机选项到动态池中`);

  // 从原始选项中随机选择要插入的选项
  for (let i = 0; i < insertCount; i++) {
    // 随机选择一个原始选项
    const randomIndex = Math.floor(seededRandom() * originalItems.length);
    const selectedItem = originalItems[randomIndex];

    // 创建副本并添加随机标识
    const clonedItem = {
      ...selectedItem,
      id: `${selectedItem.id}_random_${i}_${Date.now()}`,
      title: `${selectedItem.title}`,
      description: `${selectedItem.description}`,
      isRandomInsert: true,
      originalId: selectedItem.id
    };

    // 随机插入位置（0 到当前池长度之间）
    const insertPosition = Math.floor(seededRandom() * (dynamicPool.length + 1));
    dynamicPool.splice(insertPosition, 0, clonedItem);

    console.log(`在位置 ${insertPosition} 插入随机选项: ${clonedItem.title}`);
  }

  console.log(`动态选项池创建完成，总选项数: ${dynamicPool.length} (原始: ${originalItems.length})`);
  return dynamicPool;
}

// 改进的随机结果计算 - 增强版
function calculateRandomResult(dynamicPool, randomSeed) {
  const seededRandom = seedRandom(randomSeed);

  // 使用更复杂的随机算法
  let finalIndex = 0;

  // 方法1: 基础随机选择
  const baseRandom = Math.floor(seededRandom() * dynamicPool.length);

  // 方法2: 基于时间的加权随机
  const timeWeight = (Date.now() % 1000) / 1000; // 0-1之间的时间权重
  const timeWeightedIndex = Math.floor(timeWeight * dynamicPool.length);

  // 方法3: 基于鼠标位置的加权随机
  const mouseWeight = ((clickPosition.x + clickPosition.y) % 1000) / 1000;
  const mouseWeightedIndex = Math.floor(mouseWeight * dynamicPool.length);

  // 方法4: 基于随机种子的哈希计算
  const hashIndex = Math.abs(randomSeed) % dynamicPool.length;

  // 方法5: 新增 - 基于页面滚动位置的随机
  const scrollWeight = ((window.pageYOffset + window.pageXOffset) % 1000) / 1000;
  const scrollWeightedIndex = Math.floor(scrollWeight * dynamicPool.length);

  // 方法6: 新增 - 基于性能时间戳的随机
  const performanceWeight = performance && performance.now ? (performance.now() % 1000) / 1000 : 0;
  const performanceWeightedIndex = Math.floor(performanceWeight * dynamicPool.length);

  // 方法7: 新增 - 基于内存使用情况的随机
  const memoryWeight = performance && performance.memory ?
    (performance.memory.usedJSHeapSize % 1000) / 1000 : 0;
  const memoryWeightedIndex = Math.floor(memoryWeight * dynamicPool.length);

  // 方法8: 新增 - 基于URL哈希的随机
  const urlWeight = window.location.hash ?
    (window.location.hash.length % 1000) / 1000 : 0;
  const urlWeightedIndex = Math.floor(urlWeight * dynamicPool.length);

  // 综合多种方法，增加随机性
  const method1 = seededRandom();
  const method2 = seededRandom();
  const method3 = seededRandom();
  const method4 = seededRandom();
  const method5 = seededRandom();
  const method6 = seededRandom();
  const method7 = seededRandom();
  const method8 = seededRandom();

  // 加权平均 - 使用更多方法
  finalIndex = Math.floor(
    (baseRandom * method1 +
      timeWeightedIndex * method2 +
      mouseWeightedIndex * method3 +
      hashIndex * method4 +
      scrollWeightedIndex * method5 +
      performanceWeightedIndex * method6 +
      memoryWeightedIndex * method7 +
      urlWeightedIndex * method8) /
    (method1 + method2 + method3 + method4 + method5 + method6 + method7 + method8)
  );

  // 确保索引在有效范围内
  finalIndex = Math.max(0, Math.min(finalIndex, dynamicPool.length - 1));

  const result = dynamicPool[finalIndex];

  console.log("增强版随机结果计算详情:", {
    baseRandom,
    timeWeightedIndex,
    mouseWeightedIndex,
    hashIndex,
    scrollWeightedIndex,
    performanceWeightedIndex,
    memoryWeightedIndex,
    urlWeightedIndex,
    method1, method2, method3, method4, method5, method6, method7, method8,
    finalIndex,
    result: result.title,
    isRandomInsert: result.isRandomInsert || false,
    poolSize: dynamicPool.length
  });

  return {
    item: result,
    index: finalIndex,
    isRandomInsert: result.isRandomInsert || false
  };
}

// 全局变量
let dataManager = null; // 数据管理器实例
let appData = {
  groups: [],
  currentGroup: "default",
  lastDrawTime: null,
  drawHistory: [],
  // 动画配置
  animationConfig: {
    flipDuration: 800, // 翻页动画持续时间（毫秒）
    pauseDuration: 500, // 每个卡片展示后的停顿时间（毫秒）
    totalDuration: 15000, // 抽奖总持续时间（毫秒）- 默认 15 秒
  },
  // 速度档位配置
  speedLevels: {
    slow: {
      name: "慢速",
      flipDuration: 600, // 翻页动画持续时间（毫秒）- 砍半
      pauseDuration: 800, // 每个卡片展示后的停顿时间（毫秒）
      totalDuration: 20000, // 抽奖总持续时间（毫秒）- 20 秒
      description: "慢速模式，动画更慢，总时长20秒"
    },
    normal: {
      name: "正常",
      flipDuration: 400, // 翻页动画持续时间（毫秒）- 砍半
      pauseDuration: 500, // 每个卡片展示后的停顿时间（毫秒）
      totalDuration: 15000, // 抽奖总持续时间（毫秒）- 15 秒
      description: "正常模式，平衡的速度和时长"
    },
    fast: {
      name: "快速",
      flipDuration: 250, // 翻页动画持续时间（毫秒）- 砍半
      pauseDuration: 300, // 每个卡片展示后的停顿时间（毫秒）
      totalDuration: 10000, // 抽奖总持续时间（毫秒）- 10 秒
      description: "快速模式，动画更快，总时长10秒"
    }
  },
  currentSpeedLevel: "normal" // 当前速度档位，默认为正常
};

let isDrawing = false;
let drawInterval = null;
let randomSeed = 0; // 随机数种子
let clickPosition = { x: 0, y: 0 }; // 点击位置

let currentCardIndex = 0;
let currentDisplayedItem = null; // 当前显示的卡片项目

// 初始化应用
document.addEventListener("DOMContentLoaded", async function () {
  // 初始化数据管理器
  dataManager = new DataManager();
  await dataManager.load();

  // 同步数据到本地变量
  syncDataFromManager();

  updateAnimationConfig(); // 更新动画配置
  setupResponsiveFeatures();
  setupButtonEvents(); // 设置按钮事件

  // 立即初始化 result-card 的样式
  initializeResultCard();

  // 加载数据并显示最后一次抽奖结果或第一张卡片
  showLastDrawResult();

  // 数据加载完成后更新卡片内容区域位置
  setTimeout(() => {
    updateCardContentPosition();
  }, 100);

  // 监听数据变化事件（来自管理页面）
  setupDataChangeListener();

  // 执行随机性验证测试
  setTimeout(() => {
    console.log("🎲 系统初始化完成，开始随机性验证...");
    validateRandomness();
    testDataSync();
  }, 2000);
});

// 从数据管理器同步数据到本地变量
function syncDataFromManager() {
  const managerData = dataManager.getData();
  // 保留动画配置
  const currentAnimationConfig = appData.animationConfig;

  appData = {
    ...appData,
    groups: managerData.groups || [],
    currentGroup: managerData.currentGroup || "default",
    lastDrawTime: managerData.lastDrawTime || null,
    drawHistory: managerData.drawHistory || [],
    animationConfig: currentAnimationConfig, // 保留动画配置
  };
}

// 保存数据到数据管理器
function saveData() {
  // 同步本地数据到管理器
  const managerData = dataManager.getData();
  managerData.groups = appData.groups;
  managerData.currentGroup = appData.currentGroup;
  managerData.lastDrawTime = appData.lastDrawTime;
  managerData.drawHistory = appData.drawHistory;

  // 保存数据
  dataManager.save();
}

// 初始化 result-card 的样式
function initializeResultCard() {
  const resultTitle = document.getElementById("resultTitle");
  const resultDescription = document.getElementById("resultDescription");

  // 为默认文本应用样式规则
  setTitleFontSize(resultTitle, resultTitle.textContent);

  // 确保 result-card 显示
  const resultCard = document.getElementById("resultCard");
  resultCard.style.display = "flex";
}

// 设置按钮事件
function setupButtonEvents() {
  const startBtn = document.getElementById("startBtn");

  // 点击事件 - 立即开始抽奖
  startBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!isDrawing) {
      console.log("点击开始抽奖");
      // 记录点击位置
      clickPosition = { x: e.clientX, y: e.clientY };
      startDrawWithClick();
    }
  });

  // 防止移动端长按菜单
  startBtn.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // 设置速度选择器事件
  setupSpeedSelector();
}

// 点击开始抽奖 - 增强版
function startDrawWithClick() {
  if (isDrawing) {
    console.log("动画正在进行中，跳过");
    return;
  }

  console.log("🎲 点击开始抽奖 - 增强随机性模式");

  // 第一次生成复合随机种子
  randomSeed = generateCompositeSeed();

  // 添加额外的随机延迟，确保每次点击都有不同的时间戳
  const randomDelay = Math.floor(Math.random() * 100) + 10; // 10-110ms的随机延迟

  setTimeout(() => {
    // 第二次更新随机种子，增加随机性
    randomSeed = generateCompositeSeed();

    // 第三次生成最终随机种子，确保最大随机性
    setTimeout(() => {
      randomSeed = generateCompositeSeed();
      console.log("🎯 最终随机种子：", randomSeed);
      console.log("🎲 随机性验证：种子变化幅度", Math.abs(randomSeed - generateCompositeSeed()));

      // 开始抽奖
      startDraw();
    }, Math.floor(Math.random() * 30)); // 0-30ms的额外随机延迟

  }, randomDelay);
}

// 设置速度选择器
function setupSpeedSelector() {
  const speedButtons = document.querySelectorAll('.speed-btn');

  speedButtons.forEach(button => {
    button.addEventListener('click', function () {
      const speedLevel = this.getAttribute('data-speed');
      setSpeedLevel(speedLevel);
    });
  });

  // 初始化当前速度档位的显示
  updateSpeedSelectorDisplay();
}

// 设置速度档位
function setSpeedLevel(speedLevel) {
  if (!appData.speedLevels[speedLevel]) {
    console.error('无效的速度档位：', speedLevel);
    return;
  }

  appData.currentSpeedLevel = speedLevel;

  // 更新动画配置
  updateAnimationConfig();

  // 更新UI显示
  updateSpeedSelectorDisplay();

  console.log('速度档位已设置为：', speedLevel, appData.speedLevels[speedLevel].name);
}

// 更新速度选择器显示
function updateSpeedSelectorDisplay() {
  const speedButtons = document.querySelectorAll('.speed-btn');

  speedButtons.forEach(button => {
    const speedLevel = button.getAttribute('data-speed');
    if (speedLevel === appData.currentSpeedLevel) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// 禁用control-panel区域的按钮
function disableControlPanelButtons() {
  const controlPanel = document.querySelector('.control-panel');
  if (controlPanel) {
    const buttons = controlPanel.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.6';
    });
  }
}

// 启用control-panel区域的按钮
function enableControlPanelButtons() {
  const controlPanel = document.querySelector('.control-panel');
  if (controlPanel) {
    const buttons = controlPanel.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = false;
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    });
  }
}

// 更新动画配置
function updateAnimationConfig() {
  const root = document.documentElement;
  const currentSpeed = appData.speedLevels[appData.currentSpeedLevel];

  // 更新CSS变量
  root.style.setProperty(
    "--flip-duration",
    `${currentSpeed.flipDuration}ms`
  );

  // 更新动画配置
  appData.animationConfig.flipDuration = currentSpeed.flipDuration;
  appData.animationConfig.pauseDuration = currentSpeed.pauseDuration;
  appData.animationConfig.totalDuration = currentSpeed.totalDuration;

  console.log("动画配置已更新：", {
    speedLevel: appData.currentSpeedLevel,
    name: currentSpeed.name,
    flipDuration: currentSpeed.flipDuration,
    pauseDuration: currentSpeed.pauseDuration,
    totalDuration: currentSpeed.totalDuration
  });
}

// 更新动画设置 UI

// 设置响应式功能
function setupResponsiveFeatures() {
  // 监听屏幕方向变化
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      // 重新计算布局
      updateLayoutForOrientation();
    }, 100);
  });

  // 监听窗口大小变化
  window.addEventListener("resize", function () {
    updateLayoutForOrientation();
  });

  // 初始布局调整
  updateLayoutForOrientation();
}

// 确保 card-content-wrapper 相对于 card-display-area 保持固定比例
function updateCardContentPosition() {
  const cardDisplayArea = document.querySelector('.card-display-area');
  const cardContentWrapper = document.querySelector('.card-content-wrapper');

  if (!cardDisplayArea || !cardContentWrapper) return;

  // 获取 card-display-area 的尺寸
  const displayAreaRect = cardDisplayArea.getBoundingClientRect();
  const displayAreaWidth = displayAreaRect.width;
  const displayAreaHeight = displayAreaRect.height;

  // 计算 card-content-wrapper 应该的尺寸和位置
  // 基于固定的百分比关系
  const wrapperWidth = displayAreaWidth * 0.28; // 28%
  const wrapperHeight = displayAreaHeight * 0.25; // 25%
  const wrapperLeft = displayAreaWidth * 0.20; // 21% margin-left
  const wrapperBottom = displayAreaHeight * 0.33; // 25% margin-bottom (稍微向上)

  // 确保 card-content-wrapper 的尺寸和位置正确
  cardContentWrapper.style.width = `${wrapperWidth}px`;
  cardContentWrapper.style.height = `${wrapperHeight}px`;
  cardContentWrapper.style.left = `${wrapperLeft}px`;
  cardContentWrapper.style.bottom = `${wrapperBottom}px`;
  cardContentWrapper.style.marginLeft = '0';
  cardContentWrapper.style.marginBottom = '0';

  // 更新文字大小
  applyTextScale();

  console.log('卡片内容区域位置和文字缩放已更新:', {
    displayAreaWidth,
    displayAreaHeight,
    wrapperWidth,
    wrapperHeight,
    wrapperLeft,
    wrapperBottom,
    scaleFactor: calculateScaleFactor()
  });
}

// 计算缩放因子
function calculateScaleFactor() {
  const displayAreaRect = document.querySelector('.card-display-area').getBoundingClientRect();
  const baseWidth = 500;
  const baseHeight = 375;
  const widthScale = displayAreaRect.width / baseWidth;
  const heightScale = displayAreaRect.height / baseHeight;
  const scaleFactor = Math.min(widthScale, heightScale);
  return Math.max(0.6, Math.min(1.5, scaleFactor));
}

// 应用文字缩放
function applyTextScale() {
  const cardContentWrapper = document.querySelector('.card-content-wrapper');
  if (cardContentWrapper) {
    const scaleFactor = calculateScaleFactor();
    updateTextScale(cardContentWrapper, scaleFactor);
  }
}

// 更新文字缩放
function updateTextScale(container, scaleFactor) {
  // 更新容器内所有文字元素的大小
  const titleElements = container.querySelectorAll('h2, h3');
  const descriptionElements = container.querySelectorAll('p');

  // 基准字体大小
  const baseTitleSize = 0.6; // 对应旋转卡片的字体大小
  const baseDescriptionSize = 0.425; // 对应旋转卡片的描述字体大小
  
  // result-card 的倍数调整
  const resultCardTitleMultiplier = 1.5; // result-card 标题倍数
  const resultCardDescriptionMultiplier = 1.2; // result-card 描述倍数

  // 更新标题文字大小
  titleElements.forEach(element => {
    const newSize = baseTitleSize * scaleFactor;
    element.style.fontSize = `${newSize}em`;
  });

  // 更新描述文字大小
  descriptionElements.forEach(element => {
    const newSize = baseDescriptionSize * scaleFactor;
    element.style.fontSize = `${newSize}em`;
  });

  // 同时更新 result-card 内的文字
  const resultCard = document.querySelector('.result-card');
  if (resultCard) {
    const resultTitle = resultCard.querySelector('h2');
    const resultDescription = resultCard.querySelector('p');

    if (resultTitle) {
      // 检查标题是否已经有内容，如果有则使用 setTitleFontSize 的逻辑
      if (resultTitle.textContent && resultTitle.textContent.trim() !== '') {
        // 使用 setTitleFontSize 的逻辑，但应用缩放系数
        const scaleFactor = calculateScaleFactor();
        const shortTitleSize = 1.2; // 短标题的字体大小
        const baseTitleSize = 0.6; // 对应旋转卡片的字体大小
        
        if (resultTitle.textContent.length <= 3) {
          const newSize = shortTitleSize * scaleFactor * resultCardTitleMultiplier;
          resultTitle.style.fontSize = `${newSize}em`;
        } else {
          const newSize = baseTitleSize * scaleFactor * resultCardTitleMultiplier;
          resultTitle.style.fontSize = `${newSize}em`;
        }
      } else {
        // 如果没有内容，使用默认计算
        const newSize = baseTitleSize * scaleFactor;
        resultTitle.style.fontSize = `${newSize * resultCardTitleMultiplier}em`;
      }
    }

    if (resultDescription) {
      const newSize = baseDescriptionSize * scaleFactor;
      resultDescription.style.fontSize = `${newSize * resultCardDescriptionMultiplier}em`; // result-card 描述使用倍数调整
    }
  }
}

// 根据屏幕方向更新布局
function updateLayoutForOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = window.innerWidth <= 768;

  if (isLandscape && isMobile) {
    // 横屏手机模式
    document.body.classList.add("landscape-mobile");
    document.body.classList.remove("portrait-mobile");
  } else if (isMobile) {
    // 手机模式
    document.body.classList.add("portrait-mobile");
    document.body.classList.remove("landscape-mobile");
  } else {
    // 桌面模式
    document.body.classList.remove("landscape-mobile", "portrait-mobile");
  }

  // 更新卡片内容区域的位置
  setTimeout(() => {
    updateCardContentPosition();
  }, 100);
}

// 加载数据


// 显示第一个食品
function showFirstCard() {
  const currentGroup = appData.groups.find(
    (g) => g.id === appData.currentGroup
  );
  if (currentGroup && currentGroup.items.length > 0) {
    const firstItem = currentGroup.items[0];
    currentDisplayedItem = firstItem; // 设置当前显示的项目
    displayFirstCard(firstItem);
    console.log("显示第一个卡片：", firstItem.title);
  } else {
    // 如果没有数据，确保显示默认样式
    initializeResultCard();
    console.log("没有数据，显示默认样式");
  }
}



// 开始抽取
function startDraw() {
  if (isDrawing) {
    console.log("动画正在进行中，跳过");
    return;
  }

  console.log("开始新的抽取动画");

  // 确保之前的动画完全停止
  if (drawInterval) {
    clearInterval(drawInterval);
    drawInterval = null;
  }

  isDrawing = true;
  const startBtn = document.getElementById("startBtn");
  const progressIndicator = document.getElementById("progressIndicator");
  const progressText = document.getElementById("progressText");

  // 禁用control-panel区域的所有按钮
  disableControlPanelButtons();
  
  progressIndicator.style.display = "flex";
  progressText.textContent = "抽取中...";

  // 计算实际抽奖时间
  const baseDuration = appData.animationConfig.totalDuration; // 基础15秒

  // 使用随机种子生成 -3 到 +5 秒的随机时间调整
  const seededRandom = seedRandom(randomSeed);
  const timeAdjustmentSeconds = (seededRandom() * 8) - 3; // 0-8 减3 = -3到+5
  const timeAdjustmentMs = Math.round(timeAdjustmentSeconds * 1000);
  const actualDuration = Math.max(5000, baseDuration + timeAdjustmentMs); // 最少5秒

  console.log("实际抽奖时间：", actualDuration, "ms (基础:", baseDuration, "ms + 调整:", timeAdjustmentMs, "ms)");

  // 启动抽奖进度条动画
  startDrawProgressBar(actualDuration);

  // 开始卡片滚动
  startCardRolling(actualDuration);
}

// 启动抽奖进度条动画
function startDrawProgressBar(duration) {
  console.log("启动抽奖进度条动画，持续时间：", duration, "ms");

  const drawStartTime = Date.now();
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  function updateDrawProgress() {
    if (!isDrawing) {
      console.log("抽奖已结束，停止进度条动画");
      return;
    }

    const elapsed = Date.now() - drawStartTime;
    const progress = Math.min((elapsed / duration) * 100, 100);

    progressFill.style.width = progress + "%";

    // 更新提示文本
    const remainingTime = Math.max(0, duration - elapsed);
    const remainingSeconds = (remainingTime / 1000).toFixed(1);
    progressText.textContent = `抽取中... ${remainingSeconds}s`;

    if (progress < 100 && isDrawing) {
      requestAnimationFrame(updateDrawProgress);
    } else {
      console.log("进度条动画完成，进度：", progress + "%");
    }
  }

  // 开始进度条动画
  updateDrawProgress();
}

// 开始卡片滚动
function startCardRolling(duration) {
  // 确保 duration 是有效的数字
  if (!duration || isNaN(duration) || duration <= 0) {
    console.error("无效的动画持续时间：", duration);
    duration = appData.animationConfig.totalDuration; // 使用默认时间
  }

  const currentGroup = appData.groups.find(
    (g) => g.id === appData.currentGroup
  );
  if (!currentGroup || currentGroup.items.length === 0) {
    endDraw();
    return;
  }

  // 隐藏 result-card，显示 card-container
  const resultCard = document.getElementById("resultCard");
  const cardContainer = document.getElementById("cardContainer");
  resultCard.style.display = "none";
  cardContainer.style.display = "flex";

  const originalItems = currentGroup.items;

  // 创建动态选项池
  const dynamicPool = createDynamicItemPool(originalItems, randomSeed);

  // 使用改进的随机算法计算最终结果
  const randomResult = calculateRandomResult(dynamicPool, randomSeed);
  const finalResult = randomResult.item;

  console.log("动态抽奖结果：", {
    originalItemsCount: originalItems.length,
    dynamicPoolCount: dynamicPool.length,
    finalResult: finalResult.title,
    isRandomInsert: randomResult.isRandomInsert,
    finalIndex: randomResult.index
  });

  // 输出动态池的详细信息
  console.log("动态选项池详情：", dynamicPool.map((item, index) => ({
    index,
    title: item.title,
    isRandomInsert: item.isRandomInsert || false,
    originalId: item.originalId || null
  })));

  // 使用随机种子来影响初始索引、转动速度和动画参数
  const seededRandom = seedRandom(randomSeed);

  // 验证随机性：生成多个随机数确保种子工作正常
  const testRandom1 = seededRandom();
  const testRandom2 = seededRandom();
  const testRandom3 = seededRandom();

  console.log("随机性验证：", {
    seed: randomSeed,
    test1: testRandom1,
    test2: testRandom2,
    test3: testRandom3,
    variance: Math.abs(testRandom1 - testRandom2) + Math.abs(testRandom2 - testRandom3)
  });

  // 计算随机初始索引（基于动态池）
  let currentIndex = Math.floor(seededRandom() * dynamicPool.length);
  let nextIndex = (currentIndex + 1) % dynamicPool.length;

  console.log("动态抽奖开始：", {
    initialIndex: currentIndex,
    initialItem: dynamicPool[currentIndex].title,
    finalResult: finalResult.title,
    finalIndex: randomResult.index
  });

  // 计算随机转动速度（基于随机种子）
  const baseSpeed = appData.animationConfig.flipDuration; // 基础翻页速度
  const speedVariation = seededRandom() * 0.4 + 0.8; // 0.8-1.2 倍速变化
  const randomSpeed = Math.floor(baseSpeed * speedVariation);

  // 计算随机停顿时间
  const basePause = appData.animationConfig.pauseDuration;
  const pauseVariation = seededRandom() * 0.3 + 0.85; // 0.85-1.15 倍停顿变化
  const randomPause = Math.floor(basePause * pauseVariation);

  // 计算随机动画路径：决定是否跳过某些选项
  const skipProbability = seededRandom() * 0.3; // 0-30%的概率跳过选项
  const shouldSkipRandomly = seededRandom() < skipProbability;

  console.log("动画参数随机化：", {
    baseSpeed,
    speedVariation,
    randomSpeed,
    basePause,
    pauseVariation,
    randomPause,
    skipProbability,
    shouldSkipRandomly
  });

  let drawStartTime = Date.now();
  let isAnimating = false;

  // 创建翻书动画容器
  cardContainer.innerHTML = "";

  // 创建两个卡片用于翻书效果
  let card1 = createCard(dynamicPool[currentIndex]); // 当前显示的卡片
  let card2 = createCard(dynamicPool[nextIndex]); // 下一个要显示的卡片

  card1.className = "card book-page active";
  card2.className = "card book-page next";

  // 设置第二张卡片的初始状态为翻转状态（隐藏状态）
  card2.style.transform = "rotateX(-90deg)";
  card2.style.zIndex = "1";
  card2.style.filter = "brightness(0.9) contrast(0.95)";

  // 设置卡片位置，让它们重叠在同一个位置
  card1.style.position = "absolute";
  card1.style.top = "0";
  card1.style.left = "0";
  card1.style.right = "0";
  card1.style.bottom = "0";
  card1.style.margin = "auto";

  card2.style.position = "absolute";
  card2.style.top = "0";
  card2.style.left = "0";
  card2.style.right = "0";
  card2.style.bottom = "0";
  card2.style.margin = "auto";

  cardContainer.appendChild(card1);
  cardContainer.appendChild(card2);

  console.log("开始动画，随机种子：", randomSeed);
  console.log("初始索引：", currentIndex, "项目：", dynamicPool[currentIndex].title);
  console.log("随机转动速度：", randomSpeed, "ms (基础：", baseSpeed, "ms)");
  console.log("随机停顿时间：", randomPause, "ms (基础：", basePause, "ms)");
  console.log("动画持续时间：", duration, "ms");
  console.log("🎲 本次抽奖使用动态选项池，增加了随机插入选项功能！");

  // 移除随机性指示器显示

  function performNextAnimation() {
    // 检查是否超过总持续时间
    const elapsed = Date.now() - drawStartTime;
    console.log("动画检查：已过时间", elapsed, "ms，总时间", duration, "ms");

    if (elapsed >= duration) {
      // 动画结束，使用预计算的最终结果，而不是当前显示的卡片
      console.log("动画结束，预计算的最终结果：", finalResult.title);

      // 隐藏 card-container，显示最终结果
      cardContainer.style.display = "none";
      showLastCard(finalResult);
      endDraw(finalResult); // 传递预计算的最终结果给 endDraw
      return;
    }

    // 如果正在动画中，跳过这次更新
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    const currentItem = dynamicPool[currentIndex];
    const nextItem = dynamicPool[nextIndex];

    console.log(
      `准备翻页：当前显示 ${currentItem.title}，切换到 ${nextItem.title}`
    );

    // 执行翻书动画：从当前卡片切换到下一个卡片
    performBookFlip(card1, card2, nextItem, randomSpeed, () => {
      // 动画完成后的回调
      isAnimating = false;

      // 更新当前显示的索引
      currentIndex = nextIndex;
      currentDisplayedItem = dynamicPool[currentIndex];

      // 计算下一个要显示的索引（支持循环）
      nextIndex = (nextIndex + 1) % dynamicPool.length;

      // 随机跳过选项（增加随机性）
      if (shouldSkipRandomly && seededRandom() < 0.2) { // 20%概率跳过
        nextIndex = (nextIndex + 1) % dynamicPool.length;
        console.log(`随机跳过选项，直接跳到：${dynamicPool[nextIndex].title}`);
      }

      // 交换卡片引用
      const temp = card1;
      card1 = card2;
      card2 = temp;

      console.log(
        `翻页完成：现在显示 ${dynamicPool[currentIndex].title}，停顿 ${randomPause}ms 后继续`
      );

      // 使用随机停顿时间
      setTimeout(() => {
        if (isDrawing) {
          performNextAnimation();
        }
      }, randomPause);
    });
  }

  // 开始第一个动画（使用随机停顿时间）
  setTimeout(() => {
    if (isDrawing) {
      performNextAnimation();
    }
  }, randomPause);
}

// 创建卡片元素
function createCard(item) {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="card-content">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `;

  // 根据标题长度设置字体大小
  const titleElement = card.querySelector("h3");
  setTitleFontSize(titleElement, item.title);

  return card;
}

// 根据标题长度设置字体大小
function setTitleFontSize(titleElement, title) {

  // 获取缩放系数
  const scaleFactor = calculateScaleFactor();

  // 基准字体大小
  const baseTitleSize = 0.6; // 对应旋转卡片的字体大小
  const baseDescriptionSize = 0.425; // 对应旋转卡片的描述字体大小
  const shortTitleSize = 1.2; // 短标题的字体大小

  if (title.length <= 3) {
    const newSize = shortTitleSize * scaleFactor; // 短标题使用 1.2em
    titleElement.style.fontSize = `${newSize}em`;
  } else {
    const newSize = baseTitleSize * scaleFactor; // 长标题使用 0.6em
    titleElement.style.fontSize = `${newSize}em`;
  }
}

// 执行翻书动画
function performBookFlip(
  currentCard,
  nextCard,
  nextItem,
  customDuration,
  callback
) {
  // 1. 在动画开始前，将 nextCard 的内容更新为新内容
  const titleElement = nextCard.querySelector("h3");
  titleElement.textContent = nextItem.title;
  nextCard.querySelector("p").textContent = nextItem.description;
  setTitleFontSize(titleElement, nextItem.title);

  // 2. 更新CSS变量以匹配JavaScript的动画时间
  document.documentElement.style.setProperty(
    "--flip-duration",
    `${customDuration}ms`
  );

  // 3. 添加翻书动画类，启动动画
  currentCard.classList.add("flipping-up");
  nextCard.classList.add("flipping-in");

  // 优化打印的日志，表明动画的开始和持续时间
  console.log(
    `[LOG] 动画开始：从 ${currentCard.querySelector("h3").textContent} 翻转到 ${nextItem.title
    }, 持续时间: ${customDuration}ms`
  );

  // 4. 动画结束后清理和交换
  setTimeout(() => {
    // 动画结束，移除动画类
    currentCard.classList.remove("flipping-up");
    nextCard.classList.remove("flipping-in");

    // 设置最终状态：
    // 当前卡片（旧的）变为下一个准备翻转的卡片
    currentCard.classList.remove("active");
    currentCard.classList.add("next");
    currentCard.style.transform = "rotateX(-90deg)";

    // 下一张卡片（新的）变为当前显示卡片
    nextCard.classList.remove("next");
    nextCard.classList.add("active");
    nextCard.style.transform = "rotateX(0deg)";

    // 优化打印的日志，表明停顿前最终显示的是哪张卡片
    console.log(`[LOG] 翻书动画完成，现在显示：${nextItem.title}`);

    // 执行回调函数
    if (callback) {
      callback();
    }
  }, customDuration); // 使用自定义动画持续时间
}

// 显示卡片
function displayCard(item) {
  const cardContainer = document.getElementById("cardContainer");

  // 清除之前的卡片
  cardContainer.innerHTML = "";

  // 创建新卡片
  const card = document.createElement("div");
  card.className = "card book-page active";
  card.innerHTML = `
        <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `;

  // 根据标题长度设置字体大小
  const titleElement = card.querySelector("h3");
  setTitleFontSize(titleElement, item.title);

  // 设置卡片位置，居中显示
  card.style.position = "absolute";
  card.style.top = "0";
  card.style.left = "0";
  card.style.right = "0";
  card.style.bottom = "0";
  card.style.margin = "auto";

  // 添加放射光效果
  card.classList.add("radial-glow");

  cardContainer.appendChild(card);

  console.log("显示卡片：", item.title);
}

// 显示第一个卡片（在 result-card 中）
function displayFirstCard(item) {
  const resultCard = document.getElementById("resultCard");
  const resultTitle = document.getElementById("resultTitle");
  const resultDescription = document.getElementById("resultDescription");

  resultTitle.textContent = item.title;
  resultDescription.textContent = item.description;

  // 根据标题长度设置字体大小
  setTitleFontSize(resultTitle, item.title);

  resultCard.style.display = "flex";

  console.log("在 result-card 中显示第一个卡片：", item.title);
}

// 显示最后一次抽奖结果
function showLastDrawResult() {
  console.log("🔍 showLastDrawResult 被调用，当前数据状态：", {
    hasDrawHistory: !!appData.drawHistory,
    drawHistoryLength: appData.drawHistory ? appData.drawHistory.length : 0,
    drawHistory: appData.drawHistory ? appData.drawHistory.slice(0, 3) : null, // 只显示前3条记录
    currentGroup: appData.currentGroup,
    lastDrawTime: appData.lastDrawTime
  });

  // 检查是否有抽奖历史
  if (appData.drawHistory && appData.drawHistory.length > 0) {
    // 获取最后一次抽奖记录
    const lastDraw = appData.drawHistory[0]; // 历史记录是按时间倒序排列的
    console.log("🎯 显示最后一次抽奖结果：", lastDraw.title);

    // 显示最后一次抽奖的结果
    const resultCard = document.getElementById("resultCard");
    const resultTitle = document.getElementById("resultTitle");
    const resultDescription = document.getElementById("resultDescription");

    resultTitle.textContent = lastDraw.title;
    resultDescription.textContent = lastDraw.description;

    // 根据标题长度设置字体大小
    setTitleFontSize(resultTitle, lastDraw.title);

    resultCard.style.display = "flex";

    // 设置当前显示的项目
    currentDisplayedItem = lastDraw;

    console.log("✅ 已显示最后一次抽奖结果：", lastDraw.title);
  } else {
    // 如果没有抽奖历史，显示第一个卡片
    console.log("📋 没有抽奖历史，显示第一个卡片");
    console.log("📊 详细数据检查：", {
      appDataKeys: Object.keys(appData),
      groupsCount: appData.groups ? appData.groups.length : 0,
      currentGroupData: appData.groups ? appData.groups.find(g => g.id === appData.currentGroup) : null
    });
    showFirstCard();
  }
}

// 显示最后一个卡片
function showLastCard(item) {
  const resultCard = document.getElementById("resultCard");
  const resultTitle = document.getElementById("resultTitle");
  const resultDescription = document.getElementById("resultDescription");

  resultTitle.textContent = item.title;
  resultDescription.textContent = item.description;

  // 根据标题长度设置字体大小
  setTitleFontSize(resultTitle, item.title);

  resultCard.style.display = "flex";

  console.log("显示最后一个卡片：", item.title);
}

// 结束抽取
function endDraw(finalItem = null) {
  if (!isDrawing) return;

  console.log("结束抽取动画");

  isDrawing = false;
  clearInterval(drawInterval);
  drawInterval = null; // 确保定时器被正确清除

  const startBtn = document.getElementById("startBtn");
  const progressIndicator = document.getElementById("progressIndicator");
  const progressText = document.getElementById("progressText");

  // 启用control-panel区域的所有按钮
  enableControlPanelButtons();
  
  progressIndicator.style.display = "none";

  // 优先使用传入的最终结果，否则使用当前显示的卡片
  const resultItem = finalItem || currentDisplayedItem;

  if (resultItem) {
    console.log("动画结束，最终显示：", resultItem.title);

    // 处理随机插入的选项：如果是随机插入的，使用原始选项记录历史
    let historyItem = resultItem;
    if (resultItem.isRandomInsert && resultItem.originalId) {
      // 找到原始选项
      const currentGroup = appData.groups.find(
        (g) => g.id === appData.currentGroup
      );
      if (currentGroup) {
        const originalItem = currentGroup.items.find(item => item.id === resultItem.originalId);
        if (originalItem) {
          historyItem = originalItem;
          console.log("随机插入选项，使用原始选项记录历史：", originalItem.title);
        }
      }
    }

    // 显示最终结果
    showResult(resultItem);

    // 记录抽取历史 - 使用DataManager的方法
    const currentGroup = appData.groups.find(
      (g) => g.id === appData.currentGroup
    );
    if (currentGroup && dataManager) {
      // 使用DataManager的addDrawRecord方法，记录原始选项
      dataManager.addDrawRecord(historyItem, currentGroup.name);

      // 延迟同步数据到本地变量，避免立即触发数据变化事件
      setTimeout(() => {
        syncDataFromManager();
        console.log('📝 抽奖历史已记录并同步：', historyItem.title);
      }, 100);
    }
  }
}

// 显示结果
function showResult(item) {
  const resultCard = document.getElementById("resultCard");
  const resultTitle = document.getElementById("resultTitle");
  const resultDescription = document.getElementById("resultDescription");

  resultTitle.textContent = item.title;
  resultDescription.textContent = item.description;

  // 根据标题长度设置字体大小
  setTitleFontSize(resultTitle, item.title);

  resultCard.style.display = "flex";

  // 添加抖动效果
  resultCard.classList.add("shake");
  setTimeout(() => {
    resultCard.classList.remove("shake");
  }, 500);

  // 设置当前显示的项目
  currentDisplayedItem = item;
}

// 更新 UI
function updateUI() {
  const currentGroup = appData.groups.find(
    (g) => g.id === appData.currentGroup
  );
  if (currentGroup) {
    document.getElementById("currentGroupName").textContent = currentGroup.name;
  }
  updateGroupSelector();
}

// 更新组合选择器
function updateGroupSelector() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";

  appData.groups.forEach((group) => {
    const groupItem = document.createElement("div");
    groupItem.className = "group-item";
    if (group.id === appData.currentGroup) {
      groupItem.classList.add("active");
    }

    groupItem.innerHTML = `
            <div class="group-info">
                <h4>${group.name}</h4>
                <p>${group.items.length} 个选项</p>
            </div>
        `;

    groupItem.addEventListener("click", () => selectGroup(group.id));
    groupList.appendChild(groupItem);
  });
}

// 选择组合
function selectGroup(groupId) {
  if (dataManager && dataManager.setCurrentGroup(groupId)) {
    appData.currentGroup = groupId;
    updateUI();
    hideGroupSelector();
    showFirstCard(); // 显示新组合的第一个食品
  }
}


// 随机性验证函数 - 用于测试和验证随机性
function validateRandomness() {
  console.log("🔍 开始随机性验证测试...");

  const testResults = [];
  const testCount = 10;

  for (let i = 0; i < testCount; i++) {
    // 模拟点击位置
    clickPosition = {
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight)
    };

    // 生成随机种子
    const seed1 = generateCompositeSeed();
    const seed2 = generateCompositeSeed();

    testResults.push({
      testIndex: i + 1,
      clickPosition,
      seed1,
      seed2,
      seedDifference: Math.abs(seed1 - seed2),
      isDifferent: seed1 !== seed2
    });
  }

  // 分析结果
  const differentSeeds = testResults.filter(r => r.isDifferent).length;
  const averageDifference = testResults.reduce((sum, r) => sum + r.seedDifference, 0) / testCount;

  console.log("🎲 随机性验证结果:", {
    totalTests: testCount,
    differentSeeds,
    uniquenessRate: (differentSeeds / testCount * 100).toFixed(2) + "%",
    averageDifference: Math.floor(averageDifference),
    testResults
  });

  return {
    uniquenessRate: differentSeeds / testCount,
    averageDifference,
    testResults
  };
}

// 数据同步测试函数
function testDataSync() {
  console.log("🧪 开始数据同步测试...");
  console.log("📊 当前appData状态：", {
    hasDrawHistory: !!appData.drawHistory,
    drawHistoryLength: appData.drawHistory ? appData.drawHistory.length : 0,
    lastDrawTime: appData.lastDrawTime,
    currentGroup: appData.currentGroup
  });

  if (dataManager) {
    const managerData = dataManager.getData();
    console.log("📊 DataManager状态：", {
      hasDrawHistory: !!managerData.drawHistory,
      drawHistoryLength: managerData.drawHistory ? managerData.drawHistory.length : 0,
      lastDrawTime: managerData.lastDrawTime,
      currentGroup: managerData.currentGroup
    });
  }
}

// 显示组合选择器
function showGroupSelector() {
  document.getElementById("groupSelector").style.display = "flex";
}

// 隐藏组合选择器
function hideGroupSelector() {
  document.getElementById("groupSelector").style.display = "none";
}

// 打开管理页面
function openManagePage() {
  // 确保当前数据已保存
  if (dataManager) {
    dataManager.save();
  }
  window.open("manage.html", "_blank");
}

// 导出数据
function exportData() {
  if (dataManager) {
    const dataStr = dataManager.export();
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `eat-app-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// 导入数据
function importData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (dataManager) {
        dataManager.import(importedData);
        syncDataFromManager();
        updateUI();
        showLastDrawResult(); // 显示最后一次抽奖结果
        alert("数据导入成功！");
      }
    } catch (error) {
      alert("数据格式错误，导入失败！");
      console.error("导入数据失败：", error);
    }
  };
  reader.readAsText(file);
}

// 重置数据
function resetData() {
  if (confirm("确定要重置所有数据吗？此操作不可恢复！")) {
    if (dataManager) {
      dataManager.reset();
      syncDataFromManager();
      updateUI();
      showFirstCard();
      alert("数据已重置！");
    }
  }
}

// 处理导入文件
function handleImportFile(input) {
  const file = input.files[0];
  if (file) {
    importData(file);
  }
  input.value = ""; // 清空文件输入
}

// 键盘快捷键
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !isDrawing) {
    e.preventDefault();
    // 记录当前鼠标位置（如果鼠标在页面上）
    const mousePosition = { x: 0, y: 0 };
    if (e.clientX !== undefined && e.clientY !== undefined) {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    } else {
      // 如果没有鼠标位置信息，使用屏幕中心
      mousePosition.x = window.innerWidth / 2;
      mousePosition.y = window.innerHeight / 2;
    }
    clickPosition = mousePosition;
    startDrawWithClick();
  }

  if (e.code === "Escape") {
    hideGroupSelector();
  }
});

// 防止页面刷新时丢失数据
window.addEventListener("beforeunload", function () {
  saveData();
});

// 移动端特殊处理
if ("ontouchstart" in window) {
  // 移动端优化
  document.addEventListener("touchstart", function () { }, { passive: true });

  // 防止双击缩放
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
}

// 数据变化防抖变量
let dataChangeTimeout = null;

// 设置数据变化监听器
function setupDataChangeListener() {
  // 监听storage事件，当其他页面修改localStorage时触发
  window.addEventListener('storage', function (e) {
    if (e.key === 'eatAppData' && e.newValue) {
      console.log('🔄 检测到storage数据变化，正在刷新...');
      console.log('📊 变化详情：', {
        oldValue: e.oldValue,
        newValue: e.newValue ? '有数据' : '无数据',
        url: e.url,
        storageArea: e.storageArea
      });

      // 清除之前的定时器
      if (dataChangeTimeout) {
        clearTimeout(dataChangeTimeout);
      }

      // 重新加载数据
      dataManager.load().then(() => {
        console.log('📥 数据重新加载完成');
        syncDataFromManager();
        updateUI();
        // 添加延迟确保数据同步完成
        dataChangeTimeout = setTimeout(() => {
          console.log('⏰ 延迟后调用showLastDrawResult');
          showLastDrawResult(); // 显示最后一次抽奖结果，而不是第一个卡片
        }, 200); // 增加延迟时间到200ms
      });
    }
  });

  // 监听自定义事件（用于同页面内的数据变化）
  window.addEventListener('dataChanged', function () {
    console.log('🔄 检测到自定义数据变化事件，正在刷新...');

    // 清除之前的定时器
    if (dataChangeTimeout) {
      clearTimeout(dataChangeTimeout);
    }

    syncDataFromManager();
    updateUI();
    // 添加延迟确保数据同步完成
    dataChangeTimeout = setTimeout(() => {
      console.log('⏰ 延迟后调用showLastDrawResult');
      showLastDrawResult(); // 显示最后一次抽奖结果，而不是第一个卡片
    }, 200); // 增加延迟时间到200ms
  });
}
