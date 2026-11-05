import React from 'react';
import { getAdminGalleryPhotos, getAdminGalleryVideos } from '@/lib/data/gallery';
import { AdminGalleryClient } from './gallery-client';

export const metadata = {
  title: 'Manage Gallery | Admin Dashboard',
};

export default async function AdminGalleryPage() {
  const [photos, videos] = await Promise.all([
    getAdminGalleryPhotos(),
    getAdminGalleryVideos(),
  ]);

  return <AdminGalleryClient initialPhotos={photos} initialVideos={videos} />;
}
