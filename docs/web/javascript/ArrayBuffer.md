## ArrayBuffer

表示通用的原始二进制数据缓冲区。不能直接操作 ArrayBuffer 中的内容；而是要通过类型化数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。静态属性和方法：

- `[Symbol.species]` 用于创建派生对象的构造函数。
- `isView(arg)` 是否 ArrayBuffer 视图
- `byteLength` ArrayBuffer 的大小，以字节为单位。它在构造时确定，
- `detached` ArrayBuffer 已分离（传输），则返回 true，否则返回 false。
- `maxByteLength` 只读，ArrayBuffer 可以调整到的最大字节长度。它在构造时确定，并且无法更改
- `resizeble` 只读。是否可调整大小
- `resize()` 调整为指定大小，以字节为单位。
- `slice()` 返回内容是从 begin（包含）到 end（不包含）的 ArrayBuffer 的字节内容的副本。
- `transfer()` 创建一个新的 ArrayBuffer 对象，其内容是与此缓冲区相同的字节内容，然后分离此缓冲区。
- `transferToFixedLength()` 创建一个新的不可调整大小的 ArrayBuffer 对象，其内容与此缓冲区相同，然后分离此缓冲区。

下面的例子创建了一个 8 字节的缓冲区，并使用 Int32Array 视图引用它。

```js
const buffer = new ArrayBuffer(8);
const view = new Int32Array(buffer);
```

## SharedArrayBuffer

表示一个通用的原始二进制数据缓冲区，类似于 ArrayBuffer 对象，但它可以用来在共享内存上创建视图。与可转移的 ArrayBuffer 不同，SharedArrayBuffer 不是可转移对象

要在集群中的一个代理（agent，可以是网页的主程序或其任意一个 web worker）与另一个代理之间使用 ShareArrayBuffer 共享内存，需要使用 postMessage 和结构化克隆。

```js
/**
 * @length 要创建的数组缓冲区大小，以字节为单位。
 * @options 配置对象
 *  maxByteLength 该共享数组缓冲区可以调整到的最大字节
 * @return 一个指定大小的新 SharedArrayBuffer 对象
 */
new SharedArrayBuffer(length, options);
const sab = new SharedArrayBuffer(1024);
worker.postMessage(sab);

// 可增大的 SharedArrayBuffer
const buffer = new SharedArrayBuffer(8, { maxByteLength: 16 });

if (buffer.growable) {
  // growable byteLength maxByteLength
  buffer.grow(12);
  // 创建包含当前 SharedArrayBuffer 从 start 开始（包含）到 end 结束（不含）的字节内容的副本
  let newSharedArrayBuffer = buffer.slice(4, 12);
}
```

共享内存可以被 worker 线程或主线程创建和同时更新。根据系统（CPU、操作系统、浏览器）的不同，需要一段时间才能将变化传递给所有上下文环境。因此需要通过原子操作来进行同步。

SharedArrayBuffer 在全局对象上的构造函数是隐藏的，需要文档处于一个安全的上下文之中才行。对于顶级文档，需要设置两个表头来实现网站的跨源隔离：

- `Cross-Origin-Opener-Policy` 设置为 same-origin（来保护你的源站点免受攻击），该标头会限制对弹出窗口引用的保留能力。两个顶级窗口上下文之间的直接访问基本上只在它们同源且携带相同的两个标头（且具有相同的值）时才可行。
- `Cross-Origin-Embedder-Policy` 设置为 require-corp 或 credentialless（保护受害者免受你的源站点的影响）

为了验证跨源隔离是否生效，你可以测试窗口和 worker 上下文中的 crossOriginIsolated 属性：

```js
const myWorker = new Worker("worker.js");

if (crossOriginIsolated) {
  const buffer = new SharedArrayBuffer(16);
  myWorker.postMessage(buffer);
} else {
  const buffer = new ArrayBuffer(16);
  myWorker.postMessage(buffer);
}
```

嵌套文档和专用 worker 线程也需要将` Cross-Origin-Embedder-Policy` 标头设置为同样的值。对于同源嵌套文档和子资源，不需要进行任何其他更改。同站（但跨源）嵌套文档和子资源需要将 Cross-Origin-Resource-Policy 标头设置为 same-site。而它们的跨源（和跨站点）的对应部分也需要将同样的标头设置为 cross-origin。请注意，将 Cross-Origin-Resource-Policy 标头设置为除 same-origin 之外的任何值，都会使资源暴露于潜在的攻击中，比如幽灵漏洞

## TypedArray

一个 TypedArray 对象描述了底层二进制数据缓冲区的类数组视图。将 %TypedArray% 作为一个“抽象类”，其为所有类型化数组的子类提供了实用方法的通用接口。其子类有：

- `Int8Array` 8 位有符号整型（补码）
- `Uint8Array` 8 位无符号整型
- `Int16Array` 16 位有符号整型（补码）
- `Uint16Array` 16 位无符号整型
- `Int32Array` 32 位有符号整型（补码）
- `Uint32Array` 32 位无符号整型
- `Float32Array` 32 位 IEEE 浮点数（7 位有效数字，例如 1.234567）
- `Float64Array` 64 位 IEEE 浮点数（16 位有效数字，例如 1.23456789012345）
- `BigInt64Array` 64 位有符号整型（补码）
- `BigUint64Array` 64 位无符号整型

