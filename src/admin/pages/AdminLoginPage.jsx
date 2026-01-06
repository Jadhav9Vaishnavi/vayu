import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Watch, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import styles from './AdminLoginPage.module.css'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAdminAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = await login(email, password)

    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Watch size={40} />
          </div>
          <h1 className={styles.title}>Vayu Admin</h1>
          <p className={styles.subtitle}>Sign in to manage your platform</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                placeholder="admin@vayutechin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.hint}>
            Demo credentials: admin@vayutechin.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
