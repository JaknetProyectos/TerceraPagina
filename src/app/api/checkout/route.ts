import { CheckoutInfo } from "@/interfaces/CheckoutInfo";
import { Reservation } from "@/interfaces/Reservations";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      reservations,
      checkoutInfo
    }: { reservations: Reservation[], checkoutInfo: CheckoutInfo } = await req.json();

    const customerEmail = checkoutInfo.billingAddress.email;

    await resend.emails.send({
      // Actualizado al dominio correcto .com.mx
      from: "Wonder MX <contacto@wondermx.com.mx>",
      // Se envía a ambos: al cliente y a la central
      to: [customerEmail, "contacto@wondermx.com.mx"],
      subject: `CONFIRMACIÓN DE PEDIDO #${checkoutInfo.orderId} 🛒`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000000; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; }
        .header { background-color: #000000; color: #ffffff; text-align: center; padding: 50px 20px; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 6px; font-weight: bold; text-transform: uppercase; }
        .content { padding: 40px 30px; }
        .order-meta { margin-bottom: 40px; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .order-meta h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; }
        .order-meta p { color: #888; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        
        /* Estilo Ticket Shein */
        .ticket-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .ticket-table th { text-align: left; font-size: 10px; text-transform: uppercase; color: #999; padding: 15px 0; border-bottom: 1px solid #eee; letter-spacing: 1px; }
        .ticket-table td { padding: 20px 0; border-bottom: 1px solid #fafafa; font-size: 13px; vertical-align: top; }
        .price-col { text-align: right; font-weight: bold; font-size: 14px; }
        
        .summary-section { margin-top: 30px; padding: 20px; background-color: #f9f9f9; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
        .summary-value { font-weight: bold; text-align: right; font-size: 16px; }

        .billing-card { border: 1px solid #eee; padding: 25px; margin-top: 40px; }
        .billing-card h3 { font-size: 11px; text-transform: uppercase; color: #000; margin: 0 0 15px 0; letter-spacing: 2px; font-weight: bold; }
        .billing-details { font-size: 12px; color: #666; line-height: 1.8; text-transform: uppercase; }

        .footer { background: #000000; padding: 40px 20px; text-align: center; font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
        .footer p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>WONDER MX</h1>
        </div>
        
        <div class="content">
          <div class="order-meta">
            <h2>Gracias por tu compra</h2>
            <p>Orden #${checkoutInfo.orderId} • ${checkoutInfo.orderDate}</p>
          </div>

          <table class="ticket-table">
            <thead>
              <tr>
                <th>Item / Detalle</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(res => `
                <tr>
                  <td>
                    <span style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${res.activityTitle ?? res?.activity_title}
                    </span><br>
                    <span style="font-size: 11px; color: #999; text-transform: uppercase;">Reserva: ${res.fecha}</span>
                  </td>
                  <td style="text-align: center; font-weight: bold;">${res.personas}</td>
                  <td class="price-col">$${Number(res.price).toLocaleString('es-MX')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <table width="100%">
              <tr>
                <td class="summary-label">Total del Pedido:</td>
                <td class="summary-value">$${checkoutInfo.subtotal} MXN</td>
              </tr>
              <tr>
                <td class="summary-label" style="padding-top: 10px;">Método de Pago:</td>
                <td class="summary-value" style="font-weight: normal; font-size: 12px; padding-top: 10px; text-transform: uppercase;">
                  ${checkoutInfo.metodoPago}
                </td>
              </tr>
            </table>
          </div>

          <div class="billing-card">
            <h3>Información de Facturación</h3>
            <div class="billing-details">
              <strong>${checkoutInfo.billingAddress.nombre}</strong><br>
              ${checkoutInfo.billingAddress.calle}<br>
              ${checkoutInfo.billingAddress.ciudad}, CP ${checkoutInfo.billingAddress.codigoPostal}<br>
              T: ${checkoutInfo.billingAddress.telefono}<br>
              E: ${checkoutInfo.billingAddress.email}
            </div>
          </div>

          <p style="text-align: center; font-size: 10px; color: #bbb; margin-top: 50px; text-transform: uppercase; letter-spacing: 1px;">
            Este es un recibo oficial de Wonder MX. <br>
            Para cualquier aclaración: <strong>contacto@wondermx.com.mx</strong>
          </p>
        </div>

        <div class="footer">
          <p style="color: #fff;">WONDER MX | MÉXICO</p>
          <p>© ${new Date().getFullYear()} - ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error enviando ticket" }, { status: 500 });
  }
}