---
title: 📅 Day.js 轻量级日期库完全指南
description: Day.js 极简日期时间处理库的详细使用指南，包括解析、格式化、操作、查询等完整功能介绍
outline: deep
---

# 📅 Day.js 轻量级日期库完全指南

> Day.js 是一个极简的 JavaScript 库，可以为现代浏览器解析、验证、操作和显示日期和时间，是 Moment.js 的轻量级替代方案。

## 1. Day.js 简介

Day.js 是一个极简的 JavaScript 库，可以为现代浏览器解析、验证、操作和显示日期和时间。可以运行在浏览器和 Node.js 中。

### 1.1 核心优势

| 特性 | 描述 | 优势 |
|------|------|------|
| **轻量级** | 文件大小只有 2KB 左右 | 📦 更少的下载和解析时间 |
| **不可变性** | 所有 API 操作返回新实例 | 🔒 防止错误和调试问题 |
| **国际化支持** | 强大的国际化支持 | 🌍 按需加载语言包 |
| **API 兼容** | 与 Moment.js 类似的 API | 🔄 易于迁移 |

::: info 📖 参考文档
详细文档请参考：[Day.js 中文文档](https://dayjs.fenxianglu.cn/)
:::

### 1.2 快速开始

```javascript
// 基础用法示例
dayjs().format();                         // 2020-09-08T13:42:32+08:00
dayjs().format('YYYY-MM-DD');             // 2020-09-08
dayjs().format('YYYY-MM-DD HH:mm:ss');    // 2020-09-08 13:47:12

// 时间戳转换
dayjs(1318781876406).format('YYYY-MM-DD HH:mm:ss'); // 2011-10-17 00:17:56
```

## 2. 日期解析

Day.js 提供了多种方式来创建和解析日期：

### 2.1 基本解析

```javascript
// 当前时间
let now = dayjs()  // 等同于 dayjs(new Date()) 的调用

// ISO 8601 格式字符串
dayjs('2018-04-04T16:00:00.000Z')

// 使用原生 JavaScript Date 对象
var day = dayjs(new Date(2018, 8, 18))
```

### 2.2 自定义格式解析

```javascript
// 自定义格式解析 (依赖 CustomParseFormat 插件)
dayjs.extend(customParseFormat)
dayjs("12-25-1995", "MM-DD-YYYY")

// 解析本地化日期字符串
require('dayjs/locale/zh-cn')
dayjs('2018 三月 15', 'YYYY MMMM DD', 'zh-cn')

// 严格解析模式
dayjs('1970-00-00', 'YYYY-MM-DD').isValid()         // true
dayjs('1970-00-00', 'YYYY-MM-DD', true).isValid()   // false
dayjs('1970-00-00', 'YYYY-MM-DD', 'es', true).isValid() // false

// 多格式解析
dayjs("12-25-2001", ["YYYY", "YYYY-MM-DD"], 'es', true);
```

### 2.3 高级解析选项

```javascript
// 对象解析 (依赖 ObjectSupport 插件)
dayjs.extend(objectSupport)
dayjs({ hour: 15, minute: 10 });
dayjs.utc({ y: 2010, M: 3, d: 5, h: 15, m: 10, s: 3, ms: 123});
dayjs({ year: 2010, month: 3, day: 5, hour: 15, minute: 10, second: 3, millisecond: 123});

// 数组解析 (依赖 ArraySupport 插件)
dayjs.extend(arraySupport)
dayjs([2010, 1, 14, 15, 25, 50, 125]);  // February 14th, 3:25:50.125 PM
dayjs([2010]);        // January 1st
dayjs([2010, 6]);     // July 1st
dayjs([2010, 6, 10]); // July 10th
```

### 2.4 UTC 解析

```javascript
// UTC 时间解析 (依赖 UTC 插件)
dayjs.extend(utc)
dayjs().format()           // 2019-03-06T08:00:00+08:00
dayjs.utc().format()       // 2019-03-06T00:00:00Z

// UTC 模式下的 getter 和 setter
dayjs.utc().seconds(30).valueOf()  // => new Date().setUTCSeconds(30)
dayjs.utc().seconds()              // => new Date().getUTCSeconds()
```

### 2.5 克隆对象

```javascript
// 所有 Day.js 对象都是不可变的
var a = dayjs()
var b = a.clone()
// a 和 b 是两个独立的 Day.js 对象
```

## 3. 取值与赋值

Day.js 的 getter 和 setter 使用了相同的 API，不传参数调用方法即为 getter，调用并传入参数为 setter。

```javascript
// 基本 getter 和 setter
dayjs().second(30).valueOf()  // => new Date().setSeconds(30)
dayjs().second()              // => new Date().getSeconds()

// 通用 getter 和 setter
dayjs().get(unit) === dayjs()[unit]()
dayjs().get('second') === dayjs().second()

dayjs().set(unit, value) === dayjs()[unit](value)
dayjs().set('second', 30) === dayjs().second(30)

// 最大值和最小值 (依赖 MinMax 插件)
dayjs.extend(minMax)
dayjs.max(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'))
dayjs.max([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')])

dayjs.min(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'))
dayjs.min([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')])
```

## 4. 日期操作

Day.js 提供了丰富的方法来操作日期：

```javascript
// 链式操作：增加、减少、开始、结束
dayjs('2019-01-25')
  .add(1, 'day')
  .subtract(1, 'year')
  .startOf('year')
  .endOf('month')
  .toString()

// 时区转换 (依赖 UTC 插件)
dayjs.extend(utc)
var a = dayjs.utc()
a.format()           // 2019-03-06T00:00:00Z
a.local().format()   // 2019-03-06T08:00:00+08:00
```

## 5. 日期显示

Day.js 提供多种方式格式化和显示日期：

### 5.1 格式化

```javascript
// 默认格式 (ISO8601)
dayjs().format()  // 2020-04-02T08:02:17-05:00

// 自定义格式
dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') 
// 'YYYYescape 2019-01-25T00:00:00-02:00Z'

// 常用格式
dayjs('2019-01-25').format('DD/MM/YYYY')  // '25/01/2019'
```

### 5.2 差异计算

```javascript
// 计算日期差异
const date1 = dayjs('2019-01-25')
date1.diff('2018-06-05', 'month', true)  // 7.645161290322581

// 获取月份天数
dayjs('2019-01-25').daysInMonth()  // 31
```

### 5.3 转换方法

```javascript
// 转换为原生 Date 对象
dayjs('2019-01-25').toDate()

// 转换为数组 (依赖 toArray 插件)
dayjs.extend(toArray)
dayjs('2019-01-25').toArray()  // [ 2019, 0, 25, 0, 0, 0, 0 ]

// 转换为 JSON
dayjs('2019-01-25').toJSON()  // '2019-01-25T02:00:00.000Z'

// 转换为对象 (依赖 toObject 插件)
dayjs.extend(toObject)
dayjs('2019-01-25').toObject()
/* { 
   years: 2019,
   months: 0,
   date: 25,
   hours: 0,
   minutes: 0,
   seconds: 0,
   milliseconds: 0 
} */

// 转换为字符串
dayjs('2019-01-25').toString()  // 'Fri, 25 Jan 2019 02:00:00 GMT'
```

## 6. 日期查询

Day.js 提供了多种方法来查询日期关系：

### 6.1 基本比较

```javascript
// 之前
dayjs().isBefore(dayjs('2011-01-01'))       // 默认毫秒
dayjs().isBefore('2011-01-01', 'year')      // 按年比较

// 之后
dayjs().isAfter(dayjs('2011-01-01'))        // 默认毫秒
dayjs().isAfter('2011-01-01', 'year')       // 按年比较

// 相同
dayjs().isSame(dayjs('2011-01-01'))         // 默认毫秒
dayjs().isSame('2011-01-01', 'year')        // 按年比较
```

### 6.2 扩展比较

```javascript
// 相同或之前 (依赖 isSameOrBefore 插件)
dayjs.extend(isSameOrBefore)
dayjs().isSameOrBefore(dayjs('2011-01-01'))
dayjs().isSameOrBefore('2011-01-01', 'year')

// 相同或之后 (依赖 isSameOrAfter 插件)
dayjs.extend(isSameOrAfter)
dayjs().isSameOrAfter(dayjs('2011-01-01'))
dayjs().isSameOrAfter('2011-01-01', 'year')

// 之间 (依赖 isBetween 插件)
dayjs.extend(isBetween)
dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25'))
dayjs().isBetween('2010-10-19', '2010-10-25', 'year')
// 包容性设置: [ 表示包含, ( 表示排除
dayjs('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)')
```

### 6.3 类型检查

```javascript
// 检查是否为 Day.js 对象
dayjs.isDayjs(dayjs())    // true
dayjs.isDayjs(new Date()) // false
```

## 7. 国际化支持

Day.js 提供了强大的国际化支持：

```javascript
// 加载语言包
require('dayjs/locale/de')
// import 'dayjs/locale/de' // ES 2015 

// 全局设置语言
dayjs.locale('de')

// 只为特定实例设置语言
dayjs().locale('de').format()

// 获取当前语言
dayjs.locale() // 'de'
```

## 8. 插件系统

Day.js 的核心非常精简，很多功能通过插件实现。使用前需要先加载并注册插件：

```javascript
// 加载并注册插件
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

// 使用插件功能
dayjs("12-25-1995", "MM-DD-YYYY")
dayjs.utc().format()
```

## 9. 参考资料

- [Day.js 官方文档](https://day.js.org/)
- [Day.js 中文文档](https://dayjs.fenxianglu.cn/)
- [GitHub 仓库](https://github.com/iamkun/dayjs)