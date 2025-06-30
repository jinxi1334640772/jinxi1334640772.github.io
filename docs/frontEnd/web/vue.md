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

## 🚀 Vue 3 核心特性

### ✨ 主要改进

| 特性 | Vue 2 | Vue 3 | 优势 |
|------|-------|-------|------|
| **API 风格** | Options API | Composition API | 更好的逻辑复用和类型推导 |
| **响应式系统** | Object.defineProperty | Proxy | 更完整的响应式支持 |
| **性能** | - | 优化编译器 | 更小的包体积，更快的渲染 |
| **TypeScript** | 部分支持 | 原生支持 | 更好的类型安全 |
| **Tree-shaking** | 有限 | 完全支持 | 按需引入，减少包体积 |

## 📦 Vue 3 基础语法

### 🔧 应用实例创建

```javascript
import { createApp } from 'vue'

// 创建应用实例
const app = createApp({
  // 根组件选项
})

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  // 向追踪服务报告错误
  console.error('Vue Error:', err, info)
}

// 挂载应用
app.mount('#app')

// 卸载应用
app.unmount()
```

### 📋 完整的 `<script setup>` 示例

```vue
<template>
  <!-- 模板中使用 $emit 触发父组件事件 -->
  <button @click="$emit('someEvent', param1, ...params)">
    Click Me
  </button>
  
  <!-- 显示响应式数据 -->
  <div>鼠标位置: {{ x }}, {{ y }}</div>
  <div>用户名: {{ obj.name }}</div>
</template>

<script setup lang="ts">
// 🔥 Vue 3 核心 API 导入
import {
  // 响应式 API
  ref,
  reactive,
  shallowRef,
  shallowReactive,
  readonly,
  shallowReadonly,
  customRef,
  triggerRef,
  
  // 响应式工具
  isRef,
  unref,
  toRef,
  toRefs,
  toValue,
  toRaw,
  markRaw,
  
  // 响应式判断
  isProxy,
  isReactive,
  isReadonly,
  
  // 计算属性和侦听器
  computed,
  watch,
  watchEffect,
  watchPostEffect,
  
  // 生命周期
  onMounted,
  onUnmounted,
  onUpdated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  
  // 依赖注入
  provide,
  inject,
  hasInjectionContext,
  
  // 组合式函数
  useAttrs,
  useSlots,
  useModel,
  useTemplateRef,
  useId,
  
  // 调试
  onRenderTracked,
  onRenderTriggered,
  
  // 作用域
  effectScope,
  getCurrentScope,
  onScopeDispose
} from 'vue'

// 📊 响应式数据定义
const x = ref(0)
const y = ref(0)
const obj = reactive({ 
  name: 'Vue 3 开发者',
  skills: ['JavaScript', 'TypeScript', 'Vue']
})

// 🔄 更新函数
function update(event: MouseEvent) {
  x.value = event.pageX
  y.value = event.pageY
  obj.name = '张进喜'
}

// 🎯 生命周期钩子
onMounted(() => {
  window.addEventListener('mousemove', update)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', update)
})

// 📥 Props 定义（对象形式 + 类型检查）
const props = defineProps({
  title: {
    type: String,
    default: 'Hello Vue 3',
    required: false
  },
  likes: {
    type: Number,
    default: 0
  },
  // 多种可能的类型
  propB: [String, Number, Boolean, Array, Object, Date, Function, Symbol, Error],
  
  // 必传 + 可为 null 的字符串
  propD: {
    type: [String, null],
    default: 100,
    required: true
  },
  
  // 对象/数组默认值必须从工厂函数返回
  propF: {
    type: Object,
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  
  // 自定义验证函数
  propG: {
    validator(value: string, props: any) {
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  
  // 函数类型的默认值
  propH: {
    type: Function,
    default() {
      return 'Default function'
    }
  }
})

// 📥 TypeScript Props 定义
interface Props {
  title?: string
  likes?: number
  status?: 'success' | 'warning' | 'danger'
}

// const props = defineProps<Props>()

// 📤 事件定义
const emit = defineEmits<{
  someEvent: [param1: string, ...params: any[]]
  inFocus: []
  submit: [payload: { name: string; value: string }]
}>()

// 或者使用数组形式
// const emit = defineEmits(['inFocus', 'submit', 'someEvent'])
</script>
```

