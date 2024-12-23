# Navigator

Navigator 接口代表了用户代理（即浏览器）的状态和身份，允许脚本对其查询并注册自身以便执行某些活动。有以下实例属性和方法：

## permissions

查询当前上下文的 API 权限授权状态

```js
// 通过query()请求地理定位权限，返回用户权限状态的promise
navigator.permissions.query({ name: "geolocation" }).then(result => {
  // result.name : geolocation 返回所请求权限的名称
  if (result.state === "granted") {
    console.log(result.name, ":授权成功，允许访问");
  } else if (result.state === "prompt") {
    // prompt 弹窗，需要用户点击确认来完成授权
    navigator.geolocation.getCurrentPosition();
  } else if (result.state === "denied") {
    // 拒绝授权
  }
  result.addEventListener("change", () => {
    // 监控state的状态变化,更改时调用
  });
});
```

## bluetooth

返回当前文档的 Bluetooth 对象，提供对 Web 蓝牙 API 功能的访问。此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

- `getAvailability()` 返回一个 Promise，其会兑现一个指示用户代理是否支持蓝牙的布尔值。

- `requestDevice()` 返回兑现为 BluetoothDevice 对象的 Promise 。如果没有蓝牙设备选择界面，则返回与条件匹配的第一个设备。

- `getDevices()` 返回兑现为包含当前来源允许访问的 BluetoothDevice 的数组的 promise。权限是通过先前调用 Bluetooth.requestDevice() 获得的。
-

```js
// getAvailability询问浏览器是否支持蓝牙
navigator.bluetooth.getAvailability().then(available => {
  if (available) {
    console.log("This device supports Bluetooth!");
  } else {
    console.log("Doh! Bluetooth is not supported");
  }
});

//扫描选项匹配任何设备广播：
let options = {
  filters: [
    { services: ["heart_rate"] }, //. 标准心率服务
    { services: [0x1802, 0x1803] }, //. 两个 16 位服务 ID 0x1802 和 0x1803。
    { services: ["c48e6067-5295-48d3-8d5c-0395f61792b1"] }, //. 专有的 128 位 UUID 服务 c48e6067-5295-48d3-8d5c-0395f61792b1。
    { name: "设备名" }, //. 名称为“设备名”的设备。
    { namePrefix: "前缀" }, //. 名称以“前缀”开头的设备。
  ],
  //即使设备不通告该服务，也可以访问电池服务。
  optionalServices: ["battery_service"],
  // 请求脚本可以接受所有蓝牙设备。默认值为 false。
  acceptAllDevices: false,
};

navigator.bluetooth
  .requestDevice(options)
  .then(function (device) {
    console.log("名称：" + device.name);
    // 在此处实现设备调用
  })
  .catch(function (error) {
    console.log("出现错误： " + error);
  });
```

## clipboard

剪贴板 Clipboard API 提供了响应剪贴板命令（剪切、复制和粘贴）与异步读写系统剪贴板的能力。从权限 Permissions API 获取"clipboard-read" 或 "clipboard-write" 权限之后，才能访问剪贴板内容

> 被设计用来取代使用 document.execCommand() 的剪贴板访问方式。

- `read()` 从剪贴板读取数据。在检索到数据后，promise 将兑现一个 ClipboardItem 对象的数组。
- `readText()` 读取文本，promise 将兑现包含剪切板文本数据的 DOMString。
- `write()` 写入任意数据至剪贴板。
- `writeText()` 写入文本至剪贴板。

```js
navigator.clipboard.readText().then(clipText => console.log(clipText));

navigator.clipboard.writeText("<empty clipboard>").then(
  function () {
    // 成功回调
  },
  function () {
    // 失败回调
  }
);
```

## connection

返回系统网络连接信息的 NetworkInformation 对象

