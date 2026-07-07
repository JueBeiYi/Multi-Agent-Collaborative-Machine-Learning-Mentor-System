from __future__ import annotations

import csv
import io
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent.parent
IRIS_CSV_PATH = BASE_DIR / "data" / "sample_iris.csv"


def _csv(text: str) -> str:
    return "\n".join(line.strip() for line in text.strip().splitlines()) + "\n"


SAMPLE_DATASETS: dict[str, dict[str, Any]] = {
    "iris": {
        "id": "iris",
        "name": "Iris 鸢尾花三分类",
        "filename": "sample_iris.csv",
        "target_column": "target",
        "difficulty": "入门到进阶",
        "task_type": "多分类",
        "tags": ["特征分离", "多分类", "混淆矩阵"],
        "description": "用花萼、花瓣的长度和宽度区分三种鸢尾花，并加入少量边界样本，便于观察真实实验中常见的类别混淆。",
        "learning_goal": "观察不同特征对类别区分的作用，并用混淆矩阵分析 versicolor 与 virginica 为什么容易混淆。",
        "focus_points": [
            "先比较 petal_length 和 petal_width，它们通常比花萼特征更有区分度。",
            "训练后重点看 versicolor 与 virginica 的误判方向和各类别 F1。",
            "尝试把目标列改错，体会数据体检如何提示配置问题。",
        ],
        "guide_steps": [
            "载入数据后先检查类别分布是否均衡。",
            "点击字段按钮确认 target 是目标列。",
            "训练模型，结合 Accuracy 与各类别 F1 分析结果。",
        ],
        "csv_text": None,
    },
    "penguins": {
        "id": "penguins",
        "name": "Palmer Penguins 企鹅物种分类",
        "filename": "sample_penguins.csv",
        "target_column": "target",
        "difficulty": "入门到进阶",
        "task_type": "多分类",
        "tags": ["真实测量数据", "物种分类", "特征尺度"],
        "description": "根据喙长、喙深、鳍长和体重区分 Adelie、Gentoo、Chinstrap 三类企鹅，适合练习从生物测量特征理解分类边界。",
        "learning_goal": "理解连续数值特征如何共同决定类别，并观察体重和鳍长这类大尺度特征对距离模型的影响。",
        "focus_points": [
            "Gentoo 往往体重和鳍长更大，最近质心会明显利用这个差异。",
            "Adelie 与 Chinstrap 的喙长、喙深更接近，可能出现边界混淆。",
            "思考如果做标准化，距离模型的判断会不会更稳。",
        ],
        "guide_steps": [
            "先看字段分析中的数值特征和类别分布。",
            "训练后查看各类别 Precision、Recall 的差异。",
            "把结果发送到概念学习，复习特征缩放和距离度量。",
        ],
        "csv_text": _csv(
            """
            bill_length_mm,bill_depth_mm,flipper_length_mm,body_mass_g,target
            39.1,18.7,181,3750,Adelie
            39.5,17.4,186,3800,Adelie
            40.3,18.0,195,3250,Adelie
            36.7,19.3,193,3450,Adelie
            38.9,17.8,181,3625,Adelie
            41.1,18.2,192,4050,Adelie
            37.8,18.3,174,3400,Adelie
            40.6,18.6,183,3550,Adelie
            46.5,13.5,210,4550,Gentoo
            50.0,15.2,218,5700,Gentoo
            48.7,14.1,210,4450,Gentoo
            45.5,13.7,214,4650,Gentoo
            49.6,16.0,225,5700,Gentoo
            47.6,14.5,215,5400,Gentoo
            48.4,14.6,213,5850,Gentoo
            50.5,15.9,222,5550,Gentoo
            46.5,17.9,192,3500,Chinstrap
            50.0,19.5,196,3900,Chinstrap
            51.3,19.2,193,3650,Chinstrap
            45.4,18.7,188,3525,Chinstrap
            52.7,19.8,197,3725,Chinstrap
            46.1,18.2,178,3250,Chinstrap
            51.7,20.3,194,3775,Chinstrap
            49.8,17.3,198,3675,Chinstrap
            """
        ),
    },
    "wine": {
        "id": "wine",
        "name": "Wine 葡萄酒品种识别",
        "filename": "sample_wine.csv",
        "target_column": "target",
        "difficulty": "进阶",
        "task_type": "多分类",
        "tags": ["多特征", "类别质心", "化学指标"],
        "description": "用酒精度、酸度、酚类、颜色强度等化学指标识别三类葡萄酒，适合练习多特征分类和指标解释。",
        "learning_goal": "理解多维数值特征如何形成类别中心，并分析哪些品类在测试集中更容易被误判。",
        "focus_points": [
            "不同字段量纲差异较大，适合讨论标准化为什么重要。",
            "颜色强度、脯氨酸等特征可能对类别中心影响更明显。",
            "训练后用每类 F1 判断模型是否只偏向某一类。",
        ],
        "guide_steps": [
            "先观察字段数量，理解多特征输入的结构。",
            "训练后查看各类质心和混淆矩阵。",
            "复制实验代码，思考如何在 sklearn 中加 StandardScaler。",
        ],
        "csv_text": _csv(
            """
            alcohol,malic_acid,ash,alcalinity,magnesium,total_phenols,color_intensity,proline,target
            14.23,1.71,2.43,15.6,127,2.80,5.64,1065,class_0
            13.20,1.78,2.14,11.2,100,2.65,4.38,1050,class_0
            13.16,2.36,2.67,18.6,101,2.80,5.68,1185,class_0
            14.37,1.95,2.50,16.8,113,3.85,7.80,1480,class_0
            13.24,2.59,2.87,21.0,118,2.80,4.32,735,class_0
            14.20,1.76,2.45,15.2,112,3.27,6.75,1450,class_0
            14.39,1.87,2.45,14.6,96,2.50,5.25,1290,class_0
            14.06,2.15,2.61,17.6,121,2.60,5.05,1295,class_0
            12.37,0.94,1.36,10.6,88,1.98,1.95,520,class_1
            12.33,1.10,2.28,16.0,101,2.05,3.27,680,class_1
            12.64,1.36,2.02,16.8,100,2.02,5.75,450,class_1
            13.67,1.25,1.92,18.0,94,2.10,3.80,630,class_1
            12.37,1.13,2.16,19.0,87,3.50,4.45,420,class_1
            12.17,1.45,2.53,19.0,104,1.89,2.95,355,class_1
            12.37,1.21,2.56,18.1,98,2.42,4.60,678,class_1
            13.11,1.01,1.70,15.0,78,2.98,3.18,502,class_1
            13.71,5.65,2.45,20.5,95,1.68,7.70,740,class_2
            13.40,3.91,2.48,23.0,102,1.80,7.30,750,class_2
            13.27,4.28,2.26,20.0,120,1.59,10.20,835,class_2
            13.17,2.59,2.37,20.0,120,1.65,9.30,840,class_2
            14.13,4.10,2.74,24.5,96,2.05,9.20,560,class_2
            13.45,3.70,2.60,23.0,111,1.70,10.68,695,class_2
            12.82,3.37,2.30,19.5,88,1.48,10.26,685,class_2
            13.58,2.58,2.69,24.5,105,1.55,8.66,750,class_2
            """
        ),
    },
    "breast_cancer": {
        "id": "breast_cancer",
        "name": "Breast Cancer 肿瘤良恶性判别",
        "filename": "sample_breast_cancer.csv",
        "target_column": "target",
        "difficulty": "进阶",
        "task_type": "二分类",
        "tags": ["医学数据", "二分类", "召回率"],
        "description": "用肿瘤半径、纹理、周长、面积等形态特征判断良性或恶性，适合理解二分类指标的业务含义。",
        "learning_goal": "比较 Accuracy、Precision、Recall 在高风险任务中的解释差异，尤其关注恶性样本的漏判风险。",
        "focus_points": [
            "恶性类的 Recall 更值得关注，因为漏判代价通常更高。",
            "如果类别分布不均衡，Accuracy 可能掩盖问题。",
            "混淆矩阵能直接定位误报和漏报数量。",
        ],
        "guide_steps": [
            "载入后先确认 target 中 benign 与 malignant 的分布。",
            "训练后查看 malignant 的 Recall 和 F1。",
            "把结果发送到错误诊断，尝试分析是否需要更多特征或阈值策略。",
        ],
        "csv_text": _csv(
            """
            mean_radius,mean_texture,mean_perimeter,mean_area,mean_smoothness,mean_concavity,worst_radius,worst_area,target
            17.99,10.38,122.8,1001,0.1184,0.3001,25.38,2019,malignant
            20.57,17.77,132.9,1326,0.0847,0.0869,24.99,1956,malignant
            19.69,21.25,130.0,1203,0.1096,0.1974,23.57,1709,malignant
            11.42,20.38,77.58,386.1,0.1425,0.2414,14.91,567.7,malignant
            20.29,14.34,135.1,1297,0.1003,0.1980,22.54,1575,malignant
            12.45,15.70,82.57,477.1,0.1278,0.1578,15.47,741.6,malignant
            18.25,19.98,119.6,1040,0.0946,0.1127,22.88,1606,malignant
            13.71,20.83,90.2,577.9,0.1189,0.0937,17.06,897.0,malignant
            13.00,21.82,87.5,519.8,0.1273,0.1859,15.49,739.3,malignant
            12.46,24.04,83.97,475.9,0.1186,0.2273,15.09,711.4,malignant
            16.02,23.24,102.7,797.8,0.0821,0.0329,19.19,1150,malignant
            15.78,17.89,103.6,781.0,0.0971,0.0995,20.42,1299,malignant
            8.196,16.84,51.71,201.9,0.0860,0.0594,8.964,242.2,benign
            8.598,20.98,54.66,221.8,0.1243,0.0300,9.565,273.9,benign
            9.173,13.86,59.2,260.9,0.0772,0.0256,10.01,303.8,benign
            12.05,14.63,78.04,449.3,0.1031,0.0909,13.76,580.9,benign
            10.17,14.88,64.55,311.9,0.1134,0.0806,11.02,375.7,benign
            8.618,11.79,54.34,224.5,0.0975,0.0206,9.507,256.7,benign
            10.57,18.32,66.82,340.9,0.0814,0.0238,10.94,370.0,benign
            11.13,22.44,71.49,378.4,0.0957,0.0819,12.02,440.6,benign
            12.72,13.78,81.78,492.1,0.0967,0.0137,13.50,553.7,benign
            14.20,20.53,92.41,618.4,0.0893,0.1103,16.45,888.7,benign
            11.60,12.84,74.34,412.6,0.0898,0.0337,13.06,520.5,benign
            12.20,15.21,78.01,457.9,0.0867,0.0465,13.75,577.0,benign
            """
        ),
    },
    "titanic": {
        "id": "titanic",
        "name": "Titanic 泰坦尼克生还预测",
        "filename": "sample_titanic.csv",
        "target_column": "target",
        "difficulty": "综合",
        "task_type": "二分类",
        "tags": ["生还预测", "特征编码", "社会因素"],
        "description": "用舱位、性别编码、年龄、同行亲属、票价和登船港口编码预测是否生还，是讲解特征编码和数据偏差的经典案例。",
        "learning_goal": "理解真实业务数据中数值编码、类别特征和社会因素如何影响分类模型。",
        "focus_points": [
            "sex_code、pclass 和 fare 常会显著影响分类边界。",
            "数值编码不等于真实距离，适合讨论类别特征编码的局限。",
            "如果模型表现好，也要追问是否存在历史数据偏差。",
        ],
        "guide_steps": [
            "先阅读字段含义，确认 1/0 编码代表 survived/not_survived。",
            "训练后查看是否对某一类预测更保守。",
            "把案例接到概念学习，复习特征工程、类别编码和数据偏差。",
        ],
        "csv_text": _csv(
            """
            pclass,sex_code,age,sibsp,parch,fare,embarked_code,target
            3,0,22,1,0,7.25,0,not_survived
            1,1,38,1,0,71.28,1,survived
            3,1,26,0,0,7.92,0,survived
            1,1,35,1,0,53.10,0,survived
            3,0,35,0,0,8.05,0,not_survived
            3,0,28,0,0,8.46,2,not_survived
            1,0,54,0,0,51.86,0,not_survived
            3,0,2,3,1,21.08,0,not_survived
            3,1,27,0,2,11.13,0,survived
            2,1,14,1,0,30.07,1,survived
            3,1,4,1,1,16.70,0,survived
            1,1,58,0,0,26.55,0,survived
            3,0,20,0,0,8.05,0,not_survived
            3,0,39,1,5,31.28,0,not_survived
            2,1,55,0,0,16.00,0,survived
            3,0,2,4,1,29.13,2,not_survived
            2,0,31,0,0,13.00,0,not_survived
            1,0,28,0,0,35.50,0,survived
            3,1,19,0,0,7.85,0,survived
            3,0,40,0,0,7.90,0,not_survived
            1,1,49,1,0,76.73,1,survived
            2,0,35,0,0,26.00,0,not_survived
            3,1,18,0,1,9.35,0,survived
            1,0,47,0,0,52.00,0,not_survived
            """
        ),
    },
}


