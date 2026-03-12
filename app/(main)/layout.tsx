import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { FittingRoomWidget } from '@/components/layout/FittingRoomWidget'
import { ToastProvider } from '@/components/ui/Toast'
import { AriaButton } from '@/components/aria/AriaButton'
import { NearestStorePrompt } from '@/components/location/NearestStorePrompt'
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <Navbar />
      <main className="min-h-dvh pt-16">{children}</main>
      <Footer />
      <BottomNav />
      <FittingRoomWidget />
      <AriaButton />
      <NearestStorePrompt />
      <ServiceWorkerRegistrar />
    </ToastProvider>
  )
}
