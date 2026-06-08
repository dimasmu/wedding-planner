import { create } from "zustand";

export type RSVP = "confirmed" | "declined" | "pending";

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: RSVP;
  plusOne: boolean;
  mealPreference: string;
}

interface GuestState {
  guests: Guest[];
  updateRsvp: (id: string, rsvp: RSVP) => void;
  getStats: () => { confirmed: number; declined: number; pending: number; total: number };
}

export const useGuestStore = create<GuestState>()((set, get) => ({
  guests: [
    { id: "1", name: "Budi Santoso", email: "budi@email.com", rsvp: "confirmed", plusOne: true, mealPreference: "Regular" },
    { id: "2", name: "Siti Nurhaliza", email: "siti@email.com", rsvp: "confirmed", plusOne: false, mealPreference: "Vegetarian" },
    { id: "3", name: "Ahmad Fauzi", email: "ahmad@email.com", rsvp: "pending", plusOne: true, mealPreference: "Regular" },
    { id: "4", name: "Dewi Lestari", email: "dewi@email.com", rsvp: "declined", plusOne: false, mealPreference: "Regular" },
    { id: "5", name: "Rudi Hermawan", email: "rudi@email.com", rsvp: "confirmed", plusOne: true, mealPreference: "Halal" },
    { id: "6", name: "Anisa Rahma", email: "anisa@email.com", rsvp: "pending", plusOne: false, mealPreference: "Vegetarian" },
    { id: "7", name: "Hendra Gunawan", email: "hendra@email.com", rsvp: "confirmed", plusOne: false, mealPreference: "Regular" },
    { id: "8", name: "Ratna Sari", email: "ratna@email.com", rsvp: "pending", plusOne: true, mealPreference: "Regular" },
  ],
  updateRsvp: (id, rsvp) =>
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.id === id ? { ...guest, rsvp } : guest
      ),
    })),
  getStats: () => {
    const guests = get().guests;
    return {
      confirmed: guests.filter((g) => g.rsvp === "confirmed").length,
      declined: guests.filter((g) => g.rsvp === "declined").length,
      pending: guests.filter((g) => g.rsvp === "pending").length,
      total: guests.length,
    };
  },
}));
