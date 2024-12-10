## node events 事件模块

大多数时候不需要创建 eventEmitter 实例，因为支持事件响应的核心模块，fs,http....,都是 eventEmitter 的实例，都有各自内定的事件

此事件机制有些像观察者模式

- 定义事件监听器函数
- 通过`on`注册事件监听器，观察事件是否触发
- 通过`emit`派发事件，事件监听器观测到事件触发，执行事件监听器逻辑

```js
let events = require("events"); //引入events模块
let eventEmitter = new events.EventEmitter(); //创建events实例

/**
 * 定义事件监听器函数
 * 参数都是emit是传过来的
 */
methodsOne = (qq, ww) => {
  console.log(qq, ww, "111");
};
methodsTwo = (qq, ww) => {
  console.log(qq, ww, "2222");
};

/**
 * 通过on注册事件监听器：可以添加多个监听器
 * @eventName
 * @handler
 */
eventEmitter.on("zhangjinxi", methodsOne);
eventEmitter.on("zhangjinxi", methodsTwo);
/**
 * 注册只会执行一次的监听器
 */
eventEmitter.once("onceEventName", methodsTwo);

/**
 * 通过emit派发事件：
 * @eventName
 * @args 后面都是传给事件监听器的参数
 */
eventEmitter.emit("zhangjinxi", "这是参数1", "这是参数2");

/**
 * 设置监听器的最大个数，默认最多10个
 * @num <integer> 最多数目
 */
eventEmitter.setMaxListeners(number);

/**
 * 获取某事件的所有监听器
 * @eventName
 * @return <Array> 事件名对应的监听器数组
 */
let handlerList = eventEmitter.listeners("zhangjinxi");

/**
 * 获取某个事件监听器的个数
 * @eventName
 * @return <integer> 事件名对应的监听器个数
 */
let eventNum = eventEmitter.listenerCount("zhangjinxi");

/**
 * 移除事件监听器
 * @eventName
 * @handler 要移除的监听器
 */
eventEmitter.removeListener("zhangjinxi", methodsOne);

/**
 * 移除所有事件监听器
 * @eventNameList <Array> 要移除监听器的事件名字数组
 */
eventEmitter.removeAllListeners(["zhangjinxi"]);
```

## node 事件机制

1. 初始化 Event Loop
2. 执行主代码。遇到异步处理，就会分配给对应的队列。直到主代码执行完毕。
3. 执行主代码中出现的所有微任务：先执行完所有 nextTick()，然后在执行其它所有微任务。
4. 开始 Event Loop

NodeJs 的 Event Loop 分 6 个阶段执行：

```
     ┌───────────────────────────┐
  ┌─>│           timers          │
  │  └─────────────┬─────────────┘
  │  ┌─────────────┴─────────────┐
  │  │     pending callbacks     │
  │  └─────────────┬─────────────┘
  │  ┌─────────────┴─────────────┐
  │  │       idle, prepare       │
  │  └─────────────┬─────────────┘      ┌───────────────┐
  │  ┌─────────────┴─────────────┐      │   incoming:   │
  │  │           poll            │<─────┤  connections, │
  │  └─────────────┬─────────────┘      │   data, etc.  │
  │  ┌─────────────┴─────────────┐      └───────────────┘
  │  │           check           │
  │  └─────────────┬─────────────┘
  │  ┌─────────────┴─────────────┐
  └──┤      close callbacks      │
     └───────────────────────────┘
```

以上的 6 个阶段，具体处理的任务如下：

- timers: 这个阶段执行 setTimeout() 和 setInterval() 设定的回调
- pending callbacks(I/O callbacks)：会执行除了 timer,close,setImmediate 之外的事件回调
- idle, prepare: 仅系统内部使用
- poll: 轮训，不断检查有没有新的 I/O callback 事件，在适当的条件下会阻塞在这个阶段，主要分为如下两个步骤：
  - 先查看 poll queue 中是否有任务，有任务就按先进先出的顺序依次执行回调
  - 当 queue 为空时，会检查是否有 setImmediate() 的 callback，如果有就进入 check 阶段执行这些 callback。但同时也会检查是否有到期的 timer，如果有，就把这些到期的 timer 的 callback 按照调用顺序放到 timer queue 中，之后循环会进入 timer 阶段执行 queue 中的 callback。
- check: 执行 setImmediate() 设定的回调
- close callbacks: 执行比如 socket.on('close', ...) 的回调

每个阶段执行完毕后，都会执行所有微任务（先 nextTick，后其它），然后再进入下一个阶段。

> process.nextTick() 在技术上不是事件循环的一部分。相反，无论事件循环的当前阶段如何，都将在当前操作完成后处理 nextTickQueue。这里的一个操作被视作为一个从 C++ 底层处理开始过渡，并且处理需要执行的 JavaScript 代码。
