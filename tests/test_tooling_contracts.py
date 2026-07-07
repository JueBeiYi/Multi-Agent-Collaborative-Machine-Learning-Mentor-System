import unittest
from pathlib import Path


class ToolingContracts(unittest.TestCase):
    def test_bigmodel_script_uses_stdlib_and_environment_key(self):
        source = Path("test_bigmodel_api.py").read_text(encoding="utf-8")

        self.assertNotIn("import requests", source)
        self.assertIn("os.environ", source)
        self.assertNotIn("b22805291c5d436ca10ff901f998411a", source)


if __name__ == "__main__":
    unittest.main()
