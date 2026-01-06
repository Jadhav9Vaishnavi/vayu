import { Header } from './Header'
import { BottomNav } from './BottomNav'
import styles from './PageLayout.module.css'

export function PageLayout({
  children,
  title,
  showBack = false,
  showNav = true,
  showHeader = true,
  className = ''
}) {
  return (
    <div className={styles.layout}>
      {showHeader && <Header title={title} showBack={showBack} />}
      <main className={`${styles.main} ${showNav ? styles.withNav : ''} ${className}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}
