"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { CAFE_NAME } from "@/lib/config"

export function Footer() {
  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="bg-foreground py-16 text-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <span className="font-serif text-3xl font-bold">{CAFE_NAME}</span>
            </Link>
            <p className="mb-6 max-w-md text-background/70">
              Your neighborhood cafe serving artisan coffee, fresh pastries, and wholesome food since 2014.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  aria-label="Social link"
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-background/20"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ["#menu", "Menu"],
                ["#about", "About Us"],
                ["#reviews", "Reviews"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-background/70 transition-colors hover:text-background">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Hours</h4>
            <ul className="space-y-3 text-background/70">
              <li className="flex justify-between gap-6"><span>Mon - Fri</span><span>6am - 8pm</span></li>
              <li className="flex justify-between gap-6"><span>Saturday</span><span>7am - 9pm</span></li>
              <li className="flex justify-between gap-6"><span>Sunday</span><span>7am - 9pm</span></li>
            </ul>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <p className="text-sm text-background/50">© 2026 {CAFE_NAME}. All rights reserved.</p>
          <p className="text-sm text-background/50">
            Designed & Built by{" "}
            <a
              href="https://mrunali-hatzade.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background underline underline-offset-4 transition-colors"
            >
              Mrunali
            </a>
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="#" className="transition-colors hover:text-background">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-background">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
