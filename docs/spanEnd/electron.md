## Electron 简介

Electron 是一个使用 JavaScript、HTML 和 CSS 构建桌面应用的框架。通过将 Chromium 和 Node.js 嵌入到其二进制文件中，Electron 允许你维护一个 JavaScript 代码库并创建可在 Windows、macOS 和 Linux 上运行的跨平台应用 - 无需原生开发经验。一个 Electron 应用分为一个主进程和若干个渲染进程

- 主进程：  
  任何 Electron 应用的入口点都是其 main 脚本。该脚本控制主进程，该进程在完整的 Node.js 环境中运行，负责控制应用的生命周期、显示原生界面、执行特权操作以及管理渲染器进程（稍后会详细介绍）。

  在执行过程中，Electron 将在应用的 package.json 配置的 main 字段中查找此脚本，你应该在 应用脚手架 步骤中配置该脚本。

- 渲染进程：  
  每个页面窗口都是一个渲染进程。

## 主进程

```js
/**
 * @app 当前应用
 * @BrowserWindow  用于新建窗口
 * @ipcMain 主进程：用于和渲染进程通信
 * @screen 获取屏幕信息
 * @BrowserWindowConstructorOptions 窗口选项的定义
 * @session
 *    defaultSession.loadExtension(plugin) 加载插件
 * @dialog 弹窗对象：
 *showErrorBox(message)
 *showMessageBox({message:'信息',type:'infor',title:'title',buttons:['是','否']})
 * @shell
 *    openExternal(url) 使用浏览器打开应用
 * @nativeTheme
 *    themeSource:system|light|dark 修改主题
 * IpcMianEvent
 */
import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  BrowserWindowConstructorOptions,
  dialog,
  shell,
  nativeTheme,
} from "electron";

/**
 * electron基于node环境，主进程可以使用node模块
 */
import path from "node:path";

function talkWithRender() {
  /** ipcMain用于和渲染进程进行通信
   * 监听渲染进程的talk事件，回调函数接受事件对象和传里的数据
   * 通过on(eventName,callback)监听通过send派发的事件。同步事件
   * 通过handle(eventName,callback)监听通过invoke派发的事件，其
   * 返回值会发送给渲染进程。为异步事件
   */
  ipcMain.handle("talk", (event, value) => {
    event.sender.send(
      "talk",
      "双向通信：通过sender拿到webContents,再次派发talk事件"
    );
    return "渲染进程，你好";
  });
  ipcMain.handleOnce("onceEvent", (event, value) => {
    console.log("只会异步通信一次");
  });
  ipcMain.on("test", (event, data) => {
    event.returnValue = "把数据同步发给渲染进程";
  });
}

// 分装创建新窗口的工厂函数
function createWindow() {
  /** BrowserWindow窗口构造器
   *  getAllWindows()获取所有窗口对象
   *  formId(windowId) 返回windowId对应的窗口对象
   *  getFocusedWindow() 获取聚焦的窗口
   *
   */

  /**
   * 使用BrowserWindow()新建一个窗口，参数为窗口配置对象
   * 每个窗口都属于一个渲染进程，
   * setPosition(x,y) 设置窗口位置
   * getBounds()  获取窗口边界信息
   * setBounds({x,y,width,height})
   * webContents  获取窗口web内容对象
   * id 窗口唯一标识id
   * isMinimized() 是否最小状态
   * restore()  恢复窗口
   * focus()  使窗口聚焦
   * removeAllListeners() 取消订阅所有与该窗口相关的事件
   * setProgressBar(number) 设置托盘图表进度
   * isDestroyed() 是否已经被销毁
   * isFocused() 是否聚焦
   * loadURL(remoteURL) 加载远程url页面
   * loadFile('index.html') 加载本地页面
   * getSize()  获取窗口大小
   * @return 窗口对象
   */
  const mainWindow = new BrowserWindow({
    title: "窗口标题",
    icon: "/hello.svg", // 托盘图表
    width: 800, //窗口宽度
    height: 600, //窗口高度

    show: true, // 是否显示窗口
    //web偏好配置
    webPreferences: {
      offscreen: false, // 是否显示UI页面
      // 渲染进程执行前需要执行的脚本，其属于特殊的渲染进程
      preload: path.resolve("./preload/preload.js"),
      // 是否集成node，集成后可部分使用node功能
      nodeIntegration: true,
      // 是否上下文隔离，隔离后不能使用contextBridge通信，只能使用进程间通讯
      contextIsolation: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173/");
  mainWindow.on("closed", () => {
    console.log("窗口已经关闭了");
    childWindow.removeAllListeners();
    childWindow = null;
  });
  /** 窗口里的内容对象
   *  send('eventName',data) 同步触发eventName事件
   * openDevTools() 打开开发者工具
   * setWindowOpenHandler(callback(content)=>({action:'deny'}))
   *
   */
  const webContents = mainWindow.webContents;
  webContents.openDevTools();
  webContents.on("did-finish-load", () => {
    console.log("页面资源加载完毕执行：", mainWindow.getTitle(), 3);
  });
}

/** app应用已经完成初始化工作，准备创建窗口
 * disableHardwareAcceleration() 禁用GPU加速
 * getName() 获取应用名称
 * setAppUserModelId()
 * requestSingleInstanceLock() 单例锁，保证只有一个app运行
 * quit() 停止运行，退出应用
 * setAsDefaultProtocolClient(protocl,path,args) 注册应用唤醒的协议
 * isPackaged 是否被打包过
 * @return 初始化完成后兑现的promise
 */
app.whenReady().then(() => {
  createWindow(); // 初始化之后，开始创建窗口
  app.on("activate", function () {
    /**
     * 相比之下，macOS 应用通常即使没有打开任何窗口也会继续运行。
     * 在没有可用窗口时激活应用应该会打开一个新窗口。
     */
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//所有窗口关闭后退出应用（Windows 和 Linux）
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
app.on("browser-window-created", function (v) {
  talkWithRender();
});
// 第二个实例唤醒
app.on("second-instance", function (event, args, workingDirectory) {
  talkWithRender();
});
```

