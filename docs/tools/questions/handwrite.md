## new 操作符的过程

```js
function newfun(fn, ...args) {
  if (typeof fn !== "function") throw new Error("参数应该是个构造函数");

  let obj = Object.create(fn.prototype);
  // 创建一个空对象,空对象的原型函数的原型对象prototype

  let result = fn.apply(obj, args);
  // 执行构造函数，并将this指向新创建的对象

  return result instanceof Object ? result : obj;
  // 执行构造函数的返回值如果是对象，返回该对象。否则返回新创建的对象
}
```

## 手写 call 函数

```js
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") throw new TypeError("应该由函数调用");

  context = context || window;
  // 第一个参数为null的话，上下文默认为window

  context.fn = this;
  // 把函数作为上下文的一个属性调用（函数内的this指向该上下文）

  let result = context.fn(...args);
  // 通过上下文执行该函数，拿到返回值（重新this后的返回值）

  delete context.fn;
  // 删除上下文中刚刚新增的属性，防止污染上下文

  return result;
};
```

## 手写 apply 函数

```js
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") throw new TypeError("应该由函数调用");
  context = context || window;
  context.fn = this;
  let result = Array.isArray(args) ? context.fn(...args) : context.fn();
  delete context.fn;
  return result;
};
```

## bind 函数

let fun = fn.bind(context,arg1,arg2)的返回值是个函数，由两种调用方式：

- `作为普通函数调用fun()`此时 fun 中的 this 指向传入的 context 上下文
- `作为构造函数调用new fun()`函数 fun 内的 this 指向新创建的实例对象

```js
Function.prototype.myBind = function (context, ...agrs) {
  if (typeof this !== "function") new TypeError("应该由函数调用");
  context = context || window;
  let fn = this;
  return function Fn() {
    context = this instanceof Fn ? this : context;
    //this instanceof Fn：作为构造函数使用了

    return fn.apply(context, [...agrs, ...arguments]);
  };
};
```

## 实现数组方法

实现 flat 方法

```js
// 递归实现
function flatArray(arr) {
  let result = [];
  for (const iterator of arr) {
    result = result.concat(
      Array.isArray(iterator) ? flatArray(iterator) : iterator
    );
  }
  return result;
}

// reduce + 递归实现
function flatArray(arr) {
  return arr.reduce((result, current) => {
    return result.concat(Array.isArray(current) ? flatArray(current) : current);
  }, []);
}

// 扩展运算符实现
function flatArray(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// split和toString实现
function flatArray(arr) {
  return arr.toString().split(",");
}

// 完整实现数组的flat方法，reduse+递归
function flat(arr, depth) {
  if (!Array.isArray(arr) || depth <= 0) return arr;
  return arr.reduce((result, current) => {
    return result.concat(
      Array.isArray(current) ? flat(current, depth - 1) : current
    );
  }, []);
}
```

实现数组其他方法

```js
// 实现数组的push方法
Array.prototype.push = function () {
  for (const iterator of arguments) {
    this[this.length] = iterator;
    // 遍历参数，依次把参数赋值给数组最后一项
  }
  return this.length;
};

// 实现数组的filter方法
Array.prototype.filter = function (fn) {
  if (typeof fn !== "function") throw new TypeError("参数类型错误");
  let result = [];
  for (let index = 0; index < this.length; index++) {
    const element = array[index];
    fn(element, index, this) && result.push(element);
    // fn的返回值为true，则把该element添加到返回的数组里
  }
  return result;
};

// 数组实现map方法
Array.prototype.map = function (fn) {
  if (typeof fn !== "function") throw new TypeError("参数类型错误");
  let result = [];
  for (let index = 0; index < this.length; index++) {
    const element = array[index];
    result.push(fn(element, index, this));
    // 把函数的返回值添加到返回的数组里
  }
  return result;
};

// 数组实现reduce方法
Array.prototype.reduce = function (fn, initialValue) {
  if (typeof fn !== "function") new TypeError("参数类型错误");

  let Index = [undefined, null].includes(initialValue) ? 1 : 0;
  // 没初始值，则第一项作为初始值，此时Index从1开始，否则从0开始

  let result = initialValue ?? this[0];
  // ??判空运算符：

  for (Index; Index < this.length; Index++) {
    result = fn(result, this[Index], Index, this);
  }
  return result;
};

// 数组乱序输出
function arrayRandom(array) {
  for (var index = 0; index < array.length; index++) {
    let current = array[index];
    let randomIndex =
      Math.round(Math.random() * (array.length - 1 - index)) + index;
    array[index] = array[randomIndex];
    array[randomIndex] = current;
  }
  return array;
}
```

