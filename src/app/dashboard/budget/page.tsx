import { BudgetTracker } from "@/components/dashboard/BudgetTracker";

export default function BudgetPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Budget Tracker</h1>
      <BudgetTracker />
    </div>
  );
}
