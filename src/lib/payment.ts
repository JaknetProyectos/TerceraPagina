"use server";

import etomin from "@api/etomin";

export interface PaymentData {
  amount: number;
  orderId: string;

  cardData: {
    number: string;
    name: string;
    month: string;
    year: string;
    cvv: string;
  };

  customer: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    direccion2?: string;
    ciudad: string;
    estado: string;
    pais?: string;
    cp: string;
    empresa?: string;
  };

  metadata?: {
    ip?: string;
    deviceId?: string;
    notes?: string;
  };
}


export async function processEtominPayment(
  payment: PaymentData
) {
  try {
    // 1. Autenticación con Etomin
    const authResponse = await etomin.postSignin({
      email: process.env.ETOMIN_USER,
      password: process.env.ETOMIN_PASSWORD,
    });

    const token = authResponse.data?.authToken;

    if (!token) {
      throw new Error("No se pudo obtener el token de Etomin");
    }

    etomin.auth(token);

    // 2. Tokenización de tarjeta
    const tokenResponse = await etomin.postCardTokenizer({
      cardData: {
        cardNumber: payment.cardData.number.replace(/\s/g, ""),
        cardholderName: payment.cardData.name,
        expirationYear: payment.cardData.year,
        expirationMonth: payment.cardData.month,
      },
    });

    const cardToken = tokenResponse.data?.cardNumberToken;

    if (!cardToken) {
      throw new Error("No se pudo tokenizar la tarjeta");
    }

    /*
    |--------------------------------------------------------------------------
    | Customer info
    |--------------------------------------------------------------------------
    */
    const customerFirstName = payment.customer.nombre?.trim() || "N/A";
    const customerLastName = payment.customer.apellido?.trim() || "N/A";

    /*
    |--------------------------------------------------------------------------
    | Sale request
    |--------------------------------------------------------------------------
    */
    // 4. Realizar venta
    const saleResponse = await etomin.postSale({
      amount: payment.amount,
      currency: "484",
      reference: payment.orderId,
      customerInformation: {
        firstName: customerFirstName,
        lastName: customerLastName,
        middleName: "",
        email: payment.customer.email,
        phone1: payment.customer.telefono,
        city: payment.customer.ciudad,
        address1: payment.customer.direccion,
        postalCode: payment.customer.cp,
        state: payment.customer.estado,
        country: payment.customer.pais || "México",
        ip: "0.0.0.0",
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: payment.cardData.cvv,
      },
    });

    return {
      success: true,
      data: saleResponse.data,
    };
  } catch (error: any) {
    const errorDetail =
      error?.response?.data ||
      error?.message;

    console.error(
      "❌ Error en pasarela Etomin:",
      errorDetail
    );

    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Hubo un problema al procesar la transacción.",
      details: errorDetail,
    };
  }
}