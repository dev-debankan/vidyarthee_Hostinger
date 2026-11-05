import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface FooterProps {
  address?: string;
  phone?: string;
  email?: string;
}

export function Footer({ address, phone, email }: FooterProps) {
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");

  const displayAddress = address || "Simurali, Nadia, West Bengal 741248";
  const displayPhone = phone || "+91 98765 43210";
  const displayEmail = email || "info@bidyarthi.org";
  const cleanPhone = displayPhone.replace(/[^0-9+]/g, "");

  const quickLinks = [
    { href: "/coaching", labelKey: "coaching" },
    { href: "/library", labelKey: "library" },
    { href: "/events", labelKey: "events" },
    { href: "/notices", labelKey: "notices" },
    { href: "/gallery", labelKey: "gallery" },
    { href: "/dispensary", labelKey: "dispensary" },
    { href: "/ambulance", labelKey: "ambulance" },
    { href: "/book-fair", labelKey: "bookFair" },
    { href: "/kindergarten", labelKey: "kindergarten" },
    { href: "/forms", labelKey: "forms" },
    { href: "/contact", labelKey: "contact" },
  ];

  return (
    <footer className="bg-surface-900 text-surface-200 pt-12 pb-8 border-t border-surface-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About Org */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                বি
              </div>
              <h2 className="font-bold text-lg text-white tracking-tight">
                {tCommon("siteName")}
              </h2>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              {tCommon("tagline")}
            </p>
            <p className="text-xs text-surface-400">
              Simurali, Nadia, West Bengal • Established 1987
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">
              {tFooter("quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 rounded-xs"
                  >
                    {tCommon(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">
              {tFooter("servicesTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.slice(6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-400 rounded-xs"
                  >
                    {tCommon(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Placeholders */}
          <div className="space-y-3 text-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-400 mb-4">
              {tCommon("contact")}
            </h3>
            <div className="flex items-start gap-2 text-surface-300">
              <svg className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                <strong className="block text-white text-xs">{tFooter("addressLabel")}</strong>
                {displayAddress}
              </span>
            </div>

            <div className="flex items-center gap-2 text-surface-300">
              <svg className="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>
                <strong className="inline text-white text-xs mr-1">{tFooter("phoneLabel")}:</strong>
                <a href={`tel:${cleanPhone}`} className="hover:text-white hover:underline transition-colors">
                  {displayPhone}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 text-surface-300">
              <svg className="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>
                <strong className="inline text-white text-xs mr-1">{tFooter("emailLabel")}:</strong>
                <a href={`mailto:${displayEmail}`} className="hover:text-white hover:underline transition-colors">
                  {displayEmail}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400">
          <p>{tFooter("copyright")}</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              {tCommon("contact")}
            </Link>
            <Link href="/notices" className="hover:text-white transition-colors">
              {tCommon("notices")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
