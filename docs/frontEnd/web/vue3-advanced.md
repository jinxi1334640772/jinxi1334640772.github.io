---
title: Vue 3 进阶技术指南
description: 深入探讨 Vue 3 高级特性、性能优化、架构设计和最佳实践，帮助开发者掌握 Vue 3 核心技术
outline: deep
---

# 🚀 Vue 3 进阶技术指南

Vue 3 作为现代前端框架的代表，带来了全新的 Composition API、更好的性能和 TypeScript 支持。本文将深入探讨 Vue 3 的高级特性和实战技巧。

::: tip 📚 本章内容
深入理解 Vue 3 的核心原理、高级特性、性能优化策略和架构设计模式，帮助你从入门迈向精通。
:::

## 1. Composition API 深度解析

### 1.1 响应式系统原理

Vue 3 使用 Proxy 替代了 Vue 2 的 Object.defineProperty，实现了更完善的响应式系统。

#### 1.1.1 ref vs reactive

```javascript
import { ref, reactive, toRefs, toRef } from 'vue';

/**
 * ref: 用于基本类型和单个对象的响应式
 * 特点：需要通过 .value 访问，适合简单数据
 */
const count = ref(0);
const user = ref({ name: '张三', age: 25 });

console.log(count.value); // 0
console.log(user.value.name); // '张三'

/**
 * reactive: 用于对象的深层响应式
 * 特点：直接访问属性，适合复杂对象
 */
const state = reactive({
  count: 0,
  user: {
    name: '李四',
    profile: {
      email: 'lisi@example.com'
    }
  }
});

console.log(state.count); // 0
console.log(state.user.profile.email); // 'lisi@example.com'

/**
 * toRefs: 将 reactive 对象转换为 ref 对象
 * 用途：解构时保持响应式
 */
const stateRefs = toRefs(state);
const { count: countRef, user: userRef } = stateRefs;

/**
 * toRef: 为 reactive 对象的单个属性创建 ref
 */
const countRef2 = toRef(state, 'count');
```

#### 1.1.2 响应式原理实现

```javascript
/**
 * 简化版响应式系统实现
 * 理解 Vue 3 响应式的核心原理
 */

// 存储依赖的 WeakMap
const targetMap = new WeakMap();
let activeEffect = null;

/**
 * 依赖收集函数
 * @param {Object} target - 目标对象
 * @param {string} key - 属性键
 */
function track(target, key) {
  if (!activeEffect) return;
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  dep.add(activeEffect);
}

/**
 * 触发更新函数
 * @param {Object} target - 目标对象
 * @param {string} key - 属性键
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => effect());
  }
}

/**
 * 创建响应式对象
 * @param {Object} target - 原始对象
 * @returns {Proxy} 响应式代理对象
 */
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key); // 收集依赖
      return result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 触发更新
      return result;
    }
  });
}

/**
 * 副作用函数
 * @param {Function} fn - 需要执行的函数
 */
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

// 使用示例
const state = reactive({ count: 0 });

effect(() => {
  console.log('count 变化了:', state.count);
});

state.count++; // 输出: count 变化了: 1
```

### 1.2 computed 与 watch 高级用法

#### 1.2.1 computed 深度应用

```javascript
import { ref, computed } from 'vue';

/**
 * 购物车计算属性示例
 */
const cart = ref([
  { name: '商品A', price: 100, quantity: 2 },
  { name: '商品B', price: 200, quantity: 1 },
  { name: '商品C', price: 150, quantity: 3 }
]);

// 1. 基础计算属性
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
});

// 2. 可写的计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ');
  }
});

// 3. 带缓存的计算属性（性能优化）
const expensiveComputation = computed(() => {
  console.log('执行昂贵计算...');
  return cart.value
    .filter(item => item.price > 100)
    .map(item => ({
      ...item,
      total: item.price * item.quantity
    }));
});

// 4. 链式计算属性
const discountRate = ref(0.9);
const priceAfterDiscount = computed(() => totalPrice.value * discountRate.value);
const finalPrice = computed(() => Math.floor(priceAfterDiscount.value));
```

#### 1.2.2 watch 深度应用

```javascript
import { ref, watch, watchEffect } from 'vue';

const user = ref({ name: '张三', age: 25 });
const searchQuery = ref('');

// 1. 监听单个源
watch(searchQuery, (newVal, oldVal) => {
  console.log(`搜索内容从 "${oldVal}" 变为 "${newVal}"`);
});

// 2. 监听多个源
watch([searchQuery, user], ([newQuery, newUser], [oldQuery, oldUser]) => {
  console.log('搜索或用户发生变化');
});

// 3. 深度监听
watch(
  user,
  (newUser, oldUser) => {
    console.log('用户信息变化:', newUser);
  },
  { deep: true } // 深度监听对象内部变化
);

// 4. 立即执行
watch(
  searchQuery,
  (newVal) => {
    // 执行搜索逻辑
    performSearch(newVal);
  },
  { immediate: true } // 组件创建时立即执行一次
);

// 5. watchEffect：自动追踪依赖
watchEffect(() => {
  console.log(`用户 ${user.value.name} 的年龄是 ${user.value.age}`);
  // 自动追踪 user.name 和 user.age
});

// 6. 带清理的 watchEffect
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('延迟执行');
  }, 1000);
  
  // 清理函数：在副作用重新执行前调用
  onCleanup(() => {
    clearTimeout(timer);
  });
});

// 7. 停止监听
const stopWatch = watch(searchQuery, () => {
  console.log('监听中...');
});

// 需要时停止监听
stopWatch();

// 8. flush 时机控制
watch(
  searchQuery,
  () => {
    // DOM 更新后执行
    console.log('DOM 已更新');
  },
  { flush: 'post' } // 'pre' | 'post' | 'sync'
);

/**
 * 搜索函数示例
 */
function performSearch(query) {
  console.log('搜索:', query);
}
```

