"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fadeUp, staggerContainer } from "@/lib/motion"

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    review: "Exceptional coffee and such a cozy ambiance. Perfect for work or catching up with friends.",
    date: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 5,
    review: "The cold brew is smooth, the avocado toast is perfect, and the team is always welcoming.",
    date: "1 month ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Ananya Patel",
    rating: 5,
    review: "The cinnamon rolls are fresh, warm, and absolutely delicious. My weekend ritual now.",
    date: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 4,
    review: "A beautiful atmosphere for meetings. Fast WiFi, great bowls, and lovely coffee.",
    date: "1 week ago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Neha Gupta",
    rating: 5,
    review: "Demo Cafe has become my happy place. The vanilla oat latte is always perfect.",
    date: "5 days ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const carouselReviews = [...reviews, ...reviews]

  return (
    <section id="reviews" className="overflow-hidden bg-secondary/40 backdrop-blur-md py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Testimonials
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 font-serif text-4xl font-bold text-foreground md:text-5xl">
            What Our Customers Say
          </motion.h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-secondary/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-secondary/50 to-transparent" />
        <motion.div
          className="flex w-max gap-6 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {carouselReviews.map((review, index) => (
            <motion.div key={`${review.id}-${index}`} whileHover={{ y: -8, scale: 1.02 }} className="w-[330px] shrink-0">
              <Card className="h-full rounded-3xl border-white/60 bg-card/85 shadow-lg shadow-black/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-primary/25" />
                  <p className="mb-6 leading-relaxed text-foreground">{`"${review.review}"`}</p>
                  <div className="flex items-center gap-4">
                    <img src={review.image} alt={review.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
