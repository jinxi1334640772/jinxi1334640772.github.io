---
title: 🎬 Animate.css 动画库完全指南
description: Animate.css 是一个使用 CSS3 animation 制作的动画效果集合，提供丰富的预设动画效果，使用简单且功能强大
outline: deep
---

# 🎬 Animate.css 动画库完全指南

> Animate.css 是一个使用 CSS3 的 animation 制作的动画效果的 CSS 集合，里面预设了很多种常用的动画，且使用非常简单。

::: info 🌟 核心特性
- **预设动画** - 包含丰富的预设动画效果
- **简单易用** - 只需添加 CSS 类即可使用
- **跨浏览器** - 支持现代浏览器的 CSS3 动画
- **轻量级** - 体积小，性能优秀
:::

## 🎯 动画分类概览

Animate.css 将动画效果分为多个类别，每个类别都有特定的视觉效果：

### 📋 动画类别总览

| 类别 | 描述 | 效果特点 | 适用场景 |
|------|------|----------|----------|
| **Attention** | 注意力动画 | 🔔 吸引注意力的晃动效果 | 提示、警告、强调 |
| **Bounce** | 弹性缓冲 | 🏀 弹跳进入/退出效果 | 页面元素进入/离开 |
| **Fade** | 透明度变化 | 👻 淡入淡出效果 | 内容切换、过渡 |
| **Flip** | 翻转效果 | 🔄 3D 翻转动画 | 卡片翻转、内容切换 |
| **Rotate** | 旋转效果 | 🌪️ 旋转进入/退出 | 加载动画、特效 |
| **Slide** | 滑动效果 | ↔️ 滑动进入/退出 | 侧边栏、抽屉菜单 |
| **Zoom** | 变焦效果 | 🔍 放大缩小动画 | 弹窗、图片查看 |
| **Special** | 特殊效果 | ✨ 独特的动画效果 | 特殊场景、创意效果 |

## 🔔 Attention 注意力动画

这类动画主要用于吸引用户注意力，通过晃动、闪烁等效果来突出元素。

### 📊 Attention 动画列表

| 动画名称 | 效果描述 | 视觉特点 | 使用场景 |
|----------|----------|----------|----------|
| **bounce** | 弹跳 | 🏀 上下弹跳效果 | 按钮强调、提示 |
| **flash** | 闪光 | ⚡ 快速闪烁效果 | 警告、紧急提示 |
| **pulse** | 脉搏 | 💓 缩放脉动效果 | 心跳、生命力表现 |
| **rubberBand** | 橡皮圈 | 🎈 拉伸回弹效果 | 弹性交互反馈 |
| **shake** | 摇动 | 🤝 左右摇摆 | 错误提示、拒绝操作 |
| **headShake** | 摇头 | 🙅 摇头拒绝动作 | 否定、拒绝操作 |
| **swing** | 摇摆 | 🌿 轻柔摇摆 | 自然、轻松的提示 |
| **tada** | 波动 | 🎉 庆祝式放大 | 成功、庆祝效果 |
| **wobble** | 摆动 | 🌊 波浪式摆动 | 不稳定、活泼效果 |
| **jello** | 凝胶物 | 🍮 果冻式摆动 | 可爱、Q弹效果 |

## 🏀 Bounce 弹性缓冲动画

弹性缓冲动画模拟物理弹跳效果，常用于元素的进入和退出。

### 📊 Bounce 动画列表

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **bounceIn** | 跳入 | 📍 中心弹入 | 弹窗出现 |
| **bounceInDown** | 向下跳入 | ⬇️ 从上方弹入 | 下拉菜单 |
| **bounceInLeft** | 从左侧跳入 | ⬅️ 从左侧弹入 | 侧边栏进入 |
| **bounceInRight** | 从右侧跳入 | ➡️ 从右侧弹入 | 通知消息 |
| **bounceInUp** | 向上跳入 | ⬆️ 从下方弹入 | 底部菜单 |
| **bounceOut** | 跳出 | 📍 中心弹出 | 弹窗消失 |
| **bounceOutDown** | 向下跳出 | ⬇️ 向下弹出 | 元素下沉 |
| **bounceOutLeft** | 向左跳出 | ⬅️ 向左弹出 | 侧边栏退出 |
| **bounceOutRight** | 向右跳出 | ➡️ 向右弹出 | 消息消失 |
| **bounceOutUp** | 向上跳出 | ⬆️ 向上弹出 | 元素上升 |