### 1.3 生命周期钩子最佳实践

```vue
<script setup>
import {
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue';

/**
 * 组件挂载前（访问不到 DOM）
 */
onBeforeMount(() => {
  console.log('组件即将挂载');
  // 适合：数据初始化、权限检查
});

/**
 * 组件挂载后（可以访问 DOM）
 */
onMounted(() => {
  console.log('组件已挂载');
  // 适合：DOM 操作、API 请求、第三方库初始化
  
  // 示例：初始化图表
  initChart();
  
  // 示例：添加事件监听
  window.addEventListener('resize', handleResize);
});

/**
 * 组件更新前
 */
onBeforeUpdate(() => {
  console.log('DOM 即将更新');
  // 适合：获取更新前的 DOM 状态
});

/**
 * 组件更新后
 */
onUpdated(() => {
  console.log('DOM 已更新');
  // 适合：需要访问更新后 DOM 的操作
  // 注意：避免在此修改状态，可能导致无限循环
});

/**
 * 组件卸载前
 */
onBeforeUnmount(() => {
  console.log('组件即将卸载');
  // 适合：确认操作、保存数据
});

/**
 * 组件卸载后（清理资源）
 */
onUnmounted(() => {
  console.log('组件已卸载');
  // 适合：清理定时器、事件监听、取消请求
  
  // 示例：移除事件监听
  window.removeEventListener('resize', handleResize);
  
  // 示例：清理定时器
  clearInterval(timer);
});

/**
 * keep-alive 组件激活时
 */
onActivated(() => {
  console.log('组件被激活');
  // 适合：重新获取数据、恢复状态
});

/**
 * keep-alive 组件停用时
 */
onDeactivated(() => {
  console.log('组件被停用');
  // 适合：暂停操作、保存状态
});

/**
 * 捕获子组件错误
 */
onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误:', err);
  console.log('错误组件:', instance);
  console.log('错误信息:', info);
  
  // 返回 false 阻止错误继续向上传播
  return false;
});

// 辅助函数
function initChart() {
  console.log('初始化图表');
}

function handleResize() {
  console.log('窗口大小变化');
}

const timer = setInterval(() => {
  console.log('定时任务');
}, 1000);
</script>
```

## 2. 组件设计模式

### 2.1 组合式函数 (Composables)

```javascript
/**
 * useMouse - 鼠标位置追踪组合式函数
 * @returns {Object} 鼠标坐标和更新方法
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}

/**
 * useFetch - 通用数据请求组合式函数
 * @param {string} url - 请求地址
 * @returns {Object} 数据、加载状态和错误信息
 */
export function useFetch(url) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data.value = await response.json();
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  // 立即执行请求
  fetchData();

  // 返回响应式数据和重新请求方法
  return { data, loading, error, refetch: fetchData };
}

/**
 * useLocalStorage - 本地存储组合式函数
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {Ref} 响应式的存储值
 */
export function useLocalStorage(key, defaultValue) {
  const storedValue = ref(defaultValue);

  // 从 localStorage 读取初始值
  onMounted(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        storedValue.value = JSON.parse(item);
      } catch (e) {
        console.error('解析 localStorage 失败:', e);
      }
    }
  });

  // 监听值变化并同步到 localStorage
  watch(storedValue, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return storedValue;
}

/**
 * useDebounce - 防抖组合式函数
 * @param {Ref} value - 需要防抖的响应式值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Ref} 防抖后的值
 */
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value);
  let timer = null;

  watch(value, (newValue) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return debouncedValue;
}
```

#### 使用组合式函数

```vue
<template>
  <div>
    <p>鼠标位置: {{ x }}, {{ y }}</p>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <div v-else>
      <pre>{{ data }}</pre>
      <button @click="refetch">重新加载</button>
    </div>
    
    <input v-model="searchQuery" placeholder="搜索..." />
    <p>防抖后的值: {{ debouncedQuery }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMouse, useFetch, useLocalStorage, useDebounce } from './composables';

// 使用鼠标追踪
const { x, y } = useMouse();

// 使用数据请求
const { data, loading, error, refetch } = useFetch('https://api.example.com/users');

// 使用本地存储
const theme = useLocalStorage('theme', 'light');

// 使用防抖
const searchQuery = ref('');
const debouncedQuery = useDebounce(searchQuery, 500);
</script>
```

### 2.2 高级组件模式

#### 2.2.1 渲染函数与 JSX

```javascript
import { h, ref } from 'vue';

/**
 * 使用渲染函数创建动态组件
 */
export default {
  name: 'DynamicHeading',
  props: {
    level: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 6
    }
  },
  setup(props, { slots }) {
    return () => {
      // 动态创建 h1-h6 标签
      return h(
        `h${props.level}`,
        {},
        slots.default ? slots.default() : '默认标题'
      );
    };
  }
};

/**
 * JSX 语法示例
 */
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TodoList',
  setup() {
    const todos = ref([
      { id: 1, text: '学习 Vue 3', done: false },
      { id: 2, text: '写文档', done: true }
    ]);

    const toggleTodo = (id) => {
      const todo = todos.value.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    };

    return () => (
      <div class="todo-list">
        <h2>待办事项</h2>
        <ul>
          {todos.value.map(todo => (
            <li
              key={todo.id}
              class={todo.done ? 'done' : ''}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
});
```

