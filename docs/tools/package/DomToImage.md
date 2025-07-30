---
title: 🖼️ dom-to-image 前端 DOM 转图像工具指南
description: dom-to-image 是一个将 DOM 节点转换为图像的 JavaScript 库，支持 PNG、JPEG 和 SVG 格式
outline: deep
---

# 🖼️ dom-to-image 前端 DOM 转图像工具指南

> dom-to-image 是一个基于 JavaScript 的库，它可以将任意的 DOM 节点转换为矢量（SVG）或光栅（PNG 或 JPEG）图像。这个库是基于 Paul Bakaus 的 domvas 项目重新编写的，修复了一些 bug 并添加了一些新功能，如 Web 字体和图像支持。

## 1. 功能特点

### 1.1 核心功能

- **DOM 节点转换**：将任意 DOM 节点转换为图像
- **多格式支持**：生成 PNG、JPEG 和 SVG 格式的图像
- **Web 字体支持**：自动处理和嵌入 Web 字体
- **图像嵌入**：自动嵌入 `<img>` 元素和 CSS 背景图像

### 1.2 相似库对比

| 库名 | 特点 | 适用场景 |
|------|------|----------|
| **dom-to-image** | 支持 Web 字体和图像嵌入，DOM 转换准确性高 | 需要高质量图像输出的场景 |
| **FileSaver.js** | 客户端文件保存库，常与 dom-to-image 结合使用 | 需要在生成图像后立即下载 |
| **html2canvas** | 功能类似 dom-to-image，但有时会出现 DOM 错位 | 简单的屏幕截图场景 |
| **Canvas2Image** | 将 HTML5 Canvas 元素转换为图像 | 处理 Canvas 内容的场景 |

::: tip 使用建议
实际使用体验中，dom-to-image 的 DOM 转换准确性较高，暂未发现明显问题。
:::

## 2. 安装与使用

### 2.1 安装

```bash
# NPM
npm install dom-to-image

# Yarn
yarn add dom-to-image

# PNPM
pnpm add dom-to-image
```

### 2.2 基本使用

```html
<div id="toImage">
  <!-- 需要生成图片的 DOM 元素 -->
  <h1>Hello World</h1>
  <p>This will be converted to an image</p>
</div>

<script>
  // 引入依赖包
  import domtoimage from 'dom-to-image'; // ES Module
  // 或
  const domtoimage = require('dom-to-image'); // CommonJS
  
  // 获取目标 DOM 元素
  const node = document.getElementById('toImage');
  
  // 生成并下载 PNG 图像
  domtoimage.toPng(node)
    .then(function(dataUrl) {
      const link = document.createElement('a');
      link.download = 'my-image-name.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function(error) {
      console.error('生成图片时出错:', error);
    });
</script>
```

## 3. API 详解

### 3.1 图像格式转换

```javascript
// 转换为 PNG 格式
domtoimage.toPng(node, options)
  .then(function(dataUrl) {
    // 使用 dataUrl
  });

// 转换为 JPEG 格式
domtoimage.toJpeg(node, { quality: 0.95 })
  .then(function(dataUrl) {
    // 使用 dataUrl
  });

// 转换为 SVG 格式
domtoimage.toSvg(node, options)
  .then(function(dataUrl) {
    // 使用 dataUrl
  });

// 转换为 Blob 对象
domtoimage.toBlob(node)
  .then(function(blob) {
    // 使用 blob
  });

// 转换为像素数据
domtoimage.toPixelData(node)
  .then(function(pixels) {
    // 使用像素数据
  });
```

### 3.2 配置选项

```javascript
// 完整配置选项示例
const options = {
  // 过滤函数，决定哪些元素应该被渲染
  filter: function(node) {
    return (node.tagName !== 'i');  // 排除所有 <i> 元素
  },
  // JPEG 图像的质量，范围 0-1
  quality: 0.95,
  // 图像的宽度
  width: 500,
  // 图像的高度
  height: 500,
  // 图像的样式
  style: {
    'transform': 'scale(0.5)',
    'transform-origin': 'top left'
  },
  // 图像的类名
  className: 'my-custom-class',
  // 缩放比例
  scale: 2,
  // 缩放方法
  imagePlaceholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
};

domtoimage.toPng(node, options)
  .then(function(dataUrl) {
    // 使用 dataUrl
  });
```

## 4. 实用案例

### 4.1 生成并下载图片

```javascript
// 生成并下载 PNG 图像
function downloadPng() {
  domtoimage.toPng(document.getElementById('toImage'))
    .then(function(dataUrl) {
      const link = document.createElement('a');
      link.download = 'my-image-name.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function(error) {
      console.error('生成 PNG 失败', error);
    });
}

// 生成并下载 JPEG 图像
function downloadJpeg() {
  domtoimage.toJpeg(document.getElementById('toImage'), { quality: 0.95 })
    .then(function(dataUrl) {
      const link = document.createElement('a');
      link.download = 'my-image-name.jpeg';
      link.href = dataUrl;
      link.click();
    })
    .catch(function(error) {
      console.error('生成 JPEG 失败', error);
    });
}
```

### 4.2 与 FileSaver.js 结合使用

```javascript
// 安装 file-saver
// npm install file-saver

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

function saveAsPng() {
  const node = document.getElementById('toImage');
  
  domtoimage.toBlob(node)
    .then(function(blob) {
      saveAs(blob, 'my-node.png');
    })
    .catch(function(error) {
      console.error('保存图片失败', error);
    });
}
```

### 4.3 自定义样式和过滤

```javascript
// 自定义样式和过滤示例
domtoimage.toPng(document.getElementById('toImage'), {
  filter: function(node) {
    // 排除带有特定类名的元素
    return !node.classList.contains('do-not-render');
  },
  style: {
    // 应用自定义样式
    'background-color': '#fff',
    'box-shadow': '0 0 10px rgba(0, 0, 0, 0.3)',
    'border-radius': '8px'
  },
  width: 800,
  height: 600
})
.then(function(dataUrl) {
  // 使用生成的图像
  const img = new Image();
  img.src = dataUrl;
  document.body.appendChild(img);
});
```

## 5. 常见问题与解决方案

### 5.1 跨域资源处理

当页面包含跨域图像时，可能会导致转换失败。解决方案：

```javascript
// 为跨域图像添加 crossorigin 属性
document.querySelectorAll('img').forEach(img => {
  img.crossOrigin = 'anonymous';
});

// 或者使用代理服务器获取图像
```

### 5.2 大型 DOM 处理

对于复杂的 DOM 结构，可能会导致性能问题或浏览器崩溃：

```javascript
// 分块处理大型 DOM
function processLargeDOM(node) {
  // 设置较长的超时时间
  setTimeout(() => {
    domtoimage.toPng(node, { quality: 0.8, scale: 0.8 })
      .then(/* 处理结果 */);
  }, 100);
}
```

### 5.3 字体和样式问题

确保所有字体和样式在转换前已完全加载：

```javascript
// 等待字体加载完成后再转换
document.fonts.ready.then(function() {
  domtoimage.toPng(node)
    .then(/* 处理结果 */);
});
```

## 6. 参考资源

- [dom-to-image GitHub 仓库](https://github.com/tsayen/dom-to-image)
- [FileSaver.js GitHub 仓库](https://github.com/eligrey/FileSaver.js)
- [html2canvas 官方文档](https://html2canvas.hertzen.com/)
- [Canvas2Image GitHub 仓库](https://github.com/hongru/canvas2image)