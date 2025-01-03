# 1. 确保主分支是最新的
git checkout main
git pull origin main

# 2. 创建并切换到新的功能分支
git checkout -b feature/add-docs

# 3. 在功能分支上进行开发
# ... 进行代码修改 ...

# 4. 在提交前先同步主分支最新代码(避免冲突)
git checkout main
git pull origin main
git checkout feature/add-docs
git merge main

# 如果出现冲突:
# - 手动解决冲突文件
# - git add .
# - git commit -m "merge: 解决与主分支的冲突"

# 5. 提交功能分支的修改
git add .
git commit -m "docs: 添加项目文档目录"

# 6. 推送功能分支到远程
git push -u origin feature/add-docs

# 7. 在代码仓库(如GitHub)上创建PR
# - 打开仓库页面
# - 点击 "New Pull Request"
# - 选择 main <- feature/add-docs
# - 填写PR描述
# - 请求代码审查

# 8. PR合并后的清理工作
git checkout main
git pull origin main
git branch -d feature/add-docs        # 删除本地功能分支
git push origin --delete feature/add-docs  # 删除远程功能分支