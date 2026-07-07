from __future__ import annotations

from datetime import datetime

from llm_client import chat_completion, parse_json_answer


ML_LEARNING_SEQUENCE = [
    {
        "name": "学习画像与问题定义",
        "goal": "明确学习目标、当前基础和要解决的机器学习任务。",
        "task": "说清楚任务类型、数据来源、目标产出和本阶段学习方式。",
        "agent": "学习规划 Agent",
        "target_view": "concept",
        "primary_topic": "机器学习项目流程",
        "learning_steps": [
            "确认这是分类、回归、聚类还是可视化理解任务。",
            "把学习目标拆成概念、代码、实验和复盘四类产出。",
            "记录当前基础，后续解释会按这个水平调整深度。",
        ],
        "practice": "用一句话写出本次要完成的机器学习任务和最终交付物。",
        "success_criteria": ["能区分任务类型。", "能说清楚为什么要学后续每个模块。"],
    },
    {
        "name": "数据理解与特征标签",
        "goal": "理解样本、特征、标签、目标列和数据分布的关系。",
        "task": "围绕特征、标签和目标列完成概念学习，并观察示例数据。",
        "agent": "概念导师 Agent",
        "target_view": "concept",
        "primary_topic": "特征与标签",
        "learning_steps": [
            "理解样本、特征、标签分别是什么。",
            "识别 CSV 中哪些列可以作为特征，哪一列是目标列。",
            "观察类别分布是否均衡，记录可能影响训练的风险。",
        ],
        "practice": "在实验中心载入 Iris 数据，指出 4 个特征列和目标列。",
        "success_criteria": ["能正确识别特征 X 和标签 y。", "能解释目标列选错会带来什么问题。"],
    },
    {
        "name": "数据清洗与训练测试划分",
        "goal": "掌握缺失值、重复行、训练集/测试集划分和数据泄漏的基本规则。",
        "task": "检查数据质量，理解为什么要保留独立测试集。",
        "agent": "代码陪练 Agent",
        "target_view": "codeTutor",
        "primary_topic": "训练集和测试集",
        "learning_steps": [
            "检查缺失值、重复样本和异常列。",
            "把特征 X 与标签 y 分开。",
            "使用 train_test_split 划分训练集和测试集。",
        ],
        "practice": "生成并运行划分训练集/测试集的 sklearn 代码。",
        "success_criteria": ["能解释训练集和测试集各自用途。", "能避免把标签或测试信息泄漏进训练过程。"],
    },
    {
        "name": "基线模型与代码复现",
        "goal": "先用简单模型跑通完整训练流程，建立可比较的基线结果。",
        "task": "创建一个可运行的基线模型，完成 fit、predict 和基础指标输出。",
        "agent": "代码陪练 Agent",
        "target_view": "codeTutor",
        "primary_topic": "基线模型",
        "learning_steps": [
            "选择一个简单可解释的基线模型。",
            "调用 fit 训练模型。",
            "调用 predict 得到测试集预测结果。",
        ],
        "practice": "复现最近质心分类器或 KNN 分类器的最小训练代码。",
        "success_criteria": ["能跑通 fit/predict。", "能说明基线模型的作用不是追求最高分，而是提供比较起点。"],
    },
    {
        "name": "模型训练与评估指标",
        "goal": "理解 Accuracy、Precision、Recall、F1 等指标如何评价模型。",
        "task": "在实验中心训练模型，并解释主要评价指标。",
        "agent": "结果解释 Agent",
        "target_view": "experiment",
        "primary_topic": "Accuracy、Precision、Recall、F1",
        "learning_steps": [
            "训练模型并读取核心指标。",
            "比较 Accuracy、Precision、Recall、F1 的侧重点。",
            "判断指标是否足以支持当前项目结论。",
        ],
        "practice": "完成一次分类实验，并保存实验记录。",
        "success_criteria": ["能解释至少 3 个指标。", "能判断模型表现是否可信。"],
    },
    {
        "name": "混淆矩阵与误差分析",
        "goal": "从错误样本和类别混淆中发现薄弱点，而不是只看总分。",
        "task": "结合混淆矩阵、错误诊断和常见误区进行复盘。",
        "agent": "错误诊断 Agent",
        "target_view": "diagnose",
        "primary_topic": "混淆矩阵与误差分析",
        "learning_steps": [
            "阅读混淆矩阵，找出最容易混淆的类别。",
            "分析可能来自数据、特征、模型还是指标选择的问题。",
            "把错误转化为下一轮学习或实验任务。",
        ],
        "practice": "选择一次实验结果，写出一个最需要改进的错误类型。",
        "success_criteria": ["能从混淆矩阵定位问题。", "能提出至少一个可验证的改进方向。"],
    },
    {
        "name": "调参与项目报告复盘",
        "goal": "沉淀完整学习记录、薄弱点、实验结论和下一步提升方向。",
        "task": "整理学习档案，把概念、代码、实验和诊断串成项目报告线索。",
        "agent": "学习档案模块",
        "target_view": "archive",
        "primary_topic": "学习复盘与课程设计报告",
        "learning_steps": [
            "回顾路线完成情况和未完成阶段。",
            "查看薄弱点、错题、实验记录和诊断记录。",
            "整理项目报告中的方法、结果、问题和改进方向。",
        ],
        "practice": "导出学习档案，并写出下一轮要复习的 3 个主题。",
        "success_criteria": ["能基于记录复盘学习过程。", "能说清楚下一步应该补概念、补代码还是补实验。"],
    },
]


