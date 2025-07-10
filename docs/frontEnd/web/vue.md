---
title: Vue 3 开发指南
description: Vue 3 完整开发指南，包含 Composition API、响应式系统、组件通信、生命周期等核心特性
outline: deep
---

# 💚 Vue 3 开发指南

Vue.js 是一个用于构建用户界面的渐进式 JavaScript 框架。Vue 3 引入了 Composition API、更好的 TypeScript 支持和性能优化。

::: tip 📚 本章内容
全面学习 Vue 3 的核心特性，掌握现代 Vue 开发的最佳实践和高级技巧。
:::

## 1. 概述

### 1.1 Vue 3 核心特性

Vue 3 相比 Vue 2 有了重大改进，引入了多项新特性和性能优化：

| 特性 | Vue 2 | Vue 3 | 优势 |
|------|-------|-------|------|
| **API 风格** | Options API | Composition API | 更好的逻辑复用和类型推导 |
| **响应式系统** | Object.defineProperty | Proxy | 更完整的响应式支持 |
| **性能** | - | 优化编译器 | 更小的包体积，更快的渲染 |
| **TypeScript** | 部分支持 | 原生支持 | 更好的类型安全 |
| **Tree-shaking** | 有限 | 完全支持 | 按需引入，减少包体积 |

### 1.2 主要改进

#### 性能提升
- 更小的包体积
- 更快的渲染性能
- 更好的内存使用效率

#### 开发体验
- 更好的 TypeScript 支持
- 改进的调试体验
- 更灵活的组件组织方式

#### 新特性
- Composition API
- 多根节点组件
- Teleport 传送
- Fragment 片段
- Suspense 异步组件

## 2. 安装与配置

### 2.1 创建 Vue 3 项目

```bash
# 使用 create-vue 创建项目（推荐）
npm create vue@latest my-vue-app
cd my-vue-app
npm install

# 使用 Vite 创建
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install

# 使用 Vue CLI
npm install -g @vue/cli
vue create my-vue-app
```

### 2.2 项目结构

```
my-vue-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   ├── composables/     # 组合式函数
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── package.json
└── vite.config.js       # 构建配置
```

### 2.3 应用实例创建

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}

// 全局属性
app.config.globalProperties.$http = axios

// 挂载应用
app.mount('#app')

// 卸载应用
// app.unmount()
```

## 3. 基础语法

### 3.1 模板语法

```vue
<template>
  <!-- 文本插值 -->
  <p>{{ message }}</p>
  
  <!-- HTML 插值 -->
  <div v-html="rawHtml"></div>
  
  <!-- 属性绑定 -->
  <div :id="dynamicId" :class="{ active: isActive }"></div>
  
  <!-- 事件监听 -->
  <button @click="handleClick">点击我</button>
  
  <!-- 双向绑定 -->
  <input v-model="inputValue" />
  
  <!-- 条件渲染 -->
  <div v-if="showDiv">显示内容</div>
  <div v-else>隐藏内容</div>
  
  <!-- 列表渲染 -->
  <ul>
    <li v-for="item in list" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref, reactive } from 'vue'

const message = ref('Hello Vue 3!')
const rawHtml = ref('<strong>粗体文本</strong>')
const dynamicId = ref('my-id')
const isActive = ref(true)
const inputValue = ref('')
const showDiv = ref(true)
const list = reactive([
  { id: 1, name: '项目1' },
  { id: 2, name: '项目2' },
  { id: 3, name: '项目3' }
])

function handleClick() {
  console.log('按钮被点击了!')
}
</script>
```

### 3.2 Script Setup 语法

```vue
<template>
  <div>
    <p>计数器: {{ count }}</p>
    <p>双倍计数: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
    <button @click="$emit('custom-event', count)">触发事件</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props 定义
const props = defineProps({
  initialCount: {
    type: Number,
    default: 0
  }
})

// 事件定义
const emit = defineEmits(['custom-event'])

// 响应式数据
const count = ref(props.initialCount)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})

// 暴露给父组件
defineExpose({
  count,
  increment
})
</script>
```

## 4. 响应式系统

### 4.1 响应式 API 详解

#### ref() - 基本类型响应式

```javascript
import { ref, isRef, unref } from 'vue'

// 创建响应式引用
const count = ref(0)
const name = ref('Vue 3')

// 访问和修改值
console.log(count.value) // 0
count.value = 1

// 检查是否为 ref
console.log(isRef(count)) // true

// 获取原始值
console.log(unref(count)) // 等同于 count.value

// ref 也可以包含对象
const user = ref({
  name: '张三',
  age: 25
})

// 修改对象属性
user.value.name = '李四'

// 🎯 模拟 reactive 实现
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      // 依赖收集
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      // 触发更新
      trigger(target, key)
      return true
    }
  })
}

// 🎯 模拟 ref 实现
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}

// 📊 依赖收集和触发系统
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}

function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}

function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

