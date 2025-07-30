---
title: 🛡️ 内容安全策略（CSP）完全指南
description: 深入学习内容安全策略（CSP）的配置与应用，掌握 Web 安全防护技术，包括 XSS 防护、资源控制和安全最佳实践
outline: deep
---

# 🛡️ 内容安全策略（CSP）完全指南

> 内容安全策略（Content Security Policy，CSP）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等。

## 🎯 学习目标

::: tip 📚 核心知识点
- 理解 CSP 的工作原理和安全机制
- 掌握 CSP 策略配置和部署方法
- 学习各种 CSP 指令的使用场景
- 了解 CSP 报告和监控机制
- 掌握 CSP 安全最佳实践
:::

## 🔍 CSP 概述

### 🌟 核心优势

内容安全策略通过指定有效域——即浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除 XSS 攻击所依赖的载体。

#### 📊 安全防护对比

| 攻击类型 | 传统防护 | CSP 防护 |
|----------|----------|----------|
| **XSS 攻击** | 输入过滤 | 源白名单 + 过滤 |
| **数据注入** | 后端验证 | 资源限制 + 验证 |
| **恶意软件** | 反病毒 | 源控制 + 监控 |
| **内容污染** | 人工审核 | 策略限制 + 审核 |

### 🛠️ 配置方式

CSP 提供两种主要配置方式：

#### 1️⃣ HTTP 响应头配置

  ```http
# 基本语法
  Content-Security-Policy: policy

# 示例：所有内容均来自站点的同一个源（不包括其子域名）
  Content-Security-Policy: default-src 'self'

# 复杂策略示例
Content-Security-Policy: default-src 'self' https://api.example.com; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'
  ```

#### 2️⃣ HTML Meta 标签配置

  ```html
<!-- 基本配置 -->
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />

<!-- 脚本安全配置 -->
  <meta
    http-equiv="Content-Security-Policy"
    content="script-src 'self' 'unsafe-inline'" />

<!-- 复合策略配置 -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:" />
```

### 🔧 服务器配置示例

```javascript
// Express.js 配置
const express = require('express');
const helmet = require('helmet');

const app = express();

// 使用 helmet 配置 CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// 手动配置 CSP 头部
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

## 📋 CSP 指令详解

### 🎯 资源类型指令

#### 🔧 核心指令对比

| 指令 | 描述 | 适用资源 | 示例 |
|------|------|----------|------|
| **default-src** | 默认源策略 | 所有未指定的资源 | `default-src 'self'` |
| **script-src** | 脚本源控制 | JavaScript 文件 | `script-src 'self' 'unsafe-inline'` |
| **style-src** | 样式源控制 | CSS 文件 | `style-src 'self' 'unsafe-inline'` |
| **img-src** | 图像源控制 | 图片资源 | `img-src 'self' data: https:` |
| **connect-src** | 连接源控制 | AJAX/WebSocket | `connect-src 'self' https://api.example.com` |
| **font-src** | 字体源控制 | 字体文件 | `font-src 'self' https://fonts.googleapis.com` |
| **object-src** | 对象源控制 | `<object>` 元素 | `object-src 'none'` |
| **media-src** | 媒体源控制 | 音频/视频 | `media-src 'self' https://media.example.com` |
| **frame-src** | 框架源控制 | `<iframe>` 元素 | `frame-src 'self' https://youtube.com` |
| **child-src** | 子资源控制 | Web Workers/框架 | `child-src 'self'` |

### 🛡️ 脚本安全指令

#### 📊 script-src 关键字

| 关键字 | 描述 | 安全等级 | 使用建议 |
|--------|------|----------|----------|
| **'self'** | 同源脚本 | 🟢 高 | 推荐使用 |
| **'unsafe-inline'** | 内联脚本 | 🔴 低 | 避免使用 |
| **'unsafe-eval'** | eval() 函数 | 🔴 低 | 避免使用 |
| **'strict-dynamic'** | 动态脚本 | 🟡 中 | 谨慎使用 |
| **'nonce-xxx'** | 随机数验证 | 🟢 高 | 推荐使用 |
| **'sha256-xxx'** | 哈希验证 | 🟢 高 | 推荐使用 |

