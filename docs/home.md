---
layout: home
title: VitePress 技术文档站点
titleTemplate: 专业的前端技术知识库

hero:
  name: 💻 VitePress 技术文档
  text: 🚀 现代化前端知识库
  tagline: 📚 专注技术分享 · 免费开源维护 · 持续更新迭代
  image:
    src: /images/hello.svg
    alt: 技术文档站点 Logo
  actions:
    - theme: brand
      text: 🎯 开始探索
      link: /frontEnd/css/dom
    - theme: alt
      text: 📖 查看文档
      link: /frontEnd/javascript/
    - theme: alt
      text: 🔗 GitHub
      link: https://github.com/jinxi1334640772

features:
  - icon: 🎨
    title: 全面的技术栈
    details: 涵盖前端、后端、网络工程、开发工具等多个技术领域，从基础到进阶的完整知识体系
  - icon: 🚀
    title: 现代化技术
    details: 基于 Vue 3 + TypeScript + Vite 构建，采用最新的前端技术栈和开发理念
  - icon: 📱
    title: 响应式设计
    details: 完美适配桌面端和移动端，提供一致的阅读体验，随时随地学习技术知识
  - icon: 🔍
    title: 智能搜索
    details: 内置本地搜索功能，支持全文检索，快速定位所需技术内容
  - icon: 🎯
    title: 实战导向
    details: 注重实际应用，提供大量可运行的代码示例和最佳实践案例
  - icon: 🌐
    title: 持续更新
    details: 跟踪最新技术趋势，定期更新内容，确保技术文档的时效性和准确性
  - icon: 🛠️
    title: 开发工具
    details: 详细介绍各种开发工具的使用方法，提升开发效率和代码质量
  - icon: 📊
    title: 性能优化
    details: 深入解析前端性能优化策略，帮助开发者构建高性能的Web应用
  - icon: 🔧
    title: 工程化实践
    details: 分享现代前端工程化的最佳实践，从构建工具到部署流程的完整指南
---

<style scoped>
/* Hero 区域样式定制 */
:root {
  /* 标题渐变色 */
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  /* 背景图片效果 */
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

/* 响应式模糊效果 */
@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

## 🌟 技术栈概览

<div class="tech-stack-grid">

### 🎨 前端技术
- **基础技术**: HTML5 · CSS3 · JavaScript ES6+ · TypeScript
- **框架生态**: Vue 2/3 · React · Angular · Svelte
- **构建工具**: Webpack · Vite · Rollup · Parcel
- **UI 框架**: Element Plus · Ant Design · Tailwind CSS · Bootstrap
- **状态管理**: Vuex · Pinia · Redux · MobX

### ⚙️ 后端技术
- **运行时**: Node.js · Deno · Bun
- **框架**: Express · Koa · Nest.js · Fastify · Egg.js
- **数据库**: MongoDB · MySQL · PostgreSQL · Redis
- **服务器**: Nginx · Apache · Docker · Kubernetes

### 🛠️ 开发工具
- **版本控制**: Git · GitHub · GitLab
- **构建部署**: Jenkins · GitHub Actions · Docker
- **代码质量**: ESLint · Prettier · Husky · Lint-staged
- **测试工具**: Jest · Cypress · Vitest · Playwright

### 📱 跨端开发
- **移动端**: uni-app · Taro · React Native · Flutter
- **桌面端**: Electron · Tauri · PWA
- **小程序**: 微信 · 支付宝 · 抖音 · 百度小程序

</div>

## 📈 内容统计

<div class="stats-container">
  <div class="stat-item">
    <div class="stat-number">500+</div>
    <div class="stat-label">技术文档</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">1000+</div>
    <div class="stat-label">代码示例</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">50+</div>
    <div class="stat-label">技术栈</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">100+</div>
    <div class="stat-label">实用工具</div>
  </div>
</div>

<style scoped>
/* 技术栈网格布局 */
.tech-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.tech-stack-grid h3 {
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand);
}

/* 数据统计容器 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  text-align: center;
}

.stat-item {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: default;
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.2rem;
  opacity: 0.95;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stat-label {
    font-size: 1rem;
  }
}
</style>

## 🎯 学习路线

### 初学者路线
1. **基础知识** → [HTML & CSS](./frontEnd/css/dom.md)
2. **核心语言** → [JavaScript](./frontEnd/javascript/)
3. **框架入门** → [Vue 3 高级开发](./frontEnd/web/vue3-advanced.md)
4. **工程化** → [构建工具](./tools/buildTools/vite.md)

### 进阶路线
1. **深入框架** → [Vue 3 高级特性](./frontEnd/web/vue3-advanced.md)
2. **性能优化** → [前端性能](./performace/performace.md)
3. **跨端开发** → [uni-app](./spanEnd/uniapp/) / [Taro](./spanEnd/Taro/)
4. **全栈开发** → [Node.js](./afterEnd/node/)

### 专家路线
1. **架构设计** → [系统架构](./tools/questions/system.md)
2. **微前端** → [qiankun 实践](./frontEnd/web/qiankun.md)
3. **团队管理** → [项目管理](./tools/stardard/quality.md)
4. **技术分享** → [知识输出](./tools/study.md)

## 🔥 热门文章

- [🚀 Vue 3 高级开发完全指南](./frontEnd/web/vue3-advanced.md)
- [⚡ Vite 构建工具深度解析](./tools/buildTools/vite.md)
- [🎯 前端性能优化最佳实践](./performace/performace.md)
- [🔧 现代前端工程化配置](./tools/buildTools/webpack.md)
- [📱 uni-app 跨端开发实战](./spanEnd/uniapp/)
- [🌐 HTTP 协议深度解析](./network/http/)
- [🛠️ 常用工具库推荐](./tools/package/lodash.md)
- [❓ 前端面试题汇总](./tools/questions/handwrite.md)

## 🤝 参与贡献

欢迎大家参与到这个技术文档项目中来！您可以：

- 🐛 报告问题和Bug
- 📝 提交内容更新和修正
- 💡 提供新的技术文档
- 🌟 给项目一个Star支持

## 📞 联系方式

- 📧 **邮箱**: 1334640772@qq.com
- 🐱 **GitHub**: [@jinxi1334640772](https://github.com/jinxi1334640772)
- 💎 **掘金**: [掘金主页](https://juejin.cn/user/1451011080204040)
- 🌐 **个人网站**: [https://jinxi1334640772.github.io](https://jinxi1334640772.github.io)

---

::: tip 💡 小贴士
这个网站是完全开源的，所有内容都可以在 [GitHub](https://github.com/jinxi1334640772/jinxi1334640772.github.io) 上找到。如果你觉得内容有帮助，欢迎给项目一个 ⭐ Star！
:::