#### reactive() - 对象响应式

```javascript
import { reactive, isReactive, toRaw } from 'vue'

// 创建响应式对象
const state = reactive({
  count: 0,
  user: {
    name: '张三',
    age: 25
  },
  list: [1, 2, 3]
})

// 直接修改属性
state.count++
state.user.name = '李四'
state.list.push(4)

// 检查是否为响应式对象
console.log(isReactive(state)) // true

// 获取原始对象
const rawState = toRaw(state)
```

#### 性能优化 API

```javascript
import { 
  shallowRef, 
  shallowReactive,
  readonly,
  markRaw
} from 'vue'

// 浅层响应式 - 只有根级别是响应式
const shallowState = shallowReactive({
  count: 0,
  deep: {
    nested: 1 // 这个不是响应式的
  }
})

// 浅层 ref - 不会深度转换对象
const shallowObj = shallowRef({
  count: 0,
  nested: { value: 1 }
})

// 只读响应式
const original = reactive({ count: 0 })
const readonlyState = readonly(original)

// 标记为非响应式
const nonReactive = markRaw({
  foo: 'bar'
})
```

### 4.2 工具函数

```javascript
import { 
  toRef,
  toRefs,
  toValue,
  customRef,
  triggerRef
} from 'vue'

const state = reactive({
  name: '张三',
  age: 25
})

// 将响应式对象的属性转为 ref
const nameRef = toRef(state, 'name')

// 将响应式对象转为 ref 对象
const { name, age } = toRefs(state)

// 自定义 ref
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

const debouncedText = useDebouncedRef('hello')
```

## 5. 组件通信

### 5.1 Props 和 Events

```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :title="title"
    :user="user"
    :options="options"
    @update-user="handleUpdateUser"
    @custom-event="handleCustomEvent"
  />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue'

const title = ref('父组件标题')
const user = reactive({
  name: '张三',
  age: 25
})
const options = ref(['选项1', '选项2', '选项3'])

function handleUpdateUser(newUser) {
  Object.assign(user, newUser)
}

function handleCustomEvent(payload) {
  console.log('收到自定义事件:', payload)
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>{{ user.name }} - {{ user.age }}岁</p>
    <select @change="updateUser">
      <option v-for="option in options" :key="option">
        {{ option }}
      </option>
    </select>
    <button @click="emitCustomEvent">触发事件</button>
  </div>
</template>

<script setup>
// Props 定义（对象形式）
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  }
})

// Props 定义（TypeScript 形式）
// interface Props {
//   title: string
//   user: { name: string; age: number }
//   options?: string[]
// }
// const props = defineProps<Props>()

// 事件定义
const emit = defineEmits(['update-user', 'custom-event'])

function updateUser() {
  emit('update-user', {
    name: '李四',
    age: 30
  })
}

function emitCustomEvent() {
  emit('custom-event', {
    message: '自定义事件数据',
    timestamp: Date.now()
  })
}
</script>
```

### 5.2 依赖注入

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref, readonly } from 'vue'

const theme = ref('dark')
const userInfo = reactive({
  id: 1,
  name: '管理员',
  role: 'admin'
})

// 提供响应式数据
provide('theme', readonly(theme))
provide('userInfo', readonly(userInfo))

// 提供方法
provide('updateTheme', (newTheme) => {
  theme.value = newTheme
})

provide('updateUserInfo', (info) => {
  Object.assign(userInfo, info)
})
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

// 注入数据（带默认值）
const theme = inject('theme', 'light')
const userInfo = inject('userInfo', { id: 0, name: '游客', role: 'guest' })

// 注入方法
const updateTheme = inject('updateTheme')
const updateUserInfo = inject('updateUserInfo')

// 使用注入的数据和方法
function switchTheme() {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  updateTheme?.(newTheme)
}
</script>
```

### 5.3 模板引用

```vue
<template>
  <div>
    <!-- 单个元素引用 -->
    <input ref="inputRef" />
    
    <!-- 组件引用 -->
    <ChildComponent ref="childRef" />
    
    <!-- 循环中的引用 -->
    <ul>
      <li v-for="item in list" :key="item.id" ref="itemRefs">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 元素引用
const inputRef = ref(null)

// 组件引用
const childRef = ref(null)

// 列表引用
const itemRefs = ref([])

onMounted(() => {
  // 访问 DOM 元素
  inputRef.value.focus()
  
  // 访问子组件方法
  childRef.value?.someMethod()
  
  // 访问列表中的元素
  console.log(itemRefs.value)
})
</script>
```

## 6. 生命周期

### 6.1 生命周期钩子

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

// 挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 挂载完成
onMounted(() => {
  console.log('组件已挂载，DOM 可用')
  // 初始化第三方库
  // 设置定时器
  // 发起 API 请求
})

// 更新前
onBeforeUpdate(() => {
  console.log('组件即将更新')
})

// 更新完成
onUpdated(() => {
  console.log('组件已更新')
  // DOM 更新后的操作
})

// 卸载前
onBeforeUnmount(() => {
  console.log('组件即将卸载')
  // 清理准备工作
})

// 卸载完成
onUnmounted(() => {
  console.log('组件已卸载')
  // 清理定时器
  // 移除事件监听器
  // 取消网络请求
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误:', err, info)
  // 错误处理逻辑
  return false // 阻止错误继续传播
})

// 调试钩子
onRenderTracked((e) => {
  console.log('依赖被追踪:', e)
})

onRenderTriggered((e) => {
  console.log('依赖被触发:', e)
})
</script>
```

