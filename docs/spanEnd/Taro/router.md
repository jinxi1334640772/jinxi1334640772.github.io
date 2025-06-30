---
title: 🚀 Taro 路由配置完全指南
description: 深入掌握 Taro 框架的路由系统，包括路由配置、页面跳转、参数传递和路由库使用
outline: deep
---

# 🚀 Taro 路由配置完全指南

> 全面掌握 Taro 框架的路由系统，从基础配置到高级应用，从页面跳转到路由守卫，让你的应用导航更加灵活。

::: tip 📚 本章内容
详细介绍 Taro 路由配置和使用方法，包含路由 API、参数传递、路由库集成等核心功能。
:::

## 🎯 路由系统概览

### 📊 路由规范

Taro 遵循微信小程序的路由规范，通过修改全局配置的 `pages` 属性来配置应用中每个页面的路径。

| 平台 | 路由特性 | 支持功能 |
|------|----------|----------|
| **小程序** | 小程序路由规范 | 🎯 基础页面跳转 |
| **H5** | Web 路由增强 | 🌐 路由模式、basename、路由守卫 |
| **React Native** | 原生导航 | 📱 原生页面切换 |

## 🚀 路由 API

### 🎯 核心路由方法

| 方法 | 功能 | 使用场景 | 特点 |
|------|------|----------|------|
| **switchTab** | 跳转到 tabBar 页面 | 🏠 底部导航切换 | 关闭其他非 tabBar 页面 |
| **navigateTo** | 打开新页面 | 📄 页面详情跳转 | 保留当前页面 |
| **redirectTo** | 替换当前页面 | 🔄 页面重定向 | 关闭当前页面 |
| **reLaunch** | 重启应用 | 🔄 重新启动 | 关闭所有页面 |
| **navigateBack** | 返回上级页面 | ⬅️ 返回操作 | 支持多级返回 |

### 🏠 switchTab - 切换到 tabBar 页面

**跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。**

```javascript
// 🎯 基础用法
Taro.switchTab({
  url: '/index',
  success(res) {
    console.log('跳转成功:', res)
  },
  fail(res) {
    console.error('跳转失败:', res)
  },
  complete(res) {
    console.log('跳转完成:', res)
  }
})
```

::: tip 💡 使用说明
- ✅ 只能跳转到 tabBar 页面
- ✅ 会关闭其他所有非 tabBar 页面
- ❌ 不支持传递参数
:::

### 📄 navigateTo - 打开新页面

**跳转到目的页面，打开新页面，保留当前页面。**

```javascript
// 🎯 基础跳转
Taro.navigateTo({
  url: '/pages/page/path/name'
})

// 🎯 传递参数
Taro.navigateTo({
  url: '/pages/page/path/name?id=2&type=test'
})

// 🎯 完整配置
Taro.navigateTo({
  url: '/pages/detail/index?id=123',
  success(res) {
    console.log('跳转成功:', res)
  },
  fail(res) {
    console.error('跳转失败:', res)
  }
})
```

### 🔄 redirectTo - 替换当前页面

**关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabBar 页面。**

```javascript
// 🎯 页面重定向
Taro.redirectTo({
  url: '/pages/page/path/name'
})

// 🎯 带参数重定向
Taro.redirectTo({
  url: '/pages/login/index?from=profile'
})
```

::: warning ⚠️ 注意事项
- ❌ 不允许跳转到 tabBar 页面
- ❌ 会关闭当前页面，无法返回
- ✅ 适用于登录跳转等场景
:::

### 🔄 reLaunch - 重启应用

**关闭所有页面，打开到应用内的某个页面。**

```javascript
// 🎯 重启应用
Taro.reLaunch({
  url: '/pages/index/index?id=1'
})
```

### ⬅️ navigateBack - 返回上级页面

**关闭当前页面，返回上一页面或多级页面。**

```javascript
// 🎯 返回上一页
Taro.navigateBack()

// 🎯 返回多级页面
Taro.navigateBack({
  delta: 2  // 返回前 2 级页面
})
```

## 📊 参数传递与获取

### 🎯 参数传递方式

