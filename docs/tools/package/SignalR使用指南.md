---
title: 📡 SignalR 实时通信库完全指南
description: 深入学习 Microsoft SignalR 实时通信库，掌握双向通信、连接管理、消息传递等核心技术，构建高性能实时应用
outline: deep
---

# 📡 SignalR 实时通信库完全指南

> SignalR 是微软开发的一个实时Web通信库，用于在客户端和服务器之间建立双向通信连接，支持 WebSocket、Server-Sent Events 和 Long Polling 等多种传输方式。

::: tip 📚 本章内容
全面学习 SignalR 的核心概念、连接管理、消息传递和在现代前端框架中的最佳实践。
:::

## 🎯 SignalR 概述

### ✨ 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **实时通信** | 双向即时消息传递 | 🚀 极低延迟通信 |
| **自动回退** | 多种传输方式支持 | 🔄 最佳兼容性 |
| **自动重连** | 连接断开自动恢复 | 🛡️ 高可用性 |
| **组和用户** | 灵活的消息分发 | 🎯 精准推送 |
| **跨平台** | 支持多种客户端 | 🌐 广泛兼容 |

### 🌍 传输方式对比

| 传输方式 | 特点 | 适用场景 | 浏览器支持 |
|----------|------|----------|------------|
| **WebSocket** | 全双工通信 | 🎯 实时性要求高 | 现代浏览器 |
| **Server-Sent Events** | 服务器推送 | 📡 单向推送 | HTML5 浏览器 |
| **Long Polling** | 长轮询 | 🔄 兼容性最好 | 所有浏览器 |

## 📦 安装和配置

### 🚀 包管理器安装

```bash
# npm 安装
npm install @microsoft/signalr

# yarn 安装
yarn add @microsoft/signalr

# pnpm 安装
pnpm add @microsoft/signalr

# 安装类型定义（TypeScript 项目）
npm install --save-dev @types/microsoft__signalr
```

### 📊 版本兼容性

| SignalR 版本 | .NET 版本 | Node.js 版本 | 浏览器要求 |
|--------------|-----------|--------------|------------|
| **8.x** | .NET 8+ | 18+ | ES2018+ |
| **7.x** | .NET 7+ | 16+ | ES2017+ |
| **6.x** | .NET 6+ | 14+ | ES2015+ |
| **5.x** | .NET 5+ | 12+ | ES5+ |

## 🔗 基本连接管理

### 🛠️ 创建连接

```typescript
import * as signalR from "@microsoft/signalr";

// 🔧 基础连接配置
const connection = new signalR.HubConnectionBuilder()
  .withUrl("/chathub") // 服务器Hub端点
  .build();

// 🎯 高级连接配置
const advancedConnection = new signalR.HubConnectionBuilder()
  .withUrl("/chathub", {
    // 传输方式配置
    transport: signalR.HttpTransportType.WebSockets,
    skipNegotiation: true,
    
    // 认证配置
    accessTokenFactory: () => {
      return localStorage.getItem("jwt-token") || "";
    },
    
    // 请求头配置
    headers: {
      "Custom-Header": "value"
    }
  })
  .withAutomaticReconnect([0, 2000, 10000, 30000]) // 自定义重连间隔
  .configureLogging(signalR.LogLevel.Information)   // 日志级别
  .build();
```

### ⚡ 连接状态管理

```typescript
// 🚀 启动连接
async function startConnection() {
  try {
    await connection.start();
    console.log("✅ SignalR Connected.");
    updateConnectionStatus("connected");
  } catch (err) {
    console.error("❌ SignalR Connection failed:", err);
    updateConnectionStatus("disconnected");
    // 5秒后重试
    setTimeout(startConnection, 5000);
  }
}

// 📊 连接状态监听
connection.onclose(error => {
  console.log("🔌 Connection closed:", error);
  updateConnectionStatus("disconnected");
});

connection.onreconnecting(error => {
  console.log("🔄 Reconnecting:", error);
  updateConnectionStatus("reconnecting");
});

connection.onreconnected(connectionId => {
  console.log("✅ Reconnected:", connectionId);
  updateConnectionStatus("connected");
});

// 🎯 连接状态更新函数
function updateConnectionStatus(status: string) {
  const statusElement = document.getElementById("connection-status");
  if (statusElement) {
    statusElement.textContent = status;
    statusElement.className = `status-${status}`;
  }
}
```

