---
title: Node.js assert 断言模块
description: Node.js assert 模块详解 - 单元测试、断言函数和错误处理指南
outline: deep
---

# ✅ Node.js assert 断言模块

assert 模块提供了一组用于验证不变量的断言函数。它是 Node.js 中用于编写单元测试和验证程序逻辑的重要工具，能够在条件不满足时抛出错误。

::: tip 📚 本章内容
学习 assert 模块的各种断言方法、测试编写技巧和错误处理最佳实践。
:::

## 1. 模块概述

### 🎯 什么是断言

断言是一种调试工具，用于验证程序在特定点的状态。如果断言失败，程序会抛出 `AssertionError`，帮助开发者快速定位问题。

### 📊 核心特性

| 特性 | 说明 |
|------|------|
| **严格模式** | 使用 `===` 进行比较 |
| **深度比较** | 比较对象和数组的内容 |
| **异步支持** | 支持 Promise 和异步函数测试 |
| **详细错误** | 提供清晰的错误信息 |

### 🔧 引入模块

```javascript
// 标准断言模式（非严格）
const assert = require('assert')

// 严格断言模式（推荐）
const assert = require('assert').strict
// 或者
const assert = require('assert/strict')
```

## 2. 基本断言方法

### ✅ assert()

最基本的断言函数，检查值是否为真：

```javascript
const assert = require('assert')

// 基本用法 - assert.ok() 的别名
assert(true)     // 通过
assert(1)        // 通过
assert('hello')  // 通过

// 失败情况
try {
  assert(false)  // 抛出 AssertionError
} catch (err) {
  console.log(err.message) // 'false == true'
}

// 自定义错误消息
assert(false, '这是一个自定义错误消息')

// 实际应用
function divide(a, b) {
  assert(b !== 0, '除数不能为零')
  return a / b
}

console.log(divide(10, 2)) // 5
// divide(10, 0) // 抛出错误：除数不能为零
```

### 🔍 assert.ok()

与 `assert()` 相同，检查值的真实性：

```javascript
// 检查各种值的真实性
assert.ok(true)        // ✅ 通过
assert.ok(1)           // ✅ 通过
assert.ok('string')    // ✅ 通过
assert.ok([])          // ✅ 通过（空数组是真值）
assert.ok({})          // ✅ 通过（空对象是真值）

// 失败的情况
const falsyValues = [false, 0, '', null, undefined, NaN]
falsyValues.forEach(value => {
  try {
    assert.ok(value)
  } catch (err) {
    console.log(`${value} 是假值:`, err.message)
  }
})
```

## 3. 相等性断言

### ⚖️ assert.equal() - 宽松相等

使用 `==` 操作符进行比较：

```javascript
// 数字和字符串的转换
assert.equal(1, '1')        // ✅ 通过（1 == '1'）
assert.equal(true, 1)       // ✅ 通过（true == 1）
assert.equal(false, 0)      // ✅ 通过（false == 0）

// NaN 特殊处理
assert.equal(NaN, NaN)      // ✅ 通过（assert 中 NaN 等于 NaN）

// 实际应用
function validateAge(age) {
  assert.equal(typeof age, 'number', '年龄必须是数字类型')
  assert.equal(age >= 0, true, '年龄不能为负数')
}
```

### 🎯 assert.strictEqual() - 严格相等

使用 `===` 操作符进行比较：

```javascript
// 严格类型检查
assert.strictEqual(1, 1)         // ✅ 通过
assert.strictEqual('hello', 'hello') // ✅ 通过

// 失败情况
try {
  assert.strictEqual(1, '1')     // ❌ 失败（类型不同）
} catch (err) {
  console.log(err.message) // 'Expected inputs to be strictly equal'
}

// 对象引用比较
const obj1 = { name: 'test' }
const obj2 = { name: 'test' }
const obj3 = obj1

assert.strictEqual(obj1, obj3)   // ✅ 通过（相同引用）
try {
  assert.strictEqual(obj1, obj2) // ❌ 失败（不同引用）
} catch (err) {
  console.log('对象引用不同')
}
```

### 🚫 不等性断言

```javascript
// assert.notEqual() - 宽松不等
assert.notEqual(1, 2)           // ✅ 通过
assert.notEqual('hello', 'world') // ✅ 通过

// assert.notStrictEqual() - 严格不等
assert.notStrictEqual(1, '1')    // ✅ 通过（类型不同）
assert.notStrictEqual(1, 2)      // ✅ 通过（值不同）

try {
  assert.notStrictEqual(1, 1)    // ❌ 失败（完全相同）
} catch (err) {
  console.log('值完全相同')
}
```

