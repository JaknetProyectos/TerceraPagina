"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useQuotes } from "@/hooks/useQuote";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ShoppingCart, AlertCircle, Check, Info, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function PayQuoteContent() {
    const searchParams = useSearchParams();
    const queryFolio = searchParams.get('folio');

    const [folio, setFolio] = useState("");
    const [montoManual, setMontoManual] = useState<string>("");
    const [quoteData, setQuoteData] = useState<any>(null);
    const [searching, setSearching] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const { getQuoteByFolio } = useQuotes();
    const { addToCart } = useCart();
    const router = useRouter();

    const autoSearch = useCallback(async (f: string) => {
        if (!f) return;
        setSearching(true);
        setInfoMessage("");
        try {
            const data = await getQuoteByFolio(f);
            if (data) {
                setQuoteData(data);
                setMontoManual(data.price?.toString() || "");
                setInfoMessage("FOLIO ENCONTRADO: DATOS ACTUALIZADOS");
            } else {
                setQuoteData(null);
                setInfoMessage("FOLIO EXTERNO: INGRESE EL MONTO ACORDADO");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    }, [getQuoteByFolio]);

    useEffect(() => {
        if (queryFolio) {
            const f = queryFolio.toUpperCase();
            setFolio(f);
            autoSearch(f);
        }
    }, [queryFolio, autoSearch]);

    const handleAddToBag = () => {
        if (!folio || !montoManual) return;

        // Si existe en DB usamos sus datos, si no, generamos uno genérico
        const itemToAdd = {
            experienceId: quoteData?.folio || folio.toUpperCase(),
            title: quoteData?.experiencia_title || `ORDEN PERSONALIZADA: ${folio.toUpperCase()}`,
            destinationName: "EXPERIENCIA WONDER MX",
            price: Number(montoManual),
            personas: quoteData ? (parseInt(quoteData.personas) || 1) : 1,
            fecha: new Date().toISOString().split('T')[0],
            description: quoteData ? `CLIENTE: ${quoteData.nombre}` : `FOLIO EXTERNO: ${folio.toUpperCase()}`
        };

        addToCart(itemToAdd);
        router.push("/cart");
    };

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">

                {/* HEADER MINIMALISTA */}
                <div className="border-b border-gray-100 p-8 text-center">
                    <h1 className="text-2xl font-bold tracking-[0.3em] uppercase italic">Checkout Personalizado</h1>
                    <p className="text-[10px] text-gray-400 tracking-[0.2em] mt-2 uppercase font-medium">Ingresa los detalles de tu cotización acordada</p>
                </div>

                <div className="p-8 md:p-16 max-w-2xl mx-auto">
                    <div className="space-y-12 animate-in fade-in duration-700">

                        {/* SECCIÓN DE DATOS SIEMPRE VISIBLE */}
                        <div className="space-y-10">
                            {/* INPUT FOLIO */}
                            <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">No. de cotización</label>
                                <div className="flex items-center gap-4 border-b border-gray-200 focus-within:border-black transition-colors">
                                    <input
                                        type="text"
                                        placeholder="WNDR-XXXXX"
                                        value={folio}
                                        onChange={(e) => setFolio(e.target.value)}
                                        onBlur={() => autoSearch(folio)}
                                        className="w-full bg-transparent py-4 outline-none text-2xl font-light uppercase tracking-[0.1em] placeholder:text-gray-100"
                                    />
                                    {searching ? <Loader2 className="animate-spin text-gray-300 w-5 h-5" /> : <Search className="text-gray-200" size={20} />}
                                </div>
                            </div>

                            {/* INDICADOR DE STATUS DE FOLIO */}
                            {infoMessage && (
                                <div className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase ${quoteData ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {quoteData ? <Check size={12} /> : <Info size={12} />}
                                    {infoMessage}
                                </div>
                            )}

                            {/* DATOS DEL CLIENTE (Solo si existe en DB) */}
                            {quoteData && (
                                <div className="p-6 bg-gray-50 border-l-2 border-black animate-in slide-in-from-left-2">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Titular de la reserva</p>
                                    <p className="text-lg font-bold uppercase italic tracking-tighter">{quoteData.nombre}</p>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">{quoteData.experiencia_title}</p>
                                </div>
                            )}

                            {/* INPUT MONTO (Siempre visible) */}
                            <div className="pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Monto total acordado (MXN)</label>
                                <div className="flex items-baseline gap-2 border-b border-gray-200 focus-within:border-black transition-colors">
                                    <span className="text-2xl font-light text-gray-300">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full py-4 text-5xl font-black tracking-tighter outline-none bg-transparent"
                                        value={montoManual}
                                        onChange={(e) => setMontoManual(e.target.value)}
                                    />
                                    <span className="text-xs font-bold uppercase">MXN</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN DE ACCIÓN */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToBag}
                                disabled={!folio || !montoManual}
                                className="w-full bg-black text-white py-6 font-bold uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <ShoppingCart size={16} /> Añadir a la bolsa
                            </button>

                            <p className="text-[9px] text-center text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                Al añadir a la bolsa confirmas que el folio y monto corresponden a la cotización enviada por tu asesor Wonder MX.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FOOTER INTERNO TIPO RETAIL */}
                <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 opacity-30">
                            <Check size={12} /> <span className="text-[9px] font-bold uppercase tracking-widest">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-30">
                            <Check size={12} /> <span className="text-[9px] font-bold uppercase tracking-widest">Official Quote</span>
                        </div>
                    </div>
                    <p className="text-[9px] text-gray-300 uppercase tracking-widest">#WONDERMXMOMENTS</p>
                </div>
            </div>
        </div>
    );
}

export default function PayQuotePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-32 pb-20">
                <Suspense fallback={<div className="flex flex-col items-center justify-center py-40"><Loader2 className="animate-spin text-black" size={30} /></div>}>
                    <PayQuoteContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}