# Document
Document 接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是 DOM 树。

DOM 树包含了像 `<body>、<table>` 这样的元素，以及大量其他元素。它向网页文档本身提供了全局操作功能，能解决如何获取页面的 URL，如何在文档中创建一个新的元素这样的问题。

Document 接口描述了任何类型的文档的通用属性与方法。根据不同的文档类型（例如 HTML、XML、SVG，...），还能使用更多 API：使用 "text/html" 作为内容类型（content type）的 HTML 文档，还实现了 HTMLDocument 接口，而 XML 和 SVG 文档则（额外）实现了 XMLDocument 接口。

## EventTarget

EventTarget 接口由可以接收事件、并且可以创建侦听器的对象实现。换句话说，任何事件目标都继承自该接口。包括：

- `document`
- `Element及其子项`
- `window`
- `XMLHttpRequest`
- `Node`
- `AudioNode`
- `AudioContext`
- `........`

EventTarget 接口方法：
- `addEventListener()` 注册特定事件类型的事件处理程序
- `removeEventListener()` 删除事件侦听器
- `dispatchEvent()` 派发事件

```js
// 基于EventTarget创建自定义事件类
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

// 注册事件监听器：调用继承自EventTarget的addEventListener方法
myEventTarget.addEventListener("foo", e => {
  myEventTarget._secret = e.detail;
});

// 创建自定义事件
let event = new CustomEvent("foo", { detail: 7 });

//触发事件：调用继承自EventTarget的dispatchEvent
myEventTarget.dispatchEvent(event);
let newValue = myEventTarget.secret; // === 7
```

## Node

Node 是一个接口，各种类型的 DOM API 对象会从这个接口继承。它允许我们使用相似的方式对待这些不同类型的对象；比如，继承同一组方法，或者用同样的方式测试。其子类有：

- `Document`
- `Element`
- `Attr`
- `CharacterData`
- `DocumentFragment`
- `DocumentType`
- `Notation`
- `Entiry`
- `Notation`

Node 的属性和方法有：

- `baseURI`返回 baseURL
- `childNodes`
- `firstChild`
- `isConnected`是否已连接上下文对象
- `lastChild`
- `previousSibling`
- `nextSibling`
- `nodeName`节点名字。Element 为标签名，Text 为`#text`，Document 为`#document`
- `nodeType` 返回节点类型对应的整数值
  - `1` element 节点
  - `2` attribute 属性节点
  - `3` text 文本节点
  - `8` comment 注释节点
  - `9` document 文档节点
  - `10` document 类型文档节点
  - `11` documentFragment 文档节点
- `nodeValue` 返回或设置当前节点的值。
- `ownerDocument` 所属的 Document 对象
- `parentNode`
- `parentElement`
- `textContent` 返回或设置所有子节点及其后代的文本内容。
- `appendChild()`
- `cloneNode(isDeep)`
- `compareDocumentPosition()`比较当前节点与文档中的另一节点的位置。
- `contains()` 是否包含节点
- `getRootNode()` 返回上下文对象的根节点
- `hasChildNodes()` 是否包含有子节点
- `insertBefore()`
- `isDefaultNamespace(URI)` 是否默认命名空间
- `isEqualNode()` 受否两个节点的类型、属性、属性名、节点值都相等
- `isSameNode()` 是否相同的引用
- `lookupPrefix(URI)` 返回 URI 所对应的命名空间前缀
- `lookupNamespaceURI(prefix)` 返回前缀所对应节点命名空间 URI
- `normalize()` 合并节点内相邻的文本节点并清除空文本节点
- `removeChild()`
- `replaceChild()`
- `hasAttributes()`
- `onselectstart` 用户进行一个新的选择时触发。

## Element

Element 是最通用的基类，Document 中的所有元素对象都继承自它。具有各种元素共有的方法和属性。
- `assignedSlot`返回一个表示节点所插入的 `<slot>` 的 HTMLSlotElement 值。
- `attributes`返回一个 NamedNodeMap 对象，其中包含相应 HTML 元素的指定属性。表示属性节点 Attr 对象的集合。尽管在 NamedNodeMap 里面的对象可以像数组一样通过索引来访问，但是它和 NodeList 不一样，对象的顺序没有指定。也是实时更新的。

  - `getNamedItem(attributeName)`给定名字对应的属性节点（Attr）。
  - `getNamedItemNS(attributeName)`
  - `setNamedItem(attr)`替换或添加一个属性节点（Attr）到映射（map）中。
  - `setNamedItemNS(attr)`
  - `removeNamedItem(attributeName)`移除一个属性节点（Attr）。
  - `removeNamedItemNS(attributeName)`
  - `item(index)`返回指定索引处的属性节点（Attr）
  - `length`返回映射 (map) 中对象的数量。

