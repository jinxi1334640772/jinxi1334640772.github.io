## requestIdleCallback

浏览器的主线程以其事件循环队列为中心。此代码渲染 Document 上待更新展示的内容，执行页面待运行的 JavaScript 脚本，接收来自输入设备的事件，以及分发事件给需要接收事件的元素。此外，事件循环队列处理与操作系统的交互、浏览器自身用户界面的更新等等。这是一个非常繁忙的代码块，你的主要 JavaScript 代码可能会和这些代码一起也在这个线程中执行。当然，大多数（不是所有）能够更改 DOM 的代码都在主线程中运行，因为用户界面更改通常只对主线程可用。

因为事件处理和屏幕更新是用户关注性能最明显的两种方式。对于你的代码来说，防止在事件队列中出现卡顿是很重要的。在过去，除了编写尽可能高效的代码和将尽可能多的工作移交给 worker 之外，没有其他可靠的方法可以做到这一点。Window.requestIdleCallback() 允许浏览器告诉你的代码可以安全使用多少时间而不会导致系统延迟，从而有助于确保浏览器的事件循环平稳运行。如果你保持在给定的范围内，你可以使用户体验更好。

因为 idle callback 旨在为代码提供一种与事件循环协作的方式，以确保系统充分利用其潜能，不会过度分配任务，从而导致延迟或其他性能问题。如何使用：

- 对非高优先级的任务使用空闲回调
- 空闲回调尽可能不超过分配到时间
- 避免在空闲回调中操作 DOM
- 避免运行时间无法预测的任务
- 只有在需要的时候用 timeout

```js
/**
 * @callback 一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
 * @options 包括可选的配置参数。具有如下属性：
 *  timeout: 如果指定了 timeout，并且有一个正值，而回调在 timeout 毫秒过后还没有被调用，那么回调任务将放入事件循环中排队，即使这样做有可能对性能产生负面影响。
 * @return 一个 ID，可以把它传入 Window.cancelIdleCallback() 方法来结束回调。
 */
requestIdleCallback(callback);

const cancelId = requestIdleCallback(callback, options);
// 取消之前调用 window.requestIdleCallback() 的回调。返回值：无（undefined）。
cancelIdleCallback(cancelId);
```

## atob & btoa

```js
//对字符串进行 Base64 编码，编码成二进制字符串（即字符串中的每个字符都被视为一字节的二进制数据）。
const encodedData = window.btoa("Hello, world"); // 编码
// 对经过 Base64 编码的字符串进行解码
const decodedData = window.atob(encodedData); // 解码
```

## requestAnimationFrame

告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。

```js
callback(timestamp){
  console.log('下次执行requestAnimationFrame的时间戳',timestamp)
}
const cancelId = requestAnimationFrame(callback)
// 取消事件
cancelAnimationFrame(cancelId)
```
## 定时器

setTimeout执行一次的定时器  
setInterval重复定时器   
setImmediate立即执行的异步任务

```js
// 1000ms后执行定时器
var timeoutID = setTimeout(function () {
  // Run some code
}, 1000);
// 清除任务
clearTimeout(timeoutID);

// 每1000ms执行一次
var intervalID = setInterval(function () {
  // Run some code
}, 1000);
// 清除任务
clearInterval(intervalID);

var immediateID = setImmediate(function () {
  // Run some code
}
// 清除任务
clearImmediate(immediateID);
```

## close & open & stop

Window 接口的 open() 方法，是用指定的名称将指定的资源加载到新的或已存在的浏览上下文（标签、窗口或 iframe）中。

close 关闭当前窗口或某个指定的窗口。该方法只能由 Window.open() 方法打开的窗口的 window 对象来调用。如果一个窗口不是由脚本打开的，那么，在调用该方法时，JavaScript 控制台会出现类似下面的错误：不能使用脚本关闭一个不是由脚本打开的窗口。 或 Scripts may not close windows that were not opened by script. 。

同时也要注意，对于由 HTMLIFrameElement.contentWindow 返回的 Window 对象，close() 也没有效果。

