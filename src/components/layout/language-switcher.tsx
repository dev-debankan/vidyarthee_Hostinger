"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("a11y");

  const targetLocale = locale === "bn" ? "en" : "bn";
  const label = targetLocale === "bn" ? "বাংলা" : "English";

  function toggleLanguage() {
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  }

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label={t("switchLanguage")}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] min-w-[44px] text-xs font-semibold rounded-lg border border-surface-300 bg-white/80 hover:bg-surface-100 text-surface-800 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 disabled:opacity-50"
    >
      <svg
        className="w-4 h-4 text-surface-600 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      <span className="uppercase font-mono text-[11px] tracking-wider text-surface-500">
        {locale}
      </span>
      <span className="text-surface-300">|</span>
      <span className="text-primary-700 font-bold">{label}</span>
    </button>
  );
}
