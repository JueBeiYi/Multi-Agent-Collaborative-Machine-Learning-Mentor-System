from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any


@dataclass
class LLMConfig:
    base_url: str
    model: str
    api_key: str = ""
    temperature: float = 0.4
    timeout: int = 60


class LLMError(ValueError):
    pass


def get_llm_config(payload: dict[str, Any], agent_id: str) -> LLMConfig:
    raw = payload.get("llm_config") or {}
    if not isinstance(raw, dict):
        raise LLMError("请先在 API 设置中配置大模型接口。")

    if "base_url" in raw or "model" in raw:
        source = raw
    else:
        use_unified = bool(raw.get("use_unified", True))
        shared = raw.get("shared") or raw.get("common") or {}
        agents = raw.get("agents") or {}
        source = shared if use_unified else (agents.get(agent_id) or shared)

    base_url = str(source.get("base_url") or "").strip()
    model = str(source.get("model") or "").strip()
    api_key = str(source.get("api_key") or "").strip()
    if not base_url or not model:
        raise LLMError(f"请先为 {agent_id} 配置 API 地址和模型名称。")

    try:
        temperature = float(source.get("temperature", 0.4))
    except (TypeError, ValueError):
        temperature = 0.4
    try:
        timeout = int(source.get("timeout", 60))
    except (TypeError, ValueError):
        timeout = 60

    return LLMConfig(
        base_url=base_url,
        model=model,
        api_key=api_key,
        temperature=max(0.0, min(2.0, temperature)),
        timeout=max(5, min(180, timeout)),
    )


def chat_completion(
    payload: dict[str, Any],
    agent_id: str,
    messages: list[dict[str, str]],
    *,
    expect_json: bool = True,
) -> str:
    config = get_llm_config(payload, agent_id)
    request_body: dict[str, Any] = {
        "model": config.model,
        "messages": messages,
        "temperature": config.temperature,
    }

    data = json.dumps(request_body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        _chat_url(config.base_url),
        data=data,
        headers=_headers(config),
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=config.timeout) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise LLMError(f"大模型接口返回 HTTP {exc.code}: {detail[:500]}") from exc
    except TimeoutError as exc:
        raise LLMError("大模型接口请求超时，请检查网络或模型接口状态。") from exc
    except urllib.error.URLError as exc:
        raise LLMError(f"无法连接大模型接口: {exc.reason}") from exc
    except OSError as exc:
        raise LLMError(f"无法连接大模型接口: {exc}") from exc

    try:
        result = json.loads(raw)
        return result["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
        raise LLMError(f"大模型接口返回格式不是 Chat Completions 兼容格式: {raw[:500]}") from exc


def parse_json_answer(text: str) -> dict[str, Any]:
    cleaned = _strip_json_fence(text.strip())
    try:
        value = json.loads(cleaned)
        if isinstance(value, dict):
            return value
    except json.JSONDecodeError:
        pass

    match = _find_json_object(cleaned)
    if match:
        try:
            value = json.loads(match)
            if isinstance(value, dict):
                return value
        except json.JSONDecodeError:
            pass

    return {"raw_answer": text.strip()}


def test_llm_connection(payload: dict[str, Any]) -> dict[str, Any]:
    text = chat_completion(
        payload,
        payload.get("agent_id", "planner"),
        [
            {"role": "system", "content": "你是一个接口连通性测试助手。请只返回 JSON。"},
            {"role": "user", "content": '返回 {"status":"ok","message":"连接成功"}。'},
        ],
        expect_json=True,
    )
    data = parse_json_answer(text)
    if "raw_answer" in data:
        raise LLMError("大模型连通性测试未返回合法 JSON，请检查模型是否支持按要求输出 JSON。")
    data.setdefault("status", "ok")
    data.setdefault("message", "连接成功")
    return data


def _chat_url(base_url: str) -> str:
    url = base_url.strip().rstrip("/")
    if url.endswith("/chat/completions"):
        return url
    return f"{url}/chat/completions"


def _headers(config: LLMConfig) -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if config.api_key:
        headers["Authorization"] = f"Bearer {config.api_key}"
    return headers


def _strip_json_fence(text: str) -> str:
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _find_json_object(text: str) -> str | None:
    start = text.find("{")
    if start < 0:
        return None
    depth = 0
    in_string = False
    escape = False
    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]
    return None