- `downlink` 有限带宽估计值，以兆比特每秒（Mbps）为单位。四舍五入到最接近的 25 千比特每秒的倍数。
- `downlinkMax` 底层连接技术的最大下行速度，以兆比特每秒（Mbps）为单位。
- `effectiveType` 连接的有效类型（意思是“slow-2g”、“2g”、“3g”或“4g”中的一个）。此值是使用最近观察到的往返时间和下行链路值的组合来确定的。
- `rtt` 当前连接的有效往返时间估计，四舍五入到最接近的 25 毫秒的倍数。
- `saveData` 是否设置了减少数据使用的选项
- `type` 网络通信的连接类型
  - `bluetooth`
  - `cellular`
  - `ethernet`
  - `none`
  - `wifi`
  - `wimax`
  - `other`
  - `unknown`

```js
// 获取网络连接类型。
const type = navigator.connection.type;

function changeHandler(e) {
  // 在此处理网络连接类型的更改。
}

// 监听网络状态变更：
navigator.connection.onchange = changeHandler;
```

## contacts

返回一个 ContactsManager 接口，该接口允许用户从他们的联系人列表中选择条目，并与网站或应用程序共享所选条目的有限详细信息。

- `select()` 选择联系人
- `getProperties()` 获取联系人属性信息，兑现为字符串数组

```js
// 检查是否支持联系人选择器 API
const supported = "contacts" in navigator && "ContactsManager" in window;

// 获取联系人相关属性信息
async function checkProperties() {
  const supportedProperties = await navigator.contacts.getProperties();
  // ["name", "email", "tel", "address", "icon"]
}

// 获取联系人信息
async function getContacts() {
  try {
    const props = ["name", "email", "tel", "address", "icon"];
    const opts = { multiple: true };
    const contacts = await navigator.contacts.select(props, opts);
    const contactAddress = contacts[0].address[0];
    /** ContactAddress接口
     * addressLine
     * country
     * city
     * dependentLocality
     * organization
     * phone
     * postalCode
     * recipient
     * region
     * sortingCode
     * toJSON()
     */
  } catch (ex) {
    // Handle any errors here.
  }
}
```

## cookieEnabled

返回一个布尔值，指示是否启用了 cookie。

```js
if (!navigator.cookieEnabled) {
  // 浏览器不支持或阻止设置 cookie。
}
```

## credentials

返回与当前文档关联的 CredentialsContainer 对象，该对象暴露用于请求凭据的方法。CredentialsContainer 接口还会在发生感兴趣的事件时通知用户代理，例如成功登录或注销。

- create() 兑现为一个 Credential 对象的 promise，基于提供的选项。
- get() 兑现为一个 Credential 对象的 promise，基于提供的参数。
- store() 为用户保存一个凭据集合，兑现为一个 Credential 对象的 promise

```js
// 特性检测
if ("credentials" in navigator) {
  navigator.credentials.get({ password: true }).then(passwordCredential => {
    // 使用凭据执行操作
  });
} else {
  // 使用之前的方式处理登录
}
```

## deviceMemory

返回一个布尔值，指示是否启用了 cookie。仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

```js
const memory = navigator.deviceMemory;
console.log(`此设备至少拥有 ${memory}GiB 的 RAM。`);
```

## geolocation

返回 Geolocation 对象，该对象允许 Web 内容访问设备的位置。这允许网站或应用程序根据用户的位置提供定制化的结果。仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

> 出于安全考虑，当网页请求获取用户位置信息时，用户会被提示进行授权。注意，不同浏览器在请求权限时有不同的策略和方式。

- getcurrentPosition() 确定设备位置信息的 Position 对象。
- watchPosition() 每当设备位置改变时，返回一个 long 类型的该监听器的 ID 值。
- clearWatch() 取消由 watchPosition() 注册的位置监听器。

```js
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  console.log("Latitude : " + crd.latitude);
  console.log("Longitude: " + crd.longitude);
  console.log("More or less " + crd.accuracy + " meters.");
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}
// 获取当前位置信息
navigator.geolocation.getCurrentPosition(success, error, options);

// 监控位置信息的变化
var id, target, option;
function success(pos) {
  var crd = pos.coords;
  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    // 根据监控id，取消监控
    navigator.geolocation.clearWatch(id);
  }
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

target = {
  latitude: 0,
  longitude: 0,
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};
// 监控位置信息的变化，返回一个id，用于取消监控
id = navigator.geolocation.watchPosition(success, error, options);
```

## globalPrivacyControl

