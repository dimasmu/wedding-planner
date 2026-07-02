"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Button
        id={id}
        variant="outline"
        type="button"
        aria-invalid={ariaInvalid}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full justify-start text-left font-normal h-10 px-3 bg-white",
          !date && "text-muted-foreground",
          ariaInvalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 opacity-50 shrink-0" />
        {date ? format(date, "PPP") : <span>{placeholder}</span>}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1">
          <div className="rounded-lg border bg-white shadow-lg p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                onDateChange(d);
                setOpen(false);
              }}
              captionLayout="dropdown"
              startMonth={new Date()}
              endMonth={new Date(new Date().getFullYear() + 3, 11)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { DatePicker };
