import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getContactDetails } from "@/lib/data/settings";
import "@/app/globals.css";

const notoSansBengali = localFont({
  src: "../fonts/noto-sans-bengali-400.woff2",
  variable: "--font-noto-sans-bengali",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: {
      template:
        locale === "bn"
          ? "%s | বিদ্যার্থী ফ্রি কোচিং সেন্টার"
          : "%s | Bidyarthi Free Coaching Centre",
      default:
        locale === "bn"
          ? "বিদ্যার্থী ফ্রি কোচিং সেন্টার"
          : "Bidyarthi Free Coaching Centre",
    },
    description:
      locale === "bn"
        ? "শিক্ষা, সংস্কৃতি ও সমাজসেবার এক অনন্য মেলবন্ধন"
        : "A unique blend of education, culture, and social service",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const [messages, contact] = await Promise.all([
    getMessages(),
    getContactDetails(),
  ]);

  const displayAddress = locale === 'bn' ? contact.address_bn : contact.address_en;

  return (
    <div
      className={`${notoSansBengali.variable} ${inter.variable} font-sans antialiased bg-surface-50 text-surface-900 min-h-screen flex flex-col`}
      dir={locale === "bn" ? "ltr" : "ltr"}
    >
      <NextIntlClientProvider messages={messages}>
        <a href="#main-content" className="skip-to-content">
          {typeof messages.a11y === "object" &&
          messages.a11y !== null &&
          "skipToContent" in messages.a11y
            ? String((messages.a11y as Record<string, unknown>).skipToContent)
            : "Skip to content"}
        </a>
        <Header />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer
          address={displayAddress}
          phone={contact.phone}
          email={contact.email}
        />
      </NextIntlClientProvider>
    </div>
  );
}
