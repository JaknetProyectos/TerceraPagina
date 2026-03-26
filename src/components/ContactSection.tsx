"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: "", email: "", mensaje: "" });
    }, 3000);
  };

  return (
    <section id="contacto" className="bg-white text-black border-t">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Contáctanos
          </h2>
          <p className="text-gray-600 mt-3">
            ¿Tienes preguntas o quieres planear algo especial? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* INFO */}
          <div className="space-y-6">
            
            <div className="flex gap-4 items-start">
              <Phone className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-gray-600 text-sm mt-1">
                  +52 55 1234 1234
                </p>
                <p className="text-gray-400 text-xs">
                  Lun - Vie, 9am - 6pm
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Mail className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600 text-sm mt-1">
                  hola@wondermx.com
                </p>
                <p className="text-gray-400 text-xs">
                  Respondemos en 24 horas
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <MapPin className="w-5 h-5 mt-1" />
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-gray-600 text-sm mt-1">
                  Ciudad de México, México
                </p>
                <p className="text-gray-400 text-xs">
                  Visitas con cita previa
                </p>
              </div>
            </div>

          </div>

          {/* FORM */}
          <div className="border rounded-3xl p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 border rounded-full flex items-center justify-center mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-lg">
                  Mensaje enviado
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Tu nombre completo"
                    className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-black transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Mensaje
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    rows={4}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-black transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Send className="w-4 h-4" />
                  Enviar mensaje
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}