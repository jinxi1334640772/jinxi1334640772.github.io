# WebRTC 开发完整指南

WebRTC（Web 实时通信）是一种使 Web 应用程序和站点能够捕获和选择性地流式传输音频或视频媒体，以及在浏览器之间交换任意数据的而无需中间件的技术。

## 1. 概述

WebRTC（Web 实时通信）是一套开放的网络通信标准，它允许 Web 应用程序在浏览器之间直接进行音频、视频和数据传输，无需安装插件或第三方软件。

### 1.1 核心特点

- **点对点通信**：直接在浏览器之间建立连接
- **实时传输**：低延迟的音视频通信
- **跨平台支持**：支持所有主流浏览器和操作系统
- **安全传输**：强制使用加密传输
- **无插件要求**：基于 Web 标准，无需额外安装

### 1.2 主要应用场景

- 🎥 **视频会议和在线教育**
- 🎮 **实时游戏和协作**
- 📞 **语音通话和客服系统**
- 📱 **移动端音视频应用**
- 🖥️ **屏幕共享和远程桌面**
- 📁 **P2P 文件传输**

## 2. 核心技术架构

### 2.1 三大核心 API

WebRTC 由三项主要技术组成：

| API | 功能 | 作用 |
|-----|------|------|
| **MediaStream API** | 媒体捕获 | 获取音频、视频流 |
| **RTCPeerConnection** | 点对点连接 | 建立和管理连接 |
| **RTCDataChannel** | 数据传输 | 传输任意数据 |

### 2.2 连接建立流程

```javascript
/**
 * WebRTC 连接建立的标准流程
 * 1. 获取媒体流
 * 2. 创建 PeerConnection
 * 3. 信令交换（Offer/Answer）
 * 4. ICE 候选交换
 * 5. 建立连接
 */

class WebRTCManager {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.dataChannel = null;
    this.signalingServer = null;
  }

  /**
   * 初始化 WebRTC 连接
   */
  async initializeConnection() {
    try {
      // 步骤 1: 获取本地媒体流
      await this.getUserMedia();
      
      // 步骤 2: 创建 PeerConnection
      this.createPeerConnection();
      
      // 步骤 3: 添加本地流到连接
      this.addLocalStreamToConnection();
      
      console.log('✅ WebRTC 初始化完成');
    } catch (error) {
      console.error('❌ WebRTC 初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户媒体设备
   */
  async getUserMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('📹 成功获取本地媒体流');
      return this.localStream;
    } catch (error) {
      console.error('❌ 获取媒体流失败:', error);
      throw new Error(`媒体访问被拒绝: ${error.message}`);
    }
  }

  /**
   * 创建 RTCPeerConnection
   */
  createPeerConnection() {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:turnserver.com:3478',
          username: 'user',
          credential: 'password'
        }
      ],
      iceCandidatePoolSize: 10
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // 监听 ICE 候选
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // 监听远程流
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStreamReceived(this.remoteStream);
    };

    // 监听连接状态
    this.peerConnection.onconnectionstatechange = () => {
      console.log('🔗 连接状态:', this.peerConnection.connectionState);
    };
  }
}
```

## 3. 媒体流处理

### 3.1 MediaStream API 详解

```javascript
/**
 * 媒体流管理类
 * 处理音视频捕获、设备选择和流控制
 */
class MediaStreamManager {
  constructor() {
    this.currentStream = null;
    this.devices = {
      videoInputs: [],
      audioInputs: [],
      audioOutputs: []
    };
  }

  /**
   * 获取可用媒体设备
   */
  async getAvailableDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      this.devices.videoInputs = devices.filter(device => device.kind === 'videoinput');
      this.devices.audioInputs = devices.filter(device => device.kind === 'audioinput');
      this.devices.audioOutputs = devices.filter(device => device.kind === 'audiooutput');

      return this.devices;
    } catch (error) {
      console.error('❌ 获取设备列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取高清视频流
   */
  async getHDVideoStream() {
    const constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
        facingMode: 'user' // 'user' 前置摄像头，'environment' 后置摄像头
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    };

    return await this.getUserMedia(constraints);
  }

  /**
   * 获取屏幕共享流
   */
  async getScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: true
      });

      // 监听屏幕共享停止
      stream.getVideoTracks()[0].onended = () => {
        this.onScreenShareStopped();
      };

      return stream;
    } catch (error) {
      console.error('❌ 屏幕共享失败:', error);
      throw error;
    }
  }

  /**
   * 切换摄像头
   */
  async switchCamera() {
    if (!this.currentStream) return;

    const videoTrack = this.currentStream.getVideoTracks()[0];
    const currentFacingMode = videoTrack.getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: true
      });

      // 替换视频轨道
      const newVideoTrack = newStream.getVideoTracks()[0];
      await this.replaceTrack(videoTrack, newVideoTrack);

      return newVideoTrack;
    } catch (error) {
      console.error('❌ 切换摄像头失败:', error);
      throw error;
    }
  }

  /**
   * 音视频控制
   */
  toggleAudio(enabled) {
    if (this.currentStream) {
      this.currentStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.currentStream) {
      this.currentStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * 停止所有媒体流
   */
  stopAllTracks() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => {
        track.stop();
      });
      this.currentStream = null;
    }
  }
}
```

