from __future__ import annotations

import math
import random
from collections import defaultdict
from typing import Any

from ml_core.data_processor import build_numeric_matrix, parse_csv_dataset


SUPPORTED_MODELS = {
    "nearest_centroid": {
        "display_name": "最近质心分类器",
        "family": "distance",
        "summary": "计算每个类别的特征中心，测试样本归到距离最近的类别中心。",
    },
    "knn": {
        "display_name": "KNN 分类器",
        "family": "distance",
        "summary": "预测时查找距离最近的 k 个训练样本，由邻居多数投票决定类别。",
    },
    "decision_tree": {
        "display_name": "简化决策树",
        "family": "tree",
        "summary": "用 Gini 增益选择二分规则，递归形成可解释的 if/else 判断路径。",
    },
    "gaussian_nb": {
        "display_name": "高斯朴素贝叶斯",
        "family": "probabilistic",
        "summary": "估计每个类别下各数值特征的均值和方差，再用贝叶斯规则预测类别。",
    },
}


def train_classifier(csv_text: str, target_column: str, model_name: str = "nearest_centroid") -> dict[str, Any]:
    model_key = _normalize_model_name(model_name)
    dataset = parse_csv_dataset(csv_text, target_column)
    matrix, labels = build_numeric_matrix(dataset)
    train_idx, test_idx = _stratified_split(labels, test_ratio=0.3)
    train_rows = [matrix[i] for i in train_idx]
    train_labels = [labels[i] for i in train_idx]
    test_rows = [matrix[i] for i in test_idx]

    scaler = _fit_standard_scaler(train_rows)
    scaled_matrix = _transform_matrix(matrix, scaler)
    scaled_train_rows = [scaled_matrix[i] for i in train_idx]
    scaled_test_rows = [scaled_matrix[i] for i in test_idx]

    if model_key == "nearest_centroid":
        centroids = _fit_nearest_centroid(scaled_train_rows, train_labels)
        predictions = [_predict_nearest_centroid(row, centroids) for row in scaled_test_rows]
        learned_model: dict[str, Any] = {"centroids": centroids}
    elif model_key == "knn":
        k = _choose_knn_k(train_labels)
        predictions = [_predict_knn(row, scaled_train_rows, train_labels, k) for row in scaled_test_rows]
        learned_model = {"k": k, "train_samples": len(train_rows)}
    elif model_key == "decision_tree":
        tree = _fit_decision_tree(train_rows, train_labels, dataset["numeric_features"], max_depth=3)
        predictions = [_predict_tree(row, tree) for row in test_rows]
        learned_model = {"tree": tree, "rules": _tree_rules(tree)}
    else:
        gaussian = _fit_gaussian_nb(train_rows, train_labels)
        predictions = [_predict_gaussian_nb(row, gaussian) for row in test_rows]
        learned_model = {
            "class_priors": gaussian["priors"],
            "feature_statistics": gaussian["stats"],
        }

    truth = [labels[i] for i in test_idx]
    metric_pack = _classification_metrics(truth, predictions)
    per_label_metrics = [
        {
            "label": item["label"],
            "precision": round(item["precision"], 4),
            "recall": round(item["recall"], 4),
            "f1": round(item["f1"], 4),
        }
        for item in metric_pack["per_label"]
    ]

    return {
        "model_name": model_key,
        "task_type": "classification",
        "split_strategy": "stratified_70_30_random_state_42",
        "preprocessing": {
            "missing_value_strategy": "数值特征缺失值按列均值填补",
            "feature_scaling": "距离模型使用训练集 z-score 标准化；树模型和朴素贝叶斯保留原始数值含义",
            "numeric_features": dataset["numeric_features"],
        },
        "model_detail": {
            "algorithm_key": model_key,
            "display_name": SUPPORTED_MODELS[model_key]["display_name"],
            "algorithm_family": SUPPORTED_MODELS[model_key]["family"],
            "training_summary": SUPPORTED_MODELS[model_key]["summary"],
            "learned_summary": learned_model,
        },
        "data_summary": {
            "row_count": dataset["row_count"],
            "column_count": dataset["column_count"],
            "target_column": target_column,
            "target_distribution": dataset["target_distribution"],
            "missing_counts": dataset["missing_counts"],
            "duplicate_count": dataset["duplicate_count"],
            "numeric_features": dataset["numeric_features"],
            "preview": dataset["preview"],
            "train_size": len(train_idx),
            "test_size": len(test_idx),
        },
        "metrics": metric_pack["metrics"],
        "confusion_matrix": metric_pack["confusion_matrix"],
        "metric_bars": [
            {"name": "Accuracy", "value": metric_pack["metrics"]["accuracy"]},
            {"name": "Precision", "value": metric_pack["metrics"]["macro_precision"]},
            {"name": "Recall", "value": metric_pack["metrics"]["macro_recall"]},
            {"name": "F1", "value": metric_pack["metrics"]["macro_f1"]},
        ],
        "per_label_metrics": per_label_metrics,
        "predictions": [
            {"actual": truth[i], "predicted": predictions[i], "correct": truth[i] == predictions[i]}
            for i in range(min(10, len(predictions)))
        ],
    }


