<template>
  <div class="tutorial-container">
    <!-- 主容器 -->
    <div class="main-container">
      <!-- Logo区域 -->
      <div class="logo-section" :class="{ 'logo-move-up': logoMoved }">
        <h1 class="gradient-logo">SClip</h1>
      </div>

      <!-- 卡片区域 -->
      <transition name="cards-section-fade">
        <div v-if="showCards" class="cards-section">
          <!-- 初始卡片 -->
          <transition-group v-if="currentStep === 'initial'" name="cards-fade">
            <div key="start-tutorial" class="tutorial-card" @click="startTutorial">
              <div class="card-content">
                <h3>开始教程</h3>
                <p>了解SClip的功能特性</p>
              </div>
            </div>
            <div key="start-using" class="tutorial-card" @click="startUsing">
              <div class="card-content">
                <h3>开始使用</h3>
                <p>直接开始使用SClip</p>
              </div>
            </div>
          </transition-group>

          <!-- 教程选择卡片 -->
          <transition-group v-if="currentStep === 'tutorial-select'" name="cards-fade">
            <div key="classic-tutorial" class="tutorial-card" @click="selectClassicTutorial">
              <div class="card-content">
                <h3>经典样式教程</h3>
                <p>传统界面的使用指南</p>
              </div>
            </div>
            <div key="modern-tutorial" class="tutorial-card" @click="selectModernTutorial">
              <div class="card-content">
                <h3>新版样式教程</h3>
                <p>全新界面的使用指南</p>
              </div>
            </div>
          </transition-group>
        </div>
      </transition>

      <!-- 教程内容区域 -->
      <transition name="content-fade" mode="out-in">
        <div v-if="currentStep === 'classic-demo'" class="tutorial-content">
          <button class="back-btn" @click="backToTutorialSelect">← 返回</button>
          <DefaultDemo />
        </div>
      </transition>

      <transition name="content-fade" mode="out-in">
        <div v-if="currentStep === 'modern-demo'" class="tutorial-content">
          <button class="back-btn" @click="backToTutorialSelect">← 返回</button>
          <EffectsDemo />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultDemo from './default-demo/index.vue'
import EffectsDemo from './effects-demo/index.vue'

// 响应式数据
const logoMoved = ref(false)
const showCards = ref(false)
const currentStep = ref<'initial' | 'tutorial-select' | 'classic-demo' | 'modern-demo'>('initial')

// 生命周期
onMounted(() => {
  // 2秒后开始移动logo
  setTimeout(() => {
    logoMoved.value = true
    // logo移动动画需要0.8秒，等动画完全结束后再显示卡片
    setTimeout(() => {
      showCards.value = true
    }, 800) // 等待logo移动动画完全结束
  }, 2000)
})

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
</script>

<style scoped>
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
}

/* Logo样式 */
.logo-section {
  /* 使用CSS height过渡动画实现高度变化 */
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0;
  height: 100%; /* 默认100%高度，占据整个容器 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-section.logo-move-up {
  height: 30%; /* 动画后变为30%高度 */
}

.gradient-logo {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation:
    gradientShift 5s ease-in-out infinite,
    logoAppear 1s ease-out;
}

/* Logo渐变动画 */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Logo出现动画 */
@keyframes logoAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(50px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 卡片区域 */
.cards-section {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  height: 70%;
  box-sizing: border-box;
}

/* 卡片区域过渡动画 */
.cards-section-fade-enter-active,
.cards-section-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.cards-section-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.cards-section-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.tutorial-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 15px;
  width: 160px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tutorial-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card-content h3 {
  color: white;
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.card-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

/* 教程内容区域 */
.tutorial-content {
  margin-top: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 卡片过渡动画 */
.cards-fade-enter-active,
.cards-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.cards-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.cards-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.cards-fade-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 内容过渡动画 */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.content-fade-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
