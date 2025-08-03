// 种子随机数生成器
function seedRandom(seed) {
  let m = 0x80000000; // 2**31
  let a = 1103515245;
  let c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * (m - 1));

  return function () {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// 生成复合随机种子
function generateCompositeSeed() {
  const currentTime = Date.now();
  const timeOfDay = new Date().getTime();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const userAgent = navigator.userAgent;

  // 组合多个随机元素
  let compositeSeed = currentTime;
  compositeSeed += clickPosition.x * 10000;
  compositeSeed += clickPosition.y * 10000;
  compositeSeed += buttonPressTime;
  compositeSeed += timeOfDay;
  compositeSeed += screenWidth * screenHeight;

  // 添加用户代理字符串的哈希
  let userAgentHash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    userAgentHash =
      ((userAgentHash << 5) - userAgentHash + userAgent.charCodeAt(i)) &
      0xffffffff;
  }
  compositeSeed += userAgentHash;

  // 添加鼠标位置和时间的组合
  compositeSeed += (clickPosition.x + clickPosition.y) * (currentTime % 10000);

  console.log("复合随机种子生成：", {
    currentTime,
    clickPosition,
    buttonPressTime,
    timeOfDay,
    screenSize: `${screenWidth}x${screenHeight}`,
    userAgentHash,
    finalSeed: compositeSeed,
  });

  return compositeSeed;
}

// 全局变量
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
    longPressDelay: 500, // 长按延迟时间（毫秒）
    maxLongPressBonus: 5000, // 最大长按延长时间（毫秒）- 5 秒
  },
};

let isDrawing = false;
let drawInterval = null;
let longPressTimer = null;
let longPressStartTime = 0;
let longPressDuration = 0; // 长按持续时间
let randomSeed = 0; // 随机数种子
let clickPosition = { x: 0, y: 0 }; // 点击位置
let buttonPressTime = 0; // 按钮按下时间

let currentCardIndex = 0;
let isLongPressing = false;
let currentDisplayedItem = null; // 当前显示的卡片项目

// 初始化应用
document.addEventListener("DOMContentLoaded", function () {
  updateAnimationConfig(); // 更新动画配置
  setupResponsiveFeatures();
  setupButtonEvents(); // 设置按钮事件

  // 立即初始化 result-card 的样式
  initializeResultCard();

  // 加载数据并显示第一张卡片
  loadData();
});

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
    if (!isDrawing && !isLongPressing) {
      console.log("点击开始抽奖");
      // 记录点击位置
      clickPosition = { x: e.clientX, y: e.clientY };
      startDrawWithClick();
    }
  });

  // 鼠标按下事件 - 开始长按
  startBtn.addEventListener("mousedown", function (e) {
    e.preventDefault();
    if (!isDrawing) {
      console.log("鼠标按下，开始长按检测");
      // 记录按下位置和时间
      clickPosition = { x: e.clientX, y: e.clientY };
      buttonPressTime = Date.now();
      startLongPress();
    }
  });

  // 鼠标松开事件 - 结束长按
  startBtn.addEventListener("mouseup", function (e) {
    e.preventDefault();
    console.log("鼠标松开，结束长按");
    endLongPress();
  });

  // 鼠标离开事件 - 结束长按
  startBtn.addEventListener("mouseleave", function (e) {
    e.preventDefault();
    console.log("鼠标离开，结束长按");
    endLongPress();
  });

  // 触摸开始事件 - 开始长按
  startBtn.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      if (!isDrawing) {
        console.log("触摸开始，开始长按检测");
        // 记录触摸位置和时间
        const touch = e.touches[0];
        clickPosition = { x: touch.clientX, y: touch.clientY };
        buttonPressTime = Date.now();
        startLongPress();
      }
    },
    { passive: false }
  );

  // 触摸结束事件 - 结束长按
  startBtn.addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      console.log("触摸结束，结束长按");
      endLongPress();
    },
    { passive: false }
  );

  // 触摸取消事件 - 结束长按
  startBtn.addEventListener(
    "touchcancel",
    function (e) {
      e.preventDefault();
      console.log("触摸取消，结束长按");
      endLongPress();
    },
    { passive: false }
  );

  // 防止移动端长按菜单
  startBtn.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
}

