"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Coffee,
  Trash2,
  Search,
  Users,
  Clock,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  FileText,
  MessageCircle,
  Mail,
  User,
  Inbox,
  ShoppingBag,
  CreditCard,
  ChefHat,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests: string | null
  createdAt: string
  isSeen: boolean
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  isSeen: boolean
}

interface OrderItem {
  id: string
  itemName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  phone: string
  deliveryType: string
  address: string | null
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  isSeen: boolean
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"reservations" | "orders" | "messages">("reservations")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [guestFilter, setGuestFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  // Deletion confirmation states
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingType, setDeletingType] = useState<"reservation" | "message" | "order" | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch all data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError("")
    try {
      const [resResponse, msgResponse, orderResponse] = await Promise.all([
        fetch("/api/reservations"),
        fetch("/api/messages"),
        fetch("/api/orders")
      ])

      if (!resResponse.ok || !msgResponse.ok || !orderResponse.ok) {
        throw new Error("Failed to retrieve dashboard records.")
      }

      const resData = await resResponse.json()
      const msgData = await msgResponse.json()
      const orderData = await orderResponse.json()

      setReservations(resData.reservations || [])
      setMessages(msgData.messages || [])
      setOrders(orderData.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReservation = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Could not cancel the reservation.")

      setReservations((prev) => prev.filter((res) => res.id !== id))
      setDeletingId(null)
      setDeletingType(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Could not delete the message.")

      setMessages((prev) => prev.filter((msg) => msg.id !== id))
      setDeletingId(null)
      setDeletingType(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete message.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Could not delete the order.")

      setOrders((prev) => prev.filter((order) => order.id !== id))
      setDeletingId(null)
      setDeletingType(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete order.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateOrderStatus = async (id: string, orderStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus })
      })

      if (!response.ok) throw new Error("Failed to update order status.")

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, orderStatus } : order))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  const handleUpdatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus })
      })

      if (!response.ok) throw new Error("Failed to update payment status.")

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, paymentStatus } : order))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  const handleTabSwitch = (newTab: "reservations" | "orders" | "messages") => {
    if (activeTab !== newTab) {
      const markItemsAsSeen = async () => {
        let itemsToUpdate: { id: string }[] = []
        if (activeTab === "reservations") itemsToUpdate = reservations.filter(r => !r.isSeen)
        else if (activeTab === "orders") itemsToUpdate = orders.filter(o => !o.isSeen)
        else if (activeTab === "messages") itemsToUpdate = messages.filter(m => !m.isSeen)

        if (itemsToUpdate.length === 0) return

        if (activeTab === "reservations") {
          setReservations(prev => prev.map(r => ({ ...r, isSeen: true })))
        } else if (activeTab === "orders") {
          setOrders(prev => prev.map(o => ({ ...o, isSeen: true })))
        } else if (activeTab === "messages") {
          setMessages(prev => prev.map(m => ({ ...m, isSeen: true })))
        }

        try {
          await Promise.all(itemsToUpdate.map(item => {
            const endpoint = activeTab === "reservations" ? `/api/reservations/${item.id}` : activeTab === "messages" ? `/api/messages/${item.id}` : `/api/orders/${item.id}`
            return fetch(endpoint, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isSeen: true })
            })
          }))
        } catch (err) {
          console.error("Failed to mark as seen:", err)
        }
      }
      markItemsAsSeen()
    }

    setActiveTab(newTab)
    setSearchQuery("")
  }

  const confirmDelete = (id: string, type: "reservation" | "message" | "order") => {
    setDeletingId(id)
    setDeletingType(type)
  }

  // Calculate statistics
  const totalBookings = reservations.length
  const totalMessages = messages.length
  const totalOrders = orders.length

  const unseenBookings = reservations.filter((r) => !r.isSeen).length
  const unseenOrders = orders.filter((o) => !o.isSeen).length
  const unseenMessages = messages.filter((m) => !m.isSeen).length

  // Filtered reservations
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGuests =
      guestFilter === "all" ||
      (guestFilter === "small" && res.guests <= 2) ||
      (guestFilter === "medium" && res.guests > 2 && res.guests <= 4) ||
      (guestFilter === "large" && res.guests > 4)

    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "morning" && res.time.includes("AM")) ||
      (timeFilter === "evening" && res.time.includes("PM"))

    return matchesSearch && matchesGuests && matchesTime
  })

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    return (
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Filtered messages
  const filteredMessages = messages.filter((msg) => {
    return (
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusBadge = (dateStr: string) => {
    const today = new Date().setHours(0, 0, 0, 0)
    const bookingDate = new Date(dateStr).getTime()

    if (bookingDate < today) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-2.5 py-1 text-xs font-semibold text-muted-foreground border border-border/50">
          Past
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        Upcoming
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-background/95 text-foreground py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10 border-b border-border/40 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-2">
              <ChevronLeft className="h-4 w-4" /> Back to Cafe Site
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
              ☕ Backoffice Dashboard
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <ShieldCheck className="h-3.5 w-3.5" /> Staff Only
              </span>
            </h1>
          </div>
          <Button onClick={fetchData} variant="outline" className="rounded-full bg-card shadow-sm cursor-pointer">
            Refresh Data
          </Button>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-[1.5rem] border border-white/60 bg-card/60 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Coffee className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Total Bookings</p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">{totalBookings}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="rounded-[1.5rem] border border-white/60 bg-card/60 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Online Orders Placed</p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">{totalOrders}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 }}
            className="rounded-[1.5rem] border border-white/60 bg-card/60 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Inbox className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Messages Received</p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">{totalMessages}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3-Tab Selector Pills */}
        <div className="mb-8 flex flex-wrap gap-3 border-b border-border/40 pb-4">
          <button
            onClick={() => handleTabSwitch("reservations")}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "reservations"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-card/60 text-muted-foreground hover:text-foreground border border-border/45"
            }`}
          >
            Table Reservations {unseenBookings > 0 && <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unseenBookings}</span>}
          </button>
          <button
            onClick={() => handleTabSwitch("orders")}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-card/60 text-muted-foreground hover:text-foreground border border-border/45"
            }`}
          >
            Customer Orders ({totalOrders}) {unseenOrders > 0 && <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unseenOrders}</span>}
          </button>
          <button
            onClick={() => handleTabSwitch("messages")}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "messages"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-card/60 text-muted-foreground hover:text-foreground border border-border/45"
            }`}
          >
            Feedback Inbox ({totalMessages}) {unseenMessages > 0 && <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unseenMessages}</span>}
          </button>
        </div>

        {/* Universal Filter controls */}
        <div className="rounded-[1.5rem] border border-white/60 bg-card/60 p-6 shadow-sm backdrop-blur mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "reservations"
                    ? "Search reservations by customer name, email, phone or Booking ID..."
                    : activeTab === "orders"
                    ? "Search online orders by name, email, phone or Order ID..."
                    : "Search feedback messages by name, email or contents..."
                }
                className="pl-10 rounded-full bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === "reservations" && (
              <div className="flex flex-wrap gap-3">
                <select
                  className="flex h-10 rounded-full border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none cursor-pointer"
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                >
                  <option value="all">All Guest Sizes</option>
                  <option value="small">Small Groups (1-2 guests)</option>
                  <option value="medium">Mid-sized Groups (3-4 guests)</option>
                  <option value="large">Large Groups (5+ guests)</option>
                </select>

                <select
                  className="flex h-10 rounded-full border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none cursor-pointer"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">All Hours</option>
                  <option value="morning">Morning (AM slots)</option>
                  <option value="evening">Evening (PM slots)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Ledger list container */}
        <div className="rounded-[2rem] border border-white/60 bg-card/60 shadow-lg backdrop-blur overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Fetching dashboard records...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <AlertCircle className="h-12 w-12 text-destructive mb-3" />
              <h3 className="text-lg font-bold">Failed to Fetch Data</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">{error}</p>
              <Button onClick={fetchData} variant="outline" className="mt-4 rounded-full">
                Try Again
              </Button>
            </div>
          ) : activeTab === "reservations" ? (
            /* Tab 1: Table Reservations */
            filteredReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <FileText className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  {searchQuery || guestFilter !== "all" || timeFilter !== "all"
                    ? "Try broadening your filters or clearing search text."
                    : "Seats are currently empty! Customer reservations will display here."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/35 text-muted-foreground font-semibold">
                      <th className="px-6 py-4 w-12 text-center">#</th>
                      <th className="px-6 py-4">Booking Details</th>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Special Requests</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <AnimatePresence mode="popLayout">
                      {filteredReservations.map((res, index) => (
                        <motion.tr
                          layout
                          key={res.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-secondary/20 transition-colors"
                        >
                          <td className="px-6 py-5 text-center font-medium text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-xs font-semibold text-primary select-all">
                                {res.id}
                              </p>
                              {!res.isSeen && (
                                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">NEW</span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Booked: {new Date(res.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-semibold text-foreground">{res.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{res.email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{res.phone}</p>
                          </td>
                          <td className="px-6 py-5 font-semibold text-foreground">
                            {res.guests} pax
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="font-semibold text-foreground">
                                {new Date(res.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {res.time}
                              </span>
                              <div className="mt-1">{getStatusBadge(res.date)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-muted-foreground max-w-xs truncate italic">
                            {res.specialRequests ? `"${res.specialRequests}"` : "None"}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`https://wa.me/${res.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `*☕ Demo Cafe - Table Reservation Confirmed!*\n\nHi *${res.name}*,\n\nWe have successfully reserved a table for you! Here are your booking details:\n\n• 📅 *Date:* ${new Date(res.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}\n• 🕒 *Time:* ${res.time}\n• 👥 *Guests:* ${res.guests} pax\n• 🎟️ *Booking ID:* ${res.id}\n\nWe look forward to hosting you! 👋`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                title="Send WhatsApp Confirmation"
                              >
                                <MessageCircle className="h-4.5 w-4.5" />
                              </a>
                              <Button
                                onClick={() => confirmDelete(res.id, "reservation")}
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-destructive hover:bg-destructive/10 cursor-pointer"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "orders" ? (
            /* Tab 2: Customer Online Orders */
            filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground">No orders received</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  {searchQuery
                    ? "Try clearing your search text to inspect other orders."
                    : "No online orders have been placed yet."}
                </p>
              </div>
            ) : (
              <div className="p-6 grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="rounded-3xl border border-border bg-secondary/10 p-5 flex flex-col justify-between hover:bg-secondary/20 transition-colors relative"
                    >
                      <div>
                        {/* Order Header */}
                        <div className="flex items-start justify-between border-b border-border/40 pb-3 mb-3 gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm leading-tight text-foreground">{order.customerName}</h4>
                              {!order.isSeen && (
                                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">NEW</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" /> {order.customerEmail}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">📞 {order.phone}</p>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <span className="font-mono text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded select-all block">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              Ordered: {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Type Badge and Address details */}
                        <div className="mb-3.5 flex flex-wrap items-center gap-2">
                          <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs border",
                            order.deliveryType === "Dine-in" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                            order.deliveryType === "Takeaway" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                            order.deliveryType === "Delivery" && "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          )}>
                            🎯 {order.deliveryType}
                          </span>
                          <span className="text-xs text-muted-foreground italic truncate max-w-[240px]">
                            {order.address}
                          </span>
                        </div>

                        {/* Order Items Table Summary */}
                        <div className="rounded-2xl border border-border/30 bg-background/55 p-3 mb-4 space-y-2 text-xs">
                          <div className="font-semibold text-foreground/80 border-b border-border/30 pb-1 flex justify-between items-center">
                            <span>Itemized Summary</span>
                            <span>Total</span>
                          </div>
                          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                            {order.items.map((i) => (
                              <div key={i.id} className="flex justify-between items-center text-muted-foreground">
                                <span>{i.itemName} <strong className="text-foreground/80">x{i.quantity}</strong></span>
                                <span>Rs. {i.price * i.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center border-t border-border/30 pt-1.5 font-bold text-foreground">
                            <span>Total Paid:</span>
                            <span className="text-primary text-sm">Rs. {order.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fulfillment Status Selectors & Deletion */}
                      <div className="border-t border-border/30 pt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Order Status Select */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1"><ChefHat className="h-3 w-3" /> Fulfillment</span>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus:outline-none cursor-pointer"
                            >
                              <option value="Preparing">🍳 Preparing</option>
                              <option value="Completed">✅ Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                          </div>

                          {/* Payment Status Select */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1"><CreditCard className="h-3 w-3" /> Transaction</span>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                              className="h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus:outline-none cursor-pointer"
                            >
                              <option value="Paid">🟢 Paid ({order.paymentMethod})</option>
                              <option value="Pending">🟡 COD (Pending)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                          onClick={() => confirmDelete(order.id, "order")}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                          title="Archive Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>
            )
          ) : (
            /* Tab 3: Customer Feedback Messages */
            filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <Inbox className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Inbox is empty</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  {searchQuery
                    ? "Try clearing your search query to see other messages."
                    : "No customer contact slips received yet."}
                </p>
              </div>
            ) : (
              <div className="p-6 grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredMessages.map((msg) => (
                    <motion.div
                      layout
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="rounded-2xl border border-border bg-secondary/15 p-5 relative flex flex-col justify-between hover:bg-secondary/25 transition-colors group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-foreground leading-tight">{msg.name}</h4>
                                {!msg.isSeen && (
                                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">NEW</span>
                                )}
                              </div>
                              <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" /> {msg.email}
                              </a>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 bg-background/50 px-2 py-0.5 rounded border border-border/40">
                            <Calendar className="h-3 w-3" /> {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="rounded-xl bg-background/40 border border-border/30 p-3 italic text-sm text-muted-foreground leading-relaxed select-all">
                          "{msg.message}"
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          onClick={() => confirmDelete(msg.id, "message")}
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-1 text-xs px-3"
                          title="Delete Message"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Message
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          )}
        </div>
      </div>

      {/* Deletion confirmation overlay */}
      <AnimatePresence>
        {deletingId && deletingType && (
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
              className="w-full max-w-sm rounded-[2rem] bg-card border border-white/60 p-6 shadow-2xl"
            >
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {deletingType === "reservation" && "Cancel Booking?"}
                {deletingType === "message" && "Delete Message?"}
                {deletingType === "order" && "Archive Order?"}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {deletingType === "reservation" && "Are you sure you want to cancel and delete this table reservation? This action is permanent."}
                {deletingType === "message" && "Are you sure you want to permanently delete this customer feedback slip?"}
                {deletingType === "order" && "Are you sure you want to permanently archive and delete this customer order history?"}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={() => { setDeletingId(null); setDeletingType(null) }}
                  variant="outline"
                  disabled={isDeleting}
                  className="rounded-full cursor-pointer"
                >
                  Keep
                </Button>
                <Button
                  onClick={() => {
                    if (deletingType === "reservation") {
                      handleDeleteReservation(deletingId)
                    } else if (deletingType === "message") {
                      handleDeleteMessage(deletingId)
                    } else if (deletingType === "order") {
                      handleDeleteOrder(deletingId)
                    }
                  }}
                  disabled={isDeleting}
                  className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
                    </span>
                  ) : (
                    deletingType === "reservation" ? "Yes, Cancel Booking" : deletingType === "message" ? "Yes, Delete Message" : "Yes, Archive Order"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