## 数字每千分位用逗号隔开

中国本地默认就是用逗号隔开，可调用：num.toLocalString()。

```js
function formatNumber(num) {
  let numToString = num.toString();
  let index = numToString.indexOf(".");
  if (index >= 0) {
    // 存在小数，输出：整数+小数部分
    return (
      numToString.slice(0, index).replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") +
      numToString.slice(index)
    );
  }
  return numToString.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}
```

## instanceof 代码实现

```js
function myInstanceofOne(left, right) {
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  if (!proto) return false;
  if (proto === prototype) return true;
  return myInstanceof(proto, right);
}
```

## 防抖函数

用于短时间频繁触发事件的场景

```js
// 释放注释部分，可以改为立即执行的防抖函数
function debounce(fn, wait, immediate = false) {
  let timer = null;
  return function () {
    let context = this;
    let args = [...arguments];
    if (timer) {
      // 存在定时器，则取消之前的定时器，重新记时
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
      // immediate = false;
      // wait=immediate ? 0 : wait
    }, wait);
  };
}

// 防抖函数可以被requestAnimationFrame API代替，性能和体验更好,使用简单
let cancelId = requestAnimationFrame(timestamp =>
  console.log("传入参数为下次执行的时间戳：", timestamp)
);
cancelAnimationFrame(cancelId); // 用于取消requestAnimationFrame API
```

## 节流函数

```js
// 定时器版本(默认wait内不得再次执行，wait后才执行)
function throttle(fun, wait) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        // 上移一行，可改为立即执行，
        fun.apply(this, [...arguments]);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}

// 节流函数时间戳版本，用于控制函数至少多久才能触发一次
function throttle(fn, delay) {
  var preTime = Date.now();
  return function () {
    let nowTime = Date.now();
    if (nowTime - preTime >= delay) {
      // 如果两次时间间隔超过了指定时间，则执行函数。
      fn.apply(this, [...arguments]);
      preTime = nowTime;
    }
  };
}
```

## sleep 函数

延迟 delay 毫秒执行 使用：await sleep(1000)

```js
// sleep函数 延迟delay毫秒执行 使用：await sleep(1000)
async function sleep(delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay));
}
```

## 函数柯里化

主要有 3 个作用：

- 参数复用：参数可以重复使用
- 提前返回：提前返回函数，继续接受剩余参数
- 延迟执行：等参数个数足够时执行
- 高阶函数：返回函数可以继续接受参数

```js
function curry(fun, ...args) {
  //当传入函数的参数总个数 (args.length) >= 原函数所需参数个数：fn.length
  //则执行fun函数；否则返回函数，继续接受参数并递归调用curry函数
  return args.length >= fun.length
    ? fun(...args)
    : (..._args) => curry(fun, ...args, ..._args);
}
```

## 实现深拷贝

考虑循环应用和 Symbol 作为 key

```js
// Set缓存使用过的数据，解决循环应用，提升性能
function deepClone(obj, cache = new Set()) {
  if (typeof obj !== "object" || obj === null || cache.has(obj)) return obj;
  cache.add(obj);
  return [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ].reduce(
    (result, key) => {
      result[key] = deepClone(obj[key], cache);
      return result;
    },
    Array.isArray(obj) ? [] : {}
  );
}
```

## js 对象转化为树形结构

