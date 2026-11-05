import { getPublicNotices } from '@/lib/data/notices';

export async function GET() {
  const { notices } = await getPublicNotices({ limit: 50 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bidyarthicoaching.org';

  const rssItemsXml = notices
    .map((notice) => {
      const slugOrId = notice.slug || notice.id;
      const link = `${siteUrl}/bn/notices/${slugOrId}`;
      const pubDate = new Date(notice.published_at).toUTCString();
      const description = escapeXml(
        notice.body_bn || notice.body_en || notice.title_bn
      );

      return `
    <item>
      <title>${escapeXml(notice.title_bn)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(notice.category || 'Latest')}</category>
      <description>${description}</description>
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>বিদ্যার্থী ফ্রি কোচিং সেন্টার — বিজ্ঞপ্তি (Notices Feed)</title>
    <link>${siteUrl}/notices</link>
    <description>বিদ্যার্থী ফ্রি কোচিং সেন্টার শিমুরালি-র সর্বশেষ বিজ্ঞপ্তি ও ঘোষণা</description>
    <language>bn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/notices/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
