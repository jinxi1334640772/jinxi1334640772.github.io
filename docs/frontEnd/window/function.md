# Window 函数详解

Window 对象提供了丰富的函数方法，涵盖了性能优化、窗口操作、文件处理、用户交互等各个方面。本文档详细介绍了 Window 对象的各种函数及其用法。

## 目录

1. [性能优化相关](#1-性能优化相关)
2. [定时器函数](#2-定时器函数)
3. [窗口操作](#3-窗口操作)
4. [滚动操作](#4-滚动操作)
5. [样式和选择](#5-样式和选择)
6. [编码和数据处理](#6-编码和数据处理)
7. [文件系统操作](#7-文件系统操作)
8. [图像处理](#8-图像处理)
9. [通信和消息](#9-通信和消息)
10. [用户交互](#10-用户交互)
11. [屏幕和系统信息](#11-屏幕和系统信息)
12. [任务调度](#12-任务调度)
13. [错误处理](#13-错误处理)

## 1. 性能优化相关

### 1.1 requestIdleCallback

`requestIdleCallback()` 允许浏览器告诉你的代码可以安全使用多少时间而不会导致系统延迟，从而有助于确保浏览器的事件循环平稳运行。

#### 使用指南

- 对非高优先级的任务使用空闲回调
- 空闲回调尽可能不超过分配的时间
- 避免在空闲回调中操作 DOM
- 避免运行时间无法预测的任务
- 只有在需要的时候使用 timeout

```javascript
/**
 * @param {Function} callback - 在事件循环空闲时调用的函数
 * @param {Object} options - 配置参数
 * @param {number} options.timeout - 超时时间（毫秒）
 * @return {number} 可传给 cancelIdleCallback() 的 ID
 */
const callbackId = requestIdleCallback((deadline) => {
  console.log('剩余时间:', deadline.timeRemaining());
  console.log('是否超时:', deadline.didTimeout);
  
  // 执行低优先级任务
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    performTask(tasks.shift());
  }
}, { timeout: 1000 });

// 取消回调
cancelIdleCallback(callbackId);
```

### 1.2 requestAnimationFrame

告诉浏览器你希望执行一个动画，要求浏览器在下一次重绘之前调用指定的回调函数。

```javascript
/**
 * @param {Function} callback - 下次重绘前调用的函数
 * @return {number} 请求 ID，可传给 cancelAnimationFrame()
 */
function animate(timestamp) {
  console.log('动画时间戳:', timestamp);
  
  // 执行动画逻辑
  updateAnimation();
  
  // 继续下一帧
  requestAnimationFrame(animate);
}

const animationId = requestAnimationFrame(animate);

// 取消动画
cancelAnimationFrame(animationId);
```

## 2. 定时器函数

### 2.1 setTimeout & clearTimeout

`setTimeout` 执行一次性定时器，`clearTimeout` 清除定时器。

```javascript
// 1000ms 后执行定时器
const timeoutId = setTimeout(() => {
  console.log('定时器执行');
}, 1000);

// 清除定时器
clearTimeout(timeoutId);
```

### 2.2 setInterval & clearInterval

`setInterval` 重复执行定时器，`clearInterval` 清除定时器。

```javascript
// 每 1000ms 执行一次
const intervalId = setInterval(() => {
  console.log('重复执行');
}, 1000);

// 清除定时器
clearInterval(intervalId);
```

### 2.3 setImmediate & clearImmediate

`setImmediate` 立即执行的异步任务（主要在 Node.js 中使用）。

```javascript
const immediateId = setImmediate(() => {
  console.log('立即执行');
});

// 清除任务
clearImmediate(immediateId);
```

## 3. 窗口操作

### 3.1 open & close & stop

#### open() - 打开新窗口

```javascript
/**
 * @param {string} url - 要加载的 URL
 * @param {string} target - 目标窗口名称
 * @param {string} windowFeatures - 窗口特性
 * @return {WindowProxy} 新窗口的引用
 */
const windowFeatures = "left=100,top=100,width=320,height=320";
const newWindow = window.open(
  "https://www.example.com",
  "exampleWindow",
  windowFeatures
);

if (!newWindow) {
  console.log("弹窗被阻止");
}
```

#### close() - 关闭窗口

```javascript
// 关闭指定窗口（只能关闭由脚本打开的窗口）
function closeWindow() {
  if (newWindow && !newWindow.closed) {
    newWindow.close();
  }
}

// 关闭当前窗口
function closeCurrentWindow() {
  window.close();
}
```

#### stop() - 停止加载

```javascript
// 停止页面加载
window.stop();
```

### 3.2 focus & print

```javascript
// 将窗口置于前台
if (userInteracted) {
  window.focus();
}

// 打开打印对话框
window.print();
```

### 3.3 窗口移动和调整大小

#### moveTo & moveBy

```javascript
// 移动窗口到指定位置
window.moveTo(100, 100);

// 相对移动窗口
window.moveBy(50, 50);

// 移动到屏幕左上角
function moveToOrigin() {
  window.moveTo(0, 0);
}
```

#### resizeTo & resizeBy

```javascript
// 调整窗口到指定大小
window.resizeTo(800, 600);

// 相对调整窗口大小
window.resizeBy(100, 50);

// 调整到屏幕的 1/4 大小
function resizeToQuarter() {
  window.resizeTo(
    window.screen.availWidth / 2,
    window.screen.availHeight / 2
  );
}
```

## 4. 滚动操作

### 4.1 scroll & scrollTo & scrollBy

```javascript
// 滚动到指定位置（scroll 和 scrollTo 等价）
window.scroll(0, 100);
window.scrollTo(0, 100);

// 平滑滚动
window.scroll({
  top: 100,
  left: 100,
  behavior: "smooth"
});

// 相对滚动
window.scrollBy(0, 100);

// 平滑相对滚动
window.scrollBy({
  top: 100,
  behavior: "smooth"
});
```

## 5. 样式和选择

### 5.1 getComputedStyle

获取元素的计算样式。

```javascript
/**
 * @param {Element} element - 目标元素
 * @param {string} pseudoElement - 伪元素（可选）
 * @return {CSSStyleDeclaration} 计算样式对象
 */
const element = document.getElementById("myElement");
const computedStyle = window.getComputedStyle(element);

// 获取特定样式属性
const height = computedStyle.getPropertyValue("height");
const fontSize = computedStyle.fontSize;

// 获取伪元素样式
const pseudoStyle = getComputedStyle(element, "::after");
const pseudoContent = pseudoStyle.content;
```

### 5.2 getSelection

获取用户选择的文本范围。

```javascript
const selection = window.getSelection();

// 选择对象的属性
console.log("选择的文本:", selection.toString());
console.log("选区数量:", selection.rangeCount);
console.log("是否折叠:", selection.isCollapsed);

if (selection.rangeCount > 0) {
  const range = selection.getRangeAt(0);
  console.log("选区范围:", range);
}

// 选择操作
function selectAllInElement(element) {
  const selection = window.getSelection();
  selection.selectAllChildren(element);
}

function clearSelection() {
  const selection = window.getSelection();
  selection.removeAllRanges();
}
```

## 6. 编码和数据处理

### 6.1 atob & btoa

Base64 编码和解码。

```javascript
// Base64 编码
const encoded = window.btoa("Hello, world!");
console.log("编码后:", encoded); // SGVsbG8sIHdvcmxkIQ==

// Base64 解码
const decoded = window.atob(encoded);
console.log("解码后:", decoded); // Hello, world!

// 处理 Unicode 字符
function utf8ToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
```

### 6.2 structuredClone

使用结构化克隆算法进行深拷贝。

```javascript
/**
 * @param {any} value - 被克隆的值
 * @param {Object} options - 选项
 * @param {Array} options.transfer - 可转移对象数组
 * @return {any} 深拷贝后的值
 */

// 基本深拷贝
const original = { name: "MDN", data: { count: 42 } };
const clone = structuredClone(original);

// 支持循环引用
const circularObj = { name: "test" };
circularObj.self = circularObj;
const clonedCircular = structuredClone(circularObj);

// 转移对象（适用于 ArrayBuffer 等）
const arrayBuffer = new ArrayBuffer(1024);
const transferred = structuredClone(
  { buffer: arrayBuffer },
  { transfer: [arrayBuffer] }
);
```

## 7. 文件系统操作

> **注意：** 以下 API 仅在安全上下文（HTTPS）中可用。

### 7.1 showOpenFilePicker

显示文件选择器以选择文件。

```javascript
/**
 * @param {Object} options - 选择器选项
 * @return {Promise<FileSystemFileHandle[]>} 文件句柄数组
 */
async function openFile() {
  const pickerOpts = {
    types: [{
      description: "图片文件",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"]
      }
    }],
    excludeAcceptAllOption: true,
    multiple: false
  };

  try {
    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    const file = await fileHandle.getFile();
    console.log("选择的文件:", file.name);
    return file;
  } catch (err) {
    console.error("用户取消选择或发生错误:", err);
  }
}
```

### 7.2 showSaveFilePicker

显示文件保存对话框。

```javascript
async function saveFile(content) {
  const opts = {
    types: [{
      description: "文本文件",
      accept: { "text/plain": [".txt"] }
    }],
    suggestedName: "example.txt"
  };

  try {
    const fileHandle = await window.showSaveFilePicker(opts);
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    console.log("文件保存成功");
  } catch (err) {
    console.error("保存失败:", err);
  }
}
```

### 7.3 showDirectoryPicker

显示目录选择器。

```javascript
async function openDirectory() {
  const options = {
    mode: "readwrite",
    startIn: "documents"
  };

  try {
    const dirHandle = await window.showDirectoryPicker(options);
    
    // 遍历目录内容
    for await (const [name, handle] of dirHandle.entries()) {
      console.log(handle.kind === "file" ? "文件:" : "目录:", name);
    }
    
    return dirHandle;
  } catch (err) {
    console.error("选择目录失败:", err);
  }
}

// 递归遍历目录
async function* getFilesRecursively(dirHandle) {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "file") {
      yield handle;
    } else if (handle.kind === "directory") {
      yield* getFilesRecursively(handle);
    }
  }
}
```

## 8. 图像处理

### 8.1 createImageBitmap

从给定的来源创建位图。

```javascript
/**
 * @param {ImageBitmapSource} image - 图像源
 * @param {Object} options - 选项
 * @return {Promise<ImageBitmap>} ImageBitmap 对象
 */
async function processImage() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();

  image.onload = async () => {
    try {
      // 创建不同的位图
      const bitmaps = await Promise.all([
        createImageBitmap(image, 0, 0, 32, 32), // 裁剪
        createImageBitmap(image, { 
          imageOrientation: "flipY",
          resizeWidth: 100,
          resizeHeight: 100,
          resizeQuality: "high"
        })
      ]);

      // 绘制到画布
      bitmaps.forEach((bitmap, index) => {
        ctx.drawImage(bitmap, index * 110, 0);
      });
    } catch (err) {
      console.error("创建位图失败:", err);
    }
  };

  image.src = "example.jpg";
}
```

## 9. 通信和消息

### 9.1 postMessage

实现跨源通信。

```javascript
/**
 * @param {any} message - 要发送的消息
 * @param {string} targetOrigin - 目标源
 * @param {Array} transfer - 可转移对象数组
 */

// 发送消息
const iframe = document.getElementById("myIframe");
iframe.contentWindow.postMessage(
  { type: "greeting", data: "Hello!" },
  "https://trusted-domain.com"
);

// 监听消息
window.addEventListener("message", (event) => {
  // 安全检查：验证来源
  const allowedOrigins = [
    "https://trusted-domain.com",
    "https://another-trusted.com"
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    console.warn("来自不信任源的消息:", event.origin);
    return;
  }

  console.log("收到消息:", event.data);
  console.log("来源:", event.origin);
  
  // 回复消息
  event.source.postMessage(
    { type: "response", data: "Message received!" },
    event.origin
  );
});
```

## 10. 用户交互

### 10.1 alert & confirm & prompt

用户交互对话框。

```javascript
// 警告框
window.alert("这是一个警告消息");

// 确认框
if (window.confirm("确定要删除这个文件吗？")) {
  console.log("用户确认删除");
} else {
  console.log("用户取消操作");
}

// 输入框
const userInput = window.prompt("请输入您的姓名:", "默认值");
if (userInput !== null) {
  console.log("用户输入:", userInput);
} else {
  console.log("用户取消输入");
}

// 实际应用示例
function getUserPreference() {
  const preference = prompt("选择主题 (light/dark):", "light");
  return preference === "dark" ? "dark" : "light";
}
```

## 11. 屏幕和系统信息

### 11.1 getScreenDetails

获取多屏幕信息。

```javascript
async function getScreenInfo() {
  try {
    const screenDetails = await window.getScreenDetails();
    
    console.log("屏幕数量:", screenDetails.screens.length);
    
    // 在每个屏幕上打开窗口
    screenDetails.screens.forEach((screen, index) => {
      window.open(
        "https://example.com",
        `screen_${index}`,
        `left=${screen.availLeft},
         top=${screen.availTop},
         width=${screen.availWidth},
         height=${screen.availHeight}`
      );
    });
  } catch (err) {
    console.error("获取屏幕信息失败:", err);
  }
}
```

### 11.2 queryLocalFonts

查询本地字体。

```javascript
async function getLocalFonts() {
  try {
    const fonts = await window.queryLocalFonts({
      postscriptNames: ["Arial", "Helvetica", "Times-Roman"]
    });

    for (const font of fonts) {
      console.log("字体名称:", font.fullName);
      console.log("字体族:", font.family);
      console.log("字体样式:", font.style);
      console.log("PostScript 名称:", font.postscriptName);
      
      // 获取字体数据
      const fontBlob = await font.blob();
      console.log("字体数据大小:", fontBlob.size, "bytes");
    }
  } catch (err) {
    console.error("查询字体失败:", err);
  }
}
```

### 11.3 matchMedia

媒体查询匹配。

```javascript
// 检查媒体查询
const mediaQuery = window.matchMedia("(max-width: 768px)");

console.log("是否匹配:", mediaQuery.matches);

// 监听媒体查询变化
function handleMediaChange(event) {
  if (event.matches) {
    console.log("屏幕宽度小于等于 768px");
    // 应用移动端样式
  } else {
    console.log("屏幕宽度大于 768px");
    // 应用桌面端样式
  }
}

mediaQuery.addEventListener("change", handleMediaChange);

// 多个媒体查询
const queries = {
  mobile: "(max-width: 768px)",
  tablet: "(min-width: 769px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)"
};

Object.entries(queries).forEach(([name, query]) => {
  const mq = window.matchMedia(query);
  console.log(`${name}:`, mq.matches);
});
```

## 12. 任务调度

### 12.1 queueMicrotask

将微任务加入队列。

```javascript
/**
 * @param {Function} callback - 微任务回调函数
 */

// 基本用法
queueMicrotask(() => {
  console.log("这是一个微任务");
});

// 实际应用：确保异步行为一致性
class DataLoader {
  constructor() {
    this._cache = new Map();
  }
  
  loadData(url) {
    if (this._cache.has(url)) {
      // 使用微任务确保异步行为一致
    queueMicrotask(() => {
        this._setData(this._cache.get(url));
      this.dispatchEvent(new Event("load"));
    });
  } else {
    fetch(url)
        .then(response => response.json())
      .then(data => {
          this._cache.set(url, data);
        this._setData(data);
        this.dispatchEvent(new Event("load"));
      });
  }
  }
}
```

## 13. 错误处理

### 13.1 reportError

报告错误到全局错误处理器。

```javascript
/**
 * @param {Error} error - 错误对象
 */

// 创建和报告自定义错误
const customError = new Error("自定义错误信息");
customError.code = "CUSTOM_ERROR";
window.reportError(customError);

// 全局错误处理
window.addEventListener("error", (event) => {
  console.error("全局错误:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// 在回调库中使用
class EventEmitter {
  emit(eventName, ...args) {
    const listeners = this._listeners[eventName] || [];
    
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        // 将回调错误报告给全局处理器
        window.reportError(error);
      }
    });
  }
}
```

## 14. 最佳实践

### 14.1 性能优化

```javascript
// 使用 requestIdleCallback 处理低优先级任务
const tasks = [];

function processTasks(deadline) {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    task();
  }
  
  if (tasks.length > 0) {
    requestIdleCallback(processTasks);
  }
}

function addTask(task) {
  tasks.push(task);
  if (tasks.length === 1) {
    requestIdleCallback(processTasks);
  }
}

// 使用 requestAnimationFrame 进行动画
let animationId;

function animate() {
  // 动画逻辑
  updateAnimation();
  
  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (!animationId) {
    animationId = requestAnimationFrame(animate);
  }
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
```

### 14.2 错误处理和降级

```javascript
// 特性检测和降级
async function selectFile() {
  if ('showOpenFilePicker' in window) {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      return await fileHandle.getFile();
    } catch (err) {
      console.log("用户取消选择或不支持");
    }
  } else {
    // 降级到传统文件输入
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    
    return new Promise(resolve => {
      input.onchange = () => {
        resolve(input.files[0]);
      };
    });
  }
}

// 安全的 postMessage
function safePostMessage(targetWindow, message, targetOrigin) {
  try {
    targetWindow.postMessage(message, targetOrigin);
  } catch (err) {
    console.error("发送消息失败:", err);
  }
}
```

### 14.3 资源管理

```javascript
// 正确清理定时器和动画
class ComponentManager {
  constructor() {
    this.timers = new Set();
    this.animations = new Set();
  }
  
  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);
    this.timers.add(id);
    return id;
  }
  
  requestAnimationFrame(callback) {
    const id = requestAnimationFrame(() => {
      this.animations.delete(id);
      callback();
    });
    this.animations.add(id);
    return id;
  }
  
  cleanup() {
    // 清理所有定时器
    this.timers.forEach(id => clearTimeout(id));
    this.timers.clear();
    
    // 清理所有动画
    this.animations.forEach(id => cancelAnimationFrame(id));
    this.animations.clear();
  }
}
```

## 15. 参考资料

- [MDN - Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)
- [MDN - 性能 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API)
- [MDN - 文件系统访问 API](https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_Access_API)
- [MDN - Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [MDN - 画布 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [MDN - 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries)
- [MDN - 结构化克隆算法](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
