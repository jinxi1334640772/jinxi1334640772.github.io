## Broadcast Channel API

Broadcast Channel API 允许浏览上下文（即 window、tab、frame 或 iframe）与同源的 worker 之间进行基本通信。可跨上下文通信。它可用于检测同一来源内其他标签页中的用户操作，例如用户登录或退出时。

```js
// 连接至广播频道
const bc = new BroadcastChannel("channelName");

// 发送非常简单的消息的示例:发送到通道的数据使用结构化克隆算法进行序列化。这意味着你可以安全地发送各种各样的数据对象，而无需自己对其进行序列化。
bc.postMessage("这是一条测试消息。");

// 仅将事件记录到控制台的处理器：
bc.onmessage = event => {
  console.log(event, bc.name === "channelName");
};
bc.addEventListener("message", event => {});
// 仅将事件记录到控制台的处理器：
bc.onmessageerror = event => {
  console.log(event, bc.name === "channelName");
};

// 断开频道
bc.close();
```

## CSS Custom Highlight API

CSS 自定义高亮 API 提供了一种方法，可以通过使用 JavaScript 创建范围并使用 CSS 定义样式来设置文档中任意文本范围的样式。

在网页上设置文本范围样式非常有用。例如，文本编辑类的 Web 应用程序会突出显示拼写或语法错误，代码编辑器会突出显示语法错误。

CSS 自定义高亮 API 通过提供一种创建任意 Range 对象并设置其样式的方法（而不是局限于浏览器定义的范围），扩展了其他高亮伪元素的概念，例如 ::selection、::spelling-error、::grammar-error 和 ::target-text。

使用 CSS 自定义高亮 API，你可以通过编程方式创建文本范围并高亮显示它们，而不会影响页面中的 DOM 结构。

使用 CSS 自定义高亮 API 设置网页上文本范围的样式有四个步骤：

- 创建 Range 对象。
- 为这些范围创建 Highlight 对象。
- 使用 HighlightRegistry 进行注册。
- 使用 ::highlight() 伪元素定义高亮样式。

```js
// 第一步：创建Range对象
const parentNode = document.getElementById("foo");

const range1 = new Range();
range1.setStart(parentNode, 10);
range1.setEnd(parentNode, 20);

const range2 = new Range();
range2.setStart(parentNode, 40);
range2.setEnd(parentNode, 60);
// 为Range对象创建高亮Highlight对象
const highlight = new Highlight(range1, range2);
// 注册高亮。CSS.highlights：类 Map 对象用于使用自定义标识符注册高亮显示。
CSS.highlights.set("user-1-highlight", user1Highlight);
// 定义注册的高亮样式
::highlight(user-1-highlight) {
  background-color: yellow;
  color: black;
}

// 从注册表中删除一个高亮显示。
CSS.highlights.delete("user-1-highlight");

// 清除注册表。
CSS.highlights.clear();

```

## CSS Font Loading API

CSS 字体加载 API 为你提供了动态加载字体资源的事件和接口。

在 CSS 中你可以使用 @font-face 规则下载字体，并使用 font-family 属性将字体应用于元素。但是，下载字体流程由客户端控制，大多数客户端仅会在首次需要该字体时才获取、加载该字体，这可能会导致明显的延迟。

CSS 字体加载 API 提供了控制和跟踪字体加载过程的能力，并允许你将其添加到 Document 或 Worker 的字体集中。将字体添加到 Document 或 Worker 的字体集中会让客户端在需要时自动获取、加载字体。字体可以在其被加入字体集之前或之后被加载，但是你必须先将字体添加到字体集，再将其用于绘图。

