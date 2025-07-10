---
title: Svelte 前端框架
description: Svelte 完整开发指南，包含组件、状态管理、路由、构建等核心特性
outline: deep
---

# Svelte 前端框架

## 1. 概述

Svelte 是一个构建用户界面的工具，与 React 和 Vue 等传统框架不同，Svelte 是一个编译器，它在构建时将组件转换为高效的命令式代码，直接操作 DOM。

### 1.1 核心特性

- **无虚拟 DOM**: 直接操作 DOM，性能更优
- **更小的包体积**: 编译时优化，产生更小的 JavaScript 代码
- **简洁的语法**: 减少样板代码，提高开发效率
- **内置响应式**: 响应式系统内置在语言中
- **组件化**: 基于组件的开发模式
- **渐进式**: 可以逐步采用，兼容现有项目

### 1.2 核心优势

#### 性能优异
- **编译时优化**: 在构建时生成优化的 JavaScript 代码
- **无运行时开销**: 没有虚拟 DOM 的性能损耗
- **代码分割**: 自动进行代码分割和懒加载
- **Tree-shaking**: 自动移除未使用的代码

#### 开发体验
- **简洁语法**: 更接近原生 HTML、CSS 和 JavaScript
- **内置功能**: 状态管理、动画、过渡等内置支持
- **类型安全**: 完整的 TypeScript 支持
- **热重载**: 快速的开发体验

#### 学习成本低
- **接近原生**: 基于 Web 标准，学习曲线平缓
- **文档完善**: 详细的官方文档和教程
- **社区活跃**: 不断增长的开发者社区

## 2. 安装与设置

### 2.1 创建新项目

```bash
# 使用 create-svelte 创建项目
npm create svelte@latest my-svelte-app
cd my-svelte-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2.2 项目结构

```
my-svelte-app/
├── src/
│   ├── lib/              # 可重用的组件和工具
│   ├── routes/           # 路由页面（SvelteKit）
│   ├── app.html          # HTML 模板
│   └── app.js            # 入口文件
├── static/               # 静态资源
├── tests/                # 测试文件
├── package.json          # 项目配置
├── svelte.config.js      # Svelte 配置
└── vite.config.js        # Vite 配置
```

### 2.3 基本配置

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};
```

## 3. 基础语法

### 3.1 组件结构

```svelte
<!-- App.svelte -->
<script>
  // JavaScript 逻辑
  let name = 'Svelte';
  let count = 0;
  
  function handleClick() {
    count += 1;
  }
</script>

<!-- HTML 模板 -->
<main>
  <h1>Hello {name}!</h1>
  <button on:click={handleClick}>
    点击了 {count} 次
  </button>
</main>

<!-- CSS 样式 -->
<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  
  button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 0.5em 1em;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
```

### 3.2 响应式变量

```svelte
<script>
  let count = 0;
  
  // 响应式声明
  $: doubled = count * 2;
  $: quadrupled = doubled * 2;
  
  // 响应式语句
  $: if (count >= 10) {
    alert('count is dangerously high!');
    count = 9;
  }
  
  // 响应式块
  $: {
    console.log('count is', count);
    console.log('doubled is', doubled);
  }
  
  function handleClick() {
    count += 1;
  }
</script>

<button on:click={handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<p>{count} doubled is {doubled}</p>
<p>{doubled} doubled is {quadrupled}</p>
```

### 3.3 Props 传递

```svelte
<!-- Child.svelte -->
<script>
  export let name;
  export let age = 0;
  export let active = false;
</script>

<div class="child" class:active>
  <h2>Hello {name}!</h2>
  <p>Age: {age}</p>
</div>

<style>
  .child {
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .active {
    background: #f0f8ff;
    border-color: #007bff;
  }
</style>
```

```svelte
<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  let users = [
    { name: '张三', age: 25, active: true },
    { name: '李四', age: 30, active: false }
  ];
</script>

{#each users as user}
  <Child 
    name={user.name} 
    age={user.age} 
    active={user.active} 
  />
{/each}
```

## 4. 条件与循环

### 4.1 条件渲染

```svelte
<script>
  let user = { loggedIn: false };
  let count = 0;
  
  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>

<!-- if/else -->
{#if user.loggedIn}
  <button on:click={toggle}>
    退出登录
  </button>
{:else}
  <button on:click={toggle}>
    登录
  </button>
{/if}

<!-- else if -->
{#if count > 10}
  <p>count is greater than 10</p>
{:else if count < 5}
  <p>count is less than 5</p>
{:else}
  <p>count is between 5 and 10</p>
{/if}
```

