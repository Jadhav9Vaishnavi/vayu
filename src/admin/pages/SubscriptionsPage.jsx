import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [filteredSubs, setFilteredSubs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedSub, setSelectedSub] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, searchQuery, statusFilter, planFilter])

  const loadSubscriptions = () => {
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const allSubs = []

    users.forEach(user => {
      const userSubs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')

      userSubs.forEach(sub => {
        // Check if subscription has expired
        const isExpired = new Date(sub.endDate) < new Date()
        const status = isExpired ? 'expired' : sub.status

        allSubs.push({
          ...sub,
          status,
          userName: user.name || user.email,
          userEmail: user.email,
          userId: user.id
        })
      })
    })

    // Sort by start date (newest first)
    allSubs.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    setSubscriptions(allSubs)
  }

  const filterSubscriptions = () => {
    let filtered = [...subscriptions]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(sub =>
        sub.userName?.toLowerCase().includes(query) ||
        sub.userEmail?.toLowerCase().includes(query) ||
        sub.planName?.toLowerCase().includes(query) ||
        sub.id?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter)
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(sub => sub.plan === planFilter)
    }

    setFilteredSubs(filtered)
    setCurrentPage(1)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const handleViewSub = (sub) => {
    setSelectedSub(sub)
    setShowViewModal(true)
  }

  const handleCancelSub = (sub) => {
    if (window.confirm(`Are you sure you want to cancel this subscription for ${sub.userName}?`)) {
      const userSubs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${sub.userId}`) || '[]')
      const updatedSubs = userSubs.map(s =>
        s.id === sub.id ? { ...s, status: 'cancelled' } : s
      )
      localStorage.setItem(`vayu_subscriptions_${sub.userId}`, JSON.stringify(updatedSubs))
      loadSubscriptions()
    }
  }

  // Calculate totals
  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.price || 0), 0)
  const activeCount = subscriptions.filter(s => s.status === 'active').length
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length

  // Pagination
  const totalPages = Math.ceil(filteredSubs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSubs = filteredSubs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Subscription Management">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard">
          <div className="statIcon blue">
            <CreditCard size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Subscriptions</div>
            <div className="statValue">{subscriptions.length}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon green">
            <CheckCircle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Active</div>
            <div className="statValue">{activeCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon orange">
            <Clock size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Expired</div>
            <div className="statValue">{expiredCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon purple">
            <CreditCard size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Revenue</div>
            <div className="statValue">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
      </div>

      <div className="adminCard">
        {/* Filters Bar */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search by user, plan or subscription ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="adminSelect"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="adminSelect"
            style={{ width: 'auto' }}
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="individual">Individual</option>
            <option value="family">Family</option>
          </select>

          <button className="adminBtn secondary">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table */}
        {filteredSubs.length === 0 ? (
          <div className="emptyState">
            <CreditCard size={48} />
            <h3>No Subscriptions Found</h3>
            <p>
              {searchQuery || statusFilter !== 'all' || planFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Subscriptions will appear here once purchased'
              }
            </p>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubs.map(sub => {
                  const daysRemaining = getDaysRemaining(sub.endDate)
                  return (
                    <tr key={sub.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                        {sub.id.slice(0, 12)}...
                      </td>
                      <td>
                        <div className="userCell">
                          <div className="userAvatar">
                            {sub.userName?.charAt(0) || 'U'}
                          </div>
                          <div className="userInfo">
                            <span className="userName">{sub.userName}</span>
                            <span className="userEmail">{sub.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`adminBadge ${sub.plan === 'family' ? 'info' : 'default'}`}>
                          {sub.planName}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(sub.price)}</td>
                      <td>{formatDate(sub.startDate)}</td>
                      <td>
                        <div>
                          {formatDate(sub.endDate)}
                          {sub.status === 'active' && daysRemaining <= 30 && daysRemaining > 0 && (
                            <div style={{ fontSize: 'var(--font-size-xs)', color: '#D97706' }}>
                              {daysRemaining} days left
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`adminBadge ${
                          sub.status === 'active' ? 'success' :
                          sub.status === 'expired' ? 'warning' : 'error'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <div className="actionsCell">
                          <button
                            className="actionBtn"
                            onClick={() => handleViewSub(sub)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {sub.status === 'active' && (
                            <button
                              className="actionBtn danger"
                              onClick={() => handleCancelSub(sub)}
                              title="Cancel Subscription"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <div className="paginationInfo">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubs.length)} of {filteredSubs.length} subscriptions
              </div>
              <div className="paginationButtons">
                <button
                  className="pageBtn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = totalPages <= 5 ? i + 1 :
                    currentPage <= 3 ? i + 1 :
                    currentPage >= totalPages - 2 ? totalPages - 4 + i :
                    currentPage - 2 + i
                  return (
                    <button
                      key={pageNum}
                      className={`pageBtn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  className="pageBtn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Subscription Modal */}
      {showViewModal && selectedSub && (
        <div className="adminModal" onClick={() => setShowViewModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">Subscription Details</h2>
              <button className="adminModalClose" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              {/* Status Banner */}
              <div style={{
                background: selectedSub.status === 'active' ? '#DCFCE7' :
                             selectedSub.status === 'expired' ? '#FEF3C7' : '#FEE2E2',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--spacing-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                {selectedSub.status === 'active' ? <CheckCircle size={20} color="#16A34A" /> :
                 selectedSub.status === 'expired' ? <Clock size={20} color="#D97706" /> :
                 <XCircle size={20} color="#DC2626" />}
                <span style={{
                  fontWeight: 600,
                  color: selectedSub.status === 'active' ? '#16A34A' :
                         selectedSub.status === 'expired' ? '#D97706' : '#DC2626',
                  textTransform: 'uppercase'
                }}>
                  {selectedSub.status}
                </span>
              </div>

              {/* User Info */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>User</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <div className="userAvatar">{selectedSub.userName?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{selectedSub.userName}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>{selectedSub.userEmail}</div>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Plan</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{selectedSub.planName}</div>
                </div>
                <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Amount</div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', color: 'var(--admin-primary)' }}>{formatCurrency(selectedSub.price)}</div>
                </div>
              </div>

              {/* Dates */}
              <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                  <Calendar size={18} color="var(--admin-text-muted)" />
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Start Date</div>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedSub.startDate)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <Calendar size={18} color="var(--admin-text-muted)" />
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>End Date</div>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedSub.endDate)}</div>
                  </div>
                </div>
              </div>

              {/* Subscription ID */}
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Subscription ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)', background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius)' }}>
                  {selectedSub.id}
                </div>
              </div>
            </div>
            <div className="adminModalFooter">
              <button className="adminBtn secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              {selectedSub.status === 'active' && (
                <button className="adminBtn primary" style={{ background: '#DC2626' }} onClick={() => {
                  handleCancelSub(selectedSub)
                  setShowViewModal(false)
                }}>
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
