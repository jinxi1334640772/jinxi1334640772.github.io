---
title: Node.js fs 文件系统
description: Node.js fs 模块详解 - 文件操作、目录管理、权限控制和异步IO处理指南
outline: deep
---

# 📁 Node.js fs 文件系统

node:fs 模块能够以标准 POSIX 函数为模型的方式与文件系统进行交互。它提供了完整的文件系统操作功能，包括文件读写、目录管理、权限控制等。

::: tip 📚 本章内容
深入学习 fs 模块的同步、异步和 Promise 操作方式，掌握文件系统的完整操作技巧。
:::

## 1. 模块概述

### 🎯 三种操作模式

所有文件系统操作都具有三种形式，并且可以使用 CommonJS 语法和 ES6 模块进行访问：

| 模式 | 特点 | 适用场景 |
|------|------|----------|
| **同步模式** | 阻塞执行，立即返回结果 | 启动脚本、配置读取 |
| **异步回调模式** | 非阻塞，通过回调处理结果 | 传统 Node.js 应用 |
| **Promise 模式** | 基于 Promise，支持 async/await | 现代应用开发 |

### 🔧 引入方式

```javascript
// 1. 基于 Promise 的操作（推荐）
const { unlink, readFile, writeFile } = require('node:fs/promises')

// 2. 传统回调模式
const fs = require('node:fs')

// 3. 同步模式
const fs = require('node:fs')
```

### 💡 操作示例对比

```javascript
// Promise 模式 - 推荐
async function deleteFile(path) {
  try {
    await unlink(path)
    console.log(`成功删除 ${path}`)
  } catch (error) {
    console.error('删除失败:', error.message)
  }
}

// 回调模式 - 传统
fs.unlink('/tmp/hello', (err) => {
  if (err) throw err
  console.log('成功删除 /tmp/hello')
})

// 同步模式 - 谨慎使用
try {
  fs.unlinkSync('/tmp/hello')
  console.log('成功删除 /tmp/hello')
} catch (err) {
  console.error('删除失败:', err.message)
}
```

## 2. 文件读写操作

### 📖 文件读取

```javascript
const fs = require('node:fs/promises')

// 读取文本文件
async function readTextFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8')
    console.log('文件内容:', data)
    return data
  } catch (error) {
    console.error('读取失败:', error.message)
    throw error
  }
}

// 读取二进制文件
async function readBinaryFile(filepath) {
  try {
    const buffer = await fs.readFile(filepath)
    console.log('文件大小:', buffer.length, '字节')
    return buffer
  } catch (error) {
    console.error('读取失败:', error.message)
    throw error
  }
}

// 传统回调方式
fs.readFile('../pages/test.txt', 'utf8', (error, data) => {
  if (!error) {
    console.log('文件内容:', data)
  } else {
    console.error('读取错误:', error.message)
  }
})

// 同步读取
try {
  const data = fs.readFileSync('../pages/test.txt', 'utf8')
  console.log('同步读取:', data)
} catch (error) {
  console.error('同步读取失败:', error.message)
}
```

### ✏️ 文件写入

```javascript
// 写入文本文件
async function writeTextFile(filepath, content) {
  try {
    await fs.writeFile(filepath, content, 'utf8')
    console.log(`成功写入 ${filepath}`)
  } catch (error) {
    console.error('写入失败:', error.message)
    throw error
  }
}

// 写入 JSON 数据
async function writeJsonFile(filepath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    await fs.writeFile(filepath, jsonString, 'utf8')
    console.log(`JSON 数据已写入 ${filepath}`)
  } catch (error) {
    console.error('写入 JSON 失败:', error.message)
    throw error
  }
}

// 追加内容
async function appendToFile(filepath, content) {
  try {
    await fs.appendFile(filepath, content, 'utf8')
    console.log(`内容已追加到 ${filepath}`)
  } catch (error) {
    console.error('追加失败:', error.message)
    throw error
  }
}

// 传统回调方式
fs.writeFile('../pages/test.txt', '你好，Node.js', 'utf8', (error) => {
  if (!error) {
    console.log('文件写入成功')
  } else {
    console.error('写入错误:', error.message)
  }
})
```

## 3. 文件和目录管理

### 🔍 文件状态检查

