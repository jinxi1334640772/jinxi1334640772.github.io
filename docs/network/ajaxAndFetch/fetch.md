# Fetch

>Fetch API 提供了一个获取资源的接口（包括跨网络通信）。对于任何使用过 XMLHttpRequest 的人都能轻松上手，而且新的 API 提供了更强大和灵活的功能集。

## 基本概念和用法
发送请求或者获取资源，请使用 fetch() 方法。它在很多接口中都被实现了，更具体地说，是在 Window 和 WorkerGlobalScope 接口上。因此在几乎所有环境中都可以用这个方法获取资源。

fetch() 强制接受一个参数，即要获取的资源的路径。它返回一个 Promise，该 Promise 会在服务器使用标头响应后，兑现为该请求的 Response——即使服务器的响应是 HTTP 错误状态。你也可以传一个可选的第二个参数 init配置对象。

从 fetch() 返回的 Promise 不会因 HTTP 的错误状态而被拒绝，即使响应是 HTTP 404 或 500。相反，它将正常兑现（ok 状态会被设置为 false），并且只有在网络故障或者有任何阻止请求完成时，才拒绝。除非你在 init 对象中设置（去包含）credentials，否则 fetch() 将不会发送跨源 cookie。

要中止未完成的 fetch()，甚至 XMLHttpRequest 操作，请使用 AbortController 和 AbortSignal 接口。

```js
// 停止fetch 信号 signal.signal = AbortSignal对象
const signal = new AbortController()
// fetch兼容性检测
if (window.fetch) {
  fetch("http://example.com/movies.json",{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin,navigate,websocket
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include:即使跨域也会携带Cookie,此时响应的 Access-Control-Allow-Origin 不能使用通配符 "*" *same-origin, omit：省略的意思，浏览器不在请求中包含凭据
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 上传文件时，不设Content-Type，借助FormData对象
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({name:'zhangjinxi'}), // body data type must match "Content-Type" header
    referrer:'baidu.com',
    signal:signal, // signal.abort() 可以停止fetch请求

  })
  .then((response) => response.json())
  .then((data) => console.log(data));
} else {
  // do something with XMLHttpRequest?
}
```

## Fetch相关接口

|对象|描述|
|----|----|
|fetch()|包含了 fetch() 方法，用于获取资源|
|Headers|表示响应/请求的标头信息，允许你查询它们，或者针对不同的结果做不同的操作。|
|Request|相当于一个资源请求对象|
|Response|相当于请求的响应对象|

## 逐行处理文本文件

从响应中读取的分块不是按行分割的，并且是 Uint8Array 数组类型（不是字符串类型）。如果你想通过 fetch() 获取一个文本文件并逐行处理它，那需要自行处理这些复杂情况。以下示例展示了一种创建行迭代器来处理的方法（简单起见，假设文本是 UTF-8 编码的，且不处理 fetch() 的错误）。

```js
// generate生成器函数，返回值为迭代器，每读到一部分数据，通过yield返回，然后通过迭代拿到yield的数据，每次迭代一行数据。
async function* makeTextFileLineIterator(fileURL) {
  // TextDecoder 解码为字符串
  const utf8Decoder = new TextDecoder("utf-8");
  // 获取文件
  const response = await fetch(fileURL);
  // file文件响应的body，为readableStream类型，可读流。是个迭代器，通过read（）方法，每次读取一部分数据。
  const reader = response.body.getReader();
  // 读取可读流已经加载到的内容
  let { value: chunk, done: readerDone } = await reader.read();
  // 对加载到的数据，解码为字符串
  chunk = chunk ? utf8Decoder.decode(chunk) : "";
  // 全局多行匹配换行符 \n \r，把数据根据换行符，分隔到数组result中
  const re = /\n|\r|\r\n/gm;
  // 总的数据中，开始截取数据的位置index
  let startIndex = 0;
  // 每次匹配换行符的结果，通过lastIndex，记录上次匹配字符的位置
  let result;
  // for循环进行持续的读取可读流加载的数据
  for (;;) {
    // 返回数组或者null。chunk:解析为字符串后，数组的总和。通过re.lastIndex，每次匹配chunk字符串中，lastIndex后面的一部分数据
    let result = re.exec(chunk);
    // 没有读取到换行
    if (!result) {
      // 读取数据完毕则结束循环
      if (readerDone) {
        break;
      }
      // 拷贝上次已经读取的数据
      let remainder = chunk.substr(startIndex);
      // 继续读取数据
      ({ value: chunk, done: readerDone } = await reader.read());
      // 已经读取的数据 + 新读取的数据进行解码
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
      // 重置index，从头开始继续匹配
      startIndex = re.lastIndex = 0;
      // 此时还不够一行，不迭代数据。循环判断是否满足一行
      continue;
    }
    // 存在换行，通过迭代器返回这一行的数据
    yield chunk.substring(startIndex, result.index);
    // 重置startIndex为上次读取结束的位置
    startIndex = re.lastIndex;
  }
  // 读取结束后，如果startIndex小于数组总长度，返回剩余不足一行的部分数据
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}

async function run() {
  // 通过forOf进行迭代，拿到每次yeild的数据
  for await (let line of makeTextFileLineIterator(urlOfFile)) {
    processLine(line);
  }
}
run();

```

