---
title: 🚀 Velocity.js 动画库完全指南
description: 高性能轻量级 JavaScript 动画库，提供流畅动画效果，支持链式调用、丰富的缓动函数和动画序列
outline: deep
---

# 🚀 Velocity.js 动画库完全指南

## 1. Velocity.js 简介

Velocity.js 是一个高性能、轻量级的 JavaScript 动画库，它的设计目标是提供一种简单易用且功能强大的方式来创建平滑流畅的动画效果。相比于 jQuery 的 `.animate()` 方法，Velocity.js 在性能上有着显著提升，它利用了浏览器的原生渲染机制，使得动画更接近硬件加速。

### 1.1 核心特性

- **高性能**：优化了关键路径，尽可能地减少了重排和重绘，通过直接操作 CSS 属性值来实现动画，避免了 DOM 操作的开销，从而提高性能。

- **简洁直观的 API**：API 设计与 jQuery 的 `.animate()` 类似但更强大。你可以轻松设置动画的速度、延迟、缓动函数和序列等参数。

- **可链式调用**：与其他 jQuery 插件一样，Velocity.js 支持链式调用，可以连续设置多个动画效果。

- **丰富的缓动函数**：内置多种缓动函数，如 ease-in-out, linear 等，并允许自定义缓动函数，满足个性化需求。

### 1.2 扩展功能

- **易于整合**：与现有代码库融合良好，即使不使用 jQuery 也可以工作。
- **响应式动画**：通过监听窗口大小改变，轻松实现响应式的动画效果。
- **完善的文档**：项目提供了详细的文档说明，方便开发者快速理解和使用。
- **颜色动画**：支持颜色属性的动画过渡，使得颜色变化更加平滑自然。
- **变换支持**：提供 CSS 变换的动画支持，如平移、旋转、缩放等。
- **循环动画**：允许动画无限循环，适用于需要持续效果的场景。
- **SVG 支持**：特别优化了 SVG 元素的动画支持，确保 SVG 动画的兼容性和性能。
- **滚动动画**：支持滚动动画，可以平滑地滚动页面或滚动到特定元素。

### 1.3 兼容性与模块化

- **广泛兼容**：兼容所有现代浏览器，甚至包括 IE8。对于不支持 CSS3 的旧版浏览器，它会自动回退到传统的效果，确保广泛适用性。
- **模块化设计**：项目遵循 CommonJS 规范，可以方便地与其它模块系统如 RequireJS 或 Webpack 集成。
- **服务端支持**：语法分析和模板渲染分离，支持客户端和服务器端使用。

## 2. 基本使用方法

### 2.1 安装与引入

```javascript
// 使用 npm 安装
npm install velocity-animate

// 在代码中引入
import Velocity from "velocity-animate";
```

### 2.2 基础语法

```javascript
// HTML 元素
<div id="animated">Hello, Velocity!</div>

// 使用 jQuery 语法
$("#test").velocity({
    left: "200px"
}, {
    duration: 450,
    delay: 300
});

// 不使用 jQuery 的语法
Velocity(
  document.getElementById("animated"),
  { opacity: 0.5 },
  { duration: 400 }
);
```

### 2.3 链式调用

```javascript
$("#test")
  .velocity({ translateX: 75 }, { queue: "a" })
  .velocity("fadeIn", { display: "table" })
  .velocity("scroll", {
    duration: 500,
    easing: "swing",
    container: $("#container"),
    offset: 250, // 向下偏移 250px
  })
  .velocity({ translateX: 200 }, 1000, () => {
    // 完成回调
  });

// 2秒后执行队列 "a" 的动画
setTimeout(function() {
  $("#test").dequeue("a");
}, 2000);
```

## 3. 高级功能

### 3.1 属性值设置

Velocity.js 支持多种形式的属性值设置：

```javascript
Velocity(element, {
  // 基本值
  opacity: 0.5,
  
  // 数组形式 [结束值, 起始值]
  opacity: [1, 0],
  
  // 带缓动函数的数组 [起始值, 缓动函数, 结束值]
  opacity: [0, "easeInSine", 1],
  
  // 函数形式
  opacity: function() { return Math.random() },
  
  // 颜色相关
  backgroundColor: "#ff0000",
  backgroundColorAlpha: 0.5,  // 背景色 RGBA 中的 A 透明度到 50%
  colorRed: "50%",            // 字体颜色 RGB 中的 Red 到 50% (0.5 * 255)
  colorBlue: "+=50",          // 字体颜色 RGB 中的 Blue 值叠加 50
  colorAlpha: 0.85,           // 字体颜色 RGBA 中的 A 透明度到 85%
  
  // 变换相关
  translateX: [500, 0],       // translateX 初始值为 0，结束值为 500px
  translateX: "200px",
  scaleX: 0.5,
  rotateZ: "45deg",
  skewX: "30deg",
  
  // 尺寸和位置
  top: 50,                    // 等同于 "50px"
  left: "50%",
  width: "+=5rem",            // 每次在当前值上叠加 5rem
  height: "*=2",              // 每次在当前值上叠乘 2
  
  // 初始值设置
  color: ["#888", "#000"],    // 每次动画执行前，color 的初始值都为 "#000"
  
  // SVG 支持
  x: 200,                     // SVG 坐标动画
  r: 25,
  fill: "#ff0000",            // 颜色填充动画
  strokeRed: 255,
  strokeGreen: 0,
  strokeBlue: 0,
});
```

