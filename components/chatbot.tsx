"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, Coffee, MessageSquare, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const quickPrompts = [
  { label: "🍽️ View Menu & Prices", query: "View Menu & Prices" },
  { label: "🕒 Opening Hours", query: "Opening Hours" },
  { label: "📅 How do I book a table?", query: "How do I book a table?" },
  { label: "👥 Group Booking (8+)", query: "Group Booking (8+)" },
  { label: "📍 Location & Address", query: "Location & Address" },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! 👋 I'm your Demo Cafe Barista Assistant. How can I help you today? If you're looking for details or get stuck in booking a table, just ask!",
      timestamp: new Date(),
    },
  ])

  const feedRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages or typing state change
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase().trim()

    // 1. Menu and Prices query
    if (
      q.includes("menu") ||
      q.includes("price") ||
      q.includes("eat") ||
      q.includes("coffee") ||
      q.includes("espresso") ||
      q.includes("pastry") ||
      q.includes("latte") ||
      q.includes("croissant") ||
      q.includes("avocado") ||
      q.includes("breakfast")
    ) {
      return `🍽️ *Here is our curated, fresh artisan menu:*
      
☕ *Coffee:*
• Signature Espresso — Rs. 375
• Vanilla Oat Latte — Rs. 460
• Cold Brew (24h) — Rs. 335

🥐 *Pastries:*
• Butter Croissant — Rs. 290
• Almond Danish — Rs. 335
• Cinnamon Roll — Rs. 375

🍳 *Breakfast & Lunch:*
• Avocado Toast — Rs. 750
• Eggs Benedict — Rs. 999
• Quinoa Grain Bowl — Rs. 1,085

All our bakes are freshly rolled and baked in-house every single morning! 🥐`
    }

    // 2. Opening Hours query
    if (
      q.includes("hour") ||
      q.includes("open") ||
      q.includes("close") ||
      q.includes("time") ||
      q.includes("timing") ||
      q.includes("day") ||
      q.includes("weekend")
    ) {
      return `🕒 *Our Opening Hours:*
      
• *Monday to Friday:* 6:00 AM – 8:00 PM
• *Saturday to Sunday:* 7:00 AM – 9:00 PM

We are open on all national holidays! Join us for brunch, a quick workspace coffee, or a cozy evening dessert.`
    }

    // 3. Location and Address query
    if (
      q.includes("location") ||
      q.includes("address") ||
      q.includes("where") ||
      q.includes("map") ||
      q.includes("pune") ||
      q.includes("fc road") ||
      q.includes("reach") ||
      q.includes("direction")
    ) {
      return `📍 *Our Cafe Location:*
      
Demo Cafe is situated at:
*FC Road, Pune, Maharashtra 411004*

We are right in the heart of the city! There is ample street parking and dedicated two-wheeler spots available.`
    }

    // 4. Booking query
    if (
      q.includes("book") ||
      q.includes("reservation") ||
      q.includes("reserve") ||
      q.includes("table") ||
      q.includes("seat") ||
      q.includes("stuck")
    ) {
      return `📅 *How to Book a Table:*
      
It's incredibly simple! Just click on the *'Reserve a Table'* button in the navigation header (or the CTA in the Hero section), fill out:
1. Your Full Name, Email & Phone
2. Date, Time Slot & Number of Guests
3. Click "Confirm Reservation"

Once booked, you will *instantly* receive a simulated Email and a WhatsApp confirmation message. All tables are reserved for a comfortable duration of *2 hours*!`
    }

    // 5. Group bookings query
    if (
      q.includes("group") ||
      q.includes("party") ||
      q.includes("people") ||
      q.includes("guests") ||
      q.includes("8") ||
      q.includes("large")
    ) {
      return `👥 *Group Bookings Policy:*
      
• Our online reservation form accepts bookings for up to *8 guests*.
• For larger parties, special private events, or corporate bookings (8+ guests), please contact us directly at *+91 9876543210* or email us at *hello@democafe.com*. We'll set up a gorgeous custom table configuration for you!`
    }

    // 6. Wifi query
    if (q.includes("wifi") || q.includes("internet") || q.includes("password")) {
      return `📶 *Free Cafe High-Speed WiFi:*
      
Yes! We provide complimentary gigabit WiFi for all our dining customers.
• *SSID:* DemoCafe_Guest
• *Password:* craftandcalm2026

Feel free to plug in and work from our cozy window desks!`
    }

    // 7. Greetings
    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greetings")) {
      return `Hello! 😊 Hope your day is going wonderfully. What can I help you craft at Demo Cafe today? Choose one of the quick options below or type your question!`
    }

    // 8. Thank you
    if (q.includes("thank") || q.includes("thanks") || q.includes("awesome") || q.includes("great")) {
      return `You're very welcome! 😊 It is always a pleasure to help. Let me know if you need anything else, and we look forward to serving you the perfect cup of coffee soon!`
    }

    // Default response
    return `🤔 I didn't quite catch that, but I'm here to help!
    
You can ask me about:
• 🍽️ Our *Menu & Prices*
• 🕒 Our *Opening Hours*
• 📍 Our *Location & Address*
• 📅 How to make a *Reservation*
• 📶 Our *WiFi Password* or *Group Bookings*

Feel free to tap one of the quick-reply suggestions below, or type your query in simple words!`
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsgId = Math.random().toString(36).substring(2, 9)
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Human-like response latency delay (800ms - 1300ms)
    const delay = 800 + Math.random() * 500
    await new Promise((resolve) => setTimeout(resolve, delay))

    const botResponseText = getBotResponse(text)
    const botMsgId = Math.random().toString(36).substring(2, 9)
    const botMsg: Message = {
      id: botMsgId,
      sender: "bot",
      text: botResponseText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMsg])
    setIsTyping(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 border border-primary/20 hover:bg-primary/95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        layout
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6" />
              {/* Subtle pulsing badge notification */}
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                !
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="absolute bottom-18 right-0 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-card/90 shadow-3xl backdrop-blur-xl md:w-[390px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary px-5 py-4 text-primary-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-primary-foreground">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight flex items-center gap-1.5">
                  Barista Assistant
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                </h3>
                <p className="text-[11px] opacity-80">Demo Cafe • Active Support</p>
              </div>
            </div>

            {/* Message Feed */}
            <div
              ref={feedRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary text-foreground border border-border rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Bot Typing Bubble */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 bg-secondary border border-border text-muted-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2.5 border-t border-border/40 bg-secondary/35 flex flex-wrap gap-1.5 justify-start">
              {quickPrompts.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSendMessage(chip.query)}
                  className="rounded-full bg-background border border-border px-3 py-1 text-xs font-semibold text-foreground/80 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Footer Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputValue)
              }}
              className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
            >
              <Input
                placeholder="Ask your query here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-background/80"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
