#!/bin/bash

# 创建临时目录
mkdir -p temp_iconset

# 使用现有的PNG文件创建不同尺寸的图标
# 从最大的PNG文件开始，确保质量

# 复制现有文件到iconset目录
cp resources/images/icons/icon.png temp_iconset/icon_16x16.png
cp resources/images/icons/icon@1.25x.png temp_iconset/icon_16x16@2x.png
cp resources/images/icons/icon@1.5x.png temp_iconset/icon_32x32.png
cp resources/images/icons/icon@2x.png temp_iconset/icon_32x32@2x.png
cp resources/images/icons/icon@2x.png temp_iconset/icon_128x128.png
cp resources/images/icons/icon@3x.png temp_iconset/icon_128x128@2x.png
cp resources/images/icons/icon@3x.png temp_iconset/icon_256x256.png
cp resources/images/icons/icon@3x.png temp_iconset/icon_256x256@2x.png
cp resources/images/icons/icon@3x.png temp_iconset/icon_512x512.png
cp resources/images/icons/icon@3x.png temp_iconset/icon_512x512@2x.png

# 使用sips调整尺寸（macOS内置工具）
echo "正在调整图标尺寸..."

# 16x16
sips -z 16 16 temp_iconset/icon_16x16.png
sips -z 32 32 temp_iconset/icon_16x16@2x.png

# 32x32
sips -z 32 32 temp_iconset/icon_32x32.png
sips -z 64 64 temp_iconset/icon_32x32@2x.png

# 128x128
sips -z 128 128 temp_iconset/icon_128x128.png
sips -z 256 256 temp_iconset/icon_128x128@2x.png

# 256x256
sips -z 256 256 temp_iconset/icon_256x256.png
sips -z 512 512 temp_iconset/icon_256x256@2x.png

# 512x512
sips -z 512 512 temp_iconset/icon_512x512.png
sips -z 1024 1024 temp_iconset/icon_512x512@2x.png

# 生成ICNS文件
echo "正在生成ICNS文件..."
iconutil -c icns temp_iconset -o resources/images/icons/icon.icns

# 清理临时文件
rm -rf temp_iconset

echo "ICNS文件生成完成: resources/images/icons/icon.icns"