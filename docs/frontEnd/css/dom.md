---
title: DOM 接口详解
description: 深入理解 DOM 接口和 API，包括 EventTarget、Node、Element 等核心接口
outline: deep
---

# DOM 接口详解

::: info 概述
DOM（Document Object Model）是 Web API 的核心部分，提供了操作文档结构、样式和内容的接口。本文详细介绍了 DOM 的各个接口及其使用方法。
:::

## 🎯 EventTarget

EventTarget 接口是所有可以接收事件并创建事件监听器的对象的基础接口。

### 继承关系

任何事件目标都继承自该接口，包括：

- `document`
- `Element` 及其子项
- `window`
- `XMLHttpRequest`
- `Node`
- `AudioNode`
- `AudioContext`
- 等等...

### 核心方法

| 方法 | 说明 |
|------|------|
| `addEventListener()` | 注册特定事件类型的事件处理程序 |
| `removeEventListener()` | 删除事件侦听器 |
| `dispatchEvent()` | 派发事件 |

### 使用示例

```javascript
// 基于 EventTarget 创建自定义事件类
class MyEventTarget extends EventTarget {
  constructor(mySecret) {
    super();
    this._secret = mySecret;
  }

  get secret() {
    return this._secret;
  }
}

let myEventTarget = new MyEventTarget(5);
let value = myEventTarget.secret; // === 5

// 注册事件监听器：调用继承自 EventTarget 的 addEventListener 方法
myEventTarget.addEventListener("foo", e => {
  myEventTarget._secret = e.detail;
});

// 创建自定义事件
let event = new CustomEvent("foo", { detail: 7 });

// 触发事件：调用继承自 EventTarget 的 dispatchEvent
myEventTarget.dispatchEvent(event);
let newValue = myEventTarget.secret; // === 7
```

## 🌳 Node

Node 接口是 DOM 树中所有节点类型的基础接口。

### 子类

各种类型的 DOM API 对象都继承自 Node 接口：

- `Document`
- `Element`
- `Attr`
- `CharacterData`
- `DocumentFragment`
- `DocumentType`
- `Notation`
- `Entity`

### 核心属性

#### 基本信息

| 属性 | 说明 |
|------|------|
| `baseURI` | 返回 baseURL |
| `isConnected` | 是否已连接上下文对象 |
| `nodeName` | 节点名字（Element 为标签名，Text 为 `#text`，Document 为 `#document`） |
| `nodeType` | 返回节点类型对应的整数值 |
| `nodeValue` | 返回或设置当前节点的值 |
| `ownerDocument` | 所属的 Document 对象 |

#### 节点类型常量

| 类型 | 值 | 说明 |
|------|----|----- |
| `ELEMENT_NODE` | 1 | Element 节点 |
| `ATTRIBUTE_NODE` | 2 | Attribute 属性节点 |
| `TEXT_NODE` | 3 | Text 文本节点 |
| `COMMENT_NODE` | 8 | Comment 注释节点 |
| `DOCUMENT_NODE` | 9 | Document 文档节点 |
| `DOCUMENT_TYPE_NODE` | 10 | DocumentType 文档类型节点 |
| `DOCUMENT_FRAGMENT_NODE` | 11 | DocumentFragment 文档片段节点 |

#### 节点关系

| 属性 | 说明 |
|------|------|
| `parentNode` / `parentElement` | 父节点/父元素 |
| `childNodes` | 子节点集合 |
| `firstChild` / `lastChild` | 第一个/最后一个子节点 |
| `previousSibling` / `nextSibling` | 上一个/下一个兄弟节点 |
| `textContent` | 返回或设置所有子节点及其后代的文本内容 |

### 核心方法

#### 节点操作

```javascript
// 子节点操作
node.appendChild(newChild);
node.insertBefore(newChild, referenceChild);
node.replaceChild(newChild, oldChild);
node.removeChild(oldChild);

// 节点检查
node.hasChildNodes();
node.hasAttributes();
node.contains(otherNode);

// 节点比较
node.isEqualNode(otherNode);
node.isSameNode(otherNode);

// 节点克隆
const clonedNode = node.cloneNode(deep); // deep: 是否深度克隆

// 文本处理
node.normalize(); // 合并相邻文本节点并清除空文本节点
```

