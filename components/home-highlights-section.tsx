"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BadgePercent, Coffee, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotionButton } from "@/components/motion-wrapper"
import { fadeUp, staggerContainer } from "@/lib/motion"

const offers = [
  { icon: Coffee, label: "Morning Ritual", value: "Coffee + croissant combo" },
  { icon: BadgePercent, label: "Weekend Offer", value: "15% off brunch plates" },
  { icon: Sparkles, label: "Seasonal Pour", value: "Caramel cold cream latte" },
]

const stats = [
  { value: "50K+", label: "Happy Guests" },
  { value: "25+", label: "Menu Favorites" },
  { value: "4.9", label: "Average Rating" },
  { value: "10+", label: "Years Brewing" },
]

export function HomeHighlightsSection() {
  return (
    <section className="relative overflow-hidden bg-background/80 backdrop-blur-md py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.label}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.01 }}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg shadow-black/5 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <offer.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{offer.label}</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-foreground">{offer.value}</h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-4 rounded-[2rem] border border-border/70 bg-secondary/70 p-5 shadow-xl shadow-black/5 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-3xl bg-background/70 p-6 text-center">
              <p className="font-serif text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/25 md:p-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Users className="h-4 w-4" />
                Limited evening tables available
              </div>
              <h2 className="font-serif text-3xl font-bold md:text-5xl">Reserve a warm seat before the rush.</h2>
              <p className="mt-4 max-w-2xl text-primary-foreground/80">
                Book brunch, a quiet work table, or a celebration corner in a few clicks.
              </p>
            </div>
            <Link href="/reservation">
              <MotionButton>
                <Button size="lg" className="rounded-full bg-white px-8 text-primary hover:bg-white/90">
                  Book a Table
                </Button>
              </MotionButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
