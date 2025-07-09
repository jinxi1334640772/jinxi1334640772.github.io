# WebSocket 开发指南

> WebSocket API 是一种先进的技术，可在用户浏览器和服务器之间开启双向交互式通信会话。利用该 API，可以向服务器发送信息，并接收事件驱动的响应，而无需轮询服务器以获得回复。

## 📋 目录导航

- [1. 概述与基础概念](#1-概述与基础概念)
- [2. WebSocket 客户端开发](#2-websocket-客户端开发)
- [3. WebSocketStream API](#3-websocketstream-api)
- [4. WebSocket 服务器实现](#4-websocket-服务器实现)
- [5. WebTransport API](#5-webtransport-api)
- [6. 实际应用示例](#6-实际应用示例)
- [7. 最佳实践与优化](#7-最佳实践与优化)
- [8. 常见问题解答](#8-常见问题解答)

---

## 1. 概述与基础概念

### WebSocket 协议特点

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。相较于传统的 HTTP 请求-响应模式，WebSocket 具有以下优势：

- **实时性**：支持双向实时通信
- **低延迟**：避免 HTTP 轮询的延迟
- **低开销**：减少 HTTP 头部开销
- **持久连接**：保持长连接状态

### 连接状态常量

| 状态常量 | 数值 | 描述 |
|---------|------|------|
| `WebSocket.CONNECTING` | 0 | 连接尚未建立 |
| `WebSocket.OPEN` | 1 | 连接已建立，可以通信 |
| `WebSocket.CLOSING` | 2 | 连接正在关闭 |
| `WebSocket.CLOSED` | 3 | 连接已关闭或无法建立 |

---

## 2. WebSocket 客户端开发

### 基础 API 属性和方法

WebSocket 对象提供了用于创建和管理 WebSocket 连接，以及可以通过该连接发送和接收数据的 API。其属性和方法有：

### WebSocket 对象属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `binaryType` | String | 使用二进制的数据类型连接 |
| `bufferedAmount` | Number | 未发送至服务器的字节数 |
| `extensions` | String | 服务器选择的扩展 |
| `protocol` | String | 服务器选择的下属协议 |
| `readyState` | Number | 当前的链接状态 |
| `url` | String | WebSocket 的绝对路径 |

### WebSocket 事件处理器

| 事件处理器 | 描述 |
|-----------|------|
| `onopen` | 连接成功后的回调函数 |
| `onmessage` | 从服务器接收信息时的回调函数 |
| `onerror` | 连接失败后的回调函数 |
| `onclose` | 连接关闭后的回调函数 |

### WebSocket 方法

| 方法名 | 参数 | 描述 |
|--------|------|------|
| `send(data)` | data: String/ArrayBuffer/Blob | 对要传输的数据进行排队 |
| `close([code[,reason]])` | code?: Number, reason?: String | 关闭当前链接 |

### 基础使用示例

```javascript
/**
 * 创建 WebSocket 连接的基础示例
 */
class WebSocketClient {
  constructor(url, protocols = []) {
    this.url = url;
    this.protocols = protocols;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * 建立 WebSocket 连接
   * @param {string} url - WebSocket 服务器 URL
   * @param {string[]} protocols - 子协议数组
   */
  connect() {
    try {
      // 创建 WebSocket 对象，自动尝试建立连接
      this.socket = new WebSocket(this.url, this.protocols);
      
      // 绑定事件处理器
      this.bindEvents();
      
    } catch (error) {
      console.error('WebSocket 连接创建失败:', error);
    }
  }

  /**
   * 绑定 WebSocket 事件处理器
   */
  bindEvents() {
    // 连接成功事件
    this.socket.onopen = (event) => {
      console.log('WebSocket 连接已建立');
      this.reconnectAttempts = 0;
      
      // 发送连接确认消息
      this.sendMessage({
        type: 'connection',
        timestamp: Date.now(),
        clientId: this.generateClientId()
      });
    };

    // 接收消息事件
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        // 处理非 JSON 格式的消息
        console.log('收到文本消息:', event.data);
      }
    };

    // 连接错误事件
    this.socket.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    // 连接关闭事件
    this.socket.onclose = (event) => {
      console.log(`WebSocket 连接已关闭: ${event.code} - ${event.reason}`);
      
      // 尝试重连
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnect();
      }
    };
  }

  /**
   * 发送消息到服务器
   * @param {Object|string} message - 要发送的消息
   */
  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.send(data);
    } else {
      console.warn('WebSocket 连接未建立或已关闭');
    }
  }

  /**
   * 处理接收到的消息
   * @param {Object} data - 解析后的消息数据
   */
  handleMessage(data) {
    switch (data.type) {
      case 'chat':
        console.log(`收到聊天消息: ${data.text}`);
        break;
      case 'notification':
        console.log(`收到通知: ${data.content}`);
        break;
      default:
        console.log('收到未知类型消息:', data);
    }
  }

  /**
   * 重连机制
   */
  reconnect() {
    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000; // 指数退避
    
    console.log(`${delay/1000}秒后尝试第${this.reconnectAttempts}次重连...`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 手动关闭连接
   * @param {number} code - 关闭代码
   * @param {string} reason - 关闭原因
   */
  close(code = 1000, reason = 'Normal closure') {
    if (this.socket) {
      this.socket.close(code, reason);
    }
  }

  /**
   * 生成客户端 ID
   * @returns {string} 客户端唯一标识
   */
  generateClientId() {
    return 'client_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 获取连接状态
   * @returns {string} 连接状态描述
   */
  getConnectionState() {
    if (!this.socket) return 'NOT_CREATED';
    
    const states = {
      [WebSocket.CONNECTING]: 'CONNECTING',
      [WebSocket.OPEN]: 'OPEN',
      [WebSocket.CLOSING]: 'CLOSING',
      [WebSocket.CLOSED]: 'CLOSED'
    };
    
    return states[this.socket.readyState] || 'UNKNOWN';
  }
}

// 使用示例
const wsClient = new WebSocketClient('ws://localhost:8080/websocket', ['chat', 'json']);
wsClient.connect();

// 发送不同类型的消息
setTimeout(() => {
  wsClient.sendMessage({
    type: 'chat',
    text: 'Hello WebSocket!',
    timestamp: Date.now()
  });
}, 1000);
```

---

## 3. WebSocketStream API

### 概述

WebSocketStream API 是 WebSocket 的基于 Promise 的替代方案，用于创建和使用客户端 WebSocket 连接。使用 Streams API 来处理消息的接收和发送，这意味着套接字连接可以自动利用流背压，调节读取或写入的速度以避免应用程序中的瓶颈。

### 主要优势

- **背压控制**：自动处理数据流背压
- **Promise 基础**：更现代的异步处理方式
- **流式处理**：原生支持流式数据传输
- **更好的错误处理**：改进的错误处理机制

### 基础使用示例

```javascript
/**
 * WebSocketStream 客户端封装类
 */
class WebSocketStreamClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.wss = null;
    this.controller = new AbortController();
    this.isConnected = false;
  }

  /**
   * 检查浏览器是否支持 WebSocketStream
   * @returns {boolean} 是否支持
   */
  static isSupported() {
    return "WebSocketStream" in self;
  }

  /**
   * 建立 WebSocketStream 连接
   * @returns {Promise<void>}
   */
  async connect() {
    if (!WebSocketStreamClient.isSupported()) {
      throw new Error('WebSocketStream is not supported in this browser');
    }

    try {
      // 创建 WebSocketStream 对象
      this.wss = new WebSocketStream(this.url, {
        protocols: this.options.protocols || [],
        signal: this.controller.signal,
      });

      // 等待连接建立
      const { readable, writable, extensions, protocol } = await this.wss.opened;
      
      console.log('WebSocketStream 连接已建立');
      console.log('协议:', protocol);
      console.log('扩展:', extensions);
      
      this.isConnected = true;
      this.readable = readable;
      this.writable = writable;
      
      // 开始处理消息
      this.startMessageProcessing();
      
    } catch (error) {
      console.error('WebSocketStream 连接失败:', error);
      throw error;
    }
  }

  /**
   * 开始消息处理循环
   */
  async startMessageProcessing() {
    try {
      const reader = this.readable.getReader();
      
      while (this.isConnected) {
        const { value, done } = await reader.read();
        
        if (done) {
          console.log('读取流已结束');
          break;
        }
        
        // 处理接收到的消息
        this.handleMessage(value);
      }
      
    } catch (error) {
      console.error('消息处理错误:', error);
    }
  }

  /**
   * 处理接收到的消息
   * @param {any} message - 接收到的消息
   */
  handleMessage(message) {
    console.log('收到消息:', message);
    
    // 触发自定义事件
    this.dispatchEvent(new CustomEvent('message', { detail: message }));
  }

  /**
   * 发送消息到服务器
   * @param {any} message - 要发送的消息
   * @returns {Promise<void>}
   */
  async sendMessage(message) {
    if (!this.isConnected || !this.writable) {
      throw new Error('WebSocketStream 连接未建立');
    }

    try {
      const writer = this.writable.getWriter();
      await writer.write(message);
      writer.releaseLock();
      console.log('消息已发送:', message);
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  /**
   * 批量发送消息
   * @param {Array} messages - 消息数组
   * @returns {Promise<void>}
   */
  async sendBatch(messages) {
    if (!this.isConnected || !this.writable) {
      throw new Error('WebSocketStream 连接未建立');
    }

    try {
      const writer = this.writable.getWriter();
      
      for (const message of messages) {
        await writer.write(message);
      }
      
      writer.releaseLock();
      console.log(`批量发送完成，共 ${messages.length} 条消息`);
    } catch (error) {
      console.error('批量发送失败:', error);
      throw error;
    }
  }

  /**
   * 关闭连接
   * @param {Object} options - 关闭选项
   */
  async close(options = {}) {
    this.isConnected = false;
    
    if (this.wss) {
      this.wss.close({
        code: options.code || 1000,
        reason: options.reason || 'Normal closure',
      });
    }
    
    // 或者使用 AbortController 关闭
    if (options.abort) {
      this.controller.abort();
    }
    
    // 等待连接关闭
    try {
      const { code, reason } = await this.wss.closed;
      console.log(`WebSocketStream 连接已关闭: ${code} - ${reason}`);
    } catch (error) {
      console.error('关闭连接时出错:', error);
    }
  }

  /**
   * 事件分发（简化的事件系统）
   */
  dispatchEvent(event) {
    // 这里可以实现更复杂的事件系统
    console.log('事件触发:', event.type, event.detail);
  }
}

// 使用示例
async function demonstrateWebSocketStream() {
  try {
    // 检查浏览器支持
    if (!WebSocketStreamClient.isSupported()) {
      console.log('当前浏览器不支持 WebSocketStream');
      return;
    }

    // 创建客户端
    const client = new WebSocketStreamClient('wss://echo.websocket.org', {
      protocols: ['echo-protocol']
    });

    // 建立连接
    await client.connect();

    // 发送单条消息
    await client.sendMessage('Hello WebSocketStream!');

    // 批量发送消息
    await client.sendBatch([
      'Message 1',
      'Message 2',
      'Message 3'
    ]);

    // 定时关闭连接
    setTimeout(() => {
      client.close({
        code: 1000,
        reason: 'Demo completed'
      });
    }, 5000);

  } catch (error) {
    console.error('WebSocketStream 示例执行失败:', error);
  }
}

// 特性检测使用
if (WebSocketStreamClient.isSupported()) {
  console.log('✅ WebSocketStream 可用');
  // demonstrateWebSocketStream();
} else {
  console.log('❌ WebSocketStream 不可用，使用传统 WebSocket');
}
```

---

## 4. WebSocket 服务器实现

### 概述

在 Node.js 环境中，我们可以使用第三方包 `ws` 来实现 WebSocket 服务器。`ws` 是一个功能强大、易于使用且不依赖于其他环境的 WebSocket 框架。

### 安装依赖

```bash
npm install ws
# 或
yarn add ws
```

### 服务器配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `host` | String | - | 绑定服务器的主机名 |
| `port` | Number | - | 绑定服务器的端口号 |
| `backlog` | Number | - | 挂起连接队列的最大长度 |
| `server` | Server | - | 预先创建的 Node.js HTTP/HTTPS 服务器 |
| `verifyClient` | Function | - | 验证传入连接的函数 |
| `handleProtocols` | Function | - | 处理 WebSocket 子协议的函数 |
| `path` | String | - | 仅接受与此路径匹配的连接 |
| `noServer` | Boolean | false | 不启用服务器模式 |
| `clientTracking` | Boolean | true | 是否跟踪客户端 |
| `perMessageDeflate` | Boolean | true | 启用/禁用消息压缩 |
| `maxPayload` | Number | 104857600 | 允许的最大消息大小（字节） |

### 基础服务器实现

```javascript
const WebSocket = require('ws');
const http = require('http');
const url = require('url');

/**
 * 专业级 WebSocket 服务器实现
 */
class WebSocketServer {
  constructor(options = {}) {
    this.port = options.port || 8080;
    this.clients = new Map(); // 客户端管理
    this.rooms = new Map(); // 房间管理
    this.messageHistory = []; // 消息历史
    this.maxHistorySize = options.maxHistorySize || 1000;
    
    // 创建 HTTP 服务器
    this.httpServer = http.createServer();
    
    // 创建 WebSocket 服务器
    this.wss = new WebSocket.Server({
      server: this.httpServer,
      verifyClient: this.verifyClient.bind(this),
      handleProtocols: this.handleProtocols.bind(this),
      perMessageDeflate: {
        // 消息压缩配置
        threshold: 1024,
        concurrencyLimit: 10,
        memLevel: 8,
      },
      maxPayload: 16 * 1024 * 1024, // 16MB
    });

    this.setupEventHandlers();
  }

  /**
   * 验证客户端连接
   * @param {Object} info - 连接信息
   * @returns {boolean} 是否允许连接
   */
  verifyClient(info) {
    const { origin, secure, req } = info;
    
    // 检查来源
    const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
    if (origin && !allowedOrigins.includes(origin)) {
      console.log(`拒绝来自 ${origin} 的连接`);
      return false;
    }

    // 检查认证令牌
    const token = url.parse(req.url, true).query.token;
    if (!this.validateToken(token)) {
      console.log('认证失败');
      return false;
    }

    return true;
  }

  /**
   * 处理子协议选择
   * @param {Array} protocols - 客户端支持的协议
   * @returns {string} 选择的协议
   */
  handleProtocols(protocols) {
    const supportedProtocols = ['chat', 'json', 'binary'];
    
    for (const protocol of protocols) {
      if (supportedProtocols.includes(protocol)) {
        return protocol;
      }
    }
    
    return 'json'; // 默认协议
  }

  /**
   * 验证认证令牌
   * @param {string} token - 认证令牌
   * @returns {boolean} 验证结果
   */
  validateToken(token) {
    // 这里实现你的认证逻辑
    return token && token.length > 0;
  }

  /**
   * 设置事件处理器
   */
  setupEventHandlers() {
    // 服务器级别的事件
    this.wss.on('listening', () => {
      console.log(`🚀 WebSocket 服务器启动，端口: ${this.port}`);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket 服务器错误:', error);
    });

    // 客户端连接事件
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    // HTTP 服务器事件
    this.httpServer.on('error', (error) => {
      console.error('HTTP 服务器错误:', error);
    });
  }

  /**
   * 处理新的客户端连接
   * @param {WebSocket} ws - WebSocket 连接
   * @param {IncomingMessage} req - HTTP 请求对象
   */
  handleConnection(ws, req) {
    const clientId = this.generateClientId();
    const clientInfo = {
      id: clientId,
      ws: ws,
      ip: req.socket.remoteAddress,
      port: req.socket.remotePort,
      userAgent: req.headers['user-agent'],
      connectedAt: new Date(),
      lastActivity: new Date(),
      room: null,
      protocol: ws.protocol || 'json'
    };

    // 注册客户端
    this.clients.set(clientId, clientInfo);
    console.log(`✅ 客户端 ${clientId} 已连接 (${clientInfo.ip}:${clientInfo.port})`);

    // 发送欢迎消息
    this.sendToClient(clientId, {
      type: 'welcome',
      clientId: clientId,
      serverTime: new Date().toISOString(),
      onlineCount: this.clients.size
    });

    // 绑定客户端事件
    this.bindClientEvents(ws, clientId);
  }

  /**
   * 绑定客户端事件处理器
   * @param {WebSocket} ws - WebSocket 连接
   * @param {string} clientId - 客户端 ID
   */
  bindClientEvents(ws, clientId) {
    // 消息接收事件
    ws.on('message', (data) => {
      this.handleMessage(clientId, data);
    });

    // 连接关闭事件
    ws.on('close', (code, reason) => {
      this.handleDisconnection(clientId, code, reason);
    });

    // 错误事件
    ws.on('error', (error) => {
      console.error(`客户端 ${clientId} 错误:`, error);
    });

    // 心跳检测
    ws.on('pong', () => {
      const client = this.clients.get(clientId);
      if (client) {
        client.lastActivity = new Date();
      }
    });
  }

  /**
   * 处理接收到的消息
   * @param {string} clientId - 客户端 ID
   * @param {Buffer} data - 消息数据
   */
  handleMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 更新活动时间
    client.lastActivity = new Date();

    try {
      const message = JSON.parse(data.toString());
      console.log(`📨 收到消息 from ${clientId}:`, message);

      // 根据消息类型处理
      switch (message.type) {
        case 'chat':
          this.handleChatMessage(clientId, message);
          break;
        case 'join_room':
          this.handleJoinRoom(clientId, message.room);
          break;
        case 'leave_room':
          this.handleLeaveRoom(clientId);
          break;
        case 'private_message':
          this.handlePrivateMessage(clientId, message);
          break;
        case 'broadcast':
          this.handleBroadcast(clientId, message);
          break;
        default:
          console.log(`未知消息类型: ${message.type}`);
      }

      // 保存消息历史
      this.saveMessageHistory(clientId, message);

    } catch (error) {
      console.error('消息解析错误:', error);
      this.sendError(clientId, 'INVALID_MESSAGE_FORMAT');
    }
  }

  /**
   * 处理聊天消息
   * @param {string} clientId - 发送者 ID
   * @param {Object} message - 消息对象
   */
  handleChatMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const chatMessage = {
      type: 'chat',
      from: clientId,
      text: message.text,
      timestamp: new Date().toISOString(),
      room: client.room
    };

    if (client.room) {
      // 发送到房间内所有客户端
      this.broadcastToRoom(client.room, chatMessage);
    } else {
      // 全局广播
      this.broadcast(chatMessage, [clientId]);
    }
  }

  /**
   * 处理加入房间
   * @param {string} clientId - 客户端 ID
   * @param {string} roomName - 房间名称
   */
  handleJoinRoom(clientId, roomName) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 离开当前房间
    if (client.room) {
      this.handleLeaveRoom(clientId);
    }

    // 加入新房间
    client.room = roomName;
    
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    
    this.rooms.get(roomName).add(clientId);

    // 通知房间内其他成员
    this.broadcastToRoom(roomName, {
      type: 'user_joined',
      userId: clientId,
      room: roomName,
      timestamp: new Date().toISOString()
    }, [clientId]);

    // 确认加入房间
    this.sendToClient(clientId, {
      type: 'room_joined',
      room: roomName,
      members: Array.from(this.rooms.get(roomName))
    });

    console.log(`客户端 ${clientId} 加入房间 ${roomName}`);
  }

  /**
   * 处理离开房间
   * @param {string} clientId - 客户端 ID
   */
  handleLeaveRoom(clientId) {
    const client = this.clients.get(clientId);
    if (!client || !client.room) return;

    const roomName = client.room;
    const room = this.rooms.get(roomName);
    
    if (room) {
      room.delete(clientId);
      
      // 如果房间为空，删除房间
      if (room.size === 0) {
        this.rooms.delete(roomName);
      } else {
        // 通知房间内其他成员
        this.broadcastToRoom(roomName, {
          type: 'user_left',
          userId: clientId,
          room: roomName,
          timestamp: new Date().toISOString()
        });
      }
    }

    client.room = null;
    console.log(`客户端 ${clientId} 离开房间 ${roomName}`);
  }

  /**
   * 发送消息给特定客户端
   * @param {string} clientId - 客户端 ID
   * @param {Object} message - 消息对象
   */
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      const data = JSON.stringify(message);
      client.ws.send(data);
      return true;
    } catch (error) {
      console.error(`发送消息给客户端 ${clientId} 失败:`, error);
      return false;
    }
  }

  /**
   * 广播消息到房间
   * @param {string} roomName - 房间名称
   * @param {Object} message - 消息对象
   * @param {Array} excludeClients - 排除的客户端列表
   */
  broadcastToRoom(roomName, message, excludeClients = []) {
    const room = this.rooms.get(roomName);
    if (!room) return;

    let sentCount = 0;
    for (const clientId of room) {
      if (!excludeClients.includes(clientId)) {
        if (this.sendToClient(clientId, message)) {
          sentCount++;
        }
      }
    }

    console.log(`📢 房间 ${roomName} 广播消息，发送给 ${sentCount} 个客户端`);
  }

  /**
   * 全局广播消息
   * @param {Object} message - 消息对象
   * @param {Array} excludeClients - 排除的客户端列表
   */
  broadcast(message, excludeClients = []) {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (!excludeClients.includes(clientId) && 
          client.ws.readyState === WebSocket.OPEN) {
        if (this.sendToClient(clientId, message)) {
          sentCount++;
        }
      }
    }

    console.log(`📢 全局广播消息，发送给 ${sentCount} 个客户端`);
  }

  /**
   * 处理客户端断开连接
   * @param {string} clientId - 客户端 ID
   * @param {number} code - 关闭代码
   * @param {string} reason - 关闭原因
   */
  handleDisconnection(clientId, code, reason) {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log(`❌ 客户端 ${clientId} 断开连接: ${code} - ${reason}`);

    // 离开房间
    if (client.room) {
      this.handleLeaveRoom(clientId);
    }

    // 移除客户端
    this.clients.delete(clientId);

    // 通知其他客户端
    this.broadcast({
      type: 'user_disconnected',
      userId: clientId,
      timestamp: new Date().toISOString(),
      onlineCount: this.clients.size
    }, [clientId]);
  }

  /**
   * 生成客户端 ID
   * @returns {string} 唯一客户端 ID
   */
  generateClientId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 保存消息历史
   * @param {string} clientId - 客户端 ID
   * @param {Object} message - 消息对象
   */
  saveMessageHistory(clientId, message) {
    this.messageHistory.push({
      clientId,
      message,
      timestamp: new Date()
    });

    // 限制历史记录大小
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }
  }

  /**
   * 发送错误消息
   * @param {string} clientId - 客户端 ID
   * @param {string} errorCode - 错误代码
   */
  sendError(clientId, errorCode) {
    this.sendToClient(clientId, {
      type: 'error',
      code: errorCode,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 启动心跳检测
   */
  startHeartbeat() {
    setInterval(() => {
      const now = new Date();
      
      for (const [clientId, client] of this.clients) {
        const timeSinceLastActivity = now - client.lastActivity;
        
        if (timeSinceLastActivity > 60000) { // 60秒无活动
          console.log(`客户端 ${clientId} 超时，发送心跳`);
          
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.ping();
          } else {
            // 清理无效连接
            this.clients.delete(clientId);
          }
        }
      }
    }, 30000); // 每30秒检查一次
  }

  /**
   * 启动服务器
   */
  start() {
    this.httpServer.listen(this.port, () => {
      console.log(`🌟 WebSocket 服务器运行在端口 ${this.port}`);
      this.startHeartbeat();
    });
  }

  /**
   * 停止服务器
   */
  stop() {
    this.wss.close(() => {
      this.httpServer.close(() => {
        console.log('WebSocket 服务器已停止');
      });
    });
  }

  /**
   * 获取服务器统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      connectedClients: this.clients.size,
      activeRooms: this.rooms.size,
      messageHistory: this.messageHistory.length,
      uptime: process.uptime()
    };
  }
}

// 使用示例
const wsServer = new WebSocketServer({
  port: 8080,
  maxHistorySize: 5000
});

// 启动服务器
wsServer.start();

// 优雅关闭
process.on('SIGINT', () => {
  console.log('收到关闭信号，正在停止服务器...');
  wsServer.stop();
  process.exit(0);
});

module.exports = WebSocketServer;
```

---

## 5. WebTransport API

### 概述

WebTransport API 是 WebSocket 的升级版，使用 HTTP/3 协议进行数据传输，支持流式传输数据。相比传统的 WebSocket，WebTransport 提供了更好的性能和更灵活的数据传输方式。

### 主要特性

- **HTTP/3 协议**：基于 QUIC 协议，提供更好的网络性能
- **多流支持**：支持多个并发数据流
- **可靠与不可靠传输**：根据需求选择传输方式
- **背压控制**：自动处理数据流控制

### 传输模式对比

| 传输模式 | 可靠性 | 顺序保证 | 性能 | 适用场景 |
|---------|--------|----------|------|----------|
| Datagrams | 不可靠 | 无保证 | 高 | 游戏状态更新、实时指标 |
| Streams | 可靠 | 有保证 | 中 | 聊天应用、文件传输 |

### 基础使用示例

```javascript
/**
 * WebTransport 客户端封装类
 */
class WebTransportClient {
  constructor(url) {
    this.url = url;
    this.transport = null;
    this.isConnected = false;
  }

  /**
   * 建立 WebTransport 连接
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      // 构建 WebTransport 对象
      this.transport = new WebTransport(this.url);

      // 等待连接准备就绪
      await this.transport.ready;
      this.isConnected = true;
      
      console.log('✅ WebTransport 连接已建立');
      
      // 开始处理传入数据
      this.startDatagramReader();
      this.startUnidirectionalStreams();
      this.startBidirectionalStreams();
      
    } catch (error) {
      console.error('❌ WebTransport 连接失败:', error);
      throw error;
    }
  }

  /**
   * 不可靠数据报传输
   */
  async sendDatagram(data) {
    if (!this.isConnected) {
      throw new Error('WebTransport 连接未建立');
    }

    try {
      const writer = this.transport.datagrams.writable.getWriter();
      
      // 转换数据为 Uint8Array
      const uint8Data = typeof data === 'string' 
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);
        
      await writer.write(uint8Data);
      writer.releaseLock();
      
      console.log('📤 数据报发送成功:', data);
    } catch (error) {
      console.error('数据报发送失败:', error);
      throw error;
    }
  }

  /**
   * 监听数据报接收
   */
  async startDatagramReader() {
    try {
      const reader = this.transport.datagrams.readable.getReader();
      
      while (this.isConnected) {
        const { value, done } = await reader.read();
        
        if (done) {
          console.log('数据报读取流已结束');
          break;
        }
        
        // 处理接收到的数据报
        const text = new TextDecoder().decode(value);
        console.log('📥 收到数据报:', text);
        
        // 触发自定义事件
        this.onDatagramReceived?.(value);
      }
    } catch (error) {
      console.error('数据报读取错误:', error);
    }
  }

  /**
   * 创建单向流并写入数据
   * @param {any} data - 要发送的数据
   * @returns {Promise<void>}
   */
  async createUnidirectionalStream(data) {
    if (!this.isConnected) {
      throw new Error('WebTransport 连接未建立');
    }

    try {
      // 创建单向流
      const stream = await this.transport.createUnidirectionalStream();
      const writer = stream.writable.getWriter();
      
      // 转换并写入数据
      const uint8Data = typeof data === 'string' 
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);
        
      await writer.write(uint8Data);
      await writer.close();
      
      console.log('📤 单向流数据发送成功:', data);
    } catch (error) {
      console.error('单向流发送失败:', error);
      throw error;
    }
  }

  /**
   * 监听传入的单向流
   */
  async startUnidirectionalStreams() {
    try {
      const readableStream = this.transport.incomingUnidirectionalStreams;
      const reader = readableStream.getReader();
      
      while (this.isConnected) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('单向流读取器已结束');
          break;
        }
        
        // 处理每个传入的流
        this.handleIncomingStream(value);
      }
    } catch (error) {
      console.error('单向流处理错误:', error);
    }
  }

  /**
   * 处理传入的流数据
   * @param {WebTransportReceiveStream} receiveStream - 接收流
   */
  async handleIncomingStream(receiveStream) {
    try {
      const reader = receiveStream.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
      }
      
      // 合并所有数据块
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      const text = new TextDecoder().decode(result);
      console.log('📥 收到流数据:', text);
      
      // 触发自定义事件
      this.onStreamReceived?.(result);
      
    } catch (error) {
      console.error('流数据处理错误:', error);
    }
  }

  /**
   * 创建双向流
   * @returns {Promise<WebTransportBidirectionalStream>}
   */
  async createBidirectionalStream() {
    if (!this.isConnected) {
      throw new Error('WebTransport 连接未建立');
    }

    try {
      const stream = await this.transport.createBidirectionalStream();
      console.log('🔄 双向流已创建');
      return stream;
    } catch (error) {
      console.error('双向流创建失败:', error);
      throw error;
    }
  }

  /**
   * 监听传入的双向流
   */
  async startBidirectionalStreams() {
    try {
      const bds = this.transport.incomingBidirectionalStreams;
      const reader = bds.getReader();
      
      while (this.isConnected) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('双向流读取器已结束');
          break;
        }
        
        // 处理双向流
        this.handleBidirectionalStream(value);
      }
    } catch (error) {
      console.error('双向流处理错误:', error);
    }
  }

  /**
   * 处理双向流
   * @param {WebTransportBidirectionalStream} stream - 双向流
   */
  async handleBidirectionalStream(stream) {
    try {
      // 同时处理读写
      const readPromise = this.handleIncomingStream(stream.readable);
      
      // 示例：向流写入响应数据
      const writer = stream.writable.getWriter();
      const response = new TextEncoder().encode('Bidirectional response');
      await writer.write(response);
      await writer.close();
      
      await readPromise;
      
    } catch (error) {
      console.error('双向流处理错误:', error);
    }
  }

  /**
   * 关闭连接
   */
  async close() {
    this.isConnected = false;
    
    if (this.transport) {
      this.transport.close();
      
      try {
        const { code, reason } = await this.transport.closed;
        console.log(`WebTransport 连接已关闭: ${code} - ${reason}`);
      } catch (error) {
        console.error('关闭连接时出错:', error);
      }
    }
  }

  /**
   * 事件回调 - 数据报接收
   * @param {Uint8Array} data - 接收到的数据
   */
  onDatagramReceived(data) {
    // 用户可以重写此方法
  }

  /**
   * 事件回调 - 流数据接收
   * @param {Uint8Array} data - 接收到的数据
   */
  onStreamReceived(data) {
    // 用户可以重写此方法
  }
}

// 使用示例
async function demonstrateWebTransport() {
  try {
    const client = new WebTransportClient('https://example.com:4999/wt');
    
    // 设置事件处理器
    client.onDatagramReceived = (data) => {
      const text = new TextDecoder().decode(data);
      console.log('自定义处理器 - 数据报:', text);
    };
    
    client.onStreamReceived = (data) => {
      const text = new TextDecoder().decode(data);
      console.log('自定义处理器 - 流数据:', text);
    };
    
    // 建立连接
    await client.connect();
    
    // 发送数据报
    await client.sendDatagram('Hello via datagram!');
    
    // 创建单向流
    await client.createUnidirectionalStream('Hello via unidirectional stream!');
    
    // 创建双向流
    const bidirectionalStream = await client.createBidirectionalStream();
    
    // 通过双向流发送数据
    const writer = bidirectionalStream.writable.getWriter();
    await writer.write(new TextEncoder().encode('Hello via bidirectional stream!'));
    await writer.close();
    
    // 5秒后关闭连接
    setTimeout(() => {
      client.close();
    }, 5000);
    
  } catch (error) {
    console.error('WebTransport 示例失败:', error);
  }
}

// 特性检测
if ('WebTransport' in window) {
  console.log('✅ WebTransport 可用');
  // demonstrateWebTransport();
} else {
  console.log('❌ WebTransport 不可用');
}
```

---

## 6. 实际应用示例

### 6.1 实时聊天应用

```javascript
/**
 * 基于 WebSocket 的实时聊天客户端
 */
class ChatClient {
  constructor(wsUrl, username) {
    this.wsUrl = wsUrl;
    this.username = username;
    this.ws = null;
    this.messageHandlers = new Map();
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('聊天客户端已连接');
        
        // 发送用户加入消息
        this.sendMessage({
          type: 'user_join',
          username: this.username,
          timestamp: Date.now()
        });
        
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('聊天连接已断开');
        // 可以实现重连逻辑
      };
    });
  }

  sendMessage(message) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  sendChatMessage(text) {
    this.sendMessage({
      type: 'chat',
      username: this.username,
      text: text,
      timestamp: Date.now()
    });
  }

  handleMessage(message) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.log('未处理的消息类型:', message.type);
    }
  }

  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// 使用示例
const chatClient = new ChatClient('ws://localhost:8080', 'User123');

// 设置消息处理器
chatClient.onMessage('chat', (message) => {
  console.log(`${message.username}: ${message.text}`);
  // 更新 UI
});

chatClient.onMessage('user_join', (message) => {
  console.log(`${message.username} 加入聊天室`);
});

chatClient.onMessage('user_leave', (message) => {
  console.log(`${message.username} 离开聊天室`);
});

// 连接并发送消息
chatClient.connect().then(() => {
  chatClient.sendChatMessage('Hello everyone!');
});
```

### 6.2 实时数据监控

```javascript
/**
 * 实时数据监控客户端
 */
class MonitoringClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.metrics = new Map();
    this.subscribers = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updateMetric(data.metric, data.value, data.timestamp);
    };
    
    return new Promise((resolve) => {
      this.ws.onopen = () => {
        console.log('监控客户端已连接');
        resolve();
      };
    });
  }

  updateMetric(metricName, value, timestamp) {
    // 更新指标数据
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    
    const metricData = this.metrics.get(metricName);
    metricData.push({ value, timestamp });
    
    // 保持最近 100 个数据点
    if (metricData.length > 100) {
      metricData.shift();
    }
    
    // 通知订阅者
    const subscribers = this.subscribers.get(metricName) || [];
    subscribers.forEach(callback => {
      callback(value, timestamp, metricData);
    });
  }

  subscribe(metricName, callback) {
    if (!this.subscribers.has(metricName)) {
      this.subscribers.set(metricName, []);
    }
    this.subscribers.get(metricName).push(callback);
    
    // 订阅指标
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      metric: metricName
    }));
  }

  unsubscribe(metricName) {
    this.subscribers.delete(metricName);
    this.ws.send(JSON.stringify({
      type: 'unsubscribe',
      metric: metricName
    }));
  }
}

// 使用示例
const monitor = new MonitoringClient('ws://localhost:8080/monitoring');

monitor.connect().then(() => {
  // 订阅 CPU 使用率
  monitor.subscribe('cpu_usage', (value, timestamp, history) => {
    console.log(`CPU 使用率: ${value}% (${new Date(timestamp)})`);
    // 更新图表
    updateChart('cpu-chart', history);
  });
  
  // 订阅内存使用率
  monitor.subscribe('memory_usage', (value, timestamp, history) => {
    console.log(`内存使用率: ${value}% (${new Date(timestamp)})`);
    updateChart('memory-chart', history);
  });
});

function updateChart(chartId, data) {
  // 图表更新逻辑
  console.log(`更新图表 ${chartId}:`, data.slice(-10)); // 显示最近10个点
}
```

---

## 7. 最佳实践与优化

### 7.1 连接管理

```javascript
/**
 * 健壮的 WebSocket 连接管理器
 */
class RobustWebSocketManager {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 1000,
      maxReconnectAttempts: 5,
      reconnectDecay: 1.5,
      maxReconnectInterval: 30000,
      timeoutInterval: 2000,
      ...options
    };
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.isIntentionallyClosed = false;
    this.listeners = new Map();
    this.messageQueue = [];
    this.isConnected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.isIntentionallyClosed = false;
      
      try {
        this.ws = new WebSocket(this.url);
        
        // 连接超时处理
        const timeout = setTimeout(() => {
          this.ws.close();
          reject(new Error('连接超时'));
        }, this.options.timeoutInterval);
        
        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          console.log('✅ WebSocket 连接成功');
          
          // 发送队列中的消息
          this.flushMessageQueue();
          
          this.fireEvent('open');
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          this.fireEvent('message', event);
        };
        
        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ WebSocket 错误:', error);
          this.fireEvent('error', error);
          
          if (!this.isConnected) {
            reject(error);
          }
        };
        
        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          this.isConnected = false;
          
          console.log(`🔌 WebSocket 连接关闭: ${event.code} - ${event.reason}`);
          this.fireEvent('close', event);
          
          if (!this.isIntentionallyClosed) {
            this.scheduleReconnect();
          }
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('❌ 达到最大重连次数，停止重连');
      this.fireEvent('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    
    const timeout = Math.min(
      this.options.reconnectInterval * Math.pow(this.options.reconnectDecay, this.reconnectAttempts - 1),
      this.options.maxReconnectInterval
    );
    
    console.log(`🔄 ${timeout/1000}秒后进行第${this.reconnectAttempts}次重连尝试...`);
    
    setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.connect().catch(() => {
          // 重连失败，继续下一次尝试
        });
      }
    }, timeout);
  }

  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      // 连接未就绪，加入队列
      this.messageQueue.push(message);
      console.log('📝 消息已加入发送队列');
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
    console.log('✅ 发送队列已清空');
  }

  close() {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
    }
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  fireEvent(type, data = null) {
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('事件监听器执行错误:', error);
      }
    });
  }

  getConnectionState() {
    if (!this.ws) return 'CLOSED';
    
    const states = {
      [WebSocket.CONNECTING]: 'CONNECTING',
      [WebSocket.OPEN]: 'OPEN',
      [WebSocket.CLOSING]: 'CLOSING',
      [WebSocket.CLOSED]: 'CLOSED'
    };
    
    return states[this.ws.readyState] || 'UNKNOWN';
  }
}
```

### 7.2 性能优化建议

#### 消息批处理

```javascript
/**
 * 消息批处理管理器
 */
class MessageBatcher {
  constructor(ws, options = {}) {
    this.ws = ws;
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 100;
    this.messageQueue = [];
    this.flushTimer = null;
  }

  addMessage(message) {
    this.messageQueue.push(message);
    
    if (this.messageQueue.length >= this.batchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.messageQueue.length === 0) return;
    
    const batch = {
      type: 'batch',
      messages: this.messageQueue.splice(0),
      timestamp: Date.now()
    };
    
    this.ws.send(JSON.stringify(batch));
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    
    console.log(`📦 批量发送 ${batch.messages.length} 条消息`);
  }
}
```

#### 二进制数据处理

```javascript
/**
 * 二进制数据处理工具
 */
class BinaryDataHandler {
  static encodeMessage(type, data) {
    const typeBuffer = new TextEncoder().encode(type);
    const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
    
    const result = new ArrayBuffer(4 + typeBuffer.length + dataBuffer.length);
    const view = new DataView(result);
    
    // 写入类型长度
    view.setUint32(0, typeBuffer.length);
    
    // 写入类型
    new Uint8Array(result, 4, typeBuffer.length).set(typeBuffer);
    
    // 写入数据
    new Uint8Array(result, 4 + typeBuffer.length).set(dataBuffer);
    
    return result;
  }

  static decodeMessage(buffer) {
    const view = new DataView(buffer);
    const typeLength = view.getUint32(0);
    
    const typeBuffer = new Uint8Array(buffer, 4, typeLength);
    const dataBuffer = new Uint8Array(buffer, 4 + typeLength);
    
    const type = new TextDecoder().decode(typeBuffer);
    const data = JSON.parse(new TextDecoder().decode(dataBuffer));
    
    return { type, data };
  }
}

// 使用示例
const ws = new WebSocket('ws://localhost:8080');
ws.binaryType = 'arraybuffer';

ws.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    const { type, data } = BinaryDataHandler.decodeMessage(event.data);
    console.log('二进制消息:', type, data);
  }
};

// 发送二进制消息
const binaryMessage = BinaryDataHandler.encodeMessage('chat', {
  text: 'Hello Binary!',
  timestamp: Date.now()
});
ws.send(binaryMessage);
```

---

## 8. 常见问题解答

### 8.1 连接问题

**Q: WebSocket 连接频繁断开怎么办？**

A: 实现心跳机制和重连策略：

```javascript
class HeartbeatWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.heartbeatInterval = 30000; // 30秒心跳
    this.heartbeatTimer = null;
    this.isAlive = false;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      this.isAlive = true;
      this.startHeartbeat();
    };
    
    this.ws.onmessage = (event) => {
      if (event.data === 'pong') {
        this.isAlive = true;
        return;
      }
      // 处理其他消息
    };
    
    this.ws.onclose = () => {
      this.stopHeartbeat();
      // 重连逻辑
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (!this.isAlive) {
        console.log('心跳检测失败，重新连接');
        this.ws.close();
        return;
      }
      
      this.isAlive = false;
      this.ws.send('ping');
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
```

### 8.2 安全问题

**Q: 如何保证 WebSocket 连接的安全性？**

A: 实施多层安全措施：

```javascript
// 1. 使用 WSS（WebSocket Secure）
const secureWs = new WebSocket('wss://secure.example.com/ws');

// 2. 认证令牌验证
class SecureWebSocket {
  constructor(url, token) {
    this.url = url;
    this.token = token;
  }

  connect() {
    // 在 URL 中包含认证令牌
    const authenticatedUrl = `${this.url}?token=${encodeURIComponent(this.token)}`;
    this.ws = new WebSocket(authenticatedUrl);
    
    this.ws.onopen = () => {
      // 发送额外的认证信息
      this.ws.send(JSON.stringify({
        type: 'auth',
        token: this.token,
        timestamp: Date.now()
      }));
    };
  }

  // 3. 消息加密
  sendEncrypted(data) {
    const encrypted = this.encrypt(JSON.stringify(data));
    this.ws.send(encrypted);
  }

  encrypt(data) {
    // 实现加密逻辑（如 AES）
    return btoa(data); // 简化示例，实际应使用真正的加密
  }

  decrypt(data) {
    // 实现解密逻辑
    return atob(data); // 简化示例
  }
}
```

### 8.3 性能优化

**Q: 如何处理大量并发连接？**

A: 服务端优化策略：

```javascript
// Node.js 服务器优化
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // 主进程：创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    cluster.fork(); // 重启工作进程
  });
} else {
  // 工作进程：运行 WebSocket 服务器
  const WebSocket = require('ws');
  
  const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
      threshold: 1024,
      concurrencyLimit: 10,
    },
    maxPayload: 1024 * 1024, // 1MB
  });
  
  console.log(`工作进程 ${process.pid} 启动`);
}
```

### 8.4 兼容性处理

**Q: 如何处理浏览器兼容性问题？**

A: 渐进式增强和回退方案：

```javascript
class UniversalSocket {
  constructor(url) {
    this.url = url;
    this.transport = null;
  }

  async connect() {
    // 检查支持的传输方式
    if ('WebTransport' in window) {
      console.log('使用 WebTransport');
      this.transport = new WebTransportClient(this.url);
    } else if ('WebSocket' in window) {
      console.log('使用 WebSocket');
      this.transport = new WebSocketClient(this.url);
    } else if ('EventSource' in window) {
      console.log('使用 Server-Sent Events');
      this.transport = new SSEClient(this.url);
    } else {
      console.log('使用长轮询');
      this.transport = new LongPollingClient(this.url);
    }
    
    return this.transport.connect();
  }

  send(data) {
    if (this.transport) {
      this.transport.send(data);
    }
  }

  close() {
    if (this.transport) {
      this.transport.close();
    }
  }
}

// 特性检测函数
function detectWebSocketFeatures() {
  const features = {
    webSocket: 'WebSocket' in window,
    webSocketStream: 'WebSocketStream' in window,
    webTransport: 'WebTransport' in window,
    binaryType: false,
    extensions: false
  };

  if (features.webSocket) {
    const testWs = new WebSocket('ws://test');
    features.binaryType = 'binaryType' in testWs;
    features.extensions = 'extensions' in testWs;
    testWs.close();
  }

  return features;
}

console.log('WebSocket 特性支持:', detectWebSocketFeatures());
```

---

## 📚 参考资料

- [WebSocket API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WebSocketStream API - Web.dev](https://web.dev/websocketstream/)
- [WebTransport API - Chrome Developers](https://developer.chrome.com/docs/capabilities/web-apis/webtransport/)
- [WebSocket RFC 6455](https://tools.ietf.org/html/rfc6455)
- [ws - Node.js WebSocket Library](https://github.com/websockets/ws)

---

*最后更新时间：{{ new Date().toLocaleDateString('zh-CN') }}*
