"use client";

import { useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export interface NavItem {
  href: string;
  labelKey: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNav({ isOpen, onClose, items, triggerRef }: MobileNavProps) {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element inside the drawer
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const drawerEl = drawerRef.current;
    if (drawerEl) {
      const focusables = drawerEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerEl) {
        const focusables = Array.from(
          drawerEl.querySelectorAll<HTMLElement>(focusableSelector)
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={tNav("menu")}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => {
          onClose();
          triggerRef.current?.focus();
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-elevated flex flex-col justify-between overflow-y-auto p-6 transition-transform duration-300 transform translate-x-0"
      >
        <div>
          {/* Header row in drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-200 mb-6">
            <span className="font-bold text-lg text-primary-800 tracking-tight">
              {tCommon("siteName")}
            </span>
            <button
              onClick={() => {
                onClose();
                triggerRef.current?.focus();
              }}
              className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600"
              aria-label={tA11y("closeMenu")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label={tNav("menu")}>
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        onClose();
                        triggerRef.current?.focus();
                      }}
                      className={`flex items-center px-4 py-3 min-h-[44px] rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-800 font-bold border-l-4 border-primary-600 pl-3"
                          : "text-surface-700 hover:bg-surface-100 hover:text-surface-900"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {tCommon(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Drawer Footer with Language Switcher */}
        <div className="pt-6 mt-6 border-t border-surface-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-surface-500 font-medium">{tNav("languageSwitcher")}</span>
            <LanguageSwitcher />
          </div>
          <p className="text-xs text-surface-400 text-center">
            {tCommon("tagline")}
          </p>
        </div>
      </div>
    </div>
  );
}
