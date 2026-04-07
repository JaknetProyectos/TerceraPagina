"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ArmaAventuraSection() {
  // Usamos el nombre del componente como namespace único
  const t = useTranslations("ArmaAventuraSection");

  return (
    <section className="relative bg-white text-black">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* IMAGE */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="https://ournexttrip.com.mx/wp-content/uploads/2026/02/couple-doing-selfie-street-scaled.jpg"
                alt={t("image_alt")}
                width={500}
                height={900}
                className="object-cover w-full h-[300px] lg:h-[700px]"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-6">
            <p className="text-4xl md:text-5xl font-semibold leading-tight">
              {t("title")}
            </p>

            <div className="space-y-6">
              <p className="text-sm leading-relaxed tracking-wide max-w-2xl">
                {t("description")}
              </p>

              <h3 className="text-lg font-semibold ">
                {t("list_title")}
              </h3>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">{t("items.itineraries.label")}</span>
                    {t("items.itineraries.text")}
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">{t("items.restaurants.label")}</span>
                    {t("items.restaurants.text")}
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">{t("items.transport.label")}</span>
                    {t("items.transport.text")}
                  </p>
                </li>

                <li className="flex gap-3">
                  <span className=" mt-1">•</span>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold ">{t("items.tours.label")}</span>
                    {t("items.tours.text")}
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