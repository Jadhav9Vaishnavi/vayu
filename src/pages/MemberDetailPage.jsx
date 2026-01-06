import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  User, Calendar, Droplets, AlertTriangle, Heart, MapPin,
  Phone, Shield, Watch, Edit, Trash2, Eye, EyeOff, Link, Unlink, ExternalLink
} from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Button, Badge, Toggle, Modal } from '../components/ui'
import styles from './MemberDetailPage.module.css'

const PRIVACY_FIELDS = [
  { key: 'fullName', label: 'Full Name', icon: User },
  { key: 'age', label: 'Age', icon: Calendar },
  { key: 'bloodGroup', label: 'Blood Group', icon: Droplets },
  { key: 'allergies', label: 'Allergies', icon: AlertTriangle },
  { key: 'medicalCondition', label: 'Medical Condition', icon: Heart },
  { key: 'homeAddress', label: 'Home Address', icon: MapPin },
  { key: 'emergencyContacts', label: 'Emergency Contacts', icon: Phone },
  { key: 'relationship', label: 'Relationship', icon: User }
]

const BLOOD_GROUP_VARIANTS = {
  'A+': 'blood-a', 'A-': 'blood-a',
  'B+': 'blood-b', 'B-': 'blood-b',
  'AB+': 'blood-ab', 'AB-': 'blood-ab',
  'O+': 'blood-o', 'O-': 'blood-o'
}

