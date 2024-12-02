## Resize Observer API

Resize Observer API 提供了一种高性能的机制，通过该机制，代码可以监视元素的大小更改，并且每次大小更改时都会向观察者传递通知。

用法很简单，并且与其他观察者（例如 Performance Observer 或者 Intersection Observer）几乎相同——你可以使用 ResizeObserver() 构造函数创建一个新的 ResizeObserver，然后使用 ResizeObserver.observe() 使其寻找特定元素大小的更改。每次更改大小时，构造函数中设置的回调函数便会运行，从而提供对新尺寸的访问，并允许你根据需要执行任何操作。

```js
const resizeObserver = new ResizeObserver(entries => {
  /** ResizeObserverEntry：
   * @borderBoxSize 正在观察元素的新边框盒的大小
   * @contentBoxSize 新内容盒的大小
   * @contectRect 新大小的 DOMRectReadOnly对象。等同于Element.getBoundingClientRect()
   * @devicePixelContentBoxSize 新内容盒的大小（以设备像素为单位）
   */
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      entry.target.style.borderRadius = "15px";
    } else {
      entry.target.style.borderRadius = "20px";
    }
  }
});
// 监控元素大小的改变
resizeObserver.observe(document.querySelector("div"));
resizeObserver.unobserve();
resizeObserver.disconnect();
```
## Reporting API

web 平台上有一些不同的特性和问题，当 web 开发人员试图修复错误或以其他方式改进他们的网站时，它们会生成有用的信息。这些信息可以包括：

- 内容安全策略违规。
- 权限策略违规。
- 弃用特性的使用（当使用一些即将在 web 浏览器中弃用的特性时）。
- 发生崩溃。
- 发生用户代理干预（当浏览器阻止你的代码尝试做的事情，因为它被认为是一个安全风险，或者只是简单的让人厌烦，比如自动播放音频）。

Reporting API 的目的是提供一致的报告机制，该机制可用于以 JavaScript 对象表示的报告形式向开发人员提供这些信息。下面的部分将详细介绍几种使用它的方法。

```js
const options = {
  types: ["deprecation"],
  buffered: true,
};

const observer = new ReportingObserver((reports, observer) => {
  console.log("取出报告的队列", reports);
}, options);

observer.observe();
ovserve.disconnect()();
// 取出并清空records队列
let allRecords = observer.takeRecords();

//故意使用 MediaDevices.getUserMedia() 的弃用版本：
navigator.getUserMedia(constraints, success, failure);
```
## MutationObserver

MutationObserver 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

> MutationObserver 旨在让你能够随着时间的推移观察所需的节点集，即使这些节点之间的直接连接被切断。如果你开始观察节点的子树，并且该子树的一部分被分离并移动到 DOM 中的其他位置，你将继续观察分离的节点段，接收与节点从原始子树分离之前相同的回调。

```js
// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数。observer可重复使用
const observer = new MutationObserver(callback);

// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
const config = {
  childList: true, // 观察目标子节点的变化，是否有添加或者删除
  subtree: true, // 观察后代节点，默认为 false
  characterData: true, // 观察文本变化
  attributes: true, // 观察属性变动，
  attributeFilter: true, // 哪些属性名会被监听的数组。默认全部属性
  attributeOldValue: true, // 记录属性变动前的值
  characterDataOldValue: true, // 记录变化前的文本
};

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 获取并清空队列中的mutationList
var mutationList = observer.takeRecords();

// 之后，可停止观察
observer.disconnect();
```

## Intersection Observer API

交叉观察器 API（Intersection Observer API）提供了一种异步检测目标元素与祖先元素或顶级文档的视口相交情况变化的方法。

