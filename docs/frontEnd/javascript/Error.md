---
title: JavaScript 错误处理 - Error 对象
description: 详细介绍 JavaScript 中的 Error 对象及其子类，包括错误类型、构造函数、实例属性和实际应用场景
outline: deep
---

# JavaScript 错误处理 - Error 对象

JavaScript 中的 Error 对象是所有错误类型的基类，用于表示运行时错误。当程序执行过程中发生错误时，JavaScript 引擎会抛出相应的 Error 对象。

## Error 基类

Error 是所有错误类型的基础类，可以用于创建自定义错误或作为其他错误类型的父类。

### 构造函数

```javascript
/**
 * Error() 构造函数能够创建一个包含错误信息的对象
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径（可选）
 * @param {number} lineNumber - 引发错误的文件中的行号（可选）
 * @param {Object} options - 包含 cause 属性的对象，cause 指示错误的具体原因（可选）
 */
const error = new Error(message?, fileName?, lineNumber?, options?)

// 也可以不使用 new，直接调用
Error(message, fileName, lineNumber, options)
```

### 基本使用示例

```javascript
// 创建基本错误
const error1 = new Error('Something went wrong!');

// 创建带有具体原因的错误
const error2 = new Error('I was constructed via the "new" keyword!', {
  cause: '错误的具体原因！'
});

// 抛出错误
try {
  throw error2;
} catch (e) {
  console.log(e.name);     // "Error"
  console.log(e.message);  // "I was constructed via the "new" keyword!"
  console.log(e.cause);    // "错误的具体原因！"
}
```

### 实例属性

所有 Error 实例都具有以下属性：

| 属性 | 描述 | 示例 |
|------|------|------|
| `name` | 错误名称 | `"Error"` |
| `message` | 错误消息 | `"Something went wrong!"` |
| `cause` | 错误的具体原因 | `"网络连接失败"` |
| `fileName` | 发生错误的文件名 | `"app.js"` |
| `lineNumber` | 发生错误的行号 | `42` |
| `columnNumber` | 发生错误的列号 | `15` |
| `stack` | 错误堆栈信息 | 完整的调用堆栈 |

```javascript
const error = new Error('测试错误', { cause: '这是测试' });

console.log(error.name);        // "Error"
console.log(error.message);     // "测试错误"
console.log(error.cause);       // "这是测试"
console.log(error.stack);       // 完整的堆栈跟踪信息
```

## 内置错误类型

JavaScript 提供了多种内置的错误类型，每种都有特定的用途：

### AggregateError

用于包装多个错误对象的单个错误对象，当一个操作需要报告多个错误时使用。

```javascript
/**
 * @param {Array} errors - 一系列错误对象，实际上可能不是 Error 的实例
 * @param {string} message - 可选的对错误集合的可读描述
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new AggregateError(errors, message?, options?)
```

#### 使用示例

```javascript
try {
  throw new AggregateError([
    new Error("first error"),
    new Error("second error"),
    new TypeError("type error")
  ], "Multiple errors occurred");
} catch (e) {
  console.log(e instanceof AggregateError); // true
  console.log(e.message);                   // "Multiple errors occurred"
  console.log(e.name);                      // "AggregateError"
  console.log(e.errors);                    // [Error, Error, TypeError]
  
  // 遍历所有错误
  e.errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`, error.message);
  });
}
```

#### 实际应用场景

```javascript
// Promise.allSettled 的错误处理
async function processMultiplePromises() {
  const promises = [
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ];
  
  const results = await Promise.allSettled(promises);
  const errors = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
  
  if (errors.length > 0) {
    throw new AggregateError(errors, 'Multiple API calls failed');
  }
  
  return results.map(result => result.value);
}
```

### EvalError

表示 `eval()` 全局函数的错误。虽然现代 JavaScript 中很少直接抛出此错误，但它仍然可用于自定义错误处理。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new EvalError(message?, fileName?, lineNumber?, options?)
```

#### 使用示例

```javascript
try {
  throw new EvalError("Hello", "someFile.js", 10);
} catch (e) {
  console.log(e instanceof EvalError); // true
  console.log(e.message);              // "Hello"
  console.log(e.name);                 // "EvalError"
  console.log(e.fileName);             // "someFile.js"
  console.log(e.lineNumber);           // 10
  console.log(e.columnNumber);         // 0
}
```

