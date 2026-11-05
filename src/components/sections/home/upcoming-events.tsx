import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/types";

interface UpcomingEventsProps {
  events: EventItem[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsProps) {
  const tHome = useTranslations("home");
  const tEvents = useTranslations("events");
  const locale = useLocale() as "bn" | "en";

  return (
    <Section className="py-12 md:py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 max-w-6xl mx-auto">
        <div>
          <Heading level={2} decorated className="text-surface-900">
            {tHome("eventsSectionTitle")}
          </Heading>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 rounded-md px-2 py-1"
        >
          {tHome("viewAllEvents")}
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-surface-200 p-8 max-w-md mx-auto text-surface-500">
          {tHome("noEventsMessage")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((evt) => {
            const title = locale === "bn" ? evt.title_bn : evt.title_en || evt.title_bn;
            const desc = locale === "bn" ? evt.description_bn : evt.description_en || evt.description_bn;
            const time =
              evt.time || (locale === "bn" ? evt.time_bn : evt.time_en) || evt.time_bn || "";
            const location =
              evt.location ||
              (locale === "bn" ? evt.location_bn : evt.location_en) ||
              evt.location_bn ||
              "";
            const slugOrId = evt.slug || evt.id;

            const eventDate = new Date(evt.date);
            const dayStr = eventDate.getDate();
            const monthStr = eventDate.toLocaleDateString(
              locale === "bn" ? "bn-IN" : "en-US",
              { month: "short" }
            );

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-6 border border-surface-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Date Badge & Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-16 rounded-xl bg-primary-600 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span className="text-xl font-extrabold leading-none">{dayStr}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider mt-0.5">{monthStr}</span>
                      </div>

                      <div className="space-y-1 text-xs text-surface-600">
                        <div className="flex items-center gap-1 font-semibold text-surface-800">
                          <span>🕒 {time}</span>
                        </div>
                        <div className="line-clamp-2">
                          📍 {location}
                        </div>
                      </div>
                    </div>

                    {evt.category && (
                      <Badge variant="accent" className="text-[10px]">
                        {tEvents(`categories.${evt.category}` as any)}
                      </Badge>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-surface-900 leading-snug mb-2">
                      <Link
                        href={`/events/${slugOrId}`}
                        className="hover:text-primary-700 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 rounded-xs"
                      >
                        {title}
                      </Link>
                    </h3>
                    <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-100 flex justify-end">
                  <Link
                    href={`/events/${slugOrId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-800"
                  >
                    <span>Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
