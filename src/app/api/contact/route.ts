import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, motivo, fechaSalida, fechaRegreso, personas, mensaje } = body;

    // Lógica de etiquetas según el motivo
    const isConcierge = motivo.includes("concierge");
    const subjectAdmin = isConcierge ? `✨ NUEVO PROYECTO CONCIERGE: ${nombre}` : `📩 CONSULTA WONDER MX: ${nombre}`;

    // 1. EMAIL PARA EL EQUIPO (WONDER MX)
    const adminEmail = resend.emails.send({
      from: "Wonder MX <contacto@wondermx.com>",
      to: email,
      replyTo: email,
      subject: subjectAdmin,
      html: `
            <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; border: 1px solid #000;">
                <div style="background: #000; color: #fff; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 14px; letter-spacing: 5px; font-weight: 900;">WONDER MX</h1>
                    <p style="margin: 10px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Nueva Solicitud de ${motivo}</p>
                </div>
                <div style="padding: 40px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase;">Cliente</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase;">Contacto</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${email} <br/> ${telefono}</td>
                        </tr>
                        ${isConcierge ? `
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 12px; color: #999; text-transform: uppercase;">Logística</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">
                                ${personas} personas<br/>
                                Salida: ${fechaSalida} | Regreso: ${fechaRegreso}
                            </td>
                        </tr>` : ''}
                    </table>
                    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 4px;">
                        <span style="font-size: 10px; font-weight: 900; text-transform: uppercase;">Mensaje:</span>
                        <p style="font-size: 14px; line-height: 1.6; color: #333;">${mensaje}</p>
                    </div>
                    <a href="mailto:${email}" style="display: block; margin-top: 30px; background: #000; color: #fff; text-align: center; padding: 20px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 2px;">RESPONDER AHORA</a>
                </div>
            </div>`
    });

    // 2. EMAIL PARA EL CLIENTE
    const customerEmail = resend.emails.send({
      from: "Wonder MX <contacto@wondermx.com>",
      to: email,
      subject: `Wonder MX | Hemos recibido tu solicitud`,
      html: `
            <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: auto; text-align: center; padding: 40px; border: 1px solid #eee;">
                <h1 style="font-size: 18px; letter-spacing: 8px; font-weight: 900; margin-bottom: 40px;">WONDER MX</h1>
                <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px;">Hola, ${nombre.split(' ')[0]}</h2>
                <p style="font-size: 15px; color: #666; line-height: 1.8; margin-bottom: 30px;">
                    ${isConcierge
          ? 'Tu solicitud para un viaje a medida ha sido recibida. Nuestros especialistas en concierge están revisando los detalles para diseñar una propuesta única para ti.'
          : 'Hemos recibido tu consulta. Un miembro de nuestro equipo te responderá en un plazo máximo de 24 horas.'}
                </p>
                <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 20px 0; margin-bottom: 30px;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Tu aventura comienza pronto</p>
                </div>
                <p style="font-size: 11px; color: #999;">Si tienes información adicional, responde a este correo.</p>
            </div>`
    });

    await Promise.all([adminEmail, customerEmail]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar solicitud" }, { status: 500 });
  }
}