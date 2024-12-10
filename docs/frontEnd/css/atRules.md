# @ 规则集

## @charset

指定样式表中使用的字符编码。它必须是样式表中的第一个元素，而前面不得有任何字符。因为它不是一个嵌套语句，所以不能在@规则条件组中使用。如果有多个 @charset 被声明，只有第一个会被使用，而且不能在 HTML 元素或 HTML 页面的字符集相关 `<style>` 元素内的样式属性内使用。

在样式表中有多种方法去声明字符编码，浏览器会按照以下顺序尝试：

1. 文件的开头的 Unicode byte-order 字符值。
2. 由 Content-Type：HTTP header 中的 charset 属性或用于提供样式表的协议中的等效值。
3. CSS @charset 声明。

```css
@charset "UTF-8";
@charset "utf-8"; /*大小写不敏感*/
@charset "iso-8859-15";
```

## @container 容器查询

根据元素容器的大小应用样式。

> 要使用容器查询，需要使用 container-type 在容器上声明一个局限上下文，将布局、样式和大小的限制应用于容器。以便浏览器知道你可能希望稍后查询此容器的尺寸。其值有：

- size 查询行向和块向尺度，
- inline-size 查询行向尺度
- normal 默认值，不是查询容器

```css
/** 通过设置container-type属性，设置局限上下文*/
.post {
  container-type: inline-size;
  /** 给局限上下文起个名字 */
  container-name: sidebar;
  /**简写语法 */
  container: sidebar / inline-size;
  /* 默认的卡片标题样式 */
  .card h2 {
    font-size: 1em;
  }
}

/* 如果sidebar上下文的容器宽度大于 700px ，则应用该样式*/
@container sidebar (min-width: 700px) {
  .card h2 {
    /**使用cpi单位，根据容器的行向尺寸设置字体大小 */
    font-size: max(1.5em, 1.23em + 2cqi);
  }
}
```

### 容器查询长度单位

使用相对于容器的长度单位的组件更灵活，不必重新计算具体长度值。

- cqw 宽度的 1%
- cqh 高度的 1%
- cqi 行向尺寸的 1%
- cqb 块向尺寸的 1%
- cqmin cqi 和 cqb 中的较小值
- cqmax cqi 和 cqb 中的较大值

下列属性可以被用作容器条件

1. aspect-ratio
2. block-size
3. inline-size
4. height
5. width
6. orientation : landscape 或者 portrait

```css
/* with an optional <container-name> */
@container tall (height > 30rem) {
  h2 {
    line-height: 1.6;
  }
}

/* multiple queries in a single condition */
@container (width > 400px) and style(--responsive: true) {
  h2 {
    font-size: 1.5em;
  }
}

/* condition list */
@container card (width > 400px), style(--responsive: true) {
  h2 {
    font-size: 1.5em;
  }
}

@container (width > 400px) or (height > 400px) {
  /* <stylesheet> */
}

@container not (width < 400px) {
  /* <stylesheet> */
}
/** 应用于容器 */
.post {
  container-name: sidebar;
  container-type: inline-size;
  /**简写形式 */
  container: sidebar / inline-size;
}
```

## @counter-style

自定义 counter 的样式。每个 @counter-style 由一个名称标识并具有一组描述符：

1. system 指定一个算法，用于将计数器的整数值转化为字符串表示。
2. negative 指定一个符号，当计数器表示的值为负的时候，把这个符号加在值的前面或后面
3. prefix 指定一个符号，加在标记表示符的前面。
4. suffix 指定一个符号，加在标记表示符的后面。
5. range 指定一个 counter-style 生效的范围
6. pad 对于大于 pad 指定值的表示符，标记会恢复为 normal。
7. fallback 定义一个备用的系统
8. symbols 定义一个符号，用于标记的表示。符号可以包含字符串，图片或自定义的识别码。这个符号怎样构建标记呢？这依赖于 system 描述符里面所定义的算法。举个例子，如果 system 的值是 fixed，那么 symbols 属性指定的固定的 N 个符号，将被用来表示计数器的前 N 个值。用完了前 N 个符号后，列表里剩下的值将使用 fallback 定义的样式来表示。
9. additive-symbols 添加的 symbols
10. speak-as 定义如何在语音识别器中读出计数器样式，比如屏幕阅读器。例如基于该描述符的值，标记符号的值可以作为有序列表的数字或者字幕作为无序列表的音频提示读出。

