---
title: Node.js test 测试模块
description: Node.js test 模块详解 - 单元测试、测试套件、生命周期钩子和测试运行器指南
outline: deep
---

# 🧪 Node.js test 测试模块

Node.js 内置的 test 模块为 JavaScript 应用程序提供了全面的测试功能。它支持同步和异步测试、测试套件组织、生命周期钩子等特性，是构建可靠应用程序的重要工具。

::: tip 📚 本章内容
学习 Node.js 测试模块的基本用法、测试组织、生命周期管理和最佳实践。
:::

## 1. 测试模块概述

### 🎯 测试函数的三种处理方式

test 模块创建的测试由单个函数组成，该函数以三种方式之一进行处理：

| 方式 | 描述 | 适用场景 |
|------|------|----------|
| **同步函数** | 如果抛出异常则失败，否则通过 | 简单的同步逻辑测试 |
| **Promise 函数** | 如果 Promise 拒绝则失败，否则通过 | 异步操作测试 |
| **回调函数** | 接收回调函数，根据回调参数判断 | 传统异步模式测试 |

### 🔧 引入测试模块

```javascript
const test = require('node:test')
const { describe, it } = require('node:test')
const assert = require('node:assert')
```

## 2. 基本测试用法

### ✅ 同步测试

```javascript
const test = require('node:test')
const assert = require('node:assert')

// 同步通过测试
test('同步测试 - 通过', (t) => {
  // 严格相等，测试通过
  assert.strictEqual(1, 1)
  assert.strictEqual('hello', 'hello')
  assert.ok(true)
})

// 同步失败测试
test('同步测试 - 失败', (t) => {
  // 不相等，测试失败，抛出错误
  assert.strictEqual(1, 2) // 这会导致测试失败
})

// 数学运算测试
test('数学运算测试', (t) => {
  const result = 2 + 2
  assert.strictEqual(result, 4)
  assert.ok(result > 0)
  assert.ok(typeof result === 'number')
})
```

### ⚡ 异步测试

```javascript
// Promise 异步测试
test('异步测试 - 通过', async (t) => {
  // 模拟异步操作
  const result = await Promise.resolve(42)
  assert.strictEqual(result, 42)
  
  // 文件操作测试
  const fs = require('node:fs/promises')
  const data = await fs.readFile('package.json', 'utf8')
  assert.ok(data.includes('name'))
})

// 异步失败测试
test('异步测试 - 失败', async (t) => {
  // Promise 拒绝，测试失败
  await Promise.reject(new Error('异步操作失败'))
})

// 网络请求测试
test('网络请求测试', async (t) => {
  const https = require('node:https')
  
  const response = await new Promise((resolve, reject) => {
    const req = https.get('https://api.github.com/users/nodejs', (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    })
    req.on('error', reject)
  })
  
  assert.ok(response.login)
  assert.strictEqual(response.login, 'nodejs')
})
```

### 📞 回调测试

```javascript
// 回调通过测试
test('回调测试 - 通过', (t, done) => {
  // done() 是没有参数的回调函数
  setImmediate(() => {
    assert.strictEqual(1, 1)
    done() // 调用 done() 表示测试成功
  })
})

// 回调失败测试
test('回调测试 - 失败', (t, done) => {
  // done() 抛出错误，测试失败
  setImmediate(() => {
    done(new Error('回调失败'))
  })
})

// 定时器测试
test('定时器测试', (t, done) => {
  const startTime = Date.now()
  
  setTimeout(() => {
    const endTime = Date.now()
    const duration = endTime - startTime
    
    assert.ok(duration >= 100) // 验证延迟时间
    done()
  }, 100)
})
```

## 3. 测试配置选项

### ⚙️ 测试选项详解

