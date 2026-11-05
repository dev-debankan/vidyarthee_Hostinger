import { getContactDetails } from '@/lib/data/settings';
import { ContactClient } from './contact-client';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return {
    title: isBn
      ? 'যোগাযোগ করুন | বিদ্যার্থী ফ্রি কোচিং সেন্টার'
      : 'Contact Us | Bidyarthi Free Coaching Centre',
    description: isBn
      ? 'বিদ্যার্থী ফ্রি কোচিং সেন্টারের ঠিকানা, ফোন নম্বর, ইমেল এবং গুগল ম্যাপ অবস্থান।'
      : 'Contact details, phone numbers, email address, and Google Map location of Bidyarthi Free Coaching Centre.',
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = (locale as 'bn' | 'en') || 'bn';
  const isBn = typedLocale === 'bn';

  const contact = await getContactDetails();
  const address = isBn ? contact.address_bn : contact.address_en;
  const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');

  return (
    <main id="main-content" className="min-h-screen py-8 sm:py-12 bg-surface-50">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Heading level={1} decorated className="justify-center">
            {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
          </Heading>
          <p className="text-surface-600 text-base sm:text-lg">
            {isBn
              ? 'কোচিং সেন্টার, পাঠাগার বা অন্যান্য সমাজসেবামূলক সেবার প্রয়োজনে আমাদের সাথে সরাসরি দেখা করতে পারেন অথবা ফোন/ইমেলে যোগাযোগ করুন।'
              : 'Visit our center or get in touch via phone or email for inquiries regarding coaching, library, or social services.'}
          </p>
        </div>

        {/* Grid Container: Info Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Side: Contact Information Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <Card className="p-6 space-y-3 border-surface-200 shadow-sm">
              <div className="flex items-center gap-3 text-primary-700">
                <span className="p-2.5 bg-primary-50 rounded-xl text-xl">📍</span>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? 'ঠিকানা (Address)' : 'Our Address'}
                </h3>
              </div>
              <p className="text-surface-700 leading-relaxed font-medium pl-11">
                {address}
              </p>
            </Card>

            {/* Phone Card */}
            <Card className="p-6 space-y-3 border-surface-200 shadow-sm">
              <div className="flex items-center gap-3 text-primary-700">
                <span className="p-2.5 bg-primary-50 rounded-xl text-xl">📞</span>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? 'ফোন নম্বর (Phone)' : 'Phone Number'}
                </h3>
              </div>
              <div className="pl-11">
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-lg font-bold text-accent-700 hover:text-accent-800 hover:underline transition-colors block"
                >
                  {contact.phone}
                </a>
                <p className="text-xs text-surface-500 mt-1">
                  {isBn ? 'সকাল ১০টা থেকে রাত ৮টা পর্যন্ত খোলা' : 'Available 10:00 AM - 8:00 PM'}
                </p>
              </div>
            </Card>

            {/* Email Card */}
            <Card className="p-6 space-y-3 border-surface-200 shadow-sm">
              <div className="flex items-center gap-3 text-primary-700">
                <span className="p-2.5 bg-primary-50 rounded-xl text-xl">✉️</span>
                <h3 className="font-bold text-lg text-surface-900">
                  {isBn ? 'ইমেল (Email)' : 'Email Address'}
                </h3>
              </div>
              <div className="pl-11">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base font-semibold text-accent-700 hover:text-accent-800 hover:underline transition-colors block break-all"
                >
                  {contact.email}
                </a>
              </div>
            </Card>
          </div>

          {/* Right Side: Message Submission Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactClient locale={typedLocale} />
          </div>
        </div>

        {/* Google Map Section with Lazy Loading & Text Address Fallback */}
        <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-100 pb-3">
            <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
              <span>🗺️</span>
              <span>{isBn ? 'গুগল ম্যাপে আমাদের অবস্থান' : 'Find Us on Google Maps'}</span>
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-500 font-medium">
                📍 {address}
              </span>
              <a
                href={contact.maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
              >
                {isBn ? 'গুগল ম্যাপে খুলুন' : 'Open in Google Maps'}
              </a>
            </div>
          </div>

          <div className="relative w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden bg-surface-100 border border-surface-200">
            {contact.maps_embed_url ? (
              <iframe
                src={contact.maps_embed_url}
                title="Bidyarthi Free Coaching Centre Location Map"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-2 text-surface-600">
                <span className="text-3xl">📍</span>
                <p className="font-bold text-base text-surface-900">{address}</p>
                <p className="text-xs text-surface-500">
                  {isBn
                    ? 'ম্যাপের জন্য ইন্টারনেট সংযোগ প্রয়োজন'
                    : 'Map embed currently unavailable'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
