# AntV

蚂蚁企业级数据可视化解决方案，让人们在数据世界里获得视觉化思考能力

官网：https://antv.antgroup.com/

AntV 旗下产品有：

- `G2`：统计图表
- `S2`：多维表格
- `G6`：关系图
- `X6`：流程图
- `L7`：地图

移动端：

- `F2`：移动统计图
- `F6`：移动关系图
- `F7`：移动地图

## G2

G2 是一个简洁的渐进式语法，主要用于制作基于网页的可视化。它提供了一套函数风格式、声明形式的 API 和组件化的编程范式，希望能帮助用户能快速完成报表搭建、数据探索、可视化叙事等多样化的需求。

介绍一下 G2 的核心概念：

- 标记（Mark）：绘制数据驱动的图形
- 转换（Transform）：派生数据
- 比例尺（Scale）：将抽象的数据映射为视觉数据
- 坐标系（Coordinate）：对空间通道应用点变换
- 视图复合（Composition）：管理和增强视图
- 动画（Animation）：数据驱动的动画和连续的形变动画
- 交互（Interaction）： 操作视图并且展现详细信息

```js
<div id="chart"></div>

(() => {
  /**实例化图表
   * @getContainer() 获取Chart容器
   * @render() 渲染图表
   * @clear() 清空图表
   * @destroy() 销毁图表
   */
  const chart = new G2.Chart(
    {
      // 挂在容器
    container: 'chartId'||document.createElementById('chart'),
      height: 360,
      width:800,
    paddingLeft: 50,
  }
  );

// 生命可视化
  let facet = chart
    .point() // 点阵图
    .data({  // 获取数据
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json",
    })
    // 标记是 G2 中最小的视觉单元，G2 中的所有图表都是由不同标记构成的。
    .encode("x", "weight");
  .encode('y', 'height')

  // 视图复合用于制作多视图图表。
  facet
    .rect() //柱形图
    // 增加颜色编码
    .encode("color", "gender")
    //转换会改变数据和标记的展现形式，多用于数据分析
    .transform({ type: "binX", y: "count" })
    .transform({ type: "stackY" })
    //比例尺用于控制标记的视觉样式。
    .scale("color", { range: ["steelblue", "orange"] })
    .scale("y", { nice: true })
    //坐标系会改变图表的展示形式。
    .coordinate({ type: "polar" })
    .axis("y", { title: false })
    .style("insetLeft", 1)
    //交互可以按需探索数据。
    .interaction("brushXHighlight", true);

  // 动画支持分组动画和关键帧动画。

  const keyframe = chart
    .timingKeyframe()
    .attr("direction", "alternate")
    .attr("iterationCount", 4);

  keyframe
    .interval()
    .attr("padding", "auto")
    .data(data)
    .encode("x", "gender")
    .encode("color", "gender")
    .encode("key", "gender")
    .transform({ type: "groupX", y: "count" });
    // 渲染可视化
  chart.render();

  // 挂载图表的容器
  return chart.getContainer();
})();
```
参考选项：https://g2.antv.antgroup.com/spec/overview
## 标记 mark

在 G2 中没有图表的概念，而是把标记（Mark）作为基本的视觉组成单元，任何一个图表都是多个标记组合而成的。和传统的绘制系统不同，标记提供了绘制抽象数据的能力。标记是一个模版，会生成一系列数据驱动的图形，其中每个图形对应一个或者多个数据项（Data Item）。

标记是视图树中叶子节点，也是 G2 中的“一等公民”：G2 中最重要的概念，一个标记由如下核心概念构成：

```js
({
  type: "mark",
  data: [],
  encode: {},
  scale: {},
  transform: [],
  layout: {},
  coordinate: {},
  style: {},
  viewStyle: {},
  animate: {},
  state: {},
  label: {},
  title: {},
  axis: {},
  legend: {},
  tooltip: {},
  scrollbar: {},
  slider: {},
  interaction: {},
  theme: {},
});
```
绘制数据驱动的图形。

