import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Watch,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Calendar
} from 'lucide-react'
import { AdminLayout } from '../components/AdminLayout'
import '../admin.css'

// Helper to get all data from localStorage
const getAdminStats = () => {
  // Get all users
  const users = JSON.parse(localStorage.getItem('vayu_users') || '[]')

  // Get all registered bands across all users
  const allBands = JSON.parse(localStorage.getItem('vayu_all_registered_bands') || '[]')

  // Calculate total members and subscriptions
  let totalMembers = 0
  let totalSubscriptions = 0
  let activeSubscriptions = 0
  let totalRevenue = 0

  const allSubscriptions = []
  const recentUsers = []

  users.forEach(user => {
    const members = JSON.parse(localStorage.getItem(`vayu_members_${user.id}`) || '[]')
    const subs = JSON.parse(localStorage.getItem(`vayu_subscriptions_${user.id}`) || '[]')

    totalMembers += members.length
    totalSubscriptions += subs.length
    activeSubscriptions += subs.filter(s => s.status === 'active').length

    subs.forEach(sub => {
      totalRevenue += sub.price || 0
      allSubscriptions.push({ ...sub, user })
    })

    recentUsers.push({
      ...user,
      memberCount: members.length,
      subscriptionCount: subs.filter(s => s.status === 'active').length
    })
  })

  // Sort by recent
  recentUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  allSubscriptions.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  return {
    totalUsers: users.length,
    totalMembers,
    totalBands: allBands.length,
    linkedBands: allBands.filter(b => b.memberId).length,
    totalSubscriptions,
    activeSubscriptions,
    totalRevenue,
    recentUsers: recentUsers.slice(0, 5),
    recentSubscriptions: allSubscriptions.slice(0, 5)
  }
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalBands: 0,
    linkedBands: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentSubscriptions: []
  })

  useEffect(() => {
    setStats(getAdminStats())
  }, [])

  const formatDate = (dateStr) => {
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

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="statsGrid">
        <div className="statCard">
          <div className="statIcon blue">
            <Users size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Total Users</div>
            <div className="statValue">{stats.totalUsers}</div>
            <div className="statChange positive">
              <TrendingUp size={14} />
              <span>Registered accounts</span>
            </div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon green">
            <UserCheck size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Family Members</div>
            <div className="statValue">{stats.totalMembers}</div>
            <div className="statChange positive">
              <TrendingUp size={14} />
              <span>Profiles created</span>
            </div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon purple">
            <Watch size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Registered Bands</div>
            <div className="statValue">{stats.totalBands}</div>
            <div className="statChange positive">
              <span>{stats.linkedBands} linked to members</span>
            </div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon orange">
            <CreditCard size={24} />
          </div>
          <div className="statInfo">
            <div className="statLabel">Active Subscriptions</div>
            <div className="statValue">{stats.activeSubscriptions}</div>
            <div className="statChange positive">
              <span>of {stats.totalSubscriptions} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="adminCard" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="adminCardHeader">
          <h2 className="adminCardTitle">Revenue Overview</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
          <div>
            <div className="statLabel">Total Revenue</div>
            <div className="statValue" style={{ fontSize: 'var(--font-size-3xl)' }}>
              {formatCurrency(stats.totalRevenue)}
            </div>
          </div>
          <div className="chartPlaceholder" style={{ flex: 1, height: '200px' }}>
            Revenue Chart (Integration Ready)
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Recent Users */}
        <div className="adminCard">
          <div className="adminCardHeader">
            <h2 className="adminCardTitle">Recent Users</h2>
            <button
              className="adminBtn secondary sm"
              onClick={() => navigate('/admin/users')}
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {stats.recentUsers.length === 0 ? (
            <div className="emptyState">
              <Users size={48} />
              <h3>No Users Yet</h3>
              <p>Users will appear here once they register</p>
            </div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Members</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map(user => (
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
                    <td>{user.memberCount}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        className="actionBtn"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Subscriptions */}
        <div className="adminCard">
          <div className="adminCardHeader">
            <h2 className="adminCardTitle">Latest Subscriptions</h2>
            <button
              className="adminBtn secondary sm"
              onClick={() => navigate('/admin/subscriptions')}
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {stats.recentSubscriptions.length === 0 ? (
            <div className="emptyState">
              <CreditCard size={48} />
              <h3>No Subscriptions Yet</h3>
              <p>Subscriptions will appear here once purchased</p>
            </div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSubscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <div className="userCell">
                        <div className="userAvatar">
                          {sub.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="userName">{sub.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>{sub.planName}</td>
                    <td>{formatCurrency(sub.price)}</td>
                    <td>
                      <span className={`adminBadge ${sub.status === 'active' ? 'success' : 'default'}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="adminCard" style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="adminCardHeader">
          <h2 className="adminCardTitle">Quick Stats</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--admin-primary)' }}>
              {stats.totalBands > 0 ? Math.round((stats.linkedBands / stats.totalBands) * 100) : 0}%
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
              Bands Linked
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#16A34A' }}>
              {stats.totalUsers > 0 ? (stats.totalMembers / stats.totalUsers).toFixed(1) : 0}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
              Avg Members/User
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#9333EA' }}>
              {stats.totalUsers > 0 ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100) : 0}%
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
              Conversion Rate
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', background: 'var(--admin-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#D97706' }}>
              {stats.activeSubscriptions > 0 ? formatCurrency(stats.totalRevenue / stats.activeSubscriptions) : '₹0'}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--admin-text-muted)' }}>
              Avg Revenue/Sub
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
