const AGENTS = [
  { id: "planner", name: "学习规划 Agent" },
  { id: "concept", name: "概念导师 Agent" },
  { id: "visual", name: "算法可视化 Agent" },
  { id: "code_tutor", name: "代码陪练 Agent" },
  { id: "result", name: "结果解释 Agent" },
  { id: "error", name: "错误诊断 Agent" },
  { id: "assessment", name: "测评诊断 Agent" },
  { id: "review", name: "总结复习 Agent" },
  { id: "qa", name: "开放问答 Agent" },
];

const CORE_AGENT_ROLES = [
  {
    id: "learning_planner",
    name: "学习规划 Agent",
    responsibility: "生成符合机器学习先修顺序的阶段路线。",
    owned_agents: ["planner"],
    primary_views: ["plan"],
  },
  {
    id: "knowledge_tutor",
    name: "知识讲解 Agent",
    responsibility: "按概念、原理、例子、代码、练习分层讲解知识点。",
    owned_agents: ["concept", "visual"],
    primary_views: ["concept", "visualize"],
  },
  {
    id: "code_experiment",
    name: "代码实验 Agent",
    responsibility: "把代码复现、实验训练和结果解释连接成实践闭环。",
    owned_agents: ["code_tutor", "result"],
    primary_views: ["codeTutor", "experiment"],
  },
  {
    id: "assessment_diagnosis",
    name: "测评诊断 Agent",
    responsibility: "汇总练习、自测、实验和报错，判断薄弱点与补救动作。",
    owned_agents: ["assessment", "result", "error"],
    primary_views: ["concept", "experiment", "diagnose"],
  },
  {
    id: "review_coach",
    name: "总结复习 Agent",
    responsibility: "读取学习档案并生成阶段复盘、复习顺序和下一步建议。",
    owned_agents: ["review"],
    primary_views: ["dashboard", "archive"],
  },
];

const CODE_STEPS = [
  "导入工具库",
  "加载或上传数据集",
  "查看数据结构",
  "划分特征 X 和标签 y",
  "划分训练集和测试集",
  "创建模型",
  "训练模型",
  "预测结果",
  "计算评价指标",
  "解释结果并总结流程",
];

const MOCK_CODE_SNIPPETS = [
  {
    code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix`,
    why: "先把数据处理、训练划分、模型和评价指标工具导入，后续每一步都围绕这些工具展开。",
    explanation: [
      { line: "import pandas as pd", explanation: "读取和检查 CSV 表格数据。" },
      { line: "train_test_split", explanation: "把数据拆成训练集和测试集，避免只看训练效果。" },
      { line: "LogisticRegression", explanation: "用于分类任务的基础模型，适合 Iris 这类入门案例。" },
      { line: "metrics", explanation: "用准确率、分类报告和混淆矩阵检查模型表现。" },
    ],
    concepts: ["pandas", "train_test_split", "Logistic Regression", "评价指标"],
    expected: "导入成功后不会输出内容；如果包缺失，会看到 ModuleNotFoundError。",
    task: "在本地 Python 环境运行这几行导入语句，确认没有报错。",
    errors: ["忘记安装 scikit-learn。", "把 sklearn 写成 sklean 或 scikitlearn。"],
  },
  {
    code: `df = pd.read_csv("iris.csv")
print(df.head())
print(df.shape)`,
    why: "机器学习不能直接从模型开始，先要把数据读进来，并确认行数、列数和字段是否符合预期。",
    explanation: [
      { line: "pd.read_csv", explanation: "读取 CSV 文件，生成 DataFrame。" },
      { line: "df.head()", explanation: "查看前几行，快速确认字段名和样例值。" },
      { line: "df.shape", explanation: "查看样本数和字段数，判断数据规模。" },
    ],
    concepts: ["CSV", "DataFrame", "样本", "字段"],
    expected: "能看到前 5 行 Iris 数据，以及类似 (150, 5) 的形状信息。",
    task: "把文件名改成自己的 CSV，观察字段名是否正确。",
    errors: ["文件路径不对导致 FileNotFoundError。", "CSV 编码不一致导致读取乱码。"],
  },
  {
    code: `print(df.info())
print(df.describe())
print(df["target"].value_counts())`,
    why: "在划分特征和标签前，先确认是否有缺失值、数值特征和类别分布。",
    explanation: [
      { line: "df.info()", explanation: "查看每列类型和缺失情况。" },
      { line: "df.describe()", explanation: "查看数值列的范围、均值和波动。" },
      { line: "value_counts()", explanation: "检查每个类别有多少样本。" },
    ],
    concepts: ["缺失值", "数值特征", "类别分布"],
    expected: "Iris 示例中目标类别数量接近均衡，数值特征没有缺失。",
    task: "找出哪些列是特征，哪一列是目标标签。",
    errors: ["没有检查缺失值就开始训练。", "类别极不均衡时仍只看 Accuracy。"],
  },
  {
    code: `feature_cols = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
X = df[feature_cols]
y = df["target"]`,
    why: "模型学习的是从特征 X 到标签 y 的映射，必须把输入和答案分开。",
    explanation: [
      { line: "feature_cols", explanation: "列出用于预测的特征列。" },
      { line: "X = df[feature_cols]", explanation: "取出模型输入。" },
      { line: "y = df['target']", explanation: "取出模型要预测的答案。" },
    ],
    concepts: ["特征 X", "标签 y", "监督学习"],
    expected: "X 包含 4 个数值特征，y 是每条样本的类别。",
    task: "尝试删除 petal_width，再观察后续模型效果是否变化。",
    errors: ["把 target 放进 X，造成答案泄漏。", "列名拼写错误导致 KeyError。"],
  },
  {
    code: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`,
    why: "训练集用于学习，测试集用于检查新样本效果；stratify 能保持类别比例稳定。",
    explanation: [
      { line: "test_size=0.2", explanation: "20% 样本留作测试。" },
      { line: "random_state=42", explanation: "固定随机性，方便复现。" },
      { line: "stratify=y", explanation: "让训练集和测试集保持类似类别比例。" },
    ],
    concepts: ["训练集", "测试集", "可复现", "stratify"],
    expected: "得到四个变量：X_train、X_test、y_train、y_test。",
    task: "把 test_size 改成 0.3，对比测试集样本数量。",
    errors: ["先在全量数据上做会泄漏信息的处理。", "忘记 random_state 导致每次结果不同。"],
  },
  {
    code: `model = LogisticRegression(max_iter=200)
print(model)`,
    why: "创建模型对象时先确定算法和关键参数，还没有真正学习数据。",
    explanation: [
      { line: "LogisticRegression", explanation: "适合分类的线性基线模型。" },
      { line: "max_iter=200", explanation: "给优化过程更多迭代次数，减少收敛警告。" },
    ],
    concepts: ["模型对象", "参数", "分类模型"],
    expected: "输出 LogisticRegression(max_iter=200)。",
    task: "把模型换成 KNN 或 DecisionTreeClassifier，观察后续代码哪些地方不用改。",
    errors: ["创建模型后以为已经训练完成。", "分类任务误用 LinearRegression。"],
  },
  {
    code: `model.fit(X_train, y_train)`,
    why: "fit 才是真正让模型从训练数据中学习特征和标签的关系。",
    explanation: [
      { line: "model.fit", explanation: "输入训练特征和训练标签，更新模型参数。" },
    ],
    concepts: ["fit", "模型训练", "参数学习"],
    expected: "训练完成通常没有输出；如果数据有 NaN 或非数值列，会抛出错误。",
    task: "训练前故意删掉一个特征列，看看错误信息或效果变化。",
    errors: ["X_train 和 y_train 行数不一致。", "数据中含有 NaN 却没有处理。"],
  },
  {
    code: `y_pred = model.predict(X_test)
print(y_pred[:10])`,
    why: "predict 用训练好的模型对测试集做预测，得到模型自己的答案。",
    explanation: [
      { line: "model.predict", explanation: "对测试特征生成预测类别。" },
      { line: "y_pred[:10]", explanation: "先看前 10 个预测结果是否像类别标签。" },
    ],
    concepts: ["predict", "预测结果", "测试集"],
    expected: "输出一组类别名称或类别编号。",
    task: "对比 y_pred[:10] 和 y_test[:10]，找出哪些样本预测错了。",
    errors: ["对训练集预测后误以为是泛化效果。", "预测前忘记先 fit。"],
  },
  {
    code: `acc = accuracy_score(y_test, y_pred)
print("Accuracy:", round(acc, 3))
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))`,
    why: "单看准确率不够，还要结合分类报告和混淆矩阵看错在哪里。",
    explanation: [
      { line: "accuracy_score", explanation: "计算整体预测正确比例。" },
      { line: "classification_report", explanation: "展示每类的 Precision、Recall、F1。" },
      { line: "confusion_matrix", explanation: "显示真实类别和预测类别的对应关系。" },
    ],
    concepts: ["Accuracy", "Precision", "Recall", "F1", "混淆矩阵"],
    expected: "Iris 示例通常能得到较高准确率，并看到类别之间的混淆情况。",
    task: "找出混淆矩阵中最容易混淆的两个类别。",
    errors: ["只汇报 Accuracy，不解释错分样本。", "把行列含义看反。"],
  },
  {
    code: `summary = {
    "goal": "根据花萼和花瓣特征预测鸢尾花类别",
    "features": feature_cols,
    "model": "LogisticRegression",
    "accuracy": round(acc, 3),
}
print(summary)`,
    why: "最后要把目标、特征、模型和结果串起来，形成能写进报告的实验结论。",
    explanation: [
      { line: "summary", explanation: "把实验关键信息整理成结构化摘要。" },
      { line: "accuracy", explanation: "记录核心指标，方便复盘和对比。" },
    ],
    concepts: ["实验报告", "复盘", "可复现"],
    expected: "输出包含目标、特征、模型和准确率的字典。",
    task: "用 3 句话写出这次实验的结论、局限和下一步改进。",
    errors: ["只有代码没有结论。", "没有记录参数，导致别人无法复现。"],
  },
];

const ASK_AGENT_OPTIONS = [
  { id: "auto", label: "自动分工" },
  { id: "qa", label: "通用问答" },
  { id: "concept", label: "概念讲解" },
  { id: "visual", label: "算法可视化" },
  { id: "code_tutor", label: "代码陪练" },
  { id: "result", label: "实验结果" },
  { id: "error", label: "错误诊断" },
  { id: "assessment", label: "测评诊断" },
  { id: "review", label: "总结复习" },
  { id: "planner", label: "学习规划" },
];

const FALLBACK_CONCEPTS = [
  "特征",
  "标签",
  "训练集和测试集",
  "过拟合",
  "欠拟合",
  "Accuracy",
  "Precision",
  "Recall",
  "F1",
  "混淆矩阵",
  "KNN",
  "K-means",
  "线性回归",
  "决策树",
];

const MOCK_CONCEPT_LESSONS = {
  "机器学习项目流程": {
    one_sentence: "机器学习项目通常是从问题定义开始，经过数据理解、训练模型、评估结果，再回到错误分析做改进。",
    simple_explanation: "可以把机器学习项目理解成一条流水线：先弄清楚要预测什么，再准备数据，让模型学习规律，最后检查它学得靠不靠谱。",
    analogy: "像做一次实验报告：先写研究问题，再准备材料，执行实验，记录结果，最后分析哪里做得好、哪里要改。",
    technical_definition: "机器学习流程是围绕任务目标组织数据、特征、模型、训练、评估和迭代的一组工程步骤。",
    why_it_matters: "流程清楚后，后面学特征、训练集、指标和混淆矩阵时就知道它们分别在项目中的位置。",
    formula_or_rule: "问题定义 -> 数据理解 -> 特征/标签 -> 训练/测试划分 -> 模型训练 -> 指标评估 -> 误差分析",
    project_connection: "这是整条学习路线的地图，后续每个知识点都会落到其中一个步骤。",
    code_connection: "# 机器学习项目的典型结构\n# 1. read data\n# 2. split X/y\n# 3. train model\n# 4. evaluate metrics",
    mini_example: "Iris 分类项目的目标是根据花萼和花瓣特征预测鸢尾花类别。",
    practice_task: "用自己的话写出一个分类任务的目标、输入数据和输出结果。",
    common_mistakes: ["一上来就调模型，忽略目标列和数据质量。", "只看 Accuracy，不分析错误样本。"],
    quiz: [
      { question: "为什么机器学习项目要先定义任务目标？", answer: "因为任务目标决定标签、特征、模型类型和评估指标。" },
      { question: "训练模型之后为什么还要做评估？", answer: "因为训练成功不代表泛化效果可靠，需要用测试集和指标检查。" },
    ],
    next_topics: ["特征与标签", "训练集和测试集", "Accuracy、Precision、Recall、F1"],
  },
  "特征与标签": {
    one_sentence: "特征是模型用来学习的输入信息，标签是模型要预测的目标答案。",
    simple_explanation: "如果模型要根据鸢尾花的花瓣长度、宽度判断种类，那么长度、宽度就是特征，花的种类就是标签。",
    analogy: "像老师根据学生的作业、出勤、测验成绩判断期末等级，前面的信息是特征，等级是标签。",
    technical_definition: "在监督学习中，X 表示特征矩阵，y 表示标签向量，模型学习从 X 到 y 的映射。",
    why_it_matters: "特征和标签分错，模型会学到错误关系，甚至把答案提前泄漏给自己。",
    formula_or_rule: "X = 输入特征列；y = 目标列；模型学习 f(X) -> y",
    project_connection: "它位于数据理解阶段，是训练/测试划分和模型训练的前置步骤。",
    code_connection: "feature_cols = ['sepal_length', 'sepal_width']\nX = df[feature_cols]\ny = df['target']",
    mini_example: "在 Iris 数据中，sepal_length、petal_width 等列是特征，target 是标签。",
    practice_task: "从一个 CSV 表中指出哪些列适合作为特征，哪一列适合作为标签，并说明理由。",
    common_mistakes: ["把 ID 当成有效特征。", "把目标列混进 X，造成数据泄漏。"],
    quiz: [
      { question: "X 和 y 分别表示什么？", answer: "X 是特征，y 是标签或目标列。" },
      { question: "为什么不能把标签列放进 X？", answer: "这会让模型提前看到答案，评估结果会虚高。" },
    ],
    next_topics: ["训练集和测试集", "数据泄漏", "基线模型"],
  },
  "训练集和测试集": {
    one_sentence: "训练集用来让模型学习，测试集用来检查模型面对新数据时表现如何。",
    simple_explanation: "不能用同一批题目既练习又考试，否则分数不能说明真的学会了。",
    analogy: "训练集像练习题，测试集像期末考试。",
    technical_definition: "train_test_split 将数据分成训练子集和测试子集，用测试集估计模型泛化能力。",
    why_it_matters: "没有独立测试集，就很难判断模型是学到规律，还是记住了训练样本。",
    formula_or_rule: "训练集: fit；测试集: predict + metrics",
    project_connection: "它连接数据准备和模型训练，是避免过拟合评估的重要步骤。",
    code_connection: "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)",
    mini_example: "150 条 Iris 样本可以用 120 条训练、30 条测试。",
    practice_task: "说明为什么 test_size 不能太小，并写出一行 train_test_split 代码。",
    common_mistakes: ["先在全量数据上标准化，再划分测试集。", "每次随机划分不同，导致结果无法复现。"],
    quiz: [
      { question: "训练集和测试集的作用有什么区别？", answer: "训练集用于学习参数，测试集用于评估泛化效果。" },
      { question: "random_state 的作用是什么？", answer: "固定随机划分，方便复现实验结果。" },
    ],
    next_topics: ["基线模型", "过拟合", "模型评估指标"],
  },
};

const ROUTABLE_VIEWS = [
  "dashboard",
  "settings",
  "plan",
  "concept",
  "visualize",
  "codeTutor",
  "experiment",
  "diagnose",
  "archive",
  "ask",
  "history",
  "notFound",
];

const REQUEST_TIMEOUT_MS = 15000;
const PLANNER_REQUEST_TIMEOUT_MS = 45000;
const OPTIONAL_AGENT_REQUEST_TIMEOUT_MS = 10000;
const OPTIONAL_AGENT_SERVER_TIMEOUT_SECONDS = 8;
const QUICK_ASK_COLLAPSED_KEY = "ml_tutor_quick_ask_collapsed";

const appState = {
  plan: null,
  concept: null,
  codeTutor: null,
  csvProfile: null,
  experiment: null,
  experimentReport: "",
  experimentRunId: 0,
  sampleDatasets: [],
  selectedSampleDatasetId: "iris",
  diagnosis: null,
  diagnosisReport: "",
  archiveRecords: [],
  selectedArchiveRecordId: null,
  selectedHistoryRecordId: null,
  askHistory: [],
  weakPoints: [],
  masteryRecords: [],
  assessmentSummary: null,
  reviewSummary: null,
  conceptPracticeResult: "",
  lastAskAnswer: null,
  transferContext: null,
  contextBridgeDismissed: false,
  currentCodeStep: 0,
  selectedPlanStageIndex: 0,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  renderAgentFlowMap();
  setupLLMSettings();
  setupPlanner();
  setupConcepts();
  setupKMeans();
  setupCodeTutor();
  setupExperiment();
  setupDiagnosis();
  setupArchive();
  setupHistoryView();
  setupOpenAsk();
  restoreActivePlanFromState();
  setupHashRouting();
  const initialView = viewFromHash();
  if (initialView && initialView !== currentViewName()) {
    navigateToView(initialView, { silent: true, skipHash: true });
  }
  refreshDashboard();
});

function setupNavigation() {
  $$("[data-view], [data-view-shortcut]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToView(button.dataset.view || button.dataset.viewShortcut);
    });
  });
  $("#context-actions").addEventListener("click", (event) => {
    const action = event.target.closest("[data-context-target], [data-context-dismiss]");
    if (!action) return;
    if (action.dataset.contextDismiss !== undefined) {
      appState.contextBridgeDismissed = true;
      $("#context-bridge").hidden = true;
      $("#context-bridge-tab").hidden = false;
      return;
    }
    navigateToView(action.dataset.contextTarget, {
      ...(appState.transferContext || {}),
      ...currentPageContext(),
      source: "学习接力",
    });
  });
  $("#context-bridge-tab").addEventListener("click", () => {
    appState.contextBridgeDismissed = false;
    $("#context-bridge-tab").hidden = true;
    renderContextBridge(currentViewName(), appState.transferContext);
  });
  if ($("#refresh-review-summary")) {
    $("#refresh-review-summary").addEventListener("click", () => refreshReviewSummary({ save: true }));
  }
}

function activateView(name) {
  $$(".view").forEach((view) => view.classList.remove("active"));
  const target = $(`#view-${name}`);
  if (!target) return;
  target.classList.add("active");
  $$(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  if (name === "archive") refreshArchive();
  if (name === "history") renderHistoryDetailView();
  if (name === "ask") refreshAskHistory();
  if (name === "dashboard") refreshDashboard();
  renderAskContextSummary();
  renderContextBridge(name, appState.transferContext);
}

function navigateToView(name, context = null) {
  if (!name) return;
  const targetName = normalizeTargetView(name);
  const sourceView = currentViewName();
  const normalized = normalizeTransferContext(context, sourceView, targetName);
  appState.transferContext = normalized;
  if (normalized) appState.contextBridgeDismissed = false;
  if (normalized) applyTransferContext(targetName, normalized);
  activateView(targetName);
  if (!context?.skipHash) updateHashForView(targetName);
}

function currentViewName() {
  return $(".view.active")?.id?.replace("view-", "") || "dashboard";
}

function setupHashRouting() {
  window.addEventListener("hashchange", () => {
    const target = viewFromHash();
    if (target && target !== currentViewName()) {
      navigateToView(target, { silent: true, skipHash: true });
    }
  });
}

function viewFromHash() {
  const raw = decodeURIComponent((window.location.hash || "").replace(/^#\/?/, "").trim());
  if (!raw) return "";
  if (ROUTABLE_VIEWS.includes(raw)) return raw;
  const aliases = {
    home: "dashboard",
    index: "dashboard",
    api: "settings",
    setting: "settings",
    settings: "settings",
    planning: "plan",
    planner: "plan",
    qa: "ask",
    question: "ask",
    code: "codeTutor",
    visual: "visualize",
    diagnosis: "diagnose",
    record: "archive",
    records: "archive",
    snapshot: "history",
  };
  return aliases[raw] || "notFound";
}

function updateHashForView(name) {
  if (!ROUTABLE_VIEWS.includes(name)) return;
  const nextHash = `#${name}`;
  if (window.location.hash !== nextHash) {
    window.location.hash = name;
  }
}

function normalizeTransferContext(context, sourceView, targetView) {
  if (!context || context.silent) return null;
  const meaningful = Object.entries(context).some(([key, value]) => key !== "source" && value !== undefined && value !== null && value !== "");
  if (!meaningful && !context.source) return null;
  return {
    ...context,
    sourceView,
    sourceLabel: context.source || viewLabel(sourceView),
    targetView,
  };
}

function applyTransferContext(targetView, context) {
  const topic = context.topic || context.concept || context.algorithm || context.stage || context.title || "";
  if (targetView === "ask") {
    const prompt = context.question || context.askPrompt || topic;
    if (prompt && $("#ask-input")) $("#ask-input").value = prompt;
  }
  if (targetView === "plan") {
    $("#learning-goal").value = context.goal || topic || $("#learning-goal").value;
    if (context.preference) $("#learning-preference").value = context.preference;
  }
  if (targetView === "concept") {
    $("#concept-topic").value = topic || $("#concept-topic").value;
    $("#concept-learning-goal").value = context.learningGoal || context.goal || `围绕“${topic || "当前主题"}”理解概念，并连接到代码和实验流程。`;
    syncConceptSelect();
  }
  if (targetView === "visualize") {
    const algorithm = inferVisualAlgorithm(topic);
    if (algorithm) {
      $("#visual-algorithm").value = algorithm;
      resetAlgorithmVisual(false);
    }
  }
  if (targetView === "codeTutor") {
    $("#code-learning-goal").value = context.codeGoal || context.goal || `围绕“${topic || "当前任务"}”生成可运行代码并解释关键步骤。`;
    if (context.project) $("#code-project").value = context.project;
    if (context.modelAlgorithm && $("#code-model")) $("#code-model").value = context.modelAlgorithm;
    selectCodeStep(context.stepIndex ?? inferCodeStepIndex(topic));
    if (context.code) {
      $("#code-block").textContent = context.code;
      $("#code-step-goal").textContent = "已带入上一模块的代码，可继续让代码陪练解释或改写。";
      $("#download-code-file").disabled = !context.code.trim();
    }
  }
  if (targetView === "experiment") {
    if (context.datasetName) $("#dataset-name").value = context.datasetName;
    if (context.csvText) $("#csv-text").value = context.csvText;
    if (context.targetColumn) $("#target-column").value = context.targetColumn;
    if (context.experimentGoal) {
      $("#experiment-output").innerHTML = `
        <div class="experiment-empty">
          <p class="eyebrow">Context Ready</p>
          <h2>已带入实验目标</h2>
          <p>${escapeHtml(context.experimentGoal)}</p>
        </div>
      `;
    }
    renderCsvPreview();
  }
  if (targetView === "diagnose") {
    $("#diagnosis-context").value = context.diagnosisContext || "机器学习建模、数据处理或 sklearn 实验";
    if (context.diagnosisStage || context.stage) $("#diagnosis-stage").value = context.diagnosisStage || context.stage;
    $("#diagnosis-severity").value = context.severity || "结果异常";
    $("#error-message").value = context.errorMessage || context.diagnosisPrompt || `请诊断“${topic || "当前机器学习任务"}”中可能存在的问题。`;
    $("#error-code").value = context.code || context.errorCode || "";
    $("#expected-behavior").value = context.expected || "希望定位问题原因，并给出可以继续学习或修复的下一步。";
    renderDiagnosisInputState();
  }
  if (targetView === "archive") {
    $("#archive-search").value = topic || context.search || "";
    if (context.archiveType) $("#archive-type-filter").value = context.archiveType;
  }
}

function syncConceptSelect() {
  const select = $("#concept-select");
  const topic = $("#concept-topic").value;
  if ([...select.options].some((option) => option.value === topic)) select.value = topic;
  syncConceptTopicSource();
}

function resolveConceptTopicInput() {
  const select = $("#concept-select");
  const customTopic = ($("#concept-topic")?.value || "").trim();
  const presetTopic = (select?.value || "").trim();
  const isCustom = Boolean(customTopic && customTopic !== presetTopic);
  return {
    topic: isCustom ? customTopic : (presetTopic || customTopic),
    topic_source: isCustom ? "custom" : "preset",
    source_label: isCustom ? "自定义输入" : "固定知识点",
  };
}

function syncConceptTopicSource() {
  const source = $("#concept-topic-source");
  if (!source) return;
  const info = resolveConceptTopicInput();
  source.dataset.source = info.topic_source;
  source.innerHTML = `
    <span>当前采用：${escapeHtml(info.source_label)}</span>
    <small>${escapeHtml(info.topic_source === "custom"
      ? `将讲解自定义知识点“${info.topic || "未填写"}”。`
      : `将讲解下拉/常用主题中的“${info.topic || "未选择"}”。`)}</small>
  `;
}

function inferVisualAlgorithm(text) {
  const value = String(text || "");
  if (/k[-\s]?means|聚类/i.test(value)) return "kmeans";
  if (/knn|最近邻/i.test(value)) return "knn";
  if (/线性回归|linear/i.test(value)) return "linear_regression";
  if (/决策树|tree/i.test(value)) return "decision_tree";
  if (/logistic|逻辑回归|softmax/i.test(value)) return "logistic_regression";
  if (/svm|支持向量/i.test(value)) return "svm";
  if (/random\s*forest|随机森林/i.test(value)) return "random_forest";
  if (/naive|bayes|朴素贝叶斯/i.test(value)) return "naive_bayes";
  if (/pca|主成分/i.test(value)) return "pca";
  if (/dbscan/i.test(value)) return "dbscan";
  if (/boost|提升|gbdt|xgboost/i.test(value)) return "gradient_boosting";
  if (/神经网络|neural|mlp/i.test(value)) return "neural_network";
  return "";
}

function currentPageContext() {
  const view = currentViewName();
  if (view === "plan") {
    const stage = getPlanStages(appState.plan || {})[appState.selectedPlanStageIndex] || {};
    return {
      source: "学习规划",
      goal: appState.plan?.learning_goal || $("#learning-goal").value,
      topic: stage.primary_topic || stage.name || $("#learning-goal").value,
      stage: stage.name,
      task: stage.practice || stage.task,
    };
  }
  if (view === "concept") {
    return {
      source: "概念学习",
      topic: appState.concept?.topic || $("#concept-topic").value,
      learningGoal: $("#concept-learning-goal").value,
      goal: appState.concept?.practice_task || "",
    };
  }
  if (view === "visualize") {
    return {
      source: "算法可视化",
      topic: currentVisualMeta().name,
      algorithm: currentVisualMeta().name,
      codeGoal: `用 Python 复现 ${currentVisualMeta().name} 的核心步骤`,
      experimentGoal: `用实验验证 ${currentVisualMeta().name} 的适用场景和观察指标。`,
    };
  }
  if (view === "codeTutor") {
    return {
      source: "代码陪练",
      topic: appState.codeTutor?.step_title || CODE_STEPS[appState.currentCodeStep],
      stepIndex: appState.currentCodeStep,
      code: $("#code-block").textContent || "",
      codeGoal: $("#code-learning-goal").value,
      project: $("#code-project").value,
      modelAlgorithm: $("#code-model").value,
      experimentGoal: "把当前代码步骤接入完整实验流程并观察输出。",
    };
  }
  if (view === "experiment") {
    return {
      source: "实验中心",
      topic: $("#dataset-name").value || "分类实验",
      datasetName: $("#dataset-name").value,
      targetColumn: $("#target-column").value,
      csvText: $("#csv-text").value,
      diagnosisContext: "模型训练、预测和评估指标计算",
      diagnosisStage: "指标评估",
      errorMessage: appState.experiment
        ? "请诊断本次分类实验结果是否存在指标偏低、类别混淆或数据质量问题。"
        : "请检查当前 CSV 实验配置是否完整、目标列是否正确。",
      code: appState.experiment ? JSON.stringify({
        metrics: appState.experiment.metrics,
        confusion_matrix: appState.experiment.confusion_matrix,
        data_summary: appState.experiment.data_summary,
      }, null, 2) : "",
      expected: "希望理解当前指标是否可靠，并找出下一步应该优化数据还是模型。",
    };
  }
  if (view === "diagnose") {
    return {
      source: "错误诊断",
      topic: appState.diagnosis?.error_type || $("#error-message").value.slice(0, 40) || "错误诊断",
      errorMessage: $("#error-message").value,
      code: appState.diagnosis?.fixed_code || appState.diagnosis?.minimal_repro_code || $("#error-code").value,
      codeGoal: "复现并修复诊断中发现的问题。",
    };
  }
  if (view === "archive") {
    const record = appState.archiveRecords.find((item) => item.uid === appState.selectedArchiveRecordId);
    return {
      source: "学习档案",
      topic: record?.title || $("#archive-search").value || "历史记录",
      title: record?.title,
      archiveType: $("#archive-type-filter").value !== "all" ? $("#archive-type-filter").value : "",
    };
  }
  if (view === "history") {
    const record = getSelectedHistoryRecord();
    return {
      source: "历史记录详情",
      topic: record?.title || "历史记录",
      title: record?.title,
      archiveType: record?.store || "",
    };
  }
  if (view === "ask") {
    return {
      source: "开放问答",
      topic: $("#ask-input")?.value?.slice(0, 48) || "开放问题",
      question: $("#ask-input")?.value || "",
    };
  }
  return { source: viewLabel(view) };
}

function buildLearnerProfile(source = "general") {
  const current = LocalArchive.getCurrentState();
  const levelBySource = {
    plan: $("#learner-level")?.value,
    concept: $("#concept-level")?.value,
    codeTutor: $("#code-learner-level")?.value,
    experiment: current.learner_profile?.level || $("#concept-level")?.value,
    diagnose: current.learner_profile?.level || $("#concept-level")?.value,
    ask: current.learner_profile?.level || $("#concept-level")?.value,
  };
  const level =
    levelBySource[source] ||
    current.learner_profile?.level ||
    current.learner_level ||
    "机器学习初学者";
  const goal =
    $("#learning-goal")?.value ||
    $("#concept-learning-goal")?.value ||
    current.current_goal ||
    appState.plan?.learning_goal ||
    "掌握机器学习基础流程";
  return {
    source,
    level,
    goal,
    preference: $("#learning-preference")?.value || appState.plan?.preference || current.learner_profile?.preference || "概念先行",
    pace: $("#learning-pace")?.value || appState.plan?.learning_pace || current.learner_profile?.pace || "标准路线（1-2 周）",
    weakness: $("#learning-weakness")?.value || appState.plan?.weakness_focus || current.learner_profile?.weakness || "暂不确定",
    current_stage: current.current_stage || appState.plan?.current_stage || "",
    progress: clampProgress(current.progress),
    active_stage_index: Number(current.active_stage_index || appState.selectedPlanStageIndex || 0),
    updated_at: new Date().toLocaleString(),
  };
}

function buildAgentHandoff(sourceAgent, targetAgent, context = {}) {
  return {
    source_agent: sourceAgent,
    target_agent: targetAgent,
    topic: context.topic || context.concept || context.stage || "",
    source_view: context.source_view || currentViewName(),
    target_view: context.target_view || "",
    learner_profile: context.learner_profile || buildLearnerProfile(context.profile_source || "general"),
    evidence: context.evidence || "",
    recommended_action: context.recommended_action || "",
    created_at: new Date().toLocaleString(),
  };
}

function createLocalAssessmentDiagnosis(archive = {}, learnerProfile = buildLearnerProfile("assessment")) {
  const mastery = asArray(archive.concept_mastery);
  const quizAttempts = asArray(archive.quiz_attempts);
  const weakPoints = asArray(archive.weak_points);
  const experiments = asArray(archive.experiment_records);
  const errors = asArray(archive.error_records);
  const masteryWeak = mastery
    .filter((item) => Number(item.mastery_score ?? 1) < 0.75)
    .map((item) => ({
      concept: item.concept || "掌握度偏低",
      severity: Number(item.mastery_score ?? 1) < 0.5 ? "高" : "中",
      reason: item.evidence || item.mastery_label || "掌握度记录显示需要复习。",
      suggested_action: `复习“${item.concept || "该知识点"}”并重新完成自测。`,
      source_type: item.source_type || "concept_mastery",
    }));
  const quizWeak = quizAttempts
    .filter((item) => /薄弱|错误|需要复习|wrong/i.test(item.result || item.status || ""))
    .map((item) => ({
      concept: item.concept || item.question || "自测题",
      severity: "中",
      reason: item.question || "自测题结果提示需要补强。",
      suggested_action: "回到概念讲解页复习，并补充自己的答案。",
      source_type: "quiz_attempt",
    }));
  const experimentWeak = experiments
    .filter((item) => Number(item.metrics?.macro_f1 ?? item.metrics?.accuracy ?? 1) < 0.75)
    .map((item) => ({
      concept: "模型评估指标",
      severity: "中",
      reason: `实验 ${item.model_name || "模型"} 的指标偏低。`,
      suggested_action: "复习混淆矩阵和 Precision/Recall，再设计一次改进实验。",
      source_type: "experiment",
    }));
  const errorWeak = errors.map((item) => ({
    concept: item.error_type || item.stage || "错误诊断",
    severity: /阻塞|严重/.test(item.severity || "") ? "高" : "中",
    reason: item.diagnosis || item.error_message || "错误诊断记录提示需要复盘。",
    suggested_action: "复现错误并按诊断步骤验证修复。",
    source_type: "error_record",
  }));
  const merged = dedupeAssessmentWeakPoints([
    ...weakPoints.map((item) => ({
      concept: item.concept || "薄弱点",
      severity: item.severity || "中",
      reason: item.reason || item.suggested_action || "已有薄弱点记录。",
      suggested_action: item.suggested_action || "优先复习该主题。",
      source_type: item.source_type || "weak_point",
    })),
    ...masteryWeak,
    ...quizWeak,
    ...experimentWeak,
    ...errorWeak,
  ]);
  const priorityTopics = merged.slice(0, 3).map((item) => item.concept);
  return {
    generated_by: "frontend_local",
    agent_role: "测评诊断 Agent",
    diagnosis_summary: priorityTopics.length
      ? `建议优先处理: ${priorityTopics.join("、")}。`
      : "当前记录没有明显薄弱点，可以继续推进下一阶段。",
    weak_points: merged,
    mastery_overview: {
      mastery_record_count: mastery.length,
      quiz_attempt_count: quizAttempts.length,
      experiment_count: experiments.length,
      error_count: errors.length,
    },
    recommended_actions: priorityTopics.length
      ? [
          { label: `复习${priorityTopics[0]}`, target_view: "concept" },
          { label: "查看学习档案", target_view: "archive" },
        ]
      : [{ label: "继续学习路线", target_view: "plan" }],
    learner_profile: learnerProfile,
    handoff_context: buildAgentHandoff("assessment_diagnosis", "review_coach", {
      topic: priorityTopics[0] || learnerProfile.current_stage,
      target_view: "archive",
      learner_profile: learnerProfile,
      evidence: priorityTopics.join("、"),
      recommended_action: "生成阶段复习计划。",
    }),
  };
}

function dedupeAssessmentWeakPoints(records = []) {
  const severityOrder = { "高": 0, "中": 1, "低": 2 };
  const byConcept = new Map();
  records.forEach((record) => {
    const concept = String(record.concept || "").trim();
    if (!concept) return;
    const existing = byConcept.get(concept);
    if (!existing || (severityOrder[record.severity] ?? 9) < (severityOrder[existing.severity] ?? 9)) {
      byConcept.set(concept, record);
    }
  });
  return Array.from(byConcept.values())
    .sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9))
    .slice(0, 5);
}

function createLocalReviewSummary(archive = {}, learnerProfile = buildLearnerProfile("review")) {
  const plans = asArray(archive.learning_plans);
  const learning = asArray(archive.learning_records);
  const experiments = asArray(archive.experiment_records);
  const errors = asArray(archive.error_records);
  const weakPoints = asArray(archive.weak_points);
  const mastery = asArray(archive.concept_mastery);
  const stageProgress = asArray(archive.stage_progress);
  const weakFromMastery = mastery
    .filter((item) => Number(item.mastery_score ?? 1) < 0.75)
    .map((item) => ({
      concept: item.concept || "掌握度偏低",
      severity: Number(item.mastery_score ?? 1) < 0.5 ? "高" : "中",
      reason: `掌握度约 ${Math.round(Number(item.mastery_score || 0) * 100)}%。`,
      suggested_action: `复习“${item.concept || "该知识点"}”并重做自测。`,
    }));
  const weak = dedupeAssessmentWeakPoints([
    ...weakPoints,
    ...weakFromMastery,
  ]);
  const currentStage = stageProgress[0]?.active_stage || plans[0]?.current_stage || learnerProfile.current_stage || "";
  const completedHighlights = [
    plans.length ? `已生成 ${plans.length} 条学习路线。` : "",
    learning.length ? `已保存 ${learning.length} 条学习记录。` : "",
    experiments.length ? `已完成 ${experiments.length} 次实验记录。` : "",
    errors.length ? `已沉淀 ${errors.length} 条诊断记录。` : "",
  ].filter(Boolean);
  const priorityTopics = weak.slice(0, 3).map((item) => item.concept);
  return {
    generated_by: "frontend_local",
    agent_role: "总结复习 Agent",
    review_summary: priorityTopics.length
      ? `当前建议先复习 ${priorityTopics.join("、")}，再继续${currentStage || "下一阶段"}。`
      : (completedHighlights[0] || "还没有足够记录，建议先完成一个知识点学习和练习。"),
    completed_highlights: completedHighlights.length ? completedHighlights : ["先完成知识点学习、练习或实验，系统会生成可复盘记录。"],
    weak_points_to_review: weak,
    study_plan: priorityTopics.length
      ? [`复习“${priorityTopics[0]}”。`, "重做对应自测题。", "回到学习路线推进下一阶段。"]
      : ["生成学习路线。", "完成一个知识点练习。", "保存记录后再次复盘。"],
    next_actions: priorityTopics.length
      ? [
          { label: `复习${priorityTopics[0]}`, target_view: "concept" },
          { label: "查看档案", target_view: "archive" },
          { label: "回到路线", target_view: "plan" },
        ]
      : [{ label: "生成学习路线", target_view: "plan" }],
    learner_profile: learnerProfile,
    handoff_context: buildAgentHandoff("review_coach", "learning_planner", {
      topic: priorityTopics[0] || currentStage,
      target_view: "plan",
      learner_profile: learnerProfile,
      evidence: completedHighlights.join(" "),
      recommended_action: "根据复习结果更新下一阶段学习路线。",
    }),
  };
}

async function collectLearningArchiveSnapshot() {
  return {
    learning_plans: await LocalArchive.getAll("learning_plans"),
    learning_records: await LocalArchive.getAll("learning_records"),
    experiment_records: await LocalArchive.getAll("experiment_records"),
    error_records: await LocalArchive.getAll("error_records"),
    agent_outputs: await LocalArchive.getAll("agent_outputs"),
    weak_points: await LocalArchive.getAll("weak_points"),
    mistake_records: await LocalArchive.getAll("mistake_records"),
    quiz_attempts: await LocalArchive.getAll("quiz_attempts"),
    concept_mastery: await LocalArchive.getAll("concept_mastery"),
    stage_progress: await LocalArchive.getAll("stage_progress"),
    assessment_records: await LocalArchive.getAll("assessment_records"),
    review_records: await LocalArchive.getAll("review_records"),
  };
}

async function refreshReviewSummary(options = {}) {
  const snapshot = await collectLearningArchiveSnapshot();
  const summary = createLocalReviewSummary(snapshot, buildLearnerProfile("review"));
  appState.reviewSummary = summary;
  if ($("#dash-review-summary")) {
    $("#dash-review-summary").textContent = summary.review_summary;
  }
  if (options.save) {
    await LocalArchive.addRecord("review_records", summary);
    await LocalArchive.addRecord("agent_outputs", {
      agent_name: "总结复习 Agent",
      input: "本地学习档案",
      output_summary: summary.review_summary,
      payload: summary,
      handoff_context: summary.handoff_context,
    });
    await refreshDashboard();
  }
  return summary;
}

function persistActivePlanState(options = {}) {
  if (!appState.plan) return;
  const stages = getPlanStages(appState.plan);
  const stageIndex = Number.isFinite(Number(options.stageIndex)) ? Number(options.stageIndex) : appState.selectedPlanStageIndex;
  const activeStage = stages[stageIndex] || stages.find((stage) => !stage.completed) || stages[0] || {};
  const progress = planProgressFromStages(stages);
  appState.plan.progress = progress;
  appState.plan.current_stage = activeStage.name || appState.plan.current_stage || "学习路线";
  appState.plan.stage_progress = stages.map((stage, index) => ({
    index,
    name: stage.name,
    target_view: stage.target_view,
    primary_topic: stage.primary_topic,
    completed: Boolean(stage.completed),
  }));
  const snapshot = {
    current_goal: appState.plan.learning_goal || "学习路线",
    current_stage: appState.plan.current_stage,
    progress,
    last_update: new Date().toLocaleString(),
    active_plan: appState.plan,
    active_stage_index: stageIndex,
    stage_progress: appState.plan.stage_progress,
    learner_profile: buildLearnerProfile("plan"),
  };
  LocalArchive.saveCurrentState(snapshot);
  if (options.recordStageProgress && LocalArchive.addRecord) {
    LocalArchive.addRecord("stage_progress", {
      plan_goal: snapshot.current_goal,
      active_stage: snapshot.current_stage,
      active_stage_index: stageIndex,
      progress,
      stage_progress: snapshot.stage_progress,
      learner_profile: snapshot.learner_profile,
    }).catch(() => {});
  }
}

function restoreActivePlanFromState() {
  const current = LocalArchive.getCurrentState();
  const restoredPlan = sanitizeStoredPlan(current.active_plan);
  if (!restoredPlan) return;
  appState.plan = restoredPlan;
  const stages = getPlanStages(restoredPlan);
  const maxIndex = Math.max(0, stages.length - 1);
  const restoredIndex = Number(current.active_stage_index || 0);
  appState.selectedPlanStageIndex = Math.min(maxIndex, Math.max(0, Number.isFinite(restoredIndex) ? restoredIndex : 0));
  if ($("#plan-output")) {
    renderPlan(appState.plan);
    $("#save-plan").disabled = false;
  }
}

function sanitizeStoredPlan(plan) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) return null;
  const stages = getPlanStages(plan);
  if (!stages.length) return null;
  return {
    ...plan,
    learning_goal: String(plan.learning_goal || "学习路线").trim() || "学习路线",
    current_stage: String(plan.current_stage || stages[0].name || "学习路线").trim() || "学习路线",
    stage_list: stages,
    progress: clampProgress(plan.progress ?? planProgressFromStages(stages)),
  };
}

