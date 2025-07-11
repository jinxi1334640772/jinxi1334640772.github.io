---
title: Node.js util 实用工具
description: Node.js util 模块详解 - 调试、格式化、继承和实用工具函数指南
outline: deep
---

# 🛠️ Node.js util 实用工具

util 模块提供了一系列实用工具函数，主要用于支持 Node.js API 的内部需求。这些函数包括调试、格式化、继承、类型检查等功能，是 Node.js 开发中的重要辅助工具。

::: tip 📚 本章内容
学习 util 模块的各种实用函数、调试技巧、对象操作和性能优化方法。
:::

## 1. 模块概述

### 🎯 什么是 util

util 模块是 Node.js 的核心模块之一，提供了一系列用于支持 Node.js 内部 API 和日常开发的实用函数。

### 📊 核心功能

| 功能类别 | 主要用途 |
|----------|----------|
| **调试工具** | inspect、debuglog |
| **格式化** | format、formatWithOptions |
| **继承机制** | inherits、_extend |
| **类型检查** | types 子模块 |
| **Promise 工具** | promisify、callbackify |

### 🔧 引入模块

```javascript
const util = require('util')

// 引入 types 子模块
const types = require('util').types
// 或者
const { types } = require('util')
```

## 2. 调试和检查

### 🔍 util.inspect() - 对象检查

格式化输出对象，用于调试：

```javascript
const util = require('util')

// 基本用法
const obj = {
  name: '张三',
  age: 25,
  hobbies: ['读书', '游泳'],
  address: {
    city: '北京',
    district: '朝阳区'
  }
}

console.log(util.inspect(obj))
// 输出格式化的对象结构

// 自定义选项
const options = {
  colors: true,        // 启用颜色
  depth: 2,           // 检查深度
  showHidden: false,  // 显示隐藏属性
  maxArrayLength: 10, // 数组最大长度
  maxStringLength: 50, // 字符串最大长度
  compact: false,     // 紧凑格式
  sorted: true,       // 排序属性
  getters: true       // 显示 getter
}

console.log(util.inspect(obj, options))
```

### 🎨 自定义检查行为

```javascript
// 自定义对象的 inspect 行为
class User {
  constructor(name, age) {
    this.name = name
    this.age = age
    this._password = 'secret123'
  }
  
  // 自定义 inspect 方法
  [util.inspect.custom](depth, options) {
    return `User(${this.name}, ${this.age})`
  }
}

const user = new User('李四', 30)
console.log(util.inspect(user))
// 输出: User(李四, 30)

// 使用 Symbol
class Product {
  constructor(name, price) {
    this.name = name
    this.price = price
  }
  
  [util.inspect.custom]() {
    return `Product { name: "${this.name}", price: $${this.price} }`
  }
}

const product = new Product('笔记本电脑', 5999)
console.log(util.inspect(product))
```

### 🐛 调试日志

```javascript
// util.debuglog() - 条件调试
const debuglog = util.debuglog('myapp')

// 只有当 NODE_DEBUG=myapp 时才会输出
debuglog('这是一个调试消息')
debuglog('用户登录: %s', 'zhangsan')

// 使用方法：
// NODE_DEBUG=myapp node app.js

// 多个调试标签
const dbDebug = util.debuglog('database')
const httpDebug = util.debuglog('http')

dbDebug('连接到数据库')
httpDebug('HTTP 请求: GET /api/users')

// 条件调试函数
function createDebugger(namespace) {
  const debug = util.debuglog(namespace)
  return function(...args) {
    const timestamp = new Date().toISOString()
    debug(`[${timestamp}]`, ...args)
  }
}

const apiDebug = createDebugger('api')
apiDebug('API 调用开始')
```

## 3. 字符串格式化

### 📝 util.format() - 字符串格式化

类似 printf 的字符串格式化：

