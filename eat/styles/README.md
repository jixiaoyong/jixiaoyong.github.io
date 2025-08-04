# 样式文件结构说明

## 概述

本项目采用了模块化的CSS架构，将微信风格的样式系统与美食主题相结合，提供了统一的视觉体验。

## 文件结构

```
styles/
├── README.md                 # 本文档
├── wechat-variables.css      # 全局CSS变量和主题配置
├── wechat-layout.css         # 布局和容器样式
└── wechat-buttons.css        # 按钮组件样式
```

## 文件说明

### 1. wechat-variables.css
**作用**: 定义全局CSS变量和主题配置
**包含内容**:
- 颜色变量（主色调、辅助色、背景色、文字颜色等）
- 间距变量
- 圆角变量
- 阴影变量
- 字体配置
- 过渡动画配置
- 美食主题特殊颜色
- 响应式断点

**主要变量**:
```css
--wechat-primary: #ff6b35;        /* 美食橙色主色调 */
--food-gradient-button: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
--wechat-spacing-md: 12px;        /* 中等间距 */
--wechat-radius-large: 16px;      /* 大圆角 */
```

### 2. wechat-layout.css
**作用**: 定义页面布局和容器样式
**包含内容**:
- 基础样式重置
- 容器布局（首页和管理页面）
- 卡片显示区域
- 控制面板
- 模态框样式
- 表单样式
- 响应式设计

**主要类**:
```css
.container          /* 主容器 */
.box-container      /* 盒子容器 */
.control-panel      /* 控制面板 */
.modal              /* 模态框 */
.form-group         /* 表单组 */
```

### 3. wechat-buttons.css
**作用**: 定义所有按钮组件样式
**包含内容**:
- 基础按钮样式
- 按钮变体（primary、secondary、success等）
- 按钮尺寸（sm、md、lg、xl）
- 特殊按钮（开始按钮、管理按钮等）
- 按钮状态（hover、active、disabled）

**主要类**:
```css
.btn                /* 基础按钮 */
.btn-primary        /* 主要按钮 */
.start-btn          /* 开始抽取按钮 */
.manage-btn         /* 管理按钮 */
.action-btn         /* 操作按钮 */
```

## 美食主题特色

### 颜色方案
- **主色调**: 温暖的橙色 (#ff6b35)
- **辅助色**: 清新的蓝色 (#4a90e2)
- **强调色**: 绿色 (#4caf50)
- **背景色**: 温暖的浅色系

### 渐变效果
- 按钮使用橙色渐变
- 背景使用温暖的渐变
- 进度条使用主题渐变

### 视觉元素
- 圆角设计更加柔和
- 阴影效果带有主题色彩
- 边框使用温暖色调

## 使用方法

### 在HTML中引入
```html
<link rel="stylesheet" href="styles/wechat-variables.css" />
<link rel="stylesheet" href="styles/wechat-layout.css" />
<link rel="stylesheet" href="styles/wechat-buttons.css" />
```

### 使用CSS变量
```css
.my-component {
  background: var(--wechat-primary);
  padding: var(--wechat-spacing-lg);
  border-radius: var(--wechat-radius-medium);
  box-shadow: var(--wechat-shadow-light);
}
```

### 使用按钮类
```html
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary btn-lg">大号次要按钮</button>
<button class="start-btn">开始抽取</button>
```

## 响应式设计

样式系统支持以下断点：
- **xs**: 480px 及以下
- **sm**: 576px 及以下
- **md**: 768px 及以下
- **lg**: 992px 及以下
- **xl**: 1200px 及以下
- **xxl**: 1400px 及以上

## 无障碍支持

- 支持 `prefers-reduced-motion` 媒体查询
- 提供合适的颜色对比度
- 支持键盘导航
- 语义化的HTML结构

## 维护说明

1. **修改主题颜色**: 在 `wechat-variables.css` 中修改相应的CSS变量
2. **添加新组件**: 在对应的文件中添加样式，或创建新的组件文件
3. **修改布局**: 在 `wechat-layout.css` 中进行调整
4. **添加新按钮**: 在 `wechat-buttons.css` 中定义新的按钮样式

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. CSS变量的顺序很重要，确保 `wechat-variables.css` 最先加载
2. 避免直接使用硬编码的颜色值，优先使用CSS变量
3. 新增样式时注意保持与现有设计的一致性
4. 测试时注意检查不同屏幕尺寸下的显示效果 