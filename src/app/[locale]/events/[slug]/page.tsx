import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getEventBySlug } from "@/lib/data/events";
import { Container, Heading, Badge } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  const title =
    locale === "en" && event.title_en ? event.title_en : event.title_bn;
  const description =
    locale === "en" && event.description_en
      ? event.description_en.slice(0, 160)
      : event.description_bn.slice(0, 160);

  return {
    title: `${title} | Bidyarthi Free Coaching Centre`,
    description,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const title =
    locale === "en" && event.title_en ? event.title_en : event.title_bn;
  const description =
    locale === "en" && event.description_en
      ? event.description_en
      : event.description_bn;

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div className="py-8 sm:py-12 bg-surface-50 min-h-screen">
      <Container size="md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 bg-white px-4 py-2 rounded-lg border border-surface-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events Board
          </Link>
        </div>

        {/* Event Detail Article */}
        <article className="bg-white rounded-2xl border border-surface-200 shadow-md overflow-hidden space-y-6">
          {/* Hero Cover Image */}
          {event.cover_image_url ? (
            <div className="relative h-64 sm:h-80 md:h-96 w-full bg-surface-100">
              <Image
                src={event.cover_image_url}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant="accent"
                  className="shadow-md bg-white/90 backdrop-blur-sm text-accent-900 border border-accent-200 text-xs px-3 py-1"
                >
                  {t(`categories.${event.category}` as any)}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-r from-primary-500 to-amber-600 flex items-center justify-center p-6 text-white text-center">
              <div>
                <Badge
                  variant="accent"
                  className="bg-white/20 text-white border-white/40 mb-2"
                >
                  {t(`categories.${event.category}` as any)}
                </Badge>
                <Heading
                  level={1}
                  className="text-white text-xl sm:text-2xl font-bold"
                >
                  {title}
                </Heading>
              </div>
            </div>
          )}

          {/* Event Metadata & Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Header info */}
            <div className="space-y-4 border-b border-surface-200 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={isPast ? "default" : "primary"}>
                  {isPast ? "Past Event" : "Upcoming Event"}
                </Badge>

                <Badge variant="accent">
                  {t(`categories.${event.category}` as any)}
                </Badge>
              </div>

              <Heading
                level={1}
                className="text-2xl sm:text-3xl font-extrabold text-surface-900 leading-tight"
              >
                {title}
              </Heading>

              {/* Event Logistics Grid (Date, Time, Location/Venue) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface-50 rounded-xl border border-surface-200 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 text-primary-800 rounded-lg flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-surface-500 uppercase">
                      {t("dateLabel")}
                    </div>
                    <div className="font-semibold text-surface-900 mt-0.5">
                      {eventDate.toLocaleDateString(
                        locale === "bn" ? "bn-IN" : "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent-100 text-accent-800 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-surface-500 uppercase">
                      {t("timeLabel")}
                    </div>
                    <div className="font-semibold text-surface-900 mt-0.5">
                      {event.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-surface-500 uppercase">
                      {t("venueLabel")}
                    </div>
                    <div className="font-semibold text-surface-900 mt-0.5">
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-surface-900">
                Event Overview
              </h3>
              <p className="whitespace-pre-wrap font-sans text-surface-800 text-base leading-relaxed break-words">
                {description}
              </p>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
