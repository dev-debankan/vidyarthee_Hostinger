import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, Heading } from '@/components/ui'
import { Megaphone, Calendar, Image as ImageIcon, MessageSquare } from 'lucide-react'

export const revalidate = 0; // Don't cache admin pages

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch counts in parallel
  const [
    { count: noticesCount },
    { count: eventsCount },
    { count: galleryCount },
    { count: messagesCount }
  ] = await Promise.all([
    supabase.from('notices').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  const stats = [
    { name: 'Total Notices', value: noticesCount || 0, icon: Megaphone, color: 'text-primary-600', bg: 'bg-primary-50' },
    { name: 'Total Events', value: eventsCount || 0, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Gallery Items', value: galleryCount || 0, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Unread Messages', value: messagesCount || 0, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="space-y-6">
      <Heading level={2}>Overview</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-500">{stat.name}</p>
                    <p className="text-3xl font-bold text-surface-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 bg-white rounded-lg border border-surface-200 p-8 text-center">
        <Heading level={3} className="mb-2">Welcome to the Admin Panel</Heading>
        <p className="text-surface-600 max-w-2xl mx-auto">
          Use the sidebar to navigate through the different sections of the website. You can manage notices, events, gallery images, and view messages submitted through the contact form.
        </p>
      </div>
    </div>
  )
}
