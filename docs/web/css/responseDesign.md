# 响应式设计

## 概念
响应式网页设计的概念（responsive web design，RWD），RWD 指的是允许 Web 页面适应不同屏幕宽度因素等，进行布局和外观的调整的一系列实践。弹性盒、网格和多栏布局都可以建立可伸缩的响应式组件，使用更方便。

## 媒体查询

媒体查询（Media queries）非常实用，尤其是当你想要根据设备的大致类型（如打印设备与带屏幕的设备）或者特定的特征和设备参数（例如屏幕分辨率和浏览器视窗宽度）来修改网站或应用程序时。

媒体查询，以及样式改变时的点，被叫做断点（breakpoints）

***移动优先设计***：使用媒体查询时的一种通用方式是，为窄屏设备（例如移动设备）创建一个简单的单栏布局，然后检查是否是大些的屏幕，在有足够容纳的屏幕宽度的时候，开始采用一种多栏的布局。

```css
/**@media也可以判断屏幕分辨率等其他条件 */
/**在屏幕尺寸大于800px时，应用此样式。800px称为为断点 */
@media screen and (min-width: 800px) {
  .container {
    margin: 1em 2em;
  }
}
```

## 灵活网格

1. 早年间：使用float + 百分比数字实现
2. 现代布局技术
   1. multicol多列布局
   ```css
   /**三列布局，占满整个屏幕 */
   column-count:3;
   /**列宽最小10em，尽可能占用更多的列，不足一列的，平均分配剩余空间 */
   column-width:10em;
   ```
   2. flex弹性盒布局
      1. 初始的行为是，弹性的物件将参照容器里面的空间的大小，缩小和分布物件之间的空间
      2. 通过flex-grow、flex-shrink指定如何分配剩余空间。
   3. grid网格布局
      1. 在 CSS 网格布局中，fr单位许可了跨网格轨道可用空间的分布
      ```css
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
      ```
## 响应式图像

>为什么我们不用 CSS 或 JavaScript 来实现？

当浏览器开始加载页面时，它会在主解析器开始加载和解释页面的 CSS 和 JavaScript 之前，预先下载（预加载）所有图像。这种机制通常有助于减少页面加载时间，但对于响应式图像并不有用，因此需要实现类似 srcset 的解决方案。例如，你不能加载 `<img>` 元素，然后使用 JavaScript 检测视口宽度，再然后根据需要动态更改源图像为较小的图像。这时，原始图像已经被加载，如果仍加载小图像，则在响应式图像方面甚至更糟糕。

实现方式：

1. 配置图像的max-width属性

```css
img{
  /**设置宽度最大为100%，不会超过父容器的大小 */
  max-width:100%;
}
```
手机和桌面屏幕大小不同，应用同样的图片，对移动端来说浪费带宽，尺寸也不匹配。

2. 使用了`<picture>`元素和`<img>` srcset和sizes特性

```html
<img
  srcset="elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
  sizes="(max-width: 600px) 480px,800px"
  src="elva-fairy-800w.jpg"
  alt="Elva dressed as a fairy" />
```
- ***srcset***: 定义了浏览器可选择的图片集合以及每个图片的大小，每张图片信息的设置和前一个用逗号隔开，每个设置要写：
  - 文件url
  - 一个空格
  - 图片的固有宽度。这里以 w 为单位，而非 px。图片的固有尺寸是它的真实大小
- ***sizes***： sizes 定义了一组媒体条件（例如屏幕宽度）并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择
  - 一个媒体条件，例如：(max-width: 600px)
  - 一个空格
  - 当媒体条件为真时，图像将填充的插槽的宽度（480px）


有了这些属性后，浏览器就会：
1. 查看屏幕尺寸、像素密度、缩放级别、屏幕方向和网络速度。
2. 找出sizes列表中第一个为真的媒体条件。
3. 查看该媒体条件对一个的插槽大小。
4. 加载srcset列表中与插槽大小相同的图片，如果没有，则加载第一个大于所选插槽大小的图片。

这样就实现了，不同尺寸的屏幕，应用不同的图片

3. picture元素

>就像 `<video>` 和 `<audio>` 一样，`<picture>` 元素是包含多个 `<source>` 元素的容器，它提供了多个不同的资源供浏览器选择，然后还有至关重要的 `<img>` 元素。

```html

<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg" />
  <source media="(min-width: 800px)" srcset="elva-800w.jpg" />
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva" />
</picture>
```

在任何情况下，你都必须紧贴着 `</picture>` 前面提供一个`<img>` 元素以及它的 src 和 alt 属性，否则不会有图片显示。当媒体条件都不为真的时候它会显示默认图片；如果浏览器不支持` <picture>` 元素，它可以作为后备方案.借助这样的代码我们能够在宽屏和窄屏上都能显示合适的图片
## 图片适配分辨率

>使用 srcset 结合 x 描述符（一种更简单的语法），而不用 sizes，来让浏览器选择合适分辨率的图片。
```html
<img
  srcset="elva-fairy-320w.jpg, elva-fairy-480w.jpg 1.5x, elva-fairy-640w.jpg 2x"
  src="elva-fairy-640w.jpg"
  alt="Elva dressed as a fairy" />

<picture>
  <source srcset="elva-fairy-320w.jpg, elva-fairy-480w.jpg 1.5x, elva-fairy-640w.jpg 2x" />
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva" />
</picture>
```
## 响应式排版

>只用 viewport (vw)单位设定文本,文本总是随着视口的大小改变大小，用户失去了放缩任何使用vw单位的文本的能力。

解决方法:使用了calc()，将vw单位加到了使用固定大小（例如em或者rem）的值组，那么文本仍然是可放缩的。基本来说，是vw加在了放缩后的值上。

```css
h1 {
  font-size: calc(1.5rem + 3vw);
}
```

## 视口元标签

```html
<meta name="viewport" content="width=device-width,initial-scale=1" />
```
和视口元标签一起，可以使用的属性
1. width  设定视口的宽度，也可以设置为特殊值device-width，即 100vw
2. height 设定视口的高度，也可以设置为特殊值 device-height，即 100vh，
3. initial-scale：页面的初始缩放倍数。
4. minimum-scale：最小缩放级别
5. maximum-scale：最大缩放级别
6. user-scalable：是否可缩放。有效值为 0、1、yes 或 no。设置为0，将阻止缩放
7. interactive-widget 指定交互式 UI 组件（如虚拟键盘）对页面视口的影响。
   1. resizes-visual 可视视口会被交互式组件调整大小。默认值
   2. resizes-content 视口会被交互式组件调整大小。
   3. overlays-content 视口和可视视口都不会被交互式组件调整大小。

应该避免使用minimum-scale、maximum-scale，尤其是将user-scalable设为no。用户应该有权力尽可能大或小地进行缩放，阻止这种做法会引起访问性问题。