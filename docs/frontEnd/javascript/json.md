---
title: JavaScript JSON 处理
description: 详细介绍 JavaScript 中的 JSON 对象，包括 JSON.parse()、JSON.stringify() 等方法的使用和最佳实践
outline: deep
---

# JavaScript JSON 处理

JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。

## JSON 简介

JSON 是基于 JavaScript 的一个子集，但它是语言无关的数据格式，被广泛用于 Web 应用程序中的数据传输。

### JSON 的特点

- **轻量级** - 比 XML 更小、更快，解析效率更高
- **易读性** - 人类可读的文本格式
- **语言无关** - 支持多种编程语言（C、Python、C++、Java、PHP、Go 等）
- **结构化** - 支持对象和数组的嵌套结构

### JSON 语法规则

| 数据类型 | 描述 | 示例 |
|----------|------|------|
| 字符串 | 双引号包围 | `"hello"` |
| 数字 | 整数或浮点数 | `42`, `3.14` |
| 布尔值 | true 或 false | `true`, `false` |
| null | 空值 | `null` |
| 对象 | 键值对集合 | `{"name": "John"}` |
| 数组 | 值的有序列表 | `[1, 2, 3]` |

::: info JSON vs JavaScript 对象
虽然 JSON 语法源于 JavaScript 对象字面量，但 JSON 是纯文本格式，而 JavaScript 对象是内存中的数据结构。JSON 中的键必须是字符串，而 JavaScript 对象的键可以是字符串、数字或符号。
:::

## JSON.parse() - 解析 JSON 字符串

`JSON.parse()` 方法用于将 JSON 字符串转换为 JavaScript 对象。

### 语法

```javascript
/**
 * @param {string} text - 要解析的 JSON 字符串
 * @param {function} reviver - 可选的转换函数
 * @returns {any} 解析后的 JavaScript 值
 */
JSON.parse(text, reviver?)
```

### 基本使用

```javascript
// 解析简单对象
const jsonString = '{"name": "张三", "age": 25, "city": "北京"}';
const obj = JSON.parse(jsonString);

console.log(obj);
// { name: "张三", age: 25, city: "北京" }

console.log(obj.name); // "张三"
console.log(typeof obj); // "object"
```

### 解析不同数据类型

```javascript
// 解析数组
const arrayJson = '[1, 2, 3, "hello", true, null]';
const array = JSON.parse(arrayJson);
console.log(array); // [1, 2, 3, "hello", true, null]

// 解析嵌套对象
const nestedJson = `{
  "user": {
    "id": 1,
    "profile": {
      "name": "李四",
      "preferences": ["reading", "coding"]
    }
  }
}`;
const nested = JSON.parse(nestedJson);
console.log(nested.user.profile.name); // "李四"

// 解析基本类型
console.log(JSON.parse('"hello"'));    // "hello"
console.log(JSON.parse('42'));         // 42
console.log(JSON.parse('true'));       // true
console.log(JSON.parse('null'));       // null
```

### 使用 reviver 函数

`reviver` 函数可以对解析过程中的每个键值对进行转换：

```javascript
const jsonString = `{
  "name": "王五",
  "birthday": "2023-12-25T10:30:00.000Z",
  "score": "95",
  "active": "true"
}`;

const obj = JSON.parse(jsonString, (key, value) => {
  // 转换日期字符串为 Date 对象
  if (key === 'birthday') {
    return new Date(value);
  }
  
  // 转换数字字符串为数字
  if (key === 'score') {
    return parseInt(value, 10);
  }
  
  // 转换布尔字符串为布尔值
  if (key === 'active') {
    return value === 'true';
  }
  
  return value;
});

console.log(obj);
// {
//   name: "王五",
//   birthday: Date对象,
//   score: 95,
//   active: true
// }
```

### 过滤属性

```javascript
const jsonString = '{"name": "赵六", "password": "secret", "email": "zhao@example.com"}';

const safeObj = JSON.parse(jsonString, (key, value) => {
  // 过滤敏感信息
  if (key === 'password') {
    return undefined; // 返回 undefined 会过滤掉该属性
  }
  return value;
});

console.log(safeObj);
// { name: "赵六", email: "zhao@example.com" }
```

