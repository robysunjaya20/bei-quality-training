"use client";

import Link from "next/link";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
    >
      {children}
    </Link>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1220] text-sm font-black text-white">
              BQ
            </div>

            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-[#0b1220]">
                BEI QUALITY
              </div>
              <div className="text-xs font-medium tracking-[0.2em] text-slate-500">
                TRAINING CENTER
              </div>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/modules">Modules</NavLink>
            <NavLink href="/pre-test">Pre-Test</NavLink>
            <NavLink href="/post-test">Post-Test</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          {/* CTA */}
          <Link
            href="/modules"
            className="hidden rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 md:block"
          >
            Start Training
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b1220]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.18em] text-blue-300">
              CONTACT
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Need Help?
              <br />
              <span className="text-blue-500">Get in Touch.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Have questions about the training program, assessment, or
              learning materials? Contact the BEI Quality Training Center for
              assistance.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* EMAIL */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-[#2563eb]" />

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              ✉
            </div>

            <p className="mt-7 text-xs font-bold tracking-[0.2em] text-blue-600">
              EMAIL
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
              Email Us
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Send us an email for questions, information, or assistance
              related to the training program.
            </p>

            <a
              href="mailto:qc_05@bumjin.co.id"
              className="mt-6 inline-flex items-center gap-2 break-all text-base font-bold text-[#0b1220] transition hover:text-blue-600"
            >
              qc_05@bumjin.co.id
              <span>↗</span>
            </a>
          </div>

          {/* PHONE */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-[#0b1220]" />

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              ☎
            </div>

            <p className="mt-7 text-xs font-bold tracking-[0.2em] text-slate-600">
              PHONE / WHATSAPP
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
              Contact Us
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Contact the Quality Training Center directly for further
              assistance.
            </p>

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

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="overflow-hidden rounded-3xl bg-[#0b1220]">
          <div className="relative px-8 py-14 text-center sm:px-12 lg:py-20">
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                READY TO LEARN?
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Start your quality training journey.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">
                Explore the available training modules and improve your
                understanding of quality and automotive core tools.
              </p>

              <Link
                href="/modules"
                className="mt-8 inline-flex items-center rounded-lg bg-[#2563eb] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Explore Training Modules
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>
            <div className="text-sm font-extrabold tracking-wide">
              BEI QUALITY TRAINING
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Quality • Automotive • Continuous Improvement
            </p>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 BEI Quality Training Center. All rights reserved.
          </div>
        </div>
      </footer>

    </main>
  );
}