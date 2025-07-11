---
title: Node.js Process 进程管理
description: Node.js 进程对象详解，包括进程信息、事件监听、环境变量等
outline: deep
---

# ⚙️ Node.js Process 进程管理

`process` 对象是 Node.js 提供的全局对象，提供了有关当前 Node.js 进程的信息并对其进行控制。它是 EventEmitter 的实例，可以在任何地方直接访问。

::: tip 💡 核心特性
- 全局对象，无需 require 即可使用
- EventEmitter 的实例，支持事件机制
- 提供进程信息和控制方法
- 支持环境变量和命令行参数操作
:::

## 📸 进程信息概览

<img src="./image.png" alt="Process 对象结构" data-fancybox="gallery" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

## 🎯 进程事件

### 核心事件监听

```javascript
const process = require('node:process');

// 进程退出前事件
process.on('beforeExit', (code) => {
  console.log('进程即将退出，退出码:', code);
});

// 进程退出事件
process.on('exit', (code) => {
  console.log('进程退出，退出码:', code);
  // 注意：这里只能执行同步操作
});

// 未捕获的异常
process.on('uncaughtException', (err, origin) => {
  console.error('未捕获的异常:', err);
  console.error('异常来源:', origin);
  // 建议：记录日志后优雅退出
  process.exit(1);
});

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  console.error('Promise:', promise);
});

// 警告事件
process.on('warning', (warning) => {
  console.warn('警告名称:', warning.name);
  console.warn('警告消息:', warning.message);
  console.warn('调用栈:', warning.stack);
});
```

### 进程通信事件

```javascript
// 父子进程断开连接
process.on('disconnect', () => {
  console.log('与父进程断开连接');
});

// 接收父进程消息
process.on('message', (message, sendHandle) => {
  console.log('收到父进程消息:', message);
  
  // 向父进程发送响应
  if (process.send) {
    process.send('子进程响应');
  }
});

// Worker 线程相关事件
process.on('worker', (worker) => {
  console.log('创建新的 Worker 线程:', worker);
});

process.on('workerMessage', (value, source) => {
  console.log('Worker 消息:', value);
  console.log('消息来源:', source);
});
```

## 📊 进程属性

### 基本信息

```javascript
// 架构信息
console.log('CPU架构:', process.arch);        // 'x64', 'arm64', 'ia32'
console.log('操作系统:', process.platform);   // 'darwin', 'linux', 'win32'

// 进程ID
console.log('当前进程ID:', process.pid);
console.log('父进程ID:', process.ppid);

// 版本信息
console.log('Node.js版本:', process.version);
console.log('依赖版本:', process.versions);

// 版本发布信息
console.log('发布信息:', process.release);
/*
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
*/
```

### 命令行参数

```javascript
// 完整的命令行参数
console.log('所有参数:', process.argv);
// [ '/usr/local/bin/node', '/path/to/script.js', 'arg1', 'arg2' ]

// 原始的 argv[0]
console.log('原始执行文件:', process.argv0);

// 只有 Node.js 特定的参数
console.log('Node.js参数:', process.execArgv);

// 可执行文件的绝对路径
console.log('可执行文件路径:', process.execPath);
```

### 环境变量

```javascript
// 获取所有环境变量
console.log('环境变量:', process.env);

// 常用环境变量
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);
console.log('HOME:', process.env.HOME);
console.log('USER:', process.env.USER);

// 动态设置环境变量
process.env.CUSTOM_VAR = 'custom_value';
console.log('自定义变量:', process.env.CUSTOM_VAR);
```

## 🔧 进程控制方法

### 基本操作

```javascript
// 获取当前工作目录
console.log('当前工作目录:', process.cwd());

// 更改工作目录
try {
  process.chdir('/tmp');
  console.log('新工作目录:', process.cwd());
} catch (err) {
  console.error('更改目录失败:', err);
}

// 获取进程运行时间（秒）
console.log('运行时间:', process.uptime());

// 终止进程
// process.exit(0);  // 正常退出
// process.exit(1);  // 异常退出
```

### 资源使用情况

```javascript
// CPU使用情况
const cpuUsage = process.cpuUsage();
console.log('CPU使用情况:', cpuUsage);
/*
{
  user: 38579,    // 用户态时间（微秒）
  system: 6986    // 内核态时间（微秒）
}
*/

// 内存使用情况
const memoryUsage = process.memoryUsage();
console.log('内存使用情况:', memoryUsage);
/*
{
  rss: 4935680,          // 常驻内存集合
  heapTotal: 1826816,    // 堆总大小
  heapUsed: 650472,      // 堆已使用大小
  external: 49879,       // 外部内存使用量
  arrayBuffers: 9386     // ArrayBuffer 和 Buffer 使用量
}
*/

// 系统资源使用情况
const resourceUsage = process.resourceUsage();
console.log('系统资源使用:', resourceUsage);
```

