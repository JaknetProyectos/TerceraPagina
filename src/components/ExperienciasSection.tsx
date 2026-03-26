"use client";

import pueblo from "@/public/pueblo.png";
import Image from "next/image";

export default function ExperienciasSection() {
  return (
    <section id="experiencias" className="bg-[#1f1e58] py-20">
      <div className="container mx-auto px-4">
        {/* Big Title */}
        <h2 className="font-anton text-[#e8e0c6] text-6xl md:text-8xl lg:text-[10rem] leading-none text-center mb-16">
          EXPERIENCIAS
        </h2>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image */}
          <div className="lg:w-1/3">
            <div
              className="relative w-full h-[300px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl"
              style={{ backgroundColor: "#4a4a4a" }}
            >
              <Image
                src={pueblo}
                alt="Experiencias"
                className="absolute inset-0 w-full h-full object-cover grayscale"
                loading="eager"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-2/3 text-white">
            <p className="text-[#e8e0c6] uppercase tracking-wider mb-2">
              NUESTROS PLANES
            </p>
            <h3 className="font-anton text-[#e8e0c6] text-4xl lg:text-5xl mb-6">
              Aviso Importante
            </h3>
            <p className="text-white/80 leading-relaxed">
              El servicio de experiencia <span className="font-semibold text-white">no incluye transporte hacia o desde el punto de encuentro</span>. En caso de requerirse, el traslado deberá ser gestionado y cubierto directamente por el cliente. La empresa no asume responsabilidad por retrasos, contratiempos o gastos derivados del transporte externo contratado por el participante.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
