from __future__ import annotations

import json

from llm_client import chat_completion, parse_json_answer


def explain_result(result: dict, payload: dict) -> dict:
    learner_profile = payload.get("learner_profile") or {}
    learner_level = learner_profile.get("level") or payload.get("learner_level") or "机器学习初学者"
    compact_result = {
        "task_type": result.get("task_type"),
        "model_name": result.get("model_name"),
        "data_summary": result.get("data_summary"),
        "metrics": result.get("metrics"),
        "confusion_matrix": result.get("confusion_matrix"),
        "per_label_metrics": result.get("per_label_metrics"),
        "sample_predictions": result.get("predictions"),
    }
    text = chat_completion(
        payload,
        "result",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习实验结果解释 Agent。"
                    "请用课程设计论文和初学者学习复盘都能理解的方式解释指标。"
                    "如果学习者是初学者，先解释指标直觉；如果有 sklearn 基础，补充指标适用条件、误差分析和后续实验设计。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"学习者水平: {learner_level}\n"
                    f"学习画像:\n{json.dumps(learner_profile, ensure_ascii=False)}\n\n"
                    "下面是一次机器学习实验的结构化结果:\n"
                    f"{json.dumps(compact_result, ensure_ascii=False)}\n\n"
                    "请返回以下 JSON 字段: summary, metric_explanation, metric_formulas, problem_analysis, "
                    "optimization_suggestions, learning_takeaways, next_experiments。"
                    "metric_formulas 是字符串，写出 Accuracy、Precision、Recall、F1 或本次指标涉及的核心公式。不要返回 LaTeX 源码，优先使用普通数学符号和可直接展示的表达式。\n"
                    "optimization_suggestions、learning_takeaways、next_experiments 都是字符串数组。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("learner_level", learner_level)
    data.setdefault("generated_by", "result")
    return data
