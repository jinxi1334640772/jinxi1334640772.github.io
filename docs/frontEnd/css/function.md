## CSS 函数

## attr()

获取当前元素属性值，并用于其样式。用于伪元素，属性值采用伪元素所依附的元素。

```css
/* 简单用法 */
attr(data-count);
attr(title);

/* 带类型 */
attr(src url);
attr(data-count number);
attr(data-width px);

/* 带回退值 */
attr(data-count number, 0);
attr(src url, "");
attr(data-width px, inherit);
attr(data-something, "default");

/**用法 */
<p data-foo="hello">world</p>
p:before {
  content: attr(data-foo) " "; /** hello world */
}
```

## blur()

模糊半径，值为`<length>`。它定义了高斯函数的标准偏差值，即屏幕上有多少像素相互融合; 因此，较大的值会产生更多模糊。值为 0 会使输入保持不变。该值为空则为 0。

```css
/* 简单用法 */
blur(0)        /* No effect */
blur(8px)      /* Blur with 8px radius */
blur(1.17rem)  /* Blur with 1.17rem radius */

filter: blur(1.5rem);
```

## brightness()

将线性乘数应用于输入图像，使其看起来更亮或更暗

```css
/* 简单用法 */
brightness(0%)   /* 全黑 */
brightness(0.4)  /* 40% 亮度 */
brightness(1)    /* 无效果 */
brightness(200%) /* 两倍亮度 */
filter: brightness(50%);
```

## calc()

函数允许在声明 CSS 属性值时执行一些计算。它可以用在如下场合：`<length>、<frequency>, <angle>、<time>、<percentage>、<number>、或 <integer>。`

```css
 calc( <calc-sum> )
 calc(100% - 80px);
 calc(var(--widthB) / 2);
 calc(1.5rem + 3vw);
```

## calc-size()

允许执行计算内有值，例如 auto、fit-content、min-content、max-content。这类值不支持 calc()函数。返回一个等于经`<calc-sum>`表达式修改后的`<calc-size-basis>`的值。

```css
calc-size(<calc-size-basis>, <calc-sum>)
/* Pass a value through calc-size() */
calc-size(auto, size) /**0--auto之间 */
calc-size(fit-content, size)

/* Perform a calculation */
calc-size(min-content, size + 100px) /** 返回min-content+100px */
calc-size(fit-content, size / 2)

/* Calculation including a function */
calc-size(auto, round(up, size, 50px))

section {
  height: calc-size(calc-size(max-content, size), size + 2rem);
  height: calc-size(var(--intrinsic-size), size + 2rem);
  height: calc-size(any, 300px * 1.5); /* Returns 450px */
  height: calc-size(300px + 2rem, size / 2);
}
```

## circle()

定义了一个圆形，使用半径和位置来描述。它是 `<basic-shape>` 数据类型之一。

```css
circle( <radial-size>? [ at <position> ]? )

<radial-size> =
  closest-corner   |
  closest-side     |
  farthest-corner  |
  farthest-side                |
  <length [0,∞]>                |
  <length-percentage [0,∞]>{2}
/* 简单用法 */
shape-outside: circle(50%);
clip-path: circle(6rem at 12rem 8rem);

```

## clamp()

clamp() 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。它接收三个参数：最小值、首选值、最大值。 clamp() 被用在`<length>、<frequency>、<angle>、<time>、<percentage>、<number>、<integer>`中都是被允许的 clamp(MIN, VAL, MAX) 其实就是表示 max(MIN, min(VAL, MAX))。

```css
 clamp( [ <calc-sum> | none ] , <calc-sum> , [ <calc-sum> | none ] )

clamp(1.8rem, 2.5vw, calc(70% + 100px));
```

## color-contrast()

函数标记接收 color 值，并将其与其他的 color 值比较，从列表中选择最高对比度的颜色。

```css
color-contrast(color vs color-list)
color-contrast(wheat vs tan, sienna, #d2691e)
color-contrast(#008080 vs olive, var(--myColor), #d2691e)

```

## color-mix()

