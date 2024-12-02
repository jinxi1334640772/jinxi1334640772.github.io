# Web API

## 键盘 API

键盘映射 API 提供了一种通过 Keyboard 接口和 KeyboardLayoutMap 接口检索特定按键所生成的字符串的方法。可以通过 navigator.keyboard 属性访问 Keyboard 接口。Keyboard 接口提供 Keyboard.getLayoutMap 方法，该方法返回一个 promise，其兑现一个 KeyboardLayoutMap 对象，该对象包含用于将代码转换为键的成员。

如何获取与英语 QWERTY 键盘上标记为 W 的键相关联的位置特定或布局特定字符串:

```js
if (navigator.keyboard) {
  const keyboard = navigator.keyboard;
  // keyboardLayoutMap实例是一个类 map 对象，具有检索与特定物理键关联的字符串的功能。
  keyboard.getLayoutMap().then(keyboardLayoutMap => {
    /**keyboardLayoutMap对象属性和方法：
     * size KeyboardLayoutMap 对象中的元素数量
     * has
     * get
     * keys
     * values
     * entries
     * forEach 每个元素执行一次提供的函数
     */
    const upKey = keyboardLayoutMap.get("KeyW");
    window.alert(`按 ${upKey} 向上移动。`);
  });

  //返回一个 Promise，在启用对物理键盘上任意或所有按键的按键捕获后兑现。
  // 键盘锁定：游戏的时候可以防止其他按键的干扰
  navigator.keyboard.lock(["KeyW", "KeyA", "KeyS", "KeyD"]);

  //解锁 lock() 方法捕获的所有键并同步返回
  navigator.keyboard.unlock(["KeyW", "KeyA", "KeyS", "KeyD"]);
} else {
  // 做点别的事。
}
```

无论按键时使用哪种修饰符，此操作都会捕获这些键。

![niia](writing-system-keys.png)

## Launch Handler API

允许开发人员控制渐进式 Web 应用程序 （PWA） 的启动方式，例如，它是使用现有窗口还是创建新窗口，以及如何处理应用程序的目标启动 URL。

您可以通过将 launch_handler 字段添加到 Web 应用程序清单文件来指定应用程序的启动行为

```json
"launch_handler": {
  // 应如何启动和导航到应用程序
    "client_mode": "focus-existing",
}
```

使用时，您可以在 window.launchQueue.setConsumer（） 的回调函数中包含代码，以提供对 targetURL 的自定义处理 focus-existing

```js
if ("launchQueue" in window) {
  window.launchQueue.setConsumer(launchParams => {
    //launchParams:在 PWA 中实施自定义启动导航处理时使用
    if (launchParams.targetURL) {
      const params = new URL(launchParams.targetURL).searchParams;

      // Assuming a music player app that gets a track passed to it to be played
      const track = params.get("track");
      if (track) {
        audio.src = track;
        title.textContent = new URL(track).pathname.substr(1);
        audio.play();
      }
    }
  });
}
```

## Local Font Access API

Local Font Access API 提供了一种访问用户本地安装的字体数据的机制——这包括更高层次的详细信息，例如名称、样式和系列，以及底层字体文件的原始字节内容。

Window.queryLocalFonts() 方法提供对本地安装的字体的数组的访问，每个字体都由一个 FontData 对象实例表示。FontData 有多个属性，提供对名称、样式和字体族的访问，并且它还有一个 blob() 方法，提供对包含底层字体文件的原始字节内容的 Blob 的访问。

```js
// 支持本地字体访问 API
if ("queryLocalFonts" in window) {
  async function logFontData() {
    try {
      // 查询所有可用字体并打印元数据
      const availableFonts = await window.queryLocalFonts();
      for (const fontData of availableFonts) {
        console.log(fontData.postscriptName);
        console.log(fontData.fullName);
        console.log(fontData.family);
        console.log(fontData.style);
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  //访问底层数据
  async function computeOutlineFormat() {
    try {
      const availableFonts = await window.queryLocalFonts({
        postscriptNames: ["ComicSansMS"],
      });
      for (const fontData of availableFonts) {
        // `blob()` 方法返回一个包含有效且完整的 SFNT 包装字体数据的 Blob。
        const sfnt = await fontData.blob();
        // 仅裁剪出我们需要的字节部分：前 4 个字节是 SFNT 版本信息。
        // 规范：https://learn.microsoft.com/zh-cn/typography/opentype/spec/otff#organization-of-an-opentype-font
        const sfntVersion = await sfnt.slice(0, 4).text();

        let outlineFormat = "UNKNOWN";
        switch (sfntVersion) {
          case "\x00\x01\x00\x00":
          case "true":
          case "typ1":
            outlineFormat = "truetype";
            break;
          case "OTTO":
            outlineFormat = "cff";
            break;
        }
        console.log("矢量字体格式：", outlineFormat);
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
}
```

