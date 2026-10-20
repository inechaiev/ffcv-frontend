import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Inter, Poppins } from 'next/font/google'
import { GoogleAnalytics } from '@/components/google-analytics'
import { siteUrl } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JSBK4GSLMZ'
const googleAnalyticsId = /^G-[A-Z0-9]+$/.test(gaMeasurementId) ? gaMeasurementId : null

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MatchVLC | Resultados y Horarios del Fútbol Valenciano',
    template: '%s | MatchVLC',
  },
  description:
    'Resultados, horarios y jornadas de las ligas de la Comunitat Valenciana. Busca tu equipo y competición en MatchVLC.',
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#141f52',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {googleAnalyticsId ? (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={googleAnalyticsId} />
          </Suspense>
        ) : null}
      </body>
    </html>
  )
}
