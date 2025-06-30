---
title: 📦 NPM 包管理器完全指南
description: Node.js 包管理器 NPM 的详细使用指南，包括命令详解、版本管理、发布流程等最佳实践
outline: deep
---

# 📦 NPM 包管理器完全指南

> NPM（Node Package Manager）是 Node.js 的默认包管理器，用于发布、安装和管理 JavaScript 包（modules），是现代前端开发不可或缺的工具。

## 🎯 NPM 简介

NPM（Node Package Manager）是 Node.js 的默认包管理器，用于发布、安装和管理 JavaScript 包（modules）。其主要功能包括包管理和发布、依赖管理、版本控制以及脚本执行等。

### ✨ 核心功能

| 功能 | 描述 | 命令示例 |
|------|------|----------|
| **包管理** | 安装、卸载、更新包 | `npm install` |
| **依赖管理** | 管理项目依赖关系 | `npm ls` |
| **版本控制** | 管理包版本号 | `npm version` |
| **脚本执行** | 运行自定义脚本 | `npm run` |
| **包发布** | 发布包到 NPM 仓库 | `npm publish` |

## 🔧 基础命令

### 📋 项目管理

```bash
# 初始化 Node.js 项目
npm init

# 快速初始化（使用默认配置）
npm init -y

# 查看和更改版本号 major.minor.patch V1.2.0
npm version [type]
npm version patch    # 补丁版本 1.0.0 -> 1.0.1
npm version minor    # 次版本 1.0.0 -> 1.1.0
npm version major    # 主版本 1.0.0 -> 2.0.0
```

### 📦 包安装管理

```bash
# 安装依赖包（npm i 简写）
npm install [name]

# 安装选项说明
# -D：--save-dev（开发依赖）
# -S：--save（生产依赖，默认）
# -g：--global（全局安装）

# 示例
npm install vue                    # 安装生产依赖
npm install -D webpack            # 安装开发依赖
npm install -g @vue/cli           # 全局安装

# 安装指定版本
npm install vue@3.2.0
npm install vue@latest
npm install vue@next

# 卸载依赖包
npm uninstall [name]
npm uninstall -D webpack
npm uninstall -g @vue/cli
```

### 🔍 查看和搜索

```bash
# 查看依赖包
npm ls                    # 当前项目依赖树
npm ls --depth=0         # 只显示顶级依赖
npm ls --global          # 全局安装的包

# 查看过时的依赖包
npm outdated

# 搜索 NPM 仓库中的包
npm search [name]

# 查看指定包的详细信息
npm view [name]
npm view vue versions    # 查看所有版本
npm view vue version     # 查看最新版本

# 在 NPM 仓库中浏览包的详细信息
npm explore <package_name>

# 查看当前登录的 NPM 账号信息
npm whoami
```

### 🔄 更新和维护

```bash
# 更新包
npm update [name]        # 更新指定包
npm update              # 更新所有包

# 检查项目中过时的依赖包
npm outdated

# 减少依赖项的冗余，优化项目的依赖树
npm dedupe

# 重建所有的依赖包，解决由于更新 NPM 或 Node 版本导致的依赖问题
npm rebuild

# 检查并修复 NPM 环境中的常见问题
npm doctor
```

### 🚀 脚本执行

```bash
# 运行项目的测试脚本
npm test [scriptName]

# 启动一个 Node.js 应用程序
npm start [scriptName]

# 停止正在运行的 NPM 进程
npm stop [scriptName]

# 运行在 package.json 文件的 scripts 部分定义的脚本
npm run [scriptName]

# 查看所有可用脚本
npm run
```

::: tip 💡 脚本配置示例
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.vue",
    "lint:fix": "eslint src --ext .js,.vue --fix"
  }
}
```
:::

## 📤 发布和账号管理

### 🔑 账号操作

```bash
# 登录 NPM 账号
npm login

# 登出 NPM
npm logout

# 查看当前登录用户
npm whoami
```

### 📦 包发布

```bash
# 打包：生成一个 .tgz 格式的压缩包
npm pack

# 发布包到 NPM 仓库
npm publish

# 发布带标签的版本
npm publish --tag next

# 从 NPM 仓库中删除一个包
npm unpublish <package_name>@<version>
```

### 👥 权限管理

```bash
# 管理包的所有权
npm owner add <user> <package_name>      # 添加所有者
npm owner remove <user> <package_name>   # 移除所有者
npm owner list <package_name>            # 查看所有者

# 设置或修复包的访问权限
npm access public <package_name>         # 设为公开
npm access restricted <package_name>     # 设为私有
npm access list <package_name>           # 列出访问权限
```

## ⚙️ 配置管理

### 🔧 配置命令

```bash
# 查看和设置配置项
npm config set [key] [value]
npm config get [key]
npm config list                # 查看所有配置
npm config delete [key]        # 删除配置

# 常用配置示例
npm config set registry https://registry.npmmirror.com  # 设置镜像源
npm config set proxy http://proxy.company.com:8080     # 设置代理
npm config set https-proxy http://proxy.company.com:8080
```

### 🌍 镜像源配置

```bash
# 临时使用镜像源
npm install --registry https://registry.npmmirror.com

# 永久设置镜像源
npm config set registry https://registry.npmmirror.com

# 验证镜像源
npm config get registry