### 4.2 列表渲染

```svelte
<script>
  let cats = [
    { id: 'J---aiyznGQ', name: 'Keyboard Cat' },
    { id: 'z_AbfPXTKms', name: 'Maru' },
    { id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
  ];
  
  function addCat() {
    cats = [...cats, {
      id: crypto.randomUUID(),
      name: `Cat ${cats.length + 1}`
    }];
  }
  
  function removeCat(id) {
    cats = cats.filter(cat => cat.id !== id);
  }
</script>

<button on:click={addCat}>
  添加猫咪
</button>

{#each cats as cat (cat.id)}
  <div class="cat-item">
    <h3>{cat.name}</h3>
    <button on:click={() => removeCat(cat.id)}>
      删除
    </button>
  </div>
{:else}
  <p>没有猫咪</p>
{/each}

<style>
  .cat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    border-bottom: 1px solid #eee;
  }
</style>
```

## 5. 事件处理

### 5.1 基本事件

```svelte
<script>
  let m = { x: 0, y: 0 };
  let clicked = false;
  
  function handleMouseMove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }
  
  function handleClick() {
    clicked = !clicked;
  }
</script>

<div 
  class="container" 
  on:mousemove={handleMouseMove}
  on:click={handleClick}
>
  <h1>鼠标位置：{m.x} x {m.y}</h1>
  <p>点击状态：{clicked ? '已点击' : '未点击'}</p>
</div>

<style>
  .container {
    width: 100%;
    height: 100vh;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
```

### 5.2 事件修饰符

```svelte
<script>
  function handleClick() {
    alert('clicked');
  }
  
  function handleSubmit() {
    alert('submitted');
  }
</script>

<!-- 阻止默认行为 -->
<button on:click|preventDefault={handleClick}>
  阻止默认行为
</button>

<!-- 阻止事件冒泡 -->
<button on:click|stopPropagation={handleClick}>
  阻止事件冒泡
</button>

<!-- 只触发一次 -->
<button on:click|once={handleClick}>
  只触发一次
</button>

<!-- 被动监听 -->
<button on:click|passive={handleClick}>
  被动监听
</button>

<!-- 组合修饰符 -->
<form on:submit|preventDefault|stopPropagation={handleSubmit}>
  <button type="submit">提交</button>
</form>
```

### 5.3 自定义事件

```svelte
<!-- CustomButton.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let disabled = false;
  export let type = 'button';
  
  function handleClick() {
    if (!disabled) {
      dispatch('click', {
        message: '自定义按钮被点击了'
      });
    }
  }
</script>

<button 
  {type} 
  {disabled}
  on:click={handleClick}
>
  <slot>按钮</slot>
</button>
```

```svelte
<!-- App.svelte -->
<script>
  import CustomButton from './CustomButton.svelte';
  
  function handleCustomClick(event) {
    console.log('收到自定义事件:', event.detail);
    alert(event.detail.message);
  }
</script>

<CustomButton on:click={handleCustomClick}>
  自定义按钮
</CustomButton>
```

## 6. 绑定

### 6.1 输入绑定

```svelte
<script>
  let name = 'world';
  let message = '';
  let agreed = false;
  let picked = '';
  let flavours = ['cookies and cream'];
  
  let menu = [
    'cookies and cream',
    'mint choc chip',
    'raspberry ripple'
  ];
</script>

<!-- 文本输入 -->
<input bind:value={name} />
<h1>Hello {name}!</h1>

<!-- 多行文本 -->
<textarea bind:value={message}></textarea>
<p>消息长度: {message.length}</p>

<!-- 复选框 -->
<label>
  <input type="checkbox" bind:checked={agreed} />
  我同意条款
</label>

<!-- 单选框 -->
<label>
  <input type="radio" bind:group={picked} value="red" />
  红色
</label>
<label>
  <input type="radio" bind:group={picked} value="blue" />
  蓝色
</label>
<p>选择的颜色: {picked}</p>

<!-- 多选框 -->
{#each menu as flavour}
  <label>
    <input 
      type="checkbox" 
      bind:group={flavours} 
      value={flavour} 
    />
    {flavour}
  </label>
{/each}
<p>选择的口味: {flavours.join(', ')}</p>
```