```css
@counter-style <counter-style-name> {
    system: <counter system>
    symbols: <counter symbols>
    additive-symbols: <additive-symbols>
    negative: <negative symbol>
    prefix: <prefix>
    suffix: <suffix>
    range: <range>
    pad: <padding>
    speak-as: <speak-as>
    fallback: <counter-style-name>
}
/**使用 counter-style 指定符号 */
@counter-style circled-alpha {
  system: fixed;
  symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
  suffix: " ";
}
/**上面的计数器样式规则在列表中可以如下使用： */
.items {
  list-style: circled-alpha;
}
```

## @font-face

为其网页指定在线字体。如果提供了 local() 函数，从用户本地查找指定的字体名称。找不到就会使用 url() 函数下载的资源

配置属性：

1. font-family 字体名字。将会被用于 font 或 font-family 属性
2. src 远程字体文件位置的 URL 或者用户计算机上的字体名称
3. font-variant 字体变体 是 font-variant-caps, font-variant-numeric, font-variant-alternates, font-variant-ligatures, font-variant-east-asian 等属性的简写
4. font-stretch 字体缩放
   1. normal 正常字体
   2. semi-condensed, condensed, extra-condensed, ultra-condensed 压缩字体
   3. semi-expanded, expanded, extra-expanded, ultra-expanded 扩展字体
   4. persentage 值， 50%——200%之间缩放比率
5. font-weight 字体粗细
6. font-style 字体样式
7. unicode-range unicode 字体范围

```css
/**两种本地字体找不到，就会用下载的字体"MgOpenModernaBold.ttf"来代替： */
@font-face {
  font-family: "Bitstream Vera Serif Bold";
  src: local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"),
    url(MgOpenModernaBold.ttf);
  font-weight: bold;
}
/**body中，使用刚定义的字体 */
body {
  font-family: "Bitstream Vera Serif Bold", serif;
}
```

## @import

用于从其他样式表导入样式规则。

> 这些规则必须先于所有其他类型的规则，@charset 规则除外; 因为它不是一个嵌套语句，@import 不能在条件组的规则中使用。

可以指定依赖媒体的 @import 规则。

```css
@import [ <url> | <string>] [ layer | layer(<layer-name>)]? <import-conditions>;

@import url;
@import url list-of-media-queries;

@import "common.css" screen, projection;
@import url("bluish.css") print, projection, tv;
@import url("chrome://communicator/skin/");
@import url("landscape.css") screen and (orientation: landscape);
```

## @keyframes

通过定义关键帧的样式来控制 CSS 动画序列中的中间步骤。和 transition 相比，关键帧 keyframes 可以控制动画序列的中间步骤。

> JavaScript 可以通过 CSS 对象模型的 CSSKeyframesRule 接口来访问 @keyframes。

每个 @keyframes 规则包含多个关键帧，每个关键帧有一个百分比值或者关键字（form，to）作为名称，代表在动画哪个阶段触发这个帧所包含的样式。

> 可以按任意顺序列出关键帧百分比；它们将按照其应该发生的顺序来处理。

```css
@keyframes identifier {
  0% {
    top: 0;
    left: 0;
  }
  30% {
    top: 50px;
  }
  68%,
  72% {
    left: 50px;
  }
  100% {
    top: 100px;
    left: 100%;
  }
}
```

## @layer CSS 级联层

同一级联层内的规则将级联在一起，增强对层叠机制的控制。

