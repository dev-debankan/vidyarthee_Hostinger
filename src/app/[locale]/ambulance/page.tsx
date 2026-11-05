import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("ambulance")} | ${t("siteName")}`,
    description:
      locale === "bn"
        ? "জরুরি প্রয়োজনে ২৪x৭ ঘণ্টা সাশ্রয়ী অ্যাম্বুলেন্স ও অক্সিজেন সিলিন্ডার সেবা।"
        : "24x7 emergency affordable ambulance and medical oxygen cylinder service in Simurali and surrounding areas.",
  };
}

export default async function AmbulancePage() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const services = isBn
    ? [
        { icon: "🚑", title: "জরুরি অ্যাম্বুলেন্স পরিবহন", desc: "জরুরি অসুস্থতায় রোগী দ্রুত নিকটবর্তী হাসপাতাল বা কলকাতায় স্থানান্তরের জন্য প্রস্তুত।" },
        { icon: "💨", title: "মেডিকেল অক্সিজেন সিলিন্ডার", desc: "শ্বাসকষ্ট ও জরুরি চিকিৎসায় সিলিন্ডার ও ফ্লোমিটার সরবরাহ সহায়তা।" },
        { icon: "🤝", title: "সাশ্রয়ী ও মানবিক মাশুল", desc: "অলাভজনক ভিত্তিমূল্যের ওপর পরিচালিত; হতদরিদ্রদের ক্ষেত্রে বিশেষ আর্থিক ছাড়।" },
      ]
    : [
        { icon: "🚑", title: "Emergency Ambulance Transport", desc: "Rapid transport to nearby subdivision/district hospitals or Kolkata super-speciality centres." },
        { icon: "💨", title: "Medical Oxygen Cylinders", desc: "Emergency medical oxygen cylinders with regulators and mask kits on short notice." },
        { icon: "🤝", title: "Subsidized Non-Profit Tariffs", desc: "Operated at cost recovery; subsidized or free assistance for indigent families." },
      ];

  return (
    <main>
      <Section variant="primary" className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              {isBn ? "জরুরি সেবা" : "24/7 Emergency Service"}
            </span>
            <Heading level={1} className="text-primary-900 text-3xl md:text-5xl font-extrabold tracking-tight">
              {isBn ? "অ্যাম্বুলেন্স ও অক্সিজেন পরিষেবা" : "Ambulance & Oxygen Service"}
            </Heading>
            <p className="text-base md:text-lg text-primary-800 leading-relaxed">
              {isBn
                ? "জরুরি চিকিৎসা পরিস্থিতিতে সময়মতো পৌঁছানোর জন্য সার্বক্ষণিক সাশ্রয়ী অ্যাম্বুলেন্স এবং অক্সিজেন সিলিন্ডার সহায়তা।"
                : "24-hour round-the-clock emergency patient transport and medical oxygen support serving Simurali and neighboring regions."}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-12 md:py-16">
        <Container>
          {/* Emergency Call Box */}
          <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-6 md:p-10 mb-12 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-rose-600 text-white">
                {isBn ? "জরুরি হেল্পলাইন" : "Emergency Helpline"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-rose-950">
                +91 98765 43210
              </h2>
              <p className="text-xs sm:text-sm text-rose-800">
                {isBn
                  ? "যে কোনো সময় অ্যাম্বুলেন্স ও অক্সিজেন বুকিংয়ের জন্য যোগাযোগ করুন।"
                  : "Call anytime day or night for immediate dispatch coordination."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-card"
              >
                📞 {isBn ? "এখনই কল করুন" : "Call Now"}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-white border border-rose-200 text-rose-900 hover:bg-rose-100 transition-colors shadow-2xs"
              >
                {isBn ? "অন্যান্য নম্বর" : "Contact Details"}
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {services.map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6 space-y-3">
                  <span className="text-3xl block" aria-hidden="true">{item.icon}</span>
                  <h3 className="font-bold text-base text-surface-900">{item.title}</h3>
                  <p className="text-xs text-surface-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Area */}
          <div className="rounded-2xl border border-surface-200 bg-white p-8 md:p-10 shadow-2xs space-y-4">
            <Heading level={2} className="text-surface-900">
              {isBn ? "পরিষেবার আওতাভুক্ত এলাকা" : "Coverage Area"}
            </Heading>
            <p className="text-sm text-surface-700 leading-relaxed">
              {isBn
                ? "শিমুরালি, চাকদহ, মদনপুর, কল্যাণী, রানাঘাট এবং সমগ্র নদীয়া ও উত্তর ২৪ পরগনা সংলগ্ন অঞ্চলের রোগীদের কলকাতা ও নিকটবর্তী সমস্ত হাসপাতালে যাতায়াতের সুবিধা রয়েছে।"
                : "Primary coverage includes Simurali, Chakdaha, Madanpur, Kalyani, Ranaghat, and nearby districts, coordinating patient transit to Kalyani AIIMS, JNM Hospital, or Kolkata medical hospitals."}
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
