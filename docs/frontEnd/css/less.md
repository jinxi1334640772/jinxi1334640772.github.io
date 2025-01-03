# less

LESS 是一个 CSS 预处理器，可以为网站启用可自定义，可管理和可重用的样式表。 LESS 是一种动态样式表语言，扩展了 CSS 的功能。 LESS 也是跨浏览器友好。

CSS 预处理器是一种脚本语言，可扩展 CSS 并将其编译为常规 CSS 语法，以便可以通过 Web 浏览器读取。 它提供诸如变量，函数， mixins 和操作等功能，可以构建动态 CSS。

## 嵌套规则

```less
/* 这是多行注释，
会编译到CSS文件中 */

// 这是单行注释，编译时会去掉注释
.container {
  display: flex;
  .header {
    background-color: red;
    width: 100%;
    .nav {
      width: 100px;
      height: 100px;
    }
  }
}
```

## 运算操作

> LESS 支持一些算术运算，例如加号(+)，减号( - )，乘法(\*)和除法(/)，它们可以对任何数字，颜色或变量进行操作。 操作节省了大量的时间，当你使用变量，让感到就像是简单的数学工作。

```less
// 定义变量，后续可以直接使用
@fontSize: 10px;
// 选择器变量
@mySelector:#wrap;

//属性变量
@boderStyle:border-style;
@Solid:solid;
//url变量
@images: "../../img";
//声明变量
@background: {
  background-color: red
}

.myclass {
  font-size: @fontSize * 2;
  color:green;
  background-image: url("@{images}/1.jpg");
  // 动态插值
  @{mySelector}{
    @background();
    color: #ccc;
    width: 50%;
    //属性变量名，必须使用{}包起来
    @{boderStyle}:@Solid;
  }
}
```

## 转义

> 它动态构建选择器，并使用属性或变量值作为任意字符串。

```less
p {
  color: ~"green";
}
```

编译之后变为：

```css
p {
  color: green;
}
```

## 函数

> LESS 映射具有值操作的 JavaScript 代码，并使用预定义的函数来操纵样式表中的 HTML 元素。 它提供了操作颜色的几个功能，如圆函数，floor 函数，ceil 函数，百分比函数等。很多，具体可以查资料。

```less
@color: #ff8000;
@width: 1;
.mycolor {
  color: @color;
  width: percentage(@width);
}
```

