# fs 文件系统

node:fs 模块能够以标准 POSIX 函数为模型的方式与文件系统进行交互。

所有文件系统操作都具有同步、回调和基于 promise 的形式，并且可以使用 CommonJS 语法和 ES6 模块进行访问

```js
// 基于 promise 的操作会返回一个当异步操作完成时被履行的 promise。
const { unlink } = require("node:fs/promises");

(async function (path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error("there was an error:", error.message);
  }
})("/tmp/hello");

/**回调的形式将完成回调函数作为其最后一个参数并且异步地调用该操作。
 * 传给完成回调的参数取决于方法，但是第一个参数始终预留用于异常。
 * 如果操作成功地完成，则第一个参数为 null 或 undefined。 */
const { unlink } = require("node:fs");
unlink("/tmp/hello", err => {
  if (err) throw err;
  console.log("successfully deleted /tmp/hello");
});

fs.writeFileSync('../pages/test.txt','你好，张进喜','utf8'); //同步写文件
fs.writeFile('../pages/test.txt','你好，上海','utf8',(error)=>{console.log(error)});
//异步写文件，回调函数必有，如果成功error为null

let data = fs.readFileSync('../pages/test.txt');
 //同步读文件，data需要toString()转换
console.log(data.toString());

fs.readFile('../pages/test.txt','utf8',(error,data)=>{
  //异步读文件，如果成功error为null，data不用toSting()，返回的是原始数据
    if(!error){
        console.log(error,data)
    }
})

let data = fs.existsSync('../pages/teswt.txt');
//同步判断文件是否存在，返回boolean值
console.log(data)

fs.exists('../pages/tewst.txt',(truely)=>{
  //如果存在truely为true，否则为false。
    console.log(truely)
})
console.log(data,'111')
fs.appendFile('../pages/tewst.txt','你不是个傻子吧',(error)=>{
  //异步追加内容，error始终都是null，如果找不到文件会创建文件并添加内容
    console.log(error,'333')
});
fs.appendFileSync('../pages/teest.txt','你不是个傻子吧');
//同步追加内容，如果找不到文件会创建文件然后添加内容
console.log(data,'22');

fs.open(path, flags[, mode], callback)
//异步模式下打开文件，path为文件路径，flags为打开的方式，
// 例如只读，读写等，mode为设置文件模式(权限)，
// 文件创建默认权限为 0666(可读，可写)  callback(err,fd)为回调

fs.read(fd, buffer, offset, length, position, callback)
//异步读取文件，在fs.open()方法中使用，fd是文件描述，buffer是读取后存进buffer中，
// offset是存进去的偏移量，length要从文件中读取的字节数。
// position文件读取的起始位置，callback(err,bytes,buffer) bytes为读取的字节数

fs.close(fd, callback)
//异步模式下关闭文件，callback没有参数 也是配合fs.open()使用

fs.ftruncate(fd, len, callback)
//异步模式下，截取文件，fd为fs.open()回调返回的文件描述，len为截取的长度，callback没有参数，

fs.unlink(path,callback) //删除文件，callback(error)

// 通过异步模式获取文件信息的语法格式
fs.stat(path,callback(error,stats))
// stats为文件状态对象，可以根据stats对象提供的方法判断文件状态，
// 例如stats.isFile()，判断是否为文件

fs.watchFile('../pages/test.txt',(newstatus,oldstatus)=>{
    console.log(newstatus.size,oldstatus.size,'333')
})
// 监听文件，当文件改变时运行回调函数，两个参数都是包含文件改变前后两个状态信息的对象

fs.mkdir(path[, options], callback)
//创建目录的语法格式，options（可选）两个参数recursive是否以递归方式创建，
// 默认false，mode设置目录权限默认0777

fs.readdir(path, callback) //读取目录的语法格式，callback（error，fileList），fileList是目录下的文件数据列表

fs.rmdir(path, callback) //删除目录

fs.rename(oldPath, newPath, callback)
//异步的重命名文件


/**同步的 API 会阻塞 Node.js 事件循环和下一步的 JavaScript 执行，直到操作完成。
 * 异常会被立即地抛出，可以使用 try…catch 来处理，也可以允许冒泡。 */
const { unlinkSync } = require("node:fs");
try {
  unlinkSync("/tmp/hello");
  console.log("successfully deleted /tmp/hello");
} catch (err) {
  // handle the error
}
```

