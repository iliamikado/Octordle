import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MainLayout } from '@/components/MainLayout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Осьминогль. Octordle на русском языке',
  description: 'Отгадай все слова за 14 попыток. Новые слова каждый день.',
  robots: 'index'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
            <MainLayout>
              {children}
            </MainLayout>
        </body>
      </html>
  )
}
