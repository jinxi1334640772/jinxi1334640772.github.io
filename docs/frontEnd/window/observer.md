# Observer API 详解

Observer API 是现代 Web 开发中的重要工具，提供了多种观察者模式的实现，用于监听 DOM 变化、元素交叉、尺寸变化等事件。这些 API 采用异步、高性能的方式，避免了传统事件监听的性能问题。

## 目录

1. [Resize Observer API](#1-resize-observer-api)
2. [Intersection Observer API](#2-intersection-observer-api)
3. [MutationObserver API](#3-mutationobserver-api)
4. [Reporting API](#4-reporting-api)
5. [Compute Pressure API](#5-compute-pressure-api)
6. [最佳实践](#6-最佳实践)
7. [性能对比](#7-性能对比)
8. [参考资料](#8-参考资料)

## 1. Resize Observer API

Resize Observer API 提供了一种高性能的机制来监视元素的大小更改。每次大小更改时都会向观察者传递通知，比传统的 `window.resize` 事件更精确和高效。

### 1.1 基本用法

```javascript
// 创建 ResizeObserver 实例
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    /**
     * ResizeObserverEntry 对象属性：
     * - borderBoxSize: 边框盒的新大小
     * - contentBoxSize: 内容盒的新大小
     * - contentRect: DOMRectReadOnly 对象，等同于 getBoundingClientRect()
     * - devicePixelContentBoxSize: 以设备像素为单位的内容盒大小
     * - target: 被观察的元素
     */
    console.log('元素尺寸变化:', {
      target: entry.target,
      contentRect: entry.contentRect,
      borderBoxSize: entry.borderBoxSize,
      contentBoxSize: entry.contentBoxSize
    });
    
    // 根据尺寸变化调整样式
    if (entry.contentRect.width < 400) {
      entry.target.classList.add('small');
    } else {
      entry.target.classList.remove('small');
    }
  }
});

// 开始观察元素
const targetElement = document.querySelector('.resizable-element');
resizeObserver.observe(targetElement);

// 停止观察特定元素
// resizeObserver.unobserve(targetElement);

// 断开所有观察
// resizeObserver.disconnect();
```

### 1.2 实际应用示例

```javascript
// 响应式布局调整
class ResponsiveComponent {
  constructor(element) {
    this.element = element;
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.observer.observe(element);
  }
  
  handleResize(entries) {
    const entry = entries[0];
    const { width } = entry.contentRect;
    
    // 根据宽度应用不同的布局
    if (width < 480) {
      this.element.className = 'layout-mobile';
    } else if (width < 768) {
      this.element.className = 'layout-tablet';
    } else {
      this.element.className = 'layout-desktop';
    }
  }
  
  destroy() {
    this.observer.disconnect();
  }
}

// 使用示例
const responsiveCard = new ResponsiveComponent(
  document.querySelector('.responsive-card')
);
```

## 2. Intersection Observer API

Intersection Observer API 提供了一种异步检测目标元素与祖先元素或顶级文档视口相交情况变化的方法。常用于懒加载、无限滚动、曝光统计等场景。

### 2.1 基本配置和用法

```javascript
/**
 * 创建 Intersection Observer
 * @param {Function} callback - 交叉状态变化时的回调函数
 * @param {Object} options - 配置选项
 */
const options = {
  // 用作视口的元素，默认为浏览器视口
  root: document.querySelector('#scroll-container'),
  
  // 根周围的边距，类似 CSS margin
  rootMargin: '10px 20px 30px 40px',
  
  // 触发回调的可见度阈值
  threshold: [0, 0.25, 0.5, 0.75, 1.0]
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    /**
     * IntersectionObserverEntry 对象属性：
     * - boundingClientRect: 目标元素的边界信息
     * - intersectionRatio: 相交区域与目标元素的比例
     * - intersectionRect: 相交区域的矩形信息
     * - isIntersecting: 是否正在相交
     * - rootBounds: 根元素的边界信息
     * - target: 目标元素
     * - time: 相交发生的时间戳
     */
    
    if (entry.isIntersecting) {
      console.log('元素进入视口:', entry.target);
      // 元素进入视口时的处理
      entry.target.classList.add('visible');
    } else {
      console.log('元素离开视口:', entry.target);
      // 元素离开视口时的处理
      entry.target.classList.remove('visible');
    }
    
    console.log('可见比例:', entry.intersectionRatio);
  });
}, options);

// 开始观察目标元素
const targets = document.querySelectorAll('.observe-target');
targets.forEach(target => observer.observe(target));
```

### 2.2 实际应用示例

#### 懒加载图片

```javascript
class LazyImageLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px', // 提前 50px 开始加载
        threshold: 0.01
      }
    );
    
    this.init();
  }
  
  init() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.imageObserver.unobserve(img);
      }
    });
  }
  
  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.add('loaded');
    
    img.addEventListener('load', () => {
      img.classList.add('fade-in');
    });
  }
}

// 初始化懒加载
new LazyImageLoader();
```

#### 无限滚动

```javascript
class InfiniteScroll {
  constructor(container, loadMore) {
    this.container = container;
    this.loadMore = loadMore;
    this.loading = false;
    
    // 创建哨兵元素
    this.sentinel = document.createElement('div');
    this.sentinel.className = 'scroll-sentinel';
    this.container.appendChild(this.sentinel);
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1 }
    );
    
    this.observer.observe(this.sentinel);
  }
  
  async handleIntersection(entries) {
    const entry = entries[0];
    
    if (entry.isIntersecting && !this.loading) {
      this.loading = true;
      
      try {
        await this.loadMore();
      } catch (error) {
        console.error('加载更多内容失败:', error);
      } finally {
        this.loading = false;
      }
    }
  }
  
  destroy() {
    this.observer.disconnect();
    this.sentinel.remove();
  }
}

// 使用示例
const infiniteScroll = new InfiniteScroll(
  document.querySelector('.content-list'),
  async () => {
    // 加载更多数据的逻辑
    const response = await fetch('/api/more-data');
    const data = await response.json();
    // 渲染新数据到页面
    renderData(data);
  }
);
```

## 3. MutationObserver API

MutationObserver 接口提供了监视 DOM 树变化的能力，是旧的 Mutation Events 功能的现代替代品。

### 3.1 基本用法

```javascript
// 创建观察器实例
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    switch (mutation.type) {
      case 'childList':
        console.log('子节点发生变化');
        handleChildListMutation(mutation);
        break;
        
      case 'attributes':
        console.log(`属性 ${mutation.attributeName} 发生变化`);
        handleAttributeMutation(mutation);
        break;
        
      case 'characterData':
        console.log('文本内容发生变化');
        handleTextMutation(mutation);
        break;
    }
  }
});

// 配置观察选项
const config = {
  // 观察子节点的变化（添加或删除）
  childList: true,
  
  // 观察后代节点（包括子节点的子节点）
  subtree: true,
  
  // 观察属性变化
  attributes: true,
  
  // 只观察特定属性（可选）
  attributeFilter: ['class', 'style', 'data-*'],
  
  // 记录属性变化前的值
  attributeOldValue: true,
  
  // 观察文本内容变化
  characterData: true,
  
  // 记录文本变化前的值
  characterDataOldValue: true
};

// 开始观察目标节点
const targetNode = document.getElementById('observed-container');
observer.observe(targetNode, config);

// 处理不同类型的变化
function handleChildListMutation(mutation) {
  // 处理添加的节点
  mutation.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      console.log('添加了元素:', node);
      // 为新添加的元素初始化功能
      initializeElement(node);
    }
  });
  
  // 处理删除的节点
  mutation.removedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      console.log('删除了元素:', node);
      // 清理被删除元素的资源
      cleanupElement(node);
    }
  });
}

function handleAttributeMutation(mutation) {
  const { target, attributeName, oldValue } = mutation;
  const newValue = target.getAttribute(attributeName);
  
  console.log(`属性变化: ${attributeName}`, {
    element: target,
    oldValue,
    newValue
  });
}

// 获取并清空变化记录队列
const mutations = observer.takeRecords();

// 停止观察
// observer.disconnect();
```

### 3.2 实际应用示例

#### 动态表单验证

```javascript
class DynamicFormValidator {
  constructor(form) {
    this.form = form;
    this.observers = new Map();
    
    this.setupMutationObserver();
    this.validateExistingFields();
  }
  
  setupMutationObserver() {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          // 处理新添加的表单字段
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.initializeFormField(node);
            }
          });
          
          // 清理被删除的表单字段
          mutation.removedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.cleanupFormField(node);
            }
          });
        }
      });
    });
    
    this.mutationObserver.observe(this.form, {
      childList: true,
      subtree: true
    });
  }
  
  initializeFormField(element) {
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      this.addValidation(input);
    });
  }
  
  addValidation(input) {
    const validator = (event) => {
      this.validateField(input);
    };
    
    input.addEventListener('blur', validator);
    input.addEventListener('input', validator);
    
    // 保存验证器引用以便后续清理
    this.observers.set(input, validator);
  }
  
  validateField(input) {
    // 验证逻辑
    const isValid = input.checkValidity();
    input.classList.toggle('invalid', !isValid);
    input.classList.toggle('valid', isValid);
  }
  
  cleanupFormField(element) {
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const validator = this.observers.get(input);
      if (validator) {
        input.removeEventListener('blur', validator);
        input.removeEventListener('input', validator);
        this.observers.delete(input);
      }
    });
  }
  
  validateExistingFields() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => this.addValidation(input));
  }
  
  destroy() {
    this.mutationObserver.disconnect();
    this.observers.clear();
  }
}

// 使用示例
const formValidator = new DynamicFormValidator(
  document.querySelector('#dynamic-form')
);
```

## 4. Reporting API

Reporting API 提供了一个一致的报告机制，用于收集各种 Web 平台问题的信息，如内容安全策略违规、权限策略违规、弃用特性使用等。

### 4.1 基本用法

```javascript
// 配置报告观察器
const options = {
  // 要监听的报告类型
  types: ['deprecation', 'intervention', 'csp-violation'],
  
  // 是否包含已缓存的报告
  buffered: true
};

const reportingObserver = new ReportingObserver((reports, observer) => {
  reports.forEach(report => {
    console.log('报告类型:', report.type);
    console.log('报告时间:', new Date(report.timestamp));
    console.log('报告内容:', report.body);
    
    // 根据报告类型进行不同处理
    switch (report.type) {
      case 'deprecation':
        handleDeprecationReport(report);
        break;
        
      case 'intervention':
        handleInterventionReport(report);
        break;
        
      case 'csp-violation':
        handleCSPViolationReport(report);
        break;
        
      default:
        console.warn('未知报告类型:', report.type);
    }
  });
}, options);

// 开始观察
reportingObserver.observe();

// 处理不同类型的报告
function handleDeprecationReport(report) {
  const { id, message, sourceFile, lineNumber } = report.body;
  
  console.warn('使用了弃用的特性:', {
    feature: id,
    message,
    location: `${sourceFile}:${lineNumber}`
  });
  
  // 发送到错误监控服务
  sendToErrorMonitoring('deprecation', report.body);
}

function handleInterventionReport(report) {
  const { id, message } = report.body;
  
  console.warn('浏览器干预:', {
    intervention: id,
    message
  });
  
  // 记录用户代理干预
  logIntervention(report.body);
}

function handleCSPViolationReport(report) {
  const { blockedURL, violatedDirective, originalPolicy } = report.body;
  
  console.error('CSP 违规:', {
    blockedURL,
    violatedDirective,
    policy: originalPolicy
  });
  
  // 发送安全事件报告
  sendSecurityReport('csp-violation', report.body);
}

// 获取并清空报告队列
const bufferedReports = reportingObserver.takeRecords();

// 停止观察
// reportingObserver.disconnect();
```

### 4.2 实际应用示例

```javascript
// 完整的报告监控系统
class WebReportingMonitor {
  constructor(options = {}) {
    this.endpoint = options.endpoint || '/api/reports';
    this.batchSize = options.batchSize || 10;
    this.reportQueue = [];
    
    this.setupReportingObserver();
    this.setupErrorHandlers();
  }
  
  setupReportingObserver() {
    if ('ReportingObserver' in window) {
      this.observer = new ReportingObserver((reports) => {
        this.handleReports(reports);
      }, {
        types: ['deprecation', 'intervention', 'csp-violation'],
        buffered: true
      });
      
      this.observer.observe();
    }
  }
  
  setupErrorHandlers() {
    // 监听全局错误
    window.addEventListener('error', (event) => {
      this.addReport('javascript-error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    // 监听未捕获的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.addReport('unhandled-rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }
  
  handleReports(reports) {
    reports.forEach(report => {
      this.addReport(report.type, {
        ...report.body,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: report.timestamp
      });
    });
  }
  
  addReport(type, data) {
    this.reportQueue.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    if (this.reportQueue.length >= this.batchSize) {
      this.sendReports();
    }
  }
  
  async sendReports() {
    if (this.reportQueue.length === 0) return;
    
    const reports = this.reportQueue.splice(0, this.batchSize);
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reports })
      });
      
      console.log(`已发送 ${reports.length} 个报告`);
    } catch (error) {
      console.error('发送报告失败:', error);
      // 重新加入队列
      this.reportQueue.unshift(...reports);
    }
  }
  
  // 页面卸载时发送剩余报告
  flush() {
    if (this.reportQueue.length > 0) {
      navigator.sendBeacon(
        this.endpoint,
        JSON.stringify({ reports: this.reportQueue })
      );
    }
  }
  
  destroy() {
    this.observer?.disconnect();
    this.flush();
  }
}

// 初始化报告监控
const reportingMonitor = new WebReportingMonitor({
  endpoint: '/api/client-reports',
  batchSize: 5
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  reportingMonitor.flush();
});
```

## 5. Compute Pressure API

Compute Pressure API 允许您观察 CPU 等系统资源的压力状态，帮助应用程序根据系统负载调整性能。

### 5.1 基本用法

```javascript
// 检查 API 支持
if ('PressureObserver' in window) {
  const pressureObserver = new PressureObserver((records) => {
    const latestRecord = records[records.length - 1];
    
    /**
     * PressureRecord 对象属性：
     * - source: 压力源（如 'cpu'）
     * - state: 压力状态（'nominal', 'fair', 'serious', 'critical'）
     * - time: 记录时间戳
     */
    
    console.log('系统压力状态:', {
      source: latestRecord.source,
      state: latestRecord.state,
      time: new Date(latestRecord.time)
    });
    
    handlePressureChange(latestRecord);
  });
  
  // 开始观察 CPU 压力
  pressureObserver.observe('cpu', {
    sampleInterval: 1000 // 每秒采样一次
  }).catch(error => {
    console.error('无法观察系统压力:', error);
  });
  
  function handlePressureChange(record) {
    switch (record.state) {
      case 'nominal':
        // 系统状态正常，可以执行高性能任务
        enableHighQualityFeatures();
        break;
        
      case 'fair':
        // 系统压力轻微升高，适度降低性能
        reduceQuality('fair');
        break;
        
      case 'serious':
        // 系统压力较高，显著降低性能
        reduceQuality('serious');
        break;
        
      case 'critical':
        // 系统压力严重，最小化性能消耗
        enableMinimalMode();
        break;
    }
  }
  
  // 获取支持的压力源
  console.log('支持的压力源:', PressureObserver.knownSources);
  
  // 停止观察
  // pressureObserver.unobserve('cpu');
  // pressureObserver.disconnect();
}
```

### 5.2 实际应用示例

#### 视频会议应用的自适应质量

```javascript
class AdaptiveVideoQuality {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.currentQuality = 'high';
    this.pressureHistory = [];
    
    this.initializePressureObserver();
  }
  
  async initializePressureObserver() {
    if (!('PressureObserver' in window)) {
      console.warn('Compute Pressure API 不支持');
      return;
    }
    
    try {
      this.pressureObserver = new PressureObserver((records) => {
        this.handlePressureRecords(records);
      });
      
      await this.pressureObserver.observe('cpu', {
        sampleInterval: 2000 // 每2秒检查一次
      });
      
      console.log('开始监控系统压力');
    } catch (error) {
      console.error('无法启动压力监控:', error);
    }
  }
  
  handlePressureRecords(records) {
    const latestRecord = records[records.length - 1];
    
    // 保存压力历史
    this.pressureHistory.push({
      state: latestRecord.state,
      time: latestRecord.time
    });
    
    // 只保留最近10次记录
    if (this.pressureHistory.length > 10) {
      this.pressureHistory.shift();
    }
    
    this.adjustVideoQuality(latestRecord.state);
  }
  
  adjustVideoQuality(pressureState) {
    const newQuality = this.determineOptimalQuality(pressureState);
    
    if (newQuality !== this.currentQuality) {
      console.log(`调整视频质量: ${this.currentQuality} → ${newQuality}`);
      this.applyQualitySettings(newQuality);
      this.currentQuality = newQuality;
    }
  }
  
  determineOptimalQuality(pressureState) {
    // 根据压力状态和历史趋势确定最佳质量
    const recentPressure = this.pressureHistory.slice(-3);
    const isIncreasingPressure = this.isIncreasingTrend(recentPressure);
    
    switch (pressureState) {
      case 'nominal':
        return isIncreasingPressure ? 'medium' : 'high';
        
      case 'fair':
        return 'medium';
        
      case 'serious':
        return 'low';
        
      case 'critical':
        return 'minimal';
        
      default:
        return 'medium';
    }
  }
  
  isIncreasingTrend(records) {
    if (records.length < 2) return false;
    
    const states = ['nominal', 'fair', 'serious', 'critical'];
    const latest = states.indexOf(records[records.length - 1].state);
    const previous = states.indexOf(records[records.length - 2].state);
    
    return latest > previous;
  }
  
  applyQualitySettings(quality) {
    const settings = {
      high: { width: 1920, height: 1080, bitrate: 2000, fps: 30 },
      medium: { width: 1280, height: 720, bitrate: 1200, fps: 30 },
      low: { width: 854, height: 480, bitrate: 800, fps: 24 },
      minimal: { width: 640, height: 360, bitrate: 400, fps: 15 }
    };
    
    const config = settings[quality];
    
    // 应用新的视频配置
    this.updateVideoStream(config);
    
    // 通知用户质量变化
    this.notifyQualityChange(quality);
  }
  
  updateVideoStream(config) {
    // 这里实现实际的视频流配置更新
    console.log('应用新的视频配置:', config);
    
    // 示例：更新媒体约束
    if (this.videoStream) {
      const videoTrack = this.videoStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.applyConstraints({
          width: config.width,
          height: config.height,
          frameRate: config.fps
        });
      }
    }
  }
  
  notifyQualityChange(quality) {
    // 向用户显示质量变化通知
    const notification = document.createElement('div');
    notification.className = 'quality-notification';
    notification.textContent = `视频质量已调整为: ${quality}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  destroy() {
    if (this.pressureObserver) {
      this.pressureObserver.disconnect();
    }
  }
}

// 使用示例
const videoElement = document.querySelector('#video-call');
const adaptiveQuality = new AdaptiveVideoQuality(videoElement);
```

## 6. 最佳实践

### 6.1 性能优化建议

```javascript
// 1. 合理使用 disconnect() 避免内存泄漏
class ObserverManager {
  constructor() {
    this.observers = new Set();
  }
  
  addObserver(observer) {
    this.observers.add(observer);
  }
  
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// 2. 使用防抖优化频繁触发的观察器
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedHandler = debounce((entries) => {
  // 处理 resize 事件
}, 100);

const resizeObserver = new ResizeObserver(debouncedHandler);

// 3. 批量处理操作
class BatchProcessor {
  constructor(batchSize = 10) {
    this.batchSize = batchSize;
    this.queue = [];
    this.processing = false;
  }
  
  add(item) {
    this.queue.push(item);
    if (this.queue.length >= this.batchSize) {
      this.process();
    }
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      await this.processBatch(batch);
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        this.process();
      }
    }
  }
  
  async processBatch(items) {
    // 批量处理逻辑
    console.log('批量处理:', items.length, '个项目');
  }
}
```

### 6.2 错误处理和降级

```javascript
// 渐进增强的观察器实现
class ProgressiveObserver {
  constructor(target, options = {}) {
    this.target = target;
    this.options = options;
    this.fallbackTimer = null;
    
    this.initializeObserver();
  }
  
  initializeObserver() {
    // 优先使用 Intersection Observer
    if ('IntersectionObserver' in window) {
      this.useIntersectionObserver();
    } else {
      console.warn('IntersectionObserver 不支持，使用滚动事件降级');
      this.useScrollFallback();
    }
  }
  
  useIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.handleVisibilityChange(entry.isIntersecting);
      });
    }, this.options);
    
    this.observer.observe(this.target);
  }
  
  useScrollFallback() {
    const checkVisibility = () => {
      const rect = this.target.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      this.handleVisibilityChange(isVisible);
    };
    
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // 初始检查
    checkVisibility();
  }
  
  handleVisibilityChange(isVisible) {
    if (isVisible) {
      this.target.classList.add('visible');
    } else {
      this.target.classList.remove('visible');
    }
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    } else {
      // 清理降级事件监听器
      window.removeEventListener('scroll', this.checkVisibility);
      window.removeEventListener('resize', this.checkVisibility);
    }
  }
}
```

### 6.3 组合使用多个观察器

```javascript
// 智能内容组件，结合多个 Observer API
class SmartContentCard {
  constructor(element) {
    this.element = element;
    this.isVisible = false;
    this.currentSize = null;
    
    this.setupObservers();
  }
  
