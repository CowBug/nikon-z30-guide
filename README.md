# 尼康 Nikon Z30 双镜头摄影实战终极宝典

- **线上访问地址**：[https://nikon-z30-guide.pages.dev](https://nikon-z30-guide.pages.dev)
- **托管平台**：Cloudflare Pages (`nikon-z30-guide`)
- **当前收录**：8 大分类，53 讲全集（已成功更新并上线第 53 讲）

---

## 自动化更新方案

### 方式一：直接粘贴 Web 端 Gemini 内容（半自动，推荐日常使用）
每天早上 09:00 Web 端 Gemini 吐出新的技巧文本后：
1. 新建或保存为 `today_tip.txt`（包含标题、焦段参数、操作步骤等）。
2. 在本项目目录下运行：
   ```bash
   node sync_tip.mjs --file today_tip.txt
   ```
3. 脚本会自动解析格式、递增编号（#54、#55...）、插入对应专题分类与侧边栏，并自动秒级部署上线！

---

### 方式二：100% 全自动云端定时更新（无需开机、无需手动操作）
如果你希望每天早上 09:00 完全不需要复制粘贴，实现真正 0 人工干预：
1. 将当前项目上传至 GitHub 私有/公开仓库。
2. 在仓库中配置 GitHub Actions（配置 `GEMINI_API_KEY` 与 Cloudflare 部署凭证）。
3. 每天 09:00 自动触发定时任务 -> 调用 Gemini API 生成符合模板规范的摄影技巧 -> 自动提交并发布到 Cloudflare Pages。
