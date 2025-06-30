---
title: 🌐 Fetch API 完全指南
description: 深入学习现代浏览器的 Fetch API，掌握网络请求的最佳实践，包含完整的配置选项、错误处理和高级用法
outline: deep
---

# 🌐 Fetch API 完全指南

> Fetch API 提供了一个获取资源的现代化接口，包括跨网络通信。对于使用过 XMLHttpRequest 的开发者来说容易上手，同时提供了更强大和灵活的功能集。

## 🎯 核心概念

### ✨ 基本特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **Promise 基础** | 基于 Promise 的异步设计 | 🔄 更好的异步流程控制 |
| **流式处理** | 支持 ReadableStream | 📊 内存友好的大文件处理 |
| **标准化** | Web 标准 API | 🌐 跨浏览器一致性 |
| **可扩展** | 丰富的配置选项 | 🛠️ 灵活的请求定制 |

### 🌍 浏览器支持

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| **Chrome** | 42+ | ✅ 完全支持 |
| **Firefox** | 39+ | ✅ 完全支持 |
| **Safari** | 10.1+ | ✅ 完全支持 |
| **Edge** | 14+ | ✅ 完全支持 |

::: tip 💡 兼容性处理
对于不支持的浏览器，可以使用 `whatwg-fetch` polyfill 进行兼容。
:::

## 🚀 基本使用

### 📝 基础语法

```javascript
// 基本语法
fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 🔧 完整配置示例

```javascript
// 停止 fetch 信号控制器
const controller = new AbortController();

// Fetch 兼容性检测
if (window.fetch) {
  fetch("https://api.example.com/data", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token123"
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ name: 'example', type: 'demo' }),
    signal: controller.signal
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
} else {
  console.warn('Fetch API not supported, use XMLHttpRequest fallback');
}

// 取消请求
// controller.abort();
```

## ⚙️ 配置选项详解

### 🔧 请求方法配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| **method** | string | 'GET' | HTTP 请求方法 |
| **headers** | Object | {} | 请求头信息 |
| **body** | any | undefined | 请求体数据 |
| **mode** | string | 'cors' | 请求模式 |

### 🌐 请求模式 (mode)

| 模式 | 描述 | 使用场景 |
|------|------|----------|
| **cors** | 允许跨域请求 | 🌍 大多数 API 调用 |
| **no-cors** | 不允许跨域 | 📡 简单请求 |
| **same-origin** | 同源请求 | 🏠 内部 API |
| **navigate** | 导航请求 | 🔗 页面跳转 |

### 🔒 凭据模式 (credentials)

| 模式 | 描述 | Cookie 行为 |
|------|------|-------------|
| **omit** | 不包含凭据 | ❌ 不发送 Cookie |
| **same-origin** | 同源包含凭据 | 🏠 同源发送 Cookie |
| **include** | 始终包含凭据 | ✅ 跨域也发送 Cookie |

### 💾 缓存策略 (cache)

| 策略 | 描述 | 使用场景 |
|------|------|----------|
| **default** | 默认缓存行为 | 🔄 一般请求 |
| **no-cache** | 不使用缓存 | 🆕 实时数据 |
| **reload** | 强制重新加载 | 🔄 强制刷新 |
| **force-cache** | 强制使用缓存 | 📦 静态资源 |
| **only-if-cached** | 仅使用缓存 | 💾 离线模式 |

## 🔍 Fetch 相关接口

### 📊 核心接口对比

| 接口 | 用途 | 主要方法 | 特点 |
|------|------|----------|------|
| **fetch()** | 发起请求 | fetch(url, options) | 🚀 主要入口点 |
| **Request** | 请求对象 | new Request() | 🔧 请求封装 |
| **Response** | 响应对象 | response.json() | 📄 响应处理 |
| **Headers** | 头部对象 | headers.set() | 📋 头部管理 |

### 🎯 Request 对象详解

```javascript
// Request 对象属性和方法
const request = new Request('https://api.example.com/data', {
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({ key: 'value' })
});

