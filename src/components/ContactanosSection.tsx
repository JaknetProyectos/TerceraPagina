"use client";

import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactanosSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    motivo: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section id="contacto" className="relative min-h-screen bg-[#2a3677]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://ext.same-assets.com/619569696/3681039266.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-[#1f1e58]/70" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Big Title */}
        <h2 className="font-anton text-white text-6xl md:text-8xl lg:text-[10rem] leading-none text-center mb-16">
          CONTÁCTANOS
        </h2>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Map */}
          <div className="lg:w-1/2">
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-xl bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.8!2d-99.15!3d19.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI1JzQ4LjAiTiA5OcKwMDknMDAuMCJX!5e0!3m2!1sen!2smx!4v1600000000000!5m2!1sen!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre *"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-[#ae4e68] focus:outline-none focus:border-[#ae4e68] backdrop-blur-sm"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-[#ae4e68] focus:outline-none focus:border-[#ae4e68] backdrop-blur-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Teléfono *"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-[#ae4e68] focus:outline-none focus:border-[#ae4e68] backdrop-blur-sm"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Motivo *"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-[#ae4e68] focus:outline-none focus:border-[#ae4e68] backdrop-blur-sm"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Mensaje *"
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-[#ae4e68] focus:outline-none focus:border-[#ae4e68] resize-none backdrop-blur-sm"
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                required
              />
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#554ed1] hover:bg-[#4a43b8] text-white px-12 py-3 rounded transition-colors font-medium"
                >
                  Enviar
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-1">TELÉFONO</h4>
                <p className="text-white/80">+52 55 1234 1234</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-1">MAIL</h4>
                <p className="text-white/80 text-sm">support@adventuretrip.com.mx</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-1">DIRECCIÓN</h4>
                <p className="text-white/80">Av. Mexico</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8 flex justify-center items-center gap-4">
              <div className="bg-white rounded px-3 py-1">
                <span className="text-[#1a1f71] font-bold text-sm">VISA</span>
              </div>
              <div className="bg-white rounded px-2 py-1 flex items-center">
                <div className="w-4 h-4 bg-[#eb001b] rounded-full" />
                <div className="w-4 h-4 bg-[#f79e1b] rounded-full -ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
