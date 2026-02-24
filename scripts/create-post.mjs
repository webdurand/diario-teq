#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const postsDir = path.join(process.cwd(), "content", "posts");

function normalizeSlug(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function resolveTitle() {
  const titleArg = process.argv.slice(2).join(" ").trim();
  if (titleArg) {
    return titleArg;
  }

  const rl = readline.createInterface({ input, output });
  const typedTitle = (await rl.question("Título do post: ")).trim();
  rl.close();
  return typedTitle;
}

async function main() {
  const title = await resolveTitle();

  if (!title) {
    console.error("Título inválido. Use: npm run create -- \"Meu novo post\"");
    process.exit(1);
  }

  const date = getTodayDateString();
  const slug = normalizeSlug(title);

  if (!slug) {
    console.error("Não foi possível gerar slug a partir do título.");
    process.exit(1);
  }

  fs.mkdirSync(postsDir, { recursive: true });

  const filename = `${date}-${slug}.mdx`;
  const filePath = path.join(postsDir, filename);

  if (fs.existsSync(filePath)) {
    console.error(`Arquivo já existe: ${path.relative(process.cwd(), filePath)}`);
    process.exit(1);
  }

  const template = `---
title: "${title}"
date: "${date}"
tags: ["devlog"]
summary: "Resumo curto do conteúdo"
---

## Contexto

## O que fiz hoje

## Aprendizados

## Próximos passos
`;

  fs.writeFileSync(filePath, template, "utf8");

  console.log(`Post criado: ${path.relative(process.cwd(), filePath)}`);
}

main().catch((error) => {
  console.error("Erro ao criar post:", error);
  process.exit(1);
});
