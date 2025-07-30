---
title: 📊 AntV 数据可视化解决方案完全指南
description: 蚂蚁企业级数据可视化解决方案，包含 G2、G6、X6、L7、S2 等多个产品，让人们在数据世界里获得视觉化思考能力，提供统计图表、关系图、流程图、地图、表格等全方位可视化能力
outline: deep
---

# 📊 AntV 数据可视化解决方案完全指南

> 蚂蚁企业级数据可视化解决方案，让人们在数据世界里获得视觉化思考能力

::: info 🌟 官方资源
- **官网**: [https://antv.antgroup.com/](https://antv.antgroup.com/)
- **GitHub**: [https://github.com/antvis](https://github.com/antvis)
- **核心理念**: 让人们在数据世界里获得视觉化思考能力
- **应用场景**: 报表搭建、数据探索、可视化叙事、业务分析
:::

<details>
<summary>📋 目录导航</summary>

[[toc]]

</details>

## 🎯 AntV 产品矩阵概览

AntV 是蚂蚁集团全新一代数据可视化解决方案，提供了完整的产品矩阵，覆盖统计图表、关系图、流程图、地图可视化等各个领域。

### 📈 桌面端产品

| 产品 | 用途 | 特色 | 适用场景 | 学习成本 |
|------|------|------|----------|----------|
| **G2** | 统计图表 | 🎨 渐进式语法、函数式API | 数据分析、报表制作 | ⭐⭐⭐ |
| **S2** | 多维表格 | 📊 多维分析、透视表 | 复杂数据展示 | ⭐⭐⭐⭐ |
| **G6** | 关系图 | 🔗 图分析、网络图 | 关系分析、拓扑图 | ⭐⭐⭐⭐ |
| **X6** | 流程图 | 🔄 可视化建模 | 流程设计、架构图 | ⭐⭐⭐⭐⭐ |
| **L7** | 地图 | 🗺️ 地理可视化 | 地理数据分析 | ⭐⭐⭐⭐ |

### 📱 移动端产品

| 产品 | 用途 | 特色 | 对应桌面版 | 状态 |
|------|------|------|------------|------|
| **F2** | 移动统计图 | 📱 轻量级、触控优化 | G2 | 🔄 维护中 |
| **F6** | 移动关系图 | 🔗 移动端图分析 | G6 | 🔄 维护中 |
| **F7** | 移动地图 | 🗺️ 移动地理可视化 | L7 | 🔄 维护中 |

### 🛠️ 工具和生态

| 工具 | 用途 | 特色 | 适用人群 |
|------|------|------|----------|
| **ChartCube** | 图表配置器 | 🎛️ 可视化配置 | 非技术人员 |
| **Graphin** | 图分析应用 | 🕸️ 开箱即用 | 图分析需求 |
| **DipperMap** | 地图应用 | 🗺️ 地理分析工具 | 地理数据分析 |

## 🚀 快速开始

### 📦 环境要求

```json
{
  "engines": {
    "node": ">=12.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0" // 如使用 React 组件
  }
}
```

### 🛠️ 安装方式

#### NPM/Yarn 安装

```bash
# G2 统计图表
npm install @antv/g2
# 或
yarn add @antv/g2

# G6 关系图
npm install @antv/g6
yarn add @antv/g6

# X6 流程图
npm install @antv/x6
yarn add @antv/x6

# L7 地图
npm install @antv/l7
yarn add @antv/l7

# S2 多维表格
npm install @antv/s2
yarn add @antv/s2
```

#### CDN 引入

```html
<!-- G2 -->
<script src="https://gw.alipayobjects.com/os/lib/antv/g2/4.2.8/dist/g2.min.js"></script>

<!-- G6 -->
<script src="https://gw.alipayobjects.com/os/lib/antv/g6/4.8.11/dist/g6.min.js"></script>

<!-- X6 -->
<script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>

<!-- L7 -->
<script src="https://unpkg.com/@antv/l7"></script>
```

## 📊 G2 统计图表详解

G2 是一套面向常规统计图表，以数据驱动的高交互可视化图形语法，具有高度的易用性和扩展性。

### 🎨 核心概念

| 概念 | 作用 | 说明 | 应用 |
|------|------|------|------|
| **标记 (Mark)** | 绘制数据驱动的图形 | G2 的基本视觉单元 | 点、线、面等图形 |
| **转换 (Transform)** | 派生数据 | 数据处理和分析 | 分组、排序、聚合 |
| **比例尺 (Scale)** | 数据映射 | 抽象数据→视觉数据 | 线性、对数、时间尺度 |
| **坐标系 (Coordinate)** | 空间变换 | 对空间通道应用点变换 | 直角、极坐标系 |
| **视图复合 (Composition)** | 视图管理 | 管理和增强视图 | 分面、联合图表 |
| **动画 (Animation)** | 动态效果 | 数据驱动的动画 | 过渡、关键帧动画 |
| **交互 (Interaction)** | 用户交互 | 操作视图并展现详细信息 | 缩放、刷选、高亮 |

### 🚀 基础使用示例

```javascript
// 引入 G2
import { Chart } from '@antv/g2';

// 创建图表实例
const chart = new Chart({
  container: 'container',
    width: 800,
  height: 400,
  padding: [20, 40, 50, 40]
});

// 基础柱状图
chart
  .interval()
  .data([
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 15 },
    { name: 'D', value: 25 }
  ])
  .encode('x', 'name')
  .encode('y', 'value')
  .encode('color', 'name');

// 渲染图表
chart.render();
```

### 📈 常用图表类型

#### 1. 柱状图

```javascript
// 基础柱状图
const barChart = new Chart({
  container: 'bar-chart',
  width: 600,
  height: 400
});

barChart
    .interval()
    .data(data)
  .encode('x', 'category')
  .encode('y', 'value')
  .encode('color', 'category')
  .style('radius', 4)
  .animate('enter', { type: 'scaleInY' });

// 分组柱状图
barChart
  .interval()
  .data(data)
  .encode('x', 'category')
  .encode('y', 'value')
  .encode('color', 'series')
  .encode('series', 'series')
  .style('maxWidth', 20);

// 堆叠柱状图
barChart
  .interval()
  .data(data)
  .encode('x', 'category')
  .encode('y', 'value')
  .encode('color', 'series')
  .transform({ type: 'stackY' });
```

#### 2. 折线图

```javascript
// 基础折线图
const lineChart = new Chart({
  container: 'line-chart',
  width: 600,
  height: 400
});

lineChart
  .line()
  .data(data)
  .encode('x', 'date')
  .encode('y', 'value')
  .encode('color', 'series')
  .style('lineWidth', 2)
  .animate('enter', { type: 'pathIn' });

// 添加数据点
lineChart
  .point()
  .data(data)
  .encode('x', 'date')
  .encode('y', 'value')
  .encode('color', 'series')
  .style('r', 3);

// 面积图
lineChart
  .area()
  .data(data)
  .encode('x', 'date')
  .encode('y', 'value')
  .encode('color', 'series')
  .style('fillOpacity', 0.6);
```

#### 3. 饼图

```javascript
// 基础饼图
const pieChart = new Chart({
  container: 'pie-chart',
  width: 400,
  height: 400
});

pieChart
  .interval()
  .data(data)
  .transform({ type: 'stackY' })
  .coordinate({ type: 'theta' })
  .encode('y', 'value')
  .encode('color', 'category')
  .style('stroke', '#fff')
  .style('lineWidth', 2)
  .animate('enter', { type: 'waveIn' });

// 环形图
pieChart
  .coordinate({ 
    type: 'theta',
    innerRadius: 0.4
  });

// 添加标签
pieChart
  .text()
  .data(data)
  .encode('x', 'category')
  .encode('y', 'value')
  .encode('text', 'value')
  .style('textAlign', 'center');
```

#### 4. 散点图

```javascript
// 散点图
const scatterChart = new Chart({
  container: 'scatter-chart',
  width: 600,
  height: 400
});

scatterChart
  .point()
  .data(data)
  .encode('x', 'height')
  .encode('y', 'weight')
  .encode('color', 'gender')
  .encode('size', 'age')
  .style('fillOpacity', 0.7)
  .animate('enter', { type: 'scaleInX' });

// 添加回归线
scatterChart
  .line()
  .data(data)
  .transform({ type: 'regression' })
  .encode('x', 'height')
  .encode('y', 'weight')
  .style('stroke', '#666')
  .style('strokeDasharray', [3, 3]);
```

### 🎛️ 高级配置

#### 主题配置

```javascript
import { register } from '@antv/g2';

// 注册自定义主题
register('theme.customTheme', {
  colors10: [
    '#FF6B3B', '#C23616', '#F79F1F', '#A3CB38',
    '#1289A7', '#D980FA', '#B53471', '#FFC312',
    '#C4E538', '#12CBC4'
  ],
  backgroundColor: '#f5f5f5',
  subColor: '#666',
  axis: {
    domainColor: '#d0d0d0',
    tickColor: '#d0d0d0',
    titleFill: '#444',
    labelFill: '#666'
  }
});

// 使用主题
const chart = new Chart({
  container: 'container',
  theme: 'customTheme'
});
```

#### 动画配置

```javascript
// 入场动画
chart
  .interval()
  .animate('enter', {
    type: 'scaleInY',
    duration: 1000,
    delay: (d, i) => i * 100
  });

// 更新动画
chart
  .animate('update', {
    duration: 500,
    easing: 'easeQuadOut'
  });

// 出场动画
chart
  .animate('exit', {
    type: 'fadeOut',
    duration: 300
  });
```

#### 交互配置

```javascript
// 添加交互
chart.interaction('brushXHighlight', {
  maskFill: 'rgba(255, 0, 0, 0.1)',
  maskStroke: '#ff0000'
});

chart.interaction('tooltip', {
  shared: true,
  title: 'date',
  body: {
    fields: ['value', 'category'],
    callback: (value, category) => ({
      name: category,
      value: `${value}万`
    })
  }
});

chart.interaction('legend', {
  position: 'top',
  layout: 'horizontal'
});
```

## 🔗 G6 关系图详解

G6 是一个专业的图可视化引擎，提供了丰富的图布局算法和交互行为。

### 🏗️ 基础架构

```javascript
import G6 from '@antv/g6';

// 创建图实例
const graph = new G6.Graph({
  container: 'container',
  width: 800,
  height: 600,
  // 布局配置
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSize: 30
  },
  // 默认节点样式
  defaultNode: {
    size: 30,
    style: {
      fill: '#C6E5FF',
      stroke: '#5B8FF9',
      lineWidth: 3
    },
    labelCfg: {
      style: {
        fill: '#000',
        fontSize: 14
      }
    }
  },
  // 默认边样式
  defaultEdge: {
    style: {
      stroke: '#e2e2e2',
      lineWidth: 2
    }
  },
  // 节点状态样式
  nodeStateStyles: {
    hover: {
      fill: '#d3f261'
    },
    selected: {
      fill: '#f00'
    }
  },
  // 边状态样式
  edgeStateStyles: {
    hover: {
      stroke: '#999'
    }
  },
  // 交互模式
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      'drag-node',
      'click-select'
    ]
  }
});

// 数据结构
const data = {
  nodes: [
    { id: 'node1', label: 'Node 1' },
    { id: 'node2', label: 'Node 2' },
    { id: 'node3', label: 'Node 3' }
  ],
  edges: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' }
  ]
};

// 渲染图
graph.data(data);
graph.render();
```

### 📐 布局算法

```javascript
// 力导向布局
graph.updateLayout({
  type: 'force',
  preventOverlap: true,
  nodeSize: 30,
  linkDistance: 100,
  nodeStrength: -30,
  edgeStrength: 0.1
});

// 层次布局
graph.updateLayout({
  type: 'dagre',
  rankdir: 'TB', // TB, BT, LR, RL
  align: 'DL',   // UL, UR, DL, DR
  nodesep: 20,
  ranksep: 50
});

// 圆形布局
graph.updateLayout({
  type: 'circular',
  radius: 200,
  startRadius: 10,
  endRadius: 300,
  clockwise: true,
  divisions: 5
});

// 网格布局
graph.updateLayout({
  type: 'grid',
  rows: 5,
  cols: 5,
  sortBy: 'degree'
});
```

### 🎨 自定义节点和边

```javascript
// 注册自定义节点
G6.registerNode('custom-node', {
  draw(cfg, group) {
    const rect = group.addShape('rect', {
      attrs: {
        x: -75,
        y: -25,
        width: 150,
        height: 50,
        fill: cfg.color || '#5B8FF9',
        radius: 10
      },
      name: 'rect-shape'
    });

    if (cfg.label) {
      group.addShape('text', {
        attrs: {
          x: 0,
          y: 0,
          fontFamily: 'Arial',
          textAlign: 'center',
          textBaseline: 'middle',
          fontSize: 14,
          fill: '#fff',
          text: cfg.label
        },
        name: 'text-shape'
      });
    }

    return rect;
  }
});

// 使用自定义节点
const data = {
  nodes: [
    { 
      id: 'node1', 
      label: 'Custom Node',
      type: 'custom-node',
      color: '#FF6B6B'
    }
  ]
};
```

## 🔀 X6 流程图详解

X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展。

### 🎯 基础使用

```javascript
import { Graph } from '@antv/x6';

// 创建画布
const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  grid: true,
  mousewheel: {
    enabled: true,
    zoomAtMousePosition: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3
  },
  connecting: {
    router: 'manhattan',
    connector: {
      name: 'rounded',
      args: {
        radius: 8
      }
    },
    anchor: 'center',
    connectionPoint: 'anchor',
    allowBlank: false,
    snap: {
      radius: 20
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        },
        zIndex: 0
      });
    }
  },
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#5F95FF',
          stroke: '#5F95FF'
        }
      }
    }
  }
});

// 添加节点
const rect = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 80,
  height: 40,
  label: 'Hello',
  attrs: {
    body: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
      fill: '#fff',
      rx: 6,
      ry: 6
    },
    text: {
      fontSize: 12,
      fill: '#262626'
    }
  }
});

const circle = graph.addNode({
  shape: 'circle',
  x: 180,
  y: 160,
  width: 60,
  height: 60,
  label: 'World',
  attrs: {
    body: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
      fill: '#fff'
    },
    text: {
      fontSize: 12,
      fill: '#262626'
    }
  }
});

// 添加边
graph.addEdge({
  source: rect,
  target: circle,
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 1
    }
  }
});
```

### 🎨 自定义形状

```javascript
import { Shape } from '@antv/x6';

// 注册自定义矩形
Shape.Rect.define({
  title: 'Custom Rect',
  width: 100,
  height: 60,
  attrs: {
    body: {
      strokeWidth: 1,
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      rx: 10,
      ry: 10
    },
    text: {
      fontSize: 14,
      fill: '#262626'
    }
  },
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      { group: 'top' },
      { group: 'right' },
      { group: 'bottom' },
      { group: 'left' }
    ]
  }
}, 'custom-rect');
```

## 🗺️ L7 地图可视化详解

L7 是由蚂蚁金服 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析开发框架。

### 🌍 基础地图

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

// 创建地图场景
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    center: [120.19382669582967, 30.258134],
    zoom: 3,
    token: 'YOUR_AMAP_TOKEN'
  })
});

