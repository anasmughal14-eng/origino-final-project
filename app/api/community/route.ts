import { fail, ok, readJson } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  return ok({ posts: [], total: 0, page, category });
}

export async function POST(req: NextRequest) {
  try {
    const { title, body, category, authorId } = await readJson(req);
    if (!title || !body) return fail("Missing required fields", 400);
    return ok({ postId: `POST-${Date.now()}`, category, authorId, message: "Post published." }, 201);
  } catch {
    return fail("Failed to publish post", 500);
  }
}
