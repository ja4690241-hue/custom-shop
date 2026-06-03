// import { MercadoPagoConfig, Payment } from 'mercadopago';

// Credenciais do Mercado Pago
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-75899114462674-053112-4ec2dd26ba31c276fe6aae055234158d-746685437';
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || 'APP_USR-5a64239c-6718-4d20-9654-93d3eae30dc6';
const MP_CLIENT_ID = process.env.MP_CLIENT_ID || '75899114462674';
const MP_CLIENT_SECRET = process.env.MP_CLIENT_SECRET || 'qdTPIjPLP6jEq4cGn0cGJ1gPkEqh2Dkj';

// const client = new MercadoPagoConfig({ 
//   accessToken: MP_ACCESS_TOKEN,
//   options: { timeout: 10000 } // Aumentado para 10s para evitar timeouts
// });

// const payment = new Payment(client);

export const mercadoPagoPublicKey = MP_PUBLIC_KEY;
export const mercadoPagoClientId = MP_CLIENT_ID;

export async function createPixPayment(data: any) {
  try {
    const body = {
      transaction_amount: Number(data.transaction_amount.toFixed(2)),
      description: data.description.substring(0, 60),
      payment_method_id: 'pix',
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name || 'Cliente',
        last_name: data.payer.last_name || 'Custom Shop',
        identification: {
          type: 'CPF',
          number: data.payer.identification?.number.replace(/\D/g, '') || '00000000000'
        }
      }
    };
    
    console.log(">>> MP Request Body:", JSON.stringify(body, null, 2));
    
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pix-${Date.now()}`
      },
      body: JSON.stringify(body)
    });

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      return { error: true, message: "Resposta inválida do servidor de pagamento", details: text };
    }

    if (!response.ok) {
      console.error(">>> MP Error Response:", JSON.stringify(result, null, 2));
      const errorMsg = result.message || (result.cause && result.cause[0]?.description) || 'Erro no processamento do pagamento';
      return { error: true, message: errorMsg, details: result };
    }

    return result;
  } catch (error: any) {
    return { error: true, message: error.message || 'Erro Interno' };
  }
}