#### 🔧 安全脚本配置

```javascript
// 生成 nonce 的中间件
const crypto = require('crypto');

const generateNonce = (req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'`
  );
  
  next();
};

// 在模板中使用 nonce
app.get('/', generateNonce, (req, res) => {
  res.render('index', { nonce: res.locals.nonce });
});
```

```html
<!-- 模板中使用 nonce -->
<script nonce="<%= nonce %>">
  console.log('安全的内联脚本');
</script>

<style nonce="<%= nonce %>">
  body { background: #f0f0f0; }
</style>
```

#### 🔒 哈希验证配置

```javascript
// 计算脚本哈希
const crypto = require('crypto');

const calculateScriptHash = (script) => {
  const hash = crypto.createHash('sha256').update(script).digest('base64');
  return `sha256-${hash}`;
};

// 示例脚本
const inlineScript = `console.log('Hello, World!');`;
const scriptHash = calculateScriptHash(inlineScript);

// 配置 CSP 头部
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' '${scriptHash}'`
  );
  next();
});
```

```html
<!-- 对应的 HTML -->
<script>console.log('Hello, World!');</script>
```

### 🔗 连接控制指令

#### 🌐 connect-src 配置

```javascript
// API 连接控制
const allowedAPIs = [
  'https://api.example.com',
  'https://analytics.example.com',
  'wss://websocket.example.com'
];

const cspPolicy = `
  default-src 'self';
  connect-src 'self' ${allowedAPIs.join(' ')};
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'
`;

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', cspPolicy.replace(/\s+/g, ' '));
  next();
});
```

#### 📊 连接类型控制

| 连接类型 | 控制指令 | 示例配置 |
|----------|----------|----------|
| **AJAX 请求** | connect-src | `connect-src 'self' https://api.example.com` |
| **WebSocket** | connect-src | `connect-src 'self' wss://ws.example.com` |
| **EventSource** | connect-src | `connect-src 'self' https://events.example.com` |
| **Fetch API** | connect-src | `connect-src 'self' https://cdn.example.com` |

### 🎨 样式控制指令

#### 🔧 style-src 配置

```javascript
// 样式安全配置
const styleSources = [
  "'self'",
  "'unsafe-inline'",  // 仅在必要时使用
  "https://fonts.googleapis.com",
  "https://cdn.example.com"
];

const cspPolicy = `
  default-src 'self';
  style-src ${styleSources.join(' ')};
  font-src 'self' https://fonts.gstatic.com;
`;
```

#### 🛡️ 安全样式实践

```html
<!-- 使用 nonce 的安全样式 -->
<style nonce="abc123">
  .secure-style {
    color: #333;
    font-family: Arial, sans-serif;
  }
</style>

<!-- 外部样式表 -->
<link rel="stylesheet" href="/styles/main.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
```

## 📊 CSP 策略示例

### 🔧 基础配置

```javascript
// 基础安全配置
const basicCSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  }
};
```

### 🚀 现代应用配置

```javascript
// 现代 Web 应用配置
const modernCSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",  // 开发环境，生产环境使用 nonce
      "https://cdn.jsdelivr.net",
      "https://unpkg.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    connectSrc: [
      "'self'",
      "https://api.example.com",
      "https://analytics.google.com",
      "wss://websocket.example.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdn.jsdelivr.net"
    ],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'", "https://media.example.com"],
    frameSrc: [
      "'self'",
      "https://www.youtube.com",
      "https://www.google.com"
    ],
    workerSrc: ["'self'", "blob:"],
    childSrc: ["'self'"],
    frameAncestors: ["'self'"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    manifestSrc: ["'self'"]
  }
};
```

### 🔒 严格安全配置

```javascript
// 高安全等级配置
const strictCSP = {
  directives: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'", "'strict-dynamic'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    upgradeInsecureRequests: []
  }
};
```

## 📈 CSP 报告和监控

### 🔍 违规报告配置

