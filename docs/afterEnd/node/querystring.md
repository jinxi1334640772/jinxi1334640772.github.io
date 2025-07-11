---
title: Node.js querystring 查询字符串
description: Node.js querystring 模块详解 - URL查询参数解析、格式化和编码处理指南
outline: deep
---

# 🔗 Node.js querystring 查询字符串

querystring 模块提供了用于解析和格式化 URL 查询字符串的实用工具。虽然性能优于 URLSearchParams，但它是 Node.js 特有的 API，不符合 Web 标准。

::: tip 📚 本章内容
学习查询字符串的解析、格式化、编码解码以及在实际项目中的应用。
:::

## 1. 模块概述

### 🎯 什么是 querystring

querystring 模块是 Node.js 内置模块，专门用于处理 URL 查询字符串的解析和格式化操作。

### 📊 特性对比

| 特性 | querystring | URLSearchParams |
|------|-------------|-----------------|
| **性能** | 更高 | 较低 |
| **标准化** | Node.js 特有 | Web 标准 |
| **浏览器兼容** | ❌ | ✅ |
| **API 复杂度** | 简单 | 丰富 |

### 🔧 引入模块

```javascript
const querystring = require('querystring')
// 或使用解构赋值
const { parse, stringify, escape, unescape } = require('querystring')
```

## 2. 核心方法详解

### 📝 querystring.parse()

将查询字符串解析为对象：

```javascript
/**
 * @param {string} str - 要解析的查询字符串
 * @param {string} sep - 分隔符，默认 '&'
 * @param {string} eq - 等号，默认 '='
 * @param {Object} options - 解析选项
 * @returns {Object} 解析后的对象
 */
querystring.parse(str[, sep[, eq[, options]]])

// 基本用法
const qs = querystring.parse('name=张三&age=25&city=北京')
console.log(qs)
// { name: '张三', age: '25', city: '北京' }

// 处理数组参数
const qs2 = querystring.parse('colors=red&colors=blue&colors=green')
console.log(qs2)
// { colors: ['red', 'blue', 'green'] }

// 自定义分隔符
const qs3 = querystring.parse('name=张三;age=25;city=北京', ';')
console.log(qs3)
// { name: '张三', age: '25', city: '北京' }

// 自定义等号
const qs4 = querystring.parse('name:张三&age:25', '&', ':')
console.log(qs4)
// { name: '张三', age: '25' }
```

### 🔄 querystring.stringify()

将对象格式化为查询字符串：

```javascript
/**
 * @param {Object} obj - 要格式化的对象
 * @param {string} sep - 分隔符，默认 '&'
 * @param {string} eq - 等号，默认 '='
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的查询字符串
 */
querystring.stringify(obj[, sep[, eq[, options]]])

// 基本用法
const obj = { name: '张三', age: 25, city: '北京' }
const qs = querystring.stringify(obj)
console.log(qs)
// name=张三&age=25&city=北京

// 处理数组
const obj2 = { colors: ['red', 'blue', 'green'] }
const qs2 = querystring.stringify(obj2)
console.log(qs2)
// colors=red&colors=blue&colors=green

// 自定义分隔符
const qs3 = querystring.stringify(obj, ';')
console.log(qs3)
// name=张三;age=25;city=北京

// 自定义等号
const qs4 = querystring.stringify(obj, '&', ':')
console.log(qs4)
// name:张三&age:25&city:北京
```

### 🔐 编码和解码

```javascript
// querystring.escape() - 编码
const encoded = querystring.escape('hello world & 你好')
console.log(encoded)
// hello%20world%20%26%20%E4%BD%A0%E5%A5%BD

// querystring.unescape() - 解码
const decoded = querystring.unescape('hello%20world%20%26%20%E4%BD%A0%E5%A5%BD')
console.log(decoded)
// hello world & 你好
```

## 3. 高级选项配置

### ⚙️ parse() 选项

