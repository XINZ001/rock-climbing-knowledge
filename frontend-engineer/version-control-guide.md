# 内容版本管理指南 / Content Version Control Guide

> **状态**：指令文件，尚未执行
> **背景**：即将进行一次大规模内容更新（将文章洞见融入知识点正文），会导致 10 个 section JSON 文件产生较大的文案变化。需要在更新前建立版本管理机制，确保旧版内容可追溯、可回滚。

---

## 一、现状诊断 / Current State

### 1.1 项目目录结构与版本控制现状

```
rock climbing/                          ← ❌ 没有版本控制
├── guides/article-research-guide.md
├── guides/video-research-guide.md
├── guides/image-generation-guide.md
├── article-research/                   ← ❌ 没有版本控制
├── split-prompts/                      ← ❌ 没有版本控制
├── video-research/video-research-results.md           ← ❌ 没有版本控制
│
└── rock-climbing-knowledge/            ← ✅ 有 Git（5 个 commit，推送到 GitHub）
    ├── src/data/
    │   ├── section-01-overview.json    ← 即将被大改的文件
    │   ├── section-02-physical.json
    │   ├── ...（共 10 个 section 文件）
    │   ├── kp-registry.json
    │   ├── videos.json
    │   └── illustration-registry.json
    └── src/components/...
```

### 1.2 关键发现

| 维度 | 状态 | 风险 |
|------|------|------|
| React 应用（`rock-climbing-knowledge/`） | ✅ Git + GitHub 远程 | 低——已有版本控制 |
| 指导文件、文章产出、Prompt 等（上层目录） | ❌ 无任何版本控制 | **高——丢了就没了** |
| 即将被改的 10 个 section JSON | 在 Git 管辖内 | 中——有 Git 但从未做过内容快照 |

### 1.3 需要保护的核心文件

即将被大改的文件（按重要性排序）：

| 文件 | 大小 | 说明 |
|------|------|------|
| `section-03-technique.json` | 113K | 最大，37 个知识点正文 |
| `section-02-physical.json` | 66K | 20 个知识点正文 |
| `section-07-injury.json` | 56K | 伤病知识 |
| `section-08-outdoor.json` | 55K | 户外实践 |
| `section-05-gear.json` | 55K | 装备知识 |
| `section-10-competition.json` | 52K | 竞技攀岩 |
| `section-06-safety.json` | 46K | 安全知识 |
| `section-09-special.json` | 42K | 特殊人群 |
| `section-04-mental.json` | 37K | 心理策略 |
| `section-01-overview.json` | 36K | 攀岩概览 |
| `kp-registry.json` | 186K | 知识点索引（结构可能变） |
| **合计** | **~750K** | 很小，任何方案都轻松存储 |

---

## 二、版本管理方案 / Versioning Strategy

### 双层保护：Git 语义化标签 + 本地快照归档

两层机制互补，确保万无一失：

```
第一层：Git 标签（轻量、专业、可回滚）
  → 每次大改前打一个 tag，永久记录在 Git 历史中
  → 回滚只需一条命令

第二层：本地快照文件夹（直观、可读、随时对比）
  → 把当前版本的 JSON 文件拷贝到一个带日期的文件夹里
  → 不懂 Git 的人也能直接打开旧文件看内容
```

---

## 三、第一层：Git 语义化标签 / Git Semantic Tags

### 3.1 标签命名规范

```
content-v{主版本}.{次版本}  +  简短说明
```

| 标签 | 含义 |
|------|------|
| `content-v1.0` | 初始完整版——文章融入之前的原始正文 |
| `content-v1.1` | Section 02 融入文章洞见后 |
| `content-v1.2` | Section 03 融入文章洞见后 |
| `content-v2.0` | 全部 10 个 Section 完成文章融入 |
| `content-v2.1` | 视频数据重构（videos.json 从 sub-section 改为 kp-id） |

### 3.2 执行步骤

**在大改之前**，进入 `rock-climbing-knowledge/` 目录执行：

