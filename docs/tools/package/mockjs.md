---
title: 🎭 Mock.js 数据模拟完全指南
description: Mock.js 是前端开发中拦截 Ajax 请求生成随机数据的工具，提供简单方便的数据模拟解决方案
outline: deep
---

# 🎭 Mock.js 数据模拟完全指南

> Mock.js 是一款前端开发中拦截 Ajax 请求再生成随机数据响应的工具。可以用来模拟服务器响应，优点是非常简单方便、无侵入性、基本覆盖常用的接口数据类型。

## 📖 概述

### ✨ 主要特性

| 特性 | 描述 | 优势 |
|------|------|------|
| 🚀 **无侵入性** | 不需要修改现有代码 | 快速集成 |
| 🎯 **数据模拟** | 生成各种类型的随机数据 | 覆盖全面 |
| 🔄 **请求拦截** | 自动拦截 Ajax 请求 | 透明处理 |
| 📊 **丰富的数据类型** | 支持文本、数字、布尔、日期等 | 满足各种需求 |
| 🎨 **灵活的语法** | 简洁的数据模板语法 | 易于使用 |
| 🔧 **可扩展性** | 支持自定义扩展 | 高度定制 |

### 📝 数据模板格式

```javascript
'name|rule': value

// 属性名|生成规则: 属性值
```

::: tip 💡 模板语法说明
- **name**: 属性名
- **rule**: 生成规则
- **value**: 属性值，可以是字符串、数字、布尔值、对象、数组等
:::

## 📦 安装和基础配置

### 🔧 安装 Mock.js

```bash
# 使用 npm
npm install mockjs

# 使用 yarn
yarn add mockjs

# 使用 pnpm
pnpm add mockjs
```

### ⚙️ 基础配置

```javascript
import Mock from "mockjs";

// 通过函数直接调用
const Random = Mock.Random;
console.log(Random.email()); // 结果: r.quyppn@yit.cv

// 传入字符方式调用
console.log(Mock.mock("@email")); // 结果: s.uorjeqdou@crqfpdypt.gw

// 设置响应延迟
Mock.setup({ timeout: 4000 }); // 设置 4 秒后再响应
Mock.setup({ timeout: "1000-4000" }); // 设置 1-4 秒间随机响应
```

### 🔧 自定义扩展

```javascript
// 可以自定义扩展
Random.extend({
  weekday: function (date) {
    const weekdays = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ];
    return this.pick(weekdays);
  },
  
  sex: function (date) {
    const sexes = ["男", "女", "中性", "未知"];
    return this.pick(sexes);
  }
});

console.log(Random.weekday()); // 结果: Saturday
console.log(Mock.mock("@weekday")); // 结果: Tuesday
console.log(Random.sex()); // 结果: 男
console.log(Mock.mock("@sex")); // 结果: 未知
```

### 🔍 数据验证

```javascript
// Mock.valid(template, data): 校验 data 是否与模板 template 匹配
const tempObj = { "user|1-3": [{ name: "@cname", "id|18-28": 88 }] };
const realData = { user: [{ name: "张三", id: 90 }] };
console.log(Mock.valid(tempObj, realData));

// Mock.toJSONSchema(template): 把 Mock.js 风格的数据模板转换成 JSON Schema
const tempObj2 = { "user|1-3": [{ name: "@cname", "id|18-28": 88 }] };
console.log(Mock.toJSONSchema(tempObj2));
```

## 🔄 拦截请求

### 📡 基础请求拦截

```javascript
// 引入 Mock.js 库
const Mock = require("mockjs");

// 模拟数据：对象形式。不传 method，匹配任何请求方式
Mock.mock("/api/data", {
  name: "@name", // 随机生成姓名
  "age|1-100": 100, // 随机生成 1-100 的数字
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
```

### 🔧 高级拦截配置

```javascript
// 拦截 Ajax 请求，返回模拟数据
// 重写了 XHR.prototype.send 方法
Mock.XHR.prototype.send = function () {
  const self = this;
  
  setTimeout(function () {
    // 模拟处理时间
    const status = self.statusCode;
    
    try {
      // 解析 URL，获取模拟数据的规则
      const url = self.url;
      const response = Mock.mock(url);
      
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

// 发送请求示例
$.ajax({
  url: "/api/data",
  type: "get",
  dataType: "json",
}).done(function (data, status, xhr) {
  console.log(JSON.stringify(data, null, 4));
});
```

