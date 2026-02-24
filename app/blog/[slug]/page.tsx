import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllPostsMeta,
  getPostBySlug,
  getPostSlugs,
  normalizeTag,
} from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

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

  return (
    <main
      id="conteudo-principal"
      className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 md:py-18"
    >
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
    </main>
  );
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(dateValue));
}
