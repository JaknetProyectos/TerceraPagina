import { NextResponse } from "next/server";
import { Resend } from "resend";

const parseDetailedString = (input: string) => {
  // Regex para buscar dos fechas (YYYY-MM-DD)
  const dateRegex = /(\d{4}-\d{2}-\d{2})/g;
  // Regex para capturar lo que sigue después de "Mensaje:" o "Notas:"
  const messageRegex = /(?:Mensaje|Notas|Detalles):\s*(.*)/i;

  const dates = input.match(dateRegex);
  const messageMatch = input.match(messageRegex);

  return {
    initial_date: dates && dates[0] ? dates[0] : null,
    final_date: dates && dates[1] ? dates[1] : null,
    message: messageMatch ? messageMatch[1].trim() : input // Si no hay etiqueta, devuelve el input original
  };
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nombre, email, telefono, personas, experiencia_title, detalles, id } = data;

    // Procesamos el string de detalles
    const { initial_date, final_date, message } = parseDetailedString(detalles);

    // 1. EMAIL PARA EL CLIENTE (Diseño Minimalista SHEIN/WonderMX)
    // Se elimina el ID y status para el cliente.
    await resend.emails.send({
      from: "Wonder MX <contacto@wondermx.com>",
      to: email,
      subject: `Confirmación de Solicitud - ${experiencia_title}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background-color: #ffffff; margin: 0; padding: 0; }
        .wrapper { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 60px 20px; color: #000000; }
        .header { text-align: center; margin-bottom: 50px; }
        .logo { font-size: 22px; font-weight: 900; letter-spacing: 14px; margin: 0; text-transform: uppercase; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 10px; }
        .title { font-size: 28px; font-weight: 300; line-height: 1.3; margin-top: 40px; margin-bottom: 20px; letter-spacing: 1px; text-transform: uppercase; text-align: center; }
        .body-text { font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 40px; text-align: center; letter-spacing: 0.5px; }
        .details-grid { background-color: #ffffff; border: 1px solid #f0f0f0; padding: 40px; margin-bottom: 40px; }
        .detail-row { margin-bottom: 20px; border-bottom: 1px solid #f9f9f9; padding-bottom: 15px; }
        .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-size: 9px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px; display: block; }
        .value { font-size: 13px; font-weight: 500; color: #000; letter-spacing: 1px; }
        .footer { margin-top: 80px; text-align: center; font-size: 10px; color: #bbb; letter-spacing: 2px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <p class="logo">WONDER MX</p>
        </div>
        
        <h1 class="title">Solicitud Recibida</h1>
        <p class="body-text">Hola ${nombre.split(' ')[0]}, estamos diseñando una propuesta personalizada para <strong>${experiencia_title}</strong>. Un concierge se pondrá en contacto contigo en breve.</p>
        
        <div class="details-grid">
          <div class="detail-row">
            <span class="label">Pax</span>
            <span class="value">${personas} Personas</span>
          </div>
          
          ${initial_date ? `
          <div class="detail-row">
            <span class="label">Periodo</span>
            <span class="value">${initial_date} al ${final_date}</span>
          </div>
          ` : ''}

          <div class="detail-row">
            <span class="label">Notas de viaje</span>
            <span class="value">${message}</span>
          </div>
        </div>

        <div class="footer">
          <p>WONDER MX | Luxury & Concierge Services</p>
          <p style="margin-top: 15px; font-size: 8px;">Este es un acuse de recibo automático. No es necesario responder.</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    // 2. EMAIL PARA EL ADMINISTRADOR (Notificación con ID y Status)
    await resend.emails.send({
      from: "Wonder MX System <contacto@wondermx.com>",
      to: "contacto@wondermx.com",
      subject: `NUEVA SOLICITUD: ${nombre} - ID: ${id?.substring(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee;">
          <h2 style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 10px;">Gestión de Cotización</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>ID Interno:</strong> ${id}</p>
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Contacto:</strong> ${email} | ${telefono}</p>
            <p><strong>Experiencia:</strong> ${experiencia_title}</p>
            <p><strong>Pax:</strong> ${personas}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-left: 3px solid #000; font-size: 13px;">
            <strong>Mensaje extraído:</strong><br/>
            ${message}
            ${initial_date ? `<br/><br/><strong>Fechas detectadas:</strong> ${initial_date} / ${final_date}` : ''}
          </div>

          <div style="margin-top: 30px;">
            <a href="https://wondermx.com/admin/cotizaciones/${id}" 
               style="background: #000; color: #fff; text-decoration: none; padding: 15px 25px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">
               Gestionar en Panel Admin
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API Cotización:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}