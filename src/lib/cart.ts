import { CartItem } from "@/interfaces/CartItem";
import { saveReservation } from "./reservations";
import { sendConfirmationEmail } from "./email";
import { PaymentData, processKeycopPayment } from "./payment";
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

export async function checkout(
    cart: CartItem[],
    paymentData: PaymentData,
    locale: any
) {
    if (!cart.length) {
        throw new Error("Carrito vacío");
    }

    /**
     * VALIDACIÓN DEL CARRITO
     */
    for (const item of cart) {
        if (!item.fecha || !item.personas) {
            throw new Error("Faltan datos en el carrito");
        }
    }

    /**
     * VALIDACIÓN DE PAYMENT DATA
     */
    if (!paymentData) {
        throw new Error("Payment data requerido");
    }

    const {
        amount,
        orderId: providedOrderId,
        cardData,
        customer,
        metadata,
    } = paymentData;

    if (!cardData) {
        throw new Error("Datos de tarjeta requeridos");
    }

    if (!customer) {
        throw new Error("Datos del cliente requeridos");
    }

    /**
     * TOTAL DEL CARRITO
     */
    const cartTotal = cart.reduce((acc, item) => {
        return acc + Number(item.price || 0);
    }, 0);

    /**
     * VALIDAR TOTAL
     */
    if (Number(amount) !== Number(cartTotal)) {
        throw new Error("El monto no coincide con el total del carrito");
    }

    /**
     * ORDER ID
     */
    const orderId =
        providedOrderId?.trim() ||
        `VMT-${Date.now().toString().slice(-6)}`;

    const results: Reservation[] = [];

    /**
        * GUARDAR RESERVACIONES
        */
    for (const item of cart) {
        const reservation = await saveReservation({
            activityTitle: item.title,
            destinationName: item.destinationName,
            fecha: item.fecha,
            personas: item.personas,

            nombre: customer.nombre,
            apellido: customer.apellido,
            email: customer.email,
            telefono: customer.telefono,

            direccion: customer.direccion,
            direccion2: customer.direccion2,
            ciudad: customer.ciudad,
            estado: customer.estado,
            pais: customer.pais,
            cp: customer.cp,
            empresa: customer.empresa,

            price: item.price,
            orderId,
        });

        results.push(reservation);
    }

    /**
     * SUBTOTAL
     */
    const subtotal = results.reduce((acc, curr) => {
        const parsedPrice =
            typeof curr.price === "string"
                ? Number(curr.price.replace(/[^0-9.-]+/g, ""))
                : Number(curr.price);

        return acc + parsedPrice;
    }, 0);

    /**
     * PROCESAR PAGO
     */
    const paymentResult = await processKeycopPayment({
        amount: subtotal,
        orderId,

        cardData: {
            number: cardData.number,
            name: cardData.name,
            month: cardData.month,
            year: cardData.year,
            cvv: cardData.cvv,
        },

        customer: {
            nombre: customer.nombre,
            apellido: customer.apellido,
            email: customer.email,
            telefono: customer.telefono,

            direccion: customer.direccion,
            direccion2: customer.direccion2,

            ciudad: customer.ciudad,
            estado: customer.estado,
            pais: customer.pais,

            cp: customer.cp,
            empresa: customer.empresa,
        },

        metadata: {
            ip: metadata?.ip,
            deviceId: metadata?.deviceId,
            notes: metadata?.notes,
        },
    });

    console.log(paymentResult)

    /**
     * VALIDAR RESPUESTA DE PAGO
     */
    if (!paymentResult?.success) {
        throw new Error(
            "No se pudo procesar el pago"
        );
    }

    /**
     * CHECKOUT INFO
     */
    const checkoutInfo = {
        orderId,

        orderDate: new Intl.DateTimeFormat("es-MX", {
            dateStyle: "long",
        }).format(new Date()),

        subtotal: subtotal.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
        }),

        metodoPago: "Tarjeta de crédito o débito",

        billingAddress: {
            nombre: `${customer.nombre} ${customer.apellido}`,

            calle: customer.direccion || "No especificada",

            direccion2: customer.direccion2 || "",

            ciudad: customer.ciudad || "Ciudad de México",

            estado: customer.estado || "",

            pais: customer.pais || "México",

            codigoPostal: customer.cp || "00000",

            telefono: customer.telefono,

            email: customer.email,

            empresa: customer.empresa || "",
        },
    };

    /**
     * EMAIL DE CONFIRMACIÓN
     */
    await sendConfirmationEmail(
        results,
        checkoutInfo,
        locale
    );

    return {
        success: true,

        orderId,

        amount: subtotal,

        payment: paymentResult,

        reservations: results,

        checkoutInfo,
    };
}

export function notifySuccess() {
    alert("✅ Reserva confirmada. Te contactaremos pronto.");
}