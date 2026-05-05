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
      <section className="container-editorial">
        <div className="panel-soft overflow-hidden p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="section-kicker">{eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-5xl leading-[0.95] md:text-7xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5a5a54]">{description}</p>
            </div>
            <div className="rounded-[28px] bg-[var(--forest)] p-6 text-[var(--cream)] md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[rgba(247,244,239,0.72)]">Export operating system</p>
              <p className="mt-4 text-3xl font-semibold leading-tight md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Built for verified Pakistani sourcing, documents, trust, and trade flow.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-end gap-6">
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link className="btn-pill btn-pill-forest min-h-[44px]" href={action.href} key={action.href}>
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {metrics.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <div className="panel-soft p-6" key={metric.label}>
                <p className="metric-numeral text-3xl">{metric.value}</p>
                <p className="mt-2 text-sm text-[#5a5a54]">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {items.map((item) => {
              const content = (
                <div className="panel-soft h-full p-6 transition-all hover:-translate-y-1 hover:border-[rgba(79,91,58,0.3)]">
                  <h2 className="text-2xl">{item.title}</h2>
                  <p className="mt-3 text-sm text-[#5a5a54]">{item.body}</p>
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
