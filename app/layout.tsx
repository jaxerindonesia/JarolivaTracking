import '../src/styles/index.css'
import { AuthProvider } from '../src/context/AuthContext'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'JAXLAB+ Member Area',
  description: 'Kelola program FF72 dan pantau perkembangan Anda.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
