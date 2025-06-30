---
title: 🧩 uni-app 组件库完全指南
description: 深入掌握 uni-app 内置组件，包括基础内容、视图容器、表单组件、导航组件等，构建丰富的用户界面
outline: deep
---

# 🧩 uni-app 组件库完全指南

> 全面掌握 uni-app 提供的丰富组件库，从基础的文本、图标到复杂的列表、滑块容器，让你的应用界面更加丰富多彩。

::: tip 📚 本章内容
详细介绍 uni-app 的各类内置组件，包含属性说明、使用示例和最佳实践。
:::

## 📝 基础内容组件

### 🔤 文本组件

#### 📄 text 组件

**文本显示组件，用于展示文本内容。**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **selectable** | Boolean | false | 🎯 文本是否可选中 |
| **space** | String | - | 📐 连续空格显示方式 |
| **decode** | Boolean | false | 🔄 是否解码HTML实体 |

**space 属性值：**
- `ensp` - 中文字符空格一半大小
- `emsp` - 中文字符空格大小  
- `nbsp` - 根据字体设置的空格大小

#### 🎨 icon 组件

**图标组件，用于显示各种图标。**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **type** | String | - | 🎯 图标类型 |
| **size** | Number | 23 | 📏 图标大小（px） |
| **color** | String | - | 🎨 图标颜色 |

**type 属性值：**

| 图标类型 | 描述 | 使用场景 |
|----------|------|----------|
| **success** | 成功图标 | ✅ 操作成功提示 |
| **success_no_circle** | 无圆圈成功图标 | ✅ 简洁成功状态 |
| **warn** | 警告图标 | ⚠️ 警告提示 |
| **waiting** | 等待图标 | ⏳ 加载状态 |
| **cancel** | 取消图标 | ❌ 取消操作 |
| **download** | 下载图标 | 📥 下载功能 |
| **search** | 搜索图标 | 🔍 搜索功能 |
| **clear** | 清除图标 | 🧹 清空内容 |

#### 📄 rich-text 组件

**富文本组件，可渲染文字样式、图片、超链接，支持部分 HTML 标签。**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **nodes** | Array/String | - | 🎯 节点列表或HTML字符串 |
| **selectable** | Boolean | false | 📝 文本是否可选 |

**事件：**
- `@itemclick` - 拦截点击事件

#### 📊 progress 组件

**进度条组件，用于显示任务进度。**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **percent** | Number | 0 | 📊 百分比（0-100） |
| **duration** | Number | 30 | ⏱️ 进度增加1%所需毫秒数 |
| **show-info** | Boolean | false | 📝 是否显示百分比文字 |
| **border-radius** | Number | 0 | 🎨 圆角大小 |
| **font-size** | Number | 16 | 📏 百分比字体大小 |
| **stroke-width** | Number | 6 | 📏 进度条线宽 |
| **activeColor** | String | #09BB07 | 🎨 已选择进度条颜色 |
| **backgroundColor** | String | #EBEBEB | 🎨 未选择进度条颜色 |
| **active** | Boolean | false | 🎬 是否显示动画 |
| **active-mode** | String | backwards | 🎭 动画模式 |

**active-mode 属性值：**
- `backwards` - 动画从头播放
- `forwards` - 动画从上次结束点继续播放

**事件：**
- `@activeend` - 动画完成事件

#### 🎯 native-view 组件

**自定义原生 View 组件，用于嵌入原生视图。**

## 📦 视图容器

### 🏗️ 基础容器

#### 📱 view 组件

**基本视图容器，类似于 HTML 的 div 标签。**

#### 📜 scroll-view 组件

**可滚动视图容器，用于创建可滚动的区域。**

#### 🔄 嵌套滚动组件

| 组件 | 功能 | 使用场景 |
|------|------|----------|
| **nested-scroll-header** | 外层滚动视图头部 | 🎯 嵌套滚动的固定头部 |
| **nested-scroll-body** | 内层滚动视图容器 | 📜 嵌套滚动的内容区域 |

::: info 💡 嵌套滚动说明
这两个组件仅支持作为 `<scroll-view type='nested'>` 嵌套模式的直接子节点，不支持复数子节点。
:::

### 🎠 滑块容器

#### 🎠 swiper 组件

**滑块视图容器，用于创建轮播图、选项卡等滑动界面。**

#### 🎯 swiper-item 组件

**滑块视图容器子项，作为 swiper 的直接子元素。**

### 🎯 特殊容器

