# Stream API

Stream API 为 Web 平台提供了一组十分有用的工具，提供了一系列对象以允许 JavaScript 访问来自网络的数据流，并根据开发人员的需要对其进行处理。

## 可读流

一个可读流是一个数据源，在 JavaScript 中用一个 ReadableStream 对象表示，数据从它的底层源（underlying source）流出——底层源表示一个你希望从中获取数据，且来自网络或其他域的某种资源。

有两种类型的底层源：

- Push source 会在你访问了它们之后，不断地主动推送数据。你可以自行开始（start）、暂停（pause）或取消（cancel）对流的访问。例如视频流和 TCP/Web socket。
- Pull source 需要在你连接到它们后，显式地请求数据。例如通过 Fetch 或 XHR 请求访问一个文件。
  数据被按序读入到许多小的片段，这些片段被称作分块（chunk）。分块可以是单个字节，也可以是某种更大的数据类型，例如特定大小的类型化数组。单个流的分块可以有不同的大小和类型。

你可以使用现成的可读流，例如来自 fetch 请求的 Response.body，也可以使用 ReadableStream() 构造函数生成自定义的流。

> 注意，有两种不同类型的可读流。除了传统的可读流之外，还有一种类型叫做字节流——这是传统流的扩展版本，用于读取底层字节源。相比于传统的可读流，字节流被允许通过 BYOB reader 读取（BYOB，“带上你自己的缓冲区”）。这种 reader 可以直接将流读入开发者提供的缓冲区，从而最大限度地减少所需的复制。你的代码将使用哪种底层流（以及使用哪种 reader 和 controller）取决于流最初是如何创建的

- `pipeThrough()` 将可读流管道输出至拥有一对 writer/reader 的流中，并将一种数据转换成另一种
- `pipeTo()` 将可读流管道传输至作为链式管道传输终点的 writer。

![nidi](readable_streams.png)

## 可写流

一个可写流（Writable stream）是一个可以写入数据的数据终点，在 JavaScript 中以一个 WritableStream 对象表示。这是 JavaScript 层面对底层接收器（underlying sink）的抽象——一个更低层次的 I/O 接收器，将原始数据写入其中。

数据由一个 writer 写入流中，每次只写入一个分块。分块和可读流的 reader 一样可以有多种类型。你可以用任何方式生成要被写入的块；writer 加上相关的代码称为生产者。

当 writer 被创建并开始向一个流写入数据（一个活跃的 writer）时，我们说，它被锁定（locked）在该流上。同一时刻，一个 writer 只能向一个可写流写入数据。如果你想要用其他 writer 向流中写入数据，在你将 writer 附着到该流之前，你必须先中止上一个 writer。

```js
const decoder = new TextDecoder("utf-8");
let result = "";
const writableStream = new WritableStream(
  {
    write(chunk) {
      return new Promise((resolve, reject) => {
        var buffer = new ArrayBuffer(1);
        var view = new Uint8Array(buffer);
        view[0] = chunk;
        var decoded = decoder.decode(view, { stream: true });
        result += decoded;
        resolve();
      });
    },
    close() {},
    abort(err) {
      console.log("Sink error:", err);
    },
  },
  //WritableStream 实例处理单个 write() 操作时可接受的最大数据量
  new CountQueuingStrategy({ highWaterMark: 1 })
);

sendMessage("Hello, world.", writableStream);

function sendMessage(message, writableStream) {
  // defaultWriter is of type WritableStreamDefaultWriter
  const defaultWriter = writableStream.getWriter();
  const encoder = new TextEncoder();
  const encoded = encoder.encode(message, { stream: true });
  encoded.forEach(chunk => {
    // sink完全写入数据时兑现的promise
    defaultWriter.ready
      .then(() => {
        // 将字符串的每个分块写入流
        return defaultWriter.write(chunk);
      })
      .catch(err => {
        console.log("Chunk error:", err);
      });
  });
  //   关闭之前确保所有数据块都被写入
  defaultWriter.ready
    .then(() => {
      // 关闭写入流
      defaultWriter.close();
      // 终止流
      // defaultWriter.abort();
    })
    .catch(err => {
      console.log("Stream error:", err);
    });
}
```

## 链式管道传输

Streams API 使用链式管道（pipe chain）的结构将流传输到另一个流已经成为可能。有两种方法可以作用于它：

- ReadableStream.pipeThrough()——通过转换流（transform stream）传输流，可能在传输过程中转换流。例如，他可以用于将编码或解码视频帧、压缩或解压缩数据或以其他的方式从一种数据转换成另一种数据。一个转换流由一对流组成：一个读取数据的可读流和一个写入数据的可写流，它们以适当的机制确保新数据一旦写入后即可读取。TransformStream 是转换流的具体实现，但任意具有相同可读流和可写流属性的对象都可以传递给 pipeThrough()。
- ReadableStream.pipeTo()——传输到可写流，并且作为链式管道传输的终点。

