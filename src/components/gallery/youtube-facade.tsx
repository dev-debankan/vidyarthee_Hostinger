'use client';

import { useState } from 'react';
import Image from 'next/image';

interface YouTubeFacadeProps {
  youtubeId: string;
  title: string;
}

export function YouTubeFacade({ youtubeId, title }: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  if (isLoaded) {
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black shadow-md">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      aria-label={`Play video: ${title}`}
      className="group relative aspect-video w-full rounded-lg overflow-hidden bg-surface-900 block text-left shadow-md focus:outline-2 focus:outline-primary-500 focus:outline-offset-2"
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />

      {/* Overlay gradient & Play Button */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 group-hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
