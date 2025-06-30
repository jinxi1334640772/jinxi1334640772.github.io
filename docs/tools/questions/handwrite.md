---
title: 前端手写题汇总
description: 前端面试常见手写题目，包含详细解答和多种实现方式
outline: deep
---

# ✍️ 前端手写题汇总

本文汇总了前端面试中常见的手写题目，每道题都提供了详细的解答和多种实现方式，帮助你深入理解JavaScript核心概念。

::: tip 📚 学习建议
建议先理解每道题的核心原理，然后尝试自己实现，最后参考提供的解答。重点关注边界情况的处理和性能优化。
:::

## 🔧 函数实现类

### 1. 手写 new 操作符

`new` 操作符用于创建对象实例，理解其内部机制对掌握JavaScript面向对象编程至关重要。

::: details 💡 实现原理
1. 创建一个空对象，设置其原型为构造函数的 prototype
2. 将构造函数的 this 指向新创建的对象
3. 执行构造函数，为新对象添加属性
4. 如果构造函数返回对象，则返回该对象；否则返回新创建的对象
:::

```javascript
function myNew(constructor, ...args) {
  // 参数校验
  if (typeof constructor !== "function") {
    throw new TypeError("构造函数必须是一个函数");
  }

  // 1. 创建一个空对象，设置原型链
  const obj = Object.create(constructor.prototype);
  
  // 2. 执行构造函数，并将this指向新创建的对象
  const result = constructor.apply(obj, args);
  
  // 3. 如果构造函数返回对象，则返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

// 使用示例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person = myNew(Person, "张三", 25);
person.sayHello(); // Hello, I'm 张三
```

### 2. 手写 call 方法

`call` 方法允许为不同的对象分配和调用属于一个对象的函数/方法。

```javascript
Function.prototype.myCall = function(context, ...args) {
  // 类型校验
  if (typeof this !== "function") {
    throw new TypeError("myCall 必须由函数调用");
  }

  // 处理 context：null 或 undefined 时指向全局对象
  context = context || globalThis;
  
  // 创建唯一的属性名，避免覆盖原有属性
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  
  // 通过对象调用函数，改变 this 指向
  const result = context[fnSymbol](...args);
  
  // 清理临时属性
  delete context[fnSymbol];
  
  return result;
};

// 使用示例
const person = {
  name: '张三',
  greet: function(prefix, suffix) {
    return `${prefix} ${this.name} ${suffix}`;
  }
};

const anotherPerson = { name: '李四' };
const result = person.greet.myCall(anotherPerson, 'Hello', '!');
console.log(result); // Hello 李四 !
```

### 3. 手写 apply 方法

`apply` 方法与 `call` 类似，区别在于参数传递方式。

```javascript
Function.prototype.myApply = function(context, argsArray) {
  // 类型校验
  if (typeof this !== "function") {
    throw new TypeError("myApply 必须由函数调用");
  }

  // 处理 context
  context = context || globalThis;
  
  // 处理参数数组
  const args = Array.isArray(argsArray) ? argsArray : [];
  
  // 创建唯一的属性名
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  
  // 执行函数
  const result = context[fnSymbol](...args);
  
  // 清理临时属性
  delete context[fnSymbol];
  
  return result;
};

// 使用示例
function sum(a, b, c) {
  return a + b + c;
}

const result = sum.myApply(null, [1, 2, 3]);
console.log(result); // 6
```

### 4. 手写 bind 方法

`bind` 方法创建一个新函数，当调用时设置 `this` 关键字为提供的值。

::: warning ⚠️ 注意事项
`bind` 的返回值可以作为构造函数使用，此时需要特殊处理 `this` 指向。
:::

