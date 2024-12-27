'use client'

import { FaPrint } from 'react-icons/fa'

interface PrintButtonProps {
  className?: string
}

export function PrintButton({ className = '' }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors print:hidden ${className}`}
    >
      <FaPrint />
      <span>Imprimer</span>
    </button>
  )
}
