import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import { site, waLink } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-paper">
      {/* Header */}
      <header className="border-b border-hair">
        <div className="container-x max-w-3xl py-14 md:py-16">
          <Link href="/blog" className="link-arrow text-sm">
            ← Back to blog
          </Link>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mid">
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span className="text-muted">{post.readMinutes} min read</span>
          </div>
          <h1 className="mt-4 text-3xl leading-tight md:text-[2.75rem]">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">{post.excerpt}</p>
        </div>
      </header>

      {post.coverImage && (
        <div className="container-x max-w-3xl pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt=""
            className="w-full rounded-card border border-hair object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="container-x max-w-3xl py-12">
        {post.bodyHtml ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        ) : (
          <p className="rounded-card border border-dashed border-hair bg-cloud p-5 text-sm text-muted">
            🔧 This is a sample article — the full text appears once it&apos;s written in your admin
            dashboard.
          </p>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-card border border-hair bg-white p-6 md:flex md:items-center md:justify-between">
          <p className="text-base text-body">
            <span className="font-semibold text-ink">Have a question about this?</span> I&apos;m
            happy to explain it for your situation.
          </p>
          <a
            href={waLink(`Hi ${site.name}, I just read "${post.title}" and have a question.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-4 md:mt-0"
          >
            Ask me on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
