---
title: 📊 ECharts 数据可视化图表库完全指南
description: Apache ECharts 是一个基于 JavaScript 的开源可视化图表库，支持折线图、柱状图、饼图等多种图表类型
outline: deep
---

# 📊 ECharts 数据可视化图表库完全指南

> Apache ECharts 是一个基于 JavaScript 的开源可视化图表库，提供了丰富的图表类型和强大的交互功能。

::: info 📚 官方资源
- **官网**: [https://echarts.apache.org](https://echarts.apache.org/handbook/zh/basics/release-note/v5-feature)
- **支持图表**: 折线图、柱状图、饼状图、散点图、地图等
:::

## 🎯 ECharts 简介

ECharts 支持折线图、柱状图、饼状图等多种图表类型

## 全部引入

```js
import * as echarts from "echarts";
```

## 按需引入

```js
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from "echarts/charts";
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
```

## 配置选项

```js
// 基于准备好的dom，初始化echarts实例
let myecharts = echarts.init(document.getElementById("echart"),null,{width: 600,height: 400});
// 图表的配置选项
myecharts.setOption({
  // 配置图表title
  title: {
    show: true,
    text: "我是张锦曦",
    // link: 'www.baidu.com',
    target: "blank",
    borderWidth: 3,
    borderColor: "yellow",
    left: 10,
    textStyle: {
      color: "blue",
      fontSize: 18,
      fontWeight: "lighter",
      textBorderWidth: 3,
      textBorderColor: "red",
    },
    subtext: "我是副标题",
    subtextStyle: {
      fontSize: 20,
    },
  },
  // 配置图表图例
  legend: {
    type: "plain",
    show: true,
    textStyle: {
      color: "blue",
      fontSize: 14,
      lintHeight: 14,
      backgroundColor: "red",
    },
    tooltip: {
      show: true, // 默认false
    },
    icon: "circle",
  },
  // 配置工具箱
  toolbox: {
    show: true,
    orient: "horizontal",
    itemSize: 15,
    showTitle: true,
  },
  // 配置hover提示信息
  tooltip: {
    show: true,
    trigger: "item",
  },
  // 配置显示的数据源
  dataset: {
    source: [
      ["product", "2012", "2013", "2014", "2015"],
      ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
      ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
      ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
    ],
  },
 /**
  * dataset里的source数据源，也可以配置成对象的形式
  * dataset: {
    // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
    // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
    // 如果不指定 dimensions，也可以通过指定 series.encode
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
      { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
    ]
  },
  */
  // 配置X轴
  xAxis: [
    {
      type: "category",
      gridIndex: 0,
      name: "我是X轴1",
      nameTextStyle: { fontSize: 17, padding: [3, 4, 5, 6] },
    },
    { type: "category", gridIndex: 1, name: "我是X轴2" },
  ],
  // 配置Y轴
  yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
  // 配置图表网格布局
  grid: [
    // 直角坐标系
    {
      bottom: "55%",
      show: true,
      width: "auto",
      height: "auto",
      tooltip: {
        show: true,
      },
    },
    { top: "55%" },
  ],
  // 当 x 轴（水平坐标轴）跨度很大，可以采用区域缩放方式灵活显示数据内容
  dataZoom: [
    {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [1],
      filterMode: "filter",
      start: 20,
      end: 80,
    },
    {
      id: "dataZoomY",
      type: "slider",
      yAxisIndex: [1],
      filterMode: "empty",
    },
  ],
  // 视觉映射：定义了把数据的哪个维度映射到什么视觉元素上。可以同时定义多个 visualMap 组件。
  visualMap: [
    //连续型：进行视觉映射的数据维度是连续的数
    {
      type: 'continuous',
      min: 0,
      max: 5000,
      dimension: 3, // series.data 的第四个维度（即 value[3]）被映射
      seriesIndex: 4, // 对第四个系列进行映射。
      inRange: {
        // 选中范围中的视觉配置
        color: ['blue', '#121122', 'red'], // 定义了图形颜色映射的颜色列表，
        // 数据最小值映射到'blue'上，
        // 最大值映射到'red'上，
        // 其余自动线性计算。
        symbolSize: [30, 100] // 定义了图形尺寸的映射范围，
        // 数据最小值映射到30上，
        // 最大值映射到100上，
        // 其余自动线性计算。
      },
      outOfRange: {
        // 选中范围外的视觉配置
        symbolSize: [30, 100]
      }
    }
    //分段型：数据被分成了多段或者是离散型的数据。
    {
      type: "piecewise",
    },
  ],
  axisPointer: {},
  // 定义数据如何显示，柱状、折线...... 还可以配置数据源（不推荐，推荐数据定义在dataset数据集中）
  series: [
    // 这几个系列会在第一个直角坐标系中，每个系列对应到 dataset 的每一行。
    { type: "bar", seriesLayoutBy: "row" },
    { type: "bar", seriesLayoutBy: "row" },
    { type: "bar", seriesLayoutBy: "row" },
    // 这几个系列会在第二个直角坐标系中，每个系列对应到 dataset 的每一列。
    { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
  ],
});
```
