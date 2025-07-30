---
title: DNS 预解析与预连接优化指南
description: 详解 DNS 预解析和预连接技术，包括实现方式、优势、应用场景及自动化解决方案
outline: deep
---

# 🔍 DNS 预解析与预连接优化指南

DNS 解析是网页加载过程中的重要环节，优化 DNS 解析过程可以显著提升网站性能和用户体验。本文详细介绍 DNS 预解析和预连接技术的原理、实现和最佳实践。

::: tip 📚 本章内容
全面了解 DNS 预解析和预连接技术，掌握实现方法和自动化工具，有效提升网站加载速度。
:::

## 1. DNS 预解析技术

### 1.1 基本概念

DNS 预解析是一种优化网页加载性能的技术。其基本概念是，在浏览器访问一个网页时，会提前解析该网页中包含的所有外部链接的域名，这样当需要请求这些外部资源时，DNS 查询已经完成，可以立即进行数据传输，而不需要等待 DNS 解析的时间。

### 1.2 技术优势

| 优势 | 说明 |
|------|------|
| **减少加载时间** | 通过预先解析域名，减少浏览器在请求资源时的等待时间，从而加快页面加载速度 |
| **提升用户体验** | 页面能够更快地呈现给用户，提高用户满意度 |
| **减轻服务器压力** | DNS 预解析分散了 DNS 服务器的查询压力，尤其是在高流量的网站上 |

### 1.3 实现类型

#### 1.3.1 显式预解析

开发者可以在 HTML 中使用 `<link rel="dns-prefetch">` 标签来显式指定要预解析的域名：

```html
<!-- 显式预解析 example.com 域名 -->
<link rel="dns-prefetch" href="https://example.com">
```

#### 1.3.2 隐式预解析

浏览器会自动对页面中引用的外部资源进行 DNS 预解析。这种方式不需要开发者额外添加代码，但无法控制预解析的优先级和范围。

### 1.4 应用场景

- **内容丰富的网站**：对于包含大量外部资源的网站，使用 DNS 预解析可以显著提升页面加载速度
- **移动应用优化**：在移动设备上，由于网络连接可能不稳定或较慢，DNS 预解析可以改善用户体验
- **多域名资源**：当网站从多个不同域名加载资源时，预解析这些域名可以减少总加载时间

### 1.5 潜在问题及解决方案

#### 1.5.1 资源浪费问题

如果预解析了不必要的域名，会浪费用户的带宽和计算资源。

**解决方法**：只对必要的域名进行预解析，避免对第三方广告或追踪脚本的域名进行预解析。

#### 1.5.2 隐私泄露问题

DNS 请求可能会被第三方监听，从而泄露用户访问的网站信息。

**解决方法**：使用 HTTPS 来加密 DNS 请求，或者使用 DNS over HTTPS (DoH) 来保护用户的隐私。

## 2. DNS 预连接技术

### 2.1 基本概念

DNS 预连接在 DNS 预解析的基础上更进一步，不仅解析域名，还会提前建立 TCP 连接和 TLS 握手（如果是 HTTPS），从而进一步减少资源加载时间。

### 2.2 实现方式

使用 `<link rel="preconnect">` 标签指定需要预连接的域名：

```html
<link rel="preconnect" href="https://lf-cdn-tos.bytescm.com">
```

### 2.3 预连接与预解析对比

| 特性 | DNS 预解析 | DNS 预连接 |
|------|-----------|-----------|
| **解析 DNS** | ✅ | ✅ |
| **建立 TCP 连接** | ❌ | ✅ |
| **完成 TLS 握手** | ❌ | ✅ |
| **资源消耗** | 低 | 中 |
| **性能提升** | 中 | 高 |
| **适用场景** | 大量域名 | 关键资源域名 |

### 2.4 最佳实践

- 对关键资源使用预连接，对次要资源使用预解析
- 限制预连接的数量（建议不超过 4-6 个），以避免消耗过多系统资源
- 确保预连接的域名确实会被使用，否则会浪费资源

## 3. 自动化 DNS 预解析实现

在实际项目中，可以通过自动化脚本检测并添加 DNS 预解析，特别是在使用构建工具如 Vite、Webpack 等的项目中。

### 3.1 项目配置

在 `package.json` 中添加构建后处理脚本：

```json
// package.json
"scripts": {
    "build": "vite build && node ./scripts/dns-prefetch.js"
}
```

### 3.2 自动化脚本实现

创建一个脚本，自动检测项目中的外部链接并添加 DNS 预解析标签：

```javascript
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
async function searchDomain() {
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
  await searchDomain();
  await insertLinks();
}

main();
```

### 3.3 脚本工作原理

1. **检测外部链接**：遍历构建后的所有 HTML、CSS 和 JS 文件，提取所有外部域名
2. **去重处理**：使用 Set 数据结构确保每个域名只添加一次
3. **生成预解析标签**：为每个检测到的域名创建 `<link rel="dns-prefetch">` 标签
4. **插入 HTML**：将生成的标签插入到每个 HTML 文件的 `<head>` 部分

## 4. 高级优化策略

### 4.1 结合使用预解析和预连接

对于关键资源，可以同时使用预解析和预连接：

```html
<!-- 对关键资源同时使用预解析和预连接 -->
<link rel="dns-prefetch" href="https://critical-resource.com">
<link rel="preconnect" href="https://critical-resource.com">
```

### 4.2 跨域资源优化

对于跨域资源，特别是字体和大型媒体文件，预连接可以显著提升加载性能：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 4.3 与其他资源提示结合

结合其他资源提示如 `preload`、`prefetch` 等，可以进一步优化资源加载：

```html
<!-- 预连接字体资源 -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<!-- 预加载关键字体 -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" as="style">
```

## 5. 性能测量与验证

### 5.1 验证预解析效果

可以使用 Chrome DevTools 的 Network 面板观察 DNS 解析时间的变化：

1. 打开 Chrome DevTools (F12)
2. 切换到 Network 面板
3. 勾选 "DNS Lookup" 列
4. 比较添加预解析前后的 DNS 查询时间

### 5.2 性能指标监测

监测以下指标来评估 DNS 优化效果：

- **TTFB (Time To First Byte)**：首字节时间
- **DCL (DOMContentLoaded)**：DOM 内容加载完成时间
- **LCP (Largest Contentful Paint)**：最大内容绘制时间

## 6. 参考资源

- [MDN Web Docs: dns-prefetch](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel/dns-prefetch)
- [MDN Web Docs: preconnect](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel/preconnect)
- [Web.dev: 预加载关键资源](https://web.dev/preconnect-and-dns-prefetch/)
- [阿里云开发者社区文章](https://developer.aliyun.com/article/1375871)