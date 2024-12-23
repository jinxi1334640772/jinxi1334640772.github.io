## 兼容性问题

因为不同浏览器使用的内核不同，对同样的代码有不同的解析，造成页面显示效果不统一的效果。

- IE(Trident 内核)
- Firefox(火狐：Gecko 内核)
- Safari(苹果：webkit 内核)
- Chrome、Opera、Edge(谷歌：Blink 内核)

同一浏览器，版本越老，存在 bug 越多，相对于版本越新的浏览器，对新属性和标签、新特性支持越少。

不同浏览器，核心技术(内核)不同，标准不同，实现方式也有差异，最终呈现出来在大众面前的效果也是会有差异。浏览器兼容性问题可分为以下三类

- 渲染相关：和 样式 相关的问题，即体现在布局效果上的问题。
- 脚本相关：和 脚本 相关的问题，包括 JavaScript 和 DOM、BOM 方面的问题。对于某些浏览器的功能方面的特性，也属于这一类。
- 代码不规范：不按照 W3c 标准写代码，造成的问题。

## 解决兼容性问题思路

- 渐进增强：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

- 优雅降级：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

解决方案

- 选择通用技术框架/库(如 jquery Vue React)：再内部已经解决了大部分兼容性问题。
- 选择兼容工具： html5shiv 、 Respond.js 、 CSS Reset 、 normalize.css 、 Modernizr.js 、 postcss 。
- 条件注释、 CSS Hack 、 修补 js 能力检测。
- 用户更新高版本浏览器。

推荐https://caniuse.com/这个查询网站。它是一个针对前端开发人员定制的一个查询CSS、JS、HTML5、SVG在主流浏览器中特性和兼容性的网站，可以很好的保证网页在浏览器中的兼容性。
题

## js 兼容问题

老版本浏览器不支持 ES6 语法。使用 babel（Babel 是一种工具链，主要用于将 ECMAScript 2015+代码转换为当前和旧版浏览器或环境中的向后兼容版本的 JavaScript）。但是 Babel 默认只转换新的 JavaScript 语法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。

### IE 兼容性问题

```js
// IE8以上使用attachEvent添加事件处理器
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) { // W3C标准
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent) { // IE
    var r = elm.attachEvent('on' + evType, fn); // IE5+
    return r;
  } else {
    elm['on' + evType] = fn; // DOM事件
  }
}

// 阻止冒泡的兼容
function(event){
  if (event.stopPropagation) {
	event.stopPropagation()
} else {
	event.cancelBubble = true
 }
}

//阻止默认行为的兼容
function(event) {
  // 执行自定义逻辑
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  return false;
};

//滚动事件的兼容
scrollTop = document.documentElement.scrollTop || document.body.scrollTop

// IE 只能使用 var 关键字来定义常量，

//E下，event 对象有 x、y 属性，但是没有 pageX、pageY属性
var myX = event.x ? event.x : event.pageX;
var myY = event.y ? event.y : event.pageY;

// 用CSS禁止选取网页内容，在IE需要用JS禁止
user-select: none;
obj.onselectstart = function {return false;} // IE
```

- 图片变化 base64 格式之后，再添加查询字符串，会报错
- 移动端更改同名图片无法清除缓存。所以，还是要在图片命名上做文章

## CSS 兼容性问题

- 使用 `normalize.css`抹平差异，同时可以定制自己的 `reset.css` 全局重置样式
- CSS3 兼容前缀表示:可以使用 Autoprefixer 是一个用于自动添加 CSS 浏览器前缀的 postcss 插件，可以根据 Can I Use 数据库来确定需要添加哪些前缀，以满足特定的浏览器兼容性要求。配置`.browserslistrc` 文件，定义需要兼容的浏览器。
- 图片加 a 标签在 IE9 中会有边框：边框设置为 0 `img{border：none}`
- IE9 以下浏览器不能使用 opacity