// 添加数据
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w'
          }
        })
        .shape('cylinder')
        .size('t', function (level) {
          return [1, 2, level * 2 + 20];
        })
        .color('t', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ])
        .style({
          opacity: 1.0
        });
      
      scene.addLayer(pointLayer);
    });
});
```

### 🎯 图层类型

```javascript
// 点图层
const pointLayer = new PointLayer()
  .source(data)
  .shape('circle')
  .size(10)
  .color('#f00');

// 线图层
const lineLayer = new LineLayer()
  .source(data)
  .shape('line')
  .size(2)
  .color('#00f');

// 面图层
const polygonLayer = new PolygonLayer()
  .source(data)
  .shape('fill')
  .color('name', ['#f00', '#0f0', '#00f']);

// 热力图
const heatmapLayer = new HeatmapLayer()
  .source(data)
  .shape('heatmap')
  .size('weight', [0, 1])
  .style({
    intensity: 2,
    radius: 20,
    opacity: 1.0,
    rampColors: {
      colors: [
        '#FF4818',
        '#F7B74A',
        '#FFF598',
        '#91EABC',
        '#2EA9A1',
        '#206C7C'
      ].reverse(),
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    }
  });
```

## 📊 S2 多维表格详解

S2 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库。

### 📋 基础表格

```javascript
import { PivotSheet } from '@antv/s2';

