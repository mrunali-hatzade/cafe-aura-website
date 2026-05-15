"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: '100% 100%',
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">
          Welcome to
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-balance">
          Demo Café
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 text-pretty">
          Where every cup tells a story. Artisan coffee, fresh pastries, and a warm atmosphere await you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#menu">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
            >
              Explore Our Menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#contact">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-foreground text-base px-8"
            >
              Visit Us Today
            </Button>
          </Link>
        </div>


      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}



