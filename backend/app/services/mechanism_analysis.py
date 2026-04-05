"""
传播机制分析服务

提供三类核心能力：
1. 单案例机制特征提取（features）
2. 证据索引生成（evidence_index）
3. 多案例比较矩阵（comparison_matrix）
"""

import json
import math
import os
from collections import Counter, defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from ..config import Config
from ..utils.logger import get_logger
from .simulation_runner import AgentAction, SimulationRunner

logger = get_logger("mirofish.mechanism_analysis")


class MechanismAnalysisService:
    """传播机制分析服务"""

    METRICS = [
        "turning_point_index",
        "frame_migration_index",
        "mediation_amplification_index",
        "path_divergence_index",
    ]

    INTERACTION_ACTIONS = {
        "LIKE_POST",
        "DISLIKE_POST",
        "REPOST",
        "QUOTE_POST",
        "LIKE_COMMENT",
        "DISLIKE_COMMENT",
        "FOLLOW",
        "MUTE",
    }
    CREATION_ACTIONS = {"CREATE_POST", "CREATE_COMMENT"}
    SIGNAL_ACTION_PRIORITY = {
        "REPOST": 5,
        "QUOTE_POST": 5,
        "CREATE_POST": 4,
        "CREATE_COMMENT": 4,
        "LIKE_POST": 3,
        "LIKE_COMMENT": 3,
        "DISLIKE_POST": 2,
        "DISLIKE_COMMENT": 2,
        "FOLLOW": 2,
        "MUTE": 1,
    }

    @classmethod
    def _analysis_dir(cls, simulation_id: str) -> str:
        path = os.path.join(Config.OASIS_SIMULATION_DATA_DIR, simulation_id, "analysis")
        os.makedirs(path, exist_ok=True)
        return path

    @classmethod
    def _features_path(cls, simulation_id: str) -> str:
        return os.path.join(cls._analysis_dir(simulation_id), "features.json")

    @classmethod
    def _evidence_path(cls, simulation_id: str) -> str:
        return os.path.join(cls._analysis_dir(simulation_id), "evidence_index.json")

    @classmethod
    def _save_json(cls, path: str, data: Dict[str, Any]) -> None:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    @classmethod
    def _load_json(cls, path: str) -> Optional[Dict[str, Any]]:
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    @classmethod
    def analyze_simulation(
        cls,
        simulation_id: str,
        refresh: bool = False
    ) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        分析单个案例并生成 features + evidence_index
        """
        if not refresh:
            cached_features = cls._load_json(cls._features_path(simulation_id))
            cached_evidence = cls._load_json(cls._evidence_path(simulation_id))
            if cached_features and cached_evidence:
                return cached_features, cached_evidence

        actions = SimulationRunner.get_all_actions(simulation_id)
        features, evidence_index = cls._build_from_actions(simulation_id, actions)
        cls._save_json(cls._features_path(simulation_id), features)
        cls._save_json(cls._evidence_path(simulation_id), evidence_index)
        return features, evidence_index

    @classmethod
    def get_evidence(
        cls,
        simulation_id: str,
        metric: Optional[str] = None,
        limit: int = 50,
        refresh: bool = False
    ) -> Dict[str, Any]:
        """
        获取证据索引（支持按机制过滤）
        """
        _, evidence_index = cls.analyze_simulation(simulation_id, refresh=refresh)
        entries = evidence_index.get("entries", [])
        if metric and metric in cls.METRICS:
            entries = [e for e in entries if metric in e.get("metrics", [])]
        if limit > 0:
            entries = entries[:limit]
        return {
            "simulation_id": simulation_id,
            "metric": metric,
            "count": len(entries),
            "entries": entries,
            "generated_at": evidence_index.get("generated_at"),
        }

    @classmethod
    def build_comparison_matrix(
        cls,
        simulation_ids: List[str],
        refresh: bool = False
    ) -> Dict[str, Any]:
        """
        构建多案例比较矩阵
        """
        rows: List[Dict[str, Any]] = []
        metric_means: Dict[str, List[float]] = {m: [] for m in cls.METRICS}

        for simulation_id in simulation_ids:
            features, _ = cls.analyze_simulation(simulation_id, refresh=refresh)
            summary = features.get("metrics_summary", {})
            row = {
                "simulation_id": simulation_id,
                "rounds_count": features.get("rounds_count", 0),
                "total_actions": features.get("total_actions", 0),
            }
            for metric in cls.METRICS:
                metric_summary = summary.get(metric, {})
                mean_v = float(metric_summary.get("mean", 0.0))
                max_v = float(metric_summary.get("max", 0.0))
                row[f"{metric}_mean"] = mean_v
                row[f"{metric}_max"] = max_v
                metric_means[metric].append(mean_v)
            rows.append(row)

        robust_patterns: List[Dict[str, Any]] = []
        diff_patterns: List[Dict[str, Any]] = []
        for metric in cls.METRICS:
            values = metric_means[metric]
            if not values:
                continue
            avg = sum(values) / len(values)
            variance = sum((v - avg) ** 2 for v in values) / max(len(values), 1)
            std = math.sqrt(variance)
            cv = std / avg if avg > 0 else 0.0
            if avg > 0.1 and cv <= 0.25:
                robust_patterns.append({
                    "metric": metric,
                    "mean": round(avg, 6),
                    "std": round(std, 6),
                    "cv": round(cv, 6),
                })

            high_row = max(rows, key=lambda x: x.get(f"{metric}_mean", 0.0))
            low_row = min(rows, key=lambda x: x.get(f"{metric}_mean", 0.0))
            spread = high_row.get(f"{metric}_mean", 0.0) - low_row.get(f"{metric}_mean", 0.0)
            if spread > 0.1:
                diff_patterns.append({
                    "metric": metric,
                    "spread": round(spread, 6),
                    "high_case": high_row.get("simulation_id"),
                    "low_case": low_row.get("simulation_id"),
                })

        return {
            "generated_at": datetime.now().isoformat(),
            "simulation_ids": simulation_ids,
            "metric_columns": [f"{m}_mean" for m in cls.METRICS] + [f"{m}_max" for m in cls.METRICS],
            "rows": rows,
            "cross_case_patterns": {
                "robust_patterns": robust_patterns,
                "differentiated_patterns": diff_patterns,
            },
        }

    @classmethod
    def _build_from_actions(
        cls,
        simulation_id: str,
        actions: List[AgentAction]
    ) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        actions_by_round: Dict[int, List[AgentAction]] = defaultdict(list)
        for action in actions:
            actions_by_round[action.round_num].append(action)

        round_numbers = sorted(actions_by_round.keys())
        evidence_entries: List[Dict[str, Any]] = []
        evidence_by_round: Dict[int, List[str]] = {}
        per_round: List[Dict[str, Any]] = []
        prev_total_actions = None
        prev_distribution: Dict[str, float] = {}

        for round_num in round_numbers:
            round_actions = actions_by_round[round_num]
            total = len(round_actions)
            action_dist = cls._action_distribution(round_actions)

            # 1) 关键转折指数：相邻轮次活跃度变化幅度
            if prev_total_actions is None:
                turning_point_index = 0.0
            else:
                turning_point_index = abs(total - prev_total_actions) / max(prev_total_actions, 1)

            # 2) 框架迁移指数：动作分布在相邻轮次的JSD
            if prev_distribution:
                frame_migration_index = cls._jensen_shannon_divergence(prev_distribution, action_dist)
            else:
                frame_migration_index = 0.0

            # 3) 中介放大指数：互动行为占比 + 头部主体集中度
            interactions = sum(1 for a in round_actions if a.action_type in cls.INTERACTION_ACTIONS)
            creations = sum(1 for a in round_actions if a.action_type in cls.CREATION_ACTIONS)
            interaction_ratio = interactions / max(interactions + creations, 1)
            agent_counter = Counter(a.agent_id for a in round_actions)
            top_agent_share = (max(agent_counter.values()) / total) if total else 0.0
            mediation_amplification_index = (0.7 * interaction_ratio) + (0.3 * top_agent_share)

            # 4) 路径分化指数：同轮次跨平台动作分布差异
            tw_actions = [a for a in round_actions if a.platform == "twitter"]
            rd_actions = [a for a in round_actions if a.platform == "reddit"]
            tw_dist = cls._action_distribution(tw_actions)
            rd_dist = cls._action_distribution(rd_actions)
            if tw_dist and rd_dist:
                path_divergence_index = cls._jensen_shannon_divergence(tw_dist, rd_dist)
            else:
                path_divergence_index = 0.0

            round_evidence_ids = cls._build_round_evidence(
                simulation_id=simulation_id,
                round_num=round_num,
                round_actions=round_actions,
                sink=evidence_entries,
            )
            evidence_by_round[round_num] = round_evidence_ids

            per_round.append({
                "round_num": round_num,
                "total_actions": total,
                "twitter_actions": len(tw_actions),
                "reddit_actions": len(rd_actions),
                "turning_point_index": round(turning_point_index, 6),
                "frame_migration_index": round(frame_migration_index, 6),
                "mediation_amplification_index": round(mediation_amplification_index, 6),
                "path_divergence_index": round(path_divergence_index, 6),
                "evidence_ids": round_evidence_ids,
            })

            prev_total_actions = total
            prev_distribution = action_dist

        features = {
            "simulation_id": simulation_id,
            "generated_at": datetime.now().isoformat(),
            "rounds_count": len(round_numbers),
            "total_actions": len(actions),
            "metrics_summary": cls._metrics_summary(per_round),
            "top_signals": cls._top_signals(per_round),
            "per_round": per_round,
            "schema": "case-stage-mechanism-evidence-theory",
        }

        evidence_index = {
            "simulation_id": simulation_id,
            "generated_at": datetime.now().isoformat(),
            "count": len(evidence_entries),
            "entries": evidence_entries,
            "evidence_by_round": evidence_by_round,
        }
        return features, evidence_index

    @classmethod
    def _build_round_evidence(
        cls,
        simulation_id: str,
        round_num: int,
        round_actions: List[AgentAction],
        sink: List[Dict[str, Any]],
        limit: int = 5
    ) -> List[str]:
        def score(action: AgentAction) -> int:
            return cls.SIGNAL_ACTION_PRIORITY.get(action.action_type, 0)

        picked = sorted(round_actions, key=score, reverse=True)[:limit]
        evidence_ids: List[str] = []
        for idx, action in enumerate(picked, start=1):
            evidence_id = f"ev_{simulation_id}_{round_num}_{idx}"
            evidence_ids.append(evidence_id)
            sink.append({
                "evidence_id": evidence_id,
                "round_num": round_num,
                "timestamp": action.timestamp,
                "platform": action.platform,
                "agent_id": action.agent_id,
                "agent_name": action.agent_name,
                "action_type": action.action_type,
                "action_args": action.action_args,
                "metrics": cls.METRICS,
            })
        return evidence_ids

    @classmethod
    def _metrics_summary(cls, per_round: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        summary: Dict[str, Dict[str, Any]] = {}
        for metric in cls.METRICS:
            values = [float(x.get(metric, 0.0)) for x in per_round]
            if not values:
                summary[metric] = {"mean": 0.0, "max": 0.0, "max_round": None}
                continue
            max_idx = max(range(len(values)), key=lambda i: values[i])
            summary[metric] = {
                "mean": round(sum(values) / len(values), 6),
                "max": round(values[max_idx], 6),
                "max_round": per_round[max_idx].get("round_num"),
            }
        return summary

    @classmethod
    def _top_signals(cls, per_round: List[Dict[str, Any]], top_k: int = 5) -> Dict[str, List[Dict[str, Any]]]:
        signals: Dict[str, List[Dict[str, Any]]] = {}
        for metric in cls.METRICS:
            rows = sorted(per_round, key=lambda x: float(x.get(metric, 0.0)), reverse=True)[:top_k]
            signals[metric] = [
                {
                    "round_num": row.get("round_num"),
                    "value": row.get(metric, 0.0),
                    "evidence_ids": row.get("evidence_ids", []),
                }
                for row in rows
            ]
        return signals

    @classmethod
    def _action_distribution(cls, actions: List[AgentAction]) -> Dict[str, float]:
        if not actions:
            return {}
        counts = Counter((a.action_type or "UNKNOWN") for a in actions)
        total = sum(counts.values())
        if total <= 0:
            return {}
        return {k: v / total for k, v in counts.items()}

    @classmethod
    def _jensen_shannon_divergence(cls, p: Dict[str, float], q: Dict[str, float]) -> float:
        if not p or not q:
            return 0.0
        keys = set(p.keys()) | set(q.keys())
        m = {k: 0.5 * (p.get(k, 0.0) + q.get(k, 0.0)) for k in keys}

        def kl_divergence(a: Dict[str, float], b: Dict[str, float]) -> float:
            eps = 1e-12
            result = 0.0
            for k in keys:
                av = a.get(k, 0.0)
                bv = b.get(k, 0.0)
                if av > 0:
                    result += av * math.log((av + eps) / (bv + eps), 2)
            return result

        jsd = 0.5 * kl_divergence(p, m) + 0.5 * kl_divergence(q, m)
        return max(0.0, jsd)