## 4. 信令服务器

### 4.1 WebSocket 信令实现

```javascript
/**
 * WebRTC 信令服务器客户端
 * 处理 Offer/Answer 交换和 ICE 候选传输
 */
class SignalingClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.websocket = null;
    this.roomId = null;
    this.userId = null;
    this.messageHandlers = new Map();
  }

  /**
   * 连接信令服务器
   */
  async connect(roomId, userId) {
    return new Promise((resolve, reject) => {
      this.roomId = roomId;
      this.userId = userId;
      
      this.websocket = new WebSocket(this.serverUrl);

      this.websocket.onopen = () => {
        console.log('🔌 信令服务器连接成功');
        
        // 加入房间
        this.sendMessage({
          type: 'join-room',
          roomId: this.roomId,
          userId: this.userId
        });
        
        resolve();
      };

      this.websocket.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.websocket.onerror = (error) => {
        console.error('❌ 信令服务器连接错误:', error);
        reject(error);
      };

      this.websocket.onclose = () => {
        console.log('📴 信令服务器连接关闭');
        this.reconnect();
      };
    });
  }

  /**
   * 发送信令消息
   */
  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        ...message,
        roomId: this.roomId,
        userId: this.userId,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * 处理接收到的消息
   */
  handleMessage(message) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.warn('⚠️ 未知消息类型:', message.type);
    }
  }

  /**
   * 注册消息处理器
   */
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * 自动重连
   */
  async reconnect() {
    if (this.roomId && this.userId) {
      console.log('🔄 尝试重连信令服务器...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.connect(this.roomId, this.userId);
    }
  }
}
```

## 5. 数据通道

### 5.1 RTCDataChannel 应用

```javascript
/**
 * 数据通道管理类
 * 实现文件传输、聊天消息等功能
 */
class DataChannelManager {
  constructor(peerConnection) {
    this.peerConnection = peerConnection;
    this.channels = new Map();
    this.fileTransfers = new Map();
  }

  /**
   * 创建数据通道
   */
  createDataChannel(label, options = {}) {
    const defaultOptions = {
      ordered: true,
      maxRetransmits: 3
    };

    const channel = this.peerConnection.createDataChannel(label, {
      ...defaultOptions,
      ...options
    });

    this.setupChannelEvents(channel, label);
    this.channels.set(label, channel);

    return channel;
  }

  /**
   * 设置通道事件监听
   */
  setupChannelEvents(channel, label) {
    channel.onopen = () => {
      console.log(`📡 数据通道 ${label} 已打开`);
    };

    channel.onmessage = (event) => {
      this.handleChannelMessage(label, event.data);
    };

    channel.onerror = (error) => {
      console.error(`❌ 数据通道 ${label} 错误:`, error);
    };

    channel.onclose = () => {
      console.log(`📴 数据通道 ${label} 已关闭`);
      this.channels.delete(label);
    };
  }

  /**
   * 发送聊天消息
   */
  sendChatMessage(message) {
    const chatChannel = this.channels.get('chat');
    if (chatChannel && chatChannel.readyState === 'open') {
      const messageData = {
        type: 'chat',
        content: message,
        timestamp: Date.now(),
        sender: 'local'
      };

      chatChannel.send(JSON.stringify(messageData));
    }
  }

  /**
   * 文件传输功能
   */
  async sendFile(file) {
    const fileChannel = this.channels.get('file-transfer');
    if (!fileChannel || fileChannel.readyState !== 'open') {
      throw new Error('文件传输通道未准备就绪');
    }

    const fileId = this.generateFileId();
    const chunkSize = 16384; // 16KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);

    // 发送文件元信息
    const fileInfo = {
      type: 'file-start',
      fileId: fileId,
      fileName: file.name,
      fileSize: file.size,
      totalChunks: totalChunks,
      mimeType: file.type
    };

    fileChannel.send(JSON.stringify(fileInfo));

    // 分块发送文件
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const chunkData = await chunk.arrayBuffer();
      const chunkMessage = {
        type: 'file-chunk',
        fileId: fileId,
        chunkIndex: i,
        data: Array.from(new Uint8Array(chunkData))
      };

      fileChannel.send(JSON.stringify(chunkMessage));

      // 发送进度更新
      this.onFileProgress && this.onFileProgress({
        fileId,
        sent: i + 1,
        total: totalChunks,
        percentage: Math.round(((i + 1) / totalChunks) * 100)
      });
    }

    // 发送完成信号
    fileChannel.send(JSON.stringify({
      type: 'file-end',
      fileId: fileId
    }));
  }

  /**
   * 处理接收到的数据
   */
  handleChannelMessage(channel, data) {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'chat':
          this.onChatMessage && this.onChatMessage(message);
          break;
        case 'file-start':
          this.handleFileStart(message);
          break;
        case 'file-chunk':
          this.handleFileChunk(message);
          break;
        case 'file-end':
          this.handleFileEnd(message);
          break;
        default:
          console.warn('⚠️ 未知数据类型:', message.type);
      }
    } catch (error) {
      console.error('❌ 数据解析错误:', error);
    }
  }

  /**
   * 生成文件 ID
   */
  generateFileId() {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## 6. 实际应用示例

### 6.1 视频通话应用

```javascript
/**
 * 完整的视频通话应用示例
 */
