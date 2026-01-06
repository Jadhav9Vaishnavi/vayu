import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useFamily } from '../context/FamilyContext'
import { PageLayout } from '../components/layout'
import { Button, Input, TextArea, Select, Card, SearchableSelect, ALLERGY_OPTIONS, MEDICAL_CONDITION_OPTIONS } from '../components/ui'
import styles from './AddMemberPage.module.css'

const BLOOD_GROUPS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
]

const RELATIONSHIPS = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'other', label: 'Other' }
]

export function AddMemberPage() {
  const navigate = useNavigate()
  const { addMember } = useFamily()

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    bloodGroup: '',
    allergies: '',
    medicalCondition: '',
    homeAddress: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }],
    relationship: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }))
  }

  const addEmergencyContact = () => {
    if (formData.emergencyContacts.length >= 3) return
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relation: '' }]
    }))
  }

  const removeEmergencyContact = (index) => {
    if (formData.emergencyContacts.length <= 1) return
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 0 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age'
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required'
    }

    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = 'Home address is required'
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required'
    }

    // Validate at least one emergency contact
    const validContacts = formData.emergencyContacts.filter(
      c => c.name.trim() && c.phone.trim()
    )
    if (validContacts.length === 0) {
      newErrors.emergencyContacts = 'At least one emergency contact is required'
    }

    // Validate phone numbers
    formData.emergencyContacts.forEach((contact, index) => {
      if (contact.phone && !/^[6-9]\d{9}$/.test(contact.phone)) {
        newErrors[`contact_${index}_phone`] = 'Invalid phone number'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const memberData = {
        ...formData,
        age: parseInt(formData.age),
        emergencyContacts: formData.emergencyContacts.filter(c => c.name && c.phone)
      }

      const member = addMember(memberData)
      navigate(`/family/${member.id}`)
    } catch (err) {
      setErrors({ submit: 'Failed to add member. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Add Family Member" showBack showNav={false}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Basic Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>

          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
          />

          <div className={styles.row}>
            <Input
              label="Age"
              type="number"
              inputMode="numeric"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              error={errors.age}
            />

            <Select
              label="Blood Group"
              options={BLOOD_GROUPS}
              placeholder="Select"
              value={formData.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              error={errors.bloodGroup}
            />
          </div>

          <Select
            label="Relationship"
            options={RELATIONSHIPS}
            placeholder="Select relationship"
            value={formData.relationship}
            onChange={(e) => handleChange('relationship', e.target.value)}
            error={errors.relationship}
          />
        </section>

        {/* Medical Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Medical Information</h2>
          <p className={styles.sectionSubtitle}>Optional but recommended for emergencies</p>

          <SearchableSelect
            label="Allergies"
            placeholder="Type to search allergies..."
            options={ALLERGY_OPTIONS}
            value={formData.allergies}
            onChange={(value) => handleChange('allergies', value)}
            helperText="Select from list or add custom allergies"
          />

          <SearchableSelect
            label="Medical Conditions"
            placeholder="Type to search conditions..."
            options={MEDICAL_CONDITION_OPTIONS}
            value={formData.medicalCondition}
            onChange={(value) => handleChange('medicalCondition', value)}
            helperText="Select from list or add custom conditions"
          />
        </section>

        {/* Address */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Home Address</h2>

          <TextArea
            label="Complete Address"
            placeholder="Enter full address with landmark"
            value={formData.homeAddress}
            onChange={(e) => handleChange('homeAddress', e.target.value)}
            error={errors.homeAddress}
            rows={3}
          />
        </section>

        {/* Emergency Contacts */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Emergency Contacts</h2>
          <p className={styles.sectionSubtitle}>Add up to 3 contacts</p>

          {errors.emergencyContacts && (
            <p className={styles.error}>{errors.emergencyContacts}</p>
          )}

          {formData.emergencyContacts.map((contact, index) => (
            <Card key={index} variant="flat" padding="md" className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <span className={styles.contactLabel}>Contact {index + 1}</span>
                {formData.emergencyContacts.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeEmergencyContact(index)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <Input
                label="Name"
                placeholder="Contact name"
                value={contact.name}
                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={contact.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  handleContactChange(index, 'phone', val)
                }}
                error={errors[`contact_${index}_phone`]}
              />

              <Input
                label="Relation"
                placeholder="e.g., Neighbor, Doctor"
                value={contact.relation}
                onChange={(e) => handleContactChange(index, 'relation', e.target.value)}
              />
            </Card>
          ))}

          {formData.emergencyContacts.length < 3 && (
            <Button
              type="button"
              variant="secondary"
              icon={Plus}
              onClick={addEmergencyContact}
            >
              Add Another Contact
            </Button>
          )}
        </section>

        {errors.submit && (
          <p className={styles.error}>{errors.submit}</p>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
          >
            Add Family Member
          </Button>
        </div>
      </form>
    </PageLayout>
  )
}
