## pinia 介绍

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。

- 测试工具集
- 插件：可通过插件扩展 Pinia 功能
- 为 JS 开发者提供适当的 TypeScript 支持以及自动补全功能。
- 支持服务端渲染
- Devtools 支持
  - 追踪 actions、mutations 的时间线
  - 在组件中展示它们所用到的 Store
  - 让调试更容易的 Time travel
- 热更新
  - 不必重载页面即可修改 Store
  - 开发时可保持当前的 State

**_对比 Vuex：_**

与 Vuex 相比，Pinia 不仅提供了一个更简单的 API，也提供了符合组合式 API 风格的 API，最重要的是，搭配 TypeScript 一起使用时有非常可靠的类型推断支持。

- mutation 已被弃用。它们经常被认为是极其冗余的。它们初衷是带来 devtools 的集成方案，但这已不再是一个问题了。
- 无需要创建自定义的复杂包装器来支持 TypeScript，一切都可标注类型，API 的设计方式是尽可能地利用 TS 类型推理。
- 无过多的魔法字符串注入，只需要导入函数并调用它们，然后享受自动补全的乐趣就好。
- 无需要动态添加 Store，它们默认都是动态的。
- 不再有嵌套结构的模块。但仍然可以通过导入和使用另一个 Store 来隐含地嵌套 stores 空间。
- 不再有可命名的模块。考虑到 Store 的扁平架构，Store 的命名取决于它们的定义方式，你甚至可以说所有 Store 都应该命名。

## 定义 Store

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，它承载着全局状态。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有三个概念，state、getter 和 action，相当于组件中的 data、 computed 和 methods。

> 一个 Store 应该包含可以在整个应用中访问的数据

```js
// stores/counter.js
import { defineStore } from "pinia";

/**
 * 使用类似vuex的定义方式Store。
 * @storeId 应用中 Store 的唯一 ID。
 * @object|function Setup 函数或 Option 对象。定义store内容
 * @return store实例，名称最好use开头，Store结尾，
 */
export const useCounterStore = defineStore("counter", {
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
  getters: {
    double: state => state.count * 2,
    finishedTodos(state) {
      // 自动补全！ ✨
      return state.todos.filter(todo => todo.isFinished);
    },
    unfinishedTodos(state) {
      return state.todos.filter(todo => !todo.isFinished);
    },
    /**
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
  // 也可以这样定义 state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++;
    },
    // 接受任何数量的参数，返回一个 Promise 或不返回
    addTodo(text) {
      // 你可以直接变更该状态
      this.todos.push({ text, id: this.nextId++, isFinished: false });
    },
  },
});

/**
 * 使用hooks定义方式定义Store
 * ref() 就是 state 属性
 * computed() 就是 getters
 * function() 就是 actions
 * @return object 想暴露出去的属性和方法的对象。
 */
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }

  // 返回想暴露出去的属性和方法的对象。
  return { count, increment };
});

// 其他Store
const useUserStore = defineStore("user", {
  // ...
});
```

## 注册 pinia

```js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

// 注册好pinia之后，才可以使用store
app.use(pinia);
app.mount("#app");
```

## 使用 Store

```vue
<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
</template>

<script setup>
/**
 * 使用组合式API
 */
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

counter.count++
// 自动补全！ ✨
counter.$patch({ count: counter.count + 1 })
// 或使用 action 代替
counter.increment()


/**
 * 使用选项式API
 */
export default defineComponent({
  computed: {
    // 允许访问 this.counterStore 和 this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // 允许读取 this.count 和 this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // 允许读取 this.increment()
    ...mapActions(useCounterStore, ['increment']),
    test(){
      console.log(this.count,this.double,this.inscrement())
    }
  },
})
</script>
```

## pinia 插件

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 context。

> 插件只会应用于在 pinia 传递给应用后创建的 store，否则它们不会生效。

> 每个 store 都被 reactive 包装过，所以可以自动解包任何它所包含的 Ref(ref()、computed()...)。

> 这就是在没有 .value 的情况下你依旧可以访问所有计算属性的原因，也是它们为什么是响应式的原因。