## 📊 数据定义规则

### 🎯 基础数据类型

```javascript
// 使用 mock-server 拦截请求，并返回模拟数据
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
    pattern: "/api/auth/login", // 拦截请求的匹配的 url
    method: "get", // 匹配的请求方式
    // 匹配拦截后的回调函数。类似 node server 的回调
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
      // 返回 mockjs 模拟出的数据
      resData.data = Mock.mock({
        "list|3-10": [
          // 从数组中取 3-10 个元素
          {
            "name|1-3": "张进喜", // 后面的字符串，重复 1-3 次 "张进喜张进喜"
            "age|20-40": 0, // 20-40 之间的数字
            "step|+2": 0, // 从 0 开始，每次递增 2
            "old|2-30.2-5": 0.2, // 范围 2-30 之内保留 2-5 位小数的数值
            regexp: /\d{5,10}/, // 5-10 位数字 888466
            "sex|1": ["男", "女"], // 从数组里随机取一个
            "sex2|1+": ["男", "女"], // 顺序选取一个元素
            // 重复 2 次属性值生成一个新数组 ["jack", "jim", "jack", "jim"]
            "friends|2": ["jack", "jim"],
            "isMan|1-4": true, // 为 true:false 比值为 1：4
            image: "@image(200x100, #ffcc33, #FFF, png, 这是text文本)", // 图片 url
            func: () => "@rgba", // 由函数定义的返回值 "@rgba"
            "nameObj|7": {
              // 从 obj 对象中随机获取 7 个属性
              first: "@first", // 姓
              last: "@last", // 名
              name: "@name", // 姓名
              firstnameC: "@cfirst", // 中文姓
              lastnameC: "@clast", // 中文名
              nameC: "@cname", // 中文姓名
              middle: "中间值", // 常量
              // 组合而成，可以使用上面的变量结果
              full: "@first @middle @lastname",
            },
            colorObj: {
              color: "@color", // 十六进制颜色值 "#79d6f2"
              rgba: "@rgba", // rgba 颜色值 "rgba(242, 234, 121, 0.43)"
            },
            textObj: {
              sentence: "@sentence", // 英文句子
              csentence: "@csentence", // 中文句子
              word: "@word(3,50)", // 3-50 个字符的单词
              cword: "@cword(3,50)", // 3-50 个中文字符
              title: "@title", // 英文标题
              ctitle: "@ctitle", // 中文标题
              paragraph: "@paragraph", // 英文段落
              cparagraph: "@cparagraph", // 中文段落
            },
            numberObj: {
              integer: "@integer(1,100)", // 1-100 之间的整数
              natural: "@natural(1,100)", // 1-100 之间的自然数
              float: "@float(1,100,2,5)", // 1-100 之间保留 2-5 位小数
            },
            dateObj: {
              date: "@date", // 日期 "2023-10-15"
              time: "@time", // 时间 "14:30:25"
              datetime: "@datetime", // 日期时间 "2023-10-15 14:30:25"
              now: "@now", // 当前时间戳
            },
            webObj: {
              url: "@url", // 随机 URL
              domain: "@domain", // 随机域名
              email: "@email", // 随机邮箱
              ip: "@ip", // 随机 IP 地址
            },
            addressObj: {
              region: "@region", // 随机区域
              province: "@province", // 随机省份
              city: "@city", // 随机城市
              county: "@county", // 随机县
              zip: "@zip", // 随机邮编
            },
            idObj: {
              id: "@id", // 随机身份证号
              guid: "@guid", // 随机 GUID
              increment: "@increment", // 自增数字
            }
          },
        ],
      });
      res.end(JSON.stringify(resData));
    },
  },
];
```

### 📋 数据规则详解

#### 🔢 数字类型规则

| 规则格式 | 说明 | 示例 | 结果 |
|----------|------|------|------|
| `"name\|min-max": number` | 生成 min 到 max 之间的整数 | `"age\|18-65": 0` | 18-65 之间的数字 |
| `"name\|count": number` | 重复 count 次 | `"age\|3": 0` | 000 |
| `"name\|min-max.dmin-dmax": number` | 浮点数，整数部分 min-max，小数部分 dmin-dmax 位 | `"price\|1-100.1-4": 1` | 1.23 到 100.1234 |
| `"name\|+step": number` | 每次递增 step | `"id\|+1": 100` | 100, 101, 102... |