// 点击开始抽奖
function startDrawWithClick() {
  if (isDrawing) {
    console.log("动画正在进行中，跳过");
    return;
  }

  console.log("点击开始抽奖");

  // 生成复合随机种子
  randomSeed = generateCompositeSeed();

  // 开始抽奖
  startDraw();
}

// 更新动画配置
function updateAnimationConfig() {
  const root = document.documentElement;
  root.style.setProperty(
    "--flip-duration",
    `${appData.animationConfig.flipDuration}ms`
  );
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
}

// 加载数据
async function loadData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // 保存当前的 animationConfig
    const currentAnimationConfig = appData.animationConfig;

    // 合并数据，但保留 animationConfig
    appData = { ...appData, ...data };
    appData.animationConfig = currentAnimationConfig;

    // 检查本地存储
    const localData = localStorage.getItem("eatAppData");
    if (localData) {
      const local = JSON.parse(localData);
      // 再次保存 animationConfig
      const savedAnimationConfig = appData.animationConfig;
      appData = { ...appData, ...local };
      appData.animationConfig = savedAnimationConfig;
    }

    updateUI();
    // 数据加载完成后立即显示第一张卡片
    showFirstCard();
  } catch (error) {
    console.error("加载数据失败:", error);
    // 使用默认数据
    loadDefaultData();
    // 默认数据加载后也显示第一张卡片
    showFirstCard();
  }
}

// 加载默认数据
function loadDefaultData() {
  appData = {
    groups: [
      {
        id: "default",
        name: "默认组合",
        items: [
          { id: "1", title: "火锅", description: "麻辣鲜香，温暖身心" },
          { id: "2", title: "烤肉", description: "滋滋作响，香气四溢" },
          { id: "3", title: "寿司", description: "新鲜美味，精致可口" },
          { id: "4", title: "披萨", description: "芝士拉丝，意式风情" },
          { id: "5", title: "炸鸡", description: "外酥内嫩，香脆可口" },
          { id: "6", title: "面条", description: "劲道爽滑，汤鲜味美" },
          { id: "7", title: "汉堡", description: "多汁肉饼，搭配芝士" },
          { id: "8", title: "沙拉", description: "清爽健康，营养均衡" },
        ],
      },
    ],
    currentGroup: "default",
    lastDrawTime: null,
    drawHistory: [],
    // 动画配置
    animationConfig: {
      flipDuration: 800, // 翻页动画持续时间（毫秒）
      pauseDuration: 500, // 每个卡片展示后的停顿时间（毫秒）
      totalDuration: 15000, // 抽奖总持续时间（毫秒）- 默认15秒
      longPressDelay: 500, // 长按延迟时间（毫秒）
      maxLongPressBonus: 5000, // 最大长按延长时间（毫秒）- 5秒
    },
  };

  // 更新UI
  updateUI();
}

// 保存数据到本地存储
function saveData() {
  localStorage.setItem("eatAppData", JSON.stringify(appData));
}

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

// 长按开始
function startLongPress() {
  console.log("长按开始，isDrawing 状态：", isDrawing);

  // 强制重置状态（防止状态卡住）
  if (isDrawing && !drawInterval) {
    console.log("检测到状态异常，强制重置");
    isDrawing = false;
  }

  if (isDrawing) {
    console.log("动画正在进行中，跳过长按开始");
    return;
  }

  isLongPressing = true;
  longPressStartTime = Date.now();
  longPressDuration = 0;

  console.log("长按开始时间：", longPressStartTime);

  // 显示进度指示器
  const progressIndicator = document.getElementById("progressIndicator");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  progressIndicator.style.display = "flex";
  progressText.textContent = "准备中...";
  progressFill.style.width = "0%";

  // 开始长按计时
  longPressTimer = setTimeout(() => {
    console.log("长按计时器触发，isLongPressing 状态：", isLongPressing);
    if (isLongPressing) {
      console.log("开始执行 startDraw");
      // 计算长按持续时间
      longPressDuration = Date.now() - longPressStartTime;
      console.log("长按持续时间：", longPressDuration, "ms");
      // 生成复合随机种子
      randomSeed = generateCompositeSeed();
      startDraw();
    } else {
      console.log("长按已结束，不执行 startDraw");
    }
  }, appData.animationConfig.longPressDelay); // 使用配置的长按延迟时间

  // 更新进度条
  updateProgressBar();
}

