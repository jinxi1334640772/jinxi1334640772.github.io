---
title: 🔐 权限策略与安全控制完全指南
description: 深入理解 Web 权限策略机制，包括 Permissions Policy、iframe 安全控制、沙盒隔离等现代 Web 安全技术
outline: deep
---

# 🔐 权限策略与安全控制完全指南

> 权限策略为网站开发人员提供了明确声明哪些特性可以或不可以在网站上使用的机制。通过定义一组"策略"，限制网站代码可以访问哪些 API，或者修改浏览器对某些特性的默认行为。

## 🎯 学习目标

::: tip 📚 核心知识点
- 理解权限策略的工作原理和应用场景
- 掌握 Permissions Policy 的配置和管理
- 学习 iframe 安全控制和沙盒机制
- 了解现代 Web 安全策略的最佳实践
- 建立完整的权限控制体系
:::

## 🌟 权限策略概述

### 📖 核心概念

权限策略（Permissions Policy）曾经被称为特性策略（Feature Policy），是一种用于控制网站功能访问的安全机制。它允许开发者明确声明哪些 Web API 和功能可以在其网站上使用。

### 🎯 主要优势

| 优势 | 描述 | 应用场景 |
|------|------|----------|
| **API 访问控制** | 限制敏感 API 的使用 | 🔒 隐私保护 |
| **性能优化** | 阻止不必要的功能 | 🚀 提升性能 |
| **安全增强** | 防止恶意代码滥用 | 🛡️ 安全防护 |
| **第三方控制** | 管理第三方内容权限 | 🔧 集成管理 |

### 🔧 使用场景

::: info 📋 实际应用
- 改变手机和第三方视频自动播放的默认行为
- 限制网站使用相机、麦克风、扬声器等敏感设备
- 允许 iframe 使用全屏 API
- 如果项目在视口中不可见，则停止对其进行脚本处理，以提高性能
:::

## 🛠️ 权限策略配置

### 📊 配置方式对比

| 配置方式 | 描述 | 使用场景 | 优先级 |
|----------|------|----------|--------|
| **HTTP 头部** | Permissions-Policy 头部 | 🌐 全局控制 | 🟢 高 |
| **iframe allow** | iframe 的 allow 属性 | 🔗 嵌入内容 | 🟡 中 |
| **HTML Meta** | meta 标签配置 | 📄 页面级控制 | 🔴 低 |

### 1️⃣ HTTP 头部配置

```javascript
// Express.js 权限策略配置
const permissionsPolicyMiddleware = (req, res, next) => {
  // 基础权限策略
  const basicPolicy = [
    'camera=()',                    // 禁用摄像头
    'microphone=()',                // 禁用麦克风
    'geolocation=()',               // 禁用地理位置
    'payment=()',                   // 禁用支付API
    'usb=()',                       // 禁用USB API
    'magnetometer=()',              // 禁用磁力计
    'gyroscope=()',                 // 禁用陀螺仪
    'accelerometer=()',             // 禁用加速度计
    'ambient-light-sensor=()',      // 禁用环境光传感器
    'autoplay=(self)',              // 仅允许同源自动播放
    'fullscreen=(self)',            // 仅允许同源全屏
    'picture-in-picture=(self)',    // 仅允许同源画中画
    'screen-wake-lock=(self)',      // 仅允许同源屏幕唤醒锁
    'web-share=(self)',             // 仅允许同源网页分享
    'clipboard-write=(self)',       // 仅允许同源剪贴板写入
    'display-capture=(self)',       // 仅允许同源屏幕捕获
  ];
  
  res.setHeader('Permissions-Policy', basicPolicy.join(', '));
  next();
};

// 动态权限策略
const dynamicPermissionsPolicy = (config) => {
  return (req, res, next) => {
    const policy = [];
    
    // 根据页面类型设置不同策略
    const path = req.path;
    
    if (path.startsWith('/admin')) {
      // 管理页面：更严格的策略
      policy.push(
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'autoplay=()',
        'fullscreen=()'
      );
    } else if (path.startsWith('/media')) {
      // 媒体页面：允许相机和麦克风
      policy.push(
        'camera=(self)',
        'microphone=(self)',
        'autoplay=(self)',
        'fullscreen=(self)',
        'picture-in-picture=(self)',
        'geolocation=()',
        'payment=()',
        'usb=()'
      );
    } else if (path.startsWith('/payment')) {
      // 支付页面：允许支付API
      policy.push(
        'payment=(self)',
        'geolocation=(self)',
        'camera=()',
        'microphone=()',
        'usb=()',
        'autoplay=()',
        'fullscreen=()'
      );
    } else {
      // 默认策略
      policy.push(
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'autoplay=(self)',
        'fullscreen=(self)'
      );
    }
    
    res.setHeader('Permissions-Policy', policy.join(', '));
    next();
  };
};

// 使用动态策略
app.use(dynamicPermissionsPolicy());
```

### 2️⃣ iframe 权限控制

