"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuestStore, RSVP } from "@/lib/store/useGuestStore";

const rsvpColors: Record<RSVP, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  declined: "bg-rose-100 text-rose-700 border-rose-200",
};

export function GuestListTable() {
  const { guests, updateRsvp, getStats } = useGuestStore();
  const stats = getStats();
  const [filter, setFilter] = useState<RSVP | "all">("all");

  const filteredGuests = filter === "all" ? guests : guests.filter((g) => g.rsvp === filter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-brand-taupe">{stats.total}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-emerald-500">{stats.confirmed}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-amber-500">{stats.pending}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-rose-500">{stats.declined}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-brand-sand shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg text-brand-taupe">Guest List</CardTitle>
              <CardDescription>Manage RSVPs and meal preferences.</CardDescription>
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as RSVP | "all")}>
              <SelectTrigger className="w-36 border-brand-sand text-sm">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Guests</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-brand-sand">
                <TableHead className="text-brand-taupe">Name</TableHead>
                <TableHead className="text-brand-taupe">Email</TableHead>
                <TableHead className="text-brand-taupe">+1</TableHead>
                <TableHead className="text-brand-taupe">Meal</TableHead>
                <TableHead className="text-brand-taupe">RSVP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} className="border-brand-sand">
                  <TableCell className="font-medium text-brand-taupe">{guest.name}</TableCell>
                  <TableCell className="text-brand-taupe/60">{guest.email}</TableCell>
                  <TableCell className="text-brand-taupe/60">
                    {guest.plusOne ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-brand-taupe/60">{guest.mealPreference}</TableCell>
                  <TableCell>
                    <Select
                      value={guest.rsvp}
                      onValueChange={(v) => updateRsvp(guest.id, v as RSVP)}
                    >
                      <SelectTrigger className={`w-28 text-xs border ${rsvpColors[guest.rsvp]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGuests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-brand-taupe/50 py-10">
                    No guests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