```javascript
Function.prototype.myBind = function(context, ...args1) {
  if (typeof this !== "function") {
    throw new TypeError("myBind 必须由函数调用");
  }
  
  const fn = this;
  context = context || globalThis;
  
  // 返回的绑定函数
  function BoundFunction(...args2) {
    // 判断是否作为构造函数调用
    if (this instanceof BoundFunction) {
      // 作为构造函数调用时，this 指向新创建的实例
      return fn.apply(this, [...args1, ...args2]);
    } else {
      // 作为普通函数调用时，this 指向绑定的 context
      return fn.apply(context, [...args1, ...args2]);
    }
  }
  
  // 维护原型链
  if (fn.prototype) {
    BoundFunction.prototype = Object.create(fn.prototype);
  }
  
  return BoundFunction;
};

// 使用示例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const BoundPerson = Person.myBind(null, "张三");
const person = new BoundPerson(25); // 作为构造函数
console.log(person.name, person.age); // 张三 25

function greet(greeting, punctuation) {
  return `${greeting} ${this.name}${punctuation}`;
}

const obj = { name: "李四" };
const boundGreet = greet.myBind(obj, "Hello");
console.log(boundGreet("!")); // Hello 李四!
```

## 📚 数组方法实现

### 1. 数组扁平化（flat）

数组扁平化是将多维数组转换为一维数组的过程。

#### 方法一：递归实现

```javascript
function flatArray(arr, depth = 1) {
  const result = [];
  
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// 测试
console.log(flatArray([1, [2, 3], [4, [5, 6]]], 1)); // [1, 2, 3, 4, [5, 6]]
console.log(flatArray([1, [2, 3], [4, [5, 6]]], 2)); // [1, 2, 3, 4, 5, 6]
```

#### 方法二：reduce + 递归

```javascript
function flatArray(arr, depth = 1) {
  return depth > 0 
    ? arr.reduce((acc, val) => 
        acc.concat(Array.isArray(val) ? flatArray(val, depth - 1) : val), [])
    : arr.slice();
}
```

#### 方法三：扩展运算符

```javascript
function flatArray(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

#### 方法四：栈实现（非递归）

```javascript
function flatArray(arr, depth = Infinity) {
  const stack = [...arr.map(item => [item, depth])];
  const result = [];
  
  while (stack.length > 0) {
    const [item, currentDepth] = stack.pop();
    
    if (Array.isArray(item) && currentDepth > 0) {
      stack.push(...item.map(subItem => [subItem, currentDepth - 1]));
    } else {
      result.push(item);
    }
  }
  
  return result.reverse();
}
```

### 2. 数组去重

#### 方法一：Set

```javascript
function uniqueArray(arr) {
  return [...new Set(arr)];
}
```

#### 方法二：filter + indexOf

```javascript
function uniqueArray(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
```

#### 方法三：reduce

```javascript
function uniqueArray(arr) {
  return arr.reduce((acc, current) => {
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}
```

#### 方法四：Map（保持插入顺序）

```javascript
function uniqueArray(arr) {
  const map = new Map();
  const result = [];
  
  for (const item of arr) {
    if (!map.has(item)) {
      map.set(item, true);
      result.push(item);
    }
  }
  
  return result;
}
```

### 3. 实现数组的其他方法

#### Array.prototype.push

```javascript
Array.prototype.myPush = function(...elements) {
  for (const element of elements) {
    this[this.length] = element;
  }
  return this.length;
};

// 测试
const arr = [1, 2, 3];
console.log(arr.myPush(4, 5)); // 5
console.log(arr); // [1, 2, 3, 4, 5]
```

#### Array.prototype.filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError("回调函数必须是一个函数");
  }
  
  const result = [];
  
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // 处理稀疏数组
      if (callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
  }
  
  return result;
};
```

#### Array.prototype.map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError("回调函数必须是一个函数");
  }
  
  const result = [];
  
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  
  return result;
};
```

#### Array.prototype.reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError("回调函数必须是一个函数");
  }
  
  if (this.length === 0 && arguments.length < 2) {
    throw new TypeError("空数组必须提供初始值");
  }
  
  let startIndex = 0;
  let accumulator;
  
  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    // 找到第一个存在的元素作为初始值
    while (startIndex < this.length && !(startIndex in this)) {
      startIndex++;
    }
    accumulator = this[startIndex++];
  }
  
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  
  return accumulator;
};
```

## 🔢 工具函数类

### 1. 数字格式化（千分位分隔符）

```javascript
function formatNumber(num) {
  // 处理数字和字符串
  const str = num.toString();
  const parts = str.split('.');
  
  // 为整数部分添加千分位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
}

// 使用本地化方法（推荐）
function formatNumberLocale(num) {
  return num.toLocaleString();
}

// 测试
console.log(formatNumber(1234567.89)); // 1,234,567.89
console.log(formatNumber(1234567));    // 1,234,567
```

### 2. 数组乱序（洗牌算法）

#### Fisher-Yates 洗牌算法

```javascript
function shuffle(array) {
  const arr = [...array]; // 避免修改原数组
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换元素
  }
  
  return arr;
}

// 测试
const originalArray = [1, 2, 3, 4, 5];
console.log(shuffle(originalArray)); // 随机排列
console.log(originalArray); // 原数组不变
```

### 3. 防抖（Debounce）

防抖确保函数在停止调用后的指定时间内只执行一次。

```javascript
function debounce(func, delay, immediate = false) {
  let timeoutId;
  let result;
  
  const debounced = function(...args) {
    const context = this;
    
    // 清除之前的定时器
    clearTimeout(timeoutId);
    
    if (immediate) {
      // 立即执行模式
      const callNow = !timeoutId;
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, delay);
      
      if (callNow) {
        result = func.apply(context, args);
      }
    } else {
      // 延迟执行模式
      timeoutId = setTimeout(() => {
        result = func.apply(context, args);
      }, delay);
    }
    
    return result;
  };
  
  // 取消防抖
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  return debounced;
}

// 使用示例
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((value) => {
  console.log('搜索:', value);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### 4. 节流（Throttle）

节流确保函数在指定时间间隔内最多执行一次。

```javascript
function throttle(func, delay, options = {}) {
  let timeoutId;
  let lastCallTime = 0;
  let result;
  
  const { leading = true, trailing = true } = options;
  
  const throttled = function(...args) {
    const context = this;
    const now = Date.now();
    
    // 首次调用且不需要立即执行
    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }
    
    const remaining = delay - (now - lastCallTime);
    
    if (remaining <= 0 || remaining > delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      lastCallTime = now;
      result = func.apply(context, args);
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0;
        timeoutId = null;
        result = func.apply(context, args);
      }, remaining);
    }
    
    return result;
  };
  
  // 取消节流
  throttled.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastCallTime = 0;
  };
  
  return throttled;
}

