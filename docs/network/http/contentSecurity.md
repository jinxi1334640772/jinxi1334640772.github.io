## 内容安全策略（CSP）
内容安全策略（CSP）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本（XSS）和数据注入攻击等。无论是数据盗取、网站内容污染还是恶意软件分发，这些攻击都是主要的手段。两种使用方式：
- 配置网络服务器返回 Content-Security-Policy HTTP 标头
  ```http
  //策略（policy）参数是一个包含了各种描述你的 CSP 策略指令的字符串。
  Content-Security-Policy: policy
  ```
- 配置`<meta>` 元素
  ```html
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />
  ```
CSP 通过指定有效域——即浏览器认可的可执行脚本的有效来源——使服务器管理者有能力减少或消除 XSS 攻击所依赖的载体。一个 CSP 兼容的浏览器将会仅执行从白名单域获取到的脚本文件，忽略所有的其他脚本（包括内联脚本和 HTML 的事件处理属性）。

作为一种终极防护形式，始终不允许执行脚本的站点可以选择全面禁止脚本执行。

除限制可以加载内容的域，服务器还可指明哪种协议允许使用；比如（从理想化的安全角度来说），服务器可指定所有内容必须通过 HTTPS 加载。一个完整的数据安全传输策略不仅强制使用 HTTPS 进行数据传输，也为所有的 cookie 标记 secure 标识，并且提供自动的重定向使得 HTTP 页面导向 HTTPS 版本。网站也可以使用 Strict-Transport-Security HTTP 标头确保连接它的浏览器只使用加密通道。

策略由一系列策略指令所组成，每个策略指令都描述了针对某个特定资源的类型以及策略生效的范围。你的策略应当包含一个 default-src 策略指令，在其他资源类型没有符合自己的策略时应用该策略（有关完整列表，请查看 default-src 指令的描述）。
- 一个策略可以包含 default-src 或者 script-src 指令来防止内联脚本运行，并杜绝 eval() 的使用。
- 一个策略也可包含一个 default-src 或 style-src 指令去限制来自一个 `<style>` 元素或者 style 属性的內联样式。
- 对于不同类型的项目都有特定的指令，因此每种类型都可以有自己的指令，包括字体、frame、图像、音频和视频媒体、script 和 worker。
```http
//所有内容都要通过 SSL 方式获取，以避免攻击者窃听用户发出的请求。
Content-Security-Policy: default-src https://onlinebanking.jumbobank.com

//想要所有内容均来自站点的同一个源（不包括其子域名）
Content-Security-Policy: default-src 'self'

//style样式文件必须来自baidu.com
Content-Security-Policy: default-src 'self';style-src baidu.com

//允许内容来自信任的域名及其子域名（域名不必须与 CSP 设置所在的域名相同）
Content-Security-Policy: default-src 'self' *.trusted.com

//内容包含来自任何源的图片，但是限制音频或视频需从信任的资源提供者，
//所有脚本必须从特定主机服务器获取可信的代码。
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```
## 对策略进行测试
为降低部署成本，CSP 可以部署为仅报告（report-only）模式。在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。此外，仅报告标头可以用来测试对策略未来的修订，而不用实际部署它。
```http
// 指定你的策略，仅报告，不是强制限制
Content-Security-Policy-Report-Only: policy

//默认情况下，违规报告并不会发送。为启用发送违规报告，
//要指定 report-to 策略指令，并提供至少一个 URI 地址去递交报告：
Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi


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