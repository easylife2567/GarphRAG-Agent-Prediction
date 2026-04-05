"""
机制分析 API
"""

import traceback
from flask import jsonify, request

from . import analysis_bp
from ..services.mechanism_analysis import MechanismAnalysisService
from ..utils.logger import get_logger

logger = get_logger("mirofish.api.analysis")


@analysis_bp.route("/features", methods=["POST"])
def analyze_features():
    """
    生成或获取单案例机制特征

    请求:
    {
      "simulation_id": "sim_xxx",
      "refresh": false
    }
    """
    try:
        data = request.get_json() or {}
        simulation_id = data.get("simulation_id")
        if not simulation_id:
            return jsonify({"success": False, "error": "请提供 simulation_id"}), 400

        refresh = bool(data.get("refresh", False))
        features, evidence = MechanismAnalysisService.analyze_simulation(
            simulation_id=simulation_id,
            refresh=refresh,
        )
        return jsonify({
            "success": True,
            "data": {
                "features": features,
                "evidence_count": evidence.get("count", 0),
            }
        })
    except Exception as e:
        logger.error(f"机制特征分析失败: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


@analysis_bp.route("/evidence", methods=["POST"])
def get_evidence():
    """
    获取证据索引

    请求:
    {
      "simulation_id": "sim_xxx",
      "metric": "turning_point_index",
      "limit": 50,
      "refresh": false
    }
    """
    try:
        data = request.get_json() or {}
        simulation_id = data.get("simulation_id")
        if not simulation_id:
            return jsonify({"success": False, "error": "请提供 simulation_id"}), 400

        metric = data.get("metric")
        limit = int(data.get("limit", 50))
        refresh = bool(data.get("refresh", False))
        result = MechanismAnalysisService.get_evidence(
            simulation_id=simulation_id,
            metric=metric,
            limit=limit,
            refresh=refresh,
        )
        return jsonify({"success": True, "data": result})
    except Exception as e:
        logger.error(f"获取证据索引失败: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


@analysis_bp.route("/compare", methods=["POST"])
def compare_cases():
    """
    多案例比较矩阵

    请求:
    {
      "simulation_ids": ["sim_a", "sim_b", ...],
      "refresh": false
    }
    """
    try:
        data = request.get_json() or {}
        simulation_ids = data.get("simulation_ids") or []
        if not isinstance(simulation_ids, list) or len(simulation_ids) < 2:
            return jsonify({
                "success": False,
                "error": "请提供至少2个 simulation_ids"
            }), 400

        refresh = bool(data.get("refresh", False))
        matrix = MechanismAnalysisService.build_comparison_matrix(
            simulation_ids=simulation_ids,
            refresh=refresh,
        )
        return jsonify({"success": True, "data": matrix})
    except Exception as e:
        logger.error(f"生成比较矩阵失败: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500
