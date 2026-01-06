import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Search } from 'lucide-react'
import styles from './SearchableSelect.module.css'

// Standard allergy options
export const ALLERGY_OPTIONS = [
  // Food Allergies
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish',
  'Sesame', 'Mustard', 'Celery', 'Lupin', 'Mollusks', 'Gluten',
  // Drug Allergies
  'Penicillin', 'Amoxicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen',
  'Naproxen', 'Codeine', 'Morphine', 'Insulin', 'Contrast Dye',
  // Environmental Allergies
  'Dust Mites', 'Pollen', 'Mold', 'Pet Dander', 'Latex', 'Insect Stings',
  'Bee Venom', 'Wasp Venom', 'Cockroach', 'Grass',
  // Other
  'Nickel', 'Perfume', 'Sunlight', 'Cold', 'Exercise-Induced'
]

// Standard medical conditions
export const MEDICAL_CONDITION_OPTIONS = [
  // Cardiovascular
  'Hypertension', 'Heart Disease', 'Heart Failure', 'Arrhythmia',
  'Coronary Artery Disease', 'Angina', 'Previous Heart Attack', 'Pacemaker',
  // Respiratory
  'Asthma', 'COPD', 'Chronic Bronchitis', 'Emphysema', 'Sleep Apnea',
  'Pulmonary Fibrosis', 'Tuberculosis',
  // Endocrine
  'Diabetes Type 1', 'Diabetes Type 2', 'Hypothyroidism', 'Hyperthyroidism',
  'Adrenal Insufficiency', 'Cushing Syndrome',
  // Neurological
  'Epilepsy', 'Seizure Disorder', 'Parkinson Disease', 'Multiple Sclerosis',
  'Alzheimer Disease', 'Dementia', 'Migraine', 'Stroke History',
  // Blood Disorders
  'Anemia', 'Hemophilia', 'Sickle Cell Disease', 'Thalassemia',
  'Blood Clotting Disorder', 'Leukemia',
  // Kidney & Liver
  'Chronic Kidney Disease', 'Dialysis', 'Kidney Transplant',
  'Liver Disease', 'Hepatitis', 'Cirrhosis',
  // Autoimmune
  'Rheumatoid Arthritis', 'Lupus', 'Psoriasis', 'Crohn Disease',
  'Ulcerative Colitis', 'Celiac Disease',
  // Mental Health
  'Anxiety Disorder', 'Depression', 'Bipolar Disorder', 'Schizophrenia',
  // Cancer
  'Cancer - Active', 'Cancer - In Remission', 'Chemotherapy', 'Radiation Therapy',
  // Other
  'Pregnancy', 'Organ Transplant', 'Immunocompromised', 'HIV/AIDS',
  'Osteoporosis', 'Arthritis', 'Fibromyalgia'
]

export function SearchableSelect({
  label,
  placeholder = 'Type to search or select...',
  options = [],
  value = [],
  onChange,
  error,
  helperText,
  allowCustom = true,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState(value)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Parse initial value from comma-separated string
  useEffect(() => {
    if (typeof value === 'string' && value.trim()) {
      setSelectedItems(value.split(',').map(v => v.trim()).filter(Boolean))
    } else if (Array.isArray(value)) {
      setSelectedItems(value)
    } else {
      setSelectedItems([])
    }
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on search term
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedItems.includes(opt)
  )

  // Check if search term is a new custom value
  const isNewValue = searchTerm.trim() &&
    allowCustom &&
    !options.some(opt => opt.toLowerCase() === searchTerm.toLowerCase()) &&
    !selectedItems.some(item => item.toLowerCase() === searchTerm.toLowerCase())

  const handleSelect = (item) => {
    const newItems = [...selectedItems, item]
    setSelectedItems(newItems)
    onChange(newItems.join(', '))
    setSearchTerm('')
    inputRef.current?.focus()
  }

  const handleRemove = (item) => {
    const newItems = selectedItems.filter(i => i !== item)
    setSelectedItems(newItems)
    onChange(newItems.join(', '))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0])
      } else if (isNewValue) {
        handleSelect(searchTerm.trim())
      }
    } else if (e.key === 'Backspace' && !searchTerm && selectedItems.length > 0) {
      handleRemove(selectedItems[selectedItems.length - 1])
    }
  }

  return (
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={`${styles.inputWrapper} ${isOpen ? styles.focused : ''} ${error ? styles.error : ''}`}
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        <div className={styles.selectedItems}>
          {selectedItems.map((item, index) => (
            <span key={index} className={styles.tag}>
              {item}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(item)
                }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {searchTerm.length < 2 && filteredOptions.length > 10 ? (
            <div className={styles.hint}>
              <Search size={16} />
              Type at least 2 characters to search...
            </div>
          ) : (
            <>
              {filteredOptions.slice(0, 8).map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.option}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))}

              {isNewValue && (
                <button
                  type="button"
                  className={`${styles.option} ${styles.customOption}`}
                  onClick={() => handleSelect(searchTerm.trim())}
                >
                  Add "{searchTerm.trim()}"
                </button>
              )}

              {filteredOptions.length === 0 && !isNewValue && searchTerm.length >= 2 && (
                <div className={styles.noResults}>No matching options found</div>
              )}
            </>
          )}
        </div>
      )}

      {(error || helperText) && (
        <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}
