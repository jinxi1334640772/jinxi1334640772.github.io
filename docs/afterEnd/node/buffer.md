---
title: Node.js Buffer 缓冲区
description: Node.js Buffer 模块详解 - 二进制数据处理、内存管理和常用API指南
outline: deep
---

# 🧱 Node.js Buffer 缓冲区

Buffer 是 Node.js 中用于处理二进制数据的全局类。它提供了在 JavaScript 中操作原始内存的能力，主要用于处理网络协议、数据库驱动、图片处理等场景。

::: tip 📚 本章内容
深入学习 Buffer 的创建方法、内存管理、数据转换和实际应用场景。
:::

## 1. Buffer 概述

### 🎯 什么是 Buffer

Buffer 是一个类似于数组的对象，用于表示固定长度的字节序列。在 Node.js 中，Buffer 是全局可用的，无需引入模块。

### 📊 Buffer 特性

| 特性 | 说明 |
|------|------|
| **固定长度** | 创建后大小不可改变 |
| **内存效率** | 直接操作内存，性能优异 |
| **编码支持** | 支持多种字符编码 |
| **类型化数组** | 基于 Uint8Array 实现 |

### 🔧 应用场景

```javascript
// 文件操作
const fs = require('fs')
const data = fs.readFileSync('file.txt') // 返回 Buffer

// 网络传输
const net = require('net')
server.on('data', (chunk) => {
  console.log(chunk) // Buffer 对象
})

// 加密解密
const crypto = require('crypto')
const hash = crypto.createHash('sha256')
hash.update(Buffer.from('hello world'))
```

## 2. Buffer 创建方法

### 🏗️ Buffer.alloc()

安全地分配新的 Buffer 实例：

```javascript
// 创建长度为 10 的零填充 Buffer
const buf1 = Buffer.alloc(10)
console.log(buf1) // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 创建长度为 10，用 1 填充的 Buffer
const buf2 = Buffer.alloc(10, 1)
console.log(buf2) // <Buffer 01 01 01 01 01 01 01 01 01 01>

// 创建长度为 11，用 'aGVsbG8gd29ybGQ=' 填充的 Buffer（base64 编码）
const buf3 = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64')
console.log(buf3) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

### ⚡ Buffer.allocUnsafe()

快速分配但不初始化的 Buffer：

```javascript
// 创建长度为 10 的未初始化 Buffer（可能包含敏感数据）
const buf = Buffer.allocUnsafe(10)

// 手动清零
buf.fill(0)
```

### 🔄 Buffer.from()

从现有数据创建 Buffer：

```javascript
// 从字符串创建
const buf1 = Buffer.from('hello world', 'utf8')
console.log(buf1) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

// 从数组创建
const buf2 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f])
console.log(buf2) // <Buffer 68 65 6c 6c 6f>

// 从另一个 Buffer 创建（复制）
const buf3 = Buffer.from(buf1)
console.log(buf3) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

// 从 ArrayBuffer 创建
const ab = new ArrayBuffer(10)
const buf4 = Buffer.from(ab, 0, 2)
```

## 3. Buffer 基本操作

### 📝 读写操作

```javascript
const buf = Buffer.alloc(10)

// 写入数据
buf.write('hello')
buf.writeUInt8(0x48, 0)        // 在位置 0 写入 8 位无符号整数
buf.writeUInt16BE(0x1234, 1)   // 在位置 1 写入 16 位大端序整数
buf.writeUInt32LE(0x12345678, 4) // 在位置 4 写入 32 位小端序整数

// 读取数据
const value1 = buf.readUInt8(0)        // 读取位置 0 的 8 位无符号整数
const value2 = buf.readUInt16BE(1)     // 读取位置 1 的 16 位大端序整数
const value3 = buf.readUInt32LE(4)     // 读取位置 4 的 32 位小端序整数
```

### 🔄 数据转换

```javascript
const buf = Buffer.from('你好，世界', 'utf8')

// 转换为字符串
const str1 = buf.toString()           // 默认 utf8
const str2 = buf.toString('hex')      // 十六进制
const str3 = buf.toString('base64')   // Base64
const str4 = buf.toString('utf8', 0, 6) // 指定范围

console.log(str1) // 你好，世界
console.log(str2) // e4bda0e5a5bdefbc8ce4b896e7958c
console.log(str3) // 5L2g5aW977yM5LiW55WM