## 🔄 响应式系统深入

### 📊 响应式 API 对比

| API | 适用类型 | 深度响应 | 性能 | 使用场景 |
|-----|----------|----------|------|----------|
| `ref()` | 基本类型 + 对象 | ✅ | 中等 | 基本类型、单个对象 |
| `reactive()` | 对象、数组 | ✅ | 中等 | 复杂对象结构 |
| `shallowRef()` | 任意类型 | ❌ | 高 | 大型对象，手动触发更新 |
| `shallowReactive()` | 对象、数组 | ❌ | 高 | 只有根级别属性是响应式 |
| `readonly()` | 任意响应式对象 | ✅ | 中等 | 防止修改的数据 |
| `shallowReadonly()` | 任意响应式对象 | ❌ | 高 | 浅层只读保护 |

### 🔧 响应式原理模拟

```javascript
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

## 🎨 组件通信方案

### 📤 Props 和 Events

```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :title="parentTitle"
    :user-info="userInfo"
    @user-updated="handleUserUpdate"
    @custom-event="handleCustomEvent"
  />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue'

const parentTitle = ref('父组件标题')
const userInfo = reactive({
  name: '张三',
  age: 25
})

function handleUserUpdate(newUserInfo) {
  Object.assign(userInfo, newUserInfo)
}

function handleCustomEvent(payload) {
  console.log('收到自定义事件:', payload)
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>{{ userInfo.name }} - {{ userInfo.age }}岁</p>
    <button @click="updateUser">更新用户信息</button>
    <button @click="emitCustomEvent">触发自定义事件</button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  userInfo: Object
})

const emit = defineEmits(['user-updated', 'custom-event'])

function updateUser() {
  emit('user-updated', {
    name: '李四',
    age: 30
  })
}

function emitCustomEvent() {
  emit('custom-event', { 
    message: '这是自定义事件数据',
    timestamp: Date.now()
  })
}
</script>
```

### 🔄 provide/inject 依赖注入

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
const user = reactive({
  id: 1,
  name: '管理员',
  permissions: ['read', 'write', 'delete']
})

// 提供数据
provide('theme', theme)
provide('user', user)
provide('updateTheme', (newTheme) => {
  theme.value = newTheme
})
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

// 注入数据
const theme = inject('theme', 'light') // 默认值
const user = inject('user')
const updateTheme = inject('updateTheme')

// 检查注入上下文
if (hasInjectionContext()) {
  console.log('在注入上下文中')
}
</script>
```

### 🔧 组合式函数

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  
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
    count,
    doubleCount,
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

## 🎯 生命周期钩子

### 📊 生命周期对比

| Vue 2 | Vue 3 | 执行时机 |
|-------|-------|----------|
| `beforeCreate` | `setup()` | 组件实例创建前 |
| `created` | `setup()` | 组件实例创建后 |
| `beforeMount` | `onBeforeMount` | 挂载前 |
| `mounted` | `onMounted` | 挂载完成 |
| `beforeUpdate` | `onBeforeUpdate` | 更新前 |
| `updated` | `onUpdated` | 更新完成 |
| `beforeUnmount` | `onBeforeUnmount` | 卸载前 |
| `unmounted` | `onUnmounted` | 卸载完成 |

### 🔄 生命周期使用示例

```vue
<script setup>
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

// 挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 挂载完成
onMounted(() => {
  console.log('组件已挂载')
  // DOM 操作
  // 初始化第三方库
  // 设置定时器
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
  // 清理工作准备
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
  return false // 阻止错误继续传播
})
</script>
```

## 👀 侦听器和计算属性

### 🔍 watch 侦听器

```javascript
import { ref, reactive, watch, watchEffect } from 'vue'

const count = ref(0)
const state = reactive({ name: 'Vue', version: 3 })

// 侦听单个 ref
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
})

// 侦听多个源
watch([count, () => state.name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('多个值发生变化')
})

// 侦听响应式对象
watch(state, (newState, oldState) => {
  console.log('state changed:', newState)
}, { deep: true })

// 立即执行的侦听器
watch(count, (newValue) => {
  console.log('立即执行:', newValue)
}, { immediate: true })

// watchEffect - 自动收集依赖
watchEffect(() => {
  console.log(`count is ${count.value}`)
  console.log(`name is ${state.name}`)
})

// 停止侦听器
const stopWatcher = watch(count, () => {})
stopWatcher() // 停止侦听
```

