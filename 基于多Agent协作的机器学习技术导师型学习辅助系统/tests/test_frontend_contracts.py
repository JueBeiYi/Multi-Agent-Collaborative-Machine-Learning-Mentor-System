import unittest
from pathlib import Path


APP_JS = Path("static/js/app.js").read_text(encoding="utf-8")
STORAGE_JS = Path("static/js/storage.js").read_text(encoding="utf-8")
TEMPLATE_HTML = Path("templates/index.html").read_text(encoding="utf-8")
STYLE_CSS = Path("static/css/style.css").read_text(encoding="utf-8")


def function_body(name: str) -> str:
    return function_body_from_source(APP_JS, name)


def function_body_from_source(source: str, name: str) -> str:
    marker = f"function {name}"
    start = source.find(marker)
    if start < 0:
        marker = f"async function {name}"
        start = source.find(marker)
    if start < 0:
        return ""
    paren = source.find("(", start)
    paren_depth = 0
    body_start = start
    for index in range(paren, len(source)):
        if source[index] == "(":
            paren_depth += 1
        elif source[index] == ")":
            paren_depth -= 1
            if paren_depth == 0:
                body_start = index
                break
    brace = source.find("{", body_start)
    depth = 0
    for index in range(brace, len(source)):
        if source[index] == "{":
            depth += 1
        elif source[index] == "}":
            depth -= 1
            if depth == 0:
                return source[brace + 1 : index]
    return ""


