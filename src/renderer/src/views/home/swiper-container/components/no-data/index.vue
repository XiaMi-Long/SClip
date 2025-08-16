<script lang="ts" setup>
// 空数据动画
const noDataMotion = {
  initial: {
    opacity: 0,
    y: -10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 600,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
}
</script>

<template>
  <!-- 内层列表，将所有卡片渲染出来 -->
  <div v-motion="noDataMotion" class="no-data-container">
    <div class="no-data-content">
      <div class="no-data-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V13.5H21V2L19.5 3.5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3 13.5H21V22H3V13.5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 17H15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>暂无剪贴板记录</h3>
      <p>复制一些内容后会在这里显示</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 空数据容器样式 */
.no-data-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .no-data-content {
    text-align: center;
    color: var(--text-color, #8c8c8c);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: fadeIn 0.5s ease-in-out;
  }

  .no-data-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 8px;

    svg {
      width: 100%;
      height: 100%;
      color: var(--text-color, #8c8c8c);
      animation: floatAnimation 3s ease-in-out infinite;
    }
  }

  h3 {
    font-size: 18px;
    margin: 0;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
