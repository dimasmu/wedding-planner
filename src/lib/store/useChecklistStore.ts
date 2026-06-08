import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  category: string;
}

interface ChecklistState {
  tasks: Task[];
  toggleTask: (id: string) => void;
  getCompletionPercentage: () => number;
}

export const useChecklistStore = create<ChecklistState>()((set, get) => ({
  tasks: [
    { id: "1", title: "Determine Your Maximum Wedding Budget", completed: true, dueDate: "12 months before", category: "Planning" },
    { id: "2", title: "Choose & Secure Your Venue", completed: false, dueDate: "10 months before", category: "Venue" },
    { id: "3", title: "Select Photography & Videography Vendors", completed: false, dueDate: "9 months before", category: "Vendors" },
    { id: "4", title: "Wedding Attire Fitting", completed: false, dueDate: "6 months before", category: "Attire" },
    { id: "5", title: "Send Save the Dates", completed: false, dueDate: "8 months before", category: "Guests" },
    { id: "6", title: "Book Catering & Finalize Menu", completed: false, dueDate: "7 months before", category: "Vendors" },
    { id: "7", title: "Hire Florist & Decorator", completed: false, dueDate: "6 months before", category: "Vendors" },
    { id: "8", title: "Finalize Guest List", completed: false, dueDate: "4 months before", category: "Guests" },
    { id: "9", title: "Book Hair & Makeup Artist", completed: false, dueDate: "4 months before", category: "Beauty" },
    { id: "10", title: "Send Final Invitations", completed: false, dueDate: "3 months before", category: "Guests" },
  ],
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  getCompletionPercentage: () => {
    const tasks = get().tasks;
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t) => t.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  },
}));
