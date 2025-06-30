---
title: 🚀 Taro API 接口完全指南
description: 深入掌握 Taro 框架的丰富 API 接口，包括状态管理、路由导航、系统能力、网络请求等核心功能
outline: deep
---

# 🚀 Taro API 接口完全指南

> 全面掌握 Taro 框架提供的丰富 API 接口，从基础的页面管理到复杂的系统能力调用，让你的跨端应用功能更加强大。

::: tip 📚 本章内容
详细介绍 Taro 的各类 API 接口，包含实际代码示例和最佳实践，涵盖状态管理、路由、系统能力等方面。
:::

## 🎯 核心 API 概览

### 📦 状态管理和路由

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Pinia** | 现代状态管理库 | 🏪 全局状态管理 |
| **useRouter()** | 获取当前路由器 | 🧭 路由信息获取 |
| **@tarojs/plugin-html** | HTML 元素支持 | 🌐 使用原生 HTML 标签 |
| **NutUI** | 京东风格组件库 | 🧩 移动端 UI 组件 |

### 🎯 获取路由信息

```typescript
import { useRouter } from '@tarojs/taro'
// 或者使用
import Taro from '@tarojs/taro'

// 🧭 获取路由信息
const router = useRouter()
// 等价于
const router = Taro.getCurrentInstance().router

console.log('当前页面路径:', router.path)
console.log('页面参数:', router.params)
```

## 🔐 权限管理

### 📱 系统权限申请

| API | 功能 | 权限类型 |
|-----|------|----------|
| **Taro.authorize()** | 申请系统权限 | 🎯 各种系统权限 |
| **Taro.getSetting()** | 查询授权状态 | 🔍 权限状态检查 |

#### 🎯 权限类型对照表

| 权限 scope | 功能 | 使用场景 |
|------------|------|----------|
| **scope.writePhotosAlbum** | 写入相册权限 | 📷 保存图片到相册 |
| **scope.record** | 录音权限 | 🎤 音频录制功能 |
| **scope.address** | 用户地址权限 | 📍 获取收货地址 |

```typescript
// 🔐 权限管理示例
export default {
  methods: {
    // 📷 申请相册写入权限
    async requestPhotoPermission() {
      try {
        await Taro.authorize({
          scope: "scope.writePhotosAlbum"
        })
        console.log('相册权限申请成功')
      } catch (error) {
        console.log('用户拒绝授权', error)
        this.showAuthDialog('相册权限')
      }
    },
    
    // 🎤 申请录音权限
    async requestRecordPermission() {
      try {
        await Taro.authorize({
          scope: "scope.record"
        })
        console.log('录音权限申请成功')
        this.startRecord()
      } catch (error) {
        console.log('录音权限被拒绝', error)
      }
    },
    
    // 📍 申请地址权限
    async requestAddressPermission() {
      try {
        await Taro.authorize({
          scope: "scope.address"
        })
        console.log('地址权限申请成功')
      } catch (error) {
        console.log('地址权限被拒绝', error)
      }
    },
    
    // 🔍 检查权限状态
    checkPermissions() {
      Taro.getSetting({
        success: (res) => {
          console.log('权限状态:', res.authSetting)
          if (res.authSetting['scope.writePhotosAlbum']) {
            console.log('已获得相册权限')
          }
          if (res.authSetting['scope.record']) {
            console.log('已获得录音权限')
          }
        }
      })
    }
  }
}
```

## 🎭 交互反馈

### 💬 消息提示

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.showToast()** | 显示提示框 | ✅ 操作成功提示 |
| **Taro.hideToast()** | 隐藏提示框 | ❌ 手动关闭提示 |
| **Taro.showModal()** | 显示模态对话框 | ❓ 确认操作 |
| **Taro.showLoading()** | 显示加载提示 | ⏳ 加载状态 |
| **Taro.hideLoading()** | 隐藏加载提示 | ✅ 加载完成 |
| **Taro.showActionSheet()** | 显示操作菜单 | 📋 多选项操作 |

