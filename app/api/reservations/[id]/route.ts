import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    })

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found." },
        { status: 404 }
      )
    }

    await prisma.reservation.delete({
      where: { id },
    })

    return NextResponse.json(
      { success: true, message: "Reservation successfully cancelled." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete reservation failed:", error)
    return NextResponse.json(
      { message: "Something went wrong while cancelling the reservation." },
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

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    })

    if (!reservation) {
      return NextResponse.json({ message: "Reservation not found." }, { status: 404 })
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        isSeen: body.isSeen !== undefined ? body.isSeen : reservation.isSeen
      }
    })

    return NextResponse.json({ success: true, reservation: updatedReservation }, { status: 200 })
  } catch (error) {
    console.error("Update reservation failed:", error)
    return NextResponse.json({ message: "Failed to update reservation." }, { status: 500 })
  }
}
