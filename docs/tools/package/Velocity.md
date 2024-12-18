## velocity 简介

Velocity.js 是一个高性能、轻量级的 JavaScript 动画库，它的设计目标是提供一种简单易用且功能强大的方式来创建平滑流畅的动画效果。相比于 jQuery 的.animate()方法，Velocity.js 在性能上有着显著提升，它利用了浏览器的原生渲染机制，使得动画更接近硬件加速。

- 高性能：Velocity.js 优化了关键路径，尽可能地减少了重排和重绘，通过直接操作 CSS 属性值来实现动画，避免了 DOM 操作的开销，从而提高性能。

- API 设计：其 API 设计简洁直观，与 jQuery 的.animate()类似但更强大。你可以轻松设置动画的速度、延迟、缓动函数和序列等参数。

  - 可链式调用：与其他 jQuery 插件一样，Velocity.js 支持链式调用，可以- 连续设置多个动画效果。
  - 丰富的缓动函数：内置多种缓动函数，如 ease-in-out, linear 等，并允- 许自定义缓动函数，满足个性化需求。

  - 易于整合：与现有代码库融合良好，即使不使用 jQuery 也可以工作。
  - 响应式：通过监听窗口大小改变，轻松实现响应式的动画效果。
  - 完善的文档：项目提供了详细的文档说明，方便开发者快速理解和使用。
  - 颜色动画：支持颜色属性的动画过渡，使得颜色变化更加平滑自然。
  - 变换支持：提供 CSS 变换的动画支持，如平移、旋转、缩放等。
  - 循环动画：允许动画无限循环，适用于需要持续效果的场景。
  - 缓动函数：内置多种缓动函数，使得动画效果更加丰富多样。
  - SVG 支持：特别优化了 SVG 元素的动画支持，确保 SVG 动画的兼容性和性能。
  - 滚动动画：支持滚动动画，可以平滑地滚动页面或滚动到特定元素。

- 兼容性：Velocity.js 兼容所有现代浏览器，甚至包括 IE8。对于不支持 CSS3 的旧版浏览器，它会自动回退到传统的效果，确保广泛适用性。

- 模块化：项目遵循 CommonJS 规范，可以方便地与其它模块系统如 RequireJS 或 Webpack 集成。
- 语法分析和模板渲染分离，支持客户端和服务器端使用

## velocity 使用

