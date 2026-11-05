import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublicNotices } from '@/lib/data/notices';
import { Container, Heading, Badge, Button, Input } from '@/components/ui';
import { Link } from '@/i18n/routing';
import { NOTICE_CATEGORIES } from '@/lib/notices/validation';
import {
  Pin,
  Sparkles,
  Calendar,
  FileText,
  FileCode,
  Upload,
  Rss,
  Search,
  ChevronLeft,
  ChevronRight,
  Megaphone,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notices' });
  return {
    title: `${t('pageTitle')} | ${locale === 'bn' ? 'বিদ্যার্থী ফ্রি কোচিং সেন্টার' : 'Bidyarthi Free Coaching Centre'}`,
    description: t('pageSubtitle'),
  };
}

export default async function NoticesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('notices');

  const { category = 'All', search = '', page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const { notices, totalCount, totalPages } = await getPublicNotices({
    category,
    search,
    page: currentPage,
    limit: 10,
  });

  const now = Date.now();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="py-8 sm:py-12 bg-surface-50 min-h-screen">
      <Container size="lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-surface-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-primary-100 text-primary-800 rounded-lg">
                <Megaphone className="w-5 h-5" />
              </span>
              <Badge variant="primary">{totalCount} Notices</Badge>
            </div>
            <Heading level={1} decorated>
              {t('pageTitle')}
            </Heading>
            <p className="text-surface-600 mt-2 text-base sm:text-lg max-w-2xl">
              {t('pageSubtitle')}
            </p>
          </div>

          <a
            href="/notices/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors self-start md:self-auto"
          >
            <Rss className="w-4 h-4 text-amber-600" />
            {t('rssFeed')}
          </a>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              href={{
                pathname: '/notices',
                query: { category: 'All', search },
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === 'All'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {t('allCategories')}
            </Link>
            {NOTICE_CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <Link
                  key={cat}
                  href={{
                    pathname: '/notices',
                    query: { category: cat, search },
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
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
          action={`/${locale}/notices`}
          className="mb-8 max-w-xl flex gap-2"
        >
          <input type="hidden" name="category" value={category} />
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-surface-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder={t('searchPlaceholder')}
              className="pl-9 bg-white"
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {/* Notices Grid / List */}
        {notices.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-surface-200 shadow-sm my-8">
            <Megaphone className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-surface-800 mb-1">
              {t('noNoticesMessage')}
            </h3>
            <p className="text-sm text-surface-500">
              Try searching with different keywords or choosing another category tab.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {notices.map((notice) => {
              const noticeCategory = NOTICE_CATEGORIES.find(
                (knownCategory) => knownCategory === notice.category
              );
              const isNew =
                now - new Date(notice.published_at).getTime() <= SEVEN_DAYS_MS;
              const title =
                locale === 'en' && notice.title_en
                  ? notice.title_en
                  : notice.title_bn;
              const slugOrId = notice.slug || notice.id;

              return (
                <div
                  key={notice.id}
                  className={`bg-white rounded-xl p-5 sm:p-6 border transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    notice.is_pinned
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-surface-200'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {notice.is_pinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                          <Pin className="w-3 h-3 fill-amber-700" />
                          {t('pinnedLabel')}
                        </span>
                      )}

                      {isNew && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                          <Sparkles className="w-3 h-3" />
                          {t('newBadge')}
                        </span>
                      )}

                      <Badge variant="accent">
                        {noticeCategory
                          ? t(`categories.${noticeCategory}` as any)
                          : t('uncategorized')}
                      </Badge>

                      <span className="text-surface-500 flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(notice.published_at).toLocaleDateString(
                          locale === 'bn' ? 'bn-IN' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>

                    {/* Notice Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-surface-900 hover:text-primary-700 transition-colors">
                      <Link href={`/notices/${slugOrId}`}>{title}</Link>
                    </h2>

                    {/* Excerpt / File Indicator */}
                    {notice.file_type === 'pdf' ? (
                      <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-red-600" />
                        PDF Document ·{' '}
                        {notice.file_size ? (notice.file_size / (1024 * 1024)).toFixed(1) : '0'} MB
                      </p>
                    ) : notice.file_type === 'txt' ? (
                      <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-blue-600" />
                        Text File Document
                      </p>
                    ) : notice.body_bn ? (
                      <p className="text-sm text-surface-600 line-clamp-2">
                        {notice.body_bn}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions Button */}
                  <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-surface-100">
                    <Link
                      href={`/notices/${slugOrId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-100 hover:bg-primary-50 text-surface-800 hover:text-primary-700 font-semibold text-sm transition-colors w-full sm:w-auto justify-center"
                    >
                      <FileText className="w-4 h-4" />
                      {t('viewDetails')}
                    </Link>
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
                  pathname: '/notices',
                  query: { category, search, page: currentPage - 1 },
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
                  pathname: '/notices',
                  query: { category, search, page: currentPage + 1 },
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
