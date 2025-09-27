"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isVisible: true,
    lastScrollY: 0
  })

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 10

      const scrollingDown = currentScrollY > scrollState.lastScrollY
      const scrollingUp = currentScrollY < scrollState.lastScrollY
      const significantScroll = Math.abs(currentScrollY - scrollState.lastScrollY) > scrollThreshold

      if (significantScroll) {
        const isScrolled = currentScrollY > scrollThreshold
        let isVisible = scrollState.isVisible

        if (currentScrollY <= 50) {
          isVisible = true
        }
        else if (currentScrollY > 50) {
          if (scrollingDown) {
            isVisible = false
          } else if (scrollingUp) {
            isVisible = true
          }
        }

        setScrollState({
          isScrolled,
          isVisible,
          lastScrollY: currentScrollY
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollState.lastScrollY, scrollState.isVisible])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 w-full
          transition-all duration-300 ease-in-out
          ${scrollState.isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
          }
          ${scrollState.isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">

            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center group"
                aria-label="Kaiz La Home"
              >
                <Image
                  src="/logo.png"
                  alt="Kaiz La Logo"
                  width={180}
                  height={100}
                  className="transition-transform duration-300 group-hover:scale-105 dark:filter dark:[filter:brightness(0)_invert(35%)_sepia(95%)_saturate(5000%)_hue-rotate(325deg)]"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    relative text-foreground hover:text-primary 
                    transition-colors duration-200 font-medium 
                    text-base xl:text-lg py-2 px-1
                    after:absolute after:bottom-0 after:left-0 after:w-0 
                    after:h-0.5 after:bg-primary after:transition-all after:duration-200
                    hover:after:w-full
                  "
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <Link
                href="/chat"
                className="
                  px-4 py-2 xl:px-5 xl:py-2.5
                  bg-secondary text-white rounded-lg 
                  hover:opacity-90 hover:shadow-md
                  transition-all duration-200 font-medium
                  text-sm xl:text-base
                  focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                "
              >
                Start Sourcing
              </Link>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="
                lg:hidden p-2 rounded-md text-foreground 
                hover:text-primary hover:bg-card/50 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center
                backdrop-blur-sm
              "
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />

        <div className={`
          fixed top-16 sm:top-18 lg:top-20 left-0 right-0 
          bg-card border-b border-border shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}
          max-h-[calc(100vh-4rem)] overflow-y-auto
        `}>
          <div className="container mx-auto px-4 py-6 sm:px-6 max-w-7xl">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMobileMenu}
                  className="
                    text-foreground hover:text-primary hover:bg-background/50
                    transition-colors duration-200 font-medium 
                    text-lg py-3 px-4 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  "
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-border mt-4">
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                 
                  <Link
                    href="/chat"
                    onClick={toggleMobileMenu}
                    className="
                      flex-1 px-4 py-3 bg-secondary text-white rounded-lg 
                      hover:opacity-90 hover:shadow-md
                      transition-all duration-200 font-medium text-center
                      focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                    "
                  >
                    Start Sourcing
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="h-16 sm:h-18 lg:h-20" aria-hidden="true" />
    </>
  )
}