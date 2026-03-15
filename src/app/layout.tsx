import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EV Charging Station Admin Dashboard',
  description: 'Smart Hybrid Solar-Grid EV Battery Charging and Swapping Station Admin Dashboard',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" fill="%2300d4ff">⚡</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-gray-200">
        {children}
      </body>
    </html>
  )
}
