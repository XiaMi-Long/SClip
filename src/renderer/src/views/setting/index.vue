<template>
  <div class="setting-container">
    <div class="settings-grid">
      <!-- 主题设置卡片 -->
      <div class="setting-card" @click="navigateTo('theme')">
        <div class="top">
          <div class="round-icon theme">
            <i class="ri-palette-line"></i>
          </div>
          <span class="title">主题设置</span>
        </div>
        <div class="bottom">
          <p>自定义应用的视觉风格，包括界面配色、字体样式与动画效果，打造专属于您的使用体验</p>
        </div>
      </div>

      <!-- 趣味数据卡片 -->
      <div class="setting-card" @click="navigateTo('stats')">
        <div class="top">
          <div class="round-icon stats">
            <i class="ri-bar-chart-line"></i>
          </div>
          <span class="title">趣味数据</span>
        </div>
        <div class="bottom">
          <p>探索您的应用使用习惯，了解操作频率与时长分布，发现独特的使用模式与偏好特点</p>
        </div>
      </div>

      <!-- 操作日志卡片 -->
      <div class="setting-card" @click="navigateTo('logs')">
        <div class="top">
          <div class="round-icon logs">
            <i class="ri-file-list-line"></i>
          </div>
          <span class="title">操作日志</span>
        </div>
        <div class="bottom">
          <p>查看详细的系统运行记录，追踪重要操作历史，帮助您更好地了解应用运行状态</p>
        </div>
      </div>

      <!-- 快捷键设置卡片 -->
      <div class="setting-card" @click="navigateTo('shortcuts')">
        <div class="top">
          <div class="round-icon shortcuts">
            <i class="ri-keyboard-line"></i>
          </div>
          <span class="title">快捷键设置</span>
        </div>
        <div class="bottom">
          <p>配置个性化的键盘快捷方式，优化操作流程，提升工作效率，让使用更加得心应手</p>
        </div>
      </div>

      <!-- 软件设置卡片 -->
      <div class="setting-card" @click="navigateTo('preferences')">
        <div class="top">
          <div class="round-icon preferences">
            <i class="ri-settings-line"></i>
          </div>
          <span class="title">软件设置</span>
        </div>
        <div class="bottom">
          <p>管理应用的核心配置选项，调整系统行为与性能参数，确保软件运行符合使用需求</p>
        </div>
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

<style lang="scss" scoped>
.setting-container {
  min-height: calc(100vh - var(--title-bar-height));
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: var(--system-theme);
}

.settings-grid {
  position: relative;
  z-index: 1;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.setting-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  width: calc(33% - 1rem);
  height: 180px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.15);

    .round-icon {
      &.theme {
        background: linear-gradient(135deg,
            rgba(147, 51, 234, 1) 0%,
            rgba(192, 132, 252, 1) 100%);
      }

      &.stats {
        background: linear-gradient(135deg,
            rgba(249, 115, 22, 1) 0%,
            rgba(251, 146, 60, 1) 100%);
      }

      &.logs {
        background: linear-gradient(135deg,
            rgba(59, 130, 246, 1) 0%,
            rgba(96, 165, 250, 1) 100%);
      }

      &.shortcuts {
        background: linear-gradient(135deg,
            rgba(34, 197, 94, 1) 0%,
            rgba(74, 222, 128, 1) 100%);
      }

      &.preferences {
        background: linear-gradient(135deg,
            rgba(79, 70, 229, 1) 0%,
            rgba(129, 140, 248, 1) 100%);
      }
    }
  }

  .top {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .round-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      // 主题设置 - 紫色渐变
      &.theme {
        background: linear-gradient(135deg,
            rgba(147, 51, 234, 0.9) 0%,
            rgba(192, 132, 252, 0.9) 100%);

        i {
          color: rgba(255, 255, 255, 0.95);
        }
      }

      // 趣味数据 - 橙色渐变
      &.stats {
        background: linear-gradient(135deg,
            rgba(249, 115, 22, 0.9) 0%,
            rgba(251, 146, 60, 0.9) 100%);

        i {
          color: rgba(255, 255, 255, 0.95);
        }
      }

      // 操作日志 - 蓝色渐变
      &.logs {
        background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.9) 0%,
            rgba(96, 165, 250, 0.9) 100%);

        i {
          color: rgba(255, 255, 255, 0.95);
        }
      }

      // 快捷键 - 绿色渐变
      &.shortcuts {
        background: linear-gradient(135deg,
            rgba(34, 197, 94, 0.9) 0%,
            rgba(74, 222, 128, 0.9) 100%);

        i {
          color: rgba(255, 255, 255, 0.95);
        }
      }

      // 软件设置 - 靛蓝渐变
      &.preferences {
        background: linear-gradient(135deg,
            rgba(79, 70, 229, 0.9) 0%,
            rgba(129, 140, 248, 0.9) 100%);

        i {
          color: rgba(255, 255, 255, 0.95);
        }
      }

      i {
        font-size: 1.5rem;
        transition: all 0.3s ease;
      }
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .bottom {
    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }
  }
}
</style>
