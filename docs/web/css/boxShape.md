# 盒子形状
定义的形状被设计用来绘制浮动的元素。
## 定义基本形状
shape-outside 属性允许定义一个形状，它需要很多参数共同定义而成，这些参数被定义在 `<basic-shape>` 数据类型中。
- `inset( <shape-arg>{1,4} [round <border-radius>]? )`
 定义了一个插进的长方形。
  - 前四个参数分别代表了插进的长方形与相关盒模型的上，右，下与左边界和顶点的偏移量.这些参数遵循边际速记语法，所以给予一个、两个、或四个值都能设置四个偏移量。
  - 可选参数`<border-radius>`用于定义插进长方形顶点的圆弧角度，该参数同上遵循边际速记语法,给予一个、两个、或四个值都能设置四个偏移量。
- `circle( [<shape-radius>]? [at <position>]? )` 使用一个半径和一个位置定义一个圆形。
  - `<shape-radius>` 参数代表了 r， 即圆形的半径，不接受负数作为该参数的值。一个以百分比表示的值将以公式 sqrt(width^2+height^2)/sqrt(2)计算，其中 width 与 height 为相关盒模型的宽与高。
  - `<position>` 参数定义了圆心的位置。省缺值为盒模型的中心。

- `ellipse( [<shape-radius>{2}]? [at <position>]? )` 使用两个半径和一个位置定义一个椭圆。
- `polygon( [<fill-rule>,]? [<shape-arg> <shape-arg>]# )`
  - `<fill-rule>` 代表了填充规则（ filling rule ），即，如何填充该多边形。可选 nonzero（非零环绕规则）和 evenodd（奇偶规则）。该参数的省缺值为 nonzero。
  - 每一对在列表中的参数都代表了多边形顶点的坐标，xi 与 yi，i 代表顶点的编号，即，第 i 个顶点。

- `path( [<fill-rule>,]? <string>)` 使用一个 SVG fill-rule 和 SVG 路径定义来定义一个形状。
  - 可选的 `<fill-rule>` 表示 fill-rule 填充规则。可选 nonzero（非零环绕规则）和 evenodd（奇偶规则）。如果省略，则默认是 nonzero。
  - 参数 `<string>` 是用引号包含的 SVG Path 字符串
```css
<shape-arg> = <length> | <percentage>
<shape-radius> = <length> | <percentage> | closest-side | farthest-side
```
为一个圆形或椭圆形定义一个半径。其省缺值为 closest-side。

创建形状的一个简单方法是使用 Box 参数。形状也可以加上 Box 参数，通过对形状使用 box 值，我们可以将内容环绕在这些值定义的边上，类似box-sizing：
- border-box
- margin-box
- padding-box
- content-box

> shape-margin 属性在 shape-outside周围加上margin。

> shape-image-threshold 属性用于设定图像透明度的阈值并用来创建形状。 0.0 是缺省值 ，那么图像必须是全透明的。如果是 1.0 那么图像必须是模糊的。中间的值就代表了区分图像哪部分透明的阈值，以创建形状。

```css
.shape {
  background-color: rebeccapurple;
  height: 150px;
  width: 150px;
  padding: 20px;
  margin: 20px; 
  /**使用shape-outside属性必须是float元素 */
  float: left;
  /** 形状外的部分不在占据空间，但仍然会对应显示内容*/
  shape-outside: circle(50%)  content-box;
  /**截取内容区域，截取之外的部分不可见，但会占据空间 ,参数和shape-outside一致*/
  clip-path: circle(50%)  content-box;
  /**shape-outside周围加上5px的margin */
  shape-margin: 5px;

  /** 0.4的阈值作为分界，创建shape-outsite的边界。*/
  shape-image-threshold: 0.4;
  shape-outside: linear-gradient(45deg, rebeccapurple, transparent 80%,
  transparent);
}
```