## 👻 Fade 透明度变化动画

通过透明度的变化来实现淡入淡出效果，是最常用的过渡动画之一。

### 📊 Fade 动画列表

#### 淡入动画

| 动画名称 | 效果描述 | 特点 | 适用场景 |
|----------|----------|------|----------|
| **fadeIn** | 淡入 | 🌅 基础淡入效果 | 内容显示 |
| **fadeInDown** | 向下淡入 | ⬇️ 从上方淡入 | 页面标题 |
| **fadeInDownBig** | 向下大幅度淡入 | ⬇️📏 大距离淡入 | 大块内容 |
| **fadeInLeft** | 从左侧淡入 | ⬅️ 从左侧淡入 | 左侧内容 |
| **fadeInLeftBig** | 从左侧大幅度淡入 | ⬅️📏 大距离淡入 | 宽屏内容 |
| **fadeInRight** | 从右侧淡入 | ➡️ 从右侧淡入 | 右侧内容 |
| **fadeInRightBig** | 从右侧大幅度淡入 | ➡️📏 大距离淡入 | 宽屏内容 |
| **fadeInUp** | 向上淡入 | ⬆️ 从下方淡入 | 底部内容 |
| **fadeInUpBig** | 向上大幅度淡入 | ⬆️📏 大距离淡入 | 大块内容 |

#### 淡出动画

| 动画名称 | 效果描述 | 特点 | 适用场景 |
|----------|----------|------|----------|
| **fadeOut** | 淡出 | 🌇 基础淡出效果 | 内容隐藏 |
| **fadeOutDown** | 向下淡出 | ⬇️ 向下方淡出 | 内容下沉 |
| **fadeOutDownBig** | 向下大幅度淡出 | ⬇️📏 大距离淡出 | 大块内容 |
| **fadeOutLeft** | 向左淡出 | ⬅️ 向左侧淡出 | 左侧退出 |
| **fadeOutLeftBig** | 向左大幅度淡出 | ⬅️📏 大距离淡出 | 宽屏退出 |
| **fadeOutRight** | 向右淡出 | ➡️ 向右侧淡出 | 右侧退出 |
| **fadeOutRightBig** | 向右大幅度淡出 | ➡️📏 大距离淡出 | 宽屏退出 |
| **fadeOutUp** | 向上淡出 | ⬆️ 向上方淡出 | 内容上升 |
| **fadeOutUpBig** | 向上大幅度淡出 | ⬆️📏 大距离淡出 | 大块内容 |

## 🔄 Flip 翻转动画

3D 翻转效果，可以沿 X 轴或 Y 轴进行翻转。

### 📊 Flip 动画列表

| 动画名称 | 效果描述 | 轴向 | 使用场景 |
|----------|----------|------|----------|
| **flip** | 翻转 | 🔄 基础翻转 | 卡片翻转 |
| **flipInX** | 沿 X 轴翻转进入 | ↔️ 水平翻转 | 横向卡片 |
| **flipInY** | 沿 Y 轴翻转进入 | ↕️ 垂直翻转 | 纵向卡片 |
| **flipOutX** | 沿 X 轴翻转退出 | ↔️ 水平翻出 | 横向退出 |
| **flipOutY** | 沿 Y 轴翻转退出 | ↕️ 垂直翻出 | 纵向退出 |

## 🌪️ Rotate 旋转动画

旋转动画通过元素的旋转来实现进入和退出效果。

