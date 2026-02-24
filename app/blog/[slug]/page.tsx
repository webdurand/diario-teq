import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPostsMeta, getPostBySlug, getPostSlugs } from "@/lib/posts";

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
    return {
      title: "Post não encontrado | DiárioTeq",
    };
  }

  return {
    title: `${post.title} | DiárioTeq`,
    description: post.summary,
  };
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
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12">
      <header className="mb-8 space-y-3 border-b pb-6">
        <Link href="/blog" className="text-sm underline underline-offset-4">
          ← Blog
        </Link>

        <h1 className="text-4xl font-semibold tracking-tight">{post.frontmatter.title}</h1>
        <p className="text-sm text-neutral-500">{formatDate(post.frontmatter.date)}</p>

        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <Link
              key={`${slug}-${tag}`}
              href={`/tags/${tag}`}
              className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-100"
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
