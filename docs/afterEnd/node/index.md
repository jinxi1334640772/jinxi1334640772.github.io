---
title: Node.js 全栈开发
description: Node.js 核心模块和后端开发实践指南
outline: deep
---

# 🚀 Node.js 全栈开发

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，让 JavaScript 可以在服务器端运行。它采用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

::: tip 📚 学习目标
- 掌握 Node.js 核心模块的使用
- 学会构建高性能的服务器应用
- 了解 Node.js 生态系统和最佳实践
:::

## 🏗️ 核心模块

### 📁 文件系统与路径
- [文件系统 (fs)](./fs.md) - 文件和目录操作
- [路径处理 (path)](./path.md) - 路径字符串操作
- [缓冲区 (buffer)](./buffer.md) - 二进制数据处理

### 🌐 网络与服务器
- [HTTP 服务器](./server.md) - 创建 HTTP 服务器
- [HTTP/2 协议](./http2.md) - 高性能 HTTP 协议

### 🔧 进程与事件
- [进程管理 (process)](./process.md) - 进程信息和控制
- [事件系统 (events)](./events.md) - 事件驱动编程
- [数据流 (stream)](./stream.md) - 流式数据处理

### 🛠️ 实用工具
- [模块系统 (module)](./module.md) - 模块加载和管理
- [工具函数 (util)](./util.md) - 常用工具函数
- [查询字符串 (querystring)](./querystring.md) - URL 查询参数处理
- [命令行交互 (readline)](./readline.md) - 交互式命令行

### 🧪 测试与调试
- [断言测试 (assert)](./assert.md) - 断言和测试
- [单元测试](./test.md) - 测试框架和最佳实践

### 🕸️ 实战项目
- [网络爬虫](./reptile.md) - 数据抓取和处理

## 🎯 学习路径

### 初学者路线
1. **环境搭建** → 安装 Node.js 和 npm
2. **模块系统** → [模块加载](./module.md)
3. **文件操作** → [文件系统](./fs.md)
4. **HTTP 服务** → [创建服务器](./server.md)

### 进阶路线
1. **异步编程** → [事件和流](./events.md)
2. **性能优化** → [HTTP/2](./http2.md)
3. **进程管理** → [进程控制](./process.md)
4. **测试开发** → [单元测试](./test.md)

### 高级路线
1. **架构设计** → 微服务架构
2. **性能调优** → 内存管理和监控
3. **实战项目** → [网络爬虫](./reptile.md)
4. **生产部署** → 容器化和自动化

## 🔥 热门特性

### ⚡ 非阻塞 I/O
```javascript
// 异步文件读取
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 程序继续执行，不会等待文件读取完成
console.log('文件读取已启动...');
```

### 🔄 事件驱动
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', (message) => {
  console.log(`收到事件: ${message}`);
});

myEmitter.emit('event', 'Hello World!');
```

### 🌊 流式处理
```javascript
const fs = require('fs');

// 创建可读流
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

// 管道操作
readStream.pipe(writeStream);
```

## 🛠️ 生态系统

### 📦 包管理
- **npm** - 世界上最大的开源库生态系统
- **yarn** - 快速、可靠、安全的依赖管理工具
- **pnpm** - 快速、节省磁盘空间的包管理器

### 🚀 主流框架
- **Express.js** - 快速、极简的 Web 框架
- **Koa.js** - 下一代 Web 框架
- **Nest.js** - 构建高效、可扩展的 Node.js 应用
- **Fastify** - 快速且低开销的 Web 框架

### 🗄️ 数据库支持
- **MongoDB** - 文档型数据库
- **MySQL** - 关系型数据库
- **PostgreSQL** - 开源关系型数据库
- **Redis** - 内存数据库

## 🎉 最佳实践

### 🏗️ 项目结构
```
my-node-app/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── tests/
├── docs/
├── package.json
└── README.md
```

### 🔐 安全性
- 使用环境变量管理敏感信息
- 输入验证和数据清理
- 实施适当的身份验证和授权
- 定期更新依赖包

### 📈 性能优化
- 使用缓存减少数据库查询
- 实施负载均衡
- 优化数据库查询
- 使用集群模式

## 🔗 相关资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [npm 官方文档](https://docs.npmjs.com/)
- [Express.js 官方文档](https://expressjs.com/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)

---

::: tip 🎯 下一步
选择一个感兴趣的模块开始学习，建议从 [HTTP 服务器](./server.md) 开始，它是后端开发的基础。
::: 