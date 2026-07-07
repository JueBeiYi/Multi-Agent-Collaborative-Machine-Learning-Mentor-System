(function () {
  const DB_NAME = "ml_tutor_archive";
  const DB_VERSION = 3;
  const STORES = [
    "learning_records",
    "experiment_records",
    "error_records",
    "agent_outputs",
    "learning_plans",
    "weak_points",
    "mistake_records",
    "quiz_attempts",
    "concept_mastery",
    "stage_progress",
    "assessment_records",
    "review_records",
  ];

  let dbPromise;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const store of STORES) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
          }
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function addRecord(storeName, record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const payload = Object.assign({ time: new Date().toLocaleString() }, record);
      const request = tx.objectStore(storeName).add(payload);
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function putRecord(storeName, record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const request = tx.objectStore(storeName).put(record);
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const request = tx.objectStore(storeName).getAll();
      request.onsuccess = () => resolve(request.result.reverse());
      request.onerror = () => reject(request.error);
    });
  }

  async function clearStore(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAll() {
    await Promise.all(STORES.map(clearStore));
    try {
      localStorage.removeItem("ml_tutor_current_state");
    } catch (error) {
      console.warn("无法清理本地学习状态。", error);
    }
  }

  function safeLocalStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("无法读取浏览器本地学习状态。", error);
      return null;
    }
  }

  function saveCurrentState(state) {
    try {
      localStorage.setItem("ml_tutor_current_state", JSON.stringify(state || {}));
    } catch (error) {
      console.warn("学习进度暂时无法保存到浏览器本地。", error);
    }
  }

  function getCurrentState() {
    try {
      const parsed = JSON.parse(safeLocalStorageGet("ml_tutor_current_state") || "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  async function exportAll() {
    const data = { current_state: getCurrentState(), stores: {} };
    for (const store of STORES) {
      data.stores[store] = await getAll(store);
    }
    return data;
  }

  async function importAll(data) {
    if (!data || typeof data !== "object" || !data.stores) {
      throw new Error("JSON 文件不是有效学习档案");
    }
    if (data.current_state) saveCurrentState(data.current_state);
    for (const store of STORES) {
      const records = Array.isArray(data.stores[store]) ? data.stores[store] : [];
      for (const record of records) {
        await putRecord(store, record);
      }
    }
  }

  window.LocalArchive = {
    addRecord,
    putRecord,
    getAll,
    clearAll,
    saveCurrentState,
    getCurrentState,
    exportAll,
    importAll,
  };
})();
