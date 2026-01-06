import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button, Input, OTPInput } from '../components/ui'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { sendOtp, verifyOtp } = useAuth()

  const [step, setStep] = useState('phone') // phone, otp
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const validatePhone = (number) => {
    // Indian phone number validation
    return /^[6-9]\d{9}$/.test(number)
  }

  const handleSendOtp = async () => {
    setError('')

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)

    try {
      const result = await sendOtp(`+91${phone}`)

      if (result.success) {
        setStep('otp')
        startCountdown()
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      const result = await verifyOtp(otp)

      if (result.success) {
        if (result.isNewUser) {
          navigate('/register', { state: { phone: result.phone } })
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(result.error || 'Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(30)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    await handleSendOtp()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img src="/vayu-logo.svg" alt="Vayu" className={styles.logo} />
        <h1 className={styles.title}>Welcome to Vayu</h1>
        <p className={styles.subtitle}>
          Secure your family's health information with smart RFID wristbands
        </p>
      </div>

      <div className={styles.form}>
        {step === 'phone' && (
          <>
            <Input
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              icon={Phone}
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                setPhone(val)
                setError('')
              }}
              error={error}
              helperText="We'll send you a verification code"
            />

            <div className={styles.countryCode}>
              <span className={styles.flag}>IN</span>
              <span>+91</span>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSendOtp}
              loading={loading}
              disabled={phone.length !== 10}
              icon={ArrowRight}
              iconPosition="right"
            >
              Get OTP
            </Button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className={styles.otpHeader}>
              <h2 className={styles.otpTitle}>Verify OTP</h2>
              <p className={styles.otpSubtitle}>
                Enter the 6-digit code sent to
                <br />
                <strong>+91 {phone}</strong>
              </p>
            </div>

            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              error={error}
            />

            <Button
              fullWidth
              size="lg"
              onClick={handleVerifyOtp}
              loading={loading}
              disabled={otp.length !== 6}
            >
              Verify & Continue
            </Button>

            <div className={styles.resend}>
              {countdown > 0 ? (
                <span className={styles.countdown}>
                  Resend OTP in {countdown}s
                </span>
              ) : (
                <button
                  className={styles.resendButton}
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              className={styles.changeNumber}
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
              }}
            >
              Change mobile number
            </button>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.terms}>
          By continuing, you agree to our{' '}
          <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>
        </p>
        <p className={styles.company}>
          Vayu Tech Innovations Private Limited
        </p>
      </div>
    </div>
  )
}