返回用户对当前网站的全球隐私控制设置。此设置指示用户是否同意网站或服务将其个人信息出售或共享给第三方。该属性的值反映了 Sec-GPC HTTP 标头中的值。

```js
console.log(navigator.globalPrivacyControl);
// 如果用户明确表示不同意共享或出售其数据，则为“true”；否则为“false”。
```

## gpu

当前浏览上下文的 GPU 对象，该对象是 WebGPU API 的入口点。使 web 开发人员能够使用底层系统的 GPU（图形处理器）进行高性能计算并绘制可在浏览器中渲染的复杂图形。

WebGPU 是 WebGL 的继任者，为现代 GPU 提供更好的兼容、支持更通用的 GPU 计算、更快的操作以及能够访问到更高级的 GPU 特性。

```js
async function init() {
  if (!navigator.gpu) {
    throw Error("不支持 WebGPU。");
  }
  // 接受一个可选的设置对象，请求一个高性能或者低功耗的适配器
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("无法请求 WebGPU 适配器。");
  }
  // 接受一个可选的对象（称为描述符），该设备可以用于指定想要逻辑设备具有的确切特性和限制
  const device = await adapter.requestDevice();
}
```

> 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API

## hardwareConcurrency

用户计算机上可用于运行线程的逻辑处理器数量

```js
// 创建了一个可用于稍后处理请求的 Worker 池
let workerList = [];

for (let i = 0; i < window.navigator.hardwareConcurrency; i++) {
  let newWorker = {
    worker: new Worker("cpuworker.js"),
    inUse: false,
  };
  workerList.push(newWorker);
}
```

## hid

一个 HID 对象，该对象提供用于连接 HID 设备、列出已连接的 HID 设备以及连接的 HID 设备的事件处理程序的方法。如果已定义的权限策略阻止使用 WebHID，则 Navigator.hid 属性将不可用。仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

```js
HID参考：https://developer.mozilla.org/en-US/docs/Web/API/HID
```

## keyboard

通过该对象可访问检索键盘布局映射和切换捕捉物理键盘按键的函数。仅在一些支持的浏览器的安全上下文（HTTPS）中可用。

- `getLayoutMap()` 返回一个 Promise，兑现 KeyboardLayoutMap 实例，该实例是一个类 map 对象，具有检索与特定物理键关联的字符串的功能。
- `lock()` 在启用对物理键盘上任意或所有按键的按键捕获后兑现。
- `unlock()` 解锁 lock() 方法捕获的所有键并同步返回。

```js
// 获取与英语 QWERTY 键盘上“W”键对应的键关联的位置或布局特定字符串。
if (navigator.keyboard) {
  const keyboard = navigator.keyboard;
  keyboard.getLayoutMap().then(keyboardLayoutMap => {
    const upKey = keyboardLayoutMap.get("KeyW");
    window.alert(`按 ${upKey} 向上移动。`);
  });
} else {
  // 做点别的事。
}
// 捕获 W、A、S 和 D 键，并使用包含每个键的键代码属性值的列表调用 lock()：
navigator.keyboard.lock(["KeyW", "KeyA", "KeyS", "KeyD"]);
```

## language

表示用户的首选语言，通常是浏览器 UI 的语言.有效的语言代码示例包括“en”、“en-US”、“fr”、“fr-FR”、“es-ES”等。

```js
// 根据用户首选语言的区域设置格式化内容：
const date = new Date("2012-05-24");
const formattedDate = new Intl.DateTimeFormat(navigator.language).format(date);
```

## languages

表示用户的首选语言数组。它们按优先级排序，首选语言排在第一位。navigator.language 的值是返回数组中的第一个元素。当用户首选语言发生变化时，languagechange 事件会在 Window 对象上触发。用户浏览器发出的每个 HTTP 请求中的 Accept-Language HTTP 标头使用与 navigator.languages 属性相同的值，但额外包含 qvalues（权重值）字段（例如 en-US;q=0.8）。

```js
navigator.language; // "zh-CN"
navigator.languages; // ["zh-CN", "en-US", "ja-JP"]
const date = new Date("2012-05-24");
const formattedDate = new Intl.DateTimeFormat(navigator.languages).format(date);
```

## login

