import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Watch, QrCode, Check, AlertCircle } from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Button, Input } from '../components/ui'
import styles from './RegisterBandPage.module.css'

// Initialize master bands database for demo
const initMasterBands = () => {
  const existing = localStorage.getItem('vayu_master_bands')
  if (!existing) {
    const masterBands = [
      { bs: 'VB001234', bui: 'BUI-A1B2C3D4' },
      { bs: 'VB001235', bui: 'BUI-E5F6G7H8' },
      { bs: 'VB001236', bui: 'BUI-I9J0K1L2' },
      { bs: 'VB001237', bui: 'BUI-M3N4O5P6' },
      { bs: 'VB001238', bui: 'BUI-Q7R8S9T0' },
      { bs: 'VB001239', bui: 'BUI-U1V2W3X4' },
      { bs: 'VB001240', bui: 'BUI-Y5Z6A7B8' },
      { bs: 'VB001241', bui: 'BUI-C9D0E1F2' },
      { bs: 'VB001242', bui: 'BUI-G3H4I5J6' },
      { bs: 'VB001243', bui: 'BUI-K7L8M9N0' }
    ]
    localStorage.setItem('vayu_master_bands', JSON.stringify(masterBands))
  }
}

export function RegisterBandPage() {
  const navigate = useNavigate()
  const { registerBand } = useFamily()

  const [step, setStep] = useState('serial') // serial, verify, success
  const [bandSerial, setBandSerial] = useState('')
  const [bandUniqueId, setBandUniqueId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registeredBand, setRegisteredBand] = useState(null)

  useEffect(() => {
    initMasterBands()
  }, [])

  const handleSerialSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!bandSerial.trim()) {
      setError('Please enter the band serial number')
      return
    }

    if (bandSerial.length < 6) {
      setError('Serial number must be at least 6 characters')
      return
    }

    setStep('verify')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!bandUniqueId.trim()) {
      setError('Please enter the Band Unique Identifier')
      return
    }

    setLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const result = registerBand(bandSerial.toUpperCase(), bandUniqueId.toUpperCase())

    if (result.success) {
      setRegisteredBand(result.band)
      setStep('success')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleScanNFC = () => {
    // Simulate NFC scan - in real implementation, this would use Web NFC API
    alert('NFC scanning is not available in this demo. Please enter the details manually.')
  }

  return (
    <PageLayout title="Register Band" showBack showNav={false}>
      <div className={styles.page}>
        {step === 'serial' && (
          <>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Watch size={40} />
              </div>
              <h2 className={styles.title}>Register Your Vayu Band</h2>
              <p className={styles.subtitle}>
                Enter the serial number printed on your Vayu Band to begin registration
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSerialSubmit}>
              <Input
                label="Band Serial Number (BS)"
                placeholder="e.g., VB001234"
                value={bandSerial}
                onChange={(e) => {
                  setBandSerial(e.target.value.toUpperCase())
                  setError('')
                }}
                error={error}
                helperText="6-8 character alphanumeric code on the band"
                autoFocus
              />

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                icon={QrCode}
                onClick={handleScanNFC}
              >
                Scan Band with NFC
              </Button>

              <Button type="submit" fullWidth size="lg">
                Continue
              </Button>
            </form>

            <Card variant="flat" className={styles.helpCard}>
              <h4>Where to find the Serial Number?</h4>
              <p>The serial number (BS) is printed on the inner side of your Vayu Band or on the packaging.</p>
            </Card>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Watch size={40} />
              </div>
              <h2 className={styles.title}>Verify Your Band</h2>
              <p className={styles.subtitle}>
                Now enter the Band Unique Identifier (BUI) to complete verification
              </p>
            </div>

            <Card className={styles.serialCard}>
              <span className={styles.serialLabel}>Serial Number</span>
              <span className={styles.serialValue}>{bandSerial}</span>
            </Card>

            <form className={styles.form} onSubmit={handleRegister}>
              <Input
                label="Band Unique Identifier (BUI)"
                placeholder="e.g., BUI-A1B2C3D4"
                value={bandUniqueId}
                onChange={(e) => {
                  setBandUniqueId(e.target.value.toUpperCase())
                  setError('')
                }}
                error={error}
                helperText="Scan the RFID tag or find it on the certificate"
                autoFocus
              />

              {error && (
                <Card variant="flat" className={styles.errorCard}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </Card>
              )}

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Register Band
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => {
                  setStep('serial')
                  setBandUniqueId('')
                  setError('')
                }}
              >
                Change Serial Number
              </Button>
            </form>

            <Card variant="flat" className={styles.helpCard}>
              <h4>Demo Band Details</h4>
              <p>For testing, use these combinations:</p>
              <ul>
                <li>BS: VB001234, BUI: BUI-A1B2C3D4</li>
                <li>BS: VB001235, BUI: BUI-E5F6G7H8</li>
              </ul>
            </Card>
          </>
        )}

        {step === 'success' && (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <Check size={48} />
            </div>
            <h2 className={styles.successTitle}>Band Registered!</h2>
            <p className={styles.successText}>
              Your Vayu Band has been successfully registered to your account
            </p>

            {registeredBand && (
              <Card className={styles.successCard}>
                <div className={styles.successDetail}>
                  <span className={styles.detailLabel}>Serial Number</span>
                  <span className={styles.detailValue}>{registeredBand.bs}</span>
                </div>
                <div className={styles.successDetail}>
                  <span className={styles.detailLabel}>Unique ID</span>
                  <span className={styles.detailValue}>{registeredBand.bui}</span>
                </div>
              </Card>
            )}

            <div className={styles.successActions}>
              <Button fullWidth onClick={() => navigate('/bands')}>
                View All Bands
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setStep('serial')
                  setBandSerial('')
                  setBandUniqueId('')
                  setRegisteredBand(null)
                }}
              >
                Register Another Band
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
