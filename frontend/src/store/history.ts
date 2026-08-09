import { create } from 'zustand';
import type { ReadingRecord, DrawnCard } from '../data/types';

const STORAGE_KEY = 'tarot-reading-history';

const loadHistory = (): ReadingRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReadingRecord[];
  } catch {
    return [];
  }
};

const saveHistory = (records: ReadingRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // 忽略存储失败
  }
};

interface HistoryStore {
  records: ReadingRecord[];
  addRecord: (record: ReadingRecord) => void;
  removeRecord: (id: string) => void;
  clearAll: () => void;
  updateRecord: (id: string, patch: Partial<ReadingRecord>) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  records: loadHistory(),
  addRecord: (record) => {
    const next = [record, ...get().records];
    saveHistory(next);
    set({ records: next });
  },
  removeRecord: (id) => {
    const next = get().records.filter((r) => r.id !== id);
    saveHistory(next);
    set({ records: next });
  },
  clearAll: () => {
    saveHistory([]);
    set({ records: [] });
  },
  updateRecord: (id, patch) => {
    const next = get().records.map((r) => (r.id === id ? { ...r, ...patch } : r));
    saveHistory(next);
    set({ records: next });
  },
}));

// 抽牌工具：从全部牌中随机抽取 n 张，并随机判定正逆位
export function drawCards(allCardIds: string[], count: number): DrawnCard[] {
  const pool = [...allCardIds];
  const result: DrawnCard[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const cardId = pool.splice(idx, 1)[0];
    result.push({
      cardId,
      isReversed: Math.random() < 0.5,
    });
  }
  return result;
}
