import json
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer

import app
import llm_client
from app import AppHandler
from llm_client import LLMError
from ml_core.sample_datasets import get_sample_dataset


class AppServerCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), AppHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_address[1]}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)

    def post_json(self, path, payload):
        request = urllib.request.Request(
            self.base_url + path,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=5) as response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_missing_browser_route_returns_html_404_page(self):
        with self.assertRaises(urllib.error.HTTPError) as raised:
            urllib.request.urlopen(self.base_url + "/missing-route-for-browser", timeout=5)

        error = raised.exception
        try:
            body = error.read().decode("utf-8")
        finally:
            error.close()
        self.assertEqual(error.code, 404)
        self.assertIn("text/html", error.headers.get("Content-Type", ""))
        self.assertIn("页面不存在", body)
        self.assertIn("返回首页", body)

    def test_aborted_client_write_does_not_raise_from_json_sender(self):
        class AbortedWriter:
            def write(self, body):
                raise ConnectionAbortedError("client closed")

        handler = object.__new__(AppHandler)
        handler.wfile = AbortedWriter()
        handler.send_response = lambda *args, **kwargs: None
        handler.send_header = lambda *args, **kwargs: None
        handler.end_headers = lambda *args, **kwargs: None

        handler._send_json({"ok": True, "data": {"message": "slow planner response"}})

    def test_train_model_succeeds_without_llm_config(self):
        sample = get_sample_dataset("iris")

        status, body = self.post_json(
            "/api/train_model",
            {
                "csv_text": sample["csv_text"],
                "target_column": sample["target_column"],
                "model_name": "nearest_centroid",
            },
        )

        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        data = body["data"]
        self.assertEqual(data["task_type"], "classification")
        self.assertIn("accuracy", data["metrics"])
        self.assertNotIn("result_explanation", data)

    def test_train_model_does_not_block_on_result_agent_config(self):
        sample = get_sample_dataset("iris")
        original = app.explain_result

        def fail_if_called(*args, **kwargs):
            raise AssertionError("train_model should not call result agent inline")

        app.explain_result = fail_if_called
        try:
            status, body = self.post_json(
                "/api/train_model",
                {
                    "csv_text": sample["csv_text"],
                    "target_column": sample["target_column"],
                    "model_name": "nearest_centroid",
                    "llm_config": {
                        "base_url": "https://example.invalid/v1",
                        "model": "demo-model",
                    },
                },
            )
        finally:
            app.explain_result = original

        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        self.assertNotIn("result_explanation", body["data"])

    def test_assessment_diagnose_succeeds_without_llm_config(self):
        status, body = self.post_json(
            "/api/assessment_diagnose",
            {
                "learner_profile": {"level": "机器学习初学者", "goal": "完成分类项目"},
                "concept_mastery": [
                    {"concept": "特征与标签", "mastery_score": 0.45, "mastery_label": "薄弱"},
                    {"concept": "训练集和测试集", "mastery_score": 0.68, "mastery_label": "需要复习"},
                ],
                "quiz_attempts": [
                    {"concept": "特征与标签", "result": "薄弱", "question": "为什么标签不能放进特征？"}
                ],
                "experiment_records": [
                    {"model_name": "nearest_centroid", "metrics": {"accuracy": 0.72, "macro_f1": 0.69}}
                ],
            },
        )

        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        data = body["data"]
        self.assertEqual(data["generated_by"], "assessment")
        self.assertIn("weak_points", data)
        self.assertIn("recommended_actions", data)

    def test_review_summary_succeeds_without_llm_config(self):
        status, body = self.post_json(
            "/api/review_summary",
            {
                "learner_profile": {"level": "机器学习初学者", "goal": "完成分类项目"},
                "learning_records": [{"topic": "特征与标签", "status": "需要复习"}],
                "weak_points": [{"concept": "特征与标签", "severity": "高"}],
                "concept_mastery": [{"concept": "特征与标签", "mastery_score": 0.45}],
                "stage_progress": [{"active_stage": "学习特征与标签", "progress": 33}],
            },
        )

        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        data = body["data"]
        self.assertEqual(data["generated_by"], "review")
        self.assertIn("review_summary", data)
        self.assertIn("next_actions", data)


class LLMClientCase(unittest.TestCase):
    def test_llm_connection_rejects_non_json_response(self):
        original = llm_client.chat_completion
        llm_client.chat_completion = lambda *args, **kwargs: "plain text response"
        try:
            with self.assertRaises(LLMError):
                llm_client.test_llm_connection(
                    {
                        "llm_config": {
                            "base_url": "https://example.invalid/v1",
                            "model": "demo-model",
                        }
                    }
                )
        finally:
            llm_client.chat_completion = original

    def test_llm_transport_timeout_becomes_llm_error(self):
        original = llm_client.urllib.request.urlopen

        def raise_timeout(*args, **kwargs):
            raise TimeoutError("timed out")

        llm_client.urllib.request.urlopen = raise_timeout
        try:
            with self.assertRaisesRegex(LLMError, "超时|无法连接"):
                llm_client.chat_completion(
                    {
                        "llm_config": {
                            "base_url": "https://example.invalid/v1",
                            "model": "demo-model",
                            "timeout": 5,
                        }
                    },
                    "visual",
                    [{"role": "user", "content": "hello"}],
                )
        finally:
            llm_client.urllib.request.urlopen = original


if __name__ == "__main__":
    unittest.main()
