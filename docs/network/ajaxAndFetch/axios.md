---
title: 🚀 Axios HTTP 客户端完全指南
description: 深入学习 Axios HTTP 客户端库，掌握 Promise 基础的网络请求，包含完整的配置选项、拦截器、错误处理等高级用法
outline: deep
---

# 🚀 Axios HTTP 客户端完全指南

> Axios 是一个基于 Promise 的 HTTP 网络请求库，作用于 Node.js 和浏览器中。在服务端使用原生 Node.js http 模块，在客户端使用 XMLHttpRequests。

::: info 📚 官方文档
[Axios 官方文档](https://axios-http.com/zh/docs/intro)
:::

## 🎯 核心特性

### ✨ 主要优势

| 特性 | 描述 | 优势 |
|------|------|------|
| **Promise 支持** | 基于 Promise 的异步请求 | 🔄 更好的异步流程控制 |
| **请求/响应拦截** | 拦截器机制 | 🛡️ 统一处理认证和错误 |
| **请求取消** | 支持取消请求 | ⏹️ 避免不必要的网络开销 |
| **自动转换** | JSON 数据自动转换 | 🔄 简化数据处理 |
| **客户端防护** | XSRF 防护 | 🔒 提升安全性 |
| **宽泛兼容** | 浏览器和 Node.js | 🌐 跨平台使用 |

### 🌍 兼容性支持

| 环境 | 支持版本 | 实现方式 |
|------|----------|----------|
| **浏览器** | 现代浏览器 | XMLHttpRequest |
| **Node.js** | 8.0+ | 原生 http 模块 |
| **IE** | IE11+ | XMLHttpRequest |

## 📋 请求方式别名

### 🔧 所有请求方法

```javascript
// 基础方法
axios(config)
axios.request(config)

// GET 系列方法
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])

// POST 系列方法
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])

// 表单提交方法（content-type 默认为 multipart/form-data）
axios.postForm(url[, data[, config]])
axios.putForm(url[, data[, config]])
axios.patchForm(url[, data[, config]])
```

### 📊 方法对比表

| 方法 | 用途 | 是否有请求体 | 常用场景 |
|------|------|-------------|----------|
| **GET** | 获取数据 | ❌ | 📖 数据查询 |
| **POST** | 创建数据 | ✅ | ➕ 新增记录 |
| **PUT** | 更新数据 | ✅ | 🔄 完整更新 |
| **PATCH** | 部分更新 | ✅ | ✏️ 部分修改 |
| **DELETE** | 删除数据 | ❌ | 🗑️ 删除记录 |
| **HEAD** | 获取头部 | ❌ | 🔍 检查资源 |
| **OPTIONS** | 获取选项 | ❌ | 🛠️ 预检请求 |

## ⚙️ 请求配置详解

### 🔧 完整配置选项

```javascript
// 创建取消控制器
const controller = new AbortController();

const config = {
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
  baseURL: 'https://api.example.com/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用于 'PUT', 'POST', 'PATCH' 和 'DELETE'
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理
    return data;
  }],

  // 自定义请求头
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': 'Bearer token123'
  },

  // `params` 是与请求一起发送的 URL 参数
  params: {
    ID: 12345,
    category: 'electronics'
  },

  // `paramsSerializer` 是可选方法，主要用于序列化 `params`
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求体被发送的数据
  // 仅适用 'PUT', 'POST', 'DELETE' 和 'PATCH' 请求方法
  data: {
    firstName: 'John',
    lastName: 'Doe'
  },
  
  // 发送请求体数据的可选语法
  // data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 指定请求超时的毫秒数
  timeout: 5000,

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // 默认值

  // `adapter` 允许自定义处理请求，这使测试更加容易
  adapter: function (config) {
    return new Promise(function (resolve, reject) {
      // 自定义请求逻辑
    });
  },

  // `auth` HTTP Basic Auth
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示浏览器将要响应的数据类型
  responseType: 'json', // 默认值
  // 选项: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'

  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  responseEncoding: 'utf8', // 默认值

  // `xsrfCookieName` 是 xsrf token 的值，被用作 cookie 的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认值

  // `xsrfHeaderName` 是带有 xsrf token 值的http 请求头名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值

  // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    console.log('Upload progress:', progressEvent.loaded / progressEvent.total);
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    console.log('Download progress:', progressEvent.loaded / progressEvent.total);
  },

  // `maxContentLength` 定义了node.js中允许的HTTP响应内容的最大字节数
  maxContentLength: 2000,

  // `maxBodyLength`（仅Node）定义允许的http请求内容的最大字节数
  maxBodyLength: 2000,

  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // `maxRedirects` 定义了在node.js中要遵循的最大重定向数
  maxRedirects: 5, // 默认值

  // `socketPath` 定义了在node.js中使用的UNIX套接字
  socketPath: null, // 默认值

  // `httpAgent` 和 `httpsAgent` 定义了在node.js中执行http和https请求时使用的自定义代理
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` 定义了代理服务器的主机名，端口和协议
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // 新版本取消请求
  signal: controller.signal,

  // `decompress` 指示是否应该自动解压缩响应体
  decompress: true // 默认值
};