```typescript
// 🎭 交互反馈示例
export default {
  methods: {
    // ✅ 成功提示
    showSuccessToast() {
      Taro.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
    },
    
    // ❌ 错误提示
    showErrorToast() {
      Taro.showToast({
        title: '操作失败',
        icon: 'error',
        duration: 2000
      })
    },
    
    // ❓ 确认对话框
    showConfirmModal() {
      Taro.showModal({
        title: '确认删除',
        content: '删除后无法恢复，是否继续？',
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#ff4757',
        success: (res) => {
          if (res.confirm) {
            console.log('用户确认删除')
            this.deleteItem()
          } else {
            console.log('用户取消删除')
          }
        }
      })
    },
    
    // ⏳ 加载状态
    showLoadingState() {
      Taro.showLoading({
        title: '加载中...',
        mask: true
      })
      
      // 模拟异步操作
      setTimeout(() => {
        Taro.hideLoading()
        this.showSuccessToast()
      }, 3000)
    },
    
    // 📋 操作菜单
    showActionMenu() {
      Taro.showActionSheet({
        itemList: ['拍照', '从相册选择', '取消'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              console.log('用户选择拍照')
              this.takePhoto()
              break
            case 1:
              console.log('用户选择相册')
              this.chooseFromAlbum()
              break
            default:
              console.log('用户取消')
          }
        }
      })
    }
  }
}
```

### 🚪 页面返回询问

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.enableAlertBeforeUnload()** | 开启返回询问 | 🛡️ 防止误操作 |
| **Taro.disableAlertBeforeUnload()** | 关闭返回询问 | ✅ 恢复正常返回 |

```typescript
// 🚪 页面返回确认
export default {
  onLoad() {
    // 🛡️ 开启返回询问
    Taro.enableAlertBeforeUnload({
      message: '确定要离开当前页面吗？未保存的内容将丢失。'
    })
  },
  
  onUnload() {
    // ✅ 页面卸载时关闭询问
    Taro.disableAlertBeforeUnload()
  },
  
  methods: {
    // 💾 保存完成后关闭询问
    saveData() {
      // 保存逻辑...
      Taro.disableAlertBeforeUnload()
      Taro.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  }
}
```

## 📱 设备操作

### 📷 图片和媒体

| API | 功能 | 参数 |
|-----|------|------|
| **Taro.saveImageToPhotoAlbum()** | 保存图片到相册 | filePath, success, fail |
| **Taro.chooseImage()** | 选择图片或拍照 | count, success, fail |
| **Taro.showShareImageMenu()** | 显示分享图片弹窗 | path |

```typescript
// 📷 图片操作示例
export default {
  methods: {
    // 📸 选择或拍照
    async chooseImage() {
      try {
        const res = await Taro.chooseImage({
          count: 3, // 最多选择3张
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        })
        
        console.log('选择的图片:', res.tempFilePaths)
        this.uploadImages(res.tempFilePaths)
      } catch (error) {
        console.error('选择图片失败:', error)
      }
    },
    
    // 💾 保存图片到相册
    async saveToAlbum(imagePath: string) {
      try {
        // 先申请权限
        await Taro.authorize({
          scope: "scope.writePhotosAlbum"
        })
        
        // 保存图片
        await Taro.saveImageToPhotoAlbum({
          filePath: imagePath
        })
        
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存失败:', error)
        Taro.showToast({
          title: '保存失败',
          icon: 'error'
        })
      }
    },
    
    // 📤 分享图片
    shareImage(imageUrl: string) {
      Taro.showShareImageMenu({
        path: imageUrl,
        success: () => {
          console.log('分享成功')
        },
        fail: (error) => {
          console.error('分享失败:', error)
        }
      })
    }
  }
}
```

### 👤 用户信息

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.getUserProfile()** | 获取用户信息 | 👤 用户登录 |
| **Taro.chooseAddress()** | 选择用户地址 | 📍 收货地址 |
| **Taro.getWeRunData()** | 获取微信运动信息 | 🏃 运动数据 |

