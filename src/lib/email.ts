// /lib/email.ts
export async function sendConfirmationEmail(data: any) {
  console.log("📧 Enviando email a:", data.email);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Email enviado");
      resolve(true);
    }, 1500);
  });
}