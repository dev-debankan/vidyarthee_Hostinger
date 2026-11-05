import React from 'react';
import { getAdminFormLinks } from '@/lib/data/forms';
import { AdminFormsClient } from './forms-client';

export const metadata = {
  title: 'Manage Form Links | Admin Dashboard',
};

export default async function AdminFormsPage() {
  const forms = await getAdminFormLinks();

  return <AdminFormsClient initialForms={forms} />;
}