#### 📝 字符串类型规则

| 规则格式 | 说明 | 示例 | 结果 |
|----------|------|------|------|
| `"name\|min-max": string` | 重复字符串 min 到 max 次 | `"name\|1-3": "Hello"` | Hello 到 HelloHelloHello |
| `"name\|count": string` | 重复字符串 count 次 | `"name\|3": "Hi"` | HiHiHi |

#### 🔄 布尔类型规则

| 规则格式 | 说明 | 示例 | 结果 |
|----------|------|------|------|
| `"name\|1": boolean` | 随机生成布尔值 | `"isVip\|1": true` | true 或 false |
| `"name\|min-max": boolean` | 概率生成，true 的概率是 min/(min+max) | `"isVip\|1-3": true` | true 概率 1/4 |

#### 📦 数组类型规则

| 规则格式 | 说明 | 示例 | 结果 |
|----------|------|------|------|
| `"name\|1": array` | 从数组中随机选择一个元素 | `"city\|1": ["北京", "上海"]` | 北京 或 上海 |
| `"name\|+1": array` | 按顺序选择数组元素 | `"city\|+1": ["北京", "上海"]` | 依次返回 |
| `"name\|min-max": array` | 重复数组元素 min 到 max 次 | `"tags\|1-3": ["tag"]` | ["tag"] 到 ["tag","tag","tag"] |
| `"name\|count": array` | 重复数组元素 count 次 | `"tags\|2": ["tag"]` | ["tag", "tag"] |

#### 🎯 对象类型规则

| 规则格式 | 说明 | 示例 | 结果 |
|----------|------|------|------|
| `"name\|count": object` | 从对象中随机选择 count 个属性 | `"info\|2": {a:1,b:2,c:3}` | 随机选择 2 个属性 |
| `"name\|min-max": object` | 从对象中随机选择 min 到 max 个属性 | `"info\|1-3": {a:1,b:2,c:3}` | 随机选择 1-3 个属性 |

## 🎨 Random 数据生成

### 👤 个人信息

```javascript
// 基础信息
Mock.Random.first()          // 英文名
Mock.Random.last()           // 英文姓
Mock.Random.name()           // 英文姓名
Mock.Random.cfirst()         // 中文名
Mock.Random.clast()          // 中文姓
Mock.Random.cname()          // 中文姓名

// 示例
console.log(Mock.mock('@cname')); // 张三
console.log(Mock.mock('@name'));  // John Smith
```

### 📍 地址信息

```javascript
// 地理位置
Mock.Random.region()         // 区域
Mock.Random.province()       // 省份
Mock.Random.city()          // 城市
Mock.Random.county()        // 县
Mock.Random.zip()           // 邮编

// 示例
console.log(Mock.mock('@province @city @county')); // 广东省 深圳市 南山区
```

### 📧 网络信息

```javascript
// 网络相关
Mock.Random.url()           // URL
Mock.Random.protocol()      // 协议
Mock.Random.domain()        // 域名
Mock.Random.email()         // 邮箱
Mock.Random.ip()           // IP 地址

// 示例
console.log(Mock.mock('@email')); // user@example.com
console.log(Mock.mock('@url'));   // http://example.com
```

### 🎨 颜色和图片

```javascript
// 颜色
Mock.Random.color()         // 十六进制颜色
Mock.Random.hex()          // 十六进制颜色
Mock.Random.rgb()          // RGB 颜色
Mock.Random.rgba()         // RGBA 颜色
Mock.Random.hsl()          // HSL 颜色

// 图片
Mock.Random.image()        // 随机图片
Mock.Random.image('200x100') // 指定尺寸图片
Mock.Random.image('200x100', '#ff0000', '#ffffff', 'png', 'Mock.js') // 完整参数

// 示例
console.log(Mock.mock('@color'));  // #ff6600
console.log(Mock.mock('@image'));  // http://dummyimage.com/125x125
```

### 📅 日期时间

```javascript
// 日期时间
Mock.Random.date()          // 日期 YYYY-MM-DD
Mock.Random.time()          // 时间 HH:mm:ss
Mock.Random.datetime()      // 日期时间 YYYY-MM-DD HH:mm:ss
Mock.Random.now()          // 当前时间

// 自定义格式
Mock.Random.date('yyyy-MM-dd')      // 2023-10-15
Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss') // 2023-10-15 AM 14:30:25

// 示例
console.log(Mock.mock('@date'));     // 2023-10-15
console.log(Mock.mock('@datetime')); // 2023-10-15 14:30:25
```