```css
opacity: 0.7; /*FF chrome safari opera*/
filter: alpha(opacity: 70); /*用了ie滤镜,可以兼容ie*/
```

- 鼠标指针 cursor 兼容问题：统一使用 `{cursor：pointer}`
- a 标签 css 状态的顺序：按照 `link–visited–hover–active` 的顺序编写
- 在 Chrome 中字体不能小于 12px

```css
p {
  font-size: 12px;
  transform: scale(0.8);
}
```

## 移动端兼容性问题

### IOS

- 部分设备切换横竖屏时，会缩放字体

```css
/* iOS 禁止弹出各种操作窗口 */
-webkit-touch-callout:none

/* 禁止 iOS 和 Android 用户选中文字： */
-webkit-user-select:none

/* 部分手机上，切换横竖屏时，会缩放字体。禁止文字缩放 */
-webkit-text-size-adjust:100%;

/* 可以用来控制字体的像素显示是否平滑 */
/* 关闭抗锯齿，字体边缘犀利。 */
-webkit-font-smoothing:none
/* 字体像素级平滑，在深色背景上会让文字看起来更细了 */
-webkit-font-smoothing:antialiased
/* 字体亚像素级平滑，主要为了在非视网膜设备下更好的显示 */
-webkit-font-smoothing:subpixel-antialiased;
```

- IOS 输入英文首字母默认大写，并且默认自动保存：

```html
<!-- 通过设置autocapitalize="off"关闭首字母大写 -->
<!-- 使用autocomplete="off"属性关闭自动保存 -->
<input autocapitalize="off" autocomplete="off" autocorrect="off" />
```

- IOS 日期格式不支持-分割：统一用/分割 1202/12/12
- overflow: scroll 或 auto；在 iOS 上滑动卡顿的问题

```css
/* 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文 */
-webkit-overflow-scrolling: touch;
/* auto 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止 */
```

- 上拉边界下拉出现空白

```js
document.body.addEventListener(
  "touchmove",
  function (e) {
    if (e._isScroller) return;
    // 阻止默认事件
    e.preventDefault();
  },
  {
    passive: false,
  }
);
```

- 弹出键盘，弹出层被顶上去，光标还停留在原处

```js
$("input.van-field__control, textarea.van-field__control").blur(function () {
  setTimeout(function () {
    var currentPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    window.scrollTo(0, currentPosition); //页面向上滚动
  }, 200);
});

//多个Input/textarea
$(function () {
  var setTimerTop = 0;
  $(document)
    .on(
      "blur",
      "input.van-field__control, textarea.van-field__control",
      function () {
        event.preventDefault();
        setTimerTop = setTimeout(function () {
          window.scrollBy(0, 5); // 页面向上滚动
          window.scrollBy(0, -5);
        }, 500);
      }
    )
    .on(
      "focus",
      "input.van-field__control, textarea.van-field__control",
      function () {
        clearTimeout(setTimerTop);
      }
    );
});

//iframe情况
$(function () {
  var setTimerTop = 0;
  $(document)
    .on(
      "blur",
      "input.van-field__control, textarea.van-field__control",
      function () {
        event.preventDefault();
        setTimerTop = setTimeout(function () {
          parent.scrollBy(0, 5); // 页面向上滚动
          parent.scrollBy(0, -5);
          $("#hide-area-cb").focus();
        }, 500);
      }
    )
    .on(
      "focus",
      "input.van-field__control, textarea.van-field__control",
      function () {
        clearTimeout(setTimerTop);
      }
    )
    .on("focus", "input.van-field__control[disabled]", function () {
      setTimerTop = setTimeout(function () {
        parent.scrollBy(0, 5); // 页面向上滚动
        parent.scrollBy(0, -5);
      }, 500);
    });
});
```

- 软键盘唤起，页面 fixed 元素失效

