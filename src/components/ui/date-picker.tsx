"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

function DatePicker({
  id,
  date,
  onDateChange,
  placeholder = "Pick a date",
  label,
  "aria-invalid": ariaInvalid,
  error,
  className,
}: {
  id: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  "aria-invalid"?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover>
        <PopoverTrigger
          id={id}
          render={
            <Button
              variant="outline"
              aria-invalid={ariaInvalid}
              className={cn(
                "w-full justify-start text-left font-normal h-10 px-3",
                !date && "text-muted-foreground",
                ariaInvalid &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { DatePicker };
