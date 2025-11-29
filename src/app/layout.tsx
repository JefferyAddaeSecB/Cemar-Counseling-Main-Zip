import React from "react"
import { cn } from "../lib/utils"
import { ThemeProvider } from "../components/theme-provider"
import Header from "../components/header"
import Footer from "../components/footer"
import { Toaster } from "../components/ui/toaster"
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-[#30D5C8]/5 font-sans antialiased")}>
        <ThemeProvider
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div vaul-drawer-wrapper="">
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 