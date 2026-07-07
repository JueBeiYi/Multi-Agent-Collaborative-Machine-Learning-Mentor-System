import unittest
from pathlib import Path

from ml_core.model_trainer import train_classifier
from ml_core.sample_datasets import get_sample_dataset, list_sample_datasets


APP_JS = Path("static/js/app.js").read_text(encoding="utf-8")
TEMPLATE_HTML = Path("templates/index.html").read_text(encoding="utf-8")


def function_body(name: str) -> str:
    marker = f"function {name}"
    start = APP_JS.find(marker)
    if start < 0:
        marker = f"async function {name}"
        start = APP_JS.find(marker)
    if start < 0:
        return ""
    paren = APP_JS.find("(", start)
    paren_depth = 0
    body_start = start
    for index in range(paren, len(APP_JS)):
        if APP_JS[index] == "(":
            paren_depth += 1
        elif APP_JS[index] == ")":
            paren_depth -= 1
            if paren_depth == 0:
                body_start = index
                break
    brace = APP_JS.find("{", body_start)
    depth = 0
    for index in range(brace, len(APP_JS)):
        if APP_JS[index] == "{":
            depth += 1
        elif APP_JS[index] == "}":
            depth -= 1
            if depth == 0:
                return APP_JS[brace + 1 : index]
    return ""


class ExperimentCenterContracts(unittest.TestCase):
    def test_sample_datasets_are_rich_enough_for_training_demo(self):
        datasets = list_sample_datasets()

        self.assertGreaterEqual(len(datasets), 5)
        for meta in datasets:
            with self.subTest(dataset=meta["id"]):
                self.assertGreaterEqual(meta["row_count"], 40)
                self.assertGreaterEqual(meta["feature_count"], 4)
                self.assertGreaterEqual(len(meta.get("focus_points", [])), 3)
                self.assertGreaterEqual(len(meta.get("guide_steps", [])), 3)
                loaded = get_sample_dataset(meta["id"])
                self.assertGreaterEqual(len(loaded["csv_text"].splitlines()) - 1, 40)

    def test_training_models_are_real_not_label_only(self):
        sample = get_sample_dataset("penguins")

        for model_name in ["nearest_centroid", "knn", "decision_tree", "gaussian_nb"]:
            with self.subTest(model=model_name):
                result = train_classifier(
                    csv_text=sample["csv_text"],
                    target_column=sample["target_column"],
                    model_name=model_name,
                )

                self.assertEqual(result["model_name"], model_name)
                self.assertEqual(result["model_detail"]["algorithm_key"], model_name)
                self.assertIn("display_name", result["model_detail"])
                self.assertIn("preprocessing", result)
                self.assertIn("train_size", result["data_summary"])
                self.assertIn("test_size", result["data_summary"])

    def test_training_results_change_with_dataset_content(self):
        iris = get_sample_dataset("iris")
        penguins = get_sample_dataset("penguins")
        iris_result = train_classifier(iris["csv_text"], iris["target_column"], "nearest_centroid")
        penguins_result = train_classifier(penguins["csv_text"], penguins["target_column"], "nearest_centroid")

        self.assertNotEqual(iris_result["data_summary"]["target_distribution"], penguins_result["data_summary"]["target_distribution"])
        self.assertNotEqual(iris_result["metrics"], penguins_result["metrics"])
        self.assertNotEqual(iris_result["confusion_matrix"], penguins_result["confusion_matrix"])

    def test_unsupported_training_model_is_rejected(self):
        sample = get_sample_dataset("iris")

        with self.assertRaisesRegex(ValueError, "暂不支持"):
            train_classifier(sample["csv_text"], sample["target_column"], "svm")

    def test_experiment_ui_exposes_supported_models(self):
        for value in ["nearest_centroid", "knn", "decision_tree", "gaussian_nb"]:
            self.assertIn(f'value="{value}"', TEMPLATE_HTML)
        self.assertIn("model_name: $(\"#model-name\").value", function_body("trainModel"))
        self.assertIn("experimentModelCode", APP_JS)


class AlgorithmVisualizationContracts(unittest.TestCase):
    def test_visualization_marks_precise_and_conceptual_modes(self):
        self.assertIn("function visualAlgorithmBehavior", APP_JS)
        self.assertIn("simulation_mode", function_body("summarizeVisualState"))
        self.assertIn("概念流程演示", function_body("renderVisualInsights"))
        self.assertNotIn("可靠度提示", function_body("visualMetrics"))

    def test_knn_uses_dataset_aware_query_and_deterministic_vote(self):
        self.assertIn("function resolveKnnPrediction", APP_JS)
        self.assertIn("createKnnQuery(dataset, points)", function_body("createKnnState"))
        resolve_body = function_body("resolveKnnPrediction")
        self.assertIn("avgDistance", resolve_body)
        self.assertIn("localeCompare", resolve_body)
        self.assertIn("resolveKnnPrediction", function_body("stepKnnState"))

    def test_decision_tree_splits_are_computed_from_data(self):
        self.assertIn("function findBestTreeSplit", APP_JS)
        self.assertIn("function giniImpurity", APP_JS)
        self.assertIn("function treeLeafRegions", APP_JS)
        self.assertIn("findBestTreeSplit", function_body("stepTreeState"))
        self.assertIn("giniGain", function_body("drawTreeMiniDiagram"))


if __name__ == "__main__":
    unittest.main()
