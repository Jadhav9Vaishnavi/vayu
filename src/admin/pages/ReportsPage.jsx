import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  Table,
  Download,
  Filter,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  FileSpreadsheet,
  Users,
  UserCheck,
  Watch,
  CreditCard,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Hash,
  Calendar,
  Sigma,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

// Data source definitions
const DATA_SOURCES = {
  users: {
    label: 'Users',
    icon: Users,
    fields: [
      { key: 'id', label: 'User ID', type: 'string' },
      { key: 'name', label: 'Name', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'phone', label: 'Phone', type: 'string' },
      { key: 'createdAt', label: 'Registration Date', type: 'date' },
      { key: 'memberCount', label: 'Family Members', type: 'number' },
      { key: 'bandCount', label: 'Registered Bands', type: 'number' },
      { key: 'linkedBandCount', label: 'Linked Bands', type: 'number' },
      { key: 'subscriptionStatus', label: 'Subscription Status', type: 'string' },
      { key: 'planName', label: 'Plan Name', type: 'string' },
      { key: 'totalSpent', label: 'Total Spent (₹)', type: 'number' }
    ]
  },
  members: {
    label: 'Family Members',
    icon: UserCheck,
    fields: [
      { key: 'id', label: 'Member ID', type: 'string' },
      { key: 'fullName', label: 'Full Name', type: 'string' },
      { key: 'age', label: 'Age', type: 'number' },
      { key: 'bloodGroup', label: 'Blood Group', type: 'string' },
      { key: 'relationship', label: 'Relationship', type: 'string' },
      { key: 'hasAllergies', label: 'Has Allergies', type: 'boolean' },
      { key: 'hasMedicalCondition', label: 'Has Medical Condition', type: 'boolean' },
      { key: 'hasBand', label: 'Band Linked', type: 'boolean' },
      { key: 'userName', label: 'User Name', type: 'string' },
      { key: 'createdAt', label: 'Added Date', type: 'date' }
    ]
  },
  bands: {
    label: 'Wrist Bands',
    icon: Watch,
    fields: [
      { key: 'id', label: 'Band ID', type: 'string' },
      { key: 'bs', label: 'Serial Number', type: 'string' },
      { key: 'bui', label: 'Unique ID (BUI)', type: 'string' },
      { key: 'isLinked', label: 'Is Linked', type: 'boolean' },
      { key: 'memberName', label: 'Linked Member', type: 'string' },
      { key: 'userName', label: 'User Name', type: 'string' },
      { key: 'registeredAt', label: 'Registration Date', type: 'date' }
    ]
  },
  subscriptions: {
    label: 'Subscriptions',
    icon: CreditCard,
    fields: [
      { key: 'id', label: 'Subscription ID', type: 'string' },
      { key: 'userName', label: 'User Name', type: 'string' },
      { key: 'planName', label: 'Plan', type: 'string' },
      { key: 'price', label: 'Amount (₹)', type: 'number' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'memberCount', label: 'Member Slots', type: 'number' }
    ]
  }
}

// Aggregation functions
const AGGREGATIONS = {
  count: { label: 'Count', icon: Hash, apply: (values) => values.length },
  sum: { label: 'Sum', icon: Sigma, apply: (values) => values.reduce((a, b) => a + (Number(b) || 0), 0) },
  avg: { label: 'Average', icon: Minus, apply: (values) => values.length ? (values.reduce((a, b) => a + (Number(b) || 0), 0) / values.length).toFixed(2) : 0 },
  min: { label: 'Minimum', icon: ArrowDown, apply: (values) => Math.min(...values.filter(v => !isNaN(v))) },
  max: { label: 'Maximum', icon: ArrowUp, apply: (values) => Math.max(...values.filter(v => !isNaN(v))) }
}

