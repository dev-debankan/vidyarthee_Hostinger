import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Megaphone, Calendar, Image as ImageIcon, Link as LinkIcon, Settings, MessageSquare, LogOut, Star } from 'lucide-react';
import { Button, ToastProvider } from '@/components/ui';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Notices', href: '/admin/notices', icon: Megaphone },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Highlights', href: '/admin/highlights', icon: Star },
    { name: 'Form Links', href: '/admin/forms', icon: LinkIcon },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-r border-surface-200 flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-surface-200">
            <h1 className="font-bold text-lg text-surface-900">Admin Panel</h1>
          </div>
          <div className="p-4 flex flex-col justify-between h-[calc(100vh-4rem)]">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-surface-700 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-colors"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="pt-4 border-t border-surface-200 mt-auto mb-4 md:mb-0">
              <div className="mb-4 px-3 text-sm text-surface-500 truncate">
                {user.email}
              </div>
              <form action="/api/auth/signout" method="post">
                <Button type="submit" variant="ghost" className="w-full justify-start text-danger hover:text-danger hover:bg-red-50">
                  <LogOut size={20} className="mr-3" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
