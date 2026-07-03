import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const venue = await db.venue.findUnique({
      where: { slug },
      include: { packages: { orderBy: { price: "asc" } } },
    });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    return NextResponse.json({
      venue: {
        ...venue,
        images: JSON.parse(venue.images) as string[],
        packages: venue.packages.map((pkg) => ({
          ...pkg,
          price: Number(pkg.price),
          features: JSON.parse(pkg.features) as string[],
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, location, description, maxCapacity, images, status } = body;

    const venue = await db.venue.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
        ...(maxCapacity !== undefined && { maxCapacity }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("PUT /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await db.venue.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
