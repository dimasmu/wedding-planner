import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const minCapacity = searchParams.get("minCapacity");
    const maxCapacity = searchParams.get("maxCapacity");

    const venues = await db.venue.findMany({
      where: {
        ...(search && { name: { contains: search } }),
        ...(location && { location }),
        ...(minCapacity && { maxCapacity: { gte: Number(minCapacity) } }),
        ...(maxCapacity && { maxCapacity: { lte: Number(maxCapacity) } }),
      },
      include: {
        packages: {
          select: { price: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const venuesWithCheapestPrice = venues.map((v) => ({
      ...v,
      images: JSON.parse(v.images) as string[],
      cheapestPrice: v.packages[0]?.price
        ? Number(v.packages[0].price)
        : null,
    }));

    return NextResponse.json({ venues: venuesWithCheapestPrice });
  } catch (error) {
    console.error("GET /api/venues error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, location, description, maxCapacity, images } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const venue = await db.venue.create({
      data: {
        name,
        slug,
        location: location || "",
        description: description || "",
        maxCapacity: maxCapacity || 0,
        images: JSON.stringify(images || []),
      },
    });

    return NextResponse.json({ venue }, { status: 201 });
  } catch (error) {
    console.error("POST /api/venues error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
