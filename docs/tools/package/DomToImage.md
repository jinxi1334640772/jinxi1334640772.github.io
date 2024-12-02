## dom-to-image 
dom-to-image 是一个基于 JavaScript 的库，它可以将任意的 DOM 节点转换为矢量（SVG）或光栅（PNG 或 JPEG）图像。这个库是基于 Paul Bakaus 的 domvas 项目重新编写的，修复了一些 bug 并添加了一些新功能，如 Web 字体和图像支持。

主要功能
- DOM 节点转换：将任意 DOM 节点转换为图像。
- 支持多种格式：生成 PNG、JPEG 和 SVG 格式的图像。
- Web 字体支持：自动处理和嵌入 Web 字体。
- 图像嵌入：自动嵌入 `<img>` 元素和 CSS 背景图像。

有几个相似的库：
- FileSaver.js 是一个用于在客户端保存文件的库，常与 dom-to-image 结合使用，以便在生成图像后立即下载
- html2canvas 是另一个流行的库，用于将 DOM 节点转换为图像，生成的图片有时候会发生dom错位。虽然功能与 dom-to-image 类似，但它使用不同的技术实现。dom-to-image使用下来，暂时没有发现什么问题。
- Canvas2Image 是一个用于将 HTML5 Canvas 元素转换为图像的库，适用于需要处理 Canvas 内容的场景。

dom-to-image使用方式：
```js
// 安装依赖包
npm install dom-to-image

<div id='toImage'>需要生成图片的dom元素<div>

<script>
  // 引入依赖包
import domtoimage from 'dom-to-image';// ES Module
var domtoimage = require('dom-to-image'); // Commonjs

// 生成并下载 PNG 图像
domtoimage.toPng(document.getElementById('toImage'))
  .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'my-image-name.png';
      link.href = dataUrl;
      link.click();
  });

//生成并下载 JPEG 图像
domtoimage.toJpeg(document.getElementById('my-node'), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });
</script>
```