```js
let fs = require("fs");
const http = require("node:http");
const net = require("node:net");
const { URL } = require("node:url");

//把route函数当作参数传给server，就可以处理server接受到的request的url参数。
// 从而根据路由做出响应
function route(url) {
  console.log("你请求的地址是：" + url);
}

/**
 * @listening
 * @maxHeadersCount
 * @requestTimeout
 * @itemout
 * @keepAliveTimeout number
 */
const proxy = http.createServer((req, response) => {
  route(req.url);
  let url =
    req.url == "/" ? "../../../public/index.html" : "../pages" + req.url;
  if (fs.existsSync(url)) {
    let data = fs.readFileSync(url);
    response.write(data);
  } else {
    let data = fs.readFileSync("../pages/404.html");
    response.write(data);
  }

  /** response
   * @flushHeaders() 刷新响应头
   * @getHeader(name)
   * @hasHeader(name)
   * @setHeader(key,name)
   * @removeHeader(name)
   * @setTimeout(msecs[, callback])
   * @write(chunk[, encoding][, callback]) 发送一块响应正文。可以多次调用此方法以提供正文的连续部分。
   * @req 对原始的 HTTP request 对象的引用。
   * @sendDate
   * @socket
   * @statusCode
   * @statusMessage
   * @strictContentLength
   *
   */
  response.setHeader("Content-Type", "text/html");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
  const contentType = response.getHeader("content-type");
  // contentType is 'text/html'
  const contentLength = response.getHeader("Content-Length");
  // contentLength is of type number
  const setCookie = response.getHeader("set-cookie");
  // setCookie is of type string[]
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay", "utf-8", () => {
    console.log("标明已发送所有的响应头和正文。必须在每个响应上调用");
  });
});

proxy.on("request", (res, response) => {
  console.log("每次有请求时触发。每个连接可能有多个请求");
});

//当建立新的 TCP 流时会触发此事件。socket 通常是 net.Socket 类型的对象
proxy.on("connect", (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write(
      "HTTP/1.1 200 Connection Established\r\n" +
        "Proxy-agent: Node.js-Proxy\r\n" +
        "\r\n"
    );
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, "127.0.0.1", error => {
  if (error) {
    console.log(error, "error");
    throw error;
  }
  console.log("服务器已经在8080端口启动成功！");

  /** req
   * @protocol
   * @host
   * @method
   * @path
   * @maxHeadersCount
   * @reusedSocket
   * @socket
   */
  const req = http.request({
    port: 1337,
    host: "127.0.0.1",
    method: "CONNECT",
    path: "www.google.com:80",
  });

  req.setHeader("content-type", "text/html");
  req.setHeader("Content-Length", Buffer.byteLength(body));
  req.setHeader("Cookie", ["type=ninja", "language=javascript"]);
  const contentType = req.getHeader("Content-Type");
  // 'contentType' is 'text/html'
  const contentLength = req.getHeader("Content-Length");
  // 'contentLength' is of type number
  const cookie = req.getHeader("Cookie");
  // 'cookie' is of type string[]
  req.removeHeader("Cookie");

  const hasContentType = req.hasHeader("content-type");

  req.end();

  req.on("connect", (res, socket, head) => {
    console.log("got connected!");

    // Make a request over an HTTP tunnel
    socket.write(
      "GET / HTTP/1.1\r\n" +
        "Host: www.google.com:80\r\n" +
        "Connection: close\r\n" +
        "\r\n"
    );
    socket.on("data", chunk => {
      console.log(chunk.toString());
    });
    socket.on("end", () => {
      proxy.close();
    });
  });
});

// 关闭连接
server.close(() => {
  console.log("server on port 8000 closed successfully");
});
```
