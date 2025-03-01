<script lang="ts" setup>
// 主题设置组件逻辑
</script>

<template>
  <div class="theme-setting">
    <h2>主题设置</h2>

    <div class="settings-section">
      <h3>颜色主题</h3>
      <div class="color-themes">
        <div class="theme-option">
          <div class="theme-preview dark"></div>
          <span>暗色主题</span>
        </div>
        <div class="theme-option">
          <div class="theme-preview light"></div>
          <span>亮色主题</span>
        </div>
        <div class="theme-option">
          <div class="theme-preview auto"></div>
          <span>跟随系统</span>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3>强调色</h3>
      <div class="accent-colors">
        <div class="color-option purple"></div>
        <div class="color-option blue"></div>
        <div class="color-option green"></div>
        <div class="color-option orange"></div>
        <div class="color-option pink"></div>
      </div>
    </div>

    <div class="settings-section">
      <h3>字体设置</h3>
      <div class="font-settings">
        <div class="setting-item">
          <span>界面字体</span>
          <select>
            <option>系统默认</option>
            <option>苹方</option>
            <option>思源黑体</option>
          </select>
        </div>
        <div class="setting-item">
          <span>字体大小</span>
          <div class="slider-container">
            <input type="range" min="12" max="20" value="14" />
            <span>14px</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-setting {
  height: 100%;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--system-theme-text, #f0f0f0);
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: var(--system-theme-text, #f0f0f0);
}

.settings-section {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.color-themes {
  display: flex;
  gap: 1rem;

  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    .theme-preview {
      width: 80px;
      height: 50px;
      border-radius: 6px;
      transition: transform 0.2s;

      &.dark {
        background-color: #121212;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      &.light {
        background-color: #f9f9f9;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      &.auto {
        background: linear-gradient(to right, #121212 50%, #f9f9f9 50%);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    &:hover .theme-preview {
      transform: translateY(-2px);
    }

    span {
      font-size: 0.9rem;
      color: var(--system-theme-text, #f0f0f0);
    }
  }
}

.accent-colors {
  display: flex;
  gap: 1rem;

  .color-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &.purple {
      background: linear-gradient(135deg, #9333ea, #c084fc);
    }

    &.blue {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
    }

    &.green {
      background: linear-gradient(135deg, #10b981, #34d399);
    }

    &.orange {
      background: linear-gradient(135deg, #f97316, #fb923c);
    }

    &.pink {
      background: linear-gradient(135deg, #ec4899, #f472b6);
    }
  }
}

.font-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      color: var(--system-theme-text, #f0f0f0);
    }

    select {
      padding: 0.5rem;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--system-theme-text, #f0f0f0);
      min-width: 120px;
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;

      input[type='range'] {
        width: 120px;
      }
    }
  }
}
</style>