```js
myAttr = attributes.getNamedItem("attributeName");
const one = attributes.removeNamedItem("attributeName");
attributes.setNamedItem(one);
```

- `childElementCount`子元素个数。
- `children`返回此元素的子元素。
- `classList`返回该元素包含的所有 class 属性，是一个 DOMTokenList。

```js
classList.add(className);
classList.remove(className);
classList.toggle(className);
classList.contains(className);
classList.replace(replaceClassName, className);
```

- `className`一个字符串，表示这个元素的类。
- `clientHeight`内部高度
- `clientWidth`内部宽度
- `clientLeft`返回代表元素左边界宽度的数值。
- `clientTop`返回代表元素顶部边框宽度的数值。
- `elementTiming`一个字符串，反映了 elementtiming 属性，该属性在 PerformanceElementTiming API 中标记了一个观察元素。
- `firstElementChild`第一个子元素。
- `id`一个字符串，表示此元素的 id 值。
- `innerHTML`一个字符串，表示元素内容标记。
- `lastElementChild`返回此元素的最后一个子元素。
- `localName`一个字符串，代表元素限定名称的本地部分。
- `namespaceURI`元素对应的命名空间 URI，如果没有则返回 null。
- `nextElementSibling`下一个兄弟元素
- `outerHTML`一个字符串，代表元素的标记（包括其内容）
- `part`代表元素的部分标识符（即使用 part 属性设置的标识符），以 DOMTokenList 的形式返回
- `prefix`代表元素命名空间前缀的字符串，如果没有指定前缀，则为 null。
- `previousElementSibling`上一个兄弟元素
- `scrollHeight`元素滚动视图高度的数值。
- `scrollWidth`代表元素滚动视图宽度的数值。
- `scrollLeft`元素左滚动偏移量的数值。
- `scrollTop`元素顶部垂直滚动的像素数。
- `shadowRoot`返回元素挂载的开放影子根；如果没有开放影子根，则返回 null。
- `slot`返回元素插入的影子 DOM 插槽的名称。
- `tagName`标签名称。
- `before()` Element 之前插入一组 Node 对象或字符串
- `after()`Element 之后插入一组 Node 对象或字符串
- `animate()`在元素上创建并运行动画的快捷方法。返回创建的动画对象实例。
- `append()`在元素的最后一个子元素后插入一组 Node 对象或字符串。
- `attachShadow()`为指定元素附加影子 DOM 树，并返回指向其 ShadowRoot 的引用。
- `closest(selector)`返回参数中给定的选择器匹配的最接近的祖先
- `computedStyleMap()`返回一个 StylePropertyMapReadOnly 接口，该接口提供 CSS 声明块的只读表示，可替代 CSSStyleDeclaration。

```js
const myElement = document.querySelector("a");

const allComputedStyles = myElement.computedStyleMap();

for (const [prop, val] of allComputedStyles) {
  console.log("属性：", prop);
  console.log("属性值：", value);
}
```

- `getAnimations()`返回元素当前活动的动画对象数组。
- `getAttribute()`从当前节点读取指定属性的值，并以字符串形式返回。
- `getAttributeNS()`
- `getAttributeNames()`返回当前元素的属性名称数组。
- `getAttributeNode()`从当前节点获取指定属性的节点表示，并以 Attr 的形式返回。
- `getAttributeNodeNS()`从当前节点读取指定名称和命名空间的属性的节点表示，并以 Attr 的形式返回。
- `getBoundingClientRect()`返回元素的大小及其相对于视口的位置。
- `getBoxQuads()`返回代表节点 CSS 片段的 DOMQuad 对象列表。
- `getClientRects()`返回表示客户端中每行文本边界矩形的矩形集合。
- `getElementsByClassName()`返回一个实时的 HTMLCollection
- `getElementsByTagName()`返回一个实时的 HTMLCollection
- `getElementsByTagNameNS()`返回一个实时的 HTMLCollection
- `hasAttribute()`是否具有指定属性。
- `hasAttributeNS()`
- `hasAttributes()`表示元素是否具有一个或多个 HTML 属性。
- `hasPointerCapture()`是否具有指针捕获功能，用于捕获由给定指针 ID 标识的指针。
- `insertAdjacentElement()`将指定元素节点插入指定位置。

  - `beforebegin`targetElement 之前。
  - `afterbegin`targetElement 内部的第一个子节点之前
  - `beforeend`targetElement 内部的最后一个子节点之后。
  - `afterend`targetElement 之后。

  ```js
  /**
   * @position 相对于 targetElement 的位置的字符串
    @element 要插入到树中的元素。
    @return  插入的元素，插入失败则返回 null。
   */
  insertAdjacentElement(position, element);

  <!-- beforebegin -->
  <p>
    <!-- afterbegin -->
    foo
    <!-- beforeend -->
  </p>
  <!-- afterend -->
  ```

