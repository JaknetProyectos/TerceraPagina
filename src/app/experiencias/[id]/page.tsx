"use client";

import { useParams } from "next/navigation";
import { useExperience } from "@/hooks/useExperience";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { saveReservation } from "@/lib/reservations";
import { Calendar, Check, CheckCircle, ChevronLeft, ChevronRight, CreditCard, Lock, ShoppingCart, Users, X } from "lucide-react";
import { sendConfirmationEmail } from "@/lib/email";

import { useCart } from "@/components/CartContext";
import Loading from "@/components/Loading";
import Link from "next/link";
import { checkout } from "@/lib/cart";

export default function ExperienceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { addToCart } = useCart();
    const { data, loading, error } = useExperience(id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [form, setForm] = useState({
        fecha: "",
        personas: "1",
        nombre: "",
        email: "",
        telefono: "",
        direccion: "", // Requerido para Etomin
        cp: "",        // Requerido para Etomin
    });

    const [card, setCard] = useState({
        number: "",
        name: "",
        month: "",
        year: "",
        cvv: "",
    });

    const [selection, setSelection] = useState({
        fecha: "",
        personas: 1,
    });
    const [addedToCart, setAddedToCart] = useState(false);

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


    const priceNumber = Number(data.price);
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

    const handleAddToCart = () => {
        if (!selection.fecha) {
            alert("Por favor selecciona una fecha para tu aventura");
            return;
        }

        addToCart({
            experienceId: data.id,
            title: data.title,
            destinationName: data.destinationName ?? "",
            price: Number(data.price),
            personas: selection.personas,
            fecha: selection.fecha,
        });

        // Feedback visual de éxito
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    // 👉 submit reserva
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingCheckout(true);

        try {
            // Creamos un "item de carrito" temporal para la función checkout
            const tempCartItem = [{
                experienceId: data.id,
                title: data.title,
                destinationName: data.destinationName ?? "",
                price: priceNumber,
                personas: Number(form.personas),
                fecha: form.fecha
            }];

            // Usamos la función checkout que ya tiene integrada la lógica de Etomin,
            // Guardado en DB y Envío de Email de Ticket.
            const results = await checkout(tempCartItem, form, card);

            setReservationData(results);
            setBookingOpen(false);
            setSuccessOpen(true);
        } catch (err: any) {
            console.error("Error en reservación:", err);
            alert(err.message || "No pudimos procesar tu pago. Inténtalo de nuevo.");
        } finally {
            setLoadingCheckout(false);
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
                                    <span>{data.category}</span>
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
                                     <span className="text-sm text-gray-500 ml-2">
                                        IVA Incluido
                                    </span>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    {/* Campo Fecha */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Calendar size={16} /> Selecciona tu fecha
                                        </label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={selection.fecha}
                                            onChange={(e) => setSelection({ ...selection, fecha: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium outline-none"
                                        />
                                    </div>

                                    {/* Campo Personas */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Users size={16} /> Número de personas
                                        </label>
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1">
                                            <button
                                                onClick={() => setSelection(s => ({ ...s, personas: Math.max(1, s.personas - 1) }))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-xl"
                                            >-</button>
                                            <span className="flex-grow text-center font-bold">{selection.personas}</span>
                                            <button
                                                onClick={() => setSelection(s => ({ ...s, personas: s.personas + 1 }))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-xl"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full py-4 my-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${addedToCart
                                        ? "bg-green-500 text-white"
                                        : "bg-black hover:bg-gray-900 text-white shadow-lg shadow-blue-200"
                                        }`}
                                >
                                    {addedToCart ? (
                                        <><Check /> ¡Agregado!</>
                                    ) : (
                                        <><ShoppingCart size={20} /> Agregar al carrito</>
                                    )}
                                </button>

                                {/* confianza */}
                                <div className="mt-5 border-t pt-4 space-y-2 text-sm text-gray-500">
                                    <p>✔ Confirmación rápida</p>
                                    <p>✔ Pago online seguro</p>
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
                                    <h3 className="text-lg font-semibold mb-3">Incluido</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        {data.incluido.map((item: string, i: number) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.no_incluido?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-3">No incluido</h3>
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

                        <form onSubmit={handleBooking} className="space-y-4">
                            {/* Datos de la Experiencia */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Fecha</label>
                                    <input type="date" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#ae4e68]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Personas</label>
                                    <input type="number" min="1" value={form.personas} onChange={(e) => setForm({ ...form, personas: e.target.value })} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#ae4e68]" />
                                </div>
                            </div>

                            {/* Datos de Contacto */}
                            <div className="space-y-3">
                                <input type="text" placeholder="Nombre completo" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border p-2.5 rounded-lg" />
                                <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2.5 rounded-lg" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Dirección" required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full border p-2.5 rounded-lg" />
                                    <input type="text" placeholder="C.P." required value={form.cp} onChange={(e) => setForm({ ...form, cp: e.target.value })} className="w-full border p-2.5 rounded-lg" />
                                </div>
                            </div>

                            {/* Datos de Tarjeta */}
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                <h4 className="text-sm font-bold flex items-center gap-2"><CreditCard size={16} /> Pago Seguro con Etomin</h4>
                                <input type="text" placeholder="Número de Tarjeta" required maxLength={16} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className="w-full border p-2.5 rounded-lg bg-white" />
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="MM" required maxLength={2} value={card.month} onChange={(e) => setCard({ ...card, month: e.target.value })} className="border p-2.5 rounded-lg text-center bg-white" />
                                    <input type="text" placeholder="AA" required maxLength={2} value={card.year} onChange={(e) => setCard({ ...card, year: e.target.value })} className="border p-2.5 rounded-lg text-center bg-white" />
                                    <input type="password" placeholder="CVV" required maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className="border p-2.5 rounded-lg text-center bg-white" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t mt-4">
                                <span className="text-gray-600">Total a pagar:</span>
                                <span className="text-xl font-bold text-[#ae4e68]">${total.toLocaleString()} MXN</span>
                            </div>

                            <button
                                disabled={loadingCheckout}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {loadingCheckout ? "Procesando..." : <><Lock size={18} /> Pagar ahora</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {successOpen && reservationData && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-green-500 text-white p-8 text-center">
                            <CheckCircle size={60} className="mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">¡Todo listo!</h3>
                            <p className="opacity-90">Tu pago ha sido procesado</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-center text-gray-500 text-sm">Se ha enviado un ticket con los detalles a tu correo electrónico.</p>
                            <button
                                onClick={() => setSuccessOpen(false)}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}