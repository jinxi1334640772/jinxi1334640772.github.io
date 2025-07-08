---
title: JavaScript 元编程 - Proxy 和 Reflect
description: 详细介绍 JavaScript 中的 Proxy 和 Reflect 对象，包括代理对象的创建、拦截器方法以及反射 API 的使用
outline: deep
---

# JavaScript 元编程 - Proxy 和 Reflect

JavaScript 的元编程功能允许开发者拦截并自定义基本语言操作。Proxy 和 Reflect 对象是实现元编程的核心工具，它们提供了强大的拦截和反射能力。

## 什么是元编程

元编程是指编写能够操作其他程序（或自身）的程序。在 JavaScript 中，元编程主要通过 Proxy 和 Reflect 对象实现，允许拦截并自定义基本语言操作，例如：

- 属性查找和赋值
- 枚举操作
- 函数调用
- 对象构造
- 原型操作

## Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义。

### 基本语法

```javascript
/**
 * @param {object} target - 要使用 Proxy 包装的目标对象
 * @param {object} handler - 以函数作为属性的对象，定义在拦截各种操作时，代理对象的行为
 */
const proxy = new Proxy(target, handler);
```

### 拦截器方法（Handler Methods）

Proxy 支持多种拦截器方法，每个方法对应一种基本操作：

#### 属性访问拦截

```javascript
const target = { name: "zhangjinxi", age: 18 };

const handler = {
  // 拦截对象的读取属性操作
  get(target, property, receiver) {
    console.log(`正在访问属性: ${property}`);
    return Reflect.get(target, property, receiver);
  },

  // 拦截属性设置操作
  set(target, property, value, receiver) {
    console.log(`正在设置属性: ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  },

  // 拦截 in 操作符
  has(target, property) {
    console.log(`检查属性是否存在: ${property}`);
    return Reflect.has(target, property);
  }
};

const proxy = new Proxy(target, handler);

// 使用示例
console.log(proxy.name); // 正在访问属性: name -> "zhangjinxi"
proxy.city = "北京"; // 正在设置属性: city = 北京
console.log("age" in proxy); // 检查属性是否存在: age -> true
```

#### 属性定义和删除拦截

```javascript
const handler = {
  // 拦截 delete 操作
  deleteProperty(target, property) {
    console.log(`正在删除属性: ${property}`);
    return Reflect.deleteProperty(target, property);
  },

  // 拦截 Object.defineProperty() 操作
  defineProperty(target, property, descriptor) {
    console.log(`正在定义属性: ${property}`);
    return Reflect.defineProperty(target, property, descriptor);
  },

  // 拦截 Object.getOwnPropertyDescriptor() 操作
  getOwnPropertyDescriptor(target, property) {
    console.log(`正在获取属性描述符: ${property}`);
    return Reflect.getOwnPropertyDescriptor(target, property);
  }
};
```

#### 原型操作拦截

```javascript
const handler = {
  // 拦截读取代理对象的原型
  getPrototypeOf(target) {
    console.log("正在获取原型");
    return Reflect.getPrototypeOf(target);
  },

  // 拦截 Object.setPrototypeOf() 操作
  setPrototypeOf(target, prototype) {
    console.log("正在设置原型");
    return Reflect.setPrototypeOf(target, prototype);
  }
};
```

#### 对象扩展性拦截

```javascript
const handler = {
  // 拦截 Object.isExtensible() 操作
  isExtensible(target) {
    console.log("正在检查对象是否可扩展");
    return Reflect.isExtensible(target);
  },

  // 拦截 Object.preventExtensions() 操作
  preventExtensions(target) {
    console.log("正在阻止对象扩展");
    return Reflect.preventExtensions(target);
  }
};
```

#### 属性枚举拦截

```javascript
const handler = {
  // 拦截属性枚举操作
  // 适用于: Object.getOwnPropertyNames(), Object.getOwnPropertySymbols(), 
  // Object.keys(), Reflect.ownKeys()
  ownKeys(target) {
    console.log("正在枚举对象属性");
    return Reflect.ownKeys(target);
  }
};
```

#### 函数调用和构造拦截

```javascript
function targetFunction(a, b) {
  return a + b;
}

