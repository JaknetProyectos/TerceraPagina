'use server';
import etomin from '@api/etomin';

interface PaymentData {
    amount: number;
    cardData: {
        number: string;
        name: string;
        month: string;
        year: string;
        cvv: string;
    };
    customer: {
        nombre: string;
        email: string;
        telefono: string;
        direccion: string;
        cp: string;
    };
    orderId: string;
}

export async function processEtominPayment(payment: PaymentData) {
    try {
        // 1. Autenticación con Etomin (Credenciales desde .env)
        const authResponse = await etomin.postSignin({
            email: process.env.ETOMIN_USER,
            password: process.env.ETOMIN_PASSWORD
        });

        const token = authResponse.data.authToken;

        if (!token) throw new Error("Error al autenticarse con Etomin");

        etomin.auth(token);

        // 2. Tokenizar la tarjeta
        const tokenResponse = await etomin.postCardTokenizer({
            cardData: {
                cardNumber: payment.cardData.number.replace(/\s/g, ''), // Limpiar espacios
                cardholderName: payment.cardData.name,
                expirationYear: payment.cardData.year,
                expirationMonth: payment.cardData.month
            }
        });

        const cardToken = tokenResponse.data.cardNumberToken;

        // 3. Realizar la Venta (Sale)
        // El código de moneda '484' es para Pesos Mexicanos (MXN)
        const saleResponse = await etomin.postSale({
            amount: payment.amount,
            customerInformation: {
                firstName: payment.customer.nombre.split(' ')[0],
                lastName: payment.customer.nombre.split(' ').slice(1).join(' ') || 'N/A',
                middleName: '',
                email: payment.customer.email,
                phone1: payment.customer.telefono,
                city: 'Ciudad de México',
                address1: payment.customer.direccion,
                postalCode: payment.customer.cp,
                state: 'CDMX',
                country: 'MX',
                ip: '0.0.0.0' // En producción, captura la IP real del cliente
            },
            cardData: {
                cardNumberToken: cardToken,
                cvv: payment.cardData.cvv
            },
            currency: '484',
            reference: payment.orderId
        });

        // Retornamos la data si el status es aprobado (usualmente 'APPROVED' o '00')
        return saleResponse.data;

    } catch (error: any) {
        console.error("❌ Error en pasarela Etomin:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al procesar el pago");
    }
}