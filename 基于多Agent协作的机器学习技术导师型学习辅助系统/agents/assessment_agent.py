from __future__ import annotations

import json
from statistics import mean
from typing import Any

from llm_client import LLMError, chat_completion, parse_json_answer


def diagnose_assessment(payload: dict[str, Any]) -> dict[str, Any]:
    local_result = build_local_assessment(payload)
    if not _has_llm_config(payload, "assessment"):
        return local_result

    try:
        text = chat_completion(
            payload,
            "assessment",
            [
                {
                    "role": "system",
                    "content": (
                        "你是机器学习导师系统中的测评诊断 Agent。"
                        "你的职责是汇总自测题、掌握度、实验指标和错误记录，判断学习者的薄弱点，"
                        "给出下一步补救动作。只返回 JSON，不要 Markdown。"
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "请基于以下学习档案生成测评诊断结果，字段必须包含 "
                        "diagnosis_summary, weak_points, mastery_overview, recommended_actions, handoff_context。\n"
                        f"{json.dumps(_assessment_payload(payload), ensure_ascii=False, indent=2)}"
                    ),
                },
            ],
        )
        data = parse_json_answer(text)
        data.setdefault("generated_by", "assessment")
        data.setdefault("agent_role", "测评诊断 Agent")
        data.setdefault("weak_points", local_result["weak_points"])
        data.setdefault("recommended_actions", local_result["recommended_actions"])
        data.setdefault("handoff_context", local_result["handoff_context"])
        return data
    except LLMError as exc:
        return {**local_result, "fallback_reason": str(exc)}


def build_local_assessment(payload: dict[str, Any]) -> dict[str, Any]:
    profile = payload.get("learner_profile") or {}
    mastery = _as_list(payload.get("concept_mastery"))
    quiz_attempts = _as_list(payload.get("quiz_attempts"))
    weak_points = _as_list(payload.get("weak_points"))
    experiments = _as_list(payload.get("experiment_records"))
    errors = _as_list(payload.get("error_records"))

    weak_candidates = _weak_points_from_mastery(mastery)
    weak_candidates.extend(_weak_points_from_quiz(quiz_attempts))
    weak_candidates.extend(_normalize_existing_weak_points(weak_points))
    weak_candidates.extend(_weak_points_from_experiments(experiments))
    weak_candidates.extend(_weak_points_from_errors(errors))
    merged_weak_points = _dedupe_weak_points(weak_candidates)[:5]

    mastery_scores = [
        float(item.get("mastery_score"))
        for item in mastery
        if _is_number(item.get("mastery_score"))
    ]
    average_score = round(mean(mastery_scores), 2) if mastery_scores else None
    summary = _assessment_summary(merged_weak_points, average_score)

    return {
        "generated_by": "assessment",
        "agent_role": "测评诊断 Agent",
        "diagnosis_summary": summary,
        "weak_points": merged_weak_points,
        "mastery_overview": {
            "average_score": average_score,
            "mastery_record_count": len(mastery),
            "quiz_attempt_count": len(quiz_attempts),
            "experiment_count": len(experiments),
            "error_count": len(errors),
        },
        "recommended_actions": _recommended_actions(merged_weak_points),
        "handoff_context": {
            "source_agent": "assessment_diagnosis",
            "target_agent": "review_coach",
            "learner_profile": profile,
            "priority_topics": [item["concept"] for item in merged_weak_points[:3]],
            "reason": "测评诊断完成后交给总结复习 Agent 安排复习顺序。",
        },
    }


def _assessment_payload(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "learner_profile": payload.get("learner_profile") or {},
        "concept_mastery": _as_list(payload.get("concept_mastery")),
        "quiz_attempts": _as_list(payload.get("quiz_attempts")),
        "weak_points": _as_list(payload.get("weak_points")),
        "experiment_records": _as_list(payload.get("experiment_records")),
        "error_records": _as_list(payload.get("error_records")),
    }


