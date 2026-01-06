import { useState, useEffect } from 'react'
import {
  Search,
  Download,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

export function PaymentsPage() {
  const [transactions, setTransactions] = useState([])
  const [filteredTrans, setFilteredTrans] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchQuery, dateRange, planFilter])

  const loadTransactions = () => {
    const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const allTransactions = []

    users.forEach(user => {
      const subs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')

      subs.forEach(sub => {
        // Create a transaction record for each subscription
        allTransactions.push({
          id: `txn_${sub.id}`,
          subscriptionId: sub.id,
          userId: user.id,
          userName: user.name || user.email,
          userEmail: user.email,
          planName: sub.planName,
          plan: sub.plan,
          amount: sub.price,
          gst: Math.round(sub.price * 0.18),
          totalAmount: Math.round(sub.price * 1.18),
          date: sub.startDate,
          status: 'completed', // All are completed in demo
          paymentMethod: 'UPI/Card'
        })
      })
    })

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    setTransactions(allTransactions)
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(trans =>
        trans.userName?.toLowerCase().includes(query) ||
        trans.userEmail?.toLowerCase().includes(query) ||
        trans.id?.toLowerCase().includes(query)
      )
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      let startDate

      if (dateRange === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0))
      } else if (dateRange === 'week') {
        startDate = new Date(now.setDate(now.getDate() - 7))
      } else if (dateRange === 'month') {
        startDate = new Date(now.setMonth(now.getMonth() - 1))
      } else if (dateRange === 'year') {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
      }

      if (startDate) {
        filtered = filtered.filter(trans => new Date(trans.date) >= startDate)
      }
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(trans => trans.plan === planFilter)
    }

    setFilteredTrans(filtered)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Calculate stats
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalGST = transactions.reduce((sum, t) => sum + t.gst, 0)
  const totalWithGST = transactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const individualRevenue = transactions.filter(t => t.plan === 'individual').reduce((sum, t) => sum + t.amount, 0)
  const familyRevenue = transactions.filter(t => t.plan === 'family').reduce((sum, t) => sum + t.amount, 0)

  // Monthly breakdown (last 6 months)
  const getMonthlyData = () => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' })
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
      })
      const revenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      months.push({ month: monthName, revenue, count: monthTransactions.length })
    }

    return months
  }

  const monthlyData = getMonthlyData()
  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.revenue), 1)

  // Pagination
  const totalPages = Math.ceil(filteredTrans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTrans = filteredTrans.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AdminLayout title="Payments & Revenue">
      {/* Stats */}
      <div className="statsGrid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="statCard">
          <div className="statIcon green">
            <Wallet size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Revenue</div>
            <div className="statValue">{formatCurrency(totalRevenue)}</div>
            <div className="statChange positive">
              <TrendingUp size={14} />
              <span>{transactions.length} transactions</span>
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon orange">
            <IndianRupee size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">GST Collected</div>
            <div className="statValue">{formatCurrency(totalGST)}</div>
            <div className="statChange">
              <span>18% on all plans</span>
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon blue">
            <CreditCard size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Collected</div>
            <div className="statValue">{formatCurrency(totalWithGST)}</div>
            <div className="statChange positive">
              <span>Including GST</span>
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon purple">
            <PieChart size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Avg Transaction</div>
            <div className="statValue">
              {transactions.length > 0 ? formatCurrency(totalRevenue / transactions.length) : '₹0'}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart & Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        {/* Monthly Chart */}
        <div className="adminCard">
          <div className="adminCardHeader">
            <h2 className="adminCardTitle">Monthly Revenue</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-md)', height: '200px', paddingTop: 'var(--spacing-lg)' }}>
            {monthlyData.map((month, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <div style={{
                  width: '100%',
                  height: `${Math.max((month.revenue / maxMonthlyRevenue) * 150, 10)}px`,
                  background: 'linear-gradient(180deg, var(--admin-primary) 0%, var(--admin-primary-light) 100%)',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    color: 'var(--admin-text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--admin-text-muted)' }}>{month.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Breakdown */}
        <div className="adminCard">
          <div className="adminCardHeader">
            <h2 className="adminCardTitle">Revenue by Plan</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Individual</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{formatCurrency(individualRevenue)}</span>
              </div>
              <div style={{ height: 8, background: 'var(--admin-bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${totalRevenue > 0 ? (individualRevenue / totalRevenue) * 100 : 0}%`,
                  background: '#3B82F6',
                  borderRadius: 'var(--radius-full)'
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Family</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{formatCurrency(familyRevenue)}</span>
              </div>
              <div style={{ height: 8, background: 'var(--admin-bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${totalRevenue > 0 ? (familyRevenue / totalRevenue) * 100 : 0}%`,
                  background: '#9333EA',
                  borderRadius: 'var(--radius-full)'
                }} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>Individual Plans</span>
                <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: '#3B82F6' }}>
                  {transactions.filter(t => t.plan === 'individual').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-sm)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>Family Plans</span>
                <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: '#9333EA' }}>
                  {transactions.filter(t => t.plan === 'family').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="adminCard">
        <div className="adminCardHeader">
          <h2 className="adminCardTitle">Transaction History</h2>
        </div>

        {/* Filters Bar */}
        <div className="filtersBar">
          <div className="searchWrapper" style={{ flex: 1, maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              className="adminInput"
              placeholder="Search by user or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="adminSelect"
            style={{ width: 'auto' }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
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
        {filteredTrans.length === 0 ? (
          <div className="emptyState">
            <Wallet size={48} />
            <h3>No Transactions Found</h3>
            <p>
              {searchQuery || dateRange !== 'all' || planFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Transactions will appear here once users purchase plans'
              }
            </p>
          </div>
        ) : (
          <>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>GST</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrans.map(trans => (
                  <tr key={trans.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                      {trans.id.slice(0, 16)}...
                    </td>
                    <td>
                      <div className="userCell">
                        <div className="userAvatar">
                          {trans.userName?.charAt(0) || 'U'}
                        </div>
                        <div className="userInfo">
                          <span className="userName">{trans.userName}</span>
                          <span className="userEmail">{trans.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adminBadge ${trans.plan === 'family' ? 'info' : 'default'}`}>
                        {trans.planName}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(trans.amount)}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{formatCurrency(trans.gst)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{formatCurrency(trans.totalAmount)}</td>
                    <td>{formatDate(trans.date)}</td>
                    <td>
                      <span className="adminBadge success">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <div className="paginationInfo">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTrans.length)} of {filteredTrans.length} transactions
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
    </AdminLayout>
  )
}