### 📝 文本内容

```javascript
// 文本生成
Mock.Random.word()          // 英文单词
Mock.Random.sentence()      // 英文句子
Mock.Random.paragraph()     // 英文段落
Mock.Random.title()         // 英文标题

Mock.Random.cword()         // 中文字符
Mock.Random.csentence()     // 中文句子
Mock.Random.cparagraph()    // 中文段落
Mock.Random.ctitle()        // 中文标题

// 指定长度
Mock.Random.word(3, 10)     // 3-10 个字符的英文单词
Mock.Random.cword(2, 5)     // 2-5 个中文字符

// 示例
console.log(Mock.mock('@ctitle'));    // 标题内容
console.log(Mock.mock('@csentence')); // 这是一个中文句子。
```

## 🔧 实际应用场景

### 🌐 前端开发环境

```javascript
// 用户列表模拟
Mock.mock('/api/users', 'get', {
  code: 200,
  message: 'success',
  'data|10-20': [
    {
      'id|+1': 1,
      name: '@cname',
      email: '@email',
      'age|18-65': 18,
      avatar: '@image(100x100)',
      'status|1': ['active', 'inactive'],
      createTime: '@datetime',
      'role|1': ['admin', 'user', 'guest']
    }
  ]
});

// 文章列表模拟
Mock.mock('/api/articles', 'get', {
  code: 200,
  'data|5-10': [
    {
      'id|+1': 1,
      title: '@ctitle(5, 20)',
      content: '@cparagraph(3, 7)',
      author: '@cname',
      'views|100-9999': 100,
      'likes|10-999': 10,
      publishTime: '@datetime',
      'tags|1-3': ['前端', '后端', 'Vue', 'React', 'Node.js']
    }
  ]
});
```

### 📊 数据统计模拟

```javascript
// 统计数据模拟
Mock.mock('/api/statistics', 'get', {
  code: 200,
  data: {
    'userCount|1000-9999': 1000,
    'orderCount|500-2000': 500,
    'revenue|10000-99999.2': 10000,
    'growth|1-100.2': 1,
    'chartData|7': [
      {
        date: '@date',
        'value|100-1000': 100
      }
    ]
  }
});

// 地区数据模拟
Mock.mock('/api/regions', 'get', {
  code: 200,
  'data|10': [
    {
      name: '@province',
      'population|1000000-10000000': 1000000,
      'area|10000-100000': 10000,
      'gdp|1000-9999.2': 1000
    }
  ]
});
```

### 🛒 电商应用模拟

```javascript
// 商品列表模拟
Mock.mock('/api/products', 'get', {
  code: 200,
  'data|20': [
    {
      'id|+1': 1,
      name: '@ctitle(3, 10)',
      description: '@cparagraph(1, 3)',
      'price|10-999.2': 10,
      'originalPrice|10-999.2': 10,
      image: '@image(300x300)',
      'category|1': ['数码', '服装', '食品', '家居', '运动'],
      'rating|1-5.1': 1,
      'sales|0-9999': 0,
      'stock|0-100': 0,
      'isHot|1': true,
      'isNew|1': true
    }
  ]
});

// 订单模拟
Mock.mock('/api/orders', 'get', {
  code: 200,
  'data|10': [
    {
      'id|+1': 1000,
      orderNo: '@id',
      'amount|100-9999.2': 100,
      'status|1': ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      createTime: '@datetime',
      'items|1-5': [
        {
          productName: '@ctitle(3, 10)',
          'quantity|1-5': 1,
          'price|10-999.2': 10
        }
      ]
    }
  ]
});
```

## 🎯 高级技巧

### 🔄 动态数据生成

```javascript
// 根据参数动态生成数据
Mock.mock(/\/api\/user\/\d+/, 'get', function(options) {
  const userId = options.url.match(/\/api\/user\/(\d+)/)[1];
  
  return Mock.mock({
    code: 200,
    data: {
      id: userId,
      name: '@cname',
      email: '@email',
      'age|18-65': 18,
      avatar: '@image(100x100)'
    }
  });
});

// 根据请求体生成数据
Mock.mock('/api/search', 'post', function(options) {
  const body = JSON.parse(options.body);
  const keyword = body.keyword;
  
  return Mock.mock({
    code: 200,
    data: {
      keyword: keyword,
      'results|5-15': [
        {
          'id|+1': 1,
          title: `包含${keyword}的@ctitle(5, 15)`,
          content: `这是关于${keyword}的@cparagraph(1, 3)`
        }
      ]
    }
  });
});
```

