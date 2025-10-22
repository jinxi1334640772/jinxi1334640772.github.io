#!/usr/bin/env sh

###############################################################################
# VitePress 自动化部署脚本
# 
# 功能说明：
#   - 构建 VitePress 静态站点
#   - 自动推送到 Gitee 和 GitHub Pages
#   - 创建 .nojekyll 文件避免 Jekyll 构建
#
# 使用方法：
#   bash deploy.sh
#
# 作者: zhangjinxi
# 最后更新: 2025年
###############################################################################

# 错误处理：遇到错误立即退出
set -e

echo "======================================"
echo "🚀 开始构建 VitePress 站点..."
echo "======================================"

# 1. 生成静态文件
echo "📦 正在构建项目..."
npm run build

# 2. 进入构建输出目录
echo "📂 进入构建目录..."
cd docs/.vitepress/dist

# 3. 创建 .nojekyll 文件（防止 GitHub Pages 使用 Jekyll 构建）
echo "📝 创建 .nojekyll 文件..."
touch .nojekyll

# 4. 初始化 Git 仓库
echo "🔧 初始化 Git 仓库..."
git init
git add -A
git commit -m 'deploy: 自动部署更新'
git branch -M master

# 5. 推送到远程仓库
echo "🚀 推送到 Gitee Pages..."
git push -f "https://gitee.com/myPrettyCode/vitepress.git" master:deploy

echo "🚀 推送到 GitHub Pages..."
git push -f "https://github.com/jinxi1334640772/jinxi1334640772.github.io.git" master:deploy

# 6. 返回项目根目录
cd -

echo "======================================"
echo "✅ 部署成功！站点已更新"
echo "======================================"
echo ""
echo "📍 访问地址："
echo "   - Gitee:  https://myprettycode.gitee.io/vitepress"
echo "   - GitHub: https://jinxi1334640772.github.io"
echo ""