标记接收两个`<color>`值，并返回在指定颜色空间、指定数量混合后的颜色

```css
/**method:指定插值颜色空间的 <color-interpolation-method> 值。 */
/**p1,p2:0% 到 100% 之间的 <percentage> 值，指定每个颜色混合的数量 */
color-mix(method, color1[ p1], color2[ p2])

  color-mix( <color-interpolation-method> , [ <color> && <percentage [0,100]>? ]#{2} )

<color-interpolation-method> =
  in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]

<rectangular-color-space> =
  srgb          |
  srgb-linear   |
  display-p3    |
  a98-rgb       |
  prophoto-rgb  |
  rec2020       |
  lab           |
  oklab         |
  xyz           |
  xyz-d50       |
  xyz-d65

<polar-color-space> =
  hsl    |
  hwb    |
  lch    |
  oklch

<hue-interpolation-method> =
  [ shorter | longer | increasing | decreasing ] hue


color-mix(in lch, plum, pink);
color-mix(in lch, plum 40%, pink);
color-mix(in srgb, #34c9eb 20%, white);
color-mix(in hsl longer hue, hsl(120 100% 50%) 20%, white);

```

## contrast()

调整输入图像的对比度。结果是一个 `<filter-function>`.

```css
contrast(amount)

contrast(0)     /* 完全灰色 */
contrast(65%)   /* 65% 对比度 */
contrast(1)     /* 无效果 */
contrast(200%)  /* 两倍对比度 */

```

## drop-shadow()

投影实际上是输入图像的 alpha 蒙版的一个模糊的、偏移的版本，用特定的颜色绘制并合成在图像下面。

> 这个函数有点类似于 box-shadow 属性。box-shadow 属性在元素的整个框后面创建一个矩形阴影，而 drop-shadow() 过滤器则是创建一个符合图像本身形状 (alpha 通道) 的阴影。

```css
/* 双长度值 */
/* drop-shadow( <length> <length> ) */
drop-shadow(5px 5px)

/* 三长度值 */
/* drop-shadow( <length> <length> <length> ) */
drop-shadow(5px 5px 15px)

/* 双长度值加一个颜色值 */
/* drop-shadow( <length> <length> <color> ) */
drop-shadow(5px 5px red)

/* 三长度值加一个颜色值 */
/* drop-shadow( <length> <length> <length> <color> ) */
drop-shadow(5px 5px 15px red)

/* 可以改变颜色和长度值的顺序 */
/* drop-shadow( <color> <length> <length> <length> ) */
drop-shadow(#e23 0.5rem 0.5rem 1rem)

drop-shadow(.5rem .5rem 1rem .3rem #e23)
```

## ellipse()

椭圆本质上是一个扁平的圆形，因此 ellipse() 的行为与 circle() 非常相似，只是我们需要指定两个半径 x 和 y。是 `<basic-shape>` 数据类型之一。

```css
shape-outside: ellipse(40% 50% at left);
shape-outside: ellipse(closest-side farthest-side at 30%);

clip-path: ellipse(closest-side farthest-side);
```

## fit-content()

将给定大小夹紧为可用大小 根据公式 min(maximum size, max(minimum size, argument))，返回值如下：

- argument < min-content 返回 min-content
- min-content < argument < max-content 返回 argument
- argument > max-content 返回 max-content

```css
/* <length> values */
fit-content(200px)
fit-content(5cm)
fit-content(30vw)
fit-content(100ch)

/* <percentage> value */
fit-content(40%)
/** 有点类似该clamp函数，判断中间值 */
clamp(min-content, 10vw, max-content);
```

## grayscale()

对图片进行灰度转换，它是 `<filter-function>` 的子属性。

```css
grayscale(amount)

grayscale(0)     /* 无效果 */
grayscale(.7)    /* 70% 灰度 */
grayscale(100%)  /* 灰度最大 */

```

## hsl()

标记根据其色相、饱和度和明度来表达 sRGB 颜色。

使用 hsl() 来定义互补色可以用一个公式来完成，因为它们位于色环中同一直径上。如果一个颜色的色相度是 θ，那么其互补色的色相角就是 180deg - θ。