#### 2.2.2 无渲染组件 (Renderless Components)

```vue
<!-- MouseTracker.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // 无需 props
});

const emit = defineEmits(['update']);

const x = ref(0);
const y = ref(0);

function handleMouseMove(event) {
  x.value = event.clientX;
  y.value = event.clientY;
  emit('update', { x: x.value, y: y.value });
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

// 通过作用域插槽暴露数据
defineExpose({ x, y });
</script>

<template>
  <slot :x="x" :y="y" />
</template>
```

使用无渲染组件：

```vue
<template>
  <MouseTracker v-slot="{ x, y }">
    <div>鼠标位置: {{ x }}, {{ y }}</div>
  </MouseTracker>
  
  <MouseTracker v-slot="{ x, y }">
    <canvas :style="{ left: x + 'px', top: y + 'px' }" />
  </MouseTracker>
</template>

<script setup>
import MouseTracker from './MouseTracker.vue';
</script>
```

#### 2.2.3 高阶组件 (HOC)

```javascript
import { h, defineComponent } from 'vue';

/**
 * withLoading - 添加加载状态的高阶组件
 * @param {Component} WrappedComponent - 被包装的组件
 * @returns {Component} 增强后的组件
 */
export function withLoading(WrappedComponent) {
  return defineComponent({
    name: `WithLoading${WrappedComponent.name}`,
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { attrs, slots }) {
      return () => {
        if (props.loading) {
          return h('div', { class: 'loading' }, '加载中...');
        }
        return h(WrappedComponent, attrs, slots);
      };
    }
  });
}

/**
 * withAuth - 添加权限控制的高阶组件
 * @param {Component} WrappedComponent - 被包装的组件
 * @param {string[]} requiredRoles - 需要的角色
 * @returns {Component} 增强后的组件
 */
export function withAuth(WrappedComponent, requiredRoles) {
  return defineComponent({
    name: `WithAuth${WrappedComponent.name}`,
    setup(props, { attrs, slots }) {
      const userRoles = ['admin', 'user']; // 从 store 或 context 获取

      return () => {
        const hasPermission = requiredRoles.some(role => 
          userRoles.includes(role)
        );

        if (!hasPermission) {
          return h('div', { class: 'no-permission' }, '无权限访问');
        }

        return h(WrappedComponent, attrs, slots);
      };
    }
  });
}

// 使用示例
import UserProfile from './UserProfile.vue';

const LoadingUserProfile = withLoading(UserProfile);
const AuthUserProfile = withAuth(UserProfile, ['admin']);
```

## 3. 性能优化策略

### 3.1 组件懒加载与异步组件

```javascript
import { defineAsyncComponent, h } from 'vue';

/**
 * 1. 基础异步组件
 */
const AsyncComp = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
);

/**
 * 2. 带加载状态的异步组件
 */
const AsyncCompWithLoading = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  
  // 加载中显示的组件
  loadingComponent: {
    template: '<div class="loading">加载中...</div>'
  },
  
  // 加载失败显示的组件
  errorComponent: {
    template: '<div class="error">加载失败，请刷新重试</div>'
  },
  
  // 展示加载组件前的延迟时间（毫秒）
  delay: 200,
  
  // 超时时间（毫秒）
  timeout: 3000,
  
  // 定义组件是否可挂起（实验性）
  suspensible: false,
  
  /**
   * 错误处理函数
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // 网络错误，重试最多 3 次
      retry();
    } else {
      // 其他错误，显示错误组件
      fail();
    }
  }
});

/**
 * 3. 路由级别的懒加载
 */
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
    // 使用命名 chunk 优化分包
    // component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue')
  },
  {
    path: '/profile',
    component: () => import('./views/Profile.vue')
  }
];
```

### 3.2 虚拟滚动优化

```vue
<template>
  <div class="virtual-list" ref="containerRef" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item">{{ item }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

/**
 * 虚拟滚动列表组件
 * 适用于大数据量列表渲染优化
 */
const props = defineProps({
  // 完整数据列表
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  // 每项高度
  itemHeight: {
    type: Number,
    default: 50
  },
  // 容器高度
  containerHeight: {
    type: Number,
    default: 600
  }
});

const containerRef = ref(null);
const scrollTop = ref(0);

// 计算总高度
const totalHeight = computed(() => {
  return props.items.length * props.itemHeight;
});

// 计算可视区域显示的数量
const visibleCount = computed(() => {
  return Math.ceil(props.containerHeight / props.itemHeight);
});

// 计算起始索引
const startIndex = computed(() => {
  return Math.floor(scrollTop.value / props.itemHeight);
});

// 计算结束索引
const endIndex = computed(() => {
  return startIndex.value + visibleCount.value;
});

// 计算可见数据
const visibleData = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value);
});

// 计算偏移量
const offset = computed(() => {
  return startIndex.value * props.itemHeight;
});

/**
 * 滚动事件处理
 */
function handleScroll() {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop;
  }
}
</script>

<style scoped>
.virtual-list {
  height: 600px;
  overflow: auto;
  position: relative;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.virtual-list-item {
  border-bottom: 1px solid #eee;
  padding: 10px;
}
</style>
```

