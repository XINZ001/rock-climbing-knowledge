# 攀岩知识库项目 — 全局规则

> 本文件对所有 Claude Code 会话自动生效。

## 项目结构：按角色划分文件夹

```
rock-climbing/
├── team-lead/               ← Team Lead（规划、知识体系、内容整合）
│   ├── project-state.md
│   ├── documentation-architect-guide.md
│   ├── general-director-guide.md
│   ├── climbing-knowledge-framework.md
│   └── content-integration-plan.md
├── frontend-engineer/       ← 前端工程师（前端规范 + 项目运维工具）
│   ├── file-organization-guide.md
│   ├── version-control-guide.md
│   ├── fuzzy-search-guide.md
│   └── create-snapshot.sh
├── video-researcher/        ← 视频调研员（搜索 YouTube / Bilibili 教学视频）
│   ├── video-research-guide.md
│   ├── video-research-results.md   ← 主表
│   ├── video-research-results/     ← 各轮次详细产出
│   └── reference/
├── article-researcher/      ← 文章调研员（搜索高质量攀岩文章）
│   ├── article-research-guide.md
│   ├── section-XX-articles.json / section-XX-report.md
│   ├── training-bible/
│   └── reference/japanese-sources/
├── prompt-engineer/         ← Prompt 工程师（拆分插图 Prompt）✅ 已完成
│   ├── prompt-restructuring-guide.md
│   ├── module-XX-*.md
│   └── reference/illustration-prompts.md
├── illustrator/             ← 插画师（生成线稿图）
│   └── image-generation-guide.md
├── photo-regenerator/       ← 图片再生成（参考真实图片重新生成错误插图）
│   └── image-regeneration-guide.md
├── training-researcher/     ← 训练方案调研员（搜集训练协议，支柱二）
│   ├── training-research-guide.md
│   └── category-11X-report.md
├── athlete-researcher/      ← 运动员调研员（搜集运动员资料，支柱三）
│   ├── athlete-research-guide.md
│   └── category-12X-report.md
├── fact-checker/            ← 内容纠错员（核实用户反馈的知识点错误）
│   └── fact-checker-guide.md
├── archive/                 ← 已归档内容
│   └── video-analyst/       ← 视频分析师 Guide（暂归档，视频数据就绪后启用）
│       └── video-tagging-guide.md
├── rock-climbing-knowledge/ ← 前端应用代码（不动）
├── data-model/              ← 数据库 schema（不动）
└── content-snapshots/       ← 版本快照（不动）
```

每个角色文件夹 = Guide（指导文件）+ 产出 + reference/（参考资料）

## 文档治理真源

- 当前项目规模、目录真源、活跃角色：`team-lead/project-state.md`
- 文档体系维护规则：`team-lead/documentation-architect-guide.md`
- 如果某份 guide 中的数量、路径、当前状态与上述文件冲突，以这两份文件为准

## 产出归档位置

| 角色 | 产出存放位置 | 命名格式 |
|------|-------------|---------|
| 视频调研员 | `video-researcher/` | `video-research-*.md` |
| 视频分析师 | `rock-climbing-knowledge/src/data/` | `video-registry.json` |
| 文章调研员 | `article-researcher/` | `section-XX-articles.json` / `section-XX-report.md` |
| Prompt 工程师 | `prompt-engineer/` | `module-XX-*.md` |
| 插画师 | `rock-climbing-knowledge/public/images/illustrations/` | `{kp-id}.png` |
| 图片再生成 | 同上，替换原文件 | `{kp-id}.png` |
| 训练方案调研员 | `training-researcher/` | `category-11X-report.md` → 最终 `training-registry.json` |
| 运动员调研员 | `athlete-researcher/` | `category-12X-report.md` → 最终 `athlete-registry.json` |
| 内容纠错员 | `fact-checker/` | `fact-check-{kp-id}-{YYYYMMDD}.md` |

## 任务结束 Checklist（每次必做）

1. 产出文件是否在自己的角色文件夹中？
2. 文件名是否全小写、连字符分隔？
3. 临时文件是否已清理？
4. 新增 Guide 或参考文件是否放对了位置？
5. 根目录是否出现了不应存在的文件？→ 移入对应角色文件夹

## 命名规范

- 全小写 + 连字符：`video-research-guide.md` ✓
- 角色文件夹用职位英文名：`video-researcher/`、`illustrator/`
- Guide 后缀 `-guide.md`，Section 前缀 `section-XX-`，Module 前缀 `module-XX-`
- 不要在根目录创建 `.md` 或 `.json` 文件

## 不要动的目录

`rock-climbing-knowledge/`、`data-model/`、`content-snapshots/`、`.git/`、`.claude/`

## 详细规范

完整目录结构、迁移步骤参见 `frontend-engineer/file-organization-guide.md`。
