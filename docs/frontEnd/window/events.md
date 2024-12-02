# window 事件集锦

## beforeprint&afterprint

beforeprint 事件会在相关联的文档即将打印或预览打印时触发。

afterprint 在关联的文档开始打印或关闭打印预览后，将触发 afterprint 事件。

beforeprint 和 afterprint 事件允许页面在打印开始之前更改其内容（例如，也许是移除 banner）然后在打印完成后还原这些更改。一般来说，你应该更倾向于使用 @media print CSS at 规则，但在某些情况下可能有必要使用这些事件。

```js
addEventListener("beforeprint", event => {});
onbeforeprint = event => {};

addEventListener("afterprint", event => {
  console.log(event);
});
onafterprint = event => {};
```

## onappinstalled

Window 对象的 onappinstalled 属性用于处理 appinstalled 事件，该事件是一个实现了 Event 接口的简单事件，会在网页应用成功安装为渐进式网页应用时立即触发。

```js
window.onappinstalled = function (ev) {
  console.log("The application was installed.");
};
```

## beforeinstallprompt

Window.onbeforeinstallprompt 属性是一个事件处理程序，用于处理一个 beforeinstallprompt，当一个 Web 清单存在时，它将在移动设备上发送，但是在提示用户将网站保存到主屏幕之前。

```js
window.addEventListener("beforeinstallprompt", function(event) { ... });

window.onbeforeinstallprompt = function(event) { ...};
```

## beforeunload

当浏览器窗口关闭或者刷新时，会触发 beforeunload 事件。当前页面不会直接关闭，可以点击确定按钮关闭或刷新，也可以取消关闭或刷新。
根据规范，要显示确认对话框，事件处理程序需要在事件上调用 preventDefault()。

```js
window.addEventListener("beforeunload", event => {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = "";
});
```

## blur&focus

window 失去焦点和聚集时触发。

```js
window.addEventListener("blur", pause);
window.addEventListener("focus", play);
```

## copy&cut&paste

当用户通过浏览器的用户界面发起一个复制动作时，将触发 copy 事件。

当用户通过浏览器的用户界面发起一个“剪切”动作时，将触发 cut 事件。

当用户通过浏览器的用户界面发起一个“粘贴”动作时，将触发 paste 事件。

事件的原始目标是 Element，它是复制动作的预期目标。你可以在 Window 接口上监听这个事件，以便在捕获或冒泡阶段处理它

```js
addEventListener("copy", event => {});

oncopy = event => {};

addEventListener("cut", event => {});

oncut = event => {};

addEventListener("paste", event => {});

onpaste = event => {};
```

## devicemotion

devicemotion 事件每隔一定时间触发一次，显示设备当时在包括/不包括重力的作用下的加速度大小。如果有的话，它还会提供有关旋转速率的信息。

该事件不可取消，也不会冒泡。

> 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

```js
addEventListener("devicemotion", event => {
  // 一个 DeviceMotionEvent，继承于 Event。属性有：
  //acceleration 给出设备在 x、y、z 三轴上的加速度。加速度用 m/s² 表示。
  //accelarationIncludingGravity 在重力作用下，给出设备在 x、y、z 三个轴上的加速度的对象。加速度单位为 m/s²。
  //rotationRage 一个给出设备绕三个方向轴（阿尔法轴、贝塔轴和伽马轴）的旋转速率的对象。旋转速率以度每秒表示
  //interval 代表从设备获取数据的时间间隔（毫秒）的数字。
});

ondevicemotion = event => {};
```

## deviceorientation

deviceorientation 事件在方向传感器输出新数据的时候触发。其数据系传感器与地球坐标系相比较所得，也就是说在设备上可能会采用设备地磁计的数据。该事件不可取消也不会冒泡。

```js
addEventListener("deviceorientation", event => {
  //一个 DeviceOrientationEvent。继承了 Event。
  //absolute 一个布尔值，表示设备是否提供了方向数据。
  //alpha 一个数字，表示设备围绕 z 轴的转动度数，范围为 0（含）到 360（不含）。
  //beta 一个数字，表示设备围绕 x 轴的转动度数，范围为 -180（含）到 180（不含）。表示设备的前后运动。
  //gamma 一个数字，表示设备围绕 y 轴的转动度数，范围为 -90（含）到 90（不含）。表示设备的左右运动。
});

ondeviceorientation = event => {};
if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "deviceorientation",
    function (event) {
      // alpha: rotation around z-axis
      var rotateDegrees = event.alpha;
      // gamma: left to right
      var leftToRight = event.gamma;
      // beta: front back motion
      var frontToBack = event.beta;
    },
    true
  );
}
```

## deviceorientationabsolute

deviceorientationabsolute 事件在绝对设备方向更改时触发。