#### 命名空间相关

```javascript
// 命名空间检查
node.isDefaultNamespace(namespaceURI);
node.lookupPrefix(namespaceURI);
node.lookupNamespaceURI(prefix);

// 获取根节点
const rootNode = node.getRootNode();

// 文档位置比较
const position = node.compareDocumentPosition(otherNode);
```

### 事件

| 事件 | 说明 |
|------|------|
| `onselectstart` | 用户进行新选择时触发 |

## 📦 Element

Element 是最通用的基类，Document 中的所有元素对象都继承自它。

### 核心属性

#### 基本信息

| 属性 | 说明 |
|------|------|
| `tagName` | 标签名称 |
| `id` | 元素 ID |
| `className` | class 属性字符串 |
| `classList` | class 属性的 DOMTokenList 对象 |
| `innerHTML` | 内容标记 |
| `outerHTML` | 元素的标记（包括其内容） |

#### 命名空间相关

| 属性 | 说明 |
|------|------|
| `localName` | 限定名称的本地部分 |
| `namespaceURI` | 元素对应的命名空间 URI |
| `prefix` | 命名空间前缀 |

#### 尺寸和位置

| 属性 | 说明 |
|------|------|
| `clientHeight` / `clientWidth` | 内部高度/宽度 |
| `clientLeft` / `clientTop` | 左/上边界宽度 |
| `scrollHeight` / `scrollWidth` | 元素滚动视图高度/宽度 |
| `scrollLeft` / `scrollTop` | 元素左/垂直滚动偏移量 |

#### 元素关系

| 属性 | 说明 |
|------|------|
| `children` | 子元素集合 |
| `childElementCount` | 子元素个数 |
| `firstElementChild` / `lastElementChild` | 第一个/最后一个子元素 |
| `previousElementSibling` / `nextElementSibling` | 上一个/下一个兄弟元素 |

#### 特殊属性

| 属性 | 说明 |
|------|------|
| `attributes` | 属性节点集合（NamedNodeMap） |
| `assignedSlot` | 节点所插入的 `<slot>` 元素 |
| `shadowRoot` | 元素挂载的开放影子根 |
| `slot` | 插入的影子 DOM 插槽名称 |
| `part` | 元素的部分标识符 DOMTokenList 对象 |
| `elementTiming` | PerformanceElementTiming API 标记 |

### NamedNodeMap

`attributes` 属性返回的 NamedNodeMap 对象提供以下方法：

```javascript
const attributes = element.attributes;

// 获取属性
const myAttr = attributes.getNamedItem("attributeName");
const myAttr2 = attributes.getNamedItemNS(namespaceURI, "attributeName");

// 设置属性
attributes.setNamedItem(attrNode);
attributes.setNamedItemNS(attrNode);

// 删除属性
const removedAttr = attributes.removeNamedItem("attributeName");
const removedAttr2 = attributes.removeNamedItemNS(namespaceURI, "attributeName");

// 通过索引访问
const attrByIndex = attributes.item(index);
const length = attributes.length;
```

### 核心方法

#### 元素查询

```javascript
// 选择器查询
const element = parent.querySelector("selector");
const elements = parent.querySelectorAll("selector");

// 按类名和标签查询
const byClass = parent.getElementsByClassName("className");
const byTag = parent.getElementsByTagName("tagName");

// 匹配检查
const matches = element.matches("selector");
const closest = element.closest("selector");
```

#### 属性操作

```javascript
// 属性操作
element.getAttribute("name");
element.setAttribute("name", "value");
element.hasAttribute("name");
element.removeAttribute("name");

// 属性节点操作
const attrNode = element.getAttributeNode("name");
element.setAttributeNode(attrNode);
element.removeAttributeNode(attrNode);

// 布尔属性切换
element.toggleAttribute("disabled");
element.toggleAttribute("disabled", true); // 强制设置为 true

// 获取所有属性名
const attrNames = element.getAttributeNames();
```

#### 元素插入

