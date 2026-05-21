import nodemailer from "nodemailer"
import { CAFE_NAME } from "./config"

interface ReservationData {
  id: string
  name: string
  email: string
  phone: string
  date: Date
  time: string
  guests: number
  specialRequests?: string | null
}

// Visual console logs to simulate WhatsApp and Email deliveries elegantly
function logVisualConfirmation(type: "EMAIL" | "WHATSAPP", reservation: ReservationData) {
  const border = "=".repeat(60)
  const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (type === "EMAIL") {
    console.log(`\n\x1b[36m${border}\x1b[0m`)
    console.log(`\x1b[36m✉️  [SIMULATED EMAIL DISPATCH]\x1b[0m`)
    console.log(`\x1b[36m    FROM: "${CAFE_NAME}" <simplifiedworks.official@gmail.com>\x1b[0m`)
    console.log(`\x1b[36m    TO:   ${reservation.email}\x1b[0m`)
    console.log(`\x1b[36mSubject: Your Table Reservation at ${CAFE_NAME} is Confirmed! (ID: ${reservation.id})\x1b[0m`)
    console.log(`\x1b[36m${border}\x1b[0m`)
    console.log(`Dear ${reservation.name},`)
    console.log(`\nYour table reservation is confirmed! We are thrilled to host you.`)
    console.log(`\n📅 \x1b[1mDate:\x1b[0m ${formattedDate}`)
    console.log(`🕒 \x1b[1mTime:\x1b[0m ${reservation.time}`)
    console.log(`👥 \x1b[1mGuests:\x1b[0m ${reservation.guests} ${reservation.guests === 1 ? "person" : "people"}`)
    console.log(`🎟️  \x1b[1mBooking ID:\x1b[0m ${reservation.id}`)
    if (reservation.specialRequests) {
      console.log(`✍️  \x1b[1mSpecial Requests:\x1b[0m "${reservation.specialRequests}"`)
    }
    console.log(`\n📍 \x1b[1mLocation:\x1b[0m FC Road, Pune, Maharashtra 411004`)
    console.log(`📞 \x1b[1mPhone:\x1b[0m (+91) 9876543210`)
    console.log(`\nThank you for choosing ${CAFE_NAME}. If you need to make changes or cancel, please contact us.`)
    console.log(`\x1b[36m${border}\n\x1b[0m`)
  } else {
    console.log(`\n\x1b[32m${border}\x1b[0m`)
    console.log(`\x1b[32m💬 [SIMULATED WHATSAPP DISPATCH]\x1b[0m`)
    console.log(`\x1b[32m    FROM: +91 97673 55347 (${CAFE_NAME} Official)\x1b[0m`)
    console.log(`\x1b[32m    TO:   ${reservation.phone}\x1b[0m`)
    console.log(`\x1b[32mStatus: DELIVERED (WhatsApp Business API)\x1b[0m`)
    console.log(`\x1b[32m${border}\x1b[0m`)
    console.log(`*☕ ${CAFE_NAME} - Table Reservation Confirmed!*`)
    console.log(`Hi *${reservation.name}*, your table is successfully reserved.`)
    console.log(`\n*Reservation Details:*`)
    console.log(`• 📅 *Date:* ${formattedDate}`)
    console.log(`• 🕒 *Time:* ${reservation.time}`)
    console.log(`• 👥 *Guests:* ${reservation.guests} pax`)
    console.log(`• 🎟️  *Booking ID:* ${reservation.id}`)
    console.log(`\n*Guidelines:*`)
    console.log(`- Tables are held for a maximum of 15 minutes past booking time.`)
    console.log(`- Your table is reserved for a duration of 2 hours.`)
    console.log(`- Location: https://maps.google.com/?q=FC+Road+Pune`)
    console.log(`\nReply *CANCEL* to cancel your seat, or *HELP* to reach our baristas.`)
    console.log(`See you soon! 👋`)
    console.log(`\x1b[32m${border}\n\x1b[0m`)
  }
}

