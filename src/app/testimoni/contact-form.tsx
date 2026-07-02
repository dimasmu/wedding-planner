"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

/* ── Schema ── */

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactMethod: z.enum(["WhatsApp", "Email"], {
    message: "Please select a contact method",
  }),
  eventType: z.enum(
    [
      "Wedding Ceremonies",
      "Corporate Events",
      "Social Gatherings",
      "Traditional Events",
      "Birthday Parties",
    ],
    { message: "Please select an event type" }
  ),
  eventDate: z.date({ message: "Event date is required" }).optional(),
  eventLocation: z.string().min(1, "Event location is required"),
  description: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

/* ── Shared select class ── */

const selectClass = cn(
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2",
  "text-base md:text-sm",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
  "outline-none transition-colors",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "appearance-none cursor-pointer",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234a3e3d%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
  "bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
);

/* ── Component ── */

export function ContactForm() {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      contactMethod: "" as ContactFormData["contactMethod"],
      eventType: "" as ContactFormData["eventType"],
      eventDate: undefined,
      eventLocation: "",
      description: "",
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    if (!eventDate) {
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thank you! We'll get back to you soon.");
      setEventDate(undefined);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const dateError = !eventDate && Object.keys(errors).length > 0 ? "Event date is required" : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Contact Method */}
      <div className="space-y-2">
        <Label htmlFor="contactMethod">Contact Method</Label>
        <select
          id="contactMethod"
          {...register("contactMethod")}
          aria-invalid={!!errors.contactMethod}
          className={selectClass}
        >
          <option value="">Select contact method</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>
        {errors.contactMethod && (
          <p className="text-sm text-destructive" role="alert">
            {errors.contactMethod.message}
          </p>
        )}
      </div>

      {/* Event Type */}
      <div className="space-y-2">
        <Label htmlFor="eventType">Event Type</Label>
        <select
          id="eventType"
          {...register("eventType")}
          aria-invalid={!!errors.eventType}
          className={selectClass}
        >
          <option value="">Select event type</option>
          <option value="Wedding Ceremonies">Wedding Ceremonies</option>
          <option value="Corporate Events">Corporate Events</option>
          <option value="Social Gatherings">Social Gatherings</option>
          <option value="Traditional Events">Traditional Events</option>
          <option value="Birthday Parties">Birthday Parties</option>
        </select>
        {errors.eventType && (
          <p className="text-sm text-destructive" role="alert">
            {errors.eventType.message}
          </p>
        )}
      </div>

      {/* Event Date */}
      <DatePicker
        id="eventDate"
        label="Event Date"
        date={eventDate}
        onDateChange={setEventDate}
        aria-invalid={!!dateError}
        error={dateError}
      />

      {/* Event Location */}
      <div className="space-y-2">
        <Label htmlFor="eventLocation">Event Location</Label>
        <Input
          id="eventLocation"
          {...register("eventLocation")}
          placeholder="City or venue"
          aria-invalid={!!errors.eventLocation}
        />
        {errors.eventLocation && (
          <p className="text-sm text-destructive" role="alert">
            {errors.eventLocation.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Tell us about your event..."
          rows={4}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2",
            "text-base md:text-sm placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
            "outline-none transition-colors resize-none",
          )}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
