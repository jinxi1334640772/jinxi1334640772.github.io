---
title: Node.js Stream 流处理
description: Node.js 流式数据处理，包括可读流、可写流和管道操作详解
outline: deep
---

# 🌊 Node.js Stream 流处理

Stream（流）是 Node.js 中处理数据的抽象接口。流可以是可读的、可写的，或者既可读又可写。所有的流都是 EventEmitter 的实例。

::: tip 💡 流的优势
- **内存效率**：无需一次性将所有数据加载到内存中
- **时间效率**：可以在数据到达时立即开始处理
- **组合性**：可以通过管道组合多个流
:::

## 📚 基本概念

### 流的类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **可读流** | 从中读取数据的流 | `fs.createReadStream()` |
| **可写流** | 向其写入数据的流 | `fs.createWriteStream()` |
| **双工流** | 既可读又可写的流 | `net.Socket` |
| **转换流** | 在读写过程中可以修改数据的流 | `zlib.createGzip()` |

## 🔧 可读流操作

### 创建可读流

```javascript
const fs = require('fs');

// 创建文件可读流
const readStream = fs.createReadStream('../pages/test.txt');

// 设置编码格式
readStream.setEncoding('utf8');
```

### 监听可读流事件

```javascript
let total = '';

// 监听数据事件 - 当读取到数据时触发
readStream.on('data', (chunk) => {
  console.log('接收到数据块:', chunk.length);
  total += chunk;
});

// 监听结束事件 - 读取完成时触发
readStream.on('end', () => {
  console.log('文件读取完成');
  console.log('总内容:', total);
});

// 监听错误事件 - 发生错误时触发
readStream.on('error', (error) => {
  console.error('读取错误:', error.message);
});
```

## ✏️ 可写流操作

### 创建可写流

```javascript
const fs = require('fs');

// 创建文件可写流
const writeStream = fs.createWriteStream('../pages/output.txt');
```

### 写入数据

```javascript
// 写入数据
writeStream.write('第一行数据\n', 'utf8');
writeStream.write('第二行数据\n', 'utf8');

// 标记写入结束
writeStream.end();
```

### 监听可写流事件

```javascript
// 监听写入完成事件
writeStream.on('finish', () => {
  console.log('数据写入完成');
});

// 监听写入错误事件
writeStream.on('error', (error) => {
  console.error('写入错误:', error.message);
});
```

## 🔄 管道操作

管道是连接流的最简单方式，可以将可读流的输出直接连接到可写流的输入：

### 基本管道

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('../pages/input.txt');
const writeStream = fs.createWriteStream('../pages/output.txt');

// 使用管道连接读写流
readStream.pipe(writeStream);

console.log('管道操作已启动');
```

### 链式管道

```javascript
const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('../pages/input.txt');
const writeStream = fs.createWriteStream('../pages/output.txt.gz');

// 链式管道：读取 → 压缩 → 写入
readStream
  .pipe(zlib.createGzip())
  .pipe(writeStream);

console.log('压缩管道操作已启动');
```

## 🗜️ 文件压缩示例

### 压缩文件

```javascript
const fs = require('fs');
const zlib = require('zlib');

// 创建流
const readStream = fs.createReadStream('../pages/data.txt');
const writeStream = fs.createWriteStream('../pages/data.txt.gz');

// 压缩管道
readStream
  .pipe(zlib.createGzip())
  .pipe(writeStream)
  .on('finish', () => {
    console.log('文件压缩完成');
  });
```

### 解压缩文件

```javascript
const fs = require('fs');
const zlib = require('zlib');

// 创建流
const readStreamGz = fs.createReadStream('../pages/data.txt.gz');
const writeStreamTxt = fs.createWriteStream('../pages/data_unzip.txt');

// 解压缩管道
readStreamGz
  .pipe(zlib.createGunzip())
  .pipe(writeStreamTxt)
  .on('finish', () => {
    console.log('文件解压缩完成');
  });
```

## 🔧 高级用法

### 转换流

```javascript
const { Transform } = require('stream');

// 创建转换流 - 将文本转为大写
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // 转换数据
    const transformed = chunk.toString().toUpperCase();
    callback(null, transformed);
  }
});

// 使用转换流
fs.createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('output.txt'));
```

### 背压处理

```javascript
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');

// 处理背压
readStream.on('data', (chunk) => {
  const canContinue = writeStream.write(chunk);
  
  if (!canContinue) {
    // 暂停读取
    readStream.pause();
    
    // 等待写入流排空
    writeStream.once('drain', () => {
      readStream.resume();
    });
  }
});
```

## 📊 性能优化

### 缓冲区大小

```javascript
const fs = require('fs');

// 设置缓冲区大小
const readStream = fs.createReadStream('file.txt', {
  highWaterMark: 1024 * 16 // 16KB 缓冲区
});

const writeStream = fs.createWriteStream('output.txt', {
  highWaterMark: 1024 * 16 // 16KB 缓冲区
});
```

### 监控流状态

```javascript
const readStream = fs.createReadStream('file.txt');

// 监控流状态
readStream.on('data', (chunk) => {
  console.log(`读取: ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('读取完成');
});

readStream.on('close', () => {
  console.log('流已关闭');
});
```

## 🎯 最佳实践

1. **正确处理错误**
   ```javascript
   stream.on('error', (err) => {
     console.error('流错误:', err);
     // 适当的错误处理
   });
   ```

2. **使用管道简化代码**
   ```javascript
   // 推荐：使用管道
   input.pipe(transform).pipe(output);
   
   // 不推荐：手动处理
   input.on('data', (chunk) => {
     transform.write(chunk);
   });
   ```

3. **合理设置缓冲区**
   ```javascript
   const stream = fs.createReadStream('file.txt', {
     highWaterMark: 1024 * 64 // 根据需要调整
   });
   ```

4. **及时关闭流**
   ```javascript
   stream.on('finish', () => {
     console.log('流处理完成');
   });
   
   stream.on('close', () => {
     console.log('流已关闭');
   });
   ```

---

::: tip 🔗 相关链接
- [Node.js Stream 官方文档](https://nodejs.org/api/stream.html)
- [流的工作原理](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)
- [管道操作详解](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options)
:::
