## 兼容性问题

因为不同浏览器使用的内核不同，对同样的代码有不同的解析，造成页面显示效果不统一的效果。

- IE(Trident 内核)
- Firefox(火狐：Gecko 内核)
- Safari(苹果：webkit 内核)
- Chrome、Opera、Edge(谷歌：Blink 内核)

同一浏览器，版本越老，存在 bug 越多，相对于版本越新的浏览器，对新属性和标签、新特性支持越少。

不同浏览器，核心技术(内核)不同，标准不同，实现方式也有差异，最终呈现出来在大众面前的效果也是会有差异。

浏览器兼容性问题可分为以下三类：

- 渲染相关：和 样式 相关的问题，即体现在布局效果上的问题。
- 脚本相关：和 脚本 相关的问题，包括 JavaScript 和 DOM、BOM 方面的问题。对于某些浏览器的功能方面的特性，也属于这一类。
- 代码不规范：不按照 W3c 标准写代码，造成的问题。

## 解决兼容性问题思路

（1）渐进增强：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

（2）优雅降级：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

解决方案：

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

## CSS 兼容性问题

- 使用 normalize.css 抹平差异，同时可以定制自己的 reset.css 全局重置样式
- CSS3 兼容前缀表示:可以使用 Autoprefixer 是一个用于自动添加 CSS 浏览器前缀的 postcss 插件，可以根据 Can I Use 数据库来确定需要添加哪些前缀，以满足特定的浏览器兼容性要求。配置.browserslistrc 文件，定义需要兼容的浏览器。
- 图片加 a 标签在 IE9 中会有边框：边框设置为 0 `img{border：none}`
- IE9 以下浏览器不能使用 opacity

```css
opacity: 0.7; /*FF chrome safari opera*/
filter: alpha(opacity: 70); /*用了ie滤镜,可以兼容ie*/
```

- 鼠标指针 cursor 兼容问题：统一使用 {cursor：pointer}
- a 标签 css 状态的顺序：按照 link–visited–hover–active 的顺序编写
- 在 Chrome 中字体不能小于 12px：

```css
p {
  font-size: 12px;
  transform: scale(0.8);
}
```

## 移动端兼容性问题

- iOS 弹出各种操作窗口：-webkit-touch-callout:none
- 禁止 iOS 和 Android 用户选中文字：-webkit-user-select:none
- IOS 输入英文首字母默认大写：

```html
<input autocapitalize="off" autocorrect="off" />
```

- IOS 日期格式不支持-分割：统一用/分割 1202/12/12
- Android webview 组件弹出输入法内容不会向上滚动：js 判断 Android 设备时，弹出输入法时，手动时内容滚动输入法的高度。
- Android 下取消输入语音按钮

```css
input::-webkit-input-speech-button {
  display: none;
}
```

- 滚动条和点击高亮效果不统一

```css
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

- 在 Android 上 placeholder 文字设置行高会偏上：input 有 placeholder 情况下不要设置行高
- overflow: scroll 或 auto；在 iOS 上滑动卡顿的问题

```css
-webkit-overflow-scrolling: touch;
```
