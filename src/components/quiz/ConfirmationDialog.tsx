/**
 * ConfirmationDialog component for quiz actions
 */

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, LogOut, Clock, CheckCircle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'exit' | 'earlyFinish' | 'finish'
  answeredCount?: number
  totalQuestions?: number
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  type,
  answeredCount = 0,
  totalQuestions = 0
}: ConfirmationDialogProps) {
  const unansweredCount = totalQuestions - answeredCount

  const getDialogConfig = () => {
    switch (type) {
      case 'exit':
        return {
          icon: <LogOut className="w-6 h-6 text-red-600" />,
          title: 'Exit Quiz',
          description: answeredCount > 0 
            ? `You have answered ${answeredCount} out of ${totalQuestions} questions. All your progress will be lost and cannot be recovered.`
            : 'You haven\'t answered any questions yet. Are you sure you want to exit?',
          confirmText: 'Exit Quiz',
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
          cancelText: 'Continue Quiz'
        }
      
      case 'earlyFinish':
        return {
          icon: <Clock className="w-6 h-6 text-orange-600" />,
          title: 'Submit Quiz Early',
          description: `You are about to submit your quiz with ${answeredCount} questions answered and ${unansweredCount} questions remaining.`,
          confirmText: 'Submit Early',
          confirmClass: 'bg-orange-600 hover:bg-orange-700 text-white',
          cancelText: 'Continue Quiz'
        }
      
      case 'finish':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: unansweredCount > 0 ? 'Submit Quiz' : 'Submit Complete Quiz',
          description: unansweredCount > 0 
            ? `You have ${unansweredCount} unanswered questions. These will be marked as incorrect.`
            : 'Congratulations! You have answered all questions. Ready to submit your quiz?',
          confirmText: 'Submit Quiz',
          confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
          cancelText: 'Review Quiz'
        }
      
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-gray-600" />,
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          confirmText: 'Confirm',
          confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
          cancelText: 'Cancel'
        }
    }
  }

  const config = getDialogConfig()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {config.icon}
            <DialogTitle className="text-xl font-semibold">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {config.description}
          </DialogDescription>
          
          {/* Progress Summary for early finish and finish */}
          {(type === 'earlyFinish' || type === 'finish') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📊 Quiz Summary:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Answered Questions:</span>
                  <span className="font-medium text-green-600">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Questions:</span>
                  <span className="font-medium text-orange-600">{unansweredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
              </div>
              
              {unansweredCount > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Unanswered questions will be marked as incorrect and cannot be changed after submission.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="flex-1 hover:bg-gray-50"
          >
            {config.cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 ${config.confirmClass}`}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}