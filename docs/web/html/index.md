# HTML

## HTML 简介

HTML（HyperText Markup Language，超文本标记语言）是一种用来告知浏览器如何组织页面的标记语言。HTML 可复杂、可简单，一切取决于 web 开发者。HTML 由一系列的元素组成，这些元素可以用来包围或标记不同部分的内容，使其以某种方式呈现或者工作。两端的标签可以使内容变成超链接，以连接到另一个页面；使字体表现为斜体等

## meta 元素

> 在谷歌搜索里，在主页面链接下面，你将看到一些相关子页面——这些是站点链接，可以在 Google's webmaster tools 配置——这是一种可以使你的站点对搜索引擎更友好的方式。
> 元数据就是描述数据的数据。

> 许多 `<meta>` 特性已经不再使用。例如，keyword` <meta>` 元素（`<meta name="keywords" content="fill, in, your, keywords, here">`，为搜索引擎提供关键词，用于确定该页面与不同搜索词的相关性）已经被搜索引擎忽略了，因为作弊者填充了大量关键词到 keyword，错误地引导搜索结果。

```html
/**文档的字符编码 */
<meta charset="utf-8" />
<meta name="author" content="Chris Mills" />
<meta name="description" content="网站描述信息，在搜索引擎里会看出来" />

<!--这是一种使网站在保存到苹果设备主屏幕时显示图标的方法。你甚至可以为不同的设备提供不同的图标，以确保图标在所有设备上都看起来美观-->
<!-- 含有高分辨率 Retina 显示屏的 iPad Pro：-->
<link
  rel="apple-touch-icon"
  sizes="167x167"
  href="/apple-touch-icon-167x167.png" />
<!-- 三倍分辨率的 iPhone：-->
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="/apple-touch-icon-180x180.png" />
<!-- 没有 Retina 的 iPad、iPad mini 等：-->
<link
  rel="apple-touch-icon"
  sizes="152x152"
  href="/apple-touch-icon-152x152.png" />
<!-- 二倍分辨率的 iPhone 和其他设备：-->
<link rel="apple-touch-icon" href="/apple-touch-icon-120x120.png" />
<!-- 基本图标 -->
<link rel="icon" href="/favicon.ico" />
```

## 为文档设置主语言

HTML 文档的语言设置好了，那么你的 HTML 文档就会被搜索引擎更有效地索引（例如，允许它在特定于语言的结果中正确显示），对于那些使用屏幕阅读器的视障人士也很有用（例如，法语和英语中都有“six”这个单词，但是发音却完全不同）。

```html
<!--为文档设置语言-->
<html lang="zh-CN">
  <!--文档分段设置不同的语言-->
  <p>Japanese example: <span lang="ja">ご飯が熱い。</span>.</p>
</html>
```

## HTML 标签

- blockquote 块级应用
- q 行内引用
- abbr 缩略语
- address 包含联系方式
- sup 上标
- sub 下表
- code 标记计算机通用代码
- pre 用于保留空白字符
- var 用于标记具体变量名
- kbd 标记键盘输入
- samp 标记计算机程序的输出
- time 标记时间
  - `<time datetime="2016-01-20">2016 年 1 月 20 日</time>`
- br 换行
- hr 水平分割线
- figure 代表一段独立的内容，内容为图像、插图、图表、代码片段等
- figcaption 定义 figure 元素的标题
- col 定义一列或多列 有作为没有定义 span 属性的 `<colgroup>` 元素的子元素才有效。
- colgroup 包含 col
- data 将一个指定内容和机器可读的翻译联系在一起。`<data value='12'>中国</data>`
- datalist 包含了一组 `<option>` 元素，这些元素表示其他表单控件可选值。
- details 仅在被切换成展开状态时，它才会显示内含的信息
- summary 为 details 提供概要和标签
  - ![alt text](image.png)
- fieldset 对表单中的控制元素进行分组（也包括 label 元素）。
- legend 表示其父元素 `<fieldset>` 内容的标题。
- hgroup 代表文档标题和与标题相关联的内容，它将一个 `<h1>–<h6> 元素与一个或多个 <p> 元素组合在一起。`

```html
<hgroup>
  <h1>Frankenstein</h1>
  <p>Or: The Modern Prometheus</p>
</hgroup>
```

- map `<area>` 元素一起使用来定义一个图像映射（一个可点击的链接区域.，例如地图）。
- menu HTML 规范中被描述为 `<ul>` 的语义替代
- meter 已知范围内的标量值或分数值。
  ```html
  <meter id="fuel" min="0" max="100" low="33" high="66" optimum="80" value="50">
    at 50/100
  </meter>
  ```
- optgroup 为`<select>` 元素中的选项创建分组
- output 表示计算或用户操作的结果
- progress 显示一项任务的完成进度
  - `<progress id="file" max="100" value="70">70%</progress>
`
- search 执行搜索和过滤功能的容器
- slot web 组件内部的占位符，类似 vue 中 slot
- small 代表旁注和小字印刷（如版权和法律文本），与其样式的呈现方式无关。默认情况下，它以比其中的文本小一号的字体大小呈现
- template 是一种用于保存客户端内容机制，该内容在加载页面时不会呈现，但随后可以 (原文为 may be) 在运行时使用 JavaScript 实例化。将模板视为一个可存储在文档中以便后续使用的内容片段。虽然解析器在加载页面时确实会处理 `<template>` 元素的内容，但这样做只是为了确保这些内容有效；但元素内容不会被渲染。
- track 被当作媒体元素—`<audio>` 和` <video>`的子元素来使用。它允许指定时序文本字幕（或者基于时间的数据），例如自动处理字幕。字幕格式有 WebVTT 格式（.vtt 格式文件）— Web 视频文本字幕格式，以及指时序文本标记语言（TTML）格式。track 给媒体元素添加的数据的类型在 kind 属性中设置，属性值可以是 subtitles, captions, descriptions, chapters 或 metadata。该元素指向当用户请求额外的数据时浏览器公开的包含定时文本的源文件。一个 media 元素的任意两个 track 子元素不能有相同的 kind, srclang, 和 label 属性。

  ```html
  <video controls src="/media/cc0-videos/friday.mp4">
    <track
      default
      kind="captions"
      srclang="en"
      src="/media/examples/friday.vtt" />
    Download the
    <a href="/media/cc0-videos/friday.mp4">MP4</a>
    video, and
    <a href="/media/examples/friday.vtt">subtitles</a>.
  </video>
  ```
