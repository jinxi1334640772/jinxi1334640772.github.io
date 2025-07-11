---
title: Node.js readline 命令行交互
description: Node.js readline 模块详解 - 命令行输入输出、交互式界面和逐行读取指南
outline: deep
---

# 🎮 Node.js readline 命令行交互

readline 模块提供了一个接口，用于从可读流（如 process.stdin）中逐行读取数据。它是构建命令行工具和交互式应用程序的重要模块。

::: tip 📚 本章内容
学习 readline 的基本用法、事件处理、交互式界面构建和实际应用场景。
:::

## 1. 模块概述

### 🎯 什么是 readline

readline 模块允许 Node.js 应用程序从输入流中逐行读取数据，常用于创建命令行界面 (CLI) 和交互式程序。

### 📊 核心特性

| 特性 | 说明 |
|------|------|
| **逐行读取** | 从流中按行读取数据 |
| **历史记录** | 支持命令历史 |
| **自动补全** | 支持 Tab 自动补全 |
| **信号处理** | 处理 Ctrl+C、Ctrl+Z 等信号 |

### 🔧 引入模块

```javascript
const readline = require('readline')
const { stdin: input, stdout: output } = require('process')
```

## 2. 创建 readline 接口

### 🏗️ createInterface()

创建 readline 接口的基本方法：

```javascript
const rl = readline.createInterface({
  input: process.stdin,   // 输入流
  output: process.stdout, // 输出流
  prompt: '> ',          // 提示符
  historySize: 30,       // 历史记录大小
  removeHistoryDuplicates: true, // 移除重复历史
  crlfDelay: Infinity,   // 延迟识别 CRLF
  escapeCodeTimeout: 500, // 转义码超时
  tabSize: 8,            // Tab 尺寸
})

// 设置提示符
rl.setPrompt('请输入命令: ')
rl.prompt()

// 监听输入
rl.on('line', (input) => {
  console.log(`您输入了: ${input}`)
  rl.prompt()
})

// 监听关闭
rl.on('close', () => {
  console.log('再见!')
  process.exit(0)
})
```

### ⚙️ 高级配置

```javascript
const fs = require('fs')

// 高级配置示例
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    // 自动补全函数
    const completions = ['help', 'exit', 'clear', 'history']
    const hits = completions.filter(c => c.startsWith(line))
    return [hits.length ? hits : completions, line]
  },
  terminal: true,        // 是否为 TTY
  historySize: 100,      // 历史记录条数
  removeHistoryDuplicates: true,
})

// 从文件读取输入
const fileInput = fs.createReadStream('input.txt')
const fileRL = readline.createInterface({
  input: fileInput,
  output: process.stdout,
  crlfDelay: Infinity
})
```

## 3. 基本输入输出

### 📝 question() 方法

询问用户输入：

```javascript
// 基本问答
rl.question('请输入您的姓名: ', (name) => {
  console.log(`您好, ${name}!`)
  
  rl.question('请输入您的年龄: ', (age) => {
    console.log(`${name}, 您今年 ${age} 岁`)
    rl.close()
  })
})

// Promise 包装
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

// 使用 async/await
async function getUserInfo() {
  try {
    const name = await askQuestion('请输入您的姓名: ')
    const age = await askQuestion('请输入您的年龄: ')
    const email = await askQuestion('请输入您的邮箱: ')
    
    console.log('\n用户信息:')
    console.log(`姓名: ${name}`)
    console.log(`年龄: ${age}`)
    console.log(`邮箱: ${email}`)
    
    rl.close()
  } catch (error) {
    console.error('输入错误:', error)
    rl.close()
  }
}

getUserInfo()
```

### 🎨 格式化输出

```javascript
// 彩色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 进度条显示
function showProgress(current, total) {
  const percentage = Math.round((current / total) * 100)
  const barLength = 20
  const filledLength = Math.round((percentage / 100) * barLength)
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)
  
  process.stdout.write(`\r进度: [${bar}] ${percentage}% (${current}/${total})`)
  
  if (current === total) {
    console.log('\n✅ 完成!')
  }
}
```

## 4. 事件处理

### 📡 监听各种事件