stop()效果相当于点击了浏览器的停止按钮。由于脚本的加载顺序，该方法不能阻止已经包含在加载中的文档，但是它能够阻止图片、新窗口、和一些会延迟加载的对象的加载。
```js
/**
 * @url 一个字符串，表示要加载的资源的 URL 或路径。如果指定空字符串（""）或省略此参数，则会在目标浏览上下文中打开一个空白页。
 * @target 一个不含空格的字符串，用于指定加载资源的浏览上下文的名称。如果该名称无法识别现有的上下文，则会创建一个新的上下文，并赋予指定的名称。还可以使用特殊的 target 关键字：_self、_blank、_parent 和 _top。
 * @windowFeatures 一个字符串，包含以逗号分隔的窗口特性列表，形式为 name=value，布尔特性则仅为 name。这些特性包括窗口的默认大小和位置、是否打开最小弹出窗口等选项。支持以下选项：
 *  popup 最小弹出窗口。弹出窗口中包含的用户界面功能将由浏览器自动决定，一般只包括地址栏。如果未启用 popup，也没有声明窗口特性，则新的浏览上下文将是一个标签页。
 *  width或者innerWidth 指定内容区域（包括滚动条）的宽度。最小要求值为 100。
 *  height或者innerHeight 指定内容区域（包括滚动条）的高度。最小要求值为 100。
 *  left或screenX 指定从用户操作系统定义的工作区左侧到新窗口生成位置的距离（以像素为单位）。
 *  top或screenY 指定从用户操作系统定义的工作区顶部到新窗口生成位置的距离（以像素为单位）。
 *  noopener 如果设置了此特性，新窗口将无法通过 Window.opener 访问原窗口，并返回 null。
 *  noreferrer 如果设置了此特性，浏览器将省略 Referer 标头，并将 noopener 设为 true。
 * @return  一个 WindowProxy 对象。只要符合同源策略安全要求，返回的引用就可用于访问新窗口的属性和方法。
 */
open();
open(url);
open(url, target);
open(url, target, windowFeatures);

const windowFeatures = "left=100,top=100,width=320,height=320";
const handle = window.open(
  "https://www.mozilla.org/",
  "mozillaWindow",
  windowFeatures
);
if (!handle) {
  // 不允许打开此窗口
  // 可能被内置弹窗阻止程序阻止了
  // …
}

// 用于存储将要打开的窗口（的引用）的全局变量
var openedWindow;

function openWindow() {
  openedWindow = window.open("moreinfo.htm");
}

function closeOpenedWindow() {
  openedWindow.close();
}

/**
 * 当直接调用 window 对象的 close() 方法而非在一个 window 实例上调用 close() 时，浏览器会关闭最前面的窗口，无论是不是你的脚本创建的这个窗口。（Firefox 35.0.1：脚本不能关闭不是他打开的窗口）
 */
function closeCurrentWindow() {
  window.close();
}

window.stop();
```
## createImageBitmap

从给定的来源创建位图，也可以进行裁剪以包含源图像的一部分。它接受各种不同的图像来源，并返回一个会兑现 ImageBitmap 的 Promise。

image 图像源，可以是以下值之一：

- `HTMLImageElement`
- `SVGImageElement`
- `HTMLVideoElement`
- `HTMLCanvasElement`
- `Blob`
- `ImageData`
- `ImageBitmap`
- `OffscreenCanvas`
- `VideoFrame`

```js
/**
 * sx:x坐标
 * sy:y坐标
 * sw:宽度
 * sh:高度
 * @options:设置图像提取选项的对象。可用的选项包括：
 *  imageOrientation:指定位图图像的方向。from-image flipY none
 *  premultiplyAlpha 指定位图的颜色通道是否应与 alpha 通道预乘。以下值之一：none、premultiply 或 default（默认）。
 *  colorSpaceConversion 指定图像是否应使用色彩空间转换进行解码。none 或 default（默认）。default 值表示使用特定于实现的行为。
 *  resizeWidth 指定输出宽度的长整数。
 *  resizeHeight 指定输出高度的长整数。
 *  resizeQuality 指定用于调整输入大小以匹配输出尺寸的算法。以下值之一：pixelated、low（默认）、medium 或 high。
 * @return 一个 Promise，会兑现为一个包含给定矩形的位图数据的 ImageBitmap 对象。
 */
createImageBitmap(image);
createImageBitmap(image, options);
createImageBitmap(image, sx, sy, sw, sh);
createImageBitmap(image, sx, sy, sw, sh, options);

/**此示例加载精灵表（sprite sheet），从中提取精灵，然后将每个精灵渲染到画布上。精灵表是包含多个较小图像（你希望能够单独渲染每个图像）的图像。 */
const canvas = document.getElementById("myCanvas"),
  ctx = canvas.getContext("2d"),
  image = new Image();

// 等待精灵表加载完成
image.onload = () => {
  Promise.all([
    // 从精灵表中裁剪出两个精灵
    createImageBitmap(image, 0, 0, 32, 32),
    createImageBitmap(image, 32, 0, 32, 32),
    createImageBitmap(image, 0, 0, 50, 50, { imageOrientation: "flipY" }),
  ]).then(sprites => {
    // 将每个精灵绘制到画布上
    ctx.drawImage(sprites[0], 0, 0);
    ctx.drawImage(sprites[1], 32, 32);
    ctx.drawImage(sprites[2], 64, 64);
  });
};

// 从图像文件加载精灵表
image.src = "50x50.jpg";
```

