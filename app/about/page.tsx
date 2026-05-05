import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story behind ORIGINO, a curated sourcing platform for Pakistani manufacturing.",
};

const principles = [
  {
    label: "01",
    title: "Evidence before claim",
    body: "Verification, documents, audit scores, and visits are shown plainly. A buyer should not have to guess.",
  },
  {
    label: "02",
    title: "Origin matters",
    body: "A product is not only a price. It has a city, a workshop, a process, and a standard of care.",
  },
  {
    label: "03",
    title: "Curation over volume",
    body: "Not everything needs to be shown. What is shown should feel considered.",
  },
];

const founderStory = [
  "Origino did not begin as a platform.",
  "It began with a quiet discomfort.",
  "Growing up around making, in cities where things are produced every day, there was always a gap that was hard to explain.",
  "Not in the work itself, but in how it was seen.",
  "Good things existed.",
  "They just did not travel far enough.",
  "Over time, working in film and visual storytelling, that gap became clearer.",
  "People do not only respond to what is made.",
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

const methods = [
  ["Look closely", "Begin with the manufacturer, the process, and the work already being done."],
  ["Ask for proof", "Place documents, response behaviour, and verification beside the story."],
  ["Show less", "The point is not endless choice. The point is a better short list."],
];

export default function AboutPage() {
  return (
    <div className="page-enter pt-24">
      <section className="container-editorial pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[34px] border border-white/55 bg-[rgba(255,250,242,0.54)] shadow-[0_28px_110px_rgba(64,52,38,0.1)] backdrop-blur-2xl">
          <div className="grid min-h-[620px] lg:grid-cols-[0.48fr_0.52fr]">
            <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1565021005021-9e9ae2af0edd?w=1000&q=75"
                alt="Pakistani manufacturing detail"
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,24,0.04),rgba(26,26,24,0.5))]" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-[#fffaf2] md:p-12">
                <p className="mb-5 inline-flex rounded-full border border-white/35 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em]">Lahore, Pakistan</p>
                <h1 className="max-w-[540px] text-[4rem] font-medium leading-[0.92] md:text-[5.8rem]">
                  Not a directory.
                  <span className="block italic">A point of view.</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col justify-between p-7 md:p-12">
              <div>
                <p className="section-kicker">Our Story</p>
                <p className="mt-8 max-w-xl text-[1.45rem] leading-[1.45] text-[#3e3a35] md:text-[2rem]">
                  Manufacturing exists. Visibility is broken. Curation creates value.
                </p>
              </div>
              <div className="mt-12 grid gap-5 text-[#5a554f] md:grid-cols-2">
                <p className="text-lg leading-8">ORIGINO exists for manufacturers whose work is real, but not yet properly seen.</p>
                <p className="text-lg leading-8">Fewer names. Better context. Proof placed close to the work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="section-kicker">Founder</p>
            <h2 className="mt-5 text-[3.2rem] font-medium leading-[0.95] md:text-[5.4rem]">
              A quiet
              <span className="block italic">beginning.</span>
            </h2>
            <figure className="mt-8 overflow-hidden rounded-[30px] border border-white/60 bg-[#f7f3ee] shadow-[0_28px_90px_rgba(64,52,38,0.12)]">
              <img
                src="/images/founder-anas-mughal.jpeg"
                alt="Anas Mughal, Founder of Origino"
                className="aspect-[4/5] w-full object-cover object-[50%_32%] grayscale contrast-[1.03] brightness-[0.96]"
              />
            </figure>
            <div className="mt-7 border-t border-[rgba(26,26,24,0.12)] pt-6">
              <p className="text-xl font-medium text-[#1a1a18]">Anas Mughal</p>
              <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#8a8178]">Founder, Origino</p>
            </div>
          </div>

          <article className="rounded-[34px] border border-white/60 bg-[rgba(255,250,242,0.48)] p-7 shadow-[0_24px_90px_rgba(64,52,38,0.08)] backdrop-blur-2xl md:p-12">
            <div className="max-w-[760px] space-y-5 text-[1.18rem] leading-[1.85] text-[#49443e] md:text-[1.36rem]">
              {founderStory.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 || index === 10 || index === 20 ? "font-medium text-[#1a1a18]" : undefined}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="container-editorial py-14 md:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 flex items-center gap-5">
            <div className="h-px flex-1 bg-[rgba(26,26,24,0.12)]" />
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#8a8178]">What We Stand For</p>
            <div className="h-px flex-1 bg-[rgba(26,26,24,0.12)]" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="rounded-[26px] border border-white/55 bg-[rgba(255,250,242,0.42)] p-7 shadow-[0_18px_70px_rgba(64,52,38,0.07)] backdrop-blur-xl"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#b8913a]">{principle.label}</p>
                <h3 className="mt-10 text-2xl font-medium text-[#1a1a18]">{principle.title}</h3>
                <p className="mt-4 leading-7 text-[#5f5a53]">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-editorial py-14 md:py-24">
        <div className="mx-auto max-w-[1180px] rounded-[34px] bg-[#4f6138] p-8 text-[#fffaf2] shadow-[0_28px_110px_rgba(64,52,38,0.14)] md:p-12">
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#d9c9a8]">Method</p>
              <h2 className="mt-6 max-w-md text-[3rem] font-medium leading-[0.98] md:text-[4.8rem]">
                Slow selection.
                <span className="block italic">Clear evidence.</span>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {methods.map(([title, body]) => (
                <div key={title} className="border-t border-white/25 pt-6">
                  <h3 className="text-xl font-medium">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#ece2d2]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial pb-20 pt-8 md:pb-28">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-[3.4rem] font-medium leading-[0.95] md:text-[5.6rem]">Enter carefully.</h2>
          <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-[#5a554f]">
            Buyers may source. Manufacturers may apply. Both paths begin with intent.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register?role=buyer&redirect=/buyer/dashboard" className="btn-pill btn-pill-forest min-h-[50px] px-8">Buyer Access</Link>
            <Link href="/register?role=seller&redirect=/seller/onboarding" className="btn-pill btn-pill-outline min-h-[50px] px-8">Manufacturer Audit</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
