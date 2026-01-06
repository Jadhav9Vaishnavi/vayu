import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button, Input } from '../components/ui'
import styles from './RegisterPage.module.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const result = await register(formData)

      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <User size={32} />
        </div>
        <h1 className={styles.title}>Complete Your Profile</h1>
        <p className={styles.subtitle}>
          Just a few more details to get started
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          icon={User}
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          autoFocus
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <div className={styles.phoneInfo}>
          <span className={styles.label}>Phone Number</span>
          <span className={styles.phone}>
            +91 {location.state?.phone || sessionStorage.getItem('pending_phone')?.replace('+91', '')}
            <Check size={16} className={styles.verified} />
          </span>
        </div>

        {errors.submit && (
          <p className={styles.submitError}>{errors.submit}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className={styles.features}>
        <h3 className={styles.featuresTitle}>What you can do with Vayu</h3>
        <ul className={styles.featuresList}>
          <li>Store health information securely</li>
          <li>Link multiple family members</li>
          <li>Quick access via RFID wristbands</li>
          <li>Control what information is visible</li>
        </ul>
      </div>
    </div>
  )
}
