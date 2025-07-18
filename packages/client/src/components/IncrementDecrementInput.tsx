import React from 'react'

interface IncrementDecrementInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  suffix?: string
  disabled?: boolean
  className?: string
}

const IncrementDecrementInput: React.FC<IncrementDecrementInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  label,
  suffix,
  disabled = false,
  className = ''
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min
    const clampedValue = Math.max(min, Math.min(max, newValue))
    onChange(clampedValue)
  }

  return (
    <div className={`increment-decrement-input ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-controls">
        <button
          type="button"
          className="decrement-btn"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label="Decrease value"
        >
          <span className="btn-icon">−</span>
        </button>
        
        <div className="value-display">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="value-input"
            aria-label={label}
          />
          {suffix && <span className="value-suffix">{suffix}</span>}
        </div>
        
        <button
          type="button"
          className="increment-btn"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label="Increase value"
        >
          <span className="btn-icon">+</span>
        </button>
      </div>
    </div>
  )
}

export default IncrementDecrementInput
