export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=600&auto=format&fit=crop"
                  alt="Coffee being poured"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=600&auto=format&fit=crop"
                  alt="Cafe interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-lg overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop"
                  alt="Barista at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"
                  alt="Fresh pastries"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Our Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Dedicated to Quality, Community & Craft
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Demo Café was born from a simple passion: creating a space where exceptional coffee meets genuine hospitality. Since opening our doors, we&apos;ve been committed to sourcing the finest beans and crafting each cup with care.
              </p>
              <p>
                Our team of skilled baristas brings years of experience and a deep love for the craft. Every drink is prepared with precision, from our signature espresso to our seasonal specials.
              </p>
              <p>
                But we&apos;re more than just coffee. We&apos;re a gathering place for the community—a spot to connect, create, and recharge. Whether you&apos;re here for a quick morning pick-me-up or a leisurely afternoon, you&apos;re always welcome at Demo Café.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-border">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">10+</p>
                <p className="text-muted-foreground text-sm mt-1">Years of Service</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">50K+</p>
                <p className="text-muted-foreground text-sm mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">25+</p>
                <p className="text-muted-foreground text-sm mt-1">Menu Items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
