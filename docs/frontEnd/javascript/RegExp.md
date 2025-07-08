---
title: JavaScript 正则表达式 - RegExp
description: 详细介绍 JavaScript 中的正则表达式，包括 RegExp 对象的创建、实例属性和方法、断言、原子、转义序列以及字符串的正则方法
outline: deep
---

# JavaScript 正则表达式 - RegExp

正则表达式是一种强大的文本匹配工具，用于在字符串中查找、匹配和替换特定的模式。JavaScript 提供了 RegExp 对象来创建和使用正则表达式。

## 基本概念

RegExp 对象用于创建正则表达式，该对象用于文本与一个模式匹配。正则表达式可以用于：

- 验证输入格式（如邮箱、电话号码）
- 查找和替换文本
- 提取特定信息
- 分割字符串

## 创建正则表达式

可以使用字面量、构造函数和工厂方法来创建正则表达式：

```javascript
/**
 * @param {string|RegExp} pattern - 正则表达式的文本，也可以是另一个 RegExp 对象或文字
 * @param {string} flags - 添加的标志的字符串
 *   g: 全局匹配
 *   i: 忽略大小写
 *   m: 多行匹配
 *   y: 粘性匹配，从 lastIndex 后开始匹配
 *   s: 点号匹配所有字符，也可以匹配新行
 *   d: 包含每个捕获组子字符串开始和结束的索引
 *   u: 开启 Unicode 匹配模式
 *   v: u 的升级版本
 */

// 字面量语法
/pattern/flags

// 构造函数语法
new RegExp(pattern[, flags])

// 工厂方法语法
RegExp(pattern[, flags])
```

### 创建示例

```javascript
// 字面量方式
const regex1 = /hello/gi;

// 构造函数方式
const regex2 = new RegExp("hello", "gi");

// 工厂方法方式
const regex3 = RegExp("hello", "gi");

// 使用变量创建
const pattern = "hello";
const regex4 = new RegExp(pattern, "gi");
```

## 实例属性

RegExp 实例具有以下属性：

| 属性 | 描述 |
|------|------|
| `dotAll` | 是否启用 `s` 修饰符，匹配任意单个字符 |
| `flags` | 返回当前正则表达式的所有标志 |
| `global` | 是否启用 `g` 修饰符，全局匹配 |
| `ignoreCase` | 是否启用 `i` 修饰符，忽略大小写 |
| `multiline` | 是否启用 `m` 修饰符，多行匹配 |
| `sticky` | 是否启用 `y` 修饰符，粘性匹配 |
| `unicode` | 是否启用 `u` 修饰符，Unicode 匹配 |
| `unicodeSets` | 是否启用 `v` 修饰符，Unicode 集合 |
| `hasIndices` | 是否启用 `d` 修饰符，包含索引信息 |
| `lastIndex` | 开启 `g`/`y` 匹配时，保存上次匹配成功后的位置 |

### hasIndices 示例

```javascript
const str1 = "foo bar foo";

const regex1 = /foo/dg;
console.log(regex1.hasIndices); // true
console.log(regex1.exec(str1).indices[0]); // [0, 3]
console.log(regex1.exec(str1).indices[0]); // [8, 11]

const regex2 = /foo/;
console.log(regex2.hasIndices); // false
console.log(regex2.exec(str1).indices); // undefined
```

## 实例方法

### test()

测试正则表达式与指定字符串是否匹配，返回布尔值。

::: warning 注意
如果正则表达式设置了全局标志，`test()` 的执行会改变正则表达式的 `lastIndex` 属性。连续执行 `test()` 方法，后续的执行将会从 `lastIndex` 处开始匹配字符串。
:::

```javascript
const str = "table football";

const regex = new RegExp("foo*");
const globalRegex = new RegExp("foo*", "g");

console.log(regex.test(str)); // true

console.log(globalRegex.lastIndex); // 0
console.log(globalRegex.test(str)); // true
console.log(globalRegex.lastIndex); // 9
console.log(globalRegex.test(str)); // false
```

### exec()

返回一个结果数组或 `null`。当正则表达式设置 `g` 标志位时，可以多次执行 `exec` 方法来查找同一个字符串中的成功匹配。

