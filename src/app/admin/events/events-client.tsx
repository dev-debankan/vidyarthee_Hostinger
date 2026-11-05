"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Button, Input, Select, Badge, useToast } from "@/components/ui";
import { EVENT_CATEGORIES } from "@/lib/events/validation";
import { togglePublishEventAction, deleteEventAction } from "./actions";
import { EventFormModal } from "./event-form-modal";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

interface AdminEventsClientProps {
  initialEvents: any[];
}

export function AdminEventsClient({ initialEvents }: AdminEventsClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter events
  const filteredEvents = initialEvents.filter((ev) => {
    const matchesSearch =
      ev.title_bn?.toLowerCase().includes(search.toLowerCase()) ||
      ev.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      ev.location?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || ev.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Published" && ev.is_published) ||
      (selectedStatus === "Draft" && !ev.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateNew = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: any) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleTogglePublish = (id: string, is_published: boolean) => {
    startTransition(async () => {
      const res = await togglePublishEventAction(id, is_published);
      if (res.success) {
        toast(res.message || "Status updated", "success");
      } else {
        toast(res.error || "Failed to update publish status", "error");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteEventAction(id);
      if (res.success) {
        toast("Event deleted successfully", "success");
        setDeleteConfirmId(null);
      } else {
        toast(res.error || "Failed to delete event", "error");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-surface-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-600" />
            Manage Events
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Create, edit, publish or delete upcoming and cultural events.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-surface-400" />
          <Input
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories (6)</option>
          {EVENT_CATEGORIES.map((cat) => (
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

      {/* Events Table / Card Grid */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-surface-800">
              No events found
            </h3>
            <p className="text-sm text-surface-500 mt-1 mb-4">
              {search || selectedCategory !== "All" || selectedStatus !== "All"
                ? "Try adjusting your search query or category filters."
                : "Get started by creating your first event."}
            </p>
            {!search &&
              selectedCategory === "All" &&
              selectedStatus === "All" && (
                <Button onClick={handleCreateNew} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Create Event
                </Button>
              )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200 text-xs uppercase font-semibold text-surface-600">
                  <th className="px-6 py-4">Event & Cover</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Date & Time</th>
                  <th className="px-4 py-4">Location / Venue</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 text-sm">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-surface-50/80 transition-colors"
                  >
                    {/* Cover & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.cover_image_url ? (
                          <Image
                            src={event.cover_image_url}
                            alt={event.title_bn}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-surface-200 flex-shrink-0"
                            unoptimized
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center text-surface-400 flex-shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-surface-900">
                            {event.title_bn}
                          </div>
                          {event.title_en && (
                            <div className="text-xs text-surface-500 mt-0.5">
                              {event.title_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="accent">
                        {event.category || "Educational"}
                      </Badge>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-surface-600">
                      <div className="flex items-center gap-1 font-medium text-surface-800">
                        <Calendar className="w-3.5 h-3.5 text-primary-600" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-surface-500">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-xs text-surface-700 max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() =>
                          handleTogglePublish(event.id, event.is_published)
                        }
                        disabled={isPending}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          event.is_published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-surface-200 text-surface-700 hover:bg-surface-300"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {event.is_published ? (
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
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(event.id)}
                        className="p-1.5 rounded-lg border border-surface-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete Event"
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

      {/* Form Modal */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        eventToEdit={eventToEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-surface-900">
                Delete Event
              </h3>
            </div>
            <p className="text-sm text-surface-600 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
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
                Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
