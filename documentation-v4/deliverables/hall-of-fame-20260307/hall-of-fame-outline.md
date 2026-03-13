# Architect Outline

## 1. 对应 Plan

`hall-of-fame-plan.md`

## 2. 本轮总体执行思路

本轮优先跑通名人堂最小闭环，而不是扩到完整人物谱系。

执行顺序：

1. 先确定首批人物池与分类覆盖
2. 再把人物内容压成统一 registry 结构
3. 最后用独立页面与导航入口完成前端接入

## 3. 内容组整体搜索方向

### 内容方向

优先搜集以下维度：

1. 生平与代表成就
2. 训练哲学或比赛方法
3. 标志性风格或公开表达
4. 来源链接

### 视频方向

本轮不执行。

### 图片方向

本轮不执行，改用无版权风险的视觉卡片布局承接。

## 4. 各 bot 的边界

### Content Bot

负责人物卡文字内容与来源链接，不负责路由和样式。

### Video Bot

本轮不调用。

### Image Bot

本轮不调用。

## 5. 输出格式要求

### Content Draft

至少包含：

- athlete 基础信息
- 3 张卡片
- key facts
- related KP
- sources

### Frontend Integration

至少包含：

- `/hall-of-fame` 列表页
- `/hall-of-fame/:athleteSlug` 详情页
- 首页与侧边栏入口

## 6. 停止条件

当首批人物可浏览、build 通过、数据结构可继续扩批时停止，不继续自动新增第二批人物。

## 7. 任务文件列表

- `rock-climbing-knowledge/src/data/athlete-registry.json`
- `rock-climbing-knowledge/src/pages/HallOfFamePage.jsx`
- `rock-climbing-knowledge/src/pages/AthletePage.jsx`

## 8. 汇总交接方式

统一以 registry + 路由页面 + 验证结果组成集成稿，再进入 final review gate。
