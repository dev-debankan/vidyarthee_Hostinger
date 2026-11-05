'use client';

import React, { useState, useTransition } from 'react';
import { Button, Input, Select, Badge, useToast } from '@/components/ui';
import { NOTICE_CATEGORIES } from '@/lib/notices/validation';
import { togglePublishNoticeAction, togglePinNoticeAction, deleteNoticeAction } from './actions';
import { NoticeFormModal } from './notice-form-modal';
import {
  Plus,
  Search,
  Pin,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  FileText,
  Upload,
  FileCode,
  Calendar,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

interface AdminNoticesClientProps {
  initialNotices: any[];
}

export function AdminNoticesClient({ initialNotices }: AdminNoticesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter notices
  const filteredNotices = initialNotices.filter((n) => {
    const matchesSearch =
      n.title_bn?.toLowerCase().includes(search.toLowerCase()) ||
      n.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      n.body_bn?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || n.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Published' && n.is_published) ||
      (selectedStatus === 'Draft' && !n.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateNew = () => {
    setNoticeToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (notice: any) => {
    setNoticeToEdit(notice);
    setIsFormOpen(true);
  };

  const handleTogglePublish = (id: string, is_published: boolean) => {
    startTransition(async () => {
      const res = await togglePublishNoticeAction(id, is_published);
      if (res.success) {
        toast(res.message || 'Status updated', 'success');
      } else {
        toast(res.error || 'Failed to update publish status', 'error');
      }
    });
  };

  const handleTogglePin = (id: string, is_pinned: boolean) => {
    startTransition(async () => {
      const res = await togglePinNoticeAction(id, is_pinned);
      if (res.success) {
        toast(res.message || 'Pin status updated', 'success');
      } else {
        toast(res.error || 'Failed to update pin status', 'error');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNoticeAction(id);
      if (res.success) {
        toast('Notice deleted successfully', 'success');
        setDeleteConfirmId(null);
      } else {
        toast(res.error || 'Failed to delete notice', 'error');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-surface-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary-600" />
            Manage Notices
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Create, edit, publish, pin or delete organization notices & announcements.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Notice
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-surface-400" />
          <Input
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {NOTICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published Only</option>
          <option value="Draft">Draft / Unpublished Only</option>
        </Select>
      </div>

      {/* Notices List Table / Cards */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center">
            <Megaphone className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-surface-800">No notices found</h3>
            <p className="text-sm text-surface-500 mt-1 mb-4">
              {search || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search query or filters.'
                : 'Get started by creating your first notice.'}
            </p>
            {(!search && selectedCategory === 'All' && selectedStatus === 'All') && (
              <Button onClick={handleCreateNew} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Create Notice
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200 text-xs uppercase font-semibold text-surface-600">
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Format</th>
                  <th className="px-4 py-4">Publish Date</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 text-sm">
                {filteredNotices.map((notice) => (
                  <tr
                    key={notice.id}
                    className={`hover:bg-surface-50/80 transition-colors ${
                      notice.is_pinned ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        {notice.is_pinned && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 mt-0.5">
                            <Pin className="w-3 h-3 fill-amber-700" /> Pinned
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-surface-900">
                            {notice.title_bn}
                          </div>
                          {notice.title_en && (
                            <div className="text-xs text-surface-500 mt-0.5">
                              {notice.title_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="primary">{notice.category || 'Latest'}</Badge>
                    </td>

                    {/* Format */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {notice.file_type === 'pdf' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
                          <Upload className="w-3.5 h-3.5" /> PDF (
                          {(notice.file_size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      ) : notice.file_type === 'txt' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                          <FileCode className="w-3.5 h-3.5" /> .TXT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          <FileText className="w-3.5 h-3.5" /> Pasted Text
                        </span>
                      )}
                    </td>

                    {/* Publish Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-surface-600 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-surface-400" />
                        {new Date(notice.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      {notice.expiry_date && (
                        <div className="text-[10px] text-amber-700 mt-0.5">
                          Expires: {new Date(notice.expiry_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleTogglePublish(notice.id, notice.is_published)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          notice.is_published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-surface-200 text-surface-700 hover:bg-surface-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {notice.is_published ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      {/* Pin Toggle */}
                      <button
                        onClick={() => handleTogglePin(notice.id, notice.is_pinned)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          notice.is_pinned
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'border-surface-200 text-surface-500 hover:bg-surface-100 hover:text-surface-900'
                        }`}
                        title={notice.is_pinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(notice)}
                        className="p-1.5 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors"
                        title="Edit Notice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="p-1.5 rounded-lg border border-surface-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Form Modal */}
      <NoticeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        noticeToEdit={noticeToEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-surface-900">Delete Notice</h3>
            </div>
            <p className="text-sm text-surface-600 mb-6">
              Are you sure you want to delete this notice? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteConfirmId)}
                isLoading={isPending}
              >
                Delete Notice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
