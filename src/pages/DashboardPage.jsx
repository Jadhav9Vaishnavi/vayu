import { useNavigate } from 'react-router-dom'
import {
  Phone, AlertTriangle, Heart, Watch, Eye,
  Plus, Users
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Badge } from '../components/ui'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { members, bands } = useFamily()

  const linkedMembers = members.filter(m => m.bandId)

  // Quick stats for each category
  const getMemberStats = () => {
    const emergencyContacts = members.reduce((acc, m) => acc + (m.emergencyContacts?.length || 0), 0)
    const allergies = members.filter(m => m.allergies).length
    const conditions = members.filter(m => m.medicalCondition).length
    const linkedBands = bands.filter(b => b.memberId).length

    return { emergencyContacts, allergies, conditions, linkedBands }
  }

  const stats = getMemberStats()

  // Main feature cards for the landing page
  const featureCards = [
    {
      id: 'emergency',
      icon: Phone,
      label: 'Emergency Contacts',
      description: 'Quick access contacts',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      stat: stats.emergencyContacts,
      statLabel: 'contacts',
      onClick: () => navigate('/family')
    },
    {
      id: 'conditions',
      icon: Heart,
      label: 'Medical Conditions',
      description: 'Health conditions',
      color: '#EC4899',
      bgColor: '#FCE7F3',
      stat: stats.conditions,
      statLabel: 'members',
      onClick: () => navigate('/family')
    },
    {
      id: 'allergies',
      icon: AlertTriangle,
      label: 'Allergies',
      description: 'Known allergies',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      stat: stats.allergies,
      statLabel: 'members',
      onClick: () => navigate('/family')
    },
    {
      id: 'bands',
      icon: Watch,
      label: 'Linked Bands',
      description: 'Connected Vayu Bands',
      color: '#10B981',
      bgColor: '#D1FAE5',
      stat: stats.linkedBands,
      statLabel: 'linked',
      onClick: () => navigate('/bands')
    },
    {
      id: 'visibility',
      icon: Eye,
      label: 'Visible on Band',
      description: 'Control what shows on scan',
      color: '#6366F1',
      bgColor: '#E0E7FF',
      stat: linkedMembers.length,
      statLabel: 'profiles',
      onClick: () => linkedMembers.length > 0 ? navigate(`/family/${linkedMembers[0].id}`) : navigate('/family')
    }
  ]

  return (
    <PageLayout>
      <div className={styles.page}>
        {/* Welcome Section */}
        <section className={styles.welcome}>
          <h1 className={styles.greeting}>
            Hello, {user?.name?.split(' ')[0]}!
          </h1>
          <p className={styles.subGreeting}>
            Your family's health profiles at a glance
          </p>
        </section>

        {/* Quick Stats Summary */}
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <Users size={16} />
            <span>{members.length} Members</span>
          </div>
          <div className={styles.summaryItem}>
            <Watch size={16} />
            <span>{bands.length} Bands</span>
          </div>
        </div>

        {/* Main Feature Grid */}
        <section className={styles.featureGrid}>
          {featureCards.map((card) => (
            <Card
              key={card.id}
              className={styles.featureCard}
              onClick={card.onClick}
            >
              <div
                className={styles.featureIcon}
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon size={32} color={card.color} />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureLabel}>{card.label}</h3>
                <p className={styles.featureDescription}>{card.description}</p>
                {card.stat > 0 && (
                  <Badge variant="default" size="sm" className={styles.featureBadge}>
                    {card.stat} {card.statLabel}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </section>

        {/* Quick Actions for empty states */}
        {members.length === 0 && (
          <Card className={styles.emptyCard} onClick={() => navigate('/family/add')}>
            <div className={styles.emptyIcon}>
              <Plus size={24} />
            </div>
            <div className={styles.emptyContent}>
              <h3>Add Your First Family Member</h3>
              <p>Get started by creating a health profile</p>
            </div>
          </Card>
        )}

        {bands.length === 0 && members.length > 0 && (
          <Card className={styles.emptyCard} onClick={() => navigate('/bands/register')}>
            <div className={styles.emptyIcon}>
              <Watch size={24} />
            </div>
            <div className={styles.emptyContent}>
              <h3>Register Your Vayu Band</h3>
              <p>Link a band to enable profile scanning</p>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