```js
// 类型数组中每个元素所占用的字节数。
Int8Array.BYTES_PER_ELEMENT; // 1
Uint8Array.BYTES_PER_ELEMENT; // 1
Uint8ClampedArray.BYTES_PER_ELEMENT; // 1
Int16Array.BYTES_PER_ELEMENT; // 2
Uint16Array.BYTES_PER_ELEMENT; // 2
Int32Array.BYTES_PER_ELEMENT; // 4
Uint32Array.BYTES_PER_ELEMENT; // 4
Float32Array.BYTES_PER_ELEMENT; // 4
Float64Array.BYTES_PER_ELEMENT; // 8

//从一个类数组或者可迭代对象中创建一个新类型数组。这个方法和 Array.from() 类似
TypedArray.from(arrayLike, mapFn);
TypedArray.from(arrayLike, mapFn, thisArg);

//创建一个具有可变数量参数的新类型数组。此方法几乎与 Array.of() 相同
TypedArray.of(element0);
TypedArray.of(element0, element1);
TypedArray.of(element0, element1, /* ... ,*/ elementN);
```

实例属性和方法：

- `length` 返回该类型化数组的长度（以元素为单位）,该值在构建 TypedArray 时确定，不可更改
- `byteLength` 表示类型化数组的长度（字节数）。
- `byteOffset` 表示类型化数组距离其 ArrayBuffer 起始位置的偏移（字节数）。
- `buffer` 表示由 TypedArray 在构造期间引用的 ArrayBuffer。
- `set(typedArray, targetOffset)` 从指定数组中读取值，并将其存储在类型化数组中。
- `subarray(begin, end)` 类似 slice()
- ....

## Int8Array

Int8Array 类型数组表示二进制补码 8 位有符号整数的数组

```js
new Int8Array(length);
new Int8Array(typedArray);
new Int8Array(object);
new Int8Array(buffer [, byteOffset [, length]]);

// 以长度参数构造对象
var int8 = new Int8Array(2);
int8[0] = 42;
console.log(int8[0]); // 42
console.log(int8.length); // 2
console.log(int8.BYTES_PER_ELEMENT); // 1

// 以数组构造对象
var arr = new Int8Array([21, 31]);
console.log(arr[1]); // 31

// 从另一数组构造对象
var x = new Int8Array([21, 31]);
var y = new Int8Array(x);
console.log(y[0]); // 21

// 从 ArrayBuffer 构造对象
var buffer = new ArrayBuffer(8);
var z = new Int8Array(buffer, 1, 4);
```

## DataView

可以从二进制 ArrayBuffer 对象中读写多种数值类型的底层接口。多字节的数字格式在内存中的表示方式因机器架构而异，无需考虑不同平台的字节序问题。

```js
const buffer = new ArrayBuffer(2);
new DataView(buffer).setInt16(0, 256, true /* 小端对齐 */);
// Int16Array 使用平台的字节序。
new Int16Array(buffer)[0] === 256;
```

实例属性和方法：

- `byteLength`
- `byteOffset`
- `buffer`
- `getInt8()`
- `getUint8()`
- `getInt16()`
- `getUint16()`
- `getInt32()`
- `getUint32()`
- `getFloat32()`
- `getFloat64()`
- `getBigInt64()`
- g`etBigUint64()`
- 对应的各种 set 方法 setInt8()

某些浏览器不支持 setBigInt64() 和 setBigUint64()。因此，要在代码中启用跨浏览器的 64 位操作，你可以实现自己的 getUint64() 函数，以获得精度达到 Number.MAX_SAFE_INTEGER 的值——这对于某些情况足够使用。

```js
function getUint64(dataview, byteOffset, littleEndian) {
  // 将 64 位的数字拆分位两个 32 位（4 字节）的部分
  const left = dataview.getUint32(byteOffset, littleEndian);
  const right = dataview.getUint32(byteOffset + 4, littleEndian);

  // 将两个 32 位的值组合在一起
  const combined = littleEndian
    ? left + 2 ** 32 * right
    : 2 ** 32 * left + right;

  if (!Number.isSafeInteger(combined))
    console.warn(combined, "超过 MAX_SAFE_INTEGER。可能存在精度丢失。");

  return combined;
}

/**
 * 或者，如果你需要完整的 64 位的范围，你可以创建 BigInt。此外，尽管原生 BigInt 比等效的用户态的库快得多，但由于其大小可变的性质，BigInt 始终比 JavaScript 中的 32 位整数要慢得多。
 */
const BigInt = window.BigInt,
  bigThirtyTwo = BigInt(32),
  bigZero = BigInt(0);
function getUint64BigInt(dataview, byteOffset, littleEndian) {
  // 将 64 位的数字拆分位两个 32 位（4 字节）的部分
  const left = BigInt(dataview.getUint32(byteOffset | 0, !!littleEndian) >>> 0);
  const right = BigInt(
    dataview.getUint32(((byteOffset | 0) + 4) | 0, !!littleEndian) >>> 0
  );

  // 将两个 32 位的值组合在一起并返回该值
  return littleEndian
    ? (right << bigThirtyTwo) | left
    : (left << bigThirtyTwo) | right;
}
```
