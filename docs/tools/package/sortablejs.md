---
title: SortableJS 完全指南
description: 全面介绍 SortableJS 拖放排序库的使用方法、配置选项、事件处理和高级功能，帮助开发者轻松实现拖拽排序功能
outline: deep
---

# 📋 SortableJS 完全指南

SortableJS 是一个功能强大的 JavaScript 库，用于创建可拖拽排序的列表和网格。它支持现代浏览器，无需依赖 jQuery 或其他框架，同时提供了与主流前端框架的集成。

::: tip 📚 本章内容
全面了解 SortableJS 的核心功能、配置选项、事件处理和高级应用，掌握如何在各种场景下实现流畅的拖拽排序交互。
:::

## 1. SortableJS 简介

### 1.1 什么是 SortableJS

SortableJS 是一个轻量级的 JavaScript 库，专注于提供高性能的拖放排序功能。它允许用户通过拖拽操作重新排列列表、网格或树形结构中的元素，支持触摸设备和现代浏览器，无需任何依赖。

### 1.2 主要特性

- **无依赖**：纯 JavaScript 实现，不依赖 jQuery 或其他库
- **高性能**：经过优化的拖放算法，确保流畅的用户体验
- **跨浏览器兼容**：支持所有现代浏览器和 IE9+
- **触摸支持**：适用于移动设备和触摸屏
- **多种拖放模式**：支持列表、网格和嵌套结构
- **拖放动画**：平滑的拖放过渡效果
- **可扩展**：通过插件系统扩展功能
- **框架集成**：提供 React、Vue、Angular 等主流框架的集成方案

### 1.3 适用场景

- **可排序列表**：任务列表、待办事项、排名列表
- **拖拽网格**：看板、仪表盘小部件
- **嵌套结构**：树形菜单、文件夹结构
- **多列布局**：看板视图（如 Trello）
- **拖放上传**：文件上传界面
- **拖拽表单构建器**：动态表单生成工具

## 2. 安装与基本使用

### 2.1 安装方法

#### 2.1.1 使用 NPM 或 Yarn

```bash
# 使用 npm
npm install sortablejs --save

# 使用 yarn
yarn add sortablejs
```

#### 2.1.2 使用 CDN

```html
<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
<!-- 或 -->
<script src="https://unpkg.com/sortablejs@latest/Sortable.min.js"></script>
```

### 2.2 基本用法

#### 2.2.1 HTML 结构

```html
<ul id="sortable-list">
  <li>项目 1</li>
  <li>项目 2</li>
  <li>项目 3</li>
  <li>项目 4</li>
  <li>项目 5</li>
</ul>
```

#### 2.2.2 JavaScript 初始化

```javascript
// 使用 ES 模块
import Sortable from 'sortablejs';

// 或使用 CommonJS
// const Sortable = require('sortablejs');

// 初始化 Sortable
const sortableList = document.getElementById('sortable-list');
const sortable = new Sortable(sortableList, {
  animation: 150, // 动画速度，单位为毫秒
  ghostClass: 'sortable-ghost', // 拖动时应用于元素的类名
  chosenClass: 'sortable-chosen', // 选中元素时应用的类名
  dragClass: 'sortable-drag', // 拖动时应用于克隆元素的类名
});
```

#### 2.2.3 基本 CSS 样式

```css
.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.sortable-chosen {
  color: #fff;
  background-color: #3498db;
}

.sortable-drag {
  opacity: 0.8;
  background-color: #daf4ff;
}
```

## 3. 配置选项详解

SortableJS 提供了丰富的配置选项，可以根据需求进行自定义。