此事件不可取消，也不会冒泡。

> 此功能仅在安全上下文 （HTTPS） 中可用，在部分或全部支持的浏览器中可用。

```js
addEventListener("deviceorientationabsolute", event => {});

ondeviceorientationabsolute = event => {};
```
## error事件
当资源加载失败或无法使用时，会在 Window 对象触发 error 事件。例如：script 执行时报错。

> 如果它是由用户界面元素生成的，或者是由事件实例生成的，那么此事件是 UIEvent 实例。

```js
const log = document.querySelector(".event-log-contents");

window.addEventListener("error", event => {
  log.textContent = log.textContent + `${event.type}: ${event.message}\n`;
  console.log(event);
});

const scriptError = document.querySelector("#script-error");
scriptError.addEventListener("click", () => {
  const badCode = "const s;";
  eval(badCode);
});
```

## gamepadconnected&gamepaddisconnected

gamepadconnected 事件会在浏览器检测到游戏控制器第一次连接或者第一次按下游戏键/摇杆的时候触发

```js
// 请注意，在实现该 API 的浏览器中，该 API 仍为供应商前缀
window.addEventListener("gamepadconnected", function (event) {
  // 所有按钮和轴值均可通过以下方式访问
  event.gamepad;
});

window.addEventListener("gamepaddisconnected", event => {
  console.log("Lost connection with the gamepad.");
});
```

## hashchange

当 URL 的片段标识符（以 # 符号开头和之后的 URL 部分）更改时，将触发 hashchange 事件。除了 Window 接口以外，事件处理器属性 onhashchange 同样可以用于以下目标：

- HTMLBodyElement
- HTMLFrameSetElement
- SVGSVGElement

```js
addEventListener("hashchange", event => {
  // newURL 一个字符串，表示窗口导航到的新 URL。
  // oldURL 一个字符串，表示导航窗口的上一个 URL。
});
onhashchange = event => {};
```

## languagechange

languagechange 事件在用户首选语言发生变化时，在全局对象作用域上触发。
除了 Window 接口以外，事件处理器属性 onhashchange 同样可以用于以下目标：

- HTMLBodyElement
- HTMLFrameSetElement
- SVGSVGElement

```js
addEventListener("languagechange", event => {});
onlanguagechange = event => {};
```

## load

load 事件在整个页面及所有依赖资源如样式表和图片都已完成加载时触发。它与 DOMContentLoaded 不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载。该事件不可取消，也不会冒泡。

```js
addEventListener("load", event => {});

onload = event => {};
```

## message

message 事件是在窗口接受到消息（例如，从另一个浏览器上下文中调用 Window.postMessage()）时，在 Window 对象上触发的事件。

```js
window.addEventListener('message', function(event) { ... })
window.onmessage = function(event) { ... }
```

## onmessageerror

WindowEventHandlers 接口的 onmessageerror 事件处理器是一个 EventListener，每当一个类型为 messageerror 的 EventListener 事件在一个窗口被触发 --也就是说，当它收到的消息不能是 deserialized 。

```js
window.onmessageerror = function() { ... };
```

## online&offline

当浏览器能够访问网络，且 Navigator.onLine 的值被设为 true 时，Window 接口的 online 事件将被触发。

offline 事件在浏览器失去网络连接时，在 Window 接口上触发。并且 Navigator.onLine 的值变为 false。

```js
// addEventListener version
window.addEventListener("online", event => {
  console.log("You are now connected to the network.");
});

// ononline version
window.ononline = event => {
  console.log("You are now connected to the network.");
};

addEventListener("offline", event => {});
onoffline = event => {};
```

## orientationchange

orientationchange 事件在设备的纵横方向改变时触发。

```js
window.addEventListener("orientationchange", function () {
  console.log(
    "the orientation of the device is now " + screen.orientation.angle
  );
});

window.addEventListener("orientationchange", function () {
  console.log(
    "the orientation of the device is now " + screen.orientation.angle
  );
});
```

## pagehide&pageshow

当浏览器从展示会话历史中的另一个页面过程中隐藏当前页面时，会向 Window 发送 pagehide 事件。

当一条会话历史记录被执行的时候将会触发页面显示 (pageshow) 事件。(这包括了后退/前进按钮操作，同时也会在 onload 事件触发后初始化页面时触发)

```js
addEventListener("pagehide", event => {});
onpagehide = event => {};

window.addEventListener("pageshow", function (event) {
  console.log("after , pageshow :", event);
});

window.addEventListener("load", function () {
  console.log("before");
});
```

## pagereveal

pagereveal 事件在首次呈现文档时触发，无论是从网络加载新文档还是激活文档（从后退/前进缓存 （bfcache） 或预呈现）。

