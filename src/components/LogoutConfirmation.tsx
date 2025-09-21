'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { LogOut, AlertTriangle, X } from 'lucide-react'

interface LogoutConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName?: string
  isLoading?: boolean
  variant?: 'main' | 'admin'
}

export function LogoutConfirmation({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
  variant = 'main'
}: LogoutConfirmationProps) {
  const isAdmin = variant === 'admin'
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-lg sm:rounded-xl rounded-lg mx-4">
          <DialogHeader className="text-center pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 ${isAdmin ? 'bg-orange-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
              <LogOut className={`w-8 h-8 sm:w-10 sm:h-10 ${isAdmin ? 'text-orange-600' : 'text-red-600'}`} />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 px-4">
              {isAdmin ? 'Exit Admin Panel?' : 'Sign Out?'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base px-4 leading-relaxed">
              {userName ? (
                <>
                  Are you sure you want to sign out of your account, <strong>{userName}</strong>?
                  {isAdmin ? ' You will be redirected to the main site.' : ' You can always sign back in anytime.'}
                </>
              ) : (
                <>
                  Are you sure you want to sign out?
                  {isAdmin ? ' You will be redirected to the main site.' : ' You can always sign back in anytime.'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {isAdmin && (
            <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4 sm:mb-6 mx-4 sm:mx-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-medium text-orange-800 mb-1">
                    Admin Session Notice
                  </p>
                  <p className="text-orange-700 leading-relaxed">
                    Any unsaved changes in the admin panel will be lost. Make sure to save your work before signing out.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-300 hover:bg-gray-50 h-10 sm:h-12 text-sm sm:text-base"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-10 sm:h-12 text-sm sm:text-base ${
                isAdmin 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Signing out...</span>
                  <span className="sm:hidden">Signing out...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{isAdmin ? 'Exit Admin' : 'Sign Out'}</span>
                  <span className="sm:hidden">Sign Out</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}