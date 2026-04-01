"use client";
import { useEffect, useState } from "react";
import { useQuotes } from "@/hooks/useQuote";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Search, ShoppingCart, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentContent() {
    const [quoteId, setQuoteId] = useState("");
    const searchParams = useSearchParams();
    const queryId = searchParams.get('quoteId');
    const [quoteData, setQuoteData] = useState<any>(null);
    const [error, setError] = useState("");
    const [searching, setSearching] = useState(false);

    const { getQuote } = useQuotes();
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (queryId) {
            setQuoteId(queryId);
            // Opcional: auto-ejecutar búsqueda si el ID viene en la URL
        }
    }, [queryId]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setQuoteData(null);
        setSearching(true);

        try {
            const data = await getQuote(quoteId.trim());

            if (!data) {
                setError("Identificador no encontrado. Por favor, revisa el código enviado a tu email.");
            } else if (!data.price || data.estado !== 'confirmado') {
                setError("Esta cotización aún está en proceso de revisión por nuestro equipo concierge.");
                setQuoteData(data);
            } else {
                setQuoteData(data);
            }
        } catch (err) {
            setError("Error de conexión. Intente más tarde.");
        } finally {
            setSearching(false);
        }
    };

    const handleAddToBag = () => {
        if (!quoteData) return;

        addToCart({
            experienceId: `QUOTE-${quoteData.id.substring(0, 8).toUpperCase()}`,
            title: quoteData.experience_title || `Plan Personalizado: ${quoteData.nombre}`,
            destinationName: "Luxury Concierge",
            price: Number(quoteData.price),
            personas: quoteData.personas,
            fecha: new Date().toISOString().split('T')[0],
        });

        router.push("/cart");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* LADO IZQUIERDO: TEXTO EDITORIAL */}
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                                Servicios Especiales
                            </div>
                            <h1 className="text-3xl font-bold text-black tracking-tighter leading-[0.9]">
                                Experiencia Personalizada <br /> Confirmación de Reserva Personalizada
                            </h1>
                            <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                                Este apartado es exclusivo para clientes que ya cuentan con un itinerario y presupuesto enviado por su concierge.
                            </p>
                            <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                                Pasos para realizar tu pago:
                            </p>
                            <ol className="text-lg text-gray-500 font-light leading-relaxed max-w-md">
                                <li>
                                    1. Referencia: Escribe tu número de folio o nombre del paquete en el campo de texto.
                                </li>
                                <li>
                                    2. Seguridad: Haz clic en “Añadir al carrito” para proceder al pago encriptado.
                                </li>
                            </ol>

                            <p className="text-gray-400 font-light leading-relaxed max-w-md">
                                Si tienes alguna duda sobre este tour o necesitas asistencia para hacer tu reserva, estaremos encantados de ayudarte.
                            </p>

                            <Link href={"/#contacto"}>
                                <button
                                    className="w-full my-5 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mb-3"
                                >
                                    Cotiza aquí
                                </button>
                            </Link>
                        </div>

                        {/* LADO DERECHO: FORMULARIO TIPO CARD SHEIN */}
                        <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-8 md:p-12">
                            <form onSubmit={handleSearch} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">
                                        ID de Seguimiento / Folio
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ej: WNDR-X9Y2"
                                            value={quoteId}
                                            onChange={(e) => setQuoteId(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-black transition-all text-lg font-mono tracking-widest uppercase placeholder:font-sans placeholder:tracking-normal"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={searching}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors"
                                        >
                                            {searching ? <Loader2 className="animate-spin w-5 h-5" /> : <Search size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* RESULTADOS Y ERRORES */}
                            <div className="mt-10">
                                {error && (
                                    <div className="flex items-center gap-4 p-5 bg-red-50 rounded-2xl text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle size={20} />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {quoteData && quoteData.estado === 'confirmado' && (
                                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="p-8 border-2 border-black rounded-[2rem] space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experiencia</p>
                                                    <h3 className="text-xl font-bold text-black uppercase">{quoteData.experience_title}</h3>
                                                </div>
                                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                                                    Lista para pago
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Titular de la reserva:</span>
                                                    <span className="font-bold">{quoteData.nombre}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Total a pagar:</span>
                                                    <span className="text-2xl font-black">${Number(quoteData.price).toLocaleString()} MXN</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleAddToBag}
                                                className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                            >
                                                <span>Agregar al carrito</span>
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}