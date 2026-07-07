from __future__ import annotations

import csv
import io
from collections import Counter
from typing import Any


def parse_csv_dataset(csv_text: str, target_column: str) -> dict[str, Any]:
    if not csv_text.strip():
        raise ValueError("请先提供 CSV 数据")

    stream = io.StringIO(csv_text.lstrip("\ufeff"))
    reader = csv.DictReader(stream)
    if not reader.fieldnames:
        raise ValueError("CSV 缺少表头")

    columns = [name.strip() for name in reader.fieldnames if name and name.strip()]
    if target_column not in columns:
        raise ValueError(f"目标列 {target_column} 不存在，可选列: {', '.join(columns)}")

    rows: list[dict[str, str]] = []
    for raw_row in reader:
        row = {col: (raw_row.get(col) or "").strip() for col in columns}
        if any(value != "" for value in row.values()):
            rows.append(row)
    if len(rows) < 6:
        raise ValueError("CSV 至少需要 6 行有效数据用于演示训练和测试")

    missing_counts = {col: sum(1 for row in rows if row[col] == "") for col in columns}
    duplicate_count = len(rows) - len({tuple(row[col] for col in columns) for row in rows})
    numeric_features = _numeric_feature_columns(rows, columns, target_column)
    if not numeric_features:
        raise ValueError("当前 demo 至少需要 1 个数值型特征列")

    target_counter = Counter(row[target_column] for row in rows if row[target_column] != "")
    if len(target_counter) < 2:
        raise ValueError("分类任务至少需要 2 个类别")

    return {
        "columns": columns,
        "rows": rows,
        "row_count": len(rows),
        "column_count": len(columns),
        "target_column": target_column,
        "target_distribution": dict(target_counter),
        "missing_counts": missing_counts,
        "duplicate_count": duplicate_count,
        "numeric_features": numeric_features,
        "preview": rows[:5],
    }


def build_numeric_matrix(dataset: dict[str, Any]) -> tuple[list[list[float]], list[str]]:
    rows = dataset["rows"]
    features = dataset["numeric_features"]
    target_column = dataset["target_column"]
    means = {}
    for feature in features:
        values = [_to_float(row[feature]) for row in rows if row[feature] != ""]
        means[feature] = sum(values) / len(values) if values else 0.0

    matrix: list[list[float]] = []
    labels: list[str] = []
    for row in rows:
        label = row[target_column]
        if label == "":
            continue
        matrix.append([_to_float(row[feature]) if row[feature] != "" else means[feature] for feature in features])
        labels.append(label)
    return matrix, labels


def _numeric_feature_columns(rows: list[dict[str, str]], columns: list[str], target_column: str) -> list[str]:
    features = []
    for col in columns:
        if col == target_column:
            continue
        values = [row[col] for row in rows if row[col] != ""]
        if values and all(_is_float(value) for value in values):
            features.append(col)
    return features


def _is_float(value: str) -> bool:
    try:
        float(value)
        return True
    except ValueError:
        return False


def _to_float(value: str) -> float:
    try:
        return float(value)
    except ValueError as exc:
        raise ValueError(f"数值列中存在无法转换的值: {value}") from exc

