import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, nombre, email, precio_final, experiencia_title, personas, folio } = data;

    const displayFolio = folio || id.substring(0, 8).toUpperCase();
    const paymentLink = `https://wondermx.com/pagatuaventura?folio=${displayFolio}`;

    await resend.emails.send({
      from: "WONDER MX <contacto@wondermx.com>",
      to: email,
      subject: `CONFIRMACIÓN: ${experiencia_title?.toUpperCase() || 'TU VIAJE'} - #${displayFolio}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #ffffff; }
        .wrapper { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #000000; }
        .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #eeeeee; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: 5px; text-transform: uppercase; margin: 0; }
        .nav-mimic { font-size: 10px; letter-spacing: 2px; color: #888; margin-top: 10px; text-transform: uppercase; }
        
        .hero-image { width: 100%; height: 200px; background-color: #f6f6f6; object-fit: cover; }
        
        .content { padding: 40px 30px; text-align: center; }
        .greeting { font-size: 18px; font-weight: 300; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .status-badge { display: inline-block; background-color: #000; color: #fff; padding: 5px 15px; font-size: 10px; font-weight: bold; letter-spacing: 2px; margin-bottom: 30px; }
        
        .summary-card { border: 1px solid #eeeeee; margin: 20px 0; padding: 30px; text-align: left; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .summary-label { color: #888; }
        .summary-value { font-weight: bold; }
        
        .total-section { border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px; text-align: right; }
        .total-label { font-size: 10px; color: #888; text-transform: uppercase; }
        .total-price { font-size: 24px; font-weight: bold; margin-top: 5px; }
        
        .btn-checkout { display: block; background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 20px; font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: 3px; margin-top: 40px; transition: opacity 0.3s; }
        
        .footer { padding: 50px 30px; background-color: #fafafa; text-align: center; font-size: 10px; color: #aaaaaa; line-height: 1.8; text-transform: uppercase; letter-spacing: 1px; }
        .social-links { margin-bottom: 20px; font-weight: bold; color: #000; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1 class="logo">WONDER<span>MX</span></h1>
          <div class="nav-mimic">Novedades • Experiencias • Destinos</div>
        </div>

        <div class="content">
          <div class="status-badge">PRESUPUESTO LISTO</div>
          <p class="greeting">HOLA, ${nombre.toUpperCase()}</p>
          <p style="font-size: 14px; color: #666; font-weight: 300;">Hemos preparado los detalles de tu próxima aventura. Revisa tu selección y finaliza la reserva para asegurar tu lugar.</p>
          
          <div class="summary-card">
            <div class="summary-row">
              <span class="summary-label">Experiencia</span>
              <span class="summary-value">${experiencia_title || 'Custom Travel'}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">No. de cotización</span>
              <span class="summary-value">#${displayFolio}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Pasajeros</span>
              <span class="summary-value">${personas}</span>
            </div>
            
            <div class="total-section">
              <div class="total-label">Total a pagar</div>
              <div class="total-price">$${Number(precio_final).toLocaleString('es-MX')} MXN</div>
            </div>
          </div>

          <a href="${paymentLink}" class="btn-checkout">COMPRAR AHORA</a>
          
          <p style="margin-top: 30px; font-size: 11px; color: #999; letter-spacing: 1px;">
            ¿TIENES DUDAS? RESPONDE A ESTE CORREO O CONTACTA A TU ASESOR.
          </p>
        </div>

        <div class="footer">
          <div class="social-links">INSTAGRAM • FACEBOOK • TIKTOK</div>
          <p>ESTÁS RECIBIENDO ESTE CORREO PORQUE SOLICITASTE UNA COTIZACIÓN EN WONDERMX.COM</p>
          <p>&copy; ${new Date().getFullYear()} WONDER MX MÉXICO. TODOS LOS DERECHOS RESERVADOS.</p>
          <p style="margin-top: 20px; color: #ccc;">#WONDERMXMOMENTS</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}