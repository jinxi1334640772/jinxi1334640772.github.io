## HTTP/2

node:http2 模块提供了 HTTP/2 协议的实现，与 http API 相比，http2 核心 API 在客户端和服务器之间更加对称。例如，大多数事件，如 'error'、'connect' 和 'stream'，可以由客户端代码或服务器端代码触发。

生成证书和密钥

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

## 服务端

由于没有已知的浏览器支持 未加密的 HTTP/2，因此在与浏览器客户端通信时必须使用 http2.createSecureServer()。

```js
const http2 = require('node:http2');
const fs = require('node:fs');

/** Http2Server & Http2SecureServer
 *@close([callback])
 @setTimeout([msecs][, callback])
 @timeout
 @updateSettings([settings])
 */
const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  origins: ['https://example.com', 'https://example.org']
});
server.on('checkContinue', () => console.log());
server.on('connection', () => console.log('当建立新的 TCP 流时会触发此事件'));
server.on('request', () => console.log('每次有请求时触发'));
server.on('stream', () => console.log(''));
server.on('timeout', () => console.log());
server.on('error', (err) => console.error(err));
server.on('session', (session) => {
  console.log('当 Http2Server 创建新的 Http2Session 时')
    // 向连接的客户端提交 ALTSVC 帧
   session.altsvc('h2=":8000"', 'https://example.org:80');

   /**向连接的客户端提交 ORIGIN 帧，以通告服务器能够提供权威响应的源集。 */
     session.origin('https://example.com', 'https://example.org');

});

// 当与服务器关联的 Http2Session 触发 'stream' 事件时
server.on('stream', (stream, headers) => {
  /**
   * ServerHttp2Stream 类是 Http2Stream 的扩展，专门用于 HTTP/2 服务器
   * @additionalHeaders(headers) 向连接的 HTTP/2 对等方发送额外的信息性 HEADERS 帧。
   * @pushStream(headers[, options], callback) 启动推送流
   * @headersSent
   * @pushAllowed
   */
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  },{
    endStream:false,  //true 表示响应将不包含有效负载数据
    waitForTrailers:true,//传输完最后的 DATA 帧时，Http2Stream 不会自动关闭
  }
  );
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });

  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  // 启动响应，其数据从给定的文件描述符中读取。
  stream.respondWithFD(fd, headers);


 stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         {  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }, onError(error){} });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

## 客户端

以下说明了 HTTP/2 客户端：

```js
const http2 = require('node:http2');
const fs = require('node:fs');

// Http2Session 类的实例表示 HTTP/2 客户端和服务器之间的活动通信会话
/** http2session 属性
 * @alpnProtocal 返回已连接的 TLSSocket 自己的 alpnProtocol 属性的值
 * @closed
 * @connecting
 * @destroyed
 * @encrypted TLSSocket 连接则为true
 * @localSettings 当前本地设置的无原型对象
 * @remoteSettings 当前远程设置的无原型对象
 * @originSet 连接到 TLSSocket，则 originSet 属性将返回 Array 的起源
 * @pendingSettingsAck 是否正在等待已发送的 SETTINGS 帧的确认
 * @socket 返回 Proxy 对象，它充当 net.Socket（或 tls.TLSSocket）
 * @state 提供有关 Http2Session 当前状态的其他信息。
 * @type 是客户端还是服务器
 * @destroyed
 * @settings([settings][, callback]) 更新此 Http2Session 的当前本地设置
 * @close([callback])
 * @destroy([error][, code]) 立即终止关联的 net.Socket 或 tls.TLSSocket。
 * @goaway([code[, lastStreamID[, opaqueData]]]) 将 GOAWAY 帧传输到连接的对等方
 * @ping([payload, ]callback) 向连接的 HTTP/2 对等方发送 PING 帧
 * @ref() 底层 net.Socket 上调用 ref()。
 * @unref() 底层 net.Socket 上调用 unref()。
 */
const session = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});

