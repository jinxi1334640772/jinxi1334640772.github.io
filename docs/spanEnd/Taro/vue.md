---
title: 🎯 Taro Vue 开发完全指南
description: 深入掌握 Taro 框架中 Vue 开发的完整指南，包括组件规范、生命周期、路由和最佳实践
outline: deep
---

# 🎯 Taro Vue 开发完全指南

> 全面掌握在 Taro 框架中使用 Vue 进行跨端开发，从基础语法到高级特性，让你的 Vue 技能在小程序中发挥最大价值。

::: tip 📚 本章内容
详细介绍 Taro 中 Vue 开发的规范、生命周期、组件使用和最佳实践。
:::

## 🎯 Vue 在 Taro 中的特点

### 📊 核心优势

| 特性 | 说明 | 优势 |
|------|------|------|
| **真实 Vue** | 使用真实的 Vue 框架 | 🚀 完整的 Vue 生态支持 |
| **跨端统一** | 一套代码多端运行 | 📱 开发效率显著提升 |
| **组件复用** | Web 组件可直接使用 | 🔄 降低迁移成本 |
| **生态完整** | Vue 3 Composition API | ⚡ 现代化开发体验 |

### 🔄 开发规范对比

| 规范项 | Web 端 Vue | Taro Vue | 说明 |
|--------|------------|----------|------|
| **组件名** | PascalCase | kebab-case | 🏷️ 遵循小程序规范 |
| **属性名** | camelCase | kebab-case | 📝 全小写连字符 |
| **事件绑定** | @click | @tap | 👆 使用小程序事件名 |
| **Boolean 属性** | 简写支持 | 显式绑定 | ✅ 必须绑定为 true |

::: warning ⚠️ 重要规范
- 组件名遵从小程序规范（全小写，kebab-case）
- 组件属性遵从小程序规范（全小写，kebab-case）
- Boolean 值的组件属性需要显式绑定为 true，不支持简写
- 使用 @ 修饰符替代小程序事件名中的 bind
- Vue 中点击事件使用 @tap
:::

## 🧩 组件使用规范

### 📱 小程序组件示例

```vue
<template>
  <!-- ✅ 正确的组件使用方式 -->
  <swiper
    class="box"
    :autoplay="true"
    :interval="interval"
    indicator-color="#999"
    @tap="handleTap"
    @animationfinish="handleAnimationFinish"
  >
    <swiper-item>
      <view class="text">1</view>
    </swiper-item>
    <swiper-item>
      <view class="text">2</view>
    </swiper-item>
    <swiper-item>
      <view class="text">3</view>
    </swiper-item>
  </swiper>

  <!-- 滚动视图组件 -->
  <scroll-view
    style="height: 300px"
    :scroll-y="true"
    @tap="handleClick"
    @scroll="handleScroll"
    @scrolltoupper="handleScrollToUpper"
  >
    <view style="height: 200px">1</view>
    <view style="height: 200px">2</view>
    <view style="height: 200px">3</view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      interval: 1000,
    }
  },
  methods: {
    handleTap() {
      console.log('tap')
    },
    handleAnimationFinish() {
      console.log('finish')
    },
    handleClick(e) {
      console.log('handleClick')
      e.stopPropagation() // 阻止冒泡
    },
    handleScroll() {
      console.log('handleScroll')
    },
    handleScrollToUpper() {
      console.log('handleScrollToUpper')
    },
  },

  // 🔄 生命周期钩子
  beforeMount() {
    // onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发
  },
  mounted() {
    // 页面组件渲染到 Taro 的虚拟 DOM 之后触发
    // 此时能访问到 Taro 的虚拟 DOM，但无法通过 createSelectorQuery 等方法获取小程序渲染层 DOM 节点
    // 只能在 onReady 生命周期中获取
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 200px;
}

.text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 32px;
  color: #333;
}
</style>
```

### 🎯 事件处理规范

| Web 端事件 | Taro Vue 事件 | 说明 |
|------------|---------------|------|
| **@click** | @tap | 👆 点击事件 |
| **@input** | @input | 📝 输入事件 |
| **@change** | @change | 🔄 变化事件 |
| **@scroll** | @scroll | 📜 滚动事件 |
| **@touchstart** | @touchstart | 👆 触摸开始 |
| **@touchend** | @touchend | 👆 触摸结束 |