链式管道传输的起点称为原始源（original source），终点称为最终接收器（ultimate sink）。
![enie](pipechain.png)

```js
/**
 * @start 在 ReadableStream 构建后，立即被调用一次
 * @pull 会被重复的调用直到填满流的内置队列
 * @cancel 如果应用发出流将被取消的信号，它将被调用
 * @type bytes表示流将是一个字节流
 * @autoAllocateChunkSize 字节流自动分配缓冲区大小
 */
const stream = new ReadableStream(
  {
    start(controller) {},
    pull(controller) {},
    cancel() {},
    type,
    autoAllocateChunkSize,
  },
  {
    highWaterMark: 3,
    size: () => 1,
  }
);

let Interval;
let stream;
fetch("./tortoise.png")
  .then(response => {
    // response.body 是 ReadableStream
    const reader = response.body.getReader();
    // 返回自定义流
    return (stream = new ReadableStream({
      start(controller) {
        Interval = setInterval(function () {
          reader.read().then(({ done, value }) => {
            // 数据读取完毕，不在读取流，关闭和读取自定义流
            if (done) {
              clearInterval(interval);
              controller.close();
              readStream(stream);
              // 读取流的一份拷贝
              readStream(stream.tee());
              return;
            }
            // 将数据块排入自定义流中
            controller.enqueue(value);
          });
        }, 1000);
      },
      pull(controller) {},
      cancel() {
        clearInterval(interval);
      },
    }));
  })
  .then(stream => {
    const image = new Image();
    image.src = URL.createObjectURL(new Response(stream).blob());
  })
  .catch(err => console.error(err));

function readStream(stream) {
  const reader = stream.getReader();
  let result = "";

  reader.read().then(function processText({ done, value }) {
    if (done) {
      console.log("Stream complete");
      reader.cancel();
      return;
    }

    const chunk = value;
    result += chunk;
    // 继续读取可读流
    return reader.read().then(processText);
  });
}
```

## TransformStream

Stream API 的 TransformStream 接口表示链式管道传输（pipe chain）转换流（transform stream）概念的具体实现。

它可以传递给 ReadableStream.pipeThrough() 方法，以便将流数据从一种格式转换成另一种。例如，它可以用于解码（或者编码）视频帧，解压缩数据或者将流从 XML 转换到 JSON。

转换算法可以作为构造函数对象的可选参数提供。如果没有提供，数据在通过管道传输流时，不会被修改。TransformStream 是一个可转移对象。

- `readable` 转换流的 readable 端。
- `writable` 转换流的 writable 端。

一个转换流将其接收的所有分块转换为 Uint8Array。

```js
// TransformStream构造函数配置对象
const transformContent = {
  start() {}, // required.
  async transform(chunk, controller) {
    chunk = await chunk;
    switch (typeof chunk) {
      case "object":
        // 没有数据时，终止转化
        if (chunk === null) controller.terminate();
        else if (ArrayBuffer.isView(chunk))
          // 添加至队列里
          controller.enqueue(
            new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
          );
        else if (
          Array.isArray(chunk) &&
          chunk.every(value => typeof value === "number")
        )
          controller.enqueue(new Uint8Array(chunk));
        else if (
          "function" === typeof chunk.valueOf &&
          chunk.valueOf() !== chunk
        )
          this.transform(chunk.valueOf(), controller); // hack
        else if ("toJSON" in chunk)
          this.transform(JSON.stringify(chunk), controller);
        break;
      case "symbol":
        controller.error("Cannot send a symbol as a chunk part");
        break;
      case "undefined":
        controller.error("Cannot send undefined as a chunk part");
        break;
      default:
        controller.enqueue(this.textencoder.encode(String(chunk)));
        break;
    }
  },
  flush() {
    /* do any destructor work here */
  },
};

const tranformStream = new TransformStream({
  ...transformContent,
  textencoder: new TextEncoder(),
});
```

## 可读字节流

可读流提供了一个一致的接口，用于将数据从某些底层源（如文件或套接字）流式传输到使用者（如读取器、转换流或可写流）。 在正常的可读流中，来自底层源的数据始终通过内部队列传递给使用者。 可读字节流的不同之处在于，如果内部队列为空，则底层源可以直接写入使用者（高效的零拷贝传输）。 它们适用于可能以任意大小且可能非常大的块提供或请求数据的用例，因此避免制作副本可能会提高效率

```js
// type:bytes 创建可读字节流
const ReadableByteStream = new ReadableStream({
  type: "bytes",
  start(controller) {
    // controller.byobRequest 表示使用者的待处理读取请求，该请求将作为来自底层源的零副本传输进行
  },
  pull(controller) {},
  cancel() {},
});

//可读字节流通常使用 ReadableStreamBYOBReader 读取
ReadableStream.getReader({ mode: "byob" });
```
