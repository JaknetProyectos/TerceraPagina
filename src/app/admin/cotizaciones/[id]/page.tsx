"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuotes } from "@/hooks/useQuote";
import {
    Loader2,
    Send,
    ArrowLeft,
    User,
    Mail,
    Phone,
    Users,
    MapPin,
    ClipboardList
} from "lucide-react";
import { useExperience } from "@/hooks/useExperience";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function AdminQuoteEdit() {
    const { id } = useParams();
    const router = useRouter();
    const { getQuote, updateQuote, loading: hookLoading } = useQuotes();

    const [quote, setQuote] = useState<any>(null);
    const [priceValue, setPriceValue] = useState("");
    const [sending, setSending] = useState(false);

    // 1. Cargamos la cotización primero
    useEffect(() => {
        if (id) {
            getQuote(id as string).then((res) => {
                setQuote(res);
                if (res?.price) setPriceValue(res.price.toString());
            }).catch(console.error);
        }
    }, [id, getQuote]);

    /** * 2. Cargamos la experiencia usando el slug que viene en la quote.
     * Pasamos 'undefined' como ID y el slug como segundo parámetro.
     * El hook no hará nada hasta que 'quote?.experiencia_slug' tenga valor.
     */
    const { data: experiencia, loading: loadingExp } = useExperience(
        quote?.experiencia_slug // Solo se ejecutará cuando esto exista
    );

    // 3. Manejo de estados de carga combinados
    // hookLoading: esperando la DB de cotizaciones
    // loadingExp: esperando la DB de experiencias (solo si ya tenemos el slug)
    if (hookLoading || (quote && loadingExp)) return <Loading />;

    if (!quote) return <div className="p-10 text-center">Cotización no encontrada.</div>;

    const handleConfirmQuote = async () => {
        if (!priceValue) return;
        setSending(true);
        try {
            await updateQuote(id as string, {
                price: Number(priceValue),
                estado: 'confirmado'
            });

            await fetch("/api/cotizacion/confirmar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...quote,
                    precio_final: priceValue,
                    id: id,
                    // Enviamos el título real de la experiencia al email
                    experiencia_title: experiencia?.title || quote.experiencia_slug
                }),
            });

            alert("Cotización actualizada y enviada con éxito.");
            router.refresh();
        } catch (error) {
            alert("Error al procesar la actualización.");
        } finally {
            setSending(false);
        }
    };

    if (hookLoading || !quote) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-[#03A9F4]" size={40} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-[#F5F5F5] min-h-full">
            {/* NAVEGACIÓN SUPERIOR */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-medium text-gray-800 uppercase tracking-wider">
                        Detalles de Cotización
                    </h1>
                    <p className="text-[10px] font-mono text-gray-400">UUID: {id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* COLUMNA IZQUIERDA: INFORMACIÓN DEL CLIENTE (SUPERFICIE MATERIAL) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-[#03A9F4]">
                            <User size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Información del Solicitante</span>
                        </div>

                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Nombre Completo</p>
                                <p className="text-sm font-medium text-gray-900">{quote.nombre}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" /> {quote.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono de Contacto</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" /> {quote.telefono}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Cantidad de Personas</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <Users size={14} className="text-gray-400" /> {quote.personas}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-[#03A9F4]">
                            <ClipboardList size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Detalles de la Aventura</span>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Experiencia Solicitada</p>
                                <div className="inline-flex items-center gap-2 bg-[#E3F2FD] text-[#1976D2] px-3 py-1 rounded-sm text-xs font-bold">
                                    <Link className="flex flex-row gap-4 items-center" href={`/experiencias/${quote?.experiencia_slug}`}>
                                        <MapPin size={12} /> {experiencia?.title}
                                    </Link>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Requerimientos Especiales</p>
                            <div className="bg-gray-50 p-6 border-l-4 border-[#FF9800] text-sm text-gray-700 italic leading-relaxed">
                                "{quote.detalles || "El cliente no proporcionó detalles adicionales."}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: ACCIÓN DE PRECIO (NARANJA MATERIAL) */}
                <div className="space-y-6">
                    <div className="bg-white shadow-md border border-gray-200 rounded-sm sticky top-4">
                        <div className="p-6 bg-[#FAFAFA] border-b border-gray-100">
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Gestión de Precio</h2>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#FF9800] uppercase">Monto de Cotización (MXN)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xl">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(e.target.value)}
                                        className="w-full bg-gray-50 border-b-2 border-gray-300 px-10 py-4 text-2xl font-bold outline-none focus:border-[#FF9800] focus:bg-orange-50/30 transition-all rounded-t-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 italic mt-2">
                                    * Este monto será el que el cliente verá reflejado en su carrito.
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleConfirmQuote}
                                    disabled={sending || !priceValue}
                                    className="w-full bg-[#FF9800] text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] shadow-sm hover:shadow-lg hover:bg-[#F57C00] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {sending ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Confirmar y Enviar</>}
                                </button>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm">
                                    <p className="text-[10px] text-blue-600 leading-tight">
                                        <strong>NOTA:</strong> Al confirmar, se enviará automáticamente un correo electrónico al cliente con el enlace de pago directo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}