// 烟花效果管理器
class FireworksManager {
  constructor() {
    this.container = null;
    this.isActive = false;
    this.particles = [];
    this.colors = [
      '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
      '#ff8800', '#8800ff', '#00ff88', '#ff0088', '#88ff00', '#0088ff',
      '#ffd700', '#ff69b4', '#00ced1', '#ff6347', '#32cd32', '#ff1493'
    ];
  }

  // 初始化烟花容器
  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('烟花容器未找到:', containerId);
      return false;
    }
    return true;
  }

  // 开始烟花效果
  start() {
    if (!this.container) return;
    
    this.isActive = true;
    this.clearParticles();
    
    // 创建多个烟花爆炸
    this.createMultipleFireworks();
    
    // 持续创建新的烟花
    this.interval = setInterval(() => {
      if (this.isActive) {
        this.createFirework();
      }
    }, 800);
  }

  // 停止烟花效果
  stop() {
    this.isActive = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    // 清理所有粒子
    setTimeout(() => {
      this.clearParticles();
    }, 2000);
  }

  // 创建多个烟花爆炸
  createMultipleFireworks() {
    // 立即创建3-5个烟花
    const count = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createFirework();
      }, i * 200);
    }
  }

  // 创建单个烟花
  createFirework() {
    if (!this.isActive || !this.container) return;

    const containerRect = this.container.getBoundingClientRect();
    
    // 随机位置
    const x = Math.random() * containerRect.width;
    const y = Math.random() * containerRect.height * 0.7; // 在上70%区域
    
    // 随机颜色
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // 创建烟花爆炸
    this.createExplosion(x, y, color);
  }

  // 创建爆炸效果
  createExplosion(x, y, color) {
    const particleCount = Math.floor(Math.random() * 20) + 30; // 30-50个粒子
    
    for (let i = 0; i < particleCount; i++) {
      // 创建主粒子
      this.createParticle(x, y, color);
      
      // 创建轨迹粒子（较少的数量）
      if (i % 3 === 0) {
        this.createTrailParticle(x, y, color);
      }
    }
  }

  // 创建轨迹粒子
  createTrailParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle trail-particle';
    
    // 随机角度和距离（轨迹粒子距离较短）
    const angle = (Math.PI * 2 * Math.random());
    const distance = Math.random() * 80 + 20; // 20-100px
    
    // 计算粒子移动方向
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;
    
    // 设置粒子样式
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = color;
    particle.style.setProperty('--delta-x', `${deltaX}px`);
    particle.style.setProperty('--delta-y', `${deltaY}px`);
    
    // 轨迹粒子较小
    const size = Math.random() * 2 + 1; // 1-3px
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 较淡的发光效果
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.opacity = '0.6';
    
    // 设置动画延迟
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    
    // 添加到容器
    this.container.appendChild(particle);
    
    // 动画结束后移除粒子
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
    
    this.particles.push(particle);
  }

  // 创建单个粒子
  createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    
    // 随机角度和距离
    const angle = (Math.PI * 2 * Math.random());
    const distance = Math.random() * 150 + 50; // 50-200px
    
    // 计算粒子移动方向
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;
    
    // 设置粒子样式
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = color;
    particle.style.setProperty('--travel-distance', `-${distance}px`);
    particle.style.setProperty('--delta-x', `${deltaX}px`);
    particle.style.setProperty('--delta-y', `${deltaY}px`);
    
    // 随机大小
    const size = Math.random() * 4 + 2; // 2-6px
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 添加发光效果
    particle.style.boxShadow = `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`;
    
    // 设置动画延迟
    particle.style.animationDelay = Math.random() * 0.3 + 's';
    
    // 添加到容器
    this.container.appendChild(particle);
    
    // 动画结束后移除粒子
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2500);
    
    this.particles.push(particle);
  }

  // 清理所有粒子
  clearParticles() {
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }

  // 创建特殊效果的烟花（用于结果展示）
  createSpecialFireworks() {
    if (!this.container) return;
    
    const containerRect = this.container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    // 创建心形烟花
    this.createHeartFirework(centerX, centerY);
    
    // 创建圆形烟花
    setTimeout(() => {
      this.createCircleFirework(centerX, centerY);
    }, 500);
    
    // 创建螺旋烟花
    setTimeout(() => {
      this.createSpiralFirework(centerX, centerY);
    }, 1000);
  }

  // 创建心形烟花
  createHeartFirework(x, y) {
    const heartPoints = this.generateHeartPoints(20);
    const color = '#ff69b4';
    
    heartPoints.forEach((point, index) => {
      setTimeout(() => {
        this.createParticle(
          x + point.x * 2,
          y + point.y * 2,
          color
        );
      }, index * 50);
    });
  }

  // 生成心形点
  generateHeartPoints(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 * Math.PI;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      points.push({ x, y });
    }
    return points;
  }

  // 创建圆形烟花
  createCircleFirework(x, y) {
    const particleCount = 36;
    const color = '#ffd700';
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI;
      const px = x + Math.cos(angle) * 100;
      const py = y + Math.sin(angle) * 100;
      
      setTimeout(() => {
        this.createParticle(px, py, color);
      }, i * 30);
    }
  }

  // 创建螺旋烟花
  createSpiralFirework(x, y) {
    const particleCount = 50;
    const color = '#00ffff';
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 8 * Math.PI; // 4圈螺旋
      const radius = (i / particleCount) * 150;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      setTimeout(() => {
        this.createParticle(px, py, color);
      }, i * 40);
    }
  }
}