ROUTE_PROFILES = {
    "regression": {
        "recommended_project": "房价或成绩预测回归课程设计",
        "stage_overrides": [
            {
                "name": "回归任务目标与项目流程",
                "goal": "明确要预测的连续数值、输入特征和报告产出。",
                "task": "说清楚预测目标、数值标签、数据来源和最终报告结论。",
                "primary_topic": "回归预测项目流程",
                "practice": "写出一个回归任务的预测目标、输入特征和评价指标。",
            },
            {
                "name": "回归数据理解与目标变量",
                "goal": "理解连续标签、特征分布、异常值和目标变量范围。",
                "task": "检查数值特征、目标变量分布和可能影响预测的异常样本。",
                "primary_topic": "连续标签与特征工程",
                "learning_steps": ["识别连续型目标变量。", "观察特征范围和异常值。", "判断是否需要标准化或变换。"],
                "practice": "指出一个回归数据表中的目标列，并说明它为什么不是分类标签。",
            },
            {
                "name": "回归数据清洗与训练测试划分",
                "goal": "掌握回归任务中的缺失值处理、特征缩放和训练/测试划分。",
                "task": "完成回归数据预处理，并保留独立测试集评估泛化误差。",
                "primary_topic": "回归数据划分与标准化",
                "learning_steps": ["处理缺失值和异常值。", "区分特征 X 与连续标签 y。", "划分训练集和测试集。"],
                "practice": "写出回归任务中的 train_test_split 代码，并说明 random_state 的作用。",
            },
            {
                "name": "线性回归基线与代码复现",
                "goal": "先用 LinearRegression 跑通完整回归训练流程。",
                "task": "创建线性回归或随机森林回归基线，完成 fit、predict 和预测值查看。",
                "primary_topic": "LinearRegression 基线模型",
                "learning_steps": ["选择 LinearRegression 作为可解释基线。", "训练模型并输出预测值。", "记录模型参数和可复现实验设置。"],
                "practice": "复现一个最小 LinearRegression 训练代码片段。",
            },
            {
                "name": "回归指标与结果解释",
                "goal": "理解 MAE、RMSE、R² 如何评价连续值预测结果。",
                "task": "在实验中心训练回归模型，并解释误差指标和拟合质量。",
                "primary_topic": "MAE、RMSE、R²",
                "learning_steps": ["计算 MAE 和 RMSE。", "解释 R² 的含义和局限。", "判断误差是否满足课程设计目标。"],
                "practice": "用 3 句话解释 MAE、RMSE、R² 各自回答什么问题。",
                "success_criteria": ["能解释 MAE 和 RMSE 的区别。", "能判断 R² 高低是否支持项目结论。"],
            },
            {
                "name": "残差分析与误差诊断",
                "goal": "通过残差和异常样本定位回归预测偏差来源。",
                "task": "分析残差分布，判断问题来自数据、特征、模型还是评估方式。",
                "primary_topic": "残差分析",
                "learning_steps": ["观察预测值与真实值差异。", "找出误差最大的样本。", "提出一个可验证的改进方向。"],
                "practice": "写出一次回归预测误差偏大的可能原因和验证办法。",
                "success_criteria": ["能解释残差是什么。", "能提出至少一个减少误差的实验方案。"],
            },
            {
                "name": "回归课程设计报告复盘",
                "goal": "沉淀回归项目的数据、模型、指标、误差分析和改进方向。",
                "task": "整理学习档案，形成可写入课程设计报告的回归实验线索。",
                "primary_topic": "回归项目复盘",
                "practice": "导出学习档案，并写出回归项目报告的结果分析段落提纲。",
            },
        ],
    },
    "clustering": {
        "recommended_project": "K-means 用户分群或鸢尾花聚类观察项目",
        "stage_overrides": [
            {
                "name": "聚类学习目标与无监督任务定义",
                "goal": "明确没有标签时要发现什么样的样本结构。",
                "task": "说清楚聚类任务、输入特征、预期分群和观察产出。",
                "primary_topic": "无监督学习项目流程",
                "practice": "写出一个聚类任务的样本、特征和希望观察到的分组现象。",
            },
            {
                "name": "聚类数据理解与特征缩放",
                "goal": "理解样本相似度、特征尺度和分布对聚类结果的影响。",
                "task": "观察特征范围，判断哪些特征需要缩放后再计算距离。",
                "primary_topic": "特征缩放与样本相似度",
                "learning_steps": ["识别用于聚类的数值特征。", "比较不同特征的取值范围。", "理解标准化为什么会影响距离。"],
                "practice": "说明为什么 K-means 前常常要做 StandardScaler。",
            },
            {
                "name": "距离度量与训练数据准备",
                "goal": "掌握欧氏距离、样本相似度和无监督任务的数据准备方式。",
                "task": "准备只包含特征 X 的训练数据，并理解聚类没有 y 标签。",
                "primary_topic": "距离度量与无监督数据",
                "learning_steps": ["去掉标签列或答案列。", "构造聚类特征矩阵 X。", "理解欧氏距离如何衡量样本接近程度。"],
                "practice": "写出只使用特征矩阵 X 进行聚类的最小代码。",
            },
            {
                "name": "K-means 基线与可视化观察",
                "goal": "用 K-means 跑通聚类流程，并通过可视化理解中心点迭代。",
                "task": "进入算法可视化页面，观察簇中心如何移动和收敛。",
                "target_view": "visualize",
                "primary_topic": "K-means",
                "learning_steps": ["选择 K-means 可视化。", "观察样本分配到最近中心点。", "记录中心点更新和收敛过程。"],
                "practice": "解释 K 值变化会怎样影响聚类结果。",
            },
            {
                "name": "聚类效果评估与轮廓系数",
                "goal": "理解肘部法、轮廓系数和可视化观察如何评价聚类结果。",
                "task": "比较不同 K 值下的聚类效果，判断分组是否合理。",
                "target_view": "visualize",
                "primary_topic": "轮廓系数与肘部法",
                "learning_steps": ["比较不同 K 值。", "理解轮廓系数代表簇内紧密和簇间分离。", "结合图形判断聚类是否稳定。"],
                "practice": "说明轮廓系数较低时可能意味着什么。",
                "success_criteria": ["能解释轮廓系数。", "能根据可视化判断 K 值是否合理。"],
            },
            {
                "name": "簇解释与异常样本分析",
                "goal": "把聚类结果转化为可解释的群体画像和异常点分析。",
                "task": "分析每个簇的特征均值、边界样本和可能的业务含义。",
                "primary_topic": "簇解释与异常样本",
                "learning_steps": ["给每个簇命名。", "比较簇间特征差异。", "记录难以归类或远离中心的样本。"],
                "practice": "为一个聚类结果写出 2 个簇的解释标签。",
            },
            {
                "name": "聚类观察报告复盘",
                "goal": "沉淀无监督学习过程、K 值选择、可视化证据和下一步实验。",
                "task": "整理学习档案，形成聚类项目观察报告。",
                "primary_topic": "聚类项目复盘",
                "practice": "导出学习档案，并写出聚类报告的观察结论和局限。",
            },
        ],
    },
}