### 错误处理

```javascript
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON 解析失败:', error.message);
    return defaultValue;
  }
}

// 测试错误处理
console.log(safeJsonParse('{"valid": "json"}')); // { valid: "json" }
console.log(safeJsonParse('{invalid json}'));    // null
console.log(safeJsonParse('undefined', {}));     // {}
```

## JSON.stringify() - 序列化为 JSON 字符串

`JSON.stringify()` 方法用于将 JavaScript 值转换为 JSON 字符串。

### 语法

```javascript
/**
 * @param {any} value - 要序列化的值
 * @param {function|array} replacer - 可选的替换函数或属性数组
 * @param {string|number} space - 可选的缩进
 * @returns {string} JSON 字符串
 */
JSON.stringify(value, replacer?, space?)
```

### 基本使用

```javascript
const obj = {
  name: "孙七",
  age: 30,
  hobbies: ["reading", "swimming"],
  address: {
    city: "上海",
    district: "浦东"
  }
};

// 基本序列化
const jsonString = JSON.stringify(obj);
console.log(jsonString);
// '{"name":"孙七","age":30,"hobbies":["reading","swimming"],"address":{"city":"上海","district":"浦东"}}'

// 格式化输出
const formatted = JSON.stringify(obj, null, 2);
console.log(formatted);
// {
//   "name": "孙七",
//   "age": 30,
//   "hobbies": [
//     "reading",
//     "swimming"
//   ],
//   "address": {
//     "city": "上海",
//     "district": "浦东"
//   }
// }
```

### 序列化行为和限制

::: warning 序列化限制
JSON.stringify() 在序列化时有以下行为和限制：
:::

| 数据类型 | 序列化行为 | 示例 |
|----------|------------|------|
| `undefined` | 忽略或转为 `null` | 对象属性被忽略，数组元素转为 `null` |
| `function` | 忽略或转为 `null` | 对象属性被忽略，数组元素转为 `null` |
| `Symbol` | 忽略 | 属性键和值都会被忽略 |
| `Date` | 转为 ISO 字符串 | `new Date()` → `"2023-12-25T10:30:00.000Z"` |
| `NaN`, `Infinity` | 转为 `null` | `NaN` → `null`, `Infinity` → `null` |
| `BigInt` | 抛出错误 | `TypeError: Do not know how to serialize a BigInt` |

```javascript
const complexObj = {
  // 正常值
  name: "测试",
  age: 25,
  
  // 会被忽略的值
  undefinedValue: undefined,
  functionValue: function() { return "hello"; },
  symbolKey: Symbol("test"),
  [Symbol("symbolKey")]: "symbolValue",
  
  // 特殊值的转换
  dateValue: new Date("2023-12-25"),
  nanValue: NaN,
  infinityValue: Infinity,
  nullValue: null,
  
  // 数组中的特殊值
  arrayWithSpecial: [1, undefined, function() {}, Symbol("test"), null]
};

console.log(JSON.stringify(complexObj, null, 2));
// {
//   "name": "测试",
//   "age": 25,
//   "dateValue": "2023-12-25T00:00:00.000Z",
//   "nanValue": null,
//   "infinityValue": null,
//   "nullValue": null,
//   "arrayWithSpecial": [1, null, null, null, null]
// }
```

### 使用 replacer 参数

#### 作为函数使用

```javascript
const obj = {
  name: "周八",
  password: "secret123",
  email: "zhou@example.com",
  age: 28,
  salary: 50000
};

// 使用函数过滤和转换
const jsonString = JSON.stringify(obj, (key, value) => {
  // 过滤敏感信息
  if (key === 'password' || key === 'salary') {
    return undefined;
  }
  
  // 转换年龄显示
  if (key === 'age') {
    return `${value}岁`;
  }
  
  return value;
});

console.log(jsonString);
// '{"name":"周八","email":"zhou@example.com","age":"28岁"}'
```

#### 作为数组使用

```javascript
const obj = {
  id: 1,
  name: "吴九",
  email: "wu@example.com",
  password: "secret",
  internalId: "internal123"
};

// 只序列化指定的属性
const publicJson = JSON.stringify(obj, ['id', 'name', 'email']);
console.log(publicJson);
// '{"id":1,"name":"吴九","email":"wu@example.com"}'
```

