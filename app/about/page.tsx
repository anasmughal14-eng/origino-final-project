import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story behind ORIGINO, Pakistan's first curated B2B export marketplace.",
};

const values = [
  {
    symbol: "◎",
    title: "Radical Transparency",
    body: "We show buyers exactly what tier of verification each supplier has achieved. No hiding behind vague quality claims. Every score, every visit, every document is visible.",
  },
  {
    symbol: "◆",
    title: "Provenance Over Price",
    body: "Where a product comes from, who made it, and how it was made matters as much as what it costs. We build that narrative into every listing.",
  },
  {
    symbol: "✦",
    title: "Craft Before Commerce",
    body: "Pakistan's manufacturers are craftsmen first. We curate for quality, not quantity.",
  },
];

const team = [
  { name: "Ahmed Raza Khan", role: "Co-Founder & CEO", origin: "Lahore to London to Lahore", bio: "Former trade finance banker. Built ORIGINO to help Pakistani exporters show their real capability to global buyers." },
  { name: "Sara Qureshi", role: "Co-Founder & COO", origin: "Karachi to Berlin to Karachi", bio: "Supply chain consultant who audited factories across South Asia for European brands." },
  { name: "Bilal Mahmood", role: "Head of Verification", origin: "Sialkot", bio: "Third-generation surgical instrument manufacturer with deep cluster and certification knowledge." },
];

export default function AboutPage() {
  return (
    <div className="page-enter pt-20">
      <section className="border-b border-[rgba(26,26,24,0.1)] bg-[#fdfbf8] py-20">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#c0623a]" />
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-[#c0623a]">Est. 2026, Lahore, Pakistan</span>
            </div>
            <h1 className="mb-8 text-5xl font-bold leading-tight text-[#1a1a18] md:text-7xl">Built for Those<br /><em>Who Build Things.</em></h1>
            <p className="max-w-2xl text-xl leading-relaxed text-[#5a5a54]">ORIGINO exists because the world's best-kept manufacturing secret deserved to be discovered properly, not through spam emails, opaque middlemen, or trade fair luck.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-20">
        <div className="container-editorial grid grid-cols-1 items-start gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="mb-8 text-3xl font-bold leading-tight text-[#1a1a18] md:text-4xl">The Problem We Refused to Ignore</h2>
            <div className="space-y-6 leading-relaxed text-[#5a5a54]">
              <p>Pakistan exports over $30 billion annually. Its manufacturers produce surgical instruments trusted across Europe, sports equipment used worldwide, and textiles for major retailers, yet many remain invisible to global buyers.</p>
              <p>The problem was not quality. The problem was discovery. Buyers needed a way to distinguish verified manufacturers from traders with polished websites.</p>
              <div className="pullquote my-8">The world's best-kept manufacturing secret deserved to be told with the care and craft it embodies.</div>
              <p>ORIGINO was built as a curated platform where every supplier can show evidence, verification, provenance, and readiness for export.</p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="film-grain mb-6 aspect-[4/5] w-full bg-[#1a1a18]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565021005021-9e9ae2af0edd?w=600&q=70')", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) contrast(1.1) brightness(0.8)" }} />
            <p className="text-xs italic text-[#8a8a82]">A craftsman at work in Sialkot. The instruments he makes may be used in surgical theatres across Europe.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#fdfbf8] py-20">
        <div className="container-editorial">
          <div className="divider-text mb-16">What We Stand For</div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {values.map((value) => <div key={value.title} className="border-t-2 border-[#1a1a18] pt-8"><span className="mb-4 block text-2xl text-[#2d4a3e]">{value.symbol}</span><h3 className="mb-4 text-xl font-bold text-[#1a1a18]">{value.title}</h3><p className="leading-relaxed text-[#5a5a54]">{value.body}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#2d4a3e] py-20 text-[#f7f3ee]">
        <div className="container-editorial">
          <div className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#7faa96]">The Team</div>
          <h2 className="mb-12 max-w-xl text-3xl font-bold text-[#fdfbf8] md:text-4xl">Operators, Not Observers</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {team.map((member) => <div key={member.name} className="border-t border-[rgba(247,243,238,0.2)] pt-8"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(247,243,238,0.2)] bg-[rgba(247,243,238,0.1)]"><span className="text-xl font-bold text-[#fdfbf8]">{member.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span></div><h3 className="mb-1 text-lg font-bold text-[#fdfbf8]">{member.name}</h3><p className="mb-1 text-xs uppercase tracking-wider text-[#7faa96]">{member.role}</p><p className="mb-4 text-xs text-[#c8d8cf]">{member.origin}</p><p className="text-sm leading-relaxed text-[#d9e3dd]">{member.bio}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#fdfbf8] py-20">
        <div className="container-editorial text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#1a1a18] md:text-4xl">Join the Platform</h2>
          <p className="mx-auto mb-8 max-w-md text-[#5a5a54]">Whether you buy or sell, ORIGINO is built for you.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register?role=buyer&redirect=/buyer/dashboard" className="btn-pill btn-pill-forest">Join as Buyer</Link>
            <Link href="/register?role=seller&redirect=/seller/onboarding" className="btn-pill btn-pill-outline">Apply as Supplier</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
