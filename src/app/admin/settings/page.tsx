import React from 'react';
import { getSiteSettings } from '@/lib/data/settings';
import { AdminSettingsClient } from './settings-client';

export const metadata = {
  title: 'Site Settings & Leadership Messages | Admin Dashboard',
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <AdminSettingsClient initialSettings={settings} />;
}