### 🧮 computed 计算属性

```javascript
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

// 使用
console.log(fullName.value) // 张 三
fullNameWritable.value = '李 四'
console.log(firstName.value) // 李
console.log(lastName.value) // 四
```

## 🛠️ 高级特性

### 🎪 动态组件

```vue
<template>
  <div>
    <button 
      v-for="tab in tabs" 
      :key="tab"
      @click="currentTab = tab"
      :class="{ active: currentTab === tab }"
    >
      {{ tab }}
    </button>
    
    <!-- 动态组件 -->
    <component :is="currentComponent" :data="componentData" />
    
    <!-- 带缓存的动态组件 -->
    <KeepAlive>
      <component :is="currentComponent" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'
import ComponentC from './ComponentC.vue'

const tabs = ['A', 'B', 'C']
const currentTab = ref('A')

const components = {
  A: ComponentA,
  B: ComponentB,
  C: ComponentC
}

const currentComponent = computed(() => components[currentTab.value])
const componentData = ref({ message: 'Hello Dynamic Component' })
</script>
```

### 🎭 插槽系统

```vue
<!-- 父组件 -->
<template>
  <MyComponent>
    <!-- 默认插槽 -->
    <p>这是默认插槽内容</p>
    
    <!-- 具名插槽 -->
    <template #header>
      <h1>这是标题</h1>
    </template>
    
    <!-- 作用域插槽 -->
    <template #item="{ item, index }">
      <li>{{ index }}: {{ item.name }}</li>
    </template>
  </MyComponent>
</template>

<!-- 子组件 -->
<template>
  <div class="my-component">
    <header>
      <slot name="header">默认标题</slot>
    </header>
    
    <main>
      <slot>默认内容</slot>
    </main>
    
    <ul>
      <slot 
        name="item" 
        v-for="(item, index) in items" 
        :key="item.id"
        :item="item" 
        :index="index"
      />
    </ul>
  </div>
</template>

<script setup>
const items = ref([
  { id: 1, name: '项目1' },
  { id: 2, name: '项目2' },
  { id: 3, name: '项目3' }
])
</script>
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **组合式 API 优先**
   ```javascript
   // ✅ 推荐：使用 Composition API
   <script setup>
   import { ref, computed } from 'vue'
   
   const count = ref(0)
   const doubleCount = computed(() => count.value * 2)
   </script>
   ```

2. **合理使用响应式 API**
   ```javascript
   // ✅ 基本类型使用 ref
   const name = ref('Vue')
   
   // ✅ 对象使用 reactive
   const user = reactive({ name: 'Vue', age: 3 })
   
   // ✅ 性能敏感场景使用 shallow
   const largeObject = shallowReactive(hugeData)
   ```

3. **组合式函数抽取逻辑**
   ```javascript
   // ✅ 抽取可复用逻辑
   function useUserData() {
     const user = ref(null)
     const loading = ref(false)
     
     async function fetchUser(id) {
       loading.value = true
       try {
         user.value = await api.getUser(id)
       } finally {
         loading.value = false
       }
     }
     
     return { user, loading, fetchUser }
   }
   ```

### ❌ 避免的问题

1. **不要解构响应式对象**
   ```javascript
   // ❌ 错误：丢失响应性
   const { name, age } = reactive({ name: 'Vue', age: 3 })
   
   // ✅ 正确：使用 toRefs
   const { name, age } = toRefs(reactive({ name: 'Vue', age: 3 }))
   ```

2. **避免在模板中使用复杂表达式**
   ```vue
   <!-- ❌ 错误：模板中逻辑过于复杂 -->
   <div>{{ user.posts.filter(p => p.published).length > 0 ? '有发布的文章' : '暂无发布' }}</div>
   
   <!-- ✅ 正确：使用计算属性 -->
   <div>{{ hasPublishedPosts ? '有发布的文章' : '暂无发布' }}</div>
   ```

## 📚 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vue 3 中文文档](https://cn.vuejs.org/)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 生态系统](https://github.com/vuejs/awesome-vue)

---

::: tip 🚀 继续学习
掌握了 Vue 3 基础后，建议学习 Vue Router、Pinia 状态管理、以及 Vue 3 的高级特性如自定义指令、插件开发等。
:::