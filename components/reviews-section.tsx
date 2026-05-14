"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    review: "Absolutely love this place! The coffee is exceptional and the ambiance is so cozy. Perfect spot to work or catch up with friends.",
    date: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 5,
    review: "Best avocado toast in the city! The staff is super friendly and the cold brew is perfectly smooth. My new favorite cafe.",
    date: "1 month ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Ananya Patel",
    rating: 5,
    review: "The cinnamon rolls here are to die for! Fresh, warm, and absolutely delicious. I come here every weekend now.",
    date: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 4,
    review: "Great atmosphere for meetings. The grain bowl is healthy and filling. WiFi is fast and reliable. Highly recommend!",
    date: "1 week ago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Neha Gupta",
    rating: 5,
    review: "Demo Café has become my happy place. The vanilla oat latte is perfect, and the pastries are always fresh. Love it here!",
    date: "5 days ago",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Arjun Reddy",
    rating: 5,
    review: "Finally a cafe that gets it right! Amazing coffee, beautiful interiors, and the eggs benedict is restaurant quality.",
    date: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-accent text-accent" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            {"Don't just take our word for it. Here's what our beloved customers have to say about their experience at Demo Café."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="bg-card border-border hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">
                  {`"${review.review}"`}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-muted-foreground text-sm">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full border border-border">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-foreground font-semibold">4.9</span>
            <span className="text-muted-foreground">average rating from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
