# git 版本库管理工具

::: danger Git 命令
进行项目开发之前，需要对 git 版本库有起码的认识，具有基本的操作能力。git 命令参考文档：https://gitee.com/all-about-git
:::

## git 常用命令

```bash
# git配置
git config --globel user.name zhangjinxi 配置git全局用户名
git config --globel use.email zhangjinxi@gaodun.com 配置git全局邮箱
ssh-keygen -t rsa ssh加密，生成公钥和私钥，存在~/.ssh目录内，把公钥id_rsa.pub内容复制到远端仓库中

# git项目初始化操作
git init 初始化一个本地git仓库
git clone [url] 克隆远程仓库url，到本地

# git远程仓库
git remote 查看远程主机
git remote -v 显示所有远程仓库
git remote show origin 显示origin远程仓库的信息
git remote add [name] [url] 添加远程仓库url,别名为name
git remote rm [name] 删除远程仓库
git remote rename [oldName] [newName] 修改远程仓库别名

# git常用操作
git status 查看项目状态
git log 查看commit记录
git reflog 查看所有操作记录，删除、提交、创建新分支等操作
git fetch  拉取远程仓库最新代码到`本地对应远程分支`
git merge [branch] 融合branch分支的代码
git cherry-pick commitId 把某个commitId的更改merge过来，而不是整个分支的更改
git rebase [branch commitId] 把branch分支最新代码作为基点，commit记录为直线,-i:进入交互模式，可以选择某些commitId进行rebase操作，--continue 需要继续rebase操作 --abort终止rebase
git pull  等于git fetch + git merge
git add [filename]  把filename的更改添加到缓存区
git add . 所有更改添加到缓存区
git commit -m [message] 提交到版本库，注解信息为message
git commit -am [message] 跳过缓存区，直接提交到版本库，注解信息为message
git commit -amend [message] 跳过缓存区，直接提交到版本库，注解信息为message 有message时会覆盖上次提交信息
git push [origin] [localBranch]:[remoteBranch] 推送本地localBranch分支代码，到远程origin仓库的remoteBranch分支，-u 跟踪，-f:--force强推 -d：--delete 删除远程分支

# 分支操作
git branch 查看本地分支 -a 查看所有分支
git branch [branchName] 创建branchName分支
git checkout [branchName] 切换到branchName分支
git checkout -b [branchName] 创建并切换到branchName分支

# 撤销操作
git checkout -- [filename] 撤销工作目录中filename文件的修改操作
git reset --[type] [remoteName]/[branchName] 把本分支重置为远程remoteName仓库的branchName分支或者commitId，type:hard工作区、缓存区、版本库全部重置，mixed缓存区和版本库重置，soft只有版本库重置
git revert [commitId] 代码回退到某个commitId,通过添加一个commitId回退

# git暂存操作
git stash 暂存工作区的更改
git stash pop 弹出最近暂存的更改

```

## git commit 信息提交规范

```bash
feat 增加新功能
fix 修复问题/BUG
style 代码风格相关无影响运行结果的
perf 优化/性能提升
refactor 重构
revert 撤销修改
test 测试相关
docs 文档/注释
chore 依赖更新/脚手架配置修改等
workflow 工作流改进
ci 持续集成
types 类型定义文件更改
wip 开发中
```

## 提交 commit

```bash
git commit -m feat:Add workflow, homepage, etc.
```