### 使用 space 参数

```javascript
const obj = { name: "郑十", hobbies: ["music", "sports"] };

// 使用数字指定缩进空格数
console.log(JSON.stringify(obj, null, 4));
// {
//     "name": "郑十",
//     "hobbies": [
//         "music",
//         "sports"
//     ]
// }

// 使用字符串作为缩进
console.log(JSON.stringify(obj, null, '\t'));
// {
// 	"name": "郑十",
// 	"hobbies": [
// 		"music",
// 		"sports"
// 	]
// }

// 使用自定义缩进字符
console.log(JSON.stringify(obj, null, '>>'));
// {
// >>"name": "郑十",
// >>"hobbies": [
// >>>>"music",
// >>>>"sports"
// >>]
// }
```

### toJSON() 方法

如果对象有 `toJSON()` 方法，`JSON.stringify()` 会调用该方法：

```javascript
class Person {
  constructor(name, age, ssn) {
    this.name = name;
    this.age = age;
    this.ssn = ssn; // 敏感信息
  }
  
  toJSON() {
    // 自定义序列化逻辑
    return {
      name: this.name,
      age: this.age,
      // 不包含 ssn
    };
  }
}

const person = new Person("李明", 25, "123-45-6789");
console.log(JSON.stringify(person));
// '{"name":"李明","age":25}'

// Date 对象的 toJSON() 示例
const now = new Date();
console.log(JSON.stringify({ timestamp: now }));
// '{"timestamp":"2023-12-25T10:30:00.000Z"}'
```

## 高级用法和实用技巧

### 深拷贝对象

::: warning 深拷贝限制
使用 JSON 进行深拷贝有限制，不能复制函数、undefined、Symbol 等值。
:::

```javascript
// 简单对象的深拷贝
function deepCloneSimple(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const original = {
  name: "原始对象",
  nested: {
    value: 42
  },
  array: [1, 2, 3]
};

const cloned = deepCloneSimple(original);
cloned.nested.value = 100;

console.log(original.nested.value); // 42（未被修改）
console.log(cloned.nested.value);   // 100

// 更安全的深拷贝函数
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}
```

### 保存和恢复函数

虽然 JSON 不能直接序列化函数，但可以通过特殊处理来保存函数：

```javascript
// 序列化包含函数的对象
function stringifyWithFunctions(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return `__FUNCTION__${value.toString()}`;
    }
    return value;
  });
}

// 反序列化并恢复函数
function parseWithFunctions(jsonString) {
  return JSON.parse(jsonString, (key, value) => {
    if (typeof value === 'string' && value.startsWith('__FUNCTION__')) {
      const functionCode = value.substring(12);
      return new Function(`return ${functionCode}`)();
    }
    return value;
  });
}

// 测试示例
const objWithFunction = {
  name: "测试对象",
  data: [1, 2, 3, 4, 5],
  getSum: function() {
    return this.data.reduce((sum, num) => sum + num, 0);
  },
  filter: function(predicate) {
    return this.data.filter(predicate);
  }
};

// 序列化
const serialized = stringifyWithFunctions(objWithFunction);
console.log('序列化结果:', serialized);

// 反序列化
const restored = parseWithFunctions(serialized);
console.log('函数调用结果:', restored.getSum()); // 15
console.log('过滤结果:', restored.filter(x => x > 3)); // [4, 5]
```

### JSON 数据验证

```javascript
// JSON Schema 风格的简单验证
function validateJSON(data, schema) {
  function validate(value, schemaRule) {
    if (schemaRule.type) {
      if (typeof value !== schemaRule.type) {
        return false;
      }
    }
    
    if (schemaRule.required && (value === undefined || value === null)) {
      return false;
    }
    
    if (schemaRule.properties && typeof value === 'object') {
      for (const [key, rule] of Object.entries(schemaRule.properties)) {
        if (!validate(value[key], rule)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  return validate(data, schema);
}

// 使用示例
const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', required: true },
    age: { type: 'number', required: true },
    email: { type: 'string', required: false }
  }
};

const validUser = { name: "张三", age: 25, email: "zhang@example.com" };
const invalidUser = { name: "李四", age: "not a number" };

console.log(validateJSON(validUser, userSchema));   // true
console.log(validateJSON(invalidUser, userSchema)); // false
```

