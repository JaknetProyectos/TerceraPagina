'use server';

import axios from 'axios';

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

// URL base actualizada para Octano
const OCTANO_BASE_URL = 'https://pagos.octanopayments.com/api/v1';

export async function processEtominPayment(payment: PaymentData) {
    try {
        // 1. Obtener Token JWT (Signin)
        const authResponse = await axios.post(`${OCTANO_BASE_URL}/signin`, {
            email: process.env.OCTANO_USER,
            password: process.env.OCTANO_PASSWORD
        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        });

        const authToken = authResponse.data.authToken;

        if (!authToken) {
            throw new Error("No se pudo obtener el token de Octano");
        }

        // Helper para headers recurrentes
        const config = {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        };

        // 2. Tokenizar Tarjeta
        const tokenResponse = await axios.post(`${OCTANO_BASE_URL}/card/tokenizer`, {
            cardData: {
                cardNumber: payment.cardData.number.replace(/\s/g, ''),
                cardholderName: payment.cardData.name,
                expirationYear: payment.cardData.year,
                expirationMonth: payment.cardData.month
            }
        }, config);

        const cardToken = tokenResponse.data.cardNumberToken;

        // 3. Realizar el Pago (Sale)
        const saleResponse = await axios.post(`${OCTANO_BASE_URL}/sale`, {
            amount: payment.amount,
            currency: '484', // Pesos Mexicanos
            reference: payment.orderId,
            customerInformation: {
                firstName: payment.customer.nombre.split(' ')[0],
                lastName: payment.customer.nombre.split(' ').slice(1).join(' ') || 'N/A',
                email: payment.customer.email,
                phone1: payment.customer.telefono,
                city: 'Ciudad de México', // Puedes parametrizar esto si lo necesitas
                address1: payment.customer.direccion,
                postalCode: payment.customer.cp,
                state: 'Ciudad de México',
                country: 'MX',
                ip: '127.0.0.1' // Idealmente capturar la IP real del cliente
            },
            cardData: {
                cardNumberToken: cardToken,
                cvv: payment.cardData.cvv
            }
        }, config);

        // Retornamos la data exitosa (orderId, reference, status, etc.)
        return saleResponse.data;

    } catch (error: any) {
        // Log detallado para depuración
        const errorDetail = error.response?.data || error.message;
        console.error("❌ Error en pasarela Octano:", errorDetail);

        // Lanzamos un error amigable para el frontend
        throw new Error(
            error.response?.data?.message || 
            "Hubo un problema al procesar la transacción con Octano."
        );
    }
}