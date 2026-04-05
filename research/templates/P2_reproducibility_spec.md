# P2 复现配置规范（模板）

## 配置锁定
- `run_seed`：
- `llm_lock.model`：
- `llm_lock.temperature`：
- `llm_lock.top_p`：
- `max_rounds`：
- `case_tag`：

## 运行清单（run_manifest）检查
- [ ] `run_manifest.json` 已生成
- [ ] `config_sha256` 已记录
- [ ] 实际执行参数与规范一致

## 重复实验检查（同配置同seed）
| 运行次序 | 核心指标摘要 | 与首轮偏差 | 是否通过（<=5%） |
|---|---|---|---|
| Run1 |  |  |  |
| Run2 |  |  |  |
| Run3 |  |  |  |