function inferAskAgentFromQuestion(question, context = {}) {
  const text = `${question || ""} ${context.page || ""} ${JSON.stringify(context)}`.toLowerCase();
  if (/复盘|总结|复习|学习档案|下一轮|沉淀/.test(text)) return "review";
  if (/薄弱|掌握度|错题|自测|测评|诊断学习|学习画像/.test(text)) return "assessment";
  if (/报错|异常|错误|traceback|valueerror|修复|debug|诊断/.test(text)) return "error";
  if (/代码|python|sklearn|fit\(|predict|运行|复现|逐行/.test(text)) return "code_tutor";
  if (/指标|accuracy|precision|recall|f1|混淆矩阵|结果|实验/.test(text)) return "result";
  if (/路线|计划|阶段|怎么学|学习顺序|下一步/.test(text)) return "planner";
  if (/可视化|画布|图|k-means|knn|算法过程|观察/.test(text)) return "visual";
  if (/概念|原理|公式|为什么|解释|区别|定义/.test(text)) return "concept";
  return "qa";
}

function getRouteProfile(goal, preference) {
  const text = `${goal || ""} ${preference || ""}`.toLowerCase();
  if (/回归|regression|预测数值|房价/.test(text)) {
    return {
      kind: "regression",
      recommendedProject: "房价或成绩预测回归课程设计",
      overrides: [
        { name: "回归任务目标与项目流程", goal: "明确要预测的连续数值、输入特征和报告产出。", primary_topic: "回归预测项目流程", practice: "写出一个回归任务的预测目标、输入特征和评价指标。" },
        { name: "回归数据理解与目标变量", goal: "理解连续标签、特征分布、异常值和目标变量范围。", primary_topic: "连续标签与特征工程", learning_steps: ["识别连续型目标变量。", "观察特征范围和异常值。", "判断是否需要标准化或变换。"], practice: "指出一个回归数据表中的目标列，并说明它为什么不是分类标签。" },
        { name: "回归数据清洗与训练测试划分", goal: "掌握回归任务中的缺失值处理、特征缩放和训练/测试划分。", primary_topic: "回归数据划分与标准化", practice: "写出回归任务中的 train_test_split 代码，并说明 random_state 的作用。" },
        { name: "线性回归基线与代码复现", goal: "先用 LinearRegression 跑通完整回归训练流程。", primary_topic: "LinearRegression 基线模型", practice: "复现一个最小 LinearRegression 训练代码片段。" },
        { name: "回归指标与结果解释", goal: "理解 MAE、RMSE、R² 如何评价连续值预测结果。", primary_topic: "MAE、RMSE、R²", learning_steps: ["计算 MAE 和 RMSE。", "解释 R² 的含义和局限。", "判断误差是否满足课程设计目标。"], practice: "用 3 句话解释 MAE、RMSE、R² 各自回答什么问题。", success_criteria: ["能解释 MAE 和 RMSE 的区别。", "能判断 R² 高低是否支持项目结论。"] },
        { name: "残差分析与误差诊断", goal: "通过残差和异常样本定位回归预测偏差来源。", primary_topic: "残差分析", practice: "写出一次回归预测误差偏大的可能原因和验证办法。" },
        { name: "回归课程设计报告复盘", goal: "沉淀回归项目的数据、模型、指标、误差分析和改进方向。", primary_topic: "回归项目复盘", practice: "导出学习档案，并写出回归项目报告的结果分析段落提纲。" },
      ],
    };
  }
  if (/聚类|clustering|k-means|无监督|分群/.test(text)) {
    return {
      kind: "clustering",
      recommendedProject: "K-means 用户分群或鸢尾花聚类观察项目",
      overrides: [
        { name: "聚类学习目标与无监督任务定义", goal: "明确没有标签时要发现什么样的样本结构。", primary_topic: "无监督学习项目流程", practice: "写出一个聚类任务的样本、特征和希望观察到的分组现象。" },
        { name: "聚类数据理解与特征缩放", goal: "理解样本相似度、特征尺度和分布对聚类结果的影响。", primary_topic: "特征缩放与样本相似度", learning_steps: ["识别用于聚类的数值特征。", "比较不同特征的取值范围。", "理解标准化为什么会影响距离。"], practice: "说明为什么 K-means 前常常要做 StandardScaler。" },
        { name: "距离度量与训练数据准备", goal: "掌握欧氏距离、样本相似度和无监督任务的数据准备方式。", primary_topic: "距离度量与无监督数据", practice: "写出只使用特征矩阵 X 进行聚类的最小代码。" },
        { name: "K-means 基线与可视化观察", goal: "用 K-means 跑通聚类流程，并通过可视化理解中心点迭代。", target_view: "visualize", primary_topic: "K-means", learning_steps: ["选择 K-means 可视化。", "观察样本分配到最近中心点。", "记录中心点更新和收敛过程。"], practice: "解释 K 值变化会怎样影响聚类结果。" },
        { name: "聚类效果评估与轮廓系数", goal: "理解肘部法、轮廓系数和可视化观察如何评价聚类结果。", target_view: "visualize", primary_topic: "轮廓系数与肘部法", learning_steps: ["比较不同 K 值。", "理解轮廓系数代表簇内紧密和簇间分离。", "结合图形判断聚类是否稳定。"], practice: "说明轮廓系数较低时可能意味着什么。", success_criteria: ["能解释轮廓系数。", "能根据可视化判断 K 值是否合理。"] },
        { name: "簇解释与异常样本分析", goal: "把聚类结果转化为可解释的群体画像和异常点分析。", primary_topic: "簇解释与异常样本", practice: "为一个聚类结果写出 2 个簇的解释标签。" },
        { name: "聚类观察报告复盘", goal: "沉淀无监督学习过程、K 值选择、可视化证据和下一步实验。", primary_topic: "聚类项目复盘", practice: "导出学习档案，并写出聚类报告的观察结论和局限。" },
      ],
    };
  }
  return {
    kind: "classification",
    recommendedProject: /课程设计|答辩|报告/.test(text)
      ? "可复现的 CSV 分类实验课程设计"
      : "Iris 鸢尾花分类 MVP 练习",
    overrides: [],
  };
}

function createMockLearningPlan(payload) {
  const level = payload.level || "有 Python 基础，刚接触机器学习";
  const goal = payload.goal || "掌握机器学习分类任务";
  const preference = payload.preference || "概念先行";
  const pace = payload.pace || "标准路线（1-2 周）";
  const weakness = payload.weakness || "暂不确定";
  const routeProfile = getRouteProfile(goal, preference);
  const baseStages = [
    {
      name: "明确学习目标与项目流程",
      goal: "知道一个机器学习任务从哪里开始、最终要产出什么。",
      task: "理解机器学习项目流程，并写出本次学习目标。",
      agent: "概念导师 Agent",
      target_view: "concept",
      primary_topic: "机器学习项目流程",
      learning_steps: ["理解任务目标。", "区分输入、输出和评估方式。", "保存本阶段练习结果。"],
      practice: "写出一个分类任务的输入、输出和评价指标。",
      success_criteria: ["能说出完整项目流程。", "能解释为什么要先定义任务目标。"],
      related_pages: ["concept", "codeTutor", "archive"],
    },
    {
      name: "学习特征与标签",
      goal: "理解 X/y、特征列和目标列。",
      task: "完成特征与标签的分层讲解和自测。",
      agent: "概念导师 Agent",
      target_view: "concept",
      primary_topic: "特征与标签",
      learning_steps: ["看通俗解释。", "阅读代码示例。", "提交自测题。"],
      practice: "指出 Iris 数据中的特征列和标签列。",
      success_criteria: ["能区分特征和标签。", "能说明标签混入特征的风险。"],
      related_pages: ["concept", "experiment", "archive"],
    },
    {
      name: "理解训练集和测试集",
      goal: "知道为什么要划分训练集和测试集。",
      task: "学习 train_test_split 的作用和常见错误。",
      agent: "概念导师 Agent",
      target_view: "concept",
      primary_topic: "训练集和测试集",
      learning_steps: ["理解训练和测试的分工。", "查看 sklearn 代码。", "提交练习并保存进度。"],
      practice: "写出一行 train_test_split 代码并说明 random_state 的作用。",
      success_criteria: ["能解释测试集用途。", "能避免数据泄漏。"],
      related_pages: ["concept", "codeTutor", "archive"],
    },
    {
      name: "建立基线模型与代码复现",
      goal: "用简单模型先跑通完整训练流程。",
      task: "生成基线模型代码，完成 fit、predict 和基础输出。",
      agent: "代码陪练 Agent",
      target_view: "codeTutor",
      primary_topic: "基线模型",
      learning_steps: ["选择简单模型。", "训练模型并输出预测结果。", "保存代码和实验设置。"],
      practice: "复现一个最小可运行的 sklearn 训练流程。",
      success_criteria: ["能跑通 fit/predict。", "能说明基线模型的作用。"],
      related_pages: ["codeTutor", "experiment", "diagnose"],
    },
    {
      name: "训练模型与解释评估指标",
      goal: "理解模型表现要通过指标和错误样本共同判断。",
      task: "完成一次实验训练，并解释 Accuracy、Precision、Recall、F1。",
      agent: "结果解释 Agent",
      target_view: "experiment",
      primary_topic: "Accuracy、Precision、Recall、F1",
      learning_steps: ["训练模型。", "读取核心指标。", "判断指标是否支持项目结论。"],
      practice: "保存一次实验记录，并解释至少 3 个指标。",
      success_criteria: ["能解释主要指标。", "能判断模型表现是否可信。"],
      related_pages: ["experiment", "diagnose", "archive"],
    },
    {
      name: "误差分析与薄弱点诊断",
      goal: "从错误样本中发现数据、特征或模型问题。",
      task: "结合混淆矩阵或错误现象，生成诊断和改进方向。",
      agent: "错误诊断 Agent",
      target_view: "diagnose",
      primary_topic: "混淆矩阵与误差分析",
      learning_steps: ["找出主要错误类型。", "判断问题来源。", "提出可验证的改进方向。"],
      practice: "写出一个最需要改进的错误类型和验证办法。",
      success_criteria: ["能定位一个主要问题。", "能提出下一轮实验方案。"],
      related_pages: ["diagnose", "concept", "archive"],
    },
    {
      name: "学习档案与课程设计复盘",
      goal: "把路线、概念、代码、实验和诊断整理成复盘材料。",
      task: "查看学习档案，总结已掌握内容、薄弱点和下一步计划。",
      agent: "总结复习 Agent",
      target_view: "archive",
      primary_topic: "学习复盘与课程设计报告",
      learning_steps: ["回顾路线完成情况。", "查看薄弱点和错题记录。", "整理项目报告线索。"],
      practice: "导出学习档案，并写出下一轮要复习的 3 个主题。",
      success_criteria: ["能基于记录复盘学习过程。", "能说清下一步补概念、补代码还是补实验。"],
      related_pages: ["archive", "plan", "ask"],
    },
  ];
  const stages = baseStages.map((stage, index) => {
    const override = routeProfile.overrides[index] || {};
    const previousOverride = routeProfile.overrides[index - 1] || {};
    const merged = {
      ...stage,
      ...override,
      task: personalizeRouteTasks(override.task || stage.task, level, preference, override.target_view || stage.target_view, pace, weakness),
      learning_steps: personalizeRouteSteps(override.learning_steps || stage.learning_steps, level, preference, override.target_view || stage.target_view, index, pace, weakness),
      success_criteria: override.success_criteria || stage.success_criteria,
      related_pages: override.related_pages || stage.related_pages,
    };
    return {
      ...merged,
    sequence_order: index + 1,
      prerequisite: index === 0 ? "无" : (previousOverride.name || baseStages[index - 1].name),
    learner_level: level,
    completed: false,
    };
  });
  return {
    learning_goal: goal,
    learner_level: level,
    preference,
    learning_pace: pace,
    weakness_focus: weakness,
    factor_summary: factorSummary(level, preference, pace, weakness),
    current_stage: stages[0].name,
    progress: 0,
    next_step: stages[0].practice,
    recommended_project: routeProfile.recommendedProject,
    stage_list: stages,
    created_at: new Date().toLocaleString(),
    generated_by: "frontend_mock",
    route_model: `local_mock_${routeProfile.kind}_adaptive_v2`,
  };
}

function personalizeRouteSteps(steps, level, preference, targetView, index, pace, weakness) {
  const result = [...steps];
  if (index < 2 && /零基础|刚接触|初学/.test(level)) result.unshift("先看通俗解释和小例子，再进入术语和代码。");
  if (index < 2 && /会运行|sklearn/i.test(level)) result.unshift("直接对照 sklearn 流程检查每一步输入输出。");
  if (/独立完成|项目提升/.test(level) && ["experiment", "diagnose", "archive"].includes(targetView)) result.push("保留可写入课程设计报告的过程记录。");
  if (/代码/.test(preference) && ["codeTutor", "experiment", "visualize"].includes(targetView)) result.push("把本阶段操作整理成可复现代码或实验步骤。");
  if (/概念/.test(preference) && ["concept", "visualize"].includes(targetView)) result.push("先用自己的话复述概念，再进入代码或实验。");
  if (/实验/.test(preference) && ["experiment", "diagnose", "visualize"].includes(targetView)) result.push("记录实验现象、指标变化和可验证的改进假设。");
  if (/课程设计|答辩|报告/.test(preference) && ["codeTutor", "experiment", "diagnose", "archive"].includes(targetView)) result.push("整理目标、代码、指标、错误分析和结论，方便答辩展示。");
  if (/快速/.test(pace)) result.push("快速路线: 优先完成本阶段最小闭环，不展开延伸阅读。");
  if (/系统|深入/.test(pace)) result.push("系统深入路线: 补充原理、边界条件和一个对比实验。");
  if (/数学/.test(weakness) && ["concept", "experiment", "visualize"].includes(targetView)) result.push("用图示、类比或数值小例子解释公式和指标。");
  if (/代码/.test(weakness) && ["codeTutor", "experiment", "diagnose"].includes(targetView)) result.push("先复现模板代码，再只改一个参数观察变化。");
  if (/实验/.test(weakness) && ["experiment", "diagnose", "visualize"].includes(targetView)) result.push("记录指标变化、错误样本和下一轮实验假设。");
  if (/报告/.test(weakness) && ["archive", "experiment", "diagnose"].includes(targetView)) result.push("把本阶段结论整理成报告可用的三句话。");
  return uniqueStrings(result);
}

function personalizeRouteTasks(task, level, preference, targetView, pace, weakness) {
  const focus = [];
  if (/零基础|刚接触|初学/.test(level) && targetView === "concept") focus.push("先用通俗解释、类比和小练习建立理解");
  if (/会运行|sklearn/i.test(level) && ["codeTutor", "experiment", "diagnose"].includes(targetView)) focus.push("直接对照 sklearn 输入输出检查每一步");
  if (/独立完成|项目提升/.test(level) && ["experiment", "diagnose", "archive"].includes(targetView)) focus.push("把阶段产出沉淀成可展示的项目证据");
  if (/代码/.test(preference) && ["codeTutor", "experiment", "diagnose", "visualize"].includes(targetView)) focus.push("沉淀可复现代码和调试记录");
  if (/概念/.test(preference) && ["concept", "visualize"].includes(targetView)) focus.push("补充概念层解释和自测");
  if (/实验/.test(preference) && ["experiment", "diagnose", "visualize"].includes(targetView)) focus.push("记录实验现象、指标变化和改进假设");
  if (/课程设计|答辩|报告/.test(preference) && ["codeTutor", "experiment", "diagnose", "archive"].includes(targetView)) focus.push("保留可写进报告和答辩的目标、过程、结果、局限");
  if (/快速/.test(pace)) focus.push("按快速路线优先完成最小闭环");
  if (/系统|深入/.test(pace)) focus.push("按系统深入路线补充原理解释、边界条件和对比实验");
  if (/数学/.test(weakness) && ["concept", "experiment", "visualize"].includes(targetView)) focus.push("用数值小例子解释公式和指标含义");
  if (/代码/.test(weakness) && ["codeTutor", "experiment", "diagnose"].includes(targetView)) focus.push("先复现模板代码，再只改一个变量观察结果");
  if (/实验/.test(weakness) && ["experiment", "diagnose", "visualize"].includes(targetView)) focus.push("强化指标记录、错误样本和下一轮假设");
  if (/报告/.test(weakness) && ["archive", "experiment", "diagnose"].includes(targetView)) focus.push("把结论整理成报告可用的三句话");
  return focus.length ? `${task}重点: ${uniqueStrings(focus).join("；")}。` : task;
}

function factorSummary(level, preference, pace, weakness) {
  return `基础: ${level} | 重点: ${preference} | 节奏: ${pace} | 短板: ${weakness}`;
}

function personalizeMockConceptLessonByLevel(lesson, learnerProfile = {}) {
  const level = learnerProfile.level || $("#concept-level")?.value || "机器学习初学者";
  let difficulty = "beginner";
  let level_strategy = "机器学习初学者：用生活类比和最少术语建立直觉，再进入代码位置。";
  let simplePrefix = "先用直觉理解：";
  let principlePrefix = "直觉版原理：";
  let practicePrefix = "先完成一个短练习：";
  let codeHint = "# 初学者先关注变量含义，再看模型调用。";
  let keyPoint = "先能用自己的话复述概念，再看公式或代码。";
  let mistakeHint = "只背定义，不知道它在项目流程中的位置。";
  let reviewTip = "用一句话复述概念，再指出它对应到哪一步代码或实验。";

  if (level.includes("有 Python 基础")) {
    difficulty = "beginner_python";
    level_strategy = "有 Python 基础：保留直觉解释，同时把概念对应到变量、DataFrame 和函数调用。";
    simplePrefix = "结合 Python 变量理解：";
    principlePrefix = "代码视角原理：";
    practicePrefix = "用 Python 变量说清楚：";
    codeHint = "# Python 视角：先看输入变量、处理步骤和输出结果。";
    keyPoint = "把概念映射到 X、y、DataFrame、model 等代码对象。";
    mistakeHint = "能运行代码，但说不清每个变量代表的机器学习含义。";
    reviewTip = "对照代码写出输入、处理、输出三列笔记。";
  }
  if (level.includes("会运行 sklearn 示例")) {
    difficulty = "intermediate";
    level_strategy = "会运行 sklearn 示例：减少生活类比，强调 sklearn 流程、参数、数据形状和评价指标。";
    simplePrefix = "从 sklearn 流程看：";
    principlePrefix = "稍深入原理：";
    practicePrefix = "改一个 sklearn 示例验证：";
    codeHint = "# sklearn 视角：检查 fit/predict/metrics 的输入输出形状。";
    keyPoint = "关注数据形状、参数选择和指标解释之间的关系。";
    mistakeHint = "只会照抄示例，换数据或换指标后不知道该检查什么。";
    reviewTip = "用同一段 sklearn 示例改一个参数，并解释结果变化。";
  }
  if (level.includes("正在完成课程设计")) {
    difficulty = "project";
    level_strategy = "正在完成课程设计：用项目报告视角组织概念、实验证据、结论写法和可复现说明。";
    simplePrefix = "放到课程设计里看：";
    principlePrefix = "报告可用原理：";
    practicePrefix = "形成报告材料：";
    codeHint = "# 课程设计视角：保留参数、指标和结论，方便报告复现。";
    keyPoint = "把概念转成报告里的目标、方法、结果、局限和改进。";
    mistakeHint = "页面上看懂了，但报告里缺少指标证据和可复现实验过程。";
    reviewTip = "把本概念写成报告中的 3 句话：作用、证据、局限。";
  }

  const simpleExplanation = `${simplePrefix}${lesson.simple_explanation || lesson.one_sentence || ""}`;
  const principle = `${principlePrefix}${lesson.principle || lesson.technical_definition || ""}`;
  const practiceTask = `${practicePrefix}${lesson.practice_task || "完成一个小练习，并保存记录。"}`;
  return {
    ...lesson,
    learner_level: level,
    difficulty,
    level_strategy,
    simple_explanation: simpleExplanation,
    principle,
    explanation_layers: {
      ...(lesson.explanation_layers || {}),
      concept: simpleExplanation,
      principle,
      code: `${lesson.code_connection || ""}\n${codeHint}`,
      practice: practiceTask,
    },
    key_points: uniqueStrings([keyPoint, ...asArray(lesson.key_points)]).slice(0, 5),
    code_connection: `${lesson.code_connection || ""}\n${codeHint}`,
    common_mistakes: uniqueStrings([...asArray(lesson.common_mistakes), mistakeHint]).slice(0, 5),
    practice_task: practiceTask,
    mastery_signal: {
      ...(lesson.mastery_signal || {}),
      review_tip: reviewTip,
    },
  };
}

function getMockConceptLesson(topic, learnerProfile = {}) {
  const normalizedTopic = topic || "机器学习项目流程";
  const template = MOCK_CONCEPT_LESSONS[normalizedTopic] || MOCK_CONCEPT_LESSONS["机器学习项目流程"];
  const lesson = {
    topic: normalizedTopic,
    learner_level: learnerProfile.level || $("#concept-level")?.value || "机器学习初学者",
    difficulty: "beginner",
    topic_source: learnerProfile.topic_source || "preset",
    one_sentence: template.one_sentence,
    simple_explanation: template.simple_explanation,
    analogy: template.analogy,
    technical_definition: template.technical_definition,
    principle: template.technical_definition,
    explanation_layers: {
      concept: template.simple_explanation,
      principle: template.technical_definition,
      example: template.mini_example,
      code: template.code_connection,
      practice: template.practice_task,
    },
    key_points: [template.one_sentence, template.why_it_matters, template.project_connection],
    formula_or_rule: template.formula_or_rule,
    why_it_matters: template.why_it_matters,
    project_connection: template.project_connection,
    code_connection: template.code_connection,
    common_mistakes: template.common_mistakes,
    mini_example: template.mini_example,
    practice_task: template.practice_task,
    mastery_signal: {
      expected_skill: "能用自己的话解释概念，并把它对应到代码或实验流程。",
      weak_point_if_wrong: `如果无法完成练习，优先复习“${normalizedTopic}”的定义、代码位置和常见误区。`,
      review_tip: "先复述概念，再对照代码示例写出输入、处理和输出。",
    },
    quiz: template.quiz,
    next_topics: template.next_topics,
    related_actions: [
      { label: "进入代码陪练", target_view: "codeTutor" },
      { label: "回到学习路线", target_view: "plan" },
      { label: "查看学习档案", target_view: "archive" },
    ],
    generated_by: "frontend_mock",
    mock: true,
  };
  return personalizeMockConceptLessonByLevel(lesson, learnerProfile);
}

const VIEW_CONNECTIONS = {
  settings: ["ask", "plan", "dashboard"],
  ask: ["concept", "codeTutor", "experiment", "archive"],
  plan: ["ask", "concept", "visualize", "codeTutor", "experiment", "archive"],
  concept: ["ask", "visualize", "codeTutor", "experiment", "archive"],
  visualize: ["ask", "concept", "codeTutor", "experiment", "archive"],
  codeTutor: ["ask", "concept", "experiment", "diagnose", "archive"],
  experiment: ["ask", "concept", "diagnose", "archive", "codeTutor"],
  diagnose: ["ask", "concept", "codeTutor", "experiment", "archive"],
  archive: ["ask", "history", "plan", "concept", "experiment"],
  history: ["ask", "archive", "concept", "codeTutor", "experiment"],
  dashboard: ["ask", "plan", "concept", "experiment", "archive"],
};

function renderContextBridge(view, context) {
  const bridge = $("#context-bridge");
  if (!bridge) return;
  if (context) appState.contextBridgeDismissed = false;
  if ((view === "dashboard" && !context) || (appState.contextBridgeDismissed && !context)) {
    bridge.hidden = true;
    $("#context-bridge-tab").hidden = !appState.contextBridgeDismissed;
    return;
  }
  const targetLabel = viewLabel(view);
  const topic = context?.topic || context?.title || "";
  bridge.hidden = false;
  $("#context-bridge-tab").hidden = true;
  $("#context-title").textContent = context
    ? `已从${context.sourceLabel || context.source || "上一模块"}带入${targetLabel}`
    : `当前模块: ${targetLabel}`;
  $("#context-desc").textContent = context
    ? `上下文${topic ? `“${topic}”` : ""}已准备好，可直接继续操作或切换到相关模块。`
    : `你可以从${targetLabel}继续前往相关模块，系统会尽量保留当前输入和学习上下文。`;
  const actions = (VIEW_CONNECTIONS[view] || []).filter((target) => target !== view).slice(0, 4);
  $("#context-actions").innerHTML = `
    ${actions.map((target, index) => `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-context-target="${escapeHtml(target)}">${escapeHtml(viewLabel(target))}</button>`).join("")}
    <button type="button" class="ghost-button" data-context-dismiss>收起</button>
  `;
}

function friendlyErrorMessage(error) {
  const message = String(error?.message || "");
  if (error?.name === "AbortError") return "请求超时，请检查网络或模型接口状态后重试。";
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return "网络连接失败，请确认本地服务或模型接口正在运行后重试。";
  }
  return message || "请求失败，请稍后重试。";
}

function ensureAgentResponse(data) {
  if (data === undefined || data === null) {
    throw new Error("Agent 没有返回可用内容，请稍后重试。");
  }
  if (typeof data === "string" && !data.trim()) {
    throw new Error("Agent 没有返回可用内容，请稍后重试。");
  }
  if (Array.isArray(data) && !data.length) {
    throw new Error("Agent 没有返回可用内容，请稍后重试。");
  }
  if (typeof data === "object" && !Array.isArray(data)) {
    const hasMeaningfulValue = Object.values(data).some((value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return Boolean(value.trim());
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object") return Object.keys(value).length > 0;
      return true;
    });
    if (!hasMeaningfulValue) {
      throw new Error("Agent 没有返回可用内容，请稍后重试。");
    }
  }
  return data;
}

function requireInputValue(selector, message = "请先填写必要信息。") {
  const element = $(selector);
  const value = element?.value?.trim() || "";
  if (!value) {
    element?.focus?.();
    throw new Error(message);
  }
  return value;
}

async function postJson(url, payload, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new Error(`服务端返回格式异常，HTTP ${response.status}。请检查服务是否正常运行。`);
    }
    if (!json.ok) throw new Error(json.error || "请求失败");
    return json.data;
  } catch (error) {
    throw new Error(friendlyErrorMessage(error));
  } finally {
    clearTimeout(timeoutId);
  }
}

async function postAgentJson(url, payload, agentId, options = {}) {
  const data = await postJson(url, {
    ...payload,
    llm_config: getAgentLLMConfig(agentId),
  }, options);
  return ensureAgentResponse(data);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setupLLMSettings() {
  renderAgentSettings();
  fillSettingsForm(loadLLMSettings());
  $("#save-llm-settings").addEventListener("click", () => {
    saveLLMSettings(readSettingsForm());
    setSettingsMessage("设置已保存。", "ok");
    refreshDashboard();
  });
  $("#copy-shared-to-agents").addEventListener("click", () => {
    copySharedToAgentFields();
    setSettingsMessage("已把统一配置复制到全部 Agent，可继续微调后保存。", "ok");
  });
  $("#test-llm").addEventListener("click", testLLMConnection);
  $("#use-unified-config").addEventListener("change", updateAgentCardsDisabledState);
}

function defaultLLMSettings() {
  const blank = { base_url: "", api_key: "", model: "", temperature: 0.4, timeout: 60 };
  const agents = {};
  for (const agent of AGENTS) agents[agent.id] = { ...blank };
  return {
    use_unified: true,
    shared: { ...blank },
    agents,
  };
}

function loadLLMSettings() {
  const defaults = defaultLLMSettings();
  try {
    const saved = JSON.parse(localStorage.getItem("ml_tutor_llm_settings") || "{}");
    return {
      ...defaults,
      ...saved,
      shared: { ...defaults.shared, ...(saved.shared || {}) },
      agents: mergeAgentSettings(defaults.agents, saved.agents || {}),
    };
  } catch (error) {
    return defaults;
  }
}

function mergeAgentSettings(defaults, saved) {
  const result = {};
  for (const agent of AGENTS) {
    result[agent.id] = { ...defaults[agent.id], ...(saved[agent.id] || {}) };
  }
  return result;
}

function saveLLMSettings(settings) {
  localStorage.setItem("ml_tutor_llm_settings", JSON.stringify(settings));
}

function getAgentLLMConfig(agentId) {
  const settings = loadLLMSettings();
  const source = settings.use_unified ? settings.shared : (settings.agents[agentId] || settings.shared);
  if (!source.base_url || !source.model) {
    throw new Error(`请先在 API 设置中配置 ${agentLabel(agentId)} 的 API 地址和模型名称。`);
  }
  return { ...source };
}

function getOptionalAgentLLMConfig(agentId) {
  try {
    return getAgentLLMConfig(agentId);
  } catch (error) {
    return null;
  }
}

function withOptionalAgentTimeout(config) {
  const rawTimeout = Number(config?.timeout || OPTIONAL_AGENT_SERVER_TIMEOUT_SECONDS);
  return {
    ...config,
    timeout: Math.max(5, Math.min(OPTIONAL_AGENT_SERVER_TIMEOUT_SECONDS, Number.isFinite(rawTimeout) ? rawTimeout : OPTIONAL_AGENT_SERVER_TIMEOUT_SECONDS)),
  };
}

function withResultAgentTimeout(config) {
  const rawTimeout = Number(config?.timeout || 60);
  return {
    ...config,
    timeout: Math.max(15, Math.min(180, Number.isFinite(rawTimeout) ? rawTimeout : 60)),
  };
}

function agentRequestTimeoutMs(config) {
  return withResultAgentTimeout(config).timeout * 1000 + 5000;
}

function agentLabel(agentId) {
  return AGENTS.find((agent) => agent.id === agentId)?.name || agentId;
}

function coreRoleById(id) {
  return CORE_AGENT_ROLES.find((role) => role.id === id) || {};
}

function renderAgentFlowMap() {
  const target = $("#agent-flow-map");
  if (!target) return;
  const planner = coreRoleById("learning_planner");
  const tutor = coreRoleById("knowledge_tutor");
  const coder = coreRoleById("code_experiment");
  const assessor = coreRoleById("assessment_diagnosis");
  const reviewer = coreRoleById("review_coach");
  target.innerHTML = `
    <article class="agent-flow-step" data-core-agent="learning_planner">
      <span>01</span>
      <strong>${escapeHtml(planner.name || "学习规划 Agent")}</strong>
      <p>${escapeHtml(planner.responsibility || "生成学习路线。")}</p>
    </article>
    <article class="agent-flow-step" data-core-agent="knowledge_tutor">
      <span>02</span>
      <strong>${escapeHtml(tutor.name || "知识讲解 Agent")}</strong>
      <p>${escapeHtml(tutor.responsibility || "分层讲解知识点。")}</p>
    </article>
    <article class="agent-flow-step" data-core-agent="code_experiment">
      <span>03</span>
      <strong>${escapeHtml(coder.name || "代码实验 Agent")}</strong>
      <p>${escapeHtml(coder.responsibility || "连接代码和实验。")}</p>
    </article>
    <article class="agent-flow-step" data-core-agent="assessment_diagnosis">
      <span>04</span>
      <strong>${escapeHtml(assessor.name || "测评诊断 Agent")}</strong>
      <p>${escapeHtml(assessor.responsibility || "识别薄弱点。")}</p>
    </article>
    <article class="agent-flow-step" data-core-agent="review_coach">
      <span>05</span>
      <strong>${escapeHtml(reviewer.name || "总结复习 Agent")}</strong>
      <p>${escapeHtml(reviewer.responsibility || "生成复习建议。")}</p>
    </article>
  `;
}

function renderAgentSettings() {
  $("#agent-settings").innerHTML = AGENTS.map((agent) => `
    <article class="agent-card" data-agent-card="${agent.id}">
      <h2>${agent.name}</h2>
      <label>
        API 地址
        <input data-agent-id="${agent.id}" data-agent-field="base_url" placeholder="https://api.example.com/v1">
      </label>
      <label>
        API Key
        <input data-agent-id="${agent.id}" data-agent-field="api_key" type="password" autocomplete="off">
      </label>
      <label>
        模型名称
        <input data-agent-id="${agent.id}" data-agent-field="model" placeholder="model-name">
      </label>
      <label>
        Temperature
        <input data-agent-id="${agent.id}" data-agent-field="temperature" type="number" step="0.1" min="0" max="2">
      </label>
    </article>
  `).join("");
}

function fillSettingsForm(settings) {
  $("#use-unified-config").checked = settings.use_unified;
  $("#shared-base-url").value = settings.shared.base_url || "";
  $("#shared-api-key").value = settings.shared.api_key || "";
  $("#shared-model").value = settings.shared.model || "";
  $("#shared-temperature").value = settings.shared.temperature ?? 0.4;
  for (const agent of AGENTS) {
    const config = settings.agents[agent.id] || {};
    setAgentField(agent.id, "base_url", config.base_url || "");
    setAgentField(agent.id, "api_key", config.api_key || "");
    setAgentField(agent.id, "model", config.model || "");
    setAgentField(agent.id, "temperature", config.temperature ?? 0.4);
  }
  updateAgentCardsDisabledState();
}

function readSettingsForm() {
  const settings = defaultLLMSettings();
  settings.use_unified = $("#use-unified-config").checked;
  settings.shared = {
    base_url: $("#shared-base-url").value.trim(),
    api_key: $("#shared-api-key").value.trim(),
    model: $("#shared-model").value.trim(),
    temperature: Number($("#shared-temperature").value || 0.4),
    timeout: 60,
  };
  for (const agent of AGENTS) {
    settings.agents[agent.id] = {
      base_url: getAgentField(agent.id, "base_url").trim(),
      api_key: getAgentField(agent.id, "api_key").trim(),
      model: getAgentField(agent.id, "model").trim(),
      temperature: Number(getAgentField(agent.id, "temperature") || 0.4),
      timeout: 60,
    };
  }
  return settings;
}

function setAgentField(agentId, field, value) {
  const input = $(`[data-agent-id="${agentId}"][data-agent-field="${field}"]`);
  if (input) input.value = value;
}

function getAgentField(agentId, field) {
  return $(`[data-agent-id="${agentId}"][data-agent-field="${field}"]`)?.value || "";
}

function copySharedToAgentFields() {
  const shared = {
    base_url: $("#shared-base-url").value,
    api_key: $("#shared-api-key").value,
    model: $("#shared-model").value,
    temperature: $("#shared-temperature").value || 0.4,
  };
  for (const agent of AGENTS) {
    for (const [field, value] of Object.entries(shared)) {
      setAgentField(agent.id, field, value);
    }
  }
}

function updateAgentCardsDisabledState() {
  const disabled = $("#use-unified-config").checked;
  $$("[data-agent-card]").forEach((card) => {
    card.classList.toggle("muted-card", disabled);
    card.querySelectorAll("input").forEach((input) => {
      input.disabled = disabled;
    });
  });
}

async function testLLMConnection() {
  const settings = readSettingsForm();
  saveLLMSettings(settings);
  setSettingsMessage("正在测试接口连通性...", "");
  try {
    const data = await postJson("/api/test_llm", {
      agent_id: "planner",
      llm_config: settings.use_unified ? settings.shared : settings.agents.planner,
    });
    setSettingsMessage(data.message || "连接成功。", "ok");
  } catch (error) {
    setSettingsMessage(error.message, "error");
  }
  refreshDashboard();
}

function setSettingsMessage(text, kind) {
  const el = $("#llm-test-output");
  el.textContent = text;
  el.className = `settings-message ${kind || ""}`;
}

function setupOpenAsk() {
  renderAskAgentOptions();
  renderAskContextSummary();
  setupQuickAskCollapse();
  $("#quick-ask-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitOpenQuestion("quick");
  });
  $("#ask-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitOpenQuestion("full");
  });
  $("#quick-ask-open-full").addEventListener("click", () => {
    const question = $("#quick-ask-input").value.trim();
    navigateToView("ask", {
      source: "随时提问",
      question,
      topic: question || currentPageContext().topic || viewLabel(currentViewName()),
    });
    if (question) $("#ask-input").value = question;
  });
  $("#ask-use-page-context").addEventListener("click", () => {
    const context = buildOpenAskContext();
    $("#ask-input").value = context.suggested_question;
    renderAskContextSummary();
  });
  $("#ask-clear").addEventListener("click", () => {
    $("#ask-input").value = "";
    $("#ask-output").innerHTML = renderAskEmptyState();
  });
  $("#ask-refresh-history").addEventListener("click", refreshAskHistory);
  $$(".ask-template-row [data-ask-template]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#ask-input").value = button.dataset.askTemplate;
    });
  });
  $("#ask-history-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-ask-history-index]");
    if (!button) return;
    const item = appState.askHistory[Number(button.dataset.askHistoryIndex)];
    if (!item) return;
    $("#ask-input").value = item.input || item.raw?.input || "";
    appState.lastAskAnswer = item.payload || item.raw?.payload || item.raw || {};
    renderOpenAskAnswer(appState.lastAskAnswer, "#ask-output");
  });
  $("#quick-ask-output").addEventListener("click", handleAskActionClick);
  $("#ask-output").addEventListener("click", handleAskActionClick);
  refreshAskHistory();
}