// 使用配置
axios(config);

// 取消请求
controller.abort();
```

### 📊 配置选项分类

#### 🌐 请求相关配置

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| **url** | string | - | 请求的服务器 URL |
| **method** | string | 'get' | 请求方法 |
| **baseURL** | string | - | 基础 URL |
| **headers** | Object | {} | 自定义请求头 |
| **params** | Object | - | URL 参数 |
| **data** | any | - | 请求体数据 |

#### ⏱️ 超时和重试配置

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| **timeout** | number | 0 | 请求超时时间（毫秒） |
| **maxRedirects** | number | 5 | 最大重定向次数 |
| **signal** | AbortSignal | - | 取消信号 |

#### 🔒 安全相关配置

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| **withCredentials** | boolean | false | 跨域请求是否携带凭证 |
| **auth** | Object | - | HTTP Basic 认证 |
| **xsrfCookieName** | string | 'XSRF-TOKEN' | XSRF token cookie 名称 |
| **xsrfHeaderName** | string | 'X-XSRF-TOKEN' | XSRF token 请求头名称 |

## 📄 响应结构详解

### 🔍 响应对象结构

```javascript
// 响应对象包含以下信息
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `config` 是 `axios` 请求的配置信息
  config: {},

  // `request` 是生成此响应的请求
  // 在node.js中它是最后一个ClientRequest实例 (in redirects)，
  // 在浏览器中则是 XMLHttpRequest 实例
  request: {}
}
```

### 📊 响应状态码处理

| 状态码范围 | 含义 | 处理方式 | 示例 |
|------------|------|----------|------|
| **2xx** | 成功 | ✅ resolve | 200, 201, 204 |
| **3xx** | 重定向 | 🔄 自动处理 | 301, 302, 304 |
| **4xx** | 客户端错误 | ❌ reject | 400, 401, 404 |
| **5xx** | 服务器错误 | ❌ reject | 500, 502, 503 |

### 🎯 响应数据处理

```javascript
// 处理不同类型的响应数据
axios.get('/api/user')
  .then(response => {
    console.log('数据:', response.data);
    console.log('状态:', response.status);
    console.log('状态文本:', response.statusText);
    console.log('响应头:', response.headers);
    console.log('请求配置:', response.config);
  })
  .catch(error => {
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log('响应数据:', error.response.data);
      console.log('响应状态:', error.response.status);
      console.log('响应头:', error.response.headers);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      console.log('请求对象:', error.request);
    } else {
      // 发送请求时出了点问题
      console.log('错误信息:', error.message);
    }
    console.log('错误配置:', error.config);
  });
```

## 🔧 实例化和全局配置

### 🏗️ 创建实例

```javascript
// 创建 axios 实例
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
});

// 使用实例
api.get('/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// 实例特定配置
const adminApi = axios.create({
  baseURL: 'https://admin-api.example.com',
  timeout: 15000,
  headers: {
    'X-Admin-Token': 'admin-secret-token'
  }
});
```

### 🌐 全局默认配置

```javascript
// 全局 axios 默认配置
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = 'Bearer token123';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000;

// 实例默认配置
const instance = axios.create();
instance.defaults.headers.common['Authorization'] = 'Bearer token456';
```

### 📊 配置优先级

| 优先级 | 配置来源 | 覆盖范围 |
|--------|----------|----------|
| **1 (最高)** | 请求时的 config 参数 | 🎯 单个请求 |
| **2** | 实例的 defaults 属性 | 🏠 实例范围 |
| **3 (最低)** | 全局的 defaults 属性 | 🌐 全局范围 |

## 🛡️ 拦截器机制

### 📥 请求拦截器

```javascript
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log('发送请求:', config);
    
    // 添加认证 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);
```

### 📤 响应拦截器

```javascript
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    console.log('收到响应:', response);
    
    // 统一处理响应数据格式
    if (response.data && response.data.code === 200) {
      return response.data.data;
    }
    
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('响应错误:', error);
    
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          alert('没有权限访问该资源');
          break;
        case 404:
          // 资源不存在
          alert('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          alert('服务器内部错误');
          break;
        default:
          alert('请求失败：' + error.response.statusText);
      }
    } else if (error.request) {
      // 网络错误
      alert('网络连接失败，请检查网络');
    } else {
      // 其他错误
      alert('请求失败：' + error.message);
    }
    
    return Promise.reject(error);
  }
);
```

### 🗑️ 移除拦截器

```javascript
// 移除拦截器
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);

