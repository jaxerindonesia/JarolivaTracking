import '../src/styles/index.css'
import { AuthProvider } from '../src/context/AuthContext'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'JAXLAB+ Member Area',
  description: 'Kelola program FF72 dan pantau perkembangan Anda.',
  icons: {
    icon: [{ url: '/favicon.png?v=20260820-2', type: 'image/png' }],
    shortcut: '/favicon.png?v=20260820-2',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
