## VueRouter

Vue Router 是 Vue 官方的客户端路由解决方案。

客户端路由的作用是在单页应用 (SPA) 中将浏览器的 URL 和用户看到的内容绑定起来。当用户在应用中浏览不同页面时，URL 会随之更新，但页面不需要从服务器重新加载。

Vue Router 基于 Vue 的组件系统构建，你可以通过配置路由来告诉 Vue Router 为每个 URL 路径显示哪些组件。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。功能包括：

- 嵌套路由映射
- 动态路由选择
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 展示由 Vue.js 的过渡系统提供的过渡效果
- 细致的导航控制
- 自动激活 CSS 类的链接
- HTML5 history 模式或 hash 模式
- 可定制的滚动行为
- URL 的正确编码

安装最新版 VueRouter：

```bash
pnpm create vue-router@4

yarn create vue-router@4

npm create vue-router@4
```

## 创建路由器

支持动态路由参数：

- `:` 动态参数
- `?` 可选参数
- `:var(正则)` 动态参数，正则匹配
- `*` 匹配任意多个 path
- `+` 至少一个 path

```js
import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "./HomeView.vue";
const UserDetails = () => import('./views/UserDetails.vue')
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')

const routes = [
  {
    path: "/user/:id",
    component: User,
    children: [
      {
        name: "userhome",//命名路由，名字必须唯一

        path: "",// 当 /user/:id 匹配成功 ，忽略父组件User
        path: "/users/:userId?",// /users 和 /users/posva
        path: "/users/:userId(\\d+)?",// /users 和 /users/42
        path: "/:chapters+",// /one, /one/two, /one/two/three等
        path: "/:chapters(\\d+)+",// /1, /1/2等
        path: "/user-:afterUser(.*)",// `/user-` 开头

        alias: '/home',
        alias: ['/people', 'list'],
        alias: ['/:id', ''],

        redirect: "pathname",//重定向：相对path：/user/:id/pathname
        redirect: { name: "homepage" },
        redirect: to => {
          return { path: "/search", query: { q: to.params.searchText } };
        },

        props: true, // 是否启用组件props
        //对于有命名视图的路由,为每个命名视图定义 props
        props: { default: true, sidebar: false },
        props: { name: 'zhang',age:12 },
        props: route => ({ query: route.query.q }),

        meta:{required:true,cache:true},

        // 默认不区分大小写。sensitive：true，启用大小写敏感模式
        sensitive: true,

        // 使用命名视图时，与 `<router-view>` 上的 `name` 属性匹配
        components: {
          default: Home,
          LeftSidebar,
          RightSidebar,
        },

        // 只在进入路由时触发
        beforeEnter: (to, from) => {
          // return { path: to.path, query: to.query, hash: '' }
          return false // 拒绝导航
        },
        beforeEnter: [removeQueryParams, removeHash],//函数组
      }
    ],
  },
]
/** createRouter创建路由器
 *  @history
 *    createWebHashHistory() hash模式
 *    createWebHistory()  history模式，需要服务端配置
 *    createMemoryHistory() memory模式：不会假定自己处于浏览器环境，
 * 因此不会与 URL 交互也不会自动触发初始导航。适合 Node 环境和 SSR
 */
const router = createRouter({
  history: createMemoryHistory(),
  //严格匹配模式 默认能匹配带有或不带有尾部斜线的路由
  strict: true,
  linkActiveClass: 'border-indigo-500',
  linkExactActiveClass: 'border-indigo-700',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return {
      el: '#main',// el: document.getElementById('main'),
      top: 10, // 在元素#main上 10 像素
      behavior: 'smooth',
     }
  },
  routes,
});

//在守卫内的全局注入
const app = createApp(App)
app.provide('global', 'hello injections')

//全局前置守卫:当一个导航触发时，按照创建顺序调用
router.beforeEach(async (to, from,next) => {
  const global = inject('global') // 'hello injections'

  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'

     // 检查用户是否已登录 & 避免无限重定向
  if (!isAuthenticated && to.name !== 'Login') next({ name: 'Login' })
  else next()

  return false // 返回 false 以取消导航
})
// 全局解析守卫:在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用
router.beforeResolve(async (to ,form,next)=> {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
    }
  }
})
//全局后置钩子:导航确认之后。可用于分析、更改页面标题、声明页面等
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})

// history模式，nginx配置，全部重定向到index.html
location / {
  try_files $uri $uri/ /index.html;
}
```

## 注册路由器

路由器插件的职责包括：

- 全局注册 RouterView 和 RouterLink 组件。
- 添加全局 $router 和 $route 属性。
- 启用 useRouter() 和 useRoute() 组合式函数。
- 触发路由器解析初始路由。

```js
createApp(App).use(router).mount("#app");
```

## 使用路由器

