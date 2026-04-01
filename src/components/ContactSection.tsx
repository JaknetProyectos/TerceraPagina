"use client";

import { useState } from "react";
import { Send, Check, Loader2, Calendar, Users, MessageSquare } from "lucide-react";
import { useQuotes } from "@/hooks/useQuote";

export default function ContactAventura() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    motivo: "viaje a medida servicio concierge",
    fechaSalida: "",
    fechaRegreso: "",
    personas: "1",
    mensaje: "",
  });

  const { createQuote } = useQuotes()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Guardamos en Supabase y recibimos el objeto creado (con su ID)
      const newQuote = await createQuote(formData);

      if (!newQuote?.id) throw new Error("No se generó el ID de cotización");

      // 2. Enviamos al API de correo incluyendo el ID de la base de datos
      const response = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: newQuote.id // <--- IMPORTANTE: Pasamos el ID real
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Error al enviar el correo, pero tu solicitud fue guardada.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* COLUMNA IZQUIERDA: TEXTO */}
          <div className="space-y-8 top-24">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tighter leading-tight">
                ¿Cómo podemos <br /> ayudarte hoy?
              </h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                Ya sea que tengas una duda rápida o quieras que diseñemos tu próximo gran viaje, estamos aquí para hacer que tu visita a México sea inolvidable.
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO ESTILO MODERNO */}
          <div className="bg-white border border-gray-100 shadow-lg rounded-xl p-8 md:p-12">
            {submitted ? (
              <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <Check size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">¡Recibido!</h3>
                  <p className="text-gray-500">Nuestro equipo se pondrá en contacto contigo en menos de 24 horas.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-black font-bold underline underline-offset-4"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* DATOS PERSONALES */}
                <div className="space-y-4">
                  <input
                    required
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      required
                      type="email"
                      placeholder="Correo electrónico"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Teléfono / WhatsApp"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black transition-all"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                {/* MOTIVO */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest ml-2 text-gray-400">Motivo de contacto</label>
                  <select
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black appearance-none"
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  >
                    <option value="viaje a medida servicio concierge">Viaje a medida (Servicio Concierge)</option>
                    <option value="Duda sobre los tours">Duda sobre los tours</option>
                    <option value="Asistencia con reserva ya realizada">Asistencia con reserva ya realizada</option>
                  </select>
                </div>

                {/* DETALLES DEL VIAJE (Solo si es viaje a medida o duda tours) */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">Salida</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.fechaSalida}
                      onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">Regreso</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.fechaRegreso}
                      onChange={(e) => setFormData({ ...formData, fechaRegreso: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-gray-400">Viajeros</label>
                    <select
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black text-sm"
                      value={formData.personas}
                      onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>)}
                      <option value="9+">9+ personas</option>
                    </select>
                  </div>
                </div>

                {/* MENSAJE */}
                <textarea
                  placeholder="Cuéntanos tus dudas o ideas..."
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
                      <span>Enviar solicitud</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
                  Al enviar aceptas nuestras políticas de privacidad y términos de servicio.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}