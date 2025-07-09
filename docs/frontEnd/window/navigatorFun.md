# Navigator 方法开发指南

Navigator 对象提供了丰富的浏览器和设备功能访问接口，本文档详细介绍了各种 Navigator 方法的使用方法和最佳实践。

## 目录导航

1. [概述](#1-概述)
2. [应用徽章管理](#2-应用徽章管理)
3. [原生分享功能](#3-原生分享功能)
4. [媒体播放策略](#4-媒体播放策略)
5. [设备状态监控](#5-设备状态监控)
6. [游戏控制器支持](#6-游戏控制器支持)
7. [应用程序检测](#7-应用程序检测)
8. [协议处理程序](#8-协议处理程序)
9. [媒体加密访问](#9-媒体加密访问)
10. [MIDI 设备控制](#10-midi-设备控制)
11. [数据传输 API](#11-数据传输-api)
12. [设备振动控制](#12-设备振动控制)

## 1. 概述

Navigator 对象是浏览器提供的全局对象，包含了关于浏览器和设备的信息以及各种功能的访问接口。通过 Navigator 的方法，开发者可以访问设备硬件、管理应用状态、处理媒体内容等。

## 2. 应用徽章管理

### 2.1 setAppBadge & clearAppBadge

应用徽章功能允许 Web 应用在应用图标上显示通知数量或状态指示器。

#### 2.1.1 功能说明

- `setAppBadge()` 方法在与此应用关联的图标上设置徽章
- `clearAppBadge()` 方法清除当前应用程序图标上的徽章

#### 2.1.2 方法签名

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `setAppBadge()` | 无 | Promise&lt;void&gt; | 显示默认徽章（通常为点） |
| `setAppBadge(count)` | number | Promise&lt;void&gt; | 显示指定数字的徽章 |
| `clearAppBadge()` | 无 | Promise&lt;void&gt; | 清除徽章显示 |

#### 2.1.3 使用示例

```javascript
/**
 * 设置应用徽章
 * @param {number} count - 徽章显示的数值，如果为 0 表示清除徽章
 */
// 显示默认徽章
navigator.setAppBadge();

// 显示数字徽章
navigator.setAppBadge(5);

// 清除徽章
navigator.clearAppBadge();
```

## 3. 原生分享功能

### 3.1 canShare & share

原生分享功能允许 Web 应用调用设备的原生分享机制来共享内容。

#### 3.1.1 功能说明

- `canShare()` 方法测试共享是否将会成功，必须由 UI 事件触发（瞬态激活状态）
- `share()` 方法调用设备的本机共享机制来共享文本、URL 或文件等数据

> **注意**：此功能仅在安全上下文（HTTPS）中可用，并需要 `web-share` 权限。

#### 3.1.2 数据格式

| 属性 | 类型 | 描述 |
|------|------|------|
| `url` | string | 要共享的 URL |
| `text` | string | 要共享的文本内容 |
| `title` | string | 要共享的标题 |
| `files` | File[] | 要共享的文件数组 |

#### 3.1.3 使用示例

```javascript
/**
 * 原生分享功能实现
 * @param {Object} data - 包含要共享的数据对象
 */
async function shareContent() {
  const shareData = {
    files: [/* File objects */],
    title: "图像",
    text: "美丽的图像",
    url: "https://example.com"
  };

  // 检测分享功能支持
  if (navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      console.log("分享成功");
    } catch (error) {
      console.error("分享失败:", error);
    }
  } else {
    console.log("您的系统不支持共享这些文件");
  }
}
```

## 4. 媒体播放策略

### 4.1 getAutoplayPolicy

检测浏览器对特定媒体内容的自动播放策略。

#### 4.1.1 方法重载

| 方法签名 | 参数类型 | 描述 |
|----------|----------|------|
| `getAutoplayPolicy(type)` | string | 检测媒体类型的自动播放策略 |
| `getAutoplayPolicy(element)` | HTMLMediaElement | 检测特定媒体元素的策略 |
| `getAutoplayPolicy(context)` | AudioContext | 检测音频上下文的策略 |

#### 4.1.2 参数说明

**type 参数值**：
- `mediaelement`: 获取文档中媒体元素的自动播放策略
- `audiocontext`: 获取 Web Audio API 播放器的自动播放策略

**返回值**：
- `allowed`: 允许自动播放
- `allowed-muted`: 仅允许静音媒体自动播放
- `disallowed`: 不允许自动播放

#### 4.1.3 使用示例

```javascript
/**
 * 检测媒体自动播放策略
 */
const video = document.getElementById("video_element_id");

// 检测特定视频元素的自动播放策略
const policy = navigator.getAutoplayPolicy(video);

switch (policy) {
  case "allowed":
    console.log("允许自动播放");
    video.play();
    break;
  case "allowed-muted":
    console.log("仅允许静音自动播放");
    video.muted = true;
    video.play();
    break;
  case "disallowed":
    console.log("不允许自动播放，需要用户交互");
    break;
}
```

## 5. 设备状态监控

### 5.1 getBattery

获取设备电池状态信息，返回 BatteryManager 对象用于监控电池状态。

> **注意**：需要提前授予电池访问权限。

#### 5.1.1 BatteryManager 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `charging` | boolean | 电池是否正在充电 |
| `level` | number | 电池电量（0-1） |
| `chargingTime` | number | 充满电所需时间（秒） |
| `dischargingTime` | number | 电池续航时间（秒） |

#### 5.1.2 BatteryManager 事件

| 事件 | 描述 |
|------|------|
| `chargingchange` | 充电状态改变时触发 |
| `levelchange` | 电量水平改变时触发 |
| `chargingtimechange` | 充电时间改变时触发 |
| `dischargingtimechange` | 续航时间改变时触发 |

#### 5.1.3 使用示例

```javascript
/**
 * 电池状态监控
 */
navigator.getBattery().then(battery => {
  // 监听充电状态变化
  battery.addEventListener("chargingchange", () => {
    console.log(`电池是否充电中？${battery.charging ? "是" : "否"}`);
  });

  // 监听电量变化
  battery.addEventListener("levelchange", () => {
    console.log(`电池电量：${Math.round(battery.level * 100)}%`);
  });

  // 监听充电时间变化
  battery.addEventListener("chargingtimechange", () => {
    const hours = Math.floor(battery.chargingTime / 3600);
    const minutes = Math.floor((battery.chargingTime % 3600) / 60);
    console.log(`充电时间：${hours}小时${minutes}分钟`);
  });

  // 监听续航时间变化
  battery.addEventListener("dischargingtimechange", () => {
    const hours = Math.floor(battery.dischargingTime / 3600);
    const minutes = Math.floor((battery.dischargingTime % 3600) / 60);
    console.log(`续航时间：${hours}小时${minutes}分钟`);
  });
});
```

## 6. 游戏控制器支持

### 6.1 getGamepads

获取连接到设备的游戏手柄信息，返回 Gamepad 对象数组。

#### 6.1.1 Gamepad 对象属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | string | 游戏手柄标识符 |
| `index` | number | 游戏手柄索引 |
| `connected` | boolean | 是否已连接 |
| `buttons` | GamepadButton[] | 按钮状态数组 |
| `axes` | number[] | 摇杆轴状态数组 |

#### 6.1.2 使用示例

```javascript
/**
 * 游戏手柄连接检测
 */
window.addEventListener("gamepadconnected", event => {
  const gamepad = navigator.getGamepads()[event.gamepad.index];
  
  console.log(`游戏手柄已连接：
    索引：${gamepad.index}
    ID：${gamepad.id}
    按键数：${gamepad.buttons.length}
    轴数：${gamepad.axes.length}`);
});

// 游戏手柄断开连接
window.addEventListener("gamepaddisconnected", event => {
  console.log(`游戏手柄已断开：${event.gamepad.id}`);
});

/**
 * 游戏手柄状态监控
 */
function pollGamepads() {
  const gamepads = navigator.getGamepads();
  
  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i];
    if (gamepad) {
      // 检查按钮状态
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          console.log(`按钮 ${index} 被按下`);
        }
      });
      
      // 检查摇杆状态
      gamepad.axes.forEach((axis, index) => {
        if (Math.abs(axis) > 0.1) {
          console.log(`轴 ${index} 值：${axis.toFixed(2)}`);
        }
      });
    }
  }
  
  requestAnimationFrame(pollGamepads);
}
```

## 7. 应用程序检测

### 7.1 getInstalledRelatedApps

检测用户已安装的相关原生应用程序或 PWA 应用。

#### 7.1.2 使用示例

```javascript
/**
 * 检测已安装的相关应用
 */
async function checkInstalledApps() {
  try {
    const relatedApps = await navigator.getInstalledRelatedApps();
    
    console.log("已安装的相关应用：", relatedApps);
    
    // 查找特定应用
    const targetApp = relatedApps.find(app => app.id === "com.example.myapp");
    
    if (targetApp) {
      console.log("目标应用已安装：", targetApp);
    } else {
      console.log("目标应用未安装，建议用户下载");
    }
  } catch (error) {
    console.error("检测应用失败：", error);
  }
}
```

## 8. 协议处理程序

### 8.1 registerProtocolHandler

注册和管理自定义 URL 协议处理程序。

> **注意**：此功能仅在安全上下文（HTTPS）中可用。

#### 8.1.1 方法说明

| 方法 | 参数 | 描述 |
|------|------|------|
| `registerProtocolHandler(scheme, url)` | string, string | 注册协议处理程序 |
| `unregisterProtocolHandler(scheme, url)` | string, string | 取消注册协议处理程序 |

#### 8.1.2 参数说明

- **scheme**: 协议字符串。自定义协议需 `web+` 前缀，或使用标准协议（如 `mailto`、`ftp` 等）
- **url**: 同源 URL 字符串，必须包含 `%s` 作为占位符

#### 8.1.3 使用示例

```javascript
/**
 * 注册自定义协议处理程序
 */
// 注册自定义协议
navigator.registerProtocolHandler(
  "web+burger",
  "https://burgers.example.org/?burger=%s"
);

// 注册邮件协议
navigator.registerProtocolHandler(
  "mailto",
  "https://mail.example.org/compose?to=%s"
);

// 使用自定义协议
// <a href="web+burger:cheeseburger">芝士汉堡</a>
// 将导航到 https://burgers.example.org/?burger=web+burger:cheeseburger

/**
 * 取消注册协议处理程序
 */
navigator.unregisterProtocolHandler(
  "web+burger",
  "https://burgers.example.org/?burger=%s"
);
```

## 9. 媒体加密访问

### 9.1 requestMediaKeySystemAccess

提供对加密媒体和受 DRM 保护内容的访问支持。

#### 9.1.1 方法签名

```javascript
requestMediaKeySystemAccess(keySystem, supportedConfigurations)
```

#### 9.1.2 使用示例

```javascript
/**
 * 请求媒体密钥系统访问权限
 */
async function setupDRMSupport() {
  const clearKeyOptions = [
    {
      initDataTypes: ["keyids", "webm"],
      audioCapabilities: [
        { contentType: 'audio/webm; codecs="opus"' },
        { contentType: 'audio/webm; codecs="vorbis"' },
      ],
      videoCapabilities: [
        { contentType: 'video/webm; codecs="vp9"' },
        { contentType: 'video/webm; codecs="vp8"' },
      ],
    },
  ];

  try {
    const keySystemAccess = await navigator.requestMediaKeySystemAccess(
      "org.w3.clearkey",
      clearKeyOptions
    );
    
    console.log("DRM 系统访问成功");
    // 创建媒体密钥并配置解密
    const mediaKeys = await keySystemAccess.createMediaKeys();
    return mediaKeys;
  } catch (error) {
    console.error("DRM 系统访问失败：", error);
  }
}
```

## 10. MIDI 设备控制

### 10.1 requestMIDIAccess

访问和控制用户系统上的 MIDI 设备。

> **注意**：需要 `midi` 权限。

#### 10.1.1 使用示例

```javascript
/**
 * MIDI 设备访问和控制
 */
async function setupMIDI() {
  try {
    // 检查权限
    const permission = await navigator.permissions.query({ 
      name: "midi", 
      sysex: true 
    });
    
    if (permission.state === "granted") {
      const midiAccess = await navigator.requestMIDIAccess();
      
      // 获取 MIDI 输入设备
      const inputs = Array.from(midiAccess.inputs.values());
      const outputs = Array.from(midiAccess.outputs.values());
      
      console.log(`发现 ${inputs.length} 个 MIDI 输入设备`);
      console.log(`发现 ${outputs.length} 个 MIDI 输出设备`);
      
      // 监听 MIDI 消息
      inputs.forEach(input => {
        input.addEventListener("midimessage", event => {
          console.log("MIDI 消息：", event.data);
        });
      });
      
      return { inputs, outputs };
    } else {
      console.log("MIDI 权限未授予");
    }
  } catch (error) {
    console.error("MIDI 访问失败：", error);
  }
}
```

## 11. 数据传输 API

### 11.1 Beacon API

Beacon API 提供异步、非阻塞的数据传输功能，特别适用于页面卸载时的数据发送。

#### 11.1.1 功能特点

- **异步传输**：通过 HTTP POST 异步传输数据到服务器
- **非阻塞**：不会影响页面卸载或下一页面的加载性能
- **可靠性**：浏览器保证在页面卸载前完成数据传输

> **注意**：Beacon API 在 Web Worker 中不可用。

#### 11.1.2 方法签名

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `sendBeacon(url)` | string | boolean | 发送空数据到指定 URL |
| `sendBeacon(url, data)` | string, any | boolean | 发送数据到指定 URL |

#### 11.1.3 支持的数据类型

- `ArrayBuffer`
- `ArrayBufferView`
- `Blob`
- `DOMString`
- `FormData`
- `URLSearchParams`

#### 11.1.4 使用示例

```javascript
/**
 * 页面分析数据发送
 */
const analyticsData = JSON.stringify({
  userId: "12345",
  pageViews: 10,
  timeSpent: 30000,
  timestamp: Date.now()
});

/**
 * 在页面卸载时发送分析数据
 * 推荐使用 visibilitychange 事件而不是 unload 事件
 */
document.addEventListener("visibilitychange", function logData() {
  if (document.visibilityState === "hidden") {
    const success = navigator.sendBeacon("/analytics", analyticsData);
    
    if (success) {
      console.log("分析数据发送成功");
    } else {
      console.log("分析数据发送失败");
    }
  }
});

/**
 * 错误报告发送
 */
function reportError(error) {
  const errorData = new FormData();
  errorData.append("error", error.message);
  errorData.append("stack", error.stack);
  errorData.append("url", window.location.href);
  errorData.append("timestamp", Date.now());
  
  navigator.sendBeacon("/error-report", errorData);
}

// 全局错误处理
window.addEventListener("error", reportError);
```

## 12. 设备振动控制

### 12.1 vibrate

控制设备的振动硬件，提供触觉反馈功能。

#### 12.1.1 方法签名

```javascript
navigator.vibrate(pattern)
```

#### 12.1.2 参数说明

- **pattern**: `number | number[]` - 振动和暂停间隔的模式
  - 单个数字：振动指定毫秒数
  - 数组：交替表示振动和暂停的时间间隔
  - 默认间隔：100ms

#### 12.1.3 特殊值

- `0`：停止当前振动
- `[]`：停止当前振动
- 全零数组：停止当前振动

#### 12.1.4 使用示例

```javascript
/**
 * 基本振动控制
 */
// 振动 200 毫秒
navigator.vibrate(200);

// 停止振动
navigator.vibrate(0);

/**
 * 复杂振动模式
 */
// 摩斯密码 "SOS"
navigator.vibrate([
  100, 30, 100, 30, 100, 30,  // S: 短短短
  200, 30, 200, 30, 200, 30,  // O: 长长长
  100, 30, 100, 30, 100       // S: 短短短
]);

/**
 * 交互反馈振动
 */
function hapticFeedback(type) {
  switch (type) {
    case "success":
      navigator.vibrate([50, 50, 50]);
      break;
    case "error":
      navigator.vibrate([100, 50, 100, 50, 100]);
      break;
    case "warning":
      navigator.vibrate([200, 100, 200]);
      break;
    case "click":
      navigator.vibrate(50);
      break;
    default:
      navigator.vibrate(100);
  }
}

/**
 * 游戏中的振动反馈
 */
class GameVibration {
  static explosion() {
    navigator.vibrate([100, 30, 100, 30, 200]);
  }
  
  static hit() {
    navigator.vibrate(75);
  }
  
  static powerUp() {
    navigator.vibrate([50, 25, 50, 25, 50, 25, 100]);
  }
  
  static gameOver() {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }
}
```

## 总结

Navigator 对象提供了丰富的浏览器和设备功能访问接口，通过本文档的学习，您应该能够：

1. **应用状态管理**：使用徽章 API 管理应用通知状态
2. **原生功能集成**：调用设备的原生分享和振动功能
3. **媒体内容处理**：检测自动播放策略、处理加密媒体内容
4. **设备状态监控**：监控电池状态、检测游戏控制器
5. **协议处理**：注册自定义 URL 协议处理程序
6. **设备控制**：访问 MIDI 设备、控制设备振动
7. **数据传输优化**：使用 Beacon API 进行可靠的数据传输

这些 API 为现代 Web 应用提供了接近原生应用的用户体验，是构建高质量 PWA 应用的重要基础。

### 最佳实践建议

1. **权限管理**：合理请求和管理各种设备权限
2. **功能检测**：在使用前检测 API 可用性
3. **优雅降级**：为不支持的设备提供备选方案
4. **性能优化**：合理使用异步 API，避免阻塞主线程
5. **用户体验**：提供清晰的功能说明和反馈

### 参考资料

- [MDN Web Docs - Navigator](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator)
- [W3C Web Platform APIs](https://www.w3.org/standards/webdesign/webplatform)
- [PWA 最佳实践指南](https://web.dev/progressive-web-apps/)
- [Web 权限管理](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API)