## 4. 深度比较断言

### 🔬 assert.deepEqual() - 深度宽松比较

递归比较对象和数组的内容：

```javascript
// 对象比较
const user1 = { name: '张三', age: 25 }
const user2 = { name: '张三', age: 25 }
assert.deepEqual(user1, user2) // ✅ 通过

// 数组比较
const arr1 = [1, 2, [3, 4]]
const arr2 = [1, 2, [3, 4]]
assert.deepEqual(arr1, arr2)   // ✅ 通过

// 嵌套对象比较
const complex1 = {
  users: [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ],
  meta: { total: 2 }
}
const complex2 = {
  users: [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ],
  meta: { total: 2 }
}
assert.deepEqual(complex1, complex2) // ✅ 通过

// 类型转换
assert.deepEqual({ a: 1 }, { a: '1' }) // ✅ 通过（宽松比较）
```

### 🎯 assert.deepStrictEqual() - 深度严格比较

递归进行严格比较：

```javascript
// 严格类型检查
const data1 = { count: 1, active: true }
const data2 = { count: 1, active: true }
assert.deepStrictEqual(data1, data2) // ✅ 通过

// 失败情况
try {
  assert.deepStrictEqual(
    { count: 1 }, 
    { count: '1' }  // 类型不同
  )
} catch (err) {
  console.log('类型不匹配:', err.message)
}

// Date 对象比较
const date1 = new Date('2023-01-01')
const date2 = new Date('2023-01-01')
assert.deepStrictEqual(date1, date2) // ✅ 通过

// 实际应用：API 响应验证
function validateApiResponse(response, expected) {
  assert.deepStrictEqual(
    response.data,
    expected.data,
    'API 响应数据不匹配'
  )
  assert.strictEqual(
    response.status,
    expected.status,
    'HTTP 状态码不匹配'
  )
}
```

### 🚫 深度不等比较

```javascript
// assert.notDeepEqual() - 深度宽松不等
assert.notDeepEqual({ a: 1 }, { a: 2 }) // ✅ 通过

// assert.notDeepStrictEqual() - 深度严格不等
assert.notDeepStrictEqual({ a: 1 }, { a: '1' }) // ✅ 通过（类型不同）

// 验证对象确实不同
const original = { id: 1, data: [1, 2, 3] }
const modified = { id: 1, data: [1, 2, 3, 4] }
assert.notDeepStrictEqual(original, modified, '对象应该不同')
```

## 5. 异常和错误断言

### 🚨 assert.throws() - 异常断言

验证函数是否抛出预期的错误：

```javascript
// 基本用法
assert.throws(() => {
  throw new Error('测试错误')
}, Error)

// 指定错误类型
assert.throws(() => {
  throw new TypeError('类型错误')
}, TypeError)

// 使用正则表达式匹配错误消息
assert.throws(() => {
  throw new Error('文件未找到')
}, /文件.*找到/)

// 自定义验证函数
assert.throws(() => {
  throw new Error('Access denied')
}, (err) => {
  assert.strictEqual(err.name, 'Error')
  assert(err.message.includes('denied'))
  return true
}, '错误验证失败')

// 实际应用：测试输入验证
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new Error('无效的邮箱格式')
  }
  return true
}

// 测试异常情况
assert.throws(() => {
  validateEmail('invalid-email')
}, /无效的邮箱格式/)

// 测试正常情况
assert.doesNotThrow(() => {
  validateEmail('user@example.com')
})
```

### 🛡️ assert.doesNotThrow() - 不应抛出异常

验证函数不会抛出错误：

```javascript
// 验证函数正常执行
assert.doesNotThrow(() => {
  JSON.parse('{"name": "test"}')
}, '解析 JSON 失败')

// 带错误类型检查
assert.doesNotThrow(() => {
  const arr = [1, 2, 3]
  arr.push(4)
}, TypeError)

// 实际应用：配置验证
function loadConfig(configData) {
  const config = JSON.parse(configData)
  if (!config.port || config.port < 1000) {
    throw new Error('端口配置无效')
  }
  return config
}

// 测试有效配置
assert.doesNotThrow(() => {
  loadConfig('{"port": 3000, "host": "localhost"}')
}, '加载配置失败')
```

