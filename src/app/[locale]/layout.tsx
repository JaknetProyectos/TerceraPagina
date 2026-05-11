import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import ClientBody from "./ClientBody"; 
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { GoogleTagManager } from "@next/third-parties/google";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ESPERAR PARAMS (Next.js 15 Sync Dynamic APIs Fix)
  const { locale } = await params;

  // Validar que el idioma existe en nuestra config
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Carga de mensajes
  const messages = await getMessages();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <body suppressHydrationWarning className="antialiased font-work-sans">
      <NextIntlClientProvider messages={messages} locale={locale}>
        <CartProvider>
          <ClientBody>
            {children}
          </ClientBody>
        </CartProvider>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </NextIntlClientProvider>
    </body>
  );
}