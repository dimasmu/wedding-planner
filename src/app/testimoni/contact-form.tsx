"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call — replace with real endpoint when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you! We'll get back to you soon.");
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
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
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
        <Select
          onValueChange={(value) =>
            value &&
            setValue("contactMethod", value as ContactFormData["contactMethod"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="contactMethod"
            className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm h-auto"
          >
            <SelectValue placeholder="Select contact method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
          </SelectContent>
        </Select>
        {errors.contactMethod && (
          <p className="mt-1 text-sm text-red-400">
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
        <Select
          onValueChange={(value) =>
            value &&
            setValue("eventType", value as ContactFormData["eventType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="eventType"
            className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm h-auto"
          >
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Wedding Ceremonies">Wedding Ceremonies</SelectItem>
            <SelectItem value="Corporate Events">Corporate Events</SelectItem>
            <SelectItem value="Social Gatherings">Social Gatherings</SelectItem>
            <SelectItem value="Traditional Events">Traditional Events</SelectItem>
            <SelectItem value="Birthday Parties">Birthday Parties</SelectItem>
          </SelectContent>
        </Select>
        {errors.eventType && (
          <p className="mt-1 text-sm text-red-400">
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
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventDate && (
          <p className="mt-1 text-sm text-red-400">
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
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventLocation && (
          <p className="mt-1 text-sm text-red-400">
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
