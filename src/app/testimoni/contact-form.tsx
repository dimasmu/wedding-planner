"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  eventDate: z.string().min(1, "Event date is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  description: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

/* ── Component ── */

export function ContactForm() {
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
      eventDate: "",
      eventLocation: "",
      description: "",
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    try {
      // Simulate API call — replace with real endpoint when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thank you! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400" role="alert">{errors.name.message}</p>
        )}
      </div>

      {/* Contact Method */}
      <div>
        <label
          htmlFor="contactMethod"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Contact Method
        </label>
        <select
          id="contactMethod"
          {...register("contactMethod")}
          aria-invalid={!!errors.contactMethod}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors appearance-none cursor-pointer focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234a3e3d%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
        >
          <option value="">Select contact method</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>
        {errors.contactMethod && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.contactMethod.message}
          </p>
        )}
      </div>

      {/* Event Type */}
      <div>
        <label
          htmlFor="eventType"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Type
        </label>
        <select
          id="eventType"
          {...register("eventType")}
          aria-invalid={!!errors.eventType}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors appearance-none cursor-pointer focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234a3e3d%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
        >
          <option value="">Select event type</option>
          <option value="Wedding Ceremonies">Wedding Ceremonies</option>
          <option value="Corporate Events">Corporate Events</option>
          <option value="Social Gatherings">Social Gatherings</option>
          <option value="Traditional Events">Traditional Events</option>
          <option value="Birthday Parties">Birthday Parties</option>
        </select>
        {errors.eventType && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.eventType.message}
          </p>
        )}
      </div>

      {/* Event Date */}
      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Date
        </label>
        <input
          id="eventDate"
          type="date"
          {...register("eventDate")}
          aria-invalid={!!errors.eventDate}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventDate && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.eventDate.message}
          </p>
        )}
      </div>

      {/* Event Location */}
      <div>
        <label
          htmlFor="eventLocation"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Location
        </label>
        <input
          id="eventLocation"
          {...register("eventLocation")}
          placeholder="City or venue"
          aria-invalid={!!errors.eventLocation}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventLocation && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.eventLocation.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Tell us about your event..."
          rows={4}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-gold hover:bg-brand-gold/80 text-white font-serif text-base py-6 rounded-lg transition-all duration-300 disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
