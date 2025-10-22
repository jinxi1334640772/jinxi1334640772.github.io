
<template>
  <VPDocAsideSponsors :data="sponsorData" />
</template>

<script setup>
import { VPDocAsideSponsors } from "vitepress/theme";

/**
 * 侧边栏赞助商配置
 * @type {Array<{tier: string, size: string, items: Array<{name: string, url: string, img: string}>}>}
 */
const sponsorData = [
  {
    tier: "我的主页",
    size: "big", // 可选值: big | medium | small | xmini
    items: [
      {
        name: "个人主页",
        url: "/home",
        img: "/images/logo-mini.svg",
      },
      {
        name: "GitHub 主页",
        url: "https://github.com/jinxi1334640772",
        img: "/images/logo-mini.svg",
      },
    ],
  },
];
</script>