### 3.3 keep-alive 缓存优化

```vue
<template>
  <RouterView v-slot="{ Component }">
    <keep-alive :include="cachedViews" :exclude="excludedViews" :max="10">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </RouterView>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * 缓存的组件名称列表
 */
const cachedViews = ref(['Dashboard', 'UserProfile', 'Settings']);

/**
 * 排除缓存的组件
 */
const excludedViews = ref(['Login', 'Register']);

/**
 * 动态控制缓存
 */
function addCache(componentName) {
  if (!cachedViews.value.includes(componentName)) {
    cachedViews.value.push(componentName);
  }
}

function removeCache(componentName) {
  const index = cachedViews.value.indexOf(componentName);
  if (index > -1) {
    cachedViews.value.splice(index, 1);
  }
}

/**
 * 清空所有缓存
 */
function clearAllCache() {
  cachedViews.value = [];
}
</script>
```

### 3.4 v-memo 性能优化

```vue
<template>
  <div>
    <!-- 只有依赖项变化时才重新渲染 -->
    <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
      <p>{{ item.name }}</p>
      <p>{{ item.description }}</p>
      <button @click="toggleSelect(item.id)">
        {{ item.selected ? '已选' : '未选' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

/**
 * 大数据列表优化示例
 * v-memo 只在指定的依赖项变化时重新渲染
 */
const list = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `商品 ${i}`,
    description: `这是第 ${i} 个商品的描述信息`,
    selected: false
  }))
);

function toggleSelect(id) {
  const item = list.value.find(item => item.id === id);
  if (item) {
    item.selected = !item.selected;
  }
}
</script>
```

## 4. 状态管理进阶

### 4.1 Pinia 高级用法

```javascript
/**
 * user.store.js - 用户状态管理
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref(null);
  const token = ref('');
  const permissions = ref([]);

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => userInfo.value?.name ?? '游客');
  const hasPermission = computed(() => {
    return (permission) => permissions.value.includes(permission);
  });

  // Actions
  async function login(credentials) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.success) {
        token.value = data.token;
        userInfo.value = data.user;
        permissions.value = data.permissions;
        
        // 持久化到 localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        return { success: true };
      }
      
      return { success: false, message: data.message };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: '网络错误' };
    }
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    permissions.value = [];
    
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }

  function updateUserInfo(newInfo) {
    userInfo.value = { ...userInfo.value, ...newInfo };
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  }

  // 从 localStorage 恢复状态
  function restoreSession() {
    const savedToken = localStorage.getItem('token');
    const savedUserInfo = localStorage.getItem('userInfo');
    
    if (savedToken && savedUserInfo) {
      token.value = savedToken;
      userInfo.value = JSON.parse(savedUserInfo);
    }
  }

  return {
    // State
    userInfo,
    token,
    permissions,
    
    // Getters
    isLoggedIn,
    userName,
    hasPermission,
    
    // Actions
    login,
    logout,
    updateUserInfo,
    restoreSession
  };
});

/**
 * cart.store.js - 购物车状态管理（带持久化）
 */
export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  });

  function addItem(product) {
    const existingItem = items.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({
        ...product,
        quantity: 1
      });
    }
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        removeItem(productId);
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
}, {
  // 启用持久化
  persist: {
    key: 'shopping-cart',
    storage: localStorage,
    paths: ['items'] // 只持久化 items
  }
});
```

### 4.2 跨组件通信模式

#### 4.2.1 Provide / Inject

```vue
<!-- 父组件 -->
<script setup>
import { provide, ref, readonly } from 'vue';

/**
 * 主题管理示例
 */
const theme = ref('light');

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

// 提供响应式数据（只读）
provide('theme', readonly(theme));
provide('toggleTheme', toggleTheme);

/**
 * 复杂数据注入示例
 */
const appConfig = reactive({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  locale: 'zh-CN'
});

provide('appConfig', readonly(appConfig));
</script>

<!-- 子孙组件 -->
<script setup>
import { inject } from 'vue';

/**
 * 注入父组件提供的数据
 */
const theme = inject('theme');
const toggleTheme = inject('toggleTheme');

// 提供默认值
const appConfig = inject('appConfig', {
  apiUrl: 'https://default.api.com',
  timeout: 3000,
  locale: 'en-US'
});

// 使用
function handleClick() {
  toggleTheme();
  console.log('当前主题:', theme.value);
}
</script>
```

#### 4.2.2 事件总线 (EventBus)

```javascript
/**
 * eventBus.js - 全局事件总线
 */
import { reactive } from 'vue';

class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(callback);
    
    // 返回取消订阅函数
    return () => this.off(event, callback);
  }

  /**
   * 订阅一次性事件
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /**
   * 触发事件
   */
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        callback(...args);
      });
    }
  }

  /**
   * 取消订阅
   */
  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 清空所有事件
   */
  clear() {
    this.events.clear();
  }
}

// 创建全局事件总线实例
export const eventBus = new EventBus();

// 使用示例
// 组件 A
eventBus.on('user-updated', (userData) => {
  console.log('用户更新:', userData);
});

// 组件 B
eventBus.emit('user-updated', { name: '张三', age: 25 });
```

## 5. TypeScript 集成

### 5.1 组件类型定义