- interval - 通常用来绘制柱、条形图，饼图等相关图表。
- point - 主要用于绘制散点图，利用点的粒度来分析数据的分布情况。
- line - 根据一系列的点，绘制折线，通常用来绘制折线图。
- area - 通常用来绘制我们常见的面积图，通过填充，可以更好突出趋势堆积信息。
- cell - 根据 x, y 将空间划分成一个子空间，然后进行可视化绘制，常见于一些方块图，如日历图、聚合热力图等。
- rect - 使用两组 x，两组 y 来定位一个矩形区域，常用于直方图、矩阵树图等。
- link - 标记使用两个用 (x, y) 定位的点，绘制一条带方向的直线。通过指定 x，y 通道为长度为 2 的字段数组即可。
- vector - 用 start，end 两个点来表示一个向量，通常用于绘制具备向量含义的数据，比如风向量场等。
- box - 用来绘制箱线图，通常用来展示一组数据分布情况的统计图。
- boxplot - 用来绘制箱线图，并且内置数据的聚合操作。
- text - 通过指定文本的样式通道，可以在画布上绘制和数据绑定的文本字符。
- image - 利用 src 通道在画布上绘制图片。
- shape - 使用自定义函数灵活绘制自定义图形。
- lineX - 指定 x 通道来绘制垂直于 x 轴的辅助线，常用于绘制平均值或其他聚合数据辅助线。
- lineY - 指定 y 通道来绘制垂直于 y 轴的辅助线，常用于绘制平均值或其他聚合数据辅助线。
- range - 使用一组 x(x1, x2) 和一组 y(y1, y2) 来定位一个矩形区域，常用于绘制高亮指定区域的辅助区域。
- rangeX - 使用一组 x(x1, x2) 来定位一个垂直于 x 轴的矩形区域，常用于绘制高亮指定区域的辅助区域。
- rangeY - 使用一组 y(y1, y2) 来定位一个垂直于 y 轴的矩形区域，常用于绘制高亮指定区域的辅助区域。
- polygon - 利用多组 (x, y) 数据点，在画布中绘制闭合的多边形，通常结合一些社区布局算法使用。
- wordCloud - 绘制词云图。
- density - 渲染核密度数据，多用于小提琴图。
- heatmap - 接受热力数据，多用于绘制热力图。
## mark组成部分
- data - 可视化的数据
- encode - 编码信息，用于指定视觉元素属性和数据之间的关系

不同的标记有不同的通道，但是也有一些通用的通道，一些常见的和绘制相关的通用通道如下：

```js
x - x 位置
y - y 位置
z - z 位置
color - 颜色，填充色或者边框色，由形状决定
opacity - 透明度，填充透明度或者边框透明度，由样式决定
shape - 形状
size - 大小，不同的标记有不同的函数
series - 系列，用于分成系列
key - 唯一标记，用于数据更新

// API
// 第一种
chart.interval().encode('x', 'name').encode('y', 'value');

// 第二种
chart.interval().encode({ x: 'name', y: 'value' });
```

- scale - 映射规则:将抽象数据映射为视觉数据，它是抽象数据和视觉数据的桥梁。如果说编码决定了标记的哪些通道需要被可视化，那么比例尺决定了这些通道该如何被可视化。

```js
// API 形式
// 第一种方式
chart.scale("x", { padding: 0.5 }).scale("y", {
  type: "log", // 指定类型
  domain: [10, 100], // 指定定义域
  range: [0, 1], // 指定值域
});

// 第二种方式
chart.scale({
  x: { padding: 0.5 },
  y: {
    type: "log", // 指定类型
    domain: [10, 100], // 指定定义域
    range: [0, 1], // 指定值域
  },
});
```

- transform - 转化通道值:去转换数据和标记的选项，主要用于分析数据。标记转换的本质是一个函数，这个函数会筛选 、修改 、聚合和产生新的通道值。

