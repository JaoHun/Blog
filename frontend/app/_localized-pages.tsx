import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { mdxComponents } from '@/components/post/MdxComponents';
import { MomentCard } from '@/components/post/MomentCard';
import { PostList } from '@/components/post/PostList';
import { PostMeta } from '@/components/post/PostMeta';
import { PostToc } from '@/components/post/PostToc';
import { ProjectList } from '@/components/project/ProjectList';
import { SearchBox } from '@/components/search/SearchBox';
import { ContentSidebar } from '@/components/sidebar/ContentSidebar';
import { ContentWithSidebar } from '@/components/sidebar/ContentWithSidebar';
import { HomeSidebar } from '@/components/sidebar/HomeSidebar';
import { authorConfig, getAuthorBio } from '@/config/author';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import {
  getAdjacentPosts,
} from '@/lib/content/relations';
import {
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getPostsByType,
  getPublishedPosts,
} from '@/lib/content/posts';
import type { Lang } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';
import { ExternalLink } from '@/components/common/ExternalLink';

type PaginationParams = {
  pagination: string[];
};

function getPostStats(posts: Awaited<ReturnType<typeof getPublishedPosts>>) {
  return {
    categories: new Set(posts.map((post) => post.category)).size,
    posts: posts.length,
    tags: new Set(posts.flatMap((post) => post.tags)).size,
  };
}

