"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudgetStore } from "@/lib/store/useBudgetStore";

const COLORS = ["#D3A27F", "#4A3E3D", "#F5EFEB", "#8B7B77", "#C4A882", "#706E6B"];

export function BudgetTracker() {
  const { items, totalBudget, updateSpent, getTotalSpent, getRemaining } = useBudgetStore();
  const totalSpent = getTotalSpent();
  const remaining = getRemaining();

  const chartData = items.map((item) => ({
    name: item.category,
    value: item.spent,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-2xl font-bold text-brand-taupe">
              ${totalBudget.toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-2xl font-bold text-amber-500">
              ${totalSpent.toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`font-serif text-2xl font-bold ${remaining >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              ${remaining.toLocaleString()}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-brand-sand">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe">Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${(Number(value) || 0).toLocaleString()}`, "Spent"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe">Budget Allocation</CardTitle>
            <CardDescription>Update your actual spending by category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm text-brand-taupe">{item.category}</Label>
                  <div className="flex justify-between text-xs text-brand-taupe/50">
                    <span>Spent</span>
                    <span>
                      ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-brand-sand rounded-full h-2 mt-1">
                    <div
                      className="bg-brand-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                    />
                  </div>
                </div>
                <Input
                  type="number"
                  value={item.spent}
                  onChange={(e) => updateSpent(item.id, Number(e.target.value))}
                  className="w-24 border-brand-sand text-sm"
                  min={0}
                  max={item.allocated}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
