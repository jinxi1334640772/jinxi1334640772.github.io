---
title: JavaScript 原子操作 - Atomics
description: 详细介绍 JavaScript 中的 Atomics 对象，包括原子操作的概念、静态方法以及在多线程环境中的应用
outline: deep
---

# JavaScript 原子操作 - Atomics

Atomics 是一个抽象对象，提供了一组用于在多线程环境中安全操作 SharedArrayBuffer 和 ArrayBuffer 对象的原子操作方法。

## 什么是原子操作

原子操作是指在多线程环境中，当内存被共享时，确保上一个原子操作结束后，下一个原子操作才开始执行的操作。其特点是：

- **不可中断性** - 操作不会被中断
- **数据一致性** - 确保正在读写的数据值符合预期
- **线程安全** - 避免竞态条件和数据竞争

::: info 为什么需要原子操作
在多线程编程中，当多个线程同时访问和修改共享内存时，可能会发生数据竞争。原子操作确保这些操作是线程安全的，避免了数据不一致的问题。
:::

## 基本概念

### SharedArrayBuffer 和 ArrayBuffer

- **ArrayBuffer** - 用于表示通用的、固定长度的原始二进制数据缓冲区
- **SharedArrayBuffer** - 可以在多个 Web Worker 之间共享的 ArrayBuffer

```javascript
// 创建共享缓冲区
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

// 创建普通缓冲区
const ab = new ArrayBuffer(1024);
const ta2 = new Uint8Array(ab);
```

### 类型化数组

Atomics 方法只能用于整数类型的类型化数组：

- `Int8Array`
- `Uint8Array`
- `Int16Array`
- `Uint16Array`
- `Int32Array`
- `Uint32Array`
- `BigInt64Array`
- `BigUint64Array`

## 静态方法

Atomics 对象提供了多种原子操作方法，所有方法都是静态的。

### 算术运算方法

这些方法执行原子算术运算，并返回操作前的值：

| 方法 | 描述 | 语法 |
|------|------|------|
| `Atomics.add()` | 原子加法运算 | `Atomics.add(typedArray, index, value)` |
| `Atomics.sub()` | 原子减法运算 | `Atomics.sub(typedArray, index, value)` |

```javascript
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

ta[0] = 5;

// 原子加法：5 + 12 = 17
const oldValue1 = Atomics.add(ta, 0, 12); // 返回 5（操作前的值）
console.log(Atomics.load(ta, 0)); // 17（操作后的值）

// 原子减法：17 - 7 = 10
const oldValue2 = Atomics.sub(ta, 0, 7); // 返回 17（操作前的值）
console.log(Atomics.load(ta, 0)); // 10（操作后的值）
```

### 位运算方法

这些方法执行原子位运算，并返回操作前的值：

| 方法 | 描述 | 语法 |
|------|------|------|
| `Atomics.and()` | 原子按位与运算 | `Atomics.and(typedArray, index, value)` |
| `Atomics.or()` | 原子按位或运算 | `Atomics.or(typedArray, index, value)` |
| `Atomics.xor()` | 原子按位异或运算 | `Atomics.xor(typedArray, index, value)` |

```javascript
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

ta[0] = 17; // 二进制: 10001

// 原子按位与：17 & 1 = 1
const oldValue1 = Atomics.and(ta, 0, 1); // 返回 17
console.log(Atomics.load(ta, 0)); // 1

ta[0] = 12; // 重新设置为 12，二进制: 1100

// 原子按位或：12 | 1 = 13
const oldValue2 = Atomics.or(ta, 0, 1); // 返回 12
console.log(Atomics.load(ta, 0)); // 13

// 原子按位异或：13 ^ 1 = 12
const oldValue3 = Atomics.xor(ta, 0, 1); // 返回 13
console.log(Atomics.load(ta, 0)); // 12
```

### 交换和比较交换方法

| 方法 | 描述 | 语法 |
|------|------|------|
| `Atomics.exchange()` | 原子交换值 | `Atomics.exchange(typedArray, index, value)` |
| `Atomics.compareExchange()` | 原子比较并交换 | `Atomics.compareExchange(typedArray, index, expectedValue, replacementValue)` |

