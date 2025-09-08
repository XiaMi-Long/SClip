<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import NoData from '../../components/no-data/index.vue'
import TextCard from '../../components/card-container-component/Text.vue'
import ImageCard from '../../components/card-container-component/Image.vue'
import RtfCard from '../../components/card-container-component/Rtf.vue'
import CardBadge from '../../effects/CardBadge.vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import throttle from 'lodash/throttle'

const configStore = useConfigStore()

// 创建完全符合 ClipboardState 接口的模拟数据
const mockData: ClipboardState[] = [
  {
    id: 1,
    type: 'text',
    content: '欢迎使用 SClip 新版样式教程！',
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
    content: '这是新版层叠卡片效果演示',
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
    content: '使用键盘或鼠标进行导航操作',
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
    content: '#2A7B9B',
    contentHash: 'hash4',
    timestamp: Date.now() - 3000,
    last_file_name_text: 'demo.png',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['image/png']
  },
  {
    id: 5,
    type: 'text',
    content: '按 Enter 键可将内容复制到剪贴板',
    contentHash: 'hash5',
    timestamp: Date.now() - 4000,
    last_file_name_text: '',
    isSticky: 'false',
    meta: {},
    clipboardTypes: ['text/plain']
  }
]

// 状态管理
const allCards = ref<ClipboardState[]>(mockData)
const activeIndex = ref(0)
const isShowDeleteAnimation = ref(false)

// 计算属性
const getAllCards = computed(() => allCards.value.slice().reverse())
const getActiveCard = computed(() => getAllCards.value[activeIndex.value])
const isMac = computed(() => configStore.getSetting.system.isMac)
const isDelete = computed(() => (index: number) => {
  return isShowDeleteAnimation.value && index === activeIndex.value
})

// 卡片样式配置
const cardStyle = ref({
  text: 'clipboard-card',
  image: 'clipboard-card image-type-card',
  html: 'clipboard-card html-type-card'
})

const cardType = (type: string) => {
  return cardStyle.value[type]
}

// 基础操作函数
const nextPage = (): void => {
  if (activeIndex.value === getAllCards.value.length - 1) return
  activeIndex.value++
}

const prevPage = (): void => {
  if (activeIndex.value === 0) return
  activeIndex.value--
}

// const jumpToFirstPage = (): void => {
//   activeIndex.value = 0
// }

const toggleSticky = (): void => {
  const item = getAllCards.value[activeIndex.value]
  if (item) {
    item.isSticky = item.isSticky === 'true' ? 'false' : 'true'
  }
}

const deleteCurrent = (): void => {
  const count = getAllCards.value.length
  if (count === 0) return

  const currentIndex = count - activeIndex.value - 1
  const currentItem = allCards.value[currentIndex]
  if (currentItem.isSticky === 'true') return

  isShowDeleteAnimation.value = true
  setTimeout(() => {
    isShowDeleteAnimation.value = false
    allCards.value.splice(currentIndex, 1)
    // 如果删除的是最后一位则返回上一个位置
    if (count - 1 === activeIndex.value) {
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
    }
  }, 500)
}

const writeToClipboard = (): void => {
  const item = getActiveCard.value
  if (item) {
    console.log('复制到剪贴板:', item.content)
  }
}

/**
 * 根据卡片索引计算其样式
 * @param index - 卡片的索引
 */
