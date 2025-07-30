---
title: 图片优化完全指南
description: 前端图片优化技术详解，包括图片格式选择、懒加载、预加载等多种优化策略
outline: deep
---

# 🖼️ 图片优化完全指南

图片资源通常占据网页总下载量的 60-65%，合理优化图片可以显著提升网页性能和用户体验。本文详细介绍前端图片优化的关键技术和最佳实践。

::: tip 📚 本章内容
全面了解各种图片格式特性，掌握懒加载、预加载等核心优化技术，提升网站性能和用户体验。
:::

## 1. 图片格式选择

选择合适的图片格式对于优化网站性能至关重要。不同的图片格式各有优缺点，应根据具体场景选择最合适的格式。

### 1.1 常用图片格式对比

| 格式 | 压缩类型 | 透明支持 | 动画支持 | 色彩模式 | 最佳应用场景 |
|------|---------|---------|---------|---------|------------|
| **JPEG/JPG** | 有损 | 不支持 | 不支持 | 直接色 | 照片、复杂图像 |
| **PNG-8** | 无损 | 支持完全透明 | 不支持 | 索引色(256色) | 简单图形、图标 |
| **PNG-24** | 无损 | 支持半透明 | 不支持 | 直接色 | 需要透明度的图像 |
| **GIF** | 无损 | 支持完全透明 | 支持 | 索引色(256色) | 简单动画 |
| **SVG** | 无损 | 支持 | 支持(SMIL/CSS/JS) | 矢量 | 图标、Logo、插图 |
| **WebP** | 有损/无损 | 支持 | 支持 | 直接色 | 替代JPEG/PNG的现代格式 |
| **AVIF** | 有损/无损 | 支持 | 支持 | 直接色 | 下一代高压缩比格式 |

### 1.2 图片格式详解

#### 1.2.1 GIF 格式

- **特点**：无损压缩，文件小，支持动画及完全透明
- **局限性**：
  - 不支持半透明
  - 仅支持 8bit 索引色（256种颜色）
  - 在网络中主要用于简单动画和小图标
  - 正逐渐被更现代的格式替代

#### 1.2.2 JPEG/JPG 格式

- **特点**：有损压缩，采用直接色，保证色彩丰富性
- **应用**：
  - 适用于照片、复杂图像等大图
  - 不支持透明（空白区域填充白色）
  - 压缩比高，文件体积小

#### 1.2.3 PNG 系列格式

- **PNG-8**：
  - 无损压缩，索引色版本
  - 比 GIF 有更小的文件体积
  - 支持透明度调节，但不支持半透明和动画

- **PNG-24**：
  - 无损压缩，直接色版本
  - 支持透明和半透明
  - 文件体积较大（通常是 JPG 的 5 倍）
  - 显示效果略优于 JPG

- **PNG-32**：
  - 在 PNG-24 基础上添加 8 位 alpha 通道
  - 完全支持透明和半透明
  - 支持图层、辅助线等复杂数据
  - PS 导出的透明 PNG-24 实际是阉割版 PNG-32（不支持图层）

#### 1.2.4 SVG 格式

- **特点**：
  - 无损的矢量图格式
  - 缩放不失真，适合响应式设计
  - 基于 XML，可通过 CSS/JS 控制
  - 适用于 Logo、图标、简单插图
  - 文件体积小（简单图形）

#### 1.2.5 WebP 格式

- **特点**：
  - Google 于 2010 年发布
  - 支持有损和无损压缩
  - 派生自图像编码格式 VP8
  - 比 JPEG 小约 25-35%，比 PNG 小约 25-35%
  - 支持 Alpha 透明和动画
  - 在 Android 设备上有良好支持

## 2. 图片懒加载技术

懒加载是一种延迟加载图片的技术，只在图片即将进入可视区域时才加载，可有效减少初始页面加载时间和资源消耗。

### 2.1 懒加载原理

1. 待加载的图片默认显示一张占位图
2. 使用 `data-src` 属性保存真实图片地址
3. 当图片进入可视区域时，将 `data-src` 的值赋给 `src` 属性
4. 图片加载完成后，移除占位图样式

### 2.2 传统实现方式

使用 `getBoundingClientRect()` 方法检测元素位置：

```javascript
// HTML 结构
// <img data-src="./images/1.jpg" alt="" />

// 使用 getBoundingClientRect() 实现懒加载
const oList = document.getElementById("list");
const viewHeight = oList.clientHeight;
const eles = document.querySelectorAll("img[data-src]");

const lazyLoad = () => {
  Array.prototype.forEach.call(eles, item => {
    const rect = item.getBoundingClientRect();
    if (rect.top <= viewHeight && !item.isLoaded) {
      item.isLoaded = true;
      const oImg = new Image();
      oImg.onload = () => {
        item.src = oImg.src;
      };
      oImg.src = item.getAttribute("data-src");
    }
  });
};

// 使用节流函数优化滚动事件
const throttle = (fn, wait = 100) => {
  return function () {
    if (fn.timer) return;
    fn.timer = setTimeout(() => {
      fn.apply(this, arguments);
      fn.timer = null;
    }, wait);
  };
};

// 初始加载和滚动事件监听
lazyLoad();
oList.addEventListener("scroll", throttle(lazyLoad));
```

