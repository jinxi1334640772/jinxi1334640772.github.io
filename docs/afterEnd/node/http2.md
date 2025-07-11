---
title: Node.js HTTP/2 协议
description: Node.js HTTP/2 模块详解 - 服务器创建、客户端连接、流管理和性能优化指南
outline: deep
---

# 🚀 Node.js HTTP/2 协议

node:http2 模块提供了 HTTP/2 协议的实现。与传统的 HTTP/1.1 相比，HTTP/2 具有更高的性能、更好的多路复用能力和服务器推送功能。

::: tip 📚 本章内容
学习 HTTP/2 协议的核心特性、服务器与客户端实现、流管理和性能优化技巧。
:::

## 1. HTTP/2 协议概述

### 🌟 HTTP/2 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **多路复用** | 单个连接上并发处理多个请求 | 减少延迟，提高性能 |
| **服务器推送** | 主动向客户端推送资源 | 减少往返时间 |
| **头部压缩** | 使用 HPACK 压缩算法 | 减少带宽使用 |
| **二进制协议** | 基于二进制而非文本 | 解析效率更高 |
| **流量控制** | 精确控制数据传输 | 防止缓冲区溢出 |

### 🔧 引入模块

```javascript
const http2 = require('node:http2')
const fs = require('node:fs')
const path = require('node:path')
```

## 2. 创建 HTTP/2 服务器

### 🔐 生成 SSL 证书

HTTP/2 在浏览器中需要 HTTPS，首先生成测试证书：

```bash
# 生成私钥和证书
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

### 🛡️ 安全服务器（推荐）

```javascript
const http2 = require('node:http2')
const fs = require('node:fs')

// 创建 HTTP/2 安全服务器
const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  // 指定支持的来源
  origins: ['https://localhost:8443', 'https://example.com']
})

// 监听流事件
server.on('stream', (stream, headers) => {
  console.log('接收到新流:', headers)
  
  // 响应客户端
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  })
  
  stream.end('<h1>Hello HTTP/2!</h1>')
})

// 监听错误
server.on('error', (err) => {
  console.error('服务器错误:', err)
})

// 启动服务器
server.listen(8443, () => {
  console.log('HTTP/2 服务器运行在 https://localhost:8443')
})
```

### 🌐 完整的服务器示例

```javascript
const http2 = require('node:http2')
const fs = require('node:fs')
const path = require('node:path')

class HTTP2Server {
  constructor(options = {}) {
    this.server = http2.createSecureServer({
      key: fs.readFileSync(options.keyPath || 'localhost-privkey.pem'),
      cert: fs.readFileSync(options.certPath || 'localhost-cert.pem'),
      origins: options.origins || ['https://localhost:8443']
    })
    
    this.setupEventHandlers()
  }
  
  setupEventHandlers() {
    // 连接事件
    this.server.on('connection', (socket) => {
      console.log('新的TCP连接建立')
    })
    
    // 会话事件
    this.server.on('session', (session) => {
      console.log('新的HTTP/2会话创建')
      
      // 向客户端提供备用服务信息
      session.altsvc('h2=":8000"', 'https://example.org:80')
      
      // 通告服务器能够提供权威响应的源
      session.origin('https://example.com', 'https://example.org')
    })
    
    // 流事件 - 核心处理逻辑
    this.server.on('stream', (stream, headers) => {
      this.handleStream(stream, headers)
    })
    
    // 错误处理
    this.server.on('error', (err) => {
      console.error('服务器错误:', err)
    })
  }
  
  handleStream(stream, headers) {
    const method = headers[':method']
    const path = headers[':path']
    const userAgent = headers['user-agent']
    
    console.log(`${method} ${path} - ${userAgent}`)
    
    // 路由处理
    if (path === '/') {
      this.handleHomePage(stream)
    } else if (path === '/api/data') {
      this.handleApiData(stream)
    } else if (path === '/push-demo') {
      this.handlePushDemo(stream)
    } else {
      this.handleNotFound(stream)
    }
  }
  
