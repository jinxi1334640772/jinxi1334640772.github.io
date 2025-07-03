---
title: JavaScript 核心语言特性
description: JavaScript 基础知识、语法特性和最佳实践指南
outline: deep
---

# 💻 JavaScript 核心语言特性

JavaScript（JS）是一种具有函数优先特性的轻量级、解释型或者说即时编译型的编程语言。虽然作为 Web 页面中的脚本语言被人所熟知，但是它也被用到了很多非浏览器环境中，例如 Node.js、Apache CouchDB、Adobe Acrobat 等。

::: tip 📚 本章内容
学习 JavaScript 的基础语法、核心特性和最佳实践，为深入学习前端开发打下坚实基础。
:::

## 🔍 JavaScript 简介

JavaScript 是一种基于原型、多范式、单线程的动态语言，并且支持面向对象、命令式和声明式（如函数式编程）风格。

### ✨ 动态特性

JavaScript 的动态特性包括：

- 🏗️ **运行时对象构造** - 可以在运行时创建和修改对象
- 📋 **变量参数列表** - 函数可以接受任意数量的参数
- 🔧 **函数变量** - 函数可以作为变量传递和赋值
- ⚡ **动态脚本创建** - 通过 `eval` 动态执行代码
- 🔄 **对象内枚举** - 通过 `for...in` 和 `Object` 工具方法遍历对象
- 📝 **源代码恢复** - 函数会存储其源代码文本，可以使用 `toString()` 检索

## 🎯 JavaScript 对象

在 JavaScript 中，大多数事物都是对象，从作为核心功能的字符串和数组，到建立在 JavaScript 之上的浏览器 API。你甚至可以自己创建对象，将相关的函数和变量高效地封装打包成便捷的数据容器。

### 🌐 内置对象标准库

JavaScript 内置了一些对象的标准库：

| 对象类型 | 说明 | 示例 |
|----------|------|------|
| **Array** | 数组操作 | `[1, 2, 3].map(x => x * 2)` |
| **Date** | 日期时间 | `new Date().getFullYear()` |
| **Math** | 数学运算 | `Math.random()`, `Math.PI` |
| **String** | 字符串处理 | `"hello".toUpperCase()` |
| **Object** | 对象操作 | `Object.keys({a: 1, b: 2})` |

### 🔧 语言扩展

JavaScript 的核心部分可以通过添加对象来扩展语言以适应不同用途：

- **客户端 JavaScript** 
  - 提供对象控制浏览器及其文档对象模型（DOM）
  - 支持响应用户事件（鼠标点击、表单提交、页面导航）
  - 允许应用程序将元素放在HTML表单中

- **服务端 JavaScript**
  - 提供有关在服务器上运行 JavaScript 的对象
  - 支持应用和数据库通信
  - 提供应用不同调用间的信息连续性
  - 在服务器上执行文件操作

## 🆚 JavaScript vs Java

::: warning ⚠️ 注意区别
JavaScript 和 Java 有一些共性但是在另一些方面有着根本性区别。
:::

### 相同点 ✅

- 遵循相似的表达式语法
- 相似的命名规范
- 基础流程控制结构相似

### 不同点 ❌

| 特性 | JavaScript | Java |
|------|------------|------|
| **类型系统** | 动态类型，运行时确定 | 静态类型，编译时确定 |
| **类定义** | 基于原型的动态继承 | 基于类的静态继承 |
| **函数特性** | 支持匿名函数，函数是一等公民 | 方法必须属于类 |
| **变量声明** | 无需显式声明类型 | 必须显式声明类型 |
| **编译** | 解释执行或即时编译 | 编译为字节码 |
| **内存管理** | 自动垃圾回收 | 自动垃圾回收 |

### 💡 设计理念对比

- **Java**: 设计初衷是确保快速执行和类型安全，要求紧耦合的对象层级结构
- **JavaScript**: 传承精简、动态类型等特性，提供语法简单、内置功能强大的编程工具

## 📊 ECMAScript 规范

JavaScript 的标准化组织是 **ECMA**（欧洲信息与通信系统标准化协会），提供基于 JavaScript 的标准化方案。

::: info 📋 标准化信息
- **标准名称**: ECMAScript
- **规范文档**: ECMA-262
- **目标**: 在所有支持该标准的应用中以相同的方式工作
- **开放性**: 公司可以使用开放标准语言开发自己的 JavaScript 实现版本
:::

## 🏷️ 数据类型

最新的 ECMAScript 标准定义了 **8 种数据类型**：

### 基本数据类型（7种）

| 类型 | 说明 | 示例 |
|------|------|------|
| **Boolean** | 布尔值 | `true`, `false` |
| **null** | 空值 | `null` |
| **undefined** | 未定义 | `undefined` |
| **Number** | 数字 | `42`, `3.14159` |
| **BigInt** | 大整数 | `123n`, `BigInt(123)` |
| **String** | 字符串 | `"Hello World"` |
| **Symbol** | 唯一标识符 | `Symbol('id')` |

