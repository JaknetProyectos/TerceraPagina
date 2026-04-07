import { CartItem } from "@/interfaces/CartItem";
import { saveReservation } from "./reservations";
import { sendConfirmationEmail } from "./email";
import { processEtominPayment } from "./payment";
import { Reservation } from "@/interfaces/Reservations";

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

        await sendConfirmationEmail(reservation)

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

export async function checkout(cart: CartItem[], userData: any, cardData: any,locale: any) {
    if (!cart.length) throw new Error("Carrito vacío");

    for (const item of cart) {
        if (!item.fecha || !item.personas) {
            throw new Error("Faltan datos en el carrito");
        }
    }

    const totalAmount = cart.reduce((acc, item) => {
        const price = item.price;
        return acc + price;
    }, 0);

    const orderId = `VMT-${Date.now().toString().slice(-6)}`;



    const results: Reservation[] = [];

    // Guardamos todas en la DB primero
    for (const item of cart) {
        console.log({ item })
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

    // 🎫 Generamos la información del Ticket
    const subtotal = results.reduce((acc, curr) => acc + Number(curr.price.replace(/[^0-9.-]+/g, "")), 0);

    // 💰 Simulación de pago
    const paymentResult = await processEtominPayment({
        amount: subtotal,
        cardData: cardData, // Viene del formulario de pago
        customer: {
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            direccion: userData.direccion,
            cp: userData.cp
        },
        orderId: orderId
    });

    const checkoutInfo = {
        orderId: orderId,
        orderDate: new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date()),
        subtotal: subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
        metodoPago: "Tarjeta de crédito o débito",
        billingAddress: {
            nombre: userData.nombre,
            calle: userData.direccion || "No especificada",
            ciudad: userData.ciudad || "Ciudad de México",
            codigoPostal: userData.cp || "00000",
            telefono: userData.telefono,
            email: userData.email
        }
    };

    console.log({ checkoutInfo })
    console.log({ results })

    // 🔥 ENVIAR UN SOLO EMAIL CON TODO EL ARRAY
    await sendConfirmationEmail(results, checkoutInfo,locale);

    return results;
}

export function notifySuccess() {
    alert("✅ Reserva confirmada. Te contactaremos pronto.");
}