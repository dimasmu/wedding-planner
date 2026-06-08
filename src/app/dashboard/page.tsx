import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, DollarSign, Users, CalendarDays } from "lucide-react";

const stats = [
  { label: "Checklist Progress", value: "45%", icon: ClipboardCheck, color: "text-emerald-500" },
  { label: "Budget Spent", value: "62%", icon: DollarSign, color: "text-amber-500" },
  { label: "Guests Confirmed", value: "78/120", icon: Users, color: "text-blue-500" },
  { label: "Days to Wedding", value: "184", icon: CalendarDays, color: "text-rose-500" },
];

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-white border-brand-sand shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-taupe/70">{label}</CardTitle>
              <Icon className={`w-4 h-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <span className="font-serif text-2xl font-bold text-brand-taupe">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
