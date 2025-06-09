import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Life Calendar',
  description: 'Track your life, one block at a time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} font-sans`}>{children}</body>
    </html>
  )
}
