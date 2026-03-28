import { Reservation } from "@/hooks/useReservations";

// /lib/email.ts
export async function sendConfirmationEmail(data: Reservation) {
  try {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(res)

    if (!res.ok) throw new Error("Error enviando email");

    return true;
  } catch (error) {
    console.error("❌ Error email:", error);
    return false;
  }
}