- `insertAdjacentText()` 将给定的文本节点插入调用该函数的元素的指定位置。
- `insertAdjacentHTML()`解析 HTML 或 XML 文本，并将生成的节点插入树中指定的位置。
- `matches()`是否会被指定的选择器字符串选中。
- `prepend()`在元素的第一个子元素之前插入一组 Node 对象或字符串。
- `querySelector()`返回相对于元素符合指定选择器字符串的第一个 Node。
- `querySelectorAll()`返回 NodeList 中相对于元素符合指定选择器字符串的节点。
- `releasePointerCapture()`释放（停止）之前为特定指针事件设置的指针捕捉。
- `remove()`删除该元素自身。
- `removeAttribute()`删除指定属性。
- `removeAttributeNS()`
- `removeAttributeNode()`删除指定属性的节点表示。
- `replaceChildren(param1, param2, /* …, */ paramN)`用一组指定的新子节点替换 Node 的现有子节点。
- `replaceWith(param1, param2, /* …, */ paramN)` 其他元素替换自身
- `requestFullscreen()`异步要求浏览器全屏显示元素。
- `requestPointerLock(options)`允许异步请求锁定给定元素上的指针(指针不超出元素范围)。
- `scroll()`滚动到某个特定坐标
- `scrollTo()` 等于 scroll()
- `scrollBy()`以给定数值滚动元素
- `scrollIntoView()`滚动页面，直到元素进入视图。

```js
scrollIntoView();
scrollIntoView(alignToTop); //是否对齐到顶部，默认true
/**
 * @behavior 定义滚动是立即的还是平滑的动画
 *   smooth 平滑的动画。
 *   instant 通过一次跳跃立刻发生。
 *   auto 由 scroll-behavior 的计算值决定
 * @block 定义垂直方向的对齐，start、center、end 或 nearest 之一。默认为 start。
 * @inline 定义水平方向的对齐，start、center、end 或 nearest 之一。默认为 nearest。
 * @return undefined
 */
scrollIntoView(scrollIntoViewOptions);

const element = document.getElementById("box");

element.scrollIntoView();
element.scrollIntoView(false);
element.scrollIntoView({ block: "end" });
element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
```

- `setAttribute()`设置当前节点的指定属性值。

```js
<div id="one" align="left">一</div>
<div id="two">二</div>

let d1 = document.getElementById("one");
let d2 = document.getElementById("two");
let a = d1.getAttributeNode("align");

d2.setAttributeNode(a.cloneNode(true));

// 返回：“left”
alert(d2.attributes[1].value);
```

- `setAttributeNS()`
- `setAttributeNode()`设置当前节点指定属性的节点表示形式。
- `setAttributeNodeNS()`
- `setPointerCapture()`指定一个特定的元素作为未来指针事件的捕获目标。指针的后续事件将针对捕获元素，直到捕获被释放
  > 指针捕获允许一个特定的指针事件 (PointerEvent) 事件从一个事件触发时候的目标重定位到另一个目标上。这个功能可以确保一个元素可以持续的接收到一个 pointer 事件，即使这个事件的触发点已经移出了这个元素（比如，在滚动的时候）。
  ```js
  //pointerId: PointerEvent 对象的pointerId 。
  slider.setPointerCapture(e.pointerId);
  slider.releasePointerCapture(e.pointerId);
  ```
- `toggleAttribute(name, force)`切换布尔属性的状态
  ```js
  /**
   * @name 指定要翻转的属性的名称的字符串
    @force 如果没有指定，toggleAttribute 方法会“翻转”名为 name 的属性
   */
  toggleAttribute(name);
  toggleAttribute(name, force);
  input.toggleAttribute("disabled");
  ```

Element 的事件有：

