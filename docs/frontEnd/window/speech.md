# Web Speech API

Web Speech API 使你能够将语音数据合并到 Web 应用程序中。Web Speech API 有两个部分：SpeechSynthesis 语音合成（文本到语音 TTS）和 SpeechRecognition 语音识别（异步语音识别）。

Web Speech API 使 Web 应用能够处理语音数据，该项 API 包含以下两个部分：

- 语音识别通过 SpeechRecognition 接口进行访问，它提供了识别从音频输入（通常是设备默认的语音识别服务）中识别语音情景的能力。一般来说，你将使用该接口的构造函数来构造一个新的 SpeechRecognition 对象，该对象包含了一系列有效的对象处理函数来检测识别设备麦克风中的语音输入。SpeechGrammar 接口则表示了你应用中想要识别的特定文法。文法则通过 JSpeech Grammar Format (JSGF.) 来定义。
- 语音合成通过 SpeechSynthesis 接口进行访问，它提供了文字到语音（TTS）的能力，这使得程序能够读出它们的文字内容（通常使用设备默认的语音合成器）。不同的声音类类型通过 SpeechSynthesisVoice 对象进行表示，不同部分的文字则由 SpeechSynthesisUtterance 对象来表示。你可以将它们传递给 SpeechSynthesis.speak() 方法来产生语音。
-

## speechSynthesis 语音合成

Window 对象的只读属性返回 SpeechSynthesis 对象，该对象是使用 Web 语音 API 语音合成功能的入口点。它可以用于获取设备上关于可用的合成声音的信息，开始、暂停语音，或除此之外的其他命令。

- `paused` 当 SpeechSynthesis 处于暂停状态时， Boolean 值返回 true 。
- `pending` 当语音播放队列到目前为止保持没有说完的语音时， Boolean 值返回 true 。
- `speaking` 当语音谈话正在进行的时候，即使 SpeechSynthesis 处于暂停状态， Boolean 返回 true 。
- `onvoiceschanged事件` 当由 SpeechSynthesis.getVoices()方法返回的 SpeechSynthesisVoice 列表改变时触发。
- `getVoices()` 返回当前设备所有可用声音的 SpeechSynthesisVoice 列表。
- `pause()` 把 SpeechSynthesis 对象置为暂停状态。
- `resume()` 把 SpeechSynthesis 对象置为一个非暂停状态：如果已经暂停了则继续。
- `speak()` 添加一个 utterance 到语音谈话队列；它将会在其他语音谈话播放完之后播放。
- `cancel()` 移除所有语音谈话队列中的谈话。

SpeechSynthesisUtterance 表示语音请求对象，属性和方法：

- `lang` 获取并设置话语的语言
- `pitch` 获取并设置朗读话语的音调。
- `rate` 获取并设置说出话语的速度。
- `text` 获取并设置在说出话语时将合成的文本。
- `voice` 获取并设置将用于说出话语的语音。
- `volume` 获取并设置朗读话语的音量。
- `boundary事件` 当语音到达单词或句子边界时触发
- `end事件` 在说出话语时触发
- `error事件` 发生阻止成功说出话语的错误时触发
- `mark事件` 语音到达命名的 SSML“mark”标记时触发
- `pause事件` 当话语中途暂停时触发
- `resume事件` 恢复暂停的话语时触发
- `start事件` 在开始说出话语时触发
-

```js
// 成功合成语音，哈哈哈哈哈
const synth = window.speechSynthesis;
//获取语音合成支持的语音列表
const voices = synth.getVoices();
//构造发音谈话请求。其中包含了将由语音服务朗读的内容，以及如何朗读它（例如：语种、音高、音量）。
const utterThis = new SpeechSynthesisUtterance("这里是需要语音合成的文本");
utterThis.lang = "zh-CN";
utterThis.pitch = 1.5;
utterThis.volume = 0.5;
utterThis.rate = 1.5;
utterThis.addEventListener("error", () => {
  console.error("SpeechSynthesisUtterance error的文本：", utterThis.text);
});
// 从voices列表里选择utterance谈话的语音
utterThis.voice = voices.find(v => v.name === "zh-CN");
synth.onvoiceschanged = function (event) {
  console.log("语音改变时触发voiceschanged事件");
};
// 添加一个utterance到语音谈话队列
synth.speak(utterThis);
// 暂停谈话
synth.pause();
// 继续谈话
synth.resume();
// 移除谈话队列，不在谈话
synth.cancel();
```

## SpeechRecognition 语音识别

SpeechRecognition 接口是识别服务的控制器接口;这还会处理从识别服务发送的 SpeechRecognitionEvent。

> 暂时兼容性还不够好。。。。。

- `lang` 返回并设置当前 lang，默认为 HTML lang 属性值，或者用户代理的语言设置
- `grammars` 返回并设置 SpeechGrammar 对象的集合
- `continuous` 是否返回连续结果
- `interimResults` 是否应返回中期结果
- `maxAlternatives` 设置为每个结果提供的 SpeechRecognitionAlternative 的最大数量。默认值为 1。
- `audiostart事件` 当用户代理开始捕获音频时触发
- `audioend事件` 当用户代理完成捕获音频时触发
- `start事件` 当语音识别服务开始侦听传入音频
- `end事件` 服务断开连接时触发
- `error事件` 语音识别错误时触发
- `nomatch事件` 返回没有显著识别的最终结果时
- `result事件` 当语音识别服务返回结果
- `soundstart事件` 当检测到任何声音 （无论是否可识别的语音） 时触发
- `soundend事件` 当停止检测到任何声音 （无论是否可识别的语音） 时触发
- `speechstart事件` 当检测到语音识别服务识别为语音的声音时触发
- `speechend事件` 当停止检测到语音识别服务识别的语音时触发
- `start()` 启动语音识别服务，侦听传入的音频
- `abort()` 停止语音识别服务侦听传入音频，
- `stop()` 停止语音识别服务侦听传入的音频，并尝试使用捕获的音频返回 SpeechRecognitionResult。

```js
const grammar =
  "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();
recognition.onresult = event => {
  console.log(`Result received event: ${event}`);
};
```

参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API
