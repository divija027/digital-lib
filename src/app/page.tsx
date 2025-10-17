'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

// Components
import { Footer4 } from '@/components/Footer4'
import { LogoutConfirmation } from '@/components/LogoutConfirmation'
import { BlogSection } from '@/components/blog'
import { Header1 } from '@/components/Header1'
import { Navbar14 } from '@/components/Navbar14'
import { Layout375 } from '@/components/Layout375'
import { Layout409 } from '@/components/Layout409'
import { EventSection } from '@/components/EventSection'

/**
 * Home Page Component
 * 
 * Main landing page for BrainReef - VTU Learning Platform
 * 
 * Sections:
 * - Navbar (Navbar14): Top navigation with authentication
 * - Hero (Header1): Main hero section with CTA
 * - MCQ Section (Layout375): Interactive quiz features showcase
 * - Features (Layout409): Why choose BrainReef section
 * - Events (EventSection): Upcoming events and workshops
 * - Blog Preview (BlogSection): Latest blog posts
 * - Footer (Footer4): Site footer with links
 */
export default function Home() {
  // ===========================
  // State Management
  // ===========================
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ===========================
  // Event Handlers
  // ===========================
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      logout()
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // ===========================
  // Render
  // ===========================
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar14 />

      {/* Navbar Spacer - prevents content overlap with fixed navbar */}
      <div className="h-24 md:h-28" aria-hidden="true" />

      {/* Main Content */}
      <main>
        {/* Hero Section - Main CTA and value proposition */}
        <Header1 />

        {/* MCQ/Quiz Features Section */}
        <Layout375 />

        {/* Features/Benefits Section - Why choose BrainReef */}
        <Layout409 />

        {/* Events Section - Upcoming events and workshops */}
        <EventSection />

        {/* Blog Preview Section - Latest articles */}
        <BlogSection />
      </main>

      {/* Site Footer */}
      <Footer4 />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        userName={user?.name}
        isLoading={isLoggingOut}
        variant="main"
      />
    </div>
  )
}
