import { Loader2 } from 'lucide-react'
import styles from './Button.module.css'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className={styles.spinner} size={size === 'sm' ? 16 : 20} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={styles.icon} size={size === 'sm' ? 16 : 20} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={styles.icon} size={size === 'sm' ? 16 : 20} />}
        </>
      )}
    </button>
  )
}