#### 📊 仅报告模式

```javascript
// 仅报告模式配置
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; report-uri /csp-report"
  );
  next();
});

// 处理 CSP 违规报告
app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body;
  
  console.log('CSP 违规报告:', JSON.stringify(report, null, 2));
  
  // 记录到日志系统
  logger.warn('CSP 违规', {
    blockedUri: report['csp-report']['blocked-uri'],
    violatedDirective: report['csp-report']['violated-directive'],
    originalPolicy: report['csp-report']['original-policy'],
    documentUri: report['csp-report']['document-uri']
  });
  
  res.status(200).end();
});
```

#### 📋 报告分析

```javascript
// CSP 违规报告分析
class CSPReportAnalyzer {
  constructor() {
    this.violations = [];
    this.stats = {
      totalViolations: 0,
      blockedResources: new Map(),
      violatedDirectives: new Map(),
      topViolations: []
    };
  }

  analyzeReport(report) {
    const violation = report['csp-report'];
    this.violations.push({
      ...violation,
      timestamp: new Date().toISOString()
    });

    this.updateStats(violation);
    this.generateAlerts(violation);
  }

  updateStats(violation) {
    this.stats.totalViolations++;
    
    // 统计被阻止的资源
    const blockedUri = violation['blocked-uri'];
    const count = this.stats.blockedResources.get(blockedUri) || 0;
    this.stats.blockedResources.set(blockedUri, count + 1);
    
    // 统计违规指令
    const directive = violation['violated-directive'];
    const directiveCount = this.stats.violatedDirectives.get(directive) || 0;
    this.stats.violatedDirectives.set(directive, directiveCount + 1);
    
    // 更新顶级违规
    this.updateTopViolations();
  }

  updateTopViolations() {
    this.stats.topViolations = Array.from(this.stats.blockedResources.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([uri, count]) => ({ uri, count }));
  }

  generateAlerts(violation) {
    const threshold = 10;
    const blockedUri = violation['blocked-uri'];
    const count = this.stats.blockedResources.get(blockedUri);
    
    if (count === threshold) {
      console.warn(`🚨 CSP 告警: 资源 ${blockedUri} 被阻止 ${count} 次`);
      
      // 发送告警通知
      this.sendAlert({
        type: 'csp_violation_threshold',
        resource: blockedUri,
        count: count,
        directive: violation['violated-directive']
      });
    }
  }

  sendAlert(alert) {
    // 发送到监控系统
    // 这里可以集成各种通知系统
    console.log('发送 CSP 告警:', alert);
  }

  getViolationReport() {
    return {
      summary: this.stats,
      recentViolations: this.violations.slice(-20),
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    // 分析常见违规并提供建议
    this.stats.topViolations.forEach(violation => {
      if (violation.uri.includes('inline')) {
        recommendations.push({
          type: 'inline_script',
          message: '考虑使用 nonce 或 hash 替代 unsafe-inline',
          resource: violation.uri
        });
      }
      
      if (violation.uri.includes('eval')) {
        recommendations.push({
          type: 'eval_usage',
          message: '避免使用 eval() 函数，考虑替代方案',
          resource: violation.uri
        });
      }
    });
    
    return recommendations;
  }
}

// 使用报告分析器
const analyzer = new CSPReportAnalyzer();

app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  analyzer.analyzeReport(req.body);
  res.status(200).end();
});

// 获取分析报告
app.get('/csp-analysis', (req, res) => {
  res.json(analyzer.getViolationReport());
});
```

### 📊 典型违规报告

```json
{
  "csp-report": {
    "blocked-uri": "http://example.com/css/style.css",
    "disposition": "report",
    "document-uri": "http://example.com/signup.html",
    "effective-directive": "style-src-elem",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports",
    "referrer": "",
    "status-code": 200,
    "violated-directive": "style-src-elem"
  }
}
```

## 🔒 子资源完整性（SRI）

### 🛡️ SRI 概述

尽管 CSP 是确保资源仅从可信来源加载的强大工具，但这些资源仍有可能被篡改。子资源完整性（Subresource Integrity, SRI）为这种风险提供了保护。

