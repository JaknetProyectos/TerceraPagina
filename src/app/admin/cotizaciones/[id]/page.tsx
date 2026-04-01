"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuotes } from "@/hooks/useQuote";
import { Cotizacion } from "@/interfaces/Cotizacion";
import {
    Loader2,
    Send,
    ArrowLeft,
    User,
    Mail,
    Phone,
    Users,
    MapPin,
    ClipboardList,
    Hash
} from "lucide-react";
import { useExperience } from "@/hooks/useExperience";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function AdminQuoteEdit() {
    const { id } = useParams();
    const router = useRouter();
    const { getQuote, updateQuote, loading: hookLoading } = useQuotes();

    // Estados con tipado correcto
    const [quote, setQuote] = useState<Cotizacion | null>(null);
    const [priceValue, setPriceValue] = useState("");
    const [folioValue, setFolioValue] = useState(""); // Estado para asignar folio
    const [sending, setSending] = useState(false);

    // 1. Cargamos la cotización primero
    useEffect(() => {
        if (id) {
            getQuote(id as string).then((res) => {
                setQuote(res);
                if (res?.price) setPriceValue(res.price.toString());
                if (res?.folio) setFolioValue(res.folio);
            }).catch(console.error);
        }
    }, [id, getQuote]);

    /** 2. Cargamos la experiencia usando el slug de la quote */
    const { data: experiencia, loading: loadingExp } = useExperience(
        quote?.experiencia_slug ?? ""
    );

    // 3. Manejo de estados de carga combinados
    if (hookLoading || (quote && loadingExp)) return <Loading />;
    if (!quote) return <div className="p-10 text-center">Cotización no encontrada.</div>;

    const handleConfirmQuote = async () => {
        if (!priceValue || !folioValue) {
            alert("El precio y el folio son obligatorios.");
            return;
        }

        setSending(true);
        try {
            // Actualizamos en Supabase tanto el precio como el folio asignado
            await updateQuote(id as string, {
                price: Number(priceValue),
                folio: folioValue.toUpperCase(),
                estado: 'confirmado'
            });

            // Notificación vía API para envío de correo
            await fetch("/api/cotizacion/confirmar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...quote,
                    precio_final: priceValue,
                    folio: folioValue.toUpperCase(),
                    id: id,
                    experiencia_title: experiencia?.title || quote.experiencia_slug
                }),
            });

            alert("Cotización actualizada, folio asignado y correo enviado.");
            router.refresh();
        } catch (error) {
            alert("Error al procesar la actualización.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#F5F5F5] min-h-screen">
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
                        Validar Cotización
                    </h1>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">UUID: {id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-[#03A9F4]">
                            <User size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Cliente Solicitante</span>
                        </div>

                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Nombre</p>
                                <p className="text-sm font-medium text-gray-900">{quote.nombre}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                <p className="text-sm font-medium text-gray-900">{quote.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
                                <p className="text-sm font-medium text-gray-900">{quote.telefono}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Pax</p>
                                <p className="text-sm font-medium text-gray-900">{quote.personas} Personas</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-[#03A9F4]">
                            <ClipboardList size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Requerimientos del Servicio</span>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Experiencia de Referencia</p>
                                <div className="inline-flex items-center gap-2 bg-[#E3F2FD] text-[#1976D2] px-3 py-1 rounded-sm text-xs font-bold">
                                    <Link className="flex flex-row gap-4 items-center" href={`/experiencias/${quote?.experiencia_slug}`}>
                                        <MapPin size={12} /> {experiencia?.title || quote.experiencia_slug}
                                    </Link>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mensaje del Cliente</p>
                            <div className="bg-gray-50 p-6 border-l-4 border-[#03A9F4] text-sm text-gray-700 italic leading-relaxed">
                                "{quote.detalles || "No hay detalles adicionales."}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: ASIGNACIÓN DE FOLIO Y PRECIO */}
                <div className="space-y-6">
                    <div className="bg-white shadow-md border border-gray-200 rounded-sm sticky top-4">
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Configuración de Venta</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* ASIGNACIÓN DE FOLIO */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-2">
                                    <Hash size={14} className="text-[#03A9F4]" /> Asignar Folio Final
                                </label>
                                <input
                                    type="text"
                                    placeholder="EJ: WNDR-100"
                                    value={folioValue}
                                    onChange={(e) => setFolioValue(e.target.value.toUpperCase())}
                                    className="w-full bg-gray-50 border-b-2 border-gray-300 px-4 py-3 text-lg font-mono font-bold outline-none focus:border-[#03A9F4] transition-all"
                                />
                            </div>

                            {/* ASIGNACIÓN DE PRECIO */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#FF9800] uppercase">Monto a Cobrar (MXN)</label>
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
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleConfirmQuote}
                                    disabled={sending || !priceValue || !folioValue}
                                    className="w-full bg-black text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] shadow-sm hover:bg-[#03A9F4] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {sending ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Confirmar Cotización</>}
                                </button>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm">
                                    <p className="text-[10px] text-blue-600 leading-tight">
                                        <strong>AVISO:</strong> Al confirmar, se guardará el folio y el cliente recibirá un enlace para realizar su pago.
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