import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata = {
  title: 'Smart EV Charging Dashboard',
  description: 'Admin dashboard for smart hybrid EV battery charging stations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}