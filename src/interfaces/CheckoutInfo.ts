export interface CheckoutInfo {
    orderId: string;
    orderDate: string;
    subtotal: string;
    metodoPago: string;
    billingAddress: {
        nombre: string;
        calle: string;
        ciudad: string;
        codigoPostal: string;
        telefono: string;
        email: string;
    };
}