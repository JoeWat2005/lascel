"use client";

import { motion, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="min-h-screen border-t border-zinc-200">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="inline-grid w-fit">
          <motion.p
            className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          >
            About us
          </motion.p>
          <motion.div
            className="mt-3 h-px w-full overflow-hidden bg-zinc-200"
            initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0, originX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <motion.span
              className="block h-full w-1/2 bg-zinc-400/60"
              animate={reduceMotion ? undefined : { x: ["-100%", "200%"] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          </motion.div>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
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
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="border-l-2 border-zinc-900/15 pl-4"
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : index * 0.06,
                  }}
                  whileHover={
                    reduceMotion ? undefined : { x: 4, borderColor: "rgba(24,24,27,0.45)" }
                  }
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            {foundations.map((item, index) => (
              <motion.div
                key={item.title}
                className="border-b border-zinc-200 pb-5"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
                whileHover={reduceMotion ? undefined : { x: 6 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {`0${index + 1}`}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
