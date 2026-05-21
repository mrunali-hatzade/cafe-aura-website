import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const messageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(5, "Message must be at least 5 characters.")
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = messageSchema.parse(body)

    const savedMessage = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message
      }
    })

    return NextResponse.json({ success: true, message: savedMessage }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid message details." },
        { status: 400 }
      )
    }

    console.error("Save message failed:", error)
    return NextResponse.json(
      { message: "Unable to send your message. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error("Fetch messages failed:", error)
    return NextResponse.json(
      { message: "Unable to retrieve messages." },
      { status: 500 }
    )
  }
}