export async function HomePage({ lang }: { lang: Lang }) {
  const posts = await getPublishedPosts(lang);
  const stats = getPostStats(posts);
  const recentPosts = posts.slice(0, 2);
  const t = messages[lang];

  return (
    <ContentWithSidebar sidebar={<HomeSidebar lang={lang} stats={stats} />}>
      <div className="space-y-8 sm:space-y-10">
        <section className="flex min-h-[34vh] flex-col justify-center gap-5 rounded-lg border border-border bg-background/55 p-6 shadow-sm sm:min-h-[38vh] sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.home.heading}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">{t.home.description}</p>
        </section>

        <section className="rounded-lg border border-border bg-background/70 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{t.home.recentTitle}</h2>
              <p className="mt-2 leading-7 text-muted">{t.home.recentDescription}</p>
            </div>
            <Link className="text-sm text-link" href={localizedPath('/posts', lang)}>
              {t.common.allPosts}
            </Link>
          </div>
          <div className="grid gap-3">
            {recentPosts.map((post) => (
              <Link
                className="rounded-md border border-border bg-background/60 p-4 transition hover:border-accent hover:shadow-sm"
                href={localizedPath(`/posts/${post.slug}`, lang)}
                key={post.slug}
              >
                <p className="text-xs text-muted">{post.category}</p>
                <h3 className="mt-2 font-semibold">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Link
            className="rounded-lg border border-border bg-background/70 p-6 shadow-sm transition hover:border-accent hover:shadow-md"
            href={localizedPath('/moments', lang)}
          >
            <span className="text-sm font-medium uppercase tracking-[0.16em] text-muted">{siteConfig.name}</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{t.home.momentsTitle}</h2>
            <p className="mt-3 leading-7 text-muted">{t.home.momentsDescription}</p>
            <span className="mt-5 inline-block text-sm text-link">{t.home.momentsAction}</span>
          </Link>
          <Link
            className="rounded-lg border border-border bg-background/70 p-6 shadow-sm transition hover:border-accent hover:shadow-md"
            href={localizedPath('/tech', lang)}
          >
            <span className="text-sm font-medium uppercase tracking-[0.16em] text-muted">{siteConfig.name}</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{t.home.techTitle}</h2>
            <p className="mt-3 leading-7 text-muted">{t.home.techDescription}</p>
            <span className="mt-5 inline-block text-sm text-link">{t.home.techAction}</span>
          </Link>
        </section>
      </div>
    </ContentWithSidebar>
  );
}

export async function MomentsPage({ lang }: { lang: Lang }) {
  const posts = await getPostsByType('essay', lang);
  const t = messages[lang].moments;

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{t.description}</p>
      </div>
      {posts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <MomentCard key={post.slug} lang={lang} post={post} />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
          <Link className="inline-block text-sm text-link" href={localizedPath('/posts', lang)}>
            {messages[lang].common.browseAllPosts}
          </Link>
        </div>
      )}
    </section>
  );
}

export async function TechPage({ lang }: { lang: Lang }) {
  const [featuredPosts, posts] = await Promise.all([getFeaturedPosts(lang), getPublishedPosts(lang)]);
  const latestPosts = posts.slice(0, 3);
  const t = messages[lang];

  return (
    <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
      <div className="space-y-14">
        <section className="flex min-h-[30vh] flex-col justify-center gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.tech.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">{t.tech.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-link">
            <Link href={localizedPath('/posts', lang)}>{t.common.browsePosts}</Link>
            <Link href={localizedPath('/projects', lang)}>{t.common.viewProjects}</Link>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">{t.common.featuredPosts}</h2>
            <Link className="text-sm text-link" href={localizedPath('/posts', lang)}>
              {t.common.allPosts}
            </Link>
          </div>
          <PostList lang={lang} posts={featuredPosts.length > 0 ? featuredPosts : latestPosts} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">{t.common.featuredProjects}</h2>
            <Link className="text-sm text-link" href={localizedPath('/projects', lang)}>
              {t.common.allProjects}
            </Link>
          </div>
          <ProjectList featuredOnly lang={lang} />
        </section>
      </div>
    </ContentWithSidebar>
  );
}

export async function PostsPage({ lang }: { lang: Lang }) {
  const posts = await getPublishedPosts(lang);
  const page = paginate(posts, 1, siteConfig.pageSize);
  const t = messages[lang].posts;

  return (
    <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
      <section>
        <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-muted">{t.description}</p>
        </div>
        <SearchBox lang={lang} />
        <PostList lang={lang} posts={page.items} />
        <Pagination basePath={localizedPath('/posts', lang)} currentPage={page.currentPage} totalPages={page.totalPages} />
      </section>
    </ContentWithSidebar>
  );
}

export async function PaginatedPostsPage({ lang, pagination }: { lang: Lang } & PaginationParams) {
  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const posts = await getPublishedPosts(lang);
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);

  return (
    <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{messages[lang].posts.title}</h1>
          <p className="mt-3 text-muted">{messages[lang].common.page.replace('{page}', String(page.currentPage))}</p>
        </div>
        <PostList lang={lang} posts={page.items} />
        <Pagination basePath={localizedPath('/posts', lang)} currentPage={page.currentPage} totalPages={page.totalPages} />
      </section>
    </ContentWithSidebar>
  );
}

export async function CategoriesPage({ lang }: { lang: Lang }) {
  const posts = await getPublishedPosts(lang);
  const counts = new Map<string, number>();

  posts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{messages[lang].nav.categories}</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2" data-testid="category-list">
        {Array.from(counts.entries()).map(([category, count]) => (
          <Link
            className="rounded-lg border border-border bg-background/72 p-5 shadow-sm transition hover:border-accent hover:shadow-md"
            href={localizedPath(`/categories/${routeSegment(category)}`, lang)}
            key={category}
          >
            <span className="text-lg font-semibold">{category}</span>
            <span className="mt-2 block text-sm text-muted">{messages[lang].common.postCount(count)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function CategoryPage({ category, lang }: { category: string; lang: Lang }) {
  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory, lang);
  const page = paginate(posts, 1, siteConfig.pageSize);
  const basePath = localizedPath(`/categories/${routeSegment(decodedCategory)}`, lang);

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{messages[lang].nav.categories}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{decodedCategory}</h1>
        <p className="mt-3 text-muted">{messages[lang].common.postCount(posts.length)}</p>
      </div>
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}

export async function PaginatedCategoryPage({
  category,
  lang,
  pagination,
}: { category: string; lang: Lang } & PaginationParams) {
  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory, lang);
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);
  const basePath = localizedPath(`/categories/${routeSegment(decodedCategory)}`, lang);

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{messages[lang].nav.categories}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{decodedCategory}</h1>
        <p className="mt-3 text-muted">{messages[lang].common.page.replace('{page}', String(page.currentPage))}</p>
      </div>
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}

export async function TagsPage({ lang }: { lang: Lang }) {
  const posts = await getPublishedPosts(lang);
  const counts = new Map<string, number>();

  posts.flatMap((post) => post.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{messages[lang].nav.tags}</h1>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-background/72 p-5 shadow-sm" data-testid="tag-list">
        {Array.from(counts.entries()).map(([tag, count]) => (
          <Link
            className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm transition hover:border-accent hover:shadow-sm"
            href={localizedPath(`/tags/${routeSegment(tag)}`, lang)}
            key={tag}
          >
            #{tag} <span className="text-muted">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function TagPage({ lang, tag }: { lang: Lang; tag: string }) {
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag, lang);
  const page = paginate(posts, 1, siteConfig.pageSize);
  const basePath = localizedPath(`/tags/${routeSegment(decodedTag)}`, lang);

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{messages[lang].nav.tags}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">#{decodedTag}</h1>
        <p className="mt-3 text-muted">{messages[lang].common.postCount(posts.length)}</p>
      </div>
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}

export async function PaginatedTagPage({
  lang,
  pagination,
  tag,
}: { lang: Lang; tag: string } & PaginationParams) {
  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag, lang);
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);
  const basePath = localizedPath(`/tags/${routeSegment(decodedTag)}`, lang);

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{messages[lang].nav.tags}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">#{decodedTag}</h1>
        <p className="mt-3 text-muted">{messages[lang].common.page.replace('{page}', String(page.currentPage))}</p>
      </div>
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}

export function AboutPage({ lang }: { lang: Lang }) {
  const t = messages[lang].about;

  return (
    <div className="grid max-w-4xl gap-5" data-testid="about-layout">
      <section className="rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{t.title}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{authorConfig.name}</h1>
        <p className="mt-5 leading-8 text-muted">{getAuthorBio(lang)}</p>
      </section>
      <section className="rounded-lg border border-border bg-background/72 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.skills}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {authorConfig.skills.map((skill) => (
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-border bg-background/72 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.contact}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-link">
          {authorConfig.links.map((link) => (
            <ExternalLink href={link.href} key={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProjectsPage({ lang }: { lang: Lang }) {
  const t = messages[lang].projects;

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 text-muted">{t.description}</p>
      </div>
      <ProjectList lang={lang} />
    </section>
  );
}

export async function PostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const [post, posts] = await Promise.all([getPostBySlug(slug, lang), getPublishedPosts(lang)]);

  if (!post) {
    notFound();
  }

  const adjacent = getAdjacentPosts(posts, post.slug);
  const t = messages[lang].posts;

  return (
    <ContentWithSidebar
      sidebar={
        <ContentSidebar lang={lang}>
          <PostToc headings={post.headings} lang={lang} variant="embedded" />
        </ContentSidebar>
      }
    >
      <article className="mx-auto max-w-3xl rounded-lg border border-border bg-background/72 p-5 shadow-sm sm:p-8">
      <div className="min-w-0">
        <Link className="text-sm text-link" href={localizedPath('/posts', lang)}>
          {t.back}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{post.excerpt}</p>
        <PostMeta lang={lang} post={post} />
        <div className="post-content mt-8 sm:mt-10">
          <MDXRemote components={mdxComponents} source={post.body} />
        </div>
        <nav aria-label={lang === 'zh' ? '文章切换' : 'Post navigation'} className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {adjacent.previous ? (
            <Link className="rounded-md border border-border bg-background/60 p-4 transition hover:border-accent hover:shadow-sm" href={localizedPath(`/posts/${adjacent.previous.slug}`, lang)}>
              <span className="text-sm text-muted">{t.previous}</span>
              <span className="mt-2 block font-medium text-link">{adjacent.previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link className="rounded-md border border-border bg-background/60 p-4 transition hover:border-accent hover:shadow-sm sm:text-right" href={localizedPath(`/posts/${adjacent.next.slug}`, lang)}>
              <span className="text-sm text-muted">{t.next}</span>
              <span className="mt-2 block font-medium text-link">{adjacent.next.title}</span>
            </Link>
          ) : null}
        </nav>
      </div>
      </article>
    </ContentWithSidebar>
  );
}
