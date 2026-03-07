# Integration Handoff 模板 / Integration Handoff Template

```md
# Integration Handoff

## 1. 来源任务

{task name}

## 2. 已通过审核的输入

- {draft registry path}
- {review gate path}

## 3. 本次整合目标

{写入哪些 runtime 文件 / 接入哪些页面}

## 4. 不要做的事

- 不要修改未通过审核的内容
- 不要补写缺失结论
- 不要重写 framework

## 5. 输出

- {runtime registry path}
- {component / page path}
- {integration report path}

## 6. 特殊映射规则

{字段映射、排序规则、回退策略}
```

---

## 作用

这个模板把“从 draft 到 runtime”的边界写清楚，避免整合 bot 越权补脑。
