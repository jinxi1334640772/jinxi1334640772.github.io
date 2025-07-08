---
title: CSS @ 规则集
description: 详细介绍 CSS 中的各种 @ 规则，包括 @charset、@container、@media、@keyframes 等的用法和示例
outline: deep
---

# CSS @ 规则集

CSS @ 规则是一些特殊的 CSS 声明，以 `@` 符号开头，用于控制 CSS 的行为。本文档详细介绍了各种 @ 规则的用法和示例。

## @charset

指定样式表中使用的字符编码。它必须是样式表中的第一个元素，而前面不得有任何字符。因为它不是一个嵌套语句，所以不能在 @规则条件组中使用。

::: info 字符编码声明顺序
浏览器会按照以下顺序尝试声明字符编码：
1. 文件开头的 Unicode byte-order 字符值
2. Content-Type HTTP header 中的 charset 属性
3. CSS @charset 声明
:::

```css
/* 大小写不敏感 */
@charset "UTF-8";
@charset "utf-8";
@charset "iso-8859-15";
```

## @container 容器查询

根据元素容器的大小应用样式。

::: tip 容器类型
要使用容器查询，需要使用 `container-type` 在容器上声明一个局限上下文：
- `size` - 查询行向和块向尺度
- `inline-size` - 查询行向尺度
- `normal` - 默认值，不是查询容器
:::

```css
.post {
  /* 给局限上下文起个名字 */
  container-name: sidebar;
  /* 通过 container-type 属性，设置局限上下文 */
  container-type: inline-size;
  /* 简写语法 */
  container: sidebar / inline-size;
}

/* 默认的卡片标题样式 */
.post .card h2 {
  font-size: 1em;
}

/* 如果 sidebar 上下文的容器宽度大于 700px，则应用该样式 */
@container sidebar (min-width: 700px) {
  .card h2 {
    /* 使用 cqi 单位，根据容器的行向尺寸设置字体大小 */
    font-size: max(1.5em, 1.23em + 2cqi);
  }
}
```

### 容器查询长度单位

使用相对于容器的长度单位的组件更灵活，不必重新计算具体长度值。

| 单位 | 描述 |
|------|------|
| `cqw` | 容器宽度的 1% |
| `cqh` | 容器高度的 1% |
| `cqi` | 容器行向尺寸的 1% |
| `cqb` | 容器块向尺寸的 1% |
| `cqmin` | `cqi` 和 `cqb` 中的较小值 |
| `cqmax` | `cqi` 和 `cqb` 中的较大值 |

### 容器查询条件

下列属性可以被用作容器条件：

- `width` - 宽度
- `height` - 高度
- `aspect-ratio` - 宽高比
- `block-size` - 块向尺寸
- `inline-size` - 行向尺寸
- `orientation` - 方向（`landscape` | `portrait`）

```css
/* 可选的 <container-name> */
@container tall (height > 30rem) {
  h2 {
    line-height: 1.6;
  }
}

/* 多个查询条件 and */
@container (width > 400px) and style(--responsive: true) {
  h2 {
    line-height: 1.6;
  }
}

/* 或 or */
@container card (width > 400px), style(--responsive: true) {
  h2 {
    line-height: 1.6;
  }
}

@container (width > 400px) or (height > 400px) {
  h2 {
    line-height: 1.6;
  }
}

/* 非 not */
@container not (width < 400px) {
  h2 {
    line-height: 1.6;
  }
}

/* 应用于容器 */
.post {
  container-name: sidebar;
  container-type: inline-size;
  container: sidebar / inline-size; /* 简写形式 */
}
```

## @counter-style

CSS 计数器是由 CSS 维护的变量，这些变量可能根据 CSS 规则跟踪使用次数以递增或递减。

::: warning 注意
计数器只能在可以生成盒子的元素中使用。例如，如果一个元素被设置为 `display: none`，那么在这个元素上的任何计数器操作都会被忽略。
:::

每个 `@counter-style` 由一个名称标识并具有一组描述符：

