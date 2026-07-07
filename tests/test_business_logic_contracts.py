import unittest
from pathlib import Path

from agents import planner_agent


APP_JS = Path("static/js/app.js").read_text(encoding="utf-8")
STORAGE_JS = Path("static/js/storage.js").read_text(encoding="utf-8")
TEMPLATE_HTML = Path("templates/index.html").read_text(encoding="utf-8")
APP_PY = Path("app.py").read_text(encoding="utf-8")
QA_AGENT = Path("agents/qa_agent.py").read_text(encoding="utf-8")
CONCEPT_AGENT = Path("agents/concept_agent.py").read_text(encoding="utf-8")


def function_body(source: str, name: str) -> str:
    marker = f"function {name}"
    start = source.find(marker)
    if start < 0:
        marker = f"async function {name}"
        start = source.find(marker)
    if start < 0:
        return ""
    brace = source.find("{", start)
    depth = 0
    for index in range(brace, len(source)):
        if source[index] == "{":
            depth += 1
        elif source[index] == "}":
            depth -= 1
            if depth == 0:
                return source[brace + 1 : index]
    return ""


class PlannerBusinessLogicContracts(unittest.TestCase):
    def test_planner_enforces_machine_learning_prerequisite_order(self):
        self.assertTrue(hasattr(planner_agent, "ensure_learning_sequence"))
        plan = planner_agent.ensure_learning_sequence(
            {
                "learning_goal": "完成分类项目",
                "stage_list": [
                    {"name": "先看混淆矩阵", "target_view": "experiment", "primary_topic": "混淆矩阵"},
                    {"name": "再理解特征", "target_view": "concept", "primary_topic": "特征"},
                ],
            },
            level="刚接触机器学习",
            goal="完成分类项目",
            preference="项目实践",
        )

        stages = plan["stage_list"]
        self.assertGreaterEqual(len(stages), 7)
        self.assertEqual([stage["sequence_order"] for stage in stages], list(range(1, len(stages) + 1)))
        self.assertLess(
            next(index for index, stage in enumerate(stages) if "数据" in stage["name"]),
            next(index for index, stage in enumerate(stages) if "模型" in stage["name"]),
        )
        self.assertLess(
            next(index for index, stage in enumerate(stages) if "模型" in stage["name"]),
            next(index for index, stage in enumerate(stages) if "评估" in stage["name"]),
        )
        self.assertTrue(all(stage.get("prerequisite") is not None for stage in stages))

    def test_planner_personalizes_stage_topics_for_different_goals(self):
        regression_plan = planner_agent.ensure_learning_sequence(
            {},
            level="刚接触机器学习",
            goal="完成回归预测课程设计报告",
            preference="代码陪练",
        )
        clustering_plan = planner_agent.ensure_learning_sequence(
            {},
            level="会运行 sklearn 示例",
            goal="学习聚类和算法可视化",
            preference="概念理解",
        )

        regression_topics = [stage["primary_topic"] for stage in regression_plan["stage_list"]]
        clustering_topics = [stage["primary_topic"] for stage in clustering_plan["stage_list"]]
        regression_text = " ".join(
            stage["name"] + stage["goal"] + stage["task"] + stage["practice"] + " ".join(stage["learning_steps"])
            for stage in regression_plan["stage_list"]
        )
        clustering_text = " ".join(
            stage["name"] + stage["goal"] + stage["task"] + stage["practice"] + " ".join(stage["learning_steps"])
            for stage in clustering_plan["stage_list"]
        )

        self.assertNotEqual(regression_topics, clustering_topics)
        self.assertIn("回归", regression_text)
        self.assertIn("MAE", regression_text)
        self.assertIn("聚类", clustering_text)
        self.assertIn("轮廓系数", clustering_text)

    def test_planner_personalizes_same_goal_for_level_and_preference(self):
        beginner_concept_plan = planner_agent.ensure_learning_sequence(
            {},
            level="刚接触机器学习",
            goal="掌握机器学习分类任务",
            preference="概念理解",
        )
        sklearn_code_plan = planner_agent.ensure_learning_sequence(
            {},
            level="会运行 sklearn 示例",
            goal="掌握机器学习分类任务",
            preference="代码陪练",
        )

        beginner_tasks = [stage["task"] for stage in beginner_concept_plan["stage_list"]]
        code_tasks = [stage["task"] for stage in sklearn_code_plan["stage_list"]]
        beginner_text = " ".join(
            stage["name"] + stage["goal"] + stage["task"] + " ".join(stage["learning_steps"])
            for stage in beginner_concept_plan["stage_list"]
        )
        code_text = " ".join(
            stage["name"] + stage["goal"] + stage["task"] + " ".join(stage["learning_steps"])
            for stage in sklearn_code_plan["stage_list"]
        )

        self.assertNotEqual(beginner_tasks, code_tasks)
        self.assertIn("通俗解释", beginner_text)
        self.assertIn("概念", beginner_text)
        self.assertIn("sklearn", code_text)
        self.assertIn("可复现代码", code_text)

    def test_planner_uses_pace_and_weakness_as_real_factors(self):
        fast_math_plan = planner_agent.ensure_learning_sequence(
            {},
            level="有 Python 基础，刚接触机器学习",
            goal="掌握机器学习分类任务",
            preference="概念先行",
            pace="快速入门（3-5 天）",
            weakness="数学概念薄弱",
        )
        deep_code_plan = planner_agent.ensure_learning_sequence(
            {},
            level="有 Python 基础，刚接触机器学习",
            goal="掌握机器学习分类任务",
            preference="代码复现",
            pace="系统深入（3-4 周）",
            weakness="代码实现薄弱",
        )

        fast_text = " ".join(
            stage["task"] + stage["practice"] + " ".join(stage["learning_steps"])
            for stage in fast_math_plan["stage_list"]
        )
        deep_text = " ".join(
            stage["task"] + stage["practice"] + " ".join(stage["learning_steps"])
            for stage in deep_code_plan["stage_list"]
        )

        self.assertNotEqual(fast_text, deep_text)
        self.assertIn("快速", fast_text)
        self.assertIn("数学", fast_text)
        self.assertIn("深入", deep_text)
        self.assertIn("代码", deep_text)
        self.assertIn("factor_summary", fast_math_plan)