## 媒体功能 API

媒体功能 API 允许开发人员确定设备的解码和编码功能，公开媒体是否受支持、播放是否应流畅且节能等信息，并提供有关播放的实时反馈，以更好地启用自适应流式处理，并访问显示属性信息。

媒体功能 API 提供了比 MediaRecorder.isTypeSupported（） 或 HTMLMediaElement.canPlayType（） 更强大的功能，后者仅解决一般浏览器支持问题，而不解决性能问题。该 API 还提供了访问显示属性信息的功能，例如支持的色域、动态范围功能以及有关播放的实时反馈。

要测试对视频或音频内容进行编码和解码的支持、流畅度和能效，请使用 MediaCapabilities 接口的 encodingInfo（） 和 decodingInfo（） 方法。

```js
if ("mediaCapabilities" in navigator) {
  const audioFileConfiguration = {
    type: "file",
    audio: {
      contentType: "audio/mp3",
      channels: 2,
      bitrate: 132700,
      samplerate: 5200,
    },
  };

  navigator.mediaCapabilities
    .decodingInfo(audioFileConfiguration)
    .then(result => {
      console.log(
        `This configuration is ${result.supported ? "" : "not "}supported,`
      );
      console.log(`${result.smooth ? "" : "not "}smooth, and`);
      console.log(`${result.powerEfficient ? "" : "not "}power efficient.`);
    })
    .catch(() => {
      console.log(`decodingInfo error: ${contentType}`);
    });
}
```

## 媒体捕捉与媒体流 API（媒体流）

媒体捕捉与媒体流 API（Media Capture and Streams API），通常被称为媒体流 API（Media Streams API、MediaStream API），是与 WebRTC 相关的 API，提供对音频或视频数据流的支持。

它提供了用于处理媒体流及其组成轨道的接口和方法、与数据格式相关的约束、异步使用数据时成功和错误的回调以及在处理期间触发的事件。

一个 MediaStream 包含零个或多个代表各种声音和视频轨道的 MediaStreamTrack 对象。每一个 MediaStreamTrack 可能有一个或多个通道。这个通道代表着媒体流的最小单元，比如一个音频信号对应着一个对应的扬声器，像是在立体声道中的左声道或右声道。

MediaStream 对象有着单一的输入和输出。由 getUserMedia() 创建的 MediaStream 对象是在本地借助用户相机和麦克风的源输入。非本地的 MediaStream 可能代表一个媒体元素（如 `<video> 或 <audio>`），或是一个通过 WebRTC RTCPeerConnection API 获得的源自网络的媒体流，又或是一个使用 Web 音频 API 的 MediaStreamAudioDestinationNode 创建的媒体流。

MediaStream 对象的输出能连接到一个消费端（consumer）。它可以是一个媒体元素（如 `<audio> 或 <video>`），也可以是 WebRTC RTCPeerConnection API 或 Web 音频 API 的 MediaStreamAudioSourceNode。

MediaDevices 接口提供访问连接媒体输入的设备，如照相机和麦克风，以及屏幕共享等。它可以使你取得任何硬件资源的媒体数据。

```js
"use strict";

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector("video");
var constraints = (window.constraints = {
  audio: false,
  video: true,
});
var errorElement = document.querySelector("#errorMsg");

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    var videoTracks = stream.getVideoTracks();
    console.log("Got stream with constraints:", constraints);
    console.log("Using video device: " + videoTracks[0].label);
    stream.onended = function () {
      console.log("Stream ended");
    };
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
  })
  .catch(function (error) {
    if (error.name === "ConstraintNotSatisfiedError") {
      errorMsg(
        "The resolution " +
          constraints.video.width.exact +
          "x" +
          constraints.video.width.exact +
          " px is not supported by your device."
      );
    } else if (error.name === "PermissionDeniedError") {
      errorMsg(
        "Permissions have not been granted to use your camera and " +
          "microphone, you need to allow the page access to your devices in " +
          "order for the demo to work."
      );
    }
    errorMsg("getUserMedia error: " + error.name, error);
  });

function errorMsg(msg, error) {
  errorElement.innerHTML += "<p>" + msg + "</p>";
  if (typeof error !== "undefined") {
    console.error(error);
  }
}
```

## 媒体会话 API

媒体会话 API 提供了一种自定义媒体通知的方法。它通过提供元数据供 Web 应用程序正在播放的媒体的用户代理显示来实现此目的。

