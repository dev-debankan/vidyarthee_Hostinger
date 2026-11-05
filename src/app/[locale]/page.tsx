import { getHighlights } from "@/lib/data/highlights";
import { getLatestNotices } from "@/lib/data/notices";
import { getUpcomingEvents } from "@/lib/data/events";
import { getLeadershipMessages } from "@/lib/data/messages";
import { getContactDetails } from "@/lib/data/settings";

import { HeroSection } from "@/components/sections/home/hero";
import { LeadershipMessagesSection } from "@/components/sections/home/leadership-messages";
import { HighlightsSection } from "@/components/sections/home/highlights-section";
import { LatestNoticesSection } from "@/components/sections/home/latest-notices";
import { UpcomingEventsSection } from "@/components/sections/home/upcoming-events";
import { QuickLinksSection } from "@/components/sections/home/quick-links";

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = (locale as 'bn' | 'en') || 'bn';

  const [highlights, notices, events, messages, contact] = await Promise.all([
    getHighlights(),
    getLatestNotices(5),
    getUpcomingEvents(3),
    getLeadershipMessages(),
    getContactDetails(),
  ]);

  const heroTitle = typedLocale === 'en' ? contact.hero_title_en : contact.hero_title_bn;
  const heroSubtitle = typedLocale === 'en' ? contact.hero_subtitle_en : contact.hero_subtitle_bn;
  const introText = typedLocale === 'en' ? contact.intro_en : contact.intro_bn;

  return (
    <div className="flex flex-col space-y-0">
      {/* 1. Hero & Short Intro */}
      <HeroSection
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        introText={introText}
      />

      {/* 2. President's Message and Secretary's Message */}
      <LeadershipMessagesSection messages={messages} />

      {/* 3. Highlights / Initiatives */}
      <HighlightsSection highlights={highlights} />

      {/* 4. Latest Notices (5 notices + View All) */}
      <LatestNoticesSection notices={notices} now={Date.now()} />

      {/* 5. Upcoming Events */}
      <UpcomingEventsSection events={events} />

      {/* 6. Quick Links */}
      <QuickLinksSection />
    </div>
  );
}
