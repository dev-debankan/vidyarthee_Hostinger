import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("coaching")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "পঞ্চম থেকে দশম শ্রেণীর শিক্ষার্থীদের জন্য বিশেষজ্ঞ শিক্ষকদের দ্বারা বিনামূল্যে কোচিং ক্লাস।"
        : "Free coaching classes for students of Classes V to X taught by dedicated voluntary teachers.",
  };
}

export default async function CoachingPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const subjects = isBn
    ? [
        { name: "বাংলা", desc: "ব্যাকরণ, প্রবন্ধ ও পাঠ্য সাহিত্য প্রস্তুতি" },
        { name: "ইংরেজি", desc: "গ্রামার, রাইটিং স্কিল ও রিডিং কম্প্রিহেনশন" },
        { name: "গণিত", desc: "পাটিগণিত, বীজগণিত, জ্যামিতি ও ত্রিকোণমিতি" },
        { name: "ভৌত বিজ্ঞান", desc: "পদার্থবিজ্ঞান ও রসায়নবিজ্ঞানের মূল ধারণা" },
        { name: "জীবন বিজ্ঞান", desc: "জীববিজ্ঞান, শারীরবিদ্যা ও পরিবেশ পাঠ" },
        { name: "ইতিহাস ও ভূগোল", desc: "ভারত ও বিশ্বের ইতিহাস এবং আঞ্চলিক ভূগোল" },
      ]
    : [
        { name: "Bengali", desc: "Grammar, comprehension, and literature studies" },
        { name: "English", desc: "Grammar, structured writing skills, and reading" },
        { name: "Mathematics", desc: "Arithmetic, algebra, geometry, and trigonometry" },
        { name: "Physical Science", desc: "Core concepts of physics and fundamental chemistry" },
        { name: "Life Science", desc: "Biology, human physiology, and environment" },
        { name: "History & Geography", desc: "Indian/world history and geographical studies" },
      ];

  const schedule = isBn
    ? [
        { class: "পঞ্চম ও ষষ্ঠ শ্রেণী", days: "সোম, বুধ ও শুক্রবার", time: "বিকেল ৪:৩০ – সন্ধ্যা ৬:৩০" },
        { class: "সপ্তম ও অষ্টম শ্রেণী", days: "মঙ্গল, বৃহস্পতি ও শনিবার", time: "বিকেল ৪:৩০ – সন্ধ্যা ৬:৩০" },
        { class: "নবম ও দশম শ্রেণী", days: "সোম থেকে শনিবার", time: "সকাল ৭:০০ – ৯:০০ / সন্ধ্যা ৬:৩০ – ৮:৩০" },
      ]
    : [
        { class: "Classes V & VI", days: "Monday, Wednesday & Friday", time: "4:30 PM – 6:30 PM" },
        { class: "Classes VII & VIII", days: "Tuesday, Thursday & Saturday", time: "4:30 PM – 6:30 PM" },
        { class: "Classes IX & X (Madhyamik)", days: "Monday to Saturday", time: "7:00 AM – 9:00 AM / 6:30 PM – 8:30 PM" },
      ];

  return (
    <main>
      {/* Hero Section */}
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800">
              {isBn ? "শিক্ষামূলক প্রকল্প" : "Educational Initiative"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "বিনামূল্যে কোচিং ক্লাস" : "Free Coaching Programme"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "১৯৮৭ সাল থেকে শিমুরালি ও পার্শ্ববর্তী অঞ্চলের দুঃস্থ ও মেহনতি পরিবারের শিক্ষার্থীদের জন্য পঞ্চম থেকে দশম শ্রেণী পর্যন্ত সম্পূর্ণ নিখরচায় পাঠদান কর্মসূচি।"
                : "Providing completely free after-school academic tuition for underprivileged students of Classes V through X in Simurali and surrounding areas since 1987."}
            </p>
          </div>
        </Container>
      </Section>

      {/* Overview Cards */}
      <Section variant="default" className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mb-3">
                  🎓
                </div>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? "অভিজ্ঞ শিক্ষক মণ্ডলী" : "Experienced Educators"}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {isBn
                    ? "অবসরপ্রাপ্ত শিক্ষক ও শিক্ষানুরাগী তরুণ স্বেচ্ছাসেবকদের স্নেহের স্পর্শে প্রতিটি বিষয়ের খুঁটিনাটি ধারণা তৈরি।"
                    : "Passionate volunteer educators and retired teachers providing individualized attention and mentoring."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mb-3">
                  📖
                </div>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? "পাঠ্যবই ও নোটস বিতরণ" : "Study Materials"}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {isBn
                    ? "বিনামূল্যে খাতা, কলম ও সহায়ক রেফারেন্স নোটস বিতরণ। ছাত্র পাঠাগারের বই ব্যবহারের বিশেষ সুবিধা।"
                    : "Free notebooks, stationary, and curated revision sheets, along with direct access to library books."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mb-3">
                  📝
                </div>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? "নিয়মিত মক টেস্ট" : "Regular Mock Tests"}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {isBn
                    ? "মাধ্যমিক পরীক্ষার্থীদের জন্য বিশেষ মক টেস্ট সিরিজ এবং মডেল প্রশ্ন সমাধান করে পরীক্ষার ভীতি দূর করা।"
                    : "Periodic class tests and intensive mock exam series tailored for Madhyamik board examinees."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Subjects Grid */}
          <div className="mb-16">
            <Heading level={2} className="mb-8 text-surface-900">
              {isBn ? "পাঠদানের বিষয়সমূহ" : "Subjects Taught"}
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((sub) => (
                <div key={sub.name} className="p-5 rounded-xl border border-surface-200 bg-white shadow-2xs">
                  <h4 className="font-bold text-base text-surface-900 mb-1">{sub.name}</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Table */}
          <div className="mb-16">
            <Heading level={2} className="mb-6 text-surface-900">
              {isBn ? "ক্লাসের সময়সূচী" : "Class Schedule"}
            </Heading>
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-2xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-100 text-surface-700 uppercase font-semibold text-xs border-b border-surface-200">
                  <tr>
                    <th className="px-6 py-4">{isBn ? "শ্রেণী" : "Grade / Level"}</th>
                    <th className="px-6 py-4">{isBn ? "বার / দিন" : "Days"}</th>
                    <th className="px-6 py-4">{isBn ? "সময়" : "Timings"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {schedule.map((row) => (
                    <tr key={row.class} className="hover:bg-surface-50">
                      <td className="px-6 py-4 font-semibold text-surface-900">{row.class}</td>
                      <td className="px-6 py-4 text-surface-700">{row.days}</td>
                      <td className="px-6 py-4 text-surface-700">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission & CTA */}
          <div className="rounded-2xl bg-primary-50 border border-primary-200 p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold text-primary-950">
                {isBn ? "ভর্তির নিয়ম ও যোগ্যতা" : "Eligibility & Admission"}
              </h3>
              <p className="text-sm text-primary-800 max-w-xl leading-relaxed">
                {isBn
                  ? "যে কোনো সাধারণ ও সুবিধাবঞ্চিত পরিবারের পঞ্চম থেকে দশম শ্রেণীর ছাত্রছাত্রী ভর্তির জন্য আবেদন করতে পারে। কোনো টিউশন ফি নেওয়া হয় না।"
                  : "Admissions are open to all students from economically disadvantaged families. There are zero fees or charges."}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/forms"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
              >
                {isBn ? "আবেদন ফর্ম" : "Online Form"}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-white border border-surface-300 text-surface-800 hover:bg-surface-100 transition-colors shadow-2xs"
              >
                {isBn ? "যোগাযোগ" : "Contact Us"}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