session.on('close', () => console.log("'close' 事件在 Http2Session 被销毁后触发。其监听器不需要任何参数。"));
session.on('connect', () => console.log('成功连接到远程对等方并且通信可以开始'));
session.on('frameError', () => console.log('在会话上发送帧时发生错误时'));
session.on('goaway', () => console.log('接收到 GOAWAY 帧时触发 'goaway' 事件。'));
session.settings({ enablePush: false });
session.on('localSettings', () => console.log('当接收到确认 SETTINGS 帧时触发 'localSettings' 事件。'));
session.on('ping', () => console.log('每当从连接的对等方接收到 PING 帧时'));
session.on('remoteSettings', (settings) => console.log('当从连接的对等方接收到新的 SETTINGS 帧时'));

  // 创建新的 Http2Stream 时会触发
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});

session.setTimeout(2000,callback(){});
session.on('timeout', () => { /* .. */ });

session.on('error', (err) => console.error('在处理 Http2Session 期间发生错误时触发',err));


const http2 = require('node:http2');
const server = http2.createServer();
server.on('session', (session) => {

  // 设置本地端点的窗口大小。windowSize 是要设置的总窗口大小，而不是增量
  session.setLocalWindowSize(2 ** 20);
});

session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});

/**
 * ClientHttp2Session属性和方法
 */

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt,'每当客户端接收到 ALTSVC 帧时');
  console.log(origin);
  console.log(streamId);
});

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n],'每当客户端接收到 ORIGIN 帧时');
});


/** Http2Stream:代表一个通过 Http2Session 实例的双向 HTTP/2 通信流
 * Http2Stream 类是 ServerHttp2Stream 和 ClientHttp2Stream 类的基础，
 * 每个类分别由服务器端或客户端专门使用
 * @aborted
 * @bufferSize
 * @closed
 * @destroyed
 * @endAfterHeaders
 * @id
 * @pending
 * @rstCode
 * @sentHeaders 包含为此 Http2Stream 发送的出站标头的对象。
 * @sentInfoHeaders
 * @sentTrailers 为此 HttpStream 发送的出站尾随标头的对象。
 * @session 对拥有此 Http2Stream 的 Http2Session 实例的引用
 * @state
 * @sentInfoHeaders
 * @sentInfoHeaders
 * @sentInfoHeaders
 * @close(code[, callback])
 * @priority(options) 更新此 Http2Stream 实例的优先级。
 * @setTimeout(msecs, callback)
 * @sendTrailers(headers) 向连接的 HTTP/2 对等端发送尾随的 HEADERS 帧
 */

req.on('abort', () => { console.log(' Http2Stream 被销毁时触发')});
req.on('error', () => { console.log(' 处理 Http2Stream 期间发生错误时触发。')});
req.on('frameError', () => { console.log(' 发送帧时发生错误')});
req.on('ready', () => { console.log(' Http2Stream 已打开、已分配 id 且可以使用时触发。监听器不需要任何参数。')});
req.on('timeout', () => { console.log(' 设置的毫秒数内没有收到此 Http2Stream 的活动后')});
req.on('trailers', () => { console.log(' 当接收到与尾随标头字段关联的标头块')});
req.on('wantTrailers', () => { console.log('已将要在帧上发送的最后 DATA 帧排队')});

/**
 * ClientHttp2Stream属性和方法
 */
const req = session.request({ ':path': '/' },{
  endStream:true,
  exclusive:false,
  parent:1,
  weight:12,
  waitForTrailers:true,
  // signal:abortSignal.signal
});
req.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('continue', () => { console.log('当服务器发送 100 Continue 状态时触发')});
req.on('headers', (headers,flags) => { console.log('当接收到流的附加标头块时')});
req.on('push', (headers,flags) => { console.log('当接收到服务器推送流的响应头时')});
req.on('continue', () => { console.log('当服务器发送 100 Continue 状态时触发')});
req.on('continue', () => { console.log('当服务器发送 100 Continue 状态时触发')});
req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
    console.log('收到此流的响应 HEADERS 帧时')
  }
});
req.on('end', () => {
  console.log(`\n${data}`);
  session.close();
});
req.end();
```
