## readline 模块

模块提供了一个接口，用于一次一行地从 可读 流（例如 process.stdin）中读取数据。

```js
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

// 将在调用后开始使用输入流。在接口创建和异步迭代之间进行异步操作可能会导致丢失行。
const rl = readline.createInterface({ input, output });

for await (const line of rl) {
  // Each line in the readline input will be successively available here as
  // `line`.
}

rl.question("What do you think of Node.js? ", answer => {
  console.log(`Thank you for your valuable feedback: ${answer}`);

  // 关闭流，不在监听控制台输入
  rl.close();
});

rl.on("close", () => {});
rl.on("line", input => {
  console.log(`每当 input 流接收到行尾输入（\n、\r 或 \r\n）时: ${input}`);
});
rl.on("history", history => {
  console.log(`每当历史数组发生更改时: ${history}`);
});
rl.on("pause", () => {
  console.log(`input 流已暂停`);
});
rl.on("resume", () => {
  console.log(`每当 input 流恢复时，则会触发 'resume' 事件。`);
});
rl.on("SIGCONT", () => {
  console.log(
    "当先前使用 Ctrl+Z（即 SIGTSTP）移至后台的 Node.js 进程随后使用 fg(1p) 返回前台时"
  );

  //方法设置了在调用 rl.prompt() 时将写入 output 的提示。
  rl.setPrompt("提示信息");

  rl.getPrompt();

  // 如果为 true，则防止光标位置重置为 0。
  // 写入 output 中的新行，以便为用户提供用于提供输入的新位置。
  rl.prompt(true);
});

rl.on("SIGINT", () => {
  console.log("每当 input 流接收到 Ctrl+C 输入（通常称为 SIGINT）时");
  rl.question("Are you sure you want to exit? ", answer => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});

rl.on("SIGTSTP", () => {
  console.log("当 input 流接收到 Ctrl+Z 输入（通常称为 SIGTSTP）时");
});

rl.pause();
// rl.cursor:相对于 rl.line 的光标位置。
// rl.line:节点正在处理的当前输入数据
// rl.line:节点正在处理的当前输入数据
// rl.line:节点正在处理的当前输入数据
//将 data 或由 key 标识的键序列写入 output
rl.write(rl.line, { ctrl: true, name: "u" });

rl.getCursorPos();

rl.on("line", input => {
  console.log(`Received: ${input}`);
});
```
