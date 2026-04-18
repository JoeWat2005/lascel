"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import AboutSection from "./components/about-section";
import CompaniesCarousel from "./components/companies-carousel";
import ContactModal from "./components/contact-modal";
import HeroSection from "./components/hero-section";
import SocialLinks from "./components/social-links";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lascel",
  url: "https://lascel.com",
  logo: "https://lascel.com/lascel-logo.png",
  description:
    "Lascel builds practical AI ventures across operations, customer communication, and digital business systems.",
};

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative overflow-x-clip bg-white text-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-28 top-[22%] h-80 w-80 rounded-full bg-zinc-900/[0.035] blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 24, 0],
                  y: [0, -18, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute -right-24 top-[58%] h-96 w-96 rounded-full bg-zinc-900/[0.03] blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -28, 0],
                  y: [0, 22, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      </div>

      <HeroSection />
      <AboutSection />

      <section
        id="companies"
        className="min-h-screen border-t border-zinc-200 bg-zinc-50/40"
      >
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <motion.div
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <div className="inline-grid w-fit">
              <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
                Subsidiaries
              </p>
              <motion.div
                className="mt-3 h-px w-full overflow-hidden bg-zinc-200"
                initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0, originX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: reduceMotion ? 0 : 0.45 }}
              >
                <motion.span
                  className="block h-full w-1/2 bg-zinc-400/60"
                  animate={reduceMotion ? undefined : { x: ["-100%", "200%"] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                />
              </motion.div>
            </div>
          </motion.div>

          <CompaniesCarousel />
        </div>
      </section>

      <section id="contact" className="border-t border-zinc-200">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <motion.div
            className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <div className="max-w-3xl">
              <div className="inline-grid w-fit">
                <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
                  Contact
                </p>
                <motion.div
                  className="mt-3 h-px w-full overflow-hidden bg-zinc-200"
                  initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0, originX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45 }}
                >
                  <motion.span
                    className="block h-full w-1/2 bg-zinc-400/60"
                    animate={reduceMotion ? undefined : { x: ["-100%", "200%"] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : {
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                  />
                </motion.div>
              </div>
              <h2 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
                Get Involved
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-zinc-600">
                Use the form to get involved, report an issue, or discuss a partnership.
                We review each message quickly and will reply as soon as possible.
              </p>

              <motion.a
                href="mailto:contact@lascel.com"
                className="mt-6 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4"
                whileHover={reduceMotion ? undefined : { y: -2 }}
              >
                contact@lascel.com
              </motion.a>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: "Get involved", icon: ">" },
                  { label: "Report an issue", icon: ">" },
                  { label: "Partnerships", icon: ">" },
                ].map((item) => (
                  <motion.span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-300/90 bg-white/70 px-4 py-2 text-sm text-zinc-700 backdrop-blur-sm"
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { y: -2, borderColor: "#18181b", scale: 1.02 }
                    }
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="btn btn-neutral btn-lg h-16 w-full rounded-full px-12 text-lg shadow-[0_14px_30px_-20px_rgba(24,24,27,0.75)] sm:w-auto"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(24,24,27,0)",
                        "0 18px 40px -24px rgba(24,24,27,0.55)",
                        "0 0 0 0 rgba(24,24,27,0)",
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Contact us
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <motion.div
          className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              &copy; {currentYear} Lascel. All rights reserved.
            </p>
            <SocialLinks />
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
            <motion.a
              href="#about"
              whileHover={reduceMotion ? undefined : { y: -2, color: "#18181b" }}
            >
              About
            </motion.a>
            <motion.a
              href="#companies"
              whileHover={reduceMotion ? undefined : { y: -2, color: "#18181b" }}
            >
              Companies
            </motion.a>
            <motion.button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              whileHover={reduceMotion ? undefined : { y: -2, color: "#18181b" }}
            >
              Contact
            </motion.button>
            <motion.a
              href="#"
              whileHover={reduceMotion ? undefined : { y: -2, color: "#18181b" }}
            >
              Back to top
            </motion.a>
          </nav>
        </motion.div>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </main>
  );
}
