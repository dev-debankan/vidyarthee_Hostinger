import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("library")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "৫,০০০+ বই সম্বলিত সুবিশাল ছাত্র পাঠাগার ও শান্ত অধ্যয়ন পরিবেশ।"
        : "Students' library with 5,000+ books, reference collections, and quiet reading environment in Simurali.",
  };
}

export default async function LibraryPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const categories = isBn
    ? [
        { title: "পাঠ্য ও সহায়ক পুস্তক", count: "১,৮০০+ বই", desc: "বিদ্যালয় ও কলেজ পাঠ্যক্রমের বই এবং সহায়িকা।" },
        { title: "সাহিত্য ও গল্প", count: "১,৫০০+ বই", desc: "বাংলা ও বিশ্বসাহিত্যের উপন্যাস, গল্প, কবিতা ও নাটক।" },
        { title: "বিজ্ঞান ও সাধারণ জ্ঞান", count: "৮০০+ বই", desc: "মহাকাশ, ইতিহাস, পরিবেশ ও সাধারণ জ্ঞানের বই।" },
        { title: "প্রতিযোগিতামূলক পরীক্ষা", count: "৫০০+ বই", desc: "প্রবেশিকা ও সরকারি চাকরি পরীক্ষার প্রস্তুতি সামগ্রী।" },
        { title: "শিশু-কিশোর সাহিত্য", count: "৪০০+ বই", desc: "ছোটদের শিক্ষামূলক কমিকস, রূপকথা ও জীবনী গ্রন্থ।" },
      ]
    : [
        { title: "Textbooks & Guides", count: "1,800+ Books", desc: "Curriculum textbooks, guides, and reference material for schools and colleges." },
        { title: "Literature & Fiction", count: "1,500+ Books", desc: "Classics of Bengali and world literature, poetry, drama, and essays." },
        { title: "Science & General Knowledge", count: "800+ Books", desc: "Popular science, history, ecology, geography, and encyclopedia." },
        { title: "Competitive Examinations", count: "500+ Books", desc: "Aptitude, entrance, and competitive exam preparatory books." },
        { title: "Children's Collection", count: "400+ Books", desc: "Illustrated stories, fairy tales, folk stories, and inspirational biographies." },
      ];

  return (
    <main>
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800">
              {isBn ? "ছাত্র পাঠাগার" : "Students' Library"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "বিদ্যার্থী ছাত্র পাঠাগার" : "Bidyarthi Students' Library"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "৫,০০০-এর বেশি বই নিয়ে গঠিত আমাদের পাঠাগার শিক্ষার্থীদের মধ্যে পাঠাভ্যাস গড়ে তোলা এবং আর্থিক অনটনে বই কিনতে না পারা ছাত্রছাত্রীদের পাশে দাঁড়িয়েছে।"
                : "Housing over 5,000 titles, our library nurtures reading habits and supports students who cannot afford expensive textbooks and reference materials."}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12 md:py-16">
        <Container>
          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white border border-surface-200 text-center shadow-2xs">
              <div className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">
                {isBn ? "৫,০০০+" : "5,000+"}
              </div>
              <p className="text-xs text-surface-600 font-semibold uppercase tracking-wider">
                {isBn ? "মোট বই সংগ্রহ" : "Total Books"}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-surface-200 text-center shadow-2xs">
              <div className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">
                {isBn ? "বিকাল ৪ – রাত ৮" : "4 PM – 8 PM"}
              </div>
              <p className="text-xs text-surface-600 font-semibold uppercase tracking-wider">
                {isBn ? "পাঠাগার খোলার সময়" : "Daily Timings"}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-surface-200 text-center shadow-2xs">
              <div className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">
                {isBn ? "নিখরচায়" : "Free"}
              </div>
              <p className="text-xs text-surface-600 font-semibold uppercase tracking-wider">
                {isBn ? "সদস্যপদ ফি" : "Membership Cost"}
              </p>
            </div>
          </div>

          {/* Book Categories */}
          <div className="mb-16">
            <Heading level={2} className="mb-8 text-surface-900">
              {isBn ? "বই সংগ্রহ ও বিভাগ" : "Collections & Catalog"}
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Card key={cat.title}>
                  <CardContent className="pt-6">
                    <span className="text-xs font-bold text-primary-700 block mb-1">{cat.count}</span>
                    <h3 className="font-bold text-base text-surface-900 mb-2">{cat.title}</h3>
                    <p className="text-xs text-surface-600 leading-relaxed">{cat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rules & Membership */}
          <div className="rounded-2xl border border-surface-200 bg-white p-8 md:p-10 mb-12 shadow-2xs space-y-6">
            <Heading level={2} className="text-surface-900">
              {isBn ? "সদস্যপদ ও ধার নেওয়ার নিয়মাবলী" : "Membership & Borrowing Rules"}
            </Heading>
            <ul className="space-y-3 text-sm text-surface-700 list-disc list-inside leading-relaxed">
              <li>{isBn ? "সিমুরালি ও সংলগ্ন এলাকার যে কোনো ছাত্রছাত্রী বিনামূল্যে সদস্যপদ গ্রহণ করতে পারবে।" : "Any school or college student from Simurali and surrounding areas is eligible for free membership."}</li>
              <li>{isBn ? "একজন সদস্য একসাথে সর্বোচ্চ ২টি বই ১৫ দিনের জন্য বাড়িতে ধার নিতে পারেন।" : "Members may borrow up to two books at a time for an initial period of 15 days."}</li>
              <li>{isBn ? "পাঠকক্ষে বসে সংবাদপত্র ও সাময়িক পত্রিকা পড়ার জন্য শান্ত ও মনোরম পরিবেশ বজায় রাখুন।" : "Maintain silence in the reading room while consulting newspapers, magazines, and rare reference volumes."}</li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="text-center pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
            >
              {isBn ? "পাঠাগার সম্পর্কে যোগাযোগ করুন" : "Inquire About Membership"}
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
