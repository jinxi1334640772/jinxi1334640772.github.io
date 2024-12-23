# DNS 预解析 & 预连接

## DNS 预解析

> DNS 预解析是一种优化网页加载性能的技术。其基本概念是，在浏览器访问一个网页时，会提前解析该网页中包含的所有外部链接的域名，这样当需要请求这些外部资源时，DNS 查询已经完成，可以立即进行数据传输，而不需要等待 DNS 解析的时间。

**优势有：**

- 减少加载时间：通过预先解析域名，减少了浏览器在请求资源时的等待时间，从而加快页面加载速度
- 提升用户体验：页面能够更快地呈现给用户，提高了用户的满意度。
- 减轻服务器压力：DNS 预解析分散了 DNS 服务器的查询压力，尤其是在高流量的网站上。

**有两种类型：**

- 显式预解析：开发者可以在 HTML 中使用`<link rel="dns-prefetch">`标签来显式指定要预解析的域名。
- 隐式预解析：浏览器会自动对页面中引用的外部资源进行 DNS 预解析。

**应用场景：**

- 网站优化：对于内容丰富的网站，使用 DNS 预解析可以显著提升页面加载速度。
- 移动应用：在移动设备上，由于网络连接可能不稳定或较慢，DNS 预解析可以改善用户体验。

**存在的问题**

- 资源浪费：如果预解析了不必要的域名，会浪费用户的带宽和计算资源

  > 解决方法：只对必要的域名进行预解析，避免对第三方广告或追踪脚本的域名进行预解析。

- 隐私泄露：DNS 请求可能会被第三方监听，从而泄露用户访问的网站信息。

  > 解决方法：使用 HTTPS 来加密 DNS 请求，或者使用 DNS over HTTPS (DoH) 来保护用户的隐私。

```html
<!-- 显式预解析example.com域名 -->
<link rel="dns-prefetch" href="https://example.com" />
```

## DNS 预连接

> 启用预连接，会在 DNS 预解析之后，提前建立 HTTP 连接，可以更快的加载资源。

```html
<link rel="preconnect" href="https://lf-cdn-tos.bytescm.com/" />
```

**项目中使用 DNS 预解析**

> 结合 vite + 查找项目中所有的引入的第三方外链

```json
// package.json
"scripts": {
    "build": "vite bulid && node ./scripts/dns-prefetch.js"
}
```

> 遍历打包后的 dist 目录中的所有 HTML、JS、CSS 文件，将所有外链的域名存起来，然后在 dist 目录下 index.html 文件的 head 标签中依次插入 link 标签，同时开启 DNS 预解析：

```js
// dns-prefetch.js
const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const { glob } = require("glob");
const urlRegex = require("url-regex");
// 获取外部链接的正则表达式
const urlPattern = /(https?:\/\/[^/]*)/i;
const urls = new Set();
// 遍历dist目录中的所有HTML、JS、CSS文件
async function searchDomin() {
  const files = await glob("dist/**/*.{html,css,js}");
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    const matches = source.match(urlRegex({ strict: true }));
    if (matches) {
      matches.forEach(url => {
        const match = url.match(urlPattern);
        if (match && match[1]) {
          urls.add(match[1]);
        }
      });
    }
  }
}

// 在index.html文件<head>标签中插入link标签
async function insertLinks() {
  const files = await glob("dist/**/*.html");
  const links = [...urls]
    .map(url => `<link rel="dns-prefetch" href="${url}" />`)
    .join("\n");

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const root = parse(html);
    const head = root.querySelector("head");
    head.insertAdjacentHTML("afterbegin", links);
    fs.writeFileSync(file, root.toString());
  }
}
async function main() {
  await searchDomin();
  await insertLinks();
}
main();
```

> 参考：https://developer.aliyun.com/article/1375871
