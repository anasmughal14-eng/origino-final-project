import { ok } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "Q1-2026";
  const category = searchParams.get("category") || "all";
  return ok({ period, category, awards: [], message: "Awards calculated quarterly by ORIGINO verification team." });
}

export async function POST() {
  return ok({ message: "Award calculation job triggered." });
}
