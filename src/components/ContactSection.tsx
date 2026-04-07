"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";
import { useQuotes } from "@/hooks/useQuote";
import { useLocale, useTranslations } from "next-intl";

export default function ContactAventura() {
  const t = useTranslations("ContactAventura");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const locale = useLocale()
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    motivo: "Viaje a medida (Servicio Concierge)",
    fechaSalida: "",
    fechaRegreso: "",
    personas: "1",
    mensaje: "",
  });

  const { createQuote } = useQuotes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabaseData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        personas: formData.personas,
        experiencia_slug: formData.motivo.toLowerCase().replace(/\s+/g, '-'),
        experiencia_title: formData.motivo,
        detalles: `
          Fechas: ${formData.fechaSalida} al ${formData.fechaRegreso}
          Mensaje: ${formData.mensaje}
        `.trim(),
      };

      const newQuote = await createQuote(supabaseData as any);

      if (!newQuote?.id) throw new Error("No ID generated");

      const response = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: newQuote.id,
          detalles: `
          Fechas: ${formData.fechaSalida} al ${formData.fechaRegreso}
          Mensaje: ${formData.mensaje}
        `.trim(),
          experiencia_title: supabaseData.experiencia_title,
          locale
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(t("alerts.email_error"));
      }
    } catch (error) {
      console.error(error);
      alert(t("alerts.connection_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: TEXTO */}
          <div className="space-y-8 lg:top-24">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tighter leading-tight" 
                  dangerouslySetInnerHTML={{ __html: t.raw("title") }} />
              <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="bg-white border border-gray-100 shadow-lg rounded-xl p-8 md:p-12">
            {submitted ? (
              <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <Check size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">{t("success.title")}</h3>
                  <p className="text-gray-500">{t("success.message")}</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-black font-bold underline underline-offset-4"
                >
                  {t("success.send_another")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder={t("form.placeholders.name")}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      required
                      type="email"
                      placeholder={t("form.placeholders.email")}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder={t("form.placeholders.phone")}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest ml-2 text-gray-400">{t("form.labels.reason")}</label>
                  <select
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black appearance-none"
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  >
                    <option value="Viaje a medida (Servicio Concierge)">{t("form.options.concierge")}</option>
                    <option value="Duda sobre los tours">{t("form.options.tours_doubt")}</option>
                    <option value="Asistencia con reserva ya realizada">{t("form.options.booking_help")}</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">{t("form.labels.departure")}</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.fechaSalida}
                      onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">{t("form.labels.return")}</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.fechaRegreso}
                      onChange={(e) => setFormData({ ...formData, fechaRegreso: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">{t("form.labels.travelers")}</label>
                    <select
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.personas}
                      onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n.toString()}>
                          {n} {n === 1 ? t("form.options.person") : t("form.options.people")}
                        </option>
                      ))}
                      <option value="9+">9+ {t("form.options.people")}</option>
                    </select>
                  </div>
                </div>

                <textarea
                  placeholder={t("form.placeholders.message")}
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black resize-none"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>{t("form.submit")}</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
                  {t("form.disclaimer")}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}