- `beforematch`浏览器在（处于被找到前隐藏状态的）元素因用户已通过“在页面中查找”功能或片段导航找到了该内容而即将显示时触发。
- `contentvisibilityautostatechange` 当元素开始或停止与用户相关和跳过其内容时，触发任何设置了 content-visibility: auto 的元素。
- `scroll`当文档视图或元素滚动时触发此事件。
- `scrollend`当文档视图完成滚动时触发此事件。
- `securitypolicyviolation`当违反内容安全策略时触发此事件。
- `wheel`当用户旋转指向设备（通常是鼠标）上的滚轮按钮时触发此事件。
- `animationstart`
- `animationiteration`
- `animationend`
- `animationcancel`
- `copy`
- `cut`
- `paste`
- `compositionstart`当文本合成系统（如输入法编辑器）开始新的合成会话时触发此事件。
- `compositionupdate`
- `compositionend`
- `blur`当元素失去焦点时触发此事件。
- `focus`当元素获得焦点时触发此事件。
- `focusin`当元素获得焦点时触发此事件，位于 focus 事件之后。
- `focusout`当元素失去焦点时触发此事件，位于 blur 事件之后。
- `fullscreenchange`
- `fullscreenerror`
- `keydown`
- `keypress`
- `keyup`
- `auxclick`当元素上的非主要指针设备按钮（例如除左键以外的任何鼠标按钮）被按下并释放时触发此事件。
- `click`
- `contextmenu`
- `dbclick`
- `mouseenter`
- `mousemove`当指针设备（通常是鼠标）在元素上移动时触发此事件
- `mouseleave`
- `mousedown`
- `mouseout`当指针设备（通常是鼠标）离开监听器所连接的元素或其子元素时触发此事件。
- `mouseover`当指针设备移动到监听器所连接的元素上或其子元素上时触发此事件。
- `mouseup`
- `gotpointercapture`当元素使用 setPointerCapture() 捕捉指针时触发。
- `lostpointercapture`当捕获指针被释放时触发。
- `pointercancel`指针事件取消时触发。
- `pointerdown`指针变为活动状态时触发。
- `pointerup`指针不再处于活动状态时触发。
- `pointerenter`指针移动到元素或其子代的命中测试边界时触发。
- `pointerleave`当指针移出元素的命中测试边界时触发。
- `pointermove`
- `pointerout`
- `pointerover`
- `pointerrawupdate`指针改变任何属性时触发，这些属性不会触发 pointerdown 或 pointerup 事件。
- `gesturechange`触控手势期间数字移动时触发。
- `gesturestart`当多个手指接触触摸表面时触发，从而开始一个新手势。
- `gestureend`当不再有多个手指接触触摸表面时触发，从而结束手势。
- `touchstart`当一个或多个触摸点放置在触摸表面时触发。
- `touchmove`当一个或多个触摸点沿触摸表面移动时触发。
- `touchend`当一个或多个触摸点从触摸表面移除时触发。
- `touchcancel`当一个或多个触摸点以特定的实现方式受到破坏（例如，创建的触摸点过多）时触发。
- `transitionstart`
- `transitionrun`当创建 CSS 过渡（即当它被添加到一组正在运行的过渡中时）时触发，但不一定会被启动。
- `transitionend`
- `transitioncancel`

## CharacterData

CharacterData 抽象接口（abstract interface）代表 Node 对象包含的字符。它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。属性和方法有：

- `data` 包含的文本数据。
- `length`字符串的大小。
- `previousElementSibling`上一个元素节点
- `nextElementSibling`下一个元素节点
- `appendData(string)`为 data 字符串追加字符
- `deleteData(offset, count)`从指定位置开始，删除指定数量的字符
- `insertData(offset, count)` 在指定的位置，插入指定的字符
- `replaceData(offset, count, data)`从指定位置开始，把指定数量的字符替换为指定字符
- `substringData(offset, count)`截取指定位置开始，指定长度的字符
- `remove()`删除自身

## Text

Text 接口表示 DOM 树中的一个文本节点。

> 继承关系：Text——CharacterData——Node——EventTarget，继承所有父类的属性和方法

- `assignedSlot`返回一个 HTMLSlotElement，表示当前节点所在的 `<slot>`。
- `wholeText`返回一个由与当前节点相邻的所有文本（Text）节点的文本内容按文档顺序拼接成一个字符串。
- `splitText(offset)`在指定的偏移位置将节点分成两个节点。

## Attr

Attr 接口将一个元素的属性（attribute）表示为一个对象。在大多数情况下，你可以直接以字符串形式检索属性值（例如 Element.getAttribute()），但某些函数（例如 Element.getAttributeNode()）或迭代方法则返回 Attr 实例

