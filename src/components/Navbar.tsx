"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Modules",
    href: "/modules",
  },
  {
    name: "Pre-Test",
    href: "/pre-test",
  },
  {
    name: "Post-Test",
    href: "/post-test",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = pathname === "/";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

        {/* NAVBAR*/}

        <div className="flex h-[76px] items-center justify-between">

          {/*LOGO*/}

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#0b1220] text-[14px] font-black tracking-[-0.04em] text-white">
              BQ
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

          {/*DESKTOP MENU*/}

          <nav className="hidden items-center gap-0.5 md:flex">

            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "rounded-[10px] bg-slate-100 px-4 py-2.5 text-[14px] font-semibold text-[#0b1220]"
                      : "rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#0b1220]"
                  }
                >
                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/*RIGHT BUTTON*/}

          {isHomePage ? (
            <Link
              href="/modules"
              className="hidden items-center gap-2 rounded-[10px] bg-[#0b1220] px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-blue-600 md:flex"
            >
              Start Training
              <span className="text-[16px] leading-none">
                →
              </span>
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden items-center rounded-[10px] border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0b1220] md:flex"
            >
              Back to Home
            </Link>
          )}

          {/*MOBILE MENU BUTTON*/}

          <button
            type="button"
            aria-label={
              isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-slate-200 bg-white text-[#0b1220] md:hidden"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
                xmlns="http://www.w3.org/2000/svg"
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

        {/* MOBILE MENU*/}

        {isOpen && (
          <div className="border-t border-slate-200 py-3 md:hidden">

            <nav className="flex flex-col gap-0.5">

              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      active
                        ? "rounded-[9px] bg-slate-100 px-4 py-3 text-[14px] font-semibold text-[#0b1220]"
                        : "rounded-[9px] px-4 py-3 text-[14px] font-semibold text-slate-600 hover:bg-slate-50"
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}

            </nav>

            {isHomePage ? (
              <Link
                href="/modules"
                onClick={() => setIsOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[9px] bg-[#0b1220] px-5 py-3 text-[14px] font-bold text-white"
              >
                Start Training
                <span>→</span>
              </Link>
            ) : (
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
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