---
title: Node.js path 路径处理
description: Node.js path 模块详解 - 路径解析、文件名处理、URL解析和跨平台兼容性指南
outline: deep
---

# 📁 Node.js path 路径处理

node:path 模块提供了用于处理文件和目录路径的实用工具。它能够处理不同操作系统之间的路径差异，确保代码在各平台上的一致性。

::: tip 📚 本章内容
深入学习 path 模块的各种方法、跨平台处理技巧和 URL 解析最佳实践。
:::

## 1. 路径模块概述

### 🎯 跨平台路径处理

path 模块的默认操作因运行 Node.js 应用的操作系统而异。在不同平台上使用相同的方法可能会产生不同的结果：

| 平台 | 路径分隔符 | 示例 |
|------|------------|------|
| **Windows** | `\` (反斜杠) | `C:\Users\张三\Documents` |
| **POSIX** | `/` (正斜杠) | `/home/zhangsan/documents` |

### 🔧 引入模块

```javascript
const path = require('node:path')

// 特定平台的路径处理
const posixPath = require('node:path').posix
const win32Path = require('node:path').win32
```

## 2. URL 解析详解

### 🔗 URL 结构图

```
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
```

### 🌐 URL 解析示例

```javascript
const url = require('node:url')

// URL 解析
const urlString = 'http://user:pass@host.com:8080/p/a/t/h?author=%E5%B0%8F%E7%81%AB%E6%9F%B4#hash'
const parsedUrl = url.parse(urlString)

console.log(parsedUrl)
/*
输出:
{
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
  href: 'http://user:pass@host.com:8080/p/a/t/h?author=%E5%B0%8F%E7%81%AB%E6%9F%B4#hash'
}
*/
```

## 3. 路径处理核心方法

### 📄 path.basename() - 获取文件名

返回 path 的最后一部分，类似于 Unix basename 命令：

```javascript
// 基本用法
console.log(path.basename('/foo/bar/baz/asdf/quux.html'))
// 输出: 'quux.html'

// 移除扩展名
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html'))
// 输出: 'quux'

// 处理不同平台路径
console.log(path.basename('C:\\temp\\myfile.html'))
// 在 POSIX 上: 'C:\\temp\\myfile.html'
// 在 Windows 上: 'myfile.html'

// 实际应用示例
function getFileNameFromPath(filePath) {
  const fileName = path.basename(filePath)
  const nameWithoutExt = path.basename(filePath, path.extname(filePath))
  
  return {
    fullName: fileName,
    nameOnly: nameWithoutExt,
    extension: path.extname(filePath)
  }
}

const fileInfo = getFileNameFromPath('/documents/report.pdf')
console.log(fileInfo)
// 输出: { fullName: 'report.pdf', nameOnly: 'report', extension: '.pdf' }
```

### 📂 path.dirname() - 获取目录名

返回 path 的目录名，类似于 Unix dirname 命令：

```javascript
// 基本用法
console.log(path.dirname('/foo/bar/baz/asdf/quux'))
// 输出: '/foo/bar/baz/asdf'

console.log(path.dirname('/foo/bar/baz/asdf/quux/'))
// 输出: '/foo/bar/baz/asdf'

// Windows 路径
console.log(path.dirname('C:\\foo\\bar\\baz\\asdf\\quux'))
// 输出: 'C:\\foo\\bar\\baz\\asdf'

// 实际应用
function createBackupPath(originalPath) {
  const dir = path.dirname(originalPath)
  const fileName = path.basename(originalPath)
  const backupDir = path.join(dir, 'backup')
  
  return path.join(backupDir, fileName)
}

const backupPath = createBackupPath('/documents/important.txt')
console.log(backupPath)
// 输出: '/documents/backup/important.txt'
```

### 🔧 path.extname() - 获取扩展名

返回 path 的扩展名：

```javascript
// 基本用法
console.log(path.extname('index.html'))
// 输出: '.html'

console.log(path.extname('index.coffee.md'))
// 输出: '.md'

console.log(path.extname('index.'))
// 输出: '.'

