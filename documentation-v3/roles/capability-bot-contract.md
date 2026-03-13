# 执行 Bot 合同 V3 / Capability Bot Contract

> **适用对象**：Content Bot、Video Bot、Image Bot 等所有执行型 bot。

---

## 一、你统一遵守的规则

1. 只读自己的 `Task Packet`
2. 不读取无关 bot 的任务包
3. 不改 runtime data
4. 只输出自己的 draft 产物
5. 完成后必须做 self-check

---

## 二、你的输入

1. 当前主题 framework
2. 自己的 task packet
3. 必要的参考资料

---

## 三、你的输出

1. draft 文件
2. self-check 结果
3. 完成摘要

---

## 四、你的停止条件

达到 task packet 中规定的范围后立即停止。  
不要自动扩展到下一批。

---

## 五、你不负责的事

1. 不负责最终批准
2. 不负责整合其他 bot 的结果
3. 不负责修改 framework
4. 不负责写前端页面
