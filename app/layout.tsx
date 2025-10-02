import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kaiz La | Global Sourcing Made Simple",
  description:
    "Kaiz La is a sourcing-as-a-service company based in China with 15+ years of expertise. We connect businesses across India and the Middle East with vetted Chinese suppliers, offering end-to-end procurement—supplier discovery, negotiations, quality checks, logistics, and customs clearance. Empowering global trade with seamless sourcing solutions.",
  keywords: [
    "Kaiz La",
    "global sourcing",
    "China sourcing company",
    "supplier management",
    "product sourcing",
    "procurement services",
    "import from China",
    "India China trade",
    "Middle East sourcing",
  ],
  openGraph: {
    title: "Kaiz La | Empowering Global Trade",
    description:
      "Simplifying global trade with end-to-end sourcing solutions. Trusted by businesses for supplier discovery, negotiations, quality checks, logistics, and customs clearance.",
    url: "https://kaizla.com", 
    siteName: "Kaiz La",
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