### 流式 JSON 处理

对于大型 JSON 数据，可以考虑流式处理：

```javascript
// 模拟流式 JSON 解析器
class JSONStreamParser {
  constructor() {
    this.buffer = '';
    this.depth = 0;
    this.inString = false;
    this.escaped = false;
  }
  
  parse(chunk, onObject) {
    this.buffer += chunk;
    
    for (let i = 0; i < this.buffer.length; i++) {
      const char = this.buffer[i];
      
      if (this.escaped) {
        this.escaped = false;
        continue;
      }
      
      if (char === '\\' && this.inString) {
        this.escaped = true;
        continue;
      }
      
      if (char === '"') {
        this.inString = !this.inString;
        continue;
      }
      
      if (!this.inString) {
        if (char === '{') {
          this.depth++;
        } else if (char === '}') {
          this.depth--;
          
          if (this.depth === 0) {
            // 找到完整的对象
            const objectStr = this.buffer.substring(0, i + 1);
            try {
              const obj = JSON.parse(objectStr);
              onObject(obj);
            } catch (error) {
              console.error('解析错误:', error);
            }
            
            this.buffer = this.buffer.substring(i + 1);
            i = -1; // 重置索引
          }
        }
      }
    }
  }
}

// 使用示例
const parser = new JSONStreamParser();
const jsonStream = '{"id":1,"name":"对象1"}{"id":2,"name":"对象2"}{"id":3,"name":"对象3"}';

parser.parse(jsonStream, (obj) => {
  console.log('解析到对象:', obj);
});
// 输出:
// 解析到对象: { id: 1, name: "对象1" }
// 解析到对象: { id: 2, name: "对象2" }
// 解析到对象: { id: 3, name: "对象3" }
```

## 实际应用场景

### 1. API 数据处理

```javascript
// 封装 API 请求处理
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    // 序列化请求体
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // 解析响应
      const text = await response.text();
      if (text) {
        return JSON.parse(text);
      }
      return null;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('服务器返回的不是有效的 JSON 格式');
      }
      throw error;
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }
}

// 使用示例
const api = new APIClient('https://api.example.com');

async function createUser() {
  try {
    const newUser = await api.post('/users', {
      name: '新用户',
      email: 'newuser@example.com'
    });
    console.log('创建成功:', newUser);
  } catch (error) {
    console.error('创建失败:', error.message);
  }
}
```

### 2. 本地存储管理

```javascript
// localStorage 的 JSON 封装
class JSONStorage {
  static set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('存储失败:', error);
      return false;
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('读取失败:', error);
      return defaultValue;
    }
  }
  
  static remove(key) {
    localStorage.removeItem(key);
  }
  
  static clear() {
    localStorage.clear();
  }
  
  // 带过期时间的存储
  static setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    this.set(key, item);
  }
  
  static getWithExpiry(key, defaultValue = null) {
    const item = this.get(key);
    if (!item) return defaultValue;
    
    const now = new Date();
    if (now.getTime() > item.expiry) {
      this.remove(key);
      return defaultValue;
    }
    
    return item.value;
  }
}

// 使用示例
JSONStorage.set('user', { name: '用户', preferences: { theme: 'dark' } });
JSONStorage.setWithExpiry('token', 'abc123', 3600000); // 1小时过期

const user = JSONStorage.get('user');
const token = JSONStorage.getWithExpiry('token');
```

### 3. 配置文件处理

