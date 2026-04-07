"use client";

import { useState } from "react";
import { X, Calendar, Users, Check } from "lucide-react";
import { saveReservation } from "@/lib/reservations";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  destinationName: string;
  price?: string;
}

export default function BookingModal({ isOpen, onClose, activityTitle, destinationName, price = "" }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fecha: "",
    personas: "1",
    nombre: "",
    email: "",
    telefono: "",
    comentarios: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save reservation to localStorage
    saveReservation({
      ...formData,
      activityTitle,
      destinationName,
      price,
    });

    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fecha: "",
      personas: "1",
      nombre: "",
      email: "",
      telefono: "",
      comentarios: "",
    });
    onClose();
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1f1e58] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#ae4e68] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Reservar</p>
            <h3 className="text-white font-anton text-xl">{activityTitle}</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="text-[#e8e0c6] font-semibold text-lg">Selecciona fecha y personas</h4>

              {/* Date */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Fecha del tour</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ae4e68]" />
                  <input
                    type="date"
                    min={today}
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ae4e68]"
                    required
                  />
                </div>
              </div>

              {/* Number of people */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Número de personas</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ae4e68]" />
                  <select
                    value={formData.personas}
                    onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ae4e68] appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} className="bg-[#1f1e58]">
                        {num} {num === 1 ? "persona" : "personas"}
                      </option>
                    ))}
                    <option value="10+" className="bg-[#1f1e58]">Más de 10 personas</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => formData.fecha && setStep(2)}
                disabled={!formData.fecha}
                className="w-full bg-[#ae4e68] hover:bg-[#8a3d53] disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-[#e8e0c6] font-semibold text-lg">Tus datos de contacto</h4>

              <div>
                <label className="block text-white/70 text-sm mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ae4e68]"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ae4e68]"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ae4e68]"
                    placeholder="+52 55 1234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Comentarios (opcional)</label>
                <textarea
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ae4e68] resize-none"
                  placeholder="Algún requerimiento especial..."
                  rows={3}
                />
              </div>

              {/* Summary */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm">Resumen de tu reserva:</p>
                <p className="text-white font-medium">{activityTitle}</p>
                <p className="text-[#ae4e68]">{destinationName}</p>
                <div className="flex gap-4 mt-2 text-sm text-white/70">
                  <span>📅 {formData.fecha}</span>
                  <span>👥 {formData.personas} {Number(formData.personas) === 1 ? "persona" : "personas"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-white/30 text-white py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ae4e68] hover:bg-[#8a3d53] text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-[#e8e0c6] font-anton text-2xl mb-2">¡Reserva Confirmada!</h4>
              <p className="text-white/70 mb-6">
                Te hemos enviado un correo de confirmación a <span className="text-white">{formData.email}</span>
              </p>
              <p className="text-white/60 text-sm mb-6">
                Nos pondremos en contacto contigo pronto para confirmar los detalles de tu experiencia.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#ae4e68] hover:bg-[#8a3d53] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