对浏览器 NavigatorLogin 对象的访问权限，联合身份提供程序（IdP）可以使用它在用户登录或退出 IdP 时设置其登录状态。

```js
/* 设置登录状态 */
navigator.login.setStatus("logged-in");

/* 设置登出状态 */
navigator.login.setStatus("logged-out");
```

## maxTouchPoints

当前设备支持的最大同时触摸接触点数。

```js
if (navigator.maxTouchPoints > 1) {
  // 浏览器支持多点触控
}
```

## mediaCapabilities

返回一个 MediaCapabilities 对象，该对象可以暴露有关给定格式的解码和编码能力以及由媒体能力 API 定义的输出能力的信息。

```js
navigator.mediaCapabilities
  .decodingInfo({
    type: "file",
    audio: {
      contentType: "audio/mp3",
      channels: 2,
      bitrate: 132700,
      samplerate: 5200,
    },
  })
  .then(result => {
    console.log(`${result.supported ? "" : "不"}支持此配置，`);
    console.log(`${result.smooth ? "" : "不"}流畅，`);
    console.log(`${result.powerEfficient ? "" : "不"}节能。`);
  });
```

## mediaDevices

一个 MediaDevices 对象，该对象可提供对相机和麦克风等媒体输入设备以及屏幕共享的连接访问。可取得任何硬件资源的媒体数据。

- `enumerateDevices()` 获取可用的媒体输入和输出设备信息。
- `getUserMedia()` 在用户通过提示允许的情况下，打开系统上的相机或屏幕共享和/或麦克风，并提供 MediaStream 包含视频轨道和/或音频轨道的输入。
- `getSupportedConstraints()` 返回一个符合 MediaTrackSupportedConstraints 的对象。该对象指明了 MediaStreamTrack 接口支持的可约束的属性。
- `getDispalyMedia()` 提示用户选择显示器或显示器的一部分（例如窗口）以捕获为 MediaStream 以便共享或记录。返回解析为 MediaStream 的 Promise。

```js
navigator.mediaDevices
  .getUserMedia({ audio: false, video: true })
  .then(function (stream) {
    // 获取媒体流中的视频通道
    var videoTracks = stream.getVideoTracks();
    console.log("Using video device: " + videoTracks[0].label);
    stream.onended = function () {
      console.log("Stream ended");
    };
    video.srcObject = stream;
  })
  .catch(function (error) {
    if (error.name === "ConstraintNotSatisfiedError") {
      // 设备不支持
    } else if (error.name === "PermissionDeniedError") {
      // 没有获取权限
    }
  });
```

> devicechange 事件： 当媒体输入或输出设备连接到用户计算机或从用户计算机移除时触发。

## mediaSession

返回一个 MediaSession 对象，可用于与浏览器共享关于文档正在处理的媒体的当前播放状态的元数据和其他信息。

- `metadata` 指向一个 MediaMetadata 的实例，其包含富媒体的元数据
- `playbackState` 播放状态。有效值为"none", "paused", "playing".
- `setActionHandler()` 设置监听 mediasession 动作的事件句柄。

```js
// 首先确保 navigator.mediaSession 属性可用
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Podcast Episode Title",
    artist: "Podcast Host",
    album: "Podcast Name",
    artwork: [{ src: "podcast.jpg" }],
  });

  var audio = document.querySelector("#player");
  audio.src = "song.mp3";
  function play() {
    audio.play();
    navigator.mediaSession.playbackState = "playing";
  }

  function pause() {
    audio.pause();
    navigator.mediaSession.playbackState = "Paused";
  }
  // 还有seekbackward  seekforward previoustrack nexttrack等
  navigator.mediaSession.setActionHandler("play", play);
  navigator.mediaSession.setActionHandler("pause", pause);
}
```

## onLine

返回浏览器的在线状态。该属性返回一个布尔值，true 表示在线，false 表示离线。通过监听 online 和 offline 事件来观察网络状态的变化。

```js
if (navigator.onLine) {
  console.log("在线");
} else {
  console.log("离线");
}

window.addEventListener("offline", e => {
  console.log("离线");
});

window.addEventListener("online", e => {
  console.log("在线");
});
```

