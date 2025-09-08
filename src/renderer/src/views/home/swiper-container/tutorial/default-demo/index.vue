<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import VClipboardCard from '../../default/card/index.vue'
import CardBadge from '../../default/badge-componet/CardBadge.vue'
import PaginationIndicator from '../../default/card/pagination-component/PaginationIndicator.vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

const configStore = useConfigStore()

const ITEMS_PER_PAGE = 3

// 创建完全符合 ClipboardState 接口的模拟数据
const mockData: ClipboardState[] = [
  {
    id: 1,
    type: 'text',
    content: '欢迎使用 SClip 教程！',
    contentHash: 'hash1',
    timestamp: Date.now(),
    last_file_name_text: '',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['text/plain']
  },
  {
    id: 2,
    type: 'text',
    content: '这是您的智能剪贴板助手',
    contentHash: 'hash2',
    timestamp: Date.now() - 1000,
    last_file_name_text: '',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['text/plain']
  },
  {
    id: 3,
    type: 'text',
    content: '使用箭头键进行导航',
    contentHash: 'hash3',
    timestamp: Date.now() - 2000,
    last_file_name_text: '',
    isSticky: 'true',
    meta: {},
    clipboardTypes: ['text/plain']
  },
  {
    id: 4,
    type: 'text',
    content: '这是第二页的内容',
    contentHash: 'hash4',
    timestamp: Date.now() - 3000,
    last_file_name_text: '',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['text/plain']
  },
  {
    id: 5,
    type: 'image',
    content:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    contentHash: 'hash5',
    timestamp: Date.now() - 4000,
    last_file_name_text: 'placeholder.png',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['image/png']
  },
  {
    id: 6,
    type: 'text',
    content: '按 Enter 键可将内容复制到剪贴板',
    contentHash: 'hash6',
    timestamp: Date.now() - 5000,
    last_file_name_text: '',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['text/plain']
  }
]

const allCards = ref<ClipboardState[]>(mockData)
const currentPage = ref(0)
const currentCardIndex = ref(0)
const showTypeIndicator = ref(true)
const showLongContentTip = ref(true)

/** 总页数 */
const totalPages = computed(() => {
  return Math.ceil(allCards.value.length / 3)
})

const currentPageLength = computed(() => {
  const remaining = allCards.value.length - currentPage.value * ITEMS_PER_PAGE
  return Math.min(remaining, ITEMS_PER_PAGE)
})
const activeAbsoluteIndex = computed(
  () => currentPage.value * ITEMS_PER_PAGE + currentCardIndex.value
)

const PAGE_WIDTH = computed(() => {
  return document.documentElement.clientWidth
})

const listStyle = computed(() => ({
  transform: `translateX(-${currentPage.value * PAGE_WIDTH.value}px)`,
  transition: 'transform .3s ease',
  width: `${totalPages.value * PAGE_WIDTH.value}px`
}))

// 导航操作函数
const prevPage = (): void => {
  console.log('prevPage')
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = (): void => {
  console.log('nextPage')
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    if (currentCardIndex.value >= currentPageLength.value) {
      currentCardIndex.value = currentPageLength.value - 1
    }
  }
}

const prevCard = (): void => {
  console.log('prevCard')
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
  }
}

const nextCard = (): void => {
  console.log('nextCard')
  if (currentCardIndex.value < currentPageLength.value - 1) {
    currentCardIndex.value++
  }
}

/** 切换当前卡片的置顶状态 */
const toggleSticky = () => {
  const item = allCards.value[activeAbsoluteIndex.value]
  if (item) {
    item.isSticky = item.isSticky === 'true' ? 'false' : 'true'
  }
}

/** 删除当前选中的卡片 */
const deleteCurrent = () => {
  allCards.value.splice(currentCardIndex.value, 1)
}

// 键盘事件处理 - 参考 hooks.ts 的实现方式
const handleKeyPress = (event: Event): void => {
  const keyboardEvent = event as KeyboardEvent
  console.log('Key pressed:', keyboardEvent.key) // 调试日志

  const keyMap: Record<string, () => void> = {
    'ArrowLeft|a|A': prevPage,
    'ArrowRight|d|D': nextPage,
    'ArrowUp|w|W': prevCard,
    'ArrowDown|s|S': nextCard,
    'e|E': toggleSticky,
    'q|Q': deleteCurrent
  }

  Object.entries(keyMap).forEach(([keys, action]) => {
    if (keys.split('|').includes(keyboardEvent.key)) {
      event.preventDefault()
      action()
    }
  })
}

// 全局配置
driver({
  popoverOffset: 20 // 弹窗与高亮元素的距离
})