它还提供了操作处理程序，浏览器可以使用这些操作处理程序来访问平台媒体键，例如键盘、耳机、遥控器上的硬件键，以及移动设备的通知区域和锁屏界面上的软件键。因此，您可以通过设备无缝控制 Web 提供的媒体，即使不查看网页也是如此。

目的是让用户知道正在播放的内容并对其进行控制，而无需打开启动它的特定页面。为了能够支持媒体会话 API，浏览器首先需要一种机制，通过该机制来访问操作系统级媒体控件（例如 Firefox 的 MediaControl）并受其控制。

MediaSession 界面允许用户通过用户代理定义的界面元素控制媒体的播放。与这些元素的交互会触发播放媒体的网页上的操作处理程序。由于多个页面可能同时使用此 API，因此用户代理负责调用正确页面的操作处理程序。当没有页面定义的行为可用时，用户代理会提供默认行为。

为音乐播放器设置操作处理程序:以下示例显示了媒体会话 API 的功能检测。然后，它会实例化会话的元数据对象，并为用户控制操作添加操作处理程序：

```js
/**
 * 某些用户代理在移动设备上禁用媒体元素的自动播放，并需要用户手势才能启动媒体。以下示例将事件添加到页面上的播放按钮，然后使用该按钮启动媒体会话代码：pointerup
 */
playButton.addEventListener("pointerup", event => {
  const audio = document.querySelector("audio");

  // User interacted with the page. Let's play audio!
  audio
    .play()
    .then(() => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "Unforgettable",
          artist: "Nat King Cole",
          album: "The Ultimate Collection (Remastered)",
          artwork: [
            {
              src: "https://dummyimage.com/96x96",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "https://dummyimage.com/128x128",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "https://dummyimage.com/192x192",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "https://dummyimage.com/256x256",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "https://dummyimage.com/384x384",
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: "https://dummyimage.com/512x512",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("seekbackward", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("seekto", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("skipad", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("togglecamera", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("togglemicrophone", () => {
          /* Code excerpted. */
        });
        navigator.mediaSession.setActionHandler("hangup", () => {
          /* Code excerpted. */
        });

        //要将媒体会话的当前状态设置为 ：MediaSessionplaying
        navigator.mediaSession.playbackState = "playing";
      }
    })
    .catch(error => {
      console.error(error);
    });
});
```

## MediaStream Recording API

媒体流 (音/视频) 录制 API 让记录音频流或视频流信息更加容易。当使用 navigator.mediaDevices.getUserMedia()"时，它提供了一种简单的方式从用户的输入设备中记录信息，并且可以马上在 web apps 中查看记录的信息。音/视频信息都可以被录制，可以分开也可以一块儿。

使用 getUserMedia() 来捕获我们想要的媒体流。我们使用 MediaRecorder API 来记录信息流，并将每个记录的片段输出到生成的`<audio>`元素的源中，以便可以回放。

```js
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  var audio = document.createElement("audio");
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(audio);
  // 使用getUserMedia，仅抓取音频流
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      // 创建媒体记录器实例，并直接传递该媒体流
      var mediaRecorder = new MediaRecorder(stream);
      //0s后开始录音：调用MediaRecorder.start()
      setTimeout(() => {
        mediaRecorder.start();
        console.log("recording状态", mediaRecorder.state);
      }, 0);
      // 收集录制的数据
      var chunks = [];
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };
      // 5s后结束录制
      setTimeout(function () {
        mediaRecorder.stop();
        console.log("inactive状态", mediaRecorder.state);
      }, 5000);
      // 录音停止时，使用抓取到的blob数据，赋给audio.src
      mediaRecorder.onstop = function (e) {
        var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        var audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
      };
    })
    .catch(function (err) {
      console.log("The following getUserMedia error occured: " + err);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}
```

## 页面可见性 API

页面可见性 API 提供了一些事件，你可以通过查看这些事件来了解文档何时变为可见或隐藏，还提供了一些功能来查看页面的当前可见性状态。

通过让页面在文档不可见时避免执行不必要的任务，这对于节省资源和提高性能特别有用。

```js
<audio
  controls
  src="https://mdn.github.io/webaudio-examples/audio-basics/outfoxing.mp3"></audio>;

const audio = document.querySelector("audio");
document.addEventListener("visibilitychange", () => {
  // visible hidden
  if (document.visibilityState === "visible") {
    audio.pause();
  } else {
    audio.play();
  }
});
```

## Web 定期后台同步 API

允许 Web 应用程序定期提醒其 Service Worker 进行任何更新。用途可能包括在设备连接到 Wi-Fi 时获取最新内容，或允许对应用程序进行后台更新。

