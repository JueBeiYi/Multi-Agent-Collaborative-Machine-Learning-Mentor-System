from __future__ import annotations

from llm_client import chat_completion, parse_json_answer


def generate_code_tutor_step(payload: dict) -> dict:
    step_index = int(payload.get("step_index", 0))
    step_title = (payload.get("step_title") or "机器学习代码步骤").strip()
    project = (payload.get("project") or "Iris 分类实验").strip()
    model_algorithm = (payload.get("model_algorithm") or "logistic_regression").strip()
    generation_mode = (payload.get("generation_mode") or ("full_project" if payload.get("full_project") else "step")).strip()
    learner_level = (payload.get("learner_level") or "有 Python 基础的机器学习初学者").strip()
    coding_style = (payload.get("coding_style") or "清晰、可运行、适合课程设计展示").strip()
    learning_goal = (payload.get("learning_goal") or "理解当前代码步骤并能自己复现").strip()
    full_project = generation_mode == "full_project"
    step_number_text = "完整项目" if full_project else str(step_index + 1)

    text = chat_completion(
        payload,
        "code_tutor",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习代码陪练 Agent。"
                    "你的回答要像一位耐心的技术导师，不能只给代码，必须解释当前步骤在完整机器学习流程中的作用。"
                    "如果用户请求完整项目代码，必须给出一个可保存为 .py 并直接运行的完整脚本；"
                    "如果用户请求当前步骤，代码要聚焦该步骤但仍能说明它如何接入完整流程。"
                    "代码要可运行、适合课程设计演示；解释要帮助用户能自己复现。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"项目: {project}\n"
                    f"指定模型算法: {model_algorithm}\n"
                    f"生成模式: {generation_mode}\n"
                    f"学习者水平: {learner_level}\n"
                    f"代码风格: {coding_style}\n"
                    f"学习目标: {learning_goal}\n"
                    f"当前步骤序号: {step_number_text}\n"
                    f"当前步骤标题: {step_title}\n\n"
                    "请返回以下 JSON 字段:\n"
                    "- step_title: 当前步骤标题\n"
                    "- step_goal: 本步骤要达成的目标\n"
                    "- generation_mode: step 或 full_project\n"
                    "- model_algorithm: 使用的模型算法\n"
                    "- prerequisites: 运行本步骤前需要具备的前置条件，字符串数组\n"
                    "- code_language: 通常为 python\n"
                    f"- code: {'完整可运行 Python 脚本，必须包含导入、数据读取或示例数据、特征/标签处理、划分、模型训练、预测、评价指标、可读输出和 main 入口' if full_project else '本步骤必要代码，不要给完整项目，只给当前步骤需要的代码'}\n"
                    "- why: 为什么要做这一步\n"
                    "- line_by_line_explanation: 逐行解释，数组元素可以是字符串，也可以是包含 line, explanation 的对象\n"
                    "- key_concepts: 本步骤涉及的关键概念，字符串数组\n"
                    "- expected_output: 运行后应该看到什么结果或现象\n"
                    "- run_checklist: 运行前后检查清单，字符串数组\n"
                    "- common_errors: 2 到 4 个常见错误及排查建议，字符串数组\n"
                    "- try_it_task: 一个让用户动手修改或观察的小练习\n"
                    "- extension_task: 一个进阶练习\n"
                    "- next_step: 下一步应该做什么\n"
                    "- related_actions: 2 到 3 个对象数组，每个对象包含 label, target_view，其中 target_view 只能是 concept、visualize、codeTutor、experiment、diagnose、archive 之一。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("step_title", step_title)
    data.setdefault("generation_mode", generation_mode)
    data.setdefault("model_algorithm", model_algorithm)
    data.setdefault("full_project", full_project)
    data.setdefault("generated_by", "code_tutor")
    return data
