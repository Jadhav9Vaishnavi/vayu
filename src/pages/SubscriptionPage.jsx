import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Crown, Users, Watch, Shield, Zap } from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Card, Button, Badge, Modal } from '../components/ui'
import styles from './SubscriptionPage.module.css'

const PLANS = [
  {
    id: 'individual',
    name: 'Individual',
    memberCount: 1,
    price: 499,
    originalPrice: 699,
    features: [
      '1 Family Member Profile',
      '1 Vayu Band Linking',
      'Basic Privacy Controls',
      'Emergency Contact Access',
      '1 Year Validity'
    ],
    popular: false
  },
  {
    id: 'family',
    name: 'Family',
    memberCount: 4,
    price: 1499,
    originalPrice: 2499,
    features: [
      'Up to 4 Family Members',
      '4 Vayu Band Linkings',
      'Advanced Privacy Controls',
      'Priority Support',
      '1 Year Validity'
    ],
    popular: true
  }
]

export function SubscriptionPage() {
  const navigate = useNavigate()
  const { subscriptions, purchaseSubscription, getActiveMemberSlots } = useFamily()

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const slots = getActiveMemberSlots()

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePurchase = async () => {
    setLoading(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    purchaseSubscription(selectedPlan)
    setShowPayment(false)
    setLoading(false)
    setSelectedPlan(null)
  }

  return (
    <PageLayout title="Subscription Plans">
      <div className={styles.page}>
        {/* Current Status */}
        {activeSubscriptions.length > 0 && (
          <Card className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <Crown size={24} className={styles.statusIcon} />
              <div>
                <h3 className={styles.statusTitle}>Active Subscription</h3>
                <p className={styles.statusPlan}>
                  {slots.total} member slots available
                </p>
              </div>
            </div>
            <div className={styles.slotInfo}>
              <div className={styles.slotBar}>
                <div
                  className={styles.slotFill}
                  style={{ width: `${(slots.used / slots.total) * 100}%` }}
                />
              </div>
              <span className={styles.slotText}>
                {slots.used} of {slots.total} slots used
              </span>
            </div>
          </Card>
        )}

        {/* Benefits */}
        <section className={styles.benefits}>
          <h2 className={styles.sectionTitle}>Why Subscribe?</h2>
          <div className={styles.benefitGrid}>
            <div className={styles.benefit}>
              <Shield size={24} className={styles.benefitIcon} />
              <span>Secure Profiles</span>
            </div>
            <div className={styles.benefit}>
              <Watch size={24} className={styles.benefitIcon} />
              <span>Band Linking</span>
            </div>
            <div className={styles.benefit}>
              <Users size={24} className={styles.benefitIcon} />
              <span>Family Coverage</span>
            </div>
            <div className={styles.benefit}>
              <Zap size={24} className={styles.benefitIcon} />
              <span>Instant Access</span>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className={styles.plans}>
          <h2 className={styles.sectionTitle}>Choose Your Plan</h2>

          <div className={styles.planList}>
            {PLANS.map(plan => (
              <Card
                key={plan.id}
                className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
              >
                {plan.popular && (
                  <Badge variant="primary" className={styles.popularBadge}>
                    Most Popular
                  </Badge>
                )}

                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planMembers}>
                    {plan.memberCount} Member{plan.memberCount > 1 ? 's' : ''}
                  </p>
                </div>

                <div className={styles.planPrice}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.amount}>{plan.price}</span>
                  <span className={styles.period}>/year</span>
                </div>

                {plan.originalPrice > plan.price && (
                  <p className={styles.originalPrice}>
                    <s>₹{plan.originalPrice}</s>
                    <Badge variant="success" size="sm">
                      Save ₹{plan.originalPrice - plan.price}
                    </Badge>
                  </p>
                )}

                <ul className={styles.features}>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={16} className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={plan.popular ? 'primary' : 'secondary'}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Note */}
        <p className={styles.note}>
          All prices are in Indian Rupees (INR). Plans are valid for 1 year from the date of purchase.
          Vayu Bands are sold separately.
        </p>

        {/* Payment Modal */}
        <Modal
          isOpen={showPayment}
          onClose={() => !loading && setShowPayment(false)}
          title="Complete Purchase"
        >
          {selectedPlan && (
            <div className={styles.paymentContent}>
              <div className={styles.orderSummary}>
                <h4>Order Summary</h4>
                <div className={styles.orderItem}>
                  <span>{selectedPlan.name} Plan</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
                <div className={styles.orderItem}>
                  <span>GST (18%)</span>
                  <span>₹{Math.round(selectedPlan.price * 0.18)}</span>
                </div>
                <div className={`${styles.orderItem} ${styles.orderTotal}`}>
                  <span>Total</span>
                  <span>₹{Math.round(selectedPlan.price * 1.18)}</span>
                </div>
              </div>

              <div className={styles.paymentMethods}>
                <p className={styles.paymentLabel}>Payment Method</p>
                <Card variant="outlined" className={styles.paymentMethod}>
                  <input type="radio" name="payment" defaultChecked />
                  <span>UPI / Net Banking / Cards</span>
                </Card>
              </div>

              <div className={styles.paymentActions}>
                <Button
                  variant="ghost"
                  onClick={() => setShowPayment(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  loading={loading}
                >
                  Pay ₹{Math.round(selectedPlan.price * 1.18)}
                </Button>
              </div>

              <p className={styles.secureNote}>
                <Shield size={14} />
                Secure payment powered by Razorpay
              </p>
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  )
}
