# 多列布局

>多列布局声明提供了一种多列组织内容的方式，正如一些报纸中看到的那样

Multicol 创建的列无法单独的设定样式。不存在让单独某一列比其他列更大的方法，同样无法为某一特定的列设置独特的背景色、文本颜色。

通过给一个元素添加 column-count 或 column-width，该元素变成了多列容器，或简称为 multicol 容器。这些列是都是匿名的盒子，在规范中描述为列盒子
- column-count 列数
  - 创建的这些列具有弹性的宽度 — 由浏览器计算出每一列分配多少空间。
- column-width 列宽
  - 浏览器将按照你指定的宽度尽可能多的创建列；任何剩余的空间之后会被现有的列平分。这意味着你可能无法期望得到你指定宽度，除非容器的宽度刚好可以被你指定的宽度除尽。
- columns: 2 200px; column-count 和 column-width的简写形式
- column-gap 改变列间间隙。接受任何长度单位
- column-rule 在列间加入一条分割线,与border属性类似，是简写形式，接收同样的参数
  - column-rule-width
  - column-rule-style
  - column-rule-color
  - `column-rule: 4px dotted rgb(79, 185, 227);`
  - 这条分割线本身并不占用宽度。它置于用 column-gap 创建的间隙内。如果需要更多空间，你需要增加 column-gap 的值。
- column-span none|all;设置为 all 时，可以让一个元素跨越所有的列。
- column-fill 控制元素内容分成列时的平衡方式。初始值为 balance，这样内容就会在各列之间中保持平衡。
  - auto 按顺序填充列。内容只占用其所需的空间，可能导致某些列保持空白。
  - balance 内容平均分配到各列,在片段式上下文中，如 CSS 分页媒体，只有最后一个片段是平衡的。
  - balance-all 内容平均分配到各列。在片段式上下文中，如 CSS 分页媒体，所有片段都是平衡的。
  - 

## 控制内容拆分和折断
break-inside属性设给需要控制的子元素。来控制 multicol 和多页媒体中的内容拆分、折断。设置生成的盒子内部的页面、栏或区域应有的中断行为。如果没有生成盒子，则该属性将被忽略。
```css
/* 关键字值 */

/**允许（但不强制）在主框中插入任何中断（页、栏或区域）。 */
break-inside: auto;
/**避免在主框中插入任何中断（页、栏或区域） */
break-inside: avoid;
/**避免主框中的任何页中断。 */
break-inside: avoid-page;
/**避免主框中的任何栏中断。 */
break-inside: avoid-column;
/**避免主框中的任何区域中断。 */
break-inside: avoid-region;
```
每一个可能的中断点（换句话说，元素的边界）受三个属性的影响。前一个元素 break-after 的值、后一个元素 break-before 的值，以及包含元素 break-inside 的值。
- break-before 控制元素前换行
- break-inside 控制元素内换行
- break-after 控制元素后换行

会应用以下规则来确定是否必须产生中断点：

1. 如果这三个中断属性的值有一个是强制中断值（always、left、right、page、column 或 region），则该属性具有优先权。如果其中有多个这样的中断，则使用流中最后出现的元素的值。因此，break-before 值优先于 break-after 值，而后者又优先于 break-inside 值。
2. 如果三个相关值中的任何一个是避免中断值（avoid、avoid-page、avoid-region 或 avoid-column），则不在该点应用此类中断。