```typescript
// 👤 用户信息获取
export default {
  methods: {
    // 👤 获取用户信息
    async getUserProfile() {
      try {
        const res = await Taro.getUserProfile({
          desc: '用于完善用户资料'
        })
        
        console.log('用户信息:', res.userInfo)
        this.userInfo = res.userInfo
        
        // 可以将用户信息发送到服务器
        this.updateUserInfo(res.userInfo)
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    // 📍 选择收货地址
    async chooseAddress() {
      try {
        const res = await Taro.chooseAddress()
        
        console.log('选择的地址:', res)
        this.deliveryAddress = {
          name: res.userName,
          phone: res.telNumber,
          address: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`,
          postalCode: res.postalCode
        }
      } catch (error) {
        console.error('选择地址失败:', error)
      }
    },
    
    // 🏃 获取微信运动数据
    async getWeRunData() {
      try {
        const res = await Taro.getWeRunData()
        
        console.log('微信运动数据:', res)
        // 解析运动数据
        this.parseWeRunData(res.encryptedData, res.iv)
      } catch (error) {
        console.error('获取运动数据失败:', error)
      }
    }
  }
}
```

### 🔊 音频操作

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.startRecord()** | 开始录音 | 🎤 语音录制 |
| **Taro.playBackgroundAudio()** | 播放背景音乐 | 🎵 音频播放 |

```typescript
// 🔊 音频操作示例
export default {
  methods: {
    // 🎤 开始录音
    async startRecord() {
      try {
        // 先申请录音权限
        await Taro.authorize({
          scope: "scope.record"
        })
        
        // 开始录音
        Taro.startRecord({
          success: (res) => {
            console.log('录音成功:', res.tempFilePath)
            this.audioPath = res.tempFilePath
          },
          fail: (error) => {
            console.error('录音失败:', error)
          }
        })
      } catch (error) {
        console.error('录音权限申请失败:', error)
      }
    },
    
    // 🎵 播放背景音乐
    playBackgroundAudio() {
      Taro.playBackgroundAudio({
        title: '背景音乐',
        coverImgUrl: 'https://example.com/cover.jpg',
        dataUrl: 'https://example.com/music.mp3',
        success: () => {
          console.log('音乐播放成功')
        },
        fail: (error) => {
          console.error('音乐播放失败:', error)
        }
      })
    }
  }
}
```

## 🎨 界面操作

### 🧭 导航栏

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.setNavigationBarTitle()** | 设置导航栏标题 | 📝 动态标题 |
| **Taro.setTabBarBadge()** | 设置标签栏徽章 | 🔴 消息提醒 |

```typescript
// 🧭 导航栏操作
export default {
  methods: {
    // 📝 设置导航栏标题
    setTitle(title: string) {
      Taro.setNavigationBarTitle({
        title: title
      })
    },
    
    // 🔴 设置 TabBar 徽章
    setTabBarBadge(index: number, text: string) {
      Taro.setTabBarBadge({
        index: index,
        text: text
      })
    },
    
    // 🎬 创建动画
    createAnimation() {
      const animation = Taro.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in-out',
        delay: 0,
        transformOrigin: '50% 50%'
      })
      
      animation.scale(1.2).rotate(45).step()
      animation.scale(1).rotate(0).step()
      
      this.animationData = animation.export()
    }
  }
}
```

## 📤 分享功能

### 🔗 分享和转发

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.shareFileMessage()** | 分享文件到聊天 | 📎 文件分享 |
| **Taro.showShareMenu()** | 显示转发按钮 | 📤 页面分享 |
| **Taro.shareVideoMessage()** | 转发视频到聊天 | 🎥 视频分享 |
| **Taro.onCopyUrl()** | 监听复制链接 | 🔗 链接复制 |
| **Taro.hideShareMenu()** | 隐藏转发按钮 | ❌ 禁止分享 |
| **Taro.getShareInfo()** | 获取转发详细信息 | 📊 分享统计 |

```typescript
// 📤 分享功能示例
export default {
  onLoad() {
    // 📤 显示分享按钮
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    
    // 🔗 监听复制链接
    Taro.onCopyUrl((res) => {
      console.log('用户复制了链接:', res.query)
      return {
        title: '页面标题',
        path: '/pages/index/index'
      }
    })
  },
  
  methods: {
    // 📎 分享文件
    shareFile(filePath: string, fileName: string) {
      Taro.shareFileMessage({
        filePath: filePath,
        fileName: fileName,
        success: () => {
          console.log('文件分享成功')
        },
        fail: (error) => {
          console.error('文件分享失败:', error)
        }
      })
    },
    
    // 🎥 分享视频
    shareVideo(videoPath: string) {
      Taro.shareVideoMessage({
        videoPath: videoPath,
        thumbPath: 'video-thumb.jpg',
        success: () => {
          console.log('视频分享成功')
        },
        fail: (error) => {
          console.error('视频分享失败:', error)
        }
      })
    }
  },
  
  // 📤 自定义分享内容
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/detail/detail?id=123',
      imageUrl: 'https://example.com/share-image.jpg'
    }
  }
}
```

## 🖥️ 系统和设备信息

### 📱 系统能力

| API | 功能 | 返回信息 |
|-----|------|----------|
| **Taro.getCurrentInstance()** | 获取当前页面实例 | 页面实例对象 |
| **Taro.getEnv()** | 获取当前环境值 | 运行环境类型 |
| **Taro.getSystemInfo()** | 获取系统信息 | 设备和系统信息 |
| **Taro.getAppInfo()** | 获取小程序 App 信息 | 应用信息 |
| **Taro.getBatteryInfo()** | 获取设备电量信息 | 电池状态 |

```typescript
// 🖥️ 系统信息获取
export default {
  methods: {
    // 📱 获取系统信息
    async getSystemInfo() {
      try {
        const res = await Taro.getSystemInfo()
        console.log('系统信息:', {
          brand: res.brand,
          model: res.model,
          system: res.system,
          platform: res.platform,
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      } catch (error) {
        console.error('获取系统信息失败:', error)
      }
    },
    
    // 🔋 获取电池信息
    async getBatteryInfo() {
      try {
        const res = await Taro.getBatteryInfo()
        console.log('电池信息:', {
          level: res.level,
          isCharging: res.isCharging
        })
        
        if (res.level < 20) {
          Taro.showToast({
            title: '电量不足，请及时充电',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取电池信息失败:', error)
      }
    },
    
    // 🌐 获取当前环境
    getCurrentEnv() {
      const env = Taro.getEnv()
      console.log('当前环境:', env)
      
      switch (env) {
        case Taro.ENV_TYPE.WEAPP:
          console.log('微信小程序环境')
          break
        case Taro.ENV_TYPE.ALIPAY:
          console.log('支付宝小程序环境')
          break
        case Taro.ENV_TYPE.H5:
          console.log('H5 环境')
          break
        case Taro.ENV_TYPE.RN:
          console.log('React Native 环境')
          break
        default:
          console.log('未知环境')
      }
    }
  }
}
```

### 🔧 工具方法

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.pxTransform()** | 尺寸转换 | 📏 响应式布局 |
| **Taro.initPxTransform()** | 尺寸转换初始化 | ⚙️ 自定义转换规则 |
| **Taro.base64ToArrayBuffer()** | Base64 转 ArrayBuffer | 🔄 数据格式转换 |
| **Taro.arrayBufferToBase64()** | ArrayBuffer 转 Base64 | 🔄 数据格式转换 |

```typescript
// 🔧 工具方法使用
export default {
  onLoad() {
    // ⚙️ 初始化尺寸转换
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    })
  },
  
  methods: {
    // 📏 尺寸转换
    convertSize() {
      const rpxValue = 100
      const pxValue = Taro.pxTransform(rpxValue)
      console.log(`${rpxValue}rpx = ${pxValue}px`)
    },
    
    // 🔄 数据格式转换
    convertData() {
      const base64 = 'SGVsbG8gV29ybGQ='
      const arrayBuffer = Taro.base64ToArrayBuffer(base64)
      const convertedBase64 = Taro.arrayBufferToBase64(arrayBuffer)
      
      console.log('原始 Base64:', base64)
      console.log('转换后 Base64:', convertedBase64)
    }
  }
}
```

## 💰 支付功能

### 💳 微信支付

| API | 功能 | 使用场景 |
|-----|------|----------|
| **Taro.requestPayment()** | 发起微信支付 | 💰 商品购买 |
| **Taro.requestOrderPayment()** | 创建订单并支付 | 🛒 订单支付 |
| **Taro.faceVerifyForPay()** | 支付人脸验证 | 🔐 安全验证 |

```typescript
// 💰 支付功能示例
export default {
  methods: {
    // 💳 发起支付
    async requestPayment(paymentData) {
      try {
        await Taro.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: paymentData.signType,
          paySign: paymentData.paySign
        })
        
        console.log('支付成功')
        this.handlePaymentSuccess()
      } catch (error) {
        console.error('支付失败:', error)
        this.handlePaymentFail(error)
      }
    },
    
    // 🛒 创建订单并支付
    async createOrderAndPay(orderInfo) {
      try {
        await Taro.requestOrderPayment({
          orderInfo: orderInfo
        })
        
        console.log('订单支付成功')
      } catch (error) {
        console.error('订单支付失败:', error)
      }
    }
  }
}
```

## 💾 数据存储

### 🗄️ 本地存储

| API | 功能 | 特点 |
|-----|------|------|
| **Taro.setStorage()** | 异步存储数据 | 🔄 异步操作 |
| **Taro.getStorage()** | 异步获取数据 | 🔄 异步操作 |
| **Taro.removeStorage()** | 异步删除数据 | 🗑️ 删除指定key |
| **Taro.clearStorage()** | 清空所有数据 | 🧹 清空缓存 |

```typescript
// 💾 数据存储示例
export default {
  methods: {
    // 💾 存储数据
    async saveData(key: string, data: any) {
      try {
        await Taro.setStorage({
          key: key,
          data: data
        })
        console.log('数据存储成功')
      } catch (error) {
        console.error('数据存储失败:', error)
      }
    },
    
    // 📖 读取数据
    async loadData(key: string) {
      try {
        const res = await Taro.getStorage({
          key: key
        })
        console.log('读取数据成功:', res.data)
        return res.data
      } catch (error) {
        console.error('读取数据失败:', error)
        return null
      }
    },
    
    // 🗑️ 删除数据
    async removeData(key: string) {
      try {
        await Taro.removeStorage({
          key: key
        })
        console.log('数据删除成功')
      } catch (error) {
        console.error('数据删除失败:', error)
      }
    },
    
    // 🧹 清空所有数据
    async clearAllData() {
      try {
        await Taro.clearStorage()
        console.log('所有数据清空成功')
      } catch (error) {
        console.error('清空数据失败:', error)
      }
    }
  }
}
```

## 🎯 实际应用示例

### 📱 完整页面示例

```vue
<template>
  <scroll-view :scrollY="true">
    <list-view>
      <!-- 🎯 技术栈介绍 -->
      <view class="navigate">
        运用技术: taro 3.6 + taroUI + vue3 + TS + babel
      </view>
      <view class="navigate">使用 Eslint 进行代码风格检查</view>
      <view class="navigate">使用 axios 工具，请求远程跨域数据</view>
      <view class="navigate">使用 pinia，全局状态管理</view>
      <view class="navigate">使用 vue-router 路由管理</view>
      <view class="navigate">使用 @tarojs/plugin-html 支持 HTML 元素开发</view>
      <view class="navigate">基于 @tarojs/cli 内置 webpack5 打包构建</view>
      <view class="navigate">NutUI 京东风格的轻量级移动端组件库</view>
    </list-view>
    
    <!-- 🧩 UI 组件展示 -->
    <nut-button>这是 @nutui/nutui-taro 4.2.3 版本的 nut-button 组件</nut-button>
    <nut-cell
      title="展示弹出层"
      sub-title="副标题描述"
      desc="描述文字"
      is-link
      @click="show = true">
    </nut-cell>
    <nut-popup :style="{ padding: '30px 50px' }" v-model:visible="show">
      正文
    </nut-popup>
    
    <!-- 📊 状态管理展示 -->
    <grid-view
      type="aligned"
      :main-axis-gap="1"
      :cross-axis-count="2"
      :cross-axis-gap="1"
      :max-cross-axis-extent="0">
      <button type="primary" :plain="true">
        Pinia数据：{{ counter.count }}
      </button>
      <button type="warn" size="default" @tap="onAdd">点击++</button>
    </grid-view>
    
    <!-- 🎯 功能按钮组 -->
    <button :class="styles.test" type="primary" @tap="tapHandle">
      分享图片
    </button>
    <button type="warn" @tap="tapDownload">下载图片,保存到系统相册</button>
    <button type="warn" @tap="chooseImage">选择或者拍照三张图片</button>
    <button type="primary" :plain="true" @tap="tapSendFile">
      转发文件到聊天
    </button>
    <button type="warn" @tap="setTitle">设置导航title</button>
    <button type="primary" @tap="setTabBarBadge">第一个tab显示Badge</button>
    <button type="primary" @tap="playBackgroundAudio">播放背景音乐</button>
    <button type="primary" @tap="getUserProfile">
      getUserProfile获取用户信息
    </button>
    <button type="primary" @tap="authorizeForMiniProgram">
      获取录音权限后，开始录音
    </button>
    <button type="primary" @tap="chooseAddress">获取用户收货地址</button>
    <button type="primary" @tap="getWeRunData">
      获取用户过去三十天微信运动步数
    </button>
    <button type="primary" @tap="showRedPackage">拉取h5领取红包封面页</button>
    <button type="primary" @tap="getBatteryInfo">获取设备电量</button>
    
    <!-- 📌 吸顶组件 -->
    <stick-section>StickySection</stick-section>
    <stick-header>StickyHeader</stick-header>
  </scroll-view>
</template>

<script setup>
// 🎯 Taro 内置的 Composition API
import Taro, {
  useDidShow,
  useRouter,
  useLoad,
  useReady,
  useDidHide,
  useUnload,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useShareTimeline,
  useAddToFavorites,
  useSaveExitState,
} from "@tarojs/taro"

import { ref } from "vue"
import "./index.scss"
import { useCounterStore } from "@/store/index"
import styles from "@/assets/style/test.module.scss"

// 📊 状态管理
const counter = useCounterStore()
const onAdd = () => counter.count++

// 🧭 路由信息
const router = useRouter() // = Taro.getCurrentInstance.router

// 📱 响应式数据
const title = ref(0)
const show = ref(false)

// 🌐 环境变量
const env = process.env.NODE_ENV
const name = process.env.TARO_APP_NAME
const type = process.env.TARO_ENV

// 🎪 生命周期钩子
useDidShow(() => console.log("onShow"))
useLoad(() => console.log("onLoad"))
useReady(() => {
  // 🎯 使用 Taro.createSelectorQuery API 获取节点信息
  // 初次渲染时，在小程序触发 onReady 后，才能获取小程序的渲染层节点
  Taro.createSelectorQuery()
    .select("#target")
    .boundingClientRect()
    .exec(res => console.log("createSelectorQuery", res))
})

// 🎯 功能方法
const tapDownload = function () {
  // 没有授权的话，弹窗请示授权
  Taro.authorize({
    scope: "scope.writePhotosAlbum",
    success: function () {
      Taro.showToast({
        title: "已经得到授权，正在保存中",
        icon: "success",
        duration: 3000,
      });
      Taro.saveImageToPhotosAlbum({
        filePath: "../../assets/img/1.jpg", // 下载url
        // filePath: "https://photo.16pic.com/00/26/49/16pic_2649388_b.jpg", // 不能使用网络图片
        success(res) {
          console.log("图片下载成功");
        },
        fail: console.error,
      });
    },
  });
};
const chooseImage = function () {
  Taro.chooseImage({
    count: 3, // 下载url
    success(res) {
      console.log("图片下载成功");
    },
    fail: console.error,
  });
};
const tapHandle = function () {
  Taro.showShareImageMenu({
    path: "../../assets/img/1.jpg",
  });
};
const getUserProfile = function () {
  Taro.getUserProfile({
    desc: "获取个人信息用于页面展示效果",
    success(res) {
      console.log("获取个人信息成功", res);
      Taro.showToast({
        title: `获取个人信息:${res.rawData}`,
        icon: "success",
        duration: 3000,
      });
    },
  });
};
const chooseAddress = function () {
  // Taro.requirePrivacyAuthorize({success(res){console.log('requirePrivacyAuthorize',res);}})
  // 没有授权的话，弹窗请示授权
  Taro.authorize({
    scope: "scope.address",
    success: function () {
      // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
      Taro.showToast({
        title: "已经得到地址权限。",
        icon: "success",
        duration: 3000,
      });
      Taro.chooseAddress({
        success(res) {
          console.log("获取用户收货地址成功", res);
        },
      });
    },
  });
};
const getWeRunData = function () {
  Taro.getWeRunData({
    success(res) {
      console.log("获取用户过去三十天微信运动步数成功", res);
      Taro.showToast({
        title: res,
        icon: "success",
        duration: 3000,
      });
    },
  });
};
const getBatteryInfo = function () {
  Taro.getBatteryInfo({
    success(res) {
      console.log("获取设备电量成功", res);
      Taro.showToast({
        title: `电量是${res.level}`,
        icon: "success",
        duration: 3000,
      });
    },
  });
};
const showRedPackage = function () {
  Taro.showRedPackage({
    url: "https://photo.16pic.com/00/26/49/16pic_2649388_b.jpg",
    success(res) {
      console.log("拉取h5领取红包封面页", res);
    },
    fail(res) {
      console.log("拉取h5领取红包封面页失败", res);
    },
  });
};
const authorizeForMiniProgram = function () {
  Taro.getSetting({
    // // 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    success: function (res) {
      console.log("Taro.getSetting success", res);
      if (!res.authSetting["scope.record"]) {
        // 没有授权的话，弹窗请示授权
        Taro.authorize({
          scope: "scope.record",
          success: function () {
            // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
            Taro.showToast({
              title: "已经得到录音权限，正在录音中。。。。",
              icon: "success",
              duration: 3000,
            });
            Taro.startRecord();
          },
        });
      } else {
        Taro.showToast({
          title: "已经得到录音权限，正在录音中。。。。",
          icon: "success",
          duration: 3000,
        });
        Taro.startRecord();
      }
    },
  });
};
const playBackgroundAudio = function () {
  Taro.playBackgroundAudio({
    title: "这是背景音乐标题",
    coverImgUrl: "https://photo.16pic.com/00/26/49/16pic_2649388_b.jpg",
    dataUrl: "https://music.163.com/song/media/outer/url?id=95475.mp3",
  });
};
const setTitle = function () {
  Taro.setNavigationBarTitle({
    title: `这是新的title ${title.value++}`,
  });
};
const setTabBarBadge = function () {
  Taro.setTabBarBadge({
    text: "Badge",
    index: 0,
  });
};
const animation = function () {
  const animationInstance = Taro.createAnimation({
    transformOrigin: "50% 50%",
    duration: 3000,
    timingFunction: "ease",
    delay: 0,
  });
  animationInstance
    .width(200)
    .height(200)
    .backgroundColor("#777777")
    .matrix3d(11, 22, 33, 44, 11, 22, 33, 44, 11, 22, 33, 44, 11, 22, 33, 44)
    .export();
};