// 转换为 JSON
const json = buf.toJSON()
console.log(json) // { type: 'Buffer', data: [228, 189, 160, ...] }
```

## 4. Buffer 工具方法

### 🔍 Buffer.isBuffer()

检查对象是否为 Buffer：

```javascript
console.log(Buffer.isBuffer(Buffer.alloc(10))) // true
console.log(Buffer.isBuffer('hello'))          // false
console.log(Buffer.isBuffer([1, 2, 3]))        // false
```

### 📏 Buffer.byteLength()

获取字符串的字节长度：

```javascript
console.log(Buffer.byteLength('hello'))        // 5
console.log(Buffer.byteLength('你好'))          // 6 (UTF-8)
console.log(Buffer.byteLength('hello', 'utf8')) // 5
console.log(Buffer.byteLength('aGVsbG8=', 'base64')) // 5
```

### 🔗 Buffer.concat()

连接多个 Buffer：

```javascript
const buf1 = Buffer.from('hello ')
const buf2 = Buffer.from('world')
const buf3 = Buffer.from('!')

const result = Buffer.concat([buf1, buf2, buf3])
console.log(result.toString()) // hello world!

// 指定总长度
const result2 = Buffer.concat([buf1, buf2], 10)
console.log(result2.toString()) // hello worl
```

## 5. Buffer 实例方法

### 📋 基本属性和方法

```javascript
const buf = Buffer.from('hello world')

// 基本属性
console.log(buf.length)        // 11
console.log(buf.byteLength)    // 11

// 填充操作
buf.fill(0)                    // 用 0 填充整个 Buffer
buf.fill('h')                  // 用 'h' 填充
buf.fill('hello', 0, 5)        // 在指定范围填充

// 复制操作
const target = Buffer.alloc(10)
buf.copy(target, 0, 0, 5)      // 复制到目标 Buffer

// 切片操作
const slice = buf.slice(0, 5)   // 创建子 Buffer（共享内存）
const subarray = buf.subarray(0, 5) // 别名方法
```

### 🔍 查找和比较

```javascript
const buf = Buffer.from('hello world hello')

// 查找
console.log(buf.indexOf('world'))      // 6
console.log(buf.lastIndexOf('hello'))  // 12
console.log(buf.includes('world'))     // true

// 比较
const buf1 = Buffer.from('abc')
const buf2 = Buffer.from('abd')
console.log(buf1.compare(buf2))        // -1 (buf1 < buf2)
console.log(buf1.equals(buf2))         // false
```

## 6. 编码支持

### 📝 支持的编码

```javascript
const text = 'Hello 世界'

// 常用编码
const utf8Buffer = Buffer.from(text, 'utf8')
const asciiBuffer = Buffer.from('Hello', 'ascii')
const base64Buffer = Buffer.from('SGVsbG8=', 'base64')
const hexBuffer = Buffer.from('48656c6c6f', 'hex')

console.log(utf8Buffer.toString('utf8'))    // Hello 世界
console.log(base64Buffer.toString('utf8'))  // Hello
console.log(hexBuffer.toString('utf8'))     // Hello
```

### 🌐 编码转换

```javascript
const originalText = 'Hello 世界'

// UTF-8 → Base64
const utf8Buffer = Buffer.from(originalText, 'utf8')
const base64String = utf8Buffer.toString('base64')
console.log(base64String) // SGVsbG8g5LiW55WM

// Base64 → UTF-8
const decodedBuffer = Buffer.from(base64String, 'base64')
const decodedText = decodedBuffer.toString('utf8')
console.log(decodedText) // Hello 世界
```

## 7. 实际应用案例

### 📁 文件处理

```javascript
const fs = require('fs')

// 读取文件为 Buffer
const imageBuffer = fs.readFileSync('image.jpg')
console.log(`Image size: ${imageBuffer.length} bytes`)

// 写入 Buffer 到文件
const textBuffer = Buffer.from('Hello, Buffer!', 'utf8')
fs.writeFileSync('output.txt', textBuffer)
```

### 🌐 网络传输

```javascript
const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(`Received ${data.length} bytes`)
    
    // 处理二进制数据
    if (Buffer.isBuffer(data)) {
      const response = Buffer.concat([
        Buffer.from('Echo: '),
        data
      ])
      socket.write(response)
    }
  })
})

