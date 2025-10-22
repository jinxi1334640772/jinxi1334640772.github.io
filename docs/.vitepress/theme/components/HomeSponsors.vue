<template>
  <VPHomeSponsors
    message="VitePress 是免费和开源的，感谢作者尤雨溪。"
    action-text="查看 Web 使用指南"
    action-link="/frontEnd/web/VitePress"
    :data="sponsorData"
  />
</template>

<script setup>
import { VPHomeSponsors } from "vitepress/theme";

/**
 * 首页赞助商配置
 * @type {Array<{tier: string, size: string, items: Array<{name: string, url: string, img: string}>}>}
 */
const sponsorData = [
  {
    tier: "感谢 VitePress",
    size: "mini", // 可选值: big | medium | small | mini
    items: [
      {
        name: "基于 VitePress 的技术文档站点",
        url: "/home",
        img: "/images/logo-mini.svg",
      },
    ],
  },
];
</script>