```js
// 转换前：
source = [
  { id: 1, pid: 0, name: "body" },
  { id: 2, pid: 1, name: "title" },
  { id: 3, pid: 2, name: "div" },
];
// 转换为:
tree = [
  {
    id: 1,
    pid: 0,
    name: "body",
    children: [
      {
        id: 2,
        pid: 1,
        name: "title",
        children: [{ id: 3, pid: 1, name: "div" }],
      },
    ],
  },
];

/** one 先找出父级，把没有父级的节点（即顶级节点）组成数组返回。
 * 利用引用数据类型指针，引用同一个实际储存的地址 */
function jsToTree(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => {
    let parent = arr.find(v => v.id === item.pid);
    // 找出item的父节点

    if (!parent) return true;
    // 父节点不存在说明是顶级节点，返回顶级节点

    (parent.children || (parent.children = [])).push(item);
    // 父节点存在，把当前item放进父节点里
  });
}

// two 先找出所有子级，然后返回顶级节点数组，顶级节点的pid===0
function jsToTreeTwo(arr) {
  if (!Array.isArray(arr)) return [];
  return data.filter(parent => {
    let children = data.filter(child => child.pid === parent.id);
    // 找出当前节点所有子节点

    children.length && (parent.children = children);
    // 子节点数组赋值给children属性

    return parent.pid === 0; // 返回顶级节点
  });
}

// three 先找出所有父节点和子节点，把子节点push到对应的父节点，在递归找到本子节点的子节点，最后返回顶级节点数组
function jsToTreeThree(arr) {
  let parentArray = arr.filter(item => item.pid === 0);
  // 找出所有的顶级节点

  let childrenArray = arr.filter(item => item.pid !== 0);
  // 找出不是顶级的节点

  function treeData(parentArr, childArr) {
    parentArr.forEach(parent => {
      childArr.forEach((child, index) => {
        //循环遍历父级节点和非父级的节点

        if (parent.id === child.pid) {
          (parent.children || (parent.children = [])).push(child);
          // 把找到的所有子节点添加到父节点内
        }
        let otherChild = JSON.parse(JSON.stringify(childArr));
        // 子节点数组的深拷贝，防止下一步剔除子节点时更改原数组

        otherChild.splice(index, 1);
        // 把子节点从子节点数组里删除

        treeData([child], otherChild);
        // 递归找出当前子节点的所有子节点
      });
    });
  }
  treeData(parentArray, childrenArray);
  return parentArray;
}
```

## 类型判断

```js
// 判断是否是数字，包括可以转成数字的字符串
function isNumber(params) {
  return !isNaN(params) && isFinite(params);
  // 不经过parsefloat转换，'1234qweqw'为非数字

  // return !isNaN(parseFloat(params)) && isFinite(params)
  // 这是jquery中$.isNumeric的源码 '1234qweqw' 先经过
  // parseFloat转换成1234，最终判断是数字
}
```

## 解析 URL query 为对象

```js
let url = 'http://www.domain.com/?user=anonymous&id=123&name=&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
// 转换query为以下对象形式
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}

// 方法一 通过正则匹配 ？ & = 分隔符，再判断值的类型
function urlToObj(url) {
  let paramsString = /.+\?(.+)$/.exec(url)[1];
  let paramsArray = paramsString.split('&');
  let obj = {};
  paramsArray.forEach(item => {
    if (/=/.test(item)) {
      let [key, value] = item.split('=');
      value = decodeURIComponent(value);
      value = isNumber(value) ? Number(value) : value;
      let objCurrent = obj[key];
      objCurrent = objCurrent ? [].concat(objCurrent, value) : value;
    } else {
      obj[item] = true;
    }
  });
  return obj;
}

// 方法二 利用URL或者URLSearchParams API把query解析成迭代器，并自动调用
// decodeURIComponent()解码 。name=和nabled对应的value，都转成空字符串
function urlToObj(url) {
  let search = new URL(url).searchParams;
  let map = {};
  for (const [key, value] of search) {
    let value = !isNaN(value) ? Number(value) : value || true;
    // 是数字就转成number，value为true值就返回value，否则设为true

    map[key] = map[key] ? [].concat([map[key], value]) : value;
    // map已经存在key说明有多个值，新旧值都放进数组里
  }
  return map;
}
```
## 实现简单路由功能

