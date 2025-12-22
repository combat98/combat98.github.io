# Git

## 简介

Git 是一个分布式版本控制系统，用于跟踪文件的变更历史，是现代软件开发中不可或缺的工具。

### 特点

- **分布式** - 每个开发者都有完整的代码仓库
- **快速** - 大部分操作在本地完成
- **分支管理** - 轻量级的分支创建和合并
- **数据完整性** - 使用 SHA-1 哈希保证数据完整性
- **开源免费** - 完全开源

## 安装

### Windows

下载 [Git for Windows](https://git-scm.com/download/win) 安装包。

或使用包管理器：
```bash
# 使用 Chocolatey
choco install git

# 使用 Scoop
scoop install git
```

### macOS

```bash
# 使用 Homebrew
brew install git

# 使用 Xcode Command Line Tools
xcode-select --install
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Fedora
sudo dnf install git
```

## 配置

### 全局配置

```bash
# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "your.email@example.com"

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置默认分支名
git config --global init.defaultBranch main

# 查看配置
git config --list

# 查看特定配置
git config user.name
```

### 配置别名

```bash
# 常用别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## 基本操作

### 创建仓库

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git

# 克隆到指定目录
git clone https://github.com/user/repo.git my-project
```

### 查看状态

```bash
# 查看工作区状态
git status

# 简洁模式
git status -s
```

### 添加文件

```bash
# 添加单个文件
git add file.txt

# 添加所有文件
git add .

# 添加所有 .js 文件
git add *.js

# 交互式添加
git add -i

# 添加部分更改
git add -p
```

### 提交更改

```bash
# 提交
git commit -m "提交信息"

# 添加并提交
git commit -am "提交信息"

# 修改最后一次提交
git commit --amend

# 修改提交信息
git commit --amend -m "新的提交信息"
```

### 查看历史

```bash
# 查看提交历史
git log

# 简洁模式
git log --oneline

# 图形化显示
git log --graph --oneline --all

# 查看最近 5 次提交
git log -5

# 查看某个文件的历史
git log -- file.txt

# 查看提交详情
git show commit-hash
```

### 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最后一次提交的差异
git diff --staged

# 查看两个提交之间的差异
git diff commit1 commit2

# 查看某个文件的差异
git diff file.txt
```

## 分支管理

### 创建和切换分支

```bash
# 查看分支
git branch

# 查看所有分支（包括远程）
git branch -a

# 创建分支
git branch feature-branch

# 切换分支
git checkout feature-branch

# 创建并切换分支
git checkout -b feature-branch

# 使用 switch（Git 2.23+）
git switch feature-branch
git switch -c feature-branch
```

### 合并分支

```bash
# 合并分支到当前分支
git merge feature-branch

# 不使用快进合并
git merge --no-ff feature-branch

# 压缩合并
git merge --squash feature-branch
```

### 删除分支

```bash
# 删除本地分支
git branch -d feature-branch

# 强制删除
git branch -D feature-branch

# 删除远程分支
git push origin --delete feature-branch
```

### 变基

```bash
# 变基到主分支
git rebase main

# 交互式变基
git rebase -i HEAD~3

# 继续变基
git rebase --continue

# 中止变基
git rebase --abort
```

## 远程仓库

### 查看远程仓库

```bash
# 查看远程仓库
git remote

# 查看详细信息
git remote -v

# 查看远程仓库详情
git remote show origin
```

### 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库 URL
git remote set-url origin https://github.com/user/new-repo.git

# 删除远程仓库
git remote remove origin
```

### 推送和拉取

```bash
# 推送到远程仓库
git push origin main

# 推送所有分支
git push --all origin

# 推送标签
git push --tags

# 强制推送（慎用）
git push -f origin main

# 拉取远程更改
git pull origin main

# 拉取并变基
git pull --rebase origin main

# 获取远程更改（不合并）
git fetch origin
```

## 标签

### 创建标签

```bash
# 轻量标签
git tag v1.0.0

# 附注标签
git tag -a v1.0.0 -m "版本 1.0.0"

# 给特定提交打标签
git tag -a v1.0.0 commit-hash -m "版本 1.0.0"
```

### 查看标签

```bash
# 列出所有标签
git tag

# 查看标签信息
git show v1.0.0

# 搜索标签
git tag -l "v1.*"
```

### 推送和删除标签

```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

## 撤销操作

### 撤销工作区更改

```bash
# 撤销单个文件
git checkout -- file.txt

# 撤销所有更改
git checkout -- .

# 使用 restore（Git 2.23+）
git restore file.txt
git restore .
```

### 撤销暂存

```bash
# 取消暂存单个文件
git reset HEAD file.txt

# 取消所有暂存
git reset HEAD

# 使用 restore（Git 2.23+）
git restore --staged file.txt
```

### 撤销提交

```bash
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（不保留更改）
git reset --hard HEAD~1

# 撤销到特定提交
git reset --hard commit-hash

# 创建新提交来撤销
git revert commit-hash
```

## 储藏

### 储藏更改

```bash
# 储藏当前更改
git stash

# 储藏并添加描述
git stash save "工作进行中"

# 包括未跟踪的文件
git stash -u

# 查看储藏列表
git stash list

# 应用最新储藏
git stash apply

# 应用并删除储藏
git stash pop

# 应用特定储藏
git stash apply stash@{0}

# 删除储藏
git stash drop stash@{0}

# 清空所有储藏
git stash clear
```

## 高级操作

### Cherry-pick

```bash
# 应用特定提交到当前分支
git cherry-pick commit-hash

# 应用多个提交
git cherry-pick commit1 commit2

# 应用提交范围
git cherry-pick commit1..commit2
```

### 子模块

```bash
# 添加子模块
git submodule add https://github.com/user/repo.git path/to/submodule

# 克隆包含子模块的仓库
git clone --recursive https://github.com/user/repo.git

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 更新所有子模块
git submodule update --remote
```

### 清理

```bash
# 删除未跟踪的文件（预览）
git clean -n

# 删除未跟踪的文件
git clean -f

# 删除未跟踪的文件和目录
git clean -fd

# 删除被忽略的文件
git clean -fX
```

## .gitignore

### 常用规则

```gitignore
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录
node_modules/

# 忽略 dist 目录
dist/
build/

# 忽略 IDE 配置
.vscode/
.idea/
*.swp

# 忽略操作系统文件
.DS_Store
Thumbs.db

# 但不忽略特定文件
!important.log

# 忽略根目录下的文件
/config.local.js

# 忽略所有目录下的文件
**/temp/
```

### 全局 .gitignore

```bash
# 创建全局 .gitignore
git config --global core.excludesfile ~/.gitignore_global

# 编辑文件
vim ~/.gitignore_global
```

## Git Flow

### 分支模型

- **main** - 主分支，生产环境代码
- **develop** - 开发分支
- **feature/** - 功能分支
- **release/** - 发布分支
- **hotfix/** - 热修复分支

### 工作流程

```bash
# 开始新功能
git checkout -b feature/new-feature develop

# 完成功能
git checkout develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature

# 创建发布分支
git checkout -b release/1.0.0 develop

# 完成发布
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# 热修复
git checkout -b hotfix/1.0.1 main
# 修复后
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1
git checkout develop
git merge --no-ff hotfix/1.0.1
git branch -d hotfix/1.0.1
```

## 最佳实践

1. **频繁提交** - 小步提交，便于回滚
2. **清晰的提交信息** - 描述做了什么和为什么
3. **使用分支** - 为每个功能创建分支
4. **定期同步** - 经常拉取远程更改
5. **代码审查** - 使用 Pull Request
6. **保护主分支** - 不直接在主分支上开发
7. **使用 .gitignore** - 不提交临时文件和敏感信息

## 提交信息规范

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型

- `feat` - 新功能
- `fix` - 修复 bug
- `docs` - 文档更新
- `style` - 代码格式（不影响代码运行）
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 构建过程或辅助工具的变动

#### 示例

```
feat(user): 添加用户登录功能

实现了用户登录的基本功能，包括：
- 用户名密码验证
- JWT token 生成
- 登录状态保持

Closes #123
```

## 常见问题

### 合并冲突

```bash
# 查看冲突文件
git status

# 手动解决冲突后
git add conflicted-file.txt
git commit

# 中止合并
git merge --abort
```

### 修改历史

```bash
# 修改最后一次提交
git commit --amend

# 交互式变基修改历史
git rebase -i HEAD~3
```

### 找回丢失的提交

```bash
# 查看引用日志
git reflog

# 恢复提交
git checkout commit-hash
git cherry-pick commit-hash
```

## 总结

Git 是现代软件开发的基础工具：

- ✅ 分布式版本控制
- ✅ 强大的分支管理
- ✅ 完整的历史记录
- ✅ 灵活的工作流程
- ✅ 广泛的社区支持

掌握 Git 是每个开发者的必备技能。

## 参考资源

- [Git 官网](https://git-scm.com/)
- [Pro Git 书籍](https://git-scm.com/book/zh/v2)
- [GitHub 文档](https://docs.github.com/)
- [Git 速查表](https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/)