// 第一个引导：基础功能介绍（剪贴板记录、分页指示器、选中状态、复制内容标识）
const startFirstTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第一个引导已结束')
    }
  })

  const firstSteps: DriveStep[] = [
    {
      element: '.card-wrapper.active',
      popover: {
        title: '剪贴板记录',
        description: '这里显示您的剪贴板记录。每条记录都会以卡片的形式展示，方便您快速浏览和管理。'
      }
    },
    {
      element: '.pagination-indicator',
      popover: {
        title: '分页指示器',
        description:
          '这里显示当前页码和总页数，帮助您了解数据的分布情况。当记录较多时，系统会自动分页显示。'
      }
    },
    {
      element: '.badge-container',
      popover: {
        title: '选中状态',
        description:
          '键盘操作时，如果选中某一项，则会显示这个标识。当前高亮的记录就是您选中的项目。'
      }
    },
    {
      element: '.badge-container',
      popover: {
        title: '复制内容标识',
        description:
          '每一个记录都会有一个标识用来标识这是什么类型的数据，比如文本就是TXT，图片就是IMG等。',
        onNextClick: () => {
          driverObj.destroy()
          startSecondTour()
        }
      }
    }
  ]

  driverObj.setSteps(firstSteps)
  driverObj.drive()
}

// 第二个引导：键盘操作-下一页/上一页
const startSecondTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第二个引导已结束')
    }
  })

  const secondSteps: DriveStep[] = [
    {
      popover: {
        title: '键盘操作 - 翻页',
        description:
          '当按下 A/D 键，左方向键/右方向键，即可进行下一页/上一页操作。现在点击"继续"来体验翻页效果。',
        onNextClick: () => {
          driverObj.destroy()
          // 执行翻页操作
          setTimeout(() => {
            nextPage()
            // 间隔500ms后调用上一页
            setTimeout(() => {
              prevPage()
              // 翻页演示完成后，启动第三个引导
              setTimeout(() => {
                startThirdTour()
              }, 500)
            }, 500)
          }, 200)
        }
      }
    }
  ]

  driverObj.setSteps(secondSteps)
  driverObj.drive()
}

// 第三个引导：键盘操作-锁定数据
const startThirdTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第三个引导已结束')
    }
  })

  const thirdSteps: DriveStep[] = [
    {
      element: '.badge-container',
      popover: {
        title: '键盘操作 - 锁定数据',
        description:
          '当按下 E 键时，就会对数据进行锁定，无法被 Q 删除操作删除。被锁定的数据会显示特殊的标识。现在点击"继续"来体验锁定功能。',
        onNextClick: () => {
          driverObj.destroy()
          // 执行锁定操作
          setTimeout(() => {
            toggleSticky()

            setTimeout(() => {
              toggleSticky()
              setTimeout(() => {
                startFourthTour()
              }, 500)
            }, 500)
            // 锁定演示完成后，启动第四个引导
          }, 200)
        }
      }
    }
  ]

  driverObj.setSteps(thirdSteps)
  driverObj.drive()
}

// 第四个引导：键盘操作-删除数据
const startFourthTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第四个引导已结束')
    }
  })

  const fourthSteps: DriveStep[] = [
    {
      element: '.card-wrapper.active',
      popover: {
        title: '键盘操作 - 删除数据',
        description:
          '当按下 Q 键时，就会对数据进行删除，无法删除被 E 固定的数据。删除操作会立即生效，请谨慎使用。现在点击"继续"来体验删除功能。',
        onNextClick: () => {
          driverObj.destroy()
          // 执行删除操作
          setTimeout(() => {
            deleteCurrent()
            // 删除演示完成后，启动第五个引导
            setTimeout(() => {
              startFifthTour()
            }, 500)
          }, 200)
        }
      }
    }
  ]

  driverObj.setSteps(fourthSteps)
  driverObj.drive()
}

// 第五个引导：键盘操作-粘贴操作
const startFifthTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第五个引导已结束')
    }
  })

  const fifthSteps: DriveStep[] = [
    {
      element: '.card-wrapper.active',
      popover: {
        title: '键盘操作 - 粘贴操作',
        description:
          '按下 Enter 按键，可以对目前选中的项执行粘贴操作。这是最常用的功能，可以快速将内容复制到系统剪贴板。',
        onNextClick: () => {
          driverObj.destroy()
          startSixthTour()
        }
      }
    }
  ]

  driverObj.setSteps(fifthSteps)
  driverObj.drive()
}

// 第六个引导：鼠标操作
const startSixthTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '下一步',
    doneBtnText: '继续',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('第六个引导已结束')
    }
  })

  const sixthSteps: DriveStep[] = [
    {
      element: '.card-wrapper.active',
      popover: {
        title: '鼠标操作',
        description:
          '鼠标也可以进行上面大部分的操作，比如滚动滑动就是上一页下一页，左键双击就是粘贴。您可以根据个人习惯选择使用键盘或鼠标操作。',
        onNextClick: () => {
          driverObj.destroy()
          startSeventhTour()
        }
      }
    }
  ]

  driverObj.setSteps(sixthSteps)
  driverObj.drive()
}

