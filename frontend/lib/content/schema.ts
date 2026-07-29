import { z } from 'zod';

const calendarDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const requiredStringSchema = z.string().trim().min(1);

const isStrictCalendarDate = (value: string) => {
  const match = calendarDatePattern.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const calendarDateSchema = z.preprocess(
  (value, context) => {
    if (value instanceof Date) {
      context.addIssue({
        code: 'custom',
        message: 'Dates must be quoted YYYY-MM-DD strings',
      });

      return z.NEVER;
    }

    return value;
  },
  z
    .string()
    .refine(isStrictCalendarDate, {
      message: 'Expected a valid YYYY-MM-DD calendar date',
    }),
);

const imagePathSchema = z
  .string()
  .trim()
  .startsWith('/images/', 'Image paths must start with /images/');

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens');

const internalOrExternalHrefSchema = z
  .string()
  .trim()
  .refine((href) => href.startsWith('/') || href.startsWith('https://'), {
    message: 'Href must start with / or https://',
  });

export const postFrontmatterSchema = z
  .object({
    title: requiredStringSchema,
    date: calendarDateSchema,
    updated: calendarDateSchema.optional(),
    excerpt: z.string().trim().min(20).max(220),
    category: requiredStringSchema,
    tags: z.array(z.string().trim().min(1)).min(1),
    featured: z.boolean().default(false),
    sticky: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: imagePathSchema.optional(),
    slug: slugSchema.optional(),
    type: z.enum(['tech', 'essay']).default('tech'),
  })
  .refine(
    ({ date, updated }) => {
      if (!updated) {
        return true;
      }

      return Date.parse(updated) >= Date.parse(date);
    },
    {
      message: 'Updated date must not be earlier than publish date',
      path: ['updated'],
    },
  );

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export const siteSchema = z.object({
  name: requiredStringSchema,
  description: requiredStringSchema,
  url: z.string().trim().url(),
  defaultOgImage: imagePathSchema,
  pageSize: z.number().int().min(1).max(50).default(10),
});

export const authorLinkSchema = z.object({
  label: requiredStringSchema,
  href: internalOrExternalHrefSchema,
});

export const authorSchema = z
  .object({
    name: requiredStringSchema,
    bio: requiredStringSchema,
    skills: z.array(z.string().trim().min(1)).default([]),
    email: z.string().trim().email().optional(),
    links: z.array(authorLinkSchema).default([]),
  })
  .refine(({ email, links }) => Boolean(email) || links.length > 0, {
    message: 'Author requires at least one link or an email',
    path: ['links'],
  });

export const navItemSchema = z.object({
  label: requiredStringSchema,
  href: internalOrExternalHrefSchema,
});

export const footerSchema = z.object({
  copyright: requiredStringSchema,
  icpText: z.string().trim().optional(),
  icpHref: internalOrExternalHrefSchema.optional(),
  links: z.array(authorLinkSchema).default([]),
});

export const projectSchema = z.object({
  name: requiredStringSchema,
  description: requiredStringSchema,
  techStack: z.array(z.string().trim().min(1)).min(1),
  status: z.enum(['active', 'maintained', 'archived', 'planned']),
  featured: z.boolean().default(false),
  sourceUrl: z.string().trim().url().optional(),
  demoUrl: z.string().trim().url().optional(),
  articleUrl: internalOrExternalHrefSchema.optional(),
});