```javascript
// 相对位置插入
element.insertAdjacentElement(position, newElement);
element.insertAdjacentText(position, text);
element.insertAdjacentHTML(position, htmlString);

// position 可选值：
// - "beforebegin": targetElement 之前
// - "afterbegin": targetElement 内部的第一个子节点之前
// - "beforeend": targetElement 内部的最后一个子节点之后
// - "afterend": targetElement 之后

// 示例
element.insertAdjacentHTML("beforeend", "<p>新段落</p>");
```

#### 元素操作

```javascript
// 元素修改
element.before(node1, node2, ...); // 在元素之前插入
element.after(node1, node2, ...);  // 在元素之后插入
element.append(node1, node2, ...); // 在最后一个子元素后插入
element.prepend(node1, node2, ...); // 在第一个子元素前插入

// 元素替换和删除
element.replaceWith(newElement);
element.replaceChildren(child1, child2, ...);
element.remove();
```

#### 尺寸和位置方法

```javascript
// 获取位置信息
const rect = element.getBoundingClientRect();
const rects = element.getClientRects();

// 滚动操作
element.scroll(x, y);
element.scrollTo(x, y);
element.scrollBy(deltaX, deltaY);

// 滚动到视图
element.scrollIntoView();
element.scrollIntoView(alignToTop);
element.scrollIntoView({
  behavior: "smooth", // "smooth" | "instant" | "auto"
  block: "start",     // "start" | "center" | "end" | "nearest"
  inline: "nearest"   // "start" | "center" | "end" | "nearest"
});
```

#### 高级功能

```javascript
// 影子 DOM
const shadowRoot = element.attachShadow({ mode: "open" });

// 动画
const animation = element.animate(keyframes, options);
const animations = element.getAnimations();

// 全屏
element.requestFullscreen();

// 指针锁定
element.requestPointerLock();

// 指针捕获
element.setPointerCapture(pointerId);
element.hasPointerCapture(pointerId);
element.releasePointerCapture(pointerId);

// 样式映射
const styleMap = element.computedStyleMap();
for (const [prop, val] of styleMap) {
  console.log("属性：", prop);
  console.log("属性值：", val);
}
```

### 主要事件

#### 动画事件
- `animationstart` / `animationiteration` / `animationend` / `animationcancel`

#### 剪贴板事件
- `copy` / `cut` / `paste`

#### 输入法事件
- `compositionstart` / `compositionupdate` / `compositionend`

#### 焦点事件
- `blur` / `focus` / `focusin` / `focusout`

#### 全屏事件
- `fullscreenchange` / `fullscreenerror`

#### 键盘事件
- `keydown` / `keypress` / `keyup`

#### 鼠标事件
- `click` / `dblclick` / `contextmenu` / `wheel`
- `mouseenter` / `mousemove` / `mouseleave` / `mouseout` / `mouseover`
- `mousedown` / `mouseup`

::: tip 鼠标事件区别
- `mouseover` 和 `mouseout` 会冒泡，包含子元素的事件
- `mouseenter` 和 `mouseleave` 不会冒泡，只在元素边界触发
:::

#### 指针事件
- `pointerdown` / `pointerup` / `pointermove`
- `pointerover` / `pointerout` / `pointerenter` / `pointerleave`
- `pointercancel` / `pointerrawupdate`
- `gotpointercapture` / `lostpointercapture`

#### 触摸和手势事件
- `touchstart` / `touchmove` / `touchend` / `touchcancel`
- `gesturestart` / `gesturechange` / `gestureend`

#### 过渡事件
- `transitionstart` / `transitionrun` / `transitionend` / `transitioncancel`

#### 其他事件
- `scroll` / `scrollend`
- `beforematch` - 元素即将因查找而显示
- `contentvisibilityautostatechange` - content-visibility: auto 状态变化
- `securitypolicyviolation` - 内容安全策略违规

## 📝 CharacterData

CharacterData 是包含字符数据的 Node 对象的抽象接口。

### 实现接口

- `Text`
- `Comment`
- `ProcessingInstruction`

### 属性和方法

| 属性/方法 | 说明 |
|-----------|------|
| `data` | 包含的文本数据 |
| `length` | 字符串的大小 |
| `previousElementSibling` / `nextElementSibling` | 上/下一个元素节点 |

#### 数据操作方法

