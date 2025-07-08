---
title: ArrayBuffer 与二进制数据
description: 详细介绍 JavaScript 中的 ArrayBuffer、SharedArrayBuffer、TypedArray 和 DataView，用于处理二进制数据
outline: deep
---

# ArrayBuffer 与二进制数据

JavaScript 提供了一套完整的二进制数据处理 API，包括 ArrayBuffer、SharedArrayBuffer、TypedArray 和 DataView。这些 API 让我们能够高效地处理原始二进制数据。

## ArrayBuffer

`ArrayBuffer` 表示通用的原始二进制数据缓冲区。不能直接操作 ArrayBuffer 中的内容，而是要通过类型化数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式。

### 静态属性和方法

| 属性/方法 | 描述 |
|-----------|------|
| `[Symbol.species]` | 用于创建派生对象的构造函数 |
| `isView(DataView)` | 检查是否为 ArrayBuffer 视图 |

### 实例属性和方法

| 属性/方法 | 描述 |
|-----------|------|
| `byteLength` | ArrayBuffer 的大小，以字节为单位（构造时确定） |
| `maxByteLength` | ArrayBuffer 可以调整到的最大字节长度（只读） |
| `detached` | ArrayBuffer 是否已分离（传输），返回 true/false |
| `resizable` | 是否可调整大小（只读） |
| `resize(size)` | 调整为指定大小，以字节为单位 |
| `slice(begin, end)` | 返回指定范围的字节内容副本 |
| `transfer()` | 创建新的 ArrayBuffer 并分离当前缓冲区 |
| `transferToFixedLength()` | 创建新的不可调整大小的 ArrayBuffer 并分离当前缓冲区 |

### 基本用法

```javascript
// 创建一个 8 字节的缓冲区
const buffer = new ArrayBuffer(8);

// 使用 Int32Array 视图引用它
const view = new Int32Array(buffer);

console.log(buffer.byteLength); // 8
console.log(view.length); // 2 (8 字节 / 4 字节每个元素)
```

## SharedArrayBuffer

`SharedArrayBuffer` 表示一个通用的原始二进制数据缓冲区，类似于 ArrayBuffer 对象，但它可以用来在共享内存上创建视图。与可转移的 ArrayBuffer 不同，SharedArrayBuffer 不是可转移对象。

::: warning 安全要求
SharedArrayBuffer 需要在安全的上下文中才能使用，需要设置特定的 HTTP 头来实现跨源隔离。
:::

### 构造函数

```javascript
/**
 * @param {number} length 要创建的数组缓冲区大小，以字节为单位
 * @param {Object} options 配置对象
 * @param {number} options.maxByteLength 该共享数组缓冲区可以调整到的最大字节
 * @returns {SharedArrayBuffer} 一个指定大小的新 SharedArrayBuffer 对象
 */
new SharedArrayBuffer(length, options);
```

### 基本用法

```javascript
// 创建一个 1024 字节的共享缓冲区
const sab = new SharedArrayBuffer(1024);
worker.postMessage(sab);

// 可增大的 SharedArrayBuffer
const buffer = new SharedArrayBuffer(8, { maxByteLength: 16 });

if (buffer.growable) {
  console.log('可增长:', buffer.growable);
  console.log('当前大小:', buffer.byteLength);
  console.log('最大大小:', buffer.maxByteLength);
  
  buffer.grow(12);
  let newSharedArrayBuffer = buffer.slice(4, 12);
}
```

### 跨源隔离配置

为了使用 SharedArrayBuffer，需要设置以下 HTTP 头：

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

检查跨源隔离是否生效：

```javascript
const myWorker = new Worker("worker.js");

if (crossOriginIsolated) {
  const buffer = new SharedArrayBuffer(16);
  myWorker.postMessage(buffer);
} else {
  const buffer = new ArrayBuffer(16);
  myWorker.postMessage(buffer);
}
```

