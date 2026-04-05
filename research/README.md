# 计算传播学研究执行包

本目录用于落地 P0-P6 阶段目标、Gate 验收和论文交付物。

## 目录说明
- `templates/`：阶段性交付物模板
- `boards/`：任务看板模板（待办/进行中/阻塞/完成）

## 推荐执行顺序
1. P0：运行基线案例并填写 `templates/P0_baseline_issue_list.md`
2. P1：完成研究设计、变量字典、案例元数据
3. P2：完成复现实验配置与接口契约，执行工程改造
4. P3：运行机制特征提取脚本，生成 `features/evidence_index`
5. P4：运行跨案例比较脚本，生成 `comparison_matrix`
6. P5：填充稳健性与理论映射结果
7. P6：根据投稿清单完成终稿封装

## 关键命令（P3/P4）
```bash
cd backend
uv run python scripts/generate_mechanism_features.py --simulation-id sim_xxx --refresh
uv run python scripts/compare_cases.py --simulation-ids sim_a sim_b sim_c sim_d --refresh
```

## Gate 最小检查建议
- P2 Gate：`simulation_config.json` 包含 `run_seed`、`llm_lock`、`case_tag`
- P3 Gate：生成 `analysis/features.json` 与 `analysis/evidence_index.json`
- P4 Gate：`compare_cases.py` 输出 `rows` 覆盖全部案例
