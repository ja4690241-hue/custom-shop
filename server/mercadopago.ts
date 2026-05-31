import { MercadoPagoConfig, Payment } from 'mercadopago';

// Credenciais do Mercado Pago
// Public Key: APP_USR-5a64239c-6718-4d20-9654-93d3eae30dc6
// Client ID: 75899114462674
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-75899114462674-053112-4ec2dd26ba31c276fe6aae055234158d-746685437';
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || 'APP_USR-5a64239c-6718-4d20-9654-93d3eae30dc6';

const client = new MercadoPagoConfig({ 
  accessToken: MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const payment = new Payment(client);

export const mercadoPagoPublicKey = MP_PUBLIC_KEY;

export async function createPixPayment(data: {
  transaction_amount: number;
  description: string;
  payer: {
    email: string;
    first_name: string;
    last_name: string;
    identification?: {
      type: string;
      number: string;
    }
  }
}) {
  try {
    if (!MP_ACCESS_TOKEN || MP_ACCESS_TOKEN === '') {
      console.warn('Mercado Pago Access Token não configurado. Usando modo de simulação.');
      // Payload PIX estático válido para testes visuais (não funciona em bancos reais)
      const amountStr = data.transaction_amount.toFixed(2);
      const amountLen = amountStr.length.toString().padStart(2, '0');
      const simulatedPix = `00020126580014br.gov.bcb.brcode013665712a38bc93cb5326d64d23fa2d520400005303986${amountLen}${amountStr}5802BR5913CUSTOM%20SHOP6009SAO%20PAULO62410503***63041D3D`;
      
      return {
        id: 'simulated_' + Date.now(),
        status: 'pending',
        point_of_interaction: {
          transaction_data: {
            qr_code: simulatedPix,
            qr_code_base64: '',
            ticket_url: '#'
          }
        }
      };
    }

    const result = await payment.create({
      body: {
        transaction_amount: data.transaction_amount,
        description: data.description,
        payment_method_id: 'pix',
        payer: data.payer,
      }
    });

    return result;
  } catch (error) {
    console.error('Erro ao criar pagamento no Mercado Pago:', error);
    throw error;
  }
}
