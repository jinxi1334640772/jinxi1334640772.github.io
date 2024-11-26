## mockjs 数据模拟

Mock.js 是一款前端开发中拦截 Ajax 请求再生成随机数据响应的工具.可以用来模拟服务器响应. 优点是非常简单方便, 无侵入性, 基本覆盖常用的接口数据类型.
数据模板格式：

```txt
'name|rule': value

属性名|生成规则: 属性值

```

## mockjs 配置

```js
import Mock from "mockjs";

// 通过函数直接调用
const Random = Mock.Random;
console.log(Random.email()); // 结果: r.quyppn@yit.cv
// 传入字符方式调用
console.log(Mock.mock("@email")); // 结果: s.uorjeqdou@crqfpdypt.gw

// 设置4秒后再响应
Mock.setup({ timeout: 4000 });
// 设置1秒至4秒间响应
Mock.setup({ timeout: "1000-4000" });

//可以自定义扩展,
Random.extend({
  weekday: function (date) {
    var weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return this.pick(weekdays);
  },
  sex: function (date) {
    var sexes = ["男", "女", "中性", "未知"];
    return this.pick(sexes);
  },
});

console.log(Random.weekday()); // 结果: Saturday
console.log(Mock.mock("@weekday")); // 结果: 112Tuesday
console.log(Random.sex()); // 结果: 男
console.log(Mock.mock("@sex")); // 结果: 未知

//Mock.valid(template, data): 校验data是否与模板template匹配
var tempObj = { "user|1-3": [{ name: "@cname", "id|18-28": 88 }] };
var realData = { user: [{ name: "张三", id: 90 }] };
console.log(Mock.valid(tempObj, realData));

// Mock.toJSONSchema(template): 用来把Mock.js风格的数据模板template转换成JSON Schema
var tempObj = { "user|1-3": [{ name: "@cname", "id|18-28": 88 }] };
console.log(Mock.toJSONSchema(tempObj));
```

## 拦截请求

```js
// 引入Mock.js库
const Mock = require("mockjs");

// 模拟数据：对象形式。不传get，匹配任何请求方式
Mock.mock("/api/data", {
  name: "@name", // 随机生成姓名
  "age|1-100": 100, // 随机生成1-100的数字
  color: "@color", // 随机生成颜色
});

// 模拟数据：函数形式
Mock.mock("/api/getNames", "get", function () {
  return Mock.mock({
    "user|1-3": [
      {
        name: "@cname",
        id: 88,
      },
    ],
  });
});

// 拦截Ajax请求，返回模拟数据.重写了XHR.prototype.send方法
Mock.XHR.prototype.send = function () {
  var self = this;
  setTimeout(function () {
    // 模拟处理时间
    var status = self.statusCode;
    try {
      // 解析URL，获取模拟数据的规则
      var url = self.url;
      var response = Mock.mock(url);
      // 设置响应头
      self.setHeader("Content-Type", "application/json");
      // 设置响应状态码
      self.statusCode = 200;
      // 返回模拟数据
      self.responseText = JSON.stringify(response);
      self.dispatchEvent("load");
    } catch (e) {
      self.statusCode = 404;
      self.responseText = JSON.stringify({ error: "Not found" });
      self.dispatchEvent("error");
    }
  }, 200);
};

// 发送一个请求到'/api/data'时，会返回模拟的数据
$.ajax({
  url: "/api/data",
  type: "get",
  dataType: "json",
}).done(function (data, status, xhr) {
  console.log(JSON.stringify(data, null, 4));
});
```

## 数据定义规则

