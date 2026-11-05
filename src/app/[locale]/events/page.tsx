import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { getPublicEvents } from "@/lib/data/events";
import { Container, Heading, Badge, Button, Input } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { EVENT_CATEGORIES } from "@/lib/events/validation";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return {
    title: `${t("pageTitle")} | ${
      locale === "bn"
        ? "বিদ্যার্থী ফ্রি কোচিং সেন্টার"
        : "Bidyarthi Free Coaching Centre"
    }`,
    description: t("pageSubtitle"),
  };
}

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    filter?: "upcoming" | "past" | "all";
    category?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");

  const {
    filter = "upcoming",
    category = "All",
    search = "",
    page = "1",
  } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const { events, totalCount, totalPages } = await getPublicEvents({
    filter,
    category,
    search,
    page: currentPage,
    limit: 9,
  });

  return (
    <div className="py-8 sm:py-12 bg-surface-50 min-h-screen">
      <Container size="lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-surface-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-accent-100 text-accent-800 rounded-lg">
                <Calendar className="w-5 h-5" />
              </span>
              <Badge variant="accent">{totalCount} Events</Badge>
            </div>
            <Heading level={1} decorated>
              {t("pageTitle")}
            </Heading>
            <p className="text-surface-600 mt-2 text-base sm:text-lg max-w-2xl">
              {t("pageSubtitle")}
            </p>
          </div>

          {/* Upcoming vs Past Toggle Tabs */}
          <div className="inline-flex p-1 bg-surface-200 rounded-xl self-start md:self-auto">
            <Link
              href={{
                pathname: "/events",
                query: { filter: "upcoming", category, search },
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === "upcoming"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-surface-700 hover:text-surface-900"
              }`}
            >
              {t("upcomingTab")}
            </Link>
            <Link
              href={{
                pathname: "/events",
                query: { filter: "past", category, search },
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === "past"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-surface-700 hover:text-surface-900"
              }`}
            >
              {t("pastTab")}
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs (6 categories from SITEMAP.md + All) */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              href={{
                pathname: "/events",
                query: { filter, category: "All", search },
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === "All"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-surface-700 hover:bg-surface-100 border border-surface-200"
              }`}
            >
              {t("allCategories")}
            </Link>

            {EVENT_CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <Link
                  key={cat}
                  href={{
                    pathname: "/events",
                    query: { filter, category: cat, search },
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-white text-surface-700 hover:bg-surface-100 border border-surface-200"
                  }`}
                >
                  {t(`categories.${cat}` as any)}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <form
          method="GET"
          action={`/${locale}/events`}
          className="mb-8 max-w-xl flex gap-2"
        >
          <input type="hidden" name="filter" value={filter} />
          <input type="hidden" name="category" value={category} />
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-surface-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder={t("searchPlaceholder")}
              className="pl-9 bg-white"
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-surface-200 shadow-sm my-8">
            <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-surface-800 mb-1">
              {t("noEventsMessage")}
            </h3>
            <p className="text-sm text-surface-500">
              Try switching between Upcoming/Past tabs or select another
              category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => {
              const eventCategory = EVENT_CATEGORIES.find(
                (knownCategory) => knownCategory === event.category,
              );
              const title =
                locale === "en" && event.title_en
                  ? event.title_en
                  : event.title_bn;
              const description =
                locale === "en" && event.description_en
                  ? event.description_en
                  : event.description_bn;
              const slugOrId = event.slug || event.id;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Event Cover Image */}
                  <div className="relative h-48 w-full bg-surface-100 flex-shrink-0">
                    {event.cover_image_url ? (
                      <Image
                        src={event.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-surface-400 bg-surface-100">
                        <ImageIcon className="w-10 h-10 mb-1" />
                        <span className="text-xs font-medium">
                          Bidyarthi Event
                        </span>
                      </div>
                    )}
                    {/* Category Badge overlay */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="accent"
                        className="shadow-sm bg-white/90 backdrop-blur-sm text-accent-900 border border-accent-200"
                      >
                        {eventCategory
                          ? t(`categories.${eventCategory}` as any)
                          : t("uncategorized")}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Date & Time info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-primary-700">
                        <span className="flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(event.date).toLocaleDateString(
                            locale === "bn" ? "bn-IN" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-surface-500">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold text-surface-900 line-clamp-2 hover:text-primary-700 transition-colors">
                        <Link href={`/events/${slugOrId}`}>{title}</Link>
                      </h2>

                      {/* Location / Venue */}
                      <div className="flex items-center gap-1.5 text-xs text-surface-600">
                        <MapPin className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      {/* Description excerpt */}
                      <p className="text-sm text-surface-600 line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-surface-100">
                      <Link
                        href={`/events/${slugOrId}`}
                        className="inline-flex items-center justify-between w-full text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors"
                      >
                        <span>{t("viewDetails")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4">
            {currentPage > 1 && (
              <Link
                href={{
                  pathname: "/events",
                  query: { filter, category, search, page: currentPage - 1 },
                }}
                className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm font-medium hover:bg-surface-100 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            )}

            <span className="text-sm font-medium text-surface-600">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={{
                  pathname: "/events",
                  query: { filter, category, search, page: currentPage + 1 },
                }}
                className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm font-medium hover:bg-surface-100 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
