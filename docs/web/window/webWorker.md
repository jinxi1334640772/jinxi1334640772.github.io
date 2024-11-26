## Web Worker API

Web Worker 使得在一个独立于 Web 应用程序主执行线程的后台线程中运行脚本操作成为可能。这样做的好处是可以在独立线程中执行费时的处理任务，使主线程（通常是 UI 线程）的运行不会被阻塞/放慢。

数据通过消息系统在 worker 和主线程之间发送——双方都使用 postMessage() 方法发送消息，并通过 onmessage 事件处理程序响应消息（消息包含在 message 事件的 data 属性中）。数据是复制的，而不是共享的。

有许多不同类型的 worker：

- Web worker 即专用 worker ，是由单个脚本使用的 worker。该上下文由 DedicatedWorkerGlobalScope 对象表示。
- Shared worker 是可以由在不同窗口、IFrame 等中运行的多个脚本使用的 worker，只要它们与 worker 在同一域中。它们比专用的 worker 稍微复杂一点——脚本必须通过活动端口进行通信。
- Service Worker 基本上是作为代理服务器，位于 web 应用程序、浏览器和网络（如果可用）之间。它们的目的是（除开其他方面）创建有效的离线体验、拦截网络请求，以及根据网络是否可用采取合适的行动并更新驻留在服务器上的资源。它们还将允许访问推送通知和后台同步 API。

worker 在一个与当前 window 不同的全局上下文中运行！虽然 Window 不能直接用于 worker，但许多相同的方法被定义在一个共享的混入（WindowOrWorkerGlobalScope）中，并通过 worker 自己的 WorkerGlobalScope 衍生的上下文提供给它们：

- `DedicatedWorkerGlobalScope` 用于专用 Web worker
- `SharedWorkerGlobalScope` 用于共享 Shared worker
- `ServiceWorkerGlobalScope` 用于 service worker

Worker 对象的属性和方法：

- `postMessage()`
- `terminate()`
- `message事件`
- `messageerror事件`

```js
// 主进程：main.js
/**创建Worker对象
 * @URL worker 将执行的脚本的 URL。它必须遵守同源策略。
 * @options
 *  type  worker 类型，可以是 classic 或 module
 *  name 表示 worker 的 scope 的一个 name属性，主要用于调试目的。
 *  credentials 指定 worker 凭证，可以是* omit*, same-origin，或 include
 */
var myWorker = new Worker("worker.js", {});

myWorker.postMessage("向worker发送数据");

myWorker.onmessage = function (event) {
  console.log("接收worker传来的数据", event.data);
};
myWorker.onmessageerror = function (event) {
  console.log("接收worker消息失败", event);
};

//立即终止 worker。
myWorker.terminate();

// worker进程：worker.js
// 导入脚本，可以导入跨域脚本，所有Worker共享的方法
self.importScripts(path0, path1, /* …, */ pathN);

self.onmessage = function (event) {
  console.log("接收主进程发来的消息", event.data);
};
self.postMessage("向主进程发送消息");

//立即终止 worker，关闭当前worker作用域。
self.close();
```

## SharedWorker

SharedWorker 接口代表一种特定类型的 worker，可以从几个同源的浏览上下文中访问，例如几个窗口、iframe 或其他 worker。它们实现一个不同于普通 worker 的接口，具有不同的全局作用域，SharedWorkerGlobalScope

```js
var myWorker = new SharedWorker(aURL, name);
var myWorker = new SharedWorker(aURL, options);

var myWorker = new SharedWorker("worker.js");
// 当使用addEventListener()添加message事件时，需要先调用start()，手动启动端口，类似MessageChannel接口。onmessge已经默认调用了start()，不需要再次调用。
myWorker.port.start();

myWorker.port.postMessage("向sharedWorker发送结构化克隆数据");

myWorker.port.onmessage = function (e) {
  console.log("监听sharedWorder发来的数据", e.data);
};

// worker.js
self.onconnect = function (event) {
  console.log("当新客户端连接时在共享工作程序上触发。", event);
  let port = e.ports[0];
  port.addEventListener("message", function (event) {
    console.log("接收主进程发送的消息", event.data);
    port.postMessage("通过port向主进程发送消息");
  });
  // 同理，当使用addEventListener()添加message事件时，需要start()手动启动端口
  port.start();
};

// 丢弃在事件循环中排队的任何任务，关闭sharedWorker作用域
self.close();
```
