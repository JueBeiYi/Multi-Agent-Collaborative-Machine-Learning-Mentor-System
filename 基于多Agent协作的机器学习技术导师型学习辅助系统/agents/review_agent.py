from __future__ import annotations

import json
from typing import Any

from llm_client import LLMError, chat_completion, parse_json_answer


def summarize_review(payload: dict[str, Any]) -> dict[str, Any]:
    local_result = build_local_review(payload)
    if not _has_llm_config(payload, "review"):
        return local_result

    try:
        text = chat_completion(
            payload,
            "review",
            [
                {
                    "role": "system",
                    "content": (
                        "你是机器学习导师系统中的总结复习 Agent。"
                        "你的职责是阅读学习路线、学习记录、实验记录、诊断记录和薄弱点，"
                        "生成简洁可执行的复习安排。只返回 JSON，不要 Markdown。"
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "请基于以下本地学习档案生成复习总结，字段必须包含 "
                        "review_summary, completed_highlights, weak_points_to_review, next_actions, study_plan, handoff_context。\n"
                        f"{json.dumps(_review_payload(payload), ensure_ascii=False, indent=2)}"
                    ),
                },
            ],
        )
        data = parse_json_answer(text)
        data.setdefault("generated_by", "review")
        data.setdefault("agent_role", "总结复习 Agent")
        data.setdefault("review_summary", local_result["review_summary"])
        data.setdefault("next_actions", local_result["next_actions"])
        data.setdefault("handoff_context", local_result["handoff_context"])
        return data
    except LLMError as exc:
        return {**local_result, "fallback_reason": str(exc)}


def build_local_review(payload: dict[str, Any]) -> dict[str, Any]:
    profile = payload.get("learner_profile") or {}
    learning = _as_list(payload.get("learning_records"))
    plans = _as_list(payload.get("learning_plans"))
    experiments = _as_list(payload.get("experiment_records"))
    errors = _as_list(payload.get("error_records"))
    weak_points = _as_list(payload.get("weak_points"))
    mastery = _as_list(payload.get("concept_mastery"))
    stage_progress = _as_list(payload.get("stage_progress"))

    top_weak = _top_weak_points(weak_points, mastery)
    completed = _completed_highlights(learning, experiments, errors, plans)
    current_stage = _current_stage(stage_progress, plans)
    summary = _review_summary(completed, top_weak, current_stage)

    return {
        "generated_by": "review",
        "agent_role": "总结复习 Agent",
        "review_summary": summary,
        "completed_highlights": completed,
        "weak_points_to_review": top_weak,
        "study_plan": _study_plan(top_weak, current_stage),
        "next_actions": _next_actions(top_weak),
        "handoff_context": {
            "source_agent": "review_coach",
            "target_agent": "learning_planner",
            "learner_profile": profile,
            "priority_topics": [item.get("concept") for item in top_weak[:3]],
            "reason": "复习完成后回到学习规划 Agent 更新下一阶段路线。",
        },
    }


def _review_payload(payload: dict[str, Any]) -> dict[str, Any]:
    keys = [
        "learner_profile",
        "learning_plans",
        "learning_records",
        "experiment_records",
        "error_records",
        "weak_points",
        "concept_mastery",
        "stage_progress",
    ]
    return {key: payload.get(key) for key in keys}


def _completed_highlights(
    learning: list[dict[str, Any]],
    experiments: list[dict[str, Any]],
    errors: list[dict[str, Any]],
    plans: list[dict[str, Any]],
) -> list[str]:
    highlights: list[str] = []
    if plans:
        highlights.append(f"已生成 {len(plans)} 条学习路线。")
    if learning:
        highlights.append(f"已保存 {len(learning)} 条知识点或代码学习记录。")
    if experiments:
        highlights.append(f"已完成 {len(experiments)} 次实验记录。")
    if errors:
        highlights.append(f"已沉淀 {len(errors)} 条错误诊断记录。")
    return highlights or ["还没有足够记录，建议先完成一个知识点学习和练习。"]


def _top_weak_points(weak_points: list[dict[str, Any]], mastery: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for record in weak_points:
        concept = str(record.get("concept") or "").strip()
        if concept:
            merged[concept] = {
                "concept": concept,
                "severity": record.get("severity") or "中",
                "reason": record.get("reason") or record.get("suggested_action") or "薄弱点记录。",
                "suggested_action": record.get("suggested_action") or "回到对应知识点复习并完成练习。",
            }
    for record in mastery:
        score = record.get("mastery_score")
        if _is_number(score) and float(score) < 0.75:
            concept = str(record.get("concept") or "掌握度偏低").strip()
            merged.setdefault(
                concept,
                {
                    "concept": concept,
                    "severity": "高" if float(score) < 0.5 else "中",
                    "reason": f"掌握度约 {round(float(score) * 100)}%。",
                    "suggested_action": f"复习“{concept}”并重做自测题。",
                },
            )
    severity_order = {"高": 0, "中": 1, "低": 2}
    return sorted(merged.values(), key=lambda item: severity_order.get(item.get("severity"), 9))[:5]


def _current_stage(stage_progress: list[dict[str, Any]], plans: list[dict[str, Any]]) -> str:
    if stage_progress:
        return str(stage_progress[0].get("active_stage") or stage_progress[0].get("plan_goal") or "")
    if plans:
        return str(plans[0].get("current_stage") or plans[0].get("learning_goal") or "")
    return ""


def _review_summary(completed: list[str], weak_points: list[dict[str, Any]], current_stage: str) -> str:
    weak_text = "、".join(item["concept"] for item in weak_points[:3])
    if weak_text:
        return f"当前阶段{f'“{current_stage}”' if current_stage else ''}建议先复习 {weak_text}，再继续推进路线。"
    return f"学习记录已形成闭环，{completed[0]} 下一步可以继续路线或做一次综合实验。"


def _study_plan(weak_points: list[dict[str, Any]], current_stage: str) -> list[str]:
    if not weak_points:
        return ["回到学习路线选择下一阶段。", "完成一次代码或实验练习。", "保存记录后再次复盘。"]
    return [
        f"先复习“{weak_points[0]['concept']}”。",
        "重做对应自测题，并写下自己的解释。",
        f"回到{current_stage or '学习路线'}继续下一步。",
    ]


def _next_actions(weak_points: list[dict[str, Any]]) -> list[dict[str, str]]:
    if weak_points:
        return [
            {"label": f"复习{weak_points[0]['concept']}", "target_view": "concept"},
            {"label": "查看薄弱点", "target_view": "archive"},
            {"label": "回到学习路线", "target_view": "plan"},
        ]
    return [
        {"label": "继续学习路线", "target_view": "plan"},
        {"label": "进入实验中心", "target_view": "experiment"},
    ]


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
