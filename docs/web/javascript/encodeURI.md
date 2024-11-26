## encodeURI

encodeURI() 函数通过将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码（只有由两个“代理”字符组成的字符会被编码为四个转义序列）。会替换所有的字符，但不包括以下字符，即使它们具有适当的 UTF-8 转义序列：
|类型|包含|
|----|----|
|保留字符|`; , / ? : @ & = + $`|
|非转义字符|`字母 数字 - _ . ! ~ * ' ( )`|
|数字符号|`#`|

> encodeURI 自身无法产生能适用于 HTTP GET 或 POST 请求的 URI，例如对于 XMLHTTPRequests，因为 "&", "+", 和 "=" 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符。然而 encodeURIComponent 这个方法会对这些字符编码。

```js
// 编码高 - 低位完整字符 ok
console.log(encodeURI("\uD800\uDFFF"));

// 编码单独的高位字符抛出 "Uncaught URIError: URI malformed"
console.log(encodeURI("\uD800"));

// 编码单独的低位字符抛出 "Uncaught URIError: URI malformed"
console.log(encodeURI("\uDFFF"));

/**如果 URL 需要遵循较新的RFC3986标准，那么方括号是被保留的 (给 IPv6)，因此对于那些没有被编码的 URL 部分 (例如主机)，可以使用下面的代码： */
function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]");
}
```

## decodeURI()

解码由 encodeURI 编码过后的 URI

```js
const uri = "https://mozilla.org/?x=шеллы";
const encoded = encodeURI(uri);
console.log(encoded);
// Expected output: "https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"

try {
  console.log(decodeURI(encoded));
  // Expected output: "https://mozilla.org/?x=шеллы"
} catch (e) {
  // Catches a malformed URI
  console.error(e);
}
```

## encodeURIComponent()

将特定字符的每个实例替换成代表字符的 UTF-8 编码的一个、两个、三个或四个转义序列来编码 URI（只有由两个“代理”字符组成的字符会被编码为四个转义序列）。与 encodeURI() 相比，此函数会编码更多的字符，包括 URI 语法的一部分。

> 转义除了如下所示外的所有字符：**A-Z a-z 0-9 - \_ . ! ~ \* ' ( )**

encodeURIComponent() 和 encodeURI 有以下几个不同点：

```js
var set1 = ";,/?:@&=+$"; // 保留字符
var set2 = "-_.!~*'()"; // 不转义字符
var set3 = "#"; // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (空格被编码为 %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (空格被编码为 %20)
```

为了避免服务器收到不可预知的请求，对任何用户输入的作为 URI 部分的内容你都需要用 encodeURIComponent 进行转义。比如，一个用户可能会输入"Thyme &time=again"作为 comment 变量的一部分。如果不使用 encodeURIComponent 对此内容进行转义，服务器得到的将是 comment=Thyme%20&time=again。请注意，"&"符号和"="符号产生了一个新的键值对，所以服务器得到两个键值对（一个键值对是 comment=Thyme，另一个则是 time=again），而不是一个键值对

对于 application/x-www-form-urlencoded (POST) 这种数据方式，空格需要被替换成 '+'，所以通常使用 encodeURIComponent 的时候还会把 "%20" 替换为 "+"。

## decodeURIComponent()

解码由 encodeURIComponent 方法或者其他类似方法编码过后的 URI

```js
decodeURIComponent("JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B");
// "JavaScript_шеллы"

//捕获异常
try {
  var a = decodeURIComponent("%E0%A4%A");
} catch (e) {
  console.error(e);
}
// URIError: malformed URI sequence
```