// 透视表配置
const s2Options = {
  width: 600,
  height: 480,
  interaction: {
    enableCopy: true,
    hoverHighlight: false,
    selectedCellsSpotlight: false
  },
  tooltip: {
    showTooltip: true
  }
};

// 数据配置
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price']
  },
  data: [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: 1
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: 2
    }
  ]
};

// 创建表格
const s2 = new PivotSheet(
  document.getElementById('container'),
  s2DataConfig,
  s2Options
);

// 渲染
s2.render();
```

### 🎨 主题定制

```javascript
import { PaletteLegendTheme } from '@antv/s2';

// 自定义主题
const customTheme = {
  name: 'customTheme',
  palette: {
    basicColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    semanticColors: {
      red: '#FF6B6B',
      green: '#4ECDC4'
    }
  },
  dataCell: {
    cell: {
      backgroundColor: '#ffffff',
      horizontalBorderColor: '#000',
      verticalBorderColor: '#000'
    },
    text: {
      fontSize: 13,
      fontFamily: 'Roboto'
    }
  }
};

// 应用主题
const s2 = new PivotSheet(container, s2DataConfig, {
  ...s2Options,
  theme: customTheme
});
```

## 🔄 框架集成

### React 集成

```jsx
// G2 React 组件
import React from 'react';
import { Chart } from '@antv/g2';