```js
// API
// 第一种方式  StackY 转换堆叠了条形图 y 和 y1 通道绑定的列数据
chart.interval().transform({ type: "stackY" }).transform({ type: "sortX" });

// 第二种方式
chart.interval().transform([{ type: "stackY" }, { type: "sortX" }]);
```

- layout - 布局算法配置:用于指定一些有特定布局函数标记的布局方法的参数，比如 Snakey, WordCloud, ForceGraph 等。

```js
({
  type: "sankey",
  layout: {
    nodeAlign: "center",
    nodePadding: 0.03,
  },
});
// API
chart.sankey().layout({ nodeAlign: "center", nodePadding: 0.03 });
```

- coordinate - 坐标系变换:标记的位置通道 x 和 y 会经过比例尺的映射到 [0, 1] 的范围，这之后会使用坐标系将点转换为画布坐标，从而改变标记的空间展示形式。

```js
({
  type: 'interval',
  coordinate: { type: 'polar' },
});
// API
chart.interval().coordinate({ type: 'polar' });

//每一个视图只能拥有一个坐标系。坐标系除了本身的属性之外，还包含一系列坐标系变换（Coordinate Transform）
({
  type: 'polar', // 类型
  innerRadius: 0.6, // 本身的属性
  outerRadius: 0.8,
  transform: [{ type: 'transpose' }], // 坐标系变换
});

chart.line().coordinate({ type: 'polar' });
chart.area().coordinate({ type: 'radial' });
// 和下面的情况等价：
chart.line();
chart.area():
```

- style - 视觉样式:用来控制标记和视图的视觉样式
- view${Style} - 设置视图区域的样式
- plot${Style} - 设置绘制区域的样式
- main${Style} - 设置主区域的样式
- content${Style} - 设置内容区域的样式

```js

style: {
  // 设置视图样式
  viewFill: '#4e79a7',
  plotFill: '#f28e2c',
  mainFill: '#e15759',
  contentFill: '#76b7b2',
},
// 设置mark样式
style: { shape: 'point', fill: '#59a14f' },
// API
// 第一种方式
chart
  .interval()
  .style('stroke', 'black')
  .style('strokeWidth', 2)
  .viewStyle('viewFill', 'red')
  .viewStyle('contentFill', 'yellow');

// 第二种方式
chart
  .interval()
  .style({
    stroke: 'black',
    strokeWidth: 2,
  })
  .viewStyle({
    viewFill: 'red',
    contentFill: 'yellow',
  });
```

- viewStyle - 视图的视觉样式
- animate - 动画属性

标记是通过 mark.animate 指定动画属性的，一共有三个部分的动画可以指定：

enter - 新增的图形
update - 更新的图形
exit - 删除的图形
而每部分的动画有以下的属性：

type - 种类
duration - 持续时间
delay - 延迟时间
easing - 缓动函数

```js
// API
// 第一种方式
chart
  .interval()
  .animate('enter', { type: 'scaleInX', duration: 100, delay: 10 })
  .animate('update', { type: 'morphing' });

// 第二种方式
chart.interval().animate({
  enter: {
    type: 'scaleInX',
    duration: 100,
    delay: 10,
  },
  update: {
    type: 'morphing',
  },
});

    .animate('enter', {
      type: 'scaleInY', // 指定入场动画的类型
      duration: 1000, // 指定入场动画的执行时间
    });

//动画属性可以作为一种通道，也可以编码数据
     .encode('enterDuration', (d) => d.endTime - d.startTime) // 计算持续时间，并且编码
    .encode('enterDelay', 'startTime'); // 指定出现的时间，并且编码

    /**
     * 上面的动画都是过渡动画，不涉及到数据的更新，G2 也提供了制作关键帧动画的能力。
     * 使用 chart.timingKeyframe 创建一个时间容器，用于放置一系列视图，它会对这些视图中
     * 有关系的图形元素应用平滑的过渡效果。而对应关系通过 key 和 groupKey 两个通道指定。
     */


  // 参考 css animation 的描述
  const keyframe = chart
    .timingKeyframe() // 创建容器
    .attr('iterationCount', 2) // 迭代次数
    .attr('direction', 'alternate') // 方向
    .attr('duration', 1000); // 持续时间

  keyframe
    .interval()
    .transform({ type: 'groupX', y: 'mean' })
    .data(data)
    .encode('x', 'gender')
    .encode('y', 'weight')
    .encode('color', 'gender')
    .encode('key', 'gender'); // 指定 key

  keyframe
    .point()
    .data(data)
    .encode('x', 'height')
    .encode('y', 'weight')
    .encode('color', 'gender')
    .encode('shape', 'point')
    .encode('groupKey', 'gender'); // 指定 groupKey
```