class VideoCallApp {
  constructor() {
    this.localVideo = document.getElementById('localVideo');
    this.remoteVideo = document.getElementById('remoteVideo');
    this.callButton = document.getElementById('callButton');
    this.hangupButton = document.getElementById('hangupButton');
    
    this.webrtcManager = new WebRTCManager();
    this.signalingClient = new SignalingClient('wss://your-signaling-server.com');
    
    this.initializeEventListeners();
  }

  /**
   * 初始化事件监听
   */
  initializeEventListeners() {
    this.callButton.addEventListener('click', () => this.startCall());
    this.hangupButton.addEventListener('click', () => this.hangup());

    // 信令消息处理
    this.signalingClient.onMessage('offer', (message) => this.handleOffer(message));
    this.signalingClient.onMessage('answer', (message) => this.handleAnswer(message));
    this.signalingClient.onMessage('ice-candidate', (message) => this.handleIceCandidate(message));
  }

  /**
   * 开始通话
   */
  async startCall() {
    try {
      // 连接信令服务器
      await this.signalingClient.connect('room-123', 'user-abc');

      // 初始化 WebRTC
      await this.webrtcManager.initializeConnection();

      // 显示本地视频
      this.localVideo.srcObject = this.webrtcManager.localStream;

      // 创建 Offer
      const offer = await this.webrtcManager.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await this.webrtcManager.peerConnection.setLocalDescription(offer);

      // 发送 Offer
      this.signalingClient.sendMessage({
        type: 'offer',
        offer: offer
      });

      this.callButton.disabled = true;
      this.hangupButton.disabled = false;

    } catch (error) {
      console.error('❌ 开始通话失败:', error);
      alert('通话失败: ' + error.message);
    }
  }

  /**
   * 处理收到的 Offer
   */
  async handleOffer(message) {
    try {
      await this.webrtcManager.initializeConnection();
      
      await this.webrtcManager.peerConnection.setRemoteDescription(message.offer);

      // 创建 Answer
      const answer = await this.webrtcManager.peerConnection.createAnswer();
      await this.webrtcManager.peerConnection.setLocalDescription(answer);

      // 发送 Answer
      this.signalingClient.sendMessage({
        type: 'answer',
        answer: answer
      });

      // 显示本地视频
      this.localVideo.srcObject = this.webrtcManager.localStream;

    } catch (error) {
      console.error('❌ 处理 Offer 失败:', error);
    }
  }

  /**
   * 处理收到的 Answer
   */
  async handleAnswer(message) {
    try {
      await this.webrtcManager.peerConnection.setRemoteDescription(message.answer);
    } catch (error) {
      console.error('❌ 处理 Answer 失败:', error);
    }
  }

  /**
   * 处理 ICE 候选
   */
  async handleIceCandidate(message) {
    try {
      await this.webrtcManager.peerConnection.addIceCandidate(message.candidate);
    } catch (error) {
      console.error('❌ 添加 ICE 候选失败:', error);
    }
  }

  /**
   * 挂断通话
   */
  hangup() {
    if (this.webrtcManager.peerConnection) {
      this.webrtcManager.peerConnection.close();
      this.webrtcManager.peerConnection = null;
    }

    if (this.webrtcManager.localStream) {
      this.webrtcManager.localStream.getTracks().forEach(track => track.stop());
    }

    this.localVideo.srcObject = null;
    this.remoteVideo.srcObject = null;

    this.callButton.disabled = false;
    this.hangupButton.disabled = true;

    // 通知对方挂断
    this.signalingClient.sendMessage({ type: 'hangup' });
  }
}