```js
// 定义字体
// 定义字体
const font = new FontFace("myfont", "url(myfont.woff)", {
  style: "italic",
  weight: "400",
  stretch: "condensed",
});

// 把字体添加到 document.fonts（FontFaceSet）中
document.fonts.add(font);
// 加载字体
font.load();
// 或者fontsSet加载字体
document.fonts.load("36px FontFamily Oxygen").then(
  fonts => {
    console.log(fonts);
  },
  err => {
    console.error(err);
  }
);

document.fonts.addEventListener("loading", event => {
  console.log(event.fontfaces);
});
document.fonts.addEventListener("loadingerror", event => {
  console.log(event.fontfaces);
});
document.fonts.addEventListener("loadingdone", event => {
  event.fontfaces.forEach(font => {
    console.log(font.family);
  });
});
document.fonts.ready.then(function () {
  for (const fontFace of document.fonts.values()) {
    for (const property in fontFace) {
      console.log(fontFace[property]);
    }
  }
});
```

## CSS Properties and Values API

允许开发者显式地定义它们的 CSS 自定义属性，允许设置属性类型检查、默认值以及是否可继承其值。

```js
// 以下代码在 JavaScript 中使用 CSS.registerProperty 输入一个 CSS 自定义属性，--my-color，将其作为一个颜色，然后为其设置一个默认值，并且不允许继承它的值。
window.CSS.registerProperty({
  name: "--my-color",
  syntax: "<color>",
  inherits: false,
  initialValue: "#c0ffee",
});

// 可以在 CSS 中使用 @property at-rule 进行相同的注册：
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

## CSS Typed Object Model API

CSS 值公开为类型化的 JavaScript 对象，以允许其执行操作。通过提供对象功能（而不是 CSSOM 字符串操作）、提供对 CSS 值的类型、方法和对象模型的访问，使 CSS 操作更具逻辑性和性能。

```js
:root {
  --mainColor: hsl(198 43% 42%);
  --black: hsl(0 0% 16%);
  --white: hsl(0 0% 97%);
  --unit: 1.2rem;
}

// Get the element
const myElement = document.querySelector("a");

// Retrieve all computed styles with computedStyleMap()
const defaultComputedStyles = myElement.computedStyleMap();

for (const [prop, val] of defaultComputedStyles) {
 defaultComputedStyles.get(prop).value //100
 defaultComputedStyles.get(prop).unit //px percent undefined
}
 let unit = defaultComputedStyles.get("--unit");
 console.log(unit); // CSSUnparsedValue {0: " 1.2rem", length: 1}
console.log(unit[0]); // " 1.2rem"
const parsedUnit = CSSNumericValue.parse(unit);
console.log(parsedUnit); // CSSUnitValue {value: 1.2, unit: "rem"}
console.log(parsedUnit.unit); // "rem"
console.log(parsedUnit.value); // 1.2

const btnWidth = allComputedStyles.get("width");
console.log(btnWidth); // CSSMathSum
console.log(btnWidth.values); // CSSNumericArray {0: CSSUnitValue, 1: CSSUnitValue, length: 2}
console.log(btnWidth.operator); // 'sum'

const transform = allComputedStyles.get("transform");
console.log(transform); // CSSTransformValue {0: CSSScale, 1: CSSTranslate, length: 2, is2D: true}
console.log(transform.length); // 1
console.log(transform[0]); // CSSScale {x: CSSUnitValue, y: CSSUnitValue, z: CSSUnitValue, is2D: true}
console.log(transform[0].x); // CSSUnitValue {value: 0.95, unit: "number"}
console.log(transform[0].y); // CSSUnitValue {value: 0.95, unit: "number"}
console.log(transform[0].z); // CSSUnitValue {value: 1, unit: "number"}
console.log(transform.is2D); // true