```bash
cd rock-climbing-knowledge/

# 1. 确认当前没有未提交的改动
git status

# 2. 如果有改动，先提交
git add -A
git commit -m "Pre-update snapshot: save current content state before article integration"

# 3. 打标签（带注释的标签，记录更多信息）
git tag -a content-v1.0 -m "原始知识点正文（文章融入前）
- 177 个知识点，10 个 section 文件
- 所有正文为初始版本，未融入外部文章洞见
- 此标签用于保存大改前的基线版本"

# 4. 推送标签到 GitHub（远程备份）
git push origin content-v1.0
```

**每完成一个 Section 的内容融入后**：

```bash
# 提交改动
git add src/data/section-02-physical.json src/data/kp-registry.json
git commit -m "content(s02): integrate article insights into Physical Fitness section

- Added expertInsights to 18/20 KPs
- Added furtherReading links from 25 articles
- Updated kp-registry.json status fields"

# 打标签
git tag -a content-v1.1 -m "Section 02 身体素质：完成文章洞见融入"
git push origin content-v1.1
```

### 3.3 如何回滚

如果新版内容不满意，需要回到旧版：

```bash
# 查看某个标签时的文件内容（只看，不改）
git show content-v1.0:src/data/section-02-physical.json > /tmp/old-section-02.json

# 恢复单个文件到某个标签的版本
git checkout content-v1.0 -- src/data/section-02-physical.json

# 恢复所有 section 文件到某个标签的版本
git checkout content-v1.0 -- src/data/section-*.json src/data/kp-registry.json
```

### 3.4 如何对比新旧版本

```bash
# 对比当前版本与 v1.0 的差异
git diff content-v1.0 -- src/data/section-02-physical.json

# 查看某个文件在某个标签时的完整内容
git show content-v1.0:src/data/section-02-physical.json

# 统计改了多少行
git diff --stat content-v1.0
```

---

## 四、第二层：本地快照归档 / Local Snapshot Archive

### 4.1 为什么需要这一层

Git 标签虽然专业，但：
- 查看旧版内容需要 Git 命令，不够直观
- 如果想同时打开新旧两个 JSON 文件做逐行对比，Git 不方便
- 万一 Git 仓库出问题，还有独立备份

### 4.2 快照目录结构

在项目根目录下创建 `content-snapshots/` 文件夹：

```
rock climbing/
└── content-snapshots/
    ├── README.md                     ← 快照说明文件
    ├── v1.0_2026-03-03_原始正文/
    │   ├── _snapshot-info.json       ← 快照元信息
    │   ├── section-01-overview.json
    │   ├── section-02-physical.json
    │   ├── ...
    │   ├── section-10-competition.json
    │   └── kp-registry.json
    ├── v1.1_2026-03-XX_S02文章融入/
    │   ├── _snapshot-info.json
    │   └── section-02-physical.json   ← 只存被改的文件
    └── ...
```

### 4.3 快照元信息文件

每个快照文件夹中放一个 `_snapshot-info.json`：

```json
{
  "version": "content-v1.0",
  "date": "2026-03-03",
  "description": "原始知识点正文，文章融入前的基线版本",
  "scope": "全部 10 个 section + kp-registry",
  "trigger": "即将执行 guides/content-integration-plan.md 的 Phase 1",
  "files": [
    "section-01-overview.json",
    "section-02-physical.json",
    "section-03-technique.json",
    "section-04-mental.json",
    "section-05-gear.json",
    "section-06-safety.json",
    "section-07-injury.json",
    "section-08-outdoor.json",
    "section-09-special.json",
    "section-10-competition.json",
    "kp-registry.json"
  ],
  "totalSize": "~750KB",
  "gitTag": "content-v1.0",
  "notes": "这是第一个快照。后续快照只需存放被修改的文件。"
}
```

### 4.4 执行脚本

创建一个一键快照脚本 `create-snapshot.sh`，放在项目根目录：

