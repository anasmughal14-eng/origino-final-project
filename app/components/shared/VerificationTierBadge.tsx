import { cn } from "@/lib/utils";
import type { VerificationTier } from "@/types/database";

const tierConfig: Record<VerificationTier, { label: string; symbol: string; className: string; description: string }> = {
  unverified: { label: "Unverified", symbol: "○", className: "tier-unverified", description: "Not yet reviewed by ORIGINO." },
  self_declared: { label: "Self-Declared", symbol: "●", className: "tier-self-declared", description: "Supplier submitted self-declared information." },
  document_verified: { label: "Documents Verified", symbol: "◆", className: "tier-document", description: "Core business documents reviewed." },
  site_visited: { label: "Site Visited", symbol: "◎", className: "tier-site-visited", description: "ORIGINO has visited or virtually audited the factory." },
  origino_certified: { label: "ORIGINO Certified", symbol: "✦", className: "tier-certified", description: "Highest trust tier with full audit evidence." },
};

export default function VerificationTierBadge({ tier, className }: { tier: VerificationTier; className?: string }) {
  const config = tierConfig[tier];
  return <span className={cn("badge-patch group relative", config.className, className)}><span aria-hidden>{config.symbol}</span>{config.label}<span className="pointer-events-none absolute start-0 top-full z-10 mt-2 hidden w-56 border bg-[#fdfbf8] p-2 text-xs normal-case tracking-normal text-[#1a1a18] group-hover:block">{config.description}</span></span>;
}

export function VerificationWaxSeal({ tier }: { tier: VerificationTier }) {
  const config = tierConfig[tier];
  return <span className={cn("inline-flex h-14 w-14 items-center justify-center rounded-full border-2 text-xl", config.className)} title={config.description}>{config.symbol}</span>;
}
