import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream-100 flex">

      {/* Sidebar — visas bara på desktop */}
      <Sidebar />

      {/* Huvudinnehåll */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {/* Desktop: max-bredd och padding */}
          <div className="lg:max-w-4xl lg:mx-auto lg:px-8 lg:py-8">
            {children}
          </div>
        </main>

        {/* Bottom nav — visas bara på mobil */}
        <BottomNav />
      </div>

    </div>
  )
}
