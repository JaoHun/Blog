import { z } from 'zod';

const dateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Expected a valid date string',
  });

const imagePathSchema = z
  .string()
  .startsWith('/images/', 'Image paths must start with /images/');

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens');

const internalOrExternalHrefSchema = z
  .string()
  .refine((href) => href.startsWith('/') || href.startsWith('https://'), {
    message: 'Href must start with / or https://',
  });

export const postFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    date: dateStringSchema,
    updated: dateStringSchema.optional(),
    excerpt: z.string().trim().min(20).max(220),
    category: z.string().min(1),
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
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  defaultOgImage: imagePathSchema,
  pageSize: z.number().int().positive().default(10),
});

export const authorLinkSchema = z.object({
  label: z.string().min(1),
  href: internalOrExternalHrefSchema,
});

export const authorSchema = z
  .object({
    name: z.string().min(1),
    bio: z.string().min(1),
    email: z.string().email().optional(),
    links: z.array(authorLinkSchema).default([]),
  })
  .refine(({ email, links }) => Boolean(email) || links.length > 0, {
    message: 'Author requires at least one link or an email',
    path: ['links'],
  });

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: internalOrExternalHrefSchema,
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string().trim().min(1)).min(1),
  status: z.enum(['active', 'maintained', 'archived', 'planned']),
  featured: z.boolean().default(false),
  sourceUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  articleUrl: internalOrExternalHrefSchema.optional(),
});