function setupQuickAskCollapse() {
  const toggle = $("#quick-ask-toggle");
  if (!toggle) return;
  setQuickAskCollapsed(readQuickAskCollapsedPreference());
  toggle.addEventListener("click", () => {
    const shell = $("#quick-ask-shell");
    setQuickAskCollapsed(!shell?.classList.contains("collapsed"));
  });
}

function readQuickAskCollapsedPreference() {
  try {
    return localStorage.getItem(QUICK_ASK_COLLAPSED_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function setQuickAskCollapsed(collapsed) {
  const shell = $("#quick-ask-shell");
  const toggle = $("#quick-ask-toggle");
  if (!shell || !toggle) return;
  shell.classList.toggle("collapsed", collapsed);
  toggle.setAttribute("aria-expanded", String(!collapsed));
  toggle.setAttribute("title", collapsed ? "展开随时提问" : "折叠随时提问");
  const text = toggle.querySelector(".quick-ask-toggle-text");
  if (text) text.textContent = collapsed ? "展开" : "收起";
  const icon = toggle.querySelector(".quick-ask-toggle-icon");
  if (icon) icon.textContent = collapsed ? "⌄" : "⌃";
  try {
    localStorage.setItem(QUICK_ASK_COLLAPSED_KEY, String(collapsed));
  } catch (error) {
    console.warn("随时提问折叠状态暂时无法保存。", error);
  }
}

function renderAskAgentOptions() {
  const html = ASK_AGENT_OPTIONS
    .map((agent) => `<option value="${escapeHtml(agent.id)}">${escapeHtml(agent.label)}</option>`)
    .join("");
  $("#quick-ask-agent").innerHTML = html;
  $("#ask-agent").innerHTML = html;
}

function buildOpenAskContext() {
  const view = currentViewName();
  const context = currentPageContext();
  const selectedArchive = appState.archiveRecords.find((item) => item.uid === appState.selectedArchiveRecordId);
  return {
    page: viewLabel(view),
    view,
    topic: context.topic || context.title || "",
    source: context.source || viewLabel(view),
    context,
    selected_archive: selectedArchive ? {
      title: selectedArchive.title,
      type: selectedArchive.typeLabel,
      summary: selectedArchive.summary,
    } : null,
    current_outputs: {
      concept: appState.concept ? {
        topic: appState.concept.topic,
        summary: appState.concept.one_sentence || appState.concept.simple_explanation,
      } : null,
      code_step: appState.codeTutor ? {
        title: appState.codeTutor.step_title,
        goal: appState.codeTutor.step_goal,
      } : null,
      experiment: appState.experiment ? {
        model: appState.experiment.model_name,
        metrics: appState.experiment.metrics,
      } : null,
      diagnosis: appState.diagnosis ? {
        type: appState.diagnosis.error_type,
        cause: appState.diagnosis.root_cause || appState.diagnosis.reason,
      } : null,
    },
    learner_profile: buildLearnerProfile("ask"),
    weak_points: appState.weakPoints.slice(0, 5).map((item) => ({
      concept: item.concept,
      severity: item.severity,
      reason: item.reason,
      suggested_action: item.suggested_action,
    })),
    suggested_question: askSuggestedQuestion(view, context),
  };
}

function askSuggestedQuestion(view, context) {
  const topic = context.topic || context.title || viewLabel(view);
  const suggestions = {
    dashboard: "我现在应该从哪个模块开始学习？请根据首页状态给我建议。",
    settings: "API 设置里的 base_url、model 和 temperature 分别应该怎么填？",
    plan: `请解释学习规划里“${topic || "当前阶段"}”应该怎么学，并给我下一步。`,
    concept: `我不理解“${topic || "当前概念"}”，能用通俗例子和公式解释吗？`,
    visualize: `请解释当前算法可视化里的“${topic || "算法步骤"}”正在发生什么。`,
    codeTutor: `请逐行解释当前代码步骤“${topic || "代码"}”，并指出容易写错的地方。`,
    experiment: "请解释当前实验结果是否可信，以及下一步应该调数据还是调模型。",
    diagnose: "请把当前报错诊断成适合初学者理解的原因和修复步骤。",
    archive: `请帮我复盘学习档案里的“${topic || "这条记录"}”，并给出后续学习建议。`,
    history: `请帮我重新解释历史记录“${topic || "这条记录"}”，并指出值得复习的重点。`,
    ask: "请根据我当前的问题，给出更系统的学习路线和下一步实践。",
  };
  return suggestions[view] || `请解释“${topic}”，并给一个可以马上练习的小任务。`;
}

function renderAskContextSummary() {
  if (!$("#quick-ask-context")) return;
  const context = buildOpenAskContext();
  $("#quick-ask-context").textContent = `当前页面：${context.page}${context.topic ? ` · 主题：${context.topic}` : ""}`;
  if ($("#ask-context-summary")) {
    $("#ask-context-summary").innerHTML = `
      <div><span>页面</span><strong>${escapeHtml(context.page)}</strong></div>
      <div><span>主题</span><strong>${escapeHtml(context.topic || "当前页面")}</strong></div>
      <div><span>建议提问</span><p>${escapeHtml(context.suggested_question)}</p></div>
    `;
  }
}

async function submitOpenQuestion(mode) {
  const isQuick = mode === "quick";
  const input = isQuick ? $("#quick-ask-input") : $("#ask-input");
  const outputSelector = isQuick ? "#quick-ask-output" : "#ask-output";
  const question = input.value.trim();
  if (!question) {
    renderAskMessage(outputSelector, "请先输入你想问的问题。");
    return;
  }
  const requestedAgentId = isQuick ? $("#quick-ask-agent").value : $("#ask-agent").value;
  const context = buildOpenAskContext();
  const agentId = requestedAgentId === "auto" ? inferAskAgentFromQuestion(question, context) : requestedAgentId;
  const depth = isQuick ? "quick" : $("#ask-depth").value;
  renderAskMessage(outputSelector, requestedAgentId === "auto" ? `正在自动分配给${agentLabel(agentId)}...` : "正在调用大模型生成回答...");
  setAskFormBusy(isQuick, true);
  try {
    const data = await postAgentJson(
      "/api/open_question",
      {
        question,
        page: context.page,
        page_context: { ...context, answer_depth: depth },
        route_agent: requestedAgentId === "auto" ? "auto" : agentId,
        learner_profile: buildLearnerProfile("ask"),
        recent_history: appState.askHistory.slice(0, 4).map((item) => ({
          question: item.input,
          summary: item.output_summary,
        })),
      },
      agentId
    );
    appState.lastAskAnswer = data;
    renderOpenAskAnswer(data, outputSelector);
    await LocalArchive.addRecord("agent_outputs", {
      agent_name: "开放问答 Agent",
      input: question,
      output_summary: data.direct_answer || data.explanation || data.raw_answer || "",
      page: context.page,
      route_agent: data.route_agent || agentId,
      requested_route_agent: requestedAgentId,
      learner_profile: buildLearnerProfile("ask"),
      payload: data,
    });
    await refreshAskHistory();
    refreshDashboard();
  } catch (error) {
    renderAskMessage(outputSelector, error.message);
  } finally {
    setAskFormBusy(isQuick, false);
  }
}

function setAskFormBusy(isQuick, busy) {
  const form = isQuick ? $("#quick-ask-form") : $("#ask-form");
  form.querySelectorAll("button, textarea, select").forEach((control) => {
    control.disabled = busy;
  });
}

function renderAskMessage(selector, message) {
  const output = $(selector);
  if (!output) return;
  output.hidden = false;
  output.innerHTML = `<div class="message">${escapeHtml(message)}</div>`;
}

function renderAskEmptyState() {
  return `
    <div class="ask-empty-state">
      <p class="eyebrow">Ready</p>
      <h2>把卡住的问题交给问答 Agent</h2>
      <p>回答会优先结合当前页面、已有输入和最近学习记录，尽量给出可继续操作的解释，而不是孤立的百科式说明。</p>
    </div>
  `;
}

function renderOpenAskAnswer(data, selector) {
  const output = $(selector);
  if (!output) return;
  output.hidden = false;
  if (data.raw_answer && !data.direct_answer) {
    output.innerHTML = renderRawAnswer(data.raw_answer);
    return;
  }
  const points = normalizeAskList(data.key_points);
  const confusions = normalizeAskList(data.common_confusions);
  const nextSteps = normalizeAskList(data.next_steps);
  const followUps = normalizeAskList(data.follow_up_questions);
  output.innerHTML = `
    <article class="ask-answer-card">
      <div class="ask-answer-hero">
        <div>
          <p class="eyebrow">Generated Answer</p>
          <h2>${escapeHtml(data.title || data.question || "开放问答")}</h2>
          <p>${escapeHtml(data.direct_answer || data.explanation || "")}</p>
        </div>
        <span>${escapeHtml(agentLabel(data.route_agent || "qa"))}</span>
      </div>

      <section class="ask-section">
        <h3>解释</h3>
        <p>${escapeHtml(data.explanation || data.direct_answer || "")}</p>
      </section>

      ${data.formula_or_rule ? renderFormulaBlock("相关公式 / 规则", data.formula_or_rule, "这里会把公式转成可阅读的展示形式，避免直接暴露 LaTeX 源码。") : ""}

      <div class="ask-answer-grid">
        <section class="ask-section">
          <h3>关键点</h3>
          ${renderList(points)}
        </section>
        <section class="ask-section">
          <h3>例子</h3>
          <p>${escapeHtml(data.example || "可以继续追问，让问答 Agent 换一个更贴近当前任务的例子。")}</p>
        </section>
      </div>

      ${data.code_hint ? `<section class="ask-section code-linked"><h3>代码提示</h3><pre><code>${escapeHtml(data.code_hint)}</code></pre></section>` : ""}

      <div class="ask-answer-grid">
        <section class="ask-section">
          <h3>容易混淆</h3>
          ${renderList(confusions)}
        </section>
        <section class="ask-section">
          <h3>下一步</h3>
          ${renderList(nextSteps)}
        </section>
      </div>

      <section class="ask-section">
        <h3>继续追问</h3>
        <div class="ask-follow-row">
          ${followUps.map((question) => `<button type="button" data-ask-follow="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
        </div>
      </section>

      <div class="button-row ask-action-row">
        ${renderAskActionButtons(data.related_actions || [])}
      </div>
    </article>
  `;
  output.querySelectorAll("[data-ask-follow]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetInput = selector === "#quick-ask-output" ? $("#quick-ask-input") : $("#ask-input");
      targetInput.value = button.dataset.askFollow;
      targetInput.focus();
    });
  });
}

function normalizeAskList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === "object" ? JSON.stringify(item) : String(item)).filter(Boolean);
  }
  if (value === undefined || value === null || value === "") return [];
  return String(value).split(/\r?\n|；|;/).map((item) => item.trim()).filter(Boolean);
}

function renderAskActionButtons(actions) {
  const defaults = [
    { label: "去概念学习", target_view: "concept" },
    { label: "去代码陪练", target_view: "codeTutor" },
    { label: "查看档案", target_view: "archive" },
  ];
  const validTargets = ["ask", "concept", "visualize", "codeTutor", "experiment", "diagnose", "archive"];
  const safeActions = (Array.isArray(actions) && actions.length ? actions : defaults)
    .filter((action) => validTargets.includes(normalizeTargetView(action.target_view)))
    .slice(0, 3);
  return safeActions
    .map((action, index) => {
      const target = normalizeTargetView(action.target_view);
      return `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-ask-target="${escapeHtml(target)}">${escapeHtml(action.label || viewLabel(target))}</button>`;
    })
    .join("");
}

function handleAskActionClick(event) {
  const target = event.target.closest("[data-ask-target]");
  if (!target) return;
  navigateToView(target.dataset.askTarget, {
    ...currentPageContext(),
    source: "开放问答",
    topic: appState.lastAskAnswer?.title || appState.lastAskAnswer?.question || currentPageContext().topic,
  });
}

async function refreshAskHistory() {
  if (!window.LocalArchive) return;
  try {
    const records = await LocalArchive.getAll("agent_outputs");
    appState.askHistory = records
      .filter((record) => record.agent_name === "开放问答 Agent")
      .map((raw) => ({
        raw,
        input: raw.input || "",
        output_summary: raw.output_summary || "",
        time: raw.time || "",
        page: raw.page || "",
        payload: raw.payload || {},
      }))
      .slice(0, 8);
    renderAskHistory();
  } catch (error) {
    appState.askHistory = [];
    renderAskHistory();
  }
}

function renderAskHistory() {
  if (!$("#ask-history-list")) return;
  if (!appState.askHistory.length) {
    $("#ask-history-list").innerHTML = `<p class="empty-note">还没有问答记录。提问后会自动保存在本地档案中。</p>`;
    return;
  }
  $("#ask-history-list").innerHTML = appState.askHistory
    .map((item, index) => `
      <button type="button" class="ask-history-item" data-ask-history-index="${index}">
        <span>${escapeHtml(item.page || "开放问答")}</span>
        <strong>${escapeHtml(item.input || "未命名问题")}</strong>
        <small>${escapeHtml(item.output_summary || item.time || "")}</small>
      </button>
    `)
    .join("");
}

function setupPlanner() {
  $("#plan-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    let payload;
    try {
      payload = {
        level: $("#learner-level").value,
        goal: requireInputValue("#learning-goal", "请先填写学习目标，例如：掌握机器学习分类任务。"),
        preference: $("#learning-preference").value,
        pace: $("#learning-pace").value,
        weakness: $("#learning-weakness").value,
      };
    } catch (error) {
      setMessage("#plan-output", error.message);
      return;
    }
    setMessage("#plan-output", "正在调用学习规划 Agent...");
    try {
      const data = getOptionalAgentLLMConfig("planner")
        ? await postAgentJson("/api/learning_plan", payload, "planner", { timeoutMs: PLANNER_REQUEST_TIMEOUT_MS })
        : createMockLearningPlan(payload);
      appState.plan = data;
      appState.selectedPlanStageIndex = 0;
      renderPlan(data);
      $("#save-plan").disabled = false;
      persistActivePlanState({ stageIndex: 0, recordStageProgress: true });
      refreshDashboard();
    } catch (error) {
      const data = createMockLearningPlan(payload);
      appState.plan = {
        ...data,
        fallback_reason: error.message,
      };
      appState.selectedPlanStageIndex = 0;
      renderPlan(appState.plan);
      $("#save-plan").disabled = false;
      persistActivePlanState({ stageIndex: 0, recordStageProgress: true });
      refreshDashboard();
    }
  });

  $("#save-plan").addEventListener("click", async () => {
    if (!appState.plan) return;
    persistActivePlanState({ stageIndex: appState.selectedPlanStageIndex, recordStageProgress: true });
    await LocalArchive.addRecord("learning_plans", {
      ...appState.plan,
      view_snapshot: buildArchiveViewSnapshot("plan", appState.plan, appState.plan),
      learner_profile: buildLearnerProfile("plan"),
    });
    await LocalArchive.addRecord("agent_outputs", {
      agent_name: "学习规划 Agent",
      input: appState.plan.learning_goal || "学习路线",
      output_summary: appState.plan.next_step || appState.plan.raw_answer || "模型生成学习路线",
      payload: appState.plan,
    });
    $("#save-plan").disabled = true;
    refreshDashboard();
    renderContextBridge(currentViewName(), { ...currentPageContext(), source: "已保存到档案" });
  });
}

function renderPlan(data) {
  if (data.raw_answer) {
    $("#plan-output").innerHTML = renderRawAnswer(data.raw_answer);
    return;
  }
  const stages = getPlanStages(data);
  appState.selectedPlanStageIndex = Math.min(appState.selectedPlanStageIndex || 0, Math.max(0, stages.length - 1));
  const selected = stages[appState.selectedPlanStageIndex] || null;
  const factorSummaryText = data.factor_summary ? ` | 规划依据: ${data.factor_summary}` : "";
  $("#plan-output").innerHTML = `
    <div class="plan-flow-steps" aria-label="学习路线操作流程">
      <span>1 生成路线</span>
      <span>2 保存路线</span>
      <span>3 进入当前知识点</span>
      <span>4 学完后标记完成</span>
    </div>
    <div class="plan-summary">
      <div>
        <h3>${escapeHtml(data.learning_goal || "学习路线")}</h3>
        <p>${escapeHtml(data.next_step || "")}</p>
        <p class="meta-line">推荐项目: ${escapeHtml(data.recommended_project || "待模型补充")} | 进度: ${escapeHtml(data.progress ?? planProgressFromStages(stages))}%${escapeHtml(factorSummaryText)}</p>
      </div>
      <button class="secondary-button" type="button" data-plan-action="continue">继续当前阶段</button>
    </div>
    <div class="plan-layout">
      <div class="stage-list" aria-label="学习阶段列表">
        ${stages.map((stage, index) => `
          <button class="plan-stage-card ${index === appState.selectedPlanStageIndex ? "active" : ""} ${stage.completed ? "done" : ""}" type="button" data-plan-stage="${index}">
            <span class="stage-number">${index + 1}</span>
            <span>
              <strong>${escapeHtml(stage.name || `阶段 ${index + 1}`)}</strong>
              <small>${escapeHtml(stage.goal || "")}</small>
            </span>
          </button>
        `).join("")}
      </div>
      <div class="stage-detail" id="plan-stage-detail">
        ${renderPlanStageDetail(selected, appState.selectedPlanStageIndex)}
      </div>
    </div>
  `;
  bindPlanInteractions();
}

function getPlanStages(data) {
  return Array.isArray(data.stage_list)
    ? data.stage_list
        .filter((stage) => stage && typeof stage === "object" && !Array.isArray(stage))
        .map((stage, index) => normalizePlanStage(stage, index))
    : [];
}

function normalizePlanStage(stage, index) {
  const targetView = normalizeTargetView(stage.target_view || stage.targetView || inferTargetView(stage));
  return {
    ...stage,
    name: stage.name || `阶段 ${index + 1}`,
    goal: stage.goal || "",
    task: stage.task || "",
    agent: stage.agent || agentLabelFromView(targetView),
    target_view: targetView,
    primary_topic: stage.primary_topic || stage.topic || stage.name || "",
    learning_steps: asArray(stage.learning_steps || stage.steps || stage.route_steps),
    practice: stage.practice || stage.task || "",
    success_criteria: asArray(stage.success_criteria || stage.criteria || stage.acceptance),
    related_pages: asArray(stage.related_pages || stage.related_views),
    completed: Boolean(stage.completed),
  };
}

function renderPlanStageDetail(stage, index) {
  if (!stage) {
    return `<div class="empty-note">生成路线后，点击左侧阶段查看详细学习路径。</div>`;
  }
  const steps = stage.learning_steps.length
    ? stage.learning_steps
    : [
        `理解“${stage.primary_topic || stage.name}”的核心概念。`,
        stage.task || "完成该阶段对应练习。",
        "保存学习记录并回到路线继续下一阶段。",
      ];
  const criteria = stage.success_criteria.length
    ? stage.success_criteria
    : ["能说清楚本阶段核心概念。", "能完成对应页面中的实践任务。"];
  return `
    <article class="stage-detail-card">
      <div class="stage-detail-head">
        <div>
          <p class="eyebrow">${escapeHtml(stage.agent || "学习 Agent")}</p>
          <h3>${escapeHtml(stage.name)}</h3>
        </div>
        <span class="stage-chip">${escapeHtml(viewLabel(stage.target_view))}</span>
      </div>
      <p>${escapeHtml(stage.goal)}</p>
      <div class="detail-grid">
        <section>
          <h4>学习路线</h4>
          <ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </section>
        <section>
          <h4>完成标准</h4>
          <ul>${criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
      </div>
      <div class="practice-box">
        <strong>实践任务</strong>
        <p>${escapeHtml(stage.practice || stage.task || "进入对应页面完成本阶段练习。")}</p>
      </div>
      <div class="button-row">
        <button class="primary-button" type="button" data-plan-action="start" data-plan-stage-index="${index}">${escapeHtml(startButtonLabel(stage.target_view))}</button>
        <button class="ghost-button" type="button" data-plan-action="done" data-plan-stage-index="${index}">${stage.completed ? "已完成" : "标记完成"}</button>
      </div>
    </article>
  `;
}

function bindPlanInteractions() {
  $$("[data-plan-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedPlanStageIndex = Number(button.dataset.planStage);
      renderPlan(appState.plan);
    });
  });
  $$("[data-plan-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.planStageIndex ?? appState.selectedPlanStageIndex);
      const action = button.dataset.planAction;
      if (action === "start" || action === "continue") startPlanStage(index);
      if (action === "done") markPlanStageDone(index);
    });
  });
}

function startPlanStage(index) {
  const stage = getPlanStages(appState.plan)[index];
  if (!stage) return;
  appState.selectedPlanStageIndex = index;
  appState.plan.current_stage = stage.name;
  persistActivePlanState({ stageIndex: index, recordStageProgress: true });
  prepareTargetView(stage);
  refreshDashboard();
  navigateToView(stage.target_view, {
    source: "学习规划",
    goal: appState.plan.learning_goal || "学习路线",
    topic: stage.primary_topic || stage.name,
    stage: stage.name,
    task: stage.practice || stage.task,
    targetView: stage.target_view,
  });
}

function markPlanStageDone(index) {
  if (!appState.plan || !Array.isArray(appState.plan.stage_list)) return;
  appState.plan.stage_list[index] = { ...appState.plan.stage_list[index], completed: true };
  const stages = getPlanStages(appState.plan);
  const nextIndex = Math.min(index + 1, Math.max(0, stages.length - 1));
  appState.selectedPlanStageIndex = nextIndex;
  appState.plan.progress = planProgressFromStages(stages);
  appState.plan.current_stage = stages[nextIndex]?.name || appState.plan.current_stage;
  persistActivePlanState({ stageIndex: nextIndex, recordStageProgress: true });
  renderPlan(appState.plan);
  refreshDashboard();
}

function prepareTargetView(stage) {
  if (stage.target_view === "concept") {
    $("#concept-topic").value = stage.primary_topic || stage.name;
  }
  if (stage.target_view === "codeTutor") {
    const title = stage.primary_topic || stage.name;
    const index = inferCodeStepIndex(title);
    selectCodeStep(index);
  }
  if (stage.target_view === "diagnose") {
    $("#error-message").value = stage.primary_topic || "ValueError: Input contains NaN";
    $("#error-code").value = "model.fit(X_train, y_train)";
    $("#diagnosis-stage").value = "模型训练";
    $("#diagnosis-severity").value = "阻塞运行";
    $("#expected-behavior").value = "根据当前学习阶段定位错误原因，并给出可以直接尝试的修复方案。";
    renderDiagnosisInputState();
  }
  if (stage.target_view === "visualize") {
    $("#visual-explain").textContent = `当前阶段: ${stage.name}。请选择算法并点击“下一步”开始观察算法过程。`;
  }
}

function planProgressFromStages(stages) {
  if (!stages.length) return 0;
  return Math.round((stages.filter((stage) => stage.completed).length / stages.length) * 100);
}

function inferTargetView(stage) {
  const text = `${stage.name || ""} ${stage.goal || ""} ${stage.task || ""} ${stage.agent || ""}`;
  if (/错误|诊断|报错|error/i.test(text)) return "diagnose";
  if (/实验|训练|CSV|模型|评估|指标|混淆矩阵/i.test(text)) return "experiment";
  if (/代码|陪练|sklearn|Python/i.test(text)) return "codeTutor";
  if (/可视化|K-means|KNN|线性回归|算法/i.test(text)) return "visualize";
  if (/档案|复盘|记录/i.test(text)) return "archive";
  return "concept";
}

function normalizeTargetView(value) {
  const text = String(value || "").trim();
  const allowed = ["dashboard", "settings", "plan", "ask", "concept", "visualize", "codeTutor", "experiment", "diagnose", "archive", "history", "notFound"];
  if (allowed.includes(text)) return text;
  if (/dashboard|home|首页/i.test(text)) return "dashboard";
  if (/settings|setting|api|配置|设置/i.test(text)) return "settings";
  if (/plan|planner|规划|路线/i.test(text)) return "plan";
  if (/ask|qa|question|问答|提问/i.test(text)) return "ask";
  if (/code/i.test(text)) return "codeTutor";
  if (/visual|算法|可视化/i.test(text)) return "visualize";
  if (/experiment|实验|train/i.test(text)) return "experiment";
  if (/diagnose|error|错误|诊断/i.test(text)) return "diagnose";
  if (/history|snapshot|历史详情|历史记录/i.test(text)) return "history";
  if (/archive|record|档案|记录/i.test(text)) return "archive";
  return "concept";
}

function viewLabel(view) {
  return {
    dashboard: "首页",
    settings: "API 设置",
    ask: "开放问答",
    plan: "学习规划",
    concept: "概念学习",
    visualize: "算法可视化",
    codeTutor: "代码陪练",
    experiment: "实验中心",
    diagnose: "错误诊断",
    archive: "学习档案",
    history: "历史详情",
    notFound: "页面不存在",
  }[view] || "概念学习";
}

function startButtonLabel(view) {
  return `进入${viewLabel(view)}`;
}

function agentLabelFromView(view) {
  return {
    concept: "知识讲解 Agent",
    visualize: "知识讲解 Agent",
    codeTutor: "代码实验 Agent",
    experiment: "代码实验 Agent",
    diagnose: "测评诊断 Agent",
    archive: "总结复习 Agent",
    ask: "开放问答 Agent",
  }[view] || "知识讲解 Agent";
}

function inferCodeStepIndex(text) {
  const normalized = String(text || "");
  const index = CODE_STEPS.findIndex((step) => normalized.includes(step) || step.includes(normalized));
  return index >= 0 ? index : 0;
}

function setupConcepts() {
  renderConceptOptions(FALLBACK_CONCEPTS);
  $("#concept-select").addEventListener("change", () => {
    $("#concept-topic").value = $("#concept-select").value;
    syncConceptTopicSource();
  });
  $("#concept-topic").addEventListener("input", syncConceptTopicSource);
  $("#concept-topic-chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-concept-chip]");
    if (!button) return;
    $("#concept-topic").value = button.dataset.conceptChip;
    $("#concept-select").value = button.dataset.conceptChip;
    syncConceptTopicSource();
  });
  $("#concept-output").addEventListener("click", (event) => {
    const nextTopic = event.target.closest("[data-next-topic]");
    if (nextTopic) {
      $("#concept-topic").value = nextTopic.dataset.nextTopic;
      explainConcept();
      return;
    }
    const target = event.target.closest("[data-concept-target]");
    if (target) {
      navigateToView(target.dataset.conceptTarget, currentPageContext());
      return;
    }
    const resultButton = event.target.closest("[data-practice-result]");
    if (resultButton) {
      appState.conceptPracticeResult = resultButton.dataset.practiceResult;
      $$("[data-practice-result]").forEach((button) => {
        button.classList.toggle("selected", button === resultButton);
      });
      return;
    }
    const submitButton = event.target.closest("#submit-concept-practice");
    if (submitButton) {
      submitConceptPractice();
    }
  });
  $("#concept-go-experiment").addEventListener("click", () => navigateToView("experiment", currentPageContext()));
  $("#explain-concept").addEventListener("click", explainConcept);
  $("#save-concept").addEventListener("click", saveConcept);
  loadConceptOptions();
  syncConceptTopicSource();
}

async function loadConceptOptions() {
  try {
    const response = await fetch("/api/concepts");
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.concepts) || !data.concepts.length) {
      throw new Error(data.error || "概念列表加载失败");
    }
    renderConceptOptions(data.concepts);
  } catch (error) {
    renderConceptOptions(FALLBACK_CONCEPTS);
  }
}

function renderConceptOptions(concepts) {
  const topics = asArray(concepts).filter(Boolean);
  const currentTopic = $("#concept-topic")?.value || "";
  $("#concept-select").innerHTML = topics
    .map((topic) => `<option>${escapeHtml(topic)}</option>`)
    .join("");
  renderConceptTopicChips(topics);
  const selected = topics.includes(currentTopic)
    ? currentTopic
    : (topics.includes("过拟合") ? "过拟合" : topics[0]);
  $("#concept-select").value = selected || "";
  $("#concept-topic").value = currentTopic || selected || "过拟合";
  syncConceptTopicSource();
}

async function explainConcept() {
  const topicInput = resolveConceptTopicInput();
  let topic = topicInput.topic;
  if (!topic) {
    try {
      topic = requireInputValue("#concept-topic", "请先输入或选择一个知识点。");
    } catch (error) {
      setMessage("#concept-output", error.message);
      return;
    }
  }
  setMessage("#concept-output", "正在调用概念导师 Agent，整理讲解、代码联系和练习任务...");
  try {
    const data = getOptionalAgentLLMConfig("concept")
      ? await postAgentJson(
          "/api/concept_explain",
          {
            topic,
            topic_source: topicInput.topic_source,
            learner_level: $("#concept-level").value,
            scenario: $("#concept-scenario").value,
            learning_goal: $("#concept-learning-goal").value,
            learner_profile: buildLearnerProfile("concept"),
          },
          "concept"
        )
      : getMockConceptLesson(topic, { ...buildLearnerProfile("concept"), topic_source: topicInput.topic_source });
    data.topic_source = data.topic_source || topicInput.topic_source;
    appState.concept = data;
    appState.conceptPracticeResult = "";
    $("#save-concept").disabled = false;
    renderConcept(data);
  } catch (error) {
    const data = {
      ...getMockConceptLesson(topic, { ...buildLearnerProfile("concept"), topic_source: topicInput.topic_source }),
      topic_source: topicInput.topic_source,
      fallback_reason: error.message,
    };
    appState.concept = data;
    appState.conceptPracticeResult = "";
    $("#save-concept").disabled = false;
    renderConcept(data);
  }
}

function renderConcept(data) {
  if (data.raw_answer) {
    $("#concept-output").innerHTML = renderRawAnswer(data.raw_answer);
    return;
  }
  const keyPoints = asArray(data.key_points);
  const mistakes = asArray(data.common_mistakes);
  const nextTopics = asArray(data.next_topics);
  const quiz = Array.isArray(data.quiz) ? data.quiz : [];
  const actions = Array.isArray(data.related_actions) ? data.related_actions : [];
  $("#concept-output").innerHTML = `
    <div class="concept-result">
      <div class="concept-hero">
        <div>
          <p class="eyebrow">Concept Lesson</p>
          <h2>${escapeHtml(data.topic || "概念讲解")}</h2>
          <p>${escapeHtml(data.one_sentence || data.simple_explanation || "")}</p>
        </div>
        <div class="concept-badges">
          <span>${escapeHtml(data.learner_level || $("#concept-level").value)}</span>
          <span>${escapeHtml(data.topic_source === "custom" ? "自定义输入" : "固定知识点")}</span>
          <span>${escapeHtml($("#concept-scenario").value)}</span>
        </div>
      </div>
      ${data.level_strategy ? `<p class="concept-level-note">${escapeHtml(data.level_strategy)}</p>` : ""}

      <div class="concept-insight-grid">
        ${renderConceptInsight("通俗解释", data.simple_explanation)}
        ${renderConceptInsight("类比理解", data.analogy)}
        ${renderConceptInsight("技术定义", data.technical_definition)}
        ${renderConceptInsight("为什么重要", data.why_it_matters)}
      </div>

      <div class="concept-section">
        <h3>关键点</h3>
        ${renderList(keyPoints.length ? keyPoints : [data.simple_explanation, data.technical_definition].filter(Boolean))}
      </div>

      ${renderFormulaBlock("公式 / 判断规则", data.formula_or_rule, "把概念背后的计算方式或判断方法单独列出来，便于复习和对照代码。")}

      <div class="concept-two-column">
        <section class="concept-section">
          <h3>项目流程中的位置</h3>
          <p>${escapeHtml(data.project_connection || data.why_it_matters || "")}</p>
        </section>
        <section class="concept-section">
          <h3>具体小例子</h3>
          <p>${escapeHtml(data.mini_example || "")}</p>
        </section>
      </div>

      <div class="concept-section code-linked">
        <div>
          <h3>代码联系</h3>
          <p class="meta-line">把概念放回真实 sklearn / 数据处理流程中理解。</p>
        </div>
        <pre><code>${escapeHtml(data.code_connection || "# 模型未返回代码示例")}</code></pre>
      </div>

      <div class="concept-two-column">
        <section class="concept-section mistake-panel">
          <h3>常见误区</h3>
          ${renderList(mistakes)}
        </section>
        <section class="concept-section">
          <h3>学习提示</h3>
          <p>先理解公式或规则中的每个符号，再回到代码和实验结果里寻找它对应的数据、变量或指标。</p>
        </section>
      </div>

      <div class="practice-box concept-practice">
        <strong>本节练习</strong>
        <p>${escapeHtml(data.practice_task || "用自己的话解释这个概念，并指出它在实验中心中的对应步骤。")}</p>
        <label class="practice-answer-field">
          我的练习答案
          <textarea id="concept-practice-answer" rows="3" placeholder="用自己的话写下理解、代码位置或实验中的对应步骤。"></textarea>
        </label>
        <div class="practice-self-check" aria-label="练习自评">
          <button type="button" class="secondary-button" data-practice-result="correct">我答对了</button>
          <button type="button" class="secondary-button" data-practice-result="partial">不太确定</button>
          <button type="button" class="secondary-button" data-practice-result="wrong">答错了</button>
        </div>
        <button class="primary-button" type="button" id="submit-concept-practice">提交练习并保存进度</button>
        <p class="practice-feedback" id="concept-practice-feedback"></p>
      </div>

      ${renderQuiz(quiz)}

      <div class="concept-next-row">
        <section>
          <h3>下一步学习</h3>
          <div class="topic-chip-grid">
            ${nextTopics.map((topic) => `<button type="button" data-next-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`).join("")}
          </div>
        </section>
        <section>
          <h3>继续实践</h3>
          <div class="button-row">
            ${renderConceptActionButtons(actions)}
          </div>
        </section>
      </div>
    </div>
  `;
}

async function recordLearningSignals(sourceType, record = {}, payload = {}) {
  const learnerProfile = buildLearnerProfile(sourceType);
  const concepts = extractSignalConcepts(sourceType, record, payload);
  const masteryScore = estimateMasteryScore(sourceType, record, payload);
  for (const concept of concepts) {
    await LocalArchive.addRecord("concept_mastery", {
      concept,
      source_type: sourceType,
      source_title: record.topic || record.dataset_name || record.error_type || record.step_title || record.plan_goal || concept,
      mastery_score: masteryScore,
      mastery_label: masteryLabel(masteryScore),
      evidence: signalEvidence(sourceType, record, payload),
      learner_profile: learnerProfile,
      next_review_at: nextReviewDate(masteryScore < 0.7 ? 1 : 3),
    });
  }
  for (const item of buildWeakPointRecords(sourceType, record, payload, concepts, masteryScore, learnerProfile)) {
    await LocalArchive.addRecord("weak_points", item);
  }
  for (const item of buildMistakeRecords(sourceType, record, payload, learnerProfile)) {
    await LocalArchive.addRecord("mistake_records", item);
  }
  for (const item of buildQuizAttemptRecords(sourceType, record, payload, learnerProfile)) {
    await LocalArchive.addRecord("quiz_attempts", item);
  }
}

function extractSignalConcepts(sourceType, record, payload) {
  const concepts = [];
  if (record.topic) concepts.push(record.topic);
  if (record.category && !String(record.category).includes("代码陪练")) concepts.push(record.category);
  if (record.stage) concepts.push(record.stage);
  if (record.error_type) concepts.push(record.error_type);
  if (record.model_name) concepts.push(record.model_name);
  if (sourceType === "experiment") concepts.push("模型评估指标", "混淆矩阵", "数据质量");
  concepts.push(...asArray(payload.related_concepts));
  concepts.push(...asArray(payload.key_concepts));
  concepts.push(...asArray(payload.next_topics).slice(0, 2));
  return Array.from(new Set(concepts.map((item) => String(item || "").trim()).filter(Boolean))).slice(0, 6);
}

function estimateMasteryScore(sourceType, record, payload) {
  if (sourceType === "experiment") {
    const metrics = record.metrics || payload.metrics || {};
    const value = Number(metrics.macro_f1 ?? metrics.accuracy ?? 0.55);
    return Math.max(0.25, Math.min(0.95, Number.isFinite(value) ? value : 0.55));
  }
  if (sourceType === "diagnosis") return /阻塞|严重|异常/.test(record.severity || "") ? 0.35 : 0.45;
  if (sourceType === "codeTutor") return 0.62;
  if (sourceType === "concept") return payload.quiz?.length ? 0.58 : 0.52;
  return 0.5;
}

function masteryLabel(score) {
  if (score >= 0.85) return "已掌握";
  if (score >= 0.7) return "基本掌握";
  if (score >= 0.5) return "需要复习";
  return "薄弱";
}

function signalEvidence(sourceType, record, payload) {
  if (sourceType === "experiment") return record.explanation || JSON.stringify(record.metrics || {});
  if (sourceType === "diagnosis") return record.diagnosis || record.solution || record.error_message || "";
  if (sourceType === "codeTutor") return record.summary || payload.why || "";
  return record.summary || payload.one_sentence || payload.simple_explanation || "";
}

function buildWeakPointRecords(sourceType, record, payload, concepts, masteryScore, learnerProfile) {
  const records = [];
  if (masteryScore < 0.7) {
    records.push(...concepts.slice(0, 3).map((concept) => ({
      concept,
      source_type: sourceType,
      severity: masteryScore < 0.45 ? "高" : "中",
      reason: weakPointReason(sourceType, record, payload),
      suggested_action: weakPointAction(sourceType, concept),
      related_view: weakPointView(sourceType),
      review_count: 0,
      learner_profile: learnerProfile,
      next_review_at: nextReviewDate(1),
    })));
  }
  for (const mistake of asArray(payload.common_mistakes).slice(0, 3)) {
    records.push({
      concept: record.topic || concepts[0] || "常见误区",
      source_type: sourceType,
      severity: "中",
      reason: mistake,
      suggested_action: "回到概念学习页重新解释该误区，并完成自测题。",
      related_view: "concept",
      review_count: 0,
      learner_profile: learnerProfile,
      next_review_at: nextReviewDate(1),
    });
  }
  return records;
}

function weakPointReason(sourceType, record, payload) {
  if (sourceType === "experiment") return "实验指标或数据质量提示需要复盘。";
  if (sourceType === "diagnosis") return record.diagnosis || payload.root_cause || "保存了错误诊断，建议复习对应概念。";
  if (sourceType === "codeTutor") return "已练习代码步骤，但还需要通过运行和改写巩固。";
  return payload.mastery_signal?.weak_point_if_wrong || "已保存概念学习记录，建议完成自测确认掌握。";
}

function weakPointAction(sourceType, concept) {
  if (sourceType === "experiment") return "重新查看指标解释，结合混淆矩阵写出一个改进实验。";
  if (sourceType === "diagnosis") return "复现错误、应用修复代码，并记录防复发检查项。";
  if (sourceType === "codeTutor") return "独立重写当前步骤代码，并运行一次最小示例。";
  return `复习“${concept}”，完成本节练习和自测题。`;
}

function weakPointView(sourceType) {
  return {
    experiment: "experiment",
    diagnosis: "diagnose",
    codeTutor: "codeTutor",
    concept: "concept",
  }[sourceType] || "concept";
}

function buildMistakeRecords(sourceType, record, payload, learnerProfile) {
  const records = [];
  for (const mistake of asArray(payload.common_mistakes || payload.common_errors).slice(0, 4)) {
    records.push({
      concept: record.topic || payload.step_title || "常见错误",
      source_type: sourceType,
      mistake,
      correction: "重新阅读对应解释，并在练习中主动验证。",
      learner_profile: learnerProfile,
      status: "待复盘",
    });
  }
  if (sourceType === "diagnosis") {
    records.push({
      concept: record.error_type || "错误诊断",
      source_type: sourceType,
      mistake: record.error_message || payload.summary || "未记录具体报错",
      correction: record.solution || payload.immediate_fix || "按诊断步骤修复并验证。",
      learner_profile: learnerProfile,
      status: "待验证",
    });
  }
  if (sourceType === "experiment") {
    const metrics = record.metrics || {};
    const accuracy = Number(metrics.accuracy ?? metrics.macro_f1 ?? 1);
    if (accuracy < 0.75 || appState.csvProfile?.warnings?.length) {
      records.push({
        concept: "实验结果复盘",
        source_type: sourceType,
        mistake: appState.csvProfile?.warnings?.join("；") || "指标偏低，需要分析数据、模型或评估方式。",
        correction: "检查目标列、数据划分、类别分布和模型选择后重新实验。",
        learner_profile: learnerProfile,
        status: "待复盘",
      });
    }
  }
  return records;
}

function buildQuizAttemptRecords(sourceType, record, payload, learnerProfile) {
  if (sourceType !== "concept") return [];
  return asArray(payload.quiz).slice(0, 5).map((item, index) => ({
    concept: record.topic || payload.topic || "概念自测",
    question: item.question || String(item),
    expected_answer: item.answer || "",
    user_answer: "",
    result: "待完成",
    attempt_index: index + 1,
    learner_profile: learnerProfile,
  }));
}

function nextReviewDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function submitConceptPractice() {
  if (!appState.concept) return;
  const topic = appState.concept.topic || $("#concept-topic").value || "概念练习";
  const practiceAnswer = ($("#concept-practice-answer")?.value || "").trim();
  const quiz = Array.isArray(appState.concept.quiz) ? appState.concept.quiz : [];
  const quizAnswers = quiz.map((item, index) => ({
    concept: topic,
    question: item.question || String(item),
    expected_answer: item.answer || "",
    user_answer: ($(`[data-quiz-answer="${index}"]`)?.value || "").trim(),
    attempt_index: index + 1,
  }));
  const selfResult = appState.conceptPracticeResult || "partial";
  const masteryScore = calculatePracticeMastery(selfResult, quizAnswers, practiceAnswer);
  const resultLabel = practiceResultLabel(selfResult);
  const learnerProfile = buildLearnerProfile("concept");
  const record = {
    topic,
    category: "概念练习",
    status: resultLabel,
    summary: appState.concept.practice_task || appState.concept.one_sentence || "",
    practice_task: appState.concept.practice_task || "",
    practice_answer: practiceAnswer,
    quiz_answers: quizAnswers,
    mastery_score: masteryScore,
    learner_profile: learnerProfile,
    payload: appState.concept,
    handoff_context: buildAgentHandoff("knowledge_tutor", "assessment_diagnosis", {
      topic,
      target_view: "archive",
      learner_profile: learnerProfile,
      evidence: `${resultLabel}，掌握度 ${Math.round(masteryScore * 100)}%`,
      recommended_action: "根据练习结果更新薄弱点与复习建议。",
    }),
  };
  await LocalArchive.addRecord("learning_records", record);
  for (const answer of quizAnswers) {
    await LocalArchive.addRecord("quiz_attempts", {
      ...answer,
      result: resultLabel,
      learner_profile: learnerProfile,
    });
  }
  await LocalArchive.addRecord("concept_mastery", {
    concept: topic,
    source_type: "concept_practice",
    source_title: appState.concept.practice_task || topic,
    mastery_score: masteryScore,
    mastery_label: masteryLabel(masteryScore),
    evidence: practiceAnswer || quizAnswers.map((item) => item.user_answer).filter(Boolean).join("；"),
    learner_profile: learnerProfile,
    next_review_at: nextReviewDate(masteryScore < 0.7 ? 1 : 3),
  });
  if (masteryScore < 0.8) {
    await upsertWeakPoint({
      concept: topic,
      source_type: "concept_practice",
      severity: masteryScore < 0.5 ? "高" : "中",
      reason: `${resultLabel}：${appState.concept.mastery_signal?.weak_point_if_wrong || "练习结果显示还需要复习该知识点。"}`,
      suggested_action: appState.concept.mastery_signal?.review_tip || `重新学习“${topic}”并再次完成自测。`,
      related_view: "concept",
      review_count: 0,
      learner_profile: learnerProfile,
      next_review_at: nextReviewDate(1),
    });
  }
  const assessment = createLocalAssessmentDiagnosis({
    concept_mastery: [{
      concept: topic,
      mastery_score: masteryScore,
      mastery_label: masteryLabel(masteryScore),
      evidence: practiceAnswer,
      source_type: "concept_practice",
    }],
    quiz_attempts: quizAnswers.map((item) => ({ ...item, result: resultLabel })),
    weak_points: masteryScore < 0.8 ? [{
      concept: topic,
      severity: masteryScore < 0.5 ? "高" : "中",
      reason: `${resultLabel}：${appState.concept.mastery_signal?.weak_point_if_wrong || "练习结果显示还需要复习该知识点。"}`,
      suggested_action: appState.concept.mastery_signal?.review_tip || `重新学习“${topic}”并再次完成自测。`,
      source_type: "concept_practice",
    }] : [],
  }, learnerProfile);
  await LocalArchive.addRecord("assessment_records", assessment);
  updateCurrentStageAfterPractice(topic, masteryScore);
  $("#save-concept").disabled = true;
  const feedback = $("#concept-practice-feedback");
  if (feedback) {
    feedback.textContent = `已保存练习进度：${resultLabel}，掌握度 ${Math.round(masteryScore * 100)}%。刷新页面后可在首页和学习档案继续查看。`;
  }
  refreshDashboard();
  renderContextBridge(currentViewName(), { ...currentPageContext(), source: "练习已保存" });
}

function calculatePracticeMastery(selfResult, quizAnswers = [], practiceAnswer = "") {
  const baseScores = { correct: 0.9, partial: 0.65, wrong: 0.35 };
  let score = baseScores[selfResult] ?? 0.65;
  const answeredCount = quizAnswers.filter((item) => item.user_answer).length;
  if (!practiceAnswer) score -= 0.08;
  if (quizAnswers.length && answeredCount === 0) score -= 0.08;
  if (quizAnswers.length && answeredCount === quizAnswers.length) score += 0.04;
  return Math.max(0.2, Math.min(0.95, Number(score.toFixed(2))));
}

function practiceResultLabel(result) {
  return {
    correct: "已掌握",
    partial: "需要复习",
    wrong: "薄弱",
  }[result] || "需要复习";
}

async function upsertWeakPoint(record) {
  const existing = (await LocalArchive.getAll("weak_points"))
    .find((item) => item.concept === record.concept && item.source_type === record.source_type);
  if (existing?.id !== undefined) {
    await LocalArchive.putRecord("weak_points", {
      ...existing,
      ...record,
      review_count: Number(existing.review_count || 0) + 1,
      time: existing.time || new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
    });
    return;
  }
  await LocalArchive.addRecord("weak_points", record);
}

function updateCurrentStageAfterPractice(topic, masteryScore) {
  if (!appState.plan || !Array.isArray(appState.plan.stage_list)) {
    const current = LocalArchive.getCurrentState();
    LocalArchive.saveCurrentState({
      ...current,
      last_practice_topic: topic,
      last_practice_mastery: masteryScore,
      last_update: new Date().toLocaleString(),
      learner_profile: buildLearnerProfile("concept"),
    });
    return;
  }
  const stages = getPlanStages(appState.plan);
  const matchedIndex = stages.findIndex((stage) => {
    const text = `${stage.name || ""} ${stage.primary_topic || ""} ${stage.practice || ""}`;
    return topic && text.includes(topic);
  });
  const stageIndex = matchedIndex >= 0 ? matchedIndex : appState.selectedPlanStageIndex;
  appState.plan.stage_list[stageIndex] = {
    ...appState.plan.stage_list[stageIndex],
    practice_submitted: true,
    mastery_score: masteryScore,
    completed: masteryScore >= 0.7,
  };
  appState.selectedPlanStageIndex = masteryScore >= 0.7
    ? Math.min(stageIndex + 1, Math.max(0, stages.length - 1))
    : stageIndex;
  persistActivePlanState({ stageIndex: appState.selectedPlanStageIndex, recordStageProgress: true });
}

async function saveConcept() {
  if (!appState.concept) return;
  const conceptRecordBase = {
    topic: appState.concept.topic || "模型生成概念",
    category: $("#concept-scenario").value || "机器学习核心概念",
    status: "已学习",
    summary: appState.concept.one_sentence || appState.concept.simple_explanation || appState.concept.raw_answer || "",
    learner_level: $("#concept-level").value,
    topic_source: appState.concept.topic_source || resolveConceptTopicInput().topic_source,
    learning_goal: $("#concept-learning-goal").value,
    learner_profile: buildLearnerProfile("concept"),
    formula_or_rule: appState.concept.formula_or_rule || "",
    code_connection: appState.concept.code_connection || "",
    practice_task: appState.concept.practice_task || "",
    payload: appState.concept,
  };
  const record = {
    ...conceptRecordBase,
    view_snapshot: buildArchiveViewSnapshot("concept", conceptRecordBase, appState.concept),
  };
  await LocalArchive.addRecord("learning_records", record);
  await recordLearningSignals("concept", record, appState.concept);
  await LocalArchive.addRecord("agent_outputs", {
    agent_name: "概念导师 Agent",
    input: appState.concept.topic || "",
    output_summary: appState.concept.technical_definition || appState.concept.one_sentence || appState.concept.raw_answer || "",
    payload: appState.concept,
  });
  updateCurrentStageAfterPractice(appState.concept.topic || record.topic, 0.75);
  $("#save-concept").disabled = true;
  refreshDashboard();
  renderContextBridge(currentViewName(), { ...currentPageContext(), source: "已保存到档案" });
}

function renderConceptTopicChips(concepts) {
  const preferred = ["特征", "标签", "训练集和测试集", "过拟合", "混淆矩阵", "KNN", "K-means", "线性回归"];
  const topics = preferred.filter((topic) => concepts.includes(topic)).concat(concepts.filter((topic) => !preferred.includes(topic))).slice(0, 10);
  $("#concept-topic-chips").innerHTML = topics
    .map((topic) => `<button type="button" data-concept-chip="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`)
    .join("");
}

function renderConceptInsight(title, body) {
  return `
    <article class="concept-insight-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body || "模型未返回该部分内容。")}</p>
    </article>
  `;
}

function renderFormulaBlock(title, formula, note = "") {
  const source = Array.isArray(formula)
    ? formula
    : (formula && typeof formula === "object" ? [JSON.stringify(formula, null, 2)] : String(formula || "").split(/\r?\n|；|;/));
  const lines = asArray(source)
    .map((line) => String(line).trim())
    .filter(Boolean);
  const safeLines = lines.length ? lines : ["模型未返回公式或规则，可以重新生成并要求更具体。"];
  return `
    <section class="formula-block">
      <div class="formula-head">
        <div>
          <p class="eyebrow">Formula</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <span>可复习</span>
      </div>
      <div class="formula-lines">
        ${safeLines.map((line) => `<div class="formula-line">${renderFormulaExpression(line)}</div>`).join("")}
      </div>
      ${note ? `<p class="formula-note">${escapeHtml(note)}</p>` : ""}
    </section>
  `;
}

function renderFormulaExpression(raw) {
  const fractions = [];
  let text = String(raw || "").trim()
    .replace(/\$\$?/g, "")
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "");
  text = text.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_, numerator, denominator) => {
    const token = `@@FRAC_${fractions.length}@@`;
    fractions.push({ numerator, denominator });
    return token;
  });
  text = normalizeFormulaText(text);
  let html = escapeHtml(text);
  html = html.replace(/@@FRAC_(\d+)@@/g, (_, index) => {
    const item = fractions[Number(index)];
    if (!item) return "";
    return `<span class="formula-fraction"><span>${renderFormulaExpression(item.numerator)}</span><span>${renderFormulaExpression(item.denominator)}</span></span>`;
  });
  html = html
    .replace(/([A-Za-zμθλσΣΩΔŷŶ]+)_\{([^{}<>]+)\}/g, (_, base, sub) => `${base}<sub>${escapeHtml(sub)}</sub>`)
    .replace(/([A-Za-zμθλσΣΩΔŷŶ])_([A-Za-z0-9,+-]+)/g, (_, base, sub) => `${base}<sub>${escapeHtml(sub)}</sub>`)
    .replace(/\^\{([^{}<>]+)\}/g, (_, sup) => `<sup>${escapeHtml(sup)}</sup>`)
    .replace(/\^([0-9A-Za-z+-]+)/g, (_, sup) => `<sup>${escapeHtml(sup)}</sup>`)
    .replace(/[{}]/g, "");
  return html;
}

function normalizeFormulaText(text) {
  const replacements = [
    [/\\operatorname\{([^{}]+)\}/g, "$1"],
    [/\\hat\{y\}/g, "ŷ"],
    [/\\hat\{([^{}]+)\}/g, "$1̂"],
    [/\\bar\{([^{}]+)\}/g, "$1̄"],
    [/\\sqrt\s*\{([^{}]+)\}/g, "√($1)"],
    [/\\arg\s*\\?min/g, "argmin"],
    [/\\arg\s*\\?max/g, "argmax"],
    [/\\leq?|≤/g, "≤"],
    [/\\geq?|≥/g, "≥"],
    [/\\neq/g, "≠"],
    [/\\approx/g, "≈"],
    [/\\times/g, "×"],
    [/\\cdot/g, "·"],
    [/\\in/g, "∈"],
    [/\\notin/g, "∉"],
    [/\\sum/g, "Σ"],
    [/\\prod/g, "Π"],
    [/\\mu/g, "μ"],
    [/\\sigma/g, "σ"],
    [/\\theta/g, "θ"],
    [/\\lambda/g, "λ"],
    [/\\alpha/g, "α"],
    [/\\beta/g, "β"],
    [/\\gamma/g, "γ"],
    [/\\Delta/g, "Δ"],
    [/\\Omega/g, "Ω"],
    [/\\left|\\right/g, ""],
    [/\\,/g, " "],
    [/\\;/g, " "],
    [/\\:/g, " "],
    [/\\\s/g, " "],
    [/\\([A-Za-z]+)/g, "$1"],
  ];
  return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\s+/g, " ")
    .trim();
}

