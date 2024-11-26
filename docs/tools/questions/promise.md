## promise 原理

```js
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  const self = this; // 保存初始化状态
  this.state = PENDING; // 初始化状态
  this.value = null; // 用于保存 resolve 传入的值
  this.reason = null; // 用于保存 rejected 传入的值
  this.resolvedCallbacks = []; // 用于保存 resolve 的回调函数
  this.rejectedCallbacks = []; // 用于保存 reject 的回调函数
  // 状态转变为 resolved 方法
  function resolve(value) {
    // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变，
      if (self.state === PENDING) {
        self.state = RESOLVED; // 修改状态
        self.value = value; // 设置传入的值
        // 执行回调函数
        self.resolvedCallbacks.forEach(callback => callback(value));
      }
    }, 0);
  }

  // 状态转变为 rejected 方法
  function reject(reason) {
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变
      if (self.state === PENDING) {
        self.state = REJECTED; // 修改状态
        self.reason = reason; // 保存错误原因
        // 执行回调函数
        self.rejectedCallbacks.forEach(callback => callback(reason));
      }
    }, 0);
  }

  try {
    fn(resolve, reject); // 将两个方法传入函数执行
  } catch (e) {
    reject(e); // 遇到错误时，捕获错误，执行 reject 函数
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  onResolved = typeof onResolved === "function" ? onResolved : value => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : error => {
          throw error;
        };

  switch (this.state) {
    case PENDING: // 如果是等待状态，则将函数加入对应列表中
      this.onFulfilledCallbacks.push(onResolved);
      this.onRejectedCallbacks.push(onRejected);
      break;
    case RESOLVED:
      onResolved(this.value);
      break;
    case REJECTED:
      onRejected(this.reason);
      break;
  }
};
// all方法实现
MyPromise.prototype.all = function (promises) {
  if (!Array.isArray(promises)) throw new TypeError("参数类型错误");
  return new Promise((resolve, reject) => {
    let resolveCounter = 0;
    const resolveResult = [];
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        value => {
          resolveCounter++;
          resolveResult[i] = value;
          if (resolveCounter === promises.length) {
            resolve(resolveResult);
          }
        },
        error => {
          reject(error);
        }
      );
    }
  });
};
// race方法实现
MyPromise.prototype.race = function (promises) {
  if (!Array.isArray(promises)) throw new TypeError("参数类型错误");
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(resolve, reject);
    }
  });
};

MyPromise.prototype.finally = function (callback) {
  // this:当前promise实例，this.constructor：Promise构造函数
  const p = this.constructor;
  return this.then(
    value => p.resolve(callback()).then(() => value),
    reason =>
      p.reject(callback()).then(() => {
        throw reason;
      })
  );
};

// promise封装AJAX
// promise 封装实现：
function getJSON(url) {
  // 创建一个 promise 对象
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    // 新建一个 http 请求
    xhr.open("GET", url, true);
    // 设置状态的监听函数
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    // 设置错误监听函数
    xhr.onerror = function () {
      reject(new Error(this.statusText));
    };
    // 设置响应的数据类型
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送 http 请求
    xhr.send(null);
  });
}

// promisify函数，使函数promise化 readFile函数举例，node已经包含该方法在util模块中，util.promisify(func)
function promisify(func) {
  return function (...arg) {
    return new Promise((resolve, reject) => {
      func(...arg, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}
// fs.readFile(path,'utf-8',(err,data)=>{console.log(data);}) 如果err存在，则读取文件失败
const readFile = promisify(fs.readFile);
readFile(path, "utf-8").then(data => console.log(data));
```
