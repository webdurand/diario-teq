# DiárioTeq (V0)

Blog minimalista para documentar diariamente sua jornada como engenheiro de software.

## Stack

- Next.js (App Router)
- MDX versionado no próprio repositório
- Deploy serverless (Vercel)
- Sem banco de dados
- Sem autenticação
- Sem CMS externo

## Estrutura

```txt
content/
  posts/
    2026-02-23-primeiro-dia.mdx
app/
  blog/page.tsx
  blog/[slug]/page.tsx
  tags/page.tsx
  tags/[tag]/page.tsx
  rss.xml/route.ts
  sitemap.ts
lib/
  posts.ts
```

## Frontmatter padrão

```mdx
---
title: "Título do post"
date: "2026-02-23"
tags: ["nextjs", "devlog"]
summary: "Resumo curto do conteúdo"
---
```

## Fluxo de publicação

1. Criar arquivo `.mdx` em `content/posts` (sugestão: `YYYY-MM-DD-slug.mdx`)
2. Escrever conteúdo
3. `git add . && git commit -m "post: novo devlog"`
4. Push para branch conectada na Vercel
5. Deploy automático publica o post

## Rodar local

```bash
npm install
npm run dev
```

## Deploy

Defina `NEXT_PUBLIC_SITE_URL` com seu domínio final para gerar links corretos no RSS e sitemap.
