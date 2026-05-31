import { MercadoPagoConfig, Payment } from 'mercadopago';

// O Access Token deve ser configurado nas variáveis de ambiente do Vercel
// Credenciais de teste fornecidas pelo usuário
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-4045448063917433-053109-4eb41dd6fbbd589981ae529c741d7f85-746685437';

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
