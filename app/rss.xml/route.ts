import { getAllPostsMeta } from "@/lib/posts";

export function GET() {
  const posts = getAllPostsMeta();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://diarioteq.vercel.app";

  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${escapeXml(post.title)}]]></title>
          <link>${siteUrl}/blog/${post.slug}</link>
          <guid>${siteUrl}/blog/${post.slug}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${escapeXml(post.summary)}]]></description>
        </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>DiárioTeq</title>
      <link>${siteUrl}</link>
      <description>Blog minimalista sobre engenharia de software.</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
