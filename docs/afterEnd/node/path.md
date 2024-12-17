## URL 解析

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│                                    href                                     │
├──────────┬┬───────────┬─────────────────┬───────────────────────────┬───────┤
│ protocol ││   auth    │      host       │           path            │ hash  │
│          ││           ├──────────┬──────┼──────────┬────────────────┤       │
│          ││           │ hostname │ port │ pathname │     search     │       │
│          ││           │          │      │          ├─┬──────────────┤       │
│          ││           │          │      │          │ │    query     │       │
"  http:   // user:pass @ host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          ││           │          │      │          │ │              │       │
└──────────┴┴───────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘

<!-- URL模块包含分析和解析 URL 的工具 -->
var url = require('url');
console.log(url);

/*
{ parse: [Function: urlParse],
  resolve: [Function: urlResolve],
  resolveObject: [Function: urlResolveObject],
  format: [Function: urlFormat],
  Url: [Function: Url] }
 */

var str = 'http://user:pass@host.com:8080/p/a/t/h?author=%E5%B0%8F%E7%81%AB%E6%9F%B4#hash';

url.parse(urlStr[, parseQueryString][, slashesDenoteHost])
console.log(url.parse(str));

/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'host.com:8080',
  port: '8080',
  hostname: 'host.com',
  hash: '#hash',
  search: '?author=%E5%B0%8F%E7%81%AB%E6%9F%B4',
  query: 'author=%E5%B0%8F%E7%81%AB%E6%9F%B4',
  pathname: '/p/a/t/h',
  path: '/p/a/t/h?author=%E5%B0%8F%E7%81%AB%E6%9F%B4',
  href: 'http://user:pass@host.com:8080/p/a/t/h?author=%E5%B0%8F%E7%81%AB%E6%9F%B4#hash' }
 */
```

## path 模块

提供了用于处理文件和目录的路径的实用工具。

node:path 模块的默认操作因运行 Node.js 应用的操作系统而异。具体来说，当在 Windows 操作系统上运行时，node:path 模块将假定正在使用 Windows 风格的路径。

因此，在 POSIX 和 Windows 上使用 path.basename() 可能会产生不同的结果：

```js
path.basename("C:\\temp\\myfile.html");
// 在 POSIX 上：Returns: 'C:\\temp\\myfile.html'
// 在 Windows 上：Returns: 'myfile.html'

//当使用 Windows 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.win32：
path.win32.basename("C:\\temp\\myfile.html");
// Returns: 'myfile.html'

// 当使用 POSIX 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.posix：
path.posix.basename("/tmp/myfile.html");
// Returns: 'myfile.html'
```

## path.basename(path[, suffix])

返回 path 的最后一部分，类似于 Unix basename 命令。忽略尾随 目录分隔符

```js
/**
 * @param path <string>
 * @param suffix <string> 要删除的可选后缀
 * @return <string>
 */
path.basename(path[, suffix])

path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
```

## path.delimiter

提供特定于平台的路径定界符：

- ; 用于 Windows

- : 用于 POSIX

```js
//在 POSIX 上：
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']

// 在 Windows 上：
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

## path.dirname(path)

返回 path 的目录名，类似于 Unix dirname 命令。尾随的目录分隔符被忽略

```js
/**
 * @param path <string>
 * @return <string>
 */

path.dirname("/foo/bar/baz/asdf/quux");
// Returns: '/foo/bar/baz/asdf'
```

## path.extname(path)

返回 path 的扩展名

```js
/**
 * @param path <string>
 * @return <string>
 */
path.extname("index.html");
// Returns: '.html'

path.extname("index.coffee.md");
// Returns: '.md'

path.extname("index.");
// Returns: '.'

path.extname("index");
// Returns: ''

path.extname(".index");
// Returns: ''

path.extname(".index.md");
// Returns: '.md'
```

## path.format(pathObject)

从对象返回路径字符串。这与 path.parse() 相反。

```js
/** pathObject参数
 * @param dir <string>
 * @param root <string>
 * @param base <string>
 * @param name <string>
 * @param ext <string>
 * @return <string>
 */

path.format({
  dir: "C:\\path\\dir",
  base: "file.txt",
});

// 在 Windows 上：Returns: 'C:\\path\\dir\\file.txt'
path.format({
  root: "/ignored",
  dir: "/home/user/dir",
  base: "file.txt",
});
// 在 POSIX 上：Returns: '/home/user/dir/file.txt'
```

## path.matchesGlob(path, pattern)

确定 path 是否与 pattern 匹配。

```js
/**
 * @param path <string>  用于 glob 匹配的路径。
 * @param pattern <string> 用于检查路径的 glob。
 * @return <boolean>
 */
path.matchesGlob("/foo/bar", "/foo/*"); // true
path.matchesGlob("/foo/bar*", "foo/bird"); // false
```

## path.isAbsolute(path)

确定 path 是否为绝对路径

```js
/**
 * @param path <string>
 * @return <boolean>
 */
path.isAbsolute("//server"); // true
path.isAbsolute("\\\\server"); // true
path.isAbsolute("C:/foo/.."); // true
path.isAbsolute("C:\\foo\\.."); // true
path.isAbsolute("bar\\baz"); // false
path.isAbsolute("bar/baz"); // false
path.isAbsolute("."); // false
```

## path.join([...paths])

使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径

```js
/**
 * @param paths <string> 路径片段
 * @return <string>
 */
path.join("/foo", "bar", "baz/asdf", "quux", "..");
// Returns: '/foo/bar/baz/asdf'

path.join("foo", {}, "bar");
// Throws 'TypeError: Path must be a string. Received {}'
```

## path.normalize(path)

规范化给定的 path，解析 '..' 和 '.' 片段。

```js
/**
 * @param path <string>
 * @return <string>
 */
path.normalize("/foo/bar//baz/asdf/quux/..");
// Returns: '/foo/bar/baz/asdf'
```

## path.parse(path)

返回一个对象，其属性表示 path 的重要元素。尾随的目录分隔符被忽略

```js
/**
 * @param dir <string>
 * @param base <string>
 * @param name <string>
 * @param ext <string>
 * @param root <string>
 * @return <object>
 */
path.parse("/home/user/dir/file.txt");
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

## path.relative(from, to)

根据当前工作目录返回从 from 到 to 的相对路径

```js
/**
 * @param from <string>
 * @param to <string>
 * @return <string>
 */
path.relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
// Returns: '../../impl/bbb'
```

## path.resolve([...paths])

将路径或路径片段的序列解析为绝对路径

```js
/**
 * @param paths <string> 路径或路径片段的序列
 * @return <string>
 */
path.resolve("/foo/bar", "./baz");
// Returns: '/foo/bar/baz'

path.resolve("/foo/bar", "/tmp/file/");
// Returns: '/tmp/file'

path.resolve("wwwroot", "static_files/png/", "../gif/image.gif");
// 如果当前工作目录：/home/myself/node,
// 将会返回：'/home/myself/node/wwwroot/static_files/gif/image.gif'
```

## path.sep

提供特定于平台的路径片段分隔符：

Windows 上是 \

POSIX 上是 /

```js
"foo/bar/baz".split(path.sep);
//在 POSIX 上：Returns: ['foo', 'bar', 'baz']

"foo\\bar\\baz".split(path.sep);
// Windows 上：Returns: ['foo', 'bar', 'baz']
```
