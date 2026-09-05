import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "IATF 16949",
    category: "QUALITY SYSTEM",
    description:
      "Automotive Quality Management System dan persyaratan khusus industri otomotif.",
    accent: "blue",
  },
  {
    number: "02",
    title: "MSA",
    category: "AUTOMOTIVE CORE TOOLS",
    description:
      "Measurement System Analysis untuk memastikan sistem pengukuran dapat dipercaya.",
    accent: "dark",
  },
  {
    number: "03",
    title: "SPC",
    category: "AUTOMOTIVE CORE TOOLS",
    description:
      "Statistical Process Control untuk monitoring dan pengendalian variasi proses.",
    accent: "blue",
  },
  {
    number: "04",
    title: "QUALITY TOOLS",
    category: "CONTINUOUS IMPROVEMENT",
    description:
      "Tools untuk problem solving, root cause analysis, dan continuous improvement.",
    accent: "dark",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-10">

          {/* LOGO */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1220] text-sm font-black text-white shadow-sm transition duration-300 group-hover:scale-105">
              BQ
            </div>

            <div className="leading-none">

              <div className="text-[15px] font-black tracking-tight text-[#0b1220]">
                BEI QUALITY
              </div>

              <div className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400">
                TRAINING CENTER
              </div>

            </div>

          </Link>


          {/* NAVIGATION */}

          <nav className="hidden items-center gap-1 md:flex">

            <NavLink
              href="/"
              active
            >
              Home
            </NavLink>

            <NavLink href="/modules">
              Modules
            </NavLink>

            <NavLink href="/pre-test">
              Pre-Test
            </NavLink>

            <NavLink href="/post-test">
              Post-Test
            </NavLink>

            <NavLink href="/contact">
              Contact
            </NavLink>

          </nav>


          {/* START BUTTON */}

          <Link
            href="/pre-test"
            className="
              group flex items-center gap-2
              rounded-xl
              bg-[#0b1220]
              px-5 py-3
              text-sm font-bold text-white
              shadow-lg shadow-slate-900/10
              transition duration-300
              hover:-translate-y-0.5
              hover:bg-blue-600
              hover:shadow-xl
            "
          >

            Start Training

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        {/* BACKGROUND DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            -top-40
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-50
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-1/3
            h-[450px]
            w-[450px]
            rounded-full
            bg-slate-100
            blur-3xl
          "
        />


        {/* HERO CONTENT */}

        <div className="relative mx-auto flex min-h-[650px] max-w-[1400px] items-center px-6 py-24 lg:px-10 lg:py-28">

          <div className="max-w-5xl">

            {/* LABEL */}

            <div className="mb-7 flex items-center gap-3">

              <div className="h-px w-10 bg-blue-600" />

              <span className="text-[11px] font-black tracking-[0.28em] text-blue-600">
                QUALITY TRAINING PLATFORM
              </span>

            </div>


            {/* MAIN TITLE */}

            <h1
              className="
                text-[58px]
                font-black
                leading-[0.9]
                tracking-[-0.055em]
                text-[#0b1220]
                sm:text-7xl
                lg:text-[100px]
              "
            >

              BUILD

              <br />

              <span>
                QUALITY.
              </span>

              <br />

              <span className="text-slate-300">
                BUILD
              </span>

              <br />

              <span className="text-blue-600">
                EXCELLENCE.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="mt-9 max-w-2xl text-[16px] leading-7 text-slate-500">

              Platform pembelajaran untuk meningkatkan kompetensi
              dalam{" "}

              <strong className="font-semibold text-slate-700">
                Quality Management System
              </strong>
              , Automotive Core Tools, dan Continuous Improvement.

            </p>


            {/* BUTTONS */}

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                href="/pre-test"
                className="
                  group flex items-center gap-3
                  rounded-xl
                  bg-[#0b1220]
                  px-6 py-3.5
                  text-sm font-bold text-white
                  shadow-xl shadow-slate-900/10
                  transition duration-300
                  hover:-translate-y-1
                  hover:bg-blue-600
                "
              >

                Mulai Pre-Test

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>


              <Link
                href="/modules"
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-slate-300
                  bg-white
                  px-6 py-3.5
                  text-sm font-bold text-slate-700
                  transition duration-300
                  hover:border-[#0b1220]
                  hover:bg-slate-50
                "
              >

                Lihat Modul

              </Link>

            </div>


            {/* TRAINING CATEGORIES */}

            <div
              className="
                mt-14
                flex flex-wrap
                items-center
                gap-x-8
                gap-y-4
                border-t
                border-slate-200
                pt-7
              "
            >

              {/* CATEGORY 01 */}

              <div className="flex items-center gap-3">

                <span
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    bg-blue-50
                    text-xs font-black
                    text-blue-600
                  "
                >
                  01
                </span>

                <span className="text-xs font-bold text-slate-600">
                  Quality System
                </span>

              </div>


              <div className="h-5 w-px bg-slate-200" />


              {/* CATEGORY 02 */}

              <div className="flex items-center gap-3">

                <span
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    bg-slate-100
                    text-xs font-black
                    text-slate-600
                  "
                >
                  02
                </span>

                <span className="text-xs font-bold text-slate-600">
                  Automotive Core Tools
                </span>

              </div>


              <div className="h-5 w-px bg-slate-200" />


              {/* CATEGORY 03 */}

              <div className="flex items-center gap-3">

                <span
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    bg-slate-100
                    text-xs font-black
                    text-slate-600
                  "
                >
                  03
                </span>

                <span className="text-xs font-bold text-slate-600">
                  Continuous Improvement
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODULE SECTION
      ====================================================== */}

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">

        {/* SECTION HEADER */}

        <div
          className="
            flex flex-col
            justify-between
            gap-6
            md:flex-row
            md:items-end
          "
        >

          <div>

            <div className="mb-4 flex items-center gap-3">

              <span className="h-px w-8 bg-blue-600" />

              <span className="text-[10px] font-black tracking-[0.25em] text-blue-600">
                LEARNING MATERIAL
              </span>

            </div>


            <h2
              className="
                text-4xl
                font-black
                tracking-[-0.035em]
                sm:text-5xl
              "
            >
              Training Modules
            </h2>


            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">

              Materi training yang dirancang untuk membangun
              pemahaman dan kemampuan praktis dalam quality.

            </p>

          </div>


          <Link
            href="/modules"
            className="
              group flex items-center gap-2
              text-sm font-bold
              text-slate-700
            "
          >

            View all modules

            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>


        {/* MODULE GRID */}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {modules.map((module) => (
            <ModuleCard
              key={module.number}
              {...module}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          ASSESSMENT SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#0b1220] text-white">

        {/* BACKGROUND DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            top-1/2
            h-[500px]
            w-[500px]
            -translate-y-1/2
            rounded-full
            bg-blue-600/10
            blur-3xl
          "
        />


        <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10">

          <div
            className="
              grid
              gap-14
              lg:grid-cols-[0.9fr_1.1fr]
              lg:items-center
            "
          >

            {/* LEFT */}

            <div>

              <div className="mb-5 flex items-center gap-3">

                <span className="h-px w-8 bg-blue-500" />

                <span className="text-[10px] font-black tracking-[0.25em] text-blue-400">
                  ASSESSMENT
                </span>

              </div>


              <h2
                className="
                  text-4xl
                  font-black
                  leading-tight
                  tracking-[-0.04em]
                  sm:text-5xl
                "
              >

                Measure your

                <br />

                <span className="text-slate-500">
                  improvement.
                </span>

              </h2>


              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">

                Gunakan Pre-Test untuk mengetahui kemampuan awal,
                kemudian bandingkan dengan hasil Post-Test setelah
                menyelesaikan seluruh materi training.

              </p>

            </div>


            {/* RIGHT */}

            <div className="grid gap-4 sm:grid-cols-2">

              <AssessmentCard
                number="01"
                title="Pre-Test"
                description="Ukur pengetahuan awal sebelum mengikuti training."
                href="/pre-test"
              />

              <AssessmentCard
                number="02"
                title="Post-Test"
                description="Evaluasi pemahaman dan peningkatan setelah training."
                href="/post-test"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-200 bg-white">

        <div
          className="
            mx-auto
            flex
            max-w-[1400px]
            flex-col
            gap-4
            px-6
            py-8
            text-xs
            text-slate-400
            sm:flex-row
            sm:items-center
            sm:justify-between
            lg:px-10
          "
        >

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


/* ============================================================
   NAVIGATION LINK
============================================================ */

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-semibold
        transition
        ${
          active
            ? "bg-slate-100 text-[#0b1220]"
            : "text-slate-500 hover:bg-slate-50 hover:text-[#0b1220]"
        }
      `}
    >
      {children}
    </Link>
  );
}


/* ============================================================
   MODULE CARD
============================================================ */

function ModuleCard({
  number,
  title,
  category,
  description,
  accent,
}: {
  number: string;
  title: string;
  category: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href="/modules"
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        transition
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)]
      "
    >

      {/* TOP ACCENT */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-1
          w-full
          ${
            accent === "blue"
              ? "bg-blue-600"
              : "bg-[#0b1220]"
          }
        `}
      />


      {/* CARD TOP */}

      <div className="flex items-start justify-between">

        <span className="text-xs font-black text-slate-300">
          {number}
        </span>


        <span
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-lg
            bg-slate-50
            text-slate-400
            transition
            group-hover:bg-blue-50
            group-hover:text-blue-600
          "
        >
          ↗
        </span>

      </div>


      {/* CATEGORY */}

      <p
        className="
          mt-10
          text-[9px]
          font-black
          tracking-[0.2em]
          text-slate-400
        "
      >
        {category}
      </p>


      {/* TITLE */}

      <h3
        className="
          mt-2
          text-xl
          font-black
          tracking-tight
          text-[#0b1220]
        "
      >
        {title}
      </h3>


      {/* DESCRIPTION */}

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>


      {/* FOOTER */}

      <div
        className="
          mt-8
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          pt-4
        "
      >

        <span className="text-[10px] font-bold text-slate-400">
          LEARNING MODULE
        </span>


        <span
          className="
            text-xs
            font-black
            text-slate-700
            transition
            group-hover:translate-x-1
            group-hover:text-blue-600
          "
        >
          →
        </span>

      </div>

    </Link>
  );
}


/* ============================================================
   ASSESSMENT CARD
============================================================ */

function AssessmentCard({
  number,
  title,
  description,
  href,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-6
        transition
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
        hover:bg-white/[0.07]
      "
    >

      {/* TOP */}

      <div className="flex items-center justify-between">

        <span className="text-xs font-black text-slate-600">
          {number}
        </span>


        <span
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            bg-white/5
            text-slate-400
            transition
            group-hover:bg-blue-600
            group-hover:text-white
          "
        >
          →
        </span>

      </div>


      {/* TITLE */}

      <h3 className="mt-10 text-2xl font-black">
        {title}
      </h3>


      {/* DESCRIPTION */}

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>


      {/* LINK */}

      <div className="mt-7 text-xs font-bold text-blue-400">
        Start assessment →
      </div>

    </Link>
  );
}