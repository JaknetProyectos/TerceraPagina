"use client";

import { useParams } from "next/navigation";
import { useExperience } from "@/hooks/useExperience";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { saveReservation } from "@/lib/reservations";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { sendConfirmationEmail } from "@/lib/email";

import { useCart } from "@/components/CartContext";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function ExperienceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { addToCart } = useCart();


    const { data, loading, error } = useExperience(id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);

    const [bookingOpen, setBookingOpen] = useState(false);
    const [form, setForm] = useState({
        fecha: "",
        personas: "1",
        nombre: "",
        email: "",
        telefono: "",
    });

    const [successOpen, setSuccessOpen] = useState(false);
    const [reservationData, setReservationData] = useState<any>(null);

    if (loading) {
        return <Loading />
    }

    if (error || !data) {
        return (
            <div className="p-10 text-center text-red-500">
                Error al cargar la experiencia
            </div>
        );
    }

    data.priceFormatted = data.priceFormatted ?? "";
    data.caracteristicas_servicio = data.caracteristicas_servicio ?? [];
    data.destinationName = data.destinationName ?? "";
    data.destinationSlug = data.destinationSlug ?? "";
    data.incluido = data.incluido ?? [];
    data.no_incluido = data.no_incluido ?? [];
    data.accesibilidad = data.accesibilidad ?? [];


    const priceNumber = Number(data.priceFormatted.replace(/[^0-9]/g, ""));
    const total = priceNumber * Number(form.personas || 1);


    const images = data.images?.length
        ? data.images
        : [data.image]; // fallback temporal

    // 👉 navegación galería
    const nextImage = () =>
        setSelectedImage((prev) => (prev + 1) % images.length);

    const prevImage = () =>
        setSelectedImage((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );

    // 👉 submit reserva
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const reservation = await saveReservation({
                ...form,
                activityTitle: data.title,
                destinationName: data.destinationName,
                price: total,
            });

            await sendConfirmationEmail(form);

            setReservationData(reservation);
            setBookingOpen(false);
            setSuccessOpen(true);
        } catch (err) {
            console.error(err);
            alert("Error al guardar la reservación");
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#f5f5f5] pt-20">
                <div className="max-w-7xl mx-auto px-4 py-10">

                    {/* 🔥 GRID PRINCIPAL */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* 🖼 GALERÍA */}
                        <div className="space-y-4">

                            <div className="relative group">
                                <img
                                    src={images[selectedImage]}
                                    onClick={() => setGalleryOpen(true)}
                                    className="w-full h-[450px] object-cover rounded-2xl cursor-pointer shadow-sm"
                                />

                                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                                    {selectedImage + 1} / {images.length}
                                </div>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img: any, i: number) => (
                                    <img
                                        key={i}
                                        src={img}
                                        onClick={() => setSelectedImage(i)}
                                        className={`h-20 w-24 object-cover rounded-lg cursor-pointer border-2 transition ${selectedImage === i
                                            ? "border-[#ae4e68]"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 🧾 INFO + COMPRA */}
                        <div className="space-y-6">

                            {/* INFO */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">

                                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                    {data.title}
                                </h1>

                                <Link href={`/categoria/${data.destinationSlug}`}>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {data.destinationName}
                                    </p>
                                </Link>

                                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                    <span>⏱ {data.duration}</span>
                                    <span>🏷 {data.category}</span>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {data.description}
                                </p>
                            </div>

                            {/* 🔥 CARD COMPRA */}
                            <div className="bg-white border rounded-2xl p-6 shadow-md sticky top-24">

                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {data.priceFormatted}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        / persona
                                    </span>
                                </div>

                                <button
                                    onClick={() => setBookingOpen(true)}
                                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mb-3"
                                >
                                    Reservar ahora
                                </button>

                                <button
                                    onClick={() =>
                                        addToCart({
                                            experienceId: data.id,
                                            title: data.title,
                                            destinationName: data.destinationName ?? "",
                                            price: data.price,
                                            personas: 1,
                                        })
                                    }
                                    className="w-full border border-black text-black py-3 rounded-xl hover:bg-black hover:text-white transition"
                                >
                                    Agregar al carrito
                                </button>

                                {/* confianza */}
                                <div className="mt-5 border-t pt-4 space-y-2 text-sm text-gray-500">
                                    <p>✔ Confirmación inmediata</p>
                                    <p>✔ Pago offline seguro</p>
                                    <p>✔ Soporte 24/7</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 🔽 DETALLES */}
                    <div className="mt-16 space-y-8">

                        {/* 🧾 DESCRIPCIÓN */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">
                                Detalles de la experiencia
                            </h2>

                            <p className="text-gray-600 leading-relaxed text-sm">
                                {data.description || ""}
                            </p>
                        </div>

                        {/* 🧭 ITINERARIO */}
                        {data.itinerario && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3">Itinerario</h3>
                                <p className="text-gray-600 text-sm whitespace-pre-line">
                                    {data.itinerario || ""}
                                </p>
                            </div>
                        )}

                        {/* ✅ INCLUIDO / ❌ NO INCLUIDO */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {data.incluido?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-3">✔ Incluido</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        {data.incluido.map((item: string, i: number) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.no_incluido?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-3">❌ No incluido</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        {data.no_incluido.map((item: string, i: number) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        {/* ⭐ CARACTERÍSTICAS */}
                        {data.caracteristicas_servicio?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3">
                                    Características del servicio
                                </h3>

                                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                    {data.caracteristicas_servicio.map((item: string, i: number) => (
                                        <div key={i}>• {item}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ♿ ACCESIBILIDAD */}
                        {data.accesibilidad?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3">
                                    Accesibilidad
                                </h3>

                                <ul className="space-y-2 text-sm text-gray-600">
                                    {data.accesibilidad.map((item: string, i: number) => (
                                        <li key={i}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 📅 RESERVACIÓN */}
                        {data.reservaciones_antelacion && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3">
                                    Información de reservación
                                </h3>

                                <p className="text-sm text-gray-600">
                                    {data.reservaciones_antelacion || ""}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <Footer />

            {/* 🔥 MODAL GALERÍA */}
            {galleryOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    <button
                        onClick={() => setGalleryOpen(false)}
                        className="absolute top-6 right-6 text-white"
                    >
                        <X size={30} />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-6 text-white"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <img
                        src={images[selectedImage]}
                        className="max-h-[80vh] rounded-lg"
                    />

                    <button
                        onClick={nextImage}
                        className="absolute right-6 text-white"
                    >
                        <ChevronRight size={40} />
                    </button>
                </div>
            )}

            {/* 🔥 MODAL RESERVA */}
            {bookingOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setBookingOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X />
                        </button>

                        <h3 className="text-xl font-bold mb-4">
                            Reservar {data.title}
                        </h3>

                        <form onSubmit={handleBooking} className="space-y-3">
                            <input
                                type="date"
                                required
                                value={form.fecha}
                                onChange={(e) =>
                                    setForm({ ...form, fecha: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="number"
                                min="1"
                                value={form.personas}
                                onChange={(e) =>
                                    setForm({ ...form, personas: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Nombre"
                                required
                                onChange={(e) =>
                                    setForm({ ...form, nombre: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="tel"
                                placeholder="Teléfono"
                                required
                                onChange={(e) =>
                                    setForm({ ...form, telefono: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <div className="bg-gray-100 p-3 rounded-xl text-sm">
                                <div>Precio por persona: {data.priceFormatted}</div>
                                <div>Personas: {form.personas}</div>

                                <div className="font-bold text-lg mt-2">
                                    Total: ${total}
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-2 rounded-xl">
                                Confirmar reservación
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {successOpen && reservationData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl">

                        {/* Header tipo ticket */}
                        <div className="bg-black text-white p-4">
                            <h3 className="text-lg font-semibold">🎟 Reservación Confirmada</h3>
                            <p className="text-sm opacity-80">
                                Número de orden : {String(reservationData.id).toUpperCase()}
                            </p>
                        </div>

                        <div className="p-5 space-y-4">

                            {/* Experiencia */}
                            <div>
                                <p className="text-sm text-gray-500">Experiencia</p>
                                <p className="font-medium">{reservationData.activity_title}</p>
                            </div>

                            {/* Destino */}
                            <div>
                                <p className="text-sm text-gray-500">Destino</p>
                                <p className="font-medium">{reservationData.destination_name}</p>
                            </div>

                            {/* Fecha */}
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p className="font-medium">{reservationData.fecha}</p>
                            </div>

                            {/* Personas */}
                            <div>
                                <p className="text-sm text-gray-500">Personas</p>
                                <p className="font-medium">{reservationData.personas}</p>
                            </div>

                            {/* Precio */}
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-sm">
                                    <span>Precio por persona</span>
                                    <span>${Math.floor(reservationData.price / reservationData.personas)}</span>
                                </div>

                                <div className="flex justify-between font-bold text-lg mt-1">
                                    <span>Total</span>
                                    <span>${reservationData.price}</span>
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="text-xs text-yellow-600 bg-yellow-100 p-2 rounded text-center">
                                Estado: Pendiente de confirmación de pago
                            </div>

                            {/* Email */}
                            <p className="text-xs text-gray-500 text-center">
                                📧 Se envió un correo con los detalles
                            </p>

                            {/* Botón */}
                            <button
                                onClick={() => setSuccessOpen(false)}
                                className="w-full bg-black text-white py-2 rounded-xl"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}