## pdfViewerEnabled

浏览器是否支持在导航到 PDF 文件时以内联方式显示它们。如果浏览器不支持内联显示，则 PDF 文件将被下载，并可能由外部应用程序处理。

```js
if (!navigator.pdfViewerEnabled) {
  // 浏览器不支持内联查看 PDF 文件。
}
```

## serial

返回一个 Serial 对象，该对象是 Web Serial API 的入口点。

```js
navigator.serial.addEventListener("connect", e => {
  // Connect to `e.target` or add it to a list of available ports.
});

navigator.serial.addEventListener("disconnect", e => {
  // Remove `e.target` from the list of available ports.
});

navigator.serial.getPorts().then(ports => {
  // 页面加载时，使用 `ports` 初始化可用端口列表。
});

button.addEventListener("click", () => {
  const usbVendorId = 0xabcd;
  navigator.serial
    .requestPort({ filters: [{ usbVendorId }] })
    .then(port => {
      // Connect to `port` or add it to the list of available ports.
    })
    .catch(e => {
      // The user didn't select a port.
    });
});
```

## usb

返回当前文档的 USB 对象，用于访问 WebUSB API 的功能.WebUSB API 提供了一种将非标准通用串行总线（USB）兼容设备服务暴露到 web 的方法，使 USB 更安全，更易于使用。

USB 是有线外设的事实标准。连接到计算机的 USB 设备通常分为许多类型：如键盘、鼠标、视频设备等。这些是使用操作系统的类驱动程序支持的。其中许多也可以在 web 中通过 WebHID API 进行访问。

除了这些标准化的设备之外，还有大量的设备不属于任何类别。这些设备需要自定义驱动程序，并且由于需要机器代码（native code），因此无法从 web 访问。安装这些设备，通常需要在制造商的网站上搜索驱动程序，如果你想在另一台电脑上使用该设备，还必须重复这个过程。

WebUSB 为这些非标准化的 USB 设备服务提供了一种在 web 中可用的方式。这意味着硬件制造商将能够为他们的设备提供一种从 web 访问的方式，而不必提供自己的 API。

当连接新的与 WebUSB 兼容的设备时，浏览器会显示一条包含制造商网站链接的通知。进入网站后，浏览器会弹出提示，请求连接到设备，然后设备就可以使用了。不需要下载和安装驱动程序。

```js
//访问连接的 Arduino 设备，其 vendorId 为 0x2341。
navigator.usb
  .requestDevice({ filters: [{ vendorId: 0x2341 }] })
  .then(device => {
    console.log(device.productName); // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  })
  .catch(error => {
    console.error(error);
  });

// getDevices() 查找所有已经连接的设备。
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName); // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
});
```

## userActivation

返回一个 UserActivation 对象，UserActivation 接口提供有关用户当前是否正在与页面交互，或者自页面加载以来是否已完成交互的信息。

此 API 仅在 window 上下文中可用，web worker 中不可用。

- `isActive` 指示当前窗口是否具有瞬态（用户）激活:用户当前正在与页面交互
- `hasBeenActive` 指示当前窗口是否具有粘性（用户）激活:自页面加载以来，用户至少交互过一次

```js
if (navigator.userActivation.isActive) {
  // 例如，继续请求播放媒体
}

if (navigator.userActivation.hasBeenActive) {
  // 例如，继续自动播放动画。
}
```

## userAgent

一个字符串，用于指定浏览器在 HTTP 标头以及当前属性和 Navigator 对象的其他相关方法的响应中提供的完整用户代理字符串。

> 基于用户代理字符串来识别浏览器是不可靠的且不推荐，因为用户代理字符串是可以由用户配置的。Mozilla/5.0 是一个通用标记，表示浏览器与 Mozilla 兼容

```md
// HTTP 标头
User-Agent: <product> / <product-version> <comment>

// web 浏览器的通用格式为：
User-Agent: Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>

// Firefox 浏览器
Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0
Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0

// Chrome 浏览器
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36

// Opera 添加了`OPR/<version>`
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41

// Edge 添加了 "Edg/<version>"。
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59

// Sarari 示例中是移动版 Safari 的版本信息，其中包含了单词 "Mobile"。
Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1

// 爬虫和机器人
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots)

// 库与网络工具
curl/7.64.1
PostmanRuntime/7.26.5
```