# 恢复官方源
npm config set registry https://registry.npmjs.org
```

## 🔒 安全和缓存

### 🛡️ 安全检查

```bash
# 检查安全漏洞
npm audit

# 自动修复一些已知的安全问题
npm audit fix

# 强制修复（可能会破坏兼容性）
npm audit fix --force
```

### 💾 缓存管理

```bash
# 清除缓存
npm cache clean --force

# 查看缓存内容
npm cache ls

# 验证缓存的完整性
npm cache verify

# 查看缓存目录
npm config get cache
```

## 🔧 高级功能

### 🔗 链接开发

```bash
# 创建一个符号链接，将本地的包链接到全局 NPM 环境中
npm link

# 在另一个项目中链接本地包
npm link <package_name>

# 取消链接
npm unlink <package_name>
```

### 🏗️ CI/CD 支持

```bash
# 在持续集成环境中安装项目依赖（更快、更可靠）
npm ci

# 只安装生产依赖
npm ci --only=production
```

### 🏷️ 标签管理

```bash
# 管理包的分发标签
npm dist-tag add <package_name>@<version> <tag>
npm dist-tag ls <package_name>
npm dist-tag rm <package_name> <tag>

# 示例
npm dist-tag add my-package@1.0.1 beta
npm dist-tag add my-package@1.0.2 latest
```

## 🎯 Node 版本管理

### 📋 NVM 简介

NVM 是一个来管理 Node.js 的工具，方便我们在开发过程中 Node.js 版本的切换。

::: warning ⚠️ 安装注意
一定要卸载已安装的 NodeJS，否则会发生冲突。然后下载 nvm-windows 最新安装包，直接安装即可。
:::

### 🔧 NVM 命令

```bash
# 安装指定版本
nvm install [版本号]
nvm install 16.14.0
nvm install latest        # 安装最新版本

# 删除指定版本
nvm uninstall [版本号]

# 查看当前安装的版本
nvm list                 # 等于 nvm ls
nvm list installed       # 已安装版本
nvm list available       # 可用版本

# 切换到指定版本
nvm use [版本号]
nvm use 16.14.0

# 查看帮助
nvm -h
```

## 🌐 镜像源管理

### 📋 NRM 简介

NRM（NPM Registry Manager）是 NPM 的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 NPM 源间切换。

### 🔧 NRM 命令

```bash
# 全局安装 NRM 包
npm install -g nrm

# 添加镜像源
nrm add [name] [url]
nrm add taobao https://registry.npmmirror.com

# 查看所有添加的镜像源
nrm ls

# 使用选择的镜像源
nrm use [name]
nrm use taobao

# 删除镜像源
nrm del [name]
nrm del taobao

# 测试镜像源速度
nrm test [name]
```

### 📊 常用镜像源

| 镜像源 | 地址 | 描述 |
|--------|------|------|
| **NPM 官方** | https://registry.npmjs.org | 官方源，国外访问 |
| **淘宝镜像** | https://registry.npmmirror.com | 国内镜像，速度快 |
| **腾讯镜像** | https://mirrors.cloud.tencent.com/npm | 腾讯云镜像 |
| **华为镜像** | https://mirrors.huaweicloud.com/repository/npm | 华为云镜像 |

## ⚡ PNPM 包管理器

### 🎯 PNPM 简介

PNPM 是速度快、节省磁盘空间的软件包管理器。

### ✨ 核心优势

| 优势 | 描述 | 效果 |
|------|------|------|
| **速度快** | 比 NPM 快了近 2 倍 | ⚡ 提升安装效率 |
| **节省空间** | 硬链接共享依赖 | 💾 减少磁盘占用 |
| **Monorepo 支持** | 内置多包管理 | 🏗️ 支持大型项目 |
| **严格依赖** | 非扁平结构 | 🔒 避免幽灵依赖 |

### 🔧 PNPM 命令

```bash
# 安装 PNPM
npm install -g pnpm

# 安装所有依赖
pnpm install

# 安装软件包及其依赖
pnpm add <pkg>
pnpm add -D <pkg>        # 开发依赖
pnpm add -g <pkg>        # 全局安装

# 查看依赖
pnpm list --depth <number>

# 显示依赖于指定包的所有包
pnpm why <pkg> --depth <number>

# 列出已安装包的许可证
pnpm licenses

# 检查过时依赖
pnpm outdated

# 更新依赖
pnpm update

# 删除依赖（别名：rm、uninstall、un）
pnpm remove <pkg>

# 运行脚本
pnpm <cmd>               # 直接运行 scripts 中的命令
pnpm run <cmd>           # 显式运行命令
```

## 📚 最佳实践

### 🎯 版本管理

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 🔒 安全配置

```bash
# 启用审计
npm config set audit-level moderate

# 设置包的最大大小限制
npm config set maxsockets 50

# 设置超时时间
npm config set timeout 300000
```

### 📦 发布清单

- [ ] 更新版本号 `npm version`
- [ ] 运行测试 `npm test`
- [ ] 构建项目 `npm run build`
- [ ] 检查文件 `npm pack --dry-run`
- [ ] 发布包 `npm publish`

::: tip 🎯 总结
NPM 是现代前端开发的基础工具，掌握其核心命令和最佳实践对于提升开发效率至关重要。建议结合 NRM 进行镜像源管理，使用 PNPM 提升包管理性能。
:::

<style scoped>
.tip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
}

table {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

code {
  background: rgba(103, 126, 234, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}
</style>