```javascript
// skip - 跳过测试
test('跳过的测试', { skip: true }, (t) => {
  // 这个测试会被跳过
  assert.strictEqual(1, 2)
})

// skip 带消息
test('跳过的测试 - 带消息', { skip: '暂时跳过，等待修复' }, (t) => {
  assert.strictEqual(1, 2)
})

// todo - 标记为待办
test('待办测试', { todo: true }, (t) => {
  // 标记为不完整，需要修复，不会被视为测试失败
  assert.strictEqual(1, 2)
})

// todo 带消息
test('待办测试 - 带消息', { todo: '需要实现新功能' }, (t) => {
  assert.strictEqual(1, 2)
})

// timeout - 设置超时
test('超时测试', { timeout: 1000 }, async (t) => {
  // 1秒后超时
  await new Promise(resolve => setTimeout(resolve, 500))
  assert.ok(true)
})

// only - 只运行指定测试
test('只运行此测试', { only: true }, (t) => {
  assert.strictEqual(1, 1)
})
```

### 🎛️ 测试上下文方法

```javascript
test('测试上下文方法', async (t) => {
  // 诊断信息
  t.diagnostic('这是一个诊断消息')
  
  // 设置生命周期钩子
  t.beforeEach((t) => t.diagnostic(`即将运行 ${t.name}`))
  t.afterEach((t) => t.diagnostic(`完成运行 ${t.name}`))
  
  // 快照测试
  t.assert.snapshot({ value1: 1, value2: 2 })
  
  // 断言
  t.assert.strictEqual(true, true)
  
  // 控制运行模式
  t.runOnly(true)
  await t.test('此子测试被跳过')
  await t.test('此子测试运行', { only: true })
  
  // 恢复运行所有测试
  t.runOnly(false)
  await t.test('此子测试现在运行')
  await t.test('跳过的子测试', { only: false })
  
  // 通过上下文跳过测试
  // t.skip()
  // t.skip('提示信息')
})
```

## 4. 测试套件组织

### 📦 describe 和 it

```javascript
const { describe, it } = require('node:test')
const assert = require('node:assert')

// describe 是 suite() 的别名
describe('用户管理模块', () => {
  // it 是 test() 的别名
  it('应该创建新用户', () => {
    const user = { id: 1, name: '张三' }
    assert.strictEqual(user.name, '张三')
    assert.strictEqual(user.id, 1)
  })
  
  it('应该验证用户邮箱', () => {
    const email = 'test@example.com'
    const isValid = email.includes('@')
    assert.ok(isValid)
  })
  
  it('应该处理用户权限', () => {
    const user = { role: 'admin', permissions: ['read', 'write'] }
    assert.ok(user.permissions.includes('read'))
    assert.ok(user.permissions.includes('write'))
  })
})

// 嵌套测试套件
describe('数据库操作', () => {
  describe('用户表操作', () => {
    it('应该插入用户', async () => {
      // 模拟数据库插入
      const result = await insertUser({ name: '李四', email: 'lisi@example.com' })
      assert.ok(result.id)
    })
    
    it('应该查询用户', async () => {
      // 模拟数据库查询
      const user = await findUser(1)
      assert.ok(user)
      assert.strictEqual(user.id, 1)
    })
  })
  
  describe('文章表操作', () => {
    it('应该创建文章', async () => {
      const article = await createArticle({ title: '测试文章', content: '内容' })
      assert.ok(article.id)
      assert.strictEqual(article.title, '测试文章')
    })
  })
})
```

### 🔄 子测试

```javascript
test('子测试示例', async (t) => {
  // await 用于确保两个子测试均已完成
  await t.test('子测试 1', (t) => {
    assert.strictEqual(1, 1)
  })
  
  await t.test('子测试 2', (t) => {
    assert.strictEqual(2, 2)
  })
  
  // 异步子测试
  await t.test('异步子测试', async (t) => {
    const result = await Promise.resolve(42)
    assert.strictEqual(result, 42)
  })
})
```

## 5. 生命周期钩子

### 🔗 生命周期函数