```bash
#!/bin/bash
# 用法: ./create-snapshot.sh <版本号> <简短说明>
# 示例: ./create-snapshot.sh v1.0 "原始正文"

VERSION=$1
DESC=$2
DATE=$(date +%Y-%m-%d)
DIR_NAME="${VERSION}_${DATE}_${DESC}"
SNAPSHOT_DIR="content-snapshots/${DIR_NAME}"
DATA_DIR="rock-climbing-knowledge/src/data"

# 创建快照目录
mkdir -p "$SNAPSHOT_DIR"

# 复制所有 section 文件和关键索引
cp "$DATA_DIR"/section-*.json "$SNAPSHOT_DIR/"
cp "$DATA_DIR/kp-registry.json" "$SNAPSHOT_DIR/"
cp "$DATA_DIR/videos.json" "$SNAPSHOT_DIR/"

# 生成元信息
cat > "$SNAPSHOT_DIR/_snapshot-info.json" << EOF
{
  "version": "content-${VERSION}",
  "date": "${DATE}",
  "description": "${DESC}",
  "scope": "all section files + kp-registry + videos",
  "gitTag": "content-${VERSION}",
  "createdBy": "create-snapshot.sh"
}
EOF

echo "✅ 快照已创建: ${SNAPSHOT_DIR}"
echo "   包含 $(ls "$SNAPSHOT_DIR"/*.json | wc -l | tr -d ' ') 个文件"
echo "   总大小: $(du -sh "$SNAPSHOT_DIR" | cut -f1)"
```

### 4.5 快照目录的 .gitignore

`content-snapshots/` 不需要纳入 Git（它本身就是 Git 的补充备份）。在上层目录如果未来也初始化 Git，应将其排除：

```
# .gitignore
content-snapshots/
```

---

## 五、上层目录的版本管理 / Parent Directory Git Setup

### 5.1 问题

当前项目上层目录（`rock climbing/`）完全没有版本控制。以下文件一旦误删或误改就不可恢复：

```
❌ 无版本控制的重要文件：
├── guides/article-research-guide.md        ← 你写的指导文件
├── guides/video-research-guide.md
├── guides/image-generation-guide.md
├── guides/content-integration-plan.md
├── guides/fuzzy-search-guide.md
├── guides/general-director-guide.md
├── article-research/*.json           ← Bot 产出
├── split-prompts/*.md                ← 288 条 Prompt
├── video-research/video-research-results.md
└── reference/illustration-prompts.md      ← 12 万字的原始 Prompt
```

### 5.2 建议：在上层目录初始化 Git

```bash
cd "/Users/xinz/Documents/skill library/rock climbing"

# 初始化
git init

# 创建 .gitignore（排除不需要的大文件）
cat > .gitignore << 'EOF'
# Node.js
node_modules/
.DS_Store

# 内嵌的 React 应用已有自己的 Git（作为子目录自动被追踪）
# 如果不想让内层 Git 和外层冲突，可以用 submodule，
# 但最简单的方式是让外层 Git 直接管理所有文件。

# Gemini AI 的临时产物（大文件）
Gemini AI/node_modules/
Gemini AI/venv/
Gemini AI/*.vtt

# 快照目录（已经是备份，不需要再备份进 Git）
content-snapshots/

# 数据库文件
*.db
EOF

# 添加所有文件
git add -A

# 首次提交
git commit -m "Initial commit: full project with guides, article research, prompts, and knowledge base"

# 打基线标签
git tag -a project-v1.0 -m "项目完整基线：所有指导文件 + Bot 产出 + 知识库数据"
```

### 5.3 关于内层 Git 与外层 Git 的关系

`rock-climbing-knowledge/` 目录已有自己的 Git 仓库。当外层也初始化 Git 后，有两种处理方式：

**方案 A（推荐）：移除内层 Git，统一由外层管理**

```bash
# 移除内层的 .git 目录，让外层 Git 统一管理所有文件
# 注意：这会丢失内层的 Git 历史，执行前确保已推送到 GitHub
rm -rf rock-climbing-knowledge/.git
```

优点：一套 Git 管理所有文件，简单清晰
缺点：内层的 5 个历史 commit 只保留在 GitHub 上

**方案 B：保留内层 Git，外层忽略它**