## 🚀 入口组件配置

### 📱 应用入口组件

每个 Taro 应用都需要一个入口组件用来注册应用，默认是 `src/app.js`：

```javascript
import { createApp } from 'vue'

const app = createApp({
  // 🔄 Vue 生命周期方法
  mounted() {
    console.log('App mounted')
  },

  /** 🚀 onLaunch - 应用启动生命周期
   * 在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router
   * 可以访问到程序初始化参数
   * @param {Object} options 启动参数
   * @param {String} options.path 启动小程序的路径
   * @param {Number} options.scene 启动小程序的场景值
   * @param {Object} options.query 启动小程序的 query 参数
   * @param {String} options.shareTicket 分享票据
   * @param {Object} options.referrerInfo 来源信息
   * @param {String} options.referrerInfo.appid 来源小程序或公众号
   * @param {Object} options.referrerInfo.extraData 来源小程序传过来的数据
   * @param {String} options.referrerInfo.sourceServiceId 来源插件
   */
  onLaunch(options) {
    console.log('App launched with options:', options)
  },

  /** 📱 onShow - 应用显示生命周期 */
  onShow(options) {
    console.log('App show with options:', options)
  },

  /** 🔒 onHide - 应用隐藏生命周期 */
  onHide() {
    console.log('App hide')
  },

  /** ❌ onError - 脚本错误或 API 调用报错时触发 */
  onError(error) {
    console.error('App error:', error)
  },

  /** 🔍 onPageNotFound - 程序要打开的页面不存在时触发
   * @param {Object} options
   * @param {String} options.path 不存在页面的路径
   * @param {Object} options.query 打开不存在页面的 query 参数
   * @param {Boolean} options.isEntryPage 是否为首页
   */
  onPageNotFound(options) {
    console.warn('Page not found:', options)
  },

  /** 🚫 onUnhandledRejection - 未处理的 Promise 拒绝时触发
   * @param {Object} options
   * @param {Error} options.reason 拒绝原因，一般是一个 Error 对象
   * @param {Promise} options.promise 被拒绝的 Promise 对象
   */
  onUnhandledRejection(options) {
    console.error('Unhandled rejection:', options)
  },

  // 入口组件不需要实现 render 方法，即使实现了也会被 Taro 覆盖
})

export default app
```

### 📊 应用生命周期对照表

| 生命周期 | 触发时机 | 参数 | 使用场景 |
|----------|----------|------|----------|
| **onLaunch** | 应用启动 | options | 🚀 初始化全局数据 |
| **onShow** | 应用显示 | options | 📱 更新应用状态 |
| **onHide** | 应用隐藏 | - | 🔒 保存应用数据 |
| **onError** | 脚本错误 | error | ❌ 错误上报 |
| **onPageNotFound** | 页面不存在 | options | 🔍 页面重定向 |
| **onUnhandledRejection** | Promise 拒绝 | options | 🚫 异常处理 |

## 📄 页面组件开发

### 🎯 页面组件结构

每个页面组件必须是一个 `.vue` 文件：