```js
<div id="animated">Hello, Velocity!</div>;

import Velocity from "velocity-animate";

// 使用jQuery语法，Velocity和jQuery的animate()用法类似
$("#test").velocity({
    left: "200px"
}, {
    duration: 450,
    delay: 300
})
// 可以链式调用，并自定义队列名称
.velocity({ translateX: 75 }, { queue: "a" })
// Velocity 中预定义了几个常用的快捷动画指令：如同jQuery
// fadeIn fadeOut slideUp slideDown scroll stop reverse finish
.velocity("fadeIn", { display: "table" })
// 滚动浏览器内容到目标元素 container 的位置
.velocity("scroll", {
  duration: 500,
  easing: "swing",
  container: $("#container"),
  offset: 250, // 向下偏移250px
})
// 简写形式：duration：1000；complete回调
.velocity({ translateX: 200 }, 1000, ()=>{/** */})

// 2秒后 执行队列"a"的动画
setTimeout(function() {
  $("#test").dequeue("a");
}, 2000);

 // 获取和设置元素的单个值：translateX 值必须写上单位
$.Velocity.hook($element, "translateX");
$.Velocity.hook($element, "translateX", "500px");

/* 使用 Velocity 的公有 promise方法 */
$.Velocity.animate($element, { opacity: 0.5 })
    /* 动画完成时执行下面.then()中的回调函数，支持多个then*/
    .then(function(elements) { console.log("Resolved."); })
    /* 捕获错误后的回调函数 */
    .catch(function(error) { console.log("Rejected."); });

// 设置为true时，直接跳转到结束状态，常用于代码调试
/* 页面里所有 Velocity 动画 将以10为系数减慢 */
$.Velocity.mock = 10;

// 不使用jQuery语法，写法如下
Velocity(
  // 要进行动画的元素
  document.getElementById("animated"),
  // 动画效果的最终属性，属性可以设置为多种形式
  {
    opacity: 0.5,
    opacity: [1, 0],
    //初始值永远为0 动画结束值为1 缓动效果为"easeInSine"
    opacity: [ 0, "easeInSine", 1 ]
    opacity: function() { return Math.random() },

    backgroundColor: "#ff0000",
    /* 背景色 RGBA 中的 A 透明度到50%  */
    backgroundColorAlpha: 0.5,
    /* 字体颜色 RGB 中的 Red 到 50% (0.5 * 255) */
    colorRed: "50%",
    /* 字体颜色 RGB 中的 Blue 值叠加50 */
    colorBlue: "+=50",
    /* 字体颜色 RGBA 中的 A 透明度到85% */
    colorAlpha: 0.85

    /* translateX 初始值永远为0 动画结束值为500px */
    translateX: [ 500, 0 ],
    translateX: "200px",
    scaleX: 0.5,
    rotateZ: "45deg",
    skewX: "30deg",

    top: 50,                // 等同于 "50px"
    left: "50%",
    width: "+=5rem",        // 每次在当前值上叠加 5rem
    height: "*=2"           // 每次在当前值上叠乘 2
    // 每次动画执行前，color 的初始值都为"#000"（从"#000"过渡成"#888"）
    color: ["#888", "#000"],

    /* 支持SVG动画 坐标动画*/
    x: 200,
    r: 25,
    /* 2D 变换动画 */
    translateX: "200px",
    /* 3D 变换动画（非IE浏览器） */
    translateZ: "200px",
    /* 颜色填充动画 "Fill" */
    fill: "#ff0000",
    strokeRed: 255,
    strokeGreen: 0,
    strokeBlue: 0,
  },
  // 动画的额外配置项
  {
    /* Velocity 动画配置项的默认值 */
    // 动画执行时间，支持 jQuery 中的动画速度关键字
    duration: 400 | 'slow' |'normal'|'fast',
    easing: "swing", // 缓动效果
    // 自定义队列名,设置为false 强制并行执行一个新动画
    queue: "customQueueName",
    begin: undefined, // 动画开始时的回调函数
    // 动画执行中的回调函数（该函数会随着动画执行被不断触发）
    progress: undefined,
    complete: undefined, // 动画结束时的回调函数
    // 动画结束时设置元素的 css display 属性
    display: undefined,
    // 动画结束时设置元素的 css visibility 属性
    visibility: undefined,
    loop: false, // 循环
    delay: false, // 延迟
    mobileHA: true, // 移动端硬件加速（默认开启）

    begin: function(elements) { console.log(elements); },
    complete: function(elements) { console.log(elements); },
    // 动画执行过程中调用
    progress: function(elements, complete, remaining, start, tweenValue) {
      // elements：当前执行动画的元素，可以用$(elements)来获取
      // complete：整个动画过程执行到百分之多少，该值是递增的
      // remaining：整个动画过程还剩下多少毫秒，该值是递减的
      // start：动画开始时的绝对时间 (Unix time)
      // tweenValue：动画执行过程中 两个动画属性之间的补间值
    }
  }
);

// Velocity默认包含5种缓动效果
const easingList = [
  // jQuery UI的缓动关键字
"linear"
"swing"
"spring"
"easeInSine"
"easeOutSine"
"easeInOutSine"
"easeInQuad"
"easeOutQuad"
"easeInOutQuad"
"easeInCubic"
"easeOutCubic"
"easeInOutCubic"
"easeInQuart"
"easeOutQuart"
"easeInOutQuart"
"easeInQuint"
"easeOutQuint"
"easeInOutQuint"
"easeInExpo"
"easeOutExpo"
"easeInOutExpo"
"easeInCirc"
"easeOutCirc"
"easeInOutCirc"
// CSS3缓动关键字
"ease"
"ease-in"
"ease-out"
"ease-in-out"
// CSS3 贝塞尔曲线
[ 0.17, 0.67, 0.83, 0.67 ]
// 弹簧物理缓动（spring physics）：tension最大值为500，friction 最大值为20
[ tension, friction ]
// 步骤缓动（step easings）：使动画通过指定的步骤过渡到结束值
[8]
]

//可以通过函数的形式注册自定义的缓动效果，函数将被扩展到$.Velocity.Easings对象上

// p：动画完成的百分比（十进制值）
// opts：传递到触发 .velocity() 调用的选项
// tweenDelta：补间
$.Velocity.Easings.myCustomEasing = function (p, opts, tweenDelta) {
    return 0.5 - Math.cos( p * Math.PI ) / 2;
};
```