  handleHomePage(stream) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>HTTP/2 Demo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .info { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Welcome to HTTP/2 Server!</h1>
        <div class="info">
          <p>This page is served over HTTP/2</p>
          <p>Check the network tab in your browser's developer tools</p>
        </div>
        <script>
          console.log('HTTP/2 page loaded');
        </script>
      </body>
      </html>
    `
    
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200,
      'content-length': Buffer.byteLength(html)
    })
    
    stream.end(html)
  }
  
  handleApiData(stream) {
    const data = {
      message: 'Hello from HTTP/2 API',
      timestamp: new Date().toISOString(),
      features: ['multiplexing', 'server-push', 'header-compression']
    }
    
    const jsonData = JSON.stringify(data, null, 2)
    
    stream.respond({
      'content-type': 'application/json',
      ':status': 200,
      'content-length': Buffer.byteLength(jsonData)
    })
    
    stream.end(jsonData)
  }
  
  handlePushDemo(stream) {
    // 服务器推送示例
    stream.pushStream({ ':path': '/styles.css' }, (err, pushStream) => {
      if (err) {
        console.error('推送失败:', err)
        return
      }
      
      const css = `
        body { background-color: #f5f5f5; }
        .pushed { color: green; font-weight: bold; }
      `
      
      pushStream.respond({
        'content-type': 'text/css',
        ':status': 200
      })
      
      pushStream.end(css)
    })
    
    // 推送 JavaScript 文件
    stream.pushStream({ ':path': '/script.js' }, (err, pushStream) => {
      if (err) {
        console.error('推送失败:', err)
        return
      }
      
      const js = `
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Pushed JavaScript loaded');
        });
      `
      
      pushStream.respond({
        'content-type': 'application/javascript',
        ':status': 200
      })
      
      pushStream.end(js)
    })
    
    // 主页面响应
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Push Demo</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Server Push Demo</h1>
        <p class="pushed">This page uses server push for CSS and JS!</p>
        <script src="/script.js"></script>
      </body>
      </html>
    `
    
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200
    })
    
    stream.end(html)
  }
  
  handleNotFound(stream) {
    stream.respond({
      'content-type': 'text/plain',
      ':status': 404
    })
    
    stream.end('404 Not Found')
  }
  
  listen(port, callback) {
    this.server.listen(port, callback)
  }
  
  close(callback) {
    this.server.close(callback)
  }
}

// 使用示例
const server = new HTTP2Server({
  keyPath: 'localhost-privkey.pem',
  certPath: 'localhost-cert.pem',
  origins: ['https://localhost:8443']
})

server.listen(8443, () => {
  console.log('HTTP/2 服务器运行在 https://localhost:8443')
})
```

## 3. HTTP/2 客户端

### 🔌 创建客户端连接

```javascript
const http2 = require('node:http2')
const fs = require('node:fs')

// 创建客户端会话
const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
  // 忽略证书错误（仅用于测试）
  rejectUnauthorized: false
})

// 监听客户端事件
client.on('connect', () => {
  console.log('成功连接到服务器')
})

client.on('error', (err) => {
  console.error('客户端错误:', err)
})

// 发送请求
const req = client.request({
  ':method': 'GET',
  ':path': '/'
})

req.on('response', (headers) => {
  console.log('响应头:', headers)
})

req.on('data', (chunk) => {
  console.log('接收数据:', chunk.toString())
})

req.on('end', () => {
  console.log('请求完成')
  client.close()
})

req.end()
```

### 🎯 高级客户端示例

```javascript
class HTTP2Client {
  constructor(url, options = {}) {
    this.url = url
    this.client = http2.connect(url, {
      ca: options.ca,
      rejectUnauthorized: options.rejectUnauthorized || false
    })
    
    this.setupEventHandlers()
  }
  
