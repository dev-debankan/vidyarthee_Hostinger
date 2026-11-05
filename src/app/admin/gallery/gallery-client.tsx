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
  compressImageToWebP,
} from '@/lib/gallery/utils';
import {
  uploadGalleryPhotosAction,
  deleteGalleryPhotoAction,
  reorderGalleryPhotosAction,
  createGalleryVideoAction,
  deleteGalleryVideoAction,
  reorderGalleryVideosAction,
} from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

interface AdminGalleryClientProps {
  initialPhotos: GalleryItemRow[];
  initialVideos: GalleryVideoRow[];
}

export function AdminGalleryClient({
  initialPhotos,
  initialVideos,
}: AdminGalleryClientProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [photos, setPhotos] = useState<GalleryItemRow[]>(initialPhotos);
  const [videos, setVideos] = useState<GalleryVideoRow[]>(initialVideos);

  const [filterPhotoCat, setFilterPhotoCat] = useState<string>('All');
  const [filterVideoCat, setFilterVideoCat] = useState<string>('All');

  // Photo upload form state
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('Events');
  const [photoCaptionBn, setPhotoCaptionBn] = useState('');
  const [photoCaptionEn, setPhotoCaptionEn] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [compressionProgress, setCompressionProgress] = useState('');

  // Video add form state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoTitleBn, setVideoTitleBn] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoCategory, setVideoCategory] = useState<VideoCategory>('Events');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoError, setVideoError] = useState('');
  const [videoSuccess, setVideoSuccess] = useState('');
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  // Deleting states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered lists
  const filteredPhotos =
    filterPhotoCat === 'All'
      ? photos
      : photos.filter((p) => p.category === filterPhotoCat);

  const filteredVideos =
    filterVideoCat === 'All'
      ? videos
      : videos.filter((v) => v.category === filterVideoCat);

  // Handle photo multi-upload with client-side compression
  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError('');
    setPhotoSuccess('');

    if (!photoFiles || photoFiles.length === 0) {
      setPhotoError('Please select at least one photo file.');
      return;
    }

    setIsUploadingPhotos(true);

    try {
      const formData = new FormData();
      formData.append('category', photoCategory);
      if (photoCaptionBn) formData.append('caption_bn', photoCaptionBn);
      if (photoCaptionEn) formData.append('caption_en', photoCaptionEn);

      for (let i = 0; i < photoFiles.length; i++) {
        const rawFile = photoFiles[i];
        setCompressionProgress(
          `Compressing image ${i + 1} of ${photoFiles.length} (${rawFile.name} to WebP max 1920px)...`
        );
        // Perform client-side canvas compression (max 1920px WebP)
        const compressed = await compressImageToWebP(rawFile, 1920, 0.85);
        formData.append('files', compressed);
      }

      setCompressionProgress('Uploading compressed images to server...');
      const res = await uploadGalleryPhotosAction(formData);

      if (!res.success) {
        setPhotoError(res.error || 'Failed to upload photos');
      } else {
        setPhotoSuccess(res.message || 'Photos uploaded successfully');
        setPhotoFiles([]);
        setPhotoCaptionBn('');
        setPhotoCaptionEn('');
        // Reload photos list (simplified by re-fetch or state update)
        window.location.reload();
      }
    } catch (err: any) {
      setPhotoError(err.message || 'Error processing images');
    } finally {
      setIsUploadingPhotos(false);
      setCompressionProgress('');
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    setDeletingId(id);
    const res = await deleteGalleryPhotoAction(id);
    if (res.success) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.error || 'Failed to delete photo');
    }
    setDeletingId(null);
  };

  // Handle photo reorder
  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    const newPhotos = [...filteredPhotos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    const orderedIds = newPhotos.map((p) => p.id);
    setPhotos(newPhotos);

    await reorderGalleryPhotosAction(orderedIds);
  };

  // Handle video creation
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError('');
    setVideoSuccess('');

    if (!videoTitleBn.trim()) {
      setVideoError('Bengali Title is required');
      return;
    }

    if (!youtubeUrl.trim()) {
      setVideoError('YouTube URL is required');
      return;
    }

    setIsSubmittingVideo(true);

    const formData = new FormData();
    formData.append('title_bn', videoTitleBn);
    if (videoTitleEn) formData.append('title_en', videoTitleEn);
    formData.append('category', videoCategory);
    formData.append('youtube_url', youtubeUrl);

    const res = await createGalleryVideoAction(formData);

    if (!res.success) {
      setVideoError(res.error || 'Failed to add video');
    } else {
      setVideoSuccess('Video added successfully');
      setVideoTitleBn('');
      setVideoTitleEn('');
      setYoutubeUrl('');
      setIsAddingVideo(false);
      window.location.reload();
    }

    setIsSubmittingVideo(false);
  };

  // Handle video deletion
  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    setDeletingId(id);
    const res = await deleteGalleryVideoAction(id);
    if (res.success) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert(res.error || 'Failed to delete video');
    }
    setDeletingId(null);
  };

  // Handle video reorder
  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const newVideos = [...filteredVideos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newVideos.length) return;

    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    const orderedIds = newVideos.map((v) => v.id);
    setVideos(newVideos);

    await reorderGalleryVideosAction(orderedIds);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
            Gallery Management (গ্যালারি ব্যবস্থাপনা)
          </h1>
          <p className="text-sm text-surface-600 mt-1">
            Manage photos and YouTube video links displayed in the public gallery.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-surface-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'photos'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            📷 Photo Gallery ({photos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'videos'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            🎥 Video Gallery ({videos.length})
          </button>
        </div>
      </div>

      {/* ================= PHOTOS TAB ================= */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>Upload Photos (নতুন ছবি আপলোড)</span>
                <span className="text-xs font-normal text-surface-500">
                  Client-side compressed to ≤ 1920px WebP
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {photoError && <Alert variant="danger" title="Error" className="mb-4">{photoError}</Alert>}
              {photoSuccess && <Alert variant="success" title="Success" className="mb-4">{photoSuccess}</Alert>}

              <form onSubmit={handlePhotoUpload} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Category (বিভাগ) *
                    </label>
                    <Select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value as PhotoCategory)}
                    >
                      {PHOTO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} ({PHOTO_CATEGORY_LABELS[cat].bn})
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Select Photos (এক বা একাধিক ছবি) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setPhotoFiles(Array.from(e.target.files));
                        }
                      }}
                      className="w-full text-sm text-surface-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Caption (Bengali) / বিবরণ (বাংলা)"
                    placeholder="ছবি সম্পর্কিত বিবরণ..."
                    value={photoCaptionBn}
                    onChange={(e) => setPhotoCaptionBn(e.target.value)}
                  />
                  <Input
                    label="Caption (English) / Description (English)"
                    placeholder="Photo description in English..."
                    value={photoCaptionEn}
                    onChange={(e) => setPhotoCaptionEn(e.target.value)}
                  />
                </div>

                {compressionProgress && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 animate-pulse">
                    ⚡ {compressionProgress}
                  </div>
                )}

                <Button type="submit" disabled={isUploadingPhotos || photoFiles.length === 0}>
                  {isUploadingPhotos ? 'Uploading Compressed Images...' : `Upload ${photoFiles.length > 0 ? `${photoFiles.length} Photo(s)` : 'Photos'}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Filter & Photos List */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-surface-900">Existing Photos</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-surface-600">Filter Category:</span>
              <select
                value={filterPhotoCat}
                onChange={(e) => setFilterPhotoCat(e.target.value)}
                className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm"
              >
                <option value="All">All Categories ({photos.length})</option>
                {PHOTO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({photos.filter((p) => p.category === cat).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-surface-200 text-surface-500">
              No photos found for category &quot;{filterPhotoCat}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, idx) => (
                <Card key={photo.id} className="overflow-hidden group">
                  <div className="relative aspect-video bg-surface-100">
                    <Image
                      src={photo.image_url}
                      alt={photo.caption_bn || 'Gallery photo'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="primary">{photo.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-xs text-surface-700 line-clamp-2 font-medium">
                      {photo.caption_bn || photo.caption_en || 'No caption'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMovePhoto(idx, 'up')}
                          title="Move up in order"
                          className="h-7 w-7 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === filteredPhotos.length - 1}
                          onClick={() => handleMovePhoto(idx, 'down')}
                          title="Move down in order"
                          className="h-7 w-7 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deletingId === photo.id}
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="h-7 text-xs px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= VIDEOS TAB ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Video Form / Toggle */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  Add YouTube Video Link (নতুন ভিডিও লিঙ্ক যোগ করুন)
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingVideo(!isAddingVideo)}
                >
                  {isAddingVideo ? 'Close Form' : '+ Add Video'}
                </Button>
              </div>
            </CardHeader>

            {isAddingVideo && (
              <CardContent className="border-t border-surface-100 pt-4">
                {videoError && <Alert variant="danger" title="Error" className="mb-4">{videoError}</Alert>}
                {videoSuccess && <Alert variant="success" title="Success" className="mb-4">{videoSuccess}</Alert>}

                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Title (Bengali) / ভিডিওর শিরোনাম (বাংলা) *"
                      placeholder="যেমন: বাৎসরিক পুরস্কার বিতরণী..."
                      value={videoTitleBn}
                      onChange={(e) => setVideoTitleBn(e.target.value)}
                      required
                    />
                    <Input
                      label="Title (English) / Video Title (English)"
                      placeholder="Annual Prize Distribution..."
                      value={videoTitleEn}
                      onChange={(e) => setVideoTitleEn(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Category (বিভাগ) *
                      </label>
                      <Select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value as VideoCategory)}
                      >
                        {VIDEO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat} ({VIDEO_CATEGORY_LABELS[cat].bn})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <Input
                      label="YouTube Video Link / URL *"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      helperText="Supports youtube.com/watch?v=..., youtu.be/..., shorts/..."
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsAddingVideo(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingVideo}>
                      {isSubmittingVideo ? 'Saving Video...' : 'Save Video Link'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Filter & Videos List */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-surface-900">Existing Videos</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-surface-600">Filter Category:</span>
              <select
                value={filterVideoCat}
                onChange={(e) => setFilterVideoCat(e.target.value)}
                className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm"
              >
                <option value="All">All Categories ({videos.length})</option>
                {VIDEO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({videos.filter((v) => v.category === cat).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-surface-200 text-surface-500">
              No videos found for category &quot;{filterVideoCat}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.map((video, idx) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title_bn}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        ▶
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="accent">{video.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-surface-900 line-clamp-1">
                        {video.title_bn}
                      </h3>
                      {video.title_en && (
                        <p className="text-xs text-surface-500 line-clamp-1">
                          {video.title_en}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveVideo(idx, 'up')}
                          title="Move up"
                          className="h-7 w-7 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === filteredVideos.length - 1}
                          onClick={() => handleMoveVideo(idx, 'down')}
                          title="Move down"
                          className="h-7 w-7 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deletingId === video.id}
                        onClick={() => handleDeleteVideo(video.id)}
                        className="h-7 text-xs px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