export async function sendEmailConfirmation(reservation: ReservationData): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  // If SMTP configs exist, send a real email
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: parseInt(SMTP_PORT, 10) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000
      })

      const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #24160f; color: #ffffff; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-family: serif; font-size: 28px; color: #d99755;">${CAFE_NAME}</h1>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.8; letter-spacing: 2px;">Table Confirmation</p>
          </div>
          <div style="padding: 32px; color: #333333; line-height: 1.6; background-color: #faf8f6;">
            <h2 style="color: #24160f; margin-top: 0; font-size: 22px;">Reservation Confirmed!</h2>
            <p>Dear ${reservation.name},</p>
            <p>Thank you for booking with us. We have successfully reserved a table for you! Here are your booking details:</p>
            
            <div style="background-color: #ffffff; border: 1px solid #eae2d8; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #555555; width: 120px;">📅 Date:</td>
                  <td style="padding: 6px 0; color: #24160f;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #555555;">🕒 Time:</td>
                  <td style="padding: 6px 0; color: #24160f;">${reservation.time}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #555555;">👥 Guests:</td>
                  <td style="padding: 6px 0; color: #24160f;">${reservation.guests} ${reservation.guests === 1 ? "person" : "people"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #555555;">🎟️ Booking ID:</td>
                  <td style="padding: 6px 0; color: #d99755; font-family: monospace; font-size: 15px; font-weight: bold;">${reservation.id}</td>
                </tr>
                ${reservation.specialRequests ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #555555; vertical-align: top;">✍️ Notes:</td>
                  <td style="padding: 6px 0; color: #24160f; font-style: italic;">"${reservation.specialRequests}"</td>
                </tr>` : ""}
              </table>
            </div>
            
            <p style="margin-bottom: 0;">📍 <strong>Location:</strong> FC Road, Pune, Maharashtra 411004</p>
            <p style="margin-top: 4px;">📞 <strong>Phone:</strong> (+91) 9876543210</p>
            <hr style="border: 0; border-top: 1px solid #eae2d8; margin: 32px 0 24px 0;" />
            <p style="font-size: 13px; color: #777777; text-align: center; margin-bottom: 0;">
              If you need to adjust or cancel your reservation, please call us directly. We look forward to seeing you!
            </p>
          </div>
          <div style="background-color: #24160f; color: #ffffff; padding: 16px; text-align: center; font-size: 12px; opacity: 0.9;">
            © 2026 ${CAFE_NAME}. FC Road, Pune.
          </div>
        </div>
      `

      const finalFrom = SMTP_FROM ?? `"${CAFE_NAME}" <simplifiedworks.official@gmail.com>`
      await transporter.sendMail({
        from: finalFrom,
        to: reservation.email,
        subject: `Your Table Reservation at ${CAFE_NAME} is Confirmed!`,
        html: htmlContent,
      })

      console.log(`📧 [REAL EMAIL SENT] successfully dispatched from ${finalFrom} to ${reservation.email}`)
      return true
    } catch (error) {
      console.error("❌ Failed to dispatch real email confirmation:", error)
      // Fallback to visual logging so development flow is never blocked
      logVisualConfirmation("EMAIL", reservation)
      return false
    }
  }

  // Fallback to gorgeous terminal visual logging
  logVisualConfirmation("EMAIL", reservation)
  return true
}

export async function sendWhatsappConfirmation(reservation: ReservationData): Promise<boolean> {
  // Simulating a real WhatsApp Business API sending delay and dispatch
  await new Promise((resolve) => setTimeout(resolve, 800))
  logVisualConfirmation("WHATSAPP", reservation)
  return true
}

interface OrderItemData {
  itemName: string
  quantity: number
  price: number
}

interface OrderData {
  id: string
  customerName: string
  customerEmail: string
  phone: string
  deliveryType: string
  address?: string | null
  paymentMethod: string
  paymentStatus: string
  totalAmount: number
  items: OrderItemData[]
}