### 3.1 核心选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `group` | `String` 或 `Object` | `undefined` | 用于连接多个列表的组名或配置对象 |
| `sort` | `Boolean` | `true` | 是否允许列表内排序 |
| `delay` | `Number` | `0` | 开始拖动前的延迟时间（毫秒） |
| `delayOnTouchOnly` | `Boolean` | `false` | 是否仅在触摸设备上应用延迟 |
| `touchStartThreshold` | `Number` | `0` | 触摸设备上开始拖动的像素阈值 |
| `disabled` | `Boolean` | `false` | 是否禁用排序功能 |
| `animation` | `Number` | `0` | 排序动画的持续时间（毫秒） |
| `easing` | `String` | `null` | 动画缓动函数（如 "cubic-bezier(1, 0, 0, 1)"） |
| `handle` | `String` | `null` | 拖动把手选择器（如 ".handle"） |
| `filter` | `String` | `null` | 不可拖动元素的选择器（如 ".nodrag"） |
| `preventOnFilter` | `Boolean` | `true` | 是否阻止被过滤元素的 `mousedown` 事件 |
| `draggable` | `String` | `undefined` | 指定可拖动元素的选择器（默认为所有子元素） |

### 3.2 高级选项

```javascript
const sortable = new Sortable(element, {
  // 组配置（用于连接多个列表）
  group: {
    name: 'shared',
    pull: true,  // true/false/'clone'/'function'
    put: true,   // true/false/['group1']/function
    revertClone: false,
  },
  
  // 排序约束
  sort: true,  // 允许排序
  direction: 'vertical', // 'vertical'/'horizontal'
  
  // 拖动行为
  swapThreshold: 1, // 交换元素的阈值（0-1）
  invertSwap: false, // 是否反转交换区域
  invertedSwapThreshold: 1, // 反转交换的阈值
  
  // 多列表排序
  multiDrag: false, // 启用多元素拖动
  selectedClass: 'selected', // 多选时应用的类名
  fallbackTolerance: 0, // 触摸设备上拖动的容差像素
  
  // 自动滚动
  scrollSensitivity: 30, // 靠近边缘多少像素时开始滚动
  scrollSpeed: 10, // 滚动速度
  
  // 事件回调
  onStart: function(evt) { /* ... */ },
  onEnd: function(evt) { /* ... */ },
  onAdd: function(evt) { /* ... */ },
  onUpdate: function(evt) { /* ... */ },
  onSort: function(evt) { /* ... */ },
  onRemove: function(evt) { /* ... */ },
  onChange: function(evt) { /* ... */ },
  
  // 自定义函数
  setData: function(dataTransfer, dragEl) { /* ... */ },
  onChoose: function(evt) { /* ... */ },
  onUnchoose: function(evt) { /* ... */ },
  onMove: function(evt, originalEvent) { /* ... */ },
  onClone: function(evt) { /* ... */ },
});
```

## 4. 事件处理

SortableJS 提供了多种事件回调，用于响应拖放过程中的不同阶段。

### 4.1 主要事件

```javascript
const sortable = new Sortable(element, {
  // 开始拖动时触发
  onStart: function(evt) {
    const { item, from } = evt;
    console.log('开始拖动:', item);
    console.log('来源容器:', from);
  },
  
  // 拖动结束时触发
  onEnd: function(evt) {
    const { item, to, from, oldIndex, newIndex } = evt;
    console.log(`元素从索引 ${oldIndex} 移动到索引 ${newIndex}`);
    console.log('目标容器:', to);
  },
  
  // 元素添加到列表时触发（从另一个列表）
  onAdd: function(evt) {
    const { item, to, from, oldIndex, newIndex } = evt;
    console.log(`元素从 ${from.id} 添加到 ${to.id}`);
  },
  
  // 列表内元素顺序变更时触发
  onUpdate: function(evt) {
    const { item, oldIndex, newIndex } = evt;
    console.log(`元素从索引 ${oldIndex} 更新到索引 ${newIndex}`);
  },
  
  // 元素从列表中移除时触发（到另一个列表）
  onRemove: function(evt) {
    const { item, from, oldIndex } = evt;
    console.log(`元素从 ${from.id} 的索引 ${oldIndex} 处移除`);
  },
});
```

### 4.2 事件对象属性