def ensure_learning_sequence(
    data: dict,
    level: str,
    goal: str,
    preference: str,
    pace: str = "标准路线（1-2 周）",
    weakness: str = "暂不确定",
) -> dict:
    plan = data if isinstance(data, dict) else {}
    llm_stages = plan.get("stage_list") if isinstance(plan.get("stage_list"), list) else []
    profile = _route_profile(goal, preference)
    canonical_stages = []
    for index, template in enumerate(ML_LEARNING_SEQUENCE):
        merged = _merge_canonical_stage(template, llm_stages, index)
        merged = _apply_route_profile(merged, profile, index, level, preference, pace, weakness)
        merged["sequence_order"] = index + 1
        merged["prerequisite"] = "无" if index == 0 else canonical_stages[index - 1]["name"]
        merged["learner_level"] = level
        merged["mastery_focus"] = _mastery_focus_for_stage(merged)
        canonical_stages.append(merged)

    completed_count = sum(1 for stage in canonical_stages if stage.get("completed"))
    progress = round((completed_count / len(canonical_stages)) * 100) if canonical_stages else 0
    first_open = next((stage for stage in canonical_stages if not stage.get("completed")), canonical_stages[-1])

    plan.update(
        {
            "learning_goal": plan.get("learning_goal") or goal,
            "learner_level": plan.get("learner_level") or level,
            "preference": plan.get("preference") or preference,
            "learning_pace": plan.get("learning_pace") or pace,
            "weakness_focus": plan.get("weakness_focus") or weakness,
            "factor_summary": plan.get("factor_summary") or _factor_summary(level, preference, pace, weakness),
            "current_stage": first_open["name"],
            "progress": progress,
            "next_step": first_open["practice"],
            "recommended_project": plan.get("recommended_project") or profile["recommended_project"],
            "stage_list": canonical_stages,
            "route_model": f"adaptive_ml_sequence_{profile['kind']}_v2",
        }
    )
    return plan


