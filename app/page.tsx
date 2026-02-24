import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  description:
    "Posts diários sobre engenharia de software, IA e construção de produtos.",
  path: "/",
});

export default function Home() {
  const latestPosts = getAllPostsMeta().slice(0, 5);

  return (
    <main
      id="conteudo-principal"
      className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-14 md:py-18"
    >
      <header className="space-y-3 border-b border-neutral-200 pb-8">
        <h1 className="text-4xl tracking-tight md:text-5xl">DiárioTeq</h1>
        <p className="text-neutral-600">
          Escrever → salvar → commit → publicado.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Posts recentes</h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-700 underline underline-offset-4"
          >
            Ver todos
          </Link>
        </div>

        <ul className="space-y-6">
          {latestPosts.map((post) => (
            <li
              key={post.slug}
              className="space-y-1 border-b border-neutral-200 pb-5"
            >
              <p className="text-sm text-neutral-500">
                {formatDate(post.date)}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xl leading-tight hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-neutral-700">{post.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(dateValue));
}
