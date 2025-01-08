import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[24px] bg-primary-forest/90 backdrop-blur-lg p-6 pl-12 text-left align-middle shadow-xl transition-all relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary-cream/20 hover:bg-primary-cream/30 flex items-center justify-center transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-primary-cream" />
                </button>

                {/* Title */}
                <div className="mb-4 mt-8">
                  <Dialog.Title as="h3" className="text-3xl text-primary-coral font-light mb-2">
                    {title}
                  </Dialog.Title>
                  {subtitle && (
                    <p className="text-primary-cream/90 text-lg italic">{subtitle}</p>
                  )}
                </div>

                {/* Content */}
                <div className="mt-4">
                  {children}
                </div>

                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