```js
class Router {
  constructor() {
    // 路由对象,保存hash和对应回调函数的映射关系
    this.routes = {};

    this.hash = ""; // 当前hash

    // 初始化监听器
    this.init();
  }
  storeRoute(hash, cb = function () {}) {
    // 添加hash和对应的回调函数，该回调函数可用来刷新局部页面
    this.routes[hash] = cb;
  }
  freshRoute = () => {
    // 页面加载和hash改变时执行回调函数
    this.hash = location.hash.slice(1) || "/";
    this.routes[this.hash]();
  };
  init = () => {
    // 监听页面加载和hash改变事件，执行该hash对应的回调函数
    window.addEventListener("load", this.freshRoute, false);
    window.addEventListener("hashchange", this.freshRoute, false);
  };
}
```

## 模拟实现 setInterval

```js
function mySetInterval(fn, wait) {
  let timer = { flag: true };
  // 控制器，控制定时器是否执行

  function interval() {
    timer.flag &&
      setTimeout(() => {
        fn();
        // 循环调用interval,模拟setInterval
        interval();
      }, wait);
  }
  interval();
  return timer; // 返回控制器，用于取消定时器
}
```

## 动态实现 jsonp

```js
// 动态实现加载脚本文件
function addScript(url) {
  let script = document.createElement("script");
  script.src = url;
  script.type = "text/javascript";
  document.body.appendChild(script);
}

// 本地提前定义函数
function handleRes(res) {
  console.log("这是通过jsonp拿到的远程数据：", res);
}

addScript("http://xxx.xxx.com/xxx.js?callback=handleRes");
// 远程脚本xxx.js从链接中拿到要执行的函数名称handleRes。加载完成后执行函数
// 并传入数据：handleRes({name:'zhangjinxi'})
```

## 是否存在循环引用

```js
// Set缓存遍历过的引用类型数据
function isCircleUse(object, parent = new Set()) {
  if (typeof object !== "object" || object === null) return false;
  parent.add(obj);
  for (const value of Object.values(object)) {
    if (typeof value === "object") {
      if (parent.has(value)) return true;
      // 遍历每个value，如果已经被缓存过，说明存在循环引用

      parent.add(value);
      if (isCircleUse(value, parent)) return true;
      // 递归当前引用类型的值，判断他的子属性是否被缓存过
    }
  }
  return false;
  // 递归遍历完所有子属性都找不到缓存过的值，则不存在循环引用
}
```

## 找出二维数组中，等于指定值的索引

```js
function findTarget(array, target) {
  let result = [];
  for (let row = 0; row < array.length; row++) {
    for (let column = 0; column < array[row].length; column++) {
      if (array[row][column] === target) result.push([row, column]);
      // 等于target值的坐标，放进一个数组里，
    }
  }
  return result;
}
```

## 使对象可迭代

数据可迭代，是因为具有 Symbol.iterator 接口，给对象添加该接口即可

```js
// 使对象可迭代 方法一 使用迭代器
var obj = { a: 1, b: 2, c: 3 };
obj[Symbol.iterator] = function () {
  let keys = Object.keys(this);
  let length = keys.length;
  let index = 0;
  // 提前保存迭代的索引，避免每次迭代时被覆盖

  return {
    next() {
      return index < length
        ? { value: [keys[index], this[keys[index++]]], done: false }
        : { done: true };
    },
  };
};

// 方法二 利用生成器函数
obj[Symbol.iterator] = function* () {
  for (let iterator of Object.entries(this)) {
    yield iterator;
  }
};

// 方法三 借助其他数据的Symbol.iterator接口
Object.prototype[Symbol.iterator] = function () {
  return Object.values(this)[Symbol.iterator]();
};

// 添加了Symbol.iterator接口，就可以像数组一样迭代了
for (var [k, v] of obj) {
  console.log(k, v);
}
```

## 迭代器和生成器函数

以下类型都具有 Symbol.iterator 接口，可以使用 forOf 或者扩展运算符进行迭代操作

