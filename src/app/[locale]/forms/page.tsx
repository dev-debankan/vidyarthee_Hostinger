import { getPublicFormLinks } from '@/lib/data/forms';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return {
    title: isBn
      ? 'অনলাইন ফরম ও আবেদনপত্র | বিদ্যার্থী ফ্রি কোচিং সেন্টার'
      : 'Online Forms & Applications | Bidyarthi Free Coaching Centre',
    description: isBn
      ? 'বিদ্যার্থী ফ্রি কোচিং সেন্টারের ভর্তি আবেদন, ফ্রি কোচিং নিবন্ধন, সদস্যপদ ও স্বেচ্ছাসেবক নিবন্ধন ফরম।'
      : 'Online application forms for admission, free coaching registration, membership, and volunteer registration.',
  };
}

export default async function FormsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = (locale as 'bn' | 'en') || 'bn';
  const isBn = typedLocale === 'bn';

  const forms = await getPublicFormLinks();

  return (
    <main id="main-content" className="min-h-screen py-8 sm:py-12 bg-surface-50">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Heading level={1} decorated className="justify-center">
            {isBn ? 'অনলাইন ফরম ও আবেদনপত্র' : 'Online Forms & Applications'}
          </Heading>
          <p className="text-surface-600 text-base sm:text-lg">
            {isBn
              ? 'নিচের তালিকা থেকে প্রয়োজনীয় ফরমটি নির্বাচন করে অনলাইনে সহজেই আবেদন করুন।'
              : 'Select the required application form from the list below to apply online.'}
          </p>
        </div>

        {/* Forms Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {forms.map((form) => {
            const title =
              typedLocale === 'en'
                ? form.title_en || form.title_bn
                : form.title_bn || form.title_en;
            const desc =
              typedLocale === 'en'
                ? form.description_en || form.description_bn
                : form.description_bn || form.description_en;
            const formSlug = form.slug || form.id;

            return (
              <Card
                key={form.id}
                className="flex flex-col justify-between border-surface-200 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={form.is_active ? 'success' : 'warning'}>
                      {form.is_active
                        ? isBn
                          ? 'আবেদন খোলা (Open)'
                          : 'Applications Open'
                        : isBn
                        ? 'আবেদন বন্ধ (Closed)'
                        : 'Applications Closed'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-surface-900 leading-snug">
                    {title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                  {desc && (
                    <p className="text-sm text-surface-600 leading-relaxed">
                      {desc}
                    </p>
                  )}

                  <div className="pt-4 border-t border-surface-100">
                    {form.is_active ? (
                      <Link
                        href={`/forms/${formSlug}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-lg shadow-xs transition-colors"
                      >
                        <span>{isBn ? 'ফরমটি পূরণ করুন' : 'Fill Out Form'}</span>
                        <span className="ml-1.5 font-mono">→</span>
                      </Link>
                    ) : (
                      <div className="text-center p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800">
                        {isBn
                          ? 'আবেদন গ্রহণ বর্তমানে বন্ধ আছে'
                          : 'Applications are currently closed'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