## velocity 插件

velocity.ui.js 是 velocity.js 的 动画插件，可以用它快速创建炫酷的动画特效，它依赖于 velocity.js。有 2 个重要方法:

- $.Velocity.RunSequence()：改进嵌套的动画序列使得更易于管理
- $.Velocity.RegisterEffect()：将多个 Velocity 动画合并存储到一个自定义数组里，可以通过引用该数组的名称在项目中复用

```js
// 如果嵌套动画的嵌套层次很多时，会难以管理
$element1.velocity({ translateX: 100 }, 1000, function () {
  $element2.velocity({ translateX: 200 }, 1000, function () {
    $element3.velocity({ translateX: 300 }, 1000);
  });
});

// 将嵌套动画序列储存到一个数组里，很清晰的显示了它们的执行顺序
var mySequence = [
  { e: $element1, p: { translateX: 100 }, o: { duration: 1000 } },
  { e: $element2, p: { translateX: 200 }, o: { duration: 1000 } },
  { e: $element3, p: { translateX: 300 }, o: { duration: 1000 } },
];

// 调用这个自定义的序列名称 还可以在其他地方复用
$.Velocity.RunSequence(mySequence);

// RegisterEffect：注册自定义动画特效，以便在项目中复用
// name：动画特效名称 为字符串类型
// defaultDuration：默认动画执行时间 单位为毫秒(ms)
// calls：动画队列数组，property - 动画属性，durationPercentage - 当前动画所占总时间的百分比 (写成浮点数)，option - 选项
// reset：设置元素在动画开始时的初始值
$.Velocity.RegisterEffect(name, {
  defaultDuration: duration,
  calls: [
    [{ property: value }, durationPercentage, { options }],
    [{ property: value }, durationPercentage, { options }],
  ],
  reset: { property: value, property: value },
});

// 注册示例：
$.Velocity.RegisterEffect("callout.customPulse", {
  defaultDuration: 900,
  calls: [
    [{ scaleX: 1.5 }, 0.5],
    [{ scaleX: 1 }, 0.5],
  ],
});
// 调用
$element.velocity("callout.customPulse");

// Velocity.ui.js 内置了很多常用的动画特效，分为 callout.* 和 transition.* 两类，下面是所有的特效名：
callout.bounce;
callout.shake;
callout.flash;
callout.pulse;
callout.swing;
callout.tada;
transition.fadeIn;
transition.fadeOut;
transition.flipXIn;
transition.flipXOut;
transition.flipYIn;
transition.flipYOut;
transition.flipBounceXIn;
transition.flipBounceXOut;
transition.flipBounceYIn;
transition.flipBounceYOut;
transition.swoopIn;
transition.swoopOut;
transition.whirlIn;
transition.whirlOut;
transition.shrinkIn;
transition.shrinkOut;
transition.expandIn;
transition.expandOut;
transition.bounceIn;
transition.bounceUpIn;
transition.bounceUpOut;
transition.bounceDownIn;
transition.bounceDownOut;
transition.bounceLeftIn;
transition.bounceLeftOut;
transition.bounceRightIn;
transition.bounceRightOut;
transition.slideUpIn;
transition.slideUpOut;
transition.slideDownIn;
transition.slideDownOut;
transition.slideLeftIn;
transition.slideLeftOut;
transition.slideRightIn;
transition.slideRightOut;
transition.slideUpBigIn;
transition.slideUpBigOut;
transition.slideDownBigIn;
transition.slideDownBigOut;
transition.slideLeftBigIn;
transition.slideLeftBigOut;
transition.slideRightBigIn;
transition.slideRightBigOut;
transition.perspectiveUpIn;
transition.perspectiveUpOut;
transition.perspectiveDownIn;
transition.perspectiveDownOut;
transition.perspectiveLeftIn;
transition.perspectiveLeftOut;
transition.perspectiveRightIn;
transition.perspectiveRightOut;

// velocity.ui 新增三个可选配置项。默认情况：三个元素会同时运动
// stagger:错开，设置 300 后，每个元素会依次延迟300ms执行动画
// drag:true 最后一个元素会产生一种类似缓冲的效果
// backwards:true 元素会从最后一个开始依次延迟执行动画
$(".box-stagger").velocity("transition.slideLeftBigIn", {
  stagger: 300,
  drag: true,
  backwards: true,
});
```
