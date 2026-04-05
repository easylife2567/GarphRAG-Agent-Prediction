"""
生成单案例传播机制特征

用法:
  uv run python scripts/generate_mechanism_features.py --simulation-id sim_xxx
  uv run python scripts/generate_mechanism_features.py --simulation-id sim_xxx --refresh
"""

import argparse
import json
import os
import sys

_scripts_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.abspath(os.path.join(_scripts_dir, ".."))
sys.path.insert(0, _backend_dir)

from app.services.mechanism_analysis import MechanismAnalysisService  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="生成单案例传播机制特征")
    parser.add_argument("--simulation-id", required=True, help="模拟ID")
    parser.add_argument("--refresh", action="store_true", help="强制重新计算")
    args = parser.parse_args()

    features, evidence = MechanismAnalysisService.analyze_simulation(
        simulation_id=args.simulation_id,
        refresh=args.refresh,
    )
    output = {
        "simulation_id": args.simulation_id,
        "features_path": MechanismAnalysisService._features_path(args.simulation_id),
        "evidence_path": MechanismAnalysisService._evidence_path(args.simulation_id),
        "rounds_count": features.get("rounds_count", 0),
        "total_actions": features.get("total_actions", 0),
        "evidence_count": evidence.get("count", 0),
        "metrics_summary": features.get("metrics_summary", {}),
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