const bgImage = allComputedStyles.get("background-image");
console.log(bgImage); // CSSImageValue
console.log(bgImage.toString()); // url("magic-wand.png")
```

## CSS Object Model: CSS 对象模型（CSSOM）

CSS 对象模型是一组允许用 JavaScript 操纵 CSS 的 API。它很像 DOM，但针对的是 CSS 而不是 HTML。它允许用户动态地读取和修改 CSS 样式。

CSS 的值是没有类型的，也就是使用 String 对象来表示。

```js
var stylesheet = document.styleSheets[1];
stylesheet.cssRules[0].style.backgroundColor = "blue";
document.getElementById("d").style.color = "orange";
el.setAttribute("style", "background-color:darkblue;");
```

## Channel Messaging API

Channel Messaging API 允许两个运行在同一个文档的不同浏览上下文（比如两个 iframe，或者文档主体和一个 iframe，使用 SharedWorker 的两个文档，或者两个 worker）中的独立脚本直接进行通讯，在每端使用一个端口（port）通过双向频道（channel）或管道（pipe）向彼此传递消息。调用 window.postMessage 方法将端口传递到另一个浏览器上下文。

> 当这些可转移的对象被传递后，它们就从之前所属的上下文中消失了。比如一个端口，一旦被发送，在原本的上下文中就再也不可用了。

```js
const input = document.getElementById("message-input");
const output = document.getElementById("message-output");
const button = document.querySelector("button");
const iframe = document.querySelector("iframe");

// 创建了一个消息频道
const channel = new MessageChannel();
const port1 = channel.port1;

// 在 port1 监听port2的消息
port1.addEventListener("message", function (e) {
  console.log("这是从port2接受的数据：", e.data);
  // 通过port1向port2发送消息
  port1.postMessage("你好，port2");
  //断开端口连接，它将不再是激活状态。
  port1.close();
});
//开始发送该端口中的消息队列（仅在使用 EventTarget.addEventListener 时需要；使用 onmessage 已隐含调用该方法）。
port1.start();
// 通过postMassage，将port2发送给iframe
window.postMessage("init", "*", [channel.port2]);

iframe.addEventListener("load", function () {
  // 通过postMessage接收从window传来的port2
  iframe.contentWindow.onmessage = function (event) {
    let port2 = event.data;

    // 接收从port1发来的消息
    port2.onmessage = function (e) {
      console.log("这是从port1接受的消息：", e.data);
      // 通过port2向port1发送消息
      port2.postMessage("这是port2向port1发送的消息");
    };
  };
});
```

## Compression Stream API

Compression Stream API 提供了一种 JavaScript API，使用 gzip 或者默认格式压缩和解压缩数据流。

内置的压缩库意味着 JavaScript 应用不再需要包含其它压缩库，这使得应用程序的下载大小更小。

CompressionStream 属性：

- `readable` 返回由此对象控制的 ReadableStream 实例。
- `writable` 返回由此对象控制的 WritableStream 实例。
- DecompressionStream 属性：
- `readable` 返回由此对象控制的 ReadableStream 实例。
- `writable` 返回由此对象控制的 WritableStream 实例。

```js
// 使用 gzip 对流进行压缩。
const compressedReadableStream = inputReadableStream.pipeThrough(
  new CompressionStream("gzip")
);

//函数使用 gzip 解压缩 blob。
async function DecompressBlob(blob) {
  const decompressedStream = blob
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return await new Response(decompressedStream).blob();
}
```
## Contact Picker API

Contact Picker API 允许用户从他们的联系人列表中选择条目，并与网站或应用程序共享所选条目的有限详细信息。

```js
//异步函数使用该方法检查支持的属性。getProperties()
async function checkProperties() {
  const supportedProperties = await navigator.contacts.getProperties();
  if (supportedProperties.includes("name")) {
    // run code for name support
  }
  if (supportedProperties.includes("email")) {
    // run code for email support
  }
  if (supportedProperties.includes("tel")) {
    // run code for telephone number support
  }
  if (supportedProperties.includes("address")) {
    // run code for address support
  }
  if (supportedProperties.includes("icon")) {
    // run code for avatar support
  }
}

