---
title: 📊 ECharts 数据可视化图表库完全指南
description: Apache ECharts 是一个基于 JavaScript 的开源可视化图表库，提供丰富的图表类型和强大的交互功能，支持折线图、柱状图、饼图、地图等多种图表类型
outline: deep
---

# 📊 ECharts 数据可视化图表库完全指南

> Apache ECharts 是一个基于 JavaScript 的开源可视化图表库，提供了丰富的图表类型和强大的交互功能。

::: info 📚 官方资源
- **官网**: [https://echarts.apache.org](https://echarts.apache.org)
- **GitHub**: [https://github.com/apache/echarts](https://github.com/apache/echarts)
- **文档**: [https://echarts.apache.org/handbook/zh/](https://echarts.apache.org/handbook/zh/)
- **示例**: [https://echarts.apache.org/examples/zh/](https://echarts.apache.org/examples/zh/)
:::

<details>
<summary>📋 目录导航</summary>

[[toc]]

</details>

## 🎯 ECharts 简介

Apache ECharts 是一个使用 JavaScript 实现的开源可视化库，提供直观、交互丰富、可高度个性化定制的数据可视化图表。

### 核心特性

- **丰富的图表类型**: 折线图、柱状图、散点图、饼图、K线图、盒形图等
- **强大的交互能力**: 数据筛选、范围缩放、图表联动等
- **多种数据格式**: 支持数组、对象等多种数据格式
- **移动端优化**: 支持移动端的触摸操作
- **多渲染方案**: Canvas、SVG、VML 多种渲染方案
- **深度定制**: 支持千人千面的定制化需求

### 版本选择

| 版本 | 特点 | 适用场景 |
|------|------|----------|
| ECharts 5.x | 最新版本，性能优化 | 新项目推荐 |
| ECharts 4.x | 稳定版本，社区成熟 | 维护项目 |

## 🚀 安装与配置

### NPM 安装

```bash
# 完整版本
npm install echarts

# 或使用 yarn
yarn add echarts

# 或使用 pnpm
pnpm add echarts
```

### CDN 引入

```html
<!-- 最新版本 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>

<!-- 指定版本 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
```

### 模块引入方式

#### 全部引入

```javascript
// 引入完整的 echarts
import * as echarts from 'echarts';

// 基于准备好的dom，初始化echarts实例
const myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
const option = {
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
};

// 使用刚指定的配置项和数据显示图表
myChart.setOption(option);
```

#### 按需引入（推荐）

```javascript
// 引入 echarts 核心模块
import * as echarts from 'echarts/core';

// 引入柱状图
import { BarChart } from 'echarts/charts';

// 引入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';

// 引入特性
import { LabelLayout, UniversalTransition } from 'echarts/features';

// 引入 Canvas 渲染器
import { CanvasRenderer } from 'echarts/renderers';

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
  LegendComponent
]);

// 初始化图表
const myChart = echarts.init(document.getElementById('main'));
```

## 📊 常用图表类型

### 1. 折线图 (Line Chart)

```javascript
const lineOption = {
  title: {
    text: '用户增长趋势'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增用户', '活跃用户']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '活跃用户',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
};
```

### 2. 柱状图 (Bar Chart)

```javascript
const barOption = {
  title: {
    text: '销售数据统计'
  },
  color: ['#3398DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '销量',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }
  ]
};
```

### 3. 饼图 (Pie Chart)

```javascript
const pieOption = {
  title: {
    text: '访问来源',
    subtext: '纯属虚构',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
```

### 4. 散点图 (Scatter Chart)

```javascript
const scatterOption = {
  title: {
    text: '身高体重分布'
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return params.seriesName + '<br/>' +
             '身高: ' + params.value[0] + 'cm<br/>' +
             '体重: ' + params.value[1] + 'kg';
    }
  },
  xAxis: {
    type: 'value',
    name: '身高(cm)',
    scale: true
  },
  yAxis: {
    type: 'value',
    name: '体重(kg)',
    scale: true
  },
  series: [{
    name: '身高体重',
    type: 'scatter',
    data: [
      [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0],
      [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8]
    ]
  }]
};
```

## ⚙️ 高级配置

### 完整的配置选项示例

```javascript
const complexOption = {
  // 标题组件
  title: {
    show: true,
    text: '主标题',
    subtext: '副标题',
    left: 'center',
    top: 'top',
    textStyle: {
      color: '#333',
      fontSize: 18,
      fontWeight: 'normal'
    },
    subtextStyle: {
      color: '#666',
      fontSize: 12
    }
  },

  // 图例组件
  legend: {
    type: 'plain',
    show: true,
    orient: 'horizontal',
    left: 'center',
    top: 'bottom',
    textStyle: {
      color: '#333',
      fontSize: 12
    },
    data: ['系列1', '系列2']
  },

  // 工具箱
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {
        title: '保存为图片'
      },
      dataView: {
        title: '数据视图',
        readOnly: false
      },
      magicType: {
        title: {
          line: '切换为折线图',
          bar: '切换为柱状图'
        },
        type: ['line', 'bar']
      },
      restore: {
        title: '还原'
      },
      dataZoom: {
        title: {
          zoom: '区域缩放',
          back: '区域缩放还原'
        }
      }
    }
  },

  // 提示框组件
  tooltip: {
    show: true,
    trigger: 'item', // 'item' | 'axis' | 'none'
    triggerOn: 'mousemove', // 'mousemove' | 'click' | 'mousemove|click'
    formatter: function (params) {
      return params.marker + params.name + ': ' + params.value;
    },
    backgroundColor: 'rgba(50,50,50,0.7)',
    borderColor: '#333',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
      fontSize: 14
    }
  },

  // 数据集
  dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 }
    ]
  },

  // 网格布局
  grid: {
    show: false,
    left: '10%',
    top: 60,
    right: '10%',
    bottom: 60,
    containLabel: false
  },

  // X轴配置
  xAxis: {
    type: 'category',
    name: 'X轴',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#333',
      fontSize: 12
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#333'
      }
    },
    axisTick: {
      show: true,
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      interval: 'auto',
      rotate: 0,
      formatter: '{value}'
    },
    splitLine: {
      show: false
    }
  },

  // Y轴配置
  yAxis: {
    type: 'value',
    name: 'Y轴',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#333',
      fontSize: 12
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#333'
      }
    },
    axisTick: {
      show: true
    },
    axisLabel: {
      show: true,
      formatter: '{value}'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#e0e0e0',
        type: 'solid'
      }
    }
  },

  // 数据缩放
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      type: 'slider',
      start: 0,
      end: 100,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }
  ],

  // 视觉映射
  visualMap: {
    type: 'continuous',
    min: 0,
    max: 100,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['lightskyblue', 'yellow', 'orangered']
    }
  },

  // 系列配置
  series: [
    {
      name: '数据系列',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      }
    }
  ]
};
```

## 🎨 主题和样式

### 内置主题

```javascript
// 使用内置主题
const chart = echarts.init(dom, 'dark'); // 'light', 'dark'

// 注册自定义主题
echarts.registerTheme('myTheme', {
  color: [
    '#c23531', '#2f4554', '#61a0a8', '#d48265',
    '#91c7ae', '#749f83', '#ca8622', '#bda29a'
  ],
  backgroundColor: '#f4f4f4',
  textStyle: {},
  title: {
    textStyle: {
      color: '#333333'
    },
    subtextStyle: {
      color: '#aaaaaa'
    }
  }
});

// 使用自定义主题
const chart = echarts.init(dom, 'myTheme');
```

### 自定义样式

```javascript
// 颜色渐变
const gradientColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: '#83bff6' },
  { offset: 0.5, color: '#188df0' },
  { offset: 1, color: '#188df0' }
]);

// 阴影效果
const shadowStyle = {
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowBlur: 10,
  shadowOffsetX: 5,
  shadowOffsetY: 5
};

// 动画配置
const animationConfig = {
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: function (idx) {
    return idx * 100;
  }
};
```

## 🔄 框架集成

### Vue 3 集成

```vue
<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let myChart = null

const option = {
  title: { text: 'Vue 3 + ECharts' },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
}

onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(chartRef.value)
    myChart.setOption(option)
    
    // 响应式调整
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}
</script>
```

### React 集成

```jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);
    
    const option = {
      title: { text: 'React + ECharts' },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default EChartsComponent;
```

### Angular 集成

```typescript
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-echarts',
  template: `<div #chartContainer style="width: 600px; height: 400px;"></div>`
})
export class EChartsComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private myChart: any;

  ngOnInit() {
    this.myChart = echarts.init(this.chartContainer.nativeElement);
    
    const option = {
      title: { text: 'Angular + ECharts' },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    this.myChart.setOption(option);
  }

  ngOnDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
  }
}
```

## ⚡ 性能优化

### 1. 按需引入优化

```javascript
// 只引入需要的组件
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { 
  TitleComponent, 
  TooltipComponent, 
  GridComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer
]);
```

### 2. 大数据优化

```javascript
// 开启数据采样
const option = {
  series: [{
    type: 'line',
    sampling: 'lttb', // 开启采样，大数据量时优化性能
    data: largeDataArray
  }]
};

