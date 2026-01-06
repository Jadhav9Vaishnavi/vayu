import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCog,
  CreditCard,
  Watch,
  Wallet,
  FileText,
  HelpCircle,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronLeft,
  Search,
  BarChart3
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import '../admin.css'

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' }
    ]
  },
  {
    title: 'Management',
    items: [
      { path: '/admin/users', icon: Users, label: 'Users' },
      { path: '/admin/family-members', icon: UserCog, label: 'Family Members' },
      { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { path: '/admin/bands', icon: Watch, label: 'Wrist Bands' },
      { path: '/admin/payments', icon: Wallet, label: 'Payments & Revenue' }
    ]
  },
  {
    title: 'Content',
    items: [
      { path: '/admin/content', icon: FileText, label: 'Content Management' },
      { path: '/admin/support', icon: HelpCircle, label: 'Support Tickets' },
      { path: '/admin/notifications', icon: Bell, label: 'Push Notifications' }
    ]
  }
]

export function AdminLayout({ children, title }) {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="adminLayout">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebarOverlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`adminSidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebarHeader">
          <div className="sidebarLogo">
            <Watch size={28} />
            <span className="sidebarLogoText">Vayu Admin</span>
          </div>
          <button
            className="menuToggle"
            onClick={() => setMobileOpen(false)}
            style={{ display: mobileOpen ? 'flex' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebarNav">
          {navSections.map((section, idx) => (
            <div key={idx} className="navSection">
              <div className="navSectionTitle">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="navItemText">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebarFooter">
          <button className="navItem" onClick={handleLogout}>
            <LogOut size={20} />
            <span className="navItemText">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adminMain">
        {/* Header */}
        <header className="adminHeader">
          <div className="headerLeft">
            <button
              className="menuToggle"
              onClick={() => {
                if (window.innerWidth <= 1024) {
                  setMobileOpen(!mobileOpen)
                } else {
                  setSidebarOpen(!sidebarOpen)
                }
              }}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="pageTitle">{title}</h1>
          </div>

          <div className="headerRight">
            <button className="headerAction">
              <Search size={20} />
            </button>
            <button className="headerAction">
              <Bell size={20} />
              <span className="notificationBadge" />
            </button>
            <button className="headerAction">
              <Settings size={20} />
            </button>
            <div className="adminProfile">
              <div className="profileAvatar">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="profileInfo">
                <div className="profileName">{admin?.name || 'Admin'}</div>
                <div className="profileRole">{admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="adminContent">
          {children}
        </div>
      </main>
    </div>
  )
}
