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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
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
                className={`w-full transform bg-primary-forest/90 backdrop-blur-lg text-left align-middle shadow-xl transition-all
                  ${fullscreen ? 'h-screen' : 'max-w-2xl rounded-[24px] max-h-[90vh]'}`}
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex-none px-12 pt-6 pb-4 border-b border-primary-cream/10">
                    <div className="relative">
                      {title && (
                        <Dialog.Title className="text-2xl font-semibold leading-6 text-primary-cream pr-16">
                          {title}
                        </Dialog.Title>
                      )}
                      {subtitle && (
                        <Dialog.Description className="mt-2 text-sm text-primary-cream/80">
                          {subtitle}
                        </Dialog.Description>
                      )}
                      {/* Close button */}
                      <button
                        onClick={onClose}
                        className="absolute top-0 right-0 w-12 h-12 rounded-full bg-primary-coral hover:bg-primary-coral/90 flex items-center justify-center transition-colors shadow-lg"
                        aria-label="Fermer"
                      >
                        <X className="w-6 h-6 text-primary-cream" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-0 px-12 py-6 overflow-hidden">
                    {children}
                  </div>

                  {/* Footer */}
                  <div className="flex-none px-12 py-4 border-t border-primary-cream/10">
                    <button
                      onClick={onClose}
                      className="w-full rounded-full bg-primary-coral hover:bg-primary-coral/90 py-3 text-primary-cream font-semibold transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
