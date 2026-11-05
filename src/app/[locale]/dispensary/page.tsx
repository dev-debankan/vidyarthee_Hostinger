import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("dispensary")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "বিনামূল্যে হোমিওপ্যাথি চিকিৎসা সেবা ও প্রয়োজনীয় ঔষধ বিতরণ কেন্দ্র।"
        : "Charitable homeopathic dispensary providing free medical consultations and medicines in Simurali.",
  };
}

export default async function DispensaryPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const features = isBn
    ? [
        { icon: "🩺", title: "বিনামূল্যে চিকিৎসা পরামর্শ", desc: "অভিজ্ঞ ও রেজিস্টার্ড হোমিওপ্যাথিক চিকিৎসকদের দ্বারা নিয়মিত রোগী পরীক্ষা।" },
        { icon: "💊", title: "সম্পূর্ণ নিখরচায় ঔষধ", desc: "রোগীদের প্রয়োজনীয় উৎকৃষ্ট মানের হোমিওপ্যাথিক ঔষধ সম্পূর্ণ বিনামূল্যে প্রদান।" },
        { icon: "🌿", title: "স্বাস্থ্য সচেতনতা শিবির", desc: "মৌসুমি রোগ, ডেঙ্গু, ম্যালেরিয়া ও সাধারণ স্বাস্থ্য বিষয়ে নিয়মিত সচেতনতা মূলক ক্যাম্প।" },
      ]
    : [
        { icon: "🩺", title: "Free Doctor Consultations", desc: "Consultations and check-ups conducted by experienced registered homeopathic physicians." },
        { icon: "💊", title: "Free Medicine Distribution", desc: "High-quality homeopathic medicines dispensed entirely free of charge to patients." },
        { icon: "🌿", title: "Health Awareness Camps", desc: "Periodic medical camps on seasonal prevention, vector-borne diseases, and maternal hygiene." },
      ];

  return (
    <main>
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800">
              {isBn ? "স্বাস্থ্য সেবা" : "Healthcare Initiative"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "দাতব্য চিকিৎসালয়" : "Charitable Dispensary"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "সমাজের অর্থনৈতিকভাবে পিছিয়ে পড়া ও অসহায় মানুষদের প্রাথমিক স্বাস্থ্য সেবা পৌঁছে দিতে বিদ্যার্থীর পক্ষ থেকে পরিচালিত বিনামূল্যে হোমিওপ্যাথিক চিকিৎসালয়।"
                : "Dedicated to providing accessible primary healthcare, our charitable clinic offers free consultation and homeopathic remedies to underprivileged communities."}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12 md:py-16">
        <Container>
          {/* Timings & Highlights Card */}
          <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-6 md:p-8 mb-12 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-primary-950">
                {isBn ? "ক্লিনিক ও রোগী দেখার সময়সূচী" : "Clinic Schedule & Timings"}
              </h3>
              <p className="text-sm text-primary-800">
                {isBn
                  ? "প্রতি রবিবার সকাল ৯:০০ টা থেকে দুপুর ১২:০০ টা পর্যন্ত (বিদ্যার্থী ভবন, শিমুরালি)।"
                  : "Every Sunday morning from 9:00 AM to 12:00 PM at Bidyarthi Bhavan, Simurali."}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0 shadow-xs"
            >
              {isBn ? "ঠিকানা ও যোগাযোগের তথ্য" : "Location & Details"}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feat) => (
              <Card key={feat.title}>
                <CardContent className="pt-6 space-y-3">
                  <span className="text-3xl block" aria-hidden="true">{feat.icon}</span>
                  <h3 className="font-bold text-base text-surface-900">{feat.title}</h3>
                  <p className="text-xs text-surface-600 leading-relaxed">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Message */}
          <div className="rounded-2xl border border-surface-200 bg-white p-8 md:p-10 shadow-2xs max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-bold text-surface-900">
              {isBn ? "চিকিৎসায় সেবা, সহমর্মিতায় উন্নয়ন" : "Compassionate Care for Every Citizen"}
            </h3>
            <p className="text-sm text-surface-600 leading-relaxed">
              {isBn
                ? "আমাদের চিকিৎসালয়ে কোনো রকম রেজিস্ট্রেশন ফি বা প্রেসক্রিপশন চার্জ নেওয়া হয় না। রোগমুক্ত সুস্থ সমাজ গড়ে তোলাই আমাদের লক্ষ্য।"
                : "No patient is ever turned away due to financial hardship. All consultations, diagnostics, and remedies are entirely voluntary and complimentary."}
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