```css
hsl(120deg 75% 25%)
hsl(120deg 75% 25% / 0.6)

```

## image-set()

让浏览器从 image-set 中，选择一个最合适的 CSS image，主要应对高像素屏幕。

```css
.box {
  /* Select image based on resolution */
image-set(
  "image1.jpg" 1x,
  "image2.jpg" 2x
);

image-set(
  url("image1.jpg") 1x,
  url("image2.jpg") 2x
);

/* Select gradient based on resolution */
image-set(
  linear-gradient(blue, white) 1x,
  linear-gradient(blue, green) 2x
);

/* Select image based on supported formats */
image-set(
  url("image1.avif") type("image/avif"),
  url("image2.jpg") type("image/jpeg")
);

  background-image: image-set(
    "large-balloons.avif" type("image/avif"),
    "large-balloons.jpg" type("image/jpeg")
  );
  /** 不支持image-set时回退 */
    background-image: url("large-balloons.jpg");
}

```

## image()

引入`<image>`图片

```css
/**不支持或者没发现image-src，将回退到color */
 image( <image-tags>? [ <image-src>? , <color>? ]! )
 /** 图片方向 */
 <image-tags> =
  ltr  |
  rtl
/** 图片的url或者url() */
<image-src> =
  <url>     |
  <string>

/* 找不到图片，则回退到颜色rgb*/
image(rgb(0 0 0 / 25%)), url("firefox.png");
/**图片方向，图片URL，回退的颜色 */
image(ltr,"sprite.png#xywh=32,64,16,16",red);

 /* 320x240 image at x=160 and y=120 */
xywh=160,120,320,240
/* 320x240 image at x=160 and y=120 */
xywh=pixel:160,120,320,240
 /* 50%x50% image at x=25% and y=25% */
xywh=percent:25,25,50,50
```

## inset()

定义一个矩形，并指定每一边到容器内侧的距离。它是用于定义 `<basic-shape>` 数据类型之一。

```css
<inset()> =
  inset( <length-percentage>{1,4} [ round <'border-radius'> ]? )

<length-percentage> =
  <length>      |
  <percentage>

<border-radius> =
  <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?
/**round：设置圆角半径 */
shape-outside: inset(20px 50px 10px 0 round 50px);
clip-path: inset(4rem 20% round 1rem 2rem 3rem 4rem);

```

## invert()

反转颜色，filter-function

```css
invert(0)     /* No effect */
invert(.6)    /* 60% inversion */
invert(100%)  /* Completely inverted */

```

## lab()

函数记号 lab() 在 CIE L*a*b\* 颜色空间中表示指定颜色。Lab 表示人可见的全部颜色的范围。

```css

lab(29.2345% 39.3825 20.0664);
lab(52.2345% 40.1645 59.9971);
lab(52.2345% 40.1645 59.9971 / .5);

```

## layer()

配合@import 规则，将导入的外部样式定义为一个级联层

```css
@import url layer(layer-name);
@import "dark.css" layer(framework.themes.dark);
```

## light-dark()

指定两种颜色，返回匹配系统主题的颜色。为了支持 light-dark()，color-scheme 必须有 light dark 的值。在:root 设配置，如下：

```css
:root {
  color-scheme: light dark;
}
body {
  color: light-dark(#333b3c, #efefec);
}

/* RGB color values */
color: light-dark(rgb(0 0 0), rgb(255 255 255));

/* Custom properties */
color: light-dark(var(--light), var(--dark));
```

## max()

max() 这个 CSS 函数让你可以从一个逗号分隔的表达式列表中选择最大（正方向）的值作为属性的值 . max() 可以用于以下场合 `<length>, <frequency>, <angle>, <time>, <percentage>, <number>, 或 <integer> `。

css

```css
h1.responsive {
  font-size: max(4vw, 2em, 2rem);
}
font-size: max(min(0.5vw, 0.5em), 1rem);
```

## min()