```vue
<template>
  <view class="index">
    <text>{{ msg }}</text>
    <view id="only" />
    
    <!-- 用户信息展示 -->
    <view class="user-info">
      <image :src="userInfo.avatar" class="avatar" />
      <text class="username">{{ userInfo.name }}</text>
    </view>
    
    <!-- 操作按钮 -->
    <view class="actions">
      <button @tap="handleRefresh" class="btn-primary">
        刷新数据
      </button>
      <button @tap="handleNavigate" class="btn-secondary">
        跳转页面
      </button>
    </view>
  </view>
</template>

<script>
import { ref, reactive } from 'vue'
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'

export default {
  setup() {
    // 🎯 响应式数据
    const msg = ref('Hello world')
    const userInfo = reactive({
      name: '张三',
      avatar: '/images/avatar.png'
    })

    // 🔄 方法定义
    const handleRefresh = () => {
      console.log('刷新数据')
      // 刷新逻辑
    }

    const handleNavigate = () => {
      Taro.navigateTo({
        url: '/pages/detail/index'
      })
    }

    return {
      msg,
      userInfo,
      handleRefresh,
      handleNavigate
    }
  },

  // 🔄 Vue 生命周期方法
  mounted() {
    console.log('Page mounted')
  },

  /** 🚀 onLoad - 页面加载生命周期
   * 页面加载时触发，只会调用一次
   * @param {Object} query 页面参数
   */
  onLoad(query) {
    console.log('Page loaded with query:', query)
    // 获取页面参数，初始化页面数据
  },

  /** 📱 onReady - 页面首次渲染完毕
   * 从此生命周期开始可以使用 createCanvasContext 或 createSelectorQuery 等 API
   * 访问小程序渲染层的 DOM 节点
   */
  onReady() {
    console.log('Page ready')
    
    // 方法一：使用 eventCenter
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      console.log('onReady triggered')

      // onReady 触发后才能获取小程序渲染层的节点
      Taro.createSelectorQuery()
        .select('#only')
        .boundingClientRect()
        .exec((res) => console.log('Element info:', res))
    })

    // 方法二：异步组件时使用 nextTick
    Taro.nextTick(() => {
      // 使用 Taro.nextTick 模拟 setData 已结束，节点已完成渲染
      Taro.createSelectorQuery()
        .select('#only')
        .boundingClientRect()
        .exec((res) => console.log('Element info:', res))
    })
  },

  /** 📱 onShow - 页面显示生命周期 */
  onShow() {
    console.log('Page show')
    // 页面显示时的逻辑
  },

  /** 🔒 onHide - 页面隐藏生命周期 */
  onHide() {
    console.log('Page hide')
    // 页面隐藏时的逻辑
  },

  /** 🗑️ onUnload - 页面卸载生命周期 */
  onUnload() {
    console.log('Page unload')
    // 清理定时器、取消网络请求等
  },

  /** 📜 onPullDownRefresh - 下拉刷新 */
  onPullDownRefresh() {
    console.log('Pull down refresh')
    // 下拉刷新逻辑
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  },

  /** 📄 onReachBottom - 上拉加载 */
  onReachBottom() {
    console.log('Reach bottom')
    // 上拉加载更多逻辑
  },

  /** 📤 onShareAppMessage - 分享配置 */
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  }
}
</script>

<style scoped>
.index {
  padding: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  margin: 32px 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 24px;
}

.username {
  font-size: 32px;
  color: #333;
}

.actions {
  display: flex;
  gap: 24px;
  margin-top: 48px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 24px;
  border-radius: 8px;
  font-size: 28px;
  border: none;
}

.btn-primary {
  background-color: #007aff;
  color: white;
}

.btn-secondary {
  background-color: #f8f8f8;
  color: #333;
}
</style>
```

### 📊 页面生命周期对照表

| 生命周期 | 触发时机 | 参数 | 使用场景 |
|----------|----------|------|----------|
| **onLoad** | 页面加载 | query | 🚀 获取页面参数，初始化数据 |
| **onReady** | 首次渲染完毕 | - | 📱 DOM 操作，获取节点信息 |
| **onShow** | 页面显示 | - | 📱 更新页面状态 |
| **onHide** | 页面隐藏 | - | 🔒 暂停操作，保存状态 |
| **onUnload** | 页面卸载 | - | 🗑️ 清理资源 |
| **onPullDownRefresh** | 下拉刷新 | - | 🔄 刷新页面数据 |
| **onReachBottom** | 上拉触底 | - | 📄 加载更多数据 |
| **onShareAppMessage** | 用户分享 | - | 📤 配置分享内容 |

## 🎯 Vue 3 Composition API

### ⚡ 现代化开发方式

