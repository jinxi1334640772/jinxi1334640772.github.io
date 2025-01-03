## Buffer 模块

buffer 提供了以下 API 来创建 Buffer 类：

```js
const Buffer = require("buffer");

Buffer.alloc(size[, fill[, encoding]])
// 返回一个指定大小的 Buffer 实例，如果没有设置 fill，则默认填满 0

Buffer.allocUnsafe(size)
// 返回一个指定大小的 Buffer 实例，但是它不会被初始化，所以它可能包含敏感的数据

Buffer.allocUnsafeSlow(size)

Buffer.from(array)
// 返回一个被 array 的值初始化的新的 Buffer 实例（传入的 array 的元素只能是数字，不然就会自动被 0 覆盖）

Buffer.from(arrayBuffer[, byteOffset[, length]])
// 返回一个新建的与给定的 ArrayBuffer 共享同一内存的 Buffer。

Buffer.from(buffer)
// 复制传入的 Buffer 实例的数据，并返回一个新的 Buffer 实例

Buffer.from(string[, encoding])
// 返回一个被 string 的值初始化的新的 Buffer 实例

let buffer = Buffer.from("你好", "utf8");
buffer.write('hahah')
buffer.toString()

let json = Buffer.toJSON();
buffer.concat([buffer1,buffer2....],length)

console.log(data, "buffer");
```