## 检测请求是否成功

>如果遇到网络故障或服务端的 CORS 配置错误时，fetch() promise 将会 reject，带上一个 TypeError 对象。虽然这个情况经常是遇到了权限问题或类似问题。比如 404 不是一个网络故障。想要精确的判断 fetch() 是否成功，需要包含 promise resolved 的情况，此时再判断 Response.ok 是否为 true。类似以下代码：
```js

fetch("flowers.jpg")
  .then((response) => {
    // 4xx 和 5xx 错误，仍然会进入resolved成功回调里。在这里，需要进一步判断response.ok，是否成功响应数据。
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.blob();
  })
  .then((myBlob) => {
    // 成功响应数据
    myImage.src = URL.createObjectURL(myBlob);
  })
  .catch((error) => {
    // 网络错误、请求被取消。经过第一个then函数resolved回调里，throw 错误 4xx和5xx才会进入这里
    console.error("There has been a problem with your fetch operation:", error);
  });
```

## 自定义Request请求对象 & Headers请求头对象

> 除了传给 fetch() 一个资源的地址，你还可以通过使用 Request() 构造函数来创建一个 request 对象，更多是作为其他 API 操作结果返回的 Request 对象，比如 service worker 的 FetchEvent.request。可作为参数传给 fetch()：

request对象的实例属性和方法

|属性和方法|描述|
|-----|-----|
|body|主题内容的ReadableStream对象|
|bodyUsed|请求是否被读取过|
|cache|包含请求的缓存模式，default,reload,no-cache|
|credentials|包含请求的凭据same-origin,include,omit|
|headers|请求相关联的headers对象|
|method|请求方式|
|mode|请求模式，cors,no-cors,some-origin,navigate|
|signal|返回与请求相关的AbortSignal|
|url|请求的url|
|arrayBuffer()|返回promise，resolved时，值为ArrayBuffer类型|
|blob()|返回promise，resolved时，值为blob类型|
|clone()|返回一个当前Request对象的副本|
|formData()|返回promise，resolved时，值为FromData类型|
|json()|返回promise，resolved时，值为json类型|
|text()|返回promise，resolved时，值为文本类型|

