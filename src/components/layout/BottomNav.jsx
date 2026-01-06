import { NavLink } from 'react-router-dom'
import { Home, Users, Watch } from 'lucide-react'
import styles from './BottomNav.module.css'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/family', icon: Users, label: 'Family' },
  { path: '/bands', icon: Watch, label: 'Bands' }
  // Phase 2/3: { path: '/subscription', icon: CreditCard, label: 'Plans' }
]

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={24} className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
