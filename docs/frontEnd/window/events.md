# Window 事件详解

Window 对象提供了丰富的事件处理机制，涵盖了页面生命周期、用户交互、设备状态、网络连接等各个方面。本文档详细介绍了 Window 对象的各种事件及其用法。

## 目录

1. [页面生命周期事件](#1-页面生命周期事件)
2. [用户交互事件](#2-用户交互事件)
3. [设备和方向事件](#3-设备和方向事件)
4. [网络状态事件](#4-网络状态事件)
5. [导航和历史事件](#5-导航和历史事件)
6. [错误处理和Promise事件](#6-错误处理和promise事件)
7. [打印和应用安装事件](#7-打印和应用安装事件)
8. [消息和存储事件](#8-消息和存储事件)
9. [游戏手柄事件](#9-游戏手柄事件)
10. [窗口和滚动事件](#10-窗口和滚动事件)

## 1. 页面生命周期事件

### 1.1 load

`load` 事件在整个页面及所有依赖资源（如样式表和图片）都已完成加载时触发。它与 `DOMContentLoaded` 不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载。

```javascript
addEventListener("load", (event) => {
  console.log("页面完全加载完成");
});

onload = (event) => {
  console.log("页面完全加载完成");
};
```

### 1.2 beforeunload

当浏览器窗口关闭或者刷新时，会触发 `beforeunload` 事件。根据规范，要显示确认对话框，事件处理程序需要在事件上调用 `preventDefault()`。

```javascript
window.addEventListener("beforeunload", (event) => {
  // 根据标准取消事件
  event.preventDefault();
  // Chrome 需要设置 returnValue
  event.returnValue = "";
});
```

### 1.3 unload

当文档或一个子资源正在被卸载时，触发 `unload` 事件。它在 `beforeunload` 和 `pagehide` 事件后被触发。

```javascript
window.addEventListener("unload", (event) => {
  console.log("页面正在卸载");
});
```

### 1.4 pagehide & pageshow

- `pagehide` - 当浏览器从展示会话历史中的另一个页面过程中隐藏当前页面时触发
- `pageshow` - 当一条会话历史记录被执行时触发（包括后退/前进按钮操作）

```javascript
addEventListener("pagehide", (event) => {
  console.log("页面隐藏", event.persisted);
});

addEventListener("pageshow", (event) => {
  console.log("页面显示", event.persisted);
});

// 执行顺序示例
window.addEventListener("load", () => {
  console.log("1. load 事件");
});

window.addEventListener("pageshow", (event) => {
  console.log("2. pageshow 事件:", event);
});
```

### 1.5 pagereveal

`pagereveal` 事件在首次呈现文档时触发，无论是从网络加载新文档还是激活文档（从后退/前进缓存或预呈现）。这在跨文档视图过渡的情况下非常有用。

```javascript
addEventListener("pagereveal", (event) => {
  console.log("页面首次呈现");
});

onpagereveal = (event) => {
  console.log("页面首次呈现");
};
```

### 1.6 pageswap

`pageswap` 事件在跨文档导航时触发，当前一个文档即将卸载时。这在跨文档视图过渡的情况下非常有用。

```javascript
addEventListener("pageswap", (event) => {
  console.log("页面即将切换");
});

onpageswap = (event) => {
  console.log("页面即将切换");
};
```

## 2. 用户交互事件

### 2.1 blur & focus

- `blur` - window 失去焦点时触发
- `focus` - window 获得焦点时触发

```javascript
window.addEventListener("blur", () => {
  console.log("窗口失去焦点");
  // 可以在这里暂停游戏或视频
});

window.addEventListener("focus", () => {
  console.log("窗口获得焦点");
  // 可以在这里恢复游戏或视频
});
```

### 2.2 剪贴板事件

当用户通过浏览器的用户界面发起复制、剪切或粘贴动作时触发相应事件。

```javascript
addEventListener("copy", (event) => {
  console.log("复制操作");
});

addEventListener("cut", (event) => {
  console.log("剪切操作");
});

addEventListener("paste", (event) => {
  console.log("粘贴操作");
});

// 也可以使用属性方式
oncopy = (event) => {
  console.log("复制操作");
};

oncut = (event) => {
  console.log("剪切操作");
};

onpaste = (event) => {
  console.log("粘贴操作");
};
```

## 3. 设备和方向事件

### 3.1 devicemotion

`devicemotion` 事件每隔一定时间触发一次，显示设备当时的加速度大小和旋转速率信息。

> **注意：** 此功能仅在安全上下文（HTTPS）中可用。

```javascript
addEventListener("devicemotion", (event) => {
  // DeviceMotionEvent 对象属性：
  // acceleration - 设备在 x、y、z 三轴上的加速度（m/s²）
  // accelerationIncludingGravity - 包含重力的加速度（m/s²）
  // rotationRate - 设备绕三个轴的旋转速率（度/秒）
  // interval - 从设备获取数据的时间间隔（毫秒）
  
  console.log("加速度:", event.acceleration);
  console.log("包含重力的加速度:", event.accelerationIncludingGravity);
  console.log("旋转速率:", event.rotationRate);
  console.log("时间间隔:", event.interval);
});

ondevicemotion = (event) => {
  console.log("设备运动检测");
};
```

### 3.2 deviceorientation

`deviceorientation` 事件在方向传感器输出新数据时触发。

```javascript
addEventListener("deviceorientation", (event) => {
  // DeviceOrientationEvent 对象属性：
  // absolute - 布尔值，表示设备是否提供了绝对方向数据
  // alpha - 设备围绕 z 轴的转动度数（0-360）
  // beta - 设备围绕 x 轴的转动度数（-180 到 180）
  // gamma - 设备围绕 y 轴的转动度数（-90 到 90）
  
  console.log("Alpha（z轴）:", event.alpha);
  console.log("Beta（x轴）:", event.beta);
  console.log("Gamma（y轴）:", event.gamma);
});

// 检查是否支持设备方向事件
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    // alpha: 围绕 z 轴旋转
    const rotateDegrees = event.alpha;
    // gamma: 左右倾斜
    const leftToRight = event.gamma;
    // beta: 前后倾斜
    const frontToBack = event.beta;
    
    console.log(`旋转: ${rotateDegrees}°, 左右: ${leftToRight}°, 前后: ${frontToBack}°`);
  }, true);
}
```

### 3.3 deviceorientationabsolute

`deviceorientationabsolute` 事件在绝对设备方向更改时触发。

> **注意：** 此功能仅在安全上下文（HTTPS）中可用。

```javascript
addEventListener("deviceorientationabsolute", (event) => {
  console.log("绝对设备方向变化");
});

ondeviceorientationabsolute = (event) => {
  console.log("绝对设备方向变化");
};
```

### 3.4 orientationchange

`orientationchange` 事件在设备的纵横方向改变时触发。

```javascript
window.addEventListener("orientationchange", () => {
  console.log(`设备方向现在是 ${screen.orientation.angle}°`);
  console.log(`方向类型: ${screen.orientation.type}`);
});
```

## 4. 网络状态事件

### 4.1 online & offline

- `online` - 当浏览器能够访问网络时触发
- `offline` - 当浏览器失去网络连接时触发

```javascript
// 网络连接事件
window.addEventListener("online", (event) => {
  console.log("网络已连接");
  // 可以在这里恢复网络相关功能
});

window.addEventListener("offline", (event) => {
  console.log("网络已断开");
  // 可以在这里切换到离线模式
});

// 也可以使用属性方式
window.ononline = (event) => {
  console.log("网络已连接");
};

window.onoffline = (event) => {
  console.log("网络已断开");
};
```

## 5. 导航和历史事件

### 5.1 hashchange

当 URL 的片段标识符（以 # 符号开头的部分）更改时，将触发 `hashchange` 事件。

```javascript
addEventListener("hashchange", (event) => {
  console.log("新URL:", event.newURL);
  console.log("旧URL:", event.oldURL);
});

onhashchange = (event) => {
  console.log(`URL hash 从 ${event.oldURL} 变为 ${event.newURL}`);
};
```

### 5.2 popstate

每当激活同一文档中不同的历史记录条目时，`popstate` 事件就会触发。

> **注意：** 调用 `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件。

```javascript
window.onpopstate = (event) => {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
};

// 示例：历史记录操作
history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");

// 这些操作会触发 popstate 事件
history.back(); // 弹出 "location: http://example.com?page=1, state: {"page":1}"
history.back(); // 弹出 "location: http://example.com, state: null"
history.go(2);  // 弹出 "location: http://example.com?page=3, state: {"page":3}"
```

### 5.3 languagechange

`languagechange` 事件在用户首选语言发生变化时触发。

```javascript
addEventListener("languagechange", (event) => {
  console.log("用户首选语言已变化");
  // 可以在这里更新页面语言
});

onlanguagechange = (event) => {
  console.log("用户首选语言已变化");
};
```

## 6. 错误处理和Promise事件

### 6.1 error

当资源加载失败或无法使用时，会在 Window 对象触发 `error` 事件。

```javascript
window.addEventListener("error", (event) => {
  console.error(`错误类型: ${event.type}`);
  console.error(`错误信息: ${event.message}`);
  console.error(`错误文件: ${event.filename}`);
  console.error(`错误行号: ${event.lineno}`);
  console.error(`错误列号: ${event.colno}`);
});

// 示例：触发错误
const scriptError = document.querySelector("#script-error");
scriptError?.addEventListener("click", () => {
  const badCode = "const s;";
  eval(badCode); // 这会触发错误
});
```

### 6.2 unhandledrejection

当 Promise 被 reject 且没有 reject 处理器时，会触发 `unhandledrejection` 事件。

```javascript
window.addEventListener("unhandledrejection", (event) => {
  console.warn(`未处理的 Promise 拒绝: ${event.reason}`);
  
  // 阻止默认处理（例如将错误输出到控制台）
  event.preventDefault();
});

window.onunhandledrejection = (event) => {
  console.warn(`未处理的 Promise 拒绝: ${event.reason}`);
};
```

### 6.3 rejectionhandled

当 Promise 被 rejected 且有 rejection 处理器时会触发 `rejectionhandled` 事件。

```javascript
window.addEventListener("rejectionhandled", (event) => {
  console.log(`Promise 拒绝已处理; 原因: ${event.reason}`);
}, false);
```

## 7. 打印和应用安装事件

### 7.1 beforeprint & afterprint

- `beforeprint` - 在相关联的文档即将打印或预览打印时触发
- `afterprint` - 在关联的文档开始打印或关闭打印预览后触发

```javascript
addEventListener("beforeprint", (event) => {
  console.log("即将打印");
  // 可以在这里修改页面内容，例如隐藏不需要打印的元素
});

addEventListener("afterprint", (event) => {
  console.log("打印完成");
  // 可以在这里恢复页面内容
});

// 也可以使用属性方式
onbeforeprint = (event) => {
  console.log("即将打印");
};

onafterprint = (event) => {
  console.log("打印完成");
};
```

### 7.2 appinstalled

当网页应用成功安装为渐进式网页应用时触发 `appinstalled` 事件。

```javascript
window.onappinstalled = (event) => {
  console.log("应用已安装");
};
```

### 7.3 beforeinstallprompt

当一个 Web 清单存在时，在提示用户将网站保存到主屏幕之前触发。

```javascript
window.addEventListener("beforeinstallprompt", (event) => {
  console.log("准备显示安装提示");
  // 可以在这里自定义安装提示的时机
});

window.onbeforeinstallprompt = (event) => {
  console.log("准备显示安装提示");
};
```

## 8. 消息和存储事件

### 8.1 message

当窗口接收到消息时触发 `message` 事件（例如，从另一个浏览器上下文中调用 `Window.postMessage()`）。

```javascript
window.addEventListener("message", (event) => {
  console.log("收到消息:", event.data);
  console.log("来源:", event.origin);
  console.log("发送者:", event.source);
});

window.onmessage = (event) => {
  // 安全检查：验证来源
  if (event.origin !== "https://trusted-domain.com") {
    return;
  }
  
  console.log("收到可信消息:", event.data);
};
```

### 8.2 messageerror

当窗口收到无法反序列化的消息时触发 `messageerror` 事件。

```javascript
window.onmessageerror = (event) => {
  console.error("消息反序列化错误");
};
```

### 8.3 storage

当存储区域（localStorage 或 sessionStorage）被修改时，将触发 `storage` 事件。

```javascript
addEventListener("storage", (event) => {
  console.log("存储变化:");
  console.log("键:", event.key);
  console.log("旧值:", event.oldValue);
  console.log("新值:", event.newValue);
  console.log("URL:", event.url);
  console.log("存储区域:", event.storageArea);
});

onstorage = (event) => {
  console.log("存储区域被修改");
};
```

## 9. 游戏手柄事件

### 9.1 gamepadconnected & gamepaddisconnected

- `gamepadconnected` - 当浏览器检测到游戏控制器连接时触发
- `gamepaddisconnected` - 当游戏控制器断开连接时触发

```javascript
// 游戏手柄连接事件
window.addEventListener("gamepadconnected", (event) => {
  console.log("游戏手柄已连接");
  console.log("手柄信息:", event.gamepad);
  
  // 可以通过 event.gamepad 访问所有按钮和轴值
  const gamepad = event.gamepad;
  console.log("手柄ID:", gamepad.id);
  console.log("按钮数量:", gamepad.buttons.length);
  console.log("轴数量:", gamepad.axes.length);
});

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("游戏手柄已断开连接");
});
```

## 10. 窗口和滚动事件

### 10.1 resize

`resize` 事件在文档视图（窗口）调整大小时触发。

```javascript
addEventListener("resize", (event) => {
  console.log("窗口大小已改变");
  console.log("新尺寸:", window.innerWidth, "x", window.innerHeight);
});

onresize = (event) => {
  console.log("窗口大小已改变");
};
```

### 10.2 scrollsnapchange

当选择新的滚动对齐目标时，在滚动操作结束时触发。

> **注意：** 必须将整个 HTML 文档设置为滚动对齐容器（在 `<html>` 元素上设置 `scroll-snap-type`）。

```javascript
addEventListener("scrollsnapchange", (event) => {
  console.log("滚动对齐目标已改变");
});

onscrollsnapchange = (event) => {
  console.log("滚动对齐目标已改变");
};
```

### 10.3 scrollsnapchanging

当浏览器确定新的滚动对齐目标处于待处理状态时触发。

```javascript
addEventListener("scrollsnapchanging", (event) => {
  console.log("滚动对齐目标正在改变");
});

onscrollsnapchanging = (event) => {
  console.log("滚动对齐目标正在改变");
};
```

## 11. 最佳实践

### 11.1 事件处理器的选择

```javascript
// 推荐：使用 addEventListener
window.addEventListener("load", handleLoad);

// 避免：使用 on* 属性可能覆盖其他处理器
window.onload = handleLoad;
```

### 11.2 性能优化

```javascript
// 对于频繁触发的事件，使用节流或防抖
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// 使用节流处理 resize 事件
window.addEventListener("resize", throttle(() => {
  console.log("窗口大小改变");
}, 100));
```

### 11.3 错误处理

```javascript
// 全局错误处理
window.addEventListener("error", (event) => {
  // 记录错误信息
  console.error("全局错误:", event.error);
  
  // 发送错误报告到服务器
  fetch("/api/error-report", {
    method: "POST",
    body: JSON.stringify({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack
    })
  });
});

// Promise 错误处理
window.addEventListener("unhandledrejection", (event) => {
  console.error("未处理的 Promise 拒绝:", event.reason);
  
  // 阻止默认的错误输出
  event.preventDefault();
});
```

### 11.4 安全考虑

```javascript
// 消息事件的安全处理
window.addEventListener("message", (event) => {
  // 验证来源
  const allowedOrigins = ["https://trusted-domain.com", "https://another-trusted.com"];
  if (!allowedOrigins.includes(event.origin)) {
    console.warn("来自不信任源的消息:", event.origin);
    return;
  }
  
  // 处理消息
  handleTrustedMessage(event.data);
});
```

## 12. 参考资料

- [MDN - Window 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window#事件)
- [MDN - 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)
- [MDN - 页面生命周期 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Lifecycle_API)
- [MDN - 设备方向事件](https://developer.mozilla.org/zh-CN/docs/Web/API/DeviceOrientationEvent)
- [MDN - 历史 API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- [MDN - 错误处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)