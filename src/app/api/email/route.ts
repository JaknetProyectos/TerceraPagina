// /app/api/email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";



const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Lógica de personalización por Status
    const statusConfig: any = {
      pending: {
        title: "RESERVACIÓN RECIBIDA",
        welcome: "Estamos procesando tu solicitud.",
        color: "#f57c00", // Naranja
        bg: "#fff3e0"
      },
      confirmed: {
        title: "RESERVACIÓN CONFIRMADA 🎉",
        welcome: "¡Prepara las maletas! Tu lugar está asegurado.",
        color: "#2e7d32", // Verde
        bg: "#e8f5e9"
      },
      completed: {
        title: "EXPERIENCIA FINALIZADA",
        welcome: "Gracias por viajar con nosotros. ¡Esperamos verte pronto!",
        color: "#1976d2", // Azul
        bg: "#e3f2fd"
      },
      cancelled: {
        title: "RESERVACIÓN CANCELADA",
        welcome: "Tu reservación ha sido cancelada exitosamente.",
        color: "#d32f2f", // Rojo
        bg: "#ffebee"
      }
    };

    const config = statusConfig[data.status] || statusConfig.pending;

    await resend.emails.send({
      from: "Viva Trip <onboarding@resend.dev>", // Cambia por tu correo verificado
      to: data.email,
      subject: `${config.title}: ${data.activity_title}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f4f4f4; }
        .header h1 { margin: 0; color: #1a1a1a; font-size: 22px; font-weight: bold; letter-spacing: 1px; }
        .content { padding: 30px 0; }
        .welcome { font-size: 18px; margin-bottom: 10px; color: #444; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fafafa; border-radius: 6px; overflow: hidden; }
        .details-table td { padding: 15px; border-bottom: 1px solid #eeeeee; }
        .label { font-weight: 600; color: #666666; text-transform: uppercase; font-size: 11px; width: 35%; }
        .value { color: #1a1a1a; font-size: 14px; }
        .total-row { background-color: #f0f0f0; font-weight: bold; }
        .footer { text-align: center; padding: 20px; font-size: 11px; color: #999999; border-top: 1px solid #f4f4f4; margin-top: 30px; }
        .status-badge { 
          display: inline-block; 
          padding: 6px 14px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: bold;
          background-color: ${config.bg}; 
          color: ${config.color}; 
          text-transform: uppercase; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: ${config.color}">${config.title}</h1>
        </div>
        
        <div class="content">
          <p class="welcome">Hola <strong>${data.nombre}</strong>,</p>
          <p>${config.welcome}</p>
          <div style="margin: 20px 0;">
            <span class="status-badge">${data.status}</span>
          </div>
          
          <table class="details-table">
            <tr>
              <td class="label">ID de Reserva</td>
              <td class="value">#${data.id.toString().substring(0,8).toUpperCase()}</td>
            </tr>
            <tr>
              <td class="label">Experiencia</td>
              <td class="value"><strong>${data.activity_title}</strong></td>
            </tr>
            <tr>
              <td class="label">Destino</td>
              <td class="value">${data.destination_name}</td>
            </tr>
            <tr>
              <td class="label">Fecha de Actividad</td>
              <td class="value">${data.fecha}</td>
            </tr>
            <tr>
              <td class="label">Participantes</td>
              <td class="value">${data.personas} ${data.personas > 1 ? 'personas' : 'persona'}</td>
            </tr>
            <tr class="total-row">
              <td class="label">Total Pagado/A pagar</td>
              <td class="value" style="font-size: 16px;">$${data.price}</td>
            </tr>
          </table>

          <p style="margin-top: 30px; font-size: 13px; color: #666;">
            Dudas o aclaraciones: <strong>contacto@vivatrip.mx</strong>
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Viva Trip México | Experiencias Inolvidables</p>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}