import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-3xl" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-5 w-96" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-80" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <Skeleton className="w-14 h-14 rounded-2xl" />
                      <Skeleton className="w-4 h-4" />
                    </div>
                    
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-20" />
                      
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-14" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