- `Array`
- `Set`
- `Map`
- `arguments`
- `nodelist`
- `TypeArray`

```js
// 手写迭代器
function makeIterator(arr) {
  let index = 0;
  return {
    next() {
      return index < arr.length
        ? { value: arr[index++], done: false }
        : { done: true };
    },
  };
}
let iterator = makeIterator([1, 2]);
// 等于 let iterator = [1,2][Symbol.iterator]()

console.log(iterator.next()); // {value:1,done:false}
console.log(iterator.next()); // {value:2,done:false}
console.log(iterator.next()); // {value:undefined,done:true}

// 生成器函数，返回一个迭代器
function* generate() {
  let result = yield 1;
  try {
    yield `返回值是：${result}`;
  } catch (error) {
    console.log(error);
  }
  yield 3;
  yield* [4, 5, 6]; // 这是增强yield
}
```

## async await

本质上是个使生成器函数自动执行的函数。调用生成器函数的返回值是个 iterator 迭代器

```js
// 传入生成器函数
function CO(generateFun) {
  return new Promise((resolve, reject) => {
    let iterator = generateFun();
    // 调用生成器函数返回迭代器

    function step(nextFun) {
      try {
        let { value, done } = nextFun();
        // 此时，执行一次迭代

        if (done) return resolve(value);
        // 迭代完成，则结束迭代，resolve当前值

        // 通过Promise.resolve，可以控制在同步任务执行完之后，再执行step函数
        Promise.resolve(value).then(
          v => step(() => iterator.next(v))
          // 迭代未完成则递归执行step函数，继续下次迭代，并把当前值传给
          // next(value)函数，value会作为上次yield的返回值

          // e => step(() => iterator.throw(e))
        );
      } catch (error) {
        reject(error);
      }
    }
    step(() => iterator.next());
    // 用函数包起来，可以控制在需要的时候执行
  });
}
CO(generate);
```

## 实现 ES5 继承

使用寄生组合式继承的方式实现

```js
function Parent(name) {
  this.name = name;
}
// 构建父类，给父类自身添加属性

Parent.prototype.sayName = function () {
  console.log("name:", this.name);
};
// 父类原型上添加公共属性和方法

function Child(name) {
  Parent.call(this, name);
  // 调用父类构造函数并绑定this为当前子类：继承父类属性
}
Child.prototype = Object.create(Parent.prototype);
// 子类原型指向父类的原型对象，继承父类的公共属性和方法

Child.prototype.getName = function () {
  return this.name;
};
// 可以给子类原型添加属性和方法，可以覆盖同名的原型属性和方法

Child.prototype.constructor = Child;
// 把子类原型上的构造函数重置为自身，防止指向父类构造函数
```

## 实现 Object.create()

```js
function create(proto) {
  // 创造一个新对象，其原型指向参数 proto，并返回新对象
  function F() {}
  F.prototype = proto;
  return new F();
}
```

## 实现 JSON 的方法

```js
// 实现JSON.parse()。利用了Function构造函数
function jsonParse(jsonStr) {
  return new Function("return " + jsonStr)();
}

// 实现JSON.stringify()方法,undefined,function,Symbol默认会被忽略掉，
// null不变。要求undefined,function,Symbol不被忽略掉
function jsonStringify(obj) {
  let type = typeof obj;
  if (obj === null || type !== "object") {
    if (/string/.test(type)) obj = `"${obj}"`; // String类型时，多加一个""
    return String(obj); // 其余原始类型和null，function，转为String类型保存
  }
  let json = [];
  let isArray = Array.isArray(obj);
  for (let k in obj) {
    json.push(`${isArray ? "" : `"${k}":`}${String(jsonStringify(obj[k]))}`);
  }
  return isArray ? `[${String(json)}]` : `{${String(json)}}`;
}

/**
 * 测试对象
 */
let obj = {
  name: undefined,
  old: null,
  age: function () {},
  string: "zhangjinxi",
  boolean: true,
  class: Symbol("12"),
  color: { name: 123 },
  hehe: [1, 2],
};
let string = jsonStringify(obj);
console.log(string);

/** 输出结果：
 * {"name":undefined,"old":null,"age":function(){},"string":"zhangjinxi","boolean":true,"class":Symbol(12),"color":{"name":123},"hehe":[1,2]}
 */

console.log(jsonParse(string));
// 函数经过parse后也可以照常执行
{
  name: undefined,
  old: null,
  age: [Function: age],
  string: 'zhangjinxi',
  boolean: true,
  class: Symbol(12),
  color: { name: 123 },
  hehe: [ 1, 2 ]
}
```

