# Web Worker 开发指南

Web Worker 是现代 Web 开发中处理多线程任务的核心技术，它使得在独立于主执行线程的后台线程中运行脚本操作成为可能，有效解决了 JavaScript 单线程模型的性能瓶颈。

## 目录导航

- [1. 概述与基础概念](#1-概述与基础概念)
- [2. Worker 类型与生命周期](#2-worker-类型与生命周期)
- [3. 专用 Worker 开发](#3-专用-worker-开发)
- [4. 共享 Worker 实现](#4-共享-worker-实现)
- [5. 核心 API 详解](#5-核心-api-详解)
- [6. 高级功能应用](#6-高级功能应用)
- [7. 实际应用示例](#7-实际应用示例)
- [8. 最佳实践与优化](#8-最佳实践与优化)
- [9. 常见问题解答](#9-常见问题解答)

---

## 1. 概述与基础概念

### 1.1 什么是 Web Worker

Web Worker 使得在一个独立于 Web 应用程序主执行线程的后台线程中运行脚本操作成为可能。这样做的好处是可以在独立线程中执行费时的处理任务，使主线程（通常是 UI 线程）的运行不会被阻塞/放慢。

### 1.2 核心优势

- **并行计算**：在后台线程中执行计算密集型任务
- **主线程保护**：避免阻塞 UI 渲染和用户交互
- **性能提升**：充分利用多核处理器的计算能力
- **数据隔离**：Worker 与主线程拥有独立的执行环境

### 1.3 数据传输机制

数据通过消息系统在 worker 和主线程之间发送——双方都使用 `postMessage()` 方法发送消息，并通过 `onmessage` 事件处理程序响应消息（消息包含在 message 事件的 data 属性中）。数据是复制的，而不是共享的。

### 1.4 Worker 类型分类

Web Worker 技术栈包含多种类型的 Worker：

- **Dedicated Worker**：专用 worker，由单个脚本使用的 worker，上下文由 `DedicatedWorkerGlobalScope` 对象表示
- **Shared Worker**：共享 worker，可以由在不同窗口、IFrame 等中运行的多个脚本使用，只要它们与 worker 在同一域中
- **Service Worker**：服务 worker，基本上是作为代理服务器，位于 web 应用程序、浏览器和网络之间，用于创建离线体验、拦截网络请求等

### 1.5 执行环境特性

Worker 在一个与当前 window 不同的全局上下文中运行！虽然 `Window` 不能直接用于 worker，但许多相同的方法被定义在一个共享的混入（`WindowOrWorkerGlobalScope`）中，并通过 worker 自己的 `WorkerGlobalScope` 衍生的上下文提供给它们：

- `DedicatedWorkerGlobalScope` 用于专用 Web worker
- `SharedWorkerGlobalScope` 用于共享 Shared worker
- `ServiceWorkerGlobalScope` 用于 service worker

### 1.6 基础 API 概览

| API 方法 | 描述 | 适用类型 |
|----------|------|----------|
| `postMessage()` | 发送消息到对应的接收端 | 所有类型 |
| `terminate()` | 立即终止 worker | 主线程调用 |
| `close()` | 在 worker 内部关闭自身 | Worker 内部 |
| `importScripts()` | 导入外部脚本文件 | Worker 内部 |

---

## 2. Worker 类型与生命周期

### 2.1 Worker 生命周期管理

```javascript
/**
 * Worker 生命周期管理器
 * 提供完整的 Worker 创建、监控和销毁功能
 */
class WorkerLifecycleManager {
  constructor() {
    this.workers = new Map(); // 存储所有 Worker 实例
    this.workerStats = new Map(); // 存储 Worker 统计信息
  }

  /**
   * 创建并管理新的 Worker
   * @param {string} scriptURL - Worker 脚本路径
   * @param {Object} options - Worker 配置选项
   * @param {string} name - Worker 名称（用于管理）
   * @returns {Worker} Worker 实例
   */
  createWorker(scriptURL, options = {}, name = null) {
    const workerId = name || `worker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建 Worker 配置
    const workerOptions = {
      type: options.type || 'classic', // 'classic' 或 'module'
      name: options.name || workerId,
      credentials: options.credentials || 'same-origin'
    };

    try {
      const worker = new Worker(scriptURL, workerOptions);
      
      // 设置生命周期事件监听
      this.setupWorkerListeners(worker, workerId);
      
      // 存储 Worker 实例和统计信息
      this.workers.set(workerId, worker);
      this.workerStats.set(workerId, {
        created: new Date(),
        messagesSent: 0,
        messagesReceived: 0,
        errors: 0,
        status: 'active'
      });

      console.log(`✅ Worker ${workerId} 创建成功`);
      return { worker, workerId };
    } catch (error) {
      console.error(`❌ Worker ${workerId} 创建失败:`, error);
      throw error;
    }
  }

  /**
   * 设置 Worker 事件监听器
   * @param {Worker} worker - Worker 实例
   * @param {string} workerId - Worker ID
   */
  setupWorkerListeners(worker, workerId) {
    // 消息接收监听
    worker.addEventListener('message', (event) => {
      const stats = this.workerStats.get(workerId);
      if (stats) {
        stats.messagesReceived++;
        console.log(`📨 Worker ${workerId} 收到消息:`, event.data);
      }
    });

    // 错误监听
    worker.addEventListener('error', (error) => {
      const stats = this.workerStats.get(workerId);
      if (stats) {
        stats.errors++;
        stats.status = 'error';
      }
      console.error(`❌ Worker ${workerId} 发生错误:`, error);
    });

    // 消息错误监听
    worker.addEventListener('messageerror', (error) => {
      const stats = this.workerStats.get(workerId);
      if (stats) {
        stats.errors++;
      }
      console.error(`❌ Worker ${workerId} 消息错误:`, error);
    });
  }

  /**
   * 发送消息到指定 Worker
   * @param {string} workerId - Worker ID
   * @param {*} data - 要发送的数据
   * @param {Array} transferList - 可转移对象列表
   */
  postMessage(workerId, data, transferList = []) {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} 不存在`);
    }

    try {
      worker.postMessage(data, transferList);
      const stats = this.workerStats.get(workerId);
      if (stats) {
        stats.messagesSent++;
      }
      console.log(`📤 向 Worker ${workerId} 发送消息:`, data);
    } catch (error) {
      console.error(`❌ 向 Worker ${workerId} 发送消息失败:`, error);
      throw error;
    }
  }

  /**
   * 终止指定 Worker
   * @param {string} workerId - Worker ID
   */
  terminateWorker(workerId) {
    const worker = this.workers.get(workerId);
    if (!worker) {
      console.warn(`⚠️ Worker ${workerId} 不存在，无法终止`);
      return;
    }

    worker.terminate();
    
    // 更新状态
    const stats = this.workerStats.get(workerId);
    if (stats) {
      stats.status = 'terminated';
      stats.terminated = new Date();
    }

    console.log(`🛑 Worker ${workerId} 已终止`);
  }

  /**
   * 获取 Worker 统计信息
   * @param {string} workerId - Worker ID
   * @returns {Object} 统计信息
   */
  getWorkerStats(workerId) {
    return this.workerStats.get(workerId) || null;
  }

  /**
   * 获取所有 Worker 统计信息
   * @returns {Object} 所有 Worker 的统计信息
   */
  getAllWorkerStats() {
    const allStats = {};
    for (const [workerId, stats] of this.workerStats) {
      allStats[workerId] = { ...stats };
    }
    return allStats;
  }

  /**
   * 清理所有 Worker
   */
  terminateAllWorkers() {
    for (const workerId of this.workers.keys()) {
      this.terminateWorker(workerId);
    }
    this.workers.clear();
    console.log('🧹 所有 Worker 已清理完成');
  }
}

// 使用示例
const workerManager = new WorkerLifecycleManager();

// 创建 Worker
const { worker, workerId } = workerManager.createWorker('./dedicated-worker.js', {
  type: 'classic',
  name: 'data-processor'
});

// 发送数据
workerManager.postMessage(workerId, {
  command: 'process',
  data: [1, 2, 3, 4, 5]
});

// 查看统计信息
setTimeout(() => {
  console.log('Worker 统计:', workerManager.getWorkerStats(workerId));
}, 1000);
```

### 2.2 Worker 类型对比

| 特性 | Dedicated Worker | Shared Worker | Service Worker |
|------|------------------|---------------|----------------|
| 作用域 | 单一脚本/页面 | 多个脚本/页面 | 整个域名/应用 |
| 通信方式 | 直接消息传递 | 通过端口通信 | 事件拦截 |
| 生命周期 | 与创建页面绑定 | 独立于页面 | 独立于页面 |
| 网络访问 | 受限 | 受限 | 完全控制 |
| 缓存控制 | 无 | 无 | 完全控制 |
| 适用场景 | 计算任务 | 数据共享 | 离线应用 |

---

## 3. 专用 Worker 开发

### 3.1 基础专用 Worker 实现

```javascript
// 主线程：main.js
/**
 * 专用 Worker 管理类
 * 提供完整的专用 Worker 创建、通信和管理功能
 */
class DedicatedWorkerManager {
  constructor() {
    this.worker = null;
    this.messageQueue = [];
    this.isReady = false;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  /**
   * 初始化 Worker
   * @param {string} scriptURL - Worker 脚本路径
   * @param {Object} options - Worker 配置选项
   */
  async initialize(scriptURL, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // 创建 Worker 实例
        this.worker = new Worker(scriptURL, {
          type: options.type || 'classic',
          name: options.name || 'dedicated-worker',
          credentials: options.credentials || 'same-origin'
        });

        // 设置消息监听
        this.worker.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        // 设置错误监听
        this.worker.onerror = (error) => {
          console.error('❌ Worker 错误:', error);
          reject(error);
        };

        // 设置消息错误监听
        this.worker.onmessageerror = (error) => {
          console.error('❌ Worker 消息错误:', error);
        };

        // 等待 Worker 就绪
        this.sendMessage({ type: 'init' })
          .then(() => {
            this.isReady = true;
            console.log('✅ Worker 初始化完成');
            resolve();
          })
          .catch(reject);

      } catch (error) {
        console.error('❌ Worker 创建失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 处理来自 Worker 的消息
   * @param {*} data - 消息数据
   */
  handleMessage(data) {
    if (data.requestId && this.pendingRequests.has(data.requestId)) {
      // 处理请求响应
      const { resolve, reject } = this.pendingRequests.get(data.requestId);
      this.pendingRequests.delete(data.requestId);

      if (data.error) {
        reject(new Error(data.error));
      } else {
        resolve(data.result);
      }
    } else {
      // 处理广播消息
      console.log('📨 收到 Worker 广播:', data);
      this.onBroadcast?.(data);
    }
  }

  /**
   * 发送消息到 Worker
   * @param {*} data - 要发送的数据
   * @param {Array} transferList - 可转移对象列表
   * @returns {Promise} 返回 Promise 用于接收响应
   */
  sendMessage(data, transferList = []) {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker 未初始化'));
        return;
      }

      const requestId = ++this.requestId;
      const message = {
        ...data,
        requestId
      };

      // 存储请求回调
      this.pendingRequests.set(requestId, { resolve, reject });

      // 设置超时
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Worker 响应超时'));
        }
      }, 30000); // 30秒超时

      try {
        this.worker.postMessage(message, transferList);
      } catch (error) {
        this.pendingRequests.delete(requestId);
        reject(error);
      }
    });
  }

  /**
   * 执行计算任务
   * @param {string} operation - 操作类型
   * @param {*} data - 计算数据
   * @returns {Promise} 计算结果
   */
  async compute(operation, data) {
    if (!this.isReady) {
      throw new Error('Worker 未就绪');
    }

    return this.sendMessage({
      type: 'compute',
      operation,
      data
    });
  }

  /**
   * 处理文件
   * @param {File} file - 要处理的文件
   * @param {string} operation - 处理操作
   * @returns {Promise} 处理结果
   */
  async processFile(file, operation) {
    if (!this.isReady) {
      throw new Error('Worker 未就绪');
    }

    const arrayBuffer = await file.arrayBuffer();
    
    return this.sendMessage({
      type: 'processFile',
      operation,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    }, [arrayBuffer]);
  }

  /**
   * 批量处理数据
   * @param {Array} dataList - 数据列表
   * @param {string} operation - 处理操作
   * @param {Function} progressCallback - 进度回调
   * @returns {Promise} 处理结果
   */
  async batchProcess(dataList, operation, progressCallback = null) {
    if (!this.isReady) {
      throw new Error('Worker 未就绪');
    }

    return this.sendMessage({
      type: 'batchProcess',
      operation,
      data: dataList,
      reportProgress: !!progressCallback
    });
  }

  /**
   * 终止 Worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.pendingRequests.clear();
      console.log('🛑 Worker 已终止');
    }
  }

  /**
   * 设置广播消息监听器
   * @param {Function} callback - 广播消息回调
   */
  onBroadcast(callback) {
    this.onBroadcast = callback;
  }
}

// 使用示例
const dedicatedWorker = new DedicatedWorkerManager();

// 初始化 Worker
await dedicatedWorker.initialize('./dedicated-worker.js');

// 执行计算任务
const result = await dedicatedWorker.compute('fibonacci', 30);
console.log('斐波那契数列计算结果:', result);

// 处理文件
const fileInput = document.querySelector('#file-input');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    const processedData = await dedicatedWorker.processFile(file, 'analyze');
    console.log('文件处理结果:', processedData);
  }
});
```

### 3.2 Worker 脚本实现

```javascript
// dedicated-worker.js
/**
 * 专用 Worker 脚本
 * 提供各种计算和数据处理功能
 */
class DedicatedWorkerCore {
  constructor() {
    this.isInitialized = false;
    this.computeFunctions = new Map();
    this.setupComputeFunctions();
  }

  /**
   * 设置计算函数
   */
  setupComputeFunctions() {
    // 斐波那契数列计算
    this.computeFunctions.set('fibonacci', (n) => {
      if (n <= 1) return n;
      let a = 0, b = 1, temp;
      for (let i = 2; i <= n; i++) {
        temp = a + b;
        a = b;
        b = temp;
      }
      return b;
    });

    // 数组排序
    this.computeFunctions.set('sort', (data) => {
      if (!Array.isArray(data)) {
        throw new Error('数据必须是数组');
      }
      return [...data].sort((a, b) => a - b);
    });

    // 质数检测
    this.computeFunctions.set('isPrime', (n) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    });

    // 数据统计
    this.computeFunctions.set('statistics', (data) => {
      if (!Array.isArray(data)) {
        throw new Error('数据必须是数组');
      }
      
      const sum = data.reduce((acc, val) => acc + val, 0);
      const mean = sum / data.length;
      const sortedData = [...data].sort((a, b) => a - b);
      const median = sortedData.length % 2 === 0
        ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
        : sortedData[Math.floor(sortedData.length / 2)];

      return {
        count: data.length,
        sum,
        mean,
        median,
        min: Math.min(...data),
        max: Math.max(...data)
      };
    });

    // 图像处理模拟
    this.computeFunctions.set('imageProcess', (data) => {
      // 模拟图像处理：对每个像素值进行变换
      return data.map(pixel => Math.min(255, pixel * 1.2));
    });
  }

  /**
   * 处理消息
   * @param {*} data - 消息数据
   */
  handleMessage(data) {
    const { type, requestId } = data;

    try {
      let result;

      switch (type) {
        case 'init':
          this.isInitialized = true;
          result = { status: 'initialized' };
          break;

        case 'compute':
          result = this.executeCompute(data.operation, data.data);
          break;

        case 'processFile':
          result = this.processFile(data);
          break;

        case 'batchProcess':
          result = this.batchProcess(data);
          break;

        default:
          throw new Error(`未知的消息类型: ${type}`);
      }

      // 发送成功响应
      self.postMessage({
        requestId,
        result
      });

    } catch (error) {
      // 发送错误响应
      self.postMessage({
        requestId,
        error: error.message
      });
    }
  }

  /**
   * 执行计算操作
   * @param {string} operation - 操作类型
   * @param {*} data - 计算数据
   * @returns {*} 计算结果
   */
  executeCompute(operation, data) {
    const computeFunction = this.computeFunctions.get(operation);
    if (!computeFunction) {
      throw new Error(`不支持的计算操作: ${operation}`);
    }

    const startTime = performance.now();
    const result = computeFunction(data);
    const endTime = performance.now();

    return {
      result,
      executionTime: endTime - startTime,
      operation
    };
  }

  /**
   * 处理文件
   * @param {Object} fileData - 文件数据
   * @returns {Object} 处理结果
   */
  processFile(fileData) {
    const { operation, fileName, fileType, fileSize } = fileData;

    // 模拟文件处理
    const processingResults = {
      analyze: {
        fileName,
        fileType,
        fileSize,
        analysis: {
          isValid: true,
          encoding: 'UTF-8',
          lines: Math.floor(fileSize / 50), // 模拟行数
          characters: fileSize
        }
      },
      compress: {
        originalSize: fileSize,
        compressedSize: Math.floor(fileSize * 0.7),
        compressionRatio: 0.3
      },
      validate: {
        isValid: fileSize > 0 && fileSize < 10 * 1024 * 1024, // 小于10MB
        errors: fileSize > 10 * 1024 * 1024 ? ['文件过大'] : []
      }
    };

    return processingResults[operation] || { error: '不支持的文件操作' };
  }

  /**
   * 批量处理数据
   * @param {Object} batchData - 批量数据
   * @returns {Object} 处理结果
   */
  batchProcess(batchData) {
    const { operation, data, reportProgress } = batchData;
    const results = [];
    const total = data.length;

    for (let i = 0; i < total; i++) {
      try {
        const itemResult = this.executeCompute(operation, data[i]);
        results.push({
          index: i,
          success: true,
          result: itemResult.result
        });
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: error.message
        });
      }

      // 报告进度
      if (reportProgress && (i + 1) % Math.ceil(total / 10) === 0) {
        self.postMessage({
          type: 'progress',
          progress: (i + 1) / total,
          completed: i + 1,
          total
        });
      }
    }

    return {
      total,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}

// 初始化 Worker 核心
const workerCore = new DedicatedWorkerCore();

// 监听主线程消息
self.addEventListener('message', (event) => {
  workerCore.handleMessage(event.data);
});

// 导入外部工具库（如果需要）
// self.importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');

// 发送 Worker 就绪信号
self.postMessage({
  type: 'ready',
  timestamp: Date.now()
});
```

---

## 4. 共享 Worker 实现

### 4.1 共享 Worker 基础架构

```javascript
/**
 * 共享 Worker 管理器
 * 管理多个页面/脚本与同一个 SharedWorker 的连接
 */
class SharedWorkerManager {
  constructor() {
    this.worker = null;
    this.port = null;
    this.isConnected = false;
    this.messageQueue = [];
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.eventListeners = new Map();
  }

  /**
   * 连接到共享 Worker
   * @param {string} scriptURL - Worker 脚本路径
   * @param {string} name - Worker 名称
   * @param {Object} options - 连接选项
   */
  async connect(scriptURL, name = 'shared-worker', options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // 创建 SharedWorker 实例
        this.worker = new SharedWorker(scriptURL, name);
        this.port = this.worker.port;

        // 设置端口消息监听
        this.port.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        // 设置错误监听
        this.worker.onerror = (error) => {
          console.error('❌ SharedWorker 错误:', error);
          this.isConnected = false;
          reject(error);
        };

        // 设置端口错误监听
        this.port.onmessageerror = (error) => {
          console.error('❌ SharedWorker 端口消息错误:', error);
        };

        // 启动端口
        this.port.start();

        // 发送连接消息
        this.sendMessage({ 
          type: 'connect',
          clientId: this.generateClientId(),
          timestamp: Date.now() 
        })
        .then((response) => {
          this.isConnected = true;
          console.log('✅ SharedWorker 连接成功:', response);
          
          // 处理消息队列
          this.processMessageQueue();
          resolve(response);
        })
        .catch(reject);

      } catch (error) {
        console.error('❌ SharedWorker 连接失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 生成客户端ID
   * @returns {string} 客户端ID
   */
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 处理来自 SharedWorker 的消息
   * @param {*} data - 消息数据
   */
  handleMessage(data) {
    if (data.requestId && this.pendingRequests.has(data.requestId)) {
      // 处理请求响应
      const { resolve, reject } = this.pendingRequests.get(data.requestId);
      this.pendingRequests.delete(data.requestId);

      if (data.error) {
        reject(new Error(data.error));
      } else {
        resolve(data.result);
      }
    } else if (data.type === 'broadcast') {
      // 处理广播消息
      this.handleBroadcast(data);
    } else if (data.type === 'event') {
      // 处理自定义事件
      this.handleEvent(data);
    } else {
      console.log('📨 收到 SharedWorker 消息:', data);
    }
  }

  /**
   * 处理广播消息
   * @param {Object} data - 广播数据
   */
  handleBroadcast(data) {
    const { event, payload } = data;
    const listeners = this.eventListeners.get(event) || [];
    
    listeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        console.error(`❌ 广播事件 ${event} 处理错误:`, error);
      }
    });
  }

  /**
   * 处理自定义事件
   * @param {Object} data - 事件数据
   */
  handleEvent(data) {
    const { event, payload } = data;
    console.log(`🎯 收到事件 ${event}:`, payload);
    
    // 触发对应的事件监听器
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(payload));
  }

  /**
   * 发送消息到 SharedWorker
   * @param {*} data - 要发送的数据
   * @param {Array} transferList - 可转移对象列表
   * @returns {Promise} 返回Promise用于接收响应
   */
  sendMessage(data, transferList = []) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        // 如果未连接，将消息加入队列
        this.messageQueue.push({ data, transferList, resolve, reject });
        return;
      }

      const requestId = ++this.requestId;
      const message = {
        ...data,
        requestId
      };

      // 存储请求回调
      this.pendingRequests.set(requestId, { resolve, reject });

      // 设置超时
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('SharedWorker 响应超时'));
        }
      }, 30000);

      try {
        this.port.postMessage(message, transferList);
      } catch (error) {
        this.pendingRequests.delete(requestId);
        reject(error);
      }
    });
  }

  /**
   * 处理消息队列
   */
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { data, transferList, resolve, reject } = this.messageQueue.shift();
      this.sendMessage(data, transferList)
        .then(resolve)
        .catch(reject);
    }
  }

  /**
   * 订阅广播事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  subscribe(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    // 通知 SharedWorker 订阅事件
    this.sendMessage({
      type: 'subscribe',
      event
    }).catch(console.error);
  }

  /**
   * 取消订阅广播事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  unsubscribe(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }

    // 通知 SharedWorker 取消订阅
    this.sendMessage({
      type: 'unsubscribe',
      event
    }).catch(console.error);
  }

  /**
   * 发布广播消息
   * @param {string} event - 事件名称
   * @param {*} payload - 事件数据
   */
  publish(event, payload) {
    return this.sendMessage({
      type: 'publish',
      event,
      payload
    });
  }

  /**
   * 设置共享数据
   * @param {string} key - 数据键
   * @param {*} value - 数据值
   */
  setSharedData(key, value) {
    return this.sendMessage({
      type: 'setData',
      key,
      value
    });
  }

  /**
   * 获取共享数据
   * @param {string} key - 数据键
   * @returns {Promise} 数据值
   */
  getSharedData(key) {
    return this.sendMessage({
      type: 'getData',
      key
    });
  }

  /**
   * 删除共享数据
   * @param {string} key - 数据键
   */
  deleteSharedData(key) {
    return this.sendMessage({
      type: 'deleteData',
      key
    });
  }

  /**
   * 获取连接的客户端列表
   * @returns {Promise} 客户端列表
   */
  getConnectedClients() {
    return this.sendMessage({
      type: 'getClients'
    });
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.isConnected) {
      this.sendMessage({ type: 'disconnect' })
        .finally(() => {
          this.port.close();
          this.isConnected = false;
          this.pendingRequests.clear();
          this.eventListeners.clear();
          console.log('🔌 SharedWorker 连接已断开');
        });
    }
  }
}

// 使用示例
const sharedWorker = new SharedWorkerManager();

// 连接到共享 Worker
await sharedWorker.connect('./shared-worker.js', 'data-hub');

// 设置共享数据
await sharedWorker.setSharedData('user-preferences', {
  theme: 'dark',
  language: 'zh-CN',
  notifications: true
});

// 订阅广播事件
sharedWorker.subscribe('data-updated', (data) => {
  console.log('数据更新通知:', data);
});

// 发布广播消息
await sharedWorker.publish('user-action', {
  action: 'login',
  userId: '12345',
  timestamp: Date.now()
});
```

### 4.2 SharedWorker 脚本实现

```javascript
// shared-worker.js
/**
 * 共享 Worker 核心实现
 * 管理多个客户端的连接、数据共享和消息广播
 */
class SharedWorkerCore {
  constructor() {
    this.clients = new Map(); // 存储所有连接的客户端
    this.sharedData = new Map(); // 共享数据存储
    this.subscriptions = new Map(); // 事件订阅关系
    this.statistics = {
      totalConnections: 0,
      activeConnections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      dataOperations: 0
    };
  }

  /**
   * 处理新的客户端连接
   * @param {MessageEvent} event - 连接事件
   */
  handleConnect(event) {
    const port = event.ports[0];
    const clientId = this.generateClientId();

    // 存储客户端信息
    const clientInfo = {
      id: clientId,
      port: port,
      connected: Date.now(),
      messageCount: 0,
      subscriptions: new Set()
    };

    this.clients.set(clientId, clientInfo);
    this.statistics.totalConnections++;
    this.statistics.activeConnections++;

    // 设置端口消息监听
    port.onmessage = (msgEvent) => {
      this.handleMessage(clientId, msgEvent.data);
    };

    // 设置端口关闭监听
    port.onclose = () => {
      this.handleDisconnect(clientId);
    };

    // 启动端口
  port.start();

    console.log(`✅ 客户端 ${clientId} 已连接，当前连接数: ${this.statistics.activeConnections}`);

    // 发送欢迎消息
    this.sendToClient(clientId, {
      type: 'welcome',
      clientId: clientId,
      serverTime: Date.now(),
      activeClients: this.statistics.activeConnections
    });
  }

  /**
   * 生成客户端ID
   * @returns {string} 客户端ID
   */
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 处理客户端断开连接
   * @param {string} clientId - 客户端ID
   */
  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      // 清理客户端订阅
      client.subscriptions.forEach(event => {
        this.unsubscribeClient(clientId, event);
      });

      this.clients.delete(clientId);
      this.statistics.activeConnections--;

      console.log(`🔌 客户端 ${clientId} 已断开连接，当前连接数: ${this.statistics.activeConnections}`);

      // 广播客户端断开连接事件
      this.broadcast('client-disconnected', {
        clientId,
        activeClients: this.statistics.activeConnections
      });
    }
  }

  /**
   * 处理来自客户端的消息
   * @param {string} clientId - 客户端ID
   * @param {*} data - 消息数据
   */
  handleMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.messageCount++;
    this.statistics.messagesReceived++;

    const { type, requestId } = data;

    try {
      let result;

      switch (type) {
        case 'connect':
          result = this.handleConnectMessage(clientId, data);
          break;

        case 'disconnect':
          this.handleDisconnect(clientId);
          return;

        case 'setData':
          result = this.setSharedData(data.key, data.value);
          break;

        case 'getData':
          result = this.getSharedData(data.key);
          break;

        case 'deleteData':
          result = this.deleteSharedData(data.key);
          break;

        case 'subscribe':
          result = this.subscribeClient(clientId, data.event);
          break;

        case 'unsubscribe':
          result = this.unsubscribeClient(clientId, data.event);
          break;

        case 'publish':
          result = this.publishEvent(data.event, data.payload, clientId);
          break;

        case 'getClients':
          result = this.getClientList();
          break;

        case 'ping':
          result = { pong: true, serverTime: Date.now() };
          break;

        default:
          throw new Error(`未知的消息类型: ${type}`);
      }

      // 发送成功响应
      this.sendToClient(clientId, {
        requestId,
        result
      });

    } catch (error) {
      // 发送错误响应
      this.sendToClient(clientId, {
        requestId,
        error: error.message
      });
    }
  }

  /**
   * 处理连接消息
   * @param {string} clientId - 客户端ID
   * @param {Object} data - 连接数据
   * @returns {Object} 连接响应
   */
  handleConnectMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (client) {
      client.clientData = data;
    }

    // 广播新客户端连接事件
    this.broadcast('client-connected', {
      clientId,
      clientData: data,
      activeClients: this.statistics.activeConnections
    }, clientId);

    return {
      status: 'connected',
      clientId,
      serverTime: Date.now(),
      activeClients: this.statistics.activeConnections
    };
  }

  /**
   * 设置共享数据
   * @param {string} key - 数据键
   * @param {*} value - 数据值
   * @returns {Object} 操作结果
   */
  setSharedData(key, value) {
    const oldValue = this.sharedData.get(key);
    this.sharedData.set(key, value);
    this.statistics.dataOperations++;

    // 广播数据变更事件
    this.broadcast('data-changed', {
      key,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    });

    return {
      success: true,
      key,
      value,
      operation: 'set'
    };
  }

  /**
   * 获取共享数据
   * @param {string} key - 数据键
   * @returns {*} 数据值
   */
  getSharedData(key) {
    this.statistics.dataOperations++;
    return {
      key,
      value: this.sharedData.get(key),
      exists: this.sharedData.has(key)
    };
  }

  /**
   * 删除共享数据
   * @param {string} key - 数据键
   * @returns {Object} 操作结果
   */
  deleteSharedData(key) {
    const existed = this.sharedData.has(key);
    const oldValue = this.sharedData.get(key);
    this.sharedData.delete(key);
    this.statistics.dataOperations++;

    if (existed) {
      // 广播数据删除事件
      this.broadcast('data-deleted', {
        key,
        oldValue,
        timestamp: Date.now()
      });
    }

    return {
      success: true,
      key,
      existed,
      operation: 'delete'
    };
  }

  /**
   * 客户端订阅事件
   * @param {string} clientId - 客户端ID
   * @param {string} event - 事件名称
   * @returns {Object} 订阅结果
   */
  subscribeClient(clientId, event) {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error('客户端不存在');
    }

    // 添加到客户端订阅列表
    client.subscriptions.add(event);

    // 添加到全局订阅映射
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }
    this.subscriptions.get(event).add(clientId);

    return {
      success: true,
      event,
      subscriberCount: this.subscriptions.get(event).size
    };
  }

  /**
   * 客户端取消订阅事件
   * @param {string} clientId - 客户端ID
   * @param {string} event - 事件名称
   * @returns {Object} 取消订阅结果
   */
  unsubscribeClient(clientId, event) {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.delete(event);
    }

    const subscribers = this.subscriptions.get(event);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(event);
      }
    }

    return {
      success: true,
      event,
      subscriberCount: subscribers ? subscribers.size : 0
    };
  }

  /**
   * 发布事件
   * @param {string} event - 事件名称
   * @param {*} payload - 事件数据
   * @param {string} publisherId - 发布者客户端ID
   * @returns {Object} 发布结果
   */
  publishEvent(event, payload, publisherId) {
    const subscribers = this.subscriptions.get(event);
    if (!subscribers || subscribers.size === 0) {
      return {
        success: true,
        event,
        subscriberCount: 0,
        delivered: 0
      };
    }

    let delivered = 0;
    const eventData = {
      type: 'broadcast',
      event,
      payload,
      publisherId,
      timestamp: Date.now()
    };

    // 向所有订阅者发送事件
    subscribers.forEach(clientId => {
      if (clientId !== publisherId) { // 不发送给发布者自己
        try {
          this.sendToClient(clientId, eventData);
          delivered++;
        } catch (error) {
          console.error(`❌ 向客户端 ${clientId} 发送事件失败:`, error);
        }
      }
    });

    return {
      success: true,
      event,
      subscriberCount: subscribers.size,
      delivered
    };
  }

  /**
   * 广播消息到所有客户端
   * @param {string} event - 事件名称
   * @param {*} payload - 事件数据
   * @param {string} excludeClientId - 排除的客户端ID
   */
  broadcast(event, payload, excludeClientId = null) {
    const broadcastData = {
      type: 'broadcast',
      event,
      payload,
      timestamp: Date.now()
    };

    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId) {
        try {
          this.sendToClient(clientId, broadcastData);
        } catch (error) {
          console.error(`❌ 广播到客户端 ${clientId} 失败:`, error);
        }
      }
    });
  }

  /**
   * 发送消息到指定客户端
   * @param {string} clientId - 客户端ID
   * @param {*} data - 消息数据
   */
  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.port) {
      client.port.postMessage(data);
      this.statistics.messagesSent++;
    }
  }

  /**
   * 获取客户端列表
   * @returns {Array} 客户端列表
   */
  getClientList() {
    const clientList = [];
    this.clients.forEach((client, clientId) => {
      clientList.push({
        id: clientId,
        connected: client.connected,
        messageCount: client.messageCount,
        subscriptions: Array.from(client.subscriptions),
        clientData: client.clientData || {}
      });
    });

    return {
      clients: clientList,
      statistics: { ...this.statistics }
    };
  }
}

// 初始化 SharedWorker 核心
const sharedWorkerCore = new SharedWorkerCore();

// 监听连接事件
self.addEventListener('connect', (event) => {
  sharedWorkerCore.handleConnect(event);
});

// 定期清理和统计
setInterval(() => {
  console.log('📊 SharedWorker 统计:', sharedWorkerCore.statistics);
}, 60000); // 每分钟打印一次统计信息
```

### 4.3 跨页面数据同步示例

```javascript
/**
 * 跨页面数据同步应用示例
 * 演示如何使用 SharedWorker 实现多页面间的实时数据同步
 */
class CrossPageDataSync {
  constructor() {
    this.sharedWorker = new SharedWorkerManager();
    this.localData = new Map();
    this.syncCallbacks = new Map();
  }

  /**
   * 初始化数据同步
   */
  async initialize() {
    await this.sharedWorker.connect('./shared-worker.js', 'data-sync');

    // 订阅数据变更事件
    this.sharedWorker.subscribe('data-changed', (data) => {
      this.handleDataChange(data);
    });

    // 订阅数据删除事件
    this.sharedWorker.subscribe('data-deleted', (data) => {
      this.handleDataDelete(data);
    });

    console.log('✅ 跨页面数据同步初始化完成');
  }

  /**
   * 处理数据变更
   * @param {Object} data - 变更数据
   */
  handleDataChange(data) {
    const { key, newValue, timestamp } = data;
    
    // 更新本地缓存
    this.localData.set(key, {
      value: newValue,
      timestamp,
      source: 'remote'
    });

    // 触发同步回调
    const callbacks = this.syncCallbacks.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(newValue, 'changed');
      } catch (error) {
        console.error('数据同步回调错误:', error);
      }
    });

    console.log(`🔄 数据同步: ${key} =`, newValue);
  }

  /**
   * 处理数据删除
   * @param {Object} data - 删除数据
   */
  handleDataDelete(data) {
    const { key } = data;
    
    // 从本地缓存删除
    this.localData.delete(key);

    // 触发同步回调
    const callbacks = this.syncCallbacks.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(null, 'deleted');
      } catch (error) {
        console.error('数据删除回调错误:', error);
      }
    });

    console.log(`🗑️ 数据删除: ${key}`);
  }

  /**
   * 设置同步数据
   * @param {string} key - 数据键
   * @param {*} value - 数据值
   */
  async setData(key, value) {
    // 更新本地缓存
    this.localData.set(key, {
      value,
      timestamp: Date.now(),
      source: 'local'
    });

    // 同步到 SharedWorker
    await this.sharedWorker.setSharedData(key, value);
  }

  /**
   * 获取同步数据
   * @param {string} key - 数据键
   * @param {boolean} forceRemote - 是否强制从远程获取
   * @returns {*} 数据值
   */
  async getData(key, forceRemote = false) {
    if (!forceRemote && this.localData.has(key)) {
      return this.localData.get(key).value;
    }

    const result = await this.sharedWorker.getSharedData(key);
    if (result.exists) {
      // 更新本地缓存
      this.localData.set(key, {
        value: result.value,
        timestamp: Date.now(),
        source: 'remote'
      });
      return result.value;
    }

    return null;
  }

  /**
   * 删除同步数据
   * @param {string} key - 数据键
   */
  async deleteData(key) {
    // 从本地缓存删除
    this.localData.delete(key);

    // 从 SharedWorker 删除
    await this.sharedWorker.deleteSharedData(key);
  }

  /**
   * 监听数据变更
   * @param {string} key - 数据键
   * @param {Function} callback - 回调函数
   */
  onDataChange(key, callback) {
    if (!this.syncCallbacks.has(key)) {
      this.syncCallbacks.set(key, []);
    }
    this.syncCallbacks.get(key).push(callback);
  }

  /**
   * 取消监听数据变更
   * @param {string} key - 数据键
   * @param {Function} callback - 回调函数
   */
  offDataChange(key, callback) {
    const callbacks = this.syncCallbacks.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 获取所有本地缓存数据
   * @returns {Object} 所有数据
   */
  getAllLocalData() {
    const allData = {};
    this.localData.forEach((item, key) => {
      allData[key] = item;
    });
    return allData;
  }

  /**
   * 清空所有数据
   */
  async clearAllData() {
    const keys = Array.from(this.localData.keys());
    for (const key of keys) {
      await this.deleteData(key);
    }
  }
}

// 使用示例
const dataSync = new CrossPageDataSync();

// 初始化
await dataSync.initialize();

// 设置数据并监听变更
dataSync.onDataChange('user-settings', (value, action) => {
  console.log(`用户设置${action}:`, value);
  if (action === 'changed' && value) {
    // 更新UI
    updateUserInterface(value);
  }
});

// 设置用户配置
await dataSync.setData('user-settings', {
  theme: 'dark',
  language: 'zh-CN',
  notifications: true
});

// 在其他页面或组件中获取数据
const userSettings = await dataSync.getData('user-settings');
console.log('当前用户设置:', userSettings);
```

---

## 5. 核心 API 详解

### 5.1 Worker 构造函数详解

```javascript
/**
 * Worker 构造函数参数详解
 * @param {string} scriptURL - Worker 脚本的 URL
 * @param {Object} options - 可选配置参数
 */

// 基础用法
const basicWorker = new Worker('./worker.js');

// 完整配置用法
const advancedWorker = new Worker('./worker.js', {
  type: 'classic',        // 'classic' | 'module'
  name: 'my-worker',      // Worker 名称，用于调试
  credentials: 'same-origin' // 'omit' | 'same-origin' | 'include'
});

// Module Worker 用法（ES6 模块）
const moduleWorker = new Worker('./worker.mjs', {
  type: 'module'
});
```

### 5.2 消息传递 API

| 方法/属性 | 描述 | 参数 | 返回值 |
|-----------|------|------|--------|
| `postMessage(message, transfer)` | 发送消息 | message: 任意值, transfer: 可转移对象数组 | void |
| `onmessage` | 消息接收事件处理器 | event: MessageEvent | void |
| `onmessageerror` | 消息错误事件处理器 | event: MessageEvent | void |
| `onerror` | 错误事件处理器 | event: ErrorEvent | void |
| `terminate()` | 终止 Worker | 无 | void |

### 5.3 可转移对象（Transferable Objects）

```javascript
/**
 * 可转移对象使用示例
 * 这些对象可以在线程间高效传输而无需复制
 */
class TransferableObjectManager {
  /**
   * 演示 ArrayBuffer 传输
   */
  static demonstrateArrayBufferTransfer() {
    const buffer = new ArrayBuffer(1024 * 1024); // 1MB
    const uint8Array = new Uint8Array(buffer);
    
    // 填充一些数据
    for (let i = 0; i < uint8Array.length; i++) {
      uint8Array[i] = i % 256;
    }

    const worker = new Worker('./transfer-worker.js');
    
    console.log('传输前 buffer.byteLength:', buffer.byteLength);
    
    // 传输 ArrayBuffer（所有权转移）
    worker.postMessage({
      type: 'process-buffer',
      buffer: buffer
    }, [buffer]);
    
    console.log('传输后 buffer.byteLength:', buffer.byteLength); // 0，所有权已转移
  }

  /**
   * 演示 MessagePort 传输
   */
  static demonstrateMessagePortTransfer() {
    const channel = new MessageChannel();
    const worker = new Worker('./port-worker.js');
    
    // 传输一个端口给 Worker
    worker.postMessage({
      type: 'setup-channel',
      port: channel.port2
    }, [channel.port2]);

    // 通过另一个端口与 Worker 通信
    channel.port1.onmessage = (event) => {
      console.log('通过 MessagePort 收到:', event.data);
    };

    channel.port1.postMessage('Hello via MessagePort!');
  }

  /**
   * 演示 ImageBitmap 传输
   */
  static async demonstrateImageBitmapTransfer() {
    // 创建一个 canvas 和 ImageBitmap
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // 绘制一些内容
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = 'blue';
    ctx.fillRect(100, 100, 100, 100);

    const imageBitmap = await createImageBitmap(canvas);
    const worker = new Worker('./image-worker.js');

    // 传输 ImageBitmap
    worker.postMessage({
      type: 'process-image',
      image: imageBitmap
    }, [imageBitmap]);
  }
}
```

### 5.4 WorkerGlobalScope API

```javascript
// worker-global-scope.js
/**
 * WorkerGlobalScope 是所有 Worker 的全局作用域基类
 * 提供了 Worker 内部可用的全局方法和属性
 */

// 全局作用域引用
console.log('Worker 全局作用域:', self);
console.log('Worker 类型:', self.constructor.name);

/**
 * importScripts - 导入外部脚本
 * 可以导入多个脚本，支持跨域（如果服务器允许）
 */
self.importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
  './utils.js',
  './data-processor.js'
);

/**
 * 全局错误处理
 */
self.addEventListener('error', (event) => {
  console.error('Worker 全局错误:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // 向主线程报告错误
  self.postMessage({
    type: 'error-report',
    error: {
      message: event.message,
      stack: event.error?.stack
    }
  });
});

/**
 * 未捕获的 Promise 拒绝处理
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('Worker 未处理的 Promise 拒绝:', event.reason);
  
  // 向主线程报告错误
  self.postMessage({
    type: 'promise-rejection',
    reason: event.reason?.toString()
  });
  
  // 阻止默认的控制台错误输出
  event.preventDefault();
});

/**
 * Worker 性能监控
 */
class WorkerPerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.messageCount = 0;
    this.processingTimes = [];
  }

  /**
   * 记录处理时间
   */
  recordProcessingTime(startTime, endTime) {
    const duration = endTime - startTime;
    this.processingTimes.push(duration);
    
    // 保持最近100条记录
    if (this.processingTimes.length > 100) {
      this.processingTimes.shift();
    }
  }

  /**
   * 获取性能统计
   */
  getStats() {
    const uptimeMs = performance.now() - this.startTime;
    const avgProcessingTime = this.processingTimes.length > 0
      ? this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length
      : 0;

    return {
      uptimeMs,
      uptimeHours: uptimeMs / (1000 * 60 * 60),
      messageCount: this.messageCount,
      averageProcessingTime: avgProcessingTime,
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * 获取内存使用情况（如果支持）
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}

const performanceMonitor = new WorkerPerformanceMonitor();

/**
 * 消息处理器
 */
self.addEventListener('message', (event) => {
  const startTime = performance.now();
  performanceMonitor.messageCount++;

  const { type, data, requestId } = event.data;

  try {
    let result;

    switch (type) {
      case 'get-stats':
        result = performanceMonitor.getStats();
        break;

      case 'heavy-computation':
        result = performHeavyComputation(data);
        break;

      case 'data-processing':
        result = processData(data);
        break;

      default:
        throw new Error(`未知消息类型: ${type}`);
    }

    const endTime = performance.now();
    performanceMonitor.recordProcessingTime(startTime, endTime);

    // 发送成功响应
    self.postMessage({
      requestId,
      result,
      processingTime: endTime - startTime
    });

  } catch (error) {
    const endTime = performance.now();
    performanceMonitor.recordProcessingTime(startTime, endTime);

    // 发送错误响应
    self.postMessage({
      requestId,
      error: error.message,
      processingTime: endTime - startTime
    });
  }
});

/**
 * 重型计算示例
 */
function performHeavyComputation(params) {
  const { operation, iterations = 1000000 } = params;

  switch (operation) {
    case 'prime-calculation':
      return calculatePrimes(iterations);
    
    case 'matrix-multiplication':
      return multiplyMatrices(params.matrixA, params.matrixB);
    
    case 'sorting':
      return sortLargeArray(params.array);
    
    default:
      throw new Error(`不支持的计算操作: ${operation}`);
  }
}

/**
 * 计算质数
 */
function calculatePrimes(limit) {
  const primes = [];
  const sieve = new Array(limit + 1).fill(true);
  
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }
  
  return primes;
}

/**
 * 矩阵乘法
 */
function multiplyMatrices(a, b) {
  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;
  
  const result = Array(rowsA).fill().map(() => Array(colsB).fill(0));
  
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

/**
 * 大数组排序
 */
function sortLargeArray(array) {
  const startTime = performance.now();
  const sorted = [...array].sort((a, b) => a - b);
  const endTime = performance.now();
  
  return {
    sorted,
    originalLength: array.length,
    sortingTime: endTime - startTime
  };
}

/**
 * 数据处理示例
 */
function processData(data) {
  const { type, payload } = data;

  switch (type) {
    case 'csv-parse':
      return parseCSV(payload);
    
    case 'json-transform':
      return transformJSON(payload);
    
    case 'image-analysis':
      return analyzeImageData(payload);
    
    default:
      throw new Error(`不支持的数据处理类型: ${type}`);
  }
}

// 定期向主线程发送统计信息
setInterval(() => {
  self.postMessage({
    type: 'performance-stats',
    stats: performanceMonitor.getStats()
  });
}, 30000); // 每30秒发送一次
```

### 5.5 错误处理最佳实践

```javascript
/**
 * Worker 错误处理工具类
 * 提供完整的错误捕获、分类和报告功能
 */
class WorkerErrorHandler {
  constructor() {
    this.errorTypes = {
      SYNTAX_ERROR: 'syntax_error',
      REFERENCE_ERROR: 'reference_error',
      TYPE_ERROR: 'type_error',
      RANGE_ERROR: 'range_error',
      NETWORK_ERROR: 'network_error',
      TIMEOUT_ERROR: 'timeout_error',
      CUSTOM_ERROR: 'custom_error'
    };
    
    this.errorHistory = [];
    this.maxErrorHistory = 100;
  }

  /**
   * 初始化错误处理
   */
  initialize() {
    // 监听全局错误
    self.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // 监听未处理的 Promise 拒绝
    self.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });

    console.log('✅ Worker 错误处理器已初始化');
  }

  /**
   * 处理错误
   */
  handleError(error, context = {}) {
    const errorInfo = this.categorizeError(error, context);
    this.logError(errorInfo);
    this.reportError(errorInfo);
    
    // 根据错误类型决定是否继续执行
    if (errorInfo.severity === 'critical') {
      this.handleCriticalError(errorInfo);
    }
  }

  /**
   * 错误分类
   */
  categorizeError(error, context) {
    let errorType = this.errorTypes.CUSTOM_ERROR;
    let severity = 'medium';

    if (error instanceof SyntaxError) {
      errorType = this.errorTypes.SYNTAX_ERROR;
      severity = 'high';
    } else if (error instanceof ReferenceError) {
      errorType = this.errorTypes.REFERENCE_ERROR;
      severity = 'high';
    } else if (error instanceof TypeError) {
      errorType = this.errorTypes.TYPE_ERROR;
      severity = 'medium';
    } else if (error instanceof RangeError) {
      errorType = this.errorTypes.RANGE_ERROR;
      severity = 'medium';
    }

    // 检查是否是网络相关错误
    if (error.message && error.message.includes('fetch')) {
      errorType = this.errorTypes.NETWORK_ERROR;
      severity = 'low';
    }

    // 检查是否是超时错误
    if (error.message && error.message.includes('timeout')) {
      errorType = this.errorTypes.TIMEOUT_ERROR;
      severity = 'medium';
    }

    return {
      type: errorType,
      severity,
      message: error.message || error.toString(),
      stack: error.stack,
      timestamp: Date.now(),
      context,
      id: this.generateErrorId()
    };
  }

  /**
   * 记录错误
   */
  logError(errorInfo) {
    // 添加到错误历史
    this.errorHistory.push(errorInfo);
    
    // 保持历史记录限制
    if (this.errorHistory.length > this.maxErrorHistory) {
      this.errorHistory.shift();
    }

    // 控制台输出
    const logLevel = this.getLogLevel(errorInfo.severity);
    console[logLevel](`❌ [${errorInfo.type}] ${errorInfo.message}`, {
      id: errorInfo.id,
      stack: errorInfo.stack,
      context: errorInfo.context
    });
  }

  /**
   * 报告错误到主线程
   */
  reportError(errorInfo) {
    self.postMessage({
      type: 'worker-error-report',
      error: {
        ...errorInfo,
        // 移除可能过大的 stack 信息
        stack: errorInfo.stack ? errorInfo.stack.substring(0, 1000) : null
      }
    });
  }

  /**
   * 处理严重错误
   */
  handleCriticalError(errorInfo) {
    console.error('🚨 检测到严重错误，Worker 可能需要重启:', errorInfo);
    
    // 发送严重错误通知
    self.postMessage({
      type: 'worker-critical-error',
      error: errorInfo,
      recommendation: 'restart_worker'
    });

    // 可选择：自动关闭 Worker
    // setTimeout(() => self.close(), 1000);
  }

  /**
   * 生成错误ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取日志级别
   */
  getLogLevel(severity) {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'log';
    }
  }

  /**
   * 获取错误统计
   */
  getErrorStats() {
    const stats = {
      total: this.errorHistory.length,
      byType: {},
      bySeverity: {},
      recent: this.errorHistory.slice(-10)
    };

    this.errorHistory.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  /**
   * 清除错误历史
   */
  clearErrorHistory() {
    this.errorHistory = [];
    console.log('🧹 错误历史已清除');
  }
}

// 初始化错误处理器
const errorHandler = new WorkerErrorHandler();
errorHandler.initialize();

// 导出错误处理器（如果需要在其他地方使用）
self.errorHandler = errorHandler;
```

## 6. 高级功能应用

### 6.1 Web Worker 线程池

```javascript
/**
 * Worker 线程池管理器
 * 提供高效的多线程任务调度和负载均衡
 */
class WorkerPool {
  constructor(options = {}) {
    this.poolSize = options.poolSize || navigator.hardwareConcurrency || 4;
    this.scriptURL = options.scriptURL;
    this.workerType = options.workerType || 'classic';
    
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers = new Set();
    this.taskQueue = [];
    this.currentTaskId = 0;
    this.statistics = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageExecutionTime: 0
    };
  }

  /**
   * 初始化线程池
   */
  async initialize() {
    console.log(`🏊‍♂️ 初始化 Worker 线程池，大小: ${this.poolSize}`);
    
    const initPromises = [];
    for (let i = 0; i < this.poolSize; i++) {
      initPromises.push(this.createWorker(i));
    }

    await Promise.all(initPromises);
    console.log('✅ Worker 线程池初始化完成');
  }

  /**
   * 创建单个 Worker
   */
  async createWorker(id) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.scriptURL, {
        type: this.workerType,
        name: `pool-worker-${id}`
      });

      const workerInfo = {
        id,
        worker,
        busy: false,
        taskCount: 0,
        totalExecutionTime: 0,
        errors: 0
      };

      // 设置消息监听
      worker.onmessage = (event) => {
        this.handleWorkerMessage(workerInfo, event.data);
      };

      // 设置错误监听
      worker.onerror = (error) => {
        this.handleWorkerError(workerInfo, error);
      };

      // 添加到池中
      this.workers.push(workerInfo);
      this.availableWorkers.push(workerInfo);

      resolve(workerInfo);
    });
  }

  /**
   * 处理 Worker 消息
   */
  handleWorkerMessage(workerInfo, data) {
    const { taskId, result, error, executionTime } = data;
    
    if (error) {
      this.handleTaskError(taskId, error);
      workerInfo.errors++;
    } else {
      this.handleTaskSuccess(taskId, result, executionTime);
    }

    // 更新 Worker 统计
    if (executionTime) {
      workerInfo.totalExecutionTime += executionTime;
    }

    // 释放 Worker
    this.releaseWorker(workerInfo);
  }

  /**
   * 处理 Worker 错误
   */
  handleWorkerError(workerInfo, error) {
    console.error(`❌ Worker ${workerInfo.id} 发生错误:`, error);
    workerInfo.errors++;
    
    // 释放 Worker
    this.releaseWorker(workerInfo);
  }

  /**
   * 释放 Worker
   */
  releaseWorker(workerInfo) {
    workerInfo.busy = false;
    this.busyWorkers.delete(workerInfo);
    this.availableWorkers.push(workerInfo);
    
    // 处理队列中的下一个任务
    this.processNextTask();
  }

  /**
   * 执行任务
   */
  execute(taskData, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const taskId = ++this.currentTaskId;
      const task = {
        id: taskId,
        data: taskData,
        resolve,
        reject,
        timeout,
        createdAt: Date.now()
      };

      this.statistics.totalTasks++;
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        this.handleTaskTimeout(taskId);
      }, timeout);

      task.timeoutId = timeoutId;

      // 如果有可用 Worker，立即执行
      if (this.availableWorkers.length > 0) {
        this.assignTask(task);
      } else {
        // 否则加入队列
        this.taskQueue.push(task);
      }
    });
  }

  /**
   * 分配任务给 Worker
   */
  assignTask(task) {
    const worker = this.availableWorkers.pop();
    if (!worker) {
      this.taskQueue.push(task);
      return;
    }

    worker.busy = true;
    worker.taskCount++;
    this.busyWorkers.add(worker);

    // 存储任务引用
    worker.currentTask = task;

    // 发送任务给 Worker
    worker.worker.postMessage({
      taskId: task.id,
      data: task.data,
      timestamp: Date.now()
    });
  }

  /**
   * 处理下一个任务
   */
  processNextTask() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const task = this.taskQueue.shift();
      this.assignTask(task);
    }
  }

  /**
   * 处理任务成功
   */
  handleTaskSuccess(taskId, result, executionTime) {
    const task = this.findAndRemoveTask(taskId);
    if (task) {
      clearTimeout(task.timeoutId);
      this.statistics.completedTasks++;
      
      // 更新平均执行时间
      this.updateAverageExecutionTime(executionTime);
      
      task.resolve(result);
    }
  }

  /**
   * 处理任务错误
   */
  handleTaskError(taskId, error) {
    const task = this.findAndRemoveTask(taskId);
    if (task) {
      clearTimeout(task.timeoutId);
      this.statistics.failedTasks++;
      task.reject(new Error(error));
    }
  }

  /**
   * 处理任务超时
   */
  handleTaskTimeout(taskId) {
    const task = this.findAndRemoveTask(taskId);
    if (task) {
      this.statistics.failedTasks++;
      task.reject(new Error(`任务 ${taskId} 执行超时`));
    }
  }

  /**
   * 查找并移除任务
   */
  findAndRemoveTask(taskId) {
    // 从正在执行的 Worker 中查找
    for (const worker of this.busyWorkers) {
      if (worker.currentTask && worker.currentTask.id === taskId) {
        const task = worker.currentTask;
        worker.currentTask = null;
        return task;
      }
    }

    // 从队列中查找
    const queueIndex = this.taskQueue.findIndex(task => task.id === taskId);
    if (queueIndex !== -1) {
      return this.taskQueue.splice(queueIndex, 1)[0];
    }

    return null;
  }

  /**
   * 更新平均执行时间
   */
  updateAverageExecutionTime(executionTime) {
    const total = this.statistics.averageExecutionTime * (this.statistics.completedTasks - 1);
    this.statistics.averageExecutionTime = (total + executionTime) / this.statistics.completedTasks;
  }

  /**
   * 获取线程池统计信息
   */
  getStatistics() {
    const workerStats = this.workers.map(worker => ({
      id: worker.id,
      busy: worker.busy,
      taskCount: worker.taskCount,
      averageExecutionTime: worker.taskCount > 0 
        ? worker.totalExecutionTime / worker.taskCount 
        : 0,
      errors: worker.errors
    }));

    return {
      poolSize: this.poolSize,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.busyWorkers.size,
      queuedTasks: this.taskQueue.length,
      statistics: { ...this.statistics },
      workers: workerStats
    };
  }

  /**
   * 动态调整线程池大小
   */
  async resize(newSize) {
    if (newSize === this.poolSize) return;

    if (newSize > this.poolSize) {
      // 增加 Worker
      const addCount = newSize - this.poolSize;
      console.log(`📈 增加 ${addCount} 个 Worker`);
      
      const addPromises = [];
      for (let i = 0; i < addCount; i++) {
        addPromises.push(this.createWorker(this.poolSize + i));
      }
      
      await Promise.all(addPromises);
    } else {
      // 减少 Worker
      const removeCount = this.poolSize - newSize;
      console.log(`📉 减少 ${removeCount} 个 Worker`);
      
      for (let i = 0; i < removeCount; i++) {
        const worker = this.availableWorkers.pop() || this.workers.pop();
        if (worker) {
          worker.worker.terminate();
          this.workers.splice(this.workers.indexOf(worker), 1);
        }
      }
    }

    this.poolSize = newSize;
    console.log(`✅ 线程池大小已调整为: ${this.poolSize}`);
  }

  /**
   * 终止所有 Worker
   */
  terminate() {
    console.log('🛑 终止 Worker 线程池');
    
    // 清除所有待处理任务
    this.taskQueue.forEach(task => {
      clearTimeout(task.timeoutId);
      task.reject(new Error('线程池已终止'));
    });
    this.taskQueue = [];

    // 终止所有 Worker
    this.workers.forEach(workerInfo => {
      workerInfo.worker.terminate();
    });

    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers.clear();
  }
}

// 使用示例
const workerPool = new WorkerPool({
  scriptURL: './pool-worker.js',
  poolSize: 4
});

// 初始化线程池
await workerPool.initialize();

// 批量执行任务
const tasks = Array.from({ length: 20 }, (_, i) => ({
  operation: 'heavy-calculation',
  data: i * 1000
}));

const results = await Promise.allSettled(
  tasks.map(task => workerPool.execute(task))
);

console.log('任务执行结果:', results);
console.log('线程池统计:', workerPool.getStatistics());
```

### 6.2 动态模块加载

```javascript
/**
 * 动态 Worker 模块加载器
 * 支持运行时动态加载和执行 Worker 模块
 */
class DynamicWorkerLoader {
  constructor() {
    this.loadedModules = new Map();
    this.workerPool = new Map();
    this.moduleCache = new Map();
  }

  /**
   * 创建动态 Worker
   */
  async createDynamicWorker(modules = [], options = {}) {
    const workerId = `dynamic_worker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 生成 Worker 脚本
    const workerScript = this.generateWorkerScript(modules);
    
    // 创建 Blob URL
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerURL = URL.createObjectURL(blob);

    try {
      const worker = new Worker(workerURL, {
        type: options.type || 'classic',
        name: workerId
      });

      // 设置 Worker 管理信息
      const workerInfo = {
        id: workerId,
        worker,
        url: workerURL,
        modules,
        created: Date.now(),
        messageCount: 0
      };

      // 设置消息监听
      worker.onmessage = (event) => {
        workerInfo.messageCount++;
        this.handleWorkerMessage(workerId, event.data);
      };

      worker.onerror = (error) => {
        this.handleWorkerError(workerId, error);
      };

      this.workerPool.set(workerId, workerInfo);
      
      console.log(`✅ 动态 Worker ${workerId} 创建成功`);
      return { workerId, worker };

    } catch (error) {
      URL.revokeObjectURL(workerURL);
      throw error;
    }
  }

  /**
   * 生成 Worker 脚本
   */
  generateWorkerScript(modules) {
    const moduleImports = modules.map(module => {
      if (typeof module === 'string') {
        return `importScripts('${module}');`;
      } else if (module.url) {
        return `importScripts('${module.url}');`;
      } else if (module.code) {
        return module.code;
      }
      return '';
    }).join('\n');

    return `
      ${moduleImports}
      
      // 动态 Worker 核心代码
      class DynamicWorkerCore {
        constructor() {
          this.functions = new Map();
          this.modules = new Map();
        }

        registerFunction(name, fn) {
          this.functions.set(name, fn);
        }

        registerModule(name, moduleExports) {
          this.modules.set(name, moduleExports);
        }

        async executeFunction(name, ...args) {
          const fn = this.functions.get(name);
          if (!fn) {
            throw new Error(\`Function \${name} not found\`);
          }
          
          return await fn(...args);
        }

        getModule(name) {
          return this.modules.get(name);
        }

        listAvailableFunctions() {
          return Array.from(this.functions.keys());
        }

        listAvailableModules() {
          return Array.from(this.modules.keys());
        }
      }

      const workerCore = new DynamicWorkerCore();

      // 消息处理
      self.addEventListener('message', async (event) => {
        const { type, data, requestId } = event.data;

        try {
          let result;

          switch (type) {
            case 'execute-function':
              result = await workerCore.executeFunction(data.name, ...data.args);
              break;

            case 'register-function':
              const fn = new Function('return ' + data.code)();
              workerCore.registerFunction(data.name, fn);
              result = { success: true, name: data.name };
              break;

            case 'register-module':
              workerCore.registerModule(data.name, data.exports);
              result = { success: true, name: data.name };
              break;

            case 'list-functions':
              result = workerCore.listAvailableFunctions();
              break;

            case 'list-modules':
              result = workerCore.listAvailableModules();
              break;

            case 'eval-code':
              result = eval(data.code);
              break;

            default:
              throw new Error(\`Unknown message type: \${type}\`);
          }

          self.postMessage({
            requestId,
            result,
            success: true
          });

        } catch (error) {
          self.postMessage({
            requestId,
            error: error.message,
            success: false
          });
        }
      });

      // 发送就绪信号
      self.postMessage({
        type: 'ready',
        timestamp: Date.now()
      });
    `;
  }

  /**
   * 处理 Worker 消息
   */
  handleWorkerMessage(workerId, data) {
    // 可以在这里添加全局消息处理逻辑
    console.log(`📨 Worker ${workerId} 消息:`, data);
  }

  /**
   * 处理 Worker 错误
   */
  handleWorkerError(workerId, error) {
    console.error(`❌ Worker ${workerId} 错误:`, error);
  }

  /**
   * 向 Worker 发送消息
   */
  async sendMessage(workerId, type, data) {
    const workerInfo = this.workerPool.get(workerId);
    if (!workerInfo) {
      throw new Error(`Worker ${workerId} not found`);
    }

    return new Promise((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 临时存储回调
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          clearTimeout(timeout);
          workerInfo.worker.removeEventListener('message', messageHandler);
          
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };

      workerInfo.worker.addEventListener('message', messageHandler);
      workerInfo.worker.postMessage({ type, data, requestId });
    });
  }

  /**
   * 注册函数到 Worker
   */
  async registerFunction(workerId, name, functionCode) {
    return this.sendMessage(workerId, 'register-function', {
      name,
      code: functionCode
    });
  }

  /**
   * 执行 Worker 函数
   */
  async executeFunction(workerId, functionName, ...args) {
    return this.sendMessage(workerId, 'execute-function', {
      name: functionName,
      args
    });
  }

  /**
   * 在 Worker 中执行代码
   */
  async evaluateCode(workerId, code) {
    return this.sendMessage(workerId, 'eval-code', { code });
  }

  /**
   * 获取 Worker 可用函数列表
   */
  async listFunctions(workerId) {
    return this.sendMessage(workerId, 'list-functions', {});
  }

  /**
   * 终止 Worker
   */
  terminateWorker(workerId) {
    const workerInfo = this.workerPool.get(workerId);
    if (workerInfo) {
      workerInfo.worker.terminate();
      URL.revokeObjectURL(workerInfo.url);
      this.workerPool.delete(workerId);
      console.log(`🛑 Worker ${workerId} 已终止`);
    }
  }

  /**
   * 终止所有 Worker
   */
  terminateAllWorkers() {
    for (const workerId of this.workerPool.keys()) {
      this.terminateWorker(workerId);
    }
    console.log('🧹 所有动态 Worker 已清理');
  }

  /**
   * 获取 Worker 统计信息
   */
  getWorkerStats() {
    const stats = {};
    this.workerPool.forEach((info, id) => {
      stats[id] = {
        created: info.created,
        messageCount: info.messageCount,
        modules: info.modules,
        uptime: Date.now() - info.created
      };
    });
    return stats;
  }
}

// 使用示例
const dynamicLoader = new DynamicWorkerLoader();

// 创建带有预加载模块的动态 Worker
const { workerId, worker } = await dynamicLoader.createDynamicWorker([
  'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
  {
    code: `
      // 自定义工具函数
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      function isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) return false;
        }
        return true;
      }
    `
  }
]);

// 注册新函数
await dynamicLoader.registerFunction(workerId, 'calculateFactorial', `
  function(n) {
    if (n <= 1) return 1;
    return n * arguments.callee(n - 1);
  }
`);

// 执行函数
const fibResult = await dynamicLoader.executeFunction(workerId, 'fibonacci', 10);
const factorialResult = await dynamicLoader.executeFunction(workerId, 'calculateFactorial', 5);

console.log('斐波那契结果:', fibResult);
console.log('阶乘结果:', factorialResult);

// 获取统计信息
console.log('Worker 统计:', dynamicLoader.getWorkerStats());
```

### 6.3 实时数据流处理

```javascript
/**
 * Worker 实时数据流处理器
 * 用于处理大量实时数据流，如日志分析、监控数据等
 */
class WorkerStreamProcessor {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 1000;
    this.processingInterval = options.processingInterval || 100;
    this.maxBufferSize = options.maxBufferSize || 10000;
    
    this.dataBuffer = [];
    this.processingQueue = [];
    this.isProcessing = false;
    this.statistics = {
      totalProcessed: 0,
      totalErrors: 0,
      averageProcessingTime: 0,
      bufferOverflows: 0
    };

    this.worker = null;
    this.processors = new Map();
    this.subscribers = new Map();
  }

  /**
   * 初始化流处理器
   */
  async initialize(workerScript) {
    this.worker = new Worker(workerScript);
    
    this.worker.onmessage = (event) => {
      this.handleWorkerMessage(event.data);
    };

    this.worker.onerror = (error) => {
      console.error('❌ Stream Worker 错误:', error);
    };

    // 启动处理循环
    this.startProcessingLoop();
    
    console.log('✅ 实时数据流处理器初始化完成');
  }

  /**
   * 添加数据到流
   */
  addData(data) {
    // 检查缓冲区大小
    if (this.dataBuffer.length >= this.maxBufferSize) {
      this.statistics.bufferOverflows++;
      console.warn('⚠️ 数据缓冲区溢出，丢弃旧数据');
      this.dataBuffer.splice(0, this.batchSize); // 移除最旧的数据
    }

    // 添加时间戳
    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
      id: this.generateDataId()
    };

    this.dataBuffer.push(dataWithTimestamp);
  }

  /**
   * 批量添加数据
   */
  addBatchData(dataArray) {
    const timestampedData = dataArray.map(data => ({
      ...data,
      timestamp: Date.now(),
      id: this.generateDataId()
    }));

    // 检查缓冲区容量
    const totalSize = this.dataBuffer.length + timestampedData.length;
    if (totalSize > this.maxBufferSize) {
      const overflow = totalSize - this.maxBufferSize;
      this.statistics.bufferOverflows++;
      this.dataBuffer.splice(0, overflow);
    }

    this.dataBuffer.push(...timestampedData);
  }

  /**
   * 注册数据处理器
   */
  registerProcessor(name, config) {
    this.processors.set(name, {
      ...config,
      name,
      processedCount: 0,
      errorCount: 0,
      lastProcessed: null
    });

    console.log(`📝 注册处理器: ${name}`);
  }

  /**
   * 订阅处理结果
   */
  subscribe(processorName, callback) {
    if (!this.subscribers.has(processorName)) {
      this.subscribers.set(processorName, []);
    }
    this.subscribers.get(processorName).push(callback);
  }

  /**
   * 取消订阅
   */
  unsubscribe(processorName, callback) {
    const subscribers = this.subscribers.get(processorName);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    }
  }

  /**
   * 启动处理循环
   */
  startProcessingLoop() {
    setInterval(() => {
      this.processBatch();
    }, this.processingInterval);
  }

  /**
   * 处理批次数据
   */
  async processBatch() {
    if (this.isProcessing || this.dataBuffer.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // 取出一批数据
      const batchData = this.dataBuffer.splice(0, this.batchSize);
      
      // 为每个处理器创建处理任务
      const processingPromises = [];
      
      for (const [name, processor] of this.processors) {
        if (processor.enabled !== false) {
          processingPromises.push(
            this.processWithProcessor(name, processor, batchData)
          );
        }
      }

      // 并行执行所有处理器
      await Promise.allSettled(processingPromises);

    } catch (error) {
      console.error('❌ 批次处理错误:', error);
      this.statistics.totalErrors++;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 使用特定处理器处理数据
   */
  async processWithProcessor(name, processor, data) {
    const startTime = performance.now();

    try {
      // 发送数据给 Worker 处理
      const result = await this.sendToWorker({
        type: 'process',
        processor: name,
        config: processor,
        data: data
      });

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // 更新处理器统计
      processor.processedCount += data.length;
      processor.lastProcessed = Date.now();

      // 更新全局统计
      this.statistics.totalProcessed += data.length;
      this.updateAverageProcessingTime(processingTime);

      // 通知订阅者
      this.notifySubscribers(name, result, data);

      console.log(`✅ 处理器 ${name} 处理了 ${data.length} 条数据，耗时 ${processingTime.toFixed(2)}ms`);

    } catch (error) {
      console.error(`❌ 处理器 ${name} 处理失败:`, error);
      processor.errorCount++;
      this.statistics.totalErrors++;
    }
  }

  /**
   * 发送消息给 Worker
   */
  sendToWorker(data) {
    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      
      const timeout = setTimeout(() => {
        reject(new Error('Worker 处理超时'));
      }, 30000);

      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          clearTimeout(timeout);
          this.worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({ ...data, requestId });
    });
  }

  /**
   * 处理 Worker 消息
   */
  handleWorkerMessage(data) {
    if (data.type === 'progress') {
      console.log(`📊 处理进度: ${data.progress}%`);
    } else if (data.type === 'stats') {
      console.log('📈 Worker 统计:', data.stats);
    }
  }

  /**
   * 通知订阅者
   */
  notifySubscribers(processorName, result, originalData) {
    const subscribers = this.subscribers.get(processorName);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(result, originalData);
        } catch (error) {
          console.error(`❌ 订阅者回调错误:`, error);
        }
      });
    }
  }

  /**
   * 更新平均处理时间
   */
  updateAverageProcessingTime(processingTime) {
    const total = this.statistics.averageProcessingTime * this.statistics.totalProcessed;
    this.statistics.averageProcessingTime = total / (this.statistics.totalProcessed + 1);
  }

  /**
   * 生成数据ID
   */
  generateDataId() {
    return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成请求ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取处理器统计
   */
  getProcessorStats() {
    const stats = {};
    this.processors.forEach((processor, name) => {
      stats[name] = {
        processedCount: processor.processedCount,
        errorCount: processor.errorCount,
        lastProcessed: processor.lastProcessed,
        enabled: processor.enabled !== false
      };
    });
    return stats;
  }

  /**
   * 获取全局统计
   */
  getGlobalStats() {
    return {
      ...this.statistics,
      bufferSize: this.dataBuffer.length,
      processingQueueSize: this.processingQueue.length,
      registeredProcessors: this.processors.size,
      isProcessing: this.isProcessing
    };
  }

  /**
   * 暂停处理
   */
  pause() {
    this.isProcessing = true;
    console.log('⏸️ 数据流处理已暂停');
  }

  /**
   * 恢复处理
   */
  resume() {
    this.isProcessing = false;
    console.log('▶️ 数据流处理已恢复');
  }

  /**
   * 清空缓冲区
   */
  clearBuffer() {
    const clearedCount = this.dataBuffer.length;
    this.dataBuffer = [];
    console.log(`🧹 清空了 ${clearedCount} 条缓冲数据`);
  }

  /**
   * 关闭处理器
   */
  shutdown() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    this.dataBuffer = [];
    this.processingQueue = [];
    this.processors.clear();
    this.subscribers.clear();
    
    console.log('🛑 数据流处理器已关闭');
  }
}