::: info 序列化支持
EvalError 是一个可序列化对象，可以使用 `structuredClone()` 对它进行克隆，也可以使用 `postMessage()` 在 Worker 之间拷贝。
:::

### InternalError

表示出现在 JavaScript 引擎内部的错误，通常描述某种数量过多的情况。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new InternalError(message?, fileName?, lineNumber?, options?)
```

#### 常见场景

```javascript
// 递归过深
function recursiveFunction() {
  return recursiveFunction(); // 最终会导致 InternalError
}

// switch 语句过多分支
// 数组或对象过大
// 正则表达式过于复杂

try {
  throw new InternalError("Engine failure");
} catch (e) {
  console.log(e.name);    // "InternalError"
  console.log(e.message); // "Engine failure"
}
```

### RangeError

表示一个特定值不在所允许的范围或者集合中的错误。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new RangeError(message?, fileName?, lineNumber?, options?)
```

#### 常见触发场景

```javascript
// 数组长度超出范围
try {
  const arr = new Array(-1); // 负数长度
} catch (e) {
  console.log(e instanceof RangeError); // true
  console.log(e.message); // "Invalid array length"
}

// 数值超出有效范围
try {
  const num = (123).toFixed(-1); // 小数位数为负数
} catch (e) {
  console.log(e instanceof RangeError); // true
}

// 递归调用过深
function factorial(n) {
  if (n < 0) {
    throw new RangeError("The argument must be a non-negative integer");
  }
  return n <= 1 ? 1 : n * factorial(n - 1);
}

try {
  factorial(-5);
} catch (e) {
  console.log(e.message); // "The argument must be a non-negative integer"
}
```

### ReferenceError

代表当一个不存在（或尚未初始化）的变量被引用时发生的错误。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new ReferenceError(message?, fileName?, lineNumber?, options?)
```

#### 常见触发场景

```javascript
// 引用未定义的变量
try {
  console.log(undefinedVariable);
} catch (e) {
  console.log(e instanceof ReferenceError); // true
  console.log(e.message); // "undefinedVariable is not defined"
}

// 在声明前使用 let/const 变量（暂时性死区）
try {
  console.log(myLet); // ReferenceError
  let myLet = 'Hello';
} catch (e) {
  console.log(e instanceof ReferenceError); // true
}

// 自定义 ReferenceError
function checkVariable(name) {
  if (typeof window !== 'undefined' && !(name in window)) {
    throw new ReferenceError(`Variable '${name}' is not defined in global scope`);
  }
}
```

### SyntaxError

当 JavaScript 引擎解析代码时，遇到了不符合语法规范的标记或标记顺序时抛出。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new SyntaxError(message?, fileName?, lineNumber?, options?)
```

#### 常见触发场景

```javascript
// JSON 解析错误
try {
  JSON.parse('{"name": "John", "age": 30,}'); // 多余的逗号
} catch (e) {
  console.log(e instanceof SyntaxError); // true
  console.log(e.message); // "Unexpected token } in JSON at position 25"
}

// eval() 语法错误
try {
  eval('var x = ;'); // 语法错误
} catch (e) {
  console.log(e instanceof SyntaxError); // true
}

// 自定义 SyntaxError
function parseCustomFormat(input) {
  if (!input.match(/^[a-zA-Z]+:\d+$/)) {
    throw new SyntaxError(`Invalid format: ${input}. Expected format: 'name:number'`);
  }
  // 解析逻辑...
}

try {
  parseCustomFormat('invalid-format');
} catch (e) {
  console.log(e.message); // "Invalid format: invalid-format. Expected format: 'name:number'"
}
```

### TypeError

通常用来表示值的类型非预期类型时发生的错误。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new TypeError(message?, fileName?, lineNumber?, options?)
```

#### 常见触发场景

```javascript
// 调用非函数类型
try {
  const notAFunction = "I'm a string";
  notAFunction(); // TypeError
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.message); // "notAFunction is not a function"
}

// 访问 null 或 undefined 的属性
try {
  null.someProperty;
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.message); // "Cannot read properties of null"
}

// 类型检查函数
function processNumber(value) {
  if (typeof value !== 'number') {
    throw new TypeError(`Expected number, but got ${typeof value}`);
  }
  return value * 2;
}

try {
  processNumber("not a number");
} catch (e) {
  console.log(e.message); // "Expected number, but got string"
}
```

### URIError

表示以一种错误的方式使用全局 URI 处理函数而产生的错误。

```javascript
/**
 * @param {string} message - 人类可读的错误信息
 * @param {string} fileName - 引发此错误的文件路径
 * @param {number} lineNumber - 引发错误的文件中的行号
 * @param {Object} options - 包含 cause 属性的对象
 */
