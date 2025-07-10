# Web Components 开发完整指南

Web Component 是一套不同的技术，允许你创建可重用的定制元素（它们的功能封装在你的代码之外）并且在你的 web 应用中使用它们。

## 1. 简介

Web Components 由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

- `Custom element（自定义元素）`：一组 JavaScript API，允许你定义 custom elements 及其行为，然后可以在你的用户界面中按照需要使用它们。
- `Shadow DOM（影子 DOM）`：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，你可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- `HTML template（HTML 模板）`： `<template>` 和 `<slot> `元素使你可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

---

## 2. Custom Elements API

### 2.1 CustomElementRegistry 详解

`customElements` 是 Window 对象上的只读属性，返回 `CustomElementRegistry` 对象的引用，提供了自定义元素的注册和管理功能。

#### 2.1.1 API 方法详解

| 方法 | 语法 | 描述 | 返回值 |
|------|------|------|--------|
| `define()` | `define(name, constructor, options?)` | 定义新的自定义元素 | `undefined` |
| `get()` | `get(name)` | 获取元素构造函数 | `Constructor \| undefined` |
| `getName()` | `getName(constructor)` | 获取元素名称 | `string \| undefined` |
| `upgrade()` | `upgrade(root)` | 升级节点树中的元素 | `undefined` |
| `whenDefined()` | `whenDefined(name)` | 元素定义完成时的 Promise | `Promise<Constructor>` |

#### 2.1.2 元素注册示例

```javascript
/**
 * 自定义元素注册管理器
 * 提供统一的元素注册和管理功能
 */
class ComponentRegistry {
  constructor() {
    this.registeredComponents = new Map();
    this.pendingComponents = new Map();
  }
  
  /**
   * 注册自定义元素
   * @param {string} name - 元素名称（必须包含连字符）
   * @param {Function} constructor - 元素构造函数
   * @param {Object} options - 注册选项
   */
  register(name, constructor, options = {}) {
    try {
      // 验证元素名称
      if (!this.isValidElementName(name)) {
        throw new Error(`Invalid element name: ${name}`);
      }
      
      // 检查是否已注册
      if (customElements.get(name)) {
        console.warn(`Element ${name} is already registered`);
        return;
      }
      
      // 注册元素
      customElements.define(name, constructor, options);
      
      // 记录注册信息
      this.registeredComponents.set(name, {
        constructor,
        options,
        registeredAt: new Date()
      });
      
      console.log(`✅ Custom element ${name} registered successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to register element ${name}:`, error);
      throw error;
    }
  }
  
  /**
   * 异步等待元素定义完成
   * @param {string} name - 元素名称
   * @returns {Promise<Function>} 元素构造函数
   */
  async waitForDefinition(name) {
    try {
      const constructor = await customElements.whenDefined(name);
      console.log(`✅ Element ${name} is now defined`);
      return constructor;
    } catch (error) {
      console.error(`❌ Failed to wait for ${name} definition:`, error);
      throw error;
    }
  }
  
  /**
   * 验证元素名称格式
   * @param {string} name - 元素名称
   * @returns {boolean} 是否有效
   */
  isValidElementName(name) {
    // 必须包含连字符且符合 HTML 规范
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(name);
  }
  
  /**
   * 获取已注册的组件列表
   * @returns {Array} 组件列表
   */
  getRegisteredComponents() {
    return Array.from(this.registeredComponents.entries()).map(([name, info]) => ({
      name,
      ...info
    }));
  }
  
  /**
   * 升级指定节点树中的自定义元素
   * @param {Node} root - 根节点
   */
  upgradeTree(root = document) {
    customElements.upgrade(root);
    console.log('🔄 Element tree upgraded');
  }
}

// 创建全局注册管理器实例
const componentRegistry = new ComponentRegistry();
```

### 2.2 自定义元素开发流程

#### 2.2.1 标准开发流程