def _normalize_model_name(model_name: str) -> str:
    key = (model_name or "nearest_centroid").strip()
    if key not in SUPPORTED_MODELS:
        supported = "、".join(item["display_name"] for item in SUPPORTED_MODELS.values())
        raise ValueError(f"暂不支持模型 {key}，当前实验中心支持: {supported}")
    return key


def _stratified_split(labels: list[str], test_ratio: float) -> tuple[list[int], list[int]]:
    grouped: dict[str, list[int]] = defaultdict(list)
    for index, label in enumerate(labels):
        grouped[label].append(index)

    rng = random.Random(42)
    train_idx: list[int] = []
    test_idx: list[int] = []
    for indices in grouped.values():
        shuffled = indices[:]
        rng.shuffle(shuffled)
        test_count = max(1, int(round(len(shuffled) * test_ratio))) if len(shuffled) > 2 else 1
        test_idx.extend(shuffled[:test_count])
        train_idx.extend(shuffled[test_count:])
    if not train_idx:
        raise ValueError("训练集为空，请增加数据行数")
    return train_idx, test_idx


def _fit_standard_scaler(matrix: list[list[float]]) -> dict[str, list[float]]:
    width = len(matrix[0]) if matrix else 0
    means = []
    stds = []
    for column in range(width):
        values = [row[column] for row in matrix]
        mean = sum(values) / len(values)
        variance = sum((value - mean) ** 2 for value in values) / len(values)
        means.append(mean)
        stds.append(math.sqrt(variance) or 1.0)
    return {"means": means, "stds": stds}


def _transform_matrix(matrix: list[list[float]], scaler: dict[str, list[float]]) -> list[list[float]]:
    means = scaler["means"]
    stds = scaler["stds"]
    return [[(value - means[index]) / stds[index] for index, value in enumerate(row)] for row in matrix]


def _fit_nearest_centroid(matrix: list[list[float]], labels: list[str]) -> dict[str, list[float]]:
    buckets: dict[str, list[list[float]]] = defaultdict(list)
    for row, label in zip(matrix, labels):
        buckets[label].append(row)

    centroids = {}
    for label, rows in buckets.items():
        width = len(rows[0])
        centroids[label] = [round(sum(row[i] for row in rows) / len(rows), 4) for i in range(width)]
    return centroids


def _predict_nearest_centroid(row: list[float], centroids: dict[str, list[float]]) -> str:
    best_label = None
    best_distance = float("inf")
    for label, center in centroids.items():
        distance = math.sqrt(sum((a - b) ** 2 for a, b in zip(row, center)))
        if distance < best_distance:
            best_distance = distance
            best_label = label
    if best_label is None:
        raise ValueError("模型没有可用类别中心")
    return best_label


def _choose_knn_k(labels: list[str]) -> int:
    k = min(5, len(labels))
    if k > 1 and k % 2 == 0:
        k -= 1
    return max(1, k)


def _predict_knn(row: list[float], train_rows: list[list[float]], train_labels: list[str], k: int) -> str:
    neighbors = sorted(
        (
            {
                "label": label,
                "distance": math.sqrt(sum((a - b) ** 2 for a, b in zip(row, train_row))),
            }
            for train_row, label in zip(train_rows, train_labels)
        ),
        key=lambda item: item["distance"],
    )[:k]
    votes: dict[str, dict[str, float]] = {}
    for neighbor in neighbors:
        bucket = votes.setdefault(neighbor["label"], {"count": 0, "distance": 0.0})
        bucket["count"] += 1
        bucket["distance"] += neighbor["distance"]
    return sorted(
        votes.items(),
        key=lambda item: (-item[1]["count"], item[1]["distance"] / item[1]["count"], item[0]),
    )[0][0]


def _fit_decision_tree(
    matrix: list[list[float]],
    labels: list[str],
    feature_names: list[str],
    max_depth: int,
    depth: int = 0,
) -> dict[str, Any]:
    majority = _majority_label(labels)
    if depth >= max_depth or len(set(labels)) == 1 or len(matrix) <= 2:
        return {"type": "leaf", "prediction": majority, "samples": len(labels)}

    split = _best_tree_split(matrix, labels)
    if split is None or split["gain"] <= 0:
        return {"type": "leaf", "prediction": majority, "samples": len(labels)}

    feature_index = split["feature_index"]
    threshold = split["threshold"]
    left_rows: list[list[float]] = []
    left_labels: list[str] = []
    right_rows: list[list[float]] = []
    right_labels: list[str] = []
    for row, label in zip(matrix, labels):
        if row[feature_index] <= threshold:
            left_rows.append(row)
            left_labels.append(label)
        else:
            right_rows.append(row)
            right_labels.append(label)

    return {
        "type": "split",
        "feature": feature_names[feature_index],
        "feature_index": feature_index,
        "threshold": round(threshold, 4),
        "gini_gain": round(split["gain"], 4),
        "samples": len(labels),
        "fallback": majority,
        "left": _fit_decision_tree(left_rows, left_labels, feature_names, max_depth, depth + 1),
        "right": _fit_decision_tree(right_rows, right_labels, feature_names, max_depth, depth + 1),
    }


