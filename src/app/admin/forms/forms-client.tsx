'use client';

import { useState } from 'react';
import { FormLinkRow } from '@/types/database';
import { updateFormLinkAction, toggleActiveFormLinkAction, deleteFormLinkAction, createFormLinkAction } from './actions';
import { validateGoogleFormUrl, validateGoogleSheetUrl } from '@/lib/forms/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

interface AdminFormsClientProps {
  initialForms: FormLinkRow[];
}

export function AdminFormsClient({ initialForms }: AdminFormsClientProps) {
  const [forms, setForms] = useState<FormLinkRow[]>(initialForms);
  const [editingForm, setEditingForm] = useState<FormLinkRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form edit state
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openEditModal = (form: FormLinkRow) => {
    setEditingForm(form);
    setIsCreating(false);
    setTitleBn(form.title_bn || '');
    setTitleEn(form.title_en || '');
    setDescBn(form.description_bn || '');
    setDescEn(form.description_en || '');
    setFormUrl(form.google_form_url || '');
    setSheetUrl(form.response_sheet_url || '');
    setSlug(form.slug || '');
    setIsActive(form.is_active);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const openCreateModal = () => {
    setEditingForm(null);
    setIsCreating(true);
    setTitleBn('');
    setTitleEn('');
    setDescBn('');
    setDescEn('');
    setFormUrl('');
    setSheetUrl('');
    setSlug('');
    setIsActive(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const closeModal = () => {
    setEditingForm(null);
    setIsCreating(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleToggleActive = async (form: FormLinkRow) => {
    setTogglingId(form.id);
    const res = await toggleActiveFormLinkAction(form.id, form.is_active);
    if (res.success) {
      setForms((prev) =>
        prev.map((f) => (f.id === form.id ? { ...f, is_active: !f.is_active } : f))
      );
    } else {
      alert(res.error || 'Failed to toggle status');
    }
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form link?')) return;
    const res = await deleteFormLinkAction(id);
    if (res.success) {
      setForms((prev) => prev.filter((f) => f.id !== id));
    } else {
      alert(res.error || 'Failed to delete form link');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!titleBn.trim()) {
      setErrorMsg('Bengali Title is required');
      return;
    }

    const formVal = validateGoogleFormUrl(formUrl);
    if (!formVal.valid) {
      setErrorMsg(formVal.error || 'Invalid Google Form URL');
      return;
    }

    if (sheetUrl.trim()) {
      const sheetVal = validateGoogleSheetUrl(sheetUrl);
      if (!sheetVal.valid) {
        setErrorMsg(sheetVal.error || 'Invalid Google Sheet URL');
        return;
      }
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title_bn', titleBn);
    if (titleEn) formData.append('title_en', titleEn);
    if (descBn) formData.append('description_bn', descBn);
    if (descEn) formData.append('description_en', descEn);
    formData.append('google_form_url', formUrl);
    if (sheetUrl) formData.append('response_sheet_url', sheetUrl);
    formData.append('is_active', isActive ? 'true' : 'false');

    let res;
    if (editingForm) {
      res = await updateFormLinkAction(editingForm.id, formData);
    } else {
      formData.append('slug', slug);
      res = await createFormLinkAction(formData);
    }

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save form link');
    } else {
      setForms((current) => {
        const savedForm = res.form as FormLinkRow;
        const nextForms = editingForm
          ? current.map((form) => (form.id === savedForm.id ? savedForm : form))
          : [...current, savedForm];

        return nextForms.sort(
          (left, right) =>
            left.sort_order - right.sort_order ||
            right.created_at.localeCompare(left.created_at)
        );
      });
      closeModal();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
            Form Links Management (অনলাইন ফরম লিঙ্কসমূহ)
          </h1>
          <p className="text-sm text-surface-600 mt-1">
            Manage embedded Google Forms and admin-only Google Sheet response URLs.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          + Add New Form Link
        </Button>
      </div>

      {/* Form Links Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map((form) => (
          <Card key={form.id} className="relative overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant={form.is_active ? 'success' : 'warning'} className="mb-2">
                    {form.is_active ? 'Active (খোলা)' : 'Closed / Inactive (বন্ধ)'}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-surface-900">
                    {form.title_bn}
                  </CardTitle>
                  {form.title_en && (
                    <p className="text-xs text-surface-500 font-medium">
                      {form.title_en}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono bg-surface-100 px-2 py-1 rounded text-surface-600">
                  /{form.slug || 'forms'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0 text-sm">
              {form.description_bn && (
                <p className="text-surface-700 line-clamp-2">
                  {form.description_bn}
                </p>
              )}

              <div className="space-y-2 bg-surface-50 p-3 rounded-lg border border-surface-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-surface-600">Google Form URL:</span>
                  <a
                    href={form.google_form_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-600 hover:underline truncate max-w-[200px]"
                  >
                    {form.google_form_url}
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-surface-200">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    📊 Admin Response Sheet:
                  </span>
                  {form.response_sheet_url ? (
                    <a
                      href={form.response_sheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded hover:bg-emerald-200 transition-colors"
                    >
                      View Sheet ↗
                    </a>
                  ) : (
                    <span className="text-surface-400 italic">No Sheet linked</span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                <Button
                  variant={form.is_active ? 'secondary' : 'outline'}
                  size="sm"
                  disabled={togglingId === form.id}
                  onClick={() => handleToggleActive(form)}
                  className="text-xs"
                >
                  {form.is_active ? 'Close Applications' : 'Open Applications'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(form)}
                    className="text-xs"
                  >
                    Edit Link
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(form.id)}
                    className="text-xs px-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit / Create Form Modal Overlay */}
      {(editingForm || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-200 pb-3">
              <h2 className="text-xl font-bold text-surface-900">
                {editingForm ? `Edit Form: ${editingForm.title_bn}` : 'Add New Form Link'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-surface-400 hover:text-surface-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && <Alert variant="danger" title="Validation Error">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success" title="Success">{successMsg}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isCreating && (
                <Input
                  label="URL Slug (e.g. admission-application) *"
                  placeholder="custom-form-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Title (Bengali) / ফরমের নাম (বাংলা) *"
                  placeholder="যেমন: ভর্তি আবেদনপত্র..."
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  required
                />
                <Input
                  label="Title (English) / Form Title (English)"
                  placeholder="Admission Application Form..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Description (Bengali) / বিবরণ (বাংলা)"
                  placeholder="আবেদন সম্পর্কে সংক্ষিপ্ত নির্দেশনা..."
                  value={descBn}
                  onChange={(e) => setDescBn(e.target.value)}
                  rows={3}
                />
                <Textarea
                  label="Description (English)"
                  placeholder="Instructions in English..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-surface-100">
                <Input
                  label="Google Form URL (পাবলিক ফরম লিঙ্ক) *"
                  placeholder="https://docs.google.com/forms/d/e/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  helperText="Must start with https:// and be hosted on docs.google.com/forms or forms.gle"
                  required
                />

                <Input
                  label="Google Sheet Response URL (অ্যাডমিন রেসপন্স শিট - কেবল অ্যাডমিন দেখবেন)"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  helperText="Admin-only private link to the Google Sheet storing submitted responses. Never shown publicly."
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-semibold text-surface-800">
                    Form Active / Accepting Applications (ফরম চালু রয়েছে)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Form Details'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
