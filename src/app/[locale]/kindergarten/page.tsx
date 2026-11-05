import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("kindergarten")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "বিদ্যার্থী শিশু নিকেতন — ছোটদের জন্য আনন্দময় প্রারম্ভিক শিক্ষা কেন্দ্র।"
        : "Bidyarthi Shishu Niketan — Joyful early childhood learning center in Simurali.",
  };
}

export default async function KindergartenPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const pillars = isBn
    ? [
        { icon: "🧸", title: "খেলাচ্ছলে শিক্ষা", desc: "আনন্দময় ও শঙ্কাহীন পরিবেশে বর্ণপরিচয়, সংখ্যাজ্ঞান ও সৃজনশীল খেলাধুলো।" },
        { icon: "🎨", title: "শিল্পকলা ও সঙ্গীত", desc: "ছবি আঁকা, ছড়া বলা, হস্তশিল্প ও দলগত গানের মাধ্যমে নান্দনিক বিকাশ।" },
        { icon: "❤️", title: "স্নেহময় যত্ন ও শৃঙ্খলা", desc: "অভিজ্ঞ শিক্ষিকাদের তত্ত্বাবধানে স্বাস্থ্যবিধি, নিয়মশৃঙ্খলা ও মানবিক মূল্যবোধ।" },
      ]
    : [
        { icon: "🧸", title: "Play-Based Learning", desc: "Activity-oriented early literacy, counting, storytelling, and cooperative play." },
        { icon: "🎨", title: "Arts & Rhythm", desc: "Creative drawing, rhymes, crafting, and community singing for aesthetic growth." },
        { icon: "❤️", title: "Nurturing Environment", desc: "Attentive guidance from caring teachers fostering hygiene, empathy, and positive habits." },
      ];

  return (
    <main>
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800">
              {isBn ? "প্রাক-প্রাথমিক বিদ্যালয়" : "Early Childhood Education"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "বিদ্যার্থী শিশু নিকেতন" : "Bidyarthi Shishu Niketan"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "শিশুদের শৈশব হোক আনন্দমুখর। প্রাক-প্রাথমিক স্তরে শিশুদের স্বাভাবিক সুপ্ত প্রতিভার বিকাশ ও স্নেহের পরিবেশে প্রথম অক্ষরের পাঠ।"
                : "A warm and stimulating early learning centre dedicated to gentle childhood development, curiosity, and creative foundation."}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12 md:py-16">
        <Container>
          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pillars.map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6 space-y-3">
                  <span className="text-3xl block" aria-hidden="true">{item.icon}</span>
                  <h3 className="font-bold text-base text-surface-900">{item.title}</h3>
                  <p className="text-xs text-surface-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admission & Sessions Info */}
          <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-8 md:p-10 mb-12 shadow-2xs space-y-6">
            <Heading level={2} className="text-primary-950">
              {isBn ? "ভর্তি সংক্রান্ত তথ্য" : "Admissions & Timings"}
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-surface-800">
              <div>
                <h4 className="font-bold text-primary-900 mb-1">
                  {isBn ? "বয়সসীমা" : "Age Eligibility"}
                </h4>
                <p>{isBn ? "৩ বছর থেকে ৬ বছর বয়সী শিশুদের জন্য (নার্সারি ও কেজি)।" : "Ages 3 to 6 years (Nursery, LKG, and UKG levels)."}</p>
              </div>
              <div>
                <h4 className="font-bold text-primary-900 mb-1">
                  {isBn ? "ক্লাসের সময়" : "Session Timings"}
                </h4>
                <p>{isBn ? "সকাল ৮:০০ টা থেকে সকাল ১১:০০ টা পর্যন্ত (সোম থেকে শুক্রবার)।" : "Morning sessions: 8:00 AM – 11:00 AM (Monday through Friday)."}</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="text-center pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/forms"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
            >
              {isBn ? "ভর্তি আবেদন ফর্ম" : "Admission Application"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-white border border-surface-300 text-surface-800 hover:bg-surface-100 transition-colors shadow-2xs"
            >
              {isBn ? "স্কুল সম্পর্কিত অনুসন্ধান" : "Contact the School"}
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
