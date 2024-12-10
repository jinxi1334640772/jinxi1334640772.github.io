## 权限策略

权限策略为网站开发人员提供了明确声明哪些特性可以或不可以在网站上使用的机制。定义一组“策略”，限制网站代码可以访问哪些 API，或者修改浏览器对某些特性的默认行为。这使你能够执行最佳做法（即使是在代码库的发展过程中），也可以更安全地编排第三方内容。

> 权限策略曾经被称为特性策略（Feature Policy）
> 权限策略与内容安全策略相似，但是它控制的是特性而非安全行为。使用权限策略可以做什么：

- 改变手机和第三方视频自动播放的默认行为。
- 限制网站使用相机、麦克风、扬声器等敏感设备。
- 允许 iframe 使用全屏 API。
- 如果项目在视口中不可见，则停止对其进行脚本处理，以提高性能。

网络提供的特性和 API，如果被滥用，可能会有隐私或安全风险。在这种情况下，你可能希望严格限制特性在网站上的使用方式。在每一种情况下，都应该有一种直观的或非破坏性的方法，让网络开发者检测和处理禁用某项特性的情况。一些方法包括：

- 对于需要用户权限授予的 JavaScript API，会返回“权限拒绝”。
- 提供某些特性的 JavaScript API 返回 false 值或抛出一个错误。
- API 甚至没有对外暴露，好像它们不存在一样。
- 控制特性行为的选项有不同的默认值。

权限策略允许你控制哪些源可以使用哪些特性，无论是在顶层页面还是在嵌入的 `<iframe>` 中。其目的是为良好的用户体验执行最佳实践，并对敏感或强大的特性（指在执行相关代码之前需要用户明确许可使用的特性）提供细化控制。

权限策略提供两种指定策略的方法：

- `Permissions-Policy HTTP 标头`，控制收到的响应和页面内任何嵌入的内容
- `<iframe> 的 allow 属性`，控制在特定 `<iframe>` 中使用的特性。

为了控制每个特性，会撰写包含以下这些方面的策略：

- 指令确定了要控制的特性名称。
- 允许列表是该特性应该被控制的源列表。你可以为所有或特定的源启用一种特性，或者阻止它在所有源中的使用。

## 与权限 API 的关系

权限策略和权限 API 密切相关，但又有所不同。由这两种技术控制其权限的特性是重叠的。

- 权限策略允许服务器设置某项特性是否可以在特定的文档中使用（或在文档中嵌入`<frame>`）。
- 权限 API 根据用户授予的权限对特性的访问进行把关。这些特性被记录在权限注册表中。

每种特性使用的识别字符串在两者之间保持一致，例如，geolocation 代表地理位置 API。权限注册表中的大多数 API 特性也有相应的权限策略指令。一个例外是通知 API。

一般来说，当权限策略阻止使用一个强大的特性时，用户甚至不会被要求获得使用权限，而权限 API query() 方法将返回 state 值为 denied。

## 允许列表

一个允许列表是一系列源的列表，配置某权限在哪些域上可用。它采取一个或多个包含在括号中的下列值，用空格隔开：

- `*`：该特性将被允许在本文档和所有嵌套浏览上下文中使用，无论其源如何。
- `()`：该特性在顶层和嵌套浏览环境中被禁用。等价的 `<iframe>` 的 allow 属性值是 'none'。
- `self`：该特性只允许在本文档和同一来源的所有嵌套浏览环境中使用。
- `src`：只要载入该框架的文件与该框架 src 属性中的 URL 来源相同，该特性在该 `<iframe>` 中就被允许。这个值只用于 `<iframe>` 的 allow 属性，并且是默认 allowlist 值。
- `"<origin>"`：该特性允许用于特定的源。源应该用空格隔开。请注意，`<iframe>` allow 属性中的源是不加引号的。

值 \* 和 () 只能单独使用，而 self 和 src 可以与一个或多个源结合使用。在支持的情况下，你可以在权限策略源中包括通配符。这意味着你不必在允许列表中明确指定几个不同的子域，而是可以用通配符在一个单一的源中指定它们。

```http
("https://example.com" "https://*.example.com")

// 匹配以下origin
("https://example.com" "https://a.example.com" "https://b.example.com" "https://c.example.com")
```

允许列表示例：

- `*`
- `()`
- `(self)`
- `(src)`
- `("https://a.example.com")`
- `("https://a.example.com" "https://b.example.com")`
- `(self "https://a.example.com" "https://b.example.com")`
- `(src "https://a.example.com" "https://b.example.com")`
- `("https://\*.example.com")`

## 权限特性标头语法

```http
Permissions-Policy: <directive>=<allowlist>

//要阻止对地理位置信息的访问
Permissions-Policy: geolocation=()

//允许一部分源访问
Permissions-Policy: geolocation=(self "https://a.example.com" "https://b.example.com")

```

通过发送带有逗号分隔的策略列表的标头，或者通过为每个策略发送单独的标头，可以同时控制几种特性。例如，以下这些是等价的：

```http
Permissions-Policy: picture-in-picture=(), geolocation=(self https://example.com), camera=*;

Permissions-Policy: picture-in-picture=()
Permissions-Policy: geolocation=(self https://example.com)
Permissions-Policy: camera=*
```

## 限制 iframe

### 权限策略

对于一个`<iframe>` 来说，**_其允许的源也必须在父页面的允许列表中_**。由于这种继承行为，最好在 HTTP 头中指定最广泛的可接受的特性支持，然后在每个 `<iframe>` 中指定你需要的支持子集。

```html
<iframe src="<origin>" allow="<directive> <allowlist>"></iframe>

<!-- 阻止对地理位置信息的访问 -->
<iframe src="https://example.com" allow="geolocation 'none'"></iframe>

<!-- 允许当前的源和指定源访问地理位置 -->
<iframe
  src="https://example.com"
  allow="geolocation 'self' https://a.example.com https://b.example.com"></iframe>

<!-- 分号分隔的策略指令列表，可以同时控制多个特性。 -->
<iframe
  src="https://example.com"
  allow="geolocation 'self' https://a.example.com https://b.example.com; fullscreen 'none'"></iframe>
```

### 限制操作

一个恶意的 `<iframe>` 可以伤害用户，比如启动弹出窗口或将顶级页面重定向到恶意域。通过 sandbox 属性，可以遏制这些风险，可以将加载的内容限制在由属性定义的规则内，用以防止嵌入的内容滥用功能。当值为空字符串时，策略是最严格的。

```html
<!-- 允许嵌入的网页运行脚本： -->
<iframe src="https://example.com" sandbox="allow-scripts"></iframe>
```

## 权限策略指令集合

- `accelerometer`
- `ambient-light-sensor`
- `attribution-reporting`
- `autoplay`
- `bluetooth`
- `browsing-topics`
- `camera`
- `compute-pressure`
- `display-capture`
- `document-domain`
- `encrypted-media`
- `fullscreen`
- `gamepad`
- `geolocation`
- `gyroscope`
- `hid`
- `identify-credentials-get`
- `idle-detection`
- `local-fonts`
- `magnetometer`
- `microphone`
- `midi`
- `otp-credentials`
- `payment`
- `poctrue-in-picture`
- `publickey-credentials-create`
- `publickey-credentials-get`
- `screen-wake-lock`
- `serial`
- `speaker-selection`
- `storage-access`
- `usb`
- `web-share`
- `window-management`
- `xr-spatial-tracking`