```javascript
const regex1 = RegExp("foo*", "g");
const str1 = "table football, foosball";
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  // "Found foo. Next starts at 9."
  // "Found foo. Next starts at 19."
}
```

### toString()

返回正则表达式的字符串表示，会合并 flags：

```javascript
const myExp = new RegExp("a+b+c", "gi");
console.log(myExp.toString()); // "/a+b+c/gi"
```

## 断言（Assertions）

断言是一种结构，用于测试字符串在指定位置是否满足特定条件，但不消耗字符。断言不能使用量词。

### 断言类型

| 断言 | 语法 | 描述 |
|------|------|------|
| 前瞻断言 | `(?=variant)` | 后面紧跟 variant |
| 前瞻否定断言 | `(?!variant)` | 后面不能是 variant |
| 后瞻断言 | `(?<=variant)` | 前面紧跟 variant |
| 后瞻否定断言 | `(?<!variant)` | 前面不能是 variant |
| 输入边界断言 | `^` `$` | 正则开始、结束 |
| 单词边界断言 | `\b` `\B` | 单词边界、非边界 |

### 断言示例

```javascript
// 前瞻断言：匹配后面跟着数字的字母
const regex1 = /[a-z]+(?=\d)/;
console.log(regex1.test("abc123")); // true
console.log(regex1.test("abc")); // false

// 前瞻否定断言：匹配后面不跟数字的字母
const regex2 = /[a-z]+(?!\d)/;
console.log(regex2.test("abc123")); // false
console.log(regex2.test("abc")); // true

// 后瞻断言：匹配前面是数字的字母
const regex3 = /(?<=\d)[a-z]+/;
console.log(regex3.test("123abc")); // true
console.log(regex3.test("abc")); // false

// 单词边界
const regex4 = /\bword\b/;
console.log(regex4.test("word")); // true
console.log(regex4.test("sword")); // false
```

## 原子（Atoms）

原子是正则表达式的最基本单位。每个原子消耗字符串中的一个或多个字符，要么匹配失败，要么允许模式继续匹配下一个原子。

### 原子类型

| 原子 | 描述 | 示例 |
|------|------|------|
| 反向引用 | `\1` `\2` | 匹配先前匹配的、用捕获组捕获的子模式 |
| 字符类 | `[...]` `[^...]` | 匹配字符集中的任何字符 |
| 字符类转义 | `\d` `\D` `\w` `\W` `\s` `\S` | 匹配预定义字符集中的任何字符 |
| 字符转义 | `\n` `\u{...}` | 匹配可能无法方便地以字面形式表示的字符 |
| 字面字符 | `a` `b` `c` | 匹配特定字符 |
| 捕获组 | `(variant)` | 匹配子模式并保存匹配信息 |
| 具名捕获组 | `(?<name>...)` | 匹配子模式并保存匹配信息，可用自定义名称识别 |
| 具名反向引用 | `\k<name>` | 匹配先前匹配的子模式，使用已命名的捕获组 |
| 非捕获分组 | `(?:...)` | 匹配子模式，但不记忆匹配信息 |
| Unicode 字符类转义 | `\p{...}` `\P{...}` | 匹配 Unicode 属性指定的字符集 |
| 通配符 | `.` | 匹配除行结束符外的任何字符 |
| 逻辑或 | `\|` | 匹配由 \| 字符分隔的一组备选字符中的任意一个 |
| 量词 | `?` `+` `*` `{n}` `{n,}` `{n,m}` | 指定匹配的次数 |

### 量词示例

::: info 贪婪与非贪婪
默认情况下，量词是贪婪的，这意味着它们会尝试尽可能多地匹配。你可以在量词后面添加 `?`，使其成为非贪婪量词。
:::

```javascript
/a*/.exec("aaa"); // ['aaa'] - 整个输入被消耗
/a*?/.exec("aaa"); // [''] - 可以不消耗任何字符，但仍能成功匹配
/^a*?$/.exec("aaa"); // ['aaa'] - 不可能消耗更少的字符而仍然匹配成功
/a*?$/.exec("aaa"); // ['aaa'] - 在第一个字符处已经匹配成功

// [ab]+ 首先贪婪地匹配了 "abb"，但 [abc]c 无法匹配模式的其余部分（"c"）
// 因此量词被简化为只匹配 "ab"
/[ab]+[abc]c/.exec("abbc"); // ['abbc']
```

