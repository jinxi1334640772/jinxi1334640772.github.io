## 内容安全策略（CSP）

内容安全策略（CSP）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等。无论是数据盗取、网站内容污染还是恶意软件分发，这些攻击都是主要的手段。两种使用方式：

- 配置网络服务器返回 Content-Security-Policy HTTP 标头

  ```http
  //policy:各种描述你的 CSP 策略指令的字符串。
  Content-Security-Policy: policy

  //所有内容均来自站点的同一个源（不包括其子域名）
  Content-Security-Policy: default-src 'self'
  ```

- 配置`<meta>` 元素

  ```html
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />

  <meta
    http-equiv="Content-Security-Policy"
    content="script-src 'self' 'unsafe-inline'" />
  ```

  CSP 通过指定有效域——即浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除 XSS 攻击所依赖的载体。

除限制可以加载内容的域，服务器还可指明哪种协议允许使用；比如可指定所有内容必须通过 HTTPS 加载。一个完整的数据安全传输策略不仅强制使用 HTTPS 进行数据传输，也为所有的 cookie 标记 secure 标识，并且提供自动的重定向使得 HTTP 页面导向 HTTPS 版本。网站也可以使用 Strict-Transport-Security 严格传输安全 HTTP 标头确保连接它的浏览器只使用加密通道。

策略由一系列策略指令所组成，每个策略指令都描述了针对某个特定资源的类型以及策略生效的范围。特定资源类型有：

- default-src 应当包含的指令，在其他资源类型没有符合自己的策略时应用该策略
- script-src 指定 JavaScript 的有效来源，包含内联脚本

  - unsafe-inline 可以执行内联脚本

  使用 unsafe-inline 可能会带来安全风险，因为它允许页面上的任何脚本执行未经检查的或未经签名的代码。在生产环境中应尽量避免使用 unsafe-inline，而是使用 nonce 或者哈希来指定可以安全执行的内联代码。这些方法提供了一种明确标记可执行代码的方式，从而减少 XSS 攻击的风险

  通过使用 nonce- 关键词，可以定义一个 nonce 随机值，仅允许具有正确 nonce 的内联脚本执行。当与 strict-dynamic 关键词结合使用时，带 nonce 的脚本可以从任何来源导入额外脚本。这种方法简化了开发人员的安全脚本加载，因为它允许他们信任一个带 nonce 的脚本，然后该脚本可以安全地加载其他必要资源

  - unsafe-eval 可以执行 eval()
  - strict-dynamic：严格的动态源代码表达式指定，通过使用 nonce 或 hash 将显式给予标记中存在的脚本的信任传播到该根脚本加载的所有脚本。同时，任何允许列表或源表达式（如“self”或“unsafe inline”）都将被忽略
  - report-sample: 要求在违规报告中包含违规代码的样本

- style-src 限制 `<style>` 元素或者 style 属性的內联样式。
- object-src 指定`<object>、<embed>和<applet>`元素的有效源
- connect-src 指定允许的连接源。用于控制网页通过脚本接口加载的链接地址，包括 AJAX、WebSocket 等网络通信方式 ‌
- frame-src 指定使用`<frame>`和`<iframe>`等元素加载嵌套浏览上下文的有效源，被 child-src 取代
- child-src
- frame-ancestors 指定可以嵌入当前页面的框架或页面的来源。
- img-src 指定图像和 favicon 的有效源
- media-src 指定使用`<audio>和<video>`元素加载媒体的有效源
- worker-src
- font-src 指定使用@font-face 加载的字体的有效来源。
- manifest-src 指定哪些 manifest 可以应用到资源。
- prefetch-src 指令指定可以预取或预呈现的有效源

```http
// 允许同源和内联脚本执行代码
Content-Security-Policy: script-src 'self' 'unsafe-inline'

//style样式文件必须来自baidu.com
Content-Security-Policy: default-src 'self';style-src baidu.com

//允许内容来自信任的域名及其子域名
Content-Security-Policy: default-src 'self' *.trusted.com

//内容包含来自任何源的图片，但是限制音频或视频需从信任的资源提供者，
//所有脚本必须从特定主机服务器获取可信的代码。
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src example.com

Content-Security-Policy: frame-ancestors example.com baidu.com
```

## 对策略进行测试

为降低部署成本，CSP 可以部署为仅报告（report-only）模式。在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。此外，仅报告标头可以用来测试对策略未来的修订，而不用实际部署它。

```http
// 指定你的策略，仅报告，不是强制限制
Content-Security-Policy-Report-Only: policy

//默认情况下，违规报告并不会发送。为启用发送违规报告，
//要指定 report-to 策略指令，并提供至少一个 URI 地址去递交报告：
Content-Security-Policy: default-src 'self'; report-uri example.com/collector.cgi


//该策略禁止任何资源的加载，除了来自 cdn.example.com 的样式表。
Content-Security-Policy: default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports

// <link rel="stylesheet" href="css/style.css" /> 报告的错误信息如下：
{
  "csp-report": {
    "blocked-uri": "http://example.com/css/style.css",
    "disposition": "report",
    "document-uri": "http://example.com/signup.html",
    "effective-directive": "style-src-elem",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-to /_/csp-reports",
    "referrer": "",
    "status-code": 200,
    "violated-directive": "style-src-elem"
  }
}
```

## 子资源完整性

尽管 CSP 是确保资源仅从可信来源加载的强大工具，但这些资源仍有可能被篡改。例如，脚本可能来自可信的 CDN，但如果该 CDN 遭到安全漏洞并且其脚本被入侵，那么任何使用这些脚本的网站都可能变得脆弱。

子资源完整性（Subresource Integrity, SRI）为这种风险提供了保护。通过在 `<script>` 和` <link>` 标签中使用 integrity 属性，网站可以指定资源的预期哈希值。如果接收的资源哈希值与预期的不匹配，浏览器将拒绝呈现该资源，从而保护网站免受潜在的受损内容

## X-Frame-Options 标头

X-frame-options 是一个HTTP响应头，控制页面是否可以嵌入其他源页面中。

- SAMEORIGIN，允许页面仅被同源网页嵌入
- DENY，完全阻止页面的嵌入。
- ALLOW-FRO，表示页面可以在指定来源的iframe中展示

大多数头配置为允许同源网站嵌入页面，以放松政策。可以防御iframe嵌套的点击劫持攻击。

## Clear-Site-Data 标头
允许网站轻松清除与其相关的浏览数据，包括 cookies、存储和缓存。这在用户登出时特别有用，确保认证令牌和其他敏感信息被移除，无法被滥用。头的值指定网站请求浏览器清除的数据类型。