const getCardStyle = (index: number) => {
  // 计算与当前激活卡片的偏移量
  const offset = index - activeIndex.value

  // 只显示中间及其左右两边的卡片，其余的隐藏
  if (Math.abs(offset) > 1) {
    return {
      opacity: 0,
      // 将其移出视野
      transform: `translateX(${Math.sign(offset) * 100}%) scale(0.5) translateZ(-500px)`,
      zIndex: 5
    }
  }

  // 根据偏移量计算样式
  // 中间卡片 scale 为 1，两侧为 0.8
  const scale = offset === 0 ? 1 : 0.8
  // 中间卡片层级最高
  const zIndex = 10 - Math.abs(offset)
  // X 轴偏移量，使两侧卡片露出一半
  const translateX = offset * 50
  // Z 轴偏移量，使两侧卡片有纵深感，看起来在后面
  const translateZ = -Math.abs(offset) * 100

  const isShow = index === activeIndex.value

  return {
    transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`,
    zIndex: zIndex,
    opacity: isShow ? 1 : 0.5,
    backgroundColor: configStore.getSetting.clipboardCardStyle.effects.cardBgColor
  }
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} event - 键盘事件对象
 */
const handleKeyPress = (event: KeyboardEvent) => {
  const keyMap: Record<string, () => void> = {
    'ArrowLeft|a|A': prevPage,
    'ArrowRight|d|D': nextPage,
    'e|E': toggleSticky,
    'q|Q': deleteCurrent,
    Enter: writeToClipboard
  }

  Object.entries(keyMap).forEach(([keys, action]) => {
    if (keys.split('|').includes(event.key)) {
      event.preventDefault()
      action()
    }
  })
}

/**
 * 滚轮事件处理
 * @param {WheelEvent} event - 滚轮事件对象
 */
const WHEEL_THROTTLE_TIME = 40 // 滚轮事件节流时间（毫秒）

const handleWheel = throttle(
  (event: WheelEvent) => {
    // 防止事件冒泡和默认行为（需要 passive: false）
    event.preventDefault()
    const deltaY = event.deltaY

    // Mac: 负值上一页，正值下一页；Windows: 相反
    if (isMac.value) {
      if (deltaY < 0) {
        prevPage()
      } else if (deltaY > 0) {
        nextPage()
      }
    } else {
      if (deltaY > 0) {
        prevPage()
      } else if (deltaY < 0) {
        nextPage()
      }
    }
  },
  WHEEL_THROTTLE_TIME,
  { leading: true, trailing: false }
)

// 全局配置
driver({
  popoverOffset: 20 // 弹窗与高亮元素的距离
})

// 第一个引导：新版样式介绍（层叠卡片效果、3D透视、卡片标记）
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
      element: '.card-swiper-wrapper',
      popover: {
        title: '新版层叠卡片效果',
        description:
          '这是 SClip 的新版界面设计，采用层叠卡片效果展示剪贴板记录。卡片以 3D 透视的方式排列，提供更直观的视觉体验。'
      }
    },
    {
      element: '.card-item',
      popover: {
        title: '3D 透视效果',
        description:
          '每张卡片都有 3D 透视效果，中间的卡片完全显示，两侧的卡片部分显示，营造出层叠的视觉效果。'
      }
    },
    {
      element: '.barge-container',
      popover: {
        title: '卡片标记系统',
        description: '底部显示当前选中卡片的标记信息，包括固定状态、内容类型和长内容提示等。',
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

// 第二个引导：键盘操作-翻页
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
      element: '.barge-container',
      popover: {
        title: '键盘操作 - 锁定数据',
        description:
          '当按下 E 键时，就会对数据进行锁定，无法被 Q 删除操作删除。被锁定的数据会显示特殊的固定标记。现在点击"继续"来体验锁定功能。',
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
      element: '.card-item',
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
      element: '.card-item',
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
      element: '.card-swiper-wrapper',
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
      console.log('新版样式教程已结束')
      configStore.setShowTutorial(false)
    }
  })

  const seventhSteps: DriveStep[] = [
    {
      popover: {
        title: '新版样式教程完成！',
        description:
          '恭喜您已经掌握了 SClip 新版层叠卡片界面的所有基本操作！新版界面提供了更直观的 3D 视觉效果，让剪贴板管理变得更加高效和美观。'
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
  // 键盘事件监听
  window.addEventListener('keydown', handleKeyPress)

  const cardSwiperContainer = document.querySelector('.card-swiper-wrapper') as HTMLElement
  if (cardSwiperContainer) {
    cardSwiperContainer.addEventListener('wheel', handleWheel, { passive: false })
  }

  // 延迟启动教程，确保页面完全渲染
  setTimeout(() => {
    startTour()
  }, 1000)
})

onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyPress)

  const cardSwiperContainer = document.querySelector('.card-swiper-wrapper') as HTMLElement
  if (cardSwiperContainer) {
    cardSwiperContainer.removeEventListener('wheel', handleWheel)
  }

  handleWheel.cancel()
})
</script>

<template>
  <div class="card-swiper-container">
    <NoData v-if="getAllCards.length === 0"></NoData>

    <div v-if="getAllCards.length" class="card-swiper-wrapper">
      <div
        v-for="(item, index) in getAllCards"
        :key="item.id"
        class="card-item"
        :class="{
          'delete-animation': isDelete(index)
        }"
        :style="getCardStyle(index)"
        :data-index="index"
      >
        <div v-if="item" :class="cardType(item.type)">
          <template v-if="item?.type === 'text'">
            <TextCard :clipboard-options="item" />
          </template>
          <template v-if="item?.type === 'image'">
            <ImageCard :clipboard-options="item" />
          </template>
          <template v-if="item?.type === 'rtf'">
            <RtfCard :clipboard-options="item" />
          </template>
        </div>
      </div>
    </div>

    <div class="barge-container">
      <CardBadge :card="getActiveCard" :show-type-indicator="true" :show-long-content-tip="true" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-swiper-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // 设置 3D 透视效果
  perspective: 1000px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-animation {
  transform: scale(0.5) !important;
  opacity: 0 !important;
}

.card-swiper-wrapper {
  position: relative;
  width: 180px;
  height: 250px;
  // 保持 3D 变换
  transform-style: preserve-3d;
}

.card-item {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  zoom: 0.8;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  white-space: normal; /* 允许自动换行 */
  word-wrap: break-word; /* 长单词换行 */
  word-break: break-word; /* 在单词内换行 */
  text-align: center; /* 文字居中对齐 */
  padding: 5px; /* 添加内边距，避免文字贴边 */
  box-sizing: border-box; /* 确保padding不会影响总宽高 */
  border-radius: 10px;
  // 平滑过渡效果
  transition: all 0.5s ease;
  cursor: pointer;
  backface-visibility: hidden;
}

// 卡片样式
.clipboard-card {
  width: 100%;
  height: 100%;
}

.barge-container {
  width: 100px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--title-bar-bg);
  border-radius: 10px;
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
