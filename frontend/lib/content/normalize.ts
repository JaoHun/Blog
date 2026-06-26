import path from 'node:path';

export function slugFromFilePath(filePath: string) {
  return path.basename(filePath, path.extname(filePath));
}

export function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeCategory(value: string) {
  return value.trim();
}

export function normalizeTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)));
}