### 🔧 SRI 实现

```html
<!-- 使用 SRI 的脚本标签 -->
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>

<!-- 使用 SRI 的样式表 -->
<link 
  rel="stylesheet" 
  href="https://cdn.example.com/styles.css"
  integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
  crossorigin="anonymous">
```

### 🔧 SRI 哈希生成

```javascript
// 生成 SRI 哈希
const crypto = require('crypto');
const fs = require('fs');

const generateSRIHash = (filePath, algorithm = 'sha384') => {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash(algorithm).update(content).digest('base64');
  return `${algorithm}-${hash}`;
};

// 示例用法
const scriptHash = generateSRIHash('./public/js/main.js');
const styleHash = generateSRIHash('./public/css/style.css');

console.log('脚本 SRI 哈希:', scriptHash);
console.log('样式 SRI 哈希:', styleHash);
```

### 🔄 CSP + SRI 结合使用

```javascript
// 结合 CSP 和 SRI 的配置
const securityHeaders = (req, res, next) => {
  // CSP 配置
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' https://cdn.example.com; require-sri-for script style"
  );
  
  // 强制 SRI 检查
  res.setHeader('Require-SRI-For', 'script, style');
  
  next();
};

app.use(securityHeaders);
```

## 🚫 X-Frame-Options 头部

### 🔒 点击劫持防护

X-Frame-Options 是一个 HTTP 响应头，控制页面是否可以嵌入其他源页面中。

#### 📊 配置选项

| 选项 | 描述 | 安全等级 | 使用场景 |
|------|------|----------|----------|
| **DENY** | 完全阻止页面嵌入 | 🟢 高 | 敏感页面 |
| **SAMEORIGIN** | 仅允许同源嵌入 | 🟡 中 | 一般页面 |
| **ALLOW-FROM** | 允许特定源嵌入 | 🟡 中 | 合作伙伴 |

#### 🔧 配置示例

```javascript
// X-Frame-Options 配置
const frameOptions = {
  deny: (req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  },
  
  sameOrigin: (req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  },
  
  allowFrom: (domain) => (req, res, next) => {
    res.setHeader('X-Frame-Options', `ALLOW-FROM ${domain}`);
    next();
  }
};

// 应用配置
app.use('/admin', frameOptions.deny);
app.use('/dashboard', frameOptions.sameOrigin);
app.use('/widget', frameOptions.allowFrom('https://partner.example.com'));
```

### 🔧 现代替代方案

```javascript
// 使用 CSP 的 frame-ancestors 替代 X-Frame-Options
const modernFrameProtection = (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://trusted.example.com"
  );
  next();
};
```

## 🧹 Clear-Site-Data 头部

### 🔄 数据清理

Clear-Site-Data 头部允许网站轻松清除与其相关的浏览数据，包括 cookies、存储和缓存。

#### 📊 清理类型

| 类型 | 描述 | 使用场景 |
|------|------|----------|
| **"cache"** | 清除缓存 | 内容更新 |
| **"cookies"** | 清除 Cookie | 用户登出 |
| **"storage"** | 清除存储 | 数据重置 |
| **"executionContexts"** | 重新加载页面 | 状态重置 |
| **"*"** | 清除所有 | 完全重置 |

#### 🔧 实现示例

```javascript
// 用户登出时清除数据
app.post('/logout', (req, res) => {
  // 清除所有客户端数据
  res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage", "executionContexts"');
  
  // 清除会话
  req.session.destroy();
  
  res.json({ message: '已安全登出' });
});

// 数据泄露响应
app.post('/security-reset', (req, res) => {
  // 清除所有数据
  res.setHeader('Clear-Site-Data', '"*"');
  
  res.json({ message: '已清除所有数据' });
});

// 缓存更新
app.post('/clear-cache', (req, res) => {
  // 仅清除缓存
  res.setHeader('Clear-Site-Data', '"cache"');
  
  res.json({ message: '缓存已清除' });
});
```

## 🛠️ 实际部署示例

### 🔧 完整安全配置