//设置要为每个联系人检索的属性数组，并设置一个 options 对象以允许选择多个联系人。
const props = ["name", "email", "tel", "address", "icon"];
const opts = { multiple: true };

async function getContacts() {
  try {
    //该方法向用户显示联系人选取器界面并处理所选结果
    const contacts = await navigator.contacts.select(props, opts);
    handleResults(contacts);
  } catch (ex) {
    // Handle any errors here.
  }
}
```

## Content Index API

Content Index API 是 Service Worker 的扩展，它允许开发人员在当前 Service Worker 的范围内添加已缓存页面的 URL 和元数据。然后，浏览器可以使用这些条目向用户显示离线阅读。作为开发人员，您还可以在应用程序中显示这些条目。

索引条目不会自动过期。最好提供一个用于清除条目的界面，或定期删除较旧的条目。

```js
// 要添加索引的内容
const item = {
  id: "post-1",
  url: "/posts/amet.html",
  title: "Amet consectetur adipisicing",
  description:
    "Repellat et quia iste possimus ducimus aliquid a aut eaque nostrum.",
  icons: [
    {
      src: "/media/dark.png",
      sizes: "128x128",
      type: "image/png",
    },
  ],
  category: "article",
};

// our asynchronous function to add indexed content
async function registerContent(data) {
  const registration = await navigator.serviceWorker.ready;

  // 特性检测： Content Index
  if (!registration.index) {
    return;
  }

  // 注册 content
  try {
    await registration.index.add(data);
  } catch (e) {
    console.log("Failed to register content: ", e.message);
  }
}

// our content
const item = {
  id: "post-1",
  url: "/posts/amet.html",
  title: "Amet consectetur adipisicing",
  description:
    "Repellat et quia iste possimus ducimus aliquid a aut eaque nostrum.",
  icons: [
    {
      src: "/media/dark.png",
      sizes: "128x128",
      type: "image/png",
    },
  ],
  category: "article",
};

// our asynchronous function to add indexed content
async function registerContent(data) {
  const registration = await navigator.serviceWorker.ready;

  // feature detect Content Index
  if (!registration.index) {
    return;
  }

  // register content
  try {
    await registration.index.add(data);
  } catch (e) {
    console.log("Failed to register content: ", e.message);
  }

  // 获取所有索引条目
  const entries = await registration.index.getAll();
  for (const entry of entries) {
    console.log(entry.title, entry.url);
  }

  //取消注册的索引内容
  await registration.index.delete(article.id);
}

// service worker中访问
self.registration.index.add(item);

self.registration.index.delete(item.id);

const contentIndexItems = self.registration.index.getAll();
// contentdelete 事件仅在由于与浏览器的内置用户界面交互而发生删除时触发。调用 ContentIndex.delete（） 方法时，不会触发该函数。
self.addEventListener("contentdelete", event => {
  console.log(event.id);
  // logs content index id, which can then be used to determine what content to delete from your cache
});
```

## EditContext API

EditContext API 可用于在 Web 上构建支持高级文本输入体验的富文本编辑器，例如输入法编辑器 （IME） 排版、表情符号选取器或任何其他特定于平台的编辑相关 UI 图面。若要使元素在 Web 上可编辑，大多数情况下，请使用 `<input> 元素、<textarea>` 元素或 contenteditable 属性。

但是，使用 EditContext API，您可以在不使用属性的情况下使其他类型的元素可编辑。

```js
<div id="html-editor" spellcheck="false"></div>;

// 要变成可编辑的元素
const editorEl = document.getElementById("html-editor");

// 创建EditContext对象
const editContext = new EditContext({
  text: "<html>\n  <body id=foo>\n    <h1 id='header'>Cool Title</h1>\n    <p class=\"wow\">hello<br/>How are you? test</p>\n  </body>\n</html>",
});
//内容改变时触发
editContext.addEventListener("textupdate", e => {});
// 更新内容
editContext.updateText(2, 20, "\n");