```javascript
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

ta[0] = 1;

// 原子交换：将索引 0 的值设置为 12，返回旧值
const oldValue1 = Atomics.exchange(ta, 0, 12); // 返回 1
console.log(Atomics.load(ta, 0)); // 12

// 原子比较并交换：如果当前值等于 12，则设置为 20
const oldValue2 = Atomics.compareExchange(ta, 0, 12, 20); // 返回 12
console.log(Atomics.load(ta, 0)); // 20

// 如果当前值不等于期望值，则不进行交换
const oldValue3 = Atomics.compareExchange(ta, 0, 5, 30); // 返回 20（当前值）
console.log(Atomics.load(ta, 0)); // 20（值未改变）
```

### 读写方法

| 方法 | 描述 | 语法 |
|------|------|------|
| `Atomics.load()` | 原子读取值 | `Atomics.load(typedArray, index)` |
| `Atomics.store()` | 原子存储值 | `Atomics.store(typedArray, index, value)` |

```javascript
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

// 原子存储
Atomics.store(ta, 0, 42);

// 原子读取
const value = Atomics.load(ta, 0);
console.log(value); // 42
```

### 等待和通知方法

这些方法用于线程间的同步：

| 方法 | 描述 | 语法 |
|------|------|------|
| `Atomics.wait()` | 同步等待 | `Atomics.wait(typedArray, index, value, timeout)` |
| `Atomics.waitAsync()` | 异步等待 | `Atomics.waitAsync(typedArray, index, value, timeout)` |
| `Atomics.notify()` | 通知等待的线程 | `Atomics.notify(typedArray, index, count)` |

#### Atomics.wait()

::: warning 主线程限制
`Atomics.wait()` 在大多数浏览器的主线程中不被允许，如果调用会抛出异常。通常只能在 Web Worker 中使用。
:::

```javascript
// 在 Web Worker 中使用
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 等待直到 int32[0] 不等于 0
// 返回值: "ok" | "not-equal" | "timed-out"
const result = Atomics.wait(int32, 0, 0, 1000); // 最多等待 1000ms

if (result === "ok") {
  console.log("值已改变");
} else if (result === "timed-out") {
  console.log("等待超时");
}
```

#### Atomics.waitAsync()

```javascript
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 异步等待，返回 Promise
const result = Atomics.waitAsync(int32, 0, 0, 1000);
console.log(result); // { async: true, value: Promise }

result.value.then(outcome => {
  console.log("等待结果:", outcome); // "ok" | "not-equal" | "timed-out"
});
```

#### Atomics.notify()

```javascript
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 通知等待指定索引的线程
// count: 要通知的线程数量，默认为 Infinity
const notifiedCount = Atomics.notify(int32, 0, 1);
console.log(`通知了 ${notifiedCount} 个线程`);
```

### 工具方法

#### Atomics.isLockFree()

检查给定大小是否为某种整数类型化数组类型的 `BYTES_PER_ELEMENT` 属性值：

```javascript
/**
 * @param {number} size - 要检查的字节大小
 * @returns {boolean} 是否为无锁操作
 */
Atomics.isLockFree(size);

console.log(Atomics.isLockFree(1)); // true (Int8Array, Uint8Array)
console.log(Atomics.isLockFree(2)); // true (Int16Array, Uint16Array)
console.log(Atomics.isLockFree(3)); // false (不是标准的 BYTES_PER_ELEMENT 值)
console.log(Atomics.isLockFree(4)); // true (Int32Array, Uint32Array)
console.log(Atomics.isLockFree(8)); // true (BigInt64Array, BigUint64Array)
```

## 完整示例

### 基本原子操作示例