export async function sendOrderConfirmation(order: OrderData): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eae2d8; color: #24160f; font-size: 14px;">${item.itemName} x ${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eae2d8; color: #24160f; font-size: 14px; text-align: right;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #24160f; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-family: serif; font-size: 28px; color: #d99755;">${CAFE_NAME}</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.8; letter-spacing: 2px;">Order Invoice</p>
      </div>
      <div style="padding: 32px; color: #333333; line-height: 1.6; background-color: #faf8f6;">
        <h2 style="color: #24160f; margin-top: 0; font-size: 22px;">Order Placed Successfully!</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your online order has been successfully received and is being prepared with love by our baristas! Here are your invoice details:</p>
        
        <div style="background-color: #ffffff; border: 1px solid #eae2d8; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="margin: 0 0 12px 0; color: #24160f; border-bottom: 1px solid #eae2d8; padding-bottom: 8px; font-size: 14px;">📋 Order ID: <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #d99755;">${order.id}</span></h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; font-size: 12px; color: #777777;">
                <th style="padding-bottom: 8px; border-bottom: 2px solid #eae2d8;">Item</th>
                <th style="padding-bottom: 8px; border-bottom: 2px solid #eae2d8; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td style="padding: 12px 0 0 0; font-weight: bold; color: #24160f; font-size: 14px;">Total Amount Paid:</td>
                <td style="padding: 12px 0 0 0; font-weight: bold; color: #d99755; text-align: right; font-size: 16px;">Rs. ${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background-color: #fcfbfa; border: 1px solid #eae2d8; border-radius: 8px; padding: 16px; font-size: 13px; color: #555555; margin-bottom: 24px;">
          <p style="margin: 0 0 6px 0;">📍 <strong>Delivery Type:</strong> ${order.deliveryType}</p>
          ${order.address ? `<p style="margin: 0 0 6px 0;">📍 <strong>Table/Address:</strong> ${order.address}</p>` : ''}
          <p style="margin: 0 0 6px 0;">💳 <strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
          <p style="margin: 0;">📞 <strong>Contact Phone:</strong> ${order.phone}</p>
        </div>
        
        <p style="margin-bottom: 0;">📍 <strong>Cafe Location:</strong> FC Road, Pune, Maharashtra 411004</p>
        <hr style="border: 0; border-top: 1px solid #eae2d8; margin: 32px 0 24px 0;" />
        <p style="font-size: 13px; color: #777777; text-align: center; margin-bottom: 0;">
          If you need to make changes to your order, please call us directly. Thank you for ordering from ${CAFE_NAME}!
        </p>
      </div>
      <div style="background-color: #24160f; color: #ffffff; padding: 16px; text-align: center; font-size: 12px; opacity: 0.9;">
        © 2026 ${CAFE_NAME}. FC Road, Pune.
      </div>
    </div>
  `

  const border = "=".repeat(60)
  const logConsoleSlip = () => {
    console.log(`\n\x1b[35m${border}\x1b[0m`)
    console.log(`\x1b[35m🛍️  [SIMULATED CAFE ORDER INVOICE DISPATCH]\x1b[0m`)
    console.log(`\x1b[35m    FROM: "${CAFE_NAME}" <simplifiedworks.official@gmail.com>\x1b[0m`)
    console.log(`\x1b[35m    TO:   ${order.customerEmail}\x1b[0m`)
    console.log(`\x1b[35mSubject: Invoice for Order ID: ${order.id} - Confirmed!\x1b[0m`)
    console.log(`\x1b[35m${border}\x1b[0m`)
    console.log(`Dear ${order.customerName},`)
    console.log(`\nYour online order is confirmed! Our baristas are preparing it now.`)
    console.log(`\n🛍️  \x1b[1mItems Ordered:\x1b[0m`)
    order.items.forEach(item => {
      console.log(`   - ${item.itemName} x ${item.quantity} (Rs. ${item.price} each)`)
    })
    console.log(`\n💰 \x1b[1mTotal Amount:\x1b[0m Rs. ${order.totalAmount.toFixed(2)}`)
    console.log(`📍 \x1b[1mDelivery:\x1b[0m     ${order.deliveryType} ${order.address ? `(${order.address})` : ''}`)
    console.log(`💳 \x1b[1mPayment:\x1b[0m      ${order.paymentMethod} (${order.paymentStatus})`)
    console.log(`📞 \x1b[1mPhone:\x1b[0m        ${order.phone}`)
    console.log(`\nThank you for choosing ${CAFE_NAME}!`)
    console.log(`\x1b[35m${border}\n\x1b[0m`)
  }

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: parseInt(SMTP_PORT, 10) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000
      })

      const finalFrom = SMTP_FROM ?? `"${CAFE_NAME}" <simplifiedworks.official@gmail.com>`
      await transporter.sendMail({
        from: finalFrom,
        to: order.customerEmail,
        subject: `Your ${CAFE_NAME} Order Invoice: ${order.id} is Confirmed!`,
        html: emailHtml,
      })

      console.log(`📧 [ORDER INVOICE REAL EMAIL SENT] successfully dispatched to ${order.customerEmail}`)
      return true
    } catch (error) {
      console.error("❌ Failed to dispatch real order email invoice:", error)
      logConsoleSlip()
      return false
    }
  }

  logConsoleSlip()
  return true
}