```javascript
// 文本操作
characterData.appendData(string);              // 追加字符
characterData.insertData(offset, string);      // 插入字符
characterData.replaceData(offset, count, data); // 替换字符
characterData.deleteData(offset, count);       // 删除字符
characterData.substringData(offset, count);    // 截取字符

// 删除节点
characterData.remove();
```

## 📄 Text

Text 接口表示 DOM 树中的文本节点。

### 继承关系

```
Text ← CharacterData ← Node ← EventTarget
```

### 特有属性和方法

| 属性/方法 | 说明 |
|-----------|------|
| `assignedSlot` | 返回当前节点所在的 `<slot>` 元素 |
| `wholeText` | 返回相邻所有文本节点的合并文本 |
| `splitText(offset)` | 在指定位置将节点分成两个节点 |

### 使用示例

```javascript
// 创建文本节点
const textNode = document.createTextNode("Hello World");

// 分割文本节点
const secondPart = textNode.splitText(5); // "Hello" 和 " World"

// 获取完整文本（包括相邻文本节点）
console.log(textNode.wholeText);
```

## 🏷️ Attr

Attr 接口表示元素的属性对象。

### 属性

| 属性 | 说明 |
|------|------|
| `name` | 属性的限定名 |
| `localName` | 属性限定名的本地部分 |
| `value` | 属性值 |
| `prefix` | 命名空间前缀 |
| `namespaceURI` | 命名空间 URI |
| `ownerElement` | 属性所属的元素 |

### 使用示例

```javascript
const element = document.getElementById("example");
const attr = element.getAttributeNode("class");

console.log(attr.name);         // "class"
console.log(attr.value);        // 类名值
console.log(attr.ownerElement); // element 引用
```

## 🔧 DOMParser

DOMParser 可以将字符串中的 XML 或 HTML 源代码解析为 DOM Document。

### 基本用法

```javascript
const domParser = new DOMParser();

/**
 * @param {string} string - 要解析的字符串
 * @param {string} mimeType - MIME 类型
 * @returns {Document} 解析后的文档对象
 */
const doc = domParser.parseFromString(string, mimeType);
```

### 支持的 MIME 类型

| MIME 类型 | 说明 |
|-----------|------|
| `text/html` | HTML 文档 |
| `text/xml` | XML 文档 |
| `application/xml` | XML 应用程序 |
| `application/xhtml+xml` | XHTML 文档 |
| `image/svg+xml` | SVG 图像 |

### 使用示例

```javascript
const htmlString = '<div><p>Hello World</p></div>';
const xmlString = '<?xml version="1.0"?><root><item>test</item></root>';

// 解析 HTML
const htmlDoc = domParser.parseFromString(htmlString, 'text/html');
const div = htmlDoc.querySelector('div');

// 解析 XML
const xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
const item = xmlDoc.querySelector('item');
```

::: tip 相关接口
使用 `XMLSerializer` 接口可以执行相反的操作——将 DOM 树转换为 XML 或 HTML 源代码。
:::

## 📐 DOMRect

DOMRect 表示一个矩形区域。

### 属性

| 属性 | 说明 |
|------|------|
| `x` / `y` | 矩形原点的坐标 |
| `width` / `height` | 矩形的宽度和高度 |
| `top` | 顶部坐标（等于 y） |
| `bottom` | 底部坐标（等于 y + height） |
| `left` | 左侧坐标（等于 x） |
| `right` | 右侧坐标（等于 x + width） |

### 静态方法

```javascript
// 创建 DOMRect 对象
const rect = DOMRect.fromRect({
  x: 10,
  y: 20,
  width: 100,
  height: 50
});
```

### 使用示例

```javascript
const element = document.getElementById("myElement");
const rect = element.getBoundingClientRect();

console.log(`位置: (${rect.x}, ${rect.y})`);
console.log(`尺寸: ${rect.width} × ${rect.height}`);
console.log(`边界: top=${rect.top}, right=${rect.right}, bottom=${rect.bottom}, left=${rect.left}`);
```

## 🎫 DOMTokenList

DOMTokenList 接口表示一组空格分隔的标记（tokens）。

### 常见返回值

- `Element.classList`
- `HTMLLinkElement.relList`
- `HTMLAnchorElement.relList`
- `HTMLAreaElement.relList`

