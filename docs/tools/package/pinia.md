---
title: 🍍 Pinia 状态管理完全指南
description: Pinia 是 Vue 的专属状态管理库，提供更简单的 API 和更好的 TypeScript 支持
outline: deep
---

# 🍍 Pinia 状态管理完全指南

> Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。

## 📖 概述

### ✨ 主要特性

| 特性 | 描述 | 优势 |
|------|------|------|
| 🧪 **测试工具集** | 完整的测试支持 | 更好的代码质量保障 |
| 🔌 **插件系统** | 可通过插件扩展功能 | 高度可扩展性 |
| 📝 **TypeScript 支持** | 完整的类型推断和自动补全 | 更好的开发体验 |
| 🌐 **SSR 支持** | 支持服务端渲染 | 更好的 SEO 和首屏性能 |
| 🛠️ **Devtools 支持** | 完整的开发者工具支持 | 强大的调试能力 |
| 🔥 **热更新** | 不重载页面即可修改 Store | 提升开发效率 |

### 🔧 Devtools 功能

- ✅ 追踪 actions、mutations 的时间线
- ✅ 在组件中展示它们所用到的 Store
- ✅ 让调试更容易的 Time travel
- ✅ 开发时可保持当前的 State

## 🆚 对比 Vuex

与 Vuex 相比，Pinia 不仅提供了一个更简单的 API，也提供了符合组合式 API 风格的 API，最重要的是，搭配 TypeScript 一起使用时有非常可靠的类型推断支持。

### 📊 主要区别

| 特性 | Vuex | Pinia | 优势 |
|------|------|-------|------|
| **Mutations** | 必需 | ❌ 已弃用 | 减少冗余代码 |
| **TypeScript** | 需要复杂包装器 | ✅ 原生支持 | 更好的类型推断 |
| **魔法字符串** | 需要 | ❌ 不需要 | 更好的自动补全 |
| **动态 Store** | 需要手动添加 | ✅ 默认动态 | 更灵活的架构 |
| **嵌套模块** | 复杂的嵌套结构 | ✅ 扁平化架构 | 更简洁的组织方式 |
| **命名模块** | 需要考虑命名 | ✅ 灵活命名 | 更好的可维护性 |

::: tip 💡 升级建议
- **Mutation 已被弃用**: 它们经常被认为是极其冗余的，现在直接在 actions 中修改 state
- **无需复杂包装器**: 一切都可标注类型，API 设计充分利用 TS 类型推理
- **无魔法字符串**: 只需导入函数并调用，享受自动补全
- **扁平化架构**: 可以通过导入和使用另一个 Store 来隐含地嵌套 stores
:::

## 🏗️ 定义 Store

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，它承载着全局状态。它有点像一个永远存在的组件，每个组件都可以读取和写入它。

### 🎯 Store 的三个概念

| 概念 | 对应组件选项 | 作用 |
|------|-------------|------|
| **State** | `data` | 存储状态数据 |
| **Getters** | `computed` | 计算属性，派生状态 |
| **Actions** | `methods` | 业务逻辑和异步操作 |

::: tip 💡 设计原则
一个 Store 应该包含可以在整个应用中访问的数据
:::

### 📝 Option Store 方式

```javascript
// stores/counter.js
import { defineStore } from "pinia";

/**
 * 使用类似 Vuex 的定义方式 Store
 * @param {string} storeId 应用中 Store 的唯一 ID
 * @param {object} options Setup 函数或 Option 对象，定义 store 内容
 * @returns {Function} store 实例，名称最好 use 开头，Store 结尾
 */
export const useCounterStore = defineStore("counter", {
  // 状态定义
  state: () => {
    return {
      count: 0,
      /** @type {{ text: string, id: number, isFinished: boolean }[]} */
      todos: [],
      /** @type {'all' | 'finished' | 'unfinished'} */
      filter: "all",
      // 类型将自动推断为 number
      nextId: 0,
    };
  },
  
  // 计算属性
  getters: {
    // 简单的 getter
    double: state => state.count * 2,
    
    // 带有 this 上下文的 getter
    finishedTodos(state) {
      // 自动补全！ ✨
      return state.todos.filter(todo => todo.isFinished);
    },
    
    unfinishedTodos(state) {
      return state.todos.filter(todo => !todo.isFinished);
    },
    
    /**
     * 复杂的 getter，可以调用其他 getters
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === "finished") {
        // 调用其他带有自动补全的 getters ✨
        return this.finishedTodos;
      } else if (this.filter === "unfinished") {
        return this.unfinishedTodos;
      }
      return this.todos;
    },
  },
  
  // 动作方法
  actions: {
    // 同步 action
    increment() {
      this.count++;
    },
    
    // 接受任何数量的参数，返回一个 Promise 或不返回
    addTodo(text) {
      // 你可以直接变更该状态
      this.todos.push({ 
        text, 
        id: this.nextId++, 
        isFinished: false 
      });
    },
    
    // 异步 action
    async fetchUserData(userId) {
      try {
        const userData = await api.getUserData(userId);
        this.user = userData;
        return userData;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
      }
    }
  },
});
```

