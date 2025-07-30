---
title: 资源预加载技术详解：Prefetch 与 Preload
description: 深入解析 Prefetch 和 Preload 资源预加载技术的原理、使用方法、应用场景及最佳实践
outline: deep
---

# 🚀 资源预加载技术详解：Prefetch 与 Preload

资源预加载是前端性能优化的重要手段，通过合理使用 Prefetch 和 Preload 技术，可以显著提升网页加载速度和用户体验。本文详细介绍这两种预加载技术的原理、实现和最佳实践。

::: tip 📚 本章内容
全面了解 Prefetch 和 Preload 预加载技术，掌握它们的区别、使用场景和实现方法，有效提升网站性能。
:::

## 1. 资源预加载概述

资源预加载是一种浏览器优化技术，通过提前获取用户可能需要的资源，减少等待时间，提升页面性能。主要有两种预加载技术：Prefetch 和 Preload，它们针对不同的场景提供优化。

### 1.1 预加载技术对比

| 特性 | Prefetch | Preload |
|------|----------|---------|
| **加载时机** | 浏览器空闲时 | 页面加载过程中高优先级获取 |
| **使用场景** | 未来可能需要的资源 | 当前页面必需的关键资源 |
| **优先级** | 低 | 高 |
| **页面关闭行为** | 继续加载 | 立即停止 |
| **浏览器支持** | 现代浏览器 | 现代浏览器 |

## 2. Prefetch 预获取技术

### 2.1 基本概念

Prefetch（预获取）利用浏览器空闲时间，预加载用户未来可能会用到的资源。它告诉浏览器这个资源将来可能需要，但具体什么时间加载这个资源是由浏览器决定的。

### 2.2 工作原理

1. 浏览器解析到 `prefetch` 指令
2. 在浏览器空闲时，以低优先级获取资源
3. 将获取的资源缓存起来
4. 当用户实际需要该资源时，从缓存中快速获取

### 2.3 实现方式

通过 `<link>` 标签实现 Prefetch：

```html
<!-- 预获取 JavaScript 文件 -->
<link rel="prefetch" href="/js/next-page.js">

<!-- 预获取 CSS 文件 -->
<link rel="prefetch" href="/css/secondary-styles.css">

<!-- 预获取图片 -->
<link rel="prefetch" href="/images/large-image.jpg">
```

### 2.4 应用场景

Prefetch 特别适合以下场景：

- **分页内容**：预加载下一页的资源
- **搜索结果**：预加载用户可能点击的第一个结果
- **单页应用**：预加载用户可能导航到的路由
- **表单提交后页面**：预加载表单提交后可能显示的页面

### 2.5 Prefetch 变体

#### 2.5.1 DNS Prefetch

仅预解析域名的 DNS，不加载任何资源：

```html
<link rel="dns-prefetch" href="https://api.example.com">
```

#### 2.5.2 Prerender

预渲染整个页面（包括资源下载和页面渲染）：

```html
<link rel="prerender" href="https://example.com/next-page">
```

## 3. Preload 预加载技术

### 3.1 基本概念

Preload（预加载）用于预加载当前页面立即需要的关键资源，使必需的资源能够更早加载，从而避免阻塞页面的初步渲染，提升性能和用户体验。它是一个声明式 fetch，可以强制浏览器在不阻塞 document 的 onload 事件的情况下请求资源。

### 3.2 工作原理

1. 浏览器解析到 `preload` 指令
2. 立即以高优先级开始加载资源
3. 资源加载完成后，等待页面代码调用使用
4. 如果 20 秒内未被使用，控制台会显示警告

### 3.3 实现方式

#### 3.3.1 通过 HTML 标签实现

```html
<!-- 预加载 JavaScript -->
<link rel="preload" as="script" href="/js/critical.js">

<!-- 预加载 CSS -->
<link rel="preload" as="style" href="/css/critical.css">

<!-- 预加载字体 -->
<link rel="preload" as="font" href="/fonts/awesome.woff2" crossorigin>

<!-- 预加载图片 -->
<link rel="preload" as="image" href="/images/hero.jpg">
```

#### 3.3.2 通过 HTTP 头实现

```
Link: <https://example.com/styles.css>; rel=preload; as=style
Link: <https://example.com/script.js>; rel=preload; as=script
```

通过 HTTP 头部实现的预加载比 HTML 中的 `<link>` 标签更快，因为请求在返回还没到解析页面的时候就已经开始预加载资源。

### 3.4 资源类型（as 属性）

`as` 属性用于指定资源类型，浏览器根据此属性判断请求资源的优先级。没有 `as` 属性的预加载请求会被视为异步请求。

