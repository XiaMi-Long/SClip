/**
 * @file system.theme.ts
 * @description 系统主题配置工具文件，提供主题变量接口以及写入全局 :root CSS 变量的函数，用于实现主题颜色的动态切换
 */

/**
 * @typedef {Object} SystemTheme
 * @property {string} [clipboardListBg] - 剪贴板列表背景颜色
 * @property {string} [clipboardCardBg] - 剪贴板卡片背景颜色
 * @property {string} [swiperPaginationColor] - 轮播图进度条颜色
 * @property {string} [swiperPaginationBulletSize] - 轮播图进度条子弹大小
 * @property {string} [swiperPaginationBulletWidth] - 轮播图进度条子弹宽度
 * @property {string} [swiperPaginationBulletHeight] - 轮播图进度条子弹高度
 * @property {string} [stickyBadgeBg] - 固定徽章背景颜色
 * @property {string} [stickyBadgeErrorBg] - 固定徽章错误背景颜色
 */
export interface SystemTheme {
    clipboardListBg?: string;
    clipboardCardBg?: string;
    swiperPaginationColor?: string;
    swiperPaginationBulletSize?: string;
    swiperPaginationBulletWidth?: string;
    swiperPaginationBulletHeight?: string;
    stickyBadgeBg?: string;
    stickyBadgeErrorBg?: string;
}

/**
 * @description 默认的系统主题设置，与 theme.css 中一致喵～
 */
export const defaultTheme: SystemTheme = {
    clipboardListBg: '#f3f3f3',
    clipboardCardBg: '#ffffff',
    swiperPaginationColor: '#ec6b5e',
    swiperPaginationBulletSize: '5px',
    swiperPaginationBulletWidth: '5px',
    swiperPaginationBulletHeight: '5px',
    stickyBadgeBg: '#86cfab',
    stickyBadgeErrorBg: '#f67373',
};

/**
 * @description 定义可选的预设主题 key
 */
export type PresetThemeKey = 'default' | 'yellow' | 'red' | 'black' | 'blue' | 'green';

/**
 * @description 预设的主题配置集合，可供选择的主题（5-6种）
 */
export const presetThemes: Record<PresetThemeKey, SystemTheme> = {
    default: { ...defaultTheme },
    yellow: {
        clipboardListBg: '#FFF9C4',       // 浅黄色背景
        clipboardCardBg: '#FFFDE7',
        swiperPaginationColor: '#FFC107',   // 琥珀色
        swiperPaginationBulletSize: '5px',
        swiperPaginationBulletWidth: '5px',
        swiperPaginationBulletHeight: '5px',
        stickyBadgeBg: '#FFEB3B',           // 亮黄色徽章
    },
    red: {
        clipboardListBg: '#FFCDD2',       // 浅红色背景
        clipboardCardBg: '#FFEBEE',
        swiperPaginationColor: '#F44336',   // 鲜红色
        swiperPaginationBulletSize: '5px',
        swiperPaginationBulletWidth: '5px',
        swiperPaginationBulletHeight: '5px',
        stickyBadgeBg: '#E91E63',           // 粉红色徽章
    },
    black: {
        clipboardListBg: '#424242',       // 深灰色背景
        clipboardCardBg: '#616161',
        swiperPaginationColor: '#212121',   // 几乎是黑色
        swiperPaginationBulletSize: '5px',
        swiperPaginationBulletWidth: '5px',
        swiperPaginationBulletHeight: '5px',
        stickyBadgeBg: '#212121',           // 深黑徽章
    },
    blue: {
        clipboardListBg: '#E3F2FD',       // 浅蓝背景
        clipboardCardBg: '#BBDEFB',
        swiperPaginationColor: '#2196F3',   // 蓝色
        swiperPaginationBulletSize: '5px',
        swiperPaginationBulletWidth: '5px',
        swiperPaginationBulletHeight: '5px',
        stickyBadgeBg: '#64B5F6',           // 深蓝徽章
    },
    green: {
        clipboardListBg: '#E8F5E9',       // 浅绿色背景
        clipboardCardBg: '#C8E6C9',
        swiperPaginationColor: '#4CAF50',   // 绿色
        swiperPaginationBulletSize: '5px',
        swiperPaginationBulletWidth: '5px',
        swiperPaginationBulletHeight: '5px',
        stickyBadgeBg: '#81C784',           // 深绿徽章
    },
};

/**
 * @description 将传入的主题配置写入到全局 :root CSS 变量中，实现主题颜色的动态切换
 * @param {SystemTheme} theme - 主题配置对象，用于更新全局变量
 */
