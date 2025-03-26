import { Dialog } from '@headlessui/react'
import { Fragment } from 'react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  emailTitle: string
  emailContent: string
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  emailTitle,
  emailContent,
}) => {
  console.log('EmailModal props:', {
    isOpen,
    onClose,
    emailTitle,
    emailContent,
  })

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            {emailTitle}
          </Dialog.Title>

          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
