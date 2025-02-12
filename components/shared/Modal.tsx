import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  fullscreen?: boolean
}

export function Modal({ isOpen, onClose, title, subtitle, children, fullscreen }: ModalProps) {
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
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={`w-full transform overflow-hidden bg-primary-forest/90 backdrop-blur-lg text-left align-middle shadow-xl transition-all relative
                  ${fullscreen ? 'h-screen' : 'max-w-2xl rounded-[24px] p-6 pl-12'}`}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-[20px] mr-5 w-12 h-12 rounded-full bg-primary-coral hover:bg-primary-coral/90 flex items-center justify-center transition-colors z-50 shadow-lg"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6 text-primary-cream" />
                </button>

                {/* Title */}
                {title && (
                  <div className="mb-4 mt-8">
                    <Dialog.Title as="h3" className="text-3xl text-primary-coral font-light mb-2">
                      {title}
                    </Dialog.Title>
                    {subtitle && (
                      <p className="text-primary-cream/90 text-lg italic">{subtitle}</p>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className={`${!title ? 'mt-0' : 'mt-4'}`}>
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
