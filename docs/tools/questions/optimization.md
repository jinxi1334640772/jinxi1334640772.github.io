---
title: ⚡ 前端性能优化完全指南
description: 全面的前端性能优化指南，包括加载优化、运行时优化、打包优化、监控分析等各个方面的最佳实践
outline: deep
---

# ⚡ 前端性能优化完全指南

> 前端性能优化是提升用户体验的关键环节。本指南将从多个维度深入探讨前端性能优化的方法、工具和最佳实践。

## 📋 目录导航

<details>
<summary>点击展开完整目录</summary>

### 🎯 性能基础
- [性能指标体系](#性能指标体系)
- [性能监控工具](#性能监控工具)
- [性能测试方法](#性能测试方法)

### 🚀 加载性能优化
- [资源优化](#资源优化)
- [网络优化](#网络优化)
- [缓存策略](#缓存策略)
- [代码分割](#代码分割)

### ⚡ 运行时性能优化
- [JavaScript优化](#javascript优化)
- [CSS性能优化](#css性能优化)
- [DOM操作优化](#dom操作优化)
- [内存管理](#内存管理)

### 🎨 渲染性能优化
- [关键渲染路径](#关键渲染路径)
- [布局优化](#布局优化)
- [动画优化](#动画优化)
- [图像优化](#图像优化)

### 📦 构建优化
- [Webpack优化](#webpack优化)
- [Tree Shaking](#tree-shaking)
- [代码压缩](#代码压缩)
- [模块联邦](#模块联邦)

### 📊 监控与分析
- [性能监控](#性能监控)
- [错误追踪](#错误追踪)
- [用户体验监控](#用户体验监控)

</details>

## 🎯 性能指标体系

### 核心Web指标 (Core Web Vitals)

#### 1. 最大内容绘制 (LCP)

```javascript
// 监控LCP
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
      // 上报LCP数据
      reportWebVital('LCP', entry.startTime);
    }
  }
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });

// LCP优化建议
const LCPOptimization = {
  targets: {
    good: '< 2.5s',
    needsImprovement: '2.5s - 4.0s',
    poor: '> 4.0s'
  },
  
  optimizations: [
    '优化服务器响应时间',
    '消除阻塞渲染的资源',
    '优化CSS',
    '优化图像',
    '改进字体加载',
    '使用Service Worker缓存'
  ]
};
```

#### 2. 首次输入延迟 (FID)

```javascript
// 监控FID
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
      reportWebVital('FID', entry.processingStart - entry.startTime);
    }
  }
});

observer.observe({ type: 'first-input', buffered: true });

// FID优化策略
const FIDOptimization = {
  targets: {
    good: '< 100ms',
    needsImprovement: '100ms - 300ms',
    poor: '> 300ms'
  },
  
  strategies: [
    '减少JavaScript执行时间',
    '代码分割和懒加载',
    '移除未使用的代码',
    '使用Web Workers',
    '优化第三方脚本'
  ]
};
```

#### 3. 累积布局偏移 (CLS)

```javascript
// 监控CLS
let clsValue = 0;
let clsEntries = [];

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      clsEntries.push(entry);
      console.log('CLS:', clsValue);
    }
  }
});

observer.observe({ type: 'layout-shift', buffered: true });

// CLS优化方法
const CLSOptimization = {
  targets: {
    good: '< 0.1',
    needsImprovement: '0.1 - 0.25',
    poor: '> 0.25'
  },
  
  methods: [
    '为图像和视频设置尺寸属性',
    '预留广告空间',
    '避免在现有内容上方插入内容',
    '使用transform动画而非改变布局属性'
  ]
};
```

### 其他重要指标

```javascript
// 首次内容绘制 (FCP)
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-contentful-paint') {
      console.log('FCP:', entry.startTime);
      reportWebVital('FCP', entry.startTime);
    }
  }
});

observer.observe({ type: 'paint', buffered: true });

// 可交互时间 (TTI)
import { getTTI } from 'tti-polyfill';

getTTI().then((tti) => {
  console.log('TTI:', tti);
  reportWebVital('TTI', tti);
});

// 首字节时间 (TTFB)
const navigationEntry = performance.getEntriesByType('navigation')[0];
const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
console.log('TTFB:', ttfb);
```

## 🚀 加载性能优化

### 资源优化

#### 1. 图片优化

```html
<!-- 现代图片格式 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="描述" loading="lazy">
</picture>

<!-- 响应式图片 -->
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw"
  src="medium.jpg"
  alt="响应式图片"
  loading="lazy"
>
```

```javascript
// 图片懒加载实现
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      });
      
      this.observeImages();
    } else {
      // 降级方案
      this.loadAllImages();
    }
  }
  
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));
  }
  
  loadImage(img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }
  
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }
}

// 初始化懒加载
new LazyImageLoader();
```

#### 2. 字体优化

```css
/* 字体显示策略 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff');
  font-display: swap; /* 字体加载策略 */
}

/* 字体预加载 */
.font-preload {
  font-family: 'CustomFont', Arial, sans-serif;
}

/* 防止布局偏移 */
.text-element {
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  /* 设置固定高度避免字体加载时的布局偏移 */
  min-height: 24px;
}
```

```html
<!-- 字体预加载 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 关键字体内联 -->
<style>
@font-face {
  font-family: 'CriticalFont';
  src: url(data:font/woff2;base64,d09GMgABAAA...) format('woff2');
  font-display: swap;
}
</style>
```

#### 3. JavaScript和CSS优化

```javascript
// 代码分割示例
// 动态导入
const loadComponent = async () => {
  const { default: Component } = await import('./Component');
  return Component;
};

// Webpack魔法注释
const LazyComponent = React.lazy(() => 
  import(/* webpackChunkName: "lazy-component" */ './LazyComponent')
);

// 预加载关键模块
const preloadCriticalModules = () => {
  import(/* webpackPreload: true */ './CriticalModule');
};
```

```css
/* CSS优化 */
/* 关键CSS内联，非关键CSS异步加载 */

/* 避免复杂选择器 */
/* ❌ 复杂选择器 */
.container .sidebar .menu li a:hover span {
  color: red;
}

/* ✅ 简化选择器 */
.menu-link:hover .menu-text {
  color: red;
}

/* 使用contain属性优化渲染 */
.independent-component {
  contain: layout style paint;
}
```

### 网络优化

#### 1. HTTP/2 优化

```javascript
// HTTP/2 Server Push 示例
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  // SSL证书配置
});

server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    // 推送关键资源
    stream.pushStream({ ':path': '/critical.css' }, (err, pushStream) => {
      if (!err) {
        pushStream.respondWithFile('./critical.css');
      }
    });
    
    stream.pushStream({ ':path': '/critical.js' }, (err, pushStream) => {
      if (!err) {
        pushStream.respondWithFile('./critical.js');
      }
    });
    
    stream.respondWithFile('./index.html');
  }
});
```

#### 2. 资源预加载策略

```html
<!-- 资源提示 -->
<link rel="dns-prefetch" href="//api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="prefetch" href="/next-page.html">
<link rel="preload" href="/critical.js" as="script">
<link rel="modulepreload" href="/critical-module.js">

<!-- 关键资源优先级 -->
<script src="/critical.js" defer></script>
<script src="/non-critical.js" async></script>
```

```javascript
// 智能预加载
class IntelligentPreloader {
  constructor() {
    this.isIdle = false;
    this.preloadQueue = [];
    this.init();
  }
  
  init() {
    // 监听网络状态
    if ('connection' in navigator) {
      this.handleConnection();
    }
    
    // 使用requestIdleCallback进行预加载
    if ('requestIdleCallback' in window) {
      this.schedulePreload();
    }
  }
  
  handleConnection() {
    const connection = navigator.connection;
    
    // 根据网络状况调整预加载策略
    if (connection.effectiveType === '4g' && !connection.saveData) {
      this.enableAggressivePreload();
    } else {
      this.enableConservativePreload();
    }
  }
  
  schedulePreload() {
    requestIdleCallback((deadline) => {
      while (deadline.timeRemaining() > 0 && this.preloadQueue.length > 0) {
        const resource = this.preloadQueue.shift();
        this.preloadResource(resource);
      }
      
      if (this.preloadQueue.length > 0) {
        this.schedulePreload();
      }
    });
  }
  
  preloadResource(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  
  addToQueue(url) {
    this.preloadQueue.push(url);
  }
}
```

### 缓存策略

#### 1. HTTP缓存配置

```javascript
// Express.js缓存配置
const express = require('express');
const app = express();

// 静态资源缓存
app.use('/static', express.static('public', {
  maxAge: '1y',  // 1年缓存
  immutable: true
}));

// API缓存控制
app.get('/api/data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300', // 5分钟缓存
    'ETag': generateETag(data),
    'Last-Modified': new Date().toUTCString()
  });
  
  res.json(data);
});

// 条件请求处理
app.get('/api/conditional', (req, res) => {
  const etag = generateETag(data);
  const ifNoneMatch = req.get('If-None-Match');
  
  if (ifNoneMatch === etag) {
    return res.status(304).end();
  }
  
  res.set('ETag', etag);
  res.json(data);
});
```

#### 2. Service Worker缓存

```javascript
// service-worker.js
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/images/logo.png'
];

// 安装时预缓存关键资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // 缓存新资源
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          });
      })
  );
});

// 缓存更新策略
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 3. 浏览器缓存API

```javascript
// Cache API使用示例
class CacheManager {
  constructor(cacheName = 'app-cache') {
    this.cacheName = cacheName;
  }
  
  async put(request, response) {
    const cache = await caches.open(this.cacheName);
    return cache.put(request, response);
  }
  
  async get(request) {
    const cache = await caches.open(this.cacheName);
    return cache.match(request);
  }
  
  async delete(request) {
    const cache = await caches.open(this.cacheName);
    return cache.delete(request);
  }
  
  async clear() {
    return caches.delete(this.cacheName);
  }
  
  // 带过期时间的缓存
  async putWithExpiry(request, response, ttl = 3600000) {
    const cache = await caches.open(this.cacheName);
    const expiryTime = Date.now() + ttl;
    
    // 添加过期时间头
    const responseWithExpiry = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'x-cache-expiry': expiryTime.toString()
      }
    });
    
    return cache.put(request, responseWithExpiry);
  }
  
  async getWithExpiry(request) {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(request);
    
    if (response) {
      const expiry = response.headers.get('x-cache-expiry');
      if (expiry && Date.now() > parseInt(expiry)) {
        await this.delete(request);
        return null;
      }
    }
    
    return response;
  }
}
```

## ⚡ 运行时性能优化

### JavaScript优化

#### 1. 代码优化技巧

```javascript
// 避免频繁的DOM查询
// ❌ 低效方式
function updateElements() {
  for (let i = 0; i < 100; i++) {
    document.getElementById('element' + i).style.color = 'red';
  }
}

// ✅ 高效方式
function updateElementsOptimized() {
  const elements = [];
  for (let i = 0; i < 100; i++) {
    elements.push(document.getElementById('element' + i));
  }
  
  elements.forEach(el => el.style.color = 'red');
}

// 使用DocumentFragment批量操作
function batchDOMOperations() {
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
  }
  
  document.getElementById('container').appendChild(fragment);
}

// 防抖和节流
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(scrollHandler, 100);
```

#### 2. 内存优化

```javascript
// 避免内存泄漏
class ComponentManager {
  constructor() {
    this.listeners = new Map();
    this.timers = new Set();
    this.observers = new Set();
  }
  
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    this.listeners.get(element).set(event, handler);
  }
  
  setTimeout(callback, delay) {
    const timerId = setTimeout(() => {
      callback();
      this.timers.delete(timerId);
    }, delay);
    this.timers.add(timerId);
    return timerId;
  }
  
  createObserver(target, options, callback) {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);
    this.observers.add(observer);
    return observer;
  }
  
  cleanup() {
    // 清理事件监听器
    this.listeners.forEach((events, element) => {
      events.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
    
    // 清理定时器
    this.timers.forEach(timerId => clearTimeout(timerId));
    this.timers.clear();
    
    // 清理观察器
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// 弱引用使用
class DataCache {
  constructor() {
    this.cache = new WeakMap();
  }
  
  set(key, value) {
    this.cache.set(key, value);
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  has(key) {
    return this.cache.has(key);
  }
}
```

#### 3. 算法优化

```javascript
// 高效数组操作
class OptimizedArray {
  // 使用二分查找
  static binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    
    return -1;
  }
  
  // 高效去重
  static removeDuplicates(arr) {
    return [...new Set(arr)];
  }
  
  // 分块处理大数组
  static async processLargeArray(arr, processor, chunkSize = 1000) {
    const results = [];
    
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      const chunkResult = await processor(chunk);
      results.push(...chunkResult);
      
      // 让出控制权，避免阻塞UI
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }
}

// 对象池模式减少垃圾回收
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const divPool = new ObjectPool(
  () => document.createElement('div'),
  (div) => {
    div.textContent = '';
    div.className = '';
    div.style.cssText = '';
  }
);
```

### CSS性能优化

#### 1. 选择器优化

```css
/* ❌ 低效选择器 */
body #content .sidebar ul li a span.icon {
  color: red;
}

* {
  box-sizing: border-box;
}

[data-attribute*="value"] {
  display: block;
}

/* ✅ 高效选择器 */
.icon {
  color: red;
}

.box-border {
  box-sizing: border-box;
}

.specific-element {
  display: block;
}

/* 使用CSS Containment优化渲染 */
.component {
  contain: layout style paint;
}

.independent-widget {
  contain: strict;
}
```

#### 2. 布局和重绘优化

```css
/* 避免触发布局的属性 */
/* ❌ 触发布局 */
.element {
  width: 100px;
  height: 100px;
  left: 100px;
  top: 100px;
}

/* ✅ 使用transform */
.element {
  transform: translate(100px, 100px) scale(1.2);
}

/* GPU加速 */
.gpu-accelerated {
  transform: translateZ(0);
  /* 或 */
  will-change: transform;
}

/* 优化动画性能 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-animation {
  animation: slideIn 0.3s ease-out;
  will-change: transform;
}

.slide-animation.completed {
  will-change: auto;
}
```

#### 3. CSS优化工具

```javascript
// Critical CSS提取
const critical = require('critical');

critical.generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  dest: 'dist/index-critical.html',
  width: 1300,
  height: 900
});

// 未使用CSS清理
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: ['./src/**/*.html', './src/**/*.js'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
```

## 🎨 渲染性能优化

### 关键渲染路径优化

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 关键CSS内联 -->
  <style>
    /* 首屏关键样式 */
    .header { display: flex; }
    .main { min-height: 100vh; }
  </style>
  
  <!-- 非关键CSS异步加载 -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
  
  <!-- DNS预解析 -->
  <link rel="dns-prefetch" href="//api.example.com">
  
  <!-- 预连接到重要的第三方域名 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
</head>
<body>
  <!-- 内容 -->
  
  <!-- JavaScript延迟加载 -->
  <script defer src="main.js"></script>
  <script async src="analytics.js"></script>
</body>
</html>
```

### 虚拟滚动实现

```javascript
class VirtualScroller {
  constructor(container, items, itemHeight, renderItem) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.scrollTop = 0;
    
    this.init();
  }
  
  init() {
    this.container.style.overflow = 'auto';
    this.container.style.height = '400px'; // 固定高度
    
    // 创建滚动容器
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.style.height = `${this.items.length * this.itemHeight}px`;
    this.container.appendChild(this.scrollContainer);
    
    // 创建可视区域容器
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'relative';
    this.scrollContainer.appendChild(this.viewport);
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    this.updateVisibleItems();
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleItems();
  }
  
  updateVisibleItems() {
    const containerHeight = this.container.clientHeight;
    const visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    const visibleEnd = Math.min(
      this.items.length - 1,
      Math.floor((this.scrollTop + containerHeight) / this.itemHeight)
    );
    
    if (visibleStart !== this.visibleStart || visibleEnd !== this.visibleEnd) {
      this.visibleStart = visibleStart;
      this.visibleEnd = visibleEnd;
      this.renderVisibleItems();
    }
  }
  
  renderVisibleItems() {
    // 清空当前内容
    this.viewport.innerHTML = '';
    
    // 渲染可见项目
    for (let i = this.visibleStart; i <= this.visibleEnd; i++) {
      const item = this.renderItem(this.items[i], i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      this.viewport.appendChild(item);
    }
  }
}

// 使用示例
const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }));

const virtualScroller = new VirtualScroller(
  document.getElementById('scrollContainer'),
  items,
  50, // 项目高度
  (item, index) => {
    const div = document.createElement('div');
    div.textContent = item.text;
    div.style.borderBottom = '1px solid #eee';
    div.style.padding = '10px';
    return div;
  }
);
```

### 图像懒加载和优化

```javascript
class AdvancedImageLoader {
  constructor() {
    this.imageObserver = null;
    this.loadingImages = new Set();
    this.init();
  }
  
  init() {
    // 创建Intersection Observer
    this.imageObserver = new IntersectionObserver(
      this.handleImageIntersection.bind(this),
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01
      }
    );
    
    this.observeImages();
  }
  
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
      
      // 添加加载状态类
      img.classList.add('lazy-loading');
    });
  }
  
  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.loadingImages.has(entry.target)) {
        this.loadImage(entry.target);
      }
    });
  }
  
  async loadImage(img) {
    this.loadingImages.add(img);
    
    try {
      // 预加载图像
      const imageLoader = new Image();
      
      await new Promise((resolve, reject) => {
        imageLoader.onload = resolve;
        imageLoader.onerror = reject;
        imageLoader.src = img.dataset.src;
      });
      
      // 应用图像
      img.src = img.dataset.src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // 移除data-src属性
      img.removeAttribute('data-src');
      
      // 停止观察
      this.imageObserver.unobserve(img);
      
    } catch (error) {
      console.error('图像加载失败:', error);
      img.classList.add('lazy-error');
    } finally {
      this.loadingImages.delete(img);
    }
  }
  
  // 立即加载所有图像（降级方案）
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }
}

// CSS样式
const lazyImageStyles = `
.lazy-loading {
  background: #f0f0f0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lazy-loading::before {
  content: '加载中...';
  color: #999;
}

.lazy-loaded {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

.lazy-error {
  background: #ffebee;
  color: #c62828;
}

.lazy-error::before {
  content: '加载失败';
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
`;

// 应用样式
const style = document.createElement('style');
style.textContent = lazyImageStyles;
document.head.appendChild(style);

// 初始化
new AdvancedImageLoader();
```

## 📦 构建优化

### Webpack优化配置

```javascript
// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  
  // 入口点优化
  entry: {
    vendor: ['react', 'react-dom', 'lodash'],
    main: './src/index.js'
  },
  
  // 输出优化
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true
  },
  
  // 优化配置
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    
    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // 运行时优化
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  // 模块解析优化
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // 加载器优化
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    
    // 打包分析
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```

### Tree Shaking优化

```javascript
// package.json配置
{
  "sideEffects": false, // 标记为无副作用
  // 或者指定有副作用的文件
  "sideEffects": [
    "./src/polyfills.js",
    "*.css"
  ]
}

// 使用ES6模块进行Tree Shaking
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// main.js - 只导入需要的函数
import { add } from './utils'; // 只有add函数会被打包

// 避免默认导出整个对象
// ❌ 这样会导入整个lodash
import _ from 'lodash';

// ✅ 只导入需要的函数
import { debounce } from 'lodash';
// 或使用babel-plugin-lodash
import debounce from 'lodash/debounce';
```

### 代码分割策略

```javascript
// 动态导入实现代码分割
const LazyComponent = React.lazy(() => 
  import(/* webpackChunkName: "lazy-component" */ './LazyComponent')
);

// 路由级别的代码分割
const routes = [
  {
    path: '/home',
    component: React.lazy(() => import('./pages/Home'))
  },
  {
    path: '/about',
    component: React.lazy(() => import('./pages/About'))
  }
];

// 条件加载
const loadPolyfills = async () => {
  if (!window.IntersectionObserver) {
    await import('intersection-observer');
  }
  
  if (!window.fetch) {
    await import('whatwg-fetch');
  }
};

// 预加载策略
const preloadRoute = (routePath) => {
  const route = routes.find(r => r.path === routePath);
  if (route) {
    // 预加载组件
    route.component();
  }
};

// 智能预加载
class SmartPreloader {
  constructor() {
    this.preloadedChunks = new Set();
    this.init();
  }
  
  init() {
    // 监听链接悬停
    document.addEventListener('mouseover', this.handleLinkHover.bind(this));
    
    // 监听空闲时间
    if ('requestIdleCallback' in window) {
      this.scheduleIdlePreload();
    }
  }
  
  handleLinkHover(event) {
    const link = event.target.closest('a');
    if (link && link.href) {
      this.preloadRoute(link.href);
    }
  }
  
  scheduleIdlePreload() {
    requestIdleCallback(() => {
      // 预加载常用路由
      this.preloadCommonRoutes();
    });
  }
  
  preloadRoute(href) {
    if (!this.preloadedChunks.has(href)) {
      // 动态导入路由组件
      import(/* webpackChunkName: "preload-[request]" */ `./pages/${href}`)
        .then(() => {
          this.preloadedChunks.add(href);
        })
        .catch(console.error);
    }
  }
}
```

## 📊 性能监控与分析

### 性能监控实现

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.init();
  }
  
  init() {
    this.observeWebVitals();
    this.observeResourceTiming();
    this.observeUserTiming();
    this.monitorErrors();
  }
  
  observeWebVitals() {
    // LCP监控
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('LCP', entry.startTime);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID监控
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
      }
    }).observe({ type: 'first-input', buffered: true });
    
    // CLS监控
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.recordMetric('CLS', clsValue);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  }
  
  observeResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.analyzeResourceTiming(entry);
      }
    }).observe({ type: 'resource', buffered: true });
  }
  
  analyzeResourceTiming(entry) {
    const timing = {
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize,
      cached: entry.transferSize === 0,
      type: this.getResourceType(entry)
    };
    
    this.recordMetric('ResourceTiming', timing);
  }
  
  getResourceType(entry) {
    const url = new URL(entry.name);
    const extension = url.pathname.split('.').pop().toLowerCase();
    
    const typeMap = {
      'js': 'script',
      'css': 'stylesheet',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'webp': 'image',
      'svg': 'image'
    };
    
    return typeMap[extension] || 'other';
  }
  
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now()
    });
    
    // 发送到监控服务
    this.sendToAnalytics(name, value);
  }
  
  sendToAnalytics(metric, value) {
    // 使用beacon API发送数据
    if ('sendBeacon' in navigator) {
      const data = JSON.stringify({
        metric,
        value,
        timestamp: Date.now(),
        url: location.href,
        userAgent: navigator.userAgent
      });
      
      navigator.sendBeacon('/api/performance', data);
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  // 自定义性能标记
  mark(name) {
    performance.mark(name);
  }
  
  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    this.recordMetric(name, measure.duration);
  }
  
  // 监控内存使用
  monitorMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
      this.recordMetric('MemoryUsage', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
    }
  }
  
  // 错误监控
  monitorErrors() {
    window.addEventListener('error', (event) => {
      this.recordMetric('JSError', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('PromiseRejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }
}

// 初始化性能监控
const performanceMonitor = new PerformanceMonitor();

// 使用示例
performanceMonitor.mark('component-render-start');
// ... 组件渲染代码
performanceMonitor.mark('component-render-end');
performanceMonitor.measure('component-render', 'component-render-start', 'component-render-end');
```

### 用户体验监控

```javascript
class UXMonitor {
  constructor() {
    this.interactions = [];
    this.init();
  }
  
  init() {
    this.monitorPageLoad();
    this.monitorUserInteractions();
    this.monitorViewportChanges();
    this.monitorNetworkStatus();
  }
  
  monitorPageLoad() {
    // 监控页面加载时间
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordUXMetric('PageLoadTime', loadTime);
    });
    
    // 监控DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      const domReadyTime = performance.now();
      this.recordUXMetric('DOMReadyTime', domReadyTime);
    });
  }
  
  monitorUserInteractions() {
    // 监控点击响应时间
    let clickStartTime;
    
    document.addEventListener('mousedown', () => {
      clickStartTime = performance.now();
    });
    
    document.addEventListener('click', (event) => {
      if (clickStartTime) {
        const responseTime = performance.now() - clickStartTime;
        this.recordUXMetric('ClickResponseTime', {
          duration: responseTime,
          target: this.getElementSelector(event.target)
        });
      }
    });
    
    // 监控滚动性能
    let scrollStartTime;
    let isScrolling;
    
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        scrollStartTime = performance.now();
        isScrolling = true;
      }
      
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        const scrollDuration = performance.now() - scrollStartTime;
        this.recordUXMetric('ScrollPerformance', scrollDuration);
        isScrolling = false;
      }, 100);
    });
  }
  
  monitorViewportChanges() {
    // 监控视口变化
    window.addEventListener('resize', () => {
      this.recordUXMetric('ViewportChange', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });
    
    // 监控设备方向变化
    window.addEventListener('orientationchange', () => {
      this.recordUXMetric('OrientationChange', {
        orientation: screen.orientation?.angle || window.orientation
      });
    });
  }
  
  monitorNetworkStatus() {
    // 监控网络状态
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      this.recordUXMetric('NetworkInfo', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
      
      connection.addEventListener('change', () => {
        this.recordUXMetric('NetworkChange', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
    
    // 监控在线状态
    window.addEventListener('online', () => {
      this.recordUXMetric('NetworkStatus', 'online');
    });
    
    window.addEventListener('offline', () => {
      this.recordUXMetric('NetworkStatus', 'offline');
    });
  }
  
  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }
  
  recordUXMetric(name, value) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: location.href
    };
    
    // 发送到分析服务
    this.sendToAnalytics(metric);
  }
  
  sendToAnalytics(metric) {
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/ux-metrics', JSON.stringify(metric));
    }
  }
}

// 初始化UX监控
new UXMonitor();
```

## 📋 性能优化清单

### 开发阶段

- [ ] **代码优化**
  - [ ] 使用现代JavaScript语法
  - [ ] 避免不必要的重新渲染
  - [ ] 实现防抖和节流
  - [ ] 优化循环和算法
  - [ ] 避免内存泄漏

- [ ] **资源优化**
  - [ ] 图片格式和尺寸优化
  - [ ] 字体加载优化
  - [ ] CSS和JavaScript压缩
  - [ ] 移除未使用的代码

### 构建阶段

- [ ] **打包优化**
  - [ ] 配置代码分割
  - [ ] 启用Tree Shaking
  - [ ] 优化Webpack配置
  - [ ] 生成源码映射

- [ ] **缓存策略**
  - [ ] 设置合适的缓存头
  - [ ] 实现Service Worker
  - [ ] 配置CDN
  - [ ] 版本化静态资源

### 部署阶段

- [ ] **服务器优化**
  - [ ] 启用Gzip压缩
  - [ ] 配置HTTP/2
  - [ ] 设置合适的缓存策略
  - [ ] 优化服务器响应时间

- [ ] **监控设置**
  - [ ] 配置性能监控
  - [ ] 设置错误追踪
  - [ ] 建立性能预算
  - [ ] 定期性能审计

::: tip 💡 优化建议
- **制定性能预算**：为关键指标设定目标值
- **持续监控**：建立自动化的性能监控系统
- **渐进式优化**：优先解决影响最大的性能问题
- **用户体验优先**：关注真实用户的体验指标
- **定期审计**：使用工具定期检查性能状况
:::

---

> 📚 **相关资源**：
> - [Web Vitals](https://web.dev/vitals/)
> - [Lighthouse性能指南](https://web.dev/lighthouse-performance/)
> - [Webpack性能优化](https://webpack.js.org/guides/performance/)
> - [浏览器渲染优化](https://web.dev/rendering-performance/) 