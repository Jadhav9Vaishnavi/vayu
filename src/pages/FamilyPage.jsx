import { useNavigate } from 'react-router-dom'
import { Plus, Users, Watch, Shield, ChevronRight } from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Button, Badge } from '../components/ui'
import styles from './FamilyPage.module.css'

const BLOOD_GROUP_VARIANTS = {
  'A+': 'blood-a', 'A-': 'blood-a',
  'B+': 'blood-b', 'B-': 'blood-b',
  'AB+': 'blood-ab', 'AB-': 'blood-ab',
  'O+': 'blood-o', 'O-': 'blood-o'
}

export function FamilyPage() {
  const navigate = useNavigate()
  const { members, bands } = useFamily()

  const getMemberBand = (memberId) => {
    return bands.find(b => b.memberId === memberId)
  }

  return (
    <PageLayout title="Family Members">
      <div className={styles.page}>
        {members.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Users size={48} />
            </div>
            <h2 className={styles.emptyTitle}>No Family Members Yet</h2>
            <p className={styles.emptyText}>
              Add your family members to create health profiles and link them to Vayu Bands
            </p>
            <Button
              icon={Plus}
              onClick={() => navigate('/family/add')}
            >
              Add Family Member
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.memberList}>
              {members.map(member => {
                const band = getMemberBand(member.id)
                return (
                  <Card
                    key={member.id}
                    className={styles.memberCard}
                    onClick={() => navigate(`/family/${member.id}`)}
                  >
                    <div className={styles.memberMain}>
                      <div className={styles.avatar}>
                        {member.fullName.charAt(0)}
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.name}>{member.fullName}</h3>
                        <p className={styles.details}>
                          {member.age} years | {member.relationship}
                        </p>
                      </div>
                      <ChevronRight size={20} className={styles.arrow} />
                    </div>

                    <div className={styles.memberMeta}>
                      <Badge variant={BLOOD_GROUP_VARIANTS[member.bloodGroup]} size="sm">
                        {member.bloodGroup}
                      </Badge>

                      {band ? (
                        <Badge variant="success" size="sm">
                          <Watch size={12} />
                          Band Linked
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">
                          <Shield size={12} />
                          No Band
                        </Badge>
                      )}

                      {member.allergies && (
                        <Badge variant="warning" size="sm">
                          Allergies
                        </Badge>
                      )}

                      {member.medicalCondition && (
                        <Badge variant="error" size="sm">
                          Medical Condition
                        </Badge>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>

            <Button
              fullWidth
              icon={Plus}
              onClick={() => navigate('/family/add')}
            >
              Add Family Member
            </Button>
          </>
        )}
      </div>
    </PageLayout>
  )
}