const error = new URIError(message?, fileName?, lineNumber?, options?)
```

#### 常见触发场景

```javascript
// 无效的 URI 编码
try {
  decodeURIComponent('%'); // 不完整的百分号编码
} catch (e) {
  console.log(e instanceof URIError); // true
  console.log(e.message); // "URI malformed"
}

// 无效的 URI 序列
try {
  decodeURI('%E0%A4%A'); // 不完整的 UTF-8 序列
} catch (e) {
  console.log(e instanceof URIError); // true
}

// 自定义 URI 验证
function validateURL(url) {
  try {
    decodeURIComponent(url);
    return true;
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError(`Invalid URL format: ${url}`);
    }
    throw e;
  }
}
```

## 错误类型对比表

| 错误类型 | 用途 | 常见场景 | 可序列化 |
|----------|------|----------|----------|
| `Error` | 通用错误基类 | 自定义错误、通用异常 | ✓ |
| `AggregateError` | 多个错误的集合 | Promise.any()、批量操作 | ✓ |
| `EvalError` | eval() 相关错误 | 动态代码执行 | ✓ |
| `InternalError` | 引擎内部错误 | 递归过深、资源耗尽 | ✓ |
| `RangeError` | 数值范围错误 | 数组长度、数值精度 | ✓ |
| `ReferenceError` | 引用错误 | 未定义变量、暂时性死区 | ✓ |
| `SyntaxError` | 语法错误 | JSON解析、代码语法 | ✓ |
| `TypeError` | 类型错误 | 类型不匹配、方法调用 | ✓ |
| `URIError` | URI 处理错误 | URL编码解码 | ✓ |

## 实际应用场景

### 1. 自定义错误类

```javascript
// 创建自定义错误类
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// 使用自定义错误
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!user.email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    throw new NetworkError(
      `Failed to fetch user: ${response.statusText}`,
      response.status
    );
  }
  
  return response.json();
}
```

### 2. 错误处理中间件

```javascript
// Express.js 错误处理中间件
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      field: err.field
    });
  }
  
  if (err instanceof NetworkError) {
    return res.status(err.statusCode).json({
      error: 'Network Error',
      message: err.message
    });
  }
  
  if (err instanceof TypeError) {
    return res.status(500).json({
      error: 'Type Error',
      message: 'Internal server error'
    });
  }
  
  // 默认错误处理
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
}
```

### 3. 错误重试机制

```javascript
class RetryableError extends Error {
  constructor(message, retryable = true) {
    super(message);
    this.name = 'RetryableError';
    this.retryable = retryable;
  }
}

async function withRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // 如果是不可重试的错误，直接抛出
      if (error instanceof RetryableError && !error.retryable) {
        throw error;
      }
      
      // 如果是最后一次尝试，抛出错误
      if (i === maxRetries) {
        throw new AggregateError(
          [lastError],
          `Failed after ${maxRetries + 1} attempts`
        );
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}

// 使用示例
async function unreliableOperation() {
  if (Math.random() < 0.7) {
    throw new RetryableError('Temporary failure', true);
  }
  return 'Success!';
}

try {
  const result = await withRetry(unreliableOperation, 3, 500);
  console.log(result);
} catch (error) {
  console.error('Operation failed:', error.message);
}
```

### 4. 错误边界（React 风格）

```javascript
class ErrorBoundary {
  constructor() {
    this.errors = [];
  }
  
  catch(fn) {
    try {
      return fn();
    } catch (error) {
      this.errors.push(error);
      this.handleError(error);
      return null;
    }
  }
  
  async catchAsync(fn) {
    try {
      return await fn();
    } catch (error) {
      this.errors.push(error);
      this.handleError(error);
      return null;
    }
  }
  
  handleError(error) {
    // 根据错误类型进行不同处理
    if (error instanceof ValidationError) {
      console.warn('Validation error:', error.message);
    } else if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
  
  getErrors() {
    return this.errors;
  }
  
  clearErrors() {
    this.errors = [];
  }
}

// 使用示例
const boundary = new ErrorBoundary();

const result = boundary.catch(() => {
  throw new ValidationError('Invalid input', 'username');
});

console.log(boundary.getErrors()); // [ValidationError]
```

### 5. 错误日志记录

```javascript
class ErrorLogger {
  constructor() {
    this.logs = [];
  }
  
