from __future__ import annotations

import json
from typing import Any

from llm_client import chat_completion, parse_json_answer


VALID_ROUTE_AGENTS = {"qa", "planner", "concept", "visual", "code_tutor", "result", "error", "assessment", "review"}


def infer_route_agent(question: str, page: str = "", page_context: dict | None = None) -> str:
    text = f"{question} {page} {json.dumps(page_context or {}, ensure_ascii=False)}".lower()
    route_rules = [
        ("review", ["复盘", "总结", "复习", "学习档案", "下一轮", "沉淀"]),
        ("assessment", ["薄弱", "掌握度", "错题", "自测", "测评", "学习画像"]),
        ("error", ["报错", "异常", "错误", "traceback", "valueerror", "修复", "diagnose", "debug"]),
        ("code_tutor", ["代码", "python", "sklearn", "fit(", "predict", "运行", "复现", "逐行"]),
        ("result", ["指标", "accuracy", "precision", "recall", "f1", "混淆矩阵", "结果", "实验"]),
        ("planner", ["路线", "计划", "阶段", "怎么学", "学习顺序", "下一步"]),
        ("visual", ["可视化", "画布", "图", "k-means", "knn", "算法过程", "观察"]),
        ("concept", ["概念", "原理", "公式", "为什么", "解释", "区别", "定义"]),
    ]
    for agent_id, keywords in route_rules:
        if any(keyword in text for keyword in keywords):
            return agent_id
    return "qa"


def normalize_route_agent(route_agent: str, question: str, page: str, page_context: dict | None) -> str:
    requested = str(route_agent or "auto").strip()
    if requested in {"", "auto", "自动", "自动分工"}:
        return infer_route_agent(question, page, page_context)
    if requested in VALID_ROUTE_AGENTS:
        return requested
    return infer_route_agent(question, page, page_context)


def route_agent_identity(route_agent: str) -> str:
    return {
        "planner": "学习规划 Agent，重点给出学习顺序、阶段目标和下一步路线。",
        "concept": "知识讲解 Agent，重点按概念、原理、例子、代码、练习分层解释。",
        "visual": "算法可视化 Agent，重点解释图形变化、参数含义和观察重点。",
        "code_tutor": "代码实验 Agent，重点解释代码复现、运行检查和实验连接。",
        "result": "代码实验 Agent，重点解释指标、混淆矩阵和实验改进方向。",
        "error": "测评诊断 Agent，重点把错误转化为原因、修复、验证和防复发清单。",
        "assessment": "测评诊断 Agent，重点汇总错题、掌握度和薄弱点，给出补救动作。",
        "review": "总结复习 Agent，重点基于历史记录生成复习顺序和下一步建议。",
        "qa": "开放问答 Agent，重点直接回答问题并给出可操作学习动作。",
    }.get(route_agent, "开放问答 Agent，重点直接回答问题并给出可操作学习动作。")


def answer_open_question(payload: dict[str, Any]) -> dict[str, Any]:
    question = str(payload.get("question") or "").strip()
    if not question:
        raise ValueError("请先输入你想问的问题。")

    page = str(payload.get("page") or "当前学习页面").strip()
    requested_route_agent = str(payload.get("route_agent") or "auto").strip() or "auto"
    page_context = payload.get("page_context") or {}
    recent_history = payload.get("recent_history") or []
    route_agent = infer_route_agent(question, page, page_context) if requested_route_agent in {"auto", "自动", "自动分工"} else normalize_route_agent(requested_route_agent, question, page, page_context)
    identity = route_agent_identity(route_agent)

    text = chat_completion(
        payload,
        route_agent,
        [
            {
                "role": "system",
                "content": (
                    f"你是机器学习课程设计系统中的{identity}"
                    "你通过开放问答入口服务用户，但必须保持当前被分配 Agent 的职责边界。"
                    "你必须基于用户的问题和当前页面上下文进行生成式推理，不能使用固定话术敷衍。"
                    "回答要适合学习辅助系统界面展示：先直接回答，再解释原因，再给可操作的学习动作。"
                    "如果涉及公式，不要返回 LaTeX 源码，优先使用普通数学符号和可直接展示的表达式。"
                    "如果问题与代码、实验、错误、算法可视化有关，要主动连接到对应学习页面的下一步。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"当前页面: {page}\n"
                    f"当前页面上下文:\n{json.dumps(page_context, ensure_ascii=False, indent=2)}\n\n"
                    f"最近问答摘要:\n{json.dumps(recent_history, ensure_ascii=False, indent=2)}\n\n"
                    f"用户问题: {question}\n\n"
                    "请返回以下 JSON 字段:\n"
                    "- title: 这次回答的简短标题\n"
                    "- direct_answer: 先用 1 到 3 句话直接回答用户\n"
                    "- explanation: 分层解释，语言清楚，不要堆概念\n"
                    "- key_points: 3 到 6 个关键点，字符串数组\n"
                    "- formula_or_rule: 相关公式、判断规则或操作规则；没有公式时给出可执行规则\n"
                    "- example: 一个贴近机器学习学习或课程设计的小例子\n"
                    "- code_hint: 如果适合，给 Python/sklearn 提示或伪代码；不适合则为空字符串\n"
                    "- common_confusions: 2 到 4 个容易混淆的点，字符串数组\n"
                    "- next_steps: 2 到 4 个接下来可以做的学习动作，字符串数组\n"
                    "- follow_up_questions: 2 到 4 个用户可以继续追问的问题，字符串数组\n"
                    "- related_actions: 1 到 3 个对象数组，每个对象包含 label 和 target_view。"
                    "target_view 只能是 ask、concept、visualize、codeTutor、experiment、diagnose、archive 之一。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("title", question[:36])
    data.setdefault("direct_answer", data.get("raw_answer", ""))
    data.setdefault("question", question)
    data.setdefault("page", page)
    data.setdefault("route_agent", route_agent)
    data.setdefault("requested_route_agent", requested_route_agent)
    data.setdefault("generated_by", "qa")
    return data
