import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './Input.module.css'

export const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  fullWidth = true,
  className = '',
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        {Icon && <Icon className={styles.icon} size={20} />}
        <input
          ref={ref}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={styles.input}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
})

export const TextArea = forwardRef(function TextArea({
  label,
  error,
  helperText,
  fullWidth = true,
  rows = 3,
  className = '',
  ...props
}, ref) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        <textarea
          ref={ref}
          className={`${styles.input} ${styles.textarea}`}
          rows={rows}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
})

export const Select = forwardRef(function Select({
  label,
  error,
  helperText,
  options = [],
  placeholder,
  fullWidth = true,
  className = '',
  ...props
}, ref) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        <select ref={ref} className={`${styles.input} ${styles.select}`} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {(error || helperText) && (
        <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
})
