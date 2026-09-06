import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageAnimations from "@/components/PageAnimations";

const modules = [
  {
    number: "01",
    title: "General Modul PPT",
    subtitle: "Bumjin Training Center",
    description:
      "Materi general training dalam format PowerPoint. Gunakan modul ini untuk mempelajari materi training secara lengkap.",
    type: "POWERPOINT",
    href: "https://docs.google.com/presentation/d/1A6xwxKWrAKagAyeei9QCt5LxAP2cPjvR/edit?usp=sharing&ouid=100055124284914090025&rtpof=true&sd=true",
    accent: "blue",
  },
  {
    number: "02",
    title: "General Modul PDF",
    subtitle: "Bumjin Training Center",
    description:
      "Materi general training dalam format PDF. Cocok digunakan sebagai referensi pembelajaran.",
    type: "PDF",
    href: "https://drive.google.com/file/d/1kafRhL7cDhwNpm2E58LJmYjINJCFjC8w/view?usp=sharing",
    accent: "dark",
  },
];

export default function ModulesPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">

      <Navbar />

      <PageAnimations />

      {/* HERO*/}

      <section data-hero className="relative overflow-hidden border-b border-slate-200 bg-white"
      >

        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">

          {/* LABEL */}

          <div data-hero-item className="flex items-center gap-3">

            <span data-line className="h-px w-10 bg-blue-600" />

            <span className="text-[11px] font-black tracking-[0.28em] text-blue-600">
              LEARNING CENTER
            </span>

          </div>

          {/* TITLE */}

          <div className="mt-6 max-w-4xl">

            <h1 data-hero-item className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#0b1220] sm:text-6xl lg:text-7xl">
              Choose Your
              <br />
              <span className="text-blue-600">
                Training Module.
              </span>
            </h1>

            <p data-hero-item className="mt-7 max-w-2xl text-base leading-7 text-slate-500">
              Pelajari materi training yang tersedia sebelum atau
              sesudah mengikuti assessment. Pilih format materi
              yang paling sesuai dengan kebutuhan pembelajaran.
            </p>

          </div>

        </div>

      </section>

      {/*GENERAL MODULE*/}

      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">

        {/* SECTION HEADER */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="text-[10px] font-black tracking-[0.25em] text-slate-400">
              GENERAL TRAINING
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              General Module
            </h2>

          </div>

          <p className="max-w-md text-sm leading-6 text-slate-400 md:text-right">
            Pilih materi dalam format PowerPoint atau PDF.
          </p>

        </div>

        {/* MODULE CARDS */}

        <div data-card-group className="mt-10 grid gap-5 lg:grid-cols-2">

          {modules.map((module) => (
            <ModuleCard
              key={module.number}
              {...module}
            />
          ))}

        </div>

      </section>

      {/*LEARNING GUIDE*/}

      <section data-section className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-blue-600" />

                <span className="text-[10px] font-black tracking-[0.25em] text-blue-600">
                  HOW TO LEARN
                </span>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight">
                Learn at your
                <br />
                own pace.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                Tidak ada urutan wajib. Kamu dapat mempelajari
                modul terlebih dahulu, kemudian mengikuti Pre-Test
                atau Post-Test sesuai kebutuhan.
              </p>

            </div>

            {/* RIGHT */}

            <div data-card-group className="grid gap-4 sm:grid-cols-3">

              <InfoCard
                number="01"
                title="Choose"
                description="Pilih modul training yang ingin dipelajari."
              />

              <InfoCard
                number="02"
                title="Study"
                description="Baca dan pahami materi training."
              />

              <InfoCard
                number="03"
                title="Assess"
                description="Uji pemahaman melalui Pre-Test atau Post-Test."
              />

            </div>

          </div>

        </div>

      </section>

      {/*ASSESSMENT CTA*/}

      <section data-cta className="bg-[#0b1220] text-white">

        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div>

              <p data-cta-item className="text-[10px] font-black tracking-[0.25em] text-blue-400">
                READY TO TEST?
              </p>

              <h2 data-cta-item className="mt-3 text-3xl font-black tracking-tight">
                Test your knowledge.
              </h2>

              <p data-cta-item className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Setelah mempelajari modul, lanjutkan ke assessment
                untuk mengukur pemahaman kamu.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/pre-test"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0b1220] transition hover:bg-blue-600 hover:text-white"
              >
                Pre-Test →
              </Link>

              <Link
                href="/post-test"
                className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:border-blue-500 hover:bg-blue-600"
              >
                Post-Test →
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

          <p>
            © 2026 BEI Quality Training
          </p>

        </div>

      </footer>

    </main>
  );
}

/*MODULE CARD*/

function ModuleCard({
  number,
  title,
  subtitle,
  description,
  type,
  href,
  accent,
}: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  href: string;
  accent: string;
}) {
  return (
    <a
      data-card
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.3)]"
    >

      {/* TOP ACCENT */}

      <div
        className={
          accent === "blue"
            ? "absolute left-0 top-0 h-1 w-full bg-blue-600"
            : "absolute left-0 top-0 h-1 w-full bg-[#0b1220]"
        }
      />

      {/* CARD HEADER */}

      <div className="flex items-start justify-between">

        <span className="text-xs font-black text-slate-300">
          {number}
        </span>

        <span
          className={
            type === "PDF"
              ? "rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-black tracking-[0.15em] text-red-600"
              : "rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-black tracking-[0.15em] text-blue-600"
          }
        >
          {type}
        </span>

      </div>

      {/* TITLE */}

      <div className="mt-12">

        <h3 className="text-2xl font-black tracking-tight text-[#0b1220] transition-colors group-hover:text-blue-600">
          {title}
        </h3>

        <p className="mt-1 text-xs font-semibold text-slate-400">
          {subtitle}
        </p>

      </div>

      {/* DESCRIPTION */}

      <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* BUTTON */}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">

        <span className="text-[10px] font-black tracking-[0.15em] text-slate-400">
          OPEN MODULE
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1220] text-sm text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-600">
          ↗
        </span>

      </div>

    </a>
  );
}

/*INFO CARD*/

function InfoCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div data-card className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <span className="text-[10px] font-black text-blue-600">
        {number}
      </span>

      <h3 className="mt-4 text-sm font-black text-[#0b1220]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}