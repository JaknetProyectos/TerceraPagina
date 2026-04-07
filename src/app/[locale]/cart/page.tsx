"use client";

import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { checkout } from "@/lib/cart";
import { useState } from "react";
import { CreditCard, Lock, CheckCircle, MapPin, ShieldCheck, AlertTriangle, X } from "lucide-react";
import etominLogo from "@/public/etomin.png"
import securePayment from "@/public/secure-payment.png"
import Image from "next/image";
import securePaymentLogo from "@/public/secure-payment.png"
import { EmptyCart } from "@/components/EmptyCart";

export default function CartPage() {
    const { cart, updateItem, removeItem, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<any[] | null>(null);
        const [paymentError, setPaymentError] = useState<string | null>(null); // Nuevo estado para errores


    // Datos de contacto y envío
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        pais: "México",
        calle: "",
        apartamento: "",
        ciudad: "",
        estado: "",
        cp: "",
    });

    // Datos de tarjeta (Nunca se guardan en DB, solo se pasan a Etomin)
    const [card, setCard] = useState({
        number: "",
        name: "",
        month: "",
        year: "",
        cvv: "",
    });

    const total = cart.reduce((acc, item) => acc + item.price * (item.personas || 1), 0);

    const isFormValid =
        form.nombre &&
        form.email.includes("@") &&
        form.calle &&
        form.ciudad &&
        form.estado &&
        form.cp &&
        form.telefono &&
        form.pais;

    const canCheckout =
        isFormValid &&
        card.cvv &&
        card.name &&
        card.month &&
        card.year &&
        card.number.length >= 15 && card.cvv.length >= 3 &&
        cart.length > 0 &&
        cart.every(item => item.fecha && item.personas);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            if (!canCheckout) throw Error("Por favor completa todos los datos obligatorios.");

            // CONCATENACIÓN ORDENADA: Aquí unimos todo en el campo 'direccion'
            const direccionCompleta = `
                ${form.calle} 
                ${form.apartamento ? `, Apt/Int: ${form.apartamento}` : ""} 
                , ${form.ciudad}, ${form.estado}
                , ${form.pais}
            `.replace(/\s+/g, ' ').trim();

            const dataParaEnvio = {
                ...form,
                direccion: direccionCompleta // El backend recibirá la cadena ya formateada
            };

            const result = await checkout(cart, dataParaEnvio, card);

            clearCart();
            setTicket(result);
        } catch (err: any) {
            setPaymentError(err.message || "Error al procesar el pago");
        } finally {
            setLoading(false);
        }
    };

       if (cart.length === 0 && !ticket && !paymentError) {
        return <EmptyCart />
    }

    return (
        <>
            <Header />
            
            
            {/* MODAL DE ERROR (BLUR + RED STYLE) */}
            {paymentError && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-2xl text-center border-t-8 border-red-500 animate-in zoom-in duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black uppercase  tracking-tighter text-gray-900 mb-2">Error en el pago</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {paymentError}
                        </p>
                        <button 
                            onClick={() => setPaymentError(null)} 
                            className="w-full py-4 bg-red-500 text-white rounded-lg font-black  uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}
            
            {/* MODAL DE ÉXITO ESTILO "LUXURY RECEIPT" */}
            {ticket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-2">¡Confirmado!</h2>
                        <p className="text-gray-500 mb-8 font-light">Tu aventura en México comienza ahora. Hemos enviado los detalles a <span className="text-black font-medium">{form.email}</span></p>

                        <div className="text-left bg-gray-50 rounded-3xl p-6 mb-8 space-y-4 border border-gray-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-bottom pb-2 border-gray-200">Resumen de reserva</p>
                            {ticket.map((res, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-tight leading-none">{res.activity_title}</p>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                                        Folio: {res.id.split('-')[0].toUpperCase()} • {res.personas} PAX
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => window.location.href = "/"}
                            className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-gray-900 transition active:scale-95"
                        >
                            Finalizar
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mt-24 mx-auto p-6 grid lg:grid-cols-12 gap-16">

                {/* LADO IZQUIERDO: REVISIÓN DE SELECCIÓN (7 COLUMNAS) */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-baseline justify-between border-b border-gray-100 pb-6">
                        <h1 className="text-4xl font-bold tracking-tighter">Bolsa de Viaje</h1>
                        <span className="text-sm text-gray-400 uppercase tracking-widest">{cart.length} Artículos</span>
                    </div>

                    <div className="space-y-6">
                        {cart.map(item => (
                            <div key={item.experienceId} className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-black transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight uppercase">{item.title}</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">ID: {item.experienceId}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.experienceId)}
                                        className="text-gray-300 hover:text-black transition-colors"
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Quitar</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha seleccionada</label>
                                        <input
                                            type="date"
                                            value={item.fecha || ""}
                                            onChange={e => updateItem(item.experienceId, { fecha: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Número de viajeros</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.personas || 1}
                                            onChange={e => updateItem(item.experienceId, { personas: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                                    <p className="font-black text-2xl tracking-tighter">${(item.price * (item.personas || 1)).toLocaleString()} <small className="text-[10px] font-medium text-gray-400 uppercase">MXN</small></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOTAL BAR ESTILO ZARA */}
                    <div className="p-10 bg-black rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl">
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold opacity-60 uppercase tracking-[0.3em]">Total estimado</span>
                            <span className="text-4xl font-black tracking-tighter">${total.toLocaleString()} <small className="text-xs font-light">MXN</small></span>
                        </div>
                        <div className="hidden md:block">
                            <ShieldCheck className="opacity-20 w-12 h-12" />
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: CHECKOUT (5 COLUMNAS) */}
                <div className="lg:col-span-5 space-y-8">

                    {/* DATOS DE ENVÍO/FACTURACIÓN (Mantiene el estilo previo) */}
                    {/* 1. INFORMACIÓN DEL CLIENTE & FACTURACIÓN */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 bg-black rounded-full"></div> 1. Detalles de Facturación
                        </h2>

                        <div className="space-y-4">
                            {/* Nombre y Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nombre completo" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                                <input type="email" placeholder="Email de contacto" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>

                            {/* Teléfono y País */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="tel" placeholder="Teléfono" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                                <div className="relative">
                                    <select className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black appearance-none cursor-pointer" value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })}>
                                        <option value="México">México</option>
                                        <option value="USA">USA</option>
                                        <option value="España">España</option>
                                        <option value="Canadá">Canadá</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[10px]">▼</div>
                                </div>
                            </div>

                            {/* Dirección Principal (Calle y Número) */}
                            <input
                                type="text"
                                placeholder="Dirección (Calle y número exterior/interior)"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black"
                                value={form.calle}
                                onChange={e => setForm({ ...form, calle: e.target.value })}
                            />

                            {/* Información Adicional */}
                            <input
                                type="text"
                                placeholder="Apartamento, suite, unidad, etc. (Opcional)"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black italic"
                                value={form.apartamento}
                                onChange={e => setForm({ ...form, apartamento: e.target.value })}
                            />

                            {/* Ciudad, Estado y CP */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Ciudad" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                                <input type="text" placeholder="Estado" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} />
                                <input type="text" placeholder="C.P." className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.cp} onChange={e => setForm({ ...form, cp: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* DATOS DE PAGO - AHORA CON LOGOS ESPECÍFICOS */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">

                        {/* Cabecera de Pago con Logo Etomin */}
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div> 2. Método de Pago
                            </h2>
                            {/* Logo Oficial Etomin en B&N */}
                            <Image
                                src={etominLogo}
                                alt="Etomin Payment Gateway"
                                width={80}
                                height={28}
                                className="object-contain opacity-90"
                            />
                        </div>

                        {/* Inputs de Tarjeta */}
                        <div className="space-y-4 relative z-10">
                            <input type="text" placeholder="Titular de la tarjeta" className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-black transition-all" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
                            <input type="text" placeholder="Número de tarjeta" maxLength={16} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-black transition-all" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />

                            <div className="grid grid-cols-3 gap-3">
                                <input type="text" placeholder="MM" maxLength={2} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.month} onChange={e => setCard({ ...card, month: e.target.value })} />
                                <input type="text" placeholder="AA" maxLength={2} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.year} onChange={e => setCard({ ...card, year: e.target.value })} />
                                <input type="password" placeholder="CVV" maxLength={4} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
                            </div>
                        </div>

                        {/* Botón y Footer con Logo Secure Payment */}
                        <div className="mt-10 pt-10 border-t border-gray-50 text-center">
                            <button
                                onClick={handleCheckout}
                                disabled={loading || !canCheckout}
                                className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase text-sm tracking-[0.3em] hover:bg-gray-800 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 shadow-2xl shadow-gray-200"
                            >
                                {loading ? "Procesando..." : `Confirmar Reserva`}
                            </button>

                            {/* Logo Oficial Secure Payment y Texto Legal */}
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <Image
                                    src={securePaymentLogo}
                                    alt="Secure Payment Certified"
                                    width={140}
                                    height={40}
                                    className="object-contain opacity-70"
                                />
                                <p className="text-[9px] text-gray-300 uppercase tracking-widest leading-relaxed max-w-[280px]">
                                    Tus pagos se procesan de forma segura <br /> bajo estándares PCI-DSS de 256 bits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}