```js
/**
 * @root 用作视口的元素，用于检查目标的可见性。必须是目标的祖先。如果未指定或为 null，则默认为浏览器视口。
 * @rootMargin 根周围的边距。其值可以类似于 CSS margin 属性，
 * @threshold 一个数字或一个数字数组，表示目标可见度达到多少百分比时，观察器的回调就应该执行
 * @return  IntersectionObserver对象
 */
let options = {
  root: document.querySelector("#scrollArea"),
  rootMargin: "0px",
  threshold: 1.0,
};

let callback = (entries, observer) => {
  entries.forEach(entry => {
    // 每个条目描述一个目标元素观测点的交叉变化：
    //   entry.boundingClientRect 返回包含目标元素的边界信息的DOMRectReadOnly.边界的计算方式与 Element.getBoundingClientRect（） 相同
    //   entry.intersectionRatio 返回intersectionRect 与boundingClientRect 的比例值。
    //   entry.intersectionRect 返回一个 DOMRectReadOnly 用来描述根和目标元素的相交区域。
    //   entry.isIntersecting 返回一个布尔值，如果目标元素与交叉区域观察者的根相交
    //   entry.rootBounds 用来描述交叉区域观察者中的根。
    //   entry.target 与根出现相交区域改变的元素 （Element）
    //   entry.time 返回一个记录从 的时间原点 到交叉被触发的时间的时间戳
  });
};

let observer = new IntersectionObserver(callback, options);

let target = document.querySelector("#listItem");
// 开始监听和目标元素和root元素的交集
observer.observe(target);
// 停止监听
observer.unobserve();
// 返回所有观察目标的 IntersectionObserverEntry 对象数组并清空数据
observer.takeRecords();
//断开连接，停止监听目标。
observer.disconnect();
// 返回测试交叉时，用作边界盒的元素或文档
observer.root;
// 计算交叉时添加到根边界盒的矩形偏移量，可以有效的缩小或扩大根的判定范围从而满足计算需要
observer.rootMargin;
//一个包含阈值的列表，按升序排列，列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知（Notification）。如果构造器未传入值，则默认值为 0。
observer.thresholds;
```
## Compute Pressure API

Compute Pressure API 是一个 JavaScript API，可让您观察 CPU 等系统资源的压力。

在实时应用程序（如视频会议 Web 应用程序）中，计算压力 API 允许您检测系统当前面临的压力。系统将尽其所能处理任何压力，但系统和应用程序之间的协作有助于最好地处理压力。此 API 会通知您高级压力状态更改，因此您可以调整工作负载，同时仍能提供愉快的用户体验。当系统压力趋势上升或缓解时，会主动传递信号，以便及时适应。

计算压力 API 在以下上下文中可用：

- 窗口（主线程）
- Worker
- SharedWorker
- `<iframe>` （如果提供了合适的 Permissions-Policy）

```js
function callback(PressureRecord) {
  // 属性：state,source,time,toJSON()
  const lastRecord = PressureRecord[PressureRecord.length - 1];
  if (lastRecord.state === "critical") {
    // 目标设备或系统的温度明显升高，需要冷却以避免任何潜在问题
  } else if (lastRecord.state === "serious") {
    // 目标设备压力、温度和/或能源使用始终高度升高。系统可能会进行节流，作为减少热量的对策
  } else if (lastRecord.state === "fair") {
    // 标设备压力、温度和/或能源使用略有升高，可能导致电池寿命缩短，以及风扇（或带有风扇的系统）变得活跃和可听见。除此之外，目标设备运行完美，可以承担额外的工作
  } else {
    //目标设备的状况处于可接受的水平，对用户没有明显的不利影响
  }
}

try {
  const observer = new PressureObserver(callback);
  // PressureObserver.knownSources获取支持的source列表：cpu
  await observer.observe("cpu", {
    sampleInterval: 1000, // 1000ms
  });
  // API 表面类似于其他观察器，例如 IntersectionObserver、MutationObserver 或 PerformanceObserver。
  observer.unobserver();
  observer.takeRecords();
  observer.disconnect();
} catch (error) {
  // report error setting up the observer
}
```
