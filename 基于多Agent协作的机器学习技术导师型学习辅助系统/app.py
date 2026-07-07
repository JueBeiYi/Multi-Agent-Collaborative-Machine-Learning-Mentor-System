from __future__ import annotations

import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from agents.assessment_agent import diagnose_assessment
from agents.code_tutor_agent import generate_code_tutor_step
from agents.concept_agent import CONCEPTS, explain_concept
from agents.error_agent import diagnose_error
from agents.planner_agent import generate_learning_plan
from agents.qa_agent import answer_open_question
from agents.result_agent import explain_result
from agents.review_agent import summarize_review
from agents.visual_agent import explain_visual_step
from config import HOST, PORT
from llm_client import LLMError, test_llm_connection
from ml_core.model_trainer import train_classifier
from ml_core.sample_datasets import get_sample_dataset, list_sample_datasets


BASE_DIR = Path(__file__).resolve().parent
CLIENT_DISCONNECT_ERRORS = (BrokenPipeError, ConnectionAbortedError, ConnectionResetError)


class AppHandler(BaseHTTPRequestHandler):
    server_version = "MLTutorDemo/0.2"

    def log_message(self, fmt: str, *args: object) -> None:
        print("%s - - [%s] %s" % (self.address_string(), self.log_date_time_string(), fmt % args))

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)
        if path == "/":
            self._send_file(BASE_DIR / "templates" / "index.html", "text/html; charset=utf-8")
            return
        if path == "/api/concepts":
            self._send_json({"concepts": sorted(CONCEPTS)})
            return
        if path == "/api/sample_datasets":
            self._send_json({"datasets": list_sample_datasets()})
            return
        if path == "/api/sample_dataset":
            sample_id = (query.get("id") or ["iris"])[0]
            try:
                self._send_json(get_sample_dataset(sample_id))
            except ValueError as exc:
                self._send_error(404, str(exc))
            return
        if path.startswith("/static/") or path.startswith("/data/"):
            self._send_static(path)
            return
        if path.startswith("/api/"):
            self._send_error(404, "未找到接口")
            return
        self._send_not_found_page()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        try:
            payload = self._read_json()
            if path == "/api/test_llm":
                result = test_llm_connection(payload)
            elif path == "/api/learning_plan":
                result = generate_learning_plan(payload)
            elif path == "/api/concept_explain":
                result = explain_concept(payload)
            elif path == "/api/code_tutor":
                result = generate_code_tutor_step(payload)
            elif path == "/api/visual_explain":
                result = explain_visual_step(payload)
            elif path == "/api/error_diagnose":
                result = diagnose_error(payload)
            elif path == "/api/assessment_diagnose":
                result = diagnose_assessment(payload)
            elif path == "/api/review_summary":
                result = summarize_review(payload)
            elif path == "/api/open_question":
                result = answer_open_question(payload)
            elif path == "/api/train_model":
                result = train_classifier(
                    csv_text=payload.get("csv_text", ""),
                    target_column=payload.get("target_column", "target"),
                    model_name=payload.get("model_name", "nearest_centroid"),
                )
            elif path == "/api/explain_result":
                result = explain_result(payload, payload)
            else:
                self._send_error(404, "未找到接口")
                return
            self._send_json({"ok": True, "data": result})
        except LLMError as exc:
            self._send_json({"ok": False, "error": str(exc)}, status=400)
        except ValueError as exc:
            self._send_json({"ok": False, "error": str(exc)}, status=400)
        except Exception as exc:
            self._send_json({"ok": False, "error": f"服务端处理失败: {exc}"}, status=500)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8")
        if not raw:
            return {}
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError("请求体不是合法 JSON") from exc
        if not isinstance(data, dict):
            raise ValueError("请求 JSON 必须是对象")
        return data

    def _send_json(self, data: object, status: int = 200) -> None:
        body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
        except CLIENT_DISCONNECT_ERRORS:
            return

    def _send_error(self, status: int, message: str) -> None:
        self._send_json({"ok": False, "error": message}, status=status)

    def _send_not_found_page(self) -> None:
        body = """<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面不存在 - 机器学习技术导师</title>
    <style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f8fb; color: #102027; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
      section { width: min(680px, 100%); padding: 36px; border: 1px solid #dbe3ea; border-radius: 8px; background: white; box-shadow: 0 16px 40px rgba(16, 32, 39, 0.08); }
      p { color: #5f6f7a; line-height: 1.7; }
      a { display: inline-block; margin-top: 10px; padding: 10px 16px; border-radius: 8px; background: #0f766e; color: white; text-decoration: none; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <strong>404</strong>
        <h1>页面不存在</h1>
        <p>这个地址暂时没有对应的学习模块。请返回首页，再从学习路线或功能导航继续。</p>
        <a href="/">返回首页</a>
      </section>
    </main>
  </body>
</html>
"""
        encoded = body.encode("utf-8")
        try:
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(encoded)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(encoded)
        except CLIENT_DISCONNECT_ERRORS:
            return

    def _send_static(self, request_path: str) -> None:
        safe_relative = unquote(request_path).lstrip("/")
        full_path = (BASE_DIR / safe_relative).resolve()
        if not str(full_path).startswith(str(BASE_DIR)) or not full_path.is_file():
            self._send_error(404, "静态文件不存在")
            return
        content_type = mimetypes.guess_type(str(full_path))[0] or "application/octet-stream"
        if full_path.suffix in {".js", ".css", ".html", ".csv"}:
            content_type += "; charset=utf-8"
        self._send_file(full_path, content_type)

    def _send_file(self, path: Path, content_type: str) -> None:
        if not path.is_file():
            self._send_error(404, "文件不存在")
            return
        body = path.read_bytes()
        try:
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except CLIENT_DISCONNECT_ERRORS:
            return

def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Demo server running at http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
