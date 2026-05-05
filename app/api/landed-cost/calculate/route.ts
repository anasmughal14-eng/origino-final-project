import { fail, ok, readJson } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const productValue = Number(body.productValue ?? body.unitPrice ?? 0) * Number(body.quantity ?? 1);
    if (!productValue || productValue <= 0) return fail("productValue or unitPrice must be greater than 0", 400);
    const freight = Number(body.freight ?? body.freightCost ?? productValue * 0.04);
    const insurance = Number(body.insurance ?? body.insuranceCost ?? productValue * 0.005);
    const dutyRate = Number(body.dutyRate ?? (String(body.destination) === "Germany" ? 4.7 : 6.5));
    const vatRate = Number(body.vatRate ?? (String(body.destination) === "UAE" ? 5 : 19));
    const duty = (productValue + freight + insurance) * (dutyRate / 100);
    const vat = (productValue + freight + insurance + duty) * (vatRate / 100);
    const gspPlusSavings = body.gspPlus ? duty * 0.65 : 0;
    const totalLandedCost = productValue + freight + insurance + duty + vat - gspPlusSavings;
    return ok({ totalLandedCost, costPerUnit: totalLandedCost / Number(body.quantity ?? 1), breakdown: { productValue, freight, insurance, dutyRate, duty, vatRate, vat, gspPlusSavings } });
  } catch {
    return fail("Unable to calculate landed cost", 500);
  }
}
