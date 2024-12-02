# CSS嵌套

CSS 嵌套类似于Sass预处理器，不同是，它是被浏览器直接解析的，而不是先经由 CSS 预处理器的预编译。而且在 CSS 嵌套中，& 嵌套选择器的优先级类似于 :is() 函数；它的优先级由它所关联的选择器列表当中优先级最高的选择器决定。

> &:嵌套选择器，类似Sass嵌套里的&，代表父级。也可以嵌套关系选择器。
```css
.myClass {
  display: grid;
  /**使用嵌套选择器 */
  &:hover{
    background:red;
  }
  /**嵌套和组合关系选择器 */
  &.b{
    /** 等价于.myClass.b */
  }
  /**嵌套关系选择器 等价于 & + p */
  + p {
    color: white;
    background-color: black;
  }
  /**& 嵌套选择器也可以添加到一个选择器的后方。这将起到反转上下文的效果。 */
  .bar & {
    /* .bar .myClass 的样式 */
  }
  /**CSS 不支持这种拼接 */
  &__child-element {
  }
  /**这种拼接，会被解析为element.myClass */
  element& {
  }
  /**%在选择器中是无效的。这个选择器下的规则都将被忽略，其他规则不受影响 */
   & %invalid {
    /* %invalid 的无效样式，全部被忽略 */
  }
/**可以嵌套媒体查询，也可以嵌套 */
  @media (orientation: landscape) {
    grid-auto-flow: column;
    @media (min-width: 1024px) {
      max-inline-size: 1024px;
    }
  }
/**可以嵌套级联层 */
  @layer base {
    /**这里等价于@layer base .myClass */
    block-size: 100%;
    @layer support {
      /**这里等价于@layer base.support .myClass .bar */
      & .bar {
        min-block-size: 100%;
      }
    }
  }
}
```