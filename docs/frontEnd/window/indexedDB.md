# IndexedDB 完整开发指南

IndexedDB 是浏览器内置的客户端数据库解决方案，为 Web 应用提供大容量结构化数据存储能力。本文档将深入讲解 IndexedDB 的核心概念、API 使用和实际应用技巧。

## 目录导航

1. [IndexedDB 概述](#1-indexeddb-概述)
2. [核心概念详解](#2-核心概念详解)  
3. [数据库连接管理](#3-数据库连接管理)
4. [对象存储操作](#4-对象存储操作)
5. [事务处理机制](#5-事务处理机制)
6. [数据操作（CRUD）](#6-数据操作crud)
7. [索引管理系统](#7-索引管理系统)
8. [游标遍历技术](#8-游标遍历技术)
9. [实际应用示例](#9-实际应用示例)
10. [性能优化策略](#10-性能优化策略)
11. [错误处理机制](#11-错误处理机制)
12. [浏览器兼容性](#12-浏览器兼容性)

## 1. IndexedDB 概述

### 1.1 特性介绍

IndexedDB 是一种低级 API，用于在客户端存储大量结构化数据，包括文件和二进制大型对象（blobs）。相比 localStorage 和 sessionStorage，IndexedDB 具有以下优势：

- **大容量存储**：可存储数 GB 级别的数据
- **异步操作**：基于事件驱动的异步 API
- **事务支持**：保证数据操作的原子性
- **索引检索**：支持高效的索引查询
- **结构化数据**：可存储复杂对象和文件
- **同源策略**：遵循 Web 安全策略

### 1.2 技术特点

```javascript
/**
 * IndexedDB 核心特性检测
 */
class IndexedDBSupport {
    /**
     * 检测浏览器是否支持 IndexedDB
     * @returns {boolean} 支持状态
     */
    static isSupported() {
        return 'indexedDB' in window;
    }

    /**
     * 获取 IndexedDB 实现
     * @returns {IDBFactory} IndexedDB 工厂对象
     */
    static getIndexedDB() {
        return window.indexedDB || 
               window.mozIndexedDB || 
               window.webkitIndexedDB || 
               window.msIndexedDB;
    }

    /**
     * 检测可用存储空间
     * @returns {Promise<StorageEstimate>} 存储估算信息
     */
    static async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            return await navigator.storage.estimate();
        }
        return { quota: 0, usage: 0 };
    }
}

// 使用示例
if (IndexedDBSupport.isSupported()) {
    console.log('浏览器支持 IndexedDB');
    
    IndexedDBSupport.getStorageEstimate().then(estimate => {
        console.log(`可用存储空间: ${estimate.quota} bytes`);
        console.log(`已使用存储空间: ${estimate.usage} bytes`);
    });
} else {
    console.log('浏览器不支持 IndexedDB');
}
```

### 1.3 应用场景

- **离线数据缓存**：缓存 API 响应数据，支持离线访问
- **大文件存储**：存储图片、音频、视频等媒体文件
- **用户数据管理**：保存用户配置、历史记录等
- **渐进式 Web 应用**：PWA 数据持久化解决方案
- **数据同步缓存**：本地数据与服务器数据同步

## 2. 核心概念详解

### 2.1 数据库结构

IndexedDB 采用层次化的数据组织结构：

```
数据库 (Database)
├── 对象存储 (Object Store) 1
│   ├── 索引 (Index) 1
│   ├── 索引 (Index) 2
│   └── 数据记录 (Records)
├── 对象存储 (Object Store) 2
│   └── 数据记录 (Records)
└── 版本控制 (Version Control)
```

### 2.2 基本工作流程

IndexedDB 推荐的标准操作流程：

1. **打开数据库连接**：指定数据库名称和版本号
2. **创建对象存储**：定义数据存储结构和键路径
3. **建立索引系统**：为高效查询创建索引
4. **启动事务处理**：在事务中执行数据操作
5. **执行数据操作**：增删改查等数据库操作
6. **处理异步结果**：通过事件监听器处理操作结果

## 3. 数据库连接管理

### 3.1 数据库连接管理器

```javascript
/**
 * IndexedDB 数据库连接管理器
 * 提供完整的数据库连接、版本管理和错误处理功能
 */
class IndexedDBManager {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = new Map(); // 存储对象存储配置
  }

  /**
   * 定义对象存储结构
   * @param {string} storeName - 对象存储名称
   * @param {Object} config - 配置选项
   */
  defineStore(storeName, config = {}) {
    this.stores.set(storeName, {
      keyPath: config.keyPath || 'id',
      autoIncrement: config.autoIncrement || false,
      indexes: config.indexes || []
    });
  }

  /**
   * 打开数据库连接
   * @returns {Promise<IDBDatabase>} 数据库实例
   */
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => {
        reject(new Error(`数据库打开失败: ${event.target.error}`));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.setupEventHandlers();
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.handleUpgrade(event);
      };

      request.onblocked = (event) => {
        console.warn('数据库升级被阻塞，请关闭其他标签页');
      };
    });
  }

  /**
   * 处理数据库升级
   * @param {Event} event - 升级事件
   */
  handleUpgrade(event) {
    const transaction = event.target.transaction;
    
    // 创建对象存储
    for (const [storeName, config] of this.stores) {
      if (!this.db.objectStoreNames.contains(storeName)) {
        const store = this.db.createObjectStore(storeName, {
          keyPath: config.keyPath,
          autoIncrement: config.autoIncrement
        });

        // 创建索引
        config.indexes.forEach(indexConfig => {
          store.createIndex(
            indexConfig.name,
            indexConfig.keyPath,
            {
              unique: indexConfig.unique || false,
              multiEntry: indexConfig.multiEntry || false
            }
          );
        });
      }
    }
  }

  /**
   * 设置数据库事件处理器
   */
  setupEventHandlers() {
    this.db.onversionchange = (event) => {
      console.log('数据库版本变更，准备关闭连接');
      this.db.close();
    };

    this.db.onclose = (event) => {
      console.log('数据库连接已关闭');
      this.db = null;
    };
  }

  /**
   * 删除数据库
   * @returns {Promise<void>}
   */
  static async deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      
      request.onerror = (event) => {
        reject(new Error(`数据库删除失败: ${event.target.error}`));
      };
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onblocked = () => {
        console.warn('数据库删除被阻塞，请关闭所有使用该数据库的标签页');
      };
    });
  }

  /**
   * 关闭数据库连接
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * 获取数据库信息
   * @returns {Object} 数据库信息
   */
  getInfo() {
    if (!this.db) {
      throw new Error('数据库未连接');
    }

    return {
      name: this.db.name,
      version: this.db.version,
      objectStoreNames: Array.from(this.db.objectStoreNames)
    };
  }
}
```


## 4. 对象存储操作

### 4.1 对象存储创建和配置

对象存储（Object Store）是 IndexedDB 中实际存储数据的容器，类似于关系数据库中的表。

```javascript
// 新创建或者版本号改变时，触发onupgradeneeded事件
request.onupgradeneeded = event => {
  // 获取IDBDatabase对象：数据库对象
  const db = event.target.result;
  
  // 创建一个名为customers的对象存储，将对象中不会重复的key:email作为键路径
  const objectStore = db.createObjectStore("customers", { keyPath: "email" });

  // 创建另一个名为"names"的对象存储，并将 autoIncrement 标志设置为真
  const objStore = db.createObjectStore("names", { autoIncrement: true });
};
```

## 5. 事务处理机制

### 5.1 事务基础概念

IndexedDB 中的所有数据操作都必须在事务中进行。事务确保数据操作的原子性、一致性、隔离性和持久性（ACID特性）。

```javascript
/**
 * 创建和管理事务
 * @param {string[]} storeNames - 作用域，一个你想访问的对象存储的数组
 * @param {string} mode - 事务如何操作数据
 *  readonly 默认值，只读
 *  readwrite 读写
 *  versionchange 此类事务中才能修改数据库的"模式"或结构（包括新建或删除对象存储、索引）
 */
const transactionCustomers = db.transaction(["customers"], "readwrite");

// 在所有数据添加完毕后的处理
transactionCustomers.oncomplete = event => {
  console.log("事务完成了！");
};

transactionCustomers.onerror = event => {
  // 不要忘记错误处理！error 事件是冒泡机制，所以事务会接收由它产生的所有请求所产生的错误
  console.error("事务出错:", event.target.error);
};

transactionCustomers.onabort = event => {
  // 事务中没有处理一个已发生的错误事件或者调用了 abort() 方法，那么该事务会被回滚，并触发 abort 事件
  console.warn("事务被中止:", event.target.error);
};
```

## 6. 数据操作（CRUD）

### 6.1 基本的增删改查操作

```javascript
// 通过事务获取对象存储
const customerObjectStore = transactionCustomers.objectStore("customers");

// 添加数据：通过遍历将数据保存到新创建的对象存储中
customerData.forEach(customer => {
  const request = customerObjectStore.add(customer);
  request.onsuccess = event => {
    // event.target.result === customer.email 返回keyPath
    console.log("数据添加成功:", event.target.result);
  };
});

// 删除数据：通过指定的keyPath
const deleteRequest = customerObjectStore.delete("23223423423@qq.com");
deleteRequest.onsuccess = event => {
  const deleteItem = event.target.result;
  console.log("删除成功，删除的item为：", deleteItem);
};

// 查询数据：通过指定的keyPath。还有getAll() 和 getAllKeys()
const getRequest = customerObjectStore.get("23223423423@qq.com");
getRequest.onsuccess = event => {
  // 也等于：getRequest.result
  const getItem = event.target.result;
  console.log("查询的item为：", getItem);
};

// 更新数据：通过指定的keyPath，更新对应keyPath的数据
let putObj = {
  name: "张三",
  age: 200,
  email: "23223423423@qq.com",
  ssn: 23232323,
};
const putRequest = customerObjectStore.put(putObj);
putRequest.onsuccess = event => {
  console.log("数据已经成功更新");
};
putRequest.onerror = event => {
  console.log("数据更新失败");
};
```

## 7. 索引管理系统

### 7.1 索引创建和使用

索引允许您基于对象存储中对象的属性值来查找数据，而不仅仅是键值。

```javascript
/**
 * 创建索引
 * @param {string} indexName - 索引名
 * @param {string|string[]} keyPath - 索引名使用的keyPath
 * @param {Object} options - 配置选项
 *  @param {boolean} unique - 是否允许存在重复的值，默认false
 *  @param {boolean} multiEntry - 如果为true，则当keyPath解析为数组时，索引将在索引中为每个数组元素添加一个条目。如果为false，它将添加一个包含该数组的单条目。默认为false。
 * @returns {IDBIndex} IDBIndex对象
 */
objectStore.createIndex("name", "name", { unique: false });

// 使用邮箱建立索引，我们想确保客户的邮箱不会重复，所以我们使用 unique 索引
objectStore.createIndex("email", "email", { unique: true });

// 使用索引查找数据，返回查找到的第一条数据
const index = objectStore.index("name");

index.get("zhangjinxi").onsuccess = event => {
  console.log("通过索引查找到的数据:", event.target.result);
};
```

## 8. 游标遍历技术

使用 get() 要求你知道你想要检索哪一个键。如果你想要遍历对象存储空间中的所有值，那么你可以使用游标。看起来会像下面这样：

```javascript
const customers = [];

/**
 * openCursor 或者 openKeyCursor 的参数
 * @param {IDBKeyRange} keyRange - key range 对象来限制被检索的项目的范围
 * @param {string} order - 进行迭代的方向，默认升序迭代，prev降序
 * @returns {IDBRequest} 请求的result
 */
objectStore.openCursor().onsuccess = event => {
  // 到达数据的末尾时仍然会得到一个成功回调，但是 result 属性是undefined
  const cursor = event.target.result;
  if (cursor) {
    // openCursor时value为整个对象，openKeyCursor时value为keyPath值
    customers.push(cursor.value);
    console.log(`email ${cursor.key} 对应的对象是`, cursor.value);
    // 想要继续，那么你必须调用游标上的 continue()
    cursor.continue();
  } else {
    console.log('已获取的所有客户：', customers);
  }
};
```

### 8.1 指定游标的范围和方向

```javascript
// 仅匹配“Donna”
const singleKeyRange = IDBKeyRange.only("Donna");

// 匹配所有大于“Bill”的，包括“Bill”
const lowerBoundKeyRange = IDBKeyRange.lowerBound("Bill");

// 匹配所有大于“Bill”的，但不包括“Bill”
const lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Bill", true);

// 匹配所有小于“Donna”的，不包括“Donna”
const upperBoundOpenKeyRange = IDBKeyRange.upperBound("Donna", true);

// 匹配所有在“Bill”和“Donna”之间的，但不包括“Donna”
const boundKeyRange = IDBKeyRange.bound("Bill", "Donna", false, true);

// 使用其中的一个键范围，把它作为 openCursor()/openKeyCursor() 的第一个参数
index.openCursor(boundKeyRange, "prev").onsuccess = event => {
  const cursor = event.target.result;
  if (cursor) {
    // 对匹配结果进行一些操作
    cursor.continue();
  }
};
```

## 9. 实际应用示例

### 9.1 离线数据同步系统

```javascript
/**
 * 离线数据同步管理器
 * 实现本地数据与服务器数据的同步
 */
class OfflineSync {
  constructor(dbManager) {
    this.dbManager = dbManager;
    this.storeManager = new ObjectStoreManager(dbManager.db);
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async saveOffline(storeName, data) {
    // 添加同步标记
    const offlineData = {
      ...data,
      _offline: true,
      _timestamp: Date.now(),
      _action: 'create'
    };
    
    await this.storeManager.add(storeName, offlineData);
    
    if (this.isOnline) {
      await this.syncToServer(storeName, offlineData);
    }
  }

  async syncPendingChanges() {
    try {
      const pendingData = await this.storeManager.getAll('users');
      const offlineItems = pendingData.filter(item => item._offline);
      
      for (const item of offlineItems) {
        await this.syncToServer('users', item);
      }
    } catch (error) {
      console.error('同步失败:', error);
    }
  }

  async syncToServer(storeName, data) {
    try {
      // 模拟 API 调用
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // 移除离线标记
        const cleanData = { ...data };
        delete cleanData._offline;
        delete cleanData._timestamp;
        delete cleanData._action;
        
        await this.storeManager.put(storeName, cleanData);
      }
    } catch (error) {
      console.warn('服务器同步失败，保持离线状态');
    }
  }
}
```

### 9.2 购物车管理系统

```javascript
/**
 * 购物车管理系统
 * 使用 IndexedDB 实现持久化购物车
 */
class ShoppingCart {
  constructor() {
    this.dbManager = null;
    this.storeManager = null;
    this.init();
  }

  async init() {
    this.dbManager = new IndexedDBManager('ShoppingCartDB', 1);
    
    this.dbManager.defineStore('cart_items', {
      keyPath: 'productId',
      indexes: [
        { name: 'category', keyPath: 'category', unique: false },
        { name: 'price', keyPath: 'price', unique: false }
      ]
    });

    await this.dbManager.open();
    this.storeManager = new ObjectStoreManager(this.dbManager.db);
  }

  async addItem(product, quantity = 1) {
    const existingItem = await this.storeManager.get('cart_items', product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.storeManager.put('cart_items', existingItem);
    } else {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: quantity,
        addedAt: Date.now()
      };
      await this.storeManager.add('cart_items', cartItem);
    }
  }

  async removeItem(productId) {
    await this.storeManager.delete('cart_items', productId);
  }

  async updateQuantity(productId, quantity) {
    const item = await this.storeManager.get('cart_items', productId);
    if (item) {
      if (quantity <= 0) {
        await this.removeItem(productId);
      } else {
        item.quantity = quantity;
        await this.storeManager.put('cart_items', item);
      }
    }
  }

  async getCartItems() {
    return await this.storeManager.getAll('cart_items');
  }

  async getCartTotal() {
    const items = await this.getCartItems();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  async clearCart() {
    await this.storeManager.clear('cart_items');
  }
}
```

## 10. 性能优化策略

### 10.1 性能优化指南

```javascript
/**
 * IndexedDB 性能优化工具
 */
class PerformanceOptimizer {
  /**
   * 批量插入优化
   */
  static async bulkInsert(storeManager, storeName, items, batchSize = 1000) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await storeManager.add(storeName, batch);
    }
  }

  /**
   * 连接池管理
   */
  static createConnectionPool(dbName, maxConnections = 5) {
    const pool = {
      connections: [],
      waiting: [],
      maxConnections
    };

    const getConnection = async () => {
      if (pool.connections.length > 0) {
        return pool.connections.pop();
      }

      if (pool.connections.length < pool.maxConnections) {
        const dbManager = new IndexedDBManager(dbName);
        await dbManager.open();
        return dbManager;
      }

      return new Promise(resolve => {
        pool.waiting.push(resolve);
      });
    };

    const releaseConnection = (connection) => {
      if (pool.waiting.length > 0) {
        const resolve = pool.waiting.shift();
        resolve(connection);
      } else {
        pool.connections.push(connection);
      }
    };

    return { getConnection, releaseConnection };
  }

  /**
   * 索引优化建议
   */
  static analyzeIndexUsage(storeName, queries) {
    const analysis = {
      recommendedIndexes: [],
      unusedIndexes: [],
      queryOptimizations: []
    };

    queries.forEach(query => {
      if (query.field && !query.hasIndex) {
        analysis.recommendedIndexes.push({
          field: query.field,
          reason: `频繁查询字段 ${query.field}，建议添加索引`
        });
      }
    });

    return analysis;
  }
}
```

## 11. 错误处理机制

### 11.1 错误处理策略

```javascript
/**
 * IndexedDB 错误处理管理器
 */
class ErrorHandler {
  static handleDatabaseError(error, operation) {
    const errorTypes = {
      'QuotaExceededError': '存储空间不足',
      'VersionError': '数据库版本冲突',
      'ConstraintError': '约束错误，可能是主键冲突',
      'DataError': '数据格式错误',
      'TransactionInactiveError': '事务已失效',
      'ReadOnlyError': '只读事务中执行写操作',
      'NotFoundError': '数据或索引不存在'
    };

    const message = errorTypes[error.name] || error.message;
    
    console.error(`操作 ${operation} 失败: ${message}`, error);
    
    // 根据错误类型执行相应的恢复策略
    switch (error.name) {
      case 'QuotaExceededError':
        return this.handleQuotaExceeded();
      case 'VersionError':
        return this.handleVersionError();
      default:
        throw new Error(`${operation} 操作失败: ${message}`);
    }
  }

  static async handleQuotaExceeded() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      console.warn(`存储使用情况: ${estimate.usage}/${estimate.quota} bytes`);
    }
    
    // 提示用户清理数据或请求更多存储空间
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const persistent = await navigator.storage.persist();
      console.log('持久化存储请求结果:', persistent);
    }
  }

  static handleVersionError() {
    console.warn('数据库版本冲突，建议刷新页面');
    // 可以提示用户刷新页面或自动重新加载
  }
}

/**
 * 带重试机制的操作包装器
 */
class RetryableOperation {
  static async withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.warn(`操作失败，第 ${attempt} 次重试...`, error);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
}
```

## 12. 浏览器兼容性

### 12.1 兼容性检测和降级策略

```javascript
/**
 * 浏览器兼容性管理器
 */
class CompatibilityManager {
  static checkSupport() {
    const support = {
      indexedDB: 'indexedDB' in window,
      promises: 'Promise' in window,
      async: typeof async !== 'undefined'
    };

    return {
      ...support,
      isSupported: Object.values(support).every(Boolean)
    };
  }

  static getPolyfills() {
    const polyfills = [];

    if (!window.indexedDB) {
      polyfills.push('indexeddb-polyfill');
    }

    if (!window.Promise) {
      polyfills.push('es6-promise');
    }

    return polyfills;
  }

  static async loadPolyfills() {
    const support = this.checkSupport();
    
    if (!support.isSupported) {
      const polyfills = this.getPolyfills();
      
      for (const polyfill of polyfills) {
        try {
          await import(polyfill);
          console.log(`已加载 ${polyfill} polyfill`);
        } catch (error) {
          console.warn(`无法加载 ${polyfill} polyfill:`, error);
        }
      }
    }
  }

  static createFallbackStorage() {
    // 使用 localStorage 作为降级方案
    return {
      async setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      
      async getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      },
      
      async removeItem(key) {
        localStorage.removeItem(key);
      },
      
      async clear() {
        localStorage.clear();
      }
    };
  }
}

// 使用示例
async function initializeDB() {
  const compatibility = CompatibilityManager.checkSupport();
  
  if (compatibility.isSupported) {
    console.log('浏览器完全支持 IndexedDB');
    return await demonstrateDBManager();
  } else {
    console.warn('浏览器不支持 IndexedDB，加载 polyfills...');
    await CompatibilityManager.loadPolyfills();
    
    // 如果仍然不支持，使用降级方案
    if (!CompatibilityManager.checkSupport().isSupported) {
      console.warn('使用 localStorage 降级方案');
      return CompatibilityManager.createFallbackStorage();
    }
  }
}
```

## 总结

IndexedDB 是现代 Web 应用中强大的客户端数据库解决方案。通过本文档的学习，您应该能够：

1. **理解核心概念**：掌握数据库、对象存储、事务、索引和游标的基本概念
2. **熟练操作数据**：实现完整的 CRUD 操作和复杂查询
3. **优化性能**：应用最佳实践提升应用性能
4. **处理错误**：建立完善的错误处理和恢复机制
5. **确保兼容性**：处理不同浏览器的兼容性问题

IndexedDB 为构建高质量的 PWA（渐进式 Web 应用）提供了坚实的数据存储基础，是现代前端开发不可或缺的技术栈之一。

### 参考资料

- [MDN Web Docs - IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [W3C IndexedDB 规范](https://www.w3.org/TR/IndexedDB/)
- [Can I Use - IndexedDB](https://caniuse.com/indexeddb)
- [PWA 最佳实践指南](https://web.dev/progressive-web-apps/)