### 属性和方法

| 属性/方法 | 说明 |
|-----------|------|
| `length` | 标记个数 |
| `value` | 以字符串形式返回列表值 |

#### 操作方法

```javascript
const classList = element.classList;

// 基本操作
classList.add("class1", "class2");           // 添加类
classList.remove("class1", "class2");        // 移除类
classList.toggle("active");                  // 切换类
classList.toggle("active", true);            // 强制添加
classList.contains("active");                // 检查是否包含
classList.replace("oldClass", "newClass");   // 替换类

// 访问方法
classList.item(index);                       // 通过索引访问
classList[index];                            // 等价写法

// 检查支持
classList.supports("token");                 // 检查是否支持（某些情况下）

// 迭代方法
classList.forEach((token, index) => {
  console.log(token, index);
});

// 迭代器
for (const token of classList.keys()) { /* ... */ }
for (const token of classList.values()) { /* ... */ }
for (const [index, token] of classList.entries()) { /* ... */ }
```

## 📋 Document

Document 接口表示在浏览器中载入的网页，是 DOM 树的入口。

### 继承关系

```
Document ← Node ← EventTarget
```

### 子类型

- **HTMLDocument** - HTML 文档（content-type: text/html）
- **XMLDocument** - XML 和 SVG 文档

### 核心属性

#### 文档结构

| 属性 | 说明 |
|------|------|
| `documentElement` | 文档的根元素（通常是 `<html>`） |
| `body` | `<body>` 或 `<frameset>` 元素 |
| `head` | `<head>` 元素 |
| `doctype` | 文档类型定义 |

#### 文档信息

| 属性 | 说明 |
|------|------|
| `characterSet` | 文档使用的字符集 |
| `compatMode` | 渲染模式（"quirks" 或 "CSS1Compat"） |
| `contentType` | 文档的 MIME 类型 |
| `documentURI` | 文档的 URI |

#### 元素集合

| 属性 | 说明 |
|------|------|
| `children` | 文档的子元素 |
| `childElementCount` | 子元素数量 |
| `firstElementChild` / `lastElementChild` | 第一个/最后一个子元素 |

#### 特定元素集合

```javascript
// 获取特定类型的元素集合
const embeds = document.embeds;      // <embed> 元素
const forms = document.forms;        // <form> 元素
const images = document.images;      // <img> 元素
const links = document.links;        // <a> 和 <area> 元素
const scripts = document.scripts;    // <script> 元素
const plugins = document.plugins;    // 插件元素
```

#### 状态属性

| 属性 | 说明 |
|------|------|
| `hidden` | 页面是否隐藏 |
| `visibilityState` | 文档可见性（"visible"、"hidden"、"prerender"、"unloaded"） |
| `readyState` | 文档加载状态（"loading"、"interactive"、"complete"） |

#### 特殊元素

| 属性 | 说明 |
|------|------|
| `activeElement` | 当前获得焦点的元素 |
| `currentScript` | 正在执行的 `<script>` 元素 |
| `fullscreenElement` | 当前全屏的元素 |
| `pointerLockElement` | 指针锁定的元素 |
| `scrollingElement` | 滚动文档的元素引用 |
| `pictureInPictureElement` | 当前画中画模式的元素 |

#### 高级属性

| 属性 | 说明 |
|------|------|
| `adoptedStyleSheets` | 构造样式表数组 |
| `styleSheets` | 文档的样式表列表 |
| `fonts` | FontFaceSet 接口 |
| `implementation` | DOM 实现对象 |
| `timeline` | DocumentTimeline 实例 |

### 创建方法

```javascript
// 创建元素和节点
const element = document.createElement("div");
const textNode = document.createTextNode("Hello");
const comment = document.createComment("注释");
const fragment = document.createDocumentFragment();
const attr = document.createAttribute("class");

// 创建事件和范围
const event = document.createEvent("MouseEvents"); // 已废弃，使用 new Event()
const range = document.createRange();

// 处理指令（XML）
const pi = document.createProcessingInstruction("xml-stylesheet", 'href="style.css"');
```

### 查询方法

