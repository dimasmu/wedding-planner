"use client";

import { useChecklistStore } from "@/lib/store/useChecklistStore";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ChecklistContainer() {
  const { tasks, toggleTask, getCompletionPercentage } = useChecklistStore();
  const percentage = getCompletionPercentage();

  return (
    <Card className="shadow-sm border-brand-sand bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-brand-taupe flex justify-between items-center">
          <span>Your Planning Progress</span>
          <span className="text-brand-gold font-sans text-lg">{percentage}%</span>
        </CardTitle>
        <CardDescription>
          Check off each step as you complete it. We&rsquo;ll track your progress automatically.
        </CardDescription>
        <Progress value={percentage} className="h-2 bg-brand-sand [&>div]:bg-brand-gold mt-4" />
      </CardHeader>
      <CardContent className="mt-4 flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between p-4 rounded-lg border transition-all ${
              task.completed
                ? "bg-brand-cream/40 border-slate-100"
                : "bg-white border-brand-sand hover:border-brand-gold/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-0.5 border-brand-gold text-brand-gold focus-visible:ring-brand-gold"
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={task.id}
                  className={`font-medium text-brand-taupe cursor-pointer text-sm leading-none ${
                    task.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {task.title}
                </label>
                <span className="text-xs text-brand-taupe/60 italic">{task.dueDate}</span>
              </div>
            </div>
            <Badge variant="outline" className="border-brand-gold text-brand-gold capitalize text-xs">
              {task.category}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
