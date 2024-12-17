## Egg 简介

Egg 选择了 Koa 作为其基础框架，在它的模型基础上，对其进行了进一步的增强，用于开发企业级应用。

参考：https://www.eggjs.org/zh-CN/intro/quickstart
```bash
# 推荐直接使用脚手架。可快速生成项目
$ npm init egg --type=simple

# 也可以逐步搭建
$ mkdir egg-example
$ cd egg-example
$ npm init
$ npm i egg --save
$ npm i egg-bin --save-dev

# 添加 npm scripts 到 package.json：
{
  "name": "egg-example",
  "scripts": {
    "dev": "egg-bin dev"
  }
}

# 启用服务器
$ npm run dev
$ open http://localhost:7001
```

## extend 扩展

在基于 Egg 的框架或者应用中，我们可以通过定义 app/extend/{application,context,request,response}.js 来扩展 Koa 中对应的四个对象的原型。通过这个功能，我们可以快速增加更多的辅助方法。举例，我们在 app/extend/context.js 中写入以下代码：

```js
// app/extend/context.js
module.exports = {
  // 给Context添加isIOS属性
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get("user-agent"));
  },
};

// app/extend/helper.js 供模板使用
const moment = require("moment");
exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

// app/controller/home.js 函数式Controller
exports.handler = ctx => {
  // 在Context上使用定义的isIOS属性
  ctx.body = ctx.isIOS
    ? "Your operating system is iOS."
    : "Your operating system is not iOS.";
};
```

## plugin 插件

Egg 提供了强大的插件机制，让这些独立领域的功能模块更易于编写。如引入 koa-session 提供 Session 支持，引入 koa-bodyparser 解析请求体。一个插件可以包含：

- extend：扩展基础对象的上下文，提供工具类、属性等。
- middleware：加入一个或多个中间件，提供请求的前置、后置逻辑处理。
- config：配置不同环境下插件的默认配置项。

```js
// 安装模板引擎
npm i egg-view-nunjucks --save

// config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};
```

## Config

支持按环境变量加载不同的配置文件，例如 config.local.js、config.prod.js 等。应用、插件、框架都可以配置自己的配置文件，框架将按顺序合并加载。

```js
// config/config.default.js
exports.keys = <此处改为你自己的 Cookie 安全字符串>;

// 添加 view 配置项
exports.view = {
  // 模板引擎
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};

// 添加 news 的配置项
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
};
```

## Service

在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。

```js
// app/service/news.js
const Service = require("egg").Service;

class NewsService extends Service {
  async list(page = 1) {
    // 读取配置的 serverUrl pageSize
    const { serverUrl, pageSize } = this.config.news;

    // 使用内置的  HttpClient 获取数据
    const { data: idList } = await this.ctx.curl(
      `${serverUrl}/topstories.json`,
      {
        data: {
          orderBy: '"$key"',
          startAt: `"${pageSize * (page - 1)}"`,
          endAt: `"${pageSize * page - 1}"`,
        },
        dataType: "json",
      }
    );

    // 并行获取newsList数据
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: "json" });
      })
    );
    return newsList.map(res => res.data);
  }
}

module.exports = NewsService;
```

## Controller 控制器
用于处理路由请求。
```js
// app/controller/home.js 定义类式Controller
const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = "Hello world";
  }
}
module.exports = HomeController;

// app/controller/news.js
const Controller = require("egg").Controller;
class NewsController extends Controller {
  // 从接口获取数据，并渲染模板引擎
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const newsList = await ctx.service.news.list(page);
    await ctx.render("news/list.tpl", { list: newsList });
  }
  // 本地写死数据，并渲染模板引擎
  async listPre() {
    const dataList = {
      list: [
        { id: 1, title: "This is news 1", url: "/news/1" },
        { id: 2, title: "This is news 2", url: "/news/2" },
      ],
    };
    // 渲染模板引擎
    await this.ctx.render("news/list.tpl", dataList);
  }
}
module.exports = NewsController;
```

## Router
定义Router路由，并使用Controller处理路由
```js
// app/router.js 
module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/news", controller.news.list);
};
```

## 模板渲染

绝大多数情况下，我们都需要读取数据后渲染模板，然后呈现给用户。因此，我们需要引入对应的模板引擎。

框架并不强制你使用某种模板引擎，只是约定了 View 插件开发规范，开发者可以引入不同的插件来实现差异化定制。

为列表页编写模板文件，一般放置在 app/view 目录下：

```html
<!-- app/view/news/list.tpl -->
<!DOCTYPE html>
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" type="text/css" />
  </head>
  <body>
    <ul class="news-view view">
      {% for item in list %}
      <li class="item">
        <a href="{{ item.url }}">{{ item.title }}</a>
        <span>模板引擎里使用helper辅助函数</span>
        <span>{{ helper.relativeTime(item.time) }}</span>
      </li>
      {% endfor %}
    </ul>
  </body>
</html>
```

## Middleware

通过 Middleware 判断 User-Agent ，禁止百度爬虫访问。

```js
// app/middleware/robot.js
// options === app.config.robot
module.exports = (options, app) => {
  return async function robotMiddleware(ctx, next) {
    const source = ctx.get("user-agent") || "";
    const match = options.ua.some(ua => ua.test(source));
    if (match) {
      ctx.status = 403;
      ctx.message = "Go away, robot.";
    } else {
      await next();
    }
  };
};

// config/config.default.js
// add middleware robot
exports.middleware = ["robot"];
// robot's configurations
exports.robot = {
  ua: [/Baiduspider/i],
};
```

## 单元测试

框架也提供了 egg-bin 来帮开发者无痛地编写测试。测试文件应该放在项目根目录下的 test 目录内，并以 test.js 为后缀名。也就是 {app*root}/test/\**/\_.test.js。

```js
// test/app/middleware/robot.test.js
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/middleware/robot.test.js', () => {
  it('should block robot', () => {
    return app
      .httpRequest()
      .get('/')
      .set('User-Agent', 'Baiduspider')
      .expect(403);
  });
});

// 然后配置依赖和 npm scripts：
{
  "scripts": {
    "test": "egg-bin test",
    "cov": "egg-bin cov"
  }
}
```
