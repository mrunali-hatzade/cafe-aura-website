import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json(
        { message: "Message not found." },
        { status: 404 }
      )
    }

    await prisma.message.delete({
      where: { id },
    })

    return NextResponse.json(
      { success: true, message: "Message successfully deleted." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete message failed:", error)
    return NextResponse.json(
      { message: "Something went wrong while deleting the message." },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json({ message: "Message not found." }, { status: 404 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isSeen: body.isSeen !== undefined ? body.isSeen : message.isSeen
      }
    })

    return NextResponse.json({ success: true, message: updatedMessage }, { status: 200 })
  } catch (error) {
    console.error("Update message failed:", error)
    return NextResponse.json({ message: "Failed to update message." }, { status: 500 })
  }
}
