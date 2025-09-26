import './globals.css'
import AppShell from '@/components/AppShell'
import { CartProvider } from '@/context/CartContext'

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
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  )
}