调用 API 时设置最小时间间隔;但是，用户代理还可能考虑影响 Service Worker 何时接收事件的其他因素。例如，以前的网站参与或连接到已知网络。

PeriodicSyncManager 接口可通过 ServiceWorkerRegistration.periodicSync 获得。设置唯一标记标识符以“命名”同步事件，然后可以在 ServiceWorker 脚本中侦听该事件。收到事件后，您可以运行任何可用的功能，例如更新缓存或获取新资源。

由于此 API 依赖于 Service Worker，因此此 API 提供的功能仅在安全上下文中可用。

```js
//异步函数以至少一天的间隔从浏览上下文注册定期后台同步：
async function registerPeriodicNewsCheck() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.periodicSync.register("get-latest-news", {
      minInterval: 24 * 60 * 60 * 1000,
    });

    //通过标签验证后台定期同步
    registration.periodicSync.getTags().then(tags => {
      if (tags.includes("get-latest-news")) {
        console.log("已经注册get-latest-news事件");

        // 删除定期后台同步任务
        registration.periodicSync.unregister("get-latest-news");
      }
    });
  } catch {
    console.log("Periodic Sync could not be registered!");
  }
}

//在 Service Worker 中侦听定期后台同步
self.addEventListener("periodicsync", event => {
  if (event.tag === "get-latest-news") {
    event.waitUntil(fetchAndCacheLatestNews());
  }
});
```

## 画中画 API

画中画 API（Picture-in-Picture API）允许网站总是在其他窗口之上创建一个浮动的视频，以便用户在其他内容站点或者设备上的应用程序交互时可以继续播放媒体。

> 文档画中画 API 扩展了画中画 API，使其能够将任意 HTML 内容（而不仅仅是视频）呈现在始终置顶的窗口中。

```js
function togglePictureInPicture() {
  // 已经存在画中画元素
  if (document.pictureInPictureElement) {
    // 退出画中画模式
    document.exitPictureInPicture();
  } else {
    // 支持画中画模式
    if (document.pictureInPictureEnabled) {
      // 启动画中画
      let PictureInPictureWindow = video.requestPictureInPicture();

      PictureInPictureWindow.onresize = function (evnet) {
        console.log(
          PictureInPictureWindow.width,
          PictureInPictureWindow.height
        );
      };
    }
  }
}
document.addEventListener("enterpictrueinpictrue", function (event) {
  console.log("进入画中画模式时触发");
});
document.addEventListener("leavepictrueinpictrue", function (event) {
  console.log("离开画中画模式时触发");
});
document.addEventListener("resize", function (event) {
  console.log("画中画大小改变时触发");
});
```

## 指针锁定 API

通过它可以访问原始的鼠标运动，把鼠标事件的目标锁定到一个单独的元素，这就消除了鼠标在一个单独的方向上到底可以移动多远这方面的限制，并从视图中删去光标。

> 指针锁定让你即使光标超出浏览器或屏幕的边界也能访问鼠标事件。

指针锁定和指针捕获有关。指针捕获在鼠标被拖曳时可以向一个目标元素持续传递有关事件，但是当鼠标按钮被放开时就会停止。指针锁定和指针捕获在以下方面有所不同：

- 它是持久性的。指针锁定不释放鼠标，直到作出一个显式的 API 调用或是用户使用一个专门的释放手势。
- 它不局限于浏览器或者屏幕边界。
- 它持续发送事件，而不管鼠标按钮状态如何。
- 它隐藏光标。

```js
function requestPointerLockWithUnadjustedMovement() {
  // 元素设置指针锁定，不启用鼠标加速
  const promise = myTargetElement.requestPointerLock({
    unadjustedMovement: true,
  });

  if (!promise) {
    console.log("不支持禁用鼠标加速");
    return;
  }

  return promise
    .then(() => console.log("指针被锁定"))
    .catch(error => {
      if (error.name === "NotSupportedError") {
        // 有些平台可能不支持未调整的移动。你可以重新请求常规指针锁定。
        return myTargetElement.requestPointerLock();
      }
    });
}

//当指针锁定状态改变时，在 document 上触发。不包含任何额外数据的简单事件。还有pointerlockerror事件
document.addEventListener("pointerlockchange", lockChangeAlert, false);

function lockChangeAlert(event) {
  // 判断当前指针锁定的元素
  if (document.pointerLockElement === canvas) {
    console.log("指针锁定状态现已锁定");
    // 退出锁定
    document.exitPointerLock();
  } else {
    console.log("指针锁定状态现已解锁");
  }
}
```

## 弹出框 API

Popover API 为开发人员提供了一种标准、一致、灵活的机制，用于在其他页面内容之上显示弹出框内容。Popover 内容可以使用 HTML 属性以声明方式控制，也可以通过 JavaScript 进行控制。

