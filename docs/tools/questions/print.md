---
title: 💻 前端常见代码输出题解析
description: 详解前端面试中常见的代码输出问题，包括作用域、原型链、异步编程等核心概念
outline: deep
---

# 💻 前端常见代码输出题解析

> 本文整理了前端面试中常见的代码输出题，帮助你理解 JavaScript 的核心概念和执行机制。

## 1. 作用域与 this 指向

### 1.1 箭头函数的 this

箭头函数是 ES6 新增的功能。没有自己的 this、不能用作构造函数、没有 arguments 属性，可以使用简写语法。它内部的 this 指向，只和它定义的位置有关，永远指向函数外部的 this。

```js
var count = 3;
var user = {
  count: 1,
  getCount() {
    // 定义在对象内部，永远指向对象 user
    return () => {
      return this.count;
    };
  },
};
var func = user.getCount();
console.log(func.call({ count: 2 })); // 输出: 1
```

### 1.2 普通函数的 this

```js
const obj = {
  name: 'obj',
  foo: function() {
    console.log(this.name);
  },
  bar: () => {
    console.log(this.name);
  }
};

obj.foo();           // 输出: "obj"
obj.bar();           // 输出: undefined
const fn = obj.foo;
fn();                // 输出: undefined
```

## 2. 异步编程

### 2.1 Promise 执行顺序

Promise 构造函数内部属于同步任务，then 方法的回调函数属于微任务。JS 执行机制是先执行同步任务，执行完后发现有微任务再去执行微任务队列，最后执行宏任务。

```js
new Promise(resolve => {
  console.log(1);
  Promise.resolve().then(() => console.log(2));
  resolve(
    new Promise(function (resolve) {
      console.log(3);
      resolve(4);
    })
  );
}).then(res => {
  console.log(res);
});
console.log(5);
// 输出顺序: 1, 3, 5, 2, 4
```

### 2.2 async/await 执行顺序

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');
async1();
console.log('script end');

// 输出顺序:
// script start
// async1 start
// async2
// script end
// async1 end
```

## 3. 正则表达式

### 3.1 常见正则匹配

```js
// 以 A 开头、接至少一个数字、接一个小写字母、接 0|1 个数字、接 B、结尾
console.log(/^A[\d]+[a-z]\d?B$/.test("A2g3B"));    // true
console.log(/^A[\d]+[a-z]\d?B$/.test("A2gB"));     // true
console.log(/^A[\d]+[a-z]\d?B$/.test("A22g3B"));   // true
console.log(/^A[\d]+[a-z]\d?B$/.test("A23gb2B"));  // false

// 千分位加逗号
"10000000".replace(/(?=\B(\d{3})+$)/g, ',')  // 输出: "10,000,000"
```

## 4. 内存与引用

### 4.1 循环引用和数据存储

引用类型数据，其指针存在栈内存，实际内容存在堆内存上。其指针指向实际储存在堆内存的起始地址。

```js
var var_a = { a: 1, b: 2 };
var var_b = { a: var_a, b: 3 };
var_c = var_b["a"];
// 此时 var_c 和 var_b.a 都保持对 var_a 的引用

var_b["a"] = var_a = { a: 5 };
// 代码从右往左执行，重置了 var_a，其引用指向了 {a:5}
// var_b.a 指向更改后的 var_a，也就是 {a:5}

console.log(var_c["a"]); // 输出: 1
// var_c 此时仍然指向 var_a 以前的值 {a:1,b:2}
```

## 5. 变量提升

### 5.1 预解析和声明提升

代码执行分成两个阶段：
- 预解析阶段：会把声明的变量和函数提升，变量设置为 undefined。函数优先级比较高，如果有同名变量，会先覆盖变量。
- 执行阶段：从上往下执行。

```js
console.log(func(1, 2)); // 输出: 3
// 函数提升，优先级比变量高，此时执行声明的函数

var func = function (x, y) {
  // 函数表达式
  return x - y;
};

function func(x, y) {
  // 函数声明，优先级更高
  return x + y;
}

console.log(func(1, 2)); // 输出: -1
// 执行函数表达式时，把函数声明覆盖了
```

## 6. 运算符优先级

### 6.1 运算符和隐式转换

```js
var a = 0;
console.log(a++);                    // 输出: 0
// a++ 符号在后面，先打印再 ++

console.log(a++ && ++a + 3);         // 输出: 6
// 有其他运算符时，++ 优先级更高先执行

var b = a++ && ++a + 3;              // 5 + 3 = 8
var c = ++a || ++b;                  // 6 || 8 返回 6，++b 没有执行
console.log(a, b, c);                // 输出: 6, 8, 6

console.log(5 - "3" + "2" - parseInt("3f")); // 输出: 19
// 运算和隐式转化
```

## 7. 原型链

### 7.1 原型链继承

```js
function A(x) {
  this.x = x;
  this.exec = function () {
    return this.x * 2;
  };
}

function B(x) {
  this.x = x;
  this.exexB = function () {
    return this.exec() + 1;
  };
}

B.prototype = new A(2);
// B 的原型为 A 的实例：{x:2, exec: function(){return this.x*2}}

var b = new B(1);
// b：{x:1, exexB: function(){return this.exec()+1}}

console.log(b.exexB()); // 输出: 3
// b 本身没有 exec() 方法，原型 prototype 上有，同时也有 x:2 属性
// 原型方法里的 this.x 优先从实例 b 本身找，b 有属性 x:1
```

## 8. 迭代器

### 8.1 迭代器实现

Object 对象没有实现 Symbol.iterator 迭代器接口。

```js
// 使下面等式成立
let [a, b] = { a: 1, b: 2 };
// 直接运行报错：Uncaught TypeError: {(intermediate value)} is not iterable

Object.prototype[Symbol.iterator] = function () {
  return Object.values(this)[Symbol.iterator]();
};
// 给 Object 原型上添加 Symbol.iterator 接口：借用了数组迭代接口

let [a, b] = { a: 1, b: 2 };
console.log(a, b); // 输出: 1 2
```

### 8.2 生成器函数

```js
function* generator() {
  yield 1;
  yield 2;
  return 3;
}

const gen = generator();
console.log(gen.next());  // 输出: {value: 1, done: false}
console.log(gen.next());  // 输出: {value: 2, done: false}
console.log(gen.next());  // 输出: {value: 3, done: true}
```

## 9. 事件循环

```js
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

new Promise((resolve) => {
  console.log('4');
  resolve();
}).then(() => {
  console.log('5');
});

setTimeout(() => {
  console.log('6');
}, 0);

console.log('7');

// 输出顺序: 1, 4, 7, 5, 2, 3, 6
```

## 10. 参考资料

- [MDN - JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
- [ECMAScript 6 入门](https://es6.ruanyifeng.com/)
- [JavaScript 高级程序设计（第4版）](https://www.ituring.com.cn/book/2472)