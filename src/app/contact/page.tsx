import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageAnimations from "@/components/PageAnimations";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">
      {/*NAVBAR*/}

      <Navbar />
      <PageAnimations />

      {/*HERO*/}

      <section
        data-hero
        className="relative overflow-hidden bg-[#0b1220]"
      >
        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            {/* LABEL */}

            <div
              data-hero-item
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.18em] text-blue-300"
            >
              CONTACT
            </div>

            {/* TITLE */}

            <h1
              data-hero-item
              className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
            >
              Need Help?
              <br />
              <span className="text-blue-500">
                Get in Touch.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              data-hero-item
              className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              Have questions about the training program, assessment, or
              learning materials? Contact the BEI Quality Training Center
              for assistance.
            </p>
          </div>
        </div>
      </section>

      {/*CONTACT SECTION*/}

      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div
          data-card-group
          className="grid gap-5 lg:grid-cols-2"
        >
          {/* EMAIL*/}

          <div
            data-card
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.3)]"
          >
            {/* TOP ACCENT */}

            <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

            {/* ICON */}

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              ✉
            </div>

            {/* LABEL */}

            <p className="mt-7 text-xs font-bold tracking-[0.2em] text-blue-600">
              EMAIL
            </p>

            {/* TITLE */}

            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Email Us
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Send us an email for questions, information, or assistance
              related to the training program.
            </p>

            {/* EMAIL LINK */}

            <a
              href="mailto:qc_05@bumjin.co.id"
              className="mt-6 inline-flex items-center gap-2 break-all text-base font-bold text-[#0b1220] transition hover:text-blue-600"
            >
              qc_05@bumjin.co.id
              <span>↗</span>
            </a>
          </div>

          {/* PHONE / WHATSAPP*/}

          <div
            data-card
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.3)]"
          >
            {/* TOP ACCENT */}

            <div className="absolute left-0 top-0 h-1 w-full bg-[#0b1220]" />

            {/* ICON */}

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              ☎
            </div>

            {/* LABEL */}

            <p className="mt-7 text-xs font-bold tracking-[0.2em] text-slate-600">
              PHONE / WHATSAPP
            </p>

            {/* TITLE */}

            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Contact Us
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Contact the Quality Training Center directly for further
              assistance.
            </p>

            {/* PHONE LINK */}

            <a
              href="tel:0895385191979"
              className="mt-6 inline-flex items-center gap-2 text-base font-bold text-[#0b1220] transition hover:text-blue-600"
            >
              0895 3851 91979
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/*CTA*/}

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10 lg:pb-20">
        <div
          data-cta
          className="overflow-hidden rounded-3xl bg-[#0b1220]"
        >
          <div className="relative px-8 py-14 text-center sm:px-12 lg:py-20">
            {/* DECORATION */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative">
              {/* LABEL */}

              <p
                data-cta-item
                className="text-xs font-bold tracking-[0.25em] text-blue-400"
              >
                READY TO LEARN?
              </p>

              {/* TITLE */}

              <h2
                data-cta-item
                className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl"
              >
                Start your quality training journey.
              </h2>

              {/* DESCRIPTION */}

              <p
                data-cta-item
                className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300"
              >
                Explore the available training modules and improve your
                understanding of quality and automotive core tools.
              </p>

              {/* BUTTON */}

              <Link
                data-cta-item
                href="/modules"
                className="mt-8 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Explore Training Modules
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*FOOTER*/}

      <footer className="border-t border-slate-200 bg-[#f6f7f9]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="font-bold text-slate-700">
              BEI QUALITY TRAINING
            </p>

            <p className="mt-1">
              Quality • Automotive • Continuous Improvement
            </p>
          </div>

          <p>© 2026 BEI Quality Training</p>
        </div>
      </footer>
    </main>
  );
}