export function setSystemTheme(theme: SystemTheme): void {
    const root = document.documentElement;
    if (theme.clipboardListBg) {
        root.style.setProperty('--clipboard-list-bg', theme.clipboardListBg);
    }
    if (theme.clipboardCardBg) {
        root.style.setProperty('--clipboard-card-bg', theme.clipboardCardBg);
    }
    if (theme.swiperPaginationColor) {
        root.style.setProperty('--swiper-pagination-color', theme.swiperPaginationColor);
    }
    if (theme.swiperPaginationBulletSize) {
        root.style.setProperty('--swiper-pagination-bullet-size', theme.swiperPaginationBulletSize);
    }
    if (theme.swiperPaginationBulletWidth) {
        root.style.setProperty('--swiper-pagination-bullet-width', theme.swiperPaginationBulletWidth);
    }
    if (theme.swiperPaginationBulletHeight) {
        root.style.setProperty('--swiper-pagination-bullet-height', theme.swiperPaginationBulletHeight);
    }
    if (theme.stickyBadgeBg) {
        root.style.setProperty('--stickybadge-bg', theme.stickyBadgeBg);
    }
    if (theme.stickyBadgeErrorBg) {
        root.style.setProperty('--stickybadge-error-bg', theme.stickyBadgeErrorBg);
    }
}

/**
 * @description 初始化系统主题，默认使用 defaultTheme；此函数应在应用初始化时调用喵～
 */
export function initSystemTheme(): void {
    setSystemTheme(defaultTheme);
}

/**
 * @description 动态更新单个主题变量的辅助函数
 * @param {keyof SystemTheme} key - 主题变量名称
 * @param {string} value - 主题变量对应的新值
 */
export function updateThemeVariable(key: keyof SystemTheme, value: string): void {
    const root = document.documentElement;
    switch (key) {
        case 'clipboardListBg':
            root.style.setProperty('--clipboard-list-bg', value);
            break;
        case 'clipboardCardBg':
            root.style.setProperty('--clipboard-card-bg', value);
            break;
        case 'swiperPaginationColor':
            root.style.setProperty('--swiper-pagination-color', value);
            break;
        case 'swiperPaginationBulletSize':
            root.style.setProperty('--swiper-pagination-bullet-size', value);
            break;
        case 'swiperPaginationBulletWidth':
            root.style.setProperty('--swiper-pagination-bullet-width', value);
            break;
        case 'swiperPaginationBulletHeight':
            root.style.setProperty('--swiper-pagination-bullet-height', value);
            break;
        case 'stickyBadgeBg':
            root.style.setProperty('--stickybadge-bg', value);
            break;
        case 'stickyBadgeErrorBg':
            root.style.setProperty('--stickybadge-error-bg', value);
            break;
        default:
            console.warn('未知的主题变量:', key);
            break;
    }
}

/**
 * @description 通过预设主题的 key 切换主题
 * @param {PresetThemeKey} themeKey - 预设主题的 key（比如 'yellow', 'red' 等）
 */
export function setPresetTheme(themeKey: PresetThemeKey): void {
    const preset = presetThemes[themeKey];
    if (preset) {
        setSystemTheme(preset);
    } else {
        console.warn('未找到对应的预设主题:', themeKey);
    }
}

/**
 * @description 获取当前系统主题的配置，通过读取 :root 的 CSS 变量
 * @returns {SystemTheme} 当前主题配置对象
 */
export function getCurrentTheme(): SystemTheme {
    const rootStyles = getComputedStyle(document.documentElement);
    return {
        clipboardListBg: rootStyles.getPropertyValue('--clipboard-list-bg').trim(),
        clipboardCardBg: rootStyles.getPropertyValue('--clipboard-card-bg').trim(),
        swiperPaginationColor: rootStyles.getPropertyValue('--swiper-pagination-color').trim(),
        swiperPaginationBulletSize: rootStyles.getPropertyValue('--swiper-pagination-bullet-size').trim(),
        swiperPaginationBulletWidth: rootStyles.getPropertyValue('--swiper-pagination-bullet-width').trim(),
        swiperPaginationBulletHeight: rootStyles.getPropertyValue('--swiper-pagination-bullet-height').trim(),
        stickyBadgeBg: rootStyles.getPropertyValue('--stickybadge-bg').trim(),
        stickyBadgeErrorBg: rootStyles.getPropertyValue('--stickybadge-error-bg').trim(),
    };
}