```javascript
// 基本格式化
console.log(util.format('Hello %s', 'World'))
// 输出: Hello World

console.log(util.format('数字: %d, 字符串: %s', 42, 'test'))
// 输出: 数字: 42, 字符串: test

// 格式化说明符
console.log(util.format('%s: %d', 'Count', 100))     // %s: 字符串
console.log(util.format('%d%%', 95))                 // %d: 数字
console.log(util.format('%j', { name: 'test' }))     // %j: JSON
console.log(util.format('%o', { a: 1, b: 2 }))       // %o: 对象

// 多参数处理
console.log(util.format('用户 %s 年龄 %d 城市 %s', '张三', 25, '北京'))

// 额外参数会被添加到末尾
console.log(util.format('Hello', 'World', '!'))
// 输出: Hello World !
```

### ⚙️ util.formatWithOptions() - 带选项格式化

```javascript
// 自定义格式化选项
const formatOptions = {
  colors: true,
  depth: 3,
  compact: false
}

const complexObj = {
  users: [
    { id: 1, name: '张三', profile: { age: 25, city: '北京' } },
    { id: 2, name: '李四', profile: { age: 30, city: '上海' } }
  ],
  meta: { total: 2, page: 1 }
}

console.log(util.formatWithOptions(formatOptions, '数据: %o', complexObj))

// 创建格式化器
function createFormatter(options) {
  return function(template, ...args) {
    return util.formatWithOptions(options, template, ...args)
  }
}

const colorFormatter = createFormatter({ colors: true, depth: 2 })
const simpleFormatter = createFormatter({ colors: false, compact: true })

console.log(colorFormatter('结果: %o', { status: 'success', data: [1, 2, 3] }))
console.log(simpleFormatter('错误: %s', '网络连接失败'))
```

## 4. Promise 工具

### 🔄 util.promisify() - 回调转 Promise

将基于回调的函数转换为 Promise：

```javascript
const fs = require('fs')

// 传统回调方式
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 使用 promisify 转换
const readFileAsync = util.promisify(fs.readFile)

// 现在可以使用 async/await
async function readPackageJson() {
  try {
    const data = await readFileAsync('package.json', 'utf8')
    console.log(data)
  } catch (error) {
    console.error('读取文件失败:', error)
  }
}

// 批量转换
const fsPromises = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile),
  unlink: util.promisify(fs.unlink),
  mkdir: util.promisify(fs.mkdir)
}

// 使用示例
async function fileOperations() {
  try {
    // 读取文件
    const content = await fsPromises.readFile('input.txt', 'utf8')
    
    // 处理内容
    const processedContent = content.toUpperCase()
    
    // 写入新文件
    await fsPromises.writeFile('output.txt', processedContent)
    
    console.log('文件处理完成')
  } catch (error) {
    console.error('文件操作失败:', error)
  }
}
```

### 🔀 自定义 promisify

```javascript
// 为不标准的回调函数自定义 promisify
function customCallback(arg, callback) {
  setTimeout(() => {
    if (arg > 0) {
      callback(null, `结果: ${arg * 2}`)
    } else {
      callback(new Error('参数必须大于0'))
    }
  }, 100)
}

// 使用 util.promisify.custom 符号
customCallback[util.promisify.custom] = function(arg) {
  return new Promise((resolve, reject) => {
    if (arg > 0) {
      setTimeout(() => resolve(`自定义结果: ${arg * 3}`), 100)
    } else {
      setTimeout(() => reject(new Error('自定义错误')), 100)
    }
  })
}

const customAsync = util.promisify(customCallback)

async function testCustomPromisify() {
  try {
    const result = await customAsync(5)
    console.log(result) // 输出: 自定义结果: 15
  } catch (error) {
    console.error(error)
  }
}

testCustomPromisify()
```

### ↩️ util.callbackify() - Promise 转回调

将 Promise 函数转换为基于回调的函数：

