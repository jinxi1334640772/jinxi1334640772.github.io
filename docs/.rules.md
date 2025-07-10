# VitePress 技术文档站点开发规则

## 项目概述
- **项目名称**: VitePress 技术文档站点
- **项目类型**: 静态文档生成站点
- **技术栈**: VitePress + Vue 3 + Markdown
- **部署方式**: GitHub Pages / Gitee Pages
- **作者**: zhangjinxi

## 开发规范

### 1. 目录结构规范
```
docs/
├── .vitepress/          # VitePress 配置目录
│   ├── config.js        # 主配置文件
│   ├── cache/          # 开发缓存
│   └── dist/           # 构建输出目录
├── public/             # 静态资源文件
├── frontEnd/           # 前端技术文档
├── afterEnd/           # 后端技术文档  
├── network/            # 网络技术文档
├── tools/              # 开发工具文档
├── spanEnd/            # 跨端开发文档
├── performace/         # 性能优化文档
└── index.md           # 首页
```

### 2. 文档编写规范

#### 2.1 Markdown 文件命名
- 使用英文小写字母和连字符
- 避免使用空格和特殊字符
- 示例: `vue-router.md`, `http-protocol.md`

#### 2.2 文档结构规范
```markdown
# 文档标题

简要描述文档内容...

## 1. 概述
## 2. 安装/配置
## 3. 基本用法
## 4. 高级功能
## 5. 最佳实践
## 6. 常见问题
## 7. 参考资料
```

#### 2.3 代码块规范
- 必须指定语言类型
- 添加适当的注释
- 保持代码格式整洁
```javascript
// 示例代码
function example() {
  console.log('Hello World');
}
```

#### 2.4 图片资源规范
- 调整图片文件位置，统一放在文档所在目录的img目录下
- 命名规范: `image.png`, `image-1.png`
- 使用相对路径引用
- 添加 `data-fancybox="gallery"` 属性支持灯箱效果

### 3. 配置文件规范

#### 3.1 VitePress 配置 (docs/.vitepress/config.js)
- 保持配置结构清晰
- 合理配置导航和侧边栏
- 启用必要的插件和功能
- 配置 SEO 相关信息

#### 3.2 侧边栏配置
- 按技术领域分组
- 保持层级结构清晰
- 使用 `collapsed: false` 展开重要分组

### 4. 开发流程规范

#### 4.1 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

#### 4.2 新增文档流程
1. 在对应目录创建 `.md` 文件
2. 按照文档结构规范编写内容
3. 在 `config.js` 中添加导航配置
4. 本地测试确认无误
5. 提交代码并部署

### 5. Git 提交规范

#### 5.1 提交信息格式
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### 5.2 提交类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化

#### 5.3 示例
```
docs(frontend): 添加Vue3组合式API文档

- 新增Vue3 Composition API使用指南
- 添加相关示例代码
- 更新侧边栏导航配置
```

### 6. 部署规范

#### 6.1 自动部署
- 使用 `deploy.sh` 脚本自动部署
- 构建前清理缓存和输出目录
- 生成 `.nojekyll` 文件避免 GitHub Pages 构建错误

#### 6.2 部署检查清单
- [ ] 配置文件语法正确
- [ ] 所有链接可访问
- [ ] 图片资源正常显示
- [ ] 搜索功能正常
- [ ] 移动端适配良好

### 7. 内容质量规范

#### 7.1 技术准确性
- 确保技术内容准确无误
- 及时更新过时信息
- 提供可运行的示例代码

#### 7.2 文档完整性
- 包含完整的使用说明
- 提供常见问题解答
- 添加相关参考链接

#### 7.3 可读性
- 使用清晰的数字作为标题层级
- 合理使用代码块、表格、列表
- 添加必要的插图说明
- 符合VitePress的Markdown语法
- 符合技术文档的写作规范
- 关键技术进行必要的技术讲解

### 8. 性能优化规范

#### 8.1 构建优化
- 启用代码分割
- 压缩静态资源
- 使用 CDN 加载外部资源

#### 8.2 加载优化
- 图片懒加载
- DNS 预解析
- 资源预加载

### 9. SEO 优化规范

#### 9.1 元数据配置
- 合理设置页面标题
- 添加页面描述
- 配置关键词

#### 9.2 内容优化
- 使用语义化标题
- 保持内容更新频率
- 添加内部链接

### 10. 维护规范

#### 10.1 定期维护
- 检查链接有效性
- 更新依赖包版本
- 清理无用文件

#### 10.2 内容审核
- 定期审核内容准确性
- 移除过时技术文档
- 补充新技术文档

## 工具推荐

### 开发工具
- **编辑器**: VS Code
- **插件**: Vetur, Prettier, ESLint
- **终端**: Windows Terminal

### 辅助工具
- **图片处理**: TinyPNG (压缩)
- **Markdown编辑**: Typora
- **Git工具**: SourceTree

## 常见问题

### Q: 如何添加新的技术分类？
A: 在 `docs/.vitepress/config.js` 的 `sidebar` 配置中添加新的路由配置。

### Q: 图片无法显示怎么办？
A: 检查图片路径是否正确，确保使用相对路径。

### Q: 如何配置代码高亮？
A: VitePress 内置 Shiki 高亮，在代码块中指定语言即可。

### Q: 如何启用搜索功能？
A: 在配置文件中启用 `search: { provider: "local" }`。

## 参考资料

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://markdown.com.cn/)
- [Vue 3 官方文档](https://cn.vuejs.org/)

---

**最后更新**: 2025年
**维护者**: zhangjinxi 