### 6.2 元素绑定

```svelte
<script>
  let canvas;
  let photo;
  let w, h;
  
  function handleClick() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ff3e00';
    ctx.fillRect(0, 0, w, h);
  }
</script>

<!-- 绑定 DOM 元素 -->
<canvas
  bind:this={canvas}
  bind:clientWidth={w}
  bind:clientHeight={h}
  width={w}
  height={h}
></canvas>

<button on:click={handleClick}>
  绘制红色矩形
</button>

<p>Canvas 尺寸: {w} × {h}</p>

<!-- 绑定媒体元素 -->
<video
  bind:this={photo}
  bind:currentTime={time}
  bind:duration
  bind:paused
>
  <source src="video.mp4" type="video/mp4" />
</video>
```

## 7. 组件通信

### 7.1 父子组件通信

```svelte
<!-- Counter.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  export let count = 0;
  export let step = 1;
  
  const dispatch = createEventDispatcher();
  
  function increment() {
    count += step;
    dispatch('change', { count });
  }
  
  function decrement() {
    count -= step;
    dispatch('change', { count });
  }
</script>

<div class="counter">
  <button on:click={decrement}>-</button>
  <span>{count}</span>
  <button on:click={increment}>+</button>
</div>

<style>
  .counter {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 2em;
    height: 2em;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 50%;
    cursor: pointer;
  }
  
  span {
    font-size: 1.2em;
    font-weight: bold;
    min-width: 2em;
    text-align: center;
  }
</style>
```

```svelte
<!-- App.svelte -->
<script>
  import Counter from './Counter.svelte';
  
  let total = 0;
  let counters = [
    { id: 1, count: 0, step: 1 },
    { id: 2, count: 0, step: 5 },
    { id: 3, count: 0, step: 10 }
  ];
  
  function handleChange(id, event) {
    const counter = counters.find(c => c.id === id);
    if (counter) {
      counter.count = event.detail.count;
      total = counters.reduce((sum, c) => sum + c.count, 0);
    }
  }
</script>

<h1>计数器集合</h1>
<p>总计: {total}</p>

{#each counters as counter (counter.id)}
  <Counter
    bind:count={counter.count}
    step={counter.step}
    on:change={(event) => handleChange(counter.id, event)}
  />
{/each}
```

### 7.2 插槽 (Slots)

```svelte
<!-- Card.svelte -->
<script>
  export let title;
  export let variant = 'default';
</script>

<div class="card" class:variant>
  <header class="card-header">
    <h3>{title}</h3>
    <slot name="actions"></slot>
  </header>
  
  <main class="card-content">
    <slot></slot>
  </main>
  
  <footer class="card-footer">
    <slot name="footer">
      <p>默认底部内容</p>
    </slot>
  </footer>
</div>

<style>
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    margin: 1em 0;
  }
  
  .card.variant {
    border-color: #007bff;
  }
  
  .card-header {
    background: #f8f9fa;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-content {
    padding: 1em;
  }
  
  .card-footer {
    background: #f8f9fa;
    padding: 1em;
    border-top: 1px solid #ddd;
  }
</style>
```

```svelte
<!-- App.svelte -->
<script>
  import Card from './Card.svelte';
</script>

<Card title="用户信息" variant="primary">
  <div slot="actions">
    <button>编辑</button>
    <button>删除</button>
  </div>
  
  <p>这是卡片的主要内容。</p>
  <p>可以包含任何 HTML 内容。</p>
  
  <div slot="footer">
    <small>最后更新: 2024-01-01</small>
  </div>
</Card>
```

## 8. 存储 (Stores)

### 8.1 可写存储

```javascript
// stores.js
import { writable } from 'svelte/store';

export const count = writable(0);
export const name = writable('world');

// 带有初始值和自定义逻辑的存储
export function createCounter(initialValue = 0) {
  const { subscribe, set, update } = writable(initialValue);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(initialValue)
  };
}
```

```svelte
<!-- App.svelte -->
<script>
  import { count, name } from './stores.js';
  
  // 自动订阅语法
  $: doubled = $count * 2;
  
  function increment() {
    count.update(n => n + 1);
  }
  
  function decrement() {
    count.update(n => n - 1);
  }
  
  function reset() {
    count.set(0);
  }
</script>

<h1>Hello {$name}!</h1>
<p>Count: {$count}</p>
<p>Doubled: {doubled}</p>

<button on:click={increment}>+</button>
<button on:click={decrement}>-</button>
<button on:click={reset}>重置</button>

<input bind:value={$name} />
```

