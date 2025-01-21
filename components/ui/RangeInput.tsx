'use client'

import { CSSProperties } from 'react'

interface RangeInputProps {
  id: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
  step?: number
  className?: string
  style?: CSSProperties
}

export function RangeInput({ 
  id,
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  minLabel,
  maxLabel,
  step = 1, 
  className = "", 
  style 
}: RangeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <style jsx>{`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            outline: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #FF6B6B;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-top: -8px;
            transition: all 0.2s ease;
          }

          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #FF6B6B;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }

          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }

          input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            background: #e2e8f0;
            border-radius: 4px;
          }

          input[type="range"]::-moz-range-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            background: #e2e8f0;
            border-radius: 4px;
          }

          @media print {
            input[type="range"] {
              height: 8px !important;
            }

            input[type="range"]::-webkit-slider-thumb {
              width: 20px !important;
              height: 20px !important;
              margin-top: -6px !important;
            }

            input[type="range"]::-moz-range-thumb {
              width: 20px !important;
              height: 20px !important;
            }
          }
        `}</style>
        <input
          type="range"
          id={id}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={className}
          style={style}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        {minLabel && <div className="max-w-[45%]">{minLabel}</div>}
        {maxLabel && <div className="max-w-[45%] text-right">{maxLabel}</div>}
      </div>
    </div>
  )
}
