<script lang="ts" setup>
/**
 * 设置页面组件
 * 包含左侧导航和右侧内容区域
 */
import { ref, shallowRef } from 'vue'
import ThemeSettings from './theme/ThemeSettings.vue'
import LanguageSettings from './language/index.vue'

// 子菜单项类型
interface SubmenuItem {
  id: string
  label: string
  component: unknown
}

// 菜单项类型
interface MenuItem {
  id: string
  icon: string
  label: string
  children?: SubmenuItem[]
  component?: unknown
}

// 菜单项
const menuItems: MenuItem[] = [
  {
    id: 'general',
    icon: '&#9881;',
    label: '系统设置',
    children: [
      { id: 'appearance', label: '外观设置', component: ThemeSettings },
      { id: 'language', label: '语言设置', component: LanguageSettings },
      { id: 'keyboard', label: '快捷键设置', component: null },
      { id: 'date', label: '趣味数据', component: null },
      { id: 'sclip', label: 'SClip设置', component: null }
    ]
  }
]

// 当前选中的菜单和子菜单
const selectedMenu = ref('general')
const selectedSubmenu = ref('appearance')

// 当前显示的组件
const currentComponent = shallowRef(ThemeSettings)

/**
 * 设置当前选中的菜单和子菜单
 * @param {string} menuId - 菜单ID
 * @param {string | null} submenuId - 子菜单ID
 */
const selectMenu = (menuId: string, submenuId: string | null = null) => {
  console.log(menuId, submenuId)
  selectedMenu.value = menuId

  // 如果有子菜单，设置子菜单，否则清空子菜单
  if (submenuId) {
    selectedSubmenu.value = submenuId
  } else {
    // 有子菜单的情况下，默认选择第一个子菜单
    const menu = menuItems.find((item) => item.id === menuId)
    if (menu && menu.children && menu.children.length > 0) {
      selectedSubmenu.value = menu.children[0].id
    } else {
      selectedSubmenu.value = ''
    }
  }

  // 设置当前显示的组件
  // 这里只实现了主题设置，所以默认显示ThemeSettings
  currentComponent.value = menuItems
    .find((item) => item.id === menuId)
    ?.children?.find((child) => child.id === submenuId)?.component
}

// 初始化时默认选中general菜单，显示主题设置
selectMenu('general', 'appearance')
</script>

<template>
  <div class="settings-container">
    <!-- 左侧设置菜单 -->
    <div class="settings-sidebar">
      <div class="settings-title">设置</div>

      <div class="menu-container">
        <!-- 主菜单 -->
        <div v-for="item in menuItems" :key="item.id" class="menu-group">
          <div
            class="menu-item"
            :class="{ active: selectedMenu === item.id }"
            @click="selectMenu(item.id)"
          >
            <span v-html="item.icon" class="menu-icon"></span>
            <span class="menu-label">{{ item.label }}</span>
            <!-- <span v-if="item.children && item.children.length" class="menu-arrow">&#9662;</span> -->
          </div>

          <!-- 子菜单 -->
          <div
            v-if="item.id === selectedMenu && item.children && item.children.length"
            class="submenu"
          >
            <div
              v-for="subItem in item.children"
              :key="subItem.id"
              class="submenu-item"
              :class="{ active: selectedSubmenu === subItem.id }"
              @click.stop="selectMenu(item.id, subItem.id)"
            >
              {{ subItem.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="settings-content">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="currentComponent" />
        </keep-alive>
      </transition>
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
    background-color: var(--setting-menu-active-bg);
  }

  &.active {
    background-color: var(--setting-menu-active-bg);
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

.menu-arrow {
  font-size: 12px;
  transition: transform 0.3s;

  .active & {
    transform: rotate(180deg);
  }
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
    background-color: var(--setting-menu-active-bg);
  }

  &.active {
    background-color: var(--setting-menu-active-bg);
    font-weight: 500;
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  color: var(--text-color);
  transition: color 0.5s;

  scrollbar-width: none;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