## 图片转为 base64 格式

```js
function imageUrlToBase64(imageUrl, fn) {
  let image = new Image(); // 一定要设置为let，不然图片不显示
  image.setAttribute("crossOrigin", "anonymous"); // 解决跨域问题
  image.src = imageUrl;
  image.onload = () => {
    // image.onload为异步加载
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    // 解决图片转base64透明部分填充成黑色问题

    // context.strokeStyle  = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, image.width, image.height);
    let dataURL = canvas.toDataURL("image/jpeg", (quality = 0.8));
    // 借用canvas.toDataURL方法转为base64类型

    fn(dataURL);
  };
}
```

## 大文件分片上传

服务器支持范围请求，即支持 Range 头部  
断点续传：在分片上传基础上记录上传失败的片段，重新上传

```js
// XMLHttpRequest实现
function resumeUpload(file) {
  var fileSize = file.size; // 获取文件大小
  var xhr = new XMLHttpRequest(); // 构造XMLHttpRequest对象
  xhr.open("POST", "/upload", true);
  var start = 0; // 断点续传的起始位置
  if (file.lastModified) {
    start = file.lastModified;
    // 如果支持file.lastModified，可以根据文件的修改时间判断起始位置
  }
  xhr.setRequestHeader("Range", "bytes=" + start + "-");
  // 设置Range头，代表分断上传其中一部分，字节数表示范围
  xhr.upload.addEventListener("progress", function (event) {
    var progress = Math.round(((event.loaded + start) / fileSize) * 100);
    console.log("Upload progress: " + progress + "%");
  });
  xhr.addEventListener("load", function () {
    // 上传完成
    console.log("Upload complete");
  });
  var blob = file.slice(start, fileSize);
  xhr.send(blob); // 发送文件数据
}

// fetch实现
async function resumeUpload(file) {
  var fileSize = file.size; // 获取文件大小
  var start = 0; // 断点续传的起始位置
  if (file.lastModified) {
    start = file.lastModified;
    // 如果支持file.lastModified，可以根据文件的修改时间判断起始位置
  }
  var request = new Request("/upload", {
    // 构造Request对象
    method: "POST",
    headers: {
      Range: "bytes=" + start + "-",
    },
    body: file.slice(start, fileSize),
  });
  var response = await fetch(request); // 上传文件
  console.log("Upload complete");
}

// axios第三方插件实现
import axios from "axios";
async function resumeUpload(file) {
  var fileSize = file.size; // 获取文件大小
  var formData = new FormData(); // 构造FormData对象
  formData.append("file", file, file.name);
  var start = 0; // 断点续传的起始位置
  if (file.lastModified) {
    start = file.lastModified;
    // 如果支持file.lastModified，可以根据文件的修改时间判断起始位置
  }
  var response = await axios.post("/upload", formData, {
    headers: {
      "Content-Range": "bytes " + start + "-" + (fileSize - 1) + "/" + fileSize,
    },
    onUploadProgress: function (progressEvent) {
      var progress = Math.round(
        ((progressEvent.loaded + start) / fileSize) * 100
      );
      console.log("Upload progress: " + progress + "%");
    },
  });

  console.log("Upload complete", response);
}
```

## 控制并发请求

控制并发请求数量,并按照 url 顺序返回结果