const G2Chart = ({ data, config }) => {
  const chartRef = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chart.current = new Chart({
        container: chartRef.current,
        ...config
      });
      
      chart.current
        .interval()
        .data(data)
  .encode('x', 'name')
  .encode('y', 'value');

      chart.current.render();
    }

    return () => {
      chart.current?.destroy();
    };
  }, [data, config]);

  return <div ref={chartRef} />;
};

// G6 React 组件
import { Graph } from '@antv/g6';

const G6Graph = ({ data, config }) => {
  const graphRef = useRef(null);
  const graph = useRef(null);

  useEffect(() => {
    if (graphRef.current) {
      graph.current = new Graph({
        container: graphRef.current,
        ...config
      });
      
      graph.current.data(data);
      graph.current.render();
    }

    return () => {
      graph.current?.destroy();
    };
  }, [data, config]);

  return <div ref={graphRef} />;
};

// S2 React 组件
import { SheetComponent } from '@antv/s2-react';

const S2Table = ({ dataCfg, options }) => {
  return (
    <SheetComponent
      dataCfg={dataCfg}
      options={options}
      sheetType="pivot"
    />
  );
};
```

### Vue 集成

```vue
<!-- G2 Vue 组件 -->
<template>
  <div ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Chart } from '@antv/g2';