// 使用示例
const streamProcessor = new WorkerStreamProcessor({
  batchSize: 500,
  processingInterval: 200,
  maxBufferSize: 5000
});

// 初始化
await streamProcessor.initialize('./stream-worker.js');

// 注册处理器
streamProcessor.registerProcessor('log-analyzer', {
  type: 'log-analysis',
  filters: ['error', 'warning'],
  aggregation: 'count',
  timeWindow: 60000 // 1分钟窗口
});

streamProcessor.registerProcessor('metric-calculator', {
  type: 'metrics',
  calculations: ['average', 'min', 'max', 'sum'],
  fields: ['responseTime', 'requestCount']
});

// 订阅处理结果
streamProcessor.subscribe('log-analyzer', (result, data) => {
  if (result.alerts && result.alerts.length > 0) {
    console.log('🚨 检测到告警:', result.alerts);
  }
});

streamProcessor.subscribe('metric-calculator', (result, data) => {
  console.log('📊 指标计算结果:', result.metrics);
});

// 模拟数据流输入
setInterval(() => {
  const sampleData = Array.from({ length: 10 }, () => ({
    level: Math.random() > 0.8 ? 'error' : 'info',
    message: `Sample log message ${Date.now()}`,
    responseTime: Math.floor(Math.random() * 1000),
    requestCount: Math.floor(Math.random() * 100),
    source: 'web-server'
  }));
  
  streamProcessor.addBatchData(sampleData);
}, 1000);

