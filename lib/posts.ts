import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { remarkTagLinksPlugin } from "@/lib/remark-tag-links";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export type PostMeta = PostFrontmatter & {
  slug: string;
};

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
}

export function getAllPostsMeta(): PostMeta[] {
  const slugs = getPostSlugs();

  const posts = slugs.map((slug) => {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);

    return {
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(slug: string) {
  if (slug.includes('/') || slug.includes('..') || slug.includes('\\')) {
    const { notFound } = await import('next/navigation');
    notFound();
  }
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const tagEntries = getTagEntries();

  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkTagLinksPlugin, { tags: tagEntries }],
        ],
      },
    },
  });

  return {
    slug,
    content,
    frontmatter,
  };
}

export function getAllTags() {
  const tagMap = new Map<string, number>();

  for (const post of getAllPostsMeta()) {
    for (const tag of post.tags) {
      const normalizedTag = normalizeTag(tag);
      tagMap.set(normalizedTag, (tagMap.get(normalizedTag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string) {
  const normalizedTag = normalizeTag(tag);
  return getAllPostsMeta().filter((post) =>
    post.tags.some((postTag) => normalizeTag(postTag) === normalizedTag),
  );
}

export function getTagEntries() {
  const tagMap = new Map<string, string>();

  for (const post of getAllPostsMeta()) {
    for (const tag of post.tags) {
      const normalized = normalizeTag(tag);

      if (!tagMap.has(normalized)) {
        tagMap.set(normalized, tag.trim());
      }
    }
  }

  return Array.from(tagMap.entries()).map(([normalized, value]) => ({
    normalized,
    value,
  }));
}

export function normalizeTag(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}
