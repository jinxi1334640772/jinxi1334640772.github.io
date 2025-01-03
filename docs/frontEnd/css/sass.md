# sass css 预处理器

Sass 是一种 CSS 预处理器，用于增强 CSS 的功能和灵活性。它扩展了 CSS，并引入了许多有用的功能，如变量、嵌套、混合、继承以及模块化的结构。

## 变量

```scss
//以$符号开头，后跟变量名
$dark: #000;
// 多个单词，变量名以-分割，如：$theme-color
$theme-color: $dark;
.box {
  color: $dark;
}
```

## 嵌套

```scss
.box {
  .header {
    height: 100px;
  }
  // &代表当前父元素，即.box
  &:hover {
    color: red;
  }
}
```

## 混入 mixin

> 将一组 CSS 属性打包成可复用代码块。它类似于函数，使用时可以传递参数来定制样式；也可以打包不传递参数的样式

```scss
// 定义mixin
@mixin box-shadow($x, $y, $blur, $color) {
  box-shadow: $x $y $blur $color;
}
// 使用混入
.box {
  @include box-shadow(2px, 2px, 4px, #999);
}
```

## 继承 expend

> 一个选择器继承另一个选择器的样式

```scss
#button {
  border-radius: 5px;
}

.primary-button {
  @extend #button;
  color: white;
}
```

## 导入

> 将多个样式文件合并为一个文件，使用@import 指令引入其他文件中的样式。

```scss
@import "reset"; // 导入reset.scss文件
@import "variables"; // 导入variables.scss文件
// 可以继续编写样式
```

## 条件语句

> Sass 支持 if-else 语句，可以根据条件来选择应用哪些样式

```scss
$environment: "production";
body {
  @if $environment == "production" {
    background-color: #ffffff;
  } @else {
    background-color: #eeeeee;
  }
}
```

## 循环语句

> Sass 支持 for 循环和 each 循环，以及 while 循环，使样式表可以基于某个模式重复生成样式

```scss
$index: 6;
@for $i from 1 through 2 {
  .element-#{$i} {
    width: 10px * $i;
  }
}

@each $color in blue, red {
  .color-#{$color} {
    color: $color;
  }
}

@while $index> 0 {
  .box-#{$index} {
    width: 5px * $index;
  }
  $index: $index - 2;
}

-----------------------------
//生成的css代码
.element-1 {
  width: 10px;
}
.element-2 {
  width: 20px;
}
.color-blue {
  color: blue;
}
.color-red {
  color: red;
}
.box-6 {
  width: 30px;
}
.box-4 {
  width: 20px;
}
.box-2 {
  width: 10px;
}
```

## 运算符

> Sass 支持各种算术和逻辑操作符，可以在样式表中进行数值计算和条件判断,比如:

```scss
@if 1+1 == 2 {
  .color-text {
    color: aquamarine;
  }
}
```

## 命名空间

> Sass 允许将相关的样式组织在一个命名空间内，从而避免全局作用域的冲突.命名空间是通过嵌套规则来创建的，这样可以在一个大型项目中创建清晰的结构。

```scss
// 定义命名空间
.button {
  // 按钮的共享样式
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #000;

  // 子命名空间，用于特定按钮的样式
  &-primary {
    background-color: blue;
    color: white;
  }
}
```

## 函数

> 很多内置函数，还可以自定义函数

```scss
$oneWidth: 10px;
$twoWidth: 40px;
// 自定义函数
@function widthFn($n) {
  @return $n * $twoWidth + ($n - 1) * $oneWidth;
}
.leng {
  width: widthFn(5);
  height: percentage(0.2); // 20%;内置函数
  height: round(20.6px); // 20px;内置函数，四舍五入，keyi 携带单位的任何数值。
}
```
