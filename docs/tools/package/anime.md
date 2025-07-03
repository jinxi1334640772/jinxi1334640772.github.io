---
title: Anime.js 动画库
description: 轻量级 JavaScript 动画库完整使用指南
outline: deep
---

# Anime.js 动画库

::: info 简介
Anime.js 是一个轻量级的 JavaScript 动画库，使用简单且功能强大的 API，支持 CSS 属性、SVG、DOM 属性和 JavaScript 对象的动画处理。
:::

<img src="./640.gif" alt="Anime.js 示例动画" data-fancybox="gallery" style="border-radius: 8px; margin: 20px 0;" />

<img src="./animejs-v3-header-animation.gif" alt="Anime.js 头部动画效果" data-fancybox="gallery" style="border-radius: 8px; margin: 20px 0;" />

## 🚀 核心功能

- **CSS 属性动画** - 支持对 CSS 属性进行动画处理，如颜色、位置、大小等
- **SVG 动画** - 能够对 SVG 元素进行动画处理，支持路径动画、形状变换等
- **DOM 属性动画** - 可以对 DOM 元素的属性进行动画处理，如文本内容、类名等
- **JavaScript 对象动画** - 支持对 JavaScript 对象的属性进行动画处理，适用于更复杂的动画需求
- **时间轴控制** - 提供时间轴功能，允许用户创建复杂的动画序列，并进行精细的控制
- **回调和 Promise** - 支持动画运动过程的回调函数，以及基于 Promise 的动画控制

## 📦 安装

### NPM 安装

```bash
# 安装 V4 版本
npm install animejs --save

# 或使用 yarn
yarn add animejs

# 或使用 pnpm
pnpm add animejs
```

### CDN 引入

```html
<!-- 引入 JS 包 -->
<script src="https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.min.js"></script>
```

## 🎯 基础使用

### 基本动画

```html
<div class="selector">anime 动画节点</div>
<div class="selector">anime 动画节点</div>
```

```javascript
// V4 版本支持按需引入
import {
  animate,
  createTimer,
  createTimeline,
  engine,
  eases,
  spring,
  defaults,
  stagger,
  utils,
  svg,
} from "animejs";

// 基本动画示例
animate(".selector", {
  translateX: 250,
  rotate: "1turn",
  backgroundColor: "#FFF",
  duration: 1500,
  ease: "outQuad"
});
```

### 高级动画配置

```javascript
const { x, y, angle } = svg.createMotionPath('path');

animate(".selector", {
  // CSS 变量动画
  "--radius": "20px",
  
  // 交错动画
  translateX: stagger('1rem', { reversed: true }),
  // 结果: 4rem, 3rem, 2rem, 1rem, 0rem
  
  // 复杂属性配置
  translateY: { 
    to: 50, 
    duration: 800, 
    ease: "outExpo" 
  },
  
  // SVG 路径动画
  translateX: x,
  translateY: y,
  rotate: angle,
  
  // 关键帧动画
  opacity: [
    {
      from: 0, 
      to: 0.5,
      duration: 300,
      ease: "inQuad",
    },
    {
      to: 1,
      duration: 300,
      ease: "outQuad",
    },
  ],
  
  // SVG 线条绘制
  strokeDashoffset: [
    { to: svg.drawLine('in') },
    { to: svg.drawLine('out') },
  ],
  
  // 动画控制参数
  alternate: true,
  reversed: true,
  ease: spring(1, 10, .5, 0),
  frameRate: 60,
  duration: 1500,
  beginDelay: 200,
  delay: function (el, i) {
    return i * 250;
  },
  endDelay: 1000,
  loop: true,
  
  // 动画合成模式
  composition: 'replace', // 'none' | 'add'
  
  // 数值修饰器
  modifier: utils.round(2),
  // modifier: v => v % 10
  
  // 回调函数
  onBegin: () => console.log("动画开始"),
  onUpdate: () => console.log("动画更新"),
  onRender: () => console.log("动画渲染"),
  onLoop: () => console.log("动画循环"),
  onComplete: function (anim) {
    console.log("动画完成");
  },
  
  // SVG 形状变形
  points: svg.morphTo(shapeTarget, precision),
});
```

## 📈 缓动函数

Anime.js 提供了丰富的缓动函数：

```javascript
const easingNames = [
  // In 缓动
  'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint',
  'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeInBounce',
  
  // Out 缓动
  'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint',
  'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeOutBounce',
  
  // InOut 缓动
  'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint',
  'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack', 'easeInOutBounce',
  
  // OutIn 缓动
  'easeOutInQuad', 'easeOutInCubic', 'easeOutInQuart', 'easeOutInQuint',
  'easeOutInSine', 'easeOutInExpo', 'easeOutInCirc', 'easeOutInBack', 'easeOutInBounce',
];

// 使用示例
animate('.element', {
  translateX: 100,
  ease: 'easeInOutQuad'
});

// 弹簧缓动
animate('.element', {
  translateX: 100,
  ease: spring(1, 10, .5, 0) // mass, stiffness, damping, velocity
});
```

## ⏰ 定时器控制

```javascript
// 创建定时器
const mainLoop = createTimer({
  frameRate: 60,
  onUpdate: () => {
    // 每帧执行的操作 (60 fps)
  }
});

// 定时器控制方法
mainLoop.pause();    // 暂停定时器
mainLoop.play();     // 播放定时器
mainLoop.restart();  // 重启定时器
mainLoop.reverse();  // 反向播放
mainLoop.cancel();   // 完全取消动画并释放内存
mainLoop.revert();   // 取消动画并还原所有更改，删除内联样式
```

