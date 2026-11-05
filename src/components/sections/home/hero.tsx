"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";

interface HeroSectionProps {
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
}

export function HeroSection({ heroTitle, heroSubtitle, introText }: HeroSectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  const displayTitle = heroTitle || t("heroTitle");
  const displaySubtitle = heroSubtitle || t("heroSubtitle");
  const displayIntro = introText || t("introText");

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-primary-50/60 via-surface-50 to-surface-50 border-b border-surface-200">
      {/* Decorative background glow */}
      <div
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 -z-10 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-800 text-xs sm:text-sm font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            <span>Simurali, Nadia • Est. 1987</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
            {displayTitle}
          </h1>

          {/* Subtitle & Short Intro */}
          <p className="text-lg sm:text-xl text-surface-700 font-medium max-w-2xl mx-auto leading-relaxed">
            {displaySubtitle}
          </p>
          <p className="text-sm sm:text-base text-surface-600 max-w-xl mx-auto">
            {displayIntro}
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/coaching"
              className="inline-flex items-center justify-center px-6 py-3.5 min-h-[44px] text-base font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-card hover:shadow-elevated focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              {tCommon("coaching")}
            </Link>
            <Link
              href="/notices"
              className="inline-flex items-center justify-center px-6 py-3.5 min-h-[44px] text-base font-semibold rounded-xl bg-white border border-surface-300 text-surface-800 hover:bg-surface-100 transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              {tCommon("notices")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 min-h-[44px] text-base font-semibold rounded-xl bg-accent-700 text-white hover:bg-accent-800 transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              {tCommon("contact")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