## focus & print

focus()发出将窗口置顶的请求。用户设置可能导致此操作失败，并且在方法返回之前并不能保证窗口已处于最前端。

print()打开打印对话框，以打印当前文档。如果调用此函数时文档仍在加载中，那么文档将在打开打印对话框之前完成加载。当打印对话框打开时，此方法将阻塞。无返回值。

```js
if (clicked) {
  window.focus();
}
window.print()
```

## getComputedStyle

返回一个只读对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后，报告元素的所有 CSS 属性的值。私有的 CSS 属性值可以通过对象提供的 API 或通过简单地使用 CSS 属性名称进行索引来访问。

```js
/**
 * @element 用于获取计算样式的Element。
 * @pseudoElement 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
 * @return 实时的 CSSStyleDeclaration 对象，当元素的样式更改时，它会自动更新本身。
 */
getComputedStyle(element);
getComputedStyle(element, pseudoElt);

let elem1 = document.getElementById("elemId");
let style = window.getComputedStyle(elem1, null);

// 它等价于
// let style = document.defaultView.getComputedStyle(elem1, null);

// 也可用，如cs ['z-index']或cs.zIndex。
let height = style.getPropertyValue("height");

// 获取伪元素的样式
let h3 = document.querySelector("h3"),
let result = getComputedStyle(h3, "::after").content;
```

## getScreenDetails

获取屏幕信息

```js
const screenDetails = await window.getScreenDetails();

// Open a full-size window on each screen available to the device
for (const screen of screenDetails.screens) {
  window.open(
    "https://example.com",
    "_blank",
    `left=${screen.availLeft},
    top=${screen.availTop},
    width=${screen.availWidth},
    height=${screen.availHeight}`
  );
}
```

## getSelection

返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置。

- `anchorNode` 返回该选区起点所在的节点（Node）
- `anchorOffset` 选区起点在 anchorNode 中的位置偏移量。
- `focusNode` 选区终点所在的节点。
- `focusOffset` 选区终点在 focusNode 中的位置偏移量。
- `isCollapsed` 选区的起始点和终点是否在同一个位置。
- `rangeCount` 选区所包含的连续范围的数量。
- `getRangeAt()` 指定区域（Range）的引用。
- `collapse()` 将当前的选区折叠为一个点。
- `extend()` 将选区的焦点移动到一个特定的位置。
- `modify()` 修改当前的选区。
- `collapseToStart()` 将当前的选区折叠到起始点。
- `collapseToEnd()` 将当前的选区折叠到最末尾的一个点。
- `selectAllChildren()` 将某一指定节点的子节点框入选区。
- `addRange()` 一个区域（Range）对象将被加入选区。
- `removeRange()` 从选区中移除一个区域。
- `removeAllRange()` 将所有的区域都从选区中移除。
- `deleteFormDocument()` 从页面中删除选区中的内容。
- `toString()` 返回当前选区的纯文本内容。
- `containsNode()` 判断某一个 Node 是否为当前选区的一部分
-

```js
function foo() {
  let selObj = window.getSelection();
  console.log(selObj);
  var selectedText = selObj.toString();

  let selRange = selObj.getRangeAt(0);
  // 其他代码
}
```

## matchMedia

