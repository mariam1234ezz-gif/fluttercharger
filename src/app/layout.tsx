import './globals.css'
import Navigation from '@/components/Navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}