// 第七个引导：教程完成
const startSeventhTour = (): void => {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: '完成',
    doneBtnText: '完成',
    showButtons: ['next', 'close'],
    onDestroyed: () => {
      console.log('教程已结束')
      configStore.setShowTutorial(false)
    }
  })

  const seventhSteps: DriveStep[] = [
    {
      popover: {
        title: '教程完成！',
        description:
          '恭喜您已经掌握了 SClip 的所有基本操作！现在可以开始高效使用您的智能剪贴板助手了。记住：键盘操作更高效，鼠标操作更直观。'
      }
    }
  ]

  driverObj.setSteps(seventhSteps)
  driverObj.drive()
}

// 启动教程的主函数
const startTour = (): void => {
  startFirstTour()
}

onMounted(() => {
  // 使用 document 而不是 window，并添加 passive: false 选项
  document.addEventListener('keydown', handleKeyPress, { passive: false })

  // 延迟启动教程，确保页面完全渲染
  setTimeout(() => {
    startTour()
  }, 1000)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <div class="carousel-container">
    <div class="all-cards" :style="listStyle">
      <div
        v-for="(card, index) in allCards"
        :key="card.id"
        :class="['card-wrapper', { active: index === activeAbsoluteIndex }]"
        :style="{ width: PAGE_WIDTH + 'px' }"
        :data-index="index"
      >
        <CardBadge
          :card="card"
          :is-active="index === activeAbsoluteIndex"
          :show-type-indicator="showTypeIndicator"
          :show-long-content-tip="showLongContentTip"
        />
        <VClipboardCard :clipboard-options="card" />
      </div>
    </div>

    <PaginationIndicator
      v-if="totalPages > 0"
      :current="currentPage"
      :total="totalPages"
      class="pagination-indicator"
    />
  </div>
</template>

<style scoped lang="scss">
.carousel-container {
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  background-color: var(--container-bg);
  position: relative;
}

.all-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 0px;
  height: 100%;
  background-color: var(--container-bg);
  transition: background-color 0.5s ease;
  will-change: transform;
}

.card-wrapper {
  box-sizing: border-box;
  height: calc((100% - 6px - 2.5px) / 3);
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.5s ease;
  will-change: transform;
  backface-visibility: hidden;
}

.pagination-indicator {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

/* Driver.js 自定义样式 - 缩小弹窗和文字 */
:global(.driver-popover) {
  background-color: var(--sticky-badge-bg) !important;
  color: var(--text-color) !important;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 280px !important; /* 限制弹窗最大宽度 */
  padding: 12px !important; /* 减少内边距 */
}

:global(.driver-popover-title) {
  font-size: 14px !important; /* 缩小标题字体 */
  font-weight: bold;
  color: var(--text-color) !important;
  margin-bottom: 6px !important; /* 减少标题下边距 */
  line-height: 1.3 !important;
}

:global(.driver-popover-description) {
  font-size: 12px !important; /* 缩小描述字体 */
  color: var(--text-color) !important;
  opacity: 0.9;
  line-height: 1.4 !important;
  margin-bottom: 8px !important; /* 减少描述下边距 */
}

:global(.driver-popover-arrow-side-top.driver-popover-arrow) {
  border-top-color: var(--sticky-badge-bg) !important;
}

:global(.driver-popover-arrow-side-bottom.driver-popover-arrow) {
  border-bottom-color: var(--sticky-badge-bg) !important;
}

:global(.driver-popover-arrow-side-left.driver-popover-arrow) {
  border-left-color: var(--sticky-badge-bg) !important;
}

:global(.driver-popover-arrow-side-right.driver-popover-arrow) {
  border-right-color: var(--sticky-badge-bg) !important;
}

:global(.driver-popover-next-btn),
:global(.driver-popover-done-btn) {
  background-color: var(--button-primary-bg) !important;
  color: white !important;
  text-shadow: none !important;
  border-radius: 4px;
  padding: 6px 12px !important; /* 减少按钮内边距 */
  border: none;
  font-weight: 500;
  font-size: 12px !important; /* 缩小按钮字体 */
}

:global(.driver-popover-next-btn:hover),
:global(.driver-popover-done-btn:hover) {
  opacity: 0.8;
}

:global(.driver-popover-close-btn) {
  color: var(--text-color) !important;
  opacity: 0.7;
  font-size: 14px !important; /* 缩小关闭按钮字体 */

  &:hover {
    opacity: 1 !important;
  }
}

:global(.driver-overlay) {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