// 定期打印统计信息
setInterval(() => {
  console.log('全局统计:', streamProcessor.getGlobalStats());
  console.log('处理器统计:', streamProcessor.getProcessorStats());
}, 10000);
```

---

## 7. 实际应用示例

### 7.1 图像处理应用

```javascript
/**
 * Worker 图像处理应用
 * 演示如何使用 Web Worker 进行复杂的图像处理操作
 */
class ImageProcessorApp {
  constructor() {
    this.workerPool = null;
    this.processedImages = new Map();
    this.processingQueue = [];
  }

  /**
   * 初始化图像处理应用
   */
  async initialize() {
    // 创建 Worker 线程池
    this.workerPool = new WorkerPool({
      scriptURL: './image-worker.js',
      poolSize: 2
    });

    await this.workerPool.initialize();
    console.log('✅ 图像处理应用初始化完成');
  }

  /**
   * 处理图像文件
   */
  async processImage(file, operations = []) {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('请选择有效的图像文件');
    }

    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // 将图像转换为 ImageData
      const imageData = await this.fileToImageData(file);
      
      // 执行图像处理
      const result = await this.workerPool.execute({
        type: 'process-image',
        imageId,
        imageData: {
          data: imageData.data,
          width: imageData.width,
          height: imageData.height
        },
        operations
      });