### 📋 连接配置选项详解

| 选项 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| **transport** | HttpTransportType | 传输方式 | All |
| **skipNegotiation** | boolean | 跳过协商 | false |
| **accessTokenFactory** | function | 访问令牌工厂 | undefined |
| **headers** | object | 自定义请求头 | {} |
| **withCredentials** | boolean | 包含凭据 | true |

## 📨 消息传递机制

### 📥 接收服务器消息

```typescript
// 🎯 基础消息监听
connection.on("ReceiveMessage", function (user: string, message: string) {
  console.log(`📩 ${user}: ${message}`);
  displayMessage(user, message);
});

// 📊 复杂数据监听
connection.on("UpdateData", function (data: any) {
  console.log("📈 收到数据更新:", data);
  updateUI(data);
});

// 🔔 通知消息监听
connection.on("Notification", function (notification: {
  type: string;
  title: string;
  message: string;
  timestamp: Date;
}) {
  showNotification(notification);
});

// 🎭 多参数消息监听
connection.on("ComplexMessage", function (
  id: number,
  user: string,
  data: object,
  timestamp: Date
) {
  handleComplexMessage({ id, user, data, timestamp });
});
```

### 📤 发送消息到服务器

```typescript
// 🚀 基础消息发送
async function sendMessage(user: string, message: string) {
  try {
    await connection.invoke("SendMessage", user, message);
    console.log("✅ 消息发送成功");
  } catch (err) {
    console.error("❌ 消息发送失败:", err);
  }
}

// 🎯 带返回值的方法调用
async function getServerData(parameters: any): Promise<any> {
  try {
    const result = await connection.invoke("GetData", parameters);
    console.log("📊 服务器返回:", result);
    return result;
  } catch (err) {
    console.error("❌ 方法调用失败:", err);
    throw err;
  }
}

// 🔥 流式数据发送
async function sendStream(data: any[]) {
  try {
    await connection.send("SendStream", data);
    console.log("🌊 流数据发送成功");
  } catch (err) {
    console.error("❌ 流数据发送失败:", err);
  }
}

// ⏰ 超时控制的方法调用
async function invokeWithTimeout(methodName: string, timeout: number, ...args: any[]) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("调用超时")), timeout)
  );
  
  try {
    return await Promise.race([
      connection.invoke(methodName, ...args),
      timeoutPromise
    ]);
  } catch (error) {
    console.error(`❌ ${methodName} 调用失败:`, error);
    throw error;
  }
}
```

## 🎨 Vue 3 集成方案

### 🏗️ SignalR 服务封装

