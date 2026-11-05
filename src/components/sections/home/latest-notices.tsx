import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils";
import type { NoticeItem } from "@/types";

interface LatestNoticesProps {
  notices: NoticeItem[];
  now?: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function LatestNoticesSection({ notices, now }: LatestNoticesProps) {
  const tHome = useTranslations("home");
  const tNotices = useTranslations("notices");
  const locale = useLocale() as "bn" | "en";
  const currentTime = now ?? 0;

  return (
    <Section className="bg-surface-100/60 py-12 md:py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 max-w-4xl mx-auto">
        <div>
          <Heading level={2} decorated className="text-surface-900">
            {tHome("noticesSectionTitle")}
          </Heading>
        </div>

        <Link
          href="/notices"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 rounded-md px-2 py-1"
        >
          {tHome("viewAllNotices")}
        </Link>
      </div>

      {!notices || notices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-surface-200 p-8 max-w-md mx-auto text-surface-500">
          {tHome("noNoticesMessage")}
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {notices.map((notice) => {
            const title = locale === "bn" ? notice.title_bn : notice.title_en || notice.title_bn;
            const body = locale === "bn" ? notice.body_bn : notice.body_en || notice.body_bn;
            const isNew =
              currentTime > 0
                ? currentTime - new Date(notice.published_at).getTime() <= SEVEN_DAYS_MS
                : false;
            const publishedDate = new Date(notice.published_at).toLocaleDateString(
              locale === "bn" ? "bn-IN" : "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );

            const slugOrId = notice.slug || notice.id;

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-xl p-5 border transition-all ${
                  notice.is_pinned
                    ? "border-primary-300 bg-primary-50/20 shadow-xs"
                    : "border-surface-200 shadow-2xs hover:border-surface-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {notice.is_pinned && (
                      <Badge variant="primary">
                        📌 {tNotices("pinnedLabel")}
                      </Badge>
                    )}
                    {isNew && (
                      <span className="bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full text-[10px] uppercase">
                        ✨ {tNotices("newBadge")}
                      </span>
                    )}
                    {notice.category && (
                      <Badge variant="accent">
                        {tNotices.has(`categories.${notice.category}`)
                          ? tNotices(`categories.${notice.category}` as any)
                          : notice.category}
                      </Badge>
                    )}
                    <span className="font-semibold text-surface-500">
                      {publishedDate}
                    </span>
                  </div>

                  {notice.file_url && (
                    <a
                      href={notice.file_url}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-lg bg-surface-100 text-surface-800 hover:bg-surface-200 transition-colors border border-surface-300 self-start sm:self-auto"
                    >
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>
                        {tNotices("downloadPdfButton")}
                        {notice.file_size ? ` · ${formatFileSize(notice.file_size)}` : ""}
                      </span>
                    </a>
                  )}
                </div>

                <h3 className="text-base font-bold text-surface-900 leading-snug mb-1">
                  <Link
                    href={`/notices/${slugOrId}`}
                    className="hover:text-primary-700 transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 rounded-xs"
                  >
                    {title}
                  </Link>
                </h3>

                {body && (
                  <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed">
                    {body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
