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
            from: "Wonder MX <contacto@wondermx.com>",
            to: customerEmail,
            subject: `Confirmación de Pedido #${checkoutInfo.orderId} 🛒`,
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
        .header { background-color: #1a1a1a; color: white; text-align: center; padding: 40px 20px; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: 3px; font-weight: 300; }
        .content { padding: 30px; background-color: #fff; }
        .order-meta { margin-bottom: 30px; text-align: center; }
        .order-meta h2 { font-size: 24px; margin: 0; color: #1a1a1a; }
        .order-meta p { color: #888; font-size: 14px; margin: 5px 0; }
        
        /* Tabla de Ticket */
        .ticket-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .ticket-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: #999; padding: 10px 0; border-bottom: 1px solid #eee; }
        .ticket-table td { padding: 15px 0; border-bottom: 1px solid #f9f9f9; font-size: 14px; }
        .price-col { text-align: right; font-weight: bold; }
        
        /* Totales */
        .summary-section { margin-top: 20px; border-top: 2px solid #1a1a1a; padding-top: 15px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-label { color: #666; }
        .summary-value { font-weight: bold; text-align: right; width: 100%; }

        /* Facturación */
        .billing-card { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px; border: 1px solid #eee; }
        .billing-card h3 { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 15px; letter-spacing: 1px; }
        .billing-details { font-size: 13px; color: #444; line-height: 1.8; }

        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 11px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>WONDER MX</h1>
        </div>
        
        <div class="content">
          <div class="order-meta">
            <h2>Resumen del pedido</h2>
            <p>Pedido #${checkoutInfo.orderId} • ${checkoutInfo.orderDate}</p>
          </div>

          <table class="ticket-table">
            <thead>
              <tr>
                <th>Experiencia</th>
                <th style="text-align: center;">Pax</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(res => `
                <tr>
                  <td>
                    <strong>${res.activityTitle ?? res?.activity_title}</strong><br>
                    <span style="font-size: 12px; color: #888;">${res.fecha}</span>
                  </td>
                  <td style="text-align: center;">x ${res.personas}</td>
                  <td class="price-col">$${res.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <table width="100%">
              <tr>
                <td class="summary-label">Subtotal:</td>
                <td class="summary-value" style="font-size: 18px;">${checkoutInfo.subtotal}</td>
              </tr>
              <tr>
                <td class="summary-label">Método de pago:</td>
                <td class="summary-value" style="font-weight: normal; font-size: 13px;">${checkoutInfo.metodoPago}</td>
              </tr>
            </table>
          </div>

          <div class="billing-card">
            <h3>Dirección de facturación</h3>
            <div class="billing-details">
              <strong>${checkoutInfo.billingAddress.nombre}</strong><br>
              ${checkoutInfo.billingAddress.calle}<br>
              ${checkoutInfo.billingAddress.ciudad}, ${checkoutInfo.billingAddress.codigoPostal}<br>
              Tel: ${checkoutInfo.billingAddress.telefono}<br>
              ${checkoutInfo.billingAddress.email}
            </div>
          </div>

          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
            Si necesitas ayuda con tu pedido contesta este correo o escribe a <strong>contacto@wondermx.com</strong>
          </p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Wonder MX | wondermx.com
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