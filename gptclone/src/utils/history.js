const HISTORY_KEY = "gpt_clone_history";

export const readHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
};

export const addHistoryEntry = (entry) => {
  try {
    const history = readHistory();
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    history.unshift(newEntry);
    // Keep only last 50 entries
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return newEntry;
  } catch (error) {
    console.error("Error adding history entry:", error);
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};

export const deleteHistoryEntry = (id) => {
  try {
    const history = readHistory();
    const filtered = history.filter((entry) => entry.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting history entry:", error);
  }
};
