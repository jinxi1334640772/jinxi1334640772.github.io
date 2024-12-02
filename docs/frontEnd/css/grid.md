# grid 网格布局

## 认识网格线

> 网格是由一系列水平及垂直的线构成的一种布局模式。一个网格通常具有许多的列（column）与行（row），以及行与行、列与列之间的间隙，这个间隙一般被称为沟槽（gutter）。

![alt text](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grids/grid.png)

> 网格线

![alt text](image.png)

## grid 常用属性和方法

> fr fraction 片段。是一个自适应单位，用于分配剩余空间，会根据各自数字按比例分配
> minmax(100px,200px) 函数来创建范围尺寸,可以接受任何长度值，也接受 auto 值。

> repeat(3,100px) 创建重复的网格轨道，重复次数、轨道尺寸。[col1-start] 100px [col1-end] 5px [col2-start] 100px,用来自定义网格线名称，用[]包裹。

> auto-fill 自动填充。应用 repeat 函数中，repeat(auto-fill,minmax(200px,1fr))，代表需要重复的次数会自动填充，尽可能占满屏幕。用来做响应式布局很方便

> auto 自动。允许网格轨道基于内容的尺寸拉伸或挤压。一行代码轻松实现两端固定中间自适应布局 grid-template-columns:100px auto 100px;

> min-content 表示内容的最小固有尺寸。对于文本内容而言，这意味着内容会利用所有软换行的机会，变得尽可能的小。

> max-content 表示内容的最大固有尺寸。对于文本内容，这意味着即使内容会导致溢出，它也不会换行

> fit-content 相当于 fit-content(stretch)，盒子会使用可用空间，介于 min-content 和 max-content 之间，根据内容有浏览器自动调整可用尺寸。

## grid 父容器设置

> 当设置了网格布局后，column,float,clear,vertical-align 将失效

> `以下设置的都是单元格的大小，并非item的大小，切记切记。当item设置了大小，并且小于单元格时，可以设置item在单元格内水平和垂直方向的排列方式，justify-items\align-items`

- display : grid(块级 block) | line-grid(行内块 inline-block) | subgrid(继承父元素的行和列的大小) ;

### 设置行数和列数

- grid-template-columns : 40px 50px;列数和每列宽度。不超过 grid item 的个数
- grid-template-rows ：45px 50px; 行数和每行高度。超过显示的列数，超过的部分将失效；
- grid-template-areas : '单元格 1 单元格 2 单元格 3'; 该属性用来定义网格区域，和单元格相对应，指定各个单元格的名称。使用规则如下：
  - 需要填满网格的每个格子
  - 对于某个横跨多个格子的元素，重复写上那个元素 grid-area 属性定义的区域名字
  - 所有名字只能出现在一个连续的区域，不能在不同的位置出现
  - 一个连续的区域必须是一个矩形
  - 使用.符号，让一个格子留空

### 设置行列间距

- grid-row-gap:20px; 行间距
- grid-column-gap:30px; 列间距
- grid-gap : grid-row-gap grid-column-gap ;两个属性的缩写
- gap: 20px; gap 属性曾经有一个 grid-前缀，不过后来的标准进行了修改，目的是让他们能够在不同的布局方法中都能起作用。尽管现在这个前缀不会影响语义，但为了代码的健壮性，你可以把两个属性都写上。

### 设置 item 排列方向

- grid-auto-flow:row|column; 调整横向或者纵向排列，默认 row：横向排列
  - 可以加入 dense 关键字：紧凑布局，没有缺口的布局。grid-auto-flow: column dense。

### 设置 item 在单元格内的排列方式

- justify-items:start|center|end|stretch;item 在单元格内的水平对齐方式
- align-items：start|center|end|stretch;item 在单元格内的垂直对齐方式
- place-items:justify-items align-items;简写形式

### 设置网格在容器内的排列方式

- justify-content:start|center|end|stretch|space-around|space-between|space-evenly;网格在容器水平方向上的位置
- align-content:start|center|end|stretch|space-around|space-between|space-evenly;网格在容器垂直方向上的位置
- place-content:justify-conent align-content;简写

