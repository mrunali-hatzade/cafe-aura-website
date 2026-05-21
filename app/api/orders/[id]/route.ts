import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate that order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: body.orderStatus !== undefined ? body.orderStatus : existingOrder.orderStatus,
        paymentStatus: body.paymentStatus !== undefined ? body.paymentStatus : existingOrder.paymentStatus,
        isSeen: body.isSeen !== undefined ? body.isSeen : existingOrder.isSeen
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 })
  } catch (error) {
    console.error("Update order failed:", error)
    return NextResponse.json(
      { message: "Failed to update order status." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      )
    }

    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Order successfully deleted." }, { status: 200 })
  } catch (error) {
    console.error("Delete order failed:", error)
    return NextResponse.json(
      { message: "Something went wrong while deleting the order." },
      { status: 500 }
    )
  }
}
