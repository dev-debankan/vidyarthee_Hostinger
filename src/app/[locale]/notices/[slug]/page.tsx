import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getNoticeBySlugOrId } from "@/lib/data/notices";
import { Container, Heading, Badge } from "@/components/ui";
import { Link } from "@/i18n/routing";
import {
  Calendar,
  Pin,
  Sparkles,
  Download,
  ExternalLink,
  ArrowLeft,
  Upload,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const notice = await getNoticeBySlugOrId(slug);

  if (!notice) {
    return { title: "Notice Not Found" };
  }

  const title =
    locale === "en" && notice.title_en ? notice.title_en : notice.title_bn;

  return {
    title: `${title} | Bidyarthi Free Coaching Centre`,
    description: notice.body_bn ? notice.body_bn.slice(0, 160) : title,
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("notices");

  const notice = await getNoticeBySlugOrId(slug);

  if (!notice) {
    notFound();
  }

  const title =
    locale === "en" && notice.title_en ? notice.title_en : notice.title_bn;
  const now = Date.now();
  const isNew =
    now - new Date(notice.published_at).getTime() <= 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="py-8 sm:py-12 bg-surface-50 min-h-screen">
      <Container size="md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 bg-white px-4 py-2 rounded-lg border border-surface-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notices Board
          </Link>
        </div>

        {/* Notice Card Container */}
        <article className="bg-white rounded-2xl border border-surface-200 shadow-md p-6 sm:p-10 space-y-6">
          {/* Metadata Header */}
          <div className="space-y-3 border-b border-surface-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {notice.is_pinned && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                  <Pin className="w-3.5 h-3.5 fill-amber-700" />
                  {t("pinnedLabel")}
                </span>
              )}

              {isNew && (
                <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("newBadge")}
                </span>
              )}

              <Badge variant="accent">
                {t(`categories.${notice.category}` as any)}
              </Badge>

              <span className="text-surface-500 text-xs sm:text-sm flex items-center gap-1.5 ml-auto">
                <Calendar className="w-4 h-4 text-surface-400" />
                {new Date(notice.published_at).toLocaleDateString(
                  locale === "bn" ? "bn-IN" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </div>

            <Heading
              level={1}
              className="text-2xl sm:text-3xl font-extrabold text-surface-900 leading-tight"
            >
              {title}
            </Heading>
          </div>

          {/* PDF Notice View */}
          {notice.file_type === "pdf" && notice.file_url && (
            <div className="space-y-6">
              {/* PDF Action Bar (Download & Open) */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-600 text-white rounded-xl shadow-md">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 text-base">
                      Official PDF Document
                    </h3>
                    <p className="text-xs text-surface-600">
                      File Size:{" "}
                      {notice.file_size
                        ? (notice.file_size / (1024 * 1024)).toFixed(2)
                        : "0.00"}{" "}
                      MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={notice.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PDF
                  </a>
                  <a
                    href={notice.file_url}
                    download
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-300 text-red-700 hover:bg-red-50 font-bold rounded-lg shadow-sm transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>

              {/* Desktop Embedded PDF Viewer (Hidden on mobile < 768px per mobile-first rules) */}
              <div className="hidden md:block border border-surface-200 rounded-xl overflow-hidden shadow-inner bg-surface-100">
                <iframe
                  src={`${notice.file_url}#toolbar=0`}
                  className="w-full h-[650px]"
                  title={title}
                />
              </div>

              {/* Mobile Fallback Note */}
              <div className="md:hidden text-center text-xs text-surface-500 bg-surface-100 p-4 rounded-lg border border-surface-200">
                Tap <strong>Open PDF</strong> or <strong>Download</strong> above
                to view this document on mobile devices.
              </div>
            </div>
          )}

          {/* Text / .TXT Inline Notice View */}
          {(notice.file_type === "txt" || !notice.file_type) && (
            <div className="space-y-6">
              {notice.body_bn && (
                <div className="bg-surface-50 p-6 rounded-xl border border-surface-200">
                  <div className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    বাংলা বিবরণ (Bengali Content)
                  </div>
                  {/* Escaped plain text rendering with preserved line breaks (never HTML) */}
                  <p className="whitespace-pre-wrap font-sans text-surface-900 text-base leading-relaxed break-words">
                    {notice.body_bn}
                  </p>
                </div>
              )}

              {notice.body_en && (
                <div className="bg-surface-50 p-6 rounded-xl border border-surface-200">
                  <div className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">
                    English Description
                  </div>
                  <p className="whitespace-pre-wrap font-sans text-surface-900 text-base leading-relaxed break-words">
                    {notice.body_en}
                  </p>
                </div>
              )}
            </div>
          )}
        </article>
      </Container>
    </div>
  );
}