```html
<style>
  .warper {
    position: absolute;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* <!-- 不让页面滚动，而是让主体部分自己滚动 --> */
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
<div class="warper">
  <div class="main"></div>
  <div class="bottom"></div>
</div>
```

- iOS 闪屏问题

```css
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

- input 获取焦点时会放大
- IOS9+系统下，使用 Viewport 元标记"width=device-width"会导致页面缩小以适应溢出视口边界的内容。可以通过添加"shrink-to-fit=no"到 meta 标签来覆盖此行为，增加的值将阻止页面缩放以适应视口

```html
<!-- meta设置user-scalable=no，可取消放大效果.仍然无法阻止页面整体的缩放 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no" />
```

- input 域只显示底边框时，会出现两个底部底边圆角效果。设置 border-radius:0 即可
- 设置 height:100%，如果父级的 flex 值为 1，而没有设置具体高度，则 100%高度设置无效:在父级通过计算来设置具体高度 height，如 height: calc(100% - 100px)

### Android

- 视频没有播放的情况下，双击进度条快进导致 video 无法播放：添加蒙层
- chrome video 属性返回 Infinity：设置 currentTime 大于实际的 duration

```vue
<template>
  <div class="video_box">
    <!-- 解决方法：添加一个蒙层，点击蒙层就播放视频 -->
    <div class="cover" @click.stop.prevent="play" v-if="!played"></div>

    <!-- 
      preload="auto" /* 这个属性规定页面加载完成后载入视频*/
      controls /* 设置是否显示播放器控件(如播放/暂停等) */
      loop="loop" /* 设置或返回视频是否应在结束时再次播放 */
      webkit-playsinline="true"  /* 针对ios9不全屏播放 */
      playsinline="true"  /* 针对ios10、11不全屏播放 */
      /* 启用X5内核同层渲染:视频全屏的时候，div可以呈现在视频层上 */
      x5-video-player-type="h5-page"
      /* 播放器方向，landscape横屏，portraint竖屏，默认值为竖屏 */
      x5-video-orientation="portraint" 
      /* 全屏设置，设置为 true 是防止横屏 */
      x5-video-player-fullscreen="true" 
       /* 设置X5内核为行内播放模式，不能和`x5-video-player-type同时设置会覆盖 */
      x5-playsinline="true" 
      x-webkit-airplay="true" /* 默认不全屏播放 */
     -->

    <video
      :src="src"
      :poster="poster"
      :id="`videoElement`"
      controls
      playsinline
      webkit-playsinline
      webkit-inline
      x5-video-ignore-metadata="true" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    poster: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      played: false,
      video: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.video = document.getElementById(`videoElement`);
      this.video.addEventListener("loadedmetadata", () => {
        if (this.video.duration === Infinity) {
          // 设置currentTime大于实际的duration，就可以获取video属性了
          this.video.currentTime = 1e101;
          this.video.addEventListener(
            "timeupdate",
            () => {
              console.log("after workaround:", this.video.duration);
              this.video.currentTime = 0;
            },
            { once: true }
          );
        }
      });

      // 获取总时长
      this.video.addEventListener("durationchange", event => {
        console.log(this.video.duration);
        // Infinity
      });

      // 监听缓存进度
      var videoCanskip = 0;
      // 对延迟比较高要求的，可以通过监控 progress 来达到效果
      this.video.addEventListener("progress", function (event) {
        // 返回表示音频/视频已缓冲部分的 TimeRanges 对象。
        var startBuffered = this.video.buffered.start(0);
        var endBuffered = this.video.buffered.end(0);
        videoCanskip = parseInt(endBuffered - startBuffered);
        console.log("video_可快进时长", videoCanskip);
        // 设置currentTime 值 来播放最新内容。注意要控制好频率与快进时长，要不然会导致一直loading加载新的TS片段
        player.currentTime = videoCanskip;
      });
    });
  },
  methods: {
    play() {
      this.video.play();
      this.played = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.video_box {
  position: relative;
  width: 100%;
  height: 194px;
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
```

- Android 下取消输入语音按钮

```css
input::-webkit-input-speech-button {
  display: none;
}

/* 设置placeholder的颜色 */
::placeholder {
  color: #fff;
}

/* 清除按钮圆角 */
input,
button {
  -webkit-appearance: none;
  border-radius: 0;
}
```

- 在 Android 上 placeholder 文字设置行高会偏上：input 有 placeholder 情况下不要设置行高
- input 域处于焦点状态时，默认会有一圈淡黄色的轮廓 outline 效果：通过设置 outline:none 可将其去除
- 1 像素边框问题：由于 retina 屏的原因，1px 的 border 会显示成两个物理像素

```css
/* CSS3 渐变背景:可以通过渐变背景实现 1px 的 border，实现原理是设置 1px 的渐变背景，50% 有颜色，50% 是透明的 */
@mixin commonStyle() {
  background-size: 100% 1px, 1px 100%, 100% 1px, 1px 100%;
  background-repeat: no-repeat;
  background-position: top, right top, bottom, left top;
}
@mixin border($border-color) {
  @include commonStyle();
  background-image: linear-gradient(
      180deg,
      $border-color,
      $border-color 50%,
      transparent 50%
    ), linear-gradient(
      270deg,
      $border-color,
      $border-color 50%,
      transparent 50%
    ), linear-gradient(0deg, $border-color, $border-color 50%, transparent 50%),
    linear-gradient(90deg, $border-color, $border-color 50%, transparent 50%);
}

/* 伪类 + transform:实现原理是用伪元素高度设置为1px，然后用 transform缩小到原来的一半 */
div {
  position: relative;
  &::after {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    transform: scaleY(0.5);
    content: "";
  }
}
```

## HTML 识别规则

```html
<a href="tel:0755-10086">打电话给:0755-10086</a>
<a href="sms:10086">发短信给: 10086</a>
<a href="mailto:peun@foxmail.com">peun@foxmail.com</a>

<a
  href="iosamap://viewMap?sourceApplication=yukapril&poiname=国宏宾馆&lat=39.905592&lon=116.33604&dev=0"
  >跳转高德地图</a
>
<a
  href="androidamap://viewMap?sourceApplication=yukapril&poiname=国宏宾馆&lat=39.905592&lon=116.33604&dev=0"
  >跳转高德地图</a
>

<!-- 禁止识别电话号码、邮箱、地址 -->
<meta name="format-detection" content="telephone=no,email=no,address=no" />

<!-- 网页会被搜索引擎忽略 -->
<meta name="robots" content="none" />
robots(网页搜索引擎索引方式)：对应一组使用逗号(,)分割的值，通常取值：
none：搜索引擎将忽略此网页，等同于noindex，nofollow；
noindex：搜索引擎不索引此网页；nofollow：搜索引擎不继续通过此网页的链接索引搜索其它的网页；
all：搜索引擎将索引此网页与继续通过此网页的链接索引，等同于index，follow；
index：搜索引擎索引此网页；follow：搜索引擎继续通过此网页的链接索引搜索其它的网页；

<!-- 在IOS下，在head元素底部，使用下列代码可以实现添加到主屏幕的功能 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="Weather PWA" />
<link rel="apple-touch-icon" href="images/icons/icon-152x152.png" />

<!-- 【QQ浏览器】 -->
// 全屏模式
<meta name="x5-fullscreen" content="true">
// 强制竖屏
<meta name="x5-orientation" content="portrait">
// 强制横屏
<meta name="x5-orientation" content="landscape">
// 应用模式
<meta name="x5-page-mode" content="app">

<!-- 【UC浏览器】 -->
// 全屏模式
<meta name="full-screen" content="yes">
// 强制竖屏
<meta name="screen-orientation" content="portrait">
// 强制横屏
<meta name="screen-orientation" content="landscape">
// 应用模式
<meta name="browsermode" content="application">
```
