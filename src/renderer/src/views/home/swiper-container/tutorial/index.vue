<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultDemo from './default-demo/index.vue'
import EffectsDemo from './effects-demo/index.vue'
import TutorialAnimation from '@renderer/components/TutorialAnimation/index.vue'

const showCards = ref(false)
const currentStep = ref<'initial' | 'tutorial-select' | 'classic-demo' | 'modern-demo'>('initial')

// 方法
const startTutorial = () => {
  currentStep.value = 'tutorial-select'
}

const startUsing = () => {
  // 这里可以触发事件通知父组件直接开始使用
  console.log('开始使用SClip')
}

const selectClassicTutorial = () => {
  currentStep.value = 'classic-demo'
}

const selectModernTutorial = () => {
  currentStep.value = 'modern-demo'
}

const backToTutorialSelect = () => {
  currentStep.value = 'tutorial-select'
}

onMounted(() => {})
</script>
<template>
  <div class="tutorial-container">
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 动画总区域 -->
      <TutorialAnimation />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tutorial-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a2e;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px;
}

.main-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden; /* 隐藏溢出内容，实现logo上移效果 */
  display: flex;
  justify-content: center;
  align-items: center;
}

// /* Logo样式 */
// .logo-section {
//   /* 使用CSS height过渡动画实现高度变化 */
//   transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
//   margin-bottom: 0;
//   height: 100%; /* 默认100%高度，占据整个容器 */
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .logo-section {
//   height: 100%; /* 动画后变为30%高度 */
// }

// .gradient-logo {
//   font-size: 4rem;
//   font-weight: bold;
//   margin: 0;
//   background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff);
//   background-size: 400% 400%;
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   animation:
//     gradientShift 5s ease-in-out infinite,
//     logoAppear 1s ease-out;
// }

// /* Logo渐变动画 */
// @keyframes gradientShift {
//   0%,
//   100% {
//     background-position: 0% 50%;
//   }
//   50% {
//     background-position: 100% 50%;
//   }
// }

// /* Logo出现动画 */
// @keyframes logoAppear {
//   0% {
//     opacity: 0;
//     transform: scale(0.5) translateY(50px);
//   }
//   100% {
//     opacity: 1;
//     transform: scale(1) translateY(0);
//   }
// }

// 动画相关的样式已移至 TutorialAnimation 组件中
</style>
