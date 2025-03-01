<script setup>
/**
 * 当前选中的卡片索引
 */
import { ref } from 'vue'

/**
 * 导航到指定的设置页面
 * @param {string} route - 目标路由名称
 */
const navigateTo = (route) => {
  // 实现导航逻辑
  console.log(`导航到: ${route}`)
}

const activeCardIndex = ref(null)

/**
 * 设置当前活跃的卡片
 * @param {number} index - 卡片索引
 */
const setActiveCard = (index) => {
  activeCardIndex.value = index
}
</script>

<template>
  <div class="setting-container">
    <!-- 背景装饰元素 -->
    <div class="background-elements">
      <!-- <div class="floating-circle circle-1"></div> -->
      <div class="floating-circle circle-2"></div>
      <!-- <div class="floating-circle circle-3"></div> -->
      <div class="grid-overlay"></div>
    </div>

    <div class="settings-grid">
      <!-- 主题设置卡片 -->
      <div
        class="setting-card"
        :class="{ active: activeCardIndex === 0 }"
        @click="(navigateTo('theme'), setActiveCard(0))"
        @mouseenter="setActiveCard(0)"
        @mouseleave="activeCardIndex = null"
      >
        <div class="card-content">
          <div class="top">
            <div class="theme-visual">
              <div class="color-palette">
                <span class="color-dot purple"></span>
                <span class="color-dot blue"></span>
                <span class="color-dot green"></span>
                <span class="color-dot orange"></span>
              </div>
            </div>
            <span class="title">主题设置</span>
          </div>
          <div class="bottom">
            <p>自定义应用的视觉风格，包括界面配色、字体样式与动画效果</p>
          </div>
          <div class="card-action">
            <span class="action-text">查看设置</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
        <div class="card-background theme"></div>
      </div>

      <!-- 趣味数据卡片 -->
      <div
        class="setting-card"
        :class="{ active: activeCardIndex === 1 }"
        @click="(navigateTo('stats'), setActiveCard(1))"
        @mouseenter="setActiveCard(1)"
        @mouseleave="activeCardIndex = null"
      >
        <div class="card-content">
          <div class="top">
            <div class="stats-visual">
              <div class="chart-bars">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </div>
            </div>
            <span class="title">趣味数据</span>
          </div>
          <div class="bottom">
            <p>探索您的应用使用习惯，了解操作频率与时长分布</p>
          </div>
          <div class="card-action">
            <span class="action-text">查看数据</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
        <div class="card-background stats"></div>
      </div>

      <!-- 操作日志卡片 -->
      <div
        class="setting-card"
        :class="{ active: activeCardIndex === 2 }"
        @click="(navigateTo('logs'), setActiveCard(2))"
        @mouseenter="setActiveCard(2)"
        @mouseleave="activeCardIndex = null"
      >
        <div class="card-content">
          <div class="top">
            <div class="logs-visual">
              <div class="log-lines">
                <span class="log-line"></span>
                <span class="log-line"></span>
                <span class="log-line"></span>
              </div>
            </div>
            <span class="title">操作日志</span>
          </div>
          <div class="bottom">
            <p>查看详细的系统运行记录，追踪重要操作历史</p>
          </div>
          <div class="card-action">
            <span class="action-text">查看日志</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
        <div class="card-background logs"></div>
      </div>

      <!-- 快捷键设置卡片 -->
      <div
        class="setting-card"
        :class="{ active: activeCardIndex === 3 }"
        @click="(navigateTo('shortcuts'), setActiveCard(3))"
        @mouseenter="setActiveCard(3)"
        @mouseleave="activeCardIndex = null"
      >
        <div class="card-content">
          <div class="top">
            <div class="shortcuts-visual">
              <div class="keyboard-keys">
                <span class="key">⌘</span>
                <span class="plus">+</span>
                <span class="key">S</span>
              </div>
            </div>
            <span class="title">快捷键设置</span>
          </div>
          <div class="bottom">
            <p>配置个性化的键盘快捷方式，优化操作流程</p>
          </div>
          <div class="card-action">
            <span class="action-text">自定义快捷键</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
        <div class="card-background shortcuts"></div>
      </div>

      <!-- 软件设置卡片 -->
      <div
        class="setting-card"
        :class="{ active: activeCardIndex === 4 }"
        @click="(navigateTo('preferences'), setActiveCard(4))"
        @mouseenter="setActiveCard(4)"
        @mouseleave="activeCardIndex = null"
      >
        <div class="card-content">
          <div class="top">
            <div class="preferences-visual">
              <div class="toggle-switches">
                <div class="toggle">
                  <div class="toggle-circle"></div>
                </div>
                <div class="toggle">
                  <div class="toggle-circle active"></div>
                </div>
              </div>
            </div>
            <span class="title">软件设置</span>
          </div>
          <div class="bottom">
            <p>管理应用的核心配置选项，调整系统行为与性能参数</p>
          </div>
          <div class="card-action">
            <span class="action-text">调整设置</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
        <div class="card-background preferences"></div>
      </div>
    </div>

    <div class="setting-content">
      <div class="setting-item">
        <div class="setting-item-title"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-container {
  min-height: calc(100vh - var(--title-bar-height));
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: var(--system-theme, #121212);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

// 背景装饰元素
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  .floating-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
    filter: blur(60px);

    &.circle-1 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #9333ea, #c084fc);
      top: -80px;
      left: -80px;
      animation: float 20s ease-in-out infinite alternate;
    }

    &.circle-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      animation: float-center 15s ease-in-out infinite alternate-reverse;
    }

    &.circle-3 {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #f97316, #fb923c);
      bottom: 30%;
      left: 20%;
      animation: float 18s ease-in-out infinite alternate;
    }
  }

  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    //   linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 1;
  }
}

