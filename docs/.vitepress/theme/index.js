import { h } from "vue";
import Theme from "vitepress/theme";
import "./custom.css";
import HomeSponsors from "./components/HomeSponsors.vue"; 
import AsideSponsors from "./components/AsideSponsors.vue";
import Layout from "./components/Layout.vue";

export default {
  // ...Theme,
  extends:Theme,
  // 每个页面的根布局组件 必须的
  Layout() {
    // return h(Theme.Layout)
    return h(Layout, null, {
      // layout：home、page、doc 不同时插槽也不同
      // aside-outline-before 默认Layout组件插槽
      "home-features-after": () => h(HomeSponsors), //插入首页底部
      "aside-ads-before": () => h(AsideSponsors), //所有页面，右下角悬浮
    });
  },
  enhanceApp({ app,router,siteData }) {
    //app:vue应用实例
    //router：vitePress路由实例
    //siteData: 站点级元数据
    // 注册自定义全局组件
    app.component("HomeSponsors", HomeSponsors);
    app.component("AsideSponsors", AsideSponsors);
  },
};