  setupObservers() {
    // Intersection Observer - 监听可见性
    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.isVisible = entry.isIntersecting;
      
      if (this.isVisible) {
        this.loadContent();
        this.startPerformanceMonitoring();
      } else {
        this.pauseAnimations();
      }
    }, { threshold: 0.1 });
    
    // Resize Observer - 监听尺寸变化
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      this.currentSize = entry.contentRect;
      this.adjustLayout();
    });
    
    // Mutation Observer - 监听内容变化
    this.mutationObserver = new MutationObserver((mutations) => {
      if (this.isVisible) {
        this.optimizeRendering();
      }
    });
    
    // 开始观察
    this.intersectionObserver.observe(this.element);
    this.resizeObserver.observe(this.element);
    this.mutationObserver.observe(this.element, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }
  
  loadContent() {
    if (!this.element.dataset.loaded) {
      // 懒加载内容
      this.element.innerHTML = this.generateContent();
      this.element.dataset.loaded = 'true';
    }
  }
  
  adjustLayout() {
    if (!this.currentSize) return;
    
    const { width } = this.currentSize;
    
    // 响应式布局调整
    if (width < 300) {
      this.element.className = 'card compact';
    } else if (width < 600) {
      this.element.className = 'card normal';
    } else {
      this.element.className = 'card expanded';
    }
  }
  
  startPerformanceMonitoring() {
    // 只在可见时监控性能
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // 分析性能数据
        this.analyzePerformance(entries);
      });
      
      this.performanceObserver.observe({ entryTypes: ['paint', 'layout-shift'] });
    }
  }
  
  pauseAnimations() {
    // 元素不可见时暂停动画以节省性能
    this.element.style.animationPlayState = 'paused';
  }
  
  optimizeRendering() {
    // 根据内容变化优化渲染
    if (this.isVisible) {
      requestAnimationFrame(() => {
        this.updateLayout();
      });
    }
  }
  
  destroy() {
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.performanceObserver?.disconnect();
  }
}
```

## 7. 性能对比

### 7.1 传统方法 vs Observer API

```javascript
// ❌ 传统方法 - 性能较差
class TraditionalScrollHandler {
  constructor() {
    this.elements = document.querySelectorAll('.track-element');
    this.throttledHandler = this.throttle(this.handleScroll.bind(this), 16);
    
    window.addEventListener('scroll', this.throttledHandler);
  }
  
