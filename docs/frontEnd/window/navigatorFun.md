# navigator 方法

## setAppBadge&clearAppBadge

setAppBadge() 方法在与此应用关联的图标上设置徽章。如果将值传递给该方法，则该值将被设置为徽章的值。否则，徽章将显示为点或平台定义的其他指示器。

clearAppBadge() 方法通过将当前应用程序图标设置为 nothing 来清除当前应用程序图标上的徽章。

```js
/**
 * @number 一个将用作徽章值的数值。如果为 0，表示清除徽章。
 */
setAppBadge();
setAppBadge(number);

navigator.clearAppBadge();
```

## canshare & share

canShare() 方法测试共享是否将会成功，必须由 UI 事件触发（瞬态激活状态）

share() 方法调用设备的本机共享机制来共享文本、URL 或文件等数据。可用的共享目标取决于设备，但可能包括剪贴板、联系人和电子邮件应用程序、网站、蓝牙等。需要被授予 `web-share` 权限

> 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用

```js
/**
 * @data 包含要共享的数据的对象。至少指定一个已知的数据属性。
    url 表示要共享的 URL 的字符串。
    text 表示要共享的文本的字符串。
    title 表示要共享的标题的字符串。
    files 共享的文件的 File 对象数组
 */
navigator.share(data);

// 检测 navigator.canShare() 特性和检测 navigator.share() 特性是一样的
if (navigator.canShare && navigator.canShare({ files })) {
  try {
    await navigator.share({
      files,
      title: "图像",
      text: "美丽的图像",
    });
  } catch (error) {}
} else {
  console.log("您的系统不支持共享这些文件。");
}
```

## getAutoplayPolicy

检测自动播放特定类型或内容项的策略。

```js
/**
 * @type
 *  mediaelement 获取文档中媒体元素的自动播放策略。
 *  audiocontext 在文档中获取 Web Audio API 播放器的自动播放策略。
 * @element  特定的媒体元素。 这必须是 HTMLMediaElement，包括派生元素
 * @context 特定的 AudioContext。
 * @return 指示指定媒体功能类型、元素或上下文的自动播放策略。
 *  allowed 允许自动播放。
 *  allowed-muted 仅允许对听不见的媒体进行自动播放。 这包括没有音轨或音频已静音的媒体。
 *  disallowed 不允许自动播放。
 */
getAutoplayPolicy(type);
getAutoplayPolicy(element);
getAutoplayPolicy(context);

const video = document.getElementById("video_element_id");
if (navigator.getAutoplayPolicy(video) === "allowed") {
  // 允许自动播放。
}
```

## getBattery

返回包含电池信息 BatteryManager 对象，提供有关系统电池电量水平的信息

> 需要提前授予电池权限

```js
navigator.getBattery().then(battery => {
  battery.addEventListener("chargingchange", () => {
    console.log(`电池是否充电中？${battery.charging ? "是" : "否"}`);
  });

  battery.addEventListener("levelchange", () => {
    console.log(`电池电量：${battery.level * 100}%`);
  });

  battery.addEventListener("chargingtimechange", () => {
    console.log(`电池充电时间：${battery.chargingTime}秒`);
  });

  battery.addEventListener("dischargingtimechange", () => {
    console.log(`电池续航时间：${battery.dischargingTime}秒`);
  });
});
```

## getGamepads

Navigator.getGamepads() 方法返回一个包含 Gamepad 数组对象，每个对象代表与设备相连的一个游戏手柄。

```js
window.addEventListener("gamepadconnected", e => {
  const gp = navigator.getGamepads()[e.gamepad.index];
  console.log(
    `游戏手柄在索引 ${gp.index} 处已连接：其 ID 为 ${gp.id}，具有 ${gp.buttons.length} 个按键和 ${gp.axes.length} 个轴。`
  );
});
```

## getInstalledRelatedApps

返回用户已安装的任何相关的特定于平台的应用程序或渐进式 Web 应用程序数组。

```js
const relatedApps = await navigator.getInstalledRelatedApps();

// 寻找出特定app
const psApp = relatedApps.find(app => app.id === "com.example.myapp");
```

