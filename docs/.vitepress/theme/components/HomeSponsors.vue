<template>
  <VPHomeSponsors
    message="Vitepress是免费和开源的,感谢作者尤雨溪。"
    action-text="查看Web使用指南"
    action-link="/web"
    :data="data"
  />
</template>

<script setup>
import { VPHomeSponsors } from "vitepress/theme";
const data = [
  {
    tier: "感谢Vitepress",
    size: "mini",
    items: [
      {
        name: "基于Vitepress的项目",
        url: "/",
        img: "/images/logo-mini.svg",
      },
    ],
  },
];
</script>