// 赋值给元素的editContext属性
editorEl.editContext = editContext;

// 更新控制边界
const editorBounds = editorEl.getBoundingClientRect();

// Update the control bounds of the EditContext instance.
editContext.updateControlBounds(editorBounds);

//EditContext.updateSelection（） 和 EditContext.updateSelectionBounds（） 方法更新 EditContext 选择状态和选择边界。EditContext.updateCharacterBounds（） 方法更新字符边界。
```

## Encoding&TextEncoderStream API

TextEncoder 提供了一种机制来处理各种字符编码文本，包括传统的非 UTF-8 编码。

TextEncoderStream 接口将一个字符串流转换为 UTF-8 编码的字节。它与 TextEncoder 的流形式等价。

Encoding API 接口的 TextDecoderStream 方法将二进制编码（如 UTF-8 等）的文本流转换为字符串流。它与 TextDecoder 的流形式等价。

API 提供了四个接口：TextDecoder、TextEncoder、TextDecoderStream 和 TextEncoderStream。

TextEncoderStream 属性：

- `encoding` 总是返回"utf-8"。
- `readable` 返回此对象控制的 ReadableStream 实例。
- `writable` 返回此对象控制的 WritableStream 实例。

```js
/**TextDecoder 和 TextDecoderStream
 * @urfLabel 一个字符串，默认是 "utf-8"。可以是任意有效的编码。
 * @options 一个布尔值，表示在解码无效数据时,是否必须抛出 TypeError。默认是 false
 *  fatal
 */
new TextDecoder();
new TextDecoder(utfLabel);
new TextDecoder(utfLabel, options);

let u8arr = new Uint8Array([240, 160, 174, 183]);
console.log(utf8decoder.decode(u8arr));

// 进行编码
const encoder = new TextEncoder();
const array = encoder.encode("€"); // Uint8Array(3) [226, 130, 172]
// 进行解码
const decoder = new TextDecoder();
const str = decoder.decode(array); // String "€"

//创建了一个 TextEncoderStream 将字符串流转换为 UTF-8 编码的二进制数据
const body = textStream.pipeThrough(new TextEncoderStream());
fetch("/dest", {
  method: "POST",
  body,
  headers: { "Content-Type": "text/plain; charset=UTF-8" },
});

//从一个 fetch() 中获取并解码二进制数据转为字符串流
const response = await fetch("https://example.com");
const stream = response.body.pipeThrough(new TextDecoderStream());
```

## EyeDropper

EyeDropper 接口表示一个拾色器工具的实例，用户可以打开并使用它从屏幕上选择颜色。

```js
<button id="start-button">打开拾色器</button> <span id="result"></span>

document.getElementById("start-button").addEventListener("click", () => {
  const resultElement = document.getElementById("result");

  if (!window.EyeDropper) {
    resultElement.textContent = "你的浏览器不支持 EyeDropper API";
    return;
  }

  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();

  eyeDropper
    .open({ signal: abortController.signal })
    .then((result) => {
      resultElement.textContent = result.sRGBHex;
      resultElement.style.backgroundColor = result.sRGBHex;
    })
    .catch((e) => {
      resultElement.textContent = e;
    });
    // 中止拾色器模式
    setTimeout(() => {
      abortController.abort();
    }, 2000);
});

