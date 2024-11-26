## querystring 模块

提供了用于解析和格式化网址查询字符串的实用工具。
querystring 比 `<URLSearchParams>` 性能更高，但不是标准化的 API。当性能不重要或需要与浏览器代码兼容时使用 `<URLSearchParams`>。

querystring.decode() 函数是 querystring.parse() 的别名。

> querystring.parse() 方法返回的对象不是原型继承自 JavaScript Object。这意味着 obj.toString()、obj.hasOwnProperty() 等典型的 Object 方法没有定义，将不起 ​​ 作用。

querystring.encode() 函数是 querystring.stringify() 的别名。

```js

/**
 * @str 要解析的网址查询字符串
 * @sep 用于在查询字符串中分隔键值对的子字符串。默认值：'&'。
 * @eq 用于分隔查询字符串中的键和值的子字符串。默认值：'='。
 * @options
 *  decodeURIComponent 当对查询字符串中的百分比编码字符进行解码时使用的函数。默认值：querystring.unescape()。
 *  maxKeys 指定要解析的最大键数，默认值100
 * @return
 */
querystring.parse(str[, sep[, eq[, options]]])
querystring.parse(
  'w=%D6%D0%CE%C4&foo=bar',
   null,
   null,
  { decodeURIComponent: gbkDecodeURIComponent });

/**
 * @obj
 * @sep
 * @eq
 * @options
 *  encodeURIComponent 当将网址不安全的字符转换为查询字符串中的百分比编码时使用的函数。默认值：querystring.escape()。
 */
querystring.stringify(obj[, sep[, eq[, options]]])

/**
 * 在给定的 str 上执行网址百分比编码字符的编码。
 */
querystring.escape(str)

/**
 * 在给定的 str 上执行网址百分比编码字符的解码。
 */
querystring.unescape(str)
```
