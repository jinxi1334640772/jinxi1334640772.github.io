# Service Worker 开发指南

> Service Worker 本质上充当 Web 应用程序、浏览器与网络（可用时）之间的代理服务器。这个 API 旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用来采取适当的动作、更新来自服务器的资源。它还提供入口以推送通知和访问后台同步 API。

## 📋 目录导航

- [1. 概述与基础概念](#1-概述与基础概念)
- [2. Service Worker 生命周期](#2-service-worker-生命周期)
- [3. 注册与基本使用](#3-注册与基本使用)
- [4. 缓存策略与管理](#4-缓存策略与管理)
- [5. 核心 API 详解](#5-核心-api-详解)
- [6. 高级功能应用](#6-高级功能应用)
- [7. 实际应用示例](#7-实际应用示例)
- [8. 最佳实践与优化](#8-最佳实践与优化)
- [9. 常见问题解答](#9-常见问题解答)

---

## 1. 概述与基础概念

### 1.1 什么是 Service Worker

Service Worker 是一个注册在指定源和路径下的事件驱动 Worker。它采用 JavaScript 文件的形式，控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。你可以完全控制应用在特定情形（最常见的情形是网络不可用）下的表现。

### 1.2 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **后台运行** | 独立于主线程的 Worker 上下文 | 不阻塞用户界面 |
| **网络代理** | 拦截和处理网络请求 | 实现离线功能和缓存策略 |
| **事件驱动** | 基于事件的异步编程模型 | 高效的资源利用 |
| **持久化** | 安装后持续存在 | 提供持续的后台服务 |
| **安全限制** | 仅支持 HTTPS | 保证数据传输安全 |

### 1.3 运行环境特点

- **Worker 上下文**：无法访问 DOM，运行在其他线程中
- **完全异步**：同步 XHR 和 Web Storage 不可用
- **HTTPS 要求**：出于安全考量，仅限安全上下文
- **事件驱动**：响应安装、激活、fetch 等事件

### 1.4 应用场景

```javascript
/**
 * Service Worker 主要应用场景
 */
const serviceWorkerUseCases = {
  // 离线体验
  offline: {
    description: '缓存关键资源，提供离线访问',
    examples: ['新闻阅读', '文档应用', '静态网站']
  },
  
  // 性能优化
  performance: {
    description: '智能缓存，加速资源加载',
    examples: ['CDN 缓存', '预缓存', '资源优化']
  },
  
  // 推送通知
  push: {
    description: '接收服务器推送消息',
    examples: ['消息提醒', '新闻推送', '社交通知']
  },
  
  // 后台同步
  sync: {
    description: '网络恢复时同步数据',
    examples: ['离线表单提交', '数据上传', '消息发送']
  },
  
  // PWA 支持
  pwa: {
    description: '提供类原生应用体验',
    examples: ['应用安装', '启动画面', '全屏模式']
  }
};

console.log('Service Worker 应用场景:', serviceWorkerUseCases);
```

---

## 2. Service Worker 生命周期

### 2.1 生命周期概述

Service Worker 的生命周期完全独立于网页，包含三个主要阶段：**注册**、**安装**、**激活**。理解这个生命周期对于正确使用 Service Worker 至关重要。

![Service Worker 生命周期](sw-lifecycle.svg)

### 2.2 详细生命周期阶段

| 阶段 | 状态 | 描述 | 触发时机 |
|------|------|------|----------|
| **注册** | `installing` | 下载并解析 SW 文件 | `register()` 调用 |
| **安装** | `installed/waiting` | 执行安装逻辑，缓存资源 | `install` 事件 |
| **激活** | `activating` | 清理旧缓存，获得控制权 | `activate` 事件 |
| **运行** | `activated` | 处理 fetch 和消息事件 | 页面请求时 |
| **终止** | `redundant` | 被新版本替换或出错 | 更新或错误时 |

### 2.3 生命周期管理策略

```javascript
/**
 * Service Worker 生命周期管理器
 */
class ServiceWorkerLifecycleManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.cachePrefix = 'app-cache';
    this.staticCaches = [];
    this.dynamicCaches = [];
  }

  /**
   * 安装阶段 - 预缓存关键资源
   */
  async handleInstall(event) {
    console.log(`🔧 Service Worker ${this.currentVersion} 安装中...`);
    
    // 预缓存静态资源
    const staticResources = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/app.js',
      '/manifest.json',
      '/icons/icon-192.png'
    ];

    try {
      const cache = await caches.open(`${this.cachePrefix}-static-${this.currentVersion}`);
      await cache.addAll(staticResources);
      
      console.log('✅ 静态资源预缓存完成');
      
      // 跳过等待，立即激活新版本
      if (event && typeof event.waitUntil === 'function') {
        event.waitUntil(self.skipWaiting());
      }
      
    } catch (error) {
      console.error('❌ 安装阶段失败:', error);
      throw error;
    }
  }

  /**
   * 激活阶段 - 清理旧缓存
   */
  async handleActivate(event) {
    console.log(`🚀 Service Worker ${this.currentVersion} 激活中...`);
    
    try {
      // 清理旧版本缓存
      await this.cleanupOldCaches();
      
      // 立即控制所有页面
      await clients.claim();
      
      console.log('✅ Service Worker 激活完成');
      
    } catch (error) {
      console.error('❌ 激活阶段失败:', error);
      throw error;
    }
  }

  /**
   * 清理旧版本缓存
   */
  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [
      `${this.cachePrefix}-static-${this.currentVersion}`,
      `${this.cachePrefix}-dynamic-${this.currentVersion}`
    ];

    const deletePromises = cacheNames
      .filter(cacheName => 
        cacheName.startsWith(this.cachePrefix) && 
        !currentCaches.includes(cacheName)
      )
      .map(cacheName => {
        console.log(`🗑️ 删除旧缓存: ${cacheName}`);
        return caches.delete(cacheName);
      });

    await Promise.all(deletePromises);
    console.log(`🧹 清理完成，删除了 ${deletePromises.length} 个旧缓存`);
  }

  /**
   * 版本更新检查
   */
  async checkForUpdates() {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('🔄 检查更新完成');
      }
    } catch (error) {
      console.error('❌ 更新检查失败:', error);
    }
  }

  /**
   * 获取当前状态信息
   */
  getStatusInfo() {
    return {
      version: this.currentVersion,
      cachePrefix: this.cachePrefix,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  }
}

// 全局生命周期管理器实例
const lifecycleManager = new ServiceWorkerLifecycleManager();

// 在 Service Worker 中使用
if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
  // 安装事件
  self.addEventListener('install', (event) => {
    event.waitUntil(lifecycleManager.handleInstall(event));
  });

  // 激活事件
  self.addEventListener('activate', (event) => {
    event.waitUntil(lifecycleManager.handleActivate(event));
  });
}
```

### 2.4 生命周期事件详解

#### Install 事件

```javascript
/**
 * 安装事件处理 - 仅触发一次
 */
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker 安装事件触发');
  
  event.waitUntil(
    Promise.all([
      // 缓存核心资源
      caches.open('core-v1').then(cache => 
        cache.addAll([
          '/app.html',
          '/app.css', 
          '/app.js'
        ])
      ),
      
      // 初始化数据库
      initializeDatabase(),
      
      // 设置默认配置
      setDefaultSettings()
    ]).then(() => {
      console.log('✅ 安装完成，准备激活');
      // 强制激活新版本
      return self.skipWaiting();
    })
  );
});

async function initializeDatabase() {
  // IndexedDB 初始化逻辑
  console.log('🗃️ 初始化本地数据库');
}

async function setDefaultSettings() {
  // 默认设置配置
  console.log('⚙️ 配置默认设置');
}
```

#### Activate 事件

```javascript
/**
 * 激活事件处理 - 版本更新时触发
 */
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker 激活事件触发');
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      cleanupCaches(),
      
      // 迁移数据
      migrateData(),
      
      // 立即控制页面
      clients.claim()
    ]).then(() => {
      console.log('✅ 激活完成，开始服务');
    })
  );
});

async function cleanupCaches() {
  const cacheWhitelist = ['core-v1', 'api-v1'];
  const cacheNames = await caches.keys();
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!cacheWhitelist.includes(cacheName)) {
        console.log(`🗑️ 删除过期缓存: ${cacheName}`);
        return caches.delete(cacheName);
      }
    })
  );
}

async function migrateData() {
  // 数据迁移逻辑
  console.log('🔄 数据迁移完成');
}
```

---

## 3. 注册与基本使用

### 3.1 注册 Service Worker

```javascript
/**
 * Service Worker 注册管理器
 */
class ServiceWorkerRegistrationManager {
  constructor(options = {}) {
    this.swPath = options.swPath || '/sw.js';
    this.scope = options.scope || '/';
    this.updateInterval = options.updateInterval || 24 * 60 * 60 * 1000; // 24小时
    this.registration = null;
  }

  /**
   * 注册 Service Worker
   */
  async register() {
    if (!('serviceWorker' in navigator)) {
      console.warn('❌ 此浏览器不支持 Service Worker');
      return null;
    }

    try {
      console.log('🚀 开始注册 Service Worker...');
      
      this.registration = await navigator.serviceWorker.register(this.swPath, {
        scope: this.scope,
        updateViaCache: 'none' // 确保检查更新
      });

      console.log('✅ Service Worker 注册成功');
      console.log('📍 作用域:', this.registration.scope);

      // 设置事件监听器
      this.setupEventListeners();
      
      // 检查不同状态的 Service Worker
      await this.checkServiceWorkerStates();
      
      // 设置定期更新检查
      this.setupUpdateChecker();

      return this.registration;

    } catch (error) {
      console.error('❌ Service Worker 注册失败:', error);
      throw error;
    }
  }

  /**
   * 检查 Service Worker 状态
   */
  async checkServiceWorkerStates() {
    if (!this.registration) return;

    if (this.registration.installing) {
      console.log('⏳ Service Worker 正在安装...');
      this.trackWorkerState(this.registration.installing, 'installing');
    }
    
    if (this.registration.waiting) {
      console.log('⏸️ Service Worker 已安装，等待激活');
      this.showUpdateAvailable();
    }
    
    if (this.registration.active) {
      console.log('✅ Service Worker 已激活并运行');
      this.trackWorkerState(this.registration.active, 'active');
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听 Service Worker 状态变化
    this.registration.addEventListener('updatefound', () => {
      console.log('🔄 发现 Service Worker 更新');
      
      const newWorker = this.registration.installing;
      if (newWorker) {
        this.trackWorkerState(newWorker, 'installing');
      }
    });

    // 监听 Controller 变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker Controller 已变更');
      window.location.reload(); // 可选：重新加载页面
    });

    // 监听消息
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('📨 收到 Service Worker 消息:', event.data);
      this.handleMessage(event.data);
    });
  }

  /**
   * 跟踪 Worker 状态变化
   */
  trackWorkerState(worker, initialState) {
    console.log(`👀 开始跟踪 ${initialState} 状态的 Worker`);
    
    worker.addEventListener('statechange', (event) => {
      const state = event.target.state;
      console.log(`🔄 Worker 状态变更: ${initialState} -> ${state}`);
      
      switch (state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            this.showUpdateAvailable();
          } else {
            console.log('✅ Service Worker 首次安装完成');
          }
          break;
          
        case 'activated':
          console.log('🎉 Service Worker 激活完成');
          break;
          
        case 'redundant':
          console.log('♻️ Service Worker 已被替换');
          break;
      }
    });
  }

  /**
   * 显示更新可用通知
   */
  showUpdateAvailable() {
    console.log('🆕 新版本可用');
    
    // 可以在这里显示用户通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('应用更新可用', {
        body: '点击刷新页面以使用新版本',
        icon: '/icons/icon-192.png',
        tag: 'sw-update'
      });
    }
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('sw-update-available', {
      detail: { registration: this.registration }
    }));
  }

  /**
   * 处理来自 Service Worker 的消息
   */
  handleMessage(data) {
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('📦 缓存已更新:', data.payload);
        break;
        
      case 'BACKGROUND_SYNC':
        console.log('🔄 后台同步完成:', data.payload);
        break;
        
      case 'PUSH_RECEIVED':
        console.log('📧 收到推送消息:', data.payload);
        break;
        
      default:
        console.log('📨 未知消息类型:', data);
    }
  }

  /**
   * 设置定期更新检查
   */
  setupUpdateChecker() {
    setInterval(() => {
      if (this.registration) {
        console.log('🔍 检查 Service Worker 更新...');
        this.registration.update();
      }
    }, this.updateInterval);
  }

  /**
   * 手动检查更新
   */
  async checkForUpdate() {
    if (!this.registration) {
      console.warn('⚠️ Service Worker 未注册');
      return;
    }

    try {
      await this.registration.update();
      console.log('🔄 更新检查完成');
    } catch (error) {
      console.error('❌ 更新检查失败:', error);
    }
  }

  /**
   * 强制激活等待中的 Service Worker
   */
  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      // 向等待中的 SW 发送消息
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    }
    return false;
  }

  /**
   * 注销 Service Worker
   */
  async unregister() {
    if (this.registration) {
      const result = await this.registration.unregister();
      console.log(result ? '✅ Service Worker 注销成功' : '❌ Service Worker 注销失败');
      return result;
    }
    return false;
  }

  /**
   * 获取注册信息
   */
  getRegistrationInfo() {
    if (!this.registration) return null;
    
    return {
      scope: this.registration.scope,
      updateViaCache: this.registration.updateViaCache,
      installing: !!this.registration.installing,
      waiting: !!this.registration.waiting,
      active: !!this.registration.active,
      controller: !!navigator.serviceWorker.controller
    };
  }
}

// 使用示例
const swManager = new ServiceWorkerRegistrationManager({
  swPath: '/sw.js',
  scope: '/',
  updateInterval: 30 * 60 * 1000 // 30分钟检查一次更新
});

// 注册 Service Worker
swManager.register().catch(console.error);

// 监听更新事件
window.addEventListener('sw-update-available', (event) => {
  const userConfirmed = confirm('发现新版本，是否立即更新？');
  if (userConfirmed) {
    swManager.skipWaiting();
  }
});
```

### 3.2 Service Worker 文件基础结构

```javascript
/**
 * Service Worker 主文件 (sw.js)
 */

// 版本和缓存配置
const SW_VERSION = '1.2.0';
const CACHE_NAME = `app-cache-${SW_VERSION}`;
const STATIC_CACHE = `static-${SW_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${SW_VERSION}`;

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// 动态缓存白名单
const CACHE_WHITELIST = [
  'https://api.example.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

/**
 * 安装事件 - 预缓存静态资源
 */
self.addEventListener('install', (event) => {
  console.log(`📦 SW ${SW_VERSION} 安装事件`);
  
  event.waitUntil(
    Promise.all([
      // 预缓存静态资源
      caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(STATIC_ASSETS))
        .then(() => console.log('✅ 静态资源缓存完成')),
      
      // 跳过等待，立即激活
      self.skipWaiting()
    ])
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log(`🚀 SW ${SW_VERSION} 激活事件`);
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(SW_VERSION)) {
              console.log(`🗑️ 删除旧缓存: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // 立即控制所有页面
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker 激活完成');
      
      // 通知所有客户端更新完成
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: SW_VERSION
          });
        });
      });
    })
  );
});