```typescript
// src/services/signalr.ts
import * as signalR from "@microsoft/signalr";
import { ref, reactive, computed } from "vue";

// 📊 连接状态枚举
enum ConnectionState {
  Disconnected = "Disconnected",
  Connecting = "Connecting", 
  Connected = "Connected",
  Reconnecting = "Reconnecting"
}

// 🎯 消息接口定义
interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

// 🔧 SignalR 服务类
class SignalRService {
  private connection: signalR.HubConnection | null = null;
  
  // 📊 响应式状态
  public connectionState = ref<ConnectionState>(ConnectionState.Disconnected);
  public messages = reactive<Message[]>([]);
  public onlineUsers = reactive<string[]>([]);
  public error = ref<string | null>(null);
  
  // 🎯 计算属性
  public isConnected = computed(() => 
    this.connectionState.value === ConnectionState.Connected
  );
  
  public isConnecting = computed(() => 
    this.connectionState.value === ConnectionState.Connecting ||
    this.connectionState.value === ConnectionState.Reconnecting
  );

  // 🚀 连接方法
  async connect(hubUrl: string, options?: {
    accessToken?: string;
    transport?: signalR.HttpTransportType;
    autoReconnect?: boolean;
  }) {
    try {
      this.connectionState.value = ConnectionState.Connecting;
      this.error.value = null;

      const builder = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          transport: options?.transport || signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
          accessTokenFactory: () => options?.accessToken || ""
        })
        .configureLogging(signalR.LogLevel.Information);

      // 🔄 自动重连配置
      if (options?.autoReconnect !== false) {
        builder.withAutomaticReconnect([0, 2000, 10000, 30000]);
      }

      this.connection = builder.build();

      // 🎭 设置事件监听器
      this.setupEventListeners();

      await this.connection.start();
      this.connectionState.value = ConnectionState.Connected;
      console.log("✅ SignalR连接成功");
      
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : "连接失败";
      this.connectionState.value = ConnectionState.Disconnected;
      console.error("❌ SignalR连接失败:", error);
      throw error;
    }
  }

  // 🎭 事件监听器设置
  private setupEventListeners() {
    if (!this.connection) return;

    // 🔌 连接状态事件
    this.connection.onclose(error => {
      this.connectionState.value = ConnectionState.Disconnected;
      this.error.value = error?.message || "连接已关闭";
      console.log("🔌 SignalR连接关闭:", error);
    });

    this.connection.onreconnecting(error => {
      this.connectionState.value = ConnectionState.Reconnecting;
      console.log("🔄 SignalR重连中:", error);
    });

    this.connection.onreconnected(connectionId => {
      this.connectionState.value = ConnectionState.Connected;
      this.error.value = null;
      console.log("✅ SignalR重连成功:", connectionId);
    });

    // 📨 业务消息监听
    this.connection.on("ReceiveMessage", (message: Message) => {
      this.messages.push({
        ...message,
        timestamp: new Date(message.timestamp)
      });
    });

    this.connection.on("UserJoined", (username: string) => {
      if (!this.onlineUsers.includes(username)) {
        this.onlineUsers.push(username);
      }
    });

    this.connection.on("UserLeft", (username: string) => {
      const index = this.onlineUsers.indexOf(username);
      if (index > -1) {
        this.onlineUsers.splice(index, 1);
      }
    });

    this.connection.on("OnlineUsers", (users: string[]) => {
      this.onlineUsers.splice(0, this.onlineUsers.length, ...users);
    });
  }

  // 📤 发送消息方法
  async sendMessage(methodName: string, ...args: any[]): Promise<void> {
    if (!this.isConnected.value) {
      throw new Error("SignalR未连接");
    }

    try {
      await this.connection!.invoke(methodName, ...args);
    } catch (error) {
      console.error("❌ 发送消息失败:", error);
      throw error;
    }
  }

  // 🎯 调用服务器方法
  async invoke<T>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.isConnected.value) {
      throw new Error("SignalR未连接");
    }

    try {
      return await this.connection!.invoke<T>(methodName, ...args);
    } catch (error) {
      console.error("❌ 调用方法失败:", error);
      throw error;
    }
  }

  // 🎭 事件监听管理
  on(eventName: string, callback: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(eventName, callback);
    }
  }

  off(eventName: string, callback?: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.off(eventName, callback);
    }
  }

  // 🔌 断开连接
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connectionState.value = ConnectionState.Disconnected;
      this.connection = null;
    }
  }

  // 🧹 清理方法
  cleanup(): void {
    this.messages.splice(0);
    this.onlineUsers.splice(0);
    this.error.value = null;
  }
}

// 🌟 导出单例实例
export const signalRService = new SignalRService();
export { ConnectionState, type Message };
```

### 🎨 Vue 组件使用示例

