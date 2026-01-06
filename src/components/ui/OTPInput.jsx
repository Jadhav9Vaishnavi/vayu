import { useRef, useState } from 'react'
import styles from './OTPInput.module.css'

export function OTPInput({ length = 6, value, onChange, error }) {
  const [otp, setOtp] = useState(value ? value.split('') : Array(length).fill(''))
  const inputRefs = useRef([])

  const handleChange = (index, e) => {
    const val = e.target.value

    // Only allow digits
    if (val && !/^\d+$/.test(val)) return

    const newOtp = [...otp]

    // Handle paste
    if (val.length > 1) {
      const pastedChars = val.slice(0, length - index).split('')
      pastedChars.forEach((char, i) => {
        if (index + i < length) {
          newOtp[index + i] = char
        }
      })
      setOtp(newOtp)
      onChange(newOtp.join(''))

      const nextIndex = Math.min(index + pastedChars.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    newOtp[index] = val
    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Move to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="tel"
            inputMode="numeric"
            maxLength={length}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={handleFocus}
            className={`${styles.input} ${error ? styles.error : ''} ${digit ? styles.filled : ''}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
