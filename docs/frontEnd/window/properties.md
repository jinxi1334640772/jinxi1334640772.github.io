# Window 对象属性详解

Window 对象是浏览器中的全局对象，提供了许多属性和方法来操作浏览器窗口。本文档详细介绍了 Window 对象的各种属性及其用法。

> **参考资料：** [MDN - Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

## 1. 缓存和存储相关属性

### 1.1 caches

返回与当前上下文相关联的 `CacheStorage` 对象。此对象提供了诸如存储用于离线使用的资源，并生成对请求的自定义响应等功能。

```javascript
window.caches.open("v1").then((cache) => {
  return cache.match("/list");
});
```

### 1.2 cookieStore

> **注意：** 功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

返回当前文档上下文的 `CookieStore` 对象的引用，是 Cookie Store API 的入口点。

#### 主要方法

- `get()` - 通过 name 或 options 对象获取一个 cookie
- `getAll()` - 获取所有匹配的 cookie
- `set()` - 设置 cookie
- `delete()` - 删除 cookie
- `change事件` - 当 cookie 发生变更时触发

```javascript
const day = 24 * 60 * 60 * 1000;

cookieStore
  .set({
    name: "cookie1",
    value: "cookie1-value",
    expires: Date.now() + day,
    domain: "example.com",
  })
  .then(
    () => {
      console.log("设置成功！");
    },
    (reason) => {
      console.error("设置失败：", reason);
    }
  );
```

### 1.3 localStorage & sessionStorage

`localStorage` 和 `sessionStorage` 提供了在浏览器中存储数据的功能。

#### 区别

- **localStorage** - 数据可以长期保留
- **sessionStorage** - 数据在页面会话结束时被清除

#### 主要方法

- `length` - 返回存储项的数量
- `setItem(key, value)` - 设置存储项
- `getItem(key)` - 获取存储项
- `key(index)` - 返回指定位置的键名
- `removeItem(key)` - 删除指定存储项
- `clear()` - 清空所有存储项

```javascript
localStorage.setItem("myCat", "Tom");
let cat = localStorage.getItem("myCat");
localStorage.removeItem("myCat");
localStorage.clear();
```

## 2. 窗口状态和信息

### 2.1 closed

返回所引用的窗口是否已关闭。

```javascript
// 检查 opener 是否存在且未关闭
if (window.opener && !window.opener.closed) {
  window.opener.location.href = "https://www.mozilla.org";
}
```

### 2.2 name

获取/设置窗口的名称。窗口的名字主要用于为超链接和表单设置目标（targets）。

```javascript
window.name = "myWindow";
window.name = Symbol.for("foo").toString(); // "Symbol(foo)"
```

### 2.3 frameElement

返回嵌入窗口的元素，适用于任何嵌入点内嵌入的文档，包括 `<object>`、`<iframe>` 或 `<embed>`。

```javascript
const frameEl = window.frameElement;
// 如果我们处于嵌入状态，则将容器元素的 URL 更改为指定地址
if (frameEl) {
  frameEl.src = "https://mozilla.org/";
}
```

### 2.4 frames

一个类数组对象，列出了当前窗口的所有直接子窗口。

```javascript
const frames = window.frames;
for (let i = 0; i < frames.length; i++) {
  // 对每个 frame 进行操作
  frames[i].document.body.style.background = "red";
}
```

## 3. 窗口尺寸和位置

### 3.1 内部尺寸

#### innerWidth & innerHeight

- `innerWidth` - 窗口的内部宽度（包括垂直滚动条）
- `innerHeight` - 浏览器窗口的视口高度（包括水平滚动条）

```javascript
const frameHeight = window.innerHeight;
const frameWidth = window.innerWidth;

// 在 frameset 中的使用
const framesetHeight = parent.innerHeight; // 返回上一级 frameset 的视口高度
const outerFramesetHeight = top.innerHeight; // 返回最外部 frameset 的视口高度
```

#### outerWidth & outerHeight

- `outerWidth` - 整个浏览器窗口的宽度（包括侧边栏和窗口边框）
- `outerHeight` - 整个浏览器窗口的高度（包括侧边栏和窗口边框）

下面的示意图展示了 `outerHeight` 和 `innerHeight` 两者的不同：

![窗口尺寸示意图](firefoxinnervsouterheight2.png)

### 3.2 窗口位置

#### screenLeft & screenTop

- `screenLeft` (等同于 `screenX`) - 浏览器左边框到屏幕左边缘的距离
- `screenTop` (等同于 `screenY`) - 浏览器上边框到屏幕上边缘的距离

### 3.3 设备像素比

#### devicePixelRatio

返回当前显示设备的物理像素分辨率与 CSS 像素分辨率之比。

```javascript
// 在 Retina 屏幕上优化 Canvas 显示
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 设置显示尺寸（CSS 像素）
const size = 200;
canvas.style.width = size + "px";
canvas.style.height = size + "px";

// 设置实际尺寸（考虑像素密度）
const scale = window.devicePixelRatio;
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);

// 标准化坐标系统
ctx.scale(scale, scale);
```

监听设备像素比变化：

```javascript
const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;

const updatePixelRatio = () => {
  // 处理设备像素比变化的逻辑
};

matchMedia(mqString).addEventListener("change", updatePixelRatio);
```

## 4. 安全和上下文

### 4.1 isSecureContext

指示当前上下文是安全的（HTTPS）还是不安全的（HTTP）。

### 4.2 crossOriginIsolated

指示网站是否处于跨源隔离状态。当响应标头 `Cross-Origin-Opener-Policy` 为 `same-origin` 且 `Cross-Origin-Embedder-Policy` 为 `require-corp` 或 `credentialless` 时，网站处于跨源隔离状态。

```javascript
const myWorker = new Worker("worker.js");

if (window.crossOriginIsolated) {
  const buffer = new SharedArrayBuffer(16);
  myWorker.postMessage(buffer);
} else {
  const buffer = new ArrayBuffer(16);
  myWorker.postMessage(buffer);
}
```

## 5. 调试和控制台

### 5.1 console

Window.console 提供了向浏览器控制台记录信息的方法。

#### 主要方法

- `log()` - 输出普通信息
- `error()` - 输出错误信息
- `warn()` - 输出警告信息
- `info()` - 输出信息类消息
- `debug()` - 输出调试信息
- `assert()` - 断言检查
- `group()` / `groupEnd()` - 创建分组
- `time()` / `timeEnd()` - 计时器
- `table()` - 表格形式输出
- `trace()` - 输出堆栈跟踪

#### 格式化输出

- `%o` - 打印 JavaScript 对象
- `%d` - 打印整数
- `%s` - 打印字符串
- `%f` - 打印浮点数
- `%c` - 自定义样式

```javascript
// 基本用法
console.log("你好，%s。你已经联系我 %d 次了。", "小明", 5);

// 样式化输出
console.log(
  "This is %cMy stylish message",
  "color: yellow; font-style: italic; background-color: blue; padding: 2px"
);

// 分组输出
console.group("我的分组");
console.log("Level 1");
console.warn("Level 1 警告");
console.groupEnd();

// 计时器
console.time("answer time");
// ... 执行一些代码 ...
console.timeEnd("answer time");

// 断言
console.assert(false, "这个断言会失败");
```

## 6. 导航和历史

### 6.1 history

History API 提供了对浏览器会话历史记录的访问功能。

#### 属性

- `length` - 会话历史中元素的数目
- `state` - 历史堆栈顶部的状态
- `scrollRestoration` - 滚动恢复行为（`auto` 或 `manual`）

#### 方法

- `go(n)` - 根据相对位置跳转
- `back()` - 后退一页
- `forward()` - 前进一页
- `pushState()` - 添加新的历史记录
- `replaceState()` - 替换当前历史记录

```javascript
// 导航操作
history.go(0); // 刷新页面
history.back(); // 后退
history.forward(); // 前进

// 修改历史记录
history.pushState({ page: 1 }, "标题 1", "?page=1");
history.replaceState({ page: 2 }, "标题 2", "?page=2");

// 监听历史记录变化
window.addEventListener("popstate", (event) => {
  console.log(`位置：${document.location}，状态：${JSON.stringify(event.state)}`);
});
```

### 6.2 location

Location 对象提供了当前页面的 URL 信息和导航功能。

#### 属性

- `href` - 完整的 URL
- `protocol` - 协议（http: 或 https:）
- `host` - 主机名和端口
- `hostname` - 主机名
- `port` - 端口号
- `pathname` - 路径
- `search` - 查询字符串
- `hash` - 锚点

#### 方法

- `assign(url)` - 加载新的 URL
- `reload()` - 重新加载当前页面
- `replace(url)` - 替换当前页面
- `toString()` - 返回完整的 URL

```javascript
// 解析 URL
const url = new URL("https://developer.mozilla.org/en-US/search?q=URL#results");
console.log(url.protocol); // "https:"
console.log(url.host); // "developer.mozilla.org"
console.log(url.pathname); // "/en-US/search"
console.log(url.search); // "?q=URL"
console.log(url.hash); // "#results"

// 导航操作
location.assign("https://www.mozilla.org");
location.href = "https://www.mozilla.org"; // 等价操作
location.replace("https://www.mozilla.org"); // 替换当前页面
```

### 6.3 navigation

Navigation API 提供了初始化、拦截和管理浏览器导航操作的能力。

```javascript
// 获取所有历史记录
const currentNavEntries = window.navigation.entries();
```

## 7. 窗口关系

### 7.1 opener

返回打开当前窗口的那个窗口的引用。

```javascript
if (window.opener && !window.opener.closed) {
  // 操作打开当前窗口的窗口
  window.opener.location.href = "https://www.mozilla.org";
}
```

### 7.2 parent

返回当前窗口的父窗口对象。如果当前窗口是 `<iframe>`、`<object>` 或 `<frame>`，则返回嵌入它的窗口。

```javascript
if (window.parent !== window.top) {
  // 至少有三层窗口
  console.log("当前窗口在嵌套的 frame 中");
}
```

## 8. 屏幕和显示

### 8.1 screen

返回当前窗口的 `Screen` 对象，包含屏幕相关信息。

```javascript
console.log(screen);
// 输出示例：
// Screen {
//   availHeight: 1233,
//   availWidth: 1212,
//   height: 1212,
//   width: 323,
//   colorDepth: 24,
//   pixelDepth: 24,
//   orientation: {
//     angle: 0,
//     type: 'landscape-primary'
//   }
// }

// 根据屏幕色深选择不同版本
if (screen.pixelDepth < 8) {
  // 使用低色彩版本
} else {
  // 使用常规彩色版本
}
```

### 8.2 visualViewport

返回一个 `VisualViewport` 对象，表示给定窗口的可视视口。

> **注意：** 只有最上层的 window 才有视觉视口概念。

```javascript
const visualViewport = window.visualViewport;
```

## 9. 浏览器界面元素

### 9.1 界面栏属性

以下属性返回包含 `visible` 布尔属性的对象，表示浏览器界面的特定部分是否可见：

- `menubar` - 菜单栏
- `personalbar` - 个人栏
- `locationbar` - 地址栏
- `scrollbars` - 滚动条
- `statusbar` - 状态栏
- `toolbar` - 工具栏

> **隐私考虑：** 如果 Window 是弹出窗口，则 `visible` 属性值为 `false`，否则为 `true`。

## 10. 现代 Web API

### 10.1 documentPictureInPicture

画中画 API 的入口点，用于创建和处理文档画中画窗口。

```javascript
const videoPlayer = document.getElementById("player");

// 打开画中画窗口
const innerWindow = await window.documentPictureInPicture.requestWindow({
  width: videoPlayer.clientWidth,
  height: videoPlayer.clientHeight,
});
```

### 10.2 scheduler

优先任务调度 API 的入口点，提供 `postTask()` 和 `yield()` 方法。

```javascript
// 检查是否支持优先任务调度 API
if ("scheduler" in window) {
  const myTask = () => "Task 1: user-visible";

  window.scheduler
    .postTask(myTask)
    .then((taskResult) => console.log(taskResult))
    .catch((error) => console.log(`Error: ${error}`));
} else {
  console.log("不支持优先任务调度 API");
}
```

### 10.3 sharedStorage

> **注意：** 此功能仅在安全上下文（HTTPS）中可用。

共享存储 API 的入口点，支持未分区的跨站点数据访问。

```javascript
// 随机分配用户到实验组
function getExperimentGroup() {
  return Math.round(Math.random());
}

async function injectContent() {
  // 添加模块到共享存储 worklet
  await window.sharedStorage.worklet.addModule("ab-testing-worklet.js");

  // 分配用户到随机组并存储
  window.sharedStorage.set("ab-testing-group", getExperimentGroup(), {
    ignoreIfPresent: true,
  });

  // 执行 URL 选择操作
  const fencedFrameConfig = await window.sharedStorage.selectURL(
    "ab-testing",
    [
      { url: "https://your-server.example/content/default-content.html" },
      { url: "https://your-server.example/content/experiment-content-a.html" },
    ],
    { resolveToConfig: true }
  );

  // 在 fenced frame 中渲染选择的 URL
  document.getElementById("content-slot").config = fencedFrameConfig;
}
```

### 10.4 trustedTypes

可信类型 API 的入口点，用于防止客户端跨站点脚本（XSS）攻击。

```javascript
// 创建转义 HTML 策略
const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
  createHTML: (string) =>
    string
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;"),
});

const el = document.getElementById("myDiv");
const escaped = escapeHTMLPolicy.createHTML("<img src=x onerror=alert(1)>");
console.log(escaped instanceof TrustedHTML); // true
el.innerHTML = escaped;
```

## 11. 最佳实践

### 11.1 性能优化

- 使用 `requestAnimationFrame` 而不是 `setTimeout` 进行动画
- 利用 `devicePixelRatio` 优化高分辨率屏幕显示
- 合理使用 `localStorage` 和 `sessionStorage`

### 11.2 安全考虑

- 在使用 `postMessage` 时验证来源
- 使用 `isSecureContext` 检查安全上下文
- 利用 `trustedTypes` 防止 XSS 攻击

### 11.3 兼容性处理

- 使用特性检测而不是浏览器检测
- 为新 API 提供 polyfill 或降级方案
- 注意不同浏览器对 Window 属性的支持情况

## 12. 参考资料

- [MDN - Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)
- [MDN - History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- [MDN - Location](https://developer.mozilla.org/zh-CN/docs/Web/API/Location)
- [MDN - Console API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console_API)
- [MDN - Visual Viewport API](https://developer.mozilla.org/zh-CN/docs/Web/API/Visual_Viewport_API)
- [MDN - Trusted Types API](https://developer.mozilla.org/zh-CN/docs/Web/API/Trusted_Types_API)