```javascript
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 'line' 事件 - 接收到完整行
rl.on('line', (input) => {
  const trimmed = input.trim()
  
  if (trimmed === 'exit') {
    rl.close()
  } else if (trimmed === 'clear') {
    console.clear()
    rl.prompt()
  } else if (trimmed === 'help') {
    console.log('可用命令: help, clear, exit')
    rl.prompt()
  } else {
    console.log(`未知命令: ${trimmed}`)
    rl.prompt()
  }
})

// 'close' 事件 - 接口关闭
rl.on('close', () => {
  console.log('\n👋 再见!')
  process.exit(0)
})

// 'pause' 事件 - 输入流暂停
rl.on('pause', () => {
  console.log('输入已暂停')
})

// 'resume' 事件 - 输入流恢复
rl.on('resume', () => {
  console.log('输入已恢复')
})

// 'history' 事件 - 历史记录变化
rl.on('history', (history) => {
  console.log('历史记录更新:', history.slice(0, 3))
})
```

### ⌨️ 信号处理

```javascript
// 'SIGINT' 事件 - Ctrl+C
rl.on('SIGINT', () => {
  rl.question('确定要退出吗? (y/n) ', (answer) => {
    if (answer.match(/^y(es)?$/i)) {
      rl.close()
    } else {
      console.log('继续...')
      rl.prompt()
    }
  })
})

// 'SIGTSTP' 事件 - Ctrl+Z (Unix)
rl.on('SIGTSTP', () => {
  console.log('收到 SIGTSTP 信号')
  // 在 Unix 系统上，这会将进程发送到后台
})

// 'SIGCONT' 事件 - 从后台恢复
rl.on('SIGCONT', () => {
  console.log('进程已从后台恢复')
  rl.setPrompt('恢复> ')
  rl.prompt(true)
})
```

## 5. 高级功能

### 🔄 异步迭代器

```javascript
// 使用 for await...of 逐行处理
async function processLines() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  console.log('请输入文本 (输入 "end" 结束):')
  
  try {
    for await (const line of rl) {
      if (line.trim() === 'end') {
        break
      }
      
      // 处理每一行
      const processed = line.toUpperCase().split('').reverse().join('')
      console.log(`处理结果: ${processed}`)
    }
  } catch (error) {
    console.error('处理错误:', error)
  } finally {
    rl.close()
  }
}

processLines()
```

### 🎯 自动补全

```javascript
// 高级自动补全
const commands = {
  file: ['create', 'delete', 'copy', 'move'],
  user: ['add', 'remove', 'list', 'update'],
  system: ['status', 'restart', 'shutdown']
}

function advancedCompleter(line) {
  const parts = line.split(' ')
  const currentWord = parts[parts.length - 1]
  
  if (parts.length === 1) {
    // 补全主命令
    const mainCommands = Object.keys(commands)
    const hits = mainCommands.filter(cmd => cmd.startsWith(currentWord))
    return [hits, currentWord]
  } else if (parts.length === 2) {
    // 补全子命令
    const mainCommand = parts[0]
    if (commands[mainCommand]) {
      const subCommands = commands[mainCommand]
      const hits = subCommands.filter(cmd => cmd.startsWith(currentWord))
      return [hits, currentWord]
    }
  }
  
  return [[], currentWord]
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: advancedCompleter,
  prompt: 'cmd> '
})
```

### 📊 历史记录管理

```javascript
// 自定义历史记录管理
class HistoryManager {
  constructor(maxSize = 100) {
    this.history = []
    this.maxSize = maxSize
    this.currentIndex = -1
  }
  
  add(line) {
    if (line.trim() && this.history[0] !== line) {
      this.history.unshift(line)
      if (this.history.length > this.maxSize) {
        this.history.pop()
      }
    }
    this.currentIndex = -1
  }
  
  getPrevious() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }
  
  getNext() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      return this.history[this.currentIndex]
    } else if (this.currentIndex === 0) {
      this.currentIndex = -1
      return ''
    }
    return null
  }
  
  search(term) {
    return this.history.filter(item => 
      item.toLowerCase().includes(term.toLowerCase())
    )
  }
  
  save(filename) {
    const fs = require('fs')
    fs.writeFileSync(filename, this.history.join('\n'))
  }
  
  load(filename) {
    const fs = require('fs')
    try {
      const data = fs.readFileSync(filename, 'utf8')
      this.history = data.split('\n').filter(line => line.trim())
    } catch (error) {
      console.log('无法加载历史记录')
    }
  }
}
```

## 6. 实际应用案例

### 🛠️ 命令行工具

