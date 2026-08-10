import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  getWorkflowGuide,
  workflowGuides,
} from "@/data/workflowGuides";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return workflowGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = getWorkflowGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/insights/${guide.slug}` },
    openGraph: {
      type: "article",
      title: `${guide.title} | SolarDev AI`,
      description: guide.description,
      url: `https://www.solardev.ai/insights/${guide.slug}`,
      images: ["/opengraph-image.jpg"],
    },
  };
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4 text-slate-300">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-xs font-bold text-emerald-200">
            {index + 1}
          </span>
          <span className="pt-1 leading-7">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = getWorkflowGuide((await params).slug);
  if (!guide) notFound();
  const related = workflowGuides
    .filter(
      (candidate) =>
        candidate.category === guide.category && candidate.slug !== guide.slug,
    )
    .slice(0, 3);
  const url = `https://www.solardev.ai/insights/${guide.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: guide.title,
        description: guide.description,
        url,
        datePublished: "2026-08-11",
        dateModified: "2026-08-11",
        author: { "@type": "Organization", name: "SolarDev AI" },
        publisher: {
          "@type": "Organization",
          name: "SolarDev AI",
          url: "https://www.solardev.ai/",
        },
        about: ["Utility-scale solar", "BESS", guide.category],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.solardev.ai/" },
          { "@type": "ListItem", position: 2, name: "Workflow library", item: "https://www.solardev.ai/insights" },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <article>
          <header className="border-b border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,.11),transparent_42%)]">
            <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
              <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
                <Link href="/insights" className="hover:text-emerald-300">
                  Workflow library
                </Link>
                <span aria-hidden="true"> / </span>
                <span>{guide.category}</span>
              </nav>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                {guide.category}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
                {guide.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {guide.description}
              </p>
            </div>
          </header>

          <div className="mx-auto grid max-w-5xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_250px] lg:px-8 lg:py-20">
            <div>
              <section>
                <h2 className="text-2xl font-semibold">Why this workflow matters</h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  {guide.overview}
                </p>
              </section>

              <section className="mt-12 border-t border-white/10 pt-10">
                <h2 className="text-2xl font-semibold">Questions to answer</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {guide.questions.map((question) => (
                    <li key={question} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                      {question}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-12 border-t border-white/10 pt-10">
                <h2 className="text-2xl font-semibold">Recommended workflow</h2>
                <NumberedList items={guide.workflow} />
              </section>

              <section className="mt-12 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-xl font-semibold">Evidence to collect</h2>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                    {guide.evidence.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-xl font-semibold">Decision-ready outputs</h2>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                    {guide.outputs.map((item) => <li key={item}>→ {item}</li>)}
                  </ul>
                </div>
              </section>

              <aside className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
                <h2 className="font-semibold text-amber-200">Professional limitation</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{guide.caution}</p>
              </aside>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Apply the workflow</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Start with a free mapped site boundary, infrastructure context and indicative yield.
                </p>
                <Link href="/tools/solar-site-screening" className="mt-5 flex justify-center rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">
                  Open GIS Site Check
                </Link>
              </div>
            </aside>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-white/10">
            <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
              <h2 className="text-2xl font-semibold">Related workflows</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.slug} href={`/insights/${item.slug}`} className="rounded-xl border border-white/10 bg-white/[0.025] p-5 text-sm font-semibold leading-6 hover:border-emerald-300/30 hover:text-emerald-200">
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
