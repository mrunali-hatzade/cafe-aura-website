"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotionButton } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"
import { CAFE_NAME } from "@/lib/config"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/20 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl"
          : "border-transparent bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <motion.span
              className="font-serif text-2xl font-bold text-primary"
              whileHover={{ scale: 1.03 }}
            >
              {CAFE_NAME}
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="#menu">
              <Button variant="outline" className="rounded-full px-5 border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                Order Now
              </Button>
            </Link>
            <Link href="/reservation">
              <MotionButton>
                <Button className="rounded-full bg-primary px-5 text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 cursor-pointer">
                  Reserve a Table
                </Button>
              </MotionButton>
            </Link>
          </div>

          <motion.button
            className="rounded-full p-2 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.92 }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-4 px-4 py-5">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className="font-medium text-foreground/80 transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="#menu" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/5 cursor-pointer">
                  Order Now
                </Button>
              </Link>
              <Link href="/reservation" onClick={() => setIsMenuOpen(false)}>
                <Button className="mt-2 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  Reserve a Table
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
