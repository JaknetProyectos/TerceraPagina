"use client";

import { useCart } from "@/components/CartContext"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { checkout } from "@/lib/cart";
import { useState } from "react";

export default function CartPage() {
    const { cart, updateItem, removeItem, clearCart } = useCart();

    const total = cart.reduce(
        (acc, item) => acc + item.price * (item.personas || 1),
        0
    );

    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<any[] | null>(null);
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
    });

    const isFormValid =
        form.nombre.trim() &&
        form.email.includes("@") &&
        form.telefono.trim().length >= 8;

    const isCartValid = cart.every(
        item => item.fecha && item.personas
    );

    const canCheckout = isFormValid && isCartValid;

    const handleCheckout = async () => {
        try {
            setLoading(true);

            if (canCheckout) {
                const result = await checkout(cart, {
                    nombre: form.nombre,
                    email: form.email,
                    telefono: form.telefono,
                });

                clearCart();
                setTicket(result);
            } else {
                throw Error("Datos faltantes o incorrectos")
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            {ticket && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

                        <h2 className="text-xl font-semibold mb-4">
                            Confirmación de reserva
                        </h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {ticket.map((res, i) => (
                                <div
                                    key={i}
                                    className="border-b pb-3 text-sm"
                                >
                                    <p className="font-medium">Número de orden {String(res.id).toUpperCase()}</p>
                                    <p className="font-medium">{res.activity_title}</p>
                                    <p className="text-gray-500">{res.destination_name}</p>
                                    <p>Fecha: {res.fecha}</p>
                                    <p>Personas: {res.personas}</p>
                                    <p className="font-semibold mt-1">
                                        ${res.price}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setTicket(null)}
                            className="mt-6 w-full border border-black py-2 rounded-lg hover:bg-black hover:text-white transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mt-14 mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Tu carrito</h1>

                <div className="space-y-4">
                    {cart.map(item => (
                        <div
                            key={item.experienceId}
                            className="border rounded-xl p-4 flex flex-col gap-3 shadow-sm"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="font-medium">{item.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        {item.destinationName}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeItem(item.experienceId)}
                                    className="text-red-500 text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>

                            {/* Fecha */}
                            <input
                                type="date"
                                value={item.fecha || ""}
                                onChange={e =>
                                    updateItem(item.experienceId, { fecha: e.target.value })
                                }
                                className="border rounded-md p-2"
                            />

                            {/* Personas */}
                            <input
                                type="number"
                                min={1}
                                value={item.personas || 1}
                                onChange={e =>
                                    updateItem(item.experienceId, {
                                        personas: Number(e.target.value),
                                    })
                                }
                                className="border rounded-md p-2 w-24"
                            />

                            <p className="font-semibold">
                                ${(item.price * (item.personas || 1)).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="mt-8 border-t pt-4 flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-semibold">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <div className="mt-8 space-y-4">
                    <h2 className="text-lg font-semibold">Datos de contacto</h2>

                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={form.nombre}
                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                    />

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                    />

                    <input
                        type="tel"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={e => setForm({ ...form, telefono: e.target.value })}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>

                {/* Botón confirmar */}
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="mt-6 w-full bg-black text-white py-3 rounded-xl text-lg 
             hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "Confirmar reserva"}
                </button>
            </div>
            <Footer />
        </>
    );
}