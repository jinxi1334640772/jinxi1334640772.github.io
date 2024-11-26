# CSS 计数器 counter

CSS 计数器可让你根据内容在文档中的位置调整其显示的外观。例如，你可以使用计数器自动为网页中的标题编号，或者更改有序列表的编号。

本质上 CSS 计数器是由 CSS 维护的变量，这些变量可能根据 CSS 规则跟踪使用次数以递增或递减。你可以自定义一个计数器，也可以修改 list-item 这一默认生成的应用于所有有序列表的计数器。

计数器只能在可以生成盒子的元素中使用（设置或重设值、递增）。例如，如果一个元素被设置为了 display: none，那么在这个元素上的任何计数器操作都会被忽略。
## counter-reset
counter-reset CSS 属性用于创建具名 CSS 计数器，并将其初始化为指定值。它支持创建从 1 向上计数到元素数量的计数器，以及从元素数量向下计数到 1 的计数器。
## counter-set 
CSS 属性将 CSS 计数器设置为给定值。它会操作现有计数器的值，并且只有在元素上没有给定名称的计数器时才会创建新计数器。
## 反向计数器 reversed()
反向计数器是一种用于递减（而非递增）的计数器。反向计数器可以通过在 counter-reset 属性中将计数器的名称使用 reversed() 函数包裹来创建。

反向计数器的默认初始值与元素的数量相同（不同于常规的默认初始值为 0 的计数器）。这使得实现从元素数量为初始值倒数到 1 的计数器变得更加容易

>对于非反向计数器，你也仍然可以使用 counter-increment 属性实现递减。使用反向计数器的优点在于：其默认初始值可以自动根据元素数量生成，自动应用于有序列表的 list-item 计数器也可以借此反转编号。。
```css
/**counter-reset ：初始化计数器名称和值，默认初始值为0；
   counter-increment : 指定其为递增或递减,默认递增1；
   counter(counterName,counterStyle) 当不需要包含
   父级上下文的编号，而仅需要嵌套内容的编号时:1
   counters(counterName,separator,counterStyle) 当需要
   同时包含父级上下文和嵌套内容的编号时，应使用 counters() 函数:1.2,3
   counterStyle:默认decimal，和list-style-type一致
   separator：分隔符，默认点号`.`分隔
*/

/** 可以同时初始化多个计数器，并可以指定其初始值。
下面，我们将名为 section 和 topic 的计数器初始化为默认值，
并将 page 计数器的初始值指定为 3。*/
counter-reset: section page 3 topic;
/**创建一个名为section的反向计数器 */
counter-reset: reversed(section);

/* 将 "counter1" 设置为 1，将 "counter2" 设置为 4 */
counter-set: counter1 1 counter2 4;

/**指定section计数器每次递增2 */
counter-increment: section 2;
/**显示计数器 */
h3::before {
  counter-increment: section;
  content: "Section " counter(section) ": ";
}
```
