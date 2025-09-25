import './globals.css'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'AutoFina',
  description: 'AutoFina Web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-white font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
