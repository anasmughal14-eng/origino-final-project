import Link from "next/link";

type ToolPageProps = {
  title: string;
  eyebrow?: string;
  description: string;
  actions?: Array<{ href: string; label: string }>;
  metrics?: Array<{ label: string; value: string }>;
  items?: Array<{ title: string; body: string; href?: string }>;
};

export default function ToolPage({ title, eyebrow = "ORIGINO", description, actions = [], metrics = [], items = [] }: ToolPageProps) {
  return (
    <div className="page-enter pt-28">
      <section className="container-editorial pb-16">
        <div className="grid max-w-[73rem] gap-5 md:gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-end">
          <div>
            <div>
              <p className="section-kicker">{eyebrow}</p>
              <div className="relative mt-5 max-w-4xl px-3 py-4 md:px-5 md:py-5">
                <div className="absolute -inset-x-1 -inset-y-1 rounded-[26px] border border-[rgba(84,98,64,0.2)] bg-[linear-gradient(135deg,rgba(238,240,227,0.95),rgba(255,248,235,0.9))] shadow-[0_22px_70px_rgba(84,98,64,0.16)] md:-inset-x-2 md:-inset-y-2 md:rounded-[34px]" />
                <h1 className="relative text-[2.7rem] leading-[0.95] md:text-7xl">{title}</h1>
              </div>
              <p className="mt-5 max-w-2xl text-[1.02rem] leading-7 text-[#5a5a54] md:text-lg md:leading-8">{description}</p>
            </div>
            {actions.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {actions.map((action) => (
                  <Link className="btn-pill btn-pill-forest min-h-[48px] justify-center" href={action.href} key={action.href}>
                    {action.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="panel-soft border-[rgba(84,98,64,0.22)] bg-[rgba(238,240,227,0.64)] p-4 shadow-[0_24px_70px_rgba(79,91,58,0.12)] md:p-6">
            <p className="section-kicker text-[var(--forest)]">Operating system</p>
            <p className="mt-4 text-[2rem] font-semibold leading-tight md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Built for verified Pakistani sourcing, documents, trust, and trade flow.
            </p>
            <div className="mt-6 grid gap-3 text-sm leading-6">
              {["Select carefully", "Show evidence", "Move with clarity"].map((line) => (
                <div className="rounded-[18px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.74)] px-4 py-3" key={line}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
        {metrics.length > 0 && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3 md:mt-10 md:gap-4">
            {metrics.map((metric) => (
              <div className="panel-soft border-[rgba(84,98,64,0.16)] bg-[rgba(255,250,242,0.72)] p-4 md:p-6" key={metric.label}>
                <p className="metric-numeral text-2xl md:text-3xl">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-[#5a5a54]">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const content = (
                <div className="panel-soft h-full border-[rgba(84,98,64,0.16)] bg-[rgba(255,250,242,0.68)] p-5 transition-all hover:-translate-y-1 hover:border-[rgba(79,91,58,0.3)] md:p-6">
                  <h2 className="text-[1.65rem] leading-tight md:text-2xl">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#5a5a54]">{item.body}</p>
                </div>
              );
              return item.href ? <Link href={item.href} key={item.title}>{content}</Link> : <div key={item.title}>{content}</div>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