```javascript
const options = {
  // 解码函数
  decodeURIComponent: (str) => {
    try {
      return decodeURIComponent(str)
    } catch (e) {
      return str // 解码失败时返回原字符串
    }
  },
  // 最大键数量限制
  maxKeys: 100
}

// 处理编码的中文
const gbkString = 'name=%D5%C5%C8%FD&city=%B1%B1%BE%A9'
const parsed = querystring.parse(gbkString, null, null, {
  decodeURIComponent: (str) => {
    // 自定义 GBK 解码（需要额外的库）
    return str // 这里简化处理
  }
})

// 限制键的数量
const longQuery = 'a=1&b=2&c=3&d=4&e=5&f=6'
const limited = querystring.parse(longQuery, null, null, { maxKeys: 3 })
console.log(limited)
// { a: '1', b: '2', c: '3' } - 只解析前3个
```

### ⚙️ stringify() 选项

```javascript
const options = {
  // 编码函数
  encodeURIComponent: (str) => {
    return encodeURIComponent(str).replace(/'/g, '%27')
  }
}

const obj = { message: "Hello 'World'" }
const encoded = querystring.stringify(obj, null, null, options)
console.log(encoded)
// message=Hello%20%27World%27
```

## 4. 实际应用案例

### 🌐 HTTP 服务器中的应用

```javascript
const http = require('http')
const url = require('url')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url)
  
  if (req.method === 'GET') {
    // 解析 GET 请求的查询参数
    const query = querystring.parse(parsedUrl.query)
    console.log('GET 参数:', query)
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(query))
    
  } else if (req.method === 'POST') {
    let body = ''
    
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      // 解析 POST 请求体
      const postData = querystring.parse(body)
      console.log('POST 数据:', postData)
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(postData))
    })
  }
})

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

### 📋 表单数据处理

```javascript
const querystring = require('querystring')

// 模拟表单提交数据
const formData = {
  username: '张三',
  email: 'zhangsan@example.com',
  age: 25,
  hobbies: ['读书', '游泳', '编程'],
  newsletter: 'on'
}

// 转换为查询字符串
const queryStr = querystring.stringify(formData)
console.log('表单数据:', queryStr)
// username=张三&email=zhangsan@example.com&age=25&hobbies=读书&hobbies=游泳&hobbies=编程&newsletter=on

// 解析回对象
const parsed = querystring.parse(queryStr)
console.log('解析结果:', parsed)

// 数据验证和处理
function validateFormData(data) {
  const errors = {}
  
  if (!data.username) {
    errors.username = '用户名不能为空'
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.email = '邮箱格式不正确'
  }
  
  if (data.age && (isNaN(data.age) || data.age < 0)) {
    errors.age = '年龄必须是正数'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

const validation = validateFormData(parsed)
console.log('验证结果:', validation)
```

### 🔄 API 参数构建

```javascript
// API 请求参数构建器
class APIParamBuilder {
  constructor() {
    this.params = {}
  }
  
  // 添加参数
  add(key, value) {
    if (value !== undefined && value !== null && value !== '') {
      this.params[key] = value
    }
    return this
  }
  
  // 添加数组参数
  addArray(key, values) {
    if (Array.isArray(values) && values.length > 0) {
      this.params[key] = values
    }
    return this
  }
  
  // 构建查询字符串
  build() {
    return querystring.stringify(this.params)
  }
  
  // 重置参数
  reset() {
    this.params = {}
    return this
  }
}

// 使用示例
const builder = new APIParamBuilder()
const apiQuery = builder
  .add('page', 1)
  .add('limit', 20)
  .add('search', '关键词')
  .addArray('categories', ['tech', 'news'])
  .add('sort', 'created_at')
  .build()

console.log('API 查询参数:', apiQuery)
// page=1&limit=20&search=关键词&categories=tech&categories=news&sort=created_at
```

## 5. 特殊情况处理

### 🔍 空值和特殊字符

```javascript
// 处理各种边界情况
const testCases = [
  '',                          // 空字符串
  'key=',                      // 空值
  'key1=value1&key2=',        // 混合
  'key=value1&key=value2',    // 重复键
  'key[]=value1&key[]=value2', // 数组语法
  'a=1&b=2&a=3',              // 重复键合并
]

testCases.forEach((qs, index) => {
  console.log(`\n测试案例 ${index + 1}: "${qs}"`)
  console.log('解析结果:', querystring.parse(qs))
})

// 特殊字符处理
const specialChars = {
  space: 'hello world',
  symbols: '!@#$%^&*()',
  chinese: '你好世界',
  emoji: '😀🎉',
  quotes: "'single' \"double\"",
}

console.log('\n特殊字符编码:')
Object.entries(specialChars).forEach(([key, value]) => {
  const encoded = querystring.stringify({ [key]: value })
  console.log(`${key}: ${encoded}`)
})
```

### 🛡️ 安全性考虑

```javascript
// 安全的查询字符串解析
function safeParseQuery(queryStr, options = {}) {
  const defaultOptions = {
    maxKeys: 50,          // 限制键数量
    maxLength: 2048,      // 限制总长度
    maxValueLength: 256,  // 限制单个值长度
  }
  
  const opts = { ...defaultOptions, ...options }
  
  // 检查长度限制
  if (queryStr.length > opts.maxLength) {
    throw new Error(`查询字符串超出最大长度限制: ${opts.maxLength}`)
  }
  
  // 解析查询字符串
  const parsed = querystring.parse(queryStr, null, null, {
    maxKeys: opts.maxKeys
  })
  
  // 检查值的长度
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string' && value.length > opts.maxValueLength) {
      console.warn(`警告: 键 "${key}" 的值超出长度限制`)
      parsed[key] = value.substring(0, opts.maxValueLength)
    } else if (Array.isArray(value)) {
      parsed[key] = value.map(v => 
        typeof v === 'string' && v.length > opts.maxValueLength
          ? v.substring(0, opts.maxValueLength)
          : v
      )
    }
  }
  
  return parsed
}

