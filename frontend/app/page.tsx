export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Blog MVP
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
        Static blog frontend baseline
      </h1>
      <p className="max-w-xl text-base leading-7 text-zinc-600">
        Next.js App Router, Tailwind CSS, Vitest, and static export tooling are
        ready for the content pipeline.
      </p>
    </main>
  );
}