```css
/**匿名级联层：创建后无法向其添加规则外。优先级最高 */
@layer {
  p {
    margin-block: 1rem;
  }
}

@layer utilities {
  /* 创建一个名为 utilities 的级联层 */
}
/**可以通过 @import 来创建，规则存在于被引入的样式表内： */
@import (utilities.css) layer(utilities);

/**指定多个级联层的顺序，决定了级联层的优先级，越靠后优先级越高，匿名级联层优先级最高 */
@layer framework, layout, utilities;

/**级联层嵌套，并且往已存在的framework级联层添加规则*/
@layer framework {
  @layer layout {
  }
}

/**向 framework 层内部的 layout 层附加规则，只需用 . 连接这两层。 */
@layer framework.layout {
  p {
    margin-block: 1rem;
  }
}
```

## @media 媒体查询

基于媒体查询的结果来应用样式表。使用它，你可以指定一个媒体查询和一个 CSS 块，当且仅当该媒体查询与正在使用其内容的设备匹配时，该 CSS 块才能应用于该文档。

> 在 JavaScript 中，可以使用 CSSMediaRule CSS 对象模型接口访问使用 @media 创建的规则。

媒体类型（media type）描述设备的一般类别。除非使用 not 或 only 逻辑运算符，否则媒体类型是可选的，并且会（隐式地）应用 all 类型。

### CSS 中

最简单的媒体查询语法看起来是像这样的：

- 一个媒体类型，告诉浏览器这段代码应用在什么类型的媒体上。
- 一个媒体表达式，包含 CSS 生效所需的规则或者测试。
- 一组 CSS 规则，会在测试通过且媒体类型正确的时候应用该样式规则。

媒体类型：

- all ： 所有设备，不加媒体类型时默认所有设备。
- print ：打印设备
- screen ： 屏幕设备
- speech ： 语音设备

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
/**媒体朝向：竖放portrait、横放landscape */
@media (orientation: landscape) {
  body {
    color: rebeccapurple;
  }
}
/**这种特征意味着你可以测试用户是否能在一个元素上悬浮，这也基本就是说他们正在使用某种指点设备，因为触摸屏和键盘导航是没法实现悬浮的 */
@media (hover: hover) {
  body {
    color: rebeccapurple;
  }
}
/**pointer媒体特征。它可取三个值：none、fine和coarse。fine指针是类似于鼠标或者触控板的东西，它让用户可以精确指向一片小区域。coarse指针是你在触摸屏上的手指。none值意味着，用户没有指点设备，也许是他们正只使用键盘导航，或者是语音命令。 */
@media (pointer: fine) {
  body {
    color: rebeccapurple;
  }
}
/**此 CSS 将适用于任何带有彩色屏幕的设备： */
@media (color) {
}
/**如果某个功能不适用于运行浏览器的设备，则涉及该媒体功能的表达式始终为 false。例如，将不会使用嵌套在以下查询中的样式，因为没有语音专用设备具有屏幕长宽比： */
@media speech (aspect-ratio: 11/5) {
}

/**媒体查询中的“与”逻辑 */
@media screen (min-width: 400px) and (orientation: landscape) {
  body {
    color: blue;
  }
}
/**媒体查询中的“或”逻辑 */
@media screen (30em <= width <= 50em) or (orientation: landscape) {
  body {
    color: blue;
  }
}
/**媒体查询中的“非”逻辑 文本只会在朝向为竖着的时候变成蓝色。*/
@media not all and (orientation: landscape) {
  body {
    color: blue;
  }
}
/**not否定一个特性 用 or测试多个特性*/
@media (not (color)) or (hover) {
  ...;
}
```

### 外部样式

用 media= 属性为`<style>, <link>, <source>`和其他 HTML 元素指定特定的媒体类型。如：

```html
<link rel="stylesheet" src="styles.css" media="screen" />
<link rel="stylesheet" src="styles.css" media="print" />
```

### 编程方式

使用 Window.matchMedia() 和 MediaQueryList.addListener() 方法来测试和监控媒体状态。

```js
// 通过MediaQueryList 对象来查询结果、设置事件监听器、在查询结果发生变化时自动接收通知。
var mediaQueryList = window.matchMedia("(orientation: portrait)");
// 检查它的 matches 属性来获取相应的查询结果
if (mediaQueryList.matches) {
  /* 设备的旋转方向为纵向 portrait */
} else {
  /* 设备的旋转方向不是纵向，也就是横向 landscape */
}

