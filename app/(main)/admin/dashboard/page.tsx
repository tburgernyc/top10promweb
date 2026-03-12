import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { AppointmentList } from '@/components/admin/AppointmentList'
import { RecentInquiries } from '@/components/admin/RecentInquiries'
import { PopularDresses } from '@/components/admin/PopularDresses'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles').select('role').eq('id', user.id).single()

  const role = profile?.role as UserRole
  let boutiqueId: string | null = null

  if (role !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any)
      .from('boutique_staff').select('boutique_id').eq('user_id', user.id).single()
    boutiqueId = staff?.boutique_id ?? null
  }

  const today = new Date().toISOString().split('T')[0]

  // Build today's appointment query — scope to boutique if not platform admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let apptQuery = (supabase as any)
    .from('availability_inquiries')
    .select('id, customer_name, preferred_time, status, dress:dresses(name)')
    .eq('preferred_date', today)
    .in('status', ['confirmed', 'pending'])
    .order('preferred_time')
  if (boutiqueId) apptQuery = apptQuery.eq('boutique_id', boutiqueId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inquiryQuery = (supabase as any)
    .from('availability_inquiries')
    .select('id, customer_name, customer_email, created_at, status, dress:dresses(name), boutique:boutiques(name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)
  if (boutiqueId) inquiryQuery = inquiryQuery.eq('boutique_id', boutiqueId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resQuery = (supabase as any)
    .from('dress_reservations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'reserved')
  if (boutiqueId) resQuery = resQuery.eq('boutique_id', boutiqueId)

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let confirmedQuery = (supabase as any)
    .from('availability_inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'confirmed')
    .gte('created_at', monthStart)
  if (boutiqueId) confirmedQuery = confirmedQuery.eq('boutique_id', boutiqueId)

  const [todayAppts, recentInquiries, reservationCount, confirmedCount] = await Promise.all([
    apptQuery, inquiryQuery, resQuery, confirmedQuery,
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Dashboard</h1>
        <p className="text-platinum text-sm mt-1">
          {role === 'platform_admin' ? 'All locations overview' : `Today — ${today}`}
        </p>
      </div>

      <DashboardStats
        todayAppointments={todayAppts.data?.length ?? 0}
        pendingInquiries={recentInquiries.data?.length ?? 0}
        activeReservations={reservationCount.count ?? 0}
        confirmedThisMonth={confirmedCount.count ?? 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentList appointments={todayAppts.data ?? []} date={today} />
        <RecentInquiries inquiries={recentInquiries.data ?? []} />
      </div>

      <PopularDresses boutiqueId={boutiqueId} />
    </div>
  )
}
