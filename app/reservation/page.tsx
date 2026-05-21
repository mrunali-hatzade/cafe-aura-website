"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Calendar, CheckCircle, Clock, Loader2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/motion"

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

const bookingNotes = [
  { icon: Calendar, title: "Open Daily", text: "Monday - Sunday, 8:00 AM - 9:00 PM" },
  { icon: Clock, title: "Reservation Duration", text: "Tables are reserved for 2 hours" },
  { icon: Users, title: "Group Bookings", text: "For parties of 8+, please call us directly" },
]

export default function ReservationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [reservationId, setReservationId] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
    sendWhatsapp: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save reservation.")
      }

      setReservationId(result.reservation.id)
      setEmailSent(result.emailSent)
      setWhatsappSent(result.whatsappSent)
      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save reservation.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-primary py-4 text-primary-foreground"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 transition-all hover:-translate-x-1 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="font-serif text-xl font-bold">Demo Cafe</span>
        </div>
      </motion.header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeUp} className="font-serif text-4xl font-bold text-foreground md:text-6xl">
              Reserve Your Table
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg leading-8 text-muted-foreground">
              Join us for brunch, a business meeting, or a special celebration. We will make sure your visit feels memorable.
            </motion.p>

            <motion.div variants={staggerContainer} className="mt-9 space-y-6">
              {bookingNotes.map((note) => (
                <motion.div key={note.title} variants={slideInLeft} whileHover={{ x: 6 }} className="group flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <note.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{note.title}</h3>
                    <p className="text-muted-foreground">{note.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} whileHover={{ y: -8, scale: 1.01 }} className="mt-10 hidden overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10 lg:block">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1400&auto=format&fit=crop"
                alt="Cafe dining area"
                className="h-72 w-full object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" animate="visible">
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 bg-card/90 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl md:p-8">
              <h2 className="mb-6 font-serif text-3xl font-bold text-foreground">Booking Details</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="mt-1.5 bg-background/80" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="mt-1.5 bg-background/80" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="mt-1.5 bg-background/80" />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-0.5">
                  <input
                    id="sendWhatsapp"
                    name="sendWhatsapp"
                    type="checkbox"
                    checked={formData.sendWhatsapp}
                    onChange={(e) => setFormData({ ...formData, sendWhatsapp: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-background/80 cursor-pointer"
                  />
                  <Label htmlFor="sendWhatsapp" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                    <span>💬 Receive seat confirmation on WhatsApp</span>
                  </Label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" name="date" type="date" required value={formData.date} onChange={handleChange} className="mt-1.5 bg-background/80" min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <select id="time" name="time" required value={formData.time} onChange={handleChange} className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background/80 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <select id="guests" name="guests" required value={formData.guests} onChange={handleChange} className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background/80 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Dietary requirements, special occasions, seating preferences..."
                    rows={3}
                    className="mt-1.5 flex w-full resize-none rounded-md border border-input bg-background/80 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                  <Button type="submit" size="lg" disabled={isLoading} className="mt-2 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Reserving your table...
                      </span>
                    ) : (
                      "Confirm Reservation"
                    )}
                  </Button>
                </motion.div>
                {submitError && (
                  <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive">
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="w-full max-w-md rounded-[2rem] bg-card p-8 text-center shadow-2xl"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </motion.div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Reservation Confirmed!</h2>
              <p className="mt-4 text-muted-foreground">
                Thank you, {formData.name}. Your table for {formData.guests} guests is reserved for {formData.date} at {formData.time}.
              </p>
              {reservationId && (
                <div className="mt-4 space-y-4">
                  <p className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary inline-block">
                    Booking ID: {reservationId}
                  </p>

                  <div className="border-t border-border pt-4 text-left max-w-xs mx-auto space-y-3">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest text-center font-bold mb-2">Notification Status</p>
                    
                    <div className="flex items-center gap-2.5 text-sm text-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-serif font-bold">✓</span>
                      <span className="truncate">📧 Simulated email sent to <strong className="font-semibold">{formData.email}</strong></span>
                    </div>

                    {formData.sendWhatsapp && (
                      <div className="flex items-center gap-2.5 text-sm text-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-serif font-bold">✓</span>
                        <span className="truncate">💬 WhatsApp reply sent to <strong className="font-semibold">{formData.phone}</strong></span>
                      </div>
                    )}
                  </div>

                  {formData.sendWhatsapp && (
                    <div className="space-y-2 pt-2 max-w-xs mx-auto">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <a
                          href={`https://wa.me/${formData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `*☕ Demo Cafe - Table Reservation Confirmed!*\n\nHi *${formData.name}*,\n\nWe have successfully reserved a table for you! Here are your booking details:\n\n• 📅 *Date:* ${formData.date}\n• 🕒 *Time:* ${formData.time}\n• 👥 *Guests:* ${formData.guests} pax\n• 🎟️ *Booking ID:* ${reservationId}\n\n*Guidelines:*\n- Tables are held for a maximum of 15 minutes past booking time.\n- Your table is reserved for a duration of 2 hours.\n- Location: FC Road, Pune.\n\nWe look forward to serving you! 👋`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#25d366]/20 transition-all hover:bg-[#20ba5a] hover:shadow-lg cursor-pointer"
                        >
                          📲 Send Receipt to My WhatsApp
                        </a>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <a
                          href={`https://wa.me/919767355347?text=${encodeURIComponent(
                            `Hi Demo Cafe! ☕ I just reserved a table (Booking ID: ${reservationId}). I'd like to check on my seating request.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/10 cursor-pointer"
                        >
                          💬 Chat with Cafe Support
                        </a>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
              <Link href="/">
                <Button className="mt-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