// 全局烟花管理器实例
let fireworksManager = null;

// 初始化烟花管理器
function initFireworks() {
  fireworksManager = new FireworksManager();
  return fireworksManager.init('fireworksContainer');
}

// 显示抽奖结果浮层
function showResultOverlay(item) {
  const overlay = document.getElementById('resultOverlay');
  const title = document.getElementById('overlayResultTitle');
  const description = document.getElementById('overlayResultDescription');
  
  if (!overlay || !title || !description) {
    console.error('浮层元素未找到');
    return;
  }
  
  // 设置结果内容
  title.textContent = item.title;
  description.textContent = item.description;
  
  // 根据标题长度调整字体大小
  if (item.title.length <= 3) {
    title.style.fontSize = '2.2em';
  } else {
    title.style.fontSize = '1.8em';
  }
  
  // 显示浮层
  overlay.style.display = 'flex';
  
  // 初始化并启动烟花效果
  if (!fireworksManager) {
    initFireworks();
  }
  
  if (fireworksManager) {
    // 先创建特殊效果烟花
    fireworksManager.createSpecialFireworks();
    
    // 然后启动持续烟花
    setTimeout(() => {
      fireworksManager.start();
    }, 1500);
  }
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleOverlayKeydown);
  
  // 添加点击背景关闭功能
  overlay.addEventListener('click', handleOverlayBackgroundClick);
}

// 关闭抽奖结果浮层
function closeResultOverlay() {
  const overlay = document.getElementById('resultOverlay');
  
  if (!overlay) return;
  
  // 停止烟花效果
  if (fireworksManager) {
    fireworksManager.stop();
  }
  
  // 隐藏浮层
  overlay.style.display = 'none';
  
  // 移除事件监听
  document.removeEventListener('keydown', handleOverlayKeydown);
  overlay.removeEventListener('click', handleOverlayBackgroundClick);
}

// 处理浮层键盘事件
function handleOverlayKeydown(e) {
  if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    closeResultOverlay();
  }
}

// 处理浮层背景点击事件
function handleOverlayBackgroundClick(e) {
  // 只有点击背景才关闭，点击内容区域不关闭
  if (e.target.classList.contains('overlay-background') || 
      e.target.classList.contains('fireworks-container')) {
    closeResultOverlay();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化烟花管理器
  initFireworks();
}); 