// 使用示例
const throttledScroll = throttle(() => {
  console.log('滚动事件触发');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

## 🔗 深拷贝实现

### 简单版本

```javascript
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  if (obj instanceof Array) {
    return obj.map(item => simpleDeepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = simpleDeepClone(obj[key]);
      }
    }
    return cloned;
  }
}
```

### 完整版本（处理循环引用）

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 基本类型直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // 处理正则对象
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  
  // 处理函数
  if (typeof obj === 'function') {
    return obj; // 函数不需要深拷贝
  }
  
  // 创建新对象或数组
  const cloned = Array.isArray(obj) ? [] : {};
  
  // 记录已处理的对象，防止循环引用
  map.set(obj, cloned);
  
  // 递归拷贝属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }
  
  return cloned;
}

// 测试循环引用
const obj = { name: '张三' };
obj.self = obj;

const cloned = deepClone(obj);
console.log(cloned.name); // 张三
console.log(cloned.self === cloned); // true
```

## 🎯 总结

本文涵盖了前端面试中常见的手写题目，包括：

- **函数实现类**: `new`、`call`、`apply`、`bind`
- **数组方法**: `flat`、去重、`push`、`filter`、`map`、`reduce`
- **工具函数**: 数字格式化、数组乱序、防抖、节流
- **深拷贝**: 简单版本和完整版本

::: tip 🚀 实践建议
1. **理解原理**: 每道题都要理解其核心原理和应用场景
2. **多种实现**: 尝试用不同方法实现同一功能
3. **边界处理**: 注意处理各种边界情况和异常情况
4. **性能优化**: 考虑时间复杂度和空间复杂度
5. **代码质量**: 保持代码的可读性和可维护性
:::

## 🔗 相关资源

- [JavaScript 数组方法详解](../javascript/array.md)
- [异步编程模式](../javascript/async.md)
- [设计模式实现](../questions/designMode.md)
- [算法题解析](../questions/algorithm.md)