```

## 全屏 API

全屏 API（Fullscreen API）通过添加方法使特定的 Element（及其后代）以全屏模式呈现，并在不再需要时退出全屏模式。这使得使用用户的整个屏幕（在退出全屏模式之前去除所有浏览器用户界面元素和其他应用程序）来展示所需内容（例如在线游戏）成为可能。

> 全屏 API 向 Document 和 Element 接口添加了方法，以允许打开和关闭全屏模式。

```js
function toggleFullScreen() {
  //是否存在已经全屏的元素
  if (!document.fullscreenElement) {
    // 使元素全屏显示
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    // 退出全屏
    document.exitFullscreen();
  }
}
// 是否支持全屏
document.fullscreenEnable;
// 监控全屏改变事件
document.addEventListener("fullscreenchange", function (event) {
  console.log(event);
});
// 不能切换全屏模式时触发
document.addEventListener("fullscreenerror", function (event) {
  console.log(event);
});
```

## HTML 拖放 API

HTML 拖放（Drag and Drop）接口使应用程序能够在浏览器中使用拖放功能。例如，用户可使用鼠标选择可拖拽（draggable）元素，将元素拖拽到可放置（droppable）元素，并释放鼠标按钮以放置这些元素。拖拽操作期间，会有一个可拖拽元素的半透明快照跟随着鼠标指针。

被拖放元素的事件：

- `drag`
- `dragstart`
- `dragend`

放置元素的事件：

- `dragenter`
- `dragover`
- `dragleave`
- `drop`

DataTransfer 属性和方法

- `effectAllowed` 提供所有可用的操作类型。必须是 none, copy, copyLink, copyMove, link, linkMove, move, all or uninitialized 之一。
- `dropEffect` 获取当前选定的拖放操作类型或者设置的为一个新的类型。值必须为 none, copy, link 或 move。
- `files` 包含数据传输中可用的所有本地文件的列表
- `items` 包含所有拖动数据列表的 DataTransferItemList 对象。
  - `kind` 拖拽项的种类，string 或是 file。
  - `type` 拖拽项的类型，一般是一个 MIME 类型。
  - `getAsFile()` 拖拽项的 File 对象（当拖拽项不是一个文件时返回 null）。
  - `getAsString()` 使用拖拽项的字符串作为参数执行指定回调函数。
- `types` 一个提供 dragstart 事件中设置的格式的 strings 数组。
- `getData()`
- `setData()`
- `clearData()`
- `setDragImage`
- `addElement()`

```js
<p id="p1" draggable="true">
  This element is draggable.
</p>;
<p
  id="target"
  ondrop="drop_handler(event)"
  ondragover="dragover_handler(event)">
  Drop Zone
</p>;
window.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("p1");
  element.addEventListener("dragstart", function (ev) {
    // 获取支持的类型，例如：text/plain
    event.dataTransfer.types;
    // 添加拖拽数据
    ev.dataTransfer.setData("text/plain", ev.target.innerText);
    ev.dataTransfer.setData("text/html", ev.target.outerHTML);
    // 储存id在application/my-app
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.setData(
      "text/uri-list",
      ev.target.ownerDocument.location.href
    );
    var img = new Image();
    img.src = "example.gif";
    ev.dataTransfer.setDragImage(img, 10, 10);
    //拖放操作中用户给予的反馈 copy,move,link,none,copyMove,copyLink,linkMove,all
    ev.dataTransfer.effectAllowed = "copy";
  });
});

// 放置区元素事件
function dragover_handler(ev) {
  //每个处理程序调用 preventDefault() 来阻止对这个事件的其他处理过程（如触点事件或指针事件）
  ev.preventDefault();
  // none,copy,move,link
  ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
  ev.preventDefault();
  // 根据前面储存的id获取数据，放置到放置区
  var data = ev.dataTransfer.getData("application/my-app");
  ev.target.appendChild(document.getElementById(data));
  // 删除数据
  event.dataTransfer.clearData("text/uri-list");
}
```

## 空闲检测 API

空闲检测 API 提供了一种方法来检测用户的空闲状态、活动、空闲和锁定，具体来说，无需从脚本轮询即可收到空闲状态更改的通知。

```js
const controller = new AbortController();
const signal = controller.signal;