      // 存储处理结果
      this.processedImages.set(imageId, {
        original: imageData,
        processed: result,
        operations,
        timestamp: Date.now()
      });

      console.log(`✅ 图像 ${imageId} 处理完成`);
      return { imageId, result };

    } catch (error) {
      console.error('❌ 图像处理失败:', error);
      throw error;
    }
  }

  /**
   * 将文件转换为 ImageData
   */
  async fileToImageData(file) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 批量处理图像
   */
  async batchProcess(files, operations) {
    const results = [];
    const processingPromises = files.map(file => 
      this.processImage(file, operations)
    );

    const settledResults = await Promise.allSettled(processingPromises);
    
    settledResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error(`图像 ${index} 处理失败:`, result.reason);
        results.push({ error: result.reason.message });
      }
    });

    return results;
  }

  /**
   * 获取处理结果
   */
  getProcessedImage(imageId) {
    return this.processedImages.get(imageId);
  }

  /**
   * 导出处理后的图像
   */
  async exportImage(imageId, format = 'png') {
    const processedData = this.processedImages.get(imageId);
    if (!processedData) {
      throw new Error('图像数据不存在');
    }

    // 创建 canvas 并绘制处理后的图像
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { processed } = processedData;

    canvas.width = processed.width;
    canvas.height = processed.height;

    const imageData = new ImageData(
      new Uint8ClampedArray(processed.data),
      processed.width,
      processed.height
    );

    ctx.putImageData(imageData, 0, 0);

    // 转换为 Blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, `image/${format}`);
    });
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.workerPool) {
      this.workerPool.terminate();
    }
    this.processedImages.clear();
    console.log('🧹 图像处理应用资源已清理');
  }
}