const props = defineProps(['data', 'config']);
const chartContainer = ref(null);
let chart = null;

onMounted(() => {
  chart = new Chart({
    container: chartContainer.value,
    ...props.config
  });
  
  updateChart();
});

onUnmounted(() => {
  chart?.destroy();
});

watch(() => props.data, updateChart, { deep: true });

const updateChart = () => {
  if (chart && props.data) {
    chart.clear();
    chart
      .interval()
      .data(props.data)
      .encode('x', 'name')
      .encode('y', 'value');
    chart.render();
  }
};
</script>

<!-- G6 Vue 组件 -->
<template>
  <div ref="graphContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import G6 from '@antv/g6';

const props = defineProps(['data', 'config']);
const graphContainer = ref(null);
let graph = null;

onMounted(() => {
  graph = new G6.Graph({
    container: graphContainer.value,
    ...props.config
  });
  
  updateGraph();
});

onUnmounted(() => {
  graph?.destroy();
});

watch(() => props.data, updateGraph, { deep: true });

const updateGraph = () => {
  if (graph && props.data) {
    graph.data(props.data);
    graph.render();
  }
};
</script>
```

### Angular 集成

```typescript
// G2 Angular 组件
import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from '@antv/g2';

@Component({
  selector: 'app-g2-chart',
  template: '<div #chartContainer></div>'
})
export class G2ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: any[] = [];
  @Input() config: any = {};
  
  private chart: Chart | null = null;

  ngOnInit() {
    this.chart = new Chart({
      container: this.chartContainer.nativeElement,
      ...this.config
    });
    
    this.updateChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private updateChart() {
    if (this.chart && this.data) {
      this.chart.clear();
      this.chart
        .interval()
        .data(this.data)
        .encode('x', 'name')
        .encode('y', 'value');
      this.chart.render();
    }
  }
}