## userAgentData

返回一个 NavigatorUAData 对象，包含浏览器和操作系统的信息。

- `brands` 包含浏览器名称和版本的品牌信息的数组。
- `mobile` 是否移动设备上运行
- `platform` 设备平台品牌。
- `getHighEntropyValues()` 包含用户代理返回的高熵值（信息量多）的字典对象。
- `toJSON()` 返回 NavigatorUAData 对象的低熵属性的 JSON 表示。

```js
// 打印浏览器品牌信息
console.log(navigator.userAgentData.brands);

navigator.userAgentData
  .getHighEntropyValues([
    "architecture",
    "model",
    "platform",
    "platformVersion",
    "fullVersionList",
  ])
  .then((ua) => {
    console.log(ua);
  });
  // 输出值：
{
    "architecture": "x86",
    "brands": [
        {
            "brand": "Chromium",
            "version": "130"
        },
        {
            "brand": "Microsoft Edge",
            "version": "130"
        },
        {
            "brand": "Not?A_Brand",
            "version": "99"
        }
    ],
    "fullVersionList": [
        {
            "brand": "Chromium",
            "version": "130.0.6723.92"
        },
        {
            "brand": "Microsoft Edge",
            "version": "130.0.2849.68"
        },
        {
            "brand": "Not?A_Brand",
            "version": "99.0.0.0"
        }
    ],
    "mobile": false,
    "model": "",
    "platform": "Windows",
    "platformVersion": "15.0.0"
}
```

## virtualKeyboard

返回对 VirtualKeyboard 实例对象的引用。可以以编程方式显示或隐藏虚拟键盘，以及获取虚拟键盘的当前位置和大小。

- `boundingRect` 描述虚拟键盘几何结构的 DOMRect。
- `overlaysContent` 是否应停止处理屏幕虚拟键盘。
- `show()` 显示虚拟键盘。
- `hide()` 隐藏虚拟键盘。
- `ongeometrychange` 当屏幕虚拟键盘的几何形状发生变化时（即虚拟键盘显示或隐藏时）触发

如何选择不使用自动虚拟键盘行为，并检测网页中虚拟键盘的几何形状：

```js
if ("virtualKeyboard" in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;

  navigator.virtualKeyboard.addEventListener("geometrychange", event => {
    const { x, y, width, height } = event.target.boundingRect;
  });
}
```

## wakeLock

WakeLock 接口。当屏幕唤醒锁处于激活状态时，用户代理将尝试阻止设备调暗屏幕、完全关闭屏幕或显示屏幕保护程序。

- request() 在屏幕唤醒锁被授予时会兑现为一个 WakeLockSentinel 对象。

```js
try {
  let wakeLockSentinel = await navigator.wakeLock.request("screen");

  wakeLockSentinel.addEventListener("release", () => {
    // 如果唤醒锁被释放，相应地改变UI
  });

  wakeLockSentinel.release().then(() => {
    wakeLockSentinel = null;
  });
} catch (err) {
  // 唤醒锁请求失败——通常是系统原因，例如设备电量不足
}
```

## storage

单例的 StorageManager 对象，用于管理数据本地存储权限和估算可用存储空间的接口。仅在一些支持的浏览器的安全上下文（HTTPS）中可用。worker 中可用

- `estimate()` 返回一个 StorageEstimate 对象，包含域名预留的存储空间总大小和已用存储空间大小。
- `persist()` 是否数据能持久保存
- `persisted()` 是否被授予使用数据本地存储的权限，
- `getDirectory()` 获取对 FileSystemDirectoryHandle 对象的引用，可访问存储在源私有文件系统（OPFS）中的目录及目录的内容。

```js
// quota:配额，可用空间。usage：已经使用的空间。
navigator.storage.estimate().then(function (estimate) {
  // estimate.usage / estimate.quota
});

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(function (persistent) {
    console.log("是否数据可持久保存", persistent);
  });

  navigator.storage.persisted().then(function (persisted) {
    console.log("是否获得数据本地储存权限", persisted);
  });
}
```