- state - 状态样式:用来控制标记的状态样式。

目前一共有 4 个内置状态：

- active - 高亮时候的样式
- inactive - 没有高亮时候的样式
- selected - 选择时候的样式
- unselected - 没有选择时候的样式

```js
// API
// 第一种方式
chart
  .interval()
  .state("active", { fill: "red", stroke: "blue", strokeWidth: 2 })
  .state("inactive", { fill: "#aaa" })
  .state("selected", { fill: "red", stroke: "blue", strokeWidth: 2 })
  .state("unselected", { fill: "#aaa" })
  .interaction("elementSelect"); // 设置选择交互

// 第二种方式
chart.interval().state({
  active: { fill: "red", stroke: "blue", strokeWidth: 2 },
  inactive: { fill: "#aaa" },
});
```

- label - 数据标签:是给图表添加标注的手段之一。可以给标记添加多个标签：

```js
// 第一种方式
chart
  .interval()
  .label({
    text: 'genre', // 指定绑定的字段
    dy: -15, // 指定样式
  })
  .label({
    text: 'sold', // 指定绑定的字段
    fill: '#fff', // 指定样式
    dy: 5,
  });

// 第二种方式
chart.interval().label([
  {
    text: 'genre', // 指定绑定的字段
    dy: -15, // 指定样式
  },
  {
    text: 'sold', // 指定绑定的字段
    fill: '#fff', // 指定样式
    dy: 5,
  },
]);

// 在 View 层级可以通过 labelTransform 声明标签转化：
// 第一种方式
chart
  .labelTransform({ type: 'overlapHide' })
  .labelTransform({ type: 'contrastReverse' });

// 第二种方式
chart.labelTransform([{ type: 'overlapHide' }, { type: 'contrastReverse' }]);

({
  type: 'interval',
  labels: [
    {
      text: 'name', // 绑定的字段或者一个常量字符串
      dy: -2, // @antv/g 支持的样式
      fill: 'red', // @antv/g 支持的样式
      selector: 'last', // 选择器
      transform: [], // 标签转换
    },
  ],
});

   // 声明第一个 label
    .label({
      text: 'genre', // 指定绑定的字段
      style: {
        dy: -15, // 指定样式
      },
    })
    // 声明第二个 label
    .label({
      text: 'sold', // 指定绑定的字段
      style: {
        fill: '#fff', // 指定样式
        dy: 5,
      },
    });
```

- title - 图表标题

```js
({
  type: "interval",
  title: {
    title: "hello",
    subtitle: "world",
  },
});
// API
chart.interval().title({
  title: "hello",
  subtitle: "world",
});
```

- axis - 坐标轴:可以理解为是空间通道（x，y 和 position）对应比例尺的可视化。

```js
// 第一种方式
chart
  .interval()
  .axis("x", { labelFormatter: "%0" })
  .axis("y", { tickCount: 5 });

// 第二种方式
chart.interval().axis({
  x: { labelFormatter: "%0" },
  y: { tickCount: 5 },
});

({
  type: "interval",
  axis: { y: false }, // 隐藏 y 方向坐标轴
});
```

- legend - 图例:可以理解为是非空间通道（color，opacity，size，shape）对应比例尺的可视化。

```js
// 第一种方式
chart.interval().legend("color", {}).legend("size", {});

// 第二种方式
chart.interval().legend({
  color: {},
  size: {},
});

({
  type: "interval",
  legend: { color: false }, // 隐藏 color 通道的图例
});
```