```js
export function myPiniaPlugin(context) {
  context.pinia; // 用 `createPinia()` 创建的 pinia。
  context.app; // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store; // 该插件想扩展的 store
  context.options; // 定义传给 `defineStore()` 的 store 的可选对象。

  // 每个 store 都添加有单独的 `hello` 属性
  store.hello = ref("secret");
  // 它会被自动解包
  store.hello; // 'secret'

  // 所有的 store 都在共享 `shared` 属性的值
  store.shared = sharedRef;
  store.shared; // 'shared'

  //插件中使用 store.$subscribe 和 store.$onAction 。
  store.$subscribe(() => {
    // 响应 store 变化
  });
  store.$onAction(() => {
    // 响应 store actions
  });

  return { addAttri: "返回值是会添加给每个store的属性" };
}

//然后用 pinia.use() 将这个函数传给 pinia：
pinia.use(myPiniaPlugin);
```

## store 测试

- 要对一个 store 进行单元测试，最重要的是创建一个 pinia 实例：

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from "pinia";
import { useCounter } from "../src/stores/counter";

describe("Counter Store", () => {
  beforeEach(() => {
    // 创建一个新 pinia，并使其处于激活状态，这样它就会被任何 useStore() 调用自动接收
    // 而不需要手动传递：
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("increments", () => {
    const counter = useCounter();
    expect(counter.n).toBe(0);
    counter.increment();
    expect(counter.n).toBe(1);
  });

  it("increments by amount", () => {
    const counter = useCounter();
    counter.increment(10);
    expect(counter.n).toBe(10);
  });
});
```

- 对组件单元测试  
  这可以通过 createTestingPinia() 实现，它会返回一个仅用于帮助对组件单元测试的 pinia 实例。

```js
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
// 引入任何你想要测试的 store
import { useSomeStore } from "@/stores/myStore";

const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        //在创建测试 Pinia 时，通过 initialState 对象来设置所有 store 的初始状态。
        initialState: {
          counter: { n: 20 }, //从 20 开始计数，而不是 0
        },
        //默认会存根 (stub) 出所有的 store action。这样可以让你独立测试你的组件和 store
        stubActions: true,
      }),
    ],
  },
});

const store = useSomeStore(); // 使用 pinia 的测试实例!
store.n; // 20
// 可直接操作 state
store.name = "my new name";
// 也可以通过 patch 来完成
store.$patch({ name: "new name" });
expect(store.name).toBe("new name");

// action 默认是存根的(stubbed)，意味着它们默认不执行其代码。
// 请看下面的内容来定制这一行为。
store.someAction();
expect(store.someAction).toHaveBeenCalledTimes(1);
expect(store.someAction).toHaveBeenLastCalledWith();

// stubActions: false ，这个调用将由 store 定义的实现执行。
store.someAction();
// ...但它仍然被一个 spy 包装着，所以你可以检查调用
expect(store.someAction).toHaveBeenCalledTimes(1);
```

## VSCode 代码片段

```json
{
  "Pinia Options Store Boilerplate": {
    "scope": "javascript,typescript",
    "prefix": "pinia-options",
    "body": [
      "import { defineStore, acceptHMRUpdate } from 'pinia'",
      "",
      "export const use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store = defineStore('$TM_FILENAME_BASE', {",
      " state: () => ({",
      "   $0",
      " }),",
      " getters: {},",
      " actions: {},",
      "})",
      "",
      "if (import.meta.hot) {",
      " import.meta.hot.accept(acceptHMRUpdate(use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store, import.meta.hot))",
      "}",
      ""
    ],
    "description": "Bootstrap the code needed for a Vue.js Pinia Options Store file"
  },
  "Pinia Setup Store Boilerplate": {
    "scope": "javascript,typescript",
    "prefix": "pinia-setup",
    "body": [
      "import { defineStore, acceptHMRUpdate } from 'pinia'",
      "",
      "export const use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store = defineStore('$TM_FILENAME_BASE', () => {",
      " $0",
      " return {}",
      "})",
      "",
      "if (import.meta.hot) {",
      " import.meta.hot.accept(acceptHMRUpdate(use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store, import.meta.hot))",
      "}",
      ""
    ],
    "description": "Bootstrap the code needed for a Vue.js Pinia Setup Store file"
  }
}
```
