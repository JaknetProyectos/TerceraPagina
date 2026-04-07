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
      // Se envía al cliente y copia a la central para monitoreo
      to: [customerEmail, "contacto@wondermx.com"],
      subject: `CONFIRMACION DE PEDIDO #${checkoutInfo.orderId}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000000; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        
        .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 30px; margin-bottom: 50px; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 14px; margin: 0; text-transform: uppercase; }
        
        .order-meta { margin-bottom: 50px; text-align: center; }
        .order-meta h2 { font-size: 24px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; }
        .order-meta p { color: #999; font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 3px; }
        
        /* Tabla Estilo Ticket Editorial */
        .ticket-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .ticket-table th { text-align: left; font-size: 9px; text-transform: uppercase; color: #bbb; padding: 10px 0; border-bottom: 1px solid #eee; letter-spacing: 2px; font-weight: 900; }
        .ticket-table td { padding: 25px 0; border-bottom: 1px solid #f9f9f9; font-size: 12px; vertical-align: top; }
        
        .item-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
        .item-subtitle { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
        .price-col { text-align: right; font-weight: 700; font-size: 13px; letter-spacing: 1px; }
        
        .summary-section { margin-top: 40px; border-top: 2px solid #000; padding-top: 20px; }
        .summary-row { margin-bottom: 15px; }
        .summary-label { font-size: 9px; text-transform: uppercase; color: #999; letter-spacing: 2px; font-weight: 900; }
        .summary-value { font-weight: 700; font-size: 18px; text-align: right; letter-spacing: 1px; }

        .billing-grid { margin-top: 60px; display: table; width: 100%; }
        .billing-col { display: table-cell; width: 100%; border: 1px solid #eee; padding: 30px; }
        .billing-col h3 { font-size: 9px; text-transform: uppercase; color: #000; margin: 0 0 20px 0; letter-spacing: 3px; font-weight: 900; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 5px; }
        .billing-details { font-size: 11px; color: #666; line-height: 2; text-transform: uppercase; letter-spacing: 1px; }

        .footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid #f0f0f0; text-align: center; }
        .footer-text { font-size: 9px; color: #ccc; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px; }
        .brand-footer { font-size: 11px; font-weight: 900; letter-spacing: 8px; text-transform: uppercase; color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <p class="logo">WONDER MX</p>
        </div>
        
        <div class="order-meta">
          <h2>Confirmación</h2>
          <p>Orden #${checkoutInfo.orderId} / ${checkoutInfo.orderDate}</p>
        </div>

        <table class="ticket-table">
          <thead>
            <tr>
              <th>Experiencia / Detalle</th>
              <th style="text-align: center;">Pax</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.map(res => `
              <tr>
                <td>
                  <span class="item-title">${res.activityTitle ?? res?.activity_title}</span>
                  <span class="item-subtitle">Reserva: ${res.fecha}</span>
                </td>
                <td style="text-align: center; font-weight: 700;">${res.personas}</td>
                <td class="price-col">$${Number(res.price).toLocaleString('es-MX')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary-section">
          <table width="100%">
            <tr>
              <td class="summary-label">Monto Total Pagado</td>
              <td class="summary-value">${checkoutInfo.subtotal} MXN</td>
            </tr>
            <tr>
              <td class="summary-label" style="padding-top: 15px;">Método de Pago</td>
              <td style="text-align: right; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-top: 15px;">
                ${checkoutInfo.metodoPago}
              </td>
            </tr>
          </table>
        </div>

        <div class="billing-grid">
          <div class="billing-col">
            <h3>Billing Info</h3>
            <div class="billing-details">
              <strong>${checkoutInfo.billingAddress.nombre}</strong><br>
              ${checkoutInfo.billingAddress.calle}<br>
              ${checkoutInfo.billingAddress.ciudad}, CP ${checkoutInfo.billingAddress.codigoPostal}<br>
              Teléfono: ${checkoutInfo.billingAddress.telefono}<br>
              Email: ${checkoutInfo.billingAddress.email}
            </div>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">Gracias por elegir exclusividad</p>
          <p class="brand-footer">WONDER MX</p>
          <p style="font-size: 8px; color: #eee; margin-top: 20px; letter-spacing: 1px;">MEXICO CITY | WORLDWIDE</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando ticket:", error);
    return NextResponse.json({ error: "Error interno al procesar el ticket" }, { status: 500 });
  }
}