### 📊 Rotate 动画列表

#### 旋转进入

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **rotateIn** | 旋转进入 | 🌀 中心旋转 | 加载图标 |
| **rotateInDownLeft** | 从左下旋转进入 | ↙️ 左下角旋转 | 特殊入场 |
| **rotateInDownRight** | 从右下旋转进入 | ↘️ 右下角旋转 | 特殊入场 |
| **rotateInUpLeft** | 从左上旋转进入 | ↖️ 左上角旋转 | 特殊入场 |
| **rotateInUpRight** | 从右上旋转进入 | ↗️ 右上角旋转 | 特殊入场 |

#### 旋转退出

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **rotateOut** | 旋转退出 | 🌀 中心旋转 | 加载完成 |
| **rotateOutDownLeft** | 向左下旋转退出 | ↙️ 左下角旋转 | 特殊退场 |
| **rotateOutDownRight** | 向右下旋转退出 | ↘️ 右下角旋转 | 特殊退场 |
| **rotateOutUpLeft** | 向左上旋转退出 | ↖️ 左上角旋转 | 特殊退场 |
| **rotateOutUpRight** | 向右上旋转退出 | ↗️ 右上角旋转 | 特殊退场 |

## ↔️ Slide 滑动动画

滑动动画通过元素的位移来实现进入和退出效果。

### 📊 Slide 动画列表

#### 滑动进入

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **slideInDown** | 向下滑入 | ⬇️ 从上方滑入 | 顶部导航 |
| **slideInLeft** | 从左侧滑入 | ⬅️ 从左侧滑入 | 侧边栏 |
| **slideInRight** | 从右侧滑入 | ➡️ 从右侧滑入 | 右侧面板 |
| **slideInUp** | 向上滑入 | ⬆️ 从下方滑入 | 底部菜单 |

#### 滑动退出

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **slideOutDown** | 向下滑出 | ⬇️ 向下方滑出 | 内容下沉 |
| **slideOutLeft** | 向左滑出 | ⬅️ 向左侧滑出 | 左侧退出 |
| **slideOutRight** | 向右滑出 | ➡️ 向右侧滑出 | 右侧退出 |
| **slideOutUp** | 向上滑出 | ⬆️ 向上方滑出 | 内容上升 |

## 🔍 Zoom 变焦动画

通过缩放效果来实现元素的进入和退出。

### 📊 Zoom 动画列表

#### 放大进入

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **zoomIn** | 放大进入 | 🔍 中心放大 | 弹窗显示 |
| **zoomInDown** | 放大向下进入 | ⬇️🔍 从上方放大 | 下拉展开 |
| **zoomInLeft** | 放大从左侧进入 | ⬅️🔍 从左侧放大 | 左侧展开 |
| **zoomInRight** | 放大从右侧进入 | ➡️🔍 从右侧放大 | 右侧展开 |
| **zoomInUp** | 放大向上进入 | ⬆️🔍 从下方放大 | 向上展开 |

#### 缩小退出

| 动画名称 | 效果描述 | 方向 | 使用场景 |
|----------|----------|------|----------|
| **zoomOut** | 缩小离开 | 🔍 中心缩小 | 弹窗关闭 |
| **zoomOutDown** | 缩小向下离开 | ⬇️🔍 向下缩小 | 向下收起 |
| **zoomOutLeft** | 缩小向左离开 | ⬅️🔍 向左缩小 | 向左收起 |
| **zoomOutRight** | 缩小向右离开 | ➡️🔍 向右缩小 | 向右收起 |
| **zoomOutUp** | 缩小向上离开 | ⬆️🔍 向上缩小 | 向上收起 |

## ✨ Special 特殊动画

独特的动画效果，适用于特殊场景。

### 📊 Special 动画列表

