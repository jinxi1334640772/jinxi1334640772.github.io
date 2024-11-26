## express

```js
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const app = require("express")();
const moment = require("moment");
const path = require("path");

// Live Reload configuration
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => liveReloadServer.refresh("/"), 100);
});
// Fontend route
const FrontRouter = require("./routes/front");
// Set ejs template engine
app.set("view engine", "ejs");
app.use(connectLiveReload());
app.use(bodyParse.urlencoded({ extended: false }));
app.locals.moment = moment;
// Database connection
mongoose
  .connect("mongodb://todo-database:27017/", { useNewUrlParser: true })
  .then(() => console.log(`Mongodb Connected`))
  .catch(error => console.log(error));

app.use(FrontRouter);
//匹配路由
server.use("/detail", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "static", "list.html"));
});

//静态目录，默认页面index.html
server.use(express.static(path.join(__dirname, "static")));

//错误页面
server.use("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "static", "404.html"));
});
app.locals.moment = moment;
// Database connection
mongoose
  .connect("mongodb://todo-database:27017/", { useNewUrlParser: true })
  .then(() => console.log(`Mongodb Connected`))
  .catch(error => console.log(error));
// 监听3000端口
server.listen(3000, err => {
  if (err) {
    console.log("监听失败");
    throw err;
  }
  console.log("服务器已经启动，在3000端口");
});
```
