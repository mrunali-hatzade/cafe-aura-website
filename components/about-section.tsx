"use client"

import { motion } from "framer-motion"
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/motion"

const images = [
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=700&auto=format&fit=crop",
    alt: "Coffee being poured",
    className: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=700&auto=format&fit=crop",
    alt: "Cafe interior",
    className: "aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=700&auto=format&fit=crop",
    alt: "Barista at work",
    className: "aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=700&auto=format&fit=crop",
    alt: "Fresh pastries",
    className: "aspect-[3/4]",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="overflow-hidden bg-background/80 backdrop-blur-md py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              {images.slice(0, 2).map((image) => (
                <motion.div
                  key={image.alt}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`${image.className} group overflow-hidden rounded-3xl shadow-xl shadow-black/10`}
                >
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
            <div className="space-y-4 pt-8">
              {images.slice(2).map((image) => (
                <motion.div
                  key={image.alt}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`${image.className} group overflow-hidden rounded-3xl shadow-xl shadow-black/10`}
                >
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p variants={fadeUp} className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Our Story
            </motion.p>
            <motion.h2 variants={slideInRight} className="font-serif text-4xl font-bold text-foreground text-balance md:text-5xl">
              Dedicated to Quality, Community & Craft
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">
              <p>
                Demo Cafe was born from a simple passion: creating a space where exceptional coffee meets genuine hospitality.
              </p>
              <p>
                Our skilled baristas bring care to every drink, from precise espresso to seasonal specials.
              </p>
              <p>
                We are a gathering place for the community - a spot to connect, create, and recharge.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