html 控制：

```html
<button popovertarget="mypopover" popovertargetaction="show">
  show popover。默认是toggle，
</button>
<button popovertarget="mypopover" popovertargetaction="hide">
  hide popove
</button>
<div id="mypopover" popover>Popover content</div>
```

js 控制:

```js
let popover = document.getElementById("mypopover");
popover.hidePopover();
popover.showPopover();
popover.togglePopover();
popover.popover === "auto" || "mannul";
popover.addEventListener("beforetoggle", function (event) {
  console.log("showing 和 hidden 之间变化之前触发");
});
popover.addEventListener("toggle", function (event) {
  console.log("showing 和 hidden 之间变化之后触发");
});
```

## 优先任务调度 API

Prioritized Task Scheduling API 提供了一种标准化方法来确定属于应用程序的所有任务的优先级，无论它们是在网站开发人员的代码中还是在第三方库和框架中定义。

该 API 基于承诺，支持设置和更改任务优先级、延迟将任务添加到计划程序、中止任务以及监控优先级更改和中止事件的功能。

```js
let controller = new AbortController();
/**
 * @callback 任务函数
 * @options
 *  priority 特定的不可变优先级
 *    user-blocking  阻止用户与页面交互的任务
 *    user-visible 对用户可见但不一定阻止用户操作的任务,默认值
 *    background 对时间要求不高的任务
 *  signal 终止信号,可以是 TaskSignal 或 AbortSignal 信号
 *  delay 将任务添加以进行计划之前的延迟（以毫秒为单位）
 * @return Promise 使用函数的返回值进行 resolve
 */
scheduler
  .postTask(() => "Task executing", {
    priority: "user-blocking",
    signal: controller.signal,
  })
  .then(taskResult => console.log(`${taskResult === "Task executing"}`))
  .catch(error => console.error(`Error: ${error}`));

// 取消任务
controller.abort();
// 特性检测
if ("scheduler" in window && "yield" in scheduler) {
  //通过将主线程让给浏览器进行其他工作，将任何异步函数转换为任务，并在返回的 Promise 解析后继续执行
  return scheduler.yield();
}
```

## Push API

Push API 的 PushManager 接口提供了从第三方服务器接收消息通知的能力。

可以通过 ServiceWorkerRegistration.pushManager 属性获得

```js
// serviceWorker接收推送消息
this.onpush = function (event) {
  let PushMessageData = event.data;
  PushMessageData.arrayBuffor();
  PushMessageData.blob();
  PushMessageData.bytes();
  PushMessageData.text();
  let obj = PushMessageData.json();

  if (obj.action === "subscribe" || obj.action === "unsubscribe") {
    fireNotification(obj, event);
    port.postMessage(obj);
  } else if (obj.action === "init" || obj.action === "chatMsg") {
    port.postMessage(obj);
  }
};

navigator.serviceWorker
  .register("serviceworker.js")
  .then(function (serviceWorkerRegistration) {
    //向 push 服务器（即第三方 push server）发起订阅。是服务器需要的 push 订阅信息
    serviceWorkerRegistration.pushManager.subscribe().then(
      function (pushSubscription) {
        //PushSubscription对象包含应用需要发送的推送消息的所有信息

        //订阅过期时间
        console.log(pushSubscription.expirationTime);
        //选项对象
        console.log(pushSubscription.options);
        //订阅 ID 的字符串。
        console.log(pushSubscription.subscriptionId);
        //终端节点的字符串。
        console.log(pushSubscription.endpoint);
        //客户端的公钥，然后可以将其发送到服务器并用于加密推送消息数据
        console.log(pushSubscription.getKey());
        //取消订阅推送服务
        pushSubscription.unsubscribe().then(result => {
          //取消成功 result = true
        });
      },
      function (error) {
        // 在生产环境下，将错误上报到服务器也是十分必要的
        console.log(error);
      }
    );
  });
```

## 屏幕捕捉 API

屏幕捕获 API 对现有的媒体捕获和流 API 进行了补充，让用户选择一个屏幕或屏幕的一部分（如一个窗口）作为媒体流进行捕获。然后，该流可以被记录或通过网络与他人共享。

使用屏幕捕获 API 及其 getDisplayMedia（） 方法捕获部分或全部屏幕，以便在 WebRTC 会议期间进行流式传输、录制或共享。