```javascript
const { describe, it, before, after, beforeEach, afterEach } = require('node:test')

describe('生命周期钩子示例', () => {
  // 在执行套件之前运行
  before(async () => {
    console.log('套件开始前执行')
    // 设置测试数据库
    await setupDatabase()
  })
  
  // 在执行套件后运行
  after(async () => {
    console.log('套件结束后执行')
    // 清理测试数据库
    await cleanupDatabase()
  })
  
  // 在每个测试之前运行
  beforeEach(async () => {
    console.log('每个测试前执行')
    // 重置测试数据
    await resetTestData()
  })
  
  // 在每个测试之后运行
  afterEach(async () => {
    console.log('每个测试后执行')
    // 清理测试痕迹
    await cleanupTestData()
  })
  
  it('测试 1', () => {
    assert.ok(true)
  })
  
  it('测试 2', () => {
    assert.ok(true)
  })
})

// 带选项的生命周期钩子
describe('高级生命周期钩子', () => {
  before(async () => {
    console.log('设置测试环境')
  }, { timeout: 5000 }) // 5秒超时
  
  beforeEach(async () => {
    console.log('准备测试数据')
  }, { timeout: 2000 }) // 2秒超时
  
  it('应该通过测试', () => {
    assert.strictEqual(1, 1)
  })
})
```

## 6. 测试运行和过滤

### 🎯 按名称过滤测试

测试名称模式被解释为 JavaScript 正则表达式：

```javascript
// 使用 --test-name-pattern="test [1-3]" 执行以下匹配项
test('test 1', async (t) => {
  await t.test('test 2', () => {
    assert.ok(true)
  })
  await t.test('test 3', () => {
    assert.ok(true)
  })
})

// 使用 --test-skip-pattern="test [4-5]" 跳过以下匹配项
test('Test 4', async (t) => {
  await t.test('Test 5', () => {
    assert.ok(true)
  })
  await t.test('test 6', () => {
    assert.ok(true)
  })
})
```

### 🎮 命令行运行

```bash
# 基本运行
node --test

# 指定测试文件
node --test "**/*.test.js" "**/*.spec.js"

# 按名称过滤
node --test --test-name-pattern="用户.*测试"

# 跳过特定测试
node --test --test-skip-pattern="集成测试"

# 监视模式
node --test --watch

# 覆盖率收集
node --test --experimental-test-coverage
```

## 7. 代码覆盖率

### 📊 覆盖率收集

```javascript
// 启用覆盖率收集
// node --test --experimental-test-coverage

// 使用注释控制覆盖率
function calculateDiscount(price, isVIP) {
  if (isVIP) {
    return price * 0.8
  }
  
  /* node:coverage disable */
  if (price > 10000) {
    // 这部分代码不会被覆盖率统计
    console.log('这是永远不会执行的代码')
  }
  /* node:coverage enable */
  
  return price * 0.9
}

// 测试覆盖率
test('折扣计算测试', (t) => {
  assert.strictEqual(calculateDiscount(100, true), 80)
  assert.strictEqual(calculateDiscount(100, false), 90)
})
```

## 8. 实际应用示例

### 🏗️ 完整的测试套件

