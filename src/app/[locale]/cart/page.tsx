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
import { useLocale, useTranslations } from "next-intl";

export default function CartPage() {
    const t = useTranslations("CartPage");
    const { cart, updateItem, removeItem, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<any[] | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const locale = useLocale()

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

    // Datos de tarjeta
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
            if (!canCheckout) throw Error(t("alerts.complete_fields"));

            const direccionCompleta = `
                ${form.calle} 
                ${form.apartamento ? `, Apt/Int: ${form.apartamento}` : ""} 
                , ${form.ciudad}, ${form.estado}
                , ${form.pais}
            `.replace(/\s+/g, ' ').trim();

            const dataParaEnvio = {
                ...form,
                direccion: direccionCompleta
            };

            const result = await checkout(cart, dataParaEnvio, card,locale);

            clearCart();
            setTicket(result);
        } catch (err: any) {
            setPaymentError(err.message || t("alerts.process_error"));
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
            
            {/* MODAL DE ERROR */}
            {paymentError && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-2xl text-center border-t-8 border-red-500 animate-in zoom-in duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">{t("modals.error_title")}</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {paymentError}
                        </p>
                        <button 
                            onClick={() => setPaymentError(null)} 
                            className="w-full py-4 bg-red-500 text-white rounded-lg font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                            <X size={18} /> {t("modals.try_again")}
                        </button>
                    </div>
                </div>
            )}
            
            {/* MODAL DE ÉXITO */}
            {ticket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-2">{t("modals.success_title")}</h2>
                        <p className="text-gray-500 mb-8 font-light">
                            {t("modals.success_message")} <span className="text-black font-medium">{form.email}</span>
                        </p>

                        <div className="text-left bg-gray-50 rounded-3xl p-6 mb-8 space-y-4 border border-gray-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-bottom pb-2 border-gray-200">{t("modals.summary")}</p>
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
                            {t("modals.finish")}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mt-24 mx-auto p-6 grid lg:grid-cols-12 gap-16">

                {/* LADO IZQUIERDO: BOLSA */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-baseline justify-between border-b border-gray-100 pb-6">
                        <h1 className="text-4xl font-bold tracking-tighter">{t("cart.title")}</h1>
                        <span className="text-sm text-gray-400 uppercase tracking-widest">{cart.length} {t("cart.items")}</span>
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
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("cart.remove")}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("cart.selected_date")}</label>
                                        <input
                                            type="date"
                                            value={item.fecha || ""}
                                            onChange={e => updateItem(item.experienceId, { fecha: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("cart.travelers")}</label>
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

                    <div className="p-10 bg-black rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl">
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold opacity-60 uppercase tracking-[0.3em]">{t("cart.total_estimated")}</span>
                            <span className="text-4xl font-black tracking-tighter">${total.toLocaleString()} <small className="text-xs font-light">MXN</small></span>
                        </div>
                        <div className="hidden md:block">
                            <ShieldCheck className="opacity-20 w-12 h-12" />
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: FORMULARIOS */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <div className="w-2 h-2 bg-black rounded-full"></div> 1. {t("form.billing_details")}
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder={t("form.placeholders.name")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                                <input type="email" placeholder={t("form.placeholders.email")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="tel" placeholder={t("form.placeholders.phone")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
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

                            <input type="text" placeholder={t("form.placeholders.address")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.calle} onChange={e => setForm({ ...form, calle: e.target.value })} />
                            <input type="text" placeholder={t("form.placeholders.apartment")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black italic" value={form.apartamento} onChange={e => setForm({ ...form, apartamento: e.target.value })} />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" placeholder={t("form.placeholders.city")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                                <input type="text" placeholder={t("form.placeholders.state")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} />
                                <input type="text" placeholder={t("form.placeholders.zip")} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={form.cp} onChange={e => setForm({ ...form, cp: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div> 2. {t("payment.method")}
                            </h2>
                            <Image src={etominLogo} alt="Etomin" width={120} height={40} className="object-contain opacity-90" />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <input type="text" placeholder={t("payment.placeholders.card_name")} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-black transition-all" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
                            <input type="text" placeholder={t("payment.placeholders.card_number")} maxLength={16} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-black transition-all" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />

                            <div className="grid grid-cols-3 gap-3">
                                <input type="text" placeholder="MM" maxLength={2} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.month} onChange={e => setCard({ ...card, month: e.target.value })} />
                                <input type="text" placeholder="YY" maxLength={2} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.year} onChange={e => setCard({ ...card, year: e.target.value })} />
                                <input type="password" placeholder="CVV" maxLength={4} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-center outline-none focus:border-black" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-50 text-center">
                            <button
                                onClick={handleCheckout}
                                disabled={loading || !canCheckout}
                                className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase text-sm tracking-[0.3em] hover:bg-gray-800 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 shadow-2xl shadow-gray-200"
                            >
                                {loading ? t("payment.processing") : t("payment.confirm_booking")}
                            </button>

                            <div className="mt-8 flex flex-col items-center gap-4">
                                <Image src={securePaymentLogo} alt="Secure Payment" width={140} height={40} className="object-contain opacity-70" />
                                <p className="text-[9px] text-gray-300 uppercase tracking-widest leading-relaxed max-w-[280px]">
                                    {t("payment.security_notice")}
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