```javascript
// Promise 函数
async function fetchUserData(userId) {
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (userId <= 0) {
    throw new Error('无效的用户ID')
  }
  
  return {
    id: userId,
    name: `User${userId}`,
    email: `user${userId}@example.com`
  }
}

// 转换为回调形式
const fetchUserDataCallback = util.callbackify(fetchUserData)

// 使用回调
fetchUserDataCallback(1, (err, data) => {
  if (err) {
    console.error('错误:', err.message)
  } else {
    console.log('用户数据:', data)
  }
})

// 处理拒绝的 Promise
async function failingFunction() {
  throw new Error('某些错误')
}

const failingCallback = util.callbackify(failingFunction)

failingCallback((err, result) => {
  console.log('错误:', err.message) // 输出: 错误: 某些错误
  console.log('结果:', result)       // 输出: 结果: undefined
})
```

## 5. 继承和对象操作

### 🧬 util.inherits() - 原型继承

实现构造函数之间的继承：

```javascript
// 基类
function Animal(name) {
  this.name = name
}

Animal.prototype.speak = function() {
  console.log(`${this.name} 发出声音`)
}

Animal.prototype.eat = function() {
  console.log(`${this.name} 正在吃东西`)
}

// 子类
function Dog(name, breed) {
  Animal.call(this, name)  // 调用父类构造函数
  this.breed = breed
}

// 设置继承关系
util.inherits(Dog, Animal)

// 重写方法
Dog.prototype.speak = function() {
  console.log(`${this.name} 汪汪叫`)
}

// 添加新方法
Dog.prototype.wagTail = function() {
  console.log(`${this.name} 摇尾巴`)
}

// 使用示例
const dog = new Dog('旺财', '金毛')
dog.speak()   // 旺财 汪汪叫
dog.eat()     // 旺财 正在吃东西
dog.wagTail() // 旺财 摇尾巴

console.log(dog instanceof Dog)    // true
console.log(dog instanceof Animal) // true
```

### 📦 复杂继承示例

```javascript
// 事件发射器基类
function EventEmitter() {
  this.events = {}
}

EventEmitter.prototype.on = function(event, listener) {
  if (!this.events[event]) {
    this.events[event] = []
  }
  this.events[event].push(listener)
}

EventEmitter.prototype.emit = function(event, ...args) {
  if (this.events[event]) {
    this.events[event].forEach(listener => listener(...args))
  }
}

// HTTP 服务器类
function HttpServer(port) {
  EventEmitter.call(this)
  this.port = port
  this.connections = []
}

util.inherits(HttpServer, EventEmitter)

HttpServer.prototype.listen = function() {
  console.log(`服务器监听端口 ${this.port}`)
  this.emit('listening')
  
  // 模拟连接
  setTimeout(() => {
    this.emit('connection', { id: 1, ip: '127.0.0.1' })
  }, 1000)
}

HttpServer.prototype.close = function() {
  console.log('服务器关闭')
  this.emit('close')
}

// 使用示例
const server = new HttpServer(3000)

server.on('listening', () => {
  console.log('服务器开始监听')
})

server.on('connection', (conn) => {
  console.log(`新连接: ${conn.ip}`)
})

server.on('close', () => {
  console.log('服务器已关闭')
})

server.listen()
```

## 6. 类型检查

### 🔍 util.types - 类型判断

精确的类型检查工具：

```javascript
const { types } = require('util')

// 基本类型检查
console.log(types.isDate(new Date()))           // true
console.log(types.isDate('2023-01-01'))         // false

console.log(types.isRegExp(/test/))              // true
console.log(types.isRegExp('test'))              // false

console.log(types.isArrayBuffer(new ArrayBuffer(8))) // true
console.log(types.isArrayBuffer(new Array(8)))       // false

// Promise 检查
console.log(types.isPromise(Promise.resolve()))  // true
console.log(types.isPromise({}))                 // false

// 异步函数检查
async function asyncFunc() {}
console.log(types.isAsyncFunction(asyncFunc))    // true
console.log(types.isGeneratorFunction(function*(){})) // true

// 类型化数组检查
console.log(types.isUint8Array(new Uint8Array())) // true
console.log(types.isFloat32Array(new Float32Array())) // true

// Map 和 Set 检查
console.log(types.isMap(new Map()))              // true
console.log(types.isSet(new Set()))              // true
console.log(types.isWeakMap(new WeakMap()))      // true
console.log(types.isWeakSet(new WeakSet()))      // true
```