```html
<!-- iframe 权限策略配置 -->
<!-- 基础权限控制 -->
<iframe 
  src="https://example.com/widget"
  allow="camera 'none'; microphone 'none'; geolocation 'none'">
</iframe>

<!-- 允许特定权限 -->
<iframe 
  src="https://media.example.com/player"
  allow="autoplay 'self'; fullscreen 'self'; picture-in-picture 'self'">
</iframe>

<!-- 复杂权限配置 -->
<iframe 
  src="https://trusted.example.com/app"
  allow="camera 'self' https://trusted.example.com; 
         microphone 'self' https://trusted.example.com; 
         geolocation 'self'; 
         payment 'self'; 
         fullscreen 'self'">
</iframe>

<!-- 地图服务权限 -->
<iframe 
  src="https://maps.example.com/embed"
  allow="geolocation 'self' https://maps.example.com">
</iframe>
```

### 3️⃣ JavaScript 权限检查

```javascript
// 权限检查工具
class PermissionChecker {
  constructor() {
    this.supportedPermissions = [
      'camera',
      'microphone',
      'geolocation',
      'notifications',
      'push',
      'midi',
      'payment-handler',
      'background-sync',
      'background-fetch',
      'persistent-storage',
      'ambient-light-sensor',
      'accelerometer',
      'gyroscope',
      'magnetometer'
    ];
  }
  
  // 检查单个权限
  async checkPermission(permission) {
    if (!navigator.permissions) {
      return { state: 'unknown', error: 'Permissions API not supported' };
    }
    
    try {
      const result = await navigator.permissions.query({ name: permission });
      return {
        state: result.state,
        permission: permission,
        granted: result.state === 'granted'
      };
    } catch (error) {
      return {
        state: 'error',
        permission: permission,
        error: error.message
      };
    }
  }
  
  // 检查多个权限
  async checkPermissions(permissions) {
    const results = {};
    
    for (const permission of permissions) {
      results[permission] = await this.checkPermission(permission);
    }
    
    return results;
  }
  
  // 请求权限
  async requestPermission(permission) {
    try {
      let result;
      
      switch (permission) {
        case 'camera':
          result = await navigator.mediaDevices.getUserMedia({ video: true });
          return { granted: true, stream: result };
        
        case 'microphone':
          result = await navigator.mediaDevices.getUserMedia({ audio: true });
          return { granted: true, stream: result };
        
        case 'geolocation':
          result = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          return { granted: true, position: result };
        
        case 'notifications':
          result = await Notification.requestPermission();
          return { granted: result === 'granted' };
        
        default:
          return { granted: false, error: 'Unsupported permission' };
      }
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }
  
  // 生成权限报告
  async generatePermissionReport() {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      permissions: {},
      features: {}
    };
    
    // 检查所有支持的权限
    for (const permission of this.supportedPermissions) {
      report.permissions[permission] = await this.checkPermission(permission);
    }
    
    // 检查特性支持
    report.features = {
      webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      geolocation: !!navigator.geolocation,
      notifications: !!window.Notification,
      serviceWorker: !!navigator.serviceWorker,
      webGL: !!document.createElement('canvas').getContext('webgl'),
      webAssembly: !!window.WebAssembly,
      intersectionObserver: !!window.IntersectionObserver,
      paymentRequest: !!window.PaymentRequest
    };
    
    return report;
  }
}

// 使用权限检查器
const permissionChecker = new PermissionChecker();

// 页面加载时检查权限
window.addEventListener('load', async () => {
  const report = await permissionChecker.generatePermissionReport();
  console.log('权限报告:', report);
  
  // 发送权限报告到服务器
  fetch('/api/permission-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
  });
});
```

## 🔒 允许列表配置

### 📋 允许列表语法

允许列表是一系列源的列表，配置某权限在哪些域上可用。

#### 🎯 基础语法

| 值 | 描述 | 示例 | 使用场景 |
|-----|------|------|----------|
| **`*`** | 所有源都允许 | `camera=*` | 🔴 不推荐 |
| **`()`** | 完全禁止 | `microphone=()` | 🔒 敏感功能 |
| **`'self'`** | 仅同源允许 | `geolocation='self'` | 🏠 内部功能 |
| **`'src'`** | iframe src 源 | `fullscreen='src'` | 🖼️ 嵌入内容 |
| **`"域名"`** | 特定域名 | `payment="https://pay.com"` | 🤝 信任伙伴 |

#### 🔧 复杂配置示例

