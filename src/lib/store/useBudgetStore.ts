import { create } from "zustand";

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

interface BudgetState {
  items: BudgetItem[];
  totalBudget: number;
  updateSpent: (id: string, spent: number) => void;
  getTotalSpent: () => number;
  getRemaining: () => number;
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  totalBudget: 30000,
  items: [
    { id: "1", category: "Venue", allocated: 10000, spent: 8000 },
    { id: "2", category: "Catering", allocated: 8000, spent: 4500 },
    { id: "3", category: "Photography", allocated: 4000, spent: 3000 },
    { id: "4", category: "Attire", allocated: 3000, spent: 2000 },
    { id: "5", category: "Decoration", allocated: 3000, spent: 1000 },
    { id: "6", category: "Music & Entertainment", allocated: 2000, spent: 500 },
  ],
  updateSpent: (id, spent) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, spent: Math.min(spent, item.allocated) } : item
      ),
    })),
  getTotalSpent: () => get().items.reduce((sum, item) => sum + item.spent, 0),
  getRemaining: () => get().totalBudget - get().getTotalSpent(),
}));
