"use client";

import { MapPin, ArrowRight, CalendarCheck, Clock, Cross, CheckCheck, Plane, Globe2, Handshake, Pin } from "lucide-react";
import Image from "next/image";
import persona from "@/public/personacomiendo.png";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section id="asistencia" className="bg-white mt-14 text-black">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            {t("title")}
          </h1>

          <p className="text-gray-600 text-lg">
            {t("subtitle")}
          </p>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.itineraries.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.itineraries.desc")}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <CheckCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.bookings.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.bookings.desc")}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.transport.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.transport.desc")}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.vip.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.vip.desc")}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Handshake className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.concierge.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.concierge.desc")}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition">
              <div className="flex-shrink-0">
                <Pin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("features.local.title")}</p>
                <p className="text-sm text-gray-600">
                  {t("features.local.desc")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href={"/experiencias"}>
            <button className="mt-6 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition">
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* LEFT IMAGE */}
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
              {t("why_us.title")}
            </h2>
            <p className="text-gray-400">
              {t("why_us.subtitle")}
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-4 gap-6">

            <div className="border border-white/10 rounded-2xl p-6 hover:shadow-sm transition">
              <Clock className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">{t("why_us.cards.immediate.title")}</h3>
              <p className="text-sm text-gray-400">
                {t("why_us.cards.immediate.desc")}
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 hover:shadow-sm transition">
              <MapPin className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">{t("why_us.cards.experts.title")}</h3>
              <p className="text-sm text-gray-400">
                {t("why_us.cards.experts.desc")}
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 hover:shadow-sm transition">
              <CalendarCheck className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">{t("why_us.cards.planning.title")}</h3>
              <p className="text-sm text-gray-400">
                {t("why_us.cards.planning.desc")}
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 hover:shadow-sm transition">
              <Cross className="w-6 h-6 mb-4" />
              <h3 className="font-medium mb-2">{t("why_us.cards.care.title")}</h3>
              <p className="text-sm text-gray-400">
                {t("why_us.cards.care.desc")}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}