```javascript
// 应用配置管理
class ConfigManager {
  constructor(defaultConfig = {}) {
    this.config = { ...defaultConfig };
    this.listeners = [];
  }
  
  load(configString) {
    try {
      const parsed = JSON.parse(configString);
      this.merge(parsed);
      this.notify();
    } catch (error) {
      throw new Error(`配置文件格式错误: ${error.message}`);
    }
  }
  
  merge(newConfig) {
    this.config = this.deepMerge(this.config, newConfig);
  }
  
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  get(path, defaultValue = undefined) {
    return path.split('.').reduce((obj, key) => 
      obj && obj[key] !== undefined ? obj[key] : defaultValue, this.config);
  }
  
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key] || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      return obj[key];
    }, this.config);
    
    target[lastKey] = value;
    this.notify();
  }
  
  export() {
    return JSON.stringify(this.config, null, 2);
  }
  
  onChange(callback) {
    this.listeners.push(callback);
  }
  
  notify() {
    this.listeners.forEach(callback => callback(this.config));
  }
}

// 使用示例
const config = new ConfigManager({
  app: {
    name: '我的应用',
    version: '1.0.0'
  },
  database: {
    host: 'localhost',
    port: 3306
  }
});

config.onChange((newConfig) => {
  console.log('配置已更新:', newConfig);
});

config.set('database.host', '192.168.1.100');
console.log(config.get('database.host')); // '192.168.1.100'
console.log(config.export()); // 导出完整配置
```

## 性能优化

### 1. 大对象处理

```javascript
// 分块处理大型 JSON 数据
function processLargeJSON(jsonString, chunkSize = 1000) {
  const data = JSON.parse(jsonString);
  
  if (Array.isArray(data)) {
    const results = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      // 处理块数据
      const processed = chunk.map(item => {
        // 执行处理逻辑
        return { ...item, processed: true };
      });
      results.push(...processed);
      
      // 让出控制权，避免阻塞 UI
      if (i % (chunkSize * 10) === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  }
  
  return data;
}
```

### 2. 缓存策略

```javascript
// JSON 解析缓存
class JSONCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  parse(jsonString) {
    if (this.cache.has(jsonString)) {
      return this.cache.get(jsonString);
    }
    
    const result = JSON.parse(jsonString);
    
    if (this.cache.size >= this.maxSize) {
      // 删除最旧的条目
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(jsonString, result);
    return result;
  }
  
  clear() {
    this.cache.clear();
  }
}

const jsonCache = new JSONCache();
```

## 错误处理和调试

### 常见错误和解决方案

```javascript
// 完善的 JSON 错误处理
class JSONError extends Error {
  constructor(message, originalError, context) {
    super(message);
    this.name = 'JSONError';
    this.originalError = originalError;
    this.context = context;
  }
}

function safeJSONOperation(operation, context = {}) {
  try {
    return { success: true, data: operation() };
  } catch (error) {
    let message = 'JSON 操作失败';
    
    if (error instanceof SyntaxError) {
      message = `JSON 语法错误: ${error.message}`;
    } else if (error.message.includes('circular structure')) {
      message = 'JSON 序列化失败: 检测到循环引用';
    } else if (error.message.includes('BigInt')) {
      message = 'JSON 序列化失败: 不支持 BigInt 类型';
    }
    
    return {
      success: false,
      error: new JSONError(message, error, context)
    };
  }
}

// 使用示例
const result1 = safeJSONOperation(() => 
  JSON.parse('{"invalid": json}'), { operation: 'parse' });

const result2 = safeJSONOperation(() => {
  const obj = {};
  obj.self = obj; // 循环引用
  return JSON.stringify(obj);
}, { operation: 'stringify' });

console.log(result1); // { success: false, error: JSONError }
console.log(result2); // { success: false, error: JSONError }
```

### JSON 格式验证

```javascript
// JSON 格式验证工具
function validateJSONFormat(jsonString) {
  const errors = [];
  
  // 基本语法检查
  try {
    JSON.parse(jsonString);
  } catch (error) {
    errors.push({
      type: 'syntax',
      message: error.message,
      position: extractPosition(error.message)
    });
    return { valid: false, errors };
  }
  
  // 其他格式检查
  if (jsonString.includes('\t')) {
    errors.push({
      type: 'format',
      message: '建议使用空格而不是制表符进行缩进'
    });
  }
  
  if (jsonString.includes("'")) {
    errors.push({
      type: 'format',
      message: '应使用双引号而不是单引号'
    });
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

function extractPosition(errorMessage) {
  const match = errorMessage.match(/position (\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// 使用示例
const validation = validateJSONFormat(`{
  'name': "test",
  "value": 123
}`);

console.log(validation);
// {
//   valid: false,
//   errors: [
//     { type: 'format', message: '应使用双引号而不是单引号' }
//   ]
// }
```

