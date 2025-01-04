// theme类型为字符串数组，有common、card三种
type Theme = 'default' | 'card'

interface VSwiperProps {
  theme: Theme
}

export type { Theme, VSwiperProps }
