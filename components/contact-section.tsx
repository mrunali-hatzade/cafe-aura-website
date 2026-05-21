"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/motion"

const contactItems = [
  { icon: MapPin, title: "Location", body: "FC Road\nPune, Maharashtra 411004" },
  { icon: Phone, title: "Phone", body: "(+91) 9876543210" },
  { icon: Mail, title: "Email", body: "hello@democafe.com" },
  { icon: Clock, title: "Hours", body: "Mon - Fri: 6am - 8pm\nSat - Sun: 7am - 9pm" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to submit message.")

      setShowSuccessModal(true)
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-secondary/80 backdrop-blur-md py-24">
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Get in Touch
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            Contact Us
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have questions or want to book an event? We would love to hear from you.
          </motion.p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-7">
            {contactItems.map((item) => (
              <motion.div key={item.title} whileHover={{ x: 6 }} className="group flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-muted-foreground">{item.body}</p>
                </div>
              </motion.div>
            ))}

            <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-3xl border border-border shadow-xl shadow-black/5">
              <iframe
                title="Cafe location map"
                src="https://maps.google.com/maps?q=FC%20Road%2C%20Pune%2C%20Maharashtra%20411004&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="aspect-video w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <form onSubmit={handleSubmit} className="rounded-3xl border border-white/60 bg-card/85 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
              <h3 className="mb-6 font-serif text-3xl font-bold text-foreground">Send us a Message</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">Name</label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-background/80" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-background/80" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {errorMsg && (
                  <p className="text-sm font-semibold text-destructive mt-1 text-center">
                    ⚠️ {errorMsg}
                  </p>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Message Sent Success Popup Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.97 }}
              className="w-full max-w-sm rounded-[2rem] bg-card border border-white/60 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">Message Sent!</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thank you for reaching out to us! Your message has been saved. We will review and reply to your email shortly.
              </p>

              <Button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Awesome
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