// 使用虚拟滚动
const option = {
  dataZoom: [{
    type: 'inside',
    start: 0,
    end: 20 // 只显示20%的数据
  }]
};
```

### 3. 渲染优化

```javascript
// 使用 SVG 渲染器（适合图表较少的场景）
const chart = echarts.init(dom, null, {
  renderer: 'svg'
});

// 禁用动画（提高性能）
const option = {
  animation: false,
  series: [{
    type: 'bar',
    large: true, // 开启大数据量优化
    data: data
  }]
};
```

### 4. 内存管理

```javascript
// 正确销毁图表实例
const destroyChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
};

// 响应式处理
const resizeChart = () => {
  if (myChart) {
    myChart.resize();
  }
};

window.addEventListener('resize', resizeChart);

// 组件卸载时清理
window.removeEventListener('resize', resizeChart);
destroyChart();
```

## 📱 响应式设计

### 1. 容器响应式

```javascript
// 基础响应式配置
const option = {
  grid: {
    left: '10%',
    right: '10%',
    top: '15%',
    bottom: '15%',
    containLabel: true
  },
  // 使用媒体查询
  media: [
    {
      query: {
        maxWidth: 768
      },
      option: {
        grid: {
          left: '5%',
          right: '5%'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0
        }
      }
    }
  ]
};
```

### 2. 动态调整

```javascript
// 根据容器大小动态调整
const updateChart = () => {
  const container = document.getElementById('chart-container');
  const width = container.offsetWidth;
  
  let option = {};
  
  if (width < 600) {
    // 移动端配置
    option = {
      title: { textStyle: { fontSize: 14 } },
      legend: { textStyle: { fontSize: 12 } },
      tooltip: { textStyle: { fontSize: 12 } }
    };
  } else {
    // 桌面端配置
    option = {
      title: { textStyle: { fontSize: 18 } },
      legend: { textStyle: { fontSize: 14 } },
      tooltip: { textStyle: { fontSize: 14 } }
    };
  }
  
  myChart.setOption(option);
};