- `localName`属性限定名的本地部分的字符串。
- `name`该属性的限定名。如果该属性不在命名空间中，则其与 localName 属性相同
- `value`获取和设置属性的值
- `prefix`该属性的命名空间前缀的字符串
- `namespaceURI`一个表示该属性的命名空间 URI 的字符串，如果没有命名空间，则返回 null。
- `ownerElement`该属性所附属的元素。

## DOMParser

DOMParser 可以将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document。

对于 HTML 文档，你还可以通过设置 Element.innerHTML 和 outerHTML 属性的值，将部分 DOM 替换为从 HTML 构建的新 DOM 树。还可以读取这些属性以获取对应于相应 DOM 子树的 HTML 片段。

> 使用 XMLSerializer 接口执行相反的操作 - 将 DOM 树转换为 XML 或 HTML 源。

- `parseFromString(string, mimeType)`在指定的偏移位置将节点分成两个节点。

```js
let domparser = new DOMParser();
/**
 * @string 要解析的字符，包含 HTML、xml、xhtml+xml 或 svg 文档。
 * @mimeType 决定方法返回值的类
 *  text/html
 *  text/xml
 *  application/xml
 *  application/xhtml+xml
 *  image/svg+xml
 * @return
 */
let doc = domparser.parseFromString(string, mimeType);

let doc = domparser.parseFromString(
  stringContainingXMLSource,
  "application/xml"
);
```

## DOMRect

一个 DOMRect 代表一个矩形。

- `x`DOMRect 原点的 x 坐标。
- `y`DOMRect 原点的 y 坐标。
- `width`DOMRect 的宽度。
- `height`DOMRect 的高度。
- `top`返回 DOMRect 的顶坐标值，与 y 具有相同的值。
- `bottom`返回 DOMRect 的底坐标值，与 y + height 具有相同的值
- `left`返回 DOMRect 的左坐标值，与 x 具有相同的值
- `right`返回 DOMRect 的右坐标值，与 x + width 具有相同的值
  当前节点相邻的所有文本（Text）节点的文本内容按文档顺序拼接成一个字符串。
- `fromRect(rectangle)`创建一个具有指定位置和尺寸的新 DOMRect 对象。
  - x
  - y
  - width
  - height

## DOMTokenList

DOMTokenList 接口表示一组空格分隔的标记（tokens）。如由 Element.classList、HTMLLinkElement.relList、HTMLAnchorElement.relList 或 HTMLAreaElement.relList 返回的一组值。它和 JavaScript Array 对象一样，索引从 0 开始。DOMTokenList 总是区分大小写（case-sensitive）。

- `length`表示存储在该对象里值的个数。
- `value` 该属性以 DOMString 的形式返回 DOMTokenList 列表的值。
- `item(index)`
- `contains(token)`
- `add(token1[, token2[, ...tokenN]])`
- `remove(token1[, token2[, ...tokenN]])`
- `replace(oldToken, newToken)`
- `supports(token)`是否支持 token
- `toggle(token [, force])`切换 token
- `forEach(callback [, thisArg])`
- `keys()`
- `values()`
- `entries()`返回一个迭代器（iterator），以遍历这个对象中的所有键值对。

## Document

Document 接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是 DOM 树。描述了任何类型的文档的通用属性与方法

- `activeElement`返回一个目前处于聚焦状态的 Element。
- `adoptedStyleSheets`设置用于构造文档样式表的数组。这些样式表也可与同一文档的 shadow DOM 子树共享。
- `body`返回当前文档的 `<body>` 或 `<frameset>` 节点。
- `characterSet`返回文档正在使用的字符集。
- `childElementCount`子元素的数量。
- `children`返回当前文档的子元素。
- `compatMode`以怪异模式（quirks）或严格模式（strict）渲染。
- `contentType`根据当前文档的 MIME 标头，返回它的 Content-Type。
- `cuttentScript`正在处理且不是 JavaScript 模块的` <script>` 元素
- `doctype`当前文档的文档类型定义
- `documentElement`返回当前文档的直接子节点
- `documentURI`以字符串的类型，返回当前文档的路径。
- `embeds`当前文档的嵌入式的元素 `<embed>` 的 HTMLCollection。
- `fonts`返回当前文档的 FontFaceSet 接口。
- `forms`当前文档中所有表单元素` <form>` 的 HTMLCollection。
- `images`返回当前文档中所包含的图片的 HTMLCollection
- `links`文档中所有超链接的 HTMLCollection
- `scripts`返回包含文档中所有的 `<script>` 元素的 HTMLCollection。
- `styleSheets`包含显式链接或嵌入到文档中的 CSSStyleSheet 对象的 StyleSheetList。
- `plugins`包含可用插件的 HTMLCollection。
- `fullscreenElement`返回文档中正处于全屏模式的元素。
- `pointerLockElement`当指针被锁定时，返回鼠标事件的目标的元素集合
- `scrollingElement`返回对滚动文档的 Element 的引用
- `hidden`表明当前页面是否隐藏。
- `implementation`返回与当前文档相关联的 DOM 实现。
- `firstElementChild`返回当前文档的第一个子元素。
- `lastElementChild`最后一个子元素。
- `pictrueInPictrueElement`返回文档中正处于画中画模式的 Element。
- `pictrueInPictureEnabled`若画中画特性可用，则返回 true
- `timeline`返回 DocumentTimeline 的一个实例，该实例是在页面加载时自动创建的
- `visibilityState`表明当前文档的可见性。可能的取值有 visible、hidden、prerender 和 unloaded。

