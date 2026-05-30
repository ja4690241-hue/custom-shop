import { MercadoPagoConfig, Payment } from 'mercadopago';

// O Access Token deve ser configurado nas variáveis de ambiente do Vercel
// Por enquanto, usaremos uma variável ou um valor vazio para evitar erros
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';

const client = new MercadoPagoConfig({ 
  accessToken: MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const payment = new Payment(client);

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
    if (!MP_ACCESS_TOKEN) {
      console.warn('Mercado Pago Access Token não configurado. Usando modo de simulação.');
      return {
        id: 'simulated_' + Date.now(),
        status: 'pending',
        point_of_interaction: {
          transaction_data: {
            qr_code: '00020126580014br.gov.bcb.brcode013665712a38bc93cb5326d64d23fa2d5204000053039865405' + data.transaction_amount.toFixed(2) + '5802BR5913CUSTOM%20SHOP6009SAO%20PAULO62410503***63041D3D',
            qr_code_base64: '', // O frontend pode gerar a partir do texto
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