def _route_profile(goal: str, preference: str) -> dict:
    text = f"{goal} {preference}".lower()
    if "回归" in text or "regression" in text or "预测数值" in text or "房价" in text:
        kind = "regression"
    elif "聚类" in text or "clustering" in text or "k-means" in text or "无监督" in text or "分群" in text:
        kind = "clustering"
    else:
        kind = "classification"
    return {
        "kind": kind,
        "recommended_project": ROUTE_PROFILES.get(kind, {}).get("recommended_project") or _recommended_project(goal, preference),
        "stage_overrides": ROUTE_PROFILES.get(kind, {}).get("stage_overrides", []),
    }


def _apply_route_profile(
    stage: dict,
    profile: dict,
    index: int,
    level: str,
    preference: str,
    pace: str = "标准路线（1-2 周）",
    weakness: str = "暂不确定",
) -> dict:
    override = profile["stage_overrides"][index] if index < len(profile["stage_overrides"]) else {}
    personalized = {**stage, **override}
    personalized["task"] = _personalize_task(
        personalized["task"],
        level,
        preference,
        personalized.get("target_view", ""),
        pace,
        weakness,
    )
    personalized["learning_steps"] = _unique_list(override.get("learning_steps") or personalized.get("learning_steps") or [])
    personalized["success_criteria"] = _unique_list(override.get("success_criteria") or personalized.get("success_criteria") or [])
    personalized["related_pages"] = _unique_list(override.get("related_pages") or _related_pages_for_stage(personalized))

    preference_step = _preference_step(preference, personalized)
    if preference_step:
        personalized["learning_steps"] = _unique_list([*personalized["learning_steps"], preference_step])
    level_step = _level_step(level)
    if level_step and index < 2:
        personalized["learning_steps"] = _unique_list([level_step, *personalized["learning_steps"]])
    pace_step = _pace_step(pace)
    if pace_step:
        personalized["learning_steps"] = _unique_list([*personalized["learning_steps"], pace_step])
    weakness_step = _weakness_step(weakness, personalized)
    if weakness_step:
        personalized["learning_steps"] = _unique_list([*personalized["learning_steps"], weakness_step])
    return personalized