统一使用 fs Promise API 学习。Promise API 使用底层的 Node.js 线程池在事件循环线程之外执行文件系统操作。这些操作不是同步的也不是线程安全的。对同一文件执行多个并发修改时必须小心，否则可能会损坏数据。

## fsPromises.access(path[, mode])

测试用户对 path 指定的文件或目录的权限

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <integer> mode 指定要执行的可访问性检查
 * @return <Promise> 成功时将使用 undefined 履行。
 */

import { access, constants } from "node:fs/promises";

try {
  await access("/etc/passwd", constants.R_OK | constants.W_OK);
  console.log("can access");
} catch {
  console.error("cannot access");
}
```

## fsPromises.appendFile(path, data[, options])

异步地将数据追加到文件，如果该文件尚不存在，则创建该文件

```js
/**
 * @param <string> | <Buffer> | <URL> |<FileHandle> 文件名或 <FileHandle>  path
 * @param <string> | <Buffer> data
 * @param <Object> options
 *  encoding <string> | <null> 默认值：'utf8'
 *  mode <integer>
 *  flag 默认值a
 *  flush <boolean> 如果是 true，则在关闭基础文件描述符之前将其刷新。默认值：false。
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.chmod(path, mode)

更改文件的权限。

```js
/**
 * @param <string> | <Buffer> path
 * @param <integer> | <string> mode
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.chown(path, uid, gid)

更改文件所有权

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <integer> uid
 * @param <integer> gid
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.copyFile(src, dest[, mode])

异步地将 src 复制到 dest。默认情况下，如果 dest 已经存在，则会被覆盖。复制模式：

- fs.constants.COPYFILE_EXCL：如果 dest 已经存在，则复制操作将失败。

- fs.constants.COPYFILE_FICLONE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则使用后备复制机制。

- fs.constants.COPYFILE_FICLONE_FORCE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则该操作将失败。

```js
/**
 * @param <string> | <Buffer> | <URL> src
 * @param <string> | <Buffer> | <URL> dest
 * @param <integer> mode 指定复制操作行为的可选修饰符
 * @return <Promise> 成功时将使用 undefined 履行。
 */

import { copyFile, constants } from "node:fs/promises";

try {
  await copyFile("source.txt", "destination.txt", constants.COPYFILE_EXCL);
  console.log("source.txt was copied to destination.txt");
} catch {
  console.error("The file could not be copied");
}
```

## fsPromises.cp(src, dest[, options])

将整个目录结构从 src 异步地复制到 dest，包括子目录和文件。

当将目录复制到另一个目录时，不支持 globs，并且行为类似于 cp dir1/ dir2/。

```js
/**
 * @param <string> | <URL> src
 * @param <string> | <URL> dest
 * @param <Object> options 
 * dereference <boolean> 取消引用符号链接。默认值：false。
    * errorOnExist <boolean> 当 force 是 false 且目标存在时，抛出错误。默认值：false。
    filter <Function> 过滤复制文件/目录的函数。返回 true 则复制条目，返回 false 则忽略它。忽略目录时，其所有内容也将被跳过。还可以返回解析为 true 或 false 默认值的 Promise：undefined。
        src <string> 要复制的源路径。
        dest <string> 要复制到的目标路径。
        返回：<boolean> | <Promise> 可强制转换为 boolean 的值或满足该值的 Promise。
    force <boolean> 覆盖现有文件或目录。如果将此设置为 false 并且目标存在，则复制操作将忽略错误。使用 errorOnExist 选项更改此行为。默认值：true。

    mode <integer> 复制操作的修饰符。默认值：0。参见 fsPromises.copyFile() 的 mode 标志。
    preserveTimestamps <boolean> 当为 true 时，则 src 的时间戳将被保留。默认值：false。
    recursive <boolean> 递归复制目录默认：false
    verbatimSymlinks <boolean> 当为 true 时，则符号链接的路径解析将被跳过。默认值：false
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.glob(pattern[, options])

它生成与模式匹配的文件的路径

```js
/**
 * @param <string> pattern
 * @param <Object> options 
 * cwd <string> 当前工作目录。默认值：process.cwd()
  exclude <Function> 过滤文件/目录的功能。返回 true 以排除该项目，返回 false 以包含该项目。默认值：undefined。

  withFileTypes <boolean> 如果 glob 应将路径返回为 Dirents，则为 true，否则为 false。默认值：false。
 * @return <AsyncIterator> 它生成与模式匹配的文件的路径。
 */