```javascript
// 检查文件是否存在
async function checkFileExists(filepath) {
  try {
    await fs.access(filepath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

// 获取文件详细信息
async function getFileInfo(filepath) {
  try {
    const stats = await fs.stat(filepath)
    
    return {
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      created: stats.birthtime,
      modified: stats.mtime,
      accessed: stats.atime,
      mode: stats.mode.toString(8), // 八进制权限
    }
  } catch (error) {
    console.error('获取文件信息失败:', error.message)
    throw error
  }
}

// 使用示例
async function fileOperations() {
  const filepath = './test.txt'
  
  const exists = await checkFileExists(filepath)
  console.log(`文件存在: ${exists}`)
  
  if (exists) {
    const info = await getFileInfo(filepath)
    console.log('文件信息:', info)
  }
}
```

### 📁 目录操作

```javascript
// 创建目录
async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`目录创建成功: ${dirPath}`)
  } catch (error) {
    console.error('创建目录失败:', error.message)
    throw error
  }
}

// 读取目录内容
async function readDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true })
    
    const result = {
      files: [],
      directories: []
    }
    
    for (const file of files) {
      if (file.isFile()) {
        result.files.push(file.name)
      } else if (file.isDirectory()) {
        result.directories.push(file.name)
      }
    }
    
    return result
  } catch (error) {
    console.error('读取目录失败:', error.message)
    throw error
  }
}

// 删除目录
async function removeDirectory(dirPath) {
  try {
    await fs.rmdir(dirPath, { recursive: true })
    console.log(`目录删除成功: ${dirPath}`)
  } catch (error) {
    console.error('删除目录失败:', error.message)
    throw error
  }
}

// 遍历目录树
async function walkDirectory(dirPath, callback) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)
      
      if (file.isDirectory()) {
        await walkDirectory(fullPath, callback)
      } else {
        await callback(fullPath, file)
      }
    }
  } catch (error) {
    console.error('遍历目录失败:', error.message)
    throw error
  }
}
```

## 4. 高级文件操作

### 🔒 文件权限控制

```javascript
// 检查文件权限
async function checkPermissions(filepath) {
  try {
    // 检查读权限
    await fs.access(filepath, fs.constants.R_OK)
    console.log('✅ 可读')
    
    // 检查写权限
    await fs.access(filepath, fs.constants.W_OK)
    console.log('✅ 可写')
    
    // 检查执行权限
    await fs.access(filepath, fs.constants.X_OK)
    console.log('✅ 可执行')
  } catch (error) {
    console.error('权限检查失败:', error.message)
  }
}

// 修改文件权限
async function changePermissions(filepath, mode) {
  try {
    await fs.chmod(filepath, mode)
    console.log(`权限修改成功: ${mode.toString(8)}`)
  } catch (error) {
    console.error('权限修改失败:', error.message)
    throw error
  }
}

// 修改文件所有者
async function changeOwner(filepath, uid, gid) {
  try {
    await fs.chown(filepath, uid, gid)
    console.log(`所有者修改成功: ${uid}:${gid}`)
  } catch (error) {
    console.error('所有者修改失败:', error.message)
    throw error
  }
}
```

### 📋 文件复制和移动

```javascript
// 复制文件
async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest)
    console.log(`文件复制成功: ${src} → ${dest}`)
  } catch (error) {
    console.error('文件复制失败:', error.message)
    throw error
  }
}

// 移动/重命名文件
async function moveFile(oldPath, newPath) {
  try {
    await fs.rename(oldPath, newPath)
    console.log(`文件移动成功: ${oldPath} → ${newPath}`)
  } catch (error) {
    console.error('文件移动失败:', error.message)
    throw error
  }
}

// 高级复制（带选项）
async function advancedCopy(src, dest, options = {}) {
  try {
    const {
      overwrite = false,
      preserveTimestamps = false
    } = options
    
    // 检查目标文件是否存在
    const destExists = await checkFileExists(dest)
    if (destExists && !overwrite) {
      throw new Error('目标文件已存在，且未设置覆盖选项')
    }
    
    // 复制文件
    await fs.copyFile(src, dest, overwrite ? 0 : fs.constants.COPYFILE_EXCL)
    
    // 保持时间戳
    if (preserveTimestamps) {
      const stats = await fs.stat(src)
      await fs.utimes(dest, stats.atime, stats.mtime)
    }
    
    console.log('高级复制完成')
  } catch (error) {
    console.error('高级复制失败:', error.message)
    throw error
  }
}
```

## 5. 文件监控

### 👁️ 文件变化监控