### 8.2 只读存储

```javascript
// stores.js
import { readable } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return function stop() {
    clearInterval(interval);
  };
});

// 基于其他存储的派生存储
import { derived } from 'svelte/store';

export const elapsed = derived(
  time,
  $time => Math.round(($time - start) / 1000)
);

const start = new Date();
```

```svelte
<!-- Clock.svelte -->
<script>
  import { time, elapsed } from './stores.js';
  
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
</script>

<h1>当前时间</h1>
<p>{formatter.format($time)}</p>
<p>已过时间: {$elapsed} 秒</p>
```

### 8.3 派生存储

```javascript
// stores.js
import { writable, derived } from 'svelte/store';

export const todos = writable([]);

export const completedTodos = derived(
  todos,
  $todos => $todos.filter(todo => todo.completed)
);

export const pendingTodos = derived(
  todos,
  $todos => $todos.filter(todo => !todo.completed)
);

export const todoStats = derived(
  todos,
  $todos => ({
    total: $todos.length,
    completed: $todos.filter(t => t.completed).length,
    pending: $todos.filter(t => !t.completed).length
  })
);
```

## 9. 生命周期

### 9.1 基本生命周期

```svelte
<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
  
  let count = 0;
  let timer;
  
  // 组件挂载后
  onMount(() => {
    console.log('组件已挂载');
    
    timer = setInterval(() => {
      count += 1;
    }, 1000);
    
    // 返回清理函数
    return () => {
      console.log('组件即将卸载');
      clearInterval(timer);
    };
  });
  
  // 组件卸载前
  onDestroy(() => {
    console.log('组件已卸载');
  });
  
  // 组件更新前
  beforeUpdate(() => {
    console.log('组件更新前, count:', count);
  });
  
  // 组件更新后
  afterUpdate(() => {
    console.log('组件更新后, count:', count);
  });
</script>

<h1>计数器: {count}</h1>
```

### 9.2 tick 函数

```svelte
<script>
  import { tick } from 'svelte';
  
  let text = 'Hello';
  let div;
  
  async function handleClick() {
    text = 'World';
    
    // 等待 DOM 更新完成
    await tick();
    
    console.log('DOM 已更新');
    console.log('div.textContent:', div.textContent);
  }
</script>

<div bind:this={div}>{text}</div>
<button on:click={handleClick}>更新文本</button>
```

## 10. 动画与过渡

### 10.1 过渡效果

```svelte
<script>
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let visible = true;
  
  function toggle() {
    visible = !visible;
  }
</script>

<button on:click={toggle}>
  {visible ? '隐藏' : '显示'}
</button>

{#if visible}
  <div transition:fade>
    淡入淡出效果
  </div>
{/if}

{#if visible}
  <div transition:fly={{ y: 200, duration: 2000 }}>
    飞入飞出效果
  </div>
{/if}

{#if visible}
  <div transition:slide>
    滑动效果
  </div>
{/if}

{#if visible}
  <div transition:scale={{ 
    duration: 2000, 
    opacity: 0.5, 
    start: 0.5, 
    easing: quintOut 
  }}>
    缩放效果
  </div>
{/if}
```

### 10.2 自定义过渡

```svelte
<script>
  import { cubicOut } from 'svelte/easing';
  
  let visible = true;
  
  function spin(node, { duration }) {
    return {
      duration,
      css: t => {
        const eased = cubicOut(t);
        return `
          transform: scale(${eased}) rotate(${eased * 1080}deg);
          opacity: ${eased};
        `;
      }
    };
  }
  
  function typewriter(node, { speed = 50 }) {
    const valid = node.childNodes.length === 1 && 
                  node.childNodes[0].nodeType === Node.TEXT_NODE;
    
    if (!valid) {
      throw new Error('This transition only works on elements with a single text node child');
    }
    
    const text = node.textContent;
    const duration = text.length * speed;
    
    return {
      duration,
      tick: t => {
        const i = ~~(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
</script>

<button on:click={() => visible = !visible}>
  {visible ? '隐藏' : '显示'}
</button>

{#if visible}
  <div transition:spin={{ duration: 2000 }}>
    旋转效果
  </div>
{/if}

{#if visible}
  <p transition:typewriter={{ speed: 100 }}>
    打字机效果：这段文字会像打字机一样逐字出现
  </p>
{/if}
```