const { glob } = require("node:fs/promises");

(async () => {
  for await (const entry of glob("**/*.js")) console.log(entry);
})();
```

## fsPromises.link(existingPath, newPath)

创建从 existingPath 到 newPath 的新链接

```js
/**
 * @param <string> | <Buffer> | <URL> existingPath
 * @param <string> | <Buffer> | <URL> newPath
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.mkdir(path[, options])

异步地创建目录。

可选的 options 参数可以是指定 mode（权限和粘性位）的整数，也可以是具有 mode 属性和 recursive 属性（指示是否应创建父目录）的对象。当 path 是已存在的目录时，调用 fsPromises.mkdir() 仅在 recursive 为 false 时才导致拒绝。

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options 
    * recursive <boolean> 默认值：false
      mode <string> | <integer> Windows 上不支持。默认值：0o777。
 * @return <Promise> 成功后，如果 recursive 为 false，则使用 undefined 履行；
 如果 recursive 为 true，则使用创建的第一个目录路径履行。
 */

const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");

async function makeDirectory() {
  const projectFolder = join(__dirname, "test", "project");
  const dirCreation = await mkdir(projectFolder, { recursive: true });
  return dirCreation;
}

makeDirectory().catch(console.error);
```

## fsPromises.mkdtemp(prefix[, options])

创建唯一的临时目录。通过在所提供的 prefix 的末尾附加六个随机字符来生成唯一的目录名称。由于平台的不一致，请避免在 prefix 中尾随 X 字符。某些平台，尤其是 BSD，可能返回六个以上的随机字符，并将 prefix 中的尾随 X 字符替换为随机字符。

```js
/**
 * @param <string> | <Buffer> | <URL> prefix
 * @param <Object> options
 *  encoding <string> 默认值：'utf8'
 * @return <Promise> 用包含新创建的临时目录的文件系统路径的字符串来满足。
 */

import { access, constants } from "node:fs/promises";

import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

try {
  await mkdtemp(join(tmpdir(), "foo-"));
} catch (err) {
  console.error(err);
}
```

## fsPromises.open(path, flags[, mode])

打开 `<FileHandle>`。对象是数字文件描述符的对象封装。

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <string>|<number> flags 默认值：'r'。
 * @param <string>|<number> mode 如果创建文件，则设置文件模式（权限和粘性位）。
 * 默认值：0o666（可读可写）
 * @return <Promise> 使用 <FileHandle> 对象实现。
 */
import { open } from "node:fs/promises";

let filehandle;
try {
  filehandle = await open("thefile.txt", "r");
} finally {
  await filehandle?.close();
}
```

## fsPromises.opendir(path[, options])

异步地打开目录进行迭代扫描

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options
 *  encoding <string> | <null> 默认值：'utf8'
 *  bufferSize <number> 当从目录读取时，在内部缓冲的目录条目数。
 *  值越大，性能越好，但内存使用率越高。默认值：32
 *  recursive  <boolean> 已解析的 Dir 将是包含所有子文件和
 *  目录的 <AsyncIterable>。默认值：false
 * @return <Promise> 满足 <fs.Dir>。
 */

import { opendir } from "node:fs/promises";

