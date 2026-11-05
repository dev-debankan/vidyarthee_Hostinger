'use client';

import { useState, useTransition } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge, Button, Input, useToast } from '@/components/ui';
import { Tables } from '@/types/database';
import { deleteMessageAction, setMessageReadAction } from './actions';

type ContactMessage = Tables<'messages'>;
type MessageFilter = 'all' | 'unread' | 'read';

interface AdminMessagesClientProps {
  initialMessages: ContactMessage[];
  loadError: string | null;
}

export function AdminMessagesClient({
  initialMessages,
  loadError,
}: AdminMessagesClientProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [isPending, startTransition] = useTransition();

  const unreadCount = messages.filter((message) => !message.is_read).length;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      !normalizedSearch ||
      [message.name, message.email, message.phone, message.message]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch));
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !message.is_read) ||
      (filter === 'read' && message.is_read);

    return matchesSearch && matchesFilter;
  });

  const handleSetRead = (message: ContactMessage) => {
    const nextIsRead = !message.is_read;
    startTransition(async () => {
      const result = await setMessageReadAction(message.id, nextIsRead);
      if (!result.success) {
        toast(result.error || 'Failed to update message', 'error');
        return;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, is_read: nextIsRead } : item
        )
      );
      toast(nextIsRead ? 'Message marked as read' : 'Message marked as unread', 'success');
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteMessageAction(deleteTarget.id);
      if (!result.success) {
        toast(result.error || 'Failed to delete message', 'error');
        return;
      }

      setMessages((current) => current.filter((item) => item.id !== deleteTarget.id));
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
      toast('Message deleted', 'success');
    });
  };

  const openReplyComposer = (message: ContactMessage) => {
    setReplyTarget(message);
    setReplyDraft(`\n\n--- Original message from ${message.name} ---\n${message.message}`);
  };

  const replySubject = replyTarget ? `Re: Message from ${replyTarget.name}` : '';
  const gmailComposeUrl = replyTarget
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(replyTarget.email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyDraft)}`
    : '#';
  const mailtoUrl = replyTarget
    ? `mailto:${replyTarget.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyDraft)}`
    : '#';

  const copyReplyDetails = async () => {
    if (!replyTarget) return;

    const replyDetails = `To: ${replyTarget.email}\nSubject: ${replySubject}\n\n${replyDraft}`;
    try {
      await navigator.clipboard.writeText(replyDetails);
      toast('Recipient, subject and draft copied', 'success');
    } catch {
      toast('Clipboard access is unavailable in this browser', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-surface-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-surface-900">
            <MessageSquare className="h-6 w-6 text-primary-600" />
            Contact Messages
          </h1>
          <p className="mt-1 text-sm text-surface-500">
            Messages sent through the public contact form.
          </p>
        </div>
        <div className="flex items-center gap-2" aria-live="polite">
          <Badge variant="default">{messages.length} total</Badge>
          <Badge variant={unreadCount ? 'warning' : 'success'}>
            {unreadCount} unread
          </Badge>
        </div>
      </header>

      {loadError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Messages could not be loaded: {loadError}
        </div>
      )}

      <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-surface-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or message"
              aria-label="Search contact messages"
              className="pl-9"
            />
          </div>
          <div className="inline-flex self-start rounded-lg bg-surface-100 p-1" aria-label="Message status filter">
            {(['all', 'unread', 'read'] as const).map((status) => (
              <button
                key={status}
                type="button"
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
                className={`min-h-9 rounded-md px-3 text-sm font-medium capitalize transition-colors ${
                  filter === status
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm">
        {filteredMessages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-surface-300" />
            <h2 className="text-lg font-semibold text-surface-800">
              {messages.length === 0 ? 'No messages yet' : 'No matching messages'}
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              {messages.length === 0
                ? 'New contact form submissions will appear here.'
                : 'Try a different search or status filter.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-surface-200">
            {filteredMessages.map((message) => {
              const isExpanded = expandedId === message.id;
              const phoneHref = message.phone?.replace(/[^\d+]/g, '');

              return (
                <li
                  key={message.id}
                  className={message.is_read ? 'bg-white' : 'bg-primary-50/40'}
                >
                  <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} message from ${message.name}`}
                      onClick={() => setExpandedId(isExpanded ? null : message.id)}
                      className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {!message.is_read && (
                          <span className="h-2 w-2 rounded-full bg-primary-600" aria-label="Unread" />
                        )}
                        <span className="font-semibold text-surface-900">{message.name}</span>
                        <span className="inline-flex items-center gap-1 text-sm text-surface-600">
                          <Mail className="h-3.5 w-3.5" />
                          {message.email}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-surface-500">
                          {new Date(message.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                          {isExpanded ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-surface-600">
                        {message.message}
                      </p>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-surface-200 bg-surface-50 px-5 py-5 sm:px-6">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-surface-800">
                        {message.message}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => openReplyComposer(message)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700"
                        >
                          <Mail className="h-4 w-4" /> Reply by email
                        </Button>
                        {phoneHref && (
                          <a
                            href={`tel:${phoneHref}`}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-surface-300 bg-white px-3 text-sm font-medium text-surface-700 hover:bg-surface-100"
                          >
                            <Phone className="h-4 w-4" /> Call
                          </a>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleSetRead(message)}
                        >
                          <Check className="mr-1.5 h-4 w-4" />
                          Mark as {message.is_read ? 'unread' : 'read'}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          disabled={isPending}
                          onClick={() => setDeleteTarget(message)}
                        >
                          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-message-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <h2 id="delete-message-title" className="text-lg font-bold text-surface-900">
              Delete this message?
            </h2>
            <p className="mt-2 text-sm text-surface-600">
              This will permanently delete the message from {deleteTarget.name}.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                isLoading={isPending}
                onClick={handleDelete}
              >
                Delete message
              </Button>
            </div>
          </div>
        </div>
      )}

      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reply-message-title"
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="reply-message-title" className="text-lg font-bold text-surface-900">
                  Reply to {replyTarget.name}
                </h2>
                <p className="mt-1 break-all text-sm text-surface-600">To: {replyTarget.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="rounded-md p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-900"
                aria-label="Close reply composer"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <label htmlFor="reply-subject" className="mt-5 block text-sm font-medium text-surface-700">
              Subject
            </label>
            <Input id="reply-subject" value={replySubject} readOnly className="mt-1" />

            <label htmlFor="reply-draft" className="mt-4 block text-sm font-medium text-surface-700">
              Draft
            </label>
            <textarea
              id="reply-draft"
              value={replyDraft}
              onChange={(event) => setReplyDraft(event.target.value)}
              rows={8}
              className="mt-1 w-full resize-y rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={copyReplyDetails}>
                Copy reply details
              </Button>
              <a
                href={mailtoUrl}
                className="inline-flex h-10 items-center rounded-lg border border-surface-300 px-4 text-sm font-medium text-surface-700 hover:bg-surface-100"
              >
                Open email app
              </a>
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-lg bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
              >
                Open Gmail compose
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}