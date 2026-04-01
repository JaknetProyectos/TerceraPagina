import { CheckoutInfo } from "@/interfaces/CheckoutInfo";
import { Reservation } from "@/interfaces/Reservations";


// /lib/email.ts
export async function sendConfirmationEmail(data: Reservation | Reservation[], checkoutInfo?: CheckoutInfo) {
  try {
    // Si es un array, usamos la ruta de checkout, si no, la de email individual
    const endpoint = Array.isArray(data) ? "/api/checkout" : "/api/email";

    const payload = Array.isArray(data)
      ? { reservations: data, checkoutInfo }
      : data;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error enviando email");
    return true;
  } catch (error) {
    console.error("❌ Error email:", error);
    return false;
  }
}