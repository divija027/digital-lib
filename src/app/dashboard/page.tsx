import { ResourceList } from '@/components/ResourceList'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VTU Resources</h1>
              <p className="text-gray-600">Browse and download study materials</p>
            </div>
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ResourceList showFilters={true} />
        </div>
      </main>
    </div>
  )
}