## 11. 动作 (Actions)

### 11.1 基本动作

```svelte
<script>
  function clickOutside(node) {
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(new CustomEvent('click_outside', node));
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
  
  function longpress(node, duration = 500) {
    let timer;
    
    const handleMousedown = () => {
      timer = setTimeout(() => {
        node.dispatchEvent(new CustomEvent('longpress'));
      }, duration);
    };
    
    const handleMouseup = () => {
      clearTimeout(timer);
    };
    
    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('mouseup', handleMouseup);
    
    return {
      update(newDuration) {
        duration = newDuration;
      },
      destroy() {
        node.removeEventListener('mousedown', handleMousedown);
        node.removeEventListener('mouseup', handleMouseup);
      }
    };
  }
  
  let showModal = false;
  
  function handleClickOutside() {
    showModal = false;
  }
  
  function handleLongpress() {
    alert('长按触发！');
  }
</script>

<button on:click={() => showModal = true}>
  打开模态框
</button>

{#if showModal}
  <div class="modal-backdrop">
    <div 
      class="modal" 
      use:clickOutside 
      on:click_outside={handleClickOutside}
    >
      <h2>模态框</h2>
      <p>点击外部关闭</p>
    </div>
  </div>
{/if}

<button 
  use:longpress={1000}
  on:longpress={handleLongpress}
>
  长按我
</button>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 2em;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
  }
</style>
```

## 12. 最佳实践

### 12.1 组件设计原则

- **单一职责**: 每个组件应该有明确的职责
- **可复用性**: 设计通用的、可配置的组件
- **接口清晰**: 明确的 props 和事件接口
- **状态管理**: 合理使用本地状态和全局状态

### 12.2 性能优化

- **避免不必要的重新计算**: 使用 `$:` 语法进行响应式计算
- **合理使用 keyed each**: 为列表项提供唯一的键
- **懒加载**: 使用动态导入进行代码分割
- **避免内存泄漏**: 正确清理定时器和事件监听器

### 12.3 代码组织

```javascript
// utils/validation.js
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// stores/auth.js
import { writable } from 'svelte/store';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    isLoading: false,
    error: null
  });
  
  return {
    subscribe,
    login: async (credentials) => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const user = await api.login(credentials);
        set({ user, isLoading: false, error: null });
      } catch (error) {
        set({ user: null, isLoading: false, error: error.message });
      }
    },
    logout: () => {
      set({ user: null, isLoading: false, error: null });
    }
  };
}

export const auth = createAuthStore();
```

## 13. 常见问题

### 13.1 响应式问题

**问题**: 数组或对象更新后页面不更新

**解决方案**: 使用不可变更新方式

```svelte
<script>
  let items = [1, 2, 3];
  
  // 错误的方式
  function addItem() {
    items.push(items.length + 1); // 不会触发更新
  }
  
  // 正确的方式
  function addItem() {
    items = [...items, items.length + 1];
  }
</script>
```

### 13.2 生命周期问题

**问题**: 在错误的生命周期中执行操作

**解决方案**: 理解各生命周期的执行时机

```svelte
<script>
  import { onMount } from 'svelte';
  
  let element;
  
  // 错误：在脚本顶层访问 DOM
  // console.log(element); // undefined
  
  // 正确：在 onMount 中访问 DOM
  onMount(() => {
    console.log(element); // DOM 元素
  });
</script>

<div bind:this={element}>内容</div>
```

## 14. 总结

### 14.1 核心优势

Svelte 作为现代前端框架，具有以下优势：

- **性能优异**: 编译时优化，运行时性能出色
- **体积小**: 生成的代码体积小，加载速度快
- **开发体验**: 简洁的语法，快速的开发体验
- **生态丰富**: 不断完善的生态系统和工具链

### 14.2 适用场景

- **高性能应用**: 对性能要求较高的应用
- **移动端应用**: 需要优化包体积和性能的移动应用
- **组件库**: 构建轻量级的组件库
- **渐进式采用**: 在现有项目中逐步引入

### 14.3 发展前景

随着 Web 应用性能要求的不断提高，Svelte 的编译时优化理念将会得到更广泛的认可和应用。其简洁的语法和优秀的性能使其成为前端开发的重要选择。