  setupEventHandlers() {
    this.client.on('connect', () => {
      console.log(`已连接到 ${this.url}`)
    })
    
    this.client.on('error', (err) => {
      console.error('客户端错误:', err)
    })
    
    this.client.on('frameError', (type, code, id) => {
      console.error(`帧错误: type=${type}, code=${code}, id=${id}`)
    })
    
    this.client.on('goaway', (errorCode, lastStreamID, opaqueData) => {
      console.log('服务器关闭连接:', { errorCode, lastStreamID })
    })
    
    // 监听服务器推送
    this.client.on('stream', (stream, headers) => {
      console.log('接收到服务器推送:', headers[':path'])
      
      let data = ''
      stream.on('data', (chunk) => {
        data += chunk
      })
      
      stream.on('end', () => {
        console.log('推送内容:', data)
      })
    })
  }
  
  // 发送 GET 请求
  async get(path, headers = {}) {
    return this.request('GET', path, headers)
  }
  
  // 发送 POST 请求
  async post(path, data, headers = {}) {
    headers['content-type'] = headers['content-type'] || 'application/json'
    return this.request('POST', path, headers, data)
  }
  
  // 通用请求方法
  async request(method, path, headers = {}, data = null) {
    return new Promise((resolve, reject) => {
      const req = this.client.request({
        ':method': method,
        ':path': path,
        ...headers
      })
      
      let responseData = ''
      let responseHeaders = null
      
      req.on('response', (headers) => {
        responseHeaders = headers
        console.log(`${method} ${path} - ${headers[':status']}`)
      })
      
      req.on('data', (chunk) => {
        responseData += chunk
      })
      
      req.on('end', () => {
        resolve({
          status: responseHeaders[':status'],
          headers: responseHeaders,
          data: responseData
        })
      })
      
      req.on('error', (err) => {
        reject(err)
      })
      
      // 发送请求数据
      if (data) {
        req.write(typeof data === 'string' ? data : JSON.stringify(data))
      }
      
      req.end()
    })
  }
  
  // 设置会话配置
  setSettings(settings) {
    this.client.settings(settings)
  }
  
  // 发送 PING
  async ping() {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      
      this.client.ping(Buffer.from('12345678'), (err, duration, payload) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            duration,
            payload: payload.toString(),
            actualDuration: Date.now() - start
          })
        }
      })
    })
  }
  
  // 关闭连接
  close() {
    this.client.close()
  }
}

// 使用示例
async function clientExample() {
  const client = new HTTP2Client('https://localhost:8443', {
    ca: fs.readFileSync('localhost-cert.pem'),
    rejectUnauthorized: false
  })
  
  try {
    // 发送GET请求
    const response = await client.get('/')
    console.log('GET 响应:', response.status)
    
    // 发送API请求
    const apiResponse = await client.get('/api/data')
    console.log('API 响应:', JSON.parse(apiResponse.data))
    
    // 发送POST请求
    const postResponse = await client.post('/api/data', {
      name: '测试用户',
      email: 'test@example.com'
    })
    console.log('POST 响应:', postResponse.status)
    
    // 测试PING
    const pingResult = await client.ping()
    console.log('PING 结果:', pingResult)
    
    // 设置会话参数
    client.setSettings({
      enablePush: true,
      maxConcurrentStreams: 100
    })
    
    // 测试服务器推送
    const pushResponse = await client.get('/push-demo')
    console.log('推送演示响应:', pushResponse.status)
    
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    client.close()
  }
}

