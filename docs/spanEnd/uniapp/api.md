---
title: 🚀 uni-app API 接口完全指南
description: 深入掌握 uni-app 全局 API、页面路由、网络请求、数据存储等核心接口，构建高效的跨平台应用
outline: deep
---

# 🚀 uni-app API 接口完全指南

> 全面掌握 uni-app 提供的丰富 API 接口，包括全局方法、页面管理、网络请求、本地存储等核心功能，让你的应用功能更加强大。

::: tip 📚 本章内容
详细介绍 uni-app 的各类 API 接口，包含实际代码示例和最佳实践。
:::

## 🌐 全局 API

### 📱 应用实例管理

| API | 功能 | 返回值 | 使用场景 |
|-----|------|--------|----------|
| **getApp()** | 获取当前应用实例 | App 实例 | 🎯 获取全局数据和方法 |
| **getCurrentPages()** | 获取当前页面栈实例 | Page[] | 📄 页面栈管理和导航 |

#### 🔧 页面实例方法

```typescript
// 📄 获取当前页面栈
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]

// 🎨 页面样式操作
currentPage.getPageStyle()           // 获取页面样式
currentPage.setPageStyle(style)      // 设置页面样式
currentPage.getParentPage()          // 获取父页面
currentPage.getDialogPages()         // 获取对话框页面
currentPage.getElementById(id)       // 根据ID获取元素
```

### 🎬 动画帧控制

| API | 功能 | 参数 | 说明 |
|-----|------|------|------|
| **requestAnimationFrame()** | 请求动画帧 | callback | 🎯 在下次重绘前执行回调 |
| **cancelAnimationFrame()** | 取消动画帧 | taskId | ❌ 取消指定的动画帧请求 |

```typescript
// 🎬 动画帧示例
let animationId: number

const animate = () => {
  // 动画逻辑
  console.log('执行动画帧')
  animationId = requestAnimationFrame(animate)
}

// 开始动画
animationId = requestAnimationFrame(animate)

// 停止动画
cancelAnimationFrame(animationId)
```

## 🔧 基础功能

### 📱 条件渲染和环境变量

uni-app 支持条件编译，可以根据不同平台编写特定代码：

```vue
<template>
  <!-- #ifdef APP -->
  <text>操作日志</text>
  <button size="mini" @click="log = ''">清空日志{{ log }}</button>
  <scroll-view style="flex: 1;">
    <!-- #endif -->

    <!-- #ifdef APP -->
    <button
      class="btnstyle"
      type="primary"
      @tap="geAbsPath(sandboxPath)"
      id="btn-path">
      应用外置沙盒目录uni.env.SANDBOX_PATH
    </button>
    <button
      class="btnstyle"
      type="primary"
      @tap="geAbsPath(cachePath)"
      id="btn-path">
      缓存文件目录uni.env.CACHE_PATH
    </button>
    <button
      class="btnstyle"
      type="primary"
      @tap="geAbsPath(userPath)"
      id="btn-path">
      用户文件目录uni.env.USER_DATA_PATH
    </button>
    <button
      class="btnstyle"
      type="primary"
      @tap="geAbsPath(internalSandboxPath)"
      id="btn-path">
      应用内置沙盒目录uni.env.ANDROID_INTERNAL_SANDBOX_PATH
    </button>
    <!-- #endif -->

    <!-- #ifdef APP -->
  </scroll-view>
  <!-- #endif -->
</template>

<script>
export default {
  data() {
    return {
      log: "",
      userPath: uni.env.USER_DATA_PATH,
      sandboxPath: uni.env.SANDBOX_PATH,
      cachePath: uni.env.CACHE_PATH,
      internalSandboxPath: uni.env.ANDROID_INTERNAL_SANDBOX_PATH,
    }
  },
  onLoad() {},
  methods: {
    geAbsPath(path?: any) {
      // #ifdef APP-ANDROID
      this.log += UTSAndroid.convert2AbsFullPath(path as string) + '\n'
      // #endif
    }
  }
}
</script>

<style>
.btnstyle {
  margin: 4px;
}
</style>
```

### 🎯 环境变量对照表

| 环境变量 | 描述 | 平台 |
|----------|------|------|
| **uni.env.USER_DATA_PATH** | 用户文件目录 | 📱 App |
| **uni.env.SANDBOX_PATH** | 应用外置沙盒目录 | 📱 App |
| **uni.env.CACHE_PATH** | 缓存文件目录 | 📱 App |
| **uni.env.ANDROID_INTERNAL_SANDBOX_PATH** | 应用内置沙盒目录 | 🤖 Android |

