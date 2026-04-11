import { ImageResponse } from "next/og";

import { getAllPostsMeta } from "@/lib/posts";

export const alt = "DiárioTeq - post do blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllPostsMeta().find((p) => p.slug === slug);

  const title = post?.title ?? "Post não encontrado";
  const tags = post?.tags ?? [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 28,
          opacity: 0.7,
        }}
      >
        DiárioTeq
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 980,
        }}
      >
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 20,
                  color: "#94a3b8",
                  border: "1px solid #334155",
                  borderRadius: 999,
                  padding: "6px 16px",
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    size,
  );
}