| 函数名                                                                                                                               | 描述                                                                                                                                                                                                                | 用例                                             |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| color                                                                                                                                | 代表颜色的字符串                                                                                                                                                                                                    | color()                                          |
| convert                                                                                                                              | 数字从一个单位转换为另一个单位                                                                                                                                                                                      | convert()                                        |
| Escape                                                                                                                               | 它通过对特殊字符使用 URL 编码来对字符串或信息进行编码。 无法编码一些字符，例如，， / ，？ ， @ ，＆amp; ， + ，〜，！ ， $ ，\'和可以编码的一些字符，例如 \\ ，#， > ^ ，(，)， {，} ，: >，＆gt; ，，] ， [和 = 。 |
| escape(escape("Hello!! welcome to Tutorialspoint!"))                                                                                 |
| e                                                                                                                                    | 字符串函数，使用 string 作为参数，并返回不带引号的信息。 它是一个 CSS 转义，它使用〜“一些内容"转义的值和数字作为参数。                                                                                              | filter: e("Hello!! welcome to Tutorialspoint!"); |
| 输出结果为：filter: Hello!! welcome to Tutorialspoint!;                                                                              |
| replace                                                                                                                              | 它用于替换字符串中的文本。 它使用一些参数：                                                                                                                                                                         |
| string :它搜索字符串并替换。pattern :它搜索正则表达式模式.replacement :它替换与模式匹配的字符串。flags :这些是可选的正则表达式标志。 | replace("Welcome, val?", "val\?", "to Tutorialspoint!");输出："Welcome, to Tutorialspoint!"                                                                                                                         |
| ceil                                                                                                                                 | 它将数字向上舍入为下一个最大整数。                                                                                                                                                                                  | ceil(0.7) 输出 1                                 |
| floor                                                                                                                                | 它将数字向下取整为下一个最小整数。                                                                                                                                                                                  | floor(3.3)输出 3                                 |
| percentage                                                                                                                           | 它将浮点数转换为百分比字符串。                                                                                                                                                                                      | percentage(0.2)输出：20%                         |
| round                                                                                                                                | 它舍入浮点数。                                                                                                                                                                                                      | round(3.77)输出：4                               |
| min                                                                                                                                  | 它指定一个或多个参数的最小值                                                                                                                                                                                        | min(70,30,45,20)输出：20                         |
| max                                                                                                                                  | 它指定一个或多个参数的最大值。                                                                                                                                                                                      | max(70,30,45,20)输出：70                         |
| isnumber                                                                                                                             | 判断是否是数字                                                                                                                                                                                                      | isnumber(1234); // true                          |
| isstring                                                                                                                             | 是否字符串                                                                                                                                                                                                          | isstring("variable"); // true                    |
| iscolor                                                                                                                              | 是否颜色                                                                                                                                                                                                            | iscolor(#fff);// true                            |

## 命名空间和访问器

> 将 mixins 分组在通用名称下。 使用命名空间可以避免名称冲突，并从外部封装 mixin 组。

```less
.class1 {
  .class2 {
    .val(@param) {
      font-size: @param;
      color: green;
    }
  }
}

.myclass {
  .class1 > .class2 > .val(20px);
}
```

## 文件导入

导入 LESS 或 CSS 文件的内容。可以使用导入的文件里的内容。例如：变量

```less
@import "//www.w3cschool.cn/less/myfile.less";
.myclass2 {
  color: #ff0000;
}
```

## 继承 extend

> Extend 是一个 LESS 伪类，它通过使用:extend 选择器在一个选择器中扩展其他选择器样式。

```less
.style {
  background: green;
}
h2 {
  &:extend(.style);
  font-style: italic;
}
```

## 混入 mixins

> 混合类似于编程语言中的函数。 Mixins 是一组 CSS 属性，允许您将一个类的属性用于另一个类，并且包含类名作为其属性。 在 LESS 中，可以使用类或 id 选择器以与 CSS 样式相同的方式声明 mixin。 它可以存储多个值，并且可以在必要时在代码中重复使用。

```less
// 定义带参数的mixins
.border(@width; @style; @color) {
  border: @width @style @color;
  color: yellow;
}
// 定义带守卫guard的mixins
.mixinName (@a) when (lightness(@a) >= 50%) {
  font-size: 14px;
}
// 使用mixins
.class1 {
  .mixinName(#FF0000);
}
```

## Guards 守卫

> Guard 用于匹配表达式上的简单值或参数个数。 应用于 CSS 选择器 来声明 mixin 。您可以将多个 guards 分组。

```less
@usedScope: global;
.mixin() {
  // 变量作用域
  @usedScope: mixin;
  .cont when (@usedScope=global) {
    background-color: red;
    color: black;
  }
  .style when (@usedScope=mixin) {
    background-color: blue;
    color: white;
  }
}
.mixin();
```

## 循环

> Loops 语句允许我们多次执行一个语句或一组语句。 当递归 mixin 与 Guard 表达式和模式匹配组合时，可以创建各种迭代/循环结构。

```less
.cont(@count) when (@count > 0) {
  .cont((@count - 1));
  width: (25px * @count);
}
div {
  .cont(7);
}
```

## 父选择器

> 可以使用`＆`运算符来引用父选择器。

```less
a {
  color: #5882fa;
  // &代表当前a元素，
  &:hover {
    background-color: #a9f5f2;
  }
}
```
