import { GuestListTable } from "@/components/dashboard/GuestListTable";

export default function GuestsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Guest List</h1>
      <GuestListTable />
    </div>
  );
}
