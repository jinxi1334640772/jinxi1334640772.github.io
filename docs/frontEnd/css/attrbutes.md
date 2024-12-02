# CSS 属性

## box-decoration-break

当元素跨多行、多列或多页时，元素片段的装饰效果应如何呈现。

- slice 元素被按照盒子被切割前的原始样式渲染，之后，针对每个行/列/页面将此假设框渲染成片段
- clone 每个框片段与指定的边框、填充和边距独立呈现。

## caret-color 光标颜色

- auto 默认颜色
- color 值

## color-scheme

操作系统颜色方案的常见选择为“亮色”和“暗色”，或“日间模式”和“夜间模式”。当用户选择其中一种颜色方案时，操作系统会对用户界面进行调整，包括表单控件、滚动条和 CSS 系统颜色的使用值。

- normal 表示元素未指定任何配色方案，因此应使用浏览器的默认配色方案呈现。
- light 表示可以使用操作系统亮色配色方案渲染元素。
- dark
- only 禁止用户代理覆盖元素的颜色方案。

```css
/**只能是亮色，用户无法配置 */
color-scheme: only light;
/**有用户配置决定 */
color-scheme: light dart;
/**要将整个页面配置为使用用户的配色方案首选项，请在 :root 元素上指定 color-scheme。 */
:root {
  color-scheme: light dark;
}
```

## contain

CSS 属性 contain 标示了元素及其内容尽可能独立于文档树的其余部分。局限使 DOM 的一部分得以被隔离，且通过将布局、样式、绘制、尺寸或其任意组合，限制 DOM 子树而非整个页面，而使性能受益。局限也可用于限制 CSS 计数器和引号的作用域。

有四种类型的 CSS 局限——尺寸、布局、样式和绘制，且均设置在容器上。多个局限用空格分隔。对被局限属性的修改不会传播到其余部分。在独立元素组的页面上使用 contain 属性较为有用，益处在于浏览器无需经常重渲 DOM 或页面布局，并且不影响外围元素。其属性有：

- none 元素照常渲染，不应用局限。
- strict 应用所有局限规则。此值等价于 contain: size layout paint style。
- content 应用除 size 外的所有局限规则。此值等价于 contain: layout paint style。
- size 在行向和块向上应用尺寸局限。元素尺寸可无视子元素单独计算。此值不可与 inline-size 结合使用。
- inline-size 只应用行向尺寸局限。
- layout 局限内部布局。此值意味着元素外的任意内容和元素内部布局互不影响。
- style 局限样式。计数器和引号的作用域被限制为元素及其内容。
- paint 局限绘制，不会绘制超出元素的内容。

元素尺寸局限时的尺寸配置：

- contain-intrinsic-height 用于布局的元素高度。
- contain-intrinsic-width 用于布局的元素宽度。
- contain-intrinsic-size 用于布局的元素尺寸。

```css
contain = none|strict|content|
  [ [ size | inline-size ] || layout || style || paint ]

/* 关键词值 */
contain-intrinsic-width: none;

/* auto <length> 当有子元素超出contain元素时，为auto；否则为指定的 <length>。*/
contain-intrinsic-size: auto 300px;

/* auto 宽度 | auto 高度 */
contain-intrinsic-size: auto 300px auto 4rem;
```

## cursor 光标配置

设置光标的类型（如果有），在鼠标指针悬停在元素上时显示相应样式。

- auto 浏览器根据当前内容决定指针样式
- default 默认指针，通常是箭头。
- none
- help 禁止用户代理覆盖元素的颜色方案。
- pointer 悬浮于连接上时，通常为手
- progress 程序后台繁忙，用户仍可交互
- wait 程序后台繁忙，用户不可交互
- cell 指示单元格可被选中
- crosshair 交叉指针，通常指示位图中的框选
- text 指示文字可被选中
- vertical-text 指示垂直文字可被选中
- alias 复制或快捷方式将要被创建
- copy
- move
- no-drop
- not-allowed
- grab 可被抓取，手
- all-scroll
- col-resize
- zoom-in
- zoon-out
- ......