const handler = {
  // 拦截函数调用
  apply(target, thisArg, argumentsList) {
    console.log(`正在调用函数，参数: ${argumentsList}`);
    return Reflect.apply(target, thisArg, argumentsList);
  },

  // 拦截 new 操作符
  construct(target, argumentsList, newTarget) {
    console.log(`正在构造对象，参数: ${argumentsList}`);
    return Reflect.construct(target, argumentsList, newTarget);
  }
};

const proxyFunction = new Proxy(targetFunction, handler);

// 使用示例
console.log(proxyFunction(1, 2)); // 正在调用函数，参数: 1,2 -> 3
```

### 完整示例

```javascript
const target = { name: "zhangjinxi", age: 18 };

const handler = {
  get(target, property, receiver) {
    if (property in target) {
      return Reflect.get(target, property, receiver);
    } else {
      throw new Error(`属性 ${property} 不存在`);
    }
  },

  set(target, property, value, receiver) {
    if (typeof value === "string" && value.length < 2) {
      throw new Error("字符串长度必须大于等于2");
    }
    return Reflect.set(target, property, value, receiver);
  },

  has(target, property) {
    return Reflect.has(target, property);
  },

  deleteProperty(target, property) {
    if (property === "name") {
      throw new Error("不能删除 name 属性");
    }
    return Reflect.deleteProperty(target, property);
  }
};

const proxy = new Proxy(target, handler);
```

### 可撤销的 Proxy

`Proxy.revocable()` 方法创建一个可撤销的代理对象：

```javascript
const target = { name: "zhangjinxi", age: 18 };
const handler = {
  get(target, property, receiver) {
    return Reflect.get(target, property, receiver);
  }
};

// 创建可撤销的代理
const revocableProxy = Proxy.revocable(target, handler);

// 代理对象
const proxy = revocableProxy.proxy;
console.log(proxy.name); // "zhangjinxi"

// 撤销代理
revocableProxy.revoke();

// 撤销后再次访问会抛出错误
try {
  console.log(proxy.name); // TypeError: Cannot perform 'get' on a proxy that has been revoked
} catch (error) {
  console.error(error.message);
}
```

### Proxy 的应用场景

::: info 常见用途
1. **数据验证** - 在设置属性时进行验证
2. **属性访问日志** - 记录属性的访问和修改
3. **默认值处理** - 为不存在的属性提供默认值
4. **API 包装** - 为旧 API 提供新的接口
5. **虚拟对象** - 创建动态生成属性的对象
:::

## Reflect

Reflect 是一个内置对象，提供拦截 JavaScript 操作的方法。这些方法与 Proxy handler 的方法相同。

### 特点

- **不是构造函数** - `Reflect` 不是一个函数对象，因此它是不可构造的
- **静态方法** - 所有方法都是静态方法，直接通过 `Reflect` 调用
- **对应关系** - 方法名称和 Proxy handler 上的拦截方法名一一对应
- **标准化操作** - 将 Object 和 Function 上的方法标准化并集中到 Reflect 上

### 主要方法

| Reflect 方法 | 对应的传统操作 | 描述 |
|-------------|---------------|------|
| `Reflect.get(target, property, receiver?)` | `target[property]` | 获取对象属性 |
| `Reflect.set(target, property, value, receiver?)` | `target[property] = value` | 设置对象属性 |
| `Reflect.has(target, property)` | `property in target` | 检查属性是否存在 |
| `Reflect.deleteProperty(target, property)` | `delete target[property]` | 删除对象属性 |
| `Reflect.defineProperty(target, property, descriptor)` | `Object.defineProperty()` | 定义对象属性 |
| `Reflect.getOwnPropertyDescriptor(target, property)` | `Object.getOwnPropertyDescriptor()` | 获取属性描述符 |
| `Reflect.getPrototypeOf(target)` | `Object.getPrototypeOf()` | 获取对象原型 |
| `Reflect.setPrototypeOf(target, prototype)` | `Object.setPrototypeOf()` | 设置对象原型 |
| `Reflect.isExtensible(target)` | `Object.isExtensible()` | 检查对象是否可扩展 |
| `Reflect.preventExtensions(target)` | `Object.preventExtensions()` | 阻止对象扩展 |
| `Reflect.ownKeys(target)` | `Object.getOwnPropertyNames()` + `Object.getOwnPropertySymbols()` | 获取对象所有属性键 |
| `Reflect.apply(target, thisArg, argumentsList)` | `Function.prototype.apply()` | 调用函数 |
| `Reflect.construct(target, argumentsList, newTarget?)` | `new target(...argumentsList)` | 构造对象 |

### 使用示例

```javascript
const obj = { name: "zhangjinxi", age: 18 };

