import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Construction Material Inventory Tracking System',
  description: 'Inventory Workflow By TomeBlock',
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