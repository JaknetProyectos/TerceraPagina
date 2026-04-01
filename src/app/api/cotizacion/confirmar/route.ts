import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, nombre, email, precio_final, experiencia_slug, personas } = data;

    // Generamos el enlace directo con el query param
    const paymentLink = `https://vivamytrip.com/pagatuaventura?quoteId=${id}`;

    await resend.emails.send({
      from: "Viva Trip <contacto@vivamytrip.com>",
      to: email,
      subject: `✅ Propuesta Lista: ${experiencia_slug} - Folio ${id.substring(0, 8).toUpperCase()}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .main-container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; }
        .hero { background-color: #03A9F4; padding: 40px 20px; text-align: center; color: white; }
        .hero h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
        .content { padding: 40px; color: #444; }
        .price-box { background-color: #f9f9f9; border: 2px dashed #03A9F4; padding: 30px; text-align: center; border-radius: 12px; margin: 25px 0; }
        .price-label { font-size: 12px; text-transform: uppercase; color: #888; font-weight: bold; letter-spacing: 1px; }
        .price-value { font-size: 38px; color: #212121; font-weight: 900; margin: 5px 0; }
        .details-list { width: 100%; border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px; }
        .detail-item { font-size: 13px; margin-bottom: 8px; color: #666; }
        .btn-pay { display: block; background-color: #FF9800; color: #ffffff !important; text-decoration: none; padding: 18px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; margin-top: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 11px; color: #999; }
        .folio { font-family: monospace; font-size: 12px; color: #03A9F4; background: #E3F2FD; padding: 4px 8px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="main-container">
        <div class="hero">
          <h1>¡Tu aventura te espera!</h1>
        </div>
        
        <div class="content">
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Nuestro equipo de expertos ha finalizado el diseño de tu itinerario personalizado. Estamos listos para hacer realidad tu viaje a <strong>${experiencia_slug}</strong>.</p>
          
          <div class="price-box">
            <span class="price-label">Inversión Total</span>
            <div class="price-value">$${Number(precio_final).toLocaleString()} MXN</div>
            <span class="folio">FOLIO: ${id.toUpperCase()}</span>
          </div>

          <div class="details-list">
            <div class="detail-item"><strong>Viajeros:</strong> ${personas}</div>
            <div class="detail-item"><strong>Estatus:</strong> Precio Confirmado ✅</div>
          </div>

          <a href="${paymentLink}" class="btn-pay">Pagar y Confirmar Ahora</a>

          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
            Este enlace es único para tu sesión de pago seguro. <br>
            Si prefieres asistencia personal, <a href="https://wa.me/TUNUMERO" style="color: #03A9F4;">contáctanos por WhatsApp</a>.
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Viva Trip México | vivamytrip.com</p>
          <p>Este es un correo automático, por favor no respondas directamente.</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}