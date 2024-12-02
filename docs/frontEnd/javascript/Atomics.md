# Atomics 原子操作

抽象对象 Atomics 可以操作 SharedArrayBuffer 和 ArrayBuffer 对象指定位置的数据，并返回操作之前的值。

> 原子操作：当内存被共享时，确保上一个原子操作结束后，下一个原子操作才开始执行，其操作不会被中断。这样可以确保正在读写的数据的值是符合预期的。

## 静态方法

- `Atomics.add(typedArray, index, value)` 相加，
- `Atomics.sub(typedArray, index, value)` 相减
- `Atomics.and(typedArray, index, value)` 相与
- `Atomics.or(typedArray, index, value)` 相或
- `Atomics.xor(typedArray, index, value)` 异或
- `Atomics.exchange(typedArray, index, value)` 更新
- `Atomics.compareExchange(typedArray, index, expectedValue, replacementValue)` 相等则更新
- `Atomics.isLockFree(size)` 是否整数类型化数组类型的 BYTES_PER_ELEMENT 属性值之一
- `Atomics.load(typedArray, index)` 返回数组中指定 index 的值。
- `Atomics.store(typedArray, index, value)` 将值储存到指定位置，并返回该值。
- `Atomics.wait(typedArray, index, value, timeout)` 保持挂起直到不等于给定值。返回值为 "ok"、"not-equal" 或 "time-out"。
  > 调用时，如果当前代理不允许阻塞，则会抛出异常（大多数浏览器都不允许在主线程中调用 wait()）。
- `Atomics.waitAsync(typedArray, index, value, timeout)` 异步等待并返回一个 Promise。
- `Atomics.notify(typedArray, index, count)` 通知正在等待指定索引的指定数量的代理。返回收到通知的代理数量。

```js
const sab = new SharedArrayBuffer(1024);
const ta = new Uint8Array(sab);

ta[0]; // 0
ta[0] = 5; // 5

Atomics.add(ta, 0, 12); // 5
Atomics.load(ta, 0); // 17

Atomics.and(ta, 0, 1); // 17
Atomics.load(ta, 0); // 1

Atomics.compareExchange(ta, 0, 5, 12); // 1
Atomics.load(ta, 0); // 1

Atomics.exchange(ta, 0, 12); // 1
Atomics.load(ta, 0); // 12

Atomics.isLockFree(1); // true
Atomics.isLockFree(2); // true
/**3 is not one of the BYTES_PER_ELEMENT values */
Atomics.isLockFree(3); // false
Atomics.isLockFree(4); // true

Atomics.or(ta, 0, 1); // 12
Atomics.load(ta, 0); // 13

Atomics.store(ta, 0, 12); // 12

Atomics.sub(ta, 0, 2); // 12
Atomics.load(ta, 0); // 10

Atomics.xor(ta, 0, 1); // 10
Atomics.load(ta, 0); // 11
```

## 等待和通知

```js
// 给定一个共享的Int32Array:
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 等待int32[0]!==0时，往下执行，否则一直挂起
Atomics.wait(int32, 0, 0);
// 值改变为123后，wait不在挂起，这里开始执行，打印新值123
console.log(int32[0]); // 123

// 异步等待int32[0]!==0，后续代码继续执行
const result = Atomics.waitAsync(int32, 0, 0, 1000);
// { async: true, value: Promise {<pending>} }

// 另一个线程存储一个新值123
Atomics.store(int32, 0, 123);
//写入完成时通知等待线程
Atomics.notify(int32, 0, 2);
```
