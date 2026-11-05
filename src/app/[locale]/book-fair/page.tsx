import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("bookFair")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "শিমুরালির ঐতিহ্যবাহী বার্ষিক সাহিত্য ও বইমেলা উৎসব।"
        : "Annual Simurali Book Fair organized by Bidyarthi Free Coaching Centre.",
  };
}

export default async function BookFairPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const highlights = isBn
    ? [
        { icon: "🎪", title: "প্রকাশক ও পুস্তক বিপণি", desc: "কলকাতা ও বিভিন্ন প্রান্তের বহু স্বনামধন্য প্রকাশনা সংস্থার স্টল ও বইয়ের সম্ভার।" },
        { icon: "🎭", title: "সাংস্কৃতিক মঞ্চ ও সেমিনার", desc: "কবিতা পাঠ, বিতর্ক, নাটক, সঙ্গীত ও বিশিষ্ট সাহিত্যিকদের উপস্থিতিতে সান্ধ্য অনুষ্ঠান।" },
        { icon: "🎨", title: "ছাত্রছাত্রীদের প্রতিযোগিতা", desc: "বসে আঁকো প্রতিযোগিতা, তাৎক্ষণিক বক্তৃতা ও ক্যুইজ প্রতিযোগিতা।" },
      ]
    : [
        { icon: "🎪", title: "Publishers & Book Stalls", desc: "Stalls by prominent Kolkata publishers and regional independent presses." },
        { icon: "🎭", title: "Cultural Evenings & Seminars", desc: "Literary seminars, poetry readings, drama, musical performances, and author interactions." },
        { icon: "🎨", title: "Student Competitions", desc: "Sit-and-draw contests, extempore speech, recitation, and inter-school quiz events." },
      ];

  return (
    <main>
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
              {isBn ? "বার্ষিক সাহিত্য উৎসব" : "Annual Literary Festival"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "শিমুরালি বার্ষিক বইমেলা" : "Annual Simurali Book Fair"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "শিমুরালি ও বিস্তীর্ণ এলাকার অন্যতম প্রধান সাংস্কৃতিক উৎসব। সাহিত্যপ্রেমী মানুষের মিলনমেলা ও তরুণ প্রজন্মের মধ্যে বই পড়ার আলো জ্বালানোর অঙ্গীকার।"
                : "One of the most anticipated cultural gatherings in Simurali, celebrating regional literature, performing arts, and book culture for decades."}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12 md:py-16">
        <Container>
          {/* Fair Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {highlights.map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6 space-y-3">
                  <span className="text-3xl block" aria-hidden="true">{item.icon}</span>
                  <h3 className="font-bold text-base text-surface-900">{item.title}</h3>
                  <p className="text-xs text-surface-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stall Allocation Info */}
          <div className="rounded-2xl border border-surface-200 bg-white p-8 md:p-10 mb-12 shadow-2xs space-y-4">
            <Heading level={2} className="text-surface-900">
              {isBn ? "স্টল আবণ্টন ও অংশগ্রহণ" : "Stall Participation & Guidelines"}
            </Heading>
            <p className="text-sm text-surface-700 leading-relaxed">
              {isBn
                ? "বইমেলায় স্টল বুকিংয়ের জন্য প্রকাশনা সংস্থা ও বিক্রেতাদের নির্দিষ্ট সময়ের মধ্যে আবেদন ফর্ম জমা দিতে হয়। মেলা সংক্রান্ত সর্বশেষ নোটিশ দেখতে নোটিশ বোর্ড দেখুন।"
                : "Publishers, literary societies, and educational vendors interested in setting up exhibits can obtain application details from our official notice board."}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/notices"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
              >
                {isBn ? "বইমেলা সংক্রান্ত নোটিশ" : "Book Fair Notices"}
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-surface-100 text-surface-800 hover:bg-surface-200 transition-colors border border-surface-300 shadow-2xs"
              >
                {isBn ? "আসন্ন অনুষ্ঠান" : "View Events Schedule"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
