// Credenciais do Mercado Pago - Produção
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-75899114462674-053112-4ec2dd26ba31c276fe6aae055234158d-746685437';
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || 'APP_USR-5a64239c-6718-4d20-9654-93d3eae30dc6';

export const mercadoPagoPublicKey = MP_PUBLIC_KEY;

export async function createPixPayment(data: any) {
  try {
    // Validar dados obrigatórios
    if (!data.transaction_amount || !data.payer?.email || !data.payer?.identification?.number) {
      return { 
        error: true, 
        message: "Dados incompletos para gerar pagamento PIX" 
      };
    }

    const body = {
      transaction_amount: Number(data.transaction_amount.toFixed(2)),
      description: (data.description || 'Pedido Custom Shop').substring(0, 60),
      payment_method_id: 'pix',
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name || 'Cliente',
        last_name: data.payer.last_name || 'Custom Shop',
        identification: {
          type: 'CPF',
          number: data.payer.identification.number.replace(/\D/g, '')
        }
      }
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pix-${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify(body)
    });

    let result;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      return { 
        error: true, 
        message: "Erro ao processar pagamento. Tente novamente.",
        details: text 
      };
    }

    if (!response.ok) {
      const errorMsg = result.message || 
                       (result.cause && result.cause[0]?.description) || 
                       'Erro no processamento do pagamento';
      return { 
        error: true, 
        message: errorMsg, 
        details: result 
      };
    }

    // Sucesso - retornar dados do pagamento
    return {
      error: false,
      id: result.id,
      status: result.status,
      point_of_interaction: result.point_of_interaction,
      transaction_details: result.transaction_details
    };
  } catch (error: any) {
    return { 
      error: true, 
      message: "Erro ao conectar com o servidor de pagamento. Tente novamente.",
      details: error.message 
    };
  }
}

export async function createCardPayment(data: any) {
  try {
    // Validar dados obrigatórios
    if (!data.transaction_amount || !data.payer?.email) {
      return { 
        error: true, 
        message: "Dados incompletos para gerar pagamento" 
      };
    }

    const body = {
      transaction_amount: Number(data.transaction_amount.toFixed(2)),
      description: (data.description || 'Pedido Custom Shop').substring(0, 60),
      payment_method_id: data.payment_method_id || 'visa',
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name || 'Cliente',
        last_name: data.payer.last_name || 'Custom Shop',
        identification: {
          type: 'CPF',
          number: data.payer.identification?.number?.replace(/\D/g, '') || ''
        }
      },
      installments: data.installments || 1,
      token: data.token
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `card-${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify(body)
    });

    let result;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      return { 
        error: true, 
        message: "Erro ao processar pagamento. Tente novamente.",
        details: text 
      };
    }

    if (!response.ok) {
      const errorMsg = result.message || 
                       (result.cause && result.cause[0]?.description) || 
                       'Erro no processamento do pagamento';
      return { 
        error: true, 
        message: errorMsg, 
        details: result 
      };
    }

    return {
      error: false,
      id: result.id,
      status: result.status
    };
  } catch (error: any) {
    return { 
      error: true, 
      message: "Erro ao conectar com o servidor de pagamento. Tente novamente.",
      details: error.message 
    };
  }
}