```javascript
// 复杂权限策略配置
const advancedPermissionsPolicy = {
  // 媒体权限：允许同源和信任域名
  camera: ['self', 'https://trusted-media.com'],
  microphone: ['self', 'https://trusted-media.com'],
  
  // 地理位置：仅同源
  geolocation: ['self'],
  
  // 支付：同源和支付服务商
  payment: ['self', 'https://payments.stripe.com', 'https://www.paypal.com'],
  
  // 自动播放：同源和媒体CDN
  autoplay: ['self', 'https://media-cdn.example.com'],
  
  // 全屏：同源和视频平台
  fullscreen: ['self', 'https://player.vimeo.com', 'https://www.youtube.com'],
  
  // 通知：仅同源
  notifications: ['self'],
  
  // 危险功能：完全禁止
  usb: [],
  serial: [],
  bluetooth: [],
  
  // 传感器：根据需要配置
  accelerometer: [],
  gyroscope: [],
  magnetometer: [],
  
  // 网络功能：允许同源
  backgroundSync: ['self'],
  backgroundFetch: ['self'],
  
  // 存储：仅同源
  persistentStorage: ['self'],
  
  // 剪贴板：仅同源
  clipboardRead: ['self'],
  clipboardWrite: ['self']
};

// 生成策略字符串
const generatePolicyString = (policies) => {
  return Object.entries(policies).map(([feature, sources]) => {
    if (sources.length === 0) {
      return `${feature}=()`;
    }
    
    const sourceList = sources.map(source => {
      if (source === 'self') {
        return "'self'";
      } else if (source.startsWith('https://')) {
        return `"${source}"`;
      } else {
        return source;
      }
    }).join(' ');
    
    return `${feature}=(${sourceList})`;
  }).join(', ');
};

// 应用高级策略
app.use((req, res, next) => {
  const policyString = generatePolicyString(advancedPermissionsPolicy);
  res.setHeader('Permissions-Policy', policyString);
  next();
});
```

### 🌐 通配符支持

```javascript
// 通配符权限策略
const wildcardPolicy = {
  // 允许所有 example.com 子域名
  camera: ['self', 'https://*.example.com'],
  
  // 允许特定模式的域名
  microphone: ['self', 'https://media-*.example.com'],
  
  // 组合使用
  geolocation: ['self', 'https://*.trusted.com', 'https://maps.*.com']
};

// 验证域名是否匹配通配符
const matchesWildcard = (domain, pattern) => {
  const regex = new RegExp(
    pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
  );
  return regex.test(domain);
};

// 动态验证权限
const validatePermission = (feature, origin, policies) => {
  const allowedSources = policies[feature];
  
  if (!allowedSources) {
    return false;
  }
  
  // 检查精确匹配
  if (allowedSources.includes(origin)) {
    return true;
  }
  
  // 检查通配符匹配
  for (const source of allowedSources) {
    if (source.includes('*') && matchesWildcard(origin, source)) {
      return true;
    }
  }
  
  return false;
};
```

## 🛡️ iframe 安全控制

### 🔧 iframe 权限管理