```javascript
// 完整的安全中间件
const securityMiddleware = (options = {}) => {
  const {
    environment = 'production',
    reportUri = '/csp-report',
    allowedDomains = [],
    enableSRI = true
  } = options;

  return (req, res, next) => {
    // 基础 CSP 配置
    let cspDirectives = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: []
    };

    // 开发环境配置
    if (environment === 'development') {
      cspDirectives.scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
      cspDirectives.styleSrc.push("'unsafe-inline'");
    }

    // 添加允许的域名
    if (allowedDomains.length > 0) {
      cspDirectives.scriptSrc.push(...allowedDomains);
      cspDirectives.styleSrc.push(...allowedDomains);
    }

    // 启用 SRI
    if (enableSRI) {
      cspDirectives.requireSriFor = ['script', 'style'];
    }

    // 添加报告 URI
    if (reportUri) {
      cspDirectives.reportUri = [reportUri];
    }

    // 构建 CSP 字符串
    const cspString = Object.entries(cspDirectives)
      .map(([key, value]) => {
        const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (Array.isArray(value)) {
          return value.length > 0 ? `${directive} ${value.join(' ')}` : directive;
        }
        return `${directive} ${value}`;
      })
      .join('; ');

    // 设置安全头部
    res.setHeader('Content-Security-Policy', cspString);
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    next();
  };
};

// 使用安全中间件
app.use(securityMiddleware({
  environment: process.env.NODE_ENV,
  reportUri: '/csp-report',
  allowedDomains: [
    'https://cdn.example.com',
    'https://fonts.googleapis.com'
  ],
  enableSRI: true
}));
```

### 🔍 动态策略生成

```javascript
// 动态 CSP 策略生成器
class CSPPolicyBuilder {
  constructor() {
    this.directives = new Map();
    this.reportOnly = false;
  }

  setDefaultSrc(sources) {
    this.directives.set('default-src', sources);
    return this;
  }

  addScriptSrc(sources) {
    this.mergeDirective('script-src', sources);
    return this;
  }

  addStyleSrc(sources) {
    this.mergeDirective('style-src', sources);
    return this;
  }

  addImageSrc(sources) {
    this.mergeDirective('img-src', sources);
    return this;
  }

  addConnectSrc(sources) {
    this.mergeDirective('connect-src', sources);
    return this;
  }

  addNonce(nonce) {
    this.mergeDirective('script-src', [`'nonce-${nonce}'`]);
    this.mergeDirective('style-src', [`'nonce-${nonce}'`]);
    return this;
  }

  enableReportOnly() {
    this.reportOnly = true;
    return this;
  }

  setReportUri(uri) {
    this.directives.set('report-uri', [uri]);
    return this;
  }

  mergeDirective(directive, sources) {
    const existing = this.directives.get(directive) || [];
    this.directives.set(directive, [...existing, ...sources]);
  }

  build() {
    const policy = Array.from(this.directives.entries())
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');

    return {
      policy,
      header: this.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'
    };
  }
}

// 使用动态策略生成器
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  const { policy, header } = new CSPPolicyBuilder()
    .setDefaultSrc(["'self'"])
    .addScriptSrc(["'self'", "https://cdn.example.com"])
    .addStyleSrc(["'self'", "https://fonts.googleapis.com"])
    .addImageSrc(["'self'", "data:", "https:"])
    .addConnectSrc(["'self'", "https://api.example.com"])
    .addNonce(nonce)
    .setReportUri('/csp-report')
    .build();

  res.setHeader(header, policy);
  next();
});
```

## 📚 最佳实践

### ✅ 推荐做法

#### 🔧 渐进式部署

```javascript
// 阶段 1: 仅报告模式
const stage1CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; report-uri /csp-report";

// 阶段 2: 移除 unsafe-inline
const stage2CSP = "default-src 'self'; script-src 'self'; report-uri /csp-report";

// 阶段 3: 强制模式
const stage3CSP = "default-src 'self'; script-src 'self'";

// 动态切换策略
const getCSPPolicy = (stage) => {
  switch(stage) {
    case 1: return stage1CSP;
    case 2: return stage2CSP;
    case 3: return stage3CSP;
    default: return stage1CSP;
  }
};
```