返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。返回的 MediaQueryList 可被用于判定 Document 是否匹配媒体查询，或者监控一个 document 来判定它匹配了或者停止匹配了此媒体查询。

```js
matchMedia(mediaQueryString);

let mql = window.matchMedia("max-width: 600px");

document.querySelector(".mq-value").innerText = mql.matches;
```

## moveTo & moveBy

moveTo()将当前窗口移动到指定的坐标位置。

moveBy()根据指定的值，移动当前窗口

```js
/**
 * @X 要移动到的位置横坐标
 * @Y 要移动到的位置纵坐标
 */
window.moveTo(x, y);

/**
 * @deltaX 表示窗口在水平方向移动的像素值。
 * @deltaY 表示窗口在垂直方向移动的像素值。
 *
 */
window.moveBy(deltaX, deltaY);

function origin() {
  // 把窗口移动到左上角
  window.moveTo(0, 0);
}
```

## postMessage

window.postMessage() 方法可以安全地实现跨源通信。

```js
/**
 * @message 将要发送到其他 window 的数据。它将会被结构化克隆算法序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。[1]
 * @targetOrigin 指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个 URI
 * @transfer Transferable 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。
 * @return
 */
otherWindow.postMessage(message, targetOrigin, [transfer]);

// 监听分发的 message:
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  // For Chrome, the origin property is in the event.originalEvent object.
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin;
  var data = event.data;
  // 对发送消息的窗口对象的引用; 可用来在具有不同 origin 的两个窗口之间建立双向通信。
  var source = event.source;
  if (origin !== "http://example.org:8080") return;

  // ...
}
```

## alert & prompt & confirm

prompt指示浏览器显示一个对话框，其中有一个可选的信息，提示用户输入一些文本，并等待用户提交文本或取消对话框。

confirm浏览器显示一个带有可选的信息的对话框，并等待用户确认或取消该对话框。
```js
/**
 * @message 向用户显示的一串文本。如果在提示窗口中没有什么可显示的，可以省略。
 * @defaultValue 一个字符串，包含文本输入字段中显示的默认值。
 * @return  一个包含用户输入文本的字符串，或 null。
 */
prompt();
prompt(message);
prompt(message, defaultValue);

// 打开显示提示文本为"你觉得很幸运吗？"并且输入框默认值为"是的"的提示窗口
window.prompt("你觉得很幸运吗？", "是的");

if (window.confirm("Do you really want to leave?")) {
  window.open("exit.html", "Thanks for Visiting!");
}
```

## queryLocalFonts

返回一个 Promise，其兑现为一个表示本地可用字体的 FontData 对象数组。要使用此方法，用户必须同意授予 local-fonts 权限（可以通过 Permissions API 查询权限状态）。此外，此功能可能会被服务器上设置的权限策略阻止。

```js
/**
 * @options
 *  postscriptNames 一个包含字体 PostScript 名称的数组。如果指定了此项，
 * 则只有 PostScript 名称与数组中的 PostScript 名称匹配的字体，
 * 才会包含在结果中；如果没有，所有字体都将包含在结果中。
 */
queryLocalFonts(options);

async function logFontData() {
  try {
    const availableFonts = await window.queryLocalFonts({
      postscriptNames: ["Verdana", "Verdana-Bold", "Verdana-Italic"],
    });
    for (const fontData of availableFonts) {
      console.log(fontData.postscriptName);
      console.log(fontData.fullName);
      console.log(fontData.family);
      console.log(fontData.style);
      // `blob()` 方法返回一个包含有效且完整的 SFNT 封装字体数据的 Blob。
      const sfnt = await fontData.blob();
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

## queueMicrotask

将微任务加入队列以在控制返回浏览器的事件循环之前的安全时间执行。

微任务是一个简短的函数，它将在当前任务完成其工作后运行，并且在执行上下文的控制权返回到浏览器的事件循环之前没有其他代码等待运行时运行。微任务对于需要执行最后阶段的任务或其他在渲染之前的任务的库和框架特别有用。

```js
/**
 * @callback 微任务的执行顺序在所有进行中的任务完成之后，
 * 在对浏览器的事件循环产生控制之前。
 * @return  无（undefined）。
 */
queueMicrotask(callback);