### 🏷️ 实用类型检查函数

```javascript
// 自定义类型检查器
class TypeChecker {
  static getType(value) {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    
    // 使用 util.types 进行精确检查
    if (types.isDate(value)) return 'Date'
    if (types.isRegExp(value)) return 'RegExp'
    if (types.isPromise(value)) return 'Promise'
    if (types.isMap(value)) return 'Map'
    if (types.isSet(value)) return 'Set'
    if (types.isArrayBuffer(value)) return 'ArrayBuffer'
    if (types.isUint8Array(value)) return 'Uint8Array'
    
    // 基本类型
    const basicType = typeof value
    if (basicType !== 'object') return basicType
    
    // 数组检查
    if (Array.isArray(value)) return 'Array'
    
    // 普通对象
    return 'Object'
  }
  
  static isPlainObject(value) {
    return this.getType(value) === 'Object' && 
           value.constructor === Object
  }
  
  static isEmptyObject(value) {
    return this.isPlainObject(value) && 
           Object.keys(value).length === 0
  }
  
  static isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value))
  }
  
  static isIterable(value) {
    return value != null && typeof value[Symbol.iterator] === 'function'
  }
}

// 测试类型检查器
const testValues = [
  42,
  'hello',
  true,
  null,
  undefined,
  [],
  {},
  new Date(),
  /test/,
  new Map(),
  new Set(),
  Promise.resolve(),
  new Uint8Array()
]

testValues.forEach(value => {
  console.log(`${util.inspect(value)} -> ${TypeChecker.getType(value)}`)
})
```

## 7. 实际应用案例

### 🔧 调试工具包

```javascript
// 高级调试工具
class DebugTools {
  constructor(namespace = 'app') {
    this.namespace = namespace
    this.debuglog = util.debuglog(namespace)
    this.startTime = Date.now()
  }
  
  // 性能计时
  time(label) {
    this.debuglog(`⏱️  [${label}] 开始`)
    const start = process.hrtime.bigint()
    
    return () => {
      const end = process.hrtime.bigint()
      const duration = Number(end - start) / 1000000 // 转换为毫秒
      this.debuglog(`⏱️  [${label}] 完成 - ${duration.toFixed(2)}ms`)
      return duration
    }
  }
  
  // 内存使用监控
  memory(label) {
    const usage = process.memoryUsage()
    this.debuglog(`💾 [${label}] 内存使用:`)
    this.debuglog(`  RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`)
    this.debuglog(`  Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`)
    this.debuglog(`  Heap Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`)
    this.debuglog(`  External: ${(usage.external / 1024 / 1024).toFixed(2)} MB`)
  }
  
  // 对象深度检查
  inspect(obj, label = 'Object') {
    const options = {
      colors: true,
      depth: 4,
      showHidden: false,
      maxArrayLength: 10
    }
    this.debuglog(`🔍 [${label}]:`)
    this.debuglog(util.inspect(obj, options))
  }
  
  // 函数执行跟踪
  trace(fn, label) {
    return async (...args) => {
      const timer = this.time(label)
      this.debuglog(`📞 [${label}] 调用参数:`, args)
      
      try {
        const result = await fn(...args)
        this.debuglog(`✅ [${label}] 执行成功`)
        timer()
        return result
      } catch (error) {
        this.debuglog(`❌ [${label}] 执行失败:`, error.message)
        timer()
        throw error
      }
    }
  }
  
  // 运行时间统计
  uptime() {
    const uptimeMs = Date.now() - this.startTime
    const seconds = Math.floor(uptimeMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    this.debuglog(`⏰ 运行时间: ${hours}h ${minutes % 60}m ${seconds % 60}s`)
  }
}

// 使用示例
const debug = new DebugTools('myapp')

// 异步函数示例
async function fetchData(url) {
  await new Promise(resolve => setTimeout(resolve, 100))
  return { data: 'test data', url }
}

// 包装函数进行调试
const tracedFetchData = debug.trace(fetchData, 'fetchData')

async function demo() {
  debug.memory('启动时')
  
  const result = await tracedFetchData('https://api.example.com')
  debug.inspect(result, '获取的数据')
  
  debug.memory('执行后')
  debug.uptime()
}

// 启用调试: NODE_DEBUG=myapp node app.js
// demo()
```

