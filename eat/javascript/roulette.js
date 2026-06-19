// =================================================================================================
// roulette.js - 3D 滚筒抽签控制器 (ESM Module)
// =============================================================================

let cylinderEl = null;
let currentRotationAngle = 0;
let renderedFaces = [];
let isSpinning = false;

// CSS 动画彩纸效果（无需外部依赖）
function triggerConfetti() {
  const stage = document.querySelector('.roulette-stage');
  if (!stage) return;

  // 移除旧彩纸
  stage.querySelectorAll('.confetti-particle').forEach(el => el.remove());

  // 创建彩纸
  const colors = ['#ff7a00', '#ff3b30', '#30d158', '#ffd60a', '#ff9f0a', '#64d2ff'];
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: ${Math.random() * 0.7 + 0.3};
      transform: rotate(${Math.random() * 360}deg);
      animation: confettiFall ${Math.random() * 1 + 1}s ease-out forwards;
      animation-delay: ${Math.random() * 0.3}s;
      z-index: 100;
    `;
    stage.appendChild(particle);

    // 动画结束后移除
    setTimeout(() => particle.remove(), 2500);
  }
}       

export function initRoulette() {
  cylinderEl = document.getElementById('rouletteCylinder');
  currentRotationAngle = 0;
  isSpinning = false;
  renderedFaces = [];
}

/**
 * 拼装圆柱体 DOM
 */
export function renderCylinder(items) {
  if (!cylinderEl) return;
  
  cylinderEl.innerHTML = '';
  isSpinning = false;
  
  if (!items || items.length === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'roulette-card';
    emptyCard.style.transform = 'rotateX(0deg) translateZ(120px)';
    emptyCard.textContent = '🍽️ 暂无菜品';
    cylinderEl.appendChild(emptyCard);
    renderedFaces = [];
    return;
  }

  // 补面容错：少于 6 个菜品时通过倍数复制填充，保证 3D 滚筒面数饱满
  let listToRender = [...items];
  const minFaces = 6;
  if (listToRender.length < minFaces) {
    const repeatCount = Math.ceil(minFaces / listToRender.length);
    listToRender = [];
    for (let r = 0; r < repeatCount; r++) {
      listToRender.push(...items);
    }
  }

  const faceCount = listToRender.length;
  const angleStep = 360 / faceCount;
  
  // 半径计算，50px 单卡片高
  const cardHeight = 48;
  const radius = Math.max(120, (faceCount * cardHeight) / (2 * Math.PI) + 12);

  // 记录映射
  renderedFaces = listToRender.map((food) => {
    return {
      name: food,
      originalIndex: items.indexOf(food)
    };
  });

  renderedFaces.forEach((face, index) => {
    const card = document.createElement('div');
    card.className = 'roulette-card';
    card.dataset.index = index;
    
    const rotateX = angleStep * index;
    card.style.transform = `rotateX(${rotateX}deg) translateZ(${radius}px)`;
    card.textContent = face.name;
    
    cylinderEl.appendChild(card);
  });

  cylinderEl.style.transition = 'none';
  cylinderEl.style.transform = 'rotateX(0deg)';
  currentRotationAngle = 0;
}

/**
 * 执行旋转
 */
export function spinToResult(targetIndex, originalPool, onComplete) {
  if (isSpinning || renderedFaces.length === 0) return;
  isSpinning = true;

  const foodName = originalPool[targetIndex];
  
  // 匹配所有中奖食物在面上的索引
  const candidateIndices = [];
  renderedFaces.forEach((face, index) => {
    if (face.name === foodName) {
      candidateIndices.push(index);
    }
  });

  // 随机取中段的面，提升翻滚感
  const chosenFaceIndex = candidateIndices[Math.floor(candidateIndices.length / 2)] || 0;
  
  const faceCount = renderedFaces.length;
  const angleStep = 360 / faceCount;

  // 防倒退重置：以 360 度模为基准重置，去掉以往的几千度累加
  const baseAngle = currentRotationAngle % 360;
  cylinderEl.style.transition = 'none';
  cylinderEl.style.transform = `rotateX(${baseAngle}deg)`;

  // Reflow
  void cylinderEl.offsetHeight;

  const extraSpins = 6;
  const targetAngle = (extraSpins * 360) + (chosenFaceIndex * angleStep);
  currentRotationAngle = targetAngle;

  cylinderEl.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.85, 0.35, 1)';
  cylinderEl.style.transform = `rotateX(-${targetAngle}deg)`;

  const onEnd = () => {
    cylinderEl.removeEventListener('transitionend', onEnd);

    // 中奖卡片高亮
    const cards = cylinderEl.querySelectorAll('.roulette-card');
    cards.forEach(card => {
      const idx = parseInt(card.dataset.index, 10);
      if (renderedFaces[idx]?.name === foodName) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    triggerConfetti();
    isSpinning = false;

    if (onComplete) {
      onComplete(foodName);
    }
  };

  cylinderEl.addEventListener('transitionend', onEnd);
}
