---
title: CSS 动画与过渡详解
description: 全面介绍 CSS 动画和过渡效果，包括 animation 属性、keyframes 关键帧、transition 过渡、事件监听等核心概念和实用技巧
outline: deep
---

# 🎬 CSS 动画与过渡详解

CSS 动画和过渡是现代网页交互设计的重要组成部分，它们能够为用户界面添加生动的效果，提升用户体验。本文将详细介绍 CSS 动画和过渡的核心概念、属性配置和实际应用。

## 📋 动画技术概览

| 技术类型 | 主要用途 | 触发方式 | 控制粒度 | 性能表现 |
|----------|----------|----------|----------|----------|
| **CSS Animation** | 复杂动画序列 | 自动触发 | 精细控制 | ✅ 高性能 |
| **CSS Transition** | 属性变化过渡 | 状态改变触发 | 简单控制 | ✅ 高性能 |
| **JavaScript 动画** | 复杂交互动画 | 程序控制 | 完全控制 | ⚠️ 中等性能 |

::: info 💡 选择指南
- **简单状态变化**: 使用 `transition`
- **复杂动画序列**: 使用 `animation` + `@keyframes`
- **需要精确控制**: 结合 JavaScript 事件监听
:::

---

## 🎯 CSS Animation 动画

CSS 动画由两个核心部分组成：
1. **动画配置**: 使用 `animation` 属性及其子属性
2. **关键帧定义**: 使用 `@keyframes` 规则描述动画序列

### 🔧 Animation 属性详解

#### 核心属性表格

| 属性 | 说明 | 可选值 | 默认值 |
|------|------|--------|--------|
| `animation-name` | 关键帧名称 | `@keyframes` 定义的名称 | `none` |
| `animation-duration` | 动画时长 | 时间值（s/ms） | `0s` |
| `animation-timing-function` | 运动曲线 | 见下表 | `ease` |
| `animation-delay` | 延迟时间 | 时间值（s/ms） | `0s` |
| `animation-iteration-count` | 重复次数 | 数字 / `infinite` | `1` |
| `animation-direction` | 运动方向 | 见下表 | `normal` |
| `animation-fill-mode` | 填充模式 | 见下表 | `none` |
| `animation-play-state` | 播放状态 | `running` / `paused` | `running` |

#### 🎨 运动曲线 (timing-function)

| 函数 | 描述 | 贝塞尔曲线等价值 | 视觉效果 |
|------|------|------------------|----------|
| `ease` | 默认，中间加速 | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | 🔄 自然过渡 |
| `linear` | 匀速运动 | `cubic-bezier(0.0, 0.0, 1.0, 1.0)` | ➡️ 恒定速度 |
| `ease-in` | 开始慢，逐渐加速 | `cubic-bezier(0.42, 0, 1.0, 1.0)` | 🚀 加速启动 |
| `ease-out` | 开始快，逐渐减速 | `cubic-bezier(0, 0, 0.58, 1.0)` | 🛑 减速停止 |
| `ease-in-out` | 慢-快-慢 | `cubic-bezier(0.42, 0, 0.58, 1.0)` | 🌊 波浪式 |

**步进函数 (Steps)**:
```css
/* 基础语法 */
steps(n, <jumpterm>)

/* 示例 */
animation-timing-function: steps(5, jump-end);    /* 5步，最后跳跃 */
animation-timing-function: step-start;            /* 立即跳到结束状态 */
animation-timing-function: step-end;              /* 在结束时跳跃 */
```

**跳跃项说明**:
- `jump-start` / `start`: 动画开始时跳跃
- `jump-end` / `end`: 动画结束时跳跃  
- `jump-none`: 两端都不跳跃
- `jump-both`: 两端都跳跃

#### 🔄 动画方向 (direction)

| 值 | 描述 | 动画序列 |
|----|------|----------|
| `normal` | 正向播放（默认） | 0% → 100% |
| `reverse` | 反向播放 | 100% → 0% |
| `alternate` | 正反交替 | 0% → 100% → 0% → 100% |
| `alternate-reverse` | 反正交替 | 100% → 0% → 100% → 0% |

#### 🎭 填充模式 (fill-mode)