MyElement.prototype.loadData = function (url) {
  if (this._cache[url]) {
    queueMicrotask(() => {
      this._setData(this._cache[url]);
      this.dispatchEvent(new Event("load"));
    });
  } else {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        this._cache[url] = data;
        this._setData(data);
        this.dispatchEvent(new Event("load"));
      });
  }
};
```

## reportError

可模拟未捕获的 JavaScript 异常，向控制台或全局事件处理器报告错误。

此特性主要用于自定义事件分发或回调处理库。库可以借此特性以捕获回调代码中的的错误，并将其重新抛出至顶层处理器。这确保了一个回调中出现的异常不会阻碍其他回调的处理，同时也确保了在顶层调试时仍可方便地获取堆栈跟踪信息。

```js
/**
 * @throwable error 对象，例如 TypeError。
 * @return  无（undefined）。
 */
reportError(throwable);

const newError = new Error("Some error message", "someFile.js", 11);
window.reportError(newError);

window.onerror = (message, source, lineno, colno, error) => {
  console.error(`消息：${error.message}，行号：${lineno}`);
  return true;
};

window.addEventListener("error", error => {
  console.error(error.filename);
});

// 输出
// > "消息：Some error message，行号：11"
// > "someFile.js"
```

## resizeBy & resizeTo

resizeBy 调整窗口大小
resizeTo 动态调整窗口到指定大小。

```js
/**
 * @xDelta 窗口水平方向变化的像素值。
 * @yDelta 窗口垂直方向变化的像素值。
 */
window.resizeBy(xDelta, yDelta);

/**
 * @aWidth 新的 outerWidth（单位：像素）（包括滚动条、窗口边框等）。
 * @aHeight 新的 outerHeight（单位：像素）（包括滚动条、标题栏、窗口边框等）。
 */
window.resizeTo(aWidth, aHeight);

// 将窗口设置为整个屏幕的 1/4 大小（面积）
function quarter() {
  window.resizeTo(window.screen.availWidth / 2, window.screen.availHeight / 2);
}
```

## scroll&scrollTo&scrollBy

scroll()和scrollTo()两者相等。滚动窗口至文档中的特定位置。  

scrollBy()在窗口中按指定的偏移量滚动文档

```js
/**
 * @xCoord 想要在左上角显示的文档水平轴像素。
 * @yCoord 想要在左上角显示的文档垂直轴像素。
 * @options
 *  top 指定沿 Y 轴滚动窗口或元素的像素数。
 *  left 指定沿 X 轴滚动窗口或元素的像素数。
 *  behavior 确定滚动是即时完成还是以平滑动画进行。
 *    smooth 平滑地进行动画展示
 *    instant 一次跳转中即时完成
 *    auto 滚动行为由 scroll-behavior 的计算值来决定
 *
 */
scroll(xCoord, yCoord);
scroll(options);

window.scroll({
  top: 100,
  left: 100,
  behavior: "smooth",
});

scrollBy(x - coord, y - coord);
scrollBy(options);
```

## showDirectoryPicker

用于显示一个目录选择器，以允许用户选择一个目录。返回 FileSystemDirectoryHandle 对象

> 功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。此特性在 Web Worker 中可用。

- `getDirectoryHandle()` 会兑现一个调用此方法的目录句柄内指定名称的子目录的 FileSystemDirectoryHandle。
- `getFileHandle()` 返回一个 Promise，会兑现一个调用此方法的目录句柄内指定名称的文件的 FileSystemFileHandle。
- `removeEntry()` 如果目录句柄包含一个名为指定名称的文件或目录，则尝试异步将其移除。
- `resolve()` 返回一个 Promise 对象，会兑现一个包含从父目录前往指定子条目中间的目录的名称的数组。数组的最后一项是子条目的名称。
- `keys()` 每个条目的键的异步迭代器。
- `values()` 每个条目的句柄的异步迭代器。
- `entries()` 返回给定对象自己的可枚举属性的 [key, value] 对的新异步迭代器。

```js
/**
 * @options
 *  id 通过指定 ID，浏览器可以为不同的 ID 记住不同的目录。如果相同的 ID 
 * 用于另一个选择器，则该选择器将在同一目录中打开。
 *  mode 字符串，默认为 "read"，用于只读访问，或 "readwrite" 用于读写访问。
 *  startIn 一个 FileSystemHandle 对象或者代表某个众所周知的目录的字符串
 * （如："desktop"、"documents"、"downloads"、"music"、"pictures"、
 *  "videos"），用于指定选择器的起始目录。
 * @return 一个 Promise 对象，会兑现一个 FileSystemDirectoryHandle 对象。
 */
