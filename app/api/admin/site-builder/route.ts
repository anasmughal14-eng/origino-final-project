import { fail, ok, readJson } from "@/lib/api-response";

const allowedPages = new Set(["home", "buyer", "seller", "about", "marketplace"]);

function isSection(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const section = value as { id?: unknown; type?: unknown };
  return (
    typeof section.id === "string" &&
    section.id.length > 0 &&
    typeof section.type === "string" &&
    section.type.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const sections = body.sections;

    if (!Array.isArray(sections)) return fail("sections array is required", 400);
    if (sections.length === 0) return fail("at least one section is required", 400);
    if (!sections.every(isSection)) return fail("every section requires id and type", 400);

    const requestedPage = typeof body.page === "string" ? body.page : "home";
    const page = allowedPages.has(requestedPage) ? requestedPage : "home";
    const updatedAt = typeof body.updatedAt === "string" ? body.updatedAt : new Date().toISOString();
    const previewUrl =
      page === "home" ? "/" : page === "buyer" ? "/?path=buyer" : page === "seller" ? "/?path=seller" : `/${page}`;

    return ok({
      saved: true,
      page,
      count: sections.length,
      themeSaved: Boolean(body.theme),
      previewUrl,
      updatedAt,
    });
  } catch {
    return fail("Unable to save site sections", 500);
  }
}
