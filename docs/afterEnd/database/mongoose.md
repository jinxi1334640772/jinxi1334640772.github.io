## 链接数据库

确保提前已经安装好 mongooseDB 数据库，并且服务已经启动成功。

```js
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//链接MongoDB
mongoose.connect("mongodb://localhost/chenjunhua");

//测试是否链接成功
mongoose.connection
  .once("open", () => {
    console.log("数据库链接成功");
  })
  .on("error", error => {
    console.log("链接失败：", error);
  });
```

## 创建数据库

```js
//集合collections 数据模型model
const mongoose = require("mongoose");

//获取规范类
const Schema = mongoose.Schema;

//规范数据格式
const MarioCharSchema = new Schema({
  name: String,
  weight: Number,
});

//创建数据模型(创建表)

const marioChar = mongoose.model("zhangjinxi", MarioCharSchema);

module.exports = marioChar;
```

## 测试数据

```js
// mocha测试库
const mocha = require("mocha");

// assert断言库
const assert = require("assert");

// 引入创建的数据库
const MarioChar = require("./models.js.js");

describe("测试数据库的增删改查功能", () => {
  it("添加数据", () => {
    let addData = new MarioChar({
      name: "chenjunhua",
      weight: 22,
    });
    addData.save().then(result => {
      console.log(result, "result");
    });
  });
  it("删除数据", () => {
    MarioChar.findOneAndRemove({ name: "zhangjinxi" }).then(result => {
      console.log(result, "result");
    });
  });

  it("查看数据", () => {
    MarioChar.find({ name: "chenjunhua" }).then(result => {
      console.log(result, "result");
    });
  });

  it("更改数据", () => {
    MarioChar.findOneAndUpdate({ name: "chenjunhua" }, { name: "陈军华" }).then(
      result => {
        console.log(result, "result");
      }
    );
  });
});

//测试时对当前测试的一个描述
describe("my mocha test", () => {
  //创建需要测试的任务
  it("测试两个数值是否相等", () => {
    let char = new MarioChar({
      name: "丁雅静",
      weight: 22,
    });

    //存储数据
    char.save().then(result => {
      console.log(result.name);

      // 断言是否相等，例如： assert(2 + 3 == 5);
      assert(result.isNew === false);
    });
  });
});
describe("查找数据", () => {
  it("finding data", done => {
    MarioChar.findOne({ name: "zhangjinxi" }).then(result => {
      console.log(result.name);
      done();
    });
  });

  it("deleting data form db", () => {
    MarioChar.findOneAndRemove({ name: "zhangjinxi" }).then(result => {
      assert(result.name == "zhangjinxi");
    });
  });
});
```