### 3.2 配置选项

```javascript
Velocity(element, properties, {
  // 动画执行时间，支持 jQuery 中的动画速度关键字
  duration: 400 | 'slow' | 'normal' | 'fast',
  
  // 缓动效果
  easing: "swing",
  
  // 自定义队列名，设置为 false 强制并行执行一个新动画
  queue: "customQueueName",
  
  // 回调函数
  begin: function(elements) { console.log("动画开始"); },
  progress: function(elements, complete, remaining, start, tweenValue) {
    // elements：当前执行动画的元素
    // complete：整个动画过程执行到百分之多少，该值是递增的
    // remaining：整个动画过程还剩下多少毫秒，该值是递减的
    // start：动画开始时的绝对时间 (Unix time)
    // tweenValue：动画执行过程中两个动画属性之间的补间值
  },
  complete: function(elements) { console.log("动画完成"); },
  
  // 动画结束时设置元素的 CSS 属性
  display: "block",
  visibility: "visible",
  
  // 其他选项
  loop: false,         // 循环
  delay: false,        // 延迟
  mobileHA: true,      // 移动端硬件加速（默认开启）
});
```

### 3.3 特殊方法

```javascript
// 获取和设置元素的单个值
$.Velocity.hook($element, "translateX");                // 获取值
$.Velocity.hook($element, "translateX", "500px");       // 设置值

// 使用 Promise 方法
$.Velocity.animate($element, { opacity: 0.5 })
  .then(function(elements) { console.log("动画完成"); })
  .catch(function(error) { console.log("动画出错"); });

// 调试工具
$.Velocity.mock = true;    // 直接跳转到结束状态，常用于代码调试
$.Velocity.mock = 10;      // 页面里所有 Velocity 动画将以 10 为系数减慢
```

## 4. 缓动函数

Velocity.js 提供了丰富的缓动函数，用于控制动画的速度曲线：

### 4.1 内置缓动函数

```javascript
// jQuery UI 的缓动关键字
"linear"            // 线性
"swing"             // 摆动
"spring"            // 弹簧
"easeInSine"        // 正弦缓入
"easeOutSine"       // 正弦缓出
"easeInOutSine"     // 正弦缓入缓出
"easeInQuad"        // 二次方缓入
"easeOutQuad"       // 二次方缓出
"easeInOutQuad"     // 二次方缓入缓出
"easeInCubic"       // 三次方缓入
"easeOutCubic"      // 三次方缓出
"easeInOutCubic"    // 三次方缓入缓出
"easeInQuart"       // 四次方缓入
"easeOutQuart"      // 四次方缓出
"easeInOutQuart"    // 四次方缓入缓出
"easeInQuint"       // 五次方缓入
"easeOutQuint"      // 五次方缓出
"easeInOutQuint"    // 五次方缓入缓出
"easeInExpo"        // 指数缓入
"easeOutExpo"       // 指数缓出
"easeInOutExpo"     // 指数缓入缓出
"easeInCirc"        // 圆形缓入
"easeOutCirc"       // 圆形缓出
"easeInOutCirc"     // 圆形缓入缓出

// CSS3 缓动关键字
"ease"
"ease-in"
"ease-out"
"ease-in-out"

// CSS3 贝塞尔曲线
[0.17, 0.67, 0.83, 0.67]

// 弹簧物理缓动（spring physics）
// tension 最大值为 500，friction 最大值为 20
[tension, friction]

// 步骤缓动（step easings）
// 使动画通过指定的步骤过渡到结束值
[8]  // 8 个步骤
```

### 4.2 自定义缓动函数

```javascript
// 自定义缓动函数
// p：动画完成的百分比（十进制值）
// opts：传递到触发 .velocity() 调用的选项
// tweenDelta：补间
$.Velocity.Easings.myCustomEasing = function(p, opts, tweenDelta) {
  return 0.5 - Math.cos(p * Math.PI) / 2;
};

// 使用自定义缓动函数
$("#element").velocity({ width: "100px" }, { easing: "myCustomEasing" });
```

## 5. Velocity UI 插件

velocity.ui.js 是 velocity.js 的动画插件，可以用它快速创建炫酷的动画特效，它依赖于 velocity.js。

### 5.1 主要方法

- **$.Velocity.RunSequence()**：改进嵌套的动画序列，使其更易于管理
- **$.Velocity.RegisterEffect()**：将多个 Velocity 动画合并存储到一个自定义数组里，可以通过引用该数组的名称在项目中复用

### 5.2 动画序列