### 引用数据类型（1种）

```javascript
// Object 及其子类型
const obj = {};           // 普通对象
const arr = [];           // 数组
const func = () => {};    // 函数
const date = new Date();  // 日期对象
const regex = /pattern/;  // 正则表达式
```

## 🏷️ Label 语句

label 提供了一个让你在程序中其他位置引用它的标识符，通常与 `break` 或 `continue` 配合使用。

```javascript
let num = 0;

// 使用 label 标记外层循环
outLoop: for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (i === 5 && j === 5) {
      // 跳出所有循环，而不仅仅是内层循环
      break outLoop;
    }
    num++;
  }
}

console.log(num); // 输出: 55
```

::: tip 💡 使用建议
Label 语句在复杂的嵌套循环中很有用，但在大多数情况下，使用函数来组织代码会更加清晰。
:::

## 🏛️ 类 vs 构造函数

### 相同点 ✅

- 都可以创建对象实例
- 都支持继承机制
- 都可以定义方法和属性

### 不同点 ❌

| 特性 | 类（Class） | 构造函数（Function） |
|------|-------------|---------------------|
| **调用方式** | 必须使用 `new` 关键字 | 可以直接调用 |
| **声明提升** | 不会被提升 | 会被提升 |
| **严格模式** | 内部默认开启 | 需要手动开启 |
| **原型设置** | 自动设置原型链 | 需要手动设置 |

```javascript
// 构造函数方式
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// 类方式（ES6+）
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
}
```

## 🔒 严格模式

严格模式是一种在JavaScript中启用更严格的解析和错误处理的方式。

### 🎯 目标

- ✅ 消除JavaScript语法中一些不合理、不严谨、不安全的问题
- ⚡ 提高编译器效率，提升运行速度
- 🛡️ 减少怪异行为，保证代码运行安全

### 📝 启用方式

```javascript
// 1. 整个脚本启用
"use strict";

// 2. 函数内启用
function myFunction() {
  "use strict";
  // 函数体
}

// 3. 模块内（默认严格模式）
// ES6 模块自动启用严格模式

// 4. 类内（默认严格模式）
class MyClass {
  // 类内默认严格模式
}
```

### 🚫 严格模式限制

#### 变量和属性

```javascript
"use strict";

// ❌ 无法创建全局变量
// undeclaredVar = 10; // ReferenceError

// ❌ 无法删除变量
// let myVar = 10;
// delete myVar; // SyntaxError

// ❌ 对象属性名必须唯一
// let obj = {
//   prop: 1,
//   prop: 2  // SyntaxError
// };
```

#### 函数相关

```javascript
"use strict";

// ❌ 函数参数名必须唯一
// function myFunc(a, a) { } // SyntaxError

// ❌ 禁用 arguments.callee
// function myFunc() {
//   arguments.callee(); // TypeError
// }

// ❌ 禁用 with 语句
// with (obj) { } // SyntaxError
```

#### this 绑定

```javascript
"use strict";

function myFunction() {
  console.log(this); // undefined（非严格模式下是全局对象）
}

myFunction();
```

### 🔮 保留关键字

严格模式下，以下单词成为保留关键字：

```javascript
// implements, interface, let, package, private, protected, public, static, yield
```

## 📚 最佳实践

### 1. 🎯 始终使用严格模式

```javascript
"use strict";
// 你的代码
```

### 2. 📝 使用现代语法

```javascript
// ✅ 使用 const/let 替代 var
const PI = 3.14159;
let count = 0;

// ✅ 使用箭头函数
const add = (a, b) => a + b;

// ✅ 使用模板字符串
const message = `Hello, ${name}!`;
```

### 3. 🔍 类型检查

```javascript
// ✅ 显式类型检查
if (typeof value === 'string') {
  // 处理字符串
}

// ✅ 使用 Array.isArray()
if (Array.isArray(data)) {
  // 处理数组
}
```

### 4. 🛡️ 错误处理

```javascript
// ✅ 使用 try-catch
try {
  // 可能出错的代码
  JSON.parse(jsonString);
} catch (error) {
  console.error('解析错误:', error.message);
}
```

## 🔗 相关资源

- [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
- [ECMAScript 规范](https://tc39.es/ecma262/)
- [JavaScript Info 教程](https://zh.javascript.info/)
- [You Don't Know JS 系列](https://github.com/getify/You-Dont-Know-JS)

---

::: tip 🎉 下一步
现在你已经了解了 JavaScript 的基础知识，可以继续学习：
- [ES6+ 新特性](./object.md)
- [JavaScript 对象深入](./object.md)
- [正则表达式](./RegExp.md)
- [JSON 数据处理](./json.md)
:::