const tapSendFile = function () {
  Taro.shareFileMessage({
    // filePath: "../../assets/img/1.jpg",
    filePath: "https://photo.16pic.com/00/26/49/16pic_2649388_b.jpg",
    fileName: "这是文件名",
    success() {
      console.log("分享图片成功");
    },
  });
};

usePullDownRefresh(() => console.log("usePullDownRefresh"));</script>

<style scoped>
.navigate {
  padding: 20rpx;
  margin: 10rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}
</style>
```

## 🎯 最佳实践

### ✅ API 使用建议

::: tip 🎯 开发建议
- ✅ 合理使用权限申请，提升用户体验
- ✅ 错误处理要完善，提供友好的错误提示
- ✅ 异步操作使用 async/await 语法
- ✅ 注意不同平台的 API 差异
- ✅ 使用 TypeScript 提升代码质量
:::

### ⚠️ 注意事项

::: warning ⚠️ 常见问题
- ❌ 避免频繁调用系统 API 影响性能
- ❌ 注意权限申请的时机和方式
- ❌ 小心处理异步操作的错误情况
- ❌ 避免在不合适的生命周期调用 API
:::

### 🚀 性能优化

| 优化点 | 建议 | 实现方式 |
|--------|------|----------|
| **API 调用** | 合并同类操作 | 🎯 批量处理减少调用次数 |
| **权限管理** | 统一权限检查 | 🔐 封装权限管理模块 |
| **错误处理** | 全局错误拦截 | 🛡️ 统一错误处理机制 |
| **缓存策略** | 合理使用缓存 | 💾 减少重复数据请求 |

---

通过本指南，你已经全面掌握了 Taro 框架的核心 API 接口。这些 API 为你的跨端应用提供了强大的功能支持，从基础的交互反馈到复杂的系统能力调用，都能找到合适的解决方案。记住要关注平台差异、错误处理和性能优化，以确保应用在各个平台上的稳定性和用户体验。