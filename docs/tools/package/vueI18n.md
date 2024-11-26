## vueI18n

Vue-i18n 是一个 Vue.js 的国际化插件，它提供了一种简单的方式来处理应用中的多语言支持。通过这个插件，我们可以轻松地在应用中切换语言，支持多种语言的翻译，并且可以处理日期、数字等多种类型的格式化。

```js
import { createI18n } from "vue-i18n";

// 初始化i18n
export default const i18n = createI18n({
  legacy: false, // 解决Not available in legacy mode报错
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: "zhCn", // 默认当前语言为中文
  // 语言没有匹配到时的回退 string|Array|Object
  fallbackLocale:[ "en",'zhCn'],
  formatFallbackMessages: true,
  modifiers: {  // 自定义变量修饰符
    snakeCase: (str) => str.split(' ').join('_')
  },
  // 自定义日期时间格式化
  datetimeFormats:{
    en: {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric',hour12: true
      }
    },
  }
  // 自定义多元化规则
  pluralizationRules: {
    en: (choice, choicesLength, orgRule)=> number
  },
  // 自定义数组格式化
  numberFormats: {
    en: {
    currency: {
      style: 'currency', currency: 'USD', notation: 'standard'
    },
    decimal: {
      style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
    },
    percent: {
      style: 'percent', useGrouping: false
    }
  }
  },
  messages: {
    en:{
      app: {
        title: '{0} world', // 插值
        /**
         * % 格式化
         * {number} 插值
         * {string} 使用变量
         * <br> 渲染换行，而不是字符
         * @:key 使用前面的变量key
         * @.modifier:key ：modifier修饰前面的变量key
         */
        hello: '%{msg} <br> world',// 变量
        address: "{account}{'@'}{domain}",//多个变量，@为常量
        linked: '@:app.dio @:app.hello',// 使用前面的变量
        homeAddress: 'Home address',
        /** 语法：@.modifier:key ：修饰前面的变量key
         *  lower
         *  upper
         *  capitalize
         */
        toLowerHomeAddress: '@.lower:app.homeAddress',
        // 使用自定义修饰符
        custom_modifier: "@.snakeCase:{'app.homeAddress'}",
        // 使用多个值，由各自语言根据数值自动选择，可以自定义逻辑
        car: 'car | cars',
        apple: 'no apples | one apple | {count} apples'
        },
      },
    zhCn:{app: {title: '精彩案例'}},
  }
});

// 更改语言
export function initLangListener(lang) {
  //legacy: false时，此时locale是个ref，需要加value
 i18n.global.locale.value = lang;
  //legacy: true时
 i18n.global.locale = lang;
}
```

## 注册 i18n

```js
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  // something vue-i18n options here ...
});

const app = createApp({
  // something vue options here ...
});

app.use(i18n);
app.mount("#app");
```

## 使用 i18n

```js

<template>
  <p>{{ $t('app.title', ['hello']) }}</p>
  <p>{{ $t('app.hello', { msg: 'hello' }) }}</p>
  <p>{{ $t('app.address', { account: 'foo', domain: 'domain.com' }) }}</p>
  <p>{{ $t('app.linked') }}</p>

  <p>{{ $t('app.car', 1) }}:car</p>
  <p>{{ $t('app.car', 2) }}:cars</p>
  <p>{{ $t('app.apple', 0) }}:no apples</p>
  <p>{{ $t('app.apple', 1) }}:one apple</p>
  <p>{{ $t('app.apple', 10, { count: 'too many' }) }}:too many apples</p>

  <p>{{ $d(new Date(), 'short') }}：Apr 19, 2017</p>
  <i18n-d tag="p" :value="new Date()" locale='en'></i18n-d>
  <i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
  <i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
  <template #literal="props">
    <span style="color: green">{{ props.literal }}</span>
  </template>
</i18n-d>

<p>{{ $n(987654321, 'currency', { notation: 'compact' }) }}</p>
<p>{{ $n(0.99123, 'percent') }}</p>
<p>{{ $n(0.99123, 'percent', { minimumFractionDigits: 2 }) }}</p>
<p>{{ $n(12.11612345, 'decimal') }}</p>
<p>$988M</p>
<p>99%</p>
<p>99.12%</p>
<p>12.12</p>

<i18n-n tag="span" :value="100"></i18n-n>
<i18n-n tag="span" :value="100" format="currency"></i18n-n>
<i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>
<span>100</span>
<span>$100.00</span>
<span>￥100</span>

<i18n-n tag="span" :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
  <template #currency="slotProps">
    <span style="color: green">{{ slotProps.currency }}</span>
  </template>
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
  <template #group="slotProps">
    <span style="font-weight: bold">{{ slotProps.group }}</span>
  </template>
  <template #fraction="slotProps">
    <span style="font-size: small">{{ slotProps.fraction }}</span>
  </template>
</i18n-n>

  <p v-t="'app.hello'">通过指令使用i18n定义的数据</p>
  <p v-t="path">通过指令也可以使用组件内定义的data</p>
   <!-- literal -->
  <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
  <!-- data binding via data -->
  <p v-t="{ path: byePath, locale: 'en' }"></p>
  <!-- pluralization -->
  <p v-t="{ path: 'message.apple', plural: appleCount }"></p>

</template>
```