```javascript
const { describe, it, before, after, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert')

// 模拟用户服务
class UserService {
  constructor() {
    this.users = new Map()
    this.nextId = 1
  }
  
  create(userData) {
    const user = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date()
    }
    this.users.set(user.id, user)
    return user
  }
  
  findById(id) {
    return this.users.get(id)
  }
  
  findByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email)
  }
  
  update(id, updates) {
    const user = this.users.get(id)
    if (!user) throw new Error('用户不存在')
    
    const updated = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }
  
  delete(id) {
    return this.users.delete(id)
  }
  
  clear() {
    this.users.clear()
    this.nextId = 1
  }
}

// 测试套件
describe('用户服务测试', () => {
  let userService
  
  before(() => {
    console.log('开始用户服务测试')
    userService = new UserService()
  })
  
  after(() => {
    console.log('用户服务测试完成')
  })
  
  beforeEach(() => {
    // 每个测试前清理数据
    userService.clear()
  })
  
  describe('用户创建', () => {
    it('应该创建新用户', () => {
      const userData = { name: '张三', email: 'zhangsan@example.com' }
      const user = userService.create(userData)
      
      assert.ok(user.id)
      assert.strictEqual(user.name, '张三')
      assert.strictEqual(user.email, 'zhangsan@example.com')
      assert.ok(user.createdAt instanceof Date)
    })
    
    it('应该自动分配递增ID', () => {
      const user1 = userService.create({ name: '用户1', email: 'user1@example.com' })
      const user2 = userService.create({ name: '用户2', email: 'user2@example.com' })
      
      assert.strictEqual(user1.id, 1)
      assert.strictEqual(user2.id, 2)
    })
  })
  
  describe('用户查询', () => {
    beforeEach(() => {
      // 准备测试数据
      userService.create({ name: '张三', email: 'zhangsan@example.com' })
      userService.create({ name: '李四', email: 'lisi@example.com' })
    })
    
    it('应该根据ID查询用户', () => {
      const user = userService.findById(1)
      assert.ok(user)
      assert.strictEqual(user.name, '张三')
    })
    
    it('应该根据邮箱查询用户', () => {
      const user = userService.findByEmail('lisi@example.com')
      assert.ok(user)
      assert.strictEqual(user.name, '李四')
    })
    
    it('查询不存在的用户应该返回undefined', () => {
      const user = userService.findById(999)
      assert.strictEqual(user, undefined)
    })
  })
  
  describe('用户更新', () => {
    let userId
    
    beforeEach(() => {
      const user = userService.create({ name: '张三', email: 'zhangsan@example.com' })
      userId = user.id
    })
    
    it('应该更新用户信息', () => {
      const updated = userService.update(userId, { name: '张三丰' })
      
      assert.strictEqual(updated.name, '张三丰')
      assert.strictEqual(updated.email, 'zhangsan@example.com') // 保持不变
      assert.ok(updated.updatedAt instanceof Date)
    })
    
    it('更新不存在的用户应该抛出错误', () => {
      assert.throws(() => {
        userService.update(999, { name: '不存在' })
      }, /用户不存在/)
    })
  })
  
  describe('用户删除', () => {
    it('应该删除用户', () => {
      const user = userService.create({ name: '张三', email: 'zhangsan@example.com' })
      const deleted = userService.delete(user.id)
      
      assert.strictEqual(deleted, true)
      assert.strictEqual(userService.findById(user.id), undefined)
    })
    
    it('删除不存在的用户应该返回false', () => {
      const deleted = userService.delete(999)
      assert.strictEqual(deleted, false)
    })
  })
})
```

## 9. 测试最佳实践

### 🎯 编写高质量测试

::: tip 💡 测试最佳实践

1. **测试命名清晰**：使用描述性的测试名称
2. **单一职责**：每个测试只验证一个功能点
3. **独立性**：测试之间不应相互依赖
4. **可重复性**：测试结果应该是一致的
5. **快速执行**：避免长时间运行的测试
6. **边界测试**：测试边界条件和异常情况
7. **使用生命周期钩子**：合理使用 before/after 钩子
8. **覆盖率关注**：追求有意义的代码覆盖率

:::

### 📝 测试文件组织

```
project/
├── src/
│   ├── user.js
│   ├── order.js
│   └── utils.js
├── test/
│   ├── user.test.js
│   ├── order.test.js
│   ├── utils.test.js
│   └── fixtures/
│       ├── users.json
│       └── orders.json
└── package.json
```

## 10. 相关资源

- [Node.js test 官方文档](https://nodejs.org/api/test.html)
- [Node.js assert 模块](https://nodejs.org/api/assert.html)
- [测试驱动开发最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

::: warning 🚨 注意事项
- 测试文件应该与源代码分离
- 使用 `--test` 标志运行测试
- 异步测试要正确处理 Promise 和回调
- 生命周期钩子的执行顺序很重要
- 测试失败时要提供清晰的错误信息
:::