```ts
// 使用mock-server拦截请求，并返回模拟数据
import { MockHandler } from "vite-plugin-mock-server";
import { LoginResult, UserInfo } from "../auth/types";
import Mock from "mockjs";
import http from "http";

// 通用请求返回结果
const resData = {
  code: "200", // 状态码
  data: {}, // 响应数据
};
type Request = {
  body?: any;
  params?: { [key: string]: string };
  query?: { [key: string]: string };
  cookies?: { [key: string]: string };
  session?: any;
};

export default const mocks: MockHandler[] = [
  {
    pattern: "/api/auth/login", // 拦截请求的匹配的url
    method: "get", // 匹配的请求方式
    // 匹配拦截后的回调函数。类似node server的回调
    handle: (Request: Request, res: http.ServerResponse) => {
      const result: LoginResult = {
        accessToken: "accessToken",
      };
      resData.data = result;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(resData));
    },
  },
  {
    pattern: "/api/auth/userInfo",
    handle: (req, res) => {
      res.setHeader("Content-Type", "application/json");
      // 返回mockjs模拟出的数据
      resData.data = Mock.mock({
        "list|3-10": [
          //从数组中取3-10个元素
          {
            "name|1-3": "张进喜", // 后面的字符串，重复1-3次 "张进喜张进喜"
            "age|20-40": 0, // 20-40之间的数字
            "step|+2": 0, // 从0开始，每次递增2
            "old|2-30.2-5": 0.2, // 范围2-30之内保留2-5位小数的数值
            regexp: /\d{5,10}/, // 5-10位数字 888466
            "sex|1": ["男", "女"], // 从数组里随机取一个
            "sex2|1+": ["男", "女"], // 顺序选取一个元素
            // 重复2次属性值生成一个新数组["jack", "jim", "jack", "jim"]
            "friends|2": ["jack", "jim"],
            "isMan|1-4": true, // 为true:false比值为1：4
            image: "@image(200x100, #ffcc33, #FFF, png, 这是text文本)", //图片url
            func: () => "@rgba", // 由函数定义的返回值 “@rgba”
            "nameObj|7": {
              // 从obj对象中随机获取7个属性
              first: "@first", //姓
              last: "@last", //姓
              name: "@name", //姓名
              firstnameC: "@cfirst", //中文姓
              lastnameC: "@clast", // 中文名
              nameC: "@cname", //中文姓名
              middle: "中间值", // 常量
              // 组合而成，可以使用上面的变量结果
              full: "@first @middle @lastname",
            },
            colorObj: {
              color: "@color", // 十六进制颜色值 "#79d6f2"
              rgba: "@rgba", // rgba颜色值 "rgba(242, 234, 121, 0.43)"
            },
            textObj: {
              sentence: "@sentence", // 英文句子
              csentence: "@csentence", // 中文句子
              word: "@word(3,50)", // 3-50个字符的单词
              cword: "@cword", // 一个中文汉字
              paragraph: "@paragraph", // 英文段落
              cparagraph: "@cparagraph", // 中文段落
              title: "@title(2,9)", // 英文标题
              ctitle: "@ctitle", // 中文标题
            },
            miscellaneous: {
              // 唯一guid "C240E2c7-ff55-fAee-AC8C-4BFD3deCa852"
              guid: "@guid",
              userId: "@id", // 随机id 520000197307079598
            },
            basicObj: {
              natural: "@natural", //自然数 1306405924413808
              character: "@character(张进喜)", // 任意一个字符：张
              float: "@float(10,50)", // 10-50之间的float值 12.232342
              integer: "@integer(10,50)", // 10-50之间的integer值 43
              string: "@string(10)", // 十个英文字符 wqw@wewewe
              //一个1-10之间数字的范围数组，每次递增2 [1,3,5,7,9]
              range: "@range(1,10,2)",
              date: "@date(yyyy-MM-dd)", // 年月日
              time: "@time", // 时分秒
              datetime: "@datetime", // 年月日时分秒
              now: "@now", //现在时间的，年月日时分秒
            },
            webObj: {
              url: "@url", // 任意协议的URL
              protocol: "@protocol", // 协议：mailto
              domain: "@domain", // 域名
              email: "@email", // 邮箱
              ip: "@ip", // IPv4地址
              // tId: "@tId", // tId 无效。。。
            },
            addressObj: {
              city: "@city(true)", //中国一个城市:重庆 重庆市
              county: "@county", //中国一个区域：渝中区
              zip: "@zip", // 六位数字的邮编 144585
              area: "@area", // 无效。。
              region: "@region", // 区域：华北
            },
            helper: {
              upper: "@upper(abc)", // 转成大写字母
              lower: "@lower(ABC)", // 转成小写字母
              capitalize: "@capitalize(wqwjeqwjqw)", // 首字母大写
              pick: "@pick([1,2,3])", // 从数组里任选一个
              shuffle: "@shuffle([1,2,3])", // 打乱顺序的数组
            },
          },
        ],
      });
      res.end(JSON.stringify(resData));
    },
  },
];
```

## vite-plugin-mock-server

vite 构建工具的 mockServer 插件。以下是基于 vite-plugin-mock-server 可能的项目结构：

- mock:专门用于存放 mock 数据的文件夹，.ts 文件用来编写模拟 API 接口。
- vite.config.js: Vite 的配置文件，定义了构建过程中的各种配置，包括 mock 服务器的启用

```md
├── public/ # 静态资源
│
├── mock/ # 模拟数据文件夹
│ ├── api.ts # 模拟 API 数据文件
│ └── ... # 更多模拟数据文件
|
├── vite.config.js # Vite 配置文件
```

vite.config.js 文件 mock 服务器配置：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mockServer from "vite-plugin-mock-server";

export default defineConfig({
  plugins: [
    vue(),
    mockServer({
      logLevel: "info",
      // 匹配请求路径前缀
      urlPrefixes: ["/api/"],
      // mock服务器的根目录
      mockRootDir: path.relative(__dirname, "./src/api/mock"),
      mockJsSuffix: ".mock.js",
      mockTsSuffix: ".mock.ts",
      // mockModules?: string[],
      noHandlerResponse404: true,
      printStartupLog: true,
      middlewares: [
        cookieParser(),
        bodyParser.json(),
        bodyParser.urlencoded(),
        bodyParser.text(),
        bodyParser.raw(),
      ],
    }),
  ],
});
```