## 📡 事件总线

### 🎪 发布订阅模式

uni-app 提供了全局事件总线，用于组件间通信：

```typescript
// 🎯 事件监听和发布
uni.$on(eventName: string, callback: Function)     // 绑定事件监听器
uni.$off(eventName: string, callback?: Function)   // 卸载事件监听器
uni.$once(eventName: string, callback: Function)   // 只执行一次的事件监听器
uni.$emit(eventName: string, ...args: any[])       // 派发事件并传递参数
```

#### 📊 事件总线使用示例

```typescript
// 🎪 页面A：发布事件
export default {
  methods: {
    sendMessage() {
      uni.$emit('userLogin', {
        userId: 123,
        userName: '张三'
      })
    }
  }
}

// 🎪 页面B：监听事件
export default {
  onLoad() {
    // 监听用户登录事件
    uni.$on('userLogin', (userData) => {
      console.log('用户登录:', userData)
      this.handleUserLogin(userData)
    })
  },
  
  onUnload() {
    // 页面卸载时移除监听器
    uni.$off('userLogin')
  },
  
  methods: {
    handleUserLogin(userData) {
      // 处理用户登录逻辑
      this.currentUser = userData
    }
  }
}
```

### 🔄 数据转换工具

| API | 功能 | 参数 | 返回值 |
|-----|------|------|--------|
| **uni.base64ToArrayBuffer()** | Base64 转 ArrayBuffer | base64: string | ArrayBuffer |
| **uni.arrayBufferToBase64()** | ArrayBuffer 转 Base64 | arrayBuffer: ArrayBuffer | string |

```typescript
// 🔄 数据转换示例
const base64String = 'SGVsbG8gV29ybGQ='
const arrayBuffer = uni.base64ToArrayBuffer(base64String)
console.log('ArrayBuffer:', arrayBuffer)

const convertedBase64 = uni.arrayBufferToBase64(arrayBuffer)
console.log('Base64:', convertedBase64)
```

## 🌐 网络请求

### 📡 HTTP 请求

```typescript
// 🌐 发起网络请求
uni.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  data: {
    page: 1,
    limit: 10
  },
  header: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  success: (res) => {
    console.log('请求成功:', res.data)
  },
  fail: (err) => {
    console.error('请求失败:', err)
  },
  complete: () => {
    console.log('请求完成')
  }
})
```

### 🔧 请求拦截器

uni-app 支持为特定 API 添加拦截器：

```typescript
// ➕ 添加拦截器
uni.addInterceptor(name: string, interceptor: InterceptorOptions)

// ➖ 删除拦截器
uni.removeInterceptor(name: string, interceptor?: InterceptorOptions)
```

#### 🎯 支持拦截器的 API

| API 类型 | 支持的接口 |
|----------|------------|
| **路由导航** | navigateTo, redirectTo, reLaunch, switchTab, navigateBack |
| **页面操作** | loadFontFace, pageScrollTo, startPullDownRefresh |
| **导航栏** | setNavigationBarColor, setNavigationBarTitle |
| **TabBar** | setTabBarBadge, removeTabBarBadge, setTabBarItem, setTabBarStyle |
| **TabBar 显示** | hideTabBar, showTabBar, showTabBarRedDot, hideTabBarRedDot |

#### 🔧 路由拦截器示例

```typescript
// 🎯 定义路由拦截器
const navigateToInterceptor = {
  invoke: function (options: NavigateToOptions) {
    console.log('拦截 navigateTo 接口传入参数为：', options)
    const url = './page2'
    uni.showToast({
      title: `重定向到页面:${url}`
    })
    options.url = url
  },
  success: function (res: NavigateToSuccess) {
    console.log('拦截 navigateTo 接口 success 返回参数为：', res)
  },
  fail: function (err: NavigateToFail) {
    console.log('拦截 navigateTo 接口 fail 返回参数为：', err)
  },
  complete: function (res: NavigateToComplete) {
    console.log('拦截 navigateTo 接口 complete 返回参数为：', res)
  }
} as AddInterceptorOptions

// ➕ 添加路由拦截器
const addInterceptor = () => {
      uni.addInterceptor('navigateTo', navigateToInterceptor)
      uni.showToast({
        title: '页面跳转/切换tabbar已拦截'
      })
}

// ➖ 移除路由拦截器
const removeInterceptor = () => {
  uni.removeInterceptor('navigateTo', navigateToInterceptor)
  uni.showToast({
    title: '拦截器已移除'
  })
}
```