```js

const videoElem = document.getElementById("video");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

// CaptureController：用于进一步操作捕获会话
const controller = new CaptureController();

// 捕获显示器屏幕的配置对象
const displayMediaOptions = {
  video: {
    displaySurface: "browser",
    // displaySurface: "window",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    suppressLocalAudioPlayback: true,
  },
  preferCurrentTab: false,
  selfBrowserSurface: "exclude",
  systemAudio: "include",
  surfaceSwitching: "include",
  monitorTypeSurfaces: "include",
  controller
};

// 开始屏幕截图：async/await 样式
async function startCapture(displayMediaOptions) {
  let captureStream = null;
  try {
    captureStream =
    // getDisplayMedia从屏幕捕获视频流。还有getUserMedio():从摄像头捕获视频
      await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      // 把捕获的视频流，放在video元素上显示出来
    videoElem.srcObject = captureStream;
// 从捕获的数据流里，分离出视频流通道
const [track] = captureStream.getVideoTracks();
const displaySurface = track.getSettings().displaySurface;

if (displaySurface == "browser") {
  // 控制捕获的选项卡或窗口是聚焦，还是焦点仍保留在包含捕获应用的选项卡上。
  controller.setFocusBehavior("focus-captured-surface");
} else if (displaySurface == "window") {
  controller.setFocusBehavior("no-focus-change");
}
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  return captureStream;
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;

  // 视频通道track
  {
  "aspectRatio": 1.7775208140610546,
  "cursor": "motion",
  "deviceId": "window:131878:1",
  "displaySurface": "window",
  "frameRate": 30,
  "height": 2162,
  "logicalSurface": true,
  "resizeMode": "crop-and-scale",
  "width": 3843
}
}

// Set event listeners for the start and stop buttons
startElem.addEventListener(
  "click",
  (evt) => {
    startCapture();
  },
  false,
);

stopElem.addEventListener(
  "click",
  (evt) => {
    stopCapture();
  },
  false,
);
```

## 管理屏幕方向

术语 屏幕方向 是指浏览器视区是处于横向模式（即视区的宽度大于其高度），还是处于纵向模式（视区的高度大于其宽度）

CSS 提供了方向媒体功能，允许根据屏幕方向调整布局。

Screen Orientation API 提供了一个编程式 JavaScript API，用于处理屏幕方向，包括将视口锁定到特定方向的功能。

```js
// 媒体查询屏幕尺寸
@media screen and (orientation: portrait) {
  #toolbar {
    width: 100%;
  }
}

// 屏幕方向改变时触发
  /**screen.orientation属性：
   * @angle
   * @onchange
   * @type 例如：landscape-primary
   *
   */
screen.orientation.addEventListener("change", () => {

  // 锁定屏幕.锁类型: any，natural,portrait-primary,portrait-secondary,landscape-primary,landscape-secondary,portrait,landscape
  screen.orientation.lock('landscape');
  // 解锁屏幕
  screen.orientation.unlock()
});
```

## Sensor APIs

传感器 API（Sensor APIs）是一组统一设计的接口，它们在 web 平台中为各类传感器提供了一致的访问方式。

尽管通用传感器 API 规范（Generic Sensor API specification）定义了一个 Sensor 接口，但作为 web 开发者不应该直接使用它。你应该使用它的某个子类来获得指定的传感器数据。例如，accelerometer 接口返回设备当前沿所有三个轴的加速度。

传感器类型：

- `RelativeOrientationSensor` 描述设备与地球参考坐标系无关的物理方向。
- `AbsoluteOrientationSensor` 描述相对于地球参考坐标系的设备物理方向。
- `Accelerometer` 提供沿三个轴的加速度。
- `AmbientLightSensor` 返回当前光照强度或环境光照度。
- `Gyroscope` 提供三个轴向的角速度。
- `Magnetometer` 提供由设备主磁传感器检测到的磁场信息。
- `LinearAccelerationSensor` 提供去除重力贡献部分之后的沿三个轴的加速度。

```js
// 只有用户对针对某种类型的传感器授权之后，才能对该类传感器进行读取
navigator.permissions.query({ name: "accelerometer" }).then(result => {
  if (result.state === "denied") {
    console.log("Permission to use accelerometer sensor is denied.");
    return;
  }

  let accelerometer = null;
  try {
    accelerometer = new Accelerometer({ referenceFrame: "device" });
    accelerometer.addEventListener("error", event => {
      // Handle runtime errors.
      if (event.error.name === "NotAllowedError") {
        // Branch to code for requesting permission.
      } else if (event.error.name === "NotReadableError") {
        console.log("Cannot connect to the sensor.");
      }
    });
    accelerometer.addEventListener("reading", () =>
      reloadOnShake(accelerometer)
    );
    accelerometer.start();
  } catch (error) {
    // Handle construction errors.
    if (error.name === "SecurityError") {
      // See the note above about feature policy.
      console.log("Sensor construction was blocked by a feature policy.");
    } else if (error.name === "ReferenceError") {
      console.log("Sensor is not supported by the User Agent.");
    } else {
      throw error;
    }
  }
});
```

