import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('vayu_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const sendOtp = async (phoneNumber) => {
    // Simulate OTP sending - In production, this would call your backend
    console.log(`Sending OTP to ${phoneNumber}`)
    // Store phone for verification
    sessionStorage.setItem('pending_phone', phoneNumber)
    return { success: true }
  }

  const verifyOtp = async (otp) => {
    // Simulate OTP verification - In production, this would call your backend
    const phoneNumber = sessionStorage.getItem('pending_phone')

    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('vayu_users') || '[]')
      const existingUser = existingUsers.find(u => u.phone === phoneNumber)

      if (existingUser) {
        setUser(existingUser)
        localStorage.setItem('vayu_user', JSON.stringify(existingUser))
        sessionStorage.removeItem('pending_phone')
        return { success: true, isNewUser: false }
      }

      return { success: true, isNewUser: true, phone: phoneNumber }
    }

    return { success: false, error: 'Invalid OTP' }
  }

  const register = async (userData) => {
    const phoneNumber = sessionStorage.getItem('pending_phone')

    const newUser = {
      id: `user_${Date.now()}`,
      udc: `UDC${Date.now().toString(36).toUpperCase()}`, // Unique Database Code
      phone: phoneNumber,
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString()
    }

    // Store in "database"
    const existingUsers = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    existingUsers.push(newUser)
    localStorage.setItem('vayu_users', JSON.stringify(existingUsers))

    // Set current user
    setUser(newUser)
    localStorage.setItem('vayu_user', JSON.stringify(newUser))
    sessionStorage.removeItem('pending_phone')

    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vayu_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('vayu_user', JSON.stringify(updatedUser))

    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem('vayu_users') || '[]')
    const index = existingUsers.findIndex(u => u.id === user.id)
    if (index !== -1) {
      existingUsers[index] = updatedUser
      localStorage.setItem('vayu_users', JSON.stringify(existingUsers))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      sendOtp,
      verifyOtp,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
