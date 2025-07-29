# GitHub Pages 部署指南

本文档提供解决 GitHub Pages 部署问题的详细步骤。

## 常见问题与解决方案

### 错误：Get Pages site failed

错误信息：
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions, or consider exploring the `enablement` parameter for this action.
```

解决步骤：

1. **确保在GitHub仓库中正确配置Pages**：
   - 进入您的仓库页面
   - 点击 "Settings" 标签
   - 在左侧菜单找到 "Pages"
   - 在 "Build and deployment" 部分:
     - Source: 选择 "GitHub Actions"

2. **添加enablement参数到工作流文件**：
   - 在 `.github/workflows/deploy.yml` 中
   - 修改 `actions/configure-pages` 步骤，添加 `enablement: true` 参数:
   ```yaml
   - name: Setup Pages
     uses: actions/configure-pages@v4
     with:
       enablement: true
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

## 手动触发部署

您可以通过以下步骤手动触发部署：

1. 在GitHub仓库页面，点击 "Actions" 标签
2. 从左侧菜单选择您的部署工作流（例如 "Deploy to GitHub Pages"）
3. 点击 "Run workflow" 按钮
4. 选择要部署的分支（通常是 `master` 或 `main`）
5. 点击 "Run workflow" 绿色按钮
6. 等待工作流完成

## 检查部署状态

1. 在GitHub仓库页面，点击 "Actions" 标签
2. 查看最新的工作流运行记录
3. 如果成功，您应该能看到一个绿色的勾号
4. 在工作流详情中，您可以找到部署的URL

## 故障排除

如果仍然遇到问题，请尝试以下步骤：

1. **查看详细日志**：点击工作流运行记录中的具体步骤，查看详细日志

2. **检查仓库设置**：
   - 确保仓库是公开的，或者您有合适的GitHub计划允许私有仓库使用Pages
   - 确保GitHub Pages功能已在仓库设置中启用

3. **检查分支保护**：
   - 如果启用了分支保护，确保GitHub Actions有权限推送到部署分支

4. **手动创建gh-pages分支**：
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   touch index.html
   echo "Placeholder" > index.html
   git add index.html
   git commit -m "Initial gh-pages commit"
   git push origin gh-pages
   ```

5. **等待缓存刷新**：
   - 有时GitHub Pages需要几分钟才能反映最新的变更

6. **检查域名设置**：
   - 如果配置了自定义域名，确保DNS记录正确设置