这在跨文档 （MPA） 视图过渡的情况下非常有用，用于处理来自导航入站页面的活动过渡。例如，您可能希望跳过过渡，或通过 JavaScript 自定义集客过渡动画。

```js
addEventListener("pagereveal", event => {});
onpagereveal = event => {};
```

## pageswap

pageswap 事件在跨文档导航时触发，当前一个文档即将卸载时。

这在跨文档 （MPA） 视图过渡的情况下非常有用，用于从导航的出站页面处理活动过渡。例如，您可能希望跳过过渡，或通过 JavaScript 自定义叫客过渡动画。

它还提供对导航类型以及当前和目标文档历史记录条目的访问。

```js
addEventListener("pageswap", event => {});
onpageswap = event => {};
```

## popstate

每当激活同一文档中不同的历史记录条目时，popstate 事件就会在对应的 window 对象上触发。如果当前处于激活状态的历史记录条目是由 history.pushState() 方法创建的或者是由 history.replaceState() 方法修改的，则 popstate 事件的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝。

> 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。popstate 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者在 JavaScript 中调用 history.back() 方法）。即，在同一文档的两个历史记录条目之间导航会触发该事件。

```js
window.onpopstate = function (event) {
  alert(
    "location: " + document.location + ", state: " + JSON.stringify(event.state)
  );
};

history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // 弹出 "location: http://example.com/example.html, state: null
history.go(2); // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}
```

## rejectionhandled

当 Promise 被 rejected 且有 rejection 处理器时会在全局触发 rejectionhandled 事件 (通常是发生在 window 下，但是也可能发生在 Worker 中)。应用于调试一般应用回退。当 Promise 被 rejected 且没有 rejection 处理器处理时会触发 unhandledrejection 事件。这两个事件协同工作。

```js
window.addEventListener(
  "rejectionhandled",
  event => {
    console.log("Promise rejected; reason: " + event.reason);
  },
  false
);
```

## unhandledrejection

当 Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件；这可能发生在 window 下，但也可能发生在 Worker 中。这对于调试和为意外情况提供后备错误处理非常有用。

许多环境 (例如 Node.js ) 默认情况下会向控制台打印未处理的 Promise rejections。你可以通过为 unhandledrejection 事件添加一个处理程序来避免这种情况的发生，该处理程序除了执行你希望执行的任何其他任务之外，还可以调用 preventDefault() 来取消该事件，从而阻止该事件冒泡并由运行时的日志代码处理。这种方法之所以有效，是因为 unhandledrejection 事件是可以取消的。

```js
window.addEventListener("unhandledrejection", event => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

window.onunhandledrejection = event => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
  // 阻止默认处理（例如将错误输出到控制台）
  event.preventDefault();
};
```

## resize

resize 事件在文档视图（窗口）调整大小时触发。这个事件不可取消，不会冒泡。虽然现在 resize 事件只针对窗口触发，但你可以使用 ResizeObserver API 获得其他元素的尺寸调整通知。

```js
addEventListener("resize", event => {});

onresize = event => {};
```

## scrollsnapchange

当选择新的滚动对齐目标时，Window 界面的 scrollsnapchange 事件将在滚动操作结束时触发。

此事件的工作方式与 Element 接口的 scrollsnapchange 事件大致相同，只是必须将整个 HTML 文档设置为滚动对齐容器（即，在 `<html>` 元素上设置 scroll-snap-type）。

```js
addEventListener("scrollsnapchange", event => {});

onscrollsnapchange = event => {};
```

## scrollsnapchanging

当浏览器确定新的滚动对齐目标处于待处理状态时，将触发 Window 界面的 scrollsnapchanging 事件，即当当前滚动手势结束时，将选择该目标

此事件的工作方式与 Element 接口的 scrollsnapchange 事件大致相同，只是必须将整个 HTML 文档设置为滚动对齐容器（即，在 `<html>` 元素上设置 scroll-snap-type）。

```js
addEventListener("scrollsnapchanging", event => {});

onscrollsnapchanging = event => {};
```

## storage

当存储区域（localStorage 或 sessionStorage）被修改时，将触发 storage 事件。

```js
addEventListener("storage", event => {});
onstorage = event => {};
```

## unload

当文档或一个子资源正在被卸载时，触发 unload 事件。

它在下面两个事件后被触发：

- beforeunload (可取消默认行为的事件)
- pagehide
- 文档处于以下状态：

- 所有资源仍存在 (图片，iframe 等.)
- 对于终端用户所有资源均不可见
- 界面交互无效 (window.open, alert, confirm 等.)
- 错误不会停止卸载文档的过程

```js
window.addEventListener("beforeunload", function (event) {
  console.log("I am the 2nd one.");
});
window.addEventListener("unload", function (event) {
  console.log("I am the 4th and last one…");
});
```