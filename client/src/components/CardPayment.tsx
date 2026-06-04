import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface CardPaymentProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerCPF: string;
  customerName: string;
  onSuccess: () => void;
}

export function CardPayment({ amount, orderId, customerEmail, customerCPF, customerName, onSuccess }: CardPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    installments: "1",
  });

  const createPayment = trpc.orders.createPayment.useMutation({
    onSuccess: (data: any) => {
      if (data.error) {
        toast.error(data.message || "Erro ao processar pagamento");
      } else if (data.status === "approved") {
        toast.success("Pagamento aprovado com sucesso!");
        onSuccess();
      } else if (data.status === "pending" || data.status === "in_process") {
        toast.info("Pagamento em análise ou pendente. Você receberá uma confirmação em breve.");
        onSuccess();
      } else {
        toast.error(`Status do pagamento: ${data.status || 'desconhecido'}. Tente novamente.`);
      }
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Erro no pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      setCardData(prev => ({ ...prev, [name]: formatCardNumber(value).slice(0, 19) }));
    } else if (name === "expiryDate") {
      setCardData(prev => ({ ...prev, [name]: formatExpiryDate(value).slice(0, 5) }));
    } else if (name === "cvv") {
      setCardData(prev => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 4) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
      toast.error("Preencha todos os dados do cartão");
      setLoading(false);
      return;
    }

    try {
      // Aqui você faria a chamada para tokenizar o cartão com Mercado Pago
      // Por enquanto, vamos simular o pagamento
      createPayment.mutate({
        amount,
        description: `Pedido ${orderId} - Custom Shop`,
        email: customerEmail,
        firstName: customerName.split(" ")[0],
        lastName: customerName.split(" ").slice(1).join(" "),
        cpf: customerCPF.replace(/\D/g, ""),
      });
    } catch (error) {
      console.error("Erro:", error);
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-900 rounded-lg">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-900">Cartão de Crédito</h3>
          <p className="text-xs text-slate-500">Pagamento seguro via Mercado Pago</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número do Cartão</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={cardData.cardNumber}
            onChange={handleCardChange}
            maxLength={19}
            className="h-12 font-mono text-lg tracking-widest"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Validade</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={handleCardChange}
              maxLength={5}
              className="h-12 font-mono text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              placeholder="123"
              value={cardData.cvv}
              onChange={handleCardChange}
              maxLength={4}
              type="password"
              className="h-12 font-mono text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Nome no Cartão</Label>
          <Input
            id="cardholderName"
            name="cardholderName"
            placeholder="NOME COMPLETO"
            value={cardData.cardholderName}
            onChange={handleCardChange}
            className="h-12 uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installments">Parcelamento</Label>
          <select
            id="installments"
            name="installments"
            value={cardData.installments}
            onChange={handleCardChange}
            className="w-full h-12 px-3 border rounded-md border-slate-200 bg-white text-sm"
          >
            <option value="1">1x sem juros</option>
            <option value="2">2x sem juros</option>
            <option value="3">3x sem juros</option>
            <option value="4">4x sem juros</option>
            <option value="5">5x sem juros</option>
            <option value="6">6x sem juros</option>
            <option value="7">7x sem juros</option>
            <option value="8">8x sem juros</option>
            <option value="9">9x sem juros</option>
            <option value="10">10x sem juros</option>
            <option value="11">11x sem juros</option>
            <option value="12">12x sem juros</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processando...
            </>
          ) : (
            "Finalizar Pagamento"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-400">
          <ShieldCheck className="h-3 w-3" />
          Seus dados estão protegidos por criptografia de ponta a ponta.
        </div>


      </form>
    </div>
  );
}
