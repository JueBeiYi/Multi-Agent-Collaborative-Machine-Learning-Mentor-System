from __future__ import annotations

from llm_client import chat_completion, parse_json_answer


CONCEPTS = {
    "特征",
    "标签",
    "训练集和测试集",
    "过拟合",
    "欠拟合",
    "Accuracy",
    "Precision",
    "Recall",
    "F1",
    "混淆矩阵",
    "KNN",
    "K-means",
    "线性回归",
    "决策树",
}


def level_guidance(learner_level: str) -> str:
    text = learner_level or ""
    if "初学" in text or "刚接触" in text:
        return "先用生活化语言建立直觉，再给最少必要术语；代码示例要短，每一步都解释为什么。"
    if "sklearn" in text or "Python" in text:
        return "可以加入 sklearn 流程、常见参数和数据形状解释；强调概念如何落到代码。"
    if "课程设计" in text or "项目" in text:
        return "用项目报告视角组织内容，补充指标解释、实验结论写法和可复现建议。"
    return "保持循序渐进，先概念后原理，再连接例子、代码和练习。"


def explain_concept(payload: dict) -> dict:
    topic = (payload.get("topic") or "过拟合").strip()
    learner_level = (payload.get("learner_level") or "机器学习初学者").strip()
    scenario = (payload.get("scenario") or "Iris 分类实验").strip()
    learning_goal = (payload.get("learning_goal") or "理解概念并能在机器学习项目中使用").strip()
    guidance = level_guidance(learner_level)

    text = chat_completion(
        payload,
        "concept",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习概念导师 Agent。"
                    "回答要像技术导师，不是百科词条；必须把概念、代码、实验和项目流程联系起来。"
                    "内容要适合放进学习辅助系统界面展示，层次清楚，语言友好，避免空泛。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"学习者水平: {learner_level}\n"
                    f"学习场景: {scenario}\n"
                    f"本次学习目标: {learning_goal}\n"
                    f"解释深度要求: {guidance}\n"
                    f"需要讲解的概念: {topic}\n\n"
                    "请返回以下 JSON 字段:\n"
                    "- topic: 概念名\n"
                    "- learner_level: 沿用学习者水平\n"
                    "- difficulty: beginner/intermediate/project 之一\n"
                    "- one_sentence: 一句话说明\n"
                    "- simple_explanation: 按学习者水平调整的通俗解释\n"
                    "- analogy: 一个贴切类比\n"
                    "- technical_definition: 技术定义\n"
                    "- principle: 概念背后的原理，初学者用直觉解释，有基础用户补充更严谨表述\n"
                    "- explanation_layers: 对象，包含 concept, principle, example, code, practice 五个字段\n"
                    "- key_points: 3 到 5 个关键点，字符串数组\n"
                    "- formula_or_rule: 公式、规则或判断方法；没有公式也要给出可操作规则。不要返回 LaTeX 源码，优先使用普通数学符号，例如 Accuracy = 正确数 / 总数，F1 = 2 × Precision × Recall / (Precision + Recall)\n"
                    "- why_it_matters: 为什么重要\n"
                    "- project_connection: 它在完整机器学习项目流程中的位置\n"
                    "- code_connection: 简短 Python/sklearn 代码或伪代码\n"
                    "- common_mistakes: 3 到 5 个常见误区，字符串数组\n"
                    "- mini_example: 一个具体小例子\n"
                    "- practice_task: 一个可以在当前系统中完成的小练习\n"
                    "- mastery_signal: 对象，包含 expected_skill, weak_point_if_wrong, review_tip\n"
                    "- quiz: 2 到 3 个对象数组，每个对象包含 question, answer\n"
                    "- next_topics: 3 到 5 个下一步主题，字符串数组\n"
                    "- related_actions: 2 到 3 个对象数组，每个对象包含 label, target_view，其中 target_view 只能是 concept、visualize、codeTutor、experiment、diagnose、archive 之一。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("topic", topic)
    data.setdefault("learner_level", learner_level)
    data.setdefault("level_guidance", guidance)
    data.setdefault("generated_by", "concept")
    return data
