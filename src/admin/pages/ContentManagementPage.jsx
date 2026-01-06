import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FileText,
  AlertTriangle,
  Heart,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

// Default data
const DEFAULT_ALLERGIES = [
  { id: 1, name: 'Peanuts', category: 'Food', severity: 'high' },
  { id: 2, name: 'Tree Nuts', category: 'Food', severity: 'high' },
  { id: 3, name: 'Milk', category: 'Food', severity: 'medium' },
  { id: 4, name: 'Eggs', category: 'Food', severity: 'medium' },
  { id: 5, name: 'Wheat (Gluten)', category: 'Food', severity: 'medium' },
  { id: 6, name: 'Soy', category: 'Food', severity: 'low' },
  { id: 7, name: 'Fish', category: 'Food', severity: 'high' },
  { id: 8, name: 'Shellfish', category: 'Food', severity: 'high' },
  { id: 9, name: 'Penicillin', category: 'Medication', severity: 'high' },
  { id: 10, name: 'Aspirin', category: 'Medication', severity: 'medium' },
  { id: 11, name: 'Ibuprofen', category: 'Medication', severity: 'medium' },
  { id: 12, name: 'Sulfa Drugs', category: 'Medication', severity: 'high' },
  { id: 13, name: 'Latex', category: 'Environmental', severity: 'medium' },
  { id: 14, name: 'Dust Mites', category: 'Environmental', severity: 'low' },
  { id: 15, name: 'Pollen', category: 'Environmental', severity: 'low' },
  { id: 16, name: 'Pet Dander', category: 'Environmental', severity: 'low' },
  { id: 17, name: 'Insect Stings', category: 'Environmental', severity: 'high' }
]

const DEFAULT_CONDITIONS = [
  { id: 1, name: 'Diabetes Type 1', category: 'Metabolic', critical: true },
  { id: 2, name: 'Diabetes Type 2', category: 'Metabolic', critical: true },
  { id: 3, name: 'Hypertension', category: 'Cardiovascular', critical: true },
  { id: 4, name: 'Heart Disease', category: 'Cardiovascular', critical: true },
  { id: 5, name: 'Asthma', category: 'Respiratory', critical: true },
  { id: 6, name: 'COPD', category: 'Respiratory', critical: true },
  { id: 7, name: 'Epilepsy', category: 'Neurological', critical: true },
  { id: 8, name: 'Alzheimer\'s', category: 'Neurological', critical: true },
  { id: 9, name: 'Parkinson\'s', category: 'Neurological', critical: true },
  { id: 10, name: 'Arthritis', category: 'Musculoskeletal', critical: false },
  { id: 11, name: 'Thyroid Disorder', category: 'Endocrine', critical: false },
  { id: 12, name: 'Kidney Disease', category: 'Renal', critical: true },
  { id: 13, name: 'Liver Disease', category: 'Hepatic', critical: true },
  { id: 14, name: 'Cancer', category: 'Oncology', critical: true }
]

const DEFAULT_FAQS = [
  { id: 1, question: 'How do I register my Vayu Band?', answer: 'Go to the Bands section in the app and click on "Register Band". Enter the serial number from your band and follow the verification steps.', category: 'Bands' },
  { id: 2, question: 'How do I link a band to a family member?', answer: 'After registering a band, go to the Bands page, find the unlinked band, and click "Link Member". Select the family member you want to link.', category: 'Bands' },
  { id: 3, question: 'What happens when someone scans my band?', answer: 'They will see the public profile information you\'ve chosen to share, including emergency contacts and any medical information marked as public.', category: 'Privacy' },
  { id: 4, question: 'Can I control what information is visible?', answer: 'Yes! Each family member\'s profile has privacy settings where you can choose exactly what information is visible when the band is scanned.', category: 'Privacy' },
  { id: 5, question: 'How do I add emergency contacts?', answer: 'When adding or editing a family member, scroll to the Emergency Contacts section. You can add up to 3 emergency contacts with their name, phone, and relation.', category: 'Profile' },
  { id: 6, question: 'What subscription plans are available?', answer: 'We offer Individual (1 member) and Family (4 members) plans. Both include band linking, privacy controls, and 1-year validity.', category: 'Subscription' },
  { id: 7, question: 'How do I upgrade my plan?', answer: 'Go to the Subscription page and select a new plan. Your member slots will be increased accordingly.', category: 'Subscription' },
  { id: 8, question: 'Is my data secure?', answer: 'Yes, we use industry-standard encryption and privacy measures. You control what information is publicly visible through privacy settings.', category: 'Privacy' }
]

