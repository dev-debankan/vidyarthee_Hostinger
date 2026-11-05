"use client";

import { useState, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav, type NavItem } from "./mobile-nav";

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/coaching", labelKey: "coaching" },
  { href: "/library", labelKey: "library" },
  { href: "/events", labelKey: "events" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/notices", labelKey: "notices" },
  { href: "/dispensary", labelKey: "dispensary" },
  { href: "/ambulance", labelKey: "ambulance" },
];

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tA11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-surface-200 shadow-xs transition-shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Logo & Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 group py-1 rounded-lg focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              বি
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-surface-900 group-hover:text-primary-700 transition-colors leading-tight">
                {tCommon("siteName")}
              </span>
              <span className="text-[11px] text-surface-500 font-medium">
                Simurali, Nadia • Est. 1987
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label={tNav("menu")} className="hidden xl:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors relative ${
                    isActive
                      ? "text-primary-800 bg-primary-50/80 font-bold"
                      : "text-surface-700 hover:text-primary-700 hover:bg-surface-100"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tCommon(item.labelKey)}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Switcher & Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-label={tA11y("openMenu")}
              className="xl:hidden p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        items={NAV_ITEMS}
        triggerRef={hamburgerRef}
      />
    </header>
  );
}