// 为实例添加拦截器
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

### 📊 拦截器应用场景

| 拦截器类型 | 应用场景 | 常见操作 |
|------------|----------|----------|
| **请求拦截器** | 请求前处理 | 🔑 添加认证、📊 添加时间戳、🔄 请求转换 |
| **响应拦截器** | 响应后处理 | 📄 数据格式化、❌ 错误处理、🔄 状态码处理 |

## ❌ 错误处理机制

### 🔍 错误类型判断

```javascript
// 完整的错误处理
axios.get('/api/user/123')
  .then(response => {
    console.log('用户数据:', response.data);
  })
  .catch(error => {
    if (error.response) {
      // 服务器响应了错误状态码
      console.error('响应错误:');
      console.error('状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
      console.error('响应头:', error.response.headers);
      
      // 根据状态码进行不同处理
      handleResponseError(error.response.status, error.response.data);
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误:', error.request);
      handleNetworkError();
    } else {
      // 请求配置出错
      console.error('配置错误:', error.message);
      handleConfigError(error.message);
    }
  });

// 错误处理函数
function handleResponseError(status, data) {
  switch (status) {
    case 400:
      alert('请求参数错误: ' + data.message);
      break;
    case 401:
      alert('登录已过期，请重新登录');
      // 跳转到登录页
      window.location.href = '/login';
      break;
    case 403:
      alert('没有权限访问该资源');
      break;
    case 404:
      alert('请求的资源不存在');
      break;
    case 422:
      alert('数据验证失败: ' + data.message);
      break;
    case 500:
      alert('服务器内部错误，请稍后重试');
      break;
    default:
      alert('请求失败: ' + data.message);
  }
}

function handleNetworkError() {
  alert('网络连接失败，请检查网络连接');
}

function handleConfigError(message) {
  console.error('请求配置错误:', message);
}
```

### 📊 错误类型对比

| 错误类型 | 判断条件 | 常见原因 | 处理方式 |
|----------|----------|----------|----------|
| **响应错误** | error.response 存在 | 4xx, 5xx 状态码 | 🔄 根据状态码处理 |
| **网络错误** | error.request 存在 | 网络断开、超时 | 🔄 提示重试 |
| **配置错误** | error.message 存在 | 请求配置问题 | 🐛 修复代码 |

## ⏹️ 取消请求

### 🛑 使用 AbortController (推荐)

```javascript
// 创建取消控制器
const controller = new AbortController();

// 发送请求
axios.get('/api/data', {
  signal: controller.signal
})
.then(response => {
  console.log('数据:', response.data);
})
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('请求被取消:', error.message);
  } else {
    console.error('请求失败:', error);
  }
});

// 取消请求
controller.abort();
```

### 🔄 使用 CancelToken (已废弃)

```javascript
// 使用 CancelToken (不推荐，已废弃)
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/data', {
  cancelToken: source.token
})
.catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('请求被取消:', thrown.message);
  } else {
    // 处理其他错误
  }
});

// 取消请求
source.cancel('用户取消了请求');
```

### 🎯 取消请求的应用场景

| 场景 | 描述 | 实现方式 |
|------|------|----------|
| **路由切换** | 页面切换时取消未完成的请求 | 🔄 在路由守卫中取消 |
| **重复请求** | 防止用户多次点击发送重复请求 | 🛡️ 取消前一个请求 |
| **搜索防抖** | 搜索时取消之前的搜索请求 | ⏱️ 结合防抖使用 |
| **组件卸载** | 组件卸载时取消请求 | 🗑️ 在 cleanup 中取消 |

## 🎯 实际应用示例

### 📝 完整的 API 封装

```javascript
// api.js - API 封装
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 添加认证 token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求时间戳
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 计算请求耗时
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`请求耗时: ${duration}ms`);
    
    return response;
  },
  error => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 清除 token 并跳转登录
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 导出 API 方法
export const userApi = {
  // 获取用户列表
  getUsers: (params) => api.get('/users', { params }),
  
  // 获取用户详情
  getUser: (id) => api.get(`/users/${id}`),
  
  // 创建用户
  createUser: (data) => api.post('/users', data),
  
  // 更新用户
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export default api;
```

### 🔄 文件上传示例