### 📊 配置管理器

```javascript
// 配置管理器
class ConfigManager {
  constructor(defaultConfig = {}) {
    this.config = { ...defaultConfig }
    this.validators = new Map()
    this.formatters = new Map()
  }
  
  // 设置配置项
  set(key, value) {
    // 验证
    if (this.validators.has(key)) {
      const validator = this.validators.get(key)
      if (!validator(value)) {
        throw new Error(`配置项 ${key} 验证失败: ${util.inspect(value)}`)
      }
    }
    
    // 格式化
    if (this.formatters.has(key)) {
      const formatter = this.formatters.get(key)
      value = formatter(value)
    }
    
    this.config[key] = value
    return this
  }
  
  // 获取配置项
  get(key, defaultValue = null) {
    return this.config.hasOwnProperty(key) ? this.config[key] : defaultValue
  }
  
  // 添加验证器
  addValidator(key, validator) {
    this.validators.set(key, validator)
    return this
  }
  
  // 添加格式化器
  addFormatter(key, formatter) {
    this.formatters.set(key, formatter)
    return this
  }
  
  // 批量设置
  merge(newConfig) {
    Object.entries(newConfig).forEach(([key, value]) => {
      this.set(key, value)
    })
    return this
  }
  
  // 获取所有配置
  getAll() {
    return { ...this.config }
  }
  
  // 格式化输出配置
  toString() {
    return util.formatWithOptions(
      { colors: true, depth: 3 },
      '配置:\n%o',
      this.config
    )
  }
  
  // 验证所有配置
  validate() {
    const errors = []
    
    for (const [key, validator] of this.validators) {
      if (this.config.hasOwnProperty(key)) {
        try {
          if (!validator(this.config[key])) {
            errors.push(`配置项 ${key} 验证失败`)
          }
        } catch (error) {
          errors.push(`配置项 ${key} 验证出错: ${error.message}`)
        }
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`配置验证失败:\n${errors.join('\n')}`)
    }
    
    return true
  }
}

// 使用示例
const config = new ConfigManager({
  port: 3000,
  host: 'localhost',
  debug: false
})

// 添加验证器
config
  .addValidator('port', (value) => {
    return typeof value === 'number' && value > 0 && value < 65536
  })
  .addValidator('host', (value) => {
    return typeof value === 'string' && value.length > 0
  })
  .addValidator('timeout', (value) => {
    return typeof value === 'number' && value > 0
  })

// 添加格式化器
config
  .addFormatter('host', (value) => {
    return value.toLowerCase().trim()
  })
  .addFormatter('timeout', (value) => {
    return Math.max(1000, Math.min(30000, value)) // 限制在 1-30 秒
  })

// 设置配置
try {
  config
    .set('host', '  LOCALHOST  ')  // 会被格式化为 'localhost'
    .set('timeout', 500)           // 会被格式化为 1000
    .set('debug', true)
    .merge({
      ssl: true,
      workers: 4
    })
  
  config.validate()
  console.log(config.toString())
  
} catch (error) {
  console.error('配置错误:', error.message)
}
```

### 🔄 异步工具包

