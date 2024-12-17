## animate.css

是一个使用 CSS3 的 animation 制作的动画效果的 CSS 集合，里面预设了很多种常用的动画，且使用非常简单。它把不同的动画绑定到了不同的类里，所以想要使用哪种动画，只需要把通用类 animated 和相应的类添加到元素上就行了

主要包括:

- Attention(晃动效果)、
  - bounce：弹跳
  - flash：闪光
  - pulse：脉搏
  - rubberBand：橡皮圈
  - shake：摇动
  - headShake：摇头
  - swing：摇摆
  - tada：波动
  - wobble：摆动
  - jello：凝胶物
- bounce(弹性缓冲效果)、
  - bounceIn：跳入
  - bounceInDown：向下跳入
  - bounceInLeft：从左侧跳入
  - bounceInRight：从右侧跳入
  - bounceInUp：向上跳入
  - bounceOut：跳出
  - bounceOutDown：向下跳出
  - bounceOutLeft：向左跳出
  - bounceOutRight：向右跳出
  - bounceOutUp：向上跳出
- fade(透明度变化效果)、
  - fadeIn：淡入
  - fadeInDown：向下淡入
  - fadeInDownBig：向下大幅度淡入
  - fadeInLeft：从左侧淡入
  - fadeInLeftBig：从左侧大幅度淡入
  - fadeInRight：从右侧淡入
  - fadeInRightBig：从右侧大幅度淡入
  - fadeInUp：：向上淡入
  - fadeInUpBig：向上大幅度淡入
  - fadeOut
  - fadeOutDown
  - fadeOutDownBig
  - fadeOutLeft
  - fadeOutLeftBig
  - fadeOutRight
  - fadeOutRightBig
  - fadeOutUp
  - fadeOutUpBig
- flip(翻转效果)、
  - flip：翻转
  - flipInX：沿 X 轴翻转
  - flipInY：沿 Y 轴翻转
  - flipOutX：沿 X 轴翻出
  - flipOutY：沿 Y 轴翻出
- rotate(旋转效果)、
  - rotateIn：转入
  - rotateInDownLeft：从左侧向下转入
  - rotateInDownRight：从右侧向下转入
  - rotateInUpLeft：从左侧向上转入
  - rotateInUpRight：从右侧向上转入
  - rotateOut
  - rotateOutDownLeft
  - rotateOutDownRight
  - rotateOutUpLeft
  - rotateOutUpRight
- slide(滑动效果)、
  - slideInDown：向下滑入
  - slideInLeft：从左侧滑入
  - slideInRight：从右侧滑入
  - slideInUp：向上滑入
  - slideOutDown
  - slideOutLeft
  - slideOutRight
  - slideOutUp
- zoom(变焦效果)、
  - zoomIn：放大进入
  - zoomInDown：放大向下进入
  - zoomInLeft：放大从左侧进入
  - zoomInRight：放大从右侧进入
  - zoomInUp：放大向上进入
  - zoomOut：缩小离开
  - zoomOutDown：缩小向下离开
  - zoomOutLeft：缩小向左离开
  - zoomOutRight：缩小向右离开
  - zoomOutUp：缩小向上离开
- special(特殊效果)
  - hinge：转轴离开
  - rollIn：转入
  - rollOut：转出
  - lightSpeedIn：倾斜淡入
  - lightSpeedOut：倾斜淡出

## 使用

```bash
# 安装依赖
npm install animate.css

# 或者使用CDN引入
https://unpkg.com/animate.css@3.5.2/animate.min.css
```

通过 JS 添加或删除 class，可以实现动态效果

```html
<style>
  .box {
    height: 100px;
    width: 100px;
    background-color: lightblue;
  }
  .infinite {
    animation-iteration-count: infinite;
  }
</style>

<div class="animated bounce"></div>
<div class="animated flash"></div>

<button id="btn1">添加</button>
<button id="btn2">移除</button>
<div id="box" class="animated"></div>

<script>
  var oBtn1 = document.getElementById("btn1");
  var oBtn2 = document.getElementById("btn2");
  var oBox = document.getElementById("box");

  oBtn1.onclick = function () {
    oBox.classList.add("flash");

    // 自定义动画过程：使动画循环
    oBox.classList.add("infinite");
  };
  oBtn2.onclick = function () {
    oBox.classList.remove("flash");
  };
</script>
```