/**
 * 监听来自主线程的消息
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage(SW_VERSION);
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage('缓存清理完成');
      });
      break;
      
    default:
      console.log('📨 未知消息类型:', type);
  }
});

/**
 * 清理所有缓存
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🧹 所有缓存已清理');
}
```

---

## 4. 缓存策略与管理

### 4.1 缓存策略

Service Worker 提供了多种缓存策略，以满足不同的应用需求。

- **Cache-First 策略**：优先从缓存加载资源，如果缓存中没有，则从网络加载。适用于静态资源和频繁访问的资源。
- **Network-First 策略**：优先从网络加载资源，如果网络不可用，则从缓存加载。适用于需要实时更新的资源。
- **Stale-While-Revalidate 策略**：在缓存中提供资源，同时向服务器请求更新。适用于需要快速响应但允许稍后更新的资源。
- **Cache-Only 策略**：仅从缓存加载资源，适用于完全离线应用。
- **Network-Only 策略**：仅从网络加载资源，适用于需要实时更新的资源。

### 4.2 缓存管理

```javascript
/**
 * 缓存管理器
 */
class CacheManager {
  constructor() {
    this.cacheName = 'app-cache'; // 默认缓存名称
    this.version = '1.0.0'; // 默认版本
    this.staticResources = [];
    this.dynamicResources = [];
  }

  /**
   * 初始化缓存
   */
  async initializeCache() {
    const cache = await caches.open(this.cacheName);
    await cache.addAll(this.staticResources);
    console.log('✅ 缓存初始化完成');
  }

  /**
   * 缓存资源
   */
  async cacheResource(request, response) {
    const cache = await caches.open(this.cacheName);
    await cache.put(request, response);
    console.log(`✅ 资源缓存成功: ${request.url}`);
  }

  /**
   * 从缓存获取资源
   */
  async getResourceFromCache(request) {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(request);
    if (response) {
      console.log(`✅ 从缓存加载资源: ${request.url}`);
      return response;
    }
    console.log(`❌ 缓存未命中: ${request.url}`);
    return null;
  }

  /**
   * 清理缓存
   */
  async clearCache() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🧹 缓存已清理');
  }

  /**
   * 获取缓存大小
   */
  async getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      for (const key of keys) {
        const response = await key.response;
        totalSize += response.size;
      }
    }
    return totalSize;
  }

  /**
   * 获取缓存列表
   */
  async getCacheList() {
    const cacheNames = await caches.keys();
    const cacheList = [];
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      for (const key of keys) {
        cacheList.push({
          name: name,
          url: key.url,
          method: key.method,
          status: key.response.status,
          statusText: key.response.statusText
        });
      }
    }
    return cacheList;
  }
}

// 使用示例
const cacheManager = new CacheManager();

// 初始化缓存
cacheManager.initializeCache().catch(console.error);

// 缓存资源
cacheManager.cacheResource(new Request('/api/data'), new Response('{"message": "Hello from cache"}')).catch(console.error);

// 从缓存获取资源
cacheManager.getResourceFromCache(new Request('/api/data')).then(response => {
  if (response) {
    console.log('缓存资源内容:', response.json());
  }
}).catch(console.error);

// 清理缓存
cacheManager.clearCache().catch(console.error);

// 获取缓存大小
cacheManager.getCacheSize().then(size => {
  console.log('缓存总大小:', size, '字节');
}).catch(console.error);

// 获取缓存列表
cacheManager.getCacheList().then(list => {
  console.log('缓存列表:', list);
}).catch(console.error);
```

### 4.3 缓存策略示例

```javascript
/**
 * 缓存策略示例
 */
