# CSS 动画

CSS animations 从一个 CSS 样式配置转换到另一个 CSS 样式的配置。动画包括两个部分：描述动画的样式规则和用于指定动画开始、结束以及中间点样式的关键帧。

## 配置动画

animation 属性用来指定一组或多组动画，每组之间用逗号相隔。需要使用 animation 属性和其子属性，可以配置动画名称、时长、延迟时间以及其他细节。动画的实际表现有@keyframes 规则实现

animation 的子属性有：

- animation-delay 设置延时，即从元素加载完成之后到动画序列开始执行的这段时间。
- animation-direction 设置动画在每次运行完后是反向运行还是重新回到开始位置重复运行。
  - normal 正向播放，默认值
  - reverse 反向播放
  - alternate 正反交替播放
  - alternate-reverse 正反交替播放，第一次为反向播放
- animation-duraton 设置动画一个周期的时长。
- animation-iteration-count 重复次数，infinite 无限次
- animation-name 指定由@keyframes 描述的关键帧名称
- animation-play-state 设置暂停和恢复动画
  - pused 正在运行
  - running 已被停止
- animation-timing-function 运动曲线
  - ease：等同于 cubic-bezier(0.25, 0.1, 0.25, 1.0)，即默认值，表示动画在中间加速，在结束时减速。
  - linear 等同于 cubic-bezier(0.0, 0.0, 1.0, 1.0)，表示动画以匀速运动。
  - ease-in 等同于 cubic-bezier(0.42, 0, 1.0, 1.0)，表示动画一开始较慢，随着动画属性的变化逐渐加速，直至完成
  - ease-out 等同于 cubic-bezier(0, 0, 0.58, 1.0)，表示动画一开始较快，随着动画的进行逐渐减速。
  - ease-in-out 等同于 cubic-bezier(0.42, 0, 0.58, 1.0)，表示动画属性一开始缓慢变化，随后加速变化，最后再次减速变化。
  - cubic-bezier(p1, p2, p3, p4) 自定义的三次贝塞尔曲线，其中 p1 和 p3 的值必须在 0 到 1 的范围内。
  - steps(n, `<jumpterm>`) 按照 n 个定格在过渡中显示动画迭代，每个定格等长时间显示。例如，如果 n 为 5，则有 5 个步骤。动画是否在 0%、20%、40%、60% 和 80% 处或 20%、40%、60%、80% 和 100% 处暂停，或者在动画的 0% 和 100% 之间设置 5 个定格，又或是在包括 0% 和 100% 的情况下设置 5 个定格（在 0%、25%、50%、75% 和 100% 处）取决于使用以下跳跃项之一：
    - jump-start | start 表示一个左连续函数，因此第一个跳跃发生在动画开始时。
    - jump-end | end 表示一个右连续函数，因此最后一个跳跃发生在动画结束时。
    - jump-none 两端都没有跳跃。相反，在 0% 和 100% 标记处分别停留，每个停留点的持续时间为总动画时间的 1/n。
    - jump-both 在 0% 和 100% 标记处停留，有效地在动画迭代过程中添加一个步骤。
    - step-start 等同于 steps(1, jump-start)。
    - step=end 等同于 steps(1, jump-end)。
- animation-fill-mode 指定动画执行前后如何为目标元素应用样式。
  - none 动画执行前后，不会将任何关键帧样式应用于目标。这是默认值。
  - forwards 动画结束后，将保留最后一个关键帧计算值。
  - backwards 动画开始前，立即应用第一个关键帧中定义的值，并在 animation-delay 期间保留此值。
  - both 动画将遵循 forwards 和 backwards 的规则，从而在两个方向上扩展动画属性。

```CSS
/* @keyframes duration | easing-function | delay |
iteration-count | direction | fill-mode | play-state | name */
animation: 3s ease-in 1s 2 reverse both paused slidein;

/* @keyframes duration | easing-function | delay | name */
animation: 3s linear 1s slidein;

/* two animations */
animation:
  3s linear slidein,
  3s ease-out 5s slideout;
```

## 定义 keyframes 关键帧

```CSS
/**应用动画 */
p {
  animation-name: slidein;
  animation-duration: 3s;
}
/*form/to:开始和结束的关键帧 */
@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
  }
  75% {
    font-size: 300%;
    margin-left: 25%;
    width: 150%;
  }
  to {
    margin-left: 0%;
    width: 100%;
  }
}
```

## 添加动画事件监听器

```js
var e = document.getElementById("watchme");
e.addEventListener("animationstart", listener, false);
// 最后一个周期完成后，不会触发animationiteration事件，而触发animationend事件。
e.addEventListener("animationend", listener, false);
// 开始下次循环时触发
e.addEventListener("animationiteration", listener, false);
// animationstart 会在此代码执行前就会触发，这里通过设置元素的class来启动动画
e.className = "slidein";
function listener(event) {
  // animationname 动画名
  // type 动画类型animationstart|animationend|animationiteration
  // elapsedTime 动画已经执行的时间，不包含暂停时间
  // pseudoElement 动画元素时伪元素时，是`::`开头的字符串。不是伪元素为空字符串。
}
```

# CSS 过渡

CSS 过渡提供了一种在更改 CSS 属性时控制动画速度的方法。其可以让属性变化成为一个持续一段时间的，而不是立即生效的过程。通常将两个状态之间的过渡称为隐式过渡，因为开始与结束之间的状态由浏览器决定。

## 定义过渡

相关属性：

- transition-property 指定哪个或哪些 CSS 属性用于过渡。只有指定的属性才会在过渡中发生动画，其他属性仍如通常那样瞬间变化。
- transition-duration 指定过渡的时长。你可以为所有属性指定一个值，或者指定多个值，或者为每个属性指定不同的时长。
- transition-timing-function 指定一个函数，定义属性值怎么变化。参数和 animation-timing-function 一致。
- transition-delay 指定延迟，即属性开始变化时与过渡开始发生时之间的时长。
- transition 简写属性

  ```css
  div {
    transition: <property> <duration> <timing-function> <delay>;
  }
  /**同时指定多个属性过渡 */
  transition-property: opacity, left, top, height;
  /**每个属性对应的过渡时间 */
  transition-duration: 3s, 5s, 3s, 5s;
  /**简写属性 */
  transition: all 0.5s ease-out 5s;
  ```

  ## 过渡事件

- transitionstart 延迟后触发
- transitionend 结束后触发
- trasitionrun 延迟前触发

```js
el.addEventListener("transitionrun", handleTransition, true);
el.addEventListener("transitionstart", handleTransition, true);
el.addEventListener("transitionend", handleTransition, true);
function handleTransition(event) {
  // event事件属性
  // propertyName 过渡完成的CSS属性名称
  // elapsedTime 浮点数，表示事件发生时，过渡已经运行了多少时间。
}
```