// 运行客户端示例
clientExample()
```

## 4. 流管理

### 🌊 流的生命周期

```javascript
// 服务器端流管理
server.on('stream', (stream, headers) => {
  console.log('流创建:', stream.id)
  
  // 流状态监控
  stream.on('close', () => {
    console.log('流关闭:', stream.id)
  })
  
  stream.on('error', (err) => {
    console.error('流错误:', err)
  })
  
  stream.on('aborted', () => {
    console.log('流被中止:', stream.id)
  })
  
  // 检查流状态
  if (stream.destroyed) {
    console.log('流已销毁')
    return
  }
  
  // 响应配置
  stream.respond({
    'content-type': 'text/plain',
    ':status': 200
  }, {
    endStream: false,        // 不立即结束流
    waitForTrailers: true    // 等待尾部头信息
  })
  
  // 发送数据
  stream.write('Hello ')
  stream.write('HTTP/2 ')
  stream.write('Streaming!')
  
  // 监听客户端需要尾部信息
  stream.on('wantTrailers', () => {
    stream.sendTrailers({
      'custom-trailer': 'trailer-value'
    })
  })
  
  // 结束流
  stream.end()
})
```

### 📊 流控制和优先级

```javascript
// 设置流优先级
server.on('stream', (stream, headers) => {
  // 设置流优先级权重
  stream.priority({
    exclusive: false,
    parent: 0,
    weight: 256
  })
  
  // 检查流状态
  console.log('流状态:', {
    id: stream.id,
    state: stream.state,
    pending: stream.pending,
    destroyed: stream.destroyed
  })
  
  // 响应
  stream.respond({
    'content-type': 'application/json',
    ':status': 200
  })
  
  // 发送大量数据进行流控制测试
  const data = JSON.stringify({
    message: 'Large data response',
    data: new Array(1000).fill('test data')
  })
  
  stream.end(data)
})
```

## 5. 高级特性

### 🚀 服务器推送

```javascript
// 智能服务器推送
server.on('stream', (stream, headers) => {
  const path = headers[':path']
  
  if (path === '/app') {
    // 推送关键资源
    const criticalResources = [
      { path: '/styles/critical.css', type: 'text/css' },
      { path: '/js/app.js', type: 'application/javascript' },
      { path: '/images/logo.png', type: 'image/png' }
    ]
    
    criticalResources.forEach(resource => {
      if (stream.pushAllowed) {
        stream.pushStream({ ':path': resource.path }, (err, pushStream) => {
          if (err) {
            console.error('推送失败:', err)
            return
          }
          
          // 读取文件并推送
          fs.readFile(`.${resource.path}`, (err, data) => {
            if (err) {
              pushStream.respond({ ':status': 404 })
              pushStream.end()
              return
            }
            
            pushStream.respond({
              'content-type': resource.type,
              ':status': 200,
              'content-length': data.length
            })
            
            pushStream.end(data)
          })
        })
      }
    })
  }
  
  // 发送主页面
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  })
  
  stream.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>App with Server Push</title>
      <link rel="stylesheet" href="/styles/critical.css">
    </head>
    <body>
      <h1>App with Server Push</h1>
      <script src="/js/app.js"></script>
    </body>
    </html>
  `)
})
```

### 🎛️ 会话管理

```javascript
// 高级会话管理
server.on('session', (session) => {
  console.log('新会话:', {
    type: session.type,
    state: session.state,
    localSettings: session.localSettings,
    remoteSettings: session.remoteSettings
  })
  
  // 设置会话参数
  session.settings({
    headerTableSize: 4096,
    enablePush: true,
    maxConcurrentStreams: 100,
    initialWindowSize: 65535,
    maxFrameSize: 16384,
    maxHeaderListSize: 8192
  })
  
  // 监听会话事件
  session.on('localSettings', (settings) => {
    console.log('本地设置更新:', settings)
  })
  
  session.on('remoteSettings', (settings) => {
    console.log('远程设置更新:', settings)
  })
  
  session.on('ping', (payload) => {
    console.log('收到PING:', payload)
  })
  
  // 会话超时处理
  session.setTimeout(30000, () => {
    console.log('会话超时')
    session.close()
  })
  
  // 优雅关闭
  session.on('goaway', (errorCode, lastStreamID, opaqueData) => {
    console.log('会话关闭:', { errorCode, lastStreamID })
  })
})
```

## 6. 性能优化

### 📈 优化策略