```vue
<script setup lang="ts">
/**
 * Props 类型定义
 */
interface Props {
  title: string;
  count?: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  onUpdate?: (value: number) => void;
}

/**
 * 使用 withDefaults 设置默认值
 */
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
});

/**
 * Emits 类型定义
 */
interface Emits {
  (e: 'update', value: number): void;
  (e: 'delete', id: number): void;
  (e: 'submit', data: { name: string; value: number }): void;
}

const emit = defineEmits<Emits>();

/**
 * 响应式数据类型
 */
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

const user = ref<User | null>(null);
const users = ref<User[]>([]);

/**
 * 计算属性类型推断
 */
const userNames = computed<string[]>(() => {
  return users.value.map(u => u.name);
});

/**
 * 函数类型定义
 */
function handleUpdate(value: number): void {
  emit('update', value);
}

async function fetchUser(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }
}
</script>
```

### 5.2 组合式函数类型定义

```typescript
/**
 * useCounter.ts - 计数器组合式函数（带类型）
 */
import { ref, computed, Ref } from 'vue';

interface UseCounterReturn {
  count: Ref<number>;
  doubleCount: Ref<number>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter(initialValue = 0): UseCounterReturn {
  const count = ref<number>(initialValue);

  const doubleCount = computed<number>(() => count.value * 2);

  function increment(): void {
    count.value++;
  }

  function decrement(): void {
    count.value--;
  }

  function reset(): void {
    count.value = initialValue;
  }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  };
}

/**
 * usePagination.ts - 分页组合式函数
 */
interface PaginationConfig {
  page?: number;
  pageSize?: number;
  total?: number;
}

interface UsePaginationReturn {
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;
  totalPages: Ref<number>;
  offset: Ref<number>;
  hasNext: Ref<boolean>;
  hasPrev: Ref<boolean>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setTotal: (total: number) => void;
}

export function usePagination(config: PaginationConfig = {}): UsePaginationReturn {
  const currentPage = ref<number>(config.page ?? 1);
  const pageSize = ref<number>(config.pageSize ?? 10);
  const total = ref<number>(config.total ?? 0);

  const totalPages = computed<number>(() => {
    return Math.ceil(total.value / pageSize.value);
  });

  const offset = computed<number>(() => {
    return (currentPage.value - 1) * pageSize.value;
  });

  const hasNext = computed<boolean>(() => {
    return currentPage.value < totalPages.value;
  });

  const hasPrev = computed<boolean>(() => {
    return currentPage.value > 1;
  });

  function nextPage(): void {
    if (hasNext.value) {
      currentPage.value++;
    }
  }

  function prevPage(): void {
    if (hasPrev.value) {
      currentPage.value--;
    }
  }

  function goToPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function setTotal(newTotal: number): void {
    total.value = newTotal;
    // 确保当前页不超出范围
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    offset,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
    setTotal
  };
}
```

## 6. 自定义指令

### 6.1 常用自定义指令

```javascript
/**
 * v-loading - 加载状态指令
 */
export const vLoading = {
  mounted(el, binding) {
    if (binding.value) {
      el.classList.add('loading');
      
      const loadingEl = document.createElement('div');
      loadingEl.className = 'loading-mask';
      loadingEl.innerHTML = '<div class="loading-spinner"></div>';
      
      el.style.position = 'relative';
      el.appendChild(loadingEl);
      el.__loadingEl__ = loadingEl;
    }
  },
  updated(el, binding) {
    if (binding.value) {
      if (!el.__loadingEl__) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-mask';
        loadingEl.innerHTML = '<div class="loading-spinner"></div>';
        
        el.style.position = 'relative';
        el.appendChild(loadingEl);
        el.__loadingEl__ = loadingEl;
      }
    } else {
      if (el.__loadingEl__) {
        el.removeChild(el.__loadingEl__);
        el.__loadingEl__ = null;
      }
    }
  }
};

/**
 * v-lazy - 图片懒加载指令
 */
export const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value;
          el.classList.add('loaded');
          observer.unobserve(el);
        }
      });
    });

    observer.observe(el);
    el.__lazyObserver__ = observer;
  },
  beforeUnmount(el) {
    if (el.__lazyObserver__) {
      el.__lazyObserver__.disconnect();
    }
  }
};

/**
 * v-debounce - 防抖指令
 */
export const vDebounce = {
  mounted(el, binding) {
    const { value, arg } = binding;
    const delay = parseInt(arg) || 300;
    let timer = null;

    el.addEventListener('input', (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value(event);
      }, delay);
    });

    el.__debounceTimer__ = timer;
  },
  beforeUnmount(el) {
    clearTimeout(el.__debounceTimer__);
  }
};

/**
 * v-permission - 权限控制指令
 */
export const vPermission = {
  mounted(el, binding) {
    const { value } = binding;
    const userPermissions = ['read', 'write']; // 从 store 获取
    
    const hasPermission = Array.isArray(value)
      ? value.some(p => userPermissions.includes(p))
      : userPermissions.includes(value);

    if (!hasPermission) {
      el.style.display = 'none';
      // 或者完全移除元素
      // el.parentNode?.removeChild(el);
    }
  }
};

/**
 * v-click-outside - 点击外部指令
 */
export const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutsideHandler__ = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.__clickOutsideHandler__);
  },
  beforeUnmount(el) {
    document.removeEventListener('click', el.__clickOutsideHandler__);
  }
};

// 注册全局指令
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.directive('loading', vLoading);
app.directive('lazy', vLazy);
app.directive('debounce', vDebounce);
app.directive('permission', vPermission);
app.directive('click-outside', vClickOutside);
```

