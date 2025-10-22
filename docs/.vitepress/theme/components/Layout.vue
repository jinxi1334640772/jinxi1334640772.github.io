<!-- .vitepress/theme/Layout.vue -->

<template>
  <DefaultTheme.Layout />
  <!-- 可选组件，需要时取消注释 -->
  <!-- <HomeSponsors /> -->
  <!-- <AsideSponsors /> -->
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { nextTick, provide } from "vue";

// import HomeSponsors from "./HomeSponsors.vue";
// import AsideSponsors from "./AsideSponsors.vue";

const { isDark } = useData();

/**
 * 检查是否支持 View Transition API 和用户偏好设置
 * @returns {boolean} 是否启用过渡动画
 */
const enableTransitions = (): boolean =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

/**
 * 计算圆形裁剪路径的半径
 * @param {number} x - 鼠标点击 X 坐标
 * @param {number} y - 鼠标点击 Y 坐标
 * @returns {number} 圆形半径
 */
const calculateRadius = (x: number, y: number): number => {
  return Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
};

/**
 * 主题切换动画效果
 * 使用 View Transition API 实现平滑的主题切换动画
 */
provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  // 如果不支持过渡动画，直接切换主题
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  // 计算圆形裁剪路径
  const radius = calculateRadius(x, y);
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ];

  // 执行视图过渡动画
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  // 应用动画效果
  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