// 更新进度条
function updateProgressBar() {
  if (!isLongPressing) return;

  const elapsed = Date.now() - longPressStartTime;
  const maxDuration =
    appData.animationConfig.longPressDelay +
    appData.animationConfig.maxLongPressBonus;
  const progress = Math.min((elapsed / maxDuration) * 100, 100);

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  progressFill.style.width = progress + "%";

  // 更新提示文本
  if (elapsed < appData.animationConfig.longPressDelay) {
    progressText.textContent = "准备中...";
  } else {
    const bonusTime = Math.min(
      elapsed - appData.animationConfig.longPressDelay,
      appData.animationConfig.maxLongPressBonus
    );
    const bonusSeconds = (bonusTime / 1000).toFixed(1);
    progressText.textContent = `延长 ${bonusSeconds}s`;
  }

  if (progress < 100) {
    requestAnimationFrame(updateProgressBar);
  }
}

// 长按结束
function endLongPress() {
  if (!isLongPressing) return;

  console.log("长按结束");

  isLongPressing = false;
  clearTimeout(longPressTimer);
  longPressTimer = null;

  // 隐藏进度指示器
  const progressIndicator = document.getElementById("progressIndicator");
  progressIndicator.style.display = "none";

  // 如果已经开始抽取，停止
  if (isDrawing) {
    endDraw();
  } else {
    console.log("没有正在进行的动画，状态已重置");
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

  startBtn.disabled = true;
  progressIndicator.style.display = "flex";
  progressText.textContent = "抽取中...";

  // 计算实际抽奖时间
  const baseDuration = appData.animationConfig.totalDuration; // 基础15秒

  // 为延长时间创建独立的随机种子，确保延长时间真正随机
  const timeRandomSeed =
    (randomSeed || 0) + Date.now() + Math.random() * 1000000;
  const timeSeededRandom = seedRandom(timeRandomSeed);

  const bonusTime = Math.floor(
    timeSeededRandom() * appData.animationConfig.maxLongPressBonus
  ); // 0-5秒随机延长
  const actualDuration = baseDuration + bonusTime;

  console.log(
    "实际抽奖时间：",
    actualDuration,
    "ms (基础:",
    baseDuration,
    "ms + 随机延长:",
    bonusTime,
    "ms)"
  );

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

  const items = currentGroup.items;

  // 使用随机种子来影响初始索引、转动速度和最终结果
  const seededRandom = seedRandom(randomSeed);

  // 计算随机初始索引
  let currentIndex = Math.floor(seededRandom() * items.length);
  let nextIndex = (currentIndex + 1) % items.length;

  // 计算随机转动速度（基于随机种子）
  const baseSpeed = appData.animationConfig.flipDuration; // 基础翻页速度
  const speedVariation = seededRandom() * 0.4 + 0.8; // 0.8-1.2 倍速变化
  const randomSpeed = Math.floor(baseSpeed * speedVariation);

  // 计算随机停顿时间
  const basePause = appData.animationConfig.pauseDuration;
  const pauseVariation = seededRandom() * 0.3 + 0.85; // 0.85-1.15 倍停顿变化
  const randomPause = Math.floor(basePause * pauseVariation);

  let drawStartTime = Date.now();
  let isAnimating = false;

  // 创建翻书动画容器
  cardContainer.innerHTML = "";

  // 创建两个卡片用于翻书效果
  let card1 = createCard(items[currentIndex]); // 当前显示的卡片
  let card2 = createCard(items[nextIndex]); // 下一个要显示的卡片

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
  console.log("初始索引：", currentIndex, "项目：", items[currentIndex].title);
  console.log("随机转动速度：", randomSpeed, "ms (基础：", baseSpeed, "ms)");
  console.log("随机停顿时间：", randomPause, "ms (基础：", basePause, "ms)");
  console.log("动画持续时间：", duration, "ms");

  function performNextAnimation() {
    // 检查是否超过总持续时间
    const elapsed = Date.now() - drawStartTime;
    console.log("动画检查：已过时间", elapsed, "ms，总时间", duration, "ms");

    if (elapsed >= duration) {
      // 动画结束，使用当前显示的卡片作为最终结果
      console.log("动画结束，当前显示的最终结果：", currentDisplayedItem.title);

      // 隐藏 card-container，显示最终结果
      cardContainer.style.display = "none";
      showLastCard(currentDisplayedItem);
      endDraw(currentDisplayedItem); // 传递最终结果给 endDraw
      return;
    }

    // 如果正在动画中，跳过这次更新
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    const currentItem = items[currentIndex];
    const nextItem = items[nextIndex];

    console.log(
      `准备翻页：当前显示 ${currentItem.title}，切换到 ${nextItem.title}`
    );

    // 执行翻书动画：从当前卡片切换到下一个卡片
    performBookFlip(card1, card2, nextItem, randomSpeed, () => {
      // 动画完成后的回调
      isAnimating = false;

      // 更新当前显示的索引
      currentIndex = nextIndex;
      currentDisplayedItem = items[currentIndex];

      // 计算下一个要显示的索引（支持循环）
      nextIndex = (nextIndex + 1) % items.length;

      // 交换卡片引用
      const temp = card1;
      card1 = card2;
      card2 = temp;

      console.log(
        `翻页完成：现在显示 ${items[currentIndex].title}，停顿 ${randomPause}ms 后继续`
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
  if (title.length <= 3) {
    titleElement.style.fontSize = "1.2em";
  } else {
    titleElement.style.fontSize = "0.6em";
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
    `[LOG] 动画开始：从 ${currentCard.querySelector("h3").textContent} 翻转到 ${
      nextItem.title
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

  startBtn.disabled = false;
  progressIndicator.style.display = "none";

  // 优先使用传入的最终结果，否则使用当前显示的卡片
  const resultItem = finalItem || currentDisplayedItem;

  if (resultItem) {
    console.log("动画结束，最终显示：", resultItem.title);

    // 显示最终结果
    showResult(resultItem);

    // 记录抽取历史
    const currentGroup = appData.groups.find(
      (g) => g.id === appData.currentGroup
    );
    if (currentGroup) {
      const historyEntry = {
        id: Date.now(),
        title: resultItem.title,
        description: resultItem.description,
        group: currentGroup.name,
        time: new Date().toLocaleString(),
        randomSeed: randomSeed, // 记录随机种子
      };
      appData.drawHistory.unshift(historyEntry);

      // 限制历史记录数量
      if (appData.drawHistory.length > 50) {
        appData.drawHistory = appData.drawHistory.slice(0, 50);
      }

      saveData();
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
  appData.currentGroup = groupId;
  saveData();
  updateUI();
  hideGroupSelector();
  showFirstCard(); // 显示新组合的第一个食品
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
  window.open("manage.html", "_blank");
}

// 导出数据
function exportData() {
  const dataStr = JSON.stringify(appData, null, 2);
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

// 导入数据
function importData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      appData = { ...appData, ...importedData };
      saveData();
      updateUI();
      showFirstCard();
      alert("数据导入成功！");
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
    localStorage.removeItem("eatAppData");
    loadDefaultData();
    updateUI();
    showFirstCard();
    alert("数据已重置！");
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
    startLongPress();
  }

  if (e.code === "Escape") {
    hideGroupSelector();
    endLongPress();
  }
});

// 防止页面刷新时丢失数据
window.addEventListener("beforeunload", function () {
  saveData();
});

// 移动端特殊处理
if ("ontouchstart" in window) {
  // 移动端优化
  document.addEventListener("touchstart", function () {}, { passive: true });

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