### Unicode 属性示例

```javascript
const sentence = "A ticket to 大阪 costs ¥2000 👌.";

// 匹配 Emoji
console.log(sentence.match(/\p{Emoji_Presentation}/gu));
// ["👌"]

// 匹配非拉丁字符
console.log(sentence.match(/\P{Script_Extensions=Latin}+/gu));
// [" ", " ", " 大阪 ", " ¥2000 👌."]

// 匹配货币符号和标点
console.log(sentence.match(/\p{Sc}|\p{P}/gu));
// ["¥", "."]
```

## 转义序列

在正则表达式中，转义序列是指任何一种由 `\` 后跟一个或多个字符组成的语法。

### 转义序列表

| 转义序列 | 含义 |
|----------|------|
| `\b` | 单词边界 |
| `\B` | 非单词边界 |
| `\s` | 空白字符 |
| `\S` | 非空白字符 |
| `\d` | 0-9 数字 |
| `\D` | 非数字 |
| `\w` | 字母数字下划线 |
| `\W` | 非字母数字下划线 |
| `\p` | 代表具有指定 Unicode 属性的字符 |
| `\P` | 不具有指定 Unicode 类型的 Unicode 字符类转义 |
| `\c` | 控制字符的字符转义，后跟从 A 到 Z 或从 a 到 z 的字母 |
| `\f` | 分页符 |
| `\k` | 具名反向引用，后跟 `<名称>` |
| `\n` | 换行符 |
| `\r` | 回车符 |
| `\t` | 水平制表符 |
| `\v` | 垂直制表符 |
| `\x` | 后跟 2 个十六进制数字，表示具有给定值的字符 |
| `\q` | 仅在 v 模式字符类中有效；表示要按字面匹配的字符串 |

## 字符串的正则方法

字符串对象提供了多个与正则表达式配合使用的方法。本质上，这些方法会把参数解析为正则对象，然后调用正则的对应方法。

### match()

查找字符串中与正则表达式匹配的内容。

::: warning 返回值差异
- 当正则表达式没有 `g` 修饰符时，只匹配第一个匹配项以及其捕获分组，返回包含 `index` 和 `input` 属性的数组
- 有 `g` 修饰符时，返回所有匹配项的数组，但捕获组会被忽略，且没有 `index` 和 `input` 属性
:::

```javascript
const string = "zhangjinxi";

// 不带 g 修饰符
const result1 = string.match(/zhang(jin)(xi)/);
console.log(result1);
// ["zhangjinxi", "jin", "xi", index: 0, input: "zhangjinxi", groups: undefined]

// 带 g 修饰符
const result2 = "test1test2".match(/test\d/g);
console.log(result2);
// ["test1", "test2"]

// 匹配失败时返回 null
const result3 = string.match(/notfound/);
console.log(result3); // null
```

### matchAll()

返回一个迭代器，该迭代器包含了检索字符串与正则表达式进行匹配的所有结果（包括捕获组）。

::: tip 使用建议
`matchAll()` 方法需要使用带有 `g` 标志的正则表达式，否则会抛出 TypeError。
:::

```javascript
const regexp = /t(e)(st(\d?))/g;
const str = "test1test2";

// 使用 matchAll
console.log([...str.matchAll(regexp)]);
// [
//   ["test1", "e", "st1", "1", index: 0, input: "test1test2", groups: undefined],
//   ["test2", "e", "st2", "2", index: 5, input: "test1test2", groups: undefined]
// ]

// 对比 match 方法
console.log(str.match(regexp));
// ["test1", "test2"] - 只有匹配项，没有捕获组

// 不带 g 修饰符的 match
console.log(str.match(/t(e)(st(\d?))/));
// ["test1", "e", "st1", "1", index: 0, input: "test1test2", groups: undefined]
```

### search()

返回正则表达式在字符串中首次匹配项的索引，如果没有找到匹配项，则返回 -1。

::: info 特点
`search()` 方法忽略 `g` 修饰符，返回结果和 `string.indexOf()` 方法类似。
:::

```javascript
const string = "zhangjinxi";