| 值 | 描述 | 动画前 | 动画后 |
|----|------|--------|--------|
| `none` | 默认，不应用样式 | 原始样式 | 原始样式 |
| `forwards` | 保持最后关键帧 | 原始样式 | 最后关键帧 |
| `backwards` | 应用第一关键帧 | 第一关键帧 | 原始样式 |
| `both` | 两端都应用 | 第一关键帧 | 最后关键帧 |

### 📝 Animation 简写语法

```css
/* 完整语法 */
animation: <duration> <timing-function> <delay> <iteration-count> 
           <direction> <fill-mode> <play-state> <name>;

/* 实际示例 */
.element {
  /* 基础动画 */
  animation: 3s ease-in 1s 2 reverse both paused slidein;
  
  /* 多个动画 */
  animation: 3s linear slidein, 2s ease-out 1s slideout;
  
  /* 最简形式 */
  animation: 1s slide;
}
```

::: warning ⚠️ 注意事项
- `animation-name` 必须放在最后
- 时间值的顺序：第一个是 `duration`，第二个是 `delay`
- 多个动画用逗号分隔
:::

---

## 🎨 @keyframes 关键帧

关键帧定义了动画在不同时间点的样式状态。

### 📊 基础语法

```css
@keyframes <animation-name> {
  <keyframe-selector> {
    <property>: <value>;
  }
}
```

### 🎯 关键帧选择器

| 选择器类型 | 语法 | 说明 | 示例 |
|------------|------|------|------|
| **百分比** | `0%` - `100%` | 精确控制时间点 | `0%`, `25%`, `50%`, `100%` |
| **关键词** | `from` / `to` | 开始和结束 | `from` = `0%`, `to` = `100%` |
| **多选择器** | 逗号分隔 | 多个时间点相同样式 | `0%, 100%` |

### 🌟 实际应用示例

#### 1️⃣ 基础滑入动画

```css
.slide-in {
  animation: slidein 3s ease-in-out;
}

@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
    opacity: 0;
  }
  
  50% {
    margin-left: 50%;
    width: 200%;
    opacity: 0.5;
  }
  
  to {
    margin-left: 0%;
    width: 100%;
    opacity: 1;
  }
}
```

#### 2️⃣ 复杂旋转缩放动画

```css
.spin-scale {
  animation: spinScale 2s infinite alternate;
}

@keyframes spinScale {
  0% {
    transform: rotate(0deg) scale(1);
    background-color: #ff6b6b;
  }
  
  25% {
    transform: rotate(90deg) scale(1.2);
    background-color: #4ecdc4;
  }
  
  50% {
    transform: rotate(180deg) scale(0.8);
    background-color: #45b7d1;
  }
  
  75% {
    transform: rotate(270deg) scale(1.1);
    background-color: #f9ca24;
  }
  
  100% {
    transform: rotate(360deg) scale(1);
    background-color: #6c5ce7;
  }
}
```

#### 3️⃣ 步进动画（逐帧动画）

```css
.sprite-animation {
  width: 100px;
  height: 100px;
  background: url('sprite.png') no-repeat;
  animation: sprite 1s steps(8) infinite;
}

@keyframes sprite {
  from { background-position: 0 0; }
  to { background-position: -800px 0; }
}
```

---

## 🎧 动画事件监听

JavaScript 可以监听动画的生命周期事件，实现更复杂的交互控制。

### 📋 事件类型表格

| 事件名称 | 触发时机 | 触发次数 | 常用场景 |
|----------|----------|----------|----------|
| `animationstart` | 动画开始时 | 1次 | 初始化操作 |
| `animationiteration` | 每次循环开始时 | 多次 | 循环计数 |
| `animationend` | 动画完全结束时 | 1次 | 清理操作 |
| `animationcancel` | 动画被取消时 | 1次 | 异常处理 |

### 🔧 事件监听实现

```javascript
// 获取动画元素
const animatedElement = document.getElementById('animated-box');

// 添加事件监听器
animatedElement.addEventListener('animationstart', handleAnimationStart);
animatedElement.addEventListener('animationiteration', handleAnimationIteration);
animatedElement.addEventListener('animationend', handleAnimationEnd);
animatedElement.addEventListener('animationcancel', handleAnimationCancel);

// 事件处理函数
function handleAnimationStart(event) {
  console.log(`动画 "${event.animationName}" 开始执行`);
  console.log(`延迟时间: ${event.elapsedTime}s`);
}

function handleAnimationIteration(event) {
  console.log(`动画 "${event.animationName}" 开始新的循环`);
  console.log(`已执行时间: ${event.elapsedTime}s`);
}

function handleAnimationEnd(event) {
  console.log(`动画 "${event.animationName}" 执行完成`);
  console.log(`总执行时间: ${event.elapsedTime}s`);
  
  // 动画结束后的操作
  event.target.classList.remove('animated');
}

function handleAnimationCancel(event) {
  console.log(`动画 "${event.animationName}" 被取消`);
}

// 启动动画
animatedElement.classList.add('slide-in');
```

