import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://diarioteq.vercel.app";

export const siteConfig = {
  name: "DiárioTeq",
  description:
    "Blog minimalista para documentar a jornada diária em engenharia de software.",
  url: siteUrl,
  locale: "pt_BR",
};

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  imagePath?: string;
};

export function absoluteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedBase = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  if (normalizedPath === "/") {
    return `${normalizedBase}/`;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  tags,
  imagePath = "/opengraph-image",
}: BuildMetadataInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - prévia do conteúdo`,
        },
      ],
      publishedTime,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    keywords: tags,
  };
}