## 📱 应用生命周期

### 🚀 应用启动和状态

| API | 功能 | 返回值 | 使用场景 |
|-----|------|--------|----------|
| **uni.getLaunchOptionsSync()** | 获取首次启动参数 | LaunchOptions | 🎯 应用冷启动处理 |
| **uni.getEnterOptionsSync()** | 获取本次启动参数 | EnterOptions | 🔄 应用热启动处理 |
| **uni.exit()** | 退出当前应用 | void | 🚪 主动退出应用 |

```typescript
// 🚀 获取启动参数
const launchOptions = uni.getLaunchOptionsSync()
console.log('首次启动参数:', {
  path: launchOptions.path,
  appScheme: launchOptions.appScheme,
  appLink: launchOptions.appLink
})

const enterOptions = uni.getEnterOptionsSync()
console.log('本次启动参数:', {
  path: enterOptions.path,
  appScheme: enterOptions.appScheme,
  appLink: enterOptions.appLink
})

// 🚪 退出应用
const exitApp = () => {
uni.showModal({
    title: '确认退出',
    content: '确定要退出应用吗？',
    success: (res) => {
      if (res.confirm) {
        uni.exit()
      }
    }
  })
}
```

### 🔧 系统能力

| API | 功能 | 返回值 | 描述 |
|-----|------|--------|------|
| **uni.getProviderSync()** | 获取服务提供商信息 | ProviderInfo | 🎯 支付、登录等服务商 |
| **uni.getPerformance()** | 获取性能对象实例 | Performance | 📊 性能监控和分析 |

```typescript
// 🔧 获取服务提供商
const providers = uni.getProviderSync('payment')
console.log('支付服务提供商:', providers)

// 📊 性能监控
const performance = uni.getPerformance()
const observer = performance.createObserver((entryList) => {
  console.log('性能数据:', entryList.getEntries())
})
observer.observe({
  entryTypes: ['render', 'navigation']
})
```

### 🔐 隐私协议管理

| API | 功能 | 参数 | 说明 |
|-----|------|------|------|
| **uni.getPrivacySetting()** | 获取隐私协议状态 | - | 🔒 检查用户是否同意隐私协议 |
| **uni.resetPrivacyAuthorization()** | 重置隐私协议状态 | - | 🔄 隐私协议变更时重置 |
| **uni.onPrivacyAuthorizationChange()** | 监听隐私协议变化 | callback | 👁️ 监听用户同意状态变化 |
| **uni.offPrivacyAuthorizationChange()** | 取消监听隐私协议 | callback | ❌ 移除监听器 |

```typescript
// 🔐 隐私协议管理示例
export default {
  onLoad() {
    // 检查隐私协议状态
    const privacySetting = uni.getPrivacySetting()
    if (!privacySetting.privacyAuthorization) {
      this.showPrivacyDialog()
    }
    
    // 监听隐私协议变化
    uni.onPrivacyAuthorizationChange((res) => {
      console.log('隐私协议状态变化:', res.privacyAuthorization)
      if (res.privacyAuthorization) {
        this.initApp()
      }
    })
  },
  
  onUnload() {
    // 移除监听器
    uni.offPrivacyAuthorizationChange()
  },
  
  methods: {
    showPrivacyDialog() {
      uni.showModal({
        title: '隐私协议',
        content: '请同意隐私协议后继续使用',
        confirmText: '同意',
        cancelText: '拒绝',
        success: (res) => {
          if (res.confirm) {
            // 用户同意隐私协议
            this.initApp()
          } else {
            // 用户拒绝，可以退出应用或限制功能
            uni.exit()
          }
        }
      })
    },
    
    initApp() {
      console.log('初始化应用功能')
    }
  }
}
```

## 🧭 页面和路由

### 📄 页面导航

uni-app 提供了丰富的页面导航 API：

