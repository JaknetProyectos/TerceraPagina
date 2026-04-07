"use client";

import { Link, usePathname } from "@/i18n/routing";
import visa from "@/public/visa.png";
import mastercard from "@/public/mastercard.png";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 items-start gap-10">
          {/** Logos y Selector de Idioma */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">{t('payments.title')}</h4>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Image src={visa} alt="visa" width={60} />
                <Image src={mastercard} alt="mastercard" width={60} />
              </div>
            </div>

            {/* BOTÓN CAMBIO DE IDIOMA */}
            <div className="pt-4">
              <h4 className="font-medium mb-3 text-xs uppercase tracking-widest opacity-50">{t('language.title')}</h4>
              <div className="flex gap-2">
                <Link
                  href={pathname}
                  locale="es"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all text-xs font-bold ${
                    locale === 'es' 
                    ? "border-white bg-white text-black" 
                    : "border-white/20 text-white/60 hover:border-white/50"
                  }`}
                >
                  <span className="text-base">🇪🇸</span> ESP
                </Link>
                <Link
                  href={pathname}
                  locale="en"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all text-xs font-bold ${
                    locale === 'en' 
                    ? "border-white bg-white text-black" 
                    : "border-white/20 text-white/60 hover:border-white/50"
                  }`}
                >
                  <span className="text-base">🇬🇧</span> ENG
                </Link>
              </div>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-medium mb-4">{t('legal.title')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/legal/privacidad" className="hover:text-white transition">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/legal/reembolsos" className="hover:text-white transition">
                  {t('legal.refunds')}
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="hover:text-white transition">
                  {t('legal.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h4 className="font-medium mb-4">{t('contact.title')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t('contact.tel')}: +52 55 5553 0509</li>
              <li>
                <a
                  href="mailto:contacto@wondermx.com.mx"
                  className="hover:text-white transition"
                >
                  contacto@wondermx.com.mx
                </a>
              </li>
            </ul>
          </div>

          {/* DIRECCIÓN */}
          <div>
            <h4 className="font-medium mb-4">{t('address.title')}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Av. Tamaulipas 150, Piso 18 - Int. 1801, Col. Hipódromo,
              Alc. Cuauhtémoc, C.P. 06100, Ciudad de México.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} WonderMX. {t('bottom.rights')}
          </p>
          <div className="text-sm text-gray-500">
            {t('bottom.made_in')} 🇲🇽
          </div>
        </div>
      </div>
    </footer>
  );
}