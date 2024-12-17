## Express 简介

快速、独立、极简的 Node.js Web 框架。

- Web 应用：Express 是一个极简且灵活的 Node.js Web 应用框架，它为 Web 和移动应用提供了一组强大的功能。

- API：有了无数的 HTTP 实用方法和中间件供您使用，创建强大的 API 变得快速而简单。

- 性能：Express 提供了一层薄薄的基本 Web 应用功能，而不会掩盖您熟悉和喜爱的 Node.js 功能。

- 中间件：Express 是一个轻量级且灵活的路由框架，具有最少的核心功能，可以通过使用 Express 中间件 模块进行增强。

参考：https://www.expressjs.com.cn/guide/routing.html

## 安装

```bash
npm install express
# 临时安装 Express，不想将它添加到依赖列表中
npm install express --no-save

# 可以使用express-generator快速生成Express应用
npm install -g express-generator
# 快速生成应用骨架，视图引擎将设置为 Pug
express --view=pug myapp
```

骨架文件目录：

```
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views       模板目录
    ├── error.pug
    ├── index.jade
    └── layout.ejs
```

## 使用 Express

```js
// 用于连接 mongooseDB 数据库
const mongoose = require("mongoose");
// 连接mongooseDB数据库
mongoose
  .connect("mongodb://todo-database:27017/", { useNewUrlParser: true })
  .then(() => console.log(`Mongodb Connected`))
  .catch(error => console.log(error));

// 从req.body中解析参数：内部使用JSON编码处理，url编码处理以及对于文件的上传处理
const bodyParse = require("body-parser");
// req.cookies
var cookieParser = require("cookie-parser");
// 保存登录信息。 当客户访问其他页面时，可以判断客户的登录状态
var session = require("express-session");
// 保存文件时自动刷新页面
const livereload = require("livereload");
// 连接livereload
const connectLiveReload = require("connect-livereload");
// 生成app
const app = require("express")();
// moment时间日期格式化包
const moment = require("moment");
const path = require("path");

// mysql 数据库的使用
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "dbuser",
  password: "s3kreee7",
});
connection.connect();
connection.query("SELECT 1 + 1 AS solution", function (err, rows, fields) {
  if (err) throw err;
  console.log("The solution is: ", rows[0].solution);
});
connection.end();

// 定义路由器
const router = express.Router();

// 定义mongooseDB 数据库
const Todo = mongoose.model(
  "todos",
  new mongoose.Schema({
    // 定义数据库Schema
    task: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  })
);
// 定义首页路由 匹配get方法
router.get("/", async (req, res) => {
  res.download(); //提示下载文件。
  res.end(); //终结响应处理流程。
  res.json(); //发送一个 JSON 格式的响应。
  res.jsonp(); //发送一个支持 JSONP 的 JSON 格式的响应。
  res.redirect(); //重定向请求。
  res.render(); //渲染视图模板。
  res.send(); //发送各种类型的响应。
  res.sendFile(); //以八位字节流的形式发送文件。
  //设置响应状态代码，并将其以字符串形式作为响应体的一部分发送
  res.sendStatus();

  // mongooseDB 查找数据
  const todos = await Todo.find();
  // 使用渲染引擎，渲染todos模板，并传递变量给模板
  res.render("todos", {
    tasks: Object.keys(todos).length > 0 ? todos : {},
  });
});

// 定义首页路由 匹配post方法
router.post("/", (req, res, next) => {
  const newTask = new Todo({ task: req.body.task });
  newTask
    .save()
    .then(task => res.redirect("/"))
    .catch(err => console.log(err));
  // 交给下一个中间件处理
  next();
});

// 使用动态路由参数，重定向到首页
router.post("/todo/:todoId", async (req, res) => {
  const taskKey = req.body._key;
  // 查找并删除指定_id的数据
  const err = await Todo.findOneAndRemove({ _id: taskKey });
  res.redirect("/");
});

// liveReloadServer服务器实例
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => liveReloadServer.refresh("/"), 100);
});

// 设置ejs&jade&pug模板引擎
app.set("view engine", "ejs");
app.set("view engine", "jade");
app.set("view engine", "pug");

// 设置模板文件的目录，默认 views
app.set("views", "./views");

// 使用中间件
app.use(router);
app.use(connectLiveReload());
app.use(bodyParse.urlencoded({ extended: false }));
// 注册全局变量
app.locals.moment = moment;


//匹配路由/detail 返回list.html 文件，状态码设置200
server.use("/detail", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "static", "list.html"));
});

//express.static 内置中间件函数设置静态目录，默认页面index.html
server.use(express.static(path.join(__dirname, "static")));

//没有匹配到路由，返回错误页面给前端
server.use("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "static", "404.html"));
});

// 监听3000端口，启动服务器
server.listen(3000, err => {
  if (err) {
    console.log("监听失败");
    throw err;
  }
  console.log("服务器已经启动，在3000端口");
});
```