#### 🛡️ 安全检查清单

| 检查项 | 描述 | 优先级 |
|--------|------|--------|
| **移除 unsafe-inline** | 避免内联脚本和样式 | 🔴 高 |
| **移除 unsafe-eval** | 避免 eval() 使用 | 🔴 高 |
| **启用 SRI** | 验证外部资源完整性 | 🟡 中 |
| **配置报告** | 监控违规行为 | 🟡 中 |
| **定期审查** | 更新策略配置 | 🟢 低 |

### ❌ 避免的陷阱

#### 🚨 常见错误

```javascript
// ❌ 错误：过于宽松的策略
const badCSP = "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'";

// ✅ 正确：严格的策略
const goodCSP = "default-src 'self'; script-src 'self' 'nonce-abc123'";

// ❌ 错误：忽略报告
// 没有配置报告 URI 和处理机制

// ✅ 正确：完整的报告系统
const withReporting = `
  default-src 'self'; 
  script-src 'self'; 
  report-uri /csp-report;
  report-to csp-endpoint
`;
```

## 🔍 故障排除

### 🛠️ 常见问题解决

#### ❓ 内联脚本被阻止

```javascript
// 问题：内联脚本被 CSP 阻止
// 解决方案 1：使用 nonce
const nonce = crypto.randomBytes(16).toString('base64');
res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);

// 解决方案 2：使用 hash
const scriptContent = "console.log('Hello');";
const hash = crypto.createHash('sha256').update(scriptContent).digest('base64');
res.setHeader('Content-Security-Policy', `script-src 'self' 'sha256-${hash}'`);
```

#### ❓ 第三方资源加载失败

```javascript
// 问题：第三方 CDN 资源被阻止
// 解决方案：添加到白名单
const allowedCDNs = [
  'https://cdn.jsdelivr.net',
  'https://unpkg.com',
  'https://cdnjs.cloudflare.com'
];

const csp = `
  default-src 'self';
  script-src 'self' ${allowedCDNs.join(' ')};
  style-src 'self' ${allowedCDNs.join(' ')};
`;
```

### 📊 调试工具

```javascript
// CSP 调试工具
const cspDebugger = {
  logViolation: (report) => {
    console.group('🚨 CSP 违规报告');
    console.log('违规 URI:', report['csp-report']['blocked-uri']);
    console.log('违规指令:', report['csp-report']['violated-directive']);
    console.log('当前策略:', report['csp-report']['original-policy']);
    console.log('文档 URI:', report['csp-report']['document-uri']);
    console.groupEnd();
  },

  suggestFix: (report) => {
    const violation = report['csp-report'];
    const directive = violation['violated-directive'];
    const blockedUri = violation['blocked-uri'];

    if (blockedUri === 'inline') {
      console.log('💡 建议：使用 nonce 或 hash 替代内联脚本');
    } else if (blockedUri === 'eval') {
      console.log('💡 建议：避免使用 eval()，考虑使用 JSON.parse()');
    } else {
      console.log(`💡 建议：将 ${blockedUri} 添加到 ${directive} 白名单`);
    }
  }
};
```

## 📚 参考资源

### 📖 官方文档
- [CSP Level 3 规范](https://w3c.github.io/webappsec-csp/)
- [MDN CSP 指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP CSP 最佳实践](https://owasp.org/www-project-cheat-sheets/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

### 🛠️ 实用工具
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Builder](https://report-uri.com/home/generate)
- [Security Headers Scanner](https://securityheaders.com/)

### 📊 监控服务
- [Report URI](https://report-uri.com/)
- [CSP Monitor](https://cspmonitor.io/)
- [Sentry CSP 监控](https://sentry.io/)

::: tip 💡 实施建议
CSP 是一个强大的安全工具，但需要谨慎配置。建议从报告模式开始，逐步收紧策略，确保不影响正常功能的同时提供最佳的安全防护。
:::
