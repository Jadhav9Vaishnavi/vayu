import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Trash2,
  Watch,
  ChevronLeft,
  ChevronRight,
  X,
  Link,
  Unlink,
  Package,
  CheckCircle
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

export function BandsManagementPage() {
  const [bands, setBands] = useState([])
  const [masterBands, setMasterBands] = useState([])
  const [filteredBands, setFilteredBands] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('registered')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBandSerial, setNewBandSerial] = useState('')
  const [newBandBUI, setNewBandBUI] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadBands()
  }, [])

  useEffect(() => {
    filterBands()
  }, [bands, masterBands, searchQuery, statusFilter, activeTab])

  const loadBands = () => {
    // Load registered bands
    const allRegistered = JSON.parse(localStorage.getItem('vayu_all_registered_bands') || '[]')

    // Enrich with user and member data
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const enrichedBands = allRegistered.map(band => {
      const user = users.find(u => u.id === band.userId)
      let member = null

      if (band.memberId && band.userId) {
        const userMembers = JSON.parse(localStorage.getItem(`vayu_members_${band.userId}`) || '[]')
        member = userMembers.find(m => m.id === band.memberId)
      }

      return {
        ...band,
        userName: user?.name || user?.email || 'Unknown',
        userEmail: user?.email,
        memberName: member?.fullName,
        memberRelation: member?.relationship
      }
    })

    setBands(enrichedBands)

    // Load master bands (inventory)
    const master = JSON.parse(localStorage.getItem('vayu_master_bands') || '[]')
    const registeredSerials = allRegistered.map(b => b.bs)
    const masterWithStatus = master.map(band => ({
      ...band,
      isRegistered: registeredSerials.includes(band.bs)
    }))
    setMasterBands(masterWithStatus)
  }

  const filterBands = () => {
    let filtered = activeTab === 'registered' ? [...bands] : [...masterBands]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(band =>
        band.bs?.toLowerCase().includes(query) ||
        band.bui?.toLowerCase().includes(query) ||
        band.userName?.toLowerCase().includes(query) ||
        band.memberName?.toLowerCase().includes(query)
      )
    }

    // Status filter for registered bands
    if (activeTab === 'registered' && statusFilter !== 'all') {
      if (statusFilter === 'linked') {
        filtered = filtered.filter(band => band.memberId)
      } else if (statusFilter === 'unlinked') {
        filtered = filtered.filter(band => !band.memberId)
      }
    }

    // Status filter for inventory
    if (activeTab === 'inventory' && statusFilter !== 'all') {
      if (statusFilter === 'available') {
        filtered = filtered.filter(band => !band.isRegistered)
      } else if (statusFilter === 'registered') {
        filtered = filtered.filter(band => band.isRegistered)
      }
    }

    setFilteredBands(filtered)
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

  const handleAddBand = () => {
    if (!newBandSerial.trim() || !newBandBUI.trim()) {
      alert('Please enter both serial number and BUI')
      return
    }

    const master = JSON.parse(localStorage.getItem('vayu_master_bands') || '[]')

    // Check if already exists
    if (master.find(b => b.bs === newBandSerial.toUpperCase() || b.bui === newBandBUI.toUpperCase())) {
      alert('A band with this serial number or BUI already exists')
      return
    }

    master.push({
      bs: newBandSerial.toUpperCase(),
      bui: newBandBUI.toUpperCase()
    })

    localStorage.setItem('vayu_master_bands', JSON.stringify(master))
    setNewBandSerial('')
    setNewBandBUI('')
    setShowAddModal(false)
    loadBands()
  }

  const handleDeleteBand = (band) => {
    if (activeTab === 'registered') {
      if (window.confirm(`Are you sure you want to unregister band ${band.bs}?`)) {
        // Remove from all registered bands
        const allRegistered = JSON.parse(localStorage.getItem('vayu_all_registered_bands') || '[]')
        const updated = allRegistered.filter(b => b.id !== band.id)
        localStorage.setItem('vayu_all_registered_bands', JSON.stringify(updated))

        // Remove from user's bands
        const userBands = JSON.parse(localStorage.getItem(`vayu_bands_${band.userId}`) || '[]')
        const updatedUserBands = userBands.filter(b => b.id !== band.id)
        localStorage.setItem(`vayu_bands_${band.userId}`, JSON.stringify(updatedUserBands))

        loadBands()
      }
    } else {
      if (window.confirm(`Are you sure you want to delete band ${band.bs} from inventory?`)) {
        const master = JSON.parse(localStorage.getItem('vayu_master_bands') || '[]')
        const updated = master.filter(b => b.bs !== band.bs)
        localStorage.setItem('vayu_master_bands', JSON.stringify(updated))
        loadBands()
      }
    }
  }

  // Stats
  const totalBands = masterBands.length
  const registeredCount = bands.length
  const linkedCount = bands.filter(b => b.memberId).length
  const availableCount = masterBands.filter(b => !b.isRegistered).length

  // Pagination
  const totalPages = Math.ceil(filteredBands.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBands = filteredBands.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Wrist Band Management">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard">
          <div className="statIcon purple">
            <Package size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Inventory</div>
            <div className="statValue">{totalBands}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon blue">
            <Watch size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Registered</div>
            <div className="statValue">{registeredCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon green">
            <Link size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Linked to Members</div>
            <div className="statValue">{linkedCount}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon orange">
            <Package size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Available</div>
            <div className="statValue">{availableCount}</div>
          </div>
        </div>
      </div>

      <div className="adminCard">
        {/* Tabs */}
        <div className="adminTabs">
          <button
            className={`adminTab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            Registered Bands ({registeredCount})
          </button>
          <button
            className={`adminTab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Band Inventory ({totalBands})
          </button>
        </div>

        {/* Filters Bar */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search by serial, BUI, user or member..."
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
            {activeTab === 'registered' ? (
              <>
                <option value="linked">Linked</option>
                <option value="unlinked">Unlinked</option>
              </>
            ) : (
              <>
                <option value="available">Available</option>
                <option value="registered">Registered</option>
              </>
            )}
          </select>

          {activeTab === 'inventory' && (
            <button className="adminBtn primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add Band
            </button>
          )}

          <button className="adminBtn secondary">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table */}
        {filteredBands.length === 0 ? (
          <div className="emptyState">
            <Watch size={48} />
            <h3>No Bands Found</h3>
            <p>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : activeTab === 'registered'
                  ? 'No bands have been registered by users yet'
                  : 'Add bands to your inventory'
              }
            </p>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Band UID</th>
                  {activeTab === 'registered' && (
                    <>
                      <th>User</th>
                      <th>Linked Member</th>
                      <th>Registered</th>
                    </>
                  )}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBands.map((band, idx) => (
                  <tr key={band.id || `${band.bs}-${idx}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Watch size={18} color="var(--admin-primary)" />
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{band.bs}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>
                      {band.bui}
                    </td>
                    {activeTab === 'registered' && (
                      <>
                        <td>
                          <div className="userCell">
                            <div className="userAvatar">
                              {band.userName?.charAt(0) || 'U'}
                            </div>
                            <div className="userInfo">
                              <span className="userName">{band.userName}</span>
                              <span className="userEmail">{band.userEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {band.memberName ? (
                            <div>
                              <div style={{ fontWeight: 500 }}>{band.memberName}</div>
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)', textTransform: 'capitalize' }}>
                                {band.memberRelation}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--admin-text-muted)' }}>Not linked</span>
                          )}
                        </td>
                        <td>{formatDate(band.registeredAt)}</td>
                      </>
                    )}
                    <td>
                      {activeTab === 'registered' ? (
                        <span className={`adminBadge ${band.memberId ? 'success' : 'warning'}`}>
                          {band.memberId ? (
                            <><Link size={12} /> Linked</>
                          ) : (
                            <><Unlink size={12} /> Unlinked</>
                          )}
                        </span>
                      ) : (
                        <span className={`adminBadge ${band.isRegistered ? 'info' : 'success'}`}>
                          {band.isRegistered ? 'Registered' : 'Available'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="actionsCell">
                        <button
                          className="actionBtn danger"
                          onClick={() => handleDeleteBand(band)}
                          title={activeTab === 'registered' ? 'Unregister Band' : 'Delete from Inventory'}
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBands.length)} of {filteredBands.length} bands
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

      {/* Add Band Modal */}
      {showAddModal && (
        <div className="adminModal" onClick={() => setShowAddModal(false)}>
          <div className="adminModalContent" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="adminModalHeader">
              <h2 className="adminModalTitle">Add Band to Inventory</h2>
              <button className="adminModalClose" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="adminModalBody">
              <div className="adminFormGroup">
                <label className="adminLabel">Band Serial Number (BS)</label>
                <input
                  type="text"
                  className="adminInput"
                  placeholder="e.g., VB001244"
                  value={newBandSerial}
                  onChange={(e) => setNewBandSerial(e.target.value.toUpperCase())}
                />
              </div>
              <div className="adminFormGroup">
                <label className="adminLabel">Band Unique Identifier (BUI)</label>
                <input
                  type="text"
                  className="adminInput"
                  placeholder="e.g., BUI-X1Y2Z3A4"
                  value={newBandBUI}
                  onChange={(e) => setNewBandBUI(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div className="adminModalFooter">
              <button className="adminBtn secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="adminBtn primary" onClick={handleAddBand}>
                <Plus size={16} />
                Add Band
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
