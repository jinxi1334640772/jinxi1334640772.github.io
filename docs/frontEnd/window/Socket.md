## WebSocket 客户端

WebSocket API 是一种先进的技术，可在用户浏览器和服务器之间开启双向交互式通信会话。利用该 API，可以向服务器发送信息，并接收事件驱动的响应，而无需轮询服务器以获得回复。 WebSocket 对象提供了用于创建和管理 WebSocket 连接，以及可以通过该连接发送和接收数据的 API。其属性和方法有：

- `binaryType` 使用二进制的数据类型连接。
- `bufferedAmount` 未发送至服务器的字节数。
- `extensions` 服务器选择的扩展。
- `protocol` 服务器选择的下属协议。
- `readyState` 当前的链接状态。
- `url` WebSocket 的绝对路径。
- `onopen` 用于指定连接成功后的回调函数。
- `onmessage` 当从服务器接受到信息时的回调函数。
- `onerror` 连接失败后的回调函数。
- `onclose` 连接关闭后的回调函数。
- `send(data)` 对要传输的数据进行排队。
- `close([code[,reason]])` 关闭当前链接。

```js
/**创建 WebSocket 对象，将会自动地尝试建立与服务器的连接
 * @url 要连接的 URL；这应当是 WebSocket 服务器会响应的 URL。
 * @protocols 子协议字符串或子协议字符串数组。这样一个服务器就可以实现多个 WebSocket 子协议（比如你可能希望一个服务器可以根据指定的 protocol 来应对不同的互动情况）。如果不指定协议字符串则认为是空字符串。
 * @return WebSocket对象
 */
/**WebSocket代表状态的几个常量
 * WebSocket.CONNECTING	0
  WebSocket.OPEN	1
  WebSocket.CLOSING	2
  WebSocket.CLOSED	3
 */
webSocket = new WebSocket(url, protocols);

// socket默认443端口，这里使用8080端口
var exampleSocket = new WebSocket("ws://www.example.com:8080/socketserver", [
  "protocolOne",
  "protocolTwo",
]);

// 建立连接成功触发open事件
exampleSocket.onopen = function (event) {
  //向webSocket服务器发送消息
  exampleSocket.send("Here's some text that the server is urgently awaiting!");

  var msg = {
    type: "message",
    text: document.getElementById("text").value,
    id: clientID,
    date: Date.now(),
  };

  // 把 msg 对象作为 JSON 格式字符串发送
  exampleSocket.send(JSON.stringify(msg));
};

// 接收到服务端信息时触发message事件
exampleSocket.onmessage = function (event) {
  console.log(event.data);
  var msg = JSON.parse(event.data);
};

if (!exampleSocket.bufferedAmount) {
  // 没有数据传输时，关闭socket连接
  exampleSocket.close();
}
```

## WebSocketStream

WebSocketStream API 是 WebSocket 的基于 Promise 的替代方案，用于创建和使用客户端 WebSocket 连接。 使用 Streams API 来处理消息的接收和发送，这意味着套接字连接可以自动利用流背压（开发人员无需额外操作），调节读取或写入的速度以避免应用程序中的瓶颈。WebSocketStream

```js
// 特性检测
if ("WebSocketStream" in self) {
  const controller = new AbortController();
  // 创建WebSocketStream对象
  const queueWSS = new WebSocketStream("wss://example.com/queue", {
    protocols: ["amqp", "mqtt"],
    signal: controller.signal,
  });

  // 连接成功时opened兑现promise ReadableStream WritableStream
  const { readable, writable, extensions, protocol } = await wss.opened;
  //  ReadableStreamDefaultReader
  const reader = readable.getReader();
  // WritableStreamDefaultWriter
  const writer = writable.getWriter();
  // 将数据写入套接字，传给服务端数据
  writer.write("My message");
  // 循环从套接字读取数据
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    // Process value in some way
  }
  // 连接关闭时，closed兑现promise
  const { code, reason } = await wss.closed;
  // 使用AbortController关闭连接
  controller.abort();
  // 或者使用close方法关闭连接
  wss.close({
    code: 4000,
    reason: "Night draws to a close",
  });
}
```

## WebSocket 服务器

借助第三方包：ws 包，是一个用于支持 WebSocket 客户端和服务器的框架，它易于使用，功能强大，且不依赖于其他环境

