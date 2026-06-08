"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarDays, Star, DollarSign, Image, Package, Settings, FileText } from "lucide-react";

const bookings = [
  { id: "B001", client: "Sarah & James", event: "Wedding Reception", date: "2026-08-15", status: "confirmed", amount: 3200 },
  { id: "B002", client: "Maya Putri", event: "Engagement Party", date: "2026-07-22", status: "pending", amount: 1500 },
  { id: "B003", client: "Dewi & Ahmad", event: "Full Wedding", date: "2026-09-10", status: "confirmed", amount: 5500 },
  { id: "B004", client: "Lisa Kumala", event: "Vow Renewal", date: "2026-10-05", status: "cancelled", amount: 2000 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const stats = [
  { label: "Total Bookings", value: "24", icon: CalendarDays },
  { label: "Average Rating", value: "4.8 ★", icon: Star },
  { label: "Revenue YTD", value: "$48,500", icon: DollarSign },
  { label: "Portfolio Views", value: "1,234", icon: Image },
];

export default function VendorDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe">Vendor Dashboard</h1>
        <Button variant="outline" className="border-brand-gold text-brand-gold">
          <Settings className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-white border-brand-sand shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-taupe/70">{label}</CardTitle>
              <Icon className="w-4 h-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <span className="font-serif text-2xl font-bold text-brand-taupe">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio + Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border-brand-sand shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe flex items-center gap-2">
              <Image className="w-4 h-4 text-brand-gold" /> Portfolio
            </CardTitle>
            <CardDescription>Manage your gallery and packages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-sand rounded-lg">
              <span className="text-brand-taupe text-sm">Wedding Package — Premium</span>
              <span className="font-semibold text-brand-taupe">$3,200</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-sand rounded-lg">
              <span className="text-brand-taupe text-sm">Engagement Package — Standard</span>
              <span className="font-semibold text-brand-taupe">$1,500</span>
            </div>
            <Button variant="outline" className="w-full border-brand-sand text-brand-taupe">
              <Package className="w-4 h-4 mr-2" /> Add New Package
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-gold" /> Recent Inquiries
            </CardTitle>
            <CardDescription>New quote requests from couples.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Sarah & James", event: "Wedding (Aug 2026)", time: "2 hours ago" },
              { name: "Putri & Rizky", event: "Pre-wedding (Jul 2026)", time: "5 hours ago" },
              { name: "Linda & Kevin", event: "Reception (Sep 2026)", time: "1 day ago" },
            ].map((inq) => (
              <div key={inq.name} className="flex items-center justify-between py-2 border-b border-brand-sand last:border-0">
                <div>
                  <p className="text-sm font-medium text-brand-taupe">{inq.name}</p>
                  <p className="text-xs text-brand-taupe/50">{inq.event}</p>
                </div>
                <span className="text-xs text-brand-taupe/40">{inq.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="bg-white border-brand-sand shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-brand-taupe">Booking Requests</CardTitle>
          <CardDescription>Manage your confirmed and pending bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-brand-sand">
                <TableHead className="text-brand-taupe">Booking ID</TableHead>
                <TableHead className="text-brand-taupe">Client</TableHead>
                <TableHead className="text-brand-taupe">Event</TableHead>
                <TableHead className="text-brand-taupe">Date</TableHead>
                <TableHead className="text-brand-taupe">Amount</TableHead>
                <TableHead className="text-brand-taupe">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-brand-sand cursor-pointer hover:bg-brand-sand/30"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <TableCell className="text-brand-gold font-medium">{booking.id}</TableCell>
                  <TableCell className="text-brand-taupe">{booking.client}</TableCell>
                  <TableCell className="text-brand-taupe/70">{booking.event}</TableCell>
                  <TableCell className="text-brand-taupe/70">{booking.date}</TableCell>
                  <TableCell className="font-medium text-brand-taupe">
                    ${booking.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[booking.status]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-brand-taupe">
              Booking {selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>Client: {selectedBooking?.client}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Event</Label>
                  <p className="text-brand-taupe">{selectedBooking.event}</p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Date</Label>
                  <p className="text-brand-taupe">{selectedBooking.date}</p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Amount</Label>
                  <p className="text-brand-taupe font-semibold">
                    ${selectedBooking.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Status</Label>
                  <Badge variant="outline" className={statusColors[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-brand-sand">
                <Button className="bg-brand-gold text-white hover:bg-brand-taupe flex-1">
                  Confirm
                </Button>
                <Button variant="outline" className="border-brand-sand text-brand-taupe/70 flex-1">
                  Decline
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
