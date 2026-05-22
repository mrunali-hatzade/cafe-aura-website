import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Chatbot } from "@/components/chatbot"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AmbientBackground } from "@/components/ambient-background"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
})

const cafeName = process.env.NEXT_PUBLIC_CAFE_NAME || "Cafe Aura"

export const metadata: Metadata = {
  title: `${cafeName} | Artisan Coffee & Fresh Bites`,
  description:
    `Welcome to ${cafeName} - your neighborhood spot for artisan coffee, fresh pastries, and wholesome food. Visit us today!`,
  generator: "v0.app",
  icons: {
    icon: "/cafe.png",
    apple: "/cafe.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${playfair.variable} ${sourceSans.variable} font-sans antialiased`}>
        <AmbientBackground />
        {children}
        <Chatbot />
        <ScrollToTop />
        <Toaster />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
