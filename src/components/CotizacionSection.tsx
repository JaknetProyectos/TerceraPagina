"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function CotizacionSection() {
  const t = useTranslations("CotizacionSection");

  return (
    <section id="conocenos" className="bg-black text-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={"https://lirp.cdn-website.com/41f05afb/dms3rep/multi/opt/Viaje+1-640w.jpg"}
                alt={t("image_alt")}
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
              {t("title")}
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed">
              {t("description")}
            </p>

            <Link href={"/pagarcotizacion"}>
              <button className="mt-6 inline-flex border-white border-solid border-2 items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all font-medium">
                {t("button")}
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}