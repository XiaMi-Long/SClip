<script setup lang="ts">
/**
 * @file StickyBadge 组件
 * @description 显示固定选项的标记组件，使用fadeInRight动画从右侧淡入
 */
import stickyImage from '../../../../../../assets/sticky_white.png'
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
            duration: 300,
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

const shouldShow = computed(() => {
    // 添加微任务延迟确保状态同步
    return props.card.isSticky === 'true'
})

const getCardId = computed(() => {
    return props.cardId
})
</script>

<template>

    <transition :css="false" @leave="(el, done) => motions[`stickyBadge${getCardId}`].leave(done)">
        <div v-motion="'stickyBadge' + getCardId" v-if="shouldShow" :initial="badgeMotion.initial" :enter="badgeMotion.enter"
            :leave="badgeMotion.leave" class="sticky-badge">
            <img :src="stickyImage" alt="固定标记" />
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
    left: 10px;
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

    &.error {
        animation-name: tada;
        animation-duration: 1.5s;
        animation-fill-mode: both;
    }

}

.sticky-badge img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

@keyframes tada {
    0% {
        transform: scale3d(1, 1, 1);

    }

    10%,
    20% {
        transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)
    }

    30%,
    50%,
    70%,
    90% {
        transform: scale3d(1.2, 1.2, 1.2) rotate3d(0, 0, 1, 3deg);
        background-color: var(--stickybadge-error-bg);
    }

    40%,
    60%,
    80% {
        transform: scale3d(1.4, 1.4, 1.4) rotate3d(0, 0, 1, -3deg)
    }

    100% {
        transform: scale3d(1, 1, 1)
    }

}
</style>