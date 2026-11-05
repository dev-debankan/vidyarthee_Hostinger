'use client';

import React, { useState, useTransition } from 'react';
import { Button, Input, Textarea, Select, useToast } from '@/components/ui';
import { NOTICE_CATEGORIES, NoticeCategory } from '@/lib/notices/validation';
import { createNoticeAction, updateNoticeAction } from './actions';
import { X, Upload, FileText, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticeToEdit?: any;
}

export function NoticeFormModal({ isOpen, onClose, noticeToEdit }: NoticeFormModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [contentType, setContentType] = useState<'text' | 'pdf' | 'txt'>(
    noticeToEdit?.file_type === 'pdf'
      ? 'pdf'
      : noticeToEdit?.file_type === 'txt'
      ? 'txt'
      : 'text'
  );

  const [category, setCategory] = useState<NoticeCategory>(
    noticeToEdit?.category || 'Latest'
  );

  const [titleBn, setTitleBn] = useState(noticeToEdit?.title_bn || '');
  const [titleEn, setTitleEn] = useState(noticeToEdit?.title_en || '');
  const [bodyBn, setBodyBn] = useState(noticeToEdit?.body_bn || '');
  const [bodyEn, setBodyEn] = useState(noticeToEdit?.body_en || '');
  const [isPinned, setIsPinned] = useState(noticeToEdit?.is_pinned || false);
  const [isPublished, setIsPublished] = useState(
    noticeToEdit ? noticeToEdit.is_published : true
  );

  // Default published_at date formatted for input (YYYY-MM-DDTHH:mm)
  const defaultPubDate = noticeToEdit?.published_at
    ? new Date(noticeToEdit.published_at).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);

  const [publishedAt, setPublishedAt] = useState(defaultPubDate);
  const [expiryDate, setExpiryDate] = useState(
    noticeToEdit?.expiry_date
      ? new Date(noticeToEdit.expiry_date).toISOString().slice(0, 16)
      : ''
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set('category', category);
    formData.set('content_type', contentType);
    formData.set('is_pinned', isPinned ? 'true' : 'false');
    formData.set('is_published', isPublished ? 'true' : 'false');

    if (selectedFile) {
      formData.set('file', selectedFile);
    }

    startTransition(async () => {
      let res;
      if (noticeToEdit) {
        res = await updateNoticeAction(noticeToEdit.id, formData);
      } else {
        res = await createNoticeAction(formData);
      }

      if (res.success) {
        toast(res.message || 'Notice saved successfully', 'success');
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to save notice');
        toast(res.error || 'Failed to save notice', 'error');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-50">
          <h2 className="text-xl font-bold text-surface-900">
            {noticeToEdit ? 'Edit Notice' : 'Create New Notice'}
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
                Title (Bengali) <span className="text-red-500">*</span>
              </label>
              <Input
                name="title_bn"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: ভর্তি বিজ্ঞপ্তি ২০২৬"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Title (English) <span className="text-surface-400">(Optional)</span>
              </label>
              <Input
                name="title_en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Admission Notice 2026"
              />
            </div>
          </div>

          {/* Category & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              >
                {NOTICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                name="published_at"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Expiry Date <span className="text-surface-400">(Optional)</span>
              </label>
              <Input
                type="datetime-local"
                name="expiry_date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-surface-700">
              <input
                type="checkbox"
                name="is_pinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
              />
              Pin to Top (Pinned notice appears first)
            </label>

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

          {/* Content Type Tabs */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Notice Content Source <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-surface-100 rounded-lg">
              <button
                type="button"
                onClick={() => setContentType('text')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  contentType === 'text'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Pasted Text
              </button>

              <button
                type="button"
                onClick={() => setContentType('pdf')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  contentType === 'pdf'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                PDF Upload
              </button>

              <button
                type="button"
                onClick={() => setContentType('txt')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  contentType === 'txt'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <FileCode className="w-4 h-4" />
                .TXT Upload
              </button>
            </div>
          </div>

          {/* Dynamic Content Inputs */}
          {contentType === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Text Body (Bengali) <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="body_bn"
                  value={bodyBn}
                  onChange={(e) => setBodyBn(e.target.value)}
                  placeholder="বিজ্ঞপ্তির বিস্তারিত বিবরণ লিখুন (লাইন ব্রেক সংরক্ষিত হবে)..."
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Text Body (English) <span className="text-surface-400">(Optional)</span>
                </label>
                <Textarea
                  name="body_en"
                  value={bodyEn}
                  onChange={(e) => setBodyEn(e.target.value)}
                  placeholder="Enter notice details in English..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {contentType === 'pdf' && (
            <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <Upload className="w-10 h-10 text-surface-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-surface-800">
                Upload PDF Document
              </p>
              <p className="text-xs text-surface-500 mb-4">
                Max 10 MB limit • Verified by magic bytes server-side
              </p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              {selectedFile && (
                <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {selectedFile.name} (
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
              {noticeToEdit?.file_url && !selectedFile && (
                <p className="mt-2 text-xs text-surface-600">
                  Current file: <a href={noticeToEdit.file_url} target="_blank" rel="noreferrer" className="underline text-primary-600">View Existing PDF</a>
                </p>
              )}
            </div>
          )}

          {contentType === 'txt' && (
            <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <FileCode className="w-10 h-10 text-surface-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-surface-800">
                Upload .TXT File
              </p>
              <p className="text-xs text-surface-500 mb-4">
                Max 200 KB limit • UTF-8 Bengali supported • Stored as DB text body
              </p>
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              {selectedFile && (
                <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          )}

          {/* Actions */}
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
              {noticeToEdit ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
