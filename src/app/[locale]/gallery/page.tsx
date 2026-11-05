import {
  getPublicGalleryPhotos,
  getPublicGalleryVideos,
} from "@/lib/data/gallery";
import { PublicGalleryClient } from "./gallery-client";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn
      ? "গ্যালারি (ছবি ও ভিডিও) | বিদ্যার্থী ফ্রি কোচিং সেন্টার"
      : "Gallery (Photos & Videos) | Bidyarthi Free Coaching Centre",
    description: isBn
      ? "বিদ্যার্থী ফ্রি কোচিং সেন্টারের বিভিন্ন সামাজিক, সাংস্কৃতিক ও শিক্ষামূলক কর্মকাণ্ডের ছবি ও ভিডিও গ্যালারি।"
      : "Photo and video gallery of educational, cultural, and social welfare activities at Bidyarthi Free Coaching Centre.",
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = (locale as "bn" | "en") || "bn";
  const isBn = typedLocale === "bn";

  const [photosRes, videosRes] = await Promise.all([
    getPublicGalleryPhotos({ limit: 100 }),
    getPublicGalleryVideos({ limit: 100 }),
  ]);

  return (
    <main
      id="main-content"
      className="min-h-screen py-8 sm:py-12 bg-surface-50"
    >
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Heading level={1} decorated className="justify-center">
            {isBn ? "ফটো ও ভিডিও গ্যালারি" : "Photo & Video Gallery"}
          </Heading>
          <p className="text-surface-600 text-base sm:text-lg">
            {isBn
              ? "আমাদের পরিচালিত বিভিন্ন শিক্ষামূলক, সাংস্কৃতিক ও সমাজসেবামূলক কর্মকাণ্ডের স্মরণীয় মুহূর্তসমূহ।"
              : "Memorable moments from our educational, cultural, and community service activities."}
          </p>
        </div>

        {/* Gallery Client with Tabs, Lightbox & YouTube Facade */}
        <PublicGalleryClient
          initialPhotos={photosRes.photos}
          initialVideos={videosRes.videos}
          locale={typedLocale}
        />
      </Container>
    </main>
  );
}
