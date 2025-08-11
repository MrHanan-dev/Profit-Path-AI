import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProfitPath - Hidden Cost & Revenue Leak Finder',
  description: 'AI-powered profit optimization tool that identifies hidden costs and revenue leaks in your business. Connect QuickBooks, Xero, Shopify, and Stripe to find profit opportunities.',
  keywords: 'profit optimization, cost analysis, revenue leaks, business analytics, QuickBooks, Xero, Shopify, Stripe',
  authors: [{ name: 'ProfitPath Team' }],
  openGraph: {
    title: 'ProfitPath - Hidden Cost & Revenue Leak Finder',
    description: 'AI-powered profit optimization tool that identifies hidden costs and revenue leaks in your business.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfitPath - Hidden Cost & Revenue Leak Finder',
    description: 'AI-powered profit optimization tool that identifies hidden costs and revenue leaks in your business.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  )
}
