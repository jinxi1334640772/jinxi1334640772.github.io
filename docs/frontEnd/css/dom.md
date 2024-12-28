## EventTarget

EventTarget 接口由可以接收事件、并且可以创建侦听器的对象实现。任何事件目标都继承自该接口。包括：

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

各种类型的 DOM API 对象都继承自 Node 接口。其子类有：

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
- `isConnected`是否已连接上下文对象
- `nodeName`节点名字。Element 为标签名，Text 为`#text`，Document 为`#document`
- `nodeType` 返回节点类型对应的整数值
  - `1` element 节点
  - `2` attribute 属性节点
  - `3` text 文本节点
  - `8` comment 注释节点
  - `9` document 文档节点
  - `10` document 类型文档节点 DocumentType
  - `11` documentFragment 文档节点
- `nodeValue` 返回或设置当前节点的值。
- `ownerDocument` 所属的 Document 对象
- `parentNode | parentElement`

- `childNodes`
- `hasChildNodes()` 是否包含有子节点
- `firstChild | lastChild`
- `previousSibling | nextSibling`
- `textContent` 返回或设置所有子节点及其后代的文本内容。
- `appendChild() | insertBefore() | replaceChild() | removeChild()`
- `hasAttributes()`
- `cloneNode(isDeep)`
- `contains()` 是否包含节点
- `compareDocumentPosition()`比较当前节点与文档中的另一节点的位置。
- `getRootNode()` 返回上下文对象的根节点
- `isDefaultNamespace(URI)` 是否默认命名空间
- `isEqualNode()` 受否两个节点的类型、属性、属性名、节点值都相等
- `isSameNode()` 是否相同的引用
- `lookupPrefix(URI)` 返回 URI 所对应的命名空间前缀
- `lookupNamespaceURI(prefix)` 返回前缀所对应节点命名空间 URI
- `normalize()` 合并节点内相邻的文本节点并清除空文本节点
- `onselectstart` 用户进行一个新的选择时触发。

## Element

Element 是最通用的基类，Document 中的所有元素对象都继承自它。具有各种元素共有的方法和属性。

- `assignedSlot`表示节点所插入的 `<slot>` 的 HTMLSlotElement 值。
- `attributes`表示属性节点 Attr 对象的集合:NamedNodeMap 对象。对象的顺序没有指定，是实时更新的。

  - `getNamedItem(attributeName)`给定名字对应的属性节点（Attr）。
  - `setNamedItem(attr)`替换或添加一个属性节点（Attr）到映射（map）中。
  - `removeNamedItem(attributeName)`移除一个属性节点（Attr）。

  - `getNamedItemNS(attributeName)`
  - `setNamedItemNS(attr)`
  - `removeNamedItemNS(attributeName)`
  - `item(index)`返回指定索引处的属性节点（Attr）
  - `length`返回映射 (map) 中对象的数量。

```js
const myAttr = attributes.getNamedItem("attributeName");
const one = attributes.removeNamedItem("attributeName");
attributes.setNamedItem(one);
```

