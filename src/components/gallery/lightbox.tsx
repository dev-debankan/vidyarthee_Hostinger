'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryItemRow } from '@/types/database';
import { PHOTO_CATEGORY_LABELS, PhotoCategory } from '@/lib/gallery/utils';
import { Badge } from '@/components/ui/badge';

interface LightboxProps {
  photos: GalleryItemRow[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  locale: 'bn' | 'en';
}

export function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  locale,
}: LightboxProps) {
  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    },
    [isOpen, onClose, handlePrev, handleNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentPhoto) return null;

  const caption =
    locale === 'en'
      ? currentPhoto.caption_en || currentPhoto.caption_bn || ''
      : currentPhoto.caption_bn || currentPhoto.caption_en || '';

  const catLabel =
    PHOTO_CATEGORY_LABELS[currentPhoto.category as PhotoCategory]?.[locale] ||
    currentPhoto.category;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300"
    >
      {/* Background click listener */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Lightbox"
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors focus:outline-2 focus:outline-primary-500"
      >
        ✕
      </button>

      {/* Previous Button */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Photo"
          className="absolute left-4 z-50 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-colors focus:outline-2 focus:outline-primary-500"
        >
          ‹
        </button>
      )}

      {/* Next Button */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Photo"
          className="absolute right-4 z-50 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-colors focus:outline-2 focus:outline-primary-500"
        >
          ›
        </button>
      )}

      {/* Main Content Box */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-full h-[65vh] sm:h-[75vh]">
          <Image
            src={currentPhoto.image_url}
            alt={caption || 'Enlarged gallery photo'}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption & Metadata Footer */}
        <div className="w-full text-center space-y-2 px-4">
          <div className="flex items-center justify-center gap-3">
            <Badge variant="primary">{catLabel}</Badge>
            <span className="text-xs text-white/60">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
          {caption && (
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