```css
@counter-style <counter-style-name> {
  system: <counter system>; /* 算法，用于将计数器的整数值转化为字符串表示 */
  symbols: <counter symbols>; /* 定义一个符号，用于标记的表示 */
  additive-symbols: <additive-symbols>; /* 添加的 symbols */
  negative: <negative symbol>; /* 符号，当计数器为负，加在值的前或后 */
  prefix: <prefix>; /* 符号，加在标记表示符的前面 */
  suffix: <suffix>; /* 符号，加在标记表示符的后面 */
  range: <range>; /* counter-style 生效的范围 */
  pad: <padding>; /* 大于 pad 指定值的表示符，标记会恢复为 normal */
  speak-as: <speak-as>; /* 如何在语音识别器中读出计数器样式 */
  fallback: <counter-style-name>;
}
```

### 使用示例

```css
/* 使用 counter-style 定义计数器符号 */
@counter-style circled-alpha {
  system: fixed;
  symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
  suffix: " ";
}

/* 使用定义的计数器 */
.items {
  list-style: circled-alpha;
}

/* section 计数器的初始值指定为 3，topic 计数器初始化为默认值 0 */
.container {
  counter-reset: section 3 topic;
}

/* 创建名为 section 的反向计数器(递减) 默认初始值可以自动根据元素数量生成 */
.container {
  counter-reset: reversed(section);
}

/* 将计数器设置为给定值。元素上没有给定名称的计数器时，才会创建新计数器 */
.container {
  counter-set: counter1 1 counter2 4;
}

/* 指定 section 计数器每次递增 2 */
.container {
  counter-increment: section 2;
}

/* 使用 counter() 和 counters() 显示计数器 */
h3::before {
  counter-increment: section;
  /* counter(counterName, counterStyle) 不需要包含父级上下文的编号 1 */
  content: "Section " counter(section) ": ";
  /* counters(counterName, separator, counterStyle) 需要包含父级上下文的编号 1.2 */
  /* separator：分隔符，默认点号 `.` 分隔 */
  /* counterStyle：默认 decimal，和 list-style-type 一致 */
  content: "Section " counters(section, ".") ": ";
}
```

## @font-face

为网页指定在线字体。如果提供了 `local()` 函数，则从本地查找指定的字体名称。找不到就会使用 `url()` 函数下载的资源。

### 配置属性

| 属性 | 描述 |
|------|------|
| `font-family` | 字体名字，将会被用于 font 或 font-family 属性 |
| `src` | 本地 `local()` 或者远程 `url()` 字体文件位置的 URL |
| `font-variant` | 字体变体，是多个 font-variant-* 属性的简写 |
| `font-stretch` | 字体缩放 |
| `font-weight` | 字体粗细 |
| `font-style` | 字体样式 |
| `unicode-range` | Unicode 字体范围 |

```css
/* 自定义字体 */
@font-face {
  font-family: "Bitstream Vera";
  /* 两种本地字体找不到，就会用 url() 下载的字体 */
  src: local("Helvetica Neue Bold"), 
       local("HelveticaNeue-Bold"),
       url(MgOpenModernaBold.ttf);
  font-weight: bold;
  font-style: italic;
  font-stretch: normal;
  font-variant: normal;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA;
}

/* 使用自定义字体 */
body {
  font-family: "Bitstream Vera", serif;
}
```

## @import

用于从其他样式表导入样式规则。

::: warning 注意
这些规则必须先于所有其他类型的规则，@charset 规则除外；因为它不是一个嵌套语句，@import 不能在条件组的规则中使用。
:::

```css
@import [ <url> | <string> ] [ layer | layer(<layer-name>) ]? <import-conditions>;

@import url;
@import url list-of-media-queries;

@import "common.css" screen, projection;
@import url("bluish.css") print, projection, tv;
@import url("chrome://communicator/skin/");
@import url("landscape.css") screen and (orientation: landscape);
```

## @keyframes

通过定义关键帧的样式来控制 CSS 动画序列中的中间步骤。和 `transition` 相比，关键帧 `keyframes` 可以控制动画序列的中间步骤。

::: tip 提示
JavaScript 可以通过 CSS 对象模型的 `CSSKeyframesRule` 接口来访问 @keyframes。
:::

