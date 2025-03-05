<script setup lang="ts">
import { shallowRef, defineAsyncComponent, watch } from 'vue'

const props = defineProps<{
  setting: Setting
}>()

/**
 * 动态导入组件映射
 */
const asyncComponents = {
  default: defineAsyncComponent({
    loader: () => import('./themes/default/swiper.vue'),
    loadingComponent: () => import('../../../components/VDefaultLoading/index.vue'),
    errorComponent: () => import('../../../components/VErrorLoding/index.vue'),
    delay: 200,
    timeout: 3000
  }),
  card: defineAsyncComponent({
    loader: () => import('./themes/card/CardSwiper.vue'),
    loadingComponent: () => import('../../../components/VDefaultLoading/index.vue'),
    errorComponent: () => import('../../../components/VErrorLoding/index.vue'),
    delay: 200,
    timeout: 3000
  })
}

/**
 * 使用 shallowRef 优化性能
 */
const currentComponent = shallowRef(asyncComponents.default)

/**
 * 加载对应主题的组件
 * @param theme - 轮播图主题类型
 */
const loadComponent = (theme: string) => {
  currentComponent.value = asyncComponents[theme]
}

// 监听主题变化，立即执行一次以加载初始组件
// watch(
//   () => props.setting.applicationTheme,
//   (newTheme) => {
//     loadComponent(newTheme)
//   },
//   { immediate: true }
// )
</script>

<template>
  <div class="swiper-container">
    <component :is="currentComponent" v-if="currentComponent" v-bind="{ ...props }" />
  </div>
</template>

<style scoped lang="scss">
.swiper-container {
  height: 100%;
}
</style>