## direction

direction CSS 属性用于设置文本、表格列和水平溢出的方向。

> 文本方向通常在文档中定义（例如，使用 HTML 的 dir 属性 属性），而不是通过直接使用 direction 属性来定义。与 HTML 中的 dir 属性不同，direction 属性不会从表列继承到表单元格，因为 CSS 继承遵从文档流，而表单元格位于行内部，但不在列内部。

设置块级元素文本的基本方向，也可以设置由通过 unicode-bidi 属性创建的嵌入元素的方向。direction 和 unicode-bidi 属性是唯二不受 all 简写属性影响的属性。

```css
/* 关键字值 */
direction: ltr; /**对于从左到右书写的语言，应设置为 ltr */
direction: rtl; /**对于从右到左书写的语言，应设置为 rtl */
```

## empty-cells

定义了用户端 user agent(浏览器) 应该怎么来渲染表格` <table>` 中没有可见内容的单元格的边框和背景。

只有当 border-collapse 属性值是 separate 时，才会生效。

- show 边框和背景正常渲染。与普通元素一样。
- hide 边框和背景被隐藏。

## forced-color-adjust

允许用户将某些元素从强制颜色模式中移除，这些值的控制权将交还给 CSS。

此属性应仅用于进行支持用户颜色和对比度需求的更改。例如，如果你发现用户代理所做的颜色优化在高对比度或暗黑模式下体验不佳，可以使用此属性调整该模式下的结果，以提供更好的体验。使用此属性时不应忽视用户的选择。

- auto 在强制颜色模式下，元素的颜色由用户代理调整。这是默认值。
- none 在强制颜色模式下，用户代理不会自动调整元素的颜色

```css
forced-color-adjust =
  auto                   |
  none                   |
  preserve-parent-color
```

## hyphens 连字符

告知浏览器在换行时如何使用连字符连接单词。

> 连字规则具有语言特定性。在 HTML 中，语言由 lang 属性决定，浏览器只会在当前属性存在且有合适的连字字典可用的情况使用连字符进行连接。在 XML 中，必须使用 xml:lang 属性。

- none 即便单词内有建议换行点也不会在那里换行。只会在空白符处换行。
- manual 只有当单词内存在建议换行点时，才会在该位置断开单词并使用连字符换行
- auto 浏览器根据语言自主决定。必须使用 HTML 属性 lang 指定语言，以确保自动断词在你选择的语言中得到应用。

```css
hyphens =
  none    |
  manual  |
  auto
```

## image-orientation

CSS 属性 image-orientation 用来修正某些图片的预设方向。该属性不是用来对图片进行任意角度旋转的，它是用来修正那些带有不正确的预设方向的图片的。因此该属性值会被四舍五入到 90 度的整数倍

- from-image 根据图片的 EXIF 数据来旋转图片，EXIF 中有一个控制图片旋转度的属性。
- `<angle>` 图片旋转值 `<angle>` , 会被自动四舍五入到 90deg (0.25turn) 的整数倍。
- flip 对图片进行水平翻转，先进行第二个参数执行的旋转，再进行此次翻转。

```css
image-orientation =
  from-image           |
  none                 |
  [ <angle> || flip ]

```

## image-rendering

CSS 属性 image-rendering 用于设置图像缩放算法。它适用于元素本身，适用于元素其他属性中的图像，也应用于子元素。

当页面作者指定的尺寸不是图像的原始尺寸时，用户代理将缩放图像。缩放也可能由于用户互动（双指缩放）而发生。

