from __future__ import annotations

from llm_client import chat_completion, parse_json_answer


def diagnose_error(payload: dict) -> dict:
    error_message = (payload.get("error_message") or "").strip()
    code = (payload.get("code") or "").strip()
    context = (payload.get("context") or "机器学习建模、数据处理或 sklearn 实验").strip()
    stage = (payload.get("stage") or "模型训练").strip()
    severity = (payload.get("severity") or "阻塞运行").strip()
    expected_behavior = (payload.get("expected_behavior") or "代码能够正常运行并输出可解释结果").strip()
    runtime_env = (payload.get("runtime_env") or "Python / pandas / scikit-learn").strip()
    learner_profile = payload.get("learner_profile") or {}
    learner_level = learner_profile.get("level") or payload.get("learner_level") or "机器学习初学者"

    text = chat_completion(
        payload,
        "error",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习错误诊断 Agent。"
                    "你的目标不是只修复报错，而是把报错转化为学习机会，帮助用户理解错误原因、修复方法和预防方式。"
                    "诊断深度要根据学习者水平调整：初学者先解释现象和最小修复，有基础用户补充根因链路和防复发检查。"
                    "回答要面向课程设计演示和初学者复盘，必须具体、可执行、不要空泛。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"问题场景: {context}\n"
                    f"发生阶段: {stage}\n"
                    f"严重程度: {severity}\n"
                    f"期望行为: {expected_behavior}\n"
                    f"运行环境: {runtime_env}\n\n"
                    f"学习者水平: {learner_level}\n"
                    f"学习画像: {learner_profile}\n\n"
                    f"报错信息或异常现象:\n{error_message}\n\n"
                    f"相关代码或实验配置:\n{code}\n\n"
                    "请返回以下 JSON 字段:\n"
                    "- error_type: 错误类型，尽量具体\n"
                    "- summary: 一句话诊断摘要\n"
                    "- severity: 严重程度，可沿用用户输入或修正\n"
                    "- confidence: 高/中/低，并基于已给信息判断\n"
                    "- root_cause: 最可能根因\n"
                    "- reason: 为什么会出现这个错误\n"
                    "- immediate_fix: 现在最应该先尝试的修复动作\n"
                    "- solution: 完整修复建议\n"
                    "- fixed_code: 必要的修复代码片段，不要给完整无关项目\n"
                    "- diagnosis_steps: 3 到 5 个排查步骤，字符串数组\n"
                    "- verification_steps: 2 到 4 个验证修复是否成功的步骤，字符串数组\n"
                    "- principle: 背后的机器学习或 Python/sklearn 原理解释\n"
                    "- prevention_checklist: 3 到 5 个以后避免该问题的检查项，字符串数组\n"
                    "- related_concepts: 2 到 5 个相关概念，字符串数组\n"
                    "- next_actions: 2 到 3 个对象数组，每个对象包含 label, target_view，其中 target_view 只能是 concept、visualize、codeTutor、experiment、diagnose、archive 之一。\n"
                    "也可兼容返回 avoidance_tips，但优先使用 prevention_checklist。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("error_type", "模型生成诊断")
    data.setdefault("severity", severity)
    data.setdefault("learner_level", learner_level)
    data.setdefault("generated_by", "error")
    return data
