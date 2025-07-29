# GitHub Pages 部署指南

本文档提供解决 GitHub Pages 部署问题的详细步骤。

## 手动设置GitHub Pages（推荐）

在使用GitHub Actions自动部署之前，强烈建议先手动启用GitHub Pages：

### 步骤1: 启用GitHub Pages

1. 登录GitHub，进入您的仓库页面
2. 点击顶部的"Settings"（设置）选项卡
3. 在左侧边栏中，滚动到"Code and automation"部分并点击"Pages"
4. 在"Build and deployment"部分：
   - Source: 选择"GitHub Actions"（而不是特定分支）
5. 点击"Save"按钮

### 步骤2: 手动创建gh-pages分支（可选但推荐）

初始化一个基础的gh-pages分支有助于解决首次部署问题：

```bash
# 创建空白分支，不继承任何历史
git checkout --orphan gh-pages

# 清空工作目录
git rm -rf .

# 创建基础索引文件
echo "# GitHub Pages for RSJF Demo" > index.html

# 添加并提交
git add index.html
git commit -m "Initial GitHub Pages setup"

# 推送到远程
git push origin gh-pages

# 返回主分支
git checkout master
```

## 常见问题与解决方案

### 错误：Get Pages site failed / Create Pages site failed

错误信息：
```
Warning: Get Pages site failed
Error: Create Pages site failed
Error: HttpError: Resource not accessible by integration
```

这通常表示GitHub Actions没有足够的权限来创建和配置GitHub Pages。

解决步骤：

1. **手动启用GitHub Pages**（最重要步骤）：
   - 进入您的仓库页面
   - 点击 "Settings" 标签
   - 在左侧菜单找到 "Pages"
   - 在 "Build and deployment" 部分:
     - Source: 选择 "GitHub Actions"
   - 点击 "Save" 按钮

2. **修改工作流权限**：
   ```yaml
   permissions:
     contents: write   # 从read改为write
     pages: write
     id-token: write
     deployments: write  # 添加这一行
   ```

3. **使用备选部署方法**：
   添加JamesIves/github-pages-deploy-action作为备用部署方式：
   ```yaml
   - name: 部署到GitHub Pages (备选方法)
     uses: JamesIves/github-pages-deploy-action@v4
     with:
       folder: dist
       branch: gh-pages
       clean: true
   ```

3. **确保仓库名称正确**：
   - 在 `vite.config.js` 中，确保 `base` 路径与您的仓库名匹配:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/rsjf-demo/' : '/',
   ```

4. **检查分支名称**：
   - 确保工作流监听的分支是您实际使用的分支（`main` 或 `master`）
   - 工作流配置应该包含:
   ```yaml
   on:
     push:
       branches: [ "master" ]  # 或 "main"，取决于您的默认分支
   ```

5. **验证仓库权限**：
   - 确保工作流文件中包含正确的权限：
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

## 使用两种部署方法

本工作流程现在包含两种部署方法，以提高成功率：

### 方法1：GitHub Actions Pages部署
使用官方actions/deploy-pages动作部署。这是默认方法，但需要GitHub Pages已正确配置。

### 方法2：JamesIves/github-pages-deploy-action
作为备用方法，此动作会直接将构建产物推送到gh-pages分支。即使官方方法失败，这种方法也通常能成功。

## 手动触发部署

您可以通过以下步骤手动触发部署：

1. 在GitHub仓库页面，点击 "Actions" 标签
2. 从左侧菜单选择"Deploy to GitHub Pages"工作流
3. 点击 "Run workflow" 按钮
4. 在弹出的对话框中：
   - 选择要部署的分支（通常是 `master` 或 `main`）
   - 可以选择"强制部署"选项来忽略缓存
5. 点击 "Run workflow" 绿色按钮
6. 等待工作流完成

## 检查部署状态

1. 在GitHub仓库页面，点击 "Actions" 标签
2. 查看最新的工作流运行记录
3. 如果成功，您应该能看到一个绿色的勾号
4. 在工作流详情中，您可以找到部署的URL

## 查看部署结果

GitHub Pages部署成功后：

1. 访问 `https://sunjuzhong.github.io/rsjf-demo/` 查看您的网站
2. 第一次部署后，可能需要等待5-10分钟才能访问

## 常见权限问题解决方法

### 如果您有仓库管理员权限

1. 进入仓库的 "Settings" → "Actions" → "General"
2. 在 "Workflow permissions" 部分：
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
3. 点击 "Save" 按钮

### 如果您遇到GITHUB_TOKEN权限问题

在个人设置中检查并更新令牌权限：

1. 点击您的头像 → "Settings" → "Developer settings" → "Personal access tokens"
2. 创建一个新的令牌，包含以下权限：
   - `repo` (全部权限)
   - `workflow`
   - `admin:org`
   - `admin:repo_hook`
   - `write:packages`

## 故障排除

如果仍然遇到问题，请尝试以下步骤：

1. **查看详细日志**：点击工作流运行记录中的具体步骤，查看详细日志

2. **检查仓库设置**：
   - 确保仓库是公开的，或者您有合适的GitHub计划允许私有仓库使用Pages
   - 确保GitHub Pages功能已在仓库设置中启用

3. **检查分支保护**：
   - 如果启用了分支保护，确保GitHub Actions有权限推送到部署分支

4. **尝试两步法部署**：
   - 先手动创建和推送一个gh-pages分支（如前文所述）
   - 然后从Actions运行部署工作流

5. **尝试单独部署方法**：
   - 如果官方方法失败，可以创建一个只使用`JamesIves/github-pages-deploy-action`的简化工作流：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ "master", "main" ]
     workflow_dispatch:

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             
         - name: Install and Build
           run: |
             npm ci
             npm run build
             
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
             branch: gh-pages
   ```

6. **等待缓存刷新**：
   - GitHub Pages部署后，可能需要5-10分钟才能访问

7. **检查域名设置**：
   - 如果配置了自定义域名，确保DNS记录正确设置
   
8. **检查仓库可见性**：
   - 对于免费账户，GitHub Pages只能用于公开仓库
   - 如果是私有仓库，需要GitHub Pro或更高级别的账户