### 🎣 Composition API 方式

```javascript
/**
 * 使用 Composition API 定义方式定义 Store
 * ref() 就是 state 属性
 * computed() 就是 getters
 * function() 就是 actions
 * @returns {object} 想暴露出去的属性和方法的对象
 */
export const useCounterStore = defineStore("counter", () => {
  // State
  const count = ref(0);
  const todos = ref([]);
  const filter = ref('all');
  
  // Getters
  const double = computed(() => count.value * 2);
  const finishedTodos = computed(() => 
    todos.value.filter(todo => todo.isFinished)
  );
  const unfinishedTodos = computed(() => 
    todos.value.filter(todo => !todo.isFinished)
  );
  
  // Actions
  function increment() {
    count.value++;
  }
  
  function addTodo(text) {
    todos.value.push({
      text,
      id: Date.now(),
      isFinished: false
    });
  }
  
  async function fetchUserData(userId) {
    try {
      const userData = await api.getUserData(userId);
      return userData;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }
  
  // 返回想暴露出去的属性和方法的对象
  return { 
    count, 
    todos,
    filter,
    double,
    finishedTodos,
    unfinishedTodos,
    increment,
    addTodo,
    fetchUserData
  };
});

// 其他 Store 示例
const useUserStore = defineStore("user", {
  // ...
});
```

## 📦 注册 Pinia

```javascript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

// 注册好 pinia 之后，才可以使用 store
app.use(pinia);
app.mount("#app");
```

::: warning ⚠️ 注意顺序
必须先注册 Pinia，然后才能在组件中使用 Store
:::

## 🚀 使用 Store

### 🎯 Composition API 使用

```vue
<template>
  <div>
    <!-- 直接从 store 中访问 state -->
    <div>Current Count: {{ counter.count }}</div>
    <div>Double: {{ counter.double }}</div>
    
    <!-- 使用 getters -->
    <div>Finished Todos: {{ counter.finishedTodos.length }}</div>
    
    <!-- 按钮操作 -->
    <button @click="counter.increment()">增加</button>
    <button @click="counter.addTodo('新任务')">添加任务</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 直接修改 state
counter.count++

// 批量更新
counter.$patch({ count: counter.count + 1 })

// 或使用 action 代替（推荐）
counter.increment()

// 重置 store 到初始状态
counter.$reset()

// 监听 store 变化
counter.$subscribe((mutation, state) => {
  console.log('Store changed:', mutation, state)
})

// 监听 actions
counter.$onAction(({
  name, // action 名称
  store, // store 实例
  args, // 传递给 action 的参数数组
  after, // 在 action 返回或解决后的钩子
  onError, // action 抛出或拒绝的钩子
}) => {
  console.log(`Action "${name}" called with args:`, args)
  
  after((result) => {
    console.log(`Action "${name}" finished with result:`, result)
  })
  
  onError((error) => {
    console.error(`Action "${name}" failed:`, error)
  })
})
</script>
```

### 📊 Options API 使用

```vue
<template>
  <div>
    <div>Current Count: {{ count }}</div>
    <div>Double: {{ double }}</div>
    <button @click="increment()">增加</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapStores, mapState, mapActions } from 'pinia'
import { useCounterStore, useUserStore } from '@/stores'

export default defineComponent({
  computed: {
    // 允许访问 this.counterStore 和 this.userStore
    ...mapStores(useCounterStore, useUserStore),
    
    // 允许读取 this.count 和 this.double
    ...mapState(useCounterStore, ['count', 'double']),
    
    // 也可以这样写
    ...mapState(useCounterStore, {
      myCount: 'count',
      myDouble: 'double'
    })
  },
  
  methods: {
    // 允许读取 this.increment()
    ...mapActions(useCounterStore, ['increment']),
    
    test() {
      console.log(this.count, this.double)
      this.increment()
    }
  },
})
</script>
```

## 🔌 Pinia 插件

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 context。

### 📝 插件基础

