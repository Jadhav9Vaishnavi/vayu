import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Bell,
  Send,
  Clock,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Trash2,
  Calendar,
  Target
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Welcome to Vayu!',
    message: 'Thank you for joining Vayu. Complete your profile and register your first band to get started.',
    type: 'welcome',
    target: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 45,
    opened: 38
  },
  {
    id: 'notif_2',
    title: 'New Family Plan Available',
    message: 'Upgrade to our Family Plan and protect up to 4 family members. Limited time offer - 40% off!',
    type: 'promotion',
    target: 'individual_users',
    status: 'sent',
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 28,
    opened: 15
  },
  {
    id: 'notif_3',
    title: 'Subscription Expiring Soon',
    message: 'Your Vayu subscription expires in 7 days. Renew now to continue protecting your family.',
    type: 'reminder',
    target: 'expiring_soon',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    recipients: 12
  }
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifs, setFilteredNotifs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    target: 'all',
    scheduleType: 'now',
    scheduledFor: ''
  })

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchQuery, statusFilter])

  const loadNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('vayu_notifications') || 'null')
    setNotifications(stored || DEMO_NOTIFICATIONS)

    if (!stored) {
      localStorage.setItem('vayu_notifications', JSON.stringify(DEMO_NOTIFICATIONS))
    }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(notif =>
        notif.title?.toLowerCase().includes(query) ||
        notif.message?.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(notif => notif.status === statusFilter)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.sentAt || a.scheduledFor)
      const dateB = new Date(b.sentAt || b.scheduledFor)
      return dateB - dateA
    })

    setFilteredNotifs(filtered)
    setCurrentPage(1)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTargetLabel = (target) => {
    const labels = {
      'all': 'All Users',
      'individual_users': 'Individual Plan Users',
      'family_users': 'Family Plan Users',
      'no_subscription': 'Users without Subscription',
      'expiring_soon': 'Expiring Subscriptions',
      'inactive': 'Inactive Users'
    }
    return labels[target] || target
  }

  const getTypeColor = (type) => {
    const colors = {
      'welcome': 'success',
      'promotion': 'info',
      'reminder': 'warning',
      'alert': 'error',
      'general': 'default'
    }
    return colors[type] || 'default'
  }

  const handleCreateNotification = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in title and message')
      return
    }

    // Get estimated recipients
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    let recipientCount = users.length

    const newNotif = {
      id: `notif_${Date.now()}`,
      title: formData.title,
      message: formData.message,
      type: formData.type,
      target: formData.target,
      status: formData.scheduleType === 'now' ? 'sent' : 'scheduled',
      sentAt: formData.scheduleType === 'now' ? new Date().toISOString() : null,
      scheduledFor: formData.scheduleType === 'later' ? formData.scheduledFor : null,
      recipients: recipientCount,
      opened: 0
    }

    const updated = [newNotif, ...notifications]
    setNotifications(updated)
    localStorage.setItem('vayu_notifications', JSON.stringify(updated))

    setFormData({
      title: '',
      message: '',
      type: 'general',
      target: 'all',
      scheduleType: 'now',
      scheduledFor: ''
    })
    setShowCreateModal(false)
  }

  const handleDeleteNotification = (notifId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return

    const updated = notifications.filter(n => n.id !== notifId)
    setNotifications(updated)
    localStorage.setItem('vayu_notifications', JSON.stringify(updated))
  }

  const handlePreview = (notif) => {
    setSelectedNotif(notif)
    setShowPreviewModal(true)
  }

  // Stats
  const sentCount = notifications.filter(n => n.status === 'sent').length
  const scheduledCount = notifications.filter(n => n.status === 'scheduled').length
  const totalRecipients = notifications.reduce((sum, n) => sum + (n.recipients || 0), 0)
  const totalOpened = notifications.reduce((sum, n) => sum + (n.opened || 0), 0)

  // Pagination
  const totalPages = Math.ceil(filteredNotifs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifs = filteredNotifs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Push Notifications">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard">
          <div className="statIcon green">
            <CheckCircle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Sent</div>
            <div className="statValue">{sentCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon orange">
            <Clock size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Scheduled</div>
            <div className="statValue">{scheduledCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon blue">
            <Users size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Recipients</div>
            <div className="statValue">{totalRecipients}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon purple">
            <Eye size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Open Rate</div>
            <div className="statValue">
              {totalRecipients > 0 ? Math.round((totalOpened / totalRecipients) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="adminCard">
        {/* Filters */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search notifications..."
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
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>

          <button className="adminBtn primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Create Notification
          </button>
        </div>

        {/* Notifications Table */}
        {filteredNotifs.length === 0 ? (
          <div className="emptyState">
            <Bell size={48} />
            <h3>No Notifications Found</h3>
            <p>Create your first push notification</p>
            <button className="adminBtn primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create Notification
            </button>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Notification</th>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotifs.map(notif => (
                  <tr key={notif.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>{notif.title}</div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--admin-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '250px'
                        }}>
                          {notif.message}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adminBadge ${getTypeColor(notif.type)}`} style={{ textTransform: 'capitalize' }}>
                        {notif.type}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Target size={14} />
                        <span style={{ fontSize: 'var(--font-size-sm)' }}>{getTargetLabel(notif.target)}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{notif.recipients || 0}</div>
                        {notif.status === 'sent' && notif.opened !== undefined && (
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                            {notif.opened} opened ({Math.round((notif.opened / notif.recipients) * 100)}%)
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`adminBadge ${notif.status === 'sent' ? 'success' : 'warning'}`}>
                        {notif.status === 'sent' ? (
                          <><CheckCircle size={12} /> Sent</>
                        ) : (
                          <><Clock size={12} /> Scheduled</>
                        )}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(notif.sentAt || notif.scheduledFor)}</div>
                        {notif.status === 'scheduled' && (
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                            Scheduled
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actionsCell">
                        <button
                          className="actionBtn"
                          onClick={() => handlePreview(notif)}
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="actionBtn danger"
                          onClick={() => handleDeleteNotification(notif.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <div className="paginationInfo">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredNotifs.length)} of {filteredNotifs.length}
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

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="adminModal" onClick={() => setShowCreateModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">Create Push Notification</h2>
              <button className="adminModalClose" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              <div className="adminFormGroup">
                <label className="adminLabel">Title</label>
                <input
                  type="text"
                  className="adminInput"
                  placeholder="Notification title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="adminFormGroup">
                <label className="adminLabel">Message</label>
                <textarea
                  className="adminTextarea"
                  placeholder="Notification message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div className="adminFormGroup">
                  <label className="adminLabel">Type</label>
                  <select
                    className="adminSelect"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="welcome">Welcome</option>
                    <option value="promotion">Promotion</option>
                    <option value="reminder">Reminder</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>

                <div className="adminFormGroup">
                  <label className="adminLabel">Target Audience</label>
                  <select
                    className="adminSelect"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  >
                    <option value="all">All Users</option>
                    <option value="individual_users">Individual Plan Users</option>
                    <option value="family_users">Family Plan Users</option>
                    <option value="no_subscription">No Subscription</option>
                    <option value="expiring_soon">Expiring Soon</option>
                    <option value="inactive">Inactive Users</option>
                  </select>
                </div>
              </div>

              <div className="adminFormGroup">
                <label className="adminLabel">When to Send</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={formData.scheduleType === 'now'}
                      onChange={() => setFormData({ ...formData, scheduleType: 'now' })}
                    />
                    Send Now
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={formData.scheduleType === 'later'}
                      onChange={() => setFormData({ ...formData, scheduleType: 'later' })}
                    />
                    Schedule for Later
                  </label>
                </div>
              </div>

              {formData.scheduleType === 'later' && (
                <div className="adminFormGroup">
                  <label className="adminLabel">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    className="adminInput"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>
            <div className="adminModalFooter">
              <button className="adminBtn secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="adminBtn primary" onClick={handleCreateNotification}>
                <Send size={16} />
                {formData.scheduleType === 'now' ? 'Send Now' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedNotif && (
        <div className="adminModal" onClick={() => setShowPreviewModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">Notification Preview</h2>
              <button className="adminModalClose" onClick={() => setShowPreviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              {/* Phone mockup */}
              <div style={{
                background: '#1a1a1a',
                borderRadius: '24px',
                padding: 'var(--spacing-md)',
                margin: '0 auto',
                maxWidth: '300px'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: 'var(--spacing-md)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)'
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'var(--admin-primary)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Bell size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      {selectedNotif.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-secondary)', lineHeight: 1.4 }}>
                      {selectedNotif.message}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginTop: 'var(--spacing-sm)' }}>
                      Now
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {selectedNotif.status === 'sent' && (
                <div style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--admin-primary)' }}>
                      {selectedNotif.recipients}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Recipients</div>
                  </div>
                  <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#16A34A' }}>
                      {selectedNotif.opened}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Opened</div>
                  </div>
                </div>
              )}
            </div>
            <div className="adminModalFooter">
              <button className="adminBtn secondary" onClick={() => setShowPreviewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
