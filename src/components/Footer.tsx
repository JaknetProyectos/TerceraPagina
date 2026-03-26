import Link from "next/link";
import visa from "@/public/visa.png"
import mastercard from "@/public/mastercard.png"
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid md:grid-cols-2 items-center justify-center align-middle gap-10">
          {/** Logos */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Aceptamos</h4>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <Image src={visa} alt="visa" width={60} />
              <Image src={mastercard} alt="mastercard" width={60} />
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacidad" className="hover:text-white transition">
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link href="/reembolsos" className="hover:text-white transition">
                  Política de reembolsos
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h4 className="font-medium mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Tel: +52 55 5553 0509</li>
              <li>
                <a
                  href="mailto:contacto@ournexttrip.com.mx"
                  className="hover:text-white transition"
                >
                  contacto@wondermx.com.mx
                </a>
              </li>
            </ul>
          </div>

          {/* DIRECCIÓN + PAGOS */}
          <div>
            <h4 className="font-medium mb-4">Dirección</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Av. Tamaulipas 150, Piso 18 - Int. 1801, Col. Hipódromo,
              Alc. Cuauhtémoc, C.P. 06100, Ciudad de México.
            </p>

            {/* PAGOS */}

          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} WonderMX. Todos los derechos reservados.
          </p>

          <div className="text-sm text-gray-500">
            Hecho en México 🇲🇽
          </div>

        </div>
      </div>
    </footer>
  );
}