使用示例：

```vue
<template>
  <div>
    <!-- 加载状态 -->
    <div v-loading="isLoading">内容区域</div>
    
    <!-- 图片懒加载 -->
    <img v-lazy="imageUrl" alt="懒加载图片" />
    
    <!-- 防抖输入 -->
    <input v-debounce:500="handleInput" />
    
    <!-- 权限控制 -->
    <button v-permission="'admin'">管理员按钮</button>
    <button v-permission="['admin', 'editor']">编辑按钮</button>
    
    <!-- 点击外部关闭 -->
    <div v-click-outside="closeDropdown">
      下拉菜单
    </div>
  </div>
</template>
```

## 7. 插件开发

### 7.1 自定义插件

```javascript
/**
 * toast.plugin.js - 消息提示插件
 */
import { createApp, h } from 'vue';

class Toast {
  constructor() {
    this.container = null;
  }

  /**
   * 显示消息
   * @param {string} message - 消息内容
   * @param {Object} options - 配置选项
   */
  show(message, options = {}) {
    const {
      type = 'info',
      duration = 3000,
      position = 'top'
    } = options;

    // 创建消息组件
    const ToastComponent = {
      setup() {
        return () => h(
          'div',
          {
            class: ['toast', `toast-${type}`, `toast-${position}`],
            style: {
              animation: 'slideIn 0.3s ease-out'
            }
          },
          message
        );
      }
    };

    // 创建容器
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }

    // 挂载组件
    const instance = createApp(ToastComponent);
    const mountNode = document.createElement('div');
    this.container.appendChild(mountNode);
    instance.mount(mountNode);

    // 自动移除
    setTimeout(() => {
      instance.unmount();
      this.container.removeChild(mountNode);
    }, duration);
  }

  success(message, options) {
    this.show(message, { ...options, type: 'success' });
  }

  error(message, options) {
    this.show(message, { ...options, type: 'error' });
  }

  warning(message, options) {
    this.show(message, { ...options, type: 'warning' });
  }

  info(message, options) {
    this.show(message, { ...options, type: 'info' });
  }
}

/**
 * Vue 插件定义
 */
export default {
  install(app, options = {}) {
    const toast = new Toast();
    
    // 全局属性
    app.config.globalProperties.$toast = toast;
    
    // 全局方法
    app.provide('toast', toast);
  }
};

// 使用方式 1: 通过 this.$toast
// this.$toast.success('操作成功！');

// 使用方式 2: 通过 inject
// const toast = inject('toast');
// toast.error('操作失败！');
```

### 7.2 全局配置插件

```javascript
/**
 * globalConfig.plugin.js - 全局配置插件
 */
export default {
  install(app, options = {}) {
    // 全局配置对象
    const globalConfig = {
      apiUrl: options.apiUrl || 'https://api.example.com',
      timeout: options.timeout || 5000,
      locale: options.locale || 'zh-CN',
      theme: options.theme || 'light'
    };

    // 全局属性
    app.config.globalProperties.$config = globalConfig;

    // 全局方法
    app.config.globalProperties.$api = function(endpoint) {
      return `${globalConfig.apiUrl}${endpoint}`;
    };

    // 提供给子组件
    app.provide('globalConfig', globalConfig);
  }
};
```

## 8. 进阶应用场景

### 8.1 动态组件与异步组件

```vue
<template>
  <div class="dynamic-tabs">
    <!-- Tab 切换按钮 -->
    <div class="tab-buttons">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 动态组件渲染 -->
    <Suspense>
      <template #default>
        <component :is="currentComponent" />
      </template>
      <template #fallback>
        <div class="loading">加载中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';

/**
 * Tab 配置
 */
const tabs = [
  { name: 'home', label: '首页', component: 'HomeTab' },
  { name: 'profile', label: '个人信息', component: 'ProfileTab' },
  { name: 'settings', label: '设置', component: 'SettingsTab' }
];

const currentTab = ref('home');

/**
 * 动态导入组件
 */
const components = {
  HomeTab: defineAsyncComponent(() => import('./tabs/HomeTab.vue')),
  ProfileTab: defineAsyncComponent(() => import('./tabs/ProfileTab.vue')),
  SettingsTab: defineAsyncComponent(() => import('./tabs/SettingsTab.vue'))
};

/**
 * 当前激活的组件
 */
const currentComponent = computed(() => {
  const tab = tabs.find(t => t.name === currentTab.value);
  return components[tab?.component];
});
</script>
```

### 8.2 Teleport 传送门

```vue
<template>
  <div class="app">
    <h1>我的应用</h1>
    
    <!-- 模态框内容传送到 body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ modalTitle }}</h2>
          <p>{{ modalContent }}</p>
          <button @click="closeModal">关闭</button>
        </div>
      </div>
    </Teleport>
    
    <!-- 多个传送门可以传送到同一个目标 -->
    <Teleport to="#notifications">
      <div v-if="hasNotification" class="notification">
        新消息通知
      </div>
    </Teleport>
    
    <!-- 条件禁用 Teleport -->
    <Teleport to="body" :disabled="!isMobile">
      <div class="mobile-menu">移动端菜单</div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const hasNotification = ref(false);
const isMobile = ref(window.innerWidth < 768);

function closeModal() {
  showModal.value = false;
}

function openModal(title, content) {
  modalTitle.value = title;
  modalContent.value = content;
  showModal.value = true;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
```

