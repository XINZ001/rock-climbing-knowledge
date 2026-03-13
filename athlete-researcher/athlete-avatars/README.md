# 运动员头像 / Athlete Avatars

本文件夹存放名人堂运动员头像，供后续接入 `hall-of-fame-media` 或前端展示使用。

- **来源**：脚本自动抓取 Wikipedia 缩略图、Wikimedia Commons 搜索，以及「下载失败」时对原图 URL 重试；不足部分可通过 [athlete-avatar-overrides.json](../athlete-avatar-overrides.json) 填入从 **Google 图片 / IFSC / 官方** 等渠道找到的图片 URL（格式：`"athleteId": "https://..."`），再重新运行脚本。
- **命名**：`{athleteId}.jpg`（或 .png/.webp），与 `athlete-registry.json` 的 `athleteId` 一致。
- **结果清单**：每人的 URL、来源与状态见 [athlete-avatar-results.json](../athlete-avatar-results.json)。当前约 74/76 人已有头像，仍缺的可按 [athlete-avatar-search-guide.md](../athlete-avatar-search-guide.md) 搜索后写入 overrides 或 results。
- **脚本**：`node athlete-researcher/scripts/fetch-avatars.mjs`（从仓库根目录执行）。
- **版权**：上线前请核对各图版权与本站使用场景是否合规。
- **同一人多条目**：部分运动员在不同分类下有多条条目（不同 athleteId），例如 Royal Robbins 同时出现在「大岩壁」与「传奇」、Alex Honnold 出现在「大岩壁」与「自由独攀」等。这些条目会**共用同一张头像**（同一张图可能以不同文件名存在，如 ath-138.jpg 与 ath-154.jpg 均为 Royal Robbins），属预期行为，并非错用他人照片。