HTML 文件的 Document 接口继承自 HTMLDocument 接口，或扩展了这些方法：

- `cookie`返回一个使用分号分隔的 cookie 列表，或设置（写入）一个 cookie
- `defaultView`返回一个对 window 对象的引用。
- `designMode`获取或设置编辑整个文档的能力
- `dir`获取或设置文档的文字方向（rtl 或 ltr）。
- `domain`获取或设置当前文档的域
- `lastModified`返回文档最后修改的时间
- `location`返回当前文档的 URI。
- `readyState`返回当前文档的加载状态。
- `referrer`返回来源页面的 URI。
- `title`获取或设置当前文档的标题
- `URL`以字符串形式返回文档的地址栏链接。

该接口同样继承了 Node 和 EventTarget 接口。方法有：

- `adoptNode()`从外部文档中采用的节点。
- `append()`最后一个子节点后插入一个 Node 对象或字符串对象的集合
- `createAttribute()`创建一个新的 Attr 对象并返回。
- `createAttributeNS()`
- `createComment()`创建一个新的注释节点并返回。
- `createElement()`用给定标签名创建一个新的元素。
- `createElementNS()`
- `createDocumentFragment()`创建一个新的文档片段。
- `createNodeIterator()`创建一个 NodeIterator 对象。
- `createTreeWalker()`创建一个 TreeWalker 对象。

  ```js
  /**
   * @root NodeIterator 遍历起始处的根节点。
    @wantToShow 是由节点过滤器中的常量属性定义的位掩码
      1:Element节点
      4：Text节点
      128：Comment节点
    @filter 一个回调函数或一个具有 acceptNode() 方法的对象
      需返回下列常量之一：NodeFilter.FILTER_ACCEPT、NodeFilter.FILTER_REJECT 或 NodeFilter.FILTER_SKIP
    @return 一个新的 NodeIterator 对象。
   */
  createNodeIterator(root)
  createNodeIterator(root, whatToShow)
  createNodeIterator(root, whatToShow, filter)

  createTreeWalker(root)
  createTreeWalker(root, whatToShow)
  createTreeWalker(root, whatToShow, filter)

  // 使用createNodeIterator()
  const nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  (node) =>
    node.nodeName.toLowerCase() === "p"
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT,
  );
    //以上函数改为对象形式：
  {
    acceptNode(node) {
      return node.nodeName.toLowerCase() === "p"
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  }
  const pars = [];
  let currentNode;
  // 迭代器直接返回当前节点
  while ((currentNode = nodeIterator.nextNode())) {
    pars.push(currentNode);
  }

  // 使用createTreeWalker()
  const treeWalker = document.createTreeWalker(
  document.querySelector("#root"),
  NodeFilter.SHOW_TEXT,
  );

  // 通过currentNode属性获取当前节点
  while (treeWalker.nextNode()) {
    const currentNode = treeWalker.currentNode;
    pars.push(currentNode);
  }
  ```

