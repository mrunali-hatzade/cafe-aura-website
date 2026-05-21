import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendOrderConfirmation } from "@/lib/notifications"
import { z } from "zod"

const orderItemSchema = z.object({
  itemName: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().min(0)
})

const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  customerEmail: z.string().email("Valid email is required."),
  phone: z.string().min(7, "Phone must be at least 7 digits."),
  deliveryType: z.enum(["Dine-in", "Takeaway", "Delivery"]),
  address: z.string().optional().nullable(),
  paymentMethod: z.enum(["UPI", "Card", "COD"]),
  paymentStatus: z.enum(["Paid", "Pending"]),
  totalAmount: z.number().min(0),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item.")
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = orderSchema.parse(body)

    // Save order in SQLite using nested write for OrderItems
    const newOrder = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        phone: data.phone,
        deliveryType: data.deliveryType,
        address: data.address || "",
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        orderStatus: "Preparing", // Default status
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Dispatch premium customer invoice (real SMTP or visual logging fallback)
    try {
      await sendOrderConfirmation({
        id: newOrder.id,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        phone: newOrder.phone,
        deliveryType: newOrder.deliveryType,
        address: newOrder.address,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        totalAmount: newOrder.totalAmount,
        items: newOrder.items.map((i) => ({
          itemName: i.itemName,
          quantity: i.quantity,
          price: i.price
        }))
      })
    } catch (notifErr) {
      console.error("Order notification failed:", notifErr)
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid order payload." },
        { status: 400 }
      )
    }

    console.error("Order placement failed:", error)
    return NextResponse.json(
      { message: "Unable to process your order. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error("Fetch orders failed:", error)
    return NextResponse.json(
      { message: "Unable to load order records." },
      { status: 500 }
    )
  }
}
