"""
生成多案例比较矩阵

用法:
  uv run python scripts/compare_cases.py --simulation-ids sim_a sim_b sim_c sim_d
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
    parser = argparse.ArgumentParser(description="生成多案例比较矩阵")
    parser.add_argument(
        "--simulation-ids",
        nargs="+",
        required=True,
        help="模拟ID列表，至少2个"
    )
    parser.add_argument("--refresh", action="store_true", help="强制重新计算")
    args = parser.parse_args()

    if len(args.simulation_ids) < 2:
        raise SystemExit("simulation_ids 至少需要2个")

    matrix = MechanismAnalysisService.build_comparison_matrix(
        simulation_ids=args.simulation_ids,
        refresh=args.refresh,
    )
    print(json.dumps(matrix, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
