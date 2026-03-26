"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import useDestination from "@/hooks/useDestination";
import { useExperiences } from "@/hooks/useExperiences";

import {
  ArrowLeft,
  Clock,
  Star,
  MapPin,
  Calendar,
  Users,
  X,
  Check
} from "lucide-react";
import { saveReservation } from "@/lib/reservations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Loading skeleton
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--md-background)]">
      <div className="h-72 bg-gray-200 skeleton" />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 skeleton" />
        <div className="h-4 bg-gray-200 rounded w-2/3 skeleton" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Booking Modal
function BookingModal({
  isOpen,
  onClose,
  experience
}: {
  isOpen: boolean;
  onClose: () => void;
  experience: { title: string; price: string; destinationName: string } | null;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fecha: "",
    personas: "1",
    nombre: "",
    email: "",
    telefono: "",
  });

  if (!isOpen || !experience) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveReservation({
      ...formData,
      activityTitle: experience.title,
      destinationName: experience.destinationName,
      price: experience.price,
      comentarios: "",
    });
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ fecha: "", personas: "1", nombre: "", email: "", telefono: "" });
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md overflow-hidden elevation-4">
        <div className="bg-[var(--md-primary)] px-6 py-4 flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm opacity-80">Reservar</p>
            <h3 className="font-medium">{experience.title}</h3>
          </div>
          <button type="button" onClick={handleClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">Fecha</label>
                  <input
                    type="date"
                    min={today}
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="md-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">Personas</label>
                  <select
                    value={formData.personas}
                    onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
                    className="md-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="md-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="md-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="md-input"
                  required
                />
              </div>
              <div className="bg-gray-50 rounded p-3 text-sm text-[var(--md-on-surface-medium)]">
                <span className="font-medium text-[var(--md-primary)]">{experience.price}</span> por persona
              </div>
              <button type="submit" className="w-full md-btn md-btn-primary">
                Confirmar Reserva
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[var(--md-success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[var(--md-success)]" />
              </div>
              <h3 className="font-medium text-lg text-[var(--md-on-surface)]">Reserva confirmada</h3>
              <p className="text-[var(--md-on-surface-medium)] mt-2">Te enviaremos los detalles por email</p>
              <button type="button" onClick={handleClose} className="mt-6 md-btn md-btn-primary">
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DestinationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: destination, loading: destLoading } = useDestination(slug);
  const { data: experiences, loading: expLoading } = useExperiences({ destinationSlug: slug, pageSize: 10 });

  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    experience: { title: string; price: string; destinationName: string } | null;
  }>({
    isOpen: false,
    experience: null,
  });

  if (destLoading) {
    return <PageSkeleton />;
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[var(--md-on-surface)]">Destino no encontrado</h1>
          <Link href="/" className="mt-4 inline-block text-[var(--md-primary)]">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--md-background)]">
        {/* Hero */}
        <div className="h-72 md:h-30  flex flex-col relative">
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end items-center pb-8">
            <h1 className="text-4xl  text-center md:text-7xl font-medium text-black">{destination.name}</h1>
            <hr className="w-36 border-black mt-6 border-solid border-s-2" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Experiences */}
          <section className="mb-12">

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg skeleton" />
                ))
              ) : (
                experiences.map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/experiencias/${exp.id}`}
                    className="border rounded-xl overflow-hidden transition"
                  >
                    <div className="rounded-md shadow-md">
                      {/* Imagen */}
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${exp.image})` }}
                      />

                      {/* Contenido */}
                      <div className="p-4">
                        <h2 className="text-lg font-semibold">{exp.title}</h2>

                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {exp.description}
                        </p>

                        <div className="flex flex-col py-4 items-center mt-3 text-sm">
                          <p>
                            <span className="font-semibold">
                              {exp.priceFormatted}
                            </span> IVA (16%) incluido
                          </p>
                        </div>

                        <button
                          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mb-3"
                        >
                          Reservar ahora
                        </button>


                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>


        </div>


        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, experience: null })}
          experience={bookingModal.experience}
        />
      </main>
      <Footer />
    </>
  );
}