SAMPLE_ORDER = ["iris", "penguins", "wine", "breast_cancer", "titanic"]


def list_sample_datasets() -> list[dict[str, Any]]:
    return [_public_dataset(SAMPLE_DATASETS[dataset_id], include_csv=False) for dataset_id in SAMPLE_ORDER]


def get_sample_dataset(dataset_id: str | None = None) -> dict[str, Any]:
    selected_id = dataset_id or "iris"
    if selected_id not in SAMPLE_DATASETS:
        raise ValueError(f"未知示例数据集: {selected_id}")
    return _public_dataset(SAMPLE_DATASETS[selected_id], include_csv=True)


def _public_dataset(dataset: dict[str, Any], include_csv: bool) -> dict[str, Any]:
    csv_text = _resolve_csv_text(dataset)
    header = csv_text.splitlines()[0].split(",") if csv_text.strip() else []
    public = {
        key: _copy_value(value)
        for key, value in dataset.items()
        if key != "csv_text"
    }
    public["row_count"] = max(0, len(csv_text.splitlines()) - 1)
    public["feature_count"] = max(0, len(header) - 1)
    if include_csv:
        public["csv_text"] = csv_text
    return public


def _resolve_csv_text(dataset: dict[str, Any]) -> str:
    if dataset["id"] == "iris":
        csv_text = IRIS_CSV_PATH.read_text(encoding="utf-8")
    else:
        csv_text = str(dataset.get("csv_text") or "")
    return _expand_teaching_csv(csv_text, dataset.get("target_column", "target"), min_rows=48)