### 🎯 事件对象属性

```javascript
function handleAnimation(event) {
  // 动画名称
  console.log('Animation Name:', event.animationName);
  
  // 事件类型
  console.log('Event Type:', event.type);
  
  // 动画已执行时间（不包含暂停时间）
  console.log('Elapsed Time:', event.elapsedTime);
  
  // 伪元素选择器（如果动画应用在伪元素上）
  console.log('Pseudo Element:', event.pseudoElement || 'none');
  
  // 目标元素
  console.log('Target Element:', event.target);
}
```

---

## 🔄 CSS Transition 过渡

过渡用于在 CSS 属性值发生变化时创建平滑的动画效果，相比 `animation` 更加轻量和简单。

### 🔧 Transition 属性详解

| 属性 | 说明 | 可选值 | 默认值 |
|------|------|--------|--------|
| `transition-property` | 过渡属性 | CSS属性名 / `all` / `none` | `all` |
| `transition-duration` | 过渡时长 | 时间值（s/ms） | `0s` |
| `transition-timing-function` | 运动曲线 | 同 animation | `ease` |
| `transition-delay` | 延迟时间 | 时间值（s/ms） | `0s` |

### 📝 Transition 语法

```css
/* 简写语法 */
transition: <property> <duration> <timing-function> <delay>;

/* 实际示例 */
.button {
  /* 单个属性过渡 */
  transition: background-color 0.3s ease;
  
  /* 多个属性过渡 */
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease-out,
    box-shadow 0.3s ease-in-out;
  
  /* 所有属性过渡 */
  transition: all 0.5s ease-out;
}
```

### 🎨 实际应用示例

#### 1️⃣ 按钮悬停效果

```css
.modern-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  /* 过渡配置 */
  transition: 
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.3s ease;
}

.modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.modern-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
```

#### 2️⃣ 卡片展开效果

```css
.expandable-card {
  width: 300px;
  height: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  
  /* 过渡配置 */
  transition: 
    height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease;
}

.expandable-card:hover {
  height: 400px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: 
    opacity 0.3s ease 0.2s,
    transform 0.3s ease 0.2s;
}

.expandable-card:hover .card-content {
  opacity: 1;
  transform: translateY(0);
}
```

#### 3️⃣ 导航菜单动画

```css
.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  margin: 0 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## 🎧 过渡事件监听

### 📋 事件类型

| 事件名称 | 触发时机 | 说明 |
|----------|----------|------|
| `transitionrun` | 过渡创建时（延迟前） | 包含延迟时间 |
| `transitionstart` | 过渡开始时（延迟后） | 实际动画开始 |
| `transitionend` | 过渡结束时 | 动画完成 |
| `transitioncancel` | 过渡被取消时 | 异常中断 |

### 🔧 事件监听实现

```javascript
const transitionElement = document.querySelector('.transition-element');

// 添加事件监听
transitionElement.addEventListener('transitionrun', handleTransitionRun);
transitionElement.addEventListener('transitionstart', handleTransitionStart);
transitionElement.addEventListener('transitionend', handleTransitionEnd);
transitionElement.addEventListener('transitioncancel', handleTransitionCancel);

function handleTransitionRun(event) {
  console.log(`过渡 "${event.propertyName}" 已创建`);
  console.log(`延迟时间: ${event.elapsedTime}s`);
}

function handleTransitionStart(event) {
  console.log(`过渡 "${event.propertyName}" 开始执行`);
}

function handleTransitionEnd(event) {
  console.log(`过渡 "${event.propertyName}" 执行完成`);
  console.log(`执行时间: ${event.elapsedTime}s`);
  
  // 过渡结束后的操作
  if (event.propertyName === 'transform') {
    event.target.classList.add('transition-complete');
  }
}