#### 📱 match-media 组件

**匹配检查节点，用于响应式布局。**

#### 🖱️ 拖拽容器

| 组件 | 功能 | 说明 |
|------|------|------|
| **movable-area** | 可拖放区域 | 🎯 定义拖拽范围 |
| **movable-view** | 可拖放视图 | 🖱️ 可拖拽的元素 |

#### 🎭 覆盖组件

| 组件 | 功能 | 覆盖组件 |
|------|------|----------|
| **cover-view** | 覆盖文本视图 | 📱 map、video、canvas、camera |
| **cover-image** | 覆盖图片视图 | 📱 同 cover-view |

::: warning ⚠️ 覆盖组件限制
cover-view 只支持嵌套 cover-view、cover-image，cover-image 支持嵌套在 cover-view 里。
:::

### 📋 列表容器

#### 📋 list-view 组件

**列表容器，用于高性能的长列表渲染。**

#### 📄 list-item 组件

**列表容器子项，作为 list-view 的直接子元素。**

### 📌 吸顶布局

| 组件 | 功能 | 使用场景 |
|------|------|----------|
| **sticky-header** | 吸顶布局容器 | 📌 固定在顶部的标题栏 |
| **sticky-section** | 吸顶布局区域 | 📌 分组标题吸顶效果 |

## 🎯 组件使用示例

### 📱 完整页面示例

```vue
<template>
  <!-- #ifdef APP -->
  <scroll-view style="flex: 1">
  <!-- #endif -->
    <view class="uni-container">
      <!-- 🎨 头部区域 -->
      <view class="uni-header-logo">
        <image
          class="uni-header-image"
          src="/static/componentIndex.png">
        </image>
      </view>
      
      <!-- 📝 文本说明 -->
      <view class="uni-text-box">
        <text class="hello-text">
          uni-app内置组件，展示样式仅供参考，文档详见：
        </text>
        <u-link
          :href="'https://uniapp.dcloud.io/uni-app-x/component/'"
          :text="'https://uniapp.dcloud.io/uni-app-x/component/'"
          :inWhiteList="true">
        </u-link>
      </view>
      
      <!-- 🗂️ 折叠面板 -->
      <uni-collapse>
        <template v-for="item in list" :key="item.id">
          <uni-collapse-item :title="item.name" class="item">
            <view
              v-for="(page, key) in item.pages"
              class="uni-navigate-item"
              :hover-class="page.enable == false ? '' : 'is--active'"
              :key="key"
              @click="goDetailPage(page)">
              <text
                class="uni-navigate-text"
                :class="page.enable == false ? 'text-disabled' : ''">
                {{ page.name }}
              </text>
              <image :src="arrowRightIcon" class="uni-icon"></image>
            </view>
          </uni-collapse-item>
        </template>
      </uni-collapse>

      <!-- #ifdef UNI-APP-X && APP -->
      <uni-upgrade-center-app 
        ref="upgradePopup" 
        @close="upgradePopupClose" />
      <!-- #endif -->
    </view>
  <!-- #ifdef APP -->
  </scroll-view>
  <!-- #endif -->
</template>

<script lang="uts">
// #ifdef UNI-APP-X && APP
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
// #endif

// 🎯 类型定义
type Page = {
  name: string
  enable?: boolean
  url?: string
}

type ListItem = {
  id: string
  name: string
  pages: Page[]
  url?: string
  enable?: boolean
}

export default {
  data() {
    return {
      list: [
        {
          id: 'view',
          name: '视图容器',
          pages: [
            { name: 'view' },
            { name: 'scroll-view' },
            { name: 'swiper' },
            { name: 'movable-view', enable: false },
            { name: 'cover-view', enable: false },
            { name: 'list-view' },
            { name: 'sticky-header' },
            { name: 'sticky-section' }
          ] as Page[]
        },
        {
          id: 'content',
          name: '基础内容',
          pages: [
            { name: 'text' },
            { name: 'rich-text', enable: true },
            { name: 'progress' }
          ] as Page[]
        },
        {
          id: 'form',
          name: '表单组件',
          pages: [
            { name: 'button' },
            { name: 'checkbox' },
            { name: 'form' },
            { name: 'input' },
            { name: 'label', enable: false },
            { name: 'picker', enable: false },
            { name: 'picker-view' },
            { name: 'radio' },
            { name: 'slider' },
            { name: 'slider-100' },
            { name: 'switch' },
            { name: 'textarea' },
            { name: 'editor', enable: false }
          ] as Page[]
        },
        {
          id: 'nav',
          name: '导航',
          pages: [
            { name: 'navigator', enable: true }
          ] as Page[]
        },
        {
          id: 'media',
          name: '媒体组件',
          pages: [
            { name: 'image', enable: true },
            { name: 'video', enable: true },
            { name: 'animation-view', enable: false }
          ] as Page[]
        },
        {
          id: 'map',
          name: '地图',
          pages: [
            { name: 'map', enable: false }
          ] as Page[]
        },
        {
          id: 'canvas',
          name: '画布',
          pages: [
            { name: 'canvas' }
          ] as Page[]
        },
        {
          id: 'web-view',
          name: '网页',
          pages: [
            {
              name: '网络网页',
              enable: true,
              url: '/pages/component/web-view/web-view'
            },
            {
              name: '本地网页',
              enable: true,
              url: '/pages/component/web-view-local/web-view-local'
            }
          ] as Page[]
        }
      ] as ListItem[]
    }
  },
  
  methods: {
    // 🎯 导航到详情页面
    goDetailPage(page: Page) {
      if (page.enable === false) {
        uni.showToast({
          title: '该功能暂未开放',
          icon: 'none'
        })
        return
      }
      
      const url = page.url || `/pages/component/${page.name}/${page.name}`
      uni.navigateTo({
        url: url
      })
    },
    
    // 🔄 升级弹窗关闭
    upgradePopupClose() {
      console.log('升级弹窗已关闭')
    }
  }
}
</script>

<style scoped>
.uni-container {
  padding: 20rpx;
  background-color: #f8f8f8;
}

.uni-header-logo {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.uni-header-image {
  width: 200rpx;
  height: 200rpx;
}

.uni-text-box {
  margin-bottom: 40rpx;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
}

.hello-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
}

.item {
  margin-bottom: 20rpx;
}

.uni-navigate-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.uni-navigate-item.is--active {
  background-color: #f5f5f5;
}

.uni-navigate-text {
  font-size: 30rpx;
  color: #333333;
}

.uni-navigate-text.text-disabled {
  color: #cccccc;
}

.uni-icon {
  width: 32rpx;
  height: 32rpx;
}
</style>
```

