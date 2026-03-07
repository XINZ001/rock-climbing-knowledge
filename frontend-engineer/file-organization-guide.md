# 文件整理指南 / File Organization Guide

> **核心思路**：按职位（角色）划分文件夹。每个角色的文件夹是自包含的工作区，内含指导文件（Guide）、产出文件、参考资料（Reference）。打开一个文件夹就能看到该角色的一切。

---

## 一、角色与文件夹对照 / Roles & Folders

| 角色 | 职位 | 文件夹 | 职责概述 |
|------|------|--------|---------|
| 总负责人 | Team Lead | `team-lead/` | 知识体系、内容整合规划、质量把控 |
| — | 前端工程师 | `frontend-engineer/` | 前端应用规范 + 项目运维工具（本文件所在位置） |
| Bot 1 | 视频调研员 | `video-researcher/` | YouTube / Bilibili 教学视频搜索与筛选 |
| Bot 2 | 视频分析师 | `archive/video-analyst/` | ⏸ 暂归档，视频数据充足后启用 |
| Bot 3 | 文章调研员 | `article-researcher/` | 高质量攀岩文章搜索、评分、映射知识点 |
| Bot 4 | Prompt 工程师 | `prompt-engineer/` | 插图 Prompt 拆分与优化（✅ 已完成） |
| Bot 5 | 插画师 | `illustrator/` | 按 Prompt 生成 1024×1024 线稿图 |
| Bot 6 | 图片再生成 | `photo-regenerator/` | 参考真实图片重新生成内容错误的插图 |

---

## 二、当前目录结构 / Current Directory Structure

```
rock-climbing/
├── CLAUDE.md                              ← 全局规则（自动加载）
├── .gitignore
│
├── team-lead/                             ← Team Lead
│   ├── project-state.md                    ← 当前项目状态真源
│   ├── documentation-architect-guide.md    ← 文档架构负责人指南
│   ├── general-director-guide.md           ← 总负责人工作手册
│   ├── climbing-knowledge-framework.md     ← 知识体系总纲
│   └── content-integration-plan.md         ← 内容整合规划
│
├── frontend-engineer/                     ← 前端工程师（规范 + 运维工具）
│   ├── file-organization-guide.md          ← 本文件
│   ├── version-control-guide.md            ← 版本管理规范
│   ├── fuzzy-search-guide.md               ← 模糊搜索方案
│   └── create-snapshot.sh                  ← 快照脚本
│
├── video-researcher/                      ← 视频调研员
│   ├── video-research-guide.md             ← 指导文件
│   ├── video-research-results.md           ← 产出：搜索主表
│   ├── video-research-results/             ← 产出：各轮次详细数据
│   │   ├── video-research-index.md
│   │   ├── video-research-round3.md
│   │   ├── video-research-round4.md
│   │   ├── video-research-round5.md
│   │   ├── video-research-round6.md
│   │   ├── video-research-s02-physical.md
│   │   ├── video-research-s03-technique.md
│   │   ├── video-research-s06-safety.md
│   │   └── video-research-supplements.md
│   └── reference/                          ← 参考资料
│       ├── famous-climbing-creators-table.md
│       ├── influencer-video-master-table.md
│       ├── channel-video-research-table.md
│       └── video-resources.md
│
├── article-researcher/                    ← 文章调研员
│   ├── article-research-guide.md           ← 指导文件
│   ├── section-01-articles.json            ← 产出（section-01 ~ section-10）
│   ├── section-01-report.md
│   ├── ...                                 （共 20 个 section 文件）
│   ├── training-bible/                     ← 产出子目录
│   │   ├── README.md
│   │   └── phase-XX-*.md
│   └── reference/                          ← 参考资料
│       └── japanese-sources/
│           ├── articles.json
│           └── report.md
│
├── prompt-engineer/                       ← Prompt 工程师 ✅ 已完成
│   ├── prompt-restructuring-guide.md       ← 指导文件
│   ├── module-01-overview.md               ← 产出（共 11 个 module 文件）
│   ├── module-02-fitness.md
│   ├── module-03a-technique.md
│   ├── module-03b-technique.md
│   ├── module-04-psychology.md
│   ├── module-05-equipment.md
│   ├── module-06-safety.md
│   ├── module-07-injury.md
│   ├── module-08-outdoor.md
│   ├── module-09-special-groups.md
│   ├── module-10-competition.md
│   └── reference/                          ← 参考资料
│       └── illustration-prompts.md          （原始未拆分 Prompt）
│
├── illustrator/                           ← 插画师
│   └── image-generation-guide.md           ← 指导文件
│   # 产出位置：rock-climbing-knowledge/public/images/illustrations/{kp-id}.png
│
├── photo-regenerator/                     ← 图片再生成
│   └── image-regeneration-guide.md         ← 指导文件
│   # 产出位置：替换 illustrations/ 中的图片
│
├── archive/                               ← 归档区
│   └── video-analyst/                      ← 视频分析师（暂归档）
│       └── video-tagging-guide.md
│
├── rock-climbing-knowledge/               ← 前端应用代码（不动）
├── data-model/                            ← 数据库 schema（不动）
└── content-snapshots/                     ← 版本快照（不动）
```

---

## 三、每个角色文件夹的标准结构

```
{role}/
├── *-guide.md               ← 指导文件（由 Team Lead 编写）
├── *.json / *.md            ← 产出文件（该角色的工作成果）
└── reference/               ← 参考资料（只读，不修改）
```

**特殊情况**：
- 视频分析师、插画师、图片再生成的产出直接写入 `rock-climbing-knowledge/`，因为前端需要直接使用。它们的文件夹只包含 Guide。
- `frontend-engineer/` 存放前端规范与运维工具（如快照脚本），`rock-climbing-knowledge/` 是实际代码仓库，两者分开。
- `video-researcher/video-research-results/` 子文件夹存放各轮次详细产出，`video-research-results.md` 为汇总主表。

---

## 四、命名规范

| 规则 | 示例 |
|------|------|
| 文件名全小写，连字符分隔 | `video-research-guide.md` |
| 角色文件夹用职位英文名 | `video-researcher/`、`illustrator/` |
| Guide 统一后缀 `-guide.md` | `article-research-guide.md` |
| Section 文件用 `section-XX-` | `section-03-articles.json` |
| Module 文件用 `module-XX-` | `module-05-equipment.md` |

---

## 五、不要动的目录

| 目录 | 原因 |
|------|------|
| `rock-climbing-knowledge/` | 前端应用代码，有构建系统 |
| `data-model/` | 数据库 schema，结构固定 |
| `content-snapshots/` | 版本快照，只增不改 |
| `.git/` `.claude/` | 系统目录 |

---

*最后更新：2026-03-04*
