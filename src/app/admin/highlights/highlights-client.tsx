'use client';

import { useState } from 'react';
import { HighlightRow } from '@/types/database';
import {
  createHighlightAction,
  updateHighlightAction,
  toggleHighlightAction,
  deleteHighlightAction,
  reorderHighlightsAction,
} from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

const AVAILABLE_ICONS = [
  'BookOpen',
  'Library',
  'Calendar',
  'HeartPulse',
  'Ambulance',
  'Book',
  'GraduationCap',
  'Users',
  'Award',
  'Sparkles',
];

interface AdminHighlightsClientProps {
  initialHighlights: HighlightRow[];
}

export function AdminHighlightsClient({ initialHighlights }: AdminHighlightsClientProps) {
  const [highlights, setHighlights] = useState<HighlightRow[]>(initialHighlights);
  const [editingHighlight, setEditingHighlight] = useState<HighlightRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openEditModal = (hl: HighlightRow) => {
    setEditingHighlight(hl);
    setIsCreating(false);
    setTitleBn(hl.title_bn || '');
    setTitleEn(hl.title_en || '');
    setDescBn(hl.description_bn || '');
    setDescEn(hl.description_en || '');
    setIcon(hl.icon || 'BookOpen');
    setLink(hl.link || '');
    setIsActive(hl.is_active);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const openCreateModal = () => {
    setEditingHighlight(null);
    setIsCreating(true);
    setTitleBn('');
    setTitleEn('');
    setDescBn('');
    setDescEn('');
    setIcon('BookOpen');
    setLink('');
    setIsActive(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const closeModal = () => {
    setEditingHighlight(null);
    setIsCreating(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleToggle = async (hl: HighlightRow) => {
    setTogglingId(hl.id);
    const res = await toggleHighlightAction(hl.id, hl.is_active);
    if (res.success) {
      setHighlights((prev) =>
        prev.map((h) => (h.id === hl.id ? { ...h, is_active: !h.is_active } : h))
      );
    } else {
      alert(res.error || 'Failed to toggle status');
    }
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this highlight?')) return;
    const res = await deleteHighlightAction(id);
    if (res.success) {
      setHighlights((prev) => prev.filter((h) => h.id !== id));
    } else {
      alert(res.error || 'Failed to delete highlight');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newHls = [...highlights];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newHls.length) return;

    const temp = newHls[index];
    newHls[index] = newHls[targetIndex];
    newHls[targetIndex] = temp;

    const orderedIds = newHls.map((h) => h.id);
    setHighlights(newHls);

    await reorderHighlightsAction(orderedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!titleBn.trim()) {
      setErrorMsg('Bengali Title is required');
      return;
    }

    if (!descBn.trim()) {
      setErrorMsg('Bengali Description is required');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title_bn', titleBn);
    if (titleEn) formData.append('title_en', titleEn);
    formData.append('description_bn', descBn);
    if (descEn) formData.append('description_en', descEn);
    formData.append('icon', icon);
    if (link) formData.append('link', link);
    formData.append('is_active', isActive ? 'true' : 'false');

    let res;
    if (editingHighlight) {
      res = await updateHighlightAction(editingHighlight.id, formData);
    } else {
      res = await createHighlightAction(formData);
    }

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save highlight');
    } else {
      setSuccessMsg(res.message || 'Highlight saved successfully');
      setTimeout(() => {
        closeModal();
        window.location.reload();
      }, 1000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
            Homepage Highlights (মূল বৈশিষ্ট্যসমূহ)
          </h1>
          <p className="text-sm text-surface-600 mt-1">
            Manage key initiatives and service highlights displayed on the homepage.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          + Add New Highlight
        </Button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((hl, idx) => (
          <Card key={hl.id} className="flex flex-col justify-between border-surface-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant={hl.is_active ? 'success' : 'warning'}>
                  {hl.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-xs font-mono bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-semibold">
                  Icon: {hl.icon || 'BookOpen'}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-surface-900 pt-2">
                {hl.title_bn}
              </CardTitle>
              {hl.title_en && (
                <p className="text-xs text-surface-500 font-medium">
                  {hl.title_en}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pt-0 text-sm flex-1 flex flex-col justify-between">
              <p className="text-surface-700 leading-relaxed line-clamp-3">
                {hl.description_bn}
              </p>

              {hl.link && (
                <p className="text-xs text-accent-700 font-semibold truncate">
                  Link: {hl.link}
                </p>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    title="Move left/up"
                    className="h-7 w-7 p-0"
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={idx === highlights.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    title="Move right/down"
                    className="h-7 w-7 p-0"
                  >
                    →
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={hl.is_active ? 'secondary' : 'outline'}
                    size="sm"
                    disabled={togglingId === hl.id}
                    onClick={() => handleToggle(hl)}
                    className="h-7 text-xs px-2"
                  >
                    {hl.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(hl)}
                    className="h-7 text-xs px-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(hl.id)}
                    className="h-7 text-xs px-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Create / Edit */}
      {(editingHighlight || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-200 pb-3">
              <h2 className="text-xl font-bold text-surface-900">
                {editingHighlight ? `Edit Highlight: ${editingHighlight.title_bn}` : 'Add New Highlight'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-surface-400 hover:text-surface-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && <Alert variant="danger" title="Error">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success" title="Success">{successMsg}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Title (Bengali) *"
                  placeholder="যেমন: বিনামূল্যে কোচিং..."
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  required
                />
                <Input
                  label="Title (English)"
                  placeholder="Free Coaching..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Description (Bengali) *"
                  placeholder="সংক্ষিপ্ত বিবরণ..."
                  value={descBn}
                  onChange={(e) => setDescBn(e.target.value)}
                  rows={3}
                  required
                />
                <Textarea
                  label="Description (English)"
                  placeholder="Short description..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Select Icon *
                  </label>
                  <Select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </Select>
                </div>

                <Input
                  label="Target Link (e.g. /coaching)"
                  placeholder="/coaching or /events"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active_hl"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
                />
                <label htmlFor="is_active_hl" className="text-sm font-semibold text-surface-800">
                  Highlight Active (হোমপেজে প্রদর্শিত হবে)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Highlight'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