  handleScroll() {
    this.elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        element.classList.add('visible');
      }
    });
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// ✅ Observer API - 性能优异
class ModernScrollHandler {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 一次性处理，不需要持续监听
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.track-element').forEach(element => {
      this.observer.observe(element);
    });
  }
}
```

### 7.2 性能测试示例

```javascript
// 性能测试工具
class ObserverPerformanceTest {
  constructor() {
    this.results = {};
  }
  
  async testIntersectionObserver(elementCount = 1000) {
    const startTime = performance.now();
    
    // 创建测试元素
    const container = document.createElement('div');
    const elements = [];
    
    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.style.height = '100px';
      element.style.marginBottom = '10px';
      container.appendChild(element);
      elements.push(element);
    }
    
    document.body.appendChild(container);
    
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
      // 处理逻辑
    });
    
    // 观察所有元素
    elements.forEach(element => observer.observe(element));
    
    const endTime = performance.now();
    this.results.intersectionObserver = endTime - startTime;
    
    // 清理
    observer.disconnect();
    container.remove();
    
    return this.results.intersectionObserver;
  }
  
  async testResizeObserver(elementCount = 1000) {
    const startTime = performance.now();
    
    const observer = new ResizeObserver((entries) => {
      // 处理逻辑
    });
    
    // 创建并观察元素
    const elements = [];
    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '100px';
      document.body.appendChild(element);
      observer.observe(element);
      elements.push(element);
    }
    
    const endTime = performance.now();
    this.results.resizeObserver = endTime - startTime;
    
    // 清理
    observer.disconnect();
    elements.forEach(el => el.remove());
    
    return this.results.resizeObserver;
  }
  
  generateReport() {
    console.table(this.results);
    return this.results;
  }
}

// 运行性能测试
const performanceTest = new ObserverPerformanceTest();
performanceTest.testIntersectionObserver(1000).then(() => {
  return performanceTest.testResizeObserver(1000);
}).then(() => {
  performanceTest.generateReport();
});
```

## 8. 参考资料

- [MDN - Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- [MDN - ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)
- [MDN - MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- [MDN - Reporting API](https://developer.mozilla.org/zh-CN/docs/Web/API/Reporting_API)
- [W3C - Intersection Observer 规范](https://www.w3.org/TR/intersection-observer/)
- [Web.dev - Observer APIs 最佳实践](https://web.dev/observers/)
- [Can I Use - Observer API 兼容性](https://caniuse.com/?search=observer)
- [Chrome DevTools - Performance 分析](https://developer.chrome.com/docs/devtools/performance/)
