---
title: 🧭 Vue Router 路由管理完全指南
description: Vue 官方客户端路由解决方案，支持嵌套路由、动态路由、路由守卫等功能，让构建单页应用变得轻而易举
outline: deep
---

# 🧭 Vue Router 路由管理完全指南

> Vue Router 是 Vue 官方的客户端路由解决方案，与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。

::: info 🌟 核心特性
- **嵌套路由映射** - 支持多层级路由结构
- **动态路由选择** - 灵活的路由参数配置
- **模块化配置** - 基于组件的路由配置
- **导航控制** - 细致的导航守卫机制
- **多种模式** - HTML5 history 模式或 hash 模式
:::

## 🎯 路由作用与原理

客户端路由的作用是在单页应用 (SPA) 中将浏览器的 URL 和用户看到的内容绑定起来。当用户在应用中浏览不同页面时，URL 会随之更新，但页面不需要从服务器重新加载。

Vue Router 基于 Vue 的组件系统构建，你可以通过配置路由来告诉 Vue Router 为每个 URL 路径显示哪些组件。

### 🚀 核心功能

| 功能 | 描述 | 应用场景 |
|------|------|----------|
| **嵌套路由映射** | 支持多层级路由结构 | 复杂页面布局 |
| **动态路由选择** | 参数化路由配置 | 用户详情页、文章页 |
| **模块化配置** | 基于组件的路由配置 | 大型应用组织 |
| **路由参数** | 查询、通配符支持 | 数据传递 |
| **过渡效果** | Vue.js 过渡系统集成 | 页面切换动画 |
| **导航控制** | 细致的导航守卫 | 权限控制、数据预加载 |
| **CSS 类激活** | 自动激活 CSS 类的链接 | 导航高亮 |
| **滚动行为** | 可定制的滚动行为 | 用户体验优化 |
| **URL 编码** | 正确的 URL 编码处理 | 特殊字符支持 |

## 📦 安装与设置

### 安装最新版 Vue Router

```bash
# 使用 pnpm
pnpm create vue-router@4

# 使用 yarn
yarn create vue-router@4

# 使用 npm
npm create vue-router@4
```

## 🛠️ 创建路由器

### 🔧 动态路由参数语法

| 语法 | 说明 | 示例 | 匹配路径 |
|------|------|------|----------|
| `:param` | 动态参数 | `/user/:id` | `/user/123` |
| `:param?` | 可选参数 | `/users/:userId?` | `/users`, `/users/posva` |
| `:param(正则)` | 正则匹配 | `/users/:userId(\\d+)?` | `/users`, `/users/42` |
| `*` | 匹配任意多个 | `/:chapters+` | `/one`, `/one/two/three` |
| `+` | 至少一个 | `/:chapters(\\d+)+` | `/1`, `/1/2` |

### 📋 路由配置示例

```javascript
import { createMemoryHistory, createRouter } from "vue-router";
import HomeView from "./HomeView.vue";

// 懒加载组件
const UserDetails = () => import('./views/UserDetails.vue');
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue');

const routes = [
  {
    path: "/user/:id",
    component: User,
    children: [
      {
        // 命名路由，名字必须唯一
        name: "userhome",
        
        // 路径配置示例
        path: "",                           // 当 /user/:id 匹配成功，忽略父组件User
        path: "/users/:userId?",            // /users 和 /users/posva
        path: "/users/:userId(\\d+)?",      // /users 和 /users/42
        path: "/:chapters+",                // /one, /one/two, /one/two/three等
        path: "/:chapters(\\d+)+",          // /1, /1/2等
        path: "/user-:afterUser(.*)",       // `/user-` 开头

        // 别名配置
        alias: '/home',
        alias: ['/people', 'list'],
        alias: ['/:id', ''],

        // 重定向配置
        redirect: "pathname",               // 相对path：/user/:id/pathname
        redirect: { name: "homepage" },
        redirect: to => {
          return { path: "/search", query: { q: to.params.searchText } };
        },

        // Props 配置
        props: true,                        // 是否启用组件props
        // 对于有命名视图的路由,为每个命名视图定义 props
        props: { default: true, sidebar: false },
        props: { name: 'zhang', age: 12 },
        props: route => ({ query: route.query.q }),

        // 路由元信息
        meta: { required: true, cache: true },

        // 大小写敏感
        sensitive: true,                    // 启用大小写敏感模式

        // 命名视图
        components: {
          default: Home,
          LeftSidebar,
          RightSidebar,
        },

        // 路由守卫
        beforeEnter: (to, from) => {
          // return { path: to.path, query: to.query, hash: '' }
          return false; // 拒绝导航
        },
        beforeEnter: [removeQueryParams, removeHash], // 函数组
      }
    ],
  },
];
```