| 方式 | 语法 | 示例 | 使用场景 |
|------|------|------|----------|
| **URL 参数** | `?key=value&key2=value2` | `?id=123&type=detail` | 🎯 简单数据传递 |
| **EventChannel** | 页面间事件通信 | 复杂数据传递 | 📊 复杂对象传递 |

### 📱 参数获取示例

```vue
<template>
  <view class="index">
    <view class="param-info">
      <text>接收到的参数:</text>
      <text>ID: {{ routeParams.id }}</text>
      <text>Type: {{ routeParams.type }}</text>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const routeParams = ref({})
    
    onMounted(() => {
      // 🎯 建议在页面初始化时保存实例
      const instance = Taro.getCurrentInstance()
      
      // 📊 获取路由参数
      routeParams.value = instance.router.params
      console.log('路由参数:', routeParams.value)
      // 输出: { id: '2', type: 'test' }
    })
    
    return {
      routeParams
    }
  }
}
</script>
```

## 🌐 路由库集成

### 📚 前端路由库原理

前端路由库的基本原理是监听 `popstate` 或 `hashchange` 事件触发后，读取 `location` 对象对视图进行操控更新。

Taro 为了支持前端路由库的使用，在运行时中引入了 `history` 和 `location` 对象的实现，且尽可能与 Web 端规范对齐。

### 🔧 插件配置

```javascript
// 🎯 配置 HTML 插件支持
{
  "plugins": ["@tarojs/plugin-html"]
}
```

::: tip 💡 为什么需要 HTML 插件？
路由库中的 `<Link>` 组件内部会动态生成 `<a>` 标签，因此需要引入 `@tarojs/plugin-html` 插件以支持在 Taro 中使用 HTML 标签开发组件。
:::

### 🎯 Vue Router 集成示例

#### 📱 应用入口配置 (app.js)

```javascript
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// 🎯 导入自定义组件
import Home from './components/home.vue'
import Tab1 from './components/tab-1.vue'
import Tab2 from './components/tab-2.vue'
import Tab3 from './components/tab-3.vue'

// 🎯 路由配置
const routes = [
  { 
    path: '/', 
    component: Home,
    name: 'home'
  },
  { 
    path: '/tab1', 
    component: Tab1,
    name: 'tab1'
  },
  { 
    path: '/tab2', 
    component: Tab2,
    name: 'tab2'
  },
  { 
    path: '/tab3/:groupId/:id', 
    component: Tab3,
    name: 'tab3'
  }
]

// 🎯 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🎯 创建应用实例
const App = createApp({
  onShow(options) {
    console.log('应用启动:', options)
  }
})

// 🎯 使用路由
App.use(router)

export default App
```

#### 📄 页面组件使用 (/pages/index/index.vue)

```vue
<template>
  <view class="router-page">
    <view class="header">
      <text class="title">🚀 Taro 路由示例</text>
    </view>
    
    <!-- 🎯 导航标签 -->
    <view class="tab-box">
      <router-link 
        class="tab-item" 
        to="/" 
        replace
        :class="{ active: $route.path === '/' }">
        🏠 Home
      </router-link>
      
      <router-link 
        class="tab-item" 
        to="/tab1?name=advancedcat&from=china" 
        replace
        :class="{ active: $route.path === '/tab1' }">
        📊 Tab 1
      </router-link>
      
      <router-link 
        class="tab-item" 
        to="/tab2"
        :class="{ active: $route.path === '/tab2' }">
        📱 Tab 2
      </router-link>
      
      <router-link 
        class="tab-item" 
        to="/tab3/1234/8765"
        :class="{ active: $route.path.includes('/tab3') }">
        🎯 Tab 3
      </router-link>
      
      <router-link 
        class="tab-item" 
        :to="{ name: 'user', params: { id: '9876' } }"
        :class="{ active: $route.name === 'user' }">
        👤 User
      </router-link>
    </view>
    
    <!-- 🎯 路由视图 -->
    <view class="router-view">
      <router-view></router-view>
    </view>
  </view>
</template>

<script setup>
import { useRoute } from 'vue-router'

// 🎯 获取当前路由信息
const route = useRoute()

console.log('当前路由:', route.path)
console.log('路由参数:', route.params)
console.log('查询参数:', route.query)
</script>

<style scoped>
.router-page {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 40rpx 0;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.tab-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.tab-item {
  flex: 1;
  min-width: 140rpx;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  text-align: center;
  text-decoration: none;
  color: #666666;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background-color: #007aff;
  color: #ffffff;
  transform: translateY(-2rpx);
}

.tab-item:hover {
  background-color: #f0f0f0;
}

.tab-item.active:hover {
  background-color: #0056cc;
}

.router-view {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  min-height: 400rpx;
}
</style>
```

