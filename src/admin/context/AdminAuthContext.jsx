import { createContext, useContext, useState, useEffect } from 'react'
import { initializeDummyData } from '../dummyData'

const AdminAuthContext = createContext(null)

// Initialize default admin account
const initAdminAccount = () => {
  const defaultAdmin = {
    id: 'admin_1',
    email: 'admin@vayutechin.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: new Date().toISOString()
  }
  // Always ensure the default admin exists with correct credentials
  const existing = localStorage.getItem('vayu_admin_accounts')
  if (existing) {
    const accounts = JSON.parse(existing)
    const adminIndex = accounts.findIndex(a => a.id === 'admin_1')
    if (adminIndex >= 0) {
      accounts[adminIndex] = { ...accounts[adminIndex], email: defaultAdmin.email, password: defaultAdmin.password }
    } else {
      accounts.push(defaultAdmin)
    }
    localStorage.setItem('vayu_admin_accounts', JSON.stringify(accounts))
  } else {
    localStorage.setItem('vayu_admin_accounts', JSON.stringify([defaultAdmin]))
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initAdminAccount()
    // Initialize dummy data for demo purposes
    // TODO: Remove this line when connecting to backend
    initializeDummyData()
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    const storedAdmin = localStorage.getItem('vayu_admin_session')
    if (storedAdmin) {
      const adminData = JSON.parse(storedAdmin)
      // Verify session is still valid (24 hours)
      const sessionAge = Date.now() - new Date(adminData.loginAt).getTime()
      if (sessionAge < 24 * 60 * 60 * 1000) {
        setAdmin(adminData)
      } else {
        localStorage.removeItem('vayu_admin_session')
      }
    }
    setIsLoading(false)
  }

  const login = async (email, password) => {
    const accounts = JSON.parse(localStorage.getItem('vayu_admin_accounts') || '[]')
    const account = accounts.find(a => a.email === email && a.password === password)

    if (!account) {
      return { success: false, error: 'Invalid email or password' }
    }

    const sessionData = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      loginAt: new Date().toISOString()
    }

    localStorage.setItem('vayu_admin_session', JSON.stringify(sessionData))
    setAdmin(sessionData)

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('vayu_admin_session')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isAuthenticated: !!admin,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
