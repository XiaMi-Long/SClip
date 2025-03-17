<script lang="ts" setup>
/**
 * 设置页面组件
 * 包含左侧导航和右侧内容区域
 */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 子菜单项类型
interface SubmenuItem {
  id: string
  label: string
  name: string
}

// 菜单项类型
interface MenuItem {
  id: string
  icon: string
  label: string
  children?: SubmenuItem[]
}

// 菜单项
const menuItems: MenuItem[] = [
  {
    id: 'general',
    icon: '&#9881;',
    label: '系统设置',
    children: [
      { id: 'Theme', label: '外观设置', name: 'Theme' },
      { id: 'Language', label: '语言设置', name: 'Language' },
      { id: 'Keyboard', label: '快捷键设置', name: 'Keyboard' },
      { id: 'Sclip', label: 'SClip设置', name: 'Sclip' },
      { id: 'Log', label: '日志查看', name: 'Log' },
      { id: 'Fun', label: '趣味设置', name: 'Fun' },
      { id: 'About', label: '关于', name: 'About' }
    ]
  }
]

const router = useRouter()
const route = useRoute()

// 当前选中的菜单和子菜单
const selectedMenu = ref('general')
const selectedSubmenu = ref('Theme')

/**
 * 设置当前选中的菜单并导航到相应路由
 * @param {string} menuId - 菜单ID
 * @param {string | null} submenuId - 子菜单ID
 * @param {string | null} routePath - 路由路径
 */
const selectMenu = (
  menuId: string,
  submenuId: string | null = null,
  routeName: string | null = null
) => {
  selectedMenu.value = menuId

  if (submenuId) {
    selectedSubmenu.value = submenuId
  } else {
    // 有子菜单的情况下，默认选择第一个子菜单
    const menu = menuItems.find((item) => item.id === menuId)
    if (menu && menu.children && menu.children.length > 0) {
      selectedSubmenu.value = menu.children[0].id
      router.push({ name: menu.children[0].name })
    } else {
      selectedSubmenu.value = ''
    }
  }

  // 如果提供了路由路径，则导航到该路径
  if (routeName) {
    router.push({ name: routeName })
  }
}

// 监听路由变化更新选中状态
const updateSelectedFromRoute = () => {
  const pathSegments = route.path.split('/')
  const currentSubmenu = pathSegments.pop() || 'Theme'
  selectedSubmenu.value = currentSubmenu
}

// 初始化时根据当前路由设置选中状态
updateSelectedFromRoute()
</script>

<template>
  <div class="settings-container">
    <!-- 左侧设置菜单 -->
    <div class="settings-sidebar">
      <div class="settings-title">设置</div>

      <div class="menu-container">
        <!-- 主菜单 -->
        <div v-for="item in menuItems" :key="item.id" class="menu-group">
          <div class="menu-item" :class="{ active: selectedMenu === item.id }" @click="selectMenu(item.id)">
            <span class="menu-icon" v-html="item.icon"></span>
            <span class="menu-label">{{ item.label }}</span>
          </div>

          <!-- 子菜单 -->
          <div v-if="item.id === selectedMenu && item.children && item.children.length" class="submenu">
            <div v-for="subItem in item.children" :key="subItem.id" class="submenu-item"
              :class="{ active: selectedSubmenu === subItem.id }" @click.stop="selectMenu(item.id, subItem.id, subItem.name)">
              {{ subItem.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="settings-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <!-- 添加一个包装div，使用route.name作为key以确保路由变化时重新渲染 -->
          <div :key="route.name">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </div>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  display: flex;
  height: calc(100vh - var(--title-bar-height, 38px));
  width: 100%;
  background-color: var(--container-bg, #f5f5f7);
  transition: background-color 0.5s;
  color: var(--text-color, #333);
  overflow: hidden;
}

.settings-sidebar {
  width: 250px;
  border-right: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  transition: color 0.5s;
  padding: 20px 0;
}

.settings-title {
  font-size: 24px;
  font-weight: 600;
  padding: 0 20px 20px;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
}

.menu-group {
  margin-bottom: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  margin: 0 10px;
  position: relative;
  transition: background-color 0.5s;

  &:hover {
    background-color: var(--title-bar-bg);
  }

  &.active {
    background-color: var(--title-bar-bg);
    font-weight: 500;
  }
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-label {
  flex: 1;
}

.submenu {
  margin: 4px 0 8px 20px;
}

.submenu-item {
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 6px;
  margin: 2px 10px;
  font-size: 14px;
  transition: background-color 0.5s;

  &:hover {
    background-color: var(--title-bar-bg);
  }

  &.active {
    background-color: var(--title-bar-bg);
    font-weight: 500;
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  color: var(--text-color);
  transition: color 0.5s;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