```javascript
// 监控文件变化
function watchFile(filepath, callback) {
  try {
    const watcher = fs.watch(filepath, { persistent: true }, (eventType, filename) => {
      console.log(`文件变化: ${eventType} - ${filename}`)
      callback(eventType, filename)
    })
    
    // 监控错误处理
    watcher.on('error', (error) => {
      console.error('监控错误:', error.message)
    })
    
    return watcher
  } catch (error) {
    console.error('启动监控失败:', error.message)
    throw error
  }
}

// 监控目录变化
function watchDirectory(dirPath, callback) {
  try {
    const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      console.log(`目录变化: ${eventType} - ${filename}`)
      callback(eventType, filename)
    })
    
    return watcher
  } catch (error) {
    console.error('启动目录监控失败:', error.message)
    throw error
  }
}

// 使用示例
const watcher = watchFile('./test.txt', (eventType, filename) => {
  if (eventType === 'change') {
    console.log(`${filename} 被修改了`)
  }
})

// 5秒后停止监控
setTimeout(() => {
  watcher.close()
  console.log('监控已停止')
}, 5000)
```

## 6. 流式文件操作

### 🌊 创建和使用流

```javascript
// 创建可读流
function createReadStream(filepath) {
  const readStream = fs.createReadStream(filepath, {
    encoding: 'utf8',
    highWaterMark: 16 * 1024, // 16KB 缓冲区
  })
  
  readStream.on('data', (chunk) => {
    console.log('读取数据块:', chunk.length)
  })
  
  readStream.on('end', () => {
    console.log('文件读取完成')
  })
  
  readStream.on('error', (error) => {
    console.error('读取错误:', error.message)
  })
  
  return readStream
}

// 创建可写流
function createWriteStream(filepath) {
  const writeStream = fs.createWriteStream(filepath, {
    encoding: 'utf8',
    highWaterMark: 16 * 1024,
  })
  
  writeStream.on('finish', () => {
    console.log('写入完成')
  })
  
  writeStream.on('error', (error) => {
    console.error('写入错误:', error.message)
  })
  
  return writeStream
}

// 管道操作
async function pipeFiles(inputFile, outputFile) {
  try {
    const readStream = fs.createReadStream(inputFile)
    const writeStream = fs.createWriteStream(outputFile)
    
    readStream.pipe(writeStream)
    
    return new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
      readStream.on('error', reject)
    })
  } catch (error) {
    console.error('管道操作失败:', error.message)
    throw error
  }
}
```

## 7. 实用工具函数

### 🛠️ 常用文件操作工具

```javascript
// 获取文件扩展名
function getFileExtension(filepath) {
  return path.extname(filepath).toLowerCase()
}

// 获取文件大小的可读格式
function formatFileSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// 清空目录但保留目录本身
async function emptyDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath)
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file)
      const stats = await fs.stat(fullPath)
      
      if (stats.isDirectory()) {
        await fs.rmdir(fullPath, { recursive: true })
      } else {
        await fs.unlink(fullPath)
      }
    }
    
    console.log(`目录已清空: ${dirPath}`)
  } catch (error) {
    console.error('清空目录失败:', error.message)
    throw error
  }
}

// 确保目录存在
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}
```

## 8. 错误处理和最佳实践

### ⚠️ 常见错误类型

```javascript
// 错误处理示例
async function robustFileOperation(filepath) {
  try {
    await fs.access(filepath)
    const data = await fs.readFile(filepath, 'utf8')
    return data
  } catch (error) {
    switch (error.code) {
      case 'ENOENT':
        console.error(`文件不存在: ${filepath}`)
        break
      case 'EACCES':
        console.error(`权限不足: ${filepath}`)
        break
      case 'EISDIR':
        console.error(`目标是目录而非文件: ${filepath}`)
        break
      default:
        console.error(`未知错误: ${error.message}`)
    }
    throw error
  }
}
```

### 🎯 最佳实践

::: tip 💡 文件操作最佳实践

1. **优先使用 Promise API**：避免回调地狱，代码更清晰
2. **合理使用同步操作**：仅在启动脚本或配置读取时使用
3. **错误处理完善**：总是处理可能的错误情况
4. **资源管理**：及时关闭文件流和监控器
5. **路径处理**：使用 `path` 模块处理文件路径
6. **编码指定**：明确指定文件编码格式
7. **权限检查**：操作前检查文件权限
8. **使用流处理大文件**：避免内存溢出

:::

## 9. 相关资源

- [Node.js fs 官方文档](https://nodejs.org/api/fs.html)
- [文件系统 POSIX 标准](https://pubs.opengroup.org/onlinepubs/9699919799/)
- [Node.js 错误码参考](https://nodejs.org/api/errors.html#errors_common_system_errors)

---

::: warning 🚨 注意事项
- 同步操作会阻塞事件循环，在生产环境中谨慎使用
- 大文件操作建议使用流式处理
- 跨平台路径处理需要特别注意
- 文件权限在不同操作系统中行为可能不同
:::