```typescript
/**
 * 🎯 保留当前页面，跳转到应用内的某个页面
 * @param url 页面路径
 * @param animationType 窗口显示的动画类型
 * @param events 页面间通信接口，用于监听被打开页面发送到当前页面的数据
 * @param success 成功回调
 * @param fail 失败回调
 * @param complete 完成回调
 */
uni.navigateTo({
  url: '/pages/detail/detail?id=123',
  animationType: 'slide-in-right',
  events: {
    // 监听被打开页面发送的数据
    acceptDataFromOpenedPage: function(data) {
      console.log('接收到数据:', data)
    }
  },
  success: (res) => {
    // 向被打开页面发送数据
    res.eventChannel.emit('acceptDataFromOpenerPage', {
      data: 'from opener page'
    })
  }
})
```

### 🎯 路由导航方法对比

| API | 功能 | 页面栈变化 | 使用场景 |
|-----|------|------------|----------|
| **uni.navigateTo()** | 保留当前页面，跳转到新页面 | 📈 页面栈+1 | 🎯 详情页、表单页 |
| **uni.redirectTo()** | 关闭当前页面，跳转到新页面 | 🔄 页面栈不变 | 🔄 登录后跳转首页 |
| **uni.reLaunch()** | 关闭所有页面，跳转到新页面 | 🔄 页面栈重置为1 | 🚀 重新启动应用 |
| **uni.switchTab()** | 跳转到 tabBar 页面 | 🔄 页面栈重置 | 📱 底部导航切换 |
| **uni.navigateBack()** | 返回上一页面 | 📉 页面栈-1 | ⬅️ 返回操作 |

```typescript
// 🎯 各种导航方式示例
  export default {
    methods: {
    // 📄 跳转到详情页
    goToDetail(id: string) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    },
    
    // 🔄 重定向到首页
    redirectToHome() {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    },
    
    // 🚀 重新启动应用
    restartApp() {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    },
    
    // 📱 切换到首页 Tab
    switchToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    
    // ⬅️ 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1 // 返回层数，默认为1
      })
    }
  }
}
```

### 🔄 页面间通信

```typescript
// 📤 发送页面：打开新页面并传递数据
uni.navigateTo({
  url: '/pages/detail/detail',
  events: {
    // 监听被打开页面发送的数据
    receiveData: function(data) {
      console.log('收到详情页数据:', data)
    }
  },
  success: function(res) {
    // 向被打开页面发送数据
    res.eventChannel.emit('sendData', {
      message: 'Hello from opener page',
      timestamp: Date.now()
    })
  }
})

// 📥 接收页面：接收数据并回传
export default {
  onLoad() {
    // 获取页面间通信通道
    const eventChannel = this.getOpenerEventChannel()
    
    // 监听来自打开页面的数据
    eventChannel.on('sendData', (data) => {
      console.log('收到打开页面数据:', data)
      this.handleReceivedData(data)
      
      // 向打开页面回传数据
      eventChannel.emit('receiveData', {
        status: 'received',
        processedAt: Date.now()
      })
    })
  },
  
  methods: {
    handleReceivedData(data) {
      // 处理接收到的数据
      this.receivedMessage = data.message
    }
  }
}
```

## 📊 最佳实践

### ✅ API 使用建议

::: tip 🎯 开发建议
- ✅ 合理使用事件总线，避免内存泄漏
- ✅ 网络请求要做错误处理和超时设置
- ✅ 页面导航要考虑用户体验和性能
- ✅ 使用拦截器统一处理公共逻辑
- ✅ 注意平台差异，使用条件编译
:::

### ⚠️ 注意事项

::: warning ⚠️ 常见问题
- ❌ 避免在页面卸载后继续监听事件
- ❌ 不要过度使用 reLaunch，影响用户体验
- ❌ 注意页面栈层数限制（通常为10层）
- ❌ 小心处理异步操作的生命周期
:::

### 🚀 性能优化

| 优化点 | 建议 | 实现方式 |
|--------|------|----------|
| **事件管理** | 及时移除监听器 | 🧹 在页面卸载时清理 |
| **网络请求** | 使用请求缓存 | 💾 避免重复请求 |
| **页面导航** | 预加载关键页面 | 🚀 提升用户体验 |
| **内存管理** | 避免循环引用 | 🔄 合理管理对象引用 |

---

通过本指南，你已经全面掌握了 uni-app 的核心 API 接口。这些 API 为你的应用提供了强大的功能支持，从基础的页面导航到复杂的数据通信，都能找到合适的解决方案。记住要关注平台差异、错误处理和性能优化，以确保应用的稳定性和用户体验。
