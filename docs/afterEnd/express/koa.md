## koa 简介

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。Koa 和 Express 的设计风格十分相似，底层也都是共用同一套 HTTP 基础库。区别有:

- 默认异步解决方案:利用 async 函数，丢弃回调函数，增强错误处理。
- Middleware:Koa 选择了洋葱圈模型,每个请求在经过一个中间件时都会执行两次，方便地实现后置处理逻辑
- 新增 Context:与 Express 只有 Request 和 Response 两个对象不同，Koa 增加了一个 Context 对象，作为该次请求的上下文对象
- 异常处理:通过同步方式编写异步代码，使异常处理变得非常自然。可以使用 try catch 来捕获规范编写代码中的所有错误，从而非常容易地编写自定义的错误处理中间件

Koa 应用程序：app 对象，是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。 包括诸如内容协商，缓存清理，代理支持和重定向等常见任务的方法。 尽管提供了相当多的有用的方法 Koa 仍保持了一个很小的体积，因为没有捆绑中间件。

## 使用 Koa

```js
// 引入koa依赖包
const Koa = require('koa');
// 用于获取请求体: ctx.request.body
const bodyParser = require("koa-bodyparser");
// 引入koa路由插件
var Router = require('koa-router');
// 实例化路由器
var router = new Router()
// 设置路径中公共的部分：前缀
router.prefix('/users')
// 给koa-router对象添加路由和对应的处理函数:get|post|put|del|all
router.get('/users/:id?name=jinxi', (ctx, next) => {
  // 后面会把这个函数注册成中间件，所以这里放心使用ctx和next
  // ctx.router available
  console.log('ctx.params:{id:123}',ctx.query,"{name:jinxi}")
  ctx.body='返回指定id用户给客户端'
});

// 配置实例选项，也可以直接在app上设置
const koaOptions={
  // 默认是 NODE_ENV 或 "development"
  env:'development',
  // 签名的 cookie 密钥数组
  keys:[],
  // 当真正的代理头字段将被信任时
  proxy:true,
  // 代理 ip 消息头, 默认为 X-Forwarded-For
  proxyIpHeader:'X-Forwarded-For',
  // 从代理 ip 消息头读取的最大 ips, 默认为 0 (代表无限)
  maxIpsCount:0,
}

// 初始化服务端应用程序
const app = new Koa();

//将koa-router对象的所有路由和处理函数注册成为中间件
//allowedMethods用于处理HTTP请求中不被当前路由支持的方法，作为后备
app.use(router.routes()).use(router.allowedMethods());

app.use(bodyParser())

// 实用和定义中间件
app.use(async (ctx, next) => {
  // app.context === ctx 以下访问器和 ctx 别名等效：
  ctx.request:{
    header,//请求头对象。
    headers,//请求头对象
    method,
    url,
    origin,//获取URL的来源，包括 protocol 和 host。
    originUrl,//获取请求原始URL。
    href,
    path,
    query,//获取解析的查询字符串, 当没有查询字符串时，返回一个空对象
    querystring,//根据 ? 获取原始查询字符串.
    host,
    hostname,
    fresh,//检查请求缓存是否“新鲜”，也就是内容没有改变
    protocol,
    secure,
    socket,//返回请求套接字。
    ip,
    ips,//当 X-Forwarded-For 存在并且 app.proxy 被启用时
    subdomains//以数组形式返回子域。
    stale,//与 request.fresh 相反.

    // request 独有属性
    search,//使用 ? 获取原始查询字符串
    length,//返回请求的 Content-Length，或 undefined。
    type,//获取请求 Content-Type, 不含 "charset" 等参数。
    charset,//存在时获取请求字符集
    idempotent,//检查请求是否是幂等的。
    is(types...),//检查传入请求是否包含 Content-Type 消息头字段， 并且包含任意的 mime type。

    // 内容协商实用函数
    accepts(types),//检查给定的 type(s) 是否可以接受
    acceptsEncodings(encodings),
    acceptsCharsets(charsets),
    acceptsLanguages(langs),
    get(field)//返回请求头(header), field 不区分大小写.
  }

  // 以下访问器和 ctx 别名等效：
  ctx.response:{
    body,//获取|设置响应主体。string|Buffer|Stream|Object|Array
    status,
    message,
    length,
    type,//获取响应 Content-Type, 不含 "charset" 等参数。
    //检查是否已经发送了一个响应头。 用于查看客户端是否可能会收到错误通知。
    headerSent,
    lastModified,
    etag,

    // response 独有的
    socket,//响应套接字。作为 request.socket 指向 net.Socket 实例。
    vary(field),//设置 field 的 vary。
    get(field),//不区分大小写获取响应头字段值 field。
    is(types...),//检查响应类型是否是所提供的类型之一
    flushHeaders(),//刷新任何设置的消息头，然后是主体(body)。

    redirect(url, [alt]),//执行 [302] 重定向到 url.
    //将 Content-Disposition 设置为 “附件” 以指示客户端提示下载
    attachment([filename], [options]),
    set(field, value),//设置响应头 field 到 value，也可{}
    has(field),
    append(field, value),
    remove(field),//删除消息头 field。
  }

  ctx.cookies:{
    get(name,{
      domain,
      path,
      maxAge,
      expires,
      secure:true,
      httpOnly:true,
      sameSite:'strict'|'lax'|'none',
      signed:false,//是否对cookie进行签名
      overwrite:false//是否覆盖以前设置的同名的 cookie
    }),
    set(name,value,[options])
  }
  // 推荐的命名空间，用于通过中间件传递信息和你的前端视图
  ctx.state.use = await User.find(id);
  // 向客户端抛出错误
  ctx.thorw([status],[msg],[properties])
  // 当 !value 时抛出一个类似 .throw 错误的帮助方法。这与 node 的 assert() 方法类似
  ctx.assert(value, [status], [msg], [properties])

  await next();

  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  ctx.is('text/*', 'text/html'); // => 'text/html'
  ctx.accepts(['html', 'json']);
  ctx.set('Cache-Control', 'no-cache');
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});
// http.createServer(app.callback()).listen(3000);语法糖
app.listen(3000);

app.on('error', (err,ctx) => {
  log.error('server error', err)
});
```