```javascript
// 基本查询
const byId = document.getElementById("myId");
const byClass = document.getElementsByClassName("myClass");
const byTag = document.getElementsByTagName("div");
const byName = document.getElementsByName("myName");

// 命名空间查询
const byTagNS = document.getElementsByTagNameNS(namespaceURI, "tagName");

// 选择器查询
const single = document.querySelector(".class #id");
const multiple = document.querySelectorAll("div.item");

// 坐标查询
const topElement = document.elementFromPoint(x, y);
const allElements = document.elementsFromPoint(x, y);

// 光标位置查询
const range = document.caretRangeFromPoint(x, y);
const position = document.caretPositionFromPoint(x, y);
```

### 遍历方法

```javascript
// 创建节点迭代器
const nodeIterator = document.createNodeIterator(
  document.body,                    // 根节点
  NodeFilter.SHOW_ELEMENT,         // 显示类型
  (node) => {                      // 过滤器
    return node.nodeName.toLowerCase() === "p"
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT;
  }
);

// 使用迭代器
const paragraphs = [];
let currentNode;
while ((currentNode = nodeIterator.nextNode())) {
  paragraphs.push(currentNode);
}

// 创建树遍历器
const treeWalker = document.createTreeWalker(
  document.querySelector("#root"),
  NodeFilter.SHOW_TEXT
);

// 使用树遍历器
while (treeWalker.nextNode()) {
  const currentNode = treeWalker.currentNode;
  console.log(currentNode.textContent);
}
```

### 其他方法

```javascript
// 节点操作
const adoptedNode = document.adoptNode(externalNode);  // 采用外部节点
const importedNode = document.importNode(externalNode, deep); // 导入节点拷贝

// 选择和焦点
const selection = document.getSelection();             // 获取选择对象
const hasFocus = document.hasFocus();                 // 检查是否有焦点

// 全屏和画中画
document.exitFullscreen();                           // 退出全屏
document.exitPictureInPicture();                     // 退出画中画
document.exitPointerLock();                          // 释放指针锁

// 动画
const animations = document.getAnimations();          // 获取所有动画

// 存储访问（第三方 cookie）
const hasAccess = await document.hasStorageAccess();
await document.requestStorageAccess();

// 文档操作
document.open();                                      // 打开文档流
document.write("<p>Hello</p>");                     // 写入文档
document.writeln("<p>Hello</p>");                   // 写入文档（带换行）
document.close();                                    // 关闭文档流

// XPath（XML 文档）
const expression = document.createExpression("//div", resolver);
const resolver = document.createNSResolver(contextNode);
const result = document.evaluate(xpath, contextNode, resolver, resultType);
```

### 主要事件

#### 文档生命周期
- `DOMContentLoaded` - DOM 完全加载和解析
- `readystatechange` - 文档状态改变

#### 脚本事件
- `beforescriptexecute` / `afterscriptexecute` - 脚本执行前后

#### 视图事件
- `scroll` / `wheel` - 滚动和滚轮事件
- `visibilitychange` - 可见性改变
- `selectionchange` - 选择改变

#### 全屏事件
- `fullscreenchange` / `fullscreenerror`

#### 其他事件
- 所有 Element 支持的事件（动画、键盘、鼠标、触摸等）

## 📄 HTMLDocument

HTMLDocument 扩展了 Document 接口，专门用于 HTML 文档。

### 继承关系

```
HTMLDocument ← Document ← Node ← EventTarget
```

### 扩展属性

| 属性 | 说明 |
|------|------|
| `cookie` | 文档的 cookie 字符串 |
| `defaultView` | window 对象的引用 |
| `designMode` | 文档编辑模式（"on" 或 "off"） |
| `dir` | 文档文字方向（"ltr" 或 "rtl"） |
| `domain` | 文档域名 |
| `lastModified` | 最后修改时间 |
| `location` | Location 对象 |
| `referrer` | 来源页面 URI |
| `title` | 文档标题 |
| `URL` | 文档 URL |

### 使用示例

```javascript
// 基本信息
console.log(document.title);        // 页面标题
console.log(document.URL);          // 当前 URL
console.log(document.domain);       // 域名
console.log(document.referrer);     // 来源页面

// Cookie 操作
document.cookie = "name=value; path=/; expires=...";
console.log(document.cookie);       // 读取 cookies

// 编辑模式
document.designMode = "on";          // 开启编辑模式
```