## 📊 组件分类汇总

### 🎯 组件功能分类

| 分类 | 组件 | 主要用途 |
|------|------|----------|
| **基础内容** | text, icon, rich-text, progress | 📝 文本、图标、富文本显示 |
| **视图容器** | view, scroll-view, swiper, list-view | 📦 布局和容器管理 |
| **表单组件** | button, input, checkbox, radio, slider | 📝 用户输入和交互 |
| **导航组件** | navigator | 🧭 页面导航和跳转 |
| **媒体组件** | image, video, animation-view | 🎵 媒体内容展示 |
| **地图组件** | map | 🗺️ 地理位置和地图 |
| **画布组件** | canvas | 🎨 自定义绘图 |
| **网页组件** | web-view | 🌐 嵌入网页内容 |

## 🎯 最佳实践

### ✅ 组件使用建议

::: tip 🎯 开发建议
- ✅ 根据功能需求选择合适的组件
- ✅ 注意组件的平台兼容性
- ✅ 合理使用容器组件进行布局
- ✅ 优化长列表性能，使用 list-view
- ✅ 适当使用条件编译处理平台差异
:::

### ⚠️ 注意事项

::: warning ⚠️ 使用限制
- ❌ 注意组件的嵌套规则和限制
- ❌ 避免过度嵌套影响性能
- ❌ 注意不同平台的样式差异
- ❌ 合理控制组件数量，避免内存问题
:::

### 🚀 性能优化

| 优化点 | 建议 | 实现方式 |
|--------|------|----------|
| **长列表** | 使用 list-view | 📋 虚拟滚动提升性能 |
| **图片优化** | 合理设置图片尺寸 | 🖼️ 避免内存占用过大 |
| **动画性能** | 使用 CSS3 动画 | 🎬 硬件加速提升流畅度 |
| **组件复用** | 抽取公共组件 | 🧩 提升开发效率 |

---

通过本指南，你已经全面了解了 uni-app 的组件库体系。这些组件为你的应用提供了丰富的 UI 构建能力，从简单的文本显示到复杂的交互界面，都能找到合适的组件。记住要关注组件的使用规范、性能优化和平台兼容性，以确保应用的质量和用户体验。