## registerProtocolHandler

registerProtocolHandler() 方法让 web 站点为自身注册用于打开或处理特定 URL 方案（又名协议）的能力。

unregisterProtocolHandler（） 删除给定 URL 方案的协议处理程序。

> 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

```js
/**
 * @scheme 协议字符串。自定义方案的名称：在 web+ 前缀之后至少包含一个小写的 ASCII 字母。否则必须是规定的值之一：ftp,geo,bitcoin,mailto,mms,news,nntp,sftp,tel,ssh.....
 * @url 同源 URL 字符串。该 URL 必须包含 %s（作为占位符）
  @return undefined
 */
registerProtocolHandler(scheme, url);

// 为自定义协议注册处理器
navigator.registerProtocolHandler(
  "web+burger",
  "https://burgers.example.org/?burger=%s"
);
// 导航到 https://burgers.example.org/?burger=web+burger:cheeseburger。
<a href="web+burger:cheeseburger">芝士汉堡</a>;

// 取消注册
navigator.unregisterProtocolHandler(
  "web+burger",
  "https://burgers.example.com/?burger=%s"
);
```

## requestMediaKeySystemAccess

返回兑现为 MediaKeySystemAccess 对象的 promise，用于访问特定的媒体密钥系统，又可用于创建解密媒体流的密钥。提供对加密媒体和受 DRM 保护的视频的支持。

```js
requestMediaKeySystemAccess(keySystem, supportedConfigurations);

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

navigator
  .requestMediaKeySystemAccess("org.w3.clearkey", clearKeyOptions)
  .then(keySystemAccess => {
    /* use the access to get create keys */
  });
```

## requestMIDIAccess

访问用户系统上的 MIDI 设备。提供访问、枚举和操作 MIDI 设备的方法。需要`midi`权限

```js
navigator.permissions.query({ name: "midi", sysex: true }).then(result => {
  if (result.state === "granted") {
    navigator.requestMIDIAccess().then(access => {
      // 获取可用MIDI controllers列表
      const inputs = access.inputs.values();
      const outputs = access.outputs.values();
    });
  }
});
```

## Beacon API

Beacon API 通过 HTTP POST 将少量数据 异步 传输到 Web 服务器。用于发送异步和非阻塞请求到服务器。这类请求不需要响应。与 XMLHttpRequest 或 Fetch API 请求不同，浏览器会保证在页面卸载前，将信标请求初始化并运行完成。

主要用于满足统计和诊断代码的需要，这些代码通常尝试在卸载（unload）文档之前向 Web 服务器发送数据。过早的发送数据可能导致错过收集数据的机会。然而，对于开发者来说保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在 unload 事件处理器中产生的异步 XMLHttpRequest。

> Beacon API 在 Web Worker 中是不可用的（没有通过 WorkerNavigator 暴露出来）。

使用 sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，

```js
/**
 * @url data 将要被发送到的网络地址。
 * @data 将要发送的 ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams 类型的数据。
 * @return 当用户代理成功把数据加入传输队列时,将会返回 true，否则返回 false。
 */
navigator.sendBeacon(url);
navigator.sendBeacon(url, data);

/**
 * 网站通常希望在用户完成页面浏览后向服务器发送分析或诊断数据，最可靠的方法是在 visibilitychange 事件发生时发送数据：
 */
document.addEventListener("visibilitychange", function logData() {
  if (document.visibilityState === "hidden") {
    navigator.sendBeacon("/log", analyticsData);
  }
});
```

## vibrate

使设备上的振动硬件发出振动（如果存在此类硬件）。

```js
/**
 * @pattern 提供振动和暂停间隔的模式。number或number数组。默认间隔100ms。
 * 提供0、空数组或元素全部为0的数组，将取消任何当前正在进行的振动模式
 */
vibrate(pattern);

navigator.vibrate(200); // 振动 200ms

// 用摩斯密码振动“SOS”
navigator.vibrate([
  100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
]);

navigator.vibrate(0); // 取消振动
```
