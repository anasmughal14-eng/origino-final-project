import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const data = await readJson<Record<string, unknown>>(request);
    if (!data.title || !data.content) return fail("title and content are required", 400);
    return ok({ postId: `community-${Date.now()}`, status: "published", ...data }, 201);
  } catch {
    return fail("Unable to publish community post", 500);
  }
}