```vue
<template>
  <div class="chat-container">
    <!-- 🔌 连接状态显示 -->
    <div class="connection-status" :class="connectionStatusClass">
      <span class="status-indicator"></span>
      {{ connectionStatusText }}
    </div>

    <!-- 👥 在线用户列表 -->
    <div class="online-users">
      <h3>📱 在线用户 ({{ signalRService.onlineUsers.length }})</h3>
      <ul>
        <li v-for="user in signalRService.onlineUsers" :key="user">
          {{ user }}
        </li>
      </ul>
    </div>

    <!-- 💬 消息列表 -->
    <div class="messages" ref="messagesContainer">
      <div 
        v-for="message in signalRService.messages" 
        :key="message.id"
        class="message"
        :class="{ 'own-message': message.user === currentUser }"
      >
        <div class="message-header">
          <span class="username">{{ message.user }}</span>
          <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>

    <!-- ✏️ 消息输入 -->
    <div class="message-input">
      <input 
        v-model="newMessage"
        @keyup.enter="sendMessage"
        :disabled="!signalRService.isConnected.value"
        placeholder="输入消息..."
      >
      <button 
        @click="sendMessage"
        :disabled="!signalRService.isConnected.value || !newMessage.trim()"
      >
        📤 发送
      </button>
    </div>

    <!-- ⚠️ 错误信息 -->
    <div v-if="signalRService.error.value" class="error-message">
      ❌ {{ signalRService.error.value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { signalRService, ConnectionState } from '@/services/signalr';

// 📊 组件状态
const newMessage = ref('');
const currentUser = ref('User' + Math.floor(Math.random() * 1000));
const messagesContainer = ref<HTMLElement>();

// 🎯 计算属性
const connectionStatusClass = computed(() => ({
  'status-connected': signalRService.isConnected.value,
  'status-connecting': signalRService.isConnecting.value,
  'status-disconnected': signalRService.connectionState.value === ConnectionState.Disconnected
}));

const connectionStatusText = computed(() => {
  switch (signalRService.connectionState.value) {
    case ConnectionState.Connected:
      return '🟢 已连接';
    case ConnectionState.Connecting:
      return '🟡 连接中...';
    case ConnectionState.Reconnecting:
      return '🟡 重连中...';
    case ConnectionState.Disconnected:
      return '🔴 未连接';
    default:
      return '❓ 未知状态';
  }
});

// 🚀 生命周期钩子
onMounted(async () => {
  try {
    await signalRService.connect('/chathub', {
      accessToken: localStorage.getItem('jwt-token') || '',
      autoReconnect: true
    });
    
    // 📡 加入聊天室
    await signalRService.sendMessage('JoinChat', currentUser.value);
  } catch (error) {
    console.error('❌ 连接失败:', error);
  }
});

onUnmounted(async () => {
  try {
    await signalRService.sendMessage('LeaveChat', currentUser.value);
    await signalRService.disconnect();
  } catch (error) {
    console.error('❌ 断开连接失败:', error);
  }
});

// 📤 发送消息
async function sendMessage() {
  if (!newMessage.value.trim() || !signalRService.isConnected.value) {
    return;
  }

  try {
    await signalRService.sendMessage('SendMessage', currentUser.value, newMessage.value);
    newMessage.value = '';
  } catch (error) {
    console.error('❌ 发送消息失败:', error);
  }
}

// ⏰ 时间格式化
function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 📜 自动滚动到底部
watch(() => signalRService.messages.length, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.connection-status {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-connected {
  background-color: #d4edda;
  color: #155724;
}

.status-connected .status-indicator {
  background-color: #28a745;
}

.status-connecting {
  background-color: #fff3cd;
  color: #856404;
}

.status-connecting .status-indicator {
  background-color: #ffc107;
  animation: pulse 1.5s infinite;
}

.status-disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-disconnected .status-indicator {
  background-color: #dc3545;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.messages {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.own-message {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #666;
}

.username {
  font-weight: bold;
}

.message-input {
  display: flex;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.message-input button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.online-users {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.online-users h3 {
  margin: 0 0 10px 0;
  color: #495057;
}

.online-users ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.online-users li {
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}
</style>
```

## 🔧 高级特性

### 👥 群组管理

```typescript
// 🎯 加入群组
async function joinGroup(groupName: string) {
  try {
    await signalRService.invoke("JoinGroup", groupName);
    console.log(`✅ 已加入群组: ${groupName}`);
  } catch (error) {
    console.error("❌ 加入群组失败:", error);
  }
}

// 🚪 离开群组
async function leaveGroup(groupName: string) {
  try {
    await signalRService.invoke("LeaveGroup", groupName);
    console.log(`👋 已离开群组: ${groupName}`);
  } catch (error) {
    console.error("❌ 离开群组失败:", error);
  }
}

// 📢 向群组发送消息
async function sendToGroup(groupName: string, message: string) {
  try {
    await signalRService.invoke("SendToGroup", groupName, message);
  } catch (error) {
    console.error("❌ 群组消息发送失败:", error);
  }
}
```

### 🌊 流式数据处理

```typescript
// 📊 接收流数据
signalRService.on("StreamData", function(stream: any) {
  stream.subscribe({
    next: (item: any) => {
      console.log("📈 收到流数据项:", item);
      processStreamItem(item);
    },
    error: (err: any) => {
      console.error("❌ 流数据错误:", err);
    },
    complete: () => {
      console.log("✅ 流数据传输完成");
    }
  });
});

// 📤 发送流数据
async function sendStreamData(data: any[]) {
  const stream = new signalR.Subject();
  
  try {
    await signalRService.invoke("UploadStream", stream);
    
    // 逐项发送数据
    for (const item of data) {
      stream.next(item);
      await new Promise(resolve => setTimeout(resolve, 100)); // 模拟延迟
    }
    
    stream.complete();
  } catch (error) {
    stream.error(error);
  }
}
```

