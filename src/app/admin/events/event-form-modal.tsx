'use client';

import React, { useState, useTransition } from 'react';
import { Button, Input, Textarea, Select, useToast } from '@/components/ui';
import { EVENT_CATEGORIES, EventCategory } from '@/lib/events/validation';
import { createEventAction, updateEventAction } from './actions';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: any;
}

export function EventFormModal({ isOpen, onClose, eventToEdit }: EventFormModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState<EventCategory>(
    eventToEdit?.category || 'Educational'
  );
  const [titleBn, setTitleBn] = useState(eventToEdit?.title_bn || '');
  const [titleEn, setTitleEn] = useState(eventToEdit?.title_en || '');
  const [descriptionBn, setDescriptionBn] = useState(eventToEdit?.description_bn || '');
  const [descriptionEn, setDescriptionEn] = useState(eventToEdit?.description_en || '');
  const [date, setDate] = useState(
    eventToEdit?.date || new Date().toISOString().slice(0, 10)
  );
  const [time, setTime] = useState(eventToEdit?.time || 'সকাল ১০:০০');
  const [location, setLocation] = useState(
    eventToEdit?.location || 'বিদ্যার্থী ভবন, শিমুরালি'
  );
  const [isPublished, setIsPublished] = useState(
    eventToEdit ? eventToEdit.is_published : true
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set('category', category);
    formData.set('is_published', isPublished ? 'true' : 'false');

    if (selectedImage) {
      formData.set('cover_image', selectedImage);
    }

    startTransition(async () => {
      let res;
      if (eventToEdit) {
        res = await updateEventAction(eventToEdit.id, formData);
      } else {
        res = await createEventAction(formData);
      }

      if (res.success) {
        toast(res.message || 'Event saved successfully', 'success');
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to save event');
        toast(res.error || 'Failed to save event', 'error');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50">
          <h2 className="text-xl font-bold text-surface-900">
            {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-500 hover:text-surface-800 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Event Title (Bengali) <span className="text-red-500">*</span>
              </label>
              <Input
                name="title_bn"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Event Title (English) <span className="text-surface-400">(Optional)</span>
              </label>
              <Input
                name="title_en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Annual Sports Competition 2026"
              />
            </div>
          </div>

          {/* Category & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Event Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <Input
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="যেমন: সকাল ১০:০০ টা"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Venue / Location <span className="text-red-500">*</span>
            </label>
            <Input
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="যেমন: শিমুরালি বিদ্যার্থী ভবন প্রাংগন"
              required
            />
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Description (Bengali) <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description_bn"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="অনুষ্ঠানের বিশদ বিবরণ লিখুন..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Description (English) <span className="text-surface-400">(Optional)</span>
              </label>
              <Textarea
                name="description_en"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Enter event description in English..."
                rows={3}
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="border-2 border-dashed border-surface-300 rounded-lg p-5 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-8 h-8 text-surface-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-surface-800">
              Event Cover Image
            </p>
            <p className="text-xs text-surface-500 mb-3">
              JPEG, PNG or WebP • Max 2 MB
            </p>
            <input
              type="file"
              name="cover_image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
            {selectedImage && (
              <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {selectedImage.name} (
                {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            {eventToEdit?.cover_image_url && !selectedImage && (
              <p className="mt-2 text-xs text-surface-600">
                Current cover image:{' '}
                <a
                  href={eventToEdit.cover_image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-primary-600 font-medium"
                >
                  View Image
                </a>
              </p>
            )}
          </div>

          {/* Published Toggle */}
          <div className="py-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-surface-700">
              <input
                type="checkbox"
                name="is_published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-surface-300 focus:ring-emerald-500"
              />
              Publish Status (Visible on public site)
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
