import styles from './Toggle.module.css'

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = ''
}) {
  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={`${styles.toggle} ${styles[size]} ${checked ? styles.checked : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.slider} />
      </div>
    </label>
  )
}
