import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, pax, price, content, bookingUrl } = body;

    const pkgId = parseInt(id);
    if (isNaN(pkgId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const pkg = await db.package.update({
      where: { id: pkgId },
      data: {
        ...(name && { name }),
        ...(pax !== undefined && { pax: Number(pax) }),
        ...(price !== undefined && { price: BigInt(price) }),
        ...(content !== undefined && { content }),
        ...(bookingUrl !== undefined && { bookingUrl }),
      },
    });

    return NextResponse.json({
      package: { ...pkg, price: Number(pkg.price), content: pkg.content },
    });
  } catch (error) {
    console.error("PUT /api/packages/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkgId = parseInt(id);
    if (isNaN(pkgId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    await db.package.delete({ where: { id: pkgId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/packages/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