```javascript
// CLI 工具框架
class CLIApplication {
  constructor() {
    this.commands = new Map()
    this.rl = null
    this.running = false
  }
  
  // 注册命令
  addCommand(name, description, handler) {
    this.commands.set(name, { description, handler })
  }
  
  // 启动应用
  start() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '$ '
    })
    
    this.running = true
    console.log('🚀 CLI 工具已启动，输入 "help" 查看帮助')
    this.rl.prompt()
    
    this.rl.on('line', (input) => {
      this.handleCommand(input.trim())
    })
    
    this.rl.on('SIGINT', () => {
      this.stop()
    })
    
    // 注册基础命令
    this.addCommand('help', '显示帮助信息', () => this.showHelp())
    this.addCommand('exit', '退出程序', () => this.stop())
    this.addCommand('clear', '清屏', () => this.clear())
  }
  
  // 处理命令
  handleCommand(input) {
    if (!input) {
      this.rl.prompt()
      return
    }
    
    const [command, ...args] = input.split(' ')
    
    if (this.commands.has(command)) {
      try {
        this.commands.get(command).handler(args)
      } catch (error) {
        console.error(`❌ 命令执行错误: ${error.message}`)
      }
    } else {
      console.log(`❓ 未知命令: ${command}`)
    }
    
    if (this.running) {
      this.rl.prompt()
    }
  }
  
  // 显示帮助
  showHelp() {
    console.log('\n📖 可用命令:')
    this.commands.forEach((info, name) => {
      console.log(`  ${name.padEnd(12)} - ${info.description}`)
    })
    console.log()
  }
  
  // 清屏
  clear() {
    console.clear()
    console.log('🚀 CLI 工具')
  }
  
  // 停止应用
  stop() {
    this.running = false
    console.log('\n👋 再见!')
    this.rl.close()
    process.exit(0)
  }
}

// 使用示例
const app = new CLIApplication()

// 添加自定义命令
app.addCommand('date', '显示当前日期', () => {
  console.log(`📅 当前时间: ${new Date().toLocaleString()}`)
})

app.addCommand('calc', '简单计算器', (args) => {
  if (args.length !== 3) {
    console.log('用法: calc <数字1> <运算符> <数字2>')
    return
  }
  
  const [a, op, b] = args
  const num1 = parseFloat(a)
  const num2 = parseFloat(b)
  
  if (isNaN(num1) || isNaN(num2)) {
    console.log('❌ 请输入有效数字')
    return
  }
  
  let result
  switch (op) {
    case '+': result = num1 + num2; break
    case '-': result = num1 - num2; break
    case '*': result = num1 * num2; break
    case '/': result = num2 !== 0 ? num1 / num2 : '无法除以零'; break
    default: console.log('❌ 不支持的运算符'); return
  }
  
  console.log(`🧮 结果: ${num1} ${op} ${num2} = ${result}`)
})

app.start()
```

### 📋 交互式表单

```javascript
// 交互式表单收集器
class InteractiveForm {
  constructor() {
    this.fields = []
    this.data = {}
    this.rl = null
  }
  
  // 添加字段
  addField(name, prompt, validator = null, required = true) {
    this.fields.push({ name, prompt, validator, required })
    return this
  }
  
  // 验证器工厂
  static validators = {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? null : '请输入有效的邮箱地址'
    },
    
    phone: (value) => {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(value) ? null : '请输入有效的手机号码'
    },
    
    number: (value) => {
      return !isNaN(value) && value.trim() !== '' ? null : '请输入数字'
    },
    
    minLength: (min) => (value) => {
      return value.length >= min ? null : `至少需要 ${min} 个字符`
    }
  }
  
  // 处理单个字段
  async handleField(field) {
    return new Promise((resolve) => {
      const askField = () => {
        this.rl.question(field.prompt, (answer) => {
          // 检查必填项
          if (field.required && !answer.trim()) {
            console.log('❌ 此字段为必填项')
            askField()
            return
          }
          
          // 验证输入
          if (field.validator && answer.trim()) {
            const error = field.validator(answer)
            if (error) {
              console.log(`❌ ${error}`)
              askField()
              return
            }
          }
          
          this.data[field.name] = answer
          resolve()
        })
      }
      
      askField()
    })
  }
  
  // 运行表单
  async run() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    console.log('📝 请填写以下信息:\n')
    
    try {
      for (const field of this.fields) {
        await this.handleField(field)
      }
      
      console.log('\n✅ 表单填写完成!')
      console.log('📊 收集到的数据:')
      console.log(JSON.stringify(this.data, null, 2))
      
    } catch (error) {
      console.error('❌ 表单处理错误:', error)
    } finally {
      this.rl.close()
    }
    
    return this.data
  }
}

// 使用示例
async function collectUserData() {
  const form = new InteractiveForm()
    .addField('name', '姓名: ', InteractiveForm.validators.minLength(2))
    .addField('email', '邮箱: ', InteractiveForm.validators.email)
    .addField('phone', '手机: ', InteractiveForm.validators.phone)
    .addField('age', '年龄: ', InteractiveForm.validators.number)
    .addField('bio', '个人简介: ', null, false)
  
  const userData = await form.run()
  
  // 处理收集到的数据
  console.log('\n🎉 用户注册信息已收集完成!')
  return userData
}
```

