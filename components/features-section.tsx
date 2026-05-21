"use client"

import { motion } from "framer-motion"
import { Coffee, Leaf, Clock, Users } from "lucide-react"
import { fadeUp, staggerContainer } from "@/lib/motion"

const features = [
  {
    icon: Coffee,
    title: "Artisan Coffee",
    description: "Single-origin beans roasted locally and brewed by trained baristas.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Seasonal produce, small-batch bakes, and thoughtful sourcing.",
  },
  {
    icon: Clock,
    title: "Open Early",
    description: "A warm start from 6 AM with breakfast, espresso, and quiet tables.",
  },
  {
    icon: Users,
    title: "Community Space",
    description: "Cozy seating, reliable WiFi, and a calm place to meet or work.",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-primary/90 backdrop-blur-md py-24 text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold md:text-5xl">
            Why Guests Stay Longer
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Every detail is tuned for comfort, flavor, and a calmer cafe rhythm.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-xl shadow-black/10 backdrop-blur-xl"
            >
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15"
                whileHover={{ rotate: 3, scale: 1.08 }}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="font-serif text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/72">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