### ❌ assert.ifError() - 错误检查

检查值是否为 `null` 或 `undefined`，否则抛出错误：

```javascript
// 正常情况
assert.ifError(null)      // ✅ 通过
assert.ifError(undefined) // ✅ 通过

// 错误情况
try {
  assert.ifError(new Error('出错了'))
} catch (err) {
  console.log('捕获到错误:', err.message)
}

// 实际应用：回调函数错误处理
function readFileCallback(err, data) {
  assert.ifError(err) // 如果有错误，立即抛出
  
  // 处理数据
  console.log('文件内容:', data)
}

// 模拟文件读取
function simulateFileRead(callback) {
  // 模拟成功
  callback(null, '文件内容')
  
  // 模拟失败
  // callback(new Error('文件不存在'), null)
}

simulateFileRead(readFileCallback)
```

## 6. 异步断言

### 🔄 assert.rejects() - Promise 拒绝

验证 Promise 被拒绝：

```javascript
// 测试 Promise 拒绝
async function testAsyncError() {
  await assert.rejects(
    Promise.reject(new Error('异步错误')),
    Error,
    'Promise 应该被拒绝'
  )
}

// 测试异步函数
async function testAsyncFunction() {
  async function failingFunction() {
    throw new Error('功能失败')
  }
  
  await assert.rejects(
    failingFunction(),
    /功能失败/,
    '异步函数应该失败'
  )
}

// 实际应用：API 错误测试
async function testApiError() {
  async function fetchUser(id) {
    if (id < 0) {
      throw new Error('用户 ID 无效')
    }
    return { id, name: 'User' + id }
  }
  
  // 测试错误情况
  await assert.rejects(
    fetchUser(-1),
    Error,
    '应该拒绝无效的用户 ID'
  )
  
  console.log('API 错误测试通过')
}

testAsyncError().then(() => console.log('异步错误测试完成'))
testAsyncFunction().then(() => console.log('异步函数测试完成'))
testApiError()
```

### ✅ assert.doesNotReject() - Promise 不应拒绝

验证 Promise 不会被拒绝：

```javascript
// 测试 Promise 成功
async function testAsyncSuccess() {
  await assert.doesNotReject(
    Promise.resolve('成功'),
    'Promise 不应该被拒绝'
  )
}

// 测试异步函数成功
async function testAsyncFunctionSuccess() {
  async function successFunction() {
    return '操作成功'
  }
  
  await assert.doesNotReject(
    successFunction(),
    '异步函数不应该失败'
  )
}

// 实际应用：数据库连接测试
async function testDatabaseConnection() {
  async function connectToDatabase() {
    // 模拟数据库连接
    return new Promise((resolve) => {
      setTimeout(() => resolve('连接成功'), 100)
    })
  }
  
  await assert.doesNotReject(
    connectToDatabase(),
    '数据库连接应该成功'
  )
  
  console.log('数据库连接测试通过')
}

testAsyncSuccess().then(() => console.log('异步成功测试完成'))
testAsyncFunctionSuccess().then(() => console.log('异步函数成功测试完成'))
testDatabaseConnection()
```

## 7. 字符串和正则断言

### 📝 assert.match() - 正则匹配

验证字符串与正则表达式匹配：

```javascript
// 基本正则匹配
assert.match('hello world', /world/) // ✅ 通过
assert.match('JavaScript', /Script/) // ✅ 通过

// 邮箱验证
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
assert.match('user@example.com', emailRegex, '邮箱格式正确')

// 手机号验证
const phoneRegex = /^1[3-9]\d{9}$/
assert.match('13812345678', phoneRegex, '手机号格式正确')

// 实际应用：输入验证
function validateInput(input, type) {
  const patterns = {
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    url: /^https?:\/\/.+/
  }
  
  assert.match(input, patterns[type], `${type} 格式不正确`)
  return true
}

// 测试输入验证
assert.doesNotThrow(() => {
  validateInput('john_doe', 'username')
  validateInput('https://example.com', 'url')
})
```

### 🚫 assert.doesNotMatch() - 不匹配

验证字符串不与正则表达式匹配：

