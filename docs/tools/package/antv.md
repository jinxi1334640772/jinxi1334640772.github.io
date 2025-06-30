---
title: 📊 AntV 数据可视化解决方案完全指南
description: 蚂蚁企业级数据可视化解决方案，包含 G2、G6、X6、L7 等多个产品，让人们在数据世界里获得视觉化思考能力
outline: deep
---

# 📊 AntV 数据可视化解决方案完全指南

> 蚂蚁企业级数据可视化解决方案，让人们在数据世界里获得视觉化思考能力

::: info 🌟 官方资源
- **官网**: [https://antv.antgroup.com/](https://antv.antgroup.com/)
- **核心理念**: 让人们在数据世界里获得视觉化思考能力
- **应用场景**: 报表搭建、数据探索、可视化叙事
:::

## 🎯 AntV 产品矩阵

### 📈 桌面端产品

| 产品 | 用途 | 特色 | 适用场景 |
|------|------|------|----------|
| **G2** | 统计图表 | 🎨 渐进式语法、函数式API | 数据分析、报表制作 |
| **S2** | 多维表格 | 📊 多维分析、透视表 | 复杂数据展示 |
| **G6** | 关系图 | 🔗 图分析、网络图 | 关系分析、拓扑图 |
| **X6** | 流程图 | 🔄 可视化建模 | 流程设计、架构图 |
| **L7** | 地图 | 🗺️ 地理可视化 | 地理数据分析 |

### 📱 移动端产品

| 产品 | 用途 | 特色 | 对应桌面版 |
|------|------|------|------------|
| **F2** | 移动统计图 | 📱 轻量级、触控优化 | G2 |
| **F6** | 移动关系图 | 🔗 移动端图分析 | G6 |
| **F7** | 移动地图 | 🗺️ 移动地理可视化 | L7 |

## 📊 G2 统计图表详解

G2 是一个简洁的渐进式语法，主要用于制作基于网页的可视化。它提供了一套函数风格式、声明形式的 API 和组件化的编程范式。

### 🔧 核心概念

| 概念 | 作用 | 说明 |
|------|------|------|
| **标记 (Mark)** | 绘制数据驱动的图形 | G2 的基本视觉单元 |
| **转换 (Transform)** | 派生数据 | 数据处理和分析 |
| **比例尺 (Scale)** | 数据映射 | 抽象数据→视觉数据 |
| **坐标系 (Coordinate)** | 空间变换 | 对空间通道应用点变换 |
| **视图复合 (Composition)** | 视图管理 | 管理和增强视图 |
| **动画 (Animation)** | 动态效果 | 数据驱动的动画 |
| **交互 (Interaction)** | 用户交互 | 操作视图并展现详细信息 |

### 🚀 基础使用示例

```html
<div id="chart"></div>
```

```javascript
// 基础图表创建
(() => {
  /**
   * 实例化图表
   * @getContainer() 获取Chart容器
   * @render() 渲染图表
   * @clear() 清空图表
   * @destroy() 销毁图表
   */
  const chart = new G2.Chart({
    // 挂载容器
    container: 'chartId' || document.getElementById('chart'),
    height: 360,
    width: 800,
    paddingLeft: 50,
  });

  // 声明可视化
  let facet = chart
    .point() // 点阵图
    .data({  // 获取数据
      type: "fetch",
      value: "https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json",
    })
    // 标记是 G2 中最小的视觉单元，G2 中的所有图表都是由不同标记构成的
    .encode("x", "weight")
    .encode('y', 'height');

  // 视图复合用于制作多视图图表
  facet
    .rect() // 柱形图
    // 增加颜色编码
    .encode("color", "gender")
    // 转换会改变数据和标记的展现形式，多用于数据分析
    .transform({ type: "binX", y: "count" })
    .transform({ type: "stackY" })
    // 比例尺用于控制标记的视觉样式
    .scale("color", { range: ["steelblue", "orange"] })
    .scale("y", { nice: true })
    // 坐标系会改变图表的展示形式
    .coordinate({ type: "polar" })
    .axis("y", { title: false })
    .style("insetLeft", 1)
    // 交互可以按需探索数据
    .interaction("brushXHighlight", true);

  // 动画支持分组动画和关键帧动画
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

::: tip 💡 参考资源
更多配置选项请参考：[G2 配置规范](https://g2.antv.antgroup.com/spec/overview)
:::

## 🏷️ 标记 (Mark) 详解

在 G2 中没有图表的概念，而是把标记（Mark）作为基本的视觉组成单元，任何一个图表都是多个标记组合而成的。

::: info 📝 标记特点
- 标记是一个模版，会生成一系列数据驱动的图形
- 每个图形对应一个或者多个数据项（Data Item）
- 标记是视图树中叶子节点，也是 G2 中的"一等公民"
:::

### 📋 标记配置结构

```javascript
const markConfig = {
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
};
```

### 🎨 标记类型大全

#### 基础图形标记

| 标记类型 | 用途 | 适用图表 | 特点 |
|----------|------|----------|------|
| **interval** | 柱状图形 | 柱状图、条形图、饼图 | 🔲 矩形区域表示数据 |
| **point** | 点图形 | 散点图、气泡图 | 🔴 点的粒度分析数据分布 |
| **line** | 线图形 | 折线图、曲线图 | 📈 连接点绘制趋势 |
| **area** | 面积图形 | 面积图、堆叠面积图 | 🌊 填充突出趋势信息 |

#### 高级图形标记

| 标记类型 | 用途 | 适用图表 | 特点 |
|----------|------|----------|------|
| **cell** | 网格图形 | 日历图、热力图 | 🔳 空间划分子区域 |
| **rect** | 矩形图形 | 直方图、矩阵树图 | ⬜ 两组坐标定位矩形 |
| **link** | 连接图形 | 关系图、网络图 | 🔗 两点间带方向直线 |
| **vector** | 向量图形 | 向量场图 | ➡️ 起止点表示向量 |
| **box** | 箱线图形 | 箱线图 | 📦 数据分布统计 |
| **boxplot** | 箱线图形 | 箱线图 | 📊 内置数据聚合 |

#### 文本和图像标记

| 标记类型 | 用途 | 适用场景 | 特点 |
|----------|------|----------|------|
| **text** | 文本标记 | 标签、注释 | 📝 数据绑定文本 |
| **image** | 图像标记 | 图片展示 | 🖼️ 绘制数据驱动图片 |
| **shape** | 自定义图形 | 特殊需求 | 🎨 自定义函数绘制 |

#### 辅助标记

| 标记类型 | 用途 | 适用场景 | 特点 |
|----------|------|----------|------|
| **lineX** | X轴辅助线 | 参考线 | ➖ 垂直于X轴的线 |
| **lineY** | Y轴辅助线 | 参考线 | ❘ 垂直于Y轴的线 |
| **range** | 矩形区域 | 高亮区域 | 🔲 矩形高亮区域 |
| **rangeX** | X轴区域 | X轴高亮 | ↔️ X轴方向矩形区域 |
| **rangeY** | Y轴区域 | Y轴高亮 | ↕️ Y轴方向矩形区域 |

#### 特殊用途标记

| 标记类型 | 用途 | 适用场景 | 特点 |
|----------|------|----------|------|
| **polygon** | 多边形 | 地理图形 | 🔷 多点闭合多边形 |
| **wordCloud** | 词云 | 文本分析 | ☁️ 词云图 |
| **density** | 密度图 | 数据密度 | 🌊 核密度渲染 |
| **heatmap** | 热力图 | 热力分析 | 🔥 热力数据渲染 |

## 🔧 标记组成部分

### 📊 数据 (data)

可视化的数据源，支持多种数据格式：

```javascript
// 静态数据
.data([
  { name: 'A', value: 10 },
  { name: 'B', value: 20 }
])

// 远程数据
.data({
  type: "fetch",
  value: "https://api.example.com/data.json"
})
```

### 🎨 编码 (encode)

编码信息，用于指定视觉元素属性和数据之间的关系：

#### 通用通道

| 通道 | 作用 | 说明 | 示例 |
|------|------|------|------|
| **x** | X位置 | 水平位置 | `.encode("x", "name")` |
| **y** | Y位置 | 垂直位置 | `.encode("y", "value")` |
| **z** | Z位置 | 深度位置 | `.encode("z", "depth")` |
| **color** | 颜色 | 填充色或边框色 | `.encode("color", "category")` |
| **opacity** | 透明度 | 透明度设置 | `.encode("opacity", "weight")` |
| **shape** | 形状 | 图形形状 | `.encode("shape", "type")` |
| **size** | 大小 | 图形尺寸 | `.encode("size", "amount")` |
| **series** | 系列 | 数据分组 | `.encode("series", "group")` |
| **key** | 唯一标识 | 数据更新标识 | `.encode("key", "id")` |

#### API 使用方式

```javascript
// 方式一：链式调用
chart.interval()
  .encode('x', 'name')
  .encode('y', 'value');

// 方式二：对象配置
chart.interval()
  .encode({ 
    x: 'name', 
    y: 'value',
    color: 'category'
  });
```

### ⚖️ 比例尺 (scale)

映射规则：将抽象数据映射为视觉数据，是抽象数据和视觉数据的桥梁。

```javascript
// 方式一：链式配置
chart.scale("x", { padding: 0.5 })
     .scale("y", {
       type: "log",        // 指定类型
       domain: [10, 100],  // 指定定义域
       range: [0, 1],      // 指定值域
     });

// 方式二：对象配置
chart.scale({
  x: { padding: 0.5 },
  y: { 
    type: "log",
    domain: [10, 100],
    range: [0, 1]
  }
});
```

### 🎭 比例尺类型

| 类型 | 用途 | 适用数据 | 特点 |
|------|------|----------|------|
| **linear** | 线性比例尺 | 连续数值 | 📏 线性映射 |
| **log** | 对数比例尺 | 大范围数值 | 📊 对数映射 |
| **ordinal** | 序数比例尺 | 分类数据 | 🏷️ 离散映射 |
| **time** | 时间比例尺 | 时间数据 | ⏰ 时间轴映射 |

::: warning 🚨 注意事项
- 编码决定了标记的哪些通道需要被可视化
- 比例尺决定了这些通道该如何被可视化
- 不同的标记类型支持不同的通道组合
:::

## 🎯 最佳实践

### 📈 图表选择指南

| 数据类型 | 推荐图表 | 标记类型 | 使用场景 |
|----------|----------|----------|----------|
| **分类对比** | 柱状图 | interval | 不同类别数据对比 |
| **趋势分析** | 折线图 | line | 时间序列数据变化 |
| **相关性分析** | 散点图 | point | 两个变量关系分析 |
| **占比分析** | 饼图 | interval + polar | 部分与整体关系 |
| **分布分析** | 直方图 | rect | 数据分布情况 |

### 🎨 设计原则

::: tip 💡 设计建议
1. **简洁明了**: 避免过多装饰，突出数据本身
2. **色彩合理**: 使用合适的颜色方案，考虑色盲用户
3. **交互友好**: 提供必要的交互功能，提升用户体验
4. **响应式设计**: 适配不同屏幕尺寸和设备
:::

### 🚀 性能优化

```javascript
// 大数据量优化
chart.interval()
  .data(largeDataset)
  // 数据采样
  .transform({ type: 'sample', size: 1000 })
  // 启用 WebGL 渲染
  .style('renderer', 'webgl')
  // 关闭动画
  .animate(false);
```

## 📚 扩展阅读

- [G2 官方文档](https://g2.antv.antgroup.com/)
- [G6 图可视化](https://g6.antv.antgroup.com/)
- [X6 图编辑器](https://x6.antv.antgroup.com/)
- [L7 地理空间数据可视化](https://l7.antv.antgroup.com/)