::: info 同步注意事项
共享内存可以被 worker 线程或主线程创建和同时更新。根据系统的不同，需要一段时间才能将变化传递给所有上下文环境。因此需要通过原子操作来进行同步。
:::

## TypedArray

`TypedArray` 描述底层二进制数据缓冲区的类数组视图。它是一个"抽象类"，为所有类型化数组的子类提供了实用方法的通用接口。

### 类型化数组子类

| 类型 | 描述 | 字节数 |
|------|------|--------|
| `Int8Array` | 8 位有符号整型（补码） | 1 |
| `Uint8Array` | 8 位无符号整型 | 1 |
| `Uint8ClampedArray` | 8 位无符号整型（截断） | 1 |
| `Int16Array` | 16 位有符号整型（补码） | 2 |
| `Uint16Array` | 16 位无符号整型 | 2 |
| `Int32Array` | 32 位有符号整型（补码） | 4 |
| `Uint32Array` | 32 位无符号整型 | 4 |
| `Float32Array` | 32 位 IEEE 浮点数 | 4 |
| `Float64Array` | 64 位 IEEE 浮点数 | 8 |
| `BigInt64Array` | 64 位有符号整型（补码） | 8 |
| `BigUint64Array` | 64 位无符号整型 | 8 |

### 静态属性和方法

```javascript
// 类型数组中每个元素所占用的字节数
console.log(Int8Array.BYTES_PER_ELEMENT);   // 1
console.log(Uint8Array.BYTES_PER_ELEMENT);  // 1
console.log(Int16Array.BYTES_PER_ELEMENT);  // 2
console.log(Int32Array.BYTES_PER_ELEMENT);  // 4
console.log(Float32Array.BYTES_PER_ELEMENT); // 4
console.log(Float64Array.BYTES_PER_ELEMENT); // 8

// 从类数组或可迭代对象创建新类型数组
TypedArray.from(arrayLike, mapFn, thisArg);

// 创建具有可变数量参数的新类型数组
TypedArray.of(element0, element1, /* ... */ elementN);
```

### 实例属性和方法

| 属性/方法 | 描述 |
|-----------|------|
| `length` | 类型化数组的长度（元素数量），构建时确定，不可更改 |
| `byteLength` | 类型化数组的长度（字节数） |
| `byteOffset` | 类型化数组距离其 ArrayBuffer 起始位置的偏移（字节数） |
| `buffer` | 类型化数组引用的 ArrayBuffer |
| `set(typedArray, targetOffset)` | 从指定数组读取值并存储到类型化数组中 |
| `subarray(begin, end)` | 返回新的类型化数组视图（类似 slice） |

## Int8Array

`Int8Array` 类型数组表示二进制补码 8 位有符号整数的数组。

### 构造方法

```javascript
new Int8Array(length);
new Int8Array(typedArray);
new Int8Array(object);
new Int8Array(buffer [, byteOffset [, length]]);
```

### 使用示例

```javascript
// 以长度参数构造对象
const int8 = new Int8Array(2);
int8[0] = 42;
console.log(int8[0]); // 42
console.log(int8.length); // 2
console.log(int8.BYTES_PER_ELEMENT); // 1

// 以数组构造对象
const arr = new Int8Array([21, 31]);
console.log(arr[1]); // 31

// 从另一数组构造对象
const x = new Int8Array([21, 31]);
const y = new Int8Array(x);
console.log(y[0]); // 21

// 从 ArrayBuffer 构造对象
const buffer = new ArrayBuffer(8);
const z = new Int8Array(buffer, 1, 4);
console.log(z.byteOffset); // 1
console.log(z.length); // 4
```

## DataView

`DataView` 可以从二进制 ArrayBuffer 对象中读写多种数值类型的底层接口。多字节的数字格式在内存中的表示方式因机器架构而异，DataView 可以控制字节序问题。

### 字节序示例

