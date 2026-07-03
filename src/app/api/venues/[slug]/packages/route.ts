import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, pax, price, features, bookingUrl } = body;

    if (!name || !pax || !price) {
      return NextResponse.json(
        { error: "Name, pax, and price are required" },
        { status: 400 }
      );
    }

    const venue = await db.venue.findUnique({ where: { slug } });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const pkg = await db.package.create({
      data: {
        venueId: venue.id,
        name,
        pax: Number(pax),
        price: BigInt(price),
        features: JSON.stringify(features || []),
        bookingUrl: bookingUrl || "",
      },
    });

    return NextResponse.json(
      { package: { ...pkg, price: Number(pkg.price), features: JSON.parse(pkg.features) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/venues/[slug]/packages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
