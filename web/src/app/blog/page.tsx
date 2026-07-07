import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insurance Blog",
  description:
    "Plain-English insurance guides for Malaysians — medical cards, life cover, savings, investment-linked plans and retirement.",
};

const categories = ["All", "Medical", "Life", "Savings", "Investment", "Retirement", "Takaful", "Tips"];

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title={
          <>
            Insurance, explained without the{" "}
            <span className="serif-accent text-gold">jargon</span>.
          </>
        }
        subtitle="Short, honest guides to help you make confident decisions — whether or not you ever buy from me."
      />

      <section className="container-x py-12 md:py-16">
        {/* Category filter (static for now) */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <span
              key={c}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-brand text-white"
                  : "border border-hair bg-white text-body hover:border-brand"
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card card-hover mt-10 grid overflow-hidden md:grid-cols-2"
          >
            {featured.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImage} alt="" className="min-h-56 w-full object-cover" />
            ) : (
              <div className="min-h-56 bg-gradient-to-br from-brand to-mid" />
            )}
            <div className="p-7 md:p-9">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mid">
                <span className="rounded-full bg-gold/12 px-2.5 py-1 text-gold">Featured</span>
                <span>{featured.category}</span>
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span className="text-muted">{featured.readMinutes} min read</span>
              </div>
              <h2 className="mt-4 text-2xl leading-tight md:text-3xl">{featured.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{featured.excerpt}</p>
              <span className="link-arrow mt-5 inline-flex">Read article →</span>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((p) => (
            <article key={p.slug} className="card card-hover overflow-hidden">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="h-36 w-full object-cover" />
              ) : (
                <div className="h-36 bg-gradient-to-br from-mist to-ice" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mid">
                  <span>{p.category}</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span className="text-muted">{p.readMinutes} min read</span>
                </div>
                <h3 className="mt-3 text-lg leading-snug">{p.title}</h3>
                <Link href={`/blog/${p.slug}`} className="link-arrow mt-4 text-sm">
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