## 服务器发送事件

开发一个使用服务器发送事件的 Web 应用程序是很容易的。你只需要在服务器上编写一些代码将事件流传输到前端，而客户端的代码在处理传入事件部分几乎与 websocket 相同。这是一个单向的连接，所以你不能从客户端发送事件到服务器。

```js
// 开启与服务器的连接并从中接收事件
const evtSource = new EventSource("//api.example.com/ssedemo.php", {
  withCredentials: true,
});

evtSource.onmessage = function (event) {
  console.log("message: " + event.data);
};

// 如果服务器发送的消息中定义了 event 字段，就会以 event 中给定的名称作为事件接收
evtSource.addEventListener("ping", event => {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");
  const time = JSON.parse(event.data).time;
  newElement.textContent = `ping at ${time}`;
  eventList.appendChild(newElement);
});

evtSource.onerror = err => {
  console.error("EventSource failed:", err);
};

// 关闭连接
evtSource.close();
```

## 触摸事件

为了给基于触摸的用户界面提供高质量的支持，触摸事件提供了在触摸屏或触控板上解释手指（或触控笔）活动的能力。

触摸事件接口是较为底层的 API，可为特定程序提供多点触控交互（比如双指手势）的支持。多点触控交互开始于一个手指（或触控笔）开始接触设备平面的时刻。随后其他手指也可触摸设备表面，并随意进行划动。当所有手指离开设备平面时，交互结束。整个交互期间，程序接收开始、移动、结束三个阶段的触摸事件。

触摸事件与鼠标事件类似，不同的是触摸事件还提供同一表面不同位置的同步触摸。TouchEvent 接口将当前所有活动的触摸点封装起来。Touch 接口表示单独一个触摸点，其中包含参考浏览器视角的相对坐标。

```js
window.onload = function startup() {
  const el = document.getElementsByTagName("canvas")[0];
  //touchstart touchmove touchend touchcancel
  el.addEventListener("touchstart", handleStart, false);

  function handleStart(evt) {
    //阻止了浏览器继续处理触摸（和鼠标）事件
    evt.preventDefault();
    // 获得已改变的触摸点列表。
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      console.log("开始第 " + i + " 个触摸 ...", touches[i]);
    }
  }
};
```

## URL API

URL API 是 URL 标准的一个组件，定义了有效 URL 的构成，以及访问和操作 URL 的 API。URL 标准还定义了像域名、主机和 IP 地址等概念，并尝试以标准的方式去描述用于以键/值对的形式提交 Web 表单内容的遗留 application/x-www-form-urlencoded MIME 类型 。

> 可直接作为 fetch 的参数。fetch(new URL('http://www.example.com/index.html'));

```js
let addr = new URL("https://example.com/login?user=someguy&page=news");
let host = addr.host;
let path = addr.pathname;
// 修改username属性: addr.href=https://zhangjinxi@example.com/login?user=someguy&page=news
addr.username = "zhangjinxi";
// 获取searchParams 类似map结构的对象
let searchParams = addr.searchParams;
// 获取query值
searchParams.get("user"); // someuy
//参数列表进行排序。
searchParams.sort();

//返回一个DOMString ，包含一个唯一的 blob 链接
URL.createObjectURL(blob);
//销毁之前使用URL.createObjectURL()方法创建的 URL 实例。
URL.revokeObjectURL();
//表示绝对 URL 或与基本 URL 结合的相对地址是否可解析和有效。
URL.canParse(url, base);
//返回一个根据参数定义的新创建的 URL 对象。
URL.parse(url, base) === URL();
```

## 文本片段

文本片段（Text Fragment）允许你直接链接到 web 文档中的特定文本部分，而不需要作者使用 URL 片段中的特定语法对其进行注释。支持的浏览器可以自由选择如何引起对链接文本的注意，例如，用颜色突出显示和/或滚动到页面上的内容。

文本片段允许 web 内容作者与他们不控制的其他内容进行深度链接，而不需要依赖 ID 的存在来实现，在这一点上它很有用途。在此基础上，它可以用来生成更有效的内容共享链接，让用户相互传递。

与文档片段行为类似，文本片段被附加到 URL 的哈希符号（#）后。但语法有轻微不同：

- `:~:` 又称片段指令，这一连串的字符告诉浏览器，接下来是一个或多个用户代理指令，这些指令在加载过程中会从 URL 中剥离，以便作者脚本不能直接与之交互。用户代理指令（instruction）也被称为指令（directive）。
- `text=` 定义了在链接文档中要链接的文本。
- `textStart` 指定链接文本的开始。
- `textEnd` 指定链接文本的结束。
- `prefix-` 指定链接文本前面应该有什么文本。
- `-suffix` 指定链接文本后面应该有什么文本

