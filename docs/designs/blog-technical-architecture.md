# 个人技术博客 MVP 技术架构设计

## 1. 技术栈选型

- 前端框架：Next.js
- 内容格式：MDX
- 样式方案：建议 Tailwind CSS + CSS 变量
- 内容解析：构建时读取 MDX Frontmatter
- Frontmatter 校验：建议 Zod
- 代码高亮：建议 Shiki
- 搜索方案：构建时生成轻量搜索索引，客户端执行搜索
- 部署方式：静态托管，优先 Vercel / Cloudflare Pages，兼容 GitHub Pages
- 数据存储：无数据库，MDX + 配置文件作为数据源

## 2. 推荐目录结构

```text
frontend/
  app/
    page.tsx
    posts/
      page.tsx
      [...pagination]/
        page.tsx
      [slug]/
        page.tsx
    categories/
      page.tsx
      [category]/
        page.tsx
        [...pagination]/
          page.tsx
    tags/
      page.tsx
      [tag]/
        page.tsx
        [...pagination]/
          page.tsx
    about/
      page.tsx
    projects/
      page.tsx
  content/
    posts/
      example-post.mdx
  config/
    site.ts
    author.ts
    footer.ts
    nav.ts
    projects.ts
  lib/
    content/
      posts.ts
      parser.ts
      schema.ts
      normalize.ts
      relations.ts
      search.ts
      rss.ts
      sitemap.ts
    seo/
      metadata.ts
  components/
    layout/
    post/
    search/
    theme/
    project/
    common/
  public/
    images/
      posts/
      avatar/
      projects/
```

## 3. 路由生成规则

建议使用明确、可静态生成的路由：

```text
/
/posts
/posts/page/[page]
/posts/[slug]
/categories
/categories/[category]
/categories/[category]/page/[page]
/tags
/tags/[tag]
/tags/[tag]/page/[page]
/about
/projects
/rss.xml
/rss.en.xml
/sitemap.xml
/robots.txt
```

规则：

- 文章详情路由使用 `slug`，默认由文件名生成，也允许 Frontmatter 显式声明 `slug`。
- `slug` 必须唯一，重复时构建失败。
- 分类、标签路由需要做 URL 安全转换。中文分类和标签可以保留展示名，但路由应使用稳定 slug 或编码后的安全路径。
- 分页在构建阶段生成，默认每页数量可配置，如 `pageSize: 10`。
- 当前实现使用 Next.js catch-all 分页目录 `app/posts/[...pagination]`、`app/categories/[category]/[...pagination]`、`app/tags/[tag]/[...pagination]`，对外 URL 仍保持 `/posts/page/[page]`、`/categories/[category]/page/[page]`、`/tags/[tag]/page/[page]`。
- `/posts`、`/categories/[category]`、`/tags/[tag]` 等价于第一页。由于 `output: "export"` 下动态 catch-all 路由不能返回空静态参数集合，当前实现会生成 `/page/1` 兼容入口，以保证只有 1 页内容时仍可完成静态导出。
- `/categories` 和 `/tags` 为总览页，展示全部分类/标签及文章数量。
- 分类详情页、标签详情页无内容时不生成。
- 草稿文章不参与生产环境路由生成。
- `/posts` 是全量文章浏览入口，必须支持分页、分类筛选、标签筛选和关键词搜索；筛选和搜索在客户端完成，不额外生成组合筛选 URL。

## 4. 静态导出约束

如果要兼容 GitHub Pages，需要满足静态导出约束：

- 不使用 SSR。
- 不使用运行时 API Routes 承担核心功能。
- 不使用 Server Actions。
- 不依赖 Node.js 运行时处理请求。
- 所有动态路由必须通过构建时枚举生成。
- 搜索、筛选、主题切换在客户端完成。
- RSS、Sitemap、`robots.txt` 在构建时输出为静态文件。
- 图片优化不能依赖 Next.js 运行时图片服务。

部署目标约束：

- Vercel / Cloudflare Pages：首选部署目标，Next.js 支持更完整。
- GitHub Pages：兼容目标，需要开启静态导出模式，并避免依赖运行时能力。

GitHub Pages 的 `next.config` 策略：

```js
const isGithubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repoName = process.env.GITHUB_PAGES_REPO || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGithubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubPages && repoName ? `/${repoName}/` : '',
};

module.exports = nextConfig;
```

约束：

- Vercel / Cloudflare Pages 可不设置 `basePath` 和 `assetPrefix`。
- 仅部署到 GitHub Pages 项目页路径时启用 `basePath` 和 `assetPrefix`。
- 使用 GitHub Pages 时，站内链接、图片路径、canonical、Sitemap URL 必须统一读取站点配置，避免硬编码根路径。

## 5. Frontmatter 校验规则

建议使用 Zod 等 schema 校验工具，在构建时统一校验文章元数据。

必填字段：

```yaml
title: string
date: string
excerpt: string
category: string
tags: string[]
```

可选字段：