```javascript
const buffer = new ArrayBuffer(2);

// DataView 可以指定字节序
new DataView(buffer).setInt16(0, 256, true /* 小端对齐 */);

// Int16Array 使用平台的字节序
console.log(new Int16Array(buffer)[0] === 256);
```

### 实例属性和方法

| 属性/方法 | 描述 |
|-----------|------|
| `byteLength` | DataView 的字节长度 |
| `byteOffset` | DataView 的字节偏移 |
| `buffer` | DataView 引用的 ArrayBuffer |

### 读取方法

| 方法 | 描述 |
|------|------|
| `getInt8(byteOffset)` | 读取 8 位有符号整数 |
| `getUint8(byteOffset)` | 读取 8 位无符号整数 |
| `getInt16(byteOffset, littleEndian)` | 读取 16 位有符号整数 |
| `getUint16(byteOffset, littleEndian)` | 读取 16 位无符号整数 |
| `getInt32(byteOffset, littleEndian)` | 读取 32 位有符号整数 |
| `getUint32(byteOffset, littleEndian)` | 读取 32 位无符号整数 |
| `getFloat32(byteOffset, littleEndian)` | 读取 32 位浮点数 |
| `getFloat64(byteOffset, littleEndian)` | 读取 64 位浮点数 |
| `getBigInt64(byteOffset, littleEndian)` | 读取 64 位有符号 BigInt |
| `getBigUint64(byteOffset, littleEndian)` | 读取 64 位无符号 BigInt |

### 写入方法

对应每个读取方法，都有相应的 `set` 方法，如 `setInt8()`、`setUint16()` 等。

### 跨浏览器 64 位操作

某些浏览器不支持 `setBigInt64()` 和 `setBigUint64()`。可以实现自定义的 64 位操作函数：

```javascript
function getUint64(dataview, byteOffset, littleEndian) {
  // 将 64 位的数字拆分为两个 32 位（4 字节）的部分
  const left = dataview.getUint32(byteOffset, littleEndian);
  const right = dataview.getUint32(byteOffset + 4, littleEndian);

  // 将两个 32 位的值组合在一起
  const combined = littleEndian 
    ? left + 2 ** 32 * right 
    : 2 ** 32 * left + right;

  if (!Number.isSafeInteger(combined)) {
    console.warn(combined, "超过 MAX_SAFE_INTEGER。可能存在精度丢失。");
  }

  return combined;
}
```

### 使用 BigInt 的完整 64 位范围

```javascript
const BigInt = window.BigInt;
const bigThirtyTwo = BigInt(32);
const bigZero = BigInt(0);

function getUint64BigInt(dataview, byteOffset, littleEndian) {
  // 将 64 位的数字拆分为两个 32 位（4 字节）的部分
  const left = BigInt(dataview.getUint32(byteOffset | 0, !!littleEndian) >>> 0);
  const right = BigInt(dataview.getUint32(((byteOffset | 0) + 4) | 0, !!littleEndian) >>> 0);

  // 将两个 32 位的值组合在一起并返回该值
  return littleEndian 
    ? (right << bigThirtyTwo) | left 
    : (left << bigThirtyTwo) | right;
}
```

::: tip 性能提示
尽管原生 BigInt 比等效的用户态库快得多，但由于其大小可变的性质，BigInt 始终比 JavaScript 中的 32 位整数要慢得多。
:::

## 总结

JavaScript 的二进制数据处理 API 提供了强大的功能：

- **ArrayBuffer** - 原始二进制数据缓冲区
- **SharedArrayBuffer** - 可在多线程间共享的缓冲区
- **TypedArray** - 类型化数组视图，提供类型安全的数据访问
- **DataView** - 灵活的数据视图，支持字节序控制

这些 API 广泛应用于：
- WebGL 图形编程
- 音频/视频处理
- 网络数据传输
- 文件操作
- 加密算法实现

掌握这些 API 对于处理二进制数据和性能敏感的应用程序开发至关重要。