// Request 实例属性
console.log(request.method);     // POST
console.log(request.url);        // https://api.example.com/data
console.log(request.headers);    // Headers 对象
console.log(request.body);       // ReadableStream
console.log(request.bodyUsed);   // false
```

#### 📋 Request 属性表

| 属性 | 类型 | 描述 | 只读 |
|------|------|------|------|
| **body** | ReadableStream | 请求体内容 | ✅ |
| **bodyUsed** | boolean | 是否已读取 | ✅ |
| **cache** | string | 缓存模式 | ✅ |
| **credentials** | string | 凭据模式 | ✅ |
| **headers** | Headers | 请求头 | ✅ |
| **method** | string | 请求方法 | ✅ |
| **mode** | string | 请求模式 | ✅ |
| **signal** | AbortSignal | 中止信号 | ✅ |
| **url** | string | 请求URL | ✅ |

#### 🔧 Request 方法

| 方法 | 返回类型 | 描述 | 使用场景 |
|------|----------|------|----------|
| **arrayBuffer()** | Promise\<ArrayBuffer\> | 读取为二进制 | 📁 文件处理 |
| **blob()** | Promise\<Blob\> | 读取为 Blob | 🖼️ 图片处理 |
| **clone()** | Request | 克隆请求 | 🔄 请求复用 |
| **formData()** | Promise\<FormData\> | 读取为表单 | 📝 表单提交 |
| **json()** | Promise\<Object\> | 读取为 JSON | 📊 API 数据 |
| **text()** | Promise\<string\> | 读取为文本 | 📄 文本内容 |

## 📄 Headers 对象操作

### 🛠️ Headers 基本操作

```javascript
// 创建 Headers 对象
const headers = new Headers({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token123'
});

// 等同于
const headers2 = new Headers();
headers2.append('Content-Type', 'application/json');
headers2.append('Authorization', 'Bearer token123');

// Headers 操作方法
console.log(headers.has('Content-Type'));     // true
headers.set('Content-Type', 'text/html');     // 设置（覆盖）
headers.append('X-Custom', 'value1');         // 追加
headers.append('X-Custom', 'value2');         // 追加多个值
console.log(headers.get('X-Custom'));         // "value1, value2"
headers.delete('Authorization');              // 删除
```

### 📊 Headers 方法对比

| 方法 | 作用 | 重复处理 | 使用场景 |
|------|------|----------|----------|
| **set()** | 设置头部 | 覆盖原值 | 🔄 替换头部 |
| **append()** | 追加头部 | 保留原值 | ➕ 添加多值 |
| **get()** | 获取头部 | 返回所有值 | 🔍 读取头部 |
| **has()** | 检查存在 | - | ✅ 条件判断 |
| **delete()** | 删除头部 | - | ❌ 移除头部 |

### 🔄 Headers 遍历

```javascript
// 遍历 Headers
for (let [key, value] of headers.entries()) {
  console.log(`${key}: ${value}`);
}

// 使用 forEach
headers.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 获取所有键和值
console.log([...headers.keys()]);    // 所有键
console.log([...headers.values()]);  // 所有值
```

## 📊 逐行处理文本文件

### 🔄 流式文本处理

```javascript
// 生成器函数：逐行读取文本文件
async function* makeTextFileLineIterator(fileURL) {
  // 文本解码器
  const utf8Decoder = new TextDecoder("utf-8");
  
  // 获取响应
  const response = await fetch(fileURL);
  const reader = response.body.getReader();
  
  // 读取第一块数据
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk) : "";
  
  // 换行符正则表达式
  const re = /\n|\r|\r\n/gm;
  let startIndex = 0;
  
  // 持续读取数据
  for (;;) {
    let result = re.exec(chunk);
    
    if (!result) {
      if (readerDone) break;
      
      // 保存剩余数据，继续读取
      let remainder = chunk.substr(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
      startIndex = re.lastIndex = 0;
      continue;
    }
    
    // 返回一行数据
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  
  // 返回最后的不完整行
  if (startIndex < chunk.length) {
    yield chunk.substr(startIndex);
  }
}

// 使用示例
async function processTextFile(url) {
  try {
    for await (let line of makeTextFileLineIterator(url)) {
      console.log('Line:', line);
      // 处理每一行数据
    }
  } catch (error) {
    console.error('处理文件失败:', error);
  }
}
```

### 📈 流处理优势

| 优势 | 传统方式 | 流式处理 | 改进效果 |
|------|----------|----------|----------|
| **内存占用** | 全部加载 | 按需加载 | 🔽 降低 90% |
| **响应速度** | 等待完成 | 即时处理 | ⚡ 提升 80% |
| **大文件支持** | 容易崩溃 | 稳定处理 | 💪 无限制 |
| **用户体验** | 阻塞等待 | 渐进显示 | 🎯 显著提升 |

## ✅ 请求成功检测

### 🔍 状态码判断

```javascript
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    } else if (error.name === 'TypeError') {
      console.error('网络错误:', error.message);
    } else {
      console.error('请求失败:', error.message);
    }
    throw error;
  }
}