- auto 自 Gecko 1.9（Firefox 3.0）起，Gecko 使用双线性（bilinear）算法进行重新采样（高质量）。
- smooth 应使用能最大化图像客观观感的算法来缩放图像。特别地，会“平滑”颜色的缩放算法是可以接受的，例如双线性插值。这适用于照片等类型的图像。
- high-quality 与 smooth 相同，但更倾向于高质量的缩放。如果系统资源受到限制，在考虑降低哪些图像的质量以及降低到什么程度时，high-quality 的图像应该优先于任何其他值的图像。
- crisp-edges 必须使用可有效保留对比度和图像中的边缘的算法来对图像进行缩放，并且，该算法既不会平滑颜色，又不会在处理过程中为图像引入模糊。合适的算法包括最近邻居（nearest-neighbor）算法和其他非平滑缩放算法，比如 2×SaI 和 hqx-\* 系列算法。此属性值适用于像素艺术作品，例如一些网页游戏中的图像。
- pixelated 放大图像时，使用最近邻居算法，因此，图像看着像是由大块像素组成的。缩小图像时，算法与 auto 相同。

```css
image-rendering =
  auto          |
  smooth        |
  high-quality  |
  pixelated     |
  crisp-edges

```

## inset

CSS 属性 inset 为简写属性，对应于 top、right、bottom 和 left 属性。其与 margin 简写属性具有相同的多值语法。

```css
/* 关键词值 */
inset: auto;

/* 长度值 */
inset: 10px; /* 应用于所有边 */
inset: 4px 8px; /* 上下 | 左右 */
inset: 5px 15px 10px; /* 上 | 左右 | 下 */
inset: 2.4em 3em 3em 3em; /* 上 | 右 | 下 | 左 */

/* 包含块的宽度（左或右）或高度（上或下）的百分比 */
inset: 10% 5% 5% 5%;
```

## isolation

isolation CSS 属性决定了元素是否必须创建一个新的层叠上下文。该属性与 mix-blend-mode 和 z-index 结合使用时尤其有用。

- auto 只有当某个属性需要时，才会创建一个新的层叠上下文。
- isolate 必须创建新的层叠上下文。

```css
/* 关键字值 */
isolation: auto;
isolation: isolate;
```

## mask

允许使用者通过遮罩或者裁切特定区域的图片的方式，来隐藏一个元素的部分或者全部可见区域。

```css
/* Keyword values */
mask: none;

/* Image values */
mask: url(mask.png); /* 使用位图来做遮罩 */
mask: url(masks.svg#star); /* 使用 SVG 图形中的形状来做遮罩 */

/* Combined values */
/* svg元素作为亮度遮罩 */
mask: url(masks.svg#star) luminance;
/* 使用 SVG 图形中的形状来做遮罩并设定它的位置：离上边缘 40px，离左边缘 20px */
mask: url(masks.svg#star) 40px 20px;
/* 使用 SVG 图形中的形状来做遮罩并设定它的位置和大小：长宽都是 50px */
mask: url(masks.svg#star) 0 0/50px 50px;
/**水平方向重复平铺 */
mask: url(masks.svg#star) repeat-x;
/**position扩展到stroke-box */
mask: url(masks.svg#star) stroke-box;
/**使用不重叠的部分于背景相结合 */
mask: url(masks.svg#star) exclude;
```

简写对应的每个属性：

- mask-image
- mask-mode 指示由 mask-image 指向的遮罩被视为亮度或阿尔法遮罩。
  - alpha 使用 mask 图像的透明度作为遮罩。
  - luminance 亮度值用作遮罩。
  - match-source 匹配 mask-image 的资源类型
    - `<mask-source>`类型 ：亮度值会被作为遮罩
    - `<image>`类型 ：alpha 值作为遮罩。
- mask-repeat 定义了遮罩图片是否重复显示多个副本，以及如何重复。
  - repeat-x
  - repeat-y
  - repeat
  - space
  - round
  - no-repeat
- mask-position 遮罩的偏移位置
- mask-clip 遮罩的覆盖区域，像 border-box content-box 等
- mask-origin 遮罩的位置原点
- mask-size 遮罩的大小
- mask-composite

## mask-border

创建一个紧贴元素边框边缘的 mask。

简写属性有：