### 高级操作

```javascript
// 获取可用内存
const availableMemory = process.availableMemory();
console.log('可用内存:', availableMemory);

// 获取受限内存
const constrainedMemory = process.constrainedMemory();
console.log('受限内存:', constrainedMemory);

// 发送信号到进程
try {
  process.kill(process.pid, 'SIGUSR1');
} catch (err) {
  console.error('发送信号失败:', err);
}

// 获取用户ID（仅Unix系统）
if (process.getuid) {
  console.log('用户ID:', process.getuid());
}
```

## 🔄 异步操作

### nextTick

```javascript
// 将回调添加到下一个滴答队列
console.log('开始');

process.nextTick(() => {
  console.log('nextTick 回调');
});

setImmediate(() => {
  console.log('setImmediate 回调');
});

setTimeout(() => {
  console.log('setTimeout 回调');
}, 0);

console.log('结束');

// 输出顺序：开始 -> 结束 -> nextTick 回调 -> setTimeout 回调 -> setImmediate 回调
```

### 事件循环优先级

```javascript
// 展示事件循环优先级
console.log('同步代码 1');

setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));

console.log('同步代码 2');

// 输出顺序：
// 同步代码 1
// 同步代码 2
// nextTick
// Promise
// setTimeout
// setImmediate
```

## 📡 标准输入输出

### 标准输出

```javascript
// 标准输出
process.stdout.write('Hello World\n');

// 标准错误输出
process.stderr.write('Error message\n');

// 检查是否是TTY
if (process.stdout.isTTY) {
  console.log('运行在终端中');
}
```

### 标准输入

```javascript
// 标准输入处理
process.stdin.setEncoding('utf8');
process.stdin.resume();

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  console.log('输入内容:', input);
});

// 交互式输入示例
process.stdout.write('请输入您的姓名: ');
process.stdin.once('data', (data) => {
  const name = data.toString().trim();
  console.log(`您好, ${name}!`);
  process.exit(0);
});
```

## 🛠️ 实用工具

### 环境配置加载

```javascript
// 加载 .env 文件
try {
  process.loadEnvFile('.env');
  console.log('环境变量加载成功');
} catch (err) {
  console.error('环境变量加载失败:', err.message);
}

// 手动解析 .env 文件
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (err) {
    console.error('加载环境文件失败:', err.message);
  }
}

loadEnvFile('.env');
```

### 进程监控

```javascript
// 进程监控类
class ProcessMonitor {
  constructor() {
    this.startTime = Date.now();
    this.startCpuUsage = process.cpuUsage();
    this.startMemoryUsage = process.memoryUsage();
  }
  
  getStats() {
    const now = Date.now();
    const currentCpuUsage = process.cpuUsage(this.startCpuUsage);
    const currentMemoryUsage = process.memoryUsage();
    
    return {
      uptime: process.uptime(),
      runningTime: now - this.startTime,
      cpu: {
        user: currentCpuUsage.user / 1000000, // 转换为秒
        system: currentCpuUsage.system / 1000000
      },
      memory: {
        rss: currentMemoryUsage.rss / 1024 / 1024, // 转换为MB
        heapUsed: currentMemoryUsage.heapUsed / 1024 / 1024,
        heapTotal: currentMemoryUsage.heapTotal / 1024 / 1024
      }
    };
  }
}

// 使用示例
const monitor = new ProcessMonitor();

setInterval(() => {
  const stats = monitor.getStats();
  console.log('进程统计:', stats);
}, 5000);
```

## 🎯 最佳实践

### 1. 优雅退出

```javascript
// 优雅退出处理
function gracefulShutdown() {
  console.log('正在优雅退出...');
  
  // 清理资源
  // 关闭数据库连接
  // 完成正在进行的任务
  
  setTimeout(() => {
    console.log('清理完成，退出进程');
    process.exit(0);
  }, 1000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

### 2. 错误处理

```javascript
// 全局错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 记录日志
  // 发送错误报告
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  // 记录日志
  // 发送错误报告
});
```

### 3. 环境判断

```javascript
// 判断运行环境
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// 根据环境配置不同的行为
if (isDevelopment) {
  console.log('开发环境');
} else if (isProduction) {
  console.log('生产环境');
}
```

---

::: tip 🔗 相关链接
- [Node.js Process 官方文档](https://nodejs.org/api/process.html)
- [事件循环详解](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [进程管理最佳实践](https://nodejs.org/en/docs/guides/simple-profiling/)
:::
