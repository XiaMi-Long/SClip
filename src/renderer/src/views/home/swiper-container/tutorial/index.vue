<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultDemo from './default-demo/index.vue'
import EffectsDemo from './effects-demo/index.vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import TutorialAnimation from '@renderer/components/TutorialAnimation/index.vue'

const showCards = ref(false)
const currentStep = ref<'initial' | 'tutorial-select' | 'classic-demo' | 'modern-demo'>('initial')
const animationFinished = ref(false)

const configStore = useConfigStore()

onMounted(() => {
  setTimeout(() => {
    animationFinished.value = true
    showCards.value = true
  }, 4000)
})

const startTutorial = (): void => {
  currentStep.value = 'tutorial-select'
}

const startUsing = (): void => {
  configStore.setShowTutorial(false)
}

const selectClassicTutorial = (): void => {
  currentStep.value = 'classic-demo'
}

const selectModernTutorial = (): void => {
  currentStep.value = 'modern-demo'
}

// const backToTutorialSelect = (): void => {
//   currentStep.value = 'tutorial-select'
// }
</script>
<template>
  <div class="tutorial-container">
    <!-- 主容器 -->
    <div class="main-container" :class="{ 'animation-finished': animationFinished }">
      <!-- 动画总区域 -->
      <TutorialAnimation />
    </div>

    <!-- 卡片区域 -->
    <transition name="cards-section-fade">
      <div v-if="showCards" class="cards-section">
        <!-- 初始卡片 -->
        <transition name="cards-fade" mode="out-in">
          <div v-if="currentStep === 'initial'" key="initial" class="cards-wrapper">
            <div class="tutorial-card" @click="startTutorial">
              <div class="card-content">
                <h3>开始教程</h3>
                <p>了解SClip的功能特性</p>
              </div>
            </div>
            <div class="tutorial-card" @click="startUsing">
              <div class="card-content">
                <h3>开始使用</h3>
                <p>直接开始使用SClip</p>
              </div>
            </div>
          </div>
          <!-- 教程选择卡片 -->
          <div
            v-else-if="currentStep === 'tutorial-select'"
            key="tutorial-select"
            class="cards-wrapper"
          >
            <div class="tutorial-card" @click="selectClassicTutorial">
              <div class="card-content">
                <h3>经典样式教程</h3>
                <p>传统界面的使用指南</p>
              </div>
            </div>
            <div class="tutorial-card" @click="selectModernTutorial">
              <div class="card-content">
                <h3>新版样式教程</h3>
                <p>全新界面的使用指南</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 教程内容区域 -->
    <transition name="content-fade" mode="out-in">
      <div v-if="currentStep === 'classic-demo'" class="tutorial-content default-demo">
        <!-- <button class="back-btn" @click="backToTutorialSelect">← 返回</button> -->
        <DefaultDemo />
      </div>
    </transition>

    <transition name="content-fade" mode="out-in">
      <div v-if="currentStep === 'modern-demo'" class="tutorial-content effects-demo">
        <!-- <button class="back-btn" @click="backToTutorialSelect">← 返回</button> -->
        <EffectsDemo />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.tutorial-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--container-bg);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  // padding: 30px;
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
  transition: all 0.3s ease-in-out;

  &.animation-finished {
    height: 20%;
    opacity: 0;
    transform: translateY(-50%);
  }
}

.cards-section {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.cards-wrapper {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-direction: column;
}

.tutorial-card {
  width: 220px;
  height: 130px;
  background-color: var(--sticky-badge-bg);
  border: 1px solid var(--sticky-badge-bg);
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-10px);
    background-color: var(--sticky-badge-bg);
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 1.1em;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85em;
    opacity: 0.7;
    line-height: 1.4;
  }
}

.tutorial-content {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
  // box-sizing: border-box;
  // background: var(--sticky-badge-bg);
  // display: flex;
  // flex-direction: column;
  // align-items: center;
}

.back-btn {
  position: absolute;
  top: 40px;
  left: 30px;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1em;
  opacity: 0.8;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    background: var(--sticky-badge-bg);
  }
}

/* Transitions */
.cards-section-fade-enter-active,
.cards-section-fade-leave-active {
  transition: opacity 0.5s ease;
}

.cards-section-fade-enter-from,
.cards-section-fade-leave-to {
  opacity: 0;
}

.cards-fade-enter-active,
.cards-fade-leave-active {
  transition: all 0.3s ease;
}

.cards-fade-enter-from,
.cards-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.3s ease;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.effects-demo {
  position: absolute;
}
</style>
