'use client'

import { CSSProperties } from 'react'

interface RangeInputProps {
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  className?: string
  style?: CSSProperties
}

export function RangeInput({ value, onChange, min = "1", max = "10", className = "", style }: RangeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative py-4">
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          margin: 8px 0;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #FF5E5B;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #FF5E5B;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #FF4542;
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #FF4542;
        }

        input[type="range"]:active::-webkit-slider-thumb {
          background: #FF4542;
          transform: scale(1.1);
        }

        input[type="range"]:active::-moz-range-thumb {
          background: #FF4542;
          transform: scale(1.1);
        }
      `}</style>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className={className}
        style={style}
      />
    </div>
  )
}