## 最佳实践

### 1. 安全考虑

```javascript
// 安全的 JSON 处理
class SecureJSON {
  static parse(jsonString, options = {}) {
    const { maxDepth = 10, maxKeys = 1000 } = options;
    
    // 检查字符串长度
    if (jsonString.length > 1000000) { // 1MB 限制
      throw new Error('JSON 字符串过大');
    }
    
    const result = JSON.parse(jsonString, (key, value) => {
      // 检查深度和键数量
      if (typeof value === 'object' && value !== null) {
        const depth = this.getDepth(value);
        const keyCount = this.countKeys(value);
        
        if (depth > maxDepth) {
          throw new Error(`JSON 嵌套深度超过限制 (${maxDepth})`);
        }
        
        if (keyCount > maxKeys) {
          throw new Error(`JSON 键数量超过限制 (${maxKeys})`);
        }
      }
      
      return value;
    });
    
    return result;
  }
  
  static getDepth(obj, current = 0) {
    if (typeof obj !== 'object' || obj === null) {
      return current;
    }
    
    let maxDepth = current;
    for (const value of Object.values(obj)) {
      const depth = this.getDepth(value, current + 1);
      maxDepth = Math.max(maxDepth, depth);
    }
    
    return maxDepth;
  }
  
  static countKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }
    
    let count = Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      count += this.countKeys(value);
    }
    
    return count;
  }
}
```

### 2. 类型安全

```javascript
// TypeScript 风格的运行时类型检查
function createTypedJSON() {
  return {
    stringify: (value, schema) => {
      if (schema && !validateSchema(value, schema)) {
        throw new Error('数据不符合指定的模式');
      }
      return JSON.stringify(value);
    },
    
    parse: (jsonString, schema) => {
      const result = JSON.parse(jsonString);
      if (schema && !validateSchema(result, schema)) {
        throw new Error('解析结果不符合指定的模式');
      }
      return result;
    }
  };
}

function validateSchema(data, schema) {
  // 简化的模式验证
  if (schema.type && typeof data !== schema.type) {
    return false;
  }
  
  if (schema.properties && typeof data === 'object') {
    for (const [key, subSchema] of Object.entries(schema.properties)) {
      if (!validateSchema(data[key], subSchema)) {
        return false;
      }
    }
  }
  
  return true;
}

// 使用示例
const typedJSON = createTypedJSON();
const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
};

const user = typedJSON.parse('{"name":"张三","age":25}', userSchema);
```

### 3. 内存优化

```javascript
// 流式 JSON 构建器
class JSONBuilder {
  constructor() {
    this.chunks = [];
  }
  
  startObject() {
    this.chunks.push('{');
    return this;
  }
  
  endObject() {
    // 移除最后的逗号
    if (this.chunks[this.chunks.length - 1] === ',') {
      this.chunks.pop();
    }
    this.chunks.push('}');
    return this;
  }
  
  addProperty(key, value) {
    this.chunks.push(`"${key}":${JSON.stringify(value)},`);
    return this;
  }
  
  startArray() {
    this.chunks.push('[');
    return this;
  }
  
  endArray() {
    if (this.chunks[this.chunks.length - 1] === ',') {
      this.chunks.pop();
    }
    this.chunks.push(']');
    return this;
  }
  
  addValue(value) {
    this.chunks.push(`${JSON.stringify(value)},`);
    return this;
  }
  
  toString() {
    return this.chunks.join('');
  }
}

// 使用示例 - 构建大型 JSON 而不占用大量内存
const builder = new JSONBuilder();
const result = builder
  .startObject()
  .addProperty('users', null)
  .toString();
```

## 总结

JSON 是现代 Web 开发中不可或缺的数据交换格式：

- **解析** - 使用 `JSON.parse()` 将 JSON 字符串转换为 JavaScript 对象
- **序列化** - 使用 `JSON.stringify()` 将 JavaScript 值转换为 JSON 字符串
- **限制** - 了解 JSON 的数据类型限制和序列化行为
- **安全** - 实施适当的验证和错误处理
- **性能** - 对大型数据使用适当的优化策略

在实际开发中，应该根据具体需求选择合适的 JSON 处理策略，并始终考虑安全性、性能和错误处理。