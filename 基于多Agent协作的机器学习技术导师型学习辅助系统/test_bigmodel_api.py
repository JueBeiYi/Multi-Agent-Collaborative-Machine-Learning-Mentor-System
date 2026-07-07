import json
import os
import urllib.error
import urllib.request


API_KEY = os.environ.get("BIGMODEL_API_KEY", "").strip()
URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"


def main() -> None:
    if not API_KEY:
        print("请先设置环境变量 BIGMODEL_API_KEY，再运行该接口测试脚本。")
        return

    payload = {
        "model": os.environ.get("BIGMODEL_MODEL", "glm-4.7-flash"),
        "messages": [
            {
                "role": "user",
                "content": "你好，请回复一句话。",
            }
        ],
        "stream": False,
        "temperature": 0.4,
    }
    request = urllib.request.Request(
        URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            print("状态码:", response.status)
            print("返回内容:")
            print(response.read().decode("utf-8", errors="replace"))
    except TimeoutError:
        print("请求超时：可能是网络问题、代理问题，或接口响应太慢。")
    except urllib.error.HTTPError as exc:
        print("接口返回错误状态码:", exc.code)
        print(exc.read().decode("utf-8", errors="replace"))
    except urllib.error.URLError as exc:
        print("连接失败：可能无法访问 open.bigmodel.cn，检查网络、DNS、代理。")
        print(exc.reason)
    except Exception as exc:
        print("其他错误:", exc)


if __name__ == "__main__":
    main()