```js
/**
 * @param {Array} urls 请求url数组
 * @param {Number} maxnum 最大并发数
 * @return {Promise} 请求结果数组
 */
function concurRequest(urls, maxnum) {
  return new Promise(resolve => {
    let length = urls.length;
    if (length == 0) return resolve([]);
    //处理边界条件：如果url为0个，没必要下面的操作了

    let index = 0; //调用url的指针
    let requestCount = 0; //已经请求的数量
    let result = []; //要返回的结果数组，包括成功和失败

    async function request() {
      if (index === length) return;
      //处理边界条件：已经请求所有url，则不在请求

      let i = index;
      //保存当前index，用于储存到指定位置的result中，因为index指针一直在移动

      try {
        result[i] = await fetch(urls[index]);
      } catch (error) {
        result[i] = error;
      } finally {
        if (requestCount++ === length) {
          //请求完成的数量等于最大长度时，resolve返回数据，不再请求了

          resolve(result);
        } else {
          index++;
          request();
          // 当前请求结束，继续下一个请求
        }
      }
    }
    for (let i = 0; i < Math.min(maxnum, length); i++) {
      //取最小值作为并发请求数量
      request();
    }
  });
}
concurRequest(["www.baidu.com"], 5);
```

## 分析版本号

```js
/**
 * @param {String} string 要比较的字符串
 * @param {Array} terminals 分隔符数组
 *
 */
function* walk(string, terminals = [".", "-"]) {
  let part = "";
  for (let index = 0; index < string.length; index++) {
    const element = string[index];
    if (terminals.includes(element)) {
      yield part; //把分隔符前面的part迭代出去
      part = "";
    } else {
      part += element;
    }
  }
  if (part) {
    yield part; //把最后一部分迭代出去
  }
}
const Aiterator = walk("1.2-alpha.1");
for (const iterator of Aiterator) {
  console.log(iterator);
  //拿到每一个迭代出来的部分。 1 2 alpha 1
}
```

## fetch 添加超时功能

```js

   function(url, options，timeout = 5000) {
    return new Promise((resolve, reject) => {
      const abortSignal = new AbortController();
      // 借助AbortController停止控制器

      fetch(url, { ...options, signal: abortSignal.signal }).then(resolve, reject);
      setTimeout(() => {
        abortSignal.abort();
        reject(new Error('网络超时'));
      }, timeout);
    });
  };
```

## js 实现函数重载

```js
function createOverload() {
  const callMap = new Map();
  function overload(...args) {
    const types = args.map(arg => typeof arg).join(",");
    const fn = callMap.get(types);
    // 当执行构造函数时，拿到参数类型位置，对应的回调函数

    if (fn) return fn.apply(this, args);
    throw new Error("传参没有匹配的函数");
  }
  overload.addImpl = function (...args) {
    const fn = args.pop();
    if (typeof fn !== "function") return;
    const types = args.join(",");
    callMap.set(types, fn);
    // 注册参数类型、位置字符串，以及对应的回调函数
  };
  return overload;
}
const getUsers = createOverload();
getUsers.addImpl(() => console.log("无参时执行的函数"));
getUsers.addImpl("number", () => console.log("一个number参数时执行的函数"));
getUsers.addImpl("string,number", () =>
  console.log("一个string，一个number参数时执行的函数")
);
getUsers("你好", 123);
```

## 优化列表加载

页面加载大列表，优化页面白屏时间，使用 defer 延迟渲染后面的组件

```js
import { onMounted, ref } from 'vue';
export default function useDefer(maxCount = 100) {
  const frameCount = ref(0);
  let cancelId;
  function updateFrameCount() {
    cancelId = requestAnimationFrame(() => {
      frameCount.value++;
      // if (frameCount.value >= maxCount) return;
      // updateFrameCount();
    });
  }
  updateFrameCount();
  onMounted(() => {
    cancelAnimationFrame(cancelId);
    // 加载完成后取消动画帧
  });
  return function defer(n) {
    return frameCount.value >= n;
  };
}

let defer = useDefer()
<Component1 v-if='defer(30)'></Component1>
// 页面刷新30次之后，才开始加载组件
<Component2 v-if='defer(60)'></Component2>
// 越往后，延迟时间越多，防止页面一次加载太多而卡顿
```
