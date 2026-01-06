import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  X,
  Droplet,
  AlertTriangle,
  Heart,
  Phone,
  MapPin,
  Watch
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

export function FamilyMembersPage() {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all')
  const [bandFilter, setBandFilter] = useState('all')
  const [selectedMember, setSelectedMember] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchQuery, bloodGroupFilter, bandFilter])

  const loadMembers = () => {
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const allMembers = []

    users.forEach(user => {
      const userMembers = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
      const userBands = JSON.parse(localStorage.getItem(`vayu_bands_${user.id}`) || '[]')

      userMembers.forEach(member => {
        const linkedBand = userBands.find(b => b.memberId === member.id)
        allMembers.push({
          ...member,
          userName: user.name || user.email,
          userId: user.id,
          linkedBand
        })
      })
    })

    setMembers(allMembers)
  }

  const filterMembers = () => {
    let filtered = [...members]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(member =>
        member.fullName?.toLowerCase().includes(query) ||
        member.userName?.toLowerCase().includes(query) ||
        member.allergies?.toLowerCase().includes(query) ||
        member.medicalCondition?.toLowerCase().includes(query)
      )
    }

    // Blood group filter
    if (bloodGroupFilter !== 'all') {
      filtered = filtered.filter(member => member.bloodGroup === bloodGroupFilter)
    }

    // Band filter
    if (bandFilter === 'linked') {
      filtered = filtered.filter(member => member.bandId)
    } else if (bandFilter === 'unlinked') {
      filtered = filtered.filter(member => !member.bandId)
    }

    setFilteredMembers(filtered)
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

  const handleViewMember = (member) => {
    setSelectedMember(member)
    setShowViewModal(true)
  }

  const handleDeleteMember = (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.fullName}?`)) {
      const userMembers = JSON.parse(localStorage.getItem(`vayu_members_${member.userId}`) || '[]')
      const updatedMembers = userMembers.filter(m => m.id !== member.id)
      localStorage.setItem(`vayu_members_${member.userId}`, JSON.stringify(updatedMembers))

      // Unlink band if any
      if (member.bandId) {
        const userBands = JSON.parse(localStorage.getItem(`vayu_bands_${member.userId}`) || '[]')
        const updatedBands = userBands.map(b =>
          b.id === member.bandId ? { ...b, memberId: null } : b
        )
        localStorage.setItem(`vayu_bands_${member.userId}`, JSON.stringify(updatedBands))
      }

      loadMembers()
    }
  }

  const getBloodGroupColor = (bg) => {
    const colors = {
      'A+': '#E74C3C', 'A-': '#E74C3C',
      'B+': '#3498DB', 'B-': '#3498DB',
      'AB+': '#9B59B6', 'AB-': '#9B59B6',
      'O+': '#27AE60', 'O-': '#27AE60'
    }
    return colors[bg] || '#64748B'
  }

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Family Members Management">
      <div className="adminCard">
        {/* Filters Bar */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search by name, conditions, allergies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="adminSelect"
            style={{ width: 'auto' }}
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
          >
            <option value="all">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <select
            className="adminSelect"
            style={{ width: 'auto' }}
            value={bandFilter}
            onChange={(e) => setBandFilter(e.target.value)}
          >
            <option value="all">All Members</option>
            <option value="linked">Band Linked</option>
            <option value="unlinked">No Band</option>
          </select>

          <button className="adminBtn secondary">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table */}
        {filteredMembers.length === 0 ? (
          <div className="emptyState">
            <UserCog size={48} />
            <h3>No Family Members Found</h3>
            <p>
              {searchQuery || bloodGroupFilter !== 'all' || bandFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Family members will appear here once users add them'
              }
            </p>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>User</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>Relation</th>
                  <th>Band Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="userCell">
                        <div className="userAvatar" style={{ background: getBloodGroupColor(member.bloodGroup) + '20', color: getBloodGroupColor(member.bloodGroup) }}>
                          {member.fullName?.charAt(0) || 'M'}
                        </div>
                        <div className="userInfo">
                          <span className="userName">{member.fullName}</span>
                          {(member.allergies || member.medicalCondition) && (
                            <span className="userEmail" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} color="#D97706" />
                              Has medical info
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{member.userName}</td>
                    <td>{member.age} yrs</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: getBloodGroupColor(member.bloodGroup),
                        fontWeight: 600
                      }}>
                        <Droplet size={14} />
                        {member.bloodGroup}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{member.relationship}</td>
                    <td>
                      <span className={`adminBadge ${member.bandId ? 'success' : 'default'}`}>
                        {member.bandId ? 'Linked' : 'Not Linked'}
                      </span>
                    </td>
                    <td>{formatDate(member.createdAt)}</td>
                    <td>
                      <div className="actionsCell">
                        <button
                          className="actionBtn"
                          onClick={() => handleViewMember(member)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="actionBtn danger"
                          onClick={() => handleDeleteMember(member)}
                          title="Delete Member"
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
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

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="adminModal" onClick={() => setShowViewModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">Member Details</h2>
              <button className="adminModalClose" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              {/* Member Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="userAvatar" style={{
                  width: 64,
                  height: 64,
                  fontSize: 'var(--font-size-xl)',
                  background: getBloodGroupColor(selectedMember.bloodGroup) + '20',
                  color: getBloodGroupColor(selectedMember.bloodGroup)
                }}>
                  {selectedMember.fullName?.charAt(0) || 'M'}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{selectedMember.fullName}</h3>
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {selectedMember.relationship} • {selectedMember.age} years old
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Droplet size={20} color={getBloodGroupColor(selectedMember.bloodGroup)} />
                  <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: getBloodGroupColor(selectedMember.bloodGroup) }}>
                    {selectedMember.bloodGroup}
                  </span>
                </div>
              </div>

              {/* Linked Band */}
              {selectedMember.linkedBand && (
                <div style={{
                  background: 'var(--admin-primary-light)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius)',
                  marginBottom: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)'
                }}>
                  <Watch size={24} color="var(--admin-primary)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>Band Linked</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-secondary)' }}>
                      Serial: {selectedMember.linkedBand.bs} • ID: {selectedMember.linkedBand.bui}
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Info */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Heart size={16} />
                  Medical Information
                </h4>
                <div style={{ background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)', padding: 'var(--spacing-md)' }}>
                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Allergies</div>
                    <div style={{ color: selectedMember.allergies ? '#D97706' : 'var(--admin-text-muted)' }}>
                      {selectedMember.allergies || 'None specified'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Medical Conditions</div>
                    <div style={{ color: selectedMember.medicalCondition ? '#DC2626' : 'var(--admin-text-muted)' }}>
                      {selectedMember.medicalCondition || 'None specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <MapPin size={16} />
                  Home Address
                </h4>
                <div style={{ background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)', padding: 'var(--spacing-md)' }}>
                  {selectedMember.homeAddress || 'Not specified'}
                </div>
              </div>

              {/* Emergency Contacts */}
              {selectedMember.emergencyContacts?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Phone size={16} />
                    Emergency Contacts
                  </h4>
                  <div style={{ background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {selectedMember.emergencyContacts.map((contact, idx) => (
                      <div key={idx} style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: idx < selectedMember.emergencyContacts.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{contact.name}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>
                            {contact.relation}
                          </div>
                        </div>
                        <a href={`tel:${contact.phone}`} style={{ color: 'var(--admin-primary)', fontWeight: 500 }}>
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Privacy Settings</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {Object.entries(selectedMember.privacySettings || {}).map(([key, value]) => (
                    <span
                      key={key}
                      className={`adminBadge ${value ? 'success' : 'default'}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}: {value ? 'Public' : 'Private'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
