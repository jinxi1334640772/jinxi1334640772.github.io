```js
let fs = require("fs"); //文件系统
let zlib = require("zlib"); //文件压缩模块

let readStream = fs.createReadStream("../pages/test.txt"); //创建读取流

readStream.setEncoding("utf8"); //读取格式

let total = "";
readStream.on("data", data => {
  //data事件，当读取到数据的时候触发
  total += data;
});

readStream.on("end", () => {
  //读取文件结尾的时候触发
  console.log(total, "total");
});

readStream.on("error", error => {
  //错误处理
  console.log(error.stack);
});

let writeStream = fs.createWriteStream("../pages/text.txt.gz"); //创建写入流

writeStream.write("我是写入流，hehe", "utf8"); //使用utf-8编码写入数据

writeStream.end(); //标记文档结尾

writeStream.on("finish", () => {
  //写入完成的时候触发
  console.log("写入已经完成了！");
});

writeStream.on("error", error => {
  //写入错误处理
  console.log(error.stack);
});

readStream.pipe(writeStream); //从读取流写入到写入流

readStream.pipe(zlib.createGzip()).pipe(writeStream); //读取流压缩之后到写入流

let readStreamGz = fs.createReadStream("../pages/text.txt.gz");

let writeStreamGz = fs.createWriteStream("../pages/text.txt");

readStreamGz.pipe(zlib.createGunzip()).pipe(writeStreamGz);
//读取流解压缩之后到写入流
```