// 传统方式 vs Reflect 方式
console.log(obj.name); // 传统方式
console.log(Reflect.get(obj, "name")); // Reflect 方式

obj.city = "北京"; // 传统方式
Reflect.set(obj, "city", "北京"); // Reflect 方式

console.log("age" in obj); // 传统方式
console.log(Reflect.has(obj, "age")); // Reflect 方式

delete obj.age; // 传统方式
Reflect.deleteProperty(obj, "age"); // Reflect 方式
```

### 为什么使用 Reflect

::: tip Reflect 的优势
1. **更可靠的返回值** - 返回布尔值而不是抛出错误
2. **函数式编程** - 将操作转换为函数调用
3. **与 Proxy 配合** - 在 Proxy handler 中使用 Reflect 确保默认行为
4. **统一的 API** - 提供统一的对象操作接口
:::

```javascript
// 传统方式可能抛出错误
try {
  Object.defineProperty(obj, "prop", { value: 42 });
  console.log("属性定义成功");
} catch (error) {
  console.log("属性定义失败");
}

// Reflect 方式返回布尔值
if (Reflect.defineProperty(obj, "prop", { value: 42 })) {
  console.log("属性定义成功");
} else {
  console.log("属性定义失败");
}
```

## 实际应用示例

### 数据验证代理

```javascript
function createValidatedUser(userData) {
  return new Proxy(userData, {
    set(target, property, value, receiver) {
      // 验证规则
      if (property === "age" && (typeof value !== "number" || value < 0)) {
        throw new Error("年龄必须是非负数");
      }
      if (property === "email" && !value.includes("@")) {
        throw new Error("邮箱格式不正确");
      }
      
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const user = createValidatedUser({ name: "张三", age: 25 });
user.email = "zhangsan@example.com"; // 正常
// user.age = -1; // 抛出错误
```

### 默认值代理

```javascript
function createDefaultValueProxy(target, defaultValue) {
  return new Proxy(target, {
    get(target, property, receiver) {
      if (property in target) {
        return Reflect.get(target, property, receiver);
      }
      return defaultValue;
    }
  });
}

const config = createDefaultValueProxy({ theme: "dark" }, "未设置");
console.log(config.theme); // "dark"
console.log(config.language); // "未设置"
```

## 总结

Proxy 和 Reflect 是 JavaScript 元编程的核心工具：

- **Proxy** 提供了强大的拦截能力，可以自定义对象的基本操作行为
- **Reflect** 提供了标准化的对象操作方法，与 Proxy 完美配合
- 两者结合使用可以实现数据验证、API 包装、虚拟对象等高级功能
- 在使用 Proxy 时，推荐在 handler 中使用 Reflect 方法来确保默认行为的正确性

这些特性为 JavaScript 开发者提供了前所未有的灵活性，使得创建更加智能和动态的应用程序成为可能。