def _best_tree_split(matrix: list[list[float]], labels: list[str]) -> dict[str, Any] | None:
    base_gini = _gini(labels)
    best: dict[str, Any] | None = None
    width = len(matrix[0]) if matrix else 0
    for feature_index in range(width):
        values = sorted({row[feature_index] for row in matrix})
        thresholds = [(left + right) / 2 for left, right in zip(values, values[1:])]
        for threshold in thresholds:
            left_labels = [label for row, label in zip(matrix, labels) if row[feature_index] <= threshold]
            right_labels = [label for row, label in zip(matrix, labels) if row[feature_index] > threshold]
            if not left_labels or not right_labels:
                continue
            weighted = (len(left_labels) / len(labels)) * _gini(left_labels) + (len(right_labels) / len(labels)) * _gini(right_labels)
            gain = base_gini - weighted
            if best is None or gain > best["gain"]:
                best = {"feature_index": feature_index, "threshold": threshold, "gain": gain}
    return best


def _predict_tree(row: list[float], node: dict[str, Any]) -> str:
    if node["type"] == "leaf":
        return node["prediction"]
    branch = "left" if row[node["feature_index"]] <= node["threshold"] else "right"
    return _predict_tree(row, node.get(branch) or {"type": "leaf", "prediction": node["fallback"]})


def _tree_rules(node: dict[str, Any], prefix: str = "") -> list[str]:
    if node["type"] == "leaf":
        return [f"{prefix}预测 {node['prediction']}（{node['samples']} 个训练样本）".strip()]
    left_prefix = f"{prefix}{node['feature']} <= {node['threshold']}: "
    right_prefix = f"{prefix}{node['feature']} > {node['threshold']}: "
    return _tree_rules(node["left"], left_prefix) + _tree_rules(node["right"], right_prefix)


def _fit_gaussian_nb(matrix: list[list[float]], labels: list[str]) -> dict[str, Any]:
    grouped: dict[str, list[list[float]]] = defaultdict(list)
    for row, label in zip(matrix, labels):
        grouped[label].append(row)
    total = len(labels)
    stats = {}
    priors = {}
    for label, rows in grouped.items():
        width = len(rows[0])
        priors[label] = len(rows) / total
        stats[label] = []
        for column in range(width):
            values = [row[column] for row in rows]
            mean = sum(values) / len(values)
            variance = sum((value - mean) ** 2 for value in values) / len(values)
            stats[label].append({"mean": round(mean, 4), "variance": round(max(variance, 1e-6), 6)})
    return {"priors": priors, "stats": stats}


def _predict_gaussian_nb(row: list[float], model: dict[str, Any]) -> str:
    best_label = None
    best_score = -float("inf")
    for label, prior in model["priors"].items():
        score = math.log(prior)
        for value, stat in zip(row, model["stats"][label]):
            variance = stat["variance"]
            mean = stat["mean"]
            score += -0.5 * math.log(2 * math.pi * variance) - ((value - mean) ** 2 / (2 * variance))
        if score > best_score:
            best_score = score
            best_label = label
    if best_label is None:
        raise ValueError("朴素贝叶斯模型没有可用类别")
    return best_label


def _majority_label(labels: list[str]) -> str:
    counts: dict[str, int] = defaultdict(int)
    for label in labels:
        counts[label] += 1
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]


def _gini(labels: list[str]) -> float:
    if not labels:
        return 0.0
    counts: dict[str, int] = defaultdict(int)
    for label in labels:
        counts[label] += 1
    return 1 - sum((count / len(labels)) ** 2 for count in counts.values())


def _classification_metrics(truth: list[str], predictions: list[str]) -> dict[str, Any]:
    labels = sorted(set(truth) | set(predictions))
    index = {label: i for i, label in enumerate(labels)}
    matrix = [[0 for _ in labels] for _ in labels]
    for actual, predicted in zip(truth, predictions):
        matrix[index[actual]][index[predicted]] += 1

    total = len(truth)
    correct = sum(1 for actual, predicted in zip(truth, predictions) if actual == predicted)
    per_label = []
    for label in labels:
        i = index[label]
        tp = matrix[i][i]
        fp = sum(matrix[row][i] for row in range(len(labels))) - tp
        fn = sum(matrix[i][col] for col in range(len(labels))) - tp
        precision = tp / (tp + fp) if tp + fp else 0.0
        recall = tp / (tp + fn) if tp + fn else 0.0
        f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
        per_label.append({"label": label, "precision": precision, "recall": recall, "f1": f1})

    macro_precision = sum(item["precision"] for item in per_label) / len(per_label)
    macro_recall = sum(item["recall"] for item in per_label) / len(per_label)
    macro_f1 = sum(item["f1"] for item in per_label) / len(per_label)

    return {
        "metrics": {
            "accuracy": round(correct / total if total else 0.0, 4),
            "macro_precision": round(macro_precision, 4),
            "macro_recall": round(macro_recall, 4),
            "macro_f1": round(macro_f1, 4),
        },
        "confusion_matrix": {"labels": labels, "matrix": matrix},
        "per_label": per_label,
    }
