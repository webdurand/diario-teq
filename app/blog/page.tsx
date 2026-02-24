import Link from "next/link";

import { getAllPostsMeta } from "@/lib/posts";

export const metadata = {
  title: "Blog | DiárioTeq",
  description: "Posts sobre engenharia de software, em formato diário.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12">
      <header className="mb-8 space-y-2">
        <Link href="/" className="text-sm underline underline-offset-4">
          ← Início
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      </header>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="space-y-2 border-b pb-6">
            <p className="text-sm text-neutral-500">{formatDate(post.date)}</p>

            <Link
              href={`/blog/${post.slug}`}
              className="text-2xl font-medium leading-tight hover:underline"
            >
              {post.title}
            </Link>

            <p className="text-neutral-700">{post.summary}</p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={`${post.slug}-${tag}`}
                  href={`/tags/${tag}`}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-100"
                >
                  #{tag}
                </Link>
              ))}
            </div>
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