```javascript
/**
 * Web Components 标准开发流程
 * 1. 定义元素类
 * 2. 实现生命周期
 * 3. 创建 Shadow DOM
 * 4. 定义模板和样式
 * 5. 注册自定义元素
 * 6. 使用元素
 */

// 步骤 1: 定义元素类
class ProgressBar extends HTMLElement {
  // 步骤 1.1: 定义观察的属性
  static get observedAttributes() {
    return ['value', 'max', 'min', 'label', 'variant'];
  }
  
  constructor() {
    super();
    
    // 步骤 2: 初始化属性
    this.initializeProperties();
    
    // 步骤 3: 创建 Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // 步骤 4: 渲染组件
    this.render();
    
    // 步骤 5: 绑定事件
    this.bindEvents();
  }
  
  // 步骤 2.1: 初始化组件属性
  initializeProperties() {
    this._value = 0;
    this._max = 100;
    this._min = 0;
    this._label = '';
    this._variant = 'primary';
  }
  
  // 步骤 4.1: 渲染组件模板
  render() {
    this.shadowRoot.innerHTML = `
  <style>
        :host {
          display: block;
          width: 100%;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .progress-container {
          position: relative;
          width: 100%;
          height: 20px;
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 10px;
        }
        
        .progress-bar.primary {
          background: linear-gradient(90deg, #4caf50, #45a049);
        }
        
        .progress-bar.secondary {
          background: linear-gradient(90deg, #2196f3, #1976d2);
        }
        
        .progress-bar.warning {
          background: linear-gradient(90deg, #ff9800, #f57c00);
        }
        
        .progress-bar.danger {
          background: linear-gradient(90deg, #f44336, #d32f2f);
        }
        
        .progress-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
      color: white;
          font-size: 12px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        .progress-text {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
          color: #333;
    }
  </style>
      
      <div class="progress-wrapper">
        <span class="progress-text"></span>
        <div class="progress-container">
          <div class="progress-bar"></div>
          <div class="progress-label"></div>
        </div>
      </div>
    `;
    
    this.updateProgress();
  }
  
  // 步骤 5.1: 绑定组件事件
  bindEvents() {
    // 可以添加自定义事件监听
    this.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick(event) {
    // 派发自定义事件
    this.dispatchEvent(new CustomEvent('progress-click', {
      detail: {
        value: this.value,
        percentage: this.percentage
      },
      bubbles: true
    }));
  }
  
  // 步骤 6: 实现生命周期回调
  connectedCallback() {
    console.log('Progress bar connected to DOM');
    this.updateProgress();
  }
  
  disconnectedCallback() {
    console.log('Progress bar disconnected from DOM');
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
      this.updateProgress();
    }
  }
  
  // 步骤 7: 实现属性访问器
  get value() { return this._value; }
  set value(val) {
    this._value = Math.max(this.min, Math.min(this.max, Number(val) || 0));
    this.setAttribute('value', this._value);
  }
  
  get max() { return this._max; }
  set max(val) {
    this._max = Number(val) || 100;
    this.setAttribute('max', this._max);
  }
  
  get min() { return this._min; }
  set min(val) {
    this._min = Number(val) || 0;
    this.setAttribute('min', this._min);
  }
  
  get label() { return this._label; }
  set label(val) {
    this._label = val || '';
    this.setAttribute('label', this._label);
  }
  
  get variant() { return this._variant; }
  set variant(val) {
    this._variant = val || 'primary';
    this.setAttribute('variant', this._variant);
  }
  
  get percentage() {
    return Math.round((this.value / this.max) * 100);
  }
  
  // 步骤 8: 更新组件状态
  updateProgress() {
    if (!this.shadowRoot) return;
    
    const progressBar = this.shadowRoot.querySelector('.progress-bar');
    const progressLabel = this.shadowRoot.querySelector('.progress-label');
    const progressText = this.shadowRoot.querySelector('.progress-text');
    
    if (progressBar) {
      progressBar.style.width = `${this.percentage}%`;
      progressBar.className = `progress-bar ${this.variant}`;
    }
    
    if (progressLabel) {
      progressLabel.textContent = `${this.percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = this.label || `Progress: ${this.value}/${this.max}`;
    }
  }
  
  // 步骤 9: 公共方法
  reset() {
    this.value = this.min;
  }
  
  increment(step = 1) {
    this.value += step;
  }
  
  complete() {
    this.value = this.max;
  }
}

// 步骤 10: 注册自定义元素
componentRegistry.register('progress-bar', ProgressBar);
```

### 2.3 内置元素扩展

```javascript
/**
 * 扩展内置 HTML 元素
 * 通过继承内置元素类来增强现有功能
 */

// 扩展按钮元素
class EnhancedButton extends HTMLButtonElement {
  constructor() {
    super();
    this.initializeEnhancedFeatures();
  }
  
  initializeEnhancedFeatures() {
    // 添加加载状态
    this.isLoading = false;
    
    // 添加防抖功能
    this.debounceTime = 300;
    this.lastClickTime = 0;
    
    // 绑定增强事件
    this.addEventListener('click', this.handleEnhancedClick.bind(this));
  }
  
  handleEnhancedClick(event) {
    const now = Date.now();
    
    // 防抖处理
    if (now - this.lastClickTime < this.debounceTime) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    this.lastClickTime = now;
    
    // 如果正在加载，阻止点击
    if (this.isLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
  
  showLoading() {
    this.isLoading = true;
    this.disabled = true;
    this.originalContent = this.innerHTML;
    this.innerHTML = `
      <span style="display: inline-flex; align-items: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" style="margin-right: 8px; animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
        </svg>
        加载中...
      </span>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }
  
  hideLoading() {
    this.isLoading = false;
    this.disabled = false;
    if (this.originalContent) {
      this.innerHTML = this.originalContent;
    }
  }
}

// 注册内置元素扩展
componentRegistry.register('enhanced-button', EnhancedButton, { 
  extends: 'button' 
});
```

---

## 3. Shadow DOM 实践

### 3.1 Shadow DOM 基础概念

Shadow DOM 提供了一种将隐藏的 DOM 树附加到常规 DOM 树中元素的方法，实现了完美的封装和样式隔离。

#### 3.1.1 Shadow DOM 术语

```javascript
/**
 * Shadow DOM 核心概念
 * - Shadow Host: 影子宿主，普通 DOM 节点，作为 Shadow DOM 的容器
 * - Shadow Tree: 影子树，被附加到 Shadow Host 的 DOM 子树
 * - Shadow Root: 影子根，Shadow Tree 的根节点
 * - Shadow Boundary: 影子边界，Shadow DOM 和常规 DOM 的分界
 */

class ShadowDOMExample extends HTMLElement {
  constructor() {
    super();
    
    // 创建 Shadow Root
    this.shadowRoot = this.attachShadow({ 
      mode: 'open',           // 'open' 或 'closed'
      delegatesFocus: false   // 是否委托焦点管理
    });
    
    this.initializeShadowDOM();
  }
  
  initializeShadowDOM() {
    // Shadow DOM 内容完全隔离
    this.shadowRoot.innerHTML = `
      <style>
        /* 样式只在 Shadow DOM 内生效 */
        :host {
          display: block;
          padding: 16px;
          border: 2px solid #007acc;
          border-radius: 8px;
          background: #f8f9fa;
        }
        
        .title {
          color: #007acc;
          font-weight: bold;
          margin-bottom: 8px;
        }
      </style>
      
      <div class="title">Shadow DOM 内容</div>
      <slot name="content">默认内容</slot>
    `;
  }
}

customElements.define('shadow-example', ShadowDOMExample);
```

### 3.2 Shadow DOM 模式

#### 3.2.1 开放模式 vs 封闭模式

```javascript
/**
 * Shadow DOM 模式对比
 */

// 开放模式 (Open Mode)
class OpenShadowComponent extends HTMLElement {
  constructor() {
    super();
    
    // 开放模式：外部可以通过 element.shadowRoot 访问
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .open-content { color: green; }
      </style>
      <div class="open-content">开放模式内容</div>
    `;
  }
}

// 封闭模式 (Closed Mode)
class ClosedShadowComponent extends HTMLElement {
  constructor() {
    super();
    
    // 封闭模式：外部无法访问 Shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = `
      <style>
        .closed-content { color: red; }
      </style>
      <div class="closed-content">封闭模式内容</div>
    `;
    
    // 内部保存引用以便使用
    this._shadowRoot = shadowRoot;
  }
  
  // 提供受控的访问方法
  updateContent(newContent) {
    const contentEl = this._shadowRoot.querySelector('.closed-content');
    if (contentEl) {
      contentEl.textContent = newContent;
    }
  }
}

componentRegistry.register('open-shadow', OpenShadowComponent);
componentRegistry.register('closed-shadow', ClosedShadowComponent);
```

#### 3.2.2 实际使用示例

```html
<!-- 使用示例 -->
<!DOCTYPE html>
<html>
<head>
  <style>
    /* 外部样式不会影响 Shadow DOM 内容 */
    .title { color: red; }
  </style>
</head>
<body>
  <!-- 开放模式组件 -->
  <open-shadow></open-shadow>
  
  <!-- 封闭模式组件 -->
  <closed-shadow></closed-shadow>
  
  <script>
    // 开放模式：可以访问 Shadow DOM
    const openComponent = document.querySelector('open-shadow');
    console.log(openComponent.shadowRoot); // 返回 ShadowRoot
    
    // 封闭模式：无法访问 Shadow DOM
    const closedComponent = document.querySelector('closed-shadow');
    console.log(closedComponent.shadowRoot); // 返回 null
    
    // 通过公共方法更新封闭组件
    closedComponent.updateContent('新的封闭内容');
  </script>
</body>
</html>
```

### 3.3 高级 Shadow DOM 技术

#### 3.3.1 样式穿透和继承

```javascript
/**
 * Shadow DOM 样式控制系统
 * 管理样式隔离、继承和主题化
 */
class StyledComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initializeStyles();
  }
  
  initializeStyles() {
    this.shadowRoot.innerHTML = `
      <style>
        /* :host 选择器 - 选择宿主元素 */
        :host {
          display: block;
          padding: 16px;
          font-family: inherit; /* 继承外部字体 */
          
          /* CSS 自定义属性可以穿透 Shadow DOM */
          color: var(--text-color, #333);
          background: var(--background-color, #fff);
          border: var(--border-width, 1px) solid var(--border-color, #ddd);
          border-radius: var(--border-radius, 4px);
        }
        
        /* :host() 函数 - 条件选择宿主元素 */
        :host(.primary) {
          --text-color: white;
          --background-color: #007acc;
          --border-color: #0056b3;
        }
        
        :host(.danger) {
          --text-color: white;
          --background-color: #dc3545;
          --border-color: #bd2130;
        }
        
        /* :host-context() - 根据外部环境选择 */
        :host-context(.dark-theme) {
          --text-color: #e0e0e0;
          --background-color: #2d2d2d;
          --border-color: #444;
        }
        
        /* ::slotted() - 选择插槽内容 */
        ::slotted(h1) {
          color: var(--heading-color, #007acc);
          margin-top: 0;
        }
        
        ::slotted(.highlight) {
          background: yellow;
          padding: 2px 4px;
          border-radius: 2px;
        }
        
        /* 内部样式完全隔离 */
        .internal-class {
          font-weight: bold;
          text-decoration: underline;
        }
        
        /* 支持媒体查询 */
        @media (max-width: 768px) {
          :host {
            padding: 8px;
            font-size: 14px;
          }
        }
        
        /* 支持动画 */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        :host(.animate) {
          animation: fadeIn 0.3s ease-out;
        }
      </style>
      
      <div class="internal-class">样式化组件</div>
      <slot></slot>
    `;
  }
  
  // 动态样式更新
  updateTheme(theme) {
    this.classList.remove('primary', 'danger');
    if (theme) {
      this.classList.add(theme);
    }
  }
  
  // 添加动画效果
  animate() {
    this.classList.add('animate');
    setTimeout(() => {
      this.classList.remove('animate');
    }, 300);
  }
}

componentRegistry.register('styled-component', StyledComponent);
```

#### 3.3.2 事件处理和委托

```javascript
/**
 * Shadow DOM 事件管理系统
 * 处理事件冒泡、委托和自定义事件
 */
class InteractiveComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.eventHandlers = new Map();
    this.render();
    this.bindEvents();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .button-group {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        button {
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        button:hover {
          background: #e9ecef;
          border-color: #999;
        }
        
        button:active {
          transform: translateY(1px);
        }
        
        .output {
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-family: monospace;
        }
      </style>
      
      <div class="button-group">
        <button data-action="click">点击事件</button>
        <button data-action="custom">自定义事件</button>
        <button data-action="bubble">冒泡事件</button>
      </div>
      
      <div class="output" id="output">事件输出区域</div>
      
      <slot name="external-controls"></slot>
    `;
  }
  
  bindEvents() {
    // 事件委托：在根元素上监听所有按钮点击
    this.shadowRoot.addEventListener('click', this.handleButtonClick.bind(this));
    
    // 监听外部插槽内容的事件
    this.addEventListener('slotchange', this.handleSlotChange.bind(this));
    
    // 监听自定义事件
    this.addEventListener('component-action', this.handleCustomAction.bind(this));
  }
  
  handleButtonClick(event) {
    if (event.target.tagName === 'BUTTON') {
      const action = event.target.dataset.action;
      this.executeAction(action, event);
    }
  }
  
  executeAction(action, originalEvent) {
    const output = this.shadowRoot.getElementById('output');
    const timestamp = new Date().toLocaleTimeString();
    
    switch (action) {
      case 'click':
        output.textContent = `${timestamp}: 普通点击事件触发`;
        break;
        
      case 'custom':
        // 派发自定义事件
        const customEvent = new CustomEvent('component-action', {
          detail: {
            action: 'custom-triggered',
            timestamp,
            source: 'internal-button'
          },
          bubbles: true,     // 允许冒泡
          composed: true     // 穿透 Shadow DOM 边界
        });
        
        this.dispatchEvent(customEvent);
        break;
        
      case 'bubble':
        // 创建冒泡事件测试
        const bubbleEvent = new CustomEvent('bubble-test', {
          detail: { message: '冒泡事件测试' },
          bubbles: true,
          composed: true
        });
        
        output.textContent = `${timestamp}: 冒泡事件已派发`;
        this.dispatchEvent(bubbleEvent);
        break;
    }
  }
  
  handleCustomAction(event) {
    const output = this.shadowRoot.getElementById('output');
    const detail = event.detail;
    output.textContent = `${detail.timestamp}: 自定义事件 - ${detail.action}`;
  }
  
  handleSlotChange(event) {
    console.log('插槽内容发生变化:', event);
    
    // 为新插入的外部控件绑定事件
    const slottedElements = event.target.assignedElements();
    slottedElements.forEach(element => {
      if (element.tagName === 'BUTTON') {
        this.bindExternalButton(element);
      }
    });
  }
  
  bindExternalButton(button) {
    // 避免重复绑定
    if (this.eventHandlers.has(button)) return;
    
    const handler = (event) => {
      const output = this.shadowRoot.getElementById('output');
      output.textContent = `${new Date().toLocaleTimeString()}: 外部按钮点击 - ${button.textContent}`;
    };
    
    button.addEventListener('click', handler);
    this.eventHandlers.set(button, handler);
  }
  
  // 清理事件监听器
  disconnectedCallback() {
    this.eventHandlers.forEach((handler, element) => {
      element.removeEventListener('click', handler);
    });
    this.eventHandlers.clear();
  }
  
  // 公共方法：外部触发事件
  triggerAction(action, data = {}) {
    this.executeAction(action, { 
      target: { dataset: { action } },
      external: true,
      data
    });
  }
}

componentRegistry.register('interactive-component', InteractiveComponent);
```

---

## 4. 生命周期管理

### 4.1 生命周期概述

Web Components 提供了完整的生命周期钩子，让开发者能够在组件的不同阶段执行相应的逻辑。

#### 4.1.1 生命周期钩子详解

| 生命周期 | 触发时机 | 用途 | 参数 |
|----------|----------|------|------|
| `constructor` | 元素被创建 | 初始化组件状态 | 无 |
| `connectedCallback` | 元素被插入到 DOM | 启动组件功能 | 无 |
| `disconnectedCallback` | 元素从 DOM 中移除 | 清理资源 | 无 |
| `adoptedCallback` | 元素被移动到新文档 | 重新初始化 | 无 |
| `attributeChangedCallback` | 观察的属性发生变化 | 响应属性变化 | `(name, oldValue, newValue)` |

### 4.2 完整生命周期示例

```javascript
/**
 * 完整生命周期演示组件
 * 展示所有生命周期钩子的使用方法
 */
class LifecycleComponent extends HTMLElement {
  // 定义要观察的属性
  static get observedAttributes() {
    return ['status', 'data-value', 'theme', 'disabled'];
  }
  
  constructor() {
    super();
    
    console.log('🏗️ Constructor: 组件正在构造');
    
    // 初始化组件状态
    this.state = {
      initialized: false,
      connected: false,
      updateCount: 0
    };
    
    // 初始化事件监听器映射
    this.eventListeners = new Map();
    
    // 创建 Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // 渲染初始内容
    this.render();
    
    console.log('✅ Constructor: 组件构造完成');
  }
  
  /**
   * 组件被插入到 DOM 时调用
   * 适合执行：启动定时器、发起网络请求、绑定事件等
   */
  connectedCallback() {
    console.log('🔗 ConnectedCallback: 组件已连接到 DOM');
    
    this.state.connected = true;
    this.state.initialized = true;
    
    // 启动组件功能
    this.startLifecycle();
    
    // 更新显示
    this.updateDisplay();
    
    // 派发连接事件
    this.dispatchEvent(new CustomEvent('component-connected', {
      detail: { state: this.state },
      bubbles: true
    }));
  }
  
  /**
   * 组件从 DOM 中移除时调用
   * 适合执行：清理定时器、移除事件监听器、释放资源等
   */
  disconnectedCallback() {
    console.log('🔌 DisconnectedCallback: 组件已从 DOM 中移除');
    
    this.state.connected = false;
    
    // 清理资源
    this.cleanup();
    
    // 派发断开连接事件
    this.dispatchEvent(new CustomEvent('component-disconnected', {
      detail: { state: this.state },
      bubbles: true
    }));
  }
  
  /**
   * 组件被移动到新文档时调用
   * 适合执行：重新初始化依赖于 document 的功能
   */
  adoptedCallback() {
    console.log('📦 AdoptedCallback: 组件被移动到新文档');
    
    // 重新初始化与文档相关的功能
    this.reinitializeDocumentFeatures();
    
    // 更新显示
    this.updateDisplay();
  }
  
  /**
   * 观察的属性发生变化时调用
   * @param {string} name - 属性名
   * @param {string} oldValue - 旧值
   * @param {string} newValue - 新值
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`🔄 AttributeChangedCallback: ${name} 从 "${oldValue}" 变更为 "${newValue}"`);
    
    // 避免初始化时的无意义更新
    if (oldValue === newValue) return;
    
    this.state.updateCount++;
    
    // 根据属性名处理不同的变化
    switch (name) {
      case 'status':
        this.handleStatusChange(newValue, oldValue);
        break;
      case 'data-value':
        this.handleValueChange(newValue, oldValue);
        break;
      case 'theme':
        this.handleThemeChange(newValue, oldValue);
        break;
      case 'disabled':
        this.handleDisabledChange(newValue !== null, oldValue !== null);
        break;
    }
    
    // 更新显示
    this.updateDisplay();
    
    // 派发属性变化事件
    this.dispatchEvent(new CustomEvent('attribute-changed', {
      detail: { name, oldValue, newValue, updateCount: this.state.updateCount },
      bubbles: true
    }));
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-family: system-ui, sans-serif;
          transition: all 0.3s ease;
        }
        
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
        }
        
        :host([theme="dark"]) {
          background: #2d2d2d;
          color: #fff;
          border-color: #555;
        }
        
        .status {
          font-weight: bold;
          margin-bottom: 8px;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .status.active { background: #d4edda; color: #155724; }
        .status.inactive { background: #f8d7da; color: #721c24; }
        .status.pending { background: #fff3cd; color: #856404; }
        
        .info {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        
        :host([theme="dark"]) .info {
          color: #ccc;
        }
        
        .lifecycle-log {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 8px;
          font-family: monospace;
          font-size: 12px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        :host([theme="dark"]) .lifecycle-log {
          background: #1a1a1a;
          border-color: #444;
          color: #fff;
        }
      </style>
      
      <div class="status" id="status">初始化中...</div>
      <div class="info" id="info">组件生命周期演示</div>
      <div class="lifecycle-log" id="log">等待生命周期事件...</div>
    `;
  }
  
  startLifecycle() {
    // 启动定时器示例
    this.timer = setInterval(() => {
      this.logMessage(`⏰ 定时器触发 - ${new Date().toLocaleTimeString()}`);
    }, 5000);
    
    // 绑定事件监听器
    this.bindEventListeners();
    
    this.logMessage('🚀 组件功能已启动');
  }
  
  cleanup() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.logMessage('⏰ 定时器已清理');
    }
    
    // 移除事件监听器
    this.removeEventListeners();
    
    this.logMessage('🧹 资源清理完成');
  }
  
  bindEventListeners() {
    const clickHandler = () => this.logMessage('👆 组件被点击');
    
    this.addEventListener('click', clickHandler);
    this.eventListeners.set('click', clickHandler);
  }
  
  removeEventListeners() {
    this.eventListeners.forEach((handler, event) => {
      this.removeEventListener(event, handler);
    });
    this.eventListeners.clear();
  }
  
  reinitializeDocumentFeatures() {
    this.logMessage('📄 重新初始化文档相关功能');
    // 重新获取 document 相关的引用和配置
  }
  
  handleStatusChange(newValue, oldValue) {
    this.logMessage(`📊 状态变化: ${oldValue} → ${newValue}`);
  }
  
  handleValueChange(newValue, oldValue) {
    this.logMessage(`💾 数据变化: ${oldValue} → ${newValue}`);
  }
  
  handleThemeChange(newValue, oldValue) {
    this.logMessage(`🎨 主题变化: ${oldValue} → ${newValue}`);
  }
  
  handleDisabledChange(isDisabled, wasDisabled) {
    this.logMessage(`🔒 禁用状态: ${wasDisabled} → ${isDisabled}`);
  }
  
  updateDisplay() {
    if (!this.shadowRoot) return;
    
    const statusEl = this.shadowRoot.getElementById('status');
    const infoEl = this.shadowRoot.getElementById('info');
    
    if (statusEl) {
      const status = this.getAttribute('status') || 'inactive';
      statusEl.textContent = `状态: ${status}`;
      statusEl.className = `status ${status}`;
    }
    
    if (infoEl) {
      infoEl.innerHTML = `
        已连接: ${this.state.connected ? '✅' : '❌'} | 
        更新次数: ${this.state.updateCount} | 
        当前值: ${this.getAttribute('data-value') || '无'}
      `;
    }
  }
  
  logMessage(message) {
    if (!this.shadowRoot) return;
    
    const logEl = this.shadowRoot.getElementById('log');
    if (logEl) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${message}`;
      
      logEl.innerHTML += logEntry + '<br>';
      logEl.scrollTop = logEl.scrollHeight;
    }
    
    console.log(`LifecycleComponent: ${message}`);
  }
  
  // 公共方法
  getState() {
    return { ...this.state };
  }
  
  clearLog() {
    const logEl = this.shadowRoot?.getElementById('log');
    if (logEl) {
      logEl.innerHTML = '';
    }
  }
}

componentRegistry.register('lifecycle-component', LifecycleComponent);
```

### 4.3 生命周期最佳实践

#### 4.3.1 性能优化策略

```javascript
/**
 * 性能优化的生命周期组件
 * 实现懒加载、防抖更新等优化策略
 */
class OptimizedComponent extends HTMLElement {
  static get observedAttributes() {
    return ['data', 'config', 'lazy-load'];
  }
  
  constructor() {
    super();
    
    // 防抖更新
    this.updateDebounced = this.debounce(this.performUpdate.bind(this), 100);
    
    // 缓存已解析的数据
    this.dataCache = new Map();
    
    // 懒加载状态
    this.isLazyLoaded = false;
    
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    // 检查是否需要懒加载
    if (this.hasAttribute('lazy-load')) {
      this.setupLazyLoading();
    } else {
      this.initialize();
    }
  }
  
  disconnectedCallback() {
    // 清理观察器
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // 清理防抖定时器
    if (this.updateDebounced.clear) {
      this.updateDebounced.clear();
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // 使用防抖更新避免频繁渲染
      this.updateDebounced();
    }
  }
  
  setupLazyLoading() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isLazyLoaded) {
            this.initialize();
            this.isLazyLoaded = true;
            this.intersectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    this.intersectionObserver.observe(this);
    
    // 显示加载占位符
    this.showPlaceholder();
  }
  
  initialize() {
    this.render();
    this.bindEvents();
    this.loadData();
  }
  
  performUpdate() {
    if (!this.shadowRoot) return;
    
    // 智能更新：只更新变化的部分
    this.updateChangedElements();
  }
  
  updateChangedElements() {
    const data = this.getAttribute('data');
    const config = this.getAttribute('config');
    
    // 检查数据是否变化
    if (this.lastData !== data) {
      this.updateDataDisplay(data);
      this.lastData = data;
    }
    
    // 检查配置是否变化
    if (this.lastConfig !== config) {
      this.updateConfiguration(config);
      this.lastConfig = config;
    }
  }
  
  debounce(func, wait) {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
    
    debounced.clear = () => clearTimeout(timeout);
    return debounced;
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100px;
        }
        
        .placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          color: #6c757d;
        }
        
        .content {
          padding: 16px;
        }
      </style>
      
      <div class="content" id="content">
        <div id="data-display">等待数据...</div>
        <div id="config-display">等待配置...</div>
      </div>
    `;
  }
  
  showPlaceholder() {
    this.shadowRoot.innerHTML = `
      <div class="placeholder">
        📦 组件将在进入视口时加载...
      </div>
    `;
  }
  
  updateDataDisplay(data) {
    const display = this.shadowRoot?.getElementById('data-display');
    if (display && data) {
      display.textContent = `数据: ${data}`;
    }
  }
  
  updateConfiguration(config) {
    const display = this.shadowRoot?.getElementById('config-display');
    if (display && config) {
      display.textContent = `配置: ${config}`;
    }
  }
  
  loadData() {
    // 模拟异步数据加载
    setTimeout(() => {
      this.setAttribute('data', 'loaded-data');
    }, 1000);
  }
  
  bindEvents() {
    // 绑定事件...
  }
}

componentRegistry.register('optimized-component', OptimizedComponent);
```

---

## 5. 样式与主题化

### 5.1 CSS 选择器详解

Web Components 引入了专门的 CSS 选择器来处理组件样式和主题化。

#### 5.1.1 Host 选择器

| 选择器 | 描述 | 示例 |
|--------|------|------|
| `:host` | 选择 Shadow Host 元素 | `:host { display: block; }` |
| `:host()` | 条件选择 Shadow Host | `:host(.active) { color: blue; }` |
| `:host-context()` | 根据祖先元素选择 | `:host-context(.dark) { color: white; }` |
| `::slotted()` | 选择插槽内容 | `::slotted(p) { margin: 0; }` |
| `:defined` | 选择已定义的自定义元素 | `:defined { opacity: 1; }` |

#### 5.1.2 完整样式示例

```javascript
/**
 * 主题化组件示例
 * 展示 Web Components 样式系统的完整功能
 */
class ThemedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* 基础主机样式 */
        :host {
          display: block;
          padding: 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          
          /* CSS 自定义属性定义 */
          --primary-color: #007acc;
          --secondary-color: #6c757d;
          --success-color: #28a745;
          --danger-color: #dc3545;
          --warning-color: #ffc107;
          
          /* 默认样式 */
          background: var(--bg-color, #ffffff);
          color: var(--text-color, #333333);
          border: 1px solid var(--border-color, #dee2e6);
          font-family: var(--font-family, system-ui, sans-serif);
        }
        
        /* 主机状态样式 */
        :host(.primary) {
          --bg-color: var(--primary-color);
          --text-color: white;
          --border-color: var(--primary-color);
        }
        
        :host(.success) {
          --bg-color: var(--success-color);
          --text-color: white;
          --border-color: var(--success-color);
        }
        
        :host(.danger) {
          --bg-color: var(--danger-color);
          --text-color: white;
          --border-color: var(--danger-color);
        }
        
        :host(.warning) {
          --bg-color: var(--warning-color);
          --text-color: #212529;
          --border-color: var(--warning-color);
        }
        
        /* 尺寸变体 */
        :host(.small) {
          padding: 8px;
          font-size: 14px;
        }
        
        :host(.large) {
          padding: 24px;
          font-size: 18px;
        }
        
        /* 形状变体 */
        :host(.rounded) {
          border-radius: 50px;
        }
        
        :host(.square) {
          border-radius: 0;
        }
        
        /* 环境上下文样式 */
        :host-context(.dark-theme) {
          --bg-color: #2d2d2d;
          --text-color: #e0e0e0;
          --border-color: #555555;
        }
        
        :host-context(.high-contrast) {
          border-width: 3px;
          font-weight: bold;
        }
        
        :host-context(.print) {
          background: white !important;
          color: black !important;
          border: 2px solid black !important;
        }
        
        /* 插槽内容样式 */
        ::slotted(h1),
        ::slotted(h2),
        ::slotted(h3) {
          color: var(--heading-color, var(--primary-color));
          margin-top: 0;
        }
        
        ::slotted(p) {
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        ::slotted(.highlight) {
          background: var(--highlight-bg, #fff3cd);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
        }
        
        ::slotted(code) {
          background: var(--code-bg, #f8f9fa);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        /* 内部元素样式 */
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-weight: bold;
        }
        
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          fill: currentColor;
        }
        
        .content {
          line-height: 1.6;
        }
        
        .footer {
          margin-top: 12px;
          font-size: 0.9em;
          opacity: 0.8;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          :host {
            padding: 12px;
            font-size: 14px;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .icon {
            margin-bottom: 4px;
          }
        }
        
        /* 动画和过渡 */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :host(.animated) {
          animation: slideIn 0.3s ease-out;
        }
        
        /* 悬停效果 */
        :host(:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* 焦点样式 */
        :host(:focus) {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }
        
        /* 禁用状态 */
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
          filter: grayscale(100%);
        }
      </style>
      
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>主题化组件</span>
      </div>
      
      <div class="content">
        <slot></slot>
      </div>
      
      <div class="footer">
        <slot name="footer">默认页脚内容</slot>
      </div>
    `;
  }
}

componentRegistry.register('themed-component', ThemedComponent);
```

#### 5.1.3 CSS 自定义属性主题系统

```css
/* 全局主题定义 */
:root {
  /* 基础颜色 */
  --primary-50: #e3f2fd;
  --primary-100: #bbdefb;
  --primary-500: #2196f3;
  --primary-700: #1976d2;
  --primary-900: #0d47a1;
  
  /* 语义颜色 */
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --info: #2196f3;
  
  /* 中性颜色 */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-500: #9e9e9e;
  --gray-900: #212121;
  
  /* 字体 */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-family-mono: 'Courier New', monospace;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 边框圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 深色主题 */
.dark-theme {
  --primary-50: #1a237e;
  --primary-100: #283593;
  --primary-500: #3f51b5;
  --primary-700: #5c6bc0;
  --primary-900: #9fa8da;
  
  --gray-50: #121212;
  --gray-100: #1e1e1e;
  --gray-500: #757575;
  --gray-900: #ffffff;
}

/* 高对比度主题 */
.high-contrast {
  --primary-500: #000000;
  --gray-900: #000000;
  --gray-50: #ffffff;
}
```

---

## 6. 常见问题解答

### 6.1 开发常见问题

#### Q1: 自定义元素名称必须包含连字符吗？
**A:** 是的，自定义元素名称必须包含至少一个连字符（-），这是为了避免与未来的 HTML 标准元素名称冲突。

#### Q2: Shadow DOM 的样式完全隔离吗？
**A:** 大部分是隔离的，但有例外：
- CSS 自定义属性（变量）可以穿透 Shadow DOM
- `inherit` 关键字可以继承外部样式
- 某些 CSS 属性（如字体）会自然继承

#### Q3: 如何在 Web Components 之间通信？
**A:** 主要有以下几种方式：
```javascript
// 1. 自定义事件
component.dispatchEvent(new CustomEvent('data-changed', { 
  detail: data,
  bubbles: true 
}));

// 2. 属性传递
component.setAttribute('data', JSON.stringify(data));

// 3. 直接方法调用
component.updateData(data);

// 4. 全局状态管理
window.appState = { ...window.appState, ...data };
```

#### Q4: Web Components 的性能如何？
**A:** Web Components 具有以下性能特点：
- ✅ 原生浏览器支持，无框架开销
- ✅ Shadow DOM 提供高效的样式隔离
- ✅ 可以实现按需加载
- ⚠️ 大量组件实例化可能影响性能
- ⚠️ 复杂的 Shadow DOM 结构增加内存使用

### 6.2 兼容性问题

#### Q5: 哪些浏览器支持 Web Components？
**A:** 现代浏览器支持情况：

| 浏览器 | Custom Elements | Shadow DOM | HTML Templates |
|--------|----------------|------------|-----------------|
| Chrome 67+ | ✅ | ✅ | ✅ |
| Firefox 63+ | ✅ | ✅ | ✅ |
| Safari 13+ | ✅ | ✅ | ✅ |
| Edge 79+ | ✅ | ✅ | ✅ |

对于旧版浏览器，可以使用 [webcomponents.js](https://github.com/webcomponents/polyfills) polyfill。

#### Q6: 如何处理 IE 兼容性？
**A:** IE 不支持 Web Components，需要使用 polyfill：
```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-loader.js"></script>
```

### 6.3 最佳实践建议

#### Q7: 什么时候使用 Web Components？
**A:** 适合使用 Web Components 的场景：
- 🎯 需要跨框架复用的通用组件
- 🎯 设计系统和组件库
- 🎯 第三方插件和小部件
- 🎯 渐进式增强现有网站
- 🎯 微前端架构

#### Q8: Web Components vs React/Vue 组件？
**A:** 各有优势：

| 特性 | Web Components | React/Vue |
|------|----------------|-----------|
| **标准化** | W3C 标准 | 社区标准 |
| **框架依赖** | 无依赖 | 框架绑定 |
| **生态系统** | 较小 | 丰富 |
| **开发体验** | 原生 API | 丰富工具链 |
| **学习曲线** | 中等 | 中等偏高 |
| **性能** | 原生性能 | 虚拟 DOM 优化 |

#### Q9: 如何测试 Web Components？
**A:** 测试策略：
```javascript
// 单元测试示例 (Jest)
import './my-component.js';

describe('MyComponent', () => {
  let element;
  
  beforeEach(() => {
    element = document.createElement('my-component');
    document.body.appendChild(element);
  });
  
  afterEach(() => {
    document.body.removeChild(element);
  });
  
  test('should render correctly', () => {
    expect(element.shadowRoot.textContent).toContain('Expected content');
  });
  
  test('should handle attribute changes', () => {
    element.setAttribute('value', 'test');
    expect(element.value).toBe('test');
  });
});
```

### 6.4 调试技巧

#### Q10: 如何调试 Shadow DOM？
**A:** Chrome DevTools 调试技巧：
1. 在 Elements 面板中，Shadow DOM 显示为 `#shadow-root`
2. 可以直接在 Console 中访问：`$0.shadowRoot`
3. 使用 `getEventListeners($0)` 查看事件监听器
4. 样式面板会显示 Shadow DOM 的样式继承关系

```javascript
// 调试工具函数
function debugComponent(selector) {
  const element = document.querySelector(selector);
  console.log('Element:', element);
  console.log('Shadow Root:', element.shadowRoot);
  console.log('Attributes:', [...element.attributes]);
  console.log('Properties:', Object.getOwnPropertyNames(element));
}

// 使用方式
debugComponent('my-component');
```

---

## 7. 总结

Web Components 作为 Web 平台的原生组件化解决方案，提供了强大的封装、复用和标准化能力。通过 Custom Elements、Shadow DOM、HTML Templates 和 ES Modules 的结合，开发者可以创建真正框架无关的可重用组件。

虽然 Web Components 在生态系统和工具链方面还在发展中，但其标准化的优势和原生性能使其成为现代 Web 开发的重要选择，特别是在构建设计系统、跨框架组件库和微前端架构时具有独特的价值。