```javascript
export function myPiniaPlugin(context) {
  context.pinia; // 用 `createPinia()` 创建的 pinia
  context.app; // 用 `createApp()` 创建的当前应用(仅 Vue 3)
  context.store; // 该插件想扩展的 store
  context.options; // 定义传给 `defineStore()` 的 store 的可选对象

  // 每个 store 都添加有单独的 `hello` 属性
  context.store.hello = ref("secret");
  // 它会被自动解包
  context.store.hello; // 'secret'

  // 所有的 store 都在共享 `shared` 属性的值
  context.store.shared = sharedRef;
  context.store.shared; // 'shared'

  // 插件中使用 store.$subscribe 和 store.$onAction
  context.store.$subscribe(() => {
    // 响应 store 变化
  })

  context.store.$onAction(() => {
    // 响应 store actions
  })
}

// 注册插件
const pinia = createPinia()
pinia.use(myPiniaPlugin)
```

### 🛠️ 实用插件示例

#### 💾 持久化插件

```javascript
import { toRaw } from 'vue'

// 简单的持久化插件
function persistedState(context) {
  const { store } = context
  
  // 从 localStorage 恢复数据
  const stored = localStorage.getItem(store.$id)
  if (stored) {
    store.$patch(JSON.parse(stored))
  }
  
  // 监听变化并保存
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(toRaw(state)))
  })
}

// 使用插件
pinia.use(persistedState)
```

#### 🔍 调试插件

```javascript
function debugPlugin({ store }) {
  store.$onAction(({ name, args, after, onError }) => {
    const startTime = Date.now()
    console.log(`🚀 Action "${name}" started with:`, args)
    
    after((result) => {
      const duration = Date.now() - startTime
      console.log(`✅ Action "${name}" finished in ${duration}ms with:`, result)
    })
    
    onError((error) => {
      const duration = Date.now() - startTime
      console.error(`❌ Action "${name}" failed after ${duration}ms:`, error)
    })
  })
}

pinia.use(debugPlugin)
```

::: tip 💡 插件注意事项
- 插件只会应用于在 pinia 传递给应用后创建的 store，否则它们不会生效
- 每个 store 都被 `reactive` 包装过，所以可以自动解包任何它所包含的 Ref
- 这就是在没有 `.value` 的情况下你依旧可以访问所有计算属性的原因
:::

## 🎯 高级用法

### 🔄 Store 之间的通信

```javascript
// stores/user.js
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const preferences = ref({})
  
  return { user, preferences }
})

// stores/cart.js
export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  
  // 使用其他 store
  const userStore = useUserStore()
  
  const addItem = (item) => {
    // 检查用户是否登录
    if (!userStore.user) {
      throw new Error('User must be logged in to add items')
    }
    
    items.value.push(item)
  }
  
  return { items, addItem }
})
```

### 🧪 测试 Store

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 为每个测试创建新的 pinia 实例
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    
    counter.increment()
    expect(counter.count).toBe(1)
  })

  it('adds todo', () => {
    const counter = useCounterStore()
    counter.addTodo('Test todo')
    
    expect(counter.todos).toHaveLength(1)
    expect(counter.todos[0].text).toBe('Test todo')
  })
})
```

## 🎨 最佳实践

### ✅ 推荐做法

::: tip 🎯 最佳实践
1. **命名规范**: Store 函数以 `use` 开头，以 `Store` 结尾
2. **单一职责**: 每个 Store 只负责一类相关的状态管理
3. **类型安全**: 充分利用 TypeScript 的类型推断
4. **组合使用**: 通过组合多个小的 Store 而不是创建大的 Store
5. **插件扩展**: 使用插件来添加通用功能如持久化、调试等
:::

### 🚫 避免的做法

::: warning ⚠️ 注意事项
- 不要在 Store 外部直接修改 state，应该通过 actions
- 避免在 getters 中执行副作用操作
- 不要在 Store 中存储 DOM 元素或非序列化的数据
- 避免创建过于复杂的嵌套状态结构
:::

### 📁 项目结构建议

```
src/
├── stores/
│   ├── index.js          // 导出所有 stores
│   ├── user.js           // 用户相关状态
│   ├── cart.js           // 购物车状态
│   ├── products.js       // 产品数据
│   └── ui.js             // UI 状态（主题、语言等）
├── composables/
│   └── useAuth.js        // 认证相关的组合式函数
└── main.js
```

## 🌟 总结

Pinia 作为 Vue 的新一代状态管理库，提供了：

- ✅ **更简单的 API**: 相比 Vuex 更加直观易用
- ✅ **完整的 TypeScript 支持**: 原生类型推断和自动补全
- ✅ **灵活的架构**: 支持多种定义方式和组合模式
- ✅ **强大的插件系统**: 可扩展的功能支持
- ✅ **优秀的开发体验**: 热更新、调试工具、测试支持
- ✅ **现代化设计**: 符合 Vue 3 和 Composition API 的设计理念

通过合理使用 Pinia，可以构建出更加健壮、可维护的 Vue 应用程序。
