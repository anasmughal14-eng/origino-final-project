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
        <div className="panel-soft mx-auto max-w-[1180px] overflow-hidden">
          <div className="grid min-h-[620px] lg:grid-cols-[0.48fr_0.52fr]">
            <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
              <img
                src="https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Pakistani manufacturing detail"
                className="img-editorial-soft h-full w-full object-cover object-[48%_45%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,24,0.02),rgba(26,26,24,0.46))]" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-[#fffaf2] md:p-12">
                <p className="mb-5 inline-flex rounded-full border border-white/35 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em]">Lahore, Pakistan</p>
                <h1 className="max-w-[500px] text-[2.65rem] font-medium leading-[0.97] md:text-[4.05rem]">
                  A quieter way
                  <span className="block italic">to be seen.</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col justify-between p-7 md:p-12">
              <div>
                <p className="section-kicker">Our Story</p>
                <p className="mt-8 max-w-xl text-[1.18rem] leading-[1.55] text-[#3e3a35] md:text-[1.62rem]">
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
            <h2 className="mt-5 text-[2.7rem] font-medium leading-[0.98] md:text-[4.2rem]">
              A quiet
              <span className="block italic">beginning.</span>
            </h2>
            <figure className="image-soft-shell mt-8">
              <img
                src="/images/founder-anas-mughal.jpeg"
                alt="Anas Mughal, Founder of Origino"
                className="img-editorial-portrait aspect-[4/5] w-full object-cover object-[50%_32%]"
              />
            </figure>
            <div className="mt-7 border-t border-[rgba(26,26,24,0.12)] pt-6">
              <p className="text-xl font-medium text-[#1a1a18]">Anas Mughal</p>
              <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-[#8a8178]">Founder, Origino</p>
            </div>
          </div>

          <article className="panel-soft p-7 md:p-12">
            <div className="max-w-[720px] space-y-4 text-[1rem] leading-[1.78] text-[#49443e] md:text-[1.08rem]">
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
                className="panel-soft p-7"
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
        <div className="panel-soft mx-auto max-w-[1180px] p-8 md:p-12">
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--forest)]">Method</p>
              <h2 className="mt-6 max-w-md text-[2.5rem] font-medium leading-[1] md:text-[4rem]">
                Slow selection.
                <span className="block italic">Clear evidence.</span>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {methods.map(([title, body]) => (
                <div key={title} className="border-t border-[rgba(84,98,64,0.16)] pt-6">
                  <h3 className="text-xl font-medium">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#6d675f]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial pb-20 pt-8 md:pb-28">
        <div className="panel-soft mx-auto max-w-[820px] p-8 text-center md:p-12">
          <h2 className="text-[2.8rem] font-medium leading-[0.98] md:text-[4.4rem]">Enter carefully.</h2>
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
