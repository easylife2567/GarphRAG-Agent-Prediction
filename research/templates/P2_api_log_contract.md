# P2 接口契约与日志规范（模板）

## 接口契约

### 1) 机制特征接口
- 路径：`POST /api/analysis/features`
- 请求：
```json
{"simulation_id":"sim_xxx","refresh":false}
```
- 响应关键字段：`features.metrics_summary`、`features.per_round`

### 2) 证据索引接口
- 路径：`POST /api/analysis/evidence`
- 请求：
```json
{"simulation_id":"sim_xxx","metric":"turning_point_index","limit":50}
```
- 响应关键字段：`entries[].evidence_id`、`entries[].action_type`

### 3) 跨案例比较接口
- 路径：`POST /api/analysis/compare`
- 请求：
```json
{"simulation_ids":["sim_a","sim_b"],"refresh":false}
```
- 响应关键字段：`rows`、`cross_case_patterns`

## 日志规范
- 动作日志：`twitter/actions.jsonl`、`reddit/actions.jsonl`
- 运行清单：`run_manifest.json`
- 分析产物：`analysis/features.json`、`analysis/evidence_index.json`