class FrontendBusinessLogicContracts(unittest.TestCase):
    def test_core_five_agent_roles_are_explicit(self):
        self.assertIn("CORE_AGENT_ROLES", APP_JS)
        for role in [
            "learning_planner",
            "knowledge_tutor",
            "code_experiment",
            "assessment_diagnosis",
            "review_coach",
        ]:
            self.assertIn(role, APP_JS)
        for label in ["学习规划 Agent", "知识讲解 Agent", "代码实验 Agent", "测评诊断 Agent", "总结复习 Agent"]:
            self.assertIn(label, APP_JS)

    def test_backend_exposes_assessment_and_review_agents(self):
        self.assertTrue(Path("agents/assessment_agent.py").is_file())
        self.assertTrue(Path("agents/review_agent.py").is_file())
        self.assertIn("from agents.assessment_agent import diagnose_assessment", APP_PY)
        self.assertIn("from agents.review_agent import summarize_review", APP_PY)
        self.assertIn('path == "/api/assessment_diagnose"', APP_PY)
        self.assertIn('path == "/api/review_summary"', APP_PY)

    def test_assessment_and_review_records_are_first_class(self):
        for store in ["assessment_records", "review_records"]:
            self.assertIn(f'"{store}"', STORAGE_JS)
            self.assertIn(store, APP_JS)
            self.assertIn(f'value="{store}"', TEMPLATE_HTML)
        self.assertIn("测评诊断", APP_JS)
        self.assertIn("总结复习", APP_JS)

    def test_agent_handoff_context_is_saved_across_core_flow(self):
        self.assertIn("function buildAgentHandoff", APP_JS)
        for function_name in ["submitConceptPractice", "saveCodeNote", "saveExperiment", "saveDiagnosis"]:
            body = function_body(APP_JS, function_name)
            self.assertIn("handoff_context", body)
            self.assertIn("buildAgentHandoff(", body)

    def test_review_summary_uses_local_learning_archive(self):
        self.assertIn("function createLocalReviewSummary", APP_JS)
        self.assertIn("function refreshReviewSummary", APP_JS)
        body = function_body(APP_JS, "refreshDashboard")
        self.assertIn('LocalArchive.getAll("review_records")', body)
        self.assertIn("createLocalReviewSummary", body)
        self.assertIn('LocalArchive.addRecord("review_records"', APP_JS)

    def test_progress_snapshot_contains_active_plan_and_stage_progress(self):
        self.assertIn("function persistActivePlanState", APP_JS)
        self.assertIn("function restoreActivePlanFromState", APP_JS)
        self.assertIn("function sanitizeStoredPlan", APP_JS)
        self.assertIn("active_plan", APP_JS)
        self.assertIn("active_stage_index", APP_JS)
        self.assertIn("stage_progress", APP_JS)
        self.assertIn("sanitizeStoredPlan", function_body(APP_JS, "restoreActivePlanFromState"))
        self.assertIn("persistActivePlanState(", function_body(APP_JS, "markPlanStageDone"))
        self.assertIn("restoreActivePlanFromState()", APP_JS)

    def test_weak_points_and_mastery_are_first_class_archive_stores(self):
        for store in ["weak_points", "mistake_records", "quiz_attempts", "concept_mastery", "stage_progress"]:
            self.assertIn(f'"{store}"', STORAGE_JS)
            self.assertIn(store, APP_JS)
        self.assertIn("function recordLearningSignals", APP_JS)
        self.assertIn("recordLearningSignals(", function_body(APP_JS, "saveConcept"))
        self.assertIn("recordLearningSignals(", function_body(APP_JS, "saveExperiment"))
        self.assertIn("recordLearningSignals(", function_body(APP_JS, "saveDiagnosis"))

    def test_dashboard_and_archive_surface_weak_points(self):
        self.assertIn('LocalArchive.getAll("weak_points")', APP_JS)
        self.assertIn('LocalArchive.getAll("concept_mastery")', APP_JS)
        self.assertIn("薄弱点", APP_JS)
        self.assertIn("掌握度", APP_JS)

    def test_agent_routing_and_learner_profile_are_explicit(self):
        self.assertIn("function buildLearnerProfile", APP_JS)
        self.assertIn("learner_profile", APP_JS)
        self.assertIn("infer_route_agent", QA_AGENT)
        self.assertIn("route_agent = infer_route_agent", QA_AGENT)
        self.assertIn("level_guidance", CONCEPT_AGENT)

    def test_core_flow_has_local_mock_data_without_llm_dependency(self):
        self.assertIn("MOCK_CONCEPT_LESSONS", APP_JS)
        self.assertIn("function createMockLearningPlan", APP_JS)
        self.assertIn("function getRouteProfile", APP_JS)
        self.assertIn("function personalizeRouteTasks", APP_JS)
        self.assertIn("function factorSummary", APP_JS)
        self.assertIn("function getMockConceptLesson", APP_JS)
        self.assertIn("function createMockCodeTutorStep", APP_JS)
        self.assertIn("function createMockFullProjectCode", APP_JS)
        self.assertIn("getRouteProfile(goal, preference)", function_body(APP_JS, "createMockLearningPlan"))
        self.assertIn("personalizeRouteTasks(", function_body(APP_JS, "createMockLearningPlan"))
        self.assertIn("pace", function_body(APP_JS, "createMockLearningPlan"))
        self.assertIn("weakness", function_body(APP_JS, "createMockLearningPlan"))
        self.assertIn("createMockLearningPlan(payload)", function_body(APP_JS, "setupPlanner"))
        self.assertIn("getMockConceptLesson(topic", function_body(APP_JS, "explainConcept"))
        self.assertIn("getOptionalAgentLLMConfig(\"code_tutor\")", function_body(APP_JS, "generateCodeStep"))
        self.assertIn("createMockCodeTutorStep(payload)", function_body(APP_JS, "generateCodeStep"))
        self.assertIn("createMockFullProjectCode(payload)", function_body(APP_JS, "generateFullCode"))

    def test_mock_concept_lesson_personalizes_by_learner_level(self):
        self.assertIn("function personalizeMockConceptLessonByLevel", APP_JS)
        self.assertIn("return personalizeMockConceptLessonByLevel(lesson, learnerProfile)", APP_JS)
        start = APP_JS.find("function personalizeMockConceptLessonByLevel")
        end = APP_JS.find("function getMockConceptLesson")
        personalize_body = APP_JS[start:end]
        self.assertIn("机器学习初学者", personalize_body)
        self.assertIn("会运行 sklearn 示例", personalize_body)
        self.assertIn("正在完成课程设计", personalize_body)
        self.assertIn("level_strategy", personalize_body)
        self.assertIn("difficulty", personalize_body)

    def test_dashboard_prioritizes_learning_route_before_api_configuration(self):
        body = function_body(APP_JS, "getDashboardNextStep")
        self.assertIn("!current.current_goal", body)
        self.assertIn("API", body)
        self.assertLess(body.find("!current.current_goal"), body.find("!isConfigured"))

    def test_concept_save_advances_active_stage_progress(self):
        body = function_body(APP_JS, "saveConcept")
        self.assertIn("updateCurrentStageAfterPractice(", body)
        self.assertIn("appState.concept.topic", body)
        self.assertIn("refreshDashboard()", body)

    def test_agent_collaboration_map_is_visible_outside_settings_form(self):
        self.assertIn('id="agent-flow-map"', TEMPLATE_HTML)
        self.assertIn("renderAgentFlowMap", APP_JS)
        for role in ["learning_planner", "knowledge_tutor", "code_experiment", "assessment_diagnosis", "review_coach"]:
            self.assertIn(f'data-core-agent="{role}"', function_body(APP_JS, "renderAgentFlowMap"))

    def test_concept_practice_submission_persists_progress_and_learning_signals(self):
        self.assertIn("function submitConceptPractice", APP_JS)
        self.assertIn("function calculatePracticeMastery", APP_JS)
        self.assertIn("function upsertWeakPoint", APP_JS)
        self.assertIn("function updateCurrentStageAfterPractice", APP_JS)
        self.assertIn("data-quiz-answer", function_body(APP_JS, "renderQuiz"))
        self.assertIn("data-practice-result", APP_JS)
        body = function_body(APP_JS, "submitConceptPractice")
        self.assertIn('LocalArchive.addRecord("quiz_attempts"', body)
        self.assertIn('LocalArchive.addRecord("concept_mastery"', body)
        self.assertIn("upsertWeakPoint(", body)
        self.assertIn("updateCurrentStageAfterPractice(", body)
        self.assertIn("persistActivePlanState(", function_body(APP_JS, "updateCurrentStageAfterPractice"))


if __name__ == "__main__":
    unittest.main()
