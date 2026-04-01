"use client";

import { MapPin, ArrowRight, CalendarCheck, Clock, Cross, CheckCheck, Plane, Globe2, Handshake, Pin } from "lucide-react";
import Image from "next/image";
import persona from "@/public/personacomiendo.png";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="asistencia" className="bg-white mt-14 text-black">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* RIGHT IMAGE */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Diseña tu experiencia en México
          </h1>

          <p className="text-gray-600 text-lg">
            Creamos itinerarios personalizados para que vivas lo mejor de cada destino sin preocuparte por la logística.
          </p>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Itinerarios a medida</p>
                <p className="text-sm text-gray-600">
                  Diseñamos día por día tu viaje según tus intereses, desde aventuras y playas hasta gastronomía y cultura.
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <CheckCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Reservas exclusivas</p>
                <p className="text-sm text-gray-600">
                  Gestionamos tus lugares en los mejores sitios locales, desde fondas auténticas hasta experiencias gourmet Michelin.
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Coordinación de transporte</p>
                <p className="text-sm text-gray-600">
                  Organizamos traslados aeropuerto-hotel, renta de autos y transporte privado para que te muevas sin complicaciones.
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Tours con acceso VIP</p>
                <p className="text-sm text-gray-600">
                  Gestionamos tus excursiones y actividades de aventura con prioridad y acceso exclusivo cuando sea posible.
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Handshake className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Tendrás contacto directo con tu concierge por chat o llamada para cambios, dudas o recomendaciones instantáneas.
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Pin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Experiencias locales</p>
                <p className="text-sm text-gray-600">
                  Disfruta de cada destino como un verdadero local, con vivencias totalmente adaptadas a tus días y preferencias.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href={"/experiencias"}>
            <button className="mt-6 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition">
              Explorar experiencias
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* LEFT */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden border">
            <Image
              src={persona}
              alt="Experiencia gastronómica"
              className="object-cover w-full"
            />
          </div>
        </div>
      </div>

      {/* WHY US */}
      <div id="eligenos" className="border-t bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-semibold mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-600">
              Nos encargamos de cada detalle para que tu única ocupación sea disfrutar de la experiencia.
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-4 gap-6">

            <div className="border rounded-2xl p-6 hover:shadow-sm transition">
              <Clock className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">Acción inmediata</h3>
              <p className="text-sm text-gray-600">
                Diseñamos día por día tu viaje según tus intereses, desde aventuras y playas hasta gastronomía y cultura.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:shadow-sm transition">
              <MapPin className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">Expertos locales</h3>
              <p className="text-sm text-gray-600">
                Conocemos los rincones más auténticos y exclusivos de México. Accede a experiencias que no encontrarás en guías turísticas convencionales.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:shadow-sm transition">
              <CalendarCheck className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">Planificación perfecta</h3>
              <p className="text-sm text-gray-600">
                Planificación transparente y sin cargos ocultos. Diseñamos rutas optimizadas para que aproveches cada minuto de tu estancia sin estrés.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:shadow-sm transition">
              <Cross className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">Cuidado personal</h3>
              <p className="text-sm text-gray-600">
                Tu seguridad y bienestar son nuestra prioridad. Adaptamos cada reserva a tus gustos, alergias o preferencias específicas.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}