```js
const WebSocket = require('ws')
 ​
/** 方法中options对象所支持的参数
 *（1）host：绑定服务器的主机名
  （2）port：绑定服务器的端口号
  （3）backlog：挂起连接队列的最大长度
  （4）server：预先创建的node.js http/s服务器
  （5）verifyClient：可用于验证传入连接的函数
  （6）handleProtocols：可用于处理WebSocket子协议的函数
  （7）path：仅接受与此路径匹配的连接
  （8）noServer：不启用服务器模式
  （9）clientTracking：指定是否跟踪客户端
  （10）perMessageDeflate：启用/禁用消息压缩
  （11）maxPayload：允许的最大消息大小（以字节为单位）
 */
 WebSocket.Server(options[，callback])

 //创建一个WebSocket服务器，在8080端口启动
 const server = new WebSocket.Server({port:8080})
 ​
 server.on('open',function open(){
     console.log('connected')
 })
 ​
 server.on('close',function close(){
     console.log('disconnected')
 })
 ​
 server.on('connection',function connection(ws,req){
     const ip = req.socket.remoteAddress
     const port = req.socket.remotePort
     const clientName = ip + port
 ​
     console.log('%s is connected ',clientName)
 ​    /**
        send(data [,options][,callback])
       data：发送的数据
       options对象：
         (1)compress：指定数据是否需要压缩。默认为true
         (2)binary：指定数据是否通过二进制传送。默认是自动检测
         (3)mask：指定是否应遮罩数据。
         (4)fin：指定数据是否为消息的最后一个片段。默认为true
      */
     ws.send('Welcome ' + clientName)
 ​
     ws.on('message',function incoming(message){
         /** WebSocket的状态
          1、CONNCETION：值为0，表示连接还没有打开
          2、OPEN：值为1，表示连接已经打开，可以通信了
          3、CLOSING：值为2，表示连接正在关闭
          4、CLOSED：值为2，表示连接已经关闭
          */
         // 获取所有客户端
         server.clients.forEach(function each(client){
             if(client.readyState === WebSocket.OPEN){
                 client.send(clientName +" -> " + message)
             }
         })
     })
 })
```

## WebTransport API

是 WebSockted 的升级版，使用 stream 传输数据，使用 HTTP/3 协议

```js
// 构建WebTransport对象
const transport = new WebTransport("https://example.com:4999/wt");

// 准备就绪，兑现promise
await transport.ready;
// 关闭时兑现promise
await transport.closed;

/** 通过datagrams数据报传输不可靠:
 * “不可靠”意味着不能保证数据传输，也不保证按特定顺序到达。这在某些情况下很好，并且提供非常快速的交付。例如，您可能希望传输常规游戏状态更新，其中每条消息都取代最后到达的消息，并且顺序并不重要。
 */
const writer = transport.datagrams.writable.getWriter();
//使用写入器将数据写入该对象，以便传输到服务器：
writer.write(new Uint8Array([65, 66, 67]));

const reader = transport.datagrams.readable.getReader();
while (true) {
  //从服务器接收数据：
  const { value, done } = await reader.read();
  if (done) {
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}

/** 通过流进行可靠传输:
 * “可靠”意味着数据的传输和顺序得到保证。这提供了较慢的交付速度（尽管比使用 WebSockets 更快），并且在可靠性和顺序很重要的情况下（例如聊天应用程序）是必需的。*/

//单向传输

/**要从用户代理打开单向流，请使用 WebTransport.createUnidirectionalStream（） */
async function writeData() {
  const stream = await transport.createUnidirectionalStream();
  // 获取对 WritableStream 的引用
  const writer = stream.writable.getWriter();
  const data1 = new Uint8Array([65, 66, 67]);
  //将数据写入流并发送到服务器
  writer.write(data1);

  try {
    await writer.close();
    console.log("All data has been sent.");
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}
/**接下来，调用 WebTransport.incomingUnidirectionalStreams 并获取对它返回的可用读取器的引用，然后使用该读取器从服务器读取数据。每个块都是一个WebTransportReceiveStream  */
async function receiveUnidirectional() {
  // 获取ReadableStream的引用
  const readableStream = transport.incomingUnidirectionalStreams;
  const reader = readableStream.getReader();
  while (true) {
    // 从服务器获取分块数据流：WebTransportReceiveStream对象
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // 需要继续从流中读取数据
    await readData(value);
  }
}

async function readData(receiveStream) {
  const reader = receiveStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    console.log("value is a Uint8Array", value);
  }
}

// 双向传输

/**要从用户代理打开双向流，请使用 WebTransport.createBidirectionalStream（） 方法获取对 WebTransportBidirectionalStream 的引用 */
async function setUpBidirectional() {
  // stream is a WebTransportBidirectionalStream
  const stream = await transport.createBidirectionalStream();

  // WebTransportSendStream 发送流对象
  const writable = stream.writable;
  const writer = writable.getWriter();
  writer.write(new Uint8Array([65, 66, 67]));

  // WebTransportReceiveStream接收流对象
  const readable = stream.readable;
  const reader = readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    console.log("value is a Uint8Array", value);
  }
}

/**如果服务器打开一个双向流以将数据传输到客户端并从客户端接收数据，则可以通过 WebTransport.incomingBidirectionalStreams 属性进行访问，该属性返回对象的 ReadableStream。每个 API 都可用于读取和写入 Uint8Array 实例， */
async function receiveBidirectional() {
  const bds = transport.incomingBidirectionalStreams;
  const reader = bds.getReader();
  while (true) {
    // value是WebTransportBidirectionalStream对象
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // 获取WebTransportReceiveStream接收流对象
    readData(value.readable);
    // 获取WebTransportSendStream 发送流对象
    writeData(value.writable);
  }
}
```
