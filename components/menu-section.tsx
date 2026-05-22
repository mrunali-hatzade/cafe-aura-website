"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { fadeUp, staggerContainer } from "@/lib/motion"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Lock,
  QrCode,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CAFE_NAME } from "@/lib/config"

const categories = ["All", "Coffee", "Pastries", "Breakfast", "Lunch"]

const menuItems = [
  {
    id: 1,
    name: "Signature Espresso",
    description: "Rich espresso with dark chocolate and caramel notes.",
    price: 375,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=700&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    name: "Vanilla Oat Latte",
    description: "Smooth espresso, creamy oat milk, and Madagascar vanilla.",
    price: 460,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=700&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 3,
    name: "Cold Brew",
    description: "24-hour steeped cold brew, clean, smooth, and refreshing.",
    price: 335,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Butter Croissant",
    description: "Flaky, golden croissant baked fresh every morning.",
    price: 290,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=700&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 5,
    name: "Almond Danish",
    description: "Sweet pastry filled with almond cream and sliced almonds.",
    price: 335,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Cinnamon Roll",
    description: "Warm cinnamon swirl with a soft cream cheese glaze.",
    price: 375,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Avocado Toast",
    description: "Sourdough, smashed avocado, cherry tomatoes, microgreens.",
    price: 750,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Eggs Benedict",
    description: "Poached eggs with hollandaise on a toasted English muffin.",
    price: 999,
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Grain Bowl",
    description: "Quinoa, roasted vegetables, hummus, and tahini dressing.",
    price: 1085,
    category: "Lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=700&auto=format&fit=crop",
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  
  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "payment">("cart")
  
  // Form values
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryType, setDeliveryType] = useState<"Dine-in" | "Takeaway" | "Delivery">("Dine-in")
  const [address, setAddress] = useState("") // Table number or Delivery address
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "COD">("UPI")
  
  // Card mock state
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  
  // Gateway and Place Order States
  const [gatewayStage, setGatewayStage] = useState<string | null>(null)
  const [showOrderInvoice, setShowOrderInvoice] = useState<any | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [simulationStatus, setSimulationStatus] = useState<"success" | "failed">("success")
  const [showFailedModal, setShowFailedModal] = useState(false)

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  // Cart operations
  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
    toast.success(`${item.name} added to your order!`, {
      description: "Click the floating bag icon at the bottom right to view your order.",
      duration: 3000,
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const getSubtotal = () => cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
  const getCartCount = () => cart.reduce((acc, curr) => acc + curr.quantity, 0)

  // Format Card Number
  const handleCardNumberChange = (val: string) => {
    const formatted = val
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
    if (formatted.length <= 19) setCardNumber(formatted)
  }

  const handleCheckoutSubmit = async () => {
    // Validate UPI Transaction ID if UPI is selected
    if (paymentMethod === "UPI" && (!transactionId || transactionId.trim().length !== 12 || !/^\d+$/.test(transactionId))) {
      alert("Please enter a valid 12-digit UPI UTR Transaction Reference Number to verify payment.")
      return
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    
    setGatewayStage("Connecting to secure payment gateway...")
    await delay(1200)
    setGatewayStage(
      paymentMethod === "UPI"
        ? `Verifying UPI UTR Ref No: ${transactionId}...`
        : paymentMethod === "Card"
        ? "Verifying card details and pre-authorizing..."
        : "Checking fulfillment coordinate availability..."
    )
    await delay(1200)

    if (paymentMethod !== "COD" && simulationStatus === "failed") {
      setGatewayStage("Transaction Rejected: Bank declined or invalid transaction reference.")
      await delay(1400)
      setGatewayStage(null)
      setShowFailedModal(true)
      return
    }

    setGatewayStage("Authorizing funds and locking order receipt...")
    await delay(1000)
    setGatewayStage("Placing your online order...")
    await delay(800)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          phone,
          deliveryType,
          address: address || "Takeaway pickup",
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
          totalAmount: getSubtotal(),
          items: cart.map((i) => ({
            itemName: i.name,
            quantity: i.quantity,
            price: i.price
          }))
        })
      })

      const resData = await response.json()
      if (!response.ok) throw new Error(resData.message || "Failed to submit order.")

      // Complete order process
      setShowOrderInvoice(resData.order)
      setCart([])
      setIsCartOpen(false)
      setCheckoutStep("cart")
      // Reset forms
      setCustomerName("")
      setCustomerEmail("")
      setPhone("")
      setAddress("")
      setTransactionId("")
      setCardNumber("")
      setCardHolder("")
      setCardExpiry("")
      setCardCvv("")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to place order.")
    } finally {
      setGatewayStage(null)
    }
  }

  return (
    <>
      <section id="menu" className="relative overflow-hidden bg-secondary/80 backdrop-blur-md py-24">
      {/* Decorative Blurs */}
      <div className="absolute left-0 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Featured Menu
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            Crafted for Slow Mornings
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A warm mix of signature coffees, flaky bakes, and brunch favorites.
          </motion.p>
        </motion.div>

        {/* Category Selector Pills */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "relative rounded-full px-6 py-2 text-sm font-semibold transition-colors cursor-pointer",
                activeCategory === category
                  ? "text-primary-foreground"
                  : "bg-background/80 text-foreground shadow-sm hover:text-primary"
              )}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {activeCategory === category && (
                <motion.span
                  layoutId="active-menu-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/25"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Cards Grid */}
        <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                whileHover="hover"
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-card/80 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    variants={{
                      hover: { scale: 1.08 }
                    }}
                    transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                  />
                  {/* Sweep Light Reflection Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ left: "-100%", width: "100%", height: "100%" }}
                    variants={{
                      hover: { left: ["-100%", "100%"] }
                    }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-70" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur">
                    {item.featured ? "Popular" : item.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                      Rs. {item.price}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground mb-6">{item.description}</p>
                  
                  {/* Cart Mini CTA Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => addToCart(item)}
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4.5 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-[1.03]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add to Order
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>

    {/* Floating Cart Bubble (Floats cleanly at bottom-24, just above the chatbot at bottom-6) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => { setIsCartOpen(true); setCheckoutStep("cart") }}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all cursor-pointer"
        title="View Cafe Order"
      >
        <ShoppingBag className="h-6 w-6" />
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
            {getCartCount()}
          </span>
        )}
      </motion.button>

      {/* Slide-out Glassmorphic Cart Drawer Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Dark Backing Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-[90] backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card/95 border-l border-white/40 shadow-2xl z-[100] p-6 flex flex-col justify-between backdrop-blur-xl text-foreground"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                  🛒 Your Order
                  <span className="text-xs rounded-full bg-primary/10 px-2.5 py-0.5 text-primary font-sans font-semibold">
                    {getCartCount()} items
                  </span>
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step Navigation Tabs */}
              {cart.length > 0 && (
                <div className="mt-4 flex gap-1 border border-primary/20 bg-primary/5 p-1 rounded-full text-xs font-medium backdrop-blur-md">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className={cn(
                      "flex-1 py-2 rounded-full transition-all duration-300 cursor-pointer text-center",
                      checkoutStep === "cart"
                        ? "bg-primary text-primary-foreground shadow-md font-bold scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    )}
                  >
                    1. Cart
                  </button>
                  <button
                    disabled={checkoutStep === "cart" && (!customerName || !phone || !customerEmail)}
                    onClick={() => setCheckoutStep("details")}
                    className={cn(
                      "flex-1 py-2 rounded-full transition-all duration-300 cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed",
                      checkoutStep === "details"
                        ? "bg-primary text-primary-foreground shadow-md font-bold scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    )}
                  >
                    2. Details
                  </button>
                  <button
                    disabled={!customerName || !phone || !customerEmail || (deliveryType === "Dine-in" && !address) || (deliveryType === "Delivery" && !address)}
                    onClick={() => setCheckoutStep("payment")}
                    className={cn(
                      "flex-1 py-2 rounded-full transition-all duration-300 cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed",
                      checkoutStep === "payment"
                        ? "bg-primary text-primary-foreground shadow-md font-bold scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    )}
                  >
                    3. Payment
                  </button>
                </div>
              )}

              {/* Active Step Content */}
              <div className="flex-1 overflow-y-auto py-5 my-2 space-y-4 pr-1">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                    <ShoppingBag className="h-14 w-14 mb-4 stroke-1 opacity-60" />
                    <p className="font-semibold text-lg text-foreground">Your cart is empty</p>
                    <p className="text-sm mt-1 max-w-[240px]">Select items from our featured menu above to place an order!</p>
                  </div>
                ) : checkoutStep === "cart" ? (
                  /* Step 1: Cart Items Summary */
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const menuItem = menuItems.find((m) => m.id === item.id);
                      return (
                        <motion.div
                          layout
                          key={item.id}
                          className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-border/40 bg-secondary/15 hover:bg-secondary/25 transition-colors"
                        >
                          {/* Thumbnail image */}
                          {menuItem?.image && (
                            <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-border/60">
                              <img
                                src={menuItem.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-primary font-bold mt-1">Rs. {item.price}</p>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 bg-background border border-border/40 px-2 py-1 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-full text-destructive/80 hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : checkoutStep === "details" ? (
                  /* Step 2: Customer Checkout Details */
                  <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep("payment") }} className="space-y-4">
                    <h4 className="font-serif text-lg font-bold border-b border-border/20 pb-1 text-primary">Customer Particulars</h4>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-foreground/80">Full Name *</label>
                      <Input
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Mrunali Hatzade"
                        className="rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-foreground/80">Email Address *</label>
                      <Input
                        required
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="mrunalihatzade353@gmail.com"
                        className="rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-foreground/80">WhatsApp Mobile Number *</label>
                      <Input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07218405826"
                        className="rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary bg-background/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-foreground/80">Fulfillment Type *</label>
                      <div className="grid grid-cols-3 gap-1.5 border border-primary/20 bg-primary/5 p-1 rounded-full text-xs font-semibold">
                        {["Dine-in", "Takeaway", "Delivery"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => { setDeliveryType(type as any); setAddress("") }}
                            className={cn(
                              "py-1.5 rounded-full transition-all duration-300 cursor-pointer text-center",
                              deliveryType === type
                                ? "bg-primary text-primary-foreground shadow font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-foreground/80">
                        {deliveryType === "Dine-in" && "Select Table Number *"}
                        {deliveryType === "Takeaway" && "Requested Pickup Time *"}
                        {deliveryType === "Delivery" && "Delivery Address *"}
                      </label>
                      {deliveryType === "Dine-in" && (
                        <select
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground transition-all"
                        >
                          <option value="" className="bg-card">Choose a table...</option>
                          <option value="Table 1 (Window side)" className="bg-card">Table 1 (Window side)</option>
                          <option value="Table 2 (Cosy nook)" className="bg-card">Table 2 (Cosy nook)</option>
                          <option value="Table 3 (Bar lounge)" className="bg-card">Table 3 (Bar lounge)</option>
                          <option value="Table 4 (Premium terrace)" className="bg-card">Table 4 (Premium terrace)</option>
                        </select>
                      )}
                      {deliveryType === "Takeaway" && (
                        <Input
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. 5:30 PM (Pickup)"
                          className="rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary bg-background/50"
                        />
                      )}
                      {deliveryType === "Delivery" && (
                        <textarea
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Please supply your full delivery address in Pune..."
                          className="w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:ring-offset-0 transition-all"
                          rows={3}
                        />
                      )}
                    </div>
                    <button type="submit" className="hidden" id="details-submit-hidden" />
                  </form>
                ) : (
                  /* Step 3: Interactive Payments Interface */
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg font-bold border-b border-border/20 pb-1 text-primary">Payment Method</h4>
                    
                    {/* Method selector pills */}
                    <div className="grid grid-cols-3 gap-2 bg-secondary/35 border border-border/30 p-1 rounded-full text-xs font-semibold">
                      {[
                        { id: "UPI", label: "UPI" },
                        { id: "Card", label: "Card" },
                        { id: "COD", label: "Cash/COD" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setPaymentMethod(item.id as any)}
                          className={cn(
                            "py-1.5 rounded-full transition-all cursor-pointer text-center",
                            paymentMethod === item.id ? "bg-background shadow text-primary" : "text-muted-foreground"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Payment Methods Layout */}
                    <AnimatePresence mode="wait">
                      {paymentMethod === "UPI" && (() => {
                        const payeeUpi = process.env.NEXT_PUBLIC_PAYEE_UPI || "9767355347@ybl";
                        const upiUri = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(CAFE_NAME)}&am=${getSubtotal()}&cu=INR&tn=Order_Cafe`;
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
                        return (
                          <motion.div
                            key="upi"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-3 shadow-inner"
                          >
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                              <span>📲</span> Scan QR code to Pay Rs. {getSubtotal()}
                            </p>
                            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-2 border border-emerald-500/30 shadow-md transition-transform hover:scale-105 duration-300">
                              <img src={qrUrl} alt="UPI QR Code" className="h-full w-full object-contain" />
                            </div>
                            <div className="bg-background/80 rounded-xl p-2 border border-emerald-500/10 text-[10px] space-y-1">
                              <div className="flex justify-between items-center text-muted-foreground">
                                <span>UPI Address:</span>
                                <span className="font-bold text-foreground font-mono">{payeeUpi}</span>
                              </div>
                              <div className="flex justify-between items-center text-muted-foreground">
                                <span>Account Name:</span>
                                <span className="font-semibold text-foreground">{CAFE_NAME}</span>
                              </div>
                            </div>
                            
                            <div className="text-left space-y-1.5 pt-1.5 border-t border-emerald-500/10">
                              <label className="text-[9px] font-bold text-muted-foreground uppercase block">UPI Transaction UTR Number (12 digits) *</label>
                              <Input
                                required
                                value={transactionId}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, "");
                                  if (val.length <= 12) setTransactionId(val);
                                }}
                                placeholder="Enter 12-digit numeric Ref No"
                                className="rounded-xl h-9 text-xs bg-background/80 border-emerald-500/20 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                              />
                            </div>
                          </motion.div>
                        );
                      })()}

                      {paymentMethod === "Card" && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          {/* 3D-styled metallic gradient Credit Card Mockup */}
                          <div className="relative w-full aspect-[1.586] rounded-2xl bg-gradient-to-br from-[#d99755] via-[#634028] to-[#1a100a] text-white p-5 shadow-2xl overflow-hidden flex flex-col justify-between border border-amber-500/20">
                            {/* Card Details Glow Overlay */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex justify-between items-start">
                              <span className="font-serif text-sm tracking-widest font-bold text-amber-200/90">{CAFE_NAME.toUpperCase()}</span>
                              <div className="flex flex-col items-end">
                                <span className="text-[8px] uppercase tracking-widest opacity-60">Gold Access</span>
                                <span className="text-[10px] font-bold text-amber-300">PREMIUM</span>
                              </div>
                            </div>

                            {/* Card Chip Visual */}
                            <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-1 flex flex-col justify-between border border-amber-300/30 shadow-inner">
                              <div className="flex justify-between h-[30%]">
                                <div className="w-[20%] h-full border-r border-amber-900/30" />
                                <div className="w-[20%] h-full border-l border-amber-900/30" />
                              </div>
                              <div className="h-[2px] bg-amber-900/20 w-full" />
                              <div className="flex justify-between h-[30%]">
                                <div className="w-[20%] h-full border-r border-amber-900/30" />
                                <div className="w-[20%] h-full border-l border-amber-900/30" />
                              </div>
                            </div>

                            <div>
                              <p className="font-mono text-base tracking-widest sm:text-lg mb-2 text-amber-100 shadow-sm">
                                {cardNumber || "•••• •••• •••• ••••"}
                              </p>
                              <div className="flex justify-between items-end text-xs">
                                <div>
                                  <p className="text-[7px] uppercase tracking-wider text-amber-200/60">Cardholder</p>
                                  <p className="font-semibold tracking-wider truncate max-w-[170px] uppercase text-white">{cardHolder || "Your Name"}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[7px] uppercase tracking-wider text-amber-200/60">Expires</p>
                                  <p className="font-mono font-semibold text-white">{cardExpiry || "MM/YY"}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inputs */}
                          <div className="space-y-2.5">
                            <div>
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Cardholder Name</label>
                              <Input
                                required
                                placeholder="Enter cardholder name"
                                className="rounded-xl bg-background/50 h-9.5 text-xs focus-visible:ring-primary focus-visible:border-primary"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Card Number</label>
                              <Input
                                required
                                placeholder="4111 2222 3333 4444"
                                className="rounded-xl bg-background/50 h-9.5 text-xs focus-visible:ring-primary focus-visible:border-primary font-mono"
                                value={cardNumber}
                                onChange={(e) => handleCardNumberChange(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Expiry Date</label>
                                <Input
                                  required
                                  placeholder="MM/YY"
                                  className="rounded-xl bg-background/50 h-9.5 text-xs focus-visible:ring-primary focus-visible:border-primary font-mono"
                                  value={cardExpiry}
                                  onChange={(e) => { if (e.target.value.length <= 5) setCardExpiry(e.target.value) }}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">CVV Code</label>
                                <Input
                                  required
                                  type="password"
                                  placeholder="•••"
                                  className="rounded-xl bg-background/50 h-9.5 text-xs focus-visible:ring-primary focus-visible:border-primary font-mono"
                                  value={cardCvv}
                                  onChange={(e) => { if (e.target.value.length <= 3) setCardCvv(e.target.value) }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "COD" && (
                        <motion.div
                          key="cod"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-center space-y-2.5 shadow-sm"
                        >
                          <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 flex items-center justify-center gap-1.5">
                            <span>💰</span> Cash on Delivery / Pay at Counter
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            No payment is required right now! Simply complete the order now, and pay <strong className="text-foreground">Rs. {getSubtotal()}</strong> at the counter or to your delivery server.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 🛠️ Real Payments Demo Simulator Switch (Shown only for non-COD payment modes) */}
                    {paymentMethod !== "COD" && (
                      <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/15 p-3.5 mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-primary tracking-wider uppercase">🛠️ Demo payment switch</span>
                          <span className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded",
                            simulationStatus === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                          )}>
                            {simulationStatus === "success" ? "PASSING" : "FAILING"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setSimulationStatus("success")}
                            className={cn(
                              "py-1 rounded-lg border transition-all cursor-pointer text-center",
                              simulationStatus === "success"
                                ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-600 shadow-xs font-bold"
                                : "bg-background border-border/40 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            Success
                          </button>
                          <button
                            type="button"
                            onClick={() => setSimulationStatus("failed")}
                            className={cn(
                              "py-1 rounded-lg border transition-all cursor-pointer text-center",
                              simulationStatus === "failed"
                                ? "bg-rose-500/10 border-rose-500/35 text-rose-600 shadow-xs font-bold"
                                : "bg-background border-border/40 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            Fail
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Drawer CTA section */}
              {cart.length > 0 && (
                <div className="border-t border-border/40 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span>Subtotal:</span>
                    <span className="text-primary text-base font-bold">Rs. {getSubtotal()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Secondary back button */}
                    {checkoutStep !== "cart" ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (checkoutStep === "payment") setCheckoutStep("details")
                          else if (checkoutStep === "details") setCheckoutStep("cart")
                        }}
                        className="rounded-full cursor-pointer h-10 text-xs hover:bg-secondary/40 transition-all active:scale-95"
                      >
                        Back
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsCartOpen(false)}
                        className="rounded-full cursor-pointer h-10 text-xs hover:bg-secondary/40 transition-all active:scale-95"
                      >
                        Keep Browsing
                      </Button>
                    )}

                    {/* Primary proceed CTA */}
                    {checkoutStep === "cart" && (
                      <Button
                        onClick={() => setCheckoutStep("details")}
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg shadow-primary/10"
                      >
                        Checkout Order
                      </Button>
                    )}

                    {checkoutStep === "details" && (
                      <Button
                        onClick={() => {
                          if (customerName && phone && customerEmail && address) {
                            setCheckoutStep("payment")
                          } else {
                            document.getElementById("details-submit-hidden")?.click()
                          }
                        }}
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg shadow-primary/10"
                      >
                        Proceed to Pay
                      </Button>
                    )}

                    {checkoutStep === "payment" && (
                      <Button
                        onClick={handleCheckoutSubmit}
                        disabled={
                          paymentMethod === "Card" &&
                          (!cardHolder || cardNumber.length < 19 || !cardExpiry || cardCvv.length < 3)
                        }
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                      >
                        <Lock className="h-3.5 w-3.5 mr-1" /> Pay & Order
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Gateway Authorization Overlay */}
      <AnimatePresence>
        {gatewayStage && (
          <motion.div
            className="fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-sm rounded-[2rem] bg-card border border-white/60 p-8 text-center shadow-2xl space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-2" />
              <h3 className="font-serif text-xl font-bold tracking-tight">Authorizing Payment</h3>
              <p className="text-xs text-muted-foreground font-mono">{gatewayStage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Confirmation Dialog Modal */}
      <AnimatePresence>
        {showOrderInvoice && (
          <motion.div
            className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              className="w-full max-w-md rounded-[2rem] bg-card border border-white/60 p-6 shadow-2xl text-center space-y-4"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Order Placed!</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Thank you, <strong className="text-foreground">{showOrderInvoice.customerName}</strong>! Your order is validated.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="rounded-2xl border border-border/40 bg-secondary/15 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-border/40 pb-2 font-mono">
                  <span className="text-[10px] text-muted-foreground">Order ID:</span>
                  <span className="font-semibold text-primary truncate max-w-[180px]">{showOrderInvoice.id}</span>
                </div>
                <div className="space-y-1 py-1 max-h-24 overflow-y-auto pr-1">
                  {showOrderInvoice.items.map((i: any) => (
                    <div key={i.id} className="flex justify-between items-center text-muted-foreground">
                      <span>{i.itemName} x{i.quantity}</span>
                      <span>Rs. {i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-2 font-bold text-foreground">
                  <span>Total Amount:</span>
                  <span className="text-primary text-sm">Rs. {showOrderInvoice.totalAmount}</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                📧 A real-time PDF invoice receipt has been dispatched to <strong className="text-foreground">{showOrderInvoice.customerEmail}</strong>! Our baristas are preparing your seat now.
              </p>

              <Button
                onClick={() => setShowOrderInvoice(null)}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-10 text-xs"
              >
                Awesome
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Failed Dialog Modal */}
      <AnimatePresence>
        {showFailedModal && (
          <motion.div
            className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              className="w-full max-w-md rounded-[2rem] bg-card border border-rose-500/20 p-6 shadow-2xl text-center space-y-4"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 animate-pulse">
                <AlertCircle className="h-8 w-8 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Payment Verification Failed!</h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 leading-relaxed font-semibold">
                  ❌ Payment Rejected: Insufficient Funds / Invalid Transaction reference UTR
                </p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-secondary/15 p-4 text-left space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p><strong>Reason:</strong> The bank central gateway could not reconcile the payment or verify the supplied 12-digit UTR Transaction ID reference.</p>
                <p className="mt-1 font-semibold text-foreground">Your order has NOT been placed. No reservation/preparation seats have been reserved.</p>
              </div>

              <p className="text-[10px] text-muted-foreground leading-normal">
                Please ensure the Rs. {getSubtotal()} payment executes completely on GPay/PhonePe, then supply the correct 12-digit UTR, or checkout with **Cash on Delivery (COD)** instead.
              </p>

              <Button
                variant="destructive"
                onClick={() => setShowFailedModal(false)}
                className="w-full rounded-full h-10 text-xs font-semibold cursor-pointer"
              >
                Try Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