```javascript
// 传统嵌套方式（难以管理）
$element1.velocity({ translateX: 100 }, 1000, function() {
  $element2.velocity({ translateX: 200 }, 1000, function() {
    $element3.velocity({ translateX: 300 }, 1000);
  });
});

// 使用 RunSequence 方法（更清晰）
var mySequence = [
  { e: $element1, p: { translateX: 100 }, o: { duration: 1000 } },
  { e: $element2, p: { translateX: 200 }, o: { duration: 1000 } },
  { e: $element3, p: { translateX: 300 }, o: { duration: 1000 } },
];

// 执行序列
$.Velocity.RunSequence(mySequence);
```

### 5.3 注册自定义效果

```javascript
// RegisterEffect：注册自定义动画特效
// name：动画特效名称（字符串）
// defaultDuration：默认动画执行时间（毫秒）
// calls：动画队列数组
// reset：设置元素在动画开始时的初始值
$.Velocity.RegisterEffect(name, {
  defaultDuration: duration,
  calls: [
    [{ property: value }, durationPercentage, { options }],
    [{ property: value }, durationPercentage, { options }],
  ],
  reset: { property: value, property: value },
});

// 注册示例
$.Velocity.RegisterEffect("callout.customPulse", {
  defaultDuration: 900,
  calls: [
    [{ scaleX: 1.5 }, 0.5],
    [{ scaleX: 1 }, 0.5],
  ],
});

// 调用自定义效果
$element.velocity("callout.customPulse");
```

### 5.4 内置动画效果

Velocity UI 包含多种预定义的动画效果，分为两大类：

#### 5.4.1 Callout 效果

这些效果用于吸引用户注意，通常是短暂的动画：

```
callout.bounce
callout.shake
callout.flash
callout.pulse
callout.swing
callout.tada
```

#### 5.4.2 Transition 效果

这些效果用于元素的进入和退出动画：

```
transition.fadeIn
transition.fadeOut
transition.flipXIn
transition.flipXOut
transition.flipYIn
transition.flipYOut
transition.flipBounceXIn
transition.flipBounceXOut
transition.flipBounceYIn
transition.flipBounceYOut
transition.swoopIn
transition.swoopOut
transition.whirlIn
transition.whirlOut
transition.shrinkIn
transition.shrinkOut
transition.expandIn
transition.expandOut
transition.bounceIn
transition.bounceUpIn
transition.bounceUpOut
transition.bounceDownIn
transition.bounceDownOut
transition.bounceLeftIn
transition.bounceLeftOut
transition.bounceRightIn
transition.bounceRightOut
transition.slideUpIn
transition.slideUpOut
transition.slideDownIn
transition.slideDownOut
transition.slideLeftIn
transition.slideLeftOut
transition.slideRightIn
transition.slideRightOut
transition.slideUpBigIn
transition.slideUpBigOut
transition.slideDownBigIn
transition.slideDownBigOut
transition.slideLeftBigIn
transition.slideLeftBigOut
transition.slideRightBigIn
transition.slideRightBigOut
transition.perspectiveUpIn
transition.perspectiveUpOut
transition.perspectiveDownIn
transition.perspectiveDownOut
transition.perspectiveLeftIn
transition.perspectiveLeftOut
transition.perspectiveRightIn
transition.perspectiveRightOut
```

### 5.5 UI 插件特有配置

Velocity UI 插件提供了一些特殊的配置选项，用于控制多元素动画：

```javascript
// stagger：错开，设置后每个元素会依次延迟指定毫秒执行动画
// drag：设为 true 时，最后一个元素会产生一种类似缓冲的效果
// backwards：设为 true 时，元素会从最后一个开始依次延迟执行动画
$(".box-stagger").velocity("transition.slideLeftBigIn", {
  stagger: 300,
  drag: true,
  backwards: true,
});
```

## 6. 实用技巧与最佳实践

### 6.1 性能优化

- **减少属性动画**：同时动画的属性越少，性能越好
- **使用变换代替位置**：使用 `translateX/Y` 代替 `left/top` 可以获得更好的性能
- **启用硬件加速**：对于移动设备，保持 `mobileHA: true` 选项开启

### 6.2 动画序列管理

- **对于简单序列**：使用链式调用
- **对于复杂序列**：使用 `RunSequence` 方法
- **对于重复使用的动画**：使用 `RegisterEffect` 创建自定义效果

### 6.3 调试技巧

- 使用 `$.Velocity.mock = true` 快速查看动画最终状态
- 使用 `$.Velocity.mock = 10` 减慢动画速度进行调试
- 使用 Promise 方法 `.then()` 和 `.catch()` 处理动画完成和错误情况

## 7. 参考资源

- [Velocity.js 官方文档](http://velocityjs.org/)
- [Velocity.js GitHub 仓库](https://github.com/julianshapiro/velocity)
- [Velocity UI Pack](https://github.com/julianshapiro/velocity/tree/master/velocity.ui.js)
- [Velocity.js 性能对比](http://velocityjs.org/#comparisons)