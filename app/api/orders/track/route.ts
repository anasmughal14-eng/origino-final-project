import { fail, ok } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const trackingNumber = searchParams.get("trackingNumber");
  if (!orderId && !trackingNumber) return fail("orderId or trackingNumber required", 400);
  return ok({ trackingNumber, orderId, carrier: "COSCO Shipping", status: "In Transit", currentLocation: "Port Qasim, Karachi", estimatedArrival: "2026-05-15", milestones: [{ event:"Order Confirmed",date:"2026-04-01",location:"Sialkot"},{event:"Goods Packed",date:"2026-04-10",location:"Sialkot"},{event:"Departed Factory",date:"2026-04-12",location:"Sialkot"},{event:"At Port",date:"2026-04-14",location:"Port Qasim"},{event:"Vessel Departed",date:"2026-04-16",location:"Karachi"},{event:"In Transit",date:"2026-04-20",location:"Arabian Sea"}] });
}