function handleTransitionCancel(event) {
  console.log(`过渡 "${event.propertyName}" 被取消`);
}
```

---

## 🎯 高级技巧与最佳实践

### 🚀 性能优化

#### 1️⃣ 优先使用 transform 和 opacity

```css
/* ✅ 推荐：高性能属性 */
.optimized-animation {
  transition: 
    transform 0.3s ease,
    opacity 0.3s ease;
}

.optimized-animation:hover {
  transform: translateX(10px) scale(1.05);
  opacity: 0.8;
}

/* ❌ 避免：会触发重排重绘的属性 */
.non-optimized-animation {
  transition: 
    left 0.3s ease,
    width 0.3s ease,
    height 0.3s ease;
}
```

#### 2️⃣ 使用 will-change 提示浏览器

```css
.will-animate {
  will-change: transform, opacity;
}

.will-animate:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* 动画结束后移除 will-change */
.animation-complete {
  will-change: auto;
}
```

### 🎨 创意动画模式

#### 1️⃣ 弹性动画

```css
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.bounce-element {
  animation: bounce 1s ease-in-out;
}
```

#### 2️⃣ 打字机效果

```css
.typewriter {
  font-family: 'Courier New', monospace;
  border-right: 2px solid #333;
  white-space: nowrap;
  overflow: hidden;
  animation: 
    typing 3s steps(40, end),
    blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #333; }
}
```

#### 3️⃣ 粒子动画

```css
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #667eea;
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.particle:nth-child(1) { animation-delay: 0s; }
.particle:nth-child(2) { animation-delay: 0.5s; }
.particle:nth-child(3) { animation-delay: 1s; }

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0.5;
  }
}
```

### 📱 响应式动画

```css
/* 基础动画 */
.responsive-animation {
  transition: transform 0.3s ease;
}

/* 桌面端增强动画 */
@media (min-width: 768px) {
  .responsive-animation {
    transition: 
      transform 0.3s ease,
      box-shadow 0.3s ease,
      filter 0.3s ease;
  }
  
  .responsive-animation:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    filter: brightness(1.05);
  }
}

/* 移动端简化动画 */
@media (max-width: 767px) {
  .responsive-animation:active {
    transform: scale(0.98);
  }
}

/* 尊重用户的动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .responsive-animation {
    transition: none;
    animation: none;
  }
}
```

---

## 📚 总结与学习建议

### 🎯 技术选择指南

| 场景 | 推荐技术 | 原因 |
|------|----------|------|
| **简单状态变化** | `transition` | 轻量、易用、性能好 |
| **复杂动画序列** | `animation` + `@keyframes` | 精确控制、功能强大 |
| **交互式动画** | CSS + JavaScript 事件 | 灵活性高、可控性强 |
| **微交互效果** | `transition` | 用户体验自然 |
| **加载动画** | `animation` | 循环播放、视觉反馈 |

### 🚀 最佳实践总结

::: tip 🔧 性能优化
1. **优先使用 `transform` 和 `opacity`** - 避免触发重排重绘
2. **合理使用 `will-change`** - 提前告知浏览器优化策略
3. **避免同时动画过多元素** - 控制动画数量
4. **使用 CSS 而非 JavaScript** - 利用浏览器硬件加速
:::

::: warning ⚠️ 用户体验
1. **尊重用户偏好** - 支持 `prefers-reduced-motion`
2. **保持动画时长适中** - 通常 200-500ms 为宜
3. **提供动画反馈** - 让用户知道操作已响应
4. **避免过度动画** - 不要让动画成为干扰
:::

::: info 🎓 学习路径
1. **掌握基础** - 理解 transition 和 animation 的区别
2. **练习关键帧** - 熟练使用 @keyframes 创建复杂动画
3. **学习事件监听** - 结合 JavaScript 实现交互控制
4. **研究性能优化** - 了解浏览器渲染机制
5. **关注设计趋势** - 学习现代动画设计模式
:::

### 📈 发展趋势

- ✅ **Web Animations API** - 更强大的 JavaScript 动画控制
- ✅ **CSS Houdini** - 自定义动画属性和函数
- ✅ **Motion Path** - 沿路径运动的动画
- ✅ **Scroll-driven Animations** - 滚动驱动的动画效果

CSS 动画和过渡是现代网页开发的重要技能，掌握这些技术能够显著提升用户界面的交互体验和视觉吸引力！