// G6 Angular 组件
import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import G6 from '@antv/g6';

@Component({
  selector: 'app-g6-graph',
  template: '<div #graphContainer></div>'
})
export class G6GraphComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  @Input() data: any = {};
  @Input() config: any = {};
  
  private graph: any = null;

  ngOnInit() {
    this.graph = new G6.Graph({
      container: this.graphContainer.nativeElement,
      ...this.config
    });
    
    this.updateGraph();
  }

  ngOnDestroy() {
    this.graph?.destroy();
  }

  private updateGraph() {
    if (this.graph && this.data) {
      this.graph.data(this.data);
      this.graph.render();
    }
  }
}
```

## ⚡ 性能优化

### 🎯 G2 性能优化

```javascript
// 大数据量优化
const chart = new Chart({
  container: 'container',
  // 使用 Canvas 渲染器提高性能
  renderer: 'canvas',
  // 启用局部刷新
  localRefresh: true
});

  // 数据采样
chart
  .point()
  .data(largeDataset)
  .transform({ 
    type: 'sample', 
    size: 5000 // 采样到5000个点
  });

  // 关闭动画
chart
  .interval()
  .animate(false);

// 使用 Web Worker 处理数据
const worker = new Worker('data-processor.js');
worker.postMessage(rawData);
worker.onmessage = (e) => {
  chart.changeData(e.data);
};
```

### 🔗 G6 性能优化

```javascript
// 大图优化
const graph = new G6.Graph({
  container: 'container',
  // 启用 GPU 加速
  renderer: 'webgl',
  // 节点采样
  enabledStack: true,
  // 最大缩放比例
  maxZoom: 10,
  minZoom: 0.1,
  // 性能模式
  modes: {
    default: [
      {
        type: 'drag-canvas',
        enableOptimize: true // 启用拖拽优化
      },
      {
        type: 'zoom-canvas',
        enableOptimize: true, // 启用缩放优化
        optimizeZoom: 0.9
      }
    ]
  },
  // 节点层次渲染
  groupByTypes: false,
  // 边捆绑
  defaultEdge: {
    type: 'cubic-horizontal'
  }
});

// 大数据分页加载
const loadNodesByLevel = (level) => {
  const nodes = getNodesByLevel(level);
  graph.addItem('node', nodes);
};

