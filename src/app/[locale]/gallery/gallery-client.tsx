'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryItemRow, GalleryVideoRow } from '@/types/database';
import {
  PHOTO_CATEGORIES,
  VIDEO_CATEGORIES,
  PHOTO_CATEGORY_LABELS,
  VIDEO_CATEGORY_LABELS,
  PhotoCategory,
  VideoCategory,
} from '@/lib/gallery/utils';
import { Lightbox } from '@/components/gallery/lightbox';
import { YouTubeFacade } from '@/components/gallery/youtube-facade';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface PublicGalleryClientProps {
  initialPhotos: GalleryItemRow[];
  initialVideos: GalleryVideoRow[];
  locale: 'bn' | 'en';
}

export function PublicGalleryClient({
  initialPhotos,
  initialVideos,
  locale,
}: PublicGalleryClientProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('All');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('All');

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Filtered photos
  const filteredPhotos =
    selectedPhotoCategory === 'All'
      ? initialPhotos
      : initialPhotos.filter((p) => p.category === selectedPhotoCategory);

  // Filtered videos
  const filteredVideos =
    selectedVideoCategory === 'All'
      ? initialVideos
      : initialVideos.filter((v) => v.category === selectedVideoCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const isBn = locale === 'bn';

  return (
    <div className="space-y-8">
      {/* Top Tab Bar */}
      <div className="flex justify-center border-b border-surface-200">
        <nav className="-mb-px flex space-x-8" aria-label="Gallery Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-4 px-1 border-b-2 font-medium text-base sm:text-lg transition-colors ${
              activeTab === 'photos'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
            }`}
          >
            📸 {isBn ? 'ছবি গ্যালারি (Photos)' : 'Photo Gallery'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-base sm:text-lg transition-colors ${
              activeTab === 'videos'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
            }`}
          >
            🎬 {isBn ? 'ভিডিও গ্যালারি (Videos)' : 'Video Gallery'}
          </button>
        </nav>
      </div>

      {/* ================= PHOTOS TAB ================= */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedPhotoCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPhotoCategory === 'All'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              {isBn ? 'সব ছবি (All)' : 'All Photos'}
            </button>
            {PHOTO_CATEGORIES.map((cat) => {
              const label = PHOTO_CATEGORY_LABELS[cat]?.[locale] || cat;
              const isSelected = selectedPhotoCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPhotoCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Photo Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-16 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-surface-500 text-base">
                {isBn
                  ? 'এই বিভাগে বর্তমানে কোনো ছবি নেই।'
                  : 'No photos currently available in this category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, idx) => {
                const caption =
                  locale === 'en'
                    ? photo.caption_en || photo.caption_bn
                    : photo.caption_bn || photo.caption_en;
                const catLabel =
                  PHOTO_CATEGORY_LABELS[photo.category as PhotoCategory]?.[locale] ||
                  photo.category;

                return (
                  <Card
                    key={photo.id}
                    className="group cursor-pointer overflow-hidden border-surface-200 hover:shadow-lg transition-all duration-300"
                    onClick={() => openLightbox(idx)}
                  >
                    <div className="relative aspect-[4/3] bg-surface-200 overflow-hidden">
                      <Image
                        src={photo.image_url}
                        alt={caption || 'Gallery photo'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="primary">{catLabel}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-2 rounded-full text-lg">
                          🔍
                        </span>
                      </div>
                    </div>
                    {caption && (
                      <div className="p-3 bg-white border-t border-surface-100">
                        <p className="text-xs text-surface-700 line-clamp-2 font-medium">
                          {caption}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Accessible Lightbox Modal */}
          <Lightbox
            photos={filteredPhotos}
            currentIndex={lightboxIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            onNavigate={(newIdx) => setLightboxIndex(newIdx)}
            locale={locale}
          />
        </div>
      )}

      {/* ================= VIDEOS TAB ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedVideoCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedVideoCategory === 'All'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              {isBn ? 'সব ভিডিও (All)' : 'All Videos'}
            </button>
            {VIDEO_CATEGORIES.map((cat) => {
              const label = VIDEO_CATEGORY_LABELS[cat]?.[locale] || cat;
              const isSelected = selectedVideoCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedVideoCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Video Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-surface-500 text-base">
                {isBn
                  ? 'এই বিভাগে বর্তমানে কোনো ভিডিও নেই।'
                  : 'No videos currently available in this category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.map((video) => {
                const title =
                  (locale === 'en'
                    ? video.title_en || video.title_bn
                    : video.title_bn || video.title_en) || '';
                const catLabel =
                  VIDEO_CATEGORY_LABELS[video.category as VideoCategory]?.[locale] ||
                  video.category;

                return (
                  <div key={video.id} className="space-y-2">
                    <YouTubeFacade youtubeId={video.youtube_id} title={title} />
                    <div className="flex items-start justify-between gap-2 px-1">
                      <h3 className="text-sm font-bold text-surface-900 line-clamp-2">
                        {title}
                      </h3>
                      <Badge variant="accent" className="shrink-0">
                        {catLabel}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