- mask-border-source 该属性为源图像
- mask-border-slice 将源图像切割后的区域的尺寸，最多可指定四个值
- mask-border-width 边框 mask 的宽度。最多可指定四个值
- mask-border-outset 边框 mask 距离元素外边界的距离。最多可指定四个值。
- mask-border-repeat 定义如何调整源图像的边缘区域以适应边框 mask 的尺寸。
  - stretch 拉伸源图像的边缘区域以填充每个边界之间的间隙。
  - repeat 源图像的边缘区域被平铺（重复）以填充每个边界之间的间隙，可以裁剪平铺图形以达到合适的贴合效果。
  - round 源图像的边缘区域被平铺（重复）以填充每个边界之间的间隙，可以拉伸平铺图形以实现适当的贴合。
  - space 源图像的边缘区域被平铺（重复）以填充每个边框之间的间隙。平铺图形之间将分配额外的空间，以实现适当的贴合。
- mask-border-mode 定义是否将源图片设置为明亮度 mask，或者透明度 mask.

```css
image-orientation =
  from-image           |
  none                 |
  [ <angle> || flip ]

```

## outline

CSS 的 outline 属性是设置轮廓属性的简写属性 ，例如:

- outline-width
- outline-style
- outline-color

border 和 outline 很类似，但有如下区别：

- outline 不占据空间，绘制于元素内容周围。
- 根据规范，outline 通常是矩形，但也可以是非矩形的。

> outline-offset CSS 属性设置轮廓与元素边缘或边框之间的间距。

```css
/* 样式 */
outline: solid;

/* 样式 | 颜色 */
outline: dashed #f66;

/* 宽度 | 样式 */
outline: thick inset;

/* 宽度 | 样式 | 颜色 */
outline: 3px solid green;

/* <length> 值 */
outline-offset: 3px;
outline-offset: 0.2em;
```

## scroll-behavior

当用户手动导航或者 CSSOM scrolling API 触发滚动操作时，指定滚动行为，其他任何的滚动，例如那些由于用户行为而产生的滚动，不受这个属性的影响。在根元素中指定这个属性时，它反而适用于视窗。

- auto 滚动框立即滚动。
- smooth 滚动框通过一个用户代理预定义的时长、使用预定义的时间函数，来实现平稳的滚动，用户代理应遵循其平台的约定，如果有的话。

```css
scroll-behavior =
  auto    |
  smooth

```

## overscroll-behavior

overscroll-behavior CSS 属性是 overscroll-behavior-x 和 overscroll-behavior-y 属性的合并写法，让你可以控制浏览器过度滚动时的表现——也就是滚动到边界。

默认情况下，当触及页面顶部或者底部时（或者是其他可滚动区域），移动端浏览器倾向于提供一种“触底”效果，甚至进行页面刷新。使用 overscroll-behavior 来去除不需要的滚动链，以及类似 QQ 一类的应用下拉刷新效果。

- auto 默认效果
- contain 滚动边界行为不变（“触底”效果或者刷新），但是临近的滚动区域不会被滚动链影响，比如对话框后方的页面不会滚动。
- none 临近滚动区域不受到滚动链影响，而且默认的滚动到边界的表现也被阻止。

```css
overscroll-behavior =
  [ contain | none | auto ]{1,2}

```

## quotes

quotes CSS 属性用于设置引号的样式。

- none 不展示引号。
- `<[<string> <string>]+>` 一组或者多组 `<string>` 的值对应 open-quote and close-quote. 第一对表示引号的外层，第二对表示第一个嵌套层，下一对表示第三层，依此类推。
- auto 用适当的引号，基于在所选元素上设置的任何语言值（例如，通过 lang 属性）。

```css

quotes =
  auto                    |
  none                    |
  match-parent            |
  [ <string> <string> ]+

/* Keyword value */
quotes: none;

/* <string> values */
quotes: "«" "»"; /* Set open-quote and close-quote to the French quotation marks */
quotes: "«" "»" "‹" "›"; /* Set two levels of quotation marks */

q {
  quotes: '"' '"' "'" "'";
}
q::before {
  content: open-quote;
}
q:after {
  content: close-quote;
}

```

