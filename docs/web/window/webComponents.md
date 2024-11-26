# Web Component

Web Component 是一套不同的技术，允许你创建可重用的定制元素（它们的功能封装在你的代码之外）并且在你的 web 应用中使用它们。

## 简介

Web Components 由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

- `Custom element（自定义元素）`：一组 JavaScript API，允许你定义 custom elements 及其行为，然后可以在你的用户界面中按照需要使用它们。
- `Shadow DOM（影子 DOM）`：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，你可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- `HTML template（HTML 模板）`： `<template>` 和 `<slot> `元素使你可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

## 使用过程

customElements 是 Window 对象上的一个只读属性，接口返回一个 CustomElementRegistry 对象的引用，可用于注册新的 custom element，或者获取之前定义过的自定义元素的信息。

**CustomElementRegistry**对象属性和方法：

- `define()` 定义一个新的自定义元素。
- `get(customElementName)` 返回指定自定义元素的构造函数，如果未定义自定义元素，则返回 undefined。
- `upgrade(root)` 更新节点子树中所有包含阴影的自定义元素，甚至在它们连接到主文档之前也是如此。
- `whenDefined(customElementName)` 如果已经定义了这样一个自定义元素，那么立即执行返回的 promise
- `getName(constructor)` 根据类返回之前定义过的自定义元素的名称

使用过程一般如下：

1. 创建一个类或者函数指定 web 组件（自定义元素）的功能
2. 在类内，使用 this.attachShadow()创建 shadow DOM 并返回其根节点 shadowRoot，然后可以使用 shadowRoot.appendChild()，把其他 shadow DOM 附加到 shadowRoot 里
3. 如果需要的话，也可以使用 template 和 slot 元素定义 HTML 模板。然后通过 shadowRoot.appendChild(template)把模板当作 shadow DOM 渲染。
4. 使用 CustomElementRegistry.define() 方法注册你的新自定义元素，并向其传递要定义的元素名称、指定元素功能的类、以及可选的其所继承自的元素
5. 最后既可以在 HTML 里，就可以像普通元素一样，使用刚刚自定义的元素

具体代码实现，html 定义模板和使用自定义元素，大致如下

```html
<!--使用自定义内置元素-->
<p is="word-count"></p>

<!-- 在HTML里，像普通元素一样，使用自定义元素 -->
<word-count
  title="我是shadow DOM的shadow host影子宿主，渲染指定template模板里的内容。我有assignedSlot属性，是对插入此元素的slot的应用">
  <span slot="slotName"
    >我会放在template模板里的slotName位置，当slot节点改变时会触发slotchange事件</span
  >
  <span slot="slotName2">我会放在template模板里的slotName2位置</span>
  <span slot="slotName3">我会放在template模板里的slotName3位置</span>
  <span>我是默认插槽，放在没有名字的slot位置</span>
</word-count>

<!-- 提前定义template模板 -->
<template
  id="my-paragraph"
  title="这是模板，不会直接渲染在HTML中，需要通过影子DOM插入到HTML中">
  <slot name="slotName"
    >slotName插槽的默认内容，当没有提供slotName内容时，会显示默认内容</slot
  >
  <slot name="slotName2">这是具名插槽slotName2的默认内容</slot>
  <slot name="slotName3">具名插槽slotName3默认内容</slot>
  <slot>这是默认插槽，功能类似Vue中的slot插槽</slot>
  <style>
    p {
      color: white;
      background-color: #666;
      padding: 5px;
    }
  </style>
  <p>我的段落</p>
</template>
```

js 代码实现自定义元素的定义，添加 template 模板：

```js
const el = document.createElement("word-count");

// 定义：自定义元素必须继承自HTMLElement或者其子类
class WordCount extends HTMLParagraphElement {
  // 包含元素需要变更通知的所有属性名称的数组
  static observedAttributes = ["size"];
  constructor() {
    // 必须先调用父类的构造方法，初始化this
    super();

    /**给指定的元素挂载一个 Shadow DOM，并且返回对 ShadowRoot 的引用。
     * @mode 是否可以从外部访问shadow root节点
     *   open 可以从 js 外部访问根节点，例如使用 Element.shadowRoot:
     *   closed 拒绝从 js 外部访问关闭的 shadow root 节点
     * @delegatesFocus 是否把焦点，委托给可以聚焦的第一个元素
     * @return  ShadowRoot 对象或者 null。
     */
    var shadowRoot = this.attachShadow({ mode: "open" });

    // 获取id为my-paragraph的html模板template
    let template = document.getElementById("my-paragraph");

    // 把模板加入shadow root中，也可以添加style和link元素引入样式
    shadowRoot.appendChild(template.content);
  }

  // 生命周期函数
  connectedCallback() {
    // 第一次连接到DOM时调用
    console.log("自定义元素添加至页面。");
  }
  disconnectedCallback() {
    // 与文档 DOM 断开连接时被调用
    console.log("自定义元素从页面中移除。");
  }
  adoptedCallback() {
    // 被移动到新文档时被调用
    console.log("自定义元素移动至新页面。");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // 属性被增加、移除或更改时被调用
    console.log(`属性 ${name} 有${oldValue}变更为${newValue}。`);
  }
}

// 注册自定义元素，名称word-count，使用WordCount类
// extends命名了要继承的内置元素，li要继承ul
customElements.define("word-count", WordCount, { extends: "p" });

// 根据自定义元素的名称，返回对应的类
let ctor = customElements.get("word-count");

// 根据自定义元素的类，返回对应的名称
customElements.getName(WordCount) === "word-count";

// 更新节点子树中所有包含阴影的自定义元素
console.assert(!(el instanceof WordCount)); // not yet upgraded
customElements.upgrade(el);
console.assert(el instanceof WordCount); // upgraded!

// 判断自定义元素是否已经被定义
customElements
  .whenDefined("word-count")
  .then(WordCount => consoel.log("word-count已经被定义了", WordCount));
```

## 生命周期函数

- connectedCallback 第一次被连接到文档 DOM 时被调用。
- disconnectedCallback 与文档 DOM 断开连接时被调用。
- adoptedCallback 被移动到新文档时被调用
- attributeChangeCallback 属性被增加、移除或更改时被调用

## 相关 CSS 伪类&伪元素

- :difined 匹配任何已定义的元素，包括内置元素和已注册的自定义元素
- :host 选择 shadow DOM 的 shadow host
- :host() 选择 shadow DOM 的 shadow host。但只匹配给定方法的选择器的 shadow host 元素
- :host-content() 选择 shadow DOM 的 shadow host，但只匹配给定方法的选择器匹配元素的子 shadow host 元素
- ::slotted 匹配任何已经插入一个 slot 的内容
