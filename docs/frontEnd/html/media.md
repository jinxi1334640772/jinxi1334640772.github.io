# 多媒体与嵌入

## audio 和 video

audio和video元素的使用方式几乎完全一致。区别：
- audio不支持width/height/poster属性，因为没有视觉部件

html中引入视频

```html
<video
  controls
  width="400"
  height="400"
  autoplay
  loop
  muted
  preload="auto"
  poster="poster.png">
  <source src="rabbit320.mp4" type="video/mp4" />
  <source src="rabbit320.webm" type="video/webm" />
  <track kind="subtitles" src="subtitles_es.vtt" srclang="es" label="Spanish" />
  <p>你的浏览器不支持此视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
```
属性解释：
- controls 是否显示视频控件
- autoplay 自动播放
- loop 循环播放
- muted 静音模式
- preload 这个属性被用来缓冲较大的文件，有三个值可选：
  - none 不缓冲文件
  - auto 页面加载后缓存媒体文件
  - metadata 仅缓冲文件的元数据
- poster 视频播放前的默认海报
- width 视频容器的宽
- height 视频容器的高

>无论宽高如何，视频都会保持它原始的长宽比——也叫做纵横比。

source标签引入视频资源，可以设置多个，视频源匹配从上到下首先支持的视频格式

每个 `<source>` 元素都含有 type 属性，这个属性是可选的，但最好添加这个属性——它包含了 `<source>` 指定的 MIME 类型，同时浏览器也会通过检查这个属性来迅速的跳过那些不支持的格式。如果你没有添加 type 属性，浏览器会尝试加载每一个文件，直到找到一个能正确播放的格式，但是这样会消耗掉大量的时间和资源。

使用track元素可以引入视频字幕文件，一般webVTT文件格式。WebVTT 是一个格式，用来编写文本文件，这个文本文件包含了众多的字符串，这些字符串会带有一些元数据，它们可以用来描述这个字符串将会在视频中显示的时间，甚至可以用来描述这些字符串的样式以及定位信息（尽管有限制）。这些字符串叫做 cue ，你可以根据不同的需求来显示不同类型的 cue，用kind属性表示，最常见的如下：
- subtitles 外语材料的翻译字幕，来帮助那些听不懂音频中说的什么的人理解音频当中的内容。
- captions 同步翻译对白，或是描述一些有重要信息的声音，来帮助那些不能听音频的人理解音频中的内容。
- 定时描述 由媒体播放器朗读的文本，其向盲人或其他视力受损用户描述重要的视觉内容。

1. srclang ：告诉浏览器你是用什么语言来编写的 subtitles
2. label： 帮助读者在查找时识别语言
一个典型的web VTT文件如下：
```vtt
WEBVTT

1
00:00:22.230 --> 00:00:24.606
第一段字幕

2
00:00:30.739 --> 00:00:34.074
第二段
...
```

## iframe 嵌入网页
属性：
- border 配置边框
- src 指向要嵌入的文档的 URL。
- width & heigth 宽高
- allowfullscreen 设置为true时，可以通过调用 `<iframe>` 的 requestFullscreen() 方法激活全屏模式。已经被重新定义为 allow="fullscreen"
- allow 配置权限策略(受限api在源上的访问性)
  - none 禁用
  - self 同源下可以使用
  - allowlist 默认值，iframe文件必须和src同源
```html
<!--任何源都阻止地理位置信息的访问-->
<iframe src="https://example.com" allow="geolocation 'none'"></iframe>
```
- sandbox 控制在 `<iframe>` 中的内容的限制。该属性的值可以为空以应用所有限制，也可以为空格分隔的标记以解除特定的限制。例如：控制是否可以提交表单、运行js等
  - allow-forms 允许嵌入浏览器的上下文提交表单
  - allow-modals 允许打开模态窗口
  - allow-orientaton-lock允许锁定屏幕方向
  - allow-popups 允许弹窗
  - allow-popups-to-escape-sandox 允许打开不继承沙箱的窗口
  - allow-same-origin 将嵌入的上下文是为同源
  - allow-scripts 允许运行脚本
  - allow-storage-access-by-user-activation 允许经过用户同意后使用Storage Access API
  - allow-top-navigation 允许导航到顶级上下文
  - allow-top-avigaton-by-user-activation 允许经过用户同意后导航到顶级上下文
  - allow-downloads-without-user-activation 不经过用户同意也可以下载文件

要想提高速度，最好在主内容完成加载后，再使用 JavaScript 设置 iframe 的 src 属性。这使你的页面可以更快可用，并减少你的官方页面加载时间

## embed 和 object元素

```html
<object data="mypdf.pdf" type="application/pdf" width="800" height="1200">
  <p>
    You don't have a PDF plugin, but you can
    <a href="mypdf.pdf">download the PDF file. </a>
  </p>
</object>

<!--等同于embed embed使用src引入文件-->
<embed src="mypdf.pdf" type="application/pdf" width="800" height="1200">
  <p>
    You don't have a PDF plugin, but you can
    <a href="mypdf.pdf">download the PDF file. </a>
  </p>
</embed>
```
属性：
- data 嵌入内容的url;embed 使用src属性
- type MIME类型
- height
- width

## SVG 是什么

SVG 是用于描述矢量图像的语言，它基于 XML。它基本上是像 HTML 一样的标记，只是它提供了许多不同的元素来定义要显示在图像中的形状，以及要应用于这些形状的效果。SVG 用于标记图形，而不是内容。SVG 定义了一些用于创建基本图形的元素，如 `<circle>` 和 `<rect>`，此外 SVG 还提供了一些复杂一些的元素如 `<path>` 和 `<polygon>`。更高级的 SVG 特性包括 `<feColorMatrix>`（使用变换矩阵转换颜色）、`<animate>`（矢量图形的动画部分）和 `<mask>`（在图像上层应用蒙版）

创建一个圆和一个矩形：
```html
<svg
  version="1.1"
  baseProfile="full"
  width="300"
  height="200"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="black" />
  <circle cx="150" cy="100" r="90" fill="blue" />
</svg>

```
矢量图像中的文本可以访问，有利于SEO。也可以很好的适应样式/脚本，因为图像的每个组件都是可以通过CSS或者通过Javascript设置样式。