## 📊 路由参数详解

### 🎯 路由参数类型

| 参数类型 | 获取方式 | 示例 | 说明 |
|----------|----------|------|------|
| **Path 参数** | `$route.params` | `/user/:id` | 🎯 路径中的动态参数 |
| **Query 参数** | `$route.query` | `?name=value` | 📊 查询字符串参数 |
| **Hash 参数** | `$route.hash` | `#section` | 🔗 页面锚点 |

### 📱 参数获取示例

```vue
<template>
  <view class="params-demo">
    <view class="param-section">
      <text class="section-title">📊 路由参数信息</text>
      
      <view class="param-item">
        <text class="label">当前路径:</text>
        <text class="value">{{ $route.path }}</text>
      </view>
      
      <view class="param-item">
        <text class="label">路径参数:</text>
        <text class="value">{{ JSON.stringify($route.params) }}</text>
      </view>
      
      <view class="param-item">
        <text class="label">查询参数:</text>
        <text class="value">{{ JSON.stringify($route.query) }}</text>
      </view>
      
      <view class="param-item">
        <text class="label">完整路由:</text>
        <text class="value">{{ $route.fullPath }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// 🎯 监听路由变化
watch(() => route.params, (newParams, oldParams) => {
  console.log('路由参数变化:', { newParams, oldParams })
})
</script>
```

## ⚠️ 平台差异说明

### 🌐 Web 端 vs 小程序端

| 功能 | Web 端 | 小程序端 | 说明 |
|------|--------|----------|------|
| **location.href** | ✅ 支持 | ❌ 不支持 | 小程序端应使用 Taro.navigateTo |
| **history API** | ✅ 完整支持 | 🔄 部分支持 | 小程序端 location 属性视为只读 |
| **路由守卫** | ✅ 支持 | ❌ 不支持 | 小程序端需要手动实现 |

::: warning ⚠️ 重要提醒
在 Web 端可以通过赋值 `location.href` 实现页面加载，但在小程序中不适用。小程序端的页面跳转仍建议使用 `Taro.navigateTo` 等官方 API。在小程序侧，应该将 `location` 上的属性视为只读。
:::

## 🎯 最佳实践

### ✅ 路由使用建议

::: tip 🎯 开发建议
- ✅ 小程序端优先使用 Taro 官方路由 API
- ✅ H5 端可以使用成熟的路由库如 Vue Router
- ✅ 合理设计路由结构，避免嵌套过深
- ✅ 重要页面支持直接访问，避免依赖跳转链
- ✅ 做好路由参数的类型检查和默认值处理
:::

### 🚀 性能优化

| 优化点 | 建议 | 实现方式 |
|--------|------|----------|
| **路由懒加载** | 按需加载页面 | 🎯 使用动态 import |
| **参数缓存** | 缓存常用参数 | 💾 使用 localStorage |
| **路由预加载** | 预加载重要页面 | ⚡ 提前加载资源 |
| **历史记录** | 合理管理页面栈 | 📚 控制页面层级 |

### 🔧 错误处理

```javascript
// 🎯 路由跳转错误处理
const navigateWithErrorHandling = (url) => {
  Taro.navigateTo({
    url,
    success: (res) => {
      console.log('跳转成功:', res)
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      
      // 🛡️ 降级处理
      if (err.errMsg.includes('tabbar')) {
        Taro.switchTab({ url })
      } else {
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    }
  })
}
```

---

通过本指南，你已经全面掌握了 Taro 框架的路由系统。从基础的页面跳转到高级的路由库集成，从参数传递到平台差异处理，这些知识将帮助你构建更加灵活和用户友好的应用导航体验。记住要根据不同平台的特性选择合适的路由方案，并注重性能优化和错误处理。