startButton.addEventListener("click", async () => {
  // 是否授予源访问其 Idle 状态的权限
  if ((await IdleDetector.requestPermission()) !== "granted") {
    console.error("Idle detection permission denied.");
    return;
  }

  try {
    const idleDetector = new IdleDetector();
    // userState 和 screenState值发生更改时调用。
    idleDetector.addEventListener("change", () => {
      // 用户是否与屏幕或设备进行了交互active,idle
      const userState = idleDetector.userState;
      //指示屏幕是否被锁定locked,unlocked
      const screenState = idleDetector.screenState;
      console.log(`Idle change: ${userState}, ${screenState}.`);
    });
    // 开始侦听 用户 IDLE 状态的更改
    await idleDetector.start({
      threshold: 60_000,
      signal,
    });
    console.log("IdleDetector is active.");
  } catch (err) {
    // Deal with initialization errors like permission denied,
    // running outside of top-level frame, etc.
    console.error(err.name, err.message);
  }
});

stopButton.addEventListener("click", () => {
  controller.abort();
  console.log("IdleDetector is stopped.");
});
```

## MediaStream 图像捕获 API

MediaStream Image Capture API 是用于从摄影设备捕获图像或视频的 API。除了捕获数据之外，它还允许您检索有关设备功能的信息，例如图像大小、红眼消除、是否有闪光灯以及它们当前设置的内容。相反，API 允许在设备允许的约束范围内配置功能。

```js
// 通过调用 MediaDevices.getUserMedia（） 获取对设备的引用
navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
  // 隔离媒体流的视觉部分，获取第一项
  const track = mediaStream.getVideoTracks()[0];
  //用于从通过有效的 MediaStreamTrack 引用的摄影设备捕获图像。
  let imageCapture = new ImageCapture(track);
  //获取实时视频的快照
  imageCapture
    .grabFrame()
    .then(imageBitmap => {
      const canvas = document.querySelector("#grabFrameCanvas");
      drawCanvas(canvas, imageBitmap);
    })
    .catch(error => console.error(error));
  //使用视频捕获进行单次曝光
  imageCapture
    .takePhoto()
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      const canvas = document.querySelector("#takePhotoCanvas");
      drawCanvas(canvas, imageBitmap);
    })
    .catch(error => console.error(error));

  let zoom = document.querySelector("#zoom");
  //捕获映像之获取设备功能
  const capabilities = track.getCapabilities();
  // Check whether zoom is supported or not.
  if (!capabilities.zoom) {
    return;
  }
  // 配置设备功能
  track.applyConstraints({ advanced: [{ zoom: zoom.value }] });
});
```
## 调用程序命令 API

调用程序命令 API 提供了一种以声明方式将行为分配给按钮的方法，允许在执行按钮时（单击或通过按键调用，如空格键或返回键）控制交互式元素。

- commandfor
  将 `<button> `元素转换为按钮，控制给定的交互式元素;将要控制的元素的 ID 作为其值。

- command
  指定要对由 control 控制的元素执行的操作，该元素通过 属性 指定。`<button>`commandfor

```html
<!--创建声明性弹出框-->
<button commandfor="mypopover" command="toggle-popover">
  Toggle the popover
</button>
<div id="mypopover" popover>
  <button commandfor="mypopover" command="hide-popover">Close</button>
  Popover content
</div>

<!--创建声明性对话-->
<button commandfor="mydialog" command="show-modal">Show modal dialog</button>
<dialog id="mydialog">
  <button commandfor="mydialog" command="close">Close</button>
  Dialog Content
</dialog>

<!--创建自定义命令-->
<button commandfor="my-img" command="--rotate-left">Rotate left</button>
<button commandfor="my-img" command="--rotate-right">Rotate right</button>
<img id="my-img" src="photo.jpg" alt="[add appropriate alt text here]" />
```

js 创建自定义命令:

```js
const myImg = document.getElementById("my-img");

myImg.addEventListener("command", event => {
  if (event.command == "--rotate-left") {
    myImg.style.rotate = "-90deg";
  } else if (event.command == "--rotate-right") {
    myImg.style.rotate = "90deg";
  }
});
```