## 📦 DocumentFragment

DocumentFragment 是一个轻量级的文档对象，没有父对象。

### 继承关系

```
DocumentFragment ← Node ← EventTarget
```

### 特点

- 不是真实 DOM 树的一部分
- 变化不会触发 DOM 树重新渲染
- 性能优异，适合批量操作

### 使用示例

```javascript
// 创建文档片段
const fragment = new DocumentFragment();
// 或者
const fragment2 = document.createDocumentFragment();

// 批量添加元素
const list = document.querySelector("#list");
const fruits = ["Apple", "Orange", "Banana", "Melon"];

fruits.forEach(fruit => {
  const li = document.createElement("li");
  li.textContent = fruit;
  fragment.appendChild(li);
});

// 一次性插入，只触发一次重渲染
list.appendChild(fragment);
```

::: tip 性能优势
使用 DocumentFragment 可以避免多次 DOM 操作导致的重复渲染，显著提升性能。
:::

## 📋 HTMLCollection

HTMLCollection 是元素集合的类数组对象，具有实时更新特性。

### 特点

- **实时更新（Live）** - 文档结构改变时自动更新
- **类数组对象** - 有 length 属性和数字索引
- **按名称访问** - 可通过 ID 或 name 属性访问

### 属性和方法

| 属性/方法 | 说明 |
|-----------|------|
| `length` | 集合中元素的数量 |
| `item(index)` | 通过索引访问元素 |
| `namedItem(name)` | 通过 ID 或 name 属性访问元素 |

### 使用示例

```javascript
const forms = document.forms;

// 通过索引访问
const firstForm = forms[0];
const firstForm2 = forms.item(0);

// 通过名称访问
const myForm = forms["myForm"];
const myForm2 = forms.namedItem("myForm");
const myForm3 = forms.myForm;

console.log(firstForm === firstForm2); // true
console.log(myForm === myForm2);       // true

// 实时更新示例
console.log(forms.length);             // 当前表单数量
document.body.appendChild(document.createElement("form"));
console.log(forms.length);             // 数量自动增加
```

::: warning 注意事项
由于 HTMLCollection 是实时更新的，在迭代时添加、移动或删除 DOM 节点可能导致意外结果。建议先创建副本：

```javascript
const formArray = Array.from(document.forms);
```
:::

## 📝 NodeList

NodeList 是节点集合的类数组对象。

### 类型

- **实时 NodeList** - 如 `Node.childNodes` 返回的
- **静态 NodeList** - 如 `document.querySelectorAll` 返回的

### 属性和方法

| 属性/方法 | 说明 |
|-----------|------|
| `length` | 节点数量 |
| `item(index)` | 通过索引访问节点 |
| `forEach(callback)` | 迭代方法 |
| `keys()` / `values()` / `entries()` | 迭代器方法 |

### 使用示例

```javascript
// 获取 NodeList
const childNodes = element.childNodes;        // 实时
const divs = document.querySelectorAll("div"); // 静态

// 访问节点
const firstNode = childNodes[0];
const firstNode2 = childNodes.item(0);

// 迭代
divs.forEach((div, index) => {
  console.log(`第 ${index} 个 div:`, div);
});

// 使用 for...of
for (const div of divs) {
  console.log(div);
}

// 使用迭代器
for (const [index, div] of divs.entries()) {
  console.log(`索引 ${index}:`, div);
}
```

## 📏 Range

Range 接口表示文档中的一个范围（片段）。

### 获取方式

```javascript
// 创建新范围
const range = new Range();
const range2 = document.createRange();

// 从选择获取
const selection = window.getSelection();
const range3 = selection.getRangeAt(0);

// 从坐标获取
const range4 = document.caretRangeFromPoint(x, y);
```

### 核心属性

| 属性 | 说明 |
|------|------|
| `collapsed` | 起始和结束位置是否相同 |
| `commonAncestorContainer` | 包含起始和结束容器的最近公共祖先 |
| `startContainer` / `endContainer` | 起始/结束容器节点 |
| `startOffset` / `endOffset` | 起始/结束偏移量 |

### 范围设置

