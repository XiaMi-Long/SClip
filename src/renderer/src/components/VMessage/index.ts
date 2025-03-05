/**
 * 消息通知插件
 * 用于全局注册Message服务
 */
import { App } from 'vue'
import Message from './service'
import VMessage from './index.vue'

export { VMessage }

export default {
  install(app: App) {
    // 注册组件
    app.component('VMessage', VMessage)

    // 添加全局属性
    app.config.globalProperties.$message = Message
  }
}

// 导出消息服务
export { Message }
