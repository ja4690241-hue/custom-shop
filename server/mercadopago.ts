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
    // Log para verificar se o token está presente (sem mostrar o token completo por segurança)
    console.log('Iniciando criação de pagamento Pix...');
    console.log('Token configurado:', MP_ACCESS_TOKEN ? `Sim (Inicia com ${MP_ACCESS_TOKEN.substring(0, 15)}...)` : 'Não');

    // Configuração do pagamento Pix
    // O Mercado Pago exige que o transaction_amount seja um número com no máximo 2 casas decimais
    const body = {
      transaction_amount: Number(data.transaction_amount.toFixed(2)),
      description: data.description.substring(0, 60),
      payment_method_id: 'pix',
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name,
        last_name: data.payer.last_name,
        identification: {
          type: 'CPF',
          number: data.payer.identification?.number.replace(/\D/g, '') || '00000000000'
        }
      }
    };

    console.log('Enviando requisição ao Mercado Pago:', JSON.stringify({ ...body, payer: { ...body.payer, email: '***' } }));

    console.log('Enviando payload completo:', JSON.stringify(body, null, 2));

    const result = await payment.create({ body });

    console.log('Sucesso ao criar pagamento no Mercado Pago. ID:', result.id);

    return result;
  } catch (error: any) {
    console.error('ERRO CRÍTICO AO CRIAR PAGAMENTO NO MERCADO PAGO:');
    console.error('Mensagem:', error.message || error);
    if (error.cause) {
      console.error('Detalhes técnicos (cause):', JSON.stringify(error.cause, null, 2));
    }
    throw error;
  }
}
