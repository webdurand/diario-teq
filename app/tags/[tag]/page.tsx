import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getPostsByTag } from "@/lib/posts";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((entry) => ({ tag: entry.tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `#${tag} | DiárioTeq`,
    description: `Posts marcados com a tag ${tag}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 md:py-18">
      <header className="mb-10 space-y-3 border-b border-neutral-200 pb-8">
        <Link
          href="/tags"
          className="text-sm text-neutral-700 underline underline-offset-4"
        >
          ← Todas as tags
        </Link>
        <h1 className="text-4xl tracking-tight">#{tag}</h1>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="space-y-1 border-b border-neutral-200 pb-6"
          >
            <p className="text-sm text-neutral-500">{formatDate(post.date)}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-2xl leading-tight hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-neutral-700">{post.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(dateValue));
}
