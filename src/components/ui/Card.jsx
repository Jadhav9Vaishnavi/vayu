import styles from './Card.module.css'

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onClick,
  className = '',
  ...props
}) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`${styles.header} ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`${styles.content} ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`${styles.footer} ${className}`}>
      {children}
    </div>
  )
}