## rotate & scale & thanslate

单独设置 transform 的属性。

```css
rotate =
  none                                    |
  <angle>                                 |
  [ x | y | z | <number>{3} ] && <angle>
/* Keyword values */
scale: none;
/* 三个值 */
scale: 2 0.5 2;
/* 三个值 */
translate: 50% 105px 5rem;
/* Angle value */
rotate: 90deg;
rotate: 0.25turn;
rotate: 1.57rad;

/* x, y, or z axis name plus angle */
rotate: x 90deg;
rotate: y 0.25turn;
rotate: z 1.57rad;

/* Vector plus angle value */
rotate: 1 1 1 90deg;

```

## tab-size

tab-size CSS 属性用于自定义制表符（U+0009）的宽度。

```css
/* <integer> 值 */
tab-size: 4;
tab-size: 0;

/* <length> 值 */
tab-size: 10px;
tab-size: 2em;
```

## text-align-last

CSS 属性 text-align-last 指定一行或者块中的最后一行在被强制换行之前的对齐规则。

```css
/* 关键字值 */
text-align-last: auto;
text-align-last: start;
text-align-last: end;
text-align-last: left;
text-align-last: right;
text-align-last: center;
text-align-last: justify;
```

## text-emphasis

CSS 属性 text-emphasis 将强调标记应用到除去空格和控制字符的文本。这个值是 text-emphasis-style 和 text-emphasis-color 的简写属性。

- text-emphasis-style
  - none 没有强调标记。
  - filled 形状填充为纯色。如果 filled 和 open 都未被设置，这是默认设置
  - open 形状为空心。和 filled 一样，可以组合其他选项使用
  - dot 显示小圆点作为标记。填充圆点是 '•'（U+2022），空心圆点是 '◦'（U+25E6）。
  - circle 显示大圆圈作为标记。填充圆圈是 '●'（U+25CF），空心圆圈是 '○'（U+25CB）。在水平书写模式下，如果没有指定其他形状，则默认为此形状。
  - double-circle 显示双重圆圈作为标记。填充双重圆圈是 '◉'（U+25C9），空心双重圆圈是 '◎'（U+25CE）。
  - triangle 显示三角形作为标记。填充三角形是 '▲'（U+25B2），空心三角形是 '△'（U+25B3）。
  - sesame 显示芝麻点形状作为标记。填充芝麻点是 '﹅'（U+FE45），空心芝麻点是 '﹆'（U+FE46）。在垂直书写模式下，如果没有指定其他形状，则默认为此形状。
  - `<string>` 将指定的字符串作为标记显示。不应指定多于一个字符的 `<string>`。用户代理（UA）可能会截断或忽略超过一个字素簇的字符串。
  - `<color>` 指定用作强调色的颜色。如果未定义，该值默认为 currentcolor。

```css
/* 初始值 */
text-emphasis: none; /* 没有强调标记 */

/* <string> 值 */
text-emphasis: "x";
text-emphasis: "点";
text-emphasis: "\25B2";
text-emphasis: "*" #555;
text-emphasis: "foo"; /* 不应使用。它可能被计算或渲染为仅“f” */

/* 关键字值 */
text-emphasis: filled;
text-emphasis: open;
text-emphasis: filled sesame;
text-emphasis: open sesame;

/* 关键字值与色彩值结合 */
text-emphasis: filled sesame #555;
```

## text-emphasis-position

设置强调标记的位置。强调标记（如注音字符）在没有足够空间时，会自动增加行高。

- over 在水平书写模式下，在文本上方绘制标记。
- under 在水平书写模式下，在文本下方绘制标记。
- right 在垂直书写模式下，在文本右侧绘制标记。
- left 在垂直书写模式下，在文本左侧绘制标记。

