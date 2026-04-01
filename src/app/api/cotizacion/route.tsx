import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { nombre, email, telefono, personas, experiencia_title, detalles, id } = data;

        const shortId = id ? id.substring(0, 8).toUpperCase() : "WNDR";
        const statusLink = `https://wondermx.com/pagarcotizacion?quoteId=${id}`;
        const adminEditLink = `https://wondermx.com/admin/cotizaciones/${id}`;

        // 1. EMAIL PARA EL CLIENTE (Diseño Minimalista Negro/Blanco)
        await resend.emails.send({
            from: "Wonder MX <contacto@wondermx.com>",
            to: email,
            subject: `Confirmación de Solicitud: (#${shortId})`,
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background-color: #ffffff; margin: 0; padding: 0; }
        .wrapper { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000000; }
        .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: 12px; margin: 0; text-transform: uppercase; }
        .badge { display: inline-block; background-color: #000; color: #fff; padding: 6px 12px; border-radius: 50px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .title { font-size: 32px; font-weight: 300; line-height: 1.2; margin-bottom: 20px; letter-spacing: -1px; }
        .body-text { font-size: 16px; line-height: 1.7; color: #444; margin-bottom: 40px; }
        .details-grid { background-color: #fcfcfc; border: 1px solid #eee; border-radius: 24px; padding: 30px; margin-bottom: 40px; }
        .detail-row { display: block; margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-size: 10px; font-weight: 900; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; display: block; }
        .value { font-size: 14px; font-weight: 500; color: #000; }
        .cta-container { text-align: center; margin-top: 40px; }
        .btn-black { display: inline-block; background-color: #000; color: #ffffff !important; text-decoration: none; padding: 20px 40px; border-radius: 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; }
        .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <p class="logo">WONDER MX</p>
        </div>
        
        <div style="text-align: center;">
          <span class="badge">Estatus: Pendiente</span>
          <h1 class="title">Tu próxima aventura <br/> está siendo diseñada.</h1>
          <p class="body-text">Hola ${nombre.split(' ')[0]}, hemos recibido tu solicitud para <strong>${experiencia_title}</strong>. Nuestro equipo concierge está validando disponibilidad para ofrecerte una propuesta excepcional.</p>
        </div>
        
        <div class="details-grid">
          <div class="detail-row">
            <span class="label">Folio de seguimiento</span>
            <span class="value">#${shortId}</span>
          </div>
          <div class="detail-row">
            <span class="label">Configuración</span>
            <span class="value">${personas}</span>
          </div>
          <div class="detail-row">
            <span class="label">Notas adicionales</span>
            <span class="value">${detalles || "Sin especificaciones"}</span>
          </div>
        </div>

        <div class="cta-container">
          <a href="${statusLink}" class="btn-black">Consultar mi solicitud</a>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">Recibirás una respuesta en menos de 24 horas.</p>
        </div>

        <div class="footer">
          <p>WONDER MX &copy; ${new Date().getFullYear()} | MÉXICO</p>
          <p style="margin-top: 10px;">luxury & concierge services</p>
        </div>
      </div>
    </body>
    </html>
  `,
        });

        // 2. EMAIL PARA EL ADMINISTRADOR (Notificación Crítica)
        await resend.emails.send({
            from: "Wonder MX System <sistema@wondermx.com>",
            to: "contacto@wondermx.com",
            subject: `🚨 NUEVA COTIZACIÓN: ${nombre} (#${shortId})`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border: 2px solid #000; border-radius: 24px;">
          <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px;">Nueva Solicitud Pendiente</h2>
          
          <p style="font-size: 14px;"><strong>Cliente:</strong> ${nombre}</p>
          <p style="font-size: 14px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 14px;"><strong>Teléfono:</strong> ${telefono}</p>
          <p style="font-size: 14px;"><strong>Experiencia:</strong> <span style="background: #000; color: #fff; padding: 2px 8px;">${experiencia_title}</span></p>
          
          <div style="margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 12px; font-style: italic; font-size: 13px;">
            "${detalles || "Sin detalles"}"
          </div>

          <a href="${adminEditLink}" style="display: block; background: #000; color: #fff; text-align: center; padding: 18px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
            Definir Precio y Enviar
          </a>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error en API Cotización:", error);
        return NextResponse.json({ error: "Error al procesar la cotización" }, { status: 500 });
    }
}