| as 值 | 资源类型 | 说明 |
|-------|---------|------|
| `audio` | 音频文件 | MP3, WAV 等音频格式 |
| `video` | 视频文件 | MP4, WebM 等视频格式 |
| `style` | 样式表 | CSS 文件 |
| `font` | 字体文件 | WOFF, WOFF2, TTF 等字体格式 |
| `image` | 图片文件 | JPEG, PNG, WebP 等图片格式 |
| `script` | 脚本文件 | JavaScript 文件 |
| `document` | HTML 文档 | 将要被嵌入到内部的 HTML 文档 |
| `embed` | 嵌入资源 | 将要被插入到元素内部的资源 |
| `fetch` | 数据资源 | 通过 fetch 或 XHR 请求获取的资源 |
| `object` | 对象文件 | 将要被嵌入到元素内的文件 |
| `track` | 文本轨道 | WebVTT 文件 |
| `worker` | Web Worker | Web Worker 或 Shared Worker 的 JavaScript 文件 |

### 3.5 应用场景

Preload 特别适合以下场景：

- **关键 CSS**：预加载首屏渲染所需的样式
- **Web 字体**：避免字体闪烁（FOIT）
- **关键脚本**：预加载页面交互所需的脚本
- **主图片**：预加载首屏大图或 Hero 图片

## 4. Prefetch 与 Preload 的区别

### 4.1 关键区别

1. **优先级**：Preload 具有高优先级，Prefetch 具有低优先级
2. **加载时机**：Preload 在页面加载过程中立即加载，Prefetch 在浏览器空闲时加载
3. **用途**：Preload 用于当前页面的关键资源，Prefetch 用于未来可能需要的资源
4. **页面关闭行为**：页面关闭时，Preload 请求会立即停止，而 Prefetch 请求会继续执行完成

### 4.2 选择指南

| 场景 | 推荐技术 | 原因 |
|------|---------|------|
| 当前页面立即需要的资源 | Preload | 高优先级，确保资源及时可用 |
| 下一页可能需要的资源 | Prefetch | 低优先级，不影响当前页面加载 |
| 关键渲染路径中的资源 | Preload | 减少渲染阻塞时间 |
| 用户可能点击的链接 | Prefetch | 提前准备可能的导航目标 |

## 5. 最佳实践

### 5.1 避免重复请求

确保预加载的资源不会被重复请求：

```html
<!-- 预加载 CSS -->
<link rel="preload" href="/css/styles.css" as="style">
<!-- 使用预加载的 CSS -->
<link rel="stylesheet" href="/css/styles.css">
```

### 5.2 合理设置优先级

不要过度使用 Preload，以免占用过多带宽：

```html
<!-- 仅预加载关键资源 -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">

<!-- 对次要资源使用 Prefetch -->
<link rel="prefetch" href="/js/non-critical.js">
```

### 5.3 结合使用提升性能

结合 Preload 和 Prefetch 可以获得最佳性能：

```html
<!-- 当前页面需要的资源 -->
<link rel="preload" href="/css/current-page.css" as="style">

<!-- 下一页可能需要的资源 -->
<link rel="prefetch" href="/js/next-page.js">
```

### 5.4 使用 JavaScript 动态添加

根据用户行为动态添加预加载：

```javascript
// 监测用户行为，预加载可能需要的资源
document.querySelector('.product-link').addEventListener('mouseenter', () => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/products/detail.html';
  document.head.appendChild(link);
});
```

## 6. 浏览器支持和兼容性

### 6.1 浏览器支持情况

| 浏览器 | Prefetch 支持 | Preload 支持 |
|-------|--------------|-------------|
| Chrome | 8.0+ | 50.0+ |
| Firefox | 3.5+ | 56.0+ |
| Safari | 11.1+ | 11.1+ |
| Edge | 12+ | 17+ |
| IE | 11 (部分) | 不支持 |

### 6.2 降级处理

对于不支持预加载的浏览器，可以使用以下降级策略：

- 使用 JavaScript 动态加载资源
- 使用传统的资源加载方式作为备选
- 监测浏览器支持情况后再决定使用哪种技术

## 7. 性能监测与优化

### 7.1 监测预加载效果

使用 Chrome DevTools 的 Network 面板监测预加载效果：

1. 打开 Chrome DevTools (F12)
2. 切换到 Network 面板
3. 查找带有 "Preload" 或 "Prefetch" 标记的资源
4. 比较预加载前后的资源加载时间

### 7.2 常见问题及解决方案

- **未使用的预加载**：确保预加载的资源在页面中被实际使用
- **优先级冲突**：避免过多高优先级的预加载请求
- **带宽浪费**：仅预加载真正必要的资源
- **缓存问题**：确保预加载资源的缓存策略正确

## 8. 参考资源

- [MDN Web Docs: Preloading content](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)
- [MDN Web Docs: Link prefetching FAQ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)
- [Web.dev: Preload critical assets](https://web.dev/preload-critical-assets/)
- [Google Developers: Resource Prioritization](https://developers.google.com/web/fundamentals/performance/resource-prioritization)