```javascript
// iframe 权限管理器
class IframePermissionManager {
  constructor() {
    this.trustedDomains = [
      'https://trusted.example.com',
      'https://media.example.com',
      'https://payments.example.com'
    ];
    
    this.permissionTemplates = {
      media: {
        allow: 'camera "src"; microphone "src"; autoplay "src"; fullscreen "src"',
        sandbox: 'allow-scripts allow-same-origin allow-presentation'
      },
      
      payment: {
        allow: 'payment "src"; geolocation "src"',
        sandbox: 'allow-scripts allow-same-origin allow-forms'
      },
      
      social: {
        allow: 'clipboard-write "src"',
        sandbox: 'allow-scripts allow-same-origin allow-popups'
      },
      
      restricted: {
        allow: 'none',
        sandbox: 'allow-scripts'
      }
    };
  }
  
  // 生成 iframe 配置
  generateIframeConfig(src, type = 'restricted') {
    const template = this.permissionTemplates[type];
    
    if (!template) {
      throw new Error(`未知的权限模板: ${type}`);
    }
    
    // 验证域名
    if (!this.isDomainTrusted(src)) {
      console.warn(`不信任的域名: ${src}`);
      return this.permissionTemplates.restricted;
    }
    
    return {
      src,
      allow: template.allow,
      sandbox: template.sandbox,
      loading: 'lazy',
      referrerpolicy: 'strict-origin-when-cross-origin'
    };
  }
  
  // 检查域名是否可信
  isDomainTrusted(url) {
    try {
      const domain = new URL(url).origin;
      return this.trustedDomains.includes(domain);
    } catch (error) {
      return false;
    }
  }
  
  // 动态创建安全 iframe
  createSecureIframe(src, type, container) {
    const config = this.generateIframeConfig(src, type);
    
    const iframe = document.createElement('iframe');
    iframe.src = config.src;
    iframe.allow = config.allow;
    iframe.sandbox = config.sandbox;
    iframe.loading = config.loading;
    iframe.referrerPolicy = config.referrerpolicy;
    
    // 添加安全事件监听
    iframe.addEventListener('load', () => {
      console.log(`iframe 加载完成: ${src}`);
      this.monitorIframe(iframe);
    });
    
    iframe.addEventListener('error', (error) => {
      console.error(`iframe 加载失败: ${src}`, error);
    });
    
    container.appendChild(iframe);
    return iframe;
  }
  
  // 监控 iframe 行为
  monitorIframe(iframe) {
    // 监控消息通信
    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) {
        this.handleIframeMessage(event, iframe);
      }
    });
    
    // 监控权限请求
    this.monitorPermissionRequests(iframe);
  }
  
  // 处理 iframe 消息
  handleIframeMessage(event, iframe) {
    const origin = event.origin;
    
    // 验证消息来源
    if (!this.isDomainTrusted(origin)) {
      console.warn(`收到来自不信任域名的消息: ${origin}`);
      return;
    }
    
    // 处理不同类型的消息
    const { type, data } = event.data;
    
    switch (type) {
      case 'permission-request':
        this.handlePermissionRequest(data, iframe);
        break;
      
      case 'resize':
        this.handleResizeRequest(data, iframe);
        break;
      
      case 'navigation':
        this.handleNavigationRequest(data, iframe);
        break;
      
      default:
        console.log(`未知的消息类型: ${type}`);
    }
  }
  
  // 处理权限请求
  handlePermissionRequest(data, iframe) {
    const { permission, reason } = data;
    
    // 根据权限类型决定是否允许
    const allowedPermissions = ['camera', 'microphone', 'geolocation'];
    
    if (!allowedPermissions.includes(permission)) {
      iframe.contentWindow.postMessage({
        type: 'permission-response',
        permission,
        granted: false,
        reason: '权限不被允许'
      }, '*');
      return;
    }
    
    // 可以添加用户确认逻辑
    const granted = confirm(`iframe 请求 ${permission} 权限，原因: ${reason}。是否允许？`);
    
    iframe.contentWindow.postMessage({
      type: 'permission-response',
      permission,
      granted,
      reason: granted ? '用户同意' : '用户拒绝'
    }, '*');
  }
  
  // 处理调整大小请求
  handleResizeRequest(data, iframe) {
    const { width, height } = data;
    
    // 限制最大尺寸
    const maxWidth = 1200;
    const maxHeight = 800;
    
    const newWidth = Math.min(width, maxWidth);
    const newHeight = Math.min(height, maxHeight);
    
    iframe.style.width = `${newWidth}px`;
    iframe.style.height = `${newHeight}px`;
  }
  
  // 处理导航请求
  handleNavigationRequest(data, iframe) {
    const { url } = data;
    
    if (this.isDomainTrusted(url)) {
      iframe.src = url;
    } else {
      console.warn(`拒绝导航到不信任的URL: ${url}`);
    }
  }
  
  // 监控权限请求
  monitorPermissionRequests(iframe) {
    // 这里可以添加更复杂的权限监控逻辑
    console.log(`开始监控 iframe 权限请求: ${iframe.src}`);
  }
}

// 使用 iframe 权限管理器
const iframeManager = new IframePermissionManager();

// 创建媒体 iframe
const createMediaIframe = (src, container) => {
  return iframeManager.createSecureIframe(src, 'media', container);
};

// 创建支付 iframe
const createPaymentIframe = (src, container) => {
  return iframeManager.createSecureIframe(src, 'payment', container);
};
```

### 🔒 沙盒属性详解

```html
<!-- 沙盒属性配置 -->
<!-- 基础沙盒 -->
<iframe src="https://example.com" sandbox></iframe>

<!-- 允许脚本执行 -->
<iframe src="https://example.com" sandbox="allow-scripts"></iframe>

<!-- 允许表单提交 -->
<iframe src="https://example.com" sandbox="allow-forms"></iframe>

<!-- 允许弹出窗口 -->
<iframe src="https://example.com" sandbox="allow-popups"></iframe>

<!-- 允许同源访问 -->
<iframe src="https://example.com" sandbox="allow-same-origin"></iframe>

<!-- 允许顶级导航 -->
<iframe src="https://example.com" sandbox="allow-top-navigation"></iframe>

<!-- 允许自动播放 -->
<iframe src="https://example.com" sandbox="allow-autoplay"></iframe>

<!-- 允许全屏 -->
<iframe src="https://example.com" sandbox="allow-fullscreen"></iframe>

<!-- 允许画中画 -->
<iframe src="https://example.com" sandbox="allow-picture-in-picture"></iframe>

<!-- 组合权限 -->
<iframe 
  src="https://trusted.example.com/app"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  allow="camera 'src'; microphone 'src'; geolocation 'src'">
</iframe>
```

### 📊 沙盒权限对比

| 权限 | 描述 | 安全等级 | 使用场景 |
|------|------|----------|----------|
| **allow-scripts** | 允许脚本执行 | 🟡 中 | 交互式内容 |
| **allow-forms** | 允许表单提交 | 🟡 中 | 用户输入 |
| **allow-popups** | 允许弹出窗口 | 🔴 低 | 社交分享 |
| **allow-same-origin** | 允许同源访问 | 🔴 低 | 信任内容 |
| **allow-top-navigation** | 允许顶级导航 | 🔴 低 | 页面跳转 |
| **allow-autoplay** | 允许自动播放 | 🟢 高 | 媒体内容 |
| **allow-fullscreen** | 允许全屏 | 🟢 高 | 视频播放 |

## 🎯 权限策略指令集合

### 📋 完整指令列表

