
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Navbar from "@/components/Navbar";

/* =========================================
   PASSWORD
========================================= */

const PASSWORD = "roby123";

/* =========================================
   TRAINING RESULTS DATA
========================================= */

const trainingResults = [
  {
    category: "Defect Injection Knowledge",
    title: "Pre & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test Defect Injection Knowledge.",
    type: "PRE & POST TEST",
    icon: "search",
    url: "https://docs.google.com/spreadsheets/d/1roNIHPnEqOygTrmopmjF2RZo2fOlTJoiG40MmV_DiGY/edit?usp=sharing",
  },
  {
    category: "Defect Assembly Knowledge",
    title: "Pre Test",
    description:
      "Hasil penilaian sebelum mengikuti Training Defect Assembly Knowledge.",
    type: "PRE TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/15RvtS-B-9iq5AAAcc7re5OZ5h3Iy_jnft17a9J-4kAs/edit?usp=sharing",
  },
  {
    category: "Basic Name Defect",
    title: "Pre & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test Basic Name Defect.",
    type: "PRE & POST TEST",
    icon: "search",
    url: "https://docs.google.com/spreadsheets/d/1G--vDaR5nI9PmYopeSNEdhRn60yBw-nwt9ADvKbXW3Q/edit?usp=sharing",
  },
  {
    category: "Clasification Class Product",
    title: "Pre Test",
    description:
      "Hasil penilaian sebelum mengikuti Training Clasification Class Product.",
    type: "PRE TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/1B0CESAd9MFgoYfeB8-Z1MoRFz86WD3-0_cY_QZsySG4/edit?usp=sharing",
  },
  {
    category: "Clasification Class Product",
    title: "Post Test",
    description:
      "Hasil penilaian setelah mengikuti Training Clasification Class Product.",
    type: "POST TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/1tP2_LA7QEJrt1w6Dq09rPM7Djh2W9L7gqIbJyxf095A/edit?usp=sharing",
  },
  {
    category: "Horenso",
    title: "Pre Test",
    description:
      "Hasil penilaian sebelum mengikuti Training Horenso.",
    type: "PRE TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/1RCnhixjqF11pAo94BIV4w0JX6mIn49Q4zbYOHi84Lvs/edit?usp=sharing",
  },
  {
    category: "Horenso",
    title: "Post Test",
    description:
      "Hasil penilaian setelah mengikuti Training Horenso.",
    type: "POST TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/17NXRbkB0gVfhSw-lcPorA6hchXDMIKpFHAgXE2XahQk/edit?usp=sharing",
  },
  {
    category: "5S & 3T",
    title: "Pre Test",
    description:
      "Hasil penilaian sebelum mengikuti Training 5S & 3T.",
    type: "PRE TEST",
    icon: "clipboard",
    url: "https://docs.google.com/spreadsheets/d/16OD7f0WSHpzYB73PjO8Q3fh-SwB2P7tf5lhmv8Th6HI/edit?usp=sharing",
  },
  {
    category: "5S & 3T",
    title: "Post Test",
    description:
      "Hasil penilaian setelah mengikuti Training 5S & 3T.",
    type: "POST TEST",
    icon: "book",
    url: "https://docs.google.com/spreadsheets/d/1zHjkvfY7rqmNvxU10SYzYiRgGcEeOX0WSCcq1K4dtjY/edit?usp=sharing",
  },
  {
    category: "Fishbone Diagram",
    title: "Pre Test",
    description:
      "Hasil penilaian sebelum mengikuti Training Fishbone Diagram.",
    type: "PRE TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/1PkWQ3q9V2pvm5A2VMh8iya5jKbjcHo0YXbtweg9iTGk/edit?usp=sharing",
  },
  {
    category: "Fishbone Diagram",
    title: "Post Test",
    description:
      "Hasil penilaian setelah mengikuti Training Fishbone Diagram.",
    type: "POST TEST",
    icon: "branch",
    url: "https://docs.google.com/spreadsheets/d/1c5BkfTEKgMr4f63EEUIAFNcfqd8bJRxy68NwbA7Jxn0/edit?usp=sharing",
  },
  {
    category: "Basic Analysis 5Why",
    title: "Pre Test & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test Basic Analysis 5Why.",
    type: "PRE TEST & POST TEST",
    icon: "ruler",
    url: "https://docs.google.com/spreadsheets/d/1kA7n_N5h_J9mLRpiaNMKKdKKhzfaeLtFSfoLZgaqZFM/edit?usp=sharing",
  },
  {
    category: "Standar Tolerance",
    title: "Pre & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test Standar Tolerance.",
    type: "PRE & POST TEST",
    icon: "ruler",
    url: "https://docs.google.com/spreadsheets/d/1UY8r_jCpOs5e7cCBqfgEMH7MXMIm7pEHZbh8FbxgCXU/edit?usp=sharing",
  },
  {
    category: "14 Q Principle",
    title: "Pre Test & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test 14 Q Principle.",
    type: "PRE TEST & POST TEST",
    icon: "ruler",
    url: "https://docs.google.com/spreadsheets/d/1FUWwIMV2Tz5_0LCUh3aABMizwM5lrM_AfN44P3om0Hw/edit?usp=sharing",
  },
  {
    category: "Item-Item Mirror",
    title: "Pre Test & Post Test",
    description:
      "Hasil penilaian Pre Test dan Post Test Item-Item Mirror.",
    type: "PRE TEST & POST TEST",
    icon: "ruler",
    url: "https://docs.google.com/spreadsheets/d/1zdcnBpoxpc4TxQlE-4MWHM-xr0629D_AcnHFgI7nPS0/edit?usp=sharing",
  },
];

