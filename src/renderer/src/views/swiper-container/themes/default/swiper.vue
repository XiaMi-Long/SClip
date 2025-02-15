<!-- src/renderer/src/views/swiper-container/themes/default/swiper.vue -->
<script setup lang="ts">
/**
 * @module swiper.vue
 * @description 自定义轮播视图组件，实现卡片的分页展示和导航
 */

import { computed, toRefs } from 'vue'
import VClipboardCard from "./card/index.vue"
import StickyBadge from "./card/StickyBadge.vue"
import SelectBadge from "./card/selectBadge.vue"
import PaginationIndicator from "./card/PaginationIndicator.vue"
import { useCarousel } from './hooks'

/** 每页的宽度（像素） */
const PAGE_WIDTH = 300

const { state, getters, actions } = useCarousel()

// 解构计算属性，使其在模板中自动解包
const { allCards, activeAbsoluteIndex } = toRefs(getters)

/**
 * 计算轮播列表的样式
 * @description 根据当前页码计算水平偏移，实现页面切换效果
 */
const listStyle = computed(() => ({
    transform: `translateX(-${state.currentPage.value * PAGE_WIDTH}px)`,
    transition: 'transform 0.3s ease',
    width: `${getters.totalPages.value * PAGE_WIDTH}px`
}))

console.log(getters.allCards.value);

</script>

<template>
    <div class="carousel-container">
        <!-- 内层列表，将所有卡片渲染出来 -->

        <TransitionGroup name="all-cards" tag="div" class="all-cards" :style="listStyle">
            <div v-for="(card, index) in allCards" :key="card.id"
                :class="['card-wrapper', { active: index === activeAbsoluteIndex }]" :data-id="card.id">
                <StickyBadge :card="card" :card-id="card.id" />
                <!-- {{ card.id }} -->
                <SelectBadge v-if="index === activeAbsoluteIndex" :card="card" :card-id="card.id" />
                <VClipboardCard :clipboardOptions="card" />
            </div>
        </TransitionGroup>
        <!-- 分页状态展示组件（仅展示当前页码，不具备点击功能） -->
        <PaginationIndicator :current="state.currentPage.value" :total="getters.totalPages.value" />
    </div>
</template>

<style scoped lang="scss">
/* 容器样式：设置溢出隐藏和全屏高度 */
.carousel-container {
    box-sizing: border-box;
    overflow: hidden;
    height: 100vh;
}

/* 内层列表：垂直排列所有卡片，设置间距和内边距 */
.all-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px 0px;
    padding-top: 5.5px;
    height: 100%;
}

/* 卡片样式：设置基础样式和过渡效果 */
.card-wrapper {
    width: 95vw;
    position: relative;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s ease;
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(132 132 132 / 10%);
}

/* 选中卡片的高亮样式 */
.card-wrapper.active {
    // transform: scale(1.05);
    // box-shadow: 0 4px 8px rgb(132 132 132 / 20%);
}

.all-cards-move,
.all-cards-enter-active,
.all-cards-leave-active {
    transition: transform .3s ease;
}

.all-cards-enter-from {
    transform: translateY(200px);
}

.all-cards-enter-to {
    transform: translateY(0);
}


.all-cards-enter-from {
    transform: translateY(-200px);
}


.all-cards-leave-form {
    transform: scale(1);
    opacity: 1;
}

.all-cards-leave-to {
    transform: scale(0.4);
    opacity: 0;
}

.all-cards-leave-active {
    // position: absolute;
}
</style>