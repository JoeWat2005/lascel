"use client";

import { motion, useReducedMotion } from "framer-motion";

const iconClassName = "h-[18px] w-[18px]";

const socialLinks = [
  {
    label: "X",
    href: "https://x.com/lascel",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden>
        <path d="M18.244 2h3.308l-7.225 8.26L22.824 22h-6.649l-5.207-7.106L4.75 22H1.44l7.73-8.835L1 2h6.817l4.706 6.404L18.244 2Zm-1.161 18h1.833L6.821 3.895H4.854L17.083 20Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/lascel",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden>
        <path d="M13.25 21v-7.6h2.56l.38-2.96h-2.94V8.55c0-.86.24-1.45 1.47-1.45h1.57V4.45c-.27-.04-1.2-.11-2.27-.11-2.24 0-3.77 1.36-3.77 3.88v2.16H7.75v2.96h2.52V21h2.98Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/lascel",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden>
        <path d="M6.94 8.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM5.4 19V9.8h3.08V19H5.4Zm5.26 0V9.8h2.96v1.31h.04c.41-.78 1.42-1.6 2.92-1.6 3.12 0 3.7 2.06 3.7 4.75V19h-3.08v-4.14c0-.99-.02-2.26-1.38-2.26-1.39 0-1.6 1.08-1.6 2.19V19h-3.56Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/lascel",
    icon: (
      <svg viewBox="0 0 24 24" className={iconClassName} fill="none" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
] as const;

export default function SocialLinks() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {socialLinks.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700"
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.04, borderColor: "#18181b" }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          aria-label={`Open ${social.label}`}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
}
