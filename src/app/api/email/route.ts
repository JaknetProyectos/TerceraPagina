// /app/api/email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";



const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data)
    console.log(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: "Resend <onboarding@resend.dev>",
      to: data.email,
      subject: "Confirmación de reservación",
      html: `
        <h2>Reservación confirmada 🎉</h2>
        <p><strong>Experiencia:</strong> ${data.activity_title}</p>
        <p><strong>Destino:</strong> ${data.destination_name}</p>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
        <p><strong>Personas:</strong> ${data.personas}</p>
        <p><strong>Total:</strong> $${data.price}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}