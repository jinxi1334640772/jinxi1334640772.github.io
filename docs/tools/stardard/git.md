---
title: Git 版本控制系统
description: Git 分布式版本控制系统使用指南
outline: deep
---

# 🔄 Git 版本控制系统

Git 是一个免费的开源分布式版本控制系统，旨在快速高效地处理项目版本管理。

::: tip 🎯 核心概念
- 分布式版本控制系统
- 快速分支和合并
- 完整的版本历史
- 数据完整性保证
:::

## 🚀 快速开始

### 安装配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/user/repo.git
```

### 基础操作

```bash
# 查看状态
git status

# 添加文件
git add .
git add file.txt

# 提交更改
git commit -m "commit message"

# 查看历史
git log --oneline
```

## 🌿 分支管理

### 分支操作

```bash
# 查看分支
git branch -a

# 创建并切换分支
git checkout -b feature-branch

# 切换分支
git checkout main

# 合并分支
git merge feature-branch

# 删除分支
git branch -d feature-branch
```

### 分支策略

| 分支类型 | 命名规范 | 用途 |
|----------|----------|------|
| `main/master` | 主分支 | 生产环境代码 |
| `develop` | 开发分支 | 开发环境集成 |
| `feature/*` | 功能分支 | 新功能开发 |
| `hotfix/*` | 热修复分支 | 紧急问题修复 |
| `release/*` | 发布分支 | 版本发布准备 |

## 🌐 远程协作

### 远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 推送代码
git push origin main
git push -u origin feature-branch

# 拉取代码
git pull origin main
git fetch origin
```

### 协作流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: add new feature"

# 3. 推送分支
git push origin feature/new-feature

# 4. 创建 Pull Request

# 5. 合并后删除分支
git checkout main
git pull origin main
git branch -d feature/new-feature
```

## 📝 提交规范

### 约定式提交

```bash
<type>(<scope>): <description>

# 类型说明
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建工具
```

### 提交示例

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs: update README installation guide"
```

## 🔧 实用技巧

### 常用别名

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- file.txt

# 撤销暂存区
git reset HEAD file.txt

# 撤销提交
git reset --soft HEAD~1  # 保留修改
git reset --hard HEAD~1  # 丢弃修改

# 反向提交
git revert HEAD
```

### 储藏功能

```bash
# 储藏当前工作
git stash
git stash save "work in progress"

# 查看储藏列表
git stash list

# 应用储藏
git stash apply
git stash pop
```

## 🏷️ 版本标签

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"

# 推送标签
git push origin v1.0.0
git push origin --tags

# 查看标签
git tag -l
git show v1.0.0
```

## 🛠️ 工具推荐

### GUI 工具
- **SourceTree** - 免费的 Git 客户端
- **GitKraken** - 跨平台 Git 工具
- **VS Code** - 内置 Git 支持

### 命令行增强
```bash
# 安装 tig
brew install tig  # macOS
sudo apt install tig  # Ubuntu

# 使用
tig  # 浏览提交历史
tig status  # 查看状态
```

## 📚 最佳实践

### 工作流建议

1. **保持分支简洁** - 功能分支及时合并删除
2. **提交粒度适中** - 一个提交完成一个功能点
3. **提交信息清晰** - 遵循约定式提交规范
4. **定期同步** - 及时拉取远程更新
5. **代码审查** - 使用 Pull Request 进行审查

### 安全注意事项

```bash
# 避免提交敏感信息
echo "*.env" >> .gitignore
echo "node_modules/" >> .gitignore

# 检查提交内容
git diff --staged

# 签名提交（可选）
git config --global commit.gpgsign true
```

## 🔗 学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [Learn Git Branching](https://learngitbranching.js.org/)
- [Atlassian Git 教程](https://www.atlassian.com/git/tutorials)

---

::: tip 💡 小贴士
Git 的学习是一个循序渐进的过程，建议从基础命令开始，逐步掌握分支管理和协作流程。多实践、多思考，很快就能熟练使用！
:::