class FrontendStabilityContracts(unittest.TestCase):
    def test_training_post_does_not_require_result_agent_config(self):
        body = function_body("trainModel")

        self.assertIn('postJson("/api/train_model"', body)
        self.assertNotIn("postAgentJson", body)
        self.assertNotIn("payload.llm_config", body)

    def test_visual_and_experiment_agent_explanations_are_optional(self):
        self.assertIn("const OPTIONAL_AGENT_REQUEST_TIMEOUT_MS", APP_JS)
        self.assertIn("function withOptionalAgentTimeout", APP_JS)
        self.assertIn("function createLocalVisualExplanation", APP_JS)
        visual_body = function_body("requestVisualExplanation")
        self.assertIn('getOptionalAgentLLMConfig("visual")', visual_body)
        self.assertIn("renderVisualExplanation(createLocalVisualExplanation", visual_body)
        self.assertIn("OPTIONAL_AGENT_REQUEST_TIMEOUT_MS", visual_body)
        self.assertNotIn("postAgentJson", visual_body)

        self.assertNotIn("await requestVisualExplanation", function_body("stepAlgorithmVisual"))
        train_body = function_body("trainModel")
        self.assertIn("await requestExperimentExplanation(trainedData, llmConfig)", train_body)
        self.assertNotIn("requestExperimentExplanation(data, llmConfig);", train_body)
        self.assertLess(
            train_body.find("await requestExperimentExplanation(trainedData, llmConfig)"),
            train_body.find("renderExperiment(data)"),
        )
        self.assertIn("function requestExperimentExplanation", APP_JS)
        experiment_body = function_body("requestExperimentExplanation")
        self.assertIn('postJson("/api/explain_result"', experiment_body)
        self.assertIn("agentRequestTimeoutMs(llmConfig)", experiment_body)
        self.assertNotIn("renderExperiment(data)", experiment_body)
        self.assertIn("return data", experiment_body)
        self.assertNotIn("createExperimentExplanationFallback", experiment_body)
        self.assertNotIn("data.result_explanation =", experiment_body.split("try {", 1)[0])
        self.assertIn("delete data.result_explanation", experiment_body)

        render_body = function_body("renderExperiment(data)")
        self.assertIn("hasUsableResultExplanation(explanation)", render_body)
        self.assertIn("renderResultAgentExplanation(explanation)", render_body)
        self.assertNotIn("function createExperimentExplanationFallback", APP_JS)

    def test_experiment_inputs_invalidate_stale_results(self):
        setup_body = function_body("setupExperiment")
        change_block = setup_body.split('$("#sample-dataset-select").addEventListener("change"', 1)[1].split('$("#load-sample")', 1)[0]

        self.assertIn("loadSampleDataset", change_block)
        self.assertIn("function handleExperimentInputChanged", APP_JS)
        self.assertIn('$("#csv-text").addEventListener("input", handleExperimentInputChanged)', setup_body)
        self.assertIn('$("#target-column").addEventListener("input", handleExperimentInputChanged)', setup_body)
        self.assertIn('$("#model-name").addEventListener("change", handleExperimentInputChanged)', setup_body)

        invalidate_body = function_body("invalidateExperimentOutput")
        self.assertIn("appState.experimentRunId += 1", invalidate_body)
        self.assertIn("appState.experiment = null", invalidate_body)
        self.assertIn("download-experiment-report", invalidate_body)

        train_body = function_body("trainModel")
        self.assertIn("const runId = ++appState.experimentRunId", train_body)
        self.assertIn("if (runId !== appState.experimentRunId) return", train_body)

        load_body = function_body("loadSampleDataset")
        self.assertIn("const loadRunId = appState.experimentRunId", load_body)
        self.assertIn("if (loadRunId !== appState.experimentRunId) return", load_body)

    def test_hash_routing_is_available_for_refreshable_views(self):
        self.assertIn("function setupHashRouting", APP_JS)
        self.assertIn("function viewFromHash", APP_JS)
        self.assertIn('"hashchange"', APP_JS)

    def test_concepts_can_fall_back_when_api_is_unavailable(self):
        self.assertIn("FALLBACK_CONCEPTS", APP_JS)
        self.assertIn("function loadConceptOptions", APP_JS)
        self.assertIn("catch (error)", function_body("loadConceptOptions"))

    def test_archive_and_ask_history_reads_are_guarded(self):
        self.assertIn("catch (error)", function_body("refreshAskHistory"))
        self.assertIn("catch (error)", function_body("refreshArchive"))

    def test_archive_saves_page_snapshots_and_renders_readable_details(self):
        self.assertIn("function buildArchiveViewSnapshot", APP_JS)
        self.assertIn("function collectArchiveFormState", APP_JS)
        self.assertIn("function collectArchiveRenderedPageContent", APP_JS)
        self.assertIn("function collectArchiveVisibleSections", APP_JS)
        self.assertIn('view_snapshot: buildArchiveViewSnapshot("plan"', function_body("setupPlanner"))
        self.assertIn('view_snapshot: buildArchiveViewSnapshot("concept"', function_body("saveConcept"))
        self.assertIn('view_snapshot: buildArchiveViewSnapshot("codeTutor"', function_body("saveCodeNote"))
        self.assertIn('view_snapshot: buildArchiveViewSnapshot("experiment"', function_body("saveExperiment"))
        self.assertIn('view_snapshot: buildArchiveViewSnapshot("diagnose"', function_body("saveDiagnosis"))

        snapshot_body = function_body("buildArchiveViewSnapshot")
        for field in ["full_record", "full_payload", "form_state", "rendered_page", "visible_sections", "storage_policy"]:
            self.assertIn(field, snapshot_body)
        rendered_body = function_body("collectArchiveRenderedPageContent")
        self.assertIn("rendered_html", rendered_body)
        self.assertIn("rendered_text", rendered_body)

        self.assertIn("function renderArchiveReadableDetail", APP_JS)
        self.assertIn("renderArchiveReadableDetail(record)", function_body("renderHistoryReadableContent"))
        self.assertIn("renderArchiveRawDrawer(record)", function_body("renderHistoryReadableContent"))
        self.assertIn("function renderArchiveRawDrawer", APP_JS)
        for renderer in [
            "renderPlanArchiveDetail",
            "renderConceptArchiveDetail",
            "renderCodeArchiveDetail",
            "renderExperimentArchiveDetail",
            "renderDiagnosisArchiveDetail",
        ]:
            self.assertIn(f"function {renderer}", APP_JS)

    def test_archive_history_list_is_scrollable_beside_detail_panel(self):
        self.assertIn("grid-template-columns: 260px minmax(320px, 0.85fr) minmax(420px, 1.15fr)", STYLE_CSS)
        self.assertIn("#archive-record-list", STYLE_CSS)
        self.assertIn("max-height: calc(100vh - 260px)", STYLE_CSS)
        self.assertIn("overflow-y: auto", STYLE_CSS)
        self.assertIn("position: sticky", STYLE_CSS)
        self.assertIn("grid-column: auto", STYLE_CSS)
        self.assertIn(".archive-record-card::before", STYLE_CSS)
        self.assertIn("-webkit-line-clamp: 3", STYLE_CSS)
        self.assertIn(".archive-raw-drawer", STYLE_CSS)
        self.assertIn(".archive-raw-grid", STYLE_CSS)

    def test_archive_overview_and_preview_are_not_crowded(self):
        stats_body = function_body("renderArchiveStats")
        self.assertIn("appState.archiveRecords.length", stats_body)
        self.assertIn("counts.weak_points", stats_body)
        self.assertIn("counts.learning_plans", stats_body)
        self.assertIn("latest?.time", stats_body)
        self.assertNotIn("counts.concept_mastery", stats_body)
        self.assertIn("grid-template-columns: repeat(4, minmax(0, 1fr))", STYLE_CSS)

        card_body = function_body("renderArchiveRecordCard")
        self.assertIn("archive-card-actions", card_body)
        self.assertIn("data-archive-open-full", card_body)
        self.assertIn("-webkit-line-clamp: 3", STYLE_CSS)

        detail_body = function_body("renderArchiveDetail")
        self.assertNotIn("archive-detail-actions", detail_body)
        self.assertNotIn('data-archive-action="open-history"', detail_body)
        self.assertNotIn('data-archive-action="jump"', detail_body)
        self.assertNotIn('data-archive-action="copy-json"', detail_body)
        self.assertNotIn("renderArchiveReadableDetail(record)", detail_body)
        self.assertNotIn("renderArchiveRawDrawer(record)", detail_body)
        self.assertIn("archive-preview-actions", detail_body)
        self.assertIn("data-archive-open-full", detail_body)

    def test_archive_record_can_open_full_history_detail(self):
        self.assertIn("function openArchiveFullRecord", APP_JS)
        setup_body = function_body("setupArchive")
        self.assertIn("[data-archive-open-full]", setup_body)
        self.assertIn("openArchiveFullRecord", setup_body)

        open_body = function_body("openArchiveFullRecord")
        self.assertIn("appState.selectedHistoryRecordId", open_body)
        self.assertIn('navigateToView("history"', open_body)
        self.assertIn("renderHistoryDetailView()", open_body)

    def test_archive_snapshot_keeps_full_generated_result_for_history_detail(self):
        snapshot_body = function_body("buildArchiveViewSnapshot")
        self.assertIn("full_generated_result", snapshot_body)
        self.assertIn("createArchiveGeneratedResultMirror", APP_JS)
        self.assertIn("renderFullGeneratedResultSnapshot", function_body("renderArchiveReadableDetail"))
        self.assertIn("renderArchiveGeneratedStage", APP_JS)

    def test_api_post_has_timeout_and_user_friendly_errors(self):
        body = function_body("postJson")

        self.assertIn("AbortController", body)
        self.assertIn("REQUEST_TIMEOUT_MS", APP_JS)
        self.assertIn("friendlyErrorMessage", body)
        self.assertIn("clearTimeout", body)

    def test_agent_post_rejects_empty_agent_response(self):
        self.assertIn("function ensureAgentResponse", APP_JS)
        self.assertIn("ensureAgentResponse", function_body("postAgentJson"))

    def test_quick_ask_can_collapse_and_restore(self):
        self.assertIn('id="quick-ask-toggle"', TEMPLATE_HTML)
        self.assertIn('aria-expanded="true"', TEMPLATE_HTML)
        self.assertIn("function setupQuickAskCollapse", APP_JS)
        self.assertIn("setupQuickAskCollapse()", function_body("setupOpenAsk"))
        self.assertIn("function setQuickAskCollapsed", APP_JS)
        self.assertIn("ml_tutor_quick_ask_collapsed", APP_JS)

        collapse_body = function_body("setQuickAskCollapsed")
        self.assertIn("quick-ask-shell", collapse_body)
        self.assertIn("collapsed", collapse_body)
        self.assertIn("aria-expanded", collapse_body)
        self.assertIn("localStorage.setItem", collapse_body)

        self.assertIn(".quick-ask-shell.collapsed", STYLE_CSS)
        self.assertIn(".quick-ask-toggle", STYLE_CSS)

    def test_learning_plan_request_uses_planner_timeout(self):
        self.assertIn("const PLANNER_REQUEST_TIMEOUT_MS", APP_JS)
        self.assertIn("async function postAgentJson(url, payload, agentId, options = {})", APP_JS)
        self.assertIn("options", function_body("postAgentJson"))
        planner_body = function_body("setupPlanner")
        self.assertIn("timeoutMs: PLANNER_REQUEST_TIMEOUT_MS", planner_body)

    def test_learning_plan_form_uses_progressive_factors(self):
        self.assertIn('id="learning-pace"', TEMPLATE_HTML)
        self.assertIn('id="learning-weakness"', TEMPLATE_HTML)
        self.assertIn("零基础入门", TEMPLATE_HTML)
        self.assertIn("能独立完成小实验，需要项目提升", TEMPLATE_HTML)
        self.assertIn("学习重点", TEMPLATE_HTML)
        self.assertIn("当前短板", TEMPLATE_HTML)
        self.assertNotIn("<option>想完成课程设计项目</option>", TEMPLATE_HTML)

        planner_body = function_body("setupPlanner")
        self.assertIn('pace: $("#learning-pace").value', planner_body)
        self.assertIn('weakness: $("#learning-weakness").value', planner_body)

    def test_local_storage_current_state_is_guarded(self):
        self.assertIn("function safeLocalStorageGet", STORAGE_JS)
        self.assertIn("try", function_body_from_source(STORAGE_JS, "getCurrentState"))
        self.assertIn("catch (error)", function_body_from_source(STORAGE_JS, "saveCurrentState"))

    def test_empty_inputs_are_blocked_before_agent_calls(self):
        self.assertIn("function requireInputValue", APP_JS)
        self.assertIn("requireInputValue(\"#learning-goal\"", function_body("setupPlanner"))
        self.assertIn("requireInputValue(\"#concept-topic\"", function_body("explainConcept"))
        self.assertIn("requireInputValue(\"#error-message\"", function_body("diagnoseError"))

    def test_concept_topic_source_is_explicit(self):
        self.assertIn('id="concept-topic-source"', TEMPLATE_HTML)
        self.assertIn("function resolveConceptTopicInput", APP_JS)
        self.assertIn("function syncConceptTopicSource", APP_JS)
        self.assertIn("resolveConceptTopicInput()", function_body("explainConcept"))
        self.assertIn("topic_source", function_body("explainConcept"))
        self.assertIn('"input"', function_body("setupConcepts"))
        self.assertIn("syncConceptTopicSource", function_body("setupConcepts"))
        self.assertIn(".concept-source-status", STYLE_CSS)

    def test_unknown_hash_routes_to_user_friendly_404_view(self):
        self.assertIn('"notFound"', APP_JS)
        self.assertIn('id="view-notFound"', TEMPLATE_HTML)
        self.assertIn("notFound", function_body("viewFromHash"))


if __name__ == "__main__":
    unittest.main()
