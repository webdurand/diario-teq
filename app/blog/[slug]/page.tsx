import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllPostsMeta,
  getPostBySlug,
  getPostSlugs,
  normalizeTag,
} from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { buildMetadata, absoluteUrl, siteConfig } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPostsMeta().find((item) => item.slug === slug);

  if (!post) {
    return buildMetadata({
      title: "Post não encontrado",
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
}

function getRelatedPosts(currentSlug: string, tags: string[], max = 3) {
  const allPosts = getAllPostsMeta().filter((p) => p.slug !== currentSlug);
  const currentTagsNormalized = new Set(tags.map(normalizeTag));

  const scored = allPosts.map((p) => {
    const overlap = p.tags.filter((t) => currentTagsNormalized.has(normalizeTag(t))).length;
    return { post: p, score: overlap };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, max)
    .map((s) => s.post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const postMeta = getAllPostsMeta().find((item) => item.slug === slug);

  if (!postMeta) {
    notFound();
  }

  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.frontmatter.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.summary,
    datePublished: post.frontmatter.date,
    url: absoluteUrl(`/blog/${slug}`),
    keywords: post.frontmatter.tags,
    author: {
      "@type": "Person",
      name: "Durand",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "pt-BR",
  };

  return (
    <main
      id="conteudo-principal"
      className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 md:py-18"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 space-y-3 border-b border-neutral-200 pb-8">
        <Link
          href="/blog"
          className="text-sm text-neutral-700 underline underline-offset-4"
        >
          ← Blog
        </Link>

        <h1 className="text-4xl tracking-tight md:text-5xl">
          {post.frontmatter.title}
        </h1>
        <p className="text-sm text-neutral-500">
          {formatDate(post.frontmatter.date)}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <Link
              key={`${slug}-${tag}`}
              href={`/tags/${normalizeTag(tag)}`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <article className="mdx-content">{post.content}</article>

      {relatedPosts.length > 0 && (
        <aside className="mt-16 border-t border-neutral-200 pt-10">
          <h2 className="mb-6 text-lg tracking-tight">Veja também</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
              >
                <p className="text-sm font-medium group-hover:underline">
                  {rp.title}
                </p>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                  {rp.summary}
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  {formatDate(rp.date)}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </main>
  );
}