min() CSS 方法允许你从逗号分隔符表达式中选择一个最小值作为 CSS 的属性值。min() 方法可以用于以下任何属性中 `<length>, <frequency>, <angle>, <time>, <percentage>,<number>, 或者 <integer>。`

```css
width: min(50vw, 300px);
```

## minmax()

CSS 函数 minmax() 定义了一个长宽范围的闭区间，它与 CSS 网格布局一起使用。

```css
minmax(200px, 1fr)
minmax(400px, 50%)
minmax(30%, 300px)
minmax(100px, max-content)
minmax(min-content, 400px)
minmax(max-content, auto)
minmax(auto, 300px)
minmax(min-content, auto)
```

## mod()

数学取模函数

```css
/* Unitless <number> */
line-height: mod(7, 2); /* 1 */
line-height: mod(14, 5); /* 4 */
line-height: mod(3.5, 2); /* 1.5 */

/* Unit based <percentage> and <dimension> */
margin: mod(15%, 2%); /* 1% */
margin: mod(18px, 4px); /* 2px */
margin: mod(19rem, 5rem); /* 4rem */
margin: mod(29vmin, 6vmin); /* 5vmin */
margin: mod(1000px, 29rem); /* 72px - if root font-size is 16px */

/* Negative/positive values */
rotate: mod(100deg, 30deg); /* 10deg */
rotate: mod(135deg, -90deg); /* -45deg */
rotate: mod(-70deg, 20deg); /* 10deg */
rotate: mod(-70deg, -15deg); /* -10deg */

/* Calculations */
scale: mod(10 * 2, 1.7); /* 1.3 */
rotate: mod(10turn, 18turn / 3); /* 4turn */
transition-duration: mod(20s / 2, 3000ms * 2); /* 4s */
```

## opacity()

The opacity() CSS 函数在输入的图片实例上应用透明度属性，它的结果是一个 `<filter-function>`.

```css
opacity(0%)   /* 完全透明*/
opacity(50%)  /* 50% 透明 */
opacity(1)    /* 无效果 */

```

## path()

path() CSS 函数接受 SVG 路径字符串作为参数，用于 CSS 形状和运动路径模块中绘制形状。path() 函数是 `<basic-shape>` 数据类型的值。它可以用于 CSS 的 offset-path 和 clip-path 属性，以及 SVG 的 d 属性。

```css
<path()> =
  path( <'fill-rule'>? , <string> )

<fill-rule> =
  nonzero  |
  evenodd

path("M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80");
path(evenodd,"M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80");

```

## perspective()

配置透视距离

```css
/**这个<length> 得到的是距离 0 坐标的距离 */
perspective(d)
```

## polygon()

polygon() CSS 函数是` <basic-shape>` 数据类型之一。它用于通过提供一个或多个坐标对（每一个坐标代表形状的一个顶点）来绘制多边形。

```css
<polygon()> =
  polygon( <'fill-rule'>? [ round <length> ]? , [ <length-percentage> <length-percentage> ]# )

<fill-rule> =
  nonzero  |
  evenodd

<length-percentage> =
  <length>      |
  <percentage>
/* 指定坐标列表 */
/* polygon(<length-percentage> <length-percentage>, ... )*/
polygon(50% 2.4%, 34.5% 33.8%, 0% 38.8%, 25% 63.1%, 19.1% 97.6%)
polygon(0px 0px, 200px 100px, 0px 200px)
polygon(0% 0px, 100% 100px, 0px 100%)
polygon(0 0, 50% 1rem, 100% 2vw, calc(100% - 20px) 100%, 0 100%)

/* 指定填充规则和坐标列表 */
/* polygon(<fill-rule> <length-percentage> <length-percentage>, ... )*/
polygon(nonzero, 0% 0%, 50% 50%, 0% 100%)
polygon(evenodd, 0% 0%, 50% 50%, 0% 100%)

```

## rect()

创建一个矩形，该矩形位于包含块的顶部和左侧边缘的指定距离处。它是 `<basic-shape>` 数据类型的基本形状函数。

