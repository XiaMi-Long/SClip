/**
 * 日志工具类
 */
export class Logger {
    private static getTime(): string {
        return new Date().toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        })
    }

    /**
     * 信息日志
     * @param module 模块名称
     * @param message 日志信息
     * @param data 额外数据
     */
    static info(module: string, message: string, data?: any): void {
        console.log(
            `[${this.getTime()}] 📘 [${module}] ${message}`,
            data ? data + '\n' : ''
        )
    }

    /**
     * 警告日志
     * @param module 模块名称
     * @param message 日志信息
     * @param data 额外数据
     */
    static warn(module: string, message: string, data?: any): void {
        console.warn(
            `[${this.getTime()}] 📙 [${module}] ${message}`,
            data ? data + '\n' : ''
        )
    }

    /**
     * 错误日志
     * @param module 模块名称
     * @param message 日志信息
     * @param error 错误对象
     */
    static error(module: string, message: string, error?: any): void {
        console.error(
            `[${this.getTime()}] 📕 [${module}] ${message}`,
            error ? error + '\n' : ''
        )
    }

    /**
     * 调试日志
     * @param module 模块名称
     * @param message 日志信息
     * @param data 额外数据
     */
    static debug(module: string, message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(
                `[${this.getTime()}] 📓 [${module}] ${message}`,
                data ? data + '\n' : ''
            )
        }
    }
}