### 2.3 现代实现方式

使用 `IntersectionObserver` API 实现更高效的懒加载：

```javascript
// HTML 结构
// <img data-src="./images/1.jpg" alt="" />

// 使用 IntersectionObserver 实现懒加载
const imgs = document.querySelectorAll("img[data-src]");
const options = {
  root: document.querySelector("#scrollArea"),
  rootMargin: "0px",
  threshold: 0.1  // 当目标元素10%可见时触发
};

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // 当图片进入可视区域
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      
      // 图片加载后停止观察该元素
      io.unobserve(img);
      
      // 图片加载完成后移除占位样式
      img.onload = () => {
        img.removeAttribute("data-src");
        img.classList.remove("lazy");
      };
    }
  });
}, options);

// 开始观察所有图片元素
imgs.forEach(img => {
  io.observe(img);
  img.classList.add("lazy");
});
```

### 2.4 懒加载优势

- 减少初始页面加载时间和带宽消耗
- 降低服务器负载
- 避免加载用户可能永远不会查看的内容
- 提升页面滚动性能

## 3. 图片预加载技术

预加载是一种提前加载用户可能需要的图片资源的技术，确保用户需要查看图片时能够立即显示，提供更流畅的用户体验。

### 3.1 适用场景

预加载技术适用于以下场景：

1. 在首屏加载之前，缩短白屏时间
2. 在空闲时间为 SPA 的下一屏预加载内容
3. 预测用户操作，预先加载可能需要的数据
4. 图片画廊、轮播图等需要快速切换显示的场景

### 3.2 实现方法

#### 3.2.1 CSS 背景图预加载

利用页面中不可见元素的背景图来预加载图片：

```javascript
function preLoadImg() {
  preload1.style.background = "url('img/img1.gif')";
  preload2.style.background = "url('img/img2.gif')";
  preload3.style.background = "url('img/img3.gif')";
  preload4.style.background = "url('img/img4.gif')";
}
```

#### 3.2.2 JavaScript 预加载

通过创建 Image 对象来预加载图片：

```javascript
function preLoadImg() {
  const imageUrls = [
    "img/img1.gif",
    "img/img2.gif",
    "img/img3.gif",
    "img/img4.gif"
  ];
  
  const preloadedImages = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    preloadedImages[i] = new Image();
    preloadedImages[i].src = imageUrls[i];
  }
}

// 页面加载完成后执行预加载
window.onload = function() {
  preLoadImg();
};
```

#### 3.2.3 XHR 预加载

通过 XMLHttpRequest 请求预加载图片（仅适用于同域资源）：

```javascript
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    
    xhr.onload = function() {
      if (this.status === 200) {
        const imageUrl = URL.createObjectURL(this.response);
        resolve(imageUrl);
      } else {
        reject(new Error(`Failed to load image: ${url}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error(`Network error when loading: ${url}`));
    };
    
    xhr.send();
  });
}
```

### 3.3 框架集成

在 Vue 项目中使用 `vue-lazyload` 插件实现懒加载和预加载：

```javascript
// 安装：npm install vue-lazyload

// 在 main.js 中配置
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  preLoad: 1.3,              // 预加载高度比例
  error: 'dist/error.png',   // 加载失败显示图片
  loading: 'dist/loading.gif', // 加载中显示图片
  attempt: 1,                // 尝试加载次数
  listenEvents: ['scroll'],  // 监听的事件
  observer: true,            // 使用 IntersectionObserver
  observerOptions: {         // IntersectionObserver 配置
    rootMargin: '0px',
    threshold: 0.1
  }
});

// 在模板中使用
// <img v-lazy="imgUrl" />
```

## 4. 图片优化最佳实践

### 4.1 选择合适的图片格式

- **照片和复杂图像**：使用 WebP（优先）或 JPEG
- **需要透明度的图像**：使用 WebP（优先）或 PNG
- **图标和简单图形**：优先使用 SVG，其次是 PNG-8
- **动画**：使用 WebP 动画或考虑使用 video 标签替代 GIF

### 4.2 响应式图片

使用 `<picture>` 元素和 `srcset` 属性提供不同分辨率和格式的图片：

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="描述">
</picture>

<!-- 响应式图片尺寸 -->
<img 
  srcset="small.jpg 300w, medium.jpg 600w, large.jpg 900w"
  sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 900px"
  src="fallback.jpg" 
  alt="响应式图片">
```

### 4.3 图片压缩工具

- **在线工具**：TinyPNG, Squoosh, Kraken.io
- **构建工具**：使用 webpack 的 image-webpack-loader
- **CLI 工具**：ImageOptim-CLI, Sharp

### 4.4 CDN 和缓存策略

- 使用 CDN 分发图片资源
- 设置适当的缓存头（Cache-Control）
- 使用内容哈希作为文件名的一部分，实现长期缓存

## 5. 参考资源

- [MDN Web Docs: 响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev: 图像优化](https://web.dev/fast/#optimize-your-images)
- [WebP 官方文档](https://developers.google.com/speed/webp)
- [IntersectionObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- [Vue Lazyload 插件](https://github.com/hilongjw/vue-lazyload)