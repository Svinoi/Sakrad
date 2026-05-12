import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Säkrad',
  description: 'Arbetsmiljö & dokumentation för byggbranschen',
  manifest: '/manifest.json',
  themeColor: '#0F2240',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
