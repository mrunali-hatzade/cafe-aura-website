"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const categories = ["All", "Coffee", "Pastries", "Breakfast", "Lunch"]

const menuItems = [
  {
    id: 1,
    name: "Signature Espresso",
    description: "Rich, bold espresso with notes of dark chocolate and caramel",
    price: "₹375",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Vanilla Oat Latte",
    description: "Smooth espresso with creamy oat milk and vanilla",
    price: "₹460",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Cold Brew",
    description: "24-hour steeped cold brew, smooth and refreshing",
    price: "₹335",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Butter Croissant",
    description: "Flaky, golden croissant baked fresh every morning",
    price: "₹290",
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Almond Danish",
    description: "Sweet pastry filled with almond cream and topped with sliced almonds",
    price: "₹335",
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Cinnamon Roll",
    description: "Warm, soft roll with cinnamon swirl and cream cheese glaze",
    price: "₹375",
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough with cherry tomatoes and microgreens",
    price: "₹750",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Eggs Benedict",
    description: "Poached eggs with hollandaise on English muffin",
    price: "₹999",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Grain Bowl",
    description: "Quinoa, roasted vegetables, hummus, and tahini dressing",
    price: "₹1,085",
    category: "Lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
  },
]

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <section id="menu" className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Our Offerings
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Menu
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Fresh ingredients, artisan preparation, and recipes crafted with love.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <span className="text-primary font-bold text-lg">
                    {item.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