| 属性 | 描述 |
|------|------|
| `to` | 目标列表元素 |
| `from` | 源列表元素 |
| `item` | 被拖动的元素 |
| `clone` | 克隆的元素（如果使用 `clone: true`） |
| `oldIndex` | 元素在源列表中的索引 |
| `newIndex` | 元素在目标列表中的索引 |
| `oldDraggableIndex` | 考虑只有可拖动项的旧索引 |
| `newDraggableIndex` | 考虑只有可拖动项的新索引 |
| `pullMode` | 从源列表拉取的模式（`'clone'` 或 `true`） |

### 4.3 自定义拖动逻辑

使用 `onMove` 回调可以自定义何时允许移动元素：

```javascript
const sortable = new Sortable(element, {
  onMove: function(evt, originalEvent) {
    // evt.dragged - 拖动的元素
    // evt.related - 拖动元素下方的元素
    // evt.to - 目标列表
    // evt.from - 源列表
    
    // 返回 false 阻止移动
    if (evt.related.classList.contains('locked')) {
      return false;
    }
    
    // 返回 -1 插入到相关元素之前
    // 返回 1 插入到相关元素之后
    // 返回 true 使用默认行为
    return true;
  }
});
```

## 5. 多列表拖放

SortableJS 支持在多个列表之间拖放元素，实现更复杂的交互。

### 5.1 基本多列表配置

```html
<div id="list1" class="list">
  <div>项目 1-1</div>
  <div>项目 1-2</div>
  <div>项目 1-3</div>
</div>

<div id="list2" class="list">
  <div>项目 2-1</div>
  <div>项目 2-2</div>
  <div>项目 2-3</div>
</div>
```

```javascript
// 初始化两个列表，共享同一个组
new Sortable(document.getElementById('list1'), {
  group: 'shared', // 设置相同的组名
  animation: 150
});

new Sortable(document.getElementById('list2'), {
  group: 'shared', // 设置相同的组名
  animation: 150
});
```

### 5.2 高级组配置

```javascript
// 源列表：允许拖出，但不允许拖入
new Sortable(document.getElementById('source'), {
  group: {
    name: 'advanced',
    pull: 'clone', // 克隆元素而不是移动
    put: false // 不允许从其他列表拖入
  },
  sort: false, // 禁止在此列表内排序
  animation: 150
});

// 目标列表：允许拖入，但不允许拖出
new Sortable(document.getElementById('target'), {
  group: {
    name: 'advanced',
    pull: false, // 不允许拖出到其他列表
    put: true // 允许从其他列表拖入
  },
  animation: 150
});
```

## 6. 框架集成

### 6.1 Vue 集成

使用官方的 `vuedraggable` 组件：

```vue
<template>
  <div>
    <h3>任务列表</h3>
    <draggable 
      v-model="tasks" 
      group="tasks"
      @start="drag=true" 
      @end="drag=false"
      item-key="id"
    >
      <template #item="{element}">
        <div class="task-item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      drag: false,
      tasks: [
        { id: 1, name: '完成报告' },
        { id: 2, name: '准备演示' },
        { id: 3, name: '客户会议' },
        { id: 4, name: '更新文档' }
      ]
    };
  }
};
</script>
```

### 6.2 React 集成

使用 `react-sortablejs`：

```jsx
import React, { useState } from 'react';
import { ReactSortable } from "react-sortablejs";

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, name: '完成报告' },
    { id: 2, name: '准备演示' },
    { id: 3, name: '客户会议' },
    { id: 4, name: '更新文档' }
  ]);

  return (
    <div>
      <h3>任务列表</h3>
      <ReactSortable
        list={tasks}
        setList={setTasks}
        animation={150}
        group="tasks"
      >
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            {task.name}
          </div>
        ))}
      </ReactSortable>
    </div>
  );
}
```

## 7. 高级功能与技巧

### 7.1 嵌套列表

创建嵌套的可排序列表，如树形结构：

