import { Coffee, Leaf, Clock, Users } from "lucide-react"

const features = [
  {
    icon: Coffee,
    title: "Artisan Coffee",
    description: "Single-origin beans roasted locally and brewed to perfection by our expert baristas.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Locally sourced, organic ingredients in all our food. Farm to table freshness daily.",
  },
  {
    icon: Clock,
    title: "Open Early",
    description: "We open at 6 AM so you can start your day right with great coffee and breakfast.",
  },
  {
    icon: Users,
    title: "Community Space",
    description: "Free WiFi, cozy seating, and a welcoming atmosphere for work or relaxation.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Why Choose Us
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Experience the difference that passion and quality make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6 group-hover:bg-primary-foreground/20 transition-colors">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