console.log(string.search(/jin/)); // 5
console.log(string.search(/notfound/)); // -1
console.log(string.search("jin")); // 5 - 字符串会被转换为正则表达式
```

### split()

使用正则表达式或字符串分隔符将字符串分割成数组。

```javascript
/**
 * @param {string|RegExp} separator - 分隔符
 * @param {number} limit - 保留的数组的长度
 */
string.split(separator, limit);

const string = "apple,banana;orange:grape";

// 使用字符串分隔符
console.log(string.split(",")); // ["apple", "banana;orange:grape"]

// 使用正则表达式分隔符
console.log(string.split(/[,;:]/)); // ["apple", "banana", "orange", "grape"]

// 限制返回数组长度
console.log(string.split(/[,;:]/, 2)); // ["apple", "banana"]
```

### replace()

使用正则表达式和替换字符串替换匹配的子字符串。

::: info 全局替换
如果正则表达式不添加 `g` 修饰符，默认只匹配第一个。
:::

```javascript
/**
 * @param {string|RegExp} searchValue - 搜索值
 * @param {string|Function} replaceValue - 替换值或替换函数
 */
string.replace(searchValue, replaceValue);

const string = "hello world hello";

// 字符串替换
console.log(string.replace("hello", "hi")); // "hi world hello"

// 正则替换（全局）
console.log(string.replace(/hello/g, "hi")); // "hi world hi"

// 使用函数替换
console.log(string.replace(/hello/g, (match, index, original) => {
  return `${match.toUpperCase()}(${index})`;
}));
// "HELLO(0) world HELLO(12)"
```

### 替换字符串中的特殊模式

| 模式 | 描述 |
|------|------|
| `$&` | 最近一次匹配项 |
| `$n` | 匹配到的第 n 个分组 |
| `$`` | 匹配项之前的文本 |
| `$'` | 匹配项之后的文本 |

```javascript
const string = "2023-12-25";

// 日期格式化示例
const formatted = string.replace(/(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1");
console.log(formatted); // "12/25/2023"

// 使用 $& 引用整个匹配
const highlighted = "hello world".replace(/world/, "[$&]");
console.log(highlighted); // "hello [world]"
```

## 实际应用示例

### 找出连续重复最多的字符

```javascript
function findMaxRepeatedChar(str) {
  let maxLength = 0;
  let maxValue = "";
  
  str.replace(/(\w)\1+/g, (match, char) => {
    if (match.length > maxLength) {
      maxLength = match.length;
      maxValue = char;
    }
  });
  
  return { char: maxValue, count: maxLength };
}

console.log(findMaxRepeatedChar("aabbbcccc")); // { char: "c", count: 4 }
```

### 邮箱验证

```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

console.log(validateEmail("user@example.com")); // true
console.log(validateEmail("invalid-email")); // false
```

### 手机号码格式化

```javascript
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
}

console.log(formatPhoneNumber("13812345678")); // "138-1234-5678"
```

### 提取 URL 参数

```javascript
function getURLParams(url) {
  const params = {};
  const regex = /[?&]([^=]+)=([^&]*)/g;
  let match;
  
  while ((match = regex.exec(url)) !== null) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  
  return params;
}

const url = "https://example.com?name=John&age=30&city=New%20York";
console.log(getURLParams(url)); // { name: "John", age: "30", city: "New York" }
```

## 总结

JavaScript 正则表达式是一个强大的文本处理工具：

- **RegExp 对象** 提供了创建和使用正则表达式的完整功能
- **丰富的语法** 支持各种匹配模式，包括断言、原子、量词等
- **字符串方法** 与正则表达式完美结合，提供了灵活的文本处理能力
- **实际应用** 广泛用于数据验证、文本解析、格式化等场景

掌握正则表达式能够大大提高文本处理的效率，是前端开发者必备的技能之一。在使用时要注意性能优化，避免过于复杂的正则表达式影响程序性能。