showDirectoryPicker(options);

const dirName = "directoryToGetName";
const currentDirHandle = await window.showDirectoryPicker();
const subDir = currentDirHandle.getDirectoryHandle(dirName, { create: true });

// 下面的异步函数使用 resolve() 来查找被选择文件相对于指定目录句柄的路径。
async function returnPathDirectories(directoryHandle) {
  // 通过显示文件选择器来获得一个文件句柄
  const [handle] = await self.showOpenFilePicker();
  if (!handle) {
    // 如果用户取消了选择或者打开文件失败
    return;
  }

  // 检查文件句柄是否存在于目录句柄的目录中
  const relativePaths = await directoryHandle.resolve(handle);

  if (relativePaths === null) {
    // 不在目录句柄中
  } else {
    // relativePaths 是一个包含名称的数组，指示相对路径

    for (const name of relativePaths) {
      // 打印数组的每个元素
      console.log(name);
    }
  }
}

// 面的示例会递归地扫描一个目录，以返回目录中每个文件的 FileSystemFileHandle 对象：
async function* getFilesRecursively(entry) {
  if (entry.kind === "file") {
    const file = await entry.getFile();
    if (file !== null) {
      file.relativePath = getRelativePath(entry);
      yield file;
    }
  } else if (entry.kind === "directory") {
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle);
    }
  }
}
for await (const fileHandle of getFilesRecursively(directoryHandle)) {
  console.log(fileHandle);
}
```

## showOpenFilePicker

用于显示一个文件选择器，以允许用户选择一个或多个文件并返回这些文件的句柄。返回 一个 Promise 对象，会兑现一个包含 FileSystemFileHandle 对象的数组

> 功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

- `getFile()` 返回一个 Promise 对象，可兑现一个 File 对象，该对象表示句柄所代表的条目在磁盘上的状态。
- `createSyncAccessHandle()` 返回一个 Promise 对象，可兑现一个 FileSystemSyncAccessHandle 对象，该对象可用于同步读写文件。此方法的同步特性带来了性能优势，但是只能在专用的 Web Worker 中使用。
- `createWritable()` 返回一个 Promise 对象，可兑现一个新建的 FileSystemWritableFileStream 对象，可用于写入文件。

```js
/**
 * @options
 *  excludeAcceptAllOption 默认为 false。默认情况下，选择器应包含一个不应用
 * 任何文件类型过滤器的选项。将此选项设置为 true 意味着该选项不可用。
 *  id 通过指定 ID，浏览器可以为不同的 ID 记住不同的目录。如果相同的 ID 
 * 用于另一个选择器，则该选择器将在同一目录中打开。
 *  multiple 布尔值，默认为 false。当设置为 true 时，可以选择多个文件。
 *  startIn 一个 FileSystemHandle 对象或一个众所周知的目录
 * （"desktop"、"documents"、"downloads"、"music"、"pictures" 或 "videos"）
 * 以指定打开选择器的起始目录。
 *  types 允许选择的文件类型的数组。每个项目都是一个具有以下选项的对象
 *    description 允许的文件类型类别的可选描述。默认为空字符串
 *    accept 一个 Object，其键设置为 MIME 类型，值设置为文件扩展名的数组
 * @return 一个 Promise 对象，会兑现一个包含 FileSystemFileHandle 对象的数组
 */
showOpenFilePicker(options);