```javascript
// 验证不匹配
assert.doesNotMatch('hello', /world/) // ✅ 通过
assert.doesNotMatch('123', /[a-z]/)   // ✅ 通过（不包含小写字母）

// 安全检查：不包含危险字符
const dangerousPatterns = /<script|javascript:|on\w+=/i
assert.doesNotMatch(
  'Hello World', 
  dangerousPatterns, 
  '输入包含危险字符'
)

// 密码强度检查（反向）
const weakPasswordPattern = /^(123456|password|qwerty)$/i
assert.doesNotMatch(
  'MyStr0ngP@ssw0rd', 
  weakPasswordPattern, 
  '密码过于简单'
)
```

## 8. 实际应用案例

### 🧪 单元测试框架

```javascript
// 简单的测试框架
class SimpleTest {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }
  
  // 添加测试用例
  test(name, fn) {
    this.tests.push({ name, fn })
  }
  
  // 运行所有测试
  async run() {
    console.log(`运行 ${this.tests.length} 个测试...\n`)
    
    for (const test of this.tests) {
      try {
        await test.fn()
        console.log(`✅ ${test.name}`)
        this.passed++
      } catch (error) {
        console.log(`❌ ${test.name}`)
        console.log(`   错误: ${error.message}\n`)
        this.failed++
      }
    }
    
    this.printSummary()
  }
  
  printSummary() {
    const total = this.passed + this.failed
    console.log(`\n测试结果: ${this.passed}/${total} 通过`)
    
    if (this.failed > 0) {
      console.log(`❌ ${this.failed} 个测试失败`)
      process.exit(1)
    } else {
      console.log('🎉 所有测试通过!')
    }
  }
}

// 使用示例
const test = new SimpleTest()

// 数学函数测试
function add(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

test.test('加法测试', () => {
  assert.strictEqual(add(2, 3), 5)
  assert.strictEqual(add(-1, 1), 0)
  assert.strictEqual(add(0, 0), 0)
})

test.test('乘法测试', () => {
  assert.strictEqual(multiply(2, 3), 6)
  assert.strictEqual(multiply(-2, 3), -6)
  assert.strictEqual(multiply(0, 5), 0)
})

test.test('异步测试', async () => {
  function asyncAdd(a, b) {
    return Promise.resolve(a + b)
  }
  
  const result = await asyncAdd(5, 3)
  assert.strictEqual(result, 8)
})

// test.run()
```

### 📊 数据验证器

```javascript
// 数据验证器类
class DataValidator {
  constructor() {
    this.rules = new Map()
  }
  
  // 添加验证规则
  addRule(field, validator, message) {
    if (!this.rules.has(field)) {
      this.rules.set(field, [])
    }
    this.rules.get(field).push({ validator, message })
  }
  
  // 验证数据
  validate(data) {
    const errors = []
    
    for (const [field, validators] of this.rules) {
      const value = data[field]
      
      for (const { validator, message } of validators) {
        try {
          validator(value, data)
        } catch (error) {
          errors.push({
            field,
            message: message || error.message,
            value
          })
        }
      }
    }
    
    if (errors.length > 0) {
      const error = new Error('数据验证失败')
      error.errors = errors
      throw error
    }
    
    return true
  }
}

// 验证规则定义
const userValidator = new DataValidator()

userValidator.addRule('name', (value) => {
  assert(typeof value === 'string', '姓名必须是字符串')
  assert(value.length >= 2, '姓名至少2个字符')
  assert(value.length <= 50, '姓名不能超过50个字符')
}, '姓名格式不正确')

userValidator.addRule('email', (value) => {
  assert(typeof value === 'string', '邮箱必须是字符串')
  assert.match(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, '邮箱格式不正确')
}, '邮箱验证失败')

userValidator.addRule('age', (value) => {
  assert(typeof value === 'number', '年龄必须是数字')
  assert(value >= 0, '年龄不能为负数')
  assert(value <= 150, '年龄不能超过150岁')
}, '年龄不合法')

userValidator.addRule('password', (value, data) => {
  assert(typeof value === 'string', '密码必须是字符串')
  assert(value.length >= 8, '密码至少8位')
  assert.match(value, /[A-Z]/, '密码必须包含大写字母')
  assert.match(value, /[a-z]/, '密码必须包含小写字母')
  assert.match(value, /\d/, '密码必须包含数字')
}, '密码强度不够')

// 测试数据验证
function testUserValidation() {
  const validUser = {
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    password: 'MyPassword123'
  }
  
  const invalidUser = {
    name: 'A',  // 太短
    email: 'invalid-email',  // 格式错误
    age: -5,    // 负数
    password: '123'  // 太简单
  }
  
  // 测试有效数据
  assert.doesNotThrow(() => {
    userValidator.validate(validUser)
  }, '有效用户数据应该通过验证')
  
  // 测试无效数据
  assert.throws(() => {
    userValidator.validate(invalidUser)
  }, (err) => {
    assert(err.message.includes('验证失败'))
    assert(Array.isArray(err.errors))
    assert(err.errors.length > 0)
    return true
  }, '无效用户数据应该验证失败')
  
  console.log('✅ 数据验证测试通过')
}

testUserValidation()
```