export function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('allergies')
  const [allergies, setAllergies] = useState([])
  const [conditions, setConditions] = useState([])
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = () => {
    // Load from localStorage or use defaults
    const storedAllergies = JSON.parse(localStorage.getItem('vayu_master_allergies') || 'null')
    const storedConditions = JSON.parse(localStorage.getItem('vayu_master_conditions') || 'null')
    const storedFaqs = JSON.parse(localStorage.getItem('vayu_master_faqs') || 'null')

    setAllergies(storedAllergies || DEFAULT_ALLERGIES)
    setConditions(storedConditions || DEFAULT_CONDITIONS)
    setFaqs(storedFaqs || DEFAULT_FAQS)

    // Save defaults if not exists
    if (!storedAllergies) localStorage.setItem('vayu_master_allergies', JSON.stringify(DEFAULT_ALLERGIES))
    if (!storedConditions) localStorage.setItem('vayu_master_conditions', JSON.stringify(DEFAULT_CONDITIONS))
    if (!storedFaqs) localStorage.setItem('vayu_master_faqs', JSON.stringify(DEFAULT_FAQS))
  }

  const getFilteredItems = () => {
    let items = activeTab === 'allergies' ? allergies :
                activeTab === 'conditions' ? conditions : faqs

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.question?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      )
    }

    return items
  }

  const handleAdd = () => {
    setEditItem(null)
    if (activeTab === 'allergies') {
      setFormData({ name: '', category: 'Food', severity: 'medium' })
    } else if (activeTab === 'conditions') {
      setFormData({ name: '', category: 'General', critical: false })
    } else {
      setFormData({ question: '', answer: '', category: 'General' })
    }
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setFormData({ ...item })
    setShowModal(true)
  }

  const handleDelete = (item) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return

    if (activeTab === 'allergies') {
      const updated = allergies.filter(a => a.id !== item.id)
      setAllergies(updated)
      localStorage.setItem('vayu_master_allergies', JSON.stringify(updated))
    } else if (activeTab === 'conditions') {
      const updated = conditions.filter(c => c.id !== item.id)
      setConditions(updated)
      localStorage.setItem('vayu_master_conditions', JSON.stringify(updated))
    } else {
      const updated = faqs.filter(f => f.id !== item.id)
      setFaqs(updated)
      localStorage.setItem('vayu_master_faqs', JSON.stringify(updated))
    }
  }

  const handleSave = () => {
    if (activeTab === 'allergies') {
      if (!formData.name?.trim()) return alert('Name is required')

      let updated
      if (editItem) {
        updated = allergies.map(a => a.id === editItem.id ? { ...a, ...formData } : a)
      } else {
        updated = [...allergies, { ...formData, id: Date.now() }]
      }
      setAllergies(updated)
      localStorage.setItem('vayu_master_allergies', JSON.stringify(updated))
    } else if (activeTab === 'conditions') {
      if (!formData.name?.trim()) return alert('Name is required')

      let updated
      if (editItem) {
        updated = conditions.map(c => c.id === editItem.id ? { ...c, ...formData } : c)
      } else {
        updated = [...conditions, { ...formData, id: Date.now() }]
      }
      setConditions(updated)
      localStorage.setItem('vayu_master_conditions', JSON.stringify(updated))
    } else {
      if (!formData.question?.trim() || !formData.answer?.trim()) return alert('Question and answer are required')

      let updated
      if (editItem) {
        updated = faqs.map(f => f.id === editItem.id ? { ...f, ...formData } : f)
      } else {
        updated = [...faqs, { ...formData, id: Date.now() }]
      }
      setFaqs(updated)
      localStorage.setItem('vayu_master_faqs', JSON.stringify(updated))
    }

    setShowModal(false)
  }

  const filteredItems = getFilteredItems()

  return (
    <AdminLayout title="Content Management">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard" style={{ cursor: 'pointer', border: activeTab === 'allergies' ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)' }} onClick={() => setActiveTab('allergies')}>
          <div className="statIcon orange">
            <AlertTriangle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Allergies</div>
            <div className="statValue">{allergies.length}</div>
          </div>
        </div>
        <div className="statCard" style={{ cursor: 'pointer', border: activeTab === 'conditions' ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)' }} onClick={() => setActiveTab('conditions')}>
          <div className="statIcon red">
            <Heart size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Medical Conditions</div>
            <div className="statValue">{conditions.length}</div>
          </div>
        </div>
        <div className="statCard" style={{ cursor: 'pointer', border: activeTab === 'faqs' ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)' }} onClick={() => setActiveTab('faqs')}>
          <div className="statIcon blue">
            <HelpCircle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">FAQs</div>
            <div className="statValue">{faqs.length}</div>
          </div>
        </div>
      </div>

      <div className="adminCard">
        {/* Tabs */}
        <div className="adminTabs">
          <button
            className={`adminTab ${activeTab === 'allergies' ? 'active' : ''}`}
            onClick={() => setActiveTab('allergies')}
          >
            <AlertTriangle size={16} /> Allergies ({allergies.length})
          </button>
          <button
            className={`adminTab ${activeTab === 'conditions' ? 'active' : ''}`}
            onClick={() => setActiveTab('conditions')}
          >
            <Heart size={16} /> Medical Conditions ({conditions.length})
          </button>
          <button
            className={`adminTab ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={16} /> FAQs ({faqs.length})
          </button>
        </div>

        {/* Filters */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="adminBtn primary" onClick={handleAdd}>
            <Plus size={16} />
            Add {activeTab === 'allergies' ? 'Allergy' : activeTab === 'conditions' ? 'Condition' : 'FAQ'}
          </button>
        </div>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <div className="emptyState">
            <FileText size={48} />
            <h3>No {activeTab} found</h3>
            <p>Add some {activeTab} to get started</p>
          </div>
        ) : activeTab === 'faqs' ? (
          // FAQ Accordion
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {filteredItems.map(faq => (
              <div
                key={faq.id}
                style={{
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)',
                    background: expandedFaq === faq.id ? 'var(--admin-bg-secondary)' : 'var(--admin-bg)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
                    <span className="adminBadge info">{faq.category}</span>
                    <span style={{ fontWeight: 500 }}>{faq.question}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <button className="actionBtn" onClick={(e) => { e.stopPropagation(); handleEdit(faq) }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="actionBtn danger" onClick={(e) => { e.stopPropagation(); handleDelete(faq) }}>
                      <Trash2 size={16} />
                    </button>
                    {expandedFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {expandedFaq === faq.id && (
                  <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--admin-border)', background: 'var(--admin-bg-secondary)' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Table for Allergies & Conditions
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>{activeTab === 'allergies' ? 'Severity' : 'Critical'}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>
                    <span className="adminBadge default">{item.category}</span>
                  </td>
                  <td>
                    {activeTab === 'allergies' ? (
                      <span className={`adminBadge ${
                        item.severity === 'high' ? 'error' :
                        item.severity === 'medium' ? 'warning' : 'success'
                      }`}>
                        {item.severity}
                      </span>
                    ) : (
                      <span className={`adminBadge ${item.critical ? 'error' : 'default'}`}>
                        {item.critical ? 'Critical' : 'Non-Critical'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="actionsCell">
                      <button className="actionBtn" onClick={() => handleEdit(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="actionBtn danger" onClick={() => handleDelete(item)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="adminModal" onClick={() => setShowModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">
                {editItem ? 'Edit' : 'Add'} {activeTab === 'allergies' ? 'Allergy' : activeTab === 'conditions' ? 'Condition' : 'FAQ'}
              </h2>
              <button className="adminModalClose" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              {activeTab === 'faqs' ? (
                <>
                  <div className="adminFormGroup">
                    <label className="adminLabel">Category</label>
                    <select
                      className="adminSelect"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Bands">Bands</option>
                      <option value="Profile">Profile</option>
                      <option value="Privacy">Privacy</option>
                      <option value="Subscription">Subscription</option>
                    </select>
                  </div>
                  <div className="adminFormGroup">
                    <label className="adminLabel">Question</label>
                    <input
                      type="text"
                      className="adminInput"
                      placeholder="Enter the question..."
                      value={formData.question || ''}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    />
                  </div>
                  <div className="adminFormGroup">
                    <label className="adminLabel">Answer</label>
                    <textarea
                      className="adminTextarea"
                      placeholder="Enter the answer..."
                      value={formData.answer || ''}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="adminFormGroup">
                    <label className="adminLabel">Name</label>
                    <input
                      type="text"
                      className="adminInput"
                      placeholder={`Enter ${activeTab === 'allergies' ? 'allergy' : 'condition'} name...`}
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="adminFormGroup">
                    <label className="adminLabel">Category</label>
                    {activeTab === 'allergies' ? (
                      <select
                        className="adminSelect"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Food">Food</option>
                        <option value="Medication">Medication</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <select
                        className="adminSelect"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Cardiovascular">Cardiovascular</option>
                        <option value="Respiratory">Respiratory</option>
                        <option value="Neurological">Neurological</option>
                        <option value="Metabolic">Metabolic</option>
                        <option value="Endocrine">Endocrine</option>
                        <option value="Renal">Renal</option>
                        <option value="Hepatic">Hepatic</option>
                        <option value="Musculoskeletal">Musculoskeletal</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                  <div className="adminFormGroup">
                    <label className="adminLabel">
                      {activeTab === 'allergies' ? 'Severity' : 'Is Critical?'}
                    </label>
                    {activeTab === 'allergies' ? (
                      <select
                        className="adminSelect"
                        value={formData.severity || 'medium'}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.critical || false}
                          onChange={(e) => setFormData({ ...formData, critical: e.target.checked })}
                          style={{ width: 20, height: 20 }}
                        />
                        <span>This condition is critical for emergency responders</span>
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="adminModalFooter">
              <button className="adminBtn secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="adminBtn primary" onClick={handleSave}>
                {editItem ? 'Save Changes' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