// 定义监听器回调函数
function handleOrientationChange(evt) {
  if (evt.matches) {
  } else {
  }
}

// 先运行一次回调函数,会让监听器以目前设备的屏幕方向来初始化判定代码。换句话说，如果我们代码中设定设备处于竖屏模式，而实际上它在启动时处于横屏模式，那么我们在后面的判定就会出现矛盾。
handleOrientationChange(mediaQueryList);

// 需要持续观察查询结果值的变化情况，可以为查询列表注册监听器
mediaQueryList.addListener(handleOrientationChange);

// 不再需要接收媒体查询值变化，移除监听：
mediaQueryList.removeListener(handleOrientationChange);
```

## @namespace XML 命名空间

定义使用在 CSS 样式表中的 XML 命名空间的 @规则。定义的命名空间可以把通配、元素和属性选择器限制在指定命名空间里的元素。@namespace 规则通常在处理包含多个 namespaces 的文档时才有用，比如 HTML5 里内联的 SVG、MathML 或者混合多个词汇表的 XML。

任何 @namespace 规则都必须在所有的 @charset 和 @import 规则之后，并且在样式表中，位于其他任何 style declarations 之前。

```css
@namespace <namespace-prefix>? [ <string> | <url>];

/* 默认命名空间 */
@namespace url(XML-namespace-URL);
@namespace "XML-namespace-URL";

/* 命名空间前缀 */
@namespace prefix url(XML-namespace-URL);
@namespace prefix "XML-namespace-URL";

/**用法如下： */
@namespace url(http://www.w3.org/1999/xhtml);
@namespace svg url(http://www.w3.org/2000/svg);

/* 匹配所有的 XHTML <a> 元素，因为 XHTML 是默认无前缀命名空间 */
a {
}

/* 匹配所有的 SVG <a> 元素 */
svg|a {
}

/* 匹配 XHTML 和 SVG <a> 元素 */
*|a {
}
```

## @page 配置分页媒体

是修改打印页面的尺寸、方向和页边距。

1. margin 指定页边距。也可使用部分页边距属性 margin-top、margin-right、margin-bottom 和 margin-left。
2. page-orientation 指定文档在页面上的方向
3. size 指定页面包含块的大小和方向
4. ....等

```css
/* 针对所有页面 */
@page {
  size: 8.5in 9in;
  margin-top: 4in;
  /* 右上方的空白框显示页码 */
  @top-right {
    content: "Page " counter(pageNumber);
  }
}

/* 针对所有偶数页面 */
@page :left {
  margin-top: 4in;
}

/* 针对所有奇数页面 */
@page :right {
  size: 11in;
  margin-top: 4in;
}

/* 针对所有设置了 `page: wide;` 选择器的页面 */
@page wide {
  size: a4 landscape;
}
```

## @property 自定义属性

允许自定义 CSS 属性：

- syntax 属性类型，必选
- inherits 是否可继承，必选
- initial-value 配置属性默认值，syntax 非通用时，initial-value 必选

```css
@property --property-name {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

使用 JavaScript 中的 CSS.registerProperty 函数：

```js
window.CSS.registerProperty({
  name: "--my-color",
  syntax: "<color>",
  inherits: false,
  initialValue: "#c0ffee",
});
```

## @supports 特性查询

查询浏览器支持的 CSS 特性。

> 在 JavaScript 中，可以通过 CSS 对象模型接口 CSSSupportsRule 来访问 @supports。

```css
@supports (display: grid) {
  div {
    display: grid;
  }
}

@supports not (display: grid) {
  div {
    float: right;
  }
}
@supports (display: grid) or (not (display: inline-grid)) {
}
/**测试浏览器是否支持选择器:是否支持子组合器*/
@supports selector(A > B) {
}
/* 不支持 :is() 时的备选方案 */
@supports not selector(:is(a, b)) {
  ol > li {
  }
}

/**测试是否支持自定义属性 */
@supports (--foo: green) {
  body {
    color: var(--varName);
  }
}
```