- `createProcessingInstruction()`创建一个新的指令处理对象，用于处理 XML。
- `createEvent()`创建一个事件对象。已由 CustomEvent 代替
- `createRange()`创建一个 Range 对象。
- `createTextNode()`创建一个文本节点。
- `elementFormPoint(x,y)`返回视口指定坐标最顶层的元素。
- `elementsFormPoint(x,y)`返回包含指定坐标下所有元素的数组。
- `exitPictrueInPictrue()`退出画中画模式，并返回到它的原始容器。
- `exitPointerLock()`释放指针锁。
- `getAnimations()`返回包含所有目前有效的 Animation 对象（其目标元素为 document）的数组。
- `getElementsById()`
- `getElementsByClassName()`
- `getElementsByTagName()`
- `getElementsByTagNameNS()`
- `getElementsByName()`
- `getSelection()`Selection 对象，表示用户选择的文本范围或是插入符号当前的位置。
- `hasStorageAccess()`表示文档是否有访问第一方储存的权限
- `requestStorageAccess()`
- `importNode()`返回外部文档的节点的拷贝。
- `caretRangeFormPoint(x,y)`返回指定坐标位置文档片段的 Range 对象
- `caretPositionFromPoint(x,y)`返回一个 CaretPosition 对象，其中包含 DOM 节点以及该节点内光标和光标的字符偏移量。
- `prepend()`
- `querySelector()`
- `querySelectorAll()`
- `releaseCaptrue()`若鼠标在当前文档的某一个元素之上，则释放当前的鼠标捕获
- `replaceChildren()`指定的新的子节点集合替换替换文档中现有的子节点。
- `createExpression()`编译一个 XPathExpression，以用于（重复）执行。
- `createNSResolver()`创建一个 XPathNSResolver 对象。
- `evaluate()`执行一个 XPath 表达式。
- `close()`关闭用于写入的文档流。
- `open()`
- `execCommand()`在可编辑文档中执行格式化命令。
- `hasFocus()`若焦点目前位于给定的文档内，则返回 true。
- `write()`向文档写入文本。
- `writeln()`向文档写入一行文本。
  列出了使用 addEventListener() 或为接口的事件处理器属性 oneventname 赋值的方式来监听的事件。
- `beforescriptexecute`在静态的 `<script>` 开始执行脚本时触发
- `afterscriptexecute`
- `scroll`
- `visibilitychange`
- `wheel`在用户在点击设备（通常为鼠标）上转动滚轮时触发。
- `animationstart`
- `animationiteration`在动画迭代完成时触发。
- `animationend`
- `animatoncancel`
- `copy`
- `cut`
- `paste`
- `drag`在用户拖动元素或选择的文本时每几百毫秒触发一次。
- `dragstart`
- `dragend`
- `dragenter`
- `dragover`
- `dragleave`
- `drop`
- `fullscreenchange`在 Document 进入或退出全屏模式时触发。
- `fullscreenerror`在尝试进入或退出全屏模式而发生错误时触发。
- `keydown`
- `keyup`
- `DOMContentLoaded`在文档完全加载并解析后触发，无需等待样式表、图像和子框架完成加载。
- `readystatechange`在文档的 readyState 属性发生变化时触发。
- `selectionchange`在文档中的选中的文本发生改变时触发。
- `过渡事件`
- `指针事件`
- `触摸事件`

## DocumentFragment

DocumentFragment，文档片段接口，表示一个没有父对象的最小文档对象。

它被作为一个轻量版的 Document 使用，就像标准的 document 一样，存储由节点（nodes）组成的文档结构。与 document 相比，最大的区别是它不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会对性能产生影响。
DocumentFragment 没。有自己的属性和方法，都继承自 Node 和 EventTarget，不在过多介绍

```js
<ul id="list"></ul>;
const list = document.querySelector("#list");
const fruits = ["Apple", "Orange", "Banana", "Melon"];

//使用 document.createDocumentFragment 方法或者构造函数来创建DocumentFragment。
const fragment = new DocumentFragment();

fruits.forEach(fruit => {
  const li = document.createElement("li");
  li.textContent = fruit;
  fragment.appendChild(li);
});

//所有的节点会被一次插入到文档中，仅会发生一个重渲染的操作
list.appendChild(fragment);
```

## HTMLCollection

表示一个包含了元素（元素顺序为文档流中的顺序）的通用集合（与 arguments 相似的类数组 (array-like) 对象），还提供了用来从该集合中选择元素的方法和属性。

> HTML DOM 中的 HTMLCollection 是即时更新的（live）；当其所包含的文档结构发生改变时，它会自动更新。因此，最好是创建副本（例如，使用 Array.from）后再迭代这个数组以添加、移动或删除 DOM 节点。

- `length` 返回集合当中子元素的数目。
- `item(index)`访问 collection[i]的替代方法
- `namedItem(index)` 根据 ID 返回指定节点，若不存在，则根据字符串所表示的 name 属性来匹配。访问 collection[name]的替代方法