### 🎮 游戏示例

```javascript
// 简单的猜数字游戏
class NumberGuessingGame {
  constructor() {
    this.targetNumber = Math.floor(Math.random() * 100) + 1
    this.attempts = 0
    this.maxAttempts = 7
    this.rl = null
  }
  
  start() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    console.log('🎯 欢迎来到猜数字游戏!')
    console.log(`我想了一个 1-100 之间的数字，你有 ${this.maxAttempts} 次机会猜中它。`)
    console.log('输入 "quit" 退出游戏\n')
    
    this.makeGuess()
  }
  
  makeGuess() {
    this.rl.question(`第 ${this.attempts + 1} 次猜测: `, (input) => {
      if (input.toLowerCase() === 'quit') {
        console.log(`🏃 游戏结束! 正确答案是 ${this.targetNumber}`)
        this.rl.close()
        return
      }
      
      const guess = parseInt(input)
      
      if (isNaN(guess) || guess < 1 || guess > 100) {
        console.log('❌ 请输入 1-100 之间的数字!')
        this.makeGuess()
        return
      }
      
      this.attempts++
      
      if (guess === this.targetNumber) {
        console.log(`🎉 恭喜! 你用 ${this.attempts} 次就猜中了!`)
        this.askPlayAgain()
      } else if (this.attempts >= this.maxAttempts) {
        console.log(`💀 游戏结束! 正确答案是 ${this.targetNumber}`)
        this.askPlayAgain()
      } else {
        const hint = guess < this.targetNumber ? '太小了! 📉' : '太大了! 📈'
        const remaining = this.maxAttempts - this.attempts
        console.log(`${hint} 还有 ${remaining} 次机会`)
        this.makeGuess()
      }
    })
  }
  
  askPlayAgain() {
    this.rl.question('\n🔄 再玩一局? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        this.targetNumber = Math.floor(Math.random() * 100) + 1
        this.attempts = 0
        console.log('\n🆕 新游戏开始!')
        this.makeGuess()
      } else {
        console.log('👋 谢谢游玩!')
        this.rl.close()
      }
    })
  }
}

// 启动游戏
// const game = new NumberGuessingGame()
// game.start()
```

## 7. 文件处理

### 📁 逐行读取文件

```javascript
// 大文件逐行处理
async function processLargeFile(filename) {
  const fs = require('fs')
  
  if (!fs.existsSync(filename)) {
    console.log('❌ 文件不存在')
    return
  }
  
  const fileStream = fs.createReadStream(filename)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  let lineNumber = 0
  let processedCount = 0
  
  try {
    for await (const line of rl) {
      lineNumber++
      
      // 处理每一行（示例：查找包含特定关键词的行）
      if (line.toLowerCase().includes('error')) {
        console.log(`第 ${lineNumber} 行包含错误: ${line}`)
        processedCount++
      }
      
      // 显示进度（每1000行显示一次）
      if (lineNumber % 1000 === 0) {
        process.stdout.write(`\r已处理 ${lineNumber} 行...`)
      }
    }
    
    console.log(`\n✅ 处理完成! 共处理 ${lineNumber} 行，找到 ${processedCount} 个匹配项`)
    
  } catch (error) {
    console.error('❌ 文件处理错误:', error)
  }
}

// 日志分析器
class LogAnalyzer {
  constructor(filename) {
    this.filename = filename
    this.stats = {
      total: 0,
      errors: 0,
      warnings: 0,
      info: 0
    }
    this.errors = []
  }
  
  async analyze() {
    const fs = require('fs')
    const fileStream = fs.createReadStream(this.filename)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    
    console.log(`📊 开始分析日志文件: ${this.filename}`)
    
    for await (const line of rl) {
      this.stats.total++
      
      if (line.includes('[ERROR]')) {
        this.stats.errors++
        this.errors.push({ line: this.stats.total, content: line })
      } else if (line.includes('[WARNING]')) {
        this.stats.warnings++
      } else if (line.includes('[INFO]')) {
        this.stats.info++
      }
    }
    
    this.printReport()
  }
  
  printReport() {
    console.log('\n📈 分析结果:')
    console.log(`总行数: ${this.stats.total}`)
    console.log(`错误: ${this.stats.errors}`)
    console.log(`警告: ${this.stats.warnings}`)
    console.log(`信息: ${this.stats.info}`)
    
    if (this.errors.length > 0) {
      console.log('\n❌ 错误详情:')
      this.errors.slice(0, 5).forEach(error => {
        console.log(`第 ${error.line} 行: ${error.content}`)
      })
      
      if (this.errors.length > 5) {
        console.log(`... 还有 ${this.errors.length - 5} 个错误`)
      }
    }
  }
}
```