### 🔧 配置文件验证

```javascript
// 配置验证器
class ConfigValidator {
  static validateServerConfig(config) {
    // 验证基本结构
    assert(typeof config === 'object', '配置必须是对象')
    assert(config !== null, '配置不能为 null')
    
    // 验证端口
    assert('port' in config, '缺少端口配置')
    assert(typeof config.port === 'number', '端口必须是数字')
    assert(config.port > 0 && config.port < 65536, '端口范围无效')
    
    // 验证主机
    assert('host' in config, '缺少主机配置')
    assert(typeof config.host === 'string', '主机必须是字符串')
    assert(config.host.length > 0, '主机不能为空')
    
    // 验证环境
    if ('env' in config) {
      const validEnvs = ['development', 'production', 'test']
      assert(validEnvs.includes(config.env), `环境必须是: ${validEnvs.join(', ')}`)
    }
    
    // 验证数据库配置
    if ('database' in config) {
      assert(typeof config.database === 'object', '数据库配置必须是对象')
      assert('url' in config.database, '缺少数据库 URL')
      assert.match(config.database.url, /^(mongodb|mysql|postgresql):\/\//, '数据库 URL 格式错误')
    }
    
    // 验证SSL配置
    if ('ssl' in config) {
      assert(typeof config.ssl === 'object', 'SSL 配置必须是对象')
      if (config.ssl.enabled) {
        assert('cert' in config.ssl, '启用 SSL 时必须提供证书路径')
        assert('key' in config.ssl, '启用 SSL 时必须提供密钥路径')
      }
    }
    
    return true
  }
  
  static validateClientConfig(config) {
    assert(typeof config === 'object', '客户端配置必须是对象')
    
    // API 配置
    assert('api' in config, '缺少 API 配置')
    assert(typeof config.api === 'object', 'API 配置必须是对象')
    assert('baseURL' in config.api, '缺少 API 基础 URL')
    assert.match(config.api.baseURL, /^https?:\/\//, 'API URL 格式错误')
    
    // 验证超时设置
    if ('timeout' in config.api) {
      assert(typeof config.api.timeout === 'number', '超时时间必须是数字')
      assert(config.api.timeout > 0, '超时时间必须大于0')
    }
    
    return true
  }
}

// 测试配置验证
function testConfigValidation() {
  // 有效服务器配置
  const validServerConfig = {
    port: 3000,
    host: 'localhost',
    env: 'development',
    database: {
      url: 'mongodb://localhost:27017/myapp'
    },
    ssl: {
      enabled: false
    }
  }
  
  // 无效服务器配置
  const invalidServerConfig = {
    port: '3000',  // 应该是数字
    host: '',      // 不能为空
    env: 'invalid' // 环境无效
  }
  
  // 测试有效配置
  assert.doesNotThrow(() => {
    ConfigValidator.validateServerConfig(validServerConfig)
  }, '有效服务器配置应该通过')
  
  // 测试无效配置
  assert.throws(() => {
    ConfigValidator.validateServerConfig(invalidServerConfig)
  }, '无效服务器配置应该失败')
  
  console.log('✅ 配置验证测试通过')
}

testConfigValidation()
```

## 9. 错误处理和调试

### 🐛 AssertionError 详解

```javascript
// 自定义 AssertionError 处理
function handleAssertionError(err) {
  if (err.name === 'AssertionError') {
    console.log('断言失败详情:')
    console.log('  实际值:', err.actual)
    console.log('  期望值:', err.expected)
    console.log('  操作符:', err.operator)
    console.log('  消息:', err.message)
    console.log('  代码:', err.generatedMessage ? '自动生成' : '自定义')
  }
}

// 测试错误处理
try {
  assert.strictEqual('hello', 'world', '字符串不匹配')
} catch (err) {
  handleAssertionError(err)
}

try {
  assert.deepStrictEqual({ a: 1 }, { a: 2 })
} catch (err) {
  handleAssertionError(err)
}
```