```javascript
// 权限策略指令集合
const permissionPolicyDirectives = {
  // 设备访问
  device: {
    camera: '摄像头访问',
    microphone: '麦克风访问',
    speaker: '扬声器访问',
    displayCapture: '屏幕捕获',
    usb: 'USB设备访问',
    serial: '串行端口访问',
    bluetooth: '蓝牙访问',
    hid: 'HID设备访问'
  },
  
  // 传感器
  sensors: {
    accelerometer: '加速度计',
    gyroscope: '陀螺仪',
    magnetometer: '磁力计',
    ambientLightSensor: '环境光传感器',
    geolocation: '地理位置'
  },
  
  // 媒体功能
  media: {
    autoplay: '自动播放',
    fullscreen: '全屏显示',
    pictureInPicture: '画中画',
    screenWakeLock: '屏幕唤醒锁'
  },
  
  // 网络和通信
  network: {
    webShare: '网页分享',
    publickeyCreds: '公钥凭据',
    otpCreds: 'OTP凭据',
    identityCredentials: '身份凭据'
  },
  
  // 存储和数据
  storage: {
    persistentStorage: '持久存储',
    storageAccess: '存储访问',
    clipboardRead: '剪贴板读取',
    clipboardWrite: '剪贴板写入'
  },
  
  // 性能和资源
  performance: {
    computePressure: '计算压力',
    idleDetection: '空闲检测',
    windowManagement: '窗口管理'
  },
  
  // 其他功能
  other: {
    payment: '支付API',
    midi: 'MIDI访问',
    gamepad: '游戏手柄',
    encryptedMedia: '加密媒体',
    localFonts: '本地字体',
    browsingTopics: '浏览主题',
    attributionReporting: '归因报告'
  }
};

// 策略配置生成器
class PolicyConfigGenerator {
  constructor() {
    this.templates = {
      // 严格模式：禁止所有敏感功能
      strict: {
        camera: [],
        microphone: [],
        geolocation: [],
        usb: [],
        serial: [],
        bluetooth: [],
        payment: [],
        autoplay: [],
        fullscreen: [],
        pictureInPicture: [],
        webShare: [],
        clipboardRead: [],
        clipboardWrite: []
      },
      
      // 基础模式：允许基本功能
      basic: {
        camera: [],
        microphone: [],
        geolocation: [],
        usb: [],
        serial: [],
        bluetooth: [],
        payment: [],
        autoplay: ['self'],
        fullscreen: ['self'],
        pictureInPicture: ['self'],
        webShare: ['self'],
        clipboardRead: [],
        clipboardWrite: ['self']
      },
      
      // 媒体模式：允许媒体相关功能
      media: {
        camera: ['self'],
        microphone: ['self'],
        geolocation: [],
        usb: [],
        serial: [],
        bluetooth: [],
        payment: [],
        autoplay: ['self'],
        fullscreen: ['self'],
        pictureInPicture: ['self'],
        webShare: ['self'],
        clipboardRead: [],
        clipboardWrite: ['self'],
        screenWakeLock: ['self'],
        displayCapture: ['self']
      },
      
      // 应用模式：允许应用相关功能
      app: {
        camera: ['self'],
        microphone: ['self'],
        geolocation: ['self'],
        usb: [],
        serial: [],
        bluetooth: [],
        payment: ['self'],
        autoplay: ['self'],
        fullscreen: ['self'],
        pictureInPicture: ['self'],
        webShare: ['self'],
        clipboardRead: ['self'],
        clipboardWrite: ['self'],
        persistentStorage: ['self'],
        idleDetection: ['self'],
        windowManagement: ['self']
      }
    };
  }
  
  // 生成策略配置
  generateConfig(template, customizations = {}) {
    const baseConfig = this.templates[template];
    
    if (!baseConfig) {
      throw new Error(`未知的模板: ${template}`);
    }
    
    // 合并自定义配置
    const config = { ...baseConfig, ...customizations };
    
    return this.formatConfig(config);
  }
  
  // 格式化配置
  formatConfig(config) {
    return Object.entries(config).map(([directive, sources]) => {
      const formattedSources = sources.map(source => {
        if (source === 'self') {
          return "'self'";
        } else if (source === 'none') {
          return "'none'";
        } else if (source === 'src') {
          return "'src'";
        } else if (source.startsWith('http')) {
          return `"${source}"`;
        } else if (source === '*') {
          return '*';
        } else {
          return source;
        }
      });
      
      if (formattedSources.length === 0) {
        return `${this.camelToKebab(directive)}=()`;
      } else {
        return `${this.camelToKebab(directive)}=(${formattedSources.join(' ')})`;
      }
    }).join(', ');
  }
  
  // 驼峰转短横线
  camelToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  
  // 验证配置
  validateConfig(config) {
    const errors = [];
    
    for (const [directive, sources] of Object.entries(config)) {
      // 检查指令是否有效
      if (!this.isValidDirective(directive)) {
        errors.push(`无效的指令: ${directive}`);
      }
      
      // 检查源是否有效
      for (const source of sources) {
        if (!this.isValidSource(source)) {
          errors.push(`无效的源: ${source} (指令: ${directive})`);
        }
      }
    }
    
    return errors;
  }
  
  // 检查指令是否有效
  isValidDirective(directive) {
    const validDirectives = [
      'camera', 'microphone', 'geolocation', 'usb', 'serial', 'bluetooth',
      'payment', 'autoplay', 'fullscreen', 'pictureInPicture', 'webShare',
      'clipboardRead', 'clipboardWrite', 'persistentStorage', 'idleDetection',
      'windowManagement', 'screenWakeLock', 'displayCapture', 'accelerometer',
      'gyroscope', 'magnetometer', 'ambientLightSensor', 'encryptedMedia',
      'midi', 'gamepad', 'localFonts', 'browsingTopics', 'attributionReporting'
    ];
    
    return validDirectives.includes(directive);
  }
  
  // 检查源是否有效
  isValidSource(source) {
    const validSources = ['self', 'none', 'src', '*'];
    
    if (validSources.includes(source)) {
      return true;
    }
    
    // 检查是否为有效的URL
    if (source.startsWith('http')) {
      try {
        new URL(source);
        return true;
      } catch {
        return false;
      }
    }
    
    return false;
  }
}

// 使用策略配置生成器
const policyGenerator = new PolicyConfigGenerator();

// 生成不同类型的策略
const strictPolicy = policyGenerator.generateConfig('strict');
const mediaPolicy = policyGenerator.generateConfig('media', {
  geolocation: ['self']  // 允许地理位置
});

console.log('严格策略:', strictPolicy);
console.log('媒体策略:', mediaPolicy);
```

