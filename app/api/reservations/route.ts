import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { sendEmailConfirmation, sendWhatsappConfirmation } from "@/lib/notifications"

const reservationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(160),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required").max(20),
  guests: z.coerce.number().int().min(1).max(8),
  specialRequests: z.string().trim().max(500).optional().or(z.literal("")),
  sendWhatsapp: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = reservationSchema.parse(body)
    const reservationDate = new Date(`${data.date}T00:00:00`)

    if (Number.isNaN(reservationDate.getTime())) {
      return NextResponse.json(
        { message: "Please choose a valid reservation date." },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: reservationDate,
        time: data.time,
        guests: data.guests,
        specialRequests: data.specialRequests || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        date: true,
        time: true,
        guests: true,
        specialRequests: true,
        createdAt: true,
      },
    })

    // Trigger Email & WhatsApp notifications
    let emailSent = false
    let whatsappSent = false

    try {
      emailSent = await sendEmailConfirmation(reservation)
      if (data.sendWhatsapp) {
        whatsappSent = await sendWhatsappConfirmation(reservation)
      }
    } catch (notifError) {
      console.error("❌ Notification dispatch failed:", notifError)
    }

    return NextResponse.json({
      reservation,
      emailSent,
      whatsappSent: data.sendWhatsapp ? whatsappSent : false
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid reservation details." },
        { status: 400 }
      )
    }

    console.error("Reservation create failed", error)
    return NextResponse.json(
      { message: "Something went wrong while saving your reservation." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        date: "asc",
      },
    })
    return NextResponse.json({ reservations }, { status: 200 })
  } catch (error) {
    console.error("Fetch reservations failed", error)
    return NextResponse.json(
      { message: "Unable to retrieve reservations." },
      { status: 500 }
    )
  }
}
