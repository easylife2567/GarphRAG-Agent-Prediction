"""
阶段 Gate 校验工具（轻量版）

用法示例:
  uv run python scripts/validate_stage_gate.py --stage P2 --simulation-id sim_xxx
  uv run python scripts/validate_stage_gate.py --stage P3 --simulation-id sim_xxx
"""

import argparse
import json
import os
import sys
from typing import Dict, List, Tuple

_scripts_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.abspath(os.path.join(_scripts_dir, ".."))
_project_root = os.path.abspath(os.path.join(_backend_dir, ".."))
sys.path.insert(0, _backend_dir)


def _load_json(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _check_exists(path: str) -> Tuple[bool, str]:
    if os.path.exists(path):
        return True, f"OK: {path}"
    return False, f"MISSING: {path}"


def validate_p2(simulation_id: str) -> Tuple[bool, List[str]]:
    sim_dir = os.path.join(_backend_dir, "app", "uploads", "simulations", simulation_id)
    config_path = os.path.join(sim_dir, "simulation_config.json")
    manifest_path = os.path.join(sim_dir, "run_manifest.json")
    checks: List[Tuple[bool, str]] = []
    checks.append(_check_exists(config_path))
    checks.append(_check_exists(manifest_path))
    if os.path.exists(config_path):
        config = _load_json(config_path)
        checks.append((config.get("run_seed") is not None, "run_seed 已配置"))
        checks.append((isinstance(config.get("llm_lock"), dict), "llm_lock 已配置"))
        checks.append(("case_tag" in config, "case_tag 字段存在"))
    passed = all(x[0] for x in checks)
    return passed, [x[1] for x in checks]


def validate_p3(simulation_id: str) -> Tuple[bool, List[str]]:
    analysis_dir = os.path.join(
        _backend_dir, "app", "uploads", "simulations", simulation_id, "analysis"
    )
    features_path = os.path.join(analysis_dir, "features.json")
    evidence_path = os.path.join(analysis_dir, "evidence_index.json")
    checks: List[Tuple[bool, str]] = []
    checks.append(_check_exists(features_path))
    checks.append(_check_exists(evidence_path))
    if os.path.exists(features_path):
        features = _load_json(features_path)
        checks.append(("metrics_summary" in features, "features 包含 metrics_summary"))
        checks.append((len(features.get("per_round", [])) > 0, "features 包含 per_round"))
    if os.path.exists(evidence_path):
        evidence = _load_json(evidence_path)
        checks.append((evidence.get("count", 0) > 0, "evidence_index 包含证据条目"))
    passed = all(x[0] for x in checks)
    return passed, [x[1] for x in checks]


def main() -> None:
    parser = argparse.ArgumentParser(description="阶段 Gate 校验")
    parser.add_argument("--stage", required=True, choices=["P2", "P3"])
    parser.add_argument("--simulation-id", required=True)
    args = parser.parse_args()

    if args.stage == "P2":
        passed, details = validate_p2(args.simulation_id)
    else:
        passed, details = validate_p3(args.simulation_id)

    result = {
        "stage": args.stage,
        "simulation_id": args.simulation_id,
        "passed": passed,
        "details": details,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if not passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