  log(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      },
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A'
    };
    
    this.logs.push(logEntry);
    
    // 发送到错误监控服务
    this.sendToMonitoring(logEntry);
  }
  
  sendToMonitoring(logEntry) {
    // 模拟发送到监控服务
    console.log('Sending to monitoring service:', logEntry);
  }
  
  getLogs() {
    return this.logs;
  }
}

// 全局错误处理
const logger = new ErrorLogger();

// 捕获未处理的 Promise 拒绝
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    logger.log(event.reason, { type: 'unhandledrejection' });
  });
  
  window.addEventListener('error', (event) => {
    logger.log(event.error, { 
      type: 'error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
} else {
  // Node.js 环境
  process.on('unhandledRejection', (reason, promise) => {
    logger.log(reason, { type: 'unhandledRejection', promise });
  });
  
  process.on('uncaughtException', (error) => {
    logger.log(error, { type: 'uncaughtException' });
  });
}
```

## 最佳实践

### 1. 错误信息的编写

```javascript
// ❌ 不好的错误信息
throw new Error('Error');
throw new Error('Something went wrong');

// ✅ 好的错误信息
throw new Error('Failed to validate user email: email format is invalid');
throw new ValidationError('Email must contain @ symbol', 'email');
throw new NetworkError('Unable to connect to API server', 503);
```

### 2. 错误的分类和处理

```javascript
// 按照错误的性质进行分类
class BusinessError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.recoverable = true;
  }
}

class SystemError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SystemError';
    this.code = code;
    this.recoverable = false;
  }
}

class UserError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'UserError';
    this.field = field;
    this.recoverable = true;
  }
}
```

### 3. 错误的传播和包装

```javascript
// 错误包装，保留原始错误信息
function wrapError(originalError, message) {
  const wrappedError = new Error(message);
  wrappedError.cause = originalError;
  wrappedError.stack = originalError.stack;
  return wrappedError;
}

// 使用示例
async function processData(data) {
  try {
    return await complexOperation(data);
  } catch (error) {
    throw wrapError(error, `Failed to process data: ${error.message}`);
  }
}
```

### 4. 错误的测试

```javascript
// 测试错误处理
describe('Error handling', () => {
  it('should throw ValidationError for invalid email', () => {
    expect(() => {
      validateEmail('invalid-email');
    }).toThrow(ValidationError);
  });
  
  it('should include field information in ValidationError', () => {
    try {
      validateEmail('');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('email');
      expect(error.message).toContain('required');
    }
  });
});
```

## 性能考虑

### 1. 错误对象的创建成本

::: warning 性能影响
创建 Error 对象（特别是获取堆栈信息）有一定的性能开销。在高频执行的代码中要谨慎使用。
:::

```javascript
// 高性能的错误检查
function fastValidation(value) {
  // 使用简单的返回值而不是抛出错误
  if (typeof value !== 'string') {
    return { valid: false, error: 'Expected string' };
  }
  if (value.length === 0) {
    return { valid: false, error: 'String cannot be empty' };
  }
  return { valid: true };
}

// 只在必要时创建 Error 对象
function strictValidation(value) {
  const result = fastValidation(value);
  if (!result.valid) {
    throw new TypeError(result.error);
  }
  return value;
}
```

### 2. 堆栈跟踪的优化

```javascript
// 禁用堆栈跟踪以提高性能
class LightweightError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LightweightError';
    // 删除堆栈信息以节省内存和提高性能
    delete this.stack;
  }
}

// 条件性堆栈跟踪
class ConditionalError extends Error {
  constructor(message, includeStack = true) {
    super(message);
    this.name = 'ConditionalError';
    if (!includeStack) {
      delete this.stack;
    }
  }
}
```

## 总结

JavaScript 的错误处理系统提供了丰富的错误类型和灵活的处理机制：

- **Error 基类** - 所有错误的基础，提供基本的错误信息
- **内置错误类型** - 针对不同场景的专门错误类型
- **自定义错误** - 可以创建符合业务需求的错误类型
- **错误处理策略** - 包括重试、降级、日志记录等
- **性能优化** - 在高频场景中合理使用错误处理

合理使用错误处理机制可以让程序更加健壮，用户体验更好，同时也便于调试和维护。在实际开发中，应该根据具体场景选择合适的错误类型和处理策略。
