import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

export function QuickLinksSection() {
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "bn" | "en";

  const quickActions = [
    {
      href: "/forms",
      titleKey: "forms",
      desc_bn: "অনলাইন ভর্তি ও স্বেচ্ছাসেবক আবেদন ফর্ম।",
      desc_en: "Online admission and volunteer application forms.",
      color: "bg-amber-50 border-amber-200 text-amber-900",
      icon: "📝",
    },
    {
      href: "/ambulance",
      titleKey: "ambulance",
      desc_bn: "জরুরি অ্যাম্বুলেন্স ও অক্সিজেন বুকিং সেবা।",
      desc_en: "Emergency ambulance and oxygen cylinder booking.",
      color: "bg-rose-50 border-rose-200 text-rose-900",
      icon: "🚑",
    },
    {
      href: "/library",
      titleKey: "library",
      desc_bn: "বই ক্যাটালগ ও পাঠাগারের সদস্যপদ সংক্রান্ত নিয়মাবলী।",
      desc_en: "Book catalog and library membership guidelines.",
      color: "bg-teal-50 border-teal-200 text-teal-900",
      icon: "📚",
    },
    {
      href: "/contact",
      titleKey: "contact",
      desc_bn: "সরাসরি ফোন, ঠিকানা অথবা বার্তার মাধ্যমে যোগাযোগ করুন।",
      desc_en: "Contact directly via phone, address, or message form.",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      icon: "📍",
    },
  ];

  return (
    <Section className="bg-surface-100/60 py-12 md:py-16">
      <div className="text-center mb-10">
        <Heading level={2} decorated className="text-surface-900 justify-center">
          {tHome("quickLinksTitle")}
        </Heading>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`p-6 rounded-2xl border transition-transform hover:-translate-y-1 shadow-card flex flex-col justify-between group ${action.color}`}
          >
            <div className="space-y-3">
              <span className="text-3xl block" aria-hidden="true">
                {action.icon}
              </span>
              <h3 className="text-lg font-bold leading-snug">
                {tCommon(action.titleKey)}
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                {locale === "bn" ? action.desc_bn : action.desc_en}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-end text-xs font-bold gap-1 group-hover:underline">
              <span>{tCommon(action.titleKey)}</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