// Worker 脚本：image-worker.js
const ImageWorkerScript = `
/**
 * 图像处理 Worker
 */
class ImageProcessor {
  constructor() {
    this.filters = new Map();
    this.setupFilters();
  }

  setupFilters() {
    // 灰度滤镜
    this.filters.set('grayscale', (imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;     // Red
        data[i + 1] = gray; // Green
        data[i + 2] = gray; // Blue
      }
      return imageData;
    });

    // 反色滤镜
    this.filters.set('invert', (imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }
      return imageData;
    });

    // 亮度调整
    this.filters.set('brightness', (imageData, value = 20) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + value));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value));
      }
      return imageData;
    });

    // 对比度调整
    this.filters.set('contrast', (imageData, factor = 1.2) => {
      const data = imageData.data;
      const intercept = 128 * (1 - factor);
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * factor + intercept));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + intercept));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + intercept));
      }
      return imageData;
    });

    // 模糊滤镜
    this.filters.set('blur', (imageData, radius = 1) => {
      return this.gaussianBlur(imageData, radius);
    });

    // 锐化滤镜
    this.filters.set('sharpen', (imageData) => {
      return this.convolution(imageData, [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
      ]);
    });
  }

  processImage(imageData, operations) {
    let result = {
      data: new Uint8ClampedArray(imageData.data),
      width: imageData.width,
      height: imageData.height
    };

    for (const operation of operations) {
      const { type, params = {} } = operation;
      const filter = this.filters.get(type);
      
      if (filter) {
        result = filter(result, ...Object.values(params));
      } else {
        console.warn(\`未知的滤镜类型: \${type}\`);
      }
    }

    return result;
  }

  // 高斯模糊实现
  gaussianBlur(imageData, radius) {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);
    
    // 简化的高斯模糊实现
    const kernel = this.generateGaussianKernel(radius);
    const kernelSize = kernel.length;
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - half));
            const py = Math.min(height - 1, Math.max(0, y + ky - half));
            const idx = (py * width + px) * 4;
            const weight = kernel[ky][kx];
            
            r += data[idx] * weight;
            g += data[idx + 1] * weight;
            b += data[idx + 2] * weight;
            a += data[idx + 3] * weight;
          }
        }
        
        const idx = (y * width + x) * 4;
        result[idx] = r;
        result[idx + 1] = g;
        result[idx + 2] = b;
        result[idx + 3] = a;
      }
    }

    return { data: result, width, height };
  }

  // 生成高斯内核
  generateGaussianKernel(radius) {
    const size = radius * 2 + 1;
    const kernel = [];
    const sigma = radius / 3;
    let sum = 0;

    for (let y = 0; y < size; y++) {
      kernel[y] = [];
      for (let x = 0; x < size; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
        kernel[y][x] = value;
        sum += value;
      }
    }

    // 归一化
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        kernel[y][x] /= sum;
      }
    }

    return kernel;
  }

  // 卷积运算
  convolution(imageData, kernel) {
    const { data, width, height } = imageData;
    const result = new Uint8ClampedArray(data);
    const kernelSize = Math.sqrt(kernel.length);
    const half = Math.floor(kernelSize / 2);

    for (let y = half; y < height - half; y++) {
      for (let x = half; x < width - half; x++) {
        let r = 0, g = 0, b = 0;
        
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const px = x + kx - half;
            const py = y + ky - half;
            const idx = (py * width + px) * 4;
            const weight = kernel[ky * kernelSize + kx];
            
            r += data[idx] * weight;
            g += data[idx + 1] * weight;
            b += data[idx + 2] * weight;
          }
        }
        
        const idx = (y * width + x) * 4;
        result[idx] = Math.min(255, Math.max(0, r));
        result[idx + 1] = Math.min(255, Math.max(0, g));
        result[idx + 2] = Math.min(255, Math.max(0, b));
      }
    }

    return { data: result, width, height };
  }
}

const processor = new ImageProcessor();

self.addEventListener('message', (event) => {
  const { type, taskId, data } = event.data;

  try {
    if (type === 'process-image') {
      const result = processor.processImage(data.imageData, data.operations);
      
      self.postMessage({
        taskId,
        result,
        executionTime: performance.now() - data.timestamp
      });
    }
  } catch (error) {
    self.postMessage({
      taskId,
      error: error.message
    });
  }
});
`;