## grid item 设置

> 下列数字都是指的网格线，并不是单元格，切记切记。都是用于合并单元格

### 合并单元格

- grid-row-start: 2;
- grid-row-end: 4|span 2; 结束网格线序号为 4|或者跨越两个尺度。
- grid-column-start: 1;
- grid-column-end: 3;
- grid-row：1/3; grid-row-start/grid-row-end
- grid-column：1/3 ; 是 grid-column-start/grid-column-end 的简写。
- grid-area : 2/2/3/4 | 单元格名称; grid-row-start/grid-column-start/grid-row-end/grid-column-end。也可以指定单元格名称，把该元素放到单元格名称对应的位置。需要 grid-template-areas 定义好每个单元格的名称

### 单元格排序

- order:3; 排序

## 隐式网格

> 显式网格是我们用 grid-template-columns 或 grid-template-rows 属性创建的。而隐式网格则是当有内容被放到网格外时才会生成的。显式网格与隐式网格的关系与弹性盒子的 main 和 cross 轴的关系有些类似。

隐式网格中生成的行/列大小是参数默认是 auto ，大小会根据放入的内容自动调整。当然，你也可以使用 grid-auto-rows 和 grid-auto-columns 属性手动设定隐式网格轨道的大小。

简单来说，隐式网格就是为了放显式网格放不下的元素，浏览器根据已经定义的显式网格自动生成的网格部分。

- grid-auto-rows
- grid-auto-columns

```css
/** 设置隐式网格的宽度minmax(100px, auto);*/
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  /**也可以向 grid-auto-rows 属性传入一个轨道列表，行的大小就会按轨道列表重复设置。 */
  grid-auto-rows: 100px 200px;
  /**同上 */
  grid-auto-columns: 300px 100px;
  grid-gap: 20px;
}
```

## 命名网格线

通过网格线序号来定义 area 不够直观，可以通过给网格线起名。在选择名字时，一个区可以把区域周围的线都用 -start 和 -end 作为后缀，容易理解。如下：

```cs
.wrapper {
  display: grid;
  grid-template-columns: [main-start] 1fr [content-start] 1fr [content-end] 1fr [main-end];
  grid-template-rows: [main-start] 100px [content-start] 100px [content-end] 100px [main-end];
  /** 使用 repeat() 定义多个同名网格线*/
  grid-template-columns: repeat(12, [col-start] 1fr);
}
.thing {
  grid-area: content;
  /**通过网格线名称，定义网格区域area */
  grid-column: col-start / col-start 5;
  /**此处也可以使用 span 关键字。比如下一个项目的位置从名为 col-start 的第 7 条线开始，跨越 3 条线。 */
  grid-column: col-start 7 / span 3;

  // repeat 语法不仅可用于重复的单一轨道尺寸，也可以用于轨道列表
  /**在一个名为 col1-start 的 1fr 窄轨道之后，跟着是一个名为 col2-start 的 3fr 宽轨道。 */
  grid-template-columns: repeat(4, [col1-start] 1fr [col2-start] 3fr);
  /**创建了四条 1fr 的轨道，每条轨道都有开始名和结束名。 */
  grid-template-columns: repeat(4, [col-start] 1fr [col-end]);
}
```

## grid-template

所简写属性：grid-template-rows、grid-template-columns 与 grid-template-areas。

```css
/* 值为关键词 */
grid-template: none;

/* 为 grid-template-rows / grid-template-columns */
grid-template: 100px 1fr / 50px 1fr;
grid-template: auto 1fr / auto 1fr auto;
grid-template: [linename] 100px / [columnname1] 30% [columnname2] 70%;
grid-template: fit-content(100px) / fit-content(40%);

/* 为 grid-template-areas grid-template-rows / grid-template-column */
grid-template:
  "a a a"
  "b b b";
grid-template:
  "a a a" 20%
  "b b b" auto;
grid-template:
  [header-top] "a a a" [header-bottom]
  [main-top] "b b b" 1fr [main-bottom]
  / auto 1fr auto;

/* 为全局值 */
grid-template: inherit;
grid-template: initial;
grid-template: unset;
```