// 初始化应用
const videoApp = new VideoCallApp();
```

## 7. 常见问题与解决方案

### 7.1 连接问题

#### Q1: 为什么连接建立失败？

**可能原因及解决方案：**

- **防火墙和 NAT 问题**
  ```javascript
  // 配置多个 STUN/TURN 服务器
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'username',
      credential: 'password'
    }
  ];
  ```

- **网络环境限制**
  ```javascript
  // 检测网络连接质量
  async function checkNetworkQuality() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      console.log('网络类型:', connection.effectiveType);
      console.log('下行速度:', connection.downlink);
    }
  }
  ```

#### Q2: 如何处理移动端兼容性？

```javascript
// 移动端优化配置
const mobileConstraints = {
  video: {
    width: { max: 640 },
    height: { max: 480 },
    frameRate: { max: 15 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  }
};

// 检测设备类型
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const constraints = isMobile ? mobileConstraints : desktopConstraints;
```

### 7.2 性能优化

#### 7.2.1 带宽自适应

```javascript
/**
 * 动态调整视频质量
 */
class QualityController {
  constructor(peerConnection) {
    this.peerConnection = peerConnection;
    this.currentBitrate = 1000000; // 1Mbps
  }

  /**
   * 监控连接质量
   */
  async monitorConnectionQuality() {
    const stats = await this.peerConnection.getStats();
    
    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        const packetsLost = report.packetsLost;
        const packetsReceived = report.packetsReceived;
        const lossRate = packetsLost / (packetsLost + packetsReceived);

        if (lossRate > 0.05) { // 丢包率超过 5%
          this.decreaseQuality();
        } else if (lossRate < 0.01) { // 丢包率低于 1%
          this.increaseQuality();
        }
      }
    });
  }

  /**
   * 调整视频码率
   */
  async adjustBitrate(bitrate) {
    const sender = this.peerConnection.getSenders().find(s => 
      s.track && s.track.kind === 'video'
    );

    if (sender) {
      const params = sender.getParameters();
      if (params.encodings && params.encodings.length > 0) {
        params.encodings[0].maxBitrate = bitrate;
        await sender.setParameters(params);
      }
    }
  }
}
```

## 8. 浏览器兼容性

### 8.1 兼容性检测

```javascript
/**
 * WebRTC 兼容性检测
 */
class WebRTCCompatibility {
  static checkSupport() {
    const support = {
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      RTCPeerConnection: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection),
      dataChannels: true,
      getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
    };

    return support;
  }

  static getCompatibilityReport() {
    const support = this.checkSupport();
    const browser = this.detectBrowser();

    return {
      browser,
      support,
      recommendations: this.getRecommendations(support, browser)
    };
  }

  static detectBrowser() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Unknown';
  }

  static getRecommendations(support, browser) {
    const recommendations = [];

    if (!support.getUserMedia) {
      recommendations.push('请升级浏览器以支持媒体访问');
    }

    if (!support.RTCPeerConnection) {
      recommendations.push('当前浏览器不支持 WebRTC');
    }

    if (browser === 'Safari' && !support.getDisplayMedia) {
      recommendations.push('Safari 需要 13+ 版本才支持屏幕共享');
    }

    return recommendations;
  }
}

// 使用示例
const compatibility = WebRTCCompatibility.getCompatibilityReport();
console.log('兼容性报告:', compatibility);
```

## 9. 总结

WebRTC 作为现代 Web 实时通信的核心技术，为开发者提供了强大的音视频和数据传输能力。通过本指南的学习，你可以：

### 9.1 掌握的核心技能

- ✅ **理解 WebRTC 架构**：掌握三大核心 API 的使用
- ✅ **实现音视频通话**：构建完整的通话应用
- ✅ **处理数据传输**：实现文件传输和实时消息
- ✅ **优化性能表现**：解决网络和兼容性问题
- ✅ **应用最佳实践**：构建稳定可靠的 WebRTC 应用

### 9.2 进阶学习建议

1. **深入学习信令协议**：SIP、WebSocket、Socket.IO
2. **掌握媒体服务器**：Kurento、Jitsi、MediaSoup
3. **了解编解码技术**：VP8/VP9、H.264、Opus
4. **学习网络优化**：QoS、带宽自适应、错误恢复

### 9.3 参考资源

- 📚 [MDN WebRTC API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)
- 🌐 [WebRTC 官方网站](https://webrtc.org/)
- 🛠️ [WebRTC 样例代码](https://github.com/webrtc/samples)
- 📖 [WebRTC 规范文档](https://www.w3.org/TR/webrtc/)