server.listen(3000)
```

### 🔐 加密操作

```javascript
const crypto = require('crypto')

// 生成随机 Buffer
const randomBytes = crypto.randomBytes(16)
console.log(randomBytes.toString('hex'))

// 哈希计算
const hash = crypto.createHash('sha256')
hash.update(Buffer.from('sensitive data'))
const hashResult = hash.digest() // 返回 Buffer
console.log(hashResult.toString('hex'))
```

## 8. 性能和最佳实践

### ⚡ 性能优化

```javascript
// ✅ 推荐：使用 Buffer.alloc()（安全）
const safeBuf = Buffer.alloc(1024)

// ⚠️ 谨慎使用：Buffer.allocUnsafe()（更快但不安全）
const unsafeBuf = Buffer.allocUnsafe(1024)
unsafeBuf.fill(0) // 记得清零

// ✅ 批量操作而不是逐字节操作
const buf = Buffer.alloc(1000)
buf.fill(0x42) // 快速填充

// ❌ 避免频繁的字符串转换
// const result = buf.toString() + 'more data' // 低效

// ✅ 使用 Buffer.concat() 进行拼接
const buffers = [buf1, buf2, buf3]
const combined = Buffer.concat(buffers)
```

### 💡 最佳实践

```javascript
// 1. 检查 Buffer 大小
function safeBufferOperation(buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError('Expected a Buffer')
  }
  
  if (buf.length === 0) {
    return Buffer.alloc(0)
  }
  
  // 继续处理...
}

// 2. 处理大文件时使用流
const fs = require('fs')
const stream = fs.createReadStream('large-file.dat')
stream.on('data', (chunk) => {
  // chunk 是 Buffer，处理小块数据
  processChunk(chunk)
})

// 3. 内存池复用
class BufferPool {
  constructor(size = 1024) {
    this.pool = []
    this.size = size
  }
  
  get() {
    return this.pool.pop() || Buffer.alloc(this.size)
  }
  
  put(buf) {
    buf.fill(0) // 清零
    this.pool.push(buf)
  }
}
```

## 9. 错误处理和调试

### 🐛 常见错误

```javascript
// 1. 缓冲区溢出
try {
  const buf = Buffer.alloc(10)
  buf.writeUInt32BE(0x12345678, 8) // 会抛出错误
} catch (err) {
  console.error('Buffer overflow:', err.message)
}

// 2. 编码错误
try {
  const invalidBase64 = 'invalid base64!@#'
  const buf = Buffer.from(invalidBase64, 'base64')
  console.log(buf) // 可能产生意外结果
} catch (err) {
  console.error('Encoding error:', err.message)
}

// 3. 内存不足
try {
  const hugeBuf = Buffer.alloc(1024 * 1024 * 1024) // 1GB
} catch (err) {
  console.error('Memory allocation failed:', err.message)
}
```

### 🔍 调试技巧

```javascript
// 十六进制查看
function hexDump(buf, bytesPerLine = 16) {
  for (let i = 0; i < buf.length; i += bytesPerLine) {
    const slice = buf.slice(i, i + bytesPerLine)
    const hex = slice.toString('hex').match(/.{2}/g).join(' ')
    const ascii = slice.toString('ascii').replace(/[^\x20-\x7E]/g, '.')
    console.log(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(bytesPerLine * 3)} ${ascii}`)
  }
}

const buf = Buffer.from('Hello, 世界! 🌍')
hexDump(buf)
```

## 10. 参考资料

### 📚 官方文档
- [Node.js Buffer 官方文档](https://nodejs.org/api/buffer.html)
- [Buffer API 参考](https://nodejs.org/dist/latest/docs/api/buffer.html)

### 💡 学习资源
- [Understanding Node.js Buffer](https://nodejs.dev/learn/nodejs-buffers)
- [Binary Data in Node.js](https://nodejs.org/en/knowledge/advanced/buffers/how-to-use-buffers/)

### 🔗 相关模块
- [Stream 模块](./stream.md) - 与 Buffer 密切相关的流处理
- [File System 模块](./fs.md) - 文件操作中的 Buffer 应用
- [Crypto 模块](https://nodejs.org/api/crypto.html) - 加密中的 Buffer 使用

---

::: tip 💡 下一步
Buffer 是 Node.js 中处理二进制数据的基础。建议接下来学习 [Stream 模块](./stream.md)，了解如何高效处理大量数据。
:::
