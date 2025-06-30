---
title: 📅 Day.js 轻量级日期库完全指南
description: Day.js 极简日期时间处理库的详细使用指南，包括解析、格式化、操作、查询等完整功能介绍
outline: deep
---

# 📅 Day.js 轻量级日期库完全指南

> Day.js 是一个极简的 JavaScript 库，可以为现代浏览器解析、验证、操作和显示日期和时间，是 Moment.js 的轻量级替代方案。

## 🎯 Day.js 简介

Day.js 是一个极简的 JavaScript 库，可以为现代浏览器解析、验证、操作和显示日期和时间。可以运行在浏览器和 Node.js 中。

### ✨ 核心优势

| 特性 | 描述 | 优势 |
|------|------|------|
| **轻量级** | 文件大小只有 2KB 左右 | 📦 更少的下载和解析时间 |
| **不可变性** | 所有 API 操作返回新实例 | 🔒 防止错误和调试问题 |
| **国际化支持** | 强大的国际化支持 | 🌍 按需加载语言包 |
| **API 兼容** | 与 Moment.js 类似的 API | 🔄 易于迁移 |

::: info 📖 参考文档
详细文档请参考：[Day.js 中文文档](https://dayjs.fenxianglu.cn/)
:::

### 🚀 快速开始

```javascript
// 基础用法示例
dayjs().format(); // 2020-09-08T13:42:32+08:00
dayjs().format('YYYY-MM-DD');  // 2020-09-08
dayjs().format('YYYY-MM-DD HH:mm:ss'); // 2020-09-08 13:47:12

// 时间戳转换
dayjs(1318781876406).format('YYYY-MM-DD HH:mm:ss'); // 2011-10-17 00:17:56
```

## 解析

```js
let now = dayjs() //等同于 dayjs(new Date()) 的调用
dayjs('2018-04-04T16:00:00.000Z')

//如果知道输入字符串的格式，您可以用它来解析日期
// 此功能依赖 CustomParseFormat 插件
dayjs.extend(customParseFormat)
dayjs("12-25-1995", "MM-DD-YYYY")

//解析包含本地化语言的日期字符串，可以传入第三个参数。
require('dayjs/locale/zh-cn')
dayjs('2018 三月 15', 'YYYY MMMM DD', 'zh-cn')

//最后一个参数可传入布尔值来启用严格解析模式。 
//严格解析要求格式和输入内容完全匹配，包括分隔符。
// isValid 返回 布尔值 表示 Dayjs 的日期是否通过校验。
dayjs('1970-00-00', 'YYYY-MM-DD').isValid() // true
dayjs('1970-00-00', 'YYYY-MM-DD', true).isValid() // false
dayjs('1970-00-00', 'YYYY-MM-DD', 'es', true).isValid() // false

//如果您不知道输入字符串的确切格式，但知道它可能是几种中的一种，
//可以使用数组传入多个格式
dayjs("12-25-2001", ["YYYY", "YYYY-MM-DD"], 'es', true);

// 使用原生 Javascript Date 对象创建一个 Day.js 对象。
var day = dayjs(new Date(2018, 8, 18))

//可以传入包含单位和数值的一个对象来创建 Dayjs 对象.依赖 ObjectSupport 插件
dayjs.extend(objectSupport)
dayjs({ hour:15, minute:10 });
dayjs.utc({ y:2010, M:3, d:5, h:15, m:10, s:3, ms: 123});
dayjs({ year :2010, month :3, day :5, hour :15, minute :10, second :3, millisecond :123});
dayjs({ years:2010, months:3, date:5, hours:15, minutes:10, seconds:3, milliseconds:123});

// 传入一个数组来创建一个 Dayjs 对象，数组和结构和 new Date() 十分类似.依赖 ArraySupport 插件
dayjs.extend(arraySupport)
dayjs([2010, 1, 14, 15, 25, 50, 125]); // February 14th, 3:25:50.125 PM
dayjs.utc([2010, 1, 14, 15, 25, 50, 125]);
dayjs([2010]);        // January 1st
dayjs([2010, 6]);     // July 1st
dayjs([2010, 6, 10]); // July 10th

//默认情况下，Day.js 会把时间解析成本地时间。依赖 UTC 插件
//如果想使用 UTC 时间，您可以调用 dayjs.utc() 而不是 dayjs()。
dayjs.extend(utc)
dayjs().format() //2019-03-06T08:00:00+08:00
dayjs.utc().format() // 2019-03-06T00:00:00Z
// 此外，在 UTC 模式下， 所有 getters 和 setters 将使用 Date#getUTC* 和 Date#setUTC* 方法而不是 Date#get* 和 Date#set* 方法。
dayjs.utc().seconds(30).valueOf()// => new Date().setUTCSeconds(30)
dayjs.utc().seconds()// => new Date().getUTCSeconds()

//所有的 Day.js 对象都是不可变的。 但如果有必要，使用 dayjs#clone 可以复制出一个当前对象。
var a = dayjs()
var b = a.clone()
// a 和 b 是两个独立的 Day.js 对象
```
## 取值/赋值
在设计上 Day.js 的 getter 和 setter 使用了相同的 API，也就是说，不传参数调用方法即为 getter，调用并传入参数为 setter。

这些 API 调用了对应原生 Date 对象的方法。
```js
dayjs().second(30).valueOf() // => new Date().setSeconds(30)
dayjs().second() // => new Date().getSeconds()

dayjs.utc().seconds(30).valueOf()// => new Date().setUTCSeconds(30)
dayjs.utc().seconds()// => new Date().getUTCSeconds()

dayjs().get(unit) === dayjs()[unit]()
dayjs().get('second') === dayjs().second()

dayjs().set(unit, value) === dayjs()[unit](value)
dayjs().set('second', 30) === dayjs().second(30)

// 返回传入的 Day.js 实例中的最大的 (即最靠近未来的)。 
// 它接受传入多个 Day.js实例或一个数组。依赖 MinMax 插件
dayjs.extend(minMax)
dayjs.max(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'))
dayjs.max([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')])

// 返回传入的 Day.js 实例中的最小的 (即最靠近过去的)。 
// 它接受传入多个 Day.js实例或一个数组。依赖 MinMax 插件
dayjs.extend(minMax)

dayjs.min(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'))
dayjs.min([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')])
```
## 操作
```js
//add:增加 subtract：减去 startOf：设置到一个时间的开始 endOf：结束
dayjs('2019-01-25').add(1, 'day').subtract(1, 'year').startOf('year').endOf('month').toString()

//返回一个在当前时区模式下的 Day.js 对象。
// utc(true) 传入 true 将只改变 UTC 模式而不改变本地时间。
dayjs.extend(utc)
var a = dayjs.utc()
a.format() // 2019-03-06T00:00:00Z
a.local().format() //2019-03-06T08:00:00+08:00
```
## 显示

```js
dayjs().format() 
// 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'

dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') 
// 'YYYYescape 2019-01-25T00:00:00-02:00Z'

dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'

//返回指定单位下两个日期时间之间的差异。默认毫秒，
// month：以月为单位。true：得到浮点数，而不是默认的整数
const date1 = dayjs('2019-01-25')
date1.diff('2018-06-05', 'month', true) // 7.645161290322581

//获取当前月份包含的天数。
dayjs('2019-01-25').daysInMonth() // 31

//获取原生的 Date 对象
dayjs('2019-01-25').toDate()

// 包含各个时间信息的 Array 。
dayjs.extend(toArray)
dayjs('2019-01-25').toArray() // [ 2019, 0, 25, 0, 0, 0, 0 ]

//序列化为 ISO 8601 格式的字符串
dayjs('2019-01-25').toJSON() // '2019-01-25T02:00:00.000Z'

// 返回包含时间信息的 Object。
dayjs.extend(toObject)
dayjs('2019-01-25').toObject()
/* { years: 2019,
     months: 0,
     date: 25,
     hours: 0,
     minutes: 0,
     seconds: 0,
     milliseconds: 0 } */

// 返回包含时间信息的 string 。
dayjs('2019-01-25').toString() // 'Fri, 25 Jan 2019 02:00:00 GMT'
```

## 查询

```js
dayjs().isBefore(dayjs('2011-01-01')) // 默认毫秒
dayjs().isBefore('2011-01-01', 'year')

dayjs().isAfter(dayjs('2011-01-01')) // 默认毫秒
dayjs().isAfter('2011-01-01', 'year')

dayjs().isSame(dayjs('2011-01-01')) // 默认毫秒
dayjs().isSame('2011-01-01', 'year')

dayjs.extend(isSameOrBefore)
dayjs().isSameOrBefore(dayjs('2011-01-01')) // 默认毫秒
dayjs().isSameOrBefore('2011-01-01', 'year')


dayjs.extend(isSameOrAfter)
dayjs().isSameOrAfter(dayjs('2011-01-01')) // 默认毫秒
dayjs().isSameOrAfter('2011-01-01', 'year')

dayjs.extend(isBetween)
dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25')) 
// 默认毫秒
dayjs().isBetween('2010-10-19', '2010-10-25', 'year')
// 第四个参数是设置包容性。 [ 表示包含。 ( 表示排除。
dayjs('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)')

dayjs.isDayjs(dayjs()) // true
dayjs.isDayjs(new Date()) // false
```
## 国际化

```js
require('dayjs/locale/de')
// import 'dayjs/locale/de' // ES 2015 

dayjs.locale('de') // 全局改变
dayjs().locale('de').format() // 只改变当前实例

dayjs.locale() // 'de'
```