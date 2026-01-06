import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  User, Calendar, Droplets, AlertTriangle, Heart,
  MapPin, Phone, Shield, ExternalLink, MessageSquare,
  Star, Send, UserPlus, X
} from 'lucide-react'
import { getPublicProfileByBUI } from '../context/FamilyContext'
import { Card, Badge, Button, TextArea } from '../components/ui'
import styles from './PublicProfilePage.module.css'

const BLOOD_GROUP_VARIANTS = {
  'A+': 'blood-a', 'A-': 'blood-a',
  'B+': 'blood-b', 'B-': 'blood-b',
  'AB+': 'blood-ab', 'AB-': 'blood-ab',
  'O+': 'blood-o', 'O-': 'blood-o'
}

// Store feedback in localStorage
const saveFeedback = (feedback) => {
  const existing = JSON.parse(localStorage.getItem('vayu_feedback') || '[]')
  existing.push({
    ...feedback,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('vayu_feedback', JSON.stringify(existing))
}

export function PublicProfilePage() {
  const { bui } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const data = getPublicProfileByBUI(bui)
      if (data && Object.keys(data).length > 0) {
        setProfile(data)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [bui])

  const handleSubmitFeedback = () => {
    if (feedbackRating === 0) return

    saveFeedback({
      bandId: bui,
      rating: feedbackRating,
      comment: feedbackText,
      type: 'scan_feedback',
      isRegistered: false
    })

    setFeedbackSubmitted(true)
    setTimeout(() => {
      setShowFeedback(false)
      setFeedbackSubmitted(false)
      setFeedbackRating(0)
      setFeedbackText('')
    }, 2000)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>
            <User size={48} />
          </div>
          <h1>Profile Not Found</h1>
          <p>This Vayu Band is not linked to any profile or the profile has been removed.</p>

          {/* Registration CTA for unregistered users */}
          <Card className={styles.registerCard}>
            <UserPlus size={24} className={styles.registerIcon} />
            <div>
              <h3>Want your own Vayu Band?</h3>
              <p>Create health profiles for your family and link them to Vayu Bands for emergency access.</p>
            </div>
            <Link to="/register" className={styles.registerButton}>
              Get Started
            </Link>
          </Card>

          {/* Feedback for unregistered users */}
          <button
            className={styles.feedbackTrigger}
            onClick={() => setShowFeedback(true)}
          >
            <MessageSquare size={16} />
            Share Feedback
          </button>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <FeedbackModal
            rating={feedbackRating}
            setRating={setFeedbackRating}
            text={feedbackText}
            setText={setFeedbackText}
            submitted={feedbackSubmitted}
            onSubmit={handleSubmitFeedback}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/vayu-logo.svg" alt="Vayu" />
          <span>Vayu</span>
        </div>
        <Badge variant="success" size="sm">
          <Shield size={12} />
          Verified Profile
        </Badge>
      </header>

      {/* Profile Content */}
      <main className={styles.content}>
        {/* Profile Header */}
        {profile.fullName && (
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {profile.fullName.charAt(0)}
            </div>
            <h1 className={styles.name}>{profile.fullName}</h1>
            {profile.relationship && (
              <p className={styles.relationship}>{profile.relationship}</p>
            )}
          </div>
        )}

        {/* Quick Info */}
        <div className={styles.quickInfo}>
          {profile.age && (
            <div className={styles.infoChip}>
              <Calendar size={16} />
              <span>{profile.age} years</span>
            </div>
          )}
          {profile.bloodGroup && (
            <Badge variant={BLOOD_GROUP_VARIANTS[profile.bloodGroup]} size="lg">
              <Droplets size={14} />
              {profile.bloodGroup}
            </Badge>
          )}
        </div>

        {/* Medical Alerts */}
        {(profile.allergies || profile.medicalCondition) && (
          <Card className={styles.alertCard}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={18} />
              Medical Information
            </h2>
            {profile.allergies && (
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>Allergies:</span>
                <span className={styles.alertValue}>{profile.allergies}</span>
              </div>
            )}
            {profile.medicalCondition && (
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>Conditions:</span>
                <span className={styles.alertValue}>{profile.medicalCondition}</span>
              </div>
            )}
          </Card>
        )}

        {/* Emergency Contacts */}
        {profile.emergencyContacts && profile.emergencyContacts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Phone size={18} />
              Emergency Contacts
            </h2>
            <div className={styles.contactList}>
              {profile.emergencyContacts.map((contact, index) => (
                <Card key={index} className={styles.contactCard}>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactName}>{contact.name}</span>
                    {contact.relation && (
                      <span className={styles.contactRelation}>{contact.relation}</span>
                    )}
                  </div>
                  <a
                    href={`tel:+91${contact.phone}`}
                    className={styles.callButton}
                  >
                    <Phone size={18} />
                    Call
                  </a>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Address */}
        {profile.homeAddress && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={18} />
              Home Address
            </h2>
            <Card className={styles.addressCard}>
              <p>{profile.homeAddress}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(profile.homeAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                <ExternalLink size={14} />
                Open in Maps
              </a>
            </Card>
          </section>
        )}

        {/* Feedback Section */}
        <section className={styles.feedbackSection}>
          <Card className={styles.feedbackCard}>
            <MessageSquare size={20} />
            <div className={styles.feedbackContent}>
              <h3>Was this helpful?</h3>
              <p>Let us know your experience scanning this profile</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowFeedback(true)}
            >
              Give Feedback
            </Button>
          </Card>
        </section>

        {/* Registration CTA */}
        <Card className={styles.registerCard}>
          <UserPlus size={24} className={styles.registerIcon} />
          <div>
            <h3>Want your own Vayu Band?</h3>
            <p>Create health profiles for your family</p>
          </div>
          <Link to="/register" className={styles.registerButton}>
            Get Started
          </Link>
        </Card>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <img src="/vayu-logo.svg" alt="Vayu" className={styles.footerLogo} />
          <div>
            <span className={styles.footerTitle}>Powered by Vayu</span>
            <span className={styles.footerSubtitle}>Family Health Profiles</span>
          </div>
        </div>
        <p className={styles.footerCompany}>
          Vayu Tech Innovations Private Limited
        </p>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          rating={feedbackRating}
          setRating={setFeedbackRating}
          text={feedbackText}
          setText={setFeedbackText}
          submitted={feedbackSubmitted}
          onSubmit={handleSubmitFeedback}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  )
}

// Feedback Modal Component
function FeedbackModal({ rating, setRating, text, setText, submitted, onSubmit, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div className={styles.feedbackSuccess}>
            <div className={styles.successIcon}>
              <Send size={32} />
            </div>
            <h3>Thank you!</h3>
            <p>Your feedback helps us improve</p>
          </div>
        ) : (
          <>
            <h3 className={styles.modalTitle}>Share Your Feedback</h3>
            <p className={styles.modalSubtitle}>How was your experience?</p>

            <div className={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
                  onClick={() => setRating(star)}
                >
                  <Star size={32} fill={star <= rating ? '#F59E0B' : 'none'} />
                </button>
              ))}
            </div>

            <TextArea
              placeholder="Tell us more about your experience (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />

            <Button
              fullWidth
              onClick={onSubmit}
              disabled={rating === 0}
            >
              <Send size={18} />
              Submit Feedback
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