console.log(path.extname('index'))
// 输出: ''

console.log(path.extname('.index'))
// 输出: ''

console.log(path.extname('.index.md'))
// 输出: '.md'

// 实际应用 - 文件类型检查
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  
  const fileTypes = {
    '.txt': 'text',
    '.md': 'markdown',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.gif': 'image',
    '.pdf': 'document',
    '.doc': 'document',
    '.docx': 'document'
  }
  
  return fileTypes[ext] || 'unknown'
}

console.log(getFileType('report.pdf'))    // 'document'
console.log(getFileType('photo.jpg'))     // 'image'
console.log(getFileType('script.js'))     // 'javascript'
```

### 🏗️ path.format() - 格式化路径

从对象返回路径字符串，与 path.parse() 相反：

```javascript
// 基本用法
const pathObject = {
  root: '/',
  dir: '/home/user/documents',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}

console.log(path.format(pathObject))
// 输出: '/home/user/documents/file.txt'

// Windows 路径
const winPathObject = {
  dir: 'C:\\path\\dir',
  base: 'file.txt'
}

console.log(path.format(winPathObject))
// 输出: 'C:\\path\\dir\\file.txt'

// 实际应用 - 动态路径生成
function createFilePath(directory, fileName, extension) {
  return path.format({
    dir: directory,
    name: fileName,
    ext: extension.startsWith('.') ? extension : '.' + extension
  })
}

const filePath = createFilePath('/uploads', 'document', 'pdf')
console.log(filePath)
// 输出: '/uploads/document.pdf'
```

### 📊 path.parse() - 解析路径

将路径字符串解析为对象：

```javascript
// 基本用法
const pathString = '/home/user/documents/file.txt'
const parsed = path.parse(pathString)

console.log(parsed)
/*
输出:
{
  root: '/',
  dir: '/home/user/documents',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

// Windows 路径解析
const winPath = 'C:\\Users\\张三\\Documents\\报告.docx'
const winParsed = path.parse(winPath)

console.log(winParsed)
/*
输出:
{
  root: 'C:\\',
  dir: 'C:\\Users\\张三\\Documents',
  base: '报告.docx',
  ext: '.docx',
  name: '报告'
}
*/

// 实际应用 - 路径信息提取
function getPathInfo(filePath) {
  const info = path.parse(filePath)
  
  return {
    directory: info.dir,
    fileName: info.name,
    extension: info.ext,
    fullName: info.base,
    isAbsolute: path.isAbsolute(filePath),
    normalized: path.normalize(filePath)
  }
}

const pathInfo = getPathInfo('/home/user/../user/documents/./file.txt')
console.log(pathInfo)
```

## 4. 路径操作方法

### 🔗 path.join() - 连接路径

使用平台特定的分隔符连接路径：

```javascript
// 基本用法
console.log(path.join('/foo', 'bar', 'baz/asdf', '..', 'quux'))
// 输出: '/foo/bar/baz/quux'

console.log(path.join('foo', {}, 'bar'))
// 抛出 TypeError: Path must be a string

// 实际应用
function buildProjectPath(projectRoot, ...segments) {
  return path.join(projectRoot, ...segments)
}

const projectRoot = '/home/user/projects/myapp'
const configPath = buildProjectPath(projectRoot, 'config', 'database.json')
const srcPath = buildProjectPath(projectRoot, 'src', 'components', 'Button.js')

console.log(configPath)  // '/home/user/projects/myapp/config/database.json'
console.log(srcPath)     // '/home/user/projects/myapp/src/components/Button.js'
```

### 🔄 path.resolve() - 解析绝对路径

将路径或路径片段解析为绝对路径：

```javascript
// 基本用法
console.log(path.resolve('/foo/bar', './baz'))
// 输出: '/foo/bar/baz'

console.log(path.resolve('/foo/bar', '/tmp/file/'))
// 输出: '/tmp/file'

console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'))
// 如果当前工作目录是 /home/myself/node，则输出:
// '/home/myself/node/wwwroot/static_files/gif/image.gif'