function renderList(items) {
  const safeItems = asArray(items).filter(Boolean);
  if (!safeItems.length) return `<p class="empty-note">暂无内容，可重新生成并要求模型补充。</p>`;
  return `<ul>${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderQuiz(quiz) {
  if (!quiz.length) return "";
  return `
    <div class="concept-section">
      <h3>自测题</h3>
      <div class="quiz-grid">
        ${quiz.map((item, index) => `
          <article class="quiz-card">
            <h4>${index + 1}. ${escapeHtml(item.question || item)}</h4>
            <label>
              我的答案
              <textarea rows="2" data-quiz-answer="${index}" placeholder="先自己回答，再查看参考答案。"></textarea>
            </label>
            <details>
              <summary>查看参考答案</summary>
              <p>${escapeHtml(item.answer || "尝试先自己回答，再重新生成查看参考答案。")}</p>
            </details>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderConceptActionButtons(actions) {
  const defaults = [
    { label: "进入代码陪练", target_view: "codeTutor" },
    { label: "去实验中心验证", target_view: "experiment" },
    { label: "保存后查看档案", target_view: "archive" },
  ];
  const valid = (actions.length ? actions : defaults)
    .filter((action) => ["concept", "visualize", "codeTutor", "experiment", "diagnose", "archive"].includes(action.target_view))
    .slice(0, 3);
  return valid
    .map((action, index) => `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-concept-target="${escapeHtml(action.target_view)}">${escapeHtml(action.label || viewLabel(action.target_view))}</button>`)
    .join("");
}

const VISUAL_ALGORITHMS = {
  kmeans: {
    name: "K-means 聚类",
    shortName: "K-means",
    goal: "观察样本分配和中心点更新如何反复降低簇内距离。",
    focus: ["中心点初始化会影响结果", "样本被分配到最近中心", "中心点会移动到簇均值", "重复直到中心基本稳定"],
  },
  knn: {
    name: "KNN 分类",
    shortName: "KNN",
    goal: "观察一个未知样本如何根据最近邻类别完成预测。",
    focus: ["k 值会影响边界平滑程度", "距离越近投票影响越大", "类别重叠会带来不确定性", "特征尺度会影响距离"],
  },
  linear_regression: {
    name: "线性回归",
    shortName: "线性回归",
    goal: "观察直线参数如何通过误差下降逐步贴近数据趋势。",
    focus: ["斜率决定线的方向", "截距决定整体高度", "损失衡量预测误差", "梯度下降按误差方向更新参数"],
  },
  decision_tree: {
    name: "决策树分类",
    shortName: "决策树",
    goal: "观察树模型如何用一条条规则切分特征空间。",
    focus: ["每个节点选择一个切分规则", "切分让子区域更纯", "深度越大越容易贴合训练集", "过深可能导致过拟合"],
  },
  logistic_regression: {
    name: "逻辑回归 / Softmax 回归",
    shortName: "Logistic",
    goal: "观察线性打分如何经过概率函数形成分类边界。",
    focus: ["模型先计算线性得分", "Sigmoid 或 Softmax 把得分转成概率", "阈值决定分类结果", "正则化能控制边界复杂度"],
    generic: true,
  },
  svm: {
    name: "支持向量机 SVM",
    shortName: "SVM",
    goal: "观察最大间隔边界如何由支持向量决定。",
    focus: ["离边界最近的点是支持向量", "间隔越大通常泛化越稳", "核函数可形成非线性边界", "C 参数控制容错和间隔"],
    generic: true,
  },
  random_forest: {
    name: "随机森林",
    shortName: "Random Forest",
    goal: "观察多棵决策树如何投票降低单棵树的不稳定性。",
    focus: ["每棵树看到不同样本和特征", "单棵树可能偏差较大", "集成投票提升稳定性", "特征重要性来自多棵树的统计"],
    generic: true,
  },
  naive_bayes: {
    name: "朴素贝叶斯",
    shortName: "Naive Bayes",
    goal: "观察先验概率和条件概率如何组合成类别判断。",
    focus: ["先验描述类别本身常见程度", "条件概率描述特征在类别下的可能性", "朴素假设把特征近似看成独立", "适合文本分类等高维稀疏任务"],
    generic: true,
  },
  pca: {
    name: "PCA 主成分分析",
    shortName: "PCA",
    goal: "观察数据如何投影到方差最大的方向完成降维。",
    focus: ["第一主成分保留最大方差", "降维会压缩信息", "适合可视化和去冗余", "需要注意特征尺度"],
    generic: true,
  },
  dbscan: {
    name: "DBSCAN 密度聚类",
    shortName: "DBSCAN",
    goal: "观察核心点、边界点和噪声点如何由密度规则决定。",
    focus: ["半径 eps 决定邻域范围", "min_samples 决定核心点", "可发现非球形簇", "对尺度和密度差异敏感"],
    generic: true,
  },
  gradient_boosting: {
    name: "梯度提升树",
    shortName: "Boosting",
    goal: "观察模型如何一轮轮拟合残差，逐步修正错误。",
    focus: ["每一轮关注上一轮没学好的部分", "学习率控制每棵树贡献", "轮数过多可能过拟合", "适合结构化表格数据"],
    generic: true,
  },
  neural_network: {
    name: "神经网络",
    shortName: "Neural Net",
    goal: "观察多层参数如何通过前向传播和反向传播学习非线性映射。",
    focus: ["隐藏层组合出非线性特征", "损失函数衡量输出误差", "反向传播计算梯度", "学习率影响收敛稳定性"],
    generic: true,
  },
  custom_algorithm: {
    name: "自定义常见算法",
    shortName: "自定义",
    goal: "用通用训练流程观察该算法的数据输入、拟合、判断和评估方式。",
    focus: ["输入数据如何表示", "模型学习的核心对象是什么", "预测或聚类规则如何产生", "用哪些指标判断结果可靠"],
    generic: true,
  },
};

let visualState = {};

function setupKMeans() {
  $("#visual-algorithm").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#visual-dataset").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#cluster-count").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#knn-k").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#regression-rate").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#tree-depth").addEventListener("change", () => resetAlgorithmVisual(false));
  $("#custom-visual-algorithm").addEventListener("input", () => resetAlgorithmVisual(false));
  $("#reset-visual").addEventListener("click", () => resetAlgorithmVisual(true));
  $("#step-visual").addEventListener("click", stepAlgorithmVisual);
  $("#explain-visual").addEventListener("click", () => requestVisualExplanation(visualState.action || "当前状态"));
  $("#visual-go-code").addEventListener("click", () => {
    navigateToView("codeTutor", currentPageContext());
  });
  $("#visual-explain").addEventListener("click", handleVisualExplainAction);
  resetAlgorithmVisual(false);
}

function currentVisualAlgorithm() {
  return $("#visual-algorithm").value;
}

function currentVisualMeta() {
  const algorithm = currentVisualAlgorithm();
  const meta = VISUAL_ALGORITHMS[algorithm] || VISUAL_ALGORITHMS.custom_algorithm;
  if (algorithm !== "custom_algorithm") return meta;
  const customName = $("#custom-visual-algorithm").value.trim() || "自定义常见算法";
  return {
    ...meta,
    name: customName,
    shortName: customName,
    goal: `观察 ${customName} 的训练、判断和评估流程。`,
  };
}

function visualAlgorithmBehavior(algorithm = currentVisualAlgorithm()) {
  const precise = ["kmeans", "knn", "linear_regression", "decision_tree"];
  if (precise.includes(algorithm)) {
    return {
      mode: "精细状态模拟",
      note: "画布会按该算法的关键计算步骤更新状态。",
    };
  }
  return {
    mode: "概念流程演示",
    note: "画布用于展示算法机制和学习顺序，不等同于完整数值求解器。",
  };
}

function resetAlgorithmVisual(showMessage = true) {
  const algorithm = currentVisualAlgorithm();
  const dataset = $("#visual-dataset").value;
  if (algorithm === "kmeans") visualState = createKMeansState(dataset);
  if (algorithm === "knn") visualState = createKnnState(dataset);
  if (algorithm === "linear_regression") visualState = createRegressionState(dataset);
  if (algorithm === "decision_tree") visualState = createTreeState(dataset);
  if (VISUAL_ALGORITHMS[algorithm]?.generic || algorithm === "custom_algorithm") visualState = createGenericAlgorithmState(algorithm, dataset);
  renderVisualParamGroups();
  drawAlgorithm();
  renderVisualDashboard();
  $("#visual-explain").innerHTML = showMessage
    ? `<p>画布已重置。点击“下一步”观察算法过程，或点击“生成解释”让可视化 Agent 解读当前状态。</p>`
    : `<p>选择算法后，系统会在画布中展示该算法的核心过程。当前算法: <strong>${escapeHtml(currentVisualMeta().name)}</strong>。</p>`;
}

async function stepAlgorithmVisual() {
  const algorithm = currentVisualAlgorithm();
  if (algorithm === "kmeans") stepKMeansState();
  if (algorithm === "knn") stepKnnState();
  if (algorithm === "linear_regression") stepRegressionState();
  if (algorithm === "decision_tree") stepTreeState();
  if (VISUAL_ALGORITHMS[algorithm]?.generic || algorithm === "custom_algorithm") stepGenericAlgorithmState();
  drawAlgorithm();
  renderVisualDashboard();
  requestVisualExplanation(visualState.action || "下一步");
}

function renderVisualParamGroups() {
  const algorithm = currentVisualAlgorithm();
  $$("[data-param-for]").forEach((group) => {
    group.hidden = group.dataset.paramFor !== algorithm;
  });
}

function createKMeansState(dataset) {
  const k = Number($("#cluster-count").value);
  const noise = dataset === "noisy" ? 1.25 : dataset === "overlap" ? 1.55 : 1;
  const seeds = [
    { x: 150, y: 105 },
    { x: 575, y: 125 },
    { x: 350, y: 310 },
    { x: 610, y: 315 },
  ];
  const points = [];
  for (let c = 0; c < k; c += 1) {
    for (let i = 0; i < 24; i += 1) {
      points.push({
        x: clamp(seeds[c].x + randomBetween(-78 * noise, 78 * noise), 36, 744),
        y: clamp(seeds[c].y + randomBetween(-58 * noise, 58 * noise), 36, 394),
        cluster: -1,
      });
    }
  }
  const centers = seeds.slice(0, k).map((center) => ({
    x: clamp(center.x + randomBetween(-120, 120), 42, 738),
    y: clamp(center.y + randomBetween(-82, 82), 42, 388),
  }));
  return { algorithm: "kmeans", dataset, points, centers, phase: "assign", iteration: 0, step: 0, action: "初始化中心点" };
}

function stepKMeansState() {
  if (visualState.phase === "assign") {
    assignVisualClusters();
    visualState.phase = "move";
    visualState.action = "样本分配到最近中心";
  } else {
    moveVisualCenters();
    visualState.phase = "assign";
    visualState.iteration += 1;
    visualState.action = "中心点移动到簇均值";
  }
  visualState.step += 1;
}

function assignVisualClusters() {
  for (const point of visualState.points) {
    let best = 0;
    let bestDistance = Infinity;
    visualState.centers.forEach((center, index) => {
      const distance = Math.hypot(point.x - center.x, point.y - center.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    point.cluster = best;
  }
}

function moveVisualCenters() {
  visualState.centers = visualState.centers.map((center, index) => {
    const group = visualState.points.filter((point) => point.cluster === index);
    if (!group.length) return center;
    return {
      x: group.reduce((sum, point) => sum + point.x, 0) / group.length,
      y: group.reduce((sum, point) => sum + point.y, 0) / group.length,
    };
  });
}

function createKnnState(dataset) {
  const spread = dataset === "overlap" ? 130 : dataset === "noisy" ? 105 : 82;
  const points = [];
  [
    { label: "A", x: 245, y: 155 },
    { label: "B", x: 530, y: 285 },
  ].forEach((group) => {
    for (let i = 0; i < 34; i += 1) {
      points.push({
        label: group.label,
        x: clamp(group.x + randomBetween(-spread, spread), 42, 738),
        y: clamp(group.y + randomBetween(-spread * 0.72, spread * 0.72), 42, 388),
      });
    }
  });
  return {
    algorithm: "knn",
    dataset,
    points,
    query: createKnnQuery(dataset, points),
    neighbors: [],
    prediction: "",
    phase: "find",
    step: 0,
    action: "放置待预测样本",
  };
}

function createKnnQuery(dataset, points) {
  const anchors = {
    structured: { x: 312, y: 180 },
    noisy: { x: 378, y: 218 },
    overlap: { x: 430, y: 235 },
  };
  const base = anchors[dataset] || anchors.structured;
  const nearest = points
    .map((point) => ({ ...point, distance: Math.hypot(point.x - base.x, point.y - base.y) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
  return {
    x: clamp(base.x, 70, 710),
    y: clamp(base.y, 70, 360),
    expectedLocalMix: countBy(nearest, "label"),
  };
}

function stepKnnState() {
  const k = Number($("#knn-k").value);
  if (visualState.phase === "find") {
    visualState.neighbors = visualState.points
      .map((point) => ({ ...point, distance: Math.hypot(point.x - visualState.query.x, point.y - visualState.query.y) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);
    visualState.phase = "vote";
    visualState.action = `寻找最近的 ${k} 个邻居`;
  } else if (visualState.phase === "vote") {
    visualState.prediction = resolveKnnPrediction(visualState.neighbors);
    visualState.phase = "next";
    visualState.action = `邻居投票预测为 ${visualState.prediction} 类`;
  } else {
    visualState.query = createKnnQuery(visualState.dataset, visualState.points);
    visualState.neighbors = [];
    visualState.prediction = "";
    visualState.phase = "find";
    visualState.action = "更换一个待预测样本";
  }
  visualState.step += 1;
}

function resolveKnnPrediction(neighbors) {
  const votes = {};
  for (const neighbor of neighbors) {
    const bucket = votes[neighbor.label] || { count: 0, distance: 0 };
    bucket.count += 1;
    bucket.distance += neighbor.distance || 0;
    votes[neighbor.label] = bucket;
  }
  return Object.entries(votes)
    .map(([label, info]) => ({ label, count: info.count, avgDistance: info.distance / Math.max(1, info.count) }))
    .sort((a, b) => b.count - a.count || a.avgDistance - b.avgDistance || a.label.localeCompare(b.label, "zh-Hans-CN"))[0]?.label || "";
}

function createRegressionState(dataset) {
  const noise = dataset === "noisy" ? 1.25 : dataset === "overlap" ? 1.65 : 0.85;
  const points = Array.from({ length: 34 }, (_, index) => {
    const x = 0.6 + index * 0.28;
    const y = 1.25 * x + 1.15 + randomBetween(-0.9 * noise, 0.9 * noise);
    return { x, y };
  });
  return {
    algorithm: "linear_regression",
    dataset,
    points,
    slope: randomBetween(-0.35, 0.45),
    intercept: randomBetween(4.5, 7.0),
    step: 0,
    action: "初始化回归直线",
  };
}

function stepRegressionState() {
  const rate = Number($("#regression-rate").value);
  for (let iter = 0; iter < 24; iter += 1) {
    const gradients = regressionGradients(visualState);
    visualState.slope -= rate * gradients.slope;
    visualState.intercept -= rate * gradients.intercept;
  }
  visualState.step += 1;
  visualState.action = "梯度下降更新斜率和截距";
}

function regressionGradients(state) {
  const n = state.points.length;
  let slope = 0;
  let intercept = 0;
  for (const point of state.points) {
    const prediction = state.slope * point.x + state.intercept;
    const error = prediction - point.y;
    slope += 2 * error * point.x;
    intercept += 2 * error;
  }
  return { slope: slope / n, intercept: intercept / n };
}

function createTreeState(dataset) {
  const noise = dataset === "structured" ? 0.04 : dataset === "noisy" ? 0.12 : 0.22;
  const points = Array.from({ length: 90 }, () => {
    const x = randomBetween(70, 710);
    const y = randomBetween(58, 372);
    const base = x < 395 ? (y < 220 ? "A" : "B") : (y < 205 ? "B" : "A");
    const label = Math.random() < noise ? (base === "A" ? "B" : "A") : base;
    return { x, y, label };
  });
  return {
    algorithm: "decision_tree",
    dataset,
    points,
    depth: 0,
    maxDepth: Number($("#tree-depth").value),
    splits: [],
    step: 0,
    action: "观察原始样本分布",
  };
}

function stepTreeState() {
  if (visualState.depth >= visualState.maxDepth || visualState.depth >= 3) {
    visualState.depth = 0;
    visualState.splits = [];
    visualState.action = "重置切分规则，重新观察";
  } else {
    const regions = treeLeafRegions(visualState.points, visualState.splits);
    const nextSplit = regions
      .map((region) => findBestTreeSplit(region.points, region.bounds, region.id))
      .filter(Boolean)
      .sort((a, b) => b.giniGain - a.giniGain)[0];
    if (nextSplit) {
      visualState.splits.push(nextSplit);
      visualState.depth = visualState.splits.length;
      visualState.action = `加入第 ${visualState.depth} 条 Gini 最优切分`;
    } else {
      visualState.action = "当前区域已无法继续有效切分";
    }
  }
  visualState.step += 1;
}

function treeLeafRegions(points, splits) {
  let regions = [{
    id: "root",
    points,
    bounds: { xMin: 45, xMax: 735, yMin: 30, yMax: 400 },
  }];
  for (const split of splits) {
    const nextRegions = [];
    for (const region of regions) {
      if (region.id !== split.regionId) {
        nextRegions.push(region);
        continue;
      }
      const leftBounds = { ...region.bounds };
      const rightBounds = { ...region.bounds };
      if (split.feature === "x") {
        leftBounds.xMax = split.value;
        rightBounds.xMin = split.value;
      } else {
        leftBounds.yMax = split.value;
        rightBounds.yMin = split.value;
      }
      nextRegions.push({
        id: `${region.id}L`,
        points: region.points.filter((point) => point[split.feature] <= split.value),
        bounds: leftBounds,
      });
      nextRegions.push({
        id: `${region.id}R`,
        points: region.points.filter((point) => point[split.feature] > split.value),
        bounds: rightBounds,
      });
    }
    regions = nextRegions;
  }
  return regions.filter((region) => region.points.length > 1);
}

function findBestTreeSplit(points, bounds, regionId) {
  if (!points.length || new Set(points.map((point) => point.label)).size < 2) return null;
  const baseGini = giniImpurity(points);
  let best = null;
  for (const feature of ["x", "y"]) {
    const values = Array.from(new Set(points.map((point) => point[feature]))).sort((a, b) => a - b);
    for (let index = 0; index < values.length - 1; index += 1) {
      const value = (values[index] + values[index + 1]) / 2;
      const left = points.filter((point) => point[feature] <= value);
      const right = points.filter((point) => point[feature] > value);
      if (!left.length || !right.length) continue;
      const weighted = (left.length / points.length) * giniImpurity(left) + (right.length / points.length) * giniImpurity(right);
      const giniGain = baseGini - weighted;
      if (!best || giniGain > best.giniGain) {
        best = {
          feature,
          value,
          regionId,
          bounds,
          giniGain,
          label: `${feature === "x" ? "横轴特征" : "纵轴特征"} <= ${Math.round(value)}`,
        };
      }
    }
  }
  return best;
}

function giniImpurity(points) {
  const counts = countBy(points, "label");
  const total = points.length || 1;
  return 1 - Object.values(counts).reduce((sum, count) => sum + (count / total) ** 2, 0);
}

function createGenericAlgorithmState(algorithm, dataset) {
  const spread = dataset === "structured" ? 78 : dataset === "noisy" ? 108 : 138;
  const points = [];
  [
    { label: "A", x: 250, y: 165 },
    { label: "B", x: 520, y: 265 },
  ].forEach((group) => {
    for (let i = 0; i < 32; i += 1) {
      points.push({
        label: group.label,
        x: clamp(group.x + randomBetween(-spread, spread), 46, 734),
        y: clamp(group.y + randomBetween(-spread * 0.68, spread * 0.68), 46, 384),
      });
    }
  });
  const stages = genericVisualStages(algorithm);
  return {
    algorithm,
    dataset,
    points,
    stages,
    stageIndex: 0,
    step: 0,
    behavior: visualAlgorithmBehavior(algorithm),
    action: stages[0].label,
  };
}

function genericVisualStages(algorithm) {
  const common = [
    { label: "准备数据与特征", hint: "确认输入特征、标签或无监督目标" },
    { label: "拟合模型核心结构", hint: "让模型从样本中学习参数、规则或表示" },
    { label: "形成预测边界或数据表示", hint: "观察模型如何把输入映射到类别、数值或低维空间" },
    { label: "评估结果并调参", hint: "用指标和误差定位下一步优化方向" },
  ];
  const specialized = {
    random_forest: [
      { label: "抽样生成多份训练子集", hint: "每棵树看到的数据略有不同" },
      { label: "训练多棵弱相关决策树", hint: "随机特征让树之间差异更大" },
      { label: "多数投票或平均输出", hint: "集成结果比单棵树更稳定" },
      { label: "查看特征重要性", hint: "统计哪些特征更常参与有效切分" },
    ],
    pca: [
      { label: "中心化并比较特征尺度", hint: "让不同特征可公平比较" },
      { label: "寻找方差最大的方向", hint: "第一主成分保留最多变化" },
      { label: "投影到低维空间", hint: "压缩维度但尽量保留结构" },
      { label: "检查解释方差比例", hint: "判断降维损失是否可接受" },
    ],
    dbscan: [
      { label: "设置 eps 和 min_samples", hint: "定义密度邻域和核心点" },
      { label: "识别核心点", hint: "邻域样本足够多的点会扩展簇" },
      { label: "连接密度可达样本", hint: "簇由密度相连的区域组成" },
      { label: "标记边界点和噪声点", hint: "孤立样本不会被强行分到簇中" },
    ],
    gradient_boosting: [
      { label: "初始化一个简单预测", hint: "先得到粗略基线" },
      { label: "拟合上一轮残差", hint: "新模型专门修正旧模型错误" },
      { label: "按学习率叠加新树", hint: "小步更新更稳但需要更多轮" },
      { label: "观察验证集误差", hint: "防止迭代过多导致过拟合" },
    ],
    neural_network: [
      { label: "输入层接收特征", hint: "每个节点代表一个特征或中间表示" },
      { label: "前向传播得到预测", hint: "层层组合形成非线性函数" },
      { label: "反向传播更新参数", hint: "梯度告诉每个权重如何调整" },
      { label: "观察损失下降", hint: "损失稳定下降说明学习方向合理" },
    ],
    logistic_regression: [
      { label: "计算线性得分", hint: "先用 w·x+b 得到每个类别的原始分数" },
      { label: "映射为概率", hint: "Sigmoid 或 Softmax 把分数转成概率" },
      { label: "形成分类边界", hint: "概率阈值决定样本落在哪一类" },
      { label: "用交叉熵更新参数", hint: "错误概率越高，参数修正越明显" },
    ],
    svm: [
      { label: "寻找候选分隔边界", hint: "先找到能区分类别的超平面" },
      { label: "定位支持向量", hint: "离边界最近的点决定间隔宽度" },
      { label: "最大化间隔", hint: "边界尽量远离两侧最近样本" },
      { label: "检查 C 与核函数", hint: "控制容错和非线性边界能力" },
    ],
    naive_bayes: [
      { label: "统计类别先验", hint: "先看每类样本本身出现概率" },
      { label: "估计条件概率", hint: "看特征值在每个类别下的可能性" },
      { label: "组合后验得分", hint: "P(y|x) 由先验和各特征似然共同决定" },
      { label: "选择最大后验类别", hint: "后验概率最高的类别成为预测" },
    ],
  };
  return specialized[algorithm] || common;
}

function stepGenericAlgorithmState() {
  visualState.stageIndex = (visualState.stageIndex + 1) % visualState.stages.length;
  visualState.step += 1;
  visualState.action = visualState.stages[visualState.stageIndex].label;
}

function drawAlgorithm() {
  const canvas = $("#algorithm-canvas");
  const ctx = canvas.getContext("2d");
  drawCanvasBase(ctx, canvas);
  if (visualState.algorithm === "kmeans") drawKMeansVisual(ctx);
  if (visualState.algorithm === "knn") drawKnnVisual(ctx);
  if (visualState.algorithm === "linear_regression") drawRegressionVisual(ctx);
  if (visualState.algorithm === "decision_tree") drawTreeVisual(ctx);
  if (VISUAL_ALGORITHMS[visualState.algorithm]?.generic || visualState.algorithm === "custom_algorithm") drawGenericAlgorithmVisual(ctx);
}

function drawCanvasBase(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e5edf4";
  ctx.lineWidth = 1;
  for (let x = 60; x < canvas.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 60; y < canvas.height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawKMeansVisual(ctx) {
  const colors = ["#0f766e", "#2563eb", "#b45309", "#7c3aed"];
  for (const point of visualState.points) {
    ctx.beginPath();
    ctx.fillStyle = point.cluster >= 0 ? colors[point.cluster] : "#98a2b3";
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  visualState.centers.forEach((center, index) => {
    ctx.fillStyle = colors[index];
    ctx.strokeStyle = "#101828";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(center.x - 10, center.y - 10, 20, 20);
    ctx.fill();
    ctx.stroke();
  });
}

function drawKnnVisual(ctx) {
  const colorFor = { A: "#0f766e", B: "#2563eb" };
  for (const point of visualState.points) {
    ctx.beginPath();
    ctx.fillStyle = colorFor[point.label];
    ctx.globalAlpha = 0.78;
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const neighbor of visualState.neighbors) {
    ctx.strokeStyle = neighbor.label === "A" ? "#0f766e" : "#2563eb";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(visualState.query.x, visualState.query.y);
    ctx.lineTo(neighbor.x, neighbor.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(neighbor.x, neighbor.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#111827";
  ctx.strokeStyle = visualState.prediction === "B" ? "#2563eb" : "#0f766e";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(visualState.query.x, visualState.query.y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (visualState.prediction) {
    drawCanvasLabel(ctx, `预测: ${visualState.prediction} 类`, visualState.query.x + 18, visualState.query.y - 16);
  }
}

function drawRegressionVisual(ctx) {
  const mapX = (x) => 58 + x * 68;
  const mapY = (y) => 390 - y * 34;
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(48, 390);
  ctx.lineTo(740, 390);
  ctx.moveTo(58, 402);
  ctx.lineTo(58, 34);
  ctx.stroke();
  for (const point of visualState.points) {
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(mapX(point.x), mapY(point.y), 5, 0, Math.PI * 2);
    ctx.fill();
  }
  const x1 = 0;
  const x2 = 10;
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mapX(x1), mapY(visualState.slope * x1 + visualState.intercept));
  ctx.lineTo(mapX(x2), mapY(visualState.slope * x2 + visualState.intercept));
  ctx.stroke();
  drawCanvasLabel(ctx, `y = ${visualState.slope.toFixed(2)}x + ${visualState.intercept.toFixed(2)}`, 510, 46);
}

function drawTreeVisual(ctx) {
  const colorFor = { A: "#0f766e", B: "#b45309" };
  for (const point of visualState.points) {
    ctx.fillStyle = colorFor[point.label];
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  for (const split of visualState.splits) {
    ctx.strokeStyle = split.feature === "x" ? "#111827" : "#7c3aed";
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    if (split.feature === "x") {
      ctx.moveTo(split.value, split.bounds?.yMin || 30);
      ctx.lineTo(split.value, split.bounds?.yMax || 400);
    } else {
      ctx.moveTo(split.bounds?.xMin || 45, split.value);
      ctx.lineTo(split.bounds?.xMax || 735, split.value);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  drawTreeMiniDiagram(ctx);
}

function drawTreeMiniDiagram(ctx) {
  ctx.fillStyle = "rgba(248, 250, 252, 0.94)";
  ctx.strokeStyle = "#d9e1ea";
  ctx.lineWidth = 1;
  ctx.fillRect(535, 28, 205, 112);
  ctx.strokeRect(535, 28, 205, 112);
  ctx.fillStyle = "#172033";
  ctx.font = "13px Microsoft YaHei, Arial";
  const lines = visualState.splits.length
    ? visualState.splits.map((split, index) => `Node ${index + 1}: ${split.label} / Gini +${split.giniGain.toFixed(2)}`)
    : ["尚未切分", "点击下一步添加规则"];
  lines.forEach((line, index) => ctx.fillText(line, 548, 56 + index * 24));
}

function drawGenericAlgorithmVisual(ctx) {
  const colorFor = { A: "#0f766e", B: "#2563eb" };
  for (const point of visualState.points || []) {
    ctx.fillStyle = colorFor[point.label] || "#64748b";
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const algorithm = visualState.algorithm;
  if (algorithm === "pca") {
    drawArrow(ctx, 175, 310, 610, 112, "#b45309", "第一主成分");
    drawArrow(ctx, 350, 330, 455, 116, "#7c3aed", "第二主成分");
  } else if (algorithm === "random_forest" || algorithm === "gradient_boosting") {
    drawMiniForest(ctx, algorithm === "gradient_boosting");
  } else if (algorithm === "neural_network") {
    drawMiniNetwork(ctx);
  } else if (algorithm === "dbscan") {
    drawDensityRings(ctx);
  } else {
    ctx.strokeStyle = algorithm === "svm" ? "#111827" : "#b45309";
    ctx.lineWidth = algorithm === "svm" ? 4 : 3;
    ctx.setLineDash(algorithm === "svm" ? [] : [9, 7]);
    ctx.beginPath();
    ctx.moveTo(205, 360);
    ctx.bezierCurveTo(320, 250, 420, 210, 575, 76);
    ctx.stroke();
    ctx.setLineDash([]);
    if (algorithm === "svm") {
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(180, 330);
      ctx.bezierCurveTo(305, 230, 420, 190, 548, 54);
      ctx.moveTo(234, 386);
      ctx.bezierCurveTo(342, 272, 452, 238, 606, 102);
      ctx.stroke();
    }
  }

  drawGenericStageCards(ctx);
}

function drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - 13 * Math.cos(angle - Math.PI / 6), toY - 13 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - 13 * Math.cos(angle + Math.PI / 6), toY - 13 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  drawCanvasLabel(ctx, label, toX - 106, toY - 14);
}

function drawMiniForest(ctx, sequential = false) {
  const xs = [520, 595, 670];
  xs.forEach((x, index) => {
    ctx.strokeStyle = sequential ? "#b45309" : "#0f766e";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, 70, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, 85);
    ctx.lineTo(x - 24, 126);
    ctx.moveTo(x, 85);
    ctx.lineTo(x + 24, 126);
    ctx.stroke();
    ctx.fillStyle = sequential ? "#fef3c7" : "#ecfdf3";
    ctx.fillRect(x - 39, 126, 30, 24);
    ctx.fillRect(x + 9, 126, 30, 24);
    ctx.strokeRect(x - 39, 126, 30, 24);
    ctx.strokeRect(x + 9, 126, 30, 24);
    drawCanvasLabel(ctx, sequential ? `第 ${index + 1} 轮` : `树 ${index + 1}`, x - 28, 178 + index * 26);
  });
  drawCanvasLabel(ctx, sequential ? "逐轮修正残差" : "多棵树投票", 538, 252);
}

function drawMiniNetwork(ctx) {
  const layers = [[560, 115, 170, 225], [625, 95, 155, 215, 275], [695, 145, 215]];
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let layer = 0; layer < layers.length - 1; layer += 1) {
    const current = layers[layer];
    const next = layers[layer + 1];
    for (let i = 1; i < current.length; i += 1) {
      for (let j = 1; j < next.length; j += 1) {
        ctx.beginPath();
        ctx.moveTo(current[0], current[i]);
        ctx.lineTo(next[0], next[j]);
        ctx.stroke();
      }
    }
  }
  layers.forEach((layer, layerIndex) => {
    for (let i = 1; i < layer.length; i += 1) {
      ctx.fillStyle = layerIndex === 0 ? "#e0f2fe" : layerIndex === 1 ? "#ecfdf3" : "#fef3c7";
      ctx.strokeStyle = "#334155";
      ctx.beginPath();
      ctx.arc(layer[0], layer[i], 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  });
  drawCanvasLabel(ctx, "输入 → 隐藏层 → 输出", 520, 330);
}

function drawDensityRings(ctx) {
  const centers = [
    { x: 248, y: 168 },
    { x: 520, y: 266 },
  ];
  centers.forEach((center) => {
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(center.x, center.y, 82, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  drawCanvasLabel(ctx, "eps 邻域", 174, 78);
  drawCanvasLabel(ctx, "噪声点不会被强行归类", 472, 360);
}

function drawGenericStageCards(ctx) {
  const stages = visualState.stages || [];
  const active = visualState.stageIndex || 0;
  stages.forEach((stage, index) => {
    const x = 42 + index * 178;
    const y = 22;
    ctx.fillStyle = index === active ? "#e0f2fe" : "rgba(248, 250, 252, 0.94)";
    ctx.strokeStyle = index === active ? "#2563eb" : "#d9e1ea";
    ctx.lineWidth = index === active ? 2 : 1;
    ctx.fillRect(x, y, 154, 56);
    ctx.strokeRect(x, y, 154, 56);
    ctx.fillStyle = "#172033";
    ctx.font = "13px Microsoft YaHei, Arial";
    ctx.fillText(`${index + 1}. ${stage.label}`.slice(0, 18), x + 10, y + 24);
    ctx.fillStyle = "#667085";
    ctx.font = "12px Microsoft YaHei, Arial";
    ctx.fillText(stage.hint.slice(0, 16), x + 10, y + 45);
  });
}

function drawCanvasLabel(ctx, text, x, y) {
  ctx.font = "14px Microsoft YaHei, Arial";
  const width = ctx.measureText(text).width + 18;
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.fillRect(x - 8, y - 19, width, 28);
  ctx.strokeStyle = "#d9e1ea";
  ctx.strokeRect(x - 8, y - 19, width, 28);
  ctx.fillStyle = "#172033";
  ctx.fillText(text, x, y);
}

function renderVisualDashboard() {
  const meta = currentVisualMeta();
  $("#visual-step-kicker").textContent = `Step ${visualState.step || 0}`;
  $("#visual-step-title").textContent = `${meta.name}: ${visualState.action || "观察状态"}`;
  $("#visual-status-pill").textContent = meta.goal;
  $("#visual-focus-list").innerHTML = meta.focus.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  $("#visual-legend").innerHTML = renderVisualLegend();
  $("#visual-metric-strip").innerHTML = renderVisualMetrics();
  $("#visual-insights").innerHTML = renderVisualInsights();
}

function renderVisualLegend() {
  const algorithm = visualState.algorithm;
  if (algorithm === "kmeans") return `<span><i style="background:#98a2b3"></i>未分配样本</span><span><i style="background:#0f766e"></i>簇/中心</span><span><b></b>中心点</span>`;
  if (algorithm === "knn") return `<span><i style="background:#0f766e"></i>A 类样本</span><span><i style="background:#2563eb"></i>B 类样本</span><span><b></b>待预测样本</span>`;
  if (algorithm === "linear_regression") return `<span><i style="background:#2563eb"></i>训练样本</span><span><i style="background:#b45309"></i>当前回归线</span>`;
  if (VISUAL_ALGORITHMS[algorithm]?.generic || algorithm === "custom_algorithm") return `<span><i style="background:#0f766e"></i>A 类/区域</span><span><i style="background:#2563eb"></i>B 类/区域</span><span><i style="background:#b45309"></i>模型结构</span>`;
  return `<span><i style="background:#0f766e"></i>A 类区域</span><span><i style="background:#b45309"></i>B 类区域</span><span><i style="background:#7c3aed"></i>切分线</span>`;
}

function renderVisualMetrics() {
  const metrics = visualMetrics();
  return metrics
    .map((metric) => `
      <article class="visual-metric-card">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
        <small>${escapeHtml(metric.hint)}</small>
      </article>
    `)
    .join("");
}

function visualMetrics() {
  if (visualState.algorithm === "kmeans") {
    const counts = countBy(visualState.points.map((point) => ({ cluster: point.cluster >= 0 ? `簇 ${point.cluster + 1}` : "未分配" })), "cluster");
    return [
      { label: "迭代轮次", value: visualState.iteration, hint: "完成一次分配和更新算一轮" },
      { label: "聚类数 K", value: visualState.centers.length, hint: "希望分成多少个簇" },
      { label: "平均距离", value: kmeansAverageDistance().toFixed(1), hint: "越低代表簇内越紧" },
      { label: "样本分布", value: Object.values(counts).join(" / "), hint: "各簇样本数量" },
    ];
  }
  if (visualState.algorithm === "knn") {
    const votes = countBy(visualState.neighbors, "label");
    return [
      { label: "邻居数 k", value: $("#knn-k").value, hint: "参与投票的样本数" },
      { label: "已选邻居", value: visualState.neighbors.length, hint: "当前已经高亮的近邻" },
      { label: "A/B 投票", value: `${votes.A || 0}/${votes.B || 0}`, hint: "多数类成为预测结果" },
      { label: "预测类别", value: visualState.prediction || "-", hint: "完成投票后显示" },
    ];
  }
  if (visualState.algorithm === "linear_regression") {
    return [
      { label: "MSE", value: regressionMse(visualState).toFixed(2), hint: "均方误差，越小越好" },
      { label: "斜率", value: visualState.slope.toFixed(2), hint: "线的倾斜程度" },
      { label: "截距", value: visualState.intercept.toFixed(2), hint: "x 为 0 时的预测值" },
      { label: "更新次数", value: visualState.step, hint: "梯度下降的轮次" },
    ];
  }
  if (VISUAL_ALGORITHMS[visualState.algorithm]?.generic || visualState.algorithm === "custom_algorithm") {
    const behavior = visualAlgorithmBehavior(visualState.algorithm);
    return [
      { label: "当前阶段", value: (visualState.stageIndex || 0) + 1, hint: visualState.action || "观察流程" },
      { label: "流程步数", value: visualState.stages?.length || 4, hint: "从输入到评估的关键环节" },
      { label: "演示模式", value: behavior.mode, hint: behavior.note },
      { label: "算法", value: currentVisualMeta().shortName, hint: "可由 Agent 继续展开解释" },
    ];
  }
  return [
    { label: "当前深度", value: visualState.depth, hint: "已经加入的规则层数" },
    { label: "最大深度", value: visualState.maxDepth, hint: "控制树的复杂度" },
    { label: "叶子数量", value: Math.max(1, visualState.splits.length + 1), hint: "最终分类区域数量" },
    { label: "样本数量", value: visualState.points.length, hint: "参与观察的训练样本" },
  ];
}

function renderVisualInsights() {
  const algorithm = visualState.algorithm;
  if (algorithm === "kmeans") {
    return `<p>K-means 是无监督学习，不看标签，只根据距离把相近样本放在一起。</p><p>当前阶段: ${escapeHtml(visualState.phase === "assign" ? "准备重新分配样本" : "准备更新中心点")}。</p>`;
  }
  if (algorithm === "knn") {
    return `<p>KNN 不显式训练参数，而是在预测时查找离新样本最近的训练样本。</p><p>当前预测: ${escapeHtml(visualState.prediction || "等待投票")}。</p>`;
  }
  if (algorithm === "linear_regression") {
    return `<p>线性回归通过一条直线拟合连续数值目标，目标是让整体误差尽可能小。</p><p>继续点击下一步可以看到误差逐步下降。</p>`;
  }
  if (VISUAL_ALGORITHMS[algorithm]?.generic || algorithm === "custom_algorithm") {
    const stage = visualState.stages?.[visualState.stageIndex || 0];
    const behavior = visualAlgorithmBehavior(algorithm);
    const modeLabel = behavior.mode || "概念流程演示";
    return `<p>${escapeHtml(currentVisualMeta().name)} 当前处在“${escapeHtml(stage?.label || visualState.action)}”阶段。</p><p>${escapeHtml(stage?.hint || "继续点击下一步，观察从数据输入到模型评估的完整链路。")}</p><p>${escapeHtml(modeLabel)}: ${escapeHtml(behavior.note)}</p>`;
  }
  return `<p>决策树把特征空间切成多个区域，每个区域给出一个类别判断。</p><p>深度越大，规则越多，表达能力越强，也更需要防止过拟合。</p>`;
}

function kmeansAverageDistance() {
  if (!visualState.points?.length || visualState.points.every((point) => point.cluster < 0)) return 0;
  const total = visualState.points.reduce((sum, point) => {
    const center = visualState.centers[point.cluster];
    return center ? sum + Math.hypot(point.x - center.x, point.y - center.y) : sum;
  }, 0);
  return total / visualState.points.length;
}

function regressionMse(state) {
  return state.points.reduce((sum, point) => {
    const error = state.slope * point.x + state.intercept - point.y;
    return sum + error * error;
  }, 0) / state.points.length;
}

function summarizeVisualState(action) {
  const metrics = visualMetrics().map((item) => ({ label: item.label, value: item.value }));
  const state = { action, algorithm: currentVisualMeta().name, dataset: $("#visual-dataset").value, step: visualState.step, metrics };
  if (visualState.algorithm === "kmeans") {
    state.phase = visualState.phase;
    state.cluster_count = visualState.centers.length;
    state.centers = visualState.centers.map((center) => ({ x: Number(center.x.toFixed(1)), y: Number(center.y.toFixed(1)) }));
  }
  if (visualState.algorithm === "knn") {
    state.k = Number($("#knn-k").value);
    state.prediction = visualState.prediction || "未完成投票";
    state.neighbor_votes = countBy(visualState.neighbors, "label");
  }
  if (visualState.algorithm === "linear_regression") {
    state.slope = Number(visualState.slope.toFixed(3));
    state.intercept = Number(visualState.intercept.toFixed(3));
    state.mse = Number(regressionMse(visualState).toFixed(3));
  }
  if (visualState.algorithm === "decision_tree") {
    state.depth = visualState.depth;
    state.max_depth = visualState.maxDepth;
    state.splits = visualState.splits.map((split) => split.label);
  }
  if (VISUAL_ALGORITHMS[visualState.algorithm]?.generic || visualState.algorithm === "custom_algorithm") {
    const behavior = visualAlgorithmBehavior(visualState.algorithm);
    state.stage = visualState.action;
    state.stage_hint = visualState.stages?.[visualState.stageIndex || 0]?.hint || "";
    state.algorithm_key = visualState.algorithm;
    state.simulation_mode = behavior.mode;
    state.simulation_note = behavior.note;
  }
  return state;
}

async function requestVisualExplanation(action) {
  const llmConfig = getOptionalAgentLLMConfig("visual");
  if (!llmConfig) {
    renderVisualExplanation(createLocalVisualExplanation(action, "未配置算法可视化 Agent，已使用本地解释。"), action);
    return;
  }
  $("#visual-explain").textContent = "正在调用算法可视化 Agent...";
  try {
    const data = ensureAgentResponse(await postJson(
      "/api/visual_explain",
      {
        algorithm: currentVisualMeta().name,
        state: summarizeVisualState(action),
        learner_profile: buildLearnerProfile("visualize"),
        llm_config: withOptionalAgentTimeout(llmConfig),
      },
      { timeoutMs: OPTIONAL_AGENT_REQUEST_TIMEOUT_MS }
    ));
    renderVisualExplanation(data, action);
  } catch (error) {
    renderVisualExplanation(createLocalVisualExplanation(action, error.message), action);
  }
}

function createLocalVisualExplanation(action, reason = "") {
  const meta = currentVisualMeta();
  const algorithm = currentVisualAlgorithm();
  const behavior = visualAlgorithmBehavior(algorithm);
  const metrics = visualMetrics().map((metric) => `${metric.label}: ${metric.value}`).join("；");
  const reasonText = reason ? `模型解释暂时不可用: ${reason}` : "已使用本地算法状态生成解释。";
  return {
    step_title: `${meta.name}: ${action || visualState.action || "当前状态"}`,
    step_explanation: `${reasonText} 当前画布已经完成本地状态更新，可以继续观察点、线、区域或流程阶段的变化。`,
    parameter_meaning: metrics || behavior.note,
    formula_or_rule: visualFormulaFor(algorithm),
    current_observation: visualState.action || "观察当前画布状态。",
    learning_takeaways: [
      behavior.mode === "精细状态模拟" ? "画布状态来自本地算法步骤，不依赖大模型接口。" : "该算法当前使用概念流程演示，重点看机制和学习顺序。",
      "大模型解释失败不会影响本地可视化继续运行。",
    ],
    common_misunderstandings: ["不要把接口超时理解成算法本身无法运行。"],
    next_observation: "继续点击下一步，观察算法状态如何推进。",
    related_concepts: ["特征空间", "模型参数", "评价指标"],
    next_actions: [
      { label: "学习相关概念", target_view: "concept" },
      { label: "到实验中心验证", target_view: "experiment" },
    ],
  };
}

function renderVisualExplanation(data, fallbackTitle) {
  if (data.raw_answer) {
    $("#visual-explain").innerHTML = renderRawAnswer(data.raw_answer);
    return;
  }
  $("#visual-explain").innerHTML = `
    <article class="visual-agent-card">
      <h3>${escapeHtml(data.step_title || fallbackTitle)}</h3>
      <p>${escapeHtml(data.step_explanation || "")}</p>
      ${renderFormulaBlock("算法公式 / 更新规则", data.formula_or_rule || visualFormulaFor(currentVisualAlgorithm()), "把画布上的变化对应到数学表达，先看规则，再观察点、线或区域如何改变。")}
      <div class="visual-explain-grid">
        <div><strong>参数含义</strong><span>${escapeHtml(data.parameter_meaning || "")}</span></div>
        <div><strong>当前观察</strong><span>${escapeHtml(data.current_observation || data.next_observation || "")}</span></div>
      </div>
      ${renderVisualList("学习要点", data.learning_takeaways || data.key_takeaways)}
      ${renderVisualList("常见误区", data.common_misunderstandings)}
      <p class="meta-line">${escapeHtml(data.next_observation || "")}</p>
      ${asArray(data.related_concepts).length ? `<div class="related-concepts">${asArray(data.related_concepts).map((concept) => `<button type="button" data-visual-concept="${escapeHtml(concept)}">${escapeHtml(concept)}</button>`).join("")}</div>` : ""}
      <div class="button-row">${renderVisualActionButtons(data.next_actions || data.related_actions)}</div>
    </article>
  `;
}

function visualFormulaFor(algorithm) {
  const formulas = {
    kmeans: "分配: c_i = argmin_j ||x_i - μ_j||²\n更新: μ_j = (1 / |C_j|) Σ_{x_i∈C_j} x_i",
    knn: "距离: d(x, x_i) = sqrt(Σ_m (x_m - x_{i,m})²)\n预测: ŷ = mode(y_i | x_i ∈ N_k(x))",
    linear_regression: "预测: ŷ = w x + b\n损失: MSE = (1 / n) Σ_i (y_i - ŷ_i)²",
    decision_tree: "Gini = 1 - Σ_k p_k²\n信息增益 = H(parent) - Σ_v (|S_v| / |S|) H(S_v)",
    logistic_regression: "二分类概率: p = 1 / (1 + exp(-(w · x + b)))\nSoftmax: p_k = exp(z_k) / Σ_j exp(z_j)",
    svm: "目标: 最大化分类间隔\n约束: y_i(w · x_i + b) ≥ 1",
    random_forest: "单棵树预测: h_t(x)\n森林投票: ŷ = mode(h_1(x), h_2(x), ..., h_T(x))",
    naive_bayes: "贝叶斯规则: P(y | x) ∝ P(y) × Π_i P(x_i | y)",
    pca: "投影: z = W^T x\n目标: 选择让投影方差最大的方向",
    dbscan: "核心点: |N_eps(x)| ≥ min_samples\n密度可达样本会连接成簇",
    gradient_boosting: "逐轮更新: F_m(x) = F_{m-1}(x) + η h_m(x)\n新模型 h_m 拟合上一轮残差",
    neural_network: "前向传播: a_l = f(W_l a_{l-1} + b_l)\n反向传播: 参数沿损失梯度下降",
    custom_algorithm: "通用观察: 输入特征 → 拟合模型 → 形成判断规则 → 评估并调参",
  };
  return formulas[algorithm] || formulas.custom_algorithm;
}

function renderVisualList(title, items) {
  const list = asArray(items).filter(Boolean);
  if (!list.length) return "";
  return `<div class="suggestion-block"><h4>${escapeHtml(title)}</h4><ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function renderVisualActionButtons(actions) {
  const defaults = [
    { label: "学习相关概念", target_view: "concept" },
    { label: "去代码陪练", target_view: "codeTutor" },
    { label: "到实验中心验证", target_view: "experiment" },
  ];
  const valid = (Array.isArray(actions) && actions.length ? actions : defaults)
    .filter((action) => ["concept", "visualize", "codeTutor", "experiment", "diagnose", "archive"].includes(action.target_view))
    .slice(0, 3);
  return valid
    .map((action, index) => `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-visual-target="${escapeHtml(action.target_view)}">${escapeHtml(action.label || viewLabel(action.target_view))}</button>`)
    .join("");
}

function handleVisualExplainAction(event) {
  const concept = event.target.closest("[data-visual-concept]");
  if (concept) {
    navigateToView("concept", {
      ...currentPageContext(),
      topic: concept.dataset.visualConcept,
    });
    return;
  }
  const target = event.target.closest("[data-visual-target]");
  if (!target) return;
  navigateToView(target.dataset.visualTarget, currentPageContext());
}

function countBy(items, field) {
  return items.reduce((counts, item) => {
    const key = item[field];
    if (key !== undefined && key !== "") counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setupCodeTutor() {
  $("#code-step-list").innerHTML = CODE_STEPS
    .map((step, index) => `
      <button data-code-step="${index}">
        <span>Step ${index + 1}</span>
        <strong>${escapeHtml(step)}</strong>
      </button>
    `)
    .join("");
  $$("[data-code-step]").forEach((button) => {
    button.addEventListener("click", () => selectCodeStep(Number(button.dataset.codeStep)));
  });
  $("#prev-code-step").addEventListener("click", () => selectCodeStep(Math.max(0, appState.currentCodeStep - 1)));
  $("#next-code-step").addEventListener("click", () => selectCodeStep(Math.min(CODE_STEPS.length - 1, appState.currentCodeStep + 1)));
  $("#generate-code-step").addEventListener("click", generateCodeStep);
  $("#generate-full-code").addEventListener("click", generateFullCode);
  $("#save-code-note").addEventListener("click", saveCodeNote);
  $("#copy-code").addEventListener("click", copyCurrentCode);
  $("#download-code-file").addEventListener("click", downloadCurrentCodeFile);
  $("#code-go-experiment").addEventListener("click", () => navigateToView("experiment", currentPageContext()));
  $("#code-related-actions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-code-target]");
    if (button) navigateToView(button.dataset.codeTarget, currentPageContext());
  });
  selectCodeStep(0);
}

function selectCodeStep(index) {
  appState.currentCodeStep = index;
  $$("[data-code-step]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.codeStep) === index);
  });
  $("#code-step-kicker").textContent = `Step ${index + 1} / ${CODE_STEPS.length}`;
  $("#code-step-title").textContent = `Step ${index + 1}: ${CODE_STEPS[index]}`;
  $("#code-step-goal").textContent = "点击“生成当前步骤”，系统会返回本步骤代码、解释、运行预期和练习任务；没有 API 时使用本地教学样例。";
  $("#code-block").textContent = "点击“生成当前步骤”。";
  $("#code-language-label").textContent = "python";
  $("#code-why").textContent = "当前步骤的设计理由会显示在这里。";
  $("#code-explanation").innerHTML = `<p class="empty-note">暂无逐行解释。</p>`;
  $("#code-key-concepts").innerHTML = "";
  $("#code-checklist").innerHTML = `<li>确认已选择项目、学习者水平和代码风格。</li>`;
  $("#code-common-errors").innerHTML = `<li>生成后会列出本步骤常见错误。</li>`;
  $("#code-expected-output").textContent = "生成后会显示运行结果或应观察到的现象。";
  $("#code-try-task").textContent = "生成后会给出一个可以立即尝试的小练习。";
  $("#code-next-step").textContent = "完成当前步骤后继续下一步。";
  $("#code-related-actions").innerHTML = "";
  $("#save-code-note").disabled = true;
  $("#download-code-file").disabled = true;
  appState.codeTutor = null;
}

async function generateCodeStep() {
  const index = appState.currentCodeStep;
  $("#code-block").textContent = "正在调用代码陪练 Agent...";
  $("#code-why").textContent = "正在整理本步骤的设计理由...";
  $("#code-explanation").innerHTML = "";
  const payload = {
    step_index: index,
    step_title: CODE_STEPS[index],
    project: $("#code-project").value,
    model_algorithm: $("#code-model").value,
    generation_mode: "step",
    full_project: false,
    learner_level: $("#code-learner-level").value,
    coding_style: $("#code-style").value,
    learning_goal: $("#code-learning-goal").value,
    learner_profile: buildLearnerProfile("codeTutor"),
  };
  try {
    const data = getOptionalAgentLLMConfig("code_tutor")
      ? await postAgentJson("/api/code_tutor", payload, "code_tutor")
      : createMockCodeTutorStep(payload);
    appState.codeTutor = data;
    if (data.raw_answer) {
      $("#code-block").textContent = "";
      $("#code-explanation").innerHTML = renderRawAnswer(data.raw_answer);
      $("#save-code-note").disabled = false;
      return;
    }
    renderCodeTutorStep(data);
    $("#save-code-note").disabled = false;
  } catch (error) {
    const data = {
      ...createMockCodeTutorStep(payload),
      fallback_reason: error.message,
    };
    appState.codeTutor = data;
    renderCodeTutorStep(data);
    $("#save-code-note").disabled = false;
  }
}

async function generateFullCode() {
  $("#code-block").textContent = "正在调用代码陪练 Agent 生成完整项目代码...";
  $("#code-step-kicker").textContent = "Full Project";
  $("#code-step-title").textContent = "完整机器学习项目代码";
  $("#code-step-goal").textContent = "生成可直接保存为 .py 的完整脚本，包含数据加载、训练、评估和结果解释输出。";
  $("#code-why").textContent = "正在组织完整代码结构...";
  $("#code-explanation").innerHTML = "";
  $("#download-code-file").disabled = true;
  const payload = {
    step_index: -1,
    step_title: "完整机器学习项目代码",
    project: $("#code-project").value,
    model_algorithm: $("#code-model").value,
    generation_mode: "full_project",
    full_project: true,
    learner_level: $("#code-learner-level").value,
    coding_style: $("#code-style").value,
    learning_goal: $("#code-learning-goal").value,
    learner_profile: buildLearnerProfile("codeTutor"),
  };
  try {
    const data = getOptionalAgentLLMConfig("code_tutor")
      ? await postAgentJson("/api/code_tutor", payload, "code_tutor")
      : createMockFullProjectCode(payload);
    appState.codeTutor = data;
    if (data.raw_answer) {
      $("#code-block").textContent = "";
      $("#code-explanation").innerHTML = renderRawAnswer(data.raw_answer);
      $("#save-code-note").disabled = false;
      return;
    }
    renderCodeTutorStep(data);
    $("#save-code-note").disabled = false;
  } catch (error) {
    const data = {
      ...createMockFullProjectCode(payload),
      fallback_reason: error.message,
    };
    appState.codeTutor = data;
    renderCodeTutorStep(data);
    $("#save-code-note").disabled = false;
  }
}

function createMockCodeTutorStep(payload) {
  const index = Math.max(0, Math.min(CODE_STEPS.length - 1, Number(payload.step_index || 0)));
  const snippet = MOCK_CODE_SNIPPETS[index] || MOCK_CODE_SNIPPETS[0];
  const nextTitle = CODE_STEPS[Math.min(index + 1, CODE_STEPS.length - 1)];
  return {
    generated_by: "local_mock",
    step_index: index,
    step_title: `Step ${index + 1}: ${payload.step_title || CODE_STEPS[index]}`,
    step_goal: `围绕“${payload.project || "Iris 分类实验"}”完成本步骤，并理解它在机器学习流程中的位置。`,
    code_language: "python",
    code: snippet.code,
    why: snippet.why,
    line_by_line_explanation: snippet.explanation,
    key_concepts: snippet.concepts,
    run_checklist: [
      "确认已经选择项目案例和模型算法。",
      "按顺序运行本步骤代码。",
      "把输出结果和预期现象对照检查。",
    ],
    common_errors: snippet.errors,
    expected_output: snippet.expected,
    try_it_task: snippet.task,
    next_step: index < CODE_STEPS.length - 1
      ? `继续 Step ${index + 2}: ${nextTitle}。`
      : "回到实验中心运行完整流程，并把结果保存到学习档案。",
    related_actions: [
      { label: "去实验中心运行", target_view: "experiment" },
      { label: "复习相关概念", target_view: "concept" },
      { label: "保存到档案", target_view: "archive" },
    ],
  };
}

function createMockFullProjectCode(payload) {
  const code = `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

df = pd.read_csv("iris.csv")

feature_cols = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
X = df[feature_cols]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print("Accuracy:", round(acc, 3))
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))`;
  return {
    generated_by: "local_mock",
    generation_mode: "full_project",
    full_project: true,
    step_title: "完整机器学习分类项目代码",
    step_goal: `用“${payload.project || "Iris 分类实验"}”串起数据读取、训练、预测和评价。`,
    code_language: "python",
    code,
    why: "完整代码把前面 10 个步骤串成一条可复现的分类实验流程，适合答辩演示和报告复盘。",
    line_by_line_explanation: [
      "先导入 pandas、sklearn 模型和评价指标。",
      "读取 CSV 后拆分特征 X 与标签 y。",
      "用 train_test_split 保留测试集。",
      "训练 LogisticRegression 并输出 Accuracy、分类报告和混淆矩阵。",
    ],
    key_concepts: ["完整流程", "分类任务", "模型评估", "可复现"],
    run_checklist: [
      "准备包含 sepal_length、sepal_width、petal_length、petal_width、target 的 iris.csv。",
      "确认 scikit-learn 已安装。",
      "运行脚本后检查 Accuracy 和混淆矩阵。",
    ],
    common_errors: [
      "CSV 字段名和代码字段名不一致。",
      "target 列缺失。",
      "只展示指标，不解释混淆矩阵。",
    ],
    expected_output: "终端会输出 Accuracy、每类 Precision/Recall/F1，以及混淆矩阵。",
    try_it_task: "把 LogisticRegression 换成 KNN，再比较 Accuracy 和混淆矩阵变化。",
    next_step: "进入实验中心，用内置 Iris 数据运行同一条流程并保存实验记录。",
    related_actions: [
      { label: "去实验中心验证", target_view: "experiment" },
      { label: "查看学习档案", target_view: "archive" },
      { label: "追问代码细节", target_view: "ask" },
    ],
  };
}

function renderCodeTutorStep(data) {
  const isFullProject = data.generation_mode === "full_project" || data.full_project;
  $("#code-step-kicker").textContent = isFullProject ? "Full Project" : `Step ${appState.currentCodeStep + 1} / ${CODE_STEPS.length}`;
  $("#code-step-title").textContent = data.step_title || CODE_STEPS[appState.currentCodeStep];
  $("#code-step-goal").textContent = data.step_goal || "理解当前代码步骤并能自己复现。";
  $("#code-language-label").textContent = data.code_language || "python";
  $("#code-block").textContent = data.code || "# 模型未返回代码";
  $("#code-why").textContent = data.why || "模型未返回原因说明。";
  $("#code-explanation").innerHTML = renderLineExplanations(data.line_by_line_explanation);
  $("#code-key-concepts").innerHTML = asArray(data.key_concepts)
    .map((concept) => `<button type="button" data-code-concept="${escapeHtml(concept)}">${escapeHtml(concept)}</button>`)
    .join("");
  $("#code-key-concepts").querySelectorAll("[data-code-concept]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToView("concept", {
        ...currentPageContext(),
        topic: button.dataset.codeConcept,
      });
    });
  });
  $("#code-checklist").innerHTML = renderPlainListItems(data.run_checklist || data.prerequisites);
  $("#code-common-errors").innerHTML = renderPlainListItems(data.common_errors);
  $("#code-expected-output").textContent = data.expected_output || "模型未返回运行预期。";
  $("#code-try-task").textContent = data.try_it_task || data.extension_task || "尝试修改一个参数，并观察输出变化。";
  $("#code-next-step").textContent = data.next_step || "继续下一步。";
  $("#code-related-actions").innerHTML = renderCodeActionButtons(data.related_actions);
  $("#download-code-file").disabled = !(data.code || "").trim();
}