| 动画名称 | 效果描述 | 特点 | 使用场景 |
|----------|----------|------|----------|
| **hinge** | 转轴离开 | 🚪 门轴旋转效果 | 页面关闭、元素移除 |
| **rollIn** | 转入 | 🎳 滚动进入 | 球体、圆形元素 |
| **rollOut** | 转出 | 🎳 滚动退出 | 球体、圆形元素 |
| **lightSpeedIn** | 倾斜淡入 | ⚡ 光速进入 | 快速显示、闪电效果 |
| **lightSpeedOut** | 倾斜淡出 | ⚡ 光速离开 | 快速消失、闪电效果 |

## 📦 安装与使用

### 🚀 安装方式

```bash
# NPM 安装
npm install animate.css

# Yarn 安装
yarn add animate.css

# CDN 引入
<link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.min.css">
```

### 🎨 基础使用

```html
<!-- 基础动画使用 -->
<div class="animate__animated animate__bounce">弹跳动画</div>
<div class="animate__animated animate__flash">闪光动画</div>

<!-- 自定义样式 -->
<style>
  .box {
    height: 100px;
    width: 100px;
    background-color: lightblue;
    margin: 20px;
  }
  
  /* 无限循环动画 */
  .animate__infinite {
    animation-iteration-count: infinite;
  }
  
  /* 自定义动画时长 */
  .animate__slow {
    animation-duration: 2s;
  }
  
  .animate__fast {
    animation-duration: 0.5s;
  }
</style>

<!-- HTML 结构 -->
<div class="box animate__animated animate__bounce">基础弹跳</div>
<div class="box animate__animated animate__flash animate__infinite">无限闪光</div>
<div class="box animate__animated animate__fadeIn animate__slow">慢速淡入</div>
```

### 🎛️ JavaScript 动态控制

```javascript
// 获取元素
const element = document.getElementById('myElement');

// 添加动画类
function addAnimation(animationName) {
  element.classList.add('animate__animated', `animate__${animationName}`);
  
  // 动画结束后移除类，以便重复使用
  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', `animate__${animationName}`);
  }, { once: true });
}

// 使用示例
document.getElementById('bounceBtn').onclick = () => {
  addAnimation('bounce');
};

document.getElementById('fadeInBtn').onclick = () => {
  addAnimation('fadeIn');
};

document.getElementById('slideInLeftBtn').onclick = () => {
  addAnimation('slideInLeft');
};
```