支持的浏览器将滚动到并高亮显示链接文档中与指定指令相匹配的第一个文本片段。请注意，可以在同一个 URL 中指定多个文本片段，用与字符（&）将它们分开来突出显示。

```js

https://example.com#:~:text=[prefix-,]textStart[,textEnd][,-suffix]

// 滚动到文档中第一次出现“for”文本的地方并高亮它。
https://example.com#:~:text=for

//滚动到文档中第一次以“人类”开头，并以“URL”结尾的文本的地方并高亮它。
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#:~:text=人类,URL

//滚动到文档中第一次在 文本“表示”后方“本身”前方 出现“referrer”文本的地方并高亮它。
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#:~:text=表示-,referrer,-本身

//滚动到文档中第一次出现“导致”和“链接”文本的地方并高亮它们。
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#:~:text=导致&text=链接的


// 通过文档的 URL 加上其文档片段（ID）链接到某一个特定的章节：下面例子链接到ID 为`浏览器兼容性`的锚点：
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#浏览器兼容性

//链接页面需要把一个锚放在那里，以便实际地链接到。
//如果 ID 被改变或删除，文档片段就会被忽略，而链接只是链接到页面的顶部。
<h2 id="浏览器兼容性">
  <a href="#浏览器兼容性">浏览器兼容性</a>
</h2>

//自定义选中文本的样式
::target-text {
  background-color: rebeccapurple;
  color: white;
}
// 通过document.fragmentDirective：高亮的文本片段的对象，拿到文本片段的指令
items: [
  {
    prefix: "",
    textStart: "Module Workers",
    textEnd: "",
    suffix: "support",
    type: "text",
  },
  {
    prefix: "feedback on",
    textStart: "usability",
    textEnd: "",
    suffix: "",
    type: "text",
  },
];
```

## URL 模式 API

URL 模式 API 定义了用于创建 URL 模式的语法 匹配器。这些模式可以与 URL 或单个 URL 进行匹配 组件。URL 模式 API 由 URLPattern 接口使用。

模式语法基于 path-to-regexp 库中的语法。模式 可以包含：

- 将精确匹配的 Literal 字符串。
- 匹配任何字符的通配符 （）。/posts/\*
- 命名组 （），用于提取匹配 URL 的一部分。/books/:id
- 非捕获组 （），使模式的某些部分成为可选 或多次匹配。/books{/old}?
- RegExp 组 （） 使任意复杂度 正则表达式匹配，但有一些限制。请注意， 括号不是 regex 的一部分，而是将其内容定义为 regex。/books/(\\d+)

```js
// 匹配命名分组
const pattern = new URLPattern({ pathname: "/books/:id" });
console.log(pattern.test("https://example.com/books/123")); // true
console.log(pattern.exec("https://example.com/books/123").pathname.groups); // { id: '123' }

// 使用正则
const pattern = new URLPattern("/books/:id(\\d+)", "https://example.com");
console.log(pattern.test("https://example.com/books/123")); // true
console.log(pattern.test("https://example.com/books/abc")); // false
console.log(pattern.test("https://example.com/books/")); // false

// 一个可选组
const pattern = new URLPattern("/books/:id?", "https://example.com");
console.log(pattern.test("https://example.com/books/123")); // true
console.log(pattern.test("https://example.com/books")); // true
console.log(pattern.test("https://example.com/books/")); // false
console.log(pattern.test("https://example.com/books/123/456")); // false
console.log(pattern.test("https://example.com/books/123/456/789")); // false

//组分隔符包含捕获组
const pattern = new URLPattern({ pathname: "/blog/:id(\\d+){-:title}?" });
console.log(pattern.test("https://example.com/blog/123-my-blog")); // true
console.log(pattern.test("https://example.com/blog/123")); // true
console.log(pattern.test("https://example.com/blog/my-blog")); // false

// 使用组分隔符，禁用前缀片段`/`
const pattern = new URLPattern({ pathname: "/books/{:id}?" });
console.log(pattern.test("https://example.com/books/123")); // true
console.log(pattern.test("https://example.com/books")); // false
console.log(pattern.test("https://example.com/books/")); // true

// 区分大小写
const pattern = new URLPattern("https://example.com/2022/feb/*", {
  ignoreCase: true,
});
console.log(pattern.test("https://example.com/2022/feb/xc44rsz")); // true
console.log(pattern.test("https://example.com/2022/Feb/xc44rsz")); // true
```
