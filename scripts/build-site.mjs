import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(root, "README.md");
const sitePath = join(root, "site");
const outputPath = join(root, "dist");
const checkOnly = process.argv.includes("--check");

const sectionTypes = new Map([
  ["Research papers", "paper"],
  ["Blogs", "blog"],
  ["Books", "book"],
  ["Code and notebooks", "code"],
]);

const typeLabels = {
  paper: "Research paper",
  blog: "Blog",
  book: "Book",
  code: "Code & notebook",
};

const defaultTopics = {
  paper: "Research papers",
  blog: "Blogs",
  book: "AI and data platforms",
  code: "Code and notebooks",
};

const minimumCounts = {
  paper: 18,
  blog: 37,
  book: 1,
  code: 4,
};

function parseTableRow(line) {
  if (!line.startsWith("|") || !line.endsWith("|")) {
    return [];
  }

  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function stripInlineMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

function canonicalUrl(value) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString();
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseResources(markdown) {
  const resources = [];
  let currentType = null;
  let currentTopic = null;

  for (const [lineIndex, line] of markdown.split(/\r?\n/).entries()) {
    if (line.startsWith("## ")) {
      currentType = sectionTypes.get(line.slice(3).trim()) ?? null;
      currentTopic = currentType ? defaultTopics[currentType] : null;
      continue;
    }

    if (currentType && line.startsWith("### ")) {
      currentTopic = line.slice(4).trim();
      continue;
    }

    if (!currentType || !currentTopic || !line.startsWith("| [")) {
      continue;
    }

    const cells = parseTableRow(line);
    const link = cells[0]?.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);

    if (!link) {
      throw new Error(`Could not parse resource link on README line ${lineIndex + 1}`);
    }

    const [, title, url] = link;
    let tags = [];
    let summary = "";

    if (currentType === "paper") {
      if (cells.length !== 2) {
        throw new Error(`Expected 2 paper columns on README line ${lineIndex + 1}`);
      }
      summary = stripInlineMarkdown(cells[1]);
    } else if (currentType === "code") {
      if (cells.length !== 2) {
        throw new Error(`Expected 2 code columns on README line ${lineIndex + 1}`);
      }
      tags = [...cells[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      summary = "A hands-on code or notebook example for exploring the lakehouse stack.";
    } else {
      if (cells.length !== 3) {
        throw new Error(`Expected 3 ${currentType} columns on README line ${lineIndex + 1}`);
      }
      tags = [...cells[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      summary = stripInlineMarkdown(cells[2]);
    }

    resources.push({
      id: `${slugify(title)}-${resources.length + 1}`,
      type: currentType,
      typeLabel: typeLabels[currentType],
      topic: currentTopic,
      title,
      url,
      summary,
      tags,
    });
  }

  return resources;
}

function validateResources(resources) {
  const counts = Object.fromEntries(
    Object.keys(minimumCounts).map((type) => [
      type,
      resources.filter((resource) => resource.type === type).length,
    ]),
  );

  for (const [type, minimum] of Object.entries(minimumCounts)) {
    if (counts[type] < minimum) {
      throw new Error(`Expected at least ${minimum} ${type} resources; found ${counts[type]}`);
    }
  }

  const seen = new Map();
  for (const resource of resources) {
    const canonical = canonicalUrl(resource.url);
    if (seen.has(canonical)) {
      throw new Error(
        `Duplicate URL for "${resource.title}" and "${seen.get(canonical)}": ${resource.url}`,
      );
    }
    seen.set(canonical, resource.title);
  }

  return counts;
}

const markdown = await readFile(readmePath, "utf8");
const resources = parseResources(markdown);
const counts = validateResources(resources);

if (!checkOnly) {
  await rm(outputPath, { recursive: true, force: true });
  await mkdir(join(outputPath, "assets"), { recursive: true });

  await Promise.all([
    copyFile(join(sitePath, "index.html"), join(outputPath, "index.html")),
    copyFile(join(sitePath, "styles.css"), join(outputPath, "assets", "styles.css")),
    copyFile(join(sitePath, "app.js"), join(outputPath, "assets", "app.js")),
    copyFile(join(root, "lkh_res.png"), join(outputPath, "assets", "lakehouse-architecture.png")),
    writeFile(join(outputPath, "resources.json"), `${JSON.stringify(resources, null, 2)}\n`),
    writeFile(join(outputPath, ".nojekyll"), ""),
  ]);
}

const countSummary = Object.entries(counts)
  .map(([type, count]) => `${count} ${type}${count === 1 ? "" : "s"}`)
  .join(", ");

console.log(`${checkOnly ? "Validated" : "Built"} ${resources.length} resources (${countSummary}).`);