## 📅 时间轴 (Timeline)

```javascript
// 创建时间轴
const tl = createTimeline({
  defaults: {
    ease: 'inOutQuad',
    duration: 800
  },
  loop: 2 // 时间线循环两次
});

// 添加动画到时间轴
tl.add('#target', {
  translateX: 100,
  loop: 3, // 每个时间线循环中，循环三次
  alternate: true
})
.add({ 
  duration: 100, 
  onUpdate: () => {} 
}, '-=200') // 相对时间定位
.add(() => { 
  /* 使用函数形式 */ 
}, '-=200')
.set('#target', { 
  translateX: 0 
});

// 时间轴控制
tl.play();
tl.pause();
tl.restart();
tl.seek(timeStamp);
```

### 时间定位语法

V4 引入了新的时间位置指定方法：

| 语法 | 说明 |
|------|------|
| `'<='` | 在最后一个子动画的结尾处 |
| `'<-=100'` | 最后一个子项结束前 100ms |
| `'<=+100'` | 最后一个子项结束后 100ms |
| `'<<'` | 在最后一个子项的开头 |
| `'<<-=100'` | 最后一个子项开始前 100ms |
| `'<<+=100'` | 最后一个子项开始后 100ms |
| `'LABEL_NAME-=100'` | 标签时间位置前 100ms |
| `'LABEL_NAME+=100'` | 标签时间位置后 100ms |

## 🛠️ 实用工具 (Utils)

### 获取和设置属性

```javascript
// 获取属性值
const widthInEm = utils.get('#target', 'width', 'em'); // '5em'
const widthNumber = utils.get('#target', 'width', false); // 80

// 设置属性值
utils.set('#target', {
  width: 80, // 将以 px 为单位设置值
  height: '1rem', // 指定单位
  translateX: stagger('3rem', { 
    start: 5, 
    reversed: true, 
    ease: 'in' 
  }),
  color: 'var(--hex-red)', // 允许非数值
});
```

### 清理和移除

```javascript
// 从指定的 Animation 或 Timeline 中移除目标
utils.remove(targets, Animation | Timeline);

// 删除 Animation 或 Timeline 添加的所有内联样式
utils.cleanInlineStyles(Animation | Timeline);
```

### Promise 支持

```javascript
// 启用 Promise 支持
utils.promisify(animate(target, { prop: x })).then(doSomething);
```

### 数学工具函数

```javascript
// 随机数生成
utils.random(0, 100);       // 45
utils.random(0, 100, 2);    // 45.39

// 随机选择
utils.randomPick(['a', 'b', 'c']); // 'b'

// 数值处理
utils.round(value, decimalLength);          // 四舍五入
utils.clamp(value, min, max);               // 限制范围
utils.snap(value, increment);               // 捕捉到增量
utils.wrap(value, min, max);                // 包装到范围内
utils.map(value, fromLow, fromHigh, toLow, toHigh); // 映射范围

// 插值和格式化
utils.interpolate(start, end, progress);    // 插值
utils.roundPad(value, decimalLength);       // 四舍五入并填充
utils.padStart(value, totalLength, padString); // 前填充
utils.padEnd(value, totalLength, padString);   // 后填充
utils.lerp(start, end, amount);             // 线性插值
```

## ⚙️ 引擎控制 (Engine)

```javascript
// 引擎配置
engine.useDefaultMainLoop = false;  // 阻止使用内置循环
engine.pauseWhenHidden = false;     // 防止隐藏时自动暂停
engine.frameRate = 120;             // 设置全局帧率
engine.playbackRate = 1.5;          // 控制全局播放速率

// 引擎控制
engine.suspend();  // 暂停所有动画
engine.resume();   // 恢复所有动画

// 手动控制渲染循环
const render = () => {
  engine.tick(); // 手动推进 Anime.js 引擎
  renderer.render(scene, camera); // 渲染 Three.js 场景
};

// 调用 Three.js 内置动画循环
renderer.setAnimationLoop(render);
```

## 🎛️ 默认参数配置

```javascript
// 修改全局默认参数
defaults.playbackRate = 1;
defaults.frameRate = 120;
defaults.loop = 0;
defaults.reversed = false;
defaults.alternate = false;
defaults.autoplay = true;
defaults.beginDelay = 0;
defaults.duration = 1000;
defaults.delay = 0;
defaults.endDelay = 0;
defaults.ease = 'outQuad';
defaults.composition = 0;
defaults.modifier = v => v;
defaults.onBegin = () => {};
defaults.onUpdate = () => {};
defaults.onRender = () => {};
defaults.onLoop = () => {};
defaults.onComplete = () => {};
```

## 📚 最佳实践

::: tip 性能优化
- 使用 `will-change` CSS 属性提示浏览器优化
- 避免同时运行过多复杂动画
- 合理设置帧率，平衡性能和流畅度
- 使用 `composition: 'add'` 模式叠加动画效果
:::

::: warning 注意事项
- V4 版本相比 V3 有重大更新，注意 API 变化
- 在移动设备上测试动画性能
- 合理使用回调函数，避免内存泄漏
:::

## 🔗 相关资源

- [Anime.js 官方文档](https://animejs.com/)
- [GitHub 仓库](https://github.com/juliangarnier/anime)
- [V4 版本更新说明](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4)
- [在线示例和演示](https://animejs.com/documentation/)

## 📝 总结

Anime.js 是一个功能强大且易于使用的动画库，特别适合：

- 网页交互动画
- SVG 图形动画
- 数据可视化动画
- 游戏 UI 动画
- 创意展示页面

通过其简洁的 API 和强大的功能，可以轻松创建出专业级的动画效果。