```css
text-emphasis-position =
  [ over | under ]   &&
  [ right | left ]?

/* 初始值 */
text-emphasis-position: over right;

/* 关键字值 */
text-emphasis-position: over left;
text-emphasis-position: under right;
text-emphasis-position: under left;

text-emphasis-position: left over;
text-emphasis-position: right under;
text-emphasis-position: left under;

/* 全局值 */
text-emphasis-position: inherit;
text-emphasis-position: initial;
text-emphasis-position: revert;
text-emphasis-position: revert-layer;
text-emphasis-position: unset;

```

## text-justify

CSS 属性 text-justify 定义的是当文本的 text-align 属性被设置为 :justify 时的齐行方法。

- none 表示关闭掉齐行的设置。表现的效果和没有设置 text-align 一样，当你因为某种原因需要在已经设置了 text-align 的元素上禁用齐行效果的时候，这个属性值很有用。
- auto 默认值，浏览器根据显示的效果和质量来确定符合当前状态的最佳对齐方式，当然这种对齐方式将是最适合某种语言文字的排版（例如：英语，中文，日语，韩语等）。如果没有对 text-justify 进行设置的话，则是默认使用这样子的对齐规则。
- inter-word 通过在文本中的单词之间添加空间来实现行对齐（这将会改变 word-spacing 的值），比如英语或韩语就是最适合使用这个属性来用空格分隔单词的语言。
- inter-character 通过在文本中的字符之间添加空间来实现行对齐（这将会改变 letter-spacing 的值），比如日语就是最适合使用这个属性的语言。

## text-underline-offset

设置文本装饰下划线（使用 text-decoration 应用）与其原始位置的偏移距离。

```css
/* 单个关键字 */
text-underline-offset: auto;

/* length */
text-underline-offset: 0.1em;
text-underline-offset: 3px;

/* percentage */
text-underline-offset: 20%;
```

## touch-action

设置触摸屏用户如何操纵元素的区域 (例如，浏览器内置的缩放功能)。

- auto 由浏览器来决定进行哪些操作，比如对 viewport 进行平滑、缩放等。
- none 不进行任何操作。
- pan-x 启用单指水平平移手势。可以与 pan-y、pan-up、pan-down 和／或 pinch-zoom 组合使用。
- pan-y 启用单指垂直平移手势。可以与 pan-x 、pan-left、pan-right 和／或 pinch-zoom 组合使用。
- manipulation 浏览器只允许进行滚动和持续缩放操作。
- pinch-zoom 启用多手指平移和缩放页面。这可以与任何平移值组合。
- pan-left,pan-right,pan-up,pan-down 启用以指定方向滚动开始的单指手势。一旦滚动开始，方向可能仍然相反。请注意，滚动“向上”（pan-up）意味着用户正在将其手指向下拖动到屏幕表面上，同样 pan-left 表示用户将其手指向右拖动。多个方向可以组合，除非有更简单的表示（例如，“pan-left pan-right”无效，因为“pan-x”更简单，而“pan-left pan-down”有效）。

```css
touch-action =
  auto                                                |
  none                                                |
  [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ]  |
  manipulation
touch-action: pan-y pinch-zoom;
```

## unicode-bidi

和 direction 属性一起，决定如何处理文档中的双书写方向文本（bidirectional text）。比如，如果一块内容同时包含有从左到右书写和从右到左书写的文本，那么用户代理（the user-agent）会使用复杂的 Unicode 算法来决定如何显示文本。unicode-bidi 属性会覆盖此算法，允许开发人员控制文本嵌入（text embedding）。

> unicode-bidi 与 direction 是仅有的两个不受 all 简写影响的属性。

> 此属性是文档类型定义（Document Type Definition, DTD）的设计者专用的。Web 设计者与其他类似的人员不应覆盖此属性。