## 🔄 权限 API 集成

### 🔧 权限查询和管理

```javascript
// 权限 API 管理器
class PermissionAPIManager {
  constructor() {
    this.permissionCache = new Map();
    this.permissionWatchers = new Map();
  }
  
  // 查询权限状态
  async queryPermission(permission) {
    if (!navigator.permissions) {
      return { state: 'unsupported' };
    }
    
    try {
      const result = await navigator.permissions.query({ name: permission });
      
      // 缓存结果
      this.permissionCache.set(permission, result);
      
      // 监听权限变化
      this.watchPermission(permission, result);
      
      return {
        state: result.state,
        permission: permission,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        state: 'error',
        error: error.message,
        permission: permission
      };
    }
  }
  
  // 监听权限变化
  watchPermission(permission, permissionStatus) {
    if (this.permissionWatchers.has(permission)) {
      return;
    }
    
    const handler = (event) => {
      console.log(`权限 ${permission} 状态变化: ${event.target.state}`);
      
      // 更新缓存
      this.permissionCache.set(permission, event.target);
      
      // 触发自定义事件
      this.dispatchPermissionChange(permission, event.target.state);
    };
    
    permissionStatus.addEventListener('change', handler);
    this.permissionWatchers.set(permission, handler);
  }
  
  // 分发权限变化事件
  dispatchPermissionChange(permission, state) {
    const event = new CustomEvent('permissionchange', {
      detail: { permission, state }
    });
    
    window.dispatchEvent(event);
  }
  
  // 批量查询权限
  async queryMultiplePermissions(permissions) {
    const results = {};
    
    for (const permission of permissions) {
      results[permission] = await this.queryPermission(permission);
    }
    
    return results;
  }
  
  // 获取权限摘要
  getPermissionSummary() {
    const summary = {
      total: this.permissionCache.size,
      granted: 0,
      denied: 0,
      prompt: 0,
      details: {}
    };
    
    for (const [permission, status] of this.permissionCache) {
      const state = status.state;
      summary.details[permission] = state;
      
      if (state === 'granted') {
        summary.granted++;
      } else if (state === 'denied') {
        summary.denied++;
      } else if (state === 'prompt') {
        summary.prompt++;
      }
    }
    
    return summary;
  }
  
  // 清理权限监听器
  cleanup() {
    for (const [permission, handler] of this.permissionWatchers) {
      const status = this.permissionCache.get(permission);
      if (status) {
        status.removeEventListener('change', handler);
      }
    }
    
    this.permissionWatchers.clear();
    this.permissionCache.clear();
  }
}

// 权限请求管理器
class PermissionRequestManager {
  constructor() {
    this.apiManager = new PermissionAPIManager();
    this.requestQueue = [];
    this.processing = false;
  }
  
  // 请求权限
  async requestPermission(permission, options = {}) {
    const {
      showPrompt = true,
      fallback = null,
      timeout = 10000
    } = options;
    
    // 首先查询当前状态
    const currentStatus = await this.apiManager.queryPermission(permission);
    
    if (currentStatus.state === 'granted') {
      return { granted: true, permission };
    }
    
    if (currentStatus.state === 'denied') {
      if (fallback) {
        return await fallback();
      }
      return { granted: false, permission, reason: 'denied' };
    }
    
    // 添加到请求队列
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        permission,
        resolve,
        reject,
        showPrompt,
        timeout,
        fallback
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  
  // 处理请求队列
  async processQueue() {
    if (this.requestQueue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    const request = this.requestQueue.shift();
    
    try {
      const result = await this.performRequest(request);
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    }
    
    // 继续处理队列
    setTimeout(() => this.processQueue(), 100);
  }
  
  // 执行权限请求
  async performRequest(request) {
    const { permission, showPrompt, timeout, fallback } = request;
    
    // 显示提示信息
    if (showPrompt) {
      const userConsent = await this.showPermissionPrompt(permission);
      if (!userConsent) {
        return { granted: false, permission, reason: 'user_declined' };
      }
    }
    
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
    
    try {
      const requestPromise = this.nativePermissionRequest(permission);
      const result = await Promise.race([requestPromise, timeoutPromise]);
      
      return { granted: result.granted, permission };
    } catch (error) {
      if (fallback) {
        return await fallback();
      }
      throw error;
    }
  }
  
  // 显示权限提示
  async showPermissionPrompt(permission) {
    const permissionNames = {
      camera: '摄像头',
      microphone: '麦克风',
      geolocation: '地理位置',
      notifications: '通知',
      push: '推送消息'
    };
    
    const permissionName = permissionNames[permission] || permission;
    const message = `应用需要访问您的${permissionName}权限，这将用于提供更好的服务。是否允许？`;
    
    return confirm(message);
  }
  
  // 原生权限请求
  async nativePermissionRequest(permission) {
    switch (permission) {
      case 'camera':
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        return { granted: true, stream: videoStream };
      
      case 'microphone':
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return { granted: true, stream: audioStream };
      
      case 'geolocation':
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        return { granted: true, position };
      
      case 'notifications':
        const permission = await Notification.requestPermission();
        return { granted: permission === 'granted' };
      
      default:
        throw new Error(`不支持的权限类型: ${permission}`);
    }
  }
}

// 使用权限管理器
const permissionManager = new PermissionRequestManager();

// 请求摄像头权限
const requestCameraAccess = async () => {
  try {
    const result = await permissionManager.requestPermission('camera', {
      showPrompt: true,
      timeout: 15000,
      fallback: async () => {
        alert('无法访问摄像头，请检查浏览器设置');
        return { granted: false, reason: 'fallback' };
      }
    });
    
    if (result.granted) {
      console.log('摄像头权限已授予');
      // 开始使用摄像头
    } else {
      console.log('摄像头权限被拒绝');
    }
  } catch (error) {
    console.error('请求摄像头权限失败:', error);
  }
};

// 监听权限变化
window.addEventListener('permissionchange', (event) => {
  const { permission, state } = event.detail;
  console.log(`权限变化: ${permission} -> ${state}`);
  
  // 根据权限状态更新UI
  updatePermissionUI(permission, state);
});
```

