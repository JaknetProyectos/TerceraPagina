"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ArmaAventuraSection() {
  return (
    <section className="relative bg-white text-black">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="https://ournexttrip.com.mx/wp-content/uploads/2026/02/couple-doing-selfie-street-scaled.jpg"
                alt="Grupo de viajeros"
                width={500}
                height={900}
                className="object-cover w-full h-[300px] lg:h-[700px]"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-6">



            <p className="text-4xl md:text-5xl font-semibold leading-tight">
              Asistencia de viaje a tu medida Tu concierge personal en México
            </p>

            <div className="space-y-6">
              <p className="text-sm leading-relaxed tracking-wide max-w-2xl">
                Olvídate de planear todo por tu cuenta y de preocuparte por horarios o reservas.
                Con nuestro servicio de asistencia personalizada, adaptamos cada detalle de tu viaje
                según tus gustos, tiempo y presupuesto. Tú nos dices qué tipo de experiencias buscas,
                y nosotros nos encargamos del resto.
              </p>

              <h3 className="text-lg font-semibold ">
                Lo que podemos hacer por ti:
              </h3>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">Itinerarios a medida:</span>
                    Diseñamos día por día tu viaje según tus intereses, desde aventuras, playas,
                    gastronomía, cultura, hasta actividades de bienestar.
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">Restaurantes:</span>
                    Te mostramos los mejores lugares locales y hacemos las reservas para que solo disfrutes.
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">Transporte:</span>
                    Organizamos traslados, renta de autos y transporte privado sin complicaciones.
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">Tours exclusivos:</span>
                    Gestionamos experiencias con acceso prioritario y opciones VIP.
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">Soporte en tiempo real:</span>
                    Tendrás contacto directo con tu concierge durante todo el viaje.
                  </p>
                </li>
              </ul>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}