```js
var elem1, elem2;

// document.forms is an HTMLCollection
elem1 = document.forms[0];
elem2 = document.forms.item(0);

alert(elem1 === elem2); // shows: "true"

elem1 = document.forms.myForm;
elem2 = document.forms.namedItem("myForm");

alert(elem1 === elem2); // shows: "true"

elem1 = document.forms["named.item.with.periods"];
```

## NodeList

NodeList 类数组对象是节点的集合，通常是由 Node.childNodes（实时的） 和 document.querySelectorAll 方法（静态的）返回的。可迭代对象

- `length`NodeList 中包含的节点个数。
- `item(index)`等价的写法是 nodeList[i]
- `forEach()`
- `keys()`
- `values()`
- `entries()`
- `forEach()`

## Range

Range 接口表示一个包含节点与文本节点的一部分的文档片段。

可以使用 Document.createRange 方法创建 Range。也可以用 Selection 对象的 getRangeAt() 方法或者 Document 对象的 caretRangeFromPoint() 方法获取 Range 对象。还可以用 Range() 构造函数。

- `collapsed`起始位置和终点位置是否合并，即位置相同
- `commonAncestorContainer`返回完整包含 startContainer 和 endContainer 最深一级的节点。
- `startContainer`返回包含 Range 开始的节点。
- `startOffset`表示 Range 在 startContainer 中的起始位置。
- `endContainer`返回包含 Range 终点的节点。
- `endOffset` Range 终点在 endContainer 中的位置

- `collapse(toStart)`将 Range 折叠到其边界的端点。
- `compareBoundaryPoints()`将该 Range 的边界与另一个 Range 的边界进行比较
- `comparePoint()` 返回 -1、0 或 1，分别表示端点在 Range 之前、内部还是之后。
- `cloneContents()`返回一个复制 Range 中所有节点的文档片段。
- `cloneRange()`返回一个拥有和原 Range 对象相同端点的克隆的 Range 对象
- `createContextualFragment(tagString)`返回从给定的代码字符串创建的文档片段。
- `deleteContents()`从 Document 中移除 Range 内容。
- `detach()`将 Range 从使用状态释放，提高性能。
- `extractContents()`将 Range 的内容从文档树移动到一个文档片段。
- `getBoundingClientRect()`返回一个 DOMRect 对象，其绑定了 Range 的整个内容
- `getClientRects()`返回一个 DOMRect 列表对象，汇总 Range 中所有元素
- `isPointInRange(referenceNode, offset)`表示给点端点是否在 Range 中。
- `insertNode(newNode)`在 Range 开头插入一个节点。
- `insersectsNode()`表示给定的节点是否与 Range 相交。
- `selectNode()`设置 Range 包含某个节点及其他的内容。
- `selectNodeContents()`设置 Range 包含某个节点的内容。
- `setStart(startNode, startOffset)`设置 Range 的起点。
- `setStartBefore()`以另一个节点为基准，设置 Range 的起点位置。
- `setStartAfter()`
- `setEnd()`设置 Range 的终点。
- `setEndBefore(referenceNode)`
- `setEndAfter()`
- `surroundContents(newParentNode)`将 Range 中的内容移动到一个新的节点。
- `toString()`返回 Range 中的文本

```js
collapse();
collapse(toStart);

var range = document.createRange();
referenceNode = document.getElementsByTagName("div").item(0);

range.selectNode(referenceNode);
range.collapse(true);

const paragraphs = document.querySelectorAll("p");

// 创建 Range 对象
const range = new Range();

// Range 起始位置在段落 2
range.setStartBefore(paragraphs[1]);

// Range 结束位置在段落 3
range.setEndAfter(paragraphs[2]);

// 获取 selection 对象
const selection = window.getSelection();

// 添加光标选择的范围
selection.addRange(range);

/** 将该 Range 的边界与另一个 Range 的边界进行比较
 * @how
 *  Range.START_TO_START
 *  Range.START_TO_END
 *  Range.END_TO_START
 *  Range.END_TO_END
 * @sourceRange
 * @return 一个数字，-1、0或1，表示Range的对应边界点
 * 是否分别在源Range的对应边界点之前、等于或之后。
 */
compareBoundaryPoints(how, sourceRange);

/**
 * @referenceNode 要与范围进行比较的节点。
 * @offset 大于或等于零的整数，表示referenceNode内部的偏移量。
 * @return -1, 0, or 1.
 */
comparePoint(referenceNode, offset);
```