```javascript
const range = new Range();

// 设置范围边界
range.setStart(startNode, startOffset);
range.setEnd(endNode, endOffset);

// 相对于节点设置
range.setStartBefore(referenceNode);
range.setStartAfter(referenceNode);
range.setEndBefore(referenceNode);
range.setEndAfter(referenceNode);

// 选择节点
range.selectNode(node);              // 包含节点本身
range.selectNodeContents(node);      // 只包含节点内容

// 折叠范围
range.collapse(true);                // 折叠到起始位置
range.collapse(false);               // 折叠到结束位置
```

### 范围操作

```javascript
// 内容操作
const fragment = range.cloneContents();     // 复制内容
const fragment2 = range.extractContents();  // 提取内容
range.deleteContents();                     // 删除内容

// 插入内容
range.insertNode(newNode);
range.surroundContents(newParentNode);

// 创建内容
const fragment3 = range.createContextualFragment("<p>HTML</p>");
```

### 范围查询

```javascript
// 位置比较
const comparison = range.compareBoundaryPoints(how, sourceRange);
// how 可选值：
// - Range.START_TO_START
// - Range.START_TO_END  
// - Range.END_TO_START
// - Range.END_TO_END

const pointComparison = range.comparePoint(node, offset);
// 返回 -1（之前）、0（内部）、1（之后）

// 包含检查
const isInRange = range.isPointInRange(node, offset);
const intersects = range.intersectsNode(node);

// 获取位置信息
const rect = range.getBoundingClientRect();
const rects = range.getClientRects();

// 获取文本
const text = range.toString();
```

### 范围管理

```javascript
// 克隆范围
const clonedRange = range.cloneRange();

// 释放范围（性能优化）
range.detach();
```

### 使用示例

```javascript
// 选择段落内容
const paragraphs = document.querySelectorAll("p");
const range = new Range();

// 设置范围从第2段开始，到第4段结束
range.setStartBefore(paragraphs[1]);
range.setEndAfter(paragraphs[3]);

// 添加到选择
const selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);

// 高亮选中的内容
const span = document.createElement("span");
span.style.backgroundColor = "yellow";
range.surroundContents(span);
```

## 📚 最佳实践

### 🚀 性能优化

::: tip 批量操作
```javascript
// ❌ 避免：多次 DOM 操作
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  document.body.appendChild(div);
}

// ✅ 推荐：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  fragment.appendChild(div);
}
document.body.appendChild(fragment);
```
:::

::: tip 事件委托
```javascript
// ❌ 避免：为每个元素添加事件监听器
document.querySelectorAll(".button").forEach(btn => {
  btn.addEventListener("click", handleClick);
});

// ✅ 推荐：事件委托
document.addEventListener("click", (e) => {
  if (e.target.matches(".button")) {
    handleClick(e);
  }
});
```
:::

### 🛡️ 安全考虑

::: warning XSS 防护
```javascript
// ❌ 危险：直接插入用户输入
element.innerHTML = userInput;

// ✅ 安全：使用 textContent 或适当转义
element.textContent = userInput;

// 或使用 DOM 方法
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);
```
:::

### 🔧 兼容性处理

::: tip 特性检测
```javascript
// 检查 API 支持
if ("IntersectionObserver" in window) {
  // 使用 IntersectionObserver
} else {
  // 降级方案
}

// 检查方法支持
if (element.scrollIntoView) {
  element.scrollIntoView({ behavior: "smooth" });
} else {
  element.scrollIntoView();
}
```
:::

## 🔗 相关资源

- [MDN DOM 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [W3C DOM 规范](https://www.w3.org/TR/dom/)
- [DOM Living Standard](https://dom.spec.whatwg.org/)
- [Web API 接口参考](https://developer.mozilla.org/zh-CN/docs/Web/API)

## 📝 总结

DOM 接口是 Web 开发的基础，理解这些接口的继承关系和使用方法对于：

- **操作页面元素** - 增删改查 DOM 节点
- **处理用户交互** - 事件监听和响应
- **优化页面性能** - 合理使用 API 避免重复渲染
- **构建复杂应用** - 理解浏览器内部机制

掌握这些 DOM 接口将帮助您编写更高效、更安全的 Web 应用程序。