### 8.3 Suspense 异步组件

```vue
<template>
  <Suspense>
    <!-- 默认内容 -->
    <template #default>
      <AsyncDashboard />
    </template>
    
    <!-- 加载中显示的内容 -->
    <template #fallback>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

/**
 * 异步组件：setup 中有 async 操作
 */
const AsyncDashboard = defineAsyncComponent(() =>
  import('./components/Dashboard.vue')
);
</script>
```

Dashboard.vue 组件示例：

```vue
<script setup>
/**
 * 组件 setup 支持 async
 * Suspense 会等待异步操作完成
 */
const data = await fetchDashboardData();

async function fetchDashboardData() {
  const response = await fetch('/api/dashboard');
  return response.json();
}
</script>

<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    <div v-for="item in data" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

## 9. 性能优化实战

### 9.1 组件缓存与更新优化

```vue
<script setup>
import { ref, shallowRef, markRaw, triggerRef } from 'vue';

/**
 * shallowRef: 浅层响应式
 * 适用于大型对象，只追踪根级别的响应性
 */
const largeObject = shallowRef({
  level1: {
    level2: {
      level3: {
        data: []
      }
    }
  }
});

// 修改深层属性不会触发更新
largeObject.value.level1.level2.level3.data.push(1); // 不触发更新

// 需要手动触发
triggerRef(largeObject);

/**
 * markRaw: 标记对象永不转为响应式
 * 适用于第三方库实例、大型不可变数据
 */
const chartInstance = markRaw(new Chart());
const largeData = markRaw([ /* 大量数据 */ ]);

/**
 * shallowReactive: 浅层响应式对象
 */
import { shallowReactive } from 'vue';

const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
});

// 响应式
state.foo++;

// 不响应式
state.nested.bar++; // 不触发更新
```

### 9.2 列表渲染优化

```vue
<template>
  <div>
    <!-- 1. 使用 key 优化 -->
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    
    <!-- 2. v-memo 优化（Vue 3.2+） -->
    <div
      v-for="item in bigList"
      :key="item.id"
      v-memo="[item.id, item.selected]"
    >
      <!-- 只有 id 或 selected 变化时才重新渲染 -->
      <ItemComponent :data="item" />
    </div>
    
    <!-- 3. v-once 静态内容优化 -->
    <div v-once>
      <h1>{{ staticTitle }}</h1>
      <p>这部分内容只渲染一次</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: '商品1' },
  { id: 2, name: '商品2' }
]);

const bigList = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `项目 ${i}`,
    selected: false
  }))
);

