## proccess 模块

提供有关当前 node 进程信息并对其进行控制，是 EventEmitter 的实例。

process是一个全局对象，即global对象的属性，可以在任何地方直接访问到它而无需引入额外模块

![alt text](image.png)
```js
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('disconnect', () => {
  console.log('disconnect event with code: ');
});

process.on('message', (message，sendHandle) => {
  console.log('只要子进程收到父进程使用 childprocess.send() 发送的消息', message);
});

process.on('rejectionHandled', (reason,promise) => {
  console.log( reason,promise);
});

process.on('workerMessage', (value,source) => {
  console.log(value,source);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

process.on('uncaughtException', (err,origin) => {
  console.log(err,origin);
});

process.on('unhandledRejection', (reason,promise) => {
  console.log(reason,promise);
});

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});

process.on('worker', (worker) => {
  console.log('创建新的 <Worker> 线程后会触发 'worker' 事件。', worker);
});

//是 NODE_OPTIONS 环境变量中允许的特殊的只读 Set 标志。
process.allowedNodeEnvironmentFlags
//为其编译 Node.js 二进制文件的操作系统 CPU 架构
process.arch
//返回数组，其中包含启动 Node.js 进程时传入的命令行参数
process.argv
//存储了 Node.js 启动时传入的 argv[0] 原始值的只读副本
process.argv0
//是对 IPC 通道的引用。
process.channel
//包含用于编译当前 Node.js 可执行文件的配置选项的 JavaScript 表示
process.config
//是否连接了 IPC 通道
process.connected
//启用时 Node.js 调试器使用的端口。
process.debugPort
//包含用户环境的对象
process.env

{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
//启动时传入的一组特定于 Node.js 的命令行选项
process.execArgv
//可执行文件的绝对路径名
process.execPath

process.exitCode

// 特性支持对象
process.features

// 其方法用于为当前进程生成诊断报告
process.report

// 返回连接到 stderr (文件描述符 2) 的流,它是一个 net.Socket
process.stderr
process.stderr.write('输出一行标准错误流，效果跟stdout没差');

// 指向标准输入流(stdin)的可读流(Readable Stream).必须要调用process.stdin.resume()来恢复(resume)接收
process.stdin
process.stdin.resume();
var a,b;
process.stdout.write('请输入a的值: ');
process.stdin.on('data',function(data){
    if(a == undefined){
        a = Number(data);
        process.stdout.write('请输入b的值: ');
    }else{    
        b = Number(data);
        process.stdout.write('结果是: ' + (a+b));
        process.exit();
    }

})

// 返回连接到 stdout (文件描述符 1) 的流。它是一个 net.Socket
process.stdout
process.stdout.write('这是一行数据\n这是第二行数据');

// 返回进程的 PID。
process.pid

// 返回当前进程的父进程的 PID。
process.ppid

// 返回用于标识编译 Node.js 二进制文件的操作系统平台的字符串
process.platform

//包含 Node.js 版本字符串
process.version
//列出了 Node.js 的版本字符串及其依赖
process.versions
// 包含与当前版本相关的元数据
process.release

{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.cn/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.cn/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.cn/download/release/v18.12.0/win-x64/node.lib'
}

// 用于管理当前进程的权限的对象
process.permission
// Check if the process has permission to read the README file
process.permission.has('fs.read', './README.md');

//返回当前 Node.js 进程已经运行的秒数。
process.uptime()

// 触发node的abort事件，退出当前进程
process.abort()

//向父进程发送消息
process.send(message[, sendHandle[, options]][, callback])

// 返回当前进程的工作目录
process.cmd()
//更改 Node.js 进程的当前工作目录
process.chdir(directory)

//当前进程的资源使用情况
process.resourceUsage()

//获取进程可用的内存量
process.constrainedMemory()

//获取进程仍可用的空闲内存量（以字节为单位）。
process.availableMemory()

//返回当前进程的用户和系统 CPU 时间使用情况
process.cpuUsage([previousValue])

//返回 Node.js 进程的当前工作目录。
process.disconnect()

//允许动态加载共享对象
process.dlopen(module, filename[, flags])

//触发自定义或特定于应用的进程警告
process.emitWarning(warning[, options])
process.emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});

//以 code 的退出状态同步终止进程
process.exit([code])

//包含当前保持事件循环活动的活动资源的类型的字符串
process.getActiveResourcesInfo()

//在全局可用函数中加载内置模块
process.getBuiltinModule(id)

//返回进程的数字用户标识
process.getuid()

//将 signal 发送到由 pid 标识的进程。
process.kill(pid[, signal])

//Node进程的内存使用情况，其单位是bytes
process.memoryUsage()

//将 callback 添加到 "下一个滴答队列"
process.nextTick(callback[, ...args])

//将 .env 文件加载到 process.env 中
process.loadEnvFile(path)
```