// 视口裁剪
graph.on('viewportchange', () => {
  const viewport = graph.getViewPortBBox();
  const visibleNodes = getNodesInViewport(viewport);
  updateVisibleNodes(visibleNodes);
});
```

### 🗺️ L7 性能优化

```javascript
// 数据聚合
const clusterLayer = new PointLayer({
  cluster: true
})
  .source(data, {
    cluster: true,
    clusterRadius: 80,
    clusterMaxZoom: 15
  })
  .shape('circle')
  .size('point_count', [5, 15, 25, 35])
  .color('point_count', [
    '#51bbd6',
    '#f1f075',
    '#f28cb1',
    '#ff6b6b'
  ]);

// 瓦片优化
const heatmapLayer = new HeatmapLayer({
  workerEnabled: true // 启用 Web Worker
})
  .source(data)
  .shape('heatmap3D')
  .size('weight', [0, 1])
  .style({
    intensity: 2,
    radius: 20,
    rampColors: {
      colors: ['#f7acbc', '#ef5b9c', '#f05b72'],
      positions: [0, 0.5, 1.0]
    }
  });

// 数据更新优化
layer.setData(newData, {
  // 增量更新
  partial: true,
  // 动画过渡
  animateOption: {
    enable: true,
    duration: 500
  }
});
```

## 🔧 常见问题解决

### 1. 图表不显示

```javascript
// 确保容器存在且有尺寸
const container = document.getElementById('container');
if (!container) {
  console.error('Container not found');
  return;
}

// 设置容器尺寸
container.style.width = '600px';
container.style.height = '400px';

// 检查数据格式
console.log('Data:', data);
if (!data || !Array.isArray(data)) {
  console.error('Invalid data format');
  return;
}
```

### 2. 内存泄漏问题

```javascript
// 组件卸载时正确销毁实例
class ChartManager {
  constructor() {
    this.charts = new Map();
    this.graphs = new Map();
  }
  
  createChart(id, config) {
    const chart = new Chart(config);
    this.charts.set(id, chart);
    return chart;
  }
  
  createGraph(id, config) {
    const graph = new G6.Graph(config);
    this.graphs.set(id, graph);
    return graph;
  }
  
  destroy(id) {
    const chart = this.charts.get(id);
    const graph = this.graphs.get(id);
    
    if (chart) {
      chart.destroy();
      this.charts.delete(id);
    }
    
    if (graph) {
      graph.destroy();
      this.graphs.delete(id);
    }
  }
  
  destroyAll() {
    this.charts.forEach(chart => chart.destroy());
    this.graphs.forEach(graph => graph.destroy());
    this.charts.clear();
    this.graphs.clear();
  }
}
```

### 3. 响应式布局

```javascript
// 响应式图表
const createResponsiveChart = (container) => {
  const updateSize = () => {
    const rect = container.getBoundingClientRect();
    chart.changeSize(rect.width, rect.height);
  };
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateSize);
  
  // 使用 ResizeObserver 监听容器变化
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      chart.changeSize(width, height);
    }
  });
  
  resizeObserver.observe(container);
  
  return {
    chart,
    destroy() {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
      chart.destroy();
    }
  };
};
```

### 4. 主题切换

```javascript
// 动态主题切换
const themes = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    gridColor: '#f0f0f0'
  },
  dark: {
    backgroundColor: '#1f1f1f',
    textColor: '#ffffff',
    gridColor: '#333333'
  }
};

const switchTheme = (themeName) => {
  const theme = themes[themeName];
  
  // G2 主题切换
  chart.theme(theme);
  
  // G6 主题切换
  graph.updateItem('node', {
    style: {
      fill: theme.backgroundColor,
      stroke: theme.textColor
    }
  });
  
  // 更新容器样式
  document.body.style.backgroundColor = theme.backgroundColor;
  document.body.style.color = theme.textColor;
};
```

## 🎯 最佳实践

### 📋 项目结构

```
src/
├── components/
│   ├── Charts/
│   │   ├── G2Chart.tsx
│   │   ├── G6Graph.tsx
│   │   └── S2Table.tsx
│   └── Maps/
│       └── L7Map.tsx
├── utils/
│   ├── chartConfig.ts
│   ├── graphLayouts.ts
│   └── mapLayers.ts
├── themes/
│   ├── light.ts
│   └── dark.ts
└── types/
    └── antv.d.ts