const pickerOpts = {
  types: [
    {
      description: "Images",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};
// 创建用于存放文件句柄的引用。
let fileHandle;

async function getFile() {
  // 打开文件选择器，解构返回的数组中的第一个元素
  [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  // 获取文件内容
  const fileData = await fileHandle.getFile();
  // 写入内容
  writeFile(fileHandle, fileData);
  return fileData;
}

// 以下异步函数用于将给定内容写入文件句柄，从而写入磁盘。
async function writeFile(fileHandle, contents) {
  // 创建一个 FileSystemWritableFileStream 用来写入。
  const writable = await fileHandle.createWritable();

  // 将文件内容写入到流中。
  await writable.write(contents);

  // 关闭文件并将内容写入磁盘。
  await writable.close();
}
```

以下异步事件处理函数处于 Web Worker 上下文，从主线程接收消息。

```js
onmessage = async e => {
  // 获取从主线程发往 worker 的消息
  const message = e.data;

  // 获取草稿文件的句柄
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  // 获取同步访问句柄
  const accessHandle = await draftHandle.createSyncAccessHandle();

  // 获取文件大小
  const fileSize = accessHandle.getSize();
  // 将文件内容读取到缓冲区
  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });

  // 将消息写入到文件末尾
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  const writeBuffer = accessHandle.write(encodedMessage, { at: readBuffer });

  // 将更改持久化至磁盘
  accessHandle.flush();

  // 用完 FileSystemSyncAccessHandle 记得把它关闭
  accessHandle.close();
};
```

## showSaveFilePicker

显示一个文件选择器，以允许用户保存一个文件。可以选择一个已有文件覆盖保存，也可以输入名字新建一个文件。一个 Promise 对象，会兑现一个 FileSystemFileHandle 对象。

> 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

```js
/**
 * @options
 *  excludeAcceptAllOption 默认为 false。默认情况下，选择器应包含一个不应用
 * 任何文件类型过滤器的选项。将此选项设置为 true 意味着该选项不可用。
 *  id 通过指定 ID，浏览器可以为不同的 ID 记住不同的目录。如果相同的 ID 
 * 用于另一个选择器，则该选择器将在同一目录中打开。
 *  suggestedName 一个字符串。建议的文件名。
 *  startIn 一个 FileSystemHandle 对象或一个众所周知的目录
 * （"desktop"、"documents"、"downloads"、"music"、"pictures" 或 "videos"）
 * 以指定打开选择器的起始目录。
 *  types 允许选择的文件类型的数组。每个项目都是一个具有以下选项的对象
 *    description 允许的文件类型类别的可选描述。默认为空字符串
 *    accept 一个 Object，其键设置为 MIME 类型，值设置为文件扩展名的数组
 * @return 一个 Promise 对象，会兑现一个包含 FileSystemFileHandle 对象的数组
 */
showSaveFilePicker();

// 以下函数可以显示一个文件选择器，并突出显示文本文件类型以供选择。
async function getNewFileHandle() {
  const opts = {
    types: [
      {
        description: "Text file",
        accept: { "text/plain": [".txt"] },
      },
    ],
  };
  return await window.showSaveFilePicker(opts);
}
```

## structuredClone

使用结构化克隆算法将给定的值进行深拷贝。

该方法还支持把原值中的可转移对象转移（而不是拷贝）到新对象上。可转移对象与原始对象分离并附加到新对象；它们将无法在原始对象中被访问。

```js
/**
 * @value 被克隆的对象。可以是任何结构化克隆支持的类型。
 * @options
 *  transfer 一个可转移对象的数组，里面的对象将被移动而不是克隆到返回的对象上。
 * @return  原始值（value）的深拷贝。
 */
structuredClone(value);
structuredClone(value, options);

// 这个函数可以用来进行深拷贝 JavaScript 变量。也支持循环引用
// 创建一个具有值和对自身的循环引用的对象。
const original = { name: "MDN" };
original.itself = original;

// 对它进行克隆
const clone = structuredClone(original);

console.assert(clone !== original); // 对象并不相同（标识不同）
console.assert(clone.name === "MDN"); // 它们具有相同的值
console.assert(clone.itself === clone); // 且保留了循环引用

// 如何把一个数组的属性转移到新对象。返回结果时，原始对象里的 uInt8Array.buffer 会被清除掉。
const uInt8Array = Uint8Array.from({ length: 1024 * 1024 * 16 }, (v, i) => i);

const transferred = structuredClone(uInt8Array, {
  transfer: [uInt8Array.buffer],
});
console.log(uInt8Array.byteLength); // 0

// 可以克隆任意数量的对象，并转移对象的任意子集。
const transferred = structuredClone(
  { x: { y: { z: arrayBuffer1, w: arrayBuffer2 } } },
  { transfer: [arrayBuffer1] }
);
```