```yaml
slug?: string
updated?: string
featured?: boolean
sticky?: boolean
draft?: boolean
cover?: string
type?: "tech" | "essay"
```

校验规则：

- `title` 非空。
- `date` 必须是合法日期。
- `updated` 如果存在，不能早于 `date`。
- `excerpt` 非空，建议限制长度，如 50-200 字。
- `category` 单值非空。
- `tags` 至少一个，自动去重。
- `slug` 只能包含安全字符，建议使用小写字母、数字和短横线。
- `cover` 如果存在，必须指向允许的静态资源路径。
- `draft` 默认 `false`。
- `featured`、`sticky` 默认 `false`。
- 生产构建时 `draft: true` 的文章不进入页面、搜索、RSS、Sitemap。
- 项目统一使用 `updated` 作为更新时间字段，避免内容模型出现双命名。

配置文件校验：

- `site.ts` 必须包含 `name`、`description`、`url`、`defaultOgImage`。
- `author.ts` 必须包含 `name`、`bio`，并至少包含一个联系方式或社交链接。
- `nav.ts` 的每个导航项必须包含 `label` 和 `href`，`href` 必须指向 MVP 已生成路由或合法外链。
- `projects.ts` 的每个项目必须包含 `name`、`description`、`techStack`、`status`，外链字段如存在必须是合法 URL。
- 配置校验失败必须阻断构建。

## 6. 内容构建脚本

内容处理逻辑应集中在独立内容管线中，不放入页面组件。

建议模块：

```text
lib/content/
  posts.ts          # 读取文章、排序、过滤
  parser.ts         # 解析 MDX 和 Frontmatter
  schema.ts         # Frontmatter schema
  normalize.ts      # slug/category/tags/date 归一化
  relations.ts      # 上一篇/下一篇
  search.ts         # 搜索索引生成
  rss.ts            # RSS 数据生成
  sitemap.ts        # Sitemap 数据生成
  robots.ts         # robots.txt 数据生成
  config-schema.ts  # 站点配置 schema
```

构建流程：

- `getAllPosts({ includeDrafts })`
- `validatePostFrontmatter()`
- `normalizePost()`
- `getPublishedPosts()`
- `getFeaturedPosts()`
- `getPostsByCategory()`
- `getPostsByTag()`
- `buildSearchIndex()`
- `buildRssFeed()`
- `buildSitemapEntries()`
- `buildRobotsTxt()`
- `validateSiteConfig()`

建议提供校验命令：

```text
pnpm content:check
```

检查内容：

- Frontmatter 是否完整。
- slug 是否重复。
- 分类/标签是否为空。
- 图片路径是否存在。
- 站点、作者、导航、项目配置是否完整。
- 生产环境是否错误包含草稿。

## 7. 构建时内容管线

```text
读取 MDX 文件
→ 解析 Frontmatter
→ 校验必填字段
→ 根据环境过滤草稿
→ 归一化 category / tags
→ 计算阅读时间
→ 生成 slug
→ 读取摘要
→ 计算上一篇 / 下一篇
→ 生成文章列表、分类索引、标签索引
→ 生成搜索索引、RSS、Sitemap、robots.txt
→ 静态页面生成
```

## 8. 页面生成策略

- 首页：静态生成，读取精选文章、最新文章、精选项目。
- 文章列表页：静态生成，支持分页；搜索在客户端执行。
- 文章详情页：基于 slug 静态生成。
- 分类总览页：静态生成，展示全部分类及文章数量。
- 分类详情页：按已有分类静态生成。
- 标签总览页：静态生成，展示全部标签及文章数量。
- 标签详情页：按已有标签静态生成。
- 关于页：静态页面，读取作者配置。
- 项目页：静态页面，读取项目配置。
- RSS / Sitemap / robots：构建时输出为静态文件。

RSS、Sitemap、robots 的静态生成方式：

- 推荐使用 `prebuild` 构建脚本在 `next build` 前生成静态文件到 `public/`，再由 Next.js 静态构建流程复制到最终产物。
- `rss.xml` 由中文生产文章集合生成，`rss.en.xml` 由英文生产文章集合生成，字段包含标题、链接、摘要、发布时间、更新时间。
- `sitemap.xml` 由站点固定页面、文章详情页、分类总览/详情页、标签总览/详情页生成。
- `robots.txt` 由站点配置生成，至少包含 `User-agent`、`Allow` 和 `Sitemap`。
- 三类文件必须读取同一份生产文章集合，确保草稿过滤规则一致。

## 9. 客户端能力边界

客户端只承担轻交互：

- 主题切换。
- 客户端搜索。
- 搜索结果高亮。
- 复制代码。
- 回到顶部。
- TOC 滚动定位或高亮。

客户端不承担：

- 文章数据持久化。
- 用户状态。
- 评论。
- 统计。
- 权限。
- 后台发布。

## 10. 搜索索引规则

搜索索引字段：

```ts
type SearchIndexItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updated?: string;
  type?: 'tech' | 'essay';
};
```

规则：