// 使用示例
const imageApp = new ImageProcessorApp();
await imageApp.initialize();

// 设置文件选择器
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;
fileInput.accept = 'image/*';

fileInput.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files);
  
  // 定义处理操作
  const operations = [
    { type: 'brightness', params: { value: 10 } },
    { type: 'contrast', params: { factor: 1.1 } },
    { type: 'sharpen', params: {} }
  ];

  // 批量处理图像
  const results = await imageApp.batchProcess(files, operations);
  
  // 处理结果
  for (const result of results) {
    if (!result.error) {
      const blob = await imageApp.exportImage(result.imageId, 'png');
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`processed_\${result.imageId}.png\`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
});
```

### 7.2 大数据分析应用

```javascript
/**
 * 大数据分析应用
 * 使用 Web Worker 处理大规模数据集的统计分析
 */
class DataAnalysisApp {
  constructor() {
    this.workers = new Map();
    this.datasets = new Map();
    this.analysisResults = new Map();
  }

  /**
   * 初始化数据分析应用
   */
  async initialize() {
    // 创建专门的分析 Worker
    const analysisWorker = new Worker('./data-analysis-worker.js');
    this.workers.set('analysis', analysisWorker);

    // 创建统计 Worker
    const statsWorker = new Worker('./statistics-worker.js');
    this.workers.set('statistics', statsWorker);

    console.log('✅ 数据分析应用初始化完成');
  }

  /**
   * 加载数据集
   */
  async loadDataset(file, options = {}) {
    const datasetId = \`dataset_\${Date.now()}\`;
    
    try {
      let data;
      
      if (file.type === 'application/json') {
        data = JSON.parse(await file.text());
      } else if (file.type === 'text/csv') {
        data = await this.parseCSV(await file.text());
      } else {
        throw new Error('不支持的文件类型');
      }

      // 数据预处理
      const processedData = await this.preprocessData(data, options);
      
      this.datasets.set(datasetId, {
        original: data,
        processed: processedData,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          recordCount: Array.isArray(data) ? data.length : Object.keys(data).length,
          columns: this.extractColumns(processedData),
          loadedAt: new Date()
        }
      });

      console.log(\`✅ 数据集 \${datasetId} 加载完成\`);
      return { datasetId, metadata: this.datasets.get(datasetId).metadata };

    } catch (error) {
      console.error('❌ 数据集加载失败:', error);
      throw error;
    }
  }

  /**
   * 解析 CSV 数据
   */
  async parseCSV(csvText) {
    const lines = csvText.split('\\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const record = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim() || '';
        
        // 尝试转换为数字
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }
        
        record[header] = value;
      });
      
      data.push(record);
    }

    return data;
  }

  /**
   * 数据预处理
   */
  async preprocessData(data, options) {
    const worker = this.workers.get('analysis');
    
    return new Promise((resolve, reject) => {
      const requestId = \`preprocess_\${Date.now()}\`;
      
      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({
        type: 'preprocess',
        requestId,
        data,
        options
      });
    });
  }

  /**
   * 提取数据列信息
   */
  extractColumns(data) {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    const sample = data[0];
    const columns = [];
    
    Object.keys(sample).forEach(key => {
      const values = data.map(record => record[key]).filter(v => v != null);
      const numericValues = values.filter(v => typeof v === 'number');
      
      columns.push({
        name: key,
        type: numericValues.length / values.length > 0.8 ? 'numeric' : 'categorical',
        uniqueValues: new Set(values).size,
        nullCount: data.length - values.length
      });
    });
    
    return columns;
  }

  /**
   * 执行统计分析
   */
  async runStatisticalAnalysis(datasetId, analysisConfig) {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error('数据集不存在');
    }

    const worker = this.workers.get('statistics');
    
    return new Promise((resolve, reject) => {
      const requestId = \`stats_\${Date.now()}\`;
      
      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            // 存储分析结果
            this.analysisResults.set(requestId, {
              datasetId,
              config: analysisConfig,
              result: event.data.result,
              timestamp: new Date()
            });
            
            resolve(event.data.result);
          }
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({
        type: 'statistical-analysis',
        requestId,
        data: dataset.processed,
        config: analysisConfig
      });
    });
  }

  /**
   * 执行相关性分析
   */
  async runCorrelationAnalysis(datasetId, variables) {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error('数据集不存在');
    }

    const worker = this.workers.get('statistics');
    
    return new Promise((resolve, reject) => {
      const requestId = \`correlation_\${Date.now()}\`;
      
      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({
        type: 'correlation-analysis',
        requestId,
        data: dataset.processed,
        variables
      });
    });
  }

  /**
   * 执行时间序列分析
   */
  async runTimeSeriesAnalysis(datasetId, timeColumn, valueColumns, options = {}) {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error('数据集不存在');
    }

    const worker = this.workers.get('analysis');
    
    return new Promise((resolve, reject) => {
      const requestId = \`timeseries_\${Date.now()}\`;
      
      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({
        type: 'timeseries-analysis',
        requestId,
        data: dataset.processed,
        timeColumn,
        valueColumns,
        options
      });
    });
  }

  /**
   * 生成数据报告
   */
  async generateReport(datasetId, reportType = 'comprehensive') {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error('数据集不存在');
    }

    const worker = this.workers.get('analysis');
    
    return new Promise((resolve, reject) => {
      const requestId = \`report_\${Date.now()}\`;
      
      const messageHandler = (event) => {
        if (event.data.requestId === requestId) {
          worker.removeEventListener('message', messageHandler);
          
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      worker.addEventListener('message', messageHandler);
      worker.postMessage({
        type: 'generate-report',
        requestId,
        data: dataset.processed,
        metadata: dataset.metadata,
        reportType
      });
    });
  }

  /**
   * 获取数据集信息
   */
  getDatasetInfo(datasetId) {
    const dataset = this.datasets.get(datasetId);
    return dataset ? dataset.metadata : null;
  }

  /**
   * 获取所有数据集
   */
  getAllDatasets() {
    const datasets = {};
    this.datasets.forEach((dataset, id) => {
      datasets[id] = dataset.metadata;
    });
    return datasets;
  }

  /**
   * 删除数据集
   */
  deleteDataset(datasetId) {
    if (this.datasets.has(datasetId)) {
      this.datasets.delete(datasetId);
      console.log(\`🗑️ 数据集 \${datasetId} 已删除\`);
      return true;
    }
    return false;
  }

  /**
   * 清理所有资源
   */
  cleanup() {
    this.workers.forEach(worker => worker.terminate());
    this.workers.clear();
    this.datasets.clear();
    this.analysisResults.clear();
    console.log('🧹 数据分析应用资源已清理');
  }
}

// 使用示例
const dataApp = new DataAnalysisApp();
await dataApp.initialize();

// 文件上传处理
const dataFileInput = document.createElement('input');
dataFileInput.type = 'file';
dataFileInput.accept = '.csv,.json';

dataFileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // 加载数据集
    const { datasetId, metadata } = await dataApp.loadDataset(file, {
      cleanNulls: true,
      normalizeText: true
    });

    console.log('数据集元信息:', metadata);

    // 执行基础统计分析
    const statsConfig = {
      descriptive: true,
      distribution: true,
      outliers: true
    };
    
    const statsResult = await dataApp.runStatisticalAnalysis(datasetId, statsConfig);
    console.log('统计分析结果:', statsResult);

    // 如果有数值列，执行相关性分析
    const numericColumns = metadata.columns
      .filter(col => col.type === 'numeric')
      .map(col => col.name);

    if (numericColumns.length > 1) {
      const correlationResult = await dataApp.runCorrelationAnalysis(datasetId, numericColumns);
      console.log('相关性分析结果:', correlationResult);
    }

    // 生成综合报告
    const report = await dataApp.generateReport(datasetId, 'comprehensive');
    console.log('数据报告:', report);

  } catch (error) {
    console.error('数据分析失败:', error);
  }
});
```

---

## 8. 最佳实践与优化

### 8.1 错误处理

- **异步错误处理**：在 Worker 内部使用 `try-catch` 块来捕获和处理错误，并将错误信息发送回主线程。
- **错误分类**：根据错误类型和严重程度进行分类，以便更好地进行调试和报告。
- **错误隔离**：将错误处理逻辑与主线程隔离，避免主线程的阻塞。

### 8.2 性能优化

- **数据传输优化**：使用可转移对象（Transferable Objects）来减少数据传输的开销。
- **计算优化**：在 Worker 内部进行复杂的计算，减少主线程的负担。
- **内存管理**：避免不必要的内存分配和垃圾回收，提高性能。

### 8.3 代码组织

- **模块化**：将不同的功能模块化，便于管理和维护。
- **代码复用**：将常用的功能封装成函数或类，避免重复代码。
- **注释和文档**：为代码添加注释和文档，便于理解和维护。

---

## 9. 常见问题解答

### 9.1 如何处理 Web Worker 的错误？

- **异步错误处理**：在 Worker 内部使用 `try-catch` 块来捕获和处理错误，并将错误信息发送回主线程。
- **错误分类**：根据错误类型和严重程度进行分类，以便更好地进行调试和报告。
- **错误隔离**：将错误处理逻辑与主线程隔离，避免主线程的阻塞。

### 9.2 如何优化 Web Worker 的性能？

- **数据传输优化**：使用可转移对象（Transferable Objects）来减少数据传输的开销。
- **计算优化**：在 Worker 内部进行复杂的计算，减少主线程的负担。
- **内存管理**：避免不必要的内存分配和垃圾回收，提高性能。

### 9.3 如何组织 Web Worker 的代码？

- **模块化**：将不同的功能模块化，便于管理和维护。
- **代码复用**：将常用的功能封装成函数或类，避免重复代码。
- **注释和文档**：为代码添加注释和文档，便于理解和维护。

---
