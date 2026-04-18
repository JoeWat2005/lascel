"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const DETAIL_ROTATE_MS = 10000;
const MARQUEE_DURATION_SECONDS = 26;

const companies = [
  {
    name: "DeskCaptain",
    category: "AI frontdesk receptionist",
    lifecycle: "In Development",
    lifecycleTone: "warning",
    description:
      "AI receptionist that handles calls, emails, and bookings, helping businesses capture leads and reduce admin.",
    logo: "/deskcaptain.png",
    logoWidth: 702,
    logoHeight: 150,
    logoClassName: "h-[50px] w-auto object-contain sm:h-[50px]",
    logoSlotClassName: "inline-flex h-28 w-[560px] items-center justify-center",
    url: "https://deskcaptain.co.uk",
    displayUrl: "deskcaptain.co.uk",
  },
  {
    name: "Flotrafic",
    category: "Online business platform and management tool",
    lifecycle: "Live",
    lifecycleTone: "success",
    description:
      "Platform for launching websites instantly and managing bookings, enquiries, and business operations all in one place.",
    logo: "/flotrafic.png",
    logoWidth: 1151,
    logoHeight: 361,
    logoClassName: "h-[60px] w-auto object-contain sm:h-[60px]",
    logoSlotClassName: "inline-flex h-28 w-[360px] items-center justify-center",
    url: "https://flotrafic.co.uk",
    displayUrl: "flotrafic.co.uk",
  },
] as const;

export default function CompaniesCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCompany = companies[activeIndex];
  const activeLifecycleClass =
    activeCompany.lifecycleTone === "success" ? "status-success" : "status-warning";
  const marqueeLogos = useMemo(() => [...companies, ...companies], []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % companies.length);
    }, DETAIL_ROTATE_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
    >
      <div className="overflow-hidden border-y border-zinc-200 py-7">
        <motion.div
          className="flex w-max items-center gap-16 pr-16"
          animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: MARQUEE_DURATION_SECONDS,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          {marqueeLogos.map((company, index) => (
            <a
              key={`${company.name}-${index}`}
              href={company.url}
              target="_blank"
              rel="noreferrer"
              className={`${company.logoSlotClassName} opacity-65 transition-opacity hover:opacity-100`}
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.logoWidth}
                height={company.logoHeight}
                className={company.logoClassName}
              />
            </a>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={activeCompany.name}
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 16,
            filter: reduceMotion ? "none" : "blur(3px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: reduceMotion ? 0 : -14,
            filter: reduceMotion ? "none" : "blur(2px)",
          }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-[0_10px_34px_rgba(24,24,27,0.06)] backdrop-blur-sm sm:p-7"
        >
          <motion.h3
            className="font-display text-3xl tracking-tight"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.03 }}
          >
            {activeCompany.name}
          </motion.h3>
          <motion.p
            className="font-display mt-3 text-sm italic uppercase tracking-[0.18em] text-zinc-500"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.08 }}
          >
            {activeCompany.category}
          </motion.p>
          <motion.div
            className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.13 }}
          >
            <span className="inline-grid *:[grid-area:1/1]">
              {activeCompany.lifecycleTone === "success" ? (
                <span
                  className={`status ${activeLifecycleClass} h-3.5 w-3.5 animate-ping`}
                />
              ) : null}
              <span className={`status ${activeLifecycleClass} h-3.5 w-3.5`} />
            </span>
            {activeCompany.lifecycle}
          </motion.div>
          <motion.p
            className="mt-4 text-lg leading-8 text-zinc-600"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.17 }}
          >
            {activeCompany.description}
          </motion.p>
          <motion.div
            className="mt-6 h-px w-full max-w-2xl bg-zinc-200"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.22 }}
          />
          <motion.a
            href={activeCompany.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.25 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
          >
            Visit {activeCompany.displayUrl}
          </motion.a>
        </motion.article>
      </AnimatePresence>

      <div className="flex flex-wrap justify-center gap-2">
        {companies.map((company, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.button
              key={company.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-700"
              }`}
              whileHover={
                reduceMotion
                  ? undefined
                  : isActive
                    ? { y: -2, scale: 1.02 }
                    : { y: -2, scale: 1.02, borderColor: "#52525b" }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <span
                className={`status ${
                  company.lifecycleTone === "success" ? "status-success" : "status-warning"
                }`}
              />
              <span>{company.name}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