```javascript
// 性能优化配置
const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  
  // HTTP/2 优化选项
  settings: {
    headerTableSize: 4096,        // 头部表大小
    enablePush: true,             // 启用服务器推送
    maxConcurrentStreams: 100,    // 最大并发流数
    initialWindowSize: 65535,     // 初始窗口大小
    maxFrameSize: 16384,          // 最大帧大小
    maxHeaderListSize: 8192       // 最大头部列表大小
  }
})

// 连接复用监控
const connectionStats = new Map()

server.on('connection', (socket) => {
  const key = `${socket.remoteAddress}:${socket.remotePort}`
  connectionStats.set(key, {
    connected: Date.now(),
    streams: 0,
    bytes: 0
  })
  
  socket.on('close', () => {
    const stats = connectionStats.get(key)
    if (stats) {
      console.log('连接统计:', {
        duration: Date.now() - stats.connected,
        streams: stats.streams,
        bytes: stats.bytes
      })
      connectionStats.delete(key)
    }
  })
})

// 流统计
server.on('stream', (stream, headers) => {
  const key = `${stream.session.socket.remoteAddress}:${stream.session.socket.remotePort}`
  const stats = connectionStats.get(key)
  
  if (stats) {
    stats.streams++
    
    stream.on('data', (chunk) => {
      stats.bytes += chunk.length
    })
  }
  
  // 响应压缩
  const acceptEncoding = headers['accept-encoding'] || ''
  const useGzip = acceptEncoding.includes('gzip')
  
  const responseHeaders = {
    'content-type': 'application/json',
    ':status': 200
  }
  
  if (useGzip) {
    responseHeaders['content-encoding'] = 'gzip'
  }
  
  stream.respond(responseHeaders)
  
  const data = JSON.stringify({
    message: 'Optimized response',
    timestamp: Date.now()
  })
  
  if (useGzip) {
    const zlib = require('zlib')
    const compressed = zlib.gzipSync(data)
    stream.end(compressed)
  } else {
    stream.end(data)
  }
})
```

## 7. 实际应用案例

### 🌐 完整的 Web 应用

