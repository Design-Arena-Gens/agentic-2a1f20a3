import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Construction Expense Manager',
  description: 'Track and manage construction project expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