### 🔍 调试技巧

```javascript
// 调试辅助函数
function debugAssert(condition, message, context = {}) {
  if (!condition) {
    console.log('断言失败调试信息:')
    console.log('  条件:', condition)
    console.log('  消息:', message)
    console.log('  上下文:', context)
    console.trace('调用栈:')
  }
  assert(condition, message)
}

// 使用示例
function processUser(user) {
  debugAssert(
    user && typeof user === 'object',
    '用户对象无效',
    { receivedUser: user, type: typeof user }
  )
  
  debugAssert(
    user.id && typeof user.id === 'number',
    '用户 ID 无效',
    { userId: user.id, userObject: user }
  )
  
  return `处理用户: ${user.name} (ID: ${user.id})`
}

// 测试调试
try {
  processUser({ name: 'test' }) // 缺少 ID
} catch (err) {
  console.log('捕获到调试错误')
}
```

## 10. 性能和最佳实践

### ⚡ 性能优化

```javascript
// 条件断言 - 仅在开发环境执行
const isDevelopment = process.env.NODE_ENV !== 'production'

function devAssert(condition, message) {
  if (isDevelopment) {
    assert(condition, message)
  }
}

// 批量断言
function assertAll(assertions) {
  const errors = []
  
  assertions.forEach(({ condition, message }, index) => {
    try {
      assert(condition, message)
    } catch (err) {
      errors.push({ index, error: err.message })
    }
  })
  
  if (errors.length > 0) {
    const errorMessages = errors.map(e => `[${e.index}] ${e.error}`).join('\n')
    throw new Error(`多个断言失败:\n${errorMessages}`)
  }
}

// 使用示例
const user = { name: 'test', age: 25, email: 'test@example.com' }

assertAll([
  { condition: typeof user.name === 'string', message: '姓名必须是字符串' },
  { condition: user.age >= 0, message: '年龄不能为负' },
  { condition: user.email.includes('@'), message: '邮箱格式错误' }
])
```

### 💡 最佳实践

```javascript
// 1. 使用严格模式
const assert = require('assert').strict

// 2. 提供清晰的错误消息
function validatePassword(password) {
  assert(
    typeof password === 'string',
    `密码必须是字符串，收到 ${typeof password}`
  )
  
  assert(
    password.length >= 8,
    `密码长度至少8位，当前长度: ${password.length}`
  )
}

// 3. 断言分组
function validateUserComplete(user) {
  // 基本验证
  assert(user, '用户对象不能为空')
  assert(typeof user === 'object', '用户必须是对象')
  
  // 字段验证
  const requiredFields = ['name', 'email', 'age']
  requiredFields.forEach(field => {
    assert(
      field in user,
      `缺少必需字段: ${field}`
    )
  })
  
  // 类型验证
  assert(typeof user.name === 'string', '姓名必须是字符串')
  assert(typeof user.email === 'string', '邮箱必须是字符串')
  assert(typeof user.age === 'number', '年龄必须是数字')
  
  // 值验证
  assert(user.name.length > 0, '姓名不能为空')
  assert(user.email.includes('@'), '邮箱格式无效')
  assert(user.age >= 0, '年龄不能为负数')
}

// 4. 错误恢复
function safeAssert(condition, message, fallback) {
  try {
    assert(condition, message)
    return true
  } catch (err) {
    console.warn(`断言失败: ${message}`)
    if (typeof fallback === 'function') {
      return fallback()
    }
    return false
  }
}
```

## 11. 参考资料

### 📚 官方文档
- [Node.js assert 官方文档](https://nodejs.org/api/assert.html)
- [Error 对象参考](https://nodejs.org/api/errors.html)

### 💡 学习资源
- [单元测试最佳实践](https://nodejs.dev/learn/unit-testing)
- [JavaScript 测试框架对比](https://github.com/microsoft/playwright)

### 🔗 相关模块
- [Process 模块](./process.md) - 进程管理和环境变量
- [Util 模块](./util.md) - 实用工具函数
- [测试框架](https://jestjs.io/) - Jest、Mocha 等主流测试框架

---

::: tip 💡 下一步
掌握 assert 断言后，建议学习专业的测试框架如 Jest 或 Mocha，以及学习 [Util 模块](./util.md) 中的调试和格式化工具。
:::