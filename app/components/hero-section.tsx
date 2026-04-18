"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

const HERO_SEGMENTS = [
  { text: "Building ", emphasis: false },
  { text: "businesses", emphasis: true },
  { text: " for the ", emphasis: false },
  { text: "long term", emphasis: true },
] as const;
const HERO_HEADING = HERO_SEGMENTS.map((segment) => segment.text).join("");
const HERO_PARAGRAPH =
  "Lascel is a company built to launch and deploy businesses that solve real problems for real people.";
const TYPEWRITER_MS = 36;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [typedCharacters, setTypedCharacters] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTypedCharacters((currentCount) => {
        if (currentCount >= HERO_HEADING.length) {
          window.clearInterval(intervalId);
          return currentCount;
        }

        return currentCount + 1;
      });
    }, TYPEWRITER_MS);

    return () => window.clearInterval(intervalId);
  }, [reduceMotion]);

  const visibleCharacters = reduceMotion ? HERO_HEADING.length : typedCharacters;
  const isHeadingDone = visibleCharacters >= HERO_HEADING.length;
  const typedHeadingSegments = HERO_SEGMENTS.reduce(
    (accumulator, segment) => {
      if (accumulator.remainingCharacters <= 0) {
        return accumulator;
      }

      const visibleInSegment = Math.min(
        segment.text.length,
        accumulator.remainingCharacters,
      );

      const segmentNode = (
        <span
          key={segment.text}
          className={segment.emphasis ? "font-semibold" : undefined}
        >
          {segment.text.slice(0, visibleInSegment)}
        </span>
      );

      return {
        remainingCharacters: accumulator.remainingCharacters - visibleInSegment,
        segmentNodes: [...accumulator.segmentNodes, segmentNode],
      };
    },
    { remainingCharacters: visibleCharacters, segmentNodes: [] as ReactNode[] },
  ).segmentNodes;

  const scrollToSection = (
    sectionId: string,
    block: ScrollLogicalPosition = "start",
  ) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block,
    });
  };

  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
      return;
    }

    window.location.assign("/");
  };

  return (
    <section className="relative min-h-screen border-b border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <motion.div
        className="pointer-events-none absolute -left-24 top-[-5rem] h-72 w-72 rounded-full bg-zinc-900/[0.05] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 34, 0],
                y: [0, 16, 0],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-8rem] right-[-8rem] h-80 w-80 rounded-full bg-zinc-900/[0.04] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -30, 0],
                y: [0, -24, 0],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />

      <div className="flex min-h-screen flex-col px-5 py-8 sm:px-8 lg:px-12">
        <motion.header
          className="mx-auto flex w-full max-w-6xl items-center"
          initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
          <motion.button
            type="button"
            onClick={handleLogoClick}
            className="inline-flex cursor-pointer items-center"
            whileHover={reduceMotion ? undefined : { y: -1, opacity: 0.88 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            aria-label="Reload landing page"
          >
            <Image
              src="/lascel-logo.png"
              alt="Lascel logo"
              width={434}
              height={143}
              priority
              className="h-auto w-[168px] sm:w-[208px] lg:w-[236px]"
            />
          </motion.button>
        </motion.header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center pt-4 sm:pt-8">
          <motion.div
            className="w-full max-w-5xl py-12 sm:py-16"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <h1 className="font-display max-w-5xl text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
              <span>{typedHeadingSegments}</span>
              {isHeadingDone ? (
                <motion.span
                  className="inline"
                  animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 1.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  .
                </motion.span>
              ) : null}
              {!reduceMotion && !isHeadingDone ? (
                <motion.span
                  className="ml-[0.07em] inline-block text-zinc-500"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                >
                  _
                </motion.span>
              ) : null}
            </h1>

            <motion.p
              className="mt-8 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: isHeadingDone ? 1 : 0, y: isHeadingDone ? 0 : 10 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              {HERO_PARAGRAPH}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: isHeadingDone ? 1 : 0, y: isHeadingDone ? 0 : 8 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              <motion.button
                type="button"
                onClick={() => scrollToSection("companies")}
                className="btn btn-neutral rounded-full px-7"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Our companies
              </motion.button>
              <motion.button
                type="button"
                onClick={() => scrollToSection("about")}
                className="btn btn-ghost rounded-full border border-zinc-300/90 bg-white/70 px-7 backdrop-blur-sm"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                About us
              </motion.button>
              <motion.button
                type="button"
                onClick={() => scrollToSection("contact", "end")}
                className="btn btn-ghost rounded-full border border-zinc-300/90 bg-white/70 px-7 backdrop-blur-sm"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Contact us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