export function MemberDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { members, bands, updatePrivacySettings, deleteMember, linkBandToMember, unlinkBandFromMember } = useFamily()

  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showLinkBand, setShowLinkBand] = useState(false)

  const member = members.find(m => m.id === id)
  const linkedBand = bands.find(b => b.memberId === id)
  const availableBands = bands.filter(b => !b.memberId)

  if (!member) {
    return (
      <PageLayout title="Member Not Found" showBack>
        <div className={styles.notFound}>
          <p>This family member could not be found.</p>
          <Button onClick={() => navigate('/family')}>Go Back</Button>
        </div>
      </PageLayout>
    )
  }

  const handlePrivacyChange = (field, value) => {
    updatePrivacySettings(id, { [field]: value })
  }

  const handleDelete = () => {
    deleteMember(id)
    navigate('/family')
  }

  const handleLinkBand = (bandId) => {
    linkBandToMember(bandId, id)
    setShowLinkBand(false)
  }

  const handleUnlinkBand = () => {
    if (linkedBand) {
      unlinkBandFromMember(linkedBand.id)
    }
  }

  return (
    <PageLayout title="Member Details" showBack showNav={false}>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {member.fullName.charAt(0)}
          </div>
          <h1 className={styles.name}>{member.fullName}</h1>
          <p className={styles.relationship}>{member.relationship}</p>

          <div className={styles.badges}>
            <Badge variant={BLOOD_GROUP_VARIANTS[member.bloodGroup]} size="lg">
              {member.bloodGroup}
            </Badge>
            {linkedBand ? (
              <Badge variant="success" size="lg">
                <Watch size={14} />
                Protected
              </Badge>
            ) : (
              <Badge variant="default" size="lg">
                No Band
              </Badge>
            )}
          </div>
        </div>

        {/* Band Status */}
        <Card className={styles.bandCard}>
          <div className={styles.bandInfo}>
            <Watch size={24} className={styles.bandIcon} />
            <div>
              <h3 className={styles.bandTitle}>
                {linkedBand ? 'Vayu Band Linked' : 'No Band Linked'}
              </h3>
              {linkedBand ? (
                <p className={styles.bandSerial}>Serial: {linkedBand.bs}</p>
              ) : (
                <p className={styles.bandText}>Link a band to enable profile access</p>
              )}
            </div>
          </div>
          {linkedBand ? (
            <Button variant="secondary" size="sm" icon={Unlink} onClick={handleUnlinkBand}>
              Unlink
            </Button>
          ) : (
            <Button
              size="sm"
              icon={Link}
              onClick={() => setShowLinkBand(true)}
              disabled={availableBands.length === 0}
            >
              Link Band
            </Button>
          )}
        </Card>

        {/* Preview Public Profile */}
        {linkedBand && (
          <Button
            variant="secondary"
            fullWidth
            icon={ExternalLink}
            onClick={() => window.open(`/profile/${linkedBand.bui}`, '_blank')}
          >
            Preview Public Profile
          </Button>
        )}

        {/* Info Sections */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <Card padding="none">
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Calendar size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Age</span>
                <span className={styles.infoValue}>{member.age} years</span>
              </div>
              <div className={styles.infoItem}>
                <Droplets size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Blood Group</span>
                <span className={styles.infoValue}>{member.bloodGroup}</span>
              </div>
            </div>
          </Card>
        </section>

        {(member.allergies || member.medicalCondition) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Medical Information</h2>
            <Card padding="none">
              <div className={styles.infoList}>
                {member.allergies && (
                  <div className={styles.infoItem}>
                    <AlertTriangle size={18} className={`${styles.infoIcon} ${styles.warning}`} />
                    <span className={styles.infoLabel}>Allergies</span>
                    <span className={styles.infoValue}>{member.allergies}</span>
                  </div>
                )}
                {member.medicalCondition && (
                  <div className={styles.infoItem}>
                    <Heart size={18} className={`${styles.infoIcon} ${styles.error}`} />
                    <span className={styles.infoLabel}>Conditions</span>
                    <span className={styles.infoValue}>{member.medicalCondition}</span>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Address</h2>
          <Card>
            <div className={styles.address}>
              <MapPin size={18} className={styles.infoIcon} />
              <p>{member.homeAddress}</p>
            </div>
          </Card>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Emergency Contacts</h2>
          <div className={styles.contactList}>
            {member.emergencyContacts.map((contact, index) => (
              <Card key={index} className={styles.contactCard}>
                <div className={styles.contactInfo}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactRelation}>{contact.relation}</span>
                </div>
                <a href={`tel:+91${contact.phone}`} className={styles.contactPhone}>
                  <Phone size={16} />
                  +91 {contact.phone}
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy Controls */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Privacy Controls</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={showPrivacy ? EyeOff : Eye}
              onClick={() => setShowPrivacy(!showPrivacy)}
            >
              {showPrivacy ? 'Hide' : 'Manage'}
            </Button>
          </div>

          {showPrivacy && (
            <Card className={styles.privacyCard}>
              <p className={styles.privacyInfo}>
                <Shield size={16} />
                Control which information is visible when someone scans the Vayu Band
              </p>
              <div className={styles.privacyList}>
                {PRIVACY_FIELDS.map(({ key, label, icon: Icon }) => (
                  <Toggle
                    key={key}
                    label={
                      <span className={styles.privacyLabel}>
                        <Icon size={16} />
                        {label}
                      </span>
                    }
                    checked={member.privacySettings[key]}
                    onChange={(checked) => handlePrivacyChange(key, checked)}
                  />
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            icon={Edit}
            onClick={() => navigate(`/family/${id}/edit`)}
          >
            Edit Details
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>

        {/* Link Band Modal */}
        <Modal
          isOpen={showLinkBand}
          onClose={() => setShowLinkBand(false)}
          title="Link Vayu Band"
        >
          <div className={styles.modalContent}>
            {availableBands.length === 0 ? (
              <div className={styles.noBands}>
                <Watch size={40} className={styles.noBandsIcon} />
                <p>No available bands to link</p>
                <Button onClick={() => navigate('/bands/register')}>
                  Register New Band
                </Button>
              </div>
            ) : (
              <>
                <p className={styles.modalText}>Select a band to link with {member.fullName}</p>
                <div className={styles.bandList}>
                  {availableBands.map(band => (
                    <Card
                      key={band.id}
                      className={styles.bandOption}
                      onClick={() => handleLinkBand(band.id)}
                    >
                      <Watch size={24} />
                      <div>
                        <p className={styles.bandOptionSerial}>{band.bs}</p>
                        <p className={styles.bandOptionId}>ID: {band.bui}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          title="Delete Member"
          size="sm"
        >
          <div className={styles.modalContent}>
            <p className={styles.deleteText}>
              Are you sure you want to delete <strong>{member.fullName}</strong>? This action cannot be undone.
            </p>
            <div className={styles.deleteActions}>
              <Button variant="ghost" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  )
}