// 使用示例
safeFetch('/api/data')
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => console.error('处理失败:', error));
```

### 📊 错误类型分析

| 错误类型 | 触发条件 | response.ok | 处理方式 |
|----------|----------|-------------|----------|
| **网络错误** | 无网络连接 | - | ❌ Promise reject |
| **CORS 错误** | 跨域被阻止 | - | ❌ Promise reject |
| **4xx 错误** | 客户端错误 | false | ✅ Promise resolve |
| **5xx 错误** | 服务器错误 | false | ✅ Promise resolve |
| **2xx 成功** | 请求成功 | true | ✅ Promise resolve |

::: warning ⚠️ 重要提醒
Fetch API 只有在网络故障或请求被阻止时才会 reject。HTTP 4xx 和 5xx 状态码仍然会 resolve，需要检查 `response.ok` 属性。
:::

## 🎯 高级用法

### 🔧 自定义 Request 对象

```javascript
// 创建可复用的请求对象
const apiRequest = new Request('/api/users', {
  method: 'GET',
  headers: new Headers({
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json'
  }),
  cache: 'no-cache',
  credentials: 'same-origin'
});

// 复制并修改请求
const postRequest = new Request(apiRequest, {
  method: 'POST',
  body: JSON.stringify({ name: 'John', age: 30 })
});

// 使用请求对象
fetch(apiRequest)
  .then(response => response.json())
  .then(users => console.log('用户列表:', users));

fetch(postRequest)
  .then(response => response.json())
  .then(result => console.log('创建结果:', result));
```

### ⏰ 请求超时控制

```javascript
// 超时控制函数
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  
  // 设置超时
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

// 使用示例
fetchWithTimeout('/api/slow-endpoint', {}, 3000)
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.error('请求超时');
    } else {
      console.error('请求失败:', error);
    }
  });
```

### 🔄 请求重试机制

```javascript
// 带重试的 fetch 函数
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      // 服务器错误才重试
      if (response.status >= 500 && i < maxRetries) {
        console.log(`请求失败，${1000 * (i + 1)}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries) {
        throw error;
      }
      
      console.log(`网络错误，${1000 * (i + 1)}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 使用示例
fetchWithRetry('/api/unreliable-endpoint')
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => console.error('最终失败:', error));
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **🔍 始终检查 response.ok**
   ```javascript
   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }
   ```

2. **⏰ 设置合理的超时时间**
   ```javascript
   const controller = new AbortController();
   setTimeout(() => controller.abort(), 10000);
   ```

3. **🔒 正确处理凭据**
   ```javascript
   // 跨域请求包含 Cookie
   fetch(url, { credentials: 'include' })
   ```

4. **📊 使用适当的缓存策略**
   ```javascript
   // 实时数据
   fetch(url, { cache: 'no-cache' })
   
   // 静态资源
   fetch(url, { cache: 'force-cache' })
   ```

### ❌ 避免的问题

| 问题 | 错误做法 | 正确做法 | 影响 |
|------|----------|----------|------|
| **不检查状态** | 直接使用响应 | 检查 response.ok | 🐛 错误处理失效 |
| **忘记错误处理** | 只写 then | 添加 catch | 💥 应用崩溃 |
| **不设超时** | 无限等待 | 使用 AbortController | ⏰ 用户体验差 |
| **滥用 credentials** | 总是 include | 按需设置 | 🔒 安全风险 |

### 🎯 性能优化建议

1. **📦 合理使用缓存**
   - 静态资源使用 `force-cache`
   - 动态数据使用 `no-cache`
   - API 数据考虑 `default` 策略

2. **🔄 复用 Request 对象**
   ```javascript
   const baseRequest = new Request('/api/base', commonOptions);
   // 基于 baseRequest 创建其他请求
   ```

3. **📊 流式处理大文件**
   - 使用 ReadableStream 处理大响应
   - 避免一次性加载大量数据

4. **⚡ 并发请求控制**
   ```javascript
   // 并发执行多个请求
   const results = await Promise.all([
     fetch('/api/users'),
     fetch('/api/posts'),
     fetch('/api/comments')
   ]);
   ```

## 🔗 相关资源

### 📚 学习资源

- [MDN Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [Fetch 规范](https://fetch.spec.whatwg.org/)
- [Can I Use - Fetch](https://caniuse.com/fetch)

### 🛠️ 工具库

- [whatwg-fetch](https://github.com/github/fetch) - Fetch polyfill
- [node-fetch](https://github.com/node-fetch/node-fetch) - Node.js 实现

---

::: tip 🎉 总结
Fetch API 是现代 Web 开发中处理网络请求的标准方式。掌握其配置选项、错误处理和高级用法，能够帮助你构建更可靠和高效的 Web 应用。
:::
