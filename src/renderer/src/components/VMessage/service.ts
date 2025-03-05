/**
 * 消息服务
 * 用于动态创建和管理消息通知
 */
import { createVNode, render, VNode } from 'vue'
import VMessage from './index.vue'

// 消息类型
type MessageType = 'success' | 'info' | 'warning' | 'error'

// 消息选项
interface MessageOptions {
  type?: MessageType
  message: string
  title?: string
  duration?: number
  showIcon?: boolean
}

// 消息实例容器
const instances: Array<{
  vm: VNode
  container: HTMLElement
}> = []

/**
 * 创建消息实例
 * @param options 消息选项
 */
const createMessage = (options: MessageOptions) => {
  // 创建容器
  const container = document.createElement('div')

  // 消息关闭时移除DOM
  const onClose = () => {
    // 从实例列表中移除
    const index = instances.findIndex((instance) => instance.container === container)
    if (index !== -1) {
      instances.splice(index, 1)
    }

    // 从DOM中移除
    render(null, container)
    document.body.removeChild(container)
  }

  // 创建VNode
  const vnode = createVNode(VMessage, {
    ...options,
    onClose
  })

  closeAll()
  // 渲染到容器
  render(vnode, container)
  document.body.appendChild(container)

  // 保存实例
  const instance = {
    vm: vnode,
    container
  }
  instances.push(instance)

  return instance
}

/**
 * 关闭所有消息
 */
const closeAll = () => {
  instances.forEach((instance) => {
    const component = instance.vm.component
    if (component && component.exposed) {
      component.exposed.close?.()
    }
  })
}

// 创建不同类型消息的便捷方法
const Message = {
  /**
   * 显示成功消息
   * @param messageOrOptions 消息内容或选项
   */
  success(messageOrOptions: string | Omit<MessageOptions, 'type'>) {
    const options =
      typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions

    return createMessage({
      type: 'success',
      ...options
    })
  },

  /**
   * 显示信息消息
   * @param messageOrOptions 消息内容或选项
   */
  info(messageOrOptions: string | Omit<MessageOptions, 'type'>) {
    const options =
      typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions

    return createMessage({
      type: 'info',
      ...options
    })
  },

  /**
   * 显示警告消息
   * @param messageOrOptions 消息内容或选项
   */
  warning(messageOrOptions: string | Omit<MessageOptions, 'type'>) {
    const options =
      typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions

    return createMessage({
      type: 'warning',
      ...options
    })
  },

  /**
   * 显示错误消息
   * @param messageOrOptions 消息内容或选项
   */
  error(messageOrOptions: string | Omit<MessageOptions, 'type'>) {
    const options =
      typeof messageOrOptions === 'string' ? { message: messageOrOptions } : messageOrOptions

    return createMessage({
      type: 'error',
      ...options
    })
  },

  /**
   * 关闭所有消息
   */
  closeAll
}

export default Message
