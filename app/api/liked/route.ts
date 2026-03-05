import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ── GET — fetch all liked resources for user ───────────────────────────────
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const liked = await prisma.likedResource.findMany({
      where: { userId: user.id },
      orderBy: { likedAt: "desc" },
    });

    return NextResponse.json({ liked });
  } catch (error) {
    console.error("Get liked error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ── POST — like a resource ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId, title, author, category, link } = await req.json();

    if (!resourceId || !title || !author || !category || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const liked = await prisma.likedResource.upsert({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        resourceId,
        title,
        author,
        category,
        link,
      },
    });

    return NextResponse.json({ liked }, { status: 201 });
  } catch (error) {
    console.error("Like resource error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ── DELETE — unlike a resource ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await req.json();

    if (!resourceId) {
      return NextResponse.json(
        { error: "resourceId is required" },
        { status: 400 }
      );
    }

    await prisma.likedResource.deleteMany({
      where: {
        userId: user.id,
        resourceId,
      },
    });

    return NextResponse.json({ message: "Resource unliked" });
  } catch (error) {
    console.error("Unlike resource error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}