def _personalize_task(
    task: str,
    level: str,
    preference: str,
    target_view: str,
    pace: str = "标准路线（1-2 周）",
    weakness: str = "暂不确定",
) -> str:
    focus = []
    if ("零基础" in level or "刚接触" in level or "初学" in level) and target_view == "concept":
        focus.append("先用通俗解释、类比和小练习建立理解")
    if ("会运行" in level or "sklearn" in level) and target_view in {"codeTutor", "experiment", "diagnose"}:
        focus.append("直接对照 sklearn 输入输出检查每一步")
    if ("独立完成" in level or "项目提升" in level) and target_view in {"experiment", "diagnose", "archive"}:
        focus.append("把阶段产出沉淀成可展示的项目证据")
    if "代码" in preference and target_view in {"codeTutor", "experiment", "diagnose", "visualize"}:
        focus.append("沉淀可复现代码和调试记录")
    if "概念" in preference and target_view in {"concept", "visualize"}:
        focus.append("补充概念层解释和自测")
    if "实验" in preference and target_view in {"experiment", "diagnose", "visualize"}:
        focus.append("记录实验现象、指标变化和改进假设")
    if ("课程设计" in preference or "答辩" in preference or "报告" in preference) and target_view in {"experiment", "diagnose", "archive", "codeTutor"}:
        focus.append("保留可写进报告和答辩的目标、过程、结果、局限")
    if "快速" in pace:
        focus.append("按快速路线优先完成最小闭环")
    elif "深入" in pace or "系统" in pace:
        focus.append("按系统深入路线补充原理解释、边界条件和对比实验")
    if "数学" in weakness and target_view in {"concept", "experiment", "visualize"}:
        focus.append("用数值小例子解释公式和指标含义")
    if "代码" in weakness and target_view in {"codeTutor", "experiment", "diagnose"}:
        focus.append("先复现模板代码，再只改一个变量观察结果")
    if "实验" in weakness and target_view in {"experiment", "diagnose", "visualize"}:
        focus.append("强化指标记录、错误样本和下一轮假设")
    if "报告" in weakness and target_view in {"archive", "experiment", "diagnose"}:
        focus.append("把结论整理成报告可用的三句话")
    if not focus:
        return task
    return f"{task}重点: {'；'.join(_unique_list(focus))}。"


def _preference_step(preference: str, stage: dict) -> str:
    if "代码" in preference and stage.get("target_view") in {"codeTutor", "experiment", "visualize"}:
        return "把本阶段操作整理成可复现代码或可复现实验步骤。"
    if "概念" in preference and stage.get("target_view") in {"concept", "visualize"}:
        return "先用自己的话复述概念，再进入代码或实验。"
    if "实验" in preference and stage.get("target_view") in {"experiment", "diagnose", "visualize"}:
        return "记录实验现象、指标变化和可验证的改进假设。"
    if ("课程设计" in preference or "答辩" in preference or "报告" in preference) and stage.get("target_view") in {"experiment", "diagnose", "archive", "codeTutor"}:
        return "保留目标、代码、指标、错误分析和结论，方便写入报告或答辩。"
    return ""


def _level_step(level: str) -> str:
    if "零基础" in level or "刚接触" in level or "初学" in level:
        return "先看通俗解释和小例子，再进入术语和代码。"
    if "会运行" in level or "sklearn" in level:
        return "直接对照 sklearn 流程检查每一步输入输出。"
    if "独立完成" in level or "项目提升" in level or "课程设计" in level:
        return "每个阶段都保留可写入课程设计报告的记录。"
    return ""


def _pace_step(pace: str) -> str:
    if "快速" in pace:
        return "快速路线: 本阶段只保留必须完成的概念、代码和练习，先跑通最小学习闭环。"
    if "深入" in pace or "系统" in pace:
        return "系统深入路线: 本阶段额外补充原理、边界条件和一个对比实验。"
    return "按标准节奏完成概念理解、代码复现、练习保存和阶段复盘。"


def _weakness_step(weakness: str, stage: dict) -> str:
    target_view = stage.get("target_view")
    if "数学" in weakness and target_view in {"concept", "experiment", "visualize"}:
        return "用图示、类比或数值小例子补齐本阶段涉及的数学概念。"
    if "代码" in weakness and target_view in {"codeTutor", "experiment", "diagnose"}:
        return "先复现模板代码，再修改一个参数并记录输出变化。"
    if "实验" in weakness and target_view in {"experiment", "diagnose", "visualize"}:
        return "记录指标变化、错误样本和下一轮实验假设。"
    if "报告" in weakness and target_view in {"archive", "experiment", "diagnose"}:
        return "把本阶段目标、方法、结果和局限整理成报告可用表述。"
    return ""


def _factor_summary(level: str, preference: str, pace: str, weakness: str) -> str:
    return f"基础: {level} | 重点: {preference} | 节奏: {pace} | 短板: {weakness}"


def _unique_list(values: list) -> list:
    result = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def _merge_canonical_stage(template: dict, llm_stages: list, index: int) -> dict:
    candidate = _find_matching_llm_stage(template, llm_stages, index)
    merged = {
        **template,
        "task": candidate.get("task") or template["task"],
        "practice": candidate.get("practice") or template["practice"],
        "success_criteria": candidate.get("success_criteria") or template["success_criteria"],
        "related_pages": candidate.get("related_pages") or _related_pages_for_stage(template),
        "completed": bool(candidate.get("completed")),
    }
    if candidate.get("learning_steps"):
        merged["learning_steps"] = candidate["learning_steps"]
    return merged