```javascript
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

// 初始化
ta[0] = 0;
console.log("初始值:", Atomics.load(ta, 0)); // 0

// 设置值
Atomics.store(ta, 0, 5);
console.log("存储后:", Atomics.load(ta, 0)); // 5

// 加法操作
const oldAdd = Atomics.add(ta, 0, 12);
console.log("加法前的值:", oldAdd); // 5
console.log("加法后的值:", Atomics.load(ta, 0)); // 17

// 按位与操作
const oldAnd = Atomics.and(ta, 0, 1);
console.log("按位与前的值:", oldAnd); // 17
console.log("按位与后的值:", Atomics.load(ta, 0)); // 1

// 比较交换
const oldCompare = Atomics.compareExchange(ta, 0, 1, 100);
console.log("比较交换前的值:", oldCompare); // 1
console.log("比较交换后的值:", Atomics.load(ta, 0)); // 100

// 交换
const oldExchange = Atomics.exchange(ta, 0, 50);
console.log("交换前的值:", oldExchange); // 100
console.log("交换后的值:", Atomics.load(ta, 0)); // 50
```

### 等待和通知示例

```javascript
// 主线程或 Worker 1
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 初始化为 0
Atomics.store(int32, 0, 0);

// 异步等待值改变
const waitResult = Atomics.waitAsync(int32, 0, 0, 5000);

if (waitResult.async) {
  waitResult.value.then(result => {
    if (result === "ok") {
      console.log("值已改变为:", Atomics.load(int32, 0));
    } else {
      console.log("等待结果:", result);
    }
  });
}

// Worker 2 或其他线程
setTimeout(() => {
  // 改变值
  Atomics.store(int32, 0, 123);
  
  // 通知等待的线程
  const notified = Atomics.notify(int32, 0, 1);
  console.log(`通知了 ${notified} 个等待的线程`);
}, 1000);
```

## 实际应用场景

### 1. 计数器

```javascript
class AtomicCounter {
  constructor() {
    this.sab = new SharedArrayBuffer(4);
    this.counter = new Int32Array(this.sab);
    Atomics.store(this.counter, 0, 0);
  }
  
  increment() {
    return Atomics.add(this.counter, 0, 1);
  }
  
  decrement() {
    return Atomics.sub(this.counter, 0, 1);
  }
  
  get value() {
    return Atomics.load(this.counter, 0);
  }
  
  reset() {
    return Atomics.exchange(this.counter, 0, 0);
  }
}

const counter = new AtomicCounter();
console.log(counter.increment()); // 0 (返回操作前的值)
console.log(counter.value); // 1
```

### 2. 简单的互斥锁

```javascript
class SimpleMutex {
  constructor() {
    this.sab = new SharedArrayBuffer(4);
    this.lock = new Int32Array(this.sab);
    Atomics.store(this.lock, 0, 0); // 0 = 未锁定, 1 = 已锁定
  }
  
  tryLock() {
    // 尝试将 0 改为 1，如果成功则获得锁
    const oldValue = Atomics.compareExchange(this.lock, 0, 0, 1);
    return oldValue === 0; // 如果原值是 0，说明成功获得锁
  }
  
  unlock() {
    Atomics.store(this.lock, 0, 0);
  }
  
  async waitForLock(timeout = 1000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.tryLock()) {
        return true;
      }
      
      // 等待一小段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    
    return false; // 超时
  }
}

const mutex = new SimpleMutex();

// 使用示例
if (mutex.tryLock()) {
  try {
    // 执行临界区代码
    console.log("执行临界区代码");
  } finally {
    mutex.unlock();
  }
} else {
  console.log("无法获得锁");
}
```

### 3. 生产者-消费者模式

