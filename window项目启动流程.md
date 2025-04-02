# SClip 项目启动流程

## 基本启动步骤

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 启动项目：
   ```bash
   pnpm run dev
   ```

## 常见问题及解决方案

### 问题1：native模块编译错误 (robotjs/better-sqlite3)

如果出现类似以下错误：
```
Error: The module 'robotjs.node' was compiled against a different Node.js version using NODE_MODULE_VERSION 127.
```

#### 解决方案：
重新编译native模块：

1. 检查Python环境：
   ```bash
   python --version
   ```

2. 如果Python版本 >= 3.12，需要安装setuptools：
   ```bash
   pip install setuptools
   ```

3. 重建native模块：
   ```bash
   npx @electron/rebuild -f -w better-sqlite3 robotjs
   ```

4. 再次启动项目：
   ```bash
   pnpm run dev
   ```

### 问题2：Python相关错误 (缺少distutils)

如果遇到类似以下错误：
```
ModuleNotFoundError: No module named 'distutils'
```

#### 解决方案：
1. 安装setuptools：
   ```bash
   pip install setuptools
   ```

2. 如果问题仍然存在，考虑安装较低版本的Python (3.10或3.11)，然后重新尝试重建模块。

### 问题3：控制台中文显示乱码

如果启动后控制台中的中文显示为乱码，这通常是由于控制台编码设置问题，不影响程序功能。

## 替代启动方法

如果pnpm出现问题，可以尝试使用npm：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 重建native模块：
   ```bash
   npm rebuild robotjs better-sqlite3 --force
   ```

   或使用electron-rebuild：
   ```bash
   npx @electron/rebuild -f -w better-sqlite3 robotjs
   ```

3. 启动项目：
   ```bash
   npm run dev
   ```

## 高级：手动指定Node.js和Electron版本

如果遇到版本兼容性问题，可以尝试：

1. 安装特定版本的Node.js (推荐使用nvm管理Node.js版本)
2. 修改package.json中的Electron版本，然后重新安装依赖

## 备忘

- 项目使用pnpm作为包管理工具
- 项目依赖原生模块：robotjs和better-sqlite3
- 需要Python环境支持原生模块的编译
