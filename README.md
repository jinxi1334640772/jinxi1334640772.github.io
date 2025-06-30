# 💻 VitePress 技术文档站点

<p align="center">
  <img src="https://img.shields.io/badge/VitePress-1.5.0+-646cff?style=for-the-badge&logo=vite" alt="VitePress">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/pnpm-Latest-f69220?style=for-the-badge&logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>专业的前端技术知识库，涵盖现代 Web 开发的各个技术领域</strong>
</p>

## 🌟 项目特色

### ✨ 现代化文档体验
- 🎨 **VitePress 驱动** - 基于 Vite 的快速静态站点生成器
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔍 **全文搜索** - 内置本地搜索，快速定位内容
- 🌙 **深色模式** - 支持明暗主题切换
- 🖼️ **图片灯箱** - 集成 Fancybox 图片预览效果

### 📚 丰富的技术内容
- **500+ 技术文档** - 覆盖前端开发全栈技术
- **1000+ 代码示例** - 实用的代码片段和最佳实践
- **50+ 技术栈** - 从基础到高级的完整学习路径

### 🎯 内容分类

| 分类 | 内容 | 特色 |
|------|------|------|
| 🎨 **前端技术** | CSS、JavaScript、Vue、React | 现代前端开发技术栈 |
| ⚙️ **后端技术** | Node.js、Express、数据库 | 服务端开发解决方案 |
| 🌐 **网络工程** | HTTP、HTTPS、网络安全 | 网络协议和安全实践 |
| 🛠️ **开发工具** | Vite、Webpack、Git | 现代化开发工具链 |
| 📱 **跨端开发** | Taro、uni-app、Electron | 多平台应用开发 |
| ⚡ **性能优化** | 加载优化、渲染优化 | Web 性能最佳实践 |

## 🚀 快速开始

### 📋 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐)

### 🔧 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/vitepress-docs.git
cd vitepress-docs

# 安装依赖
pnpm install
```

### 💻 本地开发

```bash
# 启动开发服务器
pnpm docs:dev

# 访问 http://localhost:5173
```

### 📦 构建部署

```bash
# 构建生产版本
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

## 📁 项目结构

```
vitepress-docs/
├── docs/                          # 文档源码
│   ├── .vitepress/                # VitePress 配置
│   │   ├── config.js              # 站点配置
│   │   └── theme/                 # 自定义主题
│   ├── frontEnd/                  # 前端技术
│   │   ├── css/                   # CSS 相关
│   │   ├── javascript/            # JavaScript 核心
│   │   ├── web/                   # 现代框架
│   │   └── window/                # 浏览器 API
│   ├── afterEnd/                  # 后端技术
│   │   ├── node/                  # Node.js
│   │   ├── express/               # Express 框架
│   │   └── database/              # 数据库
│   ├── network/                   # 网络工程
│   │   ├── http/                  # HTTP 协议
│   │   └── httpSecure/            # 网络安全
│   ├── tools/                     # 开发工具
│   │   ├── buildTools/            # 构建工具
│   │   ├── package/               # 常用包
│   │   └── questions/             # 面试题集
│   ├── spanEnd/                   # 跨端开发
│   │   ├── Taro/                  # Taro 框架
│   │   ├── uniapp/                # uni-app
│   │   └── electron.md            # Electron
│   └── performace/                # 性能优化
├── public/                        # 静态资源
└── package.json                   # 项目配置
```

## 🎨 文档特色

### 📝 统一的文档格式

所有文档都采用现代化的 VitePress 格式：

```markdown
---
title: 文档标题
description: 文档描述
outline: deep
---

# 🎯 文档标题

文档简介和概述内容

::: tip 💡 学习提示
重要的学习建议和注意事项
:::

## 📊 结构化内容

使用表格、代码块、提示框等组件展示内容
```

### 🎯 核心特性

- **📊 丰富的表格** - 结构化展示技术对比和参数说明
- **💡 智能提示框** - tip、warning、danger 等多种提示类型
- **🔗 代码高亮** - 支持多种编程语言的语法高亮
- **🖼️ 图片优化** - 自动压缩和 Fancybox 灯箱效果
- **📱 移动适配** - 完美的移动端阅读体验

## 🛠️ 技术栈

### 🏗️ 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **VitePress** | 1.5.0+ | 静态站点生成 |
| **Vue 3** | 3.4+ | 组件框架 |
| **Vite** | 5.0+ | 构建工具 |
| **TypeScript** | 5.0+ | 类型支持 |

### 🎨 UI 增强

- **Fancybox** - 图片灯箱效果
- **Mermaid** - 流程图和图表
- **Shiki** - 代码语法高亮
- **Algolia** - 搜索功能（可选）

## 📈 内容统计

### 📊 文档数量

- **总文档数**: 500+ 篇
- **代码示例**: 1000+ 个
- **技术栈覆盖**: 50+ 种
- **更新频率**: 持续更新

### 🎯 质量保证

- ✅ **格式统一** - 所有文档采用统一的 VitePress 格式
- ✅ **内容完整** - 从基础到高级的完整知识体系
- ✅ **示例丰富** - 大量实用的代码示例和最佳实践
- ✅ **持续维护** - 定期更新和内容优化

## 🤝 贡献指南

### 📝 文档贡献

1. **Fork** 本仓库
2. **创建**特性分支 (`git checkout -b feature/new-docs`)
3. **编写**符合规范的文档
4. **提交**更改 (`git commit -m 'Add: 新增XXX文档'`)
5. **推送**到分支 (`git push origin feature/new-docs`)
6. **创建** Pull Request

### 📋 文档规范

- 使用统一的 frontmatter 格式
- 添加合适的 emoji 和图标
- 使用表格展示结构化信息
- 提供完整的代码示例
- 添加相关资源链接

### 🎯 提交规范

```bash
# 新增文档
git commit -m "docs: 新增 Vue 3 响应式系统文档"

# 更新文档
git commit -m "docs: 更新 JavaScript 基础语法"

# 修复问题
git commit -m "fix: 修复代码示例错误"

# 格式优化
git commit -m "style: 优化文档格式和排版"
```

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🔗 相关链接

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [MDN Web 文档](https://developer.mozilla.org/)

---

<p align="center">
  <strong>💝 如果这个项目对你有帮助，请给它一个 ⭐ Star！</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/your-username">Your Name</a>
</p>
