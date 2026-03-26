"use client";

import Image from "next/image";
import { Globe } from "lucide-react";
import pueblo from "@/public/pueblo.png";
import Link from "next/link";

export default function ConocenosSection() {
  return (
    <section id="conocenos" className="bg-black text-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border">

              <Image
                src={"https://lirp.cdn-website.com/41f05afb/dms3rep/multi/opt/Viaje+1-640w.jpg"}
                alt="Experiencias"
                width={800}
                height={600}
                className="object-cover w-full h-[400px] lg:h-[500px]"
                loading="eager"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-6">

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              ¿Ya cuentas con tu cotización?
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Si ya cuentas con una cotización enviada por tu concierge, haz clic en el botón de abajo. Ingresa los detalles de tu presupuesto y procesa tu pago de manera rápida y segura.
            </p>

            <Link href={"/experiencias"}>
              <button className="mt-6 inline-flex border-white border-solid border-2 border-s-2 items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition">
                Añadir al carrito
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}