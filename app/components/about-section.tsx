const foundations = [
  {
    title: "Problem-first subsidiaries",
    description:
      "We build and back companies that solve practical day-to-day problems for real people, teams, and industries.",
  },
  {
    title: "Expansion right now",
    description:
      "Our current focus is expansion: strengthening current subsidiaries, rapid iteration, and scaling what works.",
  },
  {
    title: "Long-term vision",
    description:
      "Alongside software products, we plan to expand into other industries over time.",
  },
] as const;

const stats = [
  { label: "Active subsidiaries", value: "2" },
  { label: "Core focus", value: "Expansion" },
  { label: "Model", value: "Startup / Rapid growth" },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen border-t border-zinc-200">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="inline-grid w-fit">
          <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
            About us
          </p>
          <div className="line-shimmer mt-3 h-px w-full overflow-hidden bg-zinc-200" />
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal-up">
            <h2 className="font-display max-w-3xl text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Lascel is{" "}
              <span className="font-semibold">built to launch</span> and{" "}
              <span className="font-semibold">grow high-quality businesses</span>.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              We are building a portfolio of subsidiaries that solve meaningful
              problems for everyday people. While we
              continue growing, we are also preparing to
              expand into property and other long-term opportunities.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l-2 border-zinc-900/15 pl-4 transition-all duration-300 hover:translate-x-1 hover:border-zinc-900/45"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {foundations.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-zinc-200 pb-5 transition-transform duration-300 hover:translate-x-1.5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {`0${index + 1}`}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