```javascript
// 异步工具包
class AsyncUtils {
  // Promise 重试机制
  static async retry(fn, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      backoff = 2,
      retryIf = () => true
    } = options
    
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries || !retryIf(error)) {
          throw error
        }
        
        const waitTime = delay * Math.pow(backoff, attempt)
        console.log(`重试 ${attempt + 1}/${maxRetries}，等待 ${waitTime}ms`)
        await this.sleep(waitTime)
      }
    }
    
    throw lastError
  }
  
  // 延迟函数
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // 超时包装
  static timeout(promise, ms, message = '操作超时') {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(message)), ms)
      })
    ])
  }
  
  // 并发控制
  static async concurrent(tasks, limit = 5) {
    const results = []
    const executing = []
    
    for (const task of tasks) {
      const promise = Promise.resolve(task()).then(result => {
        executing.splice(executing.indexOf(promise), 1)
        return result
      })
      
      results.push(promise)
      executing.push(promise)
      
      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
    
    return Promise.all(results)
  }
  
  // 将回调函数转换为 Promise（高级版本）
  static promisifyAdvanced(fn, context = null) {
    return util.promisify(fn.bind(context))
  }
  
  // 创建可取消的 Promise
  static cancellable(executor) {
    let cancel
    const cancelPromise = new Promise((_, reject) => {
      cancel = () => reject(new Error('操作已取消'))
    })
    
    const promise = Promise.race([
      new Promise(executor),
      cancelPromise
    ])
    
    promise.cancel = cancel
    return promise
  }
}

// 使用示例
async function demonstrateAsyncUtils() {
  // 重试示例
  const unstableFunction = async () => {
    if (Math.random() < 0.7) {
      throw new Error('随机失败')
    }
    return '成功！'
  }
  
  try {
    const result = await AsyncUtils.retry(unstableFunction, {
      maxRetries: 5,
      delay: 500,
      retryIf: (error) => error.message === '随机失败'
    })
    console.log('重试结果:', result)
  } catch (error) {
    console.log('重试失败:', error.message)
  }
  
  // 超时示例
  try {
    const slowOperation = async () => {
      await AsyncUtils.sleep(2000)
      return '慢操作完成'
    }
    
    const result = await AsyncUtils.timeout(slowOperation(), 1000, '操作超时')
    console.log(result)
  } catch (error) {
    console.log('超时错误:', error.message)
  }
  
  // 并发控制示例
  const tasks = Array.from({ length: 10 }, (_, i) => 
    () => AsyncUtils.sleep(100).then(() => `任务 ${i + 1} 完成`)
  )
  
  const results = await AsyncUtils.concurrent(tasks, 3)
  console.log('并发结果:', results)
}

// demonstrateAsyncUtils()
```

## 8. 性能优化和最佳实践

### ⚡ 性能监控

