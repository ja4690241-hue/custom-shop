import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";

interface PixPaymentProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
}

export function PixPayment({ amount, orderId, customerName, customerEmail }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(true);

  // PIX key simulada (em produção, seria gerada pelo backend)
  const pixKey = "12345678901234567890123456789012";
  
  // QR Code simulado (em produção, seria gerado pelo backend com a biblioteca qrcode)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126580014br.gov.bcb.brcode0136${pixKey}520400005303986540510.005802BR5913${customerName.substring(0, 13)}6009SAO PAULO62410503***63041D3D`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <QrCode className="h-6 w-6 text-blue-600" />
          Pagar com PIX
        </h3>

        <div className="grid gap-8 md:grid-cols-2">
          {/* QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-xl border-2 border-blue-200 bg-white p-4">
              <img 
                src={qrCodeUrl} 
                alt="QR Code PIX" 
                className="h-64 w-64 object-contain"
              />
            </div>
            <p className="mt-4 text-sm text-slate-600 text-center">
              Escaneie o QR Code com seu banco
            </p>
          </div>

          {/* Dados do PIX */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor a pagar
              </label>
              <div className="text-4xl font-black text-blue-600">
                R$ {amount.toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chave PIX (Copia e Cola)
              </label>
              <div className="flex gap-2">
                <Input
                  value={pixKey}
                  readOnly
                  className="font-mono text-sm border-slate-300 bg-slate-50"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-slate-700">
              <p className="font-semibold mb-2">📋 Instruções:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Abra seu banco ou app de pagamento</li>
                <li>Escolha a opção "PIX"</li>
                <li>Escaneie o QR Code ou copie a chave</li>
                <li>Confirme o pagamento</li>
                <li>Seu pedido será confirmado automaticamente</li>
              </ol>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
              <p className="font-semibold">✓ Pagamento seguro</p>
              <p>Seus dados são criptografados e protegidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Pedido */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Dados do Pedido</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Número do Pedido:</span>
            <span className="font-mono font-semibold text-slate-900">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Nome:</span>
            <span className="font-semibold text-slate-900">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">E-mail:</span>
            <span className="font-semibold text-slate-900">{customerEmail}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200">
            <span className="font-semibold text-slate-900">Valor Total:</span>
            <span className="text-lg font-black text-blue-600">R$ {amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Aviso de Confirmação */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">⏱️ Tempo para confirmar</p>
        <p>O pagamento deve ser confirmado em até 30 minutos. Após isso, o pedido será cancelado automaticamente.</p>
      </div>
    </div>
  );
}
