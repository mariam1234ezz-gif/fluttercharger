import Footer from "@/components/Footer";
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

        <div className="flex min-h-screen">

          <Navigation />

          {/* الجزء اليمين كله */}
          <div className="flex flex-col flex-1">

            <main className="flex-1 p-6">
              {children}
            </main>

            {/* 👇 الفوتر هنا */}
            <Footer />

          </div>

        </div>

      </body>
    </html>
  )
}