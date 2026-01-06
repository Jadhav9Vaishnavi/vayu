import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  User,
  Calendar,
  Tag
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

// Demo tickets
const DEMO_TICKETS = [
  {
    id: 'TKT-001',
    userId: 'user_1',
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    subject: 'Unable to link band to family member',
    description: 'I purchased the family plan and registered my band, but when I try to link it to my father\'s profile, it shows an error.',
    category: 'Technical',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [
      { id: 1, from: 'user', message: 'I purchased the family plan and registered my band, but when I try to link it to my father\'s profile, it shows an error.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'TKT-002',
    userId: 'user_2',
    userName: 'Priya Patel',
    userEmail: 'priya@example.com',
    subject: 'Subscription not reflecting after payment',
    description: 'I made a payment for the Individual plan but my subscription is still showing as inactive.',
    category: 'Billing',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Admin',
    messages: [
      { id: 1, from: 'user', message: 'I made a payment for the Individual plan but my subscription is still showing as inactive.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      { id: 2, from: 'admin', message: 'Hi Priya, we\'re looking into this. Can you please share your transaction ID?', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { id: 3, from: 'user', message: 'Transaction ID is TXN123456789', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'TKT-003',
    userId: 'user_3',
    userName: 'Amit Kumar',
    userEmail: 'amit@example.com',
    subject: 'How to update medical information?',
    description: 'I want to add a new allergy to my daughter\'s profile. How can I do this?',
    category: 'General',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    messages: [
      { id: 1, from: 'user', message: 'I want to add a new allergy to my daughter\'s profile. How can I do this?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: 2, from: 'admin', message: 'Go to Family > Select your daughter\'s profile > Edit > Medical Information > Add the allergy in the Allergies field.', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { id: 3, from: 'user', message: 'Thank you! That worked.', timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString() }
    ]
  }
]

export function SupportTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchQuery, statusFilter, priorityFilter])

  const loadTickets = () => {
    const stored = JSON.parse(localStorage.getItem('vayu_support_tickets') || 'null')
    setTickets(stored || DEMO_TICKETS)

    if (!stored) {
      localStorage.setItem('vayu_support_tickets', JSON.stringify(DEMO_TICKETS))
    }
  }

  const filterTickets = () => {
    let filtered = [...tickets]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(ticket =>
        ticket.subject?.toLowerCase().includes(query) ||
        ticket.userName?.toLowerCase().includes(query) ||
        ticket.id?.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    // Sort by newest first, then by priority
    filtered.sort((a, b) => {
      if (a.status === 'open' && b.status !== 'open') return -1
      if (b.status === 'open' && a.status !== 'open') return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    setFilteredTickets(filtered)
    setCurrentPage(1)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))} min ago`
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setReplyMessage('')
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return

    const newMessage = {
      id: Date.now(),
      from: 'admin',
      message: replyMessage,
      timestamp: new Date().toISOString()
    }

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          status: t.status === 'open' ? 'in_progress' : t.status
        }
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem('vayu_support_tickets', JSON.stringify(updatedTickets))

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      status: selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status
    })
    setReplyMessage('')
  }

  const handleUpdateStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus,
          resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : t.resolvedAt
        }
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem('vayu_support_tickets', JSON.stringify(updatedTickets))

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : selectedTicket.resolvedAt
      })
    }
  }

  // Stats
  const openCount = tickets.filter(t => t.status === 'open').length
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Support Tickets">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard">
          <div className="statIcon red">
            <AlertCircle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Open Tickets</div>
            <div className="statValue">{openCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon orange">
            <Clock size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">In Progress</div>
            <div className="statValue">{inProgressCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon green">
            <CheckCircle size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Resolved</div>
            <div className="statValue">{resolvedCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon blue">
            <MessageSquare size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Tickets</div>
            <div className="statValue">{tickets.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 400px' : '1fr', gap: 'var(--spacing-xl)' }}>
        {/* Tickets List */}
        <div className="adminCard">
          {/* Filters */}
          <div className="filtersBar">
            <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
              <Search size={18} />
              <input
                type="text"
                className="adminInput"
                placeholder="Search tickets..."
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="adminSelect"
              style={{ width: 'auto' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Tickets Table */}
          {filteredTickets.length === 0 ? (
            <div className="emptyState">
              <MessageSquare size={48} />
              <h3>No Tickets Found</h3>
              <p>Support tickets will appear here</p>
            </div>
          ) : (
            <>
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map(ticket => (
                    <tr
                      key={ticket.id}
                      onClick={() => handleViewTicket(ticket)}
                      style={{ cursor: 'pointer', background: selectedTicket?.id === ticket.id ? 'var(--admin-primary-light)' : undefined }}
                    >
                      <td>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>{ticket.subject}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>{ticket.id}</div>
                        </div>
                      </td>
                      <td>
                        <div className="userCell">
                          <div className="userAvatar">{ticket.userName?.charAt(0)}</div>
                          <div className="userInfo">
                            <span className="userName">{ticket.userName}</span>
                            <span className="userEmail">{ticket.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="adminBadge default">{ticket.category}</span>
                      </td>
                      <td>
                        <span className={`adminBadge ${
                          ticket.priority === 'high' ? 'error' :
                          ticket.priority === 'medium' ? 'warning' : 'success'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`adminBadge ${
                          ticket.status === 'open' ? 'error' :
                          ticket.status === 'in_progress' ? 'warning' : 'success'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{formatDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <div className="paginationInfo">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length}
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

        {/* Ticket Detail Panel */}
        {selectedTicket && (
          <div className="adminCard" style={{ position: 'sticky', top: 'calc(var(--admin-header-height) + var(--spacing-xl))', maxHeight: 'calc(100vh - var(--admin-header-height) - 2 * var(--spacing-xl))', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                  {selectedTicket.subject}
                </h3>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                  {selectedTicket.id}
                </div>
              </div>
              <button className="actionBtn" onClick={() => setSelectedTicket(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Ticket Info */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
              <span className={`adminBadge ${
                selectedTicket.status === 'open' ? 'error' :
                selectedTicket.status === 'in_progress' ? 'warning' : 'success'
              }`}>
                {selectedTicket.status.replace('_', ' ')}
              </span>
              <span className={`adminBadge ${
                selectedTicket.priority === 'high' ? 'error' :
                selectedTicket.priority === 'medium' ? 'warning' : 'success'
              }`}>
                {selectedTicket.priority} priority
              </span>
              <span className="adminBadge default">{selectedTicket.category}</span>
            </div>

            {/* Status Actions */}
            {selectedTicket.status !== 'resolved' && (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                {selectedTicket.status === 'open' && (
                  <button className="adminBtn secondary sm" onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}>
                    Mark In Progress
                  </button>
                )}
                <button className="adminBtn primary sm" onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}>
                  <CheckCircle size={14} />
                  Resolve
                </button>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', marginBottom: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {selectedTicket.messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    background: msg.from === 'admin' ? 'var(--admin-primary-light)' : 'var(--admin-bg-secondary)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius)',
                    alignSelf: msg.from === 'admin' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: msg.from === 'admin' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)' }}>
                      {msg.from === 'admin' ? 'Admin' : selectedTicket.userName}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>{msg.message}</div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedTicket.status !== 'resolved' && (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <input
                  type="text"
                  className="adminInput"
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <button className="adminBtn primary" onClick={handleSendReply}>
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