- `children`子元素集合。
- `childElementCount`子元素个数。
- `classList`包含所有 class 属性的 DOMTokenList 对象。[参考](#domtokenlist)

- `className`一个字符串，表示这个元素的类。
- `clientHeight|clientWidth`内部高度|宽度
- `clientLeft|clientTop`左|上边界宽度
- `elementTiming`在 PerformanceElementTiming API 中标记了一个观察元素。
- `firstElementChild|lastElementChild`第一|最后，一个子元素。
- `previousElementSibling|nextElementSibling`上一个|下一个，兄弟元素
- `id`id 值。
- `innerHTML`内容标记。
- `outerHTML`元素的标记（包括其内容）
- `localName`限定名称的本地部分。
- `namespaceURI`元素对应的命名空间 URI，如果没有则返回 null。
- `part`返回代表元素的部分标识符的 DOMTokenList 对象
- `prefix`命名空间前缀，如果没有指定前缀，则为 null。

- `scrollHeight | scrollWidth`元素滚动视图高度|宽度
- `scrollLeft | scrollTop`元素左|垂直滚动偏移量
- `shadowRoot`元素挂载的开放影子根；如果没有开放影子根，则返回 null。
- `slot`插入的影子 DOM 插槽的名称。
- `tagName`标签名称。
- `before()|after()|append()|prepend` 之前|之后|最后一个子元素后|第一个子元素前。插入一组 Node 对象或字符串
- `animate()`在元素上创建并运行动画的快捷方法。返回创建的动画对象实例。
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

- `getAttributeNames()`返回当前元素的属性名称数组。
- `getBoundingClientRect()`返回元素的大小及其相对于视口的位置。
- `getBoxQuads()`返回代表节点 CSS 片段的 DOMQuad 对象列表。
- `getClientRects()`返回表示客户端中每行文本边界矩形的矩形集合。
- `getElementsByClassName() | getElementsByTagName()`返回一个实时的 HTMLCollection
- `insertAdjacentElement()`将指定元素节点插入指定位置。

  - `beforebegin`targetElement 之前。
  - `afterbegin`targetElement 内部的第一个子节点之前
  - `beforeend`targetElement 内部的最后一个子节点之后。
  - `afterend`targetElement 之后。

  ```js
  beforebegin<div>afterbegin 位置参考 beforeend</div>afterend

  /**
   * @position 相对于 targetElement 的位置的字符串
    @element 要插入到树中的元素。
    @return  插入的元素，插入失败则返回 null。
   */
  insertAdjacentElement(position, element);
  ```

- `insertAdjacentText()` 将给定的文本节点插入指定位置。
- `insertAdjacentHTML()`解析 HTML 或 XML 文本，并将生成的节点插入指定的位置。
- `matches()`是否会被指定的选择器选中。
- `getAnimations()`返回元素当前活动的动画对象数组。
- `querySelector() | querySelectorAll()`符合指定选择器的第一个 Node | NodeList。
- `remove()`删除该元素自身。
- `replaceChildren(param1, param2, /* …, */ paramN)`用新子节点替换现有子节点。
- `replaceWith(param1, param2, /* …, */ paramN)` 其他元素替换自身
- `requestFullscreen()`异步要求浏览器全屏显示元素。
- `requestPointerLock(options)`允许异步请求锁定给定元素上的指针(指针不超出元素范围)。
- `scroll() | scrollTo()`滚动到某个特定坐标
- `scrollBy()`以给定数值滚动元素
- `scrollIntoView()`滚动页面，直到元素进入视图。

```js
scrollIntoView();
scrollIntoView(alignToTop); //是否对齐到顶部，默认true
/** scrollIntoViewOptions
 * @behavior 定义滚动是立即的还是平滑的动画
 *   smooth 平滑的动画。
 *   instant 通过一次跳跃立刻发生。
 *   auto 由 scroll-behavior 的计算值决定
 * @block 定义块级方向的对齐，start、center、end 或 nearest 之一。默认为 start。
 * @inline 定义内联方向的对齐，start、center、end 或 nearest 之一。默认为 nearest。
 * @return undefined
 */
scrollIntoView(scrollIntoViewOptions);
```

- `getAttribute() | getAttributeNode()`读取指定属性
- `setAttribute() | setAttributeNode()`设置当前节点的指定属性值。
- `hasAttribute() | hasAttributes()`是否具有指定属性。
- `removeAttribute() | removeAttributeNode()`删除指定属性。
- `toggleAttribute(name, force)`切换布尔属性的状态

```js
<div id="one" align="left">一</div>
<div id="two">二</div>

let d1 = document.getElementById("one");
let d2 = document.getElementById("two");
let a = d1.getAttributeNode("align");

d2.setAttributeNode(a.cloneNode(true));

alert(d2.attributes[1].value === 'left');

/**
 * @name 指定要翻转的属性的名称的字符串
  @force 如果没有指定，toggleAttribute 方法会“翻转”名为 name 的属性
  */
toggleAttribute(name);
toggleAttribute(name, force);
input.toggleAttribute("disabled");
```

- `setPointerCapture(pointerId)`元素作为未来指针事件的捕获目标。指针的后续事件将针对捕获元素，直到捕获被释放
- `hasPointerCapture()`是否具有指针捕获功能，用于捕获由给定指针 ID 标识的指针。
- `releasePointerCapture()`释放（停止）之前为特定指针事件设置的指针捕捉。

  > 指针捕获允许一个特定的指针事件 (PointerEvent) 事件从一个事件触发时候的目标重定位到另一个目标上。这个功能可以确保一个元素可以持续的接收到一个 pointer 事件，即使这个事件的触发点已经移出了这个元素（比如，在滚动的时候）。

  ```js
  //pointerId: PointerEvent 对象的pointerId 。
  slider.setPointerCapture(e.pointerId);
  slider.releasePointerCapture(e.pointerId);
  ```

Element 的事件有：

- `beforematch`元素因用户通过“在页面中查找”功能或片段导航找到了该内容而即将显示时触发。
- `contentvisibilityautostatechange` 属性变动时触发任何设置了 content-visibility: auto 的元素。
- `scroll | scrollend`当文档视图或元素滚动时|滚动结束时 触发此事件。
- `securitypolicyviolation`当违反内容安全策略时触发此事件。

- `animationstart | animationiteration | animationend | animationcancel` 动画事件
- `copy | cut | paste` 剪切板事件
- `compositionstart | compositionupdate | compositionend`当文本合成系统开始新的合成会话时|更新合成会话时|结束合成会话时触发此事件。
- `blur | focus | focusin | focusout`当元素失去焦点时|获得焦点时|focus 之后| blur 之后。

- `fullscreenchange | fullscreenerror` 全屏事件
- `keydown | keypress | keyup` 键盘事件
- `auxclick | click | dblclick | contextmenu | wheel`点击非主要指针设备按钮|单击|双击|右键菜单|滚轮事件

- `mouseenter | mousemove | mouseleave | mouseout | mouseover | mousedown | mouseup` mouseover 和 mouseout 包含子元素的事件。

- `gotpointercapture | lostpointercapture`捕捉指针时|指针被释放时触发。
- `pointercancel | pointerdown | pointerup | pointermove | pointerover | pointerout | pointerenter | pointerleave | pointerrawupdate`指针事件取消时|变为活动状态时|不再处于活动状态时|移动时|移动时(包含子元素)|离开元素时(包含子元素)|进入元素时|离开元素时|属性更新时触发。

- `gesturechange | gesturestart | gestureend`触控手势改变|开始|结束

- `touchstart | touchmove | touchend | touchcancel` 触摸事件开始|移动|结束|取消

- `transitionstart | transitionrun | transitionend | transitioncancel` 过渡开始|运行|结束|取消

## CharacterData

CharacterData 抽象接口代表 Node 对象包含的字符。它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。属性和方法有：

- `data` 包含的文本数据。
- `length`字符串的大小。
- `previousElementSibling | nextElementSibling`上|下一个元素节点
- `appendData(string)`为 data 字符串追加字符
- `insertData(offset, count)` 在指定的位置，插入指定的字符
- `replaceData(offset, count, data)`从指定位置开始，把指定数量的字符替换为指定字符
- `deleteData(offset, count)`从指定位置开始，删除指定数量的字符
- `substringData(offset, count)`截取指定位置开始，指定长度的字符
- `remove()`删除自身

## Text

Text 接口表示 DOM 树中的一个文本节点。

> 继承关系：Text——CharacterData——Node——EventTarget

- `assignedSlot`返回一个 HTMLSlotElement，表示当前节点所在的 `<slot>`。
- `wholeText`返回一个由与当前节点相邻的所有文本（Text）节点的文本内容按文档顺序拼接成一个字符串。
- `splitText(offset)`在指定的偏移位置将节点分成两个节点。

## Attr

Attr 接口将一个元素的属性（attribute）表示为一个对象。

- `name`该属性的限定名。如果该属性不在命名空间中，则其与 localName 属性相同
- `localName`属性限定名的本地部分的字符串。
- `value`获取和设置属性的值
- `prefix`该属性的命名空间前缀的字符串
- `namespaceURI`一个表示该属性的命名空间 URI 的字符串，如果没有命名空间，则返回 null。
- `ownerElement`该属性所附属的元素。

## DOMParser

DOMParser 可以将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document。

> 使用 XMLSerializer 接口执行相反的操作 - 将 DOM 树转换为 XML 或 HTML 源。

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

DOMTokenList 接口表示一组空格分隔的标记（tokens），大小写敏感的类数组对象。如以下返回值：

- Element.classList
- HTMLLinkElement.relList
- HTMLAnchorElement.relList
- HTMLAreaElement.relList

其属性和方法有：

- `length`表示存储在该对象里值的个数。
- `value` 该属性以 DOMString 的形式返回 DOMTokenList 列表的值。
- `item(index)`

- `add(token1[, token2[, ...tokenN]])`
- `remove(token1[, token2[, ...tokenN]])`
- `replace(oldToken, newToken)`
- `contains(token)`
- `toggle(token [, force])`切换 token
- `supports(token)`是否支持 token
- `forEach(callback [, thisArg])`
- `keys()`
- `values()`
- `entries()`返回一个迭代器（iterator），以遍历这个对象中的所有键值对。

## Document

Document 接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是 DOM 树。描述了任何类型的文档的通用属性与方法
子类型有：

- 使用 "text/html" 作为内容类型（content type）的 HTML 文档，实现了 HTMLDocument 接口
- 而 XML 和 SVG 文档则实现了 XMLDocument 接口。

继承关系：Document——Node——EventTarget。其属性和方法有：

- `adoptedStyleSheets`设置用于构造文档样式表的数组。这些样式表也可与同一文档的 shadow DOM 子树共享。
- `documentElement`返回当前文档的直接子节点
- `body`返回当前文档的 `<body>` 或 `<frameset>` 节点。
- `doctype`当前文档的文档类型定义
- `head`返回当前文档的 `<head>` 节点。
- `characterSet`返回文档正在使用的字符集。
- `compatMode`以怪异模式（quirks）或严格模式（strict）渲染。
- `contentType`根据当前文档的 MIME 标头，返回它的 Content-Type。
- `children`返回当前文档的子元素。
- `childElementCount`子元素的数量。
- `cuttentScript`正在处理且不是 JavaScript 模块的` <script>` 元素
- `documentURI`以字符串的类型，返回当前文档的路径。
- `embeds | forms | images | links | scripts | plugins`当前文档特定的 HTMLCollection。
- `fonts`返回当前文档的 FontFaceSet 接口。
- `styleSheets`包含显式链接或嵌入到文档中的 CSSStyleSheet 对象的 StyleSheetList。
- `activeElement`返回一个目前处于聚焦状态的 Element。
- `fullscreenElement`返回文档中正处于全屏模式的元素。
- `pointerLockElement`当指针被锁定时，返回鼠标事件的目标的元素集合
- `scrollingElement`返回对滚动文档的 Element 的引用
- `hidden`表明当前页面是否隐藏。
- `implementation`返回与当前文档相关联的 DOM 实现。
- `firstElementChild | lastElementChild`返回当前文档的第一个|最后一个子元素。
- `pictrueInPictrueElement`返回文档中正处于画中画模式的 Element。
- `pictrueInPictureEnabled`若画中画特性可用，则返回 true
- `timeline`返回 DocumentTimeline 的一个实例，该实例是在页面加载时自动创建的
- `visibilityState`表明当前文档的可见性。可能的取值有 visible、hidden、prerender 和 unloaded。

## HTMLDocument

继承关系：HTMLDocument——Document——Node——EventTarget，并扩展了一些属性和方法：

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

- `adoptNode()`从外部文档中采用的节点。
- `createAttribute()`创建一个新的 Attr 对象并返回。
- `createComment()`创建一个新的注释节点并返回。
- `createElement()`用给定标签名创建一个新的元素。
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
- `hasFocus()`焦点是否位于给定的文档内
- `write()`向文档写入文本。
- `writeln()`向文档写入一行文本。

事件：

- `beforescriptexecute | afterscriptexecute`在静态的 `<script>` 开始执行脚本时|结束后触发
- `scroll`
- `wheel`在用户在点击设备（通常为鼠标）上转动滚轮时触发。
- `animationstart | animationiteration | animationend | animationcancel` 在元素动画开始、重复、结束或取消时触发。

- `copy | cut | paste` 在用户复制、剪切或粘贴文本时触发。

- `drag | dragstart | dragend | dragenter | dragover | dragleave | drop` 拖拽事件。

- `fullscreenchange | fullscreenerror` 进入或退出全屏模式时触发。
- `keydown | keypress | keyup` 键盘事件。
- `DOMContentLoaded`在文档完全加载并解析后触发，无需等待样式表、图像和子框架完成加载。
- `readystatechange | visibilitychange | selectionchange` 文档状态改变|可见性改变|选择改变

- `gesturechange | gesturestart | gestureend`触控手势改变|开始|结束

- `touchstart | touchmove | touchend | touchcancel` 触摸事件开始|移动|结束|取消

- `transitionstart | transitionrun | transitionend | transitioncancel` 过渡开始|运行|结束|取消

## DocumentFragment

DocumentFragment 文档片段接口，表示一个没有父对象的轻量版 Document 对象。继承自 Node 和 EventTarget 没有自己的属性和方法。与 document 相比，最大的区别是它不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会对性能产生影响。

```js
<ul id="list"></ul>;
const list = document.querySelector("#list");
const fruits = ["Apple", "Orange", "Banana", "Melon"];

//document.createDocumentFragment 方法或者构造函数来创建DocumentFragment。
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

表示一个包含了元素集合的类数组对象。是即时更新的（live），当其所包含的文档结构发生改变时，它会自动更新。因此，最好是创建副本（例如，使用 Array.from）后再迭代这个数组以添加、移动或删除 DOM 节点。

- `length` 返回集合当中子元素的数目。
- `item(index)`访问 collection[i]的替代方法
- `namedItem(index)` 根据 ID 或者 name 属性来匹配。 collection[name]的替代方法

```js
var elem1, elem2;

// HTMLCollection 可根据索引或者名字匹配
elem1 = document.forms[0];
elem2 = document.forms.item(0);

elem1 = document.forms.myForm;
elem1 = document.forms["myForm"];
elem2 = document.forms.namedItem("myForm");

alert(elem1 === elem2); // shows: "true"
```

## NodeList

NodeList 类数组对象是节点的集合，通常是由 Node.childNodes（实时的） 和 document.querySelectorAll 方法（静态的）返回的。

- `length`NodeList 中包含的节点个数。
- `item(index)`等价的写法是 nodeList[index]
- `keys()`
- `values()`
- `entries()`
- `forEach()`

## Range

Range 接口表示一个包含节点与文本节点的一部分的文档片段。获取方式有：

- Document.createRange()
- Document.caretRangeFromPoint()
- Selection 对象的 getRangeAt()
- Range() 构造函数。

其属性和方法有：

- `collapsed`起始位置和终点位置是否合并，即位置相同
- `commonAncestorContainer`包含 startContainer 和 endContainer 最近一级的节点。
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
// 创建 Range 对象 const range = new Range();
const range = document.createRange();
referenceNode = document.getElementsById("id");

range.selectNode(referenceNode);
range.collapse(true);

const paragraphs = document.querySelectorAll("p");

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
 * @sourceRange 要与范围进行比较的节点。
 * @return 一个数字，-1:之前、0:等于或1:之后
 */
range.compareBoundaryPoints(how, sourceRange);

/**
 * @referenceNode 要与范围进行比较的节点。
 * @offset 大于或等于零的整数，表示referenceNode内部的偏移量。
 * @return -1, 0, or 1.
 */
range.comparePoint(referenceNode, offset);
```