```javascript
// 文件上传函数
async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress && onProgress(percentCompleted);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

// 使用示例
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const result = await uploadFile(file, (progress) => {
      console.log(`上传进度: ${progress}%`);
    });
    
    console.log('上传成功:', result);
  } catch (error) {
    alert('上传失败，请重试');
  }
});
```

### 🔍 搜索防抖示例

```javascript
// 搜索防抖实现
class SearchManager {
  constructor() {
    this.currentRequest = null;
  }
  
  async search(keyword, delay = 300) {
    // 取消之前的请求
    if (this.currentRequest) {
      this.currentRequest.abort();
    }
    
    // 防抖延迟
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // 创建新的请求
    const controller = new AbortController();
    this.currentRequest = controller;
    
    try {
      const response = await axios.get('/api/search', {
        params: { q: keyword },
        signal: controller.signal
      });
      
      this.currentRequest = null;
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('搜索被取消');
      } else {
        console.error('搜索失败:', error);
        throw error;
      }
    }
  }
}

// 使用示例
const searchManager = new SearchManager();

document.getElementById('search-input').addEventListener('input', async (e) => {
  const keyword = e.target.value.trim();
  
  if (!keyword) {
    clearSearchResults();
    return;
  }
  
  try {
    const results = await searchManager.search(keyword);
    displaySearchResults(results);
  } catch (error) {
    console.error('搜索出错:', error);
  }
});
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **🏗️ 使用实例化配置**
   ```javascript
   // 为不同的 API 创建不同的实例
   const authApi = axios.create({ baseURL: '/auth' });
   const dataApi = axios.create({ baseURL: '/data' });
   ```

2. **🛡️ 合理使用拦截器**
   ```javascript
   // 统一处理认证和错误
   api.interceptors.request.use(addAuthToken);
   api.interceptors.response.use(handleSuccess, handleError);
   ```

3. **⏱️ 设置合理的超时时间**
   ```javascript
   // 根据接口类型设置不同超时时间
   const quickApi = axios.create({ timeout: 5000 });
   const uploadApi = axios.create({ timeout: 30000 });
   ```

4. **🔄 正确处理错误**
   ```javascript
   // 区分不同类型的错误
   .catch(error => {
     if (error.response) {
       // 服务器错误
     } else if (error.request) {
       // 网络错误
     } else {
       // 配置错误
     }
   });
   ```

### ❌ 避免的问题

| 问题 | 错误做法 | 正确做法 | 影响 |
|------|----------|----------|------|
| **全局污染** | 修改 axios.defaults | 使用实例 | 🐛 配置冲突 |
| **忽略错误** | 只处理成功情况 | 完整错误处理 | 💥 用户体验差 |
| **重复请求** | 不做防护 | 请求去重/取消 | 🌐 资源浪费 |
| **硬编码配置** | 写死 URL 和参数 | 使用环境变量 | 🔧 维护困难 |

### 🎯 性能优化建议

1. **📦 请求合并**
   ```javascript
   // 合并多个小请求
   const [users, posts, comments] = await Promise.all([
     api.get('/users'),
     api.get('/posts'),
     api.get('/comments')
   ]);
   ```

2. **💾 适当缓存**
   ```javascript
   // 缓存不常变化的数据
   const cache = new Map();
   
   async function getCachedData(url, ttl = 300000) {
     const cached = cache.get(url);
     if (cached && Date.now() - cached.timestamp < ttl) {
       return cached.data;
     }
     
     const response = await api.get(url);
     cache.set(url, {
       data: response.data,
       timestamp: Date.now()
     });
     
     return response.data;
   }
   ```

3. **🔄 请求重试**
   ```javascript
   // 网络不稳定时自动重试
   async function requestWithRetry(config, maxRetries = 3) {
     for (let i = 0; i <= maxRetries; i++) {
       try {
         return await axios(config);
       } catch (error) {
         if (i === maxRetries) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * i));
       }
     }
   }
   ```

## 🔗 相关资源

### 📚 学习资源

- [Axios 官方文档](https://axios-http.com/zh/docs/intro)
- [Axios GitHub 仓库](https://github.com/axios/axios)
- [MDN HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

### 🛠️ 相关工具

- [ky](https://github.com/sindresorhus/ky) - 基于 Fetch 的替代方案
- [got](https://github.com/sindresorhus/got) - Node.js HTTP 客户端
- [superagent](https://github.com/visionmedia/superagent) - 另一个 HTTP 客户端

---

::: tip 🎉 总结
Axios 是目前最流行的 JavaScript HTTP 客户端库，提供了丰富的功能和良好的开发体验。掌握其配置选项、拦截器机制和错误处理，能够帮助你构建更可靠和高效的网络请求层。
:::