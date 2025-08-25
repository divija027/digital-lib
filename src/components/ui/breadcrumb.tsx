'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className={`flex items-center gap-2 text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-1 hover:text-blue-600 h-auto p-1"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Dashboard</span>
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && !item.current ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.href!)}
              className="hover:text-blue-600 h-auto p-1 font-normal"
            >
              {item.label}
            </Button>
          ) : (
            <span className={`${item.current ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