## prefetch 预渲染进程

```js
/**
 * preload脚本会在index.html加载前执行。有权限访问web API，可以访问electron的ipcRenderer模块，和部分node功能。
 */
const { contextBridge, ipcRenderer } = require("electron");

let talkWithMain = async value => {
  /**
   * 拿到渲染进程传来的value，通过ipcRenderer.invoke(eventName,value)
   * 派发主进程的handle(eventName,callback(event,value)=>{})事件监听器
   * @return 主进程handle的回调函数返回的数据
   */
  let result = await ipcRenderer.invoke("talk", value); // send invoke
  console.log("主进程返回的数据", result);
};

/** contextBridge为主进程和渲染进程的桥梁：向渲染进程暴露属性和方法
 * 当前窗口没有配置contextIsolation:true的话，可以使用
 * contextBridge.exposeInMainWorld(key,value)，向渲染进程暴露数据
 * 渲染进程可通过window.electronAPI拿到此数据
 */
contextBridge.exposeInMainWorld("electronAPI", {
  talkWithMain,
});

// prefetch可以使用web API，可以使用部分node功能process
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
```

## 渲染进程

```js
// 通过contextBridge暴露的数据 和主进程通信
const talkHandler = () => {
  window.electronAPI.talkWithMain("主进程，你好啊");
};

// 直接使用进程间通信
import { ipcRenderer } from "electron";

// 监听主进程的send('langChange',value) 事件
ipcRenderer.on("langChange", (event, data) => {
  console.log("同步监听langChange事件");
});
// 派发主进程通过handle注册的talk事件
let result = await ipcRenderer.invoke("talk", value);
console.log("主进程返回的数据", result);
```
