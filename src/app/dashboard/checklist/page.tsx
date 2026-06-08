import { ChecklistContainer } from "@/components/dashboard/ChecklistContainer";

export default function ChecklistPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Wedding Checklist</h1>
      <ChecklistContainer />
    </div>
  );
}
