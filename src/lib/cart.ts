import { CartItem } from "@/interfaces/CartItem";
import { saveReservation } from "./reservations";

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];

    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

export function addToCart(item: CartItem) {
    const cart = getCart();

    // evitar duplicados (opcional pero recomendado)
    const exists = cart.find(i => i.experienceId === item.experienceId);

    if (exists) {
        return; // o podrías actualizar cantidad
    }

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
    localStorage.removeItem("cart");
}

export function removeFromCart(id: string) {
    const cart = getCart().filter(item => item.experienceId !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
}

export async function confirmCart(userData: any) {
    const cart = getCart();

    const results = [];

    for (const item of cart) {
        const reservation = await saveReservation({
            activityTitle: item.title,
            destinationName: item.destinationName,
            fecha: item.fecha || userData.fecha,
            personas: item.personas || userData.personas,
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            price: item.price,
            comentarios: userData.comentarios,
        });

        results.push(reservation);
    }

    clearCart();

    return results;
}

export async function fakePayment() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ status: "paid" });
        }, 2000);
    });
}

export async function checkout(cart: CartItem[], userData: any) {
    if (!cart.length) throw new Error("Carrito vacío");

    for (const item of cart) {
        if (!item.fecha || !item.personas) {
            throw new Error("Faltan datos en el carrito");
        }
    }

    // 💰 pago fake
    await new Promise(res => setTimeout(res, 1500));

    const results = [];

    for (const item of cart) {
        const reservation = await saveReservation({
            activityTitle: item.title,
            destinationName: item.destinationName,
            fecha: item.fecha,
            personas: item.personas,
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            price: item.price,
        });

        results.push(reservation);
    }

    return results;
}

export function notifySuccess() {
    alert("✅ Reserva confirmada. Te contactaremos pronto.");
}