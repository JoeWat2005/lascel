"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const REDIRECT_SECONDS = 5;

export default function NotFound() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const redirectId = window.setTimeout(() => {
      router.replace("/");
    }, REDIRECT_SECONDS * 1000);

    const tickId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => (currentSeconds > 1 ? currentSeconds - 1 : 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectId);
      window.clearInterval(tickId);
    };
  }, [router]);

  const progressPercent = useMemo(
    () => ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100,
    [secondsLeft],
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 text-zinc-900 sm:px-8">
      <motion.div
        className="pointer-events-none absolute -left-24 top-[-7rem] h-80 w-80 rounded-full bg-zinc-900/[0.05] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 28, 0],
                y: [0, 20, 0],
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
        className="pointer-events-none absolute bottom-[-8rem] right-[-8rem] h-96 w-96 rounded-full bg-zinc-900/[0.04] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -24, 0],
                y: [0, -18, 0],
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

      <motion.section
        className="relative w-full max-w-xl rounded-3xl border border-zinc-200 bg-white/90 p-7 shadow-[0_20px_70px_rgba(24,24,27,0.1)] backdrop-blur sm:p-10"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35 }}
      >
        <div className="inline-grid w-fit">
          <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
            404
          </p>
          <motion.div
            className="mt-3 h-px w-full overflow-hidden bg-zinc-200"
            initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0, originX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          >
            <motion.span
              className="block h-full w-1/2 bg-zinc-400/60"
              animate={reduceMotion ? undefined : { x: ["-100%", "200%"] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          </motion.div>
        </div>
        <h1 className="font-display mt-5 text-4xl tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 leading-7 text-zinc-600">
          This page does not exist anymore. You will be redirected to the Lascel landing page.
        </p>

        <div className="mt-7">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
            <motion.span
              className="block h-full bg-zinc-900"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "linear" }}
            />
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Redirecting in {secondsLeft} second{secondsLeft === 1 ? "" : "s"}...
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="btn btn-neutral rounded-full px-7 shadow-[0_12px_28px_-20px_rgba(24,24,27,0.75)]"
          >
            Go to landing page
          </button>
        </div>
      </motion.section>
    </main>
  );
}
