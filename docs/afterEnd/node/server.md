---
title: Node.js HTTP 服务器
description: 使用 Node.js 创建 HTTP 服务器，处理请求和响应的完整指南
outline: deep
---

# 🌐 Node.js HTTP 服务器

Node.js 内置的 `http` 模块提供了创建 HTTP 服务器和客户端的功能。本章将详细介绍如何使用 Node.js 构建 HTTP 服务器。

::: tip 🎯 学习目标
- 掌握创建 HTTP 服务器的基本方法
- 理解请求和响应对象的使用
- 学会处理路由和静态文件
- 了解代理服务器的实现
:::

## 📚 基础概念

### 核心模块

```javascript
const http = require('node:http');
const fs = require('fs');
const net = require('node:net');
const { URL } = require('node:url');
```

## 🔧 创建基础服务器

### 简单的 HTTP 服务器

```javascript
const http = require('node:http');

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  
  // 发送响应
  res.end('Hello World!');
});

// 启动服务器
server.listen(3000, () => {
  console.log('🚀 服务器运行在 http://localhost:3000');
});
```

### 带路由的服务器

```javascript
const http = require('node:http');
const fs = require('fs');

// 路由处理函数
function route(url) {
  console.log('请求的地址:', url);
  return url;
}

// 创建服务器
const server = http.createServer((req, res) => {
  // 处理路由
  const requestUrl = route(req.url);
  
  // 根据路径确定文件
  let filePath = requestUrl === '/' ? './public/index.html' : `./public${requestUrl}`;
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  } else {
    // 返回404页面
    const notFoundData = fs.readFileSync('./public/404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(notFoundData);
  }
});

server.listen(8080, () => {
  console.log('🚀 服务器已启动: http://localhost:8080');
});
```

## 📝 HTTP 响应对象 (Response)

### 响应对象属性和方法

```javascript
const server = http.createServer((req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
  
  // 获取响应头
  const contentType = res.getHeader('content-type');
  const contentLength = res.getHeader('Content-Length');
  const setCookie = res.getHeader('set-cookie');
  
  // 检查响应头是否存在
  const hasContentType = res.hasHeader('content-type');
  
  // 移除响应头
  res.removeHeader('Set-Cookie');
  
  // 刷新响应头
  res.flushHeaders();
  
  // 写入响应体
  res.write('<h1>Hello World</h1>');
  res.write('<p>这是一个段落</p>');
  
  // 结束响应
  res.end('<p>响应结束</p>', 'utf-8', () => {
    console.log('响应发送完成');
  });
});
```

### 常用响应方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `res.writeHead()` | 设置状态码和响应头 | `res.writeHead(200, {'Content-Type': 'text/html'})` |
| `res.setHeader()` | 设置单个响应头 | `res.setHeader('Content-Type', 'application/json')` |
| `res.getHeader()` | 获取响应头 | `const type = res.getHeader('content-type')` |
| `res.write()` | 写入响应体 | `res.write('Hello')` |
| `res.end()` | 结束响应 | `res.end('Goodbye')` |

## 📥 HTTP 请求对象 (Request)

### 请求对象属性

```javascript
const server = http.createServer((req, res) => {
  console.log('请求方法:', req.method);
  console.log('请求URL:', req.url);
  console.log('请求协议:', req.protocol);
  console.log('请求主机:', req.headers.host);
  console.log('用户代理:', req.headers['user-agent']);
  
  // 解析查询参数
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log('查询参数:', url.searchParams);
  
  res.end('请求信息已记录');
});
```

### 处理 POST 请求

```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    // 监听数据接收
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    // 数据接收完成
    req.on('end', () => {
      console.log('POST数据:', body);
      
      // 解析JSON数据
      try {
        const data = JSON.parse(body);
        console.log('解析后的数据:', data);
      } catch (error) {
        console.error('JSON解析错误:', error);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: '数据接收成功' }));
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});
```

## 🔄 服务器事件

### 监听服务器事件

```javascript
const server = http.createServer();

// 监听请求事件
server.on('request', (req, res) => {
  console.log('收到请求:', req.url);
  res.end('Hello from event handler');
});

// 监听连接事件
server.on('connection', (socket) => {
  console.log('新的TCP连接建立');
});

// 监听CONNECT事件（用于代理）
server.on('connect', (req, clientSocket, head) => {
  console.log('收到CONNECT请求:', req.url);
  
  // 创建到目标服务器的连接
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write(
      'HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Node.js-Proxy\r\n' +
      '\r\n'
    );
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 监听错误事件
server.on('error', (err) => {
  console.error('服务器错误:', err);
});

// 监听关闭事件
server.on('close', () => {
  console.log('服务器已关闭');
});

server.listen(3000);
```

## 🔧 HTTP 客户端请求

### 发送 GET 请求

```javascript
const http = require('node:http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/data',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js HTTP Client',
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('响应头:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应数据:', data);
  });
});

req.on('error', (err) => {
  console.error('请求错误:', err);
});

req.end();
```

### 发送 POST 请求

```javascript
const postData = JSON.stringify({
  name: 'John',
  age: 30
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应:', data);
  });
});

req.write(postData);
req.end();
```

## 🎯 实用示例

### 静态文件服务器

```javascript
const http = require('node:http');
const fs = require('fs');
const path = require('path');

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，返回404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - 页面未找到</h1>');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end('服务器内部错误');
      }
    } else {
      // 根据文件扩展名设置Content-Type
      const extname = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extname] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(8080, () => {
  console.log('静态文件服务器运行在 http://localhost:8080');
});
```

### API 服务器

```javascript
const http = require('node:http');
const url = require('url');

// 模拟数据库
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 路由处理
  if (path === '/api/users' && method === 'GET') {
    // 获取所有用户
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    
  } else if (path.startsWith('/api/users/') && method === 'GET') {
    // 获取单个用户
    const userId = parseInt(path.split('/')[3]);
    const user = users.find(u => u.id === userId);
    
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '用户不存在' }));
    }
    
  } else if (path === '/api/users' && method === 'POST') {
    // 创建新用户
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newUser = JSON.parse(body);
        newUser.id = users.length + 1;
        users.push(newUser);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '无效的JSON数据' }));
      }
    });
    
  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '接口不存在' }));
  }
});

server.listen(3000, () => {
  console.log('API服务器运行在 http://localhost:3000');
});
```

## 🔧 服务器管理

### 优雅关闭

```javascript
const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(3000);

// 优雅关闭
process.on('SIGINT', () => {
  console.log('正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
```

### 设置超时

```javascript
const server = http.createServer((req, res) => {
  // 模拟长时间处理
  setTimeout(() => {
    res.end('响应数据');
  }, 5000);
});

// 设置服务器超时
server.setTimeout(10000, (socket) => {
  console.log('请求超时');
  socket.destroy();
});

server.listen(3000);
```

## 💡 最佳实践

1. **错误处理**
   ```javascript
   server.on('error', (err) => {
     console.error('服务器错误:', err);
   });
   ```

2. **设置适当的响应头**
   ```javascript
   res.setHeader('Content-Type', 'application/json; charset=utf-8');
   res.setHeader('Cache-Control', 'no-cache');
   ```

3. **处理跨域**
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   ```

4. **使用流处理大文件**
   ```javascript
   const stream = fs.createReadStream('largefile.txt');
   stream.pipe(res);
   ```

---

::: tip 🔗 相关链接
- [Node.js HTTP 官方文档](https://nodejs.org/api/http.html)
- [HTTP 状态码参考](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [RESTful API 设计指南](https://restfulapi.net/)
:::