```javascript
class AtomicBuffer {
  constructor(size = 10) {
    this.size = size;
    this.sab = new SharedArrayBuffer((size + 2) * 4); // +2 for head and tail
    this.buffer = new Int32Array(this.sab);
    
    // 初始化头尾指针
    Atomics.store(this.buffer, 0, 0); // head
    Atomics.store(this.buffer, 1, 0); // tail
  }
  
  produce(value) {
    const tail = Atomics.load(this.buffer, 1);
    const head = Atomics.load(this.buffer, 0);
    const nextTail = (tail + 1) % this.size;
    
    // 检查缓冲区是否已满
    if (nextTail === head) {
      return false; // 缓冲区已满
    }
    
    // 存储数据
    Atomics.store(this.buffer, 2 + tail, value);
    
    // 更新尾指针
    Atomics.store(this.buffer, 1, nextTail);
    
    return true;
  }
  
  consume() {
    const head = Atomics.load(this.buffer, 0);
    const tail = Atomics.load(this.buffer, 1);
    
    // 检查缓冲区是否为空
    if (head === tail) {
      return null; // 缓冲区为空
    }
    
    // 读取数据
    const value = Atomics.load(this.buffer, 2 + head);
    
    // 更新头指针
    const nextHead = (head + 1) % this.size;
    Atomics.store(this.buffer, 0, nextHead);
    
    return value;
  }
  
  isEmpty() {
    const head = Atomics.load(this.buffer, 0);
    const tail = Atomics.load(this.buffer, 1);
    return head === tail;
  }
  
  isFull() {
    const head = Atomics.load(this.buffer, 0);
    const tail = Atomics.load(this.buffer, 1);
    return (tail + 1) % this.size === head;
  }
}

const buffer = new AtomicBuffer(5);

// 生产者
console.log(buffer.produce(1)); // true
console.log(buffer.produce(2)); // true
console.log(buffer.produce(3)); // true

// 消费者
console.log(buffer.consume()); // 1
console.log(buffer.consume()); // 2
console.log(buffer.consume()); // 3
console.log(buffer.consume()); // null (缓冲区为空)
```

## 性能考虑

### 1. 原子操作的开销

::: warning 性能影响
原子操作比普通操作有更高的开销，因为它们需要确保线程安全。在不需要线程安全的场景下，应避免使用原子操作。
:::

```javascript
// 性能测试示例
const sab = new SharedArrayBuffer(1024);
const ta = new Uint32Array(sab);

// 测试普通操作
console.time("普通操作");
for (let i = 0; i < 1000000; i++) {
  ta[0] = ta[0] + 1;
}
console.timeEnd("普通操作");

// 重置
ta[0] = 0;

// 测试原子操作
console.time("原子操作");
for (let i = 0; i < 1000000; i++) {
  Atomics.add(ta, 0, 1);
}
console.timeEnd("原子操作");
```

### 2. 选择合适的数据类型

不同的类型化数组有不同的性能特征：

```javascript
// 根据数据范围选择合适的类型
const sab = new SharedArrayBuffer(1024);

// 对于小整数，使用 Uint8Array
const uint8 = new Uint8Array(sab, 0, 256);

// 对于大整数，使用 Uint32Array
const uint32 = new Uint32Array(sab, 256, 64);

// 对于非常大的整数，使用 BigUint64Array
const bigUint64 = new BigUint64Array(sab, 512, 32);
```

## 浏览器兼容性

::: info 兼容性说明
- **SharedArrayBuffer** 由于安全考虑，在某些浏览器中可能被禁用
- **Atomics** 需要浏览器支持 SharedArrayBuffer
- 主线程中的 `Atomics.wait()` 在大多数浏览器中不被支持
:::

```javascript
// 检查浏览器支持
function checkAtomicsSupport() {
  if (typeof SharedArrayBuffer === 'undefined') {
    console.log('SharedArrayBuffer 不被支持');
    return false;
  }
  
  if (typeof Atomics === 'undefined') {
    console.log('Atomics 不被支持');
    return false;
  }
  
  console.log('Atomics 和 SharedArrayBuffer 都被支持');
  return true;
}

checkAtomicsSupport();
```

## 总结

Atomics 对象为 JavaScript 提供了强大的原子操作能力：

- **线程安全** - 确保多线程环境中的数据一致性
- **丰富的操作** - 支持算术、位运算、交换等多种原子操作
- **同步机制** - 提供等待和通知机制用于线程间协调
- **性能优化** - 在需要线程安全的场景下提供高效的解决方案

虽然原子操作主要用于 Web Worker 和多线程编程，但理解这些概念对于编写高性能的并发代码非常重要。在使用时要注意浏览器兼容性和性能影响，选择合适的场景应用这些强大的工具。