## 📊 最佳实践

### ✅ 权限策略最佳实践

```javascript
// 权限策略最佳实践指南
const bestPractices = {
  // 1. 最小权限原则
  minimumPrivilege: {
    description: '只授予必要的权限',
    example: {
      // ❌ 错误：授予所有权限
      bad: 'camera=*; microphone=*; geolocation=*',
      
      // ✅ 正确：只授予必要权限
      good: 'camera=(); microphone=(); geolocation="self"'
    }
  },
  
  // 2. 渐进式权限请求
  progressivePermissions: {
    description: '在需要时才请求权限',
    implementation: async function(features) {
      for (const feature of features) {
        const needed = await this.checkIfFeatureNeeded(feature);
        if (needed) {
          await this.requestPermission(feature);
        }
      }
    }
  },
  
  // 3. 透明的权限说明
  transparentPermissions: {
    description: '清楚说明为什么需要权限',
    implementation: function(permission) {
      const explanations = {
        camera: '用于拍摄头像和扫描二维码',
        microphone: '用于语音通话和语音识别',
        geolocation: '用于提供基于位置的服务',
        notifications: '用于及时通知重要消息'
      };
      
      return explanations[permission] || '提供更好的用户体验';
    }
  },
  
  // 4. 优雅降级
  gracefulDegradation: {
    description: '在权限被拒绝时提供替代方案',
    implementation: async function(permission) {
      try {
        await this.requestPermission(permission);
        return this.enableFeature(permission);
      } catch (error) {
        return this.enableFallbackFeature(permission);
      }
    }
  }
};

// 权限管理最佳实践实现
class PermissionBestPractices {
  constructor() {
    this.permissions = new Map();
    this.fallbacks = new Map();
    this.explanations = new Map();
  }
  
  // 注册权限说明
  registerPermissionExplanation(permission, explanation) {
    this.explanations.set(permission, explanation);
  }
  
  // 注册降级方案
  registerFallback(permission, fallback) {
    this.fallbacks.set(permission, fallback);
  }
  
  // 智能权限请求
  async requestPermissionSmart(permission, context = {}) {
    const { urgent = false, showEducation = true } = context;
    
    // 1. 检查权限当前状态
    const currentStatus = await this.checkPermissionStatus(permission);
    
    if (currentStatus === 'granted') {
      return { granted: true, source: 'already_granted' };
    }
    
    if (currentStatus === 'denied') {
      // 权限已被拒绝，使用降级方案
      return this.useFallback(permission);
    }
    
    // 2. 显示权限教育（如果需要）
    if (showEducation && !urgent) {
      await this.showPermissionEducation(permission);
    }
    
    // 3. 请求权限
    try {
      const result = await this.requestPermission(permission);
      
      if (result.granted) {
        this.permissions.set(permission, 'granted');
        return { granted: true, source: 'user_granted' };
      } else {
        this.permissions.set(permission, 'denied');
        return this.useFallback(permission);
      }
    } catch (error) {
      console.error(`权限请求失败: ${permission}`, error);
      return this.useFallback(permission);
    }
  }
  
  // 显示权限教育
  async showPermissionEducation(permission) {
    const explanation = this.explanations.get(permission) || 
                       `需要${permission}权限来提供更好的服务`;
    
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'permission-education-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>权限说明</h3>
          <p>${explanation}</p>
          <div class="modal-actions">
            <button id="understand-btn">我了解了</button>
            <button id="cancel-btn">取消</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      document.getElementById('understand-btn').onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };
      
      document.getElementById('cancel-btn').onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };
    });
  }
  
  // 使用降级方案
  async useFallback(permission) {
    const fallback = this.fallbacks.get(permission);
    
    if (fallback) {
      try {
        const result = await fallback();
        return { granted: false, fallback: true, result };
      } catch (error) {
        console.error(`降级方案执行失败: ${permission}`, error);
        return { granted: false, fallback: false, error };
      }
    }
    
    return { granted: false, fallback: false };
  }
  
  // 检查权限状态
  async checkPermissionStatus(permission) {
    if (!navigator.permissions) {
      return 'unsupported';
    }
    
    try {
      const result = await navigator.permissions.query({ name: permission });
      return result.state;
    } catch (error) {
      return 'unknown';
    }
  }
  
  // 请求权限
  async requestPermission(permission) {
    // 具体实现取决于权限类型
    switch (permission) {
      case 'camera':
        return this.requestCameraPermission();
      case 'microphone':
        return this.requestMicrophonePermission();
      case 'geolocation':
        return this.requestGeolocationPermission();
      case 'notifications':
        return this.requestNotificationPermission();
      default:
        throw new Error(`不支持的权限类型: ${permission}`);
    }
  }
  
  // 请求摄像头权限
  async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return { granted: true, stream };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }
  
  // 请求麦克风权限
  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return { granted: true, stream };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }
  
  // 请求地理位置权限
  async requestGeolocationPermission() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ granted: true, position }),
        (error) => resolve({ granted: false, error: error.message })
      );
    });
  }
  
  // 请求通知权限
  async requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      return { granted: permission === 'granted' };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }
}

// 使用最佳实践
const permissionBP = new PermissionBestPractices();

// 注册权限说明
permissionBP.registerPermissionExplanation('camera', 
  '我们需要访问您的摄像头来拍摄个人头像和扫描二维码，这将帮助您更好地使用我们的服务。');

permissionBP.registerPermissionExplanation('geolocation', 
  '我们需要获取您的位置信息来提供附近的服务推荐和基于位置的功能。');

// 注册降级方案
permissionBP.registerFallback('camera', async () => {
  // 显示文件上传选项
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();
  
  return new Promise((resolve) => {
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      resolve({ file, method: 'file_upload' });
    };
  });
});

permissionBP.registerFallback('geolocation', async () => {
  // 显示手动位置选择
  const location = await showLocationPicker();
  return { location, method: 'manual_selection' };
});
```