每个 `@keyframes` 规则包含多个关键帧，每个关键帧有一个百分比值或者关键字（`from`，`to`）作为名称，代表在动画哪个阶段触发这个帧所包含的样式。

```css
@keyframes identifier {
  0% {
    top: 0;
    left: 0;
  }
  30% {
    top: 50px;
  }
  68%, 72% {
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
/* 匿名级联层：创建后无法向其添加规则。优先级最高 */
@layer {
  p {
    margin-block: 1rem;
  }
}

/* 创建一个名为 utilities 的级联层 */
@layer utilities {
  .text-center {
    text-align: center;
  }
}

/* 通过 @import 引入外部样式来创建 */
@import (utilities.css) layer(utilities);

/* 指定多个级联层的顺序，决定了级联层的优先级，越靠后优先级越高，匿名级联层优先级最高 */
@layer framework, layout, utilities;

/* 级联层嵌套 */
@layer framework {
  @layer layout {
    .container {
      max-width: 1200px;
    }
  }
}

/* 向 framework 层内部的 layout 层附加规则 */
@layer framework.layout {
  p {
    margin-block: 1rem;
  }
}
```

## @media 媒体查询

基于媒体查询的结果来应用样式表。使用它，你可以指定一个媒体查询和一个 CSS 块，当且仅当该媒体查询与正在使用其内容的设备匹配时，该 CSS 块才能应用于该文档。

::: info JavaScript 访问
在 JavaScript 中，可以使用 `CSSMediaRule` CSS 对象模型接口访问使用 @media 创建的规则。
:::

### 媒体类型

| 类型 | 描述 |
|------|------|
| `all` | 所有设备（默认值） |
| `print` | 打印设备 |
| `screen` | 屏幕设备 |
| `speech` | 语音设备 |

### CSS 中的媒体查询

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}

/* 媒体朝向：竖放 portrait、横放 landscape */
@media (orientation: landscape) {
  body {
    color: rebeccapurple;
  }
}

/* 测试用户是否能在一个元素上悬浮 */
@media (hover: hover) {
  body {
    color: rebeccapurple;
  }
}

/* pointer 媒体特征。它可取三个值：none、fine 和 coarse */
/* fine 指针是类似于鼠标或者触控板 */
/* coarse 指针是触摸屏上的手指 */
/* none 意味着用户没有指点设备，也许是键盘导航、语音命令 */
@media (pointer: fine) {
  body {
    color: rebeccapurple;
  }
}

/* 带有彩色屏幕的设备 */
@media (color) {
  body {
    color: red;
  }
}

/* 媒体查询中的"与"逻辑 */
@media screen and (min-width: 400px) and (orientation: landscape) {
  body {
    color: blue;
  }
}

/* 媒体查询中的"或"逻辑 */
@media screen and (30em <= width <= 50em), (orientation: landscape) {
  body {
    color: blue;
  }
}

/* 媒体查询中的"非"逻辑 文本只会在朝向为竖着的时候变成蓝色 */
@media not all and (orientation: landscape) {
  body {
    color: blue;
  }
}

/* not 否定一个特性 用 or 测试多个特性 */
@media (not (color)) or (hover) {
  body {
    color: green;
  }
}
```

### 外部样式

用 `media=` 属性为 `<style>`、`<link>`、`<source>` 和其他 HTML 元素指定特定的媒体类型：

```html
<link rel="stylesheet" src="styles.css" media="screen" />
<link rel="stylesheet" src="styles.css" media="print" />
```

### 编程方式

使用 `Window.matchMedia()` 和 `MediaQueryList.addListener()` 方法来测试和监控媒体状态：

```javascript
// 通过 MediaQueryList 对象来查询结果、设置事件监听器
var mediaQueryList = window.matchMedia("(orientation: portrait)");

// 检查它的 matches 属性来获取相应的查询结果
if (mediaQueryList.matches) {
  /* 设备的旋转方向为纵向 portrait */
} else {
  /* 设备的旋转方向为横向 landscape */
}

// 定义监听器回调函数
function handleOrientationChange(evt) {
  if (evt.matches) {
    // 处理纵向
  } else {
    // 处理横向
  }
}