### 🏗️ 路由器实例化

```javascript
/**
 * createRouter 创建路由器
 * @history 历史模式配置
 *   createWebHashHistory() - hash模式
 *   createWebHistory() - history模式，需要服务端配置
 *   createMemoryHistory() - memory模式：适合 Node 环境和 SSR
 */
const router = createRouter({
  history: createMemoryHistory(),
  
  // 严格匹配模式 默认能匹配带有或不带有尾部斜线的路由
  strict: true,
  
  // CSS 类配置
  linkActiveClass: 'border-indigo-500',
  linkExactActiveClass: 'border-indigo-700',
  
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return {
      el: '#main',              // el: document.getElementById('main'),
      top: 10,                  // 在元素#main上 10 像素
      behavior: 'smooth',
    };
  },
  
  routes,
});
```

## 🛡️ 路由守卫

### 🌐 全局守卫

```javascript
// 在守卫内的全局注入
const app = createApp(App);
app.provide('global', 'hello injections');

// 全局前置守卫：当一个导航触发时，按照创建顺序调用
router.beforeEach(async (to, from, next) => {
  const global = inject('global'); // 'hello injections'

  const canAccess = await canUserAccess(to);
  if (!canAccess) return '/login';

  // 检查用户是否已登录 & 避免无限重定向
  if (!isAuthenticated && to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }

  return false; // 返回 false 以取消导航
});

// 全局解析守卫：在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用
router.beforeResolve(async (to, from, next) => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission();
    } catch (error) {
      // 意料之外的错误，取消导航并把错误传给全局处理器
      throw error;
    }
  }
});

// 全局后置钩子：导航确认之后。可用于分析、更改页面标题、声明页面等
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath);
});
```

### 🔧 守卫类型对比

| 守卫类型 | 触发时机 | 主要用途 | 示例场景 |
|----------|----------|----------|----------|
| **beforeEach** | 导航触发时 | 权限验证、登录检查 | 用户认证 |
| **beforeResolve** | 组件解析后 | 数据预加载、权限确认 | 摄像头权限 |
| **afterEach** | 导航确认后 | 分析统计、页面标题 | 埋点统计 |

### 🌐 Nginx 配置 (History 模式)

```nginx
# history模式，nginx配置，全部重定向到index.html
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔌 注册路由器

路由器插件的职责包括：

- 全局注册 `RouterView` 和 `RouterLink` 组件
- 添加全局 `$router` 和 `$route` 属性
- 启用 `useRouter()` 和 `useRoute()` 组合式函数
- 触发路由器解析初始路由

```javascript
createApp(App).use(router).mount("#app");
```

## 🎨 使用路由器

### 📱 RouterView 组件

```vue
<template>
  <!-- 命名视图 -->
  <router-view class="view left-sidebar" name="LeftSidebar" />
  
  <!-- 插槽用法 -->
  <RouterView v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <component
        :is="Component"
        :key="route.path"
        view-prop="把参数传递给路由组件" />
    </transition>
  </RouterView>
  
  <router-view class="view right-sidebar" name="RightSidebar" />
