---
title: Node.js Events 事件模块
description: Node.js 事件驱动编程，EventEmitter 类的详细使用指南
outline: deep
---

# 🎯 Node.js Events 事件模块

大多数时候不需要创建 EventEmitter 实例，因为支持事件响应的核心模块（如 `fs`、`http` 等）都是 EventEmitter 的实例，都有各自内定的事件。

此事件机制类似于观察者模式：
- 定义事件监听器函数
- 通过 `on` 注册事件监听器，观察事件是否触发
- 通过 `emit` 派发事件，事件监听器观测到事件触发后执行逻辑

::: tip 💡 提示
EventEmitter 是 Node.js 异步事件驱动架构的基础，许多核心模块都继承自这个类。
:::

## 📚 基本用法

```javascript
const events = require('events'); // 引入 events 模块
const eventEmitter = new events.EventEmitter(); // 创建 events 实例

/**
 * 定义事件监听器函数
 * 参数都是 emit 时传过来的
 */
const methodsOne = (param1, param2) => {
  console.log(param1, param2, '监听器1');
};

const methodsTwo = (param1, param2) => {
  console.log(param1, param2, '监听器2');
};

/**
 * 通过 on 注册事件监听器：可以添加多个监听器
 * @param {string} eventName 事件名称
 * @param {Function} handler 事件处理函数
 */
eventEmitter.on('customEvent', methodsOne);
eventEmitter.on('customEvent', methodsTwo);

/**
 * 注册只会执行一次的监听器
 */
eventEmitter.once('onceEventName', methodsTwo);

/**
 * 通过 emit 派发事件
 * @param {string} eventName 事件名称
 * @param {...*} args 传给事件监听器的参数
 */
eventEmitter.emit('customEvent', '参数1', '参数2');
```

## 🛠️ 核心方法

### setMaxListeners()

设置监听器的最大个数，默认最多 10 个：

```javascript
/**
 * 设置监听器的最大个数
 * @param {number} num 最大数目
 */
eventEmitter.setMaxListeners(20);
```

### listeners()

获取某事件的所有监听器：

```javascript
/**
 * 获取某事件的所有监听器
 * @param {string} eventName 事件名称
 * @returns {Array} 事件名对应的监听器数组
 */
const handlerList = eventEmitter.listeners('customEvent');
console.log(handlerList); // [Function: methodsOne, Function: methodsTwo]
```

### listenerCount()

获取某个事件监听器的个数：

```javascript
/**
 * 获取某个事件监听器的个数
 * @param {string} eventName 事件名称
 * @returns {number} 事件名对应的监听器个数
 */
const eventNum = eventEmitter.listenerCount('customEvent');
console.log(eventNum); // 2
```

### removeListener()

移除指定的事件监听器：

```javascript
/**
 * 移除事件监听器
 * @param {string} eventName 事件名称
 * @param {Function} handler 要移除的监听器
 */
eventEmitter.removeListener('customEvent', methodsOne);
```

### removeAllListeners()

移除所有事件监听器：

```javascript
/**
 * 移除所有事件监听器
 * @param {Array} eventNameList 要移除监听器的事件名字数组
 */
eventEmitter.removeAllListeners(['customEvent']);
```

## 🔄 Node.js 事件循环机制

Node.js 的事件循环分为以下步骤：

### 1. 初始化阶段
- 初始化 Event Loop
- 执行主代码，遇到异步处理分配给对应队列
- 主代码执行完毕后进入事件循环

### 2. 微任务执行
执行主代码中出现的所有微任务：
- 先执行完所有 `process.nextTick()`
- 然后执行其它所有微任务

### 3. Event Loop 六个阶段

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

## 📋 六个阶段详解

| 阶段 | 说明 |
|------|------|
| **timers** | 执行 `setTimeout()` 和 `setInterval()` 设定的回调 |
| **pending callbacks** | 执行除了 timer、close、setImmediate 之外的事件回调 |
| **idle, prepare** | 仅系统内部使用 |
| **poll** | 轮询，不断检查新的 I/O callback 事件 |
| **check** | 执行 `setImmediate()` 设定的回调 |
| **close callbacks** | 执行如 `socket.on('close', ...)` 的回调 |

::: warning ⚠️ 注意
每个阶段执行完毕后，都会执行所有微任务（先 `nextTick`，后其它），然后再进入下一个阶段。
:::

## 🎯 Poll 阶段详解

Poll 阶段是最复杂的阶段，主要分为两个步骤：

1. **检查 poll queue**
   - 如果有任务就按先进先出的顺序依次执行回调
   
2. **queue 为空时**
   - 检查是否有 `setImmediate()` 的 callback，如果有就进入 check 阶段
   - 同时检查是否有到期的 timer，如果有就返回 timer 阶段

::: info 📖 关于 process.nextTick()
`process.nextTick()` 在技术上不是事件循环的一部分。相反，无论事件循环的当前阶段如何，都将在当前操作完成后处理 nextTickQueue。
:::

## 💡 最佳实践

1. **合理设置监听器数量**
   ```javascript
   // 避免内存泄漏
   eventEmitter.setMaxListeners(20);
   ```

2. **及时移除监听器**
   ```javascript
   // 不再需要时移除监听器
   eventEmitter.removeListener('event', handler);
   ```

3. **使用 once 避免重复执行**
   ```javascript
   // 只执行一次的事件
   eventEmitter.once('init', initHandler);
   ```

4. **错误处理**
   ```javascript
   eventEmitter.on('error', (err) => {
     console.error('事件错误:', err);
   });
   ```

---

::: tip 🔗 相关链接
- [Node.js Events 官方文档](https://nodejs.org/api/events.html)
- [EventEmitter 详细API](https://nodejs.org/api/events.html#events_class_eventemitter)
- [事件循环深入理解](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
:::
