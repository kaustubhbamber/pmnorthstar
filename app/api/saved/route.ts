import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ── GET — fetch all saved resources for user ───────────────────────────────
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedResource.findMany({
      where: { userId: user.id },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("Get saved error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ── POST — save a resource ─────────────────────────────────────────────────
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

    const saved = await prisma.savedResource.upsert({
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

    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    console.error("Save resource error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ── DELETE — unsave a resource ─────────────────────────────────────────────
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

    await prisma.savedResource.deleteMany({
      where: {
        userId: user.id,
        resourceId,
      },
    });

    return NextResponse.json({ message: "Resource unsaved" });
  } catch (error) {
    console.error("Unsave resource error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}