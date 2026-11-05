import { notFound } from 'next/navigation';
import { getPublicFormLinkBySlug } from '@/lib/data/forms';
import { GoogleFormEmbed } from '@/components/forms/google-form-embed';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Alert } from '@/components/ui/alert';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isBn = locale === 'bn';

  const form = await getPublicFormLinkBySlug(slug);
  if (!form) return { title: 'Form Not Found' };

  const title =
    locale === 'en'
      ? form.title_en || form.title_bn
      : form.title_bn || form.title_en;

  return {
    title: `${title} | ${isBn ? 'বিদ্যার্থী ফ্রি কোচিং সেন্টার' : 'Bidyarthi Free Coaching Centre'}`,
    description: form.description_bn || form.description_en || title,
  };
}

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = (locale as 'bn' | 'en') || 'bn';
  const isBn = typedLocale === 'bn';

  const form = await getPublicFormLinkBySlug(slug);

  if (!form) {
    notFound();
  }

  const title =
    (typedLocale === 'en'
      ? form.title_en || form.title_bn
      : form.title_bn || form.title_en) || '';
  const desc =
    typedLocale === 'en'
      ? form.description_en || form.description_bn
      : form.description_bn || form.description_en;

  return (
    <main id="main-content" className="min-h-screen py-8 sm:py-12 bg-surface-50">
      <Container size="md">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/forms"
            className="inline-flex items-center text-sm font-semibold text-accent-700 hover:text-accent-800 transition-colors"
          >
            ‹ {isBn ? 'সব ফর্মে ফিরে যান' : 'Back to all forms'}
          </Link>
        </div>

        {/* Header Block */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-surface-200 shadow-xs mb-8 space-y-4">
          <Heading level={1} decorated>
            {title}
          </Heading>
          {desc && (
            <p className="text-surface-700 text-base sm:text-lg leading-relaxed">
              {desc}
            </p>
          )}

          {/* Short Instructions Block */}
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-xs sm:text-sm text-primary-900 space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5 text-primary-800">
              📌 {isBn ? 'আবেদন করার নির্দেশাবলী:' : 'Instructions:'}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-primary-950">
              <li>
                {isBn
                  ? 'ফর্মের সমস্ত প্রয়োজনীয় তারকাচিহ্নিত (*) ঘরগুলো সঠিকভাবে পূরণ করুন।'
                  : 'Please fill in all required (*) fields accurately.'}
              </li>
              <li>
                {isBn
                  ? 'ফরমটি সম্পূর্ণ হলে শেষে Submits বা জমা দিন বাটনে ক্লিক করুন।'
                  : 'Click the Submit button at the end once completed.'}
              </li>
              <li>
                {isBn
                  ? 'আবেদনে কোনো সমস্যা হলে আমাদের সাথে সরাসরি যোগাযোগ করতে পারেন।'
                  : 'If you encounter any issues, please contact administration directly.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Check Active Status */}
        {!form.is_active ? (
          <div className="space-y-6">
            <Alert variant="warning" title={isBn ? 'আবেদন বন্ধ' : 'Applications Closed'}>
              {isBn
                ? 'এই আবেদনটি বর্তমানে গ্রহণ করা হচ্ছে না। বিস্তারিত জানতে কর্তৃপক্ষের সাথে যোগাযোগ করুন।'
                : 'Applications are currently closed for this form. Please check back later or contact administration.'}
            </Alert>
            <div className="text-center pt-4">
              <Link
                href="/forms"
                className="inline-flex items-center px-5 py-2.5 bg-surface-200 text-surface-800 font-semibold rounded-lg hover:bg-surface-300 transition-colors text-sm"
              >
                {isBn ? 'অন্যান্য ফর্ম দেখুন' : 'View Other Forms'}
              </Link>
            </div>
          </div>
        ) : (
          <GoogleFormEmbed
            googleFormUrl={form.google_form_url}
            title={title}
            locale={typedLocale}
          />
        )}
      </Container>
    </main>
  );
}
