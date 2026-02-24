import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export default function Home() {
  const latestPosts = getAllPostsMeta().slice(0, 5);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">DiárioTeq</h1>
        <p className="text-neutral-600">
          Escrever → salvar → commit → publicado.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Posts recentes</h2>
          <Link href="/blog" className="text-sm underline underline-offset-4">
            Ver todos
          </Link>
        </div>

        <ul className="space-y-4">
          {latestPosts.map((post) => (
            <li key={post.slug} className="border-b pb-4">
              <p className="text-sm text-neutral-500">{formatDate(post.date)}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-medium hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-neutral-700">{post.summary}</p>
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