## 8. 性能优化和最佳实践

### ⚡ 性能优化

```javascript
// 优化的大数据处理
class OptimizedReader {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 1000
    this.bufferSize = options.bufferSize || 64 * 1024
    this.processedCount = 0
  }
  
  async processBatch(lines) {
    // 批量处理行数据
    return lines.map(line => line.trim().toUpperCase())
  }
  
  async processStream(stream) {
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
      terminal: false
    })
    
    let batch = []
    const results = []
    
    for await (const line of rl) {
      batch.push(line)
      
      if (batch.length >= this.batchSize) {
        const processed = await this.processBatch(batch)
        results.push(...processed)
        this.processedCount += batch.length
        batch = []
        
        // 显示进度
        if (this.processedCount % 10000 === 0) {
          process.stdout.write(`\r已处理 ${this.processedCount} 行`)
        }
      }
    }
    
    // 处理剩余的行
    if (batch.length > 0) {
      const processed = await this.processBatch(batch)
      results.push(...processed)
      this.processedCount += batch.length
    }
    
    console.log(`\n✅ 总共处理 ${this.processedCount} 行`)
    return results
  }
}
```

### 💡 最佳实践

```javascript
// 1. 资源清理
function createSafeInterface(options) {
  const rl = readline.createInterface(options)
  
  // 确保资源清理
  process.on('exit', () => rl.close())
  process.on('SIGINT', () => rl.close())
  process.on('SIGTERM', () => rl.close())
  
  return rl
}

// 2. 错误处理
function robustReadline(stream) {
  return new Promise((resolve, reject) => {
    const lines = []
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    })
    
    rl.on('line', (line) => {
      lines.push(line)
    })
    
    rl.on('close', () => {
      resolve(lines)
    })
    
    rl.on('error', (error) => {
      rl.close()
      reject(error)
    })
    
    // 超时处理
    const timeout = setTimeout(() => {
      rl.close()
      reject(new Error('读取超时'))
    }, 30000)
    
    rl.on('close', () => {
      clearTimeout(timeout)
    })
  })
}

// 3. 内存管理
class MemoryEfficientProcessor {
  constructor(maxMemoryMB = 100) {
    this.maxMemory = maxMemoryMB * 1024 * 1024
    this.currentMemory = 0
  }
  
  checkMemory() {
    const usage = process.memoryUsage()
    this.currentMemory = usage.heapUsed
    
    if (this.currentMemory > this.maxMemory) {
      console.warn('⚠️ 内存使用过高，建议优化')
      // 触发垃圾回收
      if (global.gc) {
        global.gc()
      }
    }
  }
  
  async processWithMemoryCheck(stream) {
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    })
    
    let lineCount = 0
    
    for await (const line of rl) {
      // 处理行数据
      this.processLine(line)
      lineCount++
      
      // 每1000行检查一次内存
      if (lineCount % 1000 === 0) {
        this.checkMemory()
      }
    }
  }
  
  processLine(line) {
    // 实际的行处理逻辑
    return line.trim()
  }
}
```

## 9. 参考资料

### 📚 官方文档
- [Node.js readline 官方文档](https://nodejs.org/api/readline.html)
- [TTY 终端相关文档](https://nodejs.org/api/tty.html)

### 💡 学习资源
- [Building Command Line Tools with Node.js](https://nodejs.dev/learn/command-line-tools)
- [Stream 处理指南](https://nodejs.org/en/knowledge/advanced/streams/)

### 🔗 相关模块
- [Process 模块](./process.md) - 进程管理和信号处理
- [Stream 模块](./stream.md) - 流式数据处理
- [File System 模块](./fs.md) - 文件系统操作

---

::: tip 💡 下一步
掌握 readline 后，建议学习 [Process 模块](./process.md)，了解进程管理和信号处理，构建更完整的命令行应用。
:::
