<script setup lang="ts">
/**
 * @file StickyBadge 组件
 * @description 显示固定选项的标记组件，使用fadeInRight动画从右侧淡入
 */
import stickyImage from '../../../../../../assets/select_white.png'
import { useMotions } from '@vueuse/motion'
import { ref, computed } from 'vue'

const props = defineProps<{
    card: ClipboardState
    cardId: number
}>()

// 获取 motions 实例
const motions = useMotions()

// 定义动画配置
const badgeMotion = {
    initial: { opacity: 0, scale: 0.3 },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 500,
            ease: [0.215, 0.61, 0.355, 1]
        }
    },
    leave: {
        opacity: 0,
        scale: 0.3,
        transition: {
            duration: 150
        }
    }
}


const getCardId = computed(() => {
    return props.cardId
})
</script>

<template>

    <transition :css="false" @leave="(el, done) => motions[`selectBadge${getCardId}`].leave(done)">
        <div v-motion="'selectBadge' + getCardId" :initial="badgeMotion.initial" :enter="badgeMotion.enter"
            :leave="badgeMotion.leave" class="sticky-badge">
            <img :src="stickyImage" alt="选中标记" />
        </div>
    </transition>
</template>

<style scoped lang="scss">
/**
 * @description StickyBadge 样式定义
 */
.sticky-badge {
    z-index: 2;
    position: absolute;
    box-sizing: border-box;
    right: 10px;
    /* 与card-wrapper左侧保持间隙 */
    bottom: 10px;
    /* 与card-wrapper底部保持间隙 */
    width: 25px;
    padding: 5px;
    /* 设置合适的宽度，可根据需求调整 */
    height: 20px;
    /* 设置合适的高度，可根据需求调整 */
    background-color: var(--stickybadge-bg);
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 5px;
}

.sticky-badge img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>