```

### 🎨 配置管理

```javascript
// chartConfig.js
export const chartDefaults = {
  padding: [20, 40, 50, 40],
  theme: 'light',
  animation: true
};

export const graphDefaults = {
  layout: {
    type: 'force',
    preventOverlap: true
  },
  modes: {
    default: ['drag-canvas', 'zoom-canvas']
  }
};

export const mapDefaults = {
  zoom: 3,
  center: [120, 30],
  pitch: 0
};
```

### 📊 数据处理

```javascript
// 数据标准化
export const normalizeChartData = (rawData) => {
  return rawData.map(item => ({
    name: item.label || item.name,
    value: Number(item.value) || 0,
    category: item.type || 'default'
  }));
};

// 图数据处理
export const normalizeGraphData = (nodes, edges) => {
  const nodeMap = new Map();
  
  const processedNodes = nodes.map(node => {
    const processed = {
      id: node.id,
      label: node.name || node.label,
      ...node
    };
    nodeMap.set(node.id, processed);
    return processed;
  });
  
  const processedEdges = edges.filter(edge => 
    nodeMap.has(edge.source) && nodeMap.has(edge.target)
  );
  
  return { nodes: processedNodes, edges: processedEdges };
};
```

### 🔄 状态管理

```javascript
// 使用 Context 管理可视化状态
import React, { createContext, useContext, useReducer } from 'react';

const VisualizationContext = createContext();

const visualizationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'UPDATE_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const VisualizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visualizationReducer, {
    theme: 'light',
    data: null,
    loading: false
  });
  
  return (
    <VisualizationContext.Provider value={{ state, dispatch }}>
      {children}
    </VisualizationContext.Provider>
  );
};

export const useVisualization = () => {
  const context = useContext(VisualizationContext);
  if (!context) {
    throw new Error('useVisualization must be used within VisualizationProvider');
  }
  return context;
};
```

## 📚 扩展资源

### 官方文档

- [G2 文档](https://g2.antv.antgroup.com/)
- [G6 文档](https://g6.antv.antgroup.com/)
- [X6 文档](https://x6.antv.antgroup.com/)
- [L7 文档](https://l7.antv.antgroup.com/)
- [S2 文档](https://s2.antv.antgroup.com/)

### 示例和教程

- [AntV 示例中心](https://antv.antgroup.com/examples)
- [Observable 示例](https://observablehq.com/@antv)
- [CodeSandbox 模板](https://codesandbox.io/s/antv-templates)

### 社区资源

- [GitHub 组织](https://github.com/antvis)
- [语雀文档](https://www.yuque.com/antv)
- [钉钉用户群](https://qr.dingtalk.com/action/joingroup?code=v1,k1,cK0REo8+6xPdq64bBHmgC96PQ9ypfgHGSKpv8Ay=)

### 相关工具

- **AntV 设计原则**: [设计语言](https://antv.antgroup.com/spec/principles)
- **颜色计算器**: [颜色工具](https://antv.antgroup.com/colors)
- **图表选择器**: [图表建议](https://chartcube.alipay.com/)

::: tip 💡 开发建议
1. 根据数据规模选择合适的产品（G2 适合中小型数据，L7 适合地理大数据）
2. 合理使用动画和交互，避免过度设计影响性能
3. 注意移动端适配，特别是触控交互的优化
4. 充分利用 AntV 的生态系统，避免重复造轮子
5. 关注官方更新，及时升级版本获取新特性和性能优化
:::

---

*最后更新: 2024年12月*