### 🎨 自定义占位符

```javascript
// 扩展 Random 方法
Mock.Random.extend({
  // 自定义手机号生成
  phone: function() {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139'];
    const prefix = this.pick(prefixes);
    const suffix = this.string('number', 8);
    return prefix + suffix;
  },
  
  // 自定义身份证号生成
  idCard: function() {
    const area = this.pick(['110000', '120000', '130000', '140000']);
    const birth = this.date('yyyyMMdd');
    const sequence = this.string('number', 3);
    const checkCode = this.pick(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X']);
    return area + birth + sequence + checkCode;
  },
  
  // 自定义状态生成
  status: function() {
    return this.pick(['active', 'inactive', 'pending', 'suspended']);
  }
});

// 使用自定义占位符
console.log(Mock.mock('@phone'));   // 13812345678
console.log(Mock.mock('@idCard'));  // 11000019901010001X
console.log(Mock.mock('@status'));  // active
```

### 🔧 条件数据生成

```javascript
// 根据条件生成不同数据
Mock.mock('/api/user/profile', 'get', function() {
  const userType = Mock.Random.pick(['vip', 'normal', 'guest']);
  
  const baseData = {
    'id|+1': 1,
    name: '@cname',
    email: '@email',
    type: userType
  };
  
  // 根据用户类型添加不同字段
  if (userType === 'vip') {
    baseData.vipLevel = Mock.Random.integer(1, 5);
    baseData.vipExpire = Mock.Random.date();
    baseData.privileges = Mock.mock({
      'list|3-5': ['@word']
    }).list;
  } else if (userType === 'normal') {
    baseData.registerTime = Mock.Random.datetime();
    baseData.lastLogin = Mock.Random.datetime();
  }
  
  return {
    code: 200,
    data: baseData
  };
});
```

## 🎨 最佳实践

### ✅ 推荐做法

::: tip 🎯 最佳实践
1. **模块化管理**: 将不同模块的 Mock 数据分文件管理
2. **真实数据模拟**: 尽量模拟真实的业务数据结构
3. **合理的数据量**: 设置合适的数据数量，避免过多影响性能
4. **状态管理**: 模拟各种业务状态和异常情况
5. **响应延迟**: 设置合理的响应延迟模拟真实网络环境
6. **数据关联**: 保持数据之间的逻辑关联性
:::

### 🚫 避免的做法

::: warning ⚠️ 注意事项
- 不要在生产环境中引入 Mock.js
- 避免生成过于复杂的嵌套数据结构
- 不要忽略数据的业务逻辑性
- 避免硬编码过多固定值
- 不要忘记清理不需要的 Mock 配置
:::

### 📁 项目结构建议

```
src/
├── mock/
│   ├── index.js          // Mock 入口文件
│   ├── user.js           // 用户相关 Mock
│   ├── product.js        // 产品相关 Mock
│   ├── order.js          // 订单相关 Mock
│   └── common.js         // 通用 Mock 方法
├── api/
│   └── request.js        // 请求封装
└── main.js
```

### 🔧 环境配置

```javascript
// mock/index.js
import Mock from 'mockjs';

// 只在开发环境启用 Mock
if (process.env.NODE_ENV === 'development') {
  // 设置延迟
  Mock.setup({
    timeout: '200-800'
  });
  
  // 导入所有 Mock 配置
  import('./user');
  import('./product');
  import('./order');
  
  console.log('Mock 数据已启用');
}
```

## 🌟 总结

Mock.js 作为前端开发的数据模拟工具，提供了：

- ✅ **简单易用**: 语法简洁，学习成本低
- ✅ **功能丰富**: 支持各种数据类型和生成规则
- ✅ **无侵入性**: 不需要修改现有业务代码
- ✅ **高度可定制**: 支持自定义扩展和复杂数据生成
- ✅ **开发效率**: 显著提升前端开发和测试效率
- ✅ **团队协作**: 前后端可以并行开发，减少依赖

通过合理使用 Mock.js，可以让前端开发更加独立高效，是现代前端开发工作流中不可缺少的工具之一。