## 📚 参考资源

### 📖 官方文档
- [Permissions Policy 规范](https://w3c.github.io/webappsec-permissions-policy/)
- [Permissions API 规范](https://w3c.github.io/permissions/)
- [iframe 沙盒规范](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox)

### 🛠️ 实用工具
- [Permissions Policy 测试工具](https://github.com/w3c/webappsec-permissions-policy)
- [CSP 评估器](https://csp-evaluator.withgoogle.com/)
- [权限策略生成器](https://permissions-policy-generator.netlify.app/)

### 📊 浏览器兼容性
- [Can I Use - Permissions Policy](https://caniuse.com/permissions-policy)
- [Can I Use - Permissions API](https://caniuse.com/permissions-api)
- [MDN 兼容性表格](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#browser_compatibility)

### 🔍 安全最佳实践
- [OWASP 安全指南](https://owasp.org/www-project-web-security-testing-guide/)
- [Google 安全最佳实践](https://developers.google.com/web/fundamentals/security)
- [Mozilla 安全指南](https://infosec.mozilla.org/guidelines/web_security)

::: tip 💡 实施建议
权限策略是现代 Web 安全的重要组成部分。建议从最严格的策略开始，然后根据功能需求逐步放宽限制。同时要注意用户体验，在请求权限时提供清晰的说明和优雅的降级方案。
:::
