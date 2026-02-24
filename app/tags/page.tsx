import Link from "next/link";

import { getAllTags } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tags",
  description: "Navegação por tags dos posts do DiárioTeq.",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main
      id="conteudo-principal"
      className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 md:py-18"
    >
      <header className="mb-10 space-y-3 border-b border-neutral-200 pb-8">
        <Link
          href="/"
          className="text-sm text-neutral-700 underline underline-offset-4"
        >
          ← Início
        </Link>
        <h1 className="text-4xl tracking-tight">Tags</h1>
      </header>

      <ul className="flex flex-wrap gap-3">
        {tags.map((entry) => (
          <li key={entry.tag}>
            <Link
              href={`/tags/${entry.tag}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
            >
              <span>#{entry.tag}</span>
              <span className="text-neutral-500">({entry.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
