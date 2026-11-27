
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Modules", href: "/modules" },
];

const assessmentItems = [
  {
    name: "Pre-Test",
    href: "/pre-test",
    description: "Ukur kemampuan awal sebelum training.",
  },
  {
    name: "Post-Test",
    href: "/post-test",
    description: "Evaluasi pemahaman setelah training.",
  },
  {
    name: "Result",
    href: "/result",
    description: "Lihat dan kelola hasil assessment.",
  },
];

const toolItems = [
  {
    name: "ERP To Gsheet",
    href: "/erp-to-gsheet",
    description: "Transfer dan olah data ERP ke Google Sheets.",
  },
  {
    name: "Report PDI",
    href: "/report-pdi",
    description: "Generate dan kelola laporan inspeksi PDI.",
  },
  {
    name: "Report Rechecking",
    href: "/report-rechecking",
    description: "Generate dan kelola laporan Rechecking.",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const isHomePage = pathname === "/";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAssessmentActive = assessmentItems.some((item) =>
    isActive(item.href)
  );

  const isToolsActive = toolItems.some((item) => isActive(item.href));

  const closeMenus = () => {
    setIsOpen(false);
    setAssessmentOpen(false);
    setToolsOpen(false);
  };

  const desktopLinkClass = (href: string) =>
    isActive(href)
      ? "rounded-[10px] bg-slate-100 px-4 py-2.5 text-[14px] font-semibold text-[#0b1220]"
      : "rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#0b1220]";

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? "rounded-[9px] bg-slate-100 px-4 py-3 text-[14px] font-semibold text-[#0b1220]"
      : "rounded-[9px] px-4 py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50";

  const dropdownButtonClass = (active: boolean) =>
    `flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-colors ${
      active
        ? "bg-slate-100 text-[#0b1220]"
        : "text-slate-500 hover:bg-slate-50 hover:text-[#0b1220]"
    }`;

  const mobileDropdownClass = (active: boolean) =>
    `flex w-full items-center justify-between rounded-[9px] px-4 py-3 text-[14px] font-semibold transition-colors ${
      active
        ? "bg-slate-100 text-[#0b1220]"
        : "text-slate-600 hover:bg-slate-50"
    }`;

  const Arrow = ({ open }: { open: boolean }) => (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* DESKTOP HEADER */}
        <div className="flex h-[76px] items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[11px]">
              <img
                src="/icon.png"
                alt="BEI Quality logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-black tracking-[-0.02em] text-[#0b1220]">
                BEI QUALITY
              </div>
              <div className="mt-[5px] text-[9px] font-medium tracking-[0.2em] text-slate-400">
                TRAINING CENTER
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={desktopLinkClass(item.href)}
              >
                {item.name}
              </Link>
            ))}

            {/* TOOLS DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={toolsOpen}
                onClick={() => {
                  setToolsOpen((prev) => !prev);
                  setAssessmentOpen(false);
                }}
                className={dropdownButtonClass(isToolsActive || toolsOpen)}
              >
                Tools
                <Arrow open={toolsOpen} />
              </button>

              {toolsOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[290px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {toolItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className={`block rounded-lg px-4 py-3 transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[14px] font-bold">
                        {item.name}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ASSESSMENT DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={assessmentOpen}
                onClick={() => {
                  setAssessmentOpen((prev) => !prev);
                  setToolsOpen(false);
                }}
                className={dropdownButtonClass(
                  isAssessmentActive || assessmentOpen
                )}
              >
                Assessment
                <Arrow open={assessmentOpen} />
              </button>

              {assessmentOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[270px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {assessmentItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className={`block rounded-lg px-4 py-3 transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[14px] font-bold">
                        {item.name}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CONTACT */}
            <Link
              href="/contact"
              onClick={closeMenus}
              className={desktopLinkClass("/contact")}
            >
              Contact
            </Link>
          </nav>

          {/* RIGHT BUTTON DESKTOP */}
          {isHomePage ? (
            <Link
              href="/modules"
              className="hidden items-center gap-2 rounded-[10px] bg-[#0b1220] px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-blue-600 md:flex"
            >
              Start Training
              <span className="text-[16px] leading-none">→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden items-center rounded-[10px] border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0b1220] md:flex"
            >
              Back to Home
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            onClick={() => {
              setIsOpen((prev) => !prev);
              setAssessmentOpen(false);
              setToolsOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-slate-200 bg-white text-[#0b1220] md:hidden"
          >
            {isOpen ? (
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {isOpen && (
          <div className="border-t border-slate-200 py-3 md:hidden">
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={mobileLinkClass(item.href)}
                >
                  {item.name}
                </Link>
              ))}

              {/* MOBILE TOOLS */}
              <div>
                <button
                  type="button"
                  aria-expanded={toolsOpen}
                  onClick={() => {
                    setToolsOpen((prev) => !prev);
                    setAssessmentOpen(false);
                  }}
                  className={mobileDropdownClass(isToolsActive || toolsOpen)}
                >
                  Tools
                  <Arrow open={toolsOpen} />
                </button>

                {toolsOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-200 pl-3">
                    {toolItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        className={`rounded-[9px] px-4 py-3 text-[13px] font-semibold transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-[#0b1220]"
                        }`}
                      >
                        <div>{item.name}</div>
                        <div className="mt-1 text-[11px] font-normal text-slate-400">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* MOBILE ASSESSMENT */}
              <div>
                <button
                  type="button"
                  aria-expanded={assessmentOpen}
                  onClick={() => {
                    setAssessmentOpen((prev) => !prev);
                    setToolsOpen(false);
                  }}
                  className={mobileDropdownClass(
                    isAssessmentActive || assessmentOpen
                  )}
                >
                  Assessment
                  <Arrow open={assessmentOpen} />
                </button>

                {assessmentOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-200 pl-3">
                    {assessmentItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        className={`rounded-[9px] px-4 py-3 text-[13px] font-semibold transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-[#0b1220]"
                        }`}
                      >
                        <div>{item.name}</div>
                        <div className="mt-1 text-[11px] font-normal text-slate-400">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* MOBILE CONTACT */}
              <Link
                href="/contact"
                onClick={closeMenus}
                className={mobileLinkClass("/contact")}
              >
                Contact
              </Link>
            </nav>

            {/* MOBILE RIGHT BUTTON */}
            {isHomePage ? (
              <Link
                href="/modules"
                onClick={closeMenus}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[9px] bg-[#0b1220] px-5 py-3 text-[14px] font-bold text-white"
              >
                Start Training
                <span>→</span>
              </Link>
            ) : (
              <Link
                href="/"
                onClick={closeMenus}
                className="mt-3 flex w-full items-center justify-center rounded-[9px] border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-700"
              >
                Back to Home
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
