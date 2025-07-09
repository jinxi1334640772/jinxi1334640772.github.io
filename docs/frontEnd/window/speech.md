# Web Speech API 开发指南

Web Speech API 为 Web 应用程序提供了强大的语音处理能力，包括语音合成（文本转语音）和语音识别（语音转文本）功能。本文档详细介绍了这两个核心组件的使用方法和最佳实践。

## 目录导航

1. [概述与基础概念](#1-概述与基础概念)
2. [浏览器兼容性](#2-浏览器兼容性)
3. [SpeechSynthesis 语音合成](#3-speechsynthesis-语音合成)
4. [SpeechSynthesisUtterance 语音配置](#4-speechsynthesisutterance-语音配置)
5. [SpeechRecognition 语音识别](#5-speechrecognition-语音识别)
6. [实际应用示例](#6-实际应用示例)
7. [最佳实践与优化](#7-最佳实践与优化)

## 1. 概述与基础概念

### 1.1 什么是 Web Speech API

Web Speech API 是一套现代化的 Web 标准，允许开发者在网页中集成语音功能。该 API 包含两个主要组件：

### 1.2 核心组件

#### 语音识别（Speech Recognition）
- **接口**：`SpeechRecognition`
- **功能**：将音频输入转换为文本（语音转文本，STT）
- **应用场景**：语音命令、语音输入、语音搜索等
- **相关接口**：`SpeechGrammar`、`SpeechRecognitionEvent`

#### 语音合成（Speech Synthesis）
- **接口**：`SpeechSynthesis`
- **功能**：将文本转换为语音输出（文本转语音，TTS）
- **应用场景**：朗读文本、语音提示、无障碍访问等
- **相关接口**：`SpeechSynthesisVoice`、`SpeechSynthesisUtterance`

## 2. 浏览器兼容性

### 2.1 语音合成支持

| 浏览器 | 桌面版本 | 移动版本 | 备注 |
|--------|----------|----------|------|
| Chrome | ✅ 33+ | ✅ 33+ | 完全支持 |
| Firefox | ✅ 49+ | ❌ | 桌面版支持 |
| Safari | ✅ 14.1+ | ✅ 14.5+ | 部分支持 |
| Edge | ✅ 14+ | ✅ 79+ | 完全支持 |

### 2.2 语音识别支持

| 浏览器 | 桌面版本 | 移动版本 | 备注 |
|--------|----------|----------|------|
| Chrome | ✅ 25+ | ✅ 25+ | 需要前缀 webkit |
| Firefox | ❌ | ❌ | 暂不支持 |
| Safari | ❌ | ❌ | 暂不支持 |
| Edge | ✅ 79+ | ✅ 79+ | 需要前缀 webkit |

> **注意**：语音识别功能的兼容性相对较差，建议在使用前进行特性检测。

## 3. SpeechSynthesis 语音合成

### 3.1 基本概念

`SpeechSynthesis` 是语音合成的主控制器接口，通过 `window.speechSynthesis` 访问。它管理语音队列、控制播放状态，并提供可用语音列表。

### 3.2 属性说明

| 属性 | 类型 | 描述 |
|------|------|------|
| `paused` | Boolean | 当前是否处于暂停状态 |
| `pending` | Boolean | 队列中是否有待播放的语音 |
| `speaking` | Boolean | 当前是否正在播放语音 |

### 3.3 方法说明

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `getVoices()` | 无 | SpeechSynthesisVoice[] | 获取可用的语音列表 |
| `speak(utterance)` | SpeechSynthesisUtterance | void | 添加语音到播放队列 |
| `pause()` | 无 | void | 暂停语音播放 |
| `resume()` | 无 | void | 恢复语音播放 |
| `cancel()` | 无 | void | 取消所有队列中的语音 |

### 3.4 事件监听

```javascript
/**
 * 语音列表变化事件监听
 */
speechSynthesis.onvoiceschanged = function(event) {
  console.log("可用语音列表已更新");
  updateVoiceList();
};
```

### 3.5 基础使用示例

```javascript
/**
 * 基础语音合成示例
 */
function basicTextToSpeech() {
  // 检查浏览器支持
  if (!('speechSynthesis' in window)) {
    console.error('浏览器不支持语音合成功能');
    return;
  }

  const synth = window.speechSynthesis;
  
  // 创建语音合成配置
  const utterance = new SpeechSynthesisUtterance("你好，这是一段测试语音。");
  
  // 基本配置
  utterance.lang = "zh-CN";
  utterance.pitch = 1.0;
  utterance.rate = 1.0;
  utterance.volume = 1.0;
  
  // 播放语音
  synth.speak(utterance);
}
```

## 4. SpeechSynthesisUtterance 语音配置

### 4.1 基本概念

`SpeechSynthesisUtterance` 表示一个语音请求，包含了要朗读的文本内容以及如何朗读的配置参数。

### 4.2 属性配置

| 属性 | 类型 | 取值范围 | 默认值 | 描述 |
|------|------|----------|--------|------|
| `text` | String | 任意文本 | "" | 要合成的文本内容 |
| `lang` | String | BCP 47 语言标签 | 浏览器默认 | 语音语言 |
| `voice` | SpeechSynthesisVoice | 可用语音 | null | 使用的语音 |
| `pitch` | Number | 0.1 - 2.0 | 1.0 | 音调高低 |
| `rate` | Number | 0.1 - 10.0 | 1.0 | 播放速度 |
| `volume` | Number | 0.0 - 1.0 | 1.0 | 音量大小 |

### 4.3 事件类型

| 事件 | 触发时机 | 描述 |
|------|----------|------|
| `start` | 开始播放 | 语音播放开始时触发 |
| `end` | 播放结束 | 语音播放完成时触发 |
| `error` | 发生错误 | 播放过程中出现错误时触发 |
| `pause` | 暂停播放 | 语音暂停时触发 |
| `resume` | 恢复播放 | 语音恢复时触发 |
| `mark` | 标记到达 | 到达 SSML 标记时触发 |
| `boundary` | 边界到达 | 到达单词或句子边界时触发 |

### 4.4 完整配置示例

```javascript
/**
 * 创建完整配置的语音合成
 */
function createAdvancedSpeech() {
  const synth = window.speechSynthesis;
  
  // 获取可用语音列表
  const voices = synth.getVoices();
  console.log("可用语音:", voices);
  
  // 创建语音配置对象
  const utterance = new SpeechSynthesisUtterance();
  
  // 设置文本内容
  utterance.text = "欢迎使用语音合成功能，这是一个完整的配置示例。";
  
  // 设置语言和语音
  utterance.lang = "zh-CN";
  
  // 寻找中文语音
  const chineseVoice = voices.find(voice => 
    voice.lang.includes('zh') || voice.name.includes('Chinese')
  );
  
  if (chineseVoice) {
    utterance.voice = chineseVoice;
    console.log("使用语音:", chineseVoice.name);
  }
  
  // 设置语音参数
  utterance.pitch = 1.2;    // 稍高音调
  utterance.rate = 0.9;     // 稍慢语速
  utterance.volume = 0.8;   // 稍低音量
  
  // 添加事件监听器
  utterance.addEventListener('start', () => {
    console.log("语音播放开始");
  });
  
  utterance.addEventListener('end', () => {
    console.log("语音播放结束");
  });
  
  utterance.addEventListener('error', (event) => {
    console.error("语音播放错误:", event.error);
  });
  
  utterance.addEventListener('boundary', (event) => {
    console.log("到达边界:", event.name, "位置:", event.charIndex);
  });
  
  // 开始播放
  synth.speak(utterance);
  
  return utterance;
}
```

## 5. SpeechRecognition 语音识别

### 5.1 基本概念

`SpeechRecognition` 接口提供语音识别功能，将音频输入转换为文本。由于兼容性限制，目前主要在基于 Chromium 的浏览器中可用。

> **兼容性提醒**：语音识别功能兼容性相对较差，建议谨慎使用并提供降级方案。

### 5.2 属性配置

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `lang` | String | HTML lang 或浏览器语言 | 识别语言 |
| `continuous` | Boolean | false | 是否连续识别 |
| `interimResults` | Boolean | false | 是否返回中间结果 |
| `maxAlternatives` | Number | 1 | 最大候选结果数量 |
| `grammars` | SpeechGrammarList | null | 语法规则集合 |

### 5.3 方法说明

| 方法 | 描述 |
|------|------|
| `start()` | 开始语音识别 |
| `stop()` | 停止识别并处理结果 |
| `abort()` | 立即停止识别 |

### 5.4 主要事件

| 事件 | 描述 |
|------|------|
| `start` | 识别服务开始监听 |
| `result` | 获得识别结果 |
| `error` | 识别过程出错 |
| `end` | 识别服务断开 |
| `audiostart/audioend` | 音频捕获开始/结束 |
| `soundstart/soundend` | 声音检测开始/结束 |
| `speechstart/speechend` | 语音检测开始/结束 |

### 5.5 语音识别示例

```javascript
/**
 * 语音识别实现
 */
function setupSpeechRecognition() {
  // 检查浏览器支持（考虑前缀）
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error('浏览器不支持语音识别功能');
    return null;
  }
  
  // 创建识别实例
  const recognition = new SpeechRecognition();
  
  // 基本配置
  recognition.continuous = false;      // 单次识别
  recognition.interimResults = true;   // 显示中间结果
  recognition.lang = 'zh-CN';         // 中文识别
  recognition.maxAlternatives = 3;     // 最多3个候选结果
  
  // 设置语法（可选）
  if (window.SpeechGrammarList) {
    const grammar = '#JSGF V1.0; grammar commands; public <command> = 开始 | 停止 | 暂停 | 继续 | 帮助;';
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }
  
  // 事件监听
  recognition.addEventListener('start', () => {
    console.log('语音识别已启动，请开始说话...');
  });
  
  recognition.addEventListener('result', (event) => {
    console.log('识别结果事件:', event);
    
    // 处理识别结果
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      
      if (result.isFinal) {
        // 最终结果
        console.log('最终识别结果:', result[0].transcript);
        console.log('置信度:', result[0].confidence);
        
        // 显示所有候选结果
        for (let j = 0; j < result.length; j++) {
          console.log(`候选 ${j + 1}:`, result[j].transcript, `(${result[j].confidence})`);
        }
      } else {
        // 中间结果
        console.log('中间结果:', result[0].transcript);
      }
    }
  });
  
  recognition.addEventListener('error', (event) => {
    console.error('语音识别错误:', event.error);
    console.error('错误消息:', event.message);
  });
  
  recognition.addEventListener('end', () => {
    console.log('语音识别已结束');
  });
  
  return recognition;
}

/**
 * 使用语音识别
 */
function startVoiceRecognition() {
  const recognition = setupSpeechRecognition();
  
  if (recognition) {
    try {
      recognition.start();
    } catch (error) {
      console.error('启动语音识别失败:', error);
    }
  }
}
```

## 6. 实际应用示例

### 6.1 智能语音助手

```javascript
/**
 * 简单的语音助手实现
 */
class VoiceAssistant {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = this.setupRecognition();
    this.isListening = false;
    this.commands = {
      '时间': () => this.speakTime(),
      '日期': () => this.speakDate(),
      '天气': () => this.speakWeather(),
      '帮助': () => this.speakHelp()
    };
  }
  
  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'zh-CN';
    
    recognition.addEventListener('result', (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        this.processCommand(lastResult[0].transcript);
      }
    });
    
    recognition.addEventListener('error', (event) => {
      console.error('识别错误:', event.error);
      this.speak('抱歉，语音识别出现错误。');
    });
    
    return recognition;
  }
  
  speak(text, options = {}) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    
    this.synth.speak(utterance);
    return utterance;
  }
  
  processCommand(command) {
    console.log('收到命令:', command);
    
    // 查找匹配的命令
    const matchedCommand = Object.keys(this.commands).find(key => 
      command.includes(key)
    );
    
    if (matchedCommand) {
      this.commands[matchedCommand]();
    } else {
      this.speak(`抱歉，我不理解"${command}"这个命令。`);
    }
  }
  
  speakTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    this.speak(`现在时间是 ${timeString}`);
  }
  
  speakDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('zh-CN');
    this.speak(`今天是 ${dateString}`);
  }
  
  speakWeather() {
    // 这里可以集成天气API
    this.speak('抱歉，天气功能还未实现。');
  }
  
  speakHelp() {
    const helpText = '我可以帮您查询时间、日期，或者回答其他问题。请说出您的需求。';
    this.speak(helpText);
  }
  
  startListening() {
    if (!this.recognition) {
      this.speak('抱歉，您的浏览器不支持语音识别功能。');
      return;
    }
    
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
      this.speak('语音助手已启动，请说话。');
    }
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.speak('语音助手已停止。');
    }
  }
}

// 使用示例
const assistant = new VoiceAssistant();
```

### 6.2 阅读器应用

```javascript
/**
 * 网页文本阅读器
 */
class TextReader {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPaused = false;
    this.defaultOptions = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'zh-CN'
    };
  }
  
  /**
   * 朗读指定文本
   */
  readText(text, options = {}) {
    // 停止当前播放
    this.stop();
    
    // 合并配置选项
    const config = { ...this.defaultOptions, ...options };
    
    // 创建语音对象
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // 应用配置
    Object.keys(config).forEach(key => {
      this.currentUtterance[key] = config[key];
    });
    
    // 设置事件监听
    this.currentUtterance.addEventListener('start', () => {
      console.log('开始朗读');
      this.onStart && this.onStart();
    });
    
    this.currentUtterance.addEventListener('end', () => {
      console.log('朗读结束');
      this.currentUtterance = null;
      this.isPaused = false;
      this.onEnd && this.onEnd();
    });
    
    this.currentUtterance.addEventListener('error', (event) => {
      console.error('朗读错误:', event.error);
      this.onError && this.onError(event.error);
    });
    
    // 开始朗读
    this.synth.speak(this.currentUtterance);
  }
  
  /**
   * 朗读页面选中的文本
   */
  readSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      this.readText(selectedText);
    } else {
      console.log('没有选中任何文本');
    }
  }
  
  /**
   * 朗读指定元素的文本内容
   */
  readElement(element) {
    if (element && element.textContent) {
      this.readText(element.textContent.trim());
    }
  }
  
  /**
   * 暂停朗读
   */
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }
  
  /**
   * 继续朗读
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }
  
  /**
   * 停止朗读
   */
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.isPaused = false;
    }
  }
  
  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      speaking: this.synth.speaking,
      paused: this.synth.paused,
      pending: this.synth.pending
    };
  }
  
  /**
   * 设置朗读参数
   */
  setOptions(options) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// 使用示例
const reader = new TextReader();

// 设置事件回调
reader.onStart = () => console.log('朗读开始');
reader.onEnd = () => console.log('朗读完成');
reader.onError = (error) => console.error('朗读出错:', error);

// 朗读文本
reader.readText('这是一段测试文本。');

// 朗读选中文本（可绑定到按钮）
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault();
    reader.readSelection();
  }
});
```

## 7. 最佳实践与优化

### 7.1 特性检测

```javascript
/**
 * Web Speech API 特性检测
 */
function detectSpeechSupport() {
  const support = {
    synthesis: 'speechSynthesis' in window,
    recognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    grammar: 'SpeechGrammarList' in window
  };
  
  console.log('语音功能支持情况:', support);
  return support;
}

/**
 * 安全的语音合成函数
 */
function safeSpeech(text, options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('当前浏览器不支持语音合成');
    return false;
  }
  
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, options);
    speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('语音合成失败:', error);
    return false;
  }
}
```

### 7.2 性能优化

```javascript
/**
 * 语音缓存管理器
 */
class SpeechCache {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 50;
  }
  
  /**
   * 获取缓存的语音配置
   */
  get(text, options = {}) {
    const key = this.generateKey(text, options);
    return this.cache.get(key);
  }
  
  /**
   * 缓存语音配置
   */
  set(text, options, utterance) {
    const key = this.generateKey(text, options);
    
    // 限制缓存大小
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, utterance);
  }
  
  generateKey(text, options) {
    return `${text}_${JSON.stringify(options)}`;
  }
  
  clear() {
    this.cache.clear();
  }
}

const speechCache = new SpeechCache();
```

### 7.3 错误处理与降级

```javascript
/**
 * 健壮的语音功能实现
 */
class RobustSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.fallbackEnabled = true;
    this.retryCount = 3;
  }
  
  async speak(text, options = {}) {
    if (!this.synth) {
      return this.fallback(text);
    }
    
    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        await this.attemptSpeak(text, options);
        return true;
      } catch (error) {
        console.warn(`语音合成尝试 ${attempt + 1} 失败:`, error);
        
        if (attempt === this.retryCount - 1) {
          return this.fallback(text);
        }
        
        // 等待重试
        await this.delay(1000 * (attempt + 1));
      }
    }
  }
  
  attemptSpeak(text, options) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      Object.assign(utterance, options);
      
      const timeout = setTimeout(() => {
        reject(new Error('语音合成超时'));
      }, 10000);
      
      utterance.addEventListener('end', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      utterance.addEventListener('error', (event) => {
        clearTimeout(timeout);
        reject(new Error(event.error));
      });
      
      this.synth.speak(utterance);
    });
  }
  
  fallback(text) {
    if (this.fallbackEnabled) {
      console.log('使用降级方案显示文本:', text);
      // 可以显示文本提示、发送通知等
      this.showTextNotification(text);
      return true;
    }
    return false;
  }
  
  showTextNotification(text) {
    // 创建文本提示
    const notification = document.createElement('div');
    notification.textContent = text;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 7.4 语音队列管理

```javascript
/**
 * 语音播放队列管理器
 */
class SpeechQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.synth = window.speechSynthesis;
  }
  
  /**
   * 添加语音到队列
   */
  add(text, options = {}) {
    const item = {
      text,
      options,
      id: Date.now() + Math.random()
    };
    
    this.queue.push(item);
    
    if (!this.isPlaying) {
      this.playNext();
    }
    
    return item.id;
  }
  
  /**
   * 播放队列中的下一个语音
   */
  async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }
    
    this.isPlaying = true;
    const item = this.queue.shift();
    
    try {
      await this.playItem(item);
    } catch (error) {
      console.error('播放失败:', error);
    }
    
    // 继续播放下一个
    this.playNext();
  }
  
  /**
   * 播放单个语音项
   */
  playItem(item) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(item.text);
      Object.assign(utterance, item.options);
      
      utterance.addEventListener('end', resolve);
      utterance.addEventListener('error', reject);
      
      this.synth.speak(utterance);
    });
  }
  
  /**
   * 清空队列
   */
  clear() {
    this.queue = [];
    this.synth.cancel();
    this.isPlaying = false;
  }
  
  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      isPlaying: this.isPlaying,
      currentSpeaking: this.synth.speaking
    };
  }
}

// 使用示例
const speechQueue = new SpeechQueue();

// 批量添加语音
speechQueue.add("第一段文本");
speechQueue.add("第二段文本", { rate: 1.2 });
speechQueue.add("第三段文本", { pitch: 1.5 });
```

---

## 总结

Web Speech API 为现代 Web 应用提供了强大的语音处理能力。虽然浏览器兼容性还不够完美，但在支持的环境中，它能够显著提升用户体验，特别是在无障碍访问、语音交互和多媒体应用方面。

### 关键要点

1. **兼容性检测**：始终进行特性检测，提供降级方案
2. **错误处理**：实现健壮的错误处理机制
3. **性能优化**：合理使用缓存和队列管理
4. **用户体验**：提供清晰的状态反馈和控制选项

建议开发者根据实际需求选择合适的功能，并始终考虑用户的隐私和体验。

---

## 参考资料

- [MDN Web Speech API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API)
- [W3C Speech API 规范](https://w3c.github.io/speech-api/)
- [Can I Use - Web Speech API](https://caniuse.com/speech-synthesis)
