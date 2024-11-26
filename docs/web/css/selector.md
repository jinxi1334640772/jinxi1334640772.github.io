# css选择器

## css属性选择器

* [attribute] //具有attribute属性
- [attribute=value] //属性attribute值为value
- [attribute^=value] //属性attribute的值以value开头，valueyou
- [attribute|=value] //属性attribute 包含以value或者value-开头，valueyou value-you
- [attribute$=value] //属性attribute的值以value结尾，youvalue,
- [attribute*=value] //属性attribute包含value就行 ivalueyou
- [attribute~=value] //属性attribute包含以空格分开的value， i value you

## 伪类选择器

>修饰前面的E元素。它用于选择处于特定状态的元素，比如当它们是这一类型的第一个元素时，或者是当鼠标指针悬浮在元素上面的时候

- E:first-child E作为父元素的第一个子元素时，选中E元素
- E:last-child  E作为父元素的最后一个子元素时，选中E元素
- E:nth-child(n)  // n:数字，关键字even，odd，公式2n+1
- E:nth-last-child(n)  // 从兄弟节点中从后往前匹配处于某些位置的元素
- E:only-child  匹配没有兄弟元素的元素。
- E:first-of-type  E作为子元素中，同类型的第一个E时，选中E元素
- E:last-of-type  E作为子元素中，同类型的最后一个E时，选中E元素
- E:nth-of-type(n) E作为子元素中，同类型的第n个E时，选中E元素
- E:nth-last-of-type(n) 从后往前倒数第n个，E类型元素
- only-of-type  匹配兄弟元素中某类型仅有的元素。
- E:enabled  选中可以使用的E元素
- E:disabled 选中禁用的E元素
- E:checked  选中被勾选的E元素
- E:not(.class) 匹配作为值传入自身的选择器未匹配的物件。伪类可以将一个或多个以逗号分隔的选择器列表作为其参数。选择器中不得包含另一个否定选择器或伪元素。可以单独使用

- :hover hover时选中
- :link 匹配未曾访问的链接。
- :local-link 匹配指向和当前文档同一网站页面的链接。
- :visited 链接被访问过时选中
- :focus 元素聚焦时选中
- :focus-visible 当元素有焦点，且焦点对用户可见的时候匹配。
- :focus-within 匹配有焦点的元素，以及子代元素有焦点的元素。
- :valid 匹配诸如`<input>`的位于可用状态的元素
- :invalid 匹配诸如`<input>`的位于不可用状态的元素