### 🔄 高级用法示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animate.css 高级用法</title>
  <link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.min.css">
  <style>
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 20px;
    }
    
    .card {
      width: 200px;
      height: 150px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: scale(1.05);
    }
    
    .controls {
      margin: 20px;
      text-align: center;
    }
    
    .btn {
      margin: 5px;
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn:hover {
      background: #45a049;
    }
  </style>
</head>
<body>
  <div class="controls">
    <h2>🎬 Animate.css 演示</h2>
    <button class="btn" onclick="animateCard('bounce')">🏀 弹跳</button>
    <button class="btn" onclick="animateCard('flash')">⚡ 闪光</button>
    <button class="btn" onclick="animateCard('pulse')">💓 脉搏</button>
    <button class="btn" onclick="animateCard('fadeIn')">👻 淡入</button>
    <button class="btn" onclick="animateCard('slideInLeft')">⬅️ 左滑入</button>
    <button class="btn" onclick="animateCard('zoomIn')">🔍 放大</button>
    <button class="btn" onclick="animateCard('rotateIn')">🌀 旋转</button>
    <button class="btn" onclick="animateCard('flip')">🔄 翻转</button>
  </div>
  
  <div class="container">
    <div class="card" id="animatedCard">
      点击上方按钮看动画效果
    </div>
  </div>

  <script>
    const card = document.getElementById('animatedCard');
    
    function animateCard(animationName) {
      // 移除之前的动画类
      card.className = 'card';
      
      // 添加新的动画类
      card.classList.add('animate__animated', `animate__${animationName}`);
      
      // 动画结束后清理
      card.addEventListener('animationend', function handleAnimationEnd() {
        card.classList.remove('animate__animated', `animate__${animationName}`);
        card.removeEventListener('animationend', handleAnimationEnd);
      });
    }
    
    // 页面加载时的欢迎动画
    window.addEventListener('load', () => {
      animateCard('bounceIn');
    });
  </script>
</body>
</html>
```

## ⚙️ 自定义配置

### 🎛️ CSS 变量配置

```css
/* 自定义动画持续时间 */
:root {
  --animate-duration: 1s;
  --animate-delay: 1s;
  --animate-repeat: 1;
}

/* 应用自定义配置 */
.my-element {
  animation-duration: var(--animate-duration);
  animation-delay: var(--animate-delay);
  animation-iteration-count: var(--animate-repeat);
}

/* 或者直接设置 */
.slow-animation {
  animation-duration: 2s;
}

.fast-animation {
  animation-duration: 0.5s;
}

.infinite-animation {
  animation-iteration-count: infinite;
}
```

### 🎨 自定义动画类

```css
/* 创建自定义动画组合 */
.custom-entrance {
  animation-name: fadeIn, slideInUp;
  animation-duration: 1s, 0.8s;
  animation-delay: 0s, 0.2s;
}

/* 自定义缓动函数 */
.smooth-bounce {
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 响应式动画 */
@media (max-width: 768px) {
  .animate__animated {
    animation-duration: 0.5s;
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .animate__animated {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## 🎯 最佳实践

### 💡 使用建议

::: tip 🌟 性能优化
1. **按需引入** - 只引入需要的动画效果
2. **避免过度使用** - 适度使用动画，避免影响用户体验
3. **考虑性能** - 在低性能设备上减少复杂动画
4. **响应式设计** - 在移动设备上使用更简单的动画
:::

::: warning ⚠️ 注意事项
- 不要在同一个元素上同时使用多个冲突的动画
- 考虑用户的动画偏好设置（prefers-reduced-motion）
- 在触摸设备上，某些动画可能不如预期效果
- 注意动画的可访问性，为屏幕阅读器用户提供替代方案
:::

### 🎨 动画选择指南

| 使用场景 | 推荐动画 | 原因 |
|----------|----------|------|
| **页面加载** | fadeIn, slideInUp | 自然、不突兀 |
| **错误提示** | shake, flash | 吸引注意力 |
| **成功反馈** | bounce, tada | 积极、庆祝感 |
| **删除操作** | fadeOut, slideOutRight | 明确的离开感 |
| **弹窗显示** | zoomIn, bounceIn | 突出、醒目 |
| **菜单展开** | slideInDown, fadeInDown | 自然的展开感 |
| **加载状态** | pulse, flash | 持续的活动感 |
| **卡片翻转** | flip, rotateY | 3D 翻转效果 |

### 🔧 调试技巧

```javascript
// 动画调试工具
class AnimationDebugger {
  static logAnimation(element, animationName) {
    console.log(`🎬 Animation started: ${animationName}`);
    
    element.addEventListener('animationstart', () => {
      console.log(`▶️ ${animationName} started`);
    });
    
    element.addEventListener('animationend', () => {
      console.log(`⏹️ ${animationName} ended`);
    });
    
    element.addEventListener('animationiteration', () => {
      console.log(`🔄 ${animationName} iteration`);
    });
  }
  
  static measurePerformance(callback) {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`⏱️ Animation setup took: ${end - start} milliseconds`);
  }
}

// 使用示例
AnimationDebugger.measurePerformance(() => {
  const element = document.getElementById('myElement');
  element.classList.add('animate__animated', 'animate__bounce');
  AnimationDebugger.logAnimation(element, 'bounce');
});
```

## 📚 扩展阅读

- [Animate.css 官方文档](https://animate.style/)
- [CSS3 Animation 详解](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [Web Animation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)
- [动画性能优化指南](https://developers.google.com/web/fundamentals/design-and-ux/animations)
