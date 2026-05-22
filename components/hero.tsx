"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"
import { ArrowRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotionButton } from "@/components/motion-wrapper"
import { fadeUp, staggerContainer } from "@/lib/motion"

export function Hero() {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 700], [0, 150])
  const cupY = useTransform(scrollY, [0, 700], [0, -90])

  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for transformations
  const springConfig = { damping: 28, stiffness: 90 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      // Normalize position to -0.5 to 0.5
      const xOffset = (clientX / innerWidth) - 0.5
      const yOffset = (clientY / innerHeight) - 0.5
      
      // Shift background up to 35px
      mouseX.set(xOffset * -35)
      mouseY.set(yOffset * -35)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Combine Scroll Parallax and Mouse Parallax for Background
  const backgroundTranslateX = x
  const backgroundTranslateY = useTransform(
    [y, backgroundY],
    ([latestY, latestScrollY]) => (latestY as number) + (latestScrollY as number)
  )

  // Subtle 3D tilts for Background
  const backgroundRotateX = useTransform(y, [-35, 35], [1.5, -1.5])
  const backgroundRotateY = useTransform(x, [-35, 35], [-1.5, 1.5])

  // Separate mouse shift for foreground Coffee Cup to create separation depth
  const cupMouseX = useTransform(x, (val) => -val * 0.45)
  const cupMouseY = useTransform(y, (val) => -val * 0.45)
  const cupYCombined = useTransform(
    [cupMouseY, cupY],
    ([latestMouseY, latestScrollY]) => (latestMouseY as number) + (latestScrollY as number)
  )

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#24160f]/45 pt-28" style={{ perspective: 1200 }}>
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          x: backgroundTranslateX,
          y: backgroundTranslateY,
          rotateX: backgroundRotateX,
          rotateY: backgroundRotateY,
          scale: 1.08,
          transformStyle: "preserve-3d",
          backgroundImage:
            "linear-gradient(90deg, rgba(24,14,9,0.88), rgba(24,14,9,0.6), rgba(24,14,9,0.25)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,151,85,0.25),transparent_34%),radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.16),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-center lg:text-left"
        >
          <motion.p variants={fadeUp} className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-white/75">
            Premium artisan cafe
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl font-bold leading-tight text-white text-balance md:text-7xl lg:text-8xl"
          >
            Coffee that feels crafted, calm, and unforgettable.
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl lg:mx-0">
            Slow-roasted beans, buttery pastries, warm interiors, and a table ready whenever your day needs a softer landing.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link href="#menu">
              <MotionButton>
                <Button size="lg" className="rounded-full bg-primary px-8 text-base text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 cursor-pointer">
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MotionButton>
            </Link>
            <Link href="/reservation">
              <MotionButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/70 bg-white/10 px-8 text-base text-white backdrop-blur-md hover:bg-white hover:text-foreground"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Reserve Table
                </Button>
              </MotionButton>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto hidden h-[520px] w-full max-w-md lg:block"
          style={{ x: cupMouseX, y: cupYCombined }}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <motion.div
            className="absolute inset-x-8 top-12 rounded-[2rem] border border-white/20 bg-white/12 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
              alt="Premium coffee cup"
              className="h-[430px] w-full rounded-[1.5rem] object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-0 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 text-white shadow-xl backdrop-blur-xl"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Today&apos;s blend</p>
            <p className="mt-1 font-serif text-2xl font-semibold">Caramel House Roast</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
