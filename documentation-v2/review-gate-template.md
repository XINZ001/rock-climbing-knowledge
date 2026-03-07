# Review Gate 模板 / Review Gate Template

```md
# Review Gate

## 1. 本轮任务

{task name}

## 2. 审核对象

- {draft registry}
- {report}
- {asset batch}

## 3. 审核结论

- [ ] 通过
- [ ] 部分通过
- [ ] 退回修改

## 4. 通过范围

{哪些内容可进入整合层}

## 5. 退回范围

{哪些内容需要返工}

## 6. 主要问题

1. {问题 1}
2. {问题 2}
3. {问题 3}

## 7. 下一步动作

- [ ] 交给 Frontend Integrator
- [ ] 交还原执行 bot 返工
- [ ] 进入下一批
```

---

## 作用

这个模板的价值是把“人工审核”文件化。  
这样后续 bot 不需要从聊天上下文猜测到底哪些内容已经批准。