def _copy_value(value: Any) -> Any:
    if isinstance(value, list):
        return [_copy_value(item) for item in value]
    if isinstance(value, dict):
        return {key: _copy_value(item) for key, item in value.items()}
    return value


def _expand_teaching_csv(csv_text: str, target_column: str, min_rows: int) -> str:
    rows = _read_csv_rows(csv_text)
    if not rows:
        return csv_text
    header = list(rows[0].keys())
    if len(rows) >= min_rows:
        return _write_csv_rows(header, rows)

    numeric_columns = [
        column
        for column in header
        if column != target_column and _column_is_numeric(rows, column)
    ]
    protected_integer_columns = {
        column
        for column in numeric_columns
        if _looks_like_encoded_category(rows, column)
    }

    expanded = [dict(row) for row in rows]
    cycle = 1
    while len(expanded) < min_rows:
        for row_index, row in enumerate(rows):
            if len(expanded) >= min_rows:
                break
            new_row = dict(row)
            for column in numeric_columns:
                if column in protected_integer_columns:
                    continue
                new_row[column] = _jitter_numeric_cell(row[column], row_index, cycle)
            expanded.append(new_row)
        cycle += 1
    return _write_csv_rows(header, expanded)


def _read_csv_rows(csv_text: str) -> list[dict[str, str]]:
    stream = io.StringIO(csv_text.lstrip("\ufeff"))
    reader = csv.DictReader(stream)
    if not reader.fieldnames:
        return []
    columns = [column.strip() for column in reader.fieldnames if column and column.strip()]
    rows = []
    for raw_row in reader:
        row = {column: (raw_row.get(column) or "").strip() for column in columns}
        if any(row.values()):
            rows.append(row)
    return rows


def _write_csv_rows(header: list[str], rows: list[dict[str, str]]) -> str:
    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=header, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue()


def _column_is_numeric(rows: list[dict[str, str]], column: str) -> bool:
    values = [row[column] for row in rows if row.get(column) != ""]
    if not values:
        return False
    return all(_is_float(value) for value in values)


def _looks_like_encoded_category(rows: list[dict[str, str]], column: str) -> bool:
    values = [float(row[column]) for row in rows if row.get(column) != ""]
    unique_values = set(values)
    return len(unique_values) <= 6 and all(value.is_integer() for value in unique_values)


def _jitter_numeric_cell(value: str, row_index: int, cycle: int) -> str:
    if not _is_float(value):
        return value
    number = float(value)
    magnitude = max(abs(number), 1.0)
    direction = ((row_index % 5) - 2) * 0.004 + ((cycle % 3) - 1) * 0.006
    adjusted = number + magnitude * direction
    if "." not in value and abs(number) >= 20:
        return str(int(round(adjusted)))
    return f"{adjusted:.4f}".rstrip("0").rstrip(".")


def _is_float(value: str) -> bool:
    try:
        float(value)
        return True
    except ValueError:
        return False
