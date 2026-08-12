import Sidebar, { MobileBottomNav } from './Sidebar'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  )
}