def _find_matching_llm_stage(template: dict, llm_stages: list, index: int) -> dict:
    if index < len(llm_stages) and isinstance(llm_stages[index], dict):
        positional = llm_stages[index]
    else:
        positional = {}
    topic = template["primary_topic"]
    target = template["target_view"]
    for stage in llm_stages:
        if not isinstance(stage, dict):
            continue
        text = f"{stage.get('name', '')} {stage.get('primary_topic', '')} {stage.get('goal', '')}"
        if topic in text or stage.get("target_view") == target:
            return stage
    return positional


def _related_pages_for_stage(stage: dict) -> list[str]:
    target = stage["target_view"]
    related = {
        "concept": ["concept", "codeTutor", "experiment"],
        "codeTutor": ["codeTutor", "experiment", "diagnose"],
        "experiment": ["experiment", "diagnose", "archive"],
        "diagnose": ["diagnose", "concept", "archive"],
        "archive": ["archive", "plan", "ask"],
    }
    return related.get(target, [target, "ask"])


def _mastery_focus_for_stage(stage: dict) -> list[str]:
    return [
        stage["primary_topic"],
        *(stage.get("success_criteria") or [])[:2],
    ]


def _recommended_project(goal: str, preference: str) -> str:
    if "回归" in goal:
        return "房价或成绩预测回归项目"
    if "聚类" in goal:
        return "用户分群或鸢尾花聚类观察项目"
    if "课程设计" in goal or "课程设计" in preference or "答辩" in preference or "报告" in preference:
        return "可复现的 CSV 分类实验课程设计"
    return "Iris 鸢尾花分类项目"


def generate_learning_plan(payload: dict) -> dict:
    level = (payload.get("level") or "有 Python 基础，刚接触机器学习").strip()
    goal = (payload.get("goal") or "掌握机器学习分类任务").strip()
    preference = (payload.get("preference") or "概念先行").strip()
    pace = (payload.get("pace") or "标准路线（1-2 周）").strip()
    weakness = (payload.get("weakness") or "暂不确定").strip()

    text = chat_completion(
        payload,
        "planner",
        [
            {
                "role": "system",
                "content": (
                    "你是机器学习课程设计系统中的学习规划 Agent。"
                    "请生成可点击、可执行、能直接引导用户进入系统页面学习的学习路线。"
                    "每个阶段都要明确: 学什么、为什么学、怎么学、去哪个页面学、完成标准是什么。"
                    "路线必须遵循机器学习先修顺序: 问题定义 -> 数据理解 -> 特征/标签 -> 数据清洗与训练测试划分 -> 基线模型 -> 训练与评估 -> 误差分析 -> 复盘报告。"
                    "必须只返回 JSON，不要 Markdown。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"学习者基础: {level}\n"
                    f"学习目标: {goal}\n"
                    f"学习重点: {preference}\n"
                    f"学习节奏: {pace}\n"
                    f"当前短板: {weakness}\n\n"
                    "请让学习节奏和当前短板真实影响每个阶段的任务、学习步骤和练习深度。\n"
                    "请返回以下 JSON 字段: "
                    "learning_goal, learner_level, preference, learning_pace, weakness_focus, factor_summary, current_stage, progress, next_step, "
                    "recommended_project, stage_list。\n"
                    "stage_list 是 7 个对象数组。每个阶段对象必须包含:\n"
                    "- name: 阶段名称\n"
                    "- goal: 阶段目标\n"
                    "- task: 主要实践任务\n"
                    "- agent: 负责 Agent 名称\n"
                    "- target_view: 页面跳转目标，只能是 concept、visualize、codeTutor、experiment、diagnose、archive 之一\n"
                    "- primary_topic: 进入页面时应预填的核心知识点或任务名\n"
                    "- learning_steps: 3 到 5 个具体学习步骤，字符串数组\n"
                    "- practice: 该阶段需要完成的小练习\n"
                    "- success_criteria: 2 到 4 条完成标准，字符串数组\n"
                    "- related_pages: 可以继续学习的页面数组，元素同 target_view 可选值\n"
                    "progress 是 0-100 的数字。"
                ),
            },
        ],
    )
    data = parse_json_answer(text)
    data.setdefault("learning_goal", goal)
    data.setdefault("learner_level", level)
    data.setdefault("preference", preference)
    data.setdefault("created_at", datetime.now().strftime("%Y-%m-%d %H:%M"))
    data.setdefault("generated_by", "planner")
    return ensure_learning_sequence(data, level, goal, preference, pace, weakness)