def _weak_points_from_mastery(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    items = []
    for record in records:
        score = record.get("mastery_score")
        if _is_number(score) and float(score) < 0.75:
            items.append(
                {
                    "concept": record.get("concept") or "未命名知识点",
                    "severity": "高" if float(score) < 0.5 else "中",
                    "reason": record.get("evidence") or record.get("mastery_label") or "掌握度偏低。",
                    "suggested_action": f"重新学习“{record.get('concept') or '该知识点'}”，再完成一次自测。",
                    "source_type": record.get("source_type") or "concept_mastery",
                }
            )
    return items


def _weak_points_from_quiz(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    items = []
    for record in records:
        result = str(record.get("result") or record.get("status") or "")
        if any(flag in result for flag in ["薄弱", "错误", "需要复习", "wrong"]):
            concept = record.get("concept") or record.get("question") or "自测题"
            items.append(
                {
                    "concept": concept,
                    "severity": "中",
                    "reason": record.get("question") or "自测题结果提示需要复习。",
                    "suggested_action": "回到知识点讲解，重做自测题并补充自己的解释。",
                    "source_type": "quiz_attempt",
                }
            )
    return items


def _normalize_existing_weak_points(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "concept": record.get("concept") or "薄弱点",
            "severity": record.get("severity") or "中",
            "reason": record.get("reason") or "已有薄弱点记录。",
            "suggested_action": record.get("suggested_action") or "优先复习该主题。",
            "source_type": record.get("source_type") or "weak_point",
        }
        for record in records
    ]


def _weak_points_from_experiments(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    items = []
    for record in records:
        metrics = record.get("metrics") or {}
        score = metrics.get("macro_f1", metrics.get("accuracy"))
        if _is_number(score) and float(score) < 0.75:
            items.append(
                {
                    "concept": "模型评估指标",
                    "severity": "中",
                    "reason": f"实验指标偏低，当前分数约为 {round(float(score), 2)}。",
                    "suggested_action": "复习混淆矩阵和 Precision/Recall，再设计一次改进实验。",
                    "source_type": "experiment",
                }
            )
    return items


def _weak_points_from_errors(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "concept": record.get("error_type") or record.get("stage") or "错误诊断",
            "severity": "高" if "阻塞" in str(record.get("severity") or "") else "中",
            "reason": record.get("diagnosis") or record.get("error_message") or "错误记录提示需要复盘。",
            "suggested_action": "复现错误、应用修复步骤，并补充防复发检查项。",
            "source_type": "error_record",
        }
        for record in records
    ]


def _dedupe_weak_points(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    severity_order = {"高": 0, "中": 1, "低": 2}
    result: dict[str, dict[str, Any]] = {}
    for record in records:
        concept = str(record.get("concept") or "").strip()
        if not concept:
            continue
        existing = result.get(concept)
        if not existing or severity_order.get(record.get("severity"), 9) < severity_order.get(existing.get("severity"), 9):
            result[concept] = record
    return sorted(result.values(), key=lambda item: severity_order.get(item.get("severity"), 9))


def _recommended_actions(weak_points: list[dict[str, Any]]) -> list[dict[str, str]]:
    if not weak_points:
        return [
            {"label": "进入总结复习", "target_view": "archive"},
            {"label": "继续下一阶段", "target_view": "plan"},
        ]
    actions = [
        {
            "label": f"复习{weak_points[0]['concept']}",
            "target_view": "concept",
        },
        {"label": "查看学习档案", "target_view": "archive"},
    ]
    if any(item.get("source_type") == "experiment" for item in weak_points):
        actions.insert(1, {"label": "回到实验中心", "target_view": "experiment"})
    return actions[:3]


def _assessment_summary(weak_points: list[dict[str, Any]], average_score: float | None) -> str:
    if not weak_points:
        return "当前记录没有明显薄弱点，可以继续推进下一阶段并保持复习。"
    top = "、".join(item["concept"] for item in weak_points[:3])
    score_text = f"平均掌握度约 {round(average_score * 100)}%，" if average_score is not None else ""
    return f"{score_text}建议优先处理: {top}。"


def _has_llm_config(payload: dict[str, Any], agent_id: str) -> bool:
    raw = payload.get("llm_config") or {}
    if not isinstance(raw, dict):
        return False
    if "base_url" in raw or "model" in raw:
        source = raw
    else:
        use_unified = bool(raw.get("use_unified", True))
        shared = raw.get("shared") or raw.get("common") or {}
        agents = raw.get("agents") or {}
        source = shared if use_unified else (agents.get(agent_id) or shared)
    return bool(str(source.get("base_url") or "").strip() and str(source.get("model") or "").strip())


def _as_list(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, dict)]


def _is_number(value: Any) -> bool:
    try:
        float(value)
        return True
    except (TypeError, ValueError):
        return False
