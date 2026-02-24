type TagEntry = {
  value: string;
  normalized: string;
};

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
};

type PluginOptions = {
  tags: TagEntry[];
};

const SKIP_NODE_TYPES = new Set([
  "link",
  "linkReference",
  "definition",
  "code",
  "inlineCode",
  "html",
]);

const WORD_CHAR_REGEX = /[\p{L}\p{N}]/u;

export function remarkTagLinksPlugin(options: PluginOptions) {
  const tags = [...options.tags].sort((a, b) => {
    const byWordCount = countWords(b.value) - countWords(a.value);
    if (byWordCount !== 0) {
      return byWordCount;
    }

    return b.value.length - a.value.length;
  });

  return function transformer(tree: MdNode) {
    walk(tree, tags);
  };
}

function walk(node: MdNode, tags: TagEntry[]) {
  if (!node.children || node.children.length === 0) {
    return;
  }

  const nextChildren: MdNode[] = [];

  for (const child of node.children) {
    if (child.type === "text" && typeof child.value === "string") {
      nextChildren.push(...splitTextIntoNodes(child.value, tags));
      continue;
    }

    if (!SKIP_NODE_TYPES.has(child.type)) {
      walk(child, tags);
    }

    nextChildren.push(child);
  }

  node.children = nextChildren;
}

function splitTextIntoNodes(text: string, tags: TagEntry[]) {
  const nodes: MdNode[] = [];
  let cursor = 0;
  let plainTextStart = 0;

  while (cursor < text.length) {
    const match = findBestTagMatch(text, cursor, tags);

    if (!match) {
      cursor += 1;
      continue;
    }

    if (match.start > plainTextStart) {
      nodes.push({
        type: "text",
        value: text.slice(plainTextStart, match.start),
      });
    }

    nodes.push({
      type: "link",
      url: `/tags/${match.normalized}`,
      children: [{ type: "text", value: text.slice(match.start, match.end) }],
    });

    cursor = match.end;
    plainTextStart = match.end;
  }

  if (plainTextStart < text.length) {
    nodes.push({ type: "text", value: text.slice(plainTextStart) });
  }

  return nodes;
}

function findBestTagMatch(text: string, index: number, tags: TagEntry[]) {
  const haystack = text.toLocaleLowerCase("pt-BR");

  for (const tag of tags) {
    const needle = tag.value.toLocaleLowerCase("pt-BR");

    if (!haystack.startsWith(needle, index)) {
      continue;
    }

    const start = index;
    const end = index + needle.length;
    const before = start > 0 ? text[start - 1] : "";
    const after = end < text.length ? text[end] : "";

    if (isWordChar(before) || isWordChar(after)) {
      continue;
    }

    return { start, end, normalized: tag.normalized };
  }

  return null;
}

function countWords(value: string) {
  return value.trim().split(/\s+/).length;
}

function isWordChar(value: string) {
  return value.length > 0 && WORD_CHAR_REGEX.test(value);
}