/* =========================================
   FILTER OPTIONS
========================================= */

const TYPE_OPTIONS = [
  { value: "ALL", label: "Semua Jenis Test" },
  { value: "PRE TEST", label: "Pre Test" },
  { value: "POST TEST", label: "Post Test" },
  {
    value: "COMBINED",
    label: "Pre & Post Test",
  },
];

/* =========================================
   ICON COMPONENT
========================================= */

function ResultIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    search:
      "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",

    branch:
      "M6 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2M6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM18 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",

    clipboard:
      "M9 5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5ZM9 14l2 2 4-4",

    book:
      "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2ZM8 7h8M8 11h8",

    ruler:
      "m16 2 6 6L8 22l-6-6L16 2ZM14 4l4 4M10 8l2 2M6 12l4 4M2 16l4 4",
  };

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.clipboard} />
    </svg>
  );
}

/* =========================================
   EXTERNAL LINK ICON
========================================= */

function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/* =========================================
   SEARCH ICON
========================================= */

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/* =========================================
   MAIN RESULT PAGE
========================================= */

export default function ResultPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  /* =========================================
     CATEGORY OPTIONS
  ========================================= */

  const categories = useMemo(
    () => Array.from(
      new Set(trainingResults.map((item) => item.category))
    ),
    []
  );

  /* =========================================
     FILTER LOGIC
  ========================================= */

  const filteredResults = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return trainingResults.filter((item) => {
      // SEARCH
      const matchesSearch = [
        item.category,
        item.title,
        item.description,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      // CATEGORY
      const matchesCategory =
        categoryFilter === "ALL" ||
        item.category === categoryFilter;

      // TYPE
      let matchesType = true;

      if (typeFilter === "PRE TEST") {
        matchesType = item.type === "PRE TEST";
      } else if (typeFilter === "POST TEST") {
        matchesType = item.type === "POST TEST";
      } else if (typeFilter === "COMBINED") {
        matchesType =
          item.type === "PRE & POST TEST" ||
          item.type === "PRE TEST & POST TEST";
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [search, categoryFilter, typeFilter]);

  /* =========================================
     RESET FILTER
  ========================================= */

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("ALL");
    setTypeFilter("ALL");
  };

  const hasActiveFilter =
    search !== "" ||
    categoryFilter !== "ALL" ||
    typeFilter !== "ALL";

  /* =========================================
     LOGIN
  ========================================= */

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError(
        "Password yang kamu masukkan salah. Silakan coba lagi."
      );
      setPassword("");
    }
  };

  /* =========================================
     PASSWORD PAGE
  ========================================= */

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* LOGO */}

            <div className="mb-8 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4M12 15v3" />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight">
                Result Access
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Training Result Management
              </p>
            </div>

            {/* PASSWORD CARD */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">

              <div className="mb-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight">
                  Enter Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Halaman ini dilindungi password.
                  Masukkan password untuk mengakses hasil training.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <label
                  htmlFor="result-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="result-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 9 7 9 7a16 16 0 0 1-3 3.7M6.2 6.2C3.5 8 3 12 3 12s4 7 9 7a9 9 0 0 0 4-.9" />
                      </svg>
                    ) : (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  Unlock Result
                  <span>→</span>
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                Authorized Access Only
              </div>
            </div>

            <p className="mt-7 text-center text-xs text-slate-400">
              © 2026 BEI Quality Training
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================
     TRAINING RESULT PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Training Result
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Cek Hasil Training
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Akses hasil Pre Test dan Post Test untuk setiap program training
            melalui Google Sheets yang telah disediakan.
          </p>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Total {trainingResults.length} hasil training tersedia.
          </p>
        </div>
      </section>

      {/* SEARCH & FILTER */}

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          {/* FILTER HEADER */}

          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Cari Hasil Training
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Gunakan pencarian dan filter untuk menemukan hasil training.
              </p>
            </div>

            <span className="text-sm font-semibold text-blue-600">
              {filteredResults.length} dari {trainingResults.length} hasil
            </span>
          </div>

          {/* FILTER INPUTS */}

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div>
              <label
                htmlFor="training-search"
                className="mb-2 block text-xs font-bold text-slate-600"
              >
                PENCARIAN
              </label>

              <div className="relative">
                <input
                  id="training-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama training..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
                </span>
              </div>
            </div>

            {/* CATEGORY FILTER */}

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-bold text-slate-600"
              >
                KATEGORI TRAINING
              </label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="ALL">Semua Training</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* TYPE FILTER */}

            <div>
              <label
                htmlFor="type-filter"
                className="mb-2 block text-xs font-bold text-slate-600"
              >
                JENIS TEST
              </label>

              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* RESET FILTER */}

          {hasActiveFilter && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

              <p className="text-xs text-slate-500">
                Menampilkan {filteredResults.length} hasil sesuai filter.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-blue-600 transition hover:text-blue-800"
              >
                Reset Semua Filter ×
              </button>

            </div>
          )}

        </div>

        {/* TRAINING CARDS */}

        {filteredResults.length > 0 ? (

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {filteredResults.map((item) => (

              <a
                key={`${item.category}-${item.title}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >

                {/* DECORATIVE BACKGROUND */}

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">

                  {/* ICON */}

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-300 group-hover:scale-105">
                    <ResultIcon name={item.icon} />
                  </div>

                  {/* TYPE */}

                  <div className="mt-6">

                    <span className="text-[11px] font-bold tracking-[0.18em] text-slate-400">
                      {item.type}
                    </span>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {item.category}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                  </div>
                </div>

                {/* VIEW RESULT */}

                <div className="relative mt-auto flex items-center justify-between pt-7">

                  <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-900">
                    View Result
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
                    <ExternalLinkIcon />
                  </div>

                </div>

              </a>

            ))}

          </div>

        ) : (

          /* EMPTY STATE */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <SearchIcon />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Hasil Training Tidak Ditemukan
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Coba ubah kata kunci pencarian atau filter yang digunakan.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Reset Filter
            </button>

          </div>

        )}

      </section>

      {/* FOOTER */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

          <p>© 2026 BEI Quality Training</p>

          <p>Internal Training Result Management</p>

        </div>
      </footer>

    </main>
  );
}
