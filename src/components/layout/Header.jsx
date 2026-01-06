import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Menu, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

export function Header({ title, showBack = false, showMenu = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const isPublicPage = location.pathname.startsWith('/profile/')

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.iconButton} onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
        )}
      </div>

      <div className={styles.center}>
        {title ? (
          <h1 className={styles.title}>{title}</h1>
        ) : (
          <div className={styles.logo}>
            <img src="/vayu-logo.svg" alt="Vayu" className={styles.logoImage} />
            <span className={styles.logoText}>Vayu</span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        {showMenu && user && !isPublicPage && (
          <div className={styles.menuWrapper}>
            <button
              className={styles.iconButton}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={24} />
            </button>

            {menuOpen && (
              <>
                <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.dropdown}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <div>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.userPhone}>{user.phone}</p>
                    </div>
                  </div>
                  <div className={styles.divider} />
                  <button className={styles.menuItem} onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