```javascript
// 性能监控器
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.debuglog = util.debuglog('performance')
  }
  
  // 开始监控
  start(name) {
    this.metrics.set(name, {
      startTime: process.hrtime.bigint(),
      startMemory: process.memoryUsage(),
      startCpu: process.cpuUsage()
    })
  }
  
  // 结束监控
  end(name) {
    const metric = this.metrics.get(name)
    if (!metric) {
      throw new Error(`未找到监控项: ${name}`)
    }
    
    const endTime = process.hrtime.bigint()
    const endMemory = process.memoryUsage()
    const endCpu = process.cpuUsage(metric.startCpu)
    
    const result = {
      duration: Number(endTime - metric.startTime) / 1000000, // 毫秒
      memoryDelta: {
        rss: endMemory.rss - metric.startMemory.rss,
        heapUsed: endMemory.heapUsed - metric.startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - metric.startMemory.heapTotal
      },
      cpuUsage: endCpu
    }
    
    this.debuglog(`性能报告 [${name}]:`)
    this.debuglog(`  执行时间: ${result.duration.toFixed(2)}ms`)
    this.debuglog(`  内存变化: ${(result.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`)
    this.debuglog(`  CPU 用户: ${(result.cpuUsage.user / 1000).toFixed(2)}ms`)
    this.debuglog(`  CPU 系统: ${(result.cpuUsage.system / 1000).toFixed(2)}ms`)
    
    this.metrics.delete(name)
    return result
  }
  
  // 包装函数进行监控
  wrap(fn, name) {
    return async (...args) => {
      this.start(name)
      try {
        const result = await fn(...args)
        return result
      } finally {
        this.end(name)
      }
    }
  }
}

// 使用示例
const monitor = new PerformanceMonitor()

// 包装异步函数
const monitoredFunction = monitor.wrap(async (size) => {
  // 模拟计算密集型操作
  const arr = new Array(size).fill(0).map((_, i) => i * 2)
  await new Promise(resolve => setTimeout(resolve, 10))
  return arr.reduce((sum, val) => sum + val, 0)
}, 'heavyComputation')

// 测试性能监控
// 启用: NODE_DEBUG=performance node app.js
// monitoredFunction(100000).then(result => {
//   console.log('计算结果:', result)
// })
```

### 💡 最佳实践

```javascript
// 工具函数最佳实践
class BestPractices {
  // 1. 安全的对象属性访问
  static safeGet(obj, path, defaultValue = undefined) {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue
    } catch {
      return defaultValue
    }
  }
  
  // 2. 深度克隆（利用 util.inspect）
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    
    try {
      // 利用 JSON 序列化（快速但有限制）
      return JSON.parse(JSON.stringify(obj))
    } catch {
      // 回退到手动克隆
      if (obj instanceof Date) return new Date(obj)
      if (obj instanceof Array) return obj.map(item => this.deepClone(item))
      if (typeof obj === 'object') {
        const cloned = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            cloned[key] = this.deepClone(obj[key])
          }
        }
        return cloned
      }
    }
    
    return obj
  }
  
  // 3. 缓存装饰器
  static memoize(fn, maxSize = 100) {
    const cache = new Map()
    
    return function(...args) {
      const key = util.inspect(args)
      
      if (cache.has(key)) {
        return cache.get(key)
      }
      
      const result = fn.apply(this, args)
      
      // 限制缓存大小
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      
      cache.set(key, result)
      return result
    }
  }
  
  // 4. 防抖函数
  static debounce(fn, delay) {
    let timeoutId
    return function(...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), delay)
    }
  }
  
  // 5. 节流函数
  static throttle(fn, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// 使用示例
const utils = BestPractices

// 缓存示例
const expensiveCalculation = utils.memoize((n) => {
  console.log(`计算 ${n} 的阶乘`)
  let result = 1
  for (let i = 1; i <= n; i++) {
    result *= i
  }
  return result
})

console.log(expensiveCalculation(5)) // 计算并缓存
console.log(expensiveCalculation(5)) // 从缓存返回

// 安全访问示例
const data = {
  user: {
    profile: {
      name: '张三',
      address: {
        city: '北京'
      }
    }
  }
}

console.log(utils.safeGet(data, 'user.profile.name'))           // 张三
console.log(utils.safeGet(data, 'user.profile.age', 25))       // 25 (默认值)
console.log(utils.safeGet(data, 'user.settings.theme'))        // undefined
```

## 9. 参考资料

### 📚 官方文档
- [Node.js util 官方文档](https://nodejs.org/api/util.html)
- [util.types 类型检查](https://nodejs.org/api/util.html#util_util_types)

### 💡 学习资源
- [Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Promise 和异步编程](https://nodejs.dev/learn/understanding-javascript-promises)

### 🔗 相关模块
- [Process 模块](./process.md) - 进程管理和调试
- [Events 模块](./events.md) - 事件机制
- [Stream 模块](./stream.md) - 流处理

---

::: tip 💡 下一步
掌握 util 工具函数后，建议学习 [Events 模块](./events.md)，了解 Node.js 的事件驱动机制和观察者模式。
:::