// 实际应用
class PathResolver {
  constructor(baseDir) {
    this.baseDir = path.resolve(baseDir)
  }
  
  resolve(...segments) {
    return path.resolve(this.baseDir, ...segments)
  }
  
  relative(targetPath) {
    return path.relative(this.baseDir, targetPath)
  }
}

const resolver = new PathResolver('./project')
console.log(resolver.resolve('src', 'index.js'))
console.log(resolver.relative('/absolute/path/to/file.txt'))
```

### 🔀 path.relative() - 获取相对路径

返回从 from 到 to 的相对路径：

```javascript
// 基本用法
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'))
// 输出: '../../impl/bbb'

console.log(path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb'))
// 输出: '..\\..\\impl\\bbb'

// 实际应用 - 生成相对路径
function generateRelativePaths(baseDir, targetFiles) {
  return targetFiles.map(file => ({
    absolute: file,
    relative: path.relative(baseDir, file)
  }))
}

const baseDir = '/project/src'
const files = [
  '/project/src/index.js',
  '/project/src/components/Button.js',
  '/project/config/webpack.config.js',
  '/project/package.json'
]

const relativePaths = generateRelativePaths(baseDir, files)
console.log(relativePaths)
/*
输出:
[
  { absolute: '/project/src/index.js', relative: 'index.js' },
  { absolute: '/project/src/components/Button.js', relative: 'components/Button.js' },
  { absolute: '/project/config/webpack.config.js', relative: '../config/webpack.config.js' },
  { absolute: '/project/package.json', relative: '../package.json' }
]
*/
```

### 📏 path.normalize() - 规范化路径

规范化路径，处理 `..` 和 `.` 片段：

```javascript
// 基本用法
console.log(path.normalize('/foo/bar//baz/asdf/quux/..'))
// 输出: '/foo/bar/baz/asdf'

console.log(path.normalize('C:\\temp\\\\foo\\bar\\..\\'))
// 输出: 'C:\\temp\\foo\\'

// 实际应用 - 清理路径
function cleanPath(inputPath) {
  return path.normalize(inputPath)
}

const messyPaths = [
  '/home/user/../user/documents/./file.txt',
  'C:\\Users\\张三\\..\\张三\\Documents\\..\\Desktop\\file.txt',
  './src/../src/components/./Button.js'
]

messyPaths.forEach(p => {
  console.log(`原路径: ${p}`)
  console.log(`清理后: ${cleanPath(p)}`)
  console.log('---')
})
```

## 5. 路径检查方法

### ✅ path.isAbsolute() - 检查绝对路径

检查路径是否为绝对路径：

```javascript
// POSIX 系统
console.log(path.isAbsolute('/foo/bar'))    // true
console.log(path.isAbsolute('quux/'))       // false
console.log(path.isAbsolute('.'))           // false

// Windows 系统
console.log(path.isAbsolute('//server'))    // true
console.log(path.isAbsolute('\\\\server'))  // true
console.log(path.isAbsolute('C:/foo/..'))   // true
console.log(path.isAbsolute('C:\\foo\\..')) // true
console.log(path.isAbsolute('bar\\baz'))    // false
console.log(path.isAbsolute('bar/baz'))     // false
console.log(path.isAbsolute('.'))           // false

// 实际应用
function validatePaths(paths) {
  return paths.map(p => ({
    path: p,
    isAbsolute: path.isAbsolute(p),
    type: path.isAbsolute(p) ? 'absolute' : 'relative'
  }))
}

const testPaths = [
  '/home/user/documents',
  './relative/path',
  'C:\\Windows\\System32',
  '../parent/directory'
]

const validatedPaths = validatePaths(testPaths)
console.log(validatedPaths)
```

### 🎯 path.matchesGlob() - 模式匹配

检查路径是否匹配 glob 模式：

```javascript
// 基本用法
console.log(path.matchesGlob('/foo/bar', '/foo/*'))      // true
console.log(path.matchesGlob('/foo/bar*', 'foo/bird'))   // false
console.log(path.matchesGlob('file.txt', '*.txt'))       // true
console.log(path.matchesGlob('image.png', '*.{jpg,png}')) // true

// 实际应用 - 文件过滤
function filterFilesByPattern(files, pattern) {
  return files.filter(file => path.matchesGlob(file, pattern))
}

const files = [
  'index.js',
  'style.css',
  'image.png',
  'document.pdf',
  'config.json',
  'test.spec.js'
]

const jsFiles = filterFilesByPattern(files, '*.js')
const testFiles = filterFilesByPattern(files, '*.spec.*')
const imageFiles = filterFilesByPattern(files, '*.{png,jpg,gif}')

console.log('JavaScript 文件:', jsFiles)
console.log('测试文件:', testFiles)
console.log('图像文件:', imageFiles)
```

## 6. 平台特定操作

### 🔗 path.delimiter - 路径分隔符

提供特定于平台的路径分隔符：

```javascript
// POSIX 系统
console.log(process.env.PATH)
// 输出: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

console.log(process.env.PATH.split(path.delimiter))
// 输出: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']

// Windows 系统
console.log(process.env.PATH)
// 输出: 'C:\\Windows\\system32;C:\\Windows;C:\\Program Files\\node\\'

console.log(process.env.PATH.split(path.delimiter))
// 输出: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']

// 实际应用 - 环境变量处理
function getPATHDirectories() {
  const pathVar = process.env.PATH || ''
  return pathVar.split(path.delimiter).filter(Boolean)
}

function addToPATH(newPath) {
  const currentPaths = getPATHDirectories()
  if (!currentPaths.includes(newPath)) {
    currentPaths.push(newPath)
    return currentPaths.join(path.delimiter)
  }
  return process.env.PATH
}

console.log('PATH 目录:', getPATHDirectories())
```

### 🔄 path.sep - 路径分隔符

提供特定于平台的路径片段分隔符：

```javascript
// POSIX 系统
console.log('foo/bar/baz'.split(path.sep))
// 输出: ['foo', 'bar', 'baz']

// Windows 系统
console.log('foo\\bar\\baz'.split(path.sep))
// 输出: ['foo', 'bar', 'baz']

// 实际应用 - 路径片段处理
function getPathSegments(filePath) {
  return filePath.split(path.sep).filter(Boolean)
}

function getPathDepth(filePath) {
  return getPathSegments(filePath).length
}

const testPath = '/home/user/documents/projects/myapp/src/index.js'
console.log('路径片段:', getPathSegments(testPath))
console.log('路径深度:', getPathDepth(testPath))
```

## 7. 跨平台兼容性

### 🌐 统一路径处理

```javascript
// 跨平台路径处理工具
class CrossPlatformPath {
  // 始终使用 POSIX 风格
  static toPosix(inputPath) {
    return path.posix.normalize(inputPath.replace(/\\/g, '/'))
  }
  
  // 始终使用 Windows 风格
  static toWindows(inputPath) {
    return path.win32.normalize(inputPath.replace(/\//g, '\\'))
  }
  
  // 转换为当前平台格式
  static toCurrentPlatform(inputPath) {
    return path.normalize(inputPath)
  }
  
  // 获取统一的基本名称
  static getBasename(inputPath) {
    // 同时处理两种分隔符
    return path.posix.basename(inputPath.replace(/\\/g, '/'))
  }
  
  // 安全的路径连接
  static safeJoin(...segments) {
    return path.normalize(path.join(...segments))
  }
}

// 使用示例
const mixedPath = 'C:\\Users\\张三/Documents/项目\\src/index.js'
console.log('原路径:', mixedPath)
console.log('POSIX 格式:', CrossPlatformPath.toPosix(mixedPath))
console.log('Windows 格式:', CrossPlatformPath.toWindows(mixedPath))
console.log('当前平台:', CrossPlatformPath.toCurrentPlatform(mixedPath))
console.log('文件名:', CrossPlatformPath.getBasename(mixedPath))
```

## 8. 实际应用案例

### 📁 文件系统工具类

```javascript
const fs = require('node:fs')
const path = require('node:path')

class FileSystemHelper {
  constructor(basePath = process.cwd()) {
    this.basePath = path.resolve(basePath)
  }
  
  // 创建嵌套目录
  async ensureDirectory(relativePath) {
    const fullPath = path.join(this.basePath, relativePath)
    await fs.promises.mkdir(fullPath, { recursive: true })
    return fullPath
  }
  
  // 列出目录内容
  async listDirectory(relativePath = '.') {
    const fullPath = path.join(this.basePath, relativePath)
    const items = await fs.promises.readdir(fullPath, { withFileTypes: true })
    
    return items.map(item => ({
      name: item.name,
      path: path.join(relativePath, item.name),
      fullPath: path.join(fullPath, item.name),
      isDirectory: item.isDirectory(),
      isFile: item.isFile(),
      extension: item.isFile() ? path.extname(item.name) : null
    }))
  }
  
  // 查找文件
  async findFiles(pattern, directory = '.') {
    const files = await this.listDirectory(directory)
    const matchingFiles = []
    
    for (const file of files) {
      if (file.isFile && path.matchesGlob(file.name, pattern)) {
        matchingFiles.push(file)
      }
      
      if (file.isDirectory) {
        const subFiles = await this.findFiles(pattern, file.path)
        matchingFiles.push(...subFiles)
      }
    }
    
    return matchingFiles
  }
  
  // 复制文件
  async copyFile(sourcePath, targetPath) {
    const fullSourcePath = path.join(this.basePath, sourcePath)
    const fullTargetPath = path.join(this.basePath, targetPath)
    
    // 确保目标目录存在
    await this.ensureDirectory(path.dirname(targetPath))
    
    await fs.promises.copyFile(fullSourcePath, fullTargetPath)
    return fullTargetPath
  }
  
  // 移动文件
  async moveFile(sourcePath, targetPath) {
    const fullSourcePath = path.join(this.basePath, sourcePath)
    const fullTargetPath = path.join(this.basePath, targetPath)
    
    // 确保目标目录存在
    await this.ensureDirectory(path.dirname(targetPath))
    
    await fs.promises.rename(fullSourcePath, fullTargetPath)
    return fullTargetPath
  }
  
  // 获取文件信息
  async getFileInfo(relativePath) {
    const fullPath = path.join(this.basePath, relativePath)
    const stats = await fs.promises.stat(fullPath)
    const parsed = path.parse(fullPath)
    
    return {
      path: relativePath,
      fullPath: fullPath,
      name: parsed.name,
      extension: parsed.ext,
      directory: path.relative(this.basePath, parsed.dir),
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    }
  }
  
  // 计算相对路径
  getRelativePath(targetPath) {
    const absoluteTarget = path.resolve(targetPath)
    return path.relative(this.basePath, absoluteTarget)
  }
}

// 使用示例
async function fileSystemExample() {
  const helper = new FileSystemHelper('./project')
  
  try {
    // 创建目录结构
    await helper.ensureDirectory('src/components')
    await helper.ensureDirectory('src/utils')
    await helper.ensureDirectory('dist')
    
    // 查找 JavaScript 文件
    const jsFiles = await helper.findFiles('*.js', 'src')
    console.log('找到的 JS 文件:', jsFiles)
    
    // 获取文件信息
    const info = await helper.getFileInfo('src/index.js')
    console.log('文件信息:', info)
    
    // 复制文件
    await helper.copyFile('src/index.js', 'dist/index.js')
    
  } catch (error) {
    console.error('文件系统操作失败:', error)
  }
}
```

### 🔧 构建工具路径处理

```javascript
class BuildPathManager {
  constructor(projectRoot, buildConfig) {
    this.projectRoot = path.resolve(projectRoot)
    this.config = {
      srcDir: 'src',
      distDir: 'dist',
      assetsDir: 'assets',
      ...buildConfig
    }
  }
  
  // 获取源文件路径
  getSrcPath(...segments) {
    return path.join(this.projectRoot, this.config.srcDir, ...segments)
  }
  
  // 获取输出路径
  getDistPath(...segments) {
    return path.join(this.projectRoot, this.config.distDir, ...segments)
  }
  
  // 获取资源路径
  getAssetsPath(...segments) {
    return path.join(this.projectRoot, this.config.assetsDir, ...segments)
  }
  
  // 转换源文件路径到输出路径
  transformSrcToDist(srcPath) {
    const relativePath = path.relative(this.getSrcPath(), srcPath)
    return this.getDistPath(relativePath)
  }
  
  // 生成哈希文件名
  generateHashedFilename(originalPath, hash) {
    const parsed = path.parse(originalPath)
    const hashedName = `${parsed.name}.${hash}${parsed.ext}`
    return path.join(parsed.dir, hashedName)
  }
  
  // 获取所有入口文件
  getEntryFiles() {
    const entries = {}
    const entryPatterns = ['index.js', 'main.js', 'app.js']
    
    entryPatterns.forEach(pattern => {
      const entryPath = this.getSrcPath(pattern)
      if (fs.existsSync(entryPath)) {
        const name = path.basename(pattern, path.extname(pattern))
        entries[name] = entryPath
      }
    })
    
    return entries
  }
}

// 使用示例
const buildManager = new BuildPathManager('./my-project', {
  srcDir: 'source',
  distDir: 'build',
  assetsDir: 'public'
})

console.log('源文件路径:', buildManager.getSrcPath('components', 'Button.js'))
console.log('输出路径:', buildManager.getDistPath('js', 'bundle.js'))
console.log('资源路径:', buildManager.getAssetsPath('images', 'logo.png'))
```

## 9. 性能优化和最佳实践

### 🚀 路径操作优化

```javascript
class OptimizedPathOperations {
  constructor() {
    this.cache = new Map()
  }
  
  // 缓存路径解析结果
  cachedResolve(inputPath) {
    if (this.cache.has(inputPath)) {
      return this.cache.get(inputPath)
    }
    
    const resolved = path.resolve(inputPath)
    this.cache.set(inputPath, resolved)
    return resolved
  }
  
  // 批量路径处理
  batchNormalize(paths) {
    return paths.map(p => path.normalize(p))
  }
  
  // 高效的路径匹配
  matchMultiplePatterns(filePath, patterns) {
    return patterns.some(pattern => path.matchesGlob(filePath, pattern))
  }
  
  // 清理缓存
  clearCache() {
    this.cache.clear()
  }
}

// 使用示例
const optimizer = new OptimizedPathOperations()

const paths = [
  './src/../src/components/Button.js',
  './src/utils/../utils/helpers.js',
  './dist/./js/bundle.js'
]

const normalized = optimizer.batchNormalize(paths)
console.log('批量标准化:', normalized)
```

### 🎯 最佳实践

::: tip 💡 路径处理最佳实践

1. **使用 path.join() 而非字符串拼接**：确保跨平台兼容性
2. **路径比较前先标准化**：使用 path.normalize() 处理路径
3. **检查路径类型**：使用 path.isAbsolute() 判断路径类型
4. **缓存解析结果**：避免重复的路径解析操作
5. **使用相对路径**：提高代码的可移植性
6. **错误处理**：路径操作可能失败，需要适当的错误处理
7. **安全性考虑**：验证路径，防止路径穿越攻击
8. **性能优化**：对于大量路径操作，考虑批处理

:::

## 10. 相关资源

- [Node.js path 官方文档](https://nodejs.org/api/path.html)
- [Node.js URL 模块文档](https://nodejs.org/api/url.html)
- [跨平台路径处理指南](https://nodejs.org/en/knowledge/file-system/how-to-work-with-different-filesystems/)

---

::: warning 🚨 注意事项
- 不同操作系统的路径分隔符不同
- 路径操作不会检查文件是否实际存在
- 使用 path.resolve() 时要注意当前工作目录
- Windows 路径可能包含驱动器字母
- 避免硬编码路径分隔符
:::
