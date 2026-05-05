import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ORIGINO",
  description: "The story behind ORIGINO, a curated sourcing platform for Pakistani manufacturing.",
};

const values = [
  {
    symbol: "◎",
    title: "Evidence before claim",
    body: "Verification tiers, documents, audit scores, and visits are shown plainly. A buyer should not have to guess.",
  },
  {
    symbol: "◆",
    title: "Origin matters",
    body: "A product is not only a price. It has a city, a workshop, a process, and a standard of care.",
  },
  {
    symbol: "✦",
    title: "Curation over volume",
    body: "Not everything needs to be shown. What is shown should feel considered.",
  },
];

const founderStory = [
  "Origino did not begin as a platform.",
  "It began with a quiet discomfort.",
  "Growing up around making — in cities where things are produced every day — there was always a gap that was hard to explain.",
  "Not in the work itself, but in how it was seen.",
  "Good things existed.",
  "They just didn’t travel far enough.",
  "Over time, working in film and visual storytelling, that gap became clearer.",
  "People don’t only respond to what is made.",
  "They respond to how it is understood.",
  "And much of what is made here is never understood properly.",
  "Origino comes from that tension.",
  "Between what exists, and what is visible.",
  "Between effort, and recognition.",
  "It is not an attempt to fix everything.",
  "Only to be more careful.",
  "To spend time with the right manufacturers.",
  "To understand what they do.",
  "To present it without noise.",
  "Not everything needs to be shown.",
  "But what is shown should feel considered.",
  "This is not about scale, at least not in the beginning.",
  "It is about getting it right, slowly.",
  "And over time, becoming a place where trust is not built through claims, but through what is consistently chosen and shown.",
];

export default function AboutPage() {
  return (
    <div className="page-enter pt-20">
      <section className="border-b border-[rgba(26,26,24,0.1)] bg-[#fdfbf8] py-20">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#c0623a]" />
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-[#c0623a]">Lahore, Pakistan</span>
            </div>
            <h1 className="mb-8 text-5xl font-bold leading-tight text-[#1a1a18] md:text-7xl">Not a directory.<br /><em>A point of view.</em></h1>
            <p className="max-w-2xl text-xl leading-relaxed text-[#5a5a54]">
              ORIGINO exists for manufacturers whose work is real, but not yet properly seen.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-20">
        <div className="container-editorial grid grid-cols-1 items-start gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="mb-8 text-3xl font-bold leading-tight text-[#1a1a18] md:text-4xl">The gap is not in the making.</h2>
            <div className="space-y-6 leading-relaxed text-[#5a5a54]">
              <p>Across Pakistan, things are made every day with skill, repetition, and patience.</p>
              <p>What often fails is not the work. It is the way the work reaches the world.</p>
              <div className="pullquote my-8">Manufacturing exists. Visibility is broken. Curation creates value.</div>
              <p>ORIGINO is a careful layer between production and discovery. Fewer names. Better context. More proof.</p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="film-grain mb-6 aspect-[4/5] w-full bg-[#1a1a18]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565021005021-9e9ae2af0edd?w=600&q=70')", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) contrast(1.1) brightness(0.8)" }} />
            <p className="text-xs italic text-[#8a8a82]">Made here. Understood elsewhere only when shown with care.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#fdfbf8] py-20">
        <div className="container-editorial">
          <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr]">
            <div>
              <p className="badge-patch mb-5">Founder</p>
              <h2 className="text-4xl md:text-5xl">A quiet beginning.</h2>
              <figure className="mt-8 overflow-hidden rounded-[28px] border border-[rgba(26,26,24,0.1)] bg-[#f7f3ee] shadow-[0_22px_80px_rgba(26,26,24,0.08)]">
                <img
                  src="/images/founder-anas-mughal.jpeg"
                  alt="Anas Mughal, Founder of Origino"
                  className="aspect-[4/5] w-full object-cover object-[50%_32%] grayscale contrast-[1.04] brightness-[0.96]"
                />
              </figure>
              <div className="mt-8 border-t border-[rgba(26,26,24,0.14)] pt-6">
                <p className="text-lg font-semibold text-[#1a1a18]">Anas Mughal</p>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#8a8a82]">Founder, Origino</p>
              </div>
            </div>
            <article className="panel-soft p-6 md:p-10">
              <div className="space-y-5 text-lg leading-8 text-[#4f4b46]">
                {founderStory.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
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
          <div className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#7faa96]">Method</div>
          <h2 className="mb-12 max-w-xl text-3xl font-bold text-[#fdfbf8] md:text-4xl">Slow selection. Clear evidence.</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ["Look closely", "We begin with the manufacturer, the process, and the work already being done."],
              ["Ask for proof", "Documents, scores, response behaviour, and verification tiers sit beside the story."],
              ["Show less", "The point is not endless choice. The point is a better short list."],
            ].map(([title, body]) => <div key={title} className="border-t border-[rgba(247,243,238,0.2)] pt-8"><h3 className="mb-4 text-lg font-bold text-[#fdfbf8]">{title}</h3><p className="text-sm leading-relaxed text-[#d9e3dd]">{body}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#fdfbf8] py-20">
        <div className="container-editorial text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#1a1a18] md:text-4xl">Enter carefully.</h2>
          <p className="mx-auto mb-8 max-w-md text-[#5a5a54]">Buyers may source. Manufacturers may apply. Both paths begin with intent.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register?role=buyer&redirect=/buyer/dashboard" className="btn-pill btn-pill-forest">Buyer Access</Link>
            <Link href="/register?role=seller&redirect=/seller/onboarding" className="btn-pill btn-pill-outline">Manufacturer Audit</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