### 6.2 生命周期对比

| Vue 2 | Vue 3 Composition API | 执行时机 |
|-------|----------------------|----------|
| `beforeCreate` | `setup()` | 组件实例创建前 |
| `created` | `setup()` | 组件实例创建后 |
| `beforeMount` | `onBeforeMount` | 挂载前 |
| `mounted` | `onMounted` | 挂载完成 |
| `beforeUpdate` | `onBeforeUpdate` | 更新前 |
| `updated` | `onUpdated` | 更新完成 |
| `beforeUnmount` | `onBeforeUnmount` | 卸载前 |
| `unmounted` | `onUnmounted` | 卸载完成 |

## 7. 计算属性和侦听器

### 7.1 计算属性

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// 缓存控制
const expensiveValue = computed(() => {
  console.log('计算中...')
  return someExpensiveOperation()
})

function someExpensiveOperation() {
  // 模拟耗时操作
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += Math.random()
  }
  return result
}
</script>
```

### 7.2 侦听器

```vue
<script setup>
import { ref, reactive, watch, watchEffect, nextTick } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue', version: 3 })

// 侦听单个 ref
const stopWatcher1 = watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变为 ${newValue}`)
})

// 侦听多个源
watch([count, () => state.name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('多个值发生变化')
})

// 侦听响应式对象
watch(state, (newState, oldState) => {
  console.log('state 发生变化:', newState)
}, { 
  deep: true,     // 深度侦听
  immediate: true // 立即执行
})

// watchEffect - 自动收集依赖
const stopWatcher2 = watchEffect(() => {
  console.log(`count 是 ${count.value}`)
  console.log(`name 是 ${state.name}`)
})

// 异步回调
watchEffect(async (onInvalidate) => {
  const token = 'abc'
  
  onInvalidate(() => {
    // 清理副作用
    console.log('清理操作')
  })
  
  const data = await fetch('/api/data')
  console.log(data)
})

// 停止侦听器
function stopWatching() {
  stopWatcher1()
  stopWatcher2()
}

// 在下次 DOM 更新后执行
watch(count, async (newValue) => {
  await nextTick()
  console.log('DOM 已更新')
})
</script>
```

## 8. 组合式函数

### 8.1 基础组合式函数

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count: readonly(count),
    doubleCount,
    isEven,
    increment,
    decrement,
    reset
  }
}

// 在组件中使用
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, doubleCount, increment, decrement, reset } = useCounter(10)
</script>
```

### 8.2 高级组合式函数

```javascript
// composables/useFetch.js
import { ref, reactive, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url.value)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  // 自动重新请求
  watchEffect(() => {
    if (url.value) {
      fetchData()
    }
  })
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    refetch: fetchData
  }
}

// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue
  
  const value = ref(initial)
  
  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return value
}

// 使用示例
<script setup>
import { useFetch } from '@/composables/useFetch'
import { useLocalStorage } from '@/composables/useLocalStorage'

const url = ref('/api/users')
const { data: users, loading, error, refetch } = useFetch(url)

const settings = useLocalStorage('user-settings', {
  theme: 'light',
  language: 'zh-CN'
})
</script>
```

## 9. 参考资料

### 9.1 官方文档
- [Vue 3 官方文档](https://vuejs.org/)
- [Vue 3 中文文档](https://cn.vuejs.org/)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

### 9.2 学习资源
- [Vue Mastery](https://www.vuemastery.com/)
- [Vue School](https://vueschool.io/)
- [Vue.js Examples](https://vuejsexamples.com/)

### 9.3 生态系统
- [Vue Router](https://router.vuejs.org/) - 官方路由
- [Pinia](https://pinia.vuejs.org/) - 状态管理
- [Nuxt.js](https://nuxtjs.org/) - 全栈框架
- [Quasar](https://quasar.dev/) - UI 框架
- [Vuetify](https://vuetifyjs.com/) - Material Design 组件

### 9.4 开发工具
- [Vue DevTools](https://devtools.vuejs.org/) - 浏览器调试工具
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - VS Code 插件
- [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) - TypeScript 类型检查

---

::: tip 🚀 继续学习
掌握了 Vue 3 基础后，建议学习 Vue Router 路由管理、Pinia 状态管理，以及 Vue 3 的高级特性如自定义指令、插件开发等。
::: 