|伪类选择器|描述|
|-------|-----|
|:any-link|匹配一个链接的:link和:visited状态。|
|:blank|匹配空输入值的`<input>`元素。|
|:checked|匹配处于选中状态的单选或者复选框。|
|:default|匹配一组相似的元素中默认的一个或者更多的 UI 元素。|
|:dir|基于其方向性（HTMLdir属性或者 CSSdirection属性的值）匹配一个元素|
|:disabled|匹配处于关闭状态的用户界面元素|
|:empty|匹配除了可能存在的空格外，没有子元素的元素。|
|:enabled|匹配处于开启状态的用户界面元素。|
|:future|匹配当前元素之后的元素。|
|:indeterminate|匹配未定态值的 UI 元素，通常为复选框。|
|:in-range|用一个区间匹配元素，当值处于区间之内时匹配。|
|:out-of-range|按区间匹配元素，当值不在区间内的时候匹配。|
|:lang|基于语言（HTMLlang属性的值）匹配元素。|
|:first|匹配分页媒体的第一页。|
|:left|在分页媒体中，匹配左手边的页。|
|:right|在分页媒体中，匹配右手边的页。|
|:is|匹配传入的选择器列表中的任何选择器。与:not()相反|
|:optional|匹配不是必填的 form 元素，即没有设置required。|
|:placeholder-shown|匹配显示占位文字的 input 元素。|
|:playing|匹配代表音频、视频或者相似的能“播放”或者“暂停”的资源的，且正在“播放”的元素。|
|:paused|匹配代表音频、视频或者相似的能“播放”或者“暂停”的资源的，且正在“暂停”的元素。|
|:read-only|匹配用户不可更改的元素。|
|:read-write|匹配用户可更改的元素。|
|:required|匹配必填的 form 元素。|
|:root|匹配文档的根元素。|
|:scope|要匹配的作为参考点或作用域的元素,匹配的元素取决于它的使用上下文，:root为文档根作用域|
|:target|匹配其 id 与当前 URL 片段匹配的元素。|
|:autofill|浏览器自动填充表单中的` <input>` 元素的值时匹配该 input 元素|
|:current|元素被展示的时候选中|
|:default|默认选中的表单元素|
|:defined|已定义的元素|
|:dir(rtl)|匹配特定文字书写方向的元素|
|:fullscreen|匹配当前处于全屏模式的所有元素|
|:host|元素内部使用了影子DOM，选中影子宿主|
|:host()|选择阴影根元素，仅当它与选择器参数匹配 :host(.special-custom-element) |
|:modal|选择已经激活的模态框 |
|:muted|可以发出声音但是静音的元素，例如：audio或者video |
|:pictrue-in-pictrue|当前处于画中画模式的元素 |
|:state|自定义元素已经有了自定义状态 |
|:user-invalid|用户操作后，验证无效的form元素 |
|:volume-locked|能够发出声音，但其音量目前被用户“锁定”的媒体元素，如 `<audio>` 或` <video>`。 |
|:where()|接受选择器列表作为它的参数，将会选择所有能被该选择器列表中任何一条规则选中的元素 |

```css
/**选中article下的第一个子元素p，它的第一行 */
article p:first-child::first-line {
  font-size: 120%;
  font-weight: bold;
}
/** 伪元素after */
.box::after {
  content: " ➥";
}

/**使用 :scope 来为 @scope 块的作用域的根元素设置样式 */
@scope (.dark-scheme) {
  :scope {
    background-color: darkmagenta;
    color: antiquewhite;
  }

  a {
    color: plum;
  }
}

```

```js
// :scope 代表当前作用域，即context的作用域
const selected = context.querySelectorAll(":scope > div");
```
```html
<section id="section2">Example</section>
<style>
  /**假定当url: http://www.example.com/index.html#section2 */
  /**因为section元素的id，和url上的#section2匹配，此时匹配上section元素 */
:target {
  /* ... */
}
</style>
```
## 伪元素选择器

> 伪元素以类似方式表现，不过表现得是像你往标记文本中加入全新的 HTML 元素一样，而不是向现有的元素上应用类。伪元素开头为双冒号::。插入了内容，页面上看起来好像行内元素，但dom里看不到。必须要有content属性

- ::before
- ::after
- p::first-line  即使单词/字符的数目改变，它也只会选中p的第一行。
- ::first-letter  匹配元素的第一个字母。
- ::grammar-error  匹配文档中包含了浏览器标记的语法错误的那部分。
- ::spelling-error  匹配文档中包含了浏览器标记的拼写错误的那部分。
- ::selection  匹配文档中被选择的那部分。
- ::backdrop  任何处于全屏模式的元素下的即刻渲染的盒子
- ::file-selector-button  type="file" 的 `<input>` 的按钮。
- ::highlight() 自定义高亮样式
- ::marker  列表的标记框（通常为一个符号或数字）
- ::part()  在阴影树中任何匹配 part 属性的元素。
- ::placeholder   `<input>` 或 `<textarea>` 元素中的占位文本。
- ::slotted()  选定那些被放在 HTML 模板中的元素
- ::target-text  浏览器在支持文本片段技术时所滚动到的文字
- ::view-transition  视图过渡叠加层的根元素，它包含所有视图过渡且位于所有其他页面内容的顶部。






## 关系选择器

- E F  后代选择器
- E>F  子选择器
- E~F  后续兄弟选择器
- E+F  相邻兄弟选择器
- E,F 并行选择器
- `*` 通配符，选中所有元素