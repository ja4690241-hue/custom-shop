import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Copy, Check, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/shop";

interface PixPaymentProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  onPaymentConfirmed?: () => void;
}

export function PixPayment({ amount, orderId, customerName, customerEmail, onPaymentConfirmed }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Dados bancários reais do usuário
  const bankData = {
    bank: "Nu Pagamentos S.A.",
    agency: "0001",
    account: "68014024-6"
  };

  // Simulação de payload PIX (Copia e Cola) - Idealmente seria uma chave PIX real
  const pixKey = "00020126580014br.gov.bcb.brcode013665712a38bc93cb5326d64d23fa2d5204000053039865405" + amount.toFixed(2) + "5802BR5913CUSTOM%20SHOP6009SAO%20PAULO62410503***63041D3D";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixKey)}`;

  const copyPixPayload = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Código PIX Copia e Cola copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Pagamento via PIX</h3>
            <p className="text-xs text-slate-600">Aprovação instantânea</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full text-xs font-bold text-blue-600">
          <Clock className="h-3 w-3" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
          <img 
            src={qrCodeUrl} 
            alt="QR Code PIX" 
            className="w-48 h-48 rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/80 rounded-2xl">
            <p className="text-xs font-bold text-blue-600 text-center px-4">Escaneie com o app do seu banco</p>
          </div>
        </div>

        <div className="w-full space-y-3">
          <p className="text-sm font-bold text-slate-700 text-center">Ou use o código Copia e Cola:</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                value={pixKey} 
                readOnly 
                className="h-12 pr-10 text-xs font-mono bg-white border-slate-200 focus-visible:ring-blue-600" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                ...
              </div>
            </div>
            <Button
              type="button"
              onClick={copyPixPayload}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="w-full pt-6 border-t border-blue-100 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Pedido:</span>
            <span className="font-mono font-bold text-slate-900">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Valor a pagar:</span>
            <span className="text-xl font-black text-blue-600">{formatCurrency(amount)}</span>
          </div>
          
          <div className="rounded-xl bg-white p-4 border border-blue-100 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Dados para conferência:</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500">Banco:</span>
                <p className="font-bold text-slate-900">{bankData.bank}</p>
              </div>
              <div>
                <span className="text-slate-500">Agência:</span>
                <p className="font-bold text-slate-900">{bankData.agency}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Conta:</span>
                <p className="font-bold text-slate-900">{bankData.account}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-blue-100 text-[10px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            Pagamento processado de forma segura. Após o pagamento, seu pedido será processado automaticamente.
          </div>
        </div>
      </div>
    </div>
  );
}