```css
/**创建元素移动的矩形路径 */
offset-path: rect(50px auto 200px 50px round 20%);
/** 裁剪区域的形状*/
clip-path: rect(50px auto 200px 50px round 20%);
```

## rem()

取余函数，可以参数带单位

```css
/* Unitless <number> */
line-height: rem(21, 2); /* 1 */
line-height: rem(14, 5); /* 4 */
line-height: rem(5.5, 2); /* 1.5 */

/* Unit based <percentage> and <dimension> */
margin: rem(14%, 3%); /* 2% */
margin: rem(18px, 5px); /* 3px */
margin: rem(10rem, 6rem); /* 4rem */
margin: rem(26vmin, 7vmin); /* 5vmin */
margin: rem(1000px, 29rem); /* 72px - if root font-size is 16px */

/* Negative/positive values */
rotate: rem(200deg, 30deg); /* 20deg */
rotate: rem(140deg, -90deg); /* 50deg */
rotate: rem(-90deg, 20deg); /* -10deg */
rotate: rem(-55deg, -15deg); /* -10deg */

/* Calculations */
scale: rem(10 * 2, 1.7); /* 1.3 */
rotate: rem(10turn, 18turn / 3); /* 4turn */
transition-duration: rem(20s / 2, 3000ms * 2); /* 4s */
```

## repeat()

定义 grid 布局中轨道的重复次数，允许以更紧凑的形式写入大量显示重复模式的列或行。

> 用于 grid-template-columns 和 grid-template-rows 中配置重复轨道。

```css
repeat(4, [col-start] min-content [col-end])
repeat(4, [col-start] max-content [col-end])
repeat(4, [col-start] auto [col-end])
repeat(4, [col-start] minmax(100px, 1fr) [col-end])
repeat(4, [col-start] fit-content(200px) [col-end])
repeat(4, 10px [col-start] 30% [col-middle] auto [col-end])
repeat(4, [col-start] min-content [col-middle] max-content [col-end])
```

## round()

根据选择的舍入策略和舍入间隔，返回一个舍入数。

```css
/**round(舍入策略, 要舍入的值, 舍入间隔) 四舍五入的间隔是5，*/
<round()> =
  round( <rounding-strategy>? , <calc-sum> , <calc-sum>? )

<rounding-strategy> =
  nearest  |
  up       |
  down     |
  to-zero
width: round(var(--width), 50px);
width: round(up, 101px, var(--interval));
width: round(down, var(--height), var(--interval));
margin: round(to-zero, -105px, 10px);
/**用round配置出四舍五入：24.6四舍五入为25 */
margin: round(nearest, 123, 5);
```

## saturate()

饱和度函数。返回 filter-function

```css
saturate(0)     /* Completely unsaturated */
saturate(.4)    /* 40% saturated */
saturate(100%)  /* No effect */
saturate(200%)  /* Double saturation */

```

## scroll()

与 animation-timeline 一起使用，指示一个可滚动的元素和滚动轴，这将为当前元素的动画化提供一个匿名的滚动进度时间表。滚动进度时间轴是通过在上下（或左右）之间滚动滚轮来进行的。滚动范围内的位置被转换为进度的百分比-开始时为 0%，结束时为 100%。

```css
scroll( [ <scroller> || <axis> ]? )

<scroller> =
  root     |
  nearest  |
  self

<axis> =
  block   |
  inline  |
  x       |
  y

/* Function with no parameters set */
animation-timeline: scroll();

/* Values for selecting the scroller element */
animation-timeline: scroll(nearest); /* Default */
animation-timeline: scroll(root);
animation-timeline: scroll(self);

/* Values for selecting the axis */
animation-timeline: scroll(block); /* Default */
animation-timeline: scroll(inline);
animation-timeline: scroll(y);
animation-timeline: scroll(x);

/* Examples that specify scroller and axis */
animation-timeline: scroll(block nearest); /* Default */
animation-timeline: scroll(inline root);
animation-timeline: scroll(x self);

```

## sepia()

将图像转换为棕褐色，使其具有更温暖、更黄/棕色的外观。其结果是一个`<filter-function>`。