// 使用示例
try {
  const safeResult = safeParseQuery('name=张三&message=' + 'a'.repeat(300))
  console.log('安全解析结果:', safeResult)
} catch (error) {
  console.error('解析错误:', error.message)
}
```

## 6. 性能优化

### ⚡ 缓存优化

```javascript
// 查询字符串缓存
class QueryStringCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }
  
  parse(queryStr) {
    if (this.cache.has(queryStr)) {
      return this.cache.get(queryStr)
    }
    
    const result = querystring.parse(queryStr)
    
    // 清理缓存
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(queryStr, result)
    return result
  }
  
  clear() {
    this.cache.clear()
  }
}

const cache = new QueryStringCache()

// 性能测试
console.time('缓存解析')
for (let i = 0; i < 1000; i++) {
  cache.parse('name=test&id=' + i)
}
console.timeEnd('缓存解析')
```

### 📊 批量处理

```javascript
// 批量处理查询字符串
function batchParseQueries(queries) {
  const results = []
  const errors = []
  
  for (let i = 0; i < queries.length; i++) {
    try {
      const parsed = querystring.parse(queries[i])
      results.push({ index: i, success: true, data: parsed })
    } catch (error) {
      errors.push({ index: i, error: error.message })
    }
  }
  
  return { results, errors }
}

// 批量格式化对象
function batchStringifyObjects(objects) {
  return objects.map((obj, index) => {
    try {
      return {
        index,
        success: true,
        queryString: querystring.stringify(obj)
      }
    } catch (error) {
      return {
        index,
        success: false,
        error: error.message
      }
    }
  })
}
```

## 7. 与其他模块集成

### 🔗 与 URL 模块结合

```javascript
const url = require('url')
const querystring = require('querystring')

// 完整的 URL 处理
function parseFullURL(urlString) {
  const parsedUrl = url.parse(urlString)
  const query = querystring.parse(parsedUrl.query)
  
  return {
    protocol: parsedUrl.protocol,
    host: parsedUrl.host,
    pathname: parsedUrl.pathname,
    query: query,
    hash: parsedUrl.hash
  }
}

const fullUrl = 'https://api.example.com/users?page=1&limit=10&search=张三#section1'
const parsed = parseFullURL(fullUrl)
console.log('完整解析结果:', parsed)
```

### 🌐 Express.js 集成

```javascript
const express = require('express')
const querystring = require('querystring')

const app = express()

