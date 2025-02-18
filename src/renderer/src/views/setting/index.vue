<template>
  <div class="setting-container">
    <!-- 毛玻璃效果的背景 -->
    <div class="glass-background"></div>

    <!-- 设置卡片容器 -->
    <div class="settings-grid">
      <!-- 主题设置卡片 -->
      <div class="setting-card" @click="navigateTo('theme')">
        <i class="ri-palette-line"></i>
        <h3>主题设置</h3>
        <p>自定义应用的视觉风格</p>
      </div>

      <!-- 趣味数据卡片 -->
      <div class="setting-card" @click="navigateTo('stats')">
        <i class="ri-bar-chart-line"></i>
        <h3>趣味数据</h3>
        <p>查看您的使用统计</p>
      </div>

      <!-- 操作日志卡片 -->
      <div class="setting-card" @click="navigateTo('logs')">
        <i class="ri-file-list-line"></i>
        <h3>操作日志</h3>
        <p>浏览系统操作记录</p>
      </div>

      <!-- 快捷键设置卡片 -->
      <div class="setting-card" @click="navigateTo('shortcuts')">
        <i class="ri-keyboard-line"></i>
        <h3>快捷键设置</h3>
        <p>自定义键盘快捷方式</p>
      </div>

      <!-- 软件设置卡片 -->
      <div class="setting-card" @click="navigateTo('preferences')">
        <i class="ri-settings-line"></i>
        <h3>软件设置</h3>
        <p>调整应用程序配置</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 导航到指定的设置页面
 * @param {string} route - 目标路由名称
 */
const navigateTo = (route) => {
  // 实现导航逻辑
}
</script>

<style scoped>
.setting-container {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.glass-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.setting-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.setting-card i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.setting-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.setting-card p {
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  opacity: 0.8;
}
</style>