function renderLineExplanations(items) {
  const explanations = asArray(items);
  if (!explanations.length) return `<p class="empty-note">模型未返回逐行解释。</p>`;
  return explanations
    .map((item) => {
      if (item && typeof item === "object") {
        return `
          <article class="line-explain-item">
            <code>${escapeHtml(item.line || item.code || "代码行")}</code>
            <p>${escapeHtml(item.explanation || item.meaning || "")}</p>
          </article>
        `;
      }
      return `
        <article class="line-explain-item">
          <p>${escapeHtml(item)}</p>
        </article>
      `;
    })
    .join("");
}

function renderPlainListItems(items) {
  const list = asArray(items).filter(Boolean);
  if (!list.length) return `<li>暂无内容，可重新生成并要求模型补充。</li>`;
  return list.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderCodeActionButtons(actions) {
  const defaults = [
    { label: "去实验中心运行", target_view: "experiment" },
    { label: "查看相关概念", target_view: "concept" },
    { label: "保存到档案", target_view: "archive" },
  ];
  const valid = (Array.isArray(actions) && actions.length ? actions : defaults)
    .filter((action) => ["concept", "visualize", "codeTutor", "experiment", "diagnose", "archive"].includes(action.target_view))
    .slice(0, 3);
  return valid
    .map((action, index) => `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-code-target="${escapeHtml(action.target_view)}">${escapeHtml(action.label || viewLabel(action.target_view))}</button>`)
    .join("");
}

async function copyCurrentCode() {
  const code = $("#code-block").textContent || "";
  try {
    await navigator.clipboard.writeText(code);
    $("#copy-code").textContent = "已复制";
    setTimeout(() => {
      $("#copy-code").textContent = "复制代码";
    }, 1200);
  } catch (error) {
    $("#copy-code").textContent = "复制失败";
    setTimeout(() => {
      $("#copy-code").textContent = "复制代码";
    }, 1200);
  }
}

function downloadCurrentCodeFile() {
  const code = $("#code-block").textContent || "";
  if (!code.trim()) return;
  const projectName = ($("#code-project").value || "ml_project").replace(/[\\/:*?"<>|\s]+/g, "_");
  const modelName = ($("#code-model").value || "model").replace(/[\\/:*?"<>|\s]+/g, "_");
  const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectName}_${modelName}.py`;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveCodeNote() {
  if (!appState.codeTutor) return;
  const data = appState.codeTutor;
  const isFullProject = data.generation_mode === "full_project" || data.full_project;
  const codeRecordBase = {
    topic: data.step_title || CODE_STEPS[appState.currentCodeStep],
    category: isFullProject ? "代码陪练-完整项目" : "代码陪练",
    status: "已练习",
    summary: data.step_goal || data.why || data.raw_answer || "",
    project: $("#code-project").value,
    model_algorithm: $("#code-model").value,
    code_style: $("#code-style").value,
    learning_goal: $("#code-learning-goal").value,
    step_index: isFullProject ? -1 : appState.currentCodeStep,
    code: data.code || "",
    learner_profile: buildLearnerProfile("codeTutor"),
    payload: data,
    handoff_context: buildAgentHandoff("code_experiment", "assessment_diagnosis", {
      topic: data.step_title || CODE_STEPS[appState.currentCodeStep],
      target_view: "archive",
      profile_source: "codeTutor",
      evidence: data.try_it_task || data.step_goal || "",
      recommended_action: "检查代码步骤是否能独立复现。",
    }),
  };
  const record = {
    ...codeRecordBase,
    view_snapshot: buildArchiveViewSnapshot("codeTutor", codeRecordBase, data),
  };
  await LocalArchive.addRecord("learning_records", record);
  await recordLearningSignals("codeTutor", record, data);
  await LocalArchive.addRecord("agent_outputs", {
    agent_name: "代码陪练 Agent",
    input: isFullProject ? "完整项目代码" : CODE_STEPS[appState.currentCodeStep],
    output_summary: data.step_goal || data.next_step || data.raw_answer || "",
    payload: data,
  });
  $("#save-code-note").disabled = true;
  refreshDashboard();
  renderContextBridge(currentViewName(), { ...currentPageContext(), source: "已保存到档案" });
}

function setupExperiment() {
  $("#sample-dataset-select").addEventListener("change", () => {
    appState.selectedSampleDatasetId = $("#sample-dataset-select").value || "iris";
    loadSampleDataset(appState.selectedSampleDatasetId);
  });
  $("#load-sample").addEventListener("click", () => loadSampleDataset($("#sample-dataset-select").value));
  $("#clear-csv").addEventListener("click", clearExperimentData);
  $("#csv-file").addEventListener("change", readCsvFile);
  $("#csv-text").addEventListener("input", handleExperimentInputChanged);
  $("#target-column").addEventListener("input", handleExperimentInputChanged);
  $("#model-name").addEventListener("change", handleExperimentInputChanged);
  $("#train-model").addEventListener("click", trainModel);
  $("#copy-experiment-code").addEventListener("click", copyExperimentCode);
  $("#download-experiment-report").addEventListener("click", downloadExperimentReport);
  $("#save-experiment").addEventListener("click", saveExperiment);
  $("#experiment-column-insights").addEventListener("click", (event) => {
    const button = event.target.closest("[data-target-column]");
    if (!button) return;
    $("#target-column").value = button.dataset.targetColumn;
    handleExperimentInputChanged();
  });
  $("#experiment-output").addEventListener("click", handleExperimentAction);
  setupSampleDatasets();
}

async function setupSampleDatasets() {
  try {
    const response = await fetch("/api/sample_datasets");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "示例案例加载失败");
    appState.sampleDatasets = asArray(data.datasets);
    renderSampleDatasetOptions();
    renderSampleDatasetGuide(currentSampleDatasetMeta());
    await loadSampleDataset(appState.selectedSampleDatasetId);
  } catch (error) {
    $("#sample-dataset-guide").innerHTML = `<p class="empty-note">${escapeHtml(error.message || "示例案例加载失败，请稍后重试。")}</p>`;
    await loadSampleDataset("iris");
  }
}

function renderSampleDatasetOptions() {
  const select = $("#sample-dataset-select");
  if (!appState.sampleDatasets.length) {
    select.innerHTML = `<option value="iris">Iris 鸢尾花三分类</option>`;
    appState.selectedSampleDatasetId = "iris";
    return;
  }
  if (!appState.sampleDatasets.some((item) => item.id === appState.selectedSampleDatasetId)) {
    appState.selectedSampleDatasetId = appState.sampleDatasets[0].id;
  }
  select.innerHTML = appState.sampleDatasets
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");
  select.value = appState.selectedSampleDatasetId;
}

function currentSampleDatasetMeta() {
  return appState.sampleDatasets.find((item) => item.id === appState.selectedSampleDatasetId) || appState.sampleDatasets[0] || null;
}

function renderSampleDatasetGuide(meta) {
  if (!meta) {
    $("#sample-dataset-guide").innerHTML = `<p class="empty-note">选择一个案例后，会显示学习目标和观察步骤。</p>`;
    return;
  }
  const tags = asArray(meta.tags).slice(0, 4);
  const focusPoints = asArray(meta.focus_points).slice(0, 3);
  const guideSteps = asArray(meta.guide_steps).slice(0, 4);
  $("#sample-dataset-guide").innerHTML = `
    <div class="sample-case-summary">
      <div>
        <p class="sample-case-label">${escapeHtml(meta.task_type || "分类任务")} · ${escapeHtml(meta.difficulty || "入门")}</p>
        <h3>${escapeHtml(meta.name)}</h3>
      </div>
      <div class="sample-case-stats">
        <span>${escapeHtml(meta.row_count || "-")} 行</span>
        <span>${escapeHtml(meta.feature_count || "-")} 特征</span>
      </div>
    </div>
    <p class="sample-description">${escapeHtml(meta.description || "")}</p>
    <div class="sample-tag-row">
      ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="sample-guide-block">
      <h4>学习目标</h4>
      <p>${escapeHtml(meta.learning_goal || "完成一次可复现的分类实验。")}</p>
    </div>
    <div class="sample-guide-block">
      <h4>观察重点</h4>
      <ul>${focusPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="sample-guide-block">
      <h4>推荐步骤</h4>
      <ol>${guideSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
    </div>
  `;
}

async function loadSampleDataset(datasetId = null) {
  const selectedId = datasetId || $("#sample-dataset-select").value || appState.selectedSampleDatasetId || "iris";
  appState.selectedSampleDatasetId = selectedId;
  if ($("#sample-dataset-select").value !== selectedId) $("#sample-dataset-select").value = selectedId;
  invalidateExperimentOutput();
  const loadRunId = appState.experimentRunId;

  const button = $("#load-sample");
  const trainButton = $("#train-model");
  button.disabled = true;
  trainButton.disabled = true;
  button.textContent = "载入中...";
  try {
    const response = await fetch(`/api/sample_dataset?id=${encodeURIComponent(selectedId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "示例数据加载失败");
    if (loadRunId !== appState.experimentRunId) return;

    const meta = appState.sampleDatasets.find((item) => item.id === data.id) || data;
    appState.selectedSampleDatasetId = data.id || selectedId;
    renderSampleDatasetGuide({ ...meta, ...data, csv_text: undefined });

    $("#csv-text").value = data.csv_text;
    $("#dataset-name").value = data.name || data.filename || "示例数据";
    $("#target-column").value = data.target_column || "target";
    $("#experiment-output").innerHTML = `
      <div class="experiment-empty sample-loaded">
        <p class="eyebrow">Sample Loaded</p>
        <h2>${escapeHtml(data.name || "示例数据")} 已载入</h2>
        <p>${escapeHtml(data.learning_goal || "检查数据体检结果，确认目标列后即可训练模型并调用结果解释 Agent。")}</p>
        <div class="sample-loaded-actions">
          <span>下一步: 查看字段分析</span>
          <span>训练模型</span>
          <span>解释指标</span>
        </div>
      </div>
    `;
    renderCsvPreview();
  } catch (error) {
    if (loadRunId === appState.experimentRunId) setMessage("#experiment-output", error.message || "示例数据加载失败，请稍后重试。");
  } finally {
    if (loadRunId === appState.experimentRunId) {
      button.disabled = false;
      trainButton.disabled = false;
      button.textContent = "载入所选案例";
    }
  }
}

function clearExperimentData() {
  $("#csv-text").value = "";
  $("#dataset-name").value = "当前 CSV 数据";
  $("#target-column").value = "target";
  invalidateExperimentOutput();
  appState.csvProfile = null;
  renderCsvPreview();
  $("#experiment-output").innerHTML = `
    <div class="experiment-empty">
      <p class="eyebrow">Empty</p>
      <h2>等待导入 CSV 数据</h2>
      <p>可以从经典实验示例载入数据、上传本地 CSV，或直接粘贴表格内容。</p>
    </div>
  `;
}

function readCsvFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $("#csv-text").value = reader.result;
    $("#dataset-name").value = file.name;
    handleExperimentInputChanged();
  };
  reader.readAsText(file, "utf-8");
}

function renderCsvPreview() {
  const profile = buildCsvProfile($("#csv-text").value, $("#target-column").value.trim());
  appState.csvProfile = profile;
  renderExperimentProfile(profile);
  renderExperimentReadiness(profile);
  renderCsvPreviewTable(profile);
  renderExperimentColumnInsights(profile);
}

function handleExperimentInputChanged() {
  renderCsvPreview();
  invalidateExperimentOutput("数据或实验配置已更新，请重新训练模型后查看结果。");
}

function invalidateExperimentOutput(message = "") {
  appState.experimentRunId += 1;
  appState.experiment = null;
  appState.experimentReport = "";
  $("#load-sample").disabled = false;
  $("#load-sample").textContent = "载入所选案例";
  $("#train-model").disabled = false;
  $("#save-experiment").disabled = true;
  $("#download-experiment-report").disabled = true;
  if (message) {
    $("#experiment-output").innerHTML = `
      <div class="experiment-empty">
        <p class="eyebrow">Waiting</p>
        <h2>等待重新训练</h2>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (inQuotes && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function buildCsvProfile(text, targetColumn) {
  const rows = parseCsvRows(text.trim());
  const empty = {
    headers: [],
    rows: [],
    rowCount: 0,
    columnCount: 0,
    targetColumn,
    targetIndex: -1,
    numericFeatures: [],
    missingTotal: 0,
    missingByColumn: {},
    duplicateCount: 0,
    targetDistribution: {},
    warnings: ["请先导入或粘贴 CSV 数据。"],
    ready: false,
  };
  if (!rows.length) return empty;

  const headers = rows[0].map((cell) => cell.trim()).filter(Boolean);
  const dataRows = rows
    .slice(1)
    .map((rawRow) => headers.map((_, index) => rawRow[index] ?? ""))
    .filter((row) => row.some((value) => value !== ""));
  const targetIndex = headers.indexOf(targetColumn);
  const missingByColumn = {};
  let missingTotal = 0;
  headers.forEach((header, columnIndex) => {
    const count = dataRows.filter((row) => (row[columnIndex] ?? "") === "").length;
    missingByColumn[header] = count;
    missingTotal += count;
  });
  const duplicateCount = dataRows.length - new Set(dataRows.map((row) => row.join("\u001f"))).size;
  const numericFeatures = headers.filter((header, columnIndex) => {
    if (columnIndex === targetIndex) return false;
    const values = dataRows.map((row) => row[columnIndex]).filter(Boolean);
    return values.length > 0 && values.every((value) => Number.isFinite(Number(value)));
  });
  const targetDistribution = {};
  if (targetIndex >= 0) {
    for (const row of dataRows) {
      const label = row[targetIndex] || "(空)";
      targetDistribution[label] = (targetDistribution[label] || 0) + 1;
    }
  }

  const warnings = [];
  if (!headers.length) warnings.push("CSV 缺少表头。");
  if (dataRows.length < 6) warnings.push("有效数据至少需要 6 行，才能演示训练集和测试集划分。");
  if (targetIndex < 0) warnings.push(`目标列 ${targetColumn || "(未填写)"} 不存在，请从候选列中选择。`);
  if (targetIndex >= 0 && Object.keys(targetDistribution).length < 2) warnings.push("分类任务至少需要 2 个类别。");
  if (!numericFeatures.length) warnings.push("当前 demo 至少需要 1 个数值型特征列。");
  if (missingTotal > 0) warnings.push(`存在 ${missingTotal} 个缺失值，训练时会对数值特征做均值填补。`);
  if (duplicateCount > 0) warnings.push(`检测到 ${duplicateCount} 行重复数据，建议在正式实验前确认是否保留。`);

  return {
    headers,
    rows: dataRows,
    rowCount: dataRows.length,
    columnCount: headers.length,
    targetColumn,
    targetIndex,
    numericFeatures,
    missingTotal,
    missingByColumn,
    duplicateCount,
    targetDistribution,
    warnings,
    ready: dataRows.length >= 6 && targetIndex >= 0 && Object.keys(targetDistribution).length >= 2 && numericFeatures.length > 0,
  };
}

function renderExperimentProfile(profile) {
  const cards = [
    { label: "样本行数", value: profile.rowCount || "-", tone: "teal" },
    { label: "字段数量", value: profile.columnCount || "-", tone: "blue" },
    { label: "数值特征", value: profile.numericFeatures.length || "-", tone: "amber" },
    { label: "缺失值", value: profile.missingTotal || 0, tone: profile.missingTotal ? "danger" : "teal" },
  ];
  $("#experiment-data-profile").innerHTML = cards
    .map((card) => `
      <article class="experiment-stat ${card.tone}">
        <span>${escapeHtml(card.label)}</span>
        <strong>${escapeHtml(card.value)}</strong>
      </article>
    `)
    .join("");
}

function renderExperimentReadiness(profile) {
  const checks = [
    { ok: profile.rowCount >= 6, text: "至少 6 行有效数据" },
    { ok: profile.targetIndex >= 0, text: "目标列存在" },
    { ok: Object.keys(profile.targetDistribution).length >= 2, text: "至少 2 个类别" },
    { ok: profile.numericFeatures.length > 0, text: "至少 1 个数值特征" },
  ];
  $("#experiment-readiness").innerHTML = `
    <p class="readiness-title">${profile.ready ? "可以开始训练" : "训练前需要处理"}</p>
    <div class="readiness-list">
      ${checks
        .map((item) => `<span class="${item.ok ? "ok" : "warn"}">${item.ok ? "✓" : "!"} ${escapeHtml(item.text)}</span>`)
        .join("")}
    </div>
  `;
}

function renderCsvPreviewTable(profile) {
  if (!profile.headers.length) {
    $("#csv-preview").innerHTML = `<p class="empty-note">暂无数据预览。</p>`;
    return;
  }
  $("#csv-preview").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Preview</p>
        <h2>数据预览</h2>
      </div>
      <span>${profile.rowCount} 行</span>
    </div>
    ${renderTable(profile.headers, profile.rows.slice(0, 8))}
  `;
}

function renderExperimentColumnInsights(profile) {
  if (!profile.headers.length) {
    $("#experiment-column-insights").innerHTML = `<p class="empty-note">导入 CSV 后会显示字段分析。</p>`;
    return;
  }
  const maxTargetCount = Math.max(1, ...Object.values(profile.targetDistribution));
  const targetBars = Object.entries(profile.targetDistribution)
    .map(([label, count]) => `
      <div class="distribution-row">
        <span>${escapeHtml(label)}</span>
        <div class="bar-track"><span style="width: ${Math.round((count / maxTargetCount) * 100)}%"></span></div>
        <strong>${count}</strong>
      </div>
    `)
    .join("");
  const missingItems = Object.entries(profile.missingByColumn)
    .filter(([, count]) => count > 0)
    .map(([column, count]) => `<li>${escapeHtml(column)}: ${count}</li>`)
    .join("");
  $("#experiment-column-insights").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Columns</p>
        <h2>字段与目标列</h2>
      </div>
      <span>${profile.ready ? "已就绪" : "需检查"}</span>
    </div>
    <div class="target-column-row">
      ${profile.headers.map((header) => `<button type="button" class="${header === profile.targetColumn ? "active" : ""}" data-target-column="${escapeHtml(header)}">${escapeHtml(header)}</button>`).join("")}
    </div>
    <div class="insight-block">
      <h3>数值特征</h3>
      <div class="chip-row">${profile.numericFeatures.map((feature) => `<span>${escapeHtml(feature)}</span>`).join("") || "<span>暂无</span>"}</div>
    </div>
    <div class="insight-block">
      <h3>类别分布</h3>
      ${targetBars || `<p class="empty-note">请选择目标列。</p>`}
    </div>
    <div class="insight-block">
      <h3>数据质量</h3>
      <ul class="compact-list">
        <li>重复行: ${profile.duplicateCount}</li>
        ${missingItems || "<li>未发现缺失值。</li>"}
      </ul>
    </div>
    ${profile.warnings.length ? `<div class="experiment-warning">${profile.warnings.map(escapeHtml).join(" / ")}</div>` : ""}
  `;
}

async function trainModel() {
  renderCsvPreview();
  if (!appState.csvProfile?.ready) {
    setMessage("#experiment-output", `暂不能训练: ${appState.csvProfile?.warnings.join("；") || "请先导入有效 CSV 数据。"}`);
    return;
  }
  const llmConfig = getOptionalAgentLLMConfig("result");
  const runId = ++appState.experimentRunId;
  const trainButton = $("#train-model");
  trainButton.disabled = true;
  $("#save-experiment").disabled = true;
  $("#download-experiment-report").disabled = true;
  appState.experiment = null;
  appState.experimentReport = "";
  setMessage("#experiment-output", llmConfig ? "正在训练模型，并等待结果解释 Agent 生成完整说明..." : "正在训练模型...");
  try {
    const payload = {
      csv_text: $("#csv-text").value,
      target_column: $("#target-column").value.trim(),
      model_name: $("#model-name").value,
      learner_profile: buildLearnerProfile("experiment"),
    };
    const trainedData = await postJson("/api/train_model", payload);
    if (runId !== appState.experimentRunId) return;
    const data = llmConfig ? await requestExperimentExplanation(trainedData, llmConfig) : trainedData;
    if (runId !== appState.experimentRunId) return;
    appState.experiment = data;
    appState.experimentReport = buildExperimentReport(data);
    $("#save-experiment").disabled = false;
    $("#download-experiment-report").disabled = false;
    renderExperiment(data);
  } catch (error) {
    if (runId === appState.experimentRunId) setMessage("#experiment-output", error.message);
  } finally {
    if (runId === appState.experimentRunId) trainButton.disabled = false;
  }
}

async function requestExperimentExplanation(data, llmConfig) {
  delete data.result_explanation;
  try {
    const explanation = ensureAgentResponse(await postJson("/api/explain_result", {
      ...data,
      learner_profile: buildLearnerProfile("experiment"),
      llm_config: withResultAgentTimeout(llmConfig),
    }, { timeoutMs: agentRequestTimeoutMs(llmConfig) }));
    if (hasUsableResultExplanation(explanation)) {
      data.result_explanation = explanation;
    } else {
      delete data.result_explanation;
    }
  } catch (error) {
    delete data.result_explanation;
  }
  return data;
}

function renderExperiment(data) {
  const metricHints = {
    Accuracy: "整体预测正确比例",
    Precision: "预测为某类时有多准",
    Recall: "真实某类被找回多少",
    F1: "Precision 与 Recall 的平衡",
  };
  const metrics = data.metric_bars
    .map((metric) => {
      const value = Number(metric.value || 0);
      return `
        <div class="metric-card rich">
          <span>${escapeHtml(metric.name)}</span>
          <strong>${value.toFixed(3)}</strong>
          <div class="bar-track"><span style="width: ${Math.round(value * 100)}%"></span></div>
          <small>${escapeHtml(metricHints[metric.name] || "模型评估指标")}</small>
        </div>
      `;
    })
    .join("");
  const cm = data.confusion_matrix;
  const explanation = data.result_explanation || {};
  const summary = data.data_summary || {};
  const modelDetail = data.model_detail || {};
  const preprocessing = data.preprocessing || {};
  const perLabelRows = asArray(data.per_label_metrics).map((item) => [
    item.label,
    Number(item.precision || 0).toFixed(3),
    Number(item.recall || 0).toFixed(3),
    Number(item.f1 || 0).toFixed(3),
  ]);
  const predictionRows = asArray(data.predictions).map((item, index) => [
    index + 1,
    item.actual,
    item.predicted,
    item.correct ? "正确" : "需关注",
  ]);
  const resultAgentSection = hasUsableResultExplanation(explanation) ? renderResultAgentExplanation(explanation) : "";
  $("#experiment-output").innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Result</p>
        <h2>训练结果</h2>
      </div>
      <div class="button-row">
        <button class="secondary-button" data-exp-action="concept">复习评估指标</button>
        <button class="secondary-button" data-exp-action="diagnose">发送到诊断</button>
      </div>
    </div>
    <div class="metric-grid">${metrics}</div>
    ${renderFormulaBlock("指标公式速查", experimentMetricFormulas(explanation.metric_formulas), "先看公式，再结合混淆矩阵判断模型问题来自误报、漏报还是类别混淆。")}
    <div class="experiment-summary-strip">
      <div><span>训练集</span><strong>${summary.train_size}</strong></div>
      <div><span>测试集</span><strong>${summary.test_size}</strong></div>
      <div><span>目标列</span><strong>${escapeHtml(summary.target_column)}</strong></div>
      <div><span>特征数</span><strong>${asArray(summary.numeric_features).length}</strong></div>
    </div>
    <section class="experiment-card">
      <h3>模型训练详情</h3>
      <div class="experiment-detail-grid">
        <div><span>算法</span><strong>${escapeHtml(modelDetail.display_name || data.model_name || "-")}</strong></div>
        <div><span>算法类型</span><strong>${escapeHtml(modelDetail.algorithm_family || "-")}</strong></div>
        <div><span>特征处理</span><strong>${escapeHtml(preprocessing.feature_scaling || "按模型需要处理数值特征")}</strong></div>
      </div>
      <p class="archive-detail-summary">${escapeHtml(modelDetail.training_summary || "本次训练已完成，可结合指标和混淆矩阵复盘。")}</p>
      ${renderModelLearnedSummary(modelDetail.learned_summary)}
    </section>
    <div class="experiment-result-grid">
      <section class="experiment-card">
        <h3>混淆矩阵</h3>
        ${renderConfusionMatrix(cm)}
      </section>
      <section class="experiment-card">
        <h3>各类别表现</h3>
        ${perLabelRows.length ? renderTable(["类别", "Precision", "Recall", "F1"], perLabelRows) : `<p class="empty-note">暂无类别指标。</p>`}
      </section>
    </div>
    <section class="experiment-card">
      <h3>样本预测对照</h3>
      ${predictionRows.length ? renderTable(["#", "真实类别", "预测类别", "状态"], predictionRows) : `<p class="empty-note">暂无预测样本。</p>`}
    </section>
    ${resultAgentSection}
  `;
}

function hasUsableResultExplanation(explanation) {
  if (!explanation || typeof explanation !== "object") return false;
  const textFields = [
    explanation.raw_answer,
    explanation.summary,
    explanation.metric_explanation,
    explanation.problem_analysis,
    explanation.metric_formulas,
  ];
  const hasText = textFields.some((value) => typeof value === "string" && value.trim());
  const hasList = [
    explanation.optimization_suggestions,
    explanation.learning_takeaways,
    explanation.next_experiments,
  ].some((items) => asArray(items).some((item) => String(item || "").trim()));
  return hasText || hasList;
}

function renderResultAgentExplanation(explanation) {
  return `
    <section class="experiment-card agent-explain-card">
      <h3>结果解释 Agent</h3>
      ${explanation.raw_answer ? `<p>${escapeHtml(explanation.raw_answer)}</p>` : `
        <p>${escapeHtml(explanation.summary || "")}</p>
        <p>${escapeHtml(explanation.metric_explanation || "")}</p>
        <p>${escapeHtml(explanation.problem_analysis || "")}</p>
        ${renderSuggestionList("优化建议", explanation.optimization_suggestions)}
        ${renderSuggestionList("学习收获", explanation.learning_takeaways)}
        ${renderSuggestionList("下一步实验", explanation.next_experiments)}
      `}
    </section>
  `;
}

function renderModelLearnedSummary(summary) {
  if (!summary || typeof summary !== "object") return "";
  if (Array.isArray(summary.rules)) {
    return `
      <div class="suggestion-block">
        <h4>可解释规则</h4>
        <ul>${summary.rules.slice(0, 8).map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>
      </div>
    `;
  }
  if (summary.k) {
    return `<p class="meta-line">KNN 使用 k=${escapeHtml(summary.k)}，训练样本 ${escapeHtml(summary.train_samples)} 条。</p>`;
  }
  if (summary.centroids) {
    return `<p class="meta-line">最近质心已为 ${Object.keys(summary.centroids).length} 个类别计算中心点。</p>`;
  }
  if (summary.class_priors) {
    return `<p class="meta-line">贝叶斯模型已估计 ${Object.keys(summary.class_priors).length} 个类别的先验概率和特征分布。</p>`;
  }
  return "";
}

function experimentMetricFormulas(modelText) {
  return modelText || [
    "Accuracy = 正确预测数 / 总样本数",
    "Precision = TP / (TP + FP)",
    "Recall = TP / (TP + FN)",
    "F1 = 2 × Precision × Recall / (Precision + Recall)",
    "Macro 平均 = 各类别指标的算术平均",
  ].join("\n");
}

function renderConfusionMatrix(cm) {
  if (!cm?.labels?.length) return `<p class="empty-note">暂无混淆矩阵。</p>`;
  const maxValue = Math.max(1, ...cm.matrix.flat());
  return `
    <div class="confusion-wrap">
      <table class="confusion-table">
        <thead><tr><th>真实 \\ 预测</th>${cm.labels.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}</tr></thead>
        <tbody>
          ${cm.matrix
            .map((row, rowIndex) => `
              <tr>
                <th>${escapeHtml(cm.labels[rowIndex])}</th>
                ${row
                  .map((value, columnIndex) => `<td class="${rowIndex === columnIndex ? "correct-cell" : "miss-cell"}" style="--cell-alpha:${Math.max(0.12, value / maxValue)}">${value}</td>`)
                  .join("")}
              </tr>
            `)
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSuggestionList(title, items) {
  const list = asArray(items).filter(Boolean);
  if (!list.length) return "";
  return `
    <div class="suggestion-block">
      <h4>${escapeHtml(title)}</h4>
      <ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function handleExperimentAction(event) {
  const button = event.target.closest("[data-exp-action]");
  if (!button) return;
  if (button.dataset.expAction === "concept") {
    navigateToView("concept", {
      ...currentPageContext(),
      topic: "Accuracy Precision Recall F1 混淆矩阵",
      learningGoal: "复习分类实验指标，并能解释本次实验结果。",
    });
  }
  if (button.dataset.expAction === "diagnose") {
    navigateToView("diagnose", currentPageContext());
  }
}

async function copyExperimentCode() {
  const target = $("#target-column").value.trim() || "target";
  const code = experimentModelCode($("#model-name").value, target);
  try {
    await navigator.clipboard.writeText(code);
    $("#copy-experiment-code").textContent = "已复制代码";
  } catch (error) {
    $("#copy-experiment-code").textContent = "复制失败";
  }
  setTimeout(() => {
    $("#copy-experiment-code").textContent = "复制实验代码";
  }, 1200);
}

function experimentModelCode(modelName, target) {
  const safeTarget = target.replaceAll("'", "\\'");
  const imports = {
    nearest_centroid: "from sklearn.neighbors import NearestCentroid",
    knn: "from sklearn.neighbors import KNeighborsClassifier",
    decision_tree: "from sklearn.tree import DecisionTreeClassifier",
    gaussian_nb: "from sklearn.naive_bayes import GaussianNB",
  };
  const modelLines = {
    nearest_centroid: "model = NearestCentroid()",
    knn: "model = KNeighborsClassifier(n_neighbors=5)",
    decision_tree: "model = DecisionTreeClassifier(max_depth=3, random_state=42)",
    gaussian_nb: "model = GaussianNB()",
  };
  return [
    "import pandas as pd",
    "from sklearn.model_selection import train_test_split",
    imports[modelName] || imports.nearest_centroid,
    "from sklearn.metrics import classification_report, confusion_matrix",
    "",
    "data = pd.read_csv('your_dataset.csv')",
    `X = data.drop(columns=['${safeTarget}'])`,
    `y = data['${safeTarget}']`,
    "X_train, X_test, y_train, y_test = train_test_split(",
    "    X, y, test_size=0.3, random_state=42, stratify=y",
    ")",
    modelLines[modelName] || modelLines.nearest_centroid,
    "model.fit(X_train, y_train)",
    "pred = model.predict(X_test)",
    "print(classification_report(y_test, pred))",
    "print(confusion_matrix(y_test, pred))",
  ].join("\n");
}

function buildExperimentReport(data) {
  const explanation = data.result_explanation || {};
  const summary = data.data_summary || {};
  const modelDetail = data.model_detail || {};
  const explanationSection = hasUsableResultExplanation(explanation) ? [
    "",
    "## 结果解释",
    explanation.raw_answer || explanation.summary || "",
    explanation.metric_explanation || "",
    explanation.problem_analysis || "",
    "",
    "## 优化建议",
    ...asArray(explanation.optimization_suggestions).map((item) => `- ${item}`),
  ] : [];
  return [
    `# ${$("#dataset-name").value || "分类实验报告"}`,
    "",
    `- 模型: ${modelDetail.display_name || data.model_name}`,
    `- 任务类型: ${data.task_type}`,
    `- 目标列: ${summary.target_column}`,
    `- 样本数: ${summary.row_count}`,
    `- 训练集/测试集: ${summary.train_size}/${summary.test_size}`,
    `- 数值特征: ${asArray(summary.numeric_features).join(", ")}`,
    `- 训练方式: ${modelDetail.training_summary || ""}`,
    "",
    "## 指标",
    `- Accuracy: ${data.metrics?.accuracy}`,
    `- Macro Precision: ${data.metrics?.macro_precision}`,
    `- Macro Recall: ${data.metrics?.macro_recall}`,
    `- Macro F1: ${data.metrics?.macro_f1}`,
    ...explanationSection,
  ].join("\n");
}

function downloadExperimentReport() {
  if (!appState.experimentReport) return;
  const blob = new Blob([appState.experimentReport], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${($("#dataset-name").value || "classification_experiment").replace(/[\\/:*?"<>|]+/g, "_")}_report.md`;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveExperiment() {
  if (!appState.experiment) return;
  const data = appState.experiment;
  const explanation = data.result_explanation || {};
  const hasResultAgentOutput = hasUsableResultExplanation(explanation);
  const experimentRecordBase = {
    dataset_name: $("#dataset-name").value || "当前 CSV 数据",
    task_type: data.task_type,
    model_name: data.model_name,
    selected_model: $("#model-name").value,
    target_column: $("#target-column").value || data.data_summary?.target_column,
    row_count: data.data_summary?.row_count,
    metrics: data.metrics,
    explanation: hasResultAgentOutput ? explanation.summary || explanation.raw_answer || "" : "",
    csv_text: $("#csv-text").value,
    report: appState.experimentReport,
    learner_profile: buildLearnerProfile("experiment"),
    payload: data,
    handoff_context: buildAgentHandoff("code_experiment", "assessment_diagnosis", {
      topic: data.model_name || "实验结果",
      target_view: "archive",
      profile_source: "experiment",
      evidence: JSON.stringify(data.metrics || {}),
      recommended_action: "根据实验指标判断是否需要复习评估指标或重新实验。",
    }),
  };
  const record = {
    ...experimentRecordBase,
    view_snapshot: buildArchiveViewSnapshot("experiment", experimentRecordBase, data),
  };
  await LocalArchive.addRecord("experiment_records", record);
  await recordLearningSignals("experiment", record, data);
  if (hasResultAgentOutput) {
    await LocalArchive.addRecord("agent_outputs", {
      agent_name: "结果解释 Agent",
      input: JSON.stringify(data.metrics),
      output_summary: explanation.summary || explanation.raw_answer || "",
      payload: data,
    });
  }
  $("#save-experiment").disabled = true;
  refreshDashboard();
  renderContextBridge(currentViewName(), { ...currentPageContext(), source: "已保存到档案" });
}

function setupDiagnosis() {
  renderDiagnosisInputState();
  $("#diagnose-error").addEventListener("click", diagnoseError);
  $("#clear-diagnosis-input").addEventListener("click", clearDiagnosisInput);
  $("#copy-fixed-code").addEventListener("click", copyFixedCode);
  $("#download-diagnosis-report").addEventListener("click", downloadDiagnosisReport);
  $("#save-diagnosis").addEventListener("click", saveDiagnosis);
  $$("[data-diagnosis-case]").forEach((button) => {
    button.addEventListener("click", () => fillDiagnosisCase(button.dataset.diagnosisCase));
  });
  $("#diagnosis-output").addEventListener("click", handleDiagnosisAction);
  [
    "#diagnosis-context",
    "#diagnosis-stage",
    "#diagnosis-severity",
    "#expected-behavior",
    "#runtime-env",
    "#error-message",
    "#error-code",
  ].forEach((selector) => {
    $(selector).addEventListener("input", renderDiagnosisInputState);
    $(selector).addEventListener("change", renderDiagnosisInputState);
  });
}

async function diagnoseError() {
  renderDiagnosisInputState();
  try {
    requireInputValue("#error-message", "请先填写报错信息或异常现象。");
  } catch (error) {
    setMessage("#diagnosis-output", error.message);
    return;
  }
  const readiness = diagnosisReadiness();
  if (!readiness.ready) {
    setMessage("#diagnosis-output", `暂不能诊断: ${readiness.warnings.join("；")}`);
    return;
  }
  setMessage("#diagnosis-output", "正在调用错误诊断 Agent，整理根因、修复方案和验证步骤...");
  try {
    const data = await postAgentJson(
      "/api/error_diagnose",
      {
        error_message: $("#error-message").value,
        code: $("#error-code").value,
        context: $("#diagnosis-context").value,
        stage: $("#diagnosis-stage").value,
        severity: $("#diagnosis-severity").value,
        expected_behavior: $("#expected-behavior").value,
        runtime_env: $("#runtime-env").value,
        learner_profile: buildLearnerProfile("diagnose"),
      },
      "error"
    );
    appState.diagnosis = data;
    appState.diagnosisReport = buildDiagnosisReport(data);
    $("#save-diagnosis").disabled = false;
    $("#download-diagnosis-report").disabled = false;
    $("#copy-fixed-code").disabled = !(data.fixed_code || data.minimal_repro_code);
    renderDiagnosis(data);
  } catch (error) {
    setMessage("#diagnosis-output", error.message);
  }
}

function renderDiagnosis(data) {
  if (data.raw_answer) {
    $("#diagnosis-output").innerHTML = renderRawAnswer(data.raw_answer);
    $("#copy-fixed-code").disabled = true;
    return;
  }
  const diagnosisSteps = data.diagnosis_steps || data.debug_steps || data.check_steps;
  const prevention = data.prevention_checklist || data.avoidance_tips;
  const related = asArray(data.related_concepts);
  $("#diagnosis-output").innerHTML = `
    <div class="diagnosis-report-head">
      <div>
        <p class="eyebrow">Diagnosis Report</p>
        <h2>${escapeHtml(data.error_type || "错误诊断")}</h2>
        <p>${escapeHtml(data.summary || data.reason || "")}</p>
      </div>
      <div class="diagnosis-badges">
        <span>${escapeHtml(data.severity || $("#diagnosis-severity").value)}</span>
        <span>置信度 ${escapeHtml(data.confidence || "中")}</span>
      </div>
    </div>

    <div class="diagnosis-result-grid">
      <section class="diagnosis-card">
        <h3>根因判断</h3>
        <p>${escapeHtml(data.root_cause || data.reason || "")}</p>
      </section>
      <section class="diagnosis-card">
        <h3>立即修复</h3>
        <p>${escapeHtml(data.immediate_fix || data.solution || "")}</p>
      </section>
    </div>

    <section class="diagnosis-card fix-card">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Patch</p>
          <h3>修复代码</h3>
        </div>
        <button class="secondary-button" data-diagnosis-action="copy-code">复制</button>
      </div>
      <pre><code id="diagnosis-fixed-code">${escapeHtml(data.fixed_code || data.minimal_repro_code || "# 模型未返回修复代码")}</code></pre>
    </section>

    <div class="diagnosis-result-grid">
      <section class="diagnosis-card">
        <h3>排查步骤</h3>
        <ol class="diagnosis-step-list">${renderDiagnosisSteps(diagnosisSteps)}</ol>
      </section>
      <section class="diagnosis-card">
        <h3>验证方式</h3>
        <ol class="diagnosis-step-list">${renderDiagnosisSteps(data.verification_steps || data.test_steps)}</ol>
      </section>
    </div>

    <section class="diagnosis-card">
      <h3>原理解释</h3>
      <p>${escapeHtml(data.principle || "")}</p>
      ${renderSuggestionList("预防清单", prevention)}
      ${related.length ? `<div class="related-concepts">${related.map((item) => `<button type="button" data-diagnosis-concept="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div>` : ""}
    </section>

    <section class="diagnosis-card">
      <h3>下一步操作</h3>
      <div class="button-row">
        ${renderDiagnosisActionButtons(data.next_actions || data.related_actions)}
      </div>
    </section>
  `;
  $("#diagnosis-output").querySelectorAll("[data-diagnosis-concept]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToView("concept", {
        ...currentPageContext(),
        topic: button.dataset.diagnosisConcept,
      });
    });
  });
}

function diagnosisReadiness() {
  const warnings = [];
  if (!$("#error-message").value.trim()) warnings.push("请填写报错信息或异常现象");
  if (!$("#error-code").value.trim()) warnings.push("请填写相关代码或实验配置");
  if ($("#error-message").value.trim().length < 8) warnings.push("报错信息过短，建议补充完整异常文本");
  return { ready: warnings.length === 0, warnings };
}

function renderDiagnosisInputState() {
  const readiness = diagnosisReadiness();
  const errorText = $("#error-message").value.trim();
  const codeText = $("#error-code").value.trim();
  const cards = [
    { label: "报错长度", value: errorText ? `${errorText.length} 字` : "-", tone: errorText ? "teal" : "danger" },
    { label: "代码行数", value: codeText ? codeText.split(/\r?\n/).length : "-", tone: codeText ? "blue" : "danger" },
    { label: "发生阶段", value: $("#diagnosis-stage").value, tone: "amber" },
    { label: "状态", value: readiness.ready ? "可诊断" : "需补充", tone: readiness.ready ? "teal" : "danger" },
  ];
  $("#diagnosis-overview").innerHTML = cards
    .map((card) => `
      <article class="diagnosis-stat ${card.tone}">
        <span>${escapeHtml(card.label)}</span>
        <strong>${escapeHtml(card.value)}</strong>
      </article>
    `)
    .join("");
  $("#diagnosis-readiness").innerHTML = `
    <p class="readiness-title">${readiness.ready ? "信息已完整" : "诊断前需要补充"}</p>
    <div class="readiness-list">
      ${[
        { ok: Boolean(errorText), text: "已填写报错信息" },
        { ok: Boolean(codeText), text: "已填写相关代码" },
        { ok: errorText.length >= 8, text: "报错信息足够具体" },
      ]
        .map((item) => `<span class="${item.ok ? "ok" : "warn"}">${item.ok ? "✓" : "!"} ${escapeHtml(item.text)}</span>`)
        .join("")}
    </div>
  `;
}

function fillDiagnosisCase(kind) {
  const cases = {
    nan: {
      stage: "模型训练",
      severity: "阻塞运行",
      message: "ValueError: Input X contains NaN. RandomForestClassifier does not accept missing values encoded as NaN natively.",
      code: "X = data.drop('target', axis=1)\ny = data['target']\nmodel.fit(X, y)",
      expected: "模型能够在处理缺失值后正常训练，并输出评估结果。",
    },
    shape: {
      stage: "模型预测",
      severity: "阻塞运行",
      message: "ValueError: Found input variables with inconsistent numbers of samples: [120, 30]",
      code: "X_train, X_test, y_train, y_test = train_test_split(X, y)\nmodel.fit(X_train, y_test)",
      expected: "训练时 X_train 应该对应 y_train，预测和评估时样本数量应保持一致。",
    },
    target: {
      stage: "特征与标签划分",
      severity: "结果异常",
      message: "KeyError: 'target'",
      code: "X = data.drop('target', axis=1)\ny = data['target']",
      expected: "能够正确找到目标列，并完成特征 X 与标签 y 的划分。",
    },
  };
  const item = cases[kind];
  if (!item) return;
  $("#diagnosis-stage").value = item.stage;
  $("#diagnosis-severity").value = item.severity;
  $("#error-message").value = item.message;
  $("#error-code").value = item.code;
  $("#expected-behavior").value = item.expected;
  appState.diagnosis = null;
  appState.diagnosisReport = "";
  $("#save-diagnosis").disabled = true;
  $("#download-diagnosis-report").disabled = true;
  $("#copy-fixed-code").disabled = true;
  $("#diagnosis-output").innerHTML = `
    <div class="diagnosis-empty">
      <p class="eyebrow">Case Loaded</p>
      <h2>示例已填入</h2>
      <p>可以直接调用模型诊断，也可以继续补充环境信息和期望行为。</p>
    </div>
  `;
  renderDiagnosisInputState();
}

function clearDiagnosisInput() {
  $("#error-message").value = "";
  $("#error-code").value = "";
  $("#expected-behavior").value = "";
  appState.diagnosis = null;
  appState.diagnosisReport = "";
  $("#save-diagnosis").disabled = true;
  $("#download-diagnosis-report").disabled = true;
  $("#copy-fixed-code").disabled = true;
  $("#diagnosis-output").innerHTML = `
    <div class="diagnosis-empty">
      <p class="eyebrow">Empty</p>
      <h2>等待输入问题</h2>
      <p>填入报错信息和相关代码后，诊断 Agent 会给出修复路线。</p>
    </div>
  `;
  renderDiagnosisInputState();
}

function renderDiagnosisSteps(items) {
  const list = asArray(items).filter(Boolean);
  if (!list.length) return `<li>模型未返回步骤，可重新诊断并要求补充排查过程。</li>`;
  return list.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderDiagnosisActionButtons(actions) {
  const defaults = [
    { label: "复习相关概念", target_view: "concept" },
    { label: "去代码陪练", target_view: "codeTutor" },
    { label: "保存到档案", target_view: "archive" },
  ];
  const valid = (Array.isArray(actions) && actions.length ? actions : defaults)
    .filter((action) => ["concept", "visualize", "codeTutor", "experiment", "diagnose", "archive"].includes(action.target_view))
    .slice(0, 3);
  return valid
    .map((action, index) => `<button type="button" class="${index === 0 ? "primary-button" : "secondary-button"}" data-diagnosis-target="${escapeHtml(action.target_view)}">${escapeHtml(action.label || viewLabel(action.target_view))}</button>`)
    .join("");
}

function handleDiagnosisAction(event) {
  const copyButton = event.target.closest("[data-diagnosis-action='copy-code']");
  if (copyButton) {
    copyFixedCode();
    return;
  }
  const button = event.target.closest("[data-diagnosis-target]");
  if (!button) return;
  const concepts = asArray(appState.diagnosis?.related_concepts);
  navigateToView(button.dataset.diagnosisTarget, {
    ...currentPageContext(),
    topic: concepts[0] || appState.diagnosis?.error_type || "机器学习错误诊断",
  });
}

async function copyFixedCode() {
  const code = appState.diagnosis?.fixed_code || appState.diagnosis?.minimal_repro_code || $("#diagnosis-fixed-code")?.textContent || "";
  if (!code.trim()) return;
  try {
    await navigator.clipboard.writeText(code);
    $("#copy-fixed-code").textContent = "已复制";
  } catch (error) {
    $("#copy-fixed-code").textContent = "复制失败";
  }
  setTimeout(() => {
    $("#copy-fixed-code").textContent = "复制修复代码";
  }, 1200);
}

function buildDiagnosisReport(data) {
  return [
    `# ${data.error_type || "错误诊断报告"}`,
    "",
    `- 场景: ${$("#diagnosis-context").value}`,
    `- 阶段: ${$("#diagnosis-stage").value}`,
    `- 严重程度: ${data.severity || $("#diagnosis-severity").value}`,
    `- 置信度: ${data.confidence || "中"}`,
    "",
    "## 报错信息",
    $("#error-message").value,
    "",
    "## 根因判断",
    data.root_cause || data.reason || "",
    "",
    "## 修复方案",
    data.immediate_fix || data.solution || "",
    "",
    "## 修复代码",
    "```python",
    data.fixed_code || data.minimal_repro_code || "",
    "```",
    "",
    "## 验证步骤",
    ...asArray(data.verification_steps || data.test_steps).map((item) => `- ${item}`),
    "",
    "## 预防清单",
    ...asArray(data.prevention_checklist || data.avoidance_tips).map((item) => `- ${item}`),
  ].join("\n");
}

function downloadDiagnosisReport() {
  if (!appState.diagnosisReport) return;
  const blob = new Blob([appState.diagnosisReport], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(appState.diagnosis?.error_type || "diagnosis_report").replace(/[\\/:*?"<>|]+/g, "_")}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveDiagnosis() {
  if (!appState.diagnosis) return;
  const data = appState.diagnosis;
  const diagnosisRecordBase = {
    error_type: data.error_type || "模型生成诊断",
    error_message: $("#error-message").value,
    error_code: $("#error-code").value,
    stage: $("#diagnosis-stage").value,
    severity: data.severity || $("#diagnosis-severity").value,
    diagnosis: data.root_cause || data.reason || data.raw_answer || "",
    solution: data.immediate_fix || data.solution || "",
    fixed_code: data.fixed_code || "",
    context: $("#diagnosis-context").value,
    expected_behavior: $("#expected-behavior").value,
    runtime_env: $("#runtime-env").value,
    report: appState.diagnosisReport,
    learner_profile: buildLearnerProfile("diagnose"),
    payload: data,
    handoff_context: buildAgentHandoff("assessment_diagnosis", "review_coach", {
      topic: data.error_type || $("#diagnosis-stage").value,
      target_view: "archive",
      profile_source: "diagnose",
      evidence: data.root_cause || data.reason || "",
      recommended_action: "把诊断结果纳入阶段复盘。",
    }),
  };
  const record = {
    ...diagnosisRecordBase,
    view_snapshot: buildArchiveViewSnapshot("diagnose", diagnosisRecordBase, data),
  };
  await LocalArchive.addRecord("error_records", record);
  await recordLearningSignals("diagnosis", record, data);
  await LocalArchive.addRecord("agent_outputs", {
    agent_name: "错误诊断 Agent",
    input: $("#error-message").value,
    output_summary: data.immediate_fix || data.solution || data.raw_answer || "",
    payload: data,
  });
  $("#save-diagnosis").disabled = true;
  refreshDashboard();
  renderContextBridge(currentViewName(), { ...currentPageContext(), source: "已保存到档案" });
}

function setupArchive() {
  $("#export-archive").addEventListener("click", exportArchive);
  $("#import-archive-button").addEventListener("click", () => $("#import-archive-file").click());
  $("#import-archive-file").addEventListener("change", importArchive);
  $("#clear-archive").addEventListener("click", clearArchive);
  $("#archive-search").addEventListener("input", renderArchiveWorkspace);
  $("#archive-type-filter").addEventListener("change", renderArchiveWorkspace);
  $("#archive-sort").addEventListener("change", renderArchiveWorkspace);
  $("#archive-clear-filter").addEventListener("click", () => {
    $("#archive-search").value = "";
    $("#archive-type-filter").value = "all";
    $("#archive-sort").value = "newest";
    renderArchiveWorkspace();
  });
  $("#archive-record-list").addEventListener("click", (event) => {
    const fullButton = event.target.closest("[data-archive-open-full]");
    if (fullButton) {
      event.stopPropagation();
      openArchiveFullRecord(fullButton.dataset.archiveOpenFull);
      return;
    }
    const card = event.target.closest("[data-archive-id]");
    if (card) selectArchiveRecord(card.dataset.archiveId);
  });
  $("#archive-detail").addEventListener("click", (event) => {
    const fullButton = event.target.closest("[data-archive-open-full]");
    if (fullButton) openArchiveFullRecord(fullButton.dataset.archiveOpenFull);
  });
}

function setupHistoryView() {
  $("#history-back-archive").addEventListener("click", () => navigateToView("archive"));
  $("#history-copy-json").addEventListener("click", async () => {
    const record = getSelectedHistoryRecord();
    if (!record) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(record.raw, null, 2));
      $("#history-copy-json").textContent = "已复制";
    } catch (error) {
      $("#history-copy-json").textContent = "复制失败";
    }
    setTimeout(() => {
      $("#history-copy-json").textContent = "复制 JSON";
    }, 1200);
  });
  $("#history-detail-view").addEventListener("click", handleHistoryDetailAction);
}

async function refreshArchive() {
  try {
    const stores = {
      learning_plans: await LocalArchive.getAll("learning_plans"),
      learning_records: await LocalArchive.getAll("learning_records"),
      experiment_records: await LocalArchive.getAll("experiment_records"),
      error_records: await LocalArchive.getAll("error_records"),
      agent_outputs: await LocalArchive.getAll("agent_outputs"),
      weak_points: await LocalArchive.getAll("weak_points"),
      mistake_records: await LocalArchive.getAll("mistake_records"),
      quiz_attempts: await LocalArchive.getAll("quiz_attempts"),
      concept_mastery: await LocalArchive.getAll("concept_mastery"),
      stage_progress: await LocalArchive.getAll("stage_progress"),
      assessment_records: await LocalArchive.getAll("assessment_records"),
      review_records: await LocalArchive.getAll("review_records"),
    };
    appState.archiveRecords = normalizeArchiveRecords(stores);
    if (!appState.archiveRecords.some((record) => record.uid === appState.selectedArchiveRecordId)) {
      appState.selectedArchiveRecordId = appState.archiveRecords[0]?.uid || null;
    }
  } catch (error) {
    appState.archiveRecords = [];
    appState.selectedArchiveRecordId = null;
    showArchiveNotice("本地档案暂时无法读取，请确认浏览器允许 IndexedDB 后刷新页面。", "error");
  }
  renderArchiveWorkspace();
}

const ARCHIVE_TYPES = {
  learning_plans: { label: "学习路线", target: "plan" },
  learning_records: { label: "学习记录", target: "concept" },
  experiment_records: { label: "实验记录", target: "experiment" },
  error_records: { label: "诊断记录", target: "diagnose" },
  agent_outputs: { label: "Agent 输出", target: "archive" },
  weak_points: { label: "薄弱点", target: "concept" },
  mistake_records: { label: "错题/误区", target: "concept" },
  quiz_attempts: { label: "自测题", target: "concept" },
  concept_mastery: { label: "掌握度", target: "concept" },
  stage_progress: { label: "阶段进度", target: "plan" },
  assessment_records: { label: "测评诊断", target: "archive" },
  review_records: { label: "总结复习", target: "archive" },
};

function normalizeArchiveRecords(stores) {
  return Object.entries(stores).flatMap(([store, records]) =>
    records.map((raw, index) => {
      const uid = `${store}:${raw.id ?? index}`;
      const normalized = {
        uid,
        store,
        typeLabel: ARCHIVE_TYPES[store]?.label || store,
        targetView: inferArchiveTarget(store, raw),
        title: archiveRecordTitle(store, raw),
        summary: archiveRecordSummary(store, raw),
        time: raw.time || raw.created_at || raw.last_update || "",
        tags: archiveRecordTags(store, raw),
        raw,
      };
      normalized.searchText = JSON.stringify(normalized, null, 0).toLowerCase();
      normalized.timeValue = Date.parse(normalized.time) || Number(raw.id || 0);
      return normalized;
    })
  );
}

function archiveRecordTitle(store, item) {
  if (store === "learning_plans") return item.learning_goal || item.current_stage || "学习路线";
  if (store === "learning_records") return item.topic || item.category || "学习记录";
  if (store === "experiment_records") return item.dataset_name || `${item.model_name || "模型"} 实验记录`;
  if (store === "error_records") return item.error_type || item.error_message || "错误诊断";
  if (store === "agent_outputs") return item.agent_name || "Agent 输出";
  if (store === "weak_points") return item.concept || "薄弱点";
  if (store === "mistake_records") return item.concept || "错题/误区";
  if (store === "quiz_attempts") return item.concept || item.question || "自测题";
  if (store === "concept_mastery") return item.concept || "掌握度";
  if (store === "stage_progress") return item.active_stage || item.plan_goal || "阶段进度";
  if (store === "assessment_records") return item.diagnosis_summary || "测评诊断";
  if (store === "review_records") return item.review_summary || "总结复习";
  return "档案记录";
}

function archiveRecordSummary(store, item) {
  if (store === "learning_plans") return item.next_step || item.current_stage || item.raw_answer || "阶段化学习路线";
  if (store === "learning_records") return item.summary || item.status || "";
  if (store === "experiment_records") {
    const metrics = item.metrics || {};
    const metricText = metrics.accuracy !== undefined ? `Accuracy ${metrics.accuracy} / F1 ${metrics.macro_f1 ?? "-"}` : "";
    return [metricText, item.explanation].filter(Boolean).join("；");
  }
  if (store === "error_records") return item.solution || item.diagnosis || item.error_message || "";
  if (store === "agent_outputs") return item.output_summary || item.input || "";
  if (store === "weak_points") return item.reason || item.suggested_action || "";
  if (store === "mistake_records") return [item.mistake, item.correction].filter(Boolean).join("；");
  if (store === "quiz_attempts") return [item.question, item.result].filter(Boolean).join("；");
  if (store === "concept_mastery") return `${item.mastery_label || "待评估"}${item.mastery_score !== undefined ? ` · ${Math.round(Number(item.mastery_score) * 100)}%` : ""}`;
  if (store === "stage_progress") return `${item.active_stage || "当前阶段"} · 进度 ${item.progress ?? 0}%`;
  if (store === "assessment_records") return item.diagnosis_summary || asArray(item.weak_points).map((weak) => weak.concept).join("、");
  if (store === "review_records") return item.review_summary || asArray(item.study_plan).join("；");
  return "";
}

function archiveRecordTags(store, item) {
  const tags = [ARCHIVE_TYPES[store]?.label || store];
  if (item.category) tags.push(item.category);
  if (item.status) tags.push(item.status);
  if (item.model_name) tags.push(item.model_name);
  if (item.task_type) tags.push(item.task_type);
  if (item.target_column) tags.push(`目标列: ${item.target_column}`);
  if (item.stage) tags.push(item.stage);
  if (item.severity) tags.push(item.severity);
  if (item.agent_name) tags.push(item.agent_name);
  if (item.source_type) tags.push(item.source_type);
  if (item.mastery_label) tags.push(item.mastery_label);
  if (item.result) tags.push(item.result);
  if (item.agent_role) tags.push(item.agent_role);
  return tags.filter(Boolean).slice(0, 5);
}

function inferArchiveTarget(store, item) {
  if (store === "learning_plans") return "plan";
  if (store === "learning_records") return String(item.category || "").includes("代码陪练") ? "codeTutor" : "concept";
  if (store === "experiment_records") return "experiment";
  if (store === "error_records") return "diagnose";
  if (store === "weak_points") return item.related_view || "concept";
  if (store === "mistake_records") return "concept";
  if (store === "quiz_attempts") return "concept";
  if (store === "concept_mastery") return "concept";
  if (store === "stage_progress") return "plan";
  if (store === "assessment_records") return "archive";
  if (store === "review_records") return "archive";
  if (/代码/.test(item.agent_name || "")) return "codeTutor";
  if (/概念/.test(item.agent_name || "")) return "concept";
  if (/规划/.test(item.agent_name || "")) return "plan";
  if (/结果|实验/.test(item.agent_name || "")) return "experiment";
  if (/错误|诊断/.test(item.agent_name || "")) return "diagnose";
  return "archive";
}

function cloneArchiveData(value) {
  if (value === undefined) return null;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return String(value);
  }
}

function archiveViewRoot(view) {
  return $(`#view-${normalizeTargetView(view)}`);
}

function collectArchiveControlValue(control) {
  if (!control) return "";
  if (control.type === "checkbox") return control.checked;
  if (control.type === "radio") return control.checked ? control.value : null;
  if (control.tagName === "SELECT" && control.multiple) {
    return Array.from(control.selectedOptions).map((option) => option.value);
  }
  return control.value;
}

function collectArchiveFormState(view) {
  const root = archiveViewRoot(view);
  if (!root) return { fields: [], values: {} };
  const fields = Array.from(root.querySelectorAll("input, select, textarea"))
    .map((control, index) => {
      const key = control.id || control.name || `field_${index + 1}`;
      return {
        key,
        id: control.id || "",
        name: control.name || "",
        tag: control.tagName.toLowerCase(),
        type: control.type || control.tagName.toLowerCase(),
        label: control.closest("label")?.textContent?.trim() || "",
        value: collectArchiveControlValue(control),
      };
    })
    .filter((field) => field.value !== null);
  const values = {};
  fields.forEach((field) => {
    values[field.key] = field.value;
  });
  return { fields, values };
}

function collectArchiveRenderedPageContent(view) {
  const root = archiveViewRoot(view);
  if (!root) {
    return {
      view_id: "",
      rendered_text: "",
      rendered_html: "",
      captured_at: new Date().toISOString(),
    };
  }
  return {
    view_id: root.id || "",
    page_title: document.title || "",
    route_hash: window.location.hash || "",
    rendered_text: root.textContent || "",
    rendered_html: root.innerHTML || "",
    captured_at: new Date().toISOString(),
  };
}

function collectArchiveVisibleSections(view) {
  const root = archiveViewRoot(view);
  if (!root) return [];
  const selector = [
    "section",
    "article",
    ".tool-panel",
    ".result-panel",
    ".side-panel",
    ".code-panel",
    ".concept-section",
    ".experiment-card",
    ".diagnosis-card",
    ".archive-field",
  ].join(", ");
  return Array.from(root.querySelectorAll(selector)).map((node, index) => ({
    index: index + 1,
    tag: node.tagName.toLowerCase(),
    id: node.id || "",
    class_name: node.className || "",
    heading: node.querySelector("h1, h2, h3, h4, .eyebrow")?.textContent?.trim() || "",
    text_content: node.textContent || "",
    html_content: node.innerHTML || "",
  }));
}

function createArchiveGeneratedResultMirror(view, record = {}, data = {}) {
  const source = data && typeof data === "object" && Object.keys(data).length ? data : record;
  const mirror = cloneArchiveData(source) || {};
  if (view === "plan") {
    const stages = asArray(source.stage_list || record.stage_list || data.stage_list)
      .filter((stage) => stage && typeof stage === "object" && !Array.isArray(stage));
    mirror.stage_list = stages.map((stage, index) => ({
      ...cloneArchiveData(stage),
      normalized_view: normalizeTargetView(stage.target_view || stage.targetView || inferTargetView(stage)),
      normalized_index: index + 1,
    }));
  }
  return mirror;
}

function buildArchiveViewSnapshot(sourceView, record = {}, payload = {}, options = {}) {
  const view = normalizeTargetView(sourceView);
  const data = payload && typeof payload === "object" ? payload : {};
  const shouldCapturePage = options.capturePage !== false;
  const snapshot = {
    storage_policy: {
      version: "complete_local_snapshot_v3",
      mode: "full_record_payload_form_rendered_page_sections",
      retention: "browser_local_archive",
    },
    source_view: view,
    page_label: viewLabel(view),
    captured_at: new Date().toISOString(),
    title: record.learning_goal || record.topic || record.dataset_name || record.error_type || data.topic || data.step_title || data.learning_goal || "学习档案记录",
    summary: record.summary || record.explanation || record.diagnosis || record.next_step || data.one_sentence || data.step_goal || data.raw_answer || "",
    inputs: {},
    outputs: {},
    artifacts: {},
    full_record: cloneArchiveData(record),
    full_payload: cloneArchiveData(data),
    full_generated_result: createArchiveGeneratedResultMirror(view, record, data),
    form_state: shouldCapturePage ? collectArchiveFormState(view) : { fields: [], values: {} },
    rendered_page: shouldCapturePage ? collectArchiveRenderedPageContent(view) : {
      view_id: `view-${view}`,
      rendered_text: "",
      rendered_html: "",
      captured_at: "",
      note: "legacy_record_without_page_snapshot",
    },
    visible_sections: shouldCapturePage ? collectArchiveVisibleSections(view) : [],
    raw_payload: cloneArchiveData(data),
  };

  if (view === "plan") {
    snapshot.inputs = {
      learning_goal: record.learning_goal || data.learning_goal || "",
      learner_level: record.learner_level || data.learner_level || "",
      preference: record.preference || data.preference || "",
      learning_pace: record.learning_pace || data.learning_pace || "",
      weakness_focus: record.weakness_focus || data.weakness_focus || "",
    };
    snapshot.outputs = {
      current_stage: record.current_stage || data.current_stage || "",
      progress: record.progress ?? data.progress ?? 0,
      next_step: record.next_step || data.next_step || "",
      recommended_project: record.recommended_project || data.recommended_project || "",
    };
    snapshot.artifacts = {
      stage_list: asArray(record.stage_list || data.stage_list),
      factor_summary: record.factor_summary || data.factor_summary || "",
    };
  } else if (view === "concept") {
    snapshot.inputs = {
      topic: record.topic || data.topic || "",
      scenario: record.category || "",
      learner_level: record.learner_level || "",
      learning_goal: record.learning_goal || "",
    };
    snapshot.outputs = {
      one_sentence: data.one_sentence || record.summary || "",
      simple_explanation: data.simple_explanation || data.explanation_layers?.concept || "",
      principle: data.principle || data.technical_definition || data.explanation_layers?.principle || "",
      example: data.mini_example || data.example || data.analogy || "",
      formula_or_rule: record.formula_or_rule || data.formula_or_rule || "",
      code_connection: record.code_connection || data.code_connection || "",
      practice_task: record.practice_task || data.practice_task || "",
    };
    snapshot.artifacts = {
      common_mistakes: asArray(data.common_mistakes),
      quiz: asArray(data.quiz),
      next_topics: asArray(data.next_topics),
    };
  } else if (view === "codeTutor") {
    snapshot.inputs = {
      project: record.project || "",
      model_algorithm: record.model_algorithm || "",
      code_style: record.code_style || "",
      learning_goal: record.learning_goal || "",
      step_index: record.step_index ?? "",
    };
    snapshot.outputs = {
      step_title: data.step_title || record.topic || "",
      step_goal: data.step_goal || record.summary || "",
      why: data.why || "",
      code: record.code || data.code || "",
      expected_output: data.expected_output || data.expected || "",
      try_it_task: data.try_it_task || data.task || "",
      next_step: data.next_step || "",
    };
    snapshot.artifacts = {
      line_explanations: asArray(data.line_explanations || data.explanation),
      key_concepts: asArray(data.key_concepts || data.concepts),
      checklist: asArray(data.checklist),
      common_errors: asArray(data.common_errors || data.errors),
    };
  } else if (view === "experiment") {
    snapshot.inputs = {
      dataset_name: record.dataset_name || "",
      target_column: record.target_column || "",
      selected_model: record.selected_model || record.model_name || "",
      csv_text: record.csv_text || "",
    };
    snapshot.outputs = {
      task_type: record.task_type || data.task_type || "",
      model_name: record.model_name || data.model_name || "",
      row_count: record.row_count || data.data_summary?.row_count || "",
      metrics: record.metrics || data.metrics || {},
      explanation: record.explanation || data.result_explanation?.summary || data.result_explanation?.raw_answer || "",
      report: record.report || "",
    };
    snapshot.artifacts = {
      data_summary: data.data_summary || {},
      column_insights: asArray(data.column_insights),
      predictions: asArray(data.predictions || data.sample_predictions),
    };
  } else if (view === "diagnose") {
    snapshot.inputs = {
      context: record.context || "",
      stage: record.stage || "",
      severity: record.severity || "",
      expected_behavior: record.expected_behavior || "",
      runtime_env: record.runtime_env || "",
      error_message: record.error_message || "",
      error_code: record.error_code || "",
    };
    snapshot.outputs = {
      error_type: record.error_type || data.error_type || "",
      root_cause: record.diagnosis || data.root_cause || data.reason || "",
      solution: record.solution || data.immediate_fix || data.solution || "",
      fixed_code: record.fixed_code || data.fixed_code || data.minimal_repro_code || "",
      report: record.report || "",
    };
    snapshot.artifacts = {
      validation_steps: asArray(data.validation_steps || data.verify_steps),
      prevention_checklist: asArray(data.prevention_checklist || data.prevention),
      related_concepts: asArray(data.related_concepts),
    };
  }
  return snapshot;
}

function renderArchiveWorkspace() {
  renderArchiveStats();
  renderArchiveSummaryList();
  const records = filteredArchiveRecords();
  $("#archive-result-title").textContent = archiveResultTitle();
  $("#archive-result-count").textContent = `${records.length} 条`;
  renderArchiveList(records);
  const selected = records.find((record) => record.uid === appState.selectedArchiveRecordId) || records[0];
  if (selected) {
    appState.selectedArchiveRecordId = selected.uid;
    renderArchiveDetail(selected);
  } else {
    renderArchiveEmptyDetail();
  }
}

function filteredArchiveRecords() {
  const keyword = $("#archive-search").value.trim().toLowerCase();
  const type = $("#archive-type-filter").value;
  const sort = $("#archive-sort").value;
  let records = appState.archiveRecords.filter((record) => {
    const typeMatch = type === "all" || record.store === type;
    const keywordMatch = !keyword || record.searchText.includes(keyword);
    return typeMatch && keywordMatch;
  });
  if (sort === "oldest") records = records.slice().sort((a, b) => a.timeValue - b.timeValue);
  if (sort === "newest") records = records.slice().sort((a, b) => b.timeValue - a.timeValue);
  if (sort === "type") {
    records = records.slice().sort((a, b) => a.typeLabel.localeCompare(b.typeLabel, "zh-Hans-CN") || b.timeValue - a.timeValue);
  }
  return records;
}

function archiveResultTitle() {
  const type = $("#archive-type-filter").value;
  const keyword = $("#archive-search").value.trim();
  const label = type === "all" ? "全部历史记录" : `${ARCHIVE_TYPES[type]?.label || "历史记录"}`;
  return keyword ? `${label}: ${keyword}` : label;
}

function renderArchiveStats() {
  const counts = Object.fromEntries(Object.keys(ARCHIVE_TYPES).map((key) => [key, 0]));
  for (const record of appState.archiveRecords) counts[record.store] += 1;
  const latest = appState.archiveRecords.slice().sort((a, b) => b.timeValue - a.timeValue)[0];
  const cards = [
    { label: "总记录", value: appState.archiveRecords.length, hint: "本地 IndexedDB" },
    { label: "薄弱点", value: counts.weak_points, hint: "需要优先复习" },
    { label: "学习路线", value: counts.learning_plans, hint: "规划 Agent 保存" },
    { label: "最近更新", value: latest?.time || "-", hint: latest?.typeLabel || "暂无记录" },
  ];
  $("#archive-stats").innerHTML = cards
    .map((card) => `
      <article class="archive-stat-card">
        <span>${escapeHtml(card.label)}</span>
        <strong>${escapeHtml(card.value)}</strong>
        <small>${escapeHtml(card.hint)}</small>
      </article>
    `)
    .join("");
}

function renderArchiveSummaryList() {
  const activeType = $("#archive-type-filter").value;
  const counts = Object.entries(ARCHIVE_TYPES).map(([store, meta]) => ({
    store,
    label: meta.label,
    count: appState.archiveRecords.filter((record) => record.store === store).length,
  }));
  $("#archive-summary-list").innerHTML = counts
    .map((item) => `
      <button type="button" class="${item.store === activeType ? "active" : ""}" data-summary-filter="${escapeHtml(item.store)}">
        <span>${escapeHtml(item.label)}</span>
        <strong>${item.count}</strong>
      </button>
    `)
    .join("");
  $("#archive-summary-list").querySelectorAll("[data-summary-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#archive-type-filter").value = button.dataset.summaryFilter;
      renderArchiveWorkspace();
    });
  });
}

function renderArchiveList(records) {
  if (!records.length) {
    $("#archive-record-list").innerHTML = `
      <div class="archive-empty-list">
        <p class="eyebrow">No Records</p>
        <h2>暂无匹配记录</h2>
        <p>可以调整筛选条件，或先在学习规划、概念学习、实验中心等页面保存记录。</p>
      </div>
    `;
    return;
  }
  $("#archive-record-list").innerHTML = `
    <div class="archive-record-list">
      ${records.map(renderArchiveRecordCard).join("")}
    </div>
  `;
}

function renderArchiveRecordCard(record) {
  return `
    <article class="archive-record-card ${record.uid === appState.selectedArchiveRecordId ? "active" : ""}" data-archive-id="${escapeHtml(record.uid)}">
      <div class="archive-record-top">
        <span>${escapeHtml(record.typeLabel)}</span>
        <time>${escapeHtml(record.time || "-")}</time>
      </div>
      <h3>${escapeHtml(record.title)}</h3>
      <p>${escapeHtml(record.summary || "暂无摘要，点开查看完整原始记录。")}</p>
      <div class="archive-tag-row">${record.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="archive-card-actions">
        <button type="button" class="secondary-button archive-open-full-button" data-archive-open-full="${escapeHtml(record.uid)}">查看完整记录</button>
      </div>
    </article>
  `;
}

function selectArchiveRecord(uid) {
  appState.selectedArchiveRecordId = uid;
  renderArchiveWorkspace();
}

function openArchiveFullRecord(uid) {
  const record = appState.archiveRecords.find((item) => item.uid === uid);
  if (!record) return;
  appState.selectedArchiveRecordId = record.uid;
  appState.selectedHistoryRecordId = record.uid;
  navigateToView("history", {
    source: "学习档案",
    topic: record.title,
    title: record.title,
  });
  renderHistoryDetailView();
}

function renderArchiveDetail(record) {
  $("#archive-detail").innerHTML = `
    <div class="archive-detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(record.typeLabel)}</p>
        <h2>${escapeHtml(record.title)}</h2>
        <p>${escapeHtml(record.summary || "")}</p>
      </div>
    </div>
    <div class="archive-tag-row detail">${record.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="archive-detail-meta">
      <div><span>保存时间</span><strong>${escapeHtml(record.time || "-")}</strong></div>
      <div><span>记录编号</span><strong>${escapeHtml(record.raw.id ?? "-")}</strong></div>
      <div><span>来源表</span><strong>${escapeHtml(record.store)}</strong></div>
    </div>
    <section class="archive-detail-section archive-preview-note">
      <h3>快速预览</h3>
      <p class="archive-detail-summary">这里保留摘要、标签和来源信息，完整页面快照、生成结果和原始字段会在历史详情页中展示。</p>
      <div class="archive-preview-actions">
        <button type="button" class="primary-button" data-archive-open-full="${escapeHtml(record.uid)}">查看完整记录</button>
      </div>
    </section>
  `;
}

function renderArchiveEmptyDetail() {
  $("#archive-detail").innerHTML = `
    <div class="archive-empty-detail">
      <p class="eyebrow">Detail</p>
      <h2>暂无记录</h2>
      <p>保存学习路线、概念记录、实验或诊断后，这里会展示可点击的完整历史。</p>
    </div>
  `;
}

function renderArchiveReadableDetail(record) {
  const snapshot = archiveSnapshotForRecord(record);
  const view = snapshot.source_view || record.targetView;
  let readableDetail = "";
  if (view === "plan") readableDetail = renderPlanArchiveDetail(snapshot, record.raw || {});
  else if (view === "concept") readableDetail = renderConceptArchiveDetail(snapshot, record.raw || {});
  else if (view === "codeTutor") readableDetail = renderCodeArchiveDetail(snapshot, record.raw || {});
  else if (view === "experiment") readableDetail = renderExperimentArchiveDetail(snapshot, record.raw || {});
  else if (view === "diagnose") readableDetail = renderDiagnosisArchiveDetail(snapshot, record.raw || {});
  else readableDetail = renderGenericArchiveReadableDetail(snapshot, record.raw || {});
  return `${readableDetail}${renderFullGeneratedResultSnapshot(snapshot)}`;
}

function renderArchiveRawDrawer(record) {
  const raw = record.raw || {};
  const snapshot = archiveSnapshotForRecord(record);
  const renderedPage = snapshot.rendered_page || {};
  return `
    <details class="archive-raw-drawer">
      <summary>
        <span>完整原始数据</span>
        <small>包含完整记录、Agent 输出、表单状态和页面快照</small>
      </summary>
      <div class="archive-raw-grid">
        ${renderArchiveSnapshotBlock("完整记录", snapshot.full_record || raw, "code")}
        ${renderArchiveSnapshotBlock("完整 Agent 输出", snapshot.full_payload || raw.payload || snapshot.raw_payload || {}, "code")}
        ${renderArchiveSnapshotBlock("完整生成结果", snapshot.full_generated_result || {}, "code")}
        ${renderArchiveSnapshotBlock("表单状态", snapshot.form_state || {}, "code")}
        ${renderArchiveSnapshotBlock("页面文本快照", renderedPage.rendered_text || "", "code")}
        ${renderArchiveSnapshotBlock("页面 HTML 快照", renderedPage.rendered_html || "", "code")}
        ${renderArchiveSnapshotBlock("页面分区快照", snapshot.visible_sections || [], "code")}
        ${renderArchiveSnapshotBlock("保存策略", snapshot.storage_policy || {}, "code")}
      </div>
    </details>
  `;
}

function archiveSnapshotForRecord(record) {
  const raw = record.raw || {};
  const payload = raw.payload && typeof raw.payload === "object" ? raw.payload : raw;
  return raw.view_snapshot || buildArchiveViewSnapshot(record.targetView, raw, payload, { capturePage: false });
}

function renderFullGeneratedResultSnapshot(snapshot) {
  const result = snapshot.full_generated_result || snapshot.full_payload || snapshot.raw_payload || {};
  if (!result || (typeof result === "object" && !Object.keys(result).length)) return "";
  if ((snapshot.source_view || "") === "plan" && Array.isArray(result.stage_list)) {
    const overview = { ...result };
    delete overview.stage_list;
    return `
      <section class="archive-generated-result">
        <div class="archive-generated-head">
          <h4>完整生成结果</h4>
          <span>${escapeHtml(result.stage_list.length)} 个阶段</span>
        </div>
        ${renderArchiveSnapshotGrid("路线总览", overview)}
        <div class="archive-generated-stage-list">
          ${result.stage_list.map(renderArchiveGeneratedStage).join("")}
        </div>
      </section>
    `;
  }
  return renderArchiveSnapshotBlock("完整生成结果", result, "code");
}

function renderArchiveGeneratedStage(stage, index) {
  const data = stage && typeof stage === "object" ? stage : { value: stage };
  const steps = asArray(data.learning_steps || data.steps || data.route_steps);
  const criteria = asArray(data.success_criteria || data.criteria || data.acceptance);
  return `
    <article class="archive-generated-stage">
      <div>
        <span>${escapeHtml(data.agent || data.normalized_view || "学习 Agent")}</span>
        <strong>${escapeHtml(data.name || data.topic || `阶段 ${index + 1}`)}</strong>
        <small>${escapeHtml(data.goal || data.primary_topic || "")}</small>
      </div>
      ${steps.length ? renderArchiveSnapshotList("学习步骤", steps) : ""}
      ${data.practice || data.task ? renderArchiveSnapshotBlock("实践任务", data.practice || data.task) : ""}
      ${criteria.length ? renderArchiveSnapshotList("完成标准", criteria) : ""}
      ${renderArchiveSnapshotBlock("阶段完整字段", data, "code")}
    </article>
  `;
}

function renderPlanArchiveDetail(snapshot) {
  const stages = asArray(snapshot.artifacts?.stage_list);
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("规划输入", snapshot.inputs)}
      ${renderArchiveSnapshotGrid("规划结果", snapshot.outputs)}
      ${snapshot.artifacts?.factor_summary ? renderArchiveSnapshotBlock("规划依据", snapshot.artifacts.factor_summary) : ""}
      <section class="archive-snapshot-section">
        <h4>学习阶段</h4>
        <ol class="archive-stage-mini-list">
          ${stages.length ? stages.map((stage, index) => `
            <li>
              <strong>${escapeHtml(stage.name || `阶段 ${index + 1}`)}</strong>
              <span>${escapeHtml(stage.goal || stage.task || "")}</span>
              <small>${escapeHtml(stage.practice || stage.next_step || "")}</small>
            </li>
          `).join("") : "<li><span>这条路线没有保存阶段列表。</span></li>"}
        </ol>
      </section>
    </div>
  `;
}

function renderConceptArchiveDetail(snapshot) {
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("学习输入", snapshot.inputs)}
      <div class="archive-readable-grid">
        ${renderArchiveSnapshotBlock("一句话解释", snapshot.outputs?.one_sentence)}
        ${renderArchiveSnapshotBlock("概念讲解", snapshot.outputs?.simple_explanation)}
        ${renderArchiveSnapshotBlock("原理/定义", snapshot.outputs?.principle)}
        ${renderArchiveSnapshotBlock("例子/类比", snapshot.outputs?.example)}
      </div>
      ${renderArchiveSnapshotBlock("公式或规则", snapshot.outputs?.formula_or_rule, "code")}
      ${renderArchiveSnapshotBlock("代码联系", snapshot.outputs?.code_connection, "code")}
      ${renderArchiveSnapshotBlock("练习任务", snapshot.outputs?.practice_task)}
      ${renderArchiveSnapshotList("常见误区", snapshot.artifacts?.common_mistakes)}
      ${renderArchiveQuizList(snapshot.artifacts?.quiz)}
      ${renderArchiveSnapshotList("下一步主题", snapshot.artifacts?.next_topics)}
    </div>
  `;
}

function renderCodeArchiveDetail(snapshot) {
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("代码输入", snapshot.inputs)}
      <div class="archive-readable-grid">
        ${renderArchiveSnapshotBlock("步骤目标", snapshot.outputs?.step_goal)}
        ${renderArchiveSnapshotBlock("为什么这样写", snapshot.outputs?.why)}
        ${renderArchiveSnapshotBlock("运行预期", snapshot.outputs?.expected_output)}
        ${renderArchiveSnapshotBlock("动手练习", snapshot.outputs?.try_it_task)}
      </div>
      ${renderArchiveSnapshotBlock("代码", snapshot.outputs?.code, "code")}
      ${renderArchiveSnapshotList("逐行解释", snapshot.artifacts?.line_explanations)}
      ${renderArchiveSnapshotList("关键概念", snapshot.artifacts?.key_concepts)}
      ${renderArchiveSnapshotList("运行检查", snapshot.artifacts?.checklist)}
      ${renderArchiveSnapshotList("常见错误", snapshot.artifacts?.common_errors)}
      ${renderArchiveSnapshotBlock("下一步", snapshot.outputs?.next_step)}
    </div>
  `;
}

function renderExperimentArchiveDetail(snapshot) {
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("实验输入", {
        dataset_name: snapshot.inputs?.dataset_name,
        target_column: snapshot.inputs?.target_column,
        selected_model: snapshot.inputs?.selected_model,
      })}
      ${renderArchiveSnapshotGrid("实验指标", snapshot.outputs?.metrics || {})}
      <div class="archive-readable-grid">
        ${renderArchiveSnapshotBlock("任务类型", snapshot.outputs?.task_type)}
        ${renderArchiveSnapshotBlock("模型", snapshot.outputs?.model_name)}
        ${renderArchiveSnapshotBlock("样本数", snapshot.outputs?.row_count)}
        ${renderArchiveSnapshotBlock("结果解释", snapshot.outputs?.explanation)}
      </div>
      ${renderArchiveSnapshotBlock("实验报告", snapshot.outputs?.report, "code")}
      ${renderArchiveSnapshotBlock("CSV 数据", snapshot.inputs?.csv_text, "code")}
      ${renderArchiveSnapshotGrid("数据摘要", snapshot.artifacts?.data_summary || {})}
      ${renderArchiveSnapshotList("样本预测", snapshot.artifacts?.predictions)}
    </div>
  `;
}

function renderDiagnosisArchiveDetail(snapshot) {
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("诊断输入", snapshot.inputs)}
      <div class="archive-readable-grid">
        ${renderArchiveSnapshotBlock("错误类型", snapshot.outputs?.error_type)}
        ${renderArchiveSnapshotBlock("根因分析", snapshot.outputs?.root_cause)}
        ${renderArchiveSnapshotBlock("修复方案", snapshot.outputs?.solution)}
      </div>
      ${renderArchiveSnapshotBlock("相关代码", snapshot.inputs?.error_code, "code")}
      ${renderArchiveSnapshotBlock("修复代码", snapshot.outputs?.fixed_code, "code")}
      ${renderArchiveSnapshotList("验证步骤", snapshot.artifacts?.validation_steps)}
      ${renderArchiveSnapshotList("预防清单", snapshot.artifacts?.prevention_checklist)}
      ${renderArchiveSnapshotList("相关知识点", snapshot.artifacts?.related_concepts)}
      ${renderArchiveSnapshotBlock("诊断报告", snapshot.outputs?.report, "code")}
    </div>
  `;
}

function renderGenericArchiveReadableDetail(snapshot, raw) {
  return `
    <div class="archive-readable-detail">
      ${renderArchiveSnapshotGrid("输入", snapshot.inputs || {})}
      ${renderArchiveSnapshotGrid("输出", snapshot.outputs || {})}
      ${renderArchiveSnapshotGrid("产物", snapshot.artifacts || {})}
      <section class="archive-snapshot-section">
        <h4>原始字段</h4>
        ${renderHistoryKeyValueList(raw)}
      </section>
    </div>
  `;
}

function renderArchiveSnapshotGrid(title, data) {
  const entries = Object.entries(data || {}).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return "";
  return `
    <section class="archive-snapshot-section">
      <h4>${escapeHtml(title)}</h4>
      <div class="archive-snapshot-grid">
        ${entries.map(([key, value]) => `
          <div>
            <span>${escapeHtml(archiveFieldLabel(key))}</span>
            <strong>${escapeHtml(formatArchiveSnapshotValue(value))}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderArchiveSnapshotBlock(title, value, mode = "text") {
  if (value === undefined || value === null || value === "") return "";
  const text = formatArchiveSnapshotValue(value);
  return `
    <section class="archive-snapshot-section">
      <h4>${escapeHtml(title)}</h4>
      ${mode === "code"
        ? `<pre><code>${escapeHtml(text)}</code></pre>`
        : `<p>${escapeHtml(text)}</p>`}
    </section>
  `;
}

function renderArchiveSnapshotList(title, items) {
  const list = asArray(items).filter(Boolean);
  if (!list.length) return "";
  return `
    <section class="archive-snapshot-section">
      <h4>${escapeHtml(title)}</h4>
      <ul class="archive-snapshot-list">
        ${list.map((item) => `<li>${escapeHtml(formatArchiveSnapshotValue(item))}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderArchiveQuizList(items) {
  const quiz = asArray(items).filter(Boolean);
  if (!quiz.length) return "";
  return `
    <section class="archive-snapshot-section">
      <h4>自测题</h4>
      <div class="archive-readable-grid">
        ${quiz.map((item, index) => `
          <article class="archive-snapshot-card">
            <strong>${escapeHtml(item.question || `题目 ${index + 1}`)}</strong>
            <p>${escapeHtml(item.answer || item.expected_answer || item.explanation || "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function formatArchiveSnapshotValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(formatArchiveSnapshotValue).filter(Boolean).join("；");
  if (typeof value === "object") {
    if (value.line || value.explanation) return [value.line, value.explanation].filter(Boolean).join(": ");
    if (value.question || value.answer) return [value.question, value.answer].filter(Boolean).join(" 答: ");
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function renderArchiveFields(raw) {
  return Object.entries(raw)
    .map(([key, value]) => `
      <article class="archive-field">
        <strong>${escapeHtml(archiveFieldLabel(key))}</strong>
        ${renderArchiveValue(value)}
      </article>
    `)
    .join("");
}

function archiveFieldLabel(key) {
  const labels = {
    learning_goal: "学习目标",
    current_stage: "当前阶段",
    next_step: "下一步",
    topic: "主题",
    category: "分类",
    status: "状态",
    summary: "摘要",
    learner_level: "学习者水平",
    learning_goal: "学习目标",
    formula_or_rule: "公式或规则",
    code_connection: "代码联系",
    practice_task: "练习任务",
    project: "项目案例",
    model_algorithm: "模型算法",
    selected_model: "所选模型",
    code_style: "代码风格",
    step_index: "步骤序号",
    code: "代码",
    dataset_name: "数据集",
    model_name: "模型",
    task_type: "任务类型",
    target_column: "目标列",
    row_count: "样本数",
    metrics: "指标",
    explanation: "解释",
    error_type: "错误类型",
    error_message: "报错信息",
    error_code: "相关代码",
    diagnosis: "诊断",
    solution: "解决方案",
    fixed_code: "修复代码",
    context: "上下文",
    expected_behavior: "期望行为",
    runtime_env: "运行环境",
    report: "报告",
    payload: "完整历史内容",
    view_snapshot: "页面历史快照",
    source_view: "来源页面",
    page_label: "页面",
    learner_profile: "学习者画像",
    learning_pace: "学习节奏",
    weakness_focus: "当前短板",
    factor_summary: "规划依据",
    stage_list: "学习阶段",
    stage: "发生阶段",
    scenario: "场景",
    one_sentence: "一句话解释",
    simple_explanation: "概念讲解",
    principle: "原理",
    example: "例子",
    expected_output: "运行预期",
    try_it_task: "动手练习",
    root_cause: "根因分析",
    validation_steps: "验证步骤",
    prevention_checklist: "预防清单",
    related_concepts: "相关知识点",
    agent_name: "Agent",
    input: "输入",
    output_summary: "输出摘要",
    agent_role: "Agent 职责",
    diagnosis_summary: "诊断摘要",
    weak_points: "薄弱点",
    mastery_overview: "掌握概览",
    recommended_actions: "推荐动作",
    review_summary: "复习摘要",
    completed_highlights: "完成亮点",
    weak_points_to_review: "待复习薄弱点",
    study_plan: "复习计划",
    next_actions: "下一步动作",
    handoff_context: "Agent 交接上下文",
    time: "保存时间",
  };
  return labels[key] || key;
}

function renderArchiveValue(value) {
  if (value === null || value === undefined || value === "") return `<p class="empty-note">-</p>`;
  if (typeof value === "object") {
    return `<pre><code>${escapeHtml(JSON.stringify(value, null, 2))}</code></pre>`;
  }
  const text = String(value);
  if (text.includes("\n") || text.length > 160) return `<pre><code>${escapeHtml(text)}</code></pre>`;
  return `<p>${escapeHtml(text)}</p>`;
}

function getSelectedHistoryRecord() {
  return appState.archiveRecords.find((item) => item.uid === appState.selectedHistoryRecordId)
    || appState.archiveRecords.find((item) => item.uid === appState.selectedArchiveRecordId)
    || null;
}

function renderHistoryDetailView() {
  const record = getSelectedHistoryRecord();
  if (!record) {
    $("#history-detail-view").innerHTML = `
      <div class="archive-empty-detail">
        <p class="eyebrow">No Snapshot</p>
        <h2>还没有选择历史记录</h2>
        <p>请先回到学习档案，选择一条本地保存的历史记录。</p>
      </div>
    `;
    return;
  }
  const raw = record.raw || {};
  const payload = raw.payload && typeof raw.payload === "object" ? raw.payload : null;
  $("#history-detail-view").innerHTML = `
    <section class="history-hero-panel">
      <div>
        <p class="eyebrow">${escapeHtml(record.typeLabel)}</p>
        <h2>${escapeHtml(record.title)}</h2>
        <p>${escapeHtml(record.summary || "这是一条保存在用户本地的历史快照。")}</p>
      </div>
      <div class="history-hero-actions">
        <button class="primary-button" data-history-action="restore" data-target-view="${escapeHtml(record.targetView)}">恢复到相关页面</button>
        <button class="secondary-button" data-history-action="archive">返回档案列表</button>
      </div>
    </section>
    <section class="history-meta-grid">
      <div><span>保存时间</span><strong>${escapeHtml(record.time || "-")}</strong></div>
      <div><span>记录类型</span><strong>${escapeHtml(record.typeLabel)}</strong></div>
      <div><span>本地编号</span><strong>${escapeHtml(raw.id ?? "-")}</strong></div>
      <div><span>目标页面</span><strong>${escapeHtml(viewLabel(record.targetView))}</strong></div>
    </section>
    <section class="history-content-grid">
      <article class="history-readable-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Snapshot</p>
            <h2>历史内容</h2>
          </div>
          <span>本地快照</span>
        </div>
        ${renderHistoryReadableContent(record, payload)}
      </article>
      <aside class="history-side-panel">
        <section>
          <h3>标签</h3>
          <div class="archive-tag-row detail">${record.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </section>
        <section>
          <h3>原始字段</h3>
          ${renderHistoryKeyValueList(raw)}
        </section>
      </aside>
    </section>
    <section class="history-raw-panel">
      <details>
        <summary>查看完整原始 JSON</summary>
        <pre><code>${escapeHtml(JSON.stringify(raw, null, 2))}</code></pre>
      </details>
    </section>
  `;
}

function renderHistoryReadableContent(record, payload) {
  const raw = record.raw || {};
  if (raw.view_snapshot) {
    return `${renderArchiveReadableDetail(record)}${renderArchiveRawDrawer(record)}`;
  }
  if (record.store === "learning_plans") {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>学习目标</h3>
        <p>${escapeHtml(data.learning_goal || record.title)}</p>
      </div>
      <div class="history-section">
        <h3>阶段与下一步</h3>
        <p>${escapeHtml(data.current_stage || data.next_step || record.summary || "")}</p>
        ${renderList(data.stages || data.plan || data.weekly_plan || [])}
      </div>
    `;
  }
  if (record.store === "learning_records" && String(raw.category || "").includes("代码陪练")) {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>${escapeHtml(data.step_title || raw.topic || "代码陪练记录")}</h3>
        <p>${escapeHtml(data.step_goal || raw.summary || "")}</p>
      </div>
      <div class="history-section code-linked">
        <h3>历史代码</h3>
        <pre><code>${escapeHtml(data.code || raw.code || "# 这条旧记录没有保存代码正文")}</code></pre>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("为什么这样写", data.why || raw.summary)}
        ${renderHistoryMiniBlock("运行预期", data.expected_output)}
      </div>
    `;
  }
  if (record.store === "learning_records") {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>${escapeHtml(data.topic || raw.topic || "概念学习记录")}</h3>
        <p>${escapeHtml(data.one_sentence || data.simple_explanation || raw.summary || "")}</p>
      </div>
      ${renderFormulaBlock("公式 / 判断规则", data.formula_or_rule || raw.formula_or_rule, "这是保存当时的公式或规则快照。")}
      <div class="history-two-column">
        ${renderHistoryMiniBlock("通俗解释", data.simple_explanation || raw.summary)}
        ${renderHistoryMiniBlock("技术定义", data.technical_definition)}
      </div>
      ${data.code_connection || raw.code_connection ? `<div class="history-section code-linked"><h3>代码联系</h3><pre><code>${escapeHtml(data.code_connection || raw.code_connection)}</code></pre></div>` : ""}
    `;
  }
  if (record.store === "experiment_records") {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.dataset_name || record.title)}</h3>
        <p>${escapeHtml(raw.explanation || data.result_explanation?.summary || "")}</p>
      </div>
      <div class="history-metric-grid">
        ${Object.entries(raw.metrics || data.metrics || {}).map(([key, value]) => `<div><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("") || "<p class=\"empty-note\">没有保存指标。</p>"}
      </div>
      ${raw.report ? `<div class="history-section"><h3>历史报告</h3><pre><code>${escapeHtml(raw.report)}</code></pre></div>` : ""}
    `;
  }
  if (record.store === "error_records") {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.error_type || data.error_type || "错误诊断记录")}</h3>
        <p>${escapeHtml(raw.error_message || "")}</p>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("诊断", raw.diagnosis || data.root_cause || data.reason)}
        ${renderHistoryMiniBlock("解决方案", raw.solution || data.immediate_fix || data.solution)}
      </div>
      ${raw.fixed_code || data.fixed_code ? `<div class="history-section code-linked"><h3>修复代码</h3><pre><code>${escapeHtml(raw.fixed_code || data.fixed_code)}</code></pre></div>` : ""}
    `;
  }
  if (record.store === "agent_outputs") {
    const data = payload || raw;
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.agent_name || "Agent 输出")}</h3>
        <p>${escapeHtml(raw.output_summary || raw.input || "")}</p>
      </div>
      ${payload ? renderArchiveFields(data) : renderArchiveFields(raw)}
    `;
  }
  if (record.store === "weak_points") {
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.concept || "薄弱点")}</h3>
        <p>${escapeHtml(raw.reason || "")}</p>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("建议动作", raw.suggested_action)}
        ${renderHistoryMiniBlock("复习时间", raw.next_review_at)}
      </div>
    `;
  }
  if (record.store === "mistake_records") {
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.concept || "错题/误区")}</h3>
        <p>${escapeHtml(raw.mistake || "")}</p>
      </div>
      ${renderHistoryMiniBlock("纠正方式", raw.correction)}
    `;
  }
  if (record.store === "quiz_attempts") {
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.concept || "自测题")}</h3>
        <p>${escapeHtml(raw.question || "")}</p>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("我的答案", raw.user_answer)}
        ${renderHistoryMiniBlock("参考答案", raw.expected_answer)}
      </div>
      ${renderHistoryMiniBlock("练习结果", raw.result)}
    `;
  }
  if (record.store === "concept_mastery") {
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.concept || "掌握度")}</h3>
        <p>${escapeHtml(raw.mastery_label || "")} · ${escapeHtml(Math.round(Number(raw.mastery_score || 0) * 100))}%</p>
      </div>
      ${renderHistoryMiniBlock("证据", raw.evidence)}
    `;
  }
  if (record.store === "assessment_records") {
    return `
      <div class="history-section">
        <h3>测评诊断</h3>
        <p>${escapeHtml(raw.diagnosis_summary || "")}</p>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("优先薄弱点", asArray(raw.weak_points).map((item) => item.concept).filter(Boolean).join("、"))}
        ${renderHistoryMiniBlock("推荐动作", asArray(raw.recommended_actions).map((item) => item.label).filter(Boolean).join("、"))}
      </div>
      ${renderList(asArray(raw.weak_points).map((item) => `${item.severity || "中"}: ${item.concept || "薄弱点"} - ${item.suggested_action || item.reason || ""}`))}
    `;
  }
  if (record.store === "review_records") {
    return `
      <div class="history-section">
        <h3>总结复习</h3>
        <p>${escapeHtml(raw.review_summary || "")}</p>
      </div>
      <div class="history-two-column">
        ${renderHistoryMiniBlock("完成亮点", asArray(raw.completed_highlights).join(" "))}
        ${renderHistoryMiniBlock("待复习", asArray(raw.weak_points_to_review).map((item) => item.concept).filter(Boolean).join("、"))}
      </div>
      ${renderList(asArray(raw.study_plan))}
    `;
  }
  if (record.store === "stage_progress") {
    return `
      <div class="history-section">
        <h3>${escapeHtml(raw.active_stage || raw.plan_goal || "阶段进度")}</h3>
        <p>当前进度 ${escapeHtml(raw.progress ?? 0)}%</p>
      </div>
      ${renderList(asArray(raw.stage_progress).map((item) => `${item.completed ? "已完成" : "未完成"}: ${item.name}`))}
    `;
  }
  return renderArchiveFields(raw);
}