```vue
<template>
  <view class="composition-demo">
    <view class="counter">
      <text>计数器: {{ count }}</text>
      <button @tap="increment">增加</button>
      <button @tap="decrement">减少</button>
    </view>
    
    <view class="todo-list">
      <input 
        v-model="newTodo" 
        placeholder="添加待办事项"
        @confirm="addTodo"
      />
      <view 
        v-for="todo in todos" 
        :key="todo.id"
        class="todo-item"
        @tap="toggleTodo(todo.id)"
      >
        <text :class="{ completed: todo.completed }">
          {{ todo.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Taro from '@tarojs/taro'

export default {
  setup() {
    // 🔢 计数器功能
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    const decrement = () => {
      count.value--
    }

    // 📝 待办事项功能
    const newTodo = ref('')
    const todos = reactive([
      { id: 1, text: '学习 Taro', completed: false },
      { id: 2, text: '学习 Vue 3', completed: true }
    ])

    // 📊 计算属性
    const completedCount = computed(() => {
      return todos.filter(todo => todo.completed).length
    })

    // 🔄 方法定义
    const addTodo = () => {
      if (newTodo.value.trim()) {
        todos.push({
          id: Date.now(),
          text: newTodo.value,
          completed: false
        })
        newTodo.value = ''
      }
    }

    const toggleTodo = (id) => {
      const todo = todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }

    // 👀 监听器
    watch(count, (newVal, oldVal) => {
      console.log(`计数从 ${oldVal} 变为 ${newVal}`)
      
      if (newVal === 10) {
        Taro.showToast({
          title: '达到 10 了！',
          icon: 'success'
        })
      }
    })

    watch(todos, (newTodos) => {
      console.log('待办事项更新:', newTodos)
      // 保存到本地存储
      Taro.setStorageSync('todos', newTodos)
    }, { deep: true })

    // 🔄 生命周期
    onMounted(() => {
      // 从本地存储加载待办事项
      const savedTodos = Taro.getStorageSync('todos')
      if (savedTodos) {
        todos.splice(0, todos.length, ...savedTodos)
      }
    })

    return {
      count,
      increment,
      decrement,
      newTodo,
      todos,
      completedCount,
      addTodo,
      toggleTodo
    }
  }
}
</script>

<style scoped>
.composition-demo {
  padding: 32px;
}

.counter {
  margin-bottom: 48px;
  text-align: center;
}

.counter text {
  display: block;
  font-size: 36px;
  margin-bottom: 24px;
}

.counter button {
  margin: 0 12px;
  padding: 16px 32px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
}

.todo-list input {
  width: 100%;
  padding: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 28px;
}

.todo-item {
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.todo-item text {
  font-size: 28px;
}

.completed {
  text-decoration: line-through;
  color: #999;
}
</style>
```

## 🛠️ 最佳实践

### 📋 开发规范清单

::: tip ✅ 推荐做法
- 使用 Vue 3 Composition API 进行开发
- 合理使用响应式数据，避免过度响应
- 在 onReady 生命周期中进行 DOM 操作
- 使用 Taro.nextTick 确保 DOM 更新完成
- 合理使用计算属性和监听器
- 及时清理定时器和事件监听器
:::

::: warning ⚠️ 注意事项
- 不要在 mounted 中进行 DOM 查询操作
- Boolean 属性必须显式绑定为 true
- 使用小程序规范的组件和事件名
- 避免在模板中使用复杂的表达式
:::

### 🚀 性能优化建议

| 优化项 | 说明 | 实现方式 |
|--------|------|----------|
| **按需加载** | 减少首屏加载时间 | 🔄 路由懒加载 |
| **数据缓存** | 避免重复请求 | 💾 本地存储 |
| **图片优化** | 减少包体积 | 🖼️ 图片压缩 |
| **代码分割** | 按页面分包 | 📦 分包加载 |

### 🔧 调试技巧

```javascript
// 🐛 调试工具
import { getCurrentInstance } from 'vue'
import Taro from '@tarojs/taro'

export default {
  setup() {
    // 获取当前实例
    const instance = getCurrentInstance()
    console.log('Current instance:', instance)

    // 获取页面路由信息
    const router = Taro.getCurrentInstance().router
    console.log('Current route:', router)

    // 调试响应式数据
    const debugData = ref({})
    
    watch(debugData, (newVal) => {
      console.log('Debug data changed:', newVal)
    }, { deep: true })

    return {
      debugData
    }
  },

  onShow() {
    // 页面显示时打印调试信息
    console.log('Page show - Debug info:', {
      route: Taro.getCurrentInstance().router,
      systemInfo: Taro.getSystemInfoSync()
    })
  }
}
```

## 📚 总结

通过本章学习，你已经掌握了在 Taro 中使用 Vue 进行跨端开发的完整知识体系。从基础的组件使用规范到高级的 Composition API，从生命周期管理到性能优化，这些知识将帮助你构建高质量的跨端应用。

记住在 Taro 中使用 Vue 的关键点：遵循小程序规范、合理使用生命周期、充分利用 Vue 3 的现代特性，以及注重性能优化和用户体验。
