import { MercadoPagoConfig, Payment } from 'mercadopago';

// Credenciais do Mercado Pago
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-75899114462674-053112-4ec2dd26ba31c276fe6aae055234158d-746685437';
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || 'APP_USR-5a64239c-6718-4d20-9654-93d3eae30dc6';

const client = new MercadoPagoConfig({ 
  accessToken: MP_ACCESS_TOKEN,
  options: { timeout: 10000 } // Aumentado para 10s para evitar timeouts
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
    // Se não houver token, retorna simulação (para desenvolvimento local sem .env)
    if (!process.env.MP_ACCESS_TOKEN && (!MP_ACCESS_TOKEN || MP_ACCESS_TOKEN.includes('YOUR_ACCESS_TOKEN'))) {
      console.warn('Mercado Pago Access Token não configurado ou inválido. Usando modo de simulação.');
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

    // Configuração do pagamento Pix
    // O Mercado Pago exige que o transaction_amount seja um número com no máximo 2 casas decimais
    const body = {
      transaction_amount: Number(data.transaction_amount.toFixed(2)),
      description: data.description.substring(0, 60), // Limite de 60 caracteres
      payment_method_id: 'pix',
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name,
        last_name: data.payer.last_name,
        // O Mercado Pago muitas vezes exige identificação (CPF/CNPJ) para PIX em produção
        ...(data.payer.identification?.number ? {
          identification: {
            type: data.payer.identification.type || 'CPF',
            number: data.payer.identification.number.replace(/\D/g, '') // Remove pontos/traços
          }
        } : {})
      },
      // Configurações adicionais para garantir validade do QR Code
      installments: 1,
      notification_url: undefined, // Pode ser configurado futuramente
    };

    console.log('Enviando requisição ao Mercado Pago:', JSON.stringify({ ...body, payer: { ...body.payer, email: '***' } }));

    const result = await payment.create({ body });

    return result;
  } catch (error: any) {
    console.error('Erro detalhado do Mercado Pago:', error.message || error);
    if (error.cause) {
      console.error('Causa do erro:', JSON.stringify(error.cause));
    }
    throw error;
  }
}
