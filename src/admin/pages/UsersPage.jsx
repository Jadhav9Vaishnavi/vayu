import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  X,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

export function UsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, statusFilter])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('vayu_users') || '[]')

    // Enrich users with additional data
    const enrichedUsers = storedUsers.map(user => {
      const members = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
      const bands = JSON.parse(localStorage.getItem(`vayu_bands_${user.id}`) || '[]')
      const subs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')
      const activeSub = subs.find(s => s.status === 'active')

      return {
        ...user,
        memberCount: members.length,
        bandCount: bands.length,
        subscriptionStatus: activeSub ? 'active' : (subs.length > 0 ? 'expired' : 'none'),
        planName: activeSub?.planName || 'No Plan'
      }
    })

    setUsers(enrichedUsers)
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.subscriptionStatus === statusFilter)
    }

    setFilteredUsers(filtered)
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

  const handleViewUser = (user) => {
    // Load full user data
    const members = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
    const bands = JSON.parse(localStorage.getItem(`vayu_bands_${user.id}`) || '[]')
    const subs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')

    setSelectedUser({
      ...user,
      members,
      bands,
      subscriptions: subs
    })
    setShowViewModal(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // Remove user
      const updatedUsers = users.filter(u => u.id !== userId)
      localStorage.setItem('vayu_users', JSON.stringify(updatedUsers))

      // Remove user data
      localStorage.removeItem(`vayu_members_${userId}`)
      localStorage.removeItem(`vayu_bands_${userId}`)
      localStorage.removeItem(`vayu_subscriptions_${userId}`)

      loadUsers()
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="User Management">
      <div className="adminCard">
        {/* Filters Bar */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search by name, email or phone..."
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
            <option value="active">Active Subscription</option>
            <option value="expired">Expired</option>
            <option value="none">No Subscription</option>
          </select>

          <button className="adminBtn secondary">
            <Filter size={16} />
            More Filters
          </button>

          <button className="adminBtn secondary">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <div className="emptyState">
            <Users size={48} />
            <h3>No Users Found</h3>
            <p>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Users will appear here once they register'
              }
            </p>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Members</th>
                  <th>Bands</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="userCell">
                        <div className="userAvatar">
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div className="userInfo">
                          <span className="userName">{user.name || 'Unknown'}</span>
                          <span className="userEmail">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.memberCount}</td>
                    <td>{user.bandCount}</td>
                    <td>{user.planName}</td>
                    <td>
                      <span className={`adminBadge ${
                        user.subscriptionStatus === 'active' ? 'success' :
                        user.subscriptionStatus === 'expired' ? 'warning' : 'default'
                      }`}>
                        {user.subscriptionStatus === 'active' ? 'Active' :
                         user.subscriptionStatus === 'expired' ? 'Expired' : 'No Plan'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="actionsCell">
                        <button
                          className="actionBtn"
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="actionBtn danger"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
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

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="adminModal" onClick={() => setShowViewModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">User Details</h2>
              <button className="adminModalClose" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              {/* User Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="userAvatar" style={{ width: 64, height: 64, fontSize: 'var(--font-size-xl)' }}>
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{selectedUser.name || 'Unknown'}</h3>
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: 'var(--font-size-sm)' }}>{selectedUser.email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Phone</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Phone size={16} />
                    {selectedUser.phone || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Joined</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Calendar size={16} />
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--admin-primary)' }}>{selectedUser.members?.length || 0}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Family Members</div>
                </div>
                <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#9333EA' }}>{selectedUser.bands?.length || 0}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Registered Bands</div>
                </div>
                <div style={{ background: 'var(--admin-bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#16A34A' }}>{selectedUser.subscriptions?.filter(s => s.status === 'active').length || 0}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>Active Subs</div>
                </div>
              </div>

              {/* Family Members List */}
              {selectedUser.members?.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Family Members</h4>
                  <div style={{ background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {selectedUser.members.map((member, idx) => (
                      <div key={member.id} style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: idx < selectedUser.members.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{member.fullName}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                            {member.relationship} • {member.age} yrs • {member.bloodGroup}
                          </div>
                        </div>
                        <span className={`adminBadge ${member.bandId ? 'success' : 'default'}`}>
                          {member.bandId ? 'Band Linked' : 'No Band'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscriptions */}
              {selectedUser.subscriptions?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Subscriptions</h4>
                  <div style={{ background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {selectedUser.subscriptions.map((sub, idx) => (
                      <div key={sub.id} style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: idx < selectedUser.subscriptions.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{sub.planName}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                            ₹{sub.price} • {formatDate(sub.startDate)}
                          </div>
                        </div>
                        <span className={`adminBadge ${sub.status === 'active' ? 'success' : 'default'}`}>
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
