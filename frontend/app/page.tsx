export default function Home() {
  return (
    <section className="flex min-h-[55vh] flex-col justify-center gap-5">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">Blog MVP</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        个人技术笔记与项目记录
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted">
        一个静态优先的技术博客，专注稳定写作、代码阅读体验和个人技术品牌展示。
      </p>
    </section>
  );
}