// Pre-built report templates
const REPORT_TEMPLATES = [
  {
    id: 'users_no_bands',
    name: 'Users with No Bands',
    description: 'Users who have not registered any bands',
    source: 'users',
    columns: ['name', 'email', 'phone', 'memberCount', 'createdAt'],
    filters: [{ field: 'bandCount', operator: 'equals', value: '0' }]
  },
  {
    id: 'users_1_4_bands',
    name: 'Users with 1-4 Bands',
    description: 'Users who have registered between 1 and 4 bands',
    source: 'users',
    columns: ['name', 'email', 'bandCount', 'linkedBandCount', 'planName'],
    filters: [
      { field: 'bandCount', operator: 'gte', value: '1' },
      { field: 'bandCount', operator: 'lte', value: '4' }
    ]
  },
  {
    id: 'users_no_members',
    name: 'Users with No Family Members',
    description: 'Users who have not added any family members',
    source: 'users',
    columns: ['name', 'email', 'phone', 'subscriptionStatus', 'createdAt'],
    filters: [{ field: 'memberCount', operator: 'equals', value: '0' }]
  },
  {
    id: 'active_subscriptions',
    name: 'Active Subscriptions',
    description: 'All currently active subscriptions',
    source: 'subscriptions',
    columns: ['userName', 'planName', 'price', 'startDate', 'endDate'],
    filters: [{ field: 'status', operator: 'equals', value: 'active' }]
  },
  {
    id: 'members_with_conditions',
    name: 'Members with Medical Conditions',
    description: 'Family members who have medical conditions listed',
    source: 'members',
    columns: ['fullName', 'age', 'bloodGroup', 'userName', 'hasBand'],
    filters: [{ field: 'hasMedicalCondition', operator: 'equals', value: 'true' }]
  },
  {
    id: 'unlinked_bands',
    name: 'Unlinked Bands',
    description: 'Registered bands not linked to any member',
    source: 'bands',
    columns: ['bs', 'bui', 'userName', 'registeredAt'],
    filters: [{ field: 'isLinked', operator: 'equals', value: 'false' }]
  }
]

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('builder') // builder | templates
  const [dataSource, setDataSource] = useState('users')
  const [selectedColumns, setSelectedColumns] = useState([])
  const [filters, setFilters] = useState([])
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' })
  const [aggregations, setAggregations] = useState([])
  const [reportData, setReportData] = useState([])
  const [rawData, setRawData] = useState({})
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAggregationModal, setShowAggregationModal] = useState(false)

  // Load all data
  useEffect(() => {
    loadAllData()
  }, [])

  // Generate report when configuration changes
  useEffect(() => {
    generateReport()
  }, [dataSource, selectedColumns, filters, sortConfig, rawData])

  const loadAllData = () => {
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const allMembers = []
    const allBands = []
    const allSubscriptions = []

    // Enrich user data
    const enrichedUsers = users.map(user => {
      const members = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
      const bands = JSON.parse(localStorage.getItem(`vayu_bands_${user.id}`) || '[]')
      const subs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')
      const activeSub = subs.find(s => s.status === 'active')
      const linkedBands = bands.filter(b => b.memberId)

      // Collect members with user info
      members.forEach(m => {
        allMembers.push({
          ...m,
          hasAllergies: !!m.allergies,
          hasMedicalCondition: !!m.medicalCondition,
          hasBand: !!m.bandId,
          userName: user.name || user.email
        })
      })

      // Collect bands with user info
      bands.forEach(b => {
        const member = members.find(m => m.id === b.memberId)
        allBands.push({
          ...b,
          isLinked: !!b.memberId,
          memberName: member?.fullName || '',
          userName: user.name || user.email
        })
      })

      // Collect subscriptions with user info
      subs.forEach(s => {
        allSubscriptions.push({
          ...s,
          userName: user.name || user.email
        })
      })

      return {
        ...user,
        memberCount: members.length,
        bandCount: bands.length,
        linkedBandCount: linkedBands.length,
        subscriptionStatus: activeSub ? 'active' : (subs.length > 0 ? 'expired' : 'none'),
        planName: activeSub?.planName || 'No Plan',
        totalSpent: subs.reduce((sum, s) => sum + (s.price || 0), 0)
      }
    })

    setRawData({
      users: enrichedUsers,
      members: allMembers,
      bands: allBands,
      subscriptions: allSubscriptions
    })

    // Set default columns for users
    setSelectedColumns(['name', 'email', 'memberCount', 'bandCount', 'subscriptionStatus'])
  }

  const generateReport = () => {
    if (!rawData[dataSource]) return

    let data = [...rawData[dataSource]]

    // Apply filters
    filters.forEach(filter => {
      data = data.filter(item => {
        const value = item[filter.field]
        const filterValue = filter.value

        switch (filter.operator) {
          case 'equals':
            return String(value).toLowerCase() === String(filterValue).toLowerCase()
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
          case 'gt':
            return Number(value) > Number(filterValue)
          case 'gte':
            return Number(value) >= Number(filterValue)
          case 'lt':
            return Number(value) < Number(filterValue)
          case 'lte':
            return Number(value) <= Number(filterValue)
          case 'notEquals':
            return String(value).toLowerCase() !== String(filterValue).toLowerCase()
          default:
            return true
        }
      })
    })

    // Apply sorting
    if (sortConfig.field) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.field]
        const bVal = b[sortConfig.field]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal || '').toLowerCase()
        const bStr = String(bVal || '').toLowerCase()
        return sortConfig.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      })
    }

    setReportData(data)
  }

  const applyTemplate = (template) => {
    setDataSource(template.source)
    setSelectedColumns(template.columns)
    setFilters(template.filters)
    setSortConfig({ field: null, direction: 'asc' })
    setActiveTab('builder')
  }

  const toggleColumn = (fieldKey) => {
    setSelectedColumns(prev =>
      prev.includes(fieldKey)
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey]
    )
  }

  const addFilter = (filter) => {
    setFilters(prev => [...prev, filter])
    setShowFilterModal(false)
  }

  const removeFilter = (index) => {
    setFilters(prev => prev.filter((_, i) => i !== index))
  }

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '-'
    if (type === 'date') {
      return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    if (type === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (type === 'number') {
      return Number(value).toLocaleString('en-IN')
    }
    return String(value)
  }

  const exportToCSV = () => {
    if (reportData.length === 0) return

    const fields = DATA_SOURCES[dataSource].fields.filter(f => selectedColumns.includes(f.key))
    const headers = fields.map(f => f.label).join(',')
    const rows = reportData.map(row =>
      fields.map(f => {
        const val = row[f.key]
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`
        }
        return val ?? ''
      }).join(',')
    )

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vayu_report_${dataSource}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate aggregations
  const calculatedAggregations = useMemo(() => {
    return aggregations.map(agg => {
      const values = reportData.map(row => row[agg.field])
      const result = AGGREGATIONS[agg.function].apply(values)
      const fieldLabel = DATA_SOURCES[dataSource].fields.find(f => f.key === agg.field)?.label || agg.field
      return {
        ...agg,
        fieldLabel,
        result
      }
    })
  }, [aggregations, reportData, dataSource])

  const sourceFields = DATA_SOURCES[dataSource]?.fields || []

  return (
    <AdminLayout title="Reports & Analytics">
      {/* Tabs */}
      <div className="adminCard" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="adminTabs" style={{ marginBottom: 0 }}>
          <button
            className={`adminTab ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            <Table size={16} /> Report Builder
          </button>
          <button
            className={`adminTab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <FileSpreadsheet size={16} /> Pre-built Reports
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        // Templates Grid
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {REPORT_TEMPLATES.map(template => {
            const SourceIcon = DATA_SOURCES[template.source]?.icon || Table
            return (
              <div key={template.id} className="adminCard" style={{ cursor: 'pointer' }} onClick={() => applyTemplate(template)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius)',
                    background: 'var(--admin-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--admin-primary)'
                  }}>
                    <SourceIcon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
                      {template.description}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                  <span className="adminBadge default">{DATA_SOURCES[template.source].label}</span>
                  <span className="adminBadge info">{template.columns.length} columns</span>
                  <span className="adminBadge warning">{template.filters.length} filters</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Report Builder
        <>
          {/* Configuration Bar */}
          <div className="adminCard" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              {/* Data Source */}
              <div>
                <label className="adminLabel" style={{ marginBottom: 'var(--spacing-xs)' }}>Data Source</label>
                <select
                  className="adminSelect"
                  value={dataSource}
                  onChange={(e) => {
                    setDataSource(e.target.value)
                    setSelectedColumns(DATA_SOURCES[e.target.value].fields.slice(0, 5).map(f => f.key))
                    setFilters([])
                    setAggregations([])
                  }}
                  style={{ minWidth: 180 }}
                >
                  {Object.entries(DATA_SOURCES).map(([key, source]) => (
                    <option key={key} value={key}>{source.label}</option>
                  ))}
                </select>
              </div>

              {/* Column Picker */}
              <div style={{ position: 'relative' }}>
                <label className="adminLabel" style={{ marginBottom: 'var(--spacing-xs)' }}>Columns</label>
                <button
                  className="adminBtn secondary"
                  onClick={() => setShowColumnPicker(!showColumnPicker)}
                >
                  <Table size={16} />
                  {selectedColumns.length} selected
                  <ChevronDown size={14} />
                </button>

                {showColumnPicker && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    minWidth: 220,
                    maxHeight: 300,
                    overflow: 'auto',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    {sourceFields.map(field => (
                      <label
                        key={field.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--admin-border)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(field.key)}
                          onChange={() => toggleColumn(field.key)}
                        />
                        <span style={{ fontSize: 'var(--font-size-sm)' }}>{field.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Filter */}
              <div>
                <label className="adminLabel" style={{ marginBottom: 'var(--spacing-xs)' }}>Filters</label>
                <button className="adminBtn secondary" onClick={() => setShowFilterModal(true)}>
                  <Filter size={16} />
                  Add Filter
                </button>
              </div>

              {/* Add Aggregation */}
              <div>
                <label className="adminLabel" style={{ marginBottom: 'var(--spacing-xs)' }}>Aggregations</label>
                <button className="adminBtn secondary" onClick={() => setShowAggregationModal(true)}>
                  <Sigma size={16} />
                  Add Function
                </button>
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <label className="adminLabel" style={{ marginBottom: 'var(--spacing-xs)', visibility: 'hidden' }}>Export</label>
                <button className="adminBtn primary" onClick={exportToCSV} disabled={reportData.length === 0}>
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {filters.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)', alignSelf: 'center' }}>Active filters:</span>
                {filters.map((filter, idx) => {
                  const fieldLabel = sourceFields.find(f => f.key === filter.field)?.label || filter.field
                  return (
                    <span key={idx} className="adminBadge info" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      {fieldLabel} {filter.operator} "{filter.value}"
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter(idx)} />
                    </span>
                  )
                })}
              </div>
            )}

            {/* Aggregation Results */}
            {calculatedAggregations.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                {calculatedAggregations.map((agg, idx) => (
                  <div key={idx} style={{
                    background: 'var(--admin-bg-secondary)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
                      {AGGREGATIONS[agg.function].label}({agg.fieldLabel}):
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>
                      {agg.result}
                    </span>
                    <X size={14} style={{ cursor: 'pointer', color: 'var(--admin-text-muted)' }}
                      onClick={() => setAggregations(prev => prev.filter((_, i) => i !== idx))} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Table */}
          <div className="adminCard">
            <div className="adminCardHeader">
              <h2 className="adminCardTitle">
                Results ({reportData.length} records)
              </h2>
            </div>

            {reportData.length === 0 ? (
              <div className="emptyState">
                <Table size={48} />
                <h3>No Data Found</h3>
                <p>Try adjusting your filters or selecting different columns</p>
              </div>
            ) : (
              <div style={{ overflow: 'auto' }}>
                <table className="adminTable">
                  <thead>
                    <tr>
                      {selectedColumns.map(colKey => {
                        const field = sourceFields.find(f => f.key === colKey)
                        if (!field) return null
                        return (
                          <th
                            key={colKey}
                            onClick={() => handleSort(colKey)}
                            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                              {field.label}
                              {sortConfig.field === colKey ? (
                                sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                              ) : (
                                <ArrowUpDown size={14} style={{ opacity: 0.3 }} />
                              )}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.slice(0, 100).map((row, idx) => (
                      <tr key={idx}>
                        {selectedColumns.map(colKey => {
                          const field = sourceFields.find(f => f.key === colKey)
                          if (!field) return null
                          return (
                            <td key={colKey}>
                              {formatValue(row[colKey], field.type)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.length > 100 && (
                  <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Showing first 100 of {reportData.length} records. Export to CSV to see all.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          fields={sourceFields}
          onAdd={addFilter}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {/* Aggregation Modal */}
      {showAggregationModal && (
        <AggregationModal
          fields={sourceFields.filter(f => f.type === 'number')}
          onAdd={(agg) => {
            setAggregations(prev => [...prev, agg])
            setShowAggregationModal(false)
          }}
          onClose={() => setShowAggregationModal(false)}
        />
      )}
    </AdminLayout>
  )
}

// Filter Modal Component
function FilterModal({ fields, onAdd, onClose }) {
  const [field, setField] = useState(fields[0]?.key || '')
  const [operator, setOperator] = useState('equals')
  const [value, setValue] = useState('')

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lt', label: 'Less Than' },
    { value: 'lte', label: 'Less Than or Equal' }
  ]

  return (
    <div className="adminModal" onClick={onClose}>
      <div className="adminModalContent" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="adminModalHeader">
          <h2 className="adminModalTitle">Add Filter</h2>
          <button className="adminModalClose" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="adminModalBody">
          <div className="adminFormGroup">
            <label className="adminLabel">Field</label>
            <select className="adminSelect" value={field} onChange={e => setField(e.target.value)}>
              {fields.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </div>
          <div className="adminFormGroup">
            <label className="adminLabel">Operator</label>
            <select className="adminSelect" value={operator} onChange={e => setOperator(e.target.value)}>
              {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
            </select>
          </div>
          <div className="adminFormGroup">
            <label className="adminLabel">Value</label>
            <input
              type="text"
              className="adminInput"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter value..."
            />
          </div>
        </div>
        <div className="adminModalFooter">
          <button className="adminBtn secondary" onClick={onClose}>Cancel</button>
          <button
            className="adminBtn primary"
            onClick={() => value && onAdd({ field, operator, value })}
            disabled={!value}
          >
            Add Filter
          </button>
        </div>
      </div>
    </div>
  )
}

// Aggregation Modal Component
function AggregationModal({ fields, onAdd, onClose }) {
  const [field, setField] = useState(fields[0]?.key || '')
  const [func, setFunc] = useState('count')

  if (fields.length === 0) {
    return (
      <div className="adminModal" onClick={onClose}>
        <div className="adminModalContent" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
          <div className="adminModalHeader">
            <h2 className="adminModalTitle">Add Aggregation</h2>
            <button className="adminModalClose" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="adminModalBody">
            <div className="emptyState" style={{ padding: 'var(--spacing-lg)' }}>
              <AlertCircle size={32} />
              <p>No numeric fields available for aggregation in this data source.</p>
            </div>
          </div>
          <div className="adminModalFooter">
            <button className="adminBtn secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="adminModal" onClick={onClose}>
      <div className="adminModalContent" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="adminModalHeader">
          <h2 className="adminModalTitle">Add Aggregation</h2>
          <button className="adminModalClose" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="adminModalBody">
          <div className="adminFormGroup">
            <label className="adminLabel">Function</label>
            <select className="adminSelect" value={func} onChange={e => setFunc(e.target.value)}>
              {Object.entries(AGGREGATIONS).map(([key, agg]) => (
                <option key={key} value={key}>{agg.label}</option>
              ))}
            </select>
          </div>
          <div className="adminFormGroup">
            <label className="adminLabel">Field</label>
            <select className="adminSelect" value={field} onChange={e => setField(e.target.value)}>
              {fields.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </div>
        </div>
        <div className="adminModalFooter">
          <button className="adminBtn secondary" onClick={onClose}>Cancel</button>
          <button className="adminBtn primary" onClick={() => onAdd({ field, function: func })}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