.settings-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.setting-card {
  position: relative;
  background: #ffffff6e;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  height: 180px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  // border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  // box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover,
  &.active {
    // transform: translateY(-5px) scale(1.02);
    background: rgba(15, 15, 15, 0.95);
    // box-shadow:
    //   0 10px 25px rgba(0, 0, 0, 0.3),
    //   inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    // border-color: rgba(255, 255, 255, 0.25);

    .card-action {
      opacity: 1;
      transform: translateY(0);
    }

    .theme-visual {
      .color-dot {
        transform: scale(1.1);
        &.purple {
          transform: translateY(-3px) scale(1.1);
        }
        &.blue {
          transform: translateY(-5px) scale(1.1);
        }
        &.green {
          transform: translateY(-3px) scale(1.1);
        }
        &.orange {
          transform: translateY(-1px) scale(1.1);
        }
      }
    }

    .stats-visual {
      .bar {
        &:nth-child(1) {
          height: 70% !important;
        }
        &:nth-child(2) {
          height: 90% !important;
        }
        &:nth-child(3) {
          height: 60% !important;
        }
        &:nth-child(4) {
          height: 80% !important;
        }
      }
    }

    .logs-visual {
      .log-line {
        width: 100%;
        &:nth-child(1) {
          width: 90% !important;
        }
        &:nth-child(2) {
          width: 70% !important;
        }
        &:nth-child(3) {
          width: 85% !important;
        }
      }
    }

    .shortcuts-visual {
      .key {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    }

    .preferences-visual {
      .toggle {
        &:first-child .toggle-circle {
          transform: translateX(16px) scale(1.1) !important;
        }
        &:last-child .toggle-circle.active {
          transform: translateX(0px) scale(1.1) !important;
        }
      }
    }

    .card-background {
      opacity: 0.12;
      transform: scale(1.05) rotate(3deg);
    }

    .top {
      .title {
        color: rgba(255, 255, 255, 1);
        // color: #524f4ff2;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
    }

    .bottom p {
      color: rgba(255, 255, 255, 1);
      // color: #524f4ff2;
    }

    .card-action {
      .action-text,
      i {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .card-content {
    position: relative;
    z-index: 2;
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    will-change: transform;
  }

  .card-background {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    opacity: 0.05;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1) rotate(0deg);
    z-index: 1;
    will-change: transform, opacity;

    &.theme {
      background: radial-gradient(circle, rgba(147, 51, 234, 1) 0%, rgba(192, 132, 252, 0) 70%);
    }

    &.stats {
      background: radial-gradient(circle, rgba(249, 115, 22, 1) 0%, rgba(251, 146, 60, 0) 70%);
    }

    &.logs {
      background: radial-gradient(circle, rgba(59, 130, 246, 1) 0%, rgba(96, 165, 250, 0) 70%);
    }

    &.shortcuts {
      background: radial-gradient(circle, rgba(34, 197, 94, 1) 0%, rgba(74, 222, 128, 0) 70%);
    }

    &.preferences {
      background: radial-gradient(circle, rgba(79, 70, 229, 1) 0%, rgba(129, 140, 248, 0) 70%);
    }
  }

  .top {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    // 主题设置 - 色彩面板
    .theme-visual {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .color-palette {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        width: 100%;
        height: 100%;

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

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
        }
      }
    }

    // 趣味数据 - 柱状图
    .stats-visual {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .chart-bars {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 100%;
        height: 100%;

        .bar {
          width: 6px;
          height: 50%;
          background: linear-gradient(to top, #f97316, #fb923c);
          border-radius: 3px 3px 0 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

          &:nth-child(1) {
            height: 60%;
          }

          &:nth-child(2) {
            height: 80%;
          }

          &:nth-child(3) {
            height: 50%;
          }

          &:nth-child(4) {
            height: 70%;
          }
        }
      }
    }

    // 操作日志 - 文本行
    .logs-visual {
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .log-lines {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;

        .log-line {
          height: 3px;
          width: 80%;
          background: linear-gradient(to right, #3b82f6, #60a5fa);
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

          &:nth-child(1) {
            width: 80%;
          }

          &:nth-child(2) {
            width: 60%;
          }

          &:nth-child(3) {
            width: 75%;
          }
        }
      }
    }

    // 快捷键设置 - 键盘按键
    .shortcuts-visual {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .keyboard-keys {
        display: flex;
        align-items: center;
        gap: 2px;

        .key {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981, #34d399);
          border-radius: 3px;
          color: white;
          font-size: 10px;
          font-weight: bold;
          // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .plus {
          color: rgba(255, 255, 255, 0.8);
          font-size: 10px;
          font-weight: bold;
        }
      }
    }

    // 软件设置 - 开关按钮
    .preferences-visual {
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .toggle-switches {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .toggle {
          width: 30px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 7px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

          .toggle-circle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

            &.active {
              background: linear-gradient(135deg, #4f46e5, #818cf8);
              transform: translateX(16px);
            }
          }
        }
      }
    }

    .title {
      font-size: 1.2rem;
      font-weight: 600;
      // color: rgba(255, 255, 255, 0.95);
      color: #524f4ff2;
      letter-spacing: -0.5px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }
  }

  .bottom {
    p {
      font-size: 0.85rem;
      line-height: 1.4;
      // color: rgba(255, 255, 255, 0.75);
      color: #524f4ff2;
      margin: 0.5rem 0;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    }
  }

  .card-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 0.5rem;

    .action-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    i {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 动画
@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
  100% {
    transform: translateY(15px) rotate(-5deg);
  }
}

@keyframes float-center {
  0% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }
  50% {
    transform: translateX(-50%) translateY(-15px) rotate(5deg);
  }
  100% {
    transform: translateX(-50%) translateY(15px) rotate(-5deg);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .setting-card {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-card {
    height: auto;
    min-height: 140px;
  }
}
</style>
