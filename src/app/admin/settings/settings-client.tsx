'use client';

import { useState } from 'react';
import Image from 'next/image';
import { updateSiteSettingsAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>;
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'leadership' | 'contact' | 'home'>('leadership');
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // President Photo File state
  const [presidentPhoto, setPresidentPhoto] = useState<File | null>(null);
  const [secretaryPhoto, setSecretaryPhoto] = useState<File | null>(null);

  const handleInputChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      for (const [key, val] of Object.entries(settings)) {
        formData.append(key, val);
      }

      if (presidentPhoto) {
        formData.append('president_photo', presidentPhoto);
      }

      if (secretaryPhoto) {
        formData.append('secretary_photo', secretaryPhoto);
      }

      const res = await updateSiteSettingsAction(formData);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update site settings');
      } else {
        setSuccessMsg(res.message || 'Site settings updated successfully');
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
            Site Settings & Leadership Messages
          </h1>
          <p className="text-sm text-surface-600 mt-1">
            Manage contact information, Google Map links, and President & Secretary messages.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-surface-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'leadership'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            👤 Leadership Messages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'contact'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            📞 Contact & Maps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'home'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            🏠 Homepage Text
          </button>
        </div>
      </div>

      {errorMsg && <Alert variant="danger" title="Error">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success" title="Success">{successMsg}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= TAB 1: LEADERSHIP MESSAGES ================= */}
        {activeTab === 'leadership' && (
          <div className="space-y-6">
            {/* President's Message Editor */}
            <Card>
              <CardHeader className="bg-primary-50/50 border-b border-surface-100">
                <CardTitle className="text-lg font-bold text-primary-900">
                  President&apos;s Message (সভাপতির বার্তা)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-surface-100">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-200 border-2 border-primary-400 shrink-0">
                    {settings['president_image_url'] ? (
                      <Image
                        src={settings['president_image_url']}
                        alt="President"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-surface-400 text-xs text-center p-2">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="block text-sm font-medium text-surface-700">
                      Upload President Photo (ছবি পরিবর্তন করুন)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setPresidentPhoto(e.target.files[0]);
                      }}
                      className="text-sm text-surface-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="President Name (Bengali) *"
                    value={settings['president_name_bn'] || ''}
                    onChange={(e) => handleInputChange('president_name_bn', e.target.value)}
                  />
                  <Input
                    label="President Name (English)"
                    value={settings['president_name_en'] || ''}
                    onChange={(e) => handleInputChange('president_name_en', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Title Label (Bengali)"
                    value={settings['president_title_bn'] || 'সভাপতির বার্তা'}
                    onChange={(e) => handleInputChange('president_title_bn', e.target.value)}
                  />
                  <Input
                    label="Title Label (English)"
                    value={settings['president_title_en'] || "President's Message"}
                    onChange={(e) => handleInputChange('president_title_en', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Textarea
                    label="Excerpt Quote (Bengali - Homepage card)"
                    value={settings['president_excerpt_bn'] || ''}
                    onChange={(e) => handleInputChange('president_excerpt_bn', e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Excerpt Quote (English - Homepage card)"
                    value={settings['president_excerpt_en'] || ''}
                    onChange={(e) => handleInputChange('president_excerpt_en', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Textarea
                    label="Full Message (Bengali - Read More Modal)"
                    value={settings['president_full_bn'] || ''}
                    onChange={(e) => handleInputChange('president_full_bn', e.target.value)}
                    rows={5}
                  />
                  <Textarea
                    label="Full Message (English - Read More Modal)"
                    value={settings['president_full_en'] || ''}
                    onChange={(e) => handleInputChange('president_full_en', e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Secretary's Message Editor */}
            <Card>
              <CardHeader className="bg-primary-50/50 border-b border-surface-100">
                <CardTitle className="text-lg font-bold text-primary-900">
                  Secretary&apos;s Message (সম্পাদকের বার্তা)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-surface-100">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-200 border-2 border-primary-400 shrink-0">
                    {settings['secretary_image_url'] ? (
                      <Image
                        src={settings['secretary_image_url']}
                        alt="Secretary"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-surface-400 text-xs text-center p-2">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="block text-sm font-medium text-surface-700">
                      Upload Secretary Photo (ছবি পরিবর্তন করুন)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setSecretaryPhoto(e.target.files[0]);
                      }}
                      className="text-sm text-surface-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Secretary Name (Bengali) *"
                    value={settings['secretary_name_bn'] || ''}
                    onChange={(e) => handleInputChange('secretary_name_bn', e.target.value)}
                  />
                  <Input
                    label="Secretary Name (English)"
                    value={settings['secretary_name_en'] || ''}
                    onChange={(e) => handleInputChange('secretary_name_en', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Title Label (Bengali)"
                    value={settings['secretary_title_bn'] || 'সম্পাদকের বার্তা'}
                    onChange={(e) => handleInputChange('secretary_title_bn', e.target.value)}
                  />
                  <Input
                    label="Title Label (English)"
                    value={settings['secretary_title_en'] || "Secretary's Message"}
                    onChange={(e) => handleInputChange('secretary_title_en', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Textarea
                    label="Excerpt Quote (Bengali - Homepage card)"
                    value={settings['secretary_excerpt_bn'] || ''}
                    onChange={(e) => handleInputChange('secretary_excerpt_bn', e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Excerpt Quote (English - Homepage card)"
                    value={settings['secretary_excerpt_en'] || ''}
                    onChange={(e) => handleInputChange('secretary_excerpt_en', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Textarea
                    label="Full Message (Bengali - Read More Modal)"
                    value={settings['secretary_full_bn'] || ''}
                    onChange={(e) => handleInputChange('secretary_full_bn', e.target.value)}
                    rows={5}
                  />
                  <Textarea
                    label="Full Message (English - Read More Modal)"
                    value={settings['secretary_full_en'] || ''}
                    onChange={(e) => handleInputChange('secretary_full_en', e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= TAB 2: CONTACT & MAPS ================= */}
        {activeTab === 'contact' && (
          <Card>
            <CardHeader className="bg-primary-50/50 border-b border-surface-100">
              <CardTitle className="text-lg font-bold text-primary-900">
                Contact Details & Google Maps Embed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number *"
                  placeholder="+91 98765 43210"
                  value={settings['phone'] || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <Input
                  label="Contact Email Address *"
                  placeholder="info@bidyarthi.org"
                  value={settings['email'] || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Physical Address (Bengali) *"
                  placeholder="সিমুরালী, নদীয়া, পশ্চিমবঙ্গ..."
                  value={settings['address_bn'] || ''}
                  onChange={(e) => handleInputChange('address_bn', e.target.value)}
                  rows={3}
                />
                <Textarea
                  label="Physical Address (English) *"
                  placeholder="Simurali, Nadia, West Bengal..."
                  value={settings['address_en'] || ''}
                  onChange={(e) => handleInputChange('address_en', e.target.value)}
                  rows={3}
                />
              </div>

              <Input
                label="Google Maps Embed URL (iframe src)"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={settings['maps_embed_url'] || ''}
                onChange={(e) => handleInputChange('maps_embed_url', e.target.value)}
                helperText="Paste the iframe src URL from Google Maps Share -> Embed a map"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Facebook Page URL"
                  placeholder="https://facebook.com/bidyarthi..."
                  value={settings['facebook_url'] || ''}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                />
                <Input
                  label="YouTube Channel URL"
                  placeholder="https://youtube.com/@bidyarthi..."
                  value={settings['youtube_url'] || ''}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= TAB 3: HOMEPAGE TEXT ================= */}
        {activeTab === 'home' && (
          <Card>
            <CardHeader className="bg-primary-50/50 border-b border-surface-100">
              <CardTitle className="text-lg font-bold text-primary-900">
                Homepage Hero & Introduction Text
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hero Title (Bengali)"
                  value={settings['hero_title_bn'] || ''}
                  onChange={(e) => handleInputChange('hero_title_bn', e.target.value)}
                />
                <Input
                  label="Hero Title (English)"
                  value={settings['hero_title_en'] || ''}
                  onChange={(e) => handleInputChange('hero_title_en', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Hero Subtitle / Tagline (Bengali)"
                  value={settings['hero_subtitle_bn'] || ''}
                  onChange={(e) => handleInputChange('hero_subtitle_bn', e.target.value)}
                  rows={3}
                />
                <Textarea
                  label="Hero Subtitle / Tagline (English)"
                  value={settings['hero_subtitle_en'] || ''}
                  onChange={(e) => handleInputChange('hero_subtitle_en', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Short Intro Text (Bengali)"
                  value={settings['intro_bn'] || ''}
                  onChange={(e) => handleInputChange('intro_bn', e.target.value)}
                  rows={4}
                />
                <Textarea
                  label="Short Intro Text (English)"
                  value={settings['intro_en'] || ''}
                  onChange={(e) => handleInputChange('intro_en', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end border-t border-surface-200 pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Saving Settings...' : 'Save All Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
