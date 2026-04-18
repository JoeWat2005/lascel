"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import ContactForm from "./contact-form";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/25 backdrop-blur-md"
            aria-label="Close contact form"
          />

          <motion.div
            className="relative mt-6 w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:mt-10 sm:p-8"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="inline-grid w-fit">
                  <p className="font-display w-fit text-sm italic uppercase tracking-[0.18em] text-zinc-500">
                    Contact
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
                <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
                  Start a conversation with us
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
                  Use this form to get involved, report an issue, or discuss a
                  partnership with us. You can also email us directly at{" "}
                  <a
                    href="mailto:contact@lascel.com"
                    className="font-medium text-zinc-900 underline underline-offset-4"
                  >
                    contact@lascel.com
                  </a>
                  .
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700"
                whileHover={reduceMotion ? undefined : { rotate: 90, scale: 1.05 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                aria-label="Close modal"
              >
                <span aria-hidden className="text-xl leading-none">
                  X
                </span>
              </motion.button>
            </div>

            <ContactForm className="border-zinc-200/80 bg-white/80" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
