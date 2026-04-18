import AboutSection from "./components/about-section";
import CompaniesCarousel from "./components/companies-carousel";
import ContactModalController from "./components/contact-modal-controller";
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
        <div className="ambient-orb ambient-orb-left" />
        <div className="ambient-orb ambient-orb-right" />
      </div>

      <HeroSection />
      <AboutSection />

      <section
        id="companies"
        className="min-h-screen border-t border-zinc-200 bg-zinc-50/40"
      >
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mb-8 sm:mb-10 reveal-up">
            <div className="inline-grid w-fit">
              <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
                Subsidiaries
              </p>
              <div className="line-shimmer mt-3 h-px w-full overflow-hidden bg-zinc-200" />
            </div>
          </div>

          <CompaniesCarousel />
        </div>
      </section>

      <section id="contact" className="border-t border-zinc-200">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-10 reveal-up lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-grid w-fit">
                <p className="font-display w-fit text-base italic uppercase tracking-[0.18em] text-zinc-500">
                  Contact
                </p>
                <div className="line-shimmer mt-3 h-px w-full overflow-hidden bg-zinc-200" />
              </div>
              <h2 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
                Get Involved
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-zinc-600">
                Use the form to get involved, report an issue, or discuss a partnership.
                We review each message quickly and will reply as soon as possible.
              </p>

              <a
                href="mailto:contact@lascel.com"
                className="mt-6 inline-flex text-sm font-semibold text-zinc-900 underline underline-offset-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                contact@lascel.com
              </a>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: "Get involved", icon: ">" },
                  { label: "Report an issue", icon: ">" },
                  { label: "Partnerships", icon: ">" },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-300/90 bg-white/70 px-4 py-2 text-sm text-zinc-700 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-zinc-900"
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              data-contact-trigger
              className="btn btn-neutral btn-lg contact-cta-pulse h-16 w-full rounded-full px-12 text-lg shadow-[0_14px_30px_-20px_rgba(24,24,27,0.75)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              Contact us
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 reveal-up sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              &copy; {currentYear} Lascel. All rights reserved.
            </p>
            <SocialLinks />
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
            <a
              href="#about"
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:text-zinc-900"
            >
              About
            </a>
            <a
              href="#companies"
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:text-zinc-900"
            >
              Companies
            </a>
            <button
              type="button"
              data-contact-trigger
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:text-zinc-900"
            >
              Contact
            </button>
            <a
              href="#"
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:text-zinc-900"
            >
              Back to top
            </a>
          </nav>
        </div>
      </footer>

      <ContactModalController />
    </main>
  );
}