- tooltip - 提示信息:可以提供关于数据点的额外信息，帮助用户更好地理解和解释可视化，在可视化中 Tooltip 通常具有以下作用：
  - 显示详细信息：Tooltip 可以显示有关数据点的详细信息，例如具体数值、百分比或其他相关属性。这有助于用户更深入地了解数据。
  - 提高可读性：在复杂的可视化中，Tooltip 可以帮助用户更容易地识别和理解数据点。例如，在散点图中，当数据点密集时，Tooltip 可以显示特定点的详细信息，而无需将鼠标悬停在每个点上。
  - 增强交互性：Tooltip 可以增强可视化的交互性。用户可以通过悬停或点击数据点来查看更多信息，这使得可视化更加动态和有趣。
  - 突出显示关键信息：Tooltip 可以用来突出显示关键信息。例如，在时间序列图中，您可以使用 Tooltip 显示特定时间点的重要事件或突变。

```js
({
  type: "interval",
  tooltip: {
    title: "name", // 标题
    items: ["genre"], // 数据项
  },
});
// API
chart.interval().tooltip({
  title: "name", // 标题
  items: ["genre"], // 数据项
});
```

- scrollbar - 滚动条:可以用于过滤数据，可以和 x 或者 y 通道绑定的，滚动条默认都是关闭的。

```js
// 第一种方式
chart.interval().scrollbar("x", {}).scrollbar("y", {});

// 第二种方式
chart.interval().scrollbar({
  x: {},
  y: {},
});
```

- slider - 拖拽轴:可以用于过滤数据，可以和 x 或者 y 通道绑定的，滑动条默认都是关闭的。

```js
// 第一种方式
chart.interval().slider('x', {}).slider('y', {});

// 第二种方式
chart.interval().slider({
  x: {},
  y: {},
});

// 并且结合 view.interaction.tooltip 去配置提示信息的渲染和额外配置。

({
  type: 'view',
  interaction: {
    tooltip: { series: true },
  },
});
// API
chart.interaction('tooltip', { series: true });

  tooltip: {
    title: (d) => (d.sold > 150 ? 'high' : 'low'), // 设置 title
    items: [
      'genre', // 第一个 item
      'sold', // 第二个 item
    ],
  },

  type Item = {
  color?: string; // marker 的颜色
  name?: string; // item 的名字
  value?: string; // item 的值
};

// 当然对于 title 和 item 还提供了回调去获得最大的自定义能力。
({
  tooltip: {
    items: [
      (d, index, data, column) => ({
        color: d.sold > 150 ? 'red' : 'blue', // 指定 item 的颜色
        name: index === 0 ? d.genre : `${d.genre} ${data[i].genre}`, // 指定 item 的名字
        value: column.y.value[i], // 使用 y 通道的值
      }),
    ],
  },
});
```

- interaction - 交互: 提供了按需探索数据的能力。

```js
// 第一种方式
chart.interaction('tooltip', {}).interaction('brushHighlight', {});

// 第二种方式
chart.interaction({
  tooltip: {},
  brushHighlight: {},
});

chart.interaction('elementHighlight', { link: true, background: true });
chart.line().interaction('elementHighlight', { link: false });
chart.area().interaction('elementHighlight', { background: false });
// 和下面的情况等价：
chart.interaction('elementHighlight', { link: false, background: false });
chart.line();
chart.area():
```

- theme - 主题:是图表中图形的一些默认样式。

包含的默认主题有：

- G2.Light
- G2.Dark
- G2.Classic
- G2.ClassicDark
- G2.Academy

```js
({
  type: "interval",
  theme: { color: "red" }, // 设置默认颜色为红色
});
// API
chart.interval().theme({});

chart.theme({ type: "classicDark" }); // 使用暗色主题

// 定义主题
function CustomTheme() {
  const light = G2.Light();
  return { ...light, color: "red" };
}

// 注册主题
G2.register("theme.custom", CustomTheme);
```