const staticTitle = '这是静态标题';
</script>
```

### 9.3 代码分割与懒加载

```javascript
/**
 * router/index.js - 路由级别代码分割
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(
      /* webpackChunkName: "home" */
      '@/views/Home.vue'
    )
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "dashboard" */
      '@/views/Dashboard.vue'
    ),
    // 路由元信息
    meta: {
      requiresAuth: true,
      title: '仪表盘'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(
      /* webpackChunkName: "admin" */
      '@/views/Admin.vue'
    ),
    // 嵌套路由也支持懒加载
    children: [
      {
        path: 'users',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/admin/Settings.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫示例
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题';
  
  // 权限检查
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export default router;
```

## 10. 实战技巧

### 10.1 表单处理进阶

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- 使用 v-model 修饰符 -->
    <input v-model.trim="form.username" placeholder="用户名" />
    <input v-model.number="form.age" type="number" placeholder="年龄" />
    <input v-model.lazy="form.email" placeholder="邮箱（失焦更新）" />
    
    <!-- 复选框 -->
    <label v-for="hobby in hobbies" :key="hobby">
      <input type="checkbox" v-model="form.selectedHobbies" :value="hobby" />
      {{ hobby }}
    </label>
    
    <!-- 单选框 -->
    <label v-for="gender in genders" :key="gender">
      <input type="radio" v-model="form.gender" :value="gender" />
      {{ gender }}
    </label>
    
    <!-- 下拉选择 -->
    <select v-model="form.city">
      <option disabled value="">请选择城市</option>
      <option v-for="city in cities" :key="city" :value="city">
        {{ city }}
      </option>
    </select>
    
    <button type="submit" :disabled="!isValid">提交</button>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue';

/**
 * 表单数据
 */
const form = reactive({
  username: '',
  age: null,
  email: '',
  selectedHobbies: [],
  gender: '',
  city: ''
});

const hobbies = ['阅读', '运动', '音乐', '旅游'];
const genders = ['男', '女'];
const cities = ['北京', '上海', '广州', '深圳'];

/**
 * 表单验证
 */
const isValid = computed(() => {
  return (
    form.username.length >= 3 &&
    form.age > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.gender &&
    form.city
  );
});

/**
 * 提交处理
 */
async function handleSubmit() {
  if (!isValid.value) {
    alert('请填写完整的表单');
    return;
  }

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    console.log('提交成功:', result);
  } catch (error) {
    console.error('提交失败:', error);
  }
}
</script>
```

### 10.2 自定义 v-model

```vue
<!-- CustomInput.vue -->
<template>
  <div class="custom-input">
    <label v-if="label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<script setup>
/**
 * 自定义 v-model 组件
 */
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: String,
  placeholder: String,
  validator: Function
});

const emit = defineEmits(['update:modelValue', 'blur']);

const error = ref('');

function handleInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  
  // 实时验证
  if (props.validator) {
    const result = props.validator(value);
    error.value = result === true ? '' : result;
  }
}

function handleBlur(event) {
  emit('blur', event);
}
</script>

<!-- 使用示例 -->
<template>
  <CustomInput
    v-model="username"
    label="用户名"
    placeholder="请输入用户名"
    :validator="validateUsername"
    @blur="handleBlur"
  />
</template>

<script setup>
import CustomInput from './CustomInput.vue';

const username = ref('');

function validateUsername(value) {
  if (!value) return '用户名不能为空';
  if (value.length < 3) return '用户名至少3个字符';
  if (value.length > 20) return '用户名最多20个字符';
  return true;
}

function handleBlur() {
  console.log('输入框失焦');
}
</script>
```

### 10.3 多个 v-model 绑定

```vue
<!-- UserForm.vue -->
<template>
  <div class="user-form">
    <input :value="firstName" @input="$emit('update:firstName', $event.target.value)" />
    <input :value="lastName" @input="$emit('update:lastName', $event.target.value)" />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
  </div>
</template>

<script setup>
defineProps({
  firstName: String,
  lastName: String,
  email: String
});

defineEmits(['update:firstName', 'update:lastName', 'update:email']);
</script>

<!-- 使用组件 -->
<template>
  <UserForm
    v-model:first-name="user.firstName"
    v-model:last-name="user.lastName"
    v-model:email="user.email"
  />
  
  <p>姓名: {{ user.firstName }} {{ user.lastName }}</p>
  <p>邮箱: {{ user.email }}</p>
</template>

<script setup>
import { reactive } from 'vue';

const user = reactive({
  firstName: '',
  lastName: '',
  email: ''
});
</script>
```

## 11. 测试与调试

### 11.1 单元测试

```javascript
/**
 * counter.spec.js - 组件单元测试
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.vue';

describe('Counter Component', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 5
      }
    });
    
    expect(wrapper.text()).toContain('5');
  });

  it('increments count when button clicked', async () => {
    const wrapper = mount(Counter);
    const button = wrapper.find('button');
    
    await button.trigger('click');
    
    expect(wrapper.vm.count).toBe(1);
    expect(wrapper.text()).toContain('1');
  });

  it('emits update event', async () => {
    const wrapper = mount(Counter);
    const button = wrapper.find('button');
    
    await button.trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('update');
    expect(wrapper.emitted('update')[0]).toEqual([1]);
  });
});

/**
 * composables.spec.js - 组合式函数测试
 */
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter();
    expect(count.value).toBe(0);
  });

  it('initializes with custom value', () => {
    const { count } = useCounter(10);
    expect(count.value).toBe(10);
  });

  it('increments count', () => {
    const { count, increment } = useCounter();
    increment();
    expect(count.value).toBe(1);
  });

  it('decrements count', () => {
    const { count, decrement } = useCounter(5);
    decrement();
    expect(count.value).toBe(4);
  });
});
```

### 11.2 Vue DevTools 调试技巧

```javascript
/**
 * 在组件中添加调试标识
 */
export default {
  name: 'DebugComponent',
  __VUE_DEVTOOLS_UID__: 'my-debug-component',
  
  setup() {
    // 使用 debugger 断点
    const handleClick = () => {
      debugger; // 代码会在此暂停
      console.log('处理点击事件');
    };
    
    // 性能追踪
    performance.mark('start-operation');
    // ... 执行操作
    performance.mark('end-operation');
    performance.measure('operation', 'start-operation', 'end-operation');
    
    const measurements = performance.getEntriesByType('measure');
    console.log('操作耗时:', measurements);
    
    return {
      handleClick
    };
  }
};
```

## 12. 最佳实践总结

### 12.1 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **Props 向下，Events 向上**: 数据流清晰
3. **组合优于继承**: 使用组合式函数复用逻辑
4. **合理使用 slot**: 提高组件灵活性
5. **类型安全**: 使用 TypeScript 定义类型

### 12.2 性能优化清单

- [ ] 使用 `computed` 缓存计算结果
- [ ] 使用 `v-memo` 优化列表渲染
- [ ] 使用 `shallowRef/shallowReactive` 处理大对象
- [ ] 使用 `markRaw` 标记不需要响应式的对象
- [ ] 使用 `keep-alive` 缓存组件
- [ ] 路由和组件懒加载
- [ ] 使用虚拟滚动处理大列表
- [ ] 合理使用 `watchEffect` 而非多个 `watch`

### 12.3 代码组织建议

```
src/
├── components/         # 公共组件
│   ├── base/          # 基础组件
│   ├── business/      # 业务组件
│   └── layout/        # 布局组件
├── composables/       # 组合式函数
│   ├── useMouse.js
│   ├── useFetch.js
│   └── useLocalStorage.js
├── directives/        # 自定义指令
│   ├── loading.js
│   └── permission.js
├── plugins/           # 插件
│   └── toast.js
├── stores/            # 状态管理
│   ├── user.js
│   └── cart.js
├── utils/             # 工具函数
│   ├── request.js
│   └── validators.js
├── views/             # 页面组件
└── router/            # 路由配置
```

## 13. 参考资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue 3 Composition API RFC](https://github.com/vuejs/rfcs)
- [VueUse 工具库](https://vueuse.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Vitest 测试框架](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