- 搜索索引只包含生产可见文章，必须排除草稿。
- MVP 索引不包含完整正文，避免静态 JSON 体积过大。
- 客户端搜索匹配 `title`、`excerpt`、`category`、`tags`。
- 搜索高亮在客户端根据用户输入实时生成，不写入索引文件。
- 索引文件建议控制在 200 KB 以内；超过后应评估分片、压缩或接入高级搜索服务。
- 搜索索引必须与文章列表、RSS、Sitemap 使用同一套草稿过滤结果。

## 11. 图片和 SEO 细节

图片规则：

- 文章图片建议放在 `public/images/posts/<slug>/`。
- 文章封面路径示例：`/images/posts/nextjs-static-blog/cover.png`。
- MDX 图片必须提供 alt。
- 大图应压缩后提交，避免原图直传。
- 纯静态导出时谨慎使用依赖服务端优化的图片能力。
- 如果使用 `next/image`，需要确认部署平台支持；GitHub Pages 场景可退回普通 `img` + `loading="lazy"`。

SEO 规则：

- 每篇文章生成唯一 canonical。
- `title` 组合规则建议为：`文章标题 | 站点名`。
- `description` 默认使用 `excerpt`。
- Open Graph 图片优先使用文章 `cover`，没有则使用站点默认 OG 图。
- Sitemap 排除草稿。
- RSS 排除草稿。
- 分类页、标签页需要独立 title 和 description。
- 搜索结果页如果是客户端状态，不单独生成可索引 URL。

## 12. SEO 架构

每个页面生成基础 metadata：

- title。
- description。
- canonical。
- Open Graph。
- Twitter Card 可选。
- article published / modified 信息。
- 图片 alt 和文章封面信息。

站点级资源：

- `robots.txt`。
- `sitemap.xml`。
- `rss.xml`。
- `rss.en.xml`。

## 13. 主题架构

采用 CSS 变量：

- `--background`
- `--foreground`
- `--muted`
- `--border`
- `--link`
- `--code-bg`
- `--code-fg`
- `--accent`

主题策略：

- 默认跟随系统 `prefers-color-scheme`。
- 用户手动选择后写入 `localStorage`。
- 页面初始化时避免明显闪烁。
- 代码高亮需同时适配浅色和深色。

## 14. MDX 安全边界

MVP 规则：

- MDX 只用于本地可信内容，不开放外部用户投稿。
- 不支持运行时上传 MDX。
- 不从远程拉取未审核 MDX 并直接编译。
- MDX 可使用的组件必须通过白名单注册。
- 禁止在 MDX 中直接使用不受控脚本。
- 外链默认加 `rel="noopener noreferrer"`。
- 代码块只作为文本渲染，不执行。
- 后续如果接 Headless CMS，需要重新设计 MDX 安全策略。

允许组件示例：

- `Callout`
- `PostImage`
- `ProjectCard`
- `CodeBlock`
- `ExternalLink`

MVP 不开放：

- 任意 iframe。
- 任意 script。
- 动态远程组件。
- 用户提交的 MDX。

## 15. 部署差异

Vercel：

- 最适合 Next.js。
- 可使用更多 Next.js 能力。
- 静态站部署简单。
- 后续如要加 API 或轻后端扩展较方便。

Cloudflare Pages：

- 静态部署体验好。
- 需要关注 Next.js 适配方式。
- 后续可结合 Cloudflare Workers 做轻量动态能力。

GitHub Pages：

- 免费简单。
- 必须严格静态导出。
- 不能依赖服务端运行时。
- 图片优化、动态路由、basePath、assetPrefix、trailingSlash 需要额外配置。
- 如果部署到项目页路径，例如 `/repo-name/`，需要考虑资源路径前缀。

建议结论：

- MVP 首选 Vercel 或 Cloudflare Pages。
- GitHub Pages 作为兼容目标，但技术架构必须避免运行时依赖。

## 16. 扩展边界

后续能力以插件式接入或独立模块形式扩展：

- 评论：Giscus 或自建评论服务。
- 统计：Umami / Vercel Analytics / Cloudflare Web Analytics。
- 高级搜索：Algolia / Meilisearch / 后端搜索。
- CMS：Headless CMS 或自研后台。
- 媒体：对象存储 + 图片处理服务。
- Mermaid / 数学公式：MDX 编译插件扩展。

## 17. 关键技术约束

- 所有公开页面必须可构建时生成。
- 所有内容数据来自 MDX 或配置文件。
- 生产环境不得包含草稿内容。
- Frontmatter 校验失败必须阻断构建。
- slug、category、tag 路由必须稳定且唯一。
- RSS、Sitemap、搜索索引必须与生产文章集合一致。
- robots、RSS、Sitemap 必须作为静态文件生成，不依赖运行时接口。
- 配置文件校验失败必须阻断构建。
- MDX 仅处理本地可信内容。
- 图片路径、alt、封面图要纳入内容规范。
- GitHub Pages 兼容不得影响主方案，但不能使用与静态导出冲突的核心能力。