>Request() 和 fetch() 接受同样的参数。你甚至可以传入一个已存在的 request 对象来创造一个拷贝：
```js
// 构造Headers对象，用来更改Request对象headers请求头信息,Request和Response对象上都有Headers对象属性，可以拿到头部信息。具有guard守卫属性，web中不可用，配置是否可被更改。
// Headers对象api很像FormData对象 get set has delete append keys values entries forEach，具有iterate迭代器接口，可使用forOf遍历属性。传入不符合规定的头部会报错
const content = "Hello World";
const myHeaders = new Headers({
  "Content-Type": "text/plain",
  "Content-Length": content.length.toString(),
  "X-Custom-Header": "ProcessThisImmediately",
});
// 等同于如下：
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Content-Length", content.length.toString());
myHeaders.append("X-Custom-Header", "ProcessThisImmediately");

console.log(myHeaders.has("Content-Type")); // true
// set为设置，如果有同名属性未被覆盖，没有同名属性为新增
myHeaders.set("Content-Type", "text/html");
// append为追加，即使有同名属性也会添加，没有同名属性为新增
myHeaders.append("X-Custom-Header", "AnotherValue");

console.log(myHeaders.get("Content-Length")); // 11
console.log(myHeaders.get("X-Custom-Header")); // ['ProcessThisImmediately', 'AnotherValue']

myHeaders.delete("X-Custom-Header");
console.log(myHeaders.get("X-Custom-Header")); // null

const formData = new FormData(document.getElementById("login-form"));
formData.append('name','hello world')

// 构造Request对象：参数为url init配置对象
const myRequest = new Request("flowers.jpg", {
  method: "GET",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
  body:formData
});

fetch(myRequest)
  .then((response) =>{
    // 检查头部字段是否正确
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    return response.blob()
  })
  .then((myBlob) => {
    myImage.src = URL.createObjectURL(myBlob);
  });

// Request() 和 fetch() 接受同样的参数。你甚至可以传入一个已存在的 request 对象来创造一个拷贝：
const anotherRequest = new Request(myRequest, myInit);


```
这个很有用，因为 request 和 response bodies设计成了 stream 的方式，所以它们只能被读取一次。创建一个拷贝就可以再次使用 request/response 了，当然也可以使用不同的 init 参数。创建拷贝必须在读取 body 之前进行，而且读取拷贝的 body 也会将原始请求的 body 标记为已读。

## Response对象

>Response 实例是在 fetch() 处理完 promise 之后返回的。Response最长用到三个属性

|属性名|描述信息|
|------|-----|
|status|整数，为response的HTTP状态码，默认200|
|statusText|字符串，与HTTP状态码相对应，简短解释|
|ok|布尔值，检查response的状态码是否在200-299这个范围内。用来判断是否请求成功|
|headers|Headers对象|
|redirected|是否来自一个重定向，是的话，他的URL列表将会有多个条目|
|type|Response的类型，basic，cors|
|url|URL|
|body|暴露一个ReadableStream类型的body内容|
|bodyUsed|是否被读取过|
|clone()|创建一个Response对象的副本|
|error()|返回一个绑定了网络错误的新的Response对象副本|
|redirect()|用一个url创建一个新的Response对象副本|
|arrayBuffer()|返回一个被解析为 ArrayBuffer 格式的 Promise 对象|
|formData()|返回一个被解析为 FormData 格式的 Promise 对象|
|json()|返回一个被解析为 json 格式的 Promise 对象|
|text()|返回一个被解析为 text 格式的 Promise 对象|


>Response对象也可以通过js创建，但只有在 ServiceWorkers 中使用 respondWith() 方法并提供了一个自定义的 response 来接受 request 时才真正有用：

```js
const myBody = new Blob();
// ServiceWorkers中拦截fetch请求，命中缓存时，可以自定义响应信息
addEventListener("fetch", (event) => {
  // 自定义响应内容和响应头信息
  event.respondWith(
    // Response构造方法接受两个可选参数——response 的 body 和一个初始化对象（与Request() 所接受的 init 参数类似）。
    new Response(myBody, {
      headers: { "Content-Type": "text/plain" },
    }),
  );
});

```
Response静态方法 error() 只是返回了错误的 response。与此类似地，redirect() 只是返回了一个可以重定向至某 URL 的 response。这些也只与 Service Worker 有关。

## Body对象

>不管是请求还是响应都能够包含 body 对象。body 也可以是以下任意类型的实例。
- ArrayBuffer
- ArrayBufferView(Uint8Array等)
- Blob(File对象继承自Blob)
- string
- URLSearchParams
- FormData

Body 类定义了以下方法（这些方法都被 Request 和 Response所实现）以获取 body 内容。这些方法都会返回一个被解析后的 Promise 对象和数据。

- arrayBuffer()
- blob()
- formData()
- json()
- text()

相比于 XHR，这些方法让非文本化数据的使用更加简单。
>request 和 response（包括 fetch() 方法）都会试着自动设置 Content-Type。如果没有设置 Content-Type 值，发送的请求也会自动设值。