</template>
```

### 🔗 RouterLink 组件

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <RouterLink to="/user/erina">路由连接</RouterLink>
    
    <!-- 高级用法 -->
    <RouterLink
      v-bind="$props"
      to="/user/admin"
      activeClass="border-indigo-500"
      exactActiveClass="border-indigo-700"
      v-slot="{ isActive, href, navigate }">
      <!-- to和编程式导航参数相同 -->
      <a :href="href" @click="navigate" :class="{ active: isActive }">
        管理员页面
      </a>
    </RouterLink>
  </div>
</template>
```

### 🎛️ 编程式导航

```javascript
// 组合式 API
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 导航方法
    const navigateToUser = (userId) => {
      // 字符串路径
      router.push('/users/eduardo');
      
      // 对象形式
      router.push({ path: '/users/eduardo' });
      
      // 命名路由
      router.push({ name: 'user', params: { username: 'eduardo' } });
      
      // 带查询参数
      router.push({ path: '/register', query: { plan: 'private' } });
      
      // 带哈希
      router.push({ path: '/about', hash: '#team' });
    };

    // 替换当前路由
    const replaceRoute = () => {
      router.replace({ path: '/home' });
    };

    // 历史导航
    const goBack = () => {
      router.go(-1); // 后退一步
      router.back(); // 等同于 go(-1)
      router.forward(); // 前进一步
    };

    return {
      navigateToUser,
      replaceRoute,
      goBack,
      // 当前路由信息
      currentRoute: route
    };
  }
};
```

## 🎯 路由参数与查询

### 📋 参数类型

| 参数类型 | 获取方式 | 示例 | 说明 |
|----------|----------|------|------|
| **路径参数** | `route.params` | `/user/123` → `{ id: '123' }` | URL 路径中的动态部分 |
| **查询参数** | `route.query` | `?name=john&age=25` → `{ name: 'john', age: '25' }` | URL 查询字符串 |
| **哈希** | `route.hash` | `#section` → `'#section'` | URL 片段标识符 |

### 🔄 响应路由参数变化

```javascript
// 组合式 API
import { watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    // 监听路由参数变化
    watch(
      () => route.params.id,
      (newId, oldId) => {
        // 响应路由参数的变化...
        fetchUser(newId);
      }
    );

    // 监听整个路由对象
    watch(route, (to, from) => {
      console.log('路由发生变化', to, from);
    });
  }
};
```

## 🎨 最佳实践

### 🏗️ 路由组织结构

```javascript
// 推荐的路由文件组织
src/
├── router/
│   ├── index.js          // 主路由文件
│   ├── modules/          // 路由模块
│   │   ├── user.js
│   │   ├── admin.js
│   │   └── public.js
│   └── guards/           // 路由守卫
│       ├── auth.js
│       └── permission.js
```

### 🛡️ 权限控制模式

```javascript
// 基于角色的权限控制
const authGuard = (to, from, next) => {
  const requiredRole = to.meta.role;
  const userRole = getUserRole();

  if (requiredRole && !hasPermission(userRole, requiredRole)) {
    next('/403'); // 无权限页面
  } else {
    next();
  }
};

// 路由配置
{
  path: '/admin',
  component: AdminLayout,
  meta: { role: 'admin' },
  beforeEnter: authGuard
}
```

### 🔄 懒加载优化

```javascript
// 路由级别代码分割
const routes = [
  {
    path: '/about',
    // 懒加载
    component: () => import('../views/About.vue')
  },
  {
    path: '/user',
    // 分组懒加载
    component: () => import(
      /* webpackChunkName: "user-group" */ 
      '../views/User.vue'
    )
  }
];
```

::: tip 💡 性能优化建议
1. **合理使用懒加载** - 避免首屏加载过多资源
2. **路由预加载** - 使用 `webpackPrefetch` 预加载可能访问的路由
3. **缓存策略** - 合理配置路由组件的缓存策略
4. **守卫优化** - 避免在守卫中执行耗时操作
:::

## 📚 扩展阅读

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue 3 组合式 API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
- [单页应用路由原理](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)