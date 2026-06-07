import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateCoupon, recordCouponUse } from "@/lib/coupons";
import { Check, X, Tag } from "lucide-react";
import { toast } from "sonner";

interface CouponInputProps {
  onCouponApplied?: (discount: number, code: string) => void;
}

export function CouponInput({ onCouponApplied }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = validateCoupon(couponCode);
      
      if (result.valid && result.discount) {
        recordCouponUse(couponCode);
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: result.discount,
        });
        toast.success(`${result.discount}% de desconto aplicado!`);
        onCouponApplied?.(result.discount, couponCode.toUpperCase());
      } else {
        toast.error(result.message);
      }
      
      setLoading(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    onCouponApplied?.(0, "");
    toast.info("Cupom removido");
  };

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-slate-900">Tem um cupom?</h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-bold text-emerald-900">{appliedCoupon.code}</p>
              <p className="text-sm text-emerald-700">-{appliedCoupon.discount}% de desconto</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite o código do cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            className="flex-1 border-amber-200 focus-visible:ring-amber-600"
          />
          <Button
            type="button"
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? "..." : "Aplicar"}
          </Button>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">
        💡 Dica: Tente cupons como <strong>PRIMEIRACOMPRA</strong>, <strong>NATAL10</strong> ou <strong>VIP20</strong>
      </p>
    </div>
  );
}