## 🛡️ 错误处理和最佳实践

### ⚠️ 错误处理策略

```typescript
// 🎯 全局错误处理
class SignalRErrorHandler {
  static handle(error: Error, context: string) {
    console.error(`❌ SignalR错误 [${context}]:`, error);
    
    // 根据错误类型进行不同处理
    if (error.message.includes('连接已关闭')) {
      // 尝试重新连接
      this.handleConnectionLost();
    } else if (error.message.includes('超时')) {
      // 处理超时错误
      this.handleTimeout();
    } else {
      // 通用错误处理
      this.handleGenericError(error);
    }
  }
  
  private static handleConnectionLost() {
    // 显示连接丢失提示
    showNotification('连接已断开，正在尝试重连...', 'warning');
  }
  
  private static handleTimeout() {
    // 处理超时
    showNotification('请求超时，请重试', 'error');
  }
  
  private static handleGenericError(error: Error) {
    // 通用错误提示
    showNotification(`操作失败: ${error.message}`, 'error');
  }
}

// 🔧 增强的方法调用
async function safeInvoke<T>(
  methodName: string, 
  args: any[], 
  options: {
    timeout?: number;
    retries?: number;
    onError?: (error: Error) => void;
  } = {}
): Promise<T | null> {
  const { timeout = 30000, retries = 3, onError } = options;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('调用超时')), timeout)
      );
      
      const result = await Promise.race([
        signalRService.invoke<T>(methodName, ...args),
        timeoutPromise
      ]);
      
      return result;
    } catch (error) {
      const err = error as Error;
      console.warn(`⚠️ 第${attempt}次调用失败:`, err.message);
      
      if (attempt === retries) {
        SignalRErrorHandler.handle(err, methodName);
        onError?.(err);
        return null;
      }
      
      // 指数退避重试
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
  
  return null;
}
```

### 🎯 性能优化建议

| 优化点 | 建议 | 实现方式 |
|--------|------|----------|
| **连接复用** | 避免频繁创建连接 | 🔄 使用单例模式 |
| **消息缓存** | 缓存历史消息 | 💾 本地存储 |
| **批量处理** | 批量发送消息 | 📦 消息队列 |
| **内存管理** | 及时清理资源 | 🧹 生命周期管理 |

### ✅ 最佳实践清单

::: tip 🎯 开发建议
- ✅ 使用 TypeScript 获得更好的类型安全
- ✅ 实现自动重连机制
- ✅ 添加连接状态指示器
- ✅ 处理网络异常情况
- ✅ 使用适当的日志级别
- ✅ 实现消息去重机制
- ✅ 考虑消息顺序问题
- ✅ 优化大量数据的传输
:::

::: warning ⚠️ 注意事项
- ❌ 避免在循环中创建连接
- ❌ 不要忽视错误处理
- ❌ 避免发送过大的消息
- ❌ 不要在页面卸载时忘记断开连接
:::

## 📚 参考资源

### 🔗 官方文档

| 资源 | 链接 | 描述 |
|------|------|------|
| **官方文档** | [SignalR文档](https://docs.microsoft.com/aspnet/core/signalr/) | 📖 完整的官方指南 |
| **JavaScript客户端** | [JS客户端API](https://docs.microsoft.com/javascript/api/@microsoft/signalr/) | 🔧 JavaScript API参考 |
| **GitHub仓库** | [SignalR GitHub](https://github.com/dotnet/aspnetcore/tree/main/src/SignalR) | 💻 源代码和示例 |

### 🎯 学习资源

- 📺 [SignalR视频教程](https://channel9.msdn.com/Series/SignalR)
- 📝 [实战案例集合](https://github.com/SignalR/SignalR-samples)
- 🏢 [企业级应用案例](https://docs.microsoft.com/aspnet/core/signalr/scale)

---

通过本指南，你已经掌握了 SignalR 的核心概念和实战技巧。SignalR 为现代 Web 应用提供了强大的实时通信能力，结合 Vue 3 等现代前端框架，可以构建出色的用户体验。记住要关注错误处理、性能优化和最佳实践，以确保应用的稳定性和可维护性。