以下异步事件处理函数包含在 Web Worker 中。从主线程收到消息后：

```js
onmessage = async e => {
  // 从主线程检索发送到 worker 的消息
  const message = e.data;

  // 获取访问文件目录的句柄
  const FileSystemDirectoryHandle = await navigator.storage.getDirectory();
  const draftHandle = await FileSystemDirectoryHandle.getFileHandle(
    "draft.txt",
    { create: true }
  );
  // 获取同步访问句柄
  const accessHandle = await draftHandle.createSyncAccessHandle();

  // 获取文件的大小
  const fileSize = accessHandle.getSize();
  // 将文件内容读取到缓冲区
  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });

  // 将消息写入文件末尾
  const encodedMessage = new TextEncoder().encode(message);
  const writeBuffer = accessHandle.write(encodedMessage, { at: readBuffer });

  // 将更改保存到磁盘
  accessHandle.flush();

  // 如果完成，请始终关闭 FileSystemSyncAccessHandle
  accessHandle.close();
};
```

## webdriver

WebDriver 是远程控制接口，可以对用户代理进行控制。它提供了一个平台和中立语言协议结构，作为进程外程序远程指导 web 浏览器行为的方法。

WebDriver 所提供的是一组接口，用于发现和操作网络文档中的 DOM 元素，并控制用户代理的行为。它的主要目的是让 web 作者编写测试，从单独的控制过程中实现用户代理的自动化，但也可以用这样的方式，让浏览器内的脚本控制一个（单独的）浏览器。

用流行的 Python 语言编写的客户端，与 WebDriver 的互动可能看起来像这样：

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located



with webdriver.Firefox() as driver:

    driver.get("http://google.com/ncr")
    wait = WebDriverWait(driver, 10)
    driver.find_element(By.NAME, "q").send_keys("cheese" + Keys.RETURN)
    wait.until(presence_of_element_located((By.XPATH, '//*[@id="rcnt"]')))
    results = driver.find_elements(By.XPATH, "//a[@href]")

    for i, elem in enumerate(results):
        print(f'#{i} {elem.text} ({elem.get_attribute("href")})')
```

可能会输出：
`#1 Cheese - Wikipedia (https://en.wikipedia.org/wiki/Cheese)`

## windowControlsOverlay

Window Controls Overlay API 使安装在桌面操作系统上的渐进式 Web 应用程序能够隐藏默认窗口标题栏并显示其自己的内容 在应用程序窗口的整个外围应用区域上，将控制按钮（Maximize、Minimize 和 Close）转换为叠加层。使用此功能前，必须满足以下条件：

- Web App Manifest 的 display_override 属性设置为 .window-controls-overlay
- 渐进式 Web 应用程序必须安装在桌面操作系统上。

渐进式 Web 应用程序可以使用 `titlebar-area-x titlebar-area-y titlebar-area-width titlebar-area-height` CSS 环境变量将其 Web 内容放置在标题栏通常占据的区域。

WindowControlsOverlay 接口公开有关几何图形的信息 的标题栏区域，以及每当更改时要了解的事件。

- `visible` 一个布尔值，指示窗口控件叠加是否可见。
- `getTitlebarAreaRect()` 返回标题栏的大小和位置。
- `ongeometrychange` 当标题栏区域的几何图形发生更改时触发。

```js
// 特性检测
if ("windowControlsOverlay" in navigator) {
  navigator.windowControlsOverlay.addEventListener("geometrychange", event => {
    if (event.visible) {
      const { x, y, width, height } = event.titlebarAreaRect;
      console.log(
        `The titlebar area coordinates are x:${x}, y:${y}, width:${width}, height:${height}`
      );
    }
  });
  if (navigator.windowControlsOverlay.visible) {
    // 对标题栏矩形区域做一些处理。
    const rect = navigator.windowControlsOverlay.getTitlebarAreaRect();

    // {
    //     "x": 0,
    //     "y": 0,
    //     "width": 0,
    //     "height": 0,
    //     "top": 0,
    //     "right": 0,
    //     "bottom": 0,
    //     "left": 0
    // }
  } else {
    // Do something else when it isn't visible.
  }
}
```