// 监听窗口大小变化
window.addEventListener('resize', () => {
  updateChart();
  myChart.resize();
});
```

## 🔧 常见问题解决

### 1. 图表不显示

```javascript
// 确保容器有明确的宽高
const container = document.getElementById('chart');
container.style.width = '600px';
container.style.height = '400px';

// 或在CSS中设置
```

```css
#chart {
  width: 600px;
  height: 400px;
}
```

### 2. 数据更新

```javascript
// 方法1: 重新设置完整配置
myChart.setOption(newOption);

// 方法2: 只更新数据部分
myChart.setOption({
  series: [{
    data: newData
  }]
});

// 方法3: 增量更新
myChart.setOption(newOption, false); // 第二个参数为false表示增量更新
```

### 3. 内存泄漏防护

```javascript
class ChartManager {
  constructor() {
    this.charts = new Map();
  }
  
  createChart(id, option) {
    const container = document.getElementById(id);
    const chart = echarts.init(container);
    chart.setOption(option);
    
    this.charts.set(id, chart);
    return chart;
  }
  
  destroyChart(id) {
    const chart = this.charts.get(id);
    if (chart) {
      chart.dispose();
      this.charts.delete(id);
    }
  }
  
  destroyAll() {
    this.charts.forEach(chart => chart.dispose());
    this.charts.clear();
  }
}
```

### 4. 事件处理

```javascript
// 监听图表事件
myChart.on('click', function (params) {
  console.log('点击了数据项:', params);
});