// 中间件：解析查询参数
app.use((req, res, next) => {
  // Express 已经解析了 query，这里演示手动解析
  if (req.url.includes('?')) {
    const queryStr = req.url.split('?')[1]
    req.customQuery = querystring.parse(queryStr)
  }
  next()
})

app.get('/api/search', (req, res) => {
  // 获取查询参数
  const { q, page = 1, limit = 10 } = req.query
  
  // 构建响应
  const response = {
    query: q,
    page: parseInt(page),
    limit: parseInt(limit),
    // 生成下一页链接
    nextPage: querystring.stringify({
      q,
      page: parseInt(page) + 1,
      limit
    })
  }
  
  res.json(response)
})
```

## 8. 错误处理和调试

### 🐛 常见错误处理

```javascript
// 错误处理包装器
function robustQueryParse(queryStr) {
  try {
    // 预处理：移除可能导致问题的字符
    const cleaned = queryStr.replace(/[\r\n\t]/g, '')
    
    const result = querystring.parse(cleaned)
    
    // 后处理：类型转换和验证
    const processed = {}
    for (const [key, value] of Object.entries(result)) {
      // 尝试转换数字
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        processed[key] = parseInt(value)
      } else if (typeof value === 'string' && /^\d*\.\d+$/.test(value)) {
        processed[key] = parseFloat(value)
      } else {
        processed[key] = value
      }
    }
    
    return { success: true, data: processed }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      originalInput: queryStr 
    }
  }
}

// 测试各种输入
const testInputs = [
  'normal=test&number=123',
  'float=3.14&boolean=true',
  'malformed=test&&&invalid',
  '',
  'encoded=%E4%BD%A0%E5%A5%BD'
]

testInputs.forEach(input => {
  const result = robustQueryParse(input)
  console.log(`输入: "${input}"`)
  console.log('结果:', result)
  console.log('---')
})
```

## 9. 最佳实践

### 💡 使用建议

```javascript
// 1. 类型安全的查询解析
function typedQueryParse(queryStr, schema) {
  const parsed = querystring.parse(queryStr)
  const result = {}
  
  for (const [key, type] of Object.entries(schema)) {
    if (key in parsed) {
      switch (type) {
        case 'number':
          result[key] = Number(parsed[key])
          break
        case 'boolean':
          result[key] = parsed[key] === 'true'
          break
        case 'array':
          result[key] = Array.isArray(parsed[key]) ? parsed[key] : [parsed[key]]
          break
        default:
          result[key] = parsed[key]
      }
    }
  }
  
  return result
}

// 使用示例
const schema = {
  page: 'number',
  limit: 'number',
  active: 'boolean',
  tags: 'array',
  search: 'string'
}

const query = 'page=1&limit=10&active=true&tags=js&tags=node&search=tutorial'
const typed = typedQueryParse(query, schema)
console.log('类型化解析:', typed)

// 2. 查询字符串构建器
class QueryBuilder {
  constructor() {
    this.params = new Map()
  }
  
  set(key, value) {
    this.params.set(key, value)
    return this
  }
  
  append(key, value) {
    const existing = this.params.get(key)
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        this.params.set(key, [existing, value])
      }
    } else {
      this.params.set(key, value)
    }
    return this
  }
  
  delete(key) {
    this.params.delete(key)
    return this
  }
  
  toString() {
    const obj = Object.fromEntries(this.params)
    return querystring.stringify(obj)
  }
}
```

## 10. 参考资料

### 📚 官方文档
- [Node.js querystring 官方文档](https://nodejs.org/api/querystring.html)
- [URL API 参考](https://nodejs.org/api/url.html)

### 💡 相关资源
- [URLSearchParams vs querystring](https://nodejs.dev/learn/the-nodejs-url-module)
- [HTTP 查询参数最佳实践](https://developers.google.com/web/fundamentals)

### 🔗 相关模块
- [URL 模块](https://nodejs.org/api/url.html) - URL 解析和构建
- [HTTP 模块](./server.md) - HTTP 服务器开发
- [Express.js](https://expressjs.com/) - Web 框架中的查询参数处理

---

::: tip 💡 下一步
掌握查询字符串处理后，建议学习 [HTTP 服务器开发](./server.md)，了解如何在实际 Web 应用中处理请求参数。
:::
