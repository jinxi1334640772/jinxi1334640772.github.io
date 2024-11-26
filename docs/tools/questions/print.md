## 箭头函数 this 指向

箭头函数是 ES6 新增的功能。没有自己的 this、不能用作构造函数、没有 arguments 属性，可以使用简写语法。它内部的 this 指向，只和它定义的位置有关，永远指向函数外部的 this。

```js
//
var count = 3;
var user = {
  count: 1,
  getCount() {
    // 定义在对象内部，永远指向对象user
    return () => {
      return this.count;
    };
  },
};
var func = user.getCount();
console.log(func.call({ count: 2 })); // 1
```

## Promise 执行顺序

promise 构造函数内部属于同步任务，then 方法的回调函数属于微任务。js 执行机制，是先执行同步任务，执行完后发现有微任务再去执行微任务队列，最后执行宏任务。

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
console.log(5); // 1,3,5,2,4
```

## 正则


```js
//以 A 开头、接至少一个数字、接一个小写字母、接 0|1 个数字、接 B、结尾
console.log(/^A[\d]+[a-z]\d?B$/.test("A2g3B")); // true
console.log(/^A[\d]+[a-z]\d?B$/.test("A2gB")); //true
console.log(/^A[\d]+[a-z]\d?B$/.test("A22g3B")); // true
console.log(/^A[\d]+[a-z]\d?B$/.test("A23gb2B")); //false

// 千分位加逗号
"10000000".replace(/(?=\B(\d{3})+$)/g,',')
// 匹配一个空格，这个空格后为非边界，后跟至少一组三位数字。
```

## 循环应用和数据储存

引用类型数据，其指针存在栈内存，实际内容存在堆内存上。其指针指向实际储存在堆内存的起始地址

```js
var var_a = { a: 1, b: 2 };
var var_b = { a: var_a, b: 3 };
var_c = var_b["a"];
// 此时var_c和var_b.a都保持对var_a的引用

var_b["a"] = var_a = { a: 5 };
// 代码从右往左执行，重置了var_a，其引用指向了{a:5}
// var_b.a指向更改后的var_a，也就是{a:5}

console.log(var_c["a"]); // 1
//var_c此时仍然指向var_a以前的值{a:1,b:2}
```

##  预解析&声明提升

代码执行分成两个阶段：

- 预解析阶段：会把声明的变量和函数提升，变量设置为 undefined。函数优先级比较高，如果有同名变量，会先覆盖变量。
- 执行阶段：从上往下执行

```js
console.log(func(1, 2)); // 3
// 函数提升，优先级比变量高，此时执行声明的函数

var func = function (x, y) {
  // 函数表达式
  return x - y;
};
function func(x, y) {
  // 函数声明，优先级更高
  return x + y;
}
console.log(func(1, 2)); // -1
// 执行函数表达式时，把函数声明覆盖了。
```

## 运算符和隐式转换

```js
var a = 0;
console.log(a++); // 返回值0
// a++ 符号在后面，先打印在++

console.log(a++ && ++a + 3); // 返回值是3+3=6
//有其他运算符 ++优先级更好先执行

var b = a++ && ++a + 3; // 5+3+8
var c = ++a || ++b; // 6 || 8 返回6。++b没有执行
console.log(a, b, c); // 6,8,6

console.log(5 - "3" + "2" - parseInt("3f")); // 19
// 运算和隐式转化
```

## 原型链

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
// B的原型为A的实例：{x:2,exec:functon(){return this.x*2}}

var b = new B(1);
// b：{x:1,exexB:function(){return this.exec()+1}}

console.log(b.exexB()); // 3
// b本身没有exex()方法，原型prototype上有，同时也有x:2属性
// 原型方法里的this.x优先从实例b本身找，b有属性x:1
```

## 迭代器&运行原理

Object 对象没有实现 Symbol.iterator 迭代器接口。

```js
// 使下面等式成立
let [a, b] = { a: 1, b: 2 };
//直接运行报错：Uncaught TypeError: {(intermediate value)(intermediate value)} is not iterable

Object.prototype[Symbol.iterator] = function () {
  return Object.values(this)[Symbol.iterator]();
};
// 给Object原型上添加Symbl.iterator接口：借用了数组迭代接口

let [a, b] = { a: 1, b: 2 };
console.log(a, b); // 1 2
```