const cacheStrategies = {
  // Cache-First 策略
  cacheFirst: async ({ request, preloadResponsePromise, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      await caches.open('dynamic-cache').then(cache => cache.put(request, preloadResponse.clone()));
      return preloadResponse;
    }

    try {
      const responseFromNetwork = await fetch(request);
      await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
      return responseFromNetwork;
    } catch (error) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },

  // Network-First 策略
  networkFirst: async ({ request, preloadResponsePromise, fallbackUrl }) => {
    try {
      const responseFromNetwork = await fetch(request);
      await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
      return responseFromNetwork;
    } catch (error) {
      const responseFromCache = await caches.match(request);
      if (responseFromCache) {
        return responseFromCache;
      }
      
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },

  // Stale-While-Revalidate 策略
  staleWhileRevalidate: async ({ request }) => {
    const responseFromCache = await caches.match(request);
    
    // 后台更新
    const fetchPromise = fetch(request).then(response => {
      const cache = caches.open('dynamic-cache');
      cache.then(c => c.put(request, response.clone()));
      return response;
    });

    // 返回缓存版本或等待网络响应
    return responseFromCache || fetchPromise;
  },

  // Cache-Only 策略
  cacheOnly: async ({ request }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    
    return new Response("Resource not available offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  },

  // Network-Only 策略
  networkOnly: async ({ request }) => {
    return fetch(request);
  }
};

// 在 Service Worker 中使用缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 根据资源类型选择策略
  if (request.destination === 'document') {
    // HTML 文档使用 Network-First
    event.respondWith(
      cacheStrategies.networkFirst({
        request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: '/offline.html'
      })
    );
  } else if (request.destination === 'image') {
    // 图片使用 Cache-First
    event.respondWith(
      cacheStrategies.cacheFirst({
        request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: '/images/placeholder.png'
      })
    );
  } else if (url.pathname.startsWith('/api/')) {
    // API 请求使用 Stale-While-Revalidate
    event.respondWith(
      cacheStrategies.staleWhileRevalidate({ request })
    );
  } else {
    // 其他资源使用 Cache-First
    event.respondWith(
      cacheStrategies.cacheFirst({
        request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: '/offline.html'
      })
    );
  }
});
```

---

## 5. 核心 API 详解

### 5.1 ServiceWorkerContainer

ServiceWorkerContainer 表示 Service Worker 作为网络系统中的整体单元，提供注册、注销和更新功能。

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `controller` | ServiceWorker | 当前激活的 Service Worker |
| `ready` | Promise | Service Worker 准备就绪的 Promise |
| `register()` | Method | 注册 Service Worker |
| `getRegistration()` | Method | 获取注册信息 |
| `getRegistrations()` | Method | 获取所有注册信息 |
| `startMessage()` | Method | 启动消息分发 |

```javascript
/**
 * ServiceWorkerContainer 完整使用示例
 */
class ServiceWorkerController {
  constructor() {
    this.container = navigator.serviceWorker;
    this.registrations = new Map();
  }

  /**
   * 检查浏览器支持
   */
  isSupported() {
    return 'serviceWorker' in navigator;
  }

  /**
   * 注册 Service Worker
   */
  async register(scriptURL, options = {}) {
    if (!this.isSupported()) {
      throw new Error('Service Worker 不被支持');
    }

    try {
      const registration = await this.container.register(scriptURL, {
        scope: options.scope || '/',
        updateViaCache: options.updateViaCache || 'imports'
      });

      console.log('✅ Service Worker 注册成功:', registration.scope);
      this.registrations.set(registration.scope, registration);

      // 设置事件监听
      this.setupRegistrationListeners(registration);

      return registration;
    } catch (error) {
      console.error('❌ Service Worker 注册失败:', error);
      throw error;
    }
  }

  /**
   * 设置注册相关事件监听
   */
  setupRegistrationListeners(registration) {
    // 监听更新发现
    registration.addEventListener('updatefound', () => {
      console.log('🔄 发现 Service Worker 更新');
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 新的 Service Worker 可用
              this.notifyUpdateAvailable(registration);
            } else {
              // 首次安装完成
              console.log('✅ Service Worker 首次安装完成');
            }
          }
        });
      }
    });

    // 监听控制器变化
    this.container.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker 控制器变更');
      window.location.reload();
    });

    // 监听消息
    this.container.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });
  }

  /**
   * 通知用户更新可用
   */
  notifyUpdateAvailable(registration) {
    // 创建自定义事件
    const updateEvent = new CustomEvent('sw-update-available', {
      detail: { registration }
    });
    window.dispatchEvent(updateEvent);

    // 显示用户提示
    if (confirm('发现新版本，是否立即更新？')) {
      this.skipWaiting(registration);
    }
  }

  /**
   * 跳过等待，立即激活新版本
   */
  skipWaiting(registration) {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  /**
   * 处理来自 Service Worker 的消息
   */
  handleServiceWorkerMessage(event) {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'SW_ACTIVATED':
        console.log('🎉 Service Worker 已激活，版本:', payload.version);
        break;
        
      case 'CACHE_UPDATED':
        console.log('📦 缓存已更新:', payload);
        break;
        
      case 'OFFLINE_READY':
        console.log('📴 离线模式已准备就绪');
        break;
        
      default:
        console.log('📨 未知消息:', event.data);
    }
  }

  /**
   * 获取当前控制器信息
   */
  getControllerInfo() {
    const controller = this.container.controller;
    if (controller) {
      return {
        scriptURL: controller.scriptURL,
        state: controller.state
      };
    }
    return null;
  }

  /**
   * 等待 Service Worker 准备就绪
   */
  async waitForReady() {
    try {
      const registration = await this.container.ready;
      console.log('✅ Service Worker 已准备就绪');
      return registration;
    } catch (error) {
      console.error('❌ 等待 Service Worker 就绪失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有注册信息
   */
  async getAllRegistrations() {
    try {
      const registrations = await this.container.getRegistrations();
      return registrations.map(reg => ({
        scope: reg.scope,
        updateViaCache: reg.updateViaCache,
        installing: !!reg.installing,
        waiting: !!reg.waiting,
        active: !!reg.active
      }));
    } catch (error) {
      console.error('❌ 获取注册信息失败:', error);
      return [];
    }
  }

  /**
   * 向 Service Worker 发送消息
   */
  async sendMessage(message) {
    if (this.container.controller) {
      this.container.controller.postMessage(message);
    } else {
      console.warn('⚠️ 没有活跃的 Service Worker 控制器');
    }
  }

  /**
   * 注销所有 Service Worker
   */
  async unregisterAll() {
    try {
      const registrations = await this.container.getRegistrations();
      const results = await Promise.all(
        registrations.map(reg => reg.unregister())
      );
      
      console.log(`✅ 成功注销 ${results.filter(Boolean).length} 个 Service Worker`);
      this.registrations.clear();
      
      return results;
    } catch (error) {
      console.error('❌ 注销 Service Worker 失败:', error);
      throw error;
    }
  }
}

// 使用示例
const swController = new ServiceWorkerController();

// 注册 Service Worker
swController.register('/sw.js', {
  scope: '/',
  updateViaCache: 'none'
}).then(registration => {
  console.log('注册成功:', registration);
}).catch(console.error);

// 监听更新事件
window.addEventListener('sw-update-available', (event) => {
  console.log('收到更新通知:', event.detail);
});

// 等待就绪
swController.waitForReady().then(registration => {
  console.log('Service Worker 就绪:', registration);
});
```
      await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
      return responseFromNetwork;
    } catch (error) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },

  // Stale-While-Revalidate 策略
  staleWhileRevalidate: async ({ request, preloadResponsePromise, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      const revalidationRequest = new Request(request.url, { method: 'GET', headers: new Headers(request.headers) });
      try {
        const responseFromNetwork = await fetch(revalidationRequest);
        await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
        return responseFromNetwork;
      } catch (error) {
        return responseFromCache; // 返回缓存资源
      }
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      await caches.open('dynamic-cache').then(cache => cache.put(request, preloadResponse.clone()));
      return preloadResponse;
    }

    try {
      const responseFromNetwork = await fetch(request);
      await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
      return responseFromNetwork;
    } catch (error) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },

  // Cache-Only 策略
  cacheOnly: async ({ request }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    return new Response("Resource not found in cache", { status: 404 });
  },

  // Network-Only 策略
  networkOnly: async ({ request }) => {
    try {
      const responseFromNetwork = await fetch(request);
      return responseFromNetwork;
    } catch (error) {
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
};

// 使用示例
const strategy = cacheStrategies.cacheFirst; // 选择一个策略

// 模拟 fetch 事件
self.addEventListener('fetch', (event) => {
  event.respondWith(
    strategy({
      request: event.request,
      preloadResponsePromise: event.preloadResponse, // 如果需要预加载
      fallbackUrl: '/fallback.html' // 可选的降级 URL
    })
  );
});
```

---

## 5. 核心 API 详解

### 5.1 注册与注销

```javascript
/**
 * 注册 Service Worker
 */
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      // navigator.serviceWorker：ServiceWorkerContainer对象
      // registration:ServiceWorkerRegistration对象
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      // 获取不同状态的service worker
      if (registration.installing) {
        console.log("正在安装 Service worker");
      } else if (registration.waiting) {
        console.log("已安装 Service worker installed");
      } else if (registration.active) {
        console.log("激活 Service worker");
      }
    } catch (error) {
      console.error(`注册失败：${error}`);
    }
  }
};
registerServiceWorker();

/**
 * 注销 Service Worker
 */
const unregisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.unregister().then(() => {
            console.log("Service Worker 已注销");
          }).catch(error => {
            console.error(`注销失败：${error}`);
          });
        } else {
          console.log("Service Worker 未注册");
        }
      });
    } catch (error) {
      console.error(`注销失败：${error}`);
    }
  }
};
unregisterServiceWorker();
```

### 5.2 生命周期管理

```javascript
/**
 * Service Worker 生命周期管理器
 */
class ServiceWorkerLifecycleManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.cachePrefix = 'app-cache';
    this.staticCaches = [];
    this.dynamicCaches = [];
  }

  /**
   * 安装阶段 - 预缓存关键资源
   */
  async handleInstall(event) {
    console.log(`🔧 Service Worker ${this.currentVersion} 安装中...`);
    
    // 预缓存静态资源
    const staticResources = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/app.js',
      '/manifest.json',
      '/icons/icon-192.png'
    ];

    try {
      const cache = await caches.open(`${this.cachePrefix}-static-${this.currentVersion}`);
      await cache.addAll(staticResources);
      
      console.log('✅ 静态资源预缓存完成');
      
      // 跳过等待，立即激活新版本
      if (event && typeof event.waitUntil === 'function') {
        event.waitUntil(self.skipWaiting());
      }
      
    } catch (error) {
      console.error('❌ 安装阶段失败:', error);
      throw error;
    }
  }

  /**
   * 激活阶段 - 清理旧缓存
   */
  async handleActivate(event) {
    console.log(`🚀 Service Worker ${this.currentVersion} 激活中...`);
    
    try {
      // 清理旧版本缓存
      await this.cleanupOldCaches();
      
      // 立即控制所有页面
      await clients.claim();
      
      console.log('✅ Service Worker 激活完成');
      
    } catch (error) {
      console.error('❌ 激活阶段失败:', error);
      throw error;
    }
  }

  /**
   * 清理旧版本缓存
   */
  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [
      `${this.cachePrefix}-static-${this.currentVersion}`,
      `${this.cachePrefix}-dynamic-${this.currentVersion}`
    ];

    const deletePromises = cacheNames
      .filter(cacheName => 
        cacheName.startsWith(this.cachePrefix) && 
        !currentCaches.includes(cacheName)
      )
      .map(cacheName => {
        console.log(`🗑️ 删除旧缓存: ${cacheName}`);
        return caches.delete(cacheName);
      });

    await Promise.all(deletePromises);
    console.log(`🧹 清理完成，删除了 ${deletePromises.length} 个旧缓存`);
  }

  /**
   * 版本更新检查
   */
  async checkForUpdates() {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('🔄 检查更新完成');
      }
    } catch (error) {
      console.error('❌ 更新检查失败:', error);
    }
  }

  /**
   * 获取当前状态信息
   */
  getStatusInfo() {
    return {
      version: this.currentVersion,
      cachePrefix: this.cachePrefix,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  }
}

// 全局生命周期管理器实例
const lifecycleManager = new ServiceWorkerLifecycleManager();

// 在 Service Worker 中使用
if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
  // 安装事件
  self.addEventListener('install', (event) => {
    event.waitUntil(lifecycleManager.handleInstall(event));
  });

  // 激活事件
  self.addEventListener('activate', (event) => {
    event.waitUntil(lifecycleManager.handleActivate(event));
  });
}
```

### 5.3 缓存与存储

```javascript
/**
 * 缓存管理器
 */
class CacheManager {
  constructor() {
    this.cacheName = 'app-cache'; // 默认缓存名称
    this.version = '1.0.0'; // 默认版本
    this.staticResources = [];
    this.dynamicResources = [];
  }

  /**
   * 初始化缓存
   */
  async initializeCache() {
    const cache = await caches.open(this.cacheName);
    await cache.addAll(this.staticResources);
    console.log('✅ 缓存初始化完成');
  }

  /**
   * 缓存资源
   */
  async cacheResource(request, response) {
    const cache = await caches.open(this.cacheName);
    await cache.put(request, response);
    console.log(`✅ 资源缓存成功: ${request.url}`);
  }

  /**
   * 从缓存获取资源
   */
  async getResourceFromCache(request) {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(request);
    if (response) {
      console.log(`✅ 从缓存加载资源: ${request.url}`);
      return response;
    }
    console.log(`❌ 缓存未命中: ${request.url}`);
    return null;
  }

  /**
   * 清理缓存
   */
  async clearCache() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🧹 缓存已清理');
  }

  /**
   * 获取缓存大小
   */
  async getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      for (const key of keys) {
        const response = await key.response;
        totalSize += response.size;
      }
    }
    return totalSize;
  }

  /**
   * 获取缓存列表
   */
  async getCacheList() {
    const cacheNames = await caches.keys();
    const cacheList = [];
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      for (const key of keys) {
        cacheList.push({
          name: name,
          url: key.url,
          method: key.method,
          status: key.response.status,
          statusText: key.response.statusText
        });
      }
    }
    return cacheList;
  }
}

// 使用示例
const cacheManager = new CacheManager();

// 初始化缓存
cacheManager.initializeCache().catch(console.error);

// 缓存资源
cacheManager.cacheResource(new Request('/api/data'), new Response('{"message": "Hello from cache"}')).catch(console.error);

// 从缓存获取资源
cacheManager.getResourceFromCache(new Request('/api/data')).then(response => {
  if (response) {
    console.log('缓存资源内容:', response.json());
  }
}).catch(console.error);

// 清理缓存
cacheManager.clearCache().catch(console.error);

// 获取缓存大小
cacheManager.getCacheSize().then(size => {
  console.log('缓存总大小:', size, '字节');
}).catch(console.error);

// 获取缓存列表
cacheManager.getCacheList().then(list => {
  console.log('缓存列表:', list);
}).catch(console.error);
```

### 5.4 推送通知

```javascript
/**
 * 推送通知管理器
 */
class PushNotificationManager {
  constructor() {
    this.pushManager = null;
    this.subscription = null;
  }

  /**
   * 请求推送权限
   */
  async requestPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ 推送权限已授予');
        this.pushManager = await self.registration.pushManager;
        this.subscription = await this.pushManager.getSubscription();
        console.log('✅ 推送订阅成功');
      } else {
        console.warn('❌ 推送权限未授予');
      }
    } else {
      console.log('✅ 推送权限已授予');
      this.pushManager = await self.registration.pushManager;
      this.subscription = await this.pushManager.getSubscription();
      console.log('✅ 推送订阅成功');
    }
  }

  /**
   * 订阅推送服务
   */
  async subscribe() {
    if (!this.pushManager) {
      console.warn('❌ PushManager 未初始化');
      return null;
    }

    try {
      this.subscription = await this.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          'YOUR_VAPID_PUBLIC_KEY' // 替换为你的 VAPID 公钥
        )
      });
      console.log('✅ 推送订阅成功');
      return this.subscription;
    } catch (error) {
      console.error('❌ 推送订阅失败:', error);
      throw error;
    }
  }

  /**
   * 取消订阅推送服务
   */
  async unsubscribe() {
    if (!this.subscription) {
      console.warn('❌ 推送订阅不存在');
      return;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('✅ 推送订阅已取消');
    } catch (error) {
      console.error('❌ 取消推送订阅失败:', error);
    }
  }

  /**
   * 发送推送通知
   */
  async sendNotification(title, options = {}) {
    if (!this.pushManager) {
      console.warn('❌ PushManager 未初始化');
      return;
    }

    try {
      await this.pushManager.sendNotification(title, options);
      console.log('✅ 推送通知发送成功');
    } catch (error) {
      console.error('❌ 推送通知发送失败:', error);
    }
  }

  /**
   * 处理推送事件
   */
  async handlePushEvent(event) {
    if (event.data) {
      const data = event.data.json();
      console.log('📧 收到推送数据:', data);
      // 根据推送数据执行相应操作
      if (data.type === 'NEW_MESSAGE') {
        await this.sendNotification('新消息', { body: `来自 ${data.sender}: ${data.message}` });
      }
    }
  }
}

// 使用示例
const pushManager = new PushNotificationManager();

// 请求推送权限
pushManager.requestPermission().catch(console.error);

// 订阅推送服务
pushManager.subscribe().then(subscription => {
  if (subscription) {
    console.log('推送订阅 ID:', subscription.toJSON());
  }
}).catch(console.error);

// 发送推送通知
pushManager.sendNotification('测试推送', { body: '这是一条测试推送' }).catch(console.error);

// 监听推送事件
self.addEventListener('push', (event) => {
  pushManager.handlePushEvent(event).catch(console.error);
});
```

### 5.5 后台同步

```javascript
/**
 * 后台同步管理器
 */
class BackgroundSyncManager {
  constructor() {
    this.syncManager = null;
  }

  /**
   * 注册后台同步任务
   */
  async registerSyncTask(tag, data) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return;
    }

    try {
      await this.syncManager.register(tag, data);
      console.log(`✅ 后台同步任务 "${tag}" 注册成功`);
    } catch (error) {
      console.error('❌ 注册后台同步任务失败:', error);
    }
  }

  /**
   * 获取后台同步任务状态
   */
  async getSyncStatus(tag) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return null;
    }

    try {
      const status = await this.syncManager.get(tag);
      console.log(`✅ 后台同步任务 "${tag}" 状态:`, status);
      return status;
    } catch (error) {
      console.error('❌ 获取后台同步任务状态失败:', error);
      return null;
    }
  }

  /**
   * 处理后台同步事件
   */
  async handleSyncEvent(event) {
    if (event.tag) {
      console.log(`🔄 收到后台同步事件: ${event.tag}`);
      // 根据事件类型执行相应操作
      if (event.tag === 'sync-messages') {
        await this.registerSyncTask('sync-messages', { message: 'Hello from SW' });
        console.log('✅ 后台同步任务 "sync-messages" 已触发');
      }
    }
  }
}

// 使用示例
const syncManager = new BackgroundSyncManager();

// 注册后台同步任务
syncManager.registerSyncTask('sync-messages', { message: 'Hello from SW' }).catch(console.error);

// 获取后台同步任务状态
syncManager.getSyncStatus('sync-messages').then(status => {
  if (status) {
    console.log('后台同步任务 "sync-messages" 状态:', status);
  }
}).catch(console.error);

// 监听后台同步事件
self.addEventListener('sync', (event) => {
  syncManager.handleSyncEvent(event).catch(console.error);
});
```

---

## 6. 高级功能应用

### 6.1 离线页面

```javascript
/**
 * 离线页面管理器
 */
class OfflinePageManager {
  constructor() {
    this.offlinePageUrl = '/offline.html';
    this.offlineCacheName = 'offline-page';
  }

  /**
   * 缓存离线页面
   */
  async cacheOfflinePage() {
    const response = await fetch(this.offlinePageUrl);
    if (response.ok) {
      const cache = await caches.open(this.offlineCacheName);
      await cache.put(new Request(this.offlinePageUrl), response);
      console.log('✅ 离线页面缓存成功');
    } else {
      console.error('❌ 离线页面加载失败:', response.status);
    }
  }

  /**
   * 显示离线页面
   */
  async showOfflinePage() {
    const response = await caches.match(this.offlinePageUrl);
    if (response) {
      const html = await response.text();
      const offlinePage = document.createElement('div');
      offlinePage.innerHTML = html;
      document.body.innerHTML = ''; // 清空当前页面内容
      document.body.appendChild(offlinePage);
      console.log('✅ 离线页面显示成功');
    } else {
      console.error('❌ 离线页面未找到');
    }
  }

  /**
   * 监听离线事件
   */
  setupOfflineListeners() {
    self.addEventListener('offline', () => {
      console.log('📶 网络已断开');
      this.showOfflinePage();
    });

    self.addEventListener('online', () => {
      console.log('📶 网络已恢复');
      // 可以在这里重新尝试发送离线请求
    });
  }
}

// 使用示例
const offlineManager = new OfflinePageManager();

// 缓存离线页面
offlineManager.cacheOfflinePage().catch(console.error);

// 监听离线事件
offlineManager.setupOfflineListeners();
```

### 6.2 预加载

```javascript
/**
 * 导航预加载管理器
 */
class NavigationPreloadManager {
  constructor() {
    this.preloadEnabled = false;
  }

  /**
   * 启用导航预加载
   */
  async enable() {
    if (self.registration && self.registration.navigationPreload) {
      try {
        await self.registration.navigationPreload.enable();
        this.preloadEnabled = true;
        console.log('✅ 导航预加载已启用');
      } catch (error) {
        console.error('❌ 启用导航预加载失败:', error);
      }
    } else {
      console.warn('❌ 浏览器不支持 navigationPreload');
    }
  }

  /**
   * 禁用导航预加载
   */
  async disable() {
    if (self.registration && self.registration.navigationPreload) {
      try {
        await self.registration.navigationPreload.disable();
        this.preloadEnabled = false;
        console.log('✅ 导航预加载已禁用');
      } catch (error) {
        console.error('❌ 禁用导航预加载失败:', error);
      }
    } else {
      console.warn('❌ 浏览器不支持 navigationPreload');
    }
  }

  /**
   * 监听导航事件
   */
  setupNavigationListeners() {
    self.addEventListener('navigate', (event) => {
      if (event.preloadResponse) {
        console.log('🚀 导航预加载成功');
        // 可以在这里处理预加载的响应
      } else {
        console.log('🚀 导航预加载失败或未启用');
      }
    });
  }
}

// 使用示例
const preloadManager = new NavigationPreloadManager();

// 启用导航预加载
preloadManager.enable().catch(console.error);

// 监听导航事件
preloadManager.setupNavigationListeners();
```

### 6.3 后台 fetch

```javascript
/**
 * 后台 fetch 管理器
 */
class BackgroundFetchManager {
  constructor() {
    this.fetchManager = null;
  }

  /**
   * 初始化后台 fetch
   */
  async initialize() {
    if ("BackgroundFetchManager" in self) {
      this.fetchManager = self.registration.backgroundFetch;
      if (this.fetchManager) {
        console.log('✅ 后台 fetch 已初始化');
      } else {
        console.warn('❌ 浏览器不支持 BackgroundFetchManager');
      }
    } else {
      console.warn('❌ 浏览器不支持 BackgroundFetchManager');
    }
  }

  /**
   * 发起后台 fetch
   */
  async fetch(id, urls, options = {}) {
    if (!this.fetchManager) {
      console.warn('❌ BackgroundFetchManager 未初始化');
      return null;
    }

    try {
      const registration = await this.fetchManager.fetch(id, urls, options);
      console.log(`✅ 后台 fetch "${id}" 发起成功`);
      return registration;
    } catch (error) {
      console.error('❌ 发起后台 fetch 失败:', error);
      throw error;
    }
  }

  /**
   * 监听后台 fetch 事件
   */
  setupBackgroundFetchListeners() {
    if (this.fetchManager) {
      self.addEventListener('backgroundfetchabort', (event) => {
        console.log('📴 后台 fetch 已中止:', event.id);
      });
      self.addEventListener('backgroundfetchclick', (event) => {
        console.log('👆 用户点击后台 fetch:', event.id);
      });
      self.addEventListener('backgroundfetchfail', (event) => {
        console.error('❌ 后台 fetch 失败:', event.id, event.reason);
      });
      self.addEventListener('backgroundfetchsuccess', (event) => {
        console.log('✅ 后台 fetch 成功:', event.id, event.result);
      });
    }
  }
}

// 使用示例
const backgroundFetchManager = new BackgroundFetchManager();

// 初始化后台 fetch
backgroundFetchManager.initialize().catch(console.error);

// 发起后台 fetch
backgroundFetchManager.fetch('my-fetch', ['/ep-5.mp3', 'ep-5-artwork.jpg']).catch(console.error);

// 监听后台 fetch 事件
backgroundFetchManager.setupBackgroundFetchListeners();
```

### 6.4 后台同步

```javascript
/**
 * 后台同步管理器
 */
class BackgroundSyncManager {
  constructor() {
    this.syncManager = null;
  }

  /**
   * 注册后台同步任务
   */
  async registerSyncTask(tag, data) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return;
    }

    try {
      await this.syncManager.register(tag, data);
      console.log(`✅ 后台同步任务 "${tag}" 注册成功`);
    } catch (error) {
      console.error('❌ 注册后台同步任务失败:', error);
    }
  }

  /**
   * 获取后台同步任务状态
   */
  async getSyncStatus(tag) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return null;
    }

    try {
      const status = await this.syncManager.get(tag);
      console.log(`✅ 后台同步任务 "${tag}" 状态:`, status);
      return status;
    } catch (error) {
      console.error('❌ 获取后台同步任务状态失败:', error);
      return null;
    }
  }

  /**
   * 处理后台同步事件
   */
  async handleSyncEvent(event) {
    if (event.tag) {
      console.log(`🔄 收到后台同步事件: ${event.tag}`);
      // 根据事件类型执行相应操作
      if (event.tag === 'sync-messages') {
        await this.registerSyncTask('sync-messages', { message: 'Hello from SW' });
        console.log('✅ 后台同步任务 "sync-messages" 已触发');
      }
    }
  }
}

// 使用示例
const syncManager = new BackgroundSyncManager();

// 注册后台同步任务
syncManager.registerSyncTask('sync-messages', { message: 'Hello from SW' }).catch(console.error);

// 获取后台同步任务状态
syncManager.getSyncStatus('sync-messages').then(status => {
  if (status) {
    console.log('后台同步任务 "sync-messages" 状态:', status);
  }
}).catch(console.error);

// 监听后台同步事件
self.addEventListener('sync', (event) => {
  syncManager.handleSyncEvent(event).catch(console.error);
});
```

---

## 7. 实际应用示例

### 7.1 离线应用

```javascript
/**
 * 离线应用示例
 */
const offlineApp = {
  /**
   * 缓存关键资源
   */
  async cacheResources() {
    const staticResources = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/app.js',
      '/manifest.json',
      '/icons/icon-192.png'
    ];

    try {
      const cache = await caches.open('app-cache');
      await cache.addAll(staticResources);
      console.log('✅ 静态资源缓存完成');
    } catch (error) {
      console.error('❌ 缓存资源失败:', error);
    }
  },

  /**
   * 监听离线事件
   */
  setupOfflineListeners() {
    self.addEventListener('offline', () => {
      console.log('�� 网络已断开');
      // 可以在这里显示离线页面或提示用户
    });

    self.addEventListener('online', () => {
      console.log('�� 网络已恢复');
      // 可以在这里重新尝试发送离线请求
    });
  },

  /**
   * 监听推送事件
   */
  setupPushListeners() {
    self.addEventListener('push', (event) => {
      if (event.data) {
        const data = event.data.json();
        console.log('📧 收到推送数据:', data);
        if (data.type === 'NEW_MESSAGE') {
          self.registration.showNotification('新消息', {
            body: `来自 ${data.sender}: ${data.message}`,
            icon: '/icons/icon-192.png'
          });
        }
      }
    });
  },

  /**
   * 监听后台同步事件
   */
  setupSyncListeners() {
    self.addEventListener('sync', (event) => {
      if (event.tag === 'sync-messages') {
        console.log('🔄 收到后台同步事件: sync-messages');
        // 可以在这里执行同步逻辑，例如发送请求到服务器
      }
    });
  }
};

// 注册 Service Worker
offlineApp.cacheResources().catch(console.error);
offlineApp.setupOfflineListeners();
offlineApp.setupPushListeners();
offlineApp.setupSyncListeners();
```

### 7.2 性能优化

```javascript
/**
 * 性能优化示例
 */
const performanceOptimizer = {
  /**
   * 缓存资源
   */
  async cacheResources() {
    const staticResources = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/app.js',
      '/manifest.json',
      '/icons/icon-192.png'
    ];

    try {
      const cache = await caches.open('app-cache');
      await cache.addAll(staticResources);
      console.log('✅ 静态资源缓存完成');
    } catch (error) {
      console.error('❌ 缓存资源失败:', error);
    }
  },

  /**
   * 监听 fetch 事件
   */
  setupFetchListeners() {
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        this.cacheFirst({
          request: event.request,
          preloadResponsePromise: event.preloadResponse,
          fallbackUrl: '/offline.html' // 离线降级页面
        })
      );
    });
  },

  /**
   * 缓存优先策略
   */
  async cacheFirst({ request, preloadResponsePromise, fallbackUrl }) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      await caches.open('dynamic-cache').then(cache => cache.put(request, preloadResponse.clone()));
      return preloadResponse;
    }

    try {
      const responseFromNetwork = await fetch(request);
      await caches.open('dynamic-cache').then(cache => cache.put(request, responseFromNetwork.clone()));
      return responseFromNetwork;
    } catch (error) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
};

// 注册 Service Worker
performanceOptimizer.cacheResources().catch(console.error);
performanceOptimizer.setupFetchListeners();
```

### 7.3 推送通知

```javascript
/**
 * 推送通知示例
 */
const pushNotificationApp = {
  /**
   * 请求推送权限
   */
  async requestPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ 推送权限已授予');
        this.pushManager = await self.registration.pushManager;
        this.subscription = await this.pushManager.getSubscription();
        console.log('✅ 推送订阅成功');
      } else {
        console.warn('❌ 推送权限未授予');
      }
    } else {
      console.log('✅ 推送权限已授予');
      this.pushManager = await self.registration.pushManager;
      this.subscription = await this.pushManager.getSubscription();
      console.log('✅ 推送订阅成功');
    }
  },

  /**
   * 订阅推送服务
   */
  async subscribe() {
    if (!this.pushManager) {
      console.warn('❌ PushManager 未初始化');
      return null;
    }

    try {
      this.subscription = await this.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          'YOUR_VAPID_PUBLIC_KEY' // 替换为你的 VAPID 公钥
        )
      });
      console.log('✅ 推送订阅成功');
      return this.subscription;
    } catch (error) {
      console.error('❌ 推送订阅失败:', error);
      throw error;
    }
  },

  /**
   * 发送推送通知
   */
  async sendNotification(title, options = {}) {
    if (!this.pushManager) {
      console.warn('❌ PushManager 未初始化');
      return;
    }

    try {
      await this.pushManager.sendNotification(title, options);
      console.log('✅ 推送通知发送成功');
    } catch (error) {
      console.error('❌ 推送通知发送失败:', error);
    }
  },

  /**
   * 监听推送事件
   */
  setupPushListeners() {
    self.addEventListener('push', (event) => {
      if (event.data) {
        const data = event.data.json();
        console.log('📧 收到推送数据:', data);
        if (data.type === 'NEW_MESSAGE') {
          self.registration.showNotification('新消息', {
            body: `来自 ${data.sender}: ${data.message}`,
            icon: '/icons/icon-192.png'
          });
        }
      }
    });
  }
};

// 注册 Service Worker
pushNotificationApp.requestPermission().catch(console.error);
pushNotificationApp.subscribe().then(subscription => {
  if (subscription) {
    console.log('推送订阅 ID:', subscription.toJSON());
  }
}).catch(console.error);
pushNotificationApp.sendNotification('测试推送', { body: '这是一条测试推送' }).catch(console.error);
pushNotificationApp.setupPushListeners();
```

### 7.4 后台同步

```javascript
/**
 * 后台同步示例
 */
const backgroundSyncApp = {
  /**
   * 注册后台同步任务
   */
  async registerSyncTask(tag, data) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return;
    }

    try {
      await this.syncManager.register(tag, data);
      console.log(`✅ 后台同步任务 "${tag}" 注册成功`);
    } catch (error) {
      console.error('❌ 注册后台同步任务失败:', error);
    }
  },

  /**
   * 获取后台同步任务状态
   */
  async getSyncStatus(tag) {
    if (!this.syncManager) {
      console.warn('❌ SyncManager 未初始化');
      return null;
    }

    try {
      const status = await this.syncManager.get(tag);
      console.log(`✅ 后台同步任务 "${tag}" 状态:`, status);
      return status;
    } catch (error) {
      console.error('❌ 获取后台同步任务状态失败:', error);
      return null;
    }
  },

  /**
   * 监听后台同步事件
   */
  setupSyncListeners() {
    self.addEventListener('sync', (event) => {
      if (event.tag === 'sync-messages') {
        console.log('🔄 收到后台同步事件: sync-messages');
        // 可以在这里执行同步逻辑，例如发送请求到服务器
      }
    });
  }
};

// 注册 Service Worker
backgroundSyncApp.registerSyncTask('sync-messages', { message: 'Hello from SW' }).catch(console.error);
backgroundSyncApp.getSyncStatus('sync-messages').then(status => {
  if (status) {
    console.log('后台同步任务 "sync-messages" 状态:', status);
  }
}).catch(console.error);
backgroundSyncApp.setupSyncListeners();
```

---

## 6. 高级功能应用

### 6.1 推送通知系统

```javascript
/**
 * 推送通知管理器
 */
class PushNotificationManager {
  constructor() {
    this.vapidPublicKey = 'your-vapid-public-key';
    this.subscription = null;
  }

  /**
   * 检查推送通知支持
   */
  isSupported() {
    return 'PushManager' in window && 'Notification' in window;
  }

  /**
   * 请求通知权限
   */
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('推送通知不被支持');
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ 通知权限已获取');
      return true;
    } else if (permission === 'denied') {
      console.log('❌ 用户拒绝了通知权限');
      return false;
    } else {
      console.log('⏸️ 用户未做决定');
      return false;
    }
  }

  /**
   * 订阅推送服务
   */
  async subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('✅ 推送订阅成功:', this.subscription);
      
      // 将订阅信息发送到服务器
      await this.sendSubscriptionToServer(this.subscription);
      
      return this.subscription;
    } catch (error) {
      console.error('❌ 推送订阅失败:', error);
      throw error;
    }
  }

  /**
   * 将订阅信息发送到服务器
   */
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        console.log('✅ 订阅信息已发送到服务器');
      } else {
        throw new Error('发送订阅信息失败');
      }
    } catch (error) {
      console.error('❌ 发送订阅信息到服务器失败:', error);
      throw error;
    }
  }

  /**
   * 转换 VAPID 密钥格式
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 取消订阅
   */
  async unsubscribe() {
    if (this.subscription) {
      try {
        await this.subscription.unsubscribe();
        console.log('✅ 推送订阅已取消');
        return true;
      } catch (error) {
        console.error('❌ 取消推送订阅失败:', error);
        return false;
      }
    }
    return false;
  }
}

// Service Worker 中处理推送事件
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || '您有新消息',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/badge-72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'view',
        title: '查看',
        icon: '/icons/view.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/close.png'
      }
    ],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '新消息', options)
  );
});

// 处理通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('通知被点击:', event.notification);
  
  event.notification.close();

  if (event.action === 'view') {
    // 处理"查看"操作
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'close') {
    // 处理"关闭"操作
    console.log('用户选择关闭通知');
  } else {
    // 默认操作（点击通知本身）
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});
```

### 6.2 后台同步功能

```javascript
/**
 * 后台同步管理器
 */
class BackgroundSyncManager {
  constructor() {
    this.syncTasks = new Map();
    this.pendingData = [];
  }

  /**
   * 注册后台同步任务
   */
  async registerSync(tag, data) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      if ('sync' in registration) {
        // 存储待同步数据
        this.pendingData.push({ tag, data, timestamp: Date.now() });
        localStorage.setItem('pendingSyncData', JSON.stringify(this.pendingData));
        
        // 注册同步事件
        await registration.sync.register(tag);
        console.log(`✅ 后台同步任务 "${tag}" 注册成功`);
        
        return true;
      } else {
        console.warn('❌ 浏览器不支持后台同步');
        return false;
      }
    } catch (error) {
      console.error('❌ 注册后台同步失败:', error);
      return false;
    }
  }

  /**
   * 获取待同步的数据
   */
  getPendingData(tag) {
    const data = localStorage.getItem('pendingSyncData');
    if (data) {
      const pendingData = JSON.parse(data);
      return pendingData.filter(item => item.tag === tag);
    }
    return [];
  }

  /**
   * 清除已同步的数据
   */
  clearSyncedData(tag) {
    const data = localStorage.getItem('pendingSyncData');
    if (data) {
      let pendingData = JSON.parse(data);
      pendingData = pendingData.filter(item => item.tag !== tag);
      localStorage.setItem('pendingSyncData', JSON.stringify(pendingData));
    }
  }
}

// Service Worker 中处理后台同步
self.addEventListener('sync', (event) => {
  console.log('🔄 后台同步事件触发:', event.tag);
  
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'background-sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncMessages() {
  try {
    // 获取待同步的消息
    const pendingMessages = await getStoredMessages();
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });

        if (response.ok) {
          console.log('✅ 消息同步成功:', message.id);
          await removeStoredMessage(message.id);
        } else {
          console.error('❌ 消息同步失败:', response.status);
        }
      } catch (error) {
        console.error('❌ 同步单个消息失败:', error);
      }
    }
    
    console.log('✅ 消息后台同步完成');
  } catch (error) {
    console.error('❌ 消息后台同步失败:', error);
    throw error;
  }
}

async function syncData() {
  try {
    // 同步应用数据的逻辑
    console.log('🔄 开始同步应用数据...');
    
    // 实现具体的数据同步逻辑
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      console.log('✅ 应用数据同步成功');
    } else {
      throw new Error(`同步失败: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ 应用数据同步失败:', error);
    throw error;
  }
}