function renderHistoryMiniBlock(title, body) {
  return `
    <section class="history-mini-block">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body || "这条历史记录没有保存该字段。")}</p>
    </section>
  `;
}

function renderHistoryKeyValueList(raw) {
  const items = Object.entries(raw || {})
    .filter(([key]) => !["payload", "csv_text", "report"].includes(key))
    .slice(0, 10);
  if (!items.length) return `<p class="empty-note">暂无字段。</p>`;
  return `
    <dl class="history-kv-list">
      ${items.map(([key, value]) => `
        <div>
          <dt>${escapeHtml(archiveFieldLabel(key))}</dt>
          <dd>${escapeHtml(typeof value === "object" ? JSON.stringify(value) : String(value || "-")).slice(0, 140)}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function handleHistoryDetailAction(event) {
  const button = event.target.closest("[data-history-action]");
  if (!button) return;
  const record = getSelectedHistoryRecord();
  if (!record) return;
  if (button.dataset.historyAction === "archive") {
    navigateToView("archive");
    return;
  }
  if (button.dataset.historyAction === "restore") {
    const targetView = button.dataset.targetView || record.targetView;
    navigateToView(targetView, {
      source: "历史记录详情",
      topic: record.title,
      title: record.title,
      raw: record.raw,
      archiveType: record.store,
    });
    prepareArchiveTarget(record, targetView);
  }
}

function prepareArchiveTarget(record, targetView = record.targetView) {
  const raw = record.raw || {};
  const payload = raw.payload && typeof raw.payload === "object" ? raw.payload : null;
  const snapshot = raw.view_snapshot || {};
  const snapshotInputs = snapshot.inputs || {};
  if (targetView === "plan") {
    const data = payload || raw;
    appState.plan = data;
    renderPlan(data);
    $("#save-plan").disabled = true;
  }
  if (targetView === "concept") {
    const data = payload || (raw.topic ? {
      topic: raw.topic,
      one_sentence: raw.summary,
      simple_explanation: raw.summary,
      formula_or_rule: raw.formula_or_rule,
      code_connection: raw.code_connection,
      practice_task: raw.practice_task,
    } : null);
    $("#concept-topic").value = snapshotInputs.topic || raw.topic || data?.topic || record.title || "";
    $("#concept-scenario").value = snapshotInputs.scenario || raw.category || $("#concept-scenario").value;
    if (snapshotInputs.learner_level || raw.learner_level) $("#concept-level").value = snapshotInputs.learner_level || raw.learner_level;
    if (snapshotInputs.learning_goal || raw.learning_goal) $("#concept-learning-goal").value = snapshotInputs.learning_goal || raw.learning_goal;
    syncConceptSelect();
    if (data) {
      appState.concept = data;
      renderConcept(data);
      $("#save-concept").disabled = true;
    }
  }
  if (targetView === "diagnose") {
    const data = payload || null;
    $("#diagnosis-context").value = snapshotInputs.context || raw.context || $("#diagnosis-context").value;
    $("#diagnosis-stage").value = snapshotInputs.stage || raw.stage || $("#diagnosis-stage").value;
    $("#diagnosis-severity").value = snapshotInputs.severity || raw.severity || $("#diagnosis-severity").value;
    $("#expected-behavior").value = snapshotInputs.expected_behavior || raw.expected_behavior || $("#expected-behavior").value;
    $("#runtime-env").value = snapshotInputs.runtime_env || raw.runtime_env || $("#runtime-env").value;
    $("#error-message").value = snapshotInputs.error_message || raw.error_message || record.title || "";
    $("#error-code").value = snapshotInputs.error_code || raw.error_code || raw.fixed_code || data?.minimal_repro_code || "";
    renderDiagnosisInputState();
    if (data) {
      appState.diagnosis = data;
      appState.diagnosisReport = raw.report || buildDiagnosisReport(data);
      renderDiagnosis(data);
      $("#save-diagnosis").disabled = true;
      $("#download-diagnosis-report").disabled = false;
      $("#copy-fixed-code").disabled = !(data.fixed_code || data.minimal_repro_code || raw.fixed_code);
    }
  }
  if (targetView === "codeTutor") {
    const data = payload || null;
    $("#code-learning-goal").value = snapshotInputs.learning_goal || raw.learning_goal || data?.step_goal || raw.summary || record.title || "复现档案中的代码步骤";
    const archivedProject = snapshotInputs.project || raw.project;
    const archivedModel = snapshotInputs.model_algorithm || raw.model_algorithm;
    const archivedStyle = snapshotInputs.code_style || raw.code_style;
    if (archivedProject && Array.from($("#code-project").options).some((option) => option.value === archivedProject)) $("#code-project").value = archivedProject;
    if (archivedModel && $("#code-model")) $("#code-model").value = archivedModel;
    if (archivedStyle && $("#code-style")) $("#code-style").value = archivedStyle;
    const restoredStep = Number(raw.step_index);
    selectCodeStep(Number.isFinite(restoredStep) && restoredStep >= 0 ? restoredStep : inferCodeStepIndex(record.title));
    if (data) {
      appState.codeTutor = data;
      renderCodeTutorStep(data);
      $("#save-code-note").disabled = true;
      $("#download-code-file").disabled = !(data.code || "").trim();
    } else if (raw.code) {
      $("#code-block").textContent = raw.code;
      $("#download-code-file").disabled = false;
    }
  }
  if (targetView === "experiment") {
    const data = payload || null;
    $("#dataset-name").value = snapshotInputs.dataset_name || raw.dataset_name || record.title || "历史实验数据";
    if (snapshotInputs.csv_text || raw.csv_text) $("#csv-text").value = snapshotInputs.csv_text || raw.csv_text;
    if (snapshotInputs.target_column || raw.target_column) $("#target-column").value = snapshotInputs.target_column || raw.target_column;
    if ((snapshotInputs.selected_model || raw.selected_model) && $("#model-name")) $("#model-name").value = snapshotInputs.selected_model || raw.selected_model;
    renderCsvPreview();
    if (data) {
      appState.experiment = data;
      appState.experimentReport = raw.report || buildExperimentReport(data);
      renderExperiment(data);
      $("#save-experiment").disabled = true;
      $("#download-experiment-report").disabled = false;
    }
  }
}

async function exportArchive() {
  const data = await LocalArchive.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ml_tutor_archive.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importArchive(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      await LocalArchive.importAll(JSON.parse(reader.result));
      await refreshArchive();
      refreshDashboard();
      showArchiveNotice("档案已导入，本地历史记录已更新。");
    } catch (error) {
      showArchiveNotice(error.message || "导入失败，请检查 JSON 文件格式。", "error");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

async function clearArchive() {
  if (!confirm("确认清空浏览器本地学习档案？")) return;
  await LocalArchive.clearAll();
  await refreshArchive();
  refreshDashboard();
  showArchiveNotice("本地学习档案已清空。");
}

function showArchiveNotice(message, kind = "ok") {
  const notice = $("#archive-notice");
  if (!notice) return;
  notice.hidden = false;
  notice.textContent = message;
  notice.className = `archive-notice ${kind === "error" ? "error" : ""}`;
}

async function refreshDashboard() {
  const current = LocalArchive.getCurrentState();
  const settings = loadLLMSettings();
  const activeConfig = settings.use_unified ? settings.shared : settings.agents.planner;
  const isConfigured = Boolean(activeConfig.base_url && activeConfig.model);
  const progress = clampProgress(current.progress);
  const nextStep = getDashboardNextStep(current, isConfigured, progress);

  $("#dash-goal").textContent = current.current_goal || "尚未生成学习路线";
  $("#dash-stage").textContent = current.current_stage || "待开始";
  $("#dash-llm-status").textContent = isConfigured ? activeConfig.model : "未配置";
  $("#dash-api-detail").textContent = isConfigured
    ? `${activeConfig.base_url || "已保存接口地址"}`
    : "进入 API 设置后填写接口地址与模型名称。";
  $("#dash-progress-text").textContent = `${progress}%`;
  $("#dash-progress-bar").style.width = `${progress}%`;
  $("#dash-next-title").textContent = nextStep.title;
  $("#dash-next-desc").textContent = nextStep.desc;
  $("#dash-next-action").textContent = nextStep.action;
  $("#dash-next-action").dataset.viewShortcut = nextStep.view;

  try {
    const [plans, learning, experiments, errors, outputs, weakPoints, mastery, assessmentRecords, reviewRecords] = await Promise.all([
      LocalArchive.getAll("learning_plans"),
      LocalArchive.getAll("learning_records"),
      LocalArchive.getAll("experiment_records"),
      LocalArchive.getAll("error_records"),
      LocalArchive.getAll("agent_outputs"),
      LocalArchive.getAll("weak_points"),
      LocalArchive.getAll("concept_mastery"),
      LocalArchive.getAll("assessment_records"),
      LocalArchive.getAll("review_records"),
    ]);
    appState.weakPoints = weakPoints;
    appState.masteryRecords = mastery;
    const reviewSummary = reviewRecords[0] || createLocalReviewSummary({
      learning_plans: plans,
      learning_records: learning,
      experiment_records: experiments,
      error_records: errors,
      weak_points: weakPoints,
      concept_mastery: mastery,
    }, buildLearnerProfile("review"));
    appState.reviewSummary = reviewSummary;
    appState.assessmentSummary = assessmentRecords[0] || createLocalAssessmentDiagnosis({
      concept_mastery: mastery,
      weak_points: weakPoints,
      experiment_records: experiments,
      error_records: errors,
    }, buildLearnerProfile("assessment"));
    const allRecords = [...plans, ...learning, ...experiments, ...errors, ...outputs, ...weakPoints, ...mastery, ...assessmentRecords, ...reviewRecords];
    const latest = allRecords
      .filter((record) => record.time)
      .sort((a, b) => (Date.parse(b.time) || 0) - (Date.parse(a.time) || 0))[0];
    $("#dash-archive-count").textContent = `${allRecords.length} 条`;
    $("#dash-plan-count").textContent = `${plans.length} 条`;
    $("#dash-practice-count").textContent = `${experiments.length + errors.length} 条`;
    if ($("#dash-assessment-count")) $("#dash-assessment-count").textContent = `${assessmentRecords.length} 条`;
    if ($("#dash-review-count")) $("#dash-review-count").textContent = `${reviewRecords.length} 条`;
    if ($("#dash-weak-count")) $("#dash-weak-count").textContent = `${weakPoints.length} 条`;
    if ($("#dash-mastery-count")) $("#dash-mastery-count").textContent = `${mastery.length} 条`;
    if ($("#dash-weak-summary")) {
      const topWeak = uniqueStrings(weakPoints.map((item) => item.concept).filter(Boolean)).slice(0, 2).join("、");
      $("#dash-weak-summary").textContent = topWeak
        ? `建议优先复习: ${topWeak}。`
        : "保存概念、实验或诊断后，这里会显示需要复习的主题。";
    }
    $("#dash-last-update").textContent = latest?.time || current.last_update || "暂无记录";
    $("#dash-activity").textContent = allRecords.length
      ? `已沉淀 ${plans.length} 条路线、${learning.length} 条学习记录、${experiments.length + errors.length} 条实践复盘。`
      : "生成路线、保存概念、实验或诊断后，这里会同步更新。";
    if ($("#dash-review-summary")) {
      $("#dash-review-summary").textContent = reviewSummary.review_summary || "总结复习 Agent 会根据学习档案生成下一步复习建议。";
    }
  } catch (error) {
    $("#dash-archive-count").textContent = "-";
    $("#dash-plan-count").textContent = "-";
    $("#dash-practice-count").textContent = "-";
    if ($("#dash-assessment-count")) $("#dash-assessment-count").textContent = "-";
    if ($("#dash-review-count")) $("#dash-review-count").textContent = "-";
    if ($("#dash-weak-count")) $("#dash-weak-count").textContent = "-";
    if ($("#dash-mastery-count")) $("#dash-mastery-count").textContent = "-";
    if ($("#dash-weak-summary")) $("#dash-weak-summary").textContent = "本地学习画像暂时无法读取。";
    if ($("#dash-review-summary")) $("#dash-review-summary").textContent = "总结复习 Agent 暂时无法读取本地档案。";
    $("#dash-last-update").textContent = "读取失败";
    $("#dash-activity").textContent = "本地档案暂时无法读取，请刷新页面后重试。";
  }
}

function clampProgress(value) {
  const progress = Number(value || 0);
  return Math.min(100, Math.max(0, Number.isFinite(progress) ? Math.round(progress) : 0));
}

function getDashboardNextStep(current, isConfigured, progress) {
  if (!current.current_goal) {
    return {
      title: "生成第一条学习路线",
      desc: "先选择学习目标，系统会用本地示例生成可点击路线；配置 API 只是增强真实模型回答。",
      action: "生成路线",
      view: "plan",
    };
  }
  if (progress < 100) {
    return {
      title: "继续当前学习阶段",
      desc: current.current_stage
        ? `当前阶段是“${current.current_stage}”，建议按路线进入对应模块继续推进。`
        : "当前路线还没有完成，建议回到学习规划页选择阶段继续推进。",
      action: "继续学习",
      view: "plan",
    };
  }
  if (!isConfigured) {
    return {
      title: "可选增强: 连接真实模型接口",
      desc: "核心流程已经可以离线演示；配置 API 后，各 Agent 会改用真实大模型生成更个性化的回答。",
      action: "配置 API",
      view: "settings",
    };
  }
  return {
    title: "复盘并沉淀学习成果",
    desc: "路线已完成，可以回到学习档案查看记录，整理实验结论和后续提升方向。",
    action: "查看档案",
    view: "archive",
  };
}

function renderTable(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

function setMessage(selector, text) {
  $(selector).innerHTML = `<div class="message">${escapeHtml(text)}</div>`;
}

function renderRawAnswer(text) {
  return `<div class="concept-block"><h3>模型生成内容</h3><p>${escapeHtml(text).replaceAll("\n", "<br>")}</p></div>`;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
}

function uniqueStrings(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));
}
