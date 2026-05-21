"use client"

import { motion, type HTMLMotionProps, type Variants } from "framer-motion"
import { fadeUp } from "@/lib/motion"

type RevealProps = HTMLMotionProps<"div"> & {
  variants?: Variants
  delay?: number
}

export function Reveal({ variants = fadeUp, delay = 0, children, ...props }: RevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}
