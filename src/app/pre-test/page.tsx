import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageAnimations from "@/components/PageAnimations";

const preTests = [
  {
    number: "01",
    title: "5S & 3T",
    subtitle: "Training 5S & 3T",
    description:
      "Ukur pengetahuan awal mengenai konsep 5S & 3T sebelum mengikuti training.",
    type: "PRE-TEST",
    href: "https://forms.gle/aTK9UqHK6THYv1RY8",
    accent: "blue",
  },
  {
    number: "02",
    title: "Fishbone Diagram",
    subtitle: "Training Fishbone Diagram",
    description:
      "Ukur pemahaman awal mengenai Fishbone Diagram dan root cause analysis.",
    type: "PRE-TEST",
    href: "https://forms.gle/N9SBNnm5WTCDHihZ9",
    accent: "dark",
  },
  {
    number: "03",
    title: "Basic Defect Name",
    subtitle: "Training Basic Defect Name",
    description:
      "Assessment untuk mengukur pemahaman mengenai basic defect name.",
    type: "PRE & POST TEST",
    href: "https://script.google.com/macros/s/AKfycbyX6POD9ZUxvFFL3D8pObqgKFkS8TgV6DDm5FknFuc6TBxzayYgjChYNDGqCha2NAgZbA/exec",
    accent: "blue",
  },
];

export default function PreTestPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">
      {/*NAVBAR*/}

      <Navbar />
      <PageAnimations />

      {/*HERO*/}

      <section
        data-hero
        className="relative overflow-hidden border-b border-slate-200 bg-white"
      >
        {/* BACKGROUND */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
          {/* LABEL */}

          <div data-hero-item className="flex items-center gap-3">
            <span
              data-line
              className="h-px w-10 origin-left bg-blue-600"
            />

            <span className="text-[11px] font-black tracking-[0.28em] text-blue-600">
              ASSESSMENT CENTER
            </span>
          </div>

          {/* TITLE */}

          <div className="mt-6 max-w-4xl">
            <h1
              data-hero-item
              className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#0b1220] sm:text-6xl lg:text-7xl"
            >
              Choose Your
              <br />
              <span className="text-blue-600">Pre-Test.</span>
            </h1>

            <p
              data-hero-item
              className="mt-7 max-w-2xl text-base leading-7 text-slate-500"
            >
              Pilih training yang ingin kamu ikuti. Setiap training
              memiliki assessment yang berbeda sesuai dengan materi
              pembelajaran.
            </p>
          </div>
        </div>
      </section>

      {/*PRE-TEST LIST*/}

      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        {/* SECTION HEADER */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] text-slate-400">
              AVAILABLE ASSESSMENTS
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Select Training
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-400 md:text-right">
            Pilih salah satu assessment untuk memulai Pre-Test.
          </p>
        </div>

        {/* CARDS */}

        <div
          data-card-group
          className="mt-10 grid gap-5 lg:grid-cols-3"
        >
          {preTests.map((test) => (
            <TestCard
              key={test.number}
              {...test}
            />
          ))}
        </div>
      </section>

      {/*INFORMATION*/}

      <section
        data-section
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            {/* LEFT */}

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-blue-600" />

                <span className="text-[10px] font-black tracking-[0.25em] text-blue-600">
                  BEFORE TRAINING
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight">
                Start with your
                <br />
                current knowledge.
              </h2>
            </div>

            {/* RIGHT */}

            <div
              data-card-group
              className="grid gap-4 sm:grid-cols-3"
            >
              <InfoCard
                number="01"
                title="Choose"
                description="Pilih training yang ingin diikuti."
              />

              <InfoCard
                number="02"
                title="Start"
                description="Klik tombol Start untuk membuka assessment."
              />

              <InfoCard
                number="03"
                title="Complete"
                description="Selesaikan seluruh pertanyaan Pre-Test."
              />
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

/* TEST CARD*/

function TestCard({
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
            type === "PRE & POST TEST"
              ? "rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-black tracking-[0.15em] text-blue-600"
              : "rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-black tracking-[0.15em] text-slate-500"
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

      <p className="mt-5 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* BUTTON */}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-[10px] font-black tracking-[0.15em] text-slate-400">
          START ASSESSMENT
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1220] text-sm text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-600">
          →
        </span>
      </div>
    </a>
  );
}

/* INFO CARD*/

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
    <div
      data-card
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
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