```javascript
const http2 = require('node:http2')
const fs = require('node:fs')
const path = require('node:path')
const url = require('node:url')

class HTTP2WebServer {
  constructor(options) {
    this.options = options
    this.server = http2.createSecureServer({
      key: fs.readFileSync(options.key),
      cert: fs.readFileSync(options.cert)
    })
    
    this.routes = new Map()
    this.middlewares = []
    this.staticPath = options.staticPath || './public'
    
    this.setupRoutes()
    this.setupEventHandlers()
  }
  
  setupRoutes() {
    // API 路由
    this.route('GET', '/api/users', this.getUsers.bind(this))
    this.route('POST', '/api/users', this.createUser.bind(this))
    this.route('GET', '/api/users/:id', this.getUser.bind(this))
    
    // 静态文件路由
    this.route('GET', '/static/*', this.serveStatic.bind(this))
  }
  
  setupEventHandlers() {
    this.server.on('stream', (stream, headers) => {
      this.handleRequest(stream, headers)
    })
    
    this.server.on('error', (err) => {
      console.error('服务器错误:', err)
    })
  }
  
  route(method, path, handler) {
    const key = `${method}:${path}`
    this.routes.set(key, handler)
  }
  
  use(middleware) {
    this.middlewares.push(middleware)
  }
  
  async handleRequest(stream, headers) {
    const method = headers[':method']
    const path = headers[':path']
    
    try {
      // 执行中间件
      for (const middleware of this.middlewares) {
        await middleware(stream, headers)
      }
      
      // 路由匹配
      const handler = this.matchRoute(method, path)
      if (handler) {
        await handler(stream, headers)
      } else {
        this.sendNotFound(stream)
      }
    } catch (error) {
      this.sendError(stream, error)
    }
  }
  
  matchRoute(method, path) {
    // 精确匹配
    const exactKey = `${method}:${path}`
    if (this.routes.has(exactKey)) {
      return this.routes.get(exactKey)
    }
    
    // 模式匹配
    for (const [routeKey, handler] of this.routes) {
      const [routeMethod, routePath] = routeKey.split(':')
      if (routeMethod === method && this.pathMatches(routePath, path)) {
        return handler
      }
    }
    
    return null
  }
  
  pathMatches(pattern, path) {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    
    if (patternParts.length !== pathParts.length) {
      return false
    }
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]
      
      if (patternPart.startsWith(':')) {
        continue // 参数匹配
      } else if (patternPart === '*') {
        return true // 通配符匹配
      } else if (patternPart !== pathPart) {
        return false
      }
    }
    
    return true
  }
  
  // API 处理方法
  async getUsers(stream, headers) {
    const users = [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' }
    ]
    
    this.sendJSON(stream, users)
  }
  
  async createUser(stream, headers) {
    const body = await this.readBody(stream)
    const userData = JSON.parse(body)
    
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    this.sendJSON(stream, newUser, 201)
  }
  
  async getUser(stream, headers) {
    const userId = this.extractParam(headers[':path'], '/api/users/:id', 'id')
    
    const user = {
      id: parseInt(userId),
      name: '张三',
      email: 'zhangsan@example.com'
    }
    
    this.sendJSON(stream, user)
  }
  
  async serveStatic(stream, headers) {
    const path = headers[':path']
    const filePath = path.replace('/static', this.staticPath)
    
    try {
      const stats = await fs.promises.stat(filePath)
      const content = await fs.promises.readFile(filePath)
      
      stream.respond({
        'content-type': this.getMimeType(filePath),
        'content-length': stats.size,
        ':status': 200
      })
      
      stream.end(content)
    } catch (error) {
      this.sendNotFound(stream)
    }
  }
  
  // 工具方法
  sendJSON(stream, data, status = 200) {
    const json = JSON.stringify(data, null, 2)
    
    stream.respond({
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(json),
      ':status': status
    })
    
    stream.end(json)
  }
  
  sendNotFound(stream) {
    const message = 'Not Found'
    
    stream.respond({
      'content-type': 'text/plain',
      'content-length': Buffer.byteLength(message),
      ':status': 404
    })
    
    stream.end(message)
  }
  
  sendError(stream, error) {
    const message = error.message || 'Internal Server Error'
    
    stream.respond({
      'content-type': 'text/plain',
      'content-length': Buffer.byteLength(message),
      ':status': 500
    })
    
    stream.end(message)
  }
  
  async readBody(stream) {
    return new Promise((resolve, reject) => {
      let body = ''
      
      stream.on('data', (chunk) => {
        body += chunk
      })
      
      stream.on('end', () => {
        resolve(body)
      })
      
      stream.on('error', reject)
    })
  }
  
  extractParam(path, pattern, paramName) {
    const pathParts = path.split('/')
    const patternParts = pattern.split('/')
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      if (patternPart === `:${paramName}`) {
        return pathParts[i]
      }
    }
    
    return null
  }
  
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }
    
    return mimeTypes[ext] || 'application/octet-stream'
  }
  
  listen(port, callback) {
    this.server.listen(port, callback)
  }
}

// 使用示例
const app = new HTTP2WebServer({
  key: 'localhost-privkey.pem',
  cert: 'localhost-cert.pem',
  staticPath: './public'
})

// 添加中间件
app.use(async (stream, headers) => {
  console.log(`${headers[':method']} ${headers[':path']}`)
})

app.listen(8443, () => {
  console.log('HTTP/2 Web服务器运行在 https://localhost:8443')
})
```

## 8. 最佳实践

### 🎯 性能优化建议

::: tip 💡 HTTP/2 最佳实践

1. **启用服务器推送**：主动推送关键资源
2. **合理设置并发流**：根据服务器性能调整
3. **使用头部压缩**：减少头部传输开销
4. **实施流优先级**：确保重要资源优先传输
5. **连接复用**：避免频繁创建连接
6. **错误处理完善**：处理各种异常情况
7. **监控和日志**：记录性能指标
8. **安全配置**：使用强加密套件

:::

## 9. 相关资源

- [HTTP/2 协议规范](https://tools.ietf.org/html/rfc7540)
- [Node.js HTTP/2 官方文档](https://nodejs.org/api/http2.html)
- [HTTP/2 性能优化指南](https://developers.google.com/web/fundamentals/performance/http2)

---

::: warning 🚨 注意事项
- HTTP/2 在浏览器中需要 HTTPS
- 服务器推送要谨慎使用，避免推送不需要的资源
- 注意流的生命周期管理，避免内存泄漏
- 合理设置连接和流的超时时间
:::