```javascript
// 递归初始化所有嵌套列表
function initNestedSortable(element) {
  new Sortable(element, {
    group: 'nested',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65
  });
  
  // 递归初始化子列表
  Array.from(element.children).forEach(item => {
    const nestedList = item.querySelector('.list-group');
    if (nestedList) {
      initNestedSortable(nestedList);
    }
  });
}

// 初始化根列表
initNestedSortable(document.getElementById('nested-sortable'));
```

### 7.2 多元素拖动

启用同时选择和拖动多个元素：

```javascript
new Sortable(element, {
  multiDrag: true, // 启用多元素拖动
  selectedClass: 'selected', // 选中元素的类名
  animation: 150
});
```

### 7.3 自动滚动

在大型列表中启用自动滚动功能：

```javascript
new Sortable(element, {
  animation: 150,
  scroll: true, // 启用自动滚动
  scrollSensitivity: 30, // 距离边缘多少像素时开始滚动
  scrollSpeed: 10 // 滚动速度
});
```

### 7.4 保存排序状态

使用 `store` 选项保存和恢复排序状态：

```javascript
new Sortable(element, {
  group: 'localStorage-example',
  store: {
    // 获取排序
    get: function(sortable) {
      const order = localStorage.getItem(sortable.options.group.name);
      return order ? order.split('|') : [];
    },
    
    // 保存排序
    set: function(sortable) {
      const order = sortable.toArray();
      localStorage.setItem(sortable.options.group.name, order.join('|'));
    }
  },
  
  // 为每个项目生成唯一 ID
  dataIdAttr: 'data-id'
});
```

## 8. 性能优化

### 8.1 大型列表优化

处理大型列表时的性能优化技巧：

1. **使用 `delayOnTouchOnly` 和适当的 `delay`**
2. **限制拖动方向**（使用 `direction` 选项）
3. **使用虚拟滚动**结合虚拟滚动库
4. **优化 DOM 结构**减少每个项目的复杂性
5. **使用 `debounce` 处理回调**避免频繁操作

### 8.2 移动设备优化

针对移动设备的优化建议：

1. **增加触摸延迟**（使用 `delay` 和 `delayOnTouchOnly`）
2. **使用适当的拖动手柄**（使用 `handle` 选项）
3. **增大可点击区域**便于触摸操作
4. **添加视觉反馈**（使用自定义类和动画）

## 9. 常见问题与解决方案

### 9.1 问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 无法拖动元素 | 1. 元素被 `filter` 选项过滤<br>2. 未正确设置 `handle` | 1. 检查 `filter` 选择器<br>2. 确保 `handle` 选择器正确 |
| 拖动位置不正确 | 1. CSS 定位问题<br>2. 滚动容器配置错误 | 1. 检查 CSS 定位属性<br>2. 正确设置 `scroll` 选项 |
| 性能问题 | 1. 列表项过多<br>2. 复杂的 DOM 结构 | 1. 使用虚拟滚动<br>2. 简化 DOM 结构 |

### 9.2 常见用例解决方案

#### 9.2.1 禁止特定项目拖动

```javascript
new Sortable(document.getElementById('sortable'), {
  filter: '.no-drag',
  preventOnFilter: false // 允许在不可拖动项上点击
});
```

#### 9.2.2 保存排序顺序到服务器

```javascript
new Sortable(element, {
  onEnd: function(evt) {
    if (evt.oldIndex !== evt.newIndex) {
      const itemIds = Array.from(evt.to.children).map(el => el.dataset.id);
      
      // 发送到服务器
      fetch('/api/update-order', {
        method: 'POST',
        body: JSON.stringify({ itemIds })
      });
    }
  }
});
```

## 10. 参考资源

- [SortableJS 官方文档](https://github.com/SortableJS/Sortable)
- [SortableJS 演示](https://sortablejs.github.io/Sortable/)
- [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)
- [React-Sortablejs](https://github.com/SortableJS/react-sortablejs)