// 先运行一次回调函数，让监听器以目前设备的屏幕方向来初始化判定代码
handleOrientationChange(mediaQueryList);

// 需要持续观察查询结果值的变化
mediaQueryList.addListener(handleOrientationChange);

// 不再需要接收媒体查询值变化，移除监听
mediaQueryList.removeListener(handleOrientationChange);
```

## @namespace XML 命名空间

定义使用在 CSS 样式表中的 XML 命名空间。选择器限制在指定命名空间里的元素。比如 HTML5 里内联的 SVG。

::: warning 注意
任何 @namespace 规则都必须在所有的 @charset 和 @import 规则之后，其他任何样式声明之前。
:::

```css
@namespace <namespace-prefix>? [ <string> | <url> ];

/* 默认命名空间 */
@namespace url(XML-namespace-URL);
@namespace "XML-namespace-URL";

/* 命名空间前缀 */
@namespace prefix url(XML-namespace-URL);
@namespace prefix "XML-namespace-URL";
```

### 使用示例

```css
@namespace url(http://www.w3.org/1999/xhtml);
@namespace svg url(http://www.w3.org/2000/svg);

/* 匹配所有的 XHTML <a> 元素，因为 XHTML 是默认无前缀命名空间 */
a {
  color: blue;
}

/* 匹配所有的 SVG <a> 元素 */
svg|a {
  color: red;
}

/* 匹配 XHTML 和 SVG <a> 元素 */
*|a {
  text-decoration: none;
}
```

## @page 配置分页媒体

修改打印页面的尺寸、方向和页边距。

### 主要属性

| 属性 | 描述 |
|------|------|
| `margin` | 指定页边距，也可使用部分页边距属性 |
| `page-orientation` | 指定文档在页面上的方向 |
| `size` | 指定页面包含块的大小和方向 |

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

定义自定义 CSS 属性的语法、继承行为和初始值。

```css
@property --property-name {
  syntax: "<color>"; /* 属性类型，必选 */
  inherits: false; /* 是否可继承，必选 */
  initial-value: #c0ffee; /* 属性默认值，syntax 非通用时必选 */
}
```

### JavaScript 方式

使用 JavaScript 中的 `CSS.registerProperty` 函数：

```javascript
window.CSS.registerProperty({
  name: "--my-color",
  syntax: "<color>",
  inherits: false,
  initialValue: "#c0ffee",
});
```

## @supports 特性查询

查询浏览器支持的 CSS 特性。

::: info JavaScript 访问
在 JavaScript 中，可以通过 CSS 对象模型接口 `CSSSupportsRule` 来访问 @supports。
:::

```css
/* 支持 Grid 布局时 */
@supports (display: grid) {
  div {
    display: grid;
  }
}

/* 不支持 Grid 布局时 */
@supports not (display: grid) {
  div {
    float: right;
  }
}

/* 或逻辑 */
@supports (display: grid) or (not (display: inline-grid)) {
  div {
    display: block;
  }
}

/* 测试浏览器是否支持选择器：是否支持子组合器 */
@supports selector(A > B) {
  /* 样式规则 */
}

/* 不支持 :is() 时的备选方案 */
@supports not selector(:is(a, b)) {
  ol > li {
    color: red;
  }
}

/* 测试是否支持自定义属性 */
@supports (--foo: green) {
  body {
    color: var(--varName);
  }
}
```

## 总结

CSS @ 规则为我们提供了强大的控制能力：

- **@charset** - 字符编码控制
- **@container** - 容器查询响应式设计
- **@media** - 媒体查询适配不同设备
- **@keyframes** - 动画关键帧定义
- **@supports** - 特性查询渐进增强
- **@layer** - 级联层控制样式优先级
- **@font-face** - 自定义字体加载
- **@import** - 样式表导入
- **@namespace** - XML 命名空间
- **@page** - 打印页面配置
- **@property** - 自定义属性定义
- **@counter-style** - 自定义计数器样式

这些 @ 规则让 CSS 更加强大和灵活，能够应对各种复杂的样式需求。