```vue
<template>
  <router-view class="view left-sidebar" name="LeftSidebar" />
  <RouterView v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <component
        :is="Component"
        :key="route.path"
        view-prop="把参数传递给路由组件" />
    </transition>
  </RouterView>
  <router-view class="view right-sidebar" name="RightSidebar" />

  <div>
    <RouterLink to="/user/erina"> 路由连接 </RouterLink>
    <RouterLink
      v-bind="$props"
      to="/user/admin"
      activeClass="border-indigo-500"
      exactActiveClass="border-indigo-700"
      v-slot="{ isActive, href, navigate }">
      to和编程式导航参数相同
    </RouterLink>
  </div>
</template>

<script setup>
import {
  useRoute,
  useRouter,
  beforeRouteEnter,
  onBeforeRouteLeave,
  onBeforeRouteUpdate ,
  RouterLink, useLink,
  NavigationFailureType,
  isNavigationFailure
} from "vue-router";

// 路由组件参数转为props
const props = defineProps({
  ...RouterLink.props,
  inactiveClass: String,
})

defineOptions({
  inheritAttrs: false,
})


const {
  // 解析出来的路由对象
  route,
  // 用在链接里的 href
  href,
  // 布尔类型的 ref 标识链接是否匹配当前路由
  isActive,
  // 布尔类型的 ref 标识链接是否严格匹配当前路由
  isExactActive,
  // 导航至该链接的函数
  navigate
  //接收一个类似 RouterLink 所有 prop 的响应式对象
} = useLink(props)

const isExternalLink = computed(
  () => typeof props.to === 'string' && props.to.startsWith('http')
)

const router = useRouter(); // 获取路由器
const route = useRoute(); // 获取当前路由对象

/** 试图离开未保存的编辑文本界面，导航故障类型：
 * aborted 在导航守卫中返回 false 中断了本次导航。
 * cancelled 在当前导航完成之前又有了一个新的导航
 * duplicated 导航被阻止，因为已经在目标位置了
 */
const failure = await router.push('/articles/2')
if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  showToast('You have unsaved changes, discard and leave anyway?')
}
router.push({
  name: "NotFound",
  path: "/notfount/nde", //如果提供了 path，params 会被忽略
  // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
  params: { pathMatch: route.path.substring(1).split("/") },
  // 保留现有的查询和 hash 值，如果有的话
  query: route.query,
  hash: route.hash,
});

// 向前移动一条记录，与 router.forward() 相同
router.go(1);
// 返回一条记录，与 router.back() 相同
router.go(-1);
//覆盖当前路由，并跳转新的路由
router.replace({ query: { search } });

watch(
  () => route.params.id,
  (newId, oldId) => {
    // 对路由变化做出响应...
  }
);

  beforeRouteEnter(to, from,next) {
    // 在渲染该组件的对应路由被验证前调用
    // 此时组件实例还没被创建！不能获取组件实例 `this`
    next(vm => {
    // 可以给next传递回调，并通过 `vm` 访问组件实例
  })
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用，可以访问this
    this.name = to.params.name
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    const answer = window.confirm('确定离开当前页面吗？')
    if (!answer) return false //拒绝离开页面
  },

// 给定 { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: "chapters", params: { chapters: [] } }).href;
// 产生 /
router.resolve({ name: "chapters", params: { chapters: ["a", "b"] } }).href;
// 产生 /a/b

// 给定 { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: "chapters", params: { chapters: [] } }).href;
// 抛出错误，因为 `chapters` 为空
</script>
```

## 动态路由

在应用程序已经运行的时候添加或删除路由。动态路由主要通过两个函数实现。router.addRoute() 和 router.removeRoute()。它们只注册一个新的路由

```js
router.addRoute({ path: "/about", name: "about", component: About });
// 这将会替换之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
const removeRoute = router.addRoute({
  path: "/other",
  name: "about",
  component: Other,
});

// 手动调用 router.replace() 来改变当前的位置
router.replace(router.currentRoute.value.fullPath);

// 通过addRoute返回值删除路由，如果存在的话
removeRoute();
// 通过removeRoute删除路由
router.removeRoute("about");

//在导航守卫内部添加或删除路由
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to));
    // 触发重定向
    return to.fullPath;
  }
});

//要将嵌套路由添加到现有的路由中
router.addRoute({ name: "admin", path: "/admin", component: Admin });
router.addRoute("admin", { path: "settings", component: AdminSettings });
// 等效于
router.addRoute({
  name: "admin",
  path: "/admin",
  component: Admin,
  children: [{ path: "settings", component: AdminSettings }],
});

// Vue Router 提供了两个功能来查看现有的路由：
router.hasRoute("admin"); // 检查路由是否存在。
router.getRoutes(); // 获取一个包含所有路由记录的数组。
```

## 完整的导航解析流程

- 导航被触发。
- 在失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫(2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