try {
  const dir = await opendir("./");
  for await (const dirent of dir) console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```

当使用异步迭代器时，`<fs.Dir>` 对象将在迭代器退出后自动关闭。

## fsPromises.readdir(path[, options])

读取目录的内容。可选的 options 参数可以是指定编码的字符串，也可以是具有 encoding 属性（指定用于文件名的字符编码）的对象。如果 encoding 设置为 'buffer'，则返回的文件名将作为 `<Buffer>` 对象传入。

如果 options.withFileTypes 设置为 true，则返回的数组将包含` <fs.Dirent>` 个对象。

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <string>|<Object> options
 *  encoding
 *  withFileTypes 默认值false
 *  recursive 默认是false
 * @return <Promise> 使用目录中文件的名称数组（不包括 '.' 和 '..'）履行。
 */

import { readdir } from "node:fs/promises";

try {
  const files = await readdir(path);
  for (const file of files) console.log(file);
} catch (err) {
  console.error(err);
}
```

## fsPromises.readFile(path[, options])

异步地读取文件的全部内容。如果未指定编码（使用 options.encoding），则数据作为 `<Buffer> `对象返回。否则，数据将为字符串。

如果 options 是字符串，则它指定编码。

```js
/**
 * @param <string> | <Buffer> | <URL>|<FileHandle> 文件名或 FileHandle path
 * @param <Object> options
 *  encoding <string> | <null> 默认值：null
 *  flag <string> 参见 支持文件系统 flags。默认值：'r'。
 *  signal <AbortSignal> 允许中止正在进行的 readFile
 * @return <Promise> 成功时将使用 undefined 履行。
 */
const { readFile } = require("node:fs/promises");
const { resolve } = require("node:path");
async function logFile() {
  try {
    const filePath = resolve("./package.json");
    const controller = new AbortController();
    const { signal } = controller;
    const promise = await readFile(filePath, { encoding: "utf8", signal });
    // Abort the request before the promise settles.
    controller.abort();
    return promise;
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```

## fsPromises.rename(oldPath, newPath)

将 oldPath 重命名为 newPath。

```js
/**
 * @param <string> | <Buffer> | <URL> oldPath
 * @param <string> | <Buffer> | <URL> newPath
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.rmdir(path[, options])

删除由 path 标识的目录。

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options
 *  maxRetries
 *  recursice
 *  retryDelay
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.rm(path[, options])

删除文件和目录

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options
 *  force
 *  maxRetries
 *  recursive
 *  retryDelay
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.stat(path[, options])

测试用户对 path 指定的文件或目录的权限

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options
 *  bigint <boolean> 返回的 <fs.Stats> 对象中的数值是否应为 bigint。默认值：false。
 * @return <Promise> 满足给定 path 的 <fs.Stats> 对象。
 */
```

## fsPromises.statfs(path[, options])

测试用户对 path 指定的文件或目录的权限

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @param <Object> options
 *  bigint <boolean> 返回的 <fs.Stats> 对象中的数值是否应为 bigint。默认值：false。
 * @return <Promise> 满足给定 path 的 <fs.StatFs> 对象。
 */
```

## fsPromises.truncate(path[, len])

将 path 上的内容截断（缩短或延长长度）到 len 个字节。

```js
/**
 * @param <string> | <Buffer> | <URL> path
 * @return <Promise> 成功时将使用 undefined 履行。
 */
```

## fsPromises.watch(filename[, options])

返回异步迭代器，其监视 filename 上的更改，其中 filename 是文件或目录。

```js
/**
 * @param <string> | <Buffer> | <URL> filename
 * @param <string> |<Object> options
 *  persistent
 *  recursive
 *  encoding
 *  signal
 * @return <AsyncIterator> 个具有以下属性的对象：
      eventType <string> 变更类型
      filename <string> | <Buffer> | <null> 变更的文件的名称。
 */

const { watch } = require("node:fs/promises");

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher) console.log(event);
  } catch (err) {
    if (err.name === "AbortError") return;
    throw err;
  }
})();
```

## fsPromises.writeFile(file, data[, options])

异步地将数据写入文件，如果文件已经存在，则替换该文件。data 可以是字符串、缓冲区、`<AsyncIterable>`、或 `<Iterable>` 对象。

```js
/**
 * @param <string> | <Buffer> | <URL> | <FileHandle> 文件名或 FileHandle file
 * @param <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream> data
 * @param <Object> options
 *  encoding
 *  mode
 *  flag
 *  flush  <boolean> 如果所有数据都成功写入文件，并且 flush 是 true，
 *  则使用 filehandle.sync() 来刷新数据。默认值：false。
 *  signal
 * @return <Promise> 成功时将使用 undefined 履行。
 */
import { writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from("Hello Node.js"));
  const promise = writeFile("message.txt", data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

## fsPromises.constants

返回一个包含文件系统操作常用常量的对象。对象与 fs.constants 相同。
