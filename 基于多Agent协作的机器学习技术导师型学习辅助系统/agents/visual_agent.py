from __future__ import annotations

import json

from llm_client import chat_completion, parse_json_answer


def explain_visual_step(payload: dict) -> dict:
    algorithm = (payload.get("algorithm") or "K-means").strip()
    state = payload.get("state") or {}
    learner_profile = payload.get("learner_profile") or {}
    learner_level = learner_profile.get("level") or payload.get("learner_level") or "机器学习初学者"

    text = chat_completion(
        payload,
        "visual",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习算法可视化 Agent。"
                    "请结合画布状态解释算法此刻发生了什么，帮助初学者把图形变化和数学原理对应起来。"
                    "解释深度要根据学习者水平调整：初学者先讲观察现象，有基础用户补充公式、参数和实验意义。"
                    "回答要适合课程设计展示，必须具体、可观察、可复盘。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"算法: {algorithm}\n"
                    f"学习者水平: {learner_level}\n"
                    f"学习画像:\n{json.dumps(learner_profile, ensure_ascii=False)}\n"
                    f"画布状态:\n{json.dumps(state, ensure_ascii=False)}\n\n"
                    "请返回以下 JSON 字段:\n"
                    "- step_title: 当前步骤标题\n"
                    "- step_explanation: 结合画布说明当前发生了什么\n"
                    "- parameter_meaning: 当前关键参数的含义，例如 K、k、学习率、树深度等\n"
                    "- formula_or_rule: 当前算法步骤对应的核心公式、更新规则或判断规则。不要返回 LaTeX 源码，优先使用普通数学符号和可直接展示的表达式\n"
                    "- current_observation: 用户现在应该重点观察画布上的什么变化\n"
                    "- learning_takeaways: 2 到 4 个学习要点，字符串数组\n"
                    "- common_misunderstandings: 1 到 3 个常见误区，字符串数组\n"
                    "- next_observation: 下一步点击后应该观察什么\n"
                    "- mini_quiz: 一个简短自测问题\n"
                    "- related_concepts: 2 到 5 个相关概念，字符串数组\n"
                    "- next_actions: 2 到 3 个对象数组，每个对象包含 label, target_view，其中 target_view 只能是 concept、visualize、codeTutor、experiment、diagnose、archive 之一。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("step_title", algorithm)
    data.setdefault("learner_level", learner_level)
    data.setdefault("generated_by", "visual")
    return data