```bash
# 在外层 .gitignore 中添加
echo "rock-climbing-knowledge/" >> .gitignore
```

优点：两套 Git 互不干扰
缺点：外层 Git 不追踪知识库数据文件，保护不完整

**推荐方案 A**，统一管理更省心。内层的历史已经在 GitHub 有备份。

---

## 六、版本管理流程总结 / Complete Workflow

### 每次大改前的标准操作

```
┌────────────────────────────────────────────────┐
│  第 0 步：确认当前状态干净                        │
│  git status → 无未提交改动                       │
│                                                  │
│  第 1 步：创建本地快照                            │
│  ./create-snapshot.sh v1.0 "原始正文"             │
│                                                  │
│  第 2 步：Git 提交 + 打标签                       │
│  git add -A                                      │
│  git commit -m "snapshot: pre-update baseline"   │
│  git tag -a content-v1.0 -m "原始正文基线"        │
│                                                  │
│  第 3 步：推送到远程（如果有）                     │
│  git push && git push --tags                     │
│                                                  │
│  ✅ 安全了，可以开始改内容                         │
└────────────────────────────────────────────────┘
```

### 每完成一个 Section 内容融入后

```
┌────────────────────────────────────────────────┐
│  第 1 步：提交改动                               │
│  git add src/data/section-02-physical.json       │
│  git commit -m "content(s02): ..."               │
│                                                  │
│  第 2 步：打标签                                  │
│  git tag -a content-v1.1 -m "S02 完成"           │
│                                                  │
│  第 3 步（可选）：本地快照                         │
│  只需存被改的文件即可                              │
│  ./create-snapshot.sh v1.1 "S02文章融入"          │
└────────────────────────────────────────────────┘
```

### 如果需要回滚

```
┌────────────────────────────────────────────────┐
│  方式 1：Git 回滚单个文件                         │
│  git checkout content-v1.0 -- src/data/xxx.json  │
│                                                  │
│  方式 2：从本地快照复制                           │
│  cp content-snapshots/v1.0_.../xxx.json          │
│     rock-climbing-knowledge/src/data/xxx.json    │
│                                                  │
│  方式 3：Git 回滚整个项目到某个版本               │
│  git checkout content-v1.0                       │
│  （进入 detached HEAD 状态查看旧版本）             │
│  git checkout main  （回到最新版本）              │
└────────────────────────────────────────────────┘
```

---

## 七、立即执行清单 / Immediate Action Checklist

在开始内容大改**之前**，必须完成以下所有步骤：

```
□ 1. 在上层目录初始化 Git（见 §5.2）
□ 2. 创建 .gitignore（见 §5.2）
□ 3. 首次 git add + commit + tag
□ 4. 创建 content-snapshots/ 目录
□ 5. 创建 create-snapshot.sh 脚本（见 §4.4），chmod +x
□ 6. 运行 ./create-snapshot.sh v1.0 "原始正文"
□ 7. 确认快照文件夹内文件完整（11 个 JSON）
□ 8. 确认 git tag 存在：git tag -l
□ 9. （可选）推送到 GitHub 远程仓库备份
```

**以上步骤全部完成后，才可以开始内容融入工作。**

---

## 八、版本标签路线图 / Tag Roadmap

| 标签 | 时间点 | 内容 |
|------|--------|------|
| `content-v1.0` | 大改前 | 原始正文基线（177 个 KP 的初始文案） |
| `content-v1.1` | S02 完成 | Section 02 身体素质融入文章洞见 |
| `content-v1.2` | S03 完成 | Section 03 攀爬技术融入文章洞见 |
| `content-v1.3` ~ `v1.9` | S04~S10 | 逐个 Section 完成 |
| `content-v2.0` | 全部完成 | 全部 10 个 Section 完成文章融入 |
| `content-v2.1` | 视频重构 | videos.json 从 sub-section 改为 kp-id 映射 |
| `content-v2.2` | 搜索增强 | 加入 search-synonyms.json |
| `content-v3.0` | 下一轮大改 | 未来预留 |

---

*本文件为指令文档，交给执行 bot 按步骤操作即可。*