- normal 对双向算法，此元素不提供额外的嵌入级别。对于内联元素，隐式的重新排序在元素的边界上起作用。
- embed 对于内联元素，该值会为双向算法打开一个额外的嵌入级别。嵌入级别的方向是由 direction 属性给出的。
- bidi-override 对于内联元素，该值会创建一个覆盖；对于块容器元素，该值将为不在另一个块容器元素内的内联级别的后代创建一个覆盖。这意味着在元素内部，根据 direction 属性，重新排序是严格按照顺序排列的；双向算法的隐式部分被忽略。
- isolate 这个关键字表示计算元素容器的方向时，不考虑这个元素的内容。因此，这个元素就从它的兄弟姐妹中分离出来了。当应用它的双向分辨算法的时候，它的容器元素将其视为一个或多个 U+FFFC Object Replacement Character，即像 image 一样。
- isolate-override 这个关键字将 isolate 关键字的隔离行为应用于周围的内容，并将 bidi-override 关键字的覆盖行为应用于内部内容。
- plaintext 这个关键字在计算元素方向的时候，不考虑父元素的双向状态，也不考虑 direction 属性的值。它是使用 Unicode 双向算法的 P2 和 P3 规则计算的。 这个值允许按照 Unicode 双向算法显示已经格式化的数据。

```css
unicode-bidi = isolate-override|plaintext .bible-quote {
  direction: rtl;
  unicode-bidi: embed;
}
```

## user-select

控制用户是否可以选择文本。

- none 元素及其子元素的文本不可选中。请注意，Selection 对象可以包含这些元素。
- text 用户可以选择文本。
- all 当双击子元素或者上下文时，包含该子元素的最顶层元素也会被选中。
- contain 允许在元素内选择；但是，选区将被限制在该元素的边界之内。
- auto 取值具体如下：
  - 在 ::before 和 ::after 伪元素上，采用的属性值是 none
  - 如果元素是可编辑元素，则采用的属性值是 contain
  - 此元素的父元素的 user-select 采用的属性值为 all|none，则该元素采用的属性值也为 all|none
  - 否则，采用的属性值为 text

```css
user-select =
  auto     |
  text     |
  none     |
  contain  |
  all
```

## will-change

告知浏览器该元素会有哪些变化，这样浏览器可以在元素属性真正发生变化之前，做好对应的优化准备工作。

> will-change 应该被视为最后的应对手段，用于解决现有的性能问题。不应该被用来预测性能问题。

- auto 没有指定哪些属性会变化
- scroll-position 将改变滚动条的位置或者使之产生动画。
- contents 将改变元素内容，或者使它们产生动画
- 其他属性。 将对特定属性进行动画或更改。如果给定的属性是一个缩写，它表示对缩写展开的所有属性的期望。

```css
.sidebar {
  /* 关键字值 */
  will-change: auto;
  will-change: scroll-position;
  will-change: contents;
  will-change: transform;
  will-change: opacity;
  /**可以同时指定多个将要变化的属性 */
  will-change: left, top;
}
```

## zoom

控制元素的缩放倍率。可以用 transform：scale()代替。

- normal 正常模式渲染。
- number 值 缩放倍数
- percentage 缩放百分比
- reset 不缩放。不要用这个值，用 unset 代替。

```css
/* Keyword values */
zoom: normal;
zoom: reset;

/* <percentage> values */
zoom: 50%;
zoom: 200%;

/* <number> values */
zoom: 1.1;
zoom: 0.7;
```

## content-visibility

控制元素是否渲染其内容，以及施加一组强局限，使浏览器在不需要时，可以省略布局和渲染工作。

> 对于设置了 content-visibility: auto 的任意元素，在其渲染工作开始或不再被跳过时将触发 contentvisibilityautostatechange 事件。此事件为应用代码在不需要时开始或停止渲染过程（如在 `<canvas>` 上绘画）提供了便利。属性值：

- visible 默认值。元素内容照常布局和渲染。
- hidden 元素跳过布局和渲染。
- auto 元素启用布局局限、样式局限和绘制局限。与 hidden 不同的是，被跳过的内容必须仍可照常被例如页内查找和 tab 键顺序导航等用户代理特性访问，且必须照常可获得焦点或被选中。

```css
section {
  /**控制元素绘制内容，可见时渲染 */
  content-visibility: auto;
  /** 高度和宽度添加了 500px 的默认尺寸*/
  contain-intrinsic-size: auto 500px;
}
```
