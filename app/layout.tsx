import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'Webhookly - Domine Seus Webhooks com Facilidade.',
  description: 'O Webhookly é o proxy inteligente que captura, registra e permite o reenvio de cada webhook, garantindo controle total e visibilidade sobre suas integrações.',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics></Analytics>
      <SpeedInsights></SpeedInsights>
    </html>
  )
}
