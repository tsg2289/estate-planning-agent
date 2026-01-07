import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EstatePlan Pro - Secure Estate Planning',
  description: 'Professional estate planning with enterprise-grade security and SOC2 compliance',
  keywords: 'estate planning, wills, trusts, power of attorney, legal documents, secure',
  authors: [{ name: 'EstatePlan Pro' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}