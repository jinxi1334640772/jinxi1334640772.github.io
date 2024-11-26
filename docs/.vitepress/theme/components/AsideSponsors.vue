
<template>
  <VPDocAsideSponsors :data="data" />
</template>

<script setup>
import { computed } from "vue";
import { VPDocAsideSponsors } from "vitepress/theme";

const data = [
  {
    tier: "我的主页",
    // tier: "长期赞助商",
    size: "big", // big   xmini
    items: [
      {
        name: "我的主页",
        url: "/",
        img: "/images/logo-mini.svg",
      },
      {
        name: "我的主页",
        url: "/",
        img: "/images/logo-mini.svg",
      },
    ],
  },
];
</script>

