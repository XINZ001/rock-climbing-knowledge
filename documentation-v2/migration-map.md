# 旧文档到 V2 的迁移映射 / Migration Map

> **目的**：帮助你理解旧体系里的哪些文件，在 v2 中会被保留、合并或降级。

---

## 一、Team Lead 层

| 当前文档 | v2 去向 | 说明 |
|---------|--------|------|
| `team-lead/general-director-guide.md` | `roles/team-lead-guide.md` | 保留角色，但改成以 task packet 为中心 |
| `team-lead/project-state.md` | 保留 | 继续作为状态真源 |
| `team-lead/documentation-architect-guide.md` | `roles/documentation-architect-guide.md` | 继续保留，但放进 v2 体系 |
| `team-lead/content-integration-plan.md` | 部分拆到 `automation-strategy.md` 和 `roles/frontend-integration-guide.md` | 原文过大、计划和执行混写 |

---

## 二、Framework 层

| 当前文档 | v2 去向 | 说明 |
|---------|--------|------|
| `team-lead/climbing-knowledge-framework.md` | `frameworks/knowledge-base-framework.md` | 重写为更清晰的内容模型文档 |
| `team-lead/training-framework.md` | `frameworks/training-manual-framework.md` | 保留主题，但去掉执行细节 |
| `team-lead/athlete-framework.md` | `frameworks/hall-of-fame-framework.md` | 向“名人堂”方向泛化 |

---

## 三、执行层

| 当前文档 | v2 去向 | 说明 |
|---------|--------|------|
| `article-researcher/article-research-guide.md` | `roles/content-researcher-guide.md` | 文章、训练、人物研究统一成“内容研究能力” |
| `training-researcher/training-research-guide.md` | `roles/content-researcher-guide.md` + `frameworks/training-manual-framework.md` | 主题差异由 framework 承担 |
| `athlete-researcher/athlete-research-guide.md` | `roles/content-researcher-guide.md` + `frameworks/hall-of-fame-framework.md` | 同上 |
| `video-researcher/video-research-guide.md` | `roles/video-researcher-guide.md` | 保留能力，但去掉主题耦合 |
| `illustrator/image-generation-guide.md` | `roles/image-production-guide.md` | 生成和修复统一成一个能力 |
| `photo-regenerator/image-regeneration-guide.md` | `roles/image-production-guide.md` | 同上 |
| `fact-checker/fact-checker-guide.md` | `roles/fact-checker-guide.md` | 继续保留 |
| `frontend-engineer/video-integration-guide.md` | `roles/frontend-integration-guide.md` | 变成通用整合能力 |

---

## 四、为什么不做一比一复制

因为一比一复制只能得到：

- 旧结构
- 新目录

不会真正解决“bot 复用”和“任务标准化”的问题。

v2 的重点是：

1. 主题和能力分层
2. Team Lead 改成发 task packet
3. 执行 bot 改成能力复用
4. draft 和 runtime 分离