// 辅助函数：存储和检索消息
async function getStoredMessages() {
  // 从 IndexedDB 或其他存储中获取待同步消息
  return [];
}

async function removeStoredMessage(messageId) {
  // 从存储中移除已同步的消息
  console.log(`移除已同步消息: ${messageId}`);
}
```

### 6.3 离线优先应用

```javascript
/**
 * 离线优先应用管理器
 */
class OfflineFirstApp {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  /**
   * 设置网络状态监听
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 网络已连接');
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 网络已断开');
      this.handleOffline();
    });
  }

  /**
   * 处理网络连接事件
   */
  async handleOnline() {
    // 触发后台同步
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await registration.sync.register('background-sync-on-online');
      }
    }

    // 更新 UI 状态
    this.updateNetworkStatus(true);
    
    // 重试失败的请求
    this.retryFailedRequests();
  }

  /**
   * 处理网络断开事件
   */
  handleOffline() {
    // 更新 UI 状态
    this.updateNetworkStatus(false);
    
    // 显示离线提示
    this.showOfflineNotification();
  }

  /**
   * 更新网络状态 UI
   */
  updateNetworkStatus(isOnline) {
    const statusElement = document.getElementById('network-status');
    if (statusElement) {
      statusElement.textContent = isOnline ? '在线' : '离线';
      statusElement.className = isOnline ? 'online' : 'offline';
    }
  }

  /**
   * 显示离线通知
   */
  showOfflineNotification() {
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.textContent = '您当前处于离线状态，某些功能可能不可用';
    notification.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff9800;
      color: white;
      text-align: center;
      padding: 10px;
      z-index: 9999;
    `;
    
    document.body.appendChild(notification);
  }

  /**
   * 重试失败的请求
   */
  async retryFailedRequests() {
    // 获取存储的失败请求
    const failedRequests = this.getFailedRequests();
    
    for (const request of failedRequests) {
      try {
        const response = await fetch(request.url, request.options);
        if (response.ok) {
          console.log('✅ 重试请求成功:', request.url);
          this.removeFailedRequest(request.id);
        }
      } catch (error) {
        console.error('❌ 重试请求失败:', error);
      }
    }
  }

  /**
   * 获取失败的请求
   */
  getFailedRequests() {
    const data = localStorage.getItem('failedRequests');
    return data ? JSON.parse(data) : [];
  }

  /**
   * 移除失败的请求
   */
  removeFailedRequest(requestId) {
    let failedRequests = this.getFailedRequests();
    failedRequests = failedRequests.filter(req => req.id !== requestId);
    localStorage.setItem('failedRequests', JSON.stringify(failedRequests));
  }

  /**
   * 存储失败的请求
   */
  storeFailedRequest(url, options) {
    const failedRequests = this.getFailedRequests();
    const requestId = Date.now().toString();
    
    failedRequests.push({
      id: requestId,
      url,
      options,
      timestamp: Date.now()
    });
    
    localStorage.setItem('failedRequests', JSON.stringify(failedRequests));
    return requestId;
  }
}

// 初始化离线优先应用
const offlineApp = new OfflineFirstApp();

// Service Worker 中的离线优先策略
self.addEventListener('fetch', (event) => {
  // 对于 API 请求，使用离线优先策略
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // 返回缓存响应，同时在后台更新
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  const cache = caches.open('api-cache');
                  cache.then(c => c.put(event.request, networkResponse.clone()));
                }
              })
              .catch(() => {
                // 网络请求失败，但我们已经有缓存响应
              });
            
            return cachedResponse;
          } else {
            // 没有缓存，尝试网络请求
            return fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  const cache = caches.open('api-cache');
                  cache.then(c => c.put(event.request, networkResponse.clone()));
                }
                return networkResponse;
              })
              .catch(error => {
                // 网络请求失败，返回离线响应
                return new Response(JSON.stringify({
                  error: '网络不可用',
                  offline: true
                }), {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              });
          }
        })
    );
  }
});
```

---

## 7. 实际应用示例

### 7.1 新闻阅读应用

```javascript
/**
 * 新闻阅读应用 Service Worker
 */
const NEWS_CACHE = 'news-cache-v1';
const NEWS_API_CACHE = 'news-api-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// 预缓存关键资源
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/offline.html',
  '/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NEWS_CACHE)
      .then(cache => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== NEWS_CACHE && cacheName !== NEWS_API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 立即控制页面
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 处理页面请求
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // 缓存成功的页面响应
          if (response.ok) {
            const cache = caches.open(NEWS_CACHE);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // 网络失败，返回缓存的页面或离线页面
          return caches.match(request)
            .then(cachedResponse => {
              return cachedResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
  }
  
  // 处理 API 请求
  else if (url.pathname.startsWith('/api/news')) {
    event.respondWith(
      caches.open(NEWS_API_CACHE)
        .then(cache => {
          return fetch(request)
            .then(response => {
              // 缓存成功的 API 响应
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // 网络失败，返回缓存的 API 响应
              return cache.match(request);
            });
        })
    );
  }
  
  // 处理静态资源
  else {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request);
        })
    );
  }
});

// 后台同步新闻数据
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-news') {
    event.waitUntil(syncNewsData());
  }
});

async function syncNewsData() {
  try {
    const response = await fetch('/api/news/latest');
    if (response.ok) {
      const cache = await caches.open(NEWS_API_CACHE);
      await cache.put('/api/news/latest', response.clone());
      
      // 通知客户端数据已更新
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'NEWS_UPDATED',
          data: 'Latest news synced'
        });
      });
    }
  } catch (error) {
    console.error('同步新闻数据失败:', error);
  }
}
```

### 7.2 社交媒体应用

```javascript
/**
 * 社交媒体应用 Service Worker
 */
const SOCIAL_CACHE = 'social-cache-v1';
const POSTS_CACHE = 'posts-cache-v1';
const IMAGES_CACHE = 'images-cache-v1';

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 处理用户头像和图片
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGES_CACHE)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              return fetch(request)
                .then(response => {
                  // 只缓存成功的图片响应
                  if (response.ok) {
                    cache.put(request, response.clone());
                  }
                  return response;
                })
                .catch(() => {
                  // 返回默认头像
                  return caches.match('/images/default-avatar.png');
                });
            });
        })
    );
  }
  
  // 处理帖子 API
  else if (url.pathname.startsWith('/api/posts')) {
    event.respondWith(
      caches.open(POSTS_CACHE)
        .then(cache => {
          // 优先返回缓存，后台更新
          return cache.match(request)
            .then(cachedResponse => {
              const fetchPromise = fetch(request)
                .then(response => {
                  if (response.ok) {
                    cache.put(request, response.clone());
                  }
                  return response;
                })
                .catch(() => cachedResponse);
              
              return cachedResponse || fetchPromise;
            });
        })
    );
  }
});

// 处理新帖子推送通知
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: `${data.author}: ${data.content}`,
    icon: data.avatar || '/images/default-avatar.png',
    badge: '/images/badge.png',
    tag: 'new-post',
    data: {
      postId: data.postId,
      url: `/posts/${data.postId}`
    },
    actions: [
      {
        action: 'like',
        title: '点赞',
        icon: '/images/like.png'
      },
      {
        action: 'comment',
        title: '评论',
        icon: '/images/comment.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('新帖子', options)
  );
});

// 处理通知交互
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'like') {
    // 处理点赞操作
    event.waitUntil(
      fetch(`/api/posts/${event.notification.data.postId}/like`, {
        method: 'POST'
      })
    );
  } else if (event.action === 'comment') {
    // 打开评论页面
    event.waitUntil(
      clients.openWindow(`/posts/${event.notification.data.postId}#comment`)
    );
  } else {
    // 打开帖子详情页
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

---

## 8. 最佳实践与优化

### 8.1 缓存策略最佳实践

| 策略类型 | 适用场景 | 优势 | 注意事项 |
|----------|----------|------|----------|
| **Cache First** | 静态资源、字体、图片 | 快速响应，减少网络请求 | 可能返回过期内容 |
| **Network First** | API数据、动态内容 | 保证内容新鲜度 | 网络差时响应慢 |
| **Stale While Revalidate** | 新闻、社交内容 | 快速响应且后台更新 | 可能显示过期内容 |
| **Cache Only** | 核心离线资源 | 完全离线可用 | 必须预先缓存 |
| **Network Only** | 敏感数据、实时API | 始终获取最新数据 | 离线时不可用 |

```javascript
/**
 * 智能缓存策略选择器
 */
class SmartCacheStrategy {
  constructor() {
    this.strategies = new Map();
    this.setupDefaultStrategies();
  }

  setupDefaultStrategies() {
    // 静态资源 - Cache First
    this.strategies.set('static', {
      pattern: /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/,
      strategy: 'cacheFirst',
      cacheName: 'static-resources',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30天
    });

    // API请求 - Network First
    this.strategies.set('api', {
      pattern: /^\/api\//,
      strategy: 'networkFirst',
      cacheName: 'api-cache',
      maxAge: 5 * 60 * 1000 // 5分钟
    });

    // HTML页面 - Stale While Revalidate
    this.strategies.set('pages', {
      pattern: /\.html$/,
      strategy: 'staleWhileRevalidate',
      cacheName: 'pages-cache',
      maxAge: 24 * 60 * 60 * 1000 // 24小时
    });
  }

  getStrategy(request) {
    const url = new URL(request.url);
    
    for (const [name, config] of this.strategies) {
      if (config.pattern.test(url.pathname)) {
        return config;
      }
    }
    
    // 默认策略
    return {
      strategy: 'networkFirst',
      cacheName: 'default-cache',
      maxAge: 60 * 60 * 1000 // 1小时
    };
  }

  async handleRequest(request) {
    const strategy = this.getStrategy(request);
    
    switch (strategy.strategy) {
      case 'cacheFirst':
        return this.cacheFirst(request, strategy);
      case 'networkFirst':
        return this.networkFirst(request, strategy);
      case 'staleWhileRevalidate':
        return this.staleWhileRevalidate(request, strategy);
      default:
        return fetch(request);
    }
  }

  async cacheFirst(request, strategy) {
    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(request);
    
    if (cached && !this.isExpired(cached, strategy.maxAge)) {
      return cached;
    }
    
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      if (cached) return cached;
      throw error;
    }
  }

  async networkFirst(request, strategy) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(strategy.cacheName);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cache = await caches.open(strategy.cacheName);
      const cached = await cache.match(request);
      if (cached) return cached;
      throw error;
    }
  }

  async staleWhileRevalidate(request, strategy) {
    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(request);
    
    // 后台更新
    const fetchPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });
    
    // 返回缓存或等待网络
    return cached || fetchPromise;
  }

  isExpired(response, maxAge) {
    const dateHeader = response.headers.get('date');
    if (!dateHeader) return false;
    
    const date = new Date(dateHeader);
    return Date.now() - date.getTime() > maxAge;
  }
}
```

### 8.2 性能优化策略

```javascript
/**
 * Service Worker 性能优化器
 */
class ServiceWorkerOptimizer {
  constructor() {
    this.performanceMetrics = new Map();
    this.resourcePriorities = new Map();
    this.setupResourcePriorities();
  }

  setupResourcePriorities() {
    // 设置资源优先级
    this.resourcePriorities.set('critical', [
      '/',
      '/index.html',
      '/app.css',
      '/app.js'
    ]);
    
    this.resourcePriorities.set('important', [
      '/manifest.json',
      '/icons/icon-192.png'
    ]);
    
    this.resourcePriorities.set('optional', [
      '/images/',
      '/fonts/'
    ]);
  }

  /**
   * 启用导航预加载
   */
  async enableNavigationPreload() {
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
      console.log('✅ 导航预加载已启用');
    }
  }

  /**
   * 智能预缓存
   */
  async smartPrecache() {
    const criticalResources = this.resourcePriorities.get('critical');
    const importantResources = this.resourcePriorities.get('important');
    
    // 优先缓存关键资源
    await this.batchCache('critical-cache', criticalResources);
    
    // 延迟缓存重要资源
    setTimeout(() => {
      this.batchCache('important-cache', importantResources);
    }, 1000);
  }

  async batchCache(cacheName, resources) {
    try {
      const cache = await caches.open(cacheName);
      await cache.addAll(resources);
      console.log(`✅ ${cacheName} 批量缓存完成`);
    } catch (error) {
      console.error(`❌ ${cacheName} 批量缓存失败:`, error);
    }
  }

  /**
   * 监控性能指标
   */
  measurePerformance(request, response, fromCache = false) {
    const url = request.url;
    const size = response.headers.get('content-length') || 0;
    
    if (!this.performanceMetrics.has(url)) {
      this.performanceMetrics.set(url, {
        requests: 0,
        cacheHits: 0,
        totalSize: 0,
        avgResponseTime: 0
      });
    }
    
    const metrics = this.performanceMetrics.get(url);
    metrics.requests++;
    metrics.totalSize += parseInt(size);
    
    if (fromCache) {
      metrics.cacheHits++;
    }
    
    // 计算缓存命中率
    metrics.hitRate = (metrics.cacheHits / metrics.requests) * 100;
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    const report = {
      totalRequests: 0,
      totalCacheHits: 0,
      totalSize: 0,
      topResources: []
    };
    
    for (const [url, metrics] of this.performanceMetrics) {
      report.totalRequests += metrics.requests;
      report.totalCacheHits += metrics.cacheHits;
      report.totalSize += metrics.totalSize;
      
      report.topResources.push({
        url,
        ...metrics
      });
    }
    
    // 按请求次数排序
    report.topResources.sort((a, b) => b.requests - a.requests);
    report.overallHitRate = (report.totalCacheHits / report.totalRequests) * 100;
    
    return report;
  }

  /**
   * 清理过期缓存
   */
  async cleanupExpiredCache() {
    const cacheNames = await caches.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
          const cacheDate = new Date(dateHeader).getTime();
          if (now - cacheDate > maxAge) {
            await cache.delete(request);
            console.log(`🗑️ 清理过期缓存: ${request.url}`);
          }
        }
      }
    }
  }
}

// 在 Service Worker 中使用
const optimizer = new ServiceWorkerOptimizer();

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      optimizer.enableNavigationPreload(),
      optimizer.smartPrecache()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          optimizer.measurePerformance(event.request, cachedResponse, true);
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            optimizer.measurePerformance(event.request, networkResponse, false);
            
            // 异步缓存响应
            if (networkResponse.ok) {
              const cache = caches.open('dynamic-cache');
              cache.then(c => c.put(event.request, networkResponse.clone()));
            }
            
            return networkResponse;
          });
      })
  );
});
```

### 8.3 安全性最佳实践

```javascript
/**
 * Service Worker 安全管理器
 */
class ServiceWorkerSecurity {
  constructor() {
    this.allowedOrigins = [
      'https://your-domain.com',
      'https://api.your-domain.com'
    ];
    this.trustedHosts = new Set(this.allowedOrigins.map(url => new URL(url).hostname));
  }

  /**
   * 验证请求来源
   */
  isValidOrigin(request) {
    const url = new URL(request.url);
    return this.trustedHosts.has(url.hostname) || url.protocol === 'chrome-extension:';
  }

  /**
   * 内容安全策略检查
   */
  checkCSP(response) {
    const csp = response.headers.get('content-security-policy');
    if (!csp && response.url.includes(location.origin)) {
      console.warn('⚠️ 响应缺少 CSP 头部:', response.url);
    }
    return response;
  }

  /**
   * 验证响应完整性
   */
  async verifyIntegrity(response, expectedHash) {
    if (!expectedHash) return response;
    
    const buffer = await response.clone().arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (hashHex !== expectedHash) {
      throw new Error('响应完整性验证失败');
    }
    
    return response;
  }

  /**
   * 安全的响应处理
   */
  async secureResponse(request, response) {
    // 检查来源
    if (!this.isValidOrigin(request)) {
      console.warn('⚠️ 请求来源不受信任:', request.url);
      return new Response('Forbidden', { status: 403 });
    }
    
    // 添加安全头部
    const secureResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });
    
    return this.checkCSP(secureResponse);
  }

  /**
   * 清理敏感数据
   */
  sanitizeData(data) {
    // 移除敏感字段
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });
    
    return sanitized;
  }
}

// 在 Service Worker 中使用安全管理器
const security = new ServiceWorkerSecurity();

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => security.secureResponse(event.request, response))
      .catch(error => {
        console.error('请求处理失败:', error);
        return new Response('Internal Server Error', { status: 500 });
      })
  );
});
```

### 8.4 调试与监控

```javascript
/**
 * Service Worker 调试工具
 */
class ServiceWorkerDebugger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.startTime = Date.now();
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      uptime: Date.now() - this.startTime
    };
    
    this.logs.push(logEntry);
    
    // 保持日志数量限制
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // 控制台输出
    console[level](`[SW ${timestamp}] ${message}`, data || '');
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  getLogs(level = null) {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  exportLogs() {
    return {
      serviceWorker: {
        version: '1.0.0',
        uptime: Date.now() - this.startTime,
        logs: this.logs
      },
      browser: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };
  }

  clearLogs() {
    this.logs = [];
    console.clear();
  }
}

// 全局调试器实例
const debugger = new ServiceWorkerDebugger();

// 监听所有事件
self.addEventListener('install', (event) => {
  debugger.info('Service Worker 安装事件', { url: self.location.href });
});

self.addEventListener('activate', (event) => {
  debugger.info('Service Worker 激活事件');
});

self.addEventListener('fetch', (event) => {
  debugger.info('拦截请求', { 
    url: event.request.url, 
    method: event.request.method 
  });
});

self.addEventListener('error', (event) => {
  debugger.error('Service Worker 错误', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});
```

---

## 9. 常见问题解答

### 9.1 Service Worker 是什么？

Service Worker 是一个注册在指定源和路径下的事件驱动 Worker。它采用 JavaScript 文件的形式，控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。

### 9.2 Service Worker 的生命周期是什么？

Service Worker 的生命周期完全独立于网页，包含三个主要阶段：**注册**、**安装**、**激活**。理解这个生命周期对于正确使用 Service Worker 至关重要。

### 9.3 Service Worker 有哪些核心特性？

- **后台运行**：独立于主线程的 Worker 上下文，不阻塞用户界面。
- **网络代理**：拦截和处理网络请求，实现离线功能和缓存策略。
- **事件驱动**：基于事件的异步编程模型，高效的资源利用。
- **持久化**：安装后持续存在，提供持续的后台服务。
- **安全限制**：仅支持 HTTPS，保证数据传输安全。

### 9.4 Service Worker 如何实现离线功能？

Service Worker 通过拦截网络请求，根据网络是否可用来采取适当的动作。它还提供入口以推送通知和访问后台同步 API。

### 9.5 Service Worker 如何与页面通信？

Service Worker 通过 `postMessage` 和 `addEventListener('message')` 实现与页面的通信。

### 9.6 Service Worker 如何更新？

Service Worker 的更新是渐进式的，当有新版本时，它会自动安装，但不会立即激活，直到不再有任何已加载的页面在使用旧版的 Service Worker 时，新版本才会激活。

### 9.7 Service Worker 有哪些高级功能？

- **离线页面**：提供离线访问能力。
- **推送通知**：接收服务器推送消息。
- **后台同步**：网络恢复时同步数据。
- **预加载**：提前加载资源，提高加载速度。
- **后台 fetch**：管理可能需要较长时间的下载。

### 9.8 Service Worker 有哪些限制？

- **HTTPS 要求**：出于安全考量，仅限安全上下文。
- **事件驱动**：同步请求是被禁止的 - 只有异步请求。
- **资源限制**：每个域下缓存数据大小有限制，可以使用 `StorageEstimate API` 获得估算值。

### 9.9 Service Worker 如何调试？

- **浏览器开发者工具**：使用 Chrome DevTools 的 Application 面板查看缓存、Service Worker 状态和消息。
- **Console 日志**：通过 `console.log` 和 `console.error` 输出调试信息。
- **Event Listeners**：监听 `install`、`activate`、`fetch`、`push`、`sync` 等事件，了解 Service Worker 生命周期和事件触发。

---

## 添加到屏幕

没人愿意多此一举地在移动设备键盘上输入长长的网址。通过添加到屏幕的功能，用户可以像从应用商店安装本机应用那样，选择为其设备添加一个快捷链接，并且过程要顺畅得多。

使用 manifest.json 文件来实现添加到屏幕的功能:

```json
{
  "name": "应用名称",
  "short_name": " 应用展示的名字",
  // 定义桌面启动的 URL
  "start_url": "/",
  "description": "应用描述",
  // 应用显示方向，竖屏、横屏
  "orientation": "portrait",
  //显示方式：应用standalone、全屏fullscreen、比应用多一些系统导航控制元素minimal-ui、浏览器browser
  "display": "standalone",
  // 应用模式下的路径范围，超出范围会以浏览器方式显示
  "scope": "/",
  // 是否设置对应移动应用，默认为 false
  "prefer_related_applications": false,
  // 获取移动应用的方式
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
    }
  ],
  // 应用默认的主题色
  "theme_color": "#fff",
  // 应用加载之前的背景色，用于应用启动时的过渡
  "background_color": "#d8d8d8",
  // 文字方向 ltr、rtl、auto
  "dir": "auto",
  // 语言
  "lang": "zh-CN",
  // 应用图标配置:类型最好是png，，且存在144px的尺寸
  "icons": [
    { "src": "./logo_32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "./logo_48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "./logo_96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "./logo_144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "./logo_192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "./logo_256.png", "sizes": "256x256", "type": "image/png" }
  ]
}
```

在 HTML 文档中通过 link 标签来引用 manifest.json 文件

```html
<link rel="manifest" href="/manifest.json" />
<!-- 文件位于static目录下 -->
<link rel="manifest" href="/static/manifest.json" />
<!-- 为了更好地SEO，需要通过meta标签设置theme-color -->
<meta name="theme-color" content="#fff" />
```