// 监听鼠标事件
myChart.on('mouseover', function (params) {
  console.log('鼠标悬停:', params);
});

// 监听图表完成渲染事件
myChart.on('finished', function () {
  console.log('图表渲染完成');
});

// 取消事件监听
myChart.off('click');
```

## 🎯 最佳实践

### 1. 项目结构

```
src/
├── components/
│   ├── Chart/
│   │   ├── BaseChart.vue
│   │   ├── LineChart.vue
│   │   ├── BarChart.vue
│   │   └── PieChart.vue
├── utils/
│   └── echarts.js
└── styles/
    └── chart.scss
```

### 2. 配置管理

```javascript
// utils/echarts.js
export const defaultTheme = {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#ffffff',
  textStyle: {
    fontFamily: 'Arial, sans-serif'
  }
};

export const mobileTheme = {
  ...defaultTheme,
  textStyle: {
    fontSize: 12
  }
};

export const chartDefaults = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  }
};
```

### 3. 组件封装

```vue
<!-- BaseChart.vue -->
<template>
  <div 
    ref="chartRef" 
    :style="{ width: width, height: height }"
    class="chart-container"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: Object,
  width: { type: String, default: '100%' },
  height: { type: String, default: '400px' },
  theme: String
})

const chartRef = ref(null)
let myChart = null

const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value, props.theme)
    myChart.setOption(props.option)
  }
}

const resizeChart = () => {
  if (myChart) {
    myChart.resize()
  }
}

watch(() => props.option, (newOption) => {
  if (myChart && newOption) {
    myChart.setOption(newOption)
  }
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
.chart-container {
  min-height: 300px;
}
</style>
```

### 4. 类型定义 (TypeScript)

```typescript
// types/echarts.ts
export interface ChartOption {
  title?: any;
  tooltip?: any;
  legend?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  series?: any[];
  [key: string]: any;
}

export interface ChartProps {
  option: ChartOption;
  width?: string;
  height?: string;
  theme?: string;
  loading?: boolean;
}

export interface ChartInstance {
  setOption: (option: ChartOption) => void;
  resize: () => void;
  dispose: () => void;
  on: (eventName: string, handler: Function) => void;
  off: (eventName: string) => void;
}
```

## 📚 扩展资源

### 官方文档

- [ECharts 官方文档](https://echarts.apache.org/handbook/zh/)
- [配置项手册](https://echarts.apache.org/option.html)
- [API 文档](https://echarts.apache.org/api.html)

### 社区资源

- [ECharts Gallery](https://gallery.echartsjs.com/explore.html)
- [GitHub Issues](https://github.com/apache/echarts/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/echarts)

### 相关工具

- **ECharts-for-React**: React 组件库
- **vue-echarts**: Vue 组件库
- **ngx-echarts**: Angular 组件库
- **echarts-liquidfill**: 水球图插件
- **echarts-wordcloud**: 词云图插件

::: tip 💡 开发建议
1. 优先使用按需引入减少包体积
2. 合理使用图表缓存避免重复渲染
3. 注意移动端适配和响应式设计
4. 及时销毁图表实例防止内存泄漏
5. 使用官方示例作为开发参考
:::

---

*最后更新: 2024年12月*
