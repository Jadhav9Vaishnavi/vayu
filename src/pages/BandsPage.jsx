import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Watch, Plus, User, Link, AlertCircle } from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Button, Badge, Modal } from '../components/ui'
import styles from './BandsPage.module.css'

export function BandsPage() {
  const navigate = useNavigate()
  const { bands, members, linkBandToMember, unlinkBandFromMember, getActiveMemberSlots } = useFamily()

  const [selectedBand, setSelectedBand] = useState(null)
  const [showLinkModal, setShowLinkModal] = useState(false)

  const slots = getActiveMemberSlots()
  const unlinkedMembers = members.filter(m => !m.bandId)

  const getMemberForBand = (bandId) => {
    const band = bands.find(b => b.id === bandId)
    if (!band || !band.memberId) return null
    return members.find(m => m.id === band.memberId)
  }

  const handleLinkBand = (memberId) => {
    if (selectedBand) {
      linkBandToMember(selectedBand.id, memberId)
      setShowLinkModal(false)
      setSelectedBand(null)
    }
  }

  const handleUnlink = (bandId) => {
    unlinkBandFromMember(bandId)
  }

  const openLinkModal = (band) => {
    setSelectedBand(band)
    setShowLinkModal(true)
  }

  return (
    <PageLayout title="Vayu Bands">
      <div className={styles.page}>
        {/* Status Card */}
        <Card className={styles.statusCard}>
          <div className={styles.statusInfo}>
            <Watch size={32} className={styles.statusIcon} />
            <div>
              <h3 className={styles.statusTitle}>{bands.length} Band{bands.length !== 1 ? 's' : ''} Registered</h3>
              <p className={styles.statusSubtitle}>
                {bands.filter(b => b.memberId).length} linked, {bands.filter(b => !b.memberId).length} unlinked
              </p>
            </div>
          </div>
        </Card>

        {/* Subscription Warning */}
        {slots.total === 0 && bands.length > 0 && (
          <Card className={styles.warningCard} variant="outlined">
            <AlertCircle size={20} className={styles.warningIcon} />
            <div>
              <p className={styles.warningTitle}>No Active Subscription</p>
              <p className={styles.warningText}>
                Purchase a plan to link bands with family members
              </p>
            </div>
            <Button size="sm" onClick={() => navigate('/subscription')}>
              View Plans
            </Button>
          </Card>
        )}

        {/* Bands List */}
        {bands.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Watch size={48} />
            </div>
            <h2 className={styles.emptyTitle}>No Bands Registered</h2>
            <p className={styles.emptyText}>
              Register your Vayu Band to link it with a family member's health profile
            </p>
            <Button
              icon={Plus}
              onClick={() => navigate('/bands/register')}
            >
              Register Band
            </Button>
          </div>
        ) : (
          <div className={styles.bandList}>
            {bands.map(band => {
              const member = getMemberForBand(band.id)
              return (
                <Card key={band.id} className={styles.bandCard}>
                  <div className={styles.bandHeader}>
                    <div className={styles.bandIconWrapper}>
                      <Watch size={24} />
                    </div>
                    <div className={styles.bandInfo}>
                      <h3 className={styles.bandSerial}>{band.bs}</h3>
                      <p className={styles.bandId}>ID: {band.bui}</p>
                    </div>
                    <Badge variant={member ? 'success' : 'default'} size="sm">
                      {member ? 'Linked' : 'Unlinked'}
                    </Badge>
                  </div>

                  {member ? (
                    <div className={styles.linkedMember}>
                      <div className={styles.memberAvatar}>
                        {member.fullName.charAt(0)}
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.fullName}</span>
                        <span className={styles.memberRelation}>{member.relationship}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnlink(band.id)}
                      >
                        Unlink
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.unlinkedActions}>
                      <p className={styles.unlinkedText}>
                        <User size={16} />
                        Not linked to any member
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Link}
                        onClick={() => openLinkModal(band)}
                        disabled={slots.available === 0 || unlinkedMembers.length === 0}
                      >
                        Link Member
                      </Button>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {/* Register Button */}
        {bands.length > 0 && (
          <Button
            fullWidth
            icon={Plus}
            onClick={() => navigate('/bands/register')}
          >
            Register New Band
          </Button>
        )}

        {/* Link Modal */}
        <Modal
          isOpen={showLinkModal}
          onClose={() => {
            setShowLinkModal(false)
            setSelectedBand(null)
          }}
          title="Link Band to Member"
        >
          <div className={styles.modalContent}>
            {selectedBand && (
              <div className={styles.selectedBand}>
                <Watch size={20} />
                <span>Band Serial: <strong>{selectedBand.bs}</strong></span>
              </div>
            )}

            {unlinkedMembers.length === 0 ? (
              <div className={styles.noMembers}>
                <User size={40} className={styles.noMembersIcon} />
                <p>No unlinked family members available</p>
                <Button onClick={() => {
                  setShowLinkModal(false)
                  navigate('/family/add')
                }}>
                  Add Family Member
                </Button>
              </div>
            ) : (
              <>
                <p className={styles.selectText}>Select a family member to link:</p>
                <div className={styles.memberList}>
                  {unlinkedMembers.map(member => (
                    <Card
                      key={member.id}
                      className={styles.memberOption}
                      onClick={() => handleLinkBand(member.id)}
                    >
                      <div className={styles.memberAvatar}>
                        {member.fullName.charAt(0)}
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.fullName}</span>
                        <span className={styles.memberRelation}>{member.relationship}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </PageLayout>
  )
}