```css
sepia(0)     /* No effect */
sepia(.65)   /* 65% sepia */
sepia(100%)  /* Completely sepia */

```

## shape()

定义 clip-path 和 offset-path 属性的形状。它结合了一个初始起点和一系列定义形状路径的形状命令。shape() 函数是 `<basic-shape> `数据类型的成员。

```css
/* <fill-rule> */
clip-path: shape(nonzero from 0 0, line to 10px 10px);

/* <move-command>、<line-command> 和 close */
offset-path: shape(from 10px 10px, move by 10px 5px, line by 20px 40%, close);

/* <hvline-command> */
offset-path: shape(from 10px 10px, hline by 50px, vline to 5rem);

/* <curve-command> */
offset-path: shape(from 10px 10px, curve to 80px 80px via 160px 1px 20% 16px);

/* <smooth-command> */
offset-path: shape(from 10px 10px, smooth to 100px 50pt);

/* <arc-command> */
offset-path: shape(
  from 5% 0.5rem,
  arc to 80px 1pt of 10% ccw large rotate 25deg
);

/* 使用 CSS 数学函数 */
offset-path: shape(
  from 5px -5%,
  hline to 50px,
  vline by calc(0% + 160px),
  hline by 70.5px,
  close,
  vline by 60px
);

clip-path: shape(
  nonzero from 10px 10px,
  curve to 60px 20% via 40px 0,
  smooth to 90px 0,
  curve by -20px 60% via 10% 40px 20% 20px,
  smooth by -40% -10px via -10px 70px
);
```

## var()

获取 CSS 变量的值。CSS 变量以`--`开头：`--theme-color`。可以在:root 伪类中定义全局变量。

```css
<var() > = var( <custom-property-name> , <declaration-value>? ) :root {
  --backup-bg-color: teal;
}

body {
  /*如果 backup-bg-color 没有被设置，将使用回退值 white。 */
  color: var(--main-bg-color, var(--backup-bg-color, white));
}
```

> var()允许使用逗号设置多个回退值。例如，var(--foo, red, blue)。

## url()

用于包含文件。参数可以是绝对 URL、相对 URL、blob URL 或数据 URL。url() 函数可以作为其他 CSS 函数的参数传递，如 attr() 函数。所查找的资源可以是图像、字体或样式表。

```css
/* 简单用法 */
url("https://example.com/images/myImg.jpg");
url('https://example.com/images/myImg.jpg');
url(https://example.com/images/myImg.jpg);
url("data:image/jpg;base64,iRxVB0…");
url(myImg.jpg);
url(#IDofSVGpath);

/* 相关属性 */
background-image: url("star.gif");
list-style-image: url('../images/bullet.jpg');
content: url("pdficon.jpg");
cursor: url(mycursor.cur);
border-image-source: url(/media/diamonds.png);
src: url('fantasticfont.woff');
offset-path: url(#path);
mask-image: url("masks.svg#mask1");

/* 带回退的属性 */
cursor: url(pointer.cur), pointer;

/* 相关的简写属性 */
background: url('star.gif') bottom right repeat-x blue;

/* 作为另一个 CSS 函数的参数 */
background-image: cross-fade(20% url(first.png), url(second.png));
mask-image: image(url(mask.png), skyblue, linear-gradient(rgb(0 0 0 / 100%), transparent));

/* 作为非简写多重数值的一部分 */
content: url(star.svg) url(star.svg) url(star.svg);

/* at 规则 */
@document url("https://www.example.com/") { /* … */ }
@import url("https://www.example.com/style.css");
@namespace url(http://www.w3.org/1999/xhtml);

```

## xywh()

使用与包含区块的左边缘（x）和顶部边缘（y）的指定距离，以及矩形的特定宽度（w）和高度（h）来创建一个矩形。

```css
/** 创建元素移动的矩形路径*/
offset-path: xywh(0 1% 2px 3% round 0 1px 2% 3px);
/**定义裁剪区域的形状 */
clip